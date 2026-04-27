"use client";

import { useState, useEffect } from "react";
import { UserPlus, Trash2, UserCircle, Loader2, QrCode, ShieldCheck } from "lucide-react";

export default function UserHostPage() {
  const [hosts, setHosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ fullName: "" });

  const fetchHosts = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/userhost");
    const data = await res.json();
    setHosts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchHosts(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/userhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ fullName: "" });
        fetchHosts();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateBadge = async (hostId: string, fullName: string) => {
    try {
      if (!hostId) {
        alert("Błąd: ID hosta jest nieznane");
        return;
      }

      const res = await fetch("/api/admin/userhost/qrcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const domain = window.location.origin;
      const qrFullUrl = encodeURIComponent(`${domain}${data.qrUrl}`);
      const encodedName = encodeURIComponent(fullName.toUpperCase());

      const badgeUrl = `https://warsawexpo.eu/assets/badge/local/loading.html?category=pwe_host_a6&getname=${encodedName}&firma=PTAK%20WARSAW%20EXPO&qrcode=${qrFullUrl}`;

      window.open(badgeUrl, "_blank");
    } catch (err: any) {
      alert("Błąd generowania: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Na pewno usunąć tego hosta?")) return;
    const res = await fetch(`/api/admin/userhost?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchHosts();
  };

  return (
    <div className="min-h-full bg-gray-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Obsługa Host</h1>
              <p className="text-sm text-gray-500">Zarządzaj personelem i generuj identyfikatory z kodami QR.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Panel Autoryzowany</span>
            </div>
          </div>

          <form onSubmit={handleAdd} className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[280px] relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                required
                placeholder="Imię i Nazwisko hosta"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
              />
            </div>
            <button
              disabled={saving || !form.fullName.trim()}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
              <span>Dodaj do systemu</span>
            </button>
          </form>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Aktywny Personel</h2>
            <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded-md">
              RAZEM: {hosts.length}
            </span>
          </div>

          <ul className="divide-y divide-gray-100">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-gray-400 font-medium animate-pulse">Ładowanie bazy personelu...</p>
              </div>
            ) : hosts.map((host) => (
              <li key={host.id} className="group hover:bg-slate-50 transition-all duration-200">
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300 border border-transparent group-hover:border-blue-100">
                      <UserCircle size={28} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase italic">
                        {host.fullName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          UID: {host.id.slice(-8).toUpperCase()}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                        <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-tighter">Status: OK</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleGenerateBadge(host.id, host.fullName)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase hover:bg-blue-600 transition-all shadow-sm active:scale-95"
                    >
                      <QrCode size={16} />
                      Generuj Badge
                    </button>

                    <button
                      onClick={() => handleDelete(host.id)}
                      className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group/btn"
                      title="Usuń hosta"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </li>
            ))}

            {!loading && hosts.length === 0 && (
              <li className="p-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
                  <UserPlus size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-400 font-medium">Brak zarejestrowanych hostów w systemie.</p>
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}