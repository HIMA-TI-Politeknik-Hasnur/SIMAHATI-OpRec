<!-- generated-by: gsd-doc-writer -->
# Dokumentasi API — SIMAHATI OpRec

> **SIMAHATI OpRec** — Modul Open Recruitment dari Sistem Informasi Manajemen Himpunan Mahasiswa Teknik Informatika.
>
> **Target Pembaca:** Mahasiswa semester 2–4 yang baru pertama kali belajar programming.
> **Tenang aja** — semua istilah teknis akan dijelaskan pakai analogi sederhana. Santai aja bacanya 👍

---

## 📋 Daftar Isi

- [Apa itu API? (Baca ini dulu!)](#apa-itu-api-baca-ini-dulu)
- [Base URL — Alamat Rumahnya API](#base-url-alamat-rumahnya-api)
- [Autentikasi — Proses Kenalan Sama Sistem (PIC: Reyhan)](#autentikasi-proses-kenalan-sama-sistem-pic-reyhan)
  - [POST /api/register — Daftar Akun Baru](#post-apiregister-daftar-akun-baru)
  - [POST /api/login — Masuk ke Akun](#post-apilogin-masuk-ke-akun)
  - [POST /api/logout — Keluar / Selesai Pakai](#post-apilogout-keluar-selesai-pakai)
  - [GET /api/user — Lihat Data Diri Sendiri](#get-apiuser-lihat-data-diri-sendiri)
- [Roles & Permissions — Siapa Bisa Ngapain Aja (PIC: Reyhan)](#roles-permissions-siapa-bisa-ngapain-aja-pic-reyhan)
  - [GET /api/roles — Lihat Daftar Role](#get-apiroles-lihat-daftar-role)
  - [POST /api/roles — Buat Role Baru](#post-apiroles-buat-role-baru)
  - [GET /api/roles/{id} — Detail Role Tertentu](#get-apirolesid-detail-role-tertentu)
  - [PUT /api/roles/{id} — Update Role](#put-apirolesid-update-role)
  - [DELETE /api/roles/{id} — Hapus Role](#delete-apirolesid-hapus-role)
  - [GET /api/permissions — Lihat Daftar Permission](#get-apipermissions-lihat-daftar-permission)
  - [POST /api/roles/{role}/permissions — Kasih Permission ke Role](#post-apirolesrolepermissions-kasih-permission-ke-role)
  - [POST /api/users/{user}/roles — Kasih Role ke User](#post-apiusersuserroles-kasih-role-ke-user)
- [Peserta — Data Calon Anggota HMTI (PIC: Nadil)](#peserta-data-calon-anggota-hmti-pic-nadil)
- [Divisi — Wadah Minat dan Bakat (PIC: Anton)](#divisi-wadah-minat-dan-bakat-pic-anton)
- [Interview — Proses Ngobrol Langsung (PIC: Anton)](#interview-proses-ngobrol-langsung-pic-anton)
- [Pengumuman — Kabar Buat Semua (PIC: Rizky)](#pengumuman-kabar-buat-semua-pic-rizky)
- [Dashboard — 'Si Intisari' (PIC: Reyhan)](#dashboard-si-intisari-pic-reyhan)
  - [GET /api/dashboard/stats — Statistik Utama](#get-apidashboardstats-statistik-utama)
- [Kode Error — Bahasa Sindiran Server](#kode-error-bahasa-sindiran-server)
- [Rate Limiting — Jangan Nge-Spam Ya](#rate-limiting-jangan-nge-spam-ya)
- [Catatan Implementasi — Buat yang Ngoding Backend](#catatan-implementasi-buat-yang-ngoding-backend)
- [Tips Tambahan Buat Pemula](#tips-tambahan-buat-pemula)
- [Ringkasan Cepat — Semua Endpoint dalam Satu Tabel](#ringkasan-cepat-semua-endpoint-dalam-satu-tabel)

---

## Apa itu API? (Baca ini dulu!)

Sebelum kita masuk ke endpoint, HTTP method, token, JSON, dan berbagai istilah teknis lainnya, kita kenalan dulu yuk sama konsep paling dasarnya: **Apa sih API itu?**

### Analogi Restoran 🍽️

Bayangin kamu lagi di restoran. Kamu duduk manis di meja, pegang menu, milih mau pesan apa.

Siapa yang kamu panggil? **Pelayan**, kan?

Nah dalam dunia programming:

| Di Restoran | Di Aplikasi Web |
|---|---|
| Kamu (pelanggan) | **Frontend** (tampilan web yang kamu lihat) |
| Pelayan | **API** (jembatan penghubung) |
| Dapur | **Backend** (server + database) |
| Makanan yang diantar | **Data** (info yang kamu minta) |

**API** itu singkatan dari *Application Programming Interface*. Tapi lupakan dulu istilah rumitnya. Cukup inget aja: **API adalah pelayan**.

Gimana cara kerjanya?

1. Kamu (Frontend) bilang ke pelayan (API): *"Saya mau lihat menu minumannya"*
2. Pelayan (API) sampaikan ke dapur (Backend): *"Tolong data minuman"*
3. Dapur (Backend) ambil data dari buku resep (Database)
4. Dapur (Backend) kasih ke pelayan (API)
5. Pelayan (API) antar ke meja kamu (Frontend)

Tamat! Simple banget kan? 😄

### Data yang Dikirim — JSON

Kalau di restoran, makanan diantar pakai piring. Kalau di API, data dikirim dalam bentuk **JSON** (dibaca: *jay-son*). 

**JSON** itu singkatan dari *JavaScript Object Notation*. Tapi inget aja: JSON itu cara nulis data yang rapi, mirip kayak gini:

```json
{
  "nama": "Citra Dewi",
  "nim": "2410010101",
  "umur": 19,
  "aktif": true
}
```

Bentuknya:
- `{` `}` — kurung kurawal sebagai pembungkus, kayak wadah makanan
- `"nama"` — nama field / label (kiri)
- `"Citra Dewi"` — isi / value (kanan)
- `:` — pemisah antara label dan isi
- `,` — pemisah antar data

Ini mirip kayak KTP: ada label "Nama" dan isinya "Citra Dewi". Di JSON juga gitu. Kalau labelnya `nama`, isinya ya nama orang. Gampang kan?

### HTTP Methods — Kata Kerja yang Kamu Ucapkan

Balik ke analogi restoran. Kamu minta sesuatu ke pelayan dengan cara yang berbeda-beda, kan?

| Kata Kerja | Maksud | Di API Bilangnya |
|---|---|---|
| "Mas, lihat menu dong" | Minta lihat data | **GET** |
| "Mas, saya mau pesan nasi goreng" | Kirim data baru | **POST** |
| "Mas, pesanan saya diganti jadi mie ayam" | Ubah data yang ada | **PUT** |
| "Mas, pesanan saya batalkan aja" | Hapus data | **DELETE** |

Jadi inget aja:
- **GET** → minta lihat data
- **POST** → kirim / buat data baru
- **PUT** → ubah data yang sudah ada
- **DELETE** → hapus data

### Status Code — Kode yang Bilang "Gimana Hasilnya?"

Setiap kali kamu pesan, pelayan pasti kasih respons, kan? "Iya mas bentar" atau "Maaf mas itu sudah habis".

Nah server juga gitu. Setiap kali API dipanggil, server bakal balikin **status code** — angka 3 digit yang kasih tahu hasilnya:

| Kode | Artinya | Analogi |
|---|---|---|
| **200** OK | Sukses!👍 | "Ini mas pesanannya" |
| **201** Created | Berhasil dibuat! | "Pesanan udah dicatat, nomor antrian 5" |
| **401** Unauthorized | Belum login | "Maaf mas, saya harus lihat KTP dulu" |
| **403** Forbidden | Ga punya akses | "Maaf mas, ini khusus anggota VIP" |
| **404** Not Found | Ga ketemu | "Maaf mas, menu itu nggak ada" |
| **422** Unprocessable | Data tidak valid | "Maaf mas, nomor mejanya salah tulis" |
| **429** Too Many | Kebanyakan request | "Mas, sabar dong, jangan teriak-teriak" |
| **500** Server Error | Error di server | "Maap mas, dapur lagi bermasalah" |

Gampang diinget, kan? 😄

### Token — Tiket Masuk

Di aplikasi kita, setelah kamu login, server bakal kasih kamu **token**. Token itu string panjang acak kayak gini:

```
2|xyz789abc012def345ghi678jkl901...
```

**Apa itu token?** Bayangin kamu masuk **bioskop**. Kamu beli tiket, dapat selembar kertas. Tiket itu yang nge-buktiin kamu udah bayar. Selama film, kamu bisa keluar-masuk selama pegang tiket.

Token juga gitu. Kamu login (beli tiket), dapat token. Selama kamu punya token, kamu bisa panggil API yang butuh login. Token dikirim di **header** (baca: bagian depan) setiap request.

Nanti kita praktik langsung, kok. Gas aja! 🚀

---

## Base URL — Alamat Rumahnya API

Base URL itu alamat utama API kita. Kayak alamat restoran — kalau kamu tahu alamatnya, baru kamu bisa ke sana.

**Base URL development (komputer sendiri):**

```
http://localhost:8000/api
```

> **Catatan:** `localhost` artinya komputer kamu sendiri. `8000` itu nomor port (kayak nomor meja di restoran). `/api` itu jalur masuk ke bagian API.

**Contoh endpoint lengkap:**

```
GET http://localhost:8000/api/user
POST http://localhost:8000/api/login
GET http://localhost:8000/api/peserta
```

Nanti kalau aplikasi sudah _online_ (disebut **production**), `localhost:8000` bakal diganti alamat domain asli. Tapi untuk sekarang, cukup pakai localhost.

---

## Autentikasi — Proses Kenalan Sama Sistem *(PIC: Reyhan)*

### Penjelasan Dulu ya 😊

**Autentikasi** itu proses verifikasi: **"Kamu siapa?"**

Bayangin kamu mau masuk **gedung kampus** malem-malem. Satpam di pintu masuk bakal nanyain KTP atau kartu mahasiswa. Kamu kasih, satpam liat, cocok, kamu boleh masuk. Nah:

| Di Kampus | Di Aplikasi |
|---|---|
| Kamu kasih KTP | Kamu kirim **email + password** |
| Satpam cocokin data | Server cocokin data di database |
| Satpam kasih stempel | Server kasih **token** |
| Setelah punya stempel, kamu leluasa | Setelah punya token, kamu bisa akses fitur |

Di proyek kita, autentikasi pake **Laravel Sanctum**. Anggap aja Sanctum itu mesin pembuat tiket otomatis. Kamu login → server bikin token baru → token itu kamu simpan → kamu pake buat akses API lainnya.

### Cara Kirim Token

Setiap kali kamu manggil endpoint yang butuh login, kamu harus kirim token di **Header** (bagian depan request):

```
Authorization: Bearer {masukkan-token-kamu-di-sini}
Accept: application/json
```

> Tips: Di kode frontend (React), nanti kalian bakal pake `axios` atau `fetch`. Tinggal tambahin header `Authorization: Bearer {token}` di setiap request. Gampang!

### 5 Role (Peran) di Aplikasi Ini

| Role | Artinya | Bisa Ngapain Aja |
|---|---|---|
| `super_admin` | Bos besar | Bisa apa aja, full akses |
| `admin_oprec` | Admin OpRec | Ngatur seluruh proses open recruitment |
| `panitia` | Panitia | Bantu administrasi, liat data peserta |
| `interviewer` | Pewawancara | Interview dan kasih nilai |
| `peserta` | Calon anggota | Daftar OpRec, upload dokumen |

---

### `POST /api/register` — Daftar Akun Baru

📝 **Deskripsi:** Mendaftarkan akun baru ke sistem.

**Penjelasan Detail:**

Bayangin kamu mau daftar jadi **anggota perpustakaan**. Kamu dateng ke meja pendaftaran, ngisi formulir (nama, alamat, nomor telepon), terus petugas bikin kartu anggota buat kamu. Nah, di aplikasi kita prosesnya persis sama.

Yang terjadi di balik layar:
1. Kamu (frontend) ngirim data ke API lewat `POST /api/register`
2. Server nerima data kamu dan langsung ngecek: "apa semua field udah diisi?", "apa emailnya udah dipake orang lain?", "apa passwordnya cukup panjang?"
3. Kalau semua aman, server nyimpen data kamu ke database
4. Password kamu diubah jadi **kode rahasia** (disebut *hash*) pake algoritma bcrypt — jadi admin pun ga bisa liat password asli kamu. Kenapa? Biar kalo database bocor, password kamu tetep aman 🔒
5. Terus server bikin **token** (tiket masuk) langsung, biar kamu ga perlu login lagi abis daftar
6. Server ngirim balik data user + token

Endpoint ini **wajib dipanggil pertama kali** kalau kamu belum punya akun. Nanti setelah daftar, kamu bisa langsung pake aplikasi tanpa perlu login ulang.

🔓 Siapa yang bisa akses: **Semua orang** (tanpa token) — karena ya wajar, kamu kan belum punya akun 😄

📦 **Request Body (data yang harus dikirim):**

```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "password": "rahasia123",
  "password_confirmation": "rahasia123"
}
```

| Field | Wajib? | Penjelasan |
|---|---|---|
| `name` | ✅ Wajib | Nama lengkap kamu |
| `email` | ✅ Wajib | Email aktif (jangan palsu ya) |
| `password` | ✅ Wajib | Password minimal 8 karakter |
| `password_confirmation` | ✅ Wajib | Ketik ulang password (harus sama) |

**Penjelasan Setiap Field:**

**`name`** — Nama lengkap kamu. Bisa pake spasi, misal "Budi Santoso". Field ini wajib banget karena sistem butuh tau panggilan kamu. Kalau ga dikirim, server bakal nolak dengan error 422. Panjang maksimal biasanya 255 karakter (udah lebih dari cukup). **Tips:** Minta user isi nama asli, bukan nama panggilan aja, biar formal di dokumen.

**`email`** — Alamat email aktif. Ini penting karena:
- Jadi **identitas unik** kamu di sistem (ga boleh ada dua user pake email yang sama)
- Kalau nanti ada fitur lupa password, email ini dipake buat kirim tautan reset
- Harus format email bener, misal `budi@example.com` — kalau cuma "budigmail" tanpa `@`, server bakal nolak
- Email ini nantinya dipake buat login juga

**`password`** — Kata sandi minimal 8 karakter. Server bakal ngecek:
- Minimal 8 karakter (kalau kurang ditolak)
- Best practice: pake kombinasi huruf besar, huruf kecil, angka, dan simbol. Tapi di proyek kita aturannya masih minimal 8 karakter aja dulu.
- Password ini **tidak pernah disimpan sebagai teks asli** di database. Diubah jadi kode acak (hash) pake bcrypt. Jadi meskipun database diretas, password kamu ga bakal ketahuan.

**`password_confirmation`** — Field ini buat konfirmasi. Kamu ngetik ulang password yang sama. Server bakal ngecek: `password` sama `password_confirmation` harus cocok. Kenapa perlu? Biar kamu ga salah ketik pas bikin password (misal niatnya "rahasia123" tapi kecepetan jadi "rahasia12"). Kalau beda, server nolak dengan error 422.

✅ **Response Sukses (201 — Berhasil Dibuat):**

```json
{
  "success": true,
  "message": "Registrasi berhasil.",
  "data": {
    "user": {
      "id": 1,
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "email_verified_at": null,
      "created_at": "2026-07-16T10:00:00.000000Z",
      "updated_at": "2026-07-16T10:00:00.000000Z"
    },
    "token": "1|abc123def456..."
  }
}
```

**Penjelasan Setiap Field di Response:**

**`success: true`** — Tanda kalo request berhasil. Kalau `false` berarti ada error. Di frontend, kamu bisa cek `response.success` dulu sebelum pake data lainnya.

**`message: "Registrasi berhasil."`** — Pesan singkat dari server. Berguna buat ditampilin ke user sebagai notifikasi "Pendaftaran berhasil!" atau buat debugging.

**`data.user.id: 1`** — Nomor unik user di database. Ini otomatis dibuat sama database, kita ga bisa atur manual. Nomor 1 artinya user pertama yang daftar di aplikasi ini. Nanti user kedua dapet nomor 2, dan seterusnya.

**`data.user.name: "Budi Santoso"`** — Nama yang tadi kamu kirim pas register. Server balikin nama ini biar frontend bisa langsung nampilin "Halo, Budi!" tanpa perlu tanya ulang.

**`data.user.email: "budi@example.com"`** — Email yang tadi kamu kirim. Server balikin email buat konfirmasi ke user: "Ini lho email yang kamu pake daftar".

**`data.user.email_verified_at: null`** — Kapan email ini diverifikasi (dicek kebenarannya). `null` artinya belum diverifikasi. Kalau fitur verifikasi email diaktifkan, nanti field ini bakal terisi tanggal pas user ngeklik tautan verifikasi di email. Kalau nilainya udah ada tanggal, artinya email udah diverifikasi.

**`data.user.created_at: "2026-07-16T10:00:00.000000Z"`** — Tanggal dan jam akun ini dibuat. Formatnya ISO 8601 (standar internasional buat nulis waktu). Cara bacanya: `2026-07-16` = 16 Juli 2026. `T` = pemisah tanggal dan jam. `10:00:00` = jam 10 pagi. `000000Z` = microsecond + Z menandakan waktu UTC (waktu standar internasional).

**`data.user.updated_at: "2026-07-16T10:00:00.000000Z"`** — Kapan terakhir data ini diubah. Pas baru dibuat, nilainya sama kayak `created_at`. Nanti kalau data user diupdate (misal ganti nama), field ini bakal berubah.

**`data.token: "1|abc123def456..."`** — Token yang bakal kamu pake buat akses endpoint lain. Token ini penting banget! Simpan baik-baik. Formatnya: `{id_token}|{string_acak}`. Angka sebelum `|` itu ID token di database, sisanya string random. String random ini panjang banget dan susah ditebak.

> 📌 **Catatan Penting:** Ada field `token` di response! Simpan token ini baik-baik, kamu bakal pake terus. Kalau ilang, kamu harus login ulang.

❌ **Response Error (422 — Data Tidak Valid):**

```json
{
  "message": "Validasi gagal.",
  "errors": {
    "email": ["Email sudah terdaftar."],
    "password": ["Kata sandi minimal 8 karakter."]
  }
}
```

**Kapan Error Ini Muncul?**

Error 422 artinya "data yang kamu kirim ga lolos pemeriksaan". Server ngecek data kamu dan nemu masalah. Beberapa skenario:

1. **Email udah dipake** — Ada yang udah daftar pake email `budi@example.com`. Kamu harus pake email lain karena email harus unik.
2. **Password kepoendek** — Password kamu cuma 5 karakter, padahal minimal 8.
3. **Konfirmasi password beda** — `password` diisi "rahasia123" tapi `password_confirmation` diisi "rahasia124" — server bakal nolak karena dua field ini harus sama persis.
4. **Format email salah** — Kamu ngetik "budigmail" (lupa `@`) — server nolak karena bukan format email yang valid.
5. **Field wajib kosong** — `name` atau `email` ga dikirim sama sekali — server butuh data itu buat bikin akun.

**Cara Ngatasin:**
- Error per field ada di dalam object `errors`. Misal `errors.email` berisi array pesan error buat field email.
- Di frontend, kamu bisa tampilin error ini tepat di bawah input field yang bermasalah.
- Kasih tahu user dengan bahasa yang jelas: "Email udah dipake, coba pake email lain" atau "Password minimal 8 karakter ya".

> Contoh error: email kamu udah dipake orang lain, atau password cuma 3 huruf (kurang dari 8).

---

#### 🧠 Apa yang Terjadi di Database? — `POST /api/register`

Waktu kamu panggil `POST /api/register`, kira-kira yang terjadi di database:

1. **Tabel `users`** — Data kamu disimpan di sini. Kolom-kolom yang keisi:
   - `id` → otomatis (1, 2, 3, ...) — database yang ngatur, kita ga usah isi
   - `name` → "Budi Santoso"
   - `email` → "budi@example.com"
   - `password` → isinya **bukan** "rahasia123", tapi hash bcrypt kayak `$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi` (ini kode acak panjang yang dihasilkan dari password asli)
   - `created_at` dan `updated_at` → diisi otomatis sama Laravel pake waktu sekarang

2. **Tabel `personal_access_tokens`** — Token kamu disimpan di sini:
   - `id` → 1
   - `tokenable_type` → "App\Models\User" (ngasih tahu ini token punya model User, bukan model lain)
   - `tokenable_id` → 1 (ID user kamu — nyambung ke tabel users)
   - `name` → "auth_token" (nama token, bisa kita kasi nama apa aja)
   - `token` → hash dari token (token asli ga disimpan, cuma hash-nya)
   - `abilities` → `["*"]` (bisa akses semua endpoint — tanda bintang artinya "semua")

**Query SQL (kira-kira — ini yang terjadi di belakang layar Laravel):**
```sql
-- Simpan data user
INSERT INTO users (name, email, password, created_at, updated_at) 
VALUES ('Budi Santoso', 'budi@example.com', '$2y$10$...hash...', NOW(), NOW());

-- Simpan token
INSERT INTO personal_access_tokens (tokenable_type, tokenable_id, name, token, abilities, created_at, updated_at)
VALUES ('App\\Models\\User', 1, 'auth_token', '...hashed_token...', '["*"]', NOW(), NOW());
```

---

#### 💻 Contoh Penggunaan di Frontend — `POST /api/register`

**Pakai Fetch (built-in browser — ga perlu install apa-apa):**
```javascript
// Data yang mau dikirim ke server
const userData = {
  name: "Budi Santoso",
  email: "budi@example.com",
  password: "rahasia123",
  password_confirmation: "rahasia123"
};

// Panggil API register
fetch("http://localhost:8000/api/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify(userData)  // Ubah object JS jadi JSON string
})
  .then(response => response.json())  // Ubah response jadi object JS
  .then(data => {
    if (data.success) {
      // Simpan token di localStorage biar ga hilang pas direfresh
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      
      console.log("Daftar berhasil!", data.data.user.name);
      // Redirect ke halaman dashboard
      window.location.href = "/dashboard";
    } else {
      console.error("Gagal:", data.message);
    }
  })
  .catch(error => {
    console.error("Error jaringan:", error);
  });
```

**Pakai Axios (library populer — perlu install `npm install axios`):**
```javascript
import axios from 'axios';

async function registerUser(userData) {
  try {
    const response = await axios.post('http://localhost:8000/api/register', userData, {
      headers: { 'Accept': 'application/json' }
    });
    
    const data = response.data;
    // Simpan token dan user data
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    
    // Redirect
    window.location.href = '/dashboard';
    return data;
    
  } catch (error) {
    if (error.response) {
      // Error 422 — tampilkan pesan error per field
      const errors = error.response.data.errors;
      Object.keys(errors).forEach(field => {
        console.log(`Error di ${field}:`, errors[field][0]);
        // Di React, kamu bisa set state error per field
        // setFieldError(field, errors[field][0]);
      });
    }
    throw error;
  }
}

// Panggil fungsi:
// registerUser({ name: "Budi", email: "budi@example.com", password: "rahasia123", password_confirmation: "rahasia123" });
```

---

#### 💡 Tips & Trik — `POST /api/register`

1. **Simpan token langsung setelah register.** Setelah dapet response, langsung simpan token ke `localStorage` atau state management (Redux, Zustand, dll). Jangan suruh user login lagi abis daftar — itu pengalaman yang jelek. Langsung arahkan ke dashboard.

2. **Validasi dulu di frontend.** Sebelum kirim data ke server, cek dulu dari sisi frontend: apakah email formatnya bener? Apakah password minimal 8 karakter? Apakah konfirmasi password cocok? Ini ngurangin kemungkinan dapet error 422. Tapi inget: **validasi frontend cuma bantu**, validasi backend tetep jalan. Jangan pernah ngandelin validasi frontend doang buat keamanan!

3. **Jangan pernah log password atau kirim password lewat URL.** Password cuma boleh dikirim di request body. Jangan pernah naro password di query parameter kayak `/api/register?password=rahasia123` — itu ga aman karena URL bisa tercatat di history browser, server log, dan lain-lain.

4. **Tangani error 422 dengan baik.** Di frontend, tampilkan pesan error dari server di samping field yang bermasalah. Misal error "Email sudah terdaftar" muncul di samping input email. Jangan cuma nampilin alert "Error" doang — kasih tahu user apa yang salah dan gimana cara benarinya.

5. **Token diawali dengan angka + pipe (`1|...`).** Kamu mungkin lihat tokennya kayak `1|abc123...`. Angka sebelum `|` itu ID token di database. Waktu kirim ke header, kirim **seluruh string** termasuk angka dan `|` nya. Jangan dipotong!

6. **Cek response code.** Kalau sukses response code-nya 201 (Created), bukan 200 (OK). Bedanya: 201 spesifik buat "berhasil buat data baru". Di frontend, handle dua-duanya aja biar aman.

---

### `POST /api/login` — Masuk ke Akun

📝 **Deskripsi:** Login ke akun yang udah didaftarin.

**Penjelasan Detail:**

Udah punya akun? Sekarang kamu mau masuk. Bayangin kayak kamu punya **kartu perpustakaan**. Kamu dateng, scan kartunya, petugas ngecek di komputer, "Oh iya ini kartunya Budi, masih aktif", trus kamu boleh masuk.

Yang terjadi di balik layar:
1. Kamu kirim `email` + `password` ke server lewat `POST /api/login`
2. Server nyari user dengan email itu di database
3. Kalau ketemu, server ngecek: "apa password yang dikirim cocok sama hash yang disimpan?"
4. Kalau cocok, server bikin **token baru** dan kasih ke kamu
5. Kalau ga cocok, server balik error 401

**Penting banget: Bedanya register vs login:**
- **Register** = bikin akun baru + dapet token langsung
- **Login** = pake akun yang udah ada + dapet token baru

Setiap kali login, server bikin **token baru**. Token lama dari login sebelumnya **tetep valid** (kecuali kamu logout atau admin hapus token). Jadi kamu bisa login dari banyak perangkat sekaligus (HP, laptop, komputer kampus) dan semua tetep jalan.

🔓 Siapa yang bisa akses: **Semua orang** (tanpa token) — karena ya, kamu kan mau login, berarti belum punya token 😄

📦 **Request Body:**

```json
{
  "email": "budi@example.com",
  "password": "rahasia123"
}
```

| Field | Wajib? | Penjelasan |
|---|---|---|
| `email` | ✅ Wajib | Email yang tadi dipake daftar |
| `password` | ✅ Wajib | Password yang tadi dipake daftar |

**Penjelasan Setiap Field:**

**`email`** — Email yang kamu pake pas register dulu. Harus sama persis, termasuk huruf besar/kecil. Mending kirim dalam format lowercase semua biar aman (misal "Budi@Example.com" jadi "budi@example.com"). Kenapa? Karena pencarian di database biasanya case-insensitive, tapi lebih baik konsisten aja. Kalau email ga ketemu di database, server balik error 401.

**`password`** — Password yang kamu pake pas register. Server bakal ngecek: hash dari password yang dikirim cocok ga dengan hash yang tersimpan di database. Inget: password asli kamu ga disimpan — yang disimpan hash-nya. Jadi server ga bisa bilang "password kamu salah, yang bener adalah 'rahasia123'". Server cuma bisa bilang "cocok" atau "tidak cocok". Kalau salah, server balik error 401.

> **Catatan Keamanan:** Kalau kamu lupa password, ga ada cara buat liat password asli dari database. Makanya nanti butuh fitur "Lupa Password" yang kirim link reset ke email. Jangan pernah minta admin buat ngasih tau password kamu —因为他们 juga ga tau!

✅ **Response Sukses (200 — OK):**

```json
{
  "success": true,
  "message": "Login berhasil.",
  "data": {
    "user": {
      "id": 1,
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "roles": ["panitia"]
    },
    "token": "2|xyz789abc012..."
  }
}
```

**Penjelasan Setiap Field di Response:**

**`success: true`** — Tanda login berhasil. Kalau `false`, ada yang salah.

**`message: "Login berhasil."`** — Pesan sukses. Bisa ditampilkan sebagai notifikasi "Selamat datang kembali, Budi!" di pojok layar.

**`data.user.id: 1`** — ID unik user. Nomor ini penting kalau nanti kamu perlu refer ke user tertentu di endpoint lain (misal `POST /api/users/{user}/roles`).

**`data.user.name: "Budi Santoso"`** — Nama kamu. Biasanya dipake buat nampilin "Halo, Budi!" di navbar atau sidebar. Ini lebih human-readable daripada pake ID.

**`data.user.email: "budi@example.com"`** — Email kamu. Berguna buat nampilin di halaman profil atau settings.

**`data.user.roles: ["panitia"]`** — Array yang berisi role (peran) yang kamu punya. Misal kamu punya role `panitia`, artinya kamu bisa akses fitur-fitur level panitia. Bentuknya array (`[...]`) karena satu user bisa punya banyak role, misal `["panitia", "interviewer"]`. Kalau kamu belum dikasih role sama admin, array ini bisa kosong: `[]`.

**`data.token: "2|xyz789abc012..."`** — Token baru. Kenapa nomor depannya `2|` beda sama register yang `1|`? Karena setiap login bikin token baru, jadi ID token-nya beda (token ke-2, ke-3, dst). Token lama (`1|abc...`) tetep bisa dipake, kecuali kamu udah logout atau admin hapus.

> ⚠️ **PENTING!** Token ini ibarat password juga. **Jangan bocorin ke siapa-siapa.** Jangan commit token ke GitHub. Jangan share screenshot yang ada tokennya. Serius! Kalau token bocor, orang bisa login sebagai kamu.

❌ **Response Error (401 — Gagal Login):**

```json
{
  "message": "Email atau password salah.",
  "errors": {
    "email": ["Kredensial tidak valid."]
  }
}
```

**Kapan Error Ini Muncul?**

1. **Email ga terdaftar** — Kamu belum pernah daftar, atau salah ngetik email (misal ngetik "budi@exmple.com" — kelewatan huruf 'a').
2. **Password salah** — Email bener tapi passwordnya beda. Mungkin caps lock nyala, atau numpang lewat 一 bukan.
3. **Akun dihapus** — Admin udah hapus akun kamu, jadi email ga ditemukan di database.

**Kenapa pesannya "Email atau password salah"?** Kenapa ga dikasih tahu yang mana yang salah? Ini **sengaja** — biar orang iseng ga bisa nebak "oh email ini terdaftar, tinggal tebak passwordnya". Pesan error yang spesifik (misal "Email tidak ditemukan") bisa jadi celah keamanan buat hacker.

**Cara Ngatasin:**
- Cek lagi, mungkin typo di email atau password
- Matiin caps lock
- Coba reset password (kalau ada fiturnya)
- Pastiin kamu udah daftar sebelumnya — jangan login sebelum register!

> Kalau dapet error ini, cek lagi email sama password. Mungkin salah ketik atau caps lock nyala.

---

#### 🧠 Apa yang Terjadi di Database? — `POST /api/login`

Waktu login, ini yang terjadi di database:

1. **Tabel `users`** — Server nyari user berdasarkan email:
   ```sql
   SELECT * FROM users WHERE email = 'budi@example.com' LIMIT 1;
   ```
   Kalau ketemu, server dapet data user termasuk kolom `password` (hash-nya).

2. Pengecekan password dilakukan di kode PHP (bukan SQL). Kira-kira gini logikanya:
   ```php
   $user = User::where('email', $request->email)->first();
   if ($user && Hash::check($request->password, $user->password)) {
     // Password cocok! Bikin token.
   }
   ```

3. **Tabel `personal_access_tokens`** — Kalau password cocok, server bikin token baru:
   ```sql
   INSERT INTO personal_access_tokens (tokenable_type, tokenable_id, name, token, abilities, created_at, updated_at)
   VALUES ('App\\Models\\User', 1, 'auth_token', '...hash...', '["*"]', NOW(), NOW());
   ```

4. **Token lama tetap ada** — Jadi kamu bisa punya banyak token aktif (misal login dari laptop + HP). Token lama ga dihapus waktu login ulang. Beda sama logout yang hapus satu token spesifik.

---

#### 💻 Contoh Penggunaan di Frontend — `POST /api/login`

**Pakai Fetch:**
```javascript
const loginData = {
  email: "budi@example.com",
  password: "rahasia123"
};

fetch("http://localhost:8000/api/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify(loginData)
})
  .then(response => {
    if (response.status === 401) {
      throw new Error("Email atau password salah");
    }
    if (!response.ok) {
      throw new Error("Gagal login. Coba lagi.");
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      // Simpan token dan data user
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      
      // Redirect sesuai role
      const roles = data.data.user.roles;
      if (roles.includes("super_admin") || roles.includes("admin_oprec")) {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    }
  })
  .catch(error => {
    alert(error.message); // Tampilin error ke user
  });
```

**Pakai Axios — Lengkap dengan interceptor:**
```javascript
import axios from 'axios';

// Bikin instance axios dengan base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Accept': 'application/json' }
});

async function login(email, password) {
  try {
    const response = await api.post('/login', { email, password });
    const { token, user } = response.data.data;
    
    // Simpan token
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Set default header buat semua request berikutnya
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return user;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Email atau password salah!');
    }
    if (error.response?.status === 429) {
      throw new Error('Terlalu banyak percobaan. Tunggu 1 menit ya!');
    }
    throw new Error('Gagal login. Coba lagi.');
  }
}
```

---

#### 💡 Tips & Trik — `POST /api/login`

1. **Jangan simpan password di localStorage!** Password cuma dikirim pas login aja, setelah itu jangan disimpan di frontend. Yang disimpan cuma **token**-nya. Password udah ga kepake lagi sampe kamu logout atau refresh token.

2. **Bikin fungsi helper buat axios.** Setelah login berhasil, set `axios.defaults.headers.common['Authorization']` biar semua request berikutnya otomatis pake token. Ga perlu手动 nambahin header tiap kali.

3. **Handle error 401 dengan user-friendly.** Jangan cuma nampilin "Error 401". Kasih tahu: "Email atau password salah. Cek lagi caps lock-nya ya!" — dalam bahasa yang manusiawi.

4. **Cek role setelah login.** Response login ngasih role user. Manfaatin ini buat nentuin halaman mana yang bakal ditampilin. Misal `super_admin` diarahin ke admin panel, `peserta` diarahin ke halaman pendaftaran. Ini namanya **role-based routing**.

5. **Rate limiting:** Endpoint login dibatasi 5 kali per menit. Kalau nyoba login berkali-kali (salah password terus), server bakal blokir sementara (error 429). Tunggu 1 menit baru bisa nyoba lagi. Ini biar orang iseng ga bisa brute-force password pake script otomatis.

6. **Token Sanctum ga punya masa berlaku secara default.** Tapi kalau user logout, token langsung ga valid. Rencanain handling di frontend: kalau dapet error 401 padahal udah login, redirect ke halaman login.

---

### `POST /api/logout` — Keluar / Selesai Pakai

📝 **Deskripsi:** Logout. Token yang dipake jadi ga valid lagi.

**Penjelasan Detail:**

Bayangin lagi di **parkiran mall**. Kamu masuk, ambil tiket parkir, jalan-jalan, selesai, mau pulang. Pas di pintu keluar, kamu masukin tiket parkir ke mesin. Tiket itu langsung ga berguna lagi buat keluar — udah dipake.

Logout cara kerjanya sama:
1. Kamu kirim request ke `/api/logout` dengan token di header Authorization
2. Server cari token itu di database (di tabel `personal_access_tokens`)
3. Server hapus token itu dari database (beneran dihapus, bukan cuma ditandai)
4. Token yang udah dihapus **ga bisa dipake lagi** buat akses endpoint manapun

**Penting:** Logout hanya menghapus **satu** token — yaitu token yang kamu kirim di header. Kalau kamu login di HP dan laptop, logout dari laptop cuma hapus token laptop. Token di HP tetep bisa dipake. Masing-masing token independen.

**Kapan logout dipake?**
- User mau ganti akun (logout dulu, baru login pake akun lain)
- User selesai pake aplikasi di komputer umum / warnet / lab kampus (biar ga dipake orang lain)
- User mau "amankan" akun setelah pake perangkat orang lain
- Sebagai bagian dari fitur "hapus akun" (logout dulu baru hapus)

🔐 **Siapa yang bisa akses:** **Semua yang udah login** (Bearer Token wajib) — kalau belum login, ya ga usah logout 😄

📦 **Request Body:** Tidak ada (kirim aja token di header)

**Penjelasan:** Kenapa ga perlu body? Karena server udah tau siapa kamu dari token di header. Token itu identitas kamu. Tinggal hapus tokennya dari database, kamu "hilang" dari sistem untuk token itu.

✅ **Response Sukses (200 — OK):**

```json
{
  "success": true,
  "message": "Logout berhasil."
}
```

**Penjelasan Setiap Field:**

**`success: true`** — Logout sukses. Token udah dihapus dari database. Kamu sekarang ga terautentikasi lagi (untuk token ini).

**`message: "Logout berhasil."`** — Konfirmasi. Di frontend, tampilkan ini sebentar (misal toast notification) lalu redirect ke halaman login. Jangan lupa hapus token dari localStorage!

**Kenapa cuma 2 field?** Karena setelah logout, data user udah ga relevan lagi — token udah dihapus. Frontend tinggal redirect ke halaman login dan hapus token dari localStorage.

❌ **Response Error (401 — Token Ga Dikirim / Ga Valid):**

```json
{
  "message": "Unauthenticated."
}
```

**Kapan Error Ini Muncul?**

1. **Header Authorization lupa dikasih** — Kamu cuma kirim `POST /api/logout` tanpa header token. Server bingung: "Ini siapa yang mau logout?"
2. **Token salah / palsu** — Kamu asal tulis `Authorization: Bearer abc123` yang ga sesuai sama yang ada di database.
3. **Token udah dihapus** — Kamu udah logout sebelumnya, terus nyoba logout lagi pake token yang sama. Token udah ga ada di database.
4. **Token bukan punya user valid** — Mungkin user-nya udah dihapus admin, tapi tokennya masih nyangkut di localStorage kamu.

**Cara Ngatasin:**
- Pastiin kirim header `Authorization: Bearer {token}` dengan token yang valid
- Token ada di localStorage? Cek pake `console.log(localStorage.getItem('token'))` di dev tools browser
- Kalau ragu, login ulang dapet token baru, baru logout
- Di kode: handle kasus di mana token udah ga valid — tetap bersihin localStorage dan redirect ke login

> Artinya: "Hei, kamu siapa? Kok ga punya token?" — kirim token dulu ya 😄

---

#### 🧠 Apa yang Terjadi di Database? — `POST /api/logout`

Waktu logout, ini yang terjadi:

1. **Middleware `auth:sanctum`** — Pertama, server ngecek apakah token yang dikirim valid. Ini dilakukan oleh middleware Laravel yang otomatis jalan.

2. **Tabel `personal_access_tokens`** — Server cari token kamu di database:
   ```sql
   SELECT * FROM personal_access_tokens 
   WHERE id = 2 
     AND tokenable_id = 1 
     AND tokenable_type = 'App\\Models\\User';
   ```
   (ID token 2, punya user ID 1)

3. Token ditemukan, server hapus:
   ```sql
   DELETE FROM personal_access_tokens WHERE id = 2;
   ```

4. **Token lain tetap ada.** Kalau kamu punya 3 token (login dari 3 perangkat), cuma token yang dipake buat logout yang kehapus. 2 token lain masih bisa dipake. Jadi kalau kamu logout dari laptop, session di HP tetep jalan.

---

#### 💻 Contoh Penggunaan di Frontend — `POST /api/logout`

**Pakai Fetch — Simple:**
```javascript
async function logout() {
  const token = localStorage.getItem("token");
  
  if (!token) {
    // Udah ga login, langsung redirect aja
    window.location.href = "/login";
    return;
  }
  
  try {
    const response = await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });
    
    if (!response.ok) {
      console.warn("Logout response error:", response.status);
    }
    
  } catch (error) {
    // Error jaringan — tetap lanjut
    console.warn("Logout network error:", error.message);
    
  } finally {
    // Hapus data dari localStorage APAPUN hasilnya
    // Ini penting! Jangan sampe token lama kepake lagi
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Redirect ke halaman login
    window.location.href = "/login";
  }
}
```

**Pakai Axios — Dengan interceptor:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

async function logout() {
  try {
    // Minta server hapus token
    await api.post('/logout');
    console.log('Logout sukses dari server');
    
  } catch (error) {
    // Tetap lanjut walaupun error (token mungkin udah ga valid)
    console.warn('Logout error:', error.message);
    
  } finally {
    // Hapus token dari localStorage bagaimanapun hasilnya
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Hapus default header biar ga kepake
    delete api.defaults.headers.common['Authorization'];
    
    // Redirect
    window.location.href = '/login';
  }
}
```

---

#### 💡 Tips & Trik — `POST /api/logout`

1. **Hapus token dari localStorage setelah logout.** Jangan cuma ngandelin server. Meskipun server udah hapus token, lebih aman kalo frontend juga bersihin. Tambahin `localStorage.removeItem('token')` di blok `finally`.

2. **Always handle logout di `finally`.** Kalo pake async/await, pake `try...catch...finally`. Di blok `finally`, baru hapus token lokal dan redirect. Ini biar kalo request logout gagal (error jaringan), user tetep ke-logout secara lokal dan ga nyangkut.

3. **Jangan panggil endpoint lain setelah logout.** Token udah ga valid, jadi endpoint lain bakal nolak dengan 401. Redirect ke login aja langsung. Jangan coba-coba panggil API lain.

4. **Logout otomatis kalau dapet 401.** Di frontend, kamu bisa bikin **axios interceptor** yang nge-deteksi: "eh, dapet error 401 dari endpoint mana pun, berarti token udah ga valid, redirect ke login aja". Ini jaga-jaga kalo admin hapus token kamu dari server.

5. **Beda log out dengan "ganti akun".** Logout → login. Ini 2 langkah. Jangan lupa redirect ke halaman login setelah logout. Kasih tombol "Login dengan akun lain" di halaman sukses logout biar user experience-nya bagus.

6. **Hapus juga data user dari localStorage.** Jangan cuma token — hapus juga `localStorage.removeItem('user')` karena data user udah ga relevan. Ini juga mencegah data user lama kebaca pas orang lain login di perangkat yang sama.

---

### `GET /api/user` — Lihat Data Diri Sendiri

📝 **Deskripsi:** Ngintip data akun yang lagi login. Kayak kamu liat KTP sendiri.

**Penjelasan Detail:**

Ini endpoint favorit buat ngecek "siapa sih aku di sistem ini?" Bayangin kamu punya **KTP**. Kapan aja kamu bisa liat KTP sendiri, kan? Mau liat nama, alamat, golongan darah. Nah, endpoint ini ibarat KTP-nya aplikasi — nampilin data diri kamu lengkap dengan role dan akses yang kamu punya.

Yang terjadi di balik layar:
1. Kamu kirim token ke server (di header Authorization)
2. Middleware `auth:sanctum` ngecek: "token ini valid ga? punya user siapa?"
3. Kalau valid, server ambil data user dari database berdasarkan user ID yang terikat sama token
4. Server juga ambil role dan permission yang dimiliki user itu (ini dari tabel relasi)
5. Server balikin semua data itu dalam response JSON

**Kenapa endpoint ini penting?**
- Pas pertama kali buka aplikasi, frontend bisa panggil `/api/user` buat ngecek "siapa yang login?"
- Response-nya includes `roles` dan `permissions` — ini dipake buat nentuin menu apa aja yang ditampilin di sidebar/navbar
- Berguna buat ngecek apakah token masih valid atau udah expired/dihapus
- Nampilin informasi user di halaman profil
- Basis buat fitur "edit profil" (pre-fill form pake data dari sini)

🔐 **Siapa yang bisa akses:** **Semua yang udah login** — kalau belum login, server ga bakal tahu "kamu siapa" dan bakal nolak

📦 **Request Body:** Tidak ada

✅ **Response Sukses (200 — OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "roles": ["panitia"],
    "permissions": ["view-peserta", "create-peserta"],
    "created_at": "2026-07-16T10:00:00.000000Z",
    "updated_at": "2026-07-16T10:00:00.000000Z"
  }
}
```

**Penjelasan Setiap Field di Response:**

**`success: true`** — Request berhasil. Token valid, user ditemukan. Kalau `false`, ada yang salah (biasanya token error).

**`data.id: 1`** — ID unik user di database. Nomor ini jarang dipake langsung di frontend (biasanya cukup pake `name` aja), tapi penting buat referensi ke API lain yang butuh ID user, misal `POST /api/users/{user}/roles`.

**`data.name: "Budi Santoso"`** — Nama lengkap user. Biasanya ditampilkan di navbar atau sidebar: "Halo, Budi Santoso! 👋" Ini yang pertama kali dilihat user pas login — jadi pastikan bener dan rapi.

**`data.email: "budi@example.com"`** — Email user. Bisa ditampilkan di halaman profil atau di halaman settings > account. Berguna juga buat konfirmasi "ini lho email yang kamu pake login".

**`data.roles: ["panitia"]`** — Array role yang dimiliki user. **Ini penting banget buat authorization di frontend.** Contoh:
- Kalau `roles` mengandung `"super_admin"` → tampilkan menu admin, user management, pengaturan sistem
- Kalau cuma `"panitia"` → tampilkan menu peserta, interview, pengumuman
- Kalau cuma `"peserta"` → sembunyikan semua menu admin, tampilkan menu pendaftaran dan upload dokumen aja
- Kalau kosong `[]` → user belum dikasih akses apa-apa, mungkin tampilkan halaman "menunggu verifikasi"

**`data.permissions: ["view-peserta", "create-peserta"]`** — Array permission spesifik. Ini lebih detail daripada role. Misal walaupun role-nya `panitia`, permission bisa beda-beda tergantung konfigurasi admin. Di frontend, permission dipake buat:
- Nampilin / nyembunyiin tombol "Tambah Peserta" — butuh permission `create-peserta`
- Nampilin / nyembunyiin tombol "Edit" — butuh permission `edit-peserta`
- Nampilin / nyembunyiin tombol "Hapus" — butuh permission `delete-peserta`

**`data.created_at: "2026-07-16T10:00:00.000000Z"`** — Tanggal akun dibuat. Bisa ditampilkan di profil: "Anggota sejak 16 Juli 2026".

**`data.updated_at: "2026-07-16T10:00:00.000000Z"`** — Tanggal terakhir data diubah. Kalau user ganti nama atau email, field ini berubah.

> Lihat ada field `roles` dan `permissions`? Itu yang nentuin kamu bisa ngapain aja di aplikasi. Kalau role kamu "peserta", ya kamu ga bisa lihat data peserta lain. Wajar.

❌ **Response Error (401 — Belum Login):**

```json
{
  "message": "Unauthenticated."
}
```

**Kapan Error Ini Muncul?**

1. **Token ga dikirim** — Header `Authorization` lupa ditambahin. Request dikirim tanpa token sama sekali.
2. **Token salah format** — Format header-nya salah. Misal nulis `Authorization: Bearer` tanpa token-nya, atau pake kata selain "Bearer".
3. **Token udah dihapus** — Kamu udah logout sebelumnya, token udah ga ada di database. Tapi kamu masih nyimpen token lama di localStorage.
4. **Token bukan punya user valid** — Token ada di database, tapi user yang punya token udah dihapus admin. Jadinya token "yatim piatu" — ga punya pemilik.

**Cara Ngatasin:**
- Cek apakah token udah disimpan di localStorage: `console.log('Token:', localStorage.getItem('token'))`
- Log header yang dikirim: `console.log('Authorization:', 'Bearer ' + token)`
- Kalau error terjadi di tengah session, mungkin token dihapus admin. Redirect ke login.
- Di frontend, bikin **auto-redirect**: kalau dapet 401 dari endpoint mana pun, redirect ke halaman login.

---

#### 🧠 Apa yang Terjadi di Database? — `GET /api/user`

Waktu panggil `/api/user`, beberapa query jalan:

1. **Middleware `auth:sanctum`** jalan duluan. Ini otomatis dari Laravel, ga perlu ditulis manual:
   ```php
   // Kira-kira gini cara kerja middleware:
   // 1. Ambil token dari header Authorization
   // 2. Cari di tabel personal_access_tokens
   // 3. Kalau ketemu, set user yang login ke request
   ```

2. **Tabel `personal_access_tokens`** — Server cari token:
   ```sql
   SELECT * FROM personal_access_tokens 
   WHERE token = '...hash_dari_token...'
   LIMIT 1;
   ```

3. Kalau ketemu, server ambil `tokenable_id` (user ID) dari token itu.

4. **Tabel `users`** — Ambil data user:
   ```sql
   SELECT id, name, email, email_verified_at, created_at, updated_at 
   FROM users WHERE id = 1;
   ```

5. **Tabel `model_has_roles` + `roles`** — Ambil role user (relasi many-to-many):
   ```sql
   SELECT r.name FROM model_has_roles mhr
   JOIN roles r ON r.id = mhr.role_id
   WHERE mhr.model_id = 1 AND mhr.model_type = 'App\\Models\\User';
   ```

6. **Tabel `model_has_permissions` + `permissions` + `role_has_permissions`** — Ambil semua permission:
   - Langsung dari model (permission khusus untuk user ini)
   - Dari role yang dimiliki user (permission yang melekat ke role)
   ```sql
   -- Permission dari role
   SELECT p.name FROM role_has_permissions rhp
   JOIN permissions p ON p.id = rhp.permission_id
   WHERE rhp.role_id IN (SELECT role_id FROM model_has_roles WHERE model_id = 1);
   ```

---

#### 💻 Contoh Penggunaan di Frontend — `GET /api/user`

**Pakai Fetch — Cek session pas buka aplikasi (paling sering dipake):**
```javascript
// Panggil fungsi ini pas aplikasi pertama kali jalan
// Misal di App.js atau layout utama
async function checkAuth() {
  const token = localStorage.getItem("token");
  
  if (!token) {
    // Ga ada token sama sekali — user belum pernah login
    window.location.href = "/login";
    return null;
  }
  
  try {
    const response = await fetch("http://localhost:8000/api/user", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });
    
    if (response.status === 401) {
      // Token ga valid (udah dihapus/expired), bersihin dan redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return null;
    }
    
    const data = await response.json();
    
    // Simpan data user di localStorage biar ga perlu panggil lagi
    localStorage.setItem("user", JSON.stringify(data.data));
    
    return data.data; // { id, name, email, roles, permissions, ... }
    
  } catch (error) {
    console.error("Gagal cek auth:", error);
    return null;
  }
}

// Contoh pake di React:
// useEffect(() => {
//   const user = await checkAuth();
//   if (user) {
//     setUser(user);
//     // Cek role buat routing
//     if (user.roles.includes('super_admin')) { ... }
//   }
// }, []);
```

**Pakai Axios — Interceptor buat auto-redirect:**
```javascript
import axios from 'axios';

// Bikin instance axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Accept': 'application/json' }
});

// Set token dari localStorage (kalo ada)
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Interceptor response: kalau dapet 401, redirect ke login
api.interceptors.response.use(
  response => response,  // Kalau sukses, lanjutkan
  error => {
    if (error.response?.status === 401) {
      // Token ga valid — bersihin dan redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Panggil /api/user
async function getCurrentUser() {
  try {
    const response = await api.get('/user');
    return response.data.data;
  } catch (error) {
    console.error('Gagal ambil data user:', error);
    return null;
  }
}
```

---

#### 💡 Tips & Trik — `GET /api/user`

1. **Panggil `/api/user` pas aplikasi pertama kali jalan.** Ini buat ngecek tiga hal penting:
   - Apakah user udah login? (kalau dapet 401, redirect ke login)
   - Siapa user-nya? (nama buat display di navbar)
   - Apa aja role & permission-nya? (buat ngatur tampilan menu dan tombol)

2. **Simpan response di state management.** Abis dapet data user, simpan di React Context / Redux / Zustand biar ga perlu panggil ulang tiap ganti halaman. Tapi kalau page di-refresh, panggil ulang dari API (jangan ngandelin localStorage doang karena bisa aja token udah dihapus server).

3. **Gunakan `roles` dan `permissions` buat conditional rendering.** Contoh di React:
   ```jsx
   // Cuma tampilin tombol "Tambah Peserta" kalo user punya permission
   {user.permissions.includes('create-peserta') && (
     <button className="btn-primary">Tambah Peserta</button>
   )}
   
   // Route protection: redirect kalo role ga sesuai
   if (!user.roles.includes('admin_oprec') && !user.roles.includes('super_admin')) {
     return <Navigate to="/dashboard" />;
   }
   ```

4. **Jangan cuma ngandelin frontend buat keamanan.** Iya, kamu bisa sembunyiin tombol di frontend. Tapi user iseng bisa panggil API langsung pake Postman atau curl. Makanya validasi permission juga harus di backend. Frontend cuma buat user experience aja — backend yang jadi benteng terakhir.

5. **Cache data user.** Data user jarang berubah (kecuali admin ganti role). Kamu bisa cache data user di React Context dan hanya refresh kalau:
   - User nge-refresh halaman (F5)
   - User buka halaman profil
   - Ada notifikasi dari server bahwa data berubah

6. **Field `roles` berupa array, manfaatkan buat multiple role check.** Satu user bisa punya multiple roles. Jangan pake `===` buat ngecek, tapi pake `includes()`:
   ```javascript
   // ✅ BENER
   if (user.roles.includes('super_admin') || user.roles.includes('admin_oprec')) { ... }
   
   // ❌ SALAH — karena roles itu array, bukan string
   if (user.roles === 'super_admin') { ... }
   ```

## Roles & Permissions — Siapa Bisa Ngapain Aja *(PIC: Reyhan)*

### Penjelasan Dulu ya 😊

Bayangin di **kampus** ada beberapa jabatan:

- **Rektor** → bisa ngapa-ngapain, ngatur seluruh universitas
- **Dekan** → ngatur fakultas
- **Dosen** → ngajar, ngasih nilai
- **Mahasiswa** → belajar, liat nilai sendiri

Kalau semua punya akses yang sama, kacau balau kan? Bayangin kalau mahasiswa bisa ngubah nilai sendiri 😱 Atau dosen bisa ngatur anggaran universitas. Udah pasti berantakan.

Nah, di aplikasi kita juga gitu. Ada dua konsep penting:

**Apa bedanya Role dan Permission?**
- **Role** = jabatan / peran (contoh: `super_admin`, `panitia`, `peserta`). Ini kayak "title" atau posisi seseorang.
- **Permission** = izin spesifik (contoh: `view-peserta`, `create-peserta`). Ini kayak "kartu akses" ke fitur tertentu.

**Cara kerjanya:**
- Seorang user bisa punya 1 role atau lebih (misal jadi panitia sekaligus interviewer)
- Satu role bisa punya banyak permission (role panitia punya izin lihat + buat peserta)
- Permission bisa dikasih langsung ke user, atau ke role (dan user yang pake role itu otomatis dapet permission-nya)

**Spatie Laravel Permission** adalah library yang kita pake buat ngatur ini semua. Dia otomatis bikin tabel-tabel di database buat nyimpen role dan permission, plus fungsi-fungsi buat ngecek "eh, user ini punya akses ga ya?". Library ini udah dipake ribuan project Laravel di seluruh dunia, jadi udah teruji.

**Hubungan Antar Tabel:**

```
users  ──  model_has_roles  ──  roles  ──  role_has_permissions  ──  permissions
  │                                │
  └────  model_has_permissions  ───┘
```

Penjelasan:
- `users` = tabel user kita
- `roles` = daftar role yang tersedia
- `permissions` = daftar permission yang tersedia
- `model_has_roles` = tabel penghubung: user mana punya role apa
- `role_has_permissions` = tabel penghubung: role mana punya permission apa
- `model_has_permissions` = tabel penghubung: kalo permission dikasih langsung ke user (bukan lewat role)

---

### `GET /api/roles` — Lihat Daftar Role

📝 **Deskripsi:** Ambil daftar semua role yang ada di sistem.

**Penjelasan Detail:**

Bayangin kamu jadi **kepala HRD** di perusahaan. Kamu mau lihat "ada jabatan apa aja sih di perusahaan kita?" — ada Manager, Staff, Intern, Direktur. Nah, endpoint ini ngelakuin hal yang sama buat aplikasi: nampilin semua role yang tersedia.

Yang terjadi di balik layar:
1. Kamu (frontend) kirim request `GET /api/roles` dengan token admin
2. Middleware ngecek: "apakah user ini punya akses ke endpoint roles?"
3. Kalau punya, server ambil semua data dari tabel `roles`
4. Server juga ngitung berapa banyak permission yang dimiliki setiap role (biar langsung keliatan "kekuatan" role-nya)
5. Data dikembalikan dalam bentuk array, dengan dukungan pagination (halaman)

Endpoint ini berguna buat:
- Admin yang mau liat konfigurasi role saat ini
- Ngecek "role X punya berapa permission?"
- Sebelum bikin role baru, liat dulu role apa yang udah ada biar ga duplikasi

🔐 **Siapa yang bisa akses:** `super_admin`, `admin_oprec` — karena ini data sensitif, cuma admin yang boleh lihat

🔍 **Parameter Pencarian (opsional — bisa dikirim atau enggak):**

| Parameter | Tipe | Penjelasan |
|---|---|---|
| `search` | string | Cari role berdasarkan nama (misal: "admin") |
| `page` | integer | Halaman ke berapa (default: 1) |
| `per_page` | integer | Berapa data per halaman (default: 10) |

**Penjelasan Setiap Parameter:**

**`search`** — Kalau role-nya udah banyak (misal 20+), kamu bisa cari yang spesifik. Contoh: `GET /api/roles?search=admin` bakal nampilin role yang namanya mengandung kata "admin". Kalau ga dikirim, semua role ditampilkan.

**`page`** — Pagination. Misal ada 25 role, per halaman 10. Halaman 1: role 1-10, halaman 2: role 11-20, halaman 3: role 21-25. Default `1` (halaman pertama).

**`per_page`** — Jumlah role per halaman. Default 10. Kalau mau liat semua langsung, bisa dikirim angka gede kayak `per_page=100`.

✅ **Response Sukses (200 — OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "super_admin",
      "guard_name": "web",
      "permissions_count": 10,
      "created_at": "2026-07-16T10:00:00.000000Z"
    },
    {
      "id": 2,
      "name": "panitia",
      "guard_name": "web",
      "permissions_count": 5,
      "created_at": "2026-07-16T10:00:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 10,
    "total": 2
  }
}
```

**Penjelasan Setiap Field di Response:**

**`data[].id: 1`** — ID unik role. Dipake sebagai referensi di endpoint lain.

**`data[].name: "super_admin"`** — Nama role. Ini yang dipake buat ngecek akses di kode: `if ($user->hasRole('super_admin'))`. Nama harus unik.

**`data[].guard_name: "web"`** — Nama guard yang dipake. Di aplikasi kita, guard `web` artinya autentikasi pake session web biasa. Ini otomatis dari Spatie. Jangan diubah.

**`data[].permissions_count: 10`** — Jumlah permission yang dimiliki role ini. Makin besar angkanya, makin banyak izin yang dimiliki role tersebut. `super_admin` biasanya punya permission paling banyak.

**`data[].created_at`** — Kapan role ini dibuat.

**`meta.current_page: 1`** — Halaman yang lagi dilihat (1 = halaman pertama).
**`meta.last_page: 1`** — Total halaman. Kalau 1, berarti semua data muat di 1 halaman.
**`meta.per_page: 10`** — Data per halaman.
**`meta.total: 2`** — Total seluruh role di database (bukan cuma di halaman ini).

> `permissions_count` itu jumlah izin yang dimiliki role tersebut. Makin banyak, makin kuat role-nya.

---

#### 🧠 Apa yang Terjadi di Database? — `GET /api/roles`

Query yang terjadi:
```sql
-- Ambil semua role
SELECT * FROM roles ORDER BY id ASC;

-- Hitung permission per role (dilakuin di kode Laravel)
SELECT COUNT(*) FROM role_has_permissions WHERE role_id = ?;
```

Tabel yang terlibat:
- **`roles`** — sumber data utama
- **`role_has_permissions`** — buat ngitung `permissions_count`

---

#### 💻 Contoh Penggunaan di Frontend — `GET /api/roles`

```javascript
async function fetchRoles(search = '', page = 1) {
  const token = localStorage.getItem('token');
  
  // Bikin query string
  let url = 'http://localhost:8000/api/roles?page=' + page + '&per_page=10';
  if (search) {
    url += '&search=' + encodeURIComponent(search);
  }
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Daftar role:', data.data);
    console.log('Total:', data.meta.total, 'Halaman:', data.meta.current_page);
    return data;
  }
}
```

---

#### 💡 Tips & Trik — `GET /api/roles`

1. **Gunakan `search` parameter.** Daripada load semua data terus nyaring manual di frontend, mending pake parameter `search` biar server yang nyaring. Lebih cepet dan irit bandwidth.

2. **Perhatikan pagination.** Kalau role-nya cuma 2-5, semua muncul di halaman 1. Tapi di produksi bisa puluhan — pastikan frontend siap handle tombol "Next Page" dan "Prev Page".

3. **Cek `permissions_count`.** Ini gambaran cepet: role dengan count > 50 kemungkinan punya akses luas (kayak super_admin). Yang count-nya kecil kemungkinan role terbatas.

4. **Jangan hardcode ID role di frontend.** ID role bisa berubah antara environment development dan production. Pake nama role aja buat logika di frontend.

5. **Cache data roles.** Data role jarang berubah. Cache di frontend biar ga perlu panggil API tiap kali buka halaman.

---

### `POST /api/roles` — Buat Role Baru

📝 **Deskripsi:** Nambahin role baru ke sistem.

**Penjelasan Detail:**

Bayangin lagi di **organisasi kampus**. Tiba-tiba ada jabatan baru yang belum pernah ada sebelumnya: "Koordinator Acara". Kamu selaku ketua (super_admin) perlu bikin jabatan ini dulu di sistem, baru bisa nunjuk orang buat ngisi jabatan itu.

Nah, endpoint ini gunanya buat bikin role baru. Misal nanti butuh role kayak "mentor", "pembina", "koordinator", atau apapun. Tinggal panggil endpoint ini, kirim nama rolenya, server bakal bikin.

Yang terjadi di balik layar:
1. Kamu kirim data role baru ke server
2. Server ngecek: "apa nama role udah ada? kalau belum, bikin baru"
3. Kalau ada field `permissions`, server juga langsung ngasih permission-permission itu ke role barunya
4. Data disimpan ke tabel `roles` (dan `role_has_permissions` kalau ada permission)
5. Response balik ngasih konfirmasi

Kapan endpoint ini dipake?
- Admin mau nambah role baru karena kebutuhan organisasi berubah
- Ada pembagian tugas baru yang butuh role spesifik
- Migrasi data dari sistem lama

🔐 **Siapa yang bisa akses:** `super_admin` aja — karena bikin role itu operasi sensitif, bisa ngaruh ke keamanan sistem

📦 **Request Body:**

```json
{
  "name": "interviewer",
  "permissions": [1, 2, 3]
}
```

| Field | Wajib? | Penjelasan |
|---|---|---|
| `name` | ✅ Wajib | Nama role (harus unik, ga boleh sama dengan yang udah ada) |
| `permissions` | ❌ Opsional | Array berisi ID permission yang mau dikasih ke role ini |
| `permissions.*` | ❌ Opsional | ID permission (angka) — ambil dari endpoint `GET /api/permissions` |

**Penjelasan Setiap Field:**

**`name`** — Nama role baru. Harus unik — ga boleh ada dua role dengan nama "interviewer". Pake format lowercase dan underscore kalo lebih dari satu kata: `admin_oprec`, `super_admin`. Ini penting karena nama role dipake langsung di kode backend buat ngecek akses. Kalau nama udah dipake, server balik error 422.

**`permissions`** — Array berisi ID permission yang mau dikasih ke role ini. Opsional — bisa dikirim, bisa enggak. Kalau dikirim, server bakal otomatis ngaitin role baru dengan permission-permission itu. Contoh: `[1, 2, 3]` artinya role baru dapet permission dengan ID 1, 2, dan 3. Kalau ga dikirim, role baru lahir tanpa permission — nanti bisa ditambah belakangan pake endpoint `POST /api/roles/{role}/permissions`.

**`permissions.*`** — Setiap elemen di array `permissions`. Masing-masing adalah angka (integer) yang merupakan ID permission. ID permission bisa kamu lihat di endpoint `GET /api/permissions`. Kalau ngirim ID permission yang ga ada di database, server bakal nge-skip aja (ga error).

✅ **Response Sukses (201 — Berhasil Dibuat):**

```json
{
  "success": true,
  "message": "Role berhasil dibuat.",
  "data": {
    "id": 3,
    "name": "interviewer",
    "guard_name": "web",
    "created_at": "2026-07-16T11:00:00.000000Z",
    "updated_at": "2026-07-16T11:00:00.000000Z"
  }
}
```

**Penjelasan Setiap Field:**

**`success: true`** — Role berhasil dibuat. Kode response-nya 201 (Created), bukan 200.

**`message: "Role berhasil dibuat."`** — Pesan sukses buat ditampilkan ke admin.

**`data.id: 3`** — ID role baru. Karena sebelumnya udah ada role ID 1 (super_admin) dan 2 (panitia), maka role baru dapet ID 3.

**`data.name: "interviewer"`** — Nama role yang baru aja dibuat.

**`data.guard_name: "web"`** — Guard default dari aplikasi web.

**`data.created_at`** — Waktu pembuatan.

**`data.updated_at`** — Waktu terakhir diubah (sama kayak created_at karena baru dibuat).

❌ **Response Error (422 — Nama Role Udah Ada):**

```json
{
  "message": "Validasi gagal.",
  "errors": {
    "name": ["Nama role sudah digunakan."]
  }
}
```

**Kapan Error Ini Muncul?**
- Kamu nyoba bikin role dengan nama "interviewer" padahal udah ada yang bikin sebelumnya.
- Nama role harus unik di seluruh sistem.

**Cara Ngatasin:**
- Cek dulu pake `GET /api/roles` — liat role apa aja yang udah ada
- Pake nama yang beda, misal "interviewer_2026" atau "pewawancara"
- Kalau mau update role yang udah ada, pake `PUT /api/roles/{id}`

---

#### 🧠 Apa yang Terjadi di Database? — `POST /api/roles`

1. Simpan role baru di tabel `roles`:
   ```sql
   INSERT INTO roles (name, guard_name, created_at, updated_at)
   VALUES ('interviewer', 'web', NOW(), NOW());
   ```

2. Kalau ada `permissions` dikirim, simpan relasi di `role_has_permissions`:
   ```sql
   INSERT INTO role_has_permissions (permission_id, role_id)
   VALUES (1, 3), (2, 3), (3, 3);
   ```
   (Permission ID 1,2,3 dikasih ke role ID 3)

---

#### 💻 Contoh Penggunaan di Frontend — `POST /api/roles`

```javascript
async function createRole(name, permissionIds = []) {
  const token = localStorage.getItem('token');
  
  const body = { name };
  if (permissionIds.length > 0) {
    body.permissions = permissionIds;
  }
  
  const response = await fetch('http://localhost:8000/api/roles', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  
  if (response.status === 201) {
    console.log('Role berhasil dibuat:', data.data.name);
    return data.data;
  } else {
    console.error('Gagal:', data.errors);
    throw new Error(data.message);
  }
}

// Panggil:
// await createRole('mentor', [1, 2, 3]);
```

---

#### 💡 Tips & Trik — `POST /api/roles`

1. **Pake nama role yang konsisten.** Format: `kata_depan_kata_belakang` pake underscore, lowercase semua. Contoh: `super_admin`, `admin_oprec`. Jangan pake spasi atau huruf kapital biar gampang dipake di kode.

2. **Bikin dulu permission-nya, baru role-nya.** Urutan yang bener: bikin permission dulu (lewat seeder database), baru bikin role dan assign permission ke role. Jangan kebalik.

3. **Kasih permission pas awal.** Manfaatin field `permissions` di request body biar ga perlu 2 langkah (bikin role → assign permission). Ini ngirit satu request.

4. **Jangan bikin role yang ga dipake.** Setiap role baru artinya ada kode backend yang ngecek role itu. Kalau role-nya ada tapi ga pernah dicek di kode, percuma.

5. **Role name bersifat case-sensitive.** `Interviewer` beda sama `interviewer`. Pilih satu format dan konsisten. Saran: pake lowercase semua.

---

### `GET /api/roles/{id}` — Detail Role Tertentu

📝 **Deskripsi:** Lihat detail satu role, termasuk permission apa aja yang dimilikinya.

**Penjelasan Detail:**

Ini kayak kamu buka **kartu profil** satu jabatan. Misal kamu pengen tahu "role panitia itu sebenernya bisa ngapain aja sih?" — tinggal panggil endpoint ini, dan dia bakal nampilin semua permission yang dimiliki role panitia.

Yang dimaksud `{id}` itu **path parameter** — artinya kamu ganti `{id}` dengan angka ID role yang mau dilihat. Misal:
- `GET /api/roles/1` — liat role dengan ID 1 (super_admin)
- `GET /api/roles/2` — liat role dengan ID 2 (panitia)
- `GET /api/roles/3` — liat role dengan ID 3 (interviewer)

Yang terjadi di balik layar:
1. Server terima ID role dari URL
2. Server cari role dengan ID itu di database
3. Kalau ketemu, server ambil juga semua permission yang terikat sama role itu (lewat tabel `role_has_permissions`)
4. Data role + permission digabung dan dikembalikan

**Penting:** Endpoint `GET /api/roles` (sebelumnya) tuh cuma nampilin list dan `permissions_count` (jumlahnya doang). Endpoint ini nampilin lebih detail: permission **apa aja** yang dimiliki, lengkap dengan ID dan nama permission-nya.

🔐 **Siapa yang bisa akses:** `super_admin`, `admin_oprec`

💡 Contoh panggilan: `GET http://localhost:8000/api/roles/1`

✅ **Response Sukses (200 — OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "super_admin",
    "guard_name": "web",
    "permissions": [
      {"id": 1, "name": "view-users"},
      {"id": 2, "name": "create-users"},
      {"id": 3, "name": "edit-users"},
      {"id": 4, "name": "delete-users"}
    ],
    "created_at": "2026-07-16T10:00:00.000000Z",
    "updated_at": "2026-07-16T10:00:00.000000Z"
  }
}
```

**Penjelasan Setiap Field:**

**`data.permissions`** — Array yang berisi daftar permission yang dimiliki role ini. Bandingin sama endpoint list (`GET /api/roles`) yang cuma punya `permissions_count`. Di sini detailnya keliatan: permission apa aja.

**`data.permissions[].id: 1`** — ID permission di database. Berguna kalo mau refer ke permission ini di endpoint lain.

**`data.permissions[].name: "view-users"`** — Nama permission. Polanya `{aksi}-{resource}`. `view-users` artinya "izin buat ngeliat data user". Gampang ditebak kan? Ada juga `create-users` (buat user baru), `edit-users` (ubah data user), `delete-users` (hapus user).

❌ **Response Error (404 — Ga Ketemu):**

```json
{
  "message": "Role tidak ditemukan."
}
```

**Kapan Error Ini Muncul?**
- Kamu panggil `GET /api/roles/99` padahal di database cuma ada role ID 1-5
- Role-nya udah dihapus sebelumnya (pake `DELETE /api/roles/{id}`)
- Salah ngetik ID

**Cara Ngatasin:**
- Cek dulu pake `GET /api/roles` buat liat ID yang valid
- Pastikan ID yang dikirim di URL bener (angka, bukan teks)
- Handle di frontend: kasih pesan "Role tidak ditemukan" dan redirect ke halaman daftar role

---

#### 🧠 Apa yang Terjadi di Database? — `GET /api/roles/{id}`

```sql
-- Ambil data role
SELECT * FROM roles WHERE id = 1 LIMIT 1;

-- Ambil semua permission yang dimiliki role ini
SELECT p.id, p.name FROM permissions p
JOIN role_has_permissions rhp ON rhp.permission_id = p.id
WHERE rhp.role_id = 1;
```

Tabel yang terlibat:
- **`roles`** — data role
- **`role_has_permissions`** — relasi role → permission
- **`permissions`** — data permission (nama, dll)

---

#### 💻 Contoh Penggunaan di Frontend — `GET /api/roles/{id}`

```javascript
async function getRoleDetail(roleId) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`http://localhost:8000/api/roles/${roleId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  if (response.status === 404) {
    console.log('Role ga ketemu');
    return null;
  }
  
  const data = await response.json();
  return data.data;
}

// Panggil:
// const role = await getRoleDetail(2);
// console.log('Role:', role.name);
// console.log('Permissions:', role.permissions.map(p => p.name));
```

---

#### 💡 Tips & Trik — `GET /api/roles/{id}`

1. **Pake buat ngecek sebelum edit.** Sebelum panggil `PUT /api/roles/{id}`, liat dulu data role yang ada. Nanti di form edit, pre-fill pake data dari endpoint ini.

2. **Cocokin permission di frontend.** Response-nya ngasih daftar permission lengkap. Kamu bisa tampilin dalam bentuk daftar ceklis (checkbox) — permission yang udah dimiliki role dicentang, yang belum dikosongin.

3. **Perhatikan beda endpoint list vs detail.** Endpoint list (`GET /api/roles`) cuma nampilin jumlah permission. Endpoint detail ini nampilin daftar permission-nya. Jadi kalo butuh detail per-role, panggil endpoint ini; kalo cuma mau liat overview, pake yang list aja.

4. **Error 404 handling.** Pastikan frontend handle error 404 dengan baik — kasih tahu user kalo role-nya udah ga ada (mungkin dihapus orang lain).

---

### `PUT /api/roles/{id}` — Update Role

📝 **Deskripsi:** Ubah data role yang udah ada.

**Penjelasan Detail:**

Bayangin kamu punya jabatan "Koordinator" tapi ternamaannya kurang pas. Kamu mau ganti jadi "Koordinator Senior" atau kasih tambahan wewenang. Nah, kamu ga perlu bikin role baru dan hapus yang lama — cukup update aja.

Yang terjadi di balik layar:
1. Kamu kirim data baru (nama baru dan/atau permission baru)
2. Server ngecek: "role dengan ID ini ada ga?"
3. Kalau ada, server update nama role
4. Kalau ada field `permissions`, server **ganti semua** permission yang dimiliki role ini dengan yang baru dikirim (ini penting: permission lama dihapus, diganti dengan yang baru)
5. Data terbaru disimpan

**Penting:** Bedanya `POST` vs `PUT`:
- `POST /api/roles` = bikin role baru dari nol
- `PUT /api/roles/{id}` = update role yang udah ada

🔐 **Siapa yang bisa akses:** `super_admin` — cuma bos besar yang bisa edit role

📦 **Request Body:**

```json
{
  "name": "super_admin_banget",
  "permissions": [1, 2, 3, 4, 5]
}
```

| Field | Wajib? | Penjelasan |
|---|---|---|
| `name` | ✅ Wajib | Nama role baru (bisa beda dari sebelumnya) |
| `permissions` | ❌ Opsional | Array ID permission — permission lama bakal diganti total |

**Penjelasan Setiap Field:**

**`name`** — Nama baru buat role ini. Bisa sama kayak sebelumnya (kalo cuma mau ganti permission), atau nama yang beda sama sekali. Nama harus tetap unik — gaboleh ada role lain yang pake nama yang sama. Kalo cuma ganti permission tanpa ganti nama, kirim nama yang sama.

**`permissions`** — Array ID permission. **Ini bersifat replace**: permission yang sebelumnya dimiliki role bakal dihapus semua, lalu diganti dengan yang baru dikirim. Contoh: sebelumnya role punya permission [1,2,3], kamu kirim [4,5] → hasilnya role cuma punya [4,5]. Bukan ditambah, tapi diganti. Kalo mau nambah permission tanpa ngilangin yang lama, pake endpoint `POST /api/roles/{role}/permissions`.

✅ **Response Sukses (200 — OK):**

```json
{
  "success": true,
  "message": "Role berhasil diperbarui.",
  "data": {
    "id": 1,
    "name": "super_admin_banget",
    "guard_name": "web",
    "updated_at": "2026-07-16T12:00:00.000000Z"
  }
}
```

**Penjelasan Field:**

**`data.id: 1`** — ID role tetap sama. Role ini tetep role yang sama, cuma namanya berubah.

**`data.name: "super_admin_banget"`** — Nama baru. Kalau ada kode backend yang ngecek `$user->hasRole('super_admin')`, kode itu bakal **ga jalan** lagi karena namanya udah berubah! Jadi hati-hati pas ganti nama role.

**`data.updated_at`** — Waktu update. Berubah dari nilai sebelumnya.

---

#### 🧠 Apa yang Terjadi di Database? — `PUT /api/roles/{id}`

```sql
-- Update nama role
UPDATE roles SET name = 'super_admin_banget', updated_at = NOW()
WHERE id = 1;

-- Hapus semua permission yang lama
DELETE FROM role_has_permissions WHERE role_id = 1;

-- Tambah permission yang baru
INSERT INTO role_has_permissions (permission_id, role_id)
VALUES (1, 1), (2, 1), (3, 1), (4, 1), (5, 1);
```

Tabel yang berubah:
- **`roles`** — nama role diupdate
- **`role_has_permissions`** — permission lama dihapus, permission baru ditambah

---

#### 💻 Contoh Penggunaan di Frontend — `PUT /api/roles/{id}`

```javascript
async function updateRole(roleId, name, permissionIds = []) {
  const token = localStorage.getItem('token');
  
  const body = { name };
  if (permissionIds.length > 0) {
    body.permissions = permissionIds;
  }
  
  const response = await fetch(`http://localhost:8000/api/roles/${roleId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  
  if (response.ok) {
    console.log('Role updated:', data.message);
    return data.data;
  } else {
    console.error('Error:', data.errors);
    throw new Error(data.message);
  }
}

// Contoh: ambil dulu data lama, baru update
// const oldRole = await getRoleDetail(1);
// await updateRole(1, 'super_admin_banget', oldRole.permissions.map(p => p.id));
```

---

#### 💡 Tips & Trik — `PUT /api/roles/{id}`

1. **Permission bersifat replace, bukan append.** Ini penting! Kalo kamu mau nambah permission baru tanpa ngilangin yang lama, jangan pake `PUT`. Pake `POST /api/roles/{role}/permissions` (endpoint khusus buat nambah permission).

2. **Hati-hati ganti nama role.** Kalau ada kode backend yang ngecek `hasRole('super_admin')`, ganti nama role bakal bikin kode itu rusak. Komunikasi sama tim backend sebelum ganti nama role.

3. **Ambil data lama dulu sebelum update.** Best practice: panggil `GET /api/roles/{id}` dulu, edit di frontend, baru kirim via `PUT`. Ini biar user liat data yang existing.

4. **Validasi di frontend.** Jangan sampai user bisa ngirim nama role kosong atau spasi doang. Cek dulu sebelum kirim request.

5. **Konfirmasi sebelum update.** Kasih dialog konfirmasi: "Apakah kamu yakin mau update role ini? Ini bisa ngaruh ke akses user yang memegang role ini."

---

### `DELETE /api/roles/{id}` — Hapus Role

📝 **Deskripsi:** Hapus role dari sistem.

**Penjelasan Detail:**

Bayangin ada jabatan "Koordinator" di organisasi yang udah ga dipake lagi (dihapus karena restrukturisasi). Nah, role di aplikasi kita juga bisa dihapus kalo udah ga relevan.

Yang terjadi di balik layar:
1. Server terima ID role yang mau dihapus
2. Server cek: "ini role `super_admin` bukan?" — karena `super_admin` **dilindungi** dan ga bisa dihapus
3. Kalau bukan `super_admin`, server hapus role beserta semua relasinya (di tabel `role_has_permissions` dan `model_has_roles`)
4. User yang memegang role ini otomatis kehilangan role-nya

**Penting:** Hapus role **ga** ngaruh langsung ke user. User-nya tetap ada, cuma role-nya ilang. Tapi user itu bisa ga punya akses lagi kalo permission cuma didapet dari role yang dihapus.

🔐 **Siapa yang bisa akses:** `super_admin`

✅ **Response Sukses (200 — OK):**

```json
{
  "success": true,
  "message": "Role berhasil dihapus."
}
```

❌ **Response Error (400 — Gagal):**

```json
{
  "message": "Role super_admin tidak dapat dihapus."
}
```

**Kapan Error Ini Muncul?**
- Kamu nyoba hapus role dengan nama "super_admin"
- Role `super_admin` dilindungi secara khusus di kode backend biar ga kehapus
- Kenapa? Bayangin kalo `super_admin` kehapus — semua admin kehilangan akses! Ga ada yang bisa ngatur aplikasi lagi 😱

**Response Error Lain (404):**
- Kalo ID role ga ditemukan: `"message": "Role tidak ditemukan."`

---

#### 🧠 Apa yang Terjadi di Database? — `DELETE /api/roles/{id}`

```sql
-- Hapus relasi role-user
DELETE FROM model_has_roles WHERE role_id = 3;

-- Hapus relasi role-permission
DELETE FROM role_has_permissions WHERE role_id = 3;

-- Hapus role-nya sendiri
DELETE FROM roles WHERE id = 3;
```

Tabel yang berubah:
- **`model_has_roles`** — relasi user → role dihapus
- **`role_has_permissions`** — relasi role → permission dihapus
- **`roles`** — rolenya sendiri dihapus

---

#### 💻 Contoh Penggunaan di Frontend — `DELETE /api/roles/{id}`

```javascript
async function deleteRole(roleId) {
  const token = localStorage.getItem('token');
  
  // Konfirmasi dulu
  const confirmed = confirm('Apakah kamu yakin mau menghapus role ini?');
  if (!confirmed) return;
  
  try {
    const response = await fetch(`http://localhost:8000/api/roles/${roleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('Role berhasil dihapus!');
      // Refresh daftar role
      window.location.reload();
    } else {
      alert('Gagal: ' + data.message);
    }
    
  } catch (error) {
    console.error('Error:', error);
    alert('Terjadi kesalahan. Coba lagi.');
  }
}
```

---

#### 💡 Tips & Trik — `DELETE /api/roles/{id}`

1. **Jangan hapus role yang masih dipake user.** Cek dulu pake `GET /api/users/{user}/roles` atau liat di database. Kalo ada user yang masih punya role ini, mereka bakal kehilangan akses.

2. **Kasih konfirmasi 2 langkah.** Jangan cuma sekali konfirmasi. Minta user ngetik "HAPUS" atau "DELETE" buat konfirmasi. Ini mencegah kejadian "kecepetan klik".

3. **Super_admin ga bisa dihapus.** Jangan bingung kalo dapet error 400 pas hapus super_admin. Ini memang sengaja — safety. Tapi kamu bisa edit nama role super_admin kalo mau.

4. **Kalo ga sengaja hapus, bikin ulang.** Ga ada tombol "undo" buat hapus role. Tapi tenang, kamu tinggal panggil `POST /api/roles` buat bikin role baru dengan nama yang sama. Cuma relasi user-rolenya ilang — kamu harus assign ulang.

5. **Role yang dihapus ilang permanen.** Pastikan beneran mau dihapus. Karena data yang udah kehapus ga bisa dikembalikan (kecuali ada backup database).

---

### `GET /api/permissions` — Lihat Daftar Permission

📝 **Deskripsi:** Ambil daftar semua permission (izin) yang tersedia.

**Penjelasan Detail:**

Ini ibarat kamu liat **"katalog izin"** — semua hal yang bisa diizinin atau ga diizinin di aplikasi. Misal: izin buat liat peserta, izin buat nambah peserta, izin buat edit divisi, dan seterusnya.

Yang terjadi di balik layar:
1. Server ambil semua data dari tabel `permissions`
2. Data dikembalikan dalam bentuk array — sederhana, ga pake pagination karena biasanya permission ga banyak (paling 20-30)
3. Setiap permission punya ID (angka) sama nama (string)

**Pola penamaan permission** selalu `{aksi}-{resource}`:
| Aksi | Resource | Nama Permission | Artinya |
|---|---|---|---|
| view | users | `view-users` | Lihat daftar user |
| create | users | `create-users` | Buat user baru |
| edit | users | `edit-users` | Ubah data user |
| delete | users | `delete-users` | Hapus user |
| view | peserta | `view-peserta` | Lihat peserta |
| create | peserta | `create-peserta` | Tambah peserta |
| edit | peserta | `edit-peserta` | Edit peserta |
| delete | peserta | `delete-peserta` | Hapus peserta |

Bisa ditebak kan kalo ada `create-divisi` artinya izin buat bikin divisi? 😄

🔐 **Siapa yang bisa akses:** `super_admin`, `admin_oprec`

✅ **Response Sukses (200 — OK):**

```json
{
  "success": true,
  "data": [
    {"id": 1, "name": "view-users", "guard_name": "web"},
    {"id": 2, "name": "create-users", "guard_name": "web"},
    {"id": 3, "name": "edit-users", "guard_name": "web"},
    {"id": 4, "name": "delete-users", "guard_name": "web"},
    {"id": 5, "name": "view-peserta", "guard_name": "web"},
    {"id": 6, "name": "create-peserta", "guard_name": "web"},
    {"id": 7, "name": "edit-peserta", "guard_name": "web"},
    {"id": 8, "name": "delete-peserta", "guard_name": "web"}
  ]
}
```

**Penjelasan Setiap Field:**

**`data[].id: 1`** — ID unik permission. Dipake sebagai referensi di endpoint lain (misal pas assign permission ke role).

**`data[].name: "view-users"`** — Nama permission. Format `{aksi}-{resource}`. Yang penting: nama permission harus cocok dengan yang dicek di kode backend. Misal di controller ada kode `$this->authorize('view-peserta')` — maka permission `view-peserta` harus ada di database.

**`data[].guard_name: "web"`** — Guard. Selalu "web" di aplikasi kita.

> Pola penamaan permission biasanya: `{aksi}-{resource}`. Contoh: `view-peserta`, `create-divisi`, `delete-interview`. Gampang ditebak, kan?

---

#### 🧠 Apa yang Terjadi di Database? — `GET /api/permissions`

```sql
-- Query paling sederhana: ambil semua permission
SELECT id, name, guard_name FROM permissions ORDER BY id ASC;
```

--- 

#### 💻 Contoh Penggunaan di Frontend — `GET /api/permissions`

```javascript
async function fetchPermissions() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:8000/api/permissions', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Kelompokkin permission berdasarkan resource
    const grouped = {};
    data.data.forEach(perm => {
      const resource = perm.name.split('-').slice(1).join('-');
      if (!grouped[resource]) grouped[resource] = [];
      grouped[resource].push(perm);
    });
    
    console.log('Permission per resource:', grouped);
    // Hasil: { users: [...], peserta: [...], ... }
    
    return data.data;
  }
}

// Panggil:
// const allPermissions = await fetchPermissions();
```

---

#### 💡 Tips & Trik — `GET /api/permissions`

1. **Pake buat dynamic checkbox.** Pas bikin / edit role, tampilin semua permission sebagai daftar checkbox. Centang permission yang mau dikasih ke role. Data dari endpoint ini jadi sumber checkbox-nya.

2. **Kelompokkin berdasarkan resource.** Biar rapi, kelompokkin permission berdasarkan resource-nya. Misal semua permission `*-users` ditaro di grup "User Management", `*-peserta` di grup "Peserta", dan seterusnya.

3. **Permission ditambahin lewat database seeder.** Biasanya permission ga ditambah lewat API, tapi lewat file seeder Laravel (`database/seeders/`). Jadi endpoint ini cuma buat baca doang. Tapi kalo backend-nya nyediain endpoint buat tambah permission, bisa juga pake `POST /api/permissions`.

4. **Jangan ubah nama permission sembarangan.** Kalo nama permission berubah, kode backend yang ngecek permission itu bakal rusak. Ujung-ujungnya error 403 di mana-mana.

5. **Cache data permission.** Data permission jarang berubah (biasanya sekali diatur di awal project). Cache di frontend biar ga perlu fetch tiap kali.

---

### `POST /api/roles/{role}/permissions` — Kasih Permission ke Role

📝 **Deskripsi:** Memberikan satu atau beberapa permission ke sebuah role.

**Penjelasan Detail:**

Bayangin role "panitia" udah punya izin buat **lihat** peserta. Sekarang pengen dikasih izin juga buat **nambah** dan **edit** peserta. Daripada hapus role trus bikin ulang, kamu tinggal panggil endpoint ini buat **nambah** permission ke role yang udah ada.

Yang terjadi di balik layar:
1. Kamu kirim array ID permission ke server
2. Server cari role yang dimaksud (dari URL: `{role}` — ini ID role)
3. Server nambahin permission-permission itu ke role
4. **Penting:** Ini bersifat **tambah** (append), bukan replace. Permission yang udah ada sebelumnya tetep ada, cuma ditambah yang baru.

🔐 **Siapa yang bisa akses:** `super_admin`

📦 **Request Body:**

```json
{
  "permissions": [5, 6, 7]
}
```

| Field | Wajib? | Penjelasan |
|---|---|---|
| `permissions` | ✅ Wajib | Array ID permission yang mau ditambahin ke role |

> Array ini berisi ID-ID permission. Bisa 1, bisa banyak.

✅ **Response Sukses (200 — OK):**

```json
{
  "success": true,
  "message": "Permission berhasil diberikan ke role.",
  "data": {
    "role": "panitia",
    "permissions": ["view-peserta", "create-peserta", "edit-peserta"]
  }
}
```

**Penjelasan Field:**

**`data.role: "panitia"`** — Nama role yang dikasih permission.

**`data.permissions: ["view-peserta", "create-peserta", "edit-peserta"]`** — Daftar **nama** permission (bukan ID) yang sekarang dimiliki role. Ini ngebantu frontend buat nampilin "role panitia sekarang punya permission: view-peserta, create-peserta, edit-peserta".

---

#### 🧠 Apa yang Terjadi di Database? — `POST /api/roles/{role}/permissions`

```sql
-- Tambah relasi baru di tabel role_has_permissions
-- (kalo belum ada, kalo udah ada skip — ga dobel)
INSERT IGNORE INTO role_has_permissions (permission_id, role_id)
VALUES (5, 2), (6, 2), (7, 2);
```

`INSERT IGNORE` artinya: "coba masukin, kalo udah ada data yang sama, abaikan aja". Ini mencegah duplikasi.

---

#### 💻 Contoh Penggunaan di Frontend — `POST /api/roles/{role}/permissions`

```javascript
async function assignPermissionsToRole(roleId, permissionIds) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`http://localhost:8000/api/roles/${roleId}/permissions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ permissions: permissionIds })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    console.log('Permission berhasil ditambah:', data.data.permissions);
    return data.data;
  } else {
    console.error('Gagal:', data.message);
    throw new Error(data.message);
  }
}

// Panggil: tambah permission ID 5, 6, 7 ke role ID 2 (panitia)
// await assignPermissionsToRole(2, [5, 6, 7]);
```

---

#### 💡 Tips & Trik — `POST /api/roles/{role}/permissions`

1. **Beda sama PUT.** Kalo `PUT /api/roles/{id}` itu **replace semua** permission. Endpoint ini (POST) **nambah** permission tanpa ngilangin yang lama. Pilih sesuai kebutuhan.

2. **Cek permission yang udah dimiliki dulu.** Panggil `GET /api/roles/{id}` dulu buat liat permission yang udah ada. Biar ga ngasih permission yang udah dimiliki (walau `INSERT IGNORE` udah handle duplikasi).

3. **Permission ID vs Nama.** Di request body, kamu kirim array ID permission (angka). Tapi di response, baliknya nama permission (string). Jadi pastikan kamu ambil ID dari endpoint `GET /api/permissions`.

4. **Bisa kirim 1 permission aja.** Array permission isinya bisa 1 aja: `{"permissions": [5]}`. Ga harus banyak-banyak.

5. **Update UI setelah sukses.** Setelah berhasil, refresh daftar permission role di frontend biar user lihat perubahan.

---

### `POST /api/users/{user}/roles` — Kasih Role ke User

📝 **Deskripsi:** Memberikan role ke user tertentu.

**Penjelasan Detail:**

Ini endpoint buat **ngasih jabatan ke orang**. Bayangin lagi di organisasi: kamu selaku ketua (super_admin) nunjuk Budi jadi "Panitia". Caranya: panggil endpoint ini, kirim ID user Budi dan role "panitia", beres.

Yang terjadi di balik layar:
1. Server terima ID user (dari URL) dan array role (dari body)
2. Server cari user dengan ID itu
3. Server kasih role-role tersebut ke user
4. Dari detik itu, user Budi punya akses sesuai role yang dikasih

**Penting:** User bisa punya banyak role sekaligus. Misal Budi bisa jadi `panitia` sekaligus `interviewer`. Role-nya di-append (ditambah), bukan replace. Tapi kalo mau ganti total role user, perlu diatur di backend.

🔐 **Siapa yang bisa akses:** `super_admin`

📦 **Request Body:**

```json
{
  "roles": [1, 2]
}
```

Bisa juga kirim nama role langsung:

```json
{
  "roles": ["panitia", "interviewer"]
}
```

| Field | Wajib? | Penjelasan |
|---|---|---|
| `roles` | ✅ Wajib | Array ID role (angka) atau nama role (string) |

**Penjelasan Setiap Field:**

**`roles`** — Array yang isinya bisa ID role (angka) atau nama role (string). Fleksibel — dua-duanya diterima. Yang penting, role dengan ID/nama itu harus udah ada di database.

Contoh dengan ID: `{"roles": [1, 2]}` — kasih role ID 1 dan 2 ke user.
Contoh dengan nama: `{"roles": ["panitia", "interviewer"]}` — kasih role "panitia" dan "interviewer".

> Kamu bisa kirim array ID atau array nama role. API kita pinter kok, dua-duanya bisa diproses 😄

✅ **Response Sukses (200 — OK):**

```json
{
  "success": true,
  "message": "Role berhasil diberikan ke user.",
  "data": {
    "user_id": 1,
    "name": "Budi Santoso",
    "roles": ["panitia"]
  }
}
```

**Penjelasan Field:**

**`data.user_id: 1`** — ID user yang dikasih role.

**`data.name: "Budi Santoso"`** — Nama user — biar admin langsung liat "oh ini Budi yang dikasih role".

**`data.roles: ["panitia"]`** — Array role yang sekarang dimiliki user. Catatan: ini nampilin **semua** role yang dimiliki user, bukan cuma yang baru dikasih. Jadi kalo user sebelumnya udah punya role "interviewer", array-nya bakal `["interviewer", "panitia"]`.

---

#### 🧠 Apa yang Terjadi di Database? — `POST /api/users/{user}/roles`

```sql
-- Di kode, kurang lebih:
-- $user->assignRole('panitia');

-- Yang terjadi di database:
INSERT IGNORE INTO model_has_roles (role_id, model_type, model_id)
VALUES (2, 'App\\Models\\User', 1);
```

Tabel `model_has_roles` adalah tabel penghubung antara user dan role. Kolom `model_type` ngasih tahu ini punya model apa (di aplikasi kita: `App\Models\User`). Kolom `model_id` adalah ID user-nya.

---

#### 💻 Contoh Penggunaan di Frontend — `POST /api/users/{user}/roles`

```javascript
async function assignRolesToUser(userId, roles) {
  const token = localStorage.getItem('token');
  
  // roles bisa array of numbers atau array of strings
  const response = await fetch(`http://localhost:8000/api/users/${userId}/roles`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ roles })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    console.log(`${data.data.name} sekarang punya role:`, data.data.roles);
    return data.data;
  } else {
    console.error('Gagal:', data.message);
    throw new Error(data.message);
  }
}

// Contoh pake ID role:
// await assignRolesToUser(1, [2, 3]);

// Contoh pake nama role:
// await assignRolesToUser(1, ['panitia', 'interviewer']);
```

---

#### 💡 Tips & Trik — `POST /api/users/{user}/roles`

1. **Pake nama role di frontend.** Daripada pake ID (angka), di frontend lebih enak pake nama role (string) karena lebih deskriptif. Tapi pastikan nama role-nya bener — cek dulu pake `GET /api/roles`.

2. **Kasih multiple roles sekaligus.** Daripada panggil endpoint berkali-kali (sekali buat "panitia", sekali lagi buat "interviewer"), kirim aja langsung array-nya: `["panitia", "interviewer"]`.

3. **Role yang udah dimiliki ga perlu dikirim lagi.** Server pake `INSERT IGNORE`, jadi kalo role-nya udah ada, ga bakal duplikat. Tapi lebih efisien kalo cuma kirim role yang baru.

4. **User bisa punya 0 role.** Kalo user baru daftar, biasanya belum punya role sama sekali. Admin harus assign role secara manual lewat endpoint ini. Jadi jangan kaget kalo user baru login tapi ga bisa akses apa-apa — mereka belum dikasih role.

5. **Gunakan di halaman manajemen user.** Di halaman admin yang nampilin daftar user, tambahin fitur "Atur Role" yang panggil endpoint ini. User bisa milih role dari dropdown atau checkbox.

6. **Jangan lupa refresh data user.** Setelah assign role, kalo halaman profil user lagi terbuka, data role-nya masih yang lama. Suruh user refresh atau kasih notifikasi "Role berhasil diupdate".

## Peserta — Data Calon Anggota HMTI *(PIC: Nadil)*

### Penjelasan

Peserta adalah fitur inti dari aplikasi OpRec. Semua data mahasiswa yang mendaftar jadi calon anggota HMTI disimpan dan dikelola lewat fitur ini.

Setiap peserta punya data diri (nama, NIM, email, dll), pilihan divisi, status administrasi, dan status seleksi. Semua endpoint di grup ini butuh autentikasi (Bearer Token).

### ✏️ Tugas Nadil:

Tulis dokumentasi lengkap untuk 6 endpoint berikut. Format penulisan ikuti contoh dari grup **Autentikasi** milik Reyhan. Setiap endpoint harus mencakup:

- Method dan URI
- Deskripsi (1-2 kalimat + penjelasan analogi)
- Siapa yang bisa akses
- Request body (tabel + contoh JSON)
- Response sukses (contoh JSON)
- Response error (contoh JSON)

| Method | URI | Fungsi |
|--------|-----|--------|
| GET | /api/peserta | Lihat daftar semua peserta |
| POST | /api/peserta | Daftarkan peserta baru |
| GET | /api/peserta/{id} | Detail peserta |
| PUT | /api/peserta/{id} | Update data peserta |
| DELETE | /api/peserta/{id} | Hapus data peserta |
| POST | /api/peserta/{id}/upload | Upload dokumen persyaratan |

Mulai tulis di sini 👇

---

## Divisi — Wadah Minat dan Bakat *(PIC: Anton)*

### Penjelasan

Divisi adalah departemen/bidang di HMTI yang bisa dipilih peserta saat mendaftar. Setiap divisi punya nama, deskripsi, dan kuota (batas maksimal anggota).

Endpoint di grup ini dipakai admin buat mengelola divisi, dan peserta buat melihat pilihan divisi yang tersedia.

### ✏️ Tugas Anton:

Tulis dokumentasi lengkap untuk 5 endpoint berikut. Format penulisan ikuti contoh dari grup **Autentikasi** milik Reyhan.

| Method | URI | Fungsi |
|--------|-----|--------|
| GET | /api/divisi | Lihat daftar semua divisi |
| POST | /api/divisi | Buat divisi baru |
| GET | /api/divisi/{id} | Detail divisi + daftar peserta |
| PUT | /api/divisi/{id} | Update data divisi |
| DELETE | /api/divisi/{id} | Hapus divisi |

Mulai tulis di sini 👇

---

## Interview — Proses Ngobrol Langsung *(PIC: Anton)*

### Penjelasan

Interview adalah proses wawancara peserta yang sudah lolos seleksi administrasi. Panitia menjadwalkan interview, menentukan interviewer, lalu interviewer memberikan penilaian.

### ✏️ Tugas Anton:

Tulis dokumentasi lengkap untuk 6 endpoint berikut. Format penulisan ikuti contoh dari grup **Autentikasi** milik Reyhan.

| Method | URI | Fungsi |
|--------|-----|--------|
| GET | /api/interview | Lihat daftar jadwal interview |
| POST | /api/interview | Buat jadwal interview baru |
| GET | /api/interview/{id} | Detail jadwal interview |
| PUT | /api/interview/{id} | Update jadwal interview |
| DELETE | /api/interview/{id} | Hapus jadwal interview |
| POST | /api/interview/{id}/penilaian | Beri penilaian hasil interview |

Mulai tulis di sini 👇

---

## Pengumuman — Kabar Buat Semua *(PIC: Rizky)*

### Penjelasan

Panitia bisa membuat dan menerbitkan pengumuman — bisa berupa hasil seleksi, informasi jadwal, atau pengumuman umum lainnya.

Pengumuman punya dua status: `draft` (masih konsep) dan `published` (sudah ditayangkan).

### ✏️ Tugas Rizky:

Tulis dokumentasi lengkap untuk 5 endpoint berikut. Format penulisan ikuti contoh dari grup **Autentikasi** milik Reyhan.

| Method | URI | Fungsi |
|--------|-----|--------|
| GET | /api/pengumuman | Lihat daftar pengumuman |
| POST | /api/pengumuman | Buat pengumuman baru |
| GET | /api/pengumuman/{id} | Detail pengumuman |
| PUT | /api/pengumuman/{id} | Update pengumuman |
| DELETE | /api/pengumuman/{id} | Hapus pengumuman |

Mulai tulis di sini 👇

---

## Dashboard — 'Si Intisari' *(PIC: Reyhan)*

### Penjelasan Dulu ya 😊

Bayangin kamu jadi **ketua panitia OpRec**. Lagi ada rapat evaluasi sama pimpinan. Tiba-tiba ditanya:

**Pimpinan:** "Gimana perkembangan OpRec? Berapa total pendaftar? Yang lolos administrasi berapa? Yang ditolak berapa? Per divisi gimana sebarannya?"

Kalau kamu harus buka satu-satu data peserta dan ngitung manual pake Excel, bisa lama banget 😩. Belum lagi kalau ditanya data tambahan kayak "berapa yang udah di-interview?"

Nah, daripada ribet, kamu tinggal buka halaman **Dashboard**. Di situ langsung keliatan **semua statistik penting** dalam satu halaman. Kayak dasbor mobil: sekali liat, langsung tau kecepatan, bensin, suhu mesin — tanpa harus ngecek satu-satu.

**Dashboard itu ibarat "intisari" atau "ringkasan eksekutif" dari seluruh aplikasi.** Dengan satu panggilan API, kamu dapet:
- Angka-angka penting (total pendaftar, divisi, interview, dll)
- Breakdown per divisi (divisi mana yang paling banyak peminatnya)
- Breakdown status peserta (yang pending, lolos, ditolak)
- Aktivitas terbaru (siapa yang baru daftar, siapa yang baru di-interview)

Endpoint ini yang bakal dipanggil pas pertama kali admin buka aplikasi — untuk nampilin halaman utama dashboard.

---

### `GET /api/dashboard/stats` — Statistik Utama

📝 **Deskripsi:** Ambil data statistik buat dashboard.

**Penjelasan Detail:**

Ini endpoint paling "berisi" — dalam satu response, kamu dapet banyak data sekaligus. Bayangin kayak kamu minta **laporan mingguan** ke sekretaris, dan dia kasih 1 lembar kertas yang berisi semua angka penting. Ga perlu bolak-balik minta data.

Yang terjadi di balik layar:
1. Server nerima request `GET /api/dashboard/stats` dengan token
2. Server ngecek apakah user punya akses (super_admin, admin_oprec, atau panitia)
3. Server jalanin beberapa query ke database buat ngumpulin data:
   - Hitung total peserta
   - Hitung total divisi
   - Hitung total interview
   - Hitung peserta per divisi (GROUP BY)
   - Hitung peserta per status (GROUP BY)
   - Ambil 5-10 aktivitas terbaru dari log
4. Semua data digabung jadi satu response JSON

**Data apa aja yang didapet?**
| Data | Sumber | Cara Dapet |
|---|---|---|
| `total_pendaftar` | Tabel peserta | `COUNT(*)` |
| `total_divisi` | Tabel divisi | `COUNT(*)` |
| `total_interview` | Tabel interview | `COUNT(*)` |
| `total_peserta_lolos` | Tabel peserta | `COUNT(*) WHERE status = 'lolos'` |
| `total_pengumuman` | Tabel pengumuman | `COUNT(*)` |
| Per-divisi breakdown | Tabel peserta + divisi | `GROUP BY divisi_id` |
| Per-status breakdown | Tabel peserta | `GROUP BY status` |
| Aktivitas terbaru | Tabel log/aktivitas | `ORDER BY created_at DESC LIMIT 5` |

**Kapan endpoint ini dipake?**
- Pas admin buka halaman dashboard utama
- Buat nge-refresh data dashboard (tombol "Refresh" atau auto-refresh tiap 30 detik)
- Buat nampilin notifikasi "Selamat datang, ada 5 pendaftar baru hari ini"

🔐 **Siapa yang bisa akses:** `super_admin`, `admin_oprec`, `panitia` — semua level panitia bisa liat dashboard

✅ **Response Sukses (200 — OK):**

```json
{
  "success": true,
  "data": {
    "total_pendaftar": 50,
    "total_divisi": 5,
    "total_interview": 30,
    "total_peserta_lolos": 15,
    "total_pengumuman": 3,
    "statistik_pendaftar_per_divisi": [
      {
        "divisi": "Pengembangan Perangkat Lunak",
        "total": 25
      },
      {
        "divisi": "Jaringan dan Infrastruktur",
        "total": 15
      },
      {
        "divisi": "Multimedia",
        "total": 10
      }
    ],
    "statistik_status_pendaftar": {
      "pending": 10,
      "lolos_administrasi": 30,
      "lolos_interview": 15,
      "diterima": 10,
      "ditolak": 5
    },
    "aktivitas_terbaru": [
      {
        "aksi": "Pendaftaran baru",
        "deskripsi": "Citra Dewi mendaftar di divisi PPL",
        "waktu": "2026-07-16T10:00:00.000000Z"
      }
    ]
  }
}
```

**Penjelasan Setiap Field di Response:**

**`success: true`** — Request berhasil.

**`data.total_pendaftar: 50`** — Total semua peserta yang udah mendaftar OpRec. Angka 50 artinya dari awal pendaftaran dibuka, udah ada 50 orang yang daftar. Ini angka paling penting — kasih tau seberapa besar minat mahasiswa terhadap OpRec.

**`data.total_divisi: 5`** — Total divisi yang tersedia. Ada 5 divisi yang bisa dipilih peserta. Kalau angkanya 0, berarti belum ada divisi yang dibuat — admin harus bikin divisi dulu.

**`data.total_interview: 30`** — Total jadwal interview yang udah dibuat. Ini belum tentu berarti 30 orang di-interview — bisa aja 1 orang di-interview 2 kali (interview ulang). Tapi biasanya ini jumlah sesi interview.

**`data.total_peserta_lolos: 15`** — Total peserta yang lolos seleksi (entah itu lolos administrasi, lolos interview, atau diterima). Angka 15 artinya 15 orang dari 50 pendaftar berhasil melewati seleksi — berarti tingkat kelolosannya 30%.

**`data.total_pengumuman: 3`** — Total pengumuman yang udah diterbitkan. Bisa berupa pengumuman hasil seleksi, jadwal interview, atau informasi umum.

**`data.statistik_pendaftar_per_divisi`** — Array yang nampilin breakdown jumlah pendaftar per divisi. Berguna banget buat liat divisi mana yang paling populer:
- **Pengembangan Perangkat Lunak**: 25 orang (paling banyak — wajar, anak IF pasti banyak yang minat coding)
- **Jaringan dan Infrastruktur**: 15 orang
- **Multimedia**: 10 orang (paling sedikit)

Dari data ini, admin bisa ambil keputusan: "Wah, PPL kebanyakan peminat, mungkin perlu tambah kuota atau perketat seleksi."

**`data.statistik_status_pendaftar`** — Object yang nampilin jumlah peserta per status. Ini kayak pipeline seleksi:
- **`pending: 10`** — 10 orang masih nunggu diverifikasi administrasi. Mereka baru daftar, tapi belum dicek berkasnya.
- **`lolos_administrasi: 30`** — 30 orang udah lolos pengecekan berkas. Mereka berhak lanjut ke tahap interview.
- **`lolos_interview: 15`** — 15 orang udah di-interview dan lolos. Mereka masuk tahap akhir.
- **`diterima: 10`** — 10 orang udah resmi diterima jadi anggota HMTI. Selamat! 🎉
- **`ditolak: 5`** — 5 orang ditolak (gagal administrasi atau gagal interview).

Kalau dijumlah: 10 + 30 + 15 + 10 + 5 = 70. Kok lebih dari 50 (total_pendaftar)? Karena status itu akumulasi — seseorang bisa punya riwayat status. Misal: pending → lolos_administrasi → lolos_interview → diterima. Tergantung gimana implementasi backend-nya.

**`data.aktivitas_terbaru`** — Array aktivitas terbaru. Ini semacam **log kegiatan** yang nunjukin "apa yang baru terjadi?". Setiap item punya:
- **`aksi: "Pendaftaran baru"`** — Judul aktivitas. Misal: "Pendaftaran baru", "Interview selesai", "Pengumuman diterbitkan".
- **`deskripsi: "Citra Dewi mendaftar di divisi PPL"`** — Penjelasan detail aktivitas. Siapa yang ngapain.
- **`waktu: "2026-07-16T10:00:00.000000Z"`** — Kapan aktivitas itu terjadi. Bisa ditampilin sebagai "2 menit yang lalu" atau "16 Juli 2026".

---

#### 🧠 Apa yang Terjadi di Database? — `GET /api/dashboard/stats`

Endpoint ini ngelakuin **beberapa query sekaligus** (karena butuh data dari banyak tabel):

```sql
-- 1. Total pendaftar
SELECT COUNT(*) FROM peserta;

-- 2. Total divisi
SELECT COUNT(*) FROM divisi;

-- 3. Total interview
SELECT COUNT(*) FROM interview;

-- 4. Total peserta lolos
SELECT COUNT(*) FROM peserta WHERE status IN ('lolos_administrasi', 'lolos_interview', 'diterima');

-- 5. Total pengumuman
SELECT COUNT(*) FROM pengumuman;

-- 6. Breakdown per divisi
SELECT d.nama AS divisi, COUNT(p.id) AS total
FROM divisi d
LEFT JOIN peserta p ON p.divisi_id = d.id
GROUP BY d.id, d.nama;

-- 7. Breakdown per status
SELECT status, COUNT(*) AS total
FROM peserta
GROUP BY status;

-- 8. Aktivitas terbaru
SELECT aksi, deskripsi, created_at AS waktu
FROM aktivitas
ORDER BY created_at DESC
LIMIT 5;
```

Tabel yang terlibat: **peserta, divisi, interview, pengumuman, aktivitas** (kurang lebih).

---

#### 💻 Contoh Penggunaan di Frontend — `GET /api/dashboard/stats`

```javascript
async function fetchDashboardStats() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:8000/api/dashboard/stats', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  const data = await response.json();
  
  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.message);
  }
}

// Contoh render di React:
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDashboardStats()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="dashboard">
      {/* Kartu Statistik */}
      <div className="stats-grid">
        <StatCard title="Total Pendaftar" value={stats.total_pendaftar} />
        <StatCard title="Total Divisi" value={stats.total_divisi} />
        <StatCard title="Total Interview" value={stats.total_interview} />
        <StatCard title="Peserta Lolos" value={stats.total_peserta_lolos} />
      </div>
      
      {/* Grafik per Divisi */}
      <ChartPerDivisi data={stats.statistik_pendaftar_per_divisi} />
      
      {/* Status Pipeline */}
      <StatusPipeline data={stats.statistik_status_pendaftar} />
      
      {/* Aktivitas Terbaru */}
      <AktivitasTerbaru data={stats.aktivitas_terbaru} />
    </div>
  );
}
```

---

#### 💡 Tips & Trik — `GET /api/dashboard/stats`

1. **Panggil pas halaman dashboard dimuat.** Endpoint ini harus dipanggil pertama kali pas admin buka dashboard. Di React, panggil di `useEffect` atau `componentDidMount`.

2. **Auto-refresh secara periodik.** Biar data dashboard selalu up-to-date, set auto-refresh tiap 30-60 detik. Pake `setInterval`:
   ```javascript
   useEffect(() => {
     fetchStats();
     const interval = setInterval(fetchStats, 30000); // tiap 30 detik
     return () => clearInterval(interval);
   }, []);
   ```

3. **Tampilin data secara visual.** Jangan cuma nampilin angka doang. `statistik_pendaftar_per_divisi` cocok buat bar chart atau pie chart. `statistik_status_pendaftar` cocok buat pipeline/funnel chart. Pake library kayak Chart.js atau Recharts.

4. **Loading state penting.** Karena endpoint ini ngelakuin banyak query, response-nya bisa lebih lambat dari endpoint lain. Kasih skeleton loading atau spinner biar user tau "lagi loading".

5. **Error handling.** Kalau dashboard gagal load, jangan langsung kosong. Tampilin pesan error yang jelas dan tombol "Coba Lagi".

6. **Manfaatin data aktivitas terbaru.** Data ini bagus buat nampilin "notifikasi realtime" di pojok layar. Misal: "Citra Dewi baru aja mendaftar" muncul sebagai toast notification.

7. **Data per-divisi bisa dipake buat keputusan strategis.** Kalau satu divisi kebanyakan peminat, admin bisa nambah kuota atau nambah sesi interview. Kalau ada divisi yang sepi peminat, admin bisa promosiin divisi itu.

---

#### 📊 Cara Baca Data Dashboard — Contoh Skenario

Misal datanya kayak gini:
```
total_pendaftar: 50
total_divisi: 5
statistik_status: pending 10, lolos_admin 30, lolos_interview 15, diterima 10, ditolak 5
```

**Apa yang bisa disimpulkan?**
1. **Tingkat partisipasi:** Dari 50 pendaftar, baru 10 yang diterima. Artinya seleksi masih berjalan.
2. **Bottleneck administrasi:** Ada 10 orang masih pending — berarti admin perlu cepet verifikasi berkas mereka.
3. **Tingkat kegagalan:** 5 orang ditolak dari 50 pendaftar = 10% gagal. Wajar.
4. **Sisa kuota:** Kalau target penerimaan 20 orang, berarti masih butuh 10 orang lagi.

Ini gunanya dashboard: **kamu bisa ambil keputusan cuma dari 1 laporan, tanpa buka data satu-satu.**

## Kode Error — Bahasa Sindiran Server

### Penjelasan Dulu ya 😊

Kadang pas lagi nyobain API, tiba-tiba dapet response yang isinya error. Jangan panik! Itu cuma cara server bilang "ada yang salah nih".

Ini dia daftar kode error yang mungkin muncul:

| Kode | Nama | Artinya |
|---|---|---|
| **200** | OK | ✅ Sukses! Request berhasil diproses |
| **201** | Created | ✅ Berhasil dibuat! Data baru tersimpan |
| **400** | Bad Request | ❌ Data yang dikirim salah atau ada aturan yang dilanggar |
| **401** | Unauthorized | ❌ Kamu belum login, atau token salah/kedaluwarsa |
| **403** | Forbidden | ❌ Kamu udah login, tapi rolenya ga punya akses |
| **404** | Not Found | ❌ Data yang dicari ga ada (salah ID atau udah dihapus) |
| **422** | Unprocessable | ❌ Data yang dikirim ga lolos validasi (lupa isi field wajib, dll) |
| **429** | Too Many Requests | ❌ Kamu nge-spam! Tunggu bentar ya |
| **500** | Internal Server Error | ❌ Error di server (biasanya masalah coding, lapor admin) |

### Format Error Standar

Semua error di API kita bentuknya JSON, jadi gampang diparse di kode frontend.

**Error Validasi (422) — Biasanya karena lupa isi field atau format salah:**

```json
{
  "message": "Validasi gagal.",
  "errors": {
    "field": ["Pesan error 1", "Pesan error 2"]
  }
}
```

Contoh: kalau `email` diisi dengan teks yang bukan email, field `email` bakal muncul dengan pesan error.

**Error Otorisasi (403) — Udah login tapi ga punya akses:**

```json
{
  "message": "Forbidden. Anda tidak memiliki akses ke resource ini."
}
```

**Error Not Found (404) — Data ga ketemu:**

```json
{
  "message": "Resource tidak ditemukan."
}
```

**Error Server (500) — Ada yang error di backend:**

```json
{
  "message": "Terjadi kesalahan pada server. Silakan coba lagi."
}
```

> Kalau dapet error 500, jangan panik 🙂 Lapor ke developer backend (biasanya ada typo atau bug di kode).

---

## Rate Limiting — Jangan Nge-Spam Ya

### Penjelasan Dulu ya 😊

**Rate limiting** itu batasan jumlah request yang bisa kamu kirim dalam waktu tertentu. Ibaratnya di restoran: kamu ga bisa teriak "MAS! MAS! MAS!" 100 kali dalam 1 menit. Pelayan bakal bilang "sabar kak, antri ya".

Di aplikasi kita, rate limiting dipake biar ga ada yang iseng nge-spam API dengan request bertubi-tubi.

| Endpoint | Maks Request | Dalam Waktu |
|---|---|---|
| `POST /api/login` | 5 kali | 1 menit |
| `POST /api/register` | 3 kali | 1 menit |
| Semua endpoint lain (wajib login) | 60 kali | 1 menit |

Jadi kalau kamu lagi testing dan tiba-tiba dapet response error 429, istirahat dulu bentar. Ambil kopi, napas, 1 menit lagi bisa nyoba lagi 😄

<!-- VERIFY: Nilai rate limit dapat disesuaikan melalui konfigurasi di `app/Http/Kernel.php` atau `RouteServiceProvider`. -->

### Response Rate Limit (429):

```json
{
  "message": "Terlalu banyak permintaan. Silakan coba lagi dalam 60 detik."
}
```

---

## Catatan Implementasi — Buat yang Ngoding Backend

### Penjelasan Dulu ya 😊

Bagian ini khusus buat anggota tim yang ngerjain **backend Laravel**. Santai aja kalau kamu frontend, ga perlu terlalu dipikirin. Tapi kalau penasaran, boleh juga dibaca sebagai pengetahuan umum.

### Package yang Harus Diinstal

Pastikan **Sanctum** (buat autentikasi token) dan **Spatie Laravel Permission** (buat role & permission) udah terinstal. Jalankan perintah ini di folder `backend/`:

```bash
composer require laravel/sanctum
composer require spatie/laravel-permission
```

> Kalau belum ada di `composer.json`, ini bakal nambahin otomatis.

### Konfigurasi Route

Semua route API harus ditempatkan di file **`backend/routes/api.php`**. Untuk endpoint yang butuh login, pake middleware **`auth:sanctum`**.

### Contoh Struktur Route

```php
<?php
// backend/routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\PesertaController;
use App\Http\Controllers\Api\DivisiController;
use App\Http\Controllers\Api\InterviewController;
use App\Http\Controllers\Api\PengumumanController;
use App\Http\Controllers\Api\DashboardController;

// === PUBLIK (Tidak Perlu Token) ===
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// === PROTECTED (Butuh Token) ===
Route::middleware('auth:sanctum')->group(function () {

    // ── Auth ──
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // ── Roles & Permissions ──
    Route::apiResource('roles', RoleController::class);
    Route::get('permissions', [PermissionController::class, 'index']);
    Route::post('roles/{role}/permissions', [RoleController::class, 'assignPermissions']);
    Route::post('users/{user}/roles', [RoleController::class, 'assignRoleToUser']);

    // ── Peserta ──
    Route::apiResource('peserta', PesertaController::class);
    Route::post('peserta/{peserta}/upload', [PesertaController::class, 'uploadDokumen']);

    // ── Divisi ──
    Route::apiResource('divisi', DivisiController::class);

    // ── Interview ──
    Route::apiResource('interview', InterviewController::class);
    Route::post('interview/{interview}/penilaian', [InterviewController::class, 'beriPenilaian']);

    // ── Pengumuman ──
    Route::apiResource('pengumuman', PengumumanController::class);

    // ── Dashboard ──
    Route::get('dashboard/stats', [DashboardController::class, 'stats']);
});
```

> **Tips:** `Route::apiResource` itu fitur keren Laravel yang otomatis bikin 5 route sekaligus (index, store, show, update, destroy) dari 1 baris kode. Hemat banget!

---

## Tips Tambahan Buat Pemula 🎯

1. **Testing API** — Kalau mau nyoba-nyoba endpoint tanpa nulis kode dulu, bisa pake **Postman** atau **Thunder Client** (extension VSCode). Tinggal isi URL, method, header, dan body. Gampang!

2. **Error 401 terus?** — Cek lagi header `Authorization: Bearer {token}`. Mungkin tokennya lupa dikasih, atau tokennya udah kedaluwarsa (logout).

3. **Error 422 terus?** — Cek field yang dikirim. Mungkin ada field wajib yang lupa, atau formatnya salah (misal kirim teks ke field yang harusnya angka).

4. **Error 500?** — Tenang, itu bukan salah kamu. Bilang ke developer backend aja 😄

5. **Base URL salah?** — Pastikan backend Laravel udah jalan (`php artisan serve`). Kalau belum, endpoint ga bakal bisa diakses.

---

## Ringkasan Cepat — Semua Endpoint dalam Satu Tabel 📋

| Method | Endpoint | Auth | Role | Fungsi |
|---|---|---|---|---|
| POST | `/api/register` | ❌ | Semua | Daftar akun baru |
| POST | `/api/login` | ❌ | Semua | Login |
| POST | `/api/logout` | ✅ | Semua | Logout |
| GET | `/api/user` | ✅ | Semua | Lihat profil sendiri |
| GET | `/api/roles` | ✅ | super_admin, admin_oprec | Daftar role |
| POST | `/api/roles` | ✅ | super_admin | Buat role baru |
| GET | `/api/roles/{id}` | ✅ | super_admin, admin_oprec | Detail role |
| PUT | `/api/roles/{id}` | ✅ | super_admin | Update role |
| DELETE | `/api/roles/{id}` | ✅ | super_admin | Hapus role |
| GET | `/api/permissions` | ✅ | super_admin, admin_oprec | Daftar permission |
| POST | `/api/roles/{role}/permissions` | ✅ | super_admin | Kasih permission ke role |
| POST | `/api/users/{user}/roles` | ✅ | super_admin | Kasih role ke user |
| GET | `/api/peserta` | ✅ | super_admin, admin_oprec, panitia | Daftar peserta |
| POST | `/api/peserta` | ✅ | peserta / admin | Daftarkan peserta |
| GET | `/api/peserta/{id}` | ✅ | admin / peserta sendiri | Detail peserta |
| PUT | `/api/peserta/{id}` | ✅ | admin / peserta sendiri | Update peserta |
| DELETE | `/api/peserta/{id}` | ✅ | super_admin, admin_oprec | Hapus peserta |
| POST | `/api/peserta/{id}/upload` | ✅ | peserta / admin | Upload dokumen |
| GET | `/api/divisi` | ✅ | Semua | Daftar divisi |
| POST | `/api/divisi` | ✅ | super_admin, admin_oprec | Buat divisi |
| GET | `/api/divisi/{id}` | ✅ | Semua | Detail divisi |
| PUT | `/api/divisi/{id}` | ✅ | super_admin, admin_oprec | Update divisi |
| DELETE | `/api/divisi/{id}` | ✅ | super_admin, admin_oprec | Hapus divisi |
| GET | `/api/interview` | ✅ | admin, panitia, interviewer | Daftar interview |
| POST | `/api/interview` | ✅ | super_admin, admin_oprec, panitia | Buat jadwal interview |
| GET | `/api/interview/{id}` | ✅ | admin, interviewer | Detail interview |
| PUT | `/api/interview/{id}` | ✅ | super_admin, admin_oprec, panitia | Update jadwal |
| DELETE | `/api/interview/{id}` | ✅ | super_admin, admin_oprec | Hapus jadwal |
| POST | `/api/interview/{id}/penilaian` | ✅ | interviewer, admin | Beri penilaian |
| GET | `/api/pengumuman` | ✅ | Semua | Daftar pengumuman |
| POST | `/api/pengumuman` | ✅ | admin, panitia | Buat pengumuman |
| GET | `/api/pengumuman/{id}` | ✅ | Semua | Detail pengumuman |
| PUT | `/api/pengumuman/{id}` | ✅ | admin, panitia | Update pengumuman |
| DELETE | `/api/pengumuman/{id}` | ✅ | super_admin, admin_oprec | Hapus pengumuman |
| GET | `/api/dashboard/stats` | ✅ | admin, panitia | Statistik dashboard |

---

> **Selamat!** Kamu udah baca seluruh dokumentasi API SIMAHATI OpRec 🎉
>
> Mungkin pertama baca kelihatan panjang banget dan bikin pusing. Tapi tenang aja — pelan-pelan nanti juga paham sendiri pas praktek langsung. Setiap programmer pemula juga ngalamin hal yang sama.
>
> Kalau ada yang bingung, tanya aja sama temen tim atau lead developer. Ingat: **satu-satunya pertanyaan bodoh adalah pertanyaan yang tidak ditanyakan** 👍
>
> *Dokumen ini terakhir diperbarui: Juli 2026*

---

↩️ **[Kembali ke: DATABASE.md](DATABASE.md)** — Skema database ➡️ **[Lanjut ke: role/README.md](../role/README.md)** — Pembagian tugas tim