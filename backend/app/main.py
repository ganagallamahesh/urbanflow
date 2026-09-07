"""
FastAPI Server for UrbanFlow Freight Coordination Platform.
"""
from pathlib import Path
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.models.optimization import OptimizationRequest, OptimizationResponse
from app.engine.simulation import SimulationManager

app = FastAPI(
    title="UrbanFlow Freight Coordination API",
    description="Backend optimization and dynamic GIS simulation engine for urban freight flow coordination.",
    version="1.0.0",
)

# CORS setup for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory simulation manager singleton
sim_manager = SimulationManager()

frontend_dist = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"


@app.get("/api/status")
def api_status():
    return {
        "platform": "UrbanFlow",
        "description": "Urban Freight Flow Coordination & Optimization Platform (SIH Prototype)",
        "city": "Visakhapatnam (Simulated)",
        "status": "online",
        "docs": "/docs",
    }


@app.get("/")
def root():
    index_file = frontend_dist / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return api_status()



# ------------------ Fleet Endpoints ------------------

@app.get("/api/fleet/vehicles")
def get_vehicles():
    return {"vehicles": sim_manager.vehicles}


@app.get("/api/fleet/deliveries")
def get_deliveries():
    return {"deliveries": sim_manager.deliveries}


# ------------------ Infrastructure Endpoints ------------------

@app.get("/api/infrastructure/zones")
def get_loading_zones():
    return {"zones": list(sim_manager.loading_zones.values())}


@app.get("/api/infrastructure/holding")
def get_holding_area():
    return {"holding_area": sim_manager.holding_area}


# ------------------ Network Endpoints ------------------

@app.get("/api/network/nodes")
def get_nodes():
    return {"nodes": list(sim_manager.nodes.values())}


@app.get("/api/network/roads")
def get_roads():
    return {"roads": sim_manager.roads}


@app.get("/api/network/traffic")
def get_traffic():
    traffic_summary = [
        {
            "road_id": r.road_id,
            "name": r.name,
            "traffic_level": r.traffic_level,
            "incident": r.incident_description,
        }
        for r in sim_manager.roads
        if r.traffic_level > 0.4 or r.incident_description
    ]
    return {
        "congested_corridors": traffic_summary,
        "average_traffic": round(sum(r.traffic_level for r in sim_manager.roads) / len(sim_manager.roads), 2),
    }


# ------------------ Optimization Endpoints ------------------

@app.post("/api/optimize", response_model=OptimizationResponse)
def run_optimization(request: Optional[OptimizationRequest] = None):
    req = request or OptimizationRequest()
    return sim_manager.run_optimization(req)


@app.get("/api/optimization-result")
def get_last_optimization():
    if not sim_manager.last_optimization:
        sim_manager.run_optimization()
    return sim_manager.last_optimization


@app.get("/api/explain/{vehicle_id}")
def explain_route(vehicle_id: str):
    if not sim_manager.last_optimization:
        sim_manager.run_optimization()
    plan = next(
        (p for p in sim_manager.last_optimization.plans if p.vehicle_id == vehicle_id), None
    )
    if not plan:
        raise HTTPException(status_code=404, detail=f"Vehicle {vehicle_id} has no active plan.")

    # Get alternative routes for explainability
    alternatives = sim_manager.optimizer.router.get_alternative_paths_comparison(
        plan.origin_node, plan.destination_node, k=3
    )

    return {
        "vehicle_id": plan.vehicle_id,
        "vehicle_name": plan.vehicle_name,
        "delivery_title": plan.delivery_title,
        "assigned_loading_zone": plan.assigned_loading_zone_id,
        "assigned_time_slot": plan.assigned_time_slot,
        "staged_at_holding": plan.staged_at_holding,
        "reasons": plan.explanation,
        "cost_score": plan.cost_score,
        "travel_time_min": plan.travel_time_min,
        "distance_km": plan.distance_km,
        "alternative_paths_evaluated": alternatives,
    }


# ------------------ Dynamic Simulation Controls ------------------

@app.post("/api/simulate/traffic")
def simulate_traffic_increase(road_id: Optional[str] = Body(None, embed=True)):
    return sim_manager.simulate_traffic_increase(road_id)


@app.post("/api/simulate/loading-zone")
def simulate_loading_zone_full(zone_id: str = Body("LZ-03", embed=True)):
    return sim_manager.simulate_loading_zone_full(zone_id)


@app.post("/api/simulate/breakdown")
def simulate_vehicle_breakdown(vehicle_id: str = Body("T-05", embed=True)):
    return sim_manager.simulate_vehicle_breakdown(vehicle_id)


@app.post("/api/simulate/preset/traffic")
def set_traffic_preset(level: str = Body("HIGH", embed=True)):
    return sim_manager.set_traffic_preset(level)


@app.post("/api/simulate/scenario/port")
def trigger_port_scenario():
    return sim_manager.trigger_port_scenario()


@app.post("/api/simulate/reset")
def reset_simulation():
    sim_manager.reset()
    return {"status": "success", "message": "Simulation reset to baseline."}


# ------------------ Analytics & Logs ------------------

@app.get("/api/analytics")
def get_analytics():
    return sim_manager.get_analytics()


@app.get("/api/logs")
def get_logs():
    return {
        "logs": sim_manager.event_logs[:30],
        "active_incident": sim_manager.active_incident,
    }


# ------------------ Static Files & SPA Fallback ------------------

if frontend_dist.exists():
    assets_dir = frontend_dist / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Don't intercept API routes or OpenAPI documentation
        if full_path.startswith("api") or full_path in ("docs", "openapi.json", "redoc"):
            raise HTTPException(status_code=404, detail="Not Found")
        file_path = frontend_dist / full_path
        if file_path.is_file():
            return FileResponse(str(file_path))
        index_file = frontend_dist / "index.html"
        if index_file.exists():
            return FileResponse(str(index_file))
        raise HTTPException(status_code=404, detail="File Not Found")

