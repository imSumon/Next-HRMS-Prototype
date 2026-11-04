# Next-HRMS v0.9.29 — ELM field configuration integration

## Scope
- Company-scoped settings from Company Setup → Field Configuration now drive supported Employee Registration inputs, Employee Directory columns, and the employee self-service Profile details.
- Registration uses enabled/visible/required/editable flags for the existing supported inputs. Protected Employee ID, full name, company reference, and employment status retain system safeguards. Additional candidate catalogue fields appear on registration only after explicitly configured for that company (simple text/date controls, not production-specific lookups).
- Employee Directory column visibility is resolved per company and screen; demo Excel export follows the same visible-column settings, but is **not** a substitute for export authorization.
- Employee Profile display visibility follows per-company profile configuration. Employee self-service profile remains read-only.
- Existing employee data and localStorage keys are retained. No backend, migration, API, or production authorization changes.

## Limitations
- No complete 80-field form integration, custom validation dependencies, data typing, cross-module rules, or production-grade security.
- Required and editable flags apply to registration controls only; profile editing is not introduced.
- Browser-local changes and tests do not demonstrate server-side permission enforcement.
- Fields marked as candidate require business/schema review before production.

## Short UAT (manual browser checks — not yet executed)
1. Login HR for Company A. Set ELM → Employee Registration → Blood Group to Enabled/Visible/Required; open Add Employee and verify field appears and blocks blank save.
2. Disable a non-protected registration field (e.g. Email); verify it disappears, existing employee email data remains.
3. In ELM → Employee Directory, hide Email; verify column and demo Excel export omit it.
4. In ELM → Employee Profile, hide Email; login linked employee and verify email detail is hidden.
5. Switch Company B; verify Company A settings are not inherited.
6. Try disabling Employee ID or Full Name; verify the switch remains protected.
7. Reload browser; verify local settings persist.
8. Check login-first flow, HR/Company/Admin navigation, and Shift/Roster/Leave pages for regressions.

## Verification
Static source and ZIP integrity checks only. No browser UAT or npm build was completed in this environment.
