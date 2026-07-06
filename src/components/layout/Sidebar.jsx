import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const userLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/products',  label: 'Products',  icon: '🛒' },
];

const adminLinks = [
  { to: '/admin',          label: 'Overview',  icon: '📊' },
  { to: '/admin/products', label: 'Products',  icon: '📦' },
  { to: '/admin/users',    label: 'Users',     icon: '👥' },
];

export default function Sidebar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🥛</span>
        <span className="sidebar-logo-text">DairyApp</span>
      </div>

      {/* Nav Links */}
      <nav className="sidebar-nav">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin' || to === '/dashboard'}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-link-icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.role}</div>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout} id="logout-btn">
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
