import React from "react";
import { Truck, Package, Building2, AlertTriangle } from "lucide-react";

export default function SummaryCards({
  vehicles = [],
  deliveries = [],
  loadingZones = [],
  traffic = {},
  activeIncident = null,
}) {
  const activeTrucks = vehicles.filter((v) => v.status !== "BREAKDOWN").length;
  const inTransitTrucks = vehicles.filter((v) => v.status === "IN_TRANSIT").length;
  const totalDeliveries = deliveries.length;
  const criticalDeliveries = deliveries.filter((d) => d.priority === "CRITICAL").length;

  const totalBays = loadingZones.reduce((acc, z) => acc + (z.capacity_bays || 0), 0);
  const occupiedBays = loadingZones.reduce((acc, z) => acc + (z.current_occupancy || 0), 0);
  const freeBays = Math.max(0, totalBays - occupiedBays);

  const congestedCount = traffic.congested_corridors?.length || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Active Vehicles Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Fleet
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-black text-white">{activeTrucks}</span>
          <span className="text-xs text-slate-400">/ {vehicles.length} Trucks</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span className="text-emerald-400 font-medium">{inTransitTrucks} In Transit</span>
          <span>{vehicles.length - activeTrucks} Unavailable</span>
        </div>
      </div>

      {/* Pending Deliveries Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Freight Requests
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-black text-white">{totalDeliveries}</span>
          <span className="text-xs text-slate-400">Shipments</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span className="text-rose-400 font-medium">{criticalDeliveries} Critical Priority</span>
          <span>Time-window bounded</span>
        </div>
      </div>

      {/* Available Loading Zones Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Loading Bays
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-black text-white">{freeBays}</span>
          <span className="text-xs text-slate-400">/ {totalBays} Bays Free</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span className="text-purple-400 font-medium">{loadingZones.length} Designated Zones</span>
          <span>{occupiedBays} Occupied</span>
        </div>
      </div>

      {/* Traffic & Incident Alerts Card */}
      <div className={`border rounded-xl p-4 shadow-sm transition ${
        activeIncident
          ? "bg-rose-950/20 border-rose-500/40"
          : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Traffic Alerts
          </span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            congestedCount > 0 ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"
          }`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-black text-white">{congestedCount}</span>
          <span className="text-xs text-slate-400">Bottlenecks</span>
        </div>
        <div className="mt-2 text-xs truncate">
          {activeIncident ? (
            <span className="text-rose-400 font-medium animate-pulse">
              ● {activeIncident.type || "Live Incident Active"}
            </span>
          ) : (
            <span className="text-slate-400">
              Avg Index: {traffic.average_traffic ? `${Math.round(traffic.average_traffic * 100)}%` : "Normal"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
