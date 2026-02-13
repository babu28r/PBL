import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <h1>Compliance Checklist System</h1>
        </div>
        <div className="navbar-user">
          {user && (
            <>
              <span>Welcome, {user.username}</span>
              <button onClick={logout} className="btn btn-danger btn-sm">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;