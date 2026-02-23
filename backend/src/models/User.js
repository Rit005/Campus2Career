import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  // Authentication Fields
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // unique: true creates an index automatically
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    nullable: true, 
    select: false 
  },
  
  role: {
    type: String,
    enum: {
      values: ['student', 'recruiter', 'admin',null],
      message: 'Role must be either "student" or "recruiter"'
    },
    default: null,
    index: true
  },
  
  googleId: {
    type: String,
    sparse: true
  },
  githubId: {
    type: String,
    sparse: true
  },
  

  isProfileCompleted: {
    type: Boolean,
    default: false
  },
  
  isBlocked: {
    type: Boolean,
    default: false
  },
  
  studentProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile',
    default: null
  },
  recruiterProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecruiterProfile',
    default: null
  },

  cgpa: {
    type: Number,
    min: 0,
    max: 10,
    default: null
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.index({ role: 1, isProfileCompleted: 1 });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.password === null) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.hasRole = function() {
  return this.role !== null && this.role !== undefined;
};

userSchema.methods.toPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    isProfileCompleted: this.isProfileCompleted,
    createdAt: this.createdAt
  };
};

userSchema.statics.findOrCreateGoogleUser = async function(profile) {
  let user = await this.findOne({ googleId: profile.googleId });
  
  if (!user) {
    user = await this.findOne({ email: profile.email });
    
    if (user) {
      user.googleId = profile.googleId;
      await user.save();
    } else {
      user = await this.create({
        name: profile.name,
        email: profile.email,
        password: null,
        googleId: profile.googleId,
        role: null,
        isProfileCompleted: false
      });
    }
  }
  
  return user;
};

userSchema.statics.findOrCreateGithubUser = async function(profile) {
  let user = await this.findOne({ githubId: profile.githubId });
  
  if (!user) {
    user = await this.findOne({ email: profile.email });
    
    if (user) {
      user.githubId = profile.githubId;
      await user.save();
    } else {
      user = await this.create({
        name: profile.name,
        email: profile.email,
        password: null,
        githubId: profile.githubId,
        role: null,
        isProfileCompleted: false
      });
    }
  }
  
  return user;
};


userSchema.index({ name: 'text', email: 'text' });

const User = mongoose.model('User', userSchema);

export default User;
