"use client";

import { useState } from "react";

export default function NewUserForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EDITOR");

  return (
    <form
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        await fetch("/api/admin/users", {
          method: "POST",
          body: JSON.stringify({ email, password, role }),
        });
        location.reload();
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Email</label>
          <input
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
            placeholder="np. admin@warsaw.pl"
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Hasło</label>
          <input
            type="password"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
            placeholder="••••••••"
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Rola</label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none bg-white transition-all appearance-none"
            onChange={e => setRole(e.target.value)}
          >
            <option value="EDITOR">EDITOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm">
          + Dodaj użytkownika
        </button>
      </div>
    </form>
  );
}
