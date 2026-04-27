"use client";

import { useEffect, useState } from "react";
import { User, Crown, HardHat, Camera, Mic2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { toast } from "sonner";

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
  const [isEditingEventName, setIsEditingEventName] = useState(false);
  const [tempEventName, setTempEventName] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [entrances, setEntrances] = useState<string[]>([]);
  const [newEntrance, setNewEntrance] = useState("");

  const [tempImage, setTempImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [title, setTitle] = useState<Translations>({ pl: "", en: "" });
  const [type, setType] = useState<StepType>("SINGLE_CHOICE");
  const [newOptions, setNewOptions] = useState<OptionState[]>([]);

  const [editingStep, setEditingStep] = useState<any>(null);
  const [editTitle, setEditTitle] = useState<Translations>({ pl: "", en: "" });
  const [editType, setEditType] = useState<StepType>("SINGLE_CHOICE");
  const [editOrder, setEditOrder] = useState(1);
  const [editOptions, setEditOptions] = useState<OptionState[]>([]);
  const [deletedOptionIds, setDeletedOptionIds] = useState<string[]>([]);

  const [externalDirectoryID, setExternalDirectoryID] = useState<number | "">("");

  const [templates, setTemplates] = useState<any[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [openStepId, setOpenStepId] = useState<string | null>(null);

  const [partitions, setPartitions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [tempDomain, setTempDomain] = useState("");

  const [qrPrefixes, setQrPrefixes] = useState<string[]>([]);
  const [newPrefix, setNewPrefix] = useState("");

  const [isTicketRulesOpen, setIsTicketRulesOpen] = useState(false);
  const [isPartitionsOpen, setIsPartitionsOpen] = useState(false);
  const [ticketRules, setTicketRules] = useState<any>({
    guest: { forms: [], start: "", end: "" },
    vip: { forms: [], start: "", end: "" },
    exhibitor: { forms: [], start: "", end: "" },
    media: { forms: [], start: "", end: "" },
    speaker: { forms: [], start: "", end: "" },
  });
  const [isReconciling, setIsReconciling] = useState(false);
  const [repairStatus, setRepairStatus] = useState<{ count: number } | null>(null);

  const handleReconcile = async () => {
    setIsReconciling(true);
    setRepairStatus(null);
    console.log("start");
    try {
      const response = await fetch("/api/admin/reconcile-missing-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": process.env.NEXT_PUBLIC_INTERNAL_SECRET || "",
        },
        body: JSON.stringify({ slug: event.slug }),
      });

      const data = await response.json();

      if (response.ok) {
        setRepairStatus({ count: data.processedCount });
        toast.success(`Naprawiono ${data.processedCount} rekordów.`);
      } else {
        toast.error(data.error || "Błąd podczas naprawy danych.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Wystąpił błąd krytyczny połączenia.");
    } finally {
      setIsReconciling(false);
    }
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newRules = { ...ticketRules };
    let newAvailable = [...availableFormNames];
    let draggedItem: { id: string; name: string } | undefined;

    if (source.droppableId === 'available') {
      draggedItem = newAvailable[source.index];
      newAvailable.splice(source.index, 1);
    } else {
      const sourceForms = [...(newRules[source.droppableId]?.forms || [])];
      draggedItem = sourceForms[source.index];
      sourceForms.splice(source.index, 1);
      newRules[source.droppableId] = { ...newRules[source.droppableId], forms: sourceForms };
    }

    if (!draggedItem) return;

    if (destination.droppableId === 'available') {
      newAvailable.splice(destination.index, 0, draggedItem);
    } else {
      const destForms = [...(newRules[destination.droppableId]?.forms || [])];
      destForms.splice(destination.index, 0, draggedItem);
      newRules[destination.droppableId] = { ...newRules[destination.droppableId], forms: destForms };
    }

    setAvailableFormNames(newAvailable);
    setTicketRules(newRules);
  };

  const handleSyncCatalog = async () => {
    if (!externalDirectoryID) {
      return toast.error("Błąd: Podaj najpierw ID katalogu!");
    }

    setIsSaving(true);

    // Opcjonalnie: Toast typu "loading"
    const toastId = toast.loading("Synchronizacja katalogu w toku...");

    try {
      const res = await fetch(`/api/sync-catalog/${event.id}/`, { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        // Aktualizujemy istniejący toast na sukces
        toast.success("Zsynchronizowano pomyślnie!", {
          id: toastId,
          description: `Partycja: ${data.slug}. Zaimportowano: ${data.count} osób.`,
        });

        // Zamiast brutalnego reload, można poczekać chwilę, żeby użytkownik przeczytał info
        setTimeout(() => window.location.reload(), 1500);

      } else {
        toast.error("Błąd synchronizacji", {
          id: toastId,
          description: data.error
        });
      }
    } catch (err) {
      toast.error("Błąd połączenia z API", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };
  const [availableFormNames, setAvailableFormNames] = useState<{ id: string, name: string }[]>([]);

  const filteredPartitions = partitions.filter(slug =>
    slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    async function load() {
      try {
        const all = await fetch("/api/admin/partitions").then(r => r.json());
        const savedRaw = await fetch(`/api/admin/event-partitions/${id}`).then(r => r.json());
        const cleanedSaved = savedRaw.map((s: string) => s.replace(/^"|"$/g, '').trim());
        const uniqueSaved: any = Array.from(new Set(cleanedSaved));
        setPartitions(all.map((p: any) => p.slug));
        setSelected(uniqueSaved);
      } catch (error) {
        console.error("Błąd podczas ładowania:", error);
      }
    }
    if (id) load();
  }, [id]);


  useEffect(() => {
    const formatForInput = (date: Date, hours: string) => {
      const iso = date.toISOString().split('T')[0];
      return `${iso}T${hours}`;
    };

    async function loadData() {
      try {
        const [eventRes, formsRes, templatesRes] = await Promise.all([
          fetch(`/api/events/${id}`),
          fetch(`/api/admin/events/${id}/form-names`),
          fetch("/api/admin/templates")
        ]);

        const eventData = await eventRes.json();
        const formsRawData = await formsRes.json();
        const templatesData = await templatesRes.json();

        const standardizedAvailable = formsRawData.map((f: any) => {
          const name = f.formName || f.name || "";
          return {
            id: String(f.formId || f.id),
            name: String(name)
          };
        });

        setEvent(eventData);
        setTempEventName(eventData.name);
        setTempDomain(eventData.domain || "");
        setExternalDirectoryID(eventData.externalDirectoryID ?? "");
        setQrPrefixes(eventData.qrPrefixes || []);
        setTemplates(templatesData);

        if (eventData.startDate) setStartDate(new Date(eventData.startDate).toISOString().split('T')[0]);
        if (eventData.endDate) setEndDate(new Date(eventData.endDate).toISOString().split('T')[0]);
        if (eventData.entrances) setEntrances(eventData.entrances);

        let finalRules = { ...eventData.ticketRules };

        const hasNoFormsAssigned = !eventData.ticketRules ||
          Object.values(eventData.ticketRules).every((role: any) => !role.forms || role.forms.length === 0);

        if (hasNoFormsAssigned) {
          console.log("Wykryto puste reguły - uruchamiam inteligentne przypisywanie...");
          const eventStart = eventData.startDate ? new Date(eventData.startDate) : null;
          const eventEnd = eventData.endDate ? new Date(eventData.endDate) : null;

          if (eventStart && eventEnd) {
            const autoForms: Record<string, { id: string, name: string }[]> = {
              guest: [], vip: [], exhibitor: [], media: [], speaker: []
            };

            standardizedAvailable.forEach((form: { id: string, name: string }) => {
              const lowerName = (form.name || "").toString().toLowerCase();

              // --- NOWA LOGIKA DLA KATALOGU ---
              if (lowerName.startsWith("katalog:")) {
                if (
                  lowerName.includes("gość") ||
                  lowerName.includes("zaproszenie")
                ) {
                  autoForms.guest.push(form);
                } else if (
                  lowerName.includes("ekspert") ||
                  lowerName.includes("prelegent")
                ) {
                  autoForms.speaker.push(form);
                } else if (
                  lowerName.includes("marketing") ||
                  lowerName.includes("pr") ||
                  lowerName.includes("recepcja") ||
                  lowerName.includes("obsługa gości") ||
                  lowerName.includes("obsługa techniczna") ||
                  lowerName.includes("zarząd") ||
                  lowerName.includes("management") ||
                  lowerName.includes("obsługa stoiska")
                ) {
                  autoForms.exhibitor.push(form);
                } else {
                  // Domyślnie dla reszty z katalogu
                  autoForms.exhibitor.push(form);
                }
              }
              // --- ISTNIEJĄCA LOGIKA DLA REJESTRACJI I BADGE GENERATORA ---
              else if (lowerName.includes("badge generator")) {
                if (lowerName.includes("_vipgold_a6")) {
                  autoForms.vip.push(form);
                } else if (
                  lowerName.includes("_wystawca_a6") ||
                  lowerName.includes("_empty_wystawca_a6") ||
                  lowerName.includes("_obsluga_a6")
                ) {
                  autoForms.exhibitor.push(form);
                } else if (lowerName.includes("_prelegent_a6") || lowerName.includes("_konferencja_a6")) {
                  autoForms.speaker.push(form);
                } else if (lowerName.includes("_media_a6")) {
                  autoForms.media.push(form);
                } else {
                  autoForms.guest.push(form);
                }
              } else if (lowerName.includes("rejestracja wystawców")) {
                autoForms.exhibitor.push(form);
              } else if (
                lowerName.includes("rejestracja en") ||
                lowerName.includes("rejestracja pl") ||
                lowerName.includes("rejestracja cc") ||
                lowerName.includes("rejestracja gości wystawców") ||
                lowerName.includes("call centre") ||
                lowerName.includes("potencjalny wystawca") ||
                lowerName.includes("voucher generator")
              ) {
                autoForms.guest.push(form);
              } else {
                autoForms.guest.push(form);
              }
            });

            const exStart = new Date(eventStart); exStart.setDate(exStart.getDate() - 2);
            const exEnd = new Date(eventEnd); exEnd.setDate(exEnd.getDate() + 2);

            finalRules = {
              guest: { forms: autoForms.guest, start: formatForInput(eventStart, "10:00"), end: formatForInput(eventEnd, "17:00") },
              vip: { forms: autoForms.vip, start: formatForInput(eventStart, "09:00"), end: formatForInput(eventEnd, "18:00") },
              exhibitor: { forms: autoForms.exhibitor, start: formatForInput(exStart, "08:00"), end: formatForInput(exEnd, "20:00") },
              media: { forms: autoForms.media, start: formatForInput(eventStart, "10:00"), end: formatForInput(eventEnd, "17:00") },
              speaker: { forms: autoForms.speaker, start: formatForInput(eventStart, "10:00"), end: formatForInput(eventEnd, "17:00") },
            };
            setTicketRules(finalRules);
          }
        } else {
          // Naprawa istniejących reguł
          const savedRules = { ...eventData.ticketRules };
          Object.keys(savedRules).forEach((role) => {
            if (savedRules[role].forms) {
              savedRules[role].forms = savedRules[role].forms.map((f: any) => {
                if (typeof f === 'string') {
                  return standardizedAvailable.find((sa: any) => sa.name === f) || { id: "unknown", name: f };
                }
                const exactMatch = standardizedAvailable.find((sa: any) =>
                  String(sa.id) === String(f.id || f.formId) && sa.name === (f.name || f.formName)
                );
                return exactMatch || {
                  id: String(f.formId || f.id || "unknown"),
                  name: f.formName || f.name || "Błąd nazwy"
                };
              });
            }
          });
          finalRules = savedRules;
          setTicketRules(finalRules);
        }

        const assignedForms = Object.values(finalRules).flatMap((role: any) => role.forms || []);

        const filteredAvailable = standardizedAvailable.filter((form: any) => {
          return !assignedForms.some((assigned: any) =>
            String(assigned.id) === String(form.id) && assigned.name === form.name
          );
        });

        setAvailableFormNames(filteredAvailable);

      } catch (err) {
        console.error("Błąd podczas ładowania danych eventu:", err);
      }
    }

    loadData();
  }, [id]);

  const handleAddPrefix = () => {
    const val = newPrefix.trim().toLowerCase();
    if (val && !qrPrefixes.includes(val)) {
      setQrPrefixes([...qrPrefixes, val]);
      setNewPrefix("");
    }
  };

  const handleRemovePrefix = (prefixToRemove: string) => {
    setQrPrefixes(qrPrefixes.filter(p => p !== prefixToRemove));
  };

  async function saveEventName() {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", tempEventName);
      formData.append("domain", tempDomain);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("entrances", JSON.stringify(entrances));
      formData.append("qrPrefixes", JSON.stringify(qrPrefixes));
      formData.append("ticketRules", JSON.stringify(ticketRules));
      formData.append("externalDirectoryID", externalDirectoryID.toString());

      if (tempImage) {
        formData.append("image", tempImage);
      }

      const res = await fetch(`/api/admin/events/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (res.ok) {
        const updatedData = await fetch(`/api/events/${id}`).then(r => r.json());
        setEvent(updatedData);
        setIsEditingEventName(false);
        setTempImage(null);
        setPreviewUrl(null);
      } else {
        alert("Błąd zapisu: " + res.status);
      }
    } catch (err) {
      alert("Wystąpił błąd podczas zapisu.");
    } finally {
      setIsSaving(false);
    }
  }

  function toggle(slug: string) {
    setSelected(prev => prev.includes(slug) ? prev.filter(p => p !== slug) : [...prev, slug]);
  }

  async function savePartitions() {
    setIsSaving(true);
    const detectedPrefixes = selected.map(s => s.split('_')[0].toLowerCase());
    const uniquePrefixes = Array.from(new Set([...qrPrefixes, ...detectedPrefixes]));
    setQrPrefixes(uniquePrefixes)

    try {
      const response = await fetch("/api/admin/event-partitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: id, partitions: selected })
      });
      if (!response.ok) throw new Error("Błąd zapisu");
      alert("Zapisano partycje!");
    } catch (err) {
      alert("Błąd zapisu.");
    } finally {
      setIsSaving(false);
    }
  }

  async function reconcileTickets() {
    if (!confirm("Czy chcesz zaktualizować typy biletów dla wszystkich rekordów na podstawie nowych reguł?")) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/events/${id}/reconcile`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert(`Sukces! Zaktualizowano ${data.updatedCount} biletów.`);
      } else {
        alert("Błąd: " + data.error);
      }
    } catch (err) {
      alert("Wystąpił błąd podczas aktualizacji.");
    } finally {
      setIsSaving(false);
    }
  }

  function getTranslation(arr: any[], locale: string, field: "title" | "label") {
    return arr?.find((t: any) => t.locale === locale)?.[field] || "";
  }

  async function deleteStep(stepId: string) {
    if (!confirm("Usunąć krok?")) return;
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
    setEditOptions(step.options.map((o: any) => ({
      id: o.id,
      value: o.value,
      translations: {
        pl: getTranslation(o.translations, "pl", "label"),
        en: getTranslation(o.translations, "en", "label"),
      },
      iconUrl: o.iconUrl,
      icon: null,
    })));
  };

  async function addStep() {
    const form = new FormData();
    const isTechnical = type === "FORM" || type === "CONSENT";
    form.append("type", type);
    form.append("title[pl]", isTechnical && !title.pl ? (type === "FORM" ? "Formularz" : "Zgody") : title.pl);
    form.append("title[en]", isTechnical && !title.en ? (type === "FORM" ? "Form" : "Consents") : title.en);

    if (!isTechnical) {
      newOptions.forEach((o, i) => {
        form.append(`options[${i}][value]`, o.value || "");
        form.append(`options[${i}][label][pl]`, o.translations.pl || "");
        form.append(`options[${i}][label][en]`, o.translations.en || "");
        if (o.icon) form.append(`options[${i}][icon]`, o.icon);
      });
    }
    const res = await fetch(`/api/admin/events/${id}/steps`, { method: "POST", body: form });
    if (res.ok) location.reload();
  }

  async function updateStep() {
    if (!editingStep) return;
    const formData = new FormData();
    formData.append("type", editType);
    formData.append("order", editOrder.toString());
    formData.append("title[pl]", editTitle.pl);
    formData.append("title[en]", editTitle.en);

    deletedOptionIds.forEach((id, index) => formData.append(`deleteOptions[${index}]`, id));

    if (editType !== "FORM" && editType !== "CONSENT") {
      editOptions.forEach((o, i) => {
        if (o.id) formData.append(`options[${i}][id]`, o.id);
        formData.append(`options[${i}][value]`, o.value || `option_${i}`);
        formData.append(`options[${i}][label][pl]`, o.translations.pl || "");
        formData.append(`options[${i}][label][en]`, o.translations.en || "");
        if (o.icon instanceof File) formData.append(`options[${i}][icon]`, o.icon);
      });
    }

    const res = await fetch(`/api/admin/steps/${editingStep.id}`, { method: "PUT", body: formData });
    if (res.ok) location.reload();
  }

  const reorderSteps = async (stepId: string, newOrder: number) => {
    const sortedSteps = [...event.steps].sort((a, b) => a.order - b.order);
    const oldIndex = sortedSteps.findIndex(s => s.id === stepId);
    if (oldIndex === -1) return;
    const movedItem = sortedSteps.splice(oldIndex, 1)[0];
    sortedSteps.splice(newOrder - 1, 0, movedItem);

    const updates = sortedSteps.map((step, index) => ({ id: step.id, order: index + 1 }));
    await fetch(`/api/events/${id}/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates })
    });
    location.reload();
  };

  const handleAddEntrance = () => {
    const val = newEntrance.trim().toUpperCase();
    if (val && !entrances.includes(val)) {
      setEntrances([...entrances, val]);
      setNewEntrance("");
    }
  };

  if (!event) return <div className="p-10 text-center">Ładowanie…</div>;

  const opts = editingStep ? editOptions : newOptions;
  const setOpts = editingStep ? setEditOptions : setNewOptions;
  const currentTitle = editingStep ? editTitle : title;
  const setCurrentTitle = editingStep ? setEditTitle : setTitle;

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-8xl mx-auto space-y-8">

        <div className="bg-white/40 p-6 rounded-[2.5rem] border border-white shadow-sm">
          {isEditingEventName ? (
            <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in-95">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 flex items-center justify-center shadow-inner">
                    {previewUrl || event.imageUrl ? (
                      <img src={previewUrl || event.imageUrl} className="w-full h-full object-cover" alt="Podgląd" />
                    ) : (
                      <span className="text-[10px] font-black text-slate-400 uppercase text-center p-2">Dodaj foto kafelka</span>
                    )}
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setTempImage(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-lg text-xs shadow-lg">📸</div>
                </div>

                <div className="space-y-3 flex-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Nazwa Wydarzenia</label>
                  <input
                    className="w-full bg-white border-2 border-blue-100 px-5 py-3 rounded-2xl font-black text-2xl outline-none focus:border-blue-500 shadow-sm"
                    value={tempEventName}
                    onChange={(e) => setTempEventName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/60 rounded-3xl border border-blue-50/50">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Custom Domain (opcjonalnie)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 text-sm font-bold">https://</span>
                    </div>
                    <input
                      placeholder="np. aktywacja.warsawpack.pl"
                      className="w-full bg-white border-2 border-slate-100 pl-20 pr-5 py-3 rounded-xl font-bold text-sm outline-none focus:border-blue-500"
                      value={tempDomain}
                      onChange={(e) => setTempDomain(e.target.value)}
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 ml-1 italic font-medium">* Jeśli puste, system użyje sluga wydarzenia.</p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Zakres trwania eventu</label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <p className="text-[9px] font-bold text-slate-400 mb-1 uppercase ml-1">Od:</p>
                      <input type="date" className="w-full bg-white border-2 border-slate-100 p-3 rounded-xl font-bold text-sm outline-none focus:border-blue-500" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-bold text-slate-400 mb-1 uppercase ml-1">Do:</p>
                      <input type="date" className="w-full bg-white border-2 border-slate-100 p-3 rounded-xl font-bold text-sm outline-none focus:border-blue-500" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Wejścia (np. D8, C16)</label>
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
                    {entrances.map(ent => (
                      <span key={ent} className="bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-2">
                        {ent}
                        <button onClick={() => setEntrances(entrances.filter(e => e !== ent))} className="text-white/50 hover:text-red-400 transition-colors">✕</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      placeholder="Wpisz kod i Enter..."
                      className="flex-1 bg-white border-2 border-slate-100 p-3 rounded-xl font-bold text-sm outline-none focus:border-blue-500 uppercase"
                      value={newEntrance}
                      onChange={(e) => setNewEntrance(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEntrance())}
                    />
                    <button onClick={handleAddEntrance} className="bg-blue-600 text-white px-5 rounded-xl font-black text-xs hover:bg-blue-700 transition-all">+</button>
                  </div>
                </div>

                {/* --- SEKCJA TECHNICZNA: EXTERNAL ID & BADGES --- */}
                <div className="space-y-3 border-t border-blue-50/50 pt-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    External Directory ID (Sync)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="ID z bazy zewnętrznej..."
                      className="flex-1 bg-white border-2 border-slate-100 p-3 rounded-xl font-bold text-sm outline-none focus:border-blue-500"
                      value={externalDirectoryID}
                      onChange={(e) => setExternalDirectoryID(e.target.value === "" ? "" : parseInt(e.target.value))}
                    />
                    <button
                      onClick={handleSyncCatalog}
                      disabled={isSaving}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase hover:bg-blue-600 disabled:bg-slate-300 transition-colors shadow-sm"
                    >
                      {isSaving ? "SYNC..." : "Sync Katalog"}
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-400 ml-1 italic font-medium">Pobranie z bazy danych wordpress (pełny import)</p>
                </div>

                {/* NOWA SEKCJA: NAPRAWA BRAKUJĄCYCH DANYCH */}
                <div className="space-y-3 border-t border-blue-50/50 pt-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    Naprawa spójności bazy
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleReconcile}
                      disabled={isSaving}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase hover:bg-black disabled:bg-slate-300 transition-all shadow-sm flex items-center gap-2"
                    >
                      {isSaving ? "Przetwarzanie..." : "Uzupełnij brakujące dane (Batch 1000)"}
                    </button>
                    {/* Status info obok przycisku */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">Synchronizacja selektywna</span>
                      <span className="text-[9px] text-slate-400 italic">Pobiera formName i adresy dla pustych rekordów</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border-t border-blue-50/50 pt-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                    Dozwolone Badge QR <span className="text-[8px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded italic">Walidacja</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
                    {qrPrefixes.map(prefix => (
                      <span key={prefix} className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-2 shadow-sm">
                        {prefix}
                        <button onClick={() => handleRemovePrefix(prefix)} className="text-white/50 hover:text-white transition-colors">✕</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      placeholder="np. mtsl..."
                      className="flex-1 bg-white border-2 border-slate-100 p-3 rounded-xl font-bold text-sm outline-none focus:border-blue-500 lowercase"
                      value={newPrefix}
                      onChange={(e) => setNewPrefix(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPrefix())}
                    />
                    <button onClick={handleAddPrefix} className="bg-slate-900 text-white px-5 rounded-xl font-black text-xs hover:bg-black transition-all">Dodaj</button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={saveEventName} disabled={isSaving} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100">
                  {isSaving ? "Zapisywanie..." : "✓ Zapisz wszystkie zmiany"}
                </button>
                <button onClick={() => { setIsEditingEventName(false); setPreviewUrl(null); setTempImage(null); }} className="bg-slate-100 text-slate-400 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">Anuluj</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-5">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl border-4 border-white shrink-0">
                  {event.imageUrl ? (
                    <img src={event.imageUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-3xl">🗓️</div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-black tracking-tight text-slate-800">{event.name}</h1>
                    <button onClick={() => { setTempEventName(event.name); setTempDomain(event.domain || ""); setIsEditingEventName(true); }} className="p-2 hover:bg-white rounded-full transition-colors text-slate-300 hover:text-blue-600">✏️</button>
                  </div>
                  <div className="flex flex-col gap-1.5 mt-2">
                    <div className="flex items-center gap-4">
                      {event.startDate && (
                        <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                            {new Date(event.startDate).toLocaleDateString('pl-PL')} — {new Date(event.endDate).toLocaleDateString('pl-PL')}
                          </span>
                        </div>
                      )}
                      {event.domain && (
                        <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                            🌍 {event.domain}
                          </span>
                        </div>
                      )}
                      {/* PODGLĄD EXTERNAL ID W TRYBIE ODCZYTU */}
                      {event.externalDirectoryID && (
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            🆔 ID: {event.externalDirectoryID}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      {event.entrances?.map((en: string) => (
                        <span key={en} className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md text-[9px] font-black uppercase">{en}</span>
                      ))}
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {event.qrPrefixes?.map((prefix: string) => (
                        <span key={prefix} className="bg-blue-50 text-blue-500 px-2 py-0.5 rounded-md text-[9px] font-black uppercase border border-blue-100/50">
                          Badge: {prefix}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-white shadow-xl shadow-blue-900/5 rounded-[2rem] p-3 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex gap-2">
            <select className="flex-1 bg-slate-50 border-none px-5 py-3 rounded-2xl text-sm font-medium focus:ring-2 ring-blue-500/20 outline-none appearance-none cursor-pointer" value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
              <option value="">📂 Wybierz istniejący szablon...</option>
              {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button onClick={loadTemplate} className="bg-slate-900 hover:bg-black text-white px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Wczytaj</button>
          </div>
          <div className="hidden md:block w-px h-8 bg-slate-200 self-center" />
          <div className="flex-1 flex gap-2">
            <input className="flex-1 bg-slate-50 border-none px-5 py-3 rounded-2xl text-sm font-medium focus:ring-2 ring-emerald-500/20 outline-none" placeholder="Nazwij konfigurację..." value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
            <button onClick={saveTemplate} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Zapisz</button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-blue-900/5 overflow-hidden transition-all duration-300">
          {/* NAGŁÓWEK - Klikalna strefa */}
          <div
            onClick={() => setIsPartitionsOpen(!isPartitionsOpen)}
            className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform duration-300 ${isPartitionsOpen ? 'rotate-90' : ''}`}>
                <span className="text-lg">🔌</span>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Połączone bazy danych</h3>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {selected.length > 0 ? (
                    selected.map(slug => (
                      <span key={slug} className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded-lg border border-blue-100 uppercase">
                        {slug}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold uppercase italic tracking-tight">Brak wybranych partycji</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={savePartitions}
                disabled={isSaving}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${isSaving
                  ? "bg-slate-50 text-slate-300"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100 active:scale-95"
                  }`}
              >
                {isSaving ? "Zapisywanie..." : "Zapisz powiązania"}
              </button>
            </div>
          </div>

          {/* SEKCJA ROZWIJANA */}
          {isPartitionsOpen && (
            <div className="p-8 pt-0 border-t border-slate-50 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="my-6 relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-sm">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Wyszukaj partycję (np. expo, festival)..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-blue-600 text-[10px] font-black uppercase tracking-widest"
                  >
                    Wyczyść
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {filteredPartitions.length > 0 ? (
                  filteredPartitions.map((slug) => {
                    const isSelected = selected.includes(slug);
                    return (
                      <div
                        key={slug}
                        onClick={() => toggle(slug)}
                        className={`group cursor-pointer flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 ${isSelected
                          ? "bg-blue-600 border-blue-600 shadow-md shadow-blue-100"
                          : "bg-white border-slate-100 hover:border-blue-200 hover:bg-blue-50/30"
                          }`}
                      >
                        <span className={`text-[11px] font-black truncate uppercase tracking-tight ${isSelected ? "text-white" : "text-slate-600"
                          }`}>
                          {slug}
                        </span>
                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors ${isSelected
                          ? "bg-white border-white"
                          : "bg-slate-50 border-slate-200 group-hover:border-blue-300"
                          }`}>
                          {isSelected && <span className="text-blue-600 text-[10px] font-bold">✓</span>}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-12 text-center">
                    <div className="text-4xl mb-2">🤷‍♂️</div>
                    <p className="text-slate-400 text-xs font-bold uppercase">Brak partycji pasujących do "{searchTerm}"</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- SEKCJA AUTOMATYZACJI BILETÓW (4 KOLUMNY) --- */}
        <div className="bg-white/40 rounded-[2.5rem] border border-white shadow-sm overflow-hidden transition-all duration-300">
          {/* NAGŁÓWEK */}
          <div
            onClick={() => setIsTicketRulesOpen(!isTicketRulesOpen)}
            className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/40 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm text-white bg-blue-600 transition-transform duration-300 ${isTicketRulesOpen ? 'rotate-90' : ''}`}>
                <span className="text-lg">➔</span>
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-800">Kategorie Biletów</h2>
                <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest mt-0.5">
                  {isTicketRulesOpen ? "Automatyczne mapowanie formularzy i czas wejścia" : "Kliknij, aby zarządzać regułami biletów i czasem wejścia"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  fetch(`/api/admin/events/${id}/form-names`).then(res => res.json()).then(setAvailableFormNames);
                }}
                className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-blue-600 transition-all text-[10px] font-black uppercase flex items-center gap-2"
              >
                🔄 Odśwież
              </button>
            </div>
          </div>

          {isTicketRulesOpen && (
            <div className="p-8 pt-0 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <DragDropContext onDragEnd={onDragEnd}>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {(['guest', 'vip', 'exhibitor', 'media', 'speaker'] as const).map((role) => {
                    const roleConfig = {
                      guest: { icon: User, color: 'bg-emerald-500', label: 'Gość' },
                      vip: { icon: Crown, color: 'bg-indigo-600', label: 'VIP / Bez Aktywacji' },
                      exhibitor: { icon: HardHat, color: 'bg-blue-600', label: 'Wystawca' },
                      media: { icon: Camera, color: 'bg-purple-500', label: 'Media' },
                      speaker: { icon: Mic2, color: 'bg-amber-500', label: 'Prelegent' },
                    };

                    const Config = roleConfig[role];
                    const IconComponent = Config.icon;

                    return (
                      <div key={role} className="bg-white/60 rounded-[2rem] border border-blue-50 p-5 space-y-4 flex flex-col shadow-sm hover:shadow-md transition-all min-h-[500px]">
                        <div className="flex items-center gap-3 border-b border-blue-100/50 pb-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm text-white ${Config.color}`}>
                            <IconComponent size={20} strokeWidth={2.5} />
                          </div>
                          <div>
                            <h4 className="font-black text-sm uppercase tracking-tighter text-slate-800">{role}</h4>
                            <span className="text-[9px] font-bold text-slate-400 uppercase">{Config.label}</span>
                          </div>
                        </div>


                        <div className="space-y-3 bg-white/40 p-3 rounded-2xl border border-white/50">
                          <div className="space-y-2">
                            <div>
                              <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Start</label>
                              <input
                                type="datetime-local"
                                className="w-full bg-white border border-slate-100 p-2 rounded-lg text-[10px] font-bold outline-none focus:border-blue-500"
                                value={ticketRules[role]?.start || ""}
                                onChange={(e) => setTicketRules({ ...ticketRules, [role]: { ...ticketRules[role], start: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Koniec</label>
                              <input
                                type="datetime-local"
                                className="w-full bg-white border border-slate-100 p-2 rounded-lg text-[10px] font-bold outline-none focus:border-blue-500"
                                value={ticketRules[role]?.end || ""}
                                onChange={(e) => setTicketRules({ ...ticketRules, [role]: { ...ticketRules[role], end: e.target.value } })}
                              />
                            </div>
                          </div>
                        </div>


                        <Droppable droppableId={role}>
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className={`flex-1 min-h-[150px] bg-slate-50/50 rounded-2xl border-2 border-dashed transition-all p-2 space-y-2 ${snapshot.isDraggingOver ? 'border-blue-400 bg-blue-50/50 scale-[1.02]' : 'border-slate-200'}`}
                            >
                              {ticketRules[role]?.forms?.map((formObj: any, index: number) => {
                                const safeName = formObj.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                                const uniqueId = `${formObj.id}-${safeName}`;

                                return (
                                  <Draggable key={`${role}-${uniqueId}`} draggableId={`drag-${role}-${uniqueId}`} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`group relative bg-white border border-slate-200 p-3 rounded-xl text-[10px] font-bold text-slate-600 shadow-sm flex items-center justify-between hover:border-blue-300 transition-all ${snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-500/20' : ''}`}
                                      >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                          <span className="truncate" title={formObj.name}>{formObj.name}</span>
                                          <span className="text-[7px] opacity-30 font-mono shrink-0">[{formObj.id}]</span>
                                        </div>
                                        <button
                                          onClick={() => {
                                            const newForms = ticketRules[role].forms.filter((f: any) => !(f.id === formObj.id && f.name === formObj.name));
                                            setTicketRules({ ...ticketRules, [role]: { ...ticketRules[role], forms: newForms } });
                                            setAvailableFormNames(prev => [...prev, formObj]);
                                          }}
                                          className="text-slate-300 hover:text-red-500 ml-2"
                                        >✕</button>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    );
                  })}
                </div>


                <div className="mt-10 p-8 bg-slate-900/[0.03] rounded-[3rem] border border-dashed border-slate-200">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 text-center">Dostępne Formularze (Zasobnik)</h3>

                  <Droppable droppableId="available" direction="horizontal">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex flex-wrap gap-3 justify-center min-h-[80px] p-4 rounded-3xl transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''}`}
                      >

                        {availableFormNames.map((form, index) => {
                          const safeName = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                          const uniqueId = `${form.id}-${safeName}`;

                          return (
                            <Draggable key={`avail-${uniqueId}`} draggableId={`drag-available-${uniqueId}`} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`group relative flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 text-[10px] font-black text-blue-600 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-grab ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                >
                                  <span className="truncate max-w-[150px] inline-block" title={form.name}>{form.name}</span>
                                  <span className="text-[8px] opacity-40 font-mono shrink-0">[{form.id}]</span>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </DragDropContext>

              <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">

                <button
                  onClick={reconcileTickets}
                  disabled={isSaving}
                  className={`px-10 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest transition-all ${isSaving
                    ? "bg-slate-400"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
                    }`}
                >
                  {isSaving ? "🔄 Przetwarzanie..." : "⚡ Aktualizuj typy biletów"}
                </button>

                <button
                  onClick={saveEventName}
                  disabled={isSaving}
                  className={`px-10 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest transition-all ${isSaving
                    ? "bg-slate-400"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                    }`}
                >
                  {isSaving ? "🔄 Zapisywanie..." : "💾 Zapisz konfigurację"}
                </button>
              </div>
            </div>
          )}
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between px-6 py-2">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-800">Struktura procesu</h2>
                <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest mt-1">Kolejne etapy rejestracji uczestnika</p>
              </div>
              <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                {event.steps.length} Etapów
              </div>
            </div>

            <div className="space-y-4">
              {event.steps.sort((a: any, b: any) => a.order - b.order).map((step: any) => {
                const isOpen = openStepId === step.id;

                return (
                  <div
                    key={step.id}
                    className={`group transition-all duration-300 rounded-[2.5rem] border ${isOpen ? 'bg-white border-blue-200 shadow-2xl shadow-blue-900/5' : 'bg-white/50 border-slate-100 hover:border-blue-100 shadow-sm'
                      }`}
                  >
                    <div
                      onClick={() => setOpenStepId(isOpen ? null : step.id)}
                      className="p-5 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 shrink-0 rounded-2xl flex flex-col items-center justify-center transition-colors ${isOpen ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'
                          }`}>
                          <span className="text-[8px] font-black uppercase opacity-60 leading-none mb-1">Krok</span>
                          <span className="text-lg font-black leading-none">{step.order}</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[8px] font-black text-slate-500 uppercase tracking-tighter">
                              {step.type.replace('_', ' ')}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-800 leading-tight mt-1">
                            <span dangerouslySetInnerHTML={{ __html: getTranslation(step.translations, "pl", "title") }} />
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); editStep(step); }}
                          className="p-2.5 hover:bg-blue-50 text-blue-600 rounded-xl transition-all"
                          title="Edytuj szczegóły"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteStep(step.id); }}
                          className="p-2.5 hover:bg-red-50 text-red-600 rounded-xl transition-all"
                        >
                          🗑
                        </button>
                        <div className={`ml-2 text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                          ▼
                        </div>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="px-8 pb-8 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="h-px bg-slate-100 mb-6" />
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Podgląd opcji:</label>
                          {step.options && step.options.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {step.options.map((opt: any) => (
                                <div key={opt.id} className="flex items-center gap-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                                  {opt.iconUrl && <img src={opt.iconUrl} className="w-5 h-5 object-contain" alt="" />}
                                  <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-tight">
                                    {getTranslation(opt.translations, "pl", "label")}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs italic text-slate-400">Ten krok nie posiada opcji wyboru (np. formularz lub zgody).</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                onClick={() => { setEditingStep(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 text-xs font-black uppercase tracking-[0.2em] hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
              >
                + Dodaj nowy krok do procesu
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 sticky top-10">
            <div className={`transition-all duration-500 rounded-[3rem] border-2 p-8 space-y-8 ${editingStep
              ? "bg-white border-blue-500 shadow-2xl shadow-blue-200 scale-100"
              : "bg-slate-50/50 border-slate-200 shadow-sm scale-[0.98]"
              }`}>
              <header className="flex justify-between items-start">
                <div>
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-2 inline-block ${editingStep ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                    }`}>
                    {editingStep ? "Tryb Edycji" : "Kreator"}
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tighter">
                    {editingStep ? "Edytuj krok" : "Nowy element"}
                  </h2>
                </div>
                {editingStep && (
                  <button onClick={() => setEditingStep(null)} className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors">
                    ✕
                  </button>
                )}
              </header>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Typologia</label>
                    <select className="w-full bg-white border-2 border-slate-100 p-4 rounded-2xl font-black text-xs outline-none focus:border-blue-500 transition-all cursor-pointer shadow-sm" value={editingStep ? editType : type} onChange={(e) => editingStep ? setEditType(e.target.value as any) : setType(e.target.value as any)}>
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
                      <select className="w-full bg-blue-50 border-2 border-blue-100 p-4 rounded-2xl font-black text-xs text-blue-600 outline-none shadow-sm" value={editOrder} onChange={(e) => reorderSteps(editingStep.id, Number(e.target.value))}>
                        {event.steps.sort((a: any, b: any) => a.order - b.order).map((_: any, i: number) => (
                          <option key={i + 1} value={i + 1}>Pozycja {i + 1} {editingStep.order === i + 1 ? "(Obecna)" : ""}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full bg-slate-100 p-4 rounded-2xl font-black text-xs text-slate-400 text-center border-2 border-transparent">
                        AUTO ({event.steps.length + 1})
                      </div>
                    )}
                  </div>
                </div>

                {!(["FORM", "CONSENT"].includes(editingStep ? editType : type)) && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Treść pytania (PL)</label>
                      <input className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all shadow-sm" placeholder="Np. Wybierz swój pakiet" value={currentTitle.pl} onChange={(e) => setCurrentTitle({ ...currentTitle, pl: e.target.value })} />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 ml-1">Opcje odpowiedzi</label>
                        <button onClick={() => setOpts([...opts, { value: "", translations: { pl: "", en: "" }, icon: null }])} className="text-[9px] font-black bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-slate-900 transition-colors shadow-lg shadow-blue-200">+ DODAJ</button>
                      </div>

                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {opts.map((o, i) => (
                          <div key={i} className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 relative group/opt transition-all hover:bg-white hover:shadow-md">
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <input placeholder="PL" className="bg-white border border-slate-100 p-3 rounded-xl text-[11px] font-bold outline-none focus:border-blue-400" value={o.translations.pl} onChange={(e) => { const n = [...opts]; n[i] = { ...n[i], translations: { ...n[i].translations, pl: e.target.value } }; setOpts(n); }} />
                              <input placeholder="EN" className="bg-white border border-slate-100 p-3 rounded-xl text-[11px] font-bold outline-none text-slate-400 focus:border-blue-400" value={o.translations.en} onChange={(e) => { const n = [...opts]; n[i] = { ...n[i], translations: { ...n[i].translations, en: e.target.value } }; setOpts(n); }} />
                            </div>
                            <div className="flex gap-2">
                              <input placeholder="KOD (ID)" className="flex-1 bg-slate-200/50 p-2.5 rounded-xl text-[9px] font-mono font-bold outline-none" value={o.value} onChange={(e) => { const n = [...opts]; n[i] = { ...n[i], value: e.target.value }; setOpts(n); }} />
                              {(editingStep ? editType : type) === "MULTI_CHOICE_ICON" && (
                                <div className="relative bg-white px-4 py-2 rounded-xl border-2 border-dashed border-slate-200 flex items-center gap-2 hover:border-blue-400 transition-colors cursor-pointer">
                                  {o.iconUrl ? <img src={o.iconUrl} className="w-4 h-4 object-contain" alt="" /> : "🖼️"}
                                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { const file = e.target.files?.[0] || null; const n = [...opts]; n[i] = { ...n[i], icon: file }; setOpts(n); }} />
                                </div>
                              )}
                            </div>
                            <button onClick={() => setOpts(opts.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 w-7 h-7 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center text-xs shadow-md opacity-0 group-hover/opt:opacity-100 transition-all hover:bg-red-500 hover:text-white">✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                {editingStep ? (
                  <div className="space-y-3">
                    <button onClick={updateStep} className="w-full bg-blue-600 text-white py-5 rounded-[1.8rem] font-black text-xs tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 uppercase">Zatwierdź zmiany</button>
                    <button onClick={() => setEditingStep(null)} className="w-full bg-slate-100 text-slate-400 py-4 rounded-[1.8rem] font-black text-xs tracking-widest hover:bg-slate-200 transition-all uppercase">Anuluj edycję</button>
                  </div>
                ) : (
                  <button onClick={addStep} className="w-full bg-slate-900 text-white py-6 rounded-[1.8rem] font-black text-xs tracking-[0.2em] shadow-2xl shadow-slate-300 hover:bg-black transition-all active:scale-95 uppercase">
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