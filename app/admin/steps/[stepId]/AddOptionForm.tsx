"use client";

import { useState } from "react";

export default function AddOptionForm({ step }: { step: any }) {
  const [labelPl, setLabelPl] = useState("");
  const [labelEn, setLabelEn] = useState("");
  const [value, setValue] = useState("");
  const [icon, setIcon] = useState<File | null>(null);

  async function addOption() {
    const form = new FormData();

    form.append("value", value);
    form.append("label[pl]", labelPl);
    form.append("label[en]", labelEn);

    if (icon) form.append("icon", icon);

    await fetch(`/api/admin/steps/${step.id}/options`, {
      method: "POST",
      body: form,
    });

    location.reload();
  }

  return (
    <div className="space-y-2">
      <input
        placeholder="Label PL"
        onChange={e => setLabelPl(e.target.value)}
      />

      <input
        placeholder="Label EN"
        onChange={e => setLabelEn(e.target.value)}
      />

      <input
        placeholder="Value"
        onChange={e => setValue(e.target.value)}
      />

      {step.type === "MULTI_CHOICE_ICON" && (
        <input
          type="file"
          onChange={e => setIcon(e.target.files?.[0] || null)}
        />
      )}

      <button onClick={addOption}>Dodaj opcję</button>
    </div>
  );
}