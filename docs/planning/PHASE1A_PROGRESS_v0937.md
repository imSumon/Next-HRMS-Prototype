# Phase 1A Progress — v0.9.37

## Completed in this increment
- Release version visible on login and after login.
- Frontend page allowlist for five roles and a restricted-page fallback.
- ELM safeguards: prevent duplicate confirmation, repeat separation, inactive transfer/promotion, and no-op transfer/promotion.

## Existing (requires regression UAT)
- ELM requests, approval, effective dates and history.
- Company-scoped employee directory and lifecycle records.

## Still pending before Phase 1A closure
- End-to-end role and company isolation browser UAT.
- Verify ELM registration/profile/directory and lifecycle edge cases across five panels.
- Correct manager/team-level data scoping where currently only company-scoped.
- Server-side RBAC, tenant isolation, durable persistence and APIs for Cursor implementation.
- Employee import reconciliation (deferred).
- Employee-initiated resignation, withdrawal and settlement (deferred).

## Phase 1 next stages
1B Attendance + Shift/Roster end-to-end; 1C Leave; 1D Payroll; 1E Recruitment + Reports; 1F integration UAT and Cursor handoff.

## Honest release status
Prototype-only. Frontend route guards are usability safeguards, not a security boundary. No backend is connected.
