# Next-HRMS v0.9.39 — VTL 50-employee Attendance Lab

## Data origin and safety

The employee IDs/names are the first 50 Viyellatex (`co-vtl`) employees from the packaged legacy-derived demonstration register. Their identity and company attribution are **not independently verified against a live VTL database**. The attendance events, shift assignments, leave, late minutes, overtime, device state and dates are **synthetic test scenarios**. Never treat these as payroll-ready or real attendance data.

## Role and menu

- HR Manager or Company Admin of VTL: **Attendance → Attendance Operations — VTL scenario lab**.
- Click **Load / reset 50-person scenario**. It replaces only this lab's browser-local simulated punches/corrections and devices, not employee master data or existing legacy punch ledger.
- Other companies must not see the VTL lab.

## Sequence for user-wise UAT

1. **Attendance & scenarios**: inspect 50 employees for Present, Late, Absent, Weekly Off, Annual/Sick/Casual Leave, Overtime, Missing OUT, Duplicate Punch, Cross-device IN/OUT, Device Offline, Early Exit, Night Shift and Unmapped Device. Compare shift, IN/OUT, late minutes and OT hours. These are demonstrative classifications, not a production-grade rules engine.
2. **Device management & sync**: see three simulated devices (two online, one offline). Try sync on disconnected device (blocked), connect it, then sync. Add a new device and edit its site. Each online sync creates an incremental synthetic event; duplicate baseline IDs are not re-imported.
3. **Raw punches & manual**: inspect source, timestamp, punch ID and device ID. Enter a manual punch with reason. Download import template; upload CSV/XLSX columns `employeeId,time,deviceId,punchId`; unknown employees, invalid timestamps and duplicate IDs are rejected (count shown). Source events are append-only in this lab.
4. **Exceptions & approval**: submit a missing-punch correction as HR; sign in as Company Admin to approve or reject. Check audit entries. Approval here is role-based only and must be replaced with individual identity authorization in backend.
5. **Leave, OT & audit**: inspect scenario counts, illustrative late and overtime totals; export XLSX attendance. Leave here is a scenario label, not a Leave module application or balance transaction.
6. **Refresh**: browser-local state should persist for this company. Reset lab data explicitly when repeating UAT.

## Actual integration — NOT implemented

No real hardware network connection, biometric device SDK/API, live heartbeat, cloud device agent, offline queue replay, company-wide device identity provisioning, verified punch matching, shift policy calculation, leave balance posting, OT authorization or payroll posting exists in this version. All 'connected/disconnected', 'sync' and device records are browser simulations. A backend service and real devices are required for genuine integration.

## Phase 1 attendance completion criteria (pending)

- Backend device registry with company/site mapping, connection heartbeat, credentials handled server-side, audit and vendor adapter interfaces.
- Idempotent raw punch intake, event timestamp/timezone validation, unknown-card reconciliation, offline recovery and CSV/XLSX/manual source validation.
- Configurable shift-based daily processing including cross-midnight, duplicate, missing, late, early, leave, weekly off and OT approval.
- Employee/manager/HR correction workflow with evidence, authorized approvals, locking and reprocessing controls.
- Finalized daily/monthly attendance reports and approved payroll export with historical preservation.

## Roadmap

Advanced real-time telemetry, device push integrations, automated mapping reconciliation and payroll posting remain separate milestones. Do not mark this lab as a completed physical-device integration.
