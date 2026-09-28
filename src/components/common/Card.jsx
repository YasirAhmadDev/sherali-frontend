export default function Card({ title, action, children, className = "" }) {
  const hasHeader = Boolean(title || action);

  return (
    <section className={`rounded-xl border border-line bg-card shadow-sm dark:shadow-none ${className}`}>
      {hasHeader && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 sm:px-5 sm:pt-5">
          <h2 className="font-semibold text-fg">{title}</h2>
          {action}
        </div>
      )}
      <div className={`p-4 sm:p-5 ${hasHeader ? "pt-3 sm:pt-4" : ""}`}>{children}</div>
    </section>
  );
}