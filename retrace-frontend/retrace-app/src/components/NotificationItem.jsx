import { Link } from "react-router-dom";

export default function NotificationItem({ notification }) {
  return (
    <Link
      to={notification.linkTo}
      className={`flex items-start gap-4 border-b border-ink-100 px-5 py-4 transition-colors last:border-0 hover:bg-ink-50 ${
        !notification.read ? "bg-indigo-50/40" : ""
      }`}
    >
      <span className="text-xl">{notification.icon}</span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-ink-900">{notification.title}</p>
        <p className="mt-0.5 text-sm text-ink-500">{notification.body}</p>
        <p className="mt-1 text-xs text-ink-300">{notification.time}</p>
      </div>
      {!notification.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />}
    </Link>
  );
}
