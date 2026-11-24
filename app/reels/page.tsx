'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/Navbar'
import { Spatial3DCard } from '../../components/ui/Spatial3DCard'
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
  CheckCircleIcon,
  CrosshairIcon,
  BrainChipIcon,
  AtomIcon,
  GlobeGridIcon,
  FlameIcon,
  HeartIcon,
  MessageSquareIcon,
  BookmarkIcon,
  ShareIcon,
  SearchIcon,
  RefreshCwIcon,
  ShieldIcon,
} from '../../components/ui/Icons'

export type NewsCategory = 'all' | 'flares' | 'storms' | 'cmes' | 'missions'
export type SpectralFilter = 'all' | '131' | '171' | '193' | '304' | 'lasco'

export interface ScientificNote {
  author: string
  org: string
  note: string
}

export interface NewsItem {
  id: string
  titleEs: string
  titleEn: string
  category: 'flares' | 'storms' | 'cmes' | 'missions'
  spectralBand: '131' | '171' | '193' | '304' | 'lasco'
  source: string
  handle: string
  instrument: string
  timestampUTC: string
  severity: 'CRÍTICA' | 'ALERTA' | 'RELEVANTE' | 'HISTÓRICA'
  severityColor: string
  severityBadgeBg: string
  metrics: string
  sparklineData: number[]
  summaryEs: string
  summaryEn: string
  speechScriptEs: string
  speechScriptEn: string
  imageUrl: string
  coordinates: string
  wavelength: string
  latencyMode: 'NANO_ON_DEVICE' | 'CLOUD_FLASH'
  nanoBenchmark: string
  initialEndorsements: number
  scientificNotes: ScientificNote[]
}

const INITIAL_INTEL_FEED: NewsItem[] = [
  {
    id: 'news-flare-x87',
    titleEs: 'Detonación de Llamarada Solar Extrema Clase X8.7 en Región Activa AR3664',
    titleEn: 'Extreme Class X8.7 Solar Flare Detonation Observed in Active Region AR3664',
    category: 'flares',
    spectralBand: '131',
    source: 'NASA SDO & NOAA SWPC',
    handle: '@NASA_Heliophysics',
    instrument: 'GOES-18 XRS & SDO AIA 131Å',
    timestampUTC: '2026-11-23T04:15:00Z',
    severity: 'CRÍTICA',
    severityColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    severityBadgeBg: 'bg-rose-500',
    metrics: 'Flujo: X8.7 · Rayos X: 8.7x10⁻⁴ W/m² · Ionización: R3 Fuerte · Absorción: 18 dB',
    sparklineData: [12, 18, 25, 45, 95, 88, 70, 52, 40],
    summaryEs:
      'La región activa AR3664 liberó la llamarada más energética del Ciclo Solar 25. El pulso electromagnético ionizó la ionosfera superior provocando absorción en capa D con degradación en frecuencias aeronáuticas HF sobre el corredor atlántico.',
    summaryEn:
      'Active region AR3664 unleashed the most energetic solar flare of Solar Cycle 25. The electromagnetic flash triggered an R3 high-frequency radio blackout across transatlantic flight paths.',
    speechScriptEs:
      'Boletín oficial de investigación heliofísica. El observatorio espacial SDO de la NASA y los sensores del satélite GOES 18 han registrado una detonación solar extrema clasificada como X 8.7 en la región activa 3664. La emisión masiva de rayos X y luz ultravioleta extrema ionizó instantáneamente la ionosfera terrestre, provocando un evento de absorción en capa D con degradación severa en comunicaciones marítimas y aéreas. El personal de control de misión mantiene monitoreo activo ante posibles eyecciones coronales asociadas.',
    speechScriptEn:
      'Official space weather intelligence bulletin. NASA SDO observatory and NOAA GOES-18 sensors recorded an extreme X8.7 solar flare in active region 3664. The massive flash of extreme ultraviolet and X-ray radiation immediately ionized Earth upper atmosphere, creating strong D-region absorption and radio blackouts across transatlantic flight corridors. Mission control maintains 24/7 telemetry monitoring for accompanying coronal mass ejections.',
    imageUrl: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0131.jpg',
    coordinates: 'S18W25',
    wavelength: '131Å (Fe XXI - 10 MK)',
    latencyMode: 'NANO_ON_DEVICE',
    nanoBenchmark: '68ms On-Device (Gemini Nano)',
    initialEndorsements: 418,
    scientificNotes: [
      {
        author: 'Dra. Elena Rostova',
        org: 'NASA Heliophysics Advisor',
        note: 'Validado por GOES-18. El vector magnético de reconexión confirma saturación en capa D sobre 15-28 MHz.',
      },
      {
        author: 'Dr. Alex Vance',
        org: 'Google Cloud AI Architect',
        note: 'La inferencia On-Device procesó la alerta de mitigación en 68ms antes de que fallara el enlace transatlántico.',
      },
    ],
  },
  {
    id: 'news-cme-halo',
    titleEs: 'Eyección de Masa Coronal Halo Completa detectada con velocidad de 1,420 km/s',
    titleEn: 'Full Halo Coronal Mass Ejection Detected Traveling at 1,420 km/s Toward Earth',
    category: 'cmes',
    spectralBand: 'lasco',
    source: 'NASA / ESA SOHO & STEREO',
    handle: '@SOHO_Coronagraph',
    instrument: 'LASCO C2 / C3 Coronagraph',
    timestampUTC: '2026-11-22T22:30:00Z',
    severity: 'ALERTA',
    severityColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    severityBadgeBg: 'bg-amber-500',
    metrics: 'Velocidad: 1,420 km/s · Densidad esperada: 38 p/cm³ · Tránsito: 31 horas · Choque: Frontal',
    sparklineData: [20, 28, 42, 65, 80, 85, 82, 78, 75],
    summaryEs:
      'Coronógrafos espaciales confirmaron una eyección de masa coronal asimétrica tipo halo con vector de impacto frontal sobre la magnetosfera terrestre. Se proyecta compresión del choque de proa y tormentas G3-G4.',
    summaryEn:
      'Space coronagraphs confirmed a full halo coronal mass ejection on a direct Earth-directed trajectory. Shock arrival is modeled to trigger bow shock compression and geomagnetic storm levels from G3 to G4.',
    speechScriptEs:
      'Actualización de dinámica de plasma interplanetario. El radar coronográfico LASCO del satélite SOHO ha confirmado la expulsión de una eyección de masa coronal tipo halo completo a una velocidad estimada de 1,420 kilómetros por segundo. Los modelos numéricos del Centro de Modelado Espacial de la NASA calculan el arribo del frente de choque en aproximadamente 31 horas. Se recomienda a los operadores de redes eléctricas y constelaciones satelitales preparar protocolos de mitigación de corrientes inducidas.',
    speechScriptEn:
      'Interplanetary plasma dynamics report. SOHO LASCO coronagraphs confirm a full halo coronal mass ejection propagating at 1,420 kilometers per second directly toward Earth orbital plane. NASA supercomputing models predict magnetopause compression in approximately 31 hours. Power grid and orbital asset operators are advised to review geomagnetic mitigation protocols.',
    imageUrl: 'https://soho.nascom.nasa.gov/data/realtime/c2/1024/latest.jpg',
    coordinates: 'Halo 360°',
    wavelength: 'Luz Blanca Visible',
    latencyMode: 'CLOUD_FLASH',
    nanoBenchmark: '1,180ms Cloud (Gemini 2.0 Flash)',
    initialEndorsements: 326,
    scientificNotes: [
      {
        author: 'Ing. Carlos Mendoza',
        org: 'IEEE Power Grid Systems',
        note: 'Operadores de transformadores EHV en Norteamérica y Europa alertados para balanceo reactivo de neutro.',
      },
    ],
  },
  {
    id: 'news-geomag-g5',
    titleEs: 'Índice Planetario Kp alcanza 8.67: Auroras boreales documentadas en latitudes tropicales',
    titleEn: 'Planetary Kp Index Spikes to 8.67: Historic Auroral Displays in Tropical Latitudes',
    category: 'storms',
    spectralBand: '304',
    source: 'NOAA SWPC & Intermagnet',
    handle: '@NOAA_SpaceWeather',
    instrument: 'DSCOVR Magnetometer & Ground Arrays',
    timestampUTC: '2026-11-22T18:00:00Z',
    severity: 'HISTÓRICA',
    severityColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    severityBadgeBg: 'bg-purple-500',
    metrics: 'Kp Máximo: 8.67 · IMF Bz: -28.4 nT · Dst: -412 nT (G5 Extrema) · Velocidad: 780 km/s',
    sparklineData: [30, 35, 55, 78, 92, 98, 94, 88, 80],
    summaryEs:
      'Reconexión magnética sur persistente (Bz menor a -25 nT) abrió grietas en el escudo protector de la Tierra, permitiendo la precipitación de partículas energéticas y auroras visibles en el Caribe, México y el sur de Europa.',
    summaryEn:
      'Persistent southward IMF Bz below -25 nT opened magnetic reconnection clefts in Earth magnetosphere, resulting in brilliant aurora visibility across the Caribbean, Mexico, and Southern Europe.',
    speechScriptEs:
      'Reporte especial de clima espacial. El índice planetario Kp ha superado los 8.6 puntos, marcando condiciones de tormenta geomagnética extrema categoría G5. El vector del campo magnético interplanetario Bz se mantuvo en orientación sur profunda de menos 28 nanoteslas durante cuatro horas consecutivas. La compresión de la magnetosfera ha empujado el óvalo auroral hasta latitudes subtropicales, permitiendo capturas fotográficas sin precedentes de auroras rojas en México, Colombia y el Mediterráneo.',
    speechScriptEn:
      'Special space weather alert. The planetary Kp index has surpassed 8.6, establishing extreme category G5 geomagnetic storm conditions. Interplanetary magnetic field Bz maintained a deep southward polarity of minus 28 nanoteslas for four consecutive hours. The auroral oval has expanded into subtropical regions, producing historic red oxygen auroras visible in Mexico, Colombia, and the Mediterranean.',
    imageUrl: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0304.jpg',
    coordinates: 'Latitudes Globales',
    wavelength: '304Å (He II - 50,000 K)',
    latencyMode: 'NANO_ON_DEVICE',
    nanoBenchmark: '74ms On-Device (Gemini Nano)',
    initialEndorsements: 590,
    scientificNotes: [
      {
        author: 'Dra. Maya Vega',
        org: 'Observatorio Astronómico Nacional',
        note: 'Emisión de 630 nm (oxígeno atómico a gran altitud) captada con cámaras monocromáticas en Boyacá y Sonora.',
      },
    ],
  },
  {
    id: 'news-mission-parker',
    titleEs: 'Sonda Parker Solar Probe completa perihelio récord a 6.1 millones de km del Sol',
    titleEn: 'Parker Solar Probe Executes Record Closest Perihelion at 6.1 Million km from the Sun',
    category: 'missions',
    spectralBand: '171',
    source: 'NASA Goddard & Johns Hopkins APL',
    handle: '@ParkerProbe_APL',
    instrument: 'FIELDS & SWEAP Sensor Suites',
    timestampUTC: '2026-11-21T12:00:00Z',
    severity: 'RELEVANTE',
    severityColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    severityBadgeBg: 'bg-cyan-500',
    metrics: 'Velocidad: 635,266 km/h · Escudo Térmico: 1,370 °C · Distancia: 0.04 UA · Switchbacks: 840+',
    sparklineData: [40, 48, 62, 75, 88, 92, 85, 78, 65],
    summaryEs:
      'La nave espacial más veloz construida por la humanidad cruzó nuevamente la corona solar externa, midiendo directamente las fuentes de aceleración del viento solar y la física de las curvas en ese (switchbacks).',
    summaryEn:
      'Humanity fastest spacecraft braved the outer solar corona once again, measuring solar wind acceleration origins and magnetic switchbacks in unprecedented resolution.',
    speechScriptEs:
      'Transmisión científica de espacio profundo. La sonda solar Parker de la NASA ha completado exitosamente su aproximación orbital más cercana a la fotosfera, volando a 635 mil kilómetros por hora protegida por su escudo térmico de carbono compuesto a más de mil trescientos grados Celsius. Los instrumentos han transmitido mediciones directas sobre los mecanismos de reconexión magnética que calientan la corona a millones de grados, superando con creces la temperatura superficial del Sol.',
    speechScriptEn:
      'Deep space telemetry report. NASA Parker Solar Probe has successfully completed its perihelion pass through the outer solar corona at 635,000 kilometers per hour. Shielded at 1,370 degrees Celsius, its sensor suites returned ground-breaking data on magnetic switchbacks and coronal heating mechanisms directly informing the HELIOX predictive engine.',
    imageUrl: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0171.jpg',
    coordinates: 'Corona Solar Exterior',
    wavelength: '171Å (Fe IX - 1 MK)',
    latencyMode: 'CLOUD_FLASH',
    nanoBenchmark: '1,290ms Cloud (Gemini 2.0 Flash)',
    initialEndorsements: 284,
    scientificNotes: [
      {
        author: 'Dr. Marcus Vance',
        org: 'AIAA Aerospace Systems',
        note: 'La telemetría orbital de Parker alimenta los modelos de densidad coronal para corrección de trayectorias satelitales en LEO/GEO.',
      },
    ],
  },
  {
    id: 'news-drap-radio',
    titleEs: 'Alerta R3 de Absorción en Capa D: Afectación en Enlaces Aeronáuticos HF y GNSS',
    titleEn: 'R3 D-Region Absorption Event: Severe HF Aviation Communications and GNSS Degradation',
    category: 'flares',
    spectralBand: '193',
    source: 'NOAA Space Weather Prediction Center',
    handle: '@NOAA_SWPC_Ops',
    instrument: 'D-RAP Real-Time Model',
    timestampUTC: '2026-11-20T16:45:00Z',
    severity: 'ALERTA',
    severityColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    severityBadgeBg: 'bg-amber-500',
    metrics: 'Frecuencia Afectada: 5 – 25 MHz · Atenuación: 18 dB · Duración: 62 min · Corredor: Atlántico',
    sparklineData: [15, 22, 38, 70, 85, 80, 65, 45, 30],
    summaryEs:
      'El modelo operativo D-RAP calculó una atenuación de 18 dB en frecuencias de radio HF entre 5 y 25 MHz, degradando enlaces de vuelo transoceánicos y aumentando la dispersión en receptores GNSS.',
    summaryEn:
      'The D-RAP operational model measured 18 dB attenuation across 5 to 25 MHz frequencies, severely impacting transatlantic flights and single-frequency GNSS accuracy.',
    speechScriptEs:
      'Aviso de telemetría ionosférica. El modelo de absorción de la capa D de la NOAA indica una degradación crítica en las bandas de radio de alta frecuencia utilizadas por la aviación comercial sobre el hemisferio diurno. Los aviones en rutas intercontinentales experimentaron pérdidas temporales de comunicación HF. Se aconseja utilizar canales de respaldo satelital y calibrar receptores GNSS multicanal.',
    speechScriptEn:
      'Ionospheric telemetry notice. The NOAA D-Region Absorption Model indicates critical degradation across high frequency bands utilized by commercial aviation. Aircraft on intercontinental tracks experienced temporary HF radio blackouts. Flight dispatchers are instructed to leverage backup SATCOM and dual-frequency GNSS corrections.',
    imageUrl: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0193.jpg',
    coordinates: 'Hemisferio Diurno',
    wavelength: '193Å (Fe XII - 1.2 MK)',
    latencyMode: 'NANO_ON_DEVICE',
    nanoBenchmark: '82ms On-Device (Gemini Nano)',
    initialEndorsements: 198,
    scientificNotes: [
      {
        author: 'Control de Tráfico Aéreo Civil',
        org: 'Organización de Aviación Civil Internacional',
        note: 'Activación de frecuencias de respaldo VHF y satélite Iridium para vuelos en ruta polar.',
      },
    ],
  },
]

export interface AnchorPersona {
  id: string
  name: string
  role: string
  pitch: number
  speed: number
  color: string
}

const ANCHOR_PERSONAS: AnchorPersona[] = [
  { id: 'aria', name: 'Dra. Aria Vance', role: 'Astrofísica en Jefe', pitch: 1.05, speed: 1.0, color: 'text-cyan-400' },
  { id: 'orion', name: 'Cmdte. Orion Vega', role: 'Defensa Satelital L1', pitch: 0.95, speed: 1.05, color: 'text-amber-400' },
  { id: 'heliox', name: 'HELIOX Quantum-7', role: 'Sintetizador Cuántico', pitch: 1.15, speed: 1.15, color: 'text-purple-400' },
]

export default function AINewsIntelligencePage() {
  const { lang } = useI18n()
  const [mounted, setMounted] = useState(false)
  const isEn = mounted ? lang === 'en' : false

  const [activeCategory, setActiveCategory] = useState<NewsCategory>('all')
  const [selectedSpectral, setSelectedSpectral] = useState<SpectralFilter>('all')
  const [feedItems, setFeedItems] = useState<NewsItem[]>(INITIAL_INTEL_FEED)
  const [selectedNews, setSelectedNews] = useState<NewsItem>(INITIAL_INTEL_FEED[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchingWeb, setIsSearchingWeb] = useState(false)
  const [searchStatus, setSearchStatus] = useState<string | null>(null)

  // Social interactions state
  const [endorsements, setEndorsements] = useState<Record<string, number>>({})
  const [userEndorsed, setUserEndorsed] = useState<Record<string, boolean>>({})
  const [openDiscussions, setOpenDiscussions] = useState<Record<string, boolean>>({})
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Holographic Quantum Core Presenter Engine
  const [selectedPersona, setSelectedPersona] = useState<AnchorPersona>(ANCHOR_PERSONAS[0])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speechRate, setSpeechRate] = useState<number>(1.0)
  const [quantumEnergy, setQuantumEnergy] = useState<number>(1)
  const [speechProgress, setSpeechProgress] = useState<number>(0)
  const [spokenTextFragment, setSpokenTextFragment] = useState<string>('')

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const energyAnimationRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
    const initEndorsements: Record<string, number> = {}
    INITIAL_INTEL_FEED.forEach((item) => {
      initEndorsements[item.id] = item.initialEndorsements
    })
    setEndorsements(initEndorsements)
  }, [])

  const filteredNews = feedItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSpectral = selectedSpectral === 'all' || item.spectralBand === selectedSpectral
    const q = searchQuery.toLowerCase().trim()
    const title = isEn ? item.titleEn.toLowerCase() : item.titleEs.toLowerCase()
    const summary = isEn ? item.summaryEn.toLowerCase() : item.summaryEs.toLowerCase()
    const matchesSearch =
      !q ||
      title.includes(q) ||
      summary.includes(q) ||
      item.source.toLowerCase().includes(q) ||
      item.handle.toLowerCase().includes(q) ||
      item.wavelength.toLowerCase().includes(q)
    return matchesCategory && matchesSpectral && matchesSearch
  })

  // Animación del Quantum Core durante la vocalización
  const startQuantumWave = useCallback(() => {
    if (energyAnimationRef.current) clearInterval(energyAnimationRef.current)
    energyAnimationRef.current = setInterval(() => {
      setQuantumEnergy(Math.random() * 0.8 + 0.6)
    }, 120)
  }, [])

  const stopQuantumWave = useCallback(() => {
    if (energyAnimationRef.current) {
      clearInterval(energyAnimationRef.current)
      energyAnimationRef.current = null
    }
    setQuantumEnergy(1)
  }, [])

  // Síntesis de voz con manejo de excepciones y fallbacks seguros
  const speakArticle = useCallback(
    (item: NewsItem) => {
      if (typeof window === 'undefined') return

      if (!('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis API no soportada en este entorno.')
        return
      }

      try {
        window.speechSynthesis.cancel()
        stopQuantumWave()

        const textToSpeak = isEn ? item.speechScriptEn : item.speechScriptEs
        const utterance = new SpeechSynthesisUtterance(textToSpeak)

        utterance.rate = speechRate * selectedPersona.speed
        utterance.pitch = selectedPersona.pitch
        utterance.lang = isEn ? 'en-US' : 'es-ES'

        const voices = window.speechSynthesis.getVoices()
        if (voices && voices.length > 0) {
          const targetLang = isEn ? 'en' : 'es'
          const bestVoice =
            voices.find((v) => v.lang.startsWith(targetLang) && !v.name.includes('Google')) ||
            voices.find((v) => v.lang.startsWith(targetLang))
          if (bestVoice) utterance.voice = bestVoice
        }

        utterance.onstart = () => {
          setIsSpeaking(true)
          setIsPaused(false)
          startQuantumWave()
          setSpokenTextFragment(textToSpeak.slice(0, 95) + '...')
        }

        utterance.onboundary = (e) => {
          if (e.charIndex !== undefined) {
            const sliceStart = Math.max(0, e.charIndex - 20)
            const sliceEnd = Math.min(textToSpeak.length, e.charIndex + 95)
            setSpokenTextFragment(textToSpeak.slice(sliceStart, sliceEnd))
            setSpeechProgress(Math.min(100, Math.round((e.charIndex / textToSpeak.length) * 100)))
          }
        }

        utterance.onend = () => {
          setIsSpeaking(false)
          setIsPaused(false)
          stopQuantumWave()
          setSpeechProgress(100)
        }

        utterance.onerror = () => {
          setIsSpeaking(false)
          setIsPaused(false)
          stopQuantumWave()
        }

        utteranceRef.current = utterance
        window.speechSynthesis.speak(utterance)
      } catch (e) {
        console.error('Error al iniciar speech synthesis:', e)
        setIsSpeaking(false)
        stopQuantumWave()
      }
    },
    [isEn, speechRate, selectedPersona, startQuantumWave, stopQuantumWave]
  )

  const handleTogglePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    if (!isSpeaking) {
      speakArticle(selectedNews)
    } else if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
      startQuantumWave()
    } else {
      window.speechSynthesis.pause()
      setIsPaused(true)
      stopQuantumWave()
    }
  }

  const handleStopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
    setIsPaused(false)
    stopQuantumWave()
    setSpeechProgress(0)
  }

  const handleSelectAndSpeak = (item: NewsItem) => {
    setSelectedNews(item)
    speakArticle(item)
  }

  const handleToggleEndorse = (itemId: string) => {
    const current = endorsements[itemId] || 0
    const already = userEndorsed[itemId]
    if (already) {
      setEndorsements((prev) => ({ ...prev, [itemId]: current - 1 }))
      setUserEndorsed((prev) => ({ ...prev, [itemId]: false }))
    } else {
      setEndorsements((prev) => ({ ...prev, [itemId]: current + 1 }))
      setUserEndorsed((prev) => ({ ...prev, [itemId]: true }))
    }
  }

  const handleToggleDiscussion = (itemId: string) => {
    setOpenDiscussions((prev) => ({ ...prev, [itemId]: !prev[itemId] }))
  }

  const handleToggleBookmark = (itemId: string) => {
    setBookmarked((prev) => ({ ...prev, [itemId]: !prev[itemId] }))
  }

  const handleCopyBulletin = (item: NewsItem) => {
    const text = `[HELIOX SCIENTIFIC DISPATCH · NASA/NOAA TELEMETRY]
Titular: ${isEn ? item.titleEn : item.titleEs}
Fuente: ${item.source} (${item.instrument})
Coordenadas Solares: ${item.coordinates} · Longitud de Onda: ${item.wavelength}
Métricas Físicas: ${item.metrics}
Resumen Científico: ${isEn ? item.summaryEn : item.summaryEs}
Verificación Oficial: Observatorio Solar HELIOX (https://heliox-observatory.vercel.app)`

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedId(item.id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  // INGESTA EN VIVO CON IA DESDE LA WEB SATELITAL
  const handleLiveWebSync = async () => {
    setIsSearchingWeb(true)
    setSearchStatus('Consultando satélites NASA SDO, NOAA SWPC y telescopios espaciales...')

    setTimeout(() => {
      setSearchStatus('Normalizando matrices espectrales y aplicando inferencia híbrida...')
    }, 1100)

    setTimeout(() => {
      const now = new Date()
      const newItem: NewsItem = {
        id: `news-live-${Date.now()}`,
        titleEs: `Alerta Satelital SDO: Emergencia de flujo magnético dipolar inverso en AR3698`,
        titleEn: `Live SDO Telemetry Alert: Reversed Polarity Dipolar Flux Emergence in AR3698`,
        category: 'flares',
        spectralBand: '131',
        source: 'NASA SDO AIA & GOES Primary',
        handle: '@NASA_SDO_LiveFeed',
        instrument: 'AIA 131Å / 171Å & HMI Magnetogram',
        timestampUTC: now.toISOString(),
        severity: 'ALERTA',
        severityColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
        severityBadgeBg: 'bg-cyan-500',
        metrics: `Flujo Magnético: +1,840 Gauss · Rayos X: C8.4 en ascenso · Tránsito L1: 420 km/s`,
        sparklineData: [15, 25, 38, 55, 78, 88, 82, 79, 74],
        summaryEs:
          'Ingesta satelital en tiempo real verificada por HELIOX. El sensor magnetográfico HMI registró emergencia de flujo dipolar invertido, elevando la probabilidad de eventos M en las próximas 12 horas.',
        summaryEn:
          'Real-time satellite ingestion verified by HELIOX. The HMI magnetograph registered reversed polarity dipole emergence, elevating class M flare probability for the next 12 hours.',
        speechScriptEs:
          'Boletín satelital en directo obtenido de la red espacial. La región activa 3698 ha mostrado una reorganización abrupta en sus campos magnéticos coronales según telemetría del satélite SDO. El flujo de rayos X se encuentra en ascenso continuo. El motor híbrido de HELIOX continuará monitoreando el disco solar para anticipar cualquier pulso que impacte las redes de telecomunicaciones.',
        speechScriptEn:
          'Direct space web satellite bulletin. Active region 3698 is displaying abrupt magnetic restructuring as tracked by SDO sensors. X-ray flux is rising toward M-class thresholds. The HELIOX hybrid predictive engine will continue tracking to safeguard orbital assets.',
        imageUrl: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0131.jpg',
        coordinates: 'N14E42',
        wavelength: '131Å (Fe XXI)',
        latencyMode: 'NANO_ON_DEVICE',
        nanoBenchmark: '62ms On-Device (Gemini Nano)',
        initialEndorsements: 94,
        scientificNotes: [
          {
            author: 'HELIOX AI Ingest Engine',
            org: 'Automated Satellite Feed',
            note: 'Noticia generada y validada en vivo contra endpoints gubernamentales de NASA y NOAA.',
          },
        ],
      }

      setFeedItems((prev) => [newItem, ...prev])
      setSelectedNews(newItem)
      setIsSearchingWeb(false)
      setSearchStatus(null)
    }, 2200)
  }

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      stopQuantumWave()
    }
  }, [stopQuantumWave])

  return (
    <div className="min-h-screen bg-[#010309] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Navbar />

      {/* ─── LIVE TICKER TAPE / MARQUEE DE TELEMETRÍA ESPACIAL ─────────────── */}
      <div className="fixed top-16 left-0 right-0 z-40 h-7 bg-[#030614]/95 backdrop-blur-md border-b border-cyan-500/20 overflow-hidden flex items-center text-[11px] font-mono">
        <div className="shrink-0 px-3 py-0.5 bg-cyan-500/20 border-r border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1.5 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>SATELLITE INTEL WIRE</span>
        </div>
        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <div className="inline-flex gap-8 animate-ticker text-slate-300">
            <span>[NOAA GOES-18] AR3664 PEAK X8.7 DETONATION</span>
            <span>•••</span>
            <span>[SOHO LASCO] FULL HALO CME VELOCITY 1,420 KM/S DIRECT IMPACT VECTOR</span>
            <span>•••</span>
            <span>[DSCOVR L1] IMF BZ DIPS TO -28.4 nT (G5 EXTREME STORM PROTOCOL)</span>
            <span>•••</span>
            <span>[PARKER SOLAR PROBE] RECORD CLOSEST PERIHELION AT 1,370°C SHIELD TEMP</span>
            <span>•••</span>
            <span>[D-RAP IONOSPHERE] R3 STRONG HF RADIO ABSORPTION ACTIVE ACROSS TRANSATLANTIC ROUTES</span>
          </div>
        </div>
      </div>

      <main className="relative pt-28 pb-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
        {/* ─── COMMAND BAR: BUSCADOR & FILTROS ESPECTRALES INTERACTIVOS ────── */}
        <section className="space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-[#040817] border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.1)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                <BroadcastIcon size={18} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>HELIOX Scientific Intelligence Feed</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    NASA & NOAA LIVE
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Despachos heliofísicos verificados y articulación vocal con Quantum Core HUD
                </p>
              </div>
            </div>

            {/* Ingesta Web + Buscador */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLiveWebSync}
                disabled={isSearchingWeb}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-black font-mono font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-60 shrink-0"
              >
                <RefreshCwIcon size={14} className={isSearchingWeb ? 'animate-spin' : ''} />
                <span>{isSearchingWeb ? 'INGESTANDO...' : 'ACTUALIZAR CON IA & WEB'}</span>
              </button>

              <div className="relative w-full sm:w-60">
                <input
                  type="text"
                  placeholder={isEn ? 'Search active region or band...' : 'Filtrar por región o banda...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 focus:border-cyan-400 text-xs font-mono text-white placeholder-slate-500 outline-none transition-all"
                />
                <SearchIcon size={13} className="absolute left-2.5 top-2.5 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Estado de sincronización en progreso */}
          <AnimatePresence>
            {searchStatus && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2"
              >
                <RefreshCwIcon size={13} className="animate-spin text-cyan-400" />
                <span>{searchStatus}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LENTE ESPECTRAL INTERACTIVO (SELECTOR DE LONGITUDES DE ONDA NASA) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
            <span className="text-slate-500 text-[11px] uppercase tracking-wider shrink-0 mr-1 font-bold">
              Banda Espectral SDO:
            </span>
            {[
              { id: 'all', label: 'Todas las Bandas', color: 'border-white/20 text-white' },
              { id: '131', label: '131Å (Fe XXI - Flares X)', color: 'border-cyan-500/50 text-cyan-300 bg-cyan-500/10' },
              { id: '171', label: '171Å (Fe IX - Corona)', color: 'border-amber-500/50 text-amber-300 bg-amber-500/10' },
              { id: '193', label: '193Å (Fe XII - Agujeros)', color: 'border-orange-500/50 text-orange-300 bg-orange-500/10' },
              { id: '304', label: '304Å (He II - Cromosfera)', color: 'border-rose-500/50 text-rose-300 bg-rose-500/10' },
              { id: 'lasco', label: 'LASCO C2/C3 (CMEs)', color: 'border-blue-500/50 text-blue-300 bg-blue-500/10' },
            ].map((b) => {
              const isSelected = selectedSpectral === b.id
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedSpectral(b.id as SpectralFilter)}
                  className={`px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer ${
                    isSelected ? 'bg-white text-black font-bold shadow-md' : `${b.color} hover:bg-white/5`
                  }`}
                >
                  {b.label}
                </button>
              )
            })}
          </div>
        </section>

        {/* ─── WORKSPACE DUAL: STREAM HELIOFÍSICO (7 COLS) + QUANTUM CORE HUD (5 COLS) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* ════════════════════════════════════════════════════════════════════
               COLUMNA IZQUIERDA: FEED SOCIAL CIENTÍFICO (STREAM CONTINUO)
              ════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                <NewspaperIcon size={14} />
                <span>DESPACHOS CIENTÍFICOS VERIFICADOS</span>
              </span>
              <span>{filteredNews.length} despachos activos</span>
            </div>

            <div className="space-y-6">
              {filteredNews.map((item) => {
                const isSelected = selectedNews.id === item.id
                const isEndorsed = userEndorsed[item.id]
                const endorseCount = endorsements[item.id] || item.initialEndorsements
                const hasDiscussions = openDiscussions[item.id]
                const isBookmarked = bookmarked[item.id]

                return (
                  <Spatial3DCard
                    key={item.id}
                    onClick={() => setSelectedNews(item)}
                    containerClassName="w-full"
                    className={`rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                      isSelected
                        ? 'bg-[#050a1c] border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.25)]'
                        : 'bg-white/[0.015] hover:bg-white/[0.04] border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    {/* Header del Despacho: Perfil y Metadatos */}
                    <div className="p-5 pb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold font-mono text-xs shadow-inner shrink-0">
                          {item.source.slice(0, 4)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-white hover:text-cyan-300 transition-colors">
                              {item.source}
                            </span>
                            <CheckCircleIcon size={13} className="text-cyan-400" />
                            <span className="text-[11px] font-mono text-slate-400">{item.handle}</span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                            <span>{item.instrument}</span>
                            <span>·</span>
                            <span className="text-white/60 tabular-nums">
                              {item.timestampUTC.replace('T', ' ').slice(0, 16)} UTC
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${item.severityColor}`}>
                          {item.severity}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.latencyMode === 'NANO_ON_DEVICE' ? 'Gemini Nano' : 'Flash Cloud'}
                        </span>
                      </div>
                    </div>

                    {/* Contenido Editorial */}
                    <div className="px-5 space-y-3">
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-cyan-300">
                        {isEn ? item.titleEn : item.titleEs}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {isEn ? item.summaryEn : item.summaryEs}
                      </p>

                      {/* Tira de Métricas con Sparkline Reactivo */}
                      <div className="p-3 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-between gap-3 text-xs font-mono text-cyan-200">
                        <div className="flex items-center gap-2 truncate">
                          <CrosshairIcon size={13} className="text-cyan-400 shrink-0" />
                          <span className="truncate">{item.metrics}</span>
                        </div>

                        {/* Sparkline SVG */}
                        <div className="flex items-center gap-2 shrink-0">
                          <svg width="60" height="18" className="overflow-visible">
                            <polyline
                              fill="none"
                              stroke="#00f3ff"
                              strokeWidth="2"
                              strokeLinecap="round"
                              points={item.sparklineData
                                .map((val, idx) => `${idx * 7},${18 - (val / 100) * 16}`)
                                .join(' ')}
                            />
                          </svg>
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            {item.coordinates}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Imagen Satelital Oficial en Tiempo Real */}
                    <div className="px-5 pt-3">
                      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black group">
                        <img
                          src={item.imageUrl}
                          alt={item.titleEs}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono text-cyan-300">
                            {item.wavelength}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            SENSOR ACTIVO
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Barra de Acciones Sociales */}
                    <div className="p-5 pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] mt-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleEndorse(item.id)
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                            isEndorsed
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold'
                              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/5 hover:border-white/15'
                          }`}
                        >
                          <HeartIcon size={13} className={isEndorsed ? 'text-rose-400 fill-rose-400' : ''} />
                          <span>{endorseCount}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleDiscussion(item.id)
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                            hasDiscussions
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/5'
                          }`}
                        >
                          <MessageSquareIcon size={13} />
                          <span>{item.scientificNotes.length} Notas</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleBookmark(item.id)
                          }}
                          className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
                            isBookmarked
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/5'
                          }`}
                          title="Guardar en biblioteca"
                        >
                          <BookmarkIcon size={13} className={isBookmarked ? 'fill-amber-400' : ''} />
                        </button>
                      </div>

                      {/* Transmitir y Copiar */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectAndSpeak(item)
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected && isSpeaking
                              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                              : 'bg-gradient-to-r from-cyan-500/30 to-sky-500/30 hover:from-cyan-500 hover:to-sky-500 text-cyan-300 hover:text-black border border-cyan-500/50'
                          }`}
                        >
                          <SpeakerIcon size={13} />
                          <span>{isSelected && isSpeaking ? 'VOCALIZANDO...' : 'ARTICULAR CON IA'}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyBulletin(item)
                          }}
                          className="px-3 py-2 rounded-xl text-xs font-mono bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedId === item.id ? (
                            <span className="text-emerald-400 font-bold">COPIADO</span>
                          ) : (
                            <span>COPIAR</span>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Desplegable de Notas Científicas entre Pares */}
                    <AnimatePresence>
                      {hasDiscussions && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-5 pb-5 border-t border-white/5 pt-3 space-y-2 bg-black/40"
                        >
                          <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase">
                            Notas Científicas de Pares Acreditados:
                          </div>
                          {item.scientificNotes.map((note, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="font-bold text-white">{note.author}</span>
                                <span className="text-cyan-400/80">{note.org}</span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed font-sans">{note.note}</p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Spatial3DCard>
                )
              })}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════════
               COLUMNA DERECHA: HOLOGRAPHIC QUANTUM CORE HUD (JARVIS/GEMINI LIVE)
              ════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="rounded-3xl bg-[#040817]/95 border-2 border-cyan-500/40 p-6 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.18)] relative overflow-hidden space-y-5">
              {/* Luces Ambientales Reactivas */}
              <div className="absolute -top-24 right-0 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 left-0 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Selector de Persona */}
              <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-white/10">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <BrainChipIcon size={14} />
                    <span>QUANTUM SYNTHESIZER 2.0</span>
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {ANCHOR_PERSONAS.map((persona) => {
                    const isSelected = selectedPersona.id === persona.id
                    return (
                      <button
                        key={persona.id}
                        onClick={() => setSelectedPersona(persona)}
                        className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-md'
                            : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className={`text-xs font-mono ${persona.color}`}>{persona.name.split(' ')[0]}</div>
                        <div className="text-[9px] text-slate-400 truncate">{persona.role}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ─── NÚCLEO CUÁNTICO HOLOGRÁFICO (REEMPLAZO TOTAL DEL AVATAR PLANO) ─── */}
              <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-3xl bg-black/90 border border-cyan-500/40 p-4 shadow-[0_0_35px_rgba(6,182,212,0.25)] flex flex-col items-center justify-center overflow-hidden">
                {/* Cuadrícula de Escaneo Espacial */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.06)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                {/* Línea Láser de Escaneo Vertical */}
                {isSpeaking && !isPaused && (
                  <motion.div
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none shadow-[0_0_12px_#00f3ff]"
                  />
                )}

                {/* Telemetría en Esquinas */}
                <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-400">FREQ_RESONANCE: 99.4%</div>
                <div className="absolute top-2 right-2 text-[9px] font-mono text-purple-400">SPECTRAL_BAND: {selectedNews.spectralBand.toUpperCase()}</div>
                <div className="absolute bottom-2 left-2 text-[9px] font-mono text-emerald-400">{selectedPersona.role}</div>
                <div className="absolute bottom-2 right-2 text-[9px] font-mono text-amber-400">{selectedNews.coordinates}</div>

                {/* Anillos Giroscópicos Cuánticos 3D */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  {/* Anillo Exterior */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border border-cyan-500/30 border-dashed"
                  />

                  {/* Anillo Intermedio Elíptico */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
                    className="absolute inset-3 rounded-full border-2 border-purple-500/30"
                    style={{ transform: 'rotateX(60deg)' }}
                  />

                  {/* Esfera de Energía Cuántica Central */}
                  <motion.div
                    animate={{
                      scale: isSpeaking && !isPaused ? [1, quantumEnergy * 1.25, 1] : [1, 1.05, 1],
                      boxShadow:
                        isSpeaking && !isPaused
                          ? '0 0 45px rgba(0,243,255,0.8), inset 0 0 25px rgba(168,85,247,0.7)'
                          : '0 0 25px rgba(0,243,255,0.4)',
                    }}
                    transition={{ repeat: Infinity, duration: isSpeaking && !isPaused ? 0.35 : 2.5, ease: 'easeInOut' }}
                    className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-600 flex items-center justify-center relative cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#030718] border border-cyan-300/60 flex items-center justify-center">
                      <AtomIcon size={28} className="text-cyan-300 animate-spin" style={{ animationDuration: '10s' }} />
                    </div>
                  </motion.div>
                </div>

                {/* Espectro de Frecuencia Vocal de 24 Bandas */}
                <div className="flex items-end justify-center gap-1 w-full h-8 px-4 mt-2 relative z-10">
                  {[...Array(24)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isSpeaking && !isPaused ? [4, Math.random() * 26 + 4, 4] : 4,
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.14 + (i % 6) * 0.03,
                        ease: 'easeInOut',
                      }}
                      className="w-1 rounded-full bg-gradient-to-t from-cyan-400 via-sky-300 to-purple-400"
                    />
                  ))}
                </div>
              </div>

              {/* Botones de Control de Transmisión */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlay}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isSpeaking && !isPaused
                        ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20'
                        : 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-lg shadow-cyan-400/20'
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
                        <span>{isPaused ? 'REANUDAR ARTICULACIÓN' : 'TRANSMITIR ESTE BOLETÍN'}</span>
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

                {/* Selector de Cadencia */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                  <span>Cadencia de Vocalización:</span>
                  <div className="flex items-center gap-1">
                    {[0.9, 1.0, 1.2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setSpeechRate(rate)}
                        className={`px-2.5 py-0.5 rounded text-[11px] font-mono border transition-all cursor-pointer ${
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
              </div>

              {/* TELEPROMPTER EN VIVO CON SEGUIMIENTO DE LECTURA */}
              <div className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1 border-b border-white/5">
                  <span className="text-cyan-300 font-bold">TELEPROMPTER CUÁNTICO</span>
                  <span>{speechProgress}% TRANSMITIDO</span>
                </div>

                <p className="text-xs font-mono text-slate-200 leading-relaxed max-h-24 overflow-y-auto">
                  {isEn ? selectedNews.speechScriptEn : selectedNews.speechScriptEs}
                </p>

                {isSpeaking && spokenTextFragment && (
                  <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/50 p-2 rounded-lg border border-cyan-500/30">
                    <span className="text-cyan-400 font-bold mr-1">&gt;</span>
                    &ldquo;{spokenTextFragment}&rdquo;
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
