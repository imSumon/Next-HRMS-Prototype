# React migration parity — v0.9.6

Reference baseline: `Next-HRMS-Prototype-v0.8.9` (included unchanged under `public/legacy-prototype/`).

This release expands native React role coverage. It is a migration increment, not a claim that every v0.8.9 workflow is fully ported.

## Role entry and navigation

| Legacy role | React workspace in v0.9.6 | Status |
|---|---|---|
| Platform Superadmin | Platform Overview, Superadmin, Enrollment, Companies, Users & Roles, Audit | Existing React implementation retained |
| Company Admin | Company Dashboard, Employees, Shift Management, Monthly Roster, Attendance, Leave, Payroll, Company Setup, Users & Roles, Audit | React navigation and dashboard added; underlying pages have varying depth |
| HR Manager | HR Dashboard, Employees, Shift Management, Monthly Roster, Attendance, Leave, Payroll, Company Setup | React workspace retained and expanded |
| Department Manager | Manager Dashboard, My Team, Team Attendance, Leave Approvals | React navigation and dashboard added; team scoping is demo-level |
| Employee | My Dashboard, My Profile, My Attendance, My Leave, My Monthly Roster | React self-service pages added; correction and leave-submission workflow remains incomplete |

## Functional parity status

| Legacy module / workflow | v0.9.6 status | Remaining work |
|---|---|---|
| Login-first flow and role landing | Compatibility entry retained | Browser verification required |
| Platform tenant overview, enrollment, directory, roles, audit | React pages present | Complete multi-step enrollment and tenant lifecycle actions |
| Employee directory | React table/search | Full employee create/edit lifecycle and filters |
| Shift master | React forms and demo records | Edit/deactivate, validation, overnight rule edge cases and history |
| Employee shift assignment | React assignment flow | Full bulk selection, effective-date overlap checks and history parity |
| Roster draft/publish | React draft and publish flow; draft cancellation added | Calendar generation, bulk publish, revision/approval and complete audit parity |
| Monthly roster overview | React summary and visibility preferences | Full legacy filtering, pagination and detailed calendar parity |
| Attendance punch list | React event table | File import, mapping, processing, exception resolution, correction workflow and reconciliation |
| Leave balance and approvals | React balance register and Level 1/Level 2 decision paths | Employee application form, configurable company approval routing and complete return-for-correction flow |
| Payroll | Readiness/report catalogue only | Payroll calculations intentionally not implemented |
| Company setup | Seven-section map | Detailed policy field editor and validation |
| Employee profile | React display page | Employee-submitted profile change requests |
| Employee attendance | React punch summary | Calendar, missing-punch correction submission and approval status |
| Employee roster | Published-only list | Full monthly calendar and visibility preference enforcement |
| Employee leave | React balance/request summary and no-balance warning | Employee leave application and request cancellation |
| Recruitment, PMS, file cabinet, PF, bills, probation, personal files | Not migrated as functional React modules | React-native pages and workflows still required |

## Guardrails preserved

- v0.8.9 is retained unchanged as the reference/fallback.
- React uses synthetic demo data only; no API or production database is connected.
- Leave submission must remain blocked when HR has not recorded the selected leave balance.
- Leave balance is deducted only at final HR approval, not at employee submission or manager Level 1 approval.
- Manager Level 1 approval forwards to HR Level 2; it does not finalize or deduct leave.
- Published rosters are employee-visible; Draft rosters remain HR-only. Publishing a roster is not attendance approval.
- No Git operations, migrations, UAT or production changes were performed.

## Verification

- Legacy `app.js` JavaScript syntax checked with Node.
- React TypeScript/JSX syntax transpilation checked using TypeScript `transpileModule`.
- Demo JSON parsed successfully.
- ZIP integrity checked.
- Full `tsc -b`, Vite production build and browser workflow testing were not run because React dependencies are not installed in this workspace.

## v0.9.8 update
See `docs_SHIFT_ROSTER_PARITY.md` for the detailed Shift & Roster React migration scope and remaining gaps. This increment improves the three core workflows but does not claim full roster automation or production attendance integration.


## v0.9.9 empty dataset correction
The React app no longer preloads operational business records. See `docs_EMPTY_DATASET_AND_TESTING.md` for retained test personas, clean-session workflow, and remaining functional limitations.


## v0.9.19 summary-card correction
Fixed shared statistic-card styling to match actual direct-child DOM structure in Ant Design Row. Applied to Monthly Shift & Roster, Shift & Roster Management, Attendance Management, and dashboard summary rows. Payroll & Reports now has four explicit readiness summary cards; payroll calculations remain unimplemented.
