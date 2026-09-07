import React, { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import {
  Truck,
  Building2,
  Anchor,
  Clock,
  AlertTriangle,
  Layers,
  ArrowRight,
} from "lucide-react";

// Fix default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom HTML SVG icons factory
function createCustomIcon(type, label = "", color = "#10B981") {
  let svgInner = "";
  if (type === "port") {
    svgInner = `<path d="M12 2v20M5 12H2a10 10 0 0 0 20 0h-3M12 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>`;
  } else if (type === "warehouse") {
    svgInner = `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`;
  } else if (type === "loading_zone") {
    svgInner = `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7l7 5z"/>`;
  } else if (type === "holding") {
    svgInner = `<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="12" r="2"/><path d="M15 10v4"/>`;
  } else if (type === "truck") {
    svgInner = `<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>`;
  } else {
    svgInner = `<circle cx="12" cy="12" r="6"/>`;
  }

  return L.divIcon({
    className: "custom-leaflet-div-icon",
    html: `
      <div style="
        background: ${color};
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        cursor: pointer;
        position: relative;
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          ${svgInner}
        </svg>
        ${
          label
            ? `<div style="
                position: absolute;
                bottom: -18px;
                background: #0f172a;
                color: #e2e8f0;
                font-size: 10px;
                font-weight: 700;
                padding: 1px 5px;
                border-radius: 4px;
                border: 1px solid #334155;
                white-space: nowrap;
              ">${label}</div>`
            : ""
        }
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

export default function CityMap({
  nodes = [],
  roads = [],
  vehicles = [],
  loadingZones = [],
  selectedVehicleId = null,
  onSelectVehicle = () => {},
  onExplainRoute = () => {},
  optimizationPlans = [],
}) {
  const nodeMap = useMemo(() => {
    return nodes.reduce((acc, n) => {
      acc[n.id] = n;
      return acc;
    }, {});
  }, [nodes]);

  // Find active route for selected vehicle
  const activePlan = useMemo(() => {
    if (!selectedVehicleId) return null;
    return optimizationPlans.find((p) => p.vehicle_id === selectedVehicleId);
  }, [selectedVehicleId, optimizationPlans]);

  // Selected route coordinates
  const activeRouteCoords = useMemo(() => {
    if (!activePlan || !activePlan.route_nodes) return [];
    return activePlan.route_nodes
      .map((nodeId) => {
        const n = nodeMap[nodeId];
        return n ? [n.lat, n.lng] : null;
      })
      .filter(Boolean);
  }, [activePlan, nodeMap]);

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-slate-900">
      <MapContainer
        center={[17.725, 83.295]}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Road Network Lines with Congestion Colors */}
        {roads.map((road) => {
          const u = nodeMap[road.start_node];
          const v = nodeMap[road.end_node];
          if (!u || !v) return null;

          let color = "#38bdf8"; // default light blue
          let weight = 3.5;
          let opacity = 0.65;

          if (road.traffic_level >= 0.7 || road.is_blocked) {
            color = "#ef4444"; // red
            weight = 5.5;
            opacity = 0.9;
          } else if (road.traffic_level >= 0.4) {
            color = "#f59e0b"; // amber
            weight = 4;
            opacity = 0.8;
          }

          return (
            <Polyline
              key={road.road_id}
              positions={[
                [u.lat, u.lng],
                [v.lat, v.lng],
              ]}
              pathOptions={{
                color,
                weight,
                opacity,
                lineCap: "round",
                lineJoin: "round",
              }}
            >
              <Tooltip sticky>
                <div className="text-xs">
                  <div className="font-bold text-slate-800">{road.name}</div>
                  <div className="text-slate-600">
                    Distance: {road.distance_km} km | Traffic:{" "}
                    <span className="font-bold">
                      {Math.round(road.traffic_level * 100)}%
                    </span>
                  </div>
                  {road.incident_description && (
                    <div className="text-rose-600 font-semibold mt-1">
                      ⚠️ {road.incident_description}
                    </div>
                  )}
                </div>
              </Tooltip>
            </Polyline>
          );
        })}

        {/* Highlight Active Vehicle Route */}
        {activeRouteCoords.length > 1 && (
          <>
            <Polyline
              positions={activeRouteCoords}
              pathOptions={{
                color: "#10b981",
                weight: 6,
                opacity: 0.9,
                dashArray: "12, 12",
              }}
            />
            <Polyline
              positions={activeRouteCoords}
              pathOptions={{
                color: "#6ee7b7",
                weight: 2,
                opacity: 1,
              }}
            />
          </>
        )}

        {/* City Nodes Markers */}
        {nodes.map((node) => {
          let iconType = "junction";
          let color = "#64748b";
          let label = "";

          if (node.type === "port") {
            iconType = "port";
            color = "#0284c7"; // Blue
            label = "Port";
          } else if (node.type === "warehouse") {
            iconType = "warehouse";
            color = "#d97706"; // Amber
            label = "WH";
          } else if (node.type === "loading_zone") {
            iconType = "loading_zone";
            color = "#8b5cf6"; // Purple
            label = "Bay";
          } else if (node.type === "holding") {
            iconType = "holding";
            color = "#0d9488"; // Teal
            label = "Holding";
          } else if (node.type === "customer") {
            iconType = "customer";
            color = "#ec4899"; // Pink
            label = "Drop";
          }

          const icon = createCustomIcon(iconType, label, color);

          return (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              icon={icon}
            >
              <Popup>
                <div className="p-1 max-w-xs">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-100 text-sm">
                    <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-emerald-400">
                      {node.type.replace("_", " ")}
                    </span>
                    <span>{node.name}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {node.description}
                  </p>
                  <div className="text-[11px] text-slate-400 mt-2 font-mono">
                    ID: {node.id} | [{node.lat.toFixed(3)}, {node.lng.toFixed(3)}]
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Simulated Vehicles Markers */}
        {vehicles.map((v) => {
          const loc = nodeMap[v.current_location_id];
          if (!loc) return null;

          // Tiny coordinate jitter to prevent perfect stacking if multiple trucks are at port
          const jitterLat =
            loc.lat + (parseInt(v.vehicle_id.replace("T-", "")) - 5) * 0.0015;
          const jitterLng =
            loc.lng + (parseInt(v.vehicle_id.replace("T-", "")) - 5) * 0.0015;

          let color = "#10b981"; // Green (normal)
          if (v.status === "BREAKDOWN") color = "#ef4444"; // Red
          else if (v.status === "HOLDING") color = "#a855f7"; // Purple
          else if (v.status === "IDLE") color = "#64748b"; // Gray

          const isSelected = selectedVehicleId === v.vehicle_id;
          const icon = createCustomIcon(
            "truck",
            v.vehicle_id,
            isSelected ? "#f59e0b" : color
          );

          return (
            <Marker
              key={v.vehicle_id}
              position={[jitterLat, jitterLng]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectVehicle(v.vehicle_id),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-1.5">
                    <span className="font-bold text-white text-sm">
                      {v.name} ({v.vehicle_id})
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        v.status === "BREAKDOWN"
                          ? "bg-rose-500/30 text-rose-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div>Capacity: <span className="font-semibold text-white">{v.capacity_tons} Tons</span></div>
                    <div>Location: <span className="font-semibold text-white">{loc.name}</span></div>
                    {v.assigned_delivery_id && (
                      <div>Assignment: <span className="text-emerald-400 font-semibold">{v.assigned_delivery_id}</span></div>
                    )}
                    {v.eta && <div>ETA: <span className="font-mono text-white">{v.eta}</span></div>}
                  </div>

                  <div className="mt-3 flex items-center space-x-2">
                    <button
                      onClick={() => onSelectVehicle(v.vehicle_id)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-semibold py-1 px-2 rounded transition"
                    >
                      {isSelected ? "Active Route" : "Highlight Route"}
                    </button>
                    <button
                      onClick={() => onExplainRoute(v.vehicle_id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold py-1 px-2 rounded transition"
                    >
                      Why Selected?
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Floating Legend */}
      <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 backdrop-blur-md text-[11px] shadow-lg max-w-xs pointer-events-auto">
        <div className="font-bold text-slate-200 mb-1.5 flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Visakhapatnam GIS Overlay</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span>Port Terminal</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Warehouse Hub</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span>Loading Zone</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
            <span>EXIM Holding</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-red-500 rounded"></span>
            <span>Congested Road</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-emerald-400 rounded"></span>
            <span>Active Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
