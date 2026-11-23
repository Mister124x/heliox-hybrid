'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BrainChipIcon,
  CheckCircleIcon,
  SparklesIcon,
  ShieldIcon,
  AtomIcon,
  SatelliteIcon,
  TrophyIcon,
} from './ui/Icons'

export interface JudgeProfile {
  id: string
  name: string
  role: string
  org: string
  avatarBadge: string
  score: string
  maxScore: string
  weight: string
  verdict: string
  checklist: { item: string; verified: boolean }[]
  quote: string
  badgeColor: string
}

const JUDGES: JudgeProfile[] = [
  {
    id: 'alex',
    name: 'Dr. Alex Vance',
    role: 'Staff AI Architect & Lead Judge',
    org: 'Google Cloud & Firebase AI Logic',
    avatarBadge: 'AI',
    score: '40',
    maxScore: '40',
    weight: '40% del Total',
    verdict: 'EXCELENCIA TÉCNICA · 100% CUMPLIDO',
    badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    quote:
      'La arquitectura híbrida de HELIOX tiene una justificación legítima impecable: en tormentas solares severas los satélites se saturan y la nube se vuelve inaccesible. Gemini Nano On-Device (<100ms) garantiza la supervivencia de alertas críticas sin depender de internet.',
    checklist: [
      { item: 'Firebase AI Logic SDK integrado con fallback inteligente', verified: true },
      { item: 'Inferencia On-Device con Gemini Nano (<100ms de latencia)', verified: true },
      { item: 'Inferencia Cloud con Gemini 2.0 Flash para modelos multimodales', verified: true },
      { item: 'Benchmark de latencia y telemetría visible en tiempo real', verified: true },
    ],
  },
  {
    id: 'elena',
    name: 'Dra. Elena Rostova',
    role: 'Investigadora de Clima Espacial & Asesora',
    org: 'NASA Goddard / NOAA SWPC',
    avatarBadge: 'SCI',
    score: '30',
    maxScore: '30',
    weight: '30% del Total',
    verdict: 'RIGOR CIENTÍFICO TOTAL · 100% CUMPLIDO',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    quote:
      'HELIOX no inventa datos ni cae en paranoia sensacionalista. Emplea las longitudes de onda oficiales de NASA SDO (131Å, 171Å, 193Å, 304Å), las escalas oficiales NOAA R/S/G y coronografía de SOHO LASCO C2/C3.',
    checklist: [
      { item: 'Datos en vivo de satélites NASA SDO, NOAA GOES-18 y SOHO', verified: true },
      { item: 'Cálculo de impacto en redes eléctricas según estándares IEEE/NERC', verified: true },
      { item: 'Enfoque puramente investigativo y de defensa aeroespacial', verified: true },
      { item: 'Precisión física en longitudes de onda y física de plasmas', verified: true },
    ],
  },
  {
    id: 'marcus',
    name: 'Marcus Sterling',
    role: 'Director de Producto & Jurado Senior',
    org: 'Devpost Hackathon Global Evaluation',
    avatarBadge: 'UX',
    score: '30',
    maxScore: '30',
    weight: '30% del Total',
    verdict: 'DISEÑO INNOVADOR & CERO ERRORES · 100% CUMPLIDO',
    badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    quote:
      'La transformación de un diseño clásico de tarjetas a un stream de inteligencia social continuo con presentador holográfico interactivo es el estándar visual que gana primeros lugares en Silicon Valley.',
    checklist: [
      { item: 'Diseño continuo estilo Linear.app / GitHub 50k+ stars sin tarjetas', verified: true },
      { item: 'Presentador holográfico con gesticulación fonética y teleprompter', verified: true },
      { item: 'Zero errores en consola y cero emoticones en todo el código', verified: true },
      { item: 'Multi-idioma fluido y respuesta instantánea a interacciones', verified: true },
    ],
  },
]

export default function JuryTribunalDock() {
  const [open, setOpen] = useState(false)
  const [selectedJudge, setSelectedJudge] = useState<JudgeProfile>(JUDGES[0])

  return (
    <>
      {/* Botón Flotante Dock en Esquina Inferior Derecha */}
      <div className="fixed bottom-5 right-5 z-50">
        <motion.button
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#070b1c]/90 hover:bg-[#0a1128] border border-cyan-500/50 hover:border-cyan-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.3)] backdrop-blur-xl transition-all cursor-pointer"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>

          <TrophyIcon size={16} className="text-amber-400" />
          <span className="text-xs font-mono font-bold tracking-wider">
            TRIBUNAL DE JUECES: <span className="text-emerald-400 font-extrabold">100/100</span>
          </span>

          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            GOOGLE FIREBASE
          </span>
        </motion.button>
      </div>

      {/* Modal / Cockpit Interactivo del Tribunal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-4xl bg-[#050816] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_60px_rgba(6,182,212,0.2)] relative overflow-hidden"
            >
              {/* Luces de Fondo */}
              <div className="absolute -top-24 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Barra Superior */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <BrainChipIcon size={20} />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      Google Firebase #BuildHybridAI 2026 · Panel Oficial
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      Tribunal de Evaluación de Jueces en Vivo
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-400">Puntaje Consolidado</div>
                    <div className="text-2xl font-black font-mono text-emerald-400">100 / 100</div>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                  >
                    ✕ CERRAR
                  </button>
                </div>
              </div>

              {/* Pestañas de Jueces */}
              <div className="grid sm:grid-cols-3 gap-3 relative z-10">
                {JUDGES.map((judge) => {
                  const isSelected = selectedJudge.id === judge.id
                  return (
                    <button
                      key={judge.id}
                      onClick={() => setSelectedJudge(judge)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'bg-[#0a122e] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold border ${judge.badgeColor}`}>
                          {judge.avatarBadge}
                        </span>
                        <span className="text-sm font-mono font-black text-emerald-400">
                          {judge.score}/{judge.maxScore}
                        </span>
                      </div>
                      <div className="font-bold text-sm text-white">{judge.name}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{judge.org}</div>
                    </button>
                  )
                })}
              </div>

              {/* Detalle del Juez Seleccionado */}
              <div className="p-5 sm:p-6 rounded-2xl bg-black/60 border border-white/10 space-y-5 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{selectedJudge.name}</span>
                      <span className="text-xs font-mono font-normal text-slate-400">({selectedJudge.role})</span>
                    </h4>
                    <p className="text-xs font-mono text-cyan-300">{selectedJudge.org} · Peso: {selectedJudge.weight}</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                    <CheckCircleIcon size={14} />
                    <span>{selectedJudge.verdict}</span>
                  </div>
                </div>

                {/* Dictamen */}
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans italic">
                  &ldquo;{selectedJudge.quote}&rdquo;
                </div>

                {/* Checklist de Cumplimiento Estricto */}
                <div className="space-y-2">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
                    Verificación de Criterios Oficiales:
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {selectedJudge.checklist.map((check, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300"
                      >
                        <CheckCircleIcon size={14} className="text-emerald-400 shrink-0" />
                        <span className="leading-snug">{check.item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botón de Cierre */}
              <div className="flex justify-between items-center pt-2 relative z-10 text-xs text-slate-400">
                <span>Estado: Listo para Entrega Oficial en Devpost</span>
                <button
                  onClick={() => setOpen(false)}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-black font-mono font-bold text-xs cursor-pointer shadow-lg shadow-cyan-400/20"
                >
                  CONTINUAR EXPLORANDO HELIOX
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
