import { useEffect, useState } from 'react';
import { getAuthToken } from '../api';

interface BenefitItem {
  id: number;
  icon: string;
  title: string;
  desc: string;
  is_active: boolean;
  sort_order: number;
}

const authHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  const h: Record<string, string> = { Accept: 'application/json', 'Content-Type': 'application/json' };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
};

export const AdminDashboardBenefit = () => {
  const [items, setItems] = useState<BenefitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<BenefitItem | null>(null);
  const [form, setForm] = useState({ icon: '⭐', title: '', desc: '', is_active: true, sort_order: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const notify = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch('/api/benefit', { headers: authHeaders() });
      const j = await res.json();
      if (j.success) setItems(j.data ?? []);
      else setErr(j.message ?? 'Gagal memuat data');
    } catch { setErr('Gagal terhubung ke server'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEdit(null);
    setForm({ icon: '⭐', title: '', desc: '', is_active: true, sort_order: 0 });
    setModal(true);
  };

  const openEdit = (item: BenefitItem) => {
    setEdit(item);
    setForm({ icon: item.icon, title: item.title, desc: item.desc, is_active: item.is_active, sort_order: item.sort_order });
    setModal(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = edit ? `/api/benefit/${edit.id}` : '/api/benefit';
      const method = edit ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.message ?? 'Gagal menyimpan');
      notify(edit ? 'Benefit berhasil diupdate' : 'Benefit berhasil dibuat');
      setModal(false);
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally { setSubmitting(false); }
  };

  const remove = async (item: BenefitItem) => {
    if (!window.confirm(`Yakin ingin menghapus benefit "${item.title}"?`)) return;
    try {
      const res = await fetch(`/api/benefit/${item.id}`, { method: 'DELETE', headers: authHeaders() });
      const j = await res.json();
      if (!res.ok) throw new Error(j.message ?? 'Gagal menghapus');
      notify('Benefit berhasil dihapus');
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  const iconOptions = ['⭐', '🤝', '📈', '💡', '🚀', '🎯', '💪', '🌟', '🔥', '🎨', '📊', '🔧', '🎓', '🏆', '🌐', '💼', '🧠', '👥', '⚡', '🛠️'];

  if (loading) return <p style={{ color: '#6b7280' }}>Memuat data benefit...</p>;
  if (err) return <p style={{ color: '#dc2626' }}>{err}</p>;

  return (
    <div>
      {successMsg && (
        <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', border: '1px solid #bbf7d0' }}>
          {successMsg}
        </div>
      )}

      <div className="ap-table-wrapper" style={{ marginBottom: '1.5rem' }}>
        <div className="ap-header" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span className="ap-count">{items.length} benefit</span>
          <button className="ap-btn ap-btn--terima" onClick={openCreate}>+ Tambah Benefit</button>
        </div>
        <table className="ap-table">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Judul</th>
              <th>Deskripsi</th>
              <th>Urutan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={6} className="ap-empty">Belum ada benefit</td></tr>
            )}
            {items.map((item) => (
              <tr key={item.id}>
                <td style={{ fontSize: '1.5rem' }}>{item.icon}</td>
                <td><span className="ap-name">{item.title}</span></td>
                <td style={{ color: '#6b7280', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.desc}</td>
                <td>{item.sort_order}</td>
                <td>{item.is_active ? <span className="ap-badge ap-badge--success">Aktif</span> : <span className="ap-badge ap-badge--muted">Nonaktif</span>}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="ap-btn ap-btn--edit" onClick={() => openEdit(item)}>Edit</button>
                    <button className="ap-btn ap-btn--tolak" onClick={() => remove(item)}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="ap-overlay" onClick={() => setModal(false)}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-header">
              <h3>{edit ? 'Edit Benefit' : 'Tambah Benefit'}</h3>
              <button className="ap-modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <form onSubmit={save}>
              <div className="ap-modal-body">
                <div className="form-group">
                  <label>Icon</label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {iconOptions.map(ico => (
                      <button
                        key={ico}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, icon: ico }))}
                        style={{
                          fontSize: '1.3rem',
                          padding: '6px 10px',
                          border: form.icon === ico ? '2px solid #f97316' : '2px solid #e5e7eb',
                          borderRadius: 8,
                          cursor: 'pointer',
                          background: form.icon === ico ? '#fff7ed' : 'white',
                        }}
                      >
                        {ico}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Judul</label>
                  <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea rows={3} value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Urutan Tampil</label>
                  <input type="number" min={0} value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
                </div>
                <div className="form-group">
                  <label className="ap-checkbox-label">
                    <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} />
                    Aktif (tampil di publik)
                  </label>
                </div>
              </div>
              <div className="ap-modal-footer">
                <button type="button" className="ap-btn" onClick={() => setModal(false)}>Batal</button>
                <button type="submit" className="ap-btn ap-btn--terima" disabled={submitting}>
                  {submitting ? 'Menyimpan...' : edit ? 'Simpan' : 'Buat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
