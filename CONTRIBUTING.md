# Pedoman Kontribusi — SIMAHATI OpRec

Terima kasih telah berkontribusi dalam pengembangan **SIMAHATI OpRec**! Dokumen ini berisi panduan bagi seluruh anggota tim dalam bekerja sama mengembangkan project ini.

Proyek ini dikerjakan oleh 4 orang anggota tim:

| Nama | Peran |
|------|-------|
| **Reyhan** | Lead Developer — Setup, Auth, Dashboard, Deployment |
| **Nadil** | Feature Owner — Pendaftaran |
| **Anton** | Feature Owner — Divisi & Interview |
| **Rizky** | Feature Owner — CMS & Landing Page |

Harap baca dan ikuti pedoman ini agar pekerjaan tim tetap rapi, terstruktur, dan tidak saling bentrok.

---

## Daftar Isi

1. [Branch Convention](#1-branch-convention)
2. [Commit Convention](#2-commit-convention-conventional-commits)
3. [Workflow Git](#3-workflow-git)
4. [Coding Convention](#4-coding-convention)
5. [Pull Request Process](#5-pull-request-process)
6. [Code Review Checklist](#6-code-review-checklist)
7. [Setup Lokal](#7-setup-lokal)

---

## 1. Branch Convention

Kami menggunakan tiga tingkatan branch:

| Branch | Kegunaan | Siapa yang boleh push |
|--------|----------|-----------------------|
| `main` | Branch produksi. Hanya berisi kode yang sudah stabil dan siap rilis. | Hanya melalui PR dari `development` |
| `development` | Branch integrasi. Semua fitur digabungkan di sini untuk diuji bersama. | Hanya melalui PR dari branch `feature/*` |
| `feature/{nama}` | Branch kerja masing-masing anggota. Setiap fitur dikerjakan di branch terpisah. | Semua anggota di branch masing-masing |

### Aturan Penamaan Branch

- Gunakan huruf **kecil semua** (lowercase).
- Pisahkan kata dengan **tanda dash** (`-`).
- Contoh yang benar:
  - `feature/auth-login`
  - `feature/form-pendaftaran`
  - `feature/manajemen-divisi`
  - `feature/cms-landing-page`
- Contoh yang **salah**:
  - `Feature/Auth` (jangan pakai huruf kapital)
  - `feature/auth_login` (jangan pakai underscore)
  - `fitur-login` (gunakan `feature/` sebagai prefix)

### ⚠️ Larangan Keras

**DILARANG push langsung ke branch `development` atau `main`.** Semua perubahan harus melalui Pull Request.

---

## 2. Commit Convention (Conventional Commits)

Setiap pesan commit wajib mengikuti format **Conventional Commits** agar riwayat perubahan rapi dan mudah dilacak.

### Format

```
<type>: <deskripsi singkat>
```

### Tipe Commit

| Type | Kapan dipakai |
|------|---------------|
| `feat` | Menambahkan fitur baru |
| `fix` | Memperbaiki bug |
| `refactor` | Mengubah kode tanpa mengubah fungsionalitas |
| `style` | Perubahan format code (spasi, indentasi, dll.) — bukan CSS |
| `docs` | Menambahkan atau mengubah dokumentasi |
| `chore` | Tugas teknis (update dependency, config, dll.) |
| `test` | Menambahkan atau memperbaiki test |

### Aturan

- Gunakan **Bahasa Indonesia** untuk deskripsi.
- Maksimal **72 karakter**.
- Diawali huruf kecil.
- Jangan pakai titik (`.`) di akhir.

### Contoh Commit yang Benar

```
feat: menambahkan form login
fix: memperbaiki error validasi email
refactor: menyederhanakan logika auth middleware
style: merapikan indentasi controller peserta
docs: menambahkan dokumentasi API endpoint divisi
chore: mengupdate dependensi composer
test: menambahkan unit test untuk RegistrasiController
```

### Contoh Commit yang Salah

```
update dikit (terlalu umum, tidak jelas)
FIX BUG LOGIN (pakai huruf kapal, tidak sesuai format)
feat: menambahkan fitur baru untuk form pendaftaran dan juga validasi data sekaligus perbaikan bug di halaman utama (terlalu panjang, >72 karakter)
```

---

## 3. Workflow Git

Ikuti langkah-langkah berikut setiap kali mengerjakan fitur baru.

### Sebelum Mulai Coding

Pastikan branch fitur kamu sinkron dengan perkembangan terbaru dari `development`:

```bash
# 1. Pindah ke branch development
git checkout development

# 2. Tarik perubahan terbaru dari remote
git pull origin development

# 3. Kembali ke branch fitur kamu
git checkout feature/nama-fitur-kamu

# 4. Gabungkan perubahan dari development ke branch fitur
git merge development
```

> **Catatan:** Jika terjadi konflik (conflict), selesaikan dulu sebelum melanjutkan coding. Tanya anggota terkait jika perlu.

### Setelah Selesai Coding

```bash
# 1. Cek perubahan yang sudah dibuat
git status

# 2. Tambahkan semua file yang berubah
git add .

# 3. Buat commit dengan pesan yang sesuai
git commit -m "feat: deskripsi perubahan kamu"

# 4. Dorong ke remote repository
git push origin feature/nama-fitur-kamu
```

### Tips Tambahan

- **Commit sering, jangan menumpuk.** Lebih baik 5 commit kecil daripada 1 commit raksasa yang sulit direview.
- **Pisahkan concern.** Jika dalam satu sesi kamu memperbaiki bug dan menambahkan fitur, buat commit terpisah.
- **Tanya jika ragu.** Jika bingung dengan alur git, jangan sungkan bertanya ke Reyhan (Lead Developer).

---

## 4. Coding Convention

### Backend (Laravel)

Ikuti standar **PSR-12** untuk penulisan kode PHP.

| Aspek | Aturan | Contoh Benar | Contoh Salah |
|-------|--------|--------------|--------------|
| **Model** | Singular, PascalCase | `User`, `Peserta`, `Divisi` | `users`, `data_peserta` |
| **Migration** | snake_case | `create_users_table`, `add_email_to_peserta_table` | `CreateUsersTable` |
| **Controller** | Singular, PascalCase + `Controller` | `AuthController`, `PesertaController` | `auth`, `Peserta` |
| **Route** | snake_case, plural | `/api/peserta`, `/api/divisi` | `/api/Peserta`, `/api/data-peserta` |
| **Bahasa kode** | English | `$user = User::find($id);` | `$pengguna = User::find($id);` |
| **Bahasa user-facing** | Indonesia | Validasi: `"Email wajib diisi"` | Validasi: `"Email is required"` |

### Frontend (React + TypeScript)

| Aspek | Aturan | Contoh Benar | Contoh Salah |
|-------|--------|--------------|--------------|
| **Nama komponen** | PascalCase | `FormPendaftaran.tsx`, `Navbar.tsx` | `formPendaftaran.tsx`, `navbar.tsx` |
| **Nama file/folder** | kebab-case | `form-pendaftaran/`, `use-auth.ts` | `formPendaftaran/`, `useAuth.ts` |
| **Nama variabel/fungsi** | camelCase | `getUserData`, `isLoading` | `get_user_data`, `IsLoading` |
| **Struktur file** | Satu komponen per file | Satu file `.tsx` berisi satu komponen | Satu file berisi banyak komponen |
| **TypeScript** | Wajib digunakan | Gunakan `interface` atau `type` untuk props | Jangan pakai JavaScript biasa (`.js`) |

### Umum

- **Tinggalkan kode lebih bersih daripada saat kamu menemukannya** (Boy Scout Rule).
- Jika ada fungsi yang terlalu panjang (lebih dari 50 baris), pertimbangkan untuk dipecah.
- Jangan tinggalkan `console.log` di kode yang di-commit (kecuali untuk debugging sementara yang sudah dibahas dengan tim).
- Hapus kode yang tidak dipakai (jangan hanya di-comment).

---

## 5. Pull Request Process

### Sebelum Membuat Pull Request

1. **Pastikan branch fitur kamu sinkron** dengan `development` (lihat [Workflow Git](#3-workflow-git)).
2. **Cek kembali** tidak ada kode yang salah atau tertinggal.
3. **Pastikan aplikasi masih berjalan** dengan baik di lokal.

### Membuat Pull Request

1. Buka repository di GitHub: [SIMAHATI-OpRec](https://github.com/HIMA-TI-Politeknik-Hasnur/SIMAHATI-OpRec)
2. Klik **Pull Requests** → **New Pull Request**
3. Pilih:
   - **Base:** `development`
   - **Compare:** `feature/nama-fitur-kamu`
4. Isi judul PR dengan jelas, contoh:
   - `feat: menambahkan form pendaftaran peserta`
   - `fix: memperbaiki validasi nomor telepon`
5. Assign **minimal 1 orang reviewer** dari anggota tim.
6. Klik **Create Pull Request**.

### Proses Review

| Tahap | Siapa | Apa yang dilakukan |
|-------|-------|--------------------|
| 1 | **Author PR** | Memberi tahu reviewer di grup tim |
| 2 | **Reviewer** | Membaca kode, memberi komentar atau `Approve` |
| 3 | **Author PR** | Memperbaiki jika ada komentar dari reviewer |
| 4 | **Reviewer** | Memberi `Approve` setelah semua komentar selesai |
| 5 | **Author PR atau Reviewer** | Klik **Merge pull request** ke `development` |
| 6 | **Author PR** | Hapus branch fitur setelah merge |

### Setelah PR di-Merge

```bash
# Pindah ke development dan tarik perubahan terbaru
git checkout development
git pull origin development

# Hapus branch fitur di lokal (sudah tidak diperlukan)
git branch -d feature/nama-fitur-kamu
```

---

## 6. Code Review Checklist

Saat me-review kode teman, periksa hal-hal berikut:

### ❌ Yang Harus Ditolak

- [ ] Ada kode yang di-comment (bukan dokumentasi). Kode mati harus dihapus, bukan di-comment.
- [ ] Ada fungsi yang terlalu panjang (> 50 baris).
- [ ] Ada duplikasi kode (copy-paste tanpa perlu).
- [ ] Tidak ada validasi input atau validasi kurang.
- [ ] Ada file `.env`, password, atau secrets yang ter-commit ke repository.
- [ ] Tidak ada penanganan error (error handling) atau hanya `dd()`/`console.log()`.

### ✅ Yang Harus Diperiksa

- [ ] Kode mengikuti coding convention yang sudah disepakati (lihat bagian 4).
- [ ] Nama variabel, fungsi, dan class mudah dipahami.
- [ ] Tidak ada `console.log` yang tertinggal.
- [ ] Fitur berjalan sesuai dengan yang diharapkan.
- [ ] Tidak merusak fitur lain (regression).
- [ ] Migration sudah benar (bisa di-rollback dengan aman).
- [ ] API response mengikuti format yang konsisten.

### 🔍 Cara Memberi Komentar yang Baik

**Kurang membantu ❌:**

> "Ini salah."

**Lebih membantu ✅:**

> "Validasi email di baris 42 perlu ditambah pengecekan format. Saat ini user bisa masukin string sembarang. Bisa pakai `Validator::make()` atau rule `email` dari Laravel."

> **Prinsip:** Kritik ditujukan ke kode, bukan ke orang. Kita satu tim, tujuannya sama-sama belajar dan menghasilkan produk terbaik.

---

## 7. Setup Lokal

Panduan setup lengkap sudah tersedia di **[README.md](./README.md)**. Berikut ringkasan langkah-langkahnya:

### Prasyarat

| Software | Minimal Versi |
|----------|---------------|
| PHP | 8.1+ |
| Composer | 2.x |
| Node.js | 18+ |
| MySQL | 8.x |
| Git | - |

### Langkah Singkat

```bash
# 1. Clone repository
git clone https://github.com/HIMA-TI-Politeknik-Hasnur/SIMAHATI-OpRec.git
cd SIMAHATI-OpRec

# 2. Setup Backend
cd backend
composer install
copy .env.example .env    # Windows
# atau: cp .env.example .env   # Git Bash / Linux
php artisan key:generate
php artisan migrate
php artisan db:seed        # opsional
php artisan serve          # jalankan di http://localhost:8000

# 3. Setup Frontend (buka terminal baru)
cd frontend
npm install
npm run dev                # jalankan di http://localhost:5173
```

> **Untuk detail lengkap** (termasuk setup database), lihat **[README.md → Setup Development](./README.md#-setup-development)**.

---

## Referensi

- [README.md](./README.md) — Gambaran umum project, fitur, dan setup lokal
- [Laravel Documentation](https://laravel.com/docs/13.x)
- [React Documentation](https://react.dev)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [PSR-12 Coding Standard](https://www.php-fig.org/psr/psr-12/)

---

Terima kasih sudah berkontribusi! Jika ada pertanyaan, jangan ragu untuk diskusi di grup tim. 🚀

---

↩️ **[Kembali ke: TUTORIAL.md](TUTORIAL.md)** — Belajar Git & OpenCode ➡️ **[Lanjut ke: GUIDE.md](GUIDE.md)** — Commit message & deploy localhost
