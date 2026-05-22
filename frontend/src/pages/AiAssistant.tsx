import { useState } from 'react'
import { Send, FileText, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

// 模拟对话数据
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

// 推荐问题
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

    // 模拟 AI 回复
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
        <h1 className="text-2xl font-semibold text-slate-800">AI 助手</h1>
        <p className="mt-1 text-sm text-slate-500">基于你的财务数据进行智能问答</p>
      </div>

      <div className="flex gap-4" style={{ height: 'calc(100vh - 220px)' }}>
        {/* 左侧：推荐问题 */}
        <div className="w-56 flex-shrink-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            推荐问题
          </h3>
          <div className="space-y-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setInput(q)}
                className="w-full rounded-lg border border-slate-100 px-3 py-2 text-left text-xs text-slate-600 transition-colors hover:border-emerald-200 hover:bg-emerald-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* 中部：对话区 */}
        <div className="flex flex-1 flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
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
                    'max-w-[80%] rounded-lg px-4 py-3',
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-700',
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
                              ? 'bg-emerald-500 text-emerald-100'
                              : 'bg-emerald-50 text-emerald-700',
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
                      msg.role === 'user' ? 'text-emerald-200' : 'text-slate-400',
                    )}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 输入区 */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入你的财务问题..."
                rows={1}
                className="flex-1 resize-none rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="flex items-center justify-center rounded-lg bg-emerald-600 px-4 text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 右侧：证据引用区 */}
        <div className="w-60 flex-shrink-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-medium text-slate-700">证据引用</h3>
          {selectedEvidence.length > 0 ? (
            <div className="space-y-2">
              {selectedEvidence.map((ev) => (
                <div
                  key={ev}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700">{ev}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">数据来源文件</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">点击回复中的证据标签查看详情</p>
          )}
        </div>
      </div>
    </div>
  )
}
