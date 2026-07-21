# TUTORIAL

Selamat datang di dunia pemrograman!

Dokumen ini adalah panduan **paling dasar** yang akan mengajarkan kalian dari **nol absolut** tentang:

1. **Git & GitHub** — cara menyimpan dan mengelola kode project secara tim
2. **OpenCode** — asisten AI yang membantu menulis kode dari dalam VSCode

Tutorial ini ditulis khusus untuk anggota tim **INGFO LOKER** yang **baru pertama kali** menggunakan Git, GitHub, dan OpenCode. Tidak perlu takut — semua istilah akan dijelaskan dengan bahasa sederhana dan analogi sehari-hari.

---

## Daftar Isi

- [1. Git & GitHub — Untuk Pemula Absolut](#1-git--github--untuk-pemula-absolut)
  - [1.1 Kenalan Dulu: Apa itu Git? Apa itu GitHub?](#11-kenalan-dulu-apa-itu-git-apa-itu-github)
  - [1.2 Instalasi Git di Windows](#12-instalasi-git-di-windows)
  - [1.3 Membuka Terminal / Command Prompt](#13-membuka-terminal--command-prompt)
  - [1.4 Konfigurasi Awal Git (Nomor 1 Paling Penting!)](#14-konfigurasi-awal-git-nomor-1-paling-penting)
  - [1.5 Membuat Akun GitHub](#15-membuat-akun-github)
  - [1.6 Setup Repository Tim SIMAHATI (Dilakukan Reyhan)](#16-setup-repository-tim-simahati-dilakukan-reyhan)
  - [1.7 Cloning Repository — Download Project ke Komputer Kalian](#17-cloning-repository--download-project-ke-komputer-kalian)
  - [1.8 Istilah Penting yang Harus Kalian Pahami](#18-istilah-penting-yang-harus-kalian-pahami)
  - [1.9 Workflow Git Sehari-hari — Panduan Langkah demi Langkah](#19-workflow-git-sehari-hari--panduan-langkah-demi-langkah)
  - [1.10 Branching Strategy Tim SIMAHATI](#110-branching-strategy-tim-simahati)
  - [1.11 Pull Request & Code Review — Cara Menggabungkan Kode](#111-pull-request--code-review--cara-menggabungkan-kode)
  - [1.12 Mengatasi Conflict — Saat Kode Bertabrakan](#112-mengatasi-conflict--saat-kode-bertabrakan)
  - [1.13 Error yang Sering Muncul dan Cara Mengatasinya](#113-error-yang-sering-muncul-dan-cara-mengatasinya)
  - [1.14 Cheatsheet Git — Semua Perintah dalam Satu Tabel](#114-cheatsheet-git--semua-perintah-dalam-satu-tabel)
- [2. OpenCode di Windows VSCode](#2-opencode-di-windows-vscode)
  - [2.1 Kenalan Dulu: Apa itu Terminal? Node.js? npm?](#21-kenalan-dulu-apa-itu-terminal-nodejs-npm)
  - [2.2 Prasyarat — Yang Harus Diinstal Sebelumnya](#22-prasyarat--yang-harus-diinstal-sebelumnya)
  - [2.3 Instalasi Node.js](#23-instalasi-nodejs)
  - [2.4 Apa itu Visual Studio Code (VSCode)?](#24-apa-itu-visual-studio-code-vscode)
  - [2.5 Instalasi OpenCode](#25-instalasi-opencode)
  - [2.6 Menggunakan OpenCode di Terminal VSCode](#26-menggunakan-opencode-di-terminal-vscode)
  - [2.7 Perintah Dasar OpenCode](#27-perintah-dasar-opencode)
  - [2.8 Tips Menggunakan OpenCode untuk Pemula](#28-tips-menggunakan-opencode-untuk-pemula)

---

# BAGIAN 1: GIT & GITHUB

---

## 1.1 Kenalan Dulu: Apa itu Git? Apa itu GitHub?

Sebelum kita mulai instalasi, penting banget untuk paham dulu **kenapa** kita pakai tools ini.

### Cerita Tanpa Git

Bayangkan kalian ngerjain tugas kelompok lewat WA:

- **Reyhan** ngerjain bagian backend, kirim file `index.php` lewat WA
- **Nadil** ngerjain frontend, tapi Nadil pakai versi file `index.php` yang lama (sebelum Reyhan edit)
- **Anton** juga edit file yang sama, kirim versi lain lagi
- **Rizky** bingung karena file yang mana yang terbaru?

Akhirnya: **berantakan**. File ketimpa, bingung siapa yang ngerjain apa, dan kalau ada error susah dilacak.

### Dengan Git

Git bekerja seperti **mesin waktu** untuk project kalian. Setiap kali kalian "save", Git membuat **checkpoint** (disebut **commit**). Kalian bisa:

- Melihat siapa yang mengubah apa dan kapan
- Kembali ke versi sebelumnya kalau ada error
- Bekerja di "jalur" terpisah (disebut **branch**) tanpa mengganggu anggota lain
- Menggabungkan semua perubahan dengan rapi

> **Analogi Sederhana:** Git itu kayak **save point di game**. Kalau kalian mati di game, kalian bisa "load" dari save point terakhir. Git melakukan hal yang sama untuk kode kalian.

### Terus GitHub itu apa?

Kalau Git adalah software di komputer kalian, **GitHub** adalah **cloud / internet** tempat nyimpen project Git biar bisa diakses oleh seluruh tim.

> **Analogi Sederhana:** Git itu folder project di laptop kalian. GitHub itu **Google Drive**-nya — tempat kalian upload folder itu biar temen-temen bisa lihat dan download.

**Singkatnya:**
- **Git** = software di laptop yang track perubahan kode
- **GitHub** = website tempat nyimpen project Git biar bisa kolaborasi online

Sama seperti kalian punya Microsoft Word di laptop, tapi file-nya bisa di-share lewat Google Drive.

---

## 1.2 Instalasi Git di Windows

Kita akan install Git di Windows. (Kebanyakan dari kalian pakai Windows.)

### Langkah 1: Download Installer

1. Buka browser (Chrome/Edge)
2. Ketik di address bar: `https://git-scm.com/download/win`
3. Klik tombol download — nanti akan ke-download file installer (ukuran sekitar 50MB)

### Langkah 2: Jalankan Installer

1. Buka file installer yang sudah di-download (biasanya di folder `Downloads`)
2. Akan muncul jendela "Git Setup"
3. **Klik "Next"** terus sampai muncul halaman **"Choosing the default editor"**

### Langkah 3: Pilih Opsi yang Tepat

Berikut adalah halaman-halaman penting selama instalasi:

| Halaman | Yang Harus Dipilih |
|---------|-------------------|
| **Select Components** | Biarkan centangan default (Git Bash, Git GUI, Git LFS) |
| **Choosing the default editor** | Pilih **"Use Visual Studio Code as Git's default editor"** (tapi kalau belum punya VSCode, pilih "Use Notepad" dulu) |
| **Adjusting your PATH environment** | Pilih **"Git from the command line and also from 3rd-party software"** **(PENTING!)** |
| **Choosing HTTPS transport backend** | Pilih **"Use the OpenSSL library"** |
| **Configuring the line ending conversions** | Pilih **"Checkout Windows-style, commit Unix-style line endings"** |
| **Choosing a terminal emulator** | Pilih **"Use MinTTY (the default terminal of MSYS2)"** |

### Langkah 4: Selesai

Klik **"Install"** dan tunggu proses selesai. Kalau sudah, centang **"Launch Git Bash"** lalu klik **"Finish"**.

### Langkah 5: Verifikasi Instalasi

Setelah installer selesai, kita perlu ngecek apakah Git sudah terinstall dengan benar.

**Cara 1: Git Bash (yang terbuka otomatis)**
- Setelah klik Finish, jendela Git Bash akan terbuka
- Ketik perintah berikut:

```bash
git --version
```

- Hasil yang diharapkan (contoh):
```
git version 2.43.0.windows.1
```

**Cara 2: Command Prompt**
Kalau Git Bash tidak terbuka:
1. Tekan tombol **Windows** di keyboard
2. Ketik `cmd`
3. Enter
4. Ketik:

```bash
git --version
```

### Kenapa Langkah Ini Penting?

`git --version` adalah cara untuk memastikan Git sudah terinstall dan siap digunakan. Kalau muncul tulisan `'git' is not recognized`, berarti instalasi belum benar — coba restart komputer atau instal ulang.

---

## 1.3 Membuka Terminal / Command Prompt

Sepanjang tutorial ini, kalian akan sering disuruh "buka terminal" atau "ketik perintah". Berikut cara membukanya:

### Cara Membuka Command Prompt (CMD):

1. Tekan tombol **Windows** (logo jendela) di keyboard
2. Ketik: `cmd`
3. Klik **"Command Prompt"** yang muncul

### Cara Membuka PowerShell (Alternatif):

1. Klik kanan tombol **Start** (logo Windows di pojok kiri bawah)
2. Pilih **"Windows PowerShell"** atau **"Terminal"**
3. Atau tekan `Win + X` lalu pilih **"Terminal"**

### Cara Membuka Git Bash (Rekomendasi):

1. Tekan **Windows**
2. Ketik: `Git Bash`
3. Klik **"Git Bash"**

> **Tips:** Untuk pemula, **Git Bash** lebih nyaman karena tampilannya mirip Linux dan perintah-perintahnya lebih lengkap.

### Tampilan Terminal

Ketika terminal terbuka, kalian akan melihat sesuatu seperti ini:

```
C:\Users\NamaKalian>
```

atau (di Git Bash):

```
NamaKalian@Laptop MINGW64 ~
$
```

Ini disebut **prompt**. Tanda `>` atau `$` berarti terminal siap menerima perintah.

### Perintah Terminal Dasar yang Wajib Diketahui:

| Perintah | Fungsi | Contoh |
|----------|--------|--------|
| `pwd` | Lihat folder saat ini (print working directory) | `pwd` → `C:\Users\NamaKalian` |
| `dir` | Lihat isi folder (daftar file) | `dir` |
| `ls` | Lihat isi folder (hanya di Git Bash) | `ls` |
| `cd <nama-folder>` | Pindah ke folder | `cd Documents` |
| `cd ..` | Naik satu level folder | `cd ..` |
| `mkdir <nama-folder>` | Buat folder baru | `mkdir project-saya` |
| `clear` | Bersihkan layar terminal | `clear` |

### Latihan Sederhana:

```bash
# Lihat folder saat ini
pwd

# Lihat isi folder
dir

# Buat folder baru
mkdir latihan-git

# Pindah ke folder yang baru dibuat
cd latihan-git

# Lihat apakah kita sudah di dalam folder latihan-git
pwd
```

---

## 1.4 Konfigurasi Awal Git (Nomor 1 Paling Penting!)

Setelah Git terinstall, kalian harus "memperkenalkan diri" ke Git. Ini penting karena **setiap perubahan yang kalian buat akan ditandai dengan nama kalian**.

Buka **Git Bash** atau **Command Prompt**, lalu ketik perintah berikut **SATU PER SATU** (tekan Enter setelah setiap baris):

### 1. Set Nama Kalian

```bash
git config --global user.name "Nama Lengkap Kalian"
```

**Penjelasan:**
- `git config` = perintah untuk mengatur pengaturan Git
- `--global` = pengaturan ini berlaku untuk semua project (tidak hanya project ini)
- `user.name` = kita mengatur nama pengguna
- `"Nama Lengkap Kalian"` = ganti dengan nama asli kalian, misalnya `"Nadil"`

### 2. Set Email Kalian

```bash
git config --global user.email "emailkalian@example.com"
```

**PENTING:** Email ini harus **sama dengan email yang kalian pakai saat mendaftar GitHub nanti**. Kalau beda, nanti kontribusi kalian tidak terhubung ke akun GitHub.

### 3. Set Nama Branch Default (PENTING!)

```bash
git config --global init.defaultBranch main
```

Dulu branch utama bernama `master`, sekarang menggunakan `main`. Perintah ini memastikan kalian pakai `main`.

### 4. Atur Penanganan Baris Baris (Cocok untuk Windows)

```bash
git config --global core.autocrlf true
```

Penjelasan sederhana: Windows dan Linux/Mac menggunakan karakter berbeda untuk baris baru. Pengaturan ini mencegah kekacauan saat tim kalian menggunakan OS berbeda.

### 5. Simpan Password (Biar Tidak Capek Ngetik Tiap Kali)

```bash
git config --global credential.helper store
```

**PERINGATAN:** Ini menyimpan password kalian di disk. Aman untuk laptop pribadi. **Jangan** lakukan di komputer umum/warnet.

### 6. Cek Semua Konfigurasi

```bash
git config --list
```

Akan keluar semua pengaturan yang sudah kalian set. Pastikan `user.name` dan `user.email` sudah sesuai.

### Contoh Output yang Benar:

```
user.name=Nadil
user.email=nadil@gmail.com
init.defaultBranch=main
core.autocrlf=true
credential.helper=store
```

---

## 1.5 Membuat Akun GitHub

GitHub adalah website tempat kita menyimpan project. Setiap anggota tim WAJIB punya akun GitHub.

### Langkah-langkah:

1. Buka browser, ketik: `https://github.com`
2. Klik tombol **"Sign up"** di pojok kanan atas
3. Masukkan:
   - **Email** — pakai email yang kalian punya
   - **Password** — buat password yang kuat (minimal 8 karakter, ada huruf besar, angka)
   - **Username** — pilih username yang professional, misalnya: `nadil-dev`, `anton-code`, `rizky-web`
4. Verifikasi captcha
5. Cek email kalian — GitHub akan mengirim kode verifikasi
6. Masukkan kode verifikasi tersebut
7. Jawab pertanyaan tentang pengalaman programming (boleh pilih "None" atau "Beginner")
8. Pilih **"Free"** plan (yang gratis)

### Selesai! Kalian sudah punya akun GitHub.

> **Catatan:** Simpan email dan password GitHub kalian baik-baik. Kalian akan sering memakainya.

---

## 1.6 Setup Repository Tim SIMAHATI (Dilakukan Reyhan)

Bagian ini adalah tugas **Reyhan** sebagai Lead Developer. Anggota lain boleh baca untuk paham, tapi yang menjalankan perintah di bawah ini hanya Reyhan.

### Apa itu Repository?

**Repository** (atau "repo") adalah folder project yang sudah diinisialisasi dengan Git. Bayangkan seperti folder biasa, tapi ada folder `.git` tersembunyi di dalamnya yang nyimpen semua sejarah perubahan.

### Langkah 1: Buat Repository di GitHub (Website)

1. Buka `https://github.com` dan login dengan akun GitHub kalian
2. Di pojok kanan atas, klik tombol **"+"** (ikon plus)
3. Pilih **"New repository"**
4. Isi form:
   - **Repository name**: `SIMAHATI-OpRec` (nama project kita)
   - **Description** (opsional): `Sistem Informasi Manajemen Himpunan Mahasiswa Teknik Informatika - Open Recruitment`
   - **Visibility**: pilih **Private** (karena project internal)
   - Jangan centang **"Add a README file"**
   - Jangan centang **"Add .gitignore"**
5. Klik tombol hijau **"Create repository"**

Setelah ini, GitHub akan menampilkan halaman dengan perintah-perintah Git. **Jangan ditutup dulu**, kita akan pakai perintah dari halaman itu.

### Langkah 2: Inisialisasi Repository di Komputer Lokal

Buka **Git Bash** atau **Command Prompt**, lalu jalankan perintah berikut satu per satu:

```bash
# Buat folder project
mkdir SIMAHATI-OpRec

# Pindah ke folder project
cd SIMAHATI-OpRec

# Inisialisasi Git di folder ini
git init
```

**Penjelasan setiap perintah:**
- `mkdir SIMAHATI-OpRec` — **M**a**k**e **dir**ectory = buat folder bernama `SIMAHATI-OpRec`
- `cd SIMAHATI-OpRec` — **C**hange **d**irectory = pindah ke folder tersebut
- `git init` — **Init**ialize = memberitahu Git untuk mulai "mengawasi" folder ini. Sekarang Git akan track semua perubahan di folder ini.

**Output yang diharapkan:**
```
Initialized empty Git repository in C:/Users/Reyhan/SIMAHATI-OpRec/.git/
```

### Langkah 3: Buat Branch main

```bash
git checkout -b main
```

**Penjelasan:**
- `git checkout` — pindah ke branch
- `-b` — buat branch baru kalau belum ada
- `main` — nama branch-nya

Jadi perintah ini = "buat branch baru bernama main, lalu pindah ke branch tersebut"

### Langkah 4: Buat File `.gitignore`

File `.gitignore` berfungsi untuk memberi tahu Git: "file-file ini jangan di-track, ya".

Misalnya, folder `node_modules` berisi ribuan file library yang tidak perlu di-upload ke GitHub. File `.env` berisi password database yang TIDAK BOLEH di-share.

**Cara membuat file .gitignore:**

```bash
echo '.DS_Store
Thumbs.db
.vscode/
.idea/
*.zip
*.rar
' > .gitignore
```

> **Catatan:** Backend (Laravel) dan Frontend (React) sudah punya `.gitignore` masing-masing yang di-generate otomatis saat project dibuat. Root `.gitignore` hanya perlu mencakup file di root level.

### Langkah 5: Commit Awal (Checkpoint Pertama)

```bash
# Tambah file .gitignore ke "staging area"
git add .gitignore

# Buat checkpoint (commit) pertama
git commit -m "chore: initial project setup with .gitignore"
```

**Penjelasan:**
- `git add .gitignore` — memberitahu Git: "File .gitignore ini mau saya simpan perubahannya"
- `git commit` — membuat checkpoint (titik penyimpanan)
- `-m "chore: initial..."` — `-m` artinya **m**essage, yaitu pesan yang menjelaskan apa yang diubah
- `"chore: initial project setup with .gitignore"` — pesannya: "pekerjaan awal: setup project dengan .gitignore"

### Langkah 6: Buat Branch Development

```bash
# Buat branch development (posisi masih di main, jadi development akan sama persis dengan main)
git branch development
```

**Maksudnya:** Kita punya dua cabang sekarang:
- `main` — branch produksi (hanya berisi kode yang sudah jadi dan stabil)
- `development` — branch tempat kita mengintegrasikan semua fitur

### Langkah 7: Hubungkan ke GitHub (Remote)

```bash
git remote add origin https://github.com/HIMA-TI-Politeknik-Hasnur/SIMAHATI-OpRec.git
```

**Penjelasan:**
- `git remote` — mengatur koneksi ke server jarak jauh
- `add` — menambah koneksi baru
- `origin` — nama default untuk koneksi ke GitHub (seperti nickname)
- `https://...` — alamat repository GitHub kita

**Artinya:** "Hei Git, tolong catat bahwa ada server remote yang bernama 'origin' di alamat ini."

### Langkah 8: Upload ke GitHub (Push)

```bash
# Upload branch main ke GitHub
git push -u origin main

# Upload branch development ke GitHub
git push -u origin development
```

**Penjelasan:**
- `git push` — mendorong/upload kode dari laptop ke GitHub
- `-u` — **u**pstream = mencatat bahwa branch lokal ini terhubung ke branch remote. **Cukup sekali aja**, lain kali cukup `git push`
- `origin` — server tujuannya (yang tadi kita daftarkan)
- `main` / `development` — branch yang di-upload

**Yang akan terjadi:**
1. Git akan meminta username dan password GitHub
2. Masukkan username dan password
3. Kode akan terupload ke GitHub
4. Buka GitHub di browser → refresh halaman → lihat kode sudah ada di sana!

### Apa yang Terjadi Kalau Reyhan Selesai?

Setelah Reyhan selesai, di GitHub akan ada:
- Branch `main` dengan satu file `.gitignore`
- Branch `development` (sama persis dengan main untuk sekarang)

Anggota lain tinggal **clone** (download) repository-nya dan mulai bekerja di branch fitur masing-masing.

---

## 1.7 Cloning Repository — Download Project ke Komputer Kalian

**Ini dilakukan oleh SEMUA anggota tim** (Nadil, Anton, Rizky, dan Reyhan kalau pakai komputer berbeda).

### Apa itu Clone?

**Clone** = menduplikat (meng-copy) repository dari GitHub ke laptop kalian.

Bayangkan kalian punya folder project di Google Drive. Clone itu seperti **mendownload** folder tersebut ke laptop. Bedanya, folder yang di-clone masih terhubung dengan yang di Google Drive — kalau ada perubahan, bisa di-sync.

### Langkah-langkah Clone:

#### 1. Buka Terminal

Buka **Git Bash** atau **Command Prompt**

#### 2. Pindah ke Lokasi yang Tepat

Pertama, pindah ke folder tempat kalian ingin menyimpan project. Misalnya di Desktop atau Documents.

```bash
cd Desktop
```
atau
```bash
cd Documents
```

**Tips:** Pastikan kalian `cd` ke folder yang benar. Jangan sampai project terdownload di dalam folder yang salah.

#### 3. Clone Repository

```bash
git clone https://github.com/HIMA-TI-Politeknik-Hasnur/SIMAHATI-OpRec.git
```

**Penjelasan:**
- `git clone` — perintah untuk mendownload repository
- `https://...` — alamat repository GitHub

**Output yang diharapkan:**
```
Cloning into 'SIMAHATI-OpRec'...
remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3/3), done.
remote: Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (3/3), done.
```

Kalau muncul peringatan tentang login, masukkan username dan password GitHub kalian.

#### 4. Masuk ke Folder Project

```bash
cd SIMAHATI-OpRec
```

Sekarang kalian berada di dalam folder project. Cek isinya:

```bash
dir
```

Atau (di Git Bash):

```bash
ls -a
```

Kalian akan melihat file `.gitignore` dan folder `.git` (folder tersembunyi yang berisi database Git).

### Setelah Clone — Buat Branch Fitur Sendiri

**PENTING:** Setelah clone, JANGAN langsung coding di branch `main` atau `development`. Kalian harus membuat **branch fitur** sendiri.

```bash
# Contoh untuk Nadil (Fitur Pendaftaran):
git checkout -b feature/pendaftaran origin/development
git push -u origin feature/pendaftaran
```

**Penjelasan:**
- `git checkout` — pindah ke branch
- `-b feature/pendaftaran` — buat branch BARU bernama `feature/pendaftaran`
- `origin/development` — branch ini dibuat berdasarkan `development` yang ada di GitHub
- `git push -u origin feature/pendaftaran` — upload branch baru ke GitHub

**Untuk tiap anggota:**

| Anggota | Perintah |
|---------|----------|
| **Nadil** | `git checkout -b feature/pendaftaran origin/development` |
| **Anton** | `git checkout -b feature/divisi origin/development` |
| **Rizky** | `git checkout -b feature/cms origin/development` |
| **Reyhan** | `git checkout -b feature/setup-project origin/development` |

### Cara Cek Branch Saat Ini

```bash
git branch
```

Tanda `*` (bintang) menunjukkan branch yang sedang aktif.

```
* feature/pendaftaran
  development
  main
```

Berarti kita sedang berada di branch `feature/pendaftaran`.

---

## 1.8 Istilah Penting yang Harus Kalian Pahami

Sebelum lanjut ke workflow, kalian harus paham istilah-istilah ini **BENERAN** karena akan dipakai terus.

### Repository (Repo)

Folder project yang diawasi oleh Git. Di dalamnya ada folder `.git` yang menyimpan sejarah perubahan.

### Commit

Commit itu seperti **save point di game** atau **tombol save**. Setiap kali kalian selesai ngerjain sesuatu yang berarti, kalian bikin commit.

Setiap commit punya:
- **ID unik** — misalnya `a1b2c3d4e5f6...`
- **Pesan** — deskripsi tentang apa yang diubah
- **Waktu** — kapan commit dibuat
- **Pembuat** — siapa yang membuat commit

### Staging Area

Bayangkan kalian mau foto copy dokumen. Sebelum di-copy, kalian harus **naruh dokumen di atas mesin foto copy** dulu. Staging area itu seperti "mesin foto copy"-nya Git.

- `git add file` = taruh file di atas mesin foto copy
- `git commit` = tekan tombol foto copy (simpan permanen)

Kenapa ada tahap staging? Biar kalian bisa milih file mana aja yang mau di-commit. Misalnya dari 5 file yang diedit, cuma 3 yang mau disimpan, sisanya belum selesai.

### Branch (Cabang)

Branch adalah **jalur pengembangan terpisah**. Bayangkan kalian nulis novel:
- **Branch main** = versi final yang sudah jadi
- **Branch development** = draf gabungan semua bab
- **Branch feature/pendaftaran** = kalian nulis Bab 3 di kertas terpisah

Dengan branch, kalian bisa kerja tanpa takut merusak kode orang lain.

### Remote

Remote adalah **koneksi ke server jarak jauh** (dalam kasus kita: GitHub). Origin adalah nama default untuk remote.

- `origin/main` = branch `main` yang ada di GitHub
- `origin/development` = branch `development` yang ada di GitHub

### Push dan Pull

- **Push** = mengirim (upload) commit dari laptop ke GitHub
- **Pull** = mengambil (download) commit terbaru dari GitHub ke laptop

### Clone vs Pull

- **Clone** = download SELURUH repository untuk pertama kali (cuma sekali)
- **Pull** = ambil PERUBAHAN TERBARU saja (dilakukan setiap hari)

---

## 1.9 Workflow Git Sehari-hari — Panduan Langkah demi Langkah

Ini adalah rutinitas harian yang harus kalian lakukan SETIAP KALI mau coding. Ikuti langkah-langkah ini secara berurutan:

### Diagram Alur

```
MULAI
  │
  ▼
1. git checkout development
  │
  ▼
2. git pull origin development
  │  (ambil perubahan terbaru dari tim)
  ▼
3. git checkout feature/xxx
  │  (kembali ke branch fitur sendiri)
  ▼
4. git merge development
  │  (gabung perubahan tim ke branch fitur)
  ▼
5. KERJAKAN FITUR (coding, edit file)
  │
  ▼
6. git add .
  │  (stage semua perubahan)
  ▼
7. git commit -m "pesan"
  │  (buat checkpoint)
  ▼
8. git push origin feature/xxx
  │  (simpan ke GitHub)
  ▼
SELESAI SESI / LANJUT CODING
```

### Penjelasan Detail — SETIAP LANGKAH

#### Langkah 0: Buka Terminal

Buka terminal di folder project kalian. Pastikan kalian sudah di dalam folder `SIMAHATI-OpRec`.

```bash
cd C:\Users\NamaKalian\Documents\SIMAHATI-OpRec
```

#### Langkah 1: Pindah ke Branch Development

```bash
git checkout development
```

**Kenapa?** Sebelum mulai kerja, kita perlu ambil perubahan terbaru dari tim. Tapi kita harus pindah ke `development` dulu untuk bisa pull.

#### Langkah 2: Ambil Perubahan Terbaru dari Tim

```bash
git pull origin development
```

**Kenapa?** Sementara kalian offline/tidur, mungkin:
- Nadil sudah push code pendaftaran
- Anton sudah push code interview

`git pull` akan mendownload semua perubahan itu ke laptop kalian.

**Output yang diharapkan:**
```
Already up to date.
```
(artinya: tidak ada perubahan baru — laptop kalian sudah sama dengan GitHub)

Atau:
```
Updating a1b2c3d..e5f6g7h
 3 files changed, 45 insertions(+), 10 deletions(-)
```
(artinya: ada 3 file yang berubah — 45 baris ditambah, 10 baris dihapus)

#### Langkah 3: Kembali ke Branch Fitur Kalian

```bash
git checkout feature/pendaftaran
```

(Kalau kalian Nadil), ganti dengan nama branch masing-masing:
- Anton: `git checkout feature/divisi`
- Rizky: `git checkout feature/cms`
- Reyhan: `git checkout feature/setup-project`

#### Langkah 4: Gabung Perubahan Tim ke Branch Fitur

```bash
git merge development
```

**Kenapa?** Sekarang kita ambil perubahan dari `development` (yang sudah kita pull tadi) dan masukin ke branch fitur kita. Ini penting biar kode kita selalu up-to-date dengan kode anggota lain.

> **Catatan:** Kalau muncul pesan tentang "merge conflict", jangan panik. Itu terjadi kalau ada anggota lain yang mengubah file yang sama dengan yang kalian ubah. Lihat [bab 1.12](#112-mengatasi-conflict--saat-kode-bertabrakan) untuk cara mengatasinya.

#### Langkah 5: Coding (Edit File)

Sekarang kalian bisa mulai ngoding. Buat file baru, edit file yang ada, pokoknya kerja seperti biasa.

#### Langkah 6: Stage Semua Perubahan

Setelah selesai ngoding (atau di tengah-tengah kalau udah capek), kita simpan perubahannya ke Git.

```bash
git add .
```

**Penjelasan:**
- `git add` — memasukkan file ke staging area (mesin foto copy)
- `.` (titik) — artinya "semua file" (yang berubah atau baru)

**Alternatif — kalau cuma mau stage file tertentu:**
```bash
git add src/components/FormPendaftaran.tsx
```

#### Langkah 7: Commit (Buat Checkpoint)

```bash
git commit -m "feat: menambahkan form pendaftaran multi step"
```

**Penjelasan:**
- `git commit` — membuat checkpoint
- `-m` — diikuti dengan pesan
- `"feat: menambahkan..."` — pesannya

**Aturan pesan commit yang baik:**
- Singkat tapi jelas (maks 72 karakter)
- Mulai dengan kata kerja (menambahkan, memperbaiki, mengubah)
- Gunakan bahasa Indonesia atau Inggris (pilih salah satu, konsisten)

**Contoh pesan commit yang bagus:**
- `"feat: menambahkan form login"`
- `"fix: memperbaiki error validasi email"`
- `"style: mengubah warna tombol menjadi biru"`
- `"refactor: memisahkan komponen form ke file terpisah"`

#### Langkah 8: Push ke GitHub

```bash
git push origin feature/pendaftaran
```

Ini akan mengirim commit kalian ke GitHub. Sekarang anggota lain bisa melihat perubahan kalian.

**Output yang diharapkan:**
```
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
...
To https://github.com/HIMA-TI-Politeknik-Hasnur/SIMAHATI-OpRec.git
   a1b2c3d..e5f6g7h  feature/pendaftaran -> feature/pendaftaran
```

### Contoh Lengkap Satu Sesi Coding:

```bash
# Pindah ke development, ambil update
git checkout development
git pull origin development

# Kembali ke branch fitur
git checkout feature/pendaftaran

# Gabung perubahan terbaru
git merge development

# ---- NGODING DI SINI ----
# (edit file-file project)

# Simpan perubahan
git add .
git commit -m "feat: menambahkan form biodata peserta"
git push origin feature/pendaftaran
```

### Tips Penting:

1. **Jangan lupa pull dulu** sebelum mulai coding! Ini yang paling sering bikin conflict.
2. **Commit sering-sering**. Kalau ada error, lebih mudah mundur dari commit kecil daripada commit besar.
3. **Push setiap selesai sesi**. Biar kode kalian aman di cloud, dan anggota lain bisa lihat progress.
4. **Jangan push ke development/main langsung**. Selalu push ke branch fitur kalian, baru bikin PR.

---

## 1.10 Branching Strategy Tim SIMAHATI

### Struktur Branch Tim Kita

```
main  (branch PRODUKSI — hanya diisi kalau semua fitur sudah siap)
 │
 └── development  (branch INTEGRASI — tempat kumpul semua fitur)
      │
      ├── feature/setup-project    ← Reyhan (Auth, Dashboard, Deployment)
      ├── feature/pendaftaran      ← Nadil (Form Pendaftaran, Upload)
      ├── feature/divisi           ← Anton (Divisi, Interview, Penilaian)
      └── feature/cms              ← Rizky (Landing Page, Pengumuman, CMS)
```

### Penjelasan Tiap Branch

| Branch | Fungsi | Siapa yang Nulis | Boleh Push Langsung? |
|--------|--------|-----------------|---------------------|
| `main` | Kode yang sudah jadi dan stabil | Semua (via PR dari development) | **TIDAK** |
| `development` | Gabungan kode dari semua anggota | Semua (via PR dari feature) | **TIDAK** |
| `feature/xxx` | Tempat kerja masing-masing | Masing-masing anggota | **YA, bebas** |

### Aturan Emas (JANGAN DILANGGAR):

1. **DILARANG commit langsung ke `main` atau `development`**. Semua harus melalui Pull Request (PR).
2. **Setiap fitur punya branch sendiri**. Jangan campur fitur kalian di branch yang sama.
3. **Buat branch fitur dari `development`, bukan dari `main`**.
4. **Hapus branch fitur setelah di-merge ke development**.
5. **Pull Request WAJIB di-review minimal 1 anggota lain** sebelum di-merge.

### Kenapa Aturan Ini Penting?

Bayangkan `main` itu toko yang buka untuk pelanggan. `development` itu gudang belakang. `feature/xxx` itu meja kerja masing-masing karyawan.

Kalian kerja di meja sendiri (feature branch), kalau sudah jadi diajukan ke supervisor (PR), dicek dulu (code review), baru boleh masuk ke gudang (development). Kalau semua barang sudah siap, baru dipajang di toko (main).

Kalau kalian langsung masukin barang ke toko sebelum jadi, pelanggan (user) akan lihat barang setengah jadi — **kacau!**

### Perintah untuk Membuat Branch Fitur Baru:

```bash
git checkout development          # pindah ke development dulu
git pull origin development       # pastikan development sudah terbaru
git checkout -b feature/nama-fitur   # buat branch fitur baru
git push -u origin feature/nama-fitur   # upload ke GitHub
```

### Perintah untuk Sinkronisasi Branch Fitur:

```bash
git checkout feature/nama-fitur   # pindah ke branch fitur
git merge development              # ambil perubahan terbaru dari development
# kalau ada conflict, resolve dulu
git push origin feature/nama-fitur # upload hasil merge
```

---

## 1.11 Pull Request & Code Review — Cara Menggabungkan Kode

### Apa itu Pull Request?

Pull Request (PR) adalah **permintaan resmi** untuk menggabungkan kode dari branch kalian ke branch lain (biasanya ke `development`).

PR itu seperti kalian bilang: "Hei tim, kode saya udah selesai. Tolong dicek dulu, ya. Kalau ok, baru masukin ke development."

### Kenapa Perlu PR?

1. **Quality control** — kode dicek dulu sebelum masuk, mengurangi error
2. **Pengetahuan bersama** — anggota lain jadi tahu apa yang kalian buat
3. **Diskusi** — kalau ada yang kurang pas, bisa dibahas sebelum merge

### Langkah-langkah Membuat Pull Request:

#### Sebelum PR: Pastikan Branch Kalian Up-to-Date

Jangan langsung bikin PR kalau branch kalian masih versi lama. Sinkronisasi dulu:

```bash
git checkout development
git pull origin development
git checkout feature/pendaftaran
git merge development
git push origin feature/pendaftaran
```

#### Bikin PR di GitHub:

1. Buka browser dan login ke GitHub
2. Buka repository `HIMA-TI-Politeknik-Hasnur/SIMAHATI-OpRec`
3. Akan muncul banner kuning: **"feature/pendaftaran had recent pushes"** dengan tombol **"Compare & pull request"**
   - **Klik tombol itu** (paling cepat)

   Atau (kalau bannernya tidak muncul):
   - Klik tab **"Pull requests"**
   - Klik tombol hijau **"New pull request"**
   - Pilih **base:** `development` | **compare:** `feature/pendaftaran`
   - Klik **"Create pull request"**

4. Isi form PR:
   - **Title**: Judul yang jelas, contoh: `feat: menambahkan multi step form pendaftaran`
   - **Description** (opsional): Jelaskan apa yang kalian buat, misalnya:
     ```
     Yang diubah:
     - Menambahkan form biodata (nama, NIM, semester)
     - Menambahkan form upload dokumen (KTM, CV)
     - Validasi input sudah jalan

     Coba cek: halaman /daftar sudah bisa diakses.
     ```
   - **Assignees**: pilih nama kalian (yang bertanggung jawab atas PR ini)
   - **Reviewers**: pilih **minimal 1 anggota lain** untuk nge-review

5. Klik **"Create pull request"**

#### Melakukan Code Review (Sebagai Reviewer):

Ketika kalian di-assign sebagai reviewer, lakukan:

1. Buka tab **"Pull requests"** di GitHub
2. Klik PR yang kalian harus review
3. Klik tab **"Files changed"** — ini akan menampilkan semua kode yang diubah
4. Baca kode baris per baris
5. Kalau ada yang aneh atau error:
   - Arahkan kursor ke baris kode yang bermasalah
   - Klik ikon **"+"** yang muncul di samping nomor baris
   - Tulis komentar
6. Kalau selesai, klik **"Review changes"** (pojok kanan atas)
7. Pilih opsi:
   - **Comment** — kasih saran/saran saja, belum approve
   - **Approve** — kode sudah OK, setuju untuk di-merge
   - **Request changes** — ada yang harus diperbaiki dulu
8. Klik **"Submit review"**

#### Setelah PR Disetujui:

1. Klik **"Merge pull request"**
2. Pilih **"Create a merge commit"** (opsi default)
3. Klik **"Confirm merge"**
4. Klik **"Delete branch"** — untuk membersihkan branch yang sudah tidak dipakai

### Visual Flow PR Tim Kita:

```
feature/pendaftaran ──── PR ────→ development ──── PR ────→ main
                                      ↑                        ↑
                              (setiap fitur selesai)    (setelah SEMUA fitur selesai
                                                         dan sudah diuji bersama)
```

---

## 1.12 Mengatasi Conflict — Saat Kode Bertabrakan

### Apa itu Conflict?

Conflict terjadi ketika **dua orang mengubah baris yang SAMA** di file yang SAMA. Git jadi bingung: "Yang bener yang mana, nih?"

**Contoh kejadian:** 
- Nadil edit baris 10 di file `FormDaftar.tsx` (di branch `feature/pendaftaran`)
- Anton juga edit baris 10 di file yang sama (di branch `development`)
- Saat Nadil melakukan `git merge development`, Git bingung — "Punya Nadil atau punya Anton yang dipakai?"

### Jangan Panik! Conflict itu Hal Biasa

Conflict **bukan error**. Ini fitur Git untuk mencegah data ketimpa tanpa sadar. Anggap saja Git bilang: "Hei, ada dua perubahan di tempat yang sama. Tolong diputuskan, yang mana yang benar?"

### Langkah-langkah Mengatasi Conflict:

#### 1. Cari Tahu File yang Conflict

Saat kalian menjalankan `git merge development` dan terjadi conflict, output-nya akan seperti ini:

```
Auto-merging src/components/FormDaftar.tsx
CONFLICT (content): Merge conflict in src/components/FormDaftar.tsx
Automatic merge failed; fix conflicts and then commit the result.
```

Git memberitahu: ada conflict di file `src/components/FormDaftar.tsx`.

#### 2. Buka File yang Conflict

Buka file tersebut di VSCode. Kalian akan melihat tanda-tanda berikut:

```
<<<<<<< HEAD
// Kode dari BRANCH KITA (feature/pendaftaran)
const nama = "Nadil";
const nim = "12345";
=======
// Kode dari BRANCH YANG DI-MERGE (development)
const nama = "Anton";
const nim = "67890";
>>>>>>> development
```

**Penjelasan:**
- `<<<<<<< HEAD` — awal dari kode **milik kita** (branch fitur)
- `=======` — pemisah antara kode kita dan kode mereka
- `>>>>>>> development` — akhir dari kode **milik mereka** (development)

#### 3. Putuskan: Kode Siapa yang Dipakai?

Ada tiga kemungkinan:

**Opsi A: Pakai kode kita semua**
```tsx
const nama = "Nadil";
const nim = "12345";
```

**Opsi B: Pakai kode mereka semua**
```tsx
const nama = "Anton";
const nim = "67890";
```

**Opsi C: Gabungkan keduanya**
```tsx
const nama = "Nadil";
const nim = "67890";
```

#### 4. Hapus Marker Conflict

Setelah memutuskan, hapus semua baris ini: `<<<<<<< HEAD`, `=======`, `>>>>>>> development`.

#### 5. Simpan File

#### 6. Beri Tahu Git bahwa Conflict Sudah Selesai

```bash
git add src/components/FormDaftar.tsx
git commit -m "fix: resolve merge conflict di FormDaftar.tsx"
git push origin feature/pendaftaran
```

### Tips Mengatasi Conflict:

1. **Diskusi dengan anggota terkait.** Kalau conflict dengan kode Nadil, chat Nadil. "Ni, kode ikam yang mana? Anggitku yang mana?"
2. **Biasakan diri.** Makin sering conflict, makin terbiasa.
3. **Commit sering.** Makin jarang commit, makin banyak perubahan yang bertumpuk, makin besar kemungkinan conflict.
4. **Pull sebelum mulai coding.** Ini yang PALING sering menyebabkan conflict — orang lupa pull, lalu push versi lama.

### Visual Conflict di VSCode:

VSCode punya alat bantu conflict resolution yang bagus. Kalau kalian membuka file conflict di VSCode:

1. Akan ada tombol **"Accept Current Change"** — pakai kode kita
2. **"Accept Incoming Change"** — pakai kode mereka
3. **"Accept Both Changes"** — pakai keduanya
4. **"Compare Changes"** — lihat perbandingan

Ini membuat resolusi conflict jadi lebih mudah.

---

## 1.13 Error yang Sering Muncul dan Cara Mengatasinya

### Error 1: `'git' is not recognized`

**Pesan:**
```
'git' is not recognized as an internal or external command
```

**Penyebab:** Git belum terinstall, atau PATH belum terdaftar.

**Solusi:**
1. Pastikan Git sudah diinstall
2. Restart terminal (tutup, buka lagi)
3. Restart komputer
4. Kalau masih error, install ulang Git dan pastikan pilih **"Git from the command line"**

### Error 2: `fatal: Not a git repository`

**Pesan:**
```
fatal: Not a git repository (or any of the parent directories): .git
```

**Penyebab:** Kalian menjalankan perintah Git di folder yang bukan repository Git.

**Solusi:**
```bash
cd SIMAHATI-OpRec
```
Pindah ke folder project yang benar (yang ada folder `.git`-nya).

### Error 3: `Please tell me who you are`

**Pesan:**
```
*** Please tell me who you are.

Run

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"
```

**Penyebab:** Kalian lupa set nama dan email setelah instalasi Git.

**Solusi:**
```bash
git config --global user.name "Nama Kalian"
git config --global user.email "email@github.com"
```

### Error 4: Merge Conflict (See section 1.12)

**Pesan:**
```
CONFLICT (content): Merge conflict in src/File.tsx
Automatic merge failed; fix conflicts and then commit the result.
```

**Penyebab:** Dua orang mengubah baris yang sama di file yang sama.

**Solusi:** Lihat [bab 1.12](#112-mengatasi-conflict--saat-kode-bertabrakan).

### Error 5: `failed to push some refs`

**Pesan:**
```
 ! [rejected]        feature/pendaftaran -> feature/pendaftaran (non-fast-forward)
error: failed to push some refs to 'https://github.com/...'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally.
```

**Penyebab:** GitHub punya versi yang lebih baru daripada laptop kalian. Biasanya karena kalian atau orang lain push dari komputer lain.

**Solusi:**
```bash
git pull origin feature/pendaftaran
git push origin feature/pendaftaran
```

### Error 6: `fatal: refusing to merge unrelated histories`

**Pesan:**
```
fatal: refusing to merge unrelated histories
```

**Penyebab:** Branch kalian punya sejarah yang berbeda dari development (jarang terjadi kalau workflow-nya benar).

**Solusi:**
```bash
git merge development --allow-unrelated-histories
```

### Error 7: `Authentication failed`

**Pesan:**
```
fatal: Authentication failed for 'https://github.com/...'
```

**Penyebab:** Password atau username GitHub salah.

**Solusi:**
1. Kalau pakai password biasa, GitHub sekarang mungkin minta **Personal Access Token (PAT)** sebagai ganti password
2. Buat PAT di: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
3. Centang `repo` → Generate → Copy token
4. Gunakan token itu sebagai password saat diminta Git

Atau install **GitHub CLI** dan login lewat CLI:
```bash
# Install dulu, lalu:
gh auth login
```

---

## 1.14 Cheatsheet Git — Semua Perintah dalam Satu Tabel

Ini tabel referensi cepat. Kalau lupa suatu perintah, balik ke sini.

### Setup & Konfigurasi

| Perintah | Penjelasan Sederhana |
|----------|---------------------|
| `git --version` | Cek apakah Git sudah terinstall |
| `git config --global user.name "Nama"` | Set nama kalian |
| `git config --global user.email "email"` | Set email kalian |
| `git config --list` | Lihat semua pengaturan |

### Mulai Project

| Perintah | Penjelasan Sederhana |
|----------|---------------------|
| `git init` | Ubah folder biasa jadi repository Git |
| `git clone <url>` | Download repository dari GitHub ke laptop |

### Kerja Sehari-hari

| Perintah | Penjelasan Sederhana |
|----------|---------------------|
| `git status` | Cek file mana aja yang berubah |
| `git add <nama-file>` | Siapkan file tertentu untuk di-commit |
| `git add .` | Siapkan SEMUA file yang berubah untuk di-commit |
| `git commit -m "pesan"` | Simpan perubahan (buat checkpoint) |
| `git push origin <branch>` | Upload commit ke GitHub |
| `git pull origin <branch>` | Download perubahan terbaru dari GitHub |
| `git fetch --all` | Cek apakah ada perubahan di GitHub (tanpa download) |

### Branch

| Perintah | Penjelasan Sederhana |
|----------|---------------------|
| `git branch` | Lihat daftar branch lokal (yang ada di laptop) |
| `git branch -a` | Lihat SEMUA branch (lokal + remote/GitHub) |
| `git branch -d <nama>` | Hapus branch lokal |
| `git checkout <nama>` | Pindah ke branch lain |
| `git checkout -b <nama>` | Buat branch baru dan pindah ke sana |
| `git switch <nama>` | Pindah branch (cara yang lebih modern) |
| `git switch -c <nama>` | Buat + pindah ke branch baru (cara modern) |
| `git merge <nama-branch>` | Gabung branch lain ke branch yang sedang aktif |

### Info & Debugging

| Perintah | Penjelasan Sederhana |
|----------|---------------------|
| `git log --oneline` | Lihat riwayat commit (versi ringkas) |
| `git log --oneline --graph --all` | Lihat riwayat commit dengan grafik cabang |
| `git diff` | Lihat perubahan yang BELUM di-stage |
| `git diff --staged` | Lihat perubahan yang SUDAH di-stage |

### Darurat

| Perintah | Penjelasan Sederhana |
|----------|---------------------|
| `git stash` | "Simpan dulu" perubahan sementara (kalau mau ganti branch darurat) |
| `git stash pop` | Ambil kembali perubahan yang di-stash |
| `git reset HEAD <file>` | Batalkan stage untuk file tertentu |
| `git reset --hard HEAD` | Buang SEMUA perubahan (hati-hati! ini permanen) |

### Remote (Koneksi ke GitHub)

| Perintah | Penjelasan Sederhana |
|----------|---------------------|
| `git remote -v` | Lihat alamat GitHub yang terhubung |
| `git remote add origin <url>` | Hubungkan ke GitHub |

---

# BAGIAN 2: OPENCODE DI WINDOWS VSCODE

---

## 2.1 Kenalan Dulu: Apa itu Terminal? Node.js? npm?

Sebelum kita install OpenCode, kita perlu paham beberapa istilah dasar. Tenang, akan dijelaskan dengan analogi sederhana.

### Apa itu Terminal?

Kalian selama ini berinteraksi dengan komputer lewat **GUI (Graphical User Interface)** — yaitu tampilan dengan gambar, ikon, tombol yang bisa diklik.

Terminal adalah cara **berinteraksi dengan komputer lewat teks**. Kalian mengetik perintah, komputer menjawab dengan teks.

> **Analogi:** GUI itu seperti mobil matic — tinggal gas dan rem. Terminal itu seperti mobil manual — harus tahu kopling, gigi, dll. Awalnya susah, tapi setelah terbiasa jadi lebih powerful.

### Apa itu Node.js?

JavaScript adalah bahasa pemrograman yang biasanya jalan di **browser** (Chrome, Firefox). Tapi kadang kita pengen JavaScript jalan di **komputer** (bukan di browser). Nah, Node.js adalah software yang membuat JavaScript bisa jalan di komputer.

> **Analogi:** Browser itu seperti stadion tempat pemain (JavaScript) bermain. Node.js itu seperti **lapangan latihan di luar stadion** — pemain yang sama bisa latihan di mana aja.

### Apa itu npm?

**npm = Node Package Manager**

Saat kalian bikin project, kalian sering butuh "bantuan" dari kode orang lain (library/framework). npm adalah **toko aplikasi** tempat kalian bisa download bantuan-bantuan itu dengan mudah.

> **Analogi:** Kalian mau bikin lemari. Daripada bikin paku dari besi sendiri, kalian tinggal beli paku di toko bangunan (npm). Tinggal ketik `npm install paku` — beres!

### Apa itu OpenCode?

OpenCode adalah **asisten AI coding** yang bisa diajak ngobrol langsung dari terminal VSCode. Kalian bisa:

- "Bikin fungsi login dong" → OpenCode akan nulis kodenya
- "Ini error kenapa?" → OpenCode akan baca error dan kasih solusi
- "Refactor file ini biar lebih rapi" → OpenCode akan nulis ulang kodenya

---

## 2.2 Prasyarat — Yang Harus Diinstal Sebelumnya

Untuk pakai OpenCode, kalian perlu 4 hal:

1. **Node.js** — biar OpenCode bisa jalan (OpenCode dibuat dengan JavaScript)
2. **Git** — sudah diinstall di bagian 1 tutorial ini
3. **VSCode** — tempat kita coding
4. **OpenCode** — yang akan kita install sebentar lagi

---

## 2.3 Instalasi Node.js

### Langkah 1: Download Node.js

1. Buka browser, ketik: `https://nodejs.org`
2. Akan ada dua pilihan:
   - **LTS** (kiri) — pilih ini! LTS = Long Term Support, lebih stabil
   - **Current** (kanan) — versi terbaru, bisa ada bug
3. Klik tombol **LTS** untuk download

### Langkah 2: Install Node.js

1. Jalankan file installer yang sudah di-download
2. Klik **"Next"** terus
3. Centang **"I accept the terms"** → Next
4. Biarkan folder default → Next
5. **PENTING:** Pastikan centang **"Automatically install the necessary tools"** (centang ini biar tools pendukung ikut terinstall)
6. Klik **"Next"** → **"Install"**
7. Kalau muncul jendela User Account Control, klik **"Yes"**
8. Kalau setelah instalasi muncul jendela PowerShell/tools tambahan, biarkan jalan, jangan ditutup

### Langkah 3: Verifikasi Instalasi

Buka **Command Prompt** atau **PowerShell**, lalu ketik:

```bash
node --version
```

**Output yang diharapkan:**
```
v18.20.3
```
(atau versi lain, yang penting mulai dengan `v`)

```bash
npm --version
```

**Output yang diharapkan:**
```
10.7.0
```
(atau versi lain)

### Kalau Error:

Kalau muncul `'node' is not recognized`:
1. Restart terminal (tutup, buka lagi) 
2. Restart komputer
3. Atau tambahkan PATH manual: cari "Environment Variables" di Windows Settings, tambahkan `C:\Program Files\nodejs\` ke PATH

---

## 2.4 Apa itu Visual Studio Code (VSCode)?

VSCode adalah **aplikasi untuk nulis kode** (code editor). Bayangkan seperti Microsoft Word, tapi khusus untuk kode program. VSCode ringan, gratis, dan punya banyak fitur.

**Kalau belum punya VSCode:**

1. Buka `https://code.visualstudio.com/`
2. Klik tombol **"Download for Windows"**
3. Jalankan installer
4. **PENTING:** Saat instalasi, ada halaman "Select Additional Tasks". **Centang SEMUA** kotak centang, terutama:
   - **"Add 'Open with Code' action to Windows Explorer file context menu"**
   - **"Add 'Open with Code' action to Windows Explorer directory context menu"**
   - **"Register Code as an editor for supported file types"**
   - **"Add to PATH"** (ini yang bikin kalian bisa buka VSCode dari terminal)
5. Klik **"Install"**

**Kalau sudah punya VSCode (pastikan versi terbaru):**

Buka VSCode, tekan `Ctrl+Shift+P`, ketik `About`, lihat versinya.

---

## 2.5 Instalasi OpenCode

Ada dua cara untuk install OpenCode:

### Cara 1: Via npm (Rekomendasi — Paling Mudah)

Buka **Command Prompt** atau **PowerShell** sebagai **Administrator**:

1. Klik kanan **Start**
2. Pilih **"Windows PowerShell (Admin)"** atau **"Terminal (Admin)"**
3. Klik **"Yes"** kalau ada peringatan

Lalu ketik:

```bash
npm install -g @opencode/cli
```

**Penjelasan:**
- `npm install` — download dan install
- `-g` — **g**lobal = install untuk seluruh komputer (bukan cuma untuk satu folder)
- `@opencode/cli` — nama paketnya (OpenCode CLI)

Proses instalasi akan memakan waktu beberapa detik sampai menit (tergantung kecepatan internet).

**Output yang diharapkan (kurang lebih):**
```
added 450 packages in 45s
```

Jumlahnya bisa berbeda, yang penting tidak ada pesan error merah.

### Cara 2: Via Installer Windows

Kalau cara npm error atau susah, bisa download installer:

1. Buka `https://opencode.ai/download`
2. Klik tombol download untuk Windows
3. Jalankan file `.exe`
4. Ikuti petunjuk di layar

### Verifikasi Instalasi

Setelah instalasi selesai, tutup terminal lalu buka terminal **baru** (biar path-nya ke-refresh). Ketik:

```bash
opencode --version
```

**Output yang diharapkan:**
```
x.y.z
```
(Angka versi, misalnya `0.1.0` atau `1.0.0`)

**Kalau error** `'opencode' is not recognized`:

1. Restart terminal
2. Restart komputer
3. Kalau masih error, coba instal ulang dengan admin rights

---

## 2.6 Menggunakan OpenCode di Terminal VSCode

### Cara Membuka Terminal di VSCode:

1. Buka VSCode
2. Klik menu **Terminal** (di toolbar atas)
3. Pilih **"New Terminal"**
4. Atau tekan shortcut: **`` Ctrl + ` ``** (tombol Ctrl + backtick)

Akan muncul panel terminal di bagian bawah VSCode.

### Navigasi ke Folder Project:

Di terminal VSCode, pindah ke folder project:

```bash
cd C:\Users\NamaKalian\Documents\SIMAHATI-OpRec
```

Atau, cara yang lebih mudah:
1. Di VSCode, klik **File** → **Open Folder**
2. Pilih folder `SIMAHATI-OpRec`
3. Terminal akan otomatis terbuka di folder project

### Jalankan OpenCode:

```bash
opencode
```

Setelah itu, kalian akan melihat OpenCode mulai loading dan siap digunakan. Tampilannya akan seperti chat/obrolan. Kalian tinggal mengetik pertanyaan atau perintah.

### Mengakhiri Sesi OpenCode:

Tekan **`Ctrl + C`** atau ketik:

```bash
/exit
```

### Integrasi VSCode yang Lebih Nyaman:

**Opsi 1: Shortcut Keyboard**

Ini biar kalian bisa langsung buka OpenCode dari keyboard:

1. Tekan `Ctrl + Shift + P` di VSCode
2. Ketik: `Open Keyboard Shortcuts (JSON)`
3. Tambahkan kode berikut:

```json
{
  "key": "ctrl+alt+o",
  "command": "workbench.action.terminal.sendSequence",
  "args": { "text": "opencode\n" }
}
```

4. Simpan file
5. Sekarang tinggal tekan `Ctrl + Alt + O` untuk langsung menjalankan OpenCode

**Opsi 2: Task Runner**

1. Di folder project, buat folder baru bernama `.vscode`
2. Di dalamnya, buat file `tasks.json`
3. Isi dengan:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Buka OpenCode",
      "type": "shell",
      "command": "opencode",
      "options": {
        "cwd": "${workspaceFolder}"
      },
      "problemMatcher": []
    }
  ]
}
```

4. Simpan
5. Sekarang bisa buka lewat: **Terminal** → **Run Task** → **Buka OpenCode**

---

## 2.7 Perintah Dasar OpenCode

### Perintah CLI (Dijalankan dari Terminal)

| Perintah | Fungsi |
|----------|--------|
| `opencode` | Mulai sesi interaktif dengan OpenCode |
| `opencode --version` | Cek versi OpenCode yang terinstall |
| `opencode --help` | Lihat daftar perintah lengkap |

### Perintah dalam Sesi OpenCode (Diketik Saat Chat dengan OpenCode)

| Perintah | Fungsi |
|----------|--------|
| `/help` | Lihat bantuan dalam sesi |
| `/clear` | Bersihkan layar chat |
| `/exit` | Keluar dari sesi |

### Contoh Penggunaan:

Setelah kalian jalankan `opencode` dan masuk ke sesi chat, kalian bisa bertanya seperti ini:

```
Kamu: Tolong baca file src/App.tsx dan jelaskan isinya

OpenCode: *membaca file dan menjelaskan*

Kamu: Tambahkan tombol login di file itu

OpenCode: *menulis kode dan menambahkan ke file*
```

---

## 2.8 Tips Menggunakan OpenCode untuk Pemula

1. **Gunakan bahasa Indonesia.** OpenCode bisa bahasa Indonesia, jadi jangan takut ngomong Inggris.

2. **Jelaskan konteksnya.** Daripada bilang "Bikin form", lebih baik "Bikin form pendaftaran dengan input nama, NIM, dan nomor HP. Letakkan di file src/components/FormDaftar.tsx".

3. **Minta OpenCode baca file dulu.** Sebelum nyuruh OpenCode ngubah sesuatu, minta dia baca file-nya dulu: "Baca file src/App.tsx dulu".

4. **Cek hasilnya.** Setelah OpenCode ngubah file, selalu cek apakah kodenya masuk akal.

5. **Jangan takut error.** Kalau OpenCode ngasih kode yang error, bilang aja "ini error, tolong diperbaiki".

6. **Gunakan untuk belajar.** Kalau OpenCode nulis kode, minta dia jelaskan: "Jelaskan baris per baris kode yang kamu buat".

7. **Commit sebelum minta bantuan OpenCode.** Biar kalau OpenCode ngubah sesuatu yang kacau, kalian bisa `git checkout .` untuk balik ke versi sebelumnya.

---

> **Catatan:** Dokumentasi ini adalah panduan untuk pemula absolut. Seiring waktu, kalian akan semakin terbiasa dengan Git, GitHub, dan OpenCode. Jangan ragu untuk bereksperimen dan belajar dari kesalahan. Selamat coding, tim INGFO LOKER! 🚀

---

↩️ **[Kembali ke: README.md](README.md)** — Gambaran besar proyek ➡️ **[Lanjut ke: CONTRIBUTING.md](CONTRIBUTING.md)** — Aturan main tim
