"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  analyzeSolarEventHybrid,
  checkOnDeviceAIAvailability,
  HybridAnalysisResult,
} from "@/lib/firebase-ai";
import { Cpu, Cloud, Zap, RefreshCw, Wifi, WifiOff, Info } from "lucide-react";

interface HybridAIConsoleProps {
  currentStormData?: any;
}

// ─── Typewriter Hook ─────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 12) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const iRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    iRef.current = 0;
    if (!text) return;

    const id = setInterval(() => {
      iRef.current += 1;
      setDisplayed(text.slice(0, iRef.current));
      if (iRef.current >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(id);
  }, [text, speed]);

  return { displayed, done };
}

// ─── Markdown-lite renderer ───────────────────────────────────────────────────
function MarkdownLine({ line }: { line: string }) {
  if (!line.trim()) return <div className="h-2" />;

  // heading (###)
  if (line.startsWith("### ")) {
    return (
      <h3 className="text-amber-400 font-bold text-sm mt-3 mb-1">
        {line.replace("### ", "")}
      </h3>
    );
  }
  if (line.startsWith("## ")) {
    return (
      <h2 className="text-amber-300 font-bold text-base mt-4 mb-1">
        {line.replace("## ", "")}
      </h2>
    );
  }

  // bold inline **text**
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  const rendered = parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="text-white font-semibold">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );

  // bullet
  if (line.startsWith("- ")) {
    return (
      <div className="flex gap-2 text-xs leading-relaxed text-slate-200">
        <span className="text-amber-500 mt-0.5">▸</span>
        <span>{rendered.map((p, i) =>
          p.props?.children?.toString?.().startsWith("- ")
            ? (p.props.children as string).slice(2)
            : p
        )}</span>
      </div>
    );
  }

  return (
    <p className="text-xs leading-relaxed text-slate-200">{rendered}</p>
  );
}

function MarkdownBody({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => (
        <MarkdownLine key={i} line={line} />
      ))}
    </div>
  );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────
function Tooltip({ children, tip }: { children: React.ReactNode; tip: string }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-52 px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-200 text-xs shadow-xl pointer-events-none whitespace-normal leading-snug">
          {tip}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </span>
      )}
    </span>
  );
}

// ─── Comparison Table ─────────────────────────────────────────────────────────
const TABLE_DATA = [
  { metric: "Latency",          onDevice: "< 100 ms",   cloud: "400–1200 ms" },
  { metric: "Privacy",          onDevice: "✅ Full",    cloud: "⚠️ Partial" },
  { metric: "Cost per query",   onDevice: "$0.000",     cloud: "~$0.002" },
  { metric: "Offline capable",  onDevice: "✅ Yes",     cloud: "❌ No" },
  { metric: "Max context",      onDevice: "~6K tokens", cloud: "1M tokens" },
  { metric: "Model",            onDevice: "Gemini Nano","cloud": "Gemini 2.0 Flash" },
];

function ComparisonTable() {
  return (
    <div className="mt-5 rounded-xl border border-slate-700/60 overflow-hidden">
      <div className="bg-slate-800/60 px-4 py-2 flex items-center gap-2 border-b border-slate-700/60">
        <span className="text-xs font-bold text-white tracking-wider uppercase">On-Device vs Cloud — Comparison</span>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-900/80">
            <th className="text-left px-4 py-2 text-slate-400 font-semibold w-1/3">Metric</th>
            <th className="text-center px-4 py-2 text-emerald-400 font-semibold w-1/3">
              <Cpu className="inline w-3 h-3 mr-1" />On-Device
            </th>
            <th className="text-center px-4 py-2 text-cyan-400 font-semibold w-1/3">
              <Cloud className="inline w-3 h-3 mr-1" />Cloud
            </th>
          </tr>
        </thead>
        <tbody>
          {TABLE_DATA.map((row, i) => (
            <tr
              key={row.metric}
              className={`border-t border-slate-800/60 ${i % 2 === 0 ? "bg-slate-900/30" : "bg-slate-900/10"} hover:bg-slate-800/40 transition-colors`}
            >
              <td className="px-4 py-2 text-slate-300 font-medium">{row.metric}</td>
              <td className="px-4 py-2 text-center text-emerald-300 font-mono">{row.onDevice}</td>
              <td className="px-4 py-2 text-center text-cyan-300 font-mono">{row.cloud}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Animated progress bar ────────────────────────────────────────────────────
function ProgressBar({ active }: { active: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }
    setProgress(0);
    // Simulate realistic progress: fast to 70%, then slow
    const steps = [
      { target: 30, delay: 100 },
      { target: 55, delay: 400 },
      { target: 72, delay: 800 },
      { target: 88, delay: 1500 },
      { target: 95, delay: 2500 },
    ];
    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach(({ target, delay }) => {
      timers.push(setTimeout(() => setProgress(target), delay));
    });
    return () => timers.forEach(clearTimeout);
  }, [active]);

  if (!active) return null;

  return (
    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
      <div
        className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HybridAIConsole({ currentStormData }: HybridAIConsoleProps) {
  const [modePreference, setModePreference] = useState<"auto" | "prefer-device" | "prefer-cloud">("auto");
  const [onDeviceSupported, setOnDeviceSupported] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HybridAnalysisResult | null>(null);
  const [liveBlink, setLiveBlink] = useState(true);
  const [borderPulse, setBorderPulse] = useState(false);

  // Typewriter for analysis text
  const { displayed: streamedText, done: streamDone } = useTypewriter(
    result?.analysis ?? "",
    8
  );

  // On-device availability check
  useEffect(() => {
    checkOnDeviceAIAvailability().then(setOnDeviceSupported);
  }, []);

  // LIVE indicator blink
  useEffect(() => {
    const id = setInterval(() => setLiveBlink((b) => !b), 800);
    return () => clearInterval(id);
  }, []);

  // Border pulse while loading
  useEffect(() => {
    if (loading) setBorderPulse(true);
    else setBorderPulse(false);
  }, [loading]);

  const handleRunAnalysis = useCallback(async () => {
    setLoading(true);
    setResult(null);
    try {
      const mockData = currentStormData || {
        kpIndex: 6.3,
        solarWindSpeedKmS: 620,
        cmeSpeedKmS: 1100,
        xRayClass: "M4.2",
        timestamp: new Date().toISOString(),
      };
      const res = await analyzeSolarEventHybrid(mockData, modePreference);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [currentStormData, modePreference]);

  const isOnDevice = result?.mode === "ON-DEVICE (Gemini Nano)";

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #0a0a1e 0%, #0d0a1e 40%, #120818 70%, #0a0f1e 100%)",
        border: borderPulse
          ? "1.5px solid rgba(247,135,8,0.8)"
          : "1.5px solid rgba(100,116,139,0.3)",
        boxShadow: borderPulse
          ? "0 0 30px rgba(247,135,8,0.25), 0 0 60px rgba(247,135,8,0.08), inset 0 0 30px rgba(247,135,8,0.03)"
          : "0 0 0 rgba(0,0,0,0)",
        transition: "border 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      {/* Scan-lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
        }}
      />

      {/* Top gradient stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 z-10"
        style={{
          background: "linear-gradient(90deg, transparent, #f78708 30%, #60a5fa 70%, transparent)",
        }}
      />

      <div className="relative z-10 p-6 space-y-5">
        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5">
            {/* Firebase badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-gradient-to-r from-orange-500/20 to-amber-500/10 border border-orange-500/30 text-orange-300">
              🔥 Powered by Firebase AI Logic
            </div>

            <h2 className="text-xl font-extrabold tracking-tight text-white leading-tight">
              HELIOX{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #f78708, #fda921, #60a5fa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Hybrid Inference Engine
              </span>
            </h2>

            <p className="text-xs text-slate-400 max-w-sm">
              Real-time space weather reasoning — Local Gemini Nano with seamless Cloud fallback.
            </p>
          </div>

          {/* Top-right: LIVE badge + hardware status */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            {/* LIVE indicator */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-widest uppercase"
              style={{
                borderColor: "rgba(74,222,128,0.4)",
                background: "rgba(74,222,128,0.07)",
                color: liveBlink ? "#4ade80" : "rgba(74,222,128,0.4)",
                transition: "color 0.3s",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: liveBlink ? "#4ade80" : "rgba(74,222,128,0.3)",
                  boxShadow: liveBlink ? "0 0 6px #4ade80" : "none",
                  transition: "background 0.3s, box-shadow 0.3s",
                }}
              />
              LIVE
            </div>

            {/* Hardware status */}
            <div className="flex items-center gap-2 bg-slate-900/70 px-3 py-1.5 rounded-lg border border-slate-700/50 text-[11px]">
              <Tooltip tip="Chrome's on-device Gemini Nano via the Prompt API. Runs fully locally on your NPU/CPU — no data leaves your device.">
                <span className="flex items-center gap-1 cursor-help">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-400">NPU:</span>
                  <span
                    className={
                      onDeviceSupported ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"
                    }
                  >
                    {onDeviceSupported === null
                      ? "Detecting…"
                      : onDeviceSupported
                      ? "Gemini Nano ✓"
                      : "Simulated"}
                  </span>
                  <Info className="w-3 h-3 text-slate-500 ml-0.5" />
                </span>
              </Tooltip>
              <span className="text-slate-700">│</span>
              <Tooltip tip="Firebase AI Logic SDK routes to Gemini 2.0 Flash on Google Cloud when on-device is unavailable or overridden.">
                <span className="flex items-center gap-1 cursor-help">
                  <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-400">Cloud:</span>
                  <span className="text-cyan-400 font-semibold">Gemini 2.0 Flash</span>
                  <Info className="w-3 h-3 text-slate-500 ml-0.5" />
                </span>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* ── CONTROL BAR ── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Mode selector */}
          <div className="flex items-center gap-2 text-xs">
            <Tooltip tip="Controls the inference strategy. Auto routes on-device first (Gemini Nano) and falls back to Cloud. Prefer Device forces on-device. Prefer Cloud always uses Firebase AI Logic.">
              <span className="flex items-center gap-1 text-slate-400 font-medium cursor-help">
                Strategy <Info className="w-3 h-3 text-slate-500" />
              </span>
            </Tooltip>
            <div className="inline-flex rounded-lg bg-slate-900/80 p-0.5 border border-slate-700/60">
              {(
                [
                  { val: "auto", label: "⚡ Auto", activeClass: "bg-amber-500 text-slate-950" },
                  { val: "prefer-device", label: "💻 On-Device", activeClass: "bg-emerald-500 text-slate-950" },
                  { val: "prefer-cloud", label: "☁️ Cloud", activeClass: "bg-cyan-500 text-slate-950" },
                ] as const
              ).map(({ val, label, activeClass }) => (
                <button
                  key={val}
                  onClick={() => setModePreference(val)}
                  className={`px-3 py-1 rounded-md transition-all font-semibold ${
                    modePreference === val ? activeClass : "text-slate-400 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Run button */}
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={handleRunAnalysis}
              disabled={loading}
              className="relative flex items-center gap-2 px-5 py-2 font-bold rounded-xl text-xs tracking-wide shadow-lg transition-all active:scale-95 disabled:opacity-70 overflow-hidden"
              style={{
                background: loading
                  ? "linear-gradient(90deg, #d97706, #ea580c)"
                  : "linear-gradient(90deg, #f59e0b, #f97316)",
                color: "#0a0a0a",
              }}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Reasoning in Progress…
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  Run Hybrid Solar Assessment
                </>
              )}
            </button>
            <ProgressBar active={loading} />
          </div>
        </div>

        {/* ── RESULT AREA ── */}
        {result ? (
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              borderColor: isOnDevice
                ? "rgba(52,211,153,0.3)"
                : "rgba(34,211,238,0.3)",
              background: isOnDevice
                ? "rgba(6,78,59,0.08)"
                : "rgba(8,51,68,0.10)",
            }}
          >
            {/* Result header */}
            <div
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b text-xs"
              style={{
                borderColor: isOnDevice
                  ? "rgba(52,211,153,0.2)"
                  : "rgba(34,211,238,0.2)",
                background: isOnDevice
                  ? "rgba(6,78,59,0.15)"
                  : "rgba(8,51,68,0.18)",
              }}
            >
              <div className="flex items-center gap-2">
                <Tooltip tip={isOnDevice ? "Analysis ran fully on-device using Chrome's Prompt API and Gemini Nano. No data was sent to any server." : "Analysis ran on Google Cloud via Firebase AI Logic SDK, using Gemini 2.0 Flash."}>
                  <span className="flex items-center gap-1.5 cursor-help">
                    <span className="text-slate-300 font-semibold">Engine:</span>
                    <span
                      className="px-2 py-0.5 rounded font-mono font-bold border text-[11px]"
                      style={{
                        background: isOnDevice ? "rgba(6,78,59,0.4)" : "rgba(8,51,68,0.4)",
                        borderColor: isOnDevice ? "rgba(52,211,153,0.4)" : "rgba(34,211,238,0.4)",
                        color: isOnDevice ? "#6ee7b7" : "#67e8f9",
                      }}
                    >
                      {result.mode}
                    </span>
                    <Info className="w-3 h-3 text-slate-500" />
                  </span>
                </Tooltip>
              </div>

              <div className="flex items-center gap-4 font-mono text-slate-400">
                <Tooltip tip="Time from button click to full analysis response — includes model inference time.">
                  <span className="flex items-center gap-1 cursor-help">
                    Latency:{" "}
                    <strong
                      className={isOnDevice ? "text-emerald-400" : "text-cyan-400"}
                    >
                      {result.latencyMs} ms
                    </strong>
                    <Info className="w-3 h-3 text-slate-500 ml-0.5" />
                  </span>
                </Tooltip>

                <Tooltip tip={isOnDevice ? "Chrome Prompt API running Gemini Nano on your local NPU. Fully private." : "Firebase AI Logic SDK routing to Google Cloud Gemini 2.0 Flash endpoint."}>
                  <span className="flex items-center gap-1 cursor-help">
                    Source:{" "}
                    <strong className="text-slate-200">{result.source}</strong>
                    <Info className="w-3 h-3 text-slate-500 ml-0.5" />
                  </span>
                </Tooltip>

                {isOnDevice ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <WifiOff className="w-3 h-3" /> Offline-capable
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Wifi className="w-3 h-3" /> Cloud
                  </span>
                )}
              </div>
            </div>

            {/* Typewriter analysis body */}
            <div className="p-4">
              <MarkdownBody text={streamedText} />
              {!streamDone && (
                <span
                  className="inline-block w-2 h-3.5 ml-0.5 align-middle"
                  style={{
                    background: "#f78708",
                    animation: "pulse 1s step-end infinite",
                    verticalAlign: "middle",
                  }}
                />
              )}
            </div>
          </div>
        ) : loading ? (
          /* Loading placeholder */
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 flex flex-col items-center gap-3 text-center animate-pulse">
            <div className="w-10 h-10 rounded-full border-2 border-amber-500/40 border-t-amber-400 animate-spin" />
            <p className="text-amber-400 text-sm font-semibold tracking-wide">
              Running Hybrid Solar Assessment…
            </p>
            <p className="text-slate-500 text-xs">
              Routing to{" "}
              {modePreference === "prefer-cloud"
                ? "Firebase AI Logic / Cloud Gemini"
                : modePreference === "prefer-device"
                ? "On-Device Gemini Nano"
                : "Hybrid Inference Engine"}
            </p>
          </div>
        ) : (
          /* Empty state with pulse */
          <div className="rounded-xl border border-dashed border-slate-700/60 bg-slate-900/30 p-8 flex flex-col items-center gap-3 text-center">
            <div className="relative">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{
                  background: "radial-gradient(circle, rgba(247,135,8,0.15) 0%, transparent 70%)",
                  animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
                }}
              >
                ☀️
              </div>
              <div
                className="absolute inset-0 rounded-full border border-amber-500/20"
                style={{ animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite" }}
              />
            </div>
            <div>
              <p className="text-slate-300 text-sm font-semibold">Esperando datos solares…</p>
              <p className="text-slate-500 text-xs mt-1">
                Press{" "}
                <span className="text-amber-400 font-mono">Run Hybrid Solar Assessment</span> to
                evaluate live NASA/NOAA telemetry with Firebase AI Logic.
              </p>
            </div>
          </div>
        )}

        {/* ── COMPARISON TABLE ── */}
        <ComparisonTable />

        {/* ── FOOTER BADGE ── */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
          <span className="font-mono">
            🔥 Firebase AI Logic SDK · #BuildHybridAI 2026 · Google Firebase Hackathon
          </span>
          <span className="text-slate-600">
            {result
              ? `Last analysis: ${new Date(result.timestamp).toLocaleTimeString()}`
              : "No analysis yet"}
          </span>
        </div>
      </div>
    </div>
  );
}
