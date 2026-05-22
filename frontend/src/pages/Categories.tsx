import { useState } from 'react'
import { ChevronRight, ChevronDown, Plus, Edit2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import GlassCard from '@/components/GlassCard'
import GlassButton from '@/components/GlassButton'

interface Category {
  id: string
  name: string
  icon?: string
  children?: Category[]
}

const categoryTree: Category[] = [
  {
    id: 'income',
    name: '收入',
    children: [
      { id: 'salary', name: '工资收入' },
      { id: 'bonus', name: '奖金' },
      { id: 'investment_income', name: '投资收益' },
      { id: 'other_income', name: '其他收入' },
    ],
  },
  {
    id: 'housing',
    name: '住房',
    children: [
      { id: 'rent', name: '房租' },
      { id: 'property_fee', name: '物业费' },
      { id: 'utility', name: '水电燃气' },
    ],
  },
  {
    id: 'food',
    name: '餐饮',
    children: [
      { id: 'dine_out', name: '外出就餐' },
      { id: 'takeout', name: '外卖' },
      { id: 'grocery', name: '食材采购' },
    ],
  },
  {
    id: 'transport',
    name: '交通',
    children: [
      { id: 'taxi', name: '打车/网约车' },
      { id: 'public_transport', name: '公共交通' },
      { id: 'fuel', name: '加油' },
    ],
  },
  {
    id: 'shopping',
    name: '购物',
    children: [
      { id: 'clothing', name: '服装' },
      { id: 'electronics', name: '电子产品' },
      { id: 'daily_goods', name: '日用品' },
    ],
  },
  {
    id: 'entertainment',
    name: '娱乐',
    children: [
      { id: 'movie', name: '电影/演出' },
      { id: 'game', name: '游戏' },
      { id: 'travel', name: '旅行' },
    ],
  },
  {
    id: 'medical',
    name: '医疗健康',
    children: [
      { id: 'pharmacy', name: '药品' },
      { id: 'hospital', name: '门诊' },
    ],
  },
]

const mockRules = [
  { id: '1', pattern: '美团*', category: '外卖', priority: 1, hits: 35, active: true },
  { id: '2', pattern: '滴滴*', category: '打车/网约车', priority: 1, hits: 22, active: true },
  { id: '3', pattern: '京东*', category: '购物', priority: 2, hits: 18, active: true },
  { id: '4', pattern: '星巴克*', category: '外出就餐', priority: 1, hits: 12, active: true },
  { id: '5', pattern: '房租*', category: '房租', priority: 1, hits: 5, active: true },
  { id: '6', pattern: '话费*', category: '通讯', priority: 2, hits: 3, active: false },
]

export default function Categories() {
  const [expandedNodes, setExpandedNodes] = useState<string[]>(
    categoryTree.map((c) => c.id),
  )
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id],
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">分类管理</h1>
          <p className="mt-1 text-sm text-white/50">管理消费分类和自动分类规则</p>
        </div>
        <GlassButton variant="primary">
          <Plus className="mr-1.5 h-4 w-4" />
          添加分类
        </GlassButton>
      </div>

      <div className="flex gap-6">
        {/* 左侧：分类树 */}
        <GlassCard cornerRadius={16} padding="p-4" className="w-72 flex-shrink-0">
          <h2 className="mb-3 font-medium text-white/90">分类体系</h2>
          <div className="space-y-0.5">
            {categoryTree.map((cat) => {
              const expanded = expandedNodes.includes(cat.id)
              return (
                <div key={cat.id}>
                  <button
                    onClick={() => toggleNode(cat.id)}
                    className={cn(
                      'flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-white/[0.06]',
                      selectedCategory === cat.id && 'bg-emerald-500/[0.1] text-emerald-400',
                    )}
                  >
                    {expanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-white/30" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-white/30" />
                    )}
                    <span className={cn('font-medium', selectedCategory === cat.id ? 'text-emerald-400' : 'text-white/80')}>{cat.name}</span>
                    <span className="ml-auto text-xs text-white/30">{cat.children?.length}</span>
                  </button>
                  {expanded && cat.children && (
                    <div className="ml-5 space-y-0.5">
                      {cat.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => setSelectedCategory(child.id)}
                          className={cn(
                            'flex w-full items-center rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-white/[0.06]',
                            selectedCategory === child.id
                              ? 'bg-emerald-500/[0.1] text-emerald-400'
                              : 'text-white/60',
                          )}
                        >
                          {child.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </GlassCard>

        {/* 右侧：规则表格 */}
        <GlassCard cornerRadius={16} padding="p-0" className="flex-1">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
            <h2 className="font-medium text-white/90">自动分类规则</h2>
            <GlassButton variant="primary" className="text-xs">
              <Plus className="mr-1 h-3.5 w-3.5" />
              添加规则
            </GlassButton>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs font-medium text-white/40">
                <th className="px-4 py-2.5 text-left">匹配模式</th>
                <th className="px-4 py-2.5 text-left">分类</th>
                <th className="px-4 py-2.5 text-center">优先级</th>
                <th className="px-4 py-2.5 text-center">命中次数</th>
                <th className="px-4 py-2.5 text-center">状态</th>
                <th className="px-4 py-2.5 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {mockRules.map((rule) => (
                <tr key={rule.id} className="border-b border-white/[0.06] hover:bg-white/[0.04]">
                  <td className="px-4 py-2.5 font-mono text-sm text-white/80">{rule.pattern}</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-white/60">
                      {rule.category}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center text-sm text-white/60">{rule.priority}</td>
                  <td className="px-4 py-2.5 text-center font-mono text-sm text-white/60">
                    {rule.hits}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        rule.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.06] text-white/40',
                      )}
                    >
                      {rule.active ? '启用' : '停用'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button className="text-white/30 hover:text-white/60">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>
    </div>
  )
}
