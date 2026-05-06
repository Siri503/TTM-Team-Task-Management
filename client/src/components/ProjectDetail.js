import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectService, taskService } from '../services/api';
import '../styles/ProjectDetail.css';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?.id || user?._id;
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('Member');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: ''
  });

  const loadProject = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projectService.getProject(projectId);
      setProject(response.data);
      
      const tasksResponse = await taskService.getProjectTasks(projectId);
      setTasks(tasksResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await projectService.addMember(projectId, memberEmail, memberRole);
      setMemberEmail('');
      setShowMemberForm(false);
      loadProject();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await projectService.removeMember(projectId, memberId);
      loadProject();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.createTask(
        taskData.title,
        taskData.description,
        projectId,
        taskData.assignedTo || null,
        taskData.priority,
        taskData.dueDate
      );
      setTaskData({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'Medium',
        dueDate: ''
      });
      setShowTaskForm(false);
      loadProject();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        loadProject();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!project) return <div className="error">Project not found</div>;

  const isProjectAdmin = (project.admin?._id || project.admin) === currentUserId;

  return (
    <div className="project-detail">
      <div className="project-header">
        <button className="btn-back" onClick={() => navigate('/projects')}>Back</button>
        <h1>{project.name}</h1>
        <p>{project.description}</p>
      </div>

      <div className="project-content">
        <div className="section">
          <h2>Members ({project.members.length})</h2>
          <div className="members-list">
            {project.members.map(member => (
              <div key={member.user._id} className="member-item">
                <span>{member.user.name} ({member.role})</span>
                {isProjectAdmin && member.role === 'Member' && (
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveMember(member.user._id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          {isProjectAdmin && !showMemberForm && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowMemberForm(true)}
            >
              Add Member
            </button>
          )}
          {showMemberForm && (
            <form onSubmit={handleAddMember} className="form">
              <input
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="Member email"
                required
              />
              <select 
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value)}
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
              <button type="submit" className="btn btn-primary">Add</button>
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowMemberForm(false)}
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        <div className="section">
          <h2>Tasks ({tasks.length})</h2>
          {isProjectAdmin && !showTaskForm && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowTaskForm(true)}
            >
              Create Task
            </button>
          )}
          {showTaskForm && (
            <form onSubmit={handleCreateTask} className="form">
              <input
                type="text"
                value={taskData.title}
                onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                placeholder="Task title"
                required
              />
              <textarea
                value={taskData.description}
                onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                placeholder="Task description"
              />
              <select
                value={taskData.assignedTo}
                onChange={(e) => setTaskData({...taskData, assignedTo: e.target.value})}
              >
                <option value="">Unassigned</option>
                {project.members.map(member => (
                  <option key={member.user._id} value={member.user._id}>
                    {member.user.name} ({member.role})
                  </option>
                ))}
              </select>
              <select 
                value={taskData.priority}
                onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              <input
                type="date"
                value={taskData.dueDate}
                onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
              />
              <button type="submit" className="btn btn-primary">Create Task</button>
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowTaskForm(false)}
              >
                Cancel
              </button>
            </form>
          )}
          <div className="tasks-list">
            {tasks.map(task => (
              <div key={task._id} className="task-item">
                <div className="task-info">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <div className="task-meta">
                    <span className={`priority priority-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <span className={`status status-${task.status.toLowerCase().replace(' ', '-')}`}>
                      {task.status}
                    </span>
                    {task.dueDate && (
                      <span className="due-date">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    <span>
                      Assigned: {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                    </span>
                  </div>
                </div>
                <div className="task-actions">
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => navigate(`/tasks/${task._id}`)}
                  >
                    View
                  </button>
                  {(isProjectAdmin || (task.createdBy?._id || task.createdBy) === currentUserId) && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
