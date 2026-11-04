# v0.9.46 Phase 1B — Roster attendance and independent corrections

## Implemented in browser prototype
- Published roster is required for daily processing; unpublished or missing roster is an unresolved exception.
- Weekly Off comes from published roster; shift start/end and grace minutes use published snapshot. Overnight shifts cross midnight.
- Duplicate and raw punch protection retained.
- HR-assisted manual entry now creates a pending correction request, never a synthetic raw device punch.
- Correction approval compares individual login emails rather than only roles, and records reviewer email and time.

## Phase 1 limitations
- Holiday calendar and approved leave are not integrated. No payroll readiness claim.
- No physical device connectivity or server-side scheduler.
- Browser-local state and email-based demonstration checks are not production security.
- Paper evidence attachment, line-manager verification, request tracking/escalation and backend audit remain pending.
- Existing browser-local data may require reloading scenario to exercise new behavior.

## UAT
1. Publish roster for VTL employee for 2026-11-02. Verify processing reads published shift.
2. Verify missing roster is flagged, not treated as Present/Absent automatically.
3. Publish weekly off and verify no punch = Weekly Off.
4. HR-assisted manual entry submits Pending correction, raw punches unchanged.
5. Same login cannot approve. Another authorized account can approve; reviewer is recorded.
6. Verify approved correction affects processing, raw punches unchanged.
