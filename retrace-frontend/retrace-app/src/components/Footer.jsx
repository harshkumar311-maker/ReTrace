export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-ink-500">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-indigo-500 font-display text-xs font-bold text-white">R</span>
            <span className="font-medium text-ink-700">ReTrace</span>
          </div>
          <p>Built to reconnect people with what they've lost — privately and carefully.</p>
        </div>
      </div>
    </footer>
  );
}
