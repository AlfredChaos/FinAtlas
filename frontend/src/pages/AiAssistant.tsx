import { useState } from 'react'
import { Send, FileText, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import GlassCard from '@/components/GlassCard'
import GlassButton from '@/components/GlassButton'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  evidence?: string[]
  timestamp: string
}

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: '本月消费与上月相比如何？',
    timestamp: '10:30',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      '根据台账数据，2026年5月总支出为 ¥15,230.50，较4月（¥14,800.00）增长了 2.9%。主要增长来自购物类支出（+¥800），餐饮和交通基本持平。住房支出保持不变。',
    evidence: ['招行_202605.csv', '中信_202605.xlsx', '招行_202604.csv'],
    timestamp: '10:30',
  },
]

const suggestedQuestions = [
  '本月消费与上月相比如何？',
  '我的储蓄率是否健康？',
  '哪类支出占比最高？',
  '本月有哪些异常支出？',
  '投资组合表现如何？',
  '帮我分析餐饮消费趋势',
  '本月房租占收入比例？',
  '哪些订阅服务可以优化？',
]

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [input, setInput] = useState('')
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>(
    mockMessages.find((m) => m.role === 'assistant')?.evidence || [],
  )

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '（模拟回复）我正在分析您的财务数据，该功能将在接入 LLM 后启用。',
        evidence: ['招行_202605.csv'],
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiMsg])
      setSelectedEvidence(aiMsg.evidence || [])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-semibold text-white">AI 助手</h1>
        <p className="mt-1 text-sm text-white/50">基于你的财务数据进行智能问答</p>
      </div>

      <div className="flex gap-4" style={{ height: 'calc(100vh - 220px)' }}>
        {/* 左侧：推荐问题 */}
        <GlassCard cornerRadius={16} padding="p-4" className="w-56 flex-shrink-0">
          <h3 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-white/90">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            推荐问题
          </h3>
          <div className="space-y-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setInput(q)}
                className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-left text-xs text-white/60 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/[0.06] hover:text-emerald-400"
              >
                {q}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* 中部：对话区 */}
        <GlassCard cornerRadius={16} padding="p-0" className="flex flex-1 flex-col">
          {/* 消息列表 */}
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex',
                  msg.role === 'user' ? 'justify-end' : 'justify-start',
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    msg.role === 'user'
                      ? 'bg-emerald-500/20 text-white'
                      : 'bg-white/[0.06] text-white/80',
                  )}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  {msg.evidence && msg.evidence.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.evidence.map((ev) => (
                        <span
                          key={ev}
                          onClick={() => setSelectedEvidence(msg.evidence || [])}
                          className={cn(
                            'inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-xs',
                            msg.role === 'user'
                              ? 'bg-emerald-500/30 text-emerald-200'
                              : 'bg-emerald-500/15 text-emerald-400',
                          )}
                        >
                          <FileText className="h-3 w-3" />
                          {ev}
                        </span>
                      ))}
                    </div>
                  )}
                  <p
                    className={cn(
                      'mt-1 text-xs',
                      msg.role === 'user' ? 'text-white/40' : 'text-white/30',
                    )}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 输入区 */}
          <div className="border-t border-white/[0.08] p-4">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入你的财务问题..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
              />
              <GlassButton
                onClick={handleSend}
                variant="primary"
                disabled={!input.trim()}
                className="flex items-center justify-center px-4"
              >
                <Send className="h-4 w-4" />
              </GlassButton>
            </div>
          </div>
        </GlassCard>

        {/* 右侧：证据引用区 */}
        <GlassCard cornerRadius={16} padding="p-4" className="w-60 flex-shrink-0">
          <h3 className="mb-3 text-sm font-medium text-white/90">证据引用</h3>
          {selectedEvidence.length > 0 ? (
            <div className="space-y-2">
              {selectedEvidence.map((ev) => (
                <div
                  key={ev}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium text-white/80">{ev}</span>
                  </div>
                  <p className="mt-1 text-xs text-white/40">数据来源文件</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/40">点击回复中的证据标签查看详情</p>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
