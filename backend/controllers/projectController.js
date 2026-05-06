const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

// Create project
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please provide project name' });
    }

    const project = new Project({
      name,
      description,
      admin: req.user.id,
      members: [
        {
          user: req.user.id,
          role: 'Admin'
        }
      ]
    });

    await project.save();
    await project.populate(['admin', 'members.user']);

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all projects for user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      'members.user': req.user.id
    }).populate(['admin', 'members.user']);

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate([
      'admin',
      'members.user'
    ]);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is member
    const isMember = project.members.some(
      m => m.user._id.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    if (name) project.name = name;
    if (description) project.description = description;
    if (status) project.status = status;

    await project.save();
    await project.populate(['admin', 'members.user']);

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await Task.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add member to project
exports.addMember = async (req, res) => {
  try {
    const { email, role = 'Member' } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    if (!['Admin', 'Member'].includes(role)) {
      return res.status(400).json({ message: 'Invalid member role' });
    }

    const project = await Project.findById(req.params.id).populate('members.user');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add members' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already is a member
    const isMember = project.members.some(
      m => m.user._id.toString() === user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push({
      user: user._id,
      role
    });

    await project.save();
    await project.populate(['admin', 'members.user']);

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove member from project
exports.removeMember = async (req, res) => {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({ message: 'Please provide member ID' });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to remove members' });
    }

    // Check if trying to remove admin
    if (memberId === project.admin.toString()) {
      return res.status(400).json({ message: 'Cannot remove project admin' });
    }

    project.members = project.members.filter(
      m => m.user.toString() !== memberId
    );

    await project.save();
    await project.populate(['admin', 'members.user']);

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
