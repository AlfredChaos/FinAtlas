# UI-UX Design

## 设计目标
- 让用户以最低月度操作成本完成导入、复核、分析和复盘
- 让每个关键数字、分类结果和 AI 回答都可解释、可回溯
- 在高信息密度下保持清晰层级和稳定导航
- 采用 Apple Human Interface 风格 + 纯 CSS 玻璃质感，传达通透、专业、可信的产品气质

## 设计风格选择理由
- 采用 Apple Human Interface 风格 + CSS glassmorphism 效果
- 原因：用户偏好苹果美学和玻璃视觉效果
- 视觉上应传达通透与专业，通过毛玻璃模糊和柔和阴影增加精致感
- 同时保持财务产品应有的可信度与证据驱动特质
- 实现方式：backdrop-blur + 半透明白底 + 精细边框 + 柔和阴影（不依赖 liquid-glass-react，该库破坏文档流）

## 信息架构
- 一级导航：Dashboard、导入中心、台账、分类管理、月报中心、AI 助手、账户与来源、审计日志
- 顶栏常驻：月份切换、快捷上传、全局问答入口、异常提醒、用户菜单
- 右侧上下文栏统一承载证据、详情、帮助和 AI 口径说明

## 页面结构
- Dashboard：玻璃质感指标卡 + 趋势 + 异常与待办
- 导入中心：玻璃上传区 + 作业列表 + 玻璃详情抽屉
- 台账：玻璃筛选栏 + 表格 + 玻璃证据抽屉
- 分类管理：玻璃分类树 + 规则表 + 命中统计
- 月报中心：纵向分区玻璃卡片 + 每段下钻入口
- AI 助手：推荐问题 + 玻璃对话区 + 引用面板

## 组件系统
- GlassCard —— 玻璃卡片容器（backdrop-blur-xl + bg-white/70 + border + shadow）
- GlassButton —— 玻璃按钮（rounded-full + backdrop-blur-lg + 半透明背景）
- 指标卡片（GlassCard 包裹）
- 趋势图卡片
- 上传面板
- 导入状态时间线
- 高密度筛选栏（GlassCard 包裹）
- 证据抽屉（GlassCard 包裹）
- 分类树与规则表
- 月报分析卡（GlassCard 包裹）
- AI 回答卡与引用卡（GlassCard 包裹）

## 色彩（浅色主题）
- 背景：`#f1f5f9` 浅灰蓝（类似 macOS 浅色桌面）
- 玻璃表面：`rgba(255,255,255,0.70)` backdrop-blur-xl
- 强调色：翠绿色 emerald-500 (#10b981)
- 警告：琥珀色 amber-500 (#f59e0b)
- 错误：红色 red-500 (#ef4444)
- 信息：蓝绿色 cyan-500 (#06b6d4)
- 文字主色：`#1e293b` (slate-800)
- 文字次级：`#475569` (slate-600)
- 文字说明：`#94a3b8` (slate-400)

## 字体
- 系统字体栈：-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif
- 数字启用 tabular-nums 对齐
- 控制字号层级，避免视觉噪音

## 间距
- 使用 4 的倍数作为基础节奏
- 卡片内边距 `16/20/24`
- 页面区块间距 `24/32`

## 圆角
- 玻璃卡片：rounded-2xl (16px)
- 按钮：rounded-full（药丸形）
- 导航项：rounded-xl (12px)
- 表格容器：rounded-2xl (16px)

## 阴影
- 卡片：`0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)`
- 按钮主：`0 2px 8px rgba(16,185,129,0.15)`
- 按钮次：`0 2px 8px rgba(0,0,0,0.04)`
- 下拉菜单：shadow-lg

## 图标
- 使用 lucide-react 线性图标
- 图标颜色 text-slate-400 或 text-emerald-500
- 图标只辅助识别，不取代文字

## 表格
- 高密度、可排序、可筛选、可分页
- 行操作优先通过悬停或末列按钮暴露
- 表格容器使用玻璃效果包裹
- 行 hover 使用 bg-slate-50 微弱高亮

## 表单
- 输入框 bg-slate-50 + border-slate-200
- 聚焦时边框使用 emerald-600
- 分组清晰，错误定位到字段级别
- 危险操作独立区域展示

## 导航
- 左侧导航使用半透明白底 + backdrop-blur-xl
- 选中项使用 emerald-50 背景 + emerald-600 文字
- 页面内部优先用 Tab、抽屉和局部视图切换

## 交互状态
- loading、empty、partial、success、error、stale 六类全局状态统一
- 导入状态严格映射业务状态机
- AI 状态区分思考中、数据不足、工具失败、回答完成

## 加载态
- 使用 skeleton + 玻璃半透明效果
- 避免整页阻塞

## 空状态
- 所有空状态给出下一步动作
- AI 空状态强调"仅基于已导入数据回答"

## 错误态
- 显示步骤、原因、定位信息和可恢复动作
- 不允许只显示模糊的"出错了"

## 成功态
- 显示结果摘要、影响范围和下一步建议
- 批量分类成功后提示学习已生效

## 响应式策略
- 桌面优先
- 1440px 以上支持三栏
- 1024px 到 1439px 双栏
- 小屏以浏览和状态确认为主

## 可访问性要求
- 支持键盘导航
- 状态表达不只依赖颜色
- 图表要有文字摘要
- 表单和错误提示需被屏幕阅读器读取
- 浅色主题下的玻璃卡片文字对比度已确保足够

## 前端实现注意事项
- 使用纯 CSS glassmorphism（backdrop-blur + 半透明白底 + 边框 + 阴影）
- 不使用 liquid-glass-react（内部 absolute 定位破坏文档流）
- 创建 GlassCard / GlassButton 组件作为项目标准
- 关键数字必须具备可点击下钻能力
- 证据面板尽量复用为统一组件
- 报表与 AI 的"口径说明卡"必须前置，而非隐藏在次级交互中
- body 背景使用 `#f1f5f9` 浅色
- 所有玻璃组件基于 Tailwind 的 backdrop-blur 工具类
