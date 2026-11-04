# Full demo dataset — v0.9.22

The **Load full demo** action now loads the coordinated synthetic workflow into the company workspace of the signed-in user. It uses the first six existing employees in that company as the linked demo participants, so the selected company scope and its Monthly Shift & Roster report show the generated rows.

The loader replaces only generated demo records for the active company and leaves other companies' records intact. It creates linked shift definitions, effective-dated assignments, November 2026 roster rows (five Published and one Draft), punch events, leave balances, leave requests, policy examples, role examples and audit examples.

All records are synthetic test data. This is browser-local prototype data only; it is not connected to a live HRMS/API/database. Use Reset test data to restore the v0.9.21 baseline.
