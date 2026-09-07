import React, { useState } from "react";
import {
  Play,
  Flame,
  Building,
  AlertOctagon,
  Anchor,
  RotateCcw,
  Sliders,
  Sparkles,
} from "lucide-react";

export default function SimulationControls({
  onOptimize,
  onSimulateTraffic,
  onSimulateLoadingZone,
  onSimulateBreakdown,
  onSimulatePortScenario,
  onSetTrafficPreset,
  onReset,
  loading = false,
  activeObjective = "BALANCED",
  setActiveObjective = () => {},
}) {
  const [trafficPreset, setTrafficPreset] = useState("MEDIUM");

  const handleTrafficPresetChange = (lvl) => {
    setTrafficPreset(lvl);
    onSetTrafficPreset(lvl);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-white text-sm">
            Operational Optimization & Simulation Controls
          </h3>
        </div>
        <span className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          SIH Live Scenarios
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Core Optimization Button & Objective */}
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <label className="text-xs font-semibold text-slate-300 block">
            Coordination Objective:
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: "BALANCED", label: "Balanced" },
              { id: "FASTEST", label: "Fastest ETA" },
              { id: "LOWEST_DISTANCE", label: "Shortest Km" },
              { id: "LOWEST_CONGESTION", label: "Low Congest." },
            ].map((obj) => (
              <button
                key={obj.id}
                onClick={() => setActiveObjective(obj.id)}
                className={`text-[11px] font-semibold py-1.5 px-2 rounded-md transition ${
                  activeObjective === obj.id
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {obj.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => onOptimize(activeObjective)}
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 text-xs shadow-lg shadow-emerald-500/20 active:scale-98 transition disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Calculating Coordination Layer..." : "Optimize Freight Flow"}</span>
          </button>
        </div>

        {/* 2. City Traffic Presets */}
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <label className="text-xs font-semibold text-slate-300 block">
            Baseline Traffic Load:
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {["LOW", "MEDIUM", "HIGH"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleTrafficPresetChange(lvl)}
                className={`text-[11px] font-semibold py-1.5 px-2 rounded-md transition ${
                  trafficPreset === lvl
                    ? "bg-blue-600 text-white shadow"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 pt-1">
            Updates network edge flow densities and recalculates live impedance factors.
          </p>
        </div>

        {/* 3. Live Demonstration Scenarios */}
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 md:col-span-2 lg:col-span-1">
          <label className="text-xs font-semibold text-slate-300 block">
            Interactive SIH Scenarios:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onSimulateTraffic}
              disabled={loading}
              className="flex items-center space-x-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 p-2 rounded-lg text-[11px] font-semibold transition active:scale-95 text-left disabled:opacity-50"
              title="Simulate Traffic Spike & Auto-Reroute"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">Traffic Spike</span>
            </button>

            <button
              onClick={onSimulateLoadingZone}
              disabled={loading}
              className="flex items-center space-x-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 p-2 rounded-lg text-[11px] font-semibold transition active:scale-95 text-left disabled:opacity-50"
              title="Simulate Loading Zone Full"
            >
              <Building className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <span className="truncate">Zone Bay Full</span>
            </button>

            <button
              onClick={onSimulateBreakdown}
              disabled={loading}
              className="flex items-center space-x-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 p-2 rounded-lg text-[11px] font-semibold transition active:scale-95 text-left disabled:opacity-50"
              title="Simulate Vehicle Breakdown"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span className="truncate">Breakdown Failover</span>
            </button>

            <button
              onClick={onSimulatePortScenario}
              disabled={loading}
              className="flex items-center space-x-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 p-2 rounded-lg text-[11px] font-semibold transition active:scale-95 text-left disabled:opacity-50"
              title="Simulate Port-to-Warehouse Wave"
            >
              <Anchor className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
              <span className="truncate">Port Staging Wave</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
