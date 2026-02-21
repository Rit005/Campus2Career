// ================== LOAD ENV FIRST ==================
import dotenv from "dotenv";
dotenv.config();

// ================== IMPORTS ==================
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";


// Routes
import authRoutes from "./routes/authRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Middlewares
import { errorHandler, notFound } from "./middleware/errorHandler.js";

// Passport config
import "./config/passport.js";

// ================== __DIRNAME FIX (ESM) ==================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================== APP INIT ==================
const app = express();
let server;

// ================== TRUST PROXY ==================
app.set("trust proxy", 1);

// ================== CORS CONFIG ==================
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ================== BODY PARSER ==================
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ================== COOKIE PARSER ==================
app.use(cookieParser());

// ================== SESSION (FOR OAUTH) ==================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "sessionsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// ================== PASSPORT ==================
app.use(passport.initialize());
app.use(passport.session());

// ================== HEALTH CHECK ROUTE ==================
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    time: new Date().toISOString(),
  });
});

// ================== API ROUTES ==================
app.use("/auth", authRoutes); // Login + Signup
app.use("/api/recruiter", recruiterRoutes); // ALL Recruiter APIs
app.use("/api/student", studentRoutes);
app.use("/admin", adminRoutes); // Admin Dashboard APIs
// ================== PRODUCTION STATIC FILES ==================
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

// ================== 404 HANDLER ==================
app.use(notFound);

// ================== GLOBAL ERROR HANDLER ==================
app.use(errorHandler);

// ================== DATABASE CONNECTION ==================
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoURI) throw new Error("MONGO_URI missing in environment");

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

// ================== START SERVER ==================
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔗 Backend URL: http://localhost:${PORT}`);
      console.log(`🖥️ Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(
        `🔑 GROQ KEY loaded: ${process.env.GROQ_API_KEY ? "YES" : "NO"}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

// ================== PROCESS HANDLERS ==================
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  if (server) server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received. Shutting down...");
  if (server) {
    server.close(() => {
      mongoose.connection.close(false, () => {
        console.log("📦 MongoDB closed");
        process.exit(0);
      });
    });
  }
});

// ================== START ==================
startServer();

export default app;
