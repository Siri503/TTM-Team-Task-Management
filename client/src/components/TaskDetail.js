import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskService } from '../services/api';
import '../styles/TaskDetail.css';

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [newComment, setNewComment] = useState('');

  const loadTask = useCallback(async () => {
    try {
      setLoading(true);
      const response = await taskService.getTask(taskId);
      setTask(response.data);
      setFormData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load task');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo?._id || formData.assignedTo || '',
        dueDate: formData.dueDate
      };
      await taskService.updateTask(taskId, updateData);
      setEditMode(false);
      loadTask();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await taskService.addComment(taskId, newComment);
      setNewComment('');
      loadTask();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        navigate(-1);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!task) return <div className="error">Task not found</div>;

  return (
    <div className="task-detail">
      <button className="btn-back" onClick={() => navigate(-1)}>Back</button>

      {editMode ? (
        <form onSubmit={handleUpdateTask} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="assignedTo">Assigned To</label>
            <select
              id="assignedTo"
              value={formData.assignedTo?._id || formData.assignedTo || ''}
              onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
            >
              <option value="">Unassigned</option>
              {formData.project?.members?.map(member => (
                <option key={member.user._id} value={member.user._id}>
                  {member.user.name} ({member.role})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save Changes</button>
            <button 
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="task-info">
          <h1>{task.title}</h1>
          <p>{task.description}</p>
          <div className="task-meta">
            <span className={`status status-${task.status.toLowerCase().replace(' ', '-')}`}>
              {task.status}
            </span>
            <span className={`priority priority-${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            )}
            {task.assignedTo && (
              <span>Assigned to: {task.assignedTo.name}</span>
            )}
          </div>
          <div className="task-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDeleteTask}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="comments-section">
        <h2>Comments</h2>
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
          />
          <button type="submit" className="btn btn-primary">Post Comment</button>
        </form>

        <div className="comments-list">
          {task.comments && task.comments.length > 0 ? (
            task.comments.map((comment, index) => (
              <div key={index} className="comment">
                <div className="comment-header">
                  <strong>{comment.user.name}</strong>
                  <small>{new Date(comment.createdAt).toLocaleString()}</small>
                </div>
                <p>{comment.text}</p>
              </div>
            ))
          ) : (
            <p>No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
