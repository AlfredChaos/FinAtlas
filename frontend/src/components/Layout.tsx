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

// 导航项类型
interface NavItem {
  label: string
  path: string
  icon: React.ElementType
  children?: { label: string; path: string }[]
}

// 导航结构定义
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

// 当前月份显示
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

  // 判断当前导航项是否激活（含子路由匹配）
  const isNavActive = (item: NavItem) => {
    if (item.path === '/') return location.pathname === '/'
    if (item.children) {
      return item.children.some((child) => location.pathname.startsWith(child.path))
    }
    return location.pathname.startsWith(item.path)
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* 左侧导航栏 */}
      <aside className="flex w-60 flex-shrink-0 flex-col bg-slate-900 text-slate-300">
        {/* 品牌 */}
        <div className="flex h-16 items-center gap-2 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold text-white">
            F
          </div>
          <span className="text-lg font-semibold text-white">FinAtlas</span>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isNavActive(item)
            const hasChildren = item.children && item.children.length > 0
            const expanded = expandedMenus.includes(item.label)

            return (
              <div key={item.label}>
                {/* 一级导航项 */}
                {hasChildren ? (
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                      active
                        ? 'bg-slate-800 text-emerald-400'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
                    )}
                  >
                    <Icon className="h-4 w-4" />
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
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                      active
                        ? 'bg-slate-800 text-emerald-400'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                )}

                {/* 子菜单 */}
                {hasChildren && expanded && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-3">
                    {item.children!.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          cn(
                            'block rounded-lg px-3 py-2 text-sm transition-colors',
                            isActive
                              ? 'bg-slate-800 text-emerald-400'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
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

        {/* 底部版本信息 */}
        <div className="border-t border-slate-700 px-6 py-3 text-xs text-slate-500">
          v0.1.0 · MVP
        </div>
      </aside>

      {/* 右侧主区域 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 顶部栏 */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
          {/* 左侧：月份选择器 */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600">
            <Calendar className="h-4 w-4" />
            <span>{currentMonth}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </div>

          {/* 中部：全局搜索 */}
          <div className="flex max-w-md flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 mx-6">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索交易、分类、文件..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          {/* 右侧：用户菜单 */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <User className="h-4 w-4" />
              </div>
              <span>admin</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
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
