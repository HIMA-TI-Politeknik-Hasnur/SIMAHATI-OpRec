import { useState, useEffect } from 'react';
import './Dashboard.css';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { NotificationCard } from '../components/NotificationCard';

interface Pengumuman {
  id: number;
  judul: string;
  isi: string;
  tipe: 'info' | 'warning' | 'success' | 'danger';
  published_at: string;
}

interface Notification {
  id: string;
  type: string;
  data: { message: string; link?: string };
  read_at: string | null;
  created_at: string;
}

export const Dashboard = () => {
  const [announcements, setAnnouncements] = useState<Pengumuman[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Fetch pengumuman publik — tidak perlu login
    fetch('/api/pengumuman/publik', { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(json => { if (json.success) setAnnouncements(json.data ?? []); })
      .catch(() => {
        // Fallback ke dummy jika backend belum jalan
        setAnnouncements([
          { id: 1, judul: 'Jadwal Interview Berubah', isi: 'Halo, jadwal interview diubah menjadi tanggal 20 Agustus.', tipe: 'warning', published_at: '2026-08-10T10:00:00Z' },
          { id: 2, judul: 'Selamat Datang!', isi: 'Silakan lengkapi berkas pendaftaran Anda di menu pengaturan.', tipe: 'info', published_at: '2026-08-01T08:00:00Z' },
        ]);
      });

    // Fetch notifikasi — perlu auth, abaikan jika gagal
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetch('/api/notifications', {
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(json => { if (json.success) setNotifications(json.data ?? []); })
        .catch(() => {});
    }
  }, []);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">SIMAHATI OpRec</div>
        <ul className="sidebar-nav">
          <li className="active">Dashboard</li>
          <li>Pengumuman</li>
          <li>Notifikasi</li>
          <li>Laporan</li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Dashboard Overview</h1>
          <div className="user-profile">
            <div className="avatar">A</div>
            <span>Admin</span>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="dashboard-column">
            <h2 className="column-title">Pengumuman Terbaru</h2>
            {announcements.map(ann => (
              <AnnouncementCard key={ann.id} {...ann} />
            ))}
          </div>

          <div className="dashboard-column">
            <h2 className="column-title">Notifikasi ({notifications.filter(n => !n.read_at).length})</h2>
            <div className="notifications-container">
              {notifications.map(notif => (
                <NotificationCard key={notif.id} {...notif} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
