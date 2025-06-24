const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Definindo destino do upload:', process.env.UPLOAD_PATH);
    cb(null, process.env.UPLOAD_PATH || './public/uploads');
  },
  filename: (req, file, cb) => {
    const nomeUnico = `${Date.now()}-${file.originalname}`;
    console.log('Nome do arquivo gerado:', nomeUnico);
    cb(null, nomeUnico);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Limite geral de 100 MB
  },
  fileFilter: (req, file, cb) => {
    const extensao = path.extname(file.originalname).toLowerCase();
    console.log('Arquivo recebido:', file.fieldname, 'Extensão:', extensao);

    if (file.fieldname === 'video') {
      const extensoesPermitidas = ['.mp4'];
      if (!extensoesPermitidas.includes(extensao)) {
        return cb(new Error('Apenas arquivos MP4 são permitidos para o vídeo'));
      }
      if (file.size > 100 * 1024 * 1024) {
        return cb(new Error('O vídeo excede o limite de 100 MB'));
      }
    } else if (file.fieldname === 'thumbnail') {
      const extensoesPermitidas = ['.jpg', '.jpeg', '.png'];
      if (!extensoesPermitidas.includes(extensao)) {
        return cb(new Error('Apenas arquivos JPG ou PNG são permitidos para a thumbnail'));
      }
      if (file.size > 5 * 1024 * 1024) {
        return cb(new Error('A thumbnail excede o limite de 5 MB'));
      }
    } else if (file.fieldname === 'foto_criacao') {
      const extensoesPermitidas = ['.jpg', '.jpeg', '.png'];
      if (!extensoesPermitidas.includes(extensao)) {
        return cb(new Error('Apenas arquivos JPG ou PNG são permitidos para a foto da criação'));
      }
      if (file.size > 10 * 1024 * 1024) {
        return cb(new Error('A foto da criação excede o limite de 10 MB'));
      }
    } else {
      return cb(new Error('Campo de arquivo inválido'));
    }

    cb(null, true);
  },
});

module.exports = upload;