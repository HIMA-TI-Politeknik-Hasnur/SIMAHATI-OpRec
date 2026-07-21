# Struktur Database — SIMAHATI OpRec (Berdasarkan Migration Files)

**DBMS:** MySQL 8.0+  
**Nama Database:** `simahati_oprec`  
**Total Tabel:** 24 tabel

---

## Daftar Tabel & Relasi

### 1. Tabel `users` — Pengguna Sistem
**File:** `0001_01_01_000000_create_users_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| name | VARCHAR | 255 | NOT NULL |
| email | VARCHAR | 255 | NOT NULL, **UNIQUE** |
| email_verified_at | TIMESTAMP | - | NULL |
| password | VARCHAR | 255 | NOT NULL |
| remember_token | VARCHAR | 100 | NULL |
| created_at | TIMESTAMP | - | NULL |
| updated_at | TIMESTAMP | - | NULL |

**Relasi Keluar (FK):**
- `users.id` ──< `peserta.user_id` (cascadeOnDelete)
- `users.id` ──< `pengumuman.created_by` (cascadeOnDelete)
- `users.id` ──< `interviews.interviewer_id` (cascadeOnDelete)
- `users.id` ──< `penilaians.interviewer_id` (cascadeOnDelete)
- `users.id` ──< `role_user.user_id` (cascadeOnDelete)
- `users.id` ──< `personal_access_tokens.tokenable_id` (polymorphic)

---

### 2. Tabel `password_reset_tokens` — Token Reset Password
**File:** `0001_01_01_000000_create_users_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| email | VARCHAR | 255 | **PK** |
| token | VARCHAR | 255 | NOT NULL |
| created_at | TIMESTAMP | - | NULL |

> Tidak ada relasi FK formal — Laravel handle secara logika.

---

### 3. Tabel `sessions` — Sesi Login
**File:** `0001_01_01_000000_create_users_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | VARCHAR | 255 | **PK** |
| user_id | BIGINT UNSIGNED | - | NULL, INDEX (FK implicit ke users.id) |
| ip_address | VARCHAR | 45 | NULL |
| user_agent | TEXT | - | NULL |
| payload | LONGTEXT | - | NOT NULL |
| last_activity | INT | - | INDEX |

---

### 4. Tabel `cache` — Data Cache
**File:** `0001_01_01_000001_create_cache_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| key | VARCHAR | 255 | **PK** |
| value | MEDIUMTEXT | - | NOT NULL |
| expiration | BIGINT | - | INDEX |

---

### 5. Tabel `cache_locks` — Pengunci Cache
**File:** `0001_01_01_000001_create_cache_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| key | VARCHAR | 255 | **PK** |
| owner | VARCHAR | 255 | NOT NULL |
| expiration | BIGINT | - | INDEX |

---

### 6. Tabel `jobs` — Antrian Pekerjaan
**File:** `0001_01_01_000002_create_jobs_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| queue | VARCHAR | 255 | NOT NULL, INDEX |
| payload | LONGTEXT | - | NOT NULL |
| attempts | SMALLINT UNSIGNED | - | NOT NULL |
| reserved_at | INT UNSIGNED | - | NULL |
| available_at | INT UNSIGNED | - | NOT NULL |
| created_at | INT UNSIGNED | - | NOT NULL |

---

### 7. Tabel `job_batches` — Batch Pekerjaan
**File:** `0001_01_01_000002_create_jobs_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | VARCHAR | 255 | **PK** |
| name | VARCHAR | 255 | NOT NULL |
| total_jobs | INT | - | NOT NULL |
| pending_jobs | INT | - | NOT NULL |
| failed_jobs | INT | - | NOT NULL |
| failed_job_ids | LONGTEXT | - | NOT NULL |
| options | MEDIUMTEXT | - | NULL |
| cancelled_at | INT | - | NULL |
| created_at | INT | - | NOT NULL |
| finished_at | INT | - | NULL |

---

### 8. Tabel `failed_jobs` — Pekerjaan Gagal
**File:** `0001_01_01_000002_create_jobs_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| uuid | VARCHAR | 255 | NOT NULL, **UNIQUE** |
| connection | VARCHAR | 255 | NOT NULL |
| queue | VARCHAR | 255 | NOT NULL |
| payload | LONGTEXT | - | NOT NULL |
| exception | LONGTEXT | - | NOT NULL |
| failed_at | TIMESTAMP | - | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

**Index:** `(connection, queue, failed_at)`

---

### 9. Tabel `pengumuman` — Pengumuman *(Rizky)*
**File:** `2026_07_17_000001_create_pengumuman_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| judul | VARCHAR | 255 | NOT NULL |
| isi | TEXT | - | NOT NULL |
| tipe | ENUM('info','warning','success','danger') | - | NOT NULL, DEFAULT 'info' |
| published_at | TIMESTAMP | - | NULL |
| created_by | BIGINT UNSIGNED | - | NOT NULL, **FK** → `users.id` ON DELETE CASCADE |
| created_at | TIMESTAMP | - | NULL |
| updated_at | TIMESTAMP | - | NULL |

**Relasi:**
- `pengumuman.created_by` ──> `users.id`

---

### 10. Tabel `notifications` — Notifikasi (Laravel Bawaan)
**File:** `2026_07_17_000002_create_notifications_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | CHAR (UUID) | 36 | **PK** |
| type | VARCHAR | 255 | NOT NULL |
| notifiable_type | VARCHAR | 255 | NOT NULL |
| notifiable_id | BIGINT UNSIGNED | - | NOT NULL |
| data | TEXT | - | NOT NULL |
| read_at | TIMESTAMP | - | NULL |
| created_at | TIMESTAMP | - | NULL |
| updated_at | TIMESTAMP | - | NULL |

**Index:** `(notifiable_type, notifiable_id)` — polymorphic index  
**Relasi:** Polymorphic ──> `users.id` (via `notifiable_type` + `notifiable_id`)

---

### 11. Tabel `timeline` — Timeline Kegiatan *(Rizky)*
**File:** `2026_07_17_000003_create_timeline_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| judul | VARCHAR | 255 | NOT NULL |
| deskripsi | TEXT | - | NULL |
| tanggal_mulai | DATE | - | NOT NULL |
| tanggal_selesai | DATE | - | NULL |
| is_active | BOOLEAN (TINYINT) | - | NOT NULL, DEFAULT true |
| created_at | TIMESTAMP | - | NULL |
| updated_at | TIMESTAMP | - | NULL |

> Tidak memiliki FK — tabel mandiri.

---

### 12. Tabel `faq` — FAQ Landing Page *(Rizky)*
**File:** `2026_07_17_000004_create_faq_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| pertanyaan | VARCHAR | 255 | NOT NULL |
| jawaban | TEXT | - | NOT NULL |
| is_active | BOOLEAN (TINYINT) | - | NOT NULL, DEFAULT true |
| created_at | TIMESTAMP | - | NULL |
| updated_at | TIMESTAMP | - | NULL |

> Tidak memiliki FK — tabel mandiri.

---

### 13. Tabel `settings` — Pengaturan Key-Value *(Rizky)*
**File:** `2026_07_17_000005_create_settings_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| key | VARCHAR | 255 | NOT NULL, **UNIQUE** |
| value | TEXT | - | NULL |
| type | VARCHAR | 255 | NOT NULL, DEFAULT 'string' |
| created_at | TIMESTAMP | - | NULL |
| updated_at | TIMESTAMP | - | NULL |

> Tidak memiliki FK — tabel mandiri.

---

### 14. Tabel `peserta` — Data Pendaftar *(Nadil)*
**File:** `2026_07_18_110036_create_peserta_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| user_id | BIGINT UNSIGNED | - | NOT NULL, **FK** → `users.id` ON DELETE CASCADE |
| nama_lengkap | VARCHAR | 100 | NOT NULL |
| nim | VARCHAR | 20 | NOT NULL, **UNIQUE** |
| semester | TINYINT | - | NOT NULL |
| program_studi | VARCHAR | 100 | NOT NULL, INDEX |
| angkatan | SMALLINT | - | NOT NULL, INDEX |
| email | VARCHAR | 100 | NOT NULL |
| nomor_hp | VARCHAR | 20 | NOT NULL |
| alamat | TEXT | - | NOT NULL |
| pengalaman_organisasi | TEXT | - | NULL |
| skill | TEXT | - | NULL |
| prestasi | TEXT | - | NULL |
| pilihan_divisi_1 | BIGINT UNSIGNED | - | NOT NULL (FK implisit ke `divisi.id`) |
| pilihan_divisi_2 | BIGINT UNSIGNED | - | NULL (FK implisit ke `divisi.id`) |
| motivasi | TEXT | - | NOT NULL |
| kontribusi | TEXT | - | NOT NULL |
| harapan | TEXT | - | NOT NULL |
| status_verifikasi | ENUM('pending','verified','rejected') | - | NOT NULL, DEFAULT 'pending', INDEX |
| status_seleksi | ENUM('draft','submitted','interview','accepted','rejected') | - | NOT NULL, DEFAULT 'draft', INDEX |
| created_at | TIMESTAMP | - | NULL |
| updated_at | TIMESTAMP | - | NULL |

**Relasi Keluar (FK):**
- `peserta.user_id` ──> `users.id`
- `peserta.pilihan_divisi_1` ──> `divisi.id` (FK **tidak** didefinisikan di migration — perlu ditambahkan)
- `peserta.pilihan_divisi_2` ──> `divisi.id` (FK **tidak** didefinisikan di migration — perlu ditambahkan)

**Relasi Masuk:**
- `pendaftaran.peserta_id` ──> `peserta.id`
- `uploads.peserta_id` ──> `peserta.id`
- `interviews.peserta_id` ──> `peserta.id`

**Catatan:** Kolom `pilihan_divisi_1` dan `pilihan_divisi_2` belum memiliki FK constraint formal karena migration `peserta` dijalankan **sebelum** migration `divisi`. FK perlu ditambahkan secara manual atau lewat migration terpisah.

---

### 15. Tabel `pendaftaran` — Status Pendaftaran *(Nadil)*
**File:** `2026_07_18_110039_create_pendaftaran_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| peserta_id | BIGINT UNSIGNED | - | NOT NULL, **FK** → `peserta.id` ON DELETE CASCADE |
| tanggal_daftar | TIMESTAMP | - | NULL |
| status | ENUM('draft','submitted','verified','rejected') | - | NOT NULL, DEFAULT 'draft', INDEX |
| catatan_admin | TEXT | - | NULL |
| created_at | TIMESTAMP | - | NULL |
| updated_at | TIMESTAMP | - | NULL |

**Relasi:**
- `pendaftaran.peserta_id` ──> `peserta.id`

---

### 16. Tabel `uploads` — Berkas Upload *(Nadil)*
**File:** `2026_07_18_110042_create_uploads_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| peserta_id | BIGINT UNSIGNED | - | NOT NULL, **FK** → `peserta.id` ON DELETE CASCADE |
| jenis_dokumen | ENUM('foto','ktm','cv','sertifikat') | - | NOT NULL |
| original_name | VARCHAR | 255 | NOT NULL |
| file_path | VARCHAR | 255 | NOT NULL |
| mime_type | VARCHAR | 100 | NOT NULL |
| ukuran_file | BIGINT UNSIGNED | - | NOT NULL (dalam bytes) |
| created_at | TIMESTAMP | - | NULL |
| updated_at | TIMESTAMP | - | NULL |

**Relasi:**
- `uploads.peserta_id` ──> `peserta.id`

---

### 17. Tabel `divisi` — Divisi Himpunan *(Anton)*
**File:** `2026_07_18_160246_create_divisis_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| nama | VARCHAR | 255 | NOT NULL, **UNIQUE** |
| deskripsi | TEXT | - | NOT NULL |
| kuota | INT | - | NOT NULL |
| created_at | TIMESTAMP | - | NULL |
| updated_at | TIMESTAMP | - | NULL |

**Relasi Masuk:**
- `peserta.pilihan_divisi_1` ──> `divisi.id` (implisit)
- `peserta.pilihan_divisi_2` ──> `divisi.id` (implisit)

---

### 18. Tabel `interviews` — Jadwal Wawancara *(Anton)*
**File:** `2026_07_18_171219_create_interviews_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| peserta_id | BIGINT UNSIGNED | - | NOT NULL, **FK** → `peserta.id` ON DELETE CASCADE |
| interviewer_id | BIGINT UNSIGNED | - | NOT NULL, **FK** → `users.id` ON DELETE CASCADE |
| tanggal | DATE | - | NOT NULL |
| waktu | TIME | - | NOT NULL |
| lokasi | VARCHAR | 255 | NOT NULL |
| status | ENUM('scheduled','completed','cancelled') | - | NOT NULL, DEFAULT 'scheduled' |
| catatan | TEXT | - | NULL |
| created_at | TIMESTAMP | - | NULL |
| updated_at | TIMESTAMP | - | NULL |

**Relasi:**
- `interviews.peserta_id` ──> `peserta.id`
- `interviews.interviewer_id` ──> `users.id`
- `interviews.id` ──< `penilaians.interview_id`

---

### 19. Tabel `penilaians` — Nilai Wawancara *(Anton)*
**File:** `2026_07_18_171231_create_penilaians_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| interview_id | BIGINT UNSIGNED | - | NOT NULL, **FK** → `interviews.id` ON DELETE CASCADE |
| interviewer_id | BIGINT UNSIGNED | - | NOT NULL, **FK** → `users.id` ON DELETE CASCADE |
| nilai | INT | - | NOT NULL (0–100) |
| catatan | TEXT | - | NULL |
| created_at | TIMESTAMP | - | NULL |
| updated_at | TIMESTAMP | - | NULL |

**Relasi:**
- `penilaians.interview_id` ──> `interviews.id`
- `penilaians.interviewer_id` ──> `users.id`

---

### 20. Tabel `roles` — Peran Pengguna *(Reyhan)*
**File:** `2026_07_20_000001_create_roles_table.php` + `2026_07_20_060000_add_guard_name...`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| name | VARCHAR | 255 | NOT NULL |
| guard_name | VARCHAR | 255 | NOT NULL, DEFAULT 'web' |
| slug | VARCHAR | 255 | NOT NULL, **UNIQUE** |
| description | TEXT | - | NULL |
| created_at | TIMESTAMP | - | NULL |
| updated_at | TIMESTAMP | - | NULL |

**Relasi:**
- `roles.id` ──< `role_user.role_id`
- `roles.id` ──< `permission_role.role_id`

---

### 21. Tabel `permissions` — Izin Akses *(Reyhan)*
**File:** `2026_07_20_000002_create_permissions_table.php` + `2026_07_20_060000_add_guard_name...`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| name | VARCHAR | 255 | NOT NULL |
| guard_name | VARCHAR | 255 | NOT NULL, DEFAULT 'web' |
| slug | VARCHAR | 255 | NOT NULL, **UNIQUE** |
| description | TEXT | - | NULL |
| created_at | TIMESTAMP | - | NULL |
| updated_at | TIMESTAMP | - | NULL |

**Relasi:**
- `permissions.id` ──< `permission_role.permission_id`

---

### 22. Tabel `role_user` — Pivot User ↔ Role *(Reyhan)*
**File:** `2026_07_20_000003_create_role_user_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| user_id | BIGINT UNSIGNED | - | NOT NULL, **FK** → `users.id` ON DELETE CASCADE |
| role_id | BIGINT UNSIGNED | - | NOT NULL, **FK** → `roles.id` ON DELETE CASCADE |
| created_at | TIMESTAMP | - | NULL |
| updated_at | TIMESTAMP | - | NULL |

**Unique Constraint:** `(user_id, role_id)` — cegah duplikasi  
**Relasi:** Many-to-Many antara `users` dan `roles`

---

### 23. Tabel `permission_role` — Pivot Role ↔ Permission *(Reyhan)*
**File:** `2026_07_20_000004_create_permission_role_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| permission_id | BIGINT UNSIGNED | - | NOT NULL, **FK** → `permissions.id` ON DELETE CASCADE |
| role_id | BIGINT UNSIGNED | - | NOT NULL, **FK** → `roles.id` ON DELETE CASCADE |
| created_at | TIMESTAMP | - | NULL |
| updated_at | TIMESTAMP | - | NULL |

**Unique Constraint:** `(permission_id, role_id)` — cegah duplikasi  
**Relasi:** Many-to-Many antara `permissions` dan `roles`

---

### 24. Tabel `personal_access_tokens` — Token API *(Reyhan via Sanctum)*
**File:** `2026_07_20_052419_create_personal_access_tokens_table.php`

| Kolom | Tipe | Length | Constraint |
|-------|------|--------|------------|
| id | BIGINT UNSIGNED | - | **PK**, Auto Increment |
| tokenable_type | VARCHAR | 255 | NOT NULL |
| tokenable_id | BIGINT UNSIGNED | - | NOT NULL |
| name | TEXT | - | NOT NULL |
| token | VARCHAR | 64 | NOT NULL, **UNIQUE** |
| abilities | TEXT | - | NULL |
| last_used_at | TIMESTAMP | - | NULL |
| expires_at | TIMESTAMP | - | NULL, INDEX |
| created_at | TIMESTAMP | - | NULL |
| updated_at | TIMESTAMP | - | NULL |

**Index:** `(tokenable_type, tokenable_id)` — polymorphic  
**Relasi:** Polymorphic ──> `users.id` (via `tokenable_type` = `App\Models\User`)

---

## 🔗 Diagram Relasi Antar Tabel

```
┌─────────────────────────────────────────────────────────────┐
│                      TABEL INTI                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  users ──< role_user >── roles ──< permission_role >── permissions
│    │                                                       │
│    ├──< peserta                                             │
│    │     ├──< pendaftaran                                   │
│    │     ├──< uploads                                       │
│    │     └──< interviews ──< penilaians                     │
│    │                                                       │
│    ├──< pengumuman                                          │
│    ├──< interviews.interviewer_id                           │
│    ├──< penilaians.interviewer_id                           │
│    └──< personal_access_tokens (polymorphic)                │
│                                                             │
│  peserta ──< pilihan_divisi_1 ──> divisi                    │
│  peserta ──< pilihan_divisi_2 ──> divisi                    │
│                                                             │
│  timeline (mandiri, tanpa FK)                               │
│  faq (mandiri, tanpa FK)                                    │
│  settings (mandiri, tanpa FK)                               │
│  notifications (polymorphic ──> users)                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Ringkasan Relasi Foreign Key

| FK Column | Source Table | Target Table | On Delete |
|-----------|-------------|-------------|-----------|
| `user_id` | `peserta` | `users` | CASCADE |
| `created_by` | `pengumuman` | `users` | CASCADE |
| `interviewer_id` | `interviews` | `users` | CASCADE |
| `interviewer_id` | `penilaians` | `users` | CASCADE |
| `user_id` | `role_user` | `users` | CASCADE |
| `peserta_id` | `pendaftaran` | `peserta` | CASCADE |
| `peserta_id` | `uploads` | `peserta` | CASCADE |
| `peserta_id` | `interviews` | `peserta` | CASCADE |
| `interview_id` | `penilaians` | `interviews` | CASCADE |
| `role_id` | `role_user` | `roles` | CASCADE |
| `role_id` | `permission_role` | `roles` | CASCADE |
| `permission_id` | `permission_role` | `permissions` | CASCADE |
| `pilihan_divisi_1` | `peserta` | `divisi` | **BELUM ADA** (perlu ditambahkan) |
| `pilihan_divisi_2` | `peserta` | `divisi` | **BELUM ADA** (perlu ditambahkan) |

---

## Catatan Penting

1. **FK Peserta → Divisi belum didefinisikan** — Kolom `pilihan_divisi_1` dan `pilihan_divisi_2` di tabel `peserta` hanya berupa `unsignedBigInteger` tanpa constraint FK formal. Perlu migration terpisah untuk menambahkan:

```php
Schema::table('peserta', function (Blueprint $table) {
    $table->foreign('pilihan_divisi_1')->references('id')->on('divisi')->onDelete('cascade');
    $table->foreign('pilihan_divisi_2')->references('id')->on('divisi')->onDelete('set null');
});
```

2. **Semua ON DELETE CASCADE** — Hampir semua FK menggunakan `cascadeOnDelete`, artinya jika data induk dihapus, data anak ikut terhapus.

3. **Polymorphic Relations:**
   - `personal_access_tokens` ── via `tokenable_type` + `tokenable_id`
   - `notifications` ── via `notifiable_type` + `notifiable_id`

4. **Bawaan Laravel (tanpa FK formal):**
   - `password_reset_tokens` — handle via logika Laravel
   - `sessions.user_id` — FK implicit (tanpa constraint)
   - `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs` — tanpa relasi
