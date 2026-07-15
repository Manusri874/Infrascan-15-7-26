import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingDown, CloudRain, Car, Thermometer, AlertTriangle } from "lucide-react";
import StatsCard from "@/components/StatsCard";

const healthTimeline = [
  { month: "Oct",  score: 78, rainfall: 12, traffic: 65 },
  { month: "Nov",  score: 74, rainfall: 8,  traffic: 70 },
  { month: "Dec",  score: 71, rainfall: 5,  traffic: 72 },
  { month: "Jan",  score: 68, rainfall: 6,  traffic: 68 },
  { month: "Feb",  score: 65, rainfall: 9,  traffic: 75 },
  { month: "Mar",  score: 62, rainfall: 18, traffic: 80 },
  { month: "Apr*", score: 57, rainfall: 25, traffic: 82 },  // predicted
  { month: "May*", score: 51, rainfall: 30, traffic: 85 },
  { month: "Jun*", score: 44, rainfall: 48, traffic: 78 },
];

const segmentData = [
  { segment: "Ring Road",       health: 48, potholes: 18, risk: "High"   },
  { segment: "Connaught Pl",    health: 52, potholes: 14, risk: "High"   },
  { segment: "Lodhi Road",      health: 68, potholes: 7,  risk: "Medium" },
  { segment: "Rajpath Ave",     health: 44, potholes: 22, risk: "High"   },
  { segment: "India Gate Rd",   health: 71, potholes: 5,  risk: "Medium" },
  { segment: "Mathura Road",    health: 55, potholes: 12, risk: "High"   },
  { segment: "Akbar Road",      health: 82, potholes: 2,  risk: "Low"    },
  { segment: "KG Marg",         health: 76, potholes: 4,  risk: "Low"    },
];

const detectionsByDay = [
  { day: "Mon", new: 3, repaired: 1 },
  { day: "Tue", new: 5, repaired: 2 },
  { day: "Wed", new: 2, repaired: 3 },
  { day: "Thu", new: 7, repaired: 1 },
  { day: "Fri", new: 4, repaired: 2 },
  { day: "Sat", new: 1, repaired: 4 },
  { day: "Sun", new: 6, repaired: 0 },
];

const tooltipStyle = {
  backgroundColor: "hsl(220 18% 11%)",
  border: "1px solid hsl(220 15% 20%)",
  borderRadius: "8px",
  color: "hsl(210 30% 92%)",
  fontSize: 12,
  fontFamily: "Space Mono, monospace",
};

export default function Analytics() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-primary" />
            Road Health Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Predictive deterioration forecasting · ML Models: LSTM + XGBoost + ARIMA
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard title="Avg Health Score" value={62}    unit="/100"  icon={AlertTriangle} accent="orange" trend={{ value: "↓ 6 pts this month" }} />
          <StatsCard title="Monthly Rainfall"  value={18}   unit="mm"    icon={CloudRain}     accent="cyan"   />
          <StatsCard title="Daily Traffic Vol" value="82k"  unit="veh"   icon={Car}           accent="orange" />
          <StatsCard title="Forecast Accuracy" value="91.4" unit="%"     icon={TrendingDown}  accent="green"  trend={{ value: "LSTM model", positive: true }} />
        </div>

        {/* Charts grid */}
        <div className="grid lg:grid-cols-2 gap-5 mb-5">
          {/* Road Health Timeline */}
          <div className="rounded-xl border border-border bg-surface-1 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">Road Health Score Forecast</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Historical + predicted (*) using LSTM model</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded px-2 py-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                ML Active
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={healthTimeline} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(186 100% 44%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(186 100% 44%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} />
                <YAxis domain={[30, 90]} tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone" dataKey="score" stroke="hsl(186 100% 44%)"
                  strokeWidth={2} fill="url(#healthGrad)" name="Health Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Rainfall vs Deterioration */}
          <div className="rounded-xl border border-border bg-surface-1 p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">Rainfall Impact on Road Health</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Correlation between rainfall (mm) and health score decline</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={healthTimeline} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} />
                <YAxis yAxisId="left"  tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, color: "hsl(215 15% 55%)" }} />
                <Line yAxisId="left"  type="monotone" dataKey="score"    stroke="hsl(186 100% 44%)"    strokeWidth={2} name="Health Score" dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="rainfall" stroke="hsl(220 100% 65%)" strokeWidth={2} strokeDasharray="5 5" name="Rainfall mm" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Daily detections */}
          <div className="rounded-xl border border-border bg-surface-1 p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">Weekly Detection vs Repairs</h3>
              <p className="text-xs text-muted-foreground mt-0.5">New potholes found vs repairs completed this week</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={detectionsByDay} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
                <XAxis dataKey="day" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, color: "hsl(215 15% 55%)" }} />
                <Bar dataKey="new"      fill="hsl(0 85% 58%)"       radius={[3,3,0,0]} name="New Potholes" />
                <Bar dataKey="repaired" fill="hsl(142 70% 45%)"     radius={[3,3,0,0]} name="Repaired" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Segment health table */}
          <div className="rounded-xl border border-border bg-surface-1 p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">Road Segment Health Index</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Maintenance priority ranking by AI scoring</p>
            </div>
            <div className="space-y-2.5 overflow-y-auto max-h-[220px]">
              {segmentData.sort((a,b) => a.health - b.health).map(({ segment, health, potholes, risk }) => (
                <div key={segment} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-foreground font-medium truncate">{segment}</span>
                      <span className={`font-mono font-bold ${
                        health < 55 ? "text-severity-severe" :
                        health < 70 ? "text-severity-moderate" : "text-severity-minor"
                      }`}>{health}</span>
                    </div>
                    <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          health < 55 ? "bg-severity-severe" :
                          health < 70 ? "bg-severity-moderate" : "bg-severity-minor"
                        }`}
                        style={{ width: `${health}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono flex-shrink-0 px-1.5 py-0.5 rounded ${
                    risk === "High" ? "bg-severity-severe/10 text-severity-severe" :
                    risk === "Medium" ? "bg-severity-moderate/10 text-severity-moderate" :
                    "bg-severity-minor/10 text-severity-minor"
                  }`}>{risk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prediction model info */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">AI Prediction Models Active</h3>
              <p className="text-xs text-muted-foreground">
                Road health forecasting uses an ensemble of LSTM (time-series), XGBoost (regression), and ARIMA (trend decomposition) 
                trained on 3 years of traffic, climate, and maintenance records.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              {["LSTM", "XGBoost", "ARIMA"].map(m => (
                <div key={m} className="px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 text-primary text-xs font-mono font-bold">
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
