import { useState, useEffect } from 'react';
import './DashboardPeserta.css';
import { StatusBadge } from '../components/StatusBadge';
import { Alert } from '../components/Alert';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { type PesertaRecord } from '../types/pendaftaran';
import { apiGet } from '../api';
import { FormPendaftaran } from './FormPendaftaran';
import { UploadDokumen } from './UploadDokumen';
import { PreviewPendaftaran } from './PreviewPendaftaran';
import { StatusPendaftaran } from './StatusPendaftaran';

interface DashboardPesertaProps {
  pesertaId: number;
}

interface Pengumuman {
  id: number;
  judul: string;
  isi: string;
  tipe: 'info' | 'warning' | 'success' | 'danger';
  published_at: string;
}

// ─── Demo peserta fallback (saat backend belum berjalan) ───────
const DEMO: PesertaRecord = {
  id: 1, user_id: 1,
  nama_lengkap: 'Ahmad Fauzi', nim: '2024001',
  semester: '3' as unknown as string, program_studi: 'Teknik Informatika', angkatan: '2024' as unknown as string,
  email: 'ahmad@example.com', nomor_hp: '081234567890', alamat: 'Banjarmasin',
  pengalaman_organisasi: '', skill: '', prestasi: '',
  pilihan_divisi_1: '1', pilihan_divisi_2: '',
  motivasi: '', kontribusi: '', harapan: '',
  status_verifikasi: 'pending', status_seleksi: 'submitted',
  pendaftaran: { id: 1, peserta_id: 1, tanggal_daftar: new Date().toISOString(), status: 'submitted', catatan_admin: null, created_at: new Date().toISOString() },
  uploads: [],
  created_at: new Date().toISOString(),
};

export const DashboardPeserta = ({ pesertaId }: DashboardPesertaProps) => {
  const [peserta, setPeserta] = useState<PesertaRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [localPesertaId, setLocalPesertaId] = useState(pesertaId);
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>([]);
  const [pengumumanLoading, setPengumumanLoading] = useState(false);

  // Fetch pengumuman publik
  useEffect(() => {
    setPengumumanLoading(true);
    fetch('/api/pengumuman/publik', { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(json => { if (json.success) setPengumumanList(json.data ?? []); })
      .catch(() => {/* abaikan error — pengumuman tidak wajib */})
      .finally(() => setPengumumanLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiGet<{ success: boolean; data: PesertaRecord }>(`/api/peserta/${localPesertaId}`)
      .then(res => {
        if (res.data?.success) setPeserta(res.data.data);
        else { setError('Data tidak ditemukan.'); }
      })
      .catch(() => { setError('Tidak bisa terhubung ke server, menampilkan demo.'); setPeserta(DEMO); })
      .finally(() => setLoading(false));
  }, [localPesertaId, activeNav]);

  const navItems = [
    { key: 'dashboard', icon: '📊', label: 'Dashboard' },
    { key: 'form',      icon: '📝', label: 'Form Pendaftaran' },
    { key: 'upload',    icon: '📎', label: 'Upload Dokumen' },
    { key: 'preview',   icon: '👁️', label: 'Preview Data' },
    { key: 'status',    icon: '🔔', label: 'Status' },
  ];

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard Peserta',
    form:      'Form Pendaftaran',
    upload:    'Upload Dokumen',
    preview:   'Preview Data',
    status:    'Status Pendaftaran',
  };

  const handleNav = (key: string) => {
    setActiveNav(key);
  };

  const handleFormSuccess = (id: number) => {
    setLocalPesertaId(id);
    setActiveNav('upload');
  };

  const docsCount   = peserta?.uploads?.length ?? 0;
  const hasSubmitted = peserta?.pendaftaran?.status === 'submitted' ||
                       peserta?.pendaftaran?.status === 'verified';

  const renderContent = () => {
    switch (activeNav) {
      case 'form':
        return (
          <FormPendaftaran
            inline
            pesertaId={localPesertaId || peserta?.id}
            existingData={peserta}
            onBack={() => setActiveNav('dashboard')}
            onSuccess={handleFormSuccess}
          />
        );
      case 'upload':
        return (
          <UploadDokumen
            inline
            pesertaId={localPesertaId}
            existingUploads={peserta?.uploads}
            onBack={() => setActiveNav('form')}
            onSuccess={() => setActiveNav('preview')}
          />
        );
      case 'preview':
        return (
          <PreviewPendaftaran
            inline
            pesertaId={localPesertaId}
            onBack={() => setActiveNav('upload')}
            onSubmitSuccess={() => setActiveNav('status')}
          />
        );
      case 'status':
        return (
          <StatusPendaftaran
            inline
            pesertaId={localPesertaId}
            onBack={() => setActiveNav('dashboard')}
          />
        );
      default:
        return (
          <>
            {error && (
              <Alert type="warning" message={error} onClose={() => setError(null)} />
            )}

            {/* ─── Banner ────────────────────────────────────── */}
            <div className="dash-welcome-banner">
              <div className="dash-welcome-banner__text">
                <h2>Halo, {peserta?.nama_lengkap ?? 'Peserta'}! 👋</h2>
                <p>Selamat datang di portal pendaftaran HMTI. Pantau status pendaftaranmu di sini.</p>
              </div>
              <div className="dash-welcome-banner__badge">
                <span>Status Seleksi</span>
                <strong>{peserta?.status_seleksi?.toUpperCase() ?? '—'}</strong>
              </div>
            </div>

            {/* ─── Stat cards ────────────────────────────────── */}
            <div className="dash-stats-grid">
              <div className="dash-stat-card">
                <span className="dash-stat-card__icon">📋</span>
                <div>
                  <p className="dash-stat-card__label">Status Pendaftaran</p>
                  {peserta
                    ? <StatusBadge status={peserta.pendaftaran?.status ?? 'draft'} />
                    : <p className="dash-stat-card__value">—</p>
                  }
                </div>
              </div>
              <div className="dash-stat-card">
                <span className="dash-stat-card__icon">✅</span>
                <div>
                  <p className="dash-stat-card__label">Verifikasi Berkas</p>
                  {peserta
                    ? <StatusBadge status={peserta.status_verifikasi} />
                    : <p className="dash-stat-card__value">—</p>
                  }
                </div>
              </div>
              <div className="dash-stat-card">
                <span className="dash-stat-card__icon">📎</span>
                <div>
                  <p className="dash-stat-card__label">Dokumen Terunggah</p>
                  <p className="dash-stat-card__value">{docsCount} / 4 file</p>
                </div>
              </div>
              <div className="dash-stat-card">
                <span className="dash-stat-card__icon">🎯</span>
                <div>
                  <p className="dash-stat-card__label">Status Seleksi</p>
                  {peserta
                    ? <StatusBadge status={peserta.status_seleksi} />
                    : <p className="dash-stat-card__value">—</p>
                  }
                </div>
              </div>
            </div>

            {/* ─── Quick actions ──────────────────────────────── */}
            <h2 className="dash-quick-title">Aksi Cepat</h2>
            <div className="dash-quick-grid">
              {!hasSubmitted && (
                <button
                  className="dash-quick-card dash-quick-card--primary"
                  onClick={() => handleNav('form')}
                >
                  <span className="dash-quick-card__icon">📝</span>
                  <p className="dash-quick-card__label">Isi Form Pendaftaran</p>
                  <p className="dash-quick-card__desc">Lengkapi data diri, divisi, dan essay.</p>
                </button>
              )}
              <button className="dash-quick-card" onClick={() => handleNav('upload')}>
                <span className="dash-quick-card__icon">📎</span>
                <p className="dash-quick-card__label">Upload Dokumen</p>
                <p className="dash-quick-card__desc">
                  {docsCount > 0 ? `${docsCount} dokumen terunggah. Tambah atau ganti.` : 'Unggah foto, KTM, CV, dan sertifikat.'}
                </p>
              </button>
              <button className="dash-quick-card" onClick={() => handleNav('preview')}>
                <span className="dash-quick-card__icon">👁️</span>
                <p className="dash-quick-card__label">Preview & Submit</p>
                <p className="dash-quick-card__desc">Periksa kembali data sebelum mengirimkan.</p>
              </button>
              <button className="dash-quick-card" onClick={() => handleNav('status')}>
                <span className="dash-quick-card__icon">🔔</span>
                <p className="dash-quick-card__label">Cek Status</p>
                <p className="dash-quick-card__desc">Pantau perkembangan seleksimu secara real-time.</p>
              </button>
            </div>

            {/* ─── Pengumuman ─────────────────────────────────── */}
            <h2 className="dash-quick-title" style={{ marginTop: '1.5rem' }}>
              📢 Pengumuman
            </h2>
            {pengumumanLoading ? (
              <p className="dash-peserta-loading" style={{ padding: '1rem 0', textAlign: 'left' }}>
                Memuat pengumuman...
              </p>
            ) : pengumumanList.length === 0 ? (
              <div className="dash-empty-pengumuman">
                Belum ada pengumuman dari panitia.
              </div>
            ) : (
              <div className="dash-pengumuman-list">
                {pengumumanList.map(p => (
                  <AnnouncementCard
                    key={p.id}
                    id={p.id}
                    judul={p.judul}
                    isi={p.isi}
                    tipe={p.tipe}
                    published_at={p.published_at}
                  />
                ))}
              </div>
            )}
          </>
        );
    }
  };

  if (loading) return (
    <div className="dash-peserta-layout">
      <main className="dash-peserta-main">
        <div className="dash-peserta-loading">⏳ Memuat dashboard...</div>
      </main>
    </div>
  );

  return (
    <div className="dash-peserta-layout">
      {/* ─── Sidebar ─────────────────────────────────────────── */}
      <aside className="dash-peserta-sidebar">
        <div className="dash-peserta-sidebar-header">
          <h2 className="dash-peserta-sidebar-title">SIMAHATI OpRec</h2>
          <p className="dash-peserta-sidebar-subtitle">Portal Pendaftaran</p>
        </div>
        <nav className="dash-peserta-sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`dash-peserta-nav-item ${activeNav === item.key ? 'dash-peserta-nav-item--active' : ''}`}
              onClick={() => handleNav(item.key)}
            >
              <span className="dash-peserta-nav-item__icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        {peserta && (
          <div className="dash-peserta-sidebar-footer">
            <div className="dash-peserta-sidebar-user">{peserta.nama_lengkap}</div>
            <div className="dash-peserta-sidebar-email">{peserta.email}</div>
          </div>
        )}
      </aside>

      {/* ─── Main ────────────────────────────────────────────── */}
      <main className="dash-peserta-main">
        <div className="dash-peserta-topbar">
          <h1 className="dash-peserta-topbar__title">{pageTitles[activeNav]}</h1>
          <div className="dash-peserta-topbar__right">
            <span className="dash-peserta-topbar__greeting">
              Halo, {peserta?.nama_lengkap?.split(' ')[0] ?? 'Peserta'}!
            </span>
            <div className="dash-peserta-topbar__avatar" aria-label="Avatar pengguna">
              {peserta?.nama_lengkap?.[0]?.toUpperCase() ?? 'P'}
            </div>
          </div>
        </div>

        <div className="dash-peserta-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
