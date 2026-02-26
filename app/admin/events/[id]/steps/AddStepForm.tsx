"use client";

import { useState } from "react";

export default function AddStepForm({ eventId }: { eventId: string }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("SINGLE_CHOICE");

  async function addStep() {
    await fetch(`/api/admin/events/${eventId}/steps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, type }),
    });
    location.reload();
  }

  return (
    <div>
      <h3>Dodaj krok</h3>

      <input
        placeholder="Tytuł (np. Kim jesteś?)"
        onChange={e => setTitle(e.target.value)}
      />

      <select onChange={e => setType(e.target.value)}>
        <option value="SINGLE_CHOICE">Single choice</option>
        <option value="MULTI_CHOICE">Multi choice</option>
        <option value="MULTI_CHOICE_ICON">Multi choice (ikony)</option>
        <option value="FORM">Formularz</option>
        <option value="CONSENT">Zgody</option>
      </select>

      <button onClick={addStep}>Dodaj krok</button>
    </div>
  );
}
