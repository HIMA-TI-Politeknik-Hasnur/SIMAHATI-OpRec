import { useEffect, useState } from 'react';
import { getAuthToken } from '../api';

interface RoleOption {
  id: number;
  name: string;
  slug: string;
}

interface UserItem {
  id: number;
  name: string;
  email: string;
  roles: string[];
  email_verified_at: string | null;
}

const STAFF_LABEL: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  panitia: 'Panitia',
  interviewer: 'Interviewer',
  peserta: 'Peserta',
};

export function AdminTambahStaff() {
  const [mode, setMode] = useState<'create' | 'assign'>('create');

  // create mode
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [roleId, setRoleId] = useState<number | ''>('');
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // assign mode
  const [verifiedUsers, setVerifiedUsers] = useState<UserItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [assignRoleId, setAssignRoleId] = useState<number | ''>('');

  // shared
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [successDetail, setSuccessDetail] = useState<string[]>([]);

  const authHeaders = (): Record<string, string> => {
    const token = getAuthToken();
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, usersRes] = await Promise.all([
          fetch('/api/roles?per_page=50', { headers: authHeaders() }),
          fetch('/api/users', { headers: authHeaders() }),
        ]);
        const rolesJson = await rolesRes.json();
        if (rolesJson.success) {
          setRoles((rolesJson.data ?? []).filter((r: RoleOption) => r.slug !== 'peserta'));
        }
        const usersJson = await usersRes.json();
        if (usersJson.success) {
          setVerifiedUsers(
            (usersJson.data ?? []).filter((u: UserItem) => u.email_verified_at !== null)
          );
        }
      } catch {
        /* */
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchData();
  }, []);

  const selectedUser = verifiedUsers.find(u => u.id === selectedUserId);
  const roleMap = new Map(roles.map(r => [r.slug, r.id]));

  const resetAll = () => {
    setName('');
    setEmail('');
    setPassword('');
    setAutoGenerate(true);
    setRoleId('');
    setSelectedUserId('');
    setAssignRoleId('');
    setFieldErrors({});
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(null);
    setSuccessDetail([]);
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

      setSuccess('Akun staff berhasil dibuat!');
      setSuccessDetail([
        `Nama: ${json.data.name}`,
        `Email: ${json.data.email}`,
        ...(json.data.password
          ? [`Password: ${json.data.password}`, '(Simpan password ini. Tidak bisa dilihat lagi.)']
          : []),
      ]);
      resetAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !assignRoleId) return;
    setError('');
    setSuccess(null);
    setSuccessDetail([]);
    setSubmitting(true);

    try {
      const currentRoleIds = selectedUser.roles
        .map(slug => roleMap.get(slug))
        .filter((id): id is number => id !== undefined);
      const allRoleIds = [...new Set([...currentRoleIds, assignRoleId])];

      const res = await fetch(`/api/users/${selectedUser.id}/roles`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ roles: allRoleIds }),
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.message || 'Gagal assign role.');

      const newRoleName = roles.find(r => r.id === assignRoleId)?.name ?? '';
      setSuccess('Role berhasil diberikan!');
      setSuccessDetail([
        `User: ${selectedUser.name} (${selectedUser.email})`,
        `Role baru: ${newRoleName}`,
      ]);
      setSelectedUserId('');
      setAssignRoleId('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ap">
      <div className="ap-header">
        <span className="ap-count">Tambah / Assign Staff</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {success && (
        <div className="alert alert-success">
          <strong>{success}</strong>
          {successDetail.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          className={`ap-btn ${mode === 'create' ? 'ap-btn--terima' : ''}`}
          style={{ opacity: mode === 'create' ? 1 : 0.6 }}
          onClick={() => { setMode('create'); setError(''); setSuccess(null); setSuccessDetail([]); }}
        >
          Buat Baru
        </button>
        <button
          className={`ap-btn ${mode === 'assign' ? 'ap-btn--terima' : ''}`}
          style={{ opacity: mode === 'assign' ? 1 : 0.6 }}
          onClick={() => { setMode('assign'); setError(''); setSuccess(null); setSuccessDetail([]); }}
        >
          Assign ke Existing
        </button>
      </div>

      {mode === 'create' && (
        <div className="ap-table-wrapper" style={{ maxWidth: 640 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: 12, border: '1px solid #e5e7eb' }}>
            <form onSubmit={handleCreate}>
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
      )}

      {mode === 'assign' && (
        <div className="ap-table-wrapper" style={{ maxWidth: 640 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: 12, border: '1px solid #e5e7eb' }}>
            <form onSubmit={handleAssign}>
              <div className="form-group">
                <label>Pilih User Terverifikasi</label>
                <select value={selectedUserId} onChange={e => setSelectedUserId(Number(e.target.value) || '')} required disabled={submitting}>
                  <option value="">-- Pilih User --</option>
                  {verifiedUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              {selectedUser && (
                <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: '#f9fafb', borderRadius: 8, fontSize: '0.85rem' }}>
                  <div><strong>{selectedUser.name}</strong></div>
                  <div style={{ color: '#6b7280' }}>{selectedUser.email}</div>
                  <div style={{ marginTop: 4 }}>
                    Role saat ini:{' '}
                    {selectedUser.roles.length > 0
                      ? selectedUser.roles.map(r => STAFF_LABEL[r] || r).join(', ')
                      : <span style={{ color: '#9ca3af' }}>Tidak ada role</span>}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Role Staff yang Ditambahkan</label>
                <select value={assignRoleId} onChange={e => setAssignRoleId(Number(e.target.value) || '')} required disabled={submitting || loadingRoles}>
                  <option value="">-- Pilih Role --</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>

              <button className="ap-btn ap-btn--terima" type="submit" disabled={submitting || !selectedUserId || !assignRoleId} style={{ marginTop: '1rem', padding: '0.6rem 1.5rem' }}>
                {submitting ? 'Menyimpan...' : 'Assign Role'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
