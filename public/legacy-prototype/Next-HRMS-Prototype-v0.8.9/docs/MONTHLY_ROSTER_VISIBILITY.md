# Monthly Shift & Roster Reporting and Visibility — v0.7.5

## Purpose
Provide HR with a company-wide monthly view of roster publication and employees with a personal view of their own published schedule. Let each company configure future-roster visibility and the default month opened by HR Managers and employees.

## Company-level settings
Settings are scoped by company/tenant:
- **Employee future-roster visibility:** Enabled / Disabled.
- **HR Manager default view:** Current month / Next month / Current + Next month.
- **Employee default view:** Current month / Next month / Current + Next month.

The prototype exposes these controls in Shift Management to HR Manager and Company Admin demo roles. Settings are held in browser memory and reset on reload. The default-view values are captured for configuration/reference; the current prototype month selector remains user-selectable and does not yet implement a combined two-month calendar view.

## Visibility rules
| Roster state | HR Manager / Company Admin | Employee |
|---|---|---|
| Draft | View and manage in Shift Management | Never visible |
| Published, current/past date | Visible in HR monthly report | Visible in own monthly roster |
| Published, future date | Visible in HR monthly report | Visible only when company future-roster visibility is enabled |
| Cancelled / revised history | Not implemented in this release | Not implemented; must never appear as an active schedule |

Employee self-service must be restricted to the authenticated employee's own records. The demo maps `employee@vtl-demo.test` to the first synthetic VTL demo employee (`VTL-DEMO-0001`). This is a fixture mapping, not identity verification.

## HR Manager monthly overview
- Month selector and company-scoped employee population.
- Counts for employees, Published entries, Draft entries and calendar days.
- Employee-wise published/draft entry totals.
- Shift-wise published/draft distribution.
- Daily entry list with publication status and publisher.
- Link back to Shift Management for roster maintenance.

## Employee monthly roster
- Month selector and personal schedule only.
- Shows date, weekday, shift, working-time range and Published status.
- Drafts are excluded.
- If future visibility is disabled, future dates are filtered and a future month is blocked.
- No roster entry does not imply an absence; normal shift assignment may still be used by attendance resolution according to company policy.

## Business rules and boundaries
1. A Published roster is the date-specific schedule record; a Draft never drives employee visibility or attendance.
2. Publishing a roster is not attendance approval or payroll approval.
3. A Published roster may override a normal shift assignment only according to the company's configured attendance schedule-resolution policy.
4. The monthly HR report counts date-specific roster entries, not normal shift assignments.
5. Visibility settings are tenant-specific; changing one company must not affect another company.
6. Production must enforce tenant scope, employee self-scope and future-date visibility in Laravel APIs. Hiding controls in React is not authorization.
7. Production settings require persistence, audit history, timezone-aware date handling and cache invalidation/notification behavior.

## Known prototype limitations
- Synthetic data only; no live API/database or real authentication.
- All shift, assignment, roster and visibility settings reset on reload.
- Employee identity mapping is a fixed demo fixture.
- Default month options are stored as company settings, but the prototype currently provides a single-month selector rather than a dual-month calendar surface.
- No weekly-off, holiday, leave overlay, cancellation/revision, roster notification or approval workflow is implemented here.
