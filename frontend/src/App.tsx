import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { CmsPanel } from './pages/CmsPanel';

// ─── Halaman Nadil: Pendaftaran ───────────────────────────────
import { DashboardPeserta }    from './pages/DashboardPeserta';
import { FormPendaftaran }     from './pages/FormPendaftaran';
import { UploadDokumen }       from './pages/UploadDokumen';
import { PreviewPendaftaran }  from './pages/PreviewPendaftaran';
import { StatusPendaftaran }   from './pages/StatusPendaftaran';

// Halaman yang tersedia
type Page =
  | 'landing'
  | 'dashboard'
  | 'cms'
  | 'dashboard-peserta'
  | 'form-pendaftaran'
  | 'upload-dokumen'
  | 'preview-pendaftaran'
  | 'status-pendaftaran';

// Demo peserta ID — akan diganti dengan ID dari session auth (Reyhan)
const DEMO_PESERTA_ID = 1;

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [pesertaId,   setPesertaId]   = useState<number>(DEMO_PESERTA_ID);

  // ─── Navigasi dari DashboardPeserta ke sub-halaman ───────────
  const handlePesertaNavigate = (page: string, id?: number) => {
    if (id) setPesertaId(id);
    const pageMap: Record<string, Page> = {
      form:    'form-pendaftaran',
      upload:  'upload-dokumen',
      preview: 'preview-pendaftaran',
      status:  'status-pendaftaran',
    };
    if (pageMap[page]) setCurrentPage(pageMap[page]);
  };

  // ─── Tombol navigasi developer (demo) ────────────────────────
  const navButtons: { label: string; page: Page }[] = [
    { label: 'Landing Page',        page: 'landing'             },
    { label: 'Dashboard Admin',     page: 'dashboard'           },
    { label: 'CMS Admin',           page: 'cms'                 },
    { label: '📋 Dashboard Peserta', page: 'dashboard-peserta'  },
    { label: '📝 Form Pendaftaran',  page: 'form-pendaftaran'   },
    { label: '📎 Upload Dokumen',    page: 'upload-dokumen'     },
    { label: '👁️ Preview',           page: 'preview-pendaftaran'},
    { label: '🔔 Status',            page: 'status-pendaftaran' },
  ];

  return (
    <div>
      {/* ─── Dev nav bar ─────────────────────────────────────── */}
      <div style={{
        background: '#1e293b', padding: '8px 12px',
        display: 'flex', gap: '6px', flexWrap: 'wrap',
        justifyContent: 'center', zIndex: 1000, position: 'relative',
      }}>
        {navButtons.map(({ label, page }) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              padding: '6px 12px',
              background: currentPage === page ? '#3b82f6' : '#334155',
              color: 'white', border: 'none', borderRadius: '4px',
              cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ─── Halaman aktif ───────────────────────────────────── */}

      {currentPage === 'landing' && <LandingPage />}

      {currentPage === 'dashboard' && <Dashboard />}

      {currentPage === 'cms' && <CmsPanel />}

      {/* Halaman Nadil */}
      {currentPage === 'dashboard-peserta' && (
        <DashboardPeserta
          pesertaId={pesertaId}
          onNavigate={handlePesertaNavigate}
        />
      )}

      {currentPage === 'form-pendaftaran' && (
        <FormPendaftaran
          onBack={() => setCurrentPage('dashboard-peserta')}
          onSuccess={(id) => {
            setPesertaId(id);
            setCurrentPage('upload-dokumen');
          }}
        />
      )}

      {currentPage === 'upload-dokumen' && (
        <UploadDokumen
          pesertaId={pesertaId}
          onBack={() => setCurrentPage('form-pendaftaran')}
          onSuccess={() => setCurrentPage('preview-pendaftaran')}
        />
      )}

      {currentPage === 'preview-pendaftaran' && (
        <PreviewPendaftaran
          pesertaId={pesertaId}
          onBack={() => setCurrentPage('upload-dokumen')}
          onSubmitSuccess={() => setCurrentPage('status-pendaftaran')}
        />
      )}

      {currentPage === 'status-pendaftaran' && (
        <StatusPendaftaran
          pesertaId={pesertaId}
          onBack={() => setCurrentPage('dashboard-peserta')}
        />
      )}
    </div>
  );
}

export default App;
