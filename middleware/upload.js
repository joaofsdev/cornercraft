const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, process.env.UPLOAD_PATH),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // Limite geral (será sobrescrito por fileFilter se necessário)
    },
    fileFilter: (req, file, cb) => {
        const extensao = path.extname(file.originalname).toLowerCase();

        if (file.fieldname === 'video') {
            // Validação para o campo 'video'
            const extensoesPermitidas = ['.mp4'];
            if (!extensoesPermitidas.includes(extensao)) {
                return cb(new Error('Apenas arquivos MP4 são permitidos para o vídeo'));
            }
            // Limite de 100 MB para vídeos
            if (file.size > 100 * 1024 * 1024) {
                return cb(new Error('O vídeo excede o limite de 100 MB'));
            }
        } else if (file.fieldname === 'thumbnail') {
            // Validação para o campo 'thumbnail'
            const extensoesPermitidas = ['.jpg', '.jpeg', '.png'];
            if (!extensoesPermitidas.includes(extensao)) {
                return cb(new Error('Apenas arquivos JPG ou PNG são permitidos para a thumbnail'));
            }
            // Limite de 5 MB para thumbnails
            if (file.size > 5 * 1024 * 1024) {
                return cb(new Error('A thumbnail excede o limite de 5 MB'));
            }
        } else {
            return cb(new Error('Campo de arquivo inválido'));
        }

        cb(null, true);
    }
});

module.exports = upload;