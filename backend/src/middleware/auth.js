import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists'
        });
      }

      req.user = user;
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Optional auth - Attach user if token exists but don't require it
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = user;
          
        }
      } catch (error) {
        // Token invalid, but that's okay for optional auth
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based access control middleware
 * 
 * Usage: 
 * requireRole('student')
 * requireRole(['student', 'recruiter'])
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // If no roles specified, allow all authenticated users
    if (!allowedRoles || allowedRoles.length === 0) {
      return next();
    }

  const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: 'Please select a dashboard role first'
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${userRole} role cannot access this resource`
      });
    }

    next();
  };
};

/**
 * Generate JWT token with userId and role
 * 
 * @param {string} userId - MongoDB ObjectId
 * @param {string|null} role - 'student' | 'recruiter' | null
 * @returns {string} JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Generate refresh token (longer expiration)
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh',
    { expiresIn: '30d' }
  );
};

/**
 * Send token as HTTP-only cookie
 */
export const sendTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  res.cookie('token', token, cookieOptions);
};

/**
 * Clear token cookie
 */
export const clearTokenCookie = (res) => {
  res.cookie('token', '', {
    expires: new Date(Date.now() - 1),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
};