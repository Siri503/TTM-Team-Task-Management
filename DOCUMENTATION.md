# Team Task Management Application - Complete Documentation

## Project Overview

The Team Task Management Application is a full-stack MERN (MongoDB, Express, React, Node.js) web application designed for collaborative team project management. It allows teams to organize projects, assign tasks, and track progress efficiently.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  - Components: Auth, Projects, Tasks, Dashboard         │
│  - Context API for state management                     │
│  - Axios for API calls                                  │
└─────────────────────────────────────────────────────────┘
                           ↕ (HTTP/REST)
┌─────────────────────────────────────────────────────────┐
│                  Backend (Express.js)                    │
│  - Routes: Auth, Projects, Tasks, Dashboard            │
│  - Controllers: Business logic                          │
│  - Middleware: Authentication                           │
│  - Models: User, Project, Task                          │
└─────────────────────────────────────────────────────────┘
                           ↕ (Mongoose)
┌─────────────────────────────────────────────────────────┐
│               Database (MongoDB)                         │
│  - Collections: users, projects, tasks                  │
└─────────────────────────────────────────────────────────┘
```

## Key Features

### 1. User Authentication
- **Signup**: Create new user accounts with email and password
- **Login**: Secure login with JWT token generation
- **Session Management**: Token stored in localStorage
- **Password Security**: Bcryptjs for password hashing
- **Auto-logout**: Tokens expire after 7 days

### 2. Project Management
- **Create Projects**: Admin creates new projects
- **Project Details**: Name, description, status tracking
- **Member Management**:
  - Add members by email
  - Assign roles (Admin, Member)
  - Remove members
  - View all members
- **Project Status**: Active, On Hold, Completed
- **Project Visibility**: Only members can view projects

### 3. Task Management
- **Create Tasks**: Add tasks to projects
- **Task Properties**:
  - Title and description
  - Priority (Low, Medium, High)
  - Status (To Do, In Progress, Done)
  - Due date tracking
  - Assignment to team members
- **Task Operations**:
  - Update task status
  - Reassign tasks
  - Add comments
  - Delete tasks
- **Role-Based Permissions**:
  - Members can only update assigned tasks
  - Admins can manage all tasks

### 4. Dashboard
- **Statistics Overview**:
  - Total tasks count
  - Tasks by status distribution
  - Overdue tasks tracking
  - Tasks by priority
- **Personal Metrics**:
  - Assigned tasks count
  - Completed tasks count
- **Project Overview**:
  - Total number of projects
- **Task List**: Table view of all assigned tasks

### 5. Role-Based Access Control
- **Admin**: Full control over project and tasks
- **Member**: Limited to viewing and updating assigned tasks

## Backend Architecture

### Directory Structure
```
backend/
├── models/
│   ├── User.js          # User schema and authentication
│   ├── Project.js       # Project schema with members
│   └── Task.js          # Task schema with comments
├── controllers/
│   ├── authController.js        # Auth logic
│   ├── projectController.js     # Project logic
│   ├── taskController.js        # Task logic
│   └── dashboardController.js   # Analytics logic
├── routes/
│   ├── authRoutes.js       # Auth endpoints
│   ├── projectRoutes.js    # Project endpoints
│   ├── taskRoutes.js       # Task endpoints
│   └── dashboardRoutes.js  # Dashboard endpoints
├── middleware/
│   └── auth.js            # JWT authentication
├── server.js              # Express app setup
└── package.json           # Dependencies
```

### Database Models

#### User Model
```javascript
{
  name: String,          // User's full name
  email: String,         // Unique email (index)
  password: String,      // Hashed password
  avatar: String,        // Profile picture URL
  createdAt: Date,
  updatedAt: Date
}
```

#### Project Model
```javascript
{
  name: String,          // Project name
  description: String,   // Project description
  admin: ObjectId,       // Reference to User
  members: [
    {
      user: ObjectId,    // Reference to User
      role: String       // 'Admin' or 'Member'
    }
  ],
  status: String,        // 'Active', 'On Hold', 'Completed'
  createdAt: Date,
  updatedAt: Date
}
```

#### Task Model
```javascript
{
  title: String,         // Task title
  description: String,   // Task description
  project: ObjectId,     // Reference to Project
  assignedTo: ObjectId,  // Reference to User (optional)
  createdBy: ObjectId,   // Reference to User
  status: String,        // 'To Do', 'In Progress', 'Done'
  priority: String,      // 'Low', 'Medium', 'High'
  dueDate: Date,         // Task deadline
  comments: [
    {
      user: ObjectId,    // Reference to User
      text: String,
      createdAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints

#### Authentication Endpoints
```
POST   /api/auth/signup     # Register new user
POST   /api/auth/login      # Login user
GET    /api/auth/me         # Get current user (protected)
```

#### Project Endpoints
```
POST   /api/projects                    # Create project (protected)
GET    /api/projects                    # Get user's projects (protected)
GET    /api/projects/:id               # Get project details (protected)
PUT    /api/projects/:id               # Update project (protected)
DELETE /api/projects/:id               # Delete project (protected)
POST   /api/projects/:id/members       # Add member (protected)
DELETE /api/projects/:id/members       # Remove member (protected)
```

#### Task Endpoints
```
POST   /api/tasks                       # Create task (protected)
GET    /api/tasks/project/:projectId   # Get project tasks (protected)
GET    /api/tasks/:id                  # Get task details (protected)
PUT    /api/tasks/:id                  # Update task (protected)
DELETE /api/tasks/:id                  # Delete task (protected)
GET    /api/tasks/user/tasks           # Get user's tasks (protected)
POST   /api/tasks/:id/comments         # Add comment (protected)
```

#### Dashboard Endpoints
```
GET    /api/dashboard                      # Get dashboard stats (protected)
GET    /api/dashboard/project/:projectId   # Get project stats (protected)
```

## Frontend Architecture

### Directory Structure
```
client/src/
├── components/
│   ├── Signup.js        # Signup page
│   ├── Login.js         # Login page
│   ├── Dashboard.js     # Dashboard page
│   ├── Projects.js      # Projects list page
│   ├── ProjectDetail.js # Project detail page
│   ├── TaskDetail.js    # Task detail page
│   ├── Navbar.js        # Navigation bar
│   └── ProtectedRoute.js # Route protection
├── context/
│   └── AuthContext.js   # Authentication state
├── services/
│   └── api.js           # API client
├── styles/
│   ├── global.css
│   ├── Auth.css
│   ├── Navbar.css
│   ├── Projects.css
│   ├── ProjectDetail.css
│   ├── TaskDetail.css
│   └── Dashboard.css
├── pages/              # Page components (if needed)
├── App.js              # Main app component
└── index.js            # React entry point
```

### State Management

#### AuthContext
- Manages user authentication state
- Handles login/signup/logout
- Provides auth status for route protection
- Auto-checks user on app load

#### Component State
- Local state for forms
- Loading states for API calls
- Error handling

### Routing

```
/               → Redirects to /dashboard
/signup         → Signup page (public)
/login          → Login page (public)
/dashboard      → Dashboard (protected)
/projects       → Projects list (protected)
/projects/:id   → Project detail (protected)
/tasks/:id      → Task detail (protected)
```

## Security Features

### Backend Security
1. **Password Hashing**: bcryptjs with salt rounds
2. **JWT Authentication**: Token-based auth with 7-day expiry
3. **Input Validation**: Validates all request data
4. **Authorization**: Role-based access control
5. **Error Handling**: Generic error messages
6. **CORS**: Configured for frontend domain

### Frontend Security
1. **Protected Routes**: Redirects unauthenticated users
2. **Token Storage**: Stored in localStorage
3. **Auto-logout**: Tokens expire after 7 days
4. **XSS Protection**: React sanitization
5. **HTTPS Ready**: Supports HTTPS in production

## Data Flow Example: Creating a Task

1. **User fills form** → React component
2. **Submit form** → axios API call to `/api/tasks`
3. **Backend receives** → Task controller
4. **Validation** → Checks required fields
5. **Authorization** → Verifies user is project member
6. **Create task** → Save to MongoDB
7. **Populate refs** → Load user and project data
8. **Response** → Send task data back
9. **Frontend updates** → Project tasks list refreshed
10. **Show success** → UI confirmation

## Error Handling

### Backend
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

### Frontend
- Display error messages
- Retry logic for failed requests
- User-friendly error alerts
- Graceful fallbacks

## Performance Considerations

### Database
- Indexes on frequently queried fields (email, project, user)
- Population of references for related data
- Efficient queries with projections

### Frontend
- Component code splitting
- Lazy loading of routes
- Memoization of expensive computations
- Image optimization

### Backend
- Connection pooling
- Query optimization
- Middleware ordering
- Response compression potential

## Testing Workflow

### Manual Testing Steps

1. **Authentication**
   - [ ] Signup with new email
   - [ ] Login with correct credentials
   - [ ] Login fails with wrong password
   - [ ] Logout clears token

2. **Project Management**
   - [ ] Create project as admin
   - [ ] Add members by email
   - [ ] Remove members
   - [ ] View project details
   - [ ] Update project info
   - [ ] Delete project

3. **Task Management**
   - [ ] Create task in project
   - [ ] Update task status
   - [ ] Assign task to member
   - [ ] Add comment to task
   - [ ] Delete task
   - [ ] Only assigned user can edit

4. **Dashboard**
   - [ ] View all statistics
   - [ ] Check task counts
   - [ ] View assigned tasks
   - [ ] Verify project count

## Deployment Checklist

- [ ] Set up MongoDB Atlas
- [ ] Configure environment variables
- [ ] Set JWT_SECRET to strong value
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set NODE_ENV=production
- [ ] Deploy backend (Heroku/AWS/DigitalOcean)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Test all endpoints
- [ ] Set up monitoring
- [ ] Enable error logging
- [ ] Create backups

## Troubleshooting Guide

### Issue: API calls fail
**Solution**: Check backend is running, verify proxy in package.json

### Issue: MongoDB connection error
**Solution**: Ensure MongoDB is running or check Atlas connection string

### Issue: Authentication fails
**Solution**: Clear localStorage, check JWT_SECRET matches

### Issue: Tasks not showing
**Solution**: Verify user is project member, check task assignment

### Issue: CORS error
**Solution**: Check backend CORS configuration, verify frontend URL

## Future Enhancements

1. **Features**
   - File attachments
   - Notifications
   - Labels/tags
   - Calendar view
   - Recurring tasks

2. **Performance**
   - Caching layer (Redis)
   - Search indexing
   - Pagination
   - Lazy loading

3. **Security**
   - Two-factor authentication
   - OAuth integration
   - Rate limiting
   - Audit logging

4. **UX**
   - Dark mode
   - Mobile app
   - Real-time updates (WebSocket)
   - Offline support

5. **DevOps**
   - CI/CD pipeline
   - Automated testing
   - Container deployment (Docker)
   - Load balancing

## Support & Resources

- **MongoDB**: https://docs.mongodb.com
- **Express**: https://expressjs.com
- **React**: https://react.dev
- **Node.js**: https://nodejs.org
- **JWT**: https://jwt.io

## License

MIT License - Feel free to use and modify

## Conclusion

This Team Task Management Application provides a solid foundation for team collaboration. The modular architecture allows for easy expansion and customization based on specific needs.
