import { useState, useEffect } from 'react';
import './DivisiPage.css';

interface Divisi {
  id: number;
  nama: string;
  deskripsi: string;
  kuota: number;
}

const emptyForm = { nama: '', deskripsi: '', kuota: '' };

interface DivisiPageProps {
  onViewDetail?: (id: number) => void;
}

export const DivisiPage = ({ onViewDetail }: DivisiPageProps) => {
  const [divisis, setDivisis] = useState<Divisi[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API = 'http://localhost:8000/api/divisi';

  const fetchDivisi = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const json = await res.json();
      setDivisis(json.data);
    } catch {
      setError('Gagal memuat data divisi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDivisi(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API}/${editId}` : API;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...form, kuota: Number(form.kuota) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? 'Terjadi kesalahan.');
      setSuccess(json.message);
      setForm(emptyForm);
      setEditId(null);
      fetchDivisi();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    }
  };

  const handleEdit = (divisi: Divisi) => {
    setEditId(divisi.id);
    setForm({ nama: divisi.nama, deskripsi: divisi.deskripsi, kuota: String(divisi.kuota) });
    setSuccess('');
    setError('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus divisi ini?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE', headers: { 'Accept': 'application/json' } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? 'Gagal menghapus.');
      setSuccess(json.message);
      fetchDivisi();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm(emptyForm);
    setError('');
    setSuccess('');
  };

  return (
    <div className="page-layout">
      <h1 className="page-title">Kelola Divisi</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="page-grid">
        {/* Form */}
        <div className="form-card">
          <h3>{editId ? 'Edit Divisi' : 'Tambah Divisi Baru'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nama Divisi</label>
              <input
                type="text"
                placeholder="contoh: Divisi IT"
                value={form.nama}
                onChange={e => setForm({ ...form, nama: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Deskripsi</label>
              <textarea
                rows={3}
                placeholder="Deskripsikan tugas divisi ini..."
                value={form.deskripsi}
                onChange={e => setForm({ ...form, deskripsi: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Kuota</label>
              <input
                type="number"
                min={1}
                placeholder="contoh: 10"
                value={form.kuota}
                onChange={e => setForm({ ...form, kuota: e.target.value })}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editId ? 'Simpan Perubahan' : 'Tambah Divisi'}
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
          <h3>Daftar Divisi</h3>
          {loading ? (
            <p className="loading-text">Memuat data...</p>
          ) : divisis.length === 0 ? (
            <p className="empty-text">Belum ada divisi. Tambahkan yang pertama!</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Deskripsi</th>
                  <th>Kuota</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {divisis.map(divisi => (
                  <tr key={divisi.id}>
                    <td><span className="badge-nama">{divisi.nama}</span></td>
                    <td className="td-deskripsi">{divisi.deskripsi}</td>
                    <td><span className="badge-kuota">{divisi.kuota} orang</span></td>
                    <td>
                      <div className="action-buttons">
                        {onViewDetail && (
                          <button className="btn-edit" style={{ background: '#f0fdf4', color: '#16a34a' }} onClick={() => onViewDetail(divisi.id)}>Detail</button>
                        )}
                        <button className="btn-edit" onClick={() => handleEdit(divisi)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(divisi.id)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
