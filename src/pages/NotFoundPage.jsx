import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-app p-6 text-center">
      <p className="text-6xl font-bold text-accent">404</p>
      <h1 className="text-xl font-semibold text-fg">Page not found</h1>
      <p className="max-w-sm text-sm text-muted">The page you are looking for does not exist or was moved.</p>
      <Link to="/dashboard" className="mt-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700">
        Go to dashboard
      </Link>
    </div>
  );
}