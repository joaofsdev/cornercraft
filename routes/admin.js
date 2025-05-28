const express = require('express');
const { verificarToken, verificarAdmin } = require('../middleware/auth');
const { mostrarDashboard } = require('../controllers/adminController');
const router = express.Router();

router.get('/', [verificarToken, verificarAdmin], mostrarDashboard);

module.exports = router;