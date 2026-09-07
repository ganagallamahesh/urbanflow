# UrbanFlow — Urban Freight Flow Coordination Platform
> **Smart India Hackathon Prototype**  
> *Student Innovation — Submit your ideas to address the growing pressures on the city’s resources, transport networks, and logistic infrastructure.*

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/ganagallamahesh/urbanflow)

---


## 1. Executive Summary & Core Concept

Existing municipal traffic, logistics, and port systems operate in silos:
- **Port Authorities** manage vessel discharge and gate operations independently.
- **Traffic Control Systems (ITS)** focus on passenger congestion and traffic signal cycles.
- **Warehouses & Commercial Establishments** have fixed loading/unloading bays without knowing incoming truck arrival times.
- **Private Fleet Operators** navigate using shortest-path consumer mapping tools that ignore curbside bay availability.

**UrbanFlow** demonstrates a **common coordination layer** that brings these components together. It does not replace Google Maps, municipal ITS, or port operating systems; rather, it coordinates:
- Freight & delivery requests
- Vehicle capacities & statuses
- Dynamic road network congestion & impedance
- Curbside loading/unloading bay capacities & time slots
- Off-dock port holding & truck buffer yards

---

## 2. Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                           UrbanFlow Frontend (React + Vite)                      |
|  - Operations Dashboard & KPI Cards         - Leaflet Interactive Map             |
|  - Basic vs UrbanFlow Comparison View       - Dynamic Simulation Control Console |
|  - Route Explainability Inspector          - Analytics & Recharts Performance     |
+------------------------------------------+----------------------------------------+
                                           | REST APIs
                                           v
+-----------------------------------------------------------------------------------+
|                           FastAPI Backend (Python 3.11)                           |
|  - /api/optimize (Basic vs Coordinated)     - /api/simulate (Traffic/Zones/Break) |
|  - /api/network (Nodes, Edges, Traffic)     - /api/fleet (Vehicles, Deliveries)   |
|  - /api/infrastructure (Zones, Holding)     - /api/analytics (Dynamic KPIs)       |
+------------------------------------------+----------------------------------------+
                                           |
                    +----------------------+----------------------+
                    v                                             v
+------------------------------------------+ +--------------------------------------+
|       Modular Optimization Engine        | |        Simulated City Data Layer     |
| - Multi-Objective Dijkstra / Cost Router | | - Visakhapatnam Geo Network Graph    |
| - Loading Bay Slot Reservation Allocator | | - 10 Trucks (Capacity, State)        |
| - Dynamic Congestion Penalty Evaluator   | | - 20 Deliveries (Windows, Priority)  |
| - Queue / Holding Area Sequencer         | | - 6 Loading Zones & Holding Yard     |
| - Vehicle Breakdown Failover Handler     | | - SQLite / In-Memory State Store     |
+------------------------------------------+ +--------------------------------------+
```

---

## 3. Technologies Used

- **Frontend**:
  - **React 18 + Vite 6**: High-performance single page application.
  - **Tailwind CSS**: Modern command-center dark UI.
  - **Leaflet & React-Leaflet**: Interactive GIS city map with custom SVG markers, colored traffic polylines, and animated active routes.
  - **Recharts**: Responsive SVG charts for fleet analytics.
  - **Lucide React**: Crisp iconography.
- **Backend**:
  - **Python 3.11 + FastAPI**: High-performance asynchronous REST API.
  - **NetworkX**: Directed graph data structure for pathfinding and impedance calculations.
  - **Uvicorn**: ASGI web server.
  - **Pydantic v2**: Type-safe entity modeling and validation.

---

## 4. How the Optimization Works

The optimization engine performs a **multi-criteria scheduling and routing pass**:

### A. Cost Objective Function
For each candidate route and assignment:
$$\text{Cost} = w_{\text{dist}} \cdot \text{Distance} + w_{\text{time}} \cdot \text{TravelTime} + w_{\text{cong}} \cdot \text{CongestionPenalty} + w_{\text{wait}} \cdot \text{WaitPenalty} + w_{\text{conflict}} \cdot \text{BayConflictPenalty} + w_{\text{late}} \cdot \text{LatePenalty}$$

Where:
- $\text{CongestionPenalty} = (\text{TrafficLevel}^{1.8}) \times 20.0$ (penalizes corridors exceeding 60% saturation).
- $\text{BayConflictPenalty} = 50.0$ (triggered if a vehicle arrives at a loading bay without an open slot).
- $\text{LatePenalty} = 40.0$ (triggered if arrival time breaches the guaranteed delivery time window).

### B. Proactive Curbside Bay Slot Reservation
1. Trucks reserve a 20-minute physical loading bay slot upon expected arrival.
2. If the destination loading zone is full, UrbanFlow:
   - Evaluates nearby alternative loading zones within a 5 km radius.
   - If an alternative has a free bay, the truck is automatically diverted without creating curbside double-parking gridlock.
   - If no alternative is available and the vehicle departs from the port, it buffers at the **EXIM Staging & Holding Yard (`HOLD-01`)** until an arrival slot opens.

### C. Mode Comparison (Basic Routing vs UrbanFlow)
- **Mode 1: Basic Routing** (Distance only, ignores traffic jams, blindly rushes to loading bays causing queue conflicts).
- **Mode 2: UrbanFlow Unified Coordination** (Multi-objective, balances road impedance and physical bay capacity).
- **Zero hardcoding**: All comparison metrics (distance, travel time, idle waiting, conflicts avoided, late deliveries) are computed in real time.

---

## 5. Project Directory Structure

```text
urbanflow/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI router endpoints & CORS
│   │   ├── models/
│   │   │   ├── entities.py          # Truck, Delivery, Road, Node, Bay schemas
│   │   │   └── optimization.py      # Requests, Results, Comparison metrics
│   │   ├── data/
│   │   │   ├── visakhapatnam_geo.py # Realistic Visakhapatnam nodes, roads, bays
│   │   │   └── seed_data.py         # 10 trucks, 20 deliveries
│   │   └── engine/
│   │       ├── graph_router.py      # NetworkX multi-objective Dijkstra router
│   │       ├── optimizer.py         # UrbanFlow coordination logic & comparison
│   │       └── simulation.py        # Dynamic incident events & preset scenarios
│   ├── requirements.txt
│   ├── run_backend.py               # Standalone runner
│   └── test_backend.py              # Automated test suite
├── frontend/
│   ├── src/
│   │   ├── api/client.js            # API client connecting to FastAPI
│   │   ├── components/              # Map, Cards, Controls, Comparison Table, Modal
│   │   ├── pages/                   # Dashboard, Freight, Vehicles, Infrastructure, Optimization, Analytics, About
│   │   ├── utils/formatters.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── README.md
└── start_demo.bat                   # 1-Click launcher for both backend & frontend
```

---

## 6. Installation & Quick Start

### Prerequisites
- **Python 3.10+** (tested on Python 3.11)
- **Node.js 18+** (tested on Node.js 24)

### Step 1: Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## 7. How to Run

### Option A: 1-Click Launcher (Windows)
Double-click `start_demo.bat` in the root `urbanflow/` directory. It will launch both the FastAPI backend and the Vite frontend.

### Option B: Manual Launch

**Terminal 1 — Backend:**
```bash
cd urbanflow/backend
python run_backend.py
```
*Backend runs on `http://127.0.0.1:8000` (Swagger docs available at `http://127.0.0.1:8000/docs`).*

**Terminal 2 — Frontend:**
```bash
cd urbanflow/frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 8. Sample 3-Minute SIH Presentation Script

1. **Open the Dashboard (`http://localhost:5173`)**:
   - *"Here is our simulated urban freight environment modeled after Visakhapatnam, featuring the Visakhapatnam Port Container Terminal, EXIM Staging Yard, industrial warehouses, and 6 commercial loading zones across the city."*
2. **Click "Optimize Freight Flow"**:
   - *"Notice how the system simultaneously matches truck capacities, delivery time windows, and loading bay slots. Every vehicle has an optimal route rendered on the GIS map."*
3. **Open the "Optimization" Tab**:
   - *"Here is the side-by-side comparison between conventional distance-only routing and UrbanFlow. Conventional routing causes severe loading bay conflicts and queue idling. UrbanFlow eliminates bay conflicts by reserving arrival slots in advance."*
4. **Demonstrate Dynamic Incident 1: "Traffic Spike"**:
   - *"Click **Traffic Spike**. A major corridor experiences severe congestion. Watch the notification appear as the engine automatically reroutes affected vehicles to open arterials and updates their ETAs."*
5. **Demonstrate Dynamic Incident 2: "Zone Bay Full"**:
   - *"Click **Zone Bay Full**. The Dwaraka Nagar loading zone is saturated. The system detects the arrival conflict and immediately reroutes incoming trucks to the nearby Siripuram bay, avoiding curbside congestion."*
6. **Demonstrate Dynamic Incident 3: "Breakdown Failover"**:
   - *"Click **Breakdown Failover**. When Truck T-05 experiences a mechanical breakdown, its cargo is autonomously reassigned to standby vehicle T-08 with updated routing."*
7. **Inspect "Decision Explainability"**:
   - *"Click **Explain Decision** on any plan. UrbanFlow is not a black box: it displays the mathematical reasons, time window margins, and alternative routes evaluated."*
8. **Final Message**:
   - *"UrbanFlow proves that cities do not need to replace existing systems. By introducing a common coordination layer, municipal infrastructure, ports, and private fleets can move goods with minimal congestion and zero double-parking."*

---

## 9. Known Prototype Limitations

- **Simulated Environment**: Uses a simulated road graph inspired by Visakhapatnam rather than a live municipal API feed.
- **Single-Tenant Prototype**: Built as an operational command center without multi-tenant authentication.
- **Static Road Speeds**: Speeds are calculated based on simulated impedance rather than live GPS probe feeds.

---

## 10. Future Scalability Roadmap

1. **Integration with OpenStreetMap Overpass API & OSRM**: Direct ingestion of real-world road geometries across any Indian metropolitan area.
2. **Municipal ITS API Ingestion**: Connecting to municipal smart city traffic camera feeds (ANPR) and traffic signal controllers (ATCS).
3. **Port Terminal Operating System (TOS) Connectors**: Direct EDI/API hooks into Port Authority gate pass systems.
4. **Machine Learning Congestion Prediction**: Incorporating historical time-series forecasting (LSTM / Transformers) to anticipate road bottlenecks before they form.
