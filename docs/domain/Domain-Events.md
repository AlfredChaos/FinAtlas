# Domain Events

| Event | When It Happens | Producer | Consumers | Payload | Reliability Requirement |
|---|---|---|---|---|---|
| FileUploaded | 用户完成文件上传并确认创建导入作业 | 导入与证据 | 导入 Worker、审计 | job_id, account_id, source_type, file_key, file_hash | 至少一次，允许幂等消费 |
| ImportJobStarted | 导入作业进入处理流程 | 导入与证据 | 审计、监控 | job_id, step, started_at | 至少一次 |
| ImportJobNeedsReview | 抽取或标准化后存在低置信度或冲突 | 导入与证据 | 前端通知、审计 | job_id, review_count, reasons | 至少一次 |
| ImportJobFailed | 任一步骤失败 | 导入与证据 | 审计、监控、重试调度 | job_id, step, error_code, error_detail | 至少一次，必须落库 |
| ImportJobCompleted | 导入处理完成 | 导入与证据 | 报表与快照、审计 | job_id, success_count, duplicate_count, review_count | 至少一次 |
| TransactionRecorded | 一条交易成功入账 | 台账 | 分类、报表、审计 | transaction_id, account_id, category_id, source_pointer | 至少一次，幂等 |
| TransactionSkippedAsDuplicate | 一条候选交易因去重被跳过 | 台账 | 审计、导入结果统计 | dedupe_key, account_id, source_import_job_id | 至少一次 |
| InvestmentTradeRecorded | 一条投资交易成功入账 | 台账 | 报表、AI、审计 | investment_trade_id, platform, trade_type, application_date | 至少一次 |
| CategoryConfirmed | 用户确认分类 | 分类 | 台账、学习样本、审计 | transaction_ids, category_id, batch_id | 至少一次 |
| CategoryRuleLearned | 系统根据确认结果生成规则或映射 | 分类 | 分类引擎、审计 | rule_id, source, priority | 至少一次 |
| CategoryBatchRolledBack | 最近一次批量分类被撤销 | 分类 | 台账、审计 | batch_id, reverted_count | 至少一次 |
| MonthlySummaryGenerated | 月报快照生成成功 | 报表与快照 | 前端、AI、审计 | month, summary_id, snapshot_version | 至少一次 |
| QuestionAsked | 用户发起问答 | AI 与审计 | 审计、监控 | agent_run_id, prompt, month_context | 至少一次 |
| AnswerGeneratedWithEvidence | AI 生成带证据的答案 | AI 与审计 | 前端、审计 | agent_run_id, citation_count, data_gaps | 至少一次 |
