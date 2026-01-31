import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  branch: { type: String },
  year: { type: Number },
  skills: [String],
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
