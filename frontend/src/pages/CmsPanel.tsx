import { useEffect, useState } from 'react';
import { getAuthToken, apiFetch } from '../api';
import './CmsPanel.css';

interface CmsPanelProps {
  inline?: boolean;
}

// ── Types ──────────────────────────────────────────────────────
interface TimelineItem {
  id: number;
  judul: string;
  deskripsi?: string;
  tanggal_mulai: string;
  tanggal_selesai?: string;
  is_active: boolean;
}

interface FaqItem {
  id: number;
  pertanyaan: string;
  jawaban: string;
  is_active: boolean;
}

interface SettingItem {
  id: number;
  key: string;
  value: string;
  type: string;
}

// ── Shared helpers ─────────────────────────────────────────────
const authHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  const h: Record<string, string> = { Accept: 'application/json', 'Content-Type': 'application/json' };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
};

const showSuccess = (
  setter: React.Dispatch<React.SetStateAction<string | null>>
) => (msg: string) => {
  setter(msg);
  setTimeout(() => setter(null), 3000);
};

// ── Hook: Generic CRUD fetch ──────────────────────────────────
function useList<T>(url: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(url, { headers: authHeaders() });
      const j = await res.json();
      if (j.success) setItems(j.data ?? []);
      else setErr(j.message ?? 'Gagal memuat data');
    } catch { setErr('Gagal terhubung ke server'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  return { items, setItems, loading, err, reload: load };
}

// ── Component ──────────────────────────────────────────────────
export const CmsPanel = ({ inline }: CmsPanelProps) => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [downloading, setDownloading] = useState<'excel' | 'pdf' | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const notify = showSuccess(setSuccessMsg);

  // ── Timeline state ─────────────────────────────────────────
  const { items: timelineItems, loading: tlLoading, err: tlErr, reload: reloadTimeline } = useList<TimelineItem>('/api/timeline');
  const [tlModal, setTlModal] = useState(false);
  const [tlEdit, setTlEdit] = useState<TimelineItem | null>(null);
  const [tlForm, setTlForm] = useState({ judul: '', deskripsi: '', tanggal_mulai: '', tanggal_selesai: '', is_active: true });
  const [tlSubmitting, setTlSubmitting] = useState(false);

  const openTlCreate = () => {
    setTlEdit(null);
    setTlForm({ judul: '', deskripsi: '', tanggal_mulai: '', tanggal_selesai: '', is_active: true });
    setTlModal(true);
  };
  const openTlEdit = (item: TimelineItem) => {
    setTlEdit(item);
    setTlForm({
      judul: item.judul,
      deskripsi: item.deskripsi ?? '',
      tanggal_mulai: item.tanggal_mulai,
      tanggal_selesai: item.tanggal_selesai ?? '',
      is_active: item.is_active,
    });
    setTlModal(true);
  };
  const saveTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    setTlSubmitting(true);
    try {
      const body = { ...tlForm };
      if (!body.tanggal_selesai) delete (body as any).tanggal_selesai;
      const url = tlEdit ? `/api/timeline/${tlEdit.id}` : '/api/timeline';
      const method = tlEdit ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.message ?? 'Gagal menyimpan');
      notify(tlEdit ? 'Timeline berhasil diupdate' : 'Timeline berhasil dibuat');
      setTlModal(false);
      reloadTimeline();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally { setTlSubmitting(false); }
  };
  const deleteTimeline = async (item: TimelineItem) => {
    if (!window.confirm(`Yakin ingin menghapus "${item.judul}"?`)) return;
    try {
      const res = await fetch(`/api/timeline/${item.id}`, { method: 'DELETE', headers: authHeaders() });
      const j = await res.json();
      if (!res.ok) throw new Error(j.message ?? 'Gagal menghapus');
      notify('Timeline berhasil dihapus');
      reloadTimeline();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  // ── FAQ state ──────────────────────────────────────────────
  const { items: faqItems, loading: faqLoading, err: faqErr, reload: reloadFaq } = useList<FaqItem>('/api/faq');
  const [faqModal, setFaqModal] = useState(false);
  const [faqEdit, setFaqEdit] = useState<FaqItem | null>(null);
  const [faqForm, setFaqForm] = useState({ pertanyaan: '', jawaban: '', is_active: true });
  const [faqSubmitting, setFaqSubmitting] = useState(false);

  const openFaqCreate = () => {
    setFaqEdit(null);
    setFaqForm({ pertanyaan: '', jawaban: '', is_active: true });
    setFaqModal(true);
  };
  const openFaqEdit = (item: FaqItem) => {
    setFaqEdit(item);
    setFaqForm({ pertanyaan: item.pertanyaan, jawaban: item.jawaban, is_active: item.is_active });
    setFaqModal(true);
  };
  const saveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setFaqSubmitting(true);
    try {
      const url = faqEdit ? `/api/faq/${faqEdit.id}` : '/api/faq';
      const method = faqEdit ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(faqForm) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.message ?? 'Gagal menyimpan');
      notify(faqEdit ? 'FAQ berhasil diupdate' : 'FAQ berhasil dibuat');
      setFaqModal(false);
      reloadFaq();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally { setFaqSubmitting(false); }
  };
  const deleteFaq = async (item: FaqItem) => {
    if (!window.confirm(`Yakin ingin menghapus FAQ "${item.pertanyaan}"?`)) return;
    try {
      const res = await fetch(`/api/faq/${item.id}`, { method: 'DELETE', headers: authHeaders() });
      const j = await res.json();
      if (!res.ok) throw new Error(j.message ?? 'Gagal menghapus');
      notify('FAQ berhasil dihapus');
      reloadFaq();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  // ── Pengaturan state ───────────────────────────────────────
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});

  const loadSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await fetch('/api/settings', { headers: authHeaders() });
      const j = await res.json();
      if (j.success) {
        const list = j.data ?? [];
        setSettings(list);
        const map: Record<string, string> = {};
        list.forEach((s: SettingItem) => { map[s.key] = s.value; });
        setSettingsForm(map);
      }
    } catch { /* */ }
    finally { setSettingsLoading(false); }
  };
  useEffect(() => { loadSettings(); }, []);

  const saveSetting = async (key: string) => {
    const value = settingsForm[key] ?? '';
    setSettingsSaving(true);
    try {
      const res = await fetch(`/api/settings/${key}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ value, type: 'string' }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.message ?? 'Gagal menyimpan');
      notify('Pengaturan berhasil disimpan');
      loadSettings();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally { setSettingsSaving(false); }
  };

  // ── Laporan ────────────────────────────────────────────────
  const handleDownload = async (type: 'excel' | 'pdf') => {
    setDownloading(type);
    const token = getAuthToken();
    const url = type === 'excel' ? '/api/report/excel' : '/api/report/pdf';
    try {
      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Gagal mengunduh laporan');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = type === 'excel' ? 'laporan.xlsx' : 'laporan.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      alert('Gagal mengunduh laporan. Silakan coba lagi.');
    }
    setDownloading(null);
  };

  // ── Shared ─────────────────────────────────────────────────
  const tabs = [
    { key: 'timeline', label: 'Timeline' },
    { key: 'faq', label: 'FAQ' },
    { key: 'laporan', label: 'Laporan' },
    { key: 'pengaturan', label: 'Pengaturan' },
  ];

  // ── Renderers ──────────────────────────────────────────────
  const renderTimeline = () => {
    if (tlLoading) return <p style={{ color: '#6b7280' }}>Memuat data timeline...</p>;
    if (tlErr) return <p style={{ color: '#dc2626' }}>{tlErr}</p>;

    return (
      <div>
        <div className="ap-table-wrapper" style={{ marginBottom: '1.5rem' }}>
          <div className="ap-header" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className="ap-count">{timelineItems.length} event</span>
            <button className="ap-btn ap-btn--terima" onClick={openTlCreate}>+ Tambah Event</button>
          </div>
          <table className="ap-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Deskripsi</th>
                <th>Tanggal Mulai</th>
                <th>Tanggal Selesai</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {timelineItems.length === 0 && (
                <tr><td colSpan={6} className="ap-empty">Belum ada event timeline</td></tr>
              )}
              {timelineItems.map((item) => (
                <tr key={item.id}>
                  <td><span className="ap-name">{item.judul}</span></td>
                  <td style={{ color: '#6b7280', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.deskripsi || '—'}</td>
                  <td>{new Date(item.tanggal_mulai).toLocaleDateString('id-ID')}</td>
                  <td>{item.tanggal_selesai ? new Date(item.tanggal_selesai).toLocaleDateString('id-ID') : '—'}</td>
                  <td>{item.is_active ? <span className="ap-badge ap-badge--success">Aktif</span> : <span className="ap-badge ap-badge--muted">Nonaktif</span>}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="ap-btn ap-btn--edit" onClick={() => openTlEdit(item)}>Edit</button>
                      <button className="ap-btn ap-btn--tolak" onClick={() => deleteTimeline(item)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tlModal && (
          <div className="ap-overlay" onClick={() => setTlModal(false)}>
            <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
              <div className="ap-modal-header">
                <h3>{tlEdit ? 'Edit Event' : 'Tambah Event'} Timeline</h3>
                <button className="ap-modal-close" onClick={() => setTlModal(false)}>×</button>
              </div>
              <form onSubmit={saveTimeline}>
                <div className="ap-modal-body">
                  <div className="form-group">
                    <label>Judul Event</label>
                    <input type="text" value={tlForm.judul} onChange={e => setTlForm(p => ({ ...p, judul: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Deskripsi</label>
                    <textarea rows={2} value={tlForm.deskripsi} onChange={e => setTlForm(p => ({ ...p, deskripsi: e.target.value }))} />
                  </div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Tanggal Mulai</label>
                      <input type="date" value={tlForm.tanggal_mulai} onChange={e => setTlForm(p => ({ ...p, tanggal_mulai: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label>Tanggal Selesai</label>
                      <input type="date" value={tlForm.tanggal_selesai} onChange={e => setTlForm(p => ({ ...p, tanggal_selesai: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="ap-checkbox-label">
                      <input type="checkbox" checked={tlForm.is_active} onChange={e => setTlForm(p => ({ ...p, is_active: e.target.checked }))} />
                      Aktif (tampil di publik)
                    </label>
                  </div>
                </div>
                <div className="ap-modal-footer">
                  <button type="button" className="ap-btn" onClick={() => setTlModal(false)}>Batal</button>
                  <button type="submit" className="ap-btn ap-btn--terima" disabled={tlSubmitting}>
                    {tlSubmitting ? 'Menyimpan...' : tlEdit ? 'Simpan' : 'Buat'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFaq = () => {
    if (faqLoading) return <p style={{ color: '#6b7280' }}>Memuat data FAQ...</p>;
    if (faqErr) return <p style={{ color: '#dc2626' }}>{faqErr}</p>;

    return (
      <div>
        <div className="ap-table-wrapper" style={{ marginBottom: '1.5rem' }}>
          <div className="ap-header" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className="ap-count">{faqItems.length} FAQ</span>
            <button className="ap-btn ap-btn--terima" onClick={openFaqCreate}>+ Tambah FAQ</button>
          </div>
          <table className="ap-table">
            <thead>
              <tr>
                <th>Pertanyaan</th>
                <th>Jawaban</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {faqItems.length === 0 && (
                <tr><td colSpan={4} className="ap-empty">Belum ada FAQ</td></tr>
              )}
              {faqItems.map((item) => (
                <tr key={item.id}>
                  <td><span className="ap-name">{item.pertanyaan}</span></td>
                  <td style={{ color: '#6b7280', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.jawaban}</td>
                  <td>{item.is_active ? <span className="ap-badge ap-badge--success">Aktif</span> : <span className="ap-badge ap-badge--muted">Nonaktif</span>}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="ap-btn ap-btn--edit" onClick={() => openFaqEdit(item)}>Edit</button>
                      <button className="ap-btn ap-btn--tolak" onClick={() => deleteFaq(item)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {faqModal && (
          <div className="ap-overlay" onClick={() => setFaqModal(false)}>
            <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
              <div className="ap-modal-header">
                <h3>{faqEdit ? 'Edit FAQ' : 'Tambah FAQ'}</h3>
                <button className="ap-modal-close" onClick={() => setFaqModal(false)}>×</button>
              </div>
              <form onSubmit={saveFaq}>
                <div className="ap-modal-body">
                  <div className="form-group">
                    <label>Pertanyaan</label>
                    <input type="text" value={faqForm.pertanyaan} onChange={e => setFaqForm(p => ({ ...p, pertanyaan: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Jawaban</label>
                    <textarea rows={4} value={faqForm.jawaban} onChange={e => setFaqForm(p => ({ ...p, jawaban: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="ap-checkbox-label">
                      <input type="checkbox" checked={faqForm.is_active} onChange={e => setFaqForm(p => ({ ...p, is_active: e.target.checked }))} />
                      Aktif (tampil di publik)
                    </label>
                  </div>
                </div>
                <div className="ap-modal-footer">
                  <button type="button" className="ap-btn" onClick={() => setFaqModal(false)}>Batal</button>
                  <button type="submit" className="ap-btn ap-btn--terima" disabled={faqSubmitting}>
                    {faqSubmitting ? 'Menyimpan...' : faqEdit ? 'Simpan' : 'Buat'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPengaturan = () => {
    if (settingsLoading) return <p style={{ color: '#6b7280' }}>Memuat pengaturan...</p>;

    const settingFields = [
      { key: 'hero_subtitle', label: 'Subtitle Hero Banner', type: 'text' as const, desc: 'Teks di bawah judul utama landing page' },
      { key: 'hero_title', label: 'Judul Hero Banner', type: 'text' as const, desc: 'Judul utama di hero section landing page' },
      { key: 'hero_cta_text', label: 'Teks Tombol CTA', type: 'text' as const, desc: 'Teks pada tombol ajakan di hero section' },
      { key: 'section_title_benefit', label: 'Judul Section Benefit', type: 'text' as const, desc: 'Judul untuk section benefit / kenapa harus bergabung' },
      { key: 'section_title_timeline', label: 'Judul Section Timeline', type: 'text' as const, desc: 'Judul untuk section timeline kegiatan' },
      { key: 'section_title_pengumuman', label: 'Judul Section Pengumuman', type: 'text' as const, desc: 'Judul untuk section pengumuman di landing page' },
      { key: 'section_title_faq', label: 'Judul Section FAQ', type: 'text' as const, desc: 'Judul untuk section FAQ / pertanyaan' },
      { key: 'footer_copyright', label: 'Teks Footer Copyright', type: 'text' as const, desc: 'Teks hak cipta di bagian footer landing page' },
      { key: 'benefit_text', label: 'Teks Benefit Section', type: 'text' as const, desc: 'Deskripsi singkat di section benefit' },
      { key: 'app_name', label: 'Nama Aplikasi', type: 'text' as const, desc: 'Nama aplikasi yang tampil di navbar & footer' },
    ];

    return (
      <div className="cms-form-card" style={{ maxWidth: 640 }}>
        <h3>Pengaturan Landing Page</h3>
        {settingFields.map((field) => (
          <div key={field.key} className="form-group">
            <label>{field.label}</label>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0 0 0.5rem' }}>{field.desc}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={settingsForm[field.key] ?? ''}
                onChange={e => setSettingsForm(p => ({ ...p, [field.key]: e.target.value }))}
                placeholder={`Nilai untuk ${field.key}`}
                style={{ flex: 1 }}
              />
              <button
                className="ap-btn ap-btn--terima"
                onClick={() => saveSetting(field.key)}
                disabled={settingsSaving}
                style={{ whiteSpace: 'nowrap' }}
              >
                {settingsSaving ? '...' : 'Simpan'}
              </button>
            </div>
          </div>
        ))}
        {settings.length === 0 && (
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '1rem' }}>
            Belum ada pengaturan. Isi nilai di atas dan klik Simpan untuk membuat.
          </p>
        )}
      </div>
    );
  };

  const renderLaporan = () => (
    <div className="cms-form-card">
      <h3>Export Data Pendaftar & Pengumuman</h3>
      <p className="description-text">
        Unduh seluruh data pengumuman sistem dalam format Excel (CSV) atau format cetak halaman (PDF).
      </p>
      <div className="export-actions">
        <button onClick={() => handleDownload('excel')} disabled={downloading === 'excel'} className="btn-export excel">
          {downloading === 'excel' ? 'Mengunduh...' : 'Unduh Excel'}
        </button>
        <button onClick={() => handleDownload('pdf')} disabled={downloading === 'pdf'} className="btn-export pdf">
          {downloading === 'pdf' ? 'Mengunduh...' : 'Cetak PDF'}
        </button>
      </div>
    </div>
  );

  const content = (
    <div className="cms-content">
      {successMsg && (
        <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', border: '1px solid #bbf7d0' }}>
          {successMsg}
        </div>
      )}
      {activeTab === 'timeline' && renderTimeline()}
      {activeTab === 'faq' && renderFaq()}
      {activeTab === 'laporan' && renderLaporan()}
      {activeTab === 'pengaturan' && renderPengaturan()}
    </div>
  );

  if (inline) {
    return (
      <>
        <div className="cms-inline-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`cms-inline-tab${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {content}
      </>
    );
  }

  return (
    <div className="cms-layout">
      <aside className="cms-sidebar">
        <h2 className="cms-sidebar-title">Content Management</h2>
        <ul className="cms-nav">
          {tabs.map(tab => (
            <li key={tab.key} className={activeTab === tab.key ? 'active' : ''} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </li>
          ))}
        </ul>
      </aside>
      <main className="cms-main">
        <header className="cms-header">
          <h1>
            {activeTab === 'timeline' && 'Kelola Timeline'}
            {activeTab === 'faq' && 'Kelola FAQ'}
            {activeTab === 'laporan' && 'Unduh Laporan'}
            {activeTab === 'pengaturan' && 'Pengaturan Landing Page'}
          </h1>
        </header>
        {content}
      </main>
    </div>
  );
};
