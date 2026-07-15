import { Link } from "react-router-dom";
import {
  Scan, MapPin, BarChart3, Navigation, Shield, Zap,
  Camera, Cpu, Globe, ChevronRight, ArrowRight,
  AlertTriangle, CheckCircle, TrendingUp
} from "lucide-react";
import heroImg from "@/assets/hero-map.jpg";

const features = [
  {
    icon: Camera,
    title: "Multi-Source Detection",
    desc: "Processes images from smartphones, drones, and street-view cameras with YOLOv8 + EfficientDet AI models.",
    accent: "cyan",
  },
  {
    icon: MapPin,
    title: "Real-Time Geo Mapping",
    desc: "Every pothole is GPS-tagged and plotted on an interactive map with color-coded severity indicators.",
    accent: "orange",
  },
  {
    icon: TrendingUp,
    title: "Road Health Prediction",
    desc: "LSTM & XGBoost models predict future road deterioration using traffic, rainfall, and climate data.",
    accent: "green",
  },
  {
    icon: Navigation,
    title: "Alternate Route AI",
    desc: "Suggests smoother, safer routes by analyzing pothole density and predicted road health scores.",
    accent: "cyan",
  },
  {
    icon: Cpu,
    title: "Automated AI Pipeline",
    desc: "End-to-end automation from image ingestion to maintenance priority reports — no manual inspection needed.",
    accent: "orange",
  },
  {
    icon: Globe,
    title: "City-Scale Coverage",
    desc: "Scalable architecture to handle entire metropolitan areas with district-level reporting dashboards.",
    accent: "green",
  },
];

const steps = [
  { num: "01", title: "Train Detection Model", desc: "YOLOv8 trained on RDD2022, SVRDD & UAV datasets" },
  { num: "02", title: "Apply to Geo-Tagged Images", desc: "Detect potholes in Street View & drone imagery" },
  { num: "03", title: "Map Pothole Severity", desc: "Color-code and visualize on interactive city map" },
  { num: "04", title: "Predict Road Health", desc: "Forecast deterioration with ML regression models" },
  { num: "05", title: "Suggest Safer Routes", desc: "AI-driven alternate routing for travelers & logistics" },
];

const impactStats = [
  { value: "94.2%", label: "Detection Accuracy", icon: CheckCircle, color: "text-primary" },
  { value: "12,400+", label: "Potholes Mapped", icon: MapPin, color: "text-severity-moderate" },
  { value: "3.2×", label: "Faster than Manual", icon: Zap, color: "text-severity-minor" },
  { value: "47 km²", label: "Area Monitored", icon: Globe, color: "text-primary" },
];

const accentBorderMap: Record<string, string> = {
  cyan:   "border-primary/20 hover:border-primary/50",
  orange: "border-severity-moderate/20 hover:border-severity-moderate/50",
  green:  "border-severity-minor/20 hover:border-severity-minor/50",
};

const accentIconMap: Record<string, string> = {
  cyan:   "bg-primary/10 text-primary",
  orange: "bg-severity-moderate/10 text-severity-moderate",
  green:  "bg-severity-minor/10 text-severity-minor",
};

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-hero grid-overlay">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="scan-line absolute inset-x-0 h-48" />
        </div>
        {/* Corner brackets */}
        <div className="absolute top-24 left-8 w-8 h-8 border-t-2 border-l-2 border-primary/40" />
        <div className="absolute top-24 right-8 w-8 h-8 border-t-2 border-r-2 border-primary/40" />
        <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-primary/40" />
        <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-primary/40" />

        <div className="container relative z-10 pt-24 pb-16">
          <div className="max-w-4xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono font-medium mb-8 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              AI-Powered Road Health Intelligence System
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-none animate-float-up">
              INFRA<span className="text-primary text-glow-cyan">SCAN</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-4 leading-relaxed animate-float-up" style={{ animationDelay: "0.1s" }}>
              Detect potholes. Predict deterioration.{" "}
              <span className="text-foreground font-medium">Route smarter.</span>
            </p>

            <p className="text-base text-muted-foreground max-w-xl mb-10 animate-float-up" style={{ animationDelay: "0.2s" }}>
              An AI-driven infrastructure analysis platform combining drone surveys, citizen reports,
              and environmental data to keep cities moving safely.
            </p>

            <div className="flex flex-wrap gap-4 animate-float-up" style={{ animationDelay: "0.3s" }}>
              <Link
                to="/dashboard"
                className="group flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all glow-cyan"
              >
                <Scan className="w-4 h-4" />
                Open Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/detect"
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/30 bg-primary/5 text-primary font-semibold text-sm hover:border-primary hover:bg-primary/10 transition-all"
              >
                <Camera className="w-4 h-4" />
                Try Detection
              </Link>
              <Link
                to="/analytics"
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-surface-1 text-foreground font-semibold text-sm hover:border-primary/50 transition-all"
              >
                <BarChart3 className="w-4 h-4 text-primary" />
                View Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* Floating info cards */}
        <div className="hidden lg:flex flex-col gap-3 absolute right-8 top-1/2 -translate-y-1/2 z-10">
          {[
            { label: "Potholes Detected", val: "12,400", color: "text-severity-severe" },
            { label: "Roads Analyzed",    val: "847 km", color: "text-primary" },
            { label: "Health Score",      val: "68/100", color: "text-severity-moderate" },
          ].map(({ label, val, color }) => (
            <div key={label} className="bg-surface-1/80 backdrop-blur border border-border rounded-lg px-4 py-3 min-w-[160px]">
              <p className="text-xs text-muted-foreground mono mb-1">{label}</p>
              <p className={`text-xl font-bold mono ${color}`}>{val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── IMPACT STATS ─────────────────────────────── */}
      <section className="border-y border-border bg-surface-1">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="text-center">
                <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
                <div className={`text-3xl font-bold mono ${color} mb-1`}>{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section className="py-24 container">
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-mono uppercase tracking-widest mb-3">Core Capabilities</p>
          <h2 className="text-4xl font-bold text-foreground mb-4">Everything in One Platform</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From raw image ingestion to maintenance priority reports, INFRASCAN covers the complete pipeline.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, accent }) => (
            <div
              key={title}
              className={`group rounded-xl border ${accentBorderMap[accent]} bg-surface-1 p-6 transition-all duration-300 hover:bg-surface-2`}
            >
              <div className={`w-10 h-10 rounded-lg ${accentIconMap[accent]} flex items-center justify-center mb-4`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="py-24 border-t border-border bg-surface-1/50 grid-overlay">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-primary text-xs font-mono uppercase tracking-widest mb-3">Workflow</p>
            <h2 className="text-4xl font-bold text-foreground mb-4">Full Automated Pipeline</h2>
          </div>

          <div className="relative">
            {/* connector line */}
            <div className="absolute top-8 left-16 right-16 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {steps.map(({ num, title, desc }) => (
                <div key={num} className="relative text-center group">
                  <div className="w-14 h-14 rounded-full border-2 border-primary/30 bg-background flex items-center justify-center mx-auto mb-4 font-mono font-bold text-primary text-sm group-hover:border-primary group-hover:glow-cyan transition-all">
                    {num}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-2">{title}</h3>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SEVERITY LEGEND ──────────────────────────── */}
      <section className="py-24 container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary text-xs font-mono uppercase tracking-widest mb-3">Severity Classification</p>
            <h2 className="text-4xl font-bold text-foreground mb-6">Color-Coded Road Intelligence</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Every pothole is automatically classified by AI using bounding-box size, depth estimation, 
              and contextual data — color-coded for instant severity identification.
            </p>
            <div className="space-y-4">
              {[
                { color: "bg-severity-minor",    label: "Minor",    desc: "Surface cracks, small depressions < 5cm deep",  text: "text-severity-minor" },
                { color: "bg-severity-moderate", label: "Moderate", desc: "Visible potholes 5–15cm deep, needs monitoring", text: "text-severity-moderate" },
                { color: "bg-severity-severe",   label: "Severe",   desc: "Deep potholes > 15cm, immediate repair needed",  text: "text-severity-severe" },
              ].map(({ color, label, desc, text }) => (
                <div key={label} className="flex items-center gap-4 p-4 rounded-lg bg-surface-1 border border-border">
                  <div className={`w-4 h-4 rounded-full ${color} flex-shrink-0`} />
                  <div>
                    <span className={`font-semibold text-sm ${text}`}>{label}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-primary/20 bg-surface-1 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-severity-severe" />
                <div className="w-3 h-3 rounded-full bg-severity-moderate" />
                <div className="w-3 h-3 rounded-full bg-severity-minor" />
                <span className="text-xs text-muted-foreground font-mono ml-2">detection_output.json</span>
              </div>
              <pre className="text-xs font-mono text-muted-foreground leading-relaxed overflow-x-auto">
{`{
  "timestamp": "2025-03-19T14:32:11Z",
  "location": { "lat": 28.6139, "lng": 77.2090 },
  "detections": [
    {
      "id": "PTH-0842",
      "severity": "severe",
      "confidence": 0.97,
      "bbox": [312, 148, 89, 72],
      "depth_est": "18.4cm",
      "repair_priority": 1
    },
    {
      "id": "PTH-0843",
      "severity": "moderate",
      "confidence": 0.91,
      "bbox": [560, 230, 45, 38],
      "depth_est": "9.2cm",
      "repair_priority": 2
    }
  ],
  "road_health_score": 52,
  "model": "YOLOv8-InfraScan-v3"
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="py-24 border-t border-border">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto">
            <AlertTriangle className="w-10 h-10 text-primary mx-auto mb-6 animate-pulse-cyan" />
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Roads are deteriorating.<br />
              <span className="text-primary text-glow-cyan">INFRASCAN detects it first.</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Open the live dashboard to explore pothole mapping, road health scores, and AI-suggested routes.
            </p>
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:opacity-90 transition-all glow-cyan"
            >
              <Scan className="w-5 h-5" />
              Launch Live Dashboard
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="border-t border-border py-8 bg-surface-1/50">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-primary" />
            <span className="font-mono font-bold text-sm tracking-widest">
              INFRA<span className="text-primary">SCAN</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            AI-Driven Pothole Detection & Road Health Analysis System
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/analytics" className="hover:text-primary transition-colors">Analytics</Link>
            <Link to="/routes"    className="hover:text-primary transition-colors">Routes</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
