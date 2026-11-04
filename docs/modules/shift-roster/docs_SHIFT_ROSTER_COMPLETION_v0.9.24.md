# Shift & Roster completion — v0.9.24

## Added
- Employee default shift register with effective-from/effective-to history. Single employee assignment now also marks the assignment as the default.
- Monthly roster generation for selected month, department and branch. Existing employee/date rows are skipped; dates without a default shift are skipped except weekly-off/holiday dates.
- Weekly-off days are configurable as multiple weekdays. Company holiday dates can be entered as comma-separated ISO dates. Off rows are stored as `shiftId=OFF`.
- Monthly employee calendar grid showing day-by-day Published, Draft, Pending Approval, Pending Level 2 and OFF entries.
- Temporary shift changes create date-specific published roster rows after approval; permanent changes update the employee default assignment with effective dating.
- One- or two-level roster approval. Level 1 and Level 2 reviewer roles are configurable; an optional assigned approver email can further restrict each stage to one account.
- Attendance page schedule-resolution preview: Employee-based uses effective employee assignment; Roster-based uses Published roster; Hybrid prioritizes Published roster then employee default/assignment. Draft and pending rows are ignored.
- Published roster records retain shift snapshots so later Shift Master edits do not rewrite historical roster timing.

## Important limitations
- This remains browser-local demo state, not server-side HRMS functionality. Role checks are UI/demo checks, not security boundaries.
- No substitute/delegate reassignment workflow, notifications, escalation, concurrent locking, durable audit trail or API authorization. Assigned approver email is a simple identity restriction, not a delegation engine.
- Monthly generator creates dates from current defaults and weekly offs/holiday list; rotating shift pattern templates and auto-rotation are not implemented.
- Temporary shift request date ranges skip dates that already have a Published roster; review the resulting roster calendar after approval.
- Attendance preview resolves a schedule but does not calculate attendance, import punches, reconcile device events or post payroll.
- Employee profile displays a default shift editor in the employee workspace, but editing is disabled for employee role; HR manages defaults from Shift Management.
