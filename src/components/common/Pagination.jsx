import { ChevronLeft, ChevronRight } from "lucide-react";

const pageButton =
  "flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";

export default function Pagination({ page, pages, total, limit, onPageChange }) {
  if (!total) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Show up to 5 page numbers around the current page
  const start = Math.max(1, Math.min(page - 2, pages - 4));
  const end = Math.min(pages, start + 4);
  const numbers = [];
  for (let i = start; i <= end; i++) numbers.push(i);

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-muted">
        Showing {from}-{to} of {total}
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={`${pageButton} border-line bg-card text-fg hover:bg-line`}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} className="rtl:rotate-180" />
        </button>

        {/* Phones: just "Page x of y". Larger screens: numbers */}
        <span className="px-2 text-sm text-muted sm:hidden">
          Page {page} of {pages}
        </span>
        {numbers.map((n) => (
          <button
            key={n}
            onClick={() => onPageChange(n)}
            className={`${pageButton} hidden sm:flex ${
              n === page
                ? "border-brand bg-brand text-white"
                : "border-line bg-card text-fg hover:bg-line"
            }`}
          >
            {n}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className={`${pageButton} border-line bg-card text-fg hover:bg-line`}
          aria-label="Next page"
        >
          <ChevronRight size={16} className="rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}