import { useState } from 'react'
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
    <div className="flex h-screen">
      {/* 左侧导航栏 - glassmorphism */}
      <aside
        className={cn(
          'flex w-60 flex-shrink-0 flex-col',
          'bg-white/[0.04] backdrop-blur-2xl',
          'border-r border-white/[0.08]',
          'shadow-[4px_0_24px_rgba(0,0,0,0.2)]',
          'text-white/70',
        )}
      >
        {/* 品牌标识 */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-white/[0.06]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white shadow-[0_0_16px_rgba(52,211,153,0.3)]">
            F
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">FinAtlas</span>
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
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                      active
                        ? 'bg-white/[0.08] text-emerald-400 shadow-[inset_0_0_0_1px_rgba(52,211,153,0.15)]'
                        : 'text-white/50 hover:bg-white/[0.06] hover:text-white/80',
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-200',
                        expanded && 'rotate-180',
                      )}
                    />
                  </button>
                ) : (
                  <NavLink
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                      active
                        ? 'bg-white/[0.08] text-emerald-400 shadow-[inset_0_0_0_1px_rgba(52,211,153,0.15)]'
                        : 'text-white/50 hover:bg-white/[0.06] hover:text-white/80',
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    <span>{item.label}</span>
                  </NavLink>
                )}

                {hasChildren && expanded && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/[0.08] pl-3">
                    {item.children!.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          cn(
                            'block rounded-lg px-3 py-2 text-sm transition-all duration-200',
                            isActive
                              ? 'bg-white/[0.06] text-emerald-400'
                              : 'text-white/45 hover:bg-white/[0.04] hover:text-white/70',
                          )
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* 底部版本 */}
        <div className="border-t border-white/[0.06] px-6 py-3 text-xs text-white/25">
          v0.1.0 · MVP
        </div>
      </aside>

      {/* 右侧主区域 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 顶部栏 - glassmorphism */}
        <header
          className={cn(
            'flex h-16 flex-shrink-0 items-center justify-between',
            'bg-white/[0.03] backdrop-blur-xl',
            'border-b border-white/[0.06]',
            'px-6',
          )}
        >
          {/* 月份选择器 */}
          <div className="flex items-center gap-2 rounded-xl bg-white/[0.05] border border-white/[0.08] px-3.5 py-2 text-sm text-white/70 hover:bg-white/[0.07] transition-colors cursor-pointer">
            <Calendar className="h-4 w-4 text-emerald-400" />
            <span>{currentMonth}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </div>

          {/* 全局搜索 */}
          <div className="flex max-w-md flex-1 items-center gap-2 rounded-xl bg-white/[0.05] border border-white/[0.08] px-3.5 py-2 mx-6 focus-within:border-emerald-500/30 transition-colors">
            <Search className="h-4 w-4 text-white/30" />
            <input
              type="text"
              placeholder="搜索交易、分类、文件..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/30"
            />
          </div>

          {/* 用户菜单 */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-white/[0.06] transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/20">
                <User className="h-4 w-4" />
              </div>
              <span>admin</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-white/[0.10] bg-[#1a1a2e]/95 backdrop-blur-xl py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50">
                <button className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:bg-white/[0.06] transition-colors">
                  个人设置
                </button>
                <button className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:bg-white/[0.06] transition-colors">
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
