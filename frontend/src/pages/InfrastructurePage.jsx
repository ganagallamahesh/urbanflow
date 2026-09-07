import React from "react";
import { Building2, Anchor, Activity, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

export default function InfrastructurePage({
  loadingZones = [],
  holdingArea = null,
  roads = [],
  onSimulateLoadingZone = () => {},
}) {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-emerald-400" />
          <span>City Infrastructure: Loading Zones & Holding Yard</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Monitoring physical curbside bays, port staging facilities, and road network capacities.
        </p>
      </div>

      {/* 1. Loading & Unloading Zones Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
          <span>Designated Urban Loading/Unloading Zones</span>
          <span className="text-xs text-slate-400 font-normal">
            (Physical Bay Reservations)
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loadingZones.map((z) => {
            const isFull = z.status === "FULL" || z.available_slots === 0;
            const occupancyPct = Math.round(
              (z.current_occupancy / Math.max(1, z.capacity_bays)) * 100
            );

            return (
              <div
                key={z.zone_id}
                className={`bg-slate-900/80 border rounded-xl p-5 shadow-lg flex flex-col justify-between transition ${
                  isFull
                    ? "border-rose-500/60 bg-rose-950/20 shadow-rose-950/40"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs text-purple-400 font-bold">
                        {z.zone_id}
                      </span>
                      <h4 className="font-bold text-white text-sm mt-0.5">{z.name}</h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        isFull
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      }`}
                    >
                      {z.status}
                    </span>
                  </div>

                  {/* Occupancy Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Bay Occupancy:</span>
                      <span className="font-bold text-white">
                        {z.current_occupancy} / {z.capacity_bays} Bays ({occupancyPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          occupancyPct >= 100
                            ? "bg-rose-500"
                            : occupancyPct >= 50
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(100, occupancyPct)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-slate-400 space-y-1">
                    <div>
                      Operating Window:{" "}
                      <span className="text-slate-200 font-medium">{z.operating_hours}</span>
                    </div>
                    <div>
                      Free Time Slots:{" "}
                      <span className="text-emerald-400 font-bold">{z.available_slots}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onSimulateLoadingZone(z.zone_id)}
                    disabled={isFull}
                    className="w-full bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-xs font-semibold py-1.5 px-3 rounded-lg transition disabled:opacity-40"
                  >
                    {isFull ? "Zone Currently Saturated" : "Simulate Zone Full"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. EXIM Port Holding Yard Banner */}
      {holdingArea && (
        <div className="bg-slate-900/80 border border-teal-500/30 rounded-xl p-5 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <Anchor className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{holdingArea.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Off-dock freight staging buffer. Delays and sequences truck dispatch to avoid clogging city arterials.
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-slate-300">
                  <div>
                    Capacity: <span className="font-bold text-white">{holdingArea.capacity_trucks} Trucks</span>
                  </div>
                  <div>
                    Buffered Vehicles:{" "}
                    <span className="font-bold text-teal-400">
                      {holdingArea.queued_truck_ids?.join(", ") || "None"}
                    </span>
                  </div>
                  <div>
                    Status: <span className="font-bold text-emerald-400">{holdingArea.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="px-3 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-bold">
                Buffer Health: Nominal
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Road Network Congestion Health */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
        <h3 className="font-bold text-white text-base mb-3 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Road Network Congestion Status</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
          {roads.map((road) => {
            const congPct = Math.round(road.traffic_level * 100);
            return (
              <div
                key={road.road_id}
                className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-white">{road.name}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {road.distance_km} km | Base Speed: {road.base_speed_kmh} km/h
                  </div>
                  {road.incident_description && (
                    <div className="text-rose-400 text-[11px] font-semibold mt-1">
                      ⚠️ {road.incident_description}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div
                    className={`font-mono font-bold ${
                      congPct >= 70
                        ? "text-red-400"
                        : congPct >= 40
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {congPct}% Traffic
                  </div>
                  <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full ${
                        congPct >= 70
                          ? "bg-red-500"
                          : congPct >= 40
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${congPct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
