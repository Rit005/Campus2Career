import User from "../models/User.js";
import Resume from "../models/Resume.js";
import Marksheet from "../models/Marksheet.js";
import Student from "../models/Student.js";

export const getOverview = async (req, res) => {
  try {

    const [userCounts, resumeCount, marksheetCount, activeUsers] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 }
          }
        }
      ]),
      Resume.countDocuments(),
      Marksheet.countDocuments(),
      User.countDocuments({
        updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);

    const totalStudents = userCounts.find(u => u._id === 'student')?.count || 0;
    const totalRecruiters = userCounts.find(u => u._id === 'recruiter')?.count || 0;
    const totalUsers = totalStudents + totalRecruiters;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalRecruiters,
        totalResumesUploaded: resumeCount,
        totalMarksheetsUploaded: marksheetCount,
        totalActiveUsers: activeUsers
      }
    });
  } catch (error) {
    console.error("Error in getOverview:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching overview data"
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      status, 
      search
    } = req.query;

    const query = {};


    if (role && ['student', 'recruiter', 'admin'].includes(role)) {
      query.role = role;
    }

    if (status === 'active') {
      query.isBlocked = false;
    } else if (status === 'blocked') {
      query.isBlocked = true;
    }


    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users"
    });
  }
};


export const toggleUserBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { block } = req.body; 

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: "Cannot block admin users"
      });
    }

    user.isBlocked = block !== undefined ? block : !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isBlocked: user.isBlocked
        },
        message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully"
      }
    });
  } catch (error) {
    console.error("Error in toggleUserBlock:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user status"
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: "Cannot delete admin users"
      });
    }


    if (user.role === 'student') {
      await Promise.all([
        Resume.deleteMany({ studentId: user._id }),
        Marksheet.deleteMany({ studentId: user._id }),
        Student.deleteMany({ userId: user._id })
      ]);
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user"
    });
  }
};

export const getAtRiskStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('_id name email cgpa percentage')
      .lean();

    const atRiskStudents = students
      .map(student => {
        const cgpa = student.cgpa != null ? parseFloat(student.cgpa) : null;
        const percentage = student.percentage != null ? parseFloat(student.percentage) : null;
        const isAtRisk = (cgpa !== null && cgpa < 6) || (percentage !== null && percentage < 60);
        
        if (isAtRisk) {
          return {
            _id: student._id,
            name: student.name,
            email: student.email,
            cgpa: cgpa,
            percentage: percentage
          };
        }
        return null;
      })
      .filter(student => student !== null);

    res.status(200).json({
      success: true,
      data: atRiskStudents
    });
  } catch (error) {
    console.error("Error in getAtRiskStudents:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching at-risk students"
    });
  }
};


export const getSkillTrends = async (req, res) => {
  try {
    const skillTrends = await Resume.aggregate([
      { $match: { skills: { $exists: true, $ne: [] } } },
      { $unwind: "$skills" },
      {
        $group: {
          _id: { $toLower: "$skills" },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          skill:  " $_id" ,
          count: 1,
          _id: 0
        }
      }
    ]);

    const resumes = await Resume.find({ skills: { $exists: true, $ne: [] } }).select('skills');
    
    const skillCount = {};
    resumes.forEach(resume => {
      if (resume.skills && Array.isArray(resume.skills)) {
        resume.skills.forEach(skill => {
          const normalizedSkill = skill.toLowerCase().trim();
          skillCount[normalizedSkill] = (skillCount[normalizedSkill] || 0) + 1;
        });
      }
    });

    const sortedSkills = Object.entries(skillCount)
      .map(([skill, count]) => ({ skill: skill.charAt(0).toUpperCase() + skill.slice(1), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: sortedSkills
    });
  } catch (error) {
    console.error("Error in getSkillTrends:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching skill trends"
    });
  }
};

export const getGrowthAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);

  
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          students: {
            $sum: { $cond: [{ $eq: ["$role", "student"] }, 1, 0] }
          },
          recruiters: {
            $sum: { $cond: [{ $eq: ["$role", "recruiter"] }, 1, 0] }
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const resumeUploads = await Resume.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const marksheetUploads = await Marksheet.aggregate([
      {
        $match: {
          uploadedAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$uploadedAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        userGrowth,
        resumeUploads,
        marksheetUploads
      }
    });
  } catch (error) {
    console.error("Error in getGrowthAnalytics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching growth analytics"
    });
  }
};

// Get all admins (for admin profile dropdown)
export const getAdmins = async (req, res) => {
  try {
    // Fetch all users with role === "admin"
    const admins = await User.find({ role: 'admin' })
      .select('name email createdAt isBlocked updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    // Format the response
    const formattedAdmins = admins.map(admin => ({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      createdAt: admin.createdAt,
      isActive: !admin.isBlocked
    }));

    // Get current admin info (from req.user set by middleware)
    const currentAdmin = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    };

    res.status(200).json({
      success: true,
      data: {
        currentAdmin,
        admins: formattedAdmins
      }
    });
  } catch (error) {
    console.error("Error in getAdmins:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching admins"
    });
  }
};

