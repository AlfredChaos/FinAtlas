import { useState } from 'react'
import { Plus, CreditCard, Landmark, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import GlassCard from '@/components/GlassCard'
import GlassButton from '@/components/GlassButton'

const accountIcons: Record<string, React.ElementType> = {
  bank: Landmark,
  credit: CreditCard,
  fund: Wallet,
}

const mockAccounts = [
  {
    id: '1',
    name: '招行借记卡',
    type: 'bank',
    number: '****6218',
    balance: 125680.50,
    status: 'active',
    lastImport: '2026-05-20',
  },
  {
    id: '2',
    name: '中信信用卡',
    type: 'credit',
    number: '****8832',
    balance: -3250.00,
    status: 'active',
    lastImport: '2026-05-22',
  },
  {
    id: '3',
    name: '支付宝基金',
    type: 'fund',
    number: '支付宝账号',
    balance: 85032.00,
    status: 'active',
    lastImport: '2026-05-22',
  },
  {
    id: '4',
    name: '天天基金',
    type: 'fund',
    number: '天天基金账号',
    balance: 120500.00,
    status: 'active',
    lastImport: '2026-05-17',
  },
  {
    id: '5',
    name: '且慢',
    type: 'fund',
    number: '且慢账号',
    balance: 58457.50,
    status: 'active',
    lastImport: '2026-05-12',
  },
]

export default function SettingsAccounts() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">账户与来源</h1>
          <p className="mt-1 text-sm text-white/50">管理你的金融账户和数据来源</p>
        </div>
        <GlassButton
          variant="primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          添加账户
        </GlassButton>
      </div>

      {/* 添加账户表单 */}
      {showForm && (
        <GlassCard cornerRadius={16} padding="p-5" className="border border-emerald-500/20">
          <h2 className="mb-4 font-medium text-white/90">新增账户</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1.5 block text-sm text-white/60">账户名称</label>
              <input
                type="text"
                placeholder="例如：招行借记卡"
                className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-white/60">账户类型</label>
              <select className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm outline-none focus:border-emerald-400">
                <option value="bank">银行借记卡</option>
                <option value="credit">信用卡</option>
                <option value="fund">基金平台</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-white/60">账号标识</label>
              <input
                type="text"
                placeholder="例如：尾号6218"
                className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm outline-none focus:border-emerald-400"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <GlassButton variant="primary">
              保存
            </GlassButton>
            <GlassButton
              variant="secondary"
              onClick={() => setShowForm(false)}
            >
              取消
            </GlassButton>
          </div>
        </GlassCard>
      )}

      {/* 账户列表 */}
      <div className="grid grid-cols-2 gap-4">
        {mockAccounts.map((account) => {
          const Icon = accountIcons[account.type] || Wallet
          return (
            <GlassCard
              key={account.id}
              cornerRadius={16}
              padding="p-5"
              className="transition-all hover:bg-white/[0.08]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg',
                      account.type === 'bank'
                        ? 'bg-blue-500/15 text-blue-400'
                        : account.type === 'credit'
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-emerald-500/15 text-emerald-400',
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white/80">{account.name}</h3>
                    <p className="text-xs text-white/40">{account.number}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                  活跃
                </span>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-xs text-white/40">当前余额</p>
                  <p
                    className={cn(
                      'font-mono text-lg font-semibold',
                      account.balance >= 0 ? 'text-white' : 'text-red-400',
                    )}
                  >
                    {account.balance >= 0 ? '' : '-'}¥ {Math.abs(account.balance).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">最近导入</p>
                  <p className="text-sm text-white/60">{account.lastImport}</p>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
