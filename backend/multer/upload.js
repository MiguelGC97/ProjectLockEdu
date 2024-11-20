const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        const filetype = '';
        if(file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if(file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if(file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});

const upload = multer({storage: storage});

module.exports = upload;