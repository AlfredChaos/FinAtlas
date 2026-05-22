# Tech Research

## 1. 调研范围
围绕 FinAtlas MVP 所需的对象存储、异步任务、OCR/抽取、AI 工具调用、鉴权与可观测展开方案评估。

## 2. 候选方案表

| Candidate | Use Case | License | Maturity | Pros | Cons | Decision | Reason |
|---|---|---|---|---|---|---|---|
| FastAPI + SQLAlchemy + Alembic | API、领域服务、迁移 | MIT | 高 | 与既定栈一致、类型友好、适合显式分层 | 需要自己约束架构边界 | 采用 | 与导入状态机、审计、读写分离更匹配 |
| SQLModel | 简化 ORM 建模 | MIT | 中 | 上手快 | 复杂领域模型与迁移控制较弱 | 不采用 | MVP 需要更稳的分层与迁移控制 |
| Taskiq + taskiq-aio-pika | 异步任务编排 | MIT | 中高 | Async 体验好、与 FastAPI 协同自然 | 社区不如 Celery 大 | 采用 | 与既定技术方向一致 |
| Celery + RabbitMQ | 异步任务编排 | BSD | 高 | 成熟、资料多 | 历史包袱重、async 体验较弱 | 备选 | 非首选 |
| R2 presigned URL + boto3 | 私有对象存储上传下载 | 托管服务 + Apache-2.0 | 高 | 安全、API 不承载大文件、利于证据链 | 需要上传确认流程 | 采用 | 满足私有桶和证据链要求 |
| FastAPI 中转上传 | 简单上传流程 | 同上 | 高 | 实现简单 | 占用 API 带宽与内存 | 不采用 | 可扩展性差 |
| pandas + openpyxl | CSV/Excel 抽取 | BSD / MIT | 高 | 实现快、生态成熟 | 大文件内存占用偏高 | 采用 | 单用户月度导入量可控 |
| pdfplumber | 文本 PDF 抽取 | MIT | 高 | 坐标、表格、调试友好 | 扫描件无能为力 | 采用 | 作为 MVP 主路径 |
| PyMuPDF | PDF 渲染/辅助抽取 | AGPL / 商业 | 高 | 渲染快、定位强 | 许可证敏感 | 延后 | 如需增强再评估商业许可 |
| Tesseract | OCR | Apache-2.0 | 高 | 轻量、离线、部署简单 | 中文复杂版面精度有限 | 采用 | 先打通闭环 |
| PaddleOCR | OCR/版面分析 | Apache-2.0 | 高 | 中文与复杂版面更强 | 部署更重 | 备选 | 作为 v2 升级路线 |
| Agno + 受控工具调用 | 问答与分类建议 | Apache-2.0 | 中高 | 可控、安全、可附带引用 | 需要先做工具层 | 采用 | 符合可解释与可追溯要求 |
| 直接 Text-to-SQL | AI 查询 | 依赖模型服务 | 中 | 快速灵活 | 安全和口径风险高 | 不采用 | 不满足财务可控性要求 |
| 自定义单用户 JWT/Session | 鉴权 | 项目内实现 | 高 | 简洁、符合单用户 MVP | 需自行维护 | 采用 | 不引入额外框架复杂度 |
| fastapi-users | 鉴权脚手架 | MIT | 高 | 功能全 | 超出 MVP 需要 | 延后 | 后续多用户再考虑 |

## 3. 推荐决策
- API 与迁移：`FastAPI + SQLAlchemy 2.x + Alembic`
- 对象存储：`R2 私有桶 + 后端签发 presigned URL + boto3`
- 异步处理：`Taskiq + taskiq-aio-pika + RabbitMQ`
- 缓存与协调：`Redis` 仅用于锁、幂等辅助、速率限制、协调
- CSV/Excel：`pandas + openpyxl`
- 文本 PDF：`pdfplumber`
- 扫描件 OCR：MVP `Tesseract`，v2 `PaddleOCR`
- AI：`Agno + 受控只读工具调用`
- 鉴权：单用户 `JWT/Session`
- 可观测：业务审计进 PostgreSQL，Agno tracing 单独存储

## 4. 主要技术风险
- OCR 与 PDF 实际效果依赖真实账单样本
- `PyMuPDF` 许可证敏感，不宜直接进入默认依赖
- 直接 Text-to-SQL 易造成安全与口径漂移
- AI Provider 尚未配置，端到端验证会滞后于结构与接口设计

## 5. 结论
- 自研：导入状态机、台账模型、分类学习、月报快照、AI 工具层、审计能力
- 复用开源：FastAPI、SQLAlchemy、Alembic、Taskiq、RabbitMQ、Redis、pdfplumber、Tesseract、Agno
- 第三方服务：Cloudflare R2、未来可插拔 LLM Provider
- 延后能力：PaddleOCR 深化、投资体检高级规则、复杂多用户鉴权
