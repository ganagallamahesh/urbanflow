from typing import List, Optional
from pydantic import BaseModel, Field


class Node(BaseModel):
    id: str
    name: str
    type: str  # 'port', 'holding', 'warehouse', 'loading_zone', 'junction', 'customer'
    lat: float
    lng: float
    description: Optional[str] = None


class Road(BaseModel):
    road_id: str
    name: str
    start_node: str
    end_node: str
    distance_km: float
    base_speed_kmh: float = 40.0
    capacity_trucks_per_hour: int = 120
    traffic_level: float = Field(default=0.2, ge=0.0, le=1.0)  # 0.0 free flow, 1.0 severe gridlock
    is_blocked: bool = False
    incident_description: Optional[str] = None

    @property
    def effective_speed_kmh(self) -> float:
        if self.is_blocked:
            return 1.0
        # Speed drops non-linearly with congestion
        factor = max(0.15, 1.0 - (self.traffic_level ** 1.5) * 0.85)
        return max(5.0, self.base_speed_kmh * factor)

    @property
    def travel_time_minutes(self) -> float:
        speed = self.effective_speed_kmh
        return (self.distance_km / speed) * 60.0


class Vehicle(BaseModel):
    vehicle_id: str
    name: str
    type: str = "Standard Freight Truck"
    capacity_tons: float
    current_location_id: str
    status: str = "IDLE"  # 'IDLE', 'IN_TRANSIT', 'AT_LOADING_BAY', 'HOLDING', 'BREAKDOWN'
    assigned_delivery_id: Optional[str] = None
    utilization_pct: float = 0.0
    eta: Optional[str] = None
    current_route: List[str] = []


class Delivery(BaseModel):
    delivery_id: str
    title: str
    origin_node_id: str
    destination_node_id: str
    weight_tons: float
    time_window_start: str  # e.g. "09:00"
    time_window_end: str    # e.g. "10:30"
    priority: str = "STANDARD"  # 'CRITICAL', 'EXPRESS', 'STANDARD'
    status: str = "PENDING"     # 'PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'DELAYED'
    assigned_vehicle_id: Optional[str] = None
    preferred_loading_zone_id: Optional[str] = None


class LoadingZone(BaseModel):
    zone_id: str
    name: str
    node_id: str
    capacity_bays: int
    current_occupancy: int = 0
    available_slots: int = 2
    operating_hours: str = "06:00 - 22:00"
    status: str = "ACTIVE"  # 'ACTIVE', 'FULL', 'MAINTENANCE'
    assigned_trucks: List[str] = []


class HoldingArea(BaseModel):
    holding_id: str
    name: str
    node_id: str
    capacity_trucks: int = 10
    current_occupancy: int = 0
    queued_truck_ids: List[str] = []
    status: str = "OPERATIONAL"
