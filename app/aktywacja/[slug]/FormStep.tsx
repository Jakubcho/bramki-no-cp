"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import 'react-phone-number-input/style.css';

const PhoneInput = dynamic(() => import('react-phone-number-input'), { ssr: false });

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  street: string;
  buildingNumber: string;
  postalCode: string;
  city: string;
  country: string;
};

const dict = {
  pl: {
    firstName: "Imię",
    lastName: "Nazwisko",
    email: "Adres e-mail",
    phone: "Numer telefonu",
    street: "Ulica",
    building: "Nr budynku",
    postal: "Kod pocztowy",
    city: "Miasto",
    country: "Kraj",
  },
  en: {
    firstName: "First Name",
    lastName: "Last Name",
    email: "E-mail address",
    phone: "Phone number",
    street: "Street",
    building: "Building No.",
    postal: "Postal Code",
    city: "City",
    country: "Country",
  },
};

export default function FormStep({
  value,
  onChange,
  lang,
}: {
  value: FormData;
  onChange: (v: FormData) => void;
  lang: "pl" | "en";
}) {

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function update<K extends keyof FormData>(key: K, val: FormData[K]) {
    onChange({ ...value, [key]: val });
  }

  const t = dict[lang];
  if (!mounted) return null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          placeholder={t.firstName}
          className="border-2 border-slate-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
          value={value.firstName}
          onChange={(e) => update("firstName", e.target.value)}
        />
        <input
          required
          placeholder={t.lastName}
          className="border-2 border-slate-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
          value={value.lastName}
          onChange={(e) => update("lastName", e.target.value)}
        />
      </div>

      <input
        required
        type="email"
        placeholder={t.email}
        className="w-full border-2 border-slate-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
        value={value.email}
        onChange={(e) => update("email", e.target.value)}
      />

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          {t.phone}
        </label>
        <div className="phone-wrapper">
          <PhoneInput
            international
            defaultCountry="PL"
            placeholder={t.phone}
            // Ważne: przekazujemy tylko JEDNĄ wartość
            value={value.phone}
            onChange={(val) => {
              // val będzie zawierać pełny numer (np. +48123456789)
              update("phone", val || "");
              // Jeśli Twoja baza WYMAGA phoneCode osobno, musisz go wyciąć,
              // ale dla formularza lepiej trzymać to w jednym polu "phone"
            }}
            className="flex gap-2"
            numberInputProps={{
              className: "flex-1 border-2 border-slate-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-sm"
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <input
          required
          placeholder={t.street}
          className="col-span-2 border-2 border-slate-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
          value={value.street}
          onChange={(e) => update("street", e.target.value)}
        />
        <input
          required
          placeholder={t.building}
          className="border-2 border-slate-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
          value={value.buildingNumber}
          onChange={(e) => update("buildingNumber", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <input
          required
          placeholder={t.postal}
          className="border-2 border-slate-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
          value={value.postalCode}
          onChange={(e) => update("postalCode", e.target.value)}
        />
        <input
          required
          placeholder={t.city}
          className="col-span-2 border-2 border-slate-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
          value={value.city}
          onChange={(e) => update("city", e.target.value)}
        />
      </div>

      <input
        required
        placeholder={t.country}
        className="w-full border-2 border-slate-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
        value={value.country}
        onChange={(e) => update("country", e.target.value)}
      />
    </div>

  );
}

export function isFormValid(v: FormData) {
  return Object.values(v).every((x) => x && String(x).trim().length > 0);
}