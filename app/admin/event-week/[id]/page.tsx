"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Event = {
  id: string;
  name: string;
  imageUrl?: string;
};

export default function EditEventWeekPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evRes, weekRes] = await Promise.all([
          fetch("/api/events"),
          fetch(`/api/admin/event-week/${id}`)
        ]);

        const weekData = await weekRes.json();
        setEvents(await evRes.json());

        setName(weekData.name);
        setSlug(weekData.slug);
        setSelected(weekData.eventIds || []);
      } catch (err) {
        console.error("Błąd ładowania", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleEvent = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/event-week/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, eventIds: selected }),
      });
      if (res.ok) {
        router.push("/admin/event-week");
        router.refresh();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Czy na pewno chcesz usunąć ten tydzień targowy?")) return;
    const res = await fetch(`/api/admin/event-week/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/event-week");
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-sm font-bold text-gray-400 animate-pulse uppercase tracking-widest">Wczytywanie ustawień...</div>
    </div>
  );

  const filteredEvents = events.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Link
              href="/admin/event-week"
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-100 transition-all border border-gray-200 text-gray-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edytuj Tydzień</h1>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-0.5">Modyfikujesz zasób: {id.substring(0, 12)}...</p>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
          >
            Usuń definicję
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">Nazwa wyświetlana</label>
                  <input
                    className="w-full bg-gray-50 px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                    value={name} onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">Slug (identyfikator URL)</label>
                  <input
                    className="w-full bg-gray-50 px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white outline-none transition-all font-mono text-sm"
                    value={slug} onChange={e => setSlug(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Przypisane wydarzenia</h3>
                <div className="relative w-full md:w-64">
                  <input
                    placeholder="Filtruj listę..."
                    className="w-full bg-gray-50 px-4 py-2 rounded-lg text-xs outline-none border border-gray-100 focus:border-blue-300"
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredEvents.map(event => {
                  const isChecked = selected.includes(event.id);
                  return (
                    <label
                      key={event.id}
                      className={`flex items-center justify-between gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${isChecked ? "bg-blue-50/50 border-blue-500" : "bg-white border-gray-50 hover:border-gray-100"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleEvent(event.id)}
                        className="w-5 h-5 accent-blue-600 rounded"
                      />
                      <span className={`text-sm font-bold truncate ${isChecked ? "text-blue-900" : "text-gray-600"}`}>
                        {event.name}
                      </span>
                      <span className="w-10 h-10 rounded-xl border-2 border-gray-100 overflow-hidden">
                        <img
                          src={event.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm sticky top-8 space-y-8">
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Podsumowanie zmian</p>
                <h2 className="text-xl font-bold text-gray-900 leading-tight">{name || "Bez nazwy"}</h2>
                <p className="text-xs text-gray-400 font-mono mt-1 break-all">/week/{slug || "..."}</p>
              </div>

              <div className="py-6 border-y border-gray-50 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Wybrano</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-gray-900">{selected.length}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Wydarzeń</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleUpdate}
                  disabled={isSaving || !name || !slug || selected.length === 0}
                  className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold uppercase text-[11px] tracking-widest shadow-lg shadow-gray-200 transition-all active:scale-95 disabled:opacity-20 disabled:shadow-none"
                >
                  {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
                </button>
                <Link
                  href="/admin/event-week"
                  className="block w-full text-center py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                >
                  Anuluj i wróć
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}