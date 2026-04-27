"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays, Plus, Search, CheckCircle2,
  ChevronRight, LayoutGrid, Loader2, Info, Image as ImageIcon
} from "lucide-react";

type Event = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
};

type EventWeek = {
  id: string;
  name: string;
  slug: string;
  eventIds: string[];
};

export default function EventWeekAdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [existingWeeks, setExistingWeeks] = useState<EventWeek[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Tworzymy mapę dla błyskawicznego dostępu do danych wydarzenia po jego ID
  const eventsMap = Object.fromEntries(events.map(e => [e.id, e]));

  const loadData = async () => {
    try {
      const [evRes, weeksRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/admin/event-week")
      ]);
      const eventsData = await evRes.json();
      const weeksData = await weeksRes.json();

      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setExistingWeeks(Array.isArray(weeksData) ? weeksData : []);
    } catch (err) {
      console.error("Błąd ładowania danych", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const toggleEvent = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!name || !slug || selected.length === 0) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/event-week", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, eventIds: selected }),
      });
      if (res.ok) {
        setName("");
        setSlug("");
        setSelected([]);
        loadData();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-full bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* KREATOR TYGODNIA */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <CalendarDays className="text-blue-600" size={28} />
                Tygodnie Targowe
              </h1>
              <p className="text-sm text-gray-500">Grupuj wydarzenia w bloki tematyczne i zarządzaj ich widocznością.</p>
            </div>
            {selected.length > 0 && (
              <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                <CheckCircle2 size={14} /> Wybrano {selected.length} wydarzeń
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Nazwa Tygodnia</label>
                  <input
                    placeholder="np. Warsaw HVAC Week"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-semibold"
                    value={name} onChange={e => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">URL Slug</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">/</span>
                    <input
                      placeholder="hvac-week"
                      className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono text-sm"
                      value={slug} onChange={e => setSlug(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={isSaving || !name || !slug || selected.length === 0}
                onClick={handleSave}
                className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg shadow-slate-200 active:scale-[0.98] disabled:opacity-20 disabled:scale-100 uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                {isSaving ? "Zapisywanie..." : "Utwórz tydzień targowy"}
              </button>
            </div>

            <div className="flex flex-col border border-gray-100 rounded-2xl bg-gray-50 overflow-hidden">
              <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dostępne wydarzenia</span>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder="Filtruj listę..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/10 transition-all w-40"
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="p-2 h-[200px] overflow-y-auto custom-scrollbar">
                {filteredEvents.map(event => (
                  <label
                    key={event.id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-1 border
                      ${selected.includes(event.id)
                        ? "bg-white border-blue-100 shadow-sm"
                        : "border-transparent hover:bg-white/50"}`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all
                      ${selected.includes(event.id) ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"}`}
                    >
                      {selected.includes(event.id) && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <span className={`text-sm font-bold truncate ${selected.includes(event.id) ? "text-blue-600" : "text-gray-600"}`}>
                      {event.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LISTA TYGODNI */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Zdefiniowane tygodnie</h2>
            <LayoutGrid size={16} className="text-gray-400" />
          </div>

          <ul className="divide-y divide-gray-100">
            {loading ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : existingWeeks.map(week => (
              <li key={week.id} className="group hover:bg-slate-50 transition-all">
                <Link href={`/admin/event-week/${week.id}`} className="flex items-center justify-between px-8 py-6">
                  <div className="flex items-center gap-6">
                    {/* Licznik eventów w formie kafelka */}
                    <div className="w-14 h-14 rounded-2xl bg-white border-2 border-gray-100 text-slate-400 flex flex-col items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                      <span className="text-lg font-black leading-none">{week.eventIds.length}</span>
                      <span className="text-[8px] font-bold uppercase tracking-tighter">Eventów</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg tracking-tight">
                        {week.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">
                          /{week.slug}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight italic">
                          ID: {week.id.substring(0, 8)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    {/* AVATARY WYDARZEŃ ZE ZDJĘCIAMI */}
                    <div className="hidden md:flex -space-x-3">
                      {week.eventIds.slice(0, 4).map((eventId) => {
                        const eventData = eventsMap[eventId];
                        return (
                          <div
                            key={eventId}
                            className="w-10 h-10 rounded-xl bg-white border-2 border-gray-100 overflow-hidden shadow-sm flex items-center justify-center group-hover:border-blue-200 transition-all"
                            title={eventData?.name}
                          >
                            {eventData?.imageUrl ? (
                              <img
                                src={eventData.imageUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                <ImageIcon size={14} className="text-slate-300" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {week.eventIds.length > 4 && (
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm z-10">
                          +{week.eventIds.length - 4}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </li>
            ))}

            {!loading && existingWeeks.length === 0 && (
              <li className="p-20 text-center">
                <div className="text-4xl mb-4 opacity-20">📅</div>
                <p className="text-gray-400 font-medium">Brak zdefiniowanych tygodni targowych.</p>
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}