"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function WeekPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const buffer = useRef("");
  const errorTimeout = useRef<NodeJS.Timeout | null>(null);

  // Funkcja do wyświetlania błędu na 3 sekundy
  const showError = (msg: string) => {
    if (errorTimeout.current) clearTimeout(errorTimeout.current);
    setError(msg);
    errorTimeout.current = setTimeout(() => setError(null), 3000);
  };

  // 1. Pobieranie wydarzeń
  useEffect(() => {
    fetch(`/api/week/${slug}`)
      .then(res => res.json())
      .then(data => {
        setEvents(data?.events || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  // 2. Nasłuchiwanie skanera QR
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (isRedirecting) return;

      if (e.key === "Enter") {
        const finalCode = buffer.current.trim();
        buffer.current = "";

        if (finalCode.length > 3) {
          try {
            const eventSlugs = events.map(ev => ev.slug);
            const checkRes = await fetch("/api/week/check-qr", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ qr: finalCode, eventSlugs })
            });

            // ODCZYTUJEMY JSON TYLKO RAZ TUTAJ
            const data = await checkRes.json();

            if (checkRes.ok) {
              setIsRedirecting(true);
              router.push(`/aktywacja/${data.foundSlug}?qr=${finalCode}&from=${slug}&start=true`);
            } else {
              // TERAZ KORZYSTAMY Z JUŻ POBRANYCH DANYCH W 'data'
              if (checkRes.status === 409 || data.error === "ALREADY_ACTIVATED") {
                showError("BILET ZOSTAŁ JUŻ AKTYWOWANY");
              } else if (checkRes.status === 400) {
                showError("NIEPRAWIDŁOWY TYP BILETU");
              } else if (checkRes.status === 404) {
                showError("KOD NIE ISTNIEJE W BAZIE");
              } else {
                showError("BŁĄD SYSTEMU");
              }
            }
          } catch (err) {
            console.error("QR Check failed", err);
            showError("BŁĄD POŁĄCZENIA");
          }
        }
      } else {
        if (e.key.length === 1) {
          buffer.current += e.key;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [events, isRedirecting, router, slug]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#fb5607] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="mt-6 text-[10px] font-black text-[#fb5607] uppercase tracking-[0.4em] animate-pulse">
          Inicjalizacja systemu
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-screen bg-white font-sans overflow-hidden flex flex-col transition-all duration-700 ${isRedirecting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>

      {/* MODAL / TOAST BŁĘDU */}
      <div className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 transform ${error ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-[#fb5607] text-white py-8 px-6 shadow-2xl flex flex-col items-center justify-center">
          <svg className="w-12 h-12 mb-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Błąd skanowania</h2>
          <p className="text-sm font-bold opacity-80 mt-1 uppercase tracking-widest">{error}</p>
        </div>
      </div>

      <header className="py-12 text-center shrink-0">
        <h1 className="text-4xl font-black text-black uppercase tracking-tighter leading-none mb-2">
          {isRedirecting ? "Łączenie..." : "Wybierz wydarzenie"}
        </h1>
        <p className="text-[11px] text-[#fb5607] font-black tracking-[0.4em] uppercase">
          Tydzień: {slug}
        </p>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        <div className="flex flex-wrap justify-center gap-8 max-w-[1400px] mx-auto">
          {events.map((event: any) => (
            <Link
              key={event.id}
              href={`/aktywacja/${event.slug}?start=true`}
              className="group w-[320px] bg-white rounded-[2.5rem] overflow-hidden border-2 border-gray-50 flex flex-col transition-all duration-500 hover:border-[#fb5607] hover:shadow-[0_30px_60px_-15px_rgba(251,86,7,0.2)] active:scale-95"
            >
              <div className="h-48 overflow-hidden relative bg-gray-50">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-200">
                    <span className="text-6xl font-black">{event.name.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-7 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Dostępne teraz</p>
                  <h2 className="text-xl font-black text-black uppercase tracking-tighter truncate leading-tight group-hover:text-[#fb5607] transition-colors">
                    {event.name}
                  </h2>
                </div>
                <div className="shrink-0 w-12 h-12 bg-black group-hover:bg-[#fb5607] rounded-2xl flex items-center justify-center text-white transition-all duration-500 shadow-lg group-hover:shadow-[#fb5607]/40 transform group-hover:translate-x-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}

          {events.length === 0 && (
            <div className="text-center">
              <p className="text-gray-200 text-6xl mb-4">Empty</p>
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Brak aktywnych wydarzeń w tym tygodniu</p>
            </div>
          )}
        </div>
      </main>

      <footer className="py-10 shrink-0 text-center">
        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 ${error ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
          <div className={`w-2 h-2 rounded-full animate-ping ${error ? 'bg-red-500' : 'bg-[#fb5607]'}`}></div>
          <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${error ? 'text-red-600' : 'text-black'}`}>
            {error ? "Błąd odczytu - spróbuj ponownie" : "Skaner aktywny: Zeskanuj bilet"}
          </span>
        </div>
      </footer>
    </div>
  );
}