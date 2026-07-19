import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { CmsPanel } from './pages/CmsPanel';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  return (
    <div>
      <div style={{ background: '#1e293b', padding: '10px', display: 'flex', gap: '10px', justifyContent: 'center', zIndex: 1000, position: 'relative' }}>
        <button 
          onClick={() => setCurrentPage('landing')} 
          style={{ padding: '8px 16px', background: currentPage === 'landing' ? '#3b82f6' : '#334155', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Lihat Landing Page
        </button>
        <button 
          onClick={() => setCurrentPage('dashboard')} 
          style={{ padding: '8px 16px', background: currentPage === 'dashboard' ? '#3b82f6' : '#334155', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Lihat Dashboard Pendaftar
        </button>
        <button 
          onClick={() => setCurrentPage('cms')} 
          style={{ padding: '8px 16px', background: currentPage === 'cms' ? '#3b82f6' : '#334155', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Lihat CMS Admin
        </button>
      </div>

      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'cms' && <CmsPanel />}
    </div>
  );
}

export default App;
