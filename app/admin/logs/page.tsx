"use client";

import { useEffect, useState } from "react";

type AuditLog = {
  id: string;
  userEmail: string;
  userRole: string;
  action: string;
  entity: string;
  entityId: string | null;
  meta: any;
  createdAt: string;
};

export default function LogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/admin/logs");
        if (!res.ok) throw new Error(`Błąd serwera: ${res.status}`);
        const data = await res.json();

        setLogs(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      day: d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" }),
      time: d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
    };
  };

  const getActionStyle = (action: string) => {
    const a = action.toUpperCase();
    if (a.includes("CREATE")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (a.includes("DELETE")) return "bg-rose-50 text-rose-700 border-rose-100";
    if (a.includes("UPDATE")) return "bg-blue-50 text-blue-700 border-blue-100";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Pobieranie danych...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="bg-rose-50 border-2 border-rose-100 p-8 rounded-[2rem] max-w-md">
        <h2 className="text-rose-600 font-black uppercase tracking-tight mb-2">Wystąpił błąd</h2>
        <p className="text-rose-500/80 text-sm font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-rose-600 text-white rounded-xl font-bold text-xs uppercase">Spróbuj ponownie</button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto font-sans min-h-screen">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">System Audytowy</span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dziennik Zdarzeń</h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-2xl border border-slate-200">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-slate-600">{logs.length} zapisanych akcji</span>
        </div>
      </header>

      <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Kiedy</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Kto</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Akcja</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Szczegóły</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map((log) => {
                const { day, time } = formatDate(log.createdAt);
                return (
                  <tr key={log.id} className="group hover:bg-slate-50/80 transition-all">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm font-black text-slate-800">{day}</div>
                      <div className="text-[10px] font-bold text-slate-400 tracking-tight">{time}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-slate-700">{log.userEmail}</div>
                      <div className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">{log.userRole}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black border uppercase tracking-tight ${getActionStyle(log.action)}`}>
                        {log.action.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <LogModal log={log} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LogModal({ log }: { log: AuditLog }) {
  const [isOpen, setIsOpen] = useState(false);

  const renderSummary = () => {
    const meta = log.meta;
    if (!meta) return "Brak szczegółów w meta-danych.";

    if (log.action === "UPDATE_USER" || log.action === "UPDATE_STEP") {
      if (meta.before?.role && meta.after?.role) {
        return (
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded-lg">{meta.before.role}</span>
            <span className="text-slate-300">➜</span>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">{meta.after.role}</span>
          </div>
        );
      }
      if (log.action === "UPDATE_STEP" && meta.after?.translations) {
        const plTitle = meta.after.translations.find((t: any) => t.locale === 'pl')?.title;
        return <p className="text-sm font-bold text-slate-700 italic">Edytowano krok: "{plTitle}"</p>;
      }
    }

    if (log.action === "CREATE_USER") return `Utworzono użytkownika: ${meta.createdEmail} (${meta.createdRole})`;
    if (log.action === "DELETE_USER") return `Usunięto konto: ${meta.user?.email || log.entityId}`;

    return "Zmiana strukturalna obiektu.";
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 underline underline-offset-4"
      >
        Szczegóły
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsOpen(false)} />

          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Podsumowanie akcji</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{log.action.replace("_", " ")}</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-all">✕</button>
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Interpretacja zmiany:</span>
                {renderSummary()}
              </div>

              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Surowe dane (JSON):</span>
                <div className="bg-slate-900 rounded-2xl p-6 text-emerald-400 font-mono text-[10px] leading-relaxed overflow-auto max-h-[300px] custom-scrollbar">
                  <pre>{JSON.stringify(log.meta, null, 2)}</pre>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setIsOpen(false)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Zamknij podgląd</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}