"use client";
import { useState, useEffect } from "react";
import {
  AlertCircle,
  Clock,
  ChevronDown,
  Code,
  Database,
  Terminal,
  ChevronRight,
  Eye,
  Hash
} from "lucide-react";

export default function ApiErrorsPage() {
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/admin/apierrors-list')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setErrors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Błąd fetch logów:", err);
        setLoading(false);
      });
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen text-slate-400 font-light tracking-wide">
      <Terminal size={20} className="mr-2 animate-pulse" />
      Ładowanie dziennika zdarzeń...
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans text-slate-700">
      <div className="max-w-6xl mx-auto">

        {/* Header - Subtelniejszy */}
        <header className="mb-8 flex items-end justify-between border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <AlertCircle size={20} className="text-slate-400" />
              Logi błędów API
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-normal">Przegląd techniczny ostatnich incydentów</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-medium tracking-wider">Wszystkie wpisy</span>
            <div className="text-2xl font-light text-slate-900 leading-none">{errors.length}</div>
          </div>
        </header>

        {errors.length === 0 && (
          <div className="bg-white p-12 rounded-xl text-center border border-slate-200 shadow-sm">
            <p className="text-slate-400 font-light italic">Brak zarejestrowanych incydentów.</p>
          </div>
        )}

        <div className="space-y-2">
          {errors.map((err) => {
            const isExpanded = expandedRows[err.id];

            return (
              <div key={err.id} className={`bg-white rounded-lg border transition-all duration-150 ${isExpanded ? 'border-slate-300 shadow-md' : 'border-slate-200 shadow-sm hover:border-slate-300'}`}>

                {/* Belka Główna - Stonowana */}
                <div
                  onClick={() => toggleRow(err.id)}
                  className="p-3 flex flex-wrap justify-between items-center gap-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`transition-colors ${isExpanded ? 'text-slate-900' : 'text-slate-300 group-hover:text-slate-500'}`}>
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </div>

                    {/* Metoda - Mało krzykliwa */}
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-tighter">
                      {err.method}
                    </span>

                    <div className="flex flex-col">
                      <code className="text-[13px] font-medium text-slate-800">
                        {err.endpoint}
                      </code>
                      <span className="text-[11px] text-slate-400 font-normal truncate max-w-[300px]">
                        {err.message}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Czas - delikatny */}
                    <div className="hidden lg:flex items-center gap-2 text-slate-400 font-normal text-[11px]">
                      <Clock size={12} />
                      {new Date(err.createdAt).toLocaleString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit' })}
                    </div>

                    {/* Status - bez tła, tylko obramowanie */}
                    {err.status && (
                      <div className="border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium text-slate-500 bg-slate-50">
                        {err.status}
                      </div>
                    )}

                    <button className={`text-[10px] font-medium px-3 py-1.5 rounded-md border transition-colors ${isExpanded ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
                      {isExpanded ? 'ZAMKNIJ' : 'SZCZEGÓŁY'}
                    </button>
                  </div>
                </div>

                {/* Rozwinięcie - Ciemne, ale stonowane kolory kodu */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 bg-white rounded-b-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                      {/* Lewa: Payload */}
                      <div className="space-y-2">
                        <h5 className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                          <Database size={12} /> Payload
                        </h5>
                        <div className="bg-[#1e293b] rounded-lg p-4 h-[280px]">
                          <pre className="text-[11px] text-slate-300 font-mono h-full overflow-auto leading-relaxed custom-scrollbar">
                            {err.payload && Object.keys(err.payload).length > 0
                              ? JSON.stringify(err.payload, null, 2)
                              : "// Brak danych"}
                          </pre>
                        </div>
                      </div>

                      {/* Prawa: Response / Message */}
                      <div className="space-y-2">
                        <h5 className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                          <Code size={12} /> Odpowiedź / Błąd
                        </h5>
                        <div className="bg-[#1e293b] rounded-lg p-4 h-[280px]">
                          <pre className="text-[11px] text-slate-300 font-mono h-full overflow-auto leading-relaxed custom-scrollbar">
                            <div className="text-red-400 font-medium border-b border-slate-700/50 pb-2 mb-3">
                              # Komunikat: {err.message}
                            </div>

                            {err.response ? (
                              typeof err.response === 'object'
                                ? JSON.stringify(err.response, null, 2)
                                : String(err.response)
                            ) : (
                              <span className="text-slate-500 italic">// Brak treści body</span>
                            )}

                            {err.stack && (
                              <div className="mt-6 border-t border-slate-800 pt-3 opacity-40 text-[10px]">
                                STACK_TRACE: {err.stack}
                              </div>
                            )}
                          </pre>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}