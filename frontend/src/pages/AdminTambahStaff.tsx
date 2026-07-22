import { useEffect, useState } from 'react';
import { getAuthToken } from '../api';

interface RoleOption {
  id: number;
  name: string;
  slug: string;
}

export function AdminTambahStaff() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [roleId, setRoleId] = useState<number | ''>('');
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ name: string; email: string; password: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const authHeaders = (): Record<string, string> => {
    const token = getAuthToken();
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch('/api/roles?per_page=50', { headers: authHeaders() });
        const json = await res.json();
        if (json.success) {
          setRoles((json.data ?? []).filter((r: RoleOption) => r.slug !== 'peserta'));
        }
      } catch {
        /* */
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setAutoGenerate(true);
    setRoleId('');
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(null);
    setFieldErrors({});
    setSubmitting(true);

    try {
      const body: Record<string, unknown> = { name, email, role_id: roleId };
      if (!autoGenerate) body.password = password;

      const res = await fetch('/api/users/staff', {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (!res.ok) {
        if (json.errors) setFieldErrors(json.errors);
        throw new Error(json.message || 'Gagal membuat akun.');
      }

      setSuccess({
        name: json.data.name,
        email: json.data.email,
        password: json.data.password,
      });
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ap">
      <div className="ap-header">
        <span className="ap-count">Buat Akun Staff Baru</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {success && (
        <div className="alert alert-success">
          <strong>Akun berhasil dibuat!</strong><br />
          Nama: {success.name}<br />
          Email: {success.email}
          {success.password && (
            <>
              <br />
              Password: <code style={{ background: '#f3f4f6', padding: '0.15rem 0.5rem', borderRadius: 4, fontWeight: 700 }}>{success.password}</code>
              <br />
              <small style={{ color: '#6b7280' }}>Simpan password ini. Tidak bisa dilihat lagi.</small>
            </>
          )}
        </div>
      )}

      <div className="ap-table-wrapper" style={{ maxWidth: 640 }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nama lengkap" required disabled={submitting} />
              {fieldErrors.name?.map((m, i) => <span key={i} style={{ color: '#dc2626', fontSize: '0.8rem' }}>{m}</span>)}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" required disabled={submitting} />
              {fieldErrors.email?.map((m, i) => <span key={i} style={{ color: '#dc2626', fontSize: '0.8rem' }}>{m}</span>)}
            </div>

            <div className="form-group">
              <label>Role</label>
              <select value={roleId} onChange={e => setRoleId(Number(e.target.value) || '')} required disabled={submitting || loadingRoles}>
                <option value="">-- Pilih Role --</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              {fieldErrors.role_id?.map((m, i) => <span key={i} style={{ color: '#dc2626', fontSize: '0.8rem' }}>{m}</span>)}
            </div>

            <div className="form-group">
              <label>Password</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: '0.85rem', color: '#6b7280', cursor: 'pointer' }}>
                <input type="checkbox" checked={autoGenerate} onChange={e => setAutoGenerate(e.target.checked)} disabled={submitting} />
                Auto-generate password
              </label>
              {!autoGenerate && (
                <input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal 8 karakter" required disabled={submitting} />
              )}
              {fieldErrors.password?.map((m, i) => <span key={i} style={{ color: '#dc2626', fontSize: '0.8rem' }}>{m}</span>)}
            </div>

            <button className="ap-btn ap-btn--terima" type="submit" disabled={submitting} style={{ marginTop: '1rem', padding: '0.6rem 1.5rem' }}>
              {submitting ? 'Menyimpan...' : 'Buat Akun'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
