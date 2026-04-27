"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from 'next/dynamic';
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import 'react-phone-number-input/style.css';

const PhoneInput = dynamic(() => import('react-phone-number-input'), { ssr: false });

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  buildingNumber: string;
  postalCode: string;
  city: string;
  country: string;
};

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const dict = {
  pl: {
    firstName: "Imię",
    lastName: "Nazwisko",
    email: "Adres e-mail",
    phone: "Numer telefonu",
    street: "Ulica (zacznij pisać...)",
    building: "Nr",
    postal: "Kod",
    city: "Miasto",
    country: "Kraj",
  },
  en: {
    firstName: "First Name",
    lastName: "Last Name",
    email: "E-mail address",
    phone: "Phone number",
    street: "Street (start typing...)",
    building: "No.",
    postal: "Zip",
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
  const [emailError, setEmailError] = useState(false);
  const streetInputRef = useRef<HTMLInputElement>(null);
  const isInitialized = useRef(false);


  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);


  useEffect(() => {
    if (!value.street && value.buildingNumber && value.buildingNumber.includes(" ")) {
      const parts = value.buildingNumber.trim().split(" ");
      if (parts.length > 1) {
        const newBuildingNumber = parts.pop() || "";
        const newStreet = parts.join(" ");

        onChange({
          ...value,
          street: newStreet,
          buildingNumber: newBuildingNumber
        });
      }
    }
  }, [value.street, value.buildingNumber, value, onChange]);


  useEffect(() => {
    setMounted(true);
    const initGoogle = async () => {
      if (isInitialized.current || !GOOGLE_MAPS_API_KEY) return;
      try {
        setOptions({ key: GOOGLE_MAPS_API_KEY });
        const { Autocomplete } = await importLibrary("places") as google.maps.PlacesLibrary;

        if (streetInputRef.current) {
          const autocomplete = new Autocomplete(streetInputRef.current, {
            types: ["address"],
            componentRestrictions: { country: "PL" },
            fields: ["address_components"],
          });

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.address_components) return;

            let street = "", house = "", city = "", postCode = "", country = "";

            place.address_components.forEach((c) => {
              const types = c.types;
              if (types.includes("route")) street = c.long_name;
              else if (types.includes("street_number")) house = c.long_name;
              else if (types.includes("locality")) city = c.long_name;
              else if (types.includes("postal_code")) postCode = c.long_name;
              else if (types.includes("country")) country = c.long_name;
            });

            if (country === "Poland") country = "Polska";

            onChange({
              ...valueRef.current,
              street: street || valueRef.current.street,
              buildingNumber: house || valueRef.current.buildingNumber,
              city: city || valueRef.current.city,
              postalCode: postCode || valueRef.current.postalCode,
              country: country || valueRef.current.country,
            });
          });
          isInitialized.current = true;
        }
      } catch (err) {
        console.error("Google Maps API Error:", err);
      }
    };
    initGoogle();
  }, [onChange]);

  const update = <K extends keyof FormData>(key: K, val: FormData[K]) => {
    let finalValue = val;

    if (key === "phone" && typeof val === "string" && val.length > 0) {

      let cleaned = val.replace(/\s/g, '');
      if (!cleaned.startsWith('+')) {
        finalValue = `+${cleaned}` as FormData[K];
      } else {
        finalValue = cleaned as FormData[K];
      }
    }

    onChange({ ...value, [key]: finalValue });
    if (key === "email") setEmailError(false);
  };

  const t = dict[lang];
  if (!mounted) return <div className="min-h-[400px]" />;

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
        className={`w-full border-2 px-4 py-3 rounded-xl focus:bg-white outline-none transition-all ${emailError ? "border-red-500" : "border-slate-100 focus:border-blue-500"
          }`}
        value={value.email}
        onChange={(e) => update("email", e.target.value)}
        onBlur={() => setEmailError(value.email.length > 0 && !validateEmail(value.email))}
      />

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          {t.phone}
        </label>
        <PhoneInput
          international
          defaultCountry="PL"
          value={(value.phone || "").replace(/\s/g, '').startsWith('+')
            ? (value.phone || "").replace(/\s/g, '')
            : value.phone ? `+${(value.phone || "").replace(/\s/g, '')}` : ""}
          onChange={(val) => update("phone", val || "")}
          className="flex gap-2"
          numberInputProps={{
            className: "flex-1 border-2 border-slate-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-sm"
          }}
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        <input
          ref={streetInputRef}
          required
          placeholder={t.street}
          className="col-span-3 border-2 border-slate-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
          value={value.street}
          onChange={(e) => update("street", e.target.value)}
        />
        <input
          required
          placeholder={t.building}
          className="border-2 border-slate-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-center"
          value={value.buildingNumber}
          onChange={(e) => update("buildingNumber", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
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
          className="col-span-3 border-2 border-slate-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
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
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const allFieldsFilled = Object.values(v).every((x) => x && String(x).trim().length > 0);
  const emailIsValid = emailRegex.test(v.email.toLowerCase());
  return allFieldsFilled && emailIsValid;
}