import { useEffect, useState } from "react";
import { CATEGORIES } from "../data/categories";
import { fetchFoundItems } from "../services/itemService";
import ItemCard from "../components/ItemCard";

export default function SearchBrowsePage() {
  const [filters, setFilters] = useState({ category: "", subcategory: "", brand: "", color: "", location: "", date: "" });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = CATEGORIES.find((c) => c.id === filters.category);

  useEffect(() => {
    setLoading(true);
    fetchFoundItems(filters).then((res) => { setItems(res); setLoading(false); });
  }, [filters]);

  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Browse found items</h1>
      <p className="mt-1.5 text-sm text-ink-500">Personal contact details, serial numbers and document numbers are never shown here.</p>

      <div className="mt-6 grid gap-4 rounded-lg border border-ink-100 bg-white p-5 sm:grid-cols-3 lg:grid-cols-6">
        <select className="input" value={filters.category} onChange={(e) => update({ category: e.target.value, subcategory: "" })}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select className="input" value={filters.subcategory} onChange={(e) => update({ subcategory: e.target.value })} disabled={!category}>
          <option value="">All types</option>
          {category?.subcategories.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <input className="input" placeholder="Brand" value={filters.brand} onChange={(e) => update({ brand: e.target.value })} />
        <input className="input" placeholder="Color" value={filters.color} onChange={(e) => update({ color: e.target.value })} />
        <input className="input" placeholder="Location" value={filters.location} onChange={(e) => update({ location: e.target.value })} />
        <input className="input" type="date" value={filters.date} onChange={(e) => update({ date: e.target.value })} />
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-ink-300">Searching…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-ink-300">No found items match those filters yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((i) => <ItemCard key={i.id} item={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
