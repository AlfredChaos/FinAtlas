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
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">2026年5月 财务概览</p>
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
              className="cursor-pointer transition-all hover:bg-white/[0.08]"
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
                    m.up ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.06] text-white/50',
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/50">{m.label}</p>
                  <p className="font-mono text-lg font-semibold text-white">{m.value}</p>
                </div>
                {m.change && (
                  <span
                    className={cn(
                      'text-xs font-medium',
                      m.up ? 'text-emerald-400' : 'text-red-400',
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
            <h2 className="font-medium text-white/90">现金流趋势</h2>
            <div className="flex gap-2">
              <button className="rounded-md bg-white/[0.08] px-2.5 py-1 text-xs text-white/70">
                近6月
              </button>
              <button className="rounded-md px-2.5 py-1 text-xs text-white/40 hover:bg-white/[0.06]">
                近12月
              </button>
            </div>
          </div>
          <div className="flex h-52 items-center justify-center text-white/40">
            <TrendingUp className="mr-2 h-5 w-5" />
            <span className="text-sm">图表组件待接入</span>
          </div>
        </GlassCard>

        {/* 导入状态 */}
        <GlassCard cornerRadius={16} padding="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-white/90">最近导入</h2>
            <button
              onClick={() => navigate('/imports')}
              className="text-xs text-emerald-400 hover:text-emerald-300"
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
                className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-2"
              >
                <div>
                  <p className="text-sm text-white/80">{job.name}</p>
                  <p className="text-xs text-white/40">{job.time}</p>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    job.status === '已完成'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : job.status === '处理中'
                        ? 'bg-blue-500/15 text-blue-400'
                        : 'bg-amber-500/15 text-amber-400',
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
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <h2 className="font-medium text-white/90">异常支出提醒</h2>
          </div>
          <div className="space-y-3">
            {[
              { desc: '大额消费 ¥3,200', detail: '某电商 · 5月18日' },
              { desc: '餐饮超预算 120%', detail: '本月累计 ¥2,800' },
            ].map((item, i) => (
              <div key={i} className="rounded-md border border-amber-500/20 bg-amber-500/[0.06] p-3">
                <p className="text-sm font-medium text-white/80">{item.desc}</p>
                <p className="text-xs text-white/40">{item.detail}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* 待分类 */}
        <GlassCard cornerRadius={16} padding="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-white/90">待分类交易</h2>
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-400">
              12 笔
            </span>
          </div>
          <div className="space-y-2">
            {['美团外卖 ¥35.00', '滴滴出行 ¥28.50', '京东购物 ¥199.00'].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-2"
              >
                <span className="text-sm text-white/60">{item}</span>
                <button className="text-xs text-emerald-400 hover:text-emerald-300">分类</button>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* AI 推荐问题 */}
        <GlassCard
          cornerRadius={16}
          padding="p-5"
          className="cursor-pointer transition-all hover:bg-white/[0.08]"
        >
          <div
            onClick={() => navigate('/ai')}
            className="h-full"
          >
            <div className="mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              <h2 className="font-medium text-white/90">推荐问题</h2>
            </div>
            <div className="space-y-2">
              {[
                '本月消费与上月相比如何？',
                '我的储蓄率是否健康？',
                '哪类支出占比最高？',
              ].map((q, i) => (
                <div
                  key={i}
                  className="rounded-md border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2 text-sm text-emerald-400"
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
