import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Shield, UserCheck, Mail, UserPlus,
  Building2, Calendar, VolumeX, BarChart3, LayoutList, Settings,
  Users, Clock, XCircle, Star, AlertTriangle, RefreshCw,
  LogOut
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
import { StatCard, SidebarItem, QuickActionCard, ActivityItem } from '../components/ui';
import { StatCardSkeleton, ChartSkeleton } from '../components/ui';
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
  { label: 'Kelola Role', key: 'role-management', icon: Shield, roles: ['super_admin', 'admin'] },
  { label: 'Verifikasi Pendaftar', key: 'verifikasi-pendaftar', icon: UserCheck, roles: ['super_admin', 'admin', 'panitia'] },
  { label: 'Verifikasi Email', key: 'verifikasi-email', icon: Mail, roles: ['super_admin'] },
  { label: 'Tambah Staff', key: 'tambah-staff', icon: UserPlus, roles: ['super_admin'] },
  { label: 'Atur Divisi', key: 'divisi', icon: Building2, roles: ['super_admin', 'admin', 'panitia'] },
  { label: 'Pengaturan', key: 'settings', icon: Settings, roles: ['super_admin', 'admin'] },
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
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50">
                    <LayoutDashboard className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Ringkasan Data</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50">
                    <BarChart3 className="w-5 h-5 text-orange-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Statistik Pendaftar
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#fb923c" stopOpacity={0.6} />
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
                      radius={[8, 8, 0, 0]}
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                    <AlertTriangle className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Aktivitas Terkini
                  </h3>
                </div>
                <div className="space-y-2">
                  <ActivityItem
                    icon={Users}
                    title="Total Pendaftar"
                    description={`${stats?.total_pendaftar ?? 0} pendaftar terdaftar`}
                    time="Update real-time"
                  />
                  <ActivityItem
                    icon={Calendar}
                    title="Interview"
                    description={`${stats?.dalam_interview ?? 0} dalam tahap interview`}
                    time="Update real-time"
                  />
                  <ActivityItem
                    icon={Star}
                    title="Lolos Seleksi"
                    description={`${stats?.lolos_seleksi ?? 0} telah diterima`}
                    time="Update real-time"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50">
                  <RefreshCw className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Quick Actions
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {quickActions
                  .filter((action) => user && action.roles.includes(user.roles[0]))
                  .map((action) => (
                    <QuickActionCard
                      key={action.key}
                      icon={action.icon}
                      label={action.label}
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        <div className="w-60 bg-gradient-to-b from-gray-800 to-gray-900 p-6 hidden lg:block">
          <div className="animate-pulse space-y-6">
            <div className="space-y-2">
              <div className="h-7 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg w-36" />
              <div className="h-3 bg-gray-700 rounded w-20" />
            </div>
            <div className="space-y-3 mt-10">
              {[1,2,3,4,5,6,7].map(i => (
                <div key={i} className="h-11 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 p-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl" />
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-56" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1,2,3,4].map(i => <StatCardSkeleton key={i} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-40" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
          {navGroups.map((group) => {
            const visible = group.items.filter((item) => user && item.roles.includes(user.roles[0]));
            if (visible.length === 0) return null;
            return (
              <div key={group.label} className="mb-5">
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
