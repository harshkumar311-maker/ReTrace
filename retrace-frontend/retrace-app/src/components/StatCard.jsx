export default function StatCard({ label, value, tone = "default" }) {
  const toneClass = {
    default: "text-ink-900",
    teal: "text-signal-teal",
    amber: "text-signal-amber",
    rose: "text-signal-rose",
  }[tone];
  return (
    <div className="card p-5">
      <p className="text-sm text-ink-300">{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}
