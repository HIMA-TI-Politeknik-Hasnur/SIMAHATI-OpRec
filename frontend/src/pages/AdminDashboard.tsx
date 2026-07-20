import { useEffect, useState } from 'react';
import { apiFetch, getAuthToken, isSessionAuth, sessionFetch, clearAuth, apiPost, sessionPost } from '../api';
import { AdminRoleManagement } from './AdminDashboardRoleManagement';
import { AdminPengumuman } from './AdminDashboardPengumuman';
import './AdminDashboard.css';

interface UserData {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

interface StatsData {
  total_pendaftar: number;
  lolos_administrasi: number;
  lolos_wawancara: number;
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
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'role-management', label: 'Role Management' },
  { key: 'peserta', label: 'Peserta' },
  { key: 'divisi', label: 'Divisi' },
  { key: 'interview', label: 'Interview' },
  { key: 'pengumuman', label: 'Pengumuman' },
  { key: 'settings', label: 'Settings' },
];

const cardConfigs = [
  { key: 'total_pendaftar', label: 'Total Pendaftar', icon: '👥', color: '#3b82f6' },
  { key: 'lolos_administrasi', label: 'Lolos Administrasi', icon: '✅', color: '#22c55e' },
  { key: 'lolos_wawancara', label: 'Lolos Wawancara', icon: '⭐', color: '#f59e0b' },
  { key: 'total_divisi', label: 'Total Divisi', icon: '🏢', color: '#8b5cf6' },
  { key: 'total_interview', label: 'Total Interview', icon: '📅', color: '#14b8a6' },
  { key: 'total_admin', label: 'Total Admin', icon: '🛡️', color: '#64748b' },
];

const quickActions = [
  { label: 'Kelola Role', key: 'role-management' },
  { label: 'Lihat Peserta', key: 'peserta' },
  { label: 'Atur Divisi', key: 'divisi' },
  { label: 'Pengaturan', key: 'settings' },
];

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  'role-management': 'Role Management',
  pengumuman: 'Pengumuman',
};

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [adminPage, setAdminPage] = useState('dashboard');

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

  const handleLogout = async () => {
    if (isSessionAuth()) {
      await sessionPost('/api/session/logout');
    } else if (getAuthToken()) {
      await apiPost('/api/logout');
    }
    clearAuth();
    onNavigate('landing');
  };

  const handleSidebarClick = (key: string) => {
    const externalPages: Record<string, string> = {
      peserta: 'dashboard-peserta',
      divisi: 'divisi',
      interview: 'interview',
      settings: 'cms',
    };
    if (externalPages[key]) {
      onNavigate(externalPages[key]);
    } else {
      setAdminPage(key);
    }
  };

  const renderContent = () => {
    switch (adminPage) {
      case 'role-management':
        return <AdminRoleManagement />;
      case 'pengumuman':
        return <AdminPengumuman />;
      default:
        return (
          <>
            <div className="admin-db-cards">
              {cardConfigs.map((card) => {
                const value = stats ? stats[card.key as keyof StatsData] : 0;
                return (
                  <div
                    key={card.key}
                    className="admin-db-card"
                    style={{ borderTop: `3px solid ${card.color}` }}
                  >
                    <div className="admin-db-card-icon">{card.icon}</div>
                    <p className="admin-db-card-value">{value}</p>
                    <p className="admin-db-card-label">{card.label}</p>
                  </div>
                );
              })}
            </div>
            <h3 className="admin-db-section-title">Quick Actions</h3>
            <div className="admin-db-actions">
              {quickActions.map((action) => (
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
      <aside className="admin-db-sidebar">
        <div className="admin-db-sidebar-header">
          <h2 className="admin-db-sidebar-title">SIMAHATI OpRec</h2>
          <p className="admin-db-sidebar-subtitle">Panel Admin</p>
        </div>

        <nav className="admin-db-sidebar-nav">
          {navItems.map((item) => (
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
          <h1 className="admin-db-page-title">{pageTitles[adminPage] || 'Dashboard'}</h1>
          {user && <span className="admin-db-greeting">Halo, {user.name}!</span>}
        </div>

        {renderContent()}
      </main>
    </div>
  );
}
