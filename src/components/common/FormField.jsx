// Shared input styles. Use them on <input>, <select> and <textarea>.
//   inputBase  -> no horizontal padding (add your own, for inputs with icons)
//   inputClass -> ready to use, normal padding
export const inputBase =
  "w-full rounded-lg border border-line bg-app py-2.5 text-sm text-fg placeholder:text-subtle outline-none transition focus:border-brand focus:ring-1 focus:ring-brand disabled:opacity-60";
export const inputClass = `${inputBase} px-3`;

export default function FormField({ label, htmlFor, error, hint, required = false, children }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-muted">
          {label}
          {required && <span className="ms-1 text-red-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-subtle">{hint}</p>}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}