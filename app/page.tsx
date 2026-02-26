// src/app/page.tsx
"use client";

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* TŁO - Grafika z public/bg-object.webp */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: "url('/bg-object.webp')" }}
      />

      {/* OVERLAY - lekkie przyciemnienie żeby napis był czytelny */}
      <div className="absolute inset-0 z-10 bg-black/30 backdrop-blur-[2px]" />

      {/* TREŚĆ */}
      <div className="relative z-20 text-center px-4">
        <div className="bg-white/90 backdrop-blur-md p-8 md:p-16 rounded-[3rem] shadow-2xl border border-white/50">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">
            Aktywacja
          </h1>
          <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full mb-6" />
          <p className="text-xl md:text-2xl font-bold text-slate-700 uppercase tracking-[0.2em]">
            Ptak Warsaw Expo
          </p>

          <div className="mt-10 flex items-center justify-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
              System wkrótce dostępny
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}