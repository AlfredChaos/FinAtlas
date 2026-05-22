# Aggregates

| Aggregate | Root | Entities | Value Objects | Invariants | Repository | Events |
|---|---|---|---|---|---|---|
| Account Aggregate | Account | SourceProfile, ImportTemplateBinding | BillingCycleRule, SourceType | 信用卡必须有账期规则；停用账户不可发起新导入 | AccountRepository | AccountConfigured, ImportTemplateBound |
| Import Aggregate | ImportJob | ImportItem, ReviewCase | FileHash, SourcePointer, StepStatus | 状态机转移合法；失败必须可定位；每步可重入 | ImportJobRepository | FileUploaded, ImportJobStarted, ImportJobNeedsReview, ImportJobCompleted, ImportJobFailed |
| Transaction Aggregate | Transaction | 无 | EvidenceReference, Money, DedupeKey | `account_id + dedupe_key` 唯一；交易必须带证据引用 | TransactionRepository | TransactionRecorded, TransactionSkippedAsDuplicate |
| Investment Trade Aggregate | InvestmentTrade | 无 | ApplicationDate, ConfirmationDate, DividendMode, DedupeKey | 默认按申请日记账；确认日为可选字段；分红默认再投资 | InvestmentTradeRepository | InvestmentTradeRecorded |
| Category Catalog Aggregate | Category | ChildCategory | CategoryPath | 停用分类不可接收新命中；合并需保留历史追溯 | CategoryRepository | CategoryMerged, CategoryDisabled |
| Category Policy Aggregate | CategoryRule | LearningSample, BatchOperation | RulePattern, MatchPriority | 显式规则优先于历史映射优先于 AI 建议；最近一次批量操作可回滚 | CategoryPolicyRepository | CategoryConfirmed, CategoryRuleLearned, CategoryBatchRolledBack |
| Monthly Summary Aggregate | MonthlySummary | MetricEntry | MetricVersion, SummaryMonth | 同账期快照按版本稳定；重算须保留版本差异 | MonthlySummaryRepository | MonthlySummaryGenerated, MonthlySummaryRegenerated |
| Agent Run Aggregate | AgentRun | Citation | TraceId, ToolCallRecord | 正式回答必须带引用证据；关键结论无证据不得出现在结果中 | AgentRunRepository | QuestionAsked, AnswerGeneratedWithEvidence |
