import { useState, useEffect } from 'react';
import { getAuthToken } from '../api';
import { Calendar } from '../components/Calendar';
import './InterviewPage.css';

interface Interview {
  id: number;
  peserta_id: number;
  interviewer_id: number;
  tanggal: string;
  waktu: string;
  lokasi: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  catatan: string | null;
}

const emptyForm = {
  peserta_id: '',
  interviewer_id: '',
  tanggal: '',
  waktu: '',
  lokasi: '',
  status: 'scheduled',
  catatan: '',
};

interface InterviewPageProps {
  inline?: boolean;
}

export const InterviewPage = ({ inline }: InterviewPageProps) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  // Ambil tanggal yang sudah ada jadwal untuk ditandai di kalender
  const eventDates = interviews.map(iv => iv.tanggal);

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

  useEffect(() => { fetchInterviews(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/interview/${editId}` : '/api/interview';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify({
          ...form,
          peserta_id: Number(form.peserta_id),
          interviewer_id: Number(form.interviewer_id),
          catatan: form.catatan || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? 'Terjadi kesalahan.');
      setSuccess(json.message);
      setForm(emptyForm);
      setEditId(null);
      setShowCalendar(false);
      fetchInterviews();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    }
  };

  const handleEdit = (iv: Interview) => {
    setEditId(iv.id);
    setForm({
      peserta_id: String(iv.peserta_id),
      interviewer_id: String(iv.interviewer_id),
      tanggal: iv.tanggal,
      waktu: iv.waktu.slice(0, 5),
      lokasi: iv.lokasi,
      status: iv.status,
      catatan: iv.catatan ?? '',
    });
    setShowCalendar(false);
    setSuccess('');
    setError('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus jadwal interview ini?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/interview/${id}`, { method: 'DELETE', headers: authHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? 'Gagal menghapus.');
      setSuccess(json.message);
      fetchInterviews();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowCalendar(false);
    setError('');
    setSuccess('');
  };

  const statusLabel: Record<string, string> = {
    scheduled: 'Terjadwal',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };

  const content = (
    <>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="page-grid">
        {/* Form */}
        <div className="form-card">
          <h3>{editId ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>ID Peserta</label>
              <input
                type="number" min={1}
                placeholder="ID peserta"
                value={form.peserta_id}
                onChange={e => setForm({ ...form, peserta_id: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>ID Interviewer</label>
              <input
                type="number" min={1}
                placeholder="ID user interviewer"
                value={form.interviewer_id}
                onChange={e => setForm({ ...form, interviewer_id: e.target.value })}
                required
              />
            </div>

            {/* Tanggal pakai Calendar */}
            <div className="form-group">
              <label>Tanggal</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="date"
                  value={form.tanggal}
                  onChange={e => setForm({ ...form, tanggal: e.target.value })}
                  required
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '0.5rem 0.75rem', whiteSpace: 'nowrap' }}
                  onClick={() => setShowCalendar(v => !v)}
                >
                  📅 Kalender
                </button>
              </div>
              {showCalendar && (
                <div style={{ marginTop: '0.75rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <Calendar
                    value={form.tanggal}
                    onChange={date => { setForm({ ...form, tanggal: date }); setShowCalendar(false); }}
                    eventDates={eventDates}
                  />
                </div>
              )}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Waktu</label>
                <input
                  type="time"
                  value={form.waktu}
                  onChange={e => setForm({ ...form, waktu: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  <option value="scheduled">Terjadwal</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Lokasi / Ruangan</label>
              <input
                type="text"
                placeholder="contoh: Ruang Rapat Lt. 2"
                value={form.lokasi}
                onChange={e => setForm({ ...form, lokasi: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Catatan (opsional)</label>
              <textarea
                rows={2}
                placeholder="Catatan tambahan..."
                value={form.catatan}
                onChange={e => setForm({ ...form, catatan: e.target.value })}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editId ? 'Simpan Perubahan' : 'Tambah Jadwal'}
              </button>
              {editId && (
                <button type="button" className="btn-secondary" onClick={handleCancel}>
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabel */}
        <div className="table-card">
          <h3>Daftar Jadwal Interview</h3>
          {loading ? (
            <p className="loading-text">Memuat data...</p>
          ) : interviews.length === 0 ? (
            <p className="empty-text">Belum ada jadwal interview.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Peserta</th>
                  <th>Tanggal & Waktu</th>
                  <th>Lokasi</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map(iv => (
                  <tr key={iv.id}>
                    <td>#{iv.peserta_id}</td>
                    <td>
                      {iv.tanggal}<br />
                      <small>{iv.waktu.slice(0, 5)} WIB</small>
                    </td>
                    <td>{iv.lokasi}</td>
                    <td>
                      <span className={`badge-status ${iv.status}`}>
                        {statusLabel[iv.status]}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEdit(iv)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(iv.id)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );

  if (inline) return content;
  return <div className="page-layout"><h1 className="page-title">Penjadwalan Interview</h1>{content}</div>;
};
