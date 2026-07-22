import { useEffect, useRef, useState } from 'react';
import {
  LayoutDashboard, Shield, UserCheck, Mail, UserPlus,
  Building2, Calendar, VolumeX, BarChart3, LayoutList, Settings,
  Users, Clock, XCircle, Star, AlertTriangle, RefreshCw,
  LogOut, Search, Bell, ChevronDown, Menu
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiFetch, getAuthToken, isSessionAuth, sessionFetch } from '../api';
import { AdminRoleManagement } from './AdminDashboardRoleManagement';
import { AdminPengumuman } from './AdminDashboardPengumuman';
import { DivisiPage } from './DivisiPage';
import { InterviewPage } from './InterviewPage';
import { CmsPanel } from './CmsPanel';
import { AdminDashboardBenefit } from './AdminDashboardBenefit';
import { PenilaianPage } from './PenilaianPage';
import { AdminPeserta } from './AdminPeserta';
import { AdminVerifikasiEmail } from './AdminVerifikasiEmail';
import { AdminTambahStaff } from './AdminTambahStaff';
import { DivisiDetailModal } from './DivisiDetailModal';
import { StatCard, SidebarItem, QuickActionCard, ActivityItem, StatCardSkeleton, ChartSkeleton, ActivitySkeleton } from '../components/ui';
import { useAuthStore } from '../stores/authStore';
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

const navGroups = [
  {
    label: 'Utama',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'panitia'] },
    ],
  },
  {
    label: 'Manajemen',
    items: [
      { key: 'role-management', label: 'Role Management', icon: Shield, roles: ['super_admin', 'admin'] },
      { key: 'verifikasi-pendaftar', label: 'Verifikasi Pendaftar', icon: UserCheck, roles: ['super_admin', 'admin', 'panitia'] },
      { key: 'verifikasi-email', label: 'Verifikasi Email', icon: Mail, roles: ['super_admin'] },
      { key: 'tambah-staff', label: 'Tambah Staff', icon: UserPlus, roles: ['super_admin'] },
    ],
  },
  {
    label: 'Kegiatan',
    items: [
      { key: 'divisi', label: 'Divisi', icon: Building2, roles: ['super_admin', 'admin', 'panitia'] },
      { key: 'interview', label: 'Interview', icon: Calendar, roles: ['super_admin', 'admin', 'panitia', 'interviewer'] },
      { key: 'pengumuman', label: 'Pengumuman', icon: VolumeX, roles: ['super_admin', 'admin', 'panitia'] },
      { key: 'penilaian', label: 'Penilaian', icon: BarChart3, roles: ['super_admin', 'interviewer'] },
    ],
  },
  {
    label: 'Pengaturan',
    items: [
      { key: 'benefit', label: 'Benefit', icon: LayoutList, roles: ['super_admin', 'admin'] },
      { key: 'settings', label: 'Settings', icon: Settings, roles: ['super_admin', 'admin'] },
    ],
  },
];

const quickActions = [
  { label: 'Kelola Role', key: 'role-management', icon: Shield, roles: ['super_admin', 'admin'], description: 'Manage akses pengguna' },
  { label: 'Verifikasi Pendaftar', key: 'verifikasi-pendaftar', icon: UserCheck, roles: ['super_admin', 'admin', 'panitia'], description: 'Verifikasi data pendaftar' },
  { label: 'Verifikasi Email', key: 'verifikasi-email', icon: Mail, roles: ['super_admin'], description: 'Verifikasi alamat email' },
  { label: 'Tambah Staff', key: 'tambah-staff', icon: UserPlus, roles: ['super_admin'], description: 'Tambahkan anggota baru' },
  { label: 'Atur Divisi', key: 'divisi', icon: Building2, roles: ['super_admin', 'admin', 'panitia'], description: 'Kelola divisi open recruitment' },
  { label: 'Pengaturan', key: 'settings', icon: Settings, roles: ['super_admin', 'admin'], description: 'Konfigurasi konten' },
];

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  'role-management': 'Role Management',
  'verifikasi-pendaftar': 'Verifikasi Pendaftar',
  'verifikasi-email': 'Verifikasi Email',
  'tambah-staff': 'Tambah Staff',
  pengumuman: 'Pengumuman',
  benefit: 'Kelola Benefit',
  divisi: 'Kelola Divisi',
  interview: 'Penjadwalan Interview',
  penilaian: 'Penilaian Interview',
  settings: 'Content Management',
};

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [adminPage, setAdminPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [detailDivisiId, setDetailDivisiId] = useState<number | null>(null);
  const [topbarDropdownOpen, setTopbarDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout: storeLogout } = useAuthStore();

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

        if (userRes.error) {
          setError(userRes.error.message);
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

      if (userRes.error) {
        setError(userRes.error.message);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setTopbarDropdownOpen(false);
      }
    };
    if (topbarDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [topbarDropdownOpen]);

  const handleSidebarClick = (key: string) => {
    setAdminPage(key);
    setTopbarDropdownOpen(false);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  const handleLogoutClick = () => {
    storeLogout();
    onNavigate('logout');
  };

  const renderContent = () => {
    switch (adminPage) {
      case 'role-management':
        return <AdminRoleManagement />;
      case 'verifikasi-pendaftar':
        return <AdminPeserta />;
      case 'verifikasi-email':
        return <AdminVerifikasiEmail />;
      case 'tambah-staff':
        return <AdminTambahStaff />;
      case 'pengumuman':
        return <AdminPengumuman />;
      case 'divisi':
        return (
          <>
            <DivisiPage inline onViewDetail={(id) => setDetailDivisiId(id)} />
            {detailDivisiId !== null && (
              <DivisiDetailModal
                divisiId={detailDivisiId}
                onClose={() => setDetailDivisiId(null)}
              />
            )}
          </>
        );
      case 'interview':
        return <InterviewPage inline currentUser={user ?? undefined} />;
      case 'penilaian':
        return <PenilaianPage currentUser={user ?? undefined} />;
      case 'benefit':
        return <AdminDashboardBenefit />;
      case 'settings':
        return <CmsPanel inline />;
      default:
        const chartData = stats ? [
          { name: 'Lolos', value: stats.lolos_administrasi },
          { name: 'Pending', value: stats.pending_verifikasi },
          { name: 'Ditolak', value: stats.ditolak_administrasi },
          { name: 'Interview', value: stats.dalam_interview },
          { name: 'Terima', value: stats.lolos_seleksi },
        ] : [];

          return (
            <div className="space-y-7">

              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50">
                    <LayoutDashboard className="w-5 h-5 text-orange-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="admin-db-section-title">Ringkasan Data</h3>
                </div>
                <div className="admin-db-cards">
                  <StatCard
                    icon={Users}
                    title="Total Pendaftar"
                    value={stats?.total_pendaftar ?? 0}
                    color="blue"
                  />
                  <StatCard
                    icon={Clock}
                    title="Pending Verifikasi"
                    value={stats?.pending_verifikasi ?? 0}
                    color="yellow"
                  />
                  <StatCard
                    icon={UserCheck}
                    title="Lolos Administrasi"
                    value={stats?.lolos_administrasi ?? 0}
                    color="green"
                  />
                  <StatCard
                    icon={XCircle}
                    title="Ditolak"
                    value={stats?.ditolak_administrasi ?? 0}
                    color="red"
                  />
                </div>
              </div>

              <div className="admin-db-two-col">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50">
                        <BarChart3 className="w-5 h-5 text-orange-600" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900">Statistik Pendaftar</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Data 30 Hari Terakhir</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 text-xs font-medium text-gray-500">
                      <span>Bulanan</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f97316" stopOpacity={0.85} />
                          <stop offset="100%" stopColor="#fb923c" stopOpacity={0.5} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12, fontWeight: 600 }}
                        stroke="#9ca3af"
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12, fontWeight: 600 }}
                        stroke="#9ca3af"
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #fed7aa',
                          boxShadow: '0 8px 24px rgba(249, 115, 22, 0.15)',
                          fontWeight: 600,
                        }}
                        cursor={{ fill: 'rgba(249, 115, 22, 0.05)' }}
                      />
                      <Bar
                        dataKey="value"
                        fill="url(#barGradient)"
                        radius={[6, 6, 0, 0]}
                        animationDuration={800}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                      <AlertTriangle className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">Aktivitas Terkini</h3>
                  </div>
                  <div className="space-y-1">
                    <ActivityItem
                      icon={Users}
                      title="Total Pendaftar"
                      description={`${stats?.total_pendaftar ?? 0} pendaftar terdaftar`}
                      time="Update real-time"
                      color="blue"
                    />
                    <ActivityItem
                      icon={Calendar}
                      title="Interview"
                      description={`${stats?.dalam_interview ?? 0} dalam tahap interview`}
                      time="Update real-time"
                      color="yellow"
                    />
                    <ActivityItem
                      icon={Star}
                      title="Lolos Seleksi"
                      description={`${stats?.lolos_seleksi ?? 0} telah diterima`}
                      time="Update real-time"
                      color="green"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50">
                    <RefreshCw className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="admin-db-section-title">Quick Actions</h3>
                </div>
                <div className="admin-db-actions">
                  {quickActions
                    .filter((action) => user && action.roles.includes(user.roles[0]))
                    .map((action) => (
                      <QuickActionCard
                        key={action.key}
                        icon={action.icon}
                        label={action.label}
                        description={action.description}
                        onClick={() => handleSidebarClick(action.key)}
                      />
                    ))}
                </div>
              </div>
            </div>
          );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex">
        <div className="w-[260px] bg-white border-r border-gray-200 p-6 hidden lg:block">
          <div className="animate-pulse space-y-6">
            <div className="space-y-2">
              <div className="h-7 bg-gray-200 rounded-lg w-36" />
              <div className="h-3 bg-gray-200 rounded w-20" />
            </div>
            <div className="space-y-1 mt-10">
              {[1,2,3,4,5,6,7].map(i => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 p-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 bg-gray-200 rounded-lg" />
                <div className="h-5 bg-gray-200 rounded w-24" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-gray-200 rounded-lg" />
                <div className="h-9 w-9 bg-gray-200 rounded-lg" />
                <div className="h-8 w-8 bg-gray-200 rounded-full" />
              </div>
            </div>
            <div className="admin-db-cards">
              {[1,2,3,4].map(i => <StatCardSkeleton key={i} />)}
            </div>
            <div className="admin-db-two-col">
              <ChartSkeleton />
              <ActivitySkeleton />
            </div>
            <div className="space-y-4">
              <div className="h-5 bg-gray-200 rounded w-32" />
              <div className="admin-db-actions">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-32 bg-white border border-gray-200 rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
          {navGroups.map((group) => {
            const visible = group.items.filter((item) => user && item.roles.includes(user.roles[0]));
            if (visible.length === 0) return null;
            return (
              <div key={group.label}>
                <p className="admin-db-nav-group-label">{group.label}</p>
                {visible.map((item) => (
                  <SidebarItem
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    active={adminPage === item.key}
                    onClick={() => handleSidebarClick(item.key)}
                  />
                ))}
              </div>
            );
          })}
        </nav>

        <div className="admin-db-sidebar-footer">
          {user && (
            <>
              <div className="admin-db-sidebar-user">{user.name}</div>
              <div className="admin-db-sidebar-email">{user.email}</div>
              <button className="admin-db-logout-btn" onClick={handleLogoutClick}>
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
        </div>
      </aside>

      <main className="admin-db-main">
        <div className="admin-db-topbar">
          <div className="admin-db-topbar-left">
            <button
              className="admin-db-sidebar-toggle"
              onClick={() => setSidebarOpen(v => !v)}
              title={sidebarOpen ? 'Sembunyikan sidebar' : 'Tampilkan sidebar'}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="admin-db-breadcrumb">
              <span>Dashboard</span>
              <span className="admin-db-breadcrumb-sep">/</span>
              <span className="admin-db-breadcrumb-current">{pageTitles[adminPage] || 'Dashboard'}</span>
            </div>
          </div>

          <div className="admin-db-topbar-right">
            <button className="admin-db-topbar-icon-btn" title="Search">
              <Search className="w-4.5 h-4.5" strokeWidth={2} />
            </button>
            <button className="admin-db-topbar-icon-btn" title="Notifications">
              <Bell className="w-4.5 h-4.5" strokeWidth={2} />
            </button>
            <div className="relative" ref={dropdownRef}>
              <div
                className="admin-db-topbar-avatar"
                onClick={() => setTopbarDropdownOpen(v => !v)}
                title={user?.name}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              {topbarDropdownOpen && (
                <div className="admin-db-topbar-dropdown">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                  </div>
                  <button
                    className="admin-db-topbar-dropdown-item admin-db-topbar-dropdown-item--danger"
                    onClick={handleLogoutClick}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="admin-db-content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
