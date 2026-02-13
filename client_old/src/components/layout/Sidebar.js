import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiCheckSquare, 
  FiFileText, 
  FiBarChart2,
  FiPlusCircle 
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/', icon: <FiHome />, label: 'Dashboard' },
    { path: '/checklists', icon: <FiCheckSquare />, label: 'Checklists' },
    { path: '/checklists/new', icon: <FiPlusCircle />, label: 'New Checklist' },
    { path: '/reports', icon: <FiBarChart2 />, label: 'Reports' },
  ];

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;