export const DataFlowDiagram = () => {
  const steps = [
    {
      title: "Connected Data Sources",
      short: "Data Sources",
      detail: "WisdomAI integrates with your data platforms (such as Snowflake, BigQuery, or Redshift), serving as the entry point for all information flowing through the system.",
      href: "/getting-started/connect-data-sources/supported-data-sources",
    },
    {
      title: "Semantic Modeling",
      short: "Semantic Modeling",
      detail: "Admins and data owners enrich the data by documenting tables, columns, and domains, and by defining relationships to create a business-friendly context for natural language understanding.",
      href: "/setting-up-wisdom-ai/advanced-data-modeling-creating-context",
    },
    {
      title: "Natural Language Query Engine",
      short: "Query Engine",
      detail: "Users ask questions in plain language. The engine parses each question and translates it into SQL using the semantic model.",
      href: "/chat/overview",
    },
    {
      title: "Dashboards & Live Apps",
      short: "Dashboard & Live Apps",
      detail: "Answers become interactive Dashboards that combine visualizations, text, and insights, or Live Apps that WisdomAI generates from a prompt on your governed data. Both refresh on a schedule and can be shared.",
      href: "/using-wisdom-ai-everyday/turn-answers-into-dashboards",
    },
    {
      title: "Delivery & Reporting",
      short: "Delivery",
      detail: "Dashboards can be delivered on a schedule via email. Dashboards and Live Apps can be embedded into external applications, so teams stay informed with minimal effort.",
      href: "/using-wisdom-ai-everyday/schedule-dashboards-notifications",
    },
    {
      title: "User Feedback & Corrections",
      short: "Feedback",
      detail: "Users give feedback on answer accuracy, suggest corrections, or add clarifying context to improve future results.",
      href: "/setting-up-wisdom-ai/feedback-mechanisms/provide-feedback-to-the-system",
    },
    {
      title: "Knowledge Updates & Review",
      short: "Review & Updates",
      detail: "Admins review user feedback and update the semantic layer, closing the loop and continuously improving answer quality.",
      href: "/setting-up-wisdom-ai/feedback-mechanisms/reviewed-queries",
    },
  ];

  const [active, setActive] = useState(0);
  const current = steps[active];

  // Colors are inline styles: arbitrary Tailwind colors built at runtime are not always compiled in snippets.
  const PURPLE = "#5b52ff";
  const node =
    "flex h-full w-full min-w-0 cursor-pointer flex-col items-center justify-start gap-2 rounded-lg border px-1 py-3 text-center transition " +
    "border-zinc-300 bg-white text-zinc-800 hover:border-[#5b52ff] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200";
  const activeNode = { borderColor: PURPLE, backgroundColor: "rgba(91, 82, 255, 0.12)", boxShadow: "0 0 0 1px " + PURPLE };
  const badgeBase = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 22,
    height: 22,
    flexShrink: 0,
    borderRadius: 9999,
    fontSize: 11,
    fontWeight: 600,
  };

  const Node = ({ i }) => {
    const on = i === active;
    return (
      <button type="button" className={node} style={on ? activeNode : undefined} onClick={() => setActive(i)} aria-pressed={on}>
        <span
          style={{
            ...badgeBase,
            backgroundColor: on ? PURPLE : "rgba(91, 82, 255, 0.12)",
            color: on ? "#ffffff" : PURPLE,
          }}
        >
          {i + 1}
        </span>
        <span className="font-semibold" style={{ fontSize: 12, lineHeight: 1.3, overflowWrap: "normal", wordBreak: "normal" }}>
          {steps[i].short}
        </span>
      </button>
    );
  };

  const arrowRight = (
    <div className="flex items-center justify-center text-zinc-400 dark:text-zinc-500" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
  const arrowDown = (
    <div className="flex justify-center py-1 text-zinc-400 dark:text-zinc-500" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1v11M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  // Desktop grid: node, arrow, node, arrow, ... (13 columns). The loop runs from step 7 (col 13) back to step 2 (col 3).
  const desktopCols = "repeat(6, minmax(0, 1fr) 18px) minmax(0, 1fr)";
  const loop = "h-5 border-b-2 border-dashed border-[#5b52ff]/60";

  return (
    <div className="not-prose my-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-950">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="grid items-stretch" style={{ gridTemplateColumns: desktopCols }}>
          {steps.map((_, i) => [
            <Node key={"n" + i} i={i} />,
            i < steps.length - 1 ? <div key={"a" + i} className="flex items-center justify-center">{arrowRight}</div> : null,
          ])}
        </div>
        <div className="grid" style={{ gridTemplateColumns: desktopCols }}>
          <div className={loop + " border-l-2 rounded-bl-lg"} style={{ gridColumn: "3 / 4", marginLeft: "50%" }} />
          <div className={loop} style={{ gridColumn: "4 / 13" }} />
          <div className={loop + " border-r-2 rounded-br-lg"} style={{ gridColumn: "13 / 14", marginRight: "50%" }} />
        </div>
        <p className="m-0 mt-2 text-center text-xs font-medium text-[#5b52ff]">
          ↺ Feedback loop: reviewed corrections flow back into the semantic model
        </p>
      </div>

      {/* Mobile and tablet */}
      <div className="lg:hidden">
        {steps.map((_, i) => (
          <div key={i}>
            <Node i={i} />
            {i < steps.length - 1 ? arrowDown : null}
          </div>
        ))}
        <p className="m-0 mt-3 text-center text-xs font-medium text-[#5b52ff]">
          ↺ Step 7 feeds back into step 2, so answers keep improving
        </p>
      </div>

      {/* Detail panel */}
      <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="m-0 text-xs font-semibold uppercase tracking-wider text-[#5b52ff]">Step {active + 1}</p>
        <p className="m-0 mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{current.title}</p>
        <p className="m-0 mt-1 text-sm text-zinc-600 dark:text-zinc-400">{current.detail}</p>
        <a href={current.href} className="mt-2 inline-block text-sm font-medium text-[#5b52ff] no-underline hover:underline">
          Learn more →
        </a>
      </div>
    </div>
  );
};
