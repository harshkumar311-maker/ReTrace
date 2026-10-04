import { useState } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    logoutUser();
    setMobileMenuOpen(false);
    navigate("/login");
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={closeMobileMenu}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500 font-display text-sm font-bold text-white">
            R
          </span>

          <span className="font-display text-lg font-semibold tracking-tight">
            ReTrace
          </span>
        </Link>

        {/* Desktop Navigation */}
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

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {/* User name */}
              <span className="text-sm font-medium text-ink-600">
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
              <Link
                to="/login"
                className="text-sm font-medium text-ink-500 hover:text-ink-900"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-sm font-medium text-ink-500 hover:text-ink-900"
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-ink-200 text-ink-600 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <span className="text-xl">✕</span>
          ) : (
            <span className="text-xl">☰</span>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-ink-100 bg-paper px-4 py-4 md:hidden">
          
          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-ink-600 hover:bg-ink-50"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          {user ? (
            <div className="mt-3 border-t border-ink-100 pt-3">
              
              <div className="mb-3 px-4 text-sm font-medium text-ink-600">
                Hi, {user.name}
              </div>

              {/* Admin */}
              {user.role === "ADMIN" && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="block rounded-md px-4 py-3 text-sm font-medium text-ink-600 hover:bg-ink-50"
                >
                  Admin
                </Link>
              )}

              {/* Report */}
              <Link
                to="/report"
                onClick={closeMobileMenu}
                className="mt-1 block rounded-md px-4 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                Report an item
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="mt-1 w-full rounded-md px-4 py-3 text-left text-sm font-medium text-ink-600 hover:bg-ink-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-3 border-t border-ink-100 pt-3">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block rounded-md px-4 py-3 text-sm font-medium text-ink-600 hover:bg-ink-50"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="block rounded-md px-4 py-3 text-sm font-medium text-ink-600 hover:bg-ink-50"
              >
                Register
              </Link>

              <Link
                to="/report"
                onClick={closeMobileMenu}
                className="mt-1 block rounded-md px-4 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                Report an item
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}