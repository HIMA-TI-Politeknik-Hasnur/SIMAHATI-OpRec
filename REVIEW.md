# Code Review Report — Feature Divisi-Interview (Anton)

**Reviewed:** 2026-07-20T12:00:00Z
**Depth:** standard
**Files Reviewed:** 26
**Status:** issues_found

---

## Ringkasan

Review menyeluruh terhadap fitur manajemen divisi, penjadwalan interview, dan penilaian oleh Anton. Terdapat **3 BLOCKER** (security & correctness) dan **6 WARNING** (kualitas & robustness). Masalah paling kritis adalah **tidak ada autentikasi** pada seluruh route API dan **foreign key ke tabel yang belum ada**.

| Area | Rating |
|------|--------|
| Backend / API | ❌ **BERMASALAH** — Tidak ada auth middleware, FK ke tabel belum ada, `Auth::id()` null |
| Frontend / UI | ⚠️ **PERLU PERBAIKAN** — URL hardcoded, empty catch blocks, ID-only display |
| Docs | ⚠️ **PERLU PERBAIKAN** — Dokumentasi tidak sesuai implementasi (auth, role) |

---

## Critical Issues

### CR-01: Seluruh API Route Tidak Dilindungi Authentication Middleware

**File:** `backend/routes/api.php:28-30`
**Issue:** Tidak ada middleware `auth:sanctum` pada route group Anton. Seluruh endpoint (`divisi`, `interview`, `penilaian`) dapat diakses tanpa login. API.md mendokumentasikan pembatasan role-based access (`super_admin`, `admin_oprec`, `interviewer`, dll.) tetapi implementasi tidak menerapkannya. Ini adalah **security vulnerability** tingkat tinggi — siapa pun bisa CREATE, UPDATE, DELETE data tanpa autentikasi.

**Fix:**
```php
// backend/routes/api.php

Route::middleware('auth:sanctum')->group(function () {
    // As per Anton's assignment:
    Route::apiResource('divisi', DivisiController::class);
    Route::apiResource('interview', InterviewController::class);
    Route::post('interview/{interview}/penilaian', [InterviewController::class, 'beriPenilaian']);
});
```

---

### CR-02: `Auth::id()` Returns `null` Karena Tidak Ada Auth Middleware → SQL Constraint Violation

**File:** `backend/app/Http/Controllers/Api/InterviewController.php:99`
**Issue:** Method `beriPenilaian()` menggunakan `Auth::id()` untuk mengisi kolom `interviewer_id` di tabel `penilaians`. Karena tidak ada middleware `auth:sanctum`, `Auth::id()` selalu mengembalikan `null`. Kolom `interviewer_id` di migration didefinisikan sebagai `foreignId(...)` yang secara default **NOT NULL** (`$table->foreignId('interviewer_id')` setara dengan `unsignedBigInteger + NOT NULL`). Akibatnya, request POST `/interview/{id}/penilaian` akan selalu gagal dengan SQL error: *"Column 'interviewer_id' cannot be null"*.

**Fix (dua opsi, opsi 1 lebih baik):**
1. Tambahkan middleware auth di routes (lihat CR-01) — `Auth::id()` akan mengembalikan ID user yang login.
2. Atau fallback: jadikan kolom nullable dan tambahkan validasi manual, tapi ini tidak disarankan karena menghilangkan integritas data.

```php
// Opsi 2 (hanya jika auth benar-benar tidak bisa dipasang):
// migration: ubah jadi nullable
$table->foreignId('interviewer_id')->nullable()->constrained('users')->nullOnDelete();
```

---

### CR-03: Migration `interviews` Mereferensi Tabel `peserta` yang Belum Ada

**File:** `backend/database/migrations/2026_07_18_171219_create_interviews_table.php:16`
**Issue:** Migration `create_interviews_table` memiliki foreign key `$table->foreignId('peserta_id')->constrained('peserta')` yang mereferensi tabel `peserta`. Namun, **tidak ada migration untuk tabel `peserta`** di direktori migrations. Menjalankan `php artisan migrate` akan gagal dengan error: *"Table 'peserta' doesn't exist"*. Fitur ini tidak dapat di-deploy atau di-test karena skema database tidak komplet.

**Fix:** Buat migration tabel `peserta` terlebih dahulu, atau (jika tabel peserta memang belum siap/tugas anggota tim lain) buat foreign key-nya nullable dan opsional:
```php
// Opsi sementara: jadikan nullable agar migration tidak gagal
$table->foreignId('peserta_id')->nullable()->constrained('peserta')->nullOnDelete();
```
Namun solusi jangka panjang tetap harus membuat tabel `peserta`.

---

## Warnings

### WR-01: Tidak Ada Unique Constraint pada `interview_id` di Tabel `penilaians`

**File:** `backend/database/migrations/2026_07_18_171231_create_penilaians_table.php`
**Issue:** Method `beriPenilaian()` menggunakan `Penilaian::updateOrCreate(['interview_id' => $interview->id], ...)` yang mengandalkan bahwa setiap interview hanya memiliki satu penilaian. Namun, migration tabel `penilaians` **tidak mendefinisikan unique constraint** pada kolom `interview_id`. Dalam kondisi konkurensi (dua request bersamaan), baris duplikat bisa tercipta untuk interview yang sama.

**Fix:**
```php
// migration: tambah unique constraint
$table->foreignId('interview_id')->constrained('interviews')->onDelete('cascade')->unique();
// atau setelah create table:
Schema::table('penilaians', function (Blueprint $table) {
    $table->unique('interview_id');
});
```

---

### WR-02: URL API Backend Hardcoded di Seluruh Frontend

**File:** Semua file frontend berikut:
- `frontend/src/pages/DashboardDivisi.tsx:22`
- `frontend/src/pages/DivisiPage.tsx:25`
- `frontend/src/pages/DivisiDetailPage.tsx:30`
- `frontend/src/pages/InterviewPage.tsx:35`
- `frontend/src/pages/PenilaianPage.tsx:38`

**Issue:** URL `http://localhost:8000/api` di-hardcode di setiap component/page. Jika backend di-deploy ke server production dengan domain berbeda, semua URL harus diganti satu per satu. Ini juga menyulitkan developer lain yang mungkin menggunakan port berbeda.

**Fix:**
```typescript
// Buat file konfigurasi, misal frontend/src/config.ts
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Atau pakai proxy (recommended):
// vite.config.ts
export default defineConfig({
  server: { proxy: { '/api': 'http://localhost:8000' } }
});
// lalu di kode cukup panggil:
fetch('/api/divisi');
```

---

### WR-03: Empty Catch Block Menelan Error dalam Mode Produksi

**File:** `frontend/src/pages/DashboardDivisi.tsx:54-56`
**Issue:** Blok `catch` di line 54-56 benar-benar kosong — error ditelan tanpa logging atau user feedback. Jika endpoint peserta gagal, tidak ada indikasi ke user.

```typescript
} catch {
  // endpoint peserta belum tersedia (tugas Nadil)
}
```

**Fix:**
```typescript
} catch (err) {
  console.warn('[DashboardDivisi] Gagal memuat data peserta:', err);
  // Optional: tampilkan toast/notification non-intrusive
}
```

---

### WR-04: Method `destroy` di DivisiController Tidak Memeriksa Relasi

**File:** `backend/app/Http/Controllers/Api/DivisiController.php:63-71`
**Issue:** Menghapus divisi tanpa memeriksa apakah ada peserta atau interview yang masih mereferensi divisi tersebut. Jika ada foreign key dari tabel lain (peserta yang memilih divisi ini, atau interview), database akan throw FK constraint error dan user mendapat response 500 tanpa pesan yang jelas.

**Fix:**
```php
public function destroy(Divisi $divisi)
{
    // Cek apakah ada peserta yang masih memilih divisi ini
    // (asumsi ada kolom pilihan_divisi_id atau sejenisnya)
    if ($divisi->peserta()->exists()) {
        return response()->json([
            'success' => false,
            'message' => 'Divisi tidak bisa dihapus karena masih ada peserta yang memilihnya.',
        ], 409);
    }
    
    $divisi->delete();
    return response()->json([
        'success' => true,
        'message' => 'Divisi berhasil dihapus.'
    ]);
}
```

---

### WR-05: Tabel Interview Menampilkan ID (Angka) Bukan Nama Peserta

**File:** `frontend/src/pages/InterviewPage.tsx:272`
**Issue:** Kolom "Peserta" hanya menampilkan `#{iv.peserta_id}` (angka ID). User tidak bisa melihat siapa nama peserta yang dijadwalkan interview tanpa membuka referensi lain. Demikian pula, tidak ada data interviewer selain ID yang ditampilkan.

**Fix:**
```typescript
// Pastikan endpoint interview mengembalikan data peserta via relasi
// dan tampilkan nama:
<td>#{iv.peserta_id}</td>
// bisa diubah menjadi:
<td>{iv.peserta?.nama_lengkap ?? `#${iv.peserta_id}`}</td>
```

InterviewController juga perlu diupdate untuk me-load relasi peserta:
```php
// InterviewController.php index()
$interviews = Interview::with(['interviewer:id,name', 'peserta:id,nama_lengkap', 'penilaian'])
    ->orderBy('tanggal')->orderBy('waktu')->get();
```

---

### WR-06: Dokumentasi API Tidak Sesuai Implementasi (Auth & Roles)

**File:** `docs/API.md` (seluruh section Divisi & Interview)
**Issue:** API.md mendokumentasikan persyaratan role-based access yang detail (misal: `POST /api/divisi` hanya untuk `super_admin` dan `admin_oprec`), tetapi implementasi backend tidak memiliki middleware auth atau role-checking sama sekali. Dokumen juga menampilkan kode contoh dengan `Route::middleware('auth:sanctum')->group(function () { ... })` yang tidak ada di `routes/api.php` yang sebenarnya. Ini menyesatkan developer yang membaca docs sebagai referensi.

**Fix:** Sinkronkan docs dengan implementasi, atau implementasi dengan docs. Jika ini UAS/tugas kuliah, minimal beri catatan di docs bahwa auth belum diterapkan.

---

## Info

### IN-01: CSS `position: relative` Didefinisikan Setelah Pseudo-element `::after`

**File:** `frontend/src/components/Calendar.css:82-93`
**Issue:** Aturan `.calendar-cell.has-event::after` (line 82) menggunakan `position: absolute` yang membutuhkan elemen parent sebagai positioning anchor. Anchor `.calendar-cell { position: relative }` baru didefinisikan di line 93. Meskipun CSS tetap berfungsi (properti independen), urutan ini membingungkan dan rawan error jika ada refaktor.

**Fix:**
```css
/* Pindahkan .calendar-cell base rule SEBELUM pseudo-element rule */
.calendar-cell { position: relative; }

.calendar-cell.has-event::after {
  content: '';
  display: block;
  width: 4px;
  height: 4px;
  background: #ea580c;
  border-radius: 50%;
  position: absolute;
  bottom: 3px;
}
```

---

### IN-02: Nilai `kuota` Tidak Tervalidasi di Frontend Saat Edit

**File:** `frontend/src/pages/DivisiPage.tsx:129-136`
**Issue:** Input `kuota` menerima angka apa pun yang >= 1. Namun tidak ada validasi bahwa kuota baru tidak boleh kurang dari jumlah peserta yang sudah terdaftar di divisi tersebut. Jika admin mengubah kuota dari 10 menjadi 3 padahal sudah ada 8 pendaftar, bar progress menampilkan >100%.

**Fix:** Tambahkan validasi di backend (minimal peringatan) dan frontend.

---

## Ringkasan Penilaian

| Area | Rating | Alasan |
|------|--------|--------|
| **Backend / API** | ❌ BERMASALAH | CR-01, CR-02, CR-03 — auth hilang, SQL error, migration gagal |
| **Frontend / UI** | ⚠️ PERLU PERBAIKAN | WR-02, WR-03, WR-05 — URL hardcoded, error silent, UX kurang |
| **Docs** | ⚠️ PERLU PERBAIKAN | WR-06 — dokumentasi tidak sinkron dengan implementasi |

### 3 Temuan Paling Penting

1. **🔴 CR-01 + CR-02 — Auth middleware hilang → Auth::id() null → SQL error** — Kombinasi ini membuat endpoint penilaian benar-benar tidak bisa digunakan. Priority mutlak untuk diperbaiki.

2. **🔴 CR-03 — Migration gagal karena FK ke tabel `peserta` yang belum ada** — Seluruh fitur tidak bisa di-deploy karena database tidak bisa dimigrasi. Butuh koordinasi dengan PIC peserta (Nadil).

3. **🟡 WR-01 — Race condition updateOrCreate tanpa unique constraint** — Risiko data korup di produksi walau jarang terjadi.

---

_Reviewed: 2026-07-20T12:00:00Z_
_Reviewer: gsd-code-reviewer_
_Depth: standard_
