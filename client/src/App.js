import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Enhanced Dashboard Component
const Dashboard = () => {
  const [stats] = useState({
    totalChecklists: 12,
    completedItems: 48,
    pendingItems: 15,
    overdueItems: 3,
    complianceRate: 78
  });

  const recentChecklists = [
    { id: 1, name: 'GDPR Compliance', category: 'Privacy', status: 'active', progress: 60 },
    { id: 2, name: 'ISO 27001 Audit', category: 'Security', status: 'completed', progress: 100 },
    { id: 3, name: 'PCI DSS', category: 'Financial', status: 'pending', progress: 30 },
    { id: 4, name: 'HIPAA Checklist', category: 'Privacy', status: 'active', progress: 75 },
    { id: 5, name: 'SOC 2 Type II', category: 'Security', status: 'active', progress: 40 }
  ];

  // Bar Chart Data
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Completed Checklists',
        data: [3, 5, 2, 6, 4, 7],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
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

  // Pie Chart Data
  const pieChartData = {
    labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [48, 22, 15, 3],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p>Welcome to Compliance Checklist System</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.totalChecklists}</h3>
            <p>Total Checklists</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completedItems}</h3>
            <p>Completed Items</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingItems}</h3>
            <p>Pending Items</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{stats.complianceRate}%</h3>
            <p>Compliance Rate</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h3>Monthly Checklist Progress</h3>
          <div className="chart-container">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Items Status Distribution</h3>
          <div className="chart-container">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Checklists */}
      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Checklists</h2>
          <Link to="/checklists" className="btn-outline">View All</Link>
        </div>
        <div className="checklist-list">
          {recentChecklists.map(checklist => (
            <div key={checklist.id} className="checklist-item">
              <div className="checklist-info">
                <h4>{checklist.name}</h4>
                <span className="category-badge">{checklist.category}</span>
              </div>
              <div className="checklist-status">
                <span className={`status-badge status-${checklist.status}`}>
                  {checklist.status}
                </span>
                <div className="progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${checklist.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{checklist.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <Link to="/checklists/new" className="action-btn">
            <span>📝</span>
            <span>Create Checklist</span>
          </Link>
          <button 
            className="action-btn"
            onClick={() => toast.success('Report generated successfully!')}
          >
            <span>📊</span>
            <span>Generate Report</span>
          </button>
          <button 
            className="action-btn"
            onClick={() => toast.info('Team feature coming soon!')}
          >
            <span>👥</span>
            <span>Assign Tasks</span>
          </button>
          <button 
            className="action-btn"
            onClick={() => toast.info('Settings feature coming soon!')}
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Checklists Component
const Checklists = () => {
  const [checklists] = useState([
    { id: 1, name: 'GDPR Compliance', category: 'Privacy', status: 'active', items: 15, completed: 9, dueDate: '2024-02-28' },
    { id: 2, name: 'ISO 27001 Audit', category: 'Security', status: 'completed', items: 20, completed: 20, dueDate: '2024-01-18' },
    { id: 3, name: 'PCI DSS', category: 'Financial', status: 'pending', items: 12, completed: 4, dueDate: '2024-03-15' },
    { id: 4, name: 'HIPAA Checklist', category: 'Privacy', status: 'active', items: 18, completed: 14, dueDate: '2024-02-15' },
    { id: 5, name: 'SOC 2 Type II', category: 'Security', status: 'active', items: 22, completed: 9, dueDate: '2024-03-30' }
  ]);

  return (
    <div className="checklists-page">
      <div className="page-header">
        <div>
          <h1>✅ Checklists</h1>
          <p>Manage and track your compliance checklists</p>
        </div>
        <Link to="/checklists/new" className="btn-primary">
          + Create New Checklist
        </Link>
      </div>

      {/* Filters */}
      <div className="filters">
        <input type="text" placeholder="Search checklists..." />
        <select>
          <option>All Categories</option>
          <option>Security</option>
          <option>Privacy</option>
          <option>Financial</option>
          <option>Legal</option>
        </select>
        <select>
          <option>All Status</option>
          <option>Active</option>
          <option>Completed</option>
          <option>Pending</option>
          <option>Draft</option>
        </select>
        <button className="btn-outline">Clear Filters</button>
      </div>

      {/* Checklists Grid */}
      <div className="checklists-grid">
        {checklists.map(checklist => (
          <div key={checklist.id} className="checklist-card">
            <div className="card-header">
              <h3>{checklist.name}</h3>
              <span className={`status-badge status-${checklist.status}`}>
                {checklist.status}
              </span>
            </div>
            <p className="card-category">{checklist.category}</p>
            <div className="card-stats">
              <div className="stat">
                <span className="stat-label">Items</span>
                <span className="stat-value">{checklist.items}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Completed</span>
                <span className="stat-value">{checklist.completed}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Due Date</span>
                <span className="stat-value">{checklist.dueDate}</span>
              </div>
            </div>
            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(checklist.completed / checklist.items) * 100}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {Math.round((checklist.completed / checklist.items) * 100)}% Complete
              </span>
            </div>
            <div className="card-actions">
              <Link to={`/checklists/${checklist.id}`} className="btn-outline">View</Link>
              <Link to={`/checklists/${checklist.id}/edit`} className="btn-outline">Edit</Link>
              <button 
                className="btn-outline"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this checklist?')) {
                    toast.success('Checklist deleted successfully!');
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Reports Component
const Reports = () => {
  const [timeRange, setTimeRange] = useState('last30');

  const generateReport = () => {
    toast.success(`Report generated for ${timeRange} days!`);
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h1>📈 Reports & Analytics</h1>
          <p>Generate comprehensive compliance reports</p>
        </div>
        <button className="btn-primary" onClick={generateReport}>
          Generate Report
        </button>
      </div>

      {/* Report Filters */}
      <div className="report-filters">
        <div className="filter-group">
          <label>Time Period</label>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="last30">Last 30 Days</option>
            <option value="last90">Last 90 Days</option>
            <option value="lastYear">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Category</label>
          <select>
            <option>All Categories</option>
            <option>Security</option>
            <option>Privacy</option>
            <option>Financial</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Format</label>
          <select>
            <option>PDF</option>
            <option>Excel</option>
            <option>CSV</option>
          </select>
        </div>
      </div>

      {/* Report Summary */}
      <div className="report-summary">
        <div className="summary-card">
          <h3>Overall Compliance Rate</h3>
          <div className="summary-value">78%</div>
          <p className="summary-trend">↑ 5% from last month</p>
        </div>
        <div className="summary-card">
          <h3>Avg. Completion Time</h3>
          <div className="summary-value">14 days</div>
          <p className="summary-trend">↓ 2 days from last month</p>
        </div>
        <div className="summary-card">
          <h3>Open Items</h3>
          <div className="summary-value">18</div>
          <p className="summary-trend">↓ 3 from last week</p>
        </div>
        <div className="summary-card">
          <h3>Overdue Items</h3>
          <div className="summary-value">3</div>
          <p className="summary-trend">↓ 1 from last week</p>
        </div>
      </div>

      {/* Report Table */}
      <div className="report-table">
        <h3>Detailed Compliance Report</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Checklist</th>
                <th>Category</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Due Date</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>GDPR Compliance</td>
                <td>Privacy</td>
                <td><span className="status-badge status-active">Active</span></td>
                <td>60%</td>
                <td>2024-02-28</td>
                <td>2024-01-20</td>
              </tr>
              <tr>
                <td>ISO 27001 Audit</td>
                <td>Security</td>
                <td><span className="status-badge status-completed">Completed</span></td>
                <td>100%</td>
                <td>2024-01-18</td>
                <td>2024-01-18</td>
              </tr>
              <tr>
                <td>PCI DSS</td>
                <td>Financial</td>
                <td><span className="status-badge status-pending">Pending</span></td>
                <td>30%</td>
                <td>2024-03-15</td>
                <td>2024-01-15</td>
              </tr>
              <tr>
                <td>HIPAA Checklist</td>
                <td>Privacy</td>
                <td><span className="status-badge status-active">Active</span></td>
                <td>75%</td>
                <td>2024-02-15</td>
                <td>2024-01-19</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="export-options">
        <h3>Export Options</h3>
        <div className="export-buttons">
          <button className="btn-outline">📄 Export as PDF</button>
          <button className="btn-outline">📊 Export as Excel</button>
          <button className="btn-outline">📋 Export as CSV</button>
          <button className="btn-outline">🖨️ Print Report</button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Login Component
const Login = () => {
  const [credentials, setCredentials] = useState({
    email: 'admin@example.com',
    password: 'admin123'
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
      toast.success('Login successful! Redirecting to dashboard...');
      // In real app, you would navigate to dashboard
    } else {
      toast.error('Invalid credentials. Use admin@example.com / admin123');
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>🔐 Welcome Back</h1>
          <p>Sign in to your Compliance Checklist account</p>
        </div>
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="form-options">
            <label className="checkbox">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>
          
          <button type="submit" className="btn-primary btn-block">
            Sign In
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Create one here
            </Link>
          </p>
          <p className="demo-credentials">
            <small>Demo credentials: admin@example.com / admin123</small>
          </p>
        </div>
      </div>
    </div>
  );
};

// Layout Component
const Layout = ({ children }) => {
  const handleLogout = () => {
    toast.info('Logged out successfully!');
  };

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="logo">
          <h2>📋 Compliance</h2>
          <p className="logo-subtitle">Checklist System</p>
        </div>
        
        <ul className="nav-menu">
          <li><Link to="/" className="nav-link">🏠 Dashboard</Link></li>
          <li><Link to="/checklists" className="nav-link">✅ Checklists</Link></li>
          <li><Link to="/reports" className="nav-link">📈 Reports</Link></li>
          <li><a href="#" className="nav-link">📋 Templates</a></li>
          <li><a href="#" className="nav-link">👥 Team</a></li>
          <li><a href="#" className="nav-link">⚙️ Settings</a></li>
        </ul>
        
        <div className="user-section">
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <strong>Admin User</strong>
              <small>admin@example.com</small>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </nav>
      
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <h1>Compliance Checklist System</h1>
            <div className="breadcrumb">Dashboard</div>
          </div>
          <div className="topbar-right">
            <button className="btn-notification">🔔</button>
            <div className="user-menu">
              <span>👤 Admin</span>
            </div>
          </div>
        </header>
        
        <div className="content">
          {children}
        </div>
        
        <footer className="footer">
          <p>© 2024 Compliance Checklist System v1.0 | Professional Compliance Management</p>
        </footer>
      </main>
    </div>
  );
};

// Coming Soon Components
const Templates = () => (
  <div className="coming-soon">
    <h1>📋 Checklist Templates</h1>
    <p>Coming soon - Pre-built compliance templates</p>
  </div>
);

const Team = () => (
  <div className="coming-soon">
    <h1>👥 Team Management</h1>
    <p>Coming soon - Team collaboration features</p>
  </div>
);

const Settings = () => (
  <div className="coming-soon">
    <h1>⚙️ System Settings</h1>
    <p>Coming soon - Customize your compliance system</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} /> {/* Using same as login for now */}
          
          <Route path="/" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          
          <Route path="/checklists" element={
            <Layout>
              <Checklists />
            </Layout>
          } />
          
          <Route path="/checklists/new" element={
            <Layout>
              <div className="checklist-form-page">
                <h1>Create New Checklist</h1>
                <p>Coming soon - Interactive form builder</p>
              </div>
            </Layout>
          } />
          
          <Route path="/checklists/:id" element={
            <Layout>
              <div className="checklist-detail-page">
                <h1>Checklist Details</h1>
                <p>Coming soon - Detailed checklist view</p>
              </div>
            </Layout>
          } />
          
          <Route path="/reports" element={
            <Layout>
              <Reports />
            </Layout>
          } />
          
          <Route path="/templates" element={
            <Layout>
              <Templates />
            </Layout>
          } />
          
          <Route path="/team" element={
            <Layout>
              <Team />
            </Layout>
          } />
          
          <Route path="/settings" element={
            <Layout>
              <Settings />
            </Layout>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;