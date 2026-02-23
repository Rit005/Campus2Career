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

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

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
    const token = generateToken(req.user._id, req.user.role);
    
    sendTokenCookie(res, token);
    
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${token}&provider=google`
    );
  }
);

router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email']
  })
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`
  }),
  (req, res) => {
    const token = generateToken(req.user._id, req.user.role);
    
    sendTokenCookie(res, token);
  
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${token}&provider=github`
    );
  }
);

export default router;
