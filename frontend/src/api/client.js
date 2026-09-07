const API_BASE =
  import.meta.env.VITE_API_BASE ??
  (typeof window !== "undefined" && window.location.port === "5173"
    ? "http://127.0.0.1:8000"
    : "");


async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error on [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Network & Geo
  getNodes: () => request("/api/network/nodes"),
  getRoads: () => request("/api/network/roads"),
  getTraffic: () => request("/api/network/traffic"),

  // Fleet & Infrastructure
  getVehicles: () => request("/api/fleet/vehicles"),
  getDeliveries: () => request("/api/fleet/deliveries"),
  getLoadingZones: () => request("/api/infrastructure/zones"),
  getHoldingArea: () => request("/api/infrastructure/holding"),

  // Optimization
  runOptimization: (body = {}) =>
    request("/api/optimize", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getLastOptimization: () => request("/api/optimization-result"),
  getExplainRoute: (vehicleId) => request(`/api/explain/${vehicleId}`),

  // Dynamic Simulations
  simulateTraffic: (roadId = null) =>
    request("/api/simulate/traffic", {
      method: "POST",
      body: JSON.stringify({ road_id: roadId }),
    }),
  simulateLoadingZone: (zoneId = "LZ-03") =>
    request("/api/simulate/loading-zone", {
      method: "POST",
      body: JSON.stringify({ zone_id: zoneId }),
    }),
  simulateBreakdown: (vehicleId = "T-05") =>
    request("/api/simulate/breakdown", {
      method: "POST",
      body: JSON.stringify({ vehicle_id: vehicleId }),
    }),
  simulatePortScenario: () =>
    request("/api/simulate/scenario/port", { method: "POST" }),
  setTrafficPreset: (level = "HIGH") =>
    request("/api/simulate/preset/traffic", {
      method: "POST",
      body: JSON.stringify({ level }),
    }),
  resetSimulation: () =>
    request("/api/simulate/reset", { method: "POST" }),

  // Analytics & Logs
  getAnalytics: () => request("/api/analytics"),
  getLogs: () => request("/api/logs"),
};
