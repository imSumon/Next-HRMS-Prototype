# All-panel UAT ledger — Phase 1

Use **Not tested / Pass / Fail / Blocked** per case. User-confirmed lifecycle submit/approve/history are **partial passes only**.

| Case | Panel | Route / scenario | Expected | Status |
|---|---|---|---|---|
| SA-01 | Super Admin | Company enrollment / company directory | Create isolated company draft, activate only after validation | Not tested |
| SA-02 | Super Admin | Field Configuration | Protected field cannot be disabled by delegated admin | Not tested |
| CA-01 | Company Admin | ELM > Lifecycle Actions | Approve HR request, reviewer and timestamp recorded | Partial pass (user) |
| CA-02 | Company Admin | ELM > Lifecycle Actions | Self-approval and cross-company request access denied | Not tested |
| HR-01 | HR Manager | ELM > Employee Directory > Add Employee | Required fields and profile saved | Not tested |
| HR-02 | HR Manager | ELM > Lifecycle Actions | Transfer submitted pending; approval shown in history | Partial pass (user) |
| HR-03 | HR Manager | ELM > Lifecycle Actions | Confirmation, promotion, separation, effective date, rejection | Not tested |
| HR-04 | HR Manager | Shift & Roster | Draft/publish/overnight and weekly off | Not tested |
| HR-05 | HR Manager | Attendance | Raw import, exception, correction, lock and report | Blocked — workflow incomplete |
| HR-06 | HR Manager | Leave | Balance adjustment, approval and history | Not tested |
| HR-07 | HR Manager | Payroll | Calculate, approve, close and payslip | Blocked — calculation missing |
| DM-01 | Department Manager | My Team / Team Attendance | Only assigned team visible; review corrections | Not tested |
| DM-02 | Department Manager | Leave Approvals | Recommend only; no final balance deduction | Not tested |
| EM-01 | Employee | My Profile / Attendance | Own data only, correction request | Not tested |
| EM-02 | Employee | Leave | Submit, track and cancel within policy | Not tested |
| EM-03 | Employee | Monthly Roster | Published entries only | Not tested |

**Execution note:** Test each case with Company A and Company B when isolation matters. Record date, tester, evidence and defect ID before marking Pass.
