import { useState, useEffect } from 'react';
import './StatusPendaftaran.css';
import { Alert } from '../components/Alert';
import { StatusBadge } from '../components/StatusBadge';
import { type PesertaRecord } from '../types/pendaftaran';
import { getAuthToken } from '../api';

interface StatusPendaftaranProps {
  pesertaId: number;
  onBack: () => void;
}

// Urutan tahapan seleksi
const TAHAPAN = [
  { key: 'draft',     label: 'Formulir Dibuat',     desc: 'Formulir pendaftaran berhasil disimpan.' },
  { key: 'submitted', label: 'Berkas Dikirim',       desc: 'Formulir dan dokumen telah dikirim ke panitia.' },
  { key: 'interview', label: 'Jadwal Interview',     desc: 'Kamu terpilih untuk mengikuti sesi interview.' },
  { key: 'accepted',  label: 'Diterima',             desc: 'Selamat! Kamu resmi menjadi anggota HMTI.' },
];

const SELEKSI_ORDER = ['draft', 'submitted', 'interview', 'accepted', 'rejected'];

function getStepIndex(status: string): number {
  return SELEKSI_ORDER.indexOf(status);
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export const StatusPendaftaran = ({ pesertaId, onBack }: StatusPendaftaranProps) => {
  const [peserta, setPeserta]     = useState<PesertaRecord | null>(null);
  const [loading, setLoading]     = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    fetch(`/api/peserta/${pesertaId}`, { headers })
      .then(r => r.json())
      .then(json => {
        if (json.success) setPeserta(json.data);
        else setFetchError('Data peserta tidak ditemukan.');
      })
      .catch(() => setFetchError('Gagal mengambil data dari server.'))
      .finally(() => setLoading(false));
  }, [pesertaId]);

  if (loading) return (
    <div className="status-pend-layout">
      <div className="status-pend-body">
        <p className="preview-loading">⏳ Memuat status...</p>
      </div>
    </div>
  );

  if (fetchError || !peserta) return (
    <div className="status-pend-layout">
      <div className="status-pend-body">
        <Alert type="error" message={fetchError ?? 'Data tidak ditemukan.'} />
        <button style={{ marginTop: '1rem' }} onClick={onBack}>← Kembali</button>
      </div>
    </div>
  );

  const currentSeleksiIdx = getStepIndex(peserta.status_seleksi);
  const isRejected = peserta.status_seleksi === 'rejected';

  return (
    <div className="status-pend-layout">
      <header className="status-pend-header">
        <button className="status-pend-header__back" onClick={onBack} aria-label="Kembali">←</button>
        <h1 className="status-pend-header__title">Status Pendaftaran</h1>
      </header>

      <div className="status-pend-body">
        {/* Ditolak — banner khusus */}
        {isRejected && (
          <Alert type="error" message="Pendaftaranmu tidak lolos seleksi berkas. Silakan hubungi panitia untuk informasi lebih lanjut." />
        )}

        {/* Hero */}
        <div className="status-hero">
          <p className="status-hero__label">Status Pendaftaran</p>
          <p className="status-hero__name">{peserta.nama_lengkap}</p>
          <p className="status-hero__nim">NIM: {peserta.nim}</p>
        </div>

        {/* Info ringkas */}
        <div className="status-info-card">
          <h2 className="status-info-card__title">Informasi Pendaftaran</h2>
          <div className="status-info-row">
            <span className="status-info-row__label">Tanggal Daftar</span>
            <span className="status-info-row__value">
              {formatDate(peserta.pendaftaran?.tanggal_daftar)}
            </span>
          </div>
          <div className="status-info-row">
            <span className="status-info-row__label">Status Berkas</span>
            <StatusBadge status={peserta.status_verifikasi} />
          </div>
          <div className="status-info-row">
            <span className="status-info-row__label">Status Seleksi</span>
            <StatusBadge status={peserta.status_seleksi} />
          </div>
          <div className="status-info-row">
            <span className="status-info-row__label">Dokumen Terunggah</span>
            <span className="status-info-row__value">{peserta.uploads?.length ?? 0} file</span>
          </div>
        </div>

        {/* Catatan admin (jika ada) */}
        {peserta.pendaftaran?.catatan_admin && (
          <div className="status-catatan">
            <strong>📝 Catatan dari Panitia:</strong>
            {peserta.pendaftaran.catatan_admin}
          </div>
        )}

        {/* Timeline seleksi */}
        <div className="status-timeline">
          <h2 className="status-timeline__title">Alur Seleksi</h2>
          <div className="status-timeline__list">
            {TAHAPAN.map((tahap, idx) => {
              const isDone   = !isRejected && currentSeleksiIdx > idx;
              const isActive = !isRejected && currentSeleksiIdx === idx;

              return (
                <div
                  key={tahap.key}
                  className={`status-tl-item ${isDone ? 'status-tl-item--done' : ''}`}
                >
                  <div className={[
                    'status-tl-dot',
                    isDone   ? 'status-tl-dot--done'   : '',
                    isActive ? 'status-tl-dot--active' : '',
                  ].join(' ')}>
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <div className="status-tl-content">
                    <p className="status-tl-content__label">{tahap.label}</p>
                    <p className="status-tl-content__desc">{tahap.desc}</p>
                    {isActive && (
                      <p className="status-tl-content__date">
                        {tahap.key === 'draft' || tahap.key === 'submitted'
                          ? formatDate(peserta.pendaftaran?.tanggal_daftar)
                          : 'Sedang diproses...'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
