# 📖 docs/ — Panduan Dokumen Proyek SIMAHATI OpRec

Selamat datang di folder `docs/`! Folder ini berisi dokumen acuan untuk pengembangan **SIMAHATI OpRec** — sistem penerimaan anggota baru Himpunan Mahasiswa Sistem Informasi (SIMAHATI).

Dokumen-dokumen di sini adalah **draf awal** yang harus kita review, diskusikan, dan sepakati bersama sebelum dipakai sebagai acuan coding. Bukan final — tapi titik awal kita untuk menyamakan visi.

---

## 📂 Tentang Folder docs/

- **Isi:** Spesifikasi API, skema database, dan keputusan teknis stack (backend & frontend).
- **Status awal:** Draf untuk direview — belum tentu sempurna.
- **Tujuan:** Semua anggota tim punya acuan yang sama, sehingga tidak ada miskomunikasi saat ngoding.
- **Cara pakai:** Baca → review → diskusi → sepakati → baru pakai sebagai acuan.

---

## 📄 Daftar Dokumen & Penjelasan

### API.md — Daftar Endpoint API

| Item | Detail |
|------|--------|
| **Isi** | Rencana endpoint yang akan dibuat (method, URI, request body, response) |
| **Acuan untuk** | 🔧 **Reyhan** (bikin backend), 👥 semua anggota (panggil API dari frontend) |
| **Cara review** | Cek apakah endpoint sudah sesuai kebutuhan fitur masing-masing. Pastikan request & response mencakup data yang diperlukan. |

**Pembaca utama:** Reyhan (lead review), semua anggota wajib cek endpoint yang terkait fiturnya.

---

### DATABASE.md — Skema Database

| Item | Detail |
|------|--------|
| **Isi** | Daftar tabel, kolom, tipe data, relasi, dan index |
| **Acuan untuk** | 👥 Semua anggota saat bikin migration |
| **Cara review** | Pastikan kolom & relasi mencukupi kebutuhan fitur. Cek tipe data sudah sesuai. |

**Pembagian review DATABASE.md:**

| Anggota | Bagian yang direview |
|---------|----------------------|
| **Reyhan** | Lead review — tabel `users`, `roles`, `permissions` |
| **Nadil** | Tabel `peserta`, `uploads` |
| **Anton** | Tabel `divisi`, `interview`, `penilaian` |
| **Rizky** | Tabel `pengumuman`, `notifications` |

---

### stack/BACKEND.md — Teknologi Backend

| Item | Detail |
|------|--------|
| **Isi** | Keputusan teknis backend: Laravel, Sanctum, Spatie, MySQL, dll. + alasan pemilihannya |
| **Acuan untuk** | 🔧 **Reyhan** (arsitektur backend) |
| **Status** | 📖 **Dokumen baca saja** — tidak perlu diubah. Kalau ada masukan, diskusikan dulu di tim. |

---

### stack/FRONTEND.md — Teknologi Frontend

| Item | Detail |
|------|--------|
| **Isi** | Keputusan teknis frontend: React, Vite, Tailwind, shadcn/ui, dll. + alasan pemilihannya |
| **Acuan untuk** | 👥 Semua anggota yang ngerjain frontend |
| **Status** | 📖 **Dokumen baca saja** — tidak perlu diubah. Kalau ada masukan, diskusikan dulu di tim. |

---

## 🔄 Flow Review yang Disarankan

Supaya dokumen benar-benar jadi acuan yang berguna, kita perlu mereviewnya bareng-bareng. Ini alur yang disarankan:

```
 1. Baca dokumen yang relevan dengan tugas masing-masing
         ↓
 2. Catat yang kurang / tidak sesuai / perlu ditambah
         ↓
 3. Diskusikan dalam meeting tim (online/offline)
         ↓
 4. Update dokumen berdasarkan hasil diskusi
         ↓
 5. Setelah semua setuju → dokumen jadi acuan resmi
```

### Pembagian tugas review:

| Dokumen | Lead Reviewer | Reviewer Lain |
|---------|:------------:|:--------:|
| API.md | **Reyhan** | Semua anggota |
| DATABASE.md — users, roles, permissions | **Reyhan** | — |
| DATABASE.md — peserta, uploads | **Nadil** | Reyhan |
| DATABASE.md — divisi, interview, penilaian | **Anton** | Reyhan |
| DATABASE.md — pengumuman, notifications | **Rizky** | Reyhan |
| stack/BACKEND.md | Reyhan (cukup dibaca) | — |
| stack/FRONTEND.md | Semua anggota (cukup dibaca) | — |

---

## ⚠️ Aturan Update Dokumen

1. **Diskusi dulu** — Setiap perubahan harus disepakati tim terlebih dahulu. Jangan ubah seenaknya.
2. **Gunakan Pull Request** — Sama seperti kode, perubahan dokumen juga lewat PR. Biar ada riwayatnya dan bisa direview.
3. **Jangan sendirian** — Kalau ada yang mau ditambah/diperbaiki, bahas dulu di grup atau meeting. Jangan langsung commit ke main.

### Kenapa aturan ini penting?

Karena dokumen ini jadi acuan kita semua. Kalau diubah sepihak, bisa jadi ada anggota tim yang ngoding berdasarkan informasi yang udah tidak berlaku. Ujung-ujungnya kerja dobel dan revisi besar-besaran.

---

## 💡 Tips

- **Baru baca?** Mulai dari dokumen yang sesuai tugas kamu (lihat tabel review di atas).
- **Punya saran?** Catat, nanti dibahas.
- **Bingung?** Tanya aja di grup. Mungkin anggota lain juga bingung hal yang sama.

---

*Selamat ngoding, tim INGFO LOKER! 🚀*

---

↩️ **[Kembali ke: GUIDE.md](../GUIDE.md)** — Commit message & deploy localhost ➡️ **[Lanjut ke: DATABASE.md](DATABASE.md)** — Skema database
