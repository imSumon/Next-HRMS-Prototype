# ELM v0.9.30 — Development Notes (for Cursor / future implementation)

## Implemented prototype
- Employee Enrollment page with section tabs; all 80 candidate ELM catalogue entries are eligible for rendering according to company field configuration. Fields use simple inputs with basic date/select handling; domain-specific validators and controlled reference lists remain future work.
- CSV/XLSX import: template, parsing, company-scoped duplicate check, required fields, preview and explicit commit. 2,000-row / 5-MB limit. The browser demo does not support transactional backend processing or rollback.
- Photo import: multiple image files named by employee ID; matching within logged-in company, JPEG/PNG/WebP, <=3MB, >=120px each dimension, resized to 300x300 JPEG, saved in browser localStorage. 100-file limit. No ZIP folder upload.

## Not implemented / safety boundaries
- Real server-side permission checks, storage, virus scanning, encryption, durable jobs, background processing, full schema validation, photo thumbnails in every employee view beyond the Directory, import rollback, CSV formula neutralization on export, duplicate detection by NID/punch identity, and production audit trails.
- Field catalogue is candidate data; mapping and HR policy still need approval. Protected fields are not sufficient backend authorization.
- Existing employee records are preserved. No migrations or Git operations.

## Next milestones
- Add backend import staging, dry-run and idempotent job-based commit with row-level reconciliation; photo object storage and thumbnail rendering.
- Extend data types, field dependencies and conditional validations before production.
- Browser UAT is not performed in this environment.
