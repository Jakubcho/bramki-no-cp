"use client";

import { useState, useEffect, useRef } from "react";
import { UserCheck, DoorOpen, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function HostSetupPage() {
  const [hostName, setHostName] = useState("");
  const [hostId, setHostId] = useState(""); // Zachowujemy ID do logów
  const [availableGates, setAvailableGates] = useState<string[]>([]);
  const [selectedGate, setSelectedGate] = useState("");
  const [step, setStep] = useState(1); // 1: Skan Hosta, 2: Wybór Bramki
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const scanInputRef = useRef<HTMLInputElement>(null);

  // 1. Pobieramy dane o bramkach na ten tydzień
  useEffect(() => {
    fetch("/api/host/active-gates")
      .then((res) => res.json())
      .then((data) => {
        setAvailableGates(data.gates || []);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Błąd połączenia z serwerem");
        setIsLoading(false);
      });
  }, []);

  // 2. Automatyczne ustawianie focusu na input dla Datalogic/Zebra
  useEffect(() => {
    const focusInterval = setInterval(() => {
      if (step === 1 && !isVerifying) {
        scanInputRef.current?.focus();
      }
    }, 500);
    return () => clearInterval(focusInterval);
  }, [step, isVerifying]);

  // 3. Logika skanowania i weryfikacji Hosta
  const handleHostScan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const rawVal = scanInputRef.current?.value.trim();
    if (!rawVal) return;

    setError("");
    setIsVerifying(true);

    // Oczyszczamy kod z przedrostka HOST:
    const idToVerify = rawVal.toUpperCase().startsWith("HOST:")
      ? rawVal.substring(5)
      : rawVal;

    try {
      const res = await fetch("/api/host/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostId: idToVerify }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Nieznany identyfikator");

      setHostName(data.name); // Ustawiamy Imię i Nazwisko z bazy
      setHostId(idToVerify);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
      if (scanInputRef.current) scanInputRef.current.value = "";
    } finally {
      setIsVerifying(false);
    }
  };

  const finalizeSetup = () => {
    const config = {
      hostName,
      hostId,
      gate: selectedGate,
      setupAt: new Date().toISOString(),
    };
    localStorage.setItem("host_config", JSON.stringify(config));
    window.location.href = "/host/scanner";
  };

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50 text-black">
      <Loader2 className="animate-spin text-[#fb5607]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center font-sans text-black">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl p-8 border border-gray-100">

        {step === 1 && (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-colors ${error ? 'bg-red-100 text-red-500' : 'bg-[#fb5607]/10 text-[#fb5607]'}`}>
              {isVerifying ? <Loader2 className="animate-spin" size={40} /> : <UserCheck size={40} />}
            </div>

            <h1 className="text-2xl font-black uppercase tracking-tight mb-2">IDENTYFIKACJA HOSTA</h1>
            <p className="text-gray-400 font-medium mb-8 text-sm uppercase tracking-wider">
              {isVerifying ? "Weryfikacja w bazie..." : "Zeskanuj kod HOST:[ID]"}
            </p>

            <form onSubmit={handleHostScan} className="relative">
              <input
                ref={scanInputRef}
                autoFocus
                disabled={isVerifying}
                className={`w-full bg-gray-50 border-2 border-dashed rounded-2xl p-4 text-center font-bold outline-none transition-all ${error ? "border-red-200 text-red-500" : "border-gray-200 focus:border-[#fb5607] focus:bg-white"
                  }`}
                placeholder={isVerifying ? "PROSZĘ CZEKAĆ..." : "OCZEKIWANIE NA SKAN..."}
              />
              {error && (
                <div className="flex items-center justify-center gap-2 mt-4 text-red-500 font-black text-[10px] uppercase">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-black/10">
                {hostName.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Zalogowany host</p>
                <h2 className="text-xl font-black uppercase tracking-tight">{hostName}</h2>
              </div>
            </div>

            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <DoorOpen size={14} className="text-[#fb5607]" /> WYBIERZ TWOJE WEJŚCIE
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {availableGates.length > 0 ? (
                availableGates.map((gate) => (
                  <button
                    key={gate}
                    onClick={() => setSelectedGate(gate)}
                    className={`py-6 rounded-2xl font-black text-2xl transition-all border-2
                      ${selectedGate === gate
                        ? "border-[#fb5607] bg-[#fb5607] text-white shadow-lg shadow-[#fb5607]/20 scale-[1.02]"
                        : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200 active:scale-95"
                      }`}
                  >
                    {gate}
                  </button>
                ))
              ) : (
                <div className="col-span-2 p-4 bg-yellow-50 text-yellow-700 rounded-xl text-xs font-bold text-center border border-yellow-100">
                  BRAK AKTYWNYCH WYDARZEŃ W TYM TYGODNIU
                </div>
              )}
            </div>

            <button
              disabled={!selectedGate}
              onClick={finalizeSetup}
              className="w-full bg-black text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-10 active:scale-95 shadow-xl shadow-black/10"
            >
              ROZPOCZNIJ PRACĘ <ArrowRight size={22} />
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full mt-4 text-[10px] font-black text-gray-300 uppercase hover:text-gray-500 transition-colors"
            >
              BŁĘDNY HOST? ZESKANUJ PONOWNIE
            </button>
          </div>
        )}
      </div>
      <p className="mt-8 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
        Warsaw Expo • Check-in Point 2026
      </p>
    </div>
  );
}