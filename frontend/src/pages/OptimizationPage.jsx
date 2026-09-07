import React from "react";
import ComparisonTable from "../components/ComparisonTable";
import { Cpu, Sparkles, HelpCircle, CheckCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { formatDistance, formatMinutes } from "../utils/formatters";

export default function OptimizationPage({
  optimizationResult = null,
  onOptimize = () => {},
  loading = false,
  activeObjective = "BALANCED",
  setActiveObjective = () => {},
  onExplainRoute = () => {},
}) {
  const plans = optimizationResult?.plans || [];
  const comparison = optimizationResult?.comparison;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Objective Selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>Multi-Objective Freight Optimization Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simultaneously optimizes vehicle capacity, road impedance, delivery time windows, and physical bay reservations.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {[
                { id: "BALANCED", label: "Balanced" },
                { id: "FASTEST", label: "Fastest" },
                { id: "LOWEST_DISTANCE", label: "Lowest Km" },
                { id: "LOWEST_CONGESTION", label: "Low Congest." },
              ].map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => setActiveObjective(obj.id)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition ${
                    activeObjective === obj.id
                      ? "bg-emerald-500 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {obj.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => onOptimize(activeObjective)}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center space-x-2 transition disabled:opacity-50 shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Optimizing..." : "Re-Calculate Plan"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <ComparisonTable comparison={comparison} />

      {/* Coordinated Assignment Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Coordinated Dispatch Schedule ({plans.length} Missions)</span>
          </h3>
          <span className="text-xs text-slate-400">
            Click "Explain Decision" on any plan to see mathematical justification.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.vehicle_id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{plan.vehicle_name}</span>
                    <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {plan.vehicle_id}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-300 mt-1">
                    Shipment: <span className="text-emerald-400">{plan.delivery_title}</span>
                  </div>
                </div>

                <button
                  onClick={() => onExplainRoute(plan.vehicle_id)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Explain Decision</span>
                </button>
              </div>

              {/* Mission Route & Loading Zone */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Loading Zone:</span>
                  <span className="font-semibold text-purple-400">
                    {plan.assigned_loading_zone_id || "Direct Delivery"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Reserved Bay Slot:</span>
                  <span className="font-mono font-bold text-white">
                    {plan.assigned_time_slot || "Immediate"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Distance & Time:</span>
                  <span className="font-mono text-slate-200">
                    {plan.distance_km} km / {plan.travel_time_min} mins
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Scheduled ETA:</span>
                  <span className="font-mono font-bold text-emerald-300">
                    {plan.eta} {plan.is_delayed ? "(Delayed)" : "✓ On-Time"}
                  </span>
                </div>
              </div>

              {/* Route Node Breadcrumbs */}
              <div className="mt-3 pt-2 border-t border-slate-800/50 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Route Path: </span>
                <span className="font-mono text-slate-400">
                  {plan.route_nodes.join(" → ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
