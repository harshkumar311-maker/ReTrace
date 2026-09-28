import PrivateBadge from "./PrivateBadge";

export default function DynamicField({ field, value, onChange }) {
  const common = {
    id: field.name,
    name: field.name,
    required: !!field.required,
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={field.name} className="label">
          {field.label} {field.required && <span className="text-signal-rose">*</span>}
        </label>
        {field.type === "private-text" && <PrivateBadge />}
      </div>

      {field.type === "textarea" && (
        <textarea
          {...common}
          rows={3}
          placeholder={field.placeholder}
          className="input resize-none"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "select" && (
        <select
          {...common}
          className="input"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>Select an option</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {field.type === "toggle" && (
        <div className="flex gap-2">
          {["Yes", "No"].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`rounded-sm border px-4 py-2 text-sm font-medium transition-colors ${
                value === opt
                  ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                  : "border-ink-100 text-ink-500 hover:border-indigo-300"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {field.type === "number" && (
        <input
          {...common}
          type="number"
          min="0"
          placeholder={field.placeholder}
          className="input"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "date" && (
        <input
          {...common}
          type="date"
          className="input"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "time" && (
        <input
          {...common}
          type="time"
          className="input"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {(field.type === "text" || field.type === "private-text") && (
        <input
          {...common}
          type="text"
          placeholder={field.placeholder}
          className="input"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.helper && <p className="mt-1.5 text-xs text-ink-300">{field.helper}</p>}
    </div>
  );
}
