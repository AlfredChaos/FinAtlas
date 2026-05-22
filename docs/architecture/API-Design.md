# API Design

## API 设计原则
- Command 与 Query 分离
- 写操作走应用服务，读操作优先走读模型
- 所有关键写操作都要生成审计记录
- 所有响应错误都要返回明确错误码与定位信息
- AI 只通过受控工具或只读接口访问业务数据

## 鉴权方式
- 单用户 MVP 采用 `JWT/Session` 方案
- 登录成功后返回会话令牌或安全 cookie
- 所有写接口和敏感读接口都必须鉴权

## 权限规则
- 当前仅管理员角色
- 管理员可执行所有导入、编辑、报表、分类和 AI 操作
- 后续多用户扩展时保留资源所有权字段，不在本期引入租户模型

## Command API

| Command | Endpoint | Context | Aggregate | Business Rule | Events |
|---|---|---|---|---|---|
| Login | `POST /api/v1/auth/login` | 账户与来源 | 无 | 仅允许有效管理员登录 | AuditLogged |
| CreateAccount | `POST /api/v1/accounts` | 账户与来源 | Account | 信用卡必须具备账期规则 | AccountConfigured |
| UpdateAccount | `PATCH /api/v1/accounts/{id}` | 账户与来源 | Account | 停用账户不可发起新导入 | AccountConfigured |
| CreateUploadSession | `POST /api/v1/imports/upload-sessions` | 导入与证据 | ImportJob | 上传前必须选择来源与账期 | UploadSessionCreated |
| ConfirmUpload | `POST /api/v1/imports/jobs` | 导入与证据 | ImportJob | file_hash 必须记录 | FileUploaded |
| RetryImportJob | `POST /api/v1/imports/jobs/{id}/retry` | 导入与证据 | ImportJob | 仅允许从合法失败步骤重试 | ImportJobStarted |
| ReviewImportItems | `POST /api/v1/imports/jobs/{id}/review` | 导入与证据 | ImportJob | 低置信度必须先复核 | ImportJobCompleted |
| UpdateTransaction | `PATCH /api/v1/ledger/transactions/{id}` | 台账 | Transaction | 必须保留证据引用与审计记录 | TransactionUpdated |
| ConfirmCategories | `POST /api/v1/categories/confirm` | 分类 | CategoryRule | 分类优先级固定 | CategoryConfirmed |
| RollbackCategoryBatch | `POST /api/v1/categories/batches/{id}/rollback` | 分类 | CategoryRule | 最近一次批量操作可回滚 | CategoryBatchRolledBack |
| GenerateMonthlySummary | `POST /api/v1/reports/monthly/{month}/generate` | 报表与快照 | MonthlySummary | 快照需带口径版本 | MonthlySummaryGenerated |
| AskAi | `POST /api/v1/ai/ask` | AI 与审计 | AgentRun | 正式回答必须带证据 | AnswerGeneratedWithEvidence |

## Query API

| Query | Endpoint | Read Model | Filters | Pagination | Permissions |
|---|---|---|---|---|---|
| GetSession | `GET /api/v1/auth/session` | SessionView | 无 | 无 | 管理员 |
| ListAccounts | `GET /api/v1/accounts` | AccountListView | sourceType, enabled | 否 | 管理员 |
| ListImportJobs | `GET /api/v1/imports/jobs` | ImportJobListView | period, status, sourceType | 是 | 管理员 |
| GetImportJobDetail | `GET /api/v1/imports/jobs/{id}` | ImportJobDetailView | 无 | 否 | 管理员 |
| ListTransactions | `GET /api/v1/ledger/transactions` | TransactionListView | month, accountId, categoryId, keyword, amountRange | 是 | 管理员 |
| GetTransactionDetail | `GET /api/v1/ledger/transactions/{id}` | TransactionDetailView | 无 | 否 | 管理员 |
| ListInvestmentTrades | `GET /api/v1/investments/trades` | InvestmentTradeView | month, platform, fundCode, tradeType | 是 | 管理员 |
| GetCategories | `GET /api/v1/categories` | CategoryTreeView | enabled | 否 | 管理员 |
| GetMonthlySummary | `GET /api/v1/reports/monthly/{month}` | MonthlySummaryView | version | 否 | 管理员 |
| QueryAuditLogs | `GET /api/v1/audit/logs` | AuditLogView | type, period, resourceType | 是 | 管理员 |
| ListAiRuns | `GET /api/v1/ai/runs` | AgentRunView | period, status | 是 | 管理员 |

## 请求结构
- 所有写请求使用 JSON body
- 上传链路分为“申请上传会话 -> 前端直传 -> 确认创建导入作业”
- 批量操作请求必须显式传递资源 ID 列表或筛选范围摘要

## 响应结构
- 成功响应统一包含 `data`
- 列表响应统一包含 `items`, `page`, `pageSize`, `total`
- 错误响应统一包含 `errorCode`, `message`, `details`, `traceId`

## 错误码
- `AUTH_INVALID_CREDENTIALS`
- `AUTH_SESSION_EXPIRED`
- `IMPORT_INVALID_FILE_TYPE`
- `IMPORT_INVALID_STATE_TRANSITION`
- `IMPORT_REVIEW_REQUIRED`
- `IMPORT_DUPLICATE_FILE`
- `LEDGER_DUPLICATE_TRANSACTION`
- `CATEGORY_BATCH_NOT_ROLLBACKABLE`
- `REPORT_SUMMARY_NOT_READY`
- `AI_DATA_GAP`
- `AI_TOOL_FAILURE`

## 分页
- 默认页大小 `20`
- 最大页大小 `100`
- 列表接口统一返回总数和当前分页信息

## 过滤
- 所有台账与审计接口支持组合过滤
- 过滤条件需要可序列化，用于报表和 AI 下钻复用

## 排序
- 列表接口支持 `sortBy` 和 `sortOrder`
- 默认按时间倒序

## 幂等性
- 上传确认与导入重试接口要求幂等键
- 批量分类确认接口使用 `batch_id` 保证幂等

## 领域事件关系
- 导入成功后可触发 `ImportJobCompleted`
- 入账成功后可触发 `TransactionRecorded` 或 `InvestmentTradeRecorded`
- 分类确认后可触发 `CategoryConfirmed`
- 月报生成后可触发 `MonthlySummaryGenerated`
- AI 问答完成后可触发 `AnswerGeneratedWithEvidence`

## 示例请求和响应

```http
POST /api/v1/ai/ask
Content-Type: application/json

{
  "question": "上月餐饮花了多少？",
  "month": "2026-05"
}
```

```json
{
  "data": {
    "answer": "2026-05 餐饮支出为 3280.50 元。",
    "basis": [
      "按申请日/还款日等既定业务口径汇总",
      "分类优先使用显式规则和历史映射"
    ],
    "evidenceLinks": [
      {
        "label": "查看餐饮明细",
        "targetRoute": "/ledger?month=2026-05&category=food"
      }
    ],
    "dataGaps": []
  }
}
```
