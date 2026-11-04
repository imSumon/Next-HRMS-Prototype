# Next-HRMS — ELM Field Configuration (v0.9.25)

## Approved design decision — 2026-11-03
- New module: **Employee Lifecycle Management (ELM)**, replacing legacy PIMS in the new UI.
- Performance Management remains **PMS**.
- Super Admin controls protected fields and grants company-scoped configuration authority.
- Company Admin and HR Admin may configure permitted fields **only if delegated**, for their own company.
- Protected fields and historical data must not be deleted by hiding a field.

## Prototype scope delivered
- Company-wise ELM field matrix accessible from Super Admin and company/HR menus.
- Company selector restricted to Super Admin; company roles use their login company context.
- Delegation switches controlled by Super Admin in the prototype UI.
- Field switches: Enabled, Visible, Required, Editable, Exportable.
- System-protected demo fields: employee code, full name, company reference, employment status.
- Other module choices displayed as placeholders; only ELM has a field catalogue.
- Browser-local persistence under `next-hrms-react-v0.9.25-elm-field-config`.
- Module catalogue and enrollment default renamed to ELM.

## Limitations / NOT implemented
- Browser-local only: no API, backend role checks, server audit, tenant isolation guarantee, database migration or deployment.
- No ELM field visibility changes on employee screens yet. The matrix is an isolated functional demonstration.
- Legacy ~70-field mapping is not complete. Current fields are illustrative; classification requires review.
- No custom-field creation, field-level sensitive-data authorization, effective dating or historical policy versioning.
- Existing demo records and v0.9.24 test-data key retained; no data migration or reset.

## Cursor handoff — next tasks (do not assume completed)
1. Review legacy PIMS field inventory and map names, types, overlaps and required business rules.
2. Approve field classifications and screen-level applicability.
3. Add backend-enforced company-scoped RBAC and audit before any production use.
4. Integrate field configuration into ELM directory/profile/form only after approval.
5. Run targeted build and UI tests in an environment with dependencies installed.

## Safe validation checklist
- Super Admin: select company A, delegate Company Admin, set a nonprotected ELM field; switch to B and verify independent values.
- Company Admin: can edit only when delegated, for login company.
- HR Admin: can edit only when delegated, for login company.
- Protected identity fields: switches locked; no deletion of employee records.
- Attendance / Payroll / PMS selection: explicit not-yet-configured placeholder.
