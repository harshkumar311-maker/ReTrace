export function formatDate(isoDate) {
  if (!isoDate) return "";
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatTime(time24) {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  if (Number.isNaN(h)) return time24;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function strengthTone(strength) {
  switch (strength) {
    case "Strong":
      return "text-signal-teal bg-signal-teal/10";
    case "Moderate":
      return "text-signal-amber bg-signal-amber/10";
    case "Weak":
      return "text-signal-rose bg-signal-rose/10";
    default:
      return "text-ink-300 bg-ink-50";
  }
}

export function scoreTone(score) {
  if (score >= 80) return { ring: "#0E8F72", label: "Strong possible match" };
  if (score >= 55) return { ring: "#B9740B", label: "Possible match" };
  return { ring: "#C0405A", label: "Weak possible match" };
}

export function titleCase(str) {
  return (str || "").replace(/(^|[\s-])\S/g, (c) => c.toUpperCase());
}
