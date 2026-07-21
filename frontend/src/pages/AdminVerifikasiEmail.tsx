import { useEffect, useState } from 'react';
import { getAuthToken } from '../api';

interface UnverifiedUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
  created_at: string;
}

export function AdminVerifikasiEmail() {
  const [users, setUsers] = useState<UnverifiedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState<number | null>(null);

  const token = getAuthToken();
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users/unverified', { headers });
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

  const handleVerify = async (user: UnverifiedUser) => {
    if (!window.confirm(`Verifikasi email untuk ${user.name} (${user.email})?`)) return;
    setVerifying(user.id);
    try {
      const res = await fetch(`/api/users/${user.id}/verify-email`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      } else {
        alert(json.message || 'Gagal memverifikasi email');
      }
    } catch {
      alert('Gagal terhubung ke server');
    } finally {
      setVerifying(null);
    }
  };

  if (loading) {
    return <div className="admin-db-loading">Memuat data user...</div>;
  }

  if (error) {
    return <div className="admin-db-error"><p>{error}</p></div>;
  }

  return (
    <div className="ap">
      <div className="ap-header">
        <span className="ap-count">{users.length} user belum verifikasi email</span>
      </div>

      <div className="ap-table-wrapper">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Tanggal Daftar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="ap-empty">Semua user sudah terverifikasi</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td><span className="ap-name">{u.name}</span></td>
                  <td>{u.email}</td>
                  <td>{u.roles.join(', ')}</td>
                  <td>{new Date(u.created_at).toLocaleDateString('id-ID')}</td>
                  <td>
                    <button
                      className="ap-btn ap-btn--terima"
                      disabled={verifying === u.id}
                      onClick={() => handleVerify(u)}
                    >
                      {verifying === u.id ? '...' : 'Verifikasi Email'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
