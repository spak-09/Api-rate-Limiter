import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-16">
      <div className="rounded-[2rem] border border-border bg-surface/90 p-12 text-center shadow-glow">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">404 error</p>
        <h1 className="mt-6 text-5xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-[#B7C0D9]">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="mt-8 inline-flex rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
          Return home
        </Link>
      </div>
    </div>
  );
};
