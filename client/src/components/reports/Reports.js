import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Reports.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const chartData = {
    labels: ['GDPR', 'ISO 27001', 'PCI DSS', 'HIPAA', 'SOC 2'],
    datasets: [
      {
        label: 'Completion %',
        data: [60, 100, 30, 75, 40],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
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
      },
      title: {
        display: true,
        text: 'Checklist Completion Status'
      }
    }
  };

  return (
    <div className="reports">
      <div className="page-header">
        <h1>📈 Compliance Reports</h1>
        <button className="btn-primary">
          Export Report
        </button>
      </div>
      
      <div className="report-filters">
        <select>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>Last year</option>
        </select>
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
        </select>
        <button className="btn-primary">Generate Report</button>
      </div>
      
      <div className="report-cards">
        <div className="report-card">
          <h3>Checklist Completion Status</h3>
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
        
        <div className="report-card">
          <h3>Summary Statistics</h3>
          <div className="summary-stats">
            <div className="summary-item">
              <h4>Overall Compliance Rate</h4>
              <div className="stat-value">61%</div>
            </div>
            <div className="summary-item">
              <h4>Avg. Completion Time</h4>
              <div className="stat-value">14 days</div>
            </div>
            <div className="summary-item">
              <h4>Total Items</h4>
              <div className="stat-value">48</div>
            </div>
            <div className="summary-item">
              <h4>Overdue Items</h4>
              <div className="stat-value">3</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="report-table">
        <h3>Detailed Compliance Report</h3>
        <div className="table-responsive">
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
                <td><span className="status-badge active">Active</span></td>
                <td>60%</td>
                <td>2024-02-28</td>
                <td>2024-01-20</td>
              </tr>
              <tr>
                <td>ISO 27001 Audit</td>
                <td>Security</td>
                <td><span className="status-badge completed">Completed</span></td>
                <td>100%</td>
                <td>2024-01-18</td>
                <td>2024-01-18</td>
              </tr>
              <tr>
                <td>PCI DSS</td>
                <td>Financial</td>
                <td><span className="status-badge pending">Pending</span></td>
                <td>30%</td>
                <td>2024-03-15</td>
                <td>2024-01-15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;