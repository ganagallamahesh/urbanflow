import React, { useState, useEffect } from "react";
import {
  Layers,
  Truck,
  Package,
  Building2,
  Cpu,
  BarChart3,
  Info,
  RotateCcw,
  Clock,
  Radio,
} from "lucide-react";

export default function Navbar({
  activeTab,
  setActiveTab,
  onReset,
  isResetting,
  simTime = "09:30 AM",
}) {
  const [online, setOnline] = useState(true);

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tag */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/40">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">
                  UrbanFlow
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  SIH Prototype
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Urban Freight Flow Coordination & Optimization Platform
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: Layers },
              { id: "freight", label: "Freight", icon: Package },
              { id: "vehicles", label: "Vehicles", icon: Truck },
              { id: "infrastructure", label: "Infrastructure", icon: Building2 },
              { id: "optimization", label: "Optimization", icon: Cpu },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
              { id: "about", label: "About", icon: Info },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === id
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Right Controls: Sim Time & Reset */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sim Time:</span>
              <span className="font-mono font-bold text-white">{simTime}</span>
            </div>

            <button
              onClick={onReset}
              disabled={isResetting}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition active:scale-95 disabled:opacity-50"
              title="Reset Simulation State"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin text-emerald-400" : ""}`} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Mobile Submenu Navigation */}
        <div className="md:hidden flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-800 scrollbar-none">
          {[
            { id: "dashboard", label: "Dashboard" },
            { id: "freight", label: "Freight" },
            { id: "vehicles", label: "Vehicles" },
            { id: "infrastructure", label: "Infrastructure" },
            { id: "optimization", label: "Optimization" },
            { id: "analytics", label: "Analytics" },
            { id: "about", label: "About" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
                activeTab === id
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
