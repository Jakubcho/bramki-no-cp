"use client";

interface FinalFormProps {
  eventId: string;
  code: string;
}


export default function FinalForm({ eventId, code }: FinalFormProps) {

  return (
    <form className="grid gap-4 w-full max-w-md">

      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="code" value={code} />

      {[
        "Imię",
        "Nazwisko",
        "Adres email",
        "Numer telefonu",
        "Ulica",
        "Numer budynku",
        "Kod pocztowy",
        "Miasto",
        "Kraj",
      ].map((f) => (
        <input
          key={f}
          placeholder={f}
          className="border p-3 rounded"
        />
      ))}

      <button type="submit" className="btn bg-black text-white p-3 rounded">
        Zapisz
      </button>
    </form>
  );
}