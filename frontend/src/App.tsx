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
import './App.css';

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

  const isActive = (key: Page) => currentPage === key || (key === 'divisi' && currentPage === 'divisi-detail');

  const cls = (key: Page, group: string) =>
    `app-nav-btn--${group}${isActive(key) ? ' active' : ''}`;

  const reyhanPages: { key: Page; label: string }[] = [
    { key: 'login', label: 'Login' },
    { key: 'register', label: 'Register' },
    { key: 'admin-dashboard', label: 'Admin Dashboard' },
    { key: 'forgot-password', label: 'Forgot Password' },
    { key: 'reset-password', label: 'Reset Password' },
  ];

  const nadilPages: { key: Page; label: string }[] = [
    { key: 'dashboard-peserta', label: 'Dashboard Peserta' },
    { key: 'form-pendaftaran', label: 'Form Pendaftaran' },
    { key: 'upload-dokumen', label: 'Upload Dokumen' },
    { key: 'preview-pendaftaran', label: 'Preview' },
    { key: 'status-pendaftaran', label: 'Status' },
  ];

  return (
    <div>
      <nav className="app-nav">
        <span className="app-nav-group" style={{ paddingRight: '4px', borderLeft: 'none' }}>Rizky:</span>
        {navItems.filter(n => n.group === 'rizky').map(n => (
          <button key={n.key} className={`app-nav-btn ${cls(n.key, 'rizky')}`} onClick={() => setCurrentPage(n.key)}>
            {n.label}
          </button>
        ))}

        <span className="app-nav-group">Anton:</span>
        {navItems.filter(n => n.group === 'anton').map(n => (
          <button key={n.key} className={`app-nav-btn ${cls(n.key, 'anton')}`} onClick={() => setCurrentPage(n.key)}>
            {n.label}
          </button>
        ))}

        <span className="app-nav-group">Reyhan:</span>
        {reyhanPages.map(p => (
          <button key={p.key} className={`app-nav-btn ${cls(p.key, 'reyhan')}`} onClick={() => setCurrentPage(p.key)}>
            {p.label}
          </button>
        ))}

        <span className="app-nav-group">Nadil:</span>
        {nadilPages.map(p => (
          <button key={p.key} className={`app-nav-btn ${cls(p.key, 'nadil')}`} onClick={() => setCurrentPage(p.key)}>
            {p.label}
          </button>
        ))}
      </nav>

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
