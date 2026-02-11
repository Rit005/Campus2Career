import multer from "multer";

// ⭐ Store files directly in memory (not on disk)
const storage = multer.memoryStorage();

// ⭐ Allowed MIME types
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOCX, and TXT files are allowed"), false);
  }
};

export const uploadResume = multer({
  storage, // ⬅️ Store file in Buffer (MongoDB friendly)
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});
