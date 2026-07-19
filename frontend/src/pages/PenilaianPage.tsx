import { useState, useEffect } from 'react';
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
  tanggal: string;
  waktu: string;
  status: string;
  penilaian: Penilaian | null;
}

interface ModalState {
  interviewId: number;
  pesertaId: number;
  existingNilai: number | null;
  existingCatatan: string | null;
}

export const PenilaianPage = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modal, setModal] = useState<ModalState | null>(null);
  const [formNilai, setFormNilai] = useState('');
  const [formCatatan, setFormCatatan] = useState('');

  const API_INTERVIEW = 'http://localhost:8000/api/interview';

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_INTERVIEW);
      const json = await res.json();
      setInterviews(json.data);
    } catch {
      setError('Gagal memuat data interview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInterviews(); }, []);

  const openModal = (interview: Interview) => {
    setModal({
      interviewId: interview.id,
      pesertaId: interview.peserta_id,
      existingNilai: interview.penilaian?.nilai ?? null,
      existingCatatan: interview.penilaian?.catatan ?? null,
    });
    setFormNilai(String(interview.penilaian?.nilai ?? ''));
    setFormCatatan(interview.penilaian?.catatan ?? '');
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setModal(null);
    setFormNilai('');
    setFormCatatan('');
  };

  const handleSubmitPenilaian = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_INTERVIEW}/${modal.interviewId}/penilaian`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          nilai: Number(formNilai),
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

  return (
    <div className="page-layout">
      <h1 className="page-title">Penilaian Interview</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="table-card">
        <h3>Daftar Interview — Kelola Penilaian</h3>
        {loading ? (
          <p className="loading-text">Memuat data...</p>
        ) : interviews.length === 0 ? (
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
              {interviews.map(iv => (
                <tr key={iv.id}>
                  <td>#{iv.id}</td>
                  <td>#{iv.peserta_id}</td>
                  <td>{iv.tanggal}<br /><small>{iv.waktu.slice(0,5)} WIB</small></td>
                  <td>{iv.status}</td>
                  <td>
                    {iv.penilaian
                      ? <span className="badge-nilai">{iv.penilaian.nilai} / 100</span>
                      : <span className="badge-belum">Belum dinilai</span>
                    }
                  </td>
                  <td>
                    <button className="btn-nilai" onClick={() => openModal(iv)}>
                      {iv.penilaian ? 'Ubah Nilai' : 'Beri Nilai'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Penilaian */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3>{modal.existingNilai !== null ? 'Ubah Penilaian' : 'Beri Penilaian'}</h3>
            <p className="modal-subtitle">Interview #{modal.interviewId} — Peserta #{modal.pesertaId}</p>
            <form onSubmit={handleSubmitPenilaian}>
              <div className="form-group">
                <label>Nilai (0 – 100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="contoh: 85"
                  value={formNilai}
                  onChange={e => setFormNilai(e.target.value)}
                  required
                  autoFocus
                />
                <p className="nilai-hint">Masukkan nilai antara 0 sampai 100.</p>
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
                <button type="button" className="btn-secondary" onClick={closeModal}>Batal</button>
                <button type="submit" className="btn-primary">Simpan Penilaian</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
