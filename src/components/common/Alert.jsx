const STYLES = {
  error: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
  success: "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300",
  info: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
};

export default function Alert({ variant = "error", children, className = "" }) {
  return (
    <div role="alert" className={`rounded-lg border px-3 py-2 text-sm ${STYLES[variant]} ${className}`}>
      {children}
    </div>
  );
}