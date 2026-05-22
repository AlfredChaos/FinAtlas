# FinAtlas MVP 关键能力候选方案调研

## 1. 调研目标

围绕当前既定技术方向 `FastAPI + Agno + PostgreSQL + RabbitMQ + Cloudflare R2`，评估 MVP 关键能力的候选实现方案，重点覆盖：

- 文件上传与对象存储接入
- 异步导入编排与重试回放
- 结构化抽取与 OCR
- 证据链、幂等、审计与可观测
- AI 问答与分类助手
- 单用户鉴权与安全基线

本调研优先服务于 FinAtlas 的 MVP 约束：

- 单用户、自托管、桌面优先
- 以证据为中心
- 导入链路必须异步化、可重试、可回放
- 相同文件与相同交易重复导入不能污染台账
- AI 输出必须可解释、可追溯

## 2. 结论摘要

推荐决策如下：

1. API 与应用骨架：`FastAPI + SQLAlchemy 2.x + Alembic`
2. 对象存储：`R2 私有桶 + 服务端签发 presigned URL + boto3`
3. 异步任务：`Taskiq + taskiq-aio-pika + RabbitMQ`，Redis 仅用于锁、幂等辅助与协调
4. 导入状态机：以 `import_job` 持久化状态机建模，步骤拆分为 `extract -> normalize -> dedupe -> persist -> review -> summarize`
5. CSV/Excel：优先 `pandas + openpyxl`，而不是过早引入更重的导入抽象
6. 文本型 PDF：主选 `pdfplumber`，辅以 `PyMuPDF` 做渲染/定位/回退
7. 扫描 PDF / 图片 OCR：MVP 主选 `Tesseract`，保留 `PaddleOCR` 为 v2 强化路线
8. AI 问答：主选 `Agno + 受控只读工具调用`，不采用直接自由生成 SQL
9. AI 分类：主选 “规则 -> 历史映射 -> AI Top-K 建议” 三层策略，AI 只做建议不直接落库
10. 鉴权：MVP 采用自定义单用户 JWT/Session 方案，不引入 `fastapi-users`
11. 可观测：业务审计与导入审计入 PostgreSQL；Agno tracing 单独存储，避免与业务库强耦合

## 3. 基础组件许可证结论

| 组件 | 角色 | 许可证 | 结论 |
|---|---|---|---|
| FastAPI | API 框架 | MIT | 可直接采用 |
| SQLAlchemy | ORM/SQL Toolkit | MIT | 可直接采用 |
| Alembic | 数据库迁移 | MIT | 可直接采用 |
| Agno | Agent 运行时/编排 | Apache-2.0 | 可直接采用 |
| Taskiq | 异步任务框架 | MIT | 可直接采用 |
| taskiq-aio-pika | RabbitMQ Broker 适配 | MIT | 可直接采用 |
| PostgreSQL | 主数据库 | PostgreSQL License | 可直接采用 |
| RabbitMQ Server | 消息队列 | MPL 2.0 | 可采用，但二次修改分发时需关注文件级 copyleft |
| boto3 | R2 的 S3 兼容 SDK | Apache-2.0 | 可直接采用 |
| pdfplumber | 文本/表格 PDF 抽取 | MIT | 可直接采用 |
| PyMuPDF | PDF 渲染/抽取 | AGPL 或商业许可 | 不建议作为 MVP 默认主依赖 |
| Tesseract | OCR 引擎 | Apache-2.0 | 可直接采用 |
| PaddleOCR | OCR/版面分析 | Apache-2.0 | 可采用，但部署与依赖更重 |

## 4. 关键能力选型

### 4.1 API 与应用骨架

#### 候选方案

| 方案 | 优点 | 缺点 | 许可证 | 推荐度 |
|---|---|---|---|---|
| FastAPI + SQLAlchemy + Alembic | 与既定技术栈一致；类型提示友好；OpenAPI 自动化；生态成熟 | 需要自己约束分层与事务边界 | MIT / MIT / MIT | 高 |
| FastAPI + SQLModel | 上手更快；模型声明更短 | 抽象层对复杂领域模型与迁移细节不够稳；与纯 SQLAlchemy 双轨易混乱 | MIT | 中 |
| Django / Django Ninja | 后台能力成熟 | 偏离既定栈；会引入额外约束与迁移成本 | BSD/MIT 等 | 低 |

#### 推荐决策

- 采用 `FastAPI + SQLAlchemy 2.x + Alembic`
- 原因：
  - 与仓库既定方向完全一致
  - 更适合导入状态机、审计日志、读写分离、事务边界等显式建模
  - 不需要为了单用户 MVP 引入额外脚手架复杂度

### 4.2 文件上传与对象存储

#### 候选方案

| 方案 | 优点 | 缺点 | 许可证 / 属性 | 推荐度 |
|---|---|---|---|---|
| 后端签发 R2 presigned URL，前端直传 R2 | 后端不承载大文件流量；更接近生产形态；天然适合原始文件与中间产物分离 | 需要设计回调或完成确认流程；要处理前端上传失败后的脏对象清理 | R2 为托管服务；boto3 为 Apache-2.0 | 高 |
| 文件先传 FastAPI，再由后端上传到 R2 | 逻辑最直观；更容易统一鉴权与校验 | API 节点承受文件带宽和内存压力；后续扩展性差 | 同上 | 中 |
| 直接使用公有桶 URL | 实现简单 | 与隐私、证据链、安全要求冲突 | 不适用 | 低 |

#### 推荐决策

- 采用 `R2 私有桶 + presigned PUT/GET URL + 服务端记录 file_hash/object_key/metadata`
- 理由：
  - 满足 PRD 对私有桶与短期签名 URL 的要求
  - 上传与下载都能脱离 API 节点的大文件中转
  - 便于同一对象上挂载原始文件、抽取 JSON、OCR 结果、错误快照等中间产物

#### 落地要点

- 上传前先向后端申请 `upload_session`
- 对象 key 采用 `source_type/period/job_id/original_filename`
- 数据库记录 `file_hash`, `content_type`, `size`, `uploaded_by`, `storage_key`
- 上传完成后由前端调用确认接口创建 `import_job`

### 4.3 异步导入编排与状态机

#### 候选方案

| 方案 | 优点 | 缺点 | 许可证 | 推荐度 |
|---|---|---|---|---|
| Taskiq + taskiq-aio-pika + RabbitMQ | 与既定方向一致；原生 async 体验好；Python 类型友好；比 Celery 更贴合 async FastAPI | 社区体量小于 Celery；需要自己定义更多运营规范 | MIT / MIT / MPL 2.0 | 高 |
| Celery + RabbitMQ | 生态成熟；资料多 | 同步历史包袱较重；对 async FastAPI 体验不如 Taskiq 清爽 | BSD | 中 |
| Dramatiq + RabbitMQ / Redis | 体验简洁；重试机制清晰 | 与项目既定方向不一致；生态与资料少于 Celery | BSD | 中 |

#### 推荐决策

- 采用 `Taskiq + taskiq-aio-pika + RabbitMQ`
- Redis 不承担主队列角色，只承担：
  - 分布式锁
  - 幂等辅助缓存
  - 并发协调
  - 可选速率限制

#### 推荐的作业步骤

1. `uploaded`
2. `extracting`
3. `normalizing`
4. `deduping`
5. `persisting`
6. `needs_review`
7. `completed`
8. `failed`

#### 设计建议

- 业务真相在 PostgreSQL，不在消息系统
- 消息至少包含：`job_id`, `step`, `attempt`, `trace_id`
- 每一步都幂等，可单独重放
- 失败信息必须落库并定位到步骤与原始证据位置
- RabbitMQ 建议启用 DLQ，导入失败与系统异常分流

### 4.4 幂等、去重与可回放

#### 候选方案

| 方案 | 优点 | 缺点 | 适配度 |
|---|---|---|---|
| `file_hash` + 数据库唯一约束双层兜底 | 同时覆盖“文件重复导入”和“行级重复写入” | 需要定义稳定的 `dedupe_key` 规则 | 高 |
| 仅依赖 Redis 去重 | 实现快 | 断电或过期后不可靠，无法作为审计真相源 | 低 |
| 仅依赖应用层判重 | 灵活 | 并发下不可靠，易被绕过 | 低 |

#### 推荐决策

- 采用三层策略：
  - 文件级：`file_hash`
  - 记录级：`account_id + dedupe_key` 唯一约束
  - 并发级：Redis 锁避免同一 `job_id` 并发执行

#### dedupe_key 建议

- 银行/信用卡交易：`日期 + 金额 + 对手方 + 来源侧流水标识`
- 基金交易：`平台 + 基金代码 + 交易类型 + 申请日 + 金额/份额`
- 无稳定外部流水号时，采用标准化后的 canonical string 再哈希

### 4.5 CSV / Excel 结构化抽取

#### 候选方案

| 方案 | 优点 | 缺点 | 许可证 | 推荐度 |
|---|---|---|---|---|
| pandas + openpyxl | 生态成熟；实现快；对财务表格足够 | 大文件内存占用较高；需要自己做字段映射约束 | BSD / MIT | 高 |
| polars + openpyxl | 速度更快；表达更现代 | 团队认知成本更高；MVP 下收益有限 | MIT | 中 |
| 自定义 csv / openpyxl 原生解析 | 依赖更少；行为可控 | 开发工作量更大；重复造轮子 | Python stdlib / MIT | 中 |

#### 推荐决策

- MVP 采用 `pandas + openpyxl`
- 理由：
  - 最快支撑来源模板映射、日期格式处理、金额正负归一
  - 数据量在单用户月度导入下通常可控
  - 后续若出现性能瓶颈，再对热点来源切换到更轻量实现

### 4.6 文本型 PDF 抽取

#### 候选方案

| 方案 | 优点 | 缺点 | 许可证 | 推荐度 |
|---|---|---|---|---|
| pdfplumber | 对文本对象、表格、坐标与可视化调试友好；适合账单解析 | 对扫描件无能为力；性能不是最强 | MIT | 高 |
| PyMuPDF | 渲染强、速度快、坐标能力强 | 默认许可证为 AGPL 或商业许可，闭源/私有项目要谨慎 | AGPL / 商业 | 中 |
| 纯 pdfminer.six | 底层能力足够 | 开发复杂度高，表格抽取体验差 | MIT | 低 |

#### 推荐决策

- MVP 主选 `pdfplumber`
- 仅在以下场景考虑引入 `PyMuPDF` 作为辅助手段：
  - 将 PDF 页渲染成图片供 OCR
  - 需要更稳定的页级坐标或截图能力

#### 许可证注意

- `PyMuPDF` 对私有、非开源系统存在许可证敏感性
- 若项目短期内不准备购买商业许可，MVP 不应把 `PyMuPDF` 作为核心主路径依赖

### 4.7 扫描 PDF / 图片 OCR

#### 候选方案

| 方案 | 优点 | 缺点 | 许可证 | 推荐度 |
|---|---|---|---|---|
| Tesseract | 轻量、成熟、离线、部署简单、许可证宽松 | 中文与复杂版面精度通常弱于 PaddleOCR；表格理解能力有限 | Apache-2.0 | 高 |
| PaddleOCR | 中文友好；检测、方向分类、版面理解更强；适合票据/账单复杂版面 | 依赖更重；镜像更大；CPU 部署成本更高 | Apache-2.0 | 中高 |
| 云 OCR API | 精度高、开箱即用 | 付费、隐私与外部依赖问题明显，不符合当前默认自托管方向 | 商业服务 | 低 |

#### 推荐决策

- MVP 主选 `Tesseract`
- v2 强化路线保留 `PaddleOCR`

#### 原因

- 当前还没有真实样本，先用更轻、更稳定、许可证更简单的离线 OCR 完成端到端链路
- 一旦样本显示中文扫描账单精度不足，再升级到 `PaddleOCR`

#### 升级触发条件

- 中文扫描 PDF 成功率连续低于目标
- 低置信度复核比例过高
- 需要表格结构恢复或版面分区能力

### 4.8 AI 问答能力

#### 候选方案

| 方案 | 优点 | 缺点 | 适配度 |
|---|---|---|---|
| Agno + 受控工具调用（查询 API / 聚合服务） | 可控；安全；输出容易附带口径与证据链接；便于审计 | 需要先建设工具层和读模型 | 高 |
| Agent 直接生成 SQL 并执行 | 实现快；灵活 | 安全风险高；口径漂移风险高；证据链不稳定 | 低 |
| RAG 直接问原始文档 | 对非结构化文本友好 | 不适合财务聚合；口径和数值正确性难保障 | 低 |

#### 推荐决策

- 采用 `Agno + 只读工具调用`
- 工具边界建议：
  - `query_cashflow_summary(month)`
  - `query_category_spend(month, category)`
  - `query_credit_card_repayment_plan(month)`
  - `query_investment_net_flow(period)`
  - `build_evidence_links(filters)`

#### 输出要求

- `answer`
- `basis` 或 `calculation_method`
- `evidence_links`
- `data_gaps`

### 4.9 AI 分类助手

#### 候选方案

| 方案 | 优点 | 缺点 | 适配度 |
|---|---|---|---|
| 规则引擎 -> 历史映射 -> AI Top-K 建议 | 可解释、可回滚、符合业务闭环 | 需要设计命中优先级与反馈写回 | 高 |
| 纯 AI 自动分类并直接入库 | 开发快 | 不可控；回归风险高；审计难 | 低 |
| 只做规则，无 AI | 最稳 | 冷启动体验差 | 中 |

#### 推荐决策

- 采用三层策略：
  1. 用户显式规则
  2. 历史确认映射
  3. AI 候选分类

- AI 只返回：
  - `top_k_categories`
  - `confidence`
  - `reasons`

- 最终确认必须由用户触发，确认后再写入规则或样本

### 4.10 单用户鉴权与权限基线

#### 候选方案

| 方案 | 优点 | 缺点 | 许可证 | 推荐度 |
|---|---|---|---|---|
| 自定义单用户 JWT / Session | 最小实现；边界清晰；易于按项目需求裁剪 | 需要自己写少量安全基线代码 | FastAPI MIT | 高 |
| fastapi-users | 功能完整；现成注册/登录/重置密码 | 对单用户 MVP 过重；会引入多余模型和流程 | MIT | 中 |
| 外部 IdP / OAuth 平台 | 安全能力强 | 对单用户自托管 MVP 过度设计 | 各异 | 低 |

#### 推荐决策

- 采用自定义单用户鉴权
- 最小能力：
  - 管理员账号密码登录
  - HttpOnly Cookie 或 Bearer JWT
  - 会话校验
  - 登出
  - 审计日志

- 预留未来扩展：
  - user 表结构
  - role 字段
  - ownership 字段

### 4.11 审计、Tracing 与可观测

#### 候选方案

| 方案 | 优点 | 缺点 | 适配度 |
|---|---|---|---|
| PostgreSQL 业务审计 + Agno tracing 独立存储 | 业务真相与 AI tracing 分离；利于保留周期与权限隔离 | 需要维护两类观测数据 | 高 |
| 全部写入同一个业务库 | 实现简单 | 业务数据与 AI trace 强耦合；扩容和清理困难 | 中 |
| 仅日志文件 | 简单 | 查询弱、审计差、恢复差 | 低 |

#### 推荐决策

- 采用“双轨观测”：
  - PostgreSQL：导入作业、状态迁移、重试、手工修正、批量分类、操作审计
  - Agno tracing DB：agent run、tool call、模型调用、输出摘要

- 关键观测指标：
  - 导入每步耗时
  - 队列积压
  - 重试次数
  - 低置信度比例
  - 月报生成耗时
  - AI 工具调用失败率

## 5. 风险与取舍

### 5.1 主要风险

1. `PyMuPDF` 许可证对私有项目存在敏感性，不适合作为默认核心依赖
2. `RabbitMQ` 的 MPL 2.0 对日常使用影响不大，但若未来分发修改版 server/plugin 需复核许可证义务
3. OCR 真实质量强依赖样本，目前没有真实账单，必须通过样本验收再锁死 OCR 方案
4. 直接让 Agent 生成 SQL 虽然实现快，但会明显提升错误口径与安全风险

### 5.2 MVP 应坚持的取舍

- 先保证“可追溯、可重试、可复核”，再追求“更智能”
- 先保证结构化读模型正确，再做 AI 问答增强
- 先用轻量 OCR 跑通链路，再依据样本升级到更重模型
- 先把证据链和审计建好，再扩展更多来源模板

## 6. 最终推荐技术决策

### 6.1 MVP 决策包

| 领域 | 推荐决策 |
|---|---|
| API | FastAPI |
| ORM / Migration | SQLAlchemy 2.x + Alembic |
| DB | PostgreSQL 16 |
| Queue | RabbitMQ |
| Task Runtime | Taskiq + taskiq-aio-pika |
| Coordination | Redis |
| Storage | R2 私有桶 + presigned URL + boto3 |
| CSV / Excel | pandas + openpyxl |
| Text PDF | pdfplumber |
| OCR | Tesseract |
| AI Runtime | Agno |
| AI Query Path | 受控只读工具调用 |
| AI Categorization | 规则 -> 历史映射 -> AI 建议 |
| Auth | 自定义单用户 JWT / Session |
| Observability | PostgreSQL 审计 + Agno tracing 独立存储 |

### 6.2 不建议在 MVP 首期引入

- 多租户/复杂 RBAC
- 直接 Text-to-SQL 自由查询
- 云 OCR / 商业文档解析服务
- 以 `PyMuPDF` 作为默认主抽取引擎
- 为单用户场景引入完整用户管理框架

## 7. 后续落地顺序建议

1. 先搭骨架：FastAPI、SQLAlchemy、Alembic、Taskiq、RabbitMQ、R2 网关
2. 再做导入主链路：上传 -> 创建作业 -> extract -> normalize -> dedupe -> persist
3. 再补证据链和复核 UI
4. 再做月报快照
5. 最后接入 Agno 问答与 AI 分类建议

## 8. 参考来源

- FastAPI 许可证与框架说明：<https://fastapi.tiangolo.com/>、<https://github.com/fastapi/fastapi/blob/master/LICENSE>
- SQLAlchemy 许可证：<https://github.com/sqlalchemy/sqlalchemy/blob/main/LICENSE>
- Alembic 许可证：<https://github.com/sqlalchemy/alembic/>、<https://pypi.org/project/alembic/>
- Agno tracing 与项目说明：<https://docs.agno.com/tracing/usage/basic-agent-tracing>、<https://github.com/agno-agi/agno>
- Taskiq 与 AioPika broker：<https://taskiq-python.github.io/>、<https://github.com/taskiq-python/taskiq-aio-pika>
- PostgreSQL 许可证：<https://www.postgresql.org/about/licence/>
- RabbitMQ 许可证：<https://github.com/rabbitmq/rabbitmq-server/blob/main/LICENSE>、<https://github.com/rabbitmq/rabbitmq-server/blob/main/README.md>
- R2 presigned URL：<https://developers.cloudflare.com/r2/api/s3/presigned-urls/>
- R2 上传方式：<https://developers.cloudflare.com/r2/objects/upload-objects/>
- boto3 许可证：<https://github.com/boto/boto3/blob/develop/LICENSE>
- pdfplumber：<https://pypi.org/project/pdfplumber/>
- PyMuPDF 许可证说明：<https://pymupdf.readthedocs.io/en/latest/about.html>
- PaddleOCR 许可证：<https://github.com/PaddlePaddle/PaddleOCR/blob/main/LICENSE>
- Tesseract 许可证：<https://github.com/tesseract-ocr/tesseract/blob/main/LICENSE>
