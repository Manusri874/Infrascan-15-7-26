import { useState } from "react";
import { Navigation, CheckCircle, AlertTriangle, Clock, Route, MapPin, Zap } from "lucide-react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import SeverityBadge from "@/components/SeverityBadge";

interface RouteOption {
  id:          string;
  name:        string;
  distance:    string;
  time:        string;
  potholes:    number;
  healthScore: number;
  status:      "recommended" | "alternate" | "avoid";
  path:        [number, number][];
  color:       string;
  description: string;
}

const routes: RouteOption[] = [
  {
    id: "R1",
    name: "Safest Route",
    distance: "7.2 km",
    time: "18 min",
    potholes: 2,
    healthScore: 82,
    status: "recommended",
    color: "#22c55e",
    description: "Via Akbar Road → KG Marg → India Gate Rd. Fewest potholes, highest road health index.",
    path: [
      [28.6050, 77.1950], [28.6080, 77.2000], [28.6100, 77.2050],
      [28.6120, 77.2100], [28.6139, 77.2090]
    ],
  },
  {
    id: "R2",
    name: "Fastest Route",
    distance: "5.8 km",
    time: "14 min",
    potholes: 7,
    healthScore: 61,
    status: "alternate",
    color: "#f97316",
    description: "Via Ring Road NH-8. Shorter distance but moderate pothole density. Use with caution.",
    path: [
      [28.6050, 77.1950], [28.6100, 77.2000], [28.6139, 77.2090]
    ],
  },
  {
    id: "R3",
    name: "Avoid — High Risk",
    distance: "6.4 km",
    time: "16 min",
    potholes: 14,
    healthScore: 38,
    status: "avoid",
    color: "#ef4444",
    description: "Via Rajpath Avenue → Patel Chowk. Multiple severe potholes detected. Vehicle damage risk is high.",
    path: [
      [28.6050, 77.1950], [28.6150, 77.2100], [28.6200, 77.2150],
      [28.6180, 77.1990], [28.6139, 77.2090]
    ],
  },
];

const origin:      [number, number] = [28.6050, 77.1950];
const destination: [number, number] = [28.6139, 77.2090];

export default function Routes() {
  const [selected, setSelected] = useState<string>("R1");
  const activeRoute = routes.find(r => r.id === selected)!;

  const statusStyle = (status: RouteOption["status"]) => {
    if (status === "recommended") return "border-severity-minor/30 bg-severity-minor/5";
    if (status === "alternate")   return "border-severity-moderate/30 bg-severity-moderate/5";
    return "border-severity-severe/30 bg-severity-severe/5";
  };

  const statusBadge = (status: RouteOption["status"]) => {
    if (status === "recommended") return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-severity-minor/10 text-severity-minor border border-severity-minor/20">✓ Recommended</span>;
    if (status === "alternate")   return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-severity-moderate/10 text-severity-moderate border border-severity-moderate/20">Alternate</span>;
    return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-severity-severe/10 text-severity-severe border border-severity-severe/20">⚠ Avoid</span>;
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary" />
            AI Route Suggestions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pothole-aware routing · Connaught Place → India Gate, New Delhi
          </p>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: MapPin,         label: "Origin",      val: "Connaught Place",  color: "text-primary" },
            { icon: Route,          label: "Destination", val: "India Gate",       color: "text-primary" },
            { icon: AlertTriangle,  label: "Potholes en Route", val: `${activeRoute.potholes} detected`, color: activeRoute.potholes > 8 ? "text-severity-severe" : activeRoute.potholes > 4 ? "text-severity-moderate" : "text-severity-minor" },
            { icon: Zap,            label: "Road Health",  val: `${activeRoute.healthScore}/100`, color: activeRoute.healthScore > 70 ? "text-severity-minor" : activeRoute.healthScore > 50 ? "text-severity-moderate" : "text-severity-severe" },
          ].map(({ icon: Icon, label, val, color }) => (
            <div key={label} className="rounded-xl border border-border bg-surface-1 p-4 flex items-center gap-3">
              <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-sm font-semibold ${color}`}>{val}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Route cards */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Available Routes</h2>
            {routes.map(route => (
              <button
                key={route.id}
                onClick={() => setSelected(route.id)}
                className={`rounded-xl border p-4 text-left transition-all duration-200 ${statusStyle(route.status)} ${selected === route.id ? "ring-1 ring-primary" : "hover:bg-surface-2 border-border"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: route.color }} />
                    <span className="font-semibold text-foreground text-sm">{route.name}</span>
                  </div>
                  {statusBadge(route.status)}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Distance</p>
                    <p className="font-mono text-foreground font-medium">{route.distance}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Est. Time</p>
                    <p className="font-mono text-foreground font-medium">{route.time}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Potholes</p>
                    <p className={`font-mono font-bold ${
                      route.potholes > 8 ? "text-severity-severe" :
                      route.potholes > 4 ? "text-severity-moderate" : "text-severity-minor"
                    }`}>{route.potholes}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Road Health</span>
                    <span className={`font-mono font-bold ${
                      route.healthScore > 70 ? "text-severity-minor" :
                      route.healthScore > 50 ? "text-severity-moderate" : "text-severity-severe"
                    }`}>{route.healthScore}/100</span>
                  </div>
                  <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        route.healthScore > 70 ? "bg-severity-minor" :
                        route.healthScore > 50 ? "bg-severity-moderate" : "bg-severity-severe"
                      }`}
                      style={{ width: `${route.healthScore}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{route.description}</p>
              </button>
            ))}

            {/* AI note */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
              <p className="text-primary font-semibold mb-1.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                AI Route Intelligence
              </p>
              Route scoring combines current pothole density, road health forecast, historical traffic volume, 
              and rainfall data. Updated in real time as new potholes are reported.
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden border border-border" style={{ height: 520 }}>
              <MapContainer
                center={[28.6095, 77.2020]}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Draw all routes, active highlighted */}
                {routes.map(r => (
                  <Polyline
                    key={r.id}
                    positions={r.path}
                    pathOptions={{
                      color:   r.color,
                      weight:  selected === r.id ? 6 : 3,
                      opacity: selected === r.id ? 1 : 0.35,
                      dashArray: r.status === "avoid" ? "8 6" : undefined,
                    }}
                  />
                ))}

                {/* Origin */}
                <CircleMarker center={origin} radius={10} pathOptions={{ color: "hsl(186 100% 44%)", fillColor: "hsl(186 100% 44%)", fillOpacity: 0.9 }}>
                  <Popup><div style={{ color: "#e2e8f0" }}>📍 Origin: Connaught Place</div></Popup>
                </CircleMarker>

                {/* Destination */}
                <CircleMarker center={destination} radius={10} pathOptions={{ color: "#f97316", fillColor: "#f97316", fillOpacity: 0.9 }}>
                  <Popup><div style={{ color: "#e2e8f0" }}>🏁 Destination: India Gate</div></Popup>
                </CircleMarker>
              </MapContainer>
            </div>

            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              {routes.map(r => (
                <div key={r.id} className="flex items-center gap-1.5">
                  <div className="w-5 h-0.5" style={{ backgroundColor: r.color, borderStyle: r.status === "avoid" ? "dashed" : "solid" }} />
                  <span>{r.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Route details comparison */}
        <div className="mt-6 rounded-xl border border-border bg-surface-1 overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Route Comparison Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Route", "Distance", "Est. Time", "Potholes", "Health Score", "Severity Breakdown", "Recommendation"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {routes.map(r => (
                  <tr key={r.id} className={`border-b border-border/50 ${selected === r.id ? "bg-surface-2" : "hover:bg-surface-2/50"} cursor-pointer`} onClick={() => setSelected(r.id)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                        <span className="font-medium text-foreground">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-foreground">{r.distance}</td>
                    <td className="px-4 py-3 font-mono text-foreground">{r.time}</td>
                    <td className={`px-4 py-3 font-mono font-bold ${r.potholes > 8 ? "text-severity-severe" : r.potholes > 4 ? "text-severity-moderate" : "text-severity-minor"}`}>{r.potholes}</td>
                    <td className={`px-4 py-3 font-mono font-bold ${r.healthScore > 70 ? "text-severity-minor" : r.healthScore > 50 ? "text-severity-moderate" : "text-severity-severe"}`}>{r.healthScore}/100</td>
                    <td className="px-4 py-3">
                      {r.status === "recommended" && <SeverityBadge severity="minor" />}
                      {r.status === "alternate"   && <SeverityBadge severity="moderate" />}
                      {r.status === "avoid"       && <SeverityBadge severity="severe" />}
                    </td>
                    <td className="px-4 py-3">{statusBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

}
