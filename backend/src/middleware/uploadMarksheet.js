import multer from "multer";

// ⭐ Store marksheets directly in MongoDB using memory storage
const storage = multer.memoryStorage();

// ⭐ Allowed MIME types
const allowedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain"
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOCX, and TXT files are allowed"), false);
  }
};

// ⭐ FIXED: Named export uploadMarksheet
export const uploadMarksheet = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
