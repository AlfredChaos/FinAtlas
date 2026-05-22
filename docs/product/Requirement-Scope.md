# Requirement Scope

## Background

FinAtlas is a single-user personal finance management platform that consolidates scattered financial data from bank statements, credit card bills, and fund platforms into one evidence-centered web application. The product chooses file import over real-time API synchronization because the user's real operating constraint is monthly batch import of CSV, Excel, PDF, and image files.

## Goals

- G1: provide a unified financial view covering assets, liabilities, cash flow, spending structure, and investment activity
- G2: support low-friction monthly data ingestion through file uploads
- G3: deliver explainable AI assistance for categorization, reporting, and structured question answering
- G4: ensure import jobs are idempotent, retryable, replayable, and auditable

## Non-Goals

- No real-time automatic sync with banks, Alipay, or fund platforms
- No trade execution, automatic order placement, or fiduciary behavior
- No multi-user, household sharing, billing, or tenant isolation in MVP
- No advanced quantitative strategy engine in MVP

## MVP Scope

### In scope

- Account and source management
- File upload and async import jobs
- CSV and Excel ingestion for target platforms
- At least one workable path for PDF ingestion
- Unified transaction ledger and investment trade ledger
- Category system with rule-based learning and AI-assisted suggestions
- Monthly summary snapshot with drill-down evidence
- AI query assistant on top of structured data
- Audit trail, import traceability, and manual correction flow

### Should-have

- OCR path for image-only or scanned PDF imports
- Batch classification confirmation
- Basic credit card repayment planning view
- Agno tracing and agent run records
- Presigned R2 upload/download flow

### Later

- Investment checkup full implementation
- Budgets and alerts
- Multi-user or family accounts
- More institutions and email bill ingestion

## User Personas

- Primary user: self-managing salaried investor with monthly income, multiple fund platforms, and fragmented spending channels
- Beginner user: wants clear categories and ready-to-use monthly summaries with minimal financial jargon
- Power user: expects drill-down, strong filtering, and traceable explanations
- Weak-network or low-end-device user: expects resumable uploads, clear progress states, and lightweight pages
- Low-patience user: expects fast value within a monthly import-to-report loop

## Core User Paths

1. Create accounts and sources
2. Upload monthly files by source and period
3. Track import job states and resolve review items
4. Browse normalized transactions and investment trades with evidence chain
5. Confirm or correct categories and let the system learn
6. Generate monthly summary and drill into outliers
7. Ask natural language questions and receive traceable answers

## Success Metrics

- Coverage of key monthly sources >= 90 percent
- CSV and Excel import success >= 99 percent
- PDF import success >= 90 percent on supported templates
- Automatic classification accuracy >= 85 percent after user confirmation
- Unclassified transaction ratio <= 5 percent
- Monthly summary generation completes within 2 minutes after structured data is ready

## Failure Paths

- Uploaded file format unsupported or template mapping missing
- PDF extraction confidence too low to persist automatically
- Duplicate imports attempt to create duplicate ledger rows
- AI answer requests data not yet imported for the queried period
- Manual correction is impossible because source evidence is not stored or linked

## Constraints

- Single-user, self-hosted, web-first architecture
- Backend direction fixed by user context: Python + FastAPI + Agno
- Infrastructure direction fixed by user context: PostgreSQL + Redis + RabbitMQ in Docker
- Object storage direction fixed by PRD: Cloudflare R2
- AI outputs must be explainable and traceable to evidence
- Sensitive credentials must remain server-side only

## Risks

- PDF and OCR extraction quality may vary by template and scan quality
- Real document samples are not yet available for parser validation
- Several accounting policies remain undecided and directly affect report correctness
- LLM provider credentials are missing, blocking true AI integration tests

## Assumptions

- A modern SPA frontend is acceptable for MVP; default stack is React + TypeScript + Vite
- Credit card statements will be modeled as source-specific imports plus repayment-oriented derived views
- Structured Q&A will be implemented over trusted read models and SQL-safe aggregation, not direct free-form database access
- AI categorization is advisory by default; user confirmation remains the learning trigger
- If no stronger evidence emerges, use customizable default spending categories rather than forcing a third-party taxonomy

## Confirmed Business Policies

- BP-001: credit card cash flow is recognized on repayment date for cash flow and settlement views
- BP-002: fund trades use application date as the default accounting date, while confirmation date remains available as an optional field or alternate view
- BP-003: dividends default to reinvestment treatment, with optional cash-dividend support
- BP-004: category taxonomy starts from a common budgeting classification and remains user-customizable
- BP-005: AI experience prioritizes conversational Q&A; automatic monthly action list is secondary

## Remaining Information Gaps

- Frontend framework is an engineering default today, not an externally constrained business fact
- Real sample files are still missing for parser and OCR validation
- Cloudflare R2 credentials are still missing
- LLM provider credentials are still missing

## Requirement Matrix

| Requirement ID | User Story | Acceptance Criteria | Test Method | Dependencies | Risk | Notes |
|---|---|---|---|---|---|---|
| FR-ACCT-01 | As a user, I can create and edit accounts for banks, cards, and fund platforms | Accounts can be created, updated, and linked to source types | API integration + UI form test | Auth, DB schema | Medium | Single-user today, extensible later |
| FR-ACCT-03 | As a user, I can configure statement-cycle rules for credit cards | Card billing rules persist and support later report logic | Unit + API test | Account settings | Medium | Depends on accounting policy |
| FR-IMP-01 | As a user, I can upload CSV, Excel, PDF, and image files | Supported MIME and extension validation works | API integration test | Storage, upload API | High | Security-sensitive |
| FR-IMP-04 | As a user, I can see import job progress and errors | Job tracks state transitions, timings, retries, and failures | Domain unit + API test | Queue, worker, DB | High | Core operational backbone |
| FR-IMP-05 | As a user, I can restart processing from a step | Job can replay from allowed checkpoints | Domain unit + integration test | Import state machine | High | Replay design required |
| FR-IMP-10 | As a user, duplicate imports do not pollute my ledger | Duplicate rows are ignored or flagged predictably | DB constraint + integration test | Dedupe model | High | Core invariant |
| FR-IMP-13 | As a user, I can review import results and low-confidence rows | UI exposes counts and evidence-linked review items | UI + API integration test | Evidence storage | High | Must preserve source pointer |
| FR-LED-01 | As a user, I can filter transaction details | List supports month, account, category, keyword, amount filters | API integration + UI test | Read model | Medium | Important for drill-down |
| FR-LED-02 | As a user, I can trace any row back to source evidence | Detail view links to file and row/page/block pointer | API integration + manual test | Storage + source pointer | High | Product differentiator |
| FR-CAT-02 | As a user, transactions are auto-categorized using rules, history, and optional AI | Priority order is enforced and rationale is visible | Domain unit + API test | Category engine | High | High regression risk |
| FR-CAT-03 | As a user, confirmed categories improve future hits | Confirmations create reusable rules or samples | Domain unit + integration test | Category engine | High | Learning loop |
| FR-RPT-01 | As a user, I can generate a monthly snapshot after import completion | Summary persists by month and opens quickly | API integration + UI test | Read models, snapshot storage | High | Core monthly loop |
| FR-RPT-03 | As a user, I can drill each key number into evidence-backed details | Report numbers navigate to filtered detail lists | UI integration + manual test | Query model | High | Evidence-centered design |
| FR-AI-01 | As a user, I can ask natural language questions on my finances | Agent returns answer plus calculation basis and evidence links | API integration + evaluation set | Structured query service, Agno | High | Requires LLM config |
| FR-AI-04 | As a user, I receive category suggestions for low-confidence rows | Agent returns top-K suggestions with reasons and confidence | API integration + reviewer validation | Category engine, Agno | Medium | Human-confirmed by default |
| SEC-01 | As a user, my data is protected behind authentication | Login and protected APIs work end to end | API integration + security review | Auth, session/token | High | MVP still needs future-proofing |
| SEC-04 | As a user, risky actions are auditable | Import, delete, edit, and batch classify actions emit audit logs | API integration + DB verification | Audit model | Medium | Required by PRD |

## OpenSpec Mapping

- OpenSpec is not present yet.
- Unless repository constraints emerge later, phase 1 should initialize `openspec/changes` and `openspec/specs` for major capabilities:
  - import-pipeline
  - ledger-and-evidence
  - categorization-loop
  - monthly-summary
  - ai-query-and-assist
