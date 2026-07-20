import { useEffect, useState } from 'react';
import { apiFetch, apiPost } from '../api';

interface Role {
  id: number;
  name: string;
  slug: string;
  guard_name: string;
  permissions: Permission[];
  created_at: string;
}

interface Permission {
  id: number;
  name: string;
  slug: string;
}

interface RolesResponse {
  success: boolean;
  data: Role[];
}

interface PermissionsResponse {
  success: boolean;
  data: Permission[];
}

interface RoleResponse {
  success: boolean;
  data: Role;
}

export function AdminRoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showPermModal, setShowPermModal] = useState(false);
  const [permRole, setPermRole] = useState<Role | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<number[]>([]);
  const [formName, setFormName] = useState('');
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const [rolesRes, permsRes] = await Promise.all([
      apiFetch<RolesResponse>('/api/roles'),
      apiFetch<PermissionsResponse>('/api/permissions'),
    ]);
    if (rolesRes.data) setRoles(rolesRes.data.data);
    if (permsRes.data) setPermissions(permsRes.data.data);
    if (rolesRes.error) setError(rolesRes.error.message);
    setLoading(false);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleCreate = async () => {
    if (!formName.trim()) return;
    const res = await apiPost<RoleResponse>('/api/roles', { name: formName, guard_name: 'web' });
    if (res.data) {
      showSuccess('Role berhasil dibuat');
      setFormName('');
      setShowCreateModal(false);
      fetchData();
    } else if (res.error) {
      setError(res.error.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingRole || !formName.trim()) return;
    const res = await apiFetch<RoleResponse>(`/api/roles/${editingRole.id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: formName }),
    });
    if (res.data) {
      showSuccess('Role berhasil diupdate');
      setFormName('');
      setEditingRole(null);
      fetchData();
    } else if (res.error) {
      setError(res.error.message);
    }
  };

  const handleDelete = async (role: Role) => {
    if (!window.confirm(`Yakin ingin menghapus role "${role.name}"?`)) return;
    const res = await apiFetch<{ success: boolean }>(`/api/roles/${role.id}`, {
      method: 'DELETE',
    });
    if (res.data) {
      showSuccess('Role berhasil dihapus');
      fetchData();
    } else if (res.error) {
      setError(res.error.message);
    }
  };

  const handleAssignPermissions = async () => {
    if (!permRole) return;
    const res = await apiPost<{ success: boolean }>(`/api/roles/${permRole.id}/permissions`, {
      permission_ids: selectedPerms,
    });
    if (res.data) {
      showSuccess('Permission berhasil di-assign');
      setShowPermModal(false);
      setPermRole(null);
      setSelectedPerms([]);
      fetchData();
    } else if (res.error) {
      setError(res.error.message);
    }
  };

  const openPermModal = (role: Role) => {
    setPermRole(role);
    setSelectedPerms(role.permissions.map((p) => p.id));
    setShowPermModal(true);
  };

  const togglePermission = (permId: number) => {
    setSelectedPerms((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  if (loading) {
    return <div className="admin-db-loading">Memuat role...</div>;
  }

  return (
    <div className="admin-rm">
      {error && <div style={{ color: '#ef4444', marginBottom: 12, fontSize: '0.875rem' }}>{error}</div>}
      {successMsg && <div style={{ color: '#22c55e', marginBottom: 12, fontSize: '0.875rem' }}>{successMsg}</div>}

      <div className="admin-rm-header">
        <h2 className="admin-rm-title">Daftar Role</h2>
        <button className="admin-rm-add-btn" onClick={() => { setFormName(''); setEditingRole(null); setShowCreateModal(true); }}>
          + Buat Role
        </button>
      </div>

      <table className="admin-rm-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Slug</th>
            <th>Permissions</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {roles.length === 0 && (
            <tr>
              <td colSpan={4} className="admin-rm-empty">Belum ada role</td>
            </tr>
          )}
          {roles.map((role) => (
            <>
              <tr key={role.id} onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)} style={{ cursor: 'pointer' }}>
                <td>
                  <span className="admin-rm-role-name">{role.name}</span>
                </td>
                <td>
                  <span className="admin-rm-role-slug">{role.slug}</span>
                </td>
                <td>
                  <span className="admin-rm-badge">{role.permissions.length}</span>
                </td>
                <td>
                  <div className="admin-rm-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="admin-rm-action-btn admin-rm-action-btn--edit" onClick={() => { setFormName(role.name); setEditingRole(role); setShowCreateModal(true); }}>
                      Edit
                    </button>
                    <button className="admin-rm-action-btn admin-rm-action-btn--perm" onClick={() => openPermModal(role)}>
                      Permissions
                    </button>
                    <button className="admin-rm-action-btn admin-rm-action-btn--delete" onClick={() => handleDelete(role)}>
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
              {expandedRole === role.id && (
                <tr key={`${role.id}-perms`}>
                  <td colSpan={4} style={{ padding: '8px 14px 16px', background: '#0f172a' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 8 }}>Permissions:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {role.permissions.length === 0 && <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Tidak ada permission</span>}
                      {role.permissions.map((p) => (
                        <span key={p.id} className="admin-rm-badge" style={{ background: '#1e293b', color: '#93c5fd' }}>{p.name}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>

      {showCreateModal && (
        <div className="admin-rm-overlay" onClick={() => { setShowCreateModal(false); setEditingRole(null); }}>
          <div className="admin-rm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-rm-modal-title">{editingRole ? 'Edit Role' : 'Buat Role Baru'}</h3>
            <div className="admin-rm-form-group">
              <label className="admin-rm-form-label">Nama Role</label>
              <input
                className="admin-rm-form-input"
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Masukkan nama role"
              />
            </div>
            <div className="admin-rm-modal-actions">
              <button className="admin-rm-btn-secondary" onClick={() => { setShowCreateModal(false); setEditingRole(null); }}>
                Batal
              </button>
              <button className="admin-rm-btn-primary" onClick={editingRole ? handleUpdate : handleCreate}>
                {editingRole ? 'Simpan' : 'Buat'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPermModal && permRole && (
        <div className="admin-rm-overlay" onClick={() => { setShowPermModal(false); setPermRole(null); }}>
          <div className="admin-rm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-rm-modal-title">Assign Permissions — {permRole.name}</h3>
            <div className="admin-rm-perm-grid">
              {permissions.map((perm) => (
                <label key={perm.id} className="admin-rm-perm-item">
                  <input
                    type="checkbox"
                    checked={selectedPerms.includes(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                  />
                  {perm.name}
                </label>
              ))}
            </div>
            <div className="admin-rm-modal-actions">
              <button className="admin-rm-btn-secondary" onClick={() => { setShowPermModal(false); setPermRole(null); }}>
                Batal
              </button>
              <button className="admin-rm-btn-primary" onClick={handleAssignPermissions}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
