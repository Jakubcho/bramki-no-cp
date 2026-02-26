"use client";

import { useState, useEffect, useMemo } from "react";
import FormStep, { isFormValid } from "./FormStep";

type StepType =
  | "SINGLE_CHOICE"
  | "MULTI_CHOICE"
  | "MULTI_CHOICE_ICON"
  | "FORM"
  | "CONSENT";

type Translation = {
  locale: string;
  title?: string;
  label?: string;
};

type Option = {
  id: string;
  value: string;
  iconUrl?: string | null;
  translations: Translation[];
};

type Step = {
  id: string;
  type: StepType;
  order: number;
  translations: Translation[];
  options: Option[];
};

type Event = {
  id: string;
  name: string;
  slug: string;
  steps: Step[];
};

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phoneCode: "+48",
  phone: "",
  street: "",
  buildingNumber: "",
  postalCode: "",
  city: "",
  country: "",
};

export default function ActivationClient({ event }: { event: Event }) {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<"pl" | "en">("pl");
  const [mode, setMode] = useState<"idle" | "manual" | "qr">("idle");
  const [scannedQr, setScannedQr] = useState<string | null>(null);

  const steps = useMemo(() => {
    return [...event.steps].sort((a, b) => a.order - b.order);
  }, [event.steps]);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    form: EMPTY_FORM,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mode !== "idle") return;

    let buffer = "";
    let timeout: NodeJS.Timeout;

    function handleKey(e: KeyboardEvent) {
      if (
        e.key === "Shift" ||
        e.key === "Control" ||
        e.key === "Alt" ||
        e.key === "Meta"
      ) {
        return;
      }

      if (e.key === "Enter") {
        if (buffer.length > 3) {
          setScannedQr(buffer);
          setMode("qr");
        }
        buffer = "";
        return;
      }

      if (e.key.length === 1) {
        buffer += e.key;
      }

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        buffer = "";
      }, 100);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mode]);

  useEffect(() => {
    if (!scannedQr || mode !== "qr") return;

    async function fetchQr() {
      const res = await fetch(`/api/qr/${event.slug}/${scannedQr}`);
      if (!res.ok) {
        alert("QR not found");
        setMode("idle");
        return;
      }

      const data = await res.json();

      const [firstName = "", lastName = ""] = (data.full_name || "").split(" ");

      setAnswers(a => ({
        ...a,
        form: {
          firstName,
          lastName,
          email: data.email || "",
          phoneCode: "+48",
          phone: data.phone || "",
          street: data.street_address || "",
          buildingNumber: data.house_number || "",
          postalCode: data.postal_code || "",
          city: data.city || "",
          country: data.country || "",
        }
      }));

      setMode("manual");
    }

    fetchQr();
  }, [scannedQr, mode, event.slug]);

  const step = steps[currentStep];


  const getT = (translations: Translation[] | undefined, field: "title" | "label") => {
    if (!translations) return "";

    return translations.find(t => t.locale === lang)?.[field] ||
      translations.find(t => t.locale === "pl")?.[field] || "";
  };

  const ui = {
    step: lang === "pl" ? "Krok" : "Step",
    of: lang === "pl" ? "z" : "of",
    back: lang === "pl" ? "Wróć" : "Back",
    next: lang === "pl" ? "Dalej" : "Next",
    finish: lang === "pl" ? "Zakończ" : "Finish",
  };

  function setAnswer(stepId: string, optionId: string) {
    setAnswers(prev => ({ ...prev, [stepId]: optionId }));
  }

  function toggleMulti(stepId: string, optionId: string) {
    const cur = answers[stepId] || [];
    setAnswer(
      stepId,
      cur.includes(optionId)
        ? cur.filter((id: string) => id !== optionId)
        : [...cur, optionId]
    );
  }

  function canGoNext() {
    if (step.type === "SINGLE_CHOICE") return !!answers[step.id];
    if (step.type === "FORM") return isFormValid(answers.form);
    if (step.type === "MULTI_CHOICE" || step.type === "MULTI_CHOICE_ICON") {
      return (answers[step.id] || []).length > 0;
    }
    return true;
  }

  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }

  if (mode === "idle") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-8">
        <h1 className="text-3xl font-black text-slate-800">
          {event.name}
        </h1>

        <button
          onClick={() => setMode("manual")}
          className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl"
        >
          {lang === "pl" ? "Zarejestruj się" : "Register"}
        </button>

        <p className="text-sm text-slate-400">
          {lang === "pl"
            ? "Zeskanuj kod QR aby wczytać dane"
            : "Scan QR code to load data"}
        </p>
      </div>
    );
  }
  return (

    <div className="h-screen bg-white md:bg-gray-50 flex flex-col items-center px-4 py-6 md:py-12 font-sans text-slate-900 overflow-hidden">

      {/* LANGUAGE PICKER */}
      <div className="fixed top-6 right-6 flex gap-2 z-50">
        <button
          onClick={() => setLang("pl")}
          className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center text-xl shadow-sm ${lang === "pl" ? "border-blue-600 bg-white scale-110 shadow-md" : "border-transparent bg-gray-100 opacity-50 hover:opacity-100"}`}
        >
          🇵🇱
        </button>
        <button
          onClick={() => setLang("en")}
          className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center text-xl shadow-sm ${lang === "en" ? "border-blue-600 bg-white scale-110 shadow-md" : "border-transparent bg-gray-100 opacity-50 hover:opacity-100"}`}
        >
          🇬🇧
        </button>
      </div>

      {/* HEADER: PROGRESS & TITLE (Zawsze na środku) */}
      <div className="w-full max-w-3xl flex flex-col items-center shrink-0">
        <div className="w-full mb-8">
          <div className="flex justify-between items-end mb-4 px-1">
            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">
                {ui.step} {currentStep + 1} {ui.of} {steps.length}
              </span>
              <h1
                className="text-2xl md:text-3xl font-black tracking-tight text-slate-800"
                dangerouslySetInnerHTML={{ __html: getT(step.translations, "title") }}
              />
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-400">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
          </div>

          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-700 ease-in-out rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)]"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* CONTENT AREA: Scrolluje się tylko to, co poniżej */}
      <div className={`w-full flex-1 overflow-y-auto px-2 custom-scrollbar ${step.type === "MULTI_CHOICE_ICON" ? "max-w-6xl" : "max-w-4xl"}`}>
        <div className="pb-6">
          {(step.type === "SINGLE_CHOICE" || step.type === "MULTI_CHOICE") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {step.options.map(o => {
                const isSelected = step.type === "SINGLE_CHOICE"
                  ? answers[step.id] === o.id
                  : (answers[step.id] || []).includes(o.id);

                return (
                  <button
                    key={o.id}
                    onClick={() => step.type === "SINGLE_CHOICE" ? setAnswer(step.id, o.id) : toggleMulti(step.id, o.id)}
                    className={`w-full group relative flex items-center justify-between px-6 py-5 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98]
                ${isSelected
                        ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-900/5"
                        : "border-slate-100 bg-white hover:border-slate-300 shadow-sm"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-[20px] h-[20px] aspect-square rounded-full border-2 flex items-center justify-center transition-all
                  ${isSelected ? "border-blue-600 bg-blue-600" : "border-slate-200 bg-white"}`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full animate-in zoom-in duration-200" />}
                      </div>
                      <span
                        className={`text-lg font-semibold transition-colors text-left ${isSelected ? "text-blue-900" : "text-slate-700"}`}
                        dangerouslySetInnerHTML={{ __html: getT(o.translations, "label") }}
                      />
                    </div>
                    {isSelected && (
                      <span className="text-blue-600 animate-in fade-in zoom-in">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {step.type === "MULTI_CHOICE_ICON" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {step.options.map(o => {
                const selected = (answers[step.id] || []).includes(o.id);
                return (
                  <button
                    key={o.id}
                    onClick={() => toggleMulti(step.id, o.id)}
                    className={`group relative border-2 rounded-[2rem] px-4 py-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 active:scale-[0.98] min-h-[180px]
                ${selected
                        ? "border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-900/5 ring-4 ring-blue-600/5"
                        : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-md"
                      }`}
                  >
                    {o.iconUrl && (
                      <div className={`p-4 rounded-2xl transition-all duration-300
                  ${selected ? "bg-white shadow-sm scale-110" : "bg-slate-50 group-hover:bg-white"}`}>
                        <img src={o.iconUrl} className="w-12 h-12 object-contain" alt="" />
                      </div>
                    )}
                    <span
                      className={`font-bold text-base text-center leading-tight transition-colors
                  ${selected ? "text-blue-900" : "text-slate-600 group-hover:text-slate-900"}`}
                      dangerouslySetInnerHTML={{ __html: getT(o.translations, "label") }}
                    />
                    <div className={`absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300
                ${selected ? "bg-blue-600 scale-100 opacity-100" : "bg-slate-100 scale-50 opacity-0"}`}>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {step.type === "FORM" && (
            <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm">
              <FormStep lang={lang} value={answers.form} onChange={v => setAnswers(a => ({ ...a, form: v }))} />
            </div>
          )}

          {step.type === "CONSENT" && (
            <div className="max-w-xl mx-auto space-y-4 bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-slate-500 text-sm">Zgody...</p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER NAV: Zawsze na dole */}
      <div className="w-full max-w-xl mt-6 flex justify-between items-center shrink-0">
        <button
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          className={`text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors px-4 py-2 ${currentStep === 0 ? "invisible" : "visible"}`}
        >
          {ui.back}
        </button>

        <button
          disabled={!canGoNext()}
          onClick={() => {
            if (!canGoNext()) return;
            const isLast = currentStep === steps.length - 1;
            if (isLast) {
              alert(lang === "pl" ? "Dziękujemy!" : "Thank you!");
              setCurrentStep(0);
            } else {
              setCurrentStep(s => s + 1);
            }
          }}
          className="group relative px-10 py-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold transition-all shadow-xl shadow-slate-200 disabled:opacity-20 active:scale-95"
        >
          <span className="flex items-center gap-2">
            {currentStep === steps.length - 1 ? ui.finish : ui.next}
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}