"""
Graph Router module using NetworkX.
Implements Multi-Objective Weighted Dijkstra and Basic Shortest-Distance Routing
across the Visakhapatnam City Geo-Network.
"""
from typing import List, Dict, Tuple, Optional
import networkx as nx
from app.models.entities import Node, Road
from app.models.optimization import RouteStep, OptimizationObjective, OptimizationWeights


class CityGraphRouter:
    def __init__(self, nodes: Dict[str, Node], roads: List[Road]):
        self.nodes = nodes
        self.roads = roads
        self.road_map: Dict[Tuple[str, str], Road] = {}
        for r in roads:
            self.road_map[(r.start_node, r.end_node)] = r

        self.dist_graph = nx.DiGraph()
        self.coordinated_graph = nx.DiGraph()
        self._build_graphs(OptimizationObjective.BALANCED, OptimizationWeights())

    def _build_graphs(self, objective: OptimizationObjective, weights: OptimizationWeights):
        self.dist_graph.clear()
        self.coordinated_graph.clear()

        for node_id, node in self.nodes.items():
            self.dist_graph.add_node(node_id, **node.model_dump())
            self.coordinated_graph.add_node(node_id, **node.model_dump())

        for r in self.roads:
            u, v = r.start_node, r.end_node
            dist = r.distance_km
            time_min = r.travel_time_minutes

            # 1. Basic Routing: Pure distance
            self.dist_graph.add_edge(
                u, v,
                weight=dist,
                distance=dist,
                time_min=time_min,
                road=r
            )

            # 2. Coordinated Routing: Multi-attribute cost
            if r.is_blocked:
                coordinated_cost = 999999.0
            else:
                # Congestion penalty increases sharply when traffic exceeds 60%
                cong_penalty = (r.traffic_level ** 1.8) * 20.0

                if objective == OptimizationObjective.FASTEST:
                    coordinated_cost = (time_min * 2.5) + (dist * 0.5) + (cong_penalty * 2.0)
                elif objective == OptimizationObjective.LOWEST_DISTANCE:
                    coordinated_cost = (dist * 3.0) + (time_min * 0.5) + (cong_penalty * 0.8)
                elif objective == OptimizationObjective.LOWEST_CONGESTION:
                    coordinated_cost = (dist * 0.8) + (time_min * 1.2) + (cong_penalty * 5.0)
                else:  # BALANCED
                    coordinated_cost = (
                        dist * weights.dist_weight +
                        time_min * weights.time_weight +
                        cong_penalty * weights.cong_weight
                    )

            self.coordinated_graph.add_edge(
                u, v,
                weight=max(0.1, coordinated_cost),
                distance=dist,
                time_min=time_min,
                traffic=r.traffic_level,
                road=r
            )

    def update_road_conditions(self, roads: List[Road], objective: OptimizationObjective = OptimizationObjective.BALANCED, weights: Optional[OptimizationWeights] = None):
        self.roads = roads
        self.road_map = {(r.start_node, r.end_node): r for r in roads}
        self._build_graphs(objective, weights or OptimizationWeights())

    def find_route_basic(self, start_node: str, end_node: str) -> Tuple[List[str], List[RouteStep], float, float]:
        """
        Conventional shortest path (distance-only).
        Returns: (node_ids, route_steps, total_distance_km, total_travel_time_min)
        """
        try:
            path = nx.shortest_path(self.dist_graph, source=start_node, target=end_node, weight="weight")
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            return [], [], 0.0, 0.0

        steps, total_dist, total_time = self._build_steps(path)
        return path, steps, total_dist, total_time

    def find_route_coordinated(self, start_node: str, end_node: str) -> Tuple[List[str], List[RouteStep], float, float, float]:
        """
        Coordinated route minimizing distance + travel time + dynamic congestion penalty.
        Returns: (node_ids, route_steps, total_distance_km, total_travel_time_min, cost_score)
        """
        try:
            path = nx.shortest_path(self.coordinated_graph, source=start_node, target=end_node, weight="weight")
            cost = nx.shortest_path_length(self.coordinated_graph, source=start_node, target=end_node, weight="weight")
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            return [], [], 0.0, 0.0, 9999.0

        steps, total_dist, total_time = self._build_steps(path)
        return path, steps, total_dist, total_time, cost

    def get_alternative_paths_comparison(self, start_node: str, end_node: str, k: int = 3) -> List[Dict]:
        """
        Generates top k paths to provide explainability comparison.
        """
        alternatives = []
        try:
            all_paths = list(nx.shortest_simple_paths(self.coordinated_graph, start_node, end_node, weight="weight"))
            for p in all_paths[:k]:
                steps, dist, time = self._build_steps(p)
                avg_traffic = sum(s.traffic_level for s in steps) / max(1, len(steps))
                alternatives.append({
                    "path_nodes": p,
                    "distance_km": round(dist, 2),
                    "travel_time_min": round(time, 1),
                    "avg_traffic": round(avg_traffic, 2),
                    "via": " -> ".join([self.nodes[n].name.split()[0] for n in p])
                })
        except Exception:
            pass
        return alternatives

    def _build_steps(self, path: List[str]) -> Tuple[List[RouteStep], float, float]:
        steps = []
        total_dist = 0.0
        total_time = 0.0

        for i in range(len(path) - 1):
            u, v = path[i], path[i+1]
            road = self.road_map.get((u, v))
            if road:
                dist = road.distance_km
                time_min = road.travel_time_minutes
                traffic = road.traffic_level
                road_id = road.road_id
                road_name = road.name
            else:
                dist = 2.0
                time_min = 4.0
                traffic = 0.2
                road_id = f"V_{u}_{v}"
                road_name = f"Transit link {u} to {v}"

            total_dist += dist
            total_time += time_min
            steps.append(
                RouteStep(
                    step_index=i + 1,
                    from_node=u,
                    to_node=v,
                    road_id=road_id,
                    road_name=road_name,
                    distance_km=round(dist, 2),
                    traffic_level=round(traffic, 2),
                    travel_time_min=round(time_min, 1),
                )
            )

        return steps, round(total_dist, 2), round(total_time, 1)
