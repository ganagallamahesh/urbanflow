"""
Simulated Visakhapatnam City GIS Road Network & Nodes
Accurately reflects real-world coordinates and topology of Visakhapatnam
with Port, Warehouses, Arterials, Commercial Loading Zones, and Holding Areas.
"""
from typing import Dict, List
from app.models.entities import Node, Road, LoadingZone, HoldingArea


def get_city_nodes() -> Dict[str, Node]:
    nodes_data = [
        # Port Terminals
        Node(
            id="PORT-01",
            name="Visakhapatnam Port Container Terminal",
            type="port",
            lat=17.6965,
            lng=83.2985,
            description="Major maritime container terminal with heavy freight export/import gate."
        ),
        Node(
            id="PORT-02",
            name="Inner Harbor Bulk Cargo Dock",
            type="port",
            lat=17.6912,
            lng=83.2870,
            description="Bulk mineral, fertilizer and dry cargo port facility."
        ),
        # Holding Area
        Node(
            id="HOLD-01",
            name="EXIM Truck Staging & Holding Yard",
            type="holding",
            lat=17.6845,
            lng=83.2750,
            description="Off-dock staging yard with 10-truck buffer capacity to regulate city arterial inflow."
        ),
        # Warehouses & Logistics Hubs
        Node(
            id="WH-01",
            name="Autonagar Industrial Warehousing Cluster",
            type="warehouse",
            lat=17.7055,
            lng=83.2120,
            description="Primary industrial warehousing & FMCG distribution center."
        ),
        Node(
            id="WH-02",
            name="Gajuwaka Freight Logistics Park",
            type="warehouse",
            lat=17.6820,
            lng=83.2180,
            description="Heavy machinery, construction materials and breakbulk depot."
        ),
        Node(
            id="WH-03",
            name="Madhurawada Northern Distribution Hub",
            type="warehouse",
            lat=17.7650,
            lng=83.3280,
            description="North-city cross-docking facility for e-commerce and retail stock."
        ),
        # Major Road Junctions / Interchanges
        Node(
            id="J-PORT",
            name="Port Access Interchange",
            type="junction",
            lat=17.6980,
            lng=83.2820,
            description="Junction connecting port corridor to municipal road grid."
        ),
        Node(
            id="J-CONVENT",
            name="Convent Junction",
            type="junction",
            lat=17.7080,
            lng=83.2890,
            description="Critical freight gateway connecting port to core urban corridor."
        ),
        Node(
            id="J-RTC",
            name="RTC Complex Central Interchange",
            type="junction",
            lat=17.7245,
            lng=83.3035,
            description="High-density multi-modal transit and road artery junction."
        ),
        Node(
            id="J-SIRIPURAM",
            name="Siripuram Circle",
            type="junction",
            lat=17.7225,
            lng=83.3150,
            description="Commercial center junction connecting university and beachfront."
        ),
        Node(
            id="J-MADDILAPALEM",
            name="Maddilapalem Junction",
            type="junction",
            lat=17.7370,
            lng=83.3240,
            description="Major junction linking core city to NH16 National Highway."
        ),
        Node(
            id="J-NAD",
            name="NAD Flyover Junction",
            type="junction",
            lat=17.7250,
            lng=83.2350,
            description="Multi-tier flyover connecting airport corridor, NH16 and industrial zone."
        ),
        Node(
            id="J-GAJUWAKA",
            name="Gajuwaka Core Junction",
            type="junction",
            lat=17.6860,
            lng=83.2250,
            description="Steel plant and industrial bypass interchange."
        ),
        Node(
            id="J-BEACH",
            name="Beach Road Promenade Junction",
            type="junction",
            lat=17.7180,
            lng=83.3320,
            description="Coastal road junction with scenic freight movement restrictions."
        ),
        # Designated Urban Loading/Unloading Zones
        Node(
            id="LZ-01",
            name="Siripuram Commercial Bay",
            type="loading_zone",
            lat=17.7218,
            lng=83.3165,
            description="2 dedicated freight loading bays serving Siripuram malls & offices."
        ),
        Node(
            id="LZ-02",
            name="Jagadamba Market Loading Dock",
            type="loading_zone",
            lat=17.7125,
            lng=83.3015,
            description="2 loading bays for high-density retail and textile market."
        ),
        Node(
            id="LZ-03",
            name="Dwaraka Nagar Central Logistics Bay",
            type="loading_zone",
            lat=17.7275,
            lng=83.3075,
            description="2 high-turnover bays near electronics & wholesale market."
        ),
        Node(
            id="LZ-04",
            name="MVP Colony Retail Unloading Bay",
            type="loading_zone",
            lat=17.7410,
            lng=83.3340,
            description="3 spacious bays serving MVP urban residential and retail cluster."
        ),
        Node(
            id="LZ-05",
            name="Rushikonda Commercial Loading Zone",
            type="loading_zone",
            lat=17.7820,
            lng=83.3770,
            description="2 loading slots serving northern IT and hospitality hub."
        ),
        Node(
            id="LZ-06",
            name="Old Town Heritage Loading Bay",
            type="loading_zone",
            lat=17.7010,
            lng=83.2950,
            description="1 narrow bay in dense old town quarter with strict time restrictions."
        ),
        # Customer Endpoints
        Node(
            id="CUST-01",
            name="Waltair Uplands Shopping District",
            type="customer",
            lat=17.7290,
            lng=83.3190,
            description="Department stores and luxury shopping outlets."
        ),
        Node(
            id="CUST-02",
            name="Seethammadhara Commercial Center",
            type="customer",
            lat=17.7405,
            lng=83.3150,
            description="Supermarkets and commercial grocery chain hub."
        ),
        Node(
            id="CUST-03",
            name="Kurmannapalem Steel City Depot",
            type="customer",
            lat=17.6690,
            lng=83.1850,
            description="Hardware and industrial spares consumer depot."
        ),
        Node(
            id="CUST-04",
            name="Rushikonda IT Hills Complex",
            type="customer",
            lat=17.7845,
            lng=83.3810,
            description="IT park cafeteria, tech components & office equipment."
        ),
    ]
    return {n.id: n for n in nodes_data}


def get_city_roads() -> List[Road]:
    """
    Bidirectional and arterial road network segments connecting Visakhapatnam hubs.
    """
    raw_edges = [
        # Port to Junctions
        ("R01", "Port Highway Corridor", "PORT-01", "J-PORT", 2.2, 45.0, 0.35),
        ("R02", "Bulk Dock Access Link", "PORT-02", "J-PORT", 1.8, 35.0, 0.25),
        ("R03", "EXIM Staging Connector", "HOLD-01", "J-PORT", 2.0, 40.0, 0.15),
        ("R04", "Old Town Port Gate Link", "PORT-01", "LZ-06", 1.5, 30.0, 0.45),
        ("R05", "Port Bypass Road", "J-PORT", "J-CONVENT", 2.6, 50.0, 0.30),
        
        # Industrial & Western Hub
        ("R06", "Scindia Industrial Road", "HOLD-01", "WH-02", 5.8, 45.0, 0.20),
        ("R07", "Gajuwaka Highway Link", "WH-02", "J-GAJUWAKA", 1.5, 40.0, 0.40),
        ("R08", "Industrial Corridor Trunk", "J-GAJUWAKA", "WH-01", 3.2, 50.0, 0.30),
        ("R09", "National Highway NH16 West", "J-GAJUWAKA", "J-NAD", 6.5, 60.0, 0.35),
        ("R10", "Autonagar Logistics Connector", "WH-01", "J-NAD", 3.4, 45.0, 0.25),
        ("R11", "Steel Plant Access Road", "J-GAJUWAKA", "CUST-03", 4.2, 55.0, 0.15),

        # Central Urban Arterials
        ("R12", "Convent - Jagadamba Link", "J-CONVENT", "LZ-02", 2.1, 30.0, 0.65),  # Prone to traffic
        ("R13", "Old Town Market Link", "LZ-06", "LZ-02", 1.9, 25.0, 0.55),
        ("R14", "Jagadamba - RTC Central Link", "LZ-02", "J-RTC", 1.7, 30.0, 0.60),
        ("R15", "Convent - RTC Expressway", "J-CONVENT", "J-RTC", 2.8, 45.0, 0.40),
        ("R16", "RTC - Dwaraka Logistics Spur", "J-RTC", "LZ-03", 0.9, 25.0, 0.50),
        ("R17", "RTC - Siripuram Arterial", "J-RTC", "J-SIRIPURAM", 1.8, 35.0, 0.45),
        ("R18", "Siripuram Bay Connector", "J-SIRIPURAM", "LZ-01", 0.5, 25.0, 0.30),
        ("R19", "Waltair Uplands Spur", "J-SIRIPURAM", "CUST-01", 1.2, 30.0, 0.25),

        # Coastal & Eastern Links
        ("R20", "Beach Road Scenic Way", "J-CONVENT", "J-BEACH", 3.5, 40.0, 0.20),
        ("R21", "Beach Road to Siripuram", "J-BEACH", "J-SIRIPURAM", 2.1, 35.0, 0.25),
        ("R22", "Beach Road to MVP Bay", "J-BEACH", "LZ-04", 3.2, 45.0, 0.20),

        # North-South Spine & NH16
        ("R23", "NAD - RTC Arterial Road", "J-NAD", "J-RTC", 7.2, 45.0, 0.55),
        ("R24", "Dwaraka - Seethammadhara Link", "LZ-03", "CUST-02", 2.3, 30.0, 0.35),
        ("R25", "Siripuram - Maddilapalem Link", "J-SIRIPURAM", "J-MADDILAPALEM", 2.0, 35.0, 0.40),
        ("R26", "MVP Colony Main Road", "J-MADDILAPALEM", "LZ-04", 1.6, 30.0, 0.30),
        ("R27", "Seethammadhara - Maddilapalem", "CUST-02", "J-MADDILAPALEM", 1.4, 30.0, 0.25),
        ("R28", "NH16 Ring Road North", "J-NAD", "J-MADDILAPALEM", 8.4, 60.0, 0.30),

        # Northern Corridor (Madhurawada & Rushikonda)
        ("R29", "NH16 Madhurawada Highway", "J-MADDILAPALEM", "WH-03", 6.8, 65.0, 0.25),
        ("R30", "MVP - Rushikonda Beach Expressway", "LZ-04", "LZ-05", 5.9, 50.0, 0.20),
        ("R31", "Madhurawada - Rushikonda Crossroad", "WH-03", "LZ-05", 4.1, 40.0, 0.20),
        ("R32", "Rushikonda IT Hills Spur", "LZ-05", "CUST-04", 1.1, 30.0, 0.15),
    ]

    roads = []
    # Create bidirectional links
    for road_id, name, u, v, dist, speed, traffic in raw_edges:
        # Forward
        roads.append(
            Road(
                road_id=f"{road_id}_F",
                name=f"{name} (Outbound)",
                start_node=u,
                end_node=v,
                distance_km=dist,
                base_speed_kmh=speed,
                traffic_level=traffic,
            )
        )
        # Backward
        roads.append(
            Road(
                road_id=f"{road_id}_R",
                name=f"{name} (Inbound)",
                start_node=v,
                end_node=u,
                distance_km=dist,
                base_speed_kmh=speed,
                traffic_level=traffic,
            )
        )
    return roads


def get_city_loading_zones() -> Dict[str, LoadingZone]:
    zones = [
        LoadingZone(
            zone_id="LZ-01",
            name="Siripuram Commercial Bay",
            node_id="LZ-01",
            capacity_bays=2,
            current_occupancy=0,
            available_slots=2,
            operating_hours="07:00 - 22:00",
            status="ACTIVE",
        ),
        LoadingZone(
            zone_id="LZ-02",
            name="Jagadamba Market Loading Dock",
            node_id="LZ-02",
            capacity_bays=2,
            current_occupancy=1,
            available_slots=1,
            operating_hours="06:00 - 23:00",
            status="ACTIVE",
        ),
        LoadingZone(
            zone_id="LZ-03",
            name="Dwaraka Nagar Central Logistics Bay",
            node_id="LZ-03",
            capacity_bays=2,
            current_occupancy=1,
            available_slots=1,
            operating_hours="06:00 - 22:00",
            status="ACTIVE",
        ),
        LoadingZone(
            zone_id="LZ-04",
            name="MVP Colony Retail Unloading Bay",
            node_id="LZ-04",
            capacity_bays=3,
            current_occupancy=0,
            available_slots=3,
            operating_hours="07:00 - 21:00",
            status="ACTIVE",
        ),
        LoadingZone(
            zone_id="LZ-05",
            name="Rushikonda Commercial Bay",
            node_id="LZ-05",
            capacity_bays=2,
            current_occupancy=0,
            available_slots=2,
            operating_hours="08:00 - 20:00",
            status="ACTIVE",
        ),
        LoadingZone(
            zone_id="LZ-06",
            name="Old Town Heritage Loading Bay",
            node_id="LZ-06",
            capacity_bays=1,
            current_occupancy=0,
            available_slots=1,
            operating_hours="06:00 - 11:00",  # strict morning window
            status="ACTIVE",
        ),
    ]
    return {z.zone_id: z for z in zones}


def get_city_holding_area() -> HoldingArea:
    return HoldingArea(
        holding_id="HOLD-01",
        name="EXIM Port Truck Staging & Holding Yard",
        node_id="HOLD-01",
        capacity_trucks=10,
        current_occupancy=2,
        queued_truck_ids=["T-09", "T-10"],
        status="OPERATIONAL"
    )
