# Next-HRMS React Prototype v0.9.36

**This release organizes documentation and plans Phase 1 completion.** No new runtime functionality is claimed. Read `docs/README.md`, `docs/planning/PHASE1_GAP_BACKLOG_v0936.md`, and `docs/planning/ALL_PANEL_UAT_TRACKER_v0936.md` first.

## v0.9.35 — Cross-module impact review (read-only)

Adds a company-scoped, per-request checklist for Attendance, Leave, Shift/Roster and Payroll. No downstream records are changed.

## v0.9.27 — Field Configuration UI
- Company → Module → Screen selector; ELM Registration/Profile/Directory.
- Source, Mapping Status and Protection columns removed; Exportable hidden.
- Delegated company/HR administration retained.
- Other modules listed as future catalogues, not working configuration.
- Browser-local prototype only; see docs_FIELD_CONFIGURATION_v0.9.27.md.

# Next HRMS React — v0.9.20

## Login and role entry
- The original v0.8.9 login screen remains the first screen.
- The original demo role selection and credential-check source is retained unchanged.
- Successful login is handed to React for Platform Superadmin, Company Admin, HR Manager, Department Manager and Employee roles.
- v0.8.9 remains included unchanged as the reference/fallback workspace while remaining modules are migrated.

## React workspaces
- **Platform Superadmin:** platform overview, Superadmin responsibilities, company enrollment, company directory, users/roles and audit trail.
- **Company Admin:** company dashboard plus employee, shift, roster, attendance, leave, payroll, setup, access and audit navigation.
- **HR Manager:** HR dashboard, employee directory, shift management, monthly roster, attendance, leave, payroll and company setup.
- **Department Manager:** team dashboard, team directory, attendance review and Level 1 leave review route.
- **Employee:** dashboard, profile, attendance summary, leave balance/request history and published monthly roster.

## Workflow guardrails
- Leave submission is blocked when HR has not recorded a balance for the selected leave type.
- Manager Level 1 approval forwards an application to HR Level 2; it does not deduct leave.
- Leave balance is deducted only after final HR approval and only when sufficient balance exists.
- Draft rosters are not employee-visible. Published rosters are locked. Roster publishing is not attendance approval.
- Company and role boundaries are represented in the demo UI; production must enforce them server-side.

## Migration status
This is a **React migration increment, not complete v0.8.9 feature parity**. Some modules have React pages with partial workflows; others remain unported. See `docs_MIGRATION_PARITY.md` for the page-by-page status and remaining work. Recruitment, PMS, file cabinet, PF, bills, probation and personal-file workflows are not yet functional React modules. Attendance import/processing, full roster revision workflow, full company policy editor and payroll calculations remain incomplete.

## Technical boundaries
- Synthetic demo data only; no live HRMS API, Laravel backend or production database.
- Prototype test records persist in browser localStorage; use Reset test data to clear them.
- No production authentication or server-side authorization is connected.
- Login/credential source was not changed.

## Run
```bash
npm install
npm run dev
```


### v0.9.7 navigation fix
All five demo roles now hand off from the original login frame to the React workspace. Company Admin, Department Manager and Employee were previously left inside the legacy iframe because the login bridge only notified the parent for Super Admin and HR Manager. Sidebar labels also remain expanded by default at ordinary desktop/tablet widths.


## v0.9.20 — Shift & Roster parity update
- Restored the monthly shift-wise distribution (Published and Draft counts).
- Added the daily roster entry list with weekday, shift hours, publication status, publisher and publication timestamp.
- Extended employee My Monthly Roster with weekday and working-time range; it continues to show only the logged-in employee's Published entries.
- Added a one-click illustrative sample dataset for shift definitions, effective-dated assignments and monthly roster rows. Sample rows are clearly labelled and can be removed without deleting non-sample records.
- Added sample-data controls to both Shift Management and Monthly Shift & Roster.
- Kept the legacy v0.8.9 reference workspace unchanged.

## Sample dataset notes
- Use **Load sample dataset** after signing in to a company workspace with employee records.
- It creates four example shift patterns (day, Production A, Production B and overnight), up to six employee assignments and date-specific Published/Draft rows for the selected report month.
- Sample data is synthetic, stored in browser-local prototype state, and is not connected to a live HRMS database.
- Existing non-sample roster rows for the same employee/date are not overwritten.
- Use **Remove sample rows** to remove the generated sample shifts, assignments and rosters.


## v0.9.22 demo dataset
Use **Load full demo** in the React workspace top bar to load coordinated synthetic NREE DEMO records across the supported prototype modules. Use **Reset test data** to restore the baseline. See `docs_FULL_DEMO_DATASET.md` for scope and limitations.

## v0.9.29
See `docs_ELM_FIELD_INTEGRATION_v0.9.29.md` for integration scope, limitations and short UAT.

### v0.9.32
ELM → Employee Directory → Lifecycle Actions. See docs/userguide/USER_WISE_UAT_MENU_ROUTES.md and docs/ELM_LIFECYCLE_ACTIONS_v0.9.32.md.

### v0.9.38 scope
Targeted Phase 1B roster approval controls only. See `docs/planning/PHASE1B_ROSTER_CONTROLS_v0938.md`.

## v0.9.40 attendance UX and scheduled demo sync
Icon navigation; device sync status, animated transfer, editable Bangladesh-time schedule (four defaults), and per-device activity history. Schedule only runs while the page is open. Real device integration, server scheduler and offline retry remain pending.


### v0.9.42 device registration
Device form now captures brand/model, company site, connection type, IP/hostname and port (LAN only), optional serial and MAC, timezone and sync mode. Hardware API credentials and real connectivity are deferred to backend integration; never store production secrets in browser-local state.

### v0.9.43
Attendance → Process & finalize is a limited browser-local processing demo, not payroll-ready or production device integration. See `docs/planning/PHASE1_ATTENDANCE_PROCESSING_v0943.md`.


### v0.9.49 version hotfix
Login badge, top-bar badge and footer now read v0.9.49. No workflow changes from v0.9.48.
