const Task = require('../models/Task');
const Project = require('../models/Project');

// Create task
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: 'Please provide title and project ID' });
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only project admins can create and assign tasks.
    const isMember = project.members.some(m => m.user.toString() === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to create task in this project' });
    }

    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only project admins can create tasks' });
    }

    if (assignedTo) {
      const isAssigneeProjectMember = project.members.some(
        m => m.user.toString() === assignedTo
      );

      if (!isAssigneeProjectMember) {
        return res.status(400).json({ message: 'Assigned user must be a project member' });
      }
    }

    const task = new Task({
      title,
      description,
      project: projectId,
      assignedTo: assignedTo || null,
      createdBy: req.user.id,
      priority,
      dueDate
    });

    await task.save();
    await task.populate(['assignedTo', 'createdBy']);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tasks for project
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists and user is member
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some(m => m.user.toString() === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view tasks' });
    }

    const tasks = await Task.find({ project: projectId }).populate([
      'assignedTo',
      'createdBy'
    ]);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate(['assignedTo', 'createdBy'])
      .populate({
        path: 'project',
        populate: {
          path: 'members.user'
        }
      });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is member of project
    const project = await Project.findById(task.project._id || task.project);
    const isMember = project.members.some(m => m.user.toString() === req.user.id);

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view this task' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo, dueDate } = req.body;
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is member of project or is assigned to task
    const project = await Project.findById(task.project);
    const isMember = project.members.some(m => m.user.toString() === req.user.id);
    const isAdmin = project.admin.toString() === req.user.id;
    const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user.id;
    const isCreator = task.createdBy.toString() === req.user.id;

    if (!isMember || (!isAdmin && !isAssigned && !isCreator)) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    if (assignedTo) {
      const isAssigneeProjectMember = project.members.some(
        m => m.user.toString() === assignedTo
      );

      if (!isAssigneeProjectMember) {
        return res.status(400).json({ message: 'Assigned user must be a project member' });
      }
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (dueDate) task.dueDate = dueDate;

    await task.save();
    await task.populate(['assignedTo', 'createdBy']);

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is creator of task or admin
    const project = await Project.findById(task.project);
    const isAdmin = project.admin.toString() === req.user.id;
    const isCreator = task.createdBy.toString() === req.user.id;

    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's assigned tasks
exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id }).populate([
      'assignedTo',
      'createdBy',
      'project'
    ]);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add comment to task
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Please provide comment text' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    const isMember = project.members.some(m => m.user.toString() === req.user.id);

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to comment on this task' });
    }

    task.comments.push({
      user: req.user.id,
      text
    });

    await task.save();
    await task.populate(['assignedTo', 'createdBy', 'comments.user']);

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
