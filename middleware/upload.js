const multer = require('multer');
const fs = require('fs');
const path = require('path');

const FILE_TYPE_MAP = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/webp': 'webp'
};


const uploadFolder = path.join(__dirname, '../public/image');


if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// ตั้งค่าการเก็บไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = isValid ? null : new Error('Invalid file type');
        cb(uploadError, uploadFolder);
    },
    filename: (req, file, cb) => {
        const ext = FILE_TYPE_MAP[file.mimetype];
        const newName = `img_${Date.now()}.${ext}`;
        cb(null, newName);
    }
});


const uploadOption = multer({ storage });

module.exports = uploadOption;
