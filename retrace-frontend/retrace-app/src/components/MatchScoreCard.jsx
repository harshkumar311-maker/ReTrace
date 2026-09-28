import { scoreTone } from "../utils/format";

export default function MatchScoreCard({ score }) {
  const tone = scoreTone(score);
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#E4E6EC" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="42" fill="none"
            stroke={tone.ring} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold text-ink-900">{score}%</span>
        </div>
      </div>
      <span className="text-sm font-medium" style={{ color: tone.ring }}>{tone.label}</span>
    </div>
  );
}
