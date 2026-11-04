# v0.9.8 Shift & Roster React parity notes

Reference: `Next-HRMS-Prototype-v0.8.9/docs/SHIFT_AND_ROSTER_DESIGN.md` and the legacy `shiftManagement()` / event handlers in `app.js`.

## Implemented in React v0.9.8
- Shift Master: company-scoped create, duplicate-name rejection, break/late-grace/early-grace fields, overnight identification, activate/deactivate.
- Single employee shift assignment with effective-from/to validation.
- Bulk assignment with filtered employee selection, Select All filtered employees, and conflict skipping/reporting.
- Overlapping active assignments for the same employee are rejected; existing assignments are not silently overwritten.
- Date-specific roster entries are always Draft; duplicate employee/company/date entries are blocked.
- Individual and bulk publication; existing Published employee/date conflicts are skipped and reported.
- Publication metadata (`publishedAt`, `publishedBy`) recorded in demo memory.
- Published rows have no edit/cancel action and remain locked.
- Employee roster remains limited to the signed-in demo employee's Published rows; Draft rows are not shown.
- Monthly HR summary and company roster visibility preference UI remain available.

## Explicitly not claimed as migrated
- Weekly/monthly roster auto-generation, templates and rotating patterns.
- Weekly-off and holiday calendar integration, leave integration and staffing coverage checks.
- Draft editing/deletion and published roster correction/revision approval workflow.
- Roster approval workflow and durable audit history.
- Attendance engine schedule resolution and backend authorization/company isolation.

## Verification
- TypeScript/JSX syntax transpilation checked with the installed TypeScript compiler API.
- Legacy `app.js` syntax checked with Node.
- ZIP integrity checked.
- Full `npm run build` and browser interaction testing were not run because React/Vite dependencies are not installed in this environment.
- All records remain synthetic; v0.9.9 persists prototype test records in browser localStorage so testers can switch personas and refresh. Reset test data clears them.

## v0.9.12 UX update
Bulk assignment now uses a searchable, paginated employee table with checkbox selection, selection count, select-all-matching and clear-selection. Garment shift presets are optional form-fill examples; no shift records are automatically created. Roster guidance describes department/production-line planning, while weekly offs, holidays and rotating patterns remain manual/not implemented.


## v0.9.14 additions
Bulk assignment now supports department, unit, branch, floor and line filters, free-text search, page-size controls, and selection retention across pages/filters. CSV and Excel templates/import are available for employee shift assignments. Import expects employeeId, shiftName, effectiveFrom, effectiveTo; shiftName must match an active company shift. Invalid/conflicting rows are skipped and reported. No XLSX import browser test or full dependency build has been run in this environment.
