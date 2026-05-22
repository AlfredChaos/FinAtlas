import { useState } from 'react'
import { Upload, ChevronDown, ChevronRight, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// 来源类型
const sourceOptions = [
  { value: 'cmb_debit', label: '招行借记卡' },
  { value: 'citic_credit', label: '中信信用卡' },
  { value: 'alipay_fund', label: '支付宝基金' },
  { value: 'tiantian_fund', label: '天天基金' },
  { value: 'qieman', label: '且慢' },
]

// 模拟作业数据
const mockJobs = [
  {
    id: '1',
    fileName: '招行借记卡_202605.csv',
    source: '招行借记卡',
    period: '2026-05',
    status: 'completed',
    records: 42,
    duplicates: 3,
    errors: 0,
    uploadedAt: '2026-05-20 14:32',
    completedAt: '2026-05-20 14:33',
  },
  {
    id: '2',
    fileName: '中信信用卡_202605.xlsx',
    source: '中信信用卡',
    period: '2026-05',
    status: 'processing',
    records: 28,
    duplicates: 0,
    errors: 0,
    uploadedAt: '2026-05-22 09:15',
    completedAt: null,
  },
  {
    id: '3',
    fileName: '支付宝基金_202605.pdf',
    source: '支付宝基金',
    period: '2026-05',
    status: 'review',
    records: 15,
    duplicates: 1,
    errors: 2,
    uploadedAt: '2026-05-22 10:00',
    completedAt: null,
  },
]

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  completed: { label: '已完成', color: 'bg-emerald-50 text-emerald-700', icon: CheckCircle },
  processing: { label: '处理中', color: 'bg-blue-50 text-blue-700', icon: Clock },
  review: { label: '待复核', color: 'bg-amber-50 text-amber-700', icon: AlertCircle },
}

export default function ImportCenter() {
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [selectedSource, setSelectedSource] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('2026-05')

  const toggleJob = (id: string) => {
    setExpandedJob(expandedJob === id ? null : id)
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">导入中心</h1>
        <p className="mt-1 text-sm text-slate-500">上传文件、管理导入任务</p>
      </div>

      <div className="flex gap-6">
        {/* 左侧：上传面板 */}
        <div className="w-80 flex-shrink-0 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-medium text-slate-700">新建导入</h2>

            {/* 来源选择 */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm text-slate-600">数据来源</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
              >
                <option value="">请选择来源</option>
                {sourceOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 账期选择 */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm text-slate-600">账期</label>
              <input
                type="month"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
              />
            </div>

            {/* 文件拖拽上传区 */}
            <div className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-emerald-400 hover:bg-emerald-50/30">
              <Upload className="mb-2 h-8 w-8 text-slate-400" />
              <p className="text-sm text-slate-500">拖拽文件到此处</p>
              <p className="mt-1 text-xs text-slate-400">支持 CSV / Excel / PDF / 图片</p>
            </div>

            <button className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
              开始导入
            </button>
          </div>
        </div>

        {/* 右侧：作业列表 */}
        <div className="flex-1">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-medium text-slate-700">导入历史</h2>
            </div>

            {/* 表头 */}
            <div className="grid grid-cols-[1fr_120px_100px_100px_140px] gap-4 border-b border-slate-100 px-5 py-2.5 text-xs font-medium text-slate-500">
              <span>文件名</span>
              <span>来源</span>
              <span>记录数</span>
              <span>状态</span>
              <span>上传时间</span>
            </div>

            {/* 作业行 */}
            {mockJobs.map((job) => {
              const cfg = statusConfig[job.status]
              const StatusIcon = cfg.icon
              const isExpanded = expandedJob === job.id

              return (
                <div key={job.id}>
                  <button
                    onClick={() => toggleJob(job.id)}
                    className="grid w-full grid-cols-[1fr_120px_100px_100px_140px] gap-4 items-center border-b border-slate-100 px-5 py-3 text-left transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                      )}
                      <span className="text-sm text-slate-700">{job.fileName}</span>
                    </div>
                    <span className="text-sm text-slate-600">{job.source}</span>
                    <span className="font-mono text-sm text-slate-600">{job.records}</span>
                    <span className="flex items-center gap-1.5">
                      <StatusIcon className="h-3.5 w-3.5" />
                      <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', cfg.color)}>
                        {cfg.label}
                      </span>
                    </span>
                    <span className="text-sm text-slate-400">{job.uploadedAt}</span>
                  </button>

                  {/* 展开详情 */}
                  {isExpanded && (
                    <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-slate-400">有效记录</p>
                          <p className="font-mono text-sm font-medium text-slate-700">{job.records - job.duplicates - job.errors}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">重复跳过</p>
                          <p className="font-mono text-sm font-medium text-amber-600">{job.duplicates}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">解析错误</p>
                          <p className="font-mono text-sm font-medium text-red-500">{job.errors}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">完成时间</p>
                          <p className="text-sm text-slate-600">{job.completedAt || '—'}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                          查看明细
                        </button>
                        {job.status === 'review' && (
                          <button className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100">
                            复核错误
                          </button>
                        )}
                        {job.status === 'completed' && (
                          <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                            重新导入
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
