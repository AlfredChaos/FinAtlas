import LiquidGlass from 'liquid-glass-react'
import { cn } from '@/lib/utils'

interface GlassButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}

export default function GlassButton({
  children,
  onClick,
  variant = 'primary',
  className,
  disabled = false,
  type = 'button',
}: GlassButtonProps) {
  return (
    <LiquidGlass
      displacementScale={50}
      blurAmount={0.05}
      saturation={130}
      cornerRadius={100}
      elasticity={0.2}
      overLight={false}
    >
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'px-4 py-2 text-sm font-medium transition-all',
          variant === 'primary'
            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
            : 'bg-white/[0.08] text-white/80 hover:bg-white/[0.15]',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
      >
        {children}
      </button>
    </LiquidGlass>
  )
}
