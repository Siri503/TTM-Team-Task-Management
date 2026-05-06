import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Auth API calls
export const authService = {
  signup: (name, email, password) =>
    api.post('/auth/signup', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me')
};

// Project API calls
export const projectService = {
  createProject: (name, description) =>
    api.post('/projects', { name, description }),
  getProjects: () => api.get('/projects'),
  getProject: (id) => api.get(`/projects/${id}`),
  updateProject: (id, data) =>
    api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  addMember: (id, email, role) =>
    api.post(`/projects/${id}/members`, { email, role }),
  removeMember: (id, memberId) =>
    api.delete(`/projects/${id}/members`, { data: { memberId } })
};

// Task API calls
export const taskService = {
  createTask: (title, description, projectId, assignedTo, priority, dueDate) =>
    api.post('/tasks', {
      title,
      description,
      projectId,
      assignedTo,
      priority,
      dueDate
    }),
  getProjectTasks: (projectId) =>
    api.get(`/tasks/project/${projectId}`),
  getTask: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, data) =>
    api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getUserTasks: () => api.get('/tasks/user/tasks'),
  addComment: (id, text) =>
    api.post(`/tasks/${id}/comments`, { text })
};

// Dashboard API calls
export const dashboardService = {
  getDashboardStats: () => api.get('/dashboard'),
  getProjectStats: (projectId) =>
    api.get(`/dashboard/project/${projectId}`)
};

export default api;
