import { useEffect, useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { CmsPanel } from './pages/CmsPanel';
import { DivisiPage } from './pages/DivisiPage';
import { DivisiDetailPage } from './pages/DivisiDetailPage';
import { InterviewPage } from './pages/InterviewPage';
import { PenilaianPage } from './pages/PenilaianPage';
import { DashboardDivisi } from './pages/DashboardDivisi';
import { DashboardPeserta } from './pages/DashboardPeserta';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifikasiEmailPage } from './pages/VerifikasiEmailPage';
import { EmailTerverifikasiPage } from './pages/EmailTerverifikasiPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import {
  apiFetch,
  apiPost,
  isAuthenticated,
  isSessionAuth,
  getStoredUser,
  setStoredUser,
  clearAuth,
  sessionFetch,
  sessionPost,
  type UserData,
} from './api';
import './App.css';

type Page =
  | 'landing'
  | 'dashboard'
  | 'cms'
  | 'divisi'
  | 'divisi-detail'
  | 'interview'
  | 'penilaian'
  | 'dashboard-divisi'
  | 'dashboard-peserta'
  | 'login'
  | 'register'
  | 'admin-dashboard'
  | 'forgot-password'
  | 'reset-password'
  | 'verifikasi-email'
  | 'email-verified';

interface NavLink {
  label: string;
  action: Page | 'scroll-about' | 'scroll-timeline' | 'scroll-faq' | 'logout';
  match?: Page[];
}

const guestLinks: NavLink[] = [
  { label: 'Beranda', action: 'landing' },
  { label: 'Tentang', action: 'scroll-about' },
  { label: 'Timeline', action: 'scroll-timeline' },
  { label: 'FAQ', action: 'scroll-faq' },
  { label: 'Login', action: 'login' },
  { label: 'Daftar', action: 'register' },
];

const pesertaLinks: NavLink[] = [
  { label: 'Dashboard', action: 'dashboard-peserta' },
  { label: 'Pendaftaran', action: 'form-pendaftaran' },
  { label: 'Logout', action: 'logout' },
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedDivisiId, setSelectedDivisiId] = useState<number | null>(null);
  const [pesertaId, setPesertaId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());
  const [user, setUser] = useState<UserData | null>(() => getStoredUser());
  const [authLoading, setAuthLoading] = useState(() => isAuthenticated() && !getStoredUser());
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/email-verified') {
      setCurrentPage('email-verified');
      window.history.replaceState(null, '', '/');
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) return;

    const stored = getStoredUser();
    if (stored) {
      const role = stored.roles?.[0] ?? '';
      if (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register') {
        const dest = role === 'Peserta' ? 'dashboard-peserta'
          : ['Super Admin', 'Admin', 'Panitia'].includes(role) ? 'admin-dashboard'
          : 'interview';
        setCurrentPage(dest);
      }
      if (stored.peserta_id) setPesertaId(stored.peserta_id);
      return;
    }

    const fetchUser = async () => {
      const { data, error: apiError } = isSessionAuth()
        ? await sessionFetch<{ success: boolean; data: UserData }>('/api/session/user')
        : await apiFetch<{ success: boolean; data: UserData }>('/api/user');

      if (data?.data) {
        const u = data.data;
        setUser(u);
        setStoredUser(u);
        if (u.peserta_id) setPesertaId(u.peserta_id);
        const role = u.roles?.[0] ?? '';
        const adminRoles = ['Super Admin', 'Admin', 'Panitia'];
        if (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register') {
          const dest = role === 'Peserta' ? 'dashboard-peserta'
            : adminRoles.includes(role) ? 'admin-dashboard'
            : 'interview';
          setCurrentPage(dest);
        } else if (role === 'Peserta' && currentPage === 'admin-dashboard') {
          setCurrentPage('dashboard-peserta');
        } else if (![...adminRoles, 'Peserta'].includes(role) && currentPage === 'admin-dashboard') {
          setCurrentPage('interview');
        }
      } else if (apiError) {
        clearAuth();
        setIsLoggedIn(false);
        setCurrentPage('landing');
      }
      setAuthLoading(false);
    };
    fetchUser();
  }, [currentPage]);

  const userRole = user?.roles?.[0] ?? '';
  const isPeserta = userRole === 'Peserta';
  const isStaff = ['Super Admin', 'Admin', 'Panitia', 'Interviewer'].includes(userRole);
  const canViewDashboard = ['Super Admin', 'Admin', 'Panitia'].includes(userRole);
  const canViewDivisi = ['Super Admin', 'Admin', 'Panitia'].includes(userRole);
  const canViewPenilaian = ['Super Admin', 'Admin', 'Interviewer'].includes(userRole);

  const buildStaffLinks = (): NavLink[] => {
    const links: NavLink[] = [];
    if (canViewDashboard) links.push({ label: 'Dashboard', action: 'admin-dashboard' });
    if (canViewDivisi) links.push({ label: 'Divisi', action: 'divisi', match: ['divisi-detail'] });
    if (isStaff) links.push({ label: 'Interview', action: 'interview' });
    if (canViewPenilaian) links.push({ label: 'Penilaian', action: 'penilaian' });
    links.push({ label: 'Logout', action: 'logout' });
    return links;
  };

  const navMode: 'guest' | 'peserta' | 'staff' =
    !isLoggedIn ? 'guest' :
    isPeserta ? 'peserta' :
    'staff';

  const currentLinks = navMode === 'guest' ? guestLinks
    : navMode === 'peserta' ? pesertaLinks
    : buildStaffLinks();

  const handleViewDivisiDetail = (id: number) => {
    setSelectedDivisiId(id);
    setCurrentPage('divisi-detail');
  };

  const handleLogout = async () => {
    try {
      if (isSessionAuth()) {
        await sessionPost('/api/session/logout');
      } else {
        await apiPost('/api/logout');
      }
    } catch {
    }
    clearAuth();
    setIsLoggedIn(false);
    setUser(null);
    setPesertaId(null);
    setCurrentPage('landing');
  };

  const [activeSection, setActiveSection] = useState('landing');

  useEffect(() => {
    if (currentPage !== 'landing') return;
    const ids = ['landing', 'about', 'timeline', 'faq'];
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          setActiveSection(e.target.id);
          break;
        }
      }
    }, { rootMargin: '-40% 0px -55% 0px' });
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [currentPage]);

  const handleNav = (action: string) => {
    if (action === 'logout') {
      handleLogout();
      return;
    }
    if (action.startsWith('scroll-')) {
      const sectionId = action.replace('scroll-', '');
      setActiveSection(sectionId);
      if (currentPage !== 'landing') {
        setCurrentPage('landing');
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    setActiveSection(action);
    setCurrentPage(action as Page);
  };

  const isNavActive = (link: NavLink) => {
    if (link.action.startsWith('scroll-')) {
      const sectionId = link.action.replace('scroll-', '');
      return currentPage === 'landing' && activeSection === sectionId;
    }
    return currentPage === link.action || (link.match?.includes(currentPage) ?? false);
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#94a3b8' }}>
        Memuat...
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <div className="nav-logo" onClick={() => setCurrentPage('landing')}>
          SIMAHATI OPREC
        </div>
        {navMode === 'guest' && (
          <ul className="nav-links">
            {currentLinks.map(link => (
              <li key={link.action}>
                {['login', 'register', 'daftar'].includes(String(link.action)) ? (
                  <button className="nav-btn" onClick={() => handleNav(link.action)}>
                    {link.label}
                  </button>
                ) : (
                  <a
                    href={`#${link.action.replace('scroll-', '')}`}
                    className={isNavActive(link) ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); handleNav(link.action); }}
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
        {navMode !== 'guest' && (
          <ul className="nav-links">
            <li><button className="nav-btn nav-btn--outline" onClick={handleLogout}>Logout</button></li>
          </ul>
        )}
      </nav>

      {currentPage === 'landing' && (
        <LandingPage
          onNavigate={(page) => handleNav(page)}
        />
      )}
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
      {currentPage === 'dashboard-peserta' && (
        <DashboardPeserta
          pesertaId={pesertaId}
        />
      )}
      {currentPage === 'login' && (
        <LoginPage
          onLoginSuccess={(userData) => {
            setIsLoggedIn(true);
            setUser(userData);
            setStoredUser(userData);
            if (userData.peserta_id) setPesertaId(userData.peserta_id);
            const role = userData.roles?.[0] ?? '';
            const adminRoles = ['Super Admin', 'Admin', 'Panitia'];
            const dest = role === 'Peserta' ? 'dashboard-peserta'
              : adminRoles.includes(role) ? 'admin-dashboard'
              : 'interview';
            setCurrentPage(dest);
          }}
          onSwitchToRegister={() => setCurrentPage('register')}
          onForgotPassword={() => setCurrentPage('forgot-password')}
        />
      )}
      {currentPage === 'register' && (
        <RegisterPage
          onRegisterSuccess={(email) => {
            setPendingEmail(email);
            setCurrentPage('verifikasi-email');
          }}
          onSwitchToLogin={() => setCurrentPage('login')}
        />
      )}
      {currentPage === 'admin-dashboard' && (
        <AdminDashboard onNavigate={(page) => setCurrentPage(page as Page)} />
      )}
      {currentPage === 'forgot-password' && (
        <ForgotPasswordPage onBackToLogin={() => setCurrentPage('login')} />
      )}
      {currentPage === 'reset-password' && (
        <ResetPasswordPage onBackToLogin={() => setCurrentPage('login')} />
      )}
      {currentPage === 'verifikasi-email' && pendingEmail && (
        <VerifikasiEmailPage
          email={pendingEmail}
          onLogin={() => {
            setPendingEmail(null);
            setCurrentPage('login');
          }}
        />
      )}
      {currentPage === 'email-verified' && (
        <EmailTerverifikasiPage
          onLogin={() => setCurrentPage('login')}
        />
      )}
    </div>
  );
}

export default App;
