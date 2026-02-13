import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { mockChecklists, mockStats } from '../../utils/mockData';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState(mockStats);
  const [recentChecklists, setRecentChecklists] = useState([]);

  useEffect(() => {
    // Simulate API call
    setRecentChecklists(mockChecklists.slice(0, 5));
  }, []);

  const statCards = [
    {
      title: 'Total Checklists',
      value: stats.totalChecklists,
      color: '#3b82f6',
      icon: '📋'
    },
    {
      title: 'Completed Items',
      value: stats.completedItems,
      color: '#10b981',
      icon: '✅'
    },
    {
      title: 'Pending Items',
      value: stats.pendingItems,
      color: '#f59e0b',
      icon: '⏳'
    },
    {
      title: 'Overdue Items',
      value: stats.overdueItems,
      color: '#ef4444',
      icon: '⚠️'
    }
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Completed Checklists',
        data: [4, 7, 3, 9, 5, 8],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      },
      {
        label: 'Pending Checklists',
        data: [2, 3, 1, 4, 2, 3],
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Compliance Progress'
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p>Welcome to your compliance management dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="chart-section">
          <div className="card">
            <div className="card-header">
              <h3>Compliance Progress</h3>
            </div>
            <div className="chart-container">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="recent-section">
          <div className="card">
            <div className="card-header">
              <h3>Recent Checklists</h3>
              <Link to="/checklists" className="btn-outline btn-sm">
                View All
              </Link>
            </div>
            <div className="checklist-list">
              {recentChecklists.map(checklist => (
                <Link 
                  to={`/checklists/${checklist.id}`} 
                  key={checklist.id}
                  className="checklist-item"
                >
                  <div className="checklist-info">
                    <h4>{checklist.title}</h4>
                    <p className="checklist-category">{checklist.category}</p>
                  </div>
                  <div className="checklist-status">
                    <span className={`status-badge status-${checklist.status}`}>
                      {checklist.status}
                    </span>
                    <div className="checklist-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${checklist.progress || 0}%` }}
                        ></div>
                      </div>
                      <span>{checklist.progress || 0}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <div className="card">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <Link to="/checklists/new" className="action-btn">
              <span>📝</span>
              <span>Create New Checklist</span>
            </Link>
            <Link to="/reports" className="action-btn">
              <span>📊</span>
              <span>Generate Reports</span>
            </Link>
            <button 
              className="action-btn"
              onClick={() => toast.info('Team management coming soon!')}
            >
              <span>👥</span>
              <span>Manage Team</span>
            </button>
            <button 
              className="action-btn"
              onClick={() => toast.info('Settings coming soon!')}
            >
              <span>⚙️</span>
              <span>System Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;