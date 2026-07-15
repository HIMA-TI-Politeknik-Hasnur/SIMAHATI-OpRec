# 🛠️ Technology Stack

SIMAHATI OpRec dikembangkan menggunakan arsitektur modern yang memisahkan antara **Frontend** dan **Backend** (Decoupled Architecture). Pemilihan teknologi dilakukan dengan mempertimbangkan beberapa aspek berikut:

- Mudah dipelajari oleh seluruh anggota tim.
- Memiliki dokumentasi yang lengkap.
- Memiliki komunitas yang besar.
- Mudah diintegrasikan dengan teknologi lain.
- Cepat untuk proses development.
- Mudah di-deploy.
- Memiliki performa yang baik.
- Cocok untuk pengembangan jangka panjang.

---

# 🌐 Frontend Technology

Frontend bertanggung jawab terhadap seluruh tampilan aplikasi, interaksi pengguna, validasi form, hingga komunikasi dengan Backend API.

---

# 1. React + Vite + TypeScript

## Digunakan Sebagai

Framework utama untuk membangun seluruh tampilan (User Interface) SIMAHATI OpRec.

Digunakan pada:

- Authentication
- Dashboard
- Manajemen Peserta
- Manajemen Divisi
- Interview
- Pengumuman
- Profile
- Settings

---

## Penjelasan

### React

React merupakan library JavaScript yang digunakan untuk membangun User Interface menggunakan konsep **Component-Based Architecture**.

Setiap tampilan akan dibangun menggunakan Component sehingga dapat digunakan kembali (Reusable Component).

Contoh:

- Button
- Card
- Sidebar
- Navbar
- Table
- Modal
- Form

---

### Vite

Vite merupakan Build Tool modern yang digunakan untuk menjalankan proses development serta build aplikasi.

Keunggulan utama Vite dibanding Create React App (CRA):

- Startup jauh lebih cepat.
- Hot Module Replacement (HMR) lebih cepat.
- Build Production lebih ringan.
- Konfigurasi lebih sederhana.

---

### TypeScript

TypeScript merupakan pengembangan dari JavaScript yang menambahkan fitur **Static Typing**.

Penggunaan TypeScript membuat:

- Mengurangi bug.
- Auto Complete lebih baik.
- Refactoring lebih mudah.
- Kode lebih mudah dipelihara.

---

## Kelebihan

- Sangat cepat dijalankan.
- Ecosystem sangat besar.
- Dokumentasi sangat lengkap.
- Reusable Component.
- Mudah dikembangkan.
- Sangat cocok untuk Dashboard.
- Banyak library pendukung.

Contoh:

- Chart
- Table
- Calendar
- Upload
- Notification
- Animation
- Form
- State Management

---

## Kekurangan

React hanya menyediakan UI.

Beberapa kebutuhan harus menggunakan library tambahan.

Contohnya:

- Routing
- State Management
- HTTP Client
- Form
- Validation

---

## Kenapa Tidak Menggunakan Next.js?

Next.js lebih cocok digunakan apabila aplikasi membutuhkan:

- SEO
- Landing Page
- Blog
- Company Profile
- Server Side Rendering (SSR)

SIMAHATI OpRec merupakan aplikasi Dashboard Internal sehingga React + Vite lebih sederhana, ringan, dan proses development menjadi lebih cepat.

---

# 2. Tailwind CSS

## Digunakan Sebagai

Framework CSS utama.

Digunakan untuk membangun seluruh tampilan aplikasi.

---

## Penjelasan

Tailwind CSS menggunakan konsep **Utility First CSS**.

Setiap styling dilakukan menggunakan Utility Class sehingga tidak perlu membuat banyak file CSS.

---

## Kelebihan

- Sangat cepat.
- Responsive Design sangat mudah.
- Konsisten.
- Mudah dikustomisasi.
- Ringan.
- Sangat cocok dipadukan dengan React.

---

## Kekurangan

Class HTML menjadi lebih panjang.

Contoh:

```html
class="bg-white rounded-xl shadow-lg p-6"
```

---

## Kenapa Tidak Menggunakan Bootstrap?

Bootstrap memang lebih cepat.

Namun desain Bootstrap cenderung memiliki tampilan yang seragam.

Sedangkan Tailwind memberikan kebebasan dalam mendesain antarmuka sehingga tampilan aplikasi menjadi lebih modern.

---

# 3. shadcn/ui

## Digunakan Sebagai

UI Component Library.

Digunakan untuk:

- Button
- Card
- Table
- Dialog
- Modal
- Alert
- Badge
- Tabs
- Sidebar
- Navigation Menu
- Dropdown Menu
- Popover
- Tooltip

---

## Penjelasan

Berbeda dengan Material UI ataupun Ant Design.

shadcn/ui akan menyalin source code component langsung ke dalam project.

Artinya seluruh komponen menjadi milik project sehingga bebas dimodifikasi.

---

## Kelebihan

- Modern Design.
- Accessibility sangat baik.
- Ringan.
- Komponen dapat dimodifikasi.
- Sangat cocok dengan Tailwind CSS.

---

## Kekurangan

- Tidak selengkap Ant Design.
- Instalasi dilakukan satu per satu.

---

## Kenapa Tidak Menggunakan Material UI?

Material UI memiliki identitas desain yang sangat kuat sehingga banyak website memiliki tampilan yang serupa.

Sedangkan shadcn/ui memberikan kebebasan dalam mengembangkan identitas visual aplikasi.

---

# 4. Zustand

## Digunakan Sebagai

Global State Management.

Digunakan untuk menyimpan data global seperti:

- User
- Session
- Role
- Sidebar State
- Theme
- Authentication

---

## Penjelasan

Zustand merupakan State Management yang ringan, sederhana, dan mudah digunakan.

---

## Kelebihan

- Konfigurasi sederhana.
- Sangat ringan.
- Mudah dipelajari.
- Penulisan kode jauh lebih sedikit dibanding Redux.

---

## Kekurangan

- Ecosystem lebih kecil dibanding Redux.

---

## Kenapa Tidak Menggunakan Redux?

Redux lebih cocok digunakan untuk aplikasi berskala besar seperti:

- Marketplace
- Banking
- ERP
- Enterprise

SIMAHATI OpRec belum membutuhkan kompleksitas tersebut.

---

# 5. Axios

## Digunakan Sebagai

HTTP Client.

Digunakan untuk menghubungkan Frontend dengan Backend API.

Contoh Request:

- Login
- Register
- Dashboard
- CRUD Peserta
- CRUD Divisi
- CRUD Interview
- CRUD Pengumuman

---

## Penjelasan

Axios mempermudah proses komunikasi antara Frontend dan Backend.

---

## Kelebihan

- API sederhana.
- Request Interceptor.
- Response Interceptor.
- Timeout.
- Authentication Header.
- Error Handling lebih baik.

---

## Kekurangan

- Harus menginstall package tambahan.

---

## Kenapa Tidak Menggunakan Fetch API?

Fetch merupakan API bawaan browser.

Namun proses Error Handling, Authentication, serta konfigurasi Request jauh lebih kompleks dibanding Axios.

---

# 6. TanStack Query *(Opsional)*

## Digunakan Sebagai

Server State Management.

Digunakan apabila aplikasi membutuhkan:

- API Cache
- Background Refetch
- Synchronization Data
- Optimistic Update

---

## Penjelasan

TanStack Query tidak wajib digunakan pada tahap awal pengembangan.

Karena target pengerjaan hanya 5 hari, penggunaan Axios sudah cukup.

TanStack Query dapat ditambahkan pada pengembangan selanjutnya.

---

## Kelebihan

- Cache otomatis.
- Loading otomatis.
- Retry otomatis.
- Refetch otomatis.
- Optimistic Update.

---

## Kekurangan

- Learning Curve lebih tinggi.

---

# 7. React Hook Form

## Digunakan Sebagai

Form Management.

Digunakan pada:

- Login
- Register
- Tambah Peserta
- Tambah Divisi
- Tambah Pengumuman
- Edit Profile

---

## Penjelasan

React Hook Form merupakan library yang digunakan untuk mengelola seluruh Form pada React dengan performa yang sangat baik.

---

## Kelebihan

- Ringan.
- Cepat.
- Mudah digunakan.
- Mudah dipadukan dengan Zod.

---

## Kekurangan

- Membutuhkan sedikit pembelajaran di awal.

---

## Kenapa Tidak Menggunakan Formik?

Formik merupakan library yang lebih lama dan memiliki performa yang lebih rendah dibanding React Hook Form.

---

# 8. Zod

## Digunakan Sebagai

Form Validation.

---

## Penjelasan

Zod digunakan untuk melakukan validasi data pada Frontend.

Seluruh schema cukup dibuat satu kali dan dapat digunakan kembali.

Contoh:

- Login Schema
- Register Schema
- Peserta Schema
- Divisi Schema

---

## Kelebihan

- TypeScript Friendly.
- Reusable Schema.
- Mudah dipadukan dengan React Hook Form.
- Validasi sederhana.

---

## Kekurangan

- Perlu mempelajari sintaks baru.

---

# 📊 Ringkasan Frontend Stack

| Teknologi | Digunakan Sebagai |
|------------|-------------------|
| React | User Interface |
| Vite | Build Tool |
| TypeScript | Static Typing |
| Tailwind CSS | Styling |
| shadcn/ui | UI Components |
| Zustand | Global State Management |
| Axios | HTTP Client |
| React Hook Form | Form Management |
| Zod | Form Validation |
| TanStack Query *(Opsional)* | Server State Management |

---

# 📌 Catatan

Seluruh teknologi Frontend dipilih dengan mempertimbangkan keseimbangan antara **kemudahan pengembangan**, **performa**, **maintainability**, **dokumentasi**, serta **skalabilitas**, sehingga SIMAHATI OpRec dapat terus dikembangkan menjadi modul utama dalam Sistem Informasi Manajemen Himpunan Mahasiswa Teknik Informatika (SIMAHATI).