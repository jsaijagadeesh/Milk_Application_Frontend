import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout({ toastContainer }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Navbar toastContainer={toastContainer} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
