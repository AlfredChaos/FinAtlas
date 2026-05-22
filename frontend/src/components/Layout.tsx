import { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Upload,
  BookOpen,
  TrendingUp,
  Tags,
  BarChart3,
  Bot,
  Settings,
  ChevronDown,
  Search,
  Calendar,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  path: string
  icon: React.ElementType
  children?: { label: string; path: string }[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: '导入中心', path: '/imports', icon: Upload },
  {
    label: '台账',
    path: '/ledger',
    icon: BookOpen,
    children: [
      { label: '交易台账', path: '/ledger' },
      { label: '投资台账', path: '/investments' },
    ],
  },
  { label: '分类管理', path: '/categories', icon: Tags },
  { label: '月报中心', path: '/reports/2026-05', icon: BarChart3 },
  { label: 'AI 助手', path: '/ai', icon: Bot },
  {
    label: '设置',
    path: '/settings/accounts',
    icon: Settings,
    children: [
      { label: '账户与来源', path: '/settings/accounts' },
      { label: '审计日志', path: '/settings/audit' },
    ],
  },
]

const currentMonth = '2026年5月'

export default function Layout() {
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['台账', '设置'])
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    )
  }

  const isNavActive = (item: NavItem) => {
    if (item.path === '/') return location.pathname === '/'
    if (item.children) {
      return item.children.some((child) => location.pathname.startsWith(child.path))
    }
    return location.pathname.startsWith(item.path)
  }

  return (
    <div className="flex h-screen bg-[#f1f5f9]">
      {/* 左侧导航栏 */}
      <aside className="w-60 flex-shrink-0 flex flex-col bg-white/80 backdrop-blur-xl border-r border-slate-200/50">
        {/* 品牌 */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-sm font-bold text-white shadow-sm">
            F
          </div>
          <span className="text-lg font-semibold text-slate-800">FinAtlas</span>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isNavActive(item)
            const hasChildren = item.children && item.children.length > 0
            const expanded = expandedMenus.includes(item.label)

            return (
              <div key={item.label}>
                {hasChildren ? (
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                      active
                        ? 'bg-emerald-50 text-emerald-600 font-medium'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform',
                        expanded && 'rotate-180',
                      )}
                    />
                  </button>
                ) : (
                  <NavLink
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                      active
                        ? 'bg-emerald-50 text-emerald-600 font-medium'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                )}

                {hasChildren && expanded && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-200 pl-3">
                    {item.children!.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          cn(
                            'block rounded-lg px-3 py-2 text-sm transition-colors',
                            isActive
                              ? 'text-emerald-600 font-medium'
                              : 'text-slate-400 hover:text-slate-600',
                          )
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}
          )}
        </nav>

        {/* 底部版本信息 */}
        <div className="border-t border-slate-100 px-6 py-3 text-xs text-slate-400">
          v0.1.0 · MVP
        </div>
      </aside>

      {/* 右侧主区域 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 顶部栏 */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between bg-white/70 backdrop-blur-xl border-b border-slate-200/50 px-6">
          {/* 月份选择器 */}
          <MonthSelector />

          {/* 全局搜索 */}
          <div className="flex max-w-md flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-3 py-1.5 mx-6 shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索交易、分类、文件..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-700"
            />
          </div>

          {/* 用户菜单 */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <User className="h-4 w-4" />
              </div>
              <span>admin</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-lg z-50">
                <button className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50">
                  个人设置
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50">
                  退出登录
                </button>
              </div>
            )}
          </div>
        </header>

        {/* 主内容区 */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function MonthSelector() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const months = [
    '2026年5月', '2026年4月', '2026年3月',
    '2026年2月', '2026年1月', '2025年12月',
  ]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/60 px-3 py-1.5 text-sm text-slate-600 hover:border-emerald-400 hover:bg-white/70 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <Calendar className="h-4 w-4 text-slate-400" />
        <span>{currentMonth}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          className="absolute left-0 mt-1 w-40 overflow-hidden rounded-xl border border-slate-200/60 bg-white/90 backdrop-blur-xl py-1"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.04)' }}
        >
          {months.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setOpen(false)}
              className={cn(
                'flex w-full items-center px-3 py-2 text-sm transition-colors',
                m === currentMonth
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50',
              )}
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
