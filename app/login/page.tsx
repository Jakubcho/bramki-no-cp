"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            signIn("credentials", {
              email,
              password,
              callbackUrl: "/admin",
            });
          }}
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Witaj ponownie
            </h1>
            <p className="text-sm text-gray-500">Zaloguj się do panelu administratora</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Adres Email
              </label>
              <input
                type="email"
                placeholder="twoj@email.pl"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Hasło
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl shadow-lg shadow-gray-200 transition-all duration-200 active:scale-[0.98]">
            Zaloguj się
          </button>

          <div className="text-center">
            <a href="#" className="text-xs text-gray-400 hover:text-blue-600 transition-colors">
              Zapomniałeś hasła?
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
