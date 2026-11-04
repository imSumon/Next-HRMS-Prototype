# Next-HRMS — ELM Master Field Catalogue & Cursor Handoff v0.9.26

Date: 2026-11-03  
Baseline: React v0.9.25 (preserved).  
Status: **Prototype catalogue implemented; mapping and business rules NOT approved.**

## Scope delivered
- 80 candidate ELM field definitions, grouped into identity, contact, family, organization, employment, compensation, attendance, PF, legacy review and lifecycle additions.
- Preserved all 14 original keys and existing v0.9.25 browser-local company settings (same localStorage key).
- Field matrix has pagination, category filtering, source classification and mapping-status column.
- Protected system fields and delegated company/HR administration behavior preserved.
- No integration into registration, employee profile or directory. No backend or production access control.

## Evidence caveat
Legacy names are **referenced from the previously reviewed PIMS screenshot discussion**, not independently verified against database columns. The approximately 70 legacy checkboxes have not been exhaustively reconciled; the 80 candidates are **not a claim of complete legacy coverage**. Proposed extensions are marked separately. All legacy field definitions and overlaps require mapping review.

## Approved decisions
- PIMS renamed to **Employee Lifecycle Management (ELM)** in new UI; PMS remains Performance Management.
- Super Admin can delegate limited company-scoped field configuration to Company Admin / HR Admin.
- Protected identity and tenant fields cannot be disabled in the demo.

## Outstanding decisions
- Confirm exact legacy field inventory, keys, data types, constraints and mapping to new fields.
- Decide duplicates (Emp Department / Department / Bdepartment, etc.) from actual database evidence.
- Determine role-specific visibility, field sensitivity, required rules, conditional logic and effective dates.
- Review which fields belong to other modules yet are displayed in ELM.

## Cursor handoff
1. Inspect the actual legacy PIMS schema and the field checkbox configuration source; reconcile the candidate list without assuming exact equivalence.
2. Produce a signed-off field mapping with legacy table/column, new field key, data type, ownership, sensitivity, mandatory rules and deprecation status.
3. After approval, implement API-enforced company-scoped RBAC, audit, versioning and form integration.
4. Preserve local changes; do not run Git operations, migrations or broad tests without permission.

## Validation
- ZIP integrity checked; source files retained.
- Application build not claimed unless independently executed with dependencies installed.

## Field catalogue (80 entries)

| Key | Display name | Category | Source | Mapping status |
|---|---|---|---|---|
| `employeeCode` | Employee ID / code | Identity | Legacy screenshot reference | Protected baseline; validate schema |
| `name` | Employee full name | Identity | Legacy screenshot reference | Protected baseline; validate schema |
| `companyId` | Company reference | Identity | Legacy screenshot reference | Protected baseline; validate schema |
| `status` | Employment status | Identity | Legacy screenshot reference | Protected baseline; validate schema |
| `legacyEmpId` | Legacy employee ID | Identity | Legacy screenshot reference | Review legacy DB mapping |
| `firstName` | First name | Identity | Legacy screenshot reference | Review legacy DB mapping |
| `middleName` | Middle name | Identity | Legacy screenshot reference | Review legacy DB mapping |
| `lastName` | Last name | Identity | Legacy screenshot reference | Review legacy DB mapping |
| `oldId` | Old employee ID | Identity | Legacy screenshot reference | Review legacy DB mapping |
| `nid` | National ID | Identity | Legacy screenshot reference | Review legacy DB mapping |
| `passport` | Passport number | Identity | Legacy screenshot reference | Review legacy DB mapping |
| `birthDate` | Date of birth | Identity | Legacy screenshot reference | Review legacy DB mapping |
| `sex` | Gender / sex | Identity | Legacy screenshot reference | Review legacy DB mapping |
| `bloodGroup` | Blood group | Identity | Legacy screenshot reference | Review legacy DB mapping |
| `religion` | Religion | Identity | Legacy screenshot reference | Review legacy DB mapping |
| `maritalStatus` | Marital status | Identity | Legacy screenshot reference | Review legacy DB mapping |
| `email` | Email | Contact | Legacy screenshot reference | Review legacy DB mapping |
| `mobile` | Mobile number | Contact | Legacy screenshot reference | Review legacy DB mapping |
| `presentAddress` | Present address | Contact | Legacy screenshot reference | Review legacy DB mapping |
| `permanentAddress` | Permanent address | Contact | Legacy screenshot reference | Review legacy DB mapping |
| `emergencyPhone` | Emergency contact number | Contact | Legacy screenshot reference | Review legacy DB mapping |
| `fatherName` | Father name | Family & nominee | Legacy screenshot reference | Review legacy DB mapping |
| `motherName` | Mother name | Family & nominee | Legacy screenshot reference | Review legacy DB mapping |
| `grandfatherName` | Grandfather name | Family & nominee | Legacy screenshot reference | Review legacy DB mapping |
| `childrenCount` | Number of children | Family & nominee | Legacy screenshot reference | Review legacy DB mapping |
| `nominee` | Nominee information | Family & nominee | Legacy screenshot reference | Review legacy DB mapping |
| `dept` | Department | Organization | Legacy screenshot reference | Review legacy DB mapping |
| `branch` | Branch / workplace | Organization | Legacy screenshot reference | Review legacy DB mapping |
| `unit` | Unit | Organization | Legacy screenshot reference | Review legacy DB mapping |
| `floor` | Floor | Organization | Legacy screenshot reference | Review legacy DB mapping |
| `section` | Section | Organization | Legacy screenshot reference | Review legacy DB mapping |
| `subSection` | Subsection | Organization | Legacy screenshot reference | Review legacy DB mapping |
| `line` | Production line | Organization | Legacy screenshot reference | Review legacy DB mapping |
| `costCenter` | Cost center | Organization | Legacy screenshot reference | Review legacy DB mapping |
| `jobLocation` | Job location | Organization | Legacy screenshot reference | Review legacy DB mapping |
| `team` | Team | Organization | Legacy screenshot reference | Review legacy DB mapping |
| `manager` | Reporting manager / boss | Organization | Legacy screenshot reference | Review legacy DB mapping |
| `managementLevel` | Management level | Organization | Legacy screenshot reference | Review legacy DB mapping |
| `businessDept` | Bdepartment (legacy) | Organization | Legacy screenshot reference | Review legacy DB mapping |
| `businessDesignation` | Bdesignation (legacy) | Organization | Legacy screenshot reference | Review legacy DB mapping |
| `businessUnit` | Bname / business unit (legacy) | Organization | Legacy screenshot reference | Review legacy DB mapping |
| `title` | Designation / job title | Employment | Legacy screenshot reference | Review legacy DB mapping |
| `joiningDate` | Joining date | Employment | Legacy screenshot reference | Review legacy DB mapping |
| `employeeType` | Employee type | Employment | Legacy screenshot reference | Review legacy DB mapping |
| `grade` | Grade | Employment | Legacy screenshot reference | Review legacy DB mapping |
| `band` | Band | Employment | Legacy screenshot reference | Review legacy DB mapping |
| `confirmationDate` | Confirmation date | Employment | Legacy screenshot reference | Review legacy DB mapping |
| `probationPeriod` | Probation period | Employment | Legacy screenshot reference | Review legacy DB mapping |
| `experienceYears` | Years of experience | Employment | Legacy screenshot reference | Review legacy DB mapping |
| `discontinueDate` | Discontinue date | Employment | Legacy screenshot reference | Review legacy DB mapping |
| `discontinueType` | Discontinue type | Employment | Legacy screenshot reference | Review legacy DB mapping |
| `discontinueDescription` | Discontinue description | Employment | Legacy screenshot reference | Review legacy DB mapping |
| `employmentEffectiveFrom` | Employment effective-from date | Employment | Legacy screenshot reference | Review legacy DB mapping |
| `basicSalary` | Basic salary | Compensation & bank | Legacy screenshot reference | Review legacy DB mapping |
| `grossSalary` | Gross salary | Compensation & bank | Legacy screenshot reference | Review legacy DB mapping |
| `salaryGroup` | Salary group | Compensation & bank | Legacy screenshot reference | Review legacy DB mapping |
| `bankAccount` | Bank account | Compensation & bank | Legacy screenshot reference | Review legacy DB mapping |
| `bankBranch` | Bank branch | Compensation & bank | Legacy screenshot reference | Review legacy DB mapping |
| `routingNo` | Bank routing number | Compensation & bank | Legacy screenshot reference | Review legacy DB mapping |
| `taxNumber` | Tax identifier | Compensation & bank | Legacy screenshot reference | Review legacy DB mapping |
| `taxLocation` | Tax location | Compensation & bank | Legacy screenshot reference | Review legacy DB mapping |
| `otEligible` | Overtime eligibility | Attendance & schedule | Legacy screenshot reference | Review legacy DB mapping |
| `weeklyHours` | Working hours per week | Attendance & schedule | Legacy screenshot reference | Review legacy DB mapping |
| `weeklyHoliday` | Weekly holiday | Attendance & schedule | Legacy screenshot reference | Review legacy DB mapping |
| `multipleWeeklyHoliday` | Multiple weekly holidays | Attendance & schedule | Legacy screenshot reference | Review legacy DB mapping |
| `shiftId` | Shift ID | Attendance & schedule | Legacy screenshot reference | Review legacy DB mapping |
| `shiftSchedule` | Shift schedule | Attendance & schedule | Legacy screenshot reference | Review legacy DB mapping |
| `pfMemberId` | PF member ID | Provident fund | Legacy screenshot reference | Review legacy DB mapping |
| `pfConfirmationDate` | PF confirmation date | Provident fund | Legacy screenshot reference | Review legacy DB mapping |
| `legacyActive` | Active flag (legacy) | Legacy review | Legacy screenshot reference | Potential overlap; do not merge until legacy schema verified |
| `legacyEmpDepartment` | Emp Department (legacy) | Legacy review | Legacy screenshot reference | Potential overlap; do not merge until legacy schema verified |
| `legacyEmpDesignation` | Emp Designation (legacy) | Legacy review | Legacy screenshot reference | Potential overlap; do not merge until legacy schema verified |
| `legacyEmpUnit` | Emp Unit (legacy) | Legacy review | Legacy screenshot reference | Potential overlap; do not merge until legacy schema verified |
| `legacyCompanyBranch` | Company Branch (legacy) | Legacy review | Legacy screenshot reference | Potential overlap; do not merge until legacy schema verified |
| `transferEffectiveDate` | Transfer effective date | Lifecycle additions | Proposed extension | Not verified in legacy screenshot; approval required |
| `promotionEffectiveDate` | Promotion effective date | Lifecycle additions | Proposed extension | Not verified in legacy screenshot; approval required |
| `separationReason` | Separation reason | Lifecycle additions | Proposed extension | Not verified in legacy screenshot; approval required |
| `rehireDate` | Rehire date | Lifecycle additions | Proposed extension | Not verified in legacy screenshot; approval required |
| `employmentHistory` | Employment history reference | Lifecycle additions | Proposed extension | Not verified in legacy screenshot; approval required |
| `documentExpiry` | Document expiry date | Lifecycle additions | Proposed extension | Not verified in legacy screenshot; approval required |
