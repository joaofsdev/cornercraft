import express from "express";
import adminController from "../controllers/adminController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Dashboard principal do admin
router.get("/admin", authMiddleware.verificarAdmin, adminController.index);

// Adicionar tutorial aprovado
router.post("/admin/adicionar-tutorial", authMiddleware.verificarAdmin, adminController.adicionarTutorial);

// Gerenciamento de categorias
router.get("/admin/gerenciar-categorias", authMiddleware.verificarAdmin, adminController.gerenciarCategorias);
router.post("/admin/adicionar-categoria", authMiddleware.verificarAdmin, adminController.adicionarCategoria);
router.post("/admin/editar-categoria/:id", authMiddleware.verificarAdmin, adminController.editarCategoria);
router.post("/admin/excluir-categoria/:id", authMiddleware.verificarAdmin, adminController.excluirCategoria);

// Moderação de conteúdo
router.get("/admin/moderar", authMiddleware.verificarAdmin, adminController.moderarConteudo);
router.get("/admin/aprovar/:id", authMiddleware.verificarAdmin, adminController.aprovarVideo);
router.get("/admin/banir/:id", authMiddleware.verificarAdmin, adminController.banirUsuario);

export default router;