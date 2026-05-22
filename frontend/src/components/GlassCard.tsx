import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  cornerRadius?: number
  padding?: string
  hover?: boolean
  onClick?: () => void
}

export default function GlassCard({
  children,
  className,
  cornerRadius = 20,
  padding = 'p-5',
  hover = false,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      style={{ borderRadius: cornerRadius }}
      className={cn(
        'relative overflow-hidden',
        'bg-white/[0.06] backdrop-blur-xl',
        'border border-white/[0.10]',
        'shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]',
        'transition-all duration-300',
        hover && 'hover:bg-white/[0.09] hover:border-white/[0.15] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.12)] hover:scale-[1.01] cursor-pointer',
        onClick && 'cursor-pointer',
        padding,
        className,
      )}
    >
      {/* 顶部高光 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </div>
  )
}
