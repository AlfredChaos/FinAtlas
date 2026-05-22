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
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-5 py-2 text-sm font-medium transition-all rounded-full',
        'backdrop-blur-lg border',
        variant === 'primary'
          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/25'
          : 'bg-white/60 border-slate-200/60 text-slate-600 hover:bg-white/80',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      style={{
        boxShadow: variant === 'primary'
          ? '0 2px 8px rgba(16,185,129,0.15)'
          : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {children}
    </button>
  )
}
