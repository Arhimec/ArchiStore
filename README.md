# ArchiStore — Platformă Digitală pentru Proiecte Arhitecturale gata făcute

ArchiStore este o platformă web modernă și securizată pentru vânzarea și descărcarea de proiecte arhitecturale gata de construire (pachete PDF de execuție, schițe structurale, planuri de etaj filigranate și specificații tehnice).

---

## 🔒 Securitate și Autentificare Panou Administrator

Accesul la panoul de administrare (`/admin`) este protejat prin **parolă criptată în baza de date SQLite** utilizând algoritmul **PBKDF2 SHA-512** (cu salt aleatoriu de 16 octeți și 100.000 de iterări) și token-uri de sesiune semnate criptografic HMAC.

- **URL Acces Panou Admin**: `http://localhost:3000/admin` sau `http://localhost:3000/admin/login`
- **Parolă Administrator**: `DoamneAjuta2026`
- **Caracteristici Securitate**:
  - Parola **nu este afișată ca indiciu** nicăieri în aplicație.
  - Protecție împotriva atacurilor de tip brute-force (max. 5 încercări pe minut per IP).
  - Cookie HTTP-only securizat `admin_session` valabil 24 ore.
  - Sesiune separată pentru administrare cu buton dedicat de **Deconectare** (`Logout`).

---

## 📖 Ghid Detaliat de Utilizare a Panoului de Administrare

Panoul de administrare este redactat **exclusiv în limba română** și este structurat în 4 secțiuni principale:
1. **Tablou de Comandă (Dashboard)**
2. **Gestionare Catalog Proiecte (`/admin/plans`)**
3. **Comenzi Clienți & Regenerare Token-uri (`/admin/orders`)**
4. **Jurnale de Securitate și Audit Descărcări (`/admin/audit-logs`)**

---

### ➕ 1. Adăugarea unui Proiect Arhitectural Nou (Ghid Pas cu Pas)

Pentru a adăuga un proiect nou în catalogul ArchiStore:

1. Autentificați-vă în panoul admin la `/admin/login` folosind parola `DoamneAjuta2026`.
2. Navigați la secțiunea **Administrează Proiecte** (`/admin/plans`).
3. Apăsați butonul **`+ Adaugă Proiect Nou`** situat în partea din dreapta sus.
4. În fereastra modală deschisă, completați câmpurile solicitate:

#### A. Informații Generale Proiect
- **Titlu Proiect**: Numele comercial al proiectului (ex: `Vilă Modernă Riviera`).
- **Slug (Identificator URL)**: Se generează automat din titlu (ex: `vila-moderna-riviera`), dar poate fi editat manual.
- **Preț ($)**: Prețul licenței pentru o singură construcție exprimat în USD (ex: `1250`).
- **Nume Fișier PDF Privat**: Numele fișierului PDF de execuție stocat în directorul privat `private_storage/` (ex: `riviera-construction-set.pdf`).
- **Descriere**: Text detaliat privind conceptul arhitectural, compartimentarea și facilitățile proiectului.

#### B. Caracteristici Tehnice & Dimensiuni (Sistem Metric)
- **Suprafață (m²)**: Suprafața utilă totală încălzită în metri pătrați (ex: `220`).
- **Dormitoare**: Numărul de dormitoare (ex: `4`).
- **Băi**: Numărul de băi (ex: `2.5`).
- **Niveluri**: Regimul de înălțime (ex: `2` pentru Parter + Etaj).
- **Locuri Garaj**: Capacitatea garajului (ex: `2`).
- **Lățime (m)**: Lățimea amprentei la sol în metri (ex: `14.5`).
- **Adâncime (m)**: Adâncimea amprentei la sol în metri (ex: `16.0`).
- **Stil Arhitectural**: Selectați din listă (`Farmhouse`, `Craftsman`, `Modern`, `Contemporary`).
- **Tip Fundație**: Selectați opțiunea potrivită:
  - `Placă Monolită (Slab)`
  - `Subsol Tehnic Aerisit (Crawlspace)`
  - `Subsol Complet (Basement)`
- **Înălțime Plafon**: Especificarea înălțimilor pe niveluri (ex: `2.7m Parter / 2.7m Etaj`).
- **Panta Acoperișului**: Specificația pantei acoperișului (ex: `35° Principală`).

#### C. Galerie Imagini & Planuri de Etaj Filigranate
Puteți adăuga oricâte imagini sau schițe utilizând secțiunea **Imagini și Planuri de Etaj**:
- Apăsați **`+ Adaugă URL Imagine`** pentru a adăuga un rând nou.
- Introduceți **URL-ul imaginii** (ex. link HTTPS către o imagine din CDN sau Unsplash).
- Completați **Descrierea / Legenda** (ex. *Fațadă Principală* sau *Plan Parter*).
- **Bifați opțiunea `Este Plan de Etaj`**:
  - Imaginiile bifate ca fiind plan de etaj vor fi afișate în secțiunea dedicată pe pagina proiectului și vor fi **filigranate automat în timp real** cu modulul Sharp pentru protejarea drepturilor de autor.

#### D. Status și Publicare
- **Publică În Catalog**: Bifați pentru ca proiectul să devină vizibil imediat cumpărătorilor.
- **Recomandat Pe Prima Pagină**: Bifați pentru a evidenția proiectul în secțiunea *Proiecte Arhitecturale Recomandate* de pe prima pagină.
- Apăsați **`Salvează și Publică Proiectul`**.

---

### 💳 2. Administrarea Comenzilor și Regenerarea Token-urilor de Descărcare

În secțiunea **Comenzi și Regenerare Token-uri** (`/admin/orders`):
- Puteți vizualiza fiecare comandă plasată de clienți prin Stripe (ID comandă, email client, proiect achiziționat, sumă).
- Vedeți în timp real statusul token-ului de descărcare:
  - `ACTIV` (Ex: Descărcări 1/3)
  - `EXPIRAT` (Dacă au trecut mai mult de 72 de ore de la achiziție)
  - `NUMĂR MAXIM ATINS` (Dacă clientul a descărcat deja fișierul de 3 ori)
- **Regenerare Token valabil 72 de ore**:
  - În cazul în care un client solicită prelungirea accesului, apăsați pe butonul **`Regenerează Token 72h`**. Sistemul va emite un nou token semnat criptografic și va reseta contorul de descărcări la 0.

---

### 🛡️ 3. Jurnalizarea Auditului de Securitate (`/admin/audit-logs`)

Fiecare accesare a fișierelor PDF private este înregistrată automat în baza de date și afișată în secțiunea de audit:
- Înregistrează adresa IP a solicitantului, timestamp-ul exact, tipul de browser (User-Agent) și comanda asociată.
- Detectează și marchează încercările neautorizate de descărcare cu link-uri expirate sau depășite.

---

## 🛠️ Rulare Proiect și Comenzi Utile

### Pornire Server de Dezvoltare
```bash
npm run dev
```

### Rulare Teste Unitare
```bash
npm run test
```

### Resetare Bază de Date & Re-Seeding
```bash
npx prisma db push --force-reset
npx tsx prisma/seed.ts
```

### Build pentru Producție
```bash
npm run build
```

---

## 🌐 Suport Multilingv (Storefront vs. Admin Panel)
- **Storefront-ul public** oferă comutator de limbă în timp real pentru **Română 🇷🇴**, **Engleză 🇬🇧** și **Franceză 🇫🇷**.
- **Panoul de Administrare (`/admin`)** este configurat să funcționeze **exclusiv în limba Română**, indiferent de limba selectată pe magazinul public.
