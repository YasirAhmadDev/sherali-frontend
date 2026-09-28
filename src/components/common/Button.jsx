const VARIANTS = {
  primary: "bg-brand text-white hover:bg-green-700 dark:hover:bg-brand-light",
  secondary: "border border-line bg-card text-fg hover:bg-line",
  danger: "bg-red-600 text-white hover:bg-red-500",
  ghost: "text-muted hover:bg-line hover:text-fg",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

// icon = a lucide icon component, e.g. <Button icon={Plus}>Add</Button>
export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  type = "button",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/40 border-t-current" />
      ) : (
        Icon && <Icon size={18} />
      )}
      {children}
    </button>
  );
}