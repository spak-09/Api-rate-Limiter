import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { styles } from "../style.js";

// navLinks will be computed based on auth state inside the component

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { token, clearAuth } = useAuthStore();

  const navLinks = token
    ? [{ label: "Dashboard", to: "/dashboard" }]
    : [{ label: "Home", to: "/" }];

  const brandLink = token ? "/dashboard" : "/";

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-[#0F1117]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link to={brandLink} className="text-lg font-semibold uppercase tracking-[0.3em] text-text">
          Api-rate-Limiter
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "text-accent font-semibold" : "text-text/70 hover:text-text"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {token ? (
            <button
              onClick={clearAuth}
              className="rounded-2xl border border-border px-4 py-2 text-sm text-text transition hover:border-accent hover:text-white"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Login
            </Link>
          )}

          <button
            onClick={() => setOpen((prev) => !prev)}
            className="md:hidden rounded-2xl border border-border px-3 py-2 text-text"
          >
            Menu
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-surface/95 p-4 md:hidden">
          <div className="space-y-3">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-text transition hover:bg-[#1E2532]"
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
