import { FileText, Upload, CheckCircle, AlertCircle, Edit2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import GlassCard from '@/components/GlassCard'

type AuditAction = 'import' | 'parse' | 'classify' | 'update' | 'delete'

const mockAuditLogs = [
  {
    id: '1',
    timestamp: '2026-05-22 14:33:12',
    action: 'import' as AuditAction,
    operator: 'admin',
    detail: '导入文件 招行借记卡_202605.csv，共 42 条记录，跳过 3 条重复',
    source: '招行借记卡_202605.csv',
    status: 'success',
  },
  {
    id: '2',
    timestamp: '2026-05-22 14:33:10',
    action: 'parse' as AuditAction,
    operator: 'system',
    detail: '解析文件 招行借记卡_202605.csv，识别 CSV 格式，42 行有效数据',
    source: '招行借记卡_202605.csv',
    status: 'success',
  },
  {
    id: '3',
    timestamp: '2026-05-22 10:02:45',
    action: 'classify' as AuditAction,
    operator: 'AI',
    detail: '批量分类 15 笔交易，其中 13 笔自动分类，2 笔低置信度待复核',
    source: '中信信用卡_202605.xlsx',
    status: 'warning',
  },
  {
    id: '4',
    timestamp: '2026-05-22 10:01:30',
    action: 'import' as AuditAction,
    operator: 'admin',
    detail: '导入文件 支付宝基金_202605.pdf，共 15 条记录，2 条解析错误',
    source: '支付宝基金_202605.pdf',
    status: 'error',
  },
  {
    id: '5',
    timestamp: '2026-05-22 09:16:00',
    action: 'import' as AuditAction,
    operator: 'admin',
    detail: '导入文件 中信信用卡_202605.xlsx，任务排队中',
    source: '中信信用卡_202605.xlsx',
    status: 'pending',
  },
  {
    id: '6',
    timestamp: '2026-05-21 20:15:00',
    action: 'update' as AuditAction,
    operator: 'admin',
    detail: '手动修改分类：美团外卖 从"其他"改为"外卖"',
    source: null,
    status: 'success',
  },
  {
    id: '7',
    timestamp: '2026-05-21 18:30:00',
    action: 'delete' as AuditAction,
    operator: 'admin',
    detail: '回滚导入任务 #20260518-001（天天基金_202605.csv），删除 22 条记录',
    source: '天天基金_202605.csv',
    status: 'success',
  },
  {
    id: '8',
    timestamp: '2026-05-20 14:32:00',
    action: 'import' as AuditAction,
    operator: 'admin',
    detail: '导入文件 天天基金_202604.csv，共 22 条记录',
    source: '天天基金_202604.csv',
    status: 'success',
  },
]

const actionConfig: Record<AuditAction, { label: string; color: string }> = {
  import: { label: '导入', color: 'bg-blue-500/15 text-blue-400' },
  parse: { label: '解析', color: 'bg-violet-500/15 text-violet-400' },
  classify: { label: '分类', color: 'bg-emerald-500/15 text-emerald-400' },
  update: { label: '修改', color: 'bg-amber-500/15 text-amber-400' },
  delete: { label: '删除', color: 'bg-red-500/15 text-red-400' },
}

const statusIcons: Record<string, React.ElementType> = {
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
  pending: Upload,
}

export default function SettingsAudit() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-semibold text-white">审计日志</h1>
        <p className="mt-1 text-sm text-white/50">所有数据变更与操作记录，可追溯、可审查</p>
      </div>

      {/* 时间轴 */}
      <GlassCard cornerRadius={16} padding="p-6">
        <div className="relative space-y-0">
          {mockAuditLogs.map((log, index) => {
            const actionCfg = actionConfig[log.action]
            const StatusIcon = statusIcons[log.status] || FileText

            return (
              <div key={log.id} className="relative flex gap-4 pb-6 last:pb-0">
                {/* 时间轴线 */}
                {index < mockAuditLogs.length - 1 && (
                  <div className="absolute left-[19px] top-10 h-full w-px bg-white/[0.08]" />
                )}

                {/* 节点图标 */}
                <div
                  className={cn(
                    'relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#1a1a2e] shadow-sm',
                    log.status === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : log.status === 'warning'
                        ? 'bg-amber-500/20 text-amber-400'
                        : log.status === 'error'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-blue-500/20 text-blue-400',
                  )}
                >
                  <StatusIcon className="h-4 w-4" />
                </div>

                {/* 日志内容 */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', actionCfg.color)}>
                      {actionCfg.label}
                    </span>
                    <span className="text-xs text-white/40">{log.timestamp}</span>
                    <span className="text-xs text-white/40">· {log.operator}</span>
                  </div>
                  <p className="mt-1 text-sm text-white/80">{log.detail}</p>
                  {log.source && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-white/40">
                      <FileText className="h-3 w-3" />
                      {log.source}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}
