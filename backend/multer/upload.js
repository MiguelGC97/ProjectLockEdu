const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadFolder = path.join(__dirname, '../public/uploads');

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

const storageBox = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const uniqueName = `box-image-${Date.now()}_${Math.round(Math.random() * 1E9)}${fileExtension}`;
        cb(null, uniqueName);
    },
});

const storageAvatar = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const uniqueName = `avatar-${Date.now()}_${Math.round(Math.random() * 1E9)}${fileExtension}`;
        cb(null, uniqueName);
    },
});

const storageBanner = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const uniqueName = `banner-${Date.now()}_${Math.round(Math.random() * 1E9)}${fileExtension}`;
        cb(null, uniqueName);
    },
});

const uploadBoxImage = multer({
    storage: storageBox,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Formato de imagen no permitido.'), false);
        }
        cb(null, true);
    },
});

const uploadAvatar = multer({
    storage: storageAvatar,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Formato de imagen no permitido.'), false);
        }
        cb(null, true);
    },
});

const uploadBanner = multer({
    storage: storageBanner,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Formato de imagen no permitido.'), false);
        }
        cb(null, true);
    },
});

module.exports = {
    uploadBoxImage,
    uploadAvatar,
    uploadBanner
};
