import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Checklist.css';

const ChecklistList = () => {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: '',
    status: ''
  });

  useEffect(() => {
    fetchChecklists();
  }, [filter]);

  const fetchChecklists = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      if (filter.status) params.append('status', filter.status);
      
      const response = await axios.get(`http://localhost:5000/api/checklists?${params}`);
      setChecklists(response.data);
    } catch (error) {
      toast.error('Failed to fetch checklists');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this checklist?')) {
      try {
        await axios.delete(`http://localhost:5000/api/checklists/${id}`);
        toast.success('Checklist deleted successfully');
        fetchChecklists();
      } catch (error) {
        toast.error('Failed to delete checklist');
      }
    }
  };

  const categories = ['Security', 'Privacy', 'Quality', 'Safety', 'Financial', 'Legal'];
  const statuses = ['draft', 'active', 'completed', 'archived'];

  if (loading) {
    return <div className="loading">Loading checklists...</div>;
  }

  return (
    <div className="checklist-list">
      <div className="page-header">
        <h2>Checklists</h2>
        <Link to="/checklists/new" className="btn btn-primary">
          <FiPlus /> New Checklist
        </Link>
      </div>

      <div className="filters card mb-3">
        <h4>Filters</h4>
        <div className="filter-grid">
          <div className="form-group">
            <label>Category</label>
            <select 
              className="form-control"
              value={filter.category}
              onChange={(e) => setFilter({...filter, category: e.target.value})}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select 
              className="form-control"
              value={filter.status}
              onChange={(e) => setFilter({...filter, status: e.target.value})}
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <button 
              className="btn btn-secondary"
              onClick={() => setFilter({ category: '', status: '' })}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="checklists-grid">
        {checklists.map(checklist => (
          <div key={checklist.id} className="checklist-card">
            <div className="checklist-header">
              <h3>{checklist.title}</h3>
              <span className={`status-badge status-${checklist.status}`}>
                {checklist.status}
              </span>
            </div>
            <p className="checklist-description">{checklist.description}</p>
            <div className="checklist-meta">
              <span className="category-badge">{checklist.category}</span>
              <span className="date">{new Date(checklist.created_at).toLocaleDateString()}</span>
            </div>
            <div className="checklist-actions">
              <Link to={`/checklists/${checklist.id}`} className="btn btn-sm btn-outline">
                <FiEye /> View
              </Link>
              <Link to={`/checklists/${checklist.id}/edit`} className="btn btn-sm btn-outline">
                <FiEdit /> Edit
              </Link>
              <button 
                onClick={() => handleDelete(checklist.id)}
                className="btn btn-sm btn-outline btn-danger"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {checklists.length === 0 && (
        <div className="empty-state">
          <h3>No checklists found</h3>
          <p>Create your first checklist to get started!</p>
          <Link to="/checklists/new" className="btn btn-primary">
            <FiPlus /> Create Checklist
          </Link>
        </div>
      )}
    </div>
  );
};

export default ChecklistList;