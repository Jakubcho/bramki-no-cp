# 🎟️ Event Activation & Gate Management System

<div align="center">
  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />
    <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-Data-336791?style=for-the-badge&logo=postgresql" />
    <img src="https://img.shields.io/badge/Tailwind-UI-06B6D4?style=for-the-badge&logo=tailwind-css" />
  </p>
  <p><i>Zaawansowana platforma do zarządzania aktywacjami biletów i kontrolą dostępu w czasie rzeczywistym.</i></p>
</div>

---

## 🚀 Kluczowe Funkcje

* **Dynamiczne Partycjonowanie Bazy**: Automatyczne tworzenie oddzielnych tabel dla każdego wydarzenia (`ActivationEntry_[slug]`), co zapewnia stabilność przy setkach tysięcy rekordów.
* **API Bramek (Gates API)**: Ultra-szybki endpoint z optymalizacją SQL, obsługujący błyskawiczną weryfikację kodów QR.
* **Hybrydowa Synchronizacja**:
    * Pełny import katalogów z zewnętrznych systemów WordPress.
    * **Reconcile System**: Inteligentne uzupełnianie brakujących danych (`formName`, dane adresowe) w trybie batchowym.
* **Zaawansowany Edytor**: Intuicyjny interfejs z Drag & Drop do zarządzania regułami biletowymi i prefiksami QR.
* **System Naprawczy**: Wbudowane narzędzia diagnostyczne do weryfikacji spójności danych między systemami.

---

## 🛠️ Architektura Techniczna

<details>
<summary><b>🔍 Zobacz szczegóły implementacji (Technical Deep Dive)</b></summary>

<br />

### Baza Danych (Prisma Multi-Client)
Projekt operuje na dwóch niezależnych schematach:
1.  **Core DB**: Obsługuje konfigurację wydarzeń, layouty formularzy i logi systemowe.
2.  **Activation DB**: Dynamicznie generowane tabele partycji, zoptymalizowane pod wysokie obciążenie (branki).

### Bezpieczeństwo i Komunikacja
* **HMAC SHA256**: Autoryzacja zapytań do zewnętrznego API WordPress za pomocą dynamicznie generowanych tokenów czasowych.
* **Reconcile API**: Automatyczne mapowanie pól z zewnętrznego `payload` na lokalną strukturę bazy danych z obsługą błędów.

### Optymalizacja API
Endpointy bramek wykorzystują `Cache-Control` oraz strategię `stale-while-revalidate`, aby zapewnić dostęp do danych nawet w przypadku chwilowych problemów z połączeniem internetowym na hali eventowej.
</details>

---

## ⚙️ Konfiguracja Środowiska

Utwórz plik `.env` w katalogu głównym i uzupełnij poniższe klucze:

```env
# Database Connections
DATABASE_URL_CONFIG="postgresql://user:password@host:5432/core_db"
DATABASE_URL_ACTIVATION="postgresql://user:password@host:5432/activation_db"

# Security Tokens
ACTIVATION_TOKEN="twoj_prywatny_klucz_hmac"
INTERNAL_SECRET="klucz_do_api_admina"

# External Integration
NEXT_PUBLIC_WP_DOMAIN="twoja-domena-wp.pl"

---
```

<div id="installation">
  <h2 align="left">📦 Instalacja i Uruchomienie</h2>
  <p>Aby poprawnie skonfigurować projekt lokalnie, wykonaj poniższe kroki w swoim terminalu:</p>

  <table width="100%" style="border-collapse: collapse;">
    <tr>
      <td bgcolor="#f6f8fa" style="padding: 15px; border: 1px solid #d0d7de; border-radius: 10px;">
        <b>1. Instalacja zależności</b><br/>
        <code>npm install</code>
      </td>
    </tr>
    <tr>
      <td bgcolor="#f6f8fa" style="padding: 15px; border: 1px solid #d0d7de; border-radius: 10px;">
        <b>2. Generowanie Klientów Prisma</b><br/>
        <i style="font-size: 0.9em; color: #57606a;">Projekt używa dwóch oddzielnych schematów. Należy wygenerować oba:</i><br/>
        <code>npx prisma generate --schema=./prisma/core.prisma</code><br/>
        <code>npx prisma generate --schema=./prisma/activation.prisma</code>
      </td>
    </tr>
    <tr>
      <td bgcolor="#f6f8fa" style="padding: 15px; border: 1px solid #d0d7de; border-radius: 10px;">
        <b>3. Uruchomienie serwera deweloperskiego</b><br/>
        <code>npm run dev</code>
      </td>
    </tr>
  </table>
</div>

<br />

<div id="api-endpoints">
  <h2 align="left">📋 Główne Endpointy API</h2>
  <table width="100%" style="border-collapse: collapse; border: 1px solid #d0d7de;">
    <thead>
      <tr bgcolor="#f0f0f0">
        <th align="left" style="padding: 12px; border: 1px solid #d0d7de;">Metoda</th>
        <th align="left" style="padding: 12px; border: 1px solid #d0d7de;">Endpoint</th>
        <th align="left" style="padding: 12px; border: 1px solid #d0d7de;">Opis operacji</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 12px; border: 1px solid #d0d7de;"><img src="https://img.shields.io/badge/GET-blue?style=flat-square" /></td>
        <td style="padding: 12px; border: 1px solid #d0d7de;"><code>/api/gates/[slug]</code></td>
        <td style="padding: 12px; border: 1px solid #d0d7de;">Lista biletów zoptymalizowana dla <b>bramek wejściowych</b>.</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #d0d7de;"><img src="https://img.shields.io/badge/GET-blue?style=flat-square" /></td>
        <td style="padding: 12px; border: 1px solid #d0d7de;"><code>/api/qr/[slug]/[qr]</code></td>
        <td style="padding: 12px; border: 1px solid #d0d7de;">Weryfikacja kodu QR i pobranie danych uczestnika.</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #d0d7de;"><img src="https://img.shields.io/badge/POST-orange?style=flat-square" /></td>
        <td style="padding: 12px; border: 1px solid #d0d7de;"><code>/api/admin/reconcile-missing-data</code></td>
        <td style="padding: 12px; border: 1px solid #d0d7de;"><b>Naprawa danych</b>: uzupełnia brakujące <code>formName</code> z WP.</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #d0d7de;"><img src="https://img.shields.io/badge/POST-orange?style=flat-square" /></td>
        <td style="padding: 12px; border: 1px solid #d0d7de;"><code>/api/sync-catalog/[id]</code></td>
        <td style="padding: 12px; border: 1px solid #d0d7de;">Pełna synchronizacja z zewnętrznym katalogiem WordPress.</td>
      </tr>
    </tbody>
  </table>
</div>

<br />

<table width="100%" style="border-collapse: collapse;">
  <tr>
    <td style="border-left: 5px solid #0366d6; padding: 15px; background: #f1f8ff; border-radius: 0 8px 8px 0;">
      <p style="margin: 0;"><b>💡 Porada techniczna:</b> Po każdej zmianie w plikach <code>.prisma</code>, zawsze uruchom ponownie generowanie klientów, aby system widział nowe pola w bazie.</p>
    </td>
  </tr>
</table>

<br />
<div align="center">
  <p style="color: #57606a; font-size: 0.85em;">© 2026 Event Management System | Built with Next.js 15</p>
</div>