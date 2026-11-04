# Next-HRMS v0.9.32 — ELM Lifecycle Actions

## Scope
- Company-scoped lifecycle requests: Confirmation, Transfer (branch/department/unit/floor/line), Promotion (designation/grade), Separation (inactive status and reason).
- HR Manager or Company Admin can submit; Company Admin can approve or reject in this **prototype-only simplified approval path**.
- Requests preserve before/after values, reason, effective date, submitter, approver and status.
- Approved future-dated changes are applied on/after the effective date when the application is next opened; current-dated changes apply at approval.
- Requests persist in browser localStorage under the existing v0.9.24 test-data namespace.

## Exclusions / risks
- No production role/tenant security, backend API, audit immutability, or configurable multi-stage approval engine.
- No cross-company transfer; a change of company requires a separate controlled workflow.
- No downstream attendance/roster/leave/payroll recalculation. No automatic notification.
- This is a functional UI prototype, not production-ready lifecycle processing.
- Historical employee snapshots are stored on requests; separate authoritative effective-dated employment history tables are not implemented.

## Deferred backlog
ELM Bulk Import & Photo Reconciliation: matching reports, rejected retry, reconciliation and import history remain planned for a later milestone; not cancelled.

## Verification
ZIP integrity and static source checks only; browser UAT/build not verified.
