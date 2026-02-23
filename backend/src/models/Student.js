import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },

    branch: { type: String },
    year: { type: Number },

    skills: { type: [String], default: [] },
    experienceSummary: { type: String, default: "" },
    education: { type: String, default: "" },
    suitableRoles: { type: [String], default: [] },

    email: { type: String, default: "" },
    phone: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
