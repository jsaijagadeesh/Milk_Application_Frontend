import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatters';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>👋 Hello, {user?.name}!</h1>
        <p>Welcome to DairyApp — your fresh dairy products marketplace</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--color-accent)' }}>
            💰
          </div>
          <div className="stat-info">
            <div className="stat-value">{formatCurrency(user?.wallet_balance ?? 0)}</div>
            <div className="stat-label">Wallet Balance</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(108,99,255,0.15)', color: 'var(--color-primary)' }}>
            👤
          </div>
          <div className="stat-info">
            <div className="stat-value">{user?.role === 'admin' ? 'Admin' : 'User'}</div>
            <div className="stat-label">Account Role</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>🚀 Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn btn-primary btn-md" id="goto-products-btn">
            🛒 Browse Products
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>ℹ️ Account Info</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <div><strong style={{ color: 'var(--text-primary)' }}>Name:</strong> {user?.name}</div>
          <div><strong style={{ color: 'var(--text-primary)' }}>Email:</strong> {user?.email}</div>
          <div><strong style={{ color: 'var(--text-primary)' }}>Role:</strong> {user?.role}</div>
        </div>
      </div>
    </div>
  );
}
