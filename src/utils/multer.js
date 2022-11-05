// Packages
import multer from 'multer';
import AppError from './AppError';

const storage = multer.memoryStorage();

const limits = {
  fileSize: 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
  // if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|WEBP|webp)$/)) {
  if (!file.mimetype.startsWith('image/')) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new AppError('Not an image! Please upload only images', 400), false);
  }
  cb(null, true);
};

// eslint-disable-next-line no-unused-vars
const filter = (req, file, type, cb) => {
  if (!file.mimetype.startsWith(type)) {
    req.fileValidationError = `Only ${type} are allowed!`;
    return cb(new AppError(` Not a(n) ${type}! Please upload on ${type}`, 400), false);
  }
  cb(null, true);
};

/**
 * Upload single image
 * @param {String} name
 */
export const singleFile = (name) => (req, res, next) => {
  const upload = multer({
    storage,
    limits,
    fileFilter,
  }).single(name);

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return next(new AppError(`Cannot Upload More Than 1 Image`, 500));
      }
    }

    if (err) return next(new AppError(err, 500));
    next();
  });
};

/**
 * Upload any number of images with any name
 */
export const anyMulter = () => (req, res, next) => {
  const upload = multer({
    storage,
    limits,
    fileFilter,
  }).any();

  upload(req, res, (err) => {
    if (err) return next(new AppError(err, 500));
    next();
  });
};
