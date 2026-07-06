import { useState, useEffect } from 'react';
import { productApi } from '../../api/productApi';
import { userApi } from '../../api/userApi';
import { formatCurrency } from '../../utils/formatters';
import StatCard from '../../components/ui/StatCard';
import Loader from '../../components/common/Loader';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productApi.getAll(), userApi.getAll()])
      .then(([pr, ur]) => {
        setProducts(pr.data.products || []);
        setUsers(ur.data.users || []);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const totalWallet = users.reduce((acc, u) => acc + (u.wallet_balance || 0), 0);
  const adminCount = users.filter(u => u.role === 'admin').length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  if (loading) return <Loader />;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>📊 Admin Overview</h1>
        <p>Platform-wide statistics and insights</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Users" value={users.length} icon="👥" color="var(--color-primary)" />
        <StatCard label="Total Products" value={products.length} icon="📦" color="var(--color-accent)" />
        <StatCard label="Total Wallet" value={formatCurrency(totalWallet)} icon="💰" color="var(--color-warning)" />
        <StatCard label="Admins" value={adminCount} icon="🛡️" color="var(--color-danger)" />
        <StatCard label="Out of Stock" value={outOfStock} icon="⚠️" color="var(--color-warning)" />
      </div>

      {/* Recent Users */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.25rem' }}>👥 Recent Users</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Wallet</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map(u => (
                <tr key={u.id}>
                  <td style={{ color: 'var(--text-muted)' }}>#{u.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge badge-${u.role}`}>{u.role}</span>
                  </td>
                  <td style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                    {formatCurrency(u.wallet_balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Products */}
      <div className="card">
        <h3 style={{ marginBottom: '1.25rem' }}>📦 Recent Products</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map(p => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--text-muted)' }}>#{p.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                  <td>{p.category}</td>
                  <td style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{formatCurrency(p.price)}</td>
                  <td>
                    <span className={`badge ${p.stock === 0 ? 'badge-warning' : 'badge-success'}`}>
                      {p.stock === 0 ? 'Out' : p.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
