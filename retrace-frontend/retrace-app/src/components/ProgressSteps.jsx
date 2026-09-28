const STEPS = [
  { id: "report-type", label: "What happened" },
  { id: "category", label: "Category" },
  { id: "subcategory", label: "Item type" },
  { id: "fields", label: "Details" },
  { id: "photos", label: "Photos" },
  { id: "review", label: "Review" },
];

export default function ProgressSteps({ current }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);
  return (
    <ol className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-3 text-xs">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li key={step.id} className="flex items-center gap-2">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                done ? "bg-signal-teal text-white" : active ? "bg-indigo-500 text-white" : "bg-ink-100 text-ink-300"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>
            <span className={active ? "font-medium text-ink-900" : "text-ink-300"}>{step.label}</span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px w-4 bg-ink-100" />}
          </li>
        );
      })}
    </ol>
  );
}
