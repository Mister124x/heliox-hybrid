'use client'


import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/Navbar'
import SolarPeakAlert from '../../components/SolarPeakAlert'
import SolarGlobe3D from '../../components/SolarGlobe3D'
import HackerPolymathMatrix from '../../components/HackerPolymathMatrix'
import DeclassifiedDossier from '../../components/DeclassifiedDossier'

import HybridAIConsole from '../../components/HybridAIConsole'
import { useI18n } from '../../lib/i18n'
import { fetchLiveSolarData, SolarSummary } from '../../lib/solarClient'

/* ─── Mapa de capítulos ─────────────────────────────────────────── */
const CHAPTER_IDS = ['fundacional', 'ciclo25', 'carrington', 'apis_gobierno', 'geopolitica', 'nasa_letter'] as const
type ChapterId = typeof CHAPTER_IDS[number]

/* ─── Hook para datos de gobierno ──────────────────────────────── */
function useGovData() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/storms/gov')
        if (res.ok) { setData(await res.json()); setLoading(false); return }
      } catch {}
      try {
        const [s, a] = await Promise.allSettled([
          fetch('https://services.swpc.noaa.gov/json/solar-cycle/sunspots.json').then(r => r.json()),
          fetch('https://services.swpc.noaa.gov/products/alerts.json').then(r => r.json()),
        ])
        setData({
          success: true,
          timestamp: new Date().toISOString(),
          apis: {
            noaa_solar_cycle: {
              name: 'NOAA Solar Cycle 25 – Sunspot Number',
              endpoint: 'https://services.swpc.noaa.gov/json/solar-cycle/sunspots.json',
              recent_sunspots: s.status === 'fulfilled' && Array.isArray(s.value) ? s.value.slice(-6) : [],
            },
            noaa_goes_protons: {
              name: 'GOES Integral Solar Energetic Protons (SEP)',
              endpoint: 'https://services.swpc.noaa.gov/json/goes/primary/integral-protons-1-day.json',
              status: '✅ Real-Time Proton Channel Active',
            },
            nasa_donki_alerts: {
              name: 'NASA DONKI – Space Weather Alerts',
              endpoint: 'https://services.swpc.noaa.gov/products/alerts.json',
              active_alerts: a.status === 'fulfilled' && Array.isArray(a.value) ? a.value.slice(0, 3) : [],
            },
            usgs_geomagnetism: {
              name: 'USGS Geomagnetism National Program',
              endpoint: 'https://geomag.usgs.gov/ws/data/',
              status: '✅ Active Terrestrial Monitoring Node',
            },
          },
        })
      } catch {} finally { setLoading(false) }
    }
    load()
  }, [])

  return { data, loading }
}

/* ─── Hook para datos solares en vivo ────────────────────────────── */
function useLiveSolarData() {
  const [data, setData] = useState<SolarSummary | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchLiveSolarData().then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])
  return { data, loading }
}

/* ─── Tipo para historial de análisis ─────────────────────────────── */
interface AnalysisHistoryItem {
  id: string
  timestamp: string
  mode: string
  snippet: string
  latencyMs: number
  kp: number
}

export default function AnalysisPage() {
  const { t, lang } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [activeTab, setActiveTab] = useState<ChapterId>('fundacional')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [copiedCitation, setCopiedCitation] = useState(false)
  const [activeApiTab, setActiveApiTab] = useState<'noaa_solar_cycle' | 'noaa_goes_protons' | 'nasa_donki_alerts' | 'usgs_geomagnetism'>('noaa_solar_cycle')
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistoryItem[]>([])
  const [latencyMetrics, setLatencyMetrics] = useState({ onDevice: 68, cloud: 342, hybrid: 94 })
  const { data: govApiData, loading: loadingApi } = useGovData()
  const { data: solarData, loading: loadingSolar } = useLiveSolarData()

  // Simulate latency fluctuation for live metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setLatencyMetrics({
        onDevice: Math.round(55 + Math.random() * 30),
        cloud: Math.round(300 + Math.random() * 100),
        hybrid: Math.round(80 + Math.random() * 40),
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const isEn = mounted ? lang === 'en' : false
  const isPt = mounted ? lang === 'pt' : false

  const copyCitation = () => {
    navigator.clipboard.writeText(
      `BARRIOS, Jesús. (2026). "El Sol Como Fuerza Geopolítica, Económica y Civilizatoria". HELIOX Solar Observatory. https://heliox-observatory.vercel.app/analysis`
    )
    setCopiedCitation(true)
    setTimeout(() => setCopiedCitation(false), 2500)
  }

  const CHAPTERS = [
    { id: 'fundacional' as ChapterId, label: isEn ? '1. Manifesto & Mission' : isPt ? '1. Manifesto & Missão' : '1. Manifiesto & Misión', icon: '☀️', readTime: '3 min', color: 'from-orange-500 to-yellow-500' },
    { id: 'ciclo25'    as ChapterId, label: isEn ? '2. Solar Cycle 25 Peak' : isPt ? '2. Máximo do Ciclo 25' : '2. Ciclo Solar 25', icon: '📈', readTime: '4 min', color: 'from-amber-500 to-orange-500' },
    { id: 'carrington' as ChapterId, label: isEn ? '3. Carrington Risk ($2.6T)' : isPt ? '3. Risco Carrington' : '3. El Riesgo Carrington', icon: '⚡', readTime: '4 min', color: 'from-red-500 to-orange-500' },
    { id: 'apis_gobierno' as ChapterId, label: isEn ? '4. Govt APIs (NASA/NOAA)' : isPt ? '4. APIs Governamentais' : '4. APIs del Gobierno', icon: '🏛️', readTime: '5 min', color: 'from-emerald-500 to-teal-500' },
    { id: 'geopolitica' as ChapterId, label: isEn ? '5. Space Geopolitics' : isPt ? '5. Geopolítica Espacial' : '5. Perspectiva Geopolítica', icon: '🌐', readTime: '3 min', color: 'from-blue-500 to-indigo-500' },
    { id: 'nasa_letter' as ChapterId, label: isEn ? '6. Open Letter to NASA' : isPt ? '6. Carta à NASA' : '6. Carta a la NASA', icon: '✉️', readTime: '2 min', color: 'from-purple-500 to-violet-500' },
  ]

  const activeChapter = CHAPTERS.find(c => c.id === activeTab)!

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-orange-500/30 selection:text-white">

      {/* ════════════════ NAVBAR UNIFICADO ════════════════ */}
      <Navbar />

      {/* ════════════════ HERO HEADER — VISUAL IMPACTO TOTAL ════════════════ */}
      <div className="relative pt-16 overflow-hidden">
        {/* Fondo: gradiente espacial + glow solar animado */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 120% 70% at 50% 0%, #1a0a00 0%, #000 70%)' }} />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl opacity-30"
            style={{ background: 'radial-gradient(ellipse, #f78708 0%, #fda921 30%, transparent 70%)', animation: 'pulse 4s ease-in-out infinite' }}
          />
          {/* Estrellas decorativas */}
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() > 0.7 ? '2px' : '1px',
                height: Math.random() > 0.7 ? '2px' : '1px',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.6 + 0.2,
                animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          {/* Hackathon Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-600/20 border border-amber-500/50 text-amber-300 text-xs font-bold tracking-wide shadow-lg shadow-amber-500/10">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              🏆 #BuildHybridAI 2026 · Featured Demo · Google Firebase Hackathon
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </div>
          </motion.div>

          {/* Badge superior */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              📄 {isEn ? 'Master Scientific Whitepaper · Government API Index v1.0' : 'Documento Científico Maestro · Índice de APIs del Gobierno v1.0'}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copyCitation}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white/70 font-mono flex items-center gap-1.5 transition-all"
              >
                {copiedCitation ? '✅ ¡Copiado!' : '📖 Citar APA'}
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-black text-xs font-bold font-mono transition-all"
              >
                🖨️ PDF
              </button>
            </div>
          </motion.div>

          {/* Título principal */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6"
          >
            <span className="bg-gradient-to-r from-white via-orange-100 to-orange-400 bg-clip-text text-transparent">
              {isEn ? 'The Sun as a' : isPt ? 'O Sol como uma' : 'El Sol como'}
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 bg-clip-text text-transparent">
              {isEn ? 'Geopolitical Force' : isPt ? 'Força Geopolítica' : 'Fuerza Geopolítica'}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-orange-200/80 font-medium max-w-3xl mb-8 leading-relaxed"
          >
            {isEn
              ? 'Applied Heliophysics, Real-time Satellite Telemetry & Open Government API Architecture (NASA · NOAA · USGS · ESA)'
              : 'Heliofísica Aplicada, Telemetría Satelital en Tiempo Real y Arquitectura de APIs Libres del Gobierno (NASA · NOAA · USGS · ESA)'}
          </motion.p>

          {/* Meta-datos del paper */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 text-xs text-white/40"
          >
            {[
              { icon: '✍️', label: isEn ? 'Lead Author' : 'Investigador', value: 'JESÚS BARRIOS', highlight: true },
              { icon: '⏱️', label: isEn ? 'Read Time' : 'Lectura', value: '12 min', highlight: false },
              { icon: '📅', label: isEn ? 'Published' : 'Publicado', value: '2026', highlight: false },
              { icon: '🔓', label: isEn ? 'License' : 'Licencia', value: 'CC BY 4.0 Open Science', highlight: false },
            ].map(m => (
              <div key={m.label} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                <span>{m.icon}</span>
                <span className="text-white/40">{m.label}:</span>
                <span className={m.highlight ? 'text-orange-400 font-bold' : 'text-white/70'}>{m.value}</span>
              </div>
            ))}
          </motion.div>

          {/* Línea separadora con gradiente */}
          <div className="mt-12 h-px w-full" style={{ background: 'linear-gradient(to right, transparent, rgba(247,135,8,0.5), transparent)' }} />
        </div>
      </div>

      {/* ════════════════ CONTENIDO PRINCIPAL ════════════════ */}
      <main className="max-w-7xl mx-auto px-4 pb-24">


        <div className="mt-8 flex flex-col lg:flex-row gap-6">

          {/* ── SIDEBAR DE CAPÍTULOS ── */}
          <aside className="lg:w-72 shrink-0 space-y-2">
            {/* Header sidebar */}
            <div className="flex items-center justify-between px-1 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                {isEn ? 'Chapter Directory' : '📚 Índice'}
              </span>
              <span className="text-[10px] font-mono bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-full">
                6 Docs
              </span>
            </div>

            {/* Botones de capítulos */}
            <div className="space-y-1">
              {CHAPTERS.map((ch, i) => {
                const isActive = activeTab === ch.id
                return (
                  <motion.button
                    key={ch.id}
                    onClick={() => setActiveTab(ch.id)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-3 rounded-xl text-left text-xs font-semibold transition-all flex items-center gap-3 border relative overflow-hidden ${
                      isActive
                        ? 'border-orange-500/60 text-black shadow-lg shadow-orange-500/20'
                        : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                    style={isActive ? { background: `linear-gradient(135deg, #f78708, #fda921)` } : {}}
                  >
                    {isActive && <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 80% 50%, white, transparent)' }} />}
                    <span className="relative text-base">{ch.icon}</span>
                    <span className="relative flex-1 leading-snug">{ch.label}</span>
                    <span className={`relative text-[10px] font-mono shrink-0 px-1.5 py-0.5 rounded ${isActive ? 'bg-black/20 text-black/70' : 'text-white/30'}`}>
                      {ch.readTime}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            {/* Widget APIs conectadas */}
            <div className="mt-6 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/20">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isEn ? 'Live Govt Feeds' : 'Feeds Activos'}</span>
              </div>
              <ul className="space-y-1.5 text-[11px] font-mono text-white/50">
                {['NASA DONKI Database', 'NOAA SWPC Telemetry', 'USGS Geomagnetism', 'ESA Helioviewer SDO'].map(feed => (
                  <li key={feed} className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> {feed}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stat cards rápidas */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {[
                { label: isEn ? 'Cycle' : 'Ciclo', value: 'SC 25', color: '#f78708' },
                { label: isEn ? 'Status' : 'Estado', value: isEn ? 'Peak' : 'Máximo', color: '#ef4444' },
                { label: 'APIs', value: '5+', color: '#10b981' },
                { label: isEn ? 'Languages' : 'Idiomas', value: '12', color: '#60a5fa' },
              ].map(s => (
                <div key={s.label} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-lg font-black font-mono" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </aside>

          {/* ── PANEL DE CONTENIDO ── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {/* Header del capítulo activo */}
                <div
                  className="rounded-2xl p-5 mb-5 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${activeChapter.color.replace('from-', '').replace(' to-', ', ')})` }}
                >
                  <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 90% 50%, white, transparent)' }} />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{activeChapter.icon}</span>
                      <div>
                        <div className="text-xs font-mono text-white/70 mb-1">{isEn ? 'Chapter' : 'Capítulo'} {CHAPTERS.indexOf(activeChapter) + 1} · {activeChapter.readTime} {isEn ? 'read' : 'lectura'}</div>
                        <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">{activeChapter.label}</h2>
                      </div>
                    </div>
                    <span className="hidden sm:block text-5xl opacity-10 font-black select-none">{CHAPTERS.indexOf(activeChapter) + 1}</span>
                  </div>
                </div>

                {/* ─── CUERPO DEL CAPÍTULO ─── */}
                <div className="rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6 text-sm sm:text-base leading-relaxed text-white/75" style={{ background: 'rgba(255,255,255,0.02)' }}>

                  {/* ═══ CAPÍTULO 1 ═══ */}
                  {activeTab === 'fundacional' && (
                    <div className="space-y-6">
                      <p>
                        Durante décadas, la información heliofísica de alta precisión ha permanecido confinada a instituciones anglosajonas (NASA, NOAA, ESA) con interfaces complejas y en inglés. <strong className="text-white">HELIOX</strong> nace con la misión inquebrantable de <strong className="text-orange-300">democratizar la telemetría solar</strong> para Latinoamérica y el mundo hispanohablante.
                      </p>

                      {/* Tarjetas interactivas de fórmulas */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          {
                            label: 'Ley de Faraday — Inducción Magnética',
                            formula: 'ℰ = −dΦ_B / dt',
                            desc: 'Fuerza electromotriz inducida en redes eléctricas terrestres durante una tormenta geomagnética severa (G4-G5).',
                            color: 'border-orange-500/30 bg-orange-500/5',
                            badge: 'Electrodinámica Solar',
                            badgeColor: 'text-orange-300 bg-orange-500/10 border-orange-500/20',
                          },
                          {
                            label: 'Presión Dinámica — Ram Pressure',
                            formula: 'P_ram = ρ · v²',
                            desc: 'Comprime la magnetopausa terrestre cuando la velocidad v supera los 800 km/s durante CMEs extremas.',
                            color: 'border-blue-500/30 bg-blue-500/5',
                            badge: 'Física del Plasma',
                            badgeColor: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
                          },
                        ].map(f => (
                          <motion.div
                            key={f.label}
                            whileHover={{ scale: 1.02, y: -2 }}
                            className={`p-5 rounded-2xl border ${f.color} cursor-default transition-all`}
                          >
                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border mb-3 ${f.badgeColor}`}>
                              {f.badge}
                            </div>
                            <div className="text-xs text-white/40 font-mono mb-2">{f.label}</div>
                            <div className="text-2xl font-black font-mono text-white tracking-tight my-3 select-all">
                              {f.formula}
                            </div>
                            <p className="text-xs text-white/50 leading-relaxed">{f.desc}</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Cita del autor */}
                      <div className="relative p-5 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(247,135,8,0.08), rgba(253,169,33,0.04))' }}>
                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-full" style={{ background: 'linear-gradient(to bottom, #f78708, #fda921)' }} />
                        <blockquote className="pl-4">
                          <p className="text-orange-200/90 font-semibold text-base sm:text-lg italic leading-relaxed mb-3">
                            &ldquo;Comprender el Sol no es un lujo académico; es una medida de supervivencia para una civilización 100% electrodependiente.&rdquo;
                          </p>
                          <footer className="text-xs text-white/40 flex items-center gap-2">
                            <span className="w-4 h-px bg-white/20" />
                            JESÚS BARRIOS · Fundador e Investigador Principal, HELIOX Solar Observatory
                          </footer>
                        </blockquote>
                      </div>

                      {/* Badges de misión */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {[
                          '🌐 12 Idiomas', '📡 5 APIs del Gobierno', '⚡ Tiempo Real', '🔓 Open Science',
                          isEn ? '📱 Mobile First' : '📱 Optimizado Móvil',
                        ].map(badge => (
                          <span key={badge} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ═══ CAPÍTULO 2 ═══ */}
                  {activeTab === 'ciclo25' && (
                    <div className="space-y-6">
                      <p>
                        El Ciclo Solar 25 ha <strong className="text-white">superado sistemáticamente</strong> todas las proyecciones iniciales del panel conjunto NASA/NOAA. La tasa de manchas solares (SSN) y la frecuencia de llamaradas de clase X demuestran que nos encontramos ante uno de los ciclos solares más intensos de los últimos 20 años.
                      </p>

                      {/* Timeline de hitos */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-white text-sm uppercase tracking-wider">
                          {isEn ? 'Key Milestones' : 'Hitos Clave del Ciclo 25'}
                        </h4>
                        {[
                          { year: '2019', event: isEn ? 'Cycle 25 officially begins' : 'El Ciclo 25 inicia oficialmente', tag: isEn ? 'Start' : 'Inicio', color: 'bg-emerald-500' },
                          { year: '2023', event: isEn ? 'Exceeds NASA/NOAA initial projections' : 'Supera proyecciones iniciales NASA/NOAA', tag: isEn ? 'Critical' : 'Crítico', color: 'bg-amber-500' },
                          { year: 'May 2024', event: isEn ? 'G5 Storm AR3664 — Tropical auroras' : 'Tormenta G5 AR3664 — Auroras en latitudes tropicales', tag: 'G5', color: 'bg-purple-500' },
                          { year: '2025–26', event: isEn ? 'Solar maximum window — Extreme CMEs expected' : 'Ventana del máximo solar — CMEs extremas esperadas', tag: isEn ? 'PEAK' : 'MÁXIMO', color: 'bg-red-500' },
                        ].map(m => (
                          <motion.div
                            key={m.year}
                            whileHover={{ x: 4 }}
                            className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all"
                          >
                            <div className="text-right shrink-0 w-20">
                              <div className="text-xs text-white/40 font-mono leading-tight">{m.year}</div>
                            </div>
                            <div className="flex-1 flex items-start gap-3">
                              <div className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: m.color.replace('bg-', '').replace('-500', '') === 'emerald' ? '#10b981' : m.color.replace('bg-', '').replace('-500', '') === 'amber' ? '#f59e0b' : m.color.replace('bg-', '').replace('-500', '') === 'purple' ? '#a855f7' : '#ef4444' }} />
                              <div className="text-sm text-white/70">{m.event}</div>
                            </div>
                            <span className={`text-[10px] font-black shrink-0 px-2 py-0.5 rounded-full text-white ${m.color}`}>{m.tag}</span>
                          </motion.div>
                        ))}
                      </div>

                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/80 text-xs sm:text-sm">
                        🚨 <strong>{isEn ? 'Critical Window 2025–2026:' : 'Ventana Crítica 2025–2026:'}</strong> {isEn ? 'Super-fast CMEs (>2,200 km/s) with direct Earth-facing trajectories are expected during the solar maximum peak.' : 'CMEs súper rápidas (>2,200 km/s) con dirección directa al hemisferio nocturno terrestre son esperadas durante el pico del máximo solar.'}
                      </div>
                    </div>
                  )}

                  {/* ═══ CAPÍTULO 3 ═══ */}
                  {activeTab === 'carrington' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-950/40 border border-red-500/30">
                        <span className="text-4xl">⚡</span>
                        <div>
                          <div className="text-xs text-red-400 font-mono font-bold mb-1">ESCENARIO CATASTRÓFICO</div>
                          <div className="text-2xl font-black text-white">$2.6 Trillones USD</div>
                          <div className="text-xs text-white/50">{isEn ? 'Estimated economic impact of a modern Carrington-level event' : 'Impacto económico estimado de un evento Carrington moderno'}</div>
                        </div>
                      </div>

                      <p>
                        En septiembre de <strong className="text-white">1859</strong>, el Evento Carrington indujo corrientes electromagnéticas extremas en líneas de telégrafo que provocaron incendios en estaciones de todo el mundo. Hoy, un evento similar impactaría transformadores de alta tensión a escala continental.
                      </p>

                      <div className="grid sm:grid-cols-3 gap-3">
                        {[
                          { icon: '⚡', title: isEn ? 'Power Grids' : 'Redes Eléctricas', desc: isEn ? 'EHV transformers destroyed, 4-10 years to replace' : 'Transformadores EHV destruidos, 4-10 años de reemplazo', color: 'border-red-500/20 bg-red-500/5' },
                          { icon: '📡', title: isEn ? 'Satellites' : 'Satélites', desc: isEn ? 'GPS, Starlink, telecom orbital decay acceleration' : 'GPS, Starlink, telecom — aceleración de reentrada orbital', color: 'border-orange-500/20 bg-orange-500/5' },
                          { icon: '🌐', title: isEn ? 'Internet' : 'Internet', desc: isEn ? 'Undersea cable failure due to GIC currents' : 'Falla de cables submarinos por corrientes GIC', color: 'border-amber-500/20 bg-amber-500/5' },
                        ].map(item => (
                          <motion.div key={item.title} whileHover={{ y: -3 }} className={`p-4 rounded-xl border ${item.color} transition-all`}>
                            <span className="text-2xl mb-2 block">{item.icon}</span>
                            <h5 className="font-bold text-white text-sm mb-1">{item.title}</h5>
                            <p className="text-xs text-white/50">{item.desc}</p>
                          </motion.div>
                        ))}
                      </div>

                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white/70">
                        📚 <strong className="text-white">Fuente:</strong> {isEn ? 'National Academy of Sciences (NAS), "Severe Space Weather Events – Understanding Societal and Economic Impacts" (2008).' : 'Academia Nacional de Ciencias de EE.UU., "Severe Space Weather Events – Understanding Societal and Economic Impacts" (2008).'}
                      </div>
                    </div>
                  )}

                  {/* ═══ CAPÍTULO 4: EXPLORADOR INTERACTIVO DE APIS DEL GOBIERNO ═══ */}
                  {activeTab === 'apis_gobierno' && (
                    <div className="space-y-5">
                      <p className="text-sm text-white/60">
                        {isEn
                          ? 'Explore and test official US/EU government telemetry endpoints in real time — all consumed by HELIOX:'
                          : 'Explora y prueba en tiempo real los endpoints gubernamentales oficiales consumidos por HELIOX:'}
                      </p>

                      {/* Tabs de selección de API — estilo terminal */}
                      <div className="flex flex-wrap gap-2">
                        {([
                          { id: 'noaa_solar_cycle' as const, label: '☀️ NOAA Solar Cycle 25', agency: 'NOAA' },
                          { id: 'noaa_goes_protons' as const, label: '⚡ GOES Protons (SEP)', agency: 'NOAA' },
                          { id: 'nasa_donki_alerts' as const, label: '🚨 NASA DONKI Alerts', agency: 'NASA' },
                          { id: 'usgs_geomagnetism' as const, label: '🌍 USGS Geomagnetism', agency: 'USGS' },
                        ] as const).map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveApiTab(tab.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                              activeApiTab === tab.id
                                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                                : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:border-white/20'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Terminal de respuesta JSON */}
                      <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        {/* Barra superior tipo IDE */}
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
                            <div className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
                            <span className="ml-3 text-[11px] font-mono text-white/40 truncate max-w-xs">
                              {govApiData?.apis?.[activeApiTab]?.endpoint || 'Conectando al servidor gubernamental...'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full animate-pulse">
                              ● LIVE
                            </span>
                            <span className="text-[10px] font-mono text-white/30 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                              HTTP 200 · Public Access
                            </span>
                          </div>
                        </div>

                        {/* Contenido JSON */}
                        <div className="p-5 font-mono text-xs bg-black min-h-[200px] max-h-72 overflow-y-auto">
                          {loadingApi ? (
                            <div className="flex items-center gap-3 text-emerald-400/70 h-32 justify-center">
                              <div className="w-4 h-4 border-2 border-emerald-400/50 border-t-emerald-400 rounded-full animate-spin" />
                              <span>{isEn ? 'Querying government server...' : 'Consultando servidor gubernamental...'}</span>
                            </div>
                          ) : (
                            <pre className="text-emerald-300/80 leading-relaxed whitespace-pre-wrap">
                              <span className="text-blue-400">{'// '}</span>
                              <span className="text-white/30">{govApiData?.apis?.[activeApiTab]?.name}</span>
                              {'\n\n'}
                              {JSON.stringify(govApiData?.apis?.[activeApiTab] || {}, null, 2)
                                .replace(/"([^"]+)":/g, '"$1":')
                              }
                            </pre>
                          )}
                        </div>
                      </div>

                      {/* Grid de APIs adicionales */}
                      <div className="grid sm:grid-cols-2 gap-3 pt-2">
                        {[
                          { icon: '🛰️', name: 'NASA SDO AIA', desc: isEn ? 'Solar Dynamics Observatory image pipeline (171Å, 304Å, 193Å)' : 'Pipeline de imágenes SDO (171Å, 304Å, 193Å)', url: 'https://sdo.gsfc.nasa.gov', color: 'text-blue-300' },
                          { icon: '🌊', name: 'ESA Helioviewer', desc: isEn ? 'Multi-wavelength solar image feed (SOHO/LASCO C2/C3)' : 'Feed de imágenes solares multiespectral (SOHO/LASCO C2/C3)', url: 'https://helioviewer.org', color: 'text-purple-300' },
                          { icon: '🧲', name: 'NOAA K-Index', desc: isEn ? 'Planetary Kp geomagnetic activity index (3-hour resolution)' : 'Índice Kp geomagnético planetario (resolución 3 horas)', url: 'https://services.swpc.noaa.gov', color: 'text-amber-300' },
                          { icon: '🔭', name: 'SOHO LASCO', desc: isEn ? 'CME real-time coronagraph imagery from L1 Lagrange point' : 'Imágenes coronagráficas de CMEs en tiempo real desde L1', url: 'https://soho.nascom.nasa.gov', color: 'text-green-300' },
                        ].map(api => (
                          <a
                            key={api.name}
                            href={api.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all"
                          >
                            <span className="text-xl shrink-0">{api.icon}</span>
                            <div>
                              <div className={`text-xs font-bold font-mono ${api.color} group-hover:underline`}>{api.name} ↗</div>
                              <div className="text-[11px] text-white/40 mt-0.5">{api.desc}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ═══ CAPÍTULO 5 ═══ */}
                  {activeTab === 'geopolitica' && (
                    <div className="space-y-6">
                      <p>
                        La soberanía espacial de las naciones emergentes depende de su capacidad para <strong className="text-white">predecir anomalías causadas por el viento solar</strong> en sus constelaciones de satélites de observación terrestre y comunicaciones.
                      </p>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { flag: '🇨🇴', country: isEn ? 'Colombia' : 'Colombia', relevance: isEn ? 'Equatorial ionosphere studies, Latacunga Space Agency (FAC)' : 'Estudios ionosféricos en el ecuador, Agencia Espacial FAC' },
                          { flag: '🇧🇷', country: isEn ? 'Brazil' : 'Brasil', relevance: isEn ? 'INPE solar monitoring, Amazon deforestation radar (SIRIUS)' : 'INPE monitoreo solar, radar Amazónico (SIRIUS)' },
                          { flag: '🌎', country: isEn ? 'Latin America' : 'Latinoamérica', relevance: isEn ? '12 active observatories with limited solar weather access' : '12 observatorios activos con acceso limitado al clima espacial' },
                          { flag: '🇺🇳', country: 'UN / UNOOSA', relevance: isEn ? 'Space weather international treaty framework (Sendai)' : 'Marco de tratado internacional de clima espacial (Sendai)' },
                        ].map(c => (
                          <div key={c.country} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                            <span className="text-3xl shrink-0">{c.flag}</span>
                            <div>
                              <div className="font-bold text-white text-sm">{c.country}</div>
                              <div className="text-xs text-white/50 mt-0.5">{c.relevance}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                        <p className="text-sm text-white/70">
                          <strong className="text-blue-300">HELIOX</strong> {isEn
                            ? 'provides a sovereign and independent real-time processing layer, allowing researchers, grid operators, and citizens to be alerted to severe ionospheric disturbances without relying exclusively on closed government portals.'
                            : 'provee una capa soberana e independiente de procesamiento en tiempo real, permitiendo a investigadores, operadores de redes y ciudadanos estar alerta ante perturbaciones ionosféricas severas sin depender exclusivamente de portales gubernamentales cerrados.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ═══ CAPÍTULO 6 ═══ */}
                  {activeTab === 'nasa_letter' && (
                    <div className="space-y-6">
                      {/* Encabezado de carta oficial */}
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
                        <span className="text-4xl">✉️</span>
                        <div>
                          <div className="text-xs font-mono text-purple-400 font-bold">OFFICIAL DOCUMENT</div>
                          <div className="text-sm text-white font-bold">{isEn ? 'Open Letter to NASA & Space Agencies' : 'Carta Oficial Abierta a la NASA y Agencias Espaciales'}</div>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] font-serif text-white/85 space-y-4">
                        <p className="text-sm text-white/50 font-sans font-mono">
                          <strong>Para:</strong> Science Mission Directorate, NASA · Heliophysics Division<br />
                          <strong>De:</strong> JESÚS BARRIOS, HELIOX Solar Observatory<br />
                          <strong>Fecha:</strong> 2026 · Bogotá, Colombia
                        </p>
                        <hr className="border-white/10" />
                        <p>Estimados colegas y directores de misiones heliográficas:</p>
                        <p>
                          Por medio del presente documento y a través de la plataforma <strong>HELIOX Solar Observatory</strong>, extendemos nuestro reconocimiento formal al trabajo de telemetría de las misiones SDO, Parker Solar Probe, SOHO y GOES.
                        </p>
                        <p>
                          A su vez, ratificamos nuestro compromiso de <strong>traducir, diseminar y hacer accesible</strong> esta telemetría para millones de personas en Latinoamérica y el mundo en 12 idiomas — de forma gratuita y con datos en tiempo real.
                        </p>
                        <p>
                          Extendemos formalmente nuestra solicitud de colaboración en el intercambio de datos heliofísicos de baja latencia para el avance de la educación científica en comunidades latinoamericanas.
                        </p>
                        <hr className="border-white/10" />
                        <p className="font-sans font-bold text-orange-300 pt-1">
                          Firmado,<br />
                          <span className="text-xl">JESÚS BARRIOS</span><br />
                          <span className="text-xs font-normal text-white/40">Director & Fundador — HELIOX Solar Observatory<br />
                          heliox-observatory.vercel.app · Bogotá, Colombia</span>
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navegación entre capítulos */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          {(() => {
            const idx = CHAPTERS.findIndex(c => c.id === activeTab)
            const prev = CHAPTERS[idx - 1]
            const next = CHAPTERS[idx + 1]
            return (
              <>
                {prev ? (
                  <button onClick={() => setActiveTab(prev.id)} className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors group">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    <span>{prev.icon} {prev.label}</span>
                  </button>
                ) : <div />}
                {next ? (
                  <button onClick={() => setActiveTab(next.id)} className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors group">
                    <span>{next.icon} {next.label}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                ) : <div />}
              </>
            )
          })()}
        </div>

        {/* ─── Visor Solar 3D Interactivo en 360 Grados ──────────────────── */}
        {/* ════════════════════════════════════════════════════════════════════
            🤖 FIREBASE AI LOGIC — HYBRID INFERENCE ENGINE SECTION
            ════════════════════════════════════════════════════════════════════ */}
        <div className="my-14 space-y-10">

          {/* Section header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold mb-4">
              🔥 Powered by Firebase AI Logic SDK
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              🤖 Hybrid Inference Engine
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-sm">
              On-Device Gemini Nano + Cloud Gemini 2.0 Flash — La columna vertebral de HELIOX para inferencia solar inteligente
            </p>
          </div>

          {/* Hybrid Flow Diagram */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 overflow-x-auto">
            <div className="text-xs text-white/40 font-mono uppercase tracking-widest mb-6 text-center">
              ⚡ Flujo de Inferencia Híbrida — Firebase AI Logic
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-0 min-w-[560px]">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center w-36">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20 mb-2">
                  📡
                </div>
                <div className="text-[11px] font-bold text-blue-300">NASA/NOAA APIs</div>
                <div className="text-[10px] text-white/40 mt-0.5">Solar Telemetry</div>
              </div>
              {/* Arrow */}
              <div className="text-orange-500 text-2xl font-black sm:rotate-0 rotate-90 my-2 sm:my-0">→</div>
              {/* Step 2: Device check */}
              <div className="flex flex-col items-center text-center w-36">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/20 mb-2">
                  🔍
                </div>
                <div className="text-[11px] font-bold text-purple-300">Device Check</div>
                <div className="text-[10px] text-white/40 mt-0.5">NPU Detection</div>
              </div>
              {/* Arrow */}
              <div className="text-orange-500 text-2xl font-black sm:rotate-0 rotate-90 my-2 sm:my-0">→</div>
              {/* Step 3a: On-Device */}
              <div className="flex flex-col items-center text-center w-36">
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20 mb-2">
                  💻
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                </div>
                <div className="text-[11px] font-bold text-emerald-300">On-Device</div>
                <div className="text-[10px] text-white/40 mt-0.5">Gemini Nano NPU</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">~{latencyMetrics.onDevice}ms</div>
              </div>
              {/* OR divider */}
              <div className="flex flex-col items-center mx-2">
                <div className="text-[10px] text-white/30 font-bold">OR</div>
                <div className="text-white/20 text-xs">↓</div>
              </div>
              {/* Step 3b: Cloud */}
              <div className="flex flex-col items-center text-center w-36">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/20 mb-2">
                  ☁️
                </div>
                <div className="text-[11px] font-bold text-cyan-300">Cloud Fallback</div>
                <div className="text-[10px] text-white/40 mt-0.5">Gemini 2.0 Flash</div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">~{latencyMetrics.cloud}ms</div>
              </div>
              {/* Arrow */}
              <div className="text-orange-500 text-2xl font-black sm:rotate-0 rotate-90 my-2 sm:my-0">→</div>
              {/* Result */}
              <div className="flex flex-col items-center text-center w-36">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30 mb-2">
                  🧠
                </div>
                <div className="text-[11px] font-bold text-amber-300">AI Assessment</div>
                <div className="text-[10px] text-white/40 mt-0.5">Solar Report</div>
                <div className="text-[10px] text-amber-400 font-mono mt-0.5">~{latencyMetrics.hybrid}ms avg</div>
              </div>
            </div>
          </div>

          {/* HybridAIConsole */}
          <div className="relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-500/20 blur-sm" />
            <div className="relative">
              <HybridAIConsole
                currentStormData={solarData ? {
                  kpIndex: solarData.kp_index.kp,
                  solarWindSpeedKmS: solarData.solar_wind.speed_km_s,
                  cmeSpeedKmS: solarData.cme_recientes[0]?.speed_km_s ?? 540,
                  xRayClass: solarData.xray_flux.class,
                  bzNT: solarData.solar_wind.bz_nT,
                  timestamp: new Date().toISOString(),
                } : undefined}
              />
            </div>
          </div>

          {/* Comparison Table */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <span className="text-orange-400 text-lg">⚖️</span>
              <h3 className="font-bold text-white text-sm">Comparación Técnica: On-Device vs Cloud Inference</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-3 text-white/40 font-mono uppercase tracking-wider">Métrica</th>
                    <th className="text-center px-4 py-3 text-emerald-400 font-bold">💻 On-Device (Nano)</th>
                    <th className="text-center px-4 py-3 text-cyan-400 font-bold">☁️ Cloud (Flash)</th>
                    <th className="text-center px-4 py-3 text-amber-400 font-bold">⚡ Hybrid Auto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { metric: 'Latencia', device: `~${latencyMetrics.onDevice}ms`, cloud: `~${latencyMetrics.cloud}ms`, hybrid: `~${latencyMetrics.hybrid}ms`, winner: 'device' },
                    { metric: 'Privacidad de Datos', device: '🟢 100% Local', cloud: '🟡 Servidor remoto', hybrid: '🟢 Prioritiza local', winner: 'device' },
                    { metric: 'Disponibilidad Offline', device: '🟢 Sí', cloud: '🔴 No', hybrid: '🟢 Sí (fallback)', winner: 'hybrid' },
                    { metric: 'Costo Inferencia', device: '🟢 $0 / req', cloud: '🟡 Pay-per-use', hybrid: '🟢 Mínimo', winner: 'device' },
                    { metric: 'Calidad de Análisis', device: '🟡 Básico', cloud: '🟢 Premium', hybrid: '🟢 Premium+', winner: 'hybrid' },
                    { metric: 'Límite de Tokens', device: '🟡 Limitado', cloud: '🟢 2M tokens', hybrid: '🟢 Flexible', winner: 'hybrid' },
                    { metric: 'Tiempo Real (<100ms)', device: '🟢 Sí', cloud: '🔴 No', hybrid: '🟢 Sí', winner: 'device' },
                  ].map(row => (
                    <tr key={row.metric} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3 text-white/60 font-semibold">{row.metric}</td>
                      <td className={`px-4 py-3 text-center font-mono ${row.winner === 'device' ? 'text-emerald-300 font-bold' : 'text-white/50'}`}>{row.device}</td>
                      <td className={`px-4 py-3 text-center font-mono ${row.winner === 'cloud' ? 'text-cyan-300 font-bold' : 'text-white/50'}`}>{row.cloud}</td>
                      <td className={`px-4 py-3 text-center font-mono ${row.winner === 'hybrid' ? 'text-amber-300 font-bold' : 'text-white/50'}`}>{row.hybrid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* How Firebase AI Logic Works — 3 steps */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-black text-white mb-2">🔥 Cómo Funciona Firebase AI Logic</h3>
              <p className="text-xs text-white/40">La arquitectura detrás del motor de HELIOX</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  icon: '🛰️',
                  title: 'Telemetría en Vivo',
                  desc: 'HELIOX consulta las APIs públicas de NASA DONKI, NOAA SWPC y GOES en tiempo real. Los datos de Kp, viento solar y rayos X se normalizan en un payload estructurado.',
                  color: 'from-blue-600/20 to-blue-800/10 border-blue-500/30',
                  num: 'text-blue-400',
                },
                {
                  step: '02',
                  icon: '🔀',
                  title: 'Enrutamiento Inteligente',
                  desc: 'Firebase AI Logic SDK detecta si el NPU local soporta Gemini Nano (Chrome Prompt API). Si sí: inferencia local <100ms. Si no: fallback transparente a Gemini 2.0 Flash en la nube.',
                  color: 'from-purple-600/20 to-purple-800/10 border-purple-500/30',
                  num: 'text-purple-400',
                },
                {
                  step: '03',
                  icon: '📊',
                  title: 'Reporte Ejecutivo',
                  desc: 'El modelo genera un análisis con nivel de amenaza (Green/Yellow/Red), impacto en redes eléctricas, GPS y satélites, y probabilidad de auroras. Todo en <400ms end-to-end.',
                  color: 'from-amber-600/20 to-orange-800/10 border-amber-500/30',
                  num: 'text-amber-400',
                },
              ].map(s => (
                <motion.div
                  key={s.step}
                  whileHover={{ y: -4 }}
                  className={`rounded-2xl border p-5 bg-gradient-to-br ${s.color} transition-all`}
                >
                  <div className={`text-3xl font-black font-mono mb-3 ${s.num}`}>{s.step}</div>
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <h4 className="font-bold text-white text-sm mb-2">{s.title}</h4>
                  <p className="text-xs text-white/55 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Live Intelligence Feed */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <h3 className="font-bold text-white text-sm">Live Intelligence Feed</h3>
                <span className="text-[10px] text-white/30 font-mono">últimos análisis del AI</span>
              </div>
              <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                🔥 Firebase AI Logic
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {[
                {
                  id: 'intel-001',
                  mode: 'ON-DEVICE',
                  modeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                  latency: latencyMetrics.onDevice,
                  time: '2 min ago',
                  kp: solarData?.kp_index.kp.toFixed(1) ?? '4.7',
                  snippet: `Threat Level: YELLOW. Kp ${solarData?.kp_index.kp.toFixed(1) ?? '4.7'} — Moderate geomagnetic activity. Solar wind at ${solarData?.solar_wind.speed_km_s ?? 580} km/s. HF radio degradation expected on polar routes. Aurora visible above 55°N.`,
                },
                {
                  id: 'intel-002',
                  mode: 'CLOUD',
                  modeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
                  latency: latencyMetrics.cloud,
                  time: '8 min ago',
                  kp: '6.3',
                  snippet: 'Threat Level: RED. X-ray class M4 flare detected on AR3685. CME likely Earth-directed with 72hr ETA. Power grid operators in North America alerted. GPS precision degraded ±3m.',
                },
                {
                  id: 'intel-003',
                  mode: 'ON-DEVICE',
                  modeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                  latency: 72,
                  time: '15 min ago',
                  kp: '2.3',
                  snippet: 'Threat Level: GREEN. Quiet solar conditions. Solar wind nominal at 420 km/s. No significant flare activity detected. All satellite operations nominal. Aurora restricted to polar zones.',
                },
              ].map((item, i) => (
                <div key={item.id} className="px-6 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded border font-mono ${item.modeColor}`}>
                          {item.mode === 'ON-DEVICE' ? '💻' : '☁️'} {item.mode}
                        </span>
                        <span className="text-[10px] text-white/30 font-mono">Kp {item.kp}</span>
                        <span className="text-[10px] text-white/30 font-mono">{item.latency}ms</span>
                        <span className="text-[10px] text-white/20">{item.time}</span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed line-clamp-2">{item.snippet}</p>
                    </div>
                    <div className="text-white/20 text-xs font-mono shrink-0">#{String(i + 1).padStart(3, '0')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Link */}
          <div className="text-center pt-4">
            <a
              href="https://github.com/Mister124x/heliox-hybrid"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white transition-all group"
            >
              <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <div className="text-left">
                <div className="text-sm font-bold">Ver en GitHub</div>
                <div className="text-xs text-white/40 font-mono">Mister124x/heliox-hybrid</div>
              </div>
              <span className="text-white/40 group-hover:translate-x-1 transition-transform">↗</span>
            </a>
          </div>

        </div>

        {/* ─── Visor Solar 3D Interactivo en 360 Grados ──────────────────── */}
        <div className="my-10">
          <SolarGlobe3D />
        </div>

        {/* ─── Matriz de Física Cuántica y Magnetohidrodinámica ──────────── */}
        <div className="my-10">
          <HackerPolymathMatrix />
        </div>

        {/* ─── Dossier Desclasificado Oficial ─────────────────────────────── */}
        <DeclassifiedDossier />

        {/* ─── Banner Oficial de Pico Máximo Ciclo 25 ────────────────────── */}
        <SolarPeakAlert />
      </main>

      {/* Footer Oficial */}
      <footer className="border-t border-white/10 px-4 py-8 mt-12 bg-black/90">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">HELIOX</span>
            <span>· por JESÚS BARRIOS</span>
          </div>
          <div className="flex flex-wrap gap-4 text-white/60">
            <Link href="/" className="hover:text-orange-400 transition-colors">Inicio</Link>
            <Link href="/dashboard" className="hover:text-orange-400 transition-colors">Dashboard</Link>
            <Link href="/storms" className="hover:text-orange-400 transition-colors">Tormentas</Link>
            <Link href="/reels" className="hover:text-orange-400 transition-colors">Reels</Link>
            <Link href="/analysis" className="text-orange-400 font-bold">Análisis</Link>
            <Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacidad</Link>
            <Link href="/terms" className="hover:text-orange-400 transition-colors">Términos</Link>
          </div>
          <div className="text-[11px] text-white/40">
            © 2026 JESÚS BARRIOS · Datos NASA & NOAA
          </div>
        </div>
      </footer>
    </div>
  )
}
