import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiCheckCircle, FiClock, FiAlertCircle, FiPaperclip } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Checklist.css';

const ChecklistDetail = () => {
  const { id } = useParams();
  const [checklist, setChecklist] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChecklistDetails();
  }, [id]);

  const fetchChecklistDetails = async () => {
    try {
      const [checklistRes, itemsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/checklists/${id}`),
        axios.get(`http://localhost:5000/api/checklists/${id}/items`)
      ]);
      setChecklist(checklistRes.data);
      setItems(itemsRes.data);
    } catch (error) {
      toast.error('Failed to fetch checklist details');
    } finally {
      setLoading(false);
    }
  };

  const updateItemStatus = async (itemId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/items/${itemId}`, {
        status,
        completed_date: status === 'completed' ? new Date().toISOString() : null
      });
      toast.success('Item updated successfully');
      fetchChecklistDetails();
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  const addComment = async (itemId, comment) => {
    try {
      await axios.put(`http://localhost:5000/api/items/${itemId}`, {
        comments: comment
      });
      toast.success('Comment added');
      fetchChecklistDetails();
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return <div className="loading">Loading checklist...</div>;
  }

  if (!checklist) {
    return <div className="error">Checklist not found</div>;
  }

  const completedItems = items.filter(item => item.status === 'completed').length;
  const progress = items.length > 0 ? Math.round((completedItems / items.length) * 100) : 0;

  return (
    <div className="checklist-detail">
      <div className="page-header">
        <div>
          <h2>{checklist.title}</h2>
          <p className="text-muted">{checklist.description}</p>
        </div>
        <div className="header-actions">
          <Link to={`/checklists/${id}/edit`} className="btn btn-primary">
            Edit Checklist
          </Link>
          <Link to="/checklists" className="btn btn-outline">
            Back to List
          </Link>
        </div>
      </div>

      <div className="checklist-info card mb-3">
        <div className="info-grid">
          <div>
            <label>Category</label>
            <p>{checklist.category}</p>
          </div>
          <div>
            <label>Status</label>
            <span className={`status-badge status-${checklist.status}`}>
              {checklist.status}
            </span>
          </div>
          <div>
            <label>Created</label>
            <p>{new Date(checklist.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <label>Last Updated</label>
            <p>{new Date(checklist.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="progress-section card mb-3">
        <h4>Progress: {progress}%</h4>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-stats">
          <span><FiCheckCircle /> {completedItems} Completed</span>
          <span><FiClock /> {items.length - completedItems} Pending</span>
          <span><FiAlertCircle /> {items.filter(i => i.due_date && new Date(i.due_date) < new Date() && i.status !== 'completed').length} Overdue</span>
        </div>
      </div>

      <div className="checklist-items">
        <div className="card">
          <div className="card-header">
            <h3>Checklist Items</h3>
            <Link to={`/checklists/${id}/edit`} className="btn btn-sm btn-primary">
              Add Item
            </Link>
          </div>
          
          <div className="items-table">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Item</th>
                  <th>Requirement</th>
                  <th>Assignee</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className={`item-row status-${item.status}`}>
                    <td>
                      <select 
                        value={item.status}
                        onChange={(e) => updateItemStatus(item.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <strong>{item.item_text}</strong>
                      {item.comments && (
                        <div className="item-comment">
                          <small>{item.comments}</small>
                        </div>
                      )}
                    </td>
                    <td>{item.requirement}</td>
                    <td>{item.assignee_name || 'Unassigned'}</td>
                    <td>
                      {item.due_date ? new Date(item.due_date).toLocaleDateString() : 'No due date'}
                      {item.due_date && new Date(item.due_date) < new Date() && item.status !== 'completed' && (
                        <span className="overdue-badge">Overdue</span>
                      )}
                    </td>
                    <td>
                      <div className="item-actions">
                        <button 
                          className="btn-icon"
                          onClick={() => {
                            const comment = prompt('Add a comment:');
                            if (comment) addComment(item.id, comment);
                          }}
                          title="Add comment"
                        >
                          <FiPaperclip />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistDetail;