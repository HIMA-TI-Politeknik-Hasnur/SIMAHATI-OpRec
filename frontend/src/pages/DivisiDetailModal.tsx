import { useState, useEffect } from 'react';
import { getAuthToken } from '../api';

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
  pilihan_divisi_1?: number;
}

interface DivisiDetailModalProps {
  divisiId: number;
  onClose: () => void;
}

const statusLabel: Record<string, string> = {
  pending: 'Menunggu',
  verified: 'Terverifikasi',
  rejected: 'Ditolak',
};

export const DivisiDetailModal = ({ divisiId, onClose }: DivisiDetailModalProps) => {
  const [divisi, setDivisi] = useState<Divisi | null>(null);
  const [pesertaList, setPesertaList] = useState<Peserta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const authHeaders = (): Record<string, string> => {
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const divisiRes = await fetch(`/api/divisi/${divisiId}`, { headers: authHeaders() });
        const divisiJson = await divisiRes.json();
        if (!divisiRes.ok) throw new Error(divisiJson.message ?? 'Gagal memuat divisi.');
        setDivisi(divisiJson.data);

        const pesertaRes = await fetch('/api/peserta', { headers: authHeaders() });
        if (pesertaRes.ok) {
          const pesertaJson = await pesertaRes.json();
          const semuaPeserta: Peserta[] = pesertaJson.data ?? [];
          setPesertaList(semuaPeserta.filter(p => p.pilihan_divisi_1 === divisiId));
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [divisiId]);

  const persen = divisi ? Math.min(Math.round((pesertaList.length / divisi.kuota) * 100), 100) : 0;

  return (
    <div className="ap-overlay" onClick={onClose}>
      <div className="ap-modal ap-modal--detail" onClick={(e) => e.stopPropagation()}>
        <div className="ap-modal-header">
          <h3>{divisi ? divisi.nama : 'Detail Divisi'}</h3>
          <button className="ap-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="ap-modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <p className="loading-text" style={{ textAlign: 'center', padding: '2rem 0' }}>Memuat data...</p>
          ) : divisi ? (
            <div className="detail-modal-grid">
              <div className="info-card">
                <h4>Informasi Divisi</h4>

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
                      <div className="kuota-bar-fill" style={{ width: `${persen}%` }} />
                    </div>
                    <div className="kuota-label">
                      <span>{pesertaList.length} peserta</span>
                      <span>{persen}% dari {divisi.kuota}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="peserta-card">
                <h4>Daftar Peserta ({pesertaList.length})</h4>
                {pesertaList.length === 0 ? (
                  <p className="empty-text">Belum ada peserta yang memilih divisi ini.</p>
                ) : (
                  <div className="table-scroll">
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
                            <td>{p.nim || '-'}</td>
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
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
