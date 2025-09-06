export const HomeBanner = () => {
  return (
    <section className="w-full flex justify-center py-16">
      <div className="max-w-[1376px] w-full flex flex-col items-center text-center px-4">
        {/* Logo */}
        <img noZoom src="/images/home/light/logo.svg" alt="WisdomAI Logo" className=" dark:hidden" />
        <img noZoom src="/images/home/dark/logo.svg" alt="WisdomAI Logo Dark" className=" hidden dark:block" />

        {/* Subtitle */}
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
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

export const HomeCard = ({
  title = "Getting started",
  description = "Start utilizing the platform’s features effectively.",
  src = "/images/home/cards/getting-started-light.png",
  darkSrc = "/images/home/cards/getting-started-dark.png",
  href = "#",
  children,
}) => {
  return (
    <a
      href={href}
      className="mt-4 group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
    >
      {/* Image (light/dark swap) */}
      <div className="relative w-full">
        <img src={src} alt={title} className="w-full object-cover dark:hidden" noZoom />
        <img src={darkSrc} alt={title} className="hidden w-full object-cover dark:block" noZoom />
      </div>

      {/* Text area */}
      <div className="p-5">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description || children}</p>
      </div>
    </a>
  );
};
