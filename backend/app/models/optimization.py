from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum


class OptimizationObjective(str, Enum):
    BALANCED = "BALANCED"
    FASTEST = "FASTEST"
    LOWEST_DISTANCE = "LOWEST_DISTANCE"
    LOWEST_CONGESTION = "LOWEST_CONGESTION"


class OptimizationWeights(BaseModel):
    dist_weight: float = 1.0
    time_weight: float = 1.5
    cong_weight: float = 2.0
    wait_weight: float = 1.2
    conflict_weight: float = 5.0
    late_weight: float = 4.0


class RouteStep(BaseModel):
    step_index: int
    from_node: str
    to_node: str
    road_id: str
    road_name: str
    distance_km: float
    traffic_level: float
    travel_time_min: float


class AssignedPlan(BaseModel):
    vehicle_id: str
    vehicle_name: str
    delivery_id: str
    delivery_title: str
    priority: str
    origin_node: str
    destination_node: str
    route_nodes: List[str]
    route_steps: List[RouteStep]
    assigned_loading_zone_id: Optional[str] = None
    assigned_time_slot: Optional[str] = None
    staged_at_holding: bool = False
    distance_km: float
    travel_time_min: float
    waiting_time_min: float
    eta: str
    is_delayed: bool = False
    cost_score: float
    explanation: List[str]


class ModeMetrics(BaseModel):
    total_distance_km: float
    total_travel_time_min: float
    total_waiting_time_min: float
    loading_conflicts_count: int
    late_deliveries_count: int
    vehicles_used: int
    total_cost_score: float


class MetricComparison(BaseModel):
    mode_basic: ModeMetrics
    mode_urbanflow: ModeMetrics
    delta_distance_km: float
    delta_time_min: float
    delta_waiting_min: float
    conflicts_avoided: int
    late_deliveries_avoided: int


class OptimizationRequest(BaseModel):
    objective: OptimizationObjective = OptimizationObjective.BALANCED
    weights: Optional[OptimizationWeights] = None
    enable_holding_area: bool = True
    consider_time_windows: bool = True


class OptimizationResponse(BaseModel):
    status: str = "success"
    objective: OptimizationObjective
    timestamp: str
    plans: List[AssignedPlan]
    comparison: MetricComparison
    unassigned_deliveries: List[str] = []
    active_conflicts: List[str] = []
    coordination_summary: List[str] = []
