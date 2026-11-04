# v0.9.10 — Company Context and Legacy Sample Employee Data

## Changes
- Kept the already-tested legacy login page and login handoff unchanged.
- Populated the React tenant directory from the supplied v0.8.9 `data/demo-data.json` company records. The IDs (`co-vtl`, `co-proedge`, etc.) are preserved so fixed-company demo roles resolve to a React company record.
- Populated the React employee directory with the four masked employee master examples from the same legacy demo dataset, mapping `Pro-Edge` to `co-proedge` and `Viyellatex` to `co-vtl`.
- Linked `employee@vtl-demo.test` to `LEG-VTL-EMP-001` so the already-existing Employee demo persona can resolve its own employee record. No login validation, credentials, role configuration, or login UI code was changed.
- Added the resolved company name/code to the React top bar and a visible data-quality notice in Employee Directory.
- Changed the React prototype storage namespace to v0.9.10 so a previous v0.9.9 empty localStorage snapshot does not override the newly loaded sample company/employee data.

## Source limitations
The four employee examples in `data/demo-data.json` are explicitly masked/historical reference records. Their department field says it must be verified from source, and no attendance history was copied. They are not verified current employees or a complete employee master. The separate `vtl-demo-employees.json` in v0.8.9 explicitly identifies its 16 VTL-style rows as synthetic fixtures, so those rows were not represented as real legacy employee records.

## Kept empty
Punches, leave requests, leave balances, policies and audit events remain empty. The change adds only the requested company and employee reference records. Shift definitions, assignments and rosters remain clean and empty.

## Verification limits
TSX syntax transpilation, legacy app.js syntax, and ZIP integrity are checked. Full npm build and browser role-workflow testing require project dependencies and a browser environment and are not claimed here.
