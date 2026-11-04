# Phase 1B — Roster approval controls (v0.9.38)

## Implemented in prototype
- Reject bulk approval if Level 1 and Level 2 requests are selected together.
- Prevent requester self-approval (email-based for new submissions, persona fallback for legacy demo rows).
- Require distinct Level 1 and Level 2 reviewer accounts for new two-stage requests.
- Prevent direct roster publishing when company policy requires approval.
- Validate roster date input before saving.

## UAT — role-specific
1. HR Manager → Shift & Roster: create a Draft and submit for approval. Verify Pending Approval.
2. Same account → Approve: blocked for self-approval.
3. Authorized Company Admin (when configured as approver) → Approve: Published (one-level) or Pending Level 2 (two-level).
4. Two-level: same first reviewer attempts Level 2: blocked; distinct authorized reviewer approves: Published.
5. Approval-required company → attempt direct publishing: blocked.
6. Employee → My Monthly Roster: Draft/Pending hidden, Published visible.
7. Different company → no access to the company's roster entries.

## Still open
- Full Shift/Roster regression and negative UAT across five roles.
- Backend persistence and authorization (Cursor).
- Complete Attendance ingestion, processing, correction and locking; not implemented by this release.

**Status:** Targeted source changes; no claim of full Phase 1B completion.
