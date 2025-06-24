const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.session.token; 
    if (!token) {
        return res.redirect('/auth/login');
    }

    jwt.verify(token, process.env.JWT_SEGREDO || 'seu_segredo_aqui', (erro, decodificado) => {
        if (erro) {
            console.error('Erro ao verificar token:', erro.message);
            req.session.destroy((err) => {
                if (err) console.error('Erro ao destruir sessão:', err);
                return res.redirect('/auth/login');
            });
            return;
        }
        req.usuario = decodificado;
        req.session.usuario = decodificado;
        next();
    });
};

const verificarAdmin = (req, res, next) => {
    if (!req.session.usuario) {
        return res.redirect('/auth/login');
    }
    if (req.session.usuario.papel !== 'admin') {
        return res.status(403).send('Acesso restrito a administradores');
    }
    req.usuario = req.session.usuario; // Garante consistência
    next();
};

module.exports = { verificarToken, verificarAdmin };