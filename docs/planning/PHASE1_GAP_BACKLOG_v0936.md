# Phase 1 — Controlled gap backlog (v0.9.36)

**Status:** Planning and static review only. No production implementation is asserted.
**Acceptance gate:** A Phase 1 module is complete only when its in-scope workflow is end-to-end, with positive and negative UAT for each applicable role, audit history, persistence design and Cursor backend handoff.

| ID | Stage | Owner panel(s) | Must complete in Phase 1 | Acceptance evidence | State |
|---|---|---|---|---|---|
| F-01 | 1A Foundation | Super Admin, Company Admin | Company creation/activation, organizational structure, roles, delegated access, protected fields | Company A/B isolation and forbidden-action UAT | Open |
| F-02 | 1A ELM | HR, Company Admin, Manager, Employee | Employee create/edit/view, identity/required-field validation, lifecycle actions, approval, history | All four action types and rejected/duplicate/future-date cases | Partial UAT |
| F-03 | 1A ELM | HR, Company Admin | CSV/XLSX basic import and photo upload confirmation | Valid/invalid upload, no silent overwrites, employee profile reflects import | UAT pending |
| S-01 | 1B Shift/Roster | HR, Manager, Employee | Shift master, default assignment, weekly off, overnight, draft/publish, history | Published-only employee visibility, conflict/overlap tests | UAT pending |
| A-01 | 1B Attendance | HR, Company Admin | Raw device/API ingestion contract, CSV/XLSX import, authorized manual punch | Immutable raw log, source ID, duplicate/idempotency and invalid rows retained | Not implemented end-to-end |
| A-02 | 1B Attendance | HR, Manager | Resolve company, employee, site/device; process shift/roster punches; flag exceptions | Test missing employee, duplicate, overnight, missing OUT, offline backfill | Not implemented end-to-end |
| A-03 | 1B Attendance | Employee, Manager, HR | Correction request, review/approval, lock/reprocess, daily/monthly reports | Approved correction once, raw punches preserved, locked period protected | Not implemented end-to-end |
| L-01 | 1C Leave | Employee, Manager, HR | Application, cancellation, balance, manager recommendation, HR decision | Deduct once on final approval, reject/withdraw unchanged, audit history | Partial prototype |
| L-02 | 1C Leave | HR, Company Admin | Opening balance/adjustment operator UI and reporting | Authorized scoped changes, reason, effective date and history | Open |
| P-01 | 1D Payroll | HR, Company Admin, Employee | Salary setup, attendance/leave inputs, calculate, review, approve, close, payslip | Reproducible calculations, rounding, adjustment and lock UAT | Not implemented |
| R-01 | 1E Recruitment | HR, Manager | Basic requisition, applicant, selection and onboarding | Selected candidate creates employee record with no duplicate | Not implemented |
| REP-01 | 1E Reporting | All panels per scope | Core employee, roster, attendance, leave, payroll reports | Role-scoped exports match underlying records | Partial |
| INT-01 | 1F Handoff | All panels | Data model/API contracts, migration reconciliation, role matrix, full UAT ledger | Cursor can implement without inventing policy or losing data | Open |

## Deferred — Phase 2 (not Phase 1 blockers)
- Advanced bulk import/photo reconciliation, retry dashboards and batch analytics.
- Employee resignation self-service, withdrawal after approval authorization, clearance and settlement workflow (basic HR separation remains Phase 1).
- Multi-stage configurable approval engine; sophisticated cross-module automation and predictive analytics.
- Model-specific direct device connectors beyond the approved Phase 1 ingestion contract.

## Next execution order
1. F-01/F-02: validate role matrix and all ELM action cases, close only proven defects.
2. S-01: complete and UAT shift/roster operational behavior.
3. A-01/A-02/A-03: implement complete basic attendance, not another preview.
4. L-01/L-02, then P-01, then R-01/REP-01, then INT-01.

## Guardrails
- No production Git, DB migrations or deployments without approval.
- Browser-local prototype state is not server persistence or production security.
- Do not mark read-only v0.9.34/v0.9.35 review screens as completed integration.
- Preserve raw punch logs; do not overwrite historical records on transfer.
