import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ChecklistForm.css';

const ChecklistForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: isEditMode ? 'GDPR Compliance Checklist' : '',
    description: isEditMode ? 'General Data Protection Regulation compliance checklist' : '',
    category: isEditMode ? 'Privacy' : '',
    status: isEditMode ? 'active' : 'draft'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(isEditMode ? 'Checklist updated!' : 'Checklist created!');
    navigate('/checklists');
  };

  return (
    <div className="checklist-form-page">
      <div className="page-header">
        <h1>{isEditMode ? 'Edit Checklist' : 'Create New Checklist'}</h1>
        <Link to="/checklists" className="btn-outline">Cancel</Link>
      </div>
      
      <form className="checklist-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Checklist Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter checklist title"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter checklist description"
            rows="3"
          ></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select Category</option>
              <option value="Security">Security</option>
              <option value="Privacy">Privacy</option>
              <option value="Financial">Financial</option>
              <option value="Legal">Legal</option>
              <option value="Quality">Quality</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
        
        <h3>Checklist Items</h3>
        <div className="checklist-items-form">
          <div className="item-row">
            <input type="text" placeholder="Item description" defaultValue="Appoint Data Protection Officer" />
            <select defaultValue="completed">
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <input type="date" defaultValue="2024-01-30" />
            <button type="button" className="btn-remove">×</button>
          </div>
          
          <div className="item-row">
            <input type="text" placeholder="Item description" defaultValue="Update Privacy Policy" />
            <select defaultValue="completed">
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <input type="date" defaultValue="2024-01-30" />
            <button type="button" className="btn-remove">×</button>
          </div>
          
          <button type="button" className="btn-add-item">
            + Add New Item
          </button>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {isEditMode ? 'Update Checklist' : 'Create Checklist'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChecklistForm;