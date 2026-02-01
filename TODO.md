# Campus2Career - Academic & Career Dashboard Implementation

## 📁 Backend Folder Structure

```
backend/src/
├── models/
│   ├── User.js                    (existing)
│   ├── Resume.js                  (existing)
│   ├── Marksheet.js               ✅ NEW
│   ├── AcademicSummary.js         ✅ NEW
│   └── CareerProfile.js           ✅ NEW
├── controllers/
│   ├── authController.js          (existing)
│   ├── resumeController.js        (existing)
│   └── marksheetController.js     ✅ NEW (academic + career)
├── middleware/
│   ├── auth.js                    (existing)
│   ├── upload.js                  (existing)
│   └── uploadMarksheet.js         ✅ NEW
├── routes/
│   ├── authRoutes.js              (existing)
│   └── studentRoutes.js           ✅ UPDATED
├── groqClient.js                  (existing)
└── server.js                      (existing)
```

## 📁 Frontend Files Created

```
frontend/src/
├── api/
│   └── student.js                 ✅ UPDATED
├── pages/
│   └── student/
│       ├── MarksheetUpload.jsx    ✅ NEW
│       ├── AcademicDashboard.jsx  ✅ NEW
│       └── CareerGuidance.jsx     ✅ NEW
└── App.jsx                        ✅ UPDATED
```

## 🔗 API Endpoints

### Marksheet Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/student/marksheet` | Upload marksheet (PDF/DOCX/TXT) |
| GET | `/api/student/marksheet` | Get all marksheets |
| DELETE | `/api/student/marksheet/:id` | Delete marksheet |

### Academic Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student/dashboard/academic` | Get analytics + recommendations |

### Career Guidance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/student/career/analyze` | AI career analysis |
| GET | `/api/student/career/profile` | Get career profile |

## 📊 Sample API Responses

### GET /api/student/dashboard/academic
```json
{
  "success": true,
  "data": {
    "overallPerformance": 82.5,
    "totalSemesters": 4,
    "consistencyScore": 88,
    "semesterTrend": [
      { "semester": "Sem 1", "percentage": 78, "trend": "up" },
      { "semester": "Sem 2", "percentage": 82, "trend": "up" },
      { "semester": "Sem 3", "percentage": 85, "trend": "up" },
      { "semester": "Sem 4", "percentage": 84.5, "trend": "stable" }
    ],
    "subjectWisePerformance": [
      { "subject": "dsa", "average": 92 },
      { "subject": "os", "average": 85 },
      { "subject": "dbms", "average": 78 },
      { "subject": "cn", "average": 75 }
    ],
    "strengths": ["dsa", "os"],
    "weaknesses": ["cn"],
    "recommendations": [
      "Continue focusing on DSA and OS",
      "Dedicate more time to Computer Networks"
    ]
  }
}
```

### POST /api/student/career/analyze
```json
{
  "success": true,
  "data": {
    "careerDomains": [
      { "name": "Software Engineering", "matchScore": 92, "description": "Strong DSA and problem-solving skills" },
      { "name": "Data Science", "matchScore": 78, "description": "Good analytical foundation" }
    ],
    "recommendedRoles": [
      { "title": "Backend Developer", "domain": "Software Engineering", "matchScore": 90, "description": "Build server-side applications" },
      { "title": "SDE II", "domain": "Software Engineering", "matchScore": 88, "description": "Design and implement features" }
    ],
    "skillGaps": [
      { "skill": "Cloud Computing", "importance": "high", "resources": ["AWS Certified", "Azure Fundamentals"] },
      { "skill": "System Design", "importance": "medium", "resources": ["Grokking System Design"] }
    ],
    "recommendedCertifications": [
      { "name": "AWS Solutions Architect", "provider": "Amazon", "priority": "essential" },
      { "name": "MongoDB Developer", "provider": "MongoDB Inc", "priority": "recommended" }
    ],
    "suggestedProjects": [
      { 
        "title": "E-commerce API", 
        "description": "Build a scalable REST API", 
        "difficulty": "intermediate",
        "technologies": ["Node.js", "Express", "MongoDB"],
        "outcome": "Production-ready backend"
      }
    ],
    "learningRoadmap": [
      {
        "phase": "Foundation",
        "duration": "4 weeks",
        "goals": ["Master DSA", "Learn System Design basics"],
        "resources": ["LeetCode", "Grokking System Design"]
      },
      {
        "phase": "Specialization",
        "duration": "6 weeks",
        "goals": ["Learn Cloud services", "Build full-stack projects"],
        "resources": ["AWS Free Tier", "Full-Stack Open"]
      }
    ]
  }
}
```

## 🚀 Routes Added to Navbar

- `/student/marksheet-upload` - Upload marksheets
- `/student/academic-dashboard` - Analytics visualization
- `/student/career-guidance` - AI career analysis

## 🛠️ How to Test

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Login** as student
4. **Upload** a marksheet (PDF/DOCX/TXT)
5. **View** academic dashboard at `/student/academic-dashboard`
6. **Get** career guidance at `/student/career-guidance`

## ✨ Features

- **AI-powered extraction**: Groq LLM parses unstructured marksheets
- **Multiple file formats**: PDF, DOCX, TXT support
- **Auto-save**: Updates existing semester data on re-upload
- **Smart analytics**: Subject averages, strengths, weaknesses
- **Career mapping**: AI suggests roles based on academic profile
- **Learning roadmap**: Phased plan with resources and projects

