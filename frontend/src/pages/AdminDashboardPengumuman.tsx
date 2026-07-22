import { useEffect, useState } from 'react';
import { apiFetch, apiPost } from '../api';

interface Pengumuman {
  id: number;
  judul: string;
  isi: string;
  tipe: 'info' | 'warning' | 'success' | 'danger';
  published_at: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

interface PengumumanResponse {
  success: boolean;
  data: Pengumuman[];
}

interface SinglePengumumanResponse {
  success: boolean;
  data: Pengumuman;
}

export function AdminPengumuman() {
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Pengumuman | null>(null);
  const [formJudul, setFormJudul] = useState('');
  const [formIsi, setFormIsi] = useState('');
  const [formTipe, setFormTipe] = useState<'info' | 'warning' | 'success' | 'danger'>('info');
  const [formPublishedAt, setFormPublishedAt] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const res = await apiFetch<PengumumanResponse>('/api/pengumuman');
    if (res.data) setPengumumanList(res.data.data);
    if (res.error) setError(res.error.message);
    setLoading(false);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const openCreate = () => {
    setEditing(null);
    setFormJudul('');
    setFormIsi('');
    setFormTipe('info');
    setFormPublishedAt(new Date().toISOString().slice(0, 16));
    setShowModal(true);
  };

  const openEdit = (p: Pengumuman) => {
    setEditing(p);
    setFormJudul(p.judul);
    setFormIsi(p.isi);
    setFormTipe(p.tipe);
    setFormPublishedAt(p.published_at ? p.published_at.slice(0, 16) : '');
    setShowModal(true);
  };

  const isFutureDate = (dateStr: string) => {
    if (!dateStr) return false;
    const picked = new Date(dateStr);
    const now = new Date();
    return picked.toDateString() !== now.toDateString();
  };

  const scheduledMsg = (dateStr: string) =>
    `Pengumuman akan muncul pada ${new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`;

  const handleSave = async () => {
    if (!formJudul.trim() || !formIsi.trim()) return;
    const body = {
      judul: formJudul,
      isi: formIsi,
      tipe: formTipe,
      published_at: formPublishedAt || null,
    };

    if (editing) {
      const res = await apiFetch<SinglePengumumanResponse>(`/api/pengumuman/${editing.id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      if (res.data) {
        showSuccess(formPublishedAt && isFutureDate(formPublishedAt) ? scheduledMsg(formPublishedAt) : 'Pengumuman berhasil diupdate');
        setShowModal(false);
        fetchData();
      } else if (res.error) {
        setError(res.error.message);
      }
    } else {
      const res = await apiPost<SinglePengumumanResponse>('/api/pengumuman', body);
      if (res.data) {
        showSuccess(formPublishedAt && isFutureDate(formPublishedAt) ? scheduledMsg(formPublishedAt) : 'Pengumuman berhasil dibuat');
        setShowModal(false);
        fetchData();
      } else if (res.error) {
        setError(res.error.message);
      }
    }
  };

  const handleDelete = async (p: Pengumuman) => {
    if (!window.confirm(`Yakin ingin menghapus pengumuman "${p.judul}"?`)) return;
    const res = await apiFetch<{ success: boolean }>(`/api/pengumuman/${p.id}`, {
      method: 'DELETE',
    });
    if (res.data) {
      showSuccess('Pengumuman berhasil dihapus');
      fetchData();
    } else if (res.error) {
      setError(res.error.message);
    }
  };

  const tipeLabel: Record<string, string> = {
    info: 'Info',
    warning: 'Warning',
    success: 'Success',
    danger: 'Danger',
  };

  const tipeColor: Record<string, string> = {
    info: '#3b82f6',
    warning: '#f59e0b',
    success: '#22c55e',
    danger: '#ef4444',
  };

  if (loading) {
    return <div className="admin-db-loading">Memuat pengumuman...</div>;
  }

  return (
    <div className="admin-pm">
      {error && <div style={{ color: '#ef4444', marginBottom: 12, fontSize: '0.875rem' }}>{error}</div>}
      {successMsg && <div style={{ color: '#22c55e', marginBottom: 12, fontSize: '0.875rem' }}>{successMsg}</div>}

      <div className="admin-rm-header">
        <h2 className="admin-rm-title">Daftar Pengumuman</h2>
        <button className="admin-rm-add-btn" onClick={openCreate}>
          + Buat Pengumuman
        </button>
      </div>

      <table className="admin-rm-table">
        <thead>
          <tr>
            <th>Judul</th>
            <th>Tipe</th>
            <th>Published At</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pengumumanList.length === 0 && (
            <tr>
              <td colSpan={4} className="admin-rm-empty">Belum ada pengumuman</td>
            </tr>
          )}
          {pengumumanList.map((p) => (
            <tr key={p.id}>
              <td>
                <span className="admin-rm-role-name">{p.judul}</span>
              </td>
              <td>
                <span className="admin-rm-badge" style={{ background: tipeColor[p.tipe] + '22', color: tipeColor[p.tipe] }}>
                  {tipeLabel[p.tipe]}
                </span>
              </td>
              <td>
                <span style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>
                  {p.published_at ? new Date(p.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                </span>
              </td>
              <td>
                <div className="admin-rm-actions">
                  <button className="admin-rm-action-btn admin-rm-action-btn--edit" onClick={() => openEdit(p)}>
                    Edit
                  </button>
                  <button className="admin-rm-action-btn admin-rm-action-btn--delete" onClick={() => handleDelete(p)}>
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="admin-rm-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-rm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-rm-modal-title">{editing ? 'Edit Pengumuman' : 'Buat Pengumuman'}</h3>

            <div className="admin-rm-form-group">
              <label className="admin-rm-form-label">Judul</label>
              <input className="admin-rm-form-input" type="text" value={formJudul} onChange={(e) => setFormJudul(e.target.value)} placeholder="Judul pengumuman" />
            </div>

            <div className="admin-rm-form-group">
              <label className="admin-rm-form-label">Isi</label>
              <textarea className="admin-rm-form-input" style={{ minHeight: 100, resize: 'vertical' }} value={formIsi} onChange={(e) => setFormIsi(e.target.value)} placeholder="Isi pengumuman" />
            </div>

            <div className="admin-rm-form-group">
              <label className="admin-rm-form-label">Tipe</label>
              <select className="admin-rm-form-input" value={formTipe} onChange={(e) => setFormTipe(e.target.value as 'info' | 'warning' | 'success' | 'danger')}>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="danger">Danger</option>
              </select>
            </div>

            <div className="admin-rm-form-group">
              <label className="admin-rm-form-label">Published At</label>
              <input className="admin-rm-form-input" type="datetime-local" value={formPublishedAt} onChange={(e) => setFormPublishedAt(e.target.value)} />
            </div>

            <div className="admin-rm-modal-actions">
              <button className="admin-rm-btn-secondary" onClick={() => setShowModal(false)}>
                Batal
              </button>
              <button className="admin-rm-btn-primary" onClick={handleSave}>
                {editing ? 'Simpan' : 'Buat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
