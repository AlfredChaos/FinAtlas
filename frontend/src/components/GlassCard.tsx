import LiquidGlass from 'liquid-glass-react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  cornerRadius?: number
  displacementScale?: number
  blurAmount?: number
  saturation?: number
  padding?: string
}

export default function GlassCard({
  children,
  className,
  cornerRadius = 20,
  displacementScale = 70,
  blurAmount = 0.0625,
  saturation = 130,
  padding = 'p-5',
}: GlassCardProps) {
  return (
    <LiquidGlass
      displacementScale={displacementScale}
      blurAmount={blurAmount}
      saturation={saturation}
      cornerRadius={cornerRadius}
      elasticity={0.3}
      overLight={false}
    >
      <div
        className={cn(
          'bg-white/[0.05] backdrop-blur-sm',
          padding,
          className,
        )}
      >
        {children}
      </div>
    </LiquidGlass>
  )
}
