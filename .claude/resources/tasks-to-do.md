# Embedding Docs - Improvement Plan

## Structure Change

The Embedding section should be the parent for all integration paths:

```
Embedding
  ├── iframe
  ├── GraphQL API
  └── SDK (coming soon)
```

User management (`createUsers`, attributes, impersonation) and shared concepts (RBAC, error handling, token lifecycle) should live under Embedding as common content that applies across all three paths. Each path then has its own specific docs.

## Missing Content

### 1. User Management mutation pages

We have an internal doc with the full spec. The GraphQL API Mutations section needs a new **User** category with:

- `createUsers` - `CreateUsersInput` schema with `emails`, `roleAssignments`, `workspaceID`, `sendWelcomeEmail`, `userAttributes`, `userGroupIds`
- `setUserAttributes` - `SetUserAttributesInput` with `userId` and `userAttributes`. Include the warning that this **replaces all DATABASE-sourced attributes**
- `deleteUsersFromWorkspace` - with `ids` and `workspaceID`
- `ListUsers` query - including `userAttributes` with `key`, `value`, and `source` in the response
- `impersonateUser` - Standalone public mutation (marked `@unauthenticated @public_api` in schema). Actual signature from codebase:
    - `impersonateUser(accessToken: String!, userEmail: String!, attributes: [UserAttributeInput!]): String!`
    - `accessToken` - Descope access key (not a JWT, not a prior session token)
    - `userEmail` - email of the user to impersonate (must already exist in Wisdom)
    - `attributes` - optional array of `{key, value}` pairs (transient, applied for that session only, not persisted). These override DATABASE-sourced attributes for the session
    - Returns a raw JWT string (not an object) - the 1hr-lived token used in embed URLs
    - **Security note**: the `impersonated_user_id` claim cannot be overridden via attributes
    - cURL example showing impersonation with and without transient attributes

Internal doc has cURL examples and input schemas ready - https://drive.google.com/file/d/1PO-1BsXTbtGjvnoxYgt9HrzaRiCdUNJa/view?usp=sharing

### 2. User attributes documentation

User attributes (key-value pairs for parameterized connections, row-level auth, personalized data access) aren't documented publicly. Cover:

- Two sources: **DATABASE** (set via API) vs **JWT** (SSO claims, read-only)
- Setting attributes at creation time via `userAttributes` in `CreateUsersInput`
- Updating later via `setUserAttributes`
- Passing transient attributes at impersonation time
- `~~iam:write` and `iam:delete` permission scopes~~

### 3. `exportDashboard`, `importDashboard`, `duplicateDashboard` pages

Available as APIs but no docs pages. Add under GraphQL API > Mutations > Dashboard.

### 4. GraphQL primer for REST developers

Short section: all operations are POST requests to `/graphql` with JSON body, Postman setup, common mistakes. Useful for both paths since even iframe embedding uses GraphQL for user setup.

- All operations are `POST` requests to a single `/graphql` endpoint with a JSON body containing `query` and `variables` fields
- GraphQL returns HTTP 200 even on errors -- always check the response body, not status codes
- Common mistakes: forgetting `Content-Type: application/json`, sending query as a URL param instead of in the body, not requesting return fields on mutations

## Fix Existing Pages

### 3. Expand iFrame embedding overview - full workflow

Current page has 2 steps: get access token, impersonate. Actual flow:

1. Get access token from support
2. Create end user via `createUsers`
3. (Optional) Set user attributes
4. Impersonate the new user to get a JWT
5. Use that JWT in the iframe embed URL

Add missing steps + link to user management pages with copyable code

Should cover the **email uniqueness gotcha** -- user matching is email-based, need a strategy for users without unique emails (e.g. appending unique ID to email prefix).

### 4. Clarify `status` in mutation responses

Users object page shows `status` as `UserStatus!` (enum). But mutations like `createUsers` return `{ status }` which is a **`ResponseStatus` object** with `code` and `message` fields. New mutation pages should make this explicit.

The correct query shape for mutations is `{ status { code message } }` (not just `{ status }`).

From the codebase, `ResponseStatus` is defined as:

```
type ResponseStatus {
  code: StatusCode!
  message: String!
}

enum StatusCode {
  NONE
  OK
  ERROR
  NOT_FOUND
}
```

Example success: `{ "status": { "code": "OK", "message": "Success" } }`

Example failure: `{ "status": { "code": "ERROR", "message": "User with email already exists" } }`

Example not found: `{ "status": { "code": "NOT_FOUND", "message": "..." } }`

### 5. Error handling for HTTP 200 responses

GraphQL API error handling section only lists HTTP 401/400/500. The API returns **HTTP 200 even on failure** -- you have to check the `ResponseStatus` body. Add a warning with examples. Affects both integration paths.

### 6. RBAC section on embed-a-dashboard page

Common question: how to hide edit buttons in embedded dashboards. Answer: assign **Viewer** role. Not mentioned anywhere in embedding docs. Edit permissions flow from the user's RBAC role - there's no separate embed-specific parameter.

### ~~7. Dashboard filter URL parameters~~

~~Filters can be passed on embedded dashboards via URL:~~

`~~/dashboards/<id>?<column_name>=<value>~~`

~~Not documented anywhere. Add to the embed-a-dashboard page.~~

### 8. Token lifetime and refresh mechanism

Impersonate user page says "JWT tokens have a limited lifetime" - no actual duration, expiry error, or refresh guidance. Both paths need this.

**Token lifetime**: Embedded session JWTs expire after **1 hour**. The Wisdom frontend begins the refresh flow ~10 seconds before expiry.

**Built-in refresh via `postMessage`**

Wisdom sends a `REQUEST_JWT_TOKEN` event to the parent window when the embedded token is close to expiry. It is the **embedder's responsibility** to listen for this event, regenerate the token (by calling `impersonateUser` with the access key), and post it back. Wisdom then picks up the new token and continues the session seamlessly.

The flow:

1. Wisdom iframe detects token is about to expire
2. Wisdom sends `window.parent.postMessage({ type: 'REQUEST_JWT_TOKEN' }, '*')` to the host
3. Host receives the event, validates `event.origin` matches the Wisdom domain
4. Host calls `impersonateUser` (via its own backend) to get a fresh JWT
5. Host posts back `iframe.contentWindow.postMessage({ type: 'JWT_TOKEN_RESPONSE', token }, WISDOM_ORIGIN)`
6. Wisdom receives the new token and refreshes the session

Example:

```jsx
<iframe
  id="wisdom-frame"
  src="https://customer.wisdom.ai/dashboards/embed/123"
  style="width:100%;height:800px;border:0"
></iframe>

<script>
  const iframe = document.getElementById('wisdom-frame');
  const WISDOM_ORIGIN = 'https://customer.wisdom.ai';

  async function getFreshWisdomToken() {
    // use AccessKey to regenerate token
    return data.token;
  }

  window.addEventListener('message', async (event) => {
    if (event.origin !== WISDOM_ORIGIN) {
      return;
    }

    if (event.source !== iframe.contentWindow) {
      return;
    }

    if (event.data?.type !== 'REQUEST_JWT_TOKEN') {
      return;
    }

    try {
      const token = await getFreshWisdomToken();

      iframe.contentWindow.postMessage(
        { type: 'JWT_TOKEN_RESPONSE', token },
        WISDOM_ORIGIN
      );
    } catch (error) {
      console.error('Unable to provide Wisdom token', error);
    }
  });
</script>
```

Implementation notes from the codebase (`useEmbeddedSessionToken.ts`):

- Wisdom sends with `'*'` as target origin, so the host **must** validate `event.origin` on its side
- If the host doesn't respond within **10 seconds**, the request times out and retries on the next render cycle
- Only one refresh request is in-flight at a time (singleton pattern prevents duplicates)
- `?token=` URL param always takes priority over any cached token

**Demo code** (from Michael in #wisdomai-inhabit, 2026-04-02):

```jsx
// === iframe setup ===
// <iframe id="wisdom-frame" src="https://customer.wisdom.ai/dashboards/embed/123" style="width:100%;height:800px;border:0"></iframe>

const iframe = document.getElementById('wisdom-frame');
const WISDOM_ORIGIN = 'https://customer.wisdom.ai';

async function getFreshWisdomToken() {
  // use AccessKey to regenerate token via impersonateUser
  return data.token;
}

window.addEventListener('message', async (event) => {
  if (event.origin !== WISDOM_ORIGIN) return;
  if (event.source !== iframe.contentWindow) return;
  if (event.data?.type !== 'REQUEST_JWT_TOKEN') return;

  try {
    const token = await getFreshWisdomToken();
    iframe.contentWindow.postMessage(
      { type: 'JWT_TOKEN_RESPONSE', token },
      WISDOM_ORIGIN
    );
  } catch (error) {
    console.error('Unable to provide Wisdom token', error);
  }
});
```

The `getFreshWisdomToken()` function is where the embedder calls their own backend to invoke `impersonateUser` with the access key and get a fresh JWT.

Document this as the **primary** refresh mechanism.

## Gaps Surfaced from Customer Channel (wisdomai-inhabit)

*issues raised by the Inhabit/ResMan integration team*

### 1. Domain clarification in endpoint references (P0)

Docs reference `https://<customer>.askwisdom.ai/graphql` but both `wisdom.ai` and `askwisdom.ai` are valid depending on the customer's tenant. Users hit `getaddrinfo ENOTFOUND` errors when trying the wrong one. Docs should clarify: use whichever domain your Wisdom tenant is hosted on (the same base URL you use to log in). Audit all endpoint references across docs for consistency.

### 2. Embedding modes overview page (P0)

Four embed paths exist in the codebase but aren't clearly documented. Users confused `/chat/embed` (not a real path) with `/embed/chat/<id>`. Supported paths from the frontend:

- `/embed/search` - full-app embed (search + dashboards + chat in one)
- `/embed/dashboards` - dashboards list view
- `/embed/dashboards/[id]` - specific dashboard
- `/embed/chat/[conversationId]` - specific chat (also supports optional `messageid` param)

Include the `allow="microphone; camera"` iframe attribute requirement

### 3. Service account pattern / impersonation flow (P0)

The `impersonateUser` mutation is `@unauthenticated @public_api` - it only needs a Descope access key, not a prior JWT session. The actual flow is simpler than what users assumed but the docs don't make this clear. Document the correct end-to-end flow:

1. Obtain Descope access key from Wisdom support
2. Call `createUsers` to create the end user (requires `iam:write` permission on the access key)
3. Call `impersonateUser(accessToken, userEmail)` to get a JWT
4. Load iframe with `src="/embed/search?token=<JWT>"`

The Inhabit team's biggest pain point was the docs referencing values before explaining how to obtain them.

### 4. `createUsers` re-invite behavior (P1)

When `createUsers` is called with an email that already exists, it re-applies the role assignments passed in. The Inhabit team's overnight feed called `createUsers` on every login, which kept overwriting manually upgraded roles (Explorer -> Basic Explorer). Document:

- What happens when the email already exists
- That role assignments get overwritten on re-invite
- Recommend checking `ListUsers` first if you don't want to reset roles

### 5. Role IDs and permissions reference (P1)

The `createUsers` mutation requires role IDs but they aren't published in docs:

- `ADMIN`: `00000000-0000-0000-0000-000000000001`
- `EXPLORER`: `00000000-0000-0000-0000-000000000002`
- `VIEWER`: `00000000-0000-0000-0000-000000000003`
- `DATA_ADMIN`: `00000000-0000-0000-0000-000000000004`
- `CONNECTION_ADMIN`: `00000000-0000-0000-0000-000000000005`
- `CREATOR`: `00000000-0000-0000-0000-000000000006`
- `OBSERVER`: `00000000-0000-0000-0000-000000000007`
- `STORY_VIEWER`: `00000000-0000-0000-0000-000000000008`
- `STORY_WRITER`: `00000000-0000-0000-0000-000000000009`
- `SCHEDULE_VIEWER`: `00000000-0000-0000-0000-000000000010`
- `SCHEDULE_WRITER`: `00000000-0000-0000-0000-000000000011`
- `AGENT_VIEWER`: `00000000-0000-0000-0000-000000000012`
- `AGENT_WRITER`: `00000000-0000-0000-0000-000000000013`
- `SITE_ADMIN`: `00000000-0000-0000-0000-000000000014`
- `BASIC_EXPLORER`: `00000000-0000-0000-0000-000000000015`

Also add a matrix of what each role can/cannot do in embedded context (dashboard creation, CSV export, Add to Dashboard, AI workstream visibility). Note that custom roles are not yet supported.

### 6. Session management for embedded users (P1)

The frontend stores tokens in localStorage as `wisdom.jwt`. The `?token=` URL param takes priority over cached tokens. When switching impersonated users in the same iframe, the old session can persist ("sticky sessions"). Document:

- Reload the iframe with a new JWT URL to switch users (don't try to switch in-place)
- `?token=` param always overrides any cached session
- No explicit logout mutation exists for embedded sessions

### 7. Redirect behavior on invalid/expired tokens (P1)

When an expired or invalid JWT is passed in the embed URL, users have reported being redirected to a login page instead of seeing a clear error (observed by Kishan in #wisdomai-inhabit on 2026-04-02). Document:

- What actually happens when an invalid or expired token is passed
- Recommend implementing the `postMessage` token refresh listener (see "Fix Existing Pages > 8. Token lifetime and refresh mechanism") so tokens get refreshed before expiry

### 8. User display name in `createUsers` (P2)

`CreateUsersInput` does not have a name field - only `emails`, `roleAssignments`, `workspaceID`, `sendWelcomeEmail`, `userAttributes`, `userGroupIds`. Users show up as email-only in the admin screen. Document as a known limitation or suggest using `userAttributes` as a workaround if applicable.
