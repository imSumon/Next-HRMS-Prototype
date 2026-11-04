# Shift & Roster Functional Design

## Purpose and scope
This document defines the functional contract for the Shift Management prototype. It is a process/UI reference for later React + Ant Design and Laravel implementation, not a production architecture approval.

## Three separate responsibilities
1. **Shift Master** defines reusable working-time patterns: name, start/end, break, late grace and early-departure grace. End time less than or equal to start time represents an overnight shift.
2. **Employee Shift Assignment** defines an employee's normal/default shift over an effective date range. Supports one employee or bulk selection. Bulk Select All applies only to currently filtered employees. Overlapping active assignments for the same employee must be rejected/skipped, never silently overwritten.
3. **Roster Management** defines the employee's actual scheduled shift or day off for a specific work date. A roster is date-specific and may override the normal assignment according to the company's configured attendance policy.

## Roster lifecycle in this prototype
- New roster entries are always created as **Draft**. Users cannot bypass review by choosing Published in the creation form.
- A Draft can be published individually or selected with other Draft entries for bulk publication.
- Publishing changes status to **Published** and records demo `publishedAt` and `publishedBy` metadata in memory.
- Published rows are locked in this prototype; no edit/cancel/revision action is exposed.
- Duplicate employee + company + date entries are blocked at creation.
- Publication checks for an already Published roster for the same employee and date. Conflicting selected rows are skipped and reported; non-conflicting rows are published.
- Publishing a roster is a schedule publication action, **not** attendance approval or payroll approval.

## Schedule resolution concept
For a work date, the configured company policy determines schedule source:
- Employee-based: use the effective-dated employee assignment.
- Roster/calendar-based: use the valid Published roster for that date; if required and missing, raise an exception rather than silently guessing.
- Hybrid: use the normal assignment unless a Published roster override applies, as defined by company policy.
A Draft roster must never drive attendance calculation. A Published roster may take precedence over the normal assignment only where the company policy selects roster/hybrid behavior. Do not assume one universal precedence for every tenant.

## Planned, not yet implemented
- Draft editing and deletion with appropriate audit history.
- Published roster correction through a controlled revision/cancellation workflow and approval.
- Weekly/monthly roster generation, templates and rotating patterns.
- Weekly offs, public/company/branch holidays, leave integration and staffing coverage checks.
- Roster approval workflow and notifications.
- Persistent audit history and server-side authorization/company isolation.
- Attendance engine integration using approved company policy.

## Developer guidance
Treat this document and the working prototype as the functional reference. Inspect existing screens and handlers before implementing. Reuse established concepts; do not duplicate Shift Master, employee assignment or roster workflows. If a requirement conflicts with this specification or is ambiguous, report it for Product Owner decision before changing behavior. Prototype state is in-memory and resets on reload; do not treat it as production persistence or security.

## v0.7.5 — Monthly reporting and employee visibility
Monthly reporting, employee self-service visibility and company-level default-month preferences are defined in `MONTHLY_ROSTER_VISIBILITY.md`. The monthly HR report is a reporting surface over existing shift assignments and roster records; it does not create or publish schedules. Employee self-service displays only the authenticated employee's Published roster records and never Draft entries. Production must enforce future-date visibility and employee self-scope in the API, not only in the client.
