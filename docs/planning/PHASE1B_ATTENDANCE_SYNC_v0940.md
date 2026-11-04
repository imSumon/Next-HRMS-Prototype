# Phase 1B — Attendance Sync v0.9.40

## Implemented in prototype
- Icon navigation and sync activity animation.
- Editable time slots and on/off control. Slots are checked while Attendance Operations is open.
- One attempt per slot per Bangladesh calendar day; simulated connected device is selected.
- Sync activity history, last attempt and received count.

## Limitations and backlog
- Browser must remain open; no background service or live device connection.
- A failed scheduled slot requires manual retry.
- Need backend scheduler, per-device credentials/protocol adapters, device heartbeat, queue/retries, per-device sync cursor, idempotency, immutable raw punch storage, alerting, audit and company isolation.
- Existing synthetic punch timestamps are fixed demo dates; no claim of live attendance.
