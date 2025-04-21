import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({ storage });

// Middleware to delete file after Cloudinary upload
export const deleteLocalFile = (req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
    }
    next();
};


