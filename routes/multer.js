const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/uploads")); // save inside /public/uploads
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4() + path.extname(file.originalname); // keep file extension
    cb(null, uniqueName);
  },
});

// File filter (optional, only allow images)
function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

module.exports = upload;
