// import { useState, useRef, useCallback, useEffect } from "react";
// import {
//   Upload, Scan, ZoomIn, ZoomOut, RotateCcw, Download,
//   AlertTriangle, CheckCircle, Camera, Cpu, ChevronRight, X, Info
// } from "lucide-react";
// import SeverityBadge, { Severity } from "@/components/SeverityBadge";

// // ── Types ──────────────────────────────────────────────────────────
// interface Detection {
//   id:         string;
//   severity:   Severity;
//   confidence: number;
//   x:          number;   // 0–1 normalised
//   y:          number;
//   w:          number;
//   h:          number;
//   label:      string;
// }

// type ScanStep = "idle" | "uploading" | "preprocessing" | "running" | "postprocessing" | "done";

// // ── Helpers ────────────────────────────────────────────────────────

// /** Seeded pseudo-random so the same image always gives the same result */
// function seededRand(seed: number) {
//   let s = seed;
//   return () => {
//     s = (s * 1664525 + 1013904223) & 0xffffffff;
//     return (s >>> 0) / 0xffffffff;
//   };
// }

// function generateDetections(imageSeed: number): Detection[] {
//   const rand  = seededRand(imageSeed);
//   const count = 2 + Math.floor(rand() * 5);           // 2–6 detections
//   const severities: Severity[] = ["severe", "moderate", "minor"];

//   return Array.from({ length: count }, (_, i) => {
//     const w = 0.06 + rand() * 0.14;
//     const h = 0.05 + rand() * 0.10;
//     return {
//       id:         `PTH-${String(i + 1).padStart(3, "0")}`,
//       severity:   severities[Math.floor(rand() * severities.length)],
//       confidence: 0.74 + rand() * 0.25,
//       x:          0.05 + rand() * (0.90 - w),
//       y:          0.30 + rand() * (0.65 - h),         // lower half of image (roads)
//       w,
//       h,
//       label:      ["Pothole", "Crack", "Surface Damage", "Pothole"][Math.floor(rand() * 4)],
//     };
//   });
// }

// const SEVERITY_COLOR: Record<Severity, string> = {
//   minor:    "#22c55e",
//   moderate: "#f97316",
//   severe:   "#ef4444",
// };

// const SCAN_STEPS: { step: ScanStep; label: string; ms: number }[] = [
//   { step: "uploading",      label: "Loading image…",           ms: 600  },
//   { step: "preprocessing",  label: "Pre-processing frame…",    ms: 800  },
//   { step: "running",        label: "Running YOLOv8 inference…", ms: 1400 },
//   { step: "postprocessing", label: "Applying NMS filter…",     ms: 700  },
//   { step: "done",           label: "Detection complete",        ms: 0    },
// ];

// // ── Component ──────────────────────────────────────────────────────
// export default function Detect() {
//   const [imageSrc,    setImageSrc]    = useState<string | null>(null);
//   const [detections,  setDetections]  = useState<Detection[]>([]);
//   const [scanStep,    setScanStep]    = useState<ScanStep>("idle");
//   const [scanLabel,   setScanLabel]   = useState("");
//   const [scanPct,     setScanPct]     = useState(0);
//   const [hovered,     setHovered]     = useState<string | null>(null);
//   const [showBoxes,   setShowBoxes]   = useState(true);
//   const [showLabels,  setShowLabels]  = useState(true);
//   const [dragOver,    setDragOver]    = useState(false);
//   const [zoom,        setZoom]        = useState(1);

//   const canvasRef   = useRef<HTMLCanvasElement>(null);
//   const imgRef      = useRef<HTMLImageElement | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // ── Draw detections on canvas ────────────────────────────────────
//   const draw = useCallback(() => {
//     const canvas = canvasRef.current;
//     if (!canvas || !imgRef.current) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const img = imgRef.current;
//     canvas.width  = img.naturalWidth;
//     canvas.height = img.naturalHeight;

//     ctx.drawImage(img, 0, 0);

//     if (!showBoxes) return;

//     const cw = canvas.width;
//     const ch = canvas.height;

//     // Scan-line overlay
//     const grad = ctx.createLinearGradient(0, 0, 0, ch);
//     grad.addColorStop(0,   "rgba(0,212,212,0)");
//     grad.addColorStop(0.5, "rgba(0,212,212,0.05)");
//     grad.addColorStop(1,   "rgba(0,212,212,0)");
//     ctx.fillStyle = grad;
//     ctx.fillRect(0, 0, cw, ch);

//     for (const d of detections) {
//       const isHov = hovered === d.id;
//       const x  = d.x * cw;
//       const y  = d.y * ch;
//       const bw = d.w * cw;
//       const bh = d.h * ch;
//       const c  = SEVERITY_COLOR[d.severity];

//       // Corner brackets instead of full rect (cleaner)
//       ctx.strokeStyle = c;
//       ctx.lineWidth   = isHov ? 3 : 2;
//       ctx.shadowColor = c;
//       ctx.shadowBlur  = isHov ? 16 : 8;
//       const cs = Math.min(bw, bh) * 0.3;   // corner size

//       const corners = [
//         { ox: 0,  oy: 0,  dx: cs,  dy: 0,   dx2: 0,  dy2: cs  },  // TL
//         { ox: bw, oy: 0,  dx: -cs, dy: 0,   dx2: 0,  dy2: cs  },  // TR
//         { ox: 0,  oy: bh, dx: cs,  dy: 0,   dx2: 0,  dy2: -cs },  // BL
//         { ox: bw, oy: bh, dx: -cs, dy: 0,   dx2: 0,  dy2: -cs },  // BR
//       ];

//       for (const { ox, oy, dx, dy, dx2, dy2 } of corners) {
//         ctx.beginPath();
//         ctx.moveTo(x + ox + dx,  y + oy + dy);
//         ctx.lineTo(x + ox,       y + oy);
//         ctx.lineTo(x + ox + dx2, y + oy + dy2);
//         ctx.stroke();
//       }

//       // Dashed inner rectangle
//       ctx.setLineDash([4, 4]);
//       ctx.lineWidth = 1;
//       ctx.strokeStyle = c + "88";
//       ctx.shadowBlur  = 0;
//       ctx.strokeRect(x, y, bw, bh);
//       ctx.setLineDash([]);

//       // Fill overlay
//       ctx.fillStyle = c + "18";
//       ctx.fillRect(x, y, bw, bh);

//       // Label tag
//       if (showLabels) {
//         const tag     = `${d.label}  ${(d.confidence * 100).toFixed(0)}%`;
//         const fontSize = Math.max(11, Math.min(14, cw / 60));
//         ctx.font        = `bold ${fontSize}px 'Space Mono', monospace`;
//         const tw = ctx.measureText(tag).width;
//         const th = fontSize + 6;
//         const tx = x;
//         const ty = y > th + 4 ? y - th - 2 : y + bh + 2;

//         // Tag background
//         ctx.fillStyle = c;
//         ctx.fillRect(tx, ty, tw + 10, th);

//         // Tag text
//         ctx.fillStyle = "#000";
//         ctx.shadowBlur = 0;
//         ctx.fillText(tag, tx + 5, ty + th - 4);

//         // ID label (small, bottom-right of box)
//         ctx.font      = `${fontSize - 2}px 'Space Mono', monospace`;
//         ctx.fillStyle = c + "cc";
//         ctx.fillText(d.id, x + bw - ctx.measureText(d.id).width - 4, y + bh - 4);
//       }
//     }
//   }, [detections, hovered, showBoxes, showLabels]);

//   useEffect(() => { draw(); }, [draw]);

//   // ── Run simulated pipeline ────────────────────────────────────────
//   async function runPipeline(src: string, seed: number) {
//     let pct = 0;
//     for (const { step, label, ms } of SCAN_STEPS) {
//       setScanStep(step);
//       setScanLabel(label);
//       if (ms > 0) {
//         const start = Date.now();
//         await new Promise<void>(resolve => {
//           const tick = () => {
//             const elapsed = Date.now() - start;
//             pct = Math.min(pct + 1, Math.round((elapsed / ms) * 20) + pct);
//             setScanPct(Math.min(pct, 98));
//             if (elapsed < ms) requestAnimationFrame(tick);
//             else resolve();
//           };
//           requestAnimationFrame(tick);
//         });
//       }
//     }
//     setScanPct(100);
//     setDetections(generateDetections(seed));
//   }

//   // ── File handling ─────────────────────────────────────────────────
//   const loadFile = (file: File) => {
//     if (!file.type.startsWith("image/")) return;
//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       const src  = e.target!.result as string;
//       const seed = src.length + file.size;           // deterministic seed
//       setImageSrc(src);
//       setDetections([]);
//       setScanPct(0);
//       setScanStep("uploading");

//       const img = new Image();
//       img.onload = async () => {
//         imgRef.current = img;
//         await runPipeline(src, seed);
//       };
//       img.src = src;
//     };
//     reader.readAsDataURL(file);
//   };

//   const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const f = e.target.files?.[0];
//     if (f) loadFile(f);
//     e.target.value = "";
//   };

//   const onDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setDragOver(false);
//     const f = e.dataTransfer.files[0];
//     if (f) loadFile(f);
//   };

//   const reset = () => {
//     setImageSrc(null);
//     setDetections([]);
//     setScanStep("idle");
//     setScanPct(0);
//     setHovered(null);
//     imgRef.current = null;
//   };

//   const downloadResult = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const a = document.createElement("a");
//     a.href     = canvas.toDataURL("image/png");
//     a.download = "infrascan_detection.png";
//     a.click();
//   };

//   // ── Canvas mouse hover ────────────────────────────────────────────
//   const onCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const rect  = canvas.getBoundingClientRect();
//     const scaleX = canvas.width  / rect.width;
//     const scaleY = canvas.height / rect.height;
//     const mx = (e.clientX - rect.left) * scaleX;
//     const my = (e.clientY - rect.top)  * scaleY;

//     const hit = detections.find(d => {
//       const x  = d.x * canvas.width;
//       const y  = d.y * canvas.height;
//       const bw = d.w * canvas.width;
//       const bh = d.h * canvas.height;
//       return mx >= x && mx <= x + bw && my >= y && my <= y + bh;
//     });
//     setHovered(hit?.id ?? null);
//   };

//   // ── Derived ───────────────────────────────────────────────────────
//   const isScanning  = scanStep !== "idle" && scanStep !== "done";
//   const totalPct    = SCAN_STEPS.reduce((s, x) => s + x.ms, 0);
//   const severe   = detections.filter(d => d.severity === "severe").length;
//   const moderate = detections.filter(d => d.severity === "moderate").length;
//   const minor    = detections.filter(d => d.severity === "minor").length;

//   // ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-background pt-16">
//       <div className="container py-6">

//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
//               <Scan className="w-5 h-5 text-primary" />
//               AI Pothole Detection
//             </h1>
//             <p className="text-sm text-muted-foreground mt-1">
//               Upload any road photo · YOLOv8 inference pipeline simulation
//             </p>
//           </div>
//           {imageSrc && (
//             <button onClick={reset} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
//               <RotateCcw className="w-4 h-4" />
//               New Image
//             </button>
//           )}
//         </div>

//         {/* Upload zone (shown when no image) */}
//         {!imageSrc && (
//           <div
//             onDrop={onDrop}
//             onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//             onDragLeave={() => setDragOver(false)}
//             onClick={() => fileInputRef.current?.click()}
//             className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center py-20 px-8 text-center
//               ${dragOver
//                 ? "border-primary bg-primary/10 glow-cyan"
//                 : "border-border bg-surface-1 hover:border-primary/50 hover:bg-surface-2"
//               }`}
//           >
//             <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

//             {/* Animated icon */}
//             <div className="relative mb-6">
//               <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
//                 <Upload className={`w-9 h-9 text-primary transition-transform duration-300 ${dragOver ? "scale-110" : ""}`} />
//               </div>
//               <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
//                 <Cpu className="w-3 h-3 text-primary-foreground" />
//               </div>
//             </div>

//             <h2 className="text-lg font-semibold text-foreground mb-2">
//               {dragOver ? "Drop to analyze" : "Upload Road Image"}
//             </h2>
//             <p className="text-sm text-muted-foreground max-w-sm mb-4">
//               Drag & drop or click to select a photo. Supports JPG, PNG, WEBP.
//               The AI pipeline will detect potholes and overlay bounding boxes.
//             </p>

//             <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border rounded-lg px-3 py-2">
//               <Camera className="w-3.5 h-3.5 text-primary" />
//               <span>Best results with road-level or drone perspective photos</span>
//             </div>

//             {/* Model badges */}
//             <div className="flex gap-2 mt-6">
//               {["YOLOv8", "EfficientDet", "NMS Filter"].map(m => (
//                 <span key={m} className="px-2.5 py-1 rounded-md border border-border bg-surface-2 text-xs font-mono text-muted-foreground">
//                   {m}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Result view */}
//         {imageSrc && (
//           <div className="grid lg:grid-cols-3 gap-5">
//             {/* Canvas column */}
//             <div className="lg:col-span-2 flex flex-col gap-3">

//               {/* Toolbar */}
//               <div className="flex items-center gap-2 flex-wrap">
//                 {/* Toggle boxes */}
//                 <button
//                   onClick={() => setShowBoxes(b => !b)}
//                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${showBoxes ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
//                 >
//                   <ZoomIn className="w-3.5 h-3.5" />
//                   Bounding Boxes
//                 </button>
//                 <button
//                   onClick={() => setShowLabels(b => !b)}
//                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${showLabels ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
//                 >
//                   <Info className="w-3.5 h-3.5" />
//                   Labels
//                 </button>
//                 <div className="flex items-center gap-1 ml-auto">
//                   <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="p-1.5 rounded-lg border border-border hover:border-primary/40 text-muted-foreground hover:text-primary transition-all">
//                     <ZoomOut className="w-3.5 h-3.5" />
//                   </button>
//                   <span className="text-xs font-mono text-muted-foreground px-1">{Math.round(zoom * 100)}%</span>
//                   <button onClick={() => setZoom(z => Math.min(2.5, z + 0.25))} className="p-1.5 rounded-lg border border-border hover:border-primary/40 text-muted-foreground hover:text-primary transition-all">
//                     <ZoomIn className="w-3.5 h-3.5" />
//                   </button>
//                   {scanStep === "done" && (
//                     <button onClick={downloadResult} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-primary/40 text-xs font-medium text-muted-foreground hover:text-primary transition-all ml-1">
//                       <Download className="w-3.5 h-3.5" />
//                       Export
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Canvas wrapper */}
//               <div className="relative rounded-xl border border-border bg-surface-1 overflow-auto" style={{ maxHeight: 520 }}>
//                 {/* Scanning overlay */}
//                 {isScanning && (
//                   <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
//                     {/* Animated scan ring */}
//                     <div className="relative w-16 h-16">
//                       <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
//                       <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
//                       <Scan className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
//                     </div>
//                     <div className="text-center">
//                       <p className="text-sm font-mono text-primary mb-1">{scanLabel}</p>
//                       <p className="text-xs text-muted-foreground">{scanPct}% complete</p>
//                     </div>
//                     {/* Progress bar */}
//                     <div className="w-48 h-1.5 bg-surface-3 rounded-full overflow-hidden">
//                       <div
//                         className="h-full bg-primary rounded-full transition-all duration-300"
//                         style={{ width: `${scanPct}%` }}
//                       />
//                     </div>
//                     {/* Step indicators */}
//                     <div className="flex gap-1.5">
//                       {SCAN_STEPS.filter(s => s.step !== "done").map(({ step, label }) => {
//                         const done = SCAN_STEPS.findIndex(s => s.step === scanStep) >
//                                      SCAN_STEPS.findIndex(s => s.step === step);
//                         const active = step === scanStep;
//                         return (
//                           <div
//                             key={step}
//                             title={label}
//                             className={`w-2 h-2 rounded-full transition-all ${done ? "bg-primary" : active ? "bg-primary animate-pulse" : "bg-surface-3"}`}
//                           />
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}

//                 {/* The canvas */}
//                 <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left", display: "inline-block" }}>
//                   <canvas
//                     ref={canvasRef}
//                     onMouseMove={onCanvasMouseMove}
//                     onMouseLeave={() => setHovered(null)}
//                     style={{ display: "block", maxWidth: "100%", cursor: hovered ? "crosshair" : "default" }}
//                   />
//                 </div>
//               </div>

//               {/* Source note */}
//               <p className="text-xs text-muted-foreground flex items-center gap-1.5">
//                 <Camera className="w-3 h-3" />
//                 Detection model: YOLOv8-InfraScan-v3 · NMS threshold: 0.45 · Confidence threshold: 0.70
//               </p>
//             </div>

//             {/* Results sidebar */}
//             <div className="flex flex-col gap-4">

//               {/* Summary card */}
//               <div className={`rounded-xl border p-4 transition-all duration-500 ${
//                 scanStep === "done"
//                   ? detections.some(d => d.severity === "severe")
//                     ? "border-severity-severe/30 bg-severity-severe/5"
//                     : "border-primary/30 bg-primary/5"
//                   : "border-border bg-surface-1"
//               }`}>
//                 {scanStep !== "done" ? (
//                   <div className="flex items-center gap-3 text-sm text-muted-foreground">
//                     <div className="w-4 h-4 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
//                     <span className="font-mono">{scanLabel || "Waiting for image…"}</span>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="flex items-center justify-between mb-3">
//                       <h3 className="font-semibold text-foreground">Detection Summary</h3>
//                       <span className="text-xs font-mono text-primary border border-primary/30 px-2 py-0.5 rounded-full">
//                         {detections.length} found
//                       </span>
//                     </div>
//                     <div className="grid grid-cols-3 gap-2 mb-4">
//                       {[
//                         { label: "Severe",   count: severe,   color: "text-severity-severe",   bg: "bg-severity-severe/10" },
//                         { label: "Moderate", count: moderate, color: "text-severity-moderate", bg: "bg-severity-moderate/10" },
//                         { label: "Minor",    count: minor,    color: "text-severity-minor",    bg: "bg-severity-minor/10" },
//                       ].map(({ label, count, color, bg }) => (
//                         <div key={label} className={`rounded-lg ${bg} p-2.5 text-center`}>
//                           <div className={`text-2xl font-bold mono ${color}`}>{count}</div>
//                           <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
//                         </div>
//                       ))}
//                     </div>
//                     <div className="text-xs text-muted-foreground space-y-1.5">
//                       <div className="flex justify-between">
//                         <span>Avg confidence</span>
//                         <span className="font-mono text-foreground">
//                           {detections.length
//                             ? `${(detections.reduce((s, d) => s + d.confidence, 0) / detections.length * 100).toFixed(1)}%`
//                             : "—"}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Model</span>
//                         <span className="font-mono text-foreground">YOLOv8-v3</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Status</span>
//                         <span className="text-primary font-mono flex items-center gap-1">
//                           <CheckCircle className="w-3 h-3" />
//                           Complete
//                         </span>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Detection list */}
//               {scanStep === "done" && (
//                 <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
//                   <div className="px-4 py-3 border-b border-border">
//                     <h3 className="text-sm font-semibold text-foreground">Detections</h3>
//                     <p className="text-[10px] text-muted-foreground mt-0.5">Hover to highlight on image</p>
//                   </div>
//                   <div className="divide-y divide-border/50">
//                     {detections.map(d => (
//                       <div
//                         key={d.id}
//                         onMouseEnter={() => setHovered(d.id)}
//                         onMouseLeave={() => setHovered(null)}
//                         className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${hovered === d.id ? "bg-surface-2" : "hover:bg-surface-2/60"}`}
//                       >
//                         <div
//                           className="w-3 h-3 rounded-sm flex-shrink-0 border"
//                           style={{ backgroundColor: SEVERITY_COLOR[d.severity] + "33", borderColor: SEVERITY_COLOR[d.severity] }}
//                         />
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2">
//                             <span className="text-xs font-semibold text-foreground">{d.label}</span>
//                             <span className="text-[10px] font-mono text-muted-foreground">{d.id}</span>
//                           </div>
//                           <div className="flex items-center gap-1.5 mt-0.5">
//                             <SeverityBadge severity={d.severity} />
//                             <span className="text-[10px] text-muted-foreground font-mono">
//                               {(d.confidence * 100).toFixed(0)}%
//                             </span>
//                           </div>
//                         </div>
//                         {d.severity === "severe" && (
//                           <AlertTriangle className="w-3.5 h-3.5 text-severity-severe flex-shrink-0" />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Tips */}
//               {scanStep === "done" && (
//                 <div className="rounded-xl border border-border bg-surface-1 p-4 text-xs text-muted-foreground space-y-2">
//                   <p className="font-semibold text-foreground text-sm flex items-center gap-1.5 mb-2">
//                     <Info className="w-3.5 h-3.5 text-primary" />
//                     Reading Results
//                   </p>
//                   <p>Corner brackets indicate detected damage zones. Hover list items to highlight individual detections.</p>
//                   <p>Toggle <span className="text-foreground font-medium">Bounding Boxes</span> or <span className="text-foreground font-medium">Labels</span> from the toolbar above the image.</p>
//                   <p>Use <span className="text-foreground font-medium">Export</span> to download the annotated image.</p>
//                 </div>
//               )}

//               {/* Try sample */}
//               {scanStep === "idle" && (
//                 <div className="rounded-xl border border-border bg-surface-1 p-4 text-xs text-muted-foreground">
//                   <p className="font-semibold text-foreground text-sm mb-2">Suggested Photos</p>
//                   <p>Try uploading any road photo — drone-view, street-level, or dash-cam footage works well for demonstration.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useRef } from "react";
import { Upload, Scan, RotateCcw, Download } from "lucide-react";

export default function Detect() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [resultSrc, setResultSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------
  // HANDLE FILE UPLOAD
  // -------------------------------
  const handleFile = async (file: File) => {
    setImageSrc(URL.createObjectURL(file));
    setLoading(true);
    setResultSrc(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/detect", {
        method: "POST",
        body: formData,
      });

      const blob = await res.blob();
      const imageURL = URL.createObjectURL(blob);

      setResultSrc(imageURL);
    } catch (err) {
      console.error(err);
      alert("Backend error");
    }

    setLoading(false);
  };

  // -------------------------------
  // RESET
  // -------------------------------
  const reset = () => {
    setImageSrc(null);
    setResultSrc(null);
  };

  // -------------------------------
  // DOWNLOAD RESULT
  // -------------------------------
  const downloadImage = () => {
    if (!resultSrc) return;

    const a = document.createElement("a");
    a.href = resultSrc;
    a.download = "infrascan_result.jpg";
    a.click();
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">

      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-cyan-400">
        <Scan /> INFRASCAN
      </h1>

      {!imageSrc && (
        <div
          className="border-2 border-dashed border-gray-500 p-10 rounded-xl cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto mb-3" />
          <p>Click to upload image</p>
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />
        </div>
      )}

      {imageSrc && (
        <div className="flex flex-col items-center gap-4">

          <img src={imageSrc} alt="input" className="max-w-md rounded-lg" />

          {loading && <p className="text-yellow-400">Detecting...</p>}

          {resultSrc && (
            <>
              <h2 className="text-green-400">Detected Result</h2>
              <img src={resultSrc} className="max-w-md rounded-lg border border-green-400" />

              <button
                onClick={downloadImage}
                className="bg-green-500 px-4 py-2 rounded-lg mt-2"
              >
                <Download /> Download
              </button>
            </>
          )}

          <button
            onClick={reset}
            className="bg-red-500 px-4 py-2 rounded-lg mt-2"
          >
            <RotateCcw /> Reset
          </button>
        </div>
      )}
    </div>
  );
}