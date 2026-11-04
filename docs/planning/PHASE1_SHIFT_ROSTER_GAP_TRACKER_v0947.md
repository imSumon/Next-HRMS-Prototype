# v0.9.47 Phase 1 Shift/Roster Gap Tracker

## Implemented in browser prototype
- Duplicate/overlap prevention for active effective-dated assignments; date order validation.
- Single and bulk save feedback and reset after successful save.
- Published roster remains the Attendance source; a default shift assignment is not automatically published.
- Direct roster publication limited to authorized HR/Company roles when company policy does not require approval.
- Existing approval policy and employee Published-only visibility retained.

## Outstanding and not claimed complete
- Real backend RBAC, company isolation, persistent approval transactions and audit records.
- Batch partial-success review UI and downloadable conflict file.
- Full roster conflict checks against employee lifecycle changes, holidays and leave.
- End-to-end browser UAT and React production build (not verified in this patch).
- Real shift assignment publication model: currently assignment is saved separately from date-specific roster; do not treat assignment as published.

## Next UAT
1. Bulk-select VTL employee; save valid assignment; expect success, cleared selection.
2. Reassign overlapping date range; expect error and no duplicate.
3. Reverse dates; expect error.
4. Create date-specific Draft roster, publish if approval not required, or submit/approve per policy.
5. Check Attendance Processing reads Published roster and not Draft/default-only assignment.
6. Check Company Admin, HR Manager, Department Manager, Employee access boundaries.


### v0.9.48 UAT finding
User reported no visible confirmation after shift assignment in v0.9.47. Added persistent result banner for bulk assignment and retained selection on failed/duplicate saves. Browser UAT still required; do not mark closed until user confirms.
