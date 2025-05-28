const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const upload = require('../middleware/upload');

router.get('/', videoController.mostrarVideos);
router.get('/publicar', videoController.mostrarPublicar);
router.post('/publicar', upload.single('video'), videoController.processarPublicar);
router.get('/categoria/:id', videoController.mostrarCategoria);
router.get('/video/:id', videoController.mostrarVideo);
router.post('/video/:id/comentario', videoController.adicionarComentario);
router.post('/video/:id/like', videoController.darLike);
router.post('/video/:id/deslike', videoController.darLike);

module.exports = router;