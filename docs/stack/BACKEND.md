# ⚙️ Backend Technology

Backend bertanggung jawab terhadap seluruh proses bisnis aplikasi, autentikasi, otorisasi, pengelolaan database, hingga komunikasi dengan Frontend melalui REST API.

Seluruh Backend pada SIMAHATI OpRec dibangun menggunakan **Laravel** dengan konsep **RESTful API** sehingga Frontend dan Backend dapat dikembangkan secara terpisah (Decoupled Architecture).

---

# 1. Laravel

## Digunakan Sebagai

Framework utama Backend SIMAHATI OpRec.

Digunakan untuk:

- REST API
- Authentication
- Authorization
- Business Logic
- CRUD Data
- Database Management
- Validation
- File Upload
- Email Notification
- Session Management

---

## Penjelasan

Laravel merupakan Framework PHP modern yang menerapkan pola arsitektur **MVC (Model View Controller)**.

Laravel menyediakan hampir seluruh kebutuhan aplikasi modern secara bawaan sehingga proses pengembangan menjadi jauh lebih cepat.

Pada SIMAHATI OpRec Laravel digunakan sebagai pusat logika bisnis aplikasi yang bertugas menerima Request dari Frontend, memproses data, kemudian mengembalikan Response dalam bentuk JSON.

---

## Fitur Laravel yang Digunakan

- Routing
- Middleware
- Migration
- Seeder
- Factory
- Validation
- Eloquent ORM
- API Resource
- Storage
- Mail
- Queue *(Opsional)*
- Scheduler *(Opsional)*

---

## Kelebihan

- Development sangat cepat.
- Dokumentasi sangat lengkap.
- Komunitas sangat besar.
- Struktur project rapi.
- Memiliki ORM bawaan.
- Memiliki Validation bawaan.
- Memiliki Authentication bawaan.
- Mudah diintegrasikan dengan Frontend.

---

## Kekurangan

- Sedikit lebih berat dibanding Express.
- Membutuhkan Composer.

---

## Kenapa Tidak Menggunakan Express?

Express merupakan framework minimalis.

Fitur seperti:

- Authentication
- Authorization
- Validation
- Middleware
- Upload File
- Security

harus dikembangkan secara manual.

Laravel telah menyediakan hampir seluruh fitur tersebut sehingga proses development menjadi jauh lebih cepat.

---

## Kenapa Tidak Menggunakan Spring Boot?

Spring Boot sangat cocok untuk Enterprise.

Namun untuk pengembangan selama 5 hari, Laravel jauh lebih efisien dan produktif.

---

# 2. Laravel Sanctum

## Digunakan Sebagai

Authentication System.

Digunakan untuk:

- Login
- Logout
- Session Authentication
- API Authentication
- Token Authentication

---

## Penjelasan

Laravel Sanctum merupakan package resmi Laravel yang digunakan untuk menangani autentikasi pada Single Page Application (SPA).

Sanctum memungkinkan Frontend React berkomunikasi dengan Backend secara aman menggunakan Authentication Token.

---

## Kelebihan

- Package resmi Laravel.
- Ringan.
- Mudah digunakan.
- Aman.
- Sangat cocok untuk React SPA.

---

## Kekurangan

- Tidak dirancang sebagai OAuth Server.

---

## Kenapa Tidak Menggunakan Passport?

Laravel Passport lebih cocok apabila aplikasi membutuhkan:

- Login Google
- Login GitHub
- Login Facebook
- OAuth Server
- Third Party Authentication

SIMAHATI OpRec belum membutuhkan fitur tersebut.

---

# 3. Spatie Laravel Permission

## Digunakan Sebagai

Role Management dan Permission Management.

---

## Penjelasan

Package ini digunakan untuk mengatur hak akses setiap pengguna berdasarkan Role.

Contoh Role:

- Super Admin
- Admin Open Recruitment
- Panitia
- Interviewer
- Peserta

Setiap Role memiliki Permission yang berbeda sesuai tanggung jawabnya.

---

## Fitur

- CRUD Role
- CRUD Permission
- Assign Role
- Authorization Middleware
- Permission Middleware

---

## Kelebihan

- Sangat populer di Laravel.
- Dokumentasi lengkap.
- Mudah digunakan.
- Role Management siap pakai.
- Permission Management siap pakai.

---

## Kekurangan

- Perlu memahami struktur tabel bawaan package.

---

# 🗄️ Database

Database digunakan sebagai pusat penyimpanan seluruh data aplikasi.

---

# MySQL

## Digunakan Sebagai

Relational Database Management System (RDBMS).

---

## Penjelasan

MySQL dipilih karena stabil, ringan, mudah digunakan, dan memiliki dokumentasi yang sangat lengkap.

Seluruh data aplikasi akan disimpan pada MySQL.

---

## Data yang Disimpan

### Authentication

- Users
- Sessions
- Password Reset

---

### Authorization

- Roles
- Permissions
- Model Has Roles
- Model Has Permissions
- Role Has Permissions

---

### Open Recruitment

- Peserta
- Divisi
- Pendaftaran
- Dokumen Persyaratan
- Interview
- Jadwal Interview
- Pengumuman

---

### System

- Activity Log *(Opsional)*
- Settings *(Opsional)*

---

## Kelebihan

- Cepat.
- Mudah digunakan.
- Dokumentasi lengkap.
- Didukung hampir seluruh Hosting.

---

## Kekurangan

- Kurang fleksibel dibanding PostgreSQL pada beberapa fitur Advanced Database.

---

## Kenapa Tidak Menggunakan PostgreSQL?

PostgreSQL memang lebih kuat.

Namun kebutuhan SIMAHATI OpRec masih dapat dipenuhi sepenuhnya oleh MySQL.

---

# ☁️ Deployment

Deployment dilakukan dengan memisahkan antara Frontend dan Backend.

Hal ini membuat proses scaling maupun maintenance menjadi lebih mudah.

---

# Backend Deployment

## Railway

### Digunakan Sebagai

Platform Deployment Backend Laravel.

---

### Penjelasan

Railway memungkinkan proses deployment Laravel dilakukan hanya dengan beberapa langkah tanpa perlu melakukan konfigurasi server secara manual.

---

### Kelebihan

- Deploy cepat.
- HTTPS otomatis.
- SSL otomatis.
- Environment Variable.
- Database Integration.
- GitHub Integration.

---

### Kekurangan

- Free Plan memiliki keterbatasan.

---

### Kenapa Tidak Menggunakan VPS?

VPS memang lebih fleksibel.

Namun harus melakukan konfigurasi:

- Linux Server
- Docker
- Nginx
- Firewall
- SSL
- Environment

Untuk proyek kampus, Railway jauh lebih praktis.

---

# Frontend Deployment

## Vercel

### Digunakan Sebagai

Deployment React + Vite.

---

### Penjelasan

Vercel merupakan platform deployment yang sangat optimal untuk aplikasi Frontend modern.

---

### Kelebihan

- Deploy hanya beberapa klik.
- HTTPS otomatis.
- CDN otomatis.
- Auto Deploy dari GitHub.

---

### Kekurangan

- Kurang cocok untuk Backend Laravel.

---

# 🤝 Collaboration Tools

Kolaborasi dilakukan menggunakan beberapa platform agar proses pengembangan menjadi lebih terstruktur.

---

# GitHub

## Digunakan Sebagai

Version Control System.

---

## Penjelasan

GitHub menjadi pusat seluruh Source Code SIMAHATI OpRec.

Seluruh anggota tim melakukan pengembangan menggunakan Branch masing-masing sebelum digabungkan ke Branch utama.

---

## Digunakan Untuk

- Repository
- Branch
- Pull Request
- Issue
- Release
- Source Code
- Code Review

---

## Kelebihan

- Kolaborasi mudah.
- Riwayat perubahan tercatat.
- Mendukung GitHub Actions.
- Mendukung Pull Request.

---

# Google Drive

## Digunakan Sebagai

Media penyimpanan dokumen.

---

## Penjelasan

Google Drive digunakan untuk menyimpan seluruh dokumen yang tidak termasuk Source Code.

---

## Digunakan Untuk

- Proposal
- Laporan
- PPT
- Dokumentasi
- Asset
- Logo
- Wireframe
- Mockup
- Berkas Pendukung

---

## Kelebihan

- Real-Time Collaboration.
- Cloud Storage.
- Mudah diakses seluruh anggota tim.

---

# 🚀 Development Workflow

Seluruh proses pengembangan mengikuti alur berikut.

```text
Planning
    │
    ▼
UI / UX Design
    │
    ▼
Database Design
    │
    ▼
Backend Development
    │
    ▼
Frontend Development
    │
    ▼
API Integration
    │
    ▼
Testing
    │
    ▼
Bug Fixing
    │
    ▼
Deployment
```

---

# 🌳 Git Branch Strategy

```text
main
│
└── development
    │
    ├── feature/authentication
    ├── feature/dashboard
    ├── feature/participant
    ├── feature/division
    ├── feature/interview
    ├── feature/announcement
    ├── feature/role-management
    └── feature/profile
```

---

# 📋 Coding Convention

Seluruh pengembangan mengikuti standar penulisan kode agar konsisten di seluruh project.

## Frontend

- PascalCase untuk Component.
- camelCase untuk Function.
- camelCase untuk Variable.
- kebab-case untuk Folder.

---

## Backend

Mengikuti standar **PSR-12**.

- PascalCase untuk Class.
- camelCase untuk Method.
- snake_case untuk Database.
- RESTful API Convention.

---

# 📌 Kesimpulan

Seluruh teknologi yang digunakan pada SIMAHATI OpRec dipilih berdasarkan beberapa pertimbangan utama:

- Mudah dipelajari oleh seluruh anggota tim.
- Memiliki dokumentasi yang lengkap.
- Memiliki komunitas yang besar.
- Cepat dalam proses development.
- Mudah diintegrasikan.
- Mudah di-maintain.
- Mudah di-deploy.
- Memiliki performa yang baik.
- Mudah dikembangkan untuk kebutuhan organisasi di masa mendatang.

Dengan kombinasi teknologi tersebut, SIMAHATI OpRec diharapkan menjadi fondasi awal pengembangan **Sistem Informasi Manajemen Himpunan Mahasiswa Teknik Informatika (SIMAHATI)** yang modern, terstruktur, dan berkelanjutan.