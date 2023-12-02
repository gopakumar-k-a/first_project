// config/multerConfig.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/admin-assets/uploads');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const datePrefix = Date.now();
    cb(null, `${datePrefix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
