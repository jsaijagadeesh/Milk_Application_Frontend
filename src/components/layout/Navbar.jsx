import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatters';

const PAGE_TITLES = {
  '/dashboard':      'Dashboard',
  '/products':       'Products',
  '/admin':          'Admin Overview',
  '/admin/products': 'Manage Products',
  '/admin/users':    'Manage Users',
};

export default function Navbar({ toastContainer }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const title = PAGE_TITLES[pathname] || 'Dairy App';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-title">{title}</h2>
      </div>
      <div className="navbar-right">
        {user?.wallet_balance != null && user.role !== 'admin' && (
          <div className="navbar-wallet">
            💰 {formatCurrency(user.wallet_balance)}
          </div>
        )}
        <div className="navbar-user">
          <div className="navbar-avatar">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <span className="navbar-username">{user?.name}</span>
        </div>
      </div>
      {toastContainer}
    </header>
  );
}
