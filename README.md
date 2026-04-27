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