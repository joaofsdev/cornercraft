const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const upload = require('../middleware/upload');

// Middleware para capturar erros do Multer
const handleUpload = (req, res, next) => {
    upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }])(req, res, (err) => {
        if (err) {
            req.fileValidationError = err;
            return next();
        }
        next();
    });
};

router.get('/', videoController.mostrarVideos);
router.get('/publicar', videoController.mostrarPublicar);
router.post('/publicar', handleUpload, videoController.processarPublicar);
router.get('/categoria/:id', videoController.mostrarCategoria);
router.get('/video/:id', videoController.mostrarVideo);
router.post('/video/:id/comentario', videoController.adicionarComentario);
router.post('/video/:id/like', videoController.darLike);
router.post('/video/:id/deslike', videoController.darDeslike);

module.exports = router;