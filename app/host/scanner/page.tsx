"use client";

import { useState, useEffect, useRef } from "react";
import {
  LogIn,
  LogOut,
  Loader2,
  XCircle,
  CheckCircle2,
  Scan,
  Settings
} from "lucide-react";

export default function HostScannerPage() {
  const [mode, setMode] = useState<"IN" | "OUT">("IN");
  const [status, setStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");
  const [message, setMessage] = useState("");
  const [guest, setGuest] = useState("");
  const [config, setConfig] = useState<any>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const lockRef = useRef(false);

  // Pobranie konfiguracji (Host i Brama)
  useEffect(() => {
    const saved = localStorage.getItem("host_config");
    if (saved) setConfig(JSON.parse(saved));
  }, []);

  // Focus loop - NIE ZMIENIONY
  useEffect(() => {
    const i = setInterval(() => {
      if (status === "IDLE") {
        inputRef.current?.focus();
      }
    }, 300);
    return () => clearInterval(i);
  }, [status]);

  const mapMessage = (msg: string) => {
    if (!msg) return "Błąd";
    if (msg.includes("NOT_FOUND")) return "Bilet nieprawidłowy";
    if (msg.includes("WRONG_EVENT")) return "Nieprawidłowe targi";
    if (msg.includes("INACTIVE")) return "QR Code nieaktywny";
    if (msg.includes("USED")) return "Bilet już użyty";
    return msg;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    if (lockRef.current) return;

    const val = inputRef.current?.value.trim();
    if (!val || val.length < 3) return;

    lockRef.current = true;
    if (inputRef.current) inputRef.current.value = "";

    verifyCode(val);

    setTimeout(() => {
      lockRef.current = false;
    }, 1000);
  };

  const verifyCode = async (qr: string) => {
    setStatus("LOADING");
    try {
      const res = await fetch("/api/host/verify-guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCode: qr, gate: config?.gate, mode })
      });

      const data = await res.json();

      if (data.status === "SUCCESS") {
        setStatus("SUCCESS");
        setGuest(data.guestName);
        setMessage(mode === "OUT" ? "Możesz wejść ponownie" : "Wejście OK");
      } else {
        setStatus("ERROR");
        setGuest(data.guestName || "");
        setMessage(mapMessage(data.message || ""));
      }

      setTimeout(() => {
        setStatus("IDLE");
        setMessage("");
        setGuest("");
      }, 3000);
    } catch {
      setStatus("ERROR");
      setMessage("Błąd systemu");
      setTimeout(() => setStatus("IDLE"), 2000);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white relative">

      {/* NAGŁÓWEK - INFO O HOŚCIE (Z-INDEX 10, żeby nie psuć fokusu) */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 pointer-events-none">
        <div className="bg-black/40 p-2 rounded-lg backdrop-blur-sm">
          <div className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">GATE: {config?.gate || "---"}</div>
          <div className="text-xs font-bold uppercase opacity-80">{config?.hostName || "Ładowanie..."}</div>
        </div>

        <button
          onMouseDown={(e) => { e.preventDefault(); window.location.href = "/host/setup"; }}
          className="pointer-events-auto p-3 bg-white/5 rounded-full active:bg-white/20"
        >
          <Settings size={18} className="opacity-30" />
        </button>
      </div>

      {/* GHOST INPUT - IDENTYCZNY JAK WCZEŚNIEJ */}
      <input
        ref={inputRef}
        type="text"
        onKeyDown={handleKeyDown}
        autoFocus
        onFocus={(e) => {
          e.target.readOnly = true;
          setTimeout(() => (e.target.readOnly = false), 50);
        }}
        style={{
          position: "absolute",
          opacity: 0,
          top: 0,
          left: 0
        }}
      />

      {/* GÓRA — IN */}
      <div
        className={`flex-1 flex flex-col items-center justify-center transition ${mode === "IN" ? "bg-green-600" : "bg-green-900/40 opacity-40"
          }`}
        onClick={() => setMode("IN")}
      >
        <LogIn size={120} />
        <div className="text-7xl font-black italic">IN</div>
      </div>

      {/* DÓŁ — OUT */}
      <div
        className={`flex-1 flex flex-col items-center justify-center transition ${mode === "OUT" ? "bg-orange-500" : "bg-orange-900/40 opacity-40"
          }`}
        onClick={() => setMode("OUT")}
      >
        <LogOut size={120} />
        <div className="text-7xl font-black italic">OUT</div>
      </div>

      {/* FULLSCREEN STATUS */}
      {status !== "IDLE" && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-50 ${status === "SUCCESS" ? "bg-green-600" : status === "LOADING" ? "bg-gray-900" : "bg-red-700"
            }`}
        >
          {status === "LOADING" && <Loader2 size={120} className="animate-spin mb-6" />}
          {status === "SUCCESS" && (
            <>
              <CheckCircle2 size={180} className="mb-6" />
              <div className="text-6xl font-black italic uppercase tracking-tighter">{message}</div>
              <div className="text-3xl mt-6 font-bold">{guest}</div>
            </>
          )}
          {status === "ERROR" && (
            <>
              <XCircle size={180} className="mb-6" />
              <div className="text-5xl font-black italic uppercase tracking-tighter">{message}</div>
              {guest && <div className="text-2xl mt-4 font-bold">{guest}</div>}
            </>
          )}
        </div>
      )}

      {/* STOPKA */}
      <div className="absolute bottom-2 w-full text-center text-[10px] opacity-20 flex justify-center items-center gap-2 tracking-[0.3em] uppercase font-black">
        <Scan size={12} /> Scanner Active
      </div>
    </div>
  );
}