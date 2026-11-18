"use client";

import React, { useState, useEffect } from "react";
import { analyzeSolarEventHybrid, checkOnDeviceAIAvailability, HybridAnalysisResult } from "@/lib/firebase-ai";
import { Cpu, Cloud, Zap, ShieldAlert, CheckCircle, RefreshCw } from "lucide-react";

interface HybridAIConsoleProps {
  currentStormData?: any;
}

export default function HybridAIConsole({ currentStormData }: HybridAIConsoleProps) {
  const [modePreference, setModePreference] = useState<'auto' | 'prefer-device' | 'prefer-cloud'>('auto');
  const [onDeviceSupported, setOnDeviceSupported] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<HybridAnalysisResult | null>(null);

  useEffect(() => {
    checkOnDeviceAIAvailability().then((available) => {
      setOnDeviceSupported(available);
    });
  }, []);

  const handleRunAnalysis = async () => {
    setLoading(true);
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
  };

  return (
    <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/80 rounded-full">
              #BuildHybridAI 2026
            </span>
            <span className="text-xs text-slate-400">Firebase AI Logic SDK</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            HELIOX Hybrid Inference Engine
          </h2>
          <p className="text-xs text-slate-400">
            Real-time space weather reasoning: Local Gemini Nano with seamless Cloud fallback
          </p>
        </div>

        {/* Hardware Status Indicator */}
        <div className="flex items-center gap-3 bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Local NPU:</span>
            <span className={onDeviceSupported ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
              {onDeviceSupported === null ? "Detecting..." : onDeviceSupported ? "Gemini Nano Ready" : "Simulated / Fallback"}
            </span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300">Cloud AI:</span>
            <span className="text-cyan-400 font-medium">Gemini 2.0 Flash</span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 my-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Inference Strategy:</span>
          <div className="inline-flex rounded-lg bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => setModePreference('auto')}
              className={`px-3 py-1 rounded-md transition-all ${
                modePreference === 'auto'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Auto (Hybrid)
            </button>
            <button
              onClick={() => setModePreference('prefer-device')}
              className={`px-3 py-1 rounded-md transition-all ${
                modePreference === 'prefer-device'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              💻 Prefer On-Device
            </button>
            <button
              onClick={() => setModePreference('prefer-cloud')}
              className={`px-3 py-1 rounded-md transition-all ${
                modePreference === 'prefer-cloud'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ☁️ Prefer Cloud
            </button>
          </div>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-lg text-xs tracking-wide shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Reasoning in Progress...
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5" />
              Run Hybrid Solar Assessment
            </>
          )}
        </button>
      </div>

      {/* Live Result Area */}
      {result ? (
        <div className="mt-4 p-4 rounded-lg bg-slate-900/90 border border-slate-700/80 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-xs pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Execution Engine:</span>
              <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-amber-400 border border-amber-500/30">
                {result.mode}
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 font-mono">
              <span>Latency: <strong className="text-emerald-400">{result.latencyMs} ms</strong></span>
              <span>Source: <strong className="text-slate-300">{result.source}</strong></span>
            </div>
          </div>

          <div className="prose prose-invert prose-sm max-w-none text-slate-200 whitespace-pre-wrap font-sans text-xs leading-relaxed">
            {result.analysis}
          </div>
        </div>
      ) : (
        <div className="mt-4 p-6 rounded-lg border border-dashed border-slate-800 text-center text-slate-500 text-xs">
          Click &quot;Run Hybrid Solar Assessment&quot; to evaluate live NASA/NOAA solar telemetry with Firebase AI Logic.
        </div>
      )}
    </div>
  );
}
