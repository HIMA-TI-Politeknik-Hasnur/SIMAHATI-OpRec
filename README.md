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
│   └── ...
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── ...
│
├── docs/
│   ├── API.md
│   ├── DATABASE.md
│   └── stack/
│       ├── FRONTEND.md
│       └── BACKEND.md    
│
├── .gitignore
├── LICENSE
└── README.md
```

---

# 🚀 Status Project

| Informasi | Status |
|-----------|--------|
| Development | 🚧 On Development |
| Version | v1.0.0-dev |
| Target Release | Open Recruitment HMTI |
| License | *(dapat diubah sesuai kebutuhan)* |
```