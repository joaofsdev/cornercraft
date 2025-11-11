import express from "express";
import videoController from "../controllers/videoController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/**
 * Middleware para lidar com upload de múltiplos arquivos
 */
const handleUpload = (req, res, next) => {
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      console.error("Erro no upload:", err.message);
      req.fileValidationError = err;
      return next();
    }
    next();
  });
};

// Listagem e filtros
router.get("/", videoController.mostrarVideos);
router.get("/categoria/:id", videoController.mostrarCategoria);

// Publicação de vídeos
router.get("/publicar", videoController.mostrarPublicar);
router.post("/publicar", handleUpload, videoController.processarPublicar);

// Visualização de vídeo
router.get("/video/:id", videoController.mostrarVideo);

// Interações com vídeo
router.post("/video/:id/comentario", videoController.adicionarComentario);
router.post("/video/:id/like", videoController.darLike);
router.post("/video/:id/deslike", videoController.darDeslike);

// Projetos concluídos
router.post("/marcar-projeto", videoController.marcarProjetoConcluido);
router.post("/upload-foto/:id", upload.single("foto_criacao"), videoController.uploadFotoCriacao);

export default router;