"use client";

import { useState } from "react";

type Option = {
  id: string;
  label: string;
};

type Props = {
  title: string;
  options: Option[];
  onNext: (optionId: string) => void;
};

export default function SingleChoice({
  title,
  options,
  onNext,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="space-y-6 w-full max-w-md">
      <h2 className="text-2xl font-bold">{title}</h2>

      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => setSelectedId(o.id)}
          className={`btn w-full ${selectedId === o.id ? "bg-black text-white" : ""
            }`}
        >
          {o.label}
        </button>
      ))}

      <button
        disabled={!selectedId}
        className="btn"
        onClick={() => selectedId && onNext(selectedId)}
      >
        Przejdź dalej
      </button>
    </div>
  );
}
