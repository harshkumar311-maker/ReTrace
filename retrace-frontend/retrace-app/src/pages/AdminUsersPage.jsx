import { useEffect, useState } from "react";
import { fetchAdminUsers } from "../services/adminUserService";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchAdminUsers();

        setUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Users
        </h1>

        {!loading && (
          <p className="text-sm text-ink-300">
            {users.length} total
          </p>
        )}
      </div>

      {loading && (
        <p className="mt-6 text-sm text-ink-500">
          Loading users...
        </p>
      )}

      {error && (
        <p className="mt-6 text-sm text-signal-rose">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="card mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Reports</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-ink-100">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 font-medium text-ink-900">
                      {user.name}
                    </td>

                    <td className="px-4 py-3 text-ink-500">
                      {user.email}
                    </td>

                    <td className="px-4 py-3 text-ink-500">
                      {user.reports}
                    </td>

                    <td className="px-4 py-3 text-ink-500">
                      {user.role}
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-signal-teal">
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="p-8 text-center text-sm text-ink-500">
                No users found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}