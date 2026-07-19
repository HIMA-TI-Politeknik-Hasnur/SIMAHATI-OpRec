import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { CmsPanel } from './pages/CmsPanel';
import { DivisiPage } from './pages/DivisiPage';
import { DivisiDetailPage } from './pages/DivisiDetailPage';
import { InterviewPage } from './pages/InterviewPage';
import { PenilaianPage } from './pages/PenilaianPage';
import { DashboardDivisi } from './pages/DashboardDivisi';

type Page =
  | 'landing'
  | 'dashboard'
  | 'cms'
  | 'divisi'
  | 'divisi-detail'
  | 'interview'
  | 'penilaian'
  | 'dashboard-divisi';

const navItems: { key: Page; label: string; group: 'rizky' | 'anton' }[] = [
  { key: 'landing',          label: 'Landing Page',         group: 'rizky' },
  { key: 'dashboard',        label: 'Dashboard Pendaftar',   group: 'rizky' },
  { key: 'cms',              label: 'CMS Admin',             group: 'rizky' },
  { key: 'dashboard-divisi', label: 'Dashboard Divisi',      group: 'anton' },
  { key: 'divisi',           label: 'Kelola Divisi',         group: 'anton' },
  { key: 'interview',        label: 'Jadwal Interview',      group: 'anton' },
  { key: 'penilaian',        label: 'Penilaian Interview',   group: 'anton' },
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedDivisiId, setSelectedDivisiId] = useState<number | null>(null);

  const handleViewDivisiDetail = (id: number) => {
    setSelectedDivisiId(id);
    setCurrentPage('divisi-detail');
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
      {/* Navbar */}
      <div style={{
        background: '#1e293b',
        padding: '10px 20px',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        zIndex: 1000,
        position: 'relative',
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
      </div>

      {/* Pages */}
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
    </div>
  );
}

export default App;
