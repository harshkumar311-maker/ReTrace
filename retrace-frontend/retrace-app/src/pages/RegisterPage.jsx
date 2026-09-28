import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await registerUser(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-paper px-6 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-lg border border-ink-100 bg-white p-8 shadow-sm">

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 font-display text-lg font-bold text-white">
              R
            </div>

            <h1 className="font-display text-2xl font-semibold text-ink-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-ink-500">
              Join ReTrace and start recovering lost items
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-ink-700"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full rounded-md border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-ink-700"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-md border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-ink-700"
              >
                Phone number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full rounded-md border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-ink-700"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                minLength={6}
                required
                className="w-full rounded-md border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
              />

              <p className="mt-1.5 text-xs text-ink-400">
                Password must be at least 6 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}