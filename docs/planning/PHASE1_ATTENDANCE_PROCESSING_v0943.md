# v0.9.43 — Attendance processing scope and remaining gaps

## Implemented for prototype
- New **Process & finalize** tab: company-scoped daily processing, date selection, shift-window pairing including overnight shift, duplicate event exclusion, exception counts, approved correction inclusion, export and browser-local day lock/reopen.
- The original device/raw punch ledger is not edited by processing. A lock detects changes to underlying punches or corrections and displays a warning.
- Only HR Manager / Company Admin may finalize or reopen in the prototype.

## Important limitations / not complete
- Shift assignments are synthetic based on employee index; actual published roster is not connected.
- Weekly off, leave, holiday and OT are not integrated into calculated status. The 50-person scenarios can therefore show **Absent** for leave/off cases. Do not use for payroll.
- Finalization uses localStorage, not an immutable backend lock; it is not secure for production.
- Manual punch form still adds directly to raw ledger in the older tab; it needs approval-first refactoring before Phase 1 completion.
- Correction approver is role-based rather than individual identity.
- Device sync remains simulated; no live integration, backend scheduler or offline replay.
- Full build and browser UAT are required.

## Next closure tasks
1. Integrate published roster and company attendance policy with processing.
2. Integrate approved leave/weekly-off/holidays; distinguish absence vs leave.
3. Make manual corrections approval-first with evidence and operator/approver identity.
4. Implement backend raw ingestion, deduplication, idempotent processing, immutable audit, locking and retry.
5. Validate all five user panels, cross-company isolation and payroll-ready reporting.
