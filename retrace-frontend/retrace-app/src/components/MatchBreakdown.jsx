import { strengthTone } from "../utils/format";

export default function MatchBreakdown({ breakdown }) {
  return (
    <div className="card p-5">
      <p className="mb-4 font-display text-base font-semibold text-ink-900">Why this may be a match</p>
      <ul className="space-y-3">
        {breakdown.map((row) => (
          <li key={row.signal} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink-900">
                {row.strength !== "Not applicable" && row.strength !== "Weak" ? "✓ " : ""}
                {row.signal}
              </p>
              <p className="text-xs text-ink-300">{row.note}</p>
            </div>
            <span className={`shrink-0 rounded-sm px-2 py-1 text-xs font-medium ${strengthTone(row.strength)}`}>
              {row.strength}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
