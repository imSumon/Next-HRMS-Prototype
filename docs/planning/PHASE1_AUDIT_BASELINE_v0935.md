# Next-HRMS — Phase 1 Audit & Completion Tracker

**Audit date:** 2026-11-04  
**Reviewed baseline:** `Next-HRMS-React-v0.9.35` extracted source, changelog, migration-parity notes and cumulative user-wise UAT guide.  
**Audit method:** Static source/document inspection plus user-reported UAT in this conversation. No full React build, automated test suite or browser UAT was executed in this audit. No application code changed.

## Status legend
- **UAT partial pass** — user confirmed a specific scenario; not a complete module pass.
- **Prototype present** — UI and/or browser-local logic found; requires acceptance testing.
- **Preview only** — informational/read-only; no transactional integration.
- **Incomplete** — Phase 1 end-to-end behavior absent or not evidenced.
- **Phase 2** — explicitly deferred; not a Phase 1 release blocker.

## Executive findings
1. v0.9.32–0.9.33 added lifecycle requests, approval controls and history. User confirmed pending submission, Company Admin approval and history display. Other action variants, negative cases, future-date application and isolation remain unverified.
2. v0.9.34 added a **read-only** cross-module impact checklist, not cross-module transactions.
3. v0.9.35 added a **read-only** attendance effective-date review, not attendance device mapping, punch processing or exception resolution.
4. Data, lifecycle requests, shift assignments and rosters are persisted in browser `localStorage`; there is no evidence of production API/database/RBAC implementation.
5. Payroll remains a readiness/report catalogue rather than a calculation engine. Recruitment and PMS are not functional React modules. The migration-parity document is older (v0.9.6) and needs refreshed feature-by-feature verification against v0.9.35.
6. The user-wise UAT guide still contains numerous `Not browser-tested` statuses and has a baseline heading of v0.9.29; it needs a reconciled cumulative test ledger rather than treating earlier statements as verified.

## Release ledger
| Release | Delivered in source/docs | Audit classification | Remaining |
|---|---|---|---|
| 0.9.24 and earlier | Shift master, assignment, roster and role navigation increments | Prototype present | Operational UAT, persistent implementation, attendance linkage |
| 0.9.25–0.9.29 | Field configuration and ELM screen integration | Prototype present | Full catalogue coverage, delegation and security verification |
| 0.9.30–0.9.31 | Full-page enrollment, employee import and bulk photo upload | Prototype present | Photo/import browser UAT; advanced reconciliation deferred |
| 0.9.32 | Confirmation, transfer, promotion, separation and lifecycle history | UAT partial pass | Test all action variants, future dates, rejection, edge cases |
| 0.9.33 | Company-scoped approvals, duplicate prevention, date checks, audit events | UAT partial pass | Negative-case UAT, server-side RBAC/audit later in Cursor |
| 0.9.34 | Cross-module impact checklist | Preview only | Not real integration; remove from Phase 1 completion count |
| 0.9.35 | ELM-to-Attendance effective-date review | Preview only | No punch/device integration or automatic mapping |

## All-panel audit
| Panel | Present navigation and capabilities | Phase 1 gaps / acceptance focus | Assessment |
|---|---|---|---|
| **Super Admin** | Platform overview, company enrollment/directory, users/roles, audit, field configuration | Real company activation/deactivation, tenant governance, delegated access, protected fields, company isolation, effective configuration and server authorization | Prototype present / incomplete |
| **Company Admin** | Company dashboard; ELM, field config, shift/roster, attendance, leave, payroll, company setup, users/roles, audit | End-to-end company setup, approval authority, employee master governance, reports, access control and workflow exceptions | Prototype present / incomplete |
| **HR Manager** | Dashboard; ELM enrollment/import/photos/lifecycle; shifts/roster; attendance; leave; payroll readiness; setup | ELM final UAT, punch intake→processing→correction, leave balances and approvals, payroll calculation and close | Prototype present / incomplete |
| **Department Manager** | Manager dashboard, My Team, Team Attendance, Leave Approvals | Actual assigned-team scope, attendance exception review, leave recommendation/escalation, no access outside team | Prototype present / incomplete |
| **Employee** | My Dashboard, Profile, Attendance, Leave, Monthly Roster | Leave application/cancellation status, missing-punch correction, accurate own-data scoping, published roster visibility and notifications/status | Prototype present / incomplete |

## Phase 1 functional module tracker
| Priority | Module | Existing baseline | Required Phase 1 completion / acceptance |
|---|---|---|---|
| P0 | Identity, company and RBAC | Login personas, scoped React menus and browser-local guards | Finalize role matrix, company/department/team scope, denied-action tests, Cursor API authorization specification |
| P0 | ELM | Enrollment, directory, profile, import/photos, lifecycle approval/history | Complete core create/edit/view, protected-field checks, transfer/promotion/confirmation/separation effective dates, audit, isolation and negative UAT |
| P0 | Shift/Roster | Shift master, assignment, draft/publish, bulk assignment and report | Validate overlap, overnight, off-day/holiday, assignment precedence, publication lock, history and role-specific visibility |
| P0 | Attendance | Punch listing, exceptions summary, shift resolver, read-only lifecycle preview | Device/API or file/manual raw intake, idempotent raw log, company/employee/device resolution, processing, correction/approval, lock/reprocess policy and reporting |
| P0 | Leave | Balances, manager/HR approval concepts and employee summaries | Employee apply/cancel, eligibility/balance checks, manager→HR approval, approved-only balance deduction, leave position adjustments, audit and reports |
| P0 | Payroll | Readiness/report catalogue | Salary setup, period inputs, calculation, exception checks, approval/finalization, payslip, export and reconciliation; no claims of completion before calculation tests |
| P1 | Recruitment | Field-configuration placeholder | Requisition, candidate, selection, joining/onboarding handoff or explicitly remove from Phase 1 with Product Owner approval |
| P1 | Reports | Selected tables, exports and dashboards | Minimum operational reports for ELM, attendance, leave, roster, payroll with scope and filter checks |
| P1 | Company setup | Settings/map and field configuration | Core policy inputs, validation, effective dates, access/delegation and documented defaults |

## Workflow gates — what counts as done
For every Phase 1 workflow, require: **create/request → validate → role-authorized review/approval (where relevant) → persist/apply → effective-date behavior → history/audit → role-scoped view/report → negative-case UAT**. A screen, preview, checklist or local-only UI is not an integrated production feature.

### Cross-panel UAT scenarios
1. Super Admin configures Company A; Company B must not inherit its restricted data/settings.
2. Company Admin assigns HR/manager access; unauthorized approval and self-approval must be denied.
3. HR enrolls employee; employee sees only their own profile; manager sees only their team.
4. HR creates and Company Admin approves a future transfer; historical records remain intact; new assignment applies from the effective date.
5. HR assigns a shift and publishes roster; employee sees published entries only; manager sees team scope.
6. Device/API, CSV/XLSX and authorized manual attendance input all preserve source records and flag mapping/duplicate exceptions.
7. Employee requests leave; manager recommends; HR finalizes; balance is deducted exactly once at final approval.
8. Attendance and leave results feed a reproducible payroll calculation; authorized payroll finalization locks a period and preserves audit.
9. All roles verify company/employee/team data boundaries and denied routes/actions.
10. Confirm refresh/relogin and later Cursor database persistence; localStorage alone is not a production persistence pass.

## Phase-based implementation sequence
| Stage | Goal | Exit criteria |
|---|---|---|
| 1A | Foundation + ELM | Role/company matrix approved; ELM complete against Phase 1 UAT |
| 1B | Shift/Roster + Attendance | Raw intake, process, exception approval and daily attendance report work end-to-end |
| 1C | Leave | Employee request through final balance update and reporting work end-to-end |
| 1D | Payroll | Verified salary period calculation, review, lock, payslip and reports |
| 1E | Recruitment + reports | Agreed Phase 1 recruitment scope and operational reports pass UAT |
| 1F | Integrated UAT + Cursor handoff | Requirements, entity/field maps, roles, API contracts, migrations, acceptance tests and known gaps versioned; no blocker masquerades as complete |

## Explicit Phase 2 backlog — retain, do not implement now
- Full employee resignation application, approval, withdrawal (pending: employee allowed; after approval: HR authorization), clearance and settlement.
- ELM bulk import/photo reconciliation, retry, history and advanced error reporting.
- Configurable multi-stage workflow engine and advanced delegation.
- Advanced automatic cross-module orchestration and sophisticated device integrations/analytics.
- PMS, PF, file cabinet, bills and other enterprise modules unless separately approved for Phase 1.

## Next action
**Do not start v0.9.36 by adding another preview screen.** First reconcile the actual v0.9.35 UAT results with the user-wise guide, audit all five panels against the acceptance matrix, then close **Stage 1A** functional gaps. Prepare Cursor handoff for each approved module without waiting for the entire prototype to be finished; avoid unauthorized Git/DB/migration actions.
