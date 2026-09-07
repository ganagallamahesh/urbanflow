# UrbanFlow — Comprehensive System Architecture, Technology Stack & Execution Guide
> **Smart India Hackathon (SIH) Prototype**  
> *Category: Student Innovation — Urban Infrastructure, Logistics & Resource Coordination*

---

## Table of Contents
1. [Core Concept & Problem Definition](#1-core-concept--problem-definition)
2. [End-to-End System Architecture](#2-end-to-end-system-architecture)
3. [Complete Technology Stack Breakdown](#3-complete-technology-stack-breakdown)
4. [Step-by-Step Installation & Execution Guide](#4-step-by-step-installation--execution-guide)
5. [Inner Working of the Application](#5-inner-working-of-the-application)
   - [5.1 The Simulated Visakhapatnam Geo-Graph](#51-the-simulated-visakhapatnam-geo-graph)
   - [5.2 Data Entities & State Management](#52-data-entities--state-management)
   - [5.3 The Multi-Objective Optimization Engine](#53-the-multi-objective-optimization-engine)
   - [5.4 Curbside Loading Bay Slot Reservation & Holding Yard Buffering](#54-curbside-loading-bay-slot-reservation--holding-yard-buffering)
   - [5.5 Rigorous Comparison Mechanics (Basic vs UrbanFlow)](#55-rigorous-comparison-mechanics-basic-vs-urbanflow)
   - [5.6 Dynamic Simulation Events & Autonomous Rerouting](#56-dynamic-simulation-events--autonomous-rerouting)
   - [5.7 Decision Explainability Inspector](#57-decision-explainability-inspector)
   - [5.8 Live Analytics Engine](#58-live-analytics-engine)
6. [API Specification & Endpoints](#6-api-specification--endpoints)
7. [Judge Presentation & 3-Minute Live Demo Script](#7-judge-presentation--3-minute-live-demo-script)
8. [Prototype Limitations & Future Roadmap](#8-prototype-limitations--future-roadmap)

---

## 1. Core Concept & Problem Definition

### The Problem
In modern metropolitan and port cities, freight transport places severe stress on municipal infrastructure:
- **Corridor Gridlock**: Heavy commercial trucks choke main arterials during peak commuting hours.
- **Curbside Chaos**: Delivery vehicles arrive at commercial zones simultaneously without prior reservation, double-parking on narrow roads and blocking traffic lanes.
- **Port Gate Queues**: Trucks arriving in uncoordinated waves create kilometers-long queues outside port and container gates.
- **Fragmented Systems**: Municipal traffic police (ITS), port operating authorities (TOS), private warehouse hubs, and third-party logistics (3PL) fleets operate in complete data isolation.

### The UrbanFlow Innovation
**UrbanFlow is a common coordination and optimization layer.** It does **not** replace existing mapping services (like Google Maps), port operating software, or traffic signal control systems. Instead, it demonstrates how their operational variables can be synthesized into unified decisions:

```
+-----------------------------------------------------------------------------------+
|                            EXISTING FRAGMENTED SYSTEMS                            |
|                                                                                   |
|  [Traffic Control (ITS)]   [Port Gate (TOS)]   [Warehouse Docks]  [Fleet Nav (GPS)]|
+-------------+---------------------+-------------------+------------------+--------+
              \                     |                   |                 /
               \                    |                   |                /
                v                   v                   v               v
+-----------------------------------------------------------------------------------+
|                        URBANFLOW UNIFIED COORDINATION LAYER                       |
|                                                                                   |
|  - Multi-Objective Routing (Traffic Impedance + Length + Delay Cost)             |
|  - Dynamic Curbside Bay Slot Reservation (Zero Double-Parking)                    |
|  - Off-Dock Holding Yard Staging (Port Gate Queue Buffering)                      |
|  - Autonomous Failover (Dynamic Rerouting & Breakdown Cargo Shift)                |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        COORDINATED MUNICIPAL FREIGHT FLOW                         |
|  (Minimal Bottleneck Penetration, Eliminated Bay Queues, Guaranteed Time Windows) |
+-----------------------------------------------------------------------------------+
```

---

## 2. End-to-End System Architecture

```
+-----------------------------------------------------------------------------------+
|                             FRONTEND PRESENTATION LAYER                           |
|                                (React 18 + Vite 6)                                |
|                                                                                   |
|  +---------------------+  +---------------------+  +---------------------------+  |
|  | Operations Dashboard|  | Leaflet GIS Map     |  | Simulation Controls       |  |
|  | Summary KPI Cards   |  | Custom SVG Markers  |  | Traffic Spike / Bay Full  |  |
|  +---------------------+  +---------------------+  +---------------------------+  |
|  +---------------------+  +---------------------+  +---------------------------+  |
|  | Basic vs UrbanFlow  |  | Route Explainability|  | Dynamic Recharts          |  |
|  | Comparison Table    |  | Decision Inspector  |  | Analytics Dashboards      |  |
|  +---------------------+  +---------------------+  +---------------------------+  |
+-----------------------------------------+-----------------------------------------+
                                          | REST API (JSON over HTTP)
                                          | Base URL: http://127.0.0.1:8000
                                          v
+-----------------------------------------------------------------------------------+
|                              BACKEND APPLICATION LAYER                            |
|                            (Python 3.11 + FastAPI + Uvicorn)                      |
|                                                                                   |
|  [CORS Middleware]  -->  [Route Controllers: /fleet, /infrastructure, /optimize]  |
|                                         |                                         |
|                                         v                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                          SIMULATION STATE MANAGER                           |  |
|  |  - In-Memory / SQLite Persistent State Cache                                |  |
|  |  - Live Event Logger & Incident Diff Tracker                                |  |
|  +--------------------------------------+--------------------------------------+  |
|                                         |                                         |
|                    +--------------------+--------------------+                    |
|                    v                                         v                    |
|  +-----------------------------------+     +-----------------------------------+  |
|  |    MODULAR OPTIMIZATION ENGINE    |     |     SIMULATED CITY DATA LAYER     |  |
|  | - Multi-Objective Dijkstra Router |     | - Visakhapatnam Geo Network Graph |  |
|  | - Curbside Bay Slot Allocator     |     |   (24 Nodes, 64 Directed Links)   |  |
|  | - Off-Dock Yard Queue Sequencer   |     | - 10 Simulated Multi-Axle Trucks  |  |
|  | - Breakdown Failover Re-allocator |     | - 20 Time-Windowed Deliveries     |  |
|  | - Mode Comparison Calculator      |     | - 6 Curbside Bays & EXIM Yard     |  |
|  +-----------------------------------+     +-----------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 3. Complete Technology Stack Breakdown

| Technology | Layer | Version / Package | Role & Purpose |
| :--- | :--- | :--- | :--- |
| **Python** | Backend Runtime | 3.11.8 | High-speed, robust programming language for algorithmic execution. |
| **FastAPI** | Backend Web Framework | 0.141.1 | High-performance asynchronous REST API framework with automatic OpenAPI/Swagger documentation generation. |
| **Uvicorn** | ASGI Web Server | 0.52.4 | Lightning-fast ASGI web server hosting the FastAPI backend on `127.0.0.1:8000`. |
| **NetworkX** | Graph & Network Engine | 3.6.1 | Directed graph (`DiGraph`) computation engine for multi-attribute weighted Dijkstra pathfinding and topological analysis. |
| **Pydantic** | Schema & Validation | 2.10.6 | Strict runtime data validation and serialization for vehicles, deliveries, roads, and optimization payloads. |
| **React** | Frontend UI Library | 18.3.1 | Declarative component architecture for the operational dashboard. |
| **Vite** | Build Tool & Bundler | 6.0.1 | Next-generation frontend tooling providing sub-second Hot Module Replacement (HMR) and optimized production builds. |
| **Tailwind CSS** | Styling Framework | 3.4.16 | Utility-first CSS framework delivering a sleek, command-center dark theme (`slate-950` / `emerald-500`). |
| **Leaflet** | GIS Mapping Core | 1.9.4 | Lightweight open-source interactive JavaScript mapping library. |
| **React-Leaflet** | Map React Wrapper | 4.2.1 | React bindings for Leaflet components (TileLayer, Marker, Polyline, Tooltip, Popup). |
| **CARTO Voyager Tiles** | Basemap Provider | Raster Tiles | Free public OpenStreetMap-based basemap tiles styled for clean command-center aesthetics. |
| **Recharts** | Data Visualizations | 2.13.3 | Composable SVG chart library rendering dynamic bar charts, travel-time distributions, and donut charts. |
| **Lucide React** | Iconography | 0.468.0 | Clean, consistent SVG icon set for fleet vehicles, loading docks, incidents, and KPI meters. |

---

## 4. Step-by-Step Installation & Execution Guide

### System Prerequisites
1. **Python 3.10 or higher** (Python 3.11 recommended).
2. **Node.js 18 or higher** (Node.js 20/24 recommended).
3. **Git / Powershell / Command Prompt** on Windows, macOS, or Linux.

---

### Option A: 1-Click Launch (Windows)
Inside `C:\Users\ganag\.gemini\antigravity\scratch\urbanflow`, double-click:
```text
start_demo.bat
```
*This automatically launches two concurrent terminal windows for the FastAPI backend and Vite frontend.*

---

### Option B: Manual Terminal Execution

#### Terminal 1: Backend Server
```powershell
# 1. Navigate to backend directory
cd C:\Users\ganag\.gemini\antigravity\scratch\urbanflow\backend

# 2. Install requirements (if not already installed)
python -m pip install -r requirements.txt

# 3. Run the automated test suite to verify graph and algorithms
python test_backend.py

# 4. Start the FastAPI server
python run_backend.py
```
> **Backend Status**: Online at `http://127.0.0.1:8000`  
> **Interactive API Documentation (Swagger)**: `http://127.0.0.1:8000/docs`

#### Terminal 2: Frontend Client
```powershell
# 1. Navigate to frontend directory
cd C:\Users\ganag\.gemini\antigravity\scratch\urbanflow\frontend

# 2. Install npm packages (if not already installed)
npm install

# 3. Start the Vite development server
npm run dev
```
> **Frontend Status**: Online at `http://localhost:5173`

---

## 5. Inner Working of the Application

### 5.1 The Simulated Visakhapatnam Geo-Graph
The prototype uses a realistic road network and node topology modeled after the coastal industrial port city of **Visakhapatnam (Vizag), Andhra Pradesh, India**:
- **Port Terminals**:
  - `PORT-01` (Visakhapatnam Port Container Terminal, Lat: 17.6965, Lng: 83.2985): Heavy maritime container gate.
  - `PORT-02` (Inner Harbor Bulk Cargo Dock, Lat: 17.6912, Lng: 83.2870): Mineral, fertilizer, and bulk cargo facility.
- **Off-Dock Holding Staging Yard**:
  - `HOLD-01` (EXIM Truck Staging & Holding Yard, Lat: 17.6845, Lng: 83.2750): 10-truck buffer capacity to regulate city arterial inflow.
- **Warehousing & Distribution Clusters**:
  - `WH-01` (Autonagar Industrial Hub, Lat: 17.7055, Lng: 83.2120): Primary FMCG and manufacturing warehouse.
  - `WH-02` (Gajuwaka Freight Logistics Park, Lat: 17.6820, Lng: 83.2180): Heavy machinery and breakbulk storage.
  - `WH-03` (Madhurawada Northern Distribution Hub, Lat: 17.7650, Lng: 83.3280): North city retail distribution park.
- **Curbside Loading/Unloading Zones (6 Designated Hubs)**:
  - `LZ-01` (Siripuram Commercial Bay - 2 bays)
  - `LZ-02` (Jagadamba Market Loading Dock - 2 bays)
  - `LZ-03` (Dwaraka Nagar Central Logistics Bay - 2 bays)
  - `LZ-04` (MVP Colony Retail Unloading Bay - 3 bays)
  - `LZ-05` (Rushikonda Tech & Commercial Bay - 2 bays)
  - `LZ-06` (Old Town Heritage Loading Bay - 1 bay)
- **Road Network**:
  - 32 bidirectional arterial links (64 directed edges) including NH16 Highway Bypass, Port Access Arterial, Beach Road, Jagadamba Central Link, and Industrial Corridor.
  - Each link tracks length (km), base speed (km/h), traffic saturation ($0.0$ to $1.0$), and dynamic incident status.

---

### 5.2 Data Entities & State Management
- **10 Simulated Trucks (`T-01` to `T-10`)**:
  - Varying capacities: Light Commercial (2.5T - 4.0T), Medium Rigid (7.5T - 8.0T), Heavy Multi-Axle (12.0T - 18.0T).
  - Statuses: `IDLE`, `IN_TRANSIT`, `AT_LOADING_BAY`, `HOLDING`, `BREAKDOWN`.
- **20 Delivery Demands (`D-01` to `D-20`)**:
  - Realistic consignments: Import Electronics, FMCG Refills, Marine Engine Spares, Supermarket Cold Chain Groceries, Steel Billets, Urgent Pharmaceuticals.
  - Weights (1.9T to 15.5T), strict delivery time windows (e.g. `09:15 - 10:30`), priorities (`CRITICAL`, `EXPRESS`, `STANDARD`).
- **In-Memory State Manager (`SimulationManager`)**:
  - Maintains persistent operational state during the session.
  - Logs every dispatch, reroute event, and incident diff with timestamps.

---

### 5.3 The Multi-Objective Optimization Engine
Unlike simple navigation apps that only minimize distance, UrbanFlow evaluates a **multi-attribute cost function**:

$$\text{Cost} = w_{\text{dist}} \cdot \text{Distance} + w_{\text{time}} \cdot \text{TravelTime} + w_{\text{cong}} \cdot \text{CongestionPenalty} + w_{\text{wait}} \cdot \text{WaitPenalty} + w_{\text{conflict}} \cdot \text{BayPenalty} + w_{\text{late}} \cdot \text{LatePenalty}$$

Where:
- **Travel Time with Non-Linear Traffic Degradation**:
  $$\text{Effective Speed} = \text{Base Speed} \times \max\left(0.15, 1.0 - (\text{TrafficLevel}^{1.5}) \times 0.85\right)$$
- **Congestion Penalty**: Sharp exponential penalty applied when traffic exceeds 60%:
  $$\text{CongestionPenalty} = (\text{TrafficLevel}^{1.8}) \times 20.0$$
- **Weights Configuration**:
  - `BALANCED` (Default): Balances travel time, distance, and congestion avoidance.
  - `FASTEST`: Triple-weights travel time and traffic penalties.
  - `LOWEST_DISTANCE`: Prioritizes shortest route kilometers.
  - `LOWEST_CONGESTION`: Heavily penalizes congested corridors, routing through ring roads and bypasses.

---

### 5.4 Curbside Loading Bay Slot Reservation & Holding Yard Buffering
1. **Dynamic Slot Calendar**:
   - For every loading zone (`LZ-01` to `LZ-06`), the engine maintains a time-window reservation calendar: $[T_{\text{arrival}}, T_{\text{arrival}} + 20\text{ min}]$.
2. **Conflict Detection & Autonomous Resolution**:
   - If an arriving truck would exceed the physical bay count of the destination zone, UrbanFlow evaluates two mitigation strategies:
     - **Strategy A (Nearby Alternative Zone)**: Searches for an available loading zone within 5 km. If found, reallocates the truck and adjusts the destination node.
     - **Strategy B (Off-Dock Buffer Staging)**: If departing from the Port and destination bays are saturated, the vehicle is staged at the **EXIM Holding Yard (`HOLD-01`)** with a scheduled release time, eliminating roadside queuing.

---

### 5.5 Rigorous Comparison Mechanics (Basic vs UrbanFlow)
To prove the value of the coordination layer, the engine runs both paradigms simultaneously on the exact same dataset:

| Dimension | Conventional Basic Routing | UrbanFlow Coordination Layer |
| :--- | :--- | :--- |
| **Routing Metric** | Shortest path distance only (Euclidean / basic Dijkstra). | Multi-objective cost (distance, congestion impedance, delay penalties). |
| **Traffic Awareness** | Blindly follows shortest path directly into traffic jams. | Evaluates corridor impedance and routes via bypasses. |
| **Curbside Bay Handling** | Ignores bay availability; multiple trucks arrive simultaneously. | Proactively checks and reserves physical bay arrival time slots. |
| **Curbside Congestion** | High loading conflicts; trucks idle on streets causing traffic blocks. | Zero bay conflicts; trucks arrive only when bays are free. |
| **Off-Dock Staging** | Does not utilize holding yards; trucks queue at port gates. | Sequences truck dispatches through holding yards to prevent road spikes. |

> **Zero Hardcoded Numbers**: All numbers in the **Comparison Table** (distance, travel time, waiting time, conflicts avoided, late deliveries) are computed dynamically from the graph traversal.

---

### 5.6 Dynamic Simulation Events & Autonomous Rerouting
The platform features interactive scenario controls to test real-world volatility:

1. **"Simulate Traffic Spike"**:
   - Injects a severe congestion event ($95\%$ saturation) on the primary corridor (e.g., Convent-RTC Expressway or Port Highway).
   - Identifies all vehicles scheduled to traverse that corridor.
   - Automatically re-optimizes their routes via open bypasses, updates ETAs, and displays a Before vs After route comparison diff.
2. **"Simulate Loading Zone Full"**:
   - Saturates a target commercial zone (e.g. `LZ-03` Dwaraka Nagar, $2/2$ bays full).
   - Incoming delivery trucks detect the conflict and are redirected to `LZ-01` Siripuram without dispatcher panic.
3. **"Simulate Vehicle Breakdown"**:
   - Flags an active truck (e.g. `T-05`) as `BREAKDOWN`.
   - Identifies its assigned delivery and re-assigns the payload to a standby vehicle (e.g. `T-08`) with matching capacity.
4. **"Port-to-Warehouse Wave"**:
   - Dispatches 4 container trucks simultaneously from Visakhapatnam Port.
   - Uses the EXIM Holding Yard to buffer and stagger the convoy, preventing downtown gridlock.

---

### 5.7 Decision Explainability Inspector
UrbanFlow is not a black box. Clicking **"Why Selected?"** or **"Explain Decision"** on any vehicle opens an explainability breakdown:
- **Primary Factors**: Exact explanation of vehicle payload fit, traffic penalties avoided, bay reservation window, and delivery deadline buffer.
- **Alternatives Evaluated Table**: Compares the top 3 alternative paths considered by the engine, showing their distance, travel time, average congestion, and why they were rejected.

---

### 5.8 Live Analytics Engine
The **Analytics** tab visualizes live calculated operational indicators using Recharts:
- **Fleet Travel Time Bins**: Bar chart showing fleet duration distribution ($<20$m, $20-35$m, $35-50$m, $>50$m).
- **Loading Zone Utilization**: Percentage capacity utilization across all 6 loading zones.
- **Road Network Congestion Breakdown**: Donut chart displaying Free Flow ($<35\%$), Moderate ($35-65\%$), and Congested ($>65\%$) road segments.
- **Fleet Payload Utilization**: Calculated payload weight divided by total fleet tonnage capacity.

---

## 6. API Specification & Endpoints

| Method | Endpoint | Description | Sample Request / Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Root health and status | `{"platform": "UrbanFlow", "status": "online"}` |
| `GET` | `/api/fleet/vehicles` | Returns all 10 fleet trucks with status & location | `{"vehicles": [{ "vehicle_id": "T-01", ... }]}` |
| `GET` | `/api/fleet/deliveries` | Returns all 20 delivery demands with time windows | `{"deliveries": [{ "delivery_id": "D-01", ... }]}` |
| `GET` | `/api/infrastructure/zones`| Returns all 6 loading zones with bay occupancy | `{"zones": [{ "zone_id": "LZ-01", "capacity_bays": 2 }]}` |
| `GET` | `/api/infrastructure/holding`| Returns EXIM holding yard status and queue | `{"holding_area": { "capacity_trucks": 10, ... }}` |
| `GET` | `/api/network/nodes` | Returns all 24 GIS nodes with Lat/Lng | `{"nodes": [{ "id": "PORT-01", "lat": 17.6965, ... }]}` |
| `GET` | `/api/network/roads` | Returns all 64 road links with congestion levels | `{"roads": [{ "road_id": "R01_F", "traffic_level": 0.35 }]}` |
| `POST` | `/api/optimize` | Runs Multi-Objective Optimization | Body: `{"objective": "BALANCED"}` |
| `GET` | `/api/optimization-result` | Retrieves latest plan & comparative metrics | Returns plans, `mode_basic`, `mode_urbanflow`, and delta |
| `GET` | `/api/explain/{vehicle_id}`| Returns mathematical justification & alternatives | Returns chosen factors & alternative routes table |
| `POST` | `/api/simulate/traffic` | Spikes congestion on key corridor & reroutes | Body: `{"road_id": "R15_F"}` |
| `POST` | `/api/simulate/loading-zone`| Sets loading zone to full & reallocates bays | Body: `{"zone_id": "LZ-03"}` |
| `POST` | `/api/simulate/breakdown`| Triggers truck breakdown & reassigns delivery | Body: `{"vehicle_id": "T-05"}` |
| `POST` | `/api/simulate/scenario/port`| Triggers coordinated port wave with holding buffer| Returns port dispatch sequencing |
| `POST` | `/api/simulate/reset` | Restores city state to initial baseline | `{"status": "success", "message": "Reset complete"}` |
| `GET` | `/api/analytics` | Returns calculated KPIs and chart datasets | Returns travel time, zone util, and congestion data |

---

## 7. Judge Presentation & 3-Minute Live Demo Script

When presenting to Smart India Hackathon evaluators, follow this exact 3-minute sequence:

### Step 1: Establish the Problem & Environment (30 Seconds)
- Open the dashboard at `http://localhost:5173`.
- *"Respected judges, cities face mounting congestion not because there are too many trucks, but because freight movement is uncoordinated. Here is our simulated model of Visakhapatnam, showing the Port, EXIM Holding Yard, Warehouses, and 6 commercial loading zones across the city. Currently, 20 delivery demands need to be fulfilled by 10 trucks with strict time windows."*

### Step 2: Trigger Coordinated Optimization (30 Seconds)
- Click **"Optimize Freight Flow"** in the controls panel.
- *"With one click, our coordination layer matches truck capacities, delivery deadlines, road traffic impedance, and loading bay slots. Notice on the map how active routes are calculated, avoiding congested central corridors."*

### Step 3: Demonstrate Innovation — Basic vs UrbanFlow (45 Seconds)
- Switch to the **Optimization** tab.
- *"Here is the core technical contribution: we compare conventional distance-only routing against UrbanFlow. Under basic routing, trucks blindly take the shortest path to Dwaraka Nagar, causing physical loading conflicts and long idling queues. UrbanFlow reserves arrival slots in advance, completely eliminating bay conflicts and reducing waiting time."*

### Step 4: Live Dynamic Incidents (45 Seconds)
- Click **"Traffic Spike"**: Show the incident notification banner. *"A key arterial just jammed. UrbanFlow detected the affected trucks and autonomously rerouted them via bypasses, saving 15 minutes without dispatcher panic."*
- Click **"Zone Bay Full"**: *"Now Dwaraka Nagar is full. Watch the system automatically redirect the incoming truck to Siripuram without double-parking."*

### Step 5: Decision Transparency & Conclusion (30 Seconds)
- Click **"Explain Decision"** on any vehicle.
- *"UrbanFlow is transparent: judges and fleet managers can see exactly why each route and bay was chosen over alternatives."*
- Conclude: *"UrbanFlow does not replace Google Maps or port software; it is the vital coordination layer that harmonizes them to free up city roads."*

---

## 8. Prototype Limitations & Future Roadmap

### Prototype Scope & Limitations
- **Simulated City Graph**: Uses simulated GIS nodes inspired by Visakhapatnam rather than a live municipal API feed.
- **Single-Tenant Command Center**: Built as a clean operational interface without multi-tenant authentication.
- **Deterministic Speeds**: Road link speeds are calculated based on simulated impedance rather than live GPS telematics feeds.

### Production Scalability Roadmap
1. **OpenStreetMap Overpass & OSRM**: Direct ingestion of real-world road network geometries across any Indian city.
2. **Municipal ITS & ATCS Integration**: Ingesting live traffic counts from municipal CCTV/ANPR cameras and adaptive traffic signals.
3. **Port Terminal Operating System (TOS) Connectors**: Direct API hooks into port gate pass systems.
4. **Predictive Machine Learning**: Incorporating time-series forecasting (LSTM / Transformers) to anticipate bottlenecks 30–60 minutes before they occur.
