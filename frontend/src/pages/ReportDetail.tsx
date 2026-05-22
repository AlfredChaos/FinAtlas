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
          className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">月报 · {displayLabel}</h1>
          <p className="mt-1 text-sm text-slate-500">财务月度总结与分析</p>
        </div>
      </div>

      {/* 概览区 */}
      <GlassCard cornerRadius={16} padding="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-emerald-600" />
            <h2 className="font-medium text-slate-900">月度概览</h2>
          </div>
          <button
            onClick={() => navigate('/ledger')}
            className="text-xs text-emerald-600 hover:text-emerald-700"
          >
            查看明细 →
          </button>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-slate-400">总收入</p>
            <p className="mt-1 flex items-center gap-1 font-mono text-xl font-semibold text-emerald-600">
              <ArrowUpRight className="h-4 w-4" />
              ¥ 28,500.00
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">总支出</p>
            <p className="mt-1 flex items-center gap-1 font-mono text-xl font-semibold text-slate-900">
              <ArrowDownRight className="h-4 w-4" />
              ¥ 15,230.50
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">结余</p>
            <p className="mt-1 font-mono text-xl font-semibold text-emerald-600">¥ 13,269.50</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">净资产变化</p>
            <p className="mt-1 font-mono text-xl font-semibold text-emerald-600">+2.3%</p>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-4">
        {/* 消费结构 */}
        <GlassCard cornerRadius={16} padding="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-emerald-600" />
              <h2 className="font-medium text-slate-900">消费结构</h2>
            </div>
            <button
              onClick={() => navigate('/categories')}
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              查看明细 →
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: '住房', amount: 5000, percent: 32.8, color: 'bg-emerald-600' },
              { name: '餐饮', amount: 2800, percent: 18.4, color: 'bg-blue-600' },
              { name: '购物', amount: 2200, percent: 14.4, color: 'bg-violet-600' },
              { name: '交通', amount: 1500, percent: 9.8, color: 'bg-amber-600' },
              { name: '娱乐', amount: 1200, percent: 7.9, color: 'bg-pink-600' },
              { name: '其他', amount: 2530.5, percent: 16.7, color: 'bg-slate-400' },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-12 text-sm text-slate-500">{item.name}</span>
                <div className="flex-1">
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div
                      className={cn('h-2 rounded-full', item.color)}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
                <span className="w-16 text-right font-mono text-sm text-slate-500">
                  ¥{item.amount.toLocaleString()}
                </span>
                <span className="w-12 text-right text-xs text-slate-400">{item.percent}%</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* 现金流 */}
        <GlassCard cornerRadius={16} padding="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              <h2 className="font-medium text-slate-900">现金流</h2>
            </div>
            <button
              onClick={() => navigate('/ledger')}
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              查看明细 →
            </button>
          </div>
          <div className="flex h-52 items-center justify-center text-slate-400">
            <TrendingUp className="mr-2 h-5 w-5" />
            <span className="text-sm">图表组件待接入</span>
          </div>
        </GlassCard>
      </div>

      {/* 投资概览 */}
      <GlassCard cornerRadius={16} padding="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <h2 className="font-medium text-slate-900">投资概览</h2>
          </div>
          <button
            onClick={() => navigate('/investments')}
            className="text-xs text-emerald-600 hover:text-emerald-700"
          >
            查看明细 →
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-slate-400">本月投入</p>
            <p className="mt-1 font-mono text-lg font-semibold text-slate-900">¥ 8,226.10</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">本月赎回</p>
            <p className="mt-1 font-mono text-lg font-semibold text-slate-900">¥ 737.40</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">分红收入</p>
            <p className="mt-1 font-mono text-lg font-semibold text-emerald-600">¥ 45.80</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
