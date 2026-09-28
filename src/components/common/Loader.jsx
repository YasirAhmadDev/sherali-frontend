export default function Loader({ fullScreen = false, label = "Loading..." }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3 text-muted">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-light" />
      <span className="text-sm">{label}</span>
    </div>
  );

  if (fullScreen) {
    return <div className="flex h-screen items-center justify-center bg-app">{spinner}</div>;
  }
  return <div className="flex justify-center py-12">{spinner}</div>;
}