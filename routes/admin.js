const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

if (!adminController || typeof adminController.index !== 'function') {
    console.error('Erro: adminController.index não é uma função ou não foi importado', adminController);
    throw new Error('Falha na importação de adminController');
}
if (!authMiddleware || typeof authMiddleware.verificarToken !== 'function') {
    console.error('Erro: authMiddleware.verificarToken não é uma função ou não foi importado', authMiddleware);
    throw new Error('Falha na importação de authMiddleware');
}

router.get('/admin', authMiddleware.verificarToken, adminController.index);

module.exports = router;