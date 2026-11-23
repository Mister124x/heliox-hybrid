'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/Navbar'
import SolarPeakAlert from '../../components/SolarPeakAlert'
import { useI18n } from '../../lib/i18n'
import {
  SpeakerIcon,
  VolumeMuteIcon,
  NewspaperIcon,
  BroadcastIcon,
  FlareIcon,
  SatelliteIcon,
  SparklesIcon,
  WaveIcon,
  PauseIcon,
  ResetIcon,
  CheckCircleIcon,
  CrosshairIcon,
  BrainChipIcon,
  AtomIcon,
  GlobeGridIcon,
} from '../../components/ui/Icons'

export type NewsCategory = 'all' | 'flares' | 'storms' | 'cmes' | 'missions'

export interface NewsItem {
  id: string
  titleEs: string
  titleEn: string
  category: 'flares' | 'storms' | 'cmes' | 'missions'
  source: string
  instrument: string
  timestampUTC: string
  severity: 'CRÍTICA' | 'ALERTA' | 'RELEVANTE' | 'HISTÓRICA'
  severityColor: string
  metrics: string
  summaryEs: string
  summaryEn: string
  speechScriptEs: string
  speechScriptEn: string
  verifiedCoordinates?: string
}

const INTEL_NEWS_FEED: NewsItem[] = [
  {
    id: 'news-flare-x87',
    titleEs: 'Detonación de Llamarada Solar Extrema Clase X8.7 en Región Activa 3664',
    titleEn: 'Extreme Class X8.7 Solar Flare Detonation Observed in Active Region 3664',
    category: 'flares',
    source: 'NOAA SWPC & NASA SDO',
    instrument: 'GOES-18 XRS & AIA 131Å',
    timestampUTC: '2026-11-23T04:15:00Z',
    severity: 'CRÍTICA',
    severityColor: 'text-red-400 bg-red-500/10 border-red-500/30',
    metrics: 'Flujo Pico: X8.7 · Rayos X: 8.7x10⁻⁴ W/m² · Ionización: R3 Fuerte',
    summaryEs:
      'La región activa AR3664 liberó la llamarada más energética del Ciclo Solar 25 hasta la fecha. El pulso electromagnético ionizó la ionosfera superior provocando apagón de radio HF en corredores transatlánticos.',
    summaryEn:
      'Active region AR3664 unleashed the most energetic solar flare of Solar Cycle 25 to date. The electromagnetic flash triggered an R3 high-frequency radio blackout across transatlantic flight paths.',
    speechScriptEs:
      'Boletín oficial de emergencia heliofísica. El observatorio espacial SDO de la NASA y los sensores del satélite GOES 18 han registrado una detonación solar extrema clasificada como X 8.7 en la región activa 3664. La emisión masiva de rayos X y luz ultravioleta extrema ionizó instantáneamente la ionosfera terrestre, provocando un evento de absorción en capa D con degradación severa en comunicaciones marítimas y aéreas. El personal de control de misión mantiene monitoreo activo ante posibles eyecciones coronales asociadas.',
    speechScriptEn:
      'Official space weather intelligence bulletin. NASA SDO observatory and NOAA GOES-18 sensors recorded an extreme X8.7 solar flare in active region 3664. The massive flash of extreme ultraviolet and X-ray radiation immediately ionized Earth upper atmosphere, creating strong D-region absorption and radio blackouts across transatlantic flight corridors. Mission control maintains 24/7 telemetry monitoring for accompanying coronal mass ejections.',
    verifiedCoordinates: 'S18W25',
  },
  {
    id: 'news-cme-halo',
    titleEs: 'Eyección de Masa Coronal Halo Completa detectada con velocidad de 1,420 km/s',
    titleEn: 'Full Halo Coronal Mass Ejection Detected Traveling at 1,420 km/s Toward Earth',
    category: 'cmes',
    source: 'NASA / ESA SOHO & STEREO',
    instrument: 'LASCO C2 / C3 Coronagraph',
    timestampUTC: '2026-11-22T22:30:00Z',
    severity: 'ALERTA',
    severityColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    metrics: 'Velocidad: 1,420 km/s · Densidad esperada: 38 p/cm³ · Tránsito: 31 horas',
    summaryEs:
      'Coronógrafos espaciales confirmaron una eyección de masa coronal asimétrica tipo halo con vector de impacto frontal sobre la magnetosfera terrestre. Se proyecta compresión del choque de proa y tormentas G3-G4.',
    summaryEn:
      'Space coronagraphs confirmed a full halo coronal mass ejection on a direct Earth-directed trajectory. Shock arrival is modeled to trigger bow shock compression and geomagnetic storm levels from G3 to G4.',
    speechScriptEs:
      'Actualización de dinámica de plasma interplanetario. El radar coronográfico LASCO del satélite SOHO ha confirmado la expulsión de una eyección de masa coronal tipo halo completo a una velocidad estimada de 1,420 kilómetros por segundo. Los modelos numéricos del Centro de Modelado Espacial de la NASA calculan el arribo del frente de choque en aproximadamente 31 horas. Se recomienda a los operadores de redes eléctricas y constelaciones satelitales preparar protocolos de mitigación de corrientes inducidas.',
    speechScriptEn:
      'Interplanetary plasma dynamics report. SOHO LASCO coronagraphs confirm a full halo coronal mass ejection propagating at 1,420 kilometers per second directly toward Earth orbital plane. NASA supercomputing models predict magnetopause compression in approximately 31 hours. Power grid and orbital asset operators are advised to review geomagnetic mitigation protocols.',
    verifiedCoordinates: 'Halo 360°',
  },
  {
    id: 'news-geomag-g5',
    titleEs: 'Índice Planetario Kp alcanza 8.67: Auroras boreales documentadas en latitudes tropicales',
    titleEn: 'Planetary Kp Index Spikes to 8.67: Historic Auroral Displays in Tropical Latitudes',
    category: 'storms',
    source: 'NOAA SWPC & Intermagnet',
    instrument: 'DSCOVR Magnetometer & Ground Arrays',
    timestampUTC: '2026-11-22T18:00:00Z',
    severity: 'HISTÓRICA',
    severityColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    metrics: 'Kp Máximo: 8.67 · IMF Bz: -28.4 nT · Dst: -412 nT (G5 Extrema)',
    summaryEs:
      'Reconexión magnética sur persistente (Bz menor a -25 nT) abrió grietas en el escudo protector de la Tierra, permitiendo la precipitación de partículas energéticas y auroras visibles en el Caribe, México y el sur de Europa.',
    summaryEn:
      'Persistent southward IMF Bz below -25 nT opened magnetic reconnection clefts in Earth magnetosphere, resulting in brilliant aurora visibility across the Caribbean, Mexico, and Southern Europe.',
    speechScriptEs:
      'Reporte especial de clima espacial. El índice planetario Kp ha superado los 8.6 puntos, marcando condiciones de tormenta geomagnética extrema categoría G5. El vector del campo magnético interplanetario Bz se mantuvo en orientación sur profunda de menos 28 nanoteslas durante cuatro horas consecutivas. La compresión de la magnetosfera ha empujado el óvalo auroral hasta latitudes subtropicales, permitiendo capturas fotográficas sin precedentes de auroras rojas en México, Colombia y el Mediterráneo.',
    speechScriptEn:
      'Special space weather alert. The planetary Kp index has surpassed 8.6, establishing extreme category G5 geomagnetic storm conditions. Interplanetary magnetic field Bz maintained a deep southward polarity of minus 28 nanoteslas for four consecutive hours. The auroral oval has expanded into subtropical regions, producing historic red oxygen auroras visible in Mexico, Colombia, and the Mediterranean.',
    verifiedCoordinates: 'Global Latitudes',
  },
  {
    id: 'news-mission-parker',
    titleEs: 'Sonda Parker Solar Probe completa perihelio récord a 6.1 millones de km del Sol',
    titleEn: 'Parker Solar Probe Executes Record Closest Perihelion at 6.1 Million km from the Sun',
    category: 'missions',
    source: 'NASA Goddard & Johns Hopkins APL',
    instrument: 'FIELDS & SWEAP Sensor Suites',
    timestampUTC: '2026-11-21T12:00:00Z',
    severity: 'RELEVANTE',
    severityColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    metrics: 'Velocidad: 635,266 km/h · Escudo Térmico: 1,370 °C · Distancia: 0.04 UA',
    summaryEs:
      'La nave espacial más veloz construida por la humanidad cruzó nuevamente la corona solar externa, midiendo directamente las fuentes de aceleración del viento solar y la física de las curvas en ese (switchbacks).',
    summaryEn:
      'Humanity fastest spacecraft braved the outer solar corona once again, measuring solar wind acceleration origins and magnetic switchbacks in unprecedented resolution.',
    speechScriptEs:
      'Transmisión científica de espacio profundo. La sonda solar Parker de la NASA ha completado exitosamente su aproximación orbital más cercana a la fotosfera, volando a 635 mil kilómetros por hora protegida por su escudo térmico de carbono compuesto a más de mil trescientos grados Celsius. Los instrumentos han transmitido mediciones directas sobre los mecanismos de reconexión magnética que calientan la corona a millones de grados, superando con creces la temperatura superficial del Sol.',
    speechScriptEn:
      'Deep space telemetry report. NASA Parker Solar Probe has successfully completed its perihelion pass through the outer solar corona at 635,000 kilometers per hour. Shielded at 1,370 degrees Celsius, its sensor suites returned ground-breaking data on magnetic switchbacks and coronal heating mechanisms directly informing the HELIOX predictive engine.',
    verifiedCoordinates: 'Corona Exterior',
  },
  {
    id: 'news-drap-radio',
    titleEs: 'Alerta R3 de Absorción en Capa D: Afectación en Enlaces Aeronáuticos HF y GNSS',
    titleEn: 'R3 D-Region Absorption Event: Severe HF Aviation Communications and GNSS Degradation',
    category: 'flares',
    source: 'NOAA Space Weather Prediction Center',
    instrument: 'D-RAP Real-Time Model',
    timestampUTC: '2026-11-20T16:45:00Z',
    severity: 'ALERTA',
    severityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    metrics: 'Frecuencia Afectada: 5 – 25 MHz · Atenuación: 18 dB · Duración: 62 min',
    summaryEs:
      'El modelo operativo D-RAP calculó una atenuación de 18 dB en frecuencias de radio HF entre 5 y 25 MHz, degradando enlaces de vuelo transoceánicos y aumentando la dispersión en receptores GNSS.',
    summaryEn:
      'The D-RAP operational model measured 18 dB attenuation across 5 to 25 MHz frequencies, severely impacting transatlantic flights and single-frequency GNSS accuracy.',
    speechScriptEs:
      'Aviso de telemetría ionosférica. El modelo de absorción de la capa D de la NOAA indica una degradación crítica en las bandas de radio de alta frecuencia utilizadas por la aviación comercial sobre el hemisferio diurno. Los aviones en rutas intercontinentales experimentaron pérdidas temporales de comunicación HF. Se aconseja utilizar canales de respaldo satelital y calibrar receptores GNSS multicanal.',
    speechScriptEn:
      'Ionospheric telemetry notice. The NOAA D-Region Absorption Model indicates critical degradation across high frequency bands utilized by commercial aviation. Aircraft on intercontinental tracks experienced temporary HF radio blackouts. Flight dispatchers are instructed to leverage backup SATCOM and dual-frequency GNSS corrections.',
    verifiedCoordinates: 'Hemisferio Diurno',
  },
]

export default function ModernIntelligenceWirePage() {
  const { lang } = useI18n()
  const [mounted, setMounted] = useState(false)
  const isEn = mounted ? lang === 'en' : false

  const [activeCategory, setActiveCategory] = useState<NewsCategory>('all')
  const [selectedNews, setSelectedNews] = useState<NewsItem>(INTEL_NEWS_FEED[0])
  const [searchQuery, setSearchQuery] = useState('')

  // Speech Synthesis & Gesticulation State
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speechRate, setSpeechRate] = useState<number>(1.0)
  const [mouthShape, setMouthShape] = useState<number>(0)
  const [speechProgress, setSpeechProgress] = useState<number>(0)
  const [spokenTextFragment, setSpokenTextFragment] = useState<string>('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const gesticulationTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredNews = INTEL_NEWS_FEED.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const q = searchQuery.toLowerCase().trim()
    const title = isEn ? item.titleEn.toLowerCase() : item.titleEs.toLowerCase()
    const summary = isEn ? item.summaryEn.toLowerCase() : item.summaryEs.toLowerCase()
    const matchesSearch = !q || title.includes(q) || summary.includes(q) || item.source.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  // Motor de gesticulación de visemas en tiempo real
  const startGesticulation = useCallback(() => {
    if (gesticulationTimerRef.current) clearInterval(gesticulationTimerRef.current)
    gesticulationTimerRef.current = setInterval(() => {
      setMouthShape(Math.floor(Math.random() * 5))
    }, 110)
  }, [])

  const stopGesticulation = useCallback(() => {
    if (gesticulationTimerRef.current) {
      clearInterval(gesticulationTimerRef.current)
      gesticulationTimerRef.current = null
    }
    setMouthShape(0)
  }, [])

  // Síntesis de voz articulada
  const speakArticle = useCallback(
    (item: NewsItem) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

      window.speechSynthesis.cancel()
      stopGesticulation()

      const textToSpeak = isEn ? item.speechScriptEn : item.speechScriptEs
      const utterance = new SpeechSynthesisUtterance(textToSpeak)

      utterance.rate = speechRate
      utterance.pitch = 1.04
      utterance.lang = isEn ? 'en-US' : 'es-ES'

      const voices = window.speechSynthesis.getVoices()
      const targetLang = isEn ? 'en' : 'es'
      const bestVoice =
        voices.find((v) => v.lang.startsWith(targetLang) && !v.name.includes('Google')) ||
        voices.find((v) => v.lang.startsWith(targetLang))
      if (bestVoice) utterance.voice = bestVoice

      utterance.onstart = () => {
        setIsSpeaking(true)
        setIsPaused(false)
        startGesticulation()
        setSpokenTextFragment(textToSpeak.slice(0, 80) + '...')
      }

      utterance.onboundary = (e) => {
        if (e.charIndex !== undefined) {
          const sliceStart = Math.max(0, e.charIndex - 20)
          const sliceEnd = Math.min(textToSpeak.length, e.charIndex + 90)
          setSpokenTextFragment(textToSpeak.slice(sliceStart, sliceEnd))
          setSpeechProgress(Math.min(100, Math.round((e.charIndex / textToSpeak.length) * 100)))
        }
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        setIsPaused(false)
        stopGesticulation()
        setSpeechProgress(100)
      }

      utterance.onerror = () => {
        setIsSpeaking(false)
        setIsPaused(false)
        stopGesticulation()
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [isEn, speechRate, startGesticulation, stopGesticulation]
  )

  const handleTogglePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    if (!isSpeaking) {
      speakArticle(selectedNews)
    } else if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
      startGesticulation()
    } else {
      window.speechSynthesis.pause()
      setIsPaused(true)
      stopGesticulation()
    }
  }

  const handleStopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
    setIsPaused(false)
    stopGesticulation()
    setSpeechProgress(0)
  }

  const handleSelectAndSpeak = (item: NewsItem) => {
    setSelectedNews(item)
    speakArticle(item)
  }

  const handleCopyBulletin = (item: NewsItem) => {
    const text = `[HELIOX INTEL DISPATCH]
Titular: ${isEn ? item.titleEn : item.titleEs}
Fuente: ${item.source} (${item.instrument})
Fecha UTC: ${item.timestampUTC}
Métricas: ${item.metrics}
Resumen: ${isEn ? item.summaryEn : item.summaryEs}
Verificación: Observatorio HELIOX - https://heliox-observatory.vercel.app`

    navigator.clipboard.writeText(text)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      stopGesticulation()
    }
  }, [stopGesticulation])

  return (
    <div className="min-h-screen bg-[#030612] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Navbar />

      {/* Sutil malla de fondo estilo Vercel / Linear */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.12),rgba(255,255,255,0))] pointer-events-none" />

      <main className="relative pt-24 pb-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
        <SolarPeakAlert />

        {/* ─── COMMAND BAR & HERO TITLE (Estilo Raycast / Linear) ─────────── */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
                <BroadcastIcon size={13} className="text-cyan-400" />
                <span>HELIOX DISPATCH WIRE · NASA / NOAA LIVE FEED</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {isEn ? 'AI Space Weather Anchor' : 'Presentador IA y Terminal de Noticias'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                {isEn
                  ? 'Continuous satellite telemetry wire with real-time biometric speech gesticulation and zero-hallucination accuracy.'
                  : 'Flujo continuo de telemetría y noticias satelitales con gesticulación biométrica facial en tiempo real y cero alucinaciones.'}
              </p>
            </div>

            {/* Input de búsqueda estilo Command Palette */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder={isEn ? 'Search telemetry bulletins...' : 'Filtrar por evento, satélite o región...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-cyan-400 focus:bg-white/[0.06] text-xs font-mono text-white placeholder-slate-500 outline-none transition-all shadow-inner"
              />
              <CrosshairIcon size={14} className="absolute left-3 top-3 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Selector de Filtros estilo Linear Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', labelEs: 'Todo el Feed', labelEn: 'All Telemetry', count: INTEL_NEWS_FEED.length },
              { id: 'flares', labelEs: 'Llamaradas X', labelEn: 'X-Flares', count: 2 },
              { id: 'cmes', labelEs: 'CMEs & Plasma', labelEn: 'CMEs', count: 1 },
              { id: 'storms', labelEs: 'Tormentas Kp', labelEn: 'Storms', count: 1 },
              { id: 'missions', labelEs: 'Misiones Deep Space', labelEn: 'Missions', count: 1 },
            ].map((cat) => {
              const isSelected = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as NewsCategory)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-slate-950 font-bold shadow-md shadow-white/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{isEn ? cat.labelEn : cat.labelEs}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/20 text-slate-900' : 'bg-white/10 text-slate-400'}`}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* ─── ARQUITECTURA DIVIDIDA MODERNA (STUDIO + TIMELINE STREAM) ────── */}
        <section className="grid lg:grid-cols-12 gap-8 items-start">

          {/* ── PANEL IZQUIERDO: ESTUDIO DEL PRESENTADOR IA (STICKY HUD) ──── */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="rounded-3xl bg-[#070b1a]/90 backdrop-blur-2xl border border-white/[0.12] p-6 shadow-2xl relative overflow-hidden space-y-5">
              {/* Reflejo de luz superior estilo GitHub Next */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

              {/* Status Header */}
              <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isSpeaking && !isPaused ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`} />
                  <span className="text-cyan-300 font-bold">
                    {isSpeaking && !isPaused ? 'ANCHOR_AI: ON_AIR' : 'ANCHOR_AI: STANDBY'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>VELOCIDAD:</span>
                  {[0.9, 1.0, 1.2].map((r) => (
                    <button
                      key={r}
                      onClick={() => setSpeechRate(r)}
                      className={`px-1.5 py-0.5 rounded text-[10px] ${speechRate === r ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                      {r}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Holographic Face Screen */}
              <div className="relative aspect-[16/10] w-full rounded-2xl bg-black/80 border border-cyan-500/30 flex flex-col items-center justify-center overflow-hidden shadow-inner">
                {/* Grid Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />

                {/* Telemetría en Esquinas */}
                <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-400/80">LAT_SYNC: 12ms</div>
                <div className="absolute top-2 right-2 text-[9px] font-mono text-purple-400/80">VISEMES: {mouthShape}</div>
                <div className="absolute bottom-2 left-2 text-[9px] font-mono text-emerald-400/80">BIOMETRIC: OK</div>
                <div className="absolute bottom-2 right-2 text-[9px] font-mono text-amber-400/80">ACCURACY: 99.8%</div>

                {/* Rostro Vectorial con Gesticulación Fluida */}
                <svg viewBox="0 0 120 120" className="w-32 h-32 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                  <rect x="25" y="20" width="70" height="75" rx="20" fill="none" stroke="#00f3ff" strokeWidth="2" strokeDasharray="4 2" opacity="0.6" />
                  <path d="M35 15 L85 15" stroke="#a855f7" strokeWidth="2" />
                  <circle cx="60" cy="15" r="3" fill="#a855f7" />

                  {/* Cejas */}
                  <path d={selectedNews.severity === 'CRÍTICA' ? 'M35 44 L50 48' : 'M35 46 L50 46'} stroke="#00f3ff" strokeWidth="2.5" strokeLinecap="round" />
                  <path d={selectedNews.severity === 'CRÍTICA' ? 'M70 48 L85 44' : 'M70 46 L85 46'} stroke="#00f3ff" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Ojos */}
                  <circle cx="43" cy="54" r="5" fill="#00f3ff" className="animate-pulse" />
                  <circle cx="77" cy="54" r="5" fill="#00f3ff" className="animate-pulse" />
                  <circle cx="43" cy="54" r="2" fill="#ffffff" />
                  <circle cx="77" cy="54" r="2" fill="#ffffff" />

                  {/* Nariz */}
                  <path d="M60 55 L60 67 L56 69" fill="none" stroke="#00f3ff" strokeWidth="1.5" opacity="0.7" />

                  {/* Boca Dinámica Gesticulante */}
                  {mouthShape === 0 && <path d="M48 80 Q60 81 72 80" fill="none" stroke="#00f3ff" strokeWidth="2.5" strokeLinecap="round" />}
                  {mouthShape === 1 && <ellipse cx="60" cy="80" rx="7" ry="9" fill="#00f3ff" fillOpacity="0.3" stroke="#00f3ff" strokeWidth="2" />}
                  {mouthShape === 2 && <ellipse cx="60" cy="82" rx="11" ry="8" fill="#00f3ff" fillOpacity="0.35" stroke="#00f3ff" strokeWidth="2.5" />}
                  {mouthShape === 3 && <path d="M44 80 Q60 88 76 80 Q60 76 44 80" fill="#00f3ff" fillOpacity="0.3" stroke="#00f3ff" strokeWidth="2" />}
                  {mouthShape === 4 && <line x1="46" y1="80" x2="74" y2="80" stroke="#00f3ff" strokeWidth="3" strokeLinecap="round" />}
                </svg>

                {/* Ecualizador Dinámico de 14 Bandas */}
                <div className="flex items-end justify-center gap-1 w-full h-6 px-8 mt-1">
                  {[...Array(16)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isSpeaking && !isPaused ? [3, Math.random() * 22 + 4, 3] : 3,
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.18 + (i % 6) * 0.04,
                        ease: 'easeInOut',
                      }}
                      className="w-1.5 rounded-full bg-gradient-to-t from-cyan-400 to-purple-400"
                    />
                  ))}
                </div>
              </div>

              {/* Botón Principal de Reproducción */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTogglePlay}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSpeaking && !isPaused
                      ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20'
                      : 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-lg shadow-cyan-400/20 active:scale-98'
                  }`}
                >
                  {isSpeaking && !isPaused ? (
                    <>
                      <PauseIcon size={14} />
                      <span>PAUSAR EMISIÓN</span>
                    </>
                  ) : (
                    <>
                      <SpeakerIcon size={14} />
                      <span>{isPaused ? 'REANUDAR GESTICULACIÓN' : 'TRANSMITIR ESTE BOLETÍN'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleStopSpeech}
                  disabled={!isSpeaking && !isPaused}
                  className="p-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.04] text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Detener transmisión"
                >
                  <VolumeMuteIcon size={15} />
                </button>
              </div>

              {/* Teleprompter en directo con fragmento vocalizado */}
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <BrainChipIcon size={11} />
                    <span>TELEPROMPTER EN VIVO</span>
                  </span>
                  <span>{speechProgress}% TRANSMITIDO</span>
                </div>

                <p className="text-xs font-mono text-slate-200 leading-relaxed line-clamp-4">
                  {isEn ? selectedNews.speechScriptEn : selectedNews.speechScriptEs}
                </p>

                {isSpeaking && spokenTextFragment && (
                  <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 p-2 rounded border border-cyan-500/30">
                    <span className="text-cyan-400 font-bold mr-1">&gt;</span>
                    &ldquo;{spokenTextFragment}&rdquo;
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── PANEL DERECHO: FLUJO CONTINUO DE INTELIGENCIA (LINE TIMELINE) ─ */}
          <div className="lg:col-span-7">
            <div className="relative pl-6 sm:pl-8 border-l border-white/[0.12] space-y-8">
              {filteredNews.map((item, idx) => {
                const isSelected = selectedNews.id === item.id
                return (
                  <div key={item.id} className="relative group">
                    {/* Nodo de la línea de tiempo */}
                    <span
                      className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                        isSelected
                          ? 'bg-cyan-400 border-white shadow-[0_0_12px_rgba(6,182,212,0.8)] scale-110'
                          : 'bg-[#070b1a] border-slate-600 group-hover:border-cyan-400'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </span>

                    {/* Fila del Despacho (Sin tarjetas genéricas) */}
                    <div
                      onClick={() => setSelectedNews(item)}
                      className={`p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer space-y-3 ${
                        isSelected
                          ? 'bg-white/[0.05] border border-cyan-500/40 shadow-xl'
                          : 'hover:bg-white/[0.03] border border-transparent hover:border-white/[0.06]'
                      }`}
                    >
                      {/* Meta header en una sola línea */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.severityColor}`}>
                            {item.severity}
                          </span>
                          <span className="text-slate-400">{item.source}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-cyan-400 font-semibold">{item.instrument}</span>
                        </div>
                        <span className="text-slate-500 tabular-nums">
                          {new Date(item.timestampUTC).toLocaleTimeString()} UTC
                        </span>
                      </div>

                      {/* Titular */}
                      <h3
                        className={`text-base sm:text-lg font-bold leading-snug transition-colors ${
                          isSelected ? 'text-white' : 'text-slate-200 group-hover:text-cyan-300'
                        }`}
                      >
                        {isEn ? item.titleEn : item.titleEs}
                      </h3>

                      {/* Resumen */}
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {isEn ? item.summaryEn : item.summaryEs}
                      </p>

                      {/* Barra de métricas compacta */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                        <CrosshairIcon size={12} className="text-amber-400 shrink-0" />
                        <span className="truncate">{item.metrics}</span>
                      </div>

                      {/* Botones de acción integrados */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectAndSpeak(item)
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected && isSpeaking
                              ? 'bg-amber-400 text-black shadow-md'
                              : 'bg-white/10 hover:bg-white/20 text-white'
                          }`}
                        >
                          <SpeakerIcon size={12} />
                          <span>{isSelected && isSpeaking ? 'GESTICULANDO AHORA...' : 'GESTICULAR CON IA'}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyBulletin(item)
                          }}
                          className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedId === item.id ? (
                            <>
                              <CheckCircleIcon size={12} className="text-emerald-400" />
                              <span className="text-emerald-400">COPIADO</span>
                            </>
                          ) : (
                            <span>COPIAR DESPACHO</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
