export default function ReportTypeSelector({ value, onSelect }) {
  const options = [
    {
      id: "lost",
      title: "I lost something",
      body: "Tell ReTrace what you lost, and where you last had it.",
      icon: "🔍",
    },
    {
      id: "found",
      title: "I found something",
      body: "Help ReTrace return this item to whoever lost it.",
      icon: "🤝",
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`card flex flex-col items-start gap-3 p-6 text-left transition-all hover:border-indigo-400 ${
              active ? "border-indigo-500 ring-1 ring-indigo-500" : ""
            }`}
          >
            <span className="text-3xl">{opt.icon}</span>
            <span className="font-display text-lg font-semibold">{opt.title}</span>
            <span className="text-sm text-ink-500">{opt.body}</span>
          </button>
        );
      })}
    </div>
  );
}
