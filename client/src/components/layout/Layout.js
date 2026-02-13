import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="logo">
          <h2>📋 Compliance</h2>
          <p className="logo-subtitle">Checklist System</p>
        </div>
        
        <ul className="nav-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              🏠 Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/checklists" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              ✅ Checklists
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              📈 Reports
            </NavLink>
          </li>
          <li>
            <button className="nav-link" onClick={() => toast.info('Coming soon!')}>
              📋 Templates
            </button>
          </li>
          <li>
            <button className="nav-link" onClick={() => toast.info('Coming soon!')}>
              👥 Team
            </button>
          </li>
          <li>
            <button className="nav-link" onClick={() => toast.info('Coming soon!')}>
              ⚙️ Settings
            </button>
          </li>
        </ul>
        
        <div className="user-section">
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || '👤'}
            </div>
            <div className="user-details">
              <strong>{user?.username || 'Guest'}</strong>
              <small>{user?.email || 'Not logged in'}</small>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </nav>
      
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <h1>Compliance Checklist System</h1>
          </div>
          <div className="topbar-right">
            <button className="btn-notification" onClick={() => toast.info('No new notifications')}>
              🔔
            </button>
            <div className="user-menu">
              <span>👤 {user?.username || 'Guest'}</span>
            </div>
          </div>
        </header>
        
        <div className="content">
          <Outlet />
        </div>
        
        <footer className="footer">
          <p>© 2024 Compliance Checklist System v1.0 | React Frontend</p>
        </footer>
      </main>
    </div>
  );
};

export default Layout;