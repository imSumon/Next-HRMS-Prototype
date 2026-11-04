## v0.9.49 — Login and dashboard version consistency hotfix
- Corrected hardcoded APP_VERSION in src/App.tsx (was 0.9.46).
- Synchronized src/VERSION, root VERSION and package.json to 0.9.49.
- No attendance or roster behavior changed from v0.9.48.
- Browser UAT and full build remain pending.

## v0.9.48 — Shift assignment confirmation hotfix
- Persistent inline success/error/warning summary for bulk assignments.
- Distinct duplicate/overlap feedback; selected employees remain selected if all fail.
- Successful saves clear selection and refresh assignment register.
- No roster publication occurs automatically.

## v0.9.48 — Shift assignment UX and publication clarity
- Clear single/bulk form selection after successful assignment.
- Report added and skipped counts; preserve selections when nothing saved.
- Reject overlapping assignments and invalid date ranges (existing checks retained).
- Clarify default assignment vs date-specific published roster.
- Restrict direct publication to HR Manager / Company Admin when company policy permits.
- Restrict assignment listing to current company.
- Retain all previous attendance workflows and five user panels.

## v0.9.45 — Time controls and table navigation
- Cleaner 12-hour time selection for attendance correction and device sync slots.
- Grab-and-drag horizontal scrolling on wide Ant Design tables across user panels.
- Preserved existing attendance processing and approvals.

## v0.9.44 — Attendance review and correction navigation
- Per-employee punch review drawer from Process & finalize.
- Submit missing-punch correction into existing approval queue; original device events preserved.
- Explicit reviewed-absence disposition, stored browser-locally with reason and reviewer role.
- Finalization blocked by unresolved exceptions and pending corrections.
- Reopen enabled only after a day is finalized.
- Prototype only: real identity-based authorization, shift/leave/holiday integration and persistent audit remain pending.

## v0.9.40 — Attendance navigation and scheduled sync simulation
- Replaced numbered tabs with icon-based pill navigation.
- Added animated simulated synchronization, activity history and summary on Attendance dashboard.
- Added editable daily time slots (08:30, 12:30, 17:30, 23:30 Asia/Dhaka) and on/off control.
- Clearly labeled browser-open-only simulation; production scheduler and actual device API pending.

## v0.9.37 — Phase 1A role-route and ELM safeguards
- Visible v0.9.37 release label on login page and logged-in header/footer.
- Role-route allowlist and restricted-page fallback in the React prototype (not server-side authorization).
- Prevent repeat confirmation/separation, and transfer/promotion of inactive employees.
- Reject transfer/promotion requests that do not actually change relevant values.
- Preserved prior lifecycle approval and history behavior.
- Browser UAT and full build remain pending.

## v0.9.36 — Phase 1 documentation consolidation and gap control
- Moved root `docs_*.md` notes into topic-specific `docs/` folders without deleting content.
- Retained cumulative user guide at `docs/userguide/USER_WISE_UAT_MENU_ROUTES.md`.
- Added prioritized Phase 1 gap backlog, all-panel UAT ledger and prior audit baseline.
- Aligned package version metadata to v0.9.36 (v0.9.35 package metadata previously said v0.9.34).
- No new application workflow, production integration or browser UAT claimed.

## v0.9.35 — Attendance lifecycle effective-date review
- Added company-scoped read-only Transfer/Separation review on Attendance page.
- Differentiates pending, scheduled, and effective approved changes.
- Preserves raw punches and historical data; no device integration claimed.
- Added user-wise UAT routes and scope documentation.

## v0.9.34
- Added read-only cross-module impact review to ELM Lifecycle Actions.
- Review state reflects pending, scheduled, applied or rejected requests.
- No automatic Attendance, Leave, Roster or Payroll changes.

## v0.9.33 — Lifecycle approval controls (prototype)
- Role and company scoped lifecycle submission/review checks; requester cannot approve own request.
- Prevent pending/scheduled conflicts for the same employee, validate calendar dates and joining-date bounds where present.
- Record submission, approval/rejection, and scheduled application audit events and decision remarks.
- No backend authorization; browser-local demo only.

## v0.9.30 — ELM Enrollment & Bulk Operations
- Replace limited Add Employee modal with section/tab-based Employee Enrollment workspace driven by company field configuration.
- Add CSV/XLSX import template, preview, validation and explicit commit (up to 2,000 rows / 5 MB).
- Add filename-to-Employee-ID bulk photo matching, type/size/dimension checks and browser resizing (up to 100 images).
- Preserve existing v0.9.29 data, roles, menus and configurations.
- Browser-local only; no production-grade backend, server image storage or real audit guarantee.

## v0.9.29 — ELM Field Configuration Integration
- Connected company- and screen-specific field settings to supported Employee Registration inputs, Employee Directory columns and Employee Profile details.
- Added registration validation, optional configured fields, and visible-column demo Excel export.
- Preserved existing local storage and role navigation; no backend authorization.
- See `docs_ELM_FIELD_INTEGRATION_v0.9.29.md` for short UAT and limitations.

## v0.9.27 — Company-wise field configuration
- Introduced screen selector and module-independent navigation for ELM, Recruitment, Attendance, Leave, Payroll and PMS.
- Removed Source, Mapping Status and Protection from user-facing matrix.
- Main switches now Enabled, Visible, Required and Editable. Exportable is retained only in stored legacy settings.
- ELM screen-specific settings use scoped keys; prior company Registration settings are preserved.
- Non-ELM modules show explicit not-yet-implemented state.
- No backend, production RBAC, field-to-form integration, or migrations.

## v0.9.10 — Company context and legacy sample employees
- Fixed React company context resolution by loading legacy reference company IDs used by the existing tested login handoff.
- Loaded four masked employee samples from the v0.8.9 legacy demo dataset; linked the existing Employee demo persona to one Viyellatex sample.
- Added company name/code in the React top bar and a data-quality notice.
- Left login UI, credentials, validation, role configuration and legacy login source unchanged.
- Kept transactional demo records (punches, leave, balances, policies, audit, shifts, assignments, rosters) empty.

# Changelog

## 0.9.9 — Empty Business Dataset & Testability Corrections
- Removed preloaded companies, employees, punch events, leave requests, policy records, audit events, and shift/assignment/roster seed records from the React prototype.
- Kept role test personas, role catalogue, module catalogue, and legacy audit notes as non-transactional reference/configuration material.
- Employee directory now supports creating a clean-session employee record for the current company scope; employee self-service resolves the employee by matching login email rather than a hardcoded identity.
- Added explicit empty states and a link from Shift & Roster to Employee Directory when no employees exist.
- Monthly roster report defaults to the current month.
- Prototype test records are saved in browser localStorage across refreshes/persona changes; Reset test data clears them. No backend persistence has been added.


## 0.9.6 — React role coverage and workflow parity increment

- Expanded the React role handoff to Company Admin, Department Manager and Employee while retaining the legacy login-first entry.
- Added React Company Admin dashboard and navigation.
- Added React Department Manager dashboard, team navigation and Level 1 leave approval behavior.
- Added React Employee dashboard, profile, attendance, leave summary and published-roster pages.
- Added employee-facing leave approval-stage visibility and explicit no-balance submission warning.
- Added draft roster cancellation; published roster remains locked.
- Added `docs_MIGRATION_PARITY.md` to identify migrated pages and remaining workflow gaps against v0.8.9.
- Preserved v0.8.9 reference files unchanged.
- This release is not full feature parity; remaining modules and workflow gaps are documented.

## 0.9.5
- React Super Admin and HR Manager workspace increment.


## v0.9.7
- Fixed login handoff so Company Admin, Department Manager and Employee are transferred from the legacy login frame into their React-native role workspaces, alongside Super Admin and HR Manager.
- Kept original demo credential checks and role/company assignment rules unchanged.
- Prevented automatic sidebar collapse at the large breakpoint so module labels remain visible on typical laptop and tablet widths; users can still collapse the sidebar manually.
- No business workflow or backend integration changes.

## v0.9.8 — Shift & Roster React migration increment
- Reworked Shift Management into three explicit workflows: Shift Master, Employee Shift Assignment, and date-specific Roster Management.
- Shift Master now rejects duplicate company shift names, validates non-negative break/grace values, identifies overnight shifts, and supports activate/deactivate.
- Employee shift assignment now validates active shifts, effective date ranges, and overlapping active assignments.
- Added bulk employee assignment with employee filtering and Select All filtered employees; conflicting assignments are skipped and reported rather than overwritten.
- Roster creation now rejects duplicate employee/company/date entries and always creates Draft entries.
- Added individual and bulk Draft publication with conflict detection; conflicting rows are skipped, and successful publication records publisher and timestamp.
- Published roster entries remain locked; publication is not attendance or payroll approval.
- Preserved the existing login handoff and legacy compatibility reference.
- Demo state uses browser localStorage for prototype testing; no API/database persistence added.

## 0.9.11 — Viyellatex employee register test dataset
- Imported 475 unique employee master records from the September 2026 GDL FW salary register into the Viyellatex (`co-vtl`) demo tenant at user request.
- Preserved source branch `GDL-3000` and explicitly documented that source-company affiliation differs from the requested VTL test-tenant mapping.
- Excluded bank account and all payroll/compensation fields.
- Linked the first register employee to the existing Employee demo persona via the existing synthetic alias; login code and credential checks were not changed.
- Bumped browser-local storage namespace so old v0.9.10 cache does not mask the updated sample data.

## v0.9.12 — Garment Shift & Roster UX
- Replaced the long multi-select tag box for bulk shift assignment with a searchable, paginated employee table and checkbox selection.
- Added selected-count feedback, select-all-matching and clear-selection actions.
- Added optional garment-industry shift presets (day, production A/B and overnight) that populate the form without automatically creating records.
- Added guidance for date-specific garment production roster planning and clearly stated non-automated patterns.
- Login and credential validation files were not changed.


## v0.9.13 — Employee filters and shift assignment import
- Added bulk assignment filters for department, unit, branch, floor and line, alongside free-text search.
- Expanded employee table to show garment workforce attributes.
- Preserved selections across pagination and filter changes; Select all adds all currently filtered employees.
- Added CSV and Excel (.xlsx) shift-assignment templates and CSV/XLS/XLSX import.
- Import columns: employeeId, shiftName, effectiveFrom, effectiveTo. Shift names must match an active shift in the current company; employees must belong to the current company. Conflicting/invalid rows are skipped and reported.
- Import creates employee shift assignments only; it does not create shift definitions or rosters.


## v0.9.14 — Employee Directory UX & Add Employee Workflow
- Reworked HR Manager / Company Admin Employee Directory using an Ant Design table layout inspired by the supplied reference.
- Added live total, active, inactive and last-30-day joiner counts based on actual scoped employee records.
- Added search plus department, designation and status filters, reset, pagination, sorting and Excel export of filtered records.
- Moved Add Employee into a modal with grouped personal/contact and employment/organization fields.
- Required Employee ID, full name and joining date; email and phone are optional.
- Added garment-industry department choices and organization fields for branch/factory, unit, floor and line.
- Kept login flow and credential validation unchanged. This remains a browser-local prototype; no backend persistence or authorization changes.
- Verification: TSX transpilation and ZIP integrity; full dependency-installed build and browser workflow not run.

## v0.9.15 — Employee summary card spacing and colors
- Added consistent gutters between Employee summary cards.
- Applied separate subtle light-blue, green, red and amber backgrounds with matching icon backgrounds.
- Added light borders, rounded corners and restrained hover elevation.
- No login, credential validation or business logic changed.

## 0.9.16
- Corrected Employee summary card spacing with explicit CSS grid gaps and enforced separate pastel card backgrounds.
- No business logic or login code changed.

## 0.9.19
- Fixed summary-card styling selectors to target direct statCard children rendered by Ant Design Row.
- Applied pastel backgrounds, borders, icon colours, spacing and responsive grid to Monthly Shift & Roster, Shift & Roster Management, Attendance Management and dashboard summary rows.
- Added truthful payroll summary metrics: employee records, zero payroll runs, zero calculations, and report catalogue count; no payroll engine implied.

## 0.9.21 — Coordinated full synthetic demo dataset
- Added a single, explicitly labelled synthetic dataset for the NREE DEMO tenant, with stable IDs and company ownership across employees, shifts, effective-dated assignments, Draft/Published rosters, punch events, leave balances, leave requests, policies, users, roles and audit examples.
- Added top-bar **Load full demo** and **Reset test data** controls. Loading replaces the prior transactional demo state and appends only synthetic employee records; resetting restores the original baseline and clears browser-local module state.
- Preserved the supplied legacy employee/reference records and v0.8.9 compatibility files; generated records are not represented as production data.
- Bumped the browser-local storage namespace so the new release starts from its own baseline rather than inheriting stale v0.9.20 state.
- This is a dataset/testability increment only. It does not complete the attendance import/mapping/processing workflow, employee leave submission, backend persistence, durable audit, or full v0.8.9 page parity.
- Verification: source syntax and dataset relationship checks; full dependency-installed TypeScript/Vite build and browser workflow tests were not completed because dependency installation timed out.
\n\n## v0.9.23 — Configurable Shift & Roster workflow\n- Added company-scoped assignment method setting: Employee-based, Roster/Calendar-based, Hybrid with approval.\n- Added company-level roster approval toggle, future roster visibility preference and weekly-off day configuration.\n- Added Draft → Pending Approval → Published workflow with submitter/approver metadata and conflict checks.\n- Stored shift timing snapshots on roster records so later Shift Master edits do not rewrite saved roster timing.\n- Added approval status and pending-approval count to the roster views.\n- Remaining: true employee-profile default shift editor, full monthly calendar grid, department/branch group scheduling, permanent/temporary change requests, automatic weekly-off generation, and attendance engine integration.\n\n\n## v0.9.23 — Configurable Shift & Roster workflow\n- Added company-scoped assignment method setting: Employee-based, Roster/Calendar-based, Hybrid with approval.\n- Added company-level roster approval toggle, future roster visibility preference and weekly-off day configuration.\n- Added Draft → Pending Approval → Published workflow with submitter/approver metadata and conflict checks.\n- Stored shift timing snapshots on roster records so later Shift Master edits do not rewrite saved roster timing.\n- Added approval status and pending-approval count to the roster views.\n- Remaining: true employee-profile default shift editor, full monthly calendar grid, department/branch group scheduling, permanent/temporary change requests, automatic weekly-off generation, and attendance engine integration.\n

## v0.9.24 — Shift & Roster completion increment
- Added effective-dated employee default shift register and history.
- Added monthly roster generator by department/branch, including configured weekly offs and company holiday dates; existing employee/date rows are skipped.
- Added monthly employee calendar grid and employee/date schedule resolution preview on Attendance.
- Added temporary/permanent shift-change request workflow with reviewer decision history.
- Added configurable one- or two-level roster approval with role-based reviewer checks.
- Preserved immutable shift snapshots on published roster rows.
- Browser-local prototype only; backend authorization, durable audit, device integrations and full end-to-end verification remain outside this release.

## v0.9.25 — ELM naming and field configuration demonstration
- Renamed employee module catalogue and menu to Employee Lifecycle Management (ELM).
- Added Super Admin and company-scoped ELM Field Configuration prototype.
- Added Super Admin-controlled delegation for Company Admin / HR Admin in browser-local demo.
- Documented limitations and Cursor handoff in `docs_ELM_FIELD_CONFIGURATION_v0.9.25.md`.

## v0.9.28 — Field Configuration space-saving UI
- Collapsed the two lengthy ELM prototype notices into one closed-by-default native details control below the field matrix.
- Preserved all safety/production caveats inside the expandable notes.
- No change to field configuration logic, data, or delegated authority.

## v0.9.31
- Fixed bulk photo selection control and added visible staged review/confirm UI.
- Added user-wise UAT guide update and developer note.

## v0.9.32 — ELM Lifecycle Actions
- Employee Directory → Lifecycle Actions and per-employee Manage entry.
- Company-scoped confirmation, transfer, promotion and separation requests with effective dates.
- Prototype Company Admin approval/rejection and request history.
- User-wise UAT routes updated in docs/userguide/.
- Bulk import reconciliation remains deferred in the roadmap.

## v0.9.32 hotfix
- Fixed React hook-order violation that could produce a blank screen after login.
- Removed stale employee-modal setter.

## 0.9.38 — Phase 1B roster controls
- Added approval stage separation, self-approval protection, direct-publish policy guard and date validation.
- Updated Phase 1B tracker and user-wise UAT.

## v0.9.39 — VTL 50-employee Attendance Simulation

- Added dedicated Attendance Operations lab with 50 existing VTL demo employee IDs/names, deterministic mixed attendance scenarios, simulated device registry, online/offline toggles, incremental synthetic sync, manual punch and CSV/XLSX intake, correction queue, XLSX report and local audit.
- Added favicon based on user-supplied circular logo, and updated visible login version to v0.9.39.
- Added explicit simulation disclaimers and attendance UAT instructions. **No real biometric device connectivity or complete attendance processing engine is claimed.**


## v0.9.41 — Device registration form
- Collapsible prototype information notice.
- Device identity, connection type, LAN IP/port, serial/MAC, timezone and sync mode.
- LAN connection fields required conditionally; duplicate IP/port rejected in demo.
- No live biometric connectivity added.

## v0.9.42 — Attendance company workspace visibility hotfix
- Removed VTL-only attendance-page gate. All company users can open their own company-scoped attendance workspace.
- Existing VTL 50-person sample remains exclusive to VTL. Other companies are not populated with VTL punches or devices.
- For non-VTL companies, device setup and raw manual entry can be used with their own employee records; scenario generation remains limited pending company-specific rules.
- Browser UAT and full build pending.

## v0.9.43
- Added daily processing and finalization prototype with duplicate filtering, shift-window attendance, correction awareness, exception blocking and browser-local lock/reopen.
- Preserved raw punch history; documented incomplete roster/leave/OT and manual approval workflows.

## v0.9.46
- Attendance processing now uses published roster snapshots and weekly-off assignments, flags missing/invalid/conflicting roster.
- Manual HR-assisted attendance routes through correction approval, not raw punch insertion.
- Correction approval uses individual login identity with reviewer tracking (prototype only).
