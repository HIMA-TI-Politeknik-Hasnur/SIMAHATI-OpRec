import { useState, useEffect } from 'react';
import { getAuthToken } from '../api';
import './DashboardDivisi.css';

interface Divisi {
  id: number;
  nama: string;
  kuota: number;
}

interface DashboardStats {
  totalDivisi: number;
  totalInterview: number;
  totalPendaftar: number;
}

export const DashboardDivisi = () => {
  const [divisis, setDivisis] = useState<Divisi[]>([]);
  const [pesertaPerDivisi, setPesertaPerDivisi] = useState<Record<number, number>>({});
  const [stats, setStats] = useState<DashboardStats>({ totalDivisi: 0, totalInterview: 0, totalPendaftar: 0 });
  const [loading, setLoading] = useState(true);

  const authHeaders = (): Record<string, string> => {
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const headers = authHeaders();

        const divisiRes = await fetch('/api/divisi', { headers });
        const divisiJson = await divisiRes.json();
        const divisiData: Divisi[] = divisiJson.data ?? [];
        setDivisis(divisiData);

        const interviewRes = await fetch('/api/interview', { headers });
        const interviewJson = await interviewRes.json();
        const totalInterview: number = (interviewJson.data ?? []).length;

        let totalPendaftar = 0;
        const countMap: Record<number, number> = {};
        try {
          const pesertaRes = await fetch('/api/peserta', { headers });
          if (pesertaRes.ok) {
            const pesertaJson = await pesertaRes.json();
            const pesertaData = pesertaJson.data ?? [];
            totalPendaftar = pesertaData.length;
            pesertaData.forEach((p: { pilihan_divisi_1?: number }) => {
              if (p.pilihan_divisi_1) {
                countMap[p.pilihan_divisi_1] = (countMap[p.pilihan_divisi_1] ?? 0) + 1;
              }
            });
          }
        } catch {
          // endpoint peserta belum tersedia (tugas Nadil)
        }

        setPesertaPerDivisi(countMap);
        setStats({
          totalDivisi: divisiData.length,
          totalInterview,
          totalPendaftar,
        });
      } catch {
        // silent — tampil loading selesai dengan data kosong
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="page-layout">
      <h1 className="page-title">Dashboard Divisi & Interview</h1>
      <p className="page-subtitle">Ringkasan statistik kuota divisi, pendaftar, dan penjadwalan interview.</p>

      {/* Kartu statistik utama */}
      <div className="stats-grid">
        <div className="stat-card accent-orange">
          <span className="stat-icon">🏢</span>
          <span className="stat-value">{stats.totalDivisi}</span>
          <span className="stat-label">Total Divisi</span>
        </div>
        <div className="stat-card accent-blue">
          <span className="stat-icon">👥</span>
          <span className="stat-value">{stats.totalPendaftar}</span>
          <span className="stat-label">Total Pendaftar</span>
        </div>
        <div className="stat-card accent-green">
          <span className="stat-icon">🗓️</span>
          <span className="stat-value">{stats.totalInterview}</span>
          <span className="stat-label">Jadwal Interview</span>
        </div>
      </div>

      {/* Statistik per divisi */}
      <p className="section-title">Status Kuota per Divisi</p>

      {loading ? (
        <div className="divisi-list">
          <p className="loading-text">Memuat data...</p>
        </div>
      ) : (
        <div className="divisi-list">
          {divisis.length === 0 ? (
            <p className="loading-text">Belum ada divisi terdaftar.</p>
          ) : (
            divisis.map(divisi => {
              const terisi = pesertaPerDivisi[divisi.id] ?? 0;
              const persen = divisi.kuota > 0 ? Math.min(Math.round((terisi / divisi.kuota) * 100), 100) : 0;
              const penuh = terisi >= divisi.kuota;

              return (
                <div key={divisi.id} className="divisi-stat-card">
                  <div className="divisi-stat-header">
                    <span className="divisi-stat-name">{divisi.nama}</span>
                    <span className={`divisi-stat-badge ${penuh ? 'penuh' : 'tersedia'}`}>
                      {penuh ? 'Penuh' : 'Tersedia'}
                    </span>
                  </div>

                  <div className="divisi-stat-row">
                    <span>Pendaftar</span>
                    <span>{terisi} orang</span>
                  </div>
                  <div className="divisi-stat-row">
                    <span>Kuota</span>
                    <span>{divisi.kuota} orang</span>
                  </div>
                  <div className="divisi-stat-row">
                    <span>Sisa</span>
                    <span>{Math.max(divisi.kuota - terisi, 0)} orang</span>
                  </div>

                  <div className="divisi-kuota-bar-bg">
                    <div
                      className={`divisi-kuota-bar-fill${penuh ? ' full' : ''}`}
                      style={{ width: `${persen}%` }}
                    />
                  </div>
                  <div className="divisi-stat-footer">
                    <span>{persen}% terisi</span>
                    <span>{divisi.kuota - terisi > 0 ? `${divisi.kuota - terisi} kursi tersisa` : 'Penuh'}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
