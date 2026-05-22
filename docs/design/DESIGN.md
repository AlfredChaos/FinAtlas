# FinAtlas DESIGN

## Design Intent
- 关键词：苹果美学、通透玻璃、浅色主题、专业、可追溯、高密度但不压迫
- 视觉气质：Apple Human Interface 指南下的财务驾驶舱 —— 玻璃质感卡片 + 克制深度感 + 证据驱动的可信交互
- 交互原则：任何关键数字都应能下钻，任何异常都应能解释，任何 AI 结论都应带证据

## Glass Style (Pure CSS)
- 实现方式：纯 CSS glassmorphism（backdrop-blur + 半透明白底 + 精细边框 + 柔和阴影）
- 不使用 `liquid-glass-react` —— 该库内部使用 absolute 定位会破坏文档流，不适合正常页面布局
- 效果特征：毛玻璃模糊、半透明表面、微妙边框、柔和阴影、浅色背景上的通透感

## Layout System
- 桌面优先
- 默认两栏：左侧导航栏、中央工作区
- 高密度表格页面允许切换为双栏
- 卡片化用于摘要，表格与时间线用于事实和过程
- 导航栏使用 `backdrop-blur-xl` + 半透明白底实现玻璃效果

## Color Tokens (Light Theme)
- `bg/base`: `#f1f5f9` 浅灰蓝底色（类似 macOS 浅色桌面）
- `bg/glass`: `rgba(255,255,255,0.70)` 玻璃表面
- `bg/glass-hover`: `rgba(255,255,255,0.85)` 悬浮态
- `text/primary`: `#1e293b` (slate-800) 深色正文
- `text/secondary`: `#475569` (slate-600) 次级文字
- `text/muted`: `#94a3b8` (slate-400) 说明文字
- `accent/positive`: `#10b981` (emerald-500) 翠绿色
- `accent/positive-light`: `#d1fae5` (emerald-100) 浅绿背景
- `accent/warn`: `#f59e0b` (amber-500) 琥珀色
- `accent/danger`: `#ef4444` (red-500) 红色
- `accent/info`: `#06b6d4` (cyan-500) 蓝绿色

## Typography
- 标题：SF Pro Display 风格 —— 系统字体 -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI"
- 正文：SF Pro Text 风格 —— 系统字体 stack
- 数字：font-variant-numeric: tabular-nums，保证金额对齐
- 层级控制在 4 到 5 档，避免过多字号
- 字重：Regular(400)、Medium(500)、Semibold(600)、Bold(700)

## Spacing
- 使用 4 的倍数
- 卡片内边距优先 `16/20/24`
- 页面大区块间距优先 `24/32`
- 表格行高优先兼顾紧凑和可读性

## Components (CSS Glass)
- 指标卡：GlassCard 组件（backdrop-blur-xl + bg-white/70 + 精细边框 + 柔和阴影）
- 导航栏：半透明白底 + backdrop-blur-xl + 右侧边框分隔
- 状态时间线：用于导入步骤与处理状态
- 高密度筛选栏：GlassCard 包裹，固定在页面顶部
- 证据抽屉：GlassCard 包裹，统一承载来源文件、页码、片段、修正历史
- AI 回答卡：GlassCard 包裹，固定结构为结论、口径、引用、缺口
- 按钮：GlassButton 组件，药丸形 rounded-full，主按钮 emerald 强调，次按钮白色玻璃

## Glass Component Configuration
- GlassCard：`bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow`
- GlassButton primary：`bg-emerald-500/15 border-emerald-500/30 text-emerald-600 rounded-full`
- GlassButton secondary：`bg-white/60 border-slate-200/60 text-slate-600 rounded-full`
- 导航栏：`bg-white/80 backdrop-blur-xl border-r border-slate-200/50`
- 顶栏：`bg-white/70 backdrop-blur-xl border-b border-slate-200/50`

## Motion
- 以苹果风格的平滑过渡为主：transition-colors, transition-all
- 上传、状态变化、抽屉展开、问答流转需要明确动效反馈
- 错误与警告优先通过颜色和结构表达，而不是强动画

## Accessibility
- 颜色不是唯一状态表达方式
- 表格、抽屉、表单必须支持键盘操作
- 图表需提供文字摘要或 tooltip
- 错误信息需可读且可定位
- 浅色主题下的玻璃卡片需要确保文字对比度足够
