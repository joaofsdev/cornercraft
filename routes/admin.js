const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

console.log('Carregando routes/admin.js'); // Depuração

if (!adminController || typeof adminController.index !== 'function') {
    console.error('Erro: adminController.index não é uma função ou não foi importado', adminController);
    throw new Error('Falha na importação de adminController');
}
if (!authMiddleware || typeof authMiddleware.verificarAdmin !== 'function') {
    console.error('Erro: authMiddleware.verificarAdmin não é uma função ou não foi importado', authMiddleware);
    throw new Error('Falha na importação de authMiddleware');
}

// Rotas existentes
router.get('/admin', authMiddleware.verificarAdmin, adminController.index);

// Novas rotas para gerenciamento de tutoriais
router.post('/admin/adicionar-tutorial', authMiddleware.verificarAdmin, adminController.adicionarTutorial);

// Novas rotas para gerenciamento de categorias
router.get('/admin/gerenciar-categorias', authMiddleware.verificarAdmin, adminController.gerenciarCategorias);
router.post('/admin/adicionar-categoria', authMiddleware.verificarAdmin, adminController.adicionarCategoria);
router.post('/admin/editar-categoria/:id', authMiddleware.verificarAdmin, adminController.editarCategoria);
router.post('/admin/excluir-categoria/:id', authMiddleware.verificarAdmin, adminController.excluirCategoria);

// Novas rotas para moderação
router.get('/admin/moderar', authMiddleware.verificarAdmin, adminController.moderarConteudo);
router.get('/admin/aprovar/:id', authMiddleware.verificarAdmin, adminController.aprovarVideo);
router.get('/admin/banir/:id', authMiddleware.verificarAdmin, adminController.banirUsuario);

module.exports = router;