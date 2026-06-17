export const HomeBanner = () => {
  return (
    <section className="w-full flex justify-center py-6">
      <div className="max-w-[1376px] w-full flex flex-col items-center text-center px-4">
        {/* Logo */}
        <img noZoom src="/images/home/light/logo.svg" alt="WisdomAI Logo" className="h-16 w-auto dark:hidden" />
        <img noZoom src="/images/home/dark/logo.svg" alt="WisdomAI Logo Dark" className="h-16 w-auto hidden dark:block" />

        {/* Subtitle */}
        <p className="mt-3 text-base text-gray-600 dark:text-gray-300 max-w-2xl">
          Dive into Our Docs and Start Building with Trusted, <br />
          AI-Powered Business Logic
        </p>
      </div>
    </section>
  );
};

export const PageWrapper = ({ children }) => {
  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-[1376px]">{children}</div>
    </div>
  );
};

export const McpBanner = () => {
  return (
    <div className="w-full flex justify-center px-4 mt-4 mb-6">
      <div
        className="w-full max-w-[1376px] flex items-center justify-between gap-4 rounded-2xl border-2 border-[#5b52ff] px-6 py-5"
        style={{ background: "linear-gradient(135deg, #6c63ff 0%, #5b52ff 100%)" }}
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="6" width="18" height="13" rx="2" stroke="white" strokeWidth="1.5"/>
              <circle cx="8.5" cy="11.5" r="1.5" fill="white"/>
              <circle cx="15.5" cy="11.5" r="1.5" fill="white"/>
              <path d="M9 15c.833.667 1.667 1 3 1s2.167-.333 3-1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8 6V4M16 6V4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-bold text-lg">Get AI-powered help with our MCP Server</span>
            </div>
            <p className="text-white/80 text-sm m-0">
              Connect your AI assistant to WisdomAI and get instant answers from your business data.
            </p>
          </div>
        </div>
        <a
          href="/integrations/mcp-server/MCP-Server"
          className="flex-shrink-0 text-white font-bold px-5 py-2.5 rounded-lg whitespace-nowrap no-underline transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#60a5fa" }}
        >
          Connect Now
        </a>
      </div>
    </div>
  );
};

export const HomeCard = ({
  title = "Getting started",
  description = "Start utilizing the platform’s features effectively.",
  src = "/images/home/cards/getting-started-light.png",
  darkSrc = "/images/home/cards/getting-started-dark.png",
  href = "#",
  children,
  badge,
  objectPosition = "top",
}) => {
  return (
    <a
      href={href}
      className="mt-2 group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
    >
      {/* Image (light/dark swap) */}
      <div className="relative w-full overflow-hidden max-h-[130px] lg:max-h-[180px] xl:max-h-[220px]">
        <img src={src} alt={title} className="m-0 w-full object-cover dark:hidden" style={{objectPosition}} noZoom />
        <img src={darkSrc} alt={title} className="m-0 hidden w-full object-cover dark:block" style={{objectPosition}} noZoom />
      </div>

      {/* Text area */}
      <div className="p-4">
        <span className="flex items-center gap-2 mb-2">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 m-0">{title}</h3>
          {badge && (
            <Badge color="green" size="sm">
              New
            </Badge>
          )}
        </span>
        <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description || children}</p>
      </div>
    </a>
  );
};
