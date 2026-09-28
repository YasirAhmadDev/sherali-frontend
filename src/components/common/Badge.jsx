const COLORS = {
  green: "bg-green-500/15 text-green-700 dark:text-green-400",
  yellow: "bg-yellow-400/20 text-yellow-800 dark:text-yellow-300",
  red: "bg-red-500/15 text-red-700 dark:text-red-400",
  blue: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  gray: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
};

export default function Badge({ color = "gray", children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${COLORS[color]} ${className}`}
    >
      {children}
    </span>
  );
}