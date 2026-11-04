# Implementation Plan

## Objective
Visualize the universal multi-company HRMS in an isolated navigable frontend with synthetic JSON data. Existing source code and databases remain untouched.

## Personas
1. Platform Superadmin: tenant lifecycle, module catalogue, policy templates and platform audit concepts.
2. Company Admin: company-scoped configuration and explicitly assigned capabilities.
3. HR Manager: employee operations and assigned HR workflows.
4. Department Manager: team-scoped review/approval concepts.
5. Employee: self-service concepts.

## Enrollment flow
1. Company identity, code, industry and localization.
2. Organization structure: branches, departments, designations and reporting.
3. Module selection and dependency review.
4. Policy template selection and company-specific configuration.
5. Initial administrator and approved access approach.
6. Readiness validation.
7. Demo activation only.

## Stages
- 0: protect boundaries and read existing master plan/architecture docs only.
- 1: standalone shell, navigation and synthetic-data loader.
- 2: Superadmin, company directory and enrollment wizard.
- 3: company Admin, users and illustrative permission studio.
- 4: employee/organization, manager and self-service experiences.
- 5: attendance events, identity mapping and exception workflows.
- 6: leave approvals, payroll readiness and reporting concepts.
- 7: align screens against confirmed capabilities, roadmap and open decisions.
- 8: targeted manual verification, screenshots and implementation backlog.

## Acceptance
- Runs separately without npm install.
- Main navigation works.
- Enrollment validates company name/code and creates only an in-memory draft.
- Synthetic lists and demo actions are interactive.
- No source code or database in existing `next-hrms` is modified.
- Unknown rules are marked unresolved rather than invented.

## Cost controls
Work in one small stage at a time, inspect named files only, do one targeted verification, avoid broad repeated scans.
