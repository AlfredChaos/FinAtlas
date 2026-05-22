import { useState } from 'react'
import { Filter, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

type TradeType = 'buy' | 'sell' | 'dividend'

// 模拟投资交易数据
const mockInvestments = [
  { id: '1', fundCode: '110011', fundName: '易方达中小盘', tradeType: 'buy' as TradeType, shares: 500, nav: 3.2150, amount: 1607.50, applyDate: '2026-05-18', confirmDate: '2026-05-19', source: '支付宝基金' },
  { id: '2', fundCode: '000961', fundName: '天弘沪深300', tradeType: 'buy' as TradeType, shares: 1000, nav: 1.1230, amount: 1123.00, applyDate: '2026-05-17', confirmDate: '2026-05-18', source: '天天基金' },
  { id: '3', fundCode: '005827', fundName: '易方达蓝筹精选', tradeType: 'sell' as TradeType, shares: 300, nav: 2.4580, amount: 737.40, applyDate: '2026-05-16', confirmDate: '2026-05-17', source: '且慢' },
  { id: '4', fundCode: '110011', fundName: '易方达中小盘', tradeType: 'dividend' as TradeType, shares: 0, nav: 3.2200, amount: 45.80, applyDate: '2026-05-15', confirmDate: '2026-05-15', source: '支付宝基金' },
  { id: '5', fundCode: '001549', fundName: '天弘中证500', tradeType: 'buy' as TradeType, shares: 800, nav: 0.9870, amount: 789.60, applyDate: '2026-05-14', confirmDate: '2026-05-15', source: '天天基金' },
  { id: '6', fundCode: '000961', fundName: '天弘沪深300', tradeType: 'buy' as TradeType, shares: 2000, nav: 1.1180, amount: 2236.00, applyDate: '2026-05-13', confirmDate: '2026-05-14', source: '天天基金' },
  { id: '7', fundCode: '005827', fundName: '易方达蓝筹精选', tradeType: 'buy' as TradeType, shares: 600, nav: 2.4500, amount: 1470.00, applyDate: '2026-05-12', confirmDate: '2026-05-13', source: '且慢' },
]

const tradeTypeConfig: Record<TradeType, { label: string; color: string; icon: React.ElementType }> = {
  buy: { label: '买入', color: 'text-emerald-600', icon: ArrowUpRight },
  sell: { label: '卖出', color: 'text-red-500', icon: ArrowDownRight },
  dividend: { label: '分红', color: 'text-blue-600', icon: Minus },
}

export default function Investments() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">投资台账</h1>
        <p className="mt-1 text-sm text-slate-500">基金交易记录，按申请日记账</p>
      </div>

      {/* 筛选栏 */}
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Filter className="h-4 w-4 text-slate-400" />
        <select className="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-slate-600 outline-none focus:border-emerald-500">
          <option value="">全部月份</option>
          <option value="2026-05">2026年5月</option>
          <option value="2026-04">2026年4月</option>
        </select>
        <select className="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-slate-600 outline-none focus:border-emerald-500">
          <option value="">全部来源</option>
          <option value="alipay">支付宝基金</option>
          <option value="tiantian">天天基金</option>
          <option value="qieman">且慢</option>
        </select>
        <select className="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-slate-600 outline-none focus:border-emerald-500">
          <option value="">全部类型</option>
          <option value="buy">买入</option>
          <option value="sell">卖出</option>
          <option value="dividend">分红</option>
        </select>
        <div className="flex-1" />
        <span className="text-sm text-slate-400">共 {mockInvestments.length} 条</span>
      </div>

      {/* 投资交易表格 */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
              <th className="px-4 py-3 text-left">申请日</th>
              <th className="px-4 py-3 text-left">基金代码</th>
              <th className="px-4 py-3 text-left">基金名称</th>
              <th className="px-4 py-3 text-left">交易类型</th>
              <th className="px-4 py-3 text-right">份额</th>
              <th className="px-4 py-3 text-right">净值</th>
              <th className="px-4 py-3 text-right">金额</th>
              <th className="px-4 py-3 text-left">确认日</th>
              <th className="px-4 py-3 text-left">来源</th>
            </tr>
          </thead>
          <tbody>
            {mockInvestments.map((inv) => {
              const cfg = tradeTypeConfig[inv.tradeType]
              const Icon = cfg.icon
              return (
                <tr
                  key={inv.id}
                  className="cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50"
                >
                  <td className="px-4 py-2.5 text-sm text-slate-600">{inv.applyDate}</td>
                  <td className="px-4 py-2.5 font-mono text-sm text-slate-700">{inv.fundCode}</td>
                  <td className="px-4 py-2.5 text-sm text-slate-700">{inv.fundName}</td>
                  <td className="px-4 py-2.5">
                    <span className={cn('flex items-center gap-1 text-sm', cfg.color)}>
                      <Icon className="h-3.5 w-3.5" />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-sm text-slate-600">
                    {inv.shares > 0 ? inv.shares.toFixed(2) : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-sm text-slate-600">
                    {inv.nav.toFixed(4)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-sm font-medium text-slate-800">
                    ¥ {inv.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-slate-600">{inv.confirmDate}</td>
                  <td className="px-4 py-2.5 text-sm text-slate-500">{inv.source}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
