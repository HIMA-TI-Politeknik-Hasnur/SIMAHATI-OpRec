import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { CmsPanel } from './pages/CmsPanel';
import { DivisiPage } from './pages/DivisiPage';
import { InterviewPage } from './pages/InterviewPage';
import { PenilaianPage } from './pages/PenilaianPage';

type Page = 'landing' | 'dashboard' | 'cms' | 'divisi' | 'interview' | 'penilaian';

const navItems: { key: Page; label: string; group: 'rizky' | 'anton' }[] = [
  { key: 'landing',    label: 'Landing Page',         group: 'rizky' },
  { key: 'dashboard',  label: 'Dashboard Pendaftar',   group: 'rizky' },
  { key: 'cms',        label: 'CMS Admin',             group: 'rizky' },
  { key: 'divisi',     label: 'Kelola Divisi',         group: 'anton' },
  { key: 'interview',  label: 'Jadwal Interview',      group: 'anton' },
  { key: 'penilaian',  label: 'Penilaian Interview',   group: 'anton' },
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const btnStyle = (key: Page, group: 'rizky' | 'anton'): React.CSSProperties => ({
    padding: '8px 16px',
    background: currentPage === key
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
        {/* Pembatas label */}
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

      {currentPage === 'landing'   && <LandingPage />}
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'cms'       && <CmsPanel />}
      {currentPage === 'divisi'    && <DivisiPage />}
      {currentPage === 'interview' && <InterviewPage />}
      {currentPage === 'penilaian' && <PenilaianPage />}
    </div>
  );
}

export default App;
