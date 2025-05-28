const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.headers['authorization'] || req.session.token;
    if (!token) return res.redirect('/auth/login');

    jwt.verify(token, process.env.JWT_SEGREDO, (erro, decodificado) => {
        if (erro) {
            req.session.destroy();
            return res.redirect('/auth/login');
        }
        req.usuario = decodificado;
        req.session.usuario = decodificado;
        next();
    });
};

const verificarAdmin = (req, res, next) => {
    if (req.usuario.papel !== 'admin') return res.status(403).send('Acesso restrito a administradores');
    next();
};

module.exports = { verificarToken, verificarAdmin };