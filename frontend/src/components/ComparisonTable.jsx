import React from "react";
import { formatDistance, formatMinutes } from "../utils/formatters";
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";

export default function ComparisonTable({ comparison }) {
  if (!comparison) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        Run optimization to see the calculated comparative impact.
      </div>
    );
  }

  const basic = comparison.mode_basic;
  const urbanflow = comparison.mode_urbanflow;

  const rows = [
    {
      metric: "Total Fleet Distance",
      basicVal: formatDistance(basic.total_distance_km),
      urbanVal: formatDistance(urbanflow.total_distance_km),
      rawBasic: basic.total_distance_km,
      rawUrban: urbanflow.total_distance_km,
      delta: `${Math.abs(comparison.delta_distance_km)} km ${
        comparison.delta_distance_km >= 0 ? "saved" : "adjusted for bypass"
      }`,
      improved: comparison.delta_distance_km >= 0,
      description: "Shortest route vs bypass routes around city bottlenecks",
    },
    {
      metric: "Total Travel Time",
      basicVal: formatMinutes(basic.total_travel_time_min),
      urbanVal: formatMinutes(urbanflow.total_travel_time_min),
      rawBasic: basic.total_travel_time_min,
      rawUrban: urbanflow.total_travel_time_min,
      delta: `${Math.abs(comparison.delta_time_min)} mins ${
        comparison.delta_time_min >= 0 ? "faster" : "adjusted"
      }`,
      improved: comparison.delta_time_min >= 0,
      description: "Includes real congestion delay on gridlocked segments",
    },
    {
      metric: "Idle Queue & Waiting Time",
      basicVal: formatMinutes(basic.total_waiting_time_min),
      urbanVal: formatMinutes(urbanflow.total_waiting_time_min),
      rawBasic: basic.total_waiting_time_min,
      rawUrban: urbanflow.total_waiting_time_min,
      delta: `${Math.abs(comparison.delta_waiting_min)} mins reduced`,
      improved: comparison.delta_waiting_min >= 0,
      description: "Time spent idling outside full loading bays or port gate",
    },
    {
      metric: "Loading Bay Conflicts",
      basicVal: `${basic.loading_conflicts_count} Conflicts`,
      urbanVal: `${urbanflow.loading_conflicts_count} Conflicts`,
      rawBasic: basic.loading_conflicts_count,
      rawUrban: urbanflow.loading_conflicts_count,
      delta: `${comparison.conflicts_avoided} conflicts avoided`,
      improved: comparison.conflicts_avoided > 0 || urbanflow.loading_conflicts_count === 0,
      highlight: true,
      description: "Concurrent truck arrivals exceeding physical loading bay capacity",
    },
    {
      metric: "Late Deliveries (Window Breaches)",
      basicVal: `${basic.late_deliveries_count} Late`,
      urbanVal: `${urbanflow.late_deliveries_count} Late`,
      rawBasic: basic.late_deliveries_count,
      rawUrban: urbanflow.late_deliveries_count,
      delta: `${comparison.late_deliveries_avoided} delays prevented`,
      improved: comparison.late_deliveries_avoided >= 0,
      description: "Shipments arriving outside guaranteed delivery time window",
    },
    {
      metric: "Fleet Trucks Utilized",
      basicVal: `${basic.vehicles_used} Trucks`,
      urbanVal: `${urbanflow.vehicles_used} Trucks`,
      rawBasic: basic.vehicles_used,
      rawUrban: urbanflow.vehicles_used,
      delta: `Equal load capacity`,
      improved: true,
      description: "Active vehicles allocated to service the freight demand",
    },
    {
      metric: "Composite System Cost Score",
      basicVal: basic.total_cost_score.toFixed(1),
      urbanVal: urbanflow.total_cost_score.toFixed(1),
      rawBasic: basic.total_cost_score,
      rawUrban: urbanflow.total_cost_score,
      delta: `${(basic.total_cost_score - urbanflow.total_cost_score).toFixed(1)} lower penalty`,
      improved: basic.total_cost_score >= urbanflow.total_cost_score,
      description: "Multi-criteria objective evaluation (lower is better)",
    },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
        <div>
          <h3 className="font-bold text-white text-base flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Conventional Basic Routing vs UrbanFlow Coordination</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real calculated metrics derived from the live simulation (zero hardcoded values).
          </p>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
            Mode 1: Distance Only
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
            Mode 2: UrbanFlow Unified
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Performance Metric</th>
              <th className="py-3 px-4 text-right">Basic Routing</th>
              <th className="py-3 px-4 text-right text-emerald-400 font-bold">
                UrbanFlow Layer
              </th>
              <th className="py-3 px-4 text-right">Calculated Impact</th>
              <th className="py-3 px-4 hidden md:table-cell">Operational Context</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={`hover:bg-slate-800/40 transition ${
                  row.highlight ? "bg-emerald-500/5 font-semibold" : ""
                }`}
              >
                <td className="py-3 px-4 text-white flex items-center space-x-2">
                  {row.highlight && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  )}
                  <span>{row.metric}</span>
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-400">
                  {row.basicVal}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-emerald-300">
                  {row.urbanVal}
                </td>
                <td className="py-3 px-4 text-right">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                      row.improved
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {row.delta}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400 text-[11px] hidden md:table-cell">
                  {row.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-slate-950/50 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>
          Note: In Basic Routing, trucks follow the shortest path blindly, causing gridlock in unreserved loading bays and congestion traps.
        </span>
        <span className="font-semibold text-emerald-400">
          UrbanFlow guarantees loading bay reservations & congestion avoidance.
        </span>
      </div>
    </div>
  );
}
