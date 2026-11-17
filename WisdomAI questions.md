** WisdomAI October 2026: questions for the engineering team**

Each section is one Needs Attention card from the October report. The docs assistant could not answer these questions, or answered them without a source. Each question below is written so it can be sent as is. Noise (the repeated OpenAI rate-limit message) is left out.

"Evidence" gives the date and the reader's own words, so engineering can find the conversation.

**---**

** 1 Live App build troubleshooting (23 queries, 29 and 30 Oct)**

**Context:** One bank team (Axis Bank India) spent two days building a Live App, "RO-SM LC Productivity Dashboard", from a Power BI design. It has 8 KPI cards, filters, and pages for Logins, Disbursals and Incentive. The docs have no page on fixing a Live App's numbers or filters, so the assistant mostly guessed and said it could not confirm the cause.

**Questions for engineering**

1 **KPI cards show 0 after the Month filter changes.** All 8 KPI cards on the RO Productivity page show 0 for every month except Oct 26 Resource Count (a distinct count of `EMPLOYEE_NO`) is also 0, so the four "per RO" cards are 0.00. Charts on the same page still show data.  
   - Is the cause that the KPI widget only loads rows for Oct 26 (live filters only narrow rows already loaded)?  
   - Could it be a format mismatch? The widget stores `MONTH` as strings like `202610.0000000000`, and the filter value may not match them.  
   - What is the supported way to make KPI cards respond to the Month filter for all months?  
   - Evidence: "above 8 kpi nos not reflecting after change the month its showing 0 only all kpis"; "not for jul 26 month, all month give correct data".  
2 **Data limited to one or two months.** The Month filter listed only 2 months (Apr and May 2024), and later only Oct 26 The source has 35,779 raw rows for Apr to Oct 2026 The assistant said a widget loads at most 10,000 rows and that filters only work on loaded rows.  
   - Is the 10,000-row load limit per widget, per app, or per deployment, and can the team change it?  
   - Should apps like this aggregate in the source instead of loading row-level data? What grain should they use?   
   - Evidence: "in my table data from 24 to oct 26 but why wisdom gave me only two month data".  
3 **Filters disappeared after a rebuild.** After the KPI data change, the Role filter listed only "SM", and the Tier and Vintage filters lost their options.  
   - Is it expected that filter options are rebuilt from the loaded rows, so a data change drops them?  
   - Can filter options be pinned to the full source?  
   - Evidence: "now wisdom remove ro and other filter value also please keep earlier filter and value in it".  
4 **A filter should affect one page only.** A filter set on the Logins page also changes the "M-o-M Total Logins" chart, and the user wants it to ignore the filter. The docs say dashboard filters are shared across all tabs.  
   - Is there a per-widget or per-page filter scope in Live Apps? If not, is one planned?  
   - Evidence: "if i change any filter from login page then M-O-M total logins not change, please do only in login page, dont touch on any other pages".  
5 **Custom formulas written in Power BI DAX.** The user pasted `DIVIDE(SUM(...), DISTINCTCOUNT(...), 0)`-style formulas and asked Wisdom to apply them. The assistant said WisdomAI uses SQL metrics and converted the formulas.  
   - Is there a supported way to bring in Power BI measures, or is SQL-only the intended answer?  
   - Evidence: "apply formula to 8 cards in attached screenshot, Logins is showing 0, sum(TOTAL_LOGINS), Logins_per_RO = DIVIDE(...)".  
6 **A build ignored the stated scope.** The user asked for Apr 2026 to Oct 2026 only. The app followed the attached design note, whose charts start at Apr-25, and split the summary into FY26 and FY27 slices.  
   - Should an explicit date limit in the prompt override a design note in an attachment?  
   - Evidence: "want only this financial year data ie apr26 to oct26 in month filter".  
7 **Build failure.** The user reported being unable to create any app since the morning. The assistant could not see the cause and sent them to support.  
   - Can engineering look up the workspace's failed builds on 29 Oct? The error shown was the OpenAI rate-limit message, which appeared 3 times. Is that a provider limit or a Wisdom limit?  
   - Evidence: "but why this error come, today from morning i facing this error due to this unable to create single app".  
8 **Layout.** The user asked how to move visuals freely, as in Power BI. The docs describe cards and tabs but no free-form canvas.  
   - Is free-form placement of visuals supported or planned for Live Apps?  
   - Evidence: "in power bi we can manually do and its easy to drag any where, so in wisdom there is no option?".  
9 **Support route for this customer.** The user asked for a Wisdom support contact for Axis Bank. The assistant had no account-specific route.  
   - Who should this customer contact?

**---**

** 2 Charts in the SDK and MCP (19 queries, 7 to 21 Oct)**

**Context:** One developer was embedding charts in their own application with the SDK, GraphQL and MCP. They asked about waterfall charts and about names that appear in no doc page.

**Questions for engineering**

1 **Waterfall chart.** Is a waterfall chart supported, through the SDK, GraphQL or MCP? The docs list Table, Pie, Funnel, Bar, Column, Area, Line, Map, Scatter, Forecast, Polar, Spider, Heatmap and LLM-generated custom charts. The word "waterfall" appears nowhere. This was asked 5 times. If it is not supported, what is the workaround for row-format data?  
   - Evidence: "so waterfall chart is not supported by wisdom?"; "so i have data in row format i want to represent that in waterfall chart is that possible?".  
2 **`ChatVisualizationCard`.** What is it, and how does it differ from `DashboardWidget`? It is in no doc page.  
   - Evidence: "ChatVisualizationCard how is this different from dashboardwidget?".  
3 **`WisdomCard`.** What does it do, and does it render `llm_generated_chart`? It is in no doc page.  
   - Evidence: "does wisdom card render llm_generated_chart".  
4 **`chatVisualizations(conversationId, [chartId])`.** Does this GraphQL query exist? What are its arguments and return type? Can it be used to render chat charts in a custom app? Also, is there a `GetChatVisualization` operation?  
   - Evidence: "chatVisualizations(conversationId, [chartId]) can this be used for representing charts"; "GetChatVisualization in third party sdk / in graphql schema is it there?".  
5 **"Show data" toggle.** `DashboardWidget` renders only the chart, without the "show data" toggle that Chat has. Is there a prop to turn it on? The docs list none.  
   - Evidence: "i used dashboardWidget component... only the chart i rendered not the show data toggle, any way i can add that too".  
6 **Widget ID.** Where does a developer get a widget ID? The assistant said to query `dashboard { widgets { id } }`, but that is not on the SDK Components page.  
   - Is there an easier way, such as copying it from the UI?  
7 **MCP.** Is there an MCP tool that returns an existing dashboard widget directly? The docs show only chat-style Q&A. Is there any setting or plan tier for "advanced chart rendering" over MCP?  
   - Evidence: "any mcp tool which gets a dashboard widget directly for me so i can display that directly?".

**---**

** 3 API and MCP examples (9 queries, 13 to 30 Oct)**

**Context:** Developers using the GraphQL API and MCP server hit gaps in the docs.

**Questions for engineering**

1 **Connection status by name.** The `connection` query takes only an `id`. Is there a way to look up a connection by name, for example "Streamline", and read its last sync status? Where in the UI does a user find a connection ID?  
   - Evidence: "give me an example of a GraphQL API request which will return the last sync status of the Wisdom connection called Streamline".  
2 **Not valid JSON.** The example on the Connection query page is GraphQL text, which a reader tried to parse as JSON and could not. Should the page show the JSON request body as well?  
3 **REST API.** Is there a REST API, or only GraphQL?  
4 **Evaluation sets.** Can evaluation sets be created or listed through GraphQL or an SDK? The docs only describe the Evaluation tab in the UI.  
5 **MCP returns 401.** A developer at an `askwisdom.ai` instance got `401 invalid_token` from the MCP endpoint while sending an API key as a bearer token. The response mentioned an OAuth-protected resource with scope `mcp:*`.  
   - Which credentials does the MCP endpoint accept: API keys, OAuth tokens, or both? Does that depend on the instance?  
   - Evidence: "using api key authentication i am running into a 401 error"; "in mcp connection we don't need jwt changing hands?".

**---**

** 4 Unsupported connectors (8 queries, 2 to 21 Oct)**

**Context:** Readers asked about connectors the Supported Data Sources page does not mention, so the assistant hedged or asked what they meant.

**Questions for engineering.** For each item, is it supported, planned, or not supported?

1 Trino with Iceberg tables. Trino has a native connector, but the docs do not mention Iceberg.  
2 QuickBooks. Is it supported, or must data go through Fivetran or Airbyte?  
3 Azure CSP (Cloud Solution Provider).  
4 A graph database with Cypher.  
5 Microsoft Teams as a chat integration. The docs say only Slack is supported.

Evidence: one-word queries "Trino", "quickbooks", "cypher", "Teams"; "Does Wisdom support Azure CSP"; "Does it also connect to iceberg tables". Suggested fix: add an "Unsupported or not yet supported" list to Supported Data Sources.

**---**

** 5 Permissions: SSO, roles and column security (7 queries, 5 to 21 Oct)**

**Context:** Admins asked how the permission settings combine. None of these is answered in the docs.

**Questions for engineering**

1 **User vs SSO group.** If a user's own roles or domains conflict with those of their SSO group, which wins? How do the Users tab and the Groups tab combine for one user?  
   - Evidence: "do user level configurations supersede SSO group configurations if they conflict?".  
2 **Explorer visibility.** Can an Explorer see groups they do not belong to?  
   - Evidence: "can a user who is an explorer role see other groups they are not part of in wisdomAI?".  
3 **Column-level security.** If CLS is applied to a base table column, does it apply to derived columns built from it? The docs say CLS is "applied strictly at the column level" and warn about unprotected correlated columns.  
   - Evidence: "if i apply CLS on the base table, will those rules propagate to the derived columns we create".  
4 **Non-table sources.** How does data security work for non-table sources such as Slack or Notion?  
   - Evidence: "How does data security work across non-table data sources, like slack or notion".

**---**

** 6 Sharing Live Apps (6 queries, 8 to 22 Oct)**

**Context:** Customers want to share Live Apps beyond the person who built them.

**Questions for engineering**

1 **Embedding with other users' tokens.** The assistant said to create users with `createUsers`, share the app, call `impersonateUser` for a 1-hour JWT, and embed the app at the `/apps/embed/...` URL. Please confirm that flow, and say how it differs for an app built by one user and viewed by many.  
2 **A shared read-only account.** Can one non-personal Viewer account be used to view apps, without linking it to a person? There is no "service account" type in the docs.  
3 **Subscriptions.** Can a Live App be sent as a subscription (scheduled email)? The docs cover subscriptions for dashboards only.  
4 **Actions from a Live App.** Can an app write data or take actions through MCP tool calls?  
5 **API creation.** Can Live Apps be created through the API? The docs describe only creation from a prompt in the UI, plus JSON import and export.  
6 **Limits.** What is the maximum prompt length, and how long does a build take?

**---**

** 7 Password reset and support contact (6 queries, 6 to 19 Oct)**

**Context:** Readers asked how to reset a forgotten login password or reach support. The assistant gave answers without a source. The Contact Support page had 48 human views this month but was not cited.

**Questions for engineering or support**

1 Is there a self-service password reset? If so, where is it described? The assistant said resets go through support.  
2 Which address handles which kind of request (account and login, billing, security, privacy)? The assistant gave several different addresses in different answers.  
3 Can the assistant be set up to cite the Contact Support page when readers ask for help?

Evidence: "in need help someone help me reset the Password as I forgot my earlier password"; "supprt mail"; "can i be connected to customer suppot".

