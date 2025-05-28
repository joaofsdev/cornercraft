const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, process.env.UPLOAD_PATH),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const extensoesPermitidas = ['.mp4'];
        const extensao = path.extname(file.originalname).toLowerCase();
        if (extensoesPermitidas.includes(extensao)) cb(null, true);
        else cb(new Error('Apenas arquivos MP4 são permitidos'));
    }
});

module.exports = upload;