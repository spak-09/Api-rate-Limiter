import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";

export const Sidebar = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const role = currentUser?.role ?? "user";

  const sections = [
    { label: "Analytics", to: "/analytics" },
    ...(role === "admin"
      ? [
          { label: "Admin", to: "/admin" },
          { label: "Settings", to: "/settings" },
        ]
      : []),
    { label: "Profile", to: "/profile" },
  ];

  return (
    <aside className="hidden w-72 shrink-0 space-y-6 border-r border-border bg-surface p-6 lg:block">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-[#8B95AE]">Navigation</p>
        {sections.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-3xl px-4 py-3 text-sm transition ${
                isActive ? "bg-[#202636] text-white" : "text-text/80 hover:bg-[#202636]"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};
