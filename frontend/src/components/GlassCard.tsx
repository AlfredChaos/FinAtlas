import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  cornerRadius?: number
  padding?: string
}

export default function GlassCard({
  children,
  className,
  cornerRadius = 16,
  padding = 'p-5',
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'bg-white/70 backdrop-blur-xl border border-white/40',
        padding,
        className,
      )}
      style={{
        borderRadius: `${cornerRadius}px`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {children}
    </div>
  )
}
