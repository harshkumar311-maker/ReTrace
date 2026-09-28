import { Link, NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/claims", label: "Claims" },
  { to: "/admin/users", label: "Users" },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500 font-display text-sm font-bold">R</span>
          <span className="font-display text-lg font-semibold">ReTrace <span className="text-ink-300 font-normal">Admin</span></span>
        </Link>
        <Link to="/" className="text-sm text-ink-300 hover:text-white">Exit admin</Link>
      </div>
      <div className="mx-auto max-w-6xl px-6">
        <nav className="mb-8 flex gap-1 border-b border-white/10">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive ? "border-indigo-400 text-white" : "border-transparent text-ink-300 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="pb-16 text-ink-900">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
