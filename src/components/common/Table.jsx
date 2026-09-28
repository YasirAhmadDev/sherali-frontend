// Shared table wrapper (scrolls sideways on small screens) and cell styles.
//   <Table><thead>...<th className={thClass}>  <tbody>...<td className={tdClass}>
export const thClass =
  "whitespace-nowrap px-3 py-3 text-start text-xs font-medium uppercase tracking-wide text-muted";
export const tdClass = "px-3 py-3 text-sm";

export default function Table({ children, className = "" }) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-line bg-card ${className}`}>
      <table className="w-full">{children}</table>
    </div>
  );
}