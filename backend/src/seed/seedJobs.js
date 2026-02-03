import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "../models/Job.js";

dotenv.config({ path: "./.env" }); // ensure .env loads from backend root

console.log("MONGO_URI ->", process.env.MONGO_URI); // debug

const jobs = [
  {
    jobTitle: "Frontend Developer",
    company: "TechNova",
    jobLocation: "Bangalore",
    salary: "8 LPA",
    requiredSkills: ["React", "JavaScript", "HTML", "CSS"],
    jobDescription: "Build UI components...",
  },
  {
    jobTitle: "Python Backend Engineer",
    company: "CodeCraft",
    jobLocation: "Hyderabad",
    salary: "10 LPA",
    requiredSkills: ["Python", "Django", "MongoDB"],
    jobDescription: "Work on REST APIs...",
  },
  {
    jobTitle: "Full Stack Developer",
    company: "CloudSphere",
    jobLocation: "Remote",
    salary: "12 LPA",
    requiredSkills: ["Node.js", "React", "MongoDB", "Express"],
    jobDescription: "Work on cloud-based full-stack applications.",
  },
  {
    jobTitle: "Java Spring Boot Developer",
    company: "FinEdge Systems",
    jobLocation: "Pune",
    salary: "9 LPA",
    requiredSkills: ["Java", "Spring Boot", "MySQL"],
    jobDescription: "Build enterprise backend systems.",
  },{
  jobTitle: "Data Analyst",
  company: "InsightWorks",
  jobLocation: "Mumbai",
  salary: "7 LPA",
  requiredSkills: ["Python", "SQL", "PowerBI", "Excel"],
  jobDescription: "Analyze datasets and prepare business insights.",
},
{
  jobTitle: "Android Developer",
  company: "AppMinds",
  jobLocation: "Chennai",
  salary: "6.5 LPA",
  requiredSkills: ["Kotlin", "Android Studio", "Firebase"],
  jobDescription: "Develop and maintain Android apps.",
},
{
  jobTitle: "Machine Learning Engineer",
  company: "AI Innovators",
  jobLocation: "Bangalore",
  salary: "14 LPA",
  requiredSkills: ["Python", "TensorFlow", "Pandas", "NumPy"],
  jobDescription: "Build and deploy ML models.",
},
{
  jobTitle: "DevOps Engineer",
  company: "CloudOps Technologies",
  jobLocation: "Hyderabad",
  salary: "13 LPA",
  requiredSkills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
  jobDescription: "Manage cloud deployments and automation.",
},
{
  jobTitle: "Cybersecurity Analyst",
  company: "SecureNet",
  jobLocation: "Delhi",
  salary: "9 LPA",
  requiredSkills: ["Network Security", "Linux", "SIEM", "Firewalls"],
  jobDescription: "Monitor and secure company systems.",
},
{
  jobTitle: "UI/UX Designer",
  company: "PixelCraft",
  jobLocation: "Remote",
  salary: "6 LPA",
  requiredSkills: ["Figma", "Wireframing", "Prototyping"],
  jobDescription: "Design user-friendly interfaces.",
},
{
  jobTitle: "Cloud Architect",
  company: "SkyTech Cloud",
  jobLocation: "Pune",
  salary: "18 LPA",
  requiredSkills: ["AWS", "Azure", "Docker", "Terraform"],
  jobDescription: "Design enterprise-level cloud architectures.",
},
{
  jobTitle: "Mobile App Developer",
  company: "AppHive",
  jobLocation: "Kochi",
  salary: "7.5 LPA",
  requiredSkills: ["Flutter", "Dart", "API Integration"],
  jobDescription: "Develop cross-platform mobile applications.",
},
{
  jobTitle: "Database Administrator",
  company: "DataVault Systems",
  jobLocation: "Noida",
  salary: "8.5 LPA",
  requiredSkills: ["MySQL", "PostgreSQL", "Performance Tuning"],
  jobDescription: "Manage and optimize database systems.",
},
{
  jobTitle: "Game Developer",
  company: "Unity Studios",
  jobLocation: "Bangalore",
  salary: "10 LPA",
  requiredSkills: ["Unity", "C#", "3D Graphics"],
  jobDescription: "Build interactive gaming experiences.",
},
{
  jobTitle: "AI Chatbot Developer",
  company: "BotForge",
  jobLocation: "Remote",
  salary: "11 LPA",
  requiredSkills: ["Node.js", "NLP", "Dialogflow", "Python"],
  jobDescription: "Develop conversational agents.",
},
{
  jobTitle: "Technical Writer",
  company: "DocuTech",
  jobLocation: "Gurugram",
  salary: "5.5 LPA",
  requiredSkills: ["Documentation", "Markdown", "APIs"],
  jobDescription: "Write technical documentation.",
},
{
  jobTitle: "Product Manager",
  company: "VisionSoft",
  jobLocation: "Mumbai",
  salary: "16 LPA",
  requiredSkills: ["Agile", "Roadmaps", "JIRA"],
  jobDescription: "Define product strategy and features.",
},
{
  jobTitle: "QA Automation Engineer",
  company: "TestWorks",
  jobLocation: "Hyderabad",
  salary: "8 LPA",
  requiredSkills: ["Selenium", "Java", "TestNG"],
  jobDescription: "Automate and execute test scripts.",
},
{
  jobTitle: "Network Engineer",
  company: "NetLink",
  jobLocation: "Pune",
  salary: "7 LPA",
  requiredSkills: ["CCNA", "Routing", "Switching"],
  jobDescription: "Maintain and troubleshoot network systems.",
},
{
  jobTitle: "Backend Developer",
  company: "CoreStack",
  jobLocation: "Chennai",
  salary: "9.5 LPA",
  requiredSkills: ["Node.js", "Express", "Redis", "MongoDB"],
  jobDescription: "Develop backend services and microservices.",
},
{
  jobTitle: "Data Engineer",
  company: "DataFlow Corp",
  jobLocation: "Bangalore",
  salary: "15 LPA",
  requiredSkills: ["Python", "Apache Spark", "Airflow"],
  jobDescription: "Build and optimize data pipelines.",
},
{
  jobTitle: "Systems Engineer",
  company: "Infraline",
  jobLocation: "Delhi",
  salary: "6 LPA",
  requiredSkills: ["Linux", "Shell Scripting", "Ansible"],
  jobDescription: "Maintain enterprise systems and automation.",
},
{
  jobTitle: "Embedded Software Engineer",
  company: "MicroTech",
  jobLocation: "Pune",
  salary: "8 LPA",
  requiredSkills: ["C", "C++", "RTOS", "Microcontrollers"],
  jobDescription: "Develop firmware for embedded systems.",
},
{
  jobTitle: "Blockchain Developer",
  company: "ChainLabs",
  jobLocation: "Remote",
  salary: "14 LPA",
  requiredSkills: ["Solidity", "Ethereum", "Web3.js"],
  jobDescription: "Build decentralized applications.",
}

];

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected!");

    console.log("Old jobs removed.");
    await Job.deleteMany({});

    // 👉 Use your REAL recruiter _id
    const realRecruiterId = "697ef0ab2c201f2d780cdc1d";

    // Assign recruiterId to every job
    jobs.forEach((j) => (j.recruiterId = realRecruiterId));

    await Job.insertMany(jobs);

    console.log("Dummy jobs added!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeder Error:", err);
    process.exit(1);
  }
};

seedJobs();
