'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useI18n, LanguageSelector } from '../lib/i18n'

interface NavbarProps {
  countdown?: number
  refreshing?: boolean
  onRefresh?: () => void
  isStormy?: boolean
}

const NAV_ITEMS = [
  { href: '/',          labelEs: 'Inicio',      labelEn: 'Home' },
  { href: '/dashboard', labelEs: 'Dashboard',   labelEn: 'Dashboard' },
  { href: '/storms',    labelEs: 'Tormentas',   labelEn: 'Storms' },
  { href: '/reels',     labelEs: 'Media 4K',    labelEn: 'Media 4K' },
  { href: '/analysis',  labelEs: 'Análisis IA', labelEn: 'AI Analysis' },
]

/* ─── Waffle icon (apps grid igual al de Google) ─────────────────── */
function WaffleIcon() {
  return (
    <svg focusable="false" viewBox="0 0 24 24" width="20" height="20">
      <path
        fill="currentColor"
        d="M6 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM6 14c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM6 20c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
      />
    </svg>
  )
}

/* ─── Waffle dropdown panel ──────────────────────────────────────── */
const GOOGLE_APPS = [
  { label: 'Firebase', href: 'https://console.firebase.google.com', emoji: '🔥' },
  { label: 'AI Studio', href: 'https://aistudio.google.com', emoji: '✨' },
  { label: 'NASA SDO', href: 'https://sdo.gsfc.nasa.gov', emoji: '☀️' },
  { label: 'NOAA SWPC', href: 'https://www.swpc.noaa.gov', emoji: '🌍' },
  { label: 'NASA DONKI', href: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/', emoji: '🛰️' },
  { label: 'SOHO', href: 'https://soho.nascom.nasa.gov', emoji: '🔭' },
  { label: 'Dashboard', href: '/dashboard', emoji: '📡' },
  { label: 'Tormentas', href: '/storms', emoji: '🌪️' },
  { label: 'Análisis IA', href: '/analysis', emoji: '🤖' },
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

  const [mobileOpen, setMobileOpen]   = useState(false)
  const [waffleOpen, setWaffleOpen]   = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const [spinning, setSpinning]       = useState(false)

  useEffect(() => { setMobileOpen(false); setWaffleOpen(false) }, [pathname])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleRefresh = () => {
    if (onRefresh) { onRefresh(); return }
    setSpinning(true)
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('heliox-refresh'))
    router.refresh()
    setTimeout(() => setSpinning(false), 1200)
  }

  const isSpinning = refreshing || spinning

  /* ── RENDER ──────────────────────────────────────────────────── */
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#030014]/90 backdrop-blur-2xl border-b border-white/[0.07]'
          : 'bg-transparent'
      }`}
    >
      {/*
        ══════════════════════════════════════════════════════════════
        ESTRUCTURA EXACTA DE GOOGLE:
        [Logo]  ←─── espacio ───→  [nav links texto]  [waffle] [live btn]
        ══════════════════════════════════════════════════════════════
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between gap-2">

        {/* ── LOGO — igual a cómo Google pone su logo a la izquierda ── */}
        <Link href="/" className="flex items-center gap-2 group select-none shrink-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-orange-500/30 bg-orange-950/40 p-0.5 group-hover:scale-105 transition-transform duration-200">
            <img src="/favicon.svg" alt="HELIOX" className="w-full h-full object-contain" />
          </div>
          {/* Letras multicolor al estilo Google */}
          <span className="text-[20px] font-black tracking-tight leading-none select-none">
            <span style={{ color: '#4285F4' }}>H</span>
            <span style={{ color: '#EA4335' }}>E</span>
            <span style={{ color: '#FBBC05' }}>L</span>
            <span style={{ color: '#4285F4' }}>I</span>
            <span style={{ color: '#34A853' }}>O</span>
            <span style={{ color: '#EA4335' }}>X</span>
          </span>
        </Link>

        {/* ── LINKS DE TEXTO CENTRALES (desktop) — idéntico a Google ─ */}
        <div className="hidden md:flex items-center gap-1 ml-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'text-white bg-white/10'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.07]'
                }`}
              >
                {isEn ? item.labelEn : item.labelEs}
                {/* Subrayado activo al estilo Google underline */}
                {isActive && (
                  <span className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-[#4285F4] rounded-full" />
                )}
              </Link>
            )
          })}
        </div>

        {/* ── CONTROLES DERECHA — igual a Google: waffle + botón ────── */}
        <div className="hidden md:flex items-center gap-1 ml-2 shrink-0">

          {/* Selector idioma */}
          <div className="text-white/60">
            <LanguageSelector />
          </div>

          {/* Botón LIVE — idéntico al botón azul "Iniciar sesión" de Google */}
          <button
            onClick={handleRefresh}
            title={isEn ? 'Refresh satellite telemetry' : 'Actualizar telemetría'}
            className={`flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-medium transition-all duration-200 ${
              isStormy
                ? 'bg-[#EA4335] hover:bg-[#D33828] text-white shadow-lg shadow-red-600/30'
                : 'bg-[#1a73e8] hover:bg-[#1b66c9] text-white shadow-lg shadow-blue-700/20 hover:shadow-blue-700/40'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-white/70 ${isStormy ? 'animate-ping' : 'animate-pulse'}`} />
            <span>
              {isStormy
                ? (isEn ? 'ALERT' : 'ALERTA')
                : (isEn ? 'LIVE' : 'EN VIVO')}
            </span>
            {typeof countdown === 'number' && (
              <span className={`text-[11px] opacity-70 font-mono ${isSpinning ? 'animate-spin' : ''}`}>
                {countdown}s
              </span>
            )}
          </button>

          {/* Waffle icon — exactamente como Google apps grid ─────────── */}
          <div className="relative">
            <button
              onClick={() => setWaffleOpen(!waffleOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] transition-all duration-150"
              aria-label="Aplicaciones"
            >
              <WaffleIcon />
            </button>

            <AnimatePresence>
              {waffleOpen && (
                <>
                  {/* Overlay cierre */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setWaffleOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-[280px] bg-[#1c1c1e]/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-2xl shadow-black/60 z-50 p-3 overflow-hidden"
                  >
                    {/* Título panel */}
                    <div className="px-2 pb-2 mb-1 border-b border-white/[0.07]">
                      <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest">Aplicaciones HELIOX</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {GOOGLE_APPS.map((app) => (
                        <a
                          key={app.label}
                          href={app.href}
                          target={app.href.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          onClick={() => setWaffleOpen(false)}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white/[0.08] transition-all duration-150 group"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                            {app.emoji}
                          </span>
                          <span className="text-[11px] text-white/60 group-hover:text-white text-center leading-tight transition-colors">
                            {app.label}
                          </span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── CONTROLES MÓVIL ────────────────────────────────────────── */}
        <div className="flex md:hidden items-center gap-1 ml-auto">
          <LanguageSelector />
          <button
            onClick={handleRefresh}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
              isStormy ? 'bg-[#EA4335] text-white' : 'bg-white/[0.08] text-white/70 hover:text-white'
            }`}
          >
            <span className={isSpinning ? 'animate-spin' : ''}>🔄</span>
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
            aria-label="Menú"
          >
            {mobileOpen
              ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              : <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 4H17M1 9H17M1 14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            }
          </button>
        </div>
      </div>

      {/* ── MENÚ MÓVIL ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-[#030014]/98 border-b border-white/[0.07] backdrop-blur-2xl"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2.5 rounded-full text-[14px] font-medium transition-all ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    {isEn ? item.labelEn : item.labelEs}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
