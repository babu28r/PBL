import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Checklist.css';

const ChecklistForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    status: 'draft'
  });

  const [items, setItems] = useState([
    { item_text: '', requirement: '', assignee_id: '', due_date: '' }
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchChecklistData();
    }
  }, [id]);

  const fetchChecklistData = async () => {
    try {
      const [checklistRes, itemsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/checklists/${id}`),
        axios.get(`http://localhost:5000/api/checklists/${id}/items`)
      ]);
      setFormData(checklistRes.data);
      if (itemsRes.data.length > 0) {
        setItems(itemsRes.data.map(item => ({
          item_text: item.item_text,
          requirement: item.requirement,
          assignee_id: item.assignee_id || '',
          due_date: item.due_date ? item.due_date.split('T')[0] : ''
        })));
      }
    } catch (error) {
      toast.error('Failed to fetch checklist data');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [name]: value
    };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { item_text: '', requirement: '', assignee_id: '', due_date: '' }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/checklists/${id}`, formData);
        toast.success('Checklist updated successfully');
      } else {
        const response = await axios.post('http://localhost:5000/api/checklists', formData);
        const checklistId = response.data.id;
        
        // Add items
        for (const item of items) {
          if (item.item_text.trim()) {
            await axios.post(`http://localhost:5000/api/checklists/${checklistId}/items`, item);
          }
        }
        
        toast.success('Checklist created successfully');
        navigate(`/checklists/${checklistId}`);
        return;
      }
      navigate('/checklists');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Security', 'Privacy', 'Quality', 'Safety', 'Financial', 'Legal', 'Other'];
  const statuses = ['draft', 'active', 'completed', 'archived'];

  return (
    <div className="checklist-form">
      <div className="page-header">
        <h2>{isEditMode ? 'Edit Checklist' : 'Create New Checklist'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleFormChange}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleFormChange}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleFormChange}
            />
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Checklist Items</h3>
            <button type="button" onClick={addItem} className="btn btn-sm btn-primary">
              Add Item
            </button>
          </div>
          
          {items.map((item, index) => (
            <div key={index} className="item-form">
              <div className="item-header">
                <h4>Item {index + 1}</h4>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="btn btn-sm btn-danger"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Item Text *</label>
                  <input
                    type="text"
                    name="item_text"
                    className="form-control"
                    value={item.item_text}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Requirement</label>
                  <input
                    type="text"
                    name="requirement"
                    className="form-control"
                    value={item.requirement}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    name="due_date"
                    className="form-control"
                    value={item.due_date}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Checklist' : 'Create Checklist'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChecklistForm;