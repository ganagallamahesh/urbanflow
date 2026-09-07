import React from "react";
import SummaryCards from "../components/SummaryCards";
import CityMap from "../components/CityMap";
import SimulationControls from "../components/SimulationControls";
import IncidentNotification from "../components/IncidentNotification";
import { Truck, CheckCircle2, AlertCircle, ArrowUpRight, HelpCircle } from "lucide-react";
import { formatDistance, formatMinutes } from "../utils/formatters";

export default function DashboardPage({
  vehicles = [],
  deliveries = [],
  loadingZones = [],
  roads = [],
  nodes = [],
  traffic = {},
  activeIncident = null,
  onDismissIncident = () => {},
  optimizationResult = null,
  selectedVehicleId = null,
  onSelectVehicle = () => {},
  onExplainRoute = () => {},
  onOptimize = () => {},
  onSimulateTraffic = () => {},
  onSimulateLoadingZone = () => {},
  onSimulateBreakdown = () => {},
  onSimulatePortScenario = () => {},
  onSetTrafficPreset = () => {},
  onReset = () => {},
  loading = false,
  activeObjective = "BALANCED",
  setActiveObjective = () => {},
}) {
  const plans = optimizationResult?.plans || [];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Incident Alert Notification Banner */}
      <IncidentNotification
        incident={activeIncident}
        onDismiss={onDismissIncident}
      />

      {/* 2. Top Summary KPI Cards */}
      <SummaryCards
        vehicles={vehicles}
        deliveries={deliveries}
        loadingZones={loadingZones}
        traffic={traffic}
        activeIncident={activeIncident}
      />

      {/* 3. Main Centerpiece: Interactive GIS Map & Sidebar Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-white text-base">
                  Visakhapatnam Freight Flow Operational Map
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time network impedance, active corridors, and vehicle positions.
                </p>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                {selectedVehicleId && (
                  <button
                    onClick={() => onSelectVehicle(null)}
                    className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                  >
                    Clear Filter
                  </button>
                )}
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  {nodes.length} Nodes | {roads.length} Links
                </span>
              </div>
            </div>

            <CityMap
              nodes={nodes}
              roads={roads}
              vehicles={vehicles}
              loadingZones={loadingZones}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={onSelectVehicle}
              onExplainRoute={onExplainRoute}
              optimizationPlans={plans}
            />
          </div>
        </div>

        {/* Right Operational Controls & Active Recommendations */}
        <div className="space-y-6">
          <SimulationControls
            onOptimize={onOptimize}
            onSimulateTraffic={onSimulateTraffic}
            onSimulateLoadingZone={onSimulateLoadingZone}
            onSimulateBreakdown={onSimulateBreakdown}
            onSimulatePortScenario={onSimulatePortScenario}
            onSetTrafficPreset={onSetTrafficPreset}
            onReset={onReset}
            loading={loading}
            activeObjective={activeObjective}
            setActiveObjective={setActiveObjective}
          />

          {/* Active Coordinated Dispatches List */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Active Freight Plans ({plans.length})</span>
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                {optimizationResult?.timestamp?.split(" ")[1] || "Live"}
              </span>
            </div>

            <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
              {plans.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No active optimization. Click "Optimize Freight Flow" above.
                </div>
              ) : (
                plans.map((plan) => {
                  const isSelected = selectedVehicleId === plan.vehicle_id;
                  return (
                    <div
                      key={plan.vehicle_id}
                      onClick={() => onSelectVehicle(plan.vehicle_id)}
                      className={`p-3 rounded-lg border transition cursor-pointer text-xs ${
                        isSelected
                          ? "bg-emerald-500/15 border-emerald-500/50 shadow-md"
                          : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1.5 font-bold text-white">
                          <span>{plan.vehicle_name}</span>
                          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1 rounded">
                            {plan.vehicle_id}
                          </span>
                        </div>
                        <div className="text-right font-mono font-bold text-slate-200">
                          ETA {plan.eta}
                        </div>
                      </div>

                      <div className="text-slate-400 truncate font-medium">
                        Cargo: <span className="text-slate-200">{plan.delivery_title}</span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                        <div>
                          {plan.distance_km} km | {plan.travel_time_min} mins
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onExplainRoute(plan.vehicle_id);
                          }}
                          className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                        >
                          <span>Explain</span>
                          <HelpCircle className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
