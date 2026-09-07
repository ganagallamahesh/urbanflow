import React from "react";
import { Truck, MapPin, AlertOctagon, CheckCircle2, Navigation } from "lucide-react";
import { getStatusBadge } from "../utils/formatters";

export default function VehiclesPage({
  vehicles = [],
  nodes = [],
  onSimulateBreakdown = () => {},
  onSelectVehicle = () => {},
  setActiveTab = () => {},
}) {
  const nodeMap = nodes.reduce((acc, n) => {
    acc[n.id] = n.name;
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            <span>Commercial Vehicle Fleet ({vehicles.length} Trucks)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Fleet tracking, payload capacities, driver statuses, and operational health.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {vehicles.filter((v) => v.status !== "BREAKDOWN").length} Operational
          </span>
          <span className="text-xs px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {vehicles.filter((v) => v.status === "BREAKDOWN").length} Maintenance
          </span>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vehicles.map((v) => {
          const isBroken = v.status === "BREAKDOWN";
          return (
            <div
              key={v.vehicle_id}
              className={`bg-slate-900/80 border rounded-xl p-5 shadow-lg flex flex-col justify-between transition ${
                isBroken
                  ? "border-rose-500/60 bg-rose-950/20 shadow-rose-950/40"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs text-emerald-400 font-bold">
                      {v.vehicle_id}
                    </span>
                    <h3 className="font-bold text-white text-sm mt-0.5">{v.name}</h3>
                    <div className="text-[11px] text-slate-400">{v.type}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(
                      v.status
                    )}`}
                  >
                    {v.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Current Station:</span>
                    <span className="font-semibold text-white truncate max-w-[160px]">
                      {nodeMap[v.current_location_id] || v.current_location_id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Payload Capacity:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {v.capacity_tons} Tons
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Assigned Order:</span>
                    <span className="font-mono font-bold text-white">
                      {v.assigned_delivery_id || "Unassigned / Standby"}
                    </span>
                  </div>

                  {v.eta && (
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Target ETA:</span>
                      <span className="font-mono font-bold text-white">{v.eta}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center space-x-2">
                <button
                  onClick={() => {
                    onSelectVehicle(v.vehicle_id);
                    setActiveTab("dashboard");
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition flex items-center justify-center space-x-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Locate on Map</span>
                </button>

                {!isBroken && (
                  <button
                    onClick={() => onSimulateBreakdown(v.vehicle_id)}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold py-1.5 px-3 rounded-lg transition flex items-center space-x-1"
                    title="Simulate breakdown event"
                  >
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                    <span>Breakdown</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
