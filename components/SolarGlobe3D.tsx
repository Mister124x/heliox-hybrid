'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../lib/i18n'
import { ResetIcon, PauseIcon, PlayIcon, DragHandIcon, TargetCrosshairIcon } from './ui/Icons'

interface Hotspot {
  id: string
  lat: number // -90 to 90
  lon: number // -180 to 180
  name: string
  type: 'AR' | 'CME' | 'FLARE' | 'CORONAL_HOLE'
  intensity: string
  description: string
}

const LIVE_HOTSPOTS: Hotspot[] = [
  { id: 'ar-3664', lat: 18, lon: -25, name: 'Región Activa AR3664', type: 'FLARE', intensity: 'X8.7 / Beta-Gamma-Delta', description: 'Complejo dipolar magnético supergigante causante de tormentas G5.' },
  { id: 'ar-3685', lat: -15, lon: 45, name: 'Región Activa AR3685', type: 'AR', intensity: 'M4.2 Flare Risk', description: 'Mancha solar en rápida rotación con fuerte torsión de líneas de campo.' },
  { id: 'ch-98', lat: -45, lon: -80, name: 'Agujero Coronal CH-98', type: 'CORONAL_HOLE', intensity: 'Viento 650 km/s', description: 'Líneas de campo magnético abiertas emitiendo flujo de plasma rápido.' },
  { id: 'prom-12', lat: 60, lon: 110, name: 'Prominencia Polar Norte', type: 'CME', intensity: 'Eyección Filamentosa', description: 'Arco de plasma suspendido a 80,000 km sobre la cromosfera.' },
]

export default function SolarGlobe3D() {
  const { lang } = useI18n()
  const isEn = lang === 'en'
  const isPt = lang === 'pt'

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rotationRef = useRef({ x: 15, y: 35 })
  const rotBadgeRef = useRef<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [autoRotate, setAutoRotate] = useState(true)
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(LIVE_HOTSPOTS[0])
  const [spectralMode, setSpectralMode] = useState<'304' | '171' | '193' | 'mag'>('304')
  const [zoom, setZoom] = useState(1)

  // Paleta de colores según espectro
  const colorThemes = {
    '304': { primary: '#f97316', secondary: '#dc2626', glow: '#ea580c', label: '304Å Cromosfera (He II)', temp: '50,000 K' },
    '171': { primary: '#38bdf8', secondary: '#1d4ed8', glow: '#0284c7', label: '171Å Corona Baja (Fe IX)', temp: '1,000,000 K' },
    '193': { primary: '#22c55e', secondary: '#15803d', glow: '#16a34a', label: '193Å Agujeros Coronales (Fe XII)', temp: '1,600,000 K' },
    'mag': { primary: '#a3a3a3', secondary: '#262626', glow: '#525252', label: 'HMI Magnetograma Magnético', temp: 'Fotosfera 6,000 K' },
  }
  const currentTheme = colorThemes[spectralMode]

  // Renderizado del Globo 3D en Canvas
  const drawGlobe = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.38 * zoom

    ctx.clearRect(0, 0, width, height)

    // 1. Resplandor / Corona Solar Exterior (Glow)
    const coronaGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.5)
    coronaGrad.addColorStop(0, `${currentTheme.glow}99`)
    coronaGrad.addColorStop(0.5, `${currentTheme.glow}33`)
    coronaGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = coronaGrad
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2)
    ctx.fill()

    // 2. Disco Solar 3D con Gradiente Esférico
    const sphereGrad = ctx.createRadialGradient(
      centerX - radius * 0.3,
      centerY - radius * 0.3,
      radius * 0.1,
      centerX,
      centerY,
      radius
    )
    sphereGrad.addColorStop(0, '#ffffff')
    sphereGrad.addColorStop(0.2, currentTheme.primary)
    sphereGrad.addColorStop(0.7, currentTheme.secondary)
    sphereGrad.addColorStop(1, '#050508')

    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.clip()

    ctx.fillStyle = sphereGrad
    ctx.fillRect(0, 0, width, height)

    // 3. Líneas de Granulación Solar y Campo Magnético Rotativo
    const rot = rotationRef.current
    const rotRadY = (rot.y * Math.PI) / 180
    const rotRadX = (rot.x * Math.PI) / 180

    ctx.strokeStyle = `${currentTheme.primary}40`
    ctx.lineWidth = 1.5

    // Paralelos de latitud (con radios garantizados positivos para evitar excepciones DOM de Canvas)
    for (let lat = -60; lat <= 60; lat += 30) {
      const latRad = (lat * Math.PI) / 180
      const rLat = Math.max(0.1, Math.abs(radius * Math.cos(latRad)))
      const yLat = centerY - radius * Math.sin(latRad) * Math.cos(rotRadX)
      const rY = Math.max(0.1, Math.abs(rLat * Math.sin(rotRadX) * 0.4 + 1))

      ctx.beginPath()
      ctx.ellipse(centerX, yLat, rLat, rY, 0, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Meridianos de longitud rotatorios (con radios absolutos y normalización angular)
    for (let lon = 0; lon < 360; lon += 45) {
      const lonRad = ((lon + rot.y) * Math.PI) / 180
      const xOffset = Math.sin(lonRad) * radius * Math.cos(rotRadX * 0.3)
      const rX = Math.max(0.1, Math.abs(xOffset) * 0.5)
      const rY = Math.max(0.1, radius)

      ctx.beginPath()
      ctx.ellipse(centerX + xOffset * 0.5, centerY, rX, rY, 0, 0, Math.PI * 2)
      ctx.stroke()
    }

    // 4. Manchas Solares y Filamentos Activos
    const time = Date.now() * 0.002
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI) / 8 + rotRadY
      const dist = (0.3 + (i % 3) * 0.2) * radius
      const spotX = centerX + Math.cos(angle) * dist
      const spotY = centerY + Math.sin(angle) * dist * 0.5 + Math.sin(time + i) * 3

      // Solo dibujar en el hemisferio frontal visible
      if (Math.sin(angle) > -0.2) {
        ctx.fillStyle = spectralMode === 'mag' ? (i % 2 === 0 ? '#ffffff' : '#000000') : '#1c0500'
        ctx.beginPath()
        ctx.arc(spotX, spotY, Math.max(0.5, 3 + (i % 4)), 0, Math.PI * 2)
        ctx.fill()

        // Bucle de plasma / llamarada
        if (i % 3 === 0) {
          ctx.strokeStyle = `${currentTheme.primary}aa`
          ctx.lineWidth = 2
          ctx.beginPath()
          const flareRadius = Math.max(0.5, 8 + Math.sin(time * 2 + i) * 4)
          ctx.arc(spotX, spotY, flareRadius, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
    }

    ctx.restore()

    // 5. Hotspots Interactivos Proyectados
    LIVE_HOTSPOTS.forEach((spot) => {
      const latRad = (spot.lat * Math.PI) / 180
      const lonRad = ((spot.lon + rot.y) * Math.PI) / 180

      // Coordenadas 3D a 2D en esfera
      const z = Math.cos(latRad) * Math.cos(lonRad)
      if (z > 0) {
        // En cara visible
        const x = centerX + radius * Math.cos(latRad) * Math.sin(lonRad)
        const y = centerY - radius * Math.sin(latRad) * Math.cos(rotRadX)

        const isSelected = selectedHotspot?.id === spot.id

        // Pulso animado
        ctx.fillStyle = isSelected ? '#fbbf24' : '#ef4444'
        ctx.beginPath()
        ctx.arc(x, y, isSelected ? 6 : 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(x, y, isSelected ? 10 : 7, 0, Math.PI * 2)
        ctx.stroke()

        // Etiqueta
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 10px monospace'
        ctx.fillText(spot.name.split(' ')[0] + ' ' + (spot.name.split(' ')[1] || ''), x + 12, y + 3)
      }
    })
  }, [spectralMode, zoom, selectedHotspot, currentTheme])

  const updateBadge = useCallback((y: number, x: number) => {
    if (rotBadgeRef.current) {
      rotBadgeRef.current.textContent = `Rotación: ${y.toFixed(0)}° Y · ${x.toFixed(0)}° X`
    }
  }, [])

  // Loop de animación y auto-rotación suave (usando ref para evitar re-renders infinitos)
  useEffect(() => {
    let animationFrameId: number
    const render = () => {
      if (autoRotate && !isDragging) {
        rotationRef.current.y = (rotationRef.current.y + 0.3) % 360
        updateBadge(rotationRef.current.y, rotationRef.current.x)
      }
      drawGlobe()
      animationFrameId = requestAnimationFrame(render)
    }
    animationFrameId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animationFrameId)
  }, [autoRotate, isDragging, drawGlobe, updateBadge])

  // Manejo de Interacción Mouse & Touch Drag (0 setState en movimiento continuo)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setAutoRotate(false)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    rotationRef.current = {
      x: Math.max(-45, Math.min(45, rotationRef.current.x - dy * 0.3)),
      y: (rotationRef.current.y + dx * 0.4) % 360,
    }
    setDragStart({ x: e.clientX, y: e.clientY })
    updateBadge(rotationRef.current.y, rotationRef.current.x)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      setAutoRotate(false)
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    const dx = e.touches[0].clientX - dragStart.x
    const dy = e.touches[0].clientY - dragStart.y
    rotationRef.current = {
      x: Math.max(-45, Math.min(45, rotationRef.current.x - dy * 0.3)),
      y: (rotationRef.current.y + dx * 0.4) % 360,
    }
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    updateBadge(rotationRef.current.y, rotationRef.current.x)
  }

  // Reset de rotación y zoom a estado inicial
  const handleResetView = () => {
    rotationRef.current = { x: 15, y: 35 }
    updateBadge(15, 35)
    setZoom(1.0)
    setSelectedHotspot(LIVE_HOTSPOTS[0])
    setAutoRotate(true)
  }

  // Centrar el globo en el hotspot seleccionado
  const handleSelectHotspot = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot)
    setAutoRotate(false)
    const newY = ((360 - hotspot.lon) % 360 + 360) % 360
    const newX = Math.max(-45, Math.min(45, -hotspot.lat * 0.4))
    rotationRef.current = { x: newX, y: newY }
    updateBadge(newY, newX)
  }

  return (
    <div className="rounded-3xl p-6 bg-black border border-white/10 relative overflow-hidden space-y-4 shadow-2xl">
      {/* Barra superior de control 3D */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-orange-400">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>3D INTERACTIVE HELIO-SPHERE</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
            {isEn ? 'Interactive 3D Solar Model & Active Region Locator' : 'Modelo Solar 3D Interactivo y Localizador de Regiones'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Controles de Zoom (- / +) */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.1).toFixed(1))))}
              className="px-2.5 py-1 hover:bg-white/10 active:scale-90 rounded text-white font-bold transition-all"
              title="Alejar (Zoom -)"
              aria-label="Alejar zoom"
            >
              −
            </button>
            <span className="px-2 text-white/70 font-semibold min-w-[45px] text-center">
              {(zoom * 100).toFixed(0)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.4, Number((z + 0.1).toFixed(1))))}
              className="px-2.5 py-1 hover:bg-white/10 active:scale-90 rounded text-white font-bold transition-all"
              title="Acercar (Zoom +)"
              aria-label="Acercar zoom"
            >
              +
            </button>
          </div>

          {/* Botón de Reset de Vista */}
          <button
            onClick={handleResetView}
            className="px-3 py-1.5 rounded-xl text-xs font-mono border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 text-white/80 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Restablecer orientación y zoom original"
          >
            <ResetIcon size={13} className="text-cyan-400" />
            <span>{isEn ? 'Reset View' : 'Restablecer'}</span>
          </button>

          {/* Botón de Auto-rotación (Play/Pausa) */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
              autoRotate
                ? 'bg-orange-500 text-black border-orange-400 font-bold shadow-lg shadow-orange-500/25'
                : 'bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10'
            }`}
            title={autoRotate ? 'Pausar auto-rotación' : 'Activar auto-rotación'}
          >
            {autoRotate ? <PauseIcon size={12} /> : <PlayIcon size={12} />}
            <span>{autoRotate ? (isEn ? 'Pause' : 'Pausar') : (isEn ? 'Auto-Rotate' : 'Auto-Rotar')}</span>
          </button>
        </div>
      </div>

      {/* Selector de Modo Espectral (AIA 304, AIA 171, AIA 193, HMI MAG) */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { mode: '304', label: 'AIA 304', sub: 'Cromosfera', color: '#f97316' },
            { mode: '171', label: 'AIA 171', sub: 'Corona Baja', color: '#38bdf8' },
            { mode: '193', label: 'AIA 193', sub: 'Agujeros', color: '#22c55e' },
            { mode: 'mag', label: 'HMI MAG', sub: 'Campo Mag.', color: '#a3a3a3' },
          ] as const
        ).map(({ mode, label, sub, color }) => {
          const isSelected = spectralMode === mode
          return (
            <button
              key={mode}
              onClick={() => setSpectralMode(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
                isSelected
                  ? 'bg-white text-black border-white shadow-lg'
                  : 'bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span>{label}</span>
              <span className="text-[10px] opacity-70 hidden sm:inline font-normal">({sub})</span>
            </button>
          )
        })}
      </div>

      {/* Canvas 3D Interactivo con Drag & Touch */}
      <div className="relative aspect-square sm:aspect-[16/10] w-full bg-black/60 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          className="w-full h-full object-contain"
        />

        {/* Overlay de Guía Interpolar */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-mono text-white/70 flex items-center gap-2">
          <DragHandIcon size={13} className="text-cyan-400" />
          <span>Arrastra con el ratón o el dedo para girar el Sol en 360°</span>
        </div>

        <div
          ref={rotBadgeRef}
          suppressHydrationWarning
          className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-mono text-orange-400"
        >
          Rotación: 35° Y · 15° X
        </div>
      </div>

      {/* Panel Informativo de Hotspot Seleccionado */}
      <div className="grid sm:grid-cols-4 gap-2 pt-2">
        {LIVE_HOTSPOTS.map((hotspot) => (
          <button
            key={hotspot.id}
            onClick={() => handleSelectHotspot(hotspot)}
            className={`p-3 rounded-2xl text-left border transition-all active:scale-95 cursor-pointer ${
              selectedHotspot?.id === hotspot.id
                ? 'bg-orange-500/15 border-orange-500/60 shadow-lg shadow-orange-500/10'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white truncate">{hotspot.name}</span>
              <span className="text-[10px] font-mono text-orange-400 font-bold">{hotspot.type}</span>
            </div>
            <div className="text-[11px] text-white/50 font-mono">{hotspot.intensity}</div>
          </button>
        ))}
      </div>

      {selectedHotspot && (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
          <div className="font-bold text-orange-300 flex items-center gap-2">
            <TargetCrosshairIcon size={14} className="text-orange-400 shrink-0" />
            <span>{selectedHotspot.name} — Coordenadas Heliofísicas: {selectedHotspot.lat}° Lat, {selectedHotspot.lon}° Lon</span>
          </div>
          <p className="text-white/70 leading-relaxed">{selectedHotspot.description}</p>
        </div>
      )}
    </div>
  )
}
