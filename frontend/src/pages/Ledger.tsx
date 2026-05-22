import { useState } from 'react'
import { Filter, X, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

// 模拟交易数据
const mockTransactions = [
  { id: '1', date: '2026-05-20', account: '招行借记卡', category: '餐饮', desc: '美团外卖', amount: -35.00, evidence: '招行_202605.csv#L12' },
  { id: '2', date: '2026-05-20', account: '中信信用卡', category: '交通', desc: '滴滴出行', amount: -28.50, evidence: '中信_202605.xlsx#L5' },
  { id: '3', date: '2026-05-19', account: '招行借记卡', category: '工资收入', desc: '5月工资', amount: 28500.00, evidence: '招行_202605.csv#L1' },
  { id: '4', date: '2026-05-19', account: '招行借记卡', category: '购物', desc: '京东购物', amount: -199.00, evidence: '招行_202605.csv#L8' },
  { id: '5', date: '2026-05-18', account: '中信信用卡', category: '餐饮', desc: '星巴克', amount: -42.00, evidence: '中信_202605.xlsx#L3' },
  { id: '6', date: '2026-05-18', account: '招行借记卡', category: '住房', desc: '房租转账', amount: -5000.00, evidence: '招行_202605.csv#L2' },
  { id: '7', date: '2026-05-17', account: '中信信用卡', category: '娱乐', desc: '电影票', amount: -78.00, evidence: '中信_202605.xlsx#L7' },
  { id: '8', date: '2026-05-17', account: '招行借记卡', category: '日用', desc: '超市购物', amount: -156.30, evidence: '招行_202605.csv#L10' },
  { id: '9', date: '2026-05-16', account: '中信信用卡', category: '通讯', desc: '手机话费', amount: -50.00, evidence: '中信_202605.xlsx#L9' },
  { id: '10', date: '2026-05-15', account: '招行借记卡', category: '医疗', desc: '药店购药', amount: -86.50, evidence: '招行_202605.csv#L15' },
]

export default function Ledger() {
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleRowClick = (id: string) => {
    setSelectedRow(id)
    setDrawerOpen(true)
  }

  const selectedTx = mockTransactions.find((t) => t.id === selectedRow)

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">交易台账</h1>
        <p className="mt-1 text-sm text-slate-500">所有交易明细，点击行查看证据链</p>
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
          <option value="">全部账户</option>
          <option value="cmb">招行借记卡</option>
          <option value="citic">中信信用卡</option>
        </select>
        <select className="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-slate-600 outline-none focus:border-emerald-500">
          <option value="">全部分类</option>
          <option value="food">餐饮</option>
          <option value="transport">交通</option>
          <option value="shopping">购物</option>
        </select>
        <input
          type="text"
          placeholder="金额区间或关键词"
          className="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-slate-600 outline-none focus:border-emerald-500"
        />
        <button className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-50">
          重置
        </button>
        <div className="flex-1" />
        <span className="text-sm text-slate-400">共 {mockTransactions.length} 条</span>
      </div>

      {/* 主内容：表格 + 证据抽屉 */}
      <div className="flex gap-4">
        {/* 交易表格 */}
        <div className={cn('flex-1 rounded-lg border border-slate-200 bg-white shadow-sm', drawerOpen && 'mr-0')}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                <th className="px-4 py-3 text-left">日期</th>
                <th className="px-4 py-3 text-left">账户</th>
                <th className="px-4 py-3 text-left">分类</th>
                <th className="px-4 py-3 text-left">描述</th>
                <th className="px-4 py-3 text-right">金额</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => handleRowClick(tx.id)}
                  className={cn(
                    'cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50',
                    selectedRow === tx.id && 'bg-emerald-50/50',
                  )}
                >
                  <td className="px-4 py-2.5 text-sm text-slate-600">{tx.date}</td>
                  <td className="px-4 py-2.5 text-sm text-slate-600">{tx.account}</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-sm text-slate-700">{tx.desc}</td>
                  <td
                    className={cn(
                      'px-4 py-2.5 text-right font-mono text-sm font-medium',
                      tx.amount >= 0 ? 'text-emerald-600' : 'text-slate-800',
                    )}
                  >
                    {tx.amount >= 0 ? '+' : ''}{tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 证据抽屉 */}
        {drawerOpen && selectedTx && (
          <div className="w-72 flex-shrink-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-slate-700">证据链</h3>
              <button onClick={() => setDrawerOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400">交易描述</p>
                <p className="text-sm text-slate-700">{selectedTx.desc}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">金额</p>
                <p className="font-mono text-sm font-medium text-slate-800">
                  ¥ {Math.abs(selectedTx.amount).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">来源文件</p>
                <div className="flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-2">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs font-mono text-slate-600">{selectedTx.evidence}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400">分类</p>
                <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                  {selectedTx.category}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-400">置信度</p>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200">
                  <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: '92%' }} />
                </div>
                <p className="mt-1 text-xs text-slate-400">92%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
