# Team Task Management Application

A full-stack web application for team collaboration and task management.

## Tech Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS3

## Features

### User Authentication
- User signup with name, email, and password
- Secure login with JWT authentication
- Session management with token storage

### Project Management
- Create and manage projects
- Admin can add/remove members
- Members can view assigned projects
- Project status tracking

### Task Management
- Create tasks with title, description, priority, and due date
- Assign tasks to team members
- Update task status (To Do, In Progress, Done)
- Add comments to tasks
- Track task progress

### Dashboard
- View total tasks and their status distribution
- Track tasks by priority
- Monitor overdue tasks
- View personal task assignments
- Project statistics and analytics

### Role-Based Access
- **Admin**: Full control over projects and tasks
- **Member**: Can view and update assigned tasks only

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or remote)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/team-task-management
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `POST /api/projects` - Create a new project
- `GET /api/projects` - Get all user projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members` - Remove member from project

### Tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/project/:projectId` - Get project tasks
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/user/tasks` - Get user's assigned tasks
- `POST /api/tasks/:id/comments` - Add comment to task

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics
- `GET /api/dashboard/project/:projectId` - Get project statistics

## Project Structure

```
team-task-management/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── dashboardController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── dashboardRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Signup.js
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Projects.js
│   │   │   ├── ProjectDetail.js
│   │   │   ├── TaskDetail.js
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   ├── Auth.css
│   │   │   ├── Navbar.css
│   │   │   ├── Projects.css
│   │   │   ├── ProjectDetail.css
│   │   │   ├── TaskDetail.css
│   │   │   └── Dashboard.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── .env.example
```

## Usage

1. **Signup/Login**: Create an account or login with existing credentials
2. **Create Project**: Click "Create New Project" to start a new project
3. **Manage Members**: As admin, add team members to your project
4. **Create Tasks**: Create tasks within your projects
5. **Assign Tasks**: Assign tasks to team members
6. **Track Progress**: Monitor task progress and status updates
7. **Dashboard**: View overall statistics and project insights

## Future Enhancements

- File attachments for tasks
- Email notifications
- Task labels and tags
- Calendar view
- Activity timeline
- User profiles and avatars
- Advanced filtering and search
- Export functionality (PDF, CSV)
- Real-time collaboration with WebSockets
- Mobile app

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
