import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SeverityBadge, { Severity } from "./SeverityBadge";

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface PotholeMarker {
  id:         string;
  lat:        number;
  lng:        number;
  severity:   Severity;
  confidence: number;
  depth:      string;
  street:     string;
  reported:   string;
}

// Mock data — New Delhi area
export const POTHOLES: PotholeMarker[] = [
  { id:"PTH-001", lat:28.6139, lng:77.2090, severity:"severe",   confidence:0.97, depth:"18.4cm", street:"Connaught Place Rd",    reported:"2025-03-17" },
  { id:"PTH-002", lat:28.6200, lng:77.2180, severity:"moderate", confidence:0.91, depth:"9.2cm",  street:"Ring Road NH-8",         reported:"2025-03-16" },
  { id:"PTH-003", lat:28.6050, lng:77.2250, severity:"minor",    confidence:0.85, depth:"3.1cm",  street:"Lodhi Road",             reported:"2025-03-15" },
  { id:"PTH-004", lat:28.6180, lng:77.1990, severity:"severe",   confidence:0.94, depth:"21.0cm", street:"Patel Chowk Underpass",  reported:"2025-03-18" },
  { id:"PTH-005", lat:28.6080, lng:77.2120, severity:"moderate", confidence:0.89, depth:"11.5cm", street:"Tolstoy Marg",           reported:"2025-03-14" },
  { id:"PTH-006", lat:28.6300, lng:77.2300, severity:"minor",    confidence:0.78, depth:"2.8cm",  street:"Bhavbhuti Marg",         reported:"2025-03-13" },
  { id:"PTH-007", lat:28.6230, lng:77.2000, severity:"severe",   confidence:0.96, depth:"19.7cm", street:"Rajpath Avenue",         reported:"2025-03-17" },
  { id:"PTH-008", lat:28.6160, lng:77.2400, severity:"moderate", confidence:0.88, depth:"8.4cm",  street:"India Gate Rd",          reported:"2025-03-16" },
  { id:"PTH-009", lat:28.5990, lng:77.2050, severity:"minor",    confidence:0.82, depth:"4.5cm",  street:"Aurangzeb Road",         reported:"2025-03-12" },
  { id:"PTH-010", lat:28.6350, lng:77.2150, severity:"severe",   confidence:0.95, depth:"22.3cm", street:"NH-44 Overbridge",       reported:"2025-03-19" },
  { id:"PTH-011", lat:28.6100, lng:77.2350, severity:"moderate", confidence:0.90, depth:"10.1cm", street:"Mathura Road",           reported:"2025-03-15" },
  { id:"PTH-012", lat:28.6260, lng:77.2270, severity:"minor",    confidence:0.76, depth:"2.2cm",  street:"Akbar Road",             reported:"2025-03-11" },
  { id:"PTH-013", lat:28.6070, lng:77.1950, severity:"severe",   confidence:0.93, depth:"16.8cm", street:"Panchkuian Marg",        reported:"2025-03-18" },
  { id:"PTH-014", lat:28.6190, lng:77.2060, severity:"moderate", confidence:0.87, depth:"7.6cm",  street:"Deen Dayal Upadhyay Rd", reported:"2025-03-14" },
  { id:"PTH-015", lat:28.6120, lng:77.2210, severity:"minor",    confidence:0.80, depth:"3.9cm",  street:"KG Marg",                reported:"2025-03-10" },
];

const SEVERITY_COLOR: Record<Severity, string> = {
  minor:    "#22c55e",
  moderate: "#f97316",
  severe:   "#ef4444",
};

const SEVERITY_RADIUS: Record<Severity, number> = {
  minor:    8,
  moderate: 11,
  severe:   14,
};

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, 14, { animate: true }); }, [center, map]);
  return null;
}

interface PotholeMapProps {
  filter: Severity | "all";
  onSelect: (p: PotholeMarker | null) => void;
  selected: PotholeMarker | null;
}

export default function PotholeMap({ filter, onSelect, selected }: PotholeMapProps) {
  const visible = POTHOLES.filter(p => filter === "all" || p.severity === filter);
  const center: [number, number] = [28.6139, 77.2090];

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {visible.map(p => (
        <CircleMarker
          key={p.id}
          center={[p.lat, p.lng]}
          radius={SEVERITY_RADIUS[p.severity]}
          pathOptions={{
            color:       SEVERITY_COLOR[p.severity],
            fillColor:   SEVERITY_COLOR[p.severity],
            fillOpacity: 0.8,
            weight:      selected?.id === p.id ? 3 : 1.5,
            opacity:     1,
          }}
          eventHandlers={{
            click: () => onSelect(p),
            mouseover: (e) => e.target.setStyle({ fillOpacity: 1, weight: 3 }),
            mouseout:  (e) => e.target.setStyle({ fillOpacity: 0.8, weight: selected?.id === p.id ? 3 : 1.5 }),
          }}
        >
          <Popup>
            <div className="p-1 min-w-[180px]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-muted-foreground">{p.id}</span>
                <SeverityBadge severity={p.severity} />
              </div>
              <p className="font-medium text-sm text-foreground mb-1">{p.street}</p>
              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                <span>Depth:</span>       <span className="font-mono text-foreground">{p.depth}</span>
                <span>Confidence:</span>  <span className="font-mono text-foreground">{(p.confidence * 100).toFixed(0)}%</span>
                <span>Reported:</span>    <span className="font-mono text-foreground">{p.reported}</span>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
