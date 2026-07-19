import './Dashboard.css';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { NotificationCard } from '../components/NotificationCard';

export const Dashboard = () => {
  // Dummy data
  const announcements = [
    { id: 1, judul: 'Jadwal Interview Berubah', isi: 'Halo, jadwal interview diubah menjadi tanggal 20 Agustus.', tipe: 'warning' as const, published_at: '2026-08-10T10:00:00Z' },
    { id: 2, judul: 'Selamat Datang!', isi: 'Silakan lengkapi berkas pendaftaran Anda di menu pengaturan.', tipe: 'info' as const, published_at: '2026-08-01T08:00:00Z' },
  ];

  const notifications = [
    { id: '1', type: 'App\\Notifications\\BerkasDiterima', data: { message: 'Berkas Anda telah diverifikasi oleh admin.', link: '#' }, read_at: null, created_at: '2026-08-11T09:30:00Z' },
    { id: '2', type: 'App\\Notifications\\Pengingat', data: { message: 'Jangan lupa kumpulkan KTM besok.' }, read_at: '2026-08-10T09:30:00Z', created_at: '2026-08-09T09:30:00Z' },
  ];

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
