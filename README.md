 # 🎓 Campus2Career – AI-Powered Academic & Recruitment Platform

Campus2Career is a **full-stack AI-driven platform that bridges students, recruiters, and administrators** into a single intelligent ecosystem.
It analyzes student marksheets, predicts performance, guides career choices, assists in resume building, and empowers recruiters with AI-powered candidate insights.

This is a complete **Academic + Recruitment + AI platform built using the MERN Stack + Groq Llama 3.3 + Custom ML models**

---

# 📌 Purpose of the Project

The platform is designed to:
- Analyze student marksheets using AI
- Predict academic performance & career domain
- Assist students in resume building and career planning
- Allow recruiters to post jobs and see AI-ranked students
- Provide admins with complete platform analytics
The result is a smart, automated, and scalable academic + recruitment solution.

---

## Tech Stack
**Frontend**
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Backend**
![NodeJS](https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**Database**
![MongoDB](https://img.shields.io/badge/MongoDB-4DB33D?style=for-the-badge&logo=mongodb&logoColor=white)

**AI/ML**
![Groq](https://img.shields.io/badge/Groq_AI-000000?style=for-the-badge)
![Llama3.3](https://img.shields.io/badge/Llama_3.3_Model-412991?style=for-the-badge&logo=openai&logoColor=white)
![PDFParse](https://img.shields.io/badge/PDF--Parse-FF5F5F?style=for-the-badge)
![Mammoth](https://img.shields.io/badge/Mammoth_DOCX_Parser-1E90FF?style=for-the-badge)
![CustomML](https://img.shields.io/badge/Custom_ML_Models-orange?style=for-the-badge)

---

# #✨ Features
# 🧑‍🎓 Student Module
- AI-based marksheet parsing (PDF/DOCX → structured data)
- Predicts:
    - Strong domain
    - Weak subjects
    - Academic trend
    - Next-semester percentage
    - Placement probability
- Smart Resume Builder with missing-skill detection
- Personalized higher-studies guidance & improvement roadmap

# 🧑‍💼 Recruiter Module

- Job posting with skill & domain selection
- AI-ranked student recommendations
- Recruiter analytics dashboard
- HR assistant powered by AI

# 🛡 Admin Module
- Monitor students & recruiters
- Platform insights & analytics
- AI recommendations for platform growth

# 🤖 AI Chatbot
- Groq + Llama 3.3 real-time chatbot
- Answers academic, resume, and career-related queries
- Uses student data for personalized responses#

---

## 🏗️ Architecture

- **Frontend (React + Vite + TailwindCSS)**
Dashboards, file uploads, resume UI, chatbot, analytics charts.

- **Backend (Node.js + Express)**
File parsing, AI integration, marksheet processing, ML predictions, job portal, admin logic.

- **Database (MongoDB)**
Students, recruiters, marksheets, jobs, AI insights, resumes.

- **AI Layer**
Groq Llama 3.3 for LLM reasoning, ML models for academic prediction, resume evaluation engine.

---

🏗️ Architecture

Campus2Career uses a modular, AI-first architecture:

Frontend (React + Vite + TailwindCSS)
Dashboards, file uploads, resume UI, chatbot, analytics charts.

Backend (Node.js + Express)
File parsing, AI integration, marksheet processing, ML predictions, job portal, admin logic.

Database (MongoDB)
Students, recruiters, marksheets, jobs, AI insights, resumes.

AI Layer
Groq Llama 3.3 for LLM reasoning, ML models for academic prediction, resume evaluation engine.

---

## How It Works
- Student uploads marksheet (PDF / DOCX).
- Backend extracts text using pdf-parse / mammoth.
- AI parses and structures marksheet data.
- ML models compute:
    - Domain prediction
    - Weak subjects
    - Improvement roadmap
    - Next-semester prediction
- Recruiters see AI-ranked candidates for each job.
- AI chatbot provides personalized guidance.

---
### Run Project

# Backend 
```bash
cd backend
# Install dependencies
npm install
# Create environment file
touch .env.local
# Add API URL to .env.local
echo "VITE_API_URL=http://localhost:5000" > .env.local
# Start development server
npm run dev
```
# Frontend

```bash
cd frontend
# Install dependencies
npm install
# Start development server
npm run dev

Then open : `http://localhost:5000` 
```

---


<hr style="border: 1px solid white; margin-top: 20px;">

<h1 style="color:#1E90FF;">UI Screenshots</h1>

<h3 style="color:#1E90FF;">Student Dashboard</h3>
<img src="./screenshots/Student_Dashboard.png"  />

<h3 style="color:#1E90FF;"> Upload Marksheet</h3>
<img src="./screenshots/Marksheet.png" />

<h3 style="color:#1E90FF;">Resume Analyzer</h3>
<img src="./screenshots/Resume.png" />

<h3 style="color:#1E90FF;">Career</h3>
<img src="./screenshots/career.png" />

<h3 style="color:#1E90FF;">Recruiter Dashboard</h3>
<img src="./screenshots/Recruiter_Dashboard.png"  />

<h3 style="color:#1E90FF;">Jobs</h3>
<img src="./screenshots/Job_Matching.png"  />

<h3 style="color:#1E90FF;">Recruiter Analytics</h3>
<img src="./screenshots/Analytics.png" />

<h3 style="color:#1E90FF;">Assistance</h3>
<img src="./screenshots/Assistance.png"  />

<h3 style="color:#1E90FF;">Admin Dashboard</h3>
<img src="./screenshots/Admin_Dashboard.png"  />

<h3 style="color:#1E90FF;">User Management</h3>
<img src="./screenshots/Admin_user.png"  />

<h3 style="color:#1E90FF;">Admin Analytics</h3>
<img src="./screenshots/Admin_analytics.png"  />
