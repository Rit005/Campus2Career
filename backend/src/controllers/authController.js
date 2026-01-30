import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { 
  generateToken, 
  sendTokenCookie, 
  clearTokenCookie
} from '../middleware/auth.js';

/**
 * @desc    Register a new user
 * @route   POST /auth/signup
 * @access  Public
 */
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user with role: null (user will select role on dashboard)
    const user = await User.create({
      name,
      email,
      password,
      role: null,
      isProfileCompleted: false
    });

    // Generate token with userId and role
    const token = generateToken(user._id, user.role);

    // Send token as cookie
    sendTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: user.toPublicProfile(),
        token
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user with password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user has a password (not OAuth user)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'Please login with Google or GitHub instead'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token with userId and role
    const token = generateToken(user._id, user.role);

    // Send token as cookie
    sendTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toPublicProfile(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /auth/logout
 * @access  Public
 */
export const logout = async (req, res, next) => {
  try {
    clearTokenCookie(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user
 * @route   GET /auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: user.toPublicProfile()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify token (for frontend to check if logged in)
 * @route   GET /auth/verify
 * @access  Public
 */
export const verifyToken = async (req, res, next) => {
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
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.toPublicProfile()
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

/**
 * @desc    Select user role (student or recruiter)
 * @route   POST /auth/select-role
 * @access  Private
 * 
 * This endpoint allows users to select their dashboard role after signup.
 * Once a role is selected, it cannot be changed (business logic).
 * 
 * Flow:
 * 1. Extract userId from verified JWT (via auth middleware)
 * 2. Validate role input ("student" or "recruiter")
 * 3. Check if user already has a role (prevent overwriting)
 * 4. Update user.role in MongoDB
 * 5. Generate new JWT with updated role
 * 6. Return success with redirect path
 */
export const selectRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    // Validate role input
    if (!role || !['student', 'recruiter'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Please select either "student" or "recruiter"'
      });
    }

    // Fetch current user to check if role is already set
    const currentUser = await User.findById(req.user.id);
    
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent overwriting role once set (business rule)
    if (currentUser.hasRole()) {
      return res.status(400).json({
        success: false,
        message: 'Role has already been selected. Contact support to change your role.',
        data: {
          currentRole: currentUser.role,
          redirectPath: currentUser.role === 'student' ? '/student/dashboard' : '/recruiter/dashboard'
        }
      });
    }

    // Update user role in MongoDB
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        role: role,
        isProfileCompleted: true // Mark profile as completed after role selection
      },
      { 
        new: true,           // Return updated document
        runValidators: true  // Validate before saving
      }
    );

    // Generate new JWT with updated role
    const newToken = generateToken(user._id, user.role);

    // Send new token as cookie
    sendTokenCookie(res, newToken);

    // Determine redirect path based on role
    const redirectPath = role === 'student' ? '/student/dashboard' : '/recruiter/dashboard';

    res.status(200).json({
      success: true,
      message: `Successfully selected ${role} role. Redirecting to dashboard...`,
      data: {
        user: user.toPublicProfile(),
        token: newToken,
        redirectPath
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toPublicProfile()
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }
    next(error);
  }
};

