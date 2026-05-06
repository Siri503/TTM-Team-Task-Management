const Task = require('../models/Task');
const Project = require('../models/Project');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get all projects for user
    const userProjects = await Project.find({
      'members.user': req.user.id
    });

    const projectIds = userProjects.map(p => p._id);

    // Get all tasks in user's projects
    const allTasks = await Task.find({
      project: { $in: projectIds }
    });

    // Get user's assigned tasks
    const userTasks = await Task.find({
      assignedTo: req.user.id
    });

    // Calculate statistics
    const totalTasks = allTasks.length;
    const tasksByStatus = {
      'To Do': allTasks.filter(t => t.status === 'To Do').length,
      'In Progress': allTasks.filter(t => t.status === 'In Progress').length,
      'Done': allTasks.filter(t => t.status === 'Done').length
    };

    const overdueTasks = allTasks.filter(
      t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done'
    ).length;

    // Tasks by priority
    const tasksByPriority = {
      'Low': allTasks.filter(t => t.priority === 'Low').length,
      'Medium': allTasks.filter(t => t.priority === 'Medium').length,
      'High': allTasks.filter(t => t.priority === 'High').length
    };

    // User assigned tasks count
    const userAssignedCount = userTasks.length;
    const userCompletedCount = userTasks.filter(t => t.status === 'Done').length;

    res.json({
      totalTasks,
      tasksByStatus,
      overdueTasks,
      tasksByPriority,
      userAssignedCount,
      userCompletedCount,
      totalProjects: userProjects.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get project statistics
exports.getProjectStats = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is member
    const isMember = project.members.some(m => m.user.toString() === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view project stats' });
    }

    // Get project tasks
    const tasks = await Task.find({ project: projectId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const toDoTasks = tasks.filter(t => t.status === 'To Do').length;

    const tasksByStatus = {
      'To Do': toDoTasks,
      'In Progress': inProgressTasks,
      'Done': completedTasks
    };

    const tasksByPriority = {
      'Low': tasks.filter(t => t.priority === 'Low').length,
      'Medium': tasks.filter(t => t.priority === 'Medium').length,
      'High': tasks.filter(t => t.priority === 'High').length
    };

    const overdueTasks = tasks.filter(
      t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done'
    ).length;

    // Tasks per member
    const tasksPerMember = {};
    for (const member of project.members) {
      const memberTasks = tasks.filter(
        t => t.assignedTo && t.assignedTo.toString() === member.user.toString()
      );
      tasksPerMember[member.user] = memberTasks.length;
    }

    res.json({
      projectName: project.name,
      totalTasks,
      completedTasks,
      inProgressTasks,
      toDoTasks,
      tasksByStatus,
      tasksByPriority,
      overdueTasks,
      tasksPerMember,
      totalMembers: project.members.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
