# FinAtlas DESIGN

## Design Intent
- 关键词：苹果美学、液态玻璃、通透、专业、可追溯、高密度但不压迫
- 视觉气质：Apple Human Interface 指南下的财务驾驶舱 —— 液态玻璃卡片 + 克制的深度感 + 证据驱动的可信交互
- 交互原则：任何关键数字都应能下钻，任何异常都应能解释，任何 AI 结论都应带证据

## Apple Liquid Glass Style
- 参考库：`liquid-glass-react`（rdev/liquid-glass-react）
- 核心技术：SVG filter chain（feDisplacementMap + feGaussianBlur + feColorMatrix）+ backdrop-filter + GPU 加速
- 效果特征：边缘折射、色散（chromatic aberration）、弹性交互、霜化透明、高光响应

## Layout System
- 桌面优先
- 默认三栏：左侧液态玻璃导航栏、中央工作区、右侧液态玻璃证据/上下文面板
- 高密度表格页面允许切换为双栏
- 卡片化用于摘要，表格与时间线用于事实和过程
- 导航栏使用 LiquidGlass 包裹，半透明毛玻璃效果

## Color Tokens
- `bg/base`: 渐变背景，深色系（#0a0a1a → #1a1a2e）模拟 macOS 深色桌面
- `bg/glass`: rgba(255,255,255,0.05) 液态玻璃表面
- `bg/glass-hover`: rgba(255,255,255,0.10) 悬浮态
- `text/primary`: rgba(255,255,255,0.95) 高对比白色正文
- `text/muted`: rgba(255,255,255,0.60) 次级说明
- `accent/positive`: #34d399 (emerald-400) 翠绿色
- `accent/warn`: #fbbf24 (amber-400) 琥珀色
- `accent/danger`: #f87171 (red-400) 红色
- `accent/info`: #22d3ee (cyan-400) 蓝绿色

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

## Components (Liquid Glass)
- 指标卡：LiquidGlass 包裹，内部数字优先，辅以状态标签与环比箭头
- 导航栏：LiquidGlass 包裹，侧边导航使用 cornerRadius=20, blurAmount=0.08
- 状态时间线：用于导入步骤与处理状态
- 高密度筛选栏：LiquidGlass 包裹，固定在页面顶部
- 证据抽屉：LiquidGlass 包裹，统一承载来源文件、页码、片段、修正历史
- AI 回答卡：LiquidGlass 包裹，固定结构为结论、口径、引用、缺口
- 按钮：主操作使用 LiquidGlass cornerRadius=100，次要操作使用轻量 glass button

## Liquid Glass Configuration
- 卡片/面板：`displacementScale=70, blurAmount=0.0625, saturation=140, elasticity=0.15, cornerRadius=20, aberrationIntensity=2`
- 导航栏：`displacementScale=50, blurAmount=0.08, saturation=130, elasticity=0.1, cornerRadius=16`
- 按钮：`displacementScale=64, blurAmount=0.1, saturation=130, elasticity=0.35, cornerRadius=100`
- 强调卡片（Dashboard 指标）：`overLight=false, mode="standard"`

## Motion
- 以苹果风格的弹性过渡为主：spring-like easing
- 上传、状态变化、抽屉展开、问答流转需要明确动效反馈
- 液态玻璃的 elasticity 参数提供自然弹性感
- 错误与警告优先通过颜色和结构表达，而不是强动画

## Accessibility
- 颜色不是唯一状态表达方式
- 表格、抽屉、表单必须支持键盘操作
- 图表需提供文字摘要或 tooltip
- 错误信息需可读且可定位
- 液态玻璃效果的 contrast ratio 需要额外关注，确保文字在半透明背景上可读
- Safari/Firefox 对 displacement 效果支持有限，需要 fallback 样式

## Browser Support Note
- Chrome/Edge: 完整支持 SVG filter + backdrop-filter
- Safari: backdrop-filter 支持，但 displacement 效果可能不完整
- Firefox: backdrop-filter 支持，displacement 可能受限
- Fallback: 在不支持 displacement 的浏览器上使用标准 glassmorphism（backdrop-blur + 半透明背景）
