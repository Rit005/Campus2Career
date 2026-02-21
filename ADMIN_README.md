# Campus2Career Admin Dashboard - Implementation Guide

## Overview
This document describes the complete Admin Dashboard implementation for the Campus2Career MERN stack application.

## Backend Implementation

### Files Created/Modified:

1. **backend/src/models/User.js**
   - Added `isBlocked` field for user management

2. **backend/src/middleware/auth.js**
   - Updated `requireRole` middleware with admin role support

3. **backend/src/controllers/adminController.js** (NEW)
   - `getOverview` - Dashboard overview stats
   - `getUsers` - Paginated user list with filters
   - `toggleUserBlock` - Block/unblock users
   - `deleteUser` - Delete users
   - `getAtRiskStudents` - Students with CGPA < 6.0 or no marksheets
   - `getSkillTrends` - Top 10 skills from resumes
   - `getGrowthAnalytics` - Analytics for charts

4. **backend/src/routes/adminRoutes.js** (NEW)
   - All admin routes with protection

5. **backend/src/server.js**
   - Added admin routes mount: `app.use("/api/admin", adminRoutes)`

### API Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/overview | Dashboard statistics |
| GET | /api/admin/users | Paginated user list |
| PATCH | /api/admin/users/:id/block | Block/unblock user |
| DELETE | /api/admin/users/:id | Delete user |
| GET | /api/admin/students/at-risk | At-risk students |
| GET | /api/admin/skill-trends | Top 10 skills |
| GET | /api/admin/analytics/growth | Growth analytics |

## Frontend Implementation

### Files Created:

1. **frontend/src/api/admin.js** - Admin API service
2. **frontend/src/pages/admin/AdminLayout.jsx** - Admin sidebar + topbar
3. **frontend/src/pages/admin/AdminDashboard.jsx** - Overview cards
4. **frontend/src/pages/admin/Users.jsx** - User management table
5. **frontend/src/pages/admin/Students.jsx** - All students list
6. **frontend/src/pages/admin/Recruiters.jsx** - All recruiters list
7. **frontend/src/pages/admin/Analytics.jsx** - Charts (recharts)
8. **frontend/src/pages/admin/SkillTrends.jsx** - Skills bar chart
9. **frontend/src/pages/admin/RiskStudents.jsx** - At-risk students table

### Files Modified:

1. **frontend/src/App.jsx** - Added admin routes
2. **frontend/src/components/ProtectedRoute.jsx** - Admin role support

## How to Create an Admin User

Since there's no UI to create admin users, you need to do it directly in MongoDB:

```javascript
// Using MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { 
    $set: { 
      role: "admin",
      isBlocked: false 
    } 
  }
)
```

Or via a seed script:

```javascript
// backend/src/seed/createAdmin.js
import User from "../models/User.js";

const createAdmin = async () => {
  const admin = await User.create({
    name: "Admin",
    email: "admin@campus2career.com",
    password: "admin123", // Change this!
    role: "admin",
    isProfileCompleted: true
  });
  console.log("Admin created:", admin.email);
};

createAdmin();
```

## Accessing Admin Dashboard

1. Log in with an admin account
2. Navigate to `/admin/dashboard`
3. If you don't have admin role, you'll be redirected to your appropriate dashboard

## Features

### Dashboard Overview
- Total users, students, recruiters
- Total resumes and marksheets uploaded
- Active users in last 7 days

### User Management
- View all users with pagination
- Filter by role (student, recruiter, admin)
- Filter by status (active, blocked)
- Search by name or email
- Block/unblock users
- Delete users (with cascading delete for students)

### Analytics
- User growth chart
- Resume upload trends
- Marksheet upload trends
- Date range selector (7, 30, 90 days)

### Skill Trends
- Top 10 skills from resumes
- Visual bar chart
- Detailed table view

### At-Risk Students
- Students with CGPA < 6.0
- Students with no marksheets uploaded
- Risk reason badges

## Running the Application

```bash
# Backend
cd backend
npm run dev

# Frontend  
cd frontend
npm run dev
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

