# SIMAHATI OpRec

> **SIMAHATI OpRec** merupakan modul **Open Recruitment** dari **Sistem Informasi Manajemen Himpunan Mahasiswa Teknik Informatika (SIMAHATI)** yang dirancang untuk membantu proses penerimaan anggota baru secara digital, terstruktur, transparan, dan terintegrasi.

---

# 📖 Tentang SIMAHATI OpRec

SIMAHATI (**Sistem Informasi Manajemen Himpunan Mahasiswa Teknik Informatika**) merupakan sebuah platform berbasis web yang dikembangkan untuk mendukung digitalisasi berbagai proses administrasi di lingkungan Himpunan Mahasiswa Teknik Informatika (HMTI).

Tahap pertama pengembangan SIMAHATI berfokus pada **Open Recruitment (OpRec)**, yaitu proses penerimaan anggota baru HMTI. Modul ini dibangun sebagai solusi atas proses administrasi yang masih dilakukan secara manual, seperti penggunaan formulir kertas, pencatatan menggunakan spreadsheet, hingga penyampaian informasi yang belum terpusat.

Melalui SIMAHATI OpRec, seluruh proses Open Recruitment dapat dikelola dalam satu sistem yang terintegrasi, mulai dari pendaftaran peserta, pengelolaan data calon anggota, penempatan divisi, penjadwalan interview, proses seleksi, hingga pengumuman hasil penerimaan.

Website ini dibangun menggunakan arsitektur **Frontend** dan **Backend** yang terpisah (**Decoupled Architecture**) sehingga proses pengembangan, pemeliharaan, serta pengembangan fitur di masa mendatang menjadi lebih mudah dan terstruktur.

---

# 🎯 Tujuan

SIMAHATI OpRec dikembangkan dengan tujuan untuk:

- Mendigitalisasi seluruh proses Open Recruitment HMTI.
- Mengurangi penggunaan dokumen dan pencatatan secara manual.
- Mempermudah panitia dalam mengelola data peserta.
- Mempermudah proses seleksi calon anggota baru.
- Meningkatkan transparansi proses Open Recruitment.
- Menyediakan dashboard administrasi yang informatif.
- Mempermudah monitoring seluruh tahapan seleksi.
- Mempermudah komunikasi antara panitia dan peserta.
- Menjadi fondasi pengembangan SIMAHATI sebagai Sistem Informasi Manajemen HMTI.

---

# ✨ Fitur Utama

## 🔐 Authentication

Sistem autentikasi digunakan untuk mengelola akses setiap pengguna sesuai dengan hak akses (Role).

### Fitur

- Login
- Register
- Forgot Password
- Logout
- Session Authentication
- Role Based Access Control (RBAC)
- Middleware Authentication
- Middleware Authorization

---

## 📊 Dashboard

Dashboard memberikan informasi ringkas mengenai seluruh proses Open Recruitment secara real-time.

### Fitur

- Total Pendaftar
- Total Divisi
- Total Jadwal Interview
- Total Peserta Lolos
- Total Pengumuman
- Statistik Open Recruitment
- Quick Action
- Activity Summary

---

## 👥 Manajemen Peserta

Digunakan untuk mengelola seluruh data calon anggota yang mengikuti Open Recruitment.

### Fitur

- CRUD Data Peserta
- Detail Biodata Peserta
- Upload Dokumen Persyaratan
- Status Administrasi
- Status Seleksi
- Riwayat Seleksi
- Filter Data
- Pencarian Peserta
- Export Data *(Opsional)*

---

## 🏢 Manajemen Divisi

Mengelola seluruh divisi yang tersedia pada Open Recruitment.

### Fitur

- CRUD Divisi
- Deskripsi Divisi
- Kuota Divisi
- Penempatan Peserta
- Daftar Peserta per Divisi
- Status Kuota Divisi

---

## 🎤 Manajemen Interview

Mengelola seluruh proses interview peserta.

### Fitur

- Penjadwalan Interview
- Penentuan Interviewer
- Lokasi Interview
- Status Interview
- Hasil Interview
- Catatan Interview
- Riwayat Interview

---

## 📢 Pengumuman

Mengelola seluruh informasi yang akan diumumkan kepada peserta.

### Fitur

- Publikasi Hasil Seleksi
- Informasi Open Recruitment
- Pengiriman Notifikasi melalui Email
- Riwayat Pengumuman

---

## 🛡️ Role & Permission

Mengatur hak akses setiap pengguna berdasarkan Role.

### Role

- Super Admin
- Admin Open Recruitment
- Panitia
- Interviewer
- Peserta

### Fitur

- CRUD Role
- CRUD Permission
- Assign Role
- Authorization Middleware

---

## 👤 Profile

Mengelola informasi akun pengguna.

### Fitur

- Edit Profil
- Update Foto Profil
- Ganti Password
- Pengaturan Akun

---

# 👥 Target Pengguna

SIMAHATI OpRec ditujukan untuk beberapa jenis pengguna dengan hak akses yang berbeda.

| Pengguna | Deskripsi |
|----------|-----------|
| **Super Admin** | Mengelola seluruh sistem dan konfigurasi aplikasi. |
| **Admin Open Recruitment** | Mengelola seluruh proses Open Recruitment. |
| **Panitia** | Membantu proses administrasi dan pengelolaan peserta. |
| **Interviewer** | Melakukan proses interview serta memberikan hasil penilaian. |
| **Calon Anggota** | Melakukan pendaftaran dan mengikuti seluruh tahapan seleksi. |

---

# 🏗️ Arsitektur Sistem

SIMAHATI OpRec menggunakan konsep **Client - Server Architecture** dengan pemisahan antara Frontend dan Backend.

```text
                   User
                     │
                     ▼
        ┌─────────────────────────┐
        │        Frontend         │
        │   React + Vite + TS     │
        └────────────┬────────────┘
                     │
                REST API (HTTPS)
                     │
                     ▼
        ┌─────────────────────────┐
        │        Backend          │
        │       Laravel API       │
        └────────────┬────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
   MySQL Database          File Storage
```

---

# 🧩 Arsitektur Komponen

## Frontend

Frontend bertanggung jawab terhadap seluruh tampilan aplikasi serta interaksi pengguna.

### Tanggung Jawab

- User Interface (UI)
- User Experience (UX)
- Routing
- Form Validation
- API Integration
- State Management
- Session Management

---

## Backend

Backend bertanggung jawab terhadap seluruh logika bisnis aplikasi.

### Tanggung Jawab

- Authentication
- Authorization
- REST API
- Business Logic
- Validation
- File Upload
- Email Notification
- Database Management
- Session Management

---

## Database

Database digunakan sebagai pusat penyimpanan seluruh data aplikasi.

### Data yang Disimpan

- User
- Role
- Permission
- Peserta
- Divisi
- Interview
- Pengumuman
- Session
- Dokumen Persyaratan

---

## Storage

Storage digunakan untuk menyimpan seluruh file yang diunggah oleh pengguna.

### Jenis File

- Foto Profil
- Dokumen Persyaratan
- Berkas Pendukung
- Asset Sistem

---

# 🔄 Alur Sistem

```text
Peserta
    │
    ▼
Register Akun
    │
    ▼
Login
    │
    ▼
Melengkapi Biodata
    │
    ▼
Upload Dokumen
    │
    ▼
Memilih Divisi
    │
    ▼
Verifikasi Administrasi
    │
    ▼
Penjadwalan Interview
    │
    ▼
Interview
    │
    ▼
Penilaian
    │
    ▼
Pengumuman Hasil
```

---

# 📂 Struktur Project

```text
simahati-oprec/
├── backend/
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── artisan
│   ├── composer.json
│   └── ...
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
├── docs/
│   ├── API.md
│   ├── DATABASE.md
│   ├── README.md
│   └── stack/
│       ├── FRONTEND.md
│       └── BACKEND.md
│
├── role/
│   ├── README.md
│   ├── reyhan.md
│   ├── nadil.md
│   ├── anton.md
│   └── rizky.md
│
├── GUIDE.md
├── TUTORIAL.md
├── .gitignore
├── LICENSE
└── README.md
```

---

# ⚙️ Setup Development

## Untuk Semua Anggota (Setelah Clone)

Pastikan software berikut sudah terinstal di komputer:

| Software | Minimal Versi | Download |
|----------|--------------|----------|
| PHP | 8.1+ | [php.net](https://www.php.net/downloads) (via XAMPP atau [Laragon](https://laragon.org/download/)) |
| Composer | 2.x | [getcomposer.org](https://getcomposer.org/download/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| MySQL | 8.x | (termasuk dalam XAMPP/Laragon) |
| Git | - | [git-scm.com](https://git-scm.com/downloads) |

### 1. Clone Repository

```bash
git clone https://github.com/HIMA-TI-Politeknik-Hasnur/SIMAHATI-OpRec.git
cd SIMAHATI-OpRec
```

### 2. Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Install dependensi PHP (baca dari composer.lock)
composer install

# Copy .env dari contoh
copy .env.example .env
# atau: cp .env.example .env (Git Bash)

# Generate application key
php artisan key:generate

# Jalankan migration (tabel database akan dibuat otomatis)
php artisan migrate

# (Opsional) Isi data dummy
php artisan db:seed

# Jalankan backend server
php artisan serve
```

Backend akan berjalan di `http://localhost:8000`.

### 3. Setup Frontend

Buka **terminal baru** (biarkan backend tetap jalan):

```bash
# Pindah ke folder frontend
cd SIMAHATI-OpRec/frontend

# Install dependensi JavaScript
npm install

# Jalankan frontend server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`.

### 4. Setup Database

1. Jalankan server database:
   - **XAMPP**: Start **Apache** dan **MySQL** di XAMPP Control Panel
   - **Laragon**: Klik **Start All** di Laragon
2. Buka phpMyAdmin / Adminer:
   - **XAMPP**: `http://localhost/phpmyadmin`
   - **Laragon**: `http://localhost/adminer` (atau install phpMyAdmin via Tools → Quick add)
3. Buat database baru: `simahati_oprec` (collation: `utf8mb4_general_ci`)
4. Sesuaikan file `backend/.env`:

```env
DB_DATABASE=simahati_oprec
DB_USERNAME=root
DB_PASSWORD=
```

5. Jalankan migration (jika belum):

```bash
cd backend
php artisan migrate
php artisan db:seed
```

---

## Untuk Reyhan Saja (Generate Project Awal — Sudah Dilakukan)

Perintah berikut hanya dijalankan **satu kali** oleh Reyhan saat memulai project.
Anggota lain **tidak perlu** menjalankan ini.

```bash
# Generate Laravel di folder backend
composer create-project laravel/laravel backend --prefer-dist --remove-vcs

# Generate React + Vite di folder frontend
npm create vite@latest frontend -- --template react-ts
```

---

# 📚 Urutan Baca Dokumen

Agar tidak bingung, bacalah dokumen dalam urutan berikut:

## 🟢 Wajib Baca Pertama (Semua Anggota)

Baca dalam urutan ini sebelum mulai coding apa pun:

| Urutan | File | Karena |
|--------|------|--------|
| 1 | **README.md** | Gambaran besar proyek, fitur, arsitektur |
| 2 | **TUTORIAL.md** | Belajar Git/GitHub & OpenCode |
| 3 | **CONTRIBUTING.md** | Aturan main tim (branch, commit, workflow, PR) |
| 4 | **GUIDE.md** | Cara menulis commit message & deploy localhost |

## 🟡 Wajib Baca Sebelum Coding

Baca setelah paham gambaran besar, sebelum mulai nulis migration/API/frontend:

| Urutan | File | Karena |
|--------|------|--------|
| 5 | **docs/README.md** | Panduan cara pakai folder docs & flow review |
| 6 | **docs/DATABASE.md** | Skema tabel acuan migration |
| 7 | **docs/API.md** | Endpoint API acuan integrasi frontend-backend |

## 🔵 Referensi Sesuai Role

| File | Untuk | Karena |
|------|-------|--------|
| **role/README.md** | Semua anggota | Pembagian tugas & estimasi beban kerja |
| **role/reyhan.md** | Reyhan | Detail tugas Lead Developer |
| **role/nadil.md** | Nadil | Detail tugas Feature Owner Pendaftaran |
| **role/anton.md** | Anton | Detail tugas Feature Owner Divisi & Interview |
| **role/rizky.md** | Rizky | Detail tugas Feature Owner Informasi & CMS |
| **docs/stack/FRONTEND.md** | Semua yang ngerjain frontend | Stack teknologi frontend & alasan pemilihan |
| **docs/stack/BACKEND.md** | Reyhan (lead backend) | Stack teknologi backend & arsitektur |

---

# 🚀 Status Project

| Informasi | Status |
|-----------|--------|
| Development | 🚧 On Development |
| Version | v1.0.0-dev |
| Target Release | Open Recruitment HMTI |
| License | *(dapat diubah sesuai kebutuhan)* |

---

➡️ **[Lanjut ke: TUTORIAL.md](TUTORIAL.md)** — Belajar Git/GitHub & OpenCode untuk pemula