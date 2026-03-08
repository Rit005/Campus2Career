import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(), 
  limits: { fileSize: 5 * 1024 * 1024 },
});

// apply job
router.post(
  "/apply",
  authMiddleware,
  upload.single("resume"),
  applyForJob
);
