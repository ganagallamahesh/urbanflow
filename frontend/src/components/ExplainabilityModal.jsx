import React, { useEffect, useState } from "react";
import { X, HelpCircle, CheckCircle, Navigation, Shield, Clock } from "lucide-react";
import { api } from "../api/client";

export default function ExplainabilityModal({ vehicleId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!vehicleId) return;
    setLoading(true);
    setError(null);
    api
      .getExplainRoute(vehicleId)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load explainability metrics");
        setLoading(false);
      });
  }, [vehicleId]);

  if (!vehicleId) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                Decision Explainability Inspector
              </h3>
              <p className="text-xs text-slate-400">
                Why was this route and loading bay assigned to{" "}
                <span className="text-emerald-400 font-semibold">
                  {vehicleId}
                </span>
                ?
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {loading && (
            <div className="py-12 text-center text-slate-400 text-sm animate-pulse">
              Analyzing route impedance factors & coordination constraints...
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
              {error}
            </div>
          )}

          {data && (
            <>
              {/* Mission Summary Card */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="text-slate-400">Vehicle:</div>
                  <div className="font-bold text-white mt-0.5">{data.vehicle_name}</div>
                </div>
                <div>
                  <div className="text-slate-400">Assigned Cargo:</div>
                  <div className="font-bold text-emerald-400 mt-0.5 truncate">
                    {data.delivery_title}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Loading Bay:</div>
                  <div className="font-bold text-purple-400 mt-0.5">
                    {data.assigned_loading_zone || "Direct Yard"}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Reserved Slot:</div>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {data.assigned_time_slot || "Immediate"}
                  </div>
                </div>
              </div>

              {/* Rationale Bullet Points */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Primary Optimization Factors</span>
                </h4>
                <div className="space-y-2">
                  {data.reasons.map((reason, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 text-xs text-slate-200"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternatives Evaluated Table */}
              {data.alternative_paths_evaluated &&
                data.alternative_paths_evaluated.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                      <Navigation className="w-3.5 h-3.5 text-blue-400" />
                      <span>Alternative Network Paths Evaluated</span>
                    </h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-800">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                          <tr>
                            <th className="p-2.5">Corridor Route</th>
                            <th className="p-2.5 text-right">Distance</th>
                            <th className="p-2.5 text-right">Travel Time</th>
                            <th className="p-2.5 text-right">Avg Congestion</th>
                            <th className="p-2.5 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {data.alternative_paths_evaluated.map((alt, idx) => {
                            const isChosen = idx === 0;
                            return (
                              <tr
                                key={idx}
                                className={isChosen ? "bg-emerald-500/10 font-bold text-white" : ""}
                              >
                                <td className="p-2.5">{alt.via}</td>
                                <td className="p-2.5 text-right font-mono">{alt.distance_km} km</td>
                                <td className="p-2.5 text-right font-mono">{alt.travel_time_min} mins</td>
                                <td className="p-2.5 text-right font-mono">
                                  {Math.round(alt.avg_traffic * 100)}%
                                </td>
                                <td className="p-2.5 text-center">
                                  {isChosen ? (
                                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                      Optimal Chosen
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                                      Higher Impedance
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
