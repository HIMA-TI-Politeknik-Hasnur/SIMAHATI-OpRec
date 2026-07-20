import { useState, useEffect } from 'react';
import './FormPendaftaran.css';
import { ProgressStep } from '../components/ProgressStep';
import { Alert } from '../components/Alert';
import { apiGet, getAuthToken } from '../api';
import {
  INITIAL_FORM,
  validateDataDiri,
  validateDivisi,
  validateEssay,
  hasErrors,
  type FormPendaftaranData,
  type PesertaRecord,
  type ValidationErrors,
} from '../types/pendaftaran';

interface FormPendaftaranProps {
  onBack: () => void;
  onSuccess: (pesertaId: number) => void;
  inline?: boolean;
  pesertaId?: number | null;
  existingData?: PesertaRecord | null;
}

const STEPS = [
  { label: 'Data Diri' },
  { label: 'Organisasi' },
  { label: 'Divisi' },
  { label: 'Essay' },
];

// ─── Helper: satu field form ───────────────────────────────────

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  full?: boolean;
}

const Field = ({ label, required, error, hint, children, full }: FieldProps) => (
  <div className={`form-field ${error ? 'form-field--error' : ''} ${full ? 'form-field--full' : ''}`}>
    <label>
      {label}
      {required && <span className="required"> *</span>}
    </label>
    {children}
    {hint  && <span className="form-field__hint">{hint}</span>}
    {error && <span className="form-field__error">{error}</span>}
  </div>
);

// ─── Komponen utama ────────────────────────────────────────────

interface DivisiOption {
  id: number;
  nama: string;
}

export const FormPendaftaran = ({ onBack, onSuccess, inline, pesertaId, existingData }: FormPendaftaranProps) => {
  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState<FormPendaftaranData>(
    () => {
      if (!existingData) return INITIAL_FORM;
      return {
        nama_lengkap:          existingData.nama_lengkap ?? '',
        nim:                   existingData.nim ?? '',
        semester:              String(existingData.semester ?? ''),
        program_studi:         existingData.program_studi ?? '',
        angkatan:              String(existingData.angkatan ?? ''),
        email:                 existingData.email ?? '',
        nomor_hp:              existingData.nomor_hp ?? '',
        alamat:                existingData.alamat ?? '',
        pengalaman_organisasi: existingData.pengalaman_organisasi ?? '',
        skill:                 existingData.skill ?? '',
        prestasi:              existingData.prestasi ?? '',
        pilihan_divisi_1:      String(existingData.pilihan_divisi_1 ?? ''),
        pilihan_divisi_2:      existingData.pilihan_divisi_2 ? String(existingData.pilihan_divisi_2) : '',
        motivasi:              existingData.motivasi ?? '',
        kontribusi:            existingData.kontribusi ?? '',
        harapan:               existingData.harapan ?? '',
      };
    }
  );
  const [errors, setErrors] = useState<ValidationErrors<FormPendaftaranData>>({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [divisiList, setDivisiList] = useState<DivisiOption[]>([]);

  useEffect(() => {
    apiGet<{ success: boolean; data: DivisiOption[] }>('/api/divisi')
      .then(res => { if (res.data?.success) setDivisiList(res.data.data); })
      .catch(() => {});
  }, []);

  const set = (key: keyof FormPendaftaranData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));

  // ─── Validasi per step ──────────────────────────────────────
  const validateCurrentStep = (): boolean => {
    let errs: ValidationErrors<FormPendaftaranData> = {};
    if (step === 0) errs = validateDataDiri(form);
    if (step === 2) errs = validateDivisi(form);
    if (step === 3) errs = validateEssay(form);
    setErrors(errs);
    return !hasErrors(errs);
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setApiError(null);
    setStep(s => s + 1);
  };

  const handlePrev = () => {
    setErrors({});
    setApiError(null);
    setStep(s => s - 1);
  };

  // ─── Submit ke API ──────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    setLoading(true);
    setApiError(null);

    try {
      const payload = {
        ...form,
        semester:         Number(form.semester),
        angkatan:         Number(form.angkatan),
        pilihan_divisi_1: Number(form.pilihan_divisi_1),
        pilihan_divisi_2: form.pilihan_divisi_2 ? Number(form.pilihan_divisi_2) : null,
      };

      const token = getAuthToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json', Accept: 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const isUpdate = !!pesertaId;
      const url = isUpdate ? `/api/peserta/${pesertaId}` : '/api/peserta';
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      const json = await res.json();

      if (!res.ok) {
        const messages: string[] = json.errors
          ? Object.values(json.errors).flat() as string[]
          : [json.message ?? 'Terjadi kesalahan.'];
        setApiError(messages.join(' | '));
        return;
      }

      const savedId = json.data.id;
      await fetch('/api/pendaftaran', {
        method:  'POST',
        headers,
        body:    JSON.stringify({ peserta_id: savedId, status: 'draft' }),
      });

      onSuccess(savedId);
    } catch {
      setApiError('Gagal terhubung ke server. Pastikan backend sudah berjalan.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Render per step ────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="form-grid-2">
              <Field label="Nama Lengkap" required error={errors.nama_lengkap}>
                <input value={form.nama_lengkap} onChange={set('nama_lengkap')} placeholder="Contoh: Ahmad Fauzi" />
              </Field>
              <Field label="NIM" required error={errors.nim}>
                <input value={form.nim} onChange={set('nim')} placeholder="Contoh: 2024001" />
              </Field>
              <Field label="Semester" required error={errors.semester}>
                <input type="number" min={1} max={14} value={form.semester} onChange={set('semester')} placeholder="1" />
              </Field>
              <Field label="Angkatan" required error={errors.angkatan}>
                <input type="number" value={form.angkatan} onChange={set('angkatan')} placeholder="2024" />
              </Field>
              <Field label="Program Studi" required error={errors.program_studi} full>
                <input value={form.program_studi} onChange={set('program_studi')} placeholder="Teknik Informatika" />
              </Field>
              <Field label="Email" required error={errors.email}>
                <input type="email" value={form.email} onChange={set('email')} placeholder="nama@email.com" />
              </Field>
              <Field label="Nomor HP" required error={errors.nomor_hp} hint="Format: 08xxx atau +62xxx">
                <input type="tel" value={form.nomor_hp} onChange={set('nomor_hp')} placeholder="081234567890" />
              </Field>
              <Field label="Alamat" required error={errors.alamat} full>
                <textarea value={form.alamat} onChange={set('alamat')} placeholder="Alamat lengkap tempat tinggal saat ini" rows={3} />
              </Field>
            </div>
          </>
        );

      case 1:
        return (
          <>
            <Field label="Pengalaman Organisasi" hint="Opsional — kosongkan jika tidak ada">
              <textarea value={form.pengalaman_organisasi} onChange={set('pengalaman_organisasi')}
                placeholder="Contoh: Ketua OSIS SMA X (2022–2023)" className="tall" />
            </Field>
            <Field label="Skill" hint="Opsional — pisahkan dengan koma">
              <textarea value={form.skill} onChange={set('skill')}
                placeholder="Contoh: Microsoft Office, Python, Desain Grafis" rows={3} />
            </Field>
            <Field label="Prestasi" hint="Opsional — tuliskan prestasi yang pernah diraih">
              <textarea value={form.prestasi} onChange={set('prestasi')}
                placeholder="Contoh: Juara 2 Lomba Karya Tulis Ilmiah tingkat Nasional 2023" className="tall" />
            </Field>
          </>
        );

      case 2:
        return (
          <>
            <Field label="Pilihan Divisi 1" required error={errors.pilihan_divisi_1}
              hint="Pilihan utama divisi yang ingin kamu masuki">
              <select value={form.pilihan_divisi_1} onChange={set('pilihan_divisi_1')}>
                <option value="">-- Pilih Divisi --</option>
                {divisiList.map(d => (
                  <option key={d.id} value={String(d.id)}>{d.nama}</option>
                ))}
              </select>
            </Field>
            <Field label="Pilihan Divisi 2" error={errors.pilihan_divisi_2}
              hint="Opsional — pilihan cadangan jika pilihan 1 tidak tersedia">
              <select value={form.pilihan_divisi_2} onChange={set('pilihan_divisi_2')}>
                <option value="">-- Tidak Ada --</option>
                {divisiList.filter(d => String(d.id) !== form.pilihan_divisi_1).map(d => (
                  <option key={d.id} value={String(d.id)}>{d.nama}</option>
                ))}
              </select>
            </Field>
          </>
        );

      case 3:
        return (
          <>
            <Field label="Motivasi" required error={errors.motivasi}
              hint="Mengapa kamu ingin bergabung dengan HMTI?">
              <textarea value={form.motivasi} onChange={set('motivasi')}
                placeholder="Tulis motivasimu bergabung di sini..." className="tall" />
            </Field>
            <Field label="Kontribusi" required error={errors.kontribusi}
              hint="Kontribusi apa yang bisa kamu berikan untuk HMTI?">
              <textarea value={form.kontribusi} onChange={set('kontribusi')}
                placeholder="Tuliskan kontribusi yang ingin kamu berikan..." className="tall" />
            </Field>
            <Field label="Harapan" required error={errors.harapan}
              hint="Apa yang kamu harapkan setelah bergabung dengan HMTI?">
              <textarea value={form.harapan} onChange={set('harapan')}
                placeholder="Tuliskan harapanmu bergabung bersama kami..." className="tall" />
            </Field>
          </>
        );
    }
  };

  // ─── Render utama ───────────────────────────────────────────
  const stepTitles = ['Data Diri', 'Pengalaman Organisasi', 'Pilihan Divisi', 'Essay'];

  const content = (
    <div className="form-pend-body">
      <ProgressStep steps={STEPS} currentStep={step} />

      {apiError && (
        <Alert type="error" message={apiError} onClose={() => setApiError(null)} />
      )}

      <div className="form-pend-card">
        <h2 className="form-pend-card__title">{stepTitles[step]}</h2>
        {renderStep()}

        <div className="form-pend-nav">
          {step > 0
            ? <button className="btn-pend-prev" onClick={handlePrev}>← Sebelumnya</button>
            : <span />
          }
          {step < STEPS.length - 1 ? (
            <button className="btn-pend-next" onClick={handleNext}>Selanjutnya →</button>
          ) : (
            <button className="btn-pend-next" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan & Lanjut Upload Dokumen →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (inline) return content;
  return (
    <div className="form-pend-layout">
      <header className="form-pend-header">
        <button className="form-pend-header__back" onClick={onBack} aria-label="Kembali">←</button>
        <h1 className="form-pend-header__title">Form Pendaftaran HMTI</h1>
      </header>
      {content}
    </div>
  );
};
