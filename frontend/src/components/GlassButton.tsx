import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
  size?: 'sm' | 'md' | 'lg'
}

export default function GlassButton({
  children,
  onClick,
  variant = 'primary',
  className,
  disabled = false,
  type = 'button',
  size = 'md',
}: GlassButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  }

  const variantClasses = {
    primary: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]',
    secondary: 'bg-white/[0.06] border-white/[0.12] text-white/80 hover:bg-white/[0.12] hover:border-white/[0.18]',
    danger: 'bg-red-500/15 border-red-500/25 text-red-400 hover:bg-red-500/25 hover:border-red-500/35',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative rounded-full font-medium',
        'backdrop-blur-lg border',
        'transition-all duration-200',
        'active:scale-[0.97]',
        sizeClasses[size],
        variantClasses[variant],
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className,
      )}
    >
      {children}
    </button>
  )
}
