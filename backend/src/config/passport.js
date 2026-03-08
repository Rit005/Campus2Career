import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import { generateToken, sendTokenCookie } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
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

          let user = await User.findOne({ googleId });

          if (user) {
            return done(null, user);
          }

          if (email) {
            user = await User.findOne({ email });
            
            if (user) {
              user.googleId = googleId;
              await user.save();
              return done(null, user);
            }
          }

          user = await User.create({
            name: profile.displayName,
            email: email,
            password: null,
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
} else {
  console.warn(' Google OAuth credentials not found. Google login will be disabled.');
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
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
          const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;

          let user = await User.findOne({ githubId });

          if (user) {
            return done(null, user);
          }

          user = await User.findOne({ email });
          
          if (user) {
            user.githubId = githubId;
            await user.save();
            return done(null, user);
          }

          user = await User.create({
            name: profile.displayName || profile.username,
            email: email,
            password: null, 
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
} else {
  console.warn(' GitHub OAuth credentials not found. GitHub login will be disabled.');
}

export const handleOAuthCallback = (req, res, provider) => {
const token = generateToken(req.user._id);

  sendTokenCookie(res, token);

res.redirect(
  `${process.env.FRONTEND_URL}/choose-dashboard?token=${token}`
);
};

export default passport;