# Bounded Contexts

| Context | Responsibility | Core Concepts | Owns Data | Exposes | Depends On |
|---|---|---|---|---|---|
| 账户与来源 | 管理账户、来源配置、模板映射、账期规则 | Account, SourceProfile, ImportTemplate | 账户、来源配置、模板 | 账户查询、模板配置、账期规则 | 无 |
| 导入与证据 | 处理上传、状态机、抽取、中间产物、复核 | ImportJob, ImportItem, EvidenceArtifact, ReviewCase | 导入作业、导入条目、复核项 | 导入作业接口、复核接口、证据产物索引 | 账户与来源 |
| 台账 | 维护交易与投资交易事实 | Transaction, InvestmentTrade, EvidenceReference | 交易、投资交易 | 台账查询、事实写入、明细下钻 | 导入与证据、账户与来源 |
| 分类 | 管理分类体系、规则、学习样本与回滚 | Category, CategoryRule, LearningSample | 分类树、规则、样本 | 分类建议、批量确认、回滚接口 | 台账 |
| 报表与快照 | 生成并持久化月报与指标版本 | MonthlySummary, MetricVersion | 月报快照、指标口径版本 | 月报查询、生成与下钻 | 台账、分类 |
| AI 与审计 | 承载问答、引用证据、运行审计 | AgentRun, Citation, Suggestion | Agent 运行记录、审计日志 | 问答接口、运行摘要、证据引用 | 台账、报表与快照、分类 |
