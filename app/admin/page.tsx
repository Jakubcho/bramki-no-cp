"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const { data: session } = useSession();


  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(setEvents);
  }, []);

  async function createEvent() {
    await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    location.reload();
  }
  async function deleteEvent(id: string) {
    if (!confirm("Usunąć wydarzenie?")) return;

    await fetch(`/api/admin/events/${id}`, {
      method: "DELETE",
    });

    location.reload();
  }

  return (
    <div className="min-h-full bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Wydarzenia</h1>
              <p className="text-sm text-gray-500">Zarządzaj nadchodzącymi eventami i ich parametrami.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <input
              placeholder="Nazwa wydarzenia"
              className="flex-1 min-w-[200px] px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              onChange={e => setName(e.target.value)}
            />
            <input
              placeholder="URL (slug)"
              className="flex-1 min-w-[150px] px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono text-sm"
              onChange={e => setSlug(e.target.value)}
            />
            <button
              disabled={!name.trim() || !slug.trim()}
              onClick={createEvent}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm active:scale-95"
            >
              Dodaj wydarzenie
            </button>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Twoje wydarzenia</h2>
          </div>

          <ul className="divide-y divide-gray-100 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {events.map(e => (
              <li key={e.id} className="group hover:bg-slate-50 transition-all duration-200">
                <div className="flex items-center">
                  <Link
                    href={`/admin/events/${e.id}`}
                    className="flex-1 flex items-center justify-between px-6 py-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        {e.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {e.name}
                        </p>
                        <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                          <span className="opacity-50">slug:</span>
                          <span className="bg-slate-100 px-1 rounded uppercase tracking-wider text-[10px]">{e.slug}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Aktywne
                      </span>
                      <svg className="w-5 h-5 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>

                  {session?.user.role === "ADMIN" && (
                    <div className="pr-6">
                      <button
                        onClick={() => {
                          if (confirm('Czy na pewno chcesz usunąć to wydarzenie?')) deleteEvent(e.id);
                        }}
                        className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group/btn"
                        title="Usuń wydarzenie"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2m3 3h7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}

            {events.length === 0 && (
              <li className="p-16 text-center">
                <div className="text-4xl mb-4">empty_icon</div>
                <p className="text-slate-400 font-medium">Brak zarejestrowanych wydarzeń.</p>
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
