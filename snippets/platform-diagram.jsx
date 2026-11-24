export const PathCards = ({ step }) => {
  const steps = {
    connect: [
      {
        label: "Start here",
        title: "Supported data sources",
        description: "See which warehouses and sources you can connect to WisdomAI.",
        href: "/getting-started/connect-data-sources/supported-data-sources",
      },
      {
        label: "Tutorial",
        title: "Connect and test",
        description: "Connect a data source, ask your first questions, and give feedback.",
        href: "/setting-up-wisdom-ai/basic-tutorial-connect-and-test",
      },
      {
        label: "Guide",
        title: "Add your company documents",
        description: "Bring unstructured repositories and datasets into your answers.",
        href: "/improve-wisdom-ai-responses/connect-unstructed-repositories-datasets",
      },
      {
        label: "Guide",
        title: "Upload your own spreadsheets",
        description: "Work with CSV files directly in chat.",
        href: "/using-wisdom-ai-everyday/work-with-csv-files",
      },
    ],
    setup: [
      {
        label: "Start here",
        title: "Domains and context",
        description: "Organize your tables into domains and teach WisdomAI what they mean.",
        href: "/setting-up-wisdom-ai/getting-started-domains-context",
      },
      {
        label: "Guide",
        title: "Define how your metrics are calculated",
        description: "Model your data and add business context so answers match your definitions.",
        href: "/setting-up-wisdom-ai/advanced-data-modeling-creating-context",
      },
      {
        label: "Guide",
        title: "Approve answers your team can trust",
        description: "Save reviewed queries so trusted answers are reused.",
        href: "/setting-up-wisdom-ai/feedback-mechanisms/reviewed-queries",
      },
      {
        label: "Guide",
        title: "Control who sees which data",
        description: "Understand row-level security and set access rules.",
        href: "/manage-account/row-level-access-control/understanding-row-level-security",
      },
    ],
    use: [
      {
        label: "Start here",
        title: "Getting started for Explorers",
        description: "Ask your first question and turn the answer into a dashboard.",
        href: "/explorers/getting-started-explorers",
      },
      {
        label: "Guide",
        title: "Ask better questions",
        description: "Phrase questions with specific terms and timeframes for accurate results.",
        href: "/using-wisdom-ai-everyday/ask-better-questions",
      },
      {
        label: "Guide",
        title: "Turn answers into dashboards",
        description: "Combine visualizations and commentary into a shareable report.",
        href: "/using-wisdom-ai-everyday/turn-answers-into-dashboards",
      },
      {
        label: "Guide",
        title: "Create a Live App",
        description: "Generate an app from a plain-language prompt on your governed data.",
        href: "/live-apps/create-live-app",
      },
    ],
  };

  return (
    <div className="not-prose my-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {(steps[step] || []).map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="group flex flex-col rounded-lg border border-zinc-200 bg-white p-5 no-underline shadow-sm transition hover:border-[#5b52ff] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5b52ff] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-[#8f88ff]"
        >
          <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {item.label}
          </span>
          <span className="mt-2 text-base font-semibold text-zinc-900 group-hover:text-[#5b52ff] dark:text-zinc-100 dark:group-hover:text-[#8f88ff]">
            {item.title}
          </span>
          <span className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{item.description}</span>
        </a>
      ))}
    </div>
  );
};
