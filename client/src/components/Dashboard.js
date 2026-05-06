import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService, dashboardService } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingTaskId, setUpdatingTaskId] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsResponse, tasksResponse] = await Promise.all([
        dashboardService.getDashboardStats(),
        taskService.getUserTasks()
      ]);
      setStats(statsResponse.data);
      setUserTasks(tasksResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      setError('');
      setUpdatingTaskId(taskId);
      await taskService.updateTask(taskId, { status });
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
    } finally {
      setUpdatingTaskId('');
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stats) return <div className="error">No dashboard data available</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-number">{stats.totalTasks}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-number">{stats.tasksByStatus['In Progress']}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">{stats.tasksByStatus.Done}</p>
        </div>
        <div className="stat-card">
          <h3>Overdue</h3>
          <p className="stat-number">{stats.overdueTasks}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="section">
          <h2>Tasks by Status</h2>
          <div className="status-breakdown">
            <div className="status-item">
              <span>To Do</span>
              <span className="count">{stats.tasksByStatus['To Do']}</span>
            </div>
            <div className="status-item">
              <span>In Progress</span>
              <span className="count">{stats.tasksByStatus['In Progress']}</span>
            </div>
            <div className="status-item">
              <span>Done</span>
              <span className="count">{stats.tasksByStatus.Done}</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Tasks by Priority</h2>
          <div className="priority-breakdown">
            <div className="priority-item">
              <span>Low</span>
              <span className="count">{stats.tasksByPriority.Low}</span>
            </div>
            <div className="priority-item">
              <span>Medium</span>
              <span className="count">{stats.tasksByPriority.Medium}</span>
            </div>
            <div className="priority-item">
              <span>High</span>
              <span className="count">{stats.tasksByPriority.High}</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Your Tasks</h2>
          <div className="your-tasks">
            <div className="task-stat">
              <span>Assigned Tasks</span>
              <span className="number">{stats.userAssignedCount}</span>
            </div>
            <div className="task-stat">
              <span>Completed</span>
              <span className="number">{stats.userCompletedCount}</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Projects</h2>
          <div className="projects-stat">
            <span>Total Projects</span>
            <span className="number">{stats.totalProjects}</span>
          </div>
        </div>
      </div>

      <div className="section full-width">
        <h2>Your Assigned Tasks</h2>
        {userTasks.length === 0 ? (
          <p className="empty-state">No tasks assigned to you yet</p>
        ) : (
          <div className="tasks-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userTasks.map(task => (
                  <tr key={task._id}>
                    <td>{task.title}</td>
                    <td>{task.project.name}</td>
                    <td>
                      <select
                        className="status-select"
                        value={task.status}
                        disabled={updatingTaskId === task._id}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </td>
                    <td>
                      <span className={`priority priority-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      {task.dueDate 
                        ? new Date(task.dueDate).toLocaleDateString()
                        : '-'
                      }
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => navigate(`/tasks/${task._id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
