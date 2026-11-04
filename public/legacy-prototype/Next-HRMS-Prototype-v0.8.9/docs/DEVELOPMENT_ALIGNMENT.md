# Development Alignment Matrix — initial

| Area | Prototype | Compare against existing confirmed plan | Open decisions |
|---|---|---|---|
| Multi-company Superadmin | Tenant dashboard/directory | Shared DB + tenant_id, company context and tenant boundaries | Tenant lifecycle, platform/company authority |
| Enrollment | Five-step wizard | Existing company/organization model | Validation, activation, unique company codes |
| Modules | Synthetic module catalogue | Current module roadmap | Entitlements, dependencies, plans |
| Policies | Template catalogue | Policy/configuration architecture | Defaults, overrides, versions, effective dates, approval |
| RBAC | Illustrative roles and permission grid | Existing per-membership capabilities such as employee-management and punch-writer grants | Approved permission catalogue, scope, delegation and audit |
| Employees | Synthetic directory/add modal | Employee registry and employment episode flow | Creation grant, lifecycle and organization scope |
| Attendance | Synthetic events and exception flow | Existing attendance APIs, identities, processing and period routes | Policy/shift/roster setup, timezone, durable import exceptions, leave integration |
| Leave | Synthetic requests/review | Existing leave types/positions and roadmap | Balance rules, approval chain, attendance/payroll impact |
| Payroll | Readiness checklist only | Payroll intake/handoff roadmap | Salary components, statutory rules and calculation |
| Audit | Synthetic activity list | Existing audit trail | Coverage, immutability, retention, access |
| Migration | Not implemented | Master plan's no-data-loss and reconciliation requirements | Mapping, validation, cutover, rollback |

Prototype screens are visual demonstrations, not evidence of backend implementation. Validate against the authoritative master plan. Do not treat illustrative roles/policies as approved.
