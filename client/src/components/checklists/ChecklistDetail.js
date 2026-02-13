import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './ChecklistDetail.css';

const ChecklistDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="checklist-detail">
      <div className="page-header">
        <h1>GDPR Compliance Checklist</h1>
        <div className="header-actions">
          <Link to={`/checklists/${id}/edit`} className="btn-primary">Edit Checklist</Link>
          <Link to="/checklists" className="btn-outline">Back to List</Link>
        </div>
      </div>
      
      <div className="checklist-info">
        <p><strong>Description:</strong> General Data Protection Regulation compliance checklist</p>
        <p><strong>Category:</strong> Privacy</p>
        <p><strong>Status:</strong> <span className="status-badge active">Active</span></p>
        <p><strong>Progress:</strong> 60% Complete</p>
        <p><strong>Created:</strong> 2024-01-15</p>
        <p><strong>Last Updated:</strong> 2024-01-20</p>
      </div>
      
      <div className="checklist-items">
        <h3>Checklist Items</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Assignee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Appoint Data Protection Officer</td>
              <td><span className="status-badge completed">Completed</span></td>
              <td>2024-01-30</td>
              <td>John Doe</td>
              <td>
                <button className="btn-outline btn-sm">Edit</button>
              </td>
            </tr>
            <tr>
              <td>Update Privacy Policy</td>
              <td><span className="status-badge completed">Completed</span></td>
              <td>2024-01-30</td>
              <td>Jane Smith</td>
              <td>
                <button className="btn-outline btn-sm">Edit</button>
              </td>
            </tr>
            <tr>
              <td>Data Processing Agreements</td>
              <td><span className="status-badge in-progress">In Progress</span></td>
              <td>2024-02-15</td>
              <td>Bob Wilson</td>
              <td>
                <button className="btn-outline btn-sm">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChecklistDetail;