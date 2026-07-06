import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../api/userApi';
import { formatCurrency } from '../../utils/formatters';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'user' };

export default function UsersPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [delTarget, setDelTarget] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(null);
  const [msg, setMsg] = useState('');

  // Create user modal
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErr, setFormErr] = useState({});
  const [creating, setCreating] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    userApi.getAll()
      .then(r => setUsers(r.data.users || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(fetchUsers, []);

  const handleDelete = async () => {
    if (!delTarget) return;
    setDelLoading(true);
    try {
      await userApi.delete(delTarget.id);
      setUsers(prev => prev.filter(u => u.id !== delTarget.id));
      setDelTarget(null);
      showMsg('✅ User deleted');
    } catch (err) {
      showMsg('❌ ' + (err.response?.data?.detail || 'Delete failed'));
    } finally {
      setDelLoading(false);
    }
  };

  const handleToggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    setRoleLoading(u.id);
    try {
      await userApi.updateRole(u.id, newRole);
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: newRole } : x));
      showMsg(`✅ Role updated to ${newRole}`);
    } catch (err) {
      showMsg('❌ ' + (err.response?.data?.detail || 'Role update failed'));
    } finally {
      setRoleLoading(null);
    }
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setFormErr(er => ({ ...er, [e.target.name]: '' }));
  };

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) { setFormErr(errs); return; }
    setCreating(true);
    try {
      const res = await userApi.createUser({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setUsers(prev => [...prev, res.data.user]);
      setShowCreate(false);
      setForm(EMPTY_FORM);
      showMsg('✅ User created');
    } catch (err) {
      setFormErr({ email: err.response?.data?.detail || 'Creation failed' });
    } finally {
      setCreating(false);
    }
  };

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const filtered = users.filter(u =>
    !search ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>👥 Users</h1>
          <p>{users.length} total users</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            id="user-search"
            className="form-input"
            placeholder="🔍 Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 240 }}
          />
          <Button id="create-user-btn" variant="primary" onClick={() => { setForm(EMPTY_FORM); setFormErr({}); setShowCreate(true); }}>
            + Create User
          </Button>
        </div>
      </div>

      {msg && (
        <div style={{
          marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
          background: msg.startsWith('✅') ? 'rgba(6,214,160,0.1)' : 'rgba(255,77,109,0.1)',
          color: msg.startsWith('✅') ? 'var(--color-success)' : 'var(--color-danger)',
          border: `1px solid ${msg.startsWith('✅') ? 'rgba(6,214,160,0.25)' : 'rgba(255,77,109,0.25)'}`,
          fontSize: '0.87rem',
        }}>
          {msg}
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th><th>Email</th><th>Role</th><th>Wallet</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.85rem', color: '#fff', flexShrink: 0
                      }}>
                        {u.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {u.name} {u.id === me?.id && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(you)</span>}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                  <td><Badge role={u.role} /></td>
                  <td style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{formatCurrency(u.wallet_balance)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button
                        id={`toggle-role-${u.id}`}
                        variant="ghost"
                        size="sm"
                        loading={roleLoading === u.id}
                        disabled={u.id === me?.id}
                        onClick={() => handleToggleRole(u)}
                      >
                        {u.role === 'admin' ? '⬇ Make User' : '⬆ Make Admin'}
                      </Button>
                      <Button
                        id={`delete-user-${u.id}`}
                        variant="danger"
                        size="sm"
                        disabled={u.id === me?.id}
                        onClick={() => setDelTarget(u)}
                      >
                        🗑
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreate && (
        <Modal title="➕ Create User" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input id="new-user-name" label="Full Name" name="name" value={form.name} onChange={handleChange} error={formErr.name} placeholder="John Doe" required />
            <Input id="new-user-email" label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={formErr.email} placeholder="john@example.com" required />
            <Input id="new-user-password" label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={formErr.password} placeholder="Min 6 characters" required />
            <div className="form-group">
              <label className="form-label" htmlFor="new-user-role">Role</label>
              <select
                id="new-user-role"
                name="role"
                className="form-input"
                value={form.role}
                onChange={handleChange}
              >
                <option value="user">👤 User</option>
                <option value="admin">🛡️ Admin</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
              <Button variant="ghost" fullWidth type="button" onClick={() => setShowCreate(false)} id="cancel-create-user-btn">Cancel</Button>
              <Button variant="primary" fullWidth type="submit" loading={creating} id="submit-create-user-btn">Create User</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {delTarget && (
        <Modal title="⚠ Delete User" onClose={() => setDelTarget(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p>Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{delTarget.name}</strong>? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="ghost" fullWidth onClick={() => setDelTarget(null)} id="cancel-delete-user-btn">Cancel</Button>
              <Button variant="danger" fullWidth loading={delLoading} onClick={handleDelete} id="confirm-delete-user-btn">Delete</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
