# Role & Permission Matrix

## Role Overview

| Role | Scope | Purpose |
| --- | --- | --- |
| `SITE_ADMIN` | Global | Full access across all organizations. Can create/delete workspaces. |
| `ADMIN` | Organization | Full org-level access. Cannot create/delete workspaces. |
| `DATA_ADMIN` | Domain | Full domain access. No connection write/delete, no `iam:write/delete`. |
| `CONNECTION_ADMIN` | Connection | Manage a specific connection only (read, write, delete, refresh). |
| `CREATOR` | Any | Create domains and connections. No query or dashboard edit access. |
| `EXPLORER` | Domain | Query a domain with SQL editing and AI workstream access. |
| `BASIC_EXPLORER` | Domain | Query a domain. No SQL editing, no AI workstream. |
| `VIEWER` | Organization | Read-only across agents, chats, dashboards, schedules, evaluations. |
| `OBSERVER` | Organization | Minimal read — workspace, IAM, and zsheet only. |
| `STORY_VIEWER` | Dashboard | View a specific dashboard. |
| `STORY_WRITER` | Dashboard | Edit a specific dashboard (read, write, clone). Cannot create new ones. |
| `SCHEDULE_VIEWER` | Schedule | View a specific schedule. |
| `SCHEDULE_WRITER` | Schedule | Edit a specific schedule. Cannot create new ones. |
| `AGENT_VIEWER` | Agent | View a specific agent. |
| `AGENT_WRITER` | Agent | Edit a specific agent. |

## Permission Matrix

**Column key:** `SA`=SITE_ADMIN · `AD`=ADMIN · `DA`=DATA_ADMIN · `CA`=CONN_ADMIN · `CR`=CREATOR · `EX`=EXPLORER · `BE`=BASIC_EXPLORER · `VI`=VIEWER · `OB`=OBSERVER · `SV`=STORY_VIEWER · `SW`=STORY_WRITER · `ScV`=SCHED_VIEWER · `ScW`=SCHED_WRITER · `AV`=AGENT_VIEWER · `AW`=AGENT_WRITER

### Chat / AI

| Permission | SA | AD | DA | CA | CR | EX | BE | VI | OB | SV | SW | ScV | ScW | AV | AW |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `chat:create` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `chat:read` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `chat:read-all` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `chat:execute-sql` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `chat:edit-sql` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `chat:expand-workstream` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `chat:admin-tools` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Dashboard

| Permission | SA | AD | DA | CA | CR | EX | BE | VI | OB | SV | SW | ScV | ScW | AV | AW |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `dashboard:create` | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `dashboard:read` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `dashboard:write` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `dashboard:clone` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

> ⚠️ `ADMIN` and `DATA_ADMIN` can **create** dashboards but **not edit their content** — editing requires `STORY_WRITER` scoped to that specific dashboard.
> 

### Schedule

| Permission | SA | AD | DA | CA | CR | EX | BE | VI | OB | SV | SW | ScV | ScW | AV | AW |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `schedule:create` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `schedule:read` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| `schedule:write` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

> ⚠️ Same pattern as dashboards — `ADMIN` can create schedules but editing requires `SCHEDULE_WRITER` scoped to that schedule.
> 

### Agent

| Permission | SA | AD | DA | CA | CR | EX | BE | VI | OB | SV | SW | ScV | ScW | AV | AW |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `agent:read` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `agent:write` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### Connection

| Permission | SA | AD | DA | CA | CR | EX | BE | VI | OB | SV | SW | ScV | ScW | AV | AW |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `connection:create` | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `connection:read` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `connection:write` | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `connection:delete` | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `connection:refresh` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `connection:list` | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

> ⚠️ `CONNECTION_ADMIN` can manage an existing connection but **cannot create new ones** or list others.
> 

### Domain

| Permission | SA | AD | DA | CA | CR | EX | BE | VI | OB | SV | SW | ScV | ScW | AV | AW |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `domain:create` | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `domain:list` | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `domain:invite` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### IAM

| Permission | SA | AD | DA | CA | CR | EX | BE | VI | OB | SV | SW | ScV | ScW | AV | AW |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `iam:read` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| `iam:write` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `iam:delete` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `iam-scope:write` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

### ZSheet / Data

| Permission | SA | AD | DA | CA | CR | EX | BE | VI | OB | SV | SW | ScV | ScW | AV | AW |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `zsheet:read` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `zsheet:write` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `zsheet:delete` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `zsheet:refresh` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `data:read-all` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Workspace

| Permission | SA | AD | DA | CA | CR | EX | BE | VI | OB | SV | SW | ScV | ScW | AV | AW |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `workspace:read` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `workspace:write` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `workspace:create` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `workspace:delete` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Evaluation & Misc Admin

| Permission | SA | AD | DA | CA | CR | EX | BE | VI | OB | SV | SW | ScV | ScW | AV | AW |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `evaluation:read` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `evaluation:write` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `executed-sql:read` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `questions-log:read` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `codegen:unbounded` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `recommended-questions:write` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `question-bank:all` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `reviewed-questions:all` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `cache:read` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `cache:write` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `slack:connect` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `system:view` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Permissions assigned to no role

These exist in the type definition but are not enforced anywhere and assigned to no role in `ROLE_PERMISSION_MAP`:

| Permission | Notes |
| --- | --- |
| `chat:write` | In `CHAT_WRITER_PERMISSIONS` but not in `ROLE_PERMISSION_MAP` — dead |
| `chat:read:day0` | Defined, unused |
| `chat:unstructured` | Defined, unused |
| `chat:debug` | `DEBUG_PERMISSIONS` only — not in `ROLE_PERMISSION_MAP` |
| `cache:delete` | `DEBUG_PERMISSIONS` only |
| `chat:experimental-unstructured-search` | `DEBUG_PERMISSIONS` only |
| `experimental` | Defined, unused |
| `experimental:filters` | Defined, unused |
| `experimental:entity-templates` | Defined, unused |
| `experimental:canvas-ui` | Defined, unused |


Other details:

### Questions:
Clarify:
1. If the one labeled “story” should be “dashboard” instead. 
2. If the “writer” means create or edit - for example, create/edit an agent or a dashboard? 
3. How does Connection Admin differ from ADMIN and/or Site Admin?
4. What can a Viewer do?
5. How does Explorer differ from Basic Explorer?
6. Does the viewer have any of these capabilities? And what's the difference between a viewer and an observer?

### Answers:
1. "Story" vs "Dashboard" - Same thing. "Story" is the legacy internal name; the actual permissions are dashboard:*. STORY_VIEWER and STORY_WRITER are the role names in the code but they operate on dashboards.
2. "Writer" = create or edit? - Edit only. STORY_WRITER gets dashboard:write/read/clone but no dashboard:create. Same for SCHEDULE_WRITER and AGENT_WRITER - they edit a specific resource they've been scoped to, they can't create new ones.
3. CONNECTION_ADMIN vs ADMIN vs SITE_ADMIN  CONNECTION_ADMIN : read/write/delete/refresh one specific connection, nothing else. ADMIN is full org-level access. SITE_ADMIN is ADMIN + can create/delete workspaces across all orgs.
4. What can VIEWER do? - Pure read-only: agent:read, chat:read, dashboard:read, evaluation:read, schedule:read, workspace:read, zsheet:read, iam:read. Cannot create or modify anything.
5. EXPLORER vs BASIC_EXPLORER - EXPLORER has chat:edit-sql and chat:expand-workstream. BASIC_EXPLORER does not. Everything else is identical.
6. VIEWER vs OBSERVER - VIEWER can read dashboards, chats, agents, schedules, and evaluations. OBSERVER can only read workspace, IAM, and tables - it cannot see dashboards or chat history at all.