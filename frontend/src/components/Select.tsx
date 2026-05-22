import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = '请选择',
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm',
          'bg-white/60 backdrop-blur-sm border-slate-200/60 text-slate-700',
          'hover:border-emerald-400 hover:bg-white/70',
          'focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20',
          open && 'border-emerald-400 bg-white/70 ring-2 ring-emerald-400/20',
        )}
        style={{ boxShadow: open ? '0 4px 16px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.02)' }}
      >
        <span className={cn(!selectedOption && 'text-slate-400')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 text-slate-400 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-xl border border-slate-200/60 bg-white/90 backdrop-blur-xl py-1"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.04)' }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors',
                option.value === value
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50',
              )}
            >
              {option.value === value && <Check className="h-3.5 w-3.5 text-emerald-500" />}
              <span className={option.value !== value ? 'ml-5.5' : ''}>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
