import { useNavigate } from 'react-router-dom'
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Percent,
  FileWarning,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import GlassCard from '@/components/GlassCard'

const metrics = [
  { label: '净资产', value: '¥ 385,420.00', change: '+2.3%', up: true, icon: Wallet },
  { label: '本月收入', value: '¥ 28,500.00', change: '+5.1%', up: true, icon: ArrowUpRight },
  { label: '本月支出', value: '¥ 15,230.50', change: '-1.8%', up: false, icon: ArrowDownRight },
  { label: '结余', value: '¥ 13,269.50', change: '+18.7%', up: true, icon: PiggyBank },
  { label: '储蓄率', value: '46.6%', change: '+3.2%', up: true, icon: Percent },
  { label: '待处理导入', value: '3', change: '', up: false, icon: FileWarning },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">2026年5月 财务概览</p>
      </div>

      {/* 上方：6 个指标卡片 */}
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon
          return (
            <GlassCard
              key={m.label}
              cornerRadius={16}
              padding="p-5"
              className="cursor-pointer transition-all hover:bg-slate-50"
            >
              <button
                onClick={() => {
                  if (m.label === '待处理导入') navigate('/imports')
                }}
                className="flex w-full items-center gap-4 text-left"
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    m.up ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400',
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500">{m.label}</p>
                  <p className="font-mono text-lg font-semibold text-slate-900">{m.value}</p>
                </div>
                {m.change && (
                  <span
                    className={cn(
                      'text-xs font-medium',
                      m.up ? 'text-emerald-600' : 'text-red-600',
                    )}
                  >
                    {m.change}
                  </span>
                )}
              </button>
            </GlassCard>
          )
        })}
      </div>

      {/* 中部：现金流趋势 + 导入状态 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 现金流趋势图占位 */}
        <GlassCard cornerRadius={16} padding="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-slate-900">现金流趋势</h2>
            <div className="flex gap-2">
              <button className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                近6月
              </button>
              <button className="rounded-md px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-50">
                近12月
              </button>
            </div>
          </div>
          <div className="flex h-52 items-center justify-center text-slate-400">
            <TrendingUp className="mr-2 h-5 w-5" />
            <span className="text-sm">图表组件待接入</span>
          </div>
        </GlassCard>

        {/* 导入状态 */}
        <GlassCard cornerRadius={16} padding="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-slate-900">最近导入</h2>
            <button
              onClick={() => navigate('/imports')}
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              查看全部
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: '招行借记卡_202605.csv', status: '已完成', time: '2 小时前' },
              { name: '中信信用卡_202605.xlsx', status: '处理中', time: '10 分钟前' },
              { name: '支付宝基金_202605.pdf', status: '待复核', time: '30 分钟前' },
            ].map((job) => (
              <div
                key={job.name}
                className="flex items-center justify-between rounded-md border border-slate-200 bg-white/50 px-3 py-2"
              >
                <div>
                  <p className="text-sm text-slate-700">{job.name}</p>
                  <p className="text-xs text-slate-400">{job.time}</p>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    job.status === '已完成'
                      ? 'bg-emerald-50 text-emerald-700'
                      : job.status === '处理中'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-amber-50 text-amber-600',
                  )}
                >
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* 下方：异常支出 + 待分类 + 推荐问题 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 异常支出 */}
        <GlassCard cornerRadius={16} padding="p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h2 className="font-medium text-slate-900">异常支出提醒</h2>
          </div>
          <div className="space-y-3">
            {[
              { desc: '大额消费 ¥3,200', detail: '某电商 · 5月18日' },
              { desc: '餐饮超预算 120%', detail: '本月累计 ¥2,800' },
            ].map((item, i) => (
              <div key={i} className="rounded-md border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm font-medium text-slate-700">{item.desc}</p>
                <p className="text-xs text-slate-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* 待分类 */}
        <GlassCard cornerRadius={16} padding="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-slate-900">待分类交易</h2>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
              12 笔
            </span>
          </div>
          <div className="space-y-2">
            {['美团外卖 ¥35.00', '滴滴出行 ¥28.50', '京东购物 ¥199.00'].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md border border-slate-200 bg-white/50 px-3 py-2"
              >
                <span className="text-sm text-slate-500">{item}</span>
                <button className="text-xs text-emerald-600 hover:text-emerald-700">分类</button>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* AI 推荐问题 */}
        <GlassCard
          cornerRadius={16}
          padding="p-5"
          className="cursor-pointer transition-all hover:bg-slate-50"
        >
          <div
            onClick={() => navigate('/ai')}
            className="h-full"
          >
            <div className="mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              <h2 className="font-medium text-slate-900">推荐问题</h2>
            </div>
            <div className="space-y-2">
              {[
                '本月消费与上月相比如何？',
                '我的储蓄率是否健康？',
                '哪类支出占比最高？',
              ].map((q, i) => (
                <div
                  key={i}
                  className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-600"
                >
                  {q}
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
