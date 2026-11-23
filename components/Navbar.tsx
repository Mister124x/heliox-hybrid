'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useI18n, LanguageSelector } from '../lib/i18n'
import {
  OrbitIcon,
  SatelliteIcon,
  FlareIcon,
  MediaIcon,
  BrainChipIcon,
  SunIcon,
  SparklesIcon,
  GlobeGridIcon,
  CrosshairIcon,
  RadioTowerIcon,
  WaveIcon,
  FlameIcon,
  ResetIcon,
} from './ui/Icons'

interface NavbarProps {
  countdown?: number
  refreshing?: boolean
  onRefresh?: () => void
  isStormy?: boolean
}

const NAV_ITEMS = [
  { href: '/',          labelEs: 'Inicio',      labelEn: 'Home',        icon: OrbitIcon,      color: 'text-cyan-400' },
  { href: '/dashboard', labelEs: 'Dashboard',   labelEn: 'Dashboard',   icon: SatelliteIcon,  color: 'text-blue-400' },
  { href: '/storms',    labelEs: 'Tormentas',   labelEn: 'Storms',      icon: FlareIcon,      color: 'text-amber-400' },
  { href: '/reels',     labelEs: 'Media 4K',    labelEn: 'Media 4K',    icon: MediaIcon,      color: 'text-purple-400' },
  { href: '/analysis',  labelEs: 'Análisis IA', labelEn: 'AI Analysis', icon: BrainChipIcon,  color: 'text-emerald-400' },
]

/* ─── Google 3x3 Apps Grid (Waffle Icon) ────────────────────────── */
function WaffleIcon() {
  return (
    <svg focusable="false" viewBox="0 0 24 24" width="20" height="20" className="transition-transform group-hover:scale-110">
      <path
        fill="currentColor"
        d="M6 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM6 14c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM6 20c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
      />
    </svg>
  )
}

/* ─── Apps satelitales y científicas del Waffle ──────────────────── */
const GOOGLE_APPS = [
  { label: 'Firebase', href: 'https://console.firebase.google.com', icon: FlameIcon, color: 'text-amber-500' },
  { label: 'AI Studio', href: 'https://aistudio.google.com', icon: SparklesIcon, color: 'text-blue-400' },
  { label: 'NASA SDO', href: 'https://sdo.gsfc.nasa.gov', icon: SunIcon, color: 'text-orange-400' },
  { label: 'NOAA SWPC', href: 'https://www.swpc.noaa.gov', icon: GlobeGridIcon, color: 'text-emerald-400' },
  { label: 'NASA DONKI', href: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/', icon: SatelliteIcon, color: 'text-cyan-400' },
  { label: 'SOHO LASCO', href: 'https://soho.nascom.nasa.gov', icon: CrosshairIcon, color: 'text-indigo-400' },
  { label: 'Dashboard', href: '/dashboard', icon: RadioTowerIcon, color: 'text-sky-400' },
  { label: 'Tormentas', href: '/storms', icon: WaveIcon, color: 'text-red-400' },
  { label: 'Análisis IA', href: '/analysis', icon: BrainChipIcon, color: 'text-purple-400' },
]

export default function Navbar({
  countdown,
  refreshing,
  onRefresh,
  isStormy = false,
}: NavbarProps) {
  const { lang } = useI18n()
  const pathname = usePathname()
  const router = useRouter()
  const isEn = lang === 'en'

  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [waffleOpen, setWaffleOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [spinning, setSpinning] = useState(false)

  // Hydration safety: ensure client-side mounts cleanly
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setWaffleOpen(false)
  }, [pathname])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
      return
    }
    setSpinning(true)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('heliox-refresh'))
    }
    router.refresh()
    setTimeout(() => setSpinning(false), 1200)
  }

  const isSpinning = refreshing || spinning

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0d122e]/92 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-black/60'
          : 'bg-[#0a0e26]/85 backdrop-blur-xl border-b border-white/15'
      }`}
    >
      {/* Sutil línea de brillo blanco superior estilo Google / Antigravity */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between gap-3">

        {/* ── LOGO GOOGLE + HELIOX A LA IZQUIERDA ─────────────────────── */}
        <Link href="/" prefetch={true} className="flex items-center gap-2.5 group select-none shrink-0 cursor-pointer">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/30 bg-white/10 p-0.5 group-hover:border-white/70 group-hover:scale-105 transition-all duration-200 shadow-md shadow-white/10">
            <img src="/favicon.svg" alt="HELIOX" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[20px] font-black tracking-tight select-none">
              <span style={{ color: '#4285F4' }}>H</span>
              <span style={{ color: '#EA4335' }}>E</span>
              <span style={{ color: '#FBBC05' }}>L</span>
              <span style={{ color: '#4285F4' }}>I</span>
              <span style={{ color: '#34A853' }}>O</span>
              <span style={{ color: '#EA4335' }}>X</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-white/60 uppercase group-hover:text-white transition-colors">
              Observatory
            </span>
          </div>
        </Link>

        {/* ── NAVEGACIÓN CENTRAL: CÁPSULA BLANCA MODERNA (Google Style) ─ */}
        <nav
          aria-label="Main Navigation"
          className="flex items-center gap-1 bg-white/10 border border-white/20 p-1 sm:p-1.5 rounded-full backdrop-blur-md shadow-md overflow-x-auto max-w-[calc(100vw-180px)] sm:max-w-none no-scrollbar shrink"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
            const label = mounted ? (isEn ? item.labelEn : item.labelEs) : item.labelEs
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={() => {
                  setWaffleOpen(false)
                  setMobileOpen(false)
                }}
                className={`relative px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[12px] sm:text-[13px] font-bold transition-all duration-200 flex items-center gap-1.5 sm:gap-2 select-none cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-lg shadow-white/30 scale-[1.02]'
                    : 'text-slate-200 hover:text-white hover:bg-white/15'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-slate-950' : item.color} />
                <span suppressHydrationWarning>{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* ── ACCIONES DERECHA: Idioma, Botón LIVE, Waffle ───────────── */}
        <div className="hidden md:flex items-center gap-2 shrink-0">

          {/* Selector de idioma estilizado */}
          <div className="text-white">
            <LanguageSelector />
          </div>

          {/* Botón de Telemetría EN VIVO con estética Google */}
          <button
            onClick={handleRefresh}
            title={mounted && isEn ? 'Refresh satellite telemetry' : 'Actualizar telemetría satelital'}
            className={`flex items-center gap-2 h-9 px-4 rounded-full text-[13px] font-bold transition-all duration-200 cursor-pointer ${
              isStormy
                ? 'bg-[#EA4335] hover:bg-[#D33828] text-white shadow-lg shadow-red-600/30 border border-red-400/40'
                : 'bg-white text-black hover:bg-zinc-100 shadow-md shadow-white/20 border border-white/60 active:scale-95'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isStormy ? 'bg-white animate-ping' : 'bg-emerald-500 animate-pulse'
              }`}
            />
            <span suppressHydrationWarning>
              {isStormy
                ? (mounted && isEn ? 'ALERT' : 'ALERTA')
                : (mounted && isEn ? 'LIVE' : 'EN VIVO')}
            </span>
            {typeof countdown === 'number' && (
              <span
                suppressHydrationWarning
                className={`text-[11px] font-mono ${isStormy ? 'text-white/80' : 'text-zinc-600'} ${
                  isSpinning ? 'animate-spin' : ''
                }`}
              >
                {countdown}s
              </span>
            )}
          </button>

          {/* Google Apps 3x3 Waffle Grid ───────────────────────────────── */}
          <div className="relative">
            <button
              onClick={() => setWaffleOpen(!waffleOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.10] border border-transparent hover:border-white/10 transition-all cursor-pointer group"
              aria-label="Google Apps & Observatorios"
            >
              <WaffleIcon />
            </button>

            <AnimatePresence>
              {waffleOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setWaffleOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-[290px] bg-[#0c0c16]/95 backdrop-blur-2xl border border-white/[0.15] rounded-2xl shadow-2xl shadow-black/80 z-50 p-3.5 overflow-hidden"
                  >
                    <div className="px-2 pb-2 mb-1.5 border-b border-white/[0.10] flex items-center justify-between">
                      <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">Ecosistema HELIOX</span>
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">Google Cloud</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {GOOGLE_APPS.map((app) => {
                        const AppIcon = app.icon
                        return (
                          <a
                            key={app.label}
                            href={app.href}
                            target={app.href.startsWith('http') ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            onClick={() => setWaffleOpen(false)}
                            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl hover:bg-white/[0.10] border border-transparent hover:border-white/10 transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-white/20 transition-all">
                              <AppIcon size={18} className={app.color} />
                            </div>
                            <span className="text-[11px] text-white/70 group-hover:text-white font-medium text-center leading-tight">
                              {app.label}
                            </span>
                          </a>
                        )
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── CONTROLES MÓVIL ────────────────────────────────────────── */}
        <div className="flex md:hidden items-center gap-1.5 ml-auto">
          <LanguageSelector />
          <button
            onClick={handleRefresh}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
              isStormy ? 'bg-[#EA4335] text-white' : 'bg-white text-black shadow-sm'
            }`}
          >
            <ResetIcon size={14} className={isSpinning ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-white/80 hover:text-white bg-white/[0.06] border border-white/10 active:scale-95 transition-all"
            aria-label="Abrir Menú"
          >
            {mobileOpen ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 4H15M1 8H15M1 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* ── MENÚ MÓVIL (DRAWER) ─────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-[#0a0e26]/98 border-b border-white/20 backdrop-blur-2xl"
          >
            <div className="px-4 py-3 space-y-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                const label = mounted ? (isEn ? item.labelEn : item.labelEs) : item.labelEs
                const DrawerIcon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-full text-[14px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-slate-950 shadow-md shadow-white/30'
                        : 'text-slate-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <DrawerIcon size={16} className={isActive ? 'text-slate-950' : item.color} />
                    <span suppressHydrationWarning>{label}</span>
                    {isActive && <span className="ml-auto text-xs font-bold">●</span>}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
