import { Link, NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/authService";

const navLinks = [
  { to: "/browse", label: "Browse" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/notifications", label: "Notifications" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500 font-display text-sm font-bold text-white">
            R
          </span>

          <span className="font-display text-lg font-semibold tracking-tight">
            ReTrace
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-indigo-600"
                    : "text-ink-500 hover:text-ink-900"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {user ? (
            <>
              {/* User name */}
              <span className="hidden text-sm font-medium text-ink-600 sm:block">
                Hi, {user.name}
              </span>

              {/* Admin */}
              {user.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-ink-500 hover:text-ink-900"
                >
                  Admin
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="rounded-md border border-ink-200 px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:border-ink-300 hover:text-ink-900"
              >
                Logout
              </button>

              {/* Report */}
              <Link
                to="/report"
                className="btn-primary !px-4 !py-2 text-sm"
              >
                Report an item
              </Link>
            </>
          ) : (
            <>
              {/* Logged out */}
              <Link
                to="/login"
                className="text-sm font-medium text-ink-500 hover:text-ink-900"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="hidden text-sm font-medium text-ink-500 hover:text-ink-900 sm:block"
              >
                Register
              </Link>

              <Link
                to="/report"
                className="btn-primary !px-4 !py-2 text-sm"
              >
                Report an item
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
}