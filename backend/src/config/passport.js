import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import { generateToken, sendTokenCookie } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5001'}/auth/google/callback`,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0]?.value;

        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId });

        if (user) {
          return done(null, user);
        }

        // Check if user exists with same email
        if (email) {
          user = await User.findOne({ email });
          
          if (user) {
            // Link existing account with Google
            user.googleId = googleId;
            await user.save();
            return done(null, user);
          }
        }

        // Create new Google user
        // Note: role is null by default - user will select on dashboard
        user = await User.create({
          name: profile.displayName,
          email: email,
          password: null, // OAuth users don't have a password
          googleId: googleId,
          role: null,
          isProfileCompleted: false
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5001'}/auth/github/callback`,
      scope: ['user:email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const githubId = profile.id;
        // GitHub might not always provide email
        const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;

        // Check if user already exists with this GitHub ID
        let user = await User.findOne({ githubId });

        if (user) {
          return done(null, user);
        }

        // Check if user exists with same email
        user = await User.findOne({ email });
        
        if (user) {
          // Link existing account with GitHub
          user.githubId = githubId;
          await user.save();
          return done(null, user);
        }

        // Create new GitHub user
        // Note: role is null by default - user will select on dashboard
        user = await User.create({
          name: profile.displayName || profile.username,
          email: email,
          password: null, // OAuth users don't have a password
          githubId: githubId,
          role: null,
          isProfileCompleted: false
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

/**
 * OAuth callback handler helper
 * Generates JWT and redirects to frontend with token
 */
export const handleOAuthCallback = (req, res, provider) => {
const token = generateToken(req.user._id);

  sendTokenCookie(res, token);

  // Redirect to frontend with token in URL for localStorage storage
res.redirect(
  `${process.env.FRONTEND_URL}/choose-dashboard?token=${token}`
);
};

export default passport;