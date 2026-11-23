'use client'

import { motion } from 'framer-motion'
import { useI18n } from '../lib/i18n'
import { FlareIcon, WaveIcon, AtomIcon, SparklesIcon, CrosshairIcon } from './ui/Icons'

interface StormAlertProps {
  type: 'CME' | 'LLAMARADA' | 'TORMENTA' | 'SEP'
  intensity: string
  time: string
  location?: string
}

function formatTime(iso: string, lang: string): string {
  try {
    const d = new Date(iso)
    const locale = lang === 'en' ? 'en-US' : lang === 'pt' ? 'pt-BR' : lang === 'fr' ? 'fr-FR' : 'es-CO'
    return d.toLocaleString(locale, {
      day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
    }) + ' UTC'
  } catch { return iso }
}

function isXClass(intensity: string): boolean {
  return intensity?.startsWith('X') || intensity?.startsWith('M')
}

export default function StormAlert({ type, intensity, time, location }: StormAlertProps) {
  const { lang } = useI18n()
  
  const isEn = lang === 'en'
  const isPt = lang === 'pt'
  const isFr = lang === 'fr'
  const isDe = lang === 'de'

  const labels: Record<string, string> = {
    CME: isEn ? 'Coronal Mass Ejection' : isPt ? 'Ejeção de Massa Coronal' : isFr ? 'Éjection de Masse Coronale' : isDe ? 'Koronaler Massenauswurf' : 'Eyección Coronal',
    LLAMARADA: isEn ? 'Solar Flare' : isPt ? 'Erupção Solar' : isFr ? 'Éruption Solaire' : isDe ? 'Sonneneruption' : 'Llamarada Solar',
    TORMENTA: isEn ? 'Geomagnetic Storm' : isPt ? 'Tempestade Geomagnética' : isFr ? 'Tempête Géomagnétique' : isDe ? 'Geomagnetischer Sturm' : 'Tormenta Geomagnética',
    SEP: isEn ? 'Energetic Particles' : isPt ? 'Partículas Energéticas' : isFr ? 'Particules Énergétiques' : isDe ? 'Energetische Partikel' : 'Partículas Energéticas',
  }

  const typeStyles = {
    CME: { icon: SparklesIcon, color: '#f97316', bg: 'bg-orange-500/10 border-orange-500/30' },
    LLAMARADA: { icon: FlareIcon, color: '#eab308', bg: 'bg-yellow-500/10 border-yellow-500/30' },
    TORMENTA: { icon: WaveIcon, color: '#ef4444', bg: 'bg-red-500/10 border-red-500/30' },
    SEP: { icon: AtomIcon, color: '#a855f7', bg: 'bg-purple-500/10 border-purple-500/30' },
  }

  const style = typeStyles[type] ?? typeStyles.CME
  const IconComponent = style.icon
  const label = labels[type] ?? labels.CME
  const isSevere = isXClass(intensity) || (type === 'CME' && parseFloat(intensity) > 900)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`solar-card border p-5 ${style.bg} ${isSevere ? 'alert-glow' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0" style={{ color: style.color }}>
          <IconComponent size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: style.color }}>
              {label}
            </span>
            {isSevere && (
              <span className="text-xs bg-red-500/30 text-red-300 px-2 py-0.5 rounded-full font-bold">
                {isEn ? 'SEVERE' : isFr ? 'SÉVÈRE' : isDe ? 'SCHWER' : 'SEVERO'}
              </span>
            )}
          </div>

          <div className="font-mono text-xl font-bold" style={{ color: style.color }}>
            {intensity || 'N/A'}
          </div>

          <div className="mt-2 space-y-1">
            <div className="text-xs text-white/60 font-mono" suppressHydrationWarning>
              <span className="text-white/40 font-semibold">[UTC]</span> {formatTime(time, lang)}
            </div>
            {location && (
              <div className="text-xs text-white/60 font-mono flex items-center gap-1">
                <CrosshairIcon size={12} className="text-white/40 shrink-0" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-white/30 font-mono">
        NASA DONKI · {isEn ? 'Real-time satellite data' : isPt ? 'Dados em tempo real' : 'Datos en tiempo real'}
      </div>
    </motion.div>
  )
}
