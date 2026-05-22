import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  PieChart,
  BarChart3,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import GlassCard from '@/components/GlassCard'

export default function ReportDetail() {
  const { month } = useParams<{ month: string }>()
  const navigate = useNavigate()

  const displayMonth = month || '2026-05'
  const year = displayMonth.split('-')[0]
  const mon = displayMonth.split('-')[1]
  const displayLabel = `${year}年${parseInt(mon)}月`

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="rounded-lg border border-white/10 p-1.5 text-white/40 hover:bg-white/[0.06] hover:text-white/70"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white">月报 · {displayLabel}</h1>
          <p className="mt-1 text-sm text-white/50">财务月度总结与分析</p>
        </div>
      </div>

      {/* 概览区 */}
      <GlassCard cornerRadius={16} padding="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-emerald-400" />
            <h2 className="font-medium text-white/90">月度概览</h2>
          </div>
          <button
            onClick={() => navigate('/ledger')}
            className="text-xs text-emerald-400 hover:text-emerald-300"
          >
            查看明细 →
          </button>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-white/40">总收入</p>
            <p className="mt-1 flex items-center gap-1 font-mono text-xl font-semibold text-emerald-400">
              <ArrowUpRight className="h-4 w-4" />
              ¥ 28,500.00
            </p>
          </div>
          <div>
            <p className="text-sm text-white/40">总支出</p>
            <p className="mt-1 flex items-center gap-1 font-mono text-xl font-semibold text-white">
              <ArrowDownRight className="h-4 w-4" />
              ¥ 15,230.50
            </p>
          </div>
          <div>
            <p className="text-sm text-white/40">结余</p>
            <p className="mt-1 font-mono text-xl font-semibold text-emerald-400">¥ 13,269.50</p>
          </div>
          <div>
            <p className="text-sm text-white/40">净资产变化</p>
            <p className="mt-1 font-mono text-xl font-semibold text-emerald-400">+2.3%</p>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-4">
        {/* 消费结构 */}
        <GlassCard cornerRadius={16} padding="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-emerald-400" />
              <h2 className="font-medium text-white/90">消费结构</h2>
            </div>
            <button
              onClick={() => navigate('/categories')}
              className="text-xs text-emerald-400 hover:text-emerald-300"
            >
              查看明细 →
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: '住房', amount: 5000, percent: 32.8, color: 'bg-emerald-500' },
              { name: '餐饮', amount: 2800, percent: 18.4, color: 'bg-blue-500' },
              { name: '购物', amount: 2200, percent: 14.4, color: 'bg-violet-500' },
              { name: '交通', amount: 1500, percent: 9.8, color: 'bg-amber-500' },
              { name: '娱乐', amount: 1200, percent: 7.9, color: 'bg-pink-500' },
              { name: '其他', amount: 2530.5, percent: 16.7, color: 'bg-white/20' },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-12 text-sm text-white/60">{item.name}</span>
                <div className="flex-1">
                  <div className="h-2 w-full rounded-full bg-white/[0.06]">
                    <div
                      className={cn('h-2 rounded-full', item.color)}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
                <span className="w-16 text-right font-mono text-sm text-white/60">
                  ¥{item.amount.toLocaleString()}
                </span>
                <span className="w-12 text-right text-xs text-white/40">{item.percent}%</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* 现金流 */}
        <GlassCard cornerRadius={16} padding="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-400" />
              <h2 className="font-medium text-white/90">现金流</h2>
            </div>
            <button
              onClick={() => navigate('/ledger')}
              className="text-xs text-emerald-400 hover:text-emerald-300"
            >
              查看明细 →
            </button>
          </div>
          <div className="flex h-52 items-center justify-center text-white/40">
            <TrendingUp className="mr-2 h-5 w-5" />
            <span className="text-sm">图表组件待接入</span>
          </div>
        </GlassCard>
      </div>

      {/* 投资概览 */}
      <GlassCard cornerRadius={16} padding="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h2 className="font-medium text-white/90">投资概览</h2>
          </div>
          <button
            onClick={() => navigate('/investments')}
            className="text-xs text-emerald-400 hover:text-emerald-300"
          >
            查看明细 →
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-white/40">本月投入</p>
            <p className="mt-1 font-mono text-lg font-semibold text-white">¥ 8,226.10</p>
          </div>
          <div>
            <p className="text-sm text-white/40">本月赎回</p>
            <p className="mt-1 font-mono text-lg font-semibold text-white">¥ 737.40</p>
          </div>
          <div>
            <p className="text-sm text-white/40">分红收入</p>
            <p className="mt-1 font-mono text-lg font-semibold text-emerald-400">¥ 45.80</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
