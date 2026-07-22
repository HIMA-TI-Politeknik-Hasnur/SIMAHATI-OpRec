import { useEffect, useState } from 'react';
import { getAuthToken, API_BASE_URL } from '../api';

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  email_verified_at: string | null;
  created_at: string;
}

const ROLE_LABEL: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  panitia: 'Panitia',
  interviewer: 'Interviewer',
  peserta: 'Peserta',
};

export function AdminVerifikasiEmail() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');

  const token = getAuthToken();
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, { headers });
      const json = await res.json();
      if (json.success) setUsers(json.data);
      else setError(json.message || 'Gagal memuat data');
    } catch {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleVerify = async (user: User) => {
    if (!window.confirm(`Verifikasi email untuk ${user.name} (${user.email})?`)) return;
    setVerifying(user.id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${user.id}/verify-email`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, email_verified_at: new Date().toISOString() } : u
          )
        );
      } else {
        alert(json.message || 'Gagal memverifikasi email');
      }
    } catch {
      alert('Gagal terhubung ke server');
    } finally {
      setVerifying(null);
    }
  };

  const unverifiedCount = users.filter((u) => !u.email_verified_at).length;

  const filtered =
    filter === 'all'
      ? users
      : filter === 'unverified'
        ? users.filter((u) => !u.email_verified_at)
        : users.filter((u) => u.email_verified_at);

  if (loading) {
    return <div className="admin-db-loading">Memuat data user...</div>;
  }

  if (error) {
    return <div className="admin-db-error"><p>{error}</p></div>;
  }

  return (
    <div className="ap">
      <div className="ap-header">
        <span className="ap-count">
          {users.length} user ({unverifiedCount} belum verifikasi)
        </span>
        <select
          className="ap-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Semua</option>
          <option value="unverified">Belum Verifikasi</option>
          <option value="verified">Sudah Verifikasi</option>
        </select>
      </div>

      <div className="ap-table-wrapper">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Status</th>
              <th>Role</th>
              <th>Tanggal Daftar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="ap-empty">
                  {filter === 'unverified'
                    ? 'Semua user sudah terverifikasi'
                    : filter === 'verified'
                      ? 'Belum ada user terverifikasi'
                      : 'Tidak ada data user'}
                </td>
              </tr>
            ) : (
              filtered.map((u) => {
                const verified = !!u.email_verified_at;
                return (
                  <tr key={u.id}>
                    <td><span className="ap-name">{u.name}</span></td>
                    <td>{u.email}</td>
                    <td>
                      {verified ? (
                        <span className="ap-badge ap-badge--success">Terverifikasi</span>
                      ) : (
                        <span className="ap-badge ap-badge--warning">Belum Verifikasi</span>
                      )}
                    </td>
                    <td>{u.roles.map((r) => ROLE_LABEL[r] || r).join(', ')}</td>
                    <td>{new Date(u.created_at).toLocaleDateString('id-ID')}</td>
                    <td>
                      {verified ? (
                        <span className="ap-badge ap-badge--muted">Sudah terverifikasi</span>
                      ) : (
                        <button
                          className="ap-btn ap-btn--terima"
                          disabled={verifying === u.id}
                          onClick={() => handleVerify(u)}
                        >
                          {verifying === u.id ? '...' : 'Verifikasi Email'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
