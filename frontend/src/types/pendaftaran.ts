/**
 * Tipe data terpusat untuk fitur Pendaftaran (Nadil).
 * Dipakai oleh semua halaman dan komponen terkait.
 */

// ─── API base URL ─────────────────────────────────────────────────────────────
export const API_BASE = '/api';

// ─── Form data pendaftaran (semua step) ───────────────────────────────────────

export interface FormDataDiri {
  nama_lengkap:   string;
  nim:            string;
  semester:       string;
  program_studi:  string;
  angkatan:       string;
  email:          string;
  nomor_hp:       string;
  alamat:         string;
}

export interface FormOrganisasi {
  pengalaman_organisasi: string;
  skill:                 string;
  prestasi:              string;
}

export interface FormDivisi {
  pilihan_divisi_1: string;
  pilihan_divisi_2: string;
}

export interface FormEssay {
  motivasi:    string;
  kontribusi:  string;
  harapan:     string;
}

export interface FormPendaftaranData
  extends FormDataDiri,
    FormOrganisasi,
    FormDivisi,
    FormEssay {}

export const INITIAL_FORM: FormPendaftaranData = {
  nama_lengkap:          '',
  nim:                   '',
  semester:              '',
  program_studi:         '',
  angkatan:              '',
  email:                 '',
  nomor_hp:              '',
  alamat:                '',
  pengalaman_organisasi: '',
  skill:                 '',
  prestasi:              '',
  pilihan_divisi_1:      '',
  pilihan_divisi_2:      '',
  motivasi:              '',
  kontribusi:            '',
  harapan:               '',
};

// ─── Response dari API ────────────────────────────────────────────────────────

export interface UploadRecord {
  id:             number;
  peserta_id:     number;
  jenis_dokumen:  'foto' | 'ktm' | 'cv' | 'sertifikat';
  original_name:  string;
  file_path:      string;
  file_url?:      string;
  mime_type:      string;
  ukuran_file:    number;
  created_at:     string;
}

export interface PendaftaranRecord {
  id:             number;
  peserta_id:     number;
  tanggal_daftar: string | null;
  status:         'draft' | 'submitted' | 'verified' | 'rejected';
  catatan_admin:  string | null;
  created_at:     string;
}

export interface PesertaRecord extends FormPendaftaranData {
  id:                 number;
  user_id:            number;
  status_verifikasi:  'pending' | 'verified' | 'rejected';
  status_seleksi:     'draft' | 'submitted' | 'interview' | 'accepted' | 'rejected';
  pendaftaran:        PendaftaranRecord | null;
  uploads:            UploadRecord[];
  created_at:         string;
}

// ─── Validasi client-side ─────────────────────────────────────────────────────

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidNim(nim: string): boolean {
  return nim.trim().length >= 5 && nim.trim().length <= 20;
}

function isValidNomorHp(hp: string): boolean {
  return /^(\+62|62|0)[0-9]{8,14}$/.test(hp.replace(/\s/g, ''));
}

export function validateDataDiri(data: FormDataDiri): ValidationErrors<FormDataDiri> {
  const errors: ValidationErrors<FormDataDiri> = {};

  if (!data.nama_lengkap.trim()) errors.nama_lengkap = 'Nama lengkap wajib diisi.';

  if (!data.nim.trim())              errors.nim = 'NIM wajib diisi.';
  else if (!isValidNim(data.nim))    errors.nim = 'NIM tidak valid (5–20 karakter).';

  const sem = Number(data.semester);
  if (!data.semester) errors.semester = 'Semester wajib diisi.';
  else if (!Number.isInteger(sem) || sem < 1 || sem > 14)
    errors.semester = 'Semester harus antara 1–14.';

  if (!data.program_studi.trim())  errors.program_studi = 'Program studi wajib diisi.';

  const ang = Number(data.angkatan);
  if (!data.angkatan)              errors.angkatan = 'Angkatan wajib diisi.';
  else if (String(ang).length !== 4)
    errors.angkatan = 'Angkatan harus 4 digit (contoh: 2024).';

  if (!data.email.trim())          errors.email = 'Email wajib diisi.';
  else if (!isValidEmail(data.email)) errors.email = 'Format email tidak valid.';

  if (!data.nomor_hp.trim())       errors.nomor_hp = 'Nomor HP wajib diisi.';
  else if (!isValidNomorHp(data.nomor_hp))
    errors.nomor_hp = 'Format nomor HP tidak valid (contoh: 08123456789).';

  if (!data.alamat.trim())         errors.alamat = 'Alamat wajib diisi.';

  return errors;
}

export function validateDivisi(data: FormDivisi): ValidationErrors<FormDivisi> {
  const errors: ValidationErrors<FormDivisi> = {};
  if (!data.pilihan_divisi_1) errors.pilihan_divisi_1 = 'Pilihan divisi 1 wajib dipilih.';
  if (data.pilihan_divisi_1 && data.pilihan_divisi_2 && data.pilihan_divisi_1 === data.pilihan_divisi_2)
    errors.pilihan_divisi_2 = 'Pilihan divisi 2 tidak boleh sama dengan pilihan 1.';
  return errors;
}

export function validateEssay(data: FormEssay): ValidationErrors<FormEssay> {
  const errors: ValidationErrors<FormEssay> = {};
  if (!data.motivasi.trim())    errors.motivasi   = 'Motivasi wajib diisi.';
  if (!data.kontribusi.trim())  errors.kontribusi = 'Kontribusi wajib diisi.';
  if (!data.harapan.trim())     errors.harapan    = 'Harapan wajib diisi.';
  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(v => v !== undefined && v !== '');
}

// ─── Dummy divisi (sebelum API divisi Anton tersedia) ─────────────────────────
export const DUMMY_DIVISI = [
  { id: 1, nama: 'Departemen Pendidikan dan Riset' },
  { id: 2, nama: 'Departemen Hubungan Masyarakat' },
  { id: 3, nama: 'Departemen Kewirausahaan' },
  { id: 4, nama: 'Departemen Minat dan Bakat' },
  { id: 5, nama: 'Departemen Teknologi Informasi' },
];
