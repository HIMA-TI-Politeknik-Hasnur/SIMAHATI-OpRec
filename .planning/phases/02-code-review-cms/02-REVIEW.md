---
phase: 02-code-review-cms
reviewed: 2026-07-20T10:00:00Z
depth: standard
files_reviewed: 32
files_reviewed_list:
  - backend/app/Http/Controllers/Api/FaqController.php
  - backend/app/Http/Controllers/Api/NotificationController.php
  - backend/app/Http/Controllers/Api/PengumumanController.php
  - backend/app/Http/Controllers/Api/ReportController.php
  - backend/app/Http/Controllers/Api/SettingController.php
  - backend/app/Http/Controllers/Api/TimelineController.php
  - backend/app/Models/Faq.php
  - backend/app/Models/Pengumuman.php
  - backend/app/Models/Setting.php
  - backend/app/Models/Timeline.php
  - backend/database/migrations/2026_07_17_000001_create_pengumuman_table.php
  - backend/database/migrations/2026_07_17_000002_create_notifications_table.php
  - backend/database/migrations/2026_07_17_000003_create_timeline_table.php
  - backend/database/migrations/2026_07_17_000004_create_faq_table.php
  - backend/database/migrations/2026_07_17_000005_create_settings_table.php
  - backend/routes/api.php
  - frontend/src/App.tsx
  - frontend/src/components/Accordion.tsx
  - frontend/src/components/Accordion.css
  - frontend/src/components/AnnouncementCard.tsx
  - frontend/src/components/AnnouncementCard.css
  - frontend/src/components/NotificationCard.tsx
  - frontend/src/components/NotificationCard.css
  - frontend/src/components/Timeline.tsx
  - frontend/src/components/Timeline.css
  - frontend/src/pages/CmsPanel.tsx
  - frontend/src/pages/CmsPanel.css
  - frontend/src/pages/Dashboard.tsx
  - frontend/src/pages/Dashboard.css
  - frontend/src/pages/LandingPage.tsx
  - frontend/src/pages/LandingPage.css
findings:
  critical: 4
  warning: 5
  info: 2
  total: 11
status: issues_found
---

# Code Review Report: Feature CMS Landing Page

**Reviewed:** 2026-07-20T10:00:00Z
**Depth:** standard
**Files Reviewed:** 32 (backend: 16, frontend: 16)
**Status:** ❌ issues_found

## Ringkasan

Review dilakukan pada merge commit `9bddae7` (branch `feature/cms-landing-page`, author: Rizky) yang mencakup 32 file dengan total +1988 baris. Fitur ini menambahkan backend API CMS (FAQ, Pengumuman, Timeline, Settings, Notifications, Report) dan frontend pages (LandingPage, Dashboard, CmsPanel) beserta komponen pendukung.

### Rating Area

| Area | Rating | Catatan |
|------|--------|---------|
| **Backend / API** | ❌ **BERMASALAH** | Tidak ada autentikasi middleware di routes, stored XSS di report PDF, method controller tidak lengkap |
| **Frontend / UI** | ⚠️ **PERLU PERBAIKAN** | Dummy data (wajar untuk preview), struktur komponen rapi, tetapi routing export kaku |
| **Migrations / DB** | ✅ **BAIK** | Struktur tabel sesuai, foreign key dan index terdefinisi dengan baik |

---

## Critical Issues

### CR-01: Tidak Ada Authentication Middleware di Semua API Routes

**File:** `backend/routes/api.php`
**Issue:** Semua endpoint API — termasuk create, update, delete FAQ/Pengumuman/Timeline/Settings — tidak dilindungi middleware autentikasi (`auth:sanctum` atau `auth:api`). Siapa pun yang mengetahui URL endpoint bisa memodifikasi data secara bebas.

```php
// Semua route di bawah public — tanpa middleware auth
Route::apiResource('pengumuman', PengumumanController::class);
Route::apiResource('faq', FaqController::class);
Route::apiResource('settings', SettingController::class);
```

Hanya `NotificationController` yang melakukan pengecekan manual (`Auth::user()`) — tetapi 4 controller CRUD lainnya sama sekali tidak memverifikasi pengguna.

**Fix:**
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('pengumuman', PengumumanController::class)->except(['index', 'show']);
    Route::apiResource('timeline', TimelineController::class)->except(['index', 'show']);
    Route::apiResource('faq', FaqController::class)->except(['index', 'show']);
    Route::apiResource('settings', SettingController::class)->except(['index', 'show']);
    // dst
});

// Read-only endpoints bisa public
Route::apiResource('pengumuman', PengumumanController::class)->only(['index', 'show']);
Route::apiResource('faq', FaqController::class)->only(['index', 'show']);
// dst
```

---

### CR-02: Stored XSS pada ReportController::exportPdf()

**File:** `backend/app/Http/Controllers/Api/ReportController.php:25-41`

**Issue:** Method `exportPdf()` menggabungkan data dari database (`$item->judul`, `$item->tipe`) langsung ke dalam HTML tanpa escaping. Jika ada pengumuman dengan judul berisi `<script>alert('xss')</script>`, skrip akan dieksekusi saat korban membuka PDF di browser.

```php
$html .= '<td>' . $item->judul . '</td>';   // ❌ Tidak di-escape
$html .= '<td>' . $item->tipe . '</td>';     // ❌ Tidak di-escape
```

Karena data ini bisa dimasukkan melalui `PengumumanController::store()` (yang juga tidak punya proteksi auth — lihat CR-01), ini menjadi **stored XSS** yang bisa dieksploitasi oleh siapa pun.

**Fix:**
```php
$html .= '<td>' . e($item->judul) . '</td>';   // Menggunakan helper e() atau htmlspecialchars()
$html .= '<td>' . e($item->tipe) . '</td>';
```

Atau lebih baik, gunakan Laravel's Blade templating untuk rendering HTML:
```php
$html = view('exports.pengumuman-pdf', compact('pengumumans'))->render();
```

---

### CR-03: Missing `store()` dan `destroy()` Methods di SettingController

**File:** `backend/app/Http/Controllers/Api/SettingController.php`
**Related:** `backend/routes/api.php:14`

**Issue:** Route `apiResource('settings', SettingController::class)` mendaftarkan route POST `/settings` (store) dan DELETE `/settings/{setting}` (destroy), tetapi `SettingController` tidak memiliki method `store()` atau `destroy()`. Memanggil endpoint ini akan menghasilkan 500 error (`BadMethodCallException`).

```
Route::apiResource('settings', SettingController::class);
// ^ ini generate route POST & DELETE yang method-nya tidak ada di controller
```

**Fix:** Tambahkan missing methods di SettingController:
```php
public function store(Request $request)
{
    $validated = $request->validate([
        'key' => 'required|string|max:255|unique:settings',
        'value' => 'required',
        'type' => 'in:string,boolean,file'
    ]);
    
    $setting = Setting::create($validated);
    
    return response()->json([
        'success' => true,
        'message' => 'Setting berhasil dibuat.',
        'data' => $setting
    ], 201);
}

public function destroy($key)
{
    $setting = Setting::where('key', $key)->firstOrFail();
    $setting->delete();
    
    return response()->json([
        'success' => true,
        'message' => 'Setting berhasil dihapus.'
    ]);
}
```

Atau, jika store/destroy memang tidak diinginkan, ganti deklarasi route:
```php
Route::apiResource('settings', SettingController::class)->only(['index', 'show', 'update']);
```

---

### CR-04: Route Model Binding Conflict di SettingController

**File:** `backend/app/Http/Controllers/Api/SettingController.php`

**Issue:** Controller menggunakan parameter `$key` dan melakukan lookup berdasarkan kolom `key`:
```php
public function show($key)
{
    $setting = Setting::where('key', $key)->firstOrFail();
```

Sedangkan route `apiResource` secara default menggunakan `id` sebagai route key:
```
GET /settings/{setting}  → Laravel mencari Setting dengan id = {setting}
```

URL seperti `/settings/site_name` akan mencari `Setting::find('site_name')` — bukan `Setting::where('key', 'site_name')`. Ini bisa menghasilkan 404 meskipun data dengan key tersebut ada.

**Fix:**
```php
// Di model Setting.php
public function getRouteKeyName(): string
{
    return 'key';
}
```

Dengan ini, route model binding akan otomatis mencari berdasarkan kolom `key`.

---

## Warnings

### WR-01: Fallback Auth::id() ?? 1 Menerobos Autentikasi

**File:** `backend/app/Http/Controllers/Api/PengumumanController.php:30`

**Issue:** Saat pengguna tidak terautentikasi, `Auth::id()` mengembalikan `null`, dan fallback `?? 1` memberikan created_by = user ID 1. Ini membuat request dari siapapun (tanpa login) bisa membuat pengumuman yang seolah-olah dibuat oleh admin.

```php
$validated['created_by'] = Auth::id() ?? 1;  // ?? 1 adalah backdoor
```

**Fix:**
```php
$validated['created_by'] = Auth::id(); // Hapus ?? 1

// Dan tambahkan auth middleware di route untuk store method
```

---

### WR-02: NotificationController Hanya Mengandalkan Manual Auth Check

**File:** `backend/app/Http/Controllers/Api/NotificationController.php`

**Issue:** Controller memeriksa `Auth::user()` secara manual dan mengembalikan response 401 berupa JSON. Ini tidak konsisten dengan praktik Laravel; seharusnya menggunakan middleware atau `auth:api` guard yang akan mengembalikan 401 proper. Selain itu, manual check ini bisa dilewati jika ada perubahan pada cara Laravel menangani auth.

**Fix:**
```php
// Gunakan auth()->userOrFail() yang akan throw AuthenticationException
$user = auth()->userOrFail();
```

---

### WR-03: Tidak Ada Pagination di Semua Endpoint List

**File:** `backend/app/Http/Controllers/Api/*Controller.php`

**Issue:** Semua endpoint index menggunakan `Model::all()` yang mengambil seluruh data tanpa batasan. Untuk dataset besar, ini akan menyebabkan memory exhaustion dan slow response.

Controllers terdampak:
- `FaqController::index()` — `Faq::where('is_active', true)->get()`
- `PengumumanController::index()` — `Pengumuman::latest('published_at')->get()`
- `TimelineController::index()` — `Timeline::orderBy('tanggal_mulai', 'asc')->get()`
- `SettingController::index()` — `Setting::all()`
- `ReportController::exportExcel/exportPdf()` — `Pengumuman::all()`

**Fix:**
```php
// Di controllers, ganti get()/all() dengan paginate()
$pengumumans = Pengumuman::latest('published_at')->paginate(20);
```

---

### WR-04: cascadeOnDelete pada created_by di Migration Pengumuman

**File:** `backend/database/migrations/2026_07_17_000001_create_pengumuman_table.php:17`

**Issue:** Foreign key `created_by` memiliki `cascadeOnDelete()`, yang berarti menghapus user akan otomatis menghapus **semua pengumuman** yang dibuat user tersebut. Jika admin yang menghapus user tertentu (misalnya karena resign), data pengumuman historis akan hilang.

```php
$table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
```

**Fix:** Ganti menjadi `nullOnDelete()` untuk menjaga data historis:
```php
$table->foreignId('created_by')->constrained('users')->nullOnDelete();
```

Dan sesuaikan kolom menjadi nullable.

---

### WR-05: Export Excel/PDF Tidak Membedakan Role

**File:** `backend/app/Http/Controllers/Api/ReportController.php`

**Issue:** Endpoint export (`/report/excel`, `/report/pdf`) bisa diakses oleh siapa saja tanpa autentikasi. Data pengumuman (yang mungkin berisi informasi internal) bisa diunduh oleh publik.

**Fix:** Tambahkan guard middleware dan/atau role check:
```php
Route::get('report/excel', [ReportController::class, 'exportExcel'])
    ->middleware('auth:sanctum');
Route::get('report/pdf', [ReportController::class, 'exportPdf'])
    ->middleware('auth:sanctum');
```

---

## Info

### IN-01: Dummy Data Hardcoded di Frontend

**File:** `frontend/src/pages/LandingPage.tsx`, `frontend/src/pages/Dashboard.tsx`, `frontend/src/pages/CmsPanel.tsx`

**Issue:** Semua data di frontend masih hardcoded. Halaman CMS Panel menggunakan `onSubmit={e => e.preventDefault()}` tanpa integrasi API. Ini wajar untuk tahap preview/UI prototype, tetapi perlu dicatat bahwa belum ada satu pun komponen frontend yang terhubung ke backend API.

Beberapa form di CMS Panel (FAQ, Timeline, Settings) tidak bisa menyimpan data — hanya menampilkan UI form.

---

### IN-02: Inline Styles di App.tsx Tidak Konsisten

**File:** `frontend/src/App.tsx:6-17`

**Issue:** Navigation bar menggunakan inline styles sementara seluruh komponen dan halaman lain menggunakan file CSS eksternal. Untuk konsistensi, inline styles sebaiknya dipindahkan ke file CSS terpisah.

---

## Rangkuman Temuan Utama

| # | Temuan | Severity | File |
|---|--------|----------|------|
| 1 | Tidak ada authentication middleware di route | 🔴 CRITICAL | `routes/api.php` |
| 2 | Stored XSS di export PDF tanpa escaping | 🔴 CRITICAL | `ReportController.php` |
| 3 | Missing store/destroy methods di SettingController | 🔴 CRITICAL | `SettingController.php` |
| 4 | Route model binding conflict (key vs id) | 🔴 CRITICAL | `SettingController.php` |
| 5 | Fallback `?? 1` bypasses authentication | 🟡 WARNING | `PengumumanController.php` |
| 6 | Manual auth check di NotificationController | 🟡 WARNING | `NotificationController.php` |
| 7 | Tidak ada pagination (memory risk) | 🟡 WARNING | All Controllers |
| 8 | cascadeOnDelete berbahaya untuk data historis | 🟡 WARNING | Migration |
| 9 | Export report tanpa auth guard | 🟡 WARNING | `ReportController.php` |
| 10 | Dummy data frontend (perlu dicatat) | ℹ️ INFO | Frontend pages |
| 11 | Inline style tidak konsisten | ℹ️ INFO | `App.tsx` |

## Kesimpulan

**Frontend** secara umum terstruktur rapi dengan TypeScript interfaces yang baik, komponen yang reusable, dan CSS yang bersih. Wajar jika masih menggunakan dummy data karena ini preview/UI prototype.

**Backend** memiliki masalah kritis yang harus diperbaiki sebelum digunakan di production:
1. **Prioritas #1**: Tambahkan authentication middleware (`sanctum`) ke semua route yang membutuhkan proteksi.
2. **Prioritas #2**: Fix stored XSS di `exportPdf()` dengan escaping output.
3. **Prioritas #3**: Lengkapi SettingController (missing methods + route key).

---

_Reviewed: 2026-07-20T10:00:00Z_
_Reviewer: gsd-code-reviewer_
_Depth: standard_
