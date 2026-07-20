import { useState, useEffect } from 'react';
import './PreviewPendaftaran.css';
import { Alert } from '../components/Alert';
import { StatusBadge } from '../components/StatusBadge';
import { DUMMY_DIVISI, type PesertaRecord, type UploadRecord } from '../types/pendaftaran';

interface PreviewPendaftaranProps {
  pesertaId: number;
  onBack: () => void;
  onSubmitSuccess: () => void;
}

// ─── Helper ────────────────────────────────────────────────────

function namaIcon(jenis: string): string {
  const map: Record<string, string> = { foto: '🖼️', ktm: '🪪', cv: '📄', sertifikat: '🏅' };
  return map[jenis] ?? '📁';
}

function namaLabel(jenis: string): string {
  const map: Record<string, string> = { foto: 'Foto', ktm: 'KTM', cv: 'CV', sertifikat: 'Sertifikat' };
  return map[jenis] ?? jenis;
}

function namaDivisi(id: string | number): string {
  const found = DUMMY_DIVISI.find(d => String(d.id) === String(id));
  return found ? found.nama : `Divisi #${id}`;
}

// ─── Sub-komponen ──────────────────────────────────────────────

const PreviewItem = ({ label, value, full }: { label: string; value: string | null | undefined; full?: boolean }) => (
  <div className={`preview-item ${full ? 'preview-item--full' : ''}`}>
    <span className="preview-item__label">{label}</span>
    <span className={`preview-item__value ${!value ? 'preview-item__value--empty' : ''}`}>
      {value || '—'}
    </span>
  </div>
);

// ─── Komponen utama ────────────────────────────────────────────

export const PreviewPendaftaran = ({ pesertaId, onBack, onSubmitSuccess }: PreviewPendaftaranProps) => {
  const [peserta, setPeserta]   = useState<PesertaRecord | null>(null);
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [apiError, setApiError]     = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/peserta/${pesertaId}`, { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(json => {
        if (json.success) setPeserta(json.data);
        else setFetchError('Data peserta tidak ditemukan.');
      })
      .catch(() => setFetchError('Gagal mengambil data dari server.'))
      .finally(() => setLoading(false));
  }, [pesertaId]);

  const handleSubmit = async () => {
    if (!peserta?.pendaftaran) return;
    setSubmitting(true);
    setApiError(null);

    try {
      const res = await fetch(`/api/pendaftaran/${peserta.pendaftaran.id}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify({ status: 'submitted' }),
      });

      const json = await res.json();
      if (!res.ok) { setApiError(json.message ?? 'Gagal submit pendaftaran.'); return; }
      onSubmitSuccess();
    } catch {
      setApiError('Gagal terhubung ke server.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="preview-loading">⏳ Memuat data...</div>;

  if (fetchError) return (
    <div className="preview-layout">
      <div className="preview-body">
        <Alert type="error" message={fetchError} />
        <button className="btn-preview-edit" onClick={onBack}>← Kembali</button>
      </div>
    </div>
  );

  if (!peserta) return null;

  const docs: UploadRecord[] = peserta.uploads ?? [];

  return (
    <div className="preview-layout">
      <header className="preview-header">
        <button className="preview-header__back" onClick={onBack} aria-label="Kembali">←</button>
        <h1 className="preview-header__title">Preview Data Pendaftaran</h1>
      </header>

      <div className="preview-body">
        {apiError && <Alert type="error" message={apiError} onClose={() => setApiError(null)} />}

        <Alert
          type="info"
          message="Periksa kembali seluruh data sebelum submit. Setelah di-submit, data tidak dapat diubah kecuali melalui admin."
        />

        {/* Status */}
        <div className="preview-section">
          <h2 className="preview-section__title">📋 Status Pendaftaran</h2>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Verifikasi:</span>
            <StatusBadge status={peserta.status_verifikasi} />
            <span style={{ fontSize: '0.85rem', color: '#6b7280', marginLeft: '0.5rem' }}>Seleksi:</span>
            <StatusBadge status={peserta.status_seleksi} />
          </div>
        </div>

        {/* Data Diri */}
        <div className="preview-section">
          <h2 className="preview-section__title">👤 Data Diri</h2>
          <div className="preview-grid">
            <PreviewItem label="Nama Lengkap"   value={peserta.nama_lengkap} />
            <PreviewItem label="NIM"            value={peserta.nim} />
            <PreviewItem label="Semester"       value={String(peserta.semester)} />
            <PreviewItem label="Angkatan"       value={String(peserta.angkatan)} />
            <PreviewItem label="Program Studi"  value={peserta.program_studi} full />
            <PreviewItem label="Email"          value={peserta.email} />
            <PreviewItem label="Nomor HP"       value={peserta.nomor_hp} />
            <PreviewItem label="Alamat"         value={peserta.alamat} full />
          </div>
        </div>

        {/* Organisasi */}
        <div className="preview-section">
          <h2 className="preview-section__title">🏢 Pengalaman Organisasi</h2>
          <div className="preview-grid">
            <PreviewItem label="Pengalaman Organisasi" value={peserta.pengalaman_organisasi} full />
            <PreviewItem label="Skill"                 value={peserta.skill} full />
            <PreviewItem label="Prestasi"              value={peserta.prestasi} full />
          </div>
        </div>

        {/* Divisi */}
        <div className="preview-section">
          <h2 className="preview-section__title">🏷️ Pilihan Divisi</h2>
          <div className="preview-grid">
            <PreviewItem label="Pilihan Divisi 1" value={namaDivisi(peserta.pilihan_divisi_1)} />
            <PreviewItem label="Pilihan Divisi 2" value={peserta.pilihan_divisi_2 ? namaDivisi(peserta.pilihan_divisi_2) : '—'} />
          </div>
        </div>

        {/* Essay */}
        <div className="preview-section">
          <h2 className="preview-section__title">✍️ Essay</h2>
          <div className="preview-grid">
            <PreviewItem label="Motivasi"   value={peserta.motivasi}   full />
            <PreviewItem label="Kontribusi" value={peserta.kontribusi} full />
            <PreviewItem label="Harapan"    value={peserta.harapan}    full />
          </div>
        </div>

        {/* Dokumen */}
        <div className="preview-section">
          <h2 className="preview-section__title">📎 Dokumen Terunggah</h2>
          {docs.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>Belum ada dokumen diunggah.</p>
          ) : (
            <div className="preview-docs-grid">
              {docs.map((doc: UploadRecord) => (
                <div key={doc.id} className="preview-doc-card">
                  {doc.file_url && doc.mime_type.startsWith('image/')
                    ? <img src={doc.file_url} alt={namaLabel(doc.jenis_dokumen)} className="preview-doc-card__thumb" />
                    : <div className="preview-doc-card__icon">{namaIcon(doc.jenis_dokumen)}</div>
                  }
                  <span className="preview-doc-card__label">{namaLabel(doc.jenis_dokumen)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="preview-footer">
          <button className="btn-preview-edit" onClick={onBack}>← Edit Data</button>
          <button
            className="btn-preview-submit"
            onClick={handleSubmit}
            disabled={submitting || peserta.pendaftaran?.status === 'submitted'}
          >
            {submitting
              ? 'Menyimpan...'
              : peserta.pendaftaran?.status === 'submitted'
                ? '✓ Sudah Terkirim'
                : 'Submit Pendaftaran ✓'
            }
          </button>
        </div>
      </div>
    </div>
  );
};
