'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Spatial3DCardProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  onClick?: () => void
}

/**
 * 3D Spatial Perspective Card
 * Patrón de diseño de vanguardia de Aceternity UI (50k+ stars en GitHub)
 * Añade perspectiva isométrica tridimensional e inclinación reactiva al cursor.
 */
export function Spatial3DCard({
  children,
  className = '',
  containerClassName = '',
  onClick,
}: Spatial3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calcular inclinación (-12 a +12 grados)
    const rX = ((mouseY / height) - 0.5) * -16
    const rY = ((mouseX / width) - 0.5) * 16

    setRotateX(rX)
    setRotateY(rY)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <div
      className={`relative [perspective:1200px] ${containerClassName}`}
      onClick={onClick}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 24,
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
        className={`relative transition-all duration-150 ease-out will-change-transform ${className}`}
      >
        {/* Haz de luz de fondo con efecto border-beam */}
        <div
          className={`absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 pointer-events-none ${
            isHovered ? 'opacity-100' : ''
          }`}
          style={{
            background: 'linear-gradient(135deg, rgba(0,243,255,0.4) 0%, rgba(168,85,247,0.2) 50%, transparent 100%)',
            filter: 'blur(1px)',
          }}
        />

        <div style={{ transform: 'translateZ(20px)' }} className="relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

export function Spatial3DLayer({
  children,
  depth = 30,
  className = '',
}: {
  children: React.ReactNode
  depth?: number
  className?: string
}) {
  return (
    <div
      style={{
        transform: `translateZ(${depth}px)`,
        transformStyle: 'preserve-3d',
      }}
      className={`transition-transform duration-200 ${className}`}
    >
      {children}
    </div>
  )
}
