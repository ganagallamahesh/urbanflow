import React, { useState, useMemo } from "react";
import { Package, Search, Filter, Clock, MapPin, AlertCircle } from "lucide-react";
import { getPriorityBadge, getStatusBadge } from "../utils/formatters";

export default function FreightPage({ deliveries = [], nodes = [] }) {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const nodeMap = useMemo(() => {
    return nodes.reduce((acc, n) => {
      acc[n.id] = n.name;
      return acc;
    }, {});
  }, [nodes]);

  const filtered = deliveries.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.delivery_id.toLowerCase().includes(search.toLowerCase());
    const matchesPriority =
      priorityFilter === "ALL" || d.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Package className="w-5 h-5 text-emerald-400" />
              <span>Freight Operations & Delivery Demands</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulated commercial, port, and FMCG consignments requiring urban dispatch.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search delivery or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-emerald-500 w-48 sm:w-64"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="EXPRESS">Express</option>
              <option value="STANDARD">Standard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Shipment ID</th>
                <th className="py-3 px-4">Cargo Description</th>
                <th className="py-3 px-4">Origin Node</th>
                <th className="py-3 px-4">Destination Target</th>
                <th className="py-3 px-4 text-right">Payload</th>
                <th className="py-3 px-4 text-center">Time Window</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.map((d) => (
                <tr key={d.delivery_id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                    {d.delivery_id}
                  </td>
                  <td className="py-3 px-4 font-medium text-white max-w-xs truncate">
                    {d.title}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span className="truncate">{nodeMap[d.origin_node_id] || d.origin_node_id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span className="truncate">{nodeMap[d.destination_node_id] || d.destination_node_id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white">
                    {d.weight_tons} Tons
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      {d.time_window_start} - {d.time_window_end}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(
                        d.priority
                      )}`}
                    >
                      {d.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(
                        d.status
                      )}`}
                    >
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400 flex items-center justify-between">
          <span>Showing {filtered.length} of {deliveries.length} total deliveries</span>
          <span>Delivery requests simulate variable time commitments and payload weights.</span>
        </div>
      </div>
    </div>
  );
}
