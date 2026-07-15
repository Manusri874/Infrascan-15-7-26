import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title:   string;
  value:   string | number;
  unit?:   string;
  icon:    LucideIcon;
  trend?:  { value: string; positive?: boolean };
  accent?: "cyan" | "red" | "green" | "orange";
  children?: ReactNode;
}

const accentMap = {
  cyan:   { icon: "text-primary",               bg: "bg-primary/10",   border: "border-primary/20" },
  red:    { icon: "text-severity-severe",        bg: "bg-severity-severe/10",   border: "border-severity-severe/20" },
  green:  { icon: "text-severity-minor",         bg: "bg-severity-minor/10",    border: "border-severity-minor/20" },
  orange: { icon: "text-severity-moderate",      bg: "bg-severity-moderate/10", border: "border-severity-moderate/20" },
};

export default function StatsCard({ title, value, unit, icon: Icon, trend, accent = "cyan", children }: StatsCardProps) {
  const a = accentMap[accent];
  return (
    <div className={`relative overflow-hidden rounded-xl border ${a.border} bg-surface-1 p-5`}>
      {/* Subtle top edge glow */}
      <div className={`absolute top-0 left-0 right-0 h-px ${a.bg.replace("bg-", "bg-")}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {trend && (
            <p className={`text-xs mt-1 ${trend.positive ? "text-severity-minor" : "text-severity-severe"}`}>
              {trend.value}
            </p>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${a.bg}`}>
          <Icon className={`w-5 h-5 ${a.icon}`} />
        </div>
      </div>
      {children}
    </div>
  );
}
