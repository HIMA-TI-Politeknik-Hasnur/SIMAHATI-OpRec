import { useEffect, useState } from 'react';
import { apiFetch, getAuthToken, isSessionAuth, sessionFetch } from '../api';
import { AdminRoleManagement } from './AdminDashboardRoleManagement';
import { AdminPengumuman } from './AdminDashboardPengumuman';
import { DivisiPage } from './DivisiPage';
import { InterviewPage } from './InterviewPage';
import { CmsPanel } from './CmsPanel';
import { AdminPeserta } from './AdminPeserta';
import './AdminDashboard.css';

interface UserData {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

interface StatsData {
  total_pendaftar: number;
  pending_verifikasi: number;
  lolos_administrasi: number;
  ditolak_administrasi: number;
  dalam_interview: number;
  lolos_seleksi: number;
  ditolak_seleksi: number;
  total_divisi: number;
  total_admin: number;
  total_interview: number;
  total_pengumuman: number;
}

interface UserResponse {
  success: boolean;
  data: UserData;
}

interface StatsResponse {
  success: boolean;
  data: StatsData;
}

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

const navItems = [
  { key: 'dashboard', label: 'Dashboard', roles: ['Super Admin', 'Admin', 'Panitia'] },
  { key: 'role-management', label: 'Role Management', roles: ['Super Admin', 'Admin'] },
  { key: 'verifikasi-pendaftar', label: 'Verifikasi Pendaftar', roles: ['Super Admin', 'Admin', 'Panitia'] },
  { key: 'divisi', label: 'Divisi', roles: ['Super Admin', 'Admin', 'Panitia'] },
  { key: 'interview', label: 'Interview', roles: ['Super Admin', 'Admin', 'Panitia'] },
  { key: 'pengumuman', label: 'Pengumuman', roles: ['Super Admin', 'Admin', 'Panitia'] },
  { key: 'settings', label: 'Settings', roles: ['Super Admin', 'Admin'] },
];

const cardConfigs = [
  { key: 'total_pendaftar', label: 'Total Pendaftar', icon: '👥' },
  { key: 'pending_verifikasi', label: 'Pending Verifikasi', icon: '⏳' },
  { key: 'lolos_administrasi', label: 'Lolos Administrasi', icon: '✅' },
  { key: 'ditolak_administrasi', label: 'Ditolak Administrasi', icon: '❌' },
  { key: 'dalam_interview', label: 'Dalam Interview', icon: '📅' },
  { key: 'lolos_seleksi', label: 'Lolos Seleksi', icon: '⭐' },
  { key: 'ditolak_seleksi', label: 'Ditolak Seleksi', icon: '🚫' },
  { key: 'total_divisi', label: 'Total Divisi', icon: '🏢' },
  { key: 'total_interview', label: 'Jadwal Interview', icon: '🗓️' },
  { key: 'total_admin', label: 'Total Admin', icon: '🛡️' },
];

const quickActions = [
  { label: 'Kelola Role', key: 'role-management', roles: ['Super Admin', 'Admin'] },
  { label: 'Verifikasi Pendaftar', key: 'verifikasi-pendaftar', roles: ['Super Admin', 'Admin', 'Panitia'] },
  { label: 'Atur Divisi', key: 'divisi', roles: ['Super Admin', 'Admin', 'Panitia'] },
  { label: 'Pengaturan', key: 'settings', roles: ['Super Admin', 'Admin'] },
];

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  'role-management': 'Role Management',
  'verifikasi-pendaftar': 'Verifikasi Pendaftar',
  pengumuman: 'Pengumuman',
  divisi: 'Kelola Divisi',
  interview: 'Penjadwalan Interview',
  settings: 'Content Management',
};

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [adminPage, setAdminPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (isSessionAuth()) {
        const [userRes, statsRes] = await Promise.all([
          sessionFetch<UserResponse>('/api/session/user'),
          sessionFetch<StatsResponse>('/api/dashboard/stats'),
        ]);

        if (userRes.data) setUser(userRes.data.data);
        if (statsRes.data) setStats(statsRes.data.data);

        if (userRes.error && statsRes.error) {
          setError(userRes.error.message || statsRes.error.message);
        } else if (userRes.error) {
          setError(userRes.error.message);
        } else if (statsRes.error) {
          setError(statsRes.error.message);
        }

        setLoading(false);
        return;
      }

      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        setError('not-authenticated');
        return;
      }

      const [userRes, statsRes] = await Promise.all([
        apiFetch<UserResponse>('/api/user'),
        apiFetch<StatsResponse>('/api/dashboard/stats'),
      ]);

      if (userRes.data) setUser(userRes.data.data);
      if (statsRes.data) setStats(statsRes.data.data);

      if (userRes.error && statsRes.error) {
        setError(userRes.error.message || statsRes.error.message);
      } else if (userRes.error) {
        setError(userRes.error.message);
      } else if (statsRes.error) {
        setError(statsRes.error.message);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSidebarClick = (key: string) => {
    setAdminPage(key);
    // Tutup sidebar otomatis di mobile setelah klik menu
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (adminPage) {
      case 'role-management':
        return <AdminRoleManagement />;
      case 'verifikasi-pendaftar':
        return <AdminPeserta />;
      case 'pengumuman':
        return <AdminPengumuman />;
      case 'divisi':
        return <DivisiPage inline onViewDetail={(_id) => onNavigate('divisi-detail')} />;
      case 'interview':
        return <InterviewPage inline />;
      case 'settings':
        return <CmsPanel inline />;
      default:
        return (
          <>
            <div className="admin-db-cards">
              {cardConfigs.map((card) => {
                const value = stats ? stats[card.key as keyof StatsData] : 0;
                return (
                  <div key={card.key} className="admin-db-card">
                    <span className="admin-db-card-icon">{card.icon}</span>
                    <div>
                      <p className="admin-db-card-label">{card.label}</p>
                      <p className="admin-db-card-value">{value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <h3 className="admin-db-section-title">Quick Actions</h3>
            <div className="admin-db-actions">
              {quickActions
                .filter((action) => user && action.roles.includes(user.roles[0]))
                .map((action) => (
                  <button
                    key={action.key}
                    className="admin-db-action-btn"
                    onClick={() => handleSidebarClick(action.key)}
                  >
                    {action.label}
                  </button>
                ))}
            </div>
          </>
        );
    }
  };

  if (loading) {
    return <div className="admin-db-loading">Memuat dashboard...</div>;
  }

  if (error === 'not-authenticated') {
    return (
      <div className="admin-db-error">
        <p>Silakan login terlebih dahulu</p>
        <button className="admin-db-error-btn" onClick={() => onNavigate('login')}>
          Pergi ke Login
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-db-error">
        <p>Error: {error}</p>
        <button className="admin-db-error-btn" onClick={() => window.location.reload()}>
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="admin-db-layout">
      {/* Overlay gelap saat sidebar terbuka di mobile */}
      {sidebarOpen && (
        <div
          className="admin-db-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`admin-db-sidebar ${sidebarOpen ? 'admin-db-sidebar--open' : 'admin-db-sidebar--closed'}`}>
        <div className="admin-db-sidebar-header">
          <div className="admin-db-sidebar-header-row">
            <div>
              <h2 className="admin-db-sidebar-title">SIMAHATI OpRec</h2>
              <p className="admin-db-sidebar-subtitle">Panel Admin</p>
            </div>
            <button
              className="admin-db-sidebar-toggle-close"
              onClick={() => setSidebarOpen(false)}
              title="Sembunyikan sidebar"
            >
              ✕
            </button>
          </div>
        </div>

        <nav className="admin-db-sidebar-nav">
          {navItems
            .filter((item) => user && item.roles.includes(user.roles[0]))
            .map((item) => (
              <button
                key={item.key}
                className={`admin-db-nav-item ${adminPage === item.key ? 'admin-db-nav-item--active' : ''}`}
                onClick={() => handleSidebarClick(item.key)}
              >
                {item.label}
              </button>
            ))}
        </nav>

        <div className="admin-db-sidebar-footer">
          {user && (
            <>
              <div className="admin-db-sidebar-user">{user.name}</div>
              <div className="admin-db-sidebar-email">{user.email}</div>
            </>
          )}
        </div>
      </aside>

      <main className="admin-db-main">
        <div className="admin-db-navbar">
          <div className="admin-db-navbar-left">
            <button
              className="admin-db-sidebar-toggle"
              onClick={() => setSidebarOpen(v => !v)}
              title={sidebarOpen ? 'Sembunyikan sidebar' : 'Tampilkan sidebar'}
            >
              {sidebarOpen ? '◀' : '☰'}
            </button>
            <h1 className="admin-db-page-title">{pageTitles[adminPage] || 'Dashboard'}</h1>
          </div>
          {user && <span className="admin-db-greeting">Halo, {user.name}!</span>}
        </div>

        <div className="admin-db-content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
