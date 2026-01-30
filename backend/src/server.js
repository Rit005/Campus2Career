import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/authRoutes.js";

// Middlewares
import { errorHandler, notFound } from "./middleware/errorHandler.js";

// Passport config
import "./config/passport.js";

// ================== ENV CONFIG ==================
dotenv.config();

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
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// ================== PASSPORT ==================
app.use(passport.initialize());
app.use(passport.session());

// ================== HEALTH CHECK ==================
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    time: new Date().toISOString(),
  });
});

// ================== ROUTES ==================
app.use("/auth", authRoutes);

// ================== PRODUCTION STATIC FILES ==================
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../../frontend/dist/index.html")
    );
  });
}

// ================== 404 HANDLER ==================
app.use(notFound);

// ================== GLOBAL ERROR HANDLER ==================
app.use(errorHandler);

// ================== DATABASE CONNECTION ==================
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/campus2career";

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(
        `🚀 Server running in ${
          process.env.NODE_ENV || "development"
        } mode on port ${PORT}`
      );
      console.log(
        `🖥️ Frontend: ${process.env.FRONTEND_URL || "http://localhost:5173"}`
      );
      console.log(
        `🔗 Backend: ${process.env.BACKEND_URL || "http://localhost:5000"}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// ================== PROCESS HANDLERS ==================
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
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
        console.log("✅ MongoDB closed");
        process.exit(0);
      });
    });
  }
});

// ================== BOOT ==================
startServer();

export default app;
