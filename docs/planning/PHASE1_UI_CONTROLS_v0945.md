# v0.9.45 — UI controls and horizontal table navigation

- Attendance correction time and scheduled sync slots use a compact 12-hour selector with hour, minute, AM/PM; values remain stored as 24-hour HH:mm.
- All Ant Design tables with actual horizontal overflow support left-mouse hold-and-drag scrolling; controls, pagination and ordinary clicks remain clickable. Touch retains native scrolling.
- No attendance calculation or approval logic was intentionally changed.
- UAT: select correction time 10:18 PM and confirm request retains 22:18; drag a wide attendance/roster table; click action buttons normally; test touch scrolling.
- Browser UAT is pending.
