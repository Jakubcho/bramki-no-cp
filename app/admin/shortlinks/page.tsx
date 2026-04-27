"use client";

import { useState, useEffect } from "react";
import {
  Link2, Plus, Trash2, ExternalLink,
  AlertCircle, Loader2, ArrowRight, MousePointer2
} from "lucide-react";

export default function ShortLinksPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newCode, setNewCode] = useState("");
  const [newDest, setNewDest] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/admin/shortlinks");
      const data = await res.json();
      setLinks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Nie udało się pobrać linków");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLinks(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/shortlinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: newCode, destination: newDest, description: newDesc }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Błąd zapisu");

      setLinks([data, ...links]);
      setNewCode(""); setNewDest(""); setNewDesc("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Czy na pewno usunąć ten skrót?")) return;
    try {
      await fetch(`/api/admin/shortlinks?id=${id}`, { method: "DELETE" });
      setLinks(links.filter(l => l.id !== id));
    } catch (err) {
      alert("Błąd usuwania");
    }
  };

  return (
    <div className="min-h-full bg-gray-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Link2 className="text-blue-600" size={28} />
              Przekierowania (Shortlinks)
            </h1>
            <p className="text-sm text-gray-500">Twórz krótkie kody (np. /vip) dla kiosków i kampanii marketingowych.</p>
          </div>

          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-3">
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2 ml-1">Krótki Kod</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono">/</span>
                <input
                  value={newCode} onChange={e => setNewCode(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold transition-all"
                  placeholder="kod" required
                />
              </div>
            </div>
            <div className="md:col-span-6">
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2 ml-1">Cel przekierowania</label>
              <input
                value={newDest} onChange={e => setNewDest(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                placeholder="https://... lub /aktywacja" required
              />
            </div>
            <button className="md:col-span-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95">
              <Plus size={18} />
              Dodaj Link
            </button>
          </form>
          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-500 text-[11px] font-bold uppercase bg-red-50 p-2 rounded-lg border border-red-100">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Zdefiniowane skróty</h2>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] bg-blue-50 px-2 py-1 rounded-md">
              <MousePointer2 size={12} />
              SYSTEM ACTIVE
            </div>
          </div>

          <ul className="divide-y divide-gray-100">
            {loading ? (
              <div className="flex justify-center p-16"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : links.map(link => (
              <li key={link.id} className="group hover:bg-slate-50 transition-all duration-200">
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-6">

                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-sm border border-blue-100 group-hover:border-blue-300 transition-all">
                      /{link.code}
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-800 text-lg tracking-tight italic uppercase">
                          {link.code}
                        </span>
                        <ArrowRight size={16} className="text-slate-300" />
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">
                          {link.destination}
                        </code>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5 tracking-wide">
                        Utworzono: {new Date(link.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={link.destination}
                      target="_blank"
                      className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Otwórz link"
                    >
                      <ExternalLink size={20} />
                    </a>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                      title="Usuń skrót"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </li>
            ))}

            {!loading && links.length === 0 && (
              <li className="p-16 text-center">
                <div className="text-4xl mb-4 text-slate-200 opacity-50">🔗</div>
                <p className="text-slate-400 font-medium">Brak zdefiniowanych przekierowań.</p>
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}