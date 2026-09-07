import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import FreightPage from "./pages/FreightPage";
import VehiclesPage from "./pages/VehiclesPage";
import InfrastructurePage from "./pages/InfrastructurePage";
import OptimizationPage from "./pages/OptimizationPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AboutPage from "./pages/AboutPage";
import ExplainabilityModal from "./components/ExplainabilityModal";
import { api } from "./api/client";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [vehicles, setVehicles] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loadingZones, setLoadingZones] = useState([]);
  const [holdingArea, setHoldingArea] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [roads, setRoads] = useState([]);
  const [traffic, setTraffic] = useState({});
  const [activeIncident, setActiveIncident] = useState(null);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [explainVehicleId, setExplainVehicleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [activeObjective, setActiveObjective] = useState("BALANCED");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initial load of city network, fleet, and infrastructure
  const loadInitialData = useCallback(async () => {
    try {
      const [vRes, dRes, zRes, hRes, nRes, rRes, tRes, optRes] = await Promise.all([
        api.getVehicles(),
        api.getDeliveries(),
        api.getLoadingZones(),
        api.getHoldingArea(),
        api.getNodes(),
        api.getRoads(),
        api.getTraffic(),
        api.getLastOptimization(),
      ]);

      setVehicles(vRes.vehicles || []);
      setDeliveries(dRes.deliveries || []);
      setLoadingZones(zRes.zones || []);
      setHoldingArea(hRes.holding_area || null);
      setNodes(nRes.nodes || []);
      setRoads(rRes.roads || []);
      setTraffic(tRes || {});
      setOptimizationResult(optRes || null);
    } catch (err) {
      console.error("Failed to load initial city data:", err);
      showToast("Error connecting to backend API at 127.0.0.1:8000");
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handler: Optimize Freight Flow
  const handleOptimize = async (objective = activeObjective) => {
    setLoading(true);
    try {
      const res = await api.runOptimization({ objective });
      setOptimizationResult(res);
      // Refresh fleet and roads
      const [vRes, rRes, zRes] = await Promise.all([
        api.getVehicles(),
        api.getRoads(),
        api.getLoadingZones(),
      ]);
      setVehicles(vRes.vehicles || []);
      setRoads(rRes.roads || []);
      setLoadingZones(zRes.zones || []);
      showToast(`Freight flow optimized [${objective}].`);
    } catch (err) {
      showToast("Optimization failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Dynamic Traffic Increase
  const handleSimulateTraffic = async () => {
    setLoading(true);
    try {
      const res = await api.simulateTraffic();
      setActiveIncident(res.incident);
      setOptimizationResult(res.optimization);
      const [rRes, vRes] = await Promise.all([api.getRoads(), api.getVehicles()]);
      setRoads(rRes.roads || []);
      setVehicles(vRes.vehicles || []);
      showToast("Traffic conditions changed. Freight plan re-optimized.");
    } catch (err) {
      showToast("Failed to simulate traffic: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Dynamic Loading Zone Full
  const handleSimulateLoadingZone = async (zoneId = "LZ-03") => {
    setLoading(true);
    try {
      const res = await api.simulateLoadingZone(zoneId);
      setActiveIncident(res.incident);
      setOptimizationResult(res.optimization);
      const [zRes, vRes] = await Promise.all([api.getLoadingZones(), api.getVehicles()]);
      setLoadingZones(zRes.zones || []);
      setVehicles(vRes.vehicles || []);
      showToast(`Loading zone ${zoneId} full. Alternative bays allocated.`);
    } catch (err) {
      showToast("Failed to simulate loading zone: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Vehicle Breakdown
  const handleSimulateBreakdown = async (vehicleId = "T-05") => {
    setLoading(true);
    try {
      const res = await api.simulateBreakdown(vehicleId);
      setActiveIncident(res.incident);
      setOptimizationResult(res.optimization);
      const vRes = await api.getVehicles();
      setVehicles(vRes.vehicles || []);
      showToast(`Vehicle ${vehicleId} breakdown. Delivery reassigned.`);
    } catch (err) {
      showToast("Failed to simulate breakdown: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Port-to-Warehouse Wave Scenario
  const handleSimulatePortScenario = async () => {
    setLoading(true);
    try {
      const res = await api.simulatePortScenario();
      setOptimizationResult(res.optimization);
      const [vRes, rRes, hRes] = await Promise.all([
        api.getVehicles(),
        api.getRoads(),
        api.getHoldingArea(),
      ]);
      setVehicles(vRes.vehicles || []);
      setRoads(rRes.roads || []);
      setHoldingArea(hRes.holding_area || null);
      showToast("Port Staging Wave scenario active.");
    } catch (err) {
      showToast("Failed to simulate port wave: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Traffic Preset
  const handleSetTrafficPreset = async (lvl) => {
    setLoading(true);
    try {
      const res = await api.setTrafficPreset(lvl);
      setOptimizationResult(res.optimization);
      const rRes = await api.getRoads();
      setRoads(rRes.roads || []);
      showToast(`City traffic preset set to ${lvl}.`);
    } catch (err) {
      showToast("Failed to set traffic preset: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Reset Simulation
  const handleReset = async () => {
    setIsResetting(true);
    try {
      await api.resetSimulation();
      setActiveIncident(null);
      setSelectedVehicleId(null);
      await loadInitialData();
      showToast("Simulation reset to baseline.");
    } catch (err) {
      showToast("Failed to reset simulation: " + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={handleReset}
        isResetting={isResetting}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[3000] bg-slate-900 border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Pages */}
        {activeTab === "dashboard" && (
          <DashboardPage
            vehicles={vehicles}
            deliveries={deliveries}
            loadingZones={loadingZones}
            roads={roads}
            nodes={nodes}
            traffic={traffic}
            activeIncident={activeIncident}
            onDismissIncident={() => setActiveIncident(null)}
            optimizationResult={optimizationResult}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={setSelectedVehicleId}
            onExplainRoute={(vid) => setExplainVehicleId(vid)}
            onOptimize={handleOptimize}
            onSimulateTraffic={handleSimulateTraffic}
            onSimulateLoadingZone={handleSimulateLoadingZone}
            onSimulateBreakdown={handleSimulateBreakdown}
            onSimulatePortScenario={handleSimulatePortScenario}
            onSetTrafficPreset={handleSetTrafficPreset}
            onReset={handleReset}
            loading={loading}
            activeObjective={activeObjective}
            setActiveObjective={setActiveObjective}
          />
        )}

        {activeTab === "freight" && (
          <FreightPage deliveries={deliveries} nodes={nodes} />
        )}

        {activeTab === "vehicles" && (
          <VehiclesPage
            vehicles={vehicles}
            nodes={nodes}
            onSimulateBreakdown={handleSimulateBreakdown}
            onSelectVehicle={setSelectedVehicleId}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "infrastructure" && (
          <InfrastructurePage
            loadingZones={loadingZones}
            holdingArea={holdingArea}
            roads={roads}
            onSimulateLoadingZone={handleSimulateLoadingZone}
          />
        )}

        {activeTab === "optimization" && (
          <OptimizationPage
            optimizationResult={optimizationResult}
            onOptimize={handleOptimize}
            loading={loading}
            activeObjective={activeObjective}
            setActiveObjective={setActiveObjective}
            onExplainRoute={(vid) => setExplainVehicleId(vid)}
          />
        )}

        {activeTab === "analytics" && <AnalyticsPage />}

        {activeTab === "about" && <AboutPage />}
      </main>

      {/* Route Explainability Inspector Modal */}
      {explainVehicleId && (
        <ExplainabilityModal
          vehicleId={explainVehicleId}
          onClose={() => setExplainVehicleId(null)}
        />
      )}
    </div>
  );
}
