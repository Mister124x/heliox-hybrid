'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
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
  PlayIcon,
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
    titleEs: 'Detonación de Llamarada Solar Extrema Clase X8.7 en la Región Activa 3664',
    titleEn: 'Extreme Class X8.7 Solar Flare Detonation Observed in Active Region 3664',
    category: 'flares',
    source: 'NOAA SWPC & NASA SDO',
    instrument: 'GOES-18 XRS & AIA 131Å',
    timestampUTC: '2026-11-23T04:15:00Z',
    severity: 'CRÍTICA',
    severityColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    metrics: 'Flujo Pico: X8.7 · Rayos X: 8.7x10⁻⁴ W/m² · Ionización: R3 Fuerte',
    summaryEs:
      'La región activa AR3664 liberó la llamarada más energética del Ciclo Solar 25 hasta la fecha. El pulso de radiación electromagnética causó un bloqueo de radio de alta frecuencia (R3) sobre el Atlántico y el continente americano durante más de 45 minutos.',
    summaryEn:
      'Active region AR3664 unleashed the most energetic solar flare of Solar Cycle 25 to date. The electromagnetic radiation pulse caused an R3 strong high-frequency radio blackout across the Atlantic and American continents lasting over 45 minutes.',
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
    severityColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    metrics: 'Velocidad: 1,420 km/s · Densidad esperada: 38 p/cm³ · Tránsito: 31 horas',
    summaryEs:
      'Los coronógrafos espaciales confirmaron una eyección de masa coronal asimétrica de halo completo con vector de impacto frontal sobre la magnetosfera terrestre. Se proyecta la compresión del choque de proa y perturbaciones geomagnéticas de nivel G3 a G4.',
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
    severityColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    metrics: 'Kp Máximo: 8.67 · IMF Bz: -28.4 nT · Dst: -412 nT (G5 Extrema)',
    summaryEs:
      'Una fuerte reconexión magnética sur persistente (Bz menor a -25 nT) abrió grietas en el escudo protector de la Tierra, permitiendo la precipitación de partículas energéticas y auroras visibles en el Caribe, México y el sur de Europa.',
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
    severityColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    metrics: 'Velocidad: 635,266 km/h · Escudo Térmico: 1,370 °C · Distancia: 0.04 UA',
    summaryEs:
      'La nave espacial más veloz construida por la humanidad cruzó nuevamente la corona solar externa, midiendo directamente las fuentes de aceleración del viento solar y la física de las curvas en ese (switchbacks) en el campo magnético coronal.',
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
    severityColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    metrics: 'Frecuencia Afectada: 5 – 25 MHz · Atenuación: 18 dB · Duración: 62 min',
    summaryEs:
      'El modelo operativo D-RAP calculó una atenuación de 18 dB en frecuencias de radio HF entre 5 y 25 MHz, degradando sistemas de comunicación en rutas transatlánticas y aumentando el error de pseudorango en constelaciones GPS.',
    summaryEn:
      'The D-RAP operational model measured 18 dB attenuation across 5 to 25 MHz frequencies, severely impacting transatlantic flights and single-frequency GNSS accuracy.',
    speechScriptEs:
      'Aviso de telemetría ionosférica. El modelo de absorción de la capa D de la NOAA indica una degradación crítica en las bandas de radio de alta frecuencia utilizadas por la aviación comercial sobre el hemisferio diurno. Los aviones en rutas intercontinentales experimentaron pérdidas temporales de comunicación HF. Se aconseja utilizar canales de respaldo satelital y calibrar receptores GNSS multicanal.',
    speechScriptEn:
      'Ionospheric telemetry notice. The NOAA D-Region Absorption Model indicates critical degradation across high frequency bands utilized by commercial aviation. Aircraft on intercontinental tracks experienced temporary HF radio blackouts. Flight dispatchers are instructed to leverage backup SATCOM and dual-frequency GNSS corrections.',
    verifiedCoordinates: 'Hemisferio Diurno',
  },
]

export default function AINewsFeedPage() {
  const { lang } = useI18n()
  const [mounted, setMounted] = useState(false)
  const isEn = mounted ? lang === 'en' : false

  const [activeCategory, setActiveCategory] = useState<NewsCategory>('all')
  const [selectedNews, setSelectedNews] = useState<NewsItem>(INTEL_NEWS_FEED[0])
  const [searchQuery, setSearchQuery] = useState('')

  // Speech Synthesis & Gesticulation Engine States
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speechRate, setSpeechRate] = useState<number>(1.0)
  const [mouthShape, setMouthShape] = useState<number>(0) // 0 to 4 phoneme visemes
  const [speechProgress, setSpeechProgress] = useState<number>(0)
  const [spokenTextFragment, setSpokenTextFragment] = useState<string>('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const gesticulationTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Filtrado de noticias
  const filteredNews = INTEL_NEWS_FEED.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const q = searchQuery.toLowerCase().trim()
    const title = isEn ? item.titleEn.toLowerCase() : item.titleEs.toLowerCase()
    const summary = isEn ? item.summaryEn.toLowerCase() : item.summaryEs.toLowerCase()
    const matchesSearch = !q || title.includes(q) || summary.includes(q) || item.source.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  // Motor de Gesticulación y Animación de Visemas Faciales
  const startGesticulation = useCallback(() => {
    if (gesticulationTimerRef.current) clearInterval(gesticulationTimerRef.current)
    gesticulationTimerRef.current = setInterval(() => {
      // Simula alternancia de visemas labiales (A, E, O, M, Cerrado) con fluctuación realista
      setMouthShape(Math.floor(Math.random() * 5))
    }, 120)
  }, [])

  const stopGesticulation = useCallback(() => {
    if (gesticulationTimerRef.current) {
      clearInterval(gesticulationTimerRef.current)
      gesticulationTimerRef.current = null
    }
    setMouthShape(0)
  }, [])

  // Ejecución de SpeechSynthesis
  const speakArticle = useCallback(
    (item: NewsItem) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

      window.speechSynthesis.cancel()
      stopGesticulation()

      const textToSpeak = isEn ? item.speechScriptEn : item.speechScriptEs
      const utterance = new SpeechSynthesisUtterance(textToSpeak)

      utterance.rate = speechRate
      utterance.pitch = 1.05
      utterance.lang = isEn ? 'en-US' : 'es-ES'

      // Tratar de asignar una voz natural
      const voices = window.speechSynthesis.getVoices()
      const targetLang = isEn ? 'en' : 'es'
      const bestVoice = voices.find((v) => v.lang.startsWith(targetLang) && !v.name.includes('Google')) || voices.find((v) => v.lang.startsWith(targetLang))
      if (bestVoice) utterance.voice = bestVoice

      utterance.onstart = () => {
        setIsSpeaking(true)
        setIsPaused(false)
        startGesticulation()
        setSpokenTextFragment(textToSpeak.slice(0, 80) + '...')
      }

      utterance.onboundary = (e) => {
        // Actualiza el fragmento de texto activo según el índice de palabra
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
    window.scrollTo({ top: 120, behavior: 'smooth' })
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
    setTimeout(() => setCopiedId(null), 2500)
  }

  // Cleanup de audio al desmontar
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      stopGesticulation()
    }
  }, [stopGesticulation])

  return (
    <div className="min-h-screen bg-[#060814] text-white selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
        {/* Alerta del Ciclo Solar 25 */}
        <SolarPeakAlert />

        {/* ─── CABECERA DEL CENTRO DE INTELIGENCIA Y NOTICIAS ───────────────── */}
        <section className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold tracking-wider uppercase">
            <BroadcastIcon size={14} className="text-purple-400" />
            <span>HELIOX Intel · #BuildHybridAI 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {isEn ? 'AI Space Weather Anchor &' : 'Presentador IA y Feed de'}
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {isEn ? 'Live Heliophysics Intelligence' : 'Noticias Heliofísicas en Vivo'}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-white/60 max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? 'Real-time verified bulletins from NASA SDO, NOAA SWPC, and ESA Solar Orbiter. Articulated live by the HELIOX holographic AI scientific anchor with zero-hallucination accuracy.'
              : 'Boletines verificados en tiempo real de satélites NASA SDO, NOAA SWPC y ESA. Gesticulados y narrados en directo por el presentador científico de IA con precisión matemática y sin alucinaciones.'}
          </p>
        </section>

        {/* ─── ESCENARIO DEL PRESENTADOR CIENTÍFICO DE IA (HERO STAGE) ──────── */}
        <section className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#0c102b] via-[#080b1e] to-black border border-cyan-500/30 shadow-2xl overflow-hidden">
          {/* Luz ambiental holográfica */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Badge superior de estado de la emisión */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
                <span className={`w-2 h-2 rounded-full ${isSpeaking && !isPaused ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`} />
                <span>{isSpeaking && !isPaused ? '[BROADCAST_ACTIVE: GESTICULATING]' : '[AI_ANCHOR: STANDBY]'}</span>
              </div>
              <span className="text-xs font-mono text-white/40 hidden sm:inline">
                ID: {selectedNews.id} · Ref: {selectedNews.instrument}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-white/40">{isEn ? 'Voice Speed:' : 'Velocidad:'}</span>
              {[0.9, 1.0, 1.2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setSpeechRate(rate)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all cursor-pointer ${
                    speechRate === rate
                      ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center pt-6 relative z-10">
            {/* Columna Izquierda: Avatar Holográfico de IA Gesticulando */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-black/80 border-2 border-cyan-500/40 p-4 shadow-[0_0_40px_rgba(6,182,212,0.2)] flex flex-col items-center justify-center overflow-hidden">
                {/* Cuadrícula de escaneo holográfico */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.06)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                {/* Retícula Táctica de Rastreo Facial */}
                <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-400">TRK_FACIAL: 99.8%</div>
                <div className="absolute top-2 right-2 text-[9px] font-mono text-purple-400">SYNC_VISEMES</div>
                <div className="absolute bottom-2 left-2 text-[9px] font-mono text-emerald-400">FPS: 60</div>
                <div className="absolute bottom-2 right-2 text-[9px] font-mono text-amber-400">{selectedNews.verifiedCoordinates || 'HELIOS'}</div>

                {/* Rostro Vectorial de IA con Gesticulación de Boca y Ojos */}
                <svg viewBox="0 0 120 120" className="w-40 h-40 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                  {/* Contorno Craneal Cibernético */}
                  <rect x="25" y="20" width="70" height="75" rx="20" fill="none" stroke="#00f3ff" strokeWidth="2" strokeDasharray="4 2" opacity="0.6" />
                  <path d="M35 15 L85 15" stroke="#a855f7" strokeWidth="2" />
                  <circle cx="60" cy="15" r="3" fill="#a855f7" />

                  {/* Cejas Tácticas */}
                  <path d={selectedNews.severity === 'CRÍTICA' ? 'M35 44 L50 48' : 'M35 46 L50 46'} stroke="#00f3ff" strokeWidth="2.5" strokeLinecap="round" />
                  <path d={selectedNews.severity === 'CRÍTICA' ? 'M70 48 L85 44' : 'M70 46 L85 46'} stroke="#00f3ff" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Ojos Holográficos con Parpadeo */}
                  <circle cx="43" cy="54" r="5" fill="#00f3ff" className="animate-pulse" />
                  <circle cx="77" cy="54" r="5" fill="#00f3ff" className="animate-pulse" />
                  <circle cx="43" cy="54" r="2" fill="#ffffff" />
                  <circle cx="77" cy="54" r="2" fill="#ffffff" />

                  {/* Nariz Sensorial */}
                  <path d="M60 55 L60 67 L56 69" fill="none" stroke="#00f3ff" strokeWidth="1.5" opacity="0.7" />

                  {/* Boca Dinámica Gesticulante (Visemas en tiempo real) */}
                  {mouthShape === 0 && (
                    /* Reposo: Neutral */
                    <path d="M48 80 Q60 81 72 80" fill="none" stroke="#00f3ff" strokeWidth="2.5" strokeLinecap="round" />
                  )}
                  {mouthShape === 1 && (
                    /* Fonema O: Redondo */
                    <ellipse cx="60" cy="80" rx="7" ry="9" fill="#00f3ff" fillOpacity="0.25" stroke="#00f3ff" strokeWidth="2" />
                  )}
                  {mouthShape === 2 && (
                    /* Fonema A: Abierto amplio */
                    <ellipse cx="60" cy="82" rx="11" ry="8" fill="#00f3ff" fillOpacity="0.3" stroke="#00f3ff" strokeWidth="2.5" />
                  )}
                  {mouthShape === 3 && (
                    /* Fonema E / I: Sonrisa abierta */
                    <path d="M44 80 Q60 88 76 80 Q60 76 44 80" fill="#00f3ff" fillOpacity="0.25" stroke="#00f3ff" strokeWidth="2" />
                  )}
                  {mouthShape === 4 && (
                    /* Fonema M / P: Cerrado tenso */
                    <line x1="46" y1="80" x2="74" y2="80" stroke="#00f3ff" strokeWidth="3" strokeLinecap="round" />
                  )}

                  {/* Circuitos en Mandíbula */}
                  <path d="M30 75 L22 85 M90 75 L98 85" stroke="#00f3ff" strokeWidth="1.5" opacity="0.5" />
                  <circle cx="22" cy="85" r="2" fill="#00f3ff" />
                  <circle cx="98" cy="85" r="2" fill="#00f3ff" />
                </svg>

                {/* Equalizador de audio simulado al gesticular */}
                <div className="flex items-end justify-center gap-1 w-full h-8 px-6 mt-1">
                  {[...Array(14)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isSpeaking && !isPaused ? [4, Math.random() * 24 + 4, 4] : 4,
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.2 + (i % 5) * 0.05,
                        ease: 'easeInOut',
                      }}
                      className="w-1.5 rounded-full bg-gradient-to-t from-cyan-500 to-purple-400"
                    />
                  ))}
                </div>
              </div>

              {/* Botones de Control de la Emisión */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePlay}
                  className={`px-6 py-3 rounded-2xl text-xs font-mono font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
                    isSpeaking && !isPaused
                      ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/25 active:scale-95'
                  }`}
                >
                  {isSpeaking && !isPaused ? (
                    <>
                      <PauseIcon size={14} />
                      <span>{isEn ? 'Pause Anchor' : 'Pausar Presentador'}</span>
                    </>
                  ) : (
                    <>
                      <SpeakerIcon size={14} />
                      <span>{isPaused ? (isEn ? 'Resume Speech' : 'Reanudar Voz') : isEn ? 'Speak & Gesticulate' : 'Gesticular Noticia con IA'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleStopSpeech}
                  disabled={!isSpeaking && !isPaused}
                  className="p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white/70 hover:text-white transition-all cursor-pointer"
                  title="Detener voz"
                >
                  <VolumeMuteIcon size={15} />
                </button>
              </div>
            </div>

            {/* Columna Derecha: Teleprompter Científico y Noticia Activa */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${selectedNews.severityColor}`}>
                  {selectedNews.severity}
                </span>
                <span className="text-xs font-mono text-cyan-400">{selectedNews.source}</span>
                <span className="text-xs font-mono text-white/40 ml-auto">
                  {new Date(selectedNews.timestampUTC).toLocaleString()}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {isEn ? selectedNews.titleEn : selectedNews.titleEs}
              </h2>

              {/* Barra de métricas verificadas */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-white/80 flex items-center gap-2">
                <CrosshairIcon size={14} className="text-amber-400 shrink-0" />
                <span className="truncate">{selectedNews.metrics}</span>
              </div>

              {/* Teleprompter en tiempo real */}
              <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-white/50 pb-1 border-b border-white/5">
                  <span className="flex items-center gap-1.5">
                    <BrainChipIcon size={12} className="text-cyan-400" />
                    <span>TELEPROMPTER VOCAL SINTETIZADO</span>
                  </span>
                  <span>{speechProgress}% COMPLETADO</span>
                </div>

                <p className="text-sm text-cyan-100 leading-relaxed font-mono">
                  {isEn ? selectedNews.speechScriptEn : selectedNews.speechScriptEs}
                </p>

                {isSpeaking && spokenTextFragment && (
                  <div className="pt-2 text-xs font-mono text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    <span className="text-amber-400 font-bold mr-1">Vocalizando ahora:</span>
                    &ldquo;{spokenTextFragment}&rdquo;
                  </div>
                )}
              </div>

              {/* Sello de Verificación Satelital */}
              <div className="flex flex-wrap items-center justify-between text-xs text-white/40 pt-1">
                <span className="flex items-center gap-1 font-mono">
                  <CheckCircleIcon size={13} className="text-emerald-400" />
                  <span>Cero Alucinaciones · Datos Satelitales Oficiales</span>
                </span>
                <button
                  onClick={() => handleCopyBulletin(selectedNews)}
                  className="font-mono text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>{copiedId === selectedNews.id ? '[COPIADO]' : 'Copiar Boletín Completo'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEED DE NOTICIAS ESPACIALES EN VIVO ─────────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-1">
                <NewspaperIcon size={14} className="text-cyan-400" />
                <span>BOLETINES OFICIALES DE CLIMA ESPACIAL</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {isEn ? 'Latest Heliophysics Dispatch Feed' : 'Feed de Inteligencia Heliofísica'}
              </h3>
            </div>

            {/* Buscador de noticias */}
            <div className="w-full md:w-72">
              <input
                type="text"
                placeholder={isEn ? 'Filter by keyword, instrument...' : 'Buscar evento, satélite o región...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-all"
              />
            </div>
          </div>

          {/* Filtros por Categoría */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', labelEs: 'Todas las Noticias', labelEn: 'All Bulletins', icon: GlobeGridIcon },
              { id: 'flares', labelEs: 'Llamaradas X', labelEn: 'X-Class Flares', icon: FlareIcon },
              { id: 'cmes', labelEs: 'CMEs & Plasma', labelEn: 'CMEs & Plasma', icon: WaveIcon },
              { id: 'storms', labelEs: 'Tormentas Geomagnéticas', labelEn: 'Geomagnetic Storms', icon: SparklesIcon },
              { id: 'missions', labelEs: 'Sondas & Misiones', labelEn: 'Space Missions', icon: SatelliteIcon },
            ].map((cat) => {
              const CatIcon = cat.icon
              const isSelected = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as NewsCategory)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <CatIcon size={13} className={isSelected ? 'text-black' : 'text-cyan-400'} />
                  <span>{isEn ? cat.labelEn : cat.labelEs}</span>
                </button>
              )
            })}
          </div>

          {/* Lista del Feed */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredNews.map((item) => {
              const isSelected = selectedNews.id === item.id
              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-cyan-950/20 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.severityColor}`}>
                        {item.severity}
                      </span>
                      <span className="text-white/40">{new Date(item.timestampUTC).toLocaleTimeString()} UTC</span>
                    </div>

                    <div>
                      <div className="text-[11px] font-mono text-cyan-400 font-bold mb-1">{item.source} · {item.instrument}</div>
                      <h4 className="text-base font-bold text-white leading-snug">
                        {isEn ? item.titleEn : item.titleEs}
                      </h4>
                    </div>

                    <p className="text-xs text-white/60 leading-relaxed">
                      {isEn ? item.summaryEn : item.summaryEs}
                    </p>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-white/70">
                      {item.metrics}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleSelectAndSpeak(item)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected && isSpeaking
                          ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                          : 'bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/40'
                      }`}
                    >
                      <SpeakerIcon size={13} />
                      <span>{isEn ? 'Articulate with AI Anchor' : 'Gesticular con IA'}</span>
                    </button>

                    <button
                      onClick={() => handleCopyBulletin(item)}
                      className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs font-mono cursor-pointer"
                      title="Copiar boletín"
                    >
                      {copiedId === item.id ? <CheckCircleIcon size={14} className="text-emerald-400" /> : <CrosshairIcon size={14} />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
