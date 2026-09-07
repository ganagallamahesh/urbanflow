import React from "react";
import { AlertTriangle, Flame, Building, AlertOctagon, X, ArrowRight } from "lucide-react";

export default function IncidentNotification({ incident, onDismiss }) {
  if (!incident) return null;

  let Icon = AlertTriangle;
  let borderColor = "border-amber-500/50";
  let bgColor = "bg-amber-950/40";
  let titleColor = "text-amber-300";

  if (incident.type === "TRAFFIC_SPIKE") {
    Icon = Flame;
    borderColor = "border-red-500/50";
    bgColor = "bg-red-950/40";
    titleColor = "text-red-300";
  } else if (incident.type === "ZONE_SATURATION") {
    Icon = Building;
    borderColor = "border-purple-500/50";
    bgColor = "bg-purple-950/40";
    titleColor = "text-purple-300";
  } else if (incident.type === "VEHICLE_BREAKDOWN") {
    Icon = AlertOctagon;
    borderColor = "border-rose-600/60";
    bgColor = "bg-rose-950/50";
    titleColor = "text-rose-300";
  }

  return (
    <div
      className={`rounded-xl border ${borderColor} ${bgColor} p-4 shadow-2xl mb-4 backdrop-blur-md transition-all animate-fade-in`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 flex-shrink-0">
            <Icon className={`w-5 h-5 ${titleColor}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 text-white border border-slate-700">
                Dynamic Incident Detected
              </span>
              <h4 className={`font-bold text-sm ${titleColor}`}>
                {incident.message}
              </h4>
            </div>

            {/* Before vs After Rerouted Trucks Diff */}
            {incident.rerouted_trucks && incident.rerouted_trucks.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="text-xs font-semibold text-slate-300">
                  Autonomous Re-optimization Diff:
                </div>
                {incident.rerouted_trucks.map((t, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{t.vehicle_name} ({t.vehicle_id})</span>
                      <span className="text-emerald-400 font-mono">
                        ETA: {t.before_eta} → {t.after_eta}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-300 truncate">
                        <span className="font-semibold text-red-400">Before: </span>
                        {t.before_route}
                      </div>
                      <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 truncate">
                        <span className="font-semibold text-emerald-400">After: </span>
                        {t.after_route}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 italic pt-0.5">
                      ✓ {t.reason}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Loading Zone Reallocated Trucks Diff */}
            {incident.reallocated_trucks && incident.reallocated_trucks.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="text-xs font-semibold text-slate-300">
                  Loading Bay Reassignment:
                </div>
                {incident.reallocated_trucks.map((r, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white">{r.vehicle_id}</span> ({r.delivery_id})
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {r.reason}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[11px] border border-purple-500/30">
                        Slot: {r.assigned_time_slot}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Vehicle Breakdown Reallocation */}
            {incident.reassigned && (
              <div className="mt-2 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-rose-400 font-bold">{incident.reassigned.broken_vehicle_id}</span> Workload shifted to{" "}
                  <span className="text-emerald-400 font-bold">{incident.reassigned.reassigned_truck_name}</span>
                </div>
                <div className="font-mono text-white text-[11px]">
                  Updated ETA: {incident.reassigned.new_eta}
                </div>
              </div>
            )}
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
