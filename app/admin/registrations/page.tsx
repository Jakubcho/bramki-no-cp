"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, RotateCcw, User, CheckCircle2, Circle, Loader2, RefreshCcw } from "lucide-react";

interface Registration {
  id: string;
  slug: string;
  entryId: string;
  qrCode?: string;
  email?: string;
  fullName?: string;
  isActivated: boolean;
  createdAt: string;
}

export default function AdminRegistrations() {
  const [search, setSearch] = useState("");
  const [activatedOnly, setActivatedOnly] = useState(false);
  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, activated: 0 });


  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations?search=${search}&activatedOnly=${activatedOnly}`);
      const json = await res.json();

      setData(Array.isArray(json.registrations) ? json.registrations : []);
      setStats(json.stats || { total: 0, activated: 0 });

    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce wyszukiwania - czekamy 500ms po wpisaniu tekstu
  useEffect(() => {
    const delay = setTimeout(fetchDocs, 500);
    return () => clearTimeout(delay);
  }, [search, activatedOnly]);

  const handleAction = async (id: string, slug: string, action: string) => {
    const msg = action === "DELETE_ALL" ? "Czy na pewno CHCESZ USUNĄĆ cały wpis?" : "Czy zresetować status aktywacji?";
    if (!confirm(msg)) return;

    try {
      await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, slug, action })
      });
      fetchDocs();
    } catch (err) {
      alert("Błąd podczas wykonywania akcji");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black flex items-center gap-3">
            <User className="text-blue-600" /> PANEL MODERACJI
          </h1>
          <div className="text-xs text-gray-400 font-mono">Status: Online</div>
        </div>

        {/* TOOLBAR */}
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex flex-wrap gap-3 items-center border border-gray-100">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Szukaj ID, QR, Nazwisko, Email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={() => setActivatedOnly(!activatedOnly)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activatedOnly
              ? "bg-green-600 text-white shadow-lg shadow-green-100"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {activatedOnly ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            TYLKO AKTYWNE
          </button>

          <button
            onClick={fetchDocs}
            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 font-bold text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="p-4">Kod QR / Slug</th>
                <th className="p-4">Dane Rejestracji</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Zarządzaj</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading && data.length === 0 && (
                <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" size={40} /></td></tr>
              )}

              {!loading && data.length === 0 && (
                <tr><td colSpan={4} className="p-20 text-center text-gray-400 italic">Brak wyników dla podanych filtrów...</td></tr>
              )}

              {data.map((reg) => (
                <tr key={reg.id} className="border-t border-gray-50 hover:bg-blue-50/30 transition">
                  <td className="p-4">
                    <div className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded inline-block mb-1">
                      {reg.qrCode || "Brak QR"}
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase font-medium">{reg.slug}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold">{reg.fullName || "Nieznany"}</div>
                    <div className="text-xs text-gray-400">{reg.email || "brak@email.com"}</div>
                    <div className="text-[9px] text-gray-300 font-mono mt-1">ID: {reg.entryId || reg.id}</div>
                  </td>
                  <td className="p-4 text-center">
                    {reg.isActivated ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">AKTYWNY</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">CZEKA</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        title="Zresetuj aktywację"
                        onClick={() => handleAction(reg.id, reg.slug, "RESET_ACTIVATION")}
                        className="p-2.5 text-orange-500 hover:bg-orange-50 rounded-xl transition"
                      >
                        <RotateCcw size={18} />
                      </button>
                      <button
                        title="Usuń wpis"
                        onClick={() => handleAction(reg.id, reg.slug, "DELETE_ALL")}
                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* STOPKA Z LICZNIKIEM */}
        <div className="mt-4 flex justify-between items-center px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Wszystkich w bazie</span>
              <span className="text-xl font-black text-gray-900">{stats.total}</span>
            </div>

            <div className="flex flex-col border-l border-gray-100 pl-6">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Aktywowanych ogółem</span>
              <span className="text-xl font-black text-green-600">{stats.activated}</span>
            </div>

            {/* Opcjonalnie: ile widzisz teraz po filtrach */}
            <div className="flex flex-col border-l border-gray-100 pl-6 text-blue-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Widocznych</span>
              <span className="text-xl font-black">{data.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}