## v0.9.47 — Shift assignment and roster publication (Phase 1B)

**HR Manager → Shift Management → 02 Employee Shift Assignment**: Select VTL employee(s), active shift and effective dates. Save. Expect confirmation and cleared selection. Repeat the same date range: expect overlap error, not duplicate creation. Invalid effective-to before effective-from must be blocked.

**HR Manager → Shift Management → 03 Date-specific Roster Management**: Create Draft for a specific employee/date. If company policy permits direct publication, publish Draft. Otherwise submit for approval and use authorized separate approver. A saved default shift assignment alone must NOT be treated as a Published roster.

**HR Manager → Attendance → Process & finalize**: Select the same date. Confirm only Published roster is used, and a missing Published roster remains flagged. Original raw punches remain unchanged.

**Company Admin**: Verify approval/publish authority only within company. **Department Manager / Employee**: No unauthorized publication; Employee My Roster displays Published only.

**Note:** Prototype UAT only; backend authorization, persistence and browser test still pending.

---

## v0.9.35 — Attendance lifecycle impact review

| Test | Role and route | Action | Expected result |
|---|---|---|---|
| UAT-935-01 | HR Manager → ELM → Lifecycle Actions | Submit future-dated Transfer | Pending; no effective attendance mapping change |
| UAT-935-02 | Company Admin → ELM → Lifecycle Actions | Approve Transfer | Approved — Scheduled until effective date |
| UAT-935-03 | HR Manager → Attendance | Review ELM → Attendance effective-date review | Shows previous/proposed site and effective-date status |
| UAT-935-04 | HR Manager → Attendance | Review Separation request | Flags post-separation punch review only after approval and effective date |
| UAT-935-05 | Company Admin → Attendance | Verify other company's requests | No cross-company lifecycle requests displayed |

**Prototype limit:** Review-only. No raw punches, device mappings or attendance records are changed.

---

# Next-HRMS — User-wise UAT Menu Routes & Training Guide

## v0.9.30 — ELM Enrollment and Bulk Operations

**Role:** HR Manager or Company Admin, assigned to the target company. **Route:** ELM — Employee Lifecycle (Employee Directory).

| Test | Menu route | User action | Expected result | Test status |
|---|---|---|---|---|
| UAT-930-01 | ELM → Add Employee | Open Employee Enrollment; navigate Identity, Personal & contact, Employment & organization, Compensation & statutory, Attendance & work schedule, Family & emergency, Other & lifecycle tabs | Fields grouped by section; company-enabled fields displayed | Not browser-tested |
| UAT-930-02 | Super Admin → Field Configuration → Company → ELM → Employee Registration; then HR → ELM → Add Employee | Set Blood Group Enabled + Visible + Required | Blood Group shown under a relevant section and required when saving | Not browser-tested |
| UAT-930-03 | ELM → Import CSV / XLSX | Download template; fill employee IDs and names; select file | Preview with per-row errors; nothing imported automatically | Not browser-tested |
| UAT-930-04 | ELM → Import CSV / XLSX | Upload duplicate Employee ID or blank mandatory field | Import confirmation disabled until errors corrected in source file and reuploaded | Not browser-tested |
| UAT-930-05 | ELM → Import CSV / XLSX | Upload valid data and confirm | Employees added only to logged-in company; directory count increases | Not browser-tested |
| UAT-930-06 | ELM → Bulk Photos | Select EMP-0001.jpg with matching employee ID | Ready status after type/size/dimension checks and resize | Not browser-tested |
| UAT-930-07 | ELM → Bulk Photos | Select unknown ID, oversized file or invalid type | Rejected with reason; no photo saved for rejected row | Not browser-tested |
| UAT-930-08 | ELM → Bulk Photos | Confirm matched photos | Saved in browser-local photo store for the company | Not browser-tested |

**Limitations:** CSV/XLSX mapping currently uses exact ELM field keys or selected common header aliases. Uploaded photos are stored in browser-local storage and may hit quota. This is not production bulk upload, image delivery or antivirus scanning. Actual browser UAT is pending.

---

# Next-HRMS — User-wise UAT Menu Routes & Training Guide

**Baseline:** React prototype v0.9.29  
**Audience:** Super Admin, Company Admin, HR Manager, Employee; future trainers and UAT reviewers  
**Document type:** User-facing navigation, acceptance checks, and future training reference — **not a Cursor/developer handoff**  
**Status:** Manual UAT guide; outcomes not yet verified in browser.

## How to use this guide

Log in using an authorized demo account for the role shown. Follow the **current prototype menu label**; record Pass / Fail / Not Tested and screenshots for any discrepancy. Browser-local demo settings are not proof of production authorization. Company A and Company B are examples; use actual available demo companies.

## v0.9.29 — ELM field configuration UAT

| ID | Login role | Menu / screen route | Action | Expected outcome | UAT status |
|---|---|---|---|---|---|
| ELM-01 | Super Admin | **Field Configuration** → Company A → ELM → Employee Registration | Set Blood Group Enabled + Visible + Required; save | Settings persist for Company A registration | Not tested |
| ELM-02 | Company Admin / HR Manager (Company A) | **ELM — Employee Lifecycle** → **Add Employee** | Leave Blood Group empty, then provide value | Required validation blocks blank save; valid form may save | Not tested |
| ELM-03 | Super Admin or authorized delegated Company Admin / HR Manager | **Field Configuration** → Company A → ELM → Employee Registration | Disable or hide an optional field such as Email | Field disappears from registration, existing employee data retained | Not tested |
| ELM-04 | Authorized configuration user; then Company Admin / HR Manager | **Field Configuration** → Company A → ELM → Employee Directory; then **ELM — Employee Lifecycle** | Hide Email column; view list | Email column not shown in Company A directory | Not tested |
| ELM-05 | Company Admin / HR Manager (Company A) | **ELM — Employee Lifecycle** → **Export Excel** | Export directory after ELM-04 | Demo export omits hidden Email column | Not tested |
| ELM-06 | Authorized configuration user; then Employee (Company A) | **Field Configuration** → ELM → Employee Profile; then employee **My Profile** | Hide Email; sign in as linked employee | Email detail not displayed in My Profile | Not tested |
| ELM-07 | Super Admin | **Field Configuration** → Company A, then Company B | Set different field visibility for each | Company B settings do not inherit Company A changes | Not tested |
| ELM-08 | Super Admin / authorized delegated administrator | **Field Configuration** → ELM → Employee Registration | Attempt to disable protected Employee ID | System refuses to disable protected field | Not tested |
| ELM-09 | Super Admin | **Field Configuration** | Save settings, refresh page, revisit same company/screen | Browser-local configuration persists | Not tested |
| ELM-10 | Super Admin; Company Admin; HR Manager; Employee | Login → assigned role sidebar | Check login-first and role-specific menus; visit existing Shift & Roster and Leave screens as permitted | No navigation regression | Not tested |

## Important current navigation note

In **v0.9.29**, **Field Configuration** is a *direct sidebar menu item* even though its page heading is under Company Setup. The approved future information architecture is **Company Setup → Field Configuration**. Do not instruct trainees to look for a nested submenu until the navigation is changed and verified.

## Role and scope notes

- **Super Admin:** central company selection and field configuration governance.
- **Company Admin / HR Manager:** employee registration and directory for their authorized company. Configuration editing depends on Super Admin delegation; do not assume all HR users have it.
- **Employee:** **My Profile** for the employee record linked to their login; profile is read-only in this prototype.
- Actual demo login credentials and account-to-company mapping must be supplied from the approved demo dataset; do not publish credentials in this guide.

## Known limitations / not a UAT pass

- Supported fields are integrated incrementally; not all 80 catalogue entries are fully wired to production-quality controls.
- Browser-local persistence, not server/API authorization; no production audit or migration is demonstrated.
- No browser UAT or React build pass is claimed by this guide.
- Field export behavior is a demo feature, not a replacement for permission-based data export security.

## Trainer's result record

| Date | Tester / role | Company | Test ID | Pass / Fail / Not Tested | Issue / screenshot reference |
|---|---|---|---|---|---|
| | | | | | |

## Maintenance rule for future releases

Keep this guide under **`docs/userguide/`**, separate from developer/Cursor handoff notes. When a new feature or menu route is added, update the relevant role-based route, action, expected outcome, and actual verification status. Maintain the guide cumulatively for final user training; never mark a check as passed without executing it.


## v0.9.31 — Bulk Profile Photo Upload (HR Manager / Company Admin)
1. Open **ELM → Bulk Photos** (from Employee Directory).
2. Click **Choose Photos** and select JPEG/PNG/WebP files named as Employee IDs, e.g. `EMP-0001.jpg`.
3. Wait for **Validate & Match**, then review the table: image preview, filename, employee ID and validation status.
4. Correct rejected files and select a new batch if necessary.
5. Click **Confirm & Save N Photos**; return to **Employee Directory** to verify photos.
6. Test unmatched ID, oversize image, undersized image, wrong format, and company-specific employee matching.
**UAT status:** Pending manual browser verification. Browser-local demo only.


## v0.9.32 — ELM Lifecycle Actions (user-facing UAT)

**HR Manager / Company Admin:** Log in to the target company → **ELM — Employee Lifecycle** → **Lifecycle Actions** (above the directory), or select **Manage** beside an employee.

| Test | User | Route / action | Expected result | Status |
|---|---|---|---|---|
| ELM-LC-01 | HR Manager | ELM → Employee Directory → Manage → Confirmation → effective date → Submit for Approval | Request appears as Pending Approval; employee record unchanged | Not browser-tested |
| ELM-LC-02 | Company Admin | ELM → Lifecycle Actions → Requests & approval → Approve | Approved current-dated request applies; request history retained | Not browser-tested |
| ELM-LC-03 | HR Manager | ELM → Lifecycle Actions → Transfer → branch/department/unit → Submit | Request records proposed changes and original values | Not browser-tested |
| ELM-LC-04 | Company Admin | ELM → Lifecycle Actions → Promotion → Approve | Designation/grade updated when effective; original values in history | Not browser-tested |
| ELM-LC-05 | HR Manager / Company Admin | ELM → Lifecycle Actions → Separation with reason → Approve | Employee becomes Inactive on effective date | Not browser-tested |
| ELM-LC-06 | Company Admin | ELM → Lifecycle Actions → Reject pending request | No employee field changed; rejected request remains in history | Not browser-tested |
| ELM-LC-07 | Company Admin | Approve a future-dated transfer | Status is Approved — Scheduled; change only applies when effective date arrives and prototype is opened | Not browser-tested |
| ELM-LC-08 | HR Manager | Switch to another company account | Cannot view or submit requests for another company | Not browser-tested |

**Current demo limitations:** The prototype uses a simplified HR submission → Company Admin review. It does **not** implement the approved unlimited-stage configurable approval engine, delegation, HR publishing control, company-to-company transfer, payroll/attendance/leave/roster recalculation, or backend authorization. It stores requests in the local browser only. Avoid using real employee data.


## v0.9.33 — Lifecycle approval control UAT
1. **HR Manager → ELM → Employee Directory → Lifecycle Actions**: submit a transfer with a valid effective date. Expect Pending Approval; original employee assignment remains unchanged.
2. **HR Manager → Lifecycle Actions**: submit another action for the same employee while pending. Expect conflict prevention.
3. **Company Admin (same company) → ELM → Lifecycle Actions → Requests & approval**: approve or reject the request; enter optional decision remarks. Expect status and reviewer recorded.
4. **Company Admin**: try approving a request submitted by the same login. Expect self-approval blocked.
5. **HR Manager / Company Admin → ELM → Lifecycle Actions → Employee lifecycle history**: inspect requester, timestamp, reviewer, decision remarks and audit events.
6. **HR Manager → Lifecycle Actions**: enter invalid date or date earlier than joining date (where recorded). Expect validation.
7. **Different company login**: requests for other companies must not appear.

Note: All controls are browser-local prototype demonstrations, not production security guarantees. Future multi-stage approval and resignation workflow are deferred.


## v0.9.34 — Cross-module impact review (read-only)
1. HR Manager login → ELM → Employee Directory → Lifecycle Actions. Submit a Transfer request for a company employee; verify it appears as Pending Approval.
2. On the same page, open Cross-module impact review → View checks. Expect four rows: Attendance, Leave, Shift / Roster, Payroll. State: Awaiting approval.
3. Company Admin login (same company) → ELM → Lifecycle Actions → Requests & approval → Approve. Open View checks; expect Scheduled review for future effective date, or Review required for already-applied request.
4. Reject a different pending request; impact checklist should show Not applicable.
5. Verify no Attendance, Leave, Shift/Roster or Payroll data is automatically changed by this checklist. This release is review-only.


## v0.9.37 — Phase 1A UAT (all roles)
1. **Before login:** confirm `Next-HRMS v0.9.37` appears on login page.
2. **Super Admin:** sign in; verify platform menu; company ELM actions must not be available.
3. **Company Admin:** ELM → Employee Directory → Lifecycle Actions; approve a submitted request and check history.
4. **HR Manager:** ELM → Employee Directory → Lifecycle Actions; submit Transfer with a changed department; attempt identical transfer and verify validation.
5. **Department Manager:** sign in; verify team menu and absence of lifecycle creation/approval.
6. **Employee:** sign in; verify ESS menu and absence of lifecycle creation/approval.
7. **ELM negative cases:** confirmed employee cannot be confirmed again; inactive employee cannot be separated again or promoted/transferred.
8. **Regression:** verify approved effective dates and history still work.

Note: this checks the browser prototype; server-side permission testing remains pending.


## v0.9.38 — Shift/Roster approval controls

| Role / route | Action | Expected |
|---|---|---|
| HR Manager → Shift & Roster | Create Draft, submit | Pending Approval |
| Same submitting user → Shift & Roster | Try to approve own request | Blocked |
| Configured approver → Shift & Roster | Approve valid request | Published or Pending Level 2 |
| First approver → Shift & Roster | Try approving Level 2 themselves | Blocked |
| HR Manager → Shift & Roster | Direct publish when approval required | Blocked |
| Employee → My Monthly Roster | View Draft vs Published | Published only |

Record pass/fail manually; browser UAT not executed by package author.

## v0.9.39 — VTL 50-employee attendance scenario lab

- **VTL HR Manager / Company Admin → Attendance → Attendance Operations — VTL scenario lab → Load / reset 50-person scenario**. Verify 50 employees and varied attendance, roster/shift, leave, OT and late examples.
- **VTL HR Manager / Company Admin → Attendance → Device management & sync**. Verify simulated online/offline, add/edit device, same-company sync and raw events. These are not live hardware connections.
- **VTL HR Manager → Attendance → Raw punches & manual**. Enter an authorized manual punch with a reason; import CSV/XLSX from template; verify accepted/rejected count.
- **VTL HR Manager → Attendance → Exceptions & approval**. Request correction. **VTL Company Admin → same route**: approve/reject; verify status and audit.
- **VTL HR Manager / Company Admin → Attendance → Leave, OT & audit**. Inspect illustrative totals and export XLSX.
- **Non-VTL company login → Attendance**. Verify VTL employee sample is unavailable.
- See `docs/modules/attendance/VTL_50_EMPLOYEE_SCENARIO_UAT_v0939.md` for limits and remaining implementation gaps.


## v0.9.40 — Attendance smart tabs and scheduled demo sync
HR Manager / Company Admin → Attendance → Attendance Operations → Devices & sync. Enable automatic sync, review/edit the four Bangladesh-time slots, keep the browser open until a slot is due, observe the animated sync progress and synchronization activity table. For immediate UAT click Sync new on a connected device. Confirm the dashboard banner updates and raw punch ledger gains simulated events. Disable automatic sync to stop future scheduled attempts. This is not a real device connection or backend schedule.


## v0.9.41 — Attendance device registration UAT
HR Manager → Attendance → Devices & sync → Add device. Check LAN requires IP and port, Cloud API does not; invalid MAC and duplicate IP/port are rejected. Edit a saved device. Expand Prototype information to view limitations. The device is a browser simulation, not a hardware connection.


### v0.9.42 — Attendance page visibility
- Company Admin / HR Manager → Attendance: attendance workspace should display for the selected company.
- Proedge company: no VTL records or devices should be visible; register a company device or load company employees.
- VTL company: use Load / reset company scenario to see the 50-person sample.
- Confirm version v0.9.42 on login and workspace.


## v0.9.43 — Daily attendance processing (prototype UAT)

- HR Manager → Attendance → Process & finalize: select 2026-11-02, review IN/OUT, Late, Early Exit, Missing Punch, duplicate counts and export XLSX.
- HR Manager → Attendance → Raw punches: confirm original device punches remain visible after processing.
- HR Manager → Attendance → Corrections: submit missing-punch correction; Company Admin reviews where permitted. Return to Process & finalize and inspect result.
- Company Admin → Attendance → Process & finalize: finalization is blocked while unresolved absences/missing punches remain; test a clean company/day for lock and reopen.
- Department Manager / Employee: verify they cannot finalize/reopen.
- **Not yet passed:** actual roster/leave/weekly-off/OT integration, server-side lock, device connection and real employee identity approval.


## v0.9.44 Attendance review UAT
1. HR Manager → Attendance → Process & finalize → 2026-11-02 → SHAFIQUL (063701) → View punches / resolve. Confirm raw IN and missing OUT.
2. Enter proposed missing OUT time and reason; Submit correction for approval. Confirm status Pending in Corrections.
3. Authorized different reviewer approves; return to processing and verify recalculation. Original punch ledger unchanged.
4. For truly absent employees, use Confirm absent after review with a documented reason. Missing punch and device exception must not be cleared as absence.
5. Finalize is blocked while any unresolved exception or pending correction exists; reopen is only enabled after finalization.


## v0.9.46 — Published roster attendance and corrections
- HR Manager → Monthly Shift & Roster: publish employee roster for test date.
- HR Manager → Attendance → Process & finalize: verify published shift, weekly off and missing roster.
- HR Officer workflow (demonstrated using authorized HR Manager account) → Attendance → Raw punches → HR-assisted exceptional correction: submit reason; verify Pending and unchanged raw ledger.
- Company Admin (different login) → Attendance → Corrections: approve or reject and verify reviewer identity.
- Employee / Department Manager direct correction entry and paper intake tracking are not implemented in this release.


### v0.9.48 — Shift assignment confirmation regression UAT
1. VTL HR Manager → Shift & Roster → Employee Shift Assignment → Bulk employee assignment. Select an employee, shift and valid dates; Save. Expect persistent **Shift assignment result: 1 assignment saved, 0 skipped**, and selection cleared. Verify assignment in register.
2. Repeat same employee and overlapping dates. Expect **0 saved, 1 skipped**, duplicate/overlap explanation, and selection retained for correction.
3. Try invalid effective-date range. Expect visible validation error, no new record.
4. Create and publish a date-specific roster separately; verify Attendance uses the published roster.


## v0.9.49 — Version display smoke test
1. Start the React app and confirm the login screen reads Next-HRMS v0.9.49.
2. Login as VTL HR Manager and confirm the top bar and footer both read v0.9.49.
3. Verify existing Shift Assignment feedback remains accessible; this release does not change assignment logic.
