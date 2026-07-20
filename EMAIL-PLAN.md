# Implementasi Email & Forgot Password

## 1. Backend — Konfigurasi Mail
- Set `MAIL_MAILER=smtp`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION`, `MAIL_FROM_ADDRESS` di `.env`
- Tambahin ke `setup_env_interactive()` di dev.sh — tanya SMTP config
- Fallback: `MAIL_MAILER=log` buat development (gak kirim beneran)

## 2. Backend — Forgot Password
- Laravel sudah include `Illuminate\Auth\Notifications\ResetPassword`
- Route: `POST /api/forgot-password` → kirim email reset link
- Route: `POST /api/reset-password` → terima token + password baru
- Notifikasi kustom: `App\Notifications\ResetPasswordNotification`

## 3. Backend — Notifikasi Email
- `PesertaRegistered` → konfirmasi pendaftaran
- `BerkasDiverifikasi` → email saat admin verifikasi (diterima/ditolak)
- `PengumumanSeleksi` → lolos/interview/diterima

## 4. Frontend — Forgot Password Flow
- `ForgotPasswordPage`: input email → submit → "Cek email"
- `ResetPasswordPage`: ambil token dari URL → form password baru → submit

## Prioritas
1. Forgot Password (paling krusial)
2. Notifikasi email pendaftaran & verifikasi
