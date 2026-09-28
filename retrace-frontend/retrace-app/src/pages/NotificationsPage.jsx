import { useEffect, useState } from "react";
import { fetchNotifications } from "../services/notificationService";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNotifications() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchNotifications();

        setNotifications(data);
      } catch (error) {
        console.error("Failed to load notifications:", error);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  function getIcon(type) {
    if (type === "match") return "🔎";
    if (type === "success") return "✅";
    if (type === "warning") return "⚠️";
    if (type === "claim") return "📄";

    return "🔔";
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink-900">
        Notifications
      </h1>

      {loading && (
        <div className="card mt-6 p-6 text-sm text-ink-500">
          Loading notifications...
        </div>
      )}

      {error && (
        <div className="card mt-6 p-6 text-sm text-signal-rose">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="card mt-6 overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-ink-500">
                You have no notifications yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-ink-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex gap-4 p-5"
                >
                  <div className="text-xl">
                    {getIcon(notification.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink-900">
                      {notification.title}
                    </p>

                    <p className="mt-1 text-sm text-ink-500">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-ink-300">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}