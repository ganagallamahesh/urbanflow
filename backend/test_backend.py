"""
Automated unit & integration test for UrbanFlow Backend Engine.
"""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_endpoints():
    print("Testing / ...")
    r = client.get("/")
    assert r.status_code == 200, r.text
    print("[OK] Root endpoint OK")

    print("Testing /api/network/nodes ...")
    r = client.get("/api/network/nodes")
    assert r.status_code == 200
    nodes = r.json()["nodes"]
    assert len(nodes) > 10
    print(f"[OK] Nodes OK ({len(nodes)} nodes)")

    print("Testing /api/fleet/vehicles ...")
    r = client.get("/api/fleet/vehicles")
    assert r.status_code == 200
    vehicles = r.json()["vehicles"]
    assert len(vehicles) >= 10
    print(f"[OK] Vehicles OK ({len(vehicles)} trucks)")

    print("Testing /api/optimize (Balanced) ...")
    r = client.post("/api/optimize", json={"objective": "BALANCED"})
    assert r.status_code == 200
    opt_data = r.json()
    assert opt_data["status"] == "success"
    assert len(opt_data["plans"]) > 0
    assert "comparison" in opt_data
    comp = opt_data["comparison"]
    print(f"[OK] Optimization OK: {len(opt_data['plans'])} plans created")
    print(f"  Basic vs UrbanFlow: Distance {comp['mode_basic']['total_distance_km']}km vs {comp['mode_urbanflow']['total_distance_km']}km")
    print(f"  Conflicts Avoided: {comp['conflicts_avoided']}")
    print(f"  Late Deliveries Avoided: {comp['late_deliveries_avoided']}")

    print("Testing /api/explain/T-01 ...")
    r = client.get("/api/explain/T-01")
    assert r.status_code == 200
    explain = r.json()
    assert "reasons" in explain
    print(f"[OK] Explainability OK: {len(explain['reasons'])} explanation factors")

    print("Testing /api/simulate/traffic ...")
    r = client.post("/api/simulate/traffic", json={})
    assert r.status_code == 200
    res = r.json()
    assert "incident" in res
    print(f"[OK] Traffic simulation spike OK: {res['incident']['message']}")

    print("Testing /api/simulate/loading-zone ...")
    r = client.post("/api/simulate/loading-zone", json={"zone_id": "LZ-03"})
    assert r.status_code == 200
    print("[OK] Loading zone full simulation OK")

    print("Testing /api/simulate/breakdown ...")
    r = client.post("/api/simulate/breakdown", json={"vehicle_id": "T-05"})
    assert r.status_code == 200
    print("[OK] Vehicle breakdown simulation OK")

    print("Testing /api/simulate/scenario/port ...")
    r = client.post("/api/simulate/scenario/port")
    assert r.status_code == 200
    print("[OK] Port scenario simulation OK")

    print("Testing /api/analytics ...")
    r = client.get("/api/analytics")
    assert r.status_code == 200
    analytics = r.json()
    assert "kpis" in analytics
    print(f"[OK] Analytics OK: Active trucks = {analytics['kpis']['active_vehicles']}, fleet load util = {analytics['kpis']['fleet_load_utilization_pct']}%")

    print("Testing /api/simulate/reset ...")
    r = client.post("/api/simulate/reset")
    assert r.status_code == 200
    print("[OK] Simulation reset OK")

    print("\nALL BACKEND TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_endpoints()
