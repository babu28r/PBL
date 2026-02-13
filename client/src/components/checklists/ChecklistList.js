import React from 'react';
import { Link } from 'react-router-dom';
import './ChecklistList.css';

const ChecklistList = () => {
  return (
    <div className="checklist-list-page">
      <div className="page-header">
        <h1>✅ Checklists</h1>
        <Link to="/checklists/new" className="btn-primary">
          + Create New Checklist
        </Link>
      </div>
      
      <div className="checklist-filters">
        <input type="text" placeholder="Search checklists..." />
        <select>
          <option>All Categories</option>
          <option>Security</option>
          <option>Privacy</option>
          <option>Financial</option>
        </select>
        <select>
          <option>All Status</option>
          <option>Active</option>
          <option>Completed</option>
          <option>Draft</option>
        </select>
      </div>
      
      <div className="checklist-cards">
        <div className="checklist-card">
          <div className="checklist-card-header">
            <h3>GDPR Compliance</h3>
            <span className="status-badge active">Active</span>
          </div>
          <p className="checklist-description">General Data Protection Regulation compliance checklist</p>
          <div className="checklist-meta">
            <span className="category">Privacy</span>
            <span className="progress">60% Complete</span>
          </div>
          <div className="checklist-actions">
            <Link to="/checklists/1" className="btn-outline">View</Link>
            <Link to="/checklists/1/edit" className="btn-outline">Edit</Link>
            <button className="btn-outline">Delete</button>
          </div>
        </div>
        
        <div className="checklist-card">
          <div className="checklist-card-header">
            <h3>ISO 27001 Audit</h3>
            <span className="status-badge completed">Completed</span>
          </div>
          <p className="checklist-description">Information security management system audit</p>
          <div className="checklist-meta">
            <span className="category">Security</span>
            <span className="progress">100% Complete</span>
          </div>
          <div className="checklist-actions">
            <Link to="/checklists/2" className="btn-outline">View</Link>
            <Link to="/checklists/2/edit" className="btn-outline">Edit</Link>
            <button className="btn-outline">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistList;