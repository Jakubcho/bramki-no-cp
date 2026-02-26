"use client";
import { useState } from "react";

type Option = {
  id: string;
  label: string;
};

type Props = {
  title: string;
  options: Option[];
  onNext: (values: string[]) => void;
};

export default function MultiChoice({ title, options, onNext }: Props) {
  const [values, setValues] = useState<string[]>([]);

  const toggle = (v: string) =>
    setValues((prev) =>
      prev.includes(v)
        ? prev.filter((x) => x !== v)
        : [...prev, v]
    );

  return (
    <div className="space-y-6 w-full max-w-md">
      <h2 className="text-2xl font-bold">{title}</h2>

      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => toggle(o.id)}
          className={`btn w-full ${values.includes(o.id) ? "bg-black text-white" : ""
            }`}
        >
          {o.label}
        </button>
      ))}

      <button
        disabled={!values.length}
        className="btn"
        onClick={() => onNext(values)}
      >
        Przejdź dalej
      </button>
    </div>
  );
}
