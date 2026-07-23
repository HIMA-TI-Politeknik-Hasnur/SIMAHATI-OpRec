import { useEffect, useRef, useState } from 'react';
import {
  BarChart3, AlertTriangle, RefreshCw,
  LogOut, Search, Bell, ChevronDown, Menu,
  PanelLeftClose, Sun, Filter
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
import { StatCard, SidebarItem, QuickActionCard, ActivityItem, Skeleton, SidebarSkeleton, StatCardSkeleton, ChartSkeleton, ActivitySkeleton, QuickActionSkeleton } from '../components/ui';
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
      { key: 'dashboard', label: 'Dashboard', emoji: '🏠', icon: 'dashboard', roles: ['super_admin', 'admin', 'panitia'] },
    ],
  },
  {
    label: 'Manajemen',
    items: [
      { key: 'role-management', label: 'Role Management', emoji: '👥', icon: 'shield', roles: ['super_admin', 'admin'] },
      { key: 'verifikasi-pendaftar', label: 'Verifikasi Pendaftar', emoji: '📋', icon: 'verified_user', roles: ['super_admin', 'admin', 'panitia'] },
      { key: 'verifikasi-email', label: 'Verifikasi Email', emoji: '📧', icon: 'mail', roles: ['super_admin'] },
      { key: 'tambah-staff', label: 'Tambah Staff', emoji: '👤', icon: 'person_add', roles: ['super_admin'] },
    ],
  },
  {
    label: 'Kegiatan',
    items: [
      { key: 'divisi', label: 'Divisi', emoji: '🏢', icon: 'business', roles: ['super_admin', 'admin', 'panitia'] },
      { key: 'interview', label: 'Interview', emoji: '📅', icon: 'calendar_month', roles: ['super_admin', 'admin', 'panitia', 'interviewer'] },
      { key: 'pengumuman', label: 'Pengumuman', emoji: '📢', icon: 'campaign', roles: ['super_admin', 'admin', 'panitia'] },
      { key: 'penilaian', label: 'Penilaian', emoji: '⭐', icon: 'bar_chart', roles: ['super_admin', 'interviewer'] },
    ],
  },
  {
    label: 'Pengaturan',
    items: [
      { key: 'benefit', label: 'Benefit', emoji: '🎁', icon: 'list', roles: ['super_admin', 'admin'] },
      { key: 'settings', label: 'Settings', emoji: '⚙️', icon: 'settings', roles: ['super_admin', 'admin'] },
    ],
  },
];

const quickActions = [
  { label: 'Kelola Role', key: 'role-management', icon: 'shield', roles: ['super_admin', 'admin'], description: 'Kelola hak akses pengguna' },
  { label: 'Verifikasi Pendaftar', key: 'verifikasi-pendaftar', icon: 'verified_user', roles: ['super_admin', 'admin', 'panitia'], description: 'Verifikasi data pendaftar baru' },
  { label: 'Verifikasi Email', key: 'verifikasi-email', icon: 'mail', roles: ['super_admin'], description: 'Verifikasi alamat email' },
  { label: 'Tambah Staff', key: 'tambah-staff', icon: 'person_add', roles: ['super_admin'], description: 'Tambahkan anggota staff baru' },
  { label: 'Atur Divisi', key: 'divisi', icon: 'business', roles: ['super_admin', 'admin', 'panitia'], description: 'Kelola divisi open recruitment' },
  { label: 'Pengaturan', key: 'settings', icon: 'settings', roles: ['super_admin', 'admin'], description: 'Konfigurasi konten website' },
];



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
          { name: 'Lolos', value: stats.lolos_administrasi, fill: '#22C55E' },
          { name: 'Pending', value: stats.pending_verifikasi, fill: '#F59E0B' },
          { name: 'Ditolak', value: stats.ditolak_administrasi, fill: '#EF4444' },
          { name: 'Interview', value: stats.dalam_interview, fill: '#3B82F6' },
          { name: 'Terima', value: stats.lolos_seleksi, fill: '#8B5CF6' },
        ] : [];

          return (
            <div className="max-w-[1440px] mx-auto">

              <div className="flex items-start justify-between mb-8">
                <div>
                  <h1 className="text-[28px] font-extrabold text-gray-900 leading-tight">
                    Selamat datang, {user?.name?.split(' ')[0] || 'Admin'}
                  </h1>
                  <p className="text-base text-gray-500 mt-1.5">
                    Pantau proses Open Recruitment secara real-time.
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 flex-shrink-0">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>

              <div className="mb-8">
                <div className="admin-db-cards">
                  <StatCard
                    icon="group"
                    title="Total Pendaftar"
                    value={stats?.total_pendaftar ?? 0}
                    description="Jumlah seluruh pendaftar"
                    color="blue"
                  />
                  <StatCard
                    icon="schedule"
                    title="Pending Verifikasi"
                    value={stats?.pending_verifikasi ?? 0}
                    description="Menunggu review"
                    color="yellow"
                  />
                  <StatCard
                    icon="verified_user"
                    title="Lolos Administrasi"
                    value={stats?.lolos_administrasi ?? 0}
                    description="Tahap dokumen lolos"
                    color="green"
                  />
                  <StatCard
                    icon="cancel"
                    title="Ditolak"
                    value={stats?.ditolak_administrasi ?? 0}
                    description="Tidak memenuhi syarat"
                    color="red"
                  />
                </div>
              </div>

              <div className="admin-db-two-col mb-8">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50">
                        <BarChart3 className="w-5 h-5 text-orange-600" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900">Statistik Pendaftar</h3>
                        <p className="text-xs text-gray-400 mt-0.5">30 Hari Terakhir</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors">
                      <span>Bulanan</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-orange-500 to-orange-300" />
                      <span>Data Pendaftar</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="w-2.5 h-2.5 rounded-sm bg-green-500" />
                      <span>Lolos</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                      <span>Pending</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData} barCategoryGap="20%">
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f97316" stopOpacity={0.85} />
                          <stop offset="100%" stopColor="#fb923c" stopOpacity={0.5} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 3" stroke="#f0f0f0" vertical={false} strokeWidth={0.5} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12, fontWeight: 600 }}
                        stroke="#9ca3af"
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12, fontWeight: 600 }}
                        stroke="#9ca3af"
                        axisLine={false}
                        tickLine={false}
                        width={30}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #fed7aa',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                          fontWeight: 600,
                          fontSize: '13px',
                        }}
                        cursor={{ fill: 'rgba(249, 115, 22, 0.05)' }}
                      />
                      <Bar
                        dataKey="value"
                        fill="url(#barGradient)"
                        radius={[4, 4, 0, 0]}
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
                  <div className="space-y-0">
                    <div className="mb-3 mt-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400 px-1">
                        Hari Ini
                      </p>
                    </div>
                    <ActivityItem
                      icon="group"
                      title="Total Pendaftar"
                      description={`${stats?.total_pendaftar ?? 0} pendaftar terdaftar`}
                      time="10 menit lalu"
                      color="blue"
                    />
                    <ActivityItem
                      icon="calendar_month"
                      title="Interview Berjalan"
                      description={`${stats?.dalam_interview ?? 0} dalam tahap interview`}
                      time="1 jam lalu"
                      color="yellow"
                    />
                    <div className="my-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400 px-1">
                        Kemarin
                      </p>
                    </div>
                    <ActivityItem
                      icon="star"
                      title="Lolos Seleksi"
                      description={`${stats?.lolos_seleksi ?? 0} telah diterima`}
                      time="Kemarin, 14:30"
                      color="green"
                      isLast
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50">
                    <RefreshCw className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Quick Actions</h3>
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
        <div className="w-[240px] bg-white border-r border-gray-200 hidden lg:block">
          <SidebarSkeleton />
        </div>
        <div className="flex-1">
          <div className="animate-pulse">
            <div className="border-b border-gray-200 px-8 py-3">
              <div className="flex items-center justify-between max-w-[1440px] mx-auto">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                  <div className="h-4 bg-gray-200 rounded w-32" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                  <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                  <div className="h-8 w-8 bg-gray-200 rounded-full" />
                </div>
              </div>
            </div>
            <div className="px-8 py-8">
              <div className="max-w-[1440px] mx-auto space-y-8">
                <div>
                  <Skeleton className="h-4 w-20 mb-3" />
                  <Skeleton className="h-8 w-96 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="admin-db-cards">
                  {[1,2,3,4].map(i => <StatCardSkeleton key={i} />)}
                </div>
                <div className="admin-db-two-col">
                  <ChartSkeleton />
                  <ActivitySkeleton />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-5 w-32" />
                  <div className="admin-db-actions">
                    {[1,2,3,4,5,6].map(i => (
                      <QuickActionSkeleton key={i} />
                    ))}
                  </div>
                </div>
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
              aria-label="Sembunyikan sidebar"
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
                <SidebarItem.Section label={group.label} />
                {visible.map((item) => (
                  <SidebarItem
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    emoji={item.emoji}
                    active={adminPage === item.key}
                    onClick={() => handleSidebarClick(item.key)}
                  />
                ))}
              </div>
            );
          })}
        </nav>

        <div className="admin-db-sidebar-collapse">
          <button
            onClick={() => setSidebarOpen(false)}
            className="admin-db-collapse-btn"
            aria-label="Persempit sidebar"
          >
            <PanelLeftClose className="w-5 h-5" />
            <span>Persempit</span>
          </button>
        </div>
      </aside>

      <main className="admin-db-main">
        <div className="admin-db-topbar">
          <div className="admin-db-topbar-left">
            <button
              className="admin-db-sidebar-toggle"
              onClick={() => setSidebarOpen(v => !v)}
              aria-label={sidebarOpen ? 'Sembunyikan sidebar' : 'Tampilkan sidebar'}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="admin-db-topbar-search">
              <Search className="w-[18px] h-[18px] text-gray-400 flex-shrink-0" strokeWidth={2} />
              <input
                type="text"
                placeholder="Cari menu..."
                className="admin-db-topbar-search-input"
              />
            </div>
          </div>

          <div className="admin-db-topbar-right">
            <button className="admin-db-topbar-icon-btn" aria-label="Toggle theme">
              <Sun className="w-[18px] h-[18px]" strokeWidth={2} />
            </button>
            <button className="admin-db-topbar-icon-btn relative" aria-label="Notifications">
              <Bell className="w-[18px] h-[18px]" strokeWidth={2} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                className="admin-db-topbar-user-btn"
                onClick={() => setTopbarDropdownOpen(v => !v)}
                aria-label="User menu"
              >
                <div className="admin-db-topbar-avatar">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <span className="admin-db-topbar-user-name">{user?.name?.split(' ')[0] || 'Admin'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${topbarDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
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
