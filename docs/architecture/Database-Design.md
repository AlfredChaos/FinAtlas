# Database Design

## 总体说明
- 使用 PostgreSQL 作为主数据库
- 结构化数据与快照保存在数据库
- 原始文件和中间产物存于 R2，并通过数据库中的 key 与 pointer 建立引用

## ER 说明
- `account` 管理账户与来源
- `import_job` 管理导入状态机
- `transaction` 管理现金流事实
- `investment_trade` 管理投资事实
- `category` 与 `category_rule` 管理分类体系与自动分类策略
- `monthly_summary` 管理月报快照
- `audit_log` 管理审计记录
- `agent_run` 管理 AI 运行审计与引用

## 表结构概要

| Table | Purpose | Key Fields |
|---|---|---|
| `account` | 账户与来源配置 | `id`, `name`, `source_type`, `account_type`, `settings` |
| `import_job` | 导入作业与状态机 | `id`, `account_id`, `status`, `period`, `file_key`, `file_hash`, `retry_count` |
| `import_item` | 抽取与标准化候选记录 | `id`, `import_job_id`, `pointer`, `raw_payload`, `normalized_payload`, `confidence` |
| `transaction` | 现金流事实 | `id`, `account_id`, `source_import_job_id`, `occurred_at`, `settlement_date`, `amount`, `dedupe_key`, `source_pointer` |
| `investment_trade` | 投资交易事实 | `id`, `account_id`, `source_import_job_id`, `application_date`, `confirmation_date`, `trade_type`, `dividend_mode`, `dedupe_key` |
| `category` | 分类树 | `id`, `parent_id`, `name`, `budget_group`, `enabled` |
| `category_rule` | 分类规则与学习样本 | `id`, `category_id`, `rule_type`, `pattern`, `priority`, `enabled` |
| `monthly_summary` | 月报快照 | `id`, `month`, `snapshot_version`, `summary_payload`, `generated_at` |
| `audit_log` | 审计日志 | `id`, `action_type`, `resource_type`, `resource_id`, `payload`, `created_at` |
| `agent_run` | AI 运行记录 | `id`, `question`, `trace_id`, `status`, `answer_payload`, `created_at` |

## 索引
- `import_job(account_id, period)`
- `import_job(status)`
- `transaction(account_id, occurred_at)`
- `transaction(category_id)`
- `investment_trade(account_id, application_date)`
- `investment_trade(confirmation_date)`
- `monthly_summary(month, snapshot_version)` 唯一
- `audit_log(resource_type, created_at)`

## 外键
- MVP 优先使用逻辑外键与应用层一致性控制
- 如后续迁移复杂度可控，可逐步补充物理外键

## 唯一约束
- `transaction(account_id, dedupe_key)`
- `investment_trade(account_id, dedupe_key)`
- `monthly_summary(month, snapshot_version)`

## 迁移策略
- 使用 Alembic 管理 schema 迁移
- 迁移文件按单一主题拆分，如账户、导入、台账、分类、报表
- 破坏性迁移默认禁止自动执行

## Seed 数据
- 默认管理员账号 `admin / 123456`
- 基础通用预算分类
- 初始来源模板：招行借记卡、中信信用卡、支付宝基金、天天基金、且慢
- 演示用月报与台账样例在后续实现阶段补充

## 领域模型到数据库的映射

| Aggregate | Tables | Consistency Boundary | Transaction Rule | Notes |
|---|---|---|---|---|
| Account Aggregate | `account` | 单账户配置 | 单事务写入 | 信用卡配置需校验账期规则 |
| Import Aggregate | `import_job`, `import_item` | 单导入作业 | 每步骤幂等提交 | 中间产物存 R2，仅索引入库 |
| Transaction Aggregate | `transaction` | 单交易事实 | 单行写入 + 唯一约束 | 保留 `source_pointer` |
| Investment Trade Aggregate | `investment_trade` | 单投资事实 | 单行写入 + 唯一约束 | 默认按申请日记账 |
| Category Aggregates | `category`, `category_rule` | 单分类树或单规则批次 | 批量确认需记录批次 | 支持最近一次回滚 |
| Monthly Summary Aggregate | `monthly_summary` | 单账期快照 | 异步生成后原子写入 | 支持版本化 |
| Agent Run Aggregate | `agent_run`, `audit_log` | 单次问答运行 | 问答完成后写审计 | 存 trace 与引用摘要 |

## 数据一致性策略
- 导入状态机以数据库状态为真相源
- 幂等由文件哈希、去重键与 Redis 锁三层保证
- 月报快照异步生成，读取只读快照不实时重算

## 回滚策略
- 应用迁移失败时回滚到上一个 Alembic revision
- 批量分类支持业务级回滚
- 导入失败通过状态机重试，不直接删除历史作业记录
