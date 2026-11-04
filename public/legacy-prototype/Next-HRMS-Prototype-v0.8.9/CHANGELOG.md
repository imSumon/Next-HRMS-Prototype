# Changelog

## v0.8.9
- Added fictional demo personal and employment data to the Employee Profile fixture so the page can be reviewed with realistic sample values.
- Added employment type and joining date to the profile summary.
- Clearly marked profile data as synthetic; no real employee data used.
- Preserved login behavior and existing profile/roster navigation.


## v0.8.8
- Added Employee My Profile page with personal, employment, address and emergency-contact sections.
- Added My Profile to Employee navigation and linked the dashboard service tile to the new page.
- Missing employee attributes display as unavailable; no personal data is fabricated.
- Profile editing remains pending; existing login and credential behavior unchanged.


## v0.8.7
- Cross-checked the Employee Dashboard against the supplied legacy dashboard screenshot.
- Added legacy-aligned employee service tiles: Dashboard, Payroll, Leave, Attendance, PMS, Recruitment, File Cabinet, PF Management, Personal Files, Bill Management, Probationers and My Monthly Roster.
- Added four notification panels: Leave Management, Attendance, Bill Management and Probationers Progress.
- Clearly marked unimplemented employee services as Planned; no synthetic payroll, leave balance or attendance figures added.
- Preserved existing login implementation and roster workflow; no credential validation changes.


## v0.8.6
- Expanded Employee Dashboard service coverage and status clarity for attendance, leave, payroll, personal documents, profile and notifications.
- Kept roster as the only connected employee self-service workflow; marked other services as planned/not connected rather than showing invented balances or figures.
- Preserved existing login implementation and role configuration without adding credential validation.


## v0.8.5
- Fixed login initialization: restored the missing role configuration required by role selection, company scoping, and post-login navigation.
- No workflow or dashboard behavior intentionally changed.

# v0.7.4 — Roster publication workflow

- Changed roster creation so every new entry starts as Draft; removed direct Published selection from the form.
- Added individual Publish actions for Draft roster entries.
- Added checkbox selection and bulk publication for Draft entries.
- Added conflict checking at publication: entries conflicting with an already Published employee/date roster are skipped and reported.
- Published entries display a locked state in this prototype; draft editing, cancellation/revision approval and audit persistence remain future work.
- Added `docs/SHIFT_AND_ROSTER_DESIGN.md` as the functional reference for Shift Master, Employee Shift Assignment, Roster Management and schedule resolution.
- Publishing a roster is explicitly distinct from attendance approval.
- Validation: JavaScript syntax and ZIP integrity checked; browser interaction testing remains required.

## v0.7.3 — Shift and roster functional design
- Added a module-level functional design reference for shift definitions, employee assignments, roster behavior and schedule resolution.

## v0.7.2 — Bulk assignment runtime fix
- Fixed the bulk shift assignment handler to resolve employees through the company-scoped `shiftEmployees()` function.
- Preserved selection, date/shift validation, overlap checks and per-employee result reporting.

## v0.7.1 — Bulk assignment interaction fix
- Fixed bulk assignment action handling with explicit click handling and inline validation/reporting.

## v0.7.0 — Unified single and bulk shift assignment
- Combined single-employee and multiple-employee assignment into one workspace.

## v0.6.9 — Bulk employee shift assignment
- Added checkbox-based bulk employee selection, search, department filtering, filtered Select All and per-employee overlap checks.

## v0.6.8 — Dedicated Shift Management workspace
- Added Shift Management as a standalone workspace with Shift Master, effective-dated employee assignment and daily roster entries.

## v0.7.5 — Monthly Shift & Roster Overview and employee visibility
- Added HR Manager monthly Shift & Roster Overview with month selection, company-wide totals, employee-wise publication counts, shift-wise distribution and daily roster status list.
- Added Employee Self-Service My Monthly Shift & Roster page with personal published schedule only.
- Added company-specific future Published roster visibility setting and separate HR Manager / Employee default-month preferences in Shift Management.
- Employee view excludes Draft entries and filters future dates when company future visibility is disabled.
- Added role navigation for HR Manager, Company Admin and Employee.
- Added `docs/MONTHLY_ROSTER_VISIBILITY.md` with business rules, visibility matrix, production requirements and prototype limitations.
- All new settings and report data remain in-memory demo state; no production security or persistence is implied.


## v0.7.6 — Login company selection fix
- Kept the company workspace selector visible on the login screen; it is disabled only for Platform Superadmin or demo roles with a fixed company assignment.
- Populated company options after demo data loads and safely handled early role changes while data is loading.
- Scoped Department Manager and Employee demo roles to Viyellatex (`co-vtl`) consistently with their demo accounts.
- Preserved Company Admin's ability to select an available company workspace.


## v0.7.7 — Demo credential synchronization
- Fixed login credentials not refreshing consistently when the selected login role changes.
- Added a single credential-sync routine for role changes and initial page startup.
- Re-synchronizes after demo company data loads, while retaining the selected role and company context.
- Clears stale login validation messages when switching roles.


## v0.7.8 — Critical login handler repair
- Fixed an escaped newline in the v0.7.7 login initialization code that caused the login initialization comment to swallow the remaining login event handlers.
- Restored role-change credential synchronization and the login form submit handler.
- Confirmed the complete JavaScript file parses successfully with Node.js.


## v0.7.9 — My Roster renderer reference fix
- Fixed the renderer registry to map the `myroster` page key to the existing `myRoster()` function.
- This resolves the `ReferenceError: myroster is not defined` runtime error during app initialization.
- No roster business rules or login credentials were changed.


## v0.8.0 — HR Manager dashboard UX refresh
- Reworked the HR Manager landing dashboard with assigned-company context and a clearer welcome area.
- Added actionable demo-data summary cards for employee records, pending leave, punch exceptions and monthly roster planning.
- Added direct shortcuts for attendance, leave, shift management, monthly roster, employees and payroll preparation.
- Added a needs-attention panel and a visible company-scope reminder.
- Added responsive desktop, tablet and mobile styling. Counts remain synthetic prototype data.


## v0.8.1 — Employee-wise roster status pagination and filters
- Replaced the long employee-wise monthly roster status table with 10-row pagination.
- Added search by employee name, employee ID and department.
- Added department and roster-status filters (All, Published, Draft, Mixed, No roster).
- Added result count and previous/next page controls.
- Search and filter changes reset pagination to the first page; selected report month remains intact.
- Updated documentation and release metadata.


## v0.8.2 — Roster report pagination and Shift Management UX
- Retained employee-wise roster search, department/status filters and 10-row pagination from v0.8.1.
- Refined Shift Management into a structured workspace with a three-step visual workflow: define shifts, assign employees, publish rosters.
- Improved KPI cards, section hierarchy, forms, tables, assignment panels and responsive layouts.
- Preserved existing shift, assignment, roster, publish and company visibility interactions.


## v0.8.3 — Employee Dashboard and My Monthly Roster
- Replaced the placeholder Employee Self-Service landing page with a personal workspace summary.
- Added employee identity and department context, today's published shift, upcoming published shifts and company future-roster visibility status.
- Added a short upcoming schedule preview and direct navigation to My Monthly Shift & Roster.
- Improved My Monthly Roster with selected-month schedule, published-day metrics and next-seven-scheduled-days preview.
- Preserved employee-only filtering, Published-only visibility, company future-roster setting and default-month preference.
- Clearly marked leave, attendance and profile areas as planned follow-up features; no incomplete actions are presented as working.

## v0.8.4 — Employee dashboard functional refinement
- Reorganized the Employee Workspace around employee identity, today's resolved shift, attendance-data availability, upcoming published shifts and company-controlled future roster visibility.
- Dashboard now resolves today's shift using the agreed rule: a Published date-specific roster takes precedence; otherwise use the effective normal shift assignment; otherwise show Unassigned.
- Added a focused My Monthly Roster quick action and employee-facing information/notification panels.
- Clearly labels leave, attendance history, payroll and profile editing as not yet implemented; avoids showing invented balances or unverified attendance metrics.
- Retains the existing basic prototype UI; this is not the final React UI/UX design.
- Keeps the demo identity mapping and synthetic/browser-memory limitations explicit.
