import express from 'express';
import passport from 'passport';
import { 
  signup, 
  login, 
  logout, 
  getMe, 
  verifyToken,
  selectRole,
  updateProfile
} from '../controllers/authController.js';
import { protect, generateToken, sendTokenCookie } from '../middleware/auth.js';

const router = express.Router();

// ============ Local Authentication Routes ============

/**
 * @desc    Register a new user
 * @route   POST /auth/signup
 * @access  Public
 * 
 * Request body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "securepassword123"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Registration successful",
 *   "data": {
 *     "user": { "id": "...", "name": "...", "email": "...", "role": null },
 *     "token": "jwt_token"
 *   }
 * }
 */
router.post('/signup', signup);

/**
 * @desc    Login user
 * @route   POST /auth/login
 * @access  Public
 * 
 * Request body:
 * {
 *   "email": "john@example.com",
 *   "password": "securepassword123"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "data": {
 *     "user": { "id": "...", "name": "...", "email": "...", "role": "student" },
 *     "token": "jwt_token"
 *   }
 * }
 */
router.post('/login', login);

/**
 * @desc    Logout user
 * @route   POST /auth/logout
 * @access  Public
 */
router.post('/logout', logout);

/**
 * @desc    Get current user
 * @route   GET /auth/me
 * @access  Private
 */
router.get('/me', protect, getMe);


router.get('/verify', verifyToken);

router.post('/select-role', protect, selectRole);

router.put('/profile', protect, updateProfile);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);


router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`
  }),
  (req, res) => {
    // Generate JWT with userId and role
    const token = generateToken(req.user._id, req.user.role);
    
    // Send token as cookie
    sendTokenCookie(res, token);
    
    // Redirect to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${token}&provider=google`
    );
  }
);

// ============ GitHub OAuth Routes ============

/**
 * @desc    Initiate GitHub OAuth
 * @route   GET /auth/github
 * @access  Public
 * 
 * Redirects to GitHub for authentication.
 * After successful auth, redirects to /auth/github/callback
 */
router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email']
  })
);

/**
 * @desc    GitHub OAuth callback
 * @route   GET /auth/github/callback
 * @access  Public
 * 
 * Handles the callback from GitHub OAuth.
 * Creates/updates user in database and redirects to frontend with JWT.
 */
router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`
  }),
  (req, res) => {
    // Generate JWT with userId and role
    const token = generateToken(req.user._id, req.user.role);
    
    // Send token as cookie
    sendTokenCookie(res, token);
    
    // Redirect to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${token}&provider=github`
    );
  }
);

export default router;
