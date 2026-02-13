import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDownload, FiFilter } from 'react-icons/fi';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import './Reports.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const [checklists, setChecklists] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    category: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [checklistsRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/checklists'),
        axios.get('http://localhost:5000/api/dashboard/stats')
      ]);
      setChecklists(checklistsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Security', 'Privacy', 'Quality', 'Safety', 'Financial', 'Legal', 'All'];
  
  const filteredChecklists = checklists.filter(checklist => {
    if (filter.category && filter.category !== 'All' && checklist.category !== filter.category) {
      return false;
    }
    
    if (filter.startDate && new Date(checklist.created_at) < new Date(filter.startDate)) {
      return false;
    }
    
    if (filter.endDate && new Date(checklist.created_at) > new Date(filter.endDate)) {
      return false;
    }
    
    return true;
  });

  const categoryData = categories.slice(0, -1).map(category => ({
    category,
    count: checklists.filter(c => c.category === category).length
  }));

  const barChartData = {
    labels: categoryData.map(d => d.category),
    datasets: [
      {
        label: 'Checklists by Category',
        data: categoryData.map(d => d.count),
        backgroundColor: [
          '#007bff',
          '#28a745',
          '#ffc107',
          '#dc3545',
          '#17a2b8',
          '#6f42c1'
        ]
      }
    ]
  };

  const statusData = {
    draft: checklists.filter(c => c.status === 'draft').length,
    active: checklists.filter(c => c.status === 'active').length,
    completed: checklists.filter(c => c.status === 'completed').length,
    archived: checklists.filter(c => c.status === 'archived').length
  };

  const pieChartData = {
    labels: ['Draft', 'Active', 'Completed', 'Archived'],
    datasets: [
      {
        data: Object.values(statusData),
        backgroundColor: [
          '#6c757d',
          '#007bff',
          '#28a745',
          '#17a2b8'
        ]
      }
    ]
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Category', 'Status', 'Created Date', 'Items Completed', 'Total Items'];
    const csvContent = [
      headers.join(','),
      ...filteredChecklists.map(checklist => [
        `"${checklist.title}"`,
        checklist.category,
        checklist.status,
        new Date(checklist.created_at).toLocaleDateString(),
        stats.completedItems || 0,
        (stats.completedItems || 0) + (stats.pendingItems || 0)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compliance-report.csv';
    a.click();
  };

  if (loading) {
    return <div className="loading">Loading reports...</div>;
  }

  return (
    <div className="reports">
      <div className="page-header">
        <h2>Compliance Reports</h2>
        <button onClick={exportToCSV} className="btn btn-primary">
          <FiDownload /> Export CSV
        </button>
      </div>

      <div className="filters card mb-3">
        <h4><FiFilter /> Filter Reports</h4>
        <div className="filter-grid">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              className="form-control"
              value={filter.startDate}
              onChange={(e) => setFilter({...filter, startDate: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              className="form-control"
              value={filter.endDate}
              onChange={(e) => setFilter({...filter, endDate: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              className="form-control"
              value={filter.category}
              onChange={(e) => setFilter({...filter, category: e.target.value})}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <button
              className="btn btn-secondary"
              onClick={() => setFilter({ startDate: '', endDate: '', category: '' })}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="summary-stats">
        <div className="stat-summary">
          <h3>Total Checklists: {filteredChecklists.length}</h3>
          <p>Showing data from {filter.startDate || 'all time'} to {filter.endDate || 'present'}</p>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-container card">
          <h4>Checklists by Category</h4>
          <div className="chart-wrapper">
            <Bar data={barChartData} options={{ responsive: true }} />
          </div>
        </div>
        
        <div className="chart-container card">
          <h4>Status Distribution</h4>
          <div className="chart-wrapper">
            <Pie data={pieChartData} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      <div className="reports-table card">
        <h4>Detailed Report</h4>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Last Updated</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {filteredChecklists.map(checklist => (
                <tr key={checklist.id}>
                  <td>{checklist.title}</td>
                  <td>
                    <span className="category-badge">{checklist.category}</span>
                  </td>
                  <td>
                    <span className={`status-badge status-${checklist.status}`}>
                      {checklist.status}
                    </span>
                  </td>
                  <td>{new Date(checklist.created_at).toLocaleDateString()}</td>
                  <td>{new Date(checklist.updated_at).toLocaleDateString()}</td>
                  <td>
                    <div className="progress-mini">
                      <div className="progress-fill" style={{ width: '75%' }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredChecklists.length === 0 && (
          <div className="empty-table">
            <p>No data found for the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;