type Severity = "minor" | "moderate" | "severe";

const config: Record<Severity, { label: string; dot: string; bg: string; text: string }> = {
  minor:    { label: "Minor",    dot: "bg-severity-minor",    bg: "bg-severity-minor",    text: "severity-minor" },
  moderate: { label: "Moderate", dot: "bg-severity-moderate", bg: "bg-severity-moderate", text: "severity-moderate" },
  severe:   { label: "Severe",   dot: "bg-severity-severe",   bg: "bg-severity-severe",   text: "severity-severe" },
};

interface SeverityBadgeProps {
  severity: Severity;
  showDot?: boolean;
}

export default function SeverityBadge({ severity, showDot = true }: SeverityBadgeProps) {
  const c = config[severity];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text} border border-current/20`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />}
      {c.label}
    </span>
  );
}

export type { Severity };
