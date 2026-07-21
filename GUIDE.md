# PANDUAN LENGKAP: COMMIT MESSAGE & DEPLOY LOCALHOST

Dokumen ini berisi dua panduan penting untuk tim **INGFO LOKER**:

1. **Cara menulis pesan commit yang baik** — biar riwayat project rapi dan mudah dilacak
2. **Cara deploy project di localhost** — menjalankan backend, frontend, dan database di komputer Windows

Setiap istilah akan dijelaskan dari **nol absolut** — seperti kalian baru pertama kali mendengarnya.

---

## Daftar Isi

- [1. Panduan Pesan Commit](#1-panduan-pesan-commit)
  - [1.1 Kenapa Pesan Commit Penting?](#11-kenapa-pesan-commit-penting)
  - [1.2 Format Pesan Commit yang Baik](#12-format-pesan-commit-yang-baik)
  - [1.3 Tipe Commit (Conventional Commits)](#13-tipe-commit-conventional-commits)
  - [1.4 Contoh Commit yang BAGUS vs BURUK](#14-contoh-commit-yang-bagus-vs-buruk)
  - [1.5 Contoh Commit untuk Project SIMAHATI](#15-contoh-commit-untuk-project-simahati)
  - [1.6 Aturan Penulisan Commit Tim](#16-aturan-penulisan-commit-tim)
- [2. Panduan Deploy Localhost Windows](#2-panduan-deploy-localhost-windows)
  - [2.1 Apa itu Localhost?](#21-apa-itu-localhost)
  - [2.2 Persiapan — Software yang Harus Diinstal](#22-persiapan--software-yang-harus-diinstal)
  - [2.3 Instalasi XAMPP (PHP, MySQL, phpMyAdmin)](#23-instalasi-xampp-php-mysql-phpmyadmin)
  - [2.4 Alternatif: Instalasi Laragon](#24-alternatif-instalasi-laragon)
  - [2.5 Instalasi Composer (Pengelola Library PHP)](#25-instalasi-composer-pengelola-library-php)
  - [2.6 Setup Database MySQL](#26-setup-database-mysql)
  - [2.7 Setup Backend Laravel](#27-setup-backend-laravel)
  - [2.8 Setup Frontend React + Vite](#28-setup-frontend-react--vite)
  - [2.9 Menjalankan Backend & Frontend Bersamaan](#29-menjalankan-backend--frontend-bersamaan)
  - [2.10 Mengakses Aplikasi di Browser](#210-mengakses-aplikasi-di-browser)
  - [2.11 Error yang Sering Muncul saat Deploy Localhost](#211-error-yang-sering-muncul-saat-deploy-localhost)

---

# BAGIAN 1: PANDUAN PESAN COMMIT

---

## 1.1 Kenapa Pesan Commit Penting?

### Cerita Tanpa Pesan Commit yang Baik

Bayangkan kalian membuka riwayat commit project dan melihat ini:

```
Update
Fix
Benerin
Tambahan
Hore beres
Update lagi
Fix lagi
Benerin lagi
```

**Apa yang kalian pahami?** Sama sekali tidak jelas. Apa yang di-update? Error apa yang di-fix? Bagian mana yang dibenerin?

Kalau sebulan kemudian ada bug, kalian harus buka SATU PERSATU file yang diubah di setiap commit untuk mencari asal muasal bug. **Sangat melelahkan.**

### Cerita Dengan Pesan Commit yang Baik

Sekarang bayangkan riwayat commit seperti ini:

```
feat: menambahkan form login dengan validasi email
fix: memperbaiki error 500 saat register tanpa foto profil
refactor: memisahkan logika validasi ke file terpisah
style: mengubah warna tombol submit menjadi biru
docs: menambahkan dokumentasi API endpoint /api/login
```

**Langsung jelas:**
- Commit `feat` = fitur baru ditambahkan
- Commit `fix` = bug diperbaiki
- Commit `refactor` = kode dirapikan tanpa mengubah fungsinya

Kalau tiba-tiba muncul bug di form login, kalian tinggal cari commit terakhir yang mengubah form login. **Hemat waktu berjam-jam.**

### Manfaat Pesan Commit yang Baik:

1. **Mencari bug lebih cepat** — tinggal baca riwayat, ketemu commit yang mencurigakan
2. **Kolaborasi lebih lancar** — anggota tim tahu apa yang diubah orang lain tanpa harus tanya
3. **Auto-generate changelog** — tools bisa otomatis bikin catatan rilis dari pesan commit
4. **Profesional** — project terlihat dikerjakan dengan serius dan rapi
5. **Memudahkan code review** — reviewer langsung paham konteks perubahan tanpa buka file

---

## 1.2 Format Pesan Commit yang Baik

### Struktur Dasar

```
<tipe>: <deskripsi singkat>
```

**Contoh:**
```
feat: menambahkan form login
```

**Aturan:**
- `<tipe>` — kata kunci yang menjelaskan JENIS perubahan (lihat bagian 1.3)
- `:` — titik dua, diikuti spasi
- `<deskripsi>` — jelaskan APA yang diubah, bukan BAGAIMANA cara mengubahnya
- Ditulis dalam **huruf kecil semua** (kecuali nama proper/API)
- **Maksimal 72 karakter** untuk satu baris

### Format Lengkap (Untuk Commit yang Kompleks)

```
<tipe>: <deskripsi singkat>

<penjelasan detail (opsional)>

<footer (opsional)>
```

**Contoh:**
```
feat: menambahkan validasi NIM pada form pendaftaran

NIM harus 10 digit angka. Validasi dilakukan di frontend
sebelum dikirim ke backend.

Closes #42
```

### Perbandingan:

| ❌ Buruk | ✅ Baik |
|----------|---------|
| `update` | `feat: menambahkan halaman dashboard admin` |
| `fix` | `fix: memperbaiki error kolom email null di registrasi` |
| `benerin` | `fix: mengatasi crash saat upload file > 2MB` |
| `tambahan` | `feat: menambahkan filter pencarian peserta` |
| `perbaiki dikit` | `style: merapikan margin card di halaman utama` |
| `lagi` | `refactor: memisahkan komponen Navbar ke file sendiri` |

---

## 1.3 Tipe Commit (Conventional Commits)

**Conventional Commits** adalah standar penulisan pesan commit yang dipakai oleh banyak perusahaan dan project open source. Setiap tipe punya makna spesifik.

### Daftar Tipe Commit

| Tipe | Warna | Arti | Contoh |
|------|-------|------|--------|
| `feat` | Hijau | **Fitur baru** — menambah fungsionalitas yang sebelumnya belum ada | `feat: menambahkan form registrasi peserta` |
| `fix` | Merah | **Perbaikan bug** — memperbaiki error/kesalahan pada kode | `fix: memperbaiki error 500 saat login` |
| `refactor` | Biru | **Perubahan kode** — mengubah struktur kode tanpa mengubah fungsinya | `refactor: memisahkan validasi ke file terpisah` |
| `style` | Ungu | **Perubahan tampilan** — CSS, spacing, warna, font (bukan logika) | `style: mengubah warna navbar menjadi gelap` |
| `docs` | Putih | **Dokumentasi** — menambah/mengubah dokumentasi | `docs: menambahkan API endpoint user di README` |
| `chore` | Abu-abu | **Pekerjaan rumah** — setup project, update dependency, config | `chore: menambahkan .gitignore untuk Laravel` |
| `test` | Oranye | **Pengujian** — menambah/mengubah test | `test: menambahkan unit test untuk fungsi login` |
| `perf` | Kuning | **Optimasi performa** — membuat kode berjalan lebih cepat | `perf: mengoptimasi query database daftar peserta` |
| `ci` | Coklat | **Continuous Integration** — mengubah setting deployment/build | `ci: mengubah konfigurasi GitHub Actions` |
| `build` | Abu-abu | **Build system** — mengubah webpack, vite, dll | `build: mengupdate Vite ke versi 5` |

### Cara Memilih Tipe yang Tepat:

**Tanya pada diri sendiri: "Apa yang berubah untuk pengguna?"**

| Kalau jawabannya... | Maka tipenya... |
|---------------------|-----------------|
| "Ada fitur baru yang bisa mereka pakai" | `feat` |
| "Error yang mereka alami sekarang tidak muncul lagi" | `fix` |
| "Tidak ada perubahan dari sisi pengguna, cuma kode yang dirapikan" | `refactor` |
| "Tampilannya berubah tapi fungsinya sama" | `style` |
| "Saya nambahin komentar atau dokumentasi" | `docs` |

### Catatan Penting:

- **Satu commit = satu tipe perubahan.** Jangan campur `feat` dan `fix` dalam satu commit. Kalau ada dua perubahan berbeda, buat dua commit terpisah.
- **Tidak semua commit perlu tipe.** Untuk perubahan yang sangat kecil (misal: typo 1 huruf), kadang cukup `fix: memperbaiki typo` tanpa terlalu formal.

---

## 1.4 Contoh Commit yang BAGUS vs BURUK

### Contoh 1: Menambahkan Fitur

| ❌ Buruk | ✅ Bagus |
|----------|----------|
| `update` | `feat: menambahkan form registrasi peserta` |
| `tambah form` | `feat: menambahkan multi step form pendaftaran` |
| `form baru` | `feat: menambahkan validasi NIM realtime di form` |

**Kenapa yang bagus lebih baik:**
- Langsung jelas FITUR APA yang ditambahkan
- Ada konteks (form registrasi, multi step, validasi NIM)
- Orang lain langsung paham tanpa buka file

### Contoh 2: Memperbaiki Error

| ❌ Buruk | ✅ Bagus |
|----------|----------|
| `fix` | `fix: memperbaiki error 500 saat register tanpa email` |
| `benerin bug` | `fix: mengatasi crash saat upload file lebih dari 2MB` |
| `error solved` | `fix: memperbaiki validasi NIM yang tidak mendeteksi huruf` |

**Kenapa yang bagus lebih baik:**
- Menyebutkan ERROR APA yang diperbaiki
- Ada detail kondisi yang menyebabkan error
- Kalau error muncul lagi, mudah dicari di riwayat commit

### Contoh 3: Merapikan Kode

| ❌ Buruk | ✅ Bagus |
|----------|----------|
| `rapihin` | `refactor: memisahkan komponen Navbar ke file terpisah` |
| `ganti struktur` | `refactor: mengganti API call dari fetch ke axios` |
| `beresin folder` | `refactor: memindahkan semua helper ke folder src/utils/` |

### Contoh 4: Tampilan

| ❌ Buruk | ✅ Bagus |
|----------|----------|
| `ganti warna` | `style: mengubah warna tombol submit menjadi biru` |
| `bikin cantik` | `style: menambahkan padding dan margin di card peserta` |
| `css` | `style: merapikan tampilan navbar untuk mobile` |

### Contoh 5: Setup Project

| ❌ Buruk | ✅ Bagus |
|----------|----------|
| `init` | `chore: initial project setup dengan Laravel + React` |
| `tambah package` | `chore: menambahkan axios untuk HTTP client` |
| `config` | `chore: mengupdate konfigurasi database di .env.example` |

---

## 1.5 Contoh Commit untuk Project SIMAHATI

Berikut adalah contoh-contoh commit yang MUNGKIN kalian buat selama project SIMAHATI OpRec.

### Untuk Reyhan (Setup Project, Auth, Dashboard, Deployment)

```
chore: initial project setup dengan .gitignore
chore: menambahkan Laravel backend dan React frontend
feat: menambahkan API register peserta
feat: menambahkan API login dengan JWT token
feat: menambahkan middleware authentication
feat: menambahkan halaman dashboard admin
feat: menambahkan statistik total peserta dan divisi
style: merapikan layout sidebar dashboard
fix: memperbaiki token expired tidak redirect ke login
refactor: memisahkan logika auth ke service terpisah
docs: menambahkan dokumentasi API di docs/API.md
```

### Untuk Nadil (Fitur Pendaftaran)

```
feat: menambahkan form biodata peserta (nama, NIM, semester)
feat: menambahkan form upload dokumen (KTM, CV, sertifikat)
feat: menambahkan validasi NIM harus 10 digit angka
feat: menambahkan preview data sebelum submit
feat: menambahkan halaman status pendaftaran
fix: memperbaiki error upload file ekstensi PDF tidak terdeteksi
fix: memperbaiki validasi nomor HP yang menerima huruf
style: mengubah progress step menjadi horizontal
refactor: memisahkan multi step form ke komponen terpisah
test: menambahkan validasi form biodata
```

### Untuk Anton (Fitur Divisi & Interview)

```
feat: menambahkan halaman daftar divisi
feat: menambahkan form tambah divisi dengan kuota
feat: menambahkan penjadwalan interview peserta
feat: menambahkan form penilaian interview (nilai, catatan)
feat: menambahkan status kelulusan per peserta
fix: memperbaiki jadwal interview yang bentrok
style: mengubah tampilan kalender interview
refactor: memisahkan logika penjadwalan ke service
```

### Untuk Rizky (Fitur CMS, Landing Page, Pengumuman)

```
feat: menambahkan halaman landing page (hero, about, timeline)
feat: menambahkan FAQ accordion di landing page
feat: menambahkan halaman pengumuman hasil seleksi
feat: menambahkan form CRUD pengumuman untuk admin
feat: menambahkan notifikasi email setelah pengumuman
feat: menambahkan halaman settings CMS (banner, FAQ)
fix: memperbaiki accordion FAQ yang tidak bisa dibuka
style: mengubah hero section dengan background gradient
test: menambahkan validasi form pengumuman
```

### Commit Bersama (Integrasi)

```
fix: memperbaiki conflict merge branch feature/pendaftaran ke development
fix: memperbaiki integrasi API pendaftaran dengan frontend
fix: memperbaiki cors error saat frontend panggil backend
chore: mengupdate dependensi project
```

### Tips dari Contoh di Atas:

1. **Setiap commit menyelesaikan SATU hal spesifik** — lihat bagaimana setiap commit cuma mengubah 1 fitur/kecil
2. **Gunakan kata kerja aktif** — "menambahkan", "memperbaiki", "mengubah"
3. **Sebutkan komponen/spesifik** — bukan "form" tapi "form biodata", bukan "upload" tapi "upload dokumen KTM"
4. **Konsisten dengan bahasa** — pilih Bahasa Indonesia dan konsisten

---

## 1.6 Aturan Penulisan Commit Tim

### Aturan Tim INGFO LOKER:

1. **WAJIB pakai format:** `<tipe>: <deskripsi>`
2. **Tipe commit** pilih dari: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`
3. **Deskripsi** dalam Bahasa Indonesia, huruf kecil, maksimal 72 karakter
4. **Satu commit = satu perubahan logis.** Jangan campur 2 fitur berbeda dalam 1 commit
5. **Commit sering.** Setiap kali selesai 1 bagian kecil, commit. Jangan nunggu semua fitur selesai baru commit
6. **Jangan commit file .env atau password.** File `.env` sudah di `.gitignore`, pastikan jangan dipaksa commit

### Contoh Alur Commit yang Ideal:

**Buat 1 fitur kecil → commit → push:**

```bash
# Setelah selesai buat form biodata
git add .
git commit -m "feat: menambahkan form input biodata peserta"
git push origin feature/pendaftaran

# Setelah selesai buat validasi NIM
git add .
git commit -m "feat: menambahkan validasi NIM 10 digit"
git push origin feature/pendaftaran

# Setelah selesai memperbaiki error upload
git add .
git commit -m "fix: memperbaiki error upload file > 2MB"
git push origin feature/pendaftaran
```

### Yang TIDAK Boleh Dilakukan:

```bash
# ❌ SALAH: commit besar-besaran setelah 3 hari kerja tanpa commit
git add .
git commit -m "update"  # 50 file berubah, isinya gak jelas
```

```bash
# ❌ SALAH: commit file password
git add .env
git commit -m "chore: update env"
# Password database kalian sekarang ada di GitHub! BAHAYA!
```

```bash
# ❌ SALAH: commit dengan pesan tidak jelas
git commit -m "fix"
# Dalam 1 bulan: "Error ini gara-gara commit yang mana ya?"
```

---

# BAGIAN 2: PANDUAN DEPLOY LOCALHOST WINDOWS

---

## 2.1 Apa itu Localhost?

### Analogi Sederhana

Bayangkan aplikasi web adalah sebuah **toko online**:
- **Localhost** = toko yang buka di **garasi rumah kalian**. Hanya kalian yang bisa lihat dan coba.
- **Server production** = toko yang buka di **mal**. Semua orang bisa akses.

**Localhost** artinya aplikasi kalian berjalan di **komputer kalian sendiri**, bukan di internet. Kalian bisa mengaksesnya lewat browser dengan alamat `http://localhost`.

### Kenapa Perlu Localhost?

1. **Testing** — coba aplikasi sebelum dinaikkan ke internet
2. **Development** — ngoding sambil lihat hasilnya langsung
3. **Hemat biaya** — tidak perlu bayar server
4. **Aman** — tidak bisa diakses orang lain

### Arsitektur Localhost Project Kita:

```
Browser (Chrome)
      │
      ├── http://localhost:5173 → Frontend (React + Vite)
      │      └── Menampilkan halaman, form, dashboard
      │
      └── http://localhost:8000 → Backend (Laravel API)
             └── Mengolah data, login, upload file
                    │
                    └── MySQL Database
                           └── Menyimpan data peserta, user, dll
```

Jadi:
- **Frontend** jalan di `localhost:5173` (port 5173)
- **Backend** jalan di `localhost:8000` (port 8000)
- **Database** jalan di `localhost:3306` (port 3306)
- Frontend akan memanggil API backend untuk mengambil/menyimpan data

---

## 2.2 Persiapan — Software yang Harus Diinstal

Untuk menjalankan project SIMAHATI OpRec di localhost, kalian perlu software berikut:

| Software | Fungsi | Download |
|----------|--------|----------|
| **XAMPP** atau **Laragon** | Memberi server PHP + MySQL + phpMyAdmin/Adminer di komputer kalian | [XAMPP](https://www.apachefriends.org/) / [Laragon](https://laragon.org/download/) |
| **Composer** | Pengelola library/paket untuk PHP (seperti npm untuk JavaScript) | https://getcomposer.org/ |
| **Node.js** | Untuk menjalankan frontend React | https://nodejs.org/ (sudah diinstal di tutorial OpenCode) |
| **Git** | Untuk clone repository | (sudah diinstal di tutorial sebelumnya) |
| **VSCode** | Untuk edit kode | (sudah diinstal kalau ikut tutorial OpenCode) |

**Catatan:** Instal dalam urutan di atas — XAMPP/Laragon dulu, baru Composer. Pilih salah satu (XAMPP atau Laragon), tidak perlu keduanya.

---

## 2.3 Instalasi XAMPP (PHP, MySQL, phpMyAdmin)

### Apa itu XAMPP?

XAMPP adalah paket all-in-one yang memberi kalian:
- **PHP** — bahasa pemrograman yang dipakai Laravel (backend kita)
- **MySQL** — database untuk menyimpan data
- **phpMyAdmin** — website untuk mengelola database lewat browser (tidak perlu hapal perintah SQL)
- **Apache** — web server (seperti "pelayan" yang melayani request dari browser)

Dengan XAMPP, kalian tidak perlu install satu per satu — tinggal install sekali, semua dapat.

### Langkah Instalasi:

1. **Download XAMPP**
   - Buka browser, ketik: `https://www.apachefriends.org/`
   - Klik tombol **"XAMPP for Windows"** (versi terbaru, misalnya 8.2.x)
   - File installer akan terdownload (ukuran ~150MB)

2. **Jalankan Installer**
   - Klik kanan file installer → **"Run as administrator"**
   - Klik **"Next"**
   - Pilih komponen: **pastikan centang:**
     - [x] Apache
     - [x] MySQL
     - [x] PHP
     - [x] phpMyAdmin
     - (yang lain boleh di-uncheck)
   - Pilih folder instalasi: **biarkan default** (`C:\xampp`) — **JANGAN** diubah
   - Klik **"Next"** → **"Install"**
   - Tunggu proses instalasi selesai (5-10 menit)
   - Klik **"Finish"**

3. **Jalankan XAMPP Control Panel**
   - Setelah instalasi selesai, centang **"Start Control Panel"**
   - Akan muncul jendela **XAMPP Control Panel**
   - Ini adalah pusat kendali untuk menyalakan/mematikan server

4. **Start Apache dan MySQL**
   - Di XAMPP Control Panel, cari baris **Apache**
   - Klik tombol **"Start"** (warna akan berubah dari merah ke hijau)
   - Cari baris **MySQL**
   - Klik tombol **"Start"**
   - Kalau berhasil, kedua baris akan berwarna **hijau**

5. **Verifikasi**
   - Buka browser
   - Ketik di address bar: `http://localhost`
   - Kalau muncul halaman **"Welcome to XAMPP"** → **BERHASIL!**

### Troubleshooting XAMPP:

**Port 80 atau 443 sudah dipakai (biasanya oleh aplikasi lain):**
Di XAMPP Control Panel:
1. Klik **"Config"** di baris Apache
2. Pilih **"Apache (httpd.conf)"**
3. Cari `Listen 80` — ganti jadi `Listen 8080`
4. Cari `ServerName localhost:80` — ganti jadi `ServerName localhost:8080`
5. Simpan file
6. Di XAMPP Control Panel, klik **"Config"** → **"Apache (httpd-ssl.conf)"**
7. Cari `Listen 443` — ganti jadi `Listen 4433`
8. Simpan, restart Apache

---

## 2.4 Alternatif: Instalasi Laragon

### Apa itu Laragon?

**Laragon** adalah alternatif XAMPP yang lebih modern dan ringan. Laragon memberi kalian:
- **PHP** — bahasa pemrograman yang dipakai Laravel
- **MySQL / MariaDB** — database untuk menyimpan data
- **Adminer** atau **phpMyAdmin** — untuk mengelola database lewat browser
- **Apache** atau **Nginx** — web server
- **Auto virtual hosts** — setiap project otomatis punya domain sendiri (contoh: `simahati-oprec.test`)

### Kelebihan Laragon Dibanding XAMPP:

| Aspek | XAMPP | Laragon |
|-------|-------|---------|
| Folder project | `C:\xampp\htdocs` | `C:\laragon\www` |
| PHP path | `C:\xampp\php\php.exe` | `C:\laragon\bin\php\php-8.x\php.exe` |
| Database tool | phpMyAdmin | Adminer (bisa tambah phpMyAdmin) |
| Virtual host | Manual | Otomatis |
| Port default | 80, 443, 3306 | 80, 443, 3306 (sama) |
| Berat | ~500MB | ~200MB |

### Langkah Instalasi:

1. **Download Laragon**
   - Buka `https://laragon.org/download/`
   - Pilih **Laragon Full** (sudah termasuk PHP, MySQL, Apache, Node.js, Composer)
   - File installer ukuran ~200MB

2. **Jalankan Installer**
   - Jalankan file installer
   - Pilih bahasa (English)
   - Klik **"Next"** terus
   - Pilih folder instalasi: **biarkan default** (`C:\laragon`) — **JANGAN** diubah
   - Centang **"Add Laragon to PATH"**
   - Klik **"Install"**

3. **Jalankan Laragon**
   - Setelah instalasi, centang **"Start Laragon after installation"**
   - Klik **"Finish"**
   - Akan muncul jendela **Laragon** (aplikasi kecil di taskbar)

4. **Start Apache dan MySQL**
   - Di jendela Laragon, klik tombol **"Start All"**
   - Apache akan jalan di port 80
   - MySQL akan jalan di port 3306
   - Indikator akan berubah jadi **hijau**

5. **Verifikasi**
   - Buka browser
   - Ketik: `http://localhost`
   - Kalau muncul halaman Laragon → **BERHASIL!**

### Catatan Penting Laragon:

- **Folder project** Laragon ada di `C:\laragon\www`, **bukan** `C:\xampp\htdocs`
- Laragon bisa membuat **virtual host otomatis**: klik kanan Laragon → **Quick add** → **Virtual Host**
- Untuk mengakses phpMyAdmin: **Tools** → **Quick add** → **phpMyAdmin**
- Laragon sudah termasuk **Composer** dan **Node.js** (tidak perlu install terpisah kalau pakai Laragon Full)

### Perbedaan Path XAMPP vs Laragon:

Sepanjang dokumentasi ini, kalian akan melihat perintah dengan `C:\xampp\...`. Kalau pakai **Laragon**, ganti `C:\xampp\htdocs\` menjadi `C:\laragon\www\`.

```
XAMPP: C:\xampp\htdocs\SIMAHATI-OpRec
Laragon: C:\laragon\www\SIMAHATI-OpRec
```

---

## 2.5 Instalasi Composer (Pengelola Library PHP)

### Apa itu Composer?

**Composer** adalah **pengelola library/paket untuk PHP**. Fungsinya sama seperti **npm** untuk JavaScript.

Project Laravel kita butuh banyak library (package) dari orang lain — misalnya library untuk hash password, kirim email, routing, dll. Composer akan mendownload dan mengelola semua library tersebut.

Bayangkan kalian mau bikin kue:
- **Composer** = aplikasi GoFood yang antar bahan kue ke rumah
- **Library** = bahan kue (tepung, gula, telur)
- **composer.json** = resep + daftar belanja

### Langkah Instalasi:

1. **Download Composer**
   - Buka `https://getcomposer.org/download/`
   - Klik **"Composer-Setup.exe"** — akan terdownload file installer

2. **Jalankan Installer**
   - Klik **"Next"**
   - Composer akan mendeteksi lokasi PHP kalian. Untuk **XAMPP** biasanya otomatis ke `C:\xampp\php\php.exe`. Untuk **Laragon** biasanya ke `C:\laragon\bin\php\php-8.x\php.exe`. Kalau tidak terdeteksi, klik **"Browse"** dan cari file `php.exe` di folder PHP kalian.
   - Pastikan **"Add to PATH"** tercentang
   - Klik **"Next"** terus sampai **"Install"**
   - Klik **"Finish"**

3. **Verifikasi**
   - Buka **Command Prompt** (Windows + R → ketik `cmd` → Enter)
   - Ketik:

   ```bash
   composer --version
   ```

   - Output yang diharapkan:
   ```
   Composer version 2.7.x ...
   ```

### Kalau Error "composer not recognized":

1. Buka **System Properties** (Windows + R → `sysdm.cpl` → Tab Advanced → Environment Variables)
2. Di **System Variables**, cari `Path` dan klik **Edit**
3. Tambahkan: `C:\ProgramData\ComposerSetup\bin`
4. Klik OK, restart terminal

---

## 2.6 Setup Database MySQL

Database adalah tempat penyimpanan data aplikasi kita — data peserta, user admin, divisi, jadwal interview, dll.

Kita akan menggunakan **phpMyAdmin**, yaitu website yang memudahkan kita mengelola database tanpa harus hapal perintah SQL.

### Langkah-langkah:

1. **Pastikan Apache dan MySQL sudah jalan** di XAMPP Control Panel atau Laragon (warna hijau)

2. **Buka phpMyAdmin**
   - **XAMPP**: Buka `http://localhost/phpmyadmin`
   - **Laragon**: Buka `http://localhost/adminer` atau install phpMyAdmin lewat **Tools → Quick add → phpMyAdmin**
   - Akan terbuka halaman untuk mengelola database

3. **Buat Database Baru**
   - Di halaman utama phpMyAdmin, klik tab **"Databases"**
   - Di kolom **"Create database"**, isi nama: `simahati_oprec`
   - Pilih **Collation**: `utf8mb4_general_ci` (biar bisa simpan karakter spesial)
   - Klik tombol **"Create"**

4. **Buat User Database (Opsional, untuk keamanan)**
   - Klik tab **"Privileges"** di halaman database
   - Klik **"Add user account"**
   - Isi:
     - **User name**: `simahati_user`
     - **Password**: `password_simahati` (atau password lain yang kalian ingat)
     - **Host**: `localhost`
   - Centang **"Create database with same name and grant all privileges"**
   - Klik **"Go"**

5. **Catat Informasi Database**

   Simpan informasi ini — akan dipakai di file `.env` nanti:

   ```
   Nama Database : simahati_oprec
   Username      : root (atau simahati_user kalau pakai user baru)
   Password      : (kosong) (atau password_simahati kalau pakai user baru)
   Host          : localhost
   Port          : 3306
   ```

> **Catatan:** Secara default, user `root` di XAMPP tidak punya password. Ini aman untuk localhost.

---

## 2.7 Setup Backend Laravel

### Apa itu Laravel?

Laravel adalah **framework** (kerangka kerja) untuk membuat aplikasi web dengan PHP. Framework menyediakan struktur dan tools yang sudah jadi sehingga kalian tidak perlu membuat semuanya dari nol.

Backend project SIMAHATI OpRec dibangun dengan Laravel.

### Langkah-langkah:

#### 1. Pastikan Project sudah di-clone

```bash
# XAMPP:
cd C:\xampp\htdocs

# Laragon (ganti sesuai path Laragon):
# cd C:\laragon\www

git clone https://github.com/HIMA-TI-Politeknik-Hasnur/SIMAHATI-OpRec.git
cd SIMAHATI-OpRec
```

> **Catatan path:** Folder project XAMPP ada di `C:\xampp\htdocs`, sedangkan Laragon di `C:\laragon\www`. Pilih sesuai yang kalian pakai.

#### 2. Masuk ke Folder Backend

```bash
cd backend
```

#### 3. Install Dependensi Backend dengan Composer

```bash
composer install
```

**Penjelasan:**
- Composer akan membaca file `composer.json` (daftar library yang dibutuhkan)
- Composer akan mendownload semua library tersebut ke folder `vendor/`
- Proses ini memakan waktu 1-5 menit tergantung internet

**Output yang diharapkan:**
```
Installing dependencies from lock file (including require-dev)
...
Package operations: 87 installs, 0 updates, 0 removals
...
Generating optimized autoload files
```

#### 4. Copy File .env

File `.env` berisi konfigurasi project — koneksi database, API key, dll. File ini **TIDAK boleh** masuk ke Git (sudah di `.gitignore`) karena berisi informasi sensitif.

```bash
copy .env.example .env
```

Atau (kalau pakai Git Bash):

```bash
cp .env.example .env
```

#### 5. Generate Application Key

```bash
php artisan key:generate
```

**Penjelasan:**
- `php artisan` — perintah untuk menjalankan tools Laravel
- `key:generate` — membuat kunci enkripsi unik untuk aplikasi kita
- Kunci ini akan disimpan di `.env` sebagai `APP_KEY`

#### 6. Edit File .env untuk Koneksi Database

Buka file `.env` dengan VSCode:

```bash
code .env
```

Cari dan edit bagian berikut — **sesuaikan dengan informasi database kalian**:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=simahati_oprec
DB_USERNAME=root
DB_PASSWORD=
```

**Penjelasan setiap baris:**
- `DB_CONNECTION=mysql` — kita pakai database MySQL (bisa juga PostgreSQL, SQLite, dll)
- `DB_HOST=127.0.0.1` — alamat server database (127.0.0.1 = localhost, artinya di komputer yang sama)
- `DB_PORT=3306` — port MySQL (default: 3306)
- `DB_DATABASE=simahati_oprec` — nama database yang kita buat di phpMyAdmin
- `DB_USERNAME=root` — username MySQL (root = admin)
- `DB_PASSWORD=` — password MySQL (kosong untuk root di XAMPP)

Kalau kalian membuat user khusus (bukan root), sesuaikan:

```env
DB_USERNAME=simahati_user
DB_PASSWORD=password_simahati
```

#### 7. Jalankan Migration (Membuat Tabel Database)

**Apa itu migration?** Migration adalah cara Laravel untuk membuat/mengubah tabel database secara terprogram. Daripada kita bikin tabel manual di phpMyAdmin, Laravel yang akan membuatkannya secara otomatis berdasarkan kode yang sudah ditulis.

```bash
php artisan migrate
```

**Output yang diharapkan:**
```
Migration table created successfully.
Migrating: 2014_10_12_000000_create_users_table
Migrated:  2014_10_12_000000_create_users_table (0.15 seconds)
Migrating: 2014_10_12_100000_create_password_resets_table
Migrated:  2014_10_12_100000_create_password_resets_table (0.12 seconds)
...
```

**Kalau error:** "Access denied for user 'root'@'localhost'" — berarti password atau username di `.env` salah. Cek kembali.

#### 8. Jalankan Seeder (Isi Data Dummy)

**Apa itu seeder?** Seeder adalah data percobaan (data dummy) yang sudah disiapkan — misalnya akun admin, beberapa peserta contoh, dll.

```bash
php artisan db:seed
```

Atau kalau mau spesifik:

```bash
php artisan db:seed --class=AdminUserSeeder
```

Setelah seed, biasanya akan ada akun admin default:

```
Email    : admin@simahati.test
Password : password
```

> **Catatan:** Data dummy ini hanya untuk testing di localhost. Jangan dipakai di server production.

#### 9. Jalankan Backend Server

```bash
php artisan serve
```

**Penjelasan:**
- `php artisan serve` — menjalankan server development Laravel
- Server akan berjalan di `http://localhost:8000`

**Output yang diharapkan:**
```
INFO  Server running on [http://localhost:8000].
```

**Artinya:** Backend kalian sekarang bisa diakses di `http://localhost:8000`.

**Biarkan terminal ini terbuka** — jangan ditutup selama kalian mau backend tetap jalan.

#### 10. Verifikasi Backend

- Buka browser baru
- Ketik: `http://localhost:8000`
- Kalau muncul halaman Laravel (atau response JSON dari API) → **BERHASIL!**

Untuk ngecek API, coba:

- `http://localhost:8000/api/health` — cek status API (kalau endpoint ini ada)
- Atau `http://localhost:8000/api/login` — cek endpoint login (akan error kalau tanpa data, itu normal)

---

## 2.8 Setup Frontend React + Vite

### Apa itu React dan Vite?

- **React** — library JavaScript untuk membuat antarmuka pengguna (UI). Semua halaman yang kalian lihat di browser dibuat dengan React.
- **Vite** — tools untuk menjalankan dan membangun project React. Vite cepat karena menggunakan teknologi modern.

### Langkah-langkah:

#### 1. Buka Terminal Baru

**PENTING:** Biarkan terminal backend tetap terbuka (yang menjalankan `php artisan serve`). Buka **terminal baru** untuk frontend.

#### 2. Pindah ke Folder Frontend

```bash
# Pindah ke folder frontend (XAMPP):
cd C:\xampp\htdocs\SIMAHATI-OpRec\frontend
# Laragon: cd C:\laragon\www\SIMAHATI-OpRec\frontend
```

#### 3. Install Dependensi Frontend dengan npm

```bash
npm install
```

**Penjelasan:**
- `npm install` — mendownload semua library yang dibutuhkan frontend
- Library akan disimpan di folder `node_modules/`
- Proses ini memakan waktu 1-3 menit

**Output yang diharapkan:**
```
added 250 packages in 30s
```
(Jumlahnya bisa berbeda)

#### 4. Edit File .env Frontend (Jika Ada)

Kalau ada file `.env.example` di folder frontend:

```bash
copy .env.example .env
```

Lalu edit `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

**Penjelasan:**
- `VITE_API_URL` — alamat backend API yang akan dipanggil frontend
- `http://localhost:8000/api` — backend Laravel kita jalan di port 8000

Kalau tidak ada file `.env`, biasanya URL API sudah di-set langsung di kode. Tanyakan ke Reyhan untuk pastinya.

#### 5. Jalankan Frontend Server

```bash
npm run dev
```

**Penjelasan:**
- `npm run dev` — menjalankan server development Vite
- Server akan berjalan di `http://localhost:5173`

**Output yang diharapkan:**
```
  VITE v5.x.x  ready in 300ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

**Biarkan terminal ini terbuka.**

#### 6. Verifikasi Frontend

- Buka browser
- Ketik: `http://localhost:5173`
- Kalau muncul halaman aplikasi SIMAHATI OpRec → **BERHASIL!**

Kalau halaman muncul tapi data kosong atau error, mungkin frontend belum bisa terhubung ke backend. Cek:
- Apakah backend sudah jalan (`php artisan serve` di terminal lain)?
- Apakah URL di `.env` frontend sudah benar?

---

## 2.9 Menjalankan Backend & Frontend Bersamaan

Untuk menjalankan aplikasi secara lengkap, kalian perlu **3 terminal yang berjalan bersamaan**:

### Terminal 1: Database (XAMPP / Laragon)
- **XAMPP**: XAMPP Control Panel sudah terbuka, Apache dan MySQL **Start** (hijau)
- **Laragon**: Laragon sudah terbuka, klik **Start All** (indikator hijau)
- Minimalisasi — biarkan jalan di background

### Terminal 2: Backend (Laravel)

Buka **Command Prompt** baru:

```bash
# XAMPP:
cd C:\xampp\htdocs\SIMAHATI-OpRec\backend
# Laragon:
# cd C:\laragon\www\SIMAHATI-OpRec\backend
php artisan serve
```

Biarkan terbuka. Kalau dimatikan, backend mati.

### Terminal 3: Frontend (React + Vite)

Buka **Command Prompt** baru (terminal ke-3):

```bash
# XAMPP:
cd C:\xampp\htdocs\SIMAHATI-OpRec\frontend
# Laragon:
# cd C:\laragon\www\SIMAHATI-OpRec\frontend
npm run dev
```

Biarkan terbuka. Kalau dimatikan, frontend mati.

### Layout Terminal yang Ideal:

```
+-------------------+-------------------+
|   Terminal 1      |   Terminal 2      |
|   (XAMPP)         |   (Backend)       |
|                   |   php artisan     |
|   Apache: 🟢      |   serve           |
|   MySQL: 🟢       |   localhost:8000  |
+-------------------+-------------------+
|   Terminal 3      |   Browser         |
|   (Frontend)      |                   |
|   npm run dev     |   localhost:5173  |
|   localhost:5173  |   (aplikasi)      |
+-------------------+-------------------+
```

### Cara Cepat (Satu Perintah untuk Semua):

Kalau bosan buka 3 terminal, Reyhan bisa bikin file `start.bat` di root project:

```batch
@echo off
echo ==== MULAI SIMAHATI OpRec ====

echo 1. Jalankan Backend...
REM XAMPP:
start cmd /k "cd /d C:\xampp\htdocs\SIMAHATI-OpRec\backend && php artisan serve"
REM Laragon: start cmd /k "cd /d C:\laragon\www\SIMAHATI-OpRec\backend && php artisan serve"

echo 2. Jalankan Frontend...
start cmd /k "cd /d C:\xampp\htdocs\SIMAHATI-OpRec\frontend && npm run dev"
REM Laragon: start cmd /k "cd /d C:\laragon\www\SIMAHATI-OpRec\frontend && npm run dev"

echo 3. Buka Browser...
start http://localhost:5173

echo Selesai! Jangan tutup jendela terminal.
pause
```

Simpan sebagai `start.bat`. Tinggal double-click, semua jalan otomatis.

---

## 2.10 Mengakses Aplikasi di Browser

### Alamat-Aamat Penting:

| Bagian | Alamat di Browser |
|--------|------------------|
| **Frontend (aplikasi utama)** | `http://localhost:5173` |
| **Backend (API)** | `http://localhost:8000/api/...` |
| **Database (phpMyAdmin/Adminer)** | XAMPP: `http://localhost/phpmyadmin` / Laragon: `http://localhost/adminer` |
| **XAMPP / Laragon Dashboard** | XAMPP: `http://localhost/dashboard` / Laragon: `http://localhost/` |

### Cara Cek Apakah Semua Berjalan:

1. **Cek Backend:**
   Buka: `http://localhost:8000`
   → Harusnya muncul response (halaman Laravel atau JSON)

2. **Cek Frontend:**
   Buka: `http://localhost:5173`
   → Harusnya muncul halaman aplikasi SIMAHATI

3. **Cek Database:**
   - **XAMPP**: Buka `http://localhost/phpmyadmin`
   - **Laragon**: Buka `http://localhost/adminer` (atau `http://localhost/phpmyadmin` kalau sudah diinstall)
   - Klik database `simahati_oprec`
   → Harusnya ada tabel-tabel (users, peserta, dll) hasil migration

### Testing End-to-End (Dari Browser Sampai Database):

1. Buka `http://localhost:5173`
2. Coba klik tombol **"Daftar"** atau **"Register"**
3. Isi form pendaftaran
4. Submit
5. Buka `http://localhost/phpmyadmin`
6. Klik database `simahati_oprec` → tabel `users` atau `peserta`
7. **Lihat data yang baru saja kalian input muncul di tabel!**

Kalau data muncul di database, berarti:
- ✅ Frontend sukses mengirim data ke Backend
- ✅ Backend sukses memproses data
- ✅ Database sukses menyimpan data

**Selamat! Aplikasi kalian berjalan dengan sempurna di localhost!**

---

## 2.11 Error yang Sering Muncul saat Deploy Localhost

### Error 1: `php not recognized`

**Pesan:**
```
'php' is not recognized as an internal or external command
```

**Penyebab:** PHP belum terdaftar di PATH Windows.

**Solusi:**
1. Cari folder PHP kalian:
   - **XAMPP**: `C:\xampp\php`
   - **Laragon**: `C:\laragon\bin\php\php-8.x\` (cek versi PHP di folder tersebut)
2. Buka **System Properties** → **Environment Variables**
3. Edit **Path** → **New**
4. Tambahkan:
   - **XAMPP**: `C:\xampp\php`
   - **Laragon**: `C:\laragon\bin\php\php-8.x` (sesuaikan versinya)
5. Klik OK, restart terminal

### Error 2: `composer not recognized`

**Pesan:**
```
'composer' is not recognized as an internal or external command
```

**Penyebab:** Composer belum terdaftar di PATH.

**Solusi:**
1. Cari `C:\ProgramData\ComposerSetup\bin\composer.phar`
2. Tambahkan folder itu ke PATH (cara sama seperti di atas)
3. Restart terminal

### Error 3: `Target class [controller] does not exist` (Laravel)

**Penyebab:** Route di Laravel mengarah ke controller yang belum dibuat.

**Solusi:**
- Jalankan `composer dump-autoload` untuk refresh daftar class
- Pastikan nama class dan namespace di file controller sudah benar

### Error 4: `Access denied for user 'root'@'localhost'`

**Pesan:**
```
SQLSTATE[HY000] [1045] Access denied for user 'root'@'localhost'
```

**Penyebab:** Password atau username di `.env` tidak cocok dengan MySQL.

**Solusi:**
1. Buka file `.env` di folder `backend`
2. Cek `DB_USERNAME` dan `DB_PASSWORD`
3. Pastikan sesuai dengan yang dipakai MySQL kalian
4. Default XAMPP: `root` dengan password kosong

### Error 5: `Port 5173 is already in use`

**Pesan:**
```
Error: Port 5173 is already in use
```

**Penyebab:** Ada aplikasi lain yang sudah pakai port 5173, atau frontend sudah jalan di terminal lain.

**Solusi:**
- Cek jangan-jangan kalian sudah buka `npm run dev` di terminal lain? Tutup yang lama.
- Atau ganti port: di `package.json` ubah jadi `"dev": "vite --port 5174"`

### Error 6: `Class "App\Models\User" not found`

**Penyebab:** Composer autoload belum di-refresh setelah menambah model baru.

**Solusi:**
```bash
composer dump-autoload
```

### Error 7: Halaman Frontend Putih (Blank) / Error CORS

**Pesan (di console browser F12):**
```
Access to XMLHttpRequest at 'http://localhost:8000/api/...' has been blocked by CORS policy
```

**Penyebab:** Browser memblokir request dari frontend (`localhost:5173`) ke backend (`localhost:8000`) karena beda alamat/port.

**Solusi (di backend Laravel):**
1. Buka file `config/cors.php`
2. Pastikan isinya:

```php
<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173'],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];
```

3. Kalau file tidak ada, publish dulu: `php artisan config:publish cors`

### Error 8: `The npm command is not recognized`

**Penyebab:** Node.js tidak terinstall atau tidak terdaftar di PATH.

**Solusi:**
1. Install Node.js (lihat tutorial OpenCode)
2. Atau restart terminal setelah instalasi

### Tabel Cepat Troubleshooting:

| Error | Kemungkinan Penyebab | Solusi Cepat |
|-------|---------------------|--------------|
| Halaman tidak bisa diakses | Server belum jalan | Jalankan `php artisan serve` atau `npm run dev` |
| Data tidak muncul | Backend mati atau URL salah | Cek terminal backend, cek `.env` frontend |
| Error database | XAMPP MySQL / Laragon MySQL mati | Start MySQL di XAMPP Control Panel atau klik Start All di Laragon |
| Login gagal | Belum seed admin | Jalankan `php artisan db:seed` |
| 404 Not Found | Route belum dibuat | Cek file `routes/api.php` |
| File upload error | Folder storage belum link | Jalankan `php artisan storage:link` |
| Composer error | Vendor belum diinstall | Jalankan `composer install` |

---

> **Catatan Penting:** Localhost hanya untuk development dan testing. Untuk production (digunakan oleh banyak orang), kalian perlu **deploy ke server** (VPS, shared hosting, atau platform seperti Railway, Vercel, dll). Tapi untuk sekarang, fokus dulu bikin aplikasi berjalan di localhost.
>
> Selamat ngoding, tim INGFO LOKER! 🚀

---

↩️ **[Kembali ke: CONTRIBUTING.md](CONTRIBUTING.md)** — Aturan main tim ➡️ **[Lanjut ke: docs/README.md](docs/README.md)** — Panduan folder docs
