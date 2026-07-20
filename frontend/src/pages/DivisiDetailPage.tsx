import { useState, useEffect } from 'react';
import './DivisiDetailPage.css';

interface Divisi {
  id: number;
  nama: string;
  deskripsi: string;
  kuota: number;
}

interface Peserta {
  id: number;
  nama_lengkap: string;
  nim: string;
  email: string;
  status_administrasi: 'pending' | 'verified' | 'rejected';
}

interface DivisiDetailPageProps {
  divisiId: number;
  onBack: () => void;
}

export const DivisiDetailPage = ({ divisiId, onBack }: DivisiDetailPageProps) => {
  const [divisi, setDivisi] = useState<Divisi | null>(null);
  const [pesertaList, setPesertaList] = useState<Peserta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API = 'http://localhost:8000/api';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const divisiRes = await fetch(`${API}/divisi/${divisiId}`);
        const divisiJson = await divisiRes.json();
        if (!divisiRes.ok) throw new Error(divisiJson.message ?? 'Gagal memuat divisi.');
        setDivisi(divisiJson.data);

        // Ambil peserta yang memilih divisi ini (jika endpoint tersedia)
        const pesertaRes = await fetch(`${API}/peserta?divisi_id=${divisiId}`);
        if (pesertaRes.ok) {
          const pesertaJson = await pesertaRes.json();
          setPesertaList(pesertaJson.data ?? []);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [divisiId]);

  const statusLabel: Record<string, string> = {
    pending: 'Menunggu',
    verified: 'Terverifikasi',
    rejected: 'Ditolak',
  };

  const persen = divisi ? Math.min(Math.round((pesertaList.length / divisi.kuota) * 100), 100) : 0;

  return (
    <div className="page-layout">
      <div className="page-header">
        <button className="btn-back" onClick={onBack}>← Kembali</button>
        <h1 className="page-title">{divisi ? divisi.nama : 'Detail Divisi'}</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="loading-text">Memuat data...</p>
      ) : divisi ? (
        <div className="detail-grid">
          {/* Info Divisi */}
          <div className="info-card">
            <h3>Informasi Divisi</h3>

            <div className="info-row">
              <span className="info-label">Nama Divisi</span>
              <span className="info-value">{divisi.nama}</span>
            </div>

            <div className="info-row">
              <span className="info-label">Deskripsi</span>
              <span className="info-value deskripsi">{divisi.deskripsi}</span>
            </div>

            <div className="info-row">
              <span className="info-label">Kuota</span>
              <span className="info-value">{divisi.kuota} orang</span>
            </div>

            <div className="info-row">
              <span className="info-label">Terisi</span>
              <div className="kuota-bar-wrap">
                <div className="kuota-bar-bg">
                  <div
                    className="kuota-bar-fill"
                    style={{ width: `${persen}%` }}
                  />
                </div>
                <div className="kuota-label">
                  <span>{pesertaList.length} peserta</span>
                  <span>{persen}% dari {divisi.kuota}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daftar Peserta */}
          <div className="peserta-card">
            <h3>Daftar Peserta ({pesertaList.length})</h3>
            {pesertaList.length === 0 ? (
              <p className="empty-text">Belum ada peserta yang memilih divisi ini.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>NIM</th>
                    <th>Email</th>
                    <th>Status Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {pesertaList.map(p => (
                    <tr key={p.id}>
                      <td>{p.nama_lengkap}</td>
                      <td>{p.nim}</td>
                      <td>{p.email}</td>
                      <td>
                        <span className={`badge-status ${p.status_administrasi}`}>
                          {statusLabel[p.status_administrasi] ?? p.status_administrasi}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
