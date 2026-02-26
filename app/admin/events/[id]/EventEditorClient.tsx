"use client";

import { useEffect, useState } from "react";

type StepType =
  | "SINGLE_CHOICE"
  | "MULTI_CHOICE"
  | "MULTI_CHOICE_ICON"
  | "FORM"
  | "CONSENT";

type Translations = {
  pl: string;
  en: string;
};

type OptionState = {
  id?: string;
  value: string;
  iconUrl?: string;
  icon?: File | null;
  translations: Translations;
};

export default function EventEditorClient({ id }: { id: string }) {
  const [event, setEvent] = useState<any>(null);

  const [title, setTitle] = useState<Translations>({ pl: "", en: "" });
  const [type, setType] = useState<StepType>("SINGLE_CHOICE");
  const [newOptions, setNewOptions] = useState<OptionState[]>([]);

  const [editingStep, setEditingStep] = useState<any>(null);
  const [editTitle, setEditTitle] = useState<Translations>({ pl: "", en: "" });
  const [editType, setEditType] = useState<StepType>("SINGLE_CHOICE");
  const [editOrder, setEditOrder] = useState(1);
  const [editOptions, setEditOptions] = useState<OptionState[]>([]);
  const [deletedOptionIds, setDeletedOptionIds] = useState<string[]>([]);

  const [templates, setTemplates] = useState<any[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    fetch("/api/admin/templates")
      .then((res) => res.json())
      .then(setTemplates);
  }, []);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((res) => res.json())
      .then(setEvent);
  }, [id]);

  function getTranslation(arr: any[], locale: string, field: "title" | "label") {
    return arr?.find((t: any) => t.locale === locale)?.[field] || "";
  }

  async function deleteStep(stepId: string) {
    if (!confirm("Usunąć krok wraz z opcjami?")) return;
    await fetch(`/api/admin/steps/${stepId}`, { method: "DELETE" });
    location.reload();
  }

  async function saveTemplate() {
    if (!templateName.trim()) return;
    await fetch(`/api/admin/events/${id}/save-template`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: templateName }),
    });
    alert("Zapisano szablon");
  }

  async function loadTemplate() {
    if (!selectedTemplate) return;
    await fetch(`/api/admin/events/${id}/load-template`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId: selectedTemplate }),
    });
    location.reload();
  }

  const editStep = (step: any) => {

    setEditingStep(step);
    setEditType(step.type);
    setEditOrder(step.order);
    setDeletedOptionIds([]);

    setEditTitle({
      pl: getTranslation(step.translations, "pl", "title"),
      en: getTranslation(step.translations, "en", "title"),
    });

    const mappedOpts = step.options.map((o: any) => ({
      id: o.id,
      value: o.value,
      translations: {
        pl: getTranslation(o.translations, "pl", "label"),
        en: getTranslation(o.translations, "en", "label"),
      },
      iconUrl: o.iconUrl,
      icon: null,
    }));

    setEditOptions(mappedOpts);
  };

  async function addStep() {
    const form = new FormData();

    const isTechnicalStep = type === "FORM" || type === "CONSENT";

    const finalTitlePl = isTechnicalStep && !currentTitle.pl ? (type === "FORM" ? "Formularz" : "Zgody") : currentTitle.pl;
    const finalTitleEn = isTechnicalStep && !currentTitle.en ? (type === "FORM" ? "Form" : "Consents") : currentTitle.en;

    form.append("type", type);
    form.append("title[pl]", finalTitlePl || "");
    form.append("title[en]", finalTitleEn || "");

    if (!isTechnicalStep) {
      opts.forEach((o, i) => {
        form.append(`options[${i}][value]`, o.value || "");
        form.append(`options[${i}][label][pl]`, o.translations.pl || "");
        form.append(`options[${i}][label][en]`, o.translations.en || "");
        if (o.icon) form.append(`options[${i}][icon]`, o.icon);
      });
    }

    const res = await fetch(`/api/admin/events/${id}/steps`, {
      method: "POST",
      body: form,
    });

    if (res.ok) location.reload();
    else alert(`Błąd: ${res.status}. Sprawdź dane.`);
  }

  async function updateStep() {
    if (!editingStep) return;

    const formData = new FormData();
    const currentType = editingStep ? editType : type;

    const finalTitlePl = (currentType === "FORM" || currentType === "CONSENT") && !currentTitle.pl
      ? (currentType === "FORM" ? "Formularz" : "Zgody")
      : currentTitle.pl;

    const finalTitleEn = (currentType === "FORM" || currentType === "CONSENT") && !currentTitle.en
      ? (currentType === "FORM" ? "Form" : "Consents")
      : currentTitle.en;

    formData.append("type", currentType);
    formData.append("order", editOrder.toString());
    formData.append("title[pl]", finalTitlePl || "");
    formData.append("title[en]", finalTitleEn || "");

    deletedOptionIds.forEach((id, index) => {
      formData.append(`deleteOptions[${index}]`, id);
    });

    if (currentType !== "FORM" && currentType !== "CONSENT") {
      opts.forEach((o, i) => {
        if (o.id) {
          formData.append(`options[${i}][id]`, o.id);
        }
        formData.append(`options[${i}][value]`, o.value || "");
        formData.append(`options[${i}][label][pl]`, o.translations.pl || "");
        formData.append(`options[${i}][label][en]`, o.translations.en || "");

        if (o.icon instanceof File) {
          formData.append(`options[${i}][icon]`, o.icon);
        }
      });
    }

    try {
      const res = await fetch(`/api/admin/steps/${editingStep.id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        setDeletedOptionIds([]);
        setEditingStep(null);
        location.reload();
      } else {
        const errorText = await res.text();
        console.error("Błąd edycji:", errorText);
        alert("Nie udało się zapisać zmian.");
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Błąd połączenia z serwerem.");
    }
  }

  const reorderSteps = async (stepId: string, newOrder: number) => {
    const sortedSteps = [...event.steps].sort((a, b) => a.order - b.order);

    const oldIndex = sortedSteps.findIndex(s => s.id === stepId);
    if (oldIndex === -1) return;

    const movedItem = sortedSteps.splice(oldIndex, 1)[0];

    sortedSteps.splice(newOrder - 1, 0, movedItem);

    const updates = sortedSteps.map((step, index) => ({
      id: step.id,
      order: index + 1
    }));

    try {
      const res = await fetch(`/api/admin/events/${id}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates })
      });

      if (res.ok) location.reload();
    } catch (error) {
      console.error("Błąd podczas reorderowania:", error);
    }
  };

  if (!event) return <div className="p-10 text-center">Ładowanie…</div>;

  const opts = editingStep ? editOptions : newOptions;
  const setOpts = editingStep ? setEditOptions : setNewOptions;
  const currentTitle = editingStep ? editTitle : title;
  const setCurrentTitle = editingStep ? setEditTitle : setTitle;
  const currentType = editingStep ? editType : type;


  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* --- TEMPLATE PANEL (TOP BAR) --- */}
        <div className="bg-white/80 backdrop-blur-md border border-white shadow-xl shadow-blue-900/5 rounded-[2rem] p-3 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex gap-2">
            <select
              className="flex-1 bg-slate-50 border-none px-5 py-3 rounded-2xl text-sm font-medium focus:ring-2 ring-blue-500/20 outline-none appearance-none cursor-pointer"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">📂 Wybierz istniejący szablon...</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <button onClick={loadTemplate} className="bg-slate-900 hover:bg-black text-white px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
              Wczytaj
            </button>
          </div>
          <div className="hidden md:block w-px h-8 bg-slate-200 self-center" />
          <div className="flex-1 flex gap-2">
            <input
              className="flex-1 bg-slate-50 border-none px-5 py-3 rounded-2xl text-sm font-medium focus:ring-2 ring-emerald-500/20 outline-none"
              placeholder="Nazwij konfigurację..."
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
            <button onClick={saveTemplate} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-200">
              Zapisz
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* --- LEWA KOLUMNA: LISTA KROKÓW --- */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black tracking-tight text-slate-800">Struktura wydarzenia</h2>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase">Live Preview</div>
            </div>

            <div className="space-y-4">
              {event.steps.map((step: any) => (
                <div key={step.id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex gap-5">
                      {/* ORDER BADGE */}
                      <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg shadow-slate-200">
                        <span className="text-[10px] font-bold opacity-50 leading-none uppercase">Krok</span>
                        <span className="text-lg font-black leading-none">{step.order}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                            {step.type.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 leading-tight flex items-center flex-wrap">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: getTranslation(step.translations, "pl", "title")
                            }}
                          />
                          <span className="ml-2 text-slate-400 font-medium text-base">
                            (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: getTranslation(step.translations, "en", "title")
                              }}
                            />
                            )
                          </span>
                        </h3>
                      </div>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button onClick={() => editStep(step)} className="p-2.5 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors">✏️</button>
                      <button onClick={() => deleteStep(step.id)} className="p-2.5 hover:bg-red-50 text-red-600 rounded-xl transition-colors">🗑</button>
                    </div>
                  </div>

                  {/* OPCJE (TAGI) */}
                  {step.options?.length > 0 && (
                    <div className="mt-5 ml-[68px] flex flex-wrap gap-2">
                      {step.options.map((o: any) => (
                        <div key={o.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600">
                          {o.iconUrl && <img src={o.iconUrl} className="w-4 h-4 object-contain" alt="" />}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: getTranslation(o.translations, "pl", "label")
                            }}
                          />
                          <span className="text-slate-400 font-normal">
                            (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: getTranslation(o.translations, "en", "label")
                              }}
                            />
                            )
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* --- PRAWA KOLUMNA: FORMULARZ (STICKY) --- */}
          <div className="lg:col-span-5 self-start">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-blue-900/5 space-y-8">
              <header>
                <h2 className="text-2xl font-black text-slate-800">
                  {editingStep ? "Edycja kroku" : "Nowy element"}
                </h2>
                <p className="text-sm text-slate-400 font-medium">Skonfiguruj parametry wybranego etapu.</p>
              </header>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Typologia</label>
                    <select
                      className="w-full bg-slate-50 border-2 border-slate-50 p-3 rounded-2xl font-bold text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                      value={editingStep ? editType : type}
                      onChange={(e) => editingStep ? setEditType(e.target.value as any) : setType(e.target.value as any)}
                    >
                      <option value="SINGLE_CHOICE">Single Choice</option>
                      <option value="MULTI_CHOICE">Multi Choice</option>
                      <option value="MULTI_CHOICE_ICON">Multi Choice + Icons</option>
                      <option value="FORM">Formularz danych</option>
                      <option value="CONSENT">Zgody prawne</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kolejność</label>
                    {editingStep ? (
                      <select
                        className="w-full bg-blue-50 border-2 border-blue-100 p-3 rounded-2xl font-black text-sm focus:bg-white focus:border-blue-500 outline-none transition-all text-blue-600"
                        value={editOrder}
                        onChange={(e) => {
                          const newPos = Number(e.target.value);
                          setEditOrder(newPos);
                          reorderSteps(editingStep.id, newPos);
                        }}
                      >
                        {event.steps
                          .sort((a: any, b: any) => a.order - b.order)
                          .map((_: any, i: number) => (
                            <option key={i + 1} value={i + 1}>
                              Pozycja {i + 1} {editingStep.order === i + 1 ? "(Obecna)" : ""}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <div className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-2xl font-black text-sm text-slate-400">
                        Nowy ({event.steps.length + 1})
                      </div>
                    )}
                  </div>
                </div>

                {!(["FORM", "CONSENT"].includes(editingStep ? editType : type)) && (
                  <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Treść pytania (PL)</label>
                      <input
                        className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold focus:ring-4 ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                        placeholder="Wpisz pytanie po polsku..."
                        value={currentTitle.pl}
                        onChange={(e) => setCurrentTitle({ ...currentTitle, pl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 text-slate-300">English Question (EN)</label>
                      <input
                        className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold focus:ring-4 ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-slate-500"
                        placeholder="Wpisz pytanie po angielsku..."
                        value={currentTitle.en}
                        onChange={(e) => setCurrentTitle({ ...currentTitle, en: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {!(["FORM", "CONSENT"].includes(editingStep ? editType : type)) && (
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 ml-1">Opcje odpowiedzi</label>
                      <button
                        onClick={() => setOpts([...opts, { value: "", translations: { pl: "", en: "" }, icon: null }])}
                        className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        + DODAJ OPCJĘ
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                      {opts.map((o, i) => (
                        <div key={i} className="bg-slate-50 p-4 rounded-[1.5rem] border border-transparent hover:border-slate-200 transition-all relative group">
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <input
                              placeholder="Etykieta PL"
                              className="bg-white border-none p-2.5 rounded-xl text-xs font-bold shadow-sm outline-none"
                              value={o.translations.pl}
                              onChange={(e) => {
                                const n = [...opts];
                                n[i] = { ...n[i], translations: { ...n[i].translations, pl: e.target.value } };
                                setOpts(n);
                              }}
                            />
                            <input
                              placeholder="Etykieta EN"
                              className="bg-white border-none p-2.5 rounded-xl text-xs font-bold shadow-sm outline-none text-slate-400"
                              value={o.translations.en}
                              onChange={(e) => {
                                const n = [...opts];
                                n[i] = { ...n[i], translations: { ...n[i].translations, en: e.target.value } };
                                setOpts(n);
                              }}
                            />
                          </div>

                          <div className="flex gap-2">
                            <input
                              placeholder="Value (id)"
                              className="flex-1 bg-slate-200/50 border-none p-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider outline-none"
                              value={o.value}
                              onChange={(e) => {
                                const n = [...opts];
                                n[i] = { ...n[i], value: e.target.value };
                                setOpts(n);
                              }}
                            />
                            {(editingStep ? editType : type) === "MULTI_CHOICE_ICON" && (
                              <div className="relative overflow-hidden bg-white px-3 py-1.5 rounded-xl border border-dashed border-slate-300 flex items-center gap-2">
                                {o.iconUrl && <img src={o.iconUrl} className="w-4 h-4 object-contain" />}
                                <span className="text-[9px] font-black uppercase text-slate-400">Ikona</span>
                                <input
                                  type="file"
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    const n = [...opts];
                                    n[i] = { ...n[i], icon: file };
                                    setOpts(n);
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              const optionToDelete = opts[i];

                              if (optionToDelete.id) {
                                const idToDelete = optionToDelete.id;
                                setDeletedOptionIds(prev => [...prev, idToDelete as string]);
                              }
                              setOpts(opts.filter((_, idx) => idx !== i));
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center text-[10px] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                {editingStep ? (
                  <div className="flex gap-3">
                    <button onClick={updateStep} className="flex-1 bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-sm tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all">
                      AKTUALIZUJ KROK
                    </button>
                    <button onClick={() => setEditingStep(null)} className="px-8 bg-slate-100 text-slate-500 py-5 rounded-[1.5rem] font-black text-sm hover:bg-slate-200 transition-all">
                      ✕
                    </button>
                  </div>
                ) : (
                  <button onClick={addStep} className="w-full bg-slate-900 text-white py-6 rounded-[1.5rem] font-black text-sm tracking-[0.2em] shadow-2xl shadow-slate-300 hover:bg-black active:scale-[0.98] transition-all uppercase">
                    Dodaj do procesu
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}