# v0.9.11 — Viyellatex employee register test dataset

## Source and mapping
- Source workbook: `GDL_FW_Salary_Register_September'26.xlsx`
- Source title: Salary Register for September 2026
- Source branch in workbook: `GDL- 3000`
- Valid employee records imported: 475
- Unique employee IDs: 475
- Prototype tenant assignment: `co-vtl` (Viyellatex), as explicitly requested for testing.
- The workbook itself identifies GDL, not Viyellatex. The VTL tenant assignment is a test mapping and must not be treated as verified employment/company affiliation. Source branch is retained in each record.

## Imported fields
Employee ID, name, designation, department, date of joining, gender, source branch, unit, staff category, floor, line information, grade and cost center.

## Excluded fields
Bank account, gross/basic salary, allowances, overtime payments, bonuses, deductions, net pay, payment rates and other payroll amounts were not imported. This is an employee-directory test dataset, not payroll data.

## Employee self-service mapping
The first register employee (`061357`) is linked to the existing Employee demo persona using the unchanged alias `employee@vtl-demo.test`. The alias is synthetic and is not an employee email from the workbook. Other imported employees have no login email mapped.

## Other prototype data
- Existing Pro-Edge masked legacy sample records are retained.
- Attendance punches, leave requests, leave balances, shifts, assignments and rosters remain empty.
- Data is browser-local prototype data; no API/database persistence is provided.
- The localStorage namespace was bumped to v0.9.11 so v0.9.10 cached data does not mask this dataset. Reset test data restores the bundled dataset.

## Login protection
No login page, credential validation, login JavaScript, demo credentials or role/company login mapping was changed.
