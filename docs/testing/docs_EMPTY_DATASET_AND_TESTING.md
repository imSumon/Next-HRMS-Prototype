# Empty Dataset & Testing Notes — v0.9.9

## Initial dataset

The React prototype starts with no operational business records:
- Companies / tenants: 0
- Employees: 0
- Attendance punch events: 0
- Leave requests: 0
- Leave balances: 0 (initialized at login)
- Policy records: 0
- Audit events: 0
- Shift definitions: 0
- Employee shift assignments: 0
- Roster entries: 0

Retained non-transactional material:
- Role test personas used by the legacy login handoff
- Role catalogue and module catalogue
- Legacy audit notes used as product-design evidence
- Embedded v0.8.9 reference prototype (kept unchanged)

## Clean-session test flow

1. Login as HR Manager or Company Admin.
2. Open Employee Directory and create an employee. For employee self-service testing, use the same email as the Employee test persona login. Records persist when switching personas.
3. Open Shift Management and create a shift.
4. Assign the newly created employee individually or through bulk assignment.
5. Create Draft roster entries and publish them.
6. Login as Employee using the matching email and verify own profile/roster visibility.
7. Verify all other modules show empty states until records are created or their creation workflows are implemented.

## Important limitations

- React prototype records persist in browser localStorage across refreshes and persona changes. The Reset test data control clears them. No API or server database persistence is used.
- Company Admin / HR login company scope is supplied by the existing login handoff. The tenant directory starts empty; the prototype does not yet provide a complete company creation-to-workspace-switch lifecycle.
- Employee creation is a minimal prototype record (ID, name, email, designation, department, branch). It is not a complete employee onboarding/profile workflow.
- Attendance punch import/device integration and manual attendance entry are not implemented.
- Employee leave application UI is not implemented; the existing approval and balance logic cannot be exercised end-to-end from a clean dataset yet.
- Payroll calculation, detailed policy editing, and durable audit persistence are not implemented.
- Role test personas are retained only to enter each UI role. They are not employee or company business records.
- The embedded legacy v0.8.9 reference is intentionally kept unchanged and may still contain its original illustrative content.

## Verification performed

- Parsed `src/data/demo.json` and verified all operational business record collections are empty.
- Checked that hardcoded VTL employee, shift and roster seed references are removed from active React source.
- TypeScript TSX transpilation syntax check: 0 diagnostics.
- Full `npm run build` and browser workflow testing were not run because project dependencies are not installed in this environment.
