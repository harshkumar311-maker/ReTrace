import { Link } from "react-router-dom";

const FLOW = ["Lost item", "ReTrace matching engine", "Possible match", "Ownership verification", "Recovery"];

const STEPS = [
  { n: "01", title: "Report", body: "Tell ReTrace what happened — what you lost or found, and where." },
  { n: "02", title: "Match", body: "ReTrace compares relevant details between lost and found reports." },
  { n: "03", title: "Recover", body: "Verify ownership and safely reconnect with the item." },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div>
            <h1 className="max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl">
              Lost something? Let ReTrace find the connection.
            </h1>
            <p className="mt-5 max-w-md text-lg text-ink-500">
              ReTrace intelligently connects lost and found reports to help people recover what matters.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/report?type=lost" className="btn-primary">Report lost item</Link>
              <Link to="/report?type=found" className="btn-secondary">Report found item</Link>
            </div>
          </div>

          <div className="card p-6">
            <p className="mb-5 text-xs font-medium uppercase tracking-wide text-ink-300">How a recovery happens</p>
            <ol className="space-y-0">
              {FLOW.map((step, i) => (
                <li key={step} className="relative flex items-center gap-4 pb-6 last:pb-0">
                  {i < FLOW.length - 1 && (
                    <span className="absolute left-[15px] top-8 h-full w-px bg-ink-100" />
                  )}
                  <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                    {i + 1}
                  </span>
                  <span className="font-medium text-ink-900">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-ink-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-2xl font-semibold text-ink-900">How it works</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="font-display text-sm font-semibold text-indigo-500">{s.n}</p>
                <p className="mt-2 font-display text-lg font-semibold text-ink-900">{s.title}</p>
                <p className="mt-1.5 text-sm text-ink-500">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category preview */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-2xl font-semibold text-ink-900">Report exactly what you lost</h2>
        <p className="mt-2 max-w-lg text-sm text-ink-500">
          Select a category and ReTrace only asks for the details relevant to that specific item — nothing more.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {[
            ["📱", "Electronics"], ["👛", "Wallet / Money"], ["🎒", "Bags"], ["📄", "Documents"],
            ["🔑", "Keys"], ["💍", "Jewelry"], ["👕", "Clothing"], ["📚", "Books"],
            ["🎮", "Gaming"], ["🧸", "Other"],
          ].map(([icon, label]) => (
            <div key={label} className="card flex flex-col items-center gap-2 px-3 py-5 text-center">
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-medium text-ink-500">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-ink-100 bg-ink-900">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">Every report brings someone closer to getting their item back.</h2>
          </div>
          <Link to="/report" className="btn-primary shrink-0">Start a report</Link>
        </div>
      </section>
    </>
  );
}
