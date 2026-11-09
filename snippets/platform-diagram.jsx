export const PlatformDiagram = () => {
  const surfaces = [
    { label: "Ask & Analyze", detail: "Chat in plain language", href: "/chat/overview" },
    { label: "Dashboards & Live Apps", detail: "Share answers that stay current", href: "/using-wisdom-ai-everyday/turn-answers-into-dashboards" },
    { label: "Agents & Skills", detail: "Automate recurring analysis", href: "/setting-up-wisdom-ai/agents/agents" },
  ];
  const context = [
    { label: "Understands what is in your tables", href: "/setting-up-wisdom-ai/manage-tables-columns/document-tables-and-columns" },
    { label: "Calculates metrics the way you do", href: "/setting-up-wisdom-ai/advanced-data-modeling-creating-context" },
    { label: "Gives the same trusted answer every time", href: "/setting-up-wisdom-ai/feedback-mechanisms/reviewed-queries" },
    { label: "Shows each person only their data", href: "/manage-account/row-level-access-control/understanding-row-level-security" },
  ];
  const sources = [
    { label: "Connect your data warehouse", href: "/getting-started/connect-data-sources/supported-data-sources" },
    { label: "Add your company documents", href: "/improve-wisdom-ai-responses/connect-unstructed-repositories-datasets" },
    { label: "Upload your own spreadsheets", href: "/using-wisdom-ai-everyday/work-with-csv-files" },
    { label: "Search the web and other tools", href: "/getting-started/connect-data-sources/connect-mcp-server" },
  ];

  const box =
    "flex flex-col justify-center rounded-lg border border-zinc-300 bg-white px-3 py-3 text-center no-underline transition hover:border-[#5b52ff] dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-[#5b52ff]";
  const caption = "m-0 mb-2 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400";

  return (
    <div className="not-prose my-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <p className={caption}>Where your team works</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {surfaces.map((s) => (
          <a key={s.label} href={s.href} className={box}>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{s.label}</span>
            <span className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{s.detail}</span>
          </a>
        ))}
      </div>

      <div className="mx-auto my-2 h-5 w-px bg-zinc-300 dark:bg-zinc-700" />

      <a
        href="/setting-up-wisdom-ai/getting-started-domains-context"
        className="block rounded-lg px-4 py-3 text-center no-underline transition hover:opacity-90"
        style={{ backgroundColor: "#5b52ff" }}
      >
        <span className="text-base font-semibold text-white">Domains & Context</span>
        <span className="block text-xs text-white/80">Teaches WisdomAI how your business works</span>
      </a>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {context.map((c) => (
          <a key={c.label} href={c.href} className={box}>
            <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{c.label}</span>
          </a>
        ))}
      </div>

      <div className="mx-auto my-2 h-5 w-px bg-zinc-300 dark:bg-zinc-700" />

      <p className={caption}>Your data</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {sources.map((s) => (
          <a key={s.label} href={s.href} className={box + " border-dashed"}>
            <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{s.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};
