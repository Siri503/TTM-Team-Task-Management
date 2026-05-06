# Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

## Setup MongoDB

### Option 1: Local MongoDB
```bash
# Install MongoDB if not already installed
# On Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
# On Mac: brew install mongodb-community
# On Linux: Follow official MongoDB docs

# Start MongoDB service
mongod
```

### Option 2: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `MONGODB_URI` in backend `.env`

## Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
# MONGODB_URI=mongodb://localhost:27017/team-task-management
# JWT_SECRET=your_secret_key_here
# PORT=5000
# NODE_ENV=development

# Start server
npm run dev
```

Server will run at: `http://localhost:5000`

## Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run at: `http://localhost:3000`

## Testing the Application

### 1. Sign Up
- Go to http://localhost:3000/signup
- Create a new account with:
  - Name: Your Name
  - Email: test@example.com
  - Password: password123

### 2. Create a Project
- Navigate to Projects
- Click "Create New Project"
- Fill in project details

### 3. Add Team Members
- In project detail, click "Add Member"
- Enter team member's email
- Select role (Admin or Member)

### 4. Create Tasks
- Click "Create Task" in project
- Fill in task details (title, description, priority, due date)

### 5. Assign Tasks
- In project detail, click on a task
- Edit and assign to a team member

### 6. View Dashboard
- Click "Dashboard" in navigation
- View statistics and metrics
- Check your assigned tasks

## Database Models

### User
- name (String)
- email (String, unique)
- password (String, hashed)
- createdAt, updatedAt

### Project
- name (String)
- description (String)
- admin (Reference to User)
- members (Array of {user, role})
- status (Active, On Hold, Completed)
- createdAt, updatedAt

### Task
- title (String)
- description (String)
- project (Reference to Project)
- assignedTo (Reference to User)
- createdBy (Reference to User)
- status (To Do, In Progress, Done)
- priority (Low, Medium, High)
- dueDate (Date)
- comments (Array of {user, text, createdAt})
- createdAt, updatedAt

## API Testing with Postman

1. Import the collection from `api-collection.json` (if provided)
2. Set up environment variables:
   - `base_url`: http://localhost:5000/api
   - `token`: (set after login)
3. Test each endpoint

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- Verify database name

### CORS Error
- Ensure backend is running
- Check proxy setting in client/package.json
- Verify API_URL in frontend

### Port Already in Use
```bash
# Change port in backend .env
PORT=5001

# Or kill process using port
# On Windows: netstat -ano | findstr :5000
# On Mac/Linux: lsof -i :5000 | kill -9 <PID>
```

### Authentication Issues
- Clear browser localStorage
- Ensure JWT_SECRET is consistent
- Check token expiration

## Development Tips

### Frontend
- Use React DevTools for debugging
- Check Network tab in browser for API calls
- Use console for logging

### Backend
- Use `npm run dev` for hot reload with nodemon
- Check MongoDB Atlas UI for data
- Use Postman to test endpoints

### Database
- Use MongoDB Compass for GUI management
- Use MongoDB Atlas UI for cloud database
- Keep backups of important data

## Deployment

### Backend (Heroku)
```bash
heroku create your-app-name
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy build folder to Vercel/Netlify
```

## Performance Tips

1. Add indexes to frequently queried fields
2. Implement pagination for large datasets
3. Use caching for dashboard statistics
4. Optimize database queries
5. Implement file upload limits

## Security Recommendations

1. Change JWT_SECRET to strong value
2. Use HTTPS in production
3. Implement rate limiting
4. Add input validation
5. Use environment variables for sensitive data
6. Enable CORS only for trusted domains
7. Hash passwords (already implemented with bcryptjs)
8. Add request logging

## Common Issues

Q: Frontend can't connect to backend?
A: Ensure backend is running and check proxy in client/package.json

Q: MongoDB connection fails?
A: Check MongoDB is running and connection string is correct

Q: Tasks not showing?
A: Check user is member of project and task is assigned correctly

Q: Can't add members?
A: Ensure user with that email exists in system

## Support Resources

- MongoDB Documentation: https://docs.mongodb.com
- Express.js Guide: https://expressjs.com
- React Documentation: https://react.dev
- Node.js API: https://nodejs.org/api

## Next Steps

After setup:
1. Familiarize yourself with the dashboard
2. Create test data
3. Test all features
4. Customize styling
5. Deploy to production
