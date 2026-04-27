"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import FormStep, { isFormValid } from "./FormStep";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2, UserCircle, ArrowRight, ArrowLeft,
  Search, ShieldCheck
} from 'lucide-react';

// --- TYPY ---
type StepType = "SINGLE_CHOICE" | "MULTI_CHOICE" | "MULTI_CHOICE_ICON" | "FORM" | "CONSENT";
type Translation = { locale: string; title?: string; label?: string; };
type Option = { id: string; value: string; iconUrl?: string | null; translations: Translation[]; };
type Step = { id: string; type: StepType; order: number; translations: Translation[]; options: Option[]; };


type Event = {
  id: string;
  name: string;
  slug: string;
  steps: Step[];
  version?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  domain?: string;
  qrPrefixes?: string;
  imageUrl?: string;
};

const EMPTY_FORM = {
  firstName: "", lastName: "", email: "", phoneCode: "+48",
  phone: "", street: "", buildingNumber: "", postalCode: "",
  city: "", country: "",
};

export default function ActivationClient({ event }: { event: Event }) {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<"pl" | "en">("pl");
  const [mode, setMode] = useState<"idle" | "manual">("idle");
  const [isFinished, setIsFinished] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [originWeek, setOriginWeek] = useState<string | null>(null);

  const [qrInfo, setQrInfo] = useState<{ entryId: string; partitionSlug: string, qrCodeString: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, any>>({ form: EMPTY_FORM });

  const searchParams = useSearchParams();
  const qrFromUrl = searchParams.get('qr');
  const fromUrl = searchParams.get('from');
  const autoStart = searchParams.get('start') === 'true';
  const router = useRouter();

  const steps = useMemo(() => {
    return [...event.steps].sort((a, b) => a.order - b.order);
  }, [event.steps]);

  useEffect(() => { setMounted(true); }, []);

  const getT = useCallback((translations: Translation[] | undefined, field: "title" | "label") => {
    if (!translations) return "";
    return translations.find(t => t.locale === lang)?.[field] ||
      translations.find(t => t.locale === "pl")?.[field] || "";
  }, [lang]);



  const handleQrFetch = useCallback(async (code: string) => {
    // Blokada jeśli skanowanie trwa lub trwa pauza po błędzie
    if (isScanning || isPaused) return;

    setIsScanning(true);
    setScanError(null);

    try {
      const domainParam = event.domain ? `?domain=${encodeURIComponent(event.domain)}` : "";
      const res = await fetch(`/api/qr/${event.slug}/${code}${domainParam}`);

      // Obsługa błędu 404 lub 500
      if (!res.ok) {
        setScanError(lang === "pl" ? "BŁĘDNY KOD QR" : "INVALID QR CODE");
        setIsPaused(true);
        setTimeout(() => {
          setScanError(null);
          setIsPaused(false);
        }, 5000);
        return;
      }

      const data = await res.json();

      // 1. Sprawdzenie czy już aktywowany
      if (data.isActivated) {
        const owner = data.fullName || data.actFirstName || (data.actLastName ? `${data.actFirstName} ${data.actLastName}` : "");
        setScanError(lang === "pl" ? `JUŻ AKTYWOWANY! ${owner ? '(' + owner + ')' : ''}` : `ALREADY ACTIVATED! ${owner ? '(' + owner + ')' : ''}`);

        setIsPaused(true);

        const qrFromUrl = searchParams.get('qr');

        if (qrFromUrl) {
          setTimeout(() => {
            router.back();
          }, 3000);
        } else {
          setTimeout(() => {
            setScanError(null);
            setIsPaused(false);
          }, 5000);
        }
        return;
      }

      // 2. Zapisanie informacji o QR do stanu
      setQrInfo({
        entryId: String(data.entryId),
        partitionSlug: data.foundInPartition || event.slug,
        qrCodeString: data.qrCode || code
      });

      // 3. Parsowanie Imienia i Nazwiska (jeśli przychodzi jako jeden ciąg)
      const rawName = data.fullName || data.full_name || "";
      const nameParts = rawName.trim().split(/\s+/);
      const fName = data.actFirstName || nameParts[0] || "";
      const lName = data.actLastName || (nameParts.length > 1 ? nameParts.slice(1).join(" ") : "");

      // 4. Wypełnienie formularza danymi z bazy/CDB
      setAnswers(prev => ({
        ...prev,
        form: {
          firstName: fName,
          lastName: lName,
          email: data.email || data.actEmail || "",
          phone: data.phone || data.actPhone || "",
          street: data.streetAddress || data.street_address || data.actStreet || "",
          buildingNumber: data.houseNumber || data.house_number || data.actHouseNumber || "",
          postalCode: data.postalCode || data.postal_code || data.actPostalCode || "",
          city: data.city || data.actCity || "",
          country: data.country || "Polska",
        }
      }));

      // 5. Przełączenie w tryb manualny (formularz)
      setMode("manual");

    } catch (err) {
      console.error("QR Fetch Error:", err);
      setScanError(lang === "pl" ? "BŁĄD POŁĄCZENIA" : "CONNECTION ERROR");
      setIsPaused(true);
      setTimeout(() => {
        setScanError(null);
        setIsPaused(false);
      }, 5000);
    } finally {
      setIsScanning(false);
    }
  }, [event.slug, lang, isScanning, isPaused, setQrInfo, setAnswers, setMode, EMPTY_FORM]);

  useEffect(() => {
    if (mode !== "idle" || isFinished) return;
    let buffer = "";
    let timeout: NodeJS.Timeout;
    function handleKey(e: KeyboardEvent) {
      if (isPaused || isScanning) return;
      if (["Shift", "Control", "Alt", "Meta"].includes(e.key)) return;
      if (e.key === "Enter") {
        if (buffer.length > 3) handleQrFetch(buffer);
        buffer = "";
        return;
      }
      if (e.key.length === 1) buffer += e.key;
      clearTimeout(timeout);
      timeout = setTimeout(() => { buffer = ""; }, 150);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mode, handleQrFetch, isPaused, isScanning, isFinished]);



  const handleFinish = async () => {
    const stripHtml = (html: string) => {
      if (typeof window === 'undefined') return html;
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || "";
    };

    const readableAnswers: Record<string, any> = { form: answers.form, survey: [] };
    steps.forEach(s => {
      if (s.type === "FORM") return;
      const userChoice = answers[s.id];
      if (!userChoice) return;
      let labels: string[] = [];
      if (Array.isArray(userChoice)) {
        labels = userChoice.map(id => stripHtml(getT(s.options.find(o => o.id === id)?.translations, "label")));
      } else {
        const option = s.options.find(o => o.id === userChoice);
        labels = [stripHtml(getT(option?.translations, "label"))];
      }
      readableAnswers.survey.push({ question: stripHtml(getT(s.translations, "title")), answers: labels });
    });

    const eventPartitions = (event as any).partitions;
    let partitionName = event.slug;
    if (Array.isArray(eventPartitions) && eventPartitions.length > 0) {
      partitionName = eventPartitions[0].partitionSlug || eventPartitions[0];
    }
    const finalPartitionSlug = qrInfo?.partitionSlug || partitionName;


    try {
      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryId: qrInfo?.entryId || `manual_${Date.now()}`,
          partitionSlug: String(finalPartitionSlug),
          qrPrefixes: event.qrPrefixes,
          form: answers.form,
          stepsAnswers: readableAnswers,
          name: event.name,
          qrInfo: qrInfo,
          endDate: event.endDate,
          startDate: event.startDate,
          lang: lang,
        }),
      });

      if (res.ok) {
        setIsFinished(true);
        setTimeout(() => {
          if (originWeek) {
            router.push(`/week/${originWeek}`);
          } else {
            setMode("idle");
            setCurrentStep(0);
            setAnswers({ form: EMPTY_FORM });
            setQrInfo(null);
            setIsFinished(false);
          }
        }, 6000);
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Błąd zapisu");
      }
    } catch (err: any) {
      alert(`Problem: ${err.message}`);
    }
  };

  const step = steps[currentStep];

  const canGoNext = useCallback(() => {
    if (!step) return false;
    if (step.type === "SINGLE_CHOICE") return !!answers[step.id];
    if (step.type === "FORM") return isFormValid(answers.form);
    if (step.type === "MULTI_CHOICE" || step.type === "MULTI_CHOICE_ICON") {
      return (answers[step.id] || []).length > 0;
    }
    return true;
  }, [step, answers]);


  useEffect(() => {
    if (!mounted) return;

    if (qrFromUrl && mode === "idle") {
      if (fromUrl) setOriginWeek(fromUrl);
      handleQrFetch(qrFromUrl);

      const newUrl = window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }

    else if (autoStart && mode === "idle") {
      if (fromUrl) setOriginWeek(fromUrl);
      setMode("manual");

      // Czyścimy URL z parametru start
      const newUrl = window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }
  }, [mounted, qrFromUrl, autoStart, mode, fromUrl, handleQrFetch]);

  useEffect(() => { setMounted(true); }, []);

  const VersionBadge = () => (
    <div className="fixed bottom-4 left-4 z-[100] flex items-center gap-2 opacity-20 hover:opacity-100 transition-opacity pointer-events-none select-none">
      <div className="bg-black/80 text-white px-2.5 py-1 rounded-md font-mono text-[9px] font-bold tracking-widest flex items-center gap-2 backdrop-blur-sm">
        <span className="text-[#fb5607]">v{event.version || 1}</span>
        {event.startDate && (
          <>
            <span className="w-px h-2 bg-white/20" />
            <span>{new Date(event.startDate).toLocaleDateString('pl-PL')}</span>
          </>
        )}
      </div>
    </div>
  );

  if (!mounted) return null;

  if (isFinished) {
    return (
      <div className="h-screen w-screen bg-white flex items-center justify-center font-sans overflow-hidden animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-24 h-24 bg-black text-[#fb5607] rounded-full flex items-center justify-center mb-2 shadow-xl">
            <CheckCircle2 size={56} strokeWidth={2.5} className="animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter">
              {lang === "pl" ? "DZIĘKUJEMY!" : "THANK YOU!"}
            </h2>
            <p className="text-xl text-gray-400 font-medium">
              {lang === "pl" ? "Twoja aktywacja przebiegła pomyślnie." : "Activation successful."}
            </p>
            <div className="flex flex-col items-center gap-4 mt-8">
              <div className="w-64 bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#fb5607] h-full" style={{ animation: 'shrink 6s linear forwards' }} />
              </div>
            </div>
          </div>
          <style jsx>{` @keyframes shrink { from { width: 100%; } to { width: 0%; } } `}</style>
        </div>
      </div>
    );
  }

  if (mode === "idle") {
    return (
      <div className="h-screen w-screen bg-white flex flex-col items-center justify-center font-sans overflow-hidden relative animate-in fade-in duration-500">
        <VersionBadge />

        <div className="absolute top-6 right-6 z-50 flex gap-3">
          <button onClick={() => setLang('pl')} className={`transition-all active:scale-90 rounded-lg overflow-hidden border-2 ${lang === 'pl' ? 'border-[#fb5607] shadow-md' : 'border-transparent opacity-50'}`}>
            <img src="https://flagcdn.com/w80/pl.png" alt="PL" className="w-10 h-6 object-cover" />
          </button>
          <button onClick={() => setLang('en')} className={`transition-all active:scale-90 rounded-lg overflow-hidden border-2 ${lang === 'en' ? 'border-[#fb5607] shadow-md' : 'border-transparent opacity-50'}`}>
            <img src="https://flagcdn.com/w80/gb.png" alt="EN" className="w-10 h-6 object-cover" />
          </button>
        </div>

        {/* KAFELEK Z GRAFIKĄ WYDARZENIA ZAMIAST H1 */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-full max-w-lg px-4 drop-shadow-2xl">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-auto max-h-[300px] object-contain rounded-2xl"
            />
          </div>
        </div>

        <div className="w-full max-w-md px-6">
          <button
            onClick={() => setMode("manual")}
            className="w-full bg-[#fb5607] hover:bg-[#e04a05] text-white rounded-3xl p-10 flex flex-col items-center justify-center gap-4 shadow-xl shadow-[#fb5607]/20 transition-transform active:scale-95"
          >
            <UserCircle size={64} strokeWidth={1.5} />
            <span className="text-2xl font-black uppercase tracking-widest">
              {isScanning ? "..." : (lang === 'pl' ? 'ZAREJESTRUJ SIĘ' : 'REGISTER NOW')}
            </span>
          </button>
        </div>

        <div className="absolute bottom-12 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${scanError ? 'bg-red-400' : 'bg-green-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${scanError ? 'bg-red-500' : 'bg-green-500'}`}></span>
            </div>
            <span className={`text-sm font-black uppercase tracking-[0.2em] ${scanError ? 'text-red-600' : 'text-gray-400'}`}>
              {scanError || (lang === 'pl' ? 'PROSZĘ ZESKANOWAĆ KOD QR' : 'PLEASE SCAN QR CODE')}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-white flex flex-col font-sans overflow-hidden select-none animate-in fade-in duration-300">
      <VersionBadge />

      <div className="px-8 pt-6 pb-2 shrink-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#fb5607]">
            {lang === 'pl' ? 'KROK' : 'STEP'} {currentStep + 1} / {steps.length}
          </span>
          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full flex overflow-hidden">
          <div className="bg-[#fb5607] h-full transition-all duration-700" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
        </div>
      </div>

      <div className="flex-1 px-8 py-4 overflow-y-auto min-h-0">
        <div className="text-center mt-4 mb-8">
          {step?.type !== "FORM" && (
            <h2
              className="text-3xl font-black text-black tracking-tight uppercase leading-tight max-w-4xl mx-auto"
              dangerouslySetInnerHTML={{ __html: getT(step?.translations, "title") }}
            />
          )}
        </div>

        <div className="max-w-5xl mx-auto pb-12">
          {step?.type === "FORM" && (
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
              <FormStep lang={lang} value={answers.form} onChange={v => setAnswers(a => ({ ...a, form: v }))} />
            </div>
          )}

          {(step?.type === "SINGLE_CHOICE" || step?.type === "MULTI_CHOICE") && (
            <div className="grid grid-cols-2 gap-4">
              {step.options.map(o => {
                const selected = step.type === "SINGLE_CHOICE"
                  ? answers[step.id] === o.id
                  : (answers[step.id] || []).includes(o.id);

                return (
                  <button
                    key={o.id}
                    onClick={() => {
                      if (step.type === "SINGLE_CHOICE") {
                        setAnswers(p => ({ ...p, [step.id]: o.id }));
                      } else {
                        const cur = answers[step.id] || [];
                        setAnswers(p => ({
                          ...p,
                          [step.id]: cur.includes(o.id) ? cur.filter((i: any) => i !== o.id) : [...cur, o.id]
                        }));
                      }
                    }}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all min-h-[60px] flex items-center ${selected
                      ? 'border-[#fb5607] bg-[#fb5607]/5 shadow-sm'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                  >
                    {selected && step.type === "MULTI_CHOICE" && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 rounded-full bg-[#fb5607]" />
                      </div>
                    )}
                    <span
                      className="text-base font-bold uppercase tracking-tight leading-tight pr-4"
                      dangerouslySetInnerHTML={{ __html: getT(o.translations, "label") }}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {step?.type === "MULTI_CHOICE_ICON" && (
            <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
              {(() => {
                const total = step.options.length;
                const half = Math.ceil(total / 2);
                const rows = [
                  step.options.slice(0, half),
                  step.options.slice(half)
                ];

                return rows.map((rowOptions, rowIndex) => (
                  rowOptions.length > 0 && (
                    <div
                      key={rowIndex}
                      className="grid gap-4 w-full"
                      style={{
                        gridTemplateColumns: `repeat(${rowOptions.length}, minmax(0, 1fr))`,
                        maxWidth: rowOptions.length * 220 + 'px',
                        margin: '0 auto'
                      }}
                    >
                      {rowOptions.map(o => {
                        const selected = (answers[step.id] || []).includes(o.id);
                        return (
                          <button
                            key={o.id}
                            onClick={() => {
                              const cur = answers[step.id] || [];
                              setAnswers(p => ({
                                ...p,
                                [step.id]: cur.includes(o.id) ? cur.filter((i: any) => i !== o.id) : [...cur, o.id]
                              }));
                            }}
                            className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all h-full min-h-[160px] ${selected ? 'border-[#fb5607] bg-[#fb5607]/5 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'
                              }`}
                          >
                            {selected && (
                              <div className="absolute top-3 right-3">
                                <ShieldCheck size={20} className="text-[#fb5607]" />
                              </div>
                            )}
                            <div className="h-16 flex items-center justify-center mb-3 shrink-0">
                              {o.iconUrl && (
                                <img src={o.iconUrl} className="max-w-full max-h-full object-contain" alt="" />
                              )}
                            </div>
                            <span
                              className="font-bold text-xs uppercase tracking-tight leading-tight block w-full"
                              dangerouslySetInnerHTML={{ __html: getT(o.translations, "label") }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  )
                ));
              })()}
            </div>
          )}
        </div>
      </div>

      <div className="px-8 py-6 shrink-0 flex justify-between items-center bg-white border-t border-gray-100 relative z-50">
        <button
          onClick={() => {
            if (currentStep === 0) {
              if (originWeek) router.push(`/week/${originWeek}`);
              else setMode("idle");
            } else {
              setCurrentStep(s => s - 1);
            }
          }}
          className={`flex items-center space-x-2 text-gray-300 hover:text-black font-black px-4 py-2 transition-all text-lg uppercase tracking-widest ${currentStep === 0 && !originWeek ? "invisible" : ""
            }`}
        >
          <ArrowLeft size={24} />
          <span>{lang === "pl" ? "WRÓĆ" : "BACK"}</span>
        </button>

        <button
          disabled={!canGoNext()}
          onClick={() => { if (currentStep === steps.length - 1) handleFinish(); else setCurrentStep(s => s + 1); }}
          className="bg-[#fb5607] hover:bg-[#e04a05] disabled:bg-gray-100 disabled:text-gray-300 text-white font-black py-4 px-12 rounded-2xl shadow-lg shadow-[#fb5607]/20 flex items-center space-x-3 text-xl uppercase tracking-widest active:scale-95 transition-all"
        >
          <span>{currentStep === steps.length - 1 ? (lang === "pl" ? "ZAKOŃCZ" : "FINISH") : (lang === "pl" ? "DALEJ" : "NEXT")}</span>
          {currentStep < steps.length - 1 && <ArrowRight size={24} />}
        </button>
      </div>

    </div>
  );
}