# Campus2Career - MongoDB Database Layer

## Overview

This document describes the MongoDB database layer implementation for the Campus2Career authentication system.

## Database Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Database Flow                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. User Registration                                                   │
│     ┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐    │
│     │   Frontend  │────▶│  Signup API │────▶│   MongoDB User      │    │
│     │  Signup Form│     │  /auth/signup│     │   Document Created │    │
│     └─────────────┘     └─────────────┘     │   (role: null)      │    │
│                                              └─────────────────────┘    │
│                                                                         │
│  2. Dashboard Role Selection                                            │
│     ┌──────────────────┐   ┌─────────────────┐   ┌─────────────────┐   │
│     │ ChooseDashboard  │──▶│  /auth/select-  │──▶│  User.role      │   │
│     │  Page            │   │  role           │   │  Updated        │   │
│     └──────────────────┘   └─────────────────┘   └─────────────────┘   │
│                                                                         │
│  3. JWT Token Generation                                                │
│     ┌──────────────────┐   ┌─────────────────┐   ┌─────────────────┐   │
│     │  User Document   │──▶│  JWT Payload    │──▶│  Frontend       │   │
│     │  (with role)     │   │  {id, role}     │   │  LocalStorage   │   │
│     └──────────────────┘   └─────────────────┘   └─────────────────┘   │
│                                                                         │
│  4. Protected Route Access                                              │
│     ┌──────────────────┐   ┌─────────────────┐   ┌─────────────────┐   │
│     │  Frontend Request│──▶│  JWT Verify     │──▶│  Role-based     │   │
│     │  + Bearer Token  │   │  Middleware     │   │  Access Control │   │
│     └──────────────────┘   └─────────────────┘   └─────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## User Schema

### Fields

| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `name` | String | Yes | No | - | User's full name |
| `email` | String | Yes | Yes | - | User's email (lowercase) |
| `password` | String | No | No | null | Hashed password (null for OAuth) |
| `role` | String enum | No | No | null | 'student' or 'recruiter' |
| `googleId` | String | No | No | null | Google OAuth ID |
| `githubId` | String | No | No | null | GitHub OAuth ID |
| `isProfileCompleted` | Boolean | No | No | false | Onboarding status |
| `studentProfile` | ObjectId | No | No | null | Ref to StudentProfile |
| `recruiterProfile` | ObjectId | No | No | null | Ref to RecruiterProfile |
| `createdAt` | Date | Auto | - | - | Document creation timestamp |
| `updatedAt` | Date | Auto | - | - | Last update timestamp |

### Indexes

```javascript
// Single field indexes for OAuth lookups
{ googleId: 1 }
{ githubId: 1 }
{ role: 1 }

// Compound indexes for efficient queries
{ email: 1 }
{ role: 1, isProfileCompleted: 1 }

// Text index for future search functionality
{ name: 'text', email: 'text' }
```

### Example MongoDB Documents

**Local Auth User (after role selection):**
```javascript
{
  "_id": ObjectId("65a123456789abcdef123456"),
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4oQyHN4y6tJE9Edy", // Hashed
  "role": "student",
  "googleId": null,
  "githubId": null,
  "isProfileCompleted": true,
  "studentProfile": ObjectId("65a123456789abcdef123457"),
  "recruiterProfile": null,
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-15T10:35:00Z")
}
```

**Google OAuth User (before role selection):**
```javascript
{
  "_id": ObjectId("65a123456789abcdef123458"),
  "name": "Jane Smith",
  "email": "jane.smith@gmail.com",
  "password": null,
  "role": null,
  "googleId": "123456789012345678901",
  "githubId": null,
  "isProfileCompleted": false,
  "studentProfile": null,
  "recruiterProfile": null,
  "createdAt": ISODate("2024-01-16T14:20:00Z"),
  "updatedAt": ISODate("2024-01-16T14:20:00Z")
}
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/signup` | Public | Register new user |
| POST | `/auth/login` | Public | Login with email/password |
| POST | `/auth/logout` | Public | Logout user |
| GET | `/auth/me` | Private | Get current user |
| GET | `/auth/verify` | Public | Verify JWT token |
| POST | `/auth/select-role` | **Private** | Select dashboard role |
| PUT | `/auth/profile` | Private | Update profile |

### OAuth Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/auth/google` | Public | Initiate Google OAuth |
| GET | `/auth/google/callback` | Public | Google OAuth callback |
| GET | `/auth/github` | Public | Initiate GitHub OAuth |
| GET | `/auth/github/callback` | Public | GitHub OAuth callback |

### Role Selection Endpoint Details

```http
POST /auth/select-role
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "role": "student"  // or "recruiter"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Successfully selected student role. Redirecting to dashboard...",
  "data": {
    "user": {
      "id": "65a123456789abcdef123456",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "student",
      "isProfileCompleted": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "redirectPath": "/student/dashboard"
  }
}
```

**Error Responses:**

*Role already selected (400):*
```json
{
  "success": false,
  "message": "Role has already been selected. Contact support to change your role.",
  "data": {
    "currentRole": "student",
    "redirectPath": "/student/dashboard"
  }
}
```

*Invalid role (400):*
```json
{
  "success": false,
  "message": "Invalid role. Please select either \"student\" or \"recruiter\""
}
```

## JWT Integration

### Token Payload

```javascript
{
  "id": "65a123456789abcdef123456",  // User's MongoDB ObjectId
  "role": "student",                   // 'student' | 'recruiter' | null
  "iat": 1705315800,                   // Issued at timestamp
  "exp": 1705920600                    // Expiration timestamp
}
```

### Token Flow

1. **Signup/Login**: JWT generated with `role: null`
2. **Role Selection**: New JWT generated with updated `role`
3. **Protected Routes**: JWT verified, role extracted for access control

### Middleware Usage

```javascript
import { protect, requireRole } from '../middleware/auth.js';

// Basic protection - requires authentication
router.get('/protected-route', protect, handler);

// Role-based access control
router.post('/student-only', protect, requireRole('student'), handler);
router.post('/recruiter-only', protect, requireRole('recruiter'), handler);

// Multiple allowed roles
router.get('/shared-route', protect, requireRole('student', 'recruiter'), handler);
```

## Password Hashing

- **Algorithm**: bcrypt with salt rounds = 12
- **Password field**: `select: false` for security (not returned in queries)
- **OAuth users**: `password` field is `null`

```javascript
// Password comparison example
const user = await User.findOne({ email }).select('+password');
const isMatch = await user.comparePassword(candidatePassword);
```

## Error Handling

### Mongoose Validation Errors

```javascript
try {
  await User.create(userData);
} catch (error) {
  if (error.name === 'ValidationError') {
    // Handle validation errors
    const messages = Object.values(error.errors).map(e => e.message);
  }
}
```

### Duplicate Key Errors

```javascript
try {
  await User.create(userData);
} catch (error) {
  if (error.code === 11000) {
    // Handle duplicate email
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }
}
```

## Future Scalability

The schema is designed for future expansion:

### Student Profile Sub-document
```javascript
{
  "studentProfile": {
    "university": "MIT",
    "major": "Computer Science",
    "graduationYear": 2025,
    "skills": ["JavaScript", "React", "Node.js"],
    "resumeUrl": "https://...",
    "portfolioUrl": "https://..."
  }
}
```

### Recruiter Profile Sub-document
```javascript
{
  "recruiterProfile": {
    "company": "Google",
    "title": "Senior Recruiter",
    "companySize": "1000+",
    "industry": "Technology",
    "companyWebsite": "https://google.com"
  }
}
```

## Best Practices Implemented

1. **Input Validation**: Mongoose validators on all fields
2. **Security**: Passwords never returned in queries
3. **Indexing**: Optimized indexes for common queries
4. **Error Handling**: Proper error responses for all cases
5. **Scalability**: Schema prepared for profile sub-documents
6. **OAuth Handling**: Separate fields for each provider
7. **Role Protection**: One-time role selection with no overwrites
8. **JWT Integration**: Role included in token payload
