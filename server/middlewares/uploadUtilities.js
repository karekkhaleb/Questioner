import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = 'upload/';
    fs.mkdir(dir, () => cb(null, 'upload/'));
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb({ message: 'unsupported image format' }, false);
  }
};
const upload = multer({
  storage,
  fileFilter,
}).single('meetupImage');

export default {
  upload,
};
