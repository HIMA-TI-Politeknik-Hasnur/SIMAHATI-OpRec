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
            <section className="flex flex-col md:flex-row justify-between items-end gap-4">
              <div className="space-y-1">
                <h2 className="font-bold text-2xl text-gray-900">
                  Selamat datang, {user?.name?.split(' ')[0] || 'Admin'}
                </h2>
                <p className="text-gray-500 text-lg">Pantau proses Open Recruitment secara real-time.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                <MaterialSymbol icon="filter_list" className="text-xl" />
                <span>Filter Data</span>
              </button>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon="person" title="Total Pendaftar" value={stats?.total_pendaftar ?? 0} color="blue" trend={{ direction: 'up', value: '+100%' }} />
              <StatCard icon="schedule" title="Pending Verifikasi" value={stats?.pending_verifikasi ?? 0} color="yellow" trend={{ direction: 'neutral', value: 'No change' }} />
              <StatCard icon="verified_user" title="Lolos Administrasi" value={stats?.lolos_administrasi ?? 0} color="green" trend={{ direction: 'up', value: 'Valid' }} />
              <StatCard icon="cancel" title="Ditolak" value={stats?.ditolak_administrasi ?? 0} color="red" trend={{ direction: 'neutral', value: 'Cleared' }} />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="font-bold text-2xl text-gray-900">Statistik Pendaftar</h4>
                    <p className="text-sm text-gray-500">Data pendaftar periode 2027</p>
                  </div>
                  <select className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-2 outline-none text-gray-600">
                    <option>Bulanan</option>
                    <option>Mingguan</option>
                  </select>
                </div>

                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-600" />
                    <span className="text-sm text-gray-400">Lolos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-600" />
                    <span className="text-sm text-gray-400">Interview</span>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0c0b1" strokeWidth={0.5} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#8c7164" axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#8c7164" axisLine={false} tickLine={false} width={30} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #9d4300', fontSize: 13 }} />
                    <Bar dataKey="value" fill="#9d4300" radius={[8, 8, 0, 0]} animationDuration={500} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h4 className="font-bold text-2xl text-gray-900 mb-6">Aktivitas Terkini</h4>
                <div className="relative timeline-line space-y-0">
                  <ActivityItem icon="person_add" title="Total Pendaftar" description="1 pendaftar terdaftar baru." time="10 menit lalu" color="blue" />
                  <ActivityItem icon="event" title="Interview Berjalan" description="1 dalam tahap interview akhir." time="1 jam lalu" color="yellow" />
                  <ActivityItem icon="verified" title="Lolos Seleksi" description="Hasil verifikasi dokumen selesai." time="Kemarin, 14:30" color="green" />
                </div>
                <button className="w-full mt-6 py-3 rounded-lg border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-all">
                  Lihat Semua Aktivitas
                </button>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MaterialSymbol icon="bolt" />
                </div>
                <h4 className="font-bold text-2xl text-gray-900">Quick Actions</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickActions.filter(a => user && a.roles.includes(user.roles[0])).map(action => (
                  <QuickActionCard key={action.key} icon={action.icon} label={action.label} description={action.description} onClick={() => handleSidebarClick(action.key)} />
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
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/45 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 flex flex-col z-50 transition-all duration-300 ${sidebarOpen ? 'w-[260px]' : 'w-0 overflow-hidden'}`}>
        <div className="px-6 py-8 flex flex-col gap-1">
          <h1 className="font-bold text-2xl text-primary tracking-tight">
            SIMAHATI OpRec
          </h1>
          <p className="text-xs text-gray-400 font-mono tracking-wider uppercase">
            PANEL ADMIN
          </p>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 custom-scrollbar">
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
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center gap-3 py-3 px-4 text-gray-500 hover:bg-gray-50 rounded-lg transition-all"
          >
            <MaterialSymbol icon="vertical_align_center" className="text-xl" />
            <span className="text-sm font-medium">Persempit</span>
          </button>
        </div>
      </aside>

      <main className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-[260px]' : ''}`}>
        <header className="h-16 px-8 flex justify-between items-center bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <MaterialSymbol icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari menu..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" aria-label="Toggle theme">
                <MaterialSymbol icon="light_mode" />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative" aria-label="Notifications">
                <MaterialSymbol icon="notifications" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleSidebarClick('dashboard')}
                className="px-4 py-1.5 rounded-lg border-2 border-primary text-primary font-bold text-sm hover:bg-primary/10 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogoutClick}
                className="px-4 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setTopbarDropdownOpen(v => !v)}
                  className="flex items-center gap-3 pl-2 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900 leading-none">{user?.name?.split(' ')[0] || 'Admin'}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{getRoleLabel(user?.roles || [])}</p>
                  </div>
                  <MaterialSymbol icon="expand_more" className="text-gray-400 group-hover:text-primary transition-colors" />
                </button>
                {topbarDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg min-w-[180px] z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <MaterialSymbol icon="logout" className="text-lg" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {renderContent()}
        </div>

        <footer className="mt-auto px-8 py-6 border-t border-gray-200 bg-white flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">© 2027 SIMAHATI Open Recruitment System. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a className="text-xs text-gray-500 hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="text-xs text-gray-500 hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="text-xs text-gray-500 hover:text-primary transition-colors" href="#">Contact Support</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
