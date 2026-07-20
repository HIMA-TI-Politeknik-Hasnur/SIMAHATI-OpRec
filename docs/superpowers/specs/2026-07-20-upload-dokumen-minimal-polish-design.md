# Upload Dokumen — Minimal Polish Design

## Status: Approved for Implementation

## 1. Arsitektur Upload

- Setiap `peserta_id + jenis_dokumen` maksimal 1 record di DB
- Upload baru → cek existing:
  - Belum ada → POST `/api/upload`
  - Sudah ada → PUT `/api/upload/{id}` + hapus file lama di storage
- Backend sudah punya: `StoreUploadRequest`, `UploadController@store/update/destroy`

## 2. Tabel Uploads (existing)

| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| peserta_id | bigint | FK ke peserta |
| jenis_dokumen | enum('foto','ktm','cv') | |
| file_path | string | path di storage |
| original_name | string | nama asli |
| file_size | int | bytes |
| created_at/updated_at | timestamp | |

## 3. Perubahan Per File

### UploadDokumen.tsx
- **Props baru**: `existingUploads?: Record<string, any>` (key: jenis_dokumen)
- **Logika upload**: cek `existingUploads[jenis]`:
  - `undefined` → POST
  - ada → PUT (dengan id dari existing record)
- **Tambah**: `loadingState` per jenis_dokumen (Record<string, boolean>)
- **Tambah**: fungsi `handleDelete(jenis)` → DELETE `/api/upload/{existingUploads[jenis].id}` → hapus dari state lokal

### UploadCard.tsx
- **Props baru**:
  - `onDelete?: (jenis: string) => void`
  - `uploading?: boolean`
  - `jenis?: string`
- **Tambah**: tombol × (hapus) di pojok card kalau `onDelete` ada dan file sudah ada
- **Tambah**: spinner overlay kalau `uploading` true
- **Perbaiki UX**: drag&drop area dinonaktifkan (opacity turun) selama upload

### PreviewPendaftaran.tsx
- **Tambah**: setelah data pendaftaran & peserta loaded, cek `dokumen` wajib (foto, ktm, cv)
- **Tambah**: alert box kuning di atas tombol submit kalau dokumen wajib belum lengkap:
  "Peringatan: {daftar dokumen} belum diupload. Anda tetap bisa submit, tapi verifikasi mungkin tertunda."
- **Tambah**: wrapper alert bisa di-dismiss (setState lokal)

### UploadController.php (minor)
- `update()`: hapus file lama dari storage sebelum simpan file baru (sudah ada)
- `destroy()`: hapus file dari storage + record (sudah ada)

## 4. Alur Upload Baru

```
User pilih file → UploadCard.onFileSelect
  → UploadDokumen.handleUpload(file, jenis)
    → setLoading(jenis, true)
    → existing? PUT /api/upload/{id} : POST /api/upload
    → success → update existingUploads state
    → setLoading(jenis, false)

User klik × (hapus) → UploadCard.onDelete(jenis)
  → UploadDokumen.handleDelete(jenis)
    → DELETE /api/upload/{id}
    → success → hapus dari existingUploads state
```

## 5. Daftar File yang Diubah

1. `frontend/src/components/UploadCard.tsx` — tombol hapus, loading state
2. `frontend/src/pages/UploadDokumen.tsx` — logika POST/PUT, loading per-jenis, delete
3. `frontend/src/pages/PreviewPendaftaran.tsx` — peringatan dokumen belum lengkap
