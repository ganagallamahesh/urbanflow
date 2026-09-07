import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BarChart3, TrendingUp, ShieldAlert, Award, Clock, Truck } from "lucide-react";
import { api } from "../api/client";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getAnalytics()
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch analytics:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !analytics) {
    return (
      <div className="py-24 text-center text-slate-400 animate-pulse text-sm">
        Computing live freight network analytics...
      </div>
    );
  }

  const kpis = analytics.kpis || {};
  const zoneData = analytics.zone_utilization || [];
  const timeData = analytics.travel_time_distribution || [];
  const congestionData = analytics.congestion_breakdown || [];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <span>Freight Flow Operational Analytics</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Dynamic mathematical performance indicators generated directly from the simulation graph.
        </p>
      </div>

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs font-semibold text-slate-400 uppercase">
            Total Vehicle-Km
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {kpis.total_vehicle_km} <span className="text-xs font-normal text-slate-400">km</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            Calculated multi-leg fleet routing
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs font-semibold text-slate-400 uppercase">
            Avg Travel Time
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {kpis.avg_travel_time_min} <span className="text-xs font-normal text-slate-400">mins</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Avg waiting: {kpis.avg_waiting_time_min} mins
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs font-semibold text-slate-400 uppercase">
            Loading Conflicts Prevented
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {kpis.loading_conflicts_prevented} <span className="text-xs font-normal text-slate-400">conflicts</span>
          </div>
          <div className="text-[11px] text-emerald-300 font-medium mt-1">
            Via proactive bay reservation
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs font-semibold text-slate-400 uppercase">
            Fleet Payload Utilization
          </div>
          <div className="text-2xl font-black text-purple-400 mt-1">
            {kpis.fleet_load_utilization_pct}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Capacity-weighted cargo match
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Loading Bay Utilization */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
          <h3 className="font-bold text-white text-sm mb-4">
            Loading/Unloading Zone Utilization (% Capacity)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="zone_id" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#475569", borderRadius: "8px" }}
                  formatter={(val, name, item) => [`${val}% (${item.payload.name})`, "Utilization"]}
                />
                <Bar dataKey="utilization_pct" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Travel Time Distribution */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
          <h3 className="font-bold text-white text-sm mb-4">
            Fleet Travel Time Distribution (Duration Bins)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#475569", borderRadius: "8px" }}
                  formatter={(val) => [`${val} Trucks`, "Fleet Count"]}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Road Network Congestion Breakdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
          <h3 className="font-bold text-white text-sm mb-4">
            Road Network Congestion Breakdown
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={congestionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {congestionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#475569", borderRadius: "8px" }}
                  formatter={(val) => [`${val} Segments`, "Road Links"]}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "11px", color: "#cbd5e1" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Key Insights & Recommendations */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-sm mb-3 flex items-center space-x-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Coordination Layer Performance Summary</span>
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <span className="font-bold text-white">Curbside Bay Friction:</span> Coordinated loading bay slotting prevented concurrent truck queues at Dwaraka Nagar and Jagadamba commercial zones.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <span className="font-bold text-white">Congestion Bypass:</span> Heavy port container trucks were routed around Convent Junction bottlenecks via the port bypass link.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <span className="font-bold text-white">Off-Dock Staging:</span> The EXIM Holding Yard buffered peak container waves, maintaining city arterial free flow.
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
            Calculated for Smart India Hackathon Student Innovation prototype demonstration.
          </div>
        </div>
      </div>
    </div>
  );
}
