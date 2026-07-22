import { useState, useEffect } from 'react';
import { getAuthToken } from '../api';
import { Rating } from '../components/Rating';
import './PenilaianPage.css';

interface Penilaian {
  id: number;
  interview_id: number;
  interviewer_id: number;
  nilai: number;
  catatan: string | null;
}

interface Interview {
  id: number;
  peserta_id: number;
  interviewer_id: number;
  tanggal: string;
  waktu: string;
  status: string;
  penilaian: Penilaian | null;
}

interface PesertaOption { id: number; nama_lengkap: string; nim: string; }

interface ModalState {
  interviewId: number;
  pesertaId: number;
  existingNilai: number | null;
  existingCatatan: string | null;
}

interface PenilaianPageProps {
  currentUser?: { id: number; roles: string[] };
}

export const PenilaianPage = ({ currentUser }: PenilaianPageProps) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [pesertaList, setPesertaList] = useState<PesertaOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modal, setModal] = useState<ModalState | null>(null);
  const [formNilai, setFormNilai] = useState(0);
  const [formCatatan, setFormCatatan] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const isInterviewer = currentUser?.roles.includes('interviewer');

  const authHeaders = (): Record<string, string> => {
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/interview', { headers: authHeaders() });
      const json = await res.json();
      setInterviews(json.data ?? []);
    } catch {
      setError('Gagal memuat data interview.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPeserta = async () => {
    try {
      const res = await fetch('/api/peserta', { headers: authHeaders() });
      const json = await res.json();
      setPesertaList(json.data ?? []);
    } catch {
      /* abaikan */
    }
  };

  useEffect(() => { fetchInterviews(); fetchPeserta(); }, []);

  const filteredByUser = isInterviewer
    ? interviews.filter(iv => iv.interviewer_id === currentUser!.id)
    : interviews;

  const displayed = filterStatus === 'all'
    ? filteredByUser
    : filteredByUser.filter(iv => iv.status === filterStatus);

  const openModal = (interview: Interview) => {
    setModal({
      interviewId: interview.id,
      pesertaId: interview.peserta_id,
      existingNilai: interview.penilaian?.nilai ?? null,
      existingCatatan: interview.penilaian?.catatan ?? null,
    });
    setFormNilai(interview.penilaian?.nilai ?? 0);
    setFormCatatan(interview.penilaian?.catatan ?? '');
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setModal(null);
    setFormNilai(0);
    setFormCatatan('');
  };

  const handleSubmitPenilaian = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/interview/${modal.interviewId}/penilaian`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          nilai: formNilai,
          catatan: formCatatan || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? 'Terjadi kesalahan.');
      setSuccess(json.message);
      closeModal();
      fetchInterviews();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    }
  };

  const statusLabel: Record<string, string> = {
    scheduled: 'Terjadwal',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };

  const pesertaName = (id: number) => {
    const p = pesertaList.find(x => x.id === id);
    return p ? `${p.nama_lengkap} (${p.nim ? `#${p.nim}` : `#${p.id}`})` : `#${id}`;
  };

  return (
    <div className="page-layout">
      <h1 className="page-title">Penilaian Interview</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="table-card">
        <div className="penilaian-header">
          <h3>Daftar Interview — Kelola Penilaian</h3>
          <select
            className="penilaian-filter"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="scheduled">Terjadwal</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
        {loading ? (
          <p className="loading-text">Memuat data...</p>
        ) : displayed.length === 0 ? (
          <p className="empty-text">Belum ada data interview.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Interview</th>
                <th>Peserta</th>
                <th>Tanggal & Waktu</th>
                <th>Status</th>
                <th>Nilai</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(iv => {
                const isMyInterview = !isInterviewer || iv.interviewer_id === currentUser!.id;
                return (
                  <tr key={iv.id}>
                    <td>#{iv.id}</td>
                    <td>{pesertaName(iv.peserta_id)}</td>
                    <td>
                      {iv.tanggal}<br />
                      <small>{iv.waktu.slice(0, 5)} WIB</small>
                    </td>
                    <td>{statusLabel[iv.status] ?? iv.status}</td>
                    <td>
                      {iv.penilaian ? (
                        <Rating value={iv.penilaian.nilai} readonly showBar={false} />
                      ) : (
                        <span className="badge-belum">Belum dinilai</span>
                      )}
                    </td>
                    <td>
                      {isMyInterview ? (
                        <button className="btn-nilai" onClick={() => openModal(iv)}>
                          {iv.penilaian ? 'Ubah Nilai' : 'Beri Nilai'}
                        </button>
                      ) : (
                        <span className="badge-status" style={{ fontSize: '0.85rem' }}>Akses terbatas</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Penilaian */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3>{modal.existingNilai !== null ? 'Ubah Penilaian' : 'Beri Penilaian'}</h3>
            <p className="modal-subtitle">
              Interview #{modal.interviewId} — {pesertaName(modal.pesertaId)}
            </p>
            <form onSubmit={handleSubmitPenilaian}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <Rating
                  value={formNilai}
                  onChange={val => setFormNilai(val)}
                  label="Nilai (0 – 100)"
                  showBar
                />
                <p className="nilai-hint">Klik bintang atau ketik angka langsung.</p>
              </div>

              <div className="form-group">
                <label>Catatan / Feedback (opsional)</label>
                <textarea
                  rows={3}
                  placeholder="Catatan untuk peserta..."
                  value={formCatatan}
                  onChange={e => setFormCatatan(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  Simpan Penilaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
