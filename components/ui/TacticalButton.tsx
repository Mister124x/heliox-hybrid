import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

export type TacticalButtonVariant = 'primary' | 'secondary' | 'danger' | 'amber' | 'ghost' | 'cyber'
export type TacticalButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export interface TacticalButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: TacticalButtonVariant
  size?: TacticalButtonSize
  icon?: React.ReactNode
  trailingIcon?: React.ReactNode
  codeLabel?: string
  loading?: boolean
  children?: React.ReactNode
}

export function TacticalButton({
  variant = 'primary',
  size = 'md',
  icon,
  trailingIcon,
  codeLabel,
  loading = false,
  className = '',
  disabled,
  children,
  ...props
}: TacticalButtonProps) {
  // Styles for tactical observatory UI
  const baseClasses =
    'relative group inline-flex items-center justify-center font-mono font-medium tracking-wider uppercase transition-all duration-200 select-none overflow-hidden outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed'

  const sizeClasses: Record<TacticalButtonSize, string> = {
    xs: 'text-[10px] px-2.5 py-1 gap-1.5 rounded border',
    sm: 'text-xs px-3.5 py-1.5 gap-2 rounded-md border',
    md: 'text-xs px-4 py-2 gap-2.5 rounded-lg border',
    lg: 'text-sm px-6 py-3 gap-3 rounded-xl border',
  }

  const variantClasses: Record<TacticalButtonVariant, string> = {
    primary:
      'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-100 border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]',
    amber:
      'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-100 border-amber-500/40 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]',
    danger:
      'bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-100 border-red-500/40 hover:border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]',
    secondary:
      'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/60 hover:border-slate-500',
    ghost:
      'bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200 border-transparent hover:border-white/10',
    cyber:
      'bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-blue-950/80 hover:from-cyan-900/90 hover:to-blue-900/90 text-cyan-200 border-cyan-500/50 hover:border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {/* Sci-fi corner brackets on hover */}
      <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current opacity-40 group-hover:opacity-100 transition-opacity" />
      <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-current opacity-40 group-hover:opacity-100 transition-opacity" />

      {/* Loading spinner */}
      {loading ? (
        <svg className="animate-spin h-3.5 w-3.5 text-current" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        icon && <span className="flex-shrink-0 flex items-center justify-center">{icon}</span>
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-1.5 truncate">
        {children}
        {codeLabel && (
          <span className="text-[9px] opacity-60 tracking-tight font-mono px-1 py-0.5 rounded bg-black/40 border border-white/5">
            {codeLabel}
          </span>
        )}
      </span>

      {trailingIcon && !loading && (
        <span className="flex-shrink-0 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
          {trailingIcon}
        </span>
      )}

      {/* Subtle light sweep */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none transition-transform" />
    </motion.button>
  )
}
