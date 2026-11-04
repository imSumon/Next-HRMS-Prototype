# Next-HRMS Prototype v0.7.5 — Monthly Shift & Roster

## Run locally
From this folder run:
```powershell
python -m http.server 8080
```
Then open `http://localhost:8080`. Do not open `index.html` directly because the prototype loads JSON using fetch.

## Demo login
- Platform Superadmin: `superadmin@next-hrms.test` / `demo-only`
- Company Admin: `companyadmin@demo.test` / `demo-only` (choose Viyellatex in company selector)

## Attendance UAT path
1. Sign in and open the Viyellatex company workspace.
2. Open **Attendance** from the left navigation.
3. Review device connection dashboard. Connect/disconnect a device and add a demo device.
4. Use **Simulate device batch** to generate demo punch events. The batch includes normal, late, duplicate, unmapped and missing-OUT cases.
5. Review employee-to-card mapping and the raw punch inbox. Raw punch events are retained separately from calculated results.
6. Use **Run attendance process**. Select the date and inspect daily attendance results and exceptions.
7. Mark exception items reviewed, then submit daily results for approval.
8. Export raw punch events and daily results to CSV.
9. Test outage and recovery: simulate network/power outage, inspect device statuses, restore connection, and test CSV recovery import.
10. Import `data/vtl-demo-punches.csv` using the Import CSV control. CSV headers are `employee_id,card_id,device_id,punch_datetime,source`.

## Fixture data and VTL limitations
- `data/vtl-demo-employees.json` contains 16 **synthetic VTL-style** employee fixtures, not actual Viyellatex employees.
- Department names are explicitly illustrative, not verified VTL department master values.
- Available project files did not include an exportable VTL employee roster. The audit reference states that 1,420 employees were present in the September 2026 audit, but that does not provide the employee rows or department names.
- Replace these fixtures only after an approved export is supplied. Prefer employee ID, active status, department, designation, branch, effective shift assignment and punch-card mapping; exclude personal/contact/payroll data not needed for attendance UAT.

## Important simulation boundaries
- Device connection status is simulated; no physical biometric device, vendor SDK, network socket, webhook or API is connected.
- A device may or may not buffer punches during network/power failure. Do not assume offline storage. Validate each model. If the device cannot capture/store events, use approved CSV/Excel recovery or authorized manual adjustment.
- The demo batch uses a 09:00–18:00 day shift and 10-minute grace only to illustrate calculation. These are not approved VTL rules or universal defaults.
- CSV import is a local browser demo; production import needs schema validation, timezone handling, duplicate detection, employee/card mapping, batch approval and reconciliation.
- Manual adjustment is a demonstration only. Production must enforce permission, reason, evidence, approval and immutable audit history.
- Approval submission is simulated. There is no backend, database, live polling, durable queue, tenant isolation or payroll integration. Refresh resets state.

## Recommended production design items captured for follow-up
- Device vendor/model/protocol compatibility and per-device credentials/secrets management.
- Device-to-company/branch/site binding and effective-dated employee punch identity mapping.
- Heartbeat, last-seen, last-sync, queue depth, sequence number, device/server clock drift and timezone monitoring.
- Idempotent ingestion, source event IDs, duplicate policy, raw event immutability and retry/replay controls.
- Outage recovery: device buffer capability verification, recovery imports, missing-data reconciliation and manual corrections.
- Shift/roster resolution by employee and work date; overnight shifts, holidays, approved leave and employment status.
- Exception types: unmatched identity, duplicate, missing IN/OUT, no shift, off-day punch, device outage, invalid timestamp and late/early departure.
- Separate raw punches, normalized punches, calculated daily attendance, approved corrections and finalized attendance snapshots.
- Approval workflow, role/company/branch scope, reason/evidence, audit history, period close/reopen controls.
- Monitoring reports, reconciliation counts, data retention, privacy, security and payroll handoff.

## Version
Current release: **0.8.4**. See `VERSION` and `CHANGELOG.md`.

## v0.5.1 — HR Manager guided sequence
Follow the numbered guide shown at the top of Attendance: (1) prepare shift calendar, (2) collect/verify punches, (3) process attendance, (4) review leave, (5) resolve exceptions and submit attendance, (6) confirm shift/roster results, (7) review OT, and (8) close the attendance period and hand off to Payroll. Report exports are available below the daily results. Reports require processed demo data. The monthly and payroll handoff exports are illustrative only; leave, OT approval, period close and salary calculation are not implemented as real workflows.

Tables use fluid height and wrapped cells; there are no fixed-height table panes or manually locked inner scroll areas.


## v0.6.1 correction
The Attendance menu now switches between focused workspaces. Select Overview & guide or one of the nine work areas; the other work areas are hidden while the selected workspace is displayed. This is a front-end view switch in the standalone prototype, not production routing/backend separation.


### v0.6.2 device dashboard update
Connected devices display green status; Offline/Disconnected devices display red status. Connect/Disconnect action labels remain on one line with a readable button size.


## v0.6.3 — Role-based demo panels
Login roles now have separate landing dashboards and role-filtered navigation: Platform Superadmin, Company Admin, HR Manager, Department Manager and Employee/ESS. Demo credentials (password for all: `demo-only`):
- Platform Superadmin: `superadmin@next-hrms.test`
- Company Admin: `companyadmin@demo.test`
- HR Manager: `hr@vtl-demo.test`
- Department Manager: `manager@vtl-demo.test`
- Employee: `employee@vtl-demo.test`

This is front-end demo routing only. It is not production authentication or server-side authorization.


### v0.6.4 Mapping dashboard
The Employee & Punch Identity Mapping workspace has clickable summary cards. Select Total Employees, Mapped, Unmapped or Mapping Issues to filter records. Search employee ID/name/punch ID and filter by department/device. This demo contains 16 synthetic records; it is not the actual VTL roster. Production should use server-side filtering, pagination, effective-dated device identities, duplicate conflict detection and audit logging.

## v0.6.8 — Identity mapping report pagination
- Employee & Punch Identity Mapping now displays 10 records per page with Previous/Next and numbered page controls.
- Search, department, device and summary-card filters reset pagination to page 1.
- The report displays the visible record range and total matching record count.
- Updated the project folder and release metadata to v0.6.8.


## v0.7.0 — Bulk employee shift assignment
- Bulk select employees using checkboxes, search by name/ID, and filter by department.
- Select All applies only to visible filtered employees.
- Assign one shift and effective date range to multiple employees in one operation.
- Existing single-employee assignment remains available. Overlapping active assignments are skipped and reported.


## v0.7.0 Shift assignment update
Single and bulk employee shift assignment now share one workspace with a Single Employee / Multiple Employees mode switch. Existing conflict checks remain in place in both modes.


## v0.7.2 — Bulk assignment interaction fix
- Replaced reliance on native form submission with an explicit Assign button click handler.
- Added inline validation for employee selection, active shift and effective date range.
- Added visible success, warning and conflict summaries with per-employee skip reasons.
- Keeps the result report visible after processing.

## Shift & roster workflow (v0.7.4)
1. Create reusable working-time patterns in **Shift Master**.
2. Assign an employee's normal shift in **Employee Shift Assignment** (single or bulk).
3. Add date-specific roster entries; all new entries start as **Draft**.
4. Publish an individual Draft or select multiple Draft entries and choose **Publish selected drafts**.
5. Published roster entries are locked in this demo. Publishing is not attendance approval.

See `docs/SHIFT_AND_ROSTER_DESIGN.md` for the functional contract, schedule-resolution concept, planned features and developer guidance.


## v0.7.5 — Monthly Shift & Roster visibility
- HR Manager: open **Monthly Shift & Roster** for company-wide monthly publication and staffing summaries.
- Employee: open **My Monthly Shift & Roster** from Employee Self-Service to see personal Published entries.
- HR Manager / Company Admin: configure future Published roster visibility and default month preferences in **Shift Management**.
- Draft entries are HR-only and never appear in employee self-service. Future employee dates are filtered when the company disables future-roster visibility.
- See `docs/MONTHLY_ROSTER_VISIBILITY.md` and `docs/SHIFT_AND_ROSTER_DESIGN.md` for the functional rules.

### v0.7.5 employee roster demo login
- Employee: `employee@vtl-demo.test` / `demo-only` (select Viyellatex in the company selector). The demo maps this account to synthetic employee `VTL-DEMO-0001`.


### Login company selection (v0.8.3)
The login screen keeps the company workspace selector visible. Company Admin can choose a company; HR Manager, Department Manager and Employee demo accounts are fixed to Viyellatex; Platform Superadmin does not require a company context.


### Demo login credential behavior (v0.8.3)
Selecting a login role automatically fills that role's demo email and the shared demo password (`demo-only`). This also initializes on page load and after demo data finishes loading.


### Critical login repair (v0.8.3)
A malformed escaped newline in v0.7.7 commented out the login event handlers. v0.8.3 restores the handlers and credential synchronization.


### Runtime fix (v0.8.3)
The employee roster renderer is registered as `myroster: myRoster`, matching the existing function name.


### HR Manager dashboard (v0.8.3)
The HR Manager landing page includes demo-data summary cards, quick links to core HR workspaces, a needs-attention panel, and an assigned-company access reminder. All figures are synthetic prototype counts.


### Employee-wise roster status controls (v0.8.3)
The HR Manager monthly roster report displays 10 employees per page and supports search by employee name, ID or department, plus department and roster-status filters. Status values are Published, Draft, Mixed and No roster.


### Shift Management UX (v0.8.3)
The Shift Management workspace groups shift definition, employee assignment and roster publication into a clearer workflow with responsive KPI cards and improved form/table styling. Existing demo interactions are retained.


### Employee Self-Service (v0.8.3)
The Employee landing page shows the signed-in demo employee's identity, today's published shift, upcoming published shifts and future-roster visibility. My Monthly Roster shows that employee's Published entries for the selected month and a next-seven-scheduled-days preview. Leave, personal attendance and profile screens remain planned, not implemented in this release.

## v0.8.9 — Employee workspace refinement
The Employee Workspace now shows the employee's demo identity, today's resolved shift, upcoming Published roster entries, future roster visibility and explicit availability notes for attendance, leave, payroll and profile features. Today's shift follows the agreed resolution rule: a Published date-specific roster overrides the effective normal shift assignment; otherwise the effective assignment applies; if neither exists, the employee is shown as Unassigned. The dashboard does not invent attendance totals or leave balances. This remains a functional prototype with synthetic browser-memory data, not the final React UI/UX or production authorization implementation.
