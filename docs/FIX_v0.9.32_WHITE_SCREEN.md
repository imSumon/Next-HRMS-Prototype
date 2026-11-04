# v0.9.32 White-screen hotfix

- Moved lifecycle auto-apply useEffect above the unauthenticated early return, so React hooks execute in the same order before and after login.
- Removed stale setEmployeeModalOpen call from employee creation.
- Browser UAT and dependency-based build not executed.
- Verify login-first, role navigation, Employee Registration, and lifecycle request screens.
