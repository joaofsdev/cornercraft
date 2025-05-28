const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.mostrarLogin);
router.post('/login', authController.processarLogin);
router.get('/registrar', authController.mostrarRegistrar);
router.post('/registrar', authController.processarRegistrar);
router.get('/logout', authController.logout);

module.exports = router;