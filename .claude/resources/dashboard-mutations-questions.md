# Questions for stakeholders: exportDashboard, importDashboard, duplicateDashboard

These three mutations are already present in the `docs.json` nav but have no documentation pages yet. Before writing these pages, get answers to the questions below to ensure accuracy.

---

## exportDashboard

1. What does the mutation return — a file blob, a download URL, a JSON payload, or something else?
2. What is the expected format of the export (e.g., JSON, ZIP)?
3. Are there any required inputs beyond a dashboard ID (e.g., `workspaceId`, export options)?
4. Does it export widgets, filters, sharing settings, and layout — or a subset?
5. Are there file size limits or timeouts for large dashboards?
6. Is there a permission requirement (e.g., must be Editor or higher)?

---

## importDashboard

1. What format does the import accept? Must it be output from `exportDashboard`, or can it accept arbitrary JSON?
2. What are all the required input fields?
3. What happens if a dashboard with the same name already exists — does it overwrite, fail, or create a duplicate?
4. Are widget data connections preserved, or do they need to be remapped after import?
5. Is there a file size limit?
6. What role is required to import?

---

## duplicateDashboard

1. What is the input — just a dashboard ID, or also a target workspace / name override?
2. Does the duplicate inherit the same widgets, filters, sharing settings, and layout?
3. What is the name of the duplicate — auto-generated (e.g., "Copy of X") or specified by the caller?
4. Does duplication deep-copy widget queries, or reference the originals?
5. Is there a permission requirement for the caller?

---

## General

- Are there cURL examples available for any of these?
- Are there any known edge cases or limitations worth calling out in the docs?
