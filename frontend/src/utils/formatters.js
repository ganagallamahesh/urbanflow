export function formatDistance(km) {
  if (km === undefined || km === null) return "0.0 km";
  return `${Number(km).toFixed(1)} km`;
}

export function formatMinutes(mins) {
  if (mins === undefined || mins === null) return "0 min";
  const num = Math.round(Number(mins));
  if (num < 60) return `${num} min`;
  const h = Math.floor(num / 60);
  const m = num % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getTrafficBadge(level) {
  if (level >= 0.7) {
    return { label: "Severe", bg: "bg-red-500/20 text-red-400 border-red-500/30" };
  }
  if (level >= 0.4) {
    return { label: "Moderate", bg: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
  }
  return { label: "Free Flow", bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
}

export function getPriorityBadge(priority) {
  switch (priority) {
    case "CRITICAL":
      return "bg-rose-500/20 text-rose-300 border-rose-500/40";
    case "EXPRESS":
      return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    default:
      return "bg-blue-500/20 text-blue-300 border-blue-500/40";
  }
}

export function getStatusBadge(status) {
  switch (status) {
    case "IN_TRANSIT":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "HOLDING":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "BREAKDOWN":
      return "bg-rose-600/30 text-rose-300 border-rose-500/50 animate-pulse";
    case "AT_LOADING_BAY":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default:
      return "bg-slate-700/40 text-slate-300 border-slate-600/40";
  }
}
