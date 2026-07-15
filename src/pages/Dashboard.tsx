import { useState } from "react";
import {
  MapPin, AlertTriangle, CheckCircle, Filter, RefreshCw,
  Camera, Navigation, Layers, X
} from "lucide-react";
import PotholeMap, { POTHOLES, PotholeMarker } from "@/components/PotholeMap";
import SeverityBadge, { Severity } from "@/components/SeverityBadge";
import StatsCard from "@/components/StatsCard";

type FilterType = Severity | "all";

export default function Dashboard() {
  const [filter, setFilter]     = useState<FilterType>("all");
  const [selected, setSelected] = useState<PotholeMarker | null>(null);

  const total    = POTHOLES.length;
  const severe   = POTHOLES.filter(p => p.severity === "severe").length;
  const moderate = POTHOLES.filter(p => p.severity === "moderate").length;
  const minor    = POTHOLES.filter(p => p.severity === "minor").length;
  const visible  = POTHOLES.filter(p => filter === "all" || p.severity === filter);

  const filterOptions: { label: string; value: FilterType; count: number }[] = [
    { label: "All",      value: "all",      count: total    },
    { label: "Severe",   value: "severe",   count: severe   },
    { label: "Moderate", value: "moderate", count: moderate },
    { label: "Minor",    value: "minor",    count: minor    },
  ];

  const filterBtnStyle = (v: FilterType) => {
    const base = "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ";
    if (filter !== v) return base + "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground";
    if (v === "all")      return base + "border-primary/50 bg-primary/10 text-primary";
    if (v === "severe")   return base + "border-severity-severe/50 bg-severity-severe/10 text-severity-severe";
    if (v === "moderate") return base + "border-severity-moderate/50 bg-severity-moderate/10 text-severity-moderate";
    return base + "border-severity-minor/50 bg-severity-minor/10 text-severity-minor";
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Pothole Map Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              New Delhi Metropolitan Area · Real-time detection overlay
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-xs text-primary font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              LIVE · Updated 2 min ago
            </div>
            <button className="p-2 rounded-lg border border-border hover:border-primary/40 text-muted-foreground hover:text-primary transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard title="Total Potholes"   value={total}    icon={MapPin}        accent="cyan"   trend={{ value: "+3 detected today", positive: false }} />
          <StatsCard title="Severe Potholes"  value={severe}   icon={AlertTriangle} accent="red"    trend={{ value: "Requires immediate action" }} />
          <StatsCard title="Moderate"         value={moderate} icon={Filter}        accent="orange" />
          <StatsCard title="Minor / Resolved" value={minor}    icon={CheckCircle}   accent="green"  trend={{ value: "Monitoring only", positive: true }} />
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Map */}
          <div className="lg:col-span-2">
            {/* Filter bar */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mr-1">Filter:</span>
              {filterOptions.map(({ label, value, count }) => (
                <button key={value} onClick={() => setFilter(value)} className={filterBtnStyle(value)}>
                  {label}
                  <span className="font-mono bg-surface-2 px-1.5 py-0.5 rounded text-[10px]">{count}</span>
                </button>
              ))}
            </div>

            <div className="rounded-xl overflow-hidden border border-border" style={{ height: 480 }}>
              <PotholeMap filter={filter} onSelect={setSelected} selected={selected} />
            </div>

            {/* Map legend */}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <Camera className="w-3.5 h-3.5" />
              <span>Source: YOLOv8 · Street View + UAV</span>
              <span className="ml-auto">Click a marker for details</span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Selected pothole detail */}
            {selected ? (
              <div className="rounded-xl border border-primary/30 bg-surface-1 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{selected.id}</p>
                    <h3 className="font-semibold text-foreground mt-0.5">{selected.street}</h3>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <SeverityBadge severity={selected.severity} />
                <div className="mt-4 space-y-2.5">
                  {[
                    { label: "Confidence",  val: `${(selected.confidence * 100).toFixed(0)}%` },
                    { label: "Depth",       val: selected.depth },
                    { label: "Coordinates", val: `${selected.lat.toFixed(4)}, ${selected.lng.toFixed(4)}` },
                    { label: "Reported",    val: selected.reported },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between items-center text-sm border-b border-border pb-2.5 last:border-0 last:pb-0">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-mono text-foreground text-xs">{val}</span>
                    </div>
                  ))}
                </div>
                <div className={`mt-4 p-3 rounded-lg text-xs ${
                  selected.severity === "severe" ? "bg-severity-severe/10 text-severity-severe border border-severity-severe/20" :
                  selected.severity === "moderate" ? "bg-severity-moderate/10 text-severity-moderate border border-severity-moderate/20" :
                  "bg-severity-minor/10 text-severity-minor border border-severity-minor/20"
                }`}>
                  {selected.severity === "severe"   && "⚠ Immediate repair required. High risk to vehicle damage."}
                  {selected.severity === "moderate" && "Schedule repair within 2 weeks. Monitor for widening."}
                  {selected.severity === "minor"    && "Low priority. Monitor condition. Flag for seasonal repair."}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-surface-1 p-5 flex flex-col items-center justify-center text-center h-[200px]">
                <MapPin className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Click a pothole marker<br />to view detailed analysis</p>
              </div>
            )}

            {/* Pothole list */}
            <div className="rounded-xl border border-border bg-surface-1 flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Detection Log</h3>
                <span className="text-xs text-muted-foreground font-mono">{visible.length} entries</span>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: 300 }}>
                {visible.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className={`w-full flex items-center gap-3 px-4 py-3 border-b border-border/50 text-left transition-colors hover:bg-surface-2 ${selected?.id === p.id ? "bg-surface-2" : ""}`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      p.severity === "severe" ? "bg-severity-severe" :
                      p.severity === "moderate" ? "bg-severity-moderate" : "bg-severity-minor"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{p.street}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{p.id} · {p.reported}</p>
                    </div>
                    <SeverityBadge severity={p.severity} showDot={false} />
                  </button>
                ))}
              </div>
            </div>

            {/* Source breakdown */}
            <div className="rounded-xl border border-border bg-surface-1 p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Data Sources</h3>
              <div className="space-y-2.5">
                {[
                  { label: "Street View AI Scan", pct: 62, color: "bg-primary" },
                  { label: "Drone / UAV Survey",  pct: 24, color: "bg-severity-moderate" },
                  { label: "Citizen Reports",     pct: 14, color: "bg-severity-minor" },
                ].map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{label}</span>
                      <span className="font-mono">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
