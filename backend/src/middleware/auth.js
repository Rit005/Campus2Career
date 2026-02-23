import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;


    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }


    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }


    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized — token missing",
      });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/* ============================================================
   2️⃣ OPTIONAL AUTH
   - If token exists attach user
   - If no token, continue without user
============================================================ */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (user) req.user = user;
      } catch {
        // invalid token - ignore
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   3️⃣ ROLE-BASED ACCESS CONTROL
   - requireRole("student")
   - requireRole("recruiter")
   - requireRole("admin")
============================================================ */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: "User role not selected. Please choose a dashboard.",
      });
    }

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied for role: ${userRole}`,
      });
    }

    next();
  };
};

/* ============================================================
   4️⃣ GENERATE TOKENS
============================================================ */
export const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const generateRefreshToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh",
    { expiresIn: "30d" }
  );
};

/* ============================================================
   5️⃣ SEND TOKEN COOKIE (HTTP-ONLY)
============================================================ */
export const sendTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};



/* ============================================================
   6️⃣ CLEAR TOKEN COOKIE (Logout)
============================================================ */
export const clearTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    expires: new Date(0),
  });
};
