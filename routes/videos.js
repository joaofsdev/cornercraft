const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const upload = require('../middleware/upload');

console.log('Carregando routes/videos.js'); // Depuração

const handleUpload = (req, res, next) => {
    upload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
    ])(req, res, (err) => {
        if (err) {
            console.error('Erro no upload:', err.message);
            req.fileValidationError = err;
            return next();
        }
        console.log('Upload de vídeo/thumbnail processado com sucesso');
        next();
    });
};

// Rotas existentes
router.get('/', videoController.mostrarVideos);
router.get('/publicar', videoController.mostrarPublicar);
router.post('/publicar', handleUpload, videoController.processarPublicar);
router.get('/categoria/:id', videoController.mostrarCategoria);
router.get('/video/:id', videoController.mostrarVideo);
router.post('/video/:id/comentario', videoController.adicionarComentario);
router.post('/video/:id/like', videoController.darLike);
router.post('/video/:id/deslike', videoController.darDeslike);

// Novas rotas para usuários
router.post('/marcar-projeto', videoController.marcarProjetoConcluido);
router.post('/upload-foto/:id', upload.single('foto_criacao'), videoController.uploadFotoCriacao);

module.exports = router;