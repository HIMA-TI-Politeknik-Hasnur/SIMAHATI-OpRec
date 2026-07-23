import { useEffect, useRef, useState } from 'react';
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
import { StatCard, SidebarItem, QuickActionCard, ActivityItem, Skeleton, StatCardSkeleton, ChartSkeleton, ActivitySkeleton, MaterialSymbol } from '../components/ui';
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
      { key: 'role-management', label: 'Role Management', emoji: '👥', icon: 'admin_panel_settings', roles: ['super_admin', 'admin'] },
      { key: 'verifikasi-pendaftar', label: 'Verifikasi Pendaftar', emoji: '📋', icon: 'how_to_reg', roles: ['super_admin', 'admin', 'panitia'] },
      { key: 'verifikasi-email', label: 'Verifikasi Email', emoji: '📧', icon: 'mail', roles: ['super_admin'] },
      { key: 'tambah-staff', label: 'Tambah Staff', emoji: '👤', icon: 'person_add', roles: ['super_admin'] },
    ],
  },
  {
    label: 'Kegiatan',
    items: [
      { key: 'divisi', label: 'Divisi', emoji: '🏢', icon: 'group_work', roles: ['super_admin', 'admin', 'panitia'] },
      { key: 'interview', label: 'Interview', emoji: '📅', icon: 'calendar_today', roles: ['super_admin', 'admin', 'panitia', 'interviewer'] },
      { key: 'pengumuman', label: 'Pengumuman', emoji: '📢', icon: 'campaign', roles: ['super_admin', 'admin', 'panitia'] },
      { key: 'penilaian', label: 'Penilaian', emoji: '⭐', icon: 'star', roles: ['super_admin', 'interviewer'] },
    ],
  },
  {
    label: 'Pengaturan',
    items: [
      { key: 'benefit', label: 'Benefit', emoji: '🎁', icon: 'featured_play_list', roles: ['super_admin', 'admin'] },
      { key: 'settings', label: 'Settings', emoji: '⚙️', icon: 'settings', roles: ['super_admin', 'admin'] },
    ],
  },
];

const quickActions = [
  { label: 'Kelola Role', key: 'role-management', icon: 'admin_panel_settings', roles: ['super_admin', 'admin'], description: 'Kelola hak akses pengguna' },
  { label: 'Verifikasi Pendaftar', key: 'verifikasi-pendaftar', icon: 'person_search', roles: ['super_admin', 'admin', 'panitia'], description: 'Verifikasi data pendaftar baru' },
  { label: 'Verifikasi Email', key: 'verifikasi-email', icon: 'mark_email_read', roles: ['super_admin'], description: 'Verifikasi alamat email' },
  { label: 'Tambah Staff', key: 'tambah-staff', icon: 'person_add_alt_1', roles: ['super_admin'], description: 'Tambahkan anggota staff baru' },
  { label: 'Atur Divisi', key: 'divisi', icon: 'account_tree', roles: ['super_admin', 'admin', 'panitia'], description: 'Kelola divisi open recruitment' },
  { label: 'Pengaturan', key: 'settings', icon: 'settings_suggest', roles: ['super_admin', 'admin'], description: 'Konfigurasi konten website' },
];

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  panitia: 'Panitia',
  interviewer: 'Interviewer',
};

function getRoleLabel(roles: string[]): string {
  for (const r of roles) {
    if (roleLabels[r]) return roleLabels[r];
  }
  return roles[0] || 'User';
}

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
          <>
            {/* Welcome */}
            <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Panel Admin
                </p>
                <h2 className="text-2xl font-black text-on-background leading-tight">
                  Selamat datang, {user?.name?.split(' ')[0] || 'Admin'} 👋
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Pantau proses Open Recruitment secara real-time.
                </p>
              </div>
              <button className="shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-all shadow-sm">
                <MaterialSymbol icon="filter_list" className="text-[20px]" />
                Filter Data
              </button>
            </section>

            {/* Stat cards */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <StatCard icon="group" title="Total Pendaftar" value={stats?.total_pendaftar ?? 0} color="blue" trend={{ direction: 'up', value: 'Real-time' }} />
              <StatCard icon="schedule" title="Pending" value={stats?.pending_verifikasi ?? 0} color="yellow" trend={{ direction: 'neutral', value: 'Menunggu' }} />
              <StatCard icon="verified_user" title="Lolos Administrasi" value={stats?.lolos_administrasi ?? 0} color="green" trend={{ direction: 'up', value: 'Terverifikasi' }} />
              <StatCard icon="cancel" title="Ditolak" value={stats?.ditolak_administrasi ?? 0} color="red" trend={{ direction: 'neutral', value: 'Ditolak' }} />
            </section>

            {/* Chart + Activity */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-lg font-bold text-on-background">Statistik Pendaftar</h4>
                    <p className="text-sm text-on-surface-variant mt-0.5">Ringkasan status seleksi terkini</p>
                  </div>
                  <select className="bg-surface-container border-0 rounded-xl text-sm px-3 py-2 outline-none text-on-surface-variant focus:ring-2 focus:ring-primary/20">
                    <option>Periode ini</option>
                    <option>Bulan lalu</option>
                  </select>
                </div>

                <div className="flex gap-4 mb-4">
                  {[{ label: 'Lolos', color: 'bg-primary' }, { label: 'Ditolak', color: 'bg-error' }].map(l => (
                    <div key={l.label} className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                      <span className="text-xs text-on-surface-variant font-medium">{l.label}</span>
                    </div>
                  ))}
                </div>

                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe8" strokeWidth={0.8} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 600 }} stroke="#9d8c84" axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#9d8c84" axisLine={false} tickLine={false} width={28} />
                    <Tooltip
                      contentStyle={{ borderRadius: 14, border: '1px solid #e8ddd8', fontSize: 13, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                      cursor={{ fill: 'rgba(157,67,0,0.05)', radius: 8 }}
                    />
                    <Bar dataKey="value" fill="#9d4300" radius={[8, 8, 2, 2]} animationDuration={600} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Activity feed */}
              <div className="bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-bold text-on-background">Aktivitas Terkini</h4>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">Live</span>
                </div>
                <div className="flex-1 space-y-0">
                  <ActivityItem icon="person_add" title="Pendaftar baru" description={`${stats?.total_pendaftar ?? 0} total pendaftar terdaftar.`} time="Real-time" color="blue" />
                  <ActivityItem icon="event" title="Interview aktif" description={`${stats?.dalam_interview ?? 0} dalam tahap interview.`} time="Diperbarui" color="yellow" />
                  <ActivityItem icon="verified" title="Lolos seleksi" description={`${stats?.lolos_seleksi ?? 0} peserta diterima.`} time="Kumulatif" color="green" />
                </div>
                <button className="mt-6 w-full py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-all">
                  Lihat Semua Aktivitas
                </button>
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <MaterialSymbol icon="bolt" className="text-[20px]" />
                </div>
                <h4 className="text-lg font-bold text-on-background">Quick Actions</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.filter(a => user && a.roles.includes(user.roles[0])).map(action => (
                  <QuickActionCard
                    key={action.key}
                    icon={action.icon}
                    label={action.label}
                    description={action.description}
                    onClick={() => handleSidebarClick(action.key)}
                  />
                ))}
              </div>
            </section>
          </>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-[260px] hidden lg:block bg-white border-r border-gray-200">
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-7 w-36" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="space-y-1">
              {[1, 2, 3, 4, 5, 6, 7].map(i => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="h-16 border-b border-gray-200 px-8 flex items-center">
            <Skeleton className="h-9 w-full max-w-md rounded-full" />
          </div>
          <div className="p-8 space-y-8">
            <div>
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-8 w-96 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <StatCardSkeleton key={i} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ChartSkeleton />
              <ActivitySkeleton />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-36 bg-white border border-gray-200 rounded-xl" />
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
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500 gap-4">
        <p>Silakan login terlebih dahulu</p>
        <button className="px-5 py-2.5 rounded-lg border-none bg-gradient-to-r from-orange-600 to-orange-500 text-white cursor-pointer" onClick={() => onNavigate('login')}>
          Pergi ke Login
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500 gap-4">
        <p>Error: {error}</p>
        <button className="px-5 py-2.5 rounded-lg border-none bg-gradient-to-r from-orange-600 to-orange-500 text-white cursor-pointer" onClick={() => window.location.reload()}>
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        shrink-0 bg-white border-r border-outline-variant flex flex-col z-40
        transition-[width] duration-300 ease-in-out overflow-hidden
        sticky top-0 h-screen
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'w-[264px]' : 'w-0'}
        max-lg:fixed max-lg:left-0 max-lg:top-0 max-lg:h-full
      `}>
        {/* Logo header */}
        <div className="px-5 pt-6 pb-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="font-black text-xl text-primary tracking-tight leading-none">
              SIMAHATI
            </h1>
            <p className="text-[10px] text-on-surface-variant font-mono tracking-widest uppercase mt-0.5">
              OpRec Admin
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors lg:hidden"
            aria-label="Tutup sidebar"
          >
            <MaterialSymbol icon="close" className="text-[20px]" />
          </button>
        </div>

        <div className="mx-5 my-1 h-px bg-outline-variant/50" />

        {/* User avatar section */}
        <div className="mx-3 my-3 p-3 rounded-xl bg-surface-container flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-on-background truncate leading-none">
              {user?.name?.split(' ')[0] || 'Admin'}
            </p>
            <p className="text-[11px] text-on-surface-variant mt-0.5 truncate">
              {getRoleLabel(user?.roles || [])}
            </p>
          </div>
          <button
            onClick={handleLogoutClick}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors shrink-0"
            title="Logout"
          >
            <MaterialSymbol icon="logout" className="text-[18px]" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 custom-scrollbar space-y-4">
          {navGroups.map((group) => {
            const visible = group.items.filter((item) => user && item.roles.includes(user.roles[0]));
            if (visible.length === 0) return null;
            return (
              <div key={group.label}>
                <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest px-3 mb-1">
                  {group.label}
                </p>
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
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 flex flex-col">

        {/* ── Topbar ── */}
        <header className="h-16 px-4 md:px-6 flex items-center gap-3 bg-white sticky top-0 z-50 border-b border-outline-variant/60">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors shrink-0"
            aria-label="Toggle sidebar"
          >
            <MaterialSymbol icon={sidebarOpen ? 'menu_open' : 'menu'} className="text-[22px]" />
          </button>

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-1 text-sm text-on-surface-variant">
            <span
              className="hover:text-primary cursor-pointer transition-colors"
              onClick={() => handleSidebarClick('dashboard')}
            >
              Dashboard
            </span>
            {adminPage !== 'dashboard' && (
              <>
                <MaterialSymbol icon="chevron_right" className="text-[16px] text-outline" />
                <span className="font-semibold text-on-background capitalize">
                  {adminPage.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              </>
            )}
          </div>

          {/* Search — flex-1 di tengah */}
          <div className="flex-1 max-w-xs mx-auto hidden md:block">
            <div className="relative">
              <MaterialSymbol icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant/60" />
              <input
                type="text"
                placeholder="Cari menu..."
                className="w-full pl-9 pr-4 py-2 bg-surface-container rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-on-background placeholder:text-on-surface-variant/50"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors relative"
              aria-label="Notifikasi"
            >
              <MaterialSymbol icon="notifications" className="text-[22px]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white" />
            </button>

            <div className="h-6 w-px bg-outline-variant mx-1 hidden sm:block" />

            {/* User pill */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setTopbarDropdownOpen(v => !v)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-surface-container-high transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-on-background leading-none">
                    {user?.name?.split(' ')[0] || 'Admin'}
                  </p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">
                    {getRoleLabel(user?.roles || [])}
                  </p>
                </div>
                <MaterialSymbol
                  icon="expand_more"
                  className={`text-[18px] text-on-surface-variant transition-transform ${topbarDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {topbarDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-outline-variant rounded-2xl shadow-xl min-w-[200px] z-50 overflow-hidden animate-fade-in">
                  <div className="px-4 py-3 bg-surface-container/60">
                    <p className="text-sm font-bold text-on-background">{user?.name}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5 truncate">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleLogoutClick}
                      className="w-full px-3 py-2.5 text-left text-sm text-error hover:bg-error/10 rounded-xl flex items-center gap-2.5 transition-colors font-medium"
                    >
                      <MaterialSymbol icon="logout" className="text-[18px]" />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <div className="flex-1 p-5 md:p-8 space-y-8 animate-fade-in">
          {renderContent()}
        </div>

        {/* ── Footer ── */}
        <footer className="px-6 md:px-8 py-5 border-t border-outline-variant/60 bg-white flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-on-surface-variant">
            © 2027 SIMAHATI Open Recruitment System.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Contact'].map(link => (
              <a key={link} className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">
                {link}
              </a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
