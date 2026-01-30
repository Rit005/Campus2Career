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

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create account with role=null
    const user = await User.create({
      name,
      email,
      password,
      role: null,
      isProfileCompleted: false
    });

    const token = generateToken(user._id, user.role);
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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'Please login with Google or GitHub instead'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);
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
 * @desc    Logout
 * @route   POST /auth/logout
 * @access  Public
 */
export const logout = async (req, res, next) => {
  try {
    clearTokenCookie(res);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
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
      data: { user: user.toPublicProfile() }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify token
 * @route   GET /auth/verify
 * @access  Public
 */
export const verifyToken = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: { user: user.toPublicProfile() }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

/**
 * @desc    Select or change dashboard role
 * @route   POST /auth/select-role
 * @access  Private
 */
export const selectRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !['student', 'recruiter'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Please select student or recruiter'
      });
    }

    // Always allow role selection (your requirement)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    user.isProfileCompleted = true;
    await user.save();

    const newToken = generateToken(user._id, user.role);
    sendTokenCookie(res, newToken);

    const redirectPath = role === 'student' ? '/student/dashboard' : '/recruiter/dashboard';

    res.status(200).json({
      success: true,
      message: `Role updated to ${role}`,
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
      data: { user: user.toPublicProfile() }
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
