import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { CmsPanel } from './pages/CmsPanel';
import { DivisiPage } from './pages/DivisiPage';
import { DivisiDetailPage } from './pages/DivisiDetailPage';
import { InterviewPage } from './pages/InterviewPage';
import { PenilaianPage } from './pages/PenilaianPage';
import { DashboardDivisi } from './pages/DashboardDivisi';
import { DashboardPeserta } from './pages/DashboardPeserta';
import { FormPendaftaran } from './pages/FormPendaftaran';
import { UploadDokumen } from './pages/UploadDokumen';
import { PreviewPendaftaran } from './pages/PreviewPendaftaran';
import { StatusPendaftaran } from './pages/StatusPendaftaran';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

type Page =
  | 'landing'
  | 'dashboard'
  | 'cms'
  | 'divisi'
  | 'divisi-detail'
  | 'interview'
  | 'penilaian'
  | 'dashboard-divisi'
  | 'dashboard-peserta'
  | 'form-pendaftaran'
  | 'upload-dokumen'
  | 'preview-pendaftaran'
  | 'status-pendaftaran'
  | 'login'
  | 'register'
  | 'admin-dashboard'
  | 'forgot-password'
  | 'reset-password';

const navItems: { key: Page; label: string; group: 'rizky' | 'anton' }[] = [
  { key: 'landing',          label: 'Landing Page',         group: 'rizky' },
  { key: 'dashboard',        label: 'Dashboard Pendaftar',   group: 'rizky' },
  { key: 'cms',              label: 'CMS Admin',             group: 'rizky' },
  { key: 'dashboard-divisi', label: 'Dashboard Divisi',      group: 'anton' },
  { key: 'divisi',           label: 'Kelola Divisi',         group: 'anton' },
  { key: 'interview',        label: 'Jadwal Interview',      group: 'anton' },
  { key: 'penilaian',        label: 'Penilaian Interview',   group: 'anton' },
];

const DEMO_PESERTA_ID = 1;

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedDivisiId, setSelectedDivisiId] = useState<number | null>(null);
  const [pesertaId, setPesertaId] = useState<number>(DEMO_PESERTA_ID);

  const handleViewDivisiDetail = (id: number) => {
    setSelectedDivisiId(id);
    setCurrentPage('divisi-detail');
  };

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

  const btnStyle = (key: Page, group: 'rizky' | 'anton'): React.CSSProperties => ({
    padding: '8px 16px',
    background: currentPage === key || (key === 'divisi' && currentPage === 'divisi-detail')
      ? (group === 'anton' ? '#ea580c' : '#3b82f6')
      : '#334155',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.875rem',
  });

  return (
    <div>
      <div style={{
        background: '#1e293b', padding: '10px 20px',
        display: 'flex', gap: '8px', flexWrap: 'wrap',
        justifyContent: 'center', zIndex: 1000, position: 'relative',
        borderBottom: '2px solid #0f172a',
      }}>
        <span style={{ color: '#64748b', fontSize: '0.75rem', alignSelf: 'center', paddingRight: '4px' }}>
          Rizky:
        </span>
        {navItems.filter(n => n.group === 'rizky').map(n => (
          <button key={n.key} onClick={() => setCurrentPage(n.key)} style={btnStyle(n.key, n.group)}>
            {n.label}
          </button>
        ))}

        <span style={{ color: '#64748b', fontSize: '0.75rem', alignSelf: 'center', padding: '0 4px', borderLeft: '1px solid #475569', paddingLeft: '12px' }}>
          Anton:
        </span>
        {navItems.filter(n => n.group === 'anton').map(n => (
          <button key={n.key} onClick={() => setCurrentPage(n.key)} style={btnStyle(n.key, n.group)}>
            {n.label}
          </button>
        ))}

        <span style={{ color: '#64748b', fontSize: '0.75rem', alignSelf: 'center', padding: '0 4px', borderLeft: '1px solid #475569', paddingLeft: '12px' }}>
          Reyhan:
        </span>
        <button onClick={() => setCurrentPage('login')} style={{ padding: '6px 12px', background: currentPage === 'login' ? '#22c55e' : '#334155', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Login</button>
        <button onClick={() => setCurrentPage('register')} style={{ padding: '6px 12px', background: currentPage === 'register' ? '#22c55e' : '#334155', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Register</button>
        <button onClick={() => setCurrentPage('admin-dashboard')} style={{ padding: '6px 12px', background: currentPage === 'admin-dashboard' ? '#22c55e' : '#334155', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Admin Dashboard</button>
        <button onClick={() => setCurrentPage('forgot-password')} style={{ padding: '6px 12px', background: currentPage === 'forgot-password' ? '#22c55e' : '#334155', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Forgot Password</button>
        <button onClick={() => setCurrentPage('reset-password')} style={{ padding: '6px 12px', background: currentPage === 'reset-password' ? '#22c55e' : '#334155', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Reset Password</button>

        <span style={{ color: '#64748b', fontSize: '0.75rem', alignSelf: 'center', padding: '0 4px', borderLeft: '1px solid #475569', paddingLeft: '12px' }}>
          Nadil:
        </span>
        <button onClick={() => setCurrentPage('dashboard-peserta')} style={{ padding: '6px 12px', background: currentPage === 'dashboard-peserta' ? '#3b82f6' : '#334155', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Dashboard Peserta</button>
        <button onClick={() => setCurrentPage('form-pendaftaran')} style={{ padding: '6px 12px', background: currentPage === 'form-pendaftaran' ? '#3b82f6' : '#334155', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Form Pendaftaran</button>
        <button onClick={() => setCurrentPage('upload-dokumen')} style={{ padding: '6px 12px', background: currentPage === 'upload-dokumen' ? '#3b82f6' : '#334155', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Upload Dokumen</button>
        <button onClick={() => setCurrentPage('preview-pendaftaran')} style={{ padding: '6px 12px', background: currentPage === 'preview-pendaftaran' ? '#3b82f6' : '#334155', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Preview</button>
        <button onClick={() => setCurrentPage('status-pendaftaran')} style={{ padding: '6px 12px', background: currentPage === 'status-pendaftaran' ? '#3b82f6' : '#334155', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Status</button>
      </div>

      {currentPage === 'landing'          && <LandingPage />}
      {currentPage === 'dashboard'        && <Dashboard />}
      {currentPage === 'cms'              && <CmsPanel />}
      {currentPage === 'dashboard-divisi' && <DashboardDivisi />}
      {currentPage === 'divisi'           && (
        <DivisiPage onViewDetail={handleViewDivisiDetail} />
      )}
      {currentPage === 'divisi-detail' && selectedDivisiId !== null && (
        <DivisiDetailPage
          divisiId={selectedDivisiId}
          onBack={() => setCurrentPage('divisi')}
        />
      )}
      {currentPage === 'interview'   && <InterviewPage />}
      {currentPage === 'penilaian'   && <PenilaianPage />}
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
      {currentPage === 'login' && (
        <LoginPage
          onLoginSuccess={() => setCurrentPage('admin-dashboard')}
          onSwitchToRegister={() => setCurrentPage('register')}
          onForgotPassword={() => setCurrentPage('forgot-password')}
        />
      )}
      {currentPage === 'register' && (
        <RegisterPage
          onRegisterSuccess={() => setCurrentPage('login')}
          onSwitchToLogin={() => setCurrentPage('login')}
        />
      )}
      {currentPage === 'admin-dashboard' && (
        <AdminDashboard onNavigate={(page) => setCurrentPage(page as Page)} />
      )}
      {currentPage === 'forgot-password' && (
        <ForgotPasswordPage onBackToLogin={() => setCurrentPage('login')} />
      )}
      {currentPage === 'reset-password' && (
        <ResetPasswordPage onBackToLogin={() => setCurrentPage('login')} />
      )}
    </div>
  );
}

export default App;
