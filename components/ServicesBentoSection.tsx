'use client'

import { motion } from 'framer-motion'
import { useI18n } from '../lib/i18n'

export default function ServicesBentoSection() {
  const { lang } = useI18n()
  const isEn = lang === 'en'

  const services = [
    {
      icon: '⚡',
      badge: isEn ? '24H Delivery' : 'Entrega 24h',
      title: isEn ? 'Express Landing Pages (Next.js 14)' : 'Landing Pages Express (Next.js 14)',
      desc: isEn
        ? 'Ultra-fast, responsive web interfaces with Bento Grid architecture and modern dark mode styling like Apple & Linear.'
        : 'Sitios web ultrarrápidos y responsivos con arquitectura Bento Grid y diseño oscuro moderno estilo Apple y Linear.',
      price: '$149 USD',
      features: isEn
        ? ['Custom Brand Integration', '1-Click Vercel Deploy', 'SEO & Performance 100%']
        : ['Adaptación de Marca', 'Despliegue en tu Dominio', 'Rendimiento 100%'],
      action: isEn ? 'Hire Service' : 'Contratar Servicio',
      link: 'https://paypal.me/JesusBarriosGiraldo/149',
      popular: true,
    },
    {
      icon: '🛰️',
      badge: isEn ? 'Full Template' : 'Plantilla Lista',
      title: isEn ? 'Antigravity Dark UI Kit' : 'Kit de UI Antigravity Dark',
      desc: isEn
        ? 'Instant download of the complete Next.js 14 source code, 3D interactive globe, HUD telemetry widgets, and Tailwind config.'
        : 'Descarga instantánea del código fuente en Next.js 14, globo 3D interactivo, widgets HUD y configuración Tailwind.',
      price: '$29 USD',
      features: isEn
        ? ['Full Source Code (.zip)', 'Commercial License', 'Free Lifetime Updates']
        : ['Código Fuente Completo (.zip)', 'Licencia Comercial Ilimitada', 'Instalación en 3 minutos'],
      action: isEn ? 'Download on Gumroad' : 'Descargar en Gumroad',
      link: 'https://jesusg2.gumroad.com/l/antigravity-ui',
      popular: false,
    },
    {
      icon: '🤖',
      badge: isEn ? 'Custom SaaS' : 'A Medida',
      title: isEn ? 'Fullstack AI & Dashboard Engineering' : 'Ingeniería Fullstack & Dashboards IA',
      desc: isEn
        ? 'End-to-end web apps with Python backend (FastAPI, Redis, Celery), LLM integration, and real-time streaming data.'
        : 'Aplicaciones web con backend en Python (FastAPI, Celery), integración de modelos de IA y flujos de datos en tiempo real.',
      price: '$499 USD',
      features: isEn
        ? ['FastAPI + Redis Architecture', 'AI & OpenAI/Gemini APIs', 'Full Production Setup']
        : ['Arquitectura FastAPI + Redis', 'APIs de IA Conectadas', 'Soporte y Despliegue'],
      action: isEn ? 'Request Quote' : 'Solicitar Cotización',
      link: 'https://paypal.me/JesusBarriosGiraldo/499',
      popular: false,
    },
  ]

  return (
    <section className="space-y-6 pt-6 pb-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/[0.08] pb-4 gap-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-[11px] font-mono font-medium mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span>{isEn ? 'ENGINEERING & DESIGN LAB' : 'SERVICIOS PROFESIONALES DE DESARROLLO'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>💻</span>
            <span>
              {isEn ? 'Custom Engineering by Jesús Barrios' : 'Desarrollo de Software & UI por Jesús Barrios'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-white/50 mt-1 max-w-2xl">
            {isEn
              ? 'Bring high-tech, aerospace-grade digital experiences to your startup. Clean code, Next.js 14, and autonomous AI systems.'
              : 'Creamos interfaces y software de alto rendimiento para tu negocio o startup. Código limpio, Next.js 14 y entrega garantizada.'}
          </p>
        </div>

        <div className="font-mono text-xs text-white/40 flex items-center gap-2">
          <span>{isEn ? 'Available for new projects' : 'Disponible para proyectos'}</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((svc, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
              svc.popular
                ? 'bg-gradient-to-b from-orange-500/10 to-black/60 border-orange-500/30 shadow-lg shadow-orange-500/5'
                : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
            }`}
          >
            {svc.popular && (
              <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-black text-[10px] font-black uppercase font-mono tracking-wider shadow-md">
                {isEn ? 'Most Requested' : 'Más Solicitado'}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{svc.icon}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-white/60 border border-white/10">
                  {svc.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white tracking-tight">{svc.title}</h3>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">{svc.desc}</p>
              </div>

              <div className="pt-2 border-t border-white/5">
                <div className="text-2xl font-black font-mono text-white tracking-tight">
                  {svc.price}
                  <span className="text-xs font-normal text-white/40 ml-1">
                    {svc.price === '$29 USD' ? (isEn ? '/ one-time' : '/ pago único') : (isEn ? '/ project' : '/ proyecto')}
                  </span>
                </div>
              </div>

              <ul className="space-y-1.5 pt-2 text-xs font-mono text-white/60">
                {svc.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-orange-400 text-[10px]">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-5 mt-4 border-t border-white/5">
              <a
                href={svc.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold font-mono text-center flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  svc.popular
                    ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-black shadow-md shadow-orange-500/20 hover:shadow-orange-500/40'
                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                }`}
              >
                <span>{svc.action}</span>
                <span>→</span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
