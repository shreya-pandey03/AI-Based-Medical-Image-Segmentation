import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-white">404</p>

        <h1 className="mt-4 text-2xl font-semibold text-white">
          Page not found
        </h1>

        <p className="mt-2 text-slate-400">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
