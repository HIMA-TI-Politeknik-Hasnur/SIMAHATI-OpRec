import { useEffect, useState } from 'react';
import { getAuthToken, apiFetch } from '../api';

interface UploadRecord {
  id: number;
  peserta_id: number;
  jenis_dokumen: string;
  original_name: string;
  file_url?: string;
}

interface PendaftaranRecord {
  id: number;
  status: string;
  catatan_admin: string | null;
  tanggal_daftar: string | null;
}

interface Peserta {
  id: number;
  nama_lengkap: string;
  nim: string;
  program_studi: string;
  semester: number;
  angkatan: number;
  email: string;
  nomor_hp: string;
  alamat: string;
  pilihan_divisi_1: number | null;
  pilihan_divisi_2: number | null;
  status_verifikasi: string;
  status_seleksi: string;
  motivasi: string;
  kontribusi: string;
  harapan: string;
  pengalaman_organisasi: string | null;
  skill: string | null;
  prestasi: string | null;
  user: { name: string; email: string };
  pendaftaran: PendaftaranRecord | null;
  uploads: UploadRecord[];
  created_at: string;
}

interface Divisi {
  id: number;
  nama: string;
}

const VERIF_LABEL: Record<string, string> = {
  pending: 'Pending',
  verified: 'Terverifikasi',
  rejected: 'Ditolak',
};

const SELEKSI_LABEL: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Terkirim',
  interview: 'Interview',
  accepted: 'Diterima',
  rejected: 'Ditolak',
};

export function AdminPeserta() {
  const [pesertaList, setPesertaList] = useState<Peserta[]>([]);
  const [divisiList, setDivisiList] = useState<Divisi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<Peserta | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [catatan, setCatatan] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const authHeaders = (): Record<string, string> => {
      const token = getAuthToken();
      const h: Record<string, string> = { Accept: 'application/json' };
      if (token) h['Authorization'] = `Bearer ${token}`;
      return h;
    };
    try {
      const [pesertaRes, divisiRes] = await Promise.all([
        fetch('/api/peserta', { headers: authHeaders() }),
        fetch('/api/divisi', { headers: authHeaders() }),
      ]);
      const pesertaJson = await pesertaRes.json();
      const divisiJson = await divisiRes.json();
      if (pesertaJson.success) setPesertaList(pesertaJson.data);
      else setError(pesertaJson.message || 'Gagal memuat peserta');
      if (divisiJson.success) setDivisiList(divisiJson.data);
    } catch {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getDivisiName = (id: number | null): string => {
    if (!id) return '-';
    const d = divisiList.find((x) => x.id === id);
    return d ? d.nama : `Divisi #${id}`;
  };

  const handleVerifikasi = async (id: number, status: string, catat?: string) => {
    setUpdating(id);
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const body: Record<string, string> = { status_verifikasi: status };
      if (catat?.trim()) body.catatan = catat.trim();
      const res = await fetch(`/api/peserta/${id}/verifikasi`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) { setDetail(null); fetchData(); }
      else alert(json.message || 'Gagal memperbarui status');
    } catch {
      alert('Gagal terhubung ke server');
    } finally {
      setUpdating(null);
    }
  };

  const handleSeleksi = async (id: number, status: string) => {
    setUpdating(id);
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const res = await fetch(`/api/peserta/${id}/seleksi`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status_seleksi: status }),
      });
      const json = await res.json();
      if (json.success) { setDetail(null); fetchData(); }
      else alert(json.message || 'Gagal memperbarui status seleksi');
    } catch {
      alert('Gagal terhubung ke server');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (p: Peserta) => {
    if (!window.confirm(`Yakin ingin menghapus data ${p.nama_lengkap}?`)) return;
    const token = getAuthToken();
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const res = await fetch(`/api/peserta/${p.id}`, { method: 'DELETE', headers });
      const json = await res.json();
      if (json.success) fetchData();
      else alert(json.message || 'Gagal menghapus');
    } catch {
      alert('Gagal terhubung ke server');
    }
  };

  const filtered = pesertaList.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.nama_lengkap.toLowerCase().includes(q) ||
      p.nim.toLowerCase().includes(q) ||
      p.program_studi.toLowerCase().includes(q)
    );
  });

  const badgeClass = (val: string, type: 'verif' | 'seleksi') => {
    const base = 'ap-badge';
    if (type === 'verif') {
      if (val === 'verified') return `${base} ${base}--success`;
      if (val === 'rejected') return `${base} ${base}--danger`;
      return `${base} ${base}--pending`;
    }
    if (val === 'accepted') return `${base} ${base}--success`;
    if (val === 'rejected' || val === 'draft') return `${base} ${base}--danger`;
    if (val === 'interview') return `${base} ${base}--info`;
    return `${base} ${base}--pending`;
  };

  if (loading) {
    return <div className="admin-db-loading">Memuat data peserta...</div>;
  }

  if (error) {
    return <div className="admin-db-error"><p>{error}</p></div>;
  }

  return (
    <div className="ap">
      <div className="ap-header">
        <input
          className="ap-search"
          type="text"
          placeholder="Cari nama, NIM, atau prodi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="ap-count">{filtered.length} pendaftar</span>
      </div>

      <table className="ap-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>NIM</th>
            <th>Prodi</th>
            <th>Divisi 1</th>
            <th>Verifikasi</th>
            <th>Seleksi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7} className="ap-empty">Tidak ada data</td>
            </tr>
          ) : (
            filtered.map((p) => (
              <tr key={p.id}>
                <td><span className="ap-name">{p.nama_lengkap}</span></td>
                <td><span className="ap-nim">{p.nim}</span></td>
                <td>{p.program_studi}</td>
                <td>{getDivisiName(p.pilihan_divisi_1)}</td>
                <td><span className={badgeClass(p.status_verifikasi, 'verif')}>{VERIF_LABEL[p.status_verifikasi] || p.status_verifikasi}</span></td>
                <td><span className={badgeClass(p.status_seleksi, 'seleksi')}>{SELEKSI_LABEL[p.status_seleksi] || p.status_seleksi}</span></td>
                <td>
                  <div className="ap-actions">
                    <button className="ap-btn ap-btn--detail" onClick={() => { setDetail(p); setCatatan(p.pendaftaran?.catatan_admin ?? ''); }}>Detail</button>
                    {p.status_verifikasi === 'pending' && (
                      <>
                        <button className="ap-btn ap-btn--terima" disabled={updating === p.id} onClick={() => handleVerifikasi(p.id, 'verified')}>
                          {updating === p.id ? '...' : 'Terima'}
                        </button>
                        <button className="ap-btn ap-btn--tolak" disabled={updating === p.id} onClick={() => handleVerifikasi(p.id, 'rejected')}>
                          {updating === p.id ? '...' : 'Tolak'}
                        </button>
                      </>
                    )}
                    {p.status_verifikasi === 'verified' && (
                      <button className="ap-btn ap-btn--tolak" disabled={updating === p.id} onClick={() => handleVerifikasi(p.id, 'rejected')}>
                        {updating === p.id ? '...' : 'Tolak'}
                      </button>
                    )}
                    {p.status_verifikasi === 'rejected' && (
                      <button className="ap-btn ap-btn--terima" disabled={updating === p.id} onClick={() => handleVerifikasi(p.id, 'verified')}>
                        {updating === p.id ? '...' : 'Terima'}
                      </button>
                    )}
                    <button className="ap-btn ap-btn--hapus" onClick={() => handleDelete(p)}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {detail && (
        <div className="ap-overlay" onClick={() => setDetail(null)}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-header">
              <h3>{detail.nama_lengkap}</h3>
              <button className="ap-btn ap-btn--close" onClick={() => setDetail(null)}>✕</button>
            </div>
            <div className="ap-modal-body">
              <div className="ap-field"><label>NIM</label><span>{detail.nim}</span></div>
              <div className="ap-field"><label>Program Studi</label><span>{detail.program_studi}</span></div>
              <div className="ap-field"><label>Semester</label><span>{detail.semester}</span></div>
              <div className="ap-field"><label>Angkatan</label><span>{detail.angkatan}</span></div>
              <div className="ap-field"><label>Email</label><span>{detail.email}</span></div>
              <div className="ap-field"><label>No. HP</label><span>{detail.nomor_hp}</span></div>
              <div className="ap-field"><label>Alamat</label><span>{detail.alamat}</span></div>
              <div className="ap-field"><label>Pengalaman Organisasi</label><span>{detail.pengalaman_organisasi || '—'}</span></div>
              <div className="ap-field"><label>Skill</label><span>{detail.skill || '—'}</span></div>
              <div className="ap-field"><label>Prestasi</label><span>{detail.prestasi || '—'}</span></div>
              <div className="ap-field"><label>Divisi Pilihan 1</label><span>{getDivisiName(detail.pilihan_divisi_1)}</span></div>
              <div className="ap-field"><label>Divisi Pilihan 2</label><span>{getDivisiName(detail.pilihan_divisi_2)}</span></div>
              <div className="ap-field"><label>Motivasi</label><span>{detail.motivasi}</span></div>
              <div className="ap-field"><label>Kontribusi</label><span>{detail.kontribusi}</span></div>
              <div className="ap-field"><label>Harapan</label><span>{detail.harapan}</span></div>
              {detail.uploads.length > 0 && (
                <div className="ap-field">
                  <label>Dokumen</label>
                  <ul className="ap-upload-list">
                    {detail.uploads.map((u) => (
                      <li key={u.id}>
                        {u.jenis_dokumen.toUpperCase()} — {u.original_name}
                        {u.file_url && <a href={u.file_url} target="_blank" rel="noreferrer"> Lihat</a>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="ap-field"><label>Status Verifikasi</label><span className={badgeClass(detail.status_verifikasi, 'verif')}>{VERIF_LABEL[detail.status_verifikasi] || detail.status_verifikasi}</span></div>
              <div className="ap-field"><label>Status Seleksi</label><span className={badgeClass(detail.status_seleksi, 'seleksi')}>{SELEKSI_LABEL[detail.status_seleksi] || detail.status_seleksi}</span></div>

              <div className="ap-field">
                <label>Catatan Admin</label>
                {detail.pendaftaran?.catatan_admin && (
                  <div className="ap-catatan-lama">{detail.pendaftaran.catatan_admin}</div>
                )}
                <textarea
                  className="ap-catatan-input"
                  rows={3}
                  placeholder="Tulis catatan untuk peserta..."
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                />
              </div>
            </div>
            <div className="ap-modal-footer">
              {detail.status_verifikasi !== 'verified' && (
                <button
                  className="ap-btn ap-btn--terima"
                  disabled={updating === detail.id}
                  onClick={() => handleVerifikasi(detail.id, 'verified', catatan)}
                >
                  {updating === detail.id ? '...' : 'Verifikasi'}
                </button>
              )}
              {detail.status_verifikasi !== 'rejected' && (
                <button
                  className="ap-btn ap-btn--tolak"
                  disabled={updating === detail.id}
                  onClick={() => handleVerifikasi(detail.id, 'rejected', catatan)}
                >
                  {updating === detail.id ? '...' : 'Tolak'}
                </button>
              )}
            </div>

            {detail.status_verifikasi === 'verified' && (
              <div className="ap-modal-footer ap-modal-footer--seleksi">
                <span className="ap-seleksi-label">Status Seleksi:</span>
                {detail.status_seleksi !== 'interview' && (
                  <button
                    className="ap-btn ap-btn--info"
                    disabled={updating === detail.id}
                    onClick={() => handleSeleksi(detail.id, 'interview')}
                  >
                    {updating === detail.id ? '...' : 'Interview'}
                  </button>
                )}
                {detail.status_seleksi !== 'accepted' && (
                  <button
                    className="ap-btn ap-btn--terima"
                    disabled={updating === detail.id}
                    onClick={() => handleSeleksi(detail.id, 'accepted')}
                  >
                    {updating === detail.id ? '...' : 'Terima'}
                  </button>
                )}
                {detail.status_seleksi !== 'rejected' && detail.status_seleksi !== 'draft' && (
                  <button
                    className="ap-btn ap-btn--tolak"
                    disabled={updating === detail.id}
                    onClick={() => handleSeleksi(detail.id, 'rejected')}
                  >
                    {updating === detail.id ? '...' : 'Tolak'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
