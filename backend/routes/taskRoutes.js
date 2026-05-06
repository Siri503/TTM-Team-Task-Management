const express = require('express');
const {
  createTask,
  getProjectTasks,
  getTask,
  updateTask,
  deleteTask,
  getUserTasks,
  addComment
} = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createTask);
router.get('/project/:projectId', auth, getProjectTasks);
router.get('/user/tasks', auth, getUserTasks);
router.get('/:id', auth, getTask);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);
router.post('/:id/comments', auth, addComment);

module.exports = router;
