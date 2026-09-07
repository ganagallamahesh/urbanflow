import React from "react";
import { Info, ShieldAlert, Award, Layers, Cpu, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-4xl mx-auto">
      {/* Problem Statement Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl space-y-3">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Smart India Hackathon Problem Statement</span>
        </div>
        <h2 className="text-xl font-black text-white">
          "Student Innovation — Submit your ideas to address the growing pressures on the city’s resources, transport networks, and logistic infrastructure."
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Urban freight movement is one of the greatest contributors to city traffic gridlock, curbside double-parking, and infrastructure wear. Current operations are fragmented: traffic police manage signals, ports manage berths, warehouses manage docks, and fleet operators manage trucks independently.
        </p>
      </div>

      {/* Core Concept & Architecture */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span>The UrbanFlow Solution: A Unified Coordination Layer</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          UrbanFlow does <strong>not</strong> replace Google Maps, port operating systems (TOS), municipal traffic cameras, or private fleet ERPs. Instead, it acts as a common coordination and scheduling layer that aligns these disparate systems:
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
          <pre className="text-center leading-relaxed">
{`MUNICIPAL TRAFFIC     PORT FREIGHT     WAREHOUSE BAYS     TRUCK FLEETS
       \\                   |                |                  /
        \\                  |                |                 /
         v                 v                v                v
   +-------------------------------------------------------------+
   |             UrbanFlow Unified Coordination Layer            |
   |   - Multi-Objective Routing    - Dynamic Bay Reservations   |
   |   - Off-Dock Yard Buffering    - Breakdown Failover Shift   |
   +-------------------------------------------------------------+
                                   |
                                   v
   +-------------------------------------------------------------+
   |          Harmonized City Freight Movement Decisions         |
   |     (Zero Curbside Gridlock, Low Bottleneck Penetration)    |
   +-------------------------------------------------------------+`}
          </pre>
        </div>
      </div>

      {/* 3-Minute SIH Demo Story Guide */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          <span>3-Minute Live Presentation Script for Judges</span>
        </h3>
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="font-bold text-emerald-400">Step 1 — Baseline: </span>
            "Here is a simulated map of Visakhapatnam showing the Port, EXIM Holding Yard, Warehouses, and 6 commercial loading zones. Currently, there are 20 pending delivery requests and 10 trucks."
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="font-bold text-emerald-400">Step 2 — Optimization: </span>
            "Click <strong>Optimize Freight Flow</strong>. Watch the backend engine calculate assignments, routes, and loading bay reservation slots."
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="font-bold text-emerald-400">Step 3 — Comparison: </span>
            "Open the <strong>Optimization tab</strong>. Compare <em>Basic Routing</em> (distance-only) against <em>UrbanFlow</em>. Notice how UrbanFlow prevents physical bay conflicts and idling queues."
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="font-bold text-emerald-400">Step 4 — Traffic Incident: </span>
            "Click <strong>Simulate Traffic Increase</strong>. A major corridor spikes to 95% traffic. The system autonomously reroutes affected trucks and updates ETAs without dispatcher panics."
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="font-bold text-emerald-400">Step 5 — Loading Zone Full: </span>
            "Click <strong>Zone Bay Full</strong>. The system detects a conflict at Dwaraka Nagar and immediately reroutes the arriving vehicle to Siripuram with zero curbside double-parking."
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="font-bold text-emerald-400">Step 6 — Explainability: </span>
            "Click <strong>Explain Decision</strong> on any route to demonstrate our transparent multi-criteria objective score."
          </div>
        </div>
      </div>

      {/* Prototype Limitations Disclaimer */}
      <div className="bg-rose-950/20 border border-rose-500/40 rounded-xl p-5 text-xs text-rose-200 space-y-2">
        <div className="flex items-center space-x-2 font-bold text-rose-300">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Research Prototype Scope & Limitations</span>
        </div>
        <p className="leading-relaxed">
          This prototype uses a simulated city environment inspired by Visakhapatnam to demonstrate the urban freight coordination concept. It is not connected to live municipal, port or private logistics systems. Real-world deployment would require integration with authorized municipal traffic cameras (ITS), port terminal operating systems (TOS), and logistics telematics data.
        </p>
      </div>
    </div>
  );
}
