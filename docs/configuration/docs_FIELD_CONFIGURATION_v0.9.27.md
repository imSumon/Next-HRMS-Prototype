# Next-HRMS v0.9.27 — Field Configuration / Cursor Handoff

## Approved decisions
- Company Setup → Field Configuration is shared navigation for multiple modules, not an Employee Registration-only menu.
- Selection: Company → Module → Screen.
- ELM screens: Employee Registration, Employee Profile, Employee Directory.
- Recruitment → Candidate Registration; Leave → Leave Application; Payroll → Employee Payroll Information.
- Main matrix: Field, Category, Enabled, Visible, Required, Editable.
- **Do not display Source or Mapping Status in this feature**. Technical protection is enforced without a visible column. Exportable is not a main-screen control.
- Super Admin delegates limited field configuration to Company Admin / HR Admin, company scoped.

## Implemented in this browser prototype
- Company, Module, Screen selector.
- ELM 80-field candidate catalogue reused across three screen views.
- Per-screen localStorage keys: Registration retains historical plain field keys; other screens use `Screen::fieldKey`, falling back to existing company settings.
- Protected fields remain non-editable in the UI; existing company-scoped delegated toggles remain.
- Other modules show explicitly empty catalogue placeholders.

## Not implemented / do not infer
- Field switches do not yet modify live registration, profile or directory forms.
- No production API/RBAC/audit/security enforcement or module catalogues outside ELM.
- Legacy field names and business rules are not verified against DB schema.
- No migrations, Git operations, or external data changes.

## Next smallest task for Cursor
1. Inspect only `src/App.tsx` field configuration and ELM forms.
2. Agree on field-to-form mapping and role-sensitive permissions before wiring switches to forms.
3. Add targeted UI tests only for the changed functionality.
