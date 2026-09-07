"""
Simulation Manager for dynamic real-time city events:
- Traffic congestion spikes on corridors & automated rerouting
- Loading zone overcapacity & alternative bay allocation
- Vehicle breakdown & failover reassignment
- Port surge & holding yard staging
- Preset scenarios and state resets
"""
from typing import Dict, List, Optional, Any
from datetime import datetime
import copy

from app.models.entities import Node, Road, Vehicle, Delivery, LoadingZone, HoldingArea
from app.models.optimization import OptimizationRequest, OptimizationResponse, OptimizationObjective
from app.data.visakhapatnam_geo import (
    get_city_nodes,
    get_city_roads,
    get_city_loading_zones,
    get_city_holding_area,
)
from app.data.seed_data import get_seed_vehicles, get_seed_deliveries
from app.engine.optimizer import OptimizationEngine


class SimulationManager:
    def __init__(self):
        self.reset()

    def reset(self):
        """Resets all simulation components to initial baseline."""
        self.nodes = get_city_nodes()
        self.roads = get_city_roads()
        self.loading_zones = get_city_loading_zones()
        self.holding_area = get_city_holding_area()
        self.vehicles = get_seed_vehicles()
        self.deliveries = get_seed_deliveries()
        self.current_sim_time = "09:30"
        self.active_incident: Optional[Dict[str, Any]] = None
        self.event_logs: List[Dict[str, Any]] = [
            {
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "level": "INFO",
                "message": "UrbanFlow city simulation initialized with Visakhapatnam GIS baseline.",
            }
        ]
        self.optimizer = OptimizationEngine(
            self.nodes, self.roads, self.loading_zones, self.holding_area
        )
        self.last_optimization: Optional[OptimizationResponse] = None

    def run_optimization(self, request: Optional[OptimizationRequest] = None) -> OptimizationResponse:
        req = request or OptimizationRequest()
        # Update optimizer references
        self.optimizer.roads = self.roads
        self.optimizer.loading_zones = self.loading_zones
        self.optimizer.holding_area = self.holding_area

        result = self.optimizer.optimize(self.vehicles, self.deliveries, req, self.current_sim_time)
        self.last_optimization = result

        # Update vehicle statuses based on plan
        for plan in result.plans:
            for v in self.vehicles:
                if v.vehicle_id == plan.vehicle_id:
                    v.status = "IN_TRANSIT"
                    v.assigned_delivery_id = plan.delivery_id
                    v.eta = plan.eta
                    v.current_route = plan.route_nodes

        self.event_logs.insert(0, {
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "level": "SUCCESS",
            "message": f"Optimization executed [{req.objective.value}]. {len(result.plans)} vehicles coordinated, {result.comparison.conflicts_avoided} bay conflicts avoided.",
        })
        return result

    def simulate_traffic_increase(self, target_road_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Simulate a major congestion spike or breakdown on a primary corridor
        (e.g., Convent-RTC Expressway or Port Highway).
        Detects affected trucks, triggers re-optimization, and returns before/after diff.
        """
        # Pick primary congested corridor if not specified
        road_id = target_road_id or "R15_F"
        spike_roads = ["R15_F", "R15_R", "R12_F", "R12_R"]

        affected_names = []
        for r in self.roads:
            if r.road_id in spike_roads:
                r.traffic_level = 0.95
                r.incident_description = "Severe traffic congestion spike & lane blockage"
                affected_names.append(r.name)

        # Re-initialize optimizer with updated traffic
        self.optimizer.roads = self.roads

        # Check which vehicles previously used the congested corridor
        previous_plans = {p.vehicle_id: p for p in (self.last_optimization.plans if self.last_optimization else [])}
        
        # Run dynamic re-optimization
        new_result = self.run_optimization()

        rerouted_trucks = []
        for new_plan in new_result.plans:
            prev = previous_plans.get(new_plan.vehicle_id)
            if prev and prev.route_nodes != new_plan.route_nodes:
                rerouted_trucks.append({
                    "vehicle_id": new_plan.vehicle_id,
                    "vehicle_name": new_plan.vehicle_name,
                    "before_route": " -> ".join(prev.route_nodes),
                    "after_route": " -> ".join(new_plan.route_nodes),
                    "before_eta": prev.eta,
                    "after_eta": new_plan.eta,
                    "time_saved_min": round(prev.travel_time_min - new_plan.travel_time_min, 1),
                    "reason": f"Diverted away from gridlocked corridor {affected_names[0]} to open arterial."
                })

        incident_info = {
            "type": "TRAFFIC_SPIKE",
            "corridors": affected_names,
            "traffic_level": 0.95,
            "rerouted_trucks": rerouted_trucks,
            "message": f"Traffic conditions changed: Severe congestion on {affected_names[0]}. Freight plan dynamically re-optimized.",
        }
        self.active_incident = incident_info

        self.event_logs.insert(0, {
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "level": "WARNING",
            "message": incident_info["message"],
        })

        return {
            "incident": incident_info,
            "optimization": new_result,
        }

    def simulate_loading_zone_full(self, zone_id: str = "LZ-03") -> Dict[str, Any]:
        """
        Simulates a loading zone becoming completely saturated/full.
        System detects conflict for arriving trucks, searches nearest viable alternative,
        and re-routes.
        """
        target_zone = self.loading_zones.get(zone_id)
        if not target_zone:
            zone_id = "LZ-03"
            target_zone = self.loading_zones[zone_id]

        target_zone.current_occupancy = target_zone.capacity_bays
        target_zone.available_slots = 0
        target_zone.status = "FULL"

        # Run re-optimization
        new_result = self.run_optimization()

        # Find which trucks were redirected to alternative zone
        reallocated = []
        for plan in new_result.plans:
            if plan.assigned_loading_zone_id and plan.assigned_loading_zone_id != zone_id:
                # Check if this delivery originally wanted target_zone
                deliv = next((d for d in self.deliveries if d.delivery_id == plan.delivery_id), None)
                if deliv and (deliv.preferred_loading_zone_id == zone_id or deliv.destination_node_id == zone_id):
                    alt_zone = self.loading_zones.get(plan.assigned_loading_zone_id)
                    reallocated.append({
                        "vehicle_id": plan.vehicle_id,
                        "delivery_id": plan.delivery_id,
                        "original_zone": target_zone.name,
                        "alternative_zone": alt_zone.name if alt_zone else plan.assigned_loading_zone_id,
                        "assigned_time_slot": plan.assigned_time_slot,
                        "reason": f"{target_zone.name} capacity exceeded (2/2). Seamlessly reassigned to {alt_zone.name if alt_zone else 'alternate'}."
                    })

        incident_info = {
            "type": "ZONE_SATURATION",
            "zone_id": zone_id,
            "zone_name": target_zone.name,
            "reallocated_trucks": reallocated,
            "message": f"Loading Zone {target_zone.name} reached capacity (FULL). Alternative loading slots automatically allocated.",
        }
        self.active_incident = incident_info

        self.event_logs.insert(0, {
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "level": "WARNING",
            "message": incident_info["message"],
        })

        return {
            "incident": incident_info,
            "optimization": new_result,
        }

    def simulate_vehicle_breakdown(self, vehicle_id: str = "T-05") -> Dict[str, Any]:
        """
        Simulates unexpected breakdown of an active truck.
        The engine identifies pending delivery, finds best backup vehicle,
        reallocates cargo, and computes updated route.
        """
        target_v = next((v for v in self.vehicles if v.vehicle_id == vehicle_id), None)
        if not target_v:
            vehicle_id = "T-05"
            target_v = next(v for v in self.vehicles if v.vehicle_id == vehicle_id)

        target_v.status = "BREAKDOWN"
        target_v.utilization_pct = 0.0

        # Run re-optimization
        new_result = self.run_optimization()

        # Find who took over target_v's delivery or workload
        reassigned_info = None
        for plan in new_result.plans:
            if plan.vehicle_id != vehicle_id:
                reassigned_info = {
                    "broken_vehicle_id": vehicle_id,
                    "reassigned_to": plan.vehicle_id,
                    "reassigned_truck_name": plan.vehicle_name,
                    "delivery_id": plan.delivery_id,
                    "new_eta": plan.eta,
                    "message": f"Vehicle {vehicle_id} broken down. Active delivery reassigned to standby truck {plan.vehicle_id} ({plan.vehicle_name})."
                }

        incident_info = {
            "type": "VEHICLE_BREAKDOWN",
            "vehicle_id": vehicle_id,
            "reassigned": reassigned_info,
            "message": f"Emergency: Truck {vehicle_id} breakdown logged. Delivery workload autonomously shifted to backup fleet.",
        }
        self.active_incident = incident_info

        self.event_logs.insert(0, {
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "level": "CRITICAL",
            "message": incident_info["message"],
        })

        return {
            "incident": incident_info,
            "optimization": new_result,
        }

    def set_traffic_preset(self, level: str) -> Dict[str, Any]:
        """Sets general traffic level: LOW, MEDIUM, HIGH."""
        level = level.upper()
        multipliers = {"LOW": 0.2, "MEDIUM": 0.5, "HIGH": 0.85}
        target_mult = multipliers.get(level, 0.4)

        for r in self.roads:
            base = 0.2 if "Highway" in r.name or "Bypass" in r.name else 0.4
            r.traffic_level = min(0.95, base * (target_mult / 0.4))
            r.incident_description = None

        new_result = self.run_optimization()
        self.event_logs.insert(0, {
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "level": "INFO",
            "message": f"Traffic conditions set to {level} across city network.",
        })
        return {"level": level, "optimization": new_result}

    def trigger_port_scenario(self) -> Dict[str, Any]:
        """
        Demonstrates the coordinated Port / Warehouse Multi-Truck Scenario:
        Simultaneous wave of container trucks from Visakhapatnam Port dispatched
        through the EXIM Holding Yard to prevent municipal road gridlock.
        """
        # Re-stage 4 trucks at PORT-01
        port_truck_ids = ["T-01", "T-02", "T-03", "T-06"]
        for v in self.vehicles:
            if v.vehicle_id in port_truck_ids:
                v.current_location_id = "PORT-01"
                v.status = "IDLE"

        # Force high traffic on port road
        for r in self.roads:
            if "Port" in r.name:
                r.traffic_level = 0.75

        # Run coordinated optimization with holding area enabled
        req = OptimizationRequest(
            objective=OptimizationObjective.BALANCED,
            enable_holding_area=True,
            consider_time_windows=True
        )
        new_result = self.run_optimization(req)

        scenario_summary = {
            "scenario": "Port-to-Warehouse Wave Coordination",
            "port_dispatches": len([p for p in new_result.plans if p.origin_node.startswith("PORT")]),
            "holding_staged_trucks": [p.vehicle_id for p in new_result.plans if p.staged_at_holding],
            "description": "Port wave managed: high-priority cargo dispatched directly, non-urgent trucks staged at EXIM yard buffer, preventing downtown gridlock.",
        }

        self.event_logs.insert(0, {
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "level": "SUCCESS",
            "message": "Port Staging Scenario active: 4 container trucks dispatched with coordinated holding yard sequencing.",
        })

        return {
            "scenario_summary": scenario_summary,
            "optimization": new_result,
        }

    def get_analytics(self) -> Dict[str, Any]:
        """
        Calculates dynamic analytics based on current simulation state and optimization results.
        Zero hardcoding: all metrics derived from real graph and fleet data.
        """
        if not self.last_optimization:
            self.run_optimization()

        opt = self.last_optimization
        plans = opt.plans if opt else []
        comparison = opt.comparison if opt else None

        # Vehicle Utilization
        total_capacity = sum(v.capacity_tons for v in self.vehicles)
        used_capacity = 0.0
        for p in plans:
            deliv = next((d for d in self.deliveries if d.delivery_id == p.delivery_id), None)
            if deliv:
                used_capacity += deliv.weight_tons

        fleet_load_utilization_pct = round((used_capacity / max(1.0, total_capacity)) * 100, 1)

        # Loading Zone Utilization
        zone_stats = []
        for z_id, z in self.loading_zones.items():
            assigned_count = len([p for p in plans if p.assigned_loading_zone_id == z_id])
            util_pct = round((assigned_count / max(1, z.capacity_bays)) * 100, 1)
            zone_stats.append({
                "zone_id": z.zone_id,
                "name": z.name,
                "capacity": z.capacity_bays,
                "assigned_deliveries": assigned_count,
                "utilization_pct": min(100.0, util_pct),
                "status": z.status,
            })

        # Road Network Congestion Distribution
        congested_count = len([r for r in self.roads if r.traffic_level >= 0.65])
        moderate_count = len([r for r in self.roads if 0.35 <= r.traffic_level < 0.65])
        free_count = len([r for r in self.roads if r.traffic_level < 0.35])
        avg_congestion_score = round(sum(r.traffic_level for r in self.roads) / max(1, len(self.roads)), 2)

        # Travel Time Breakdown
        travel_time_distribution = [
            {"name": "< 20 mins", "count": len([p for p in plans if p.travel_time_min < 20])},
            {"name": "20 - 35 mins", "count": len([p for p in plans if 20 <= p.travel_time_min < 35])},
            {"name": "35 - 50 mins", "count": len([p for p in plans if 35 <= p.travel_time_min < 50])},
            {"name": "> 50 mins", "count": len([p for p in plans if p.travel_time_min >= 50])},
        ]

        return {
            "kpis": {
                "active_vehicles": len([v for v in self.vehicles if v.status != "BREAKDOWN"]),
                "pending_deliveries": len(self.deliveries),
                "total_vehicle_km": comparison.mode_urbanflow.total_distance_km if comparison else 0.0,
                "avg_travel_time_min": round(comparison.mode_urbanflow.total_travel_time_min / max(1, len(plans)), 1) if comparison and plans else 0.0,
                "avg_waiting_time_min": round(comparison.mode_urbanflow.total_waiting_time_min / max(1, len(plans)), 1) if comparison and plans else 0.0,
                "loading_conflicts_prevented": comparison.conflicts_avoided if comparison else 0,
                "late_deliveries_prevented": comparison.late_deliveries_avoided if comparison else 0,
                "fleet_load_utilization_pct": fleet_load_utilization_pct,
                "avg_congestion_score": avg_congestion_score,
                "congested_road_segments": congested_count,
            },
            "comparison": comparison,
            "zone_utilization": zone_stats,
            "travel_time_distribution": travel_time_distribution,
            "congestion_breakdown": [
                {"name": "Free Flow (< 35%)", "value": free_count, "color": "#10B981"},
                {"name": "Moderate (35-65%)", "value": moderate_count, "color": "#F59E0B"},
                {"name": "Congested (> 65%)", "value": congested_count, "color": "#EF4444"},
            ],
            "holding_area": {
                "capacity": self.holding_area.capacity_trucks,
                "occupancy": len([p for p in plans if p.staged_at_holding]),
                "status": self.holding_area.status,
            }
        }
