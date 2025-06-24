const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    console.log('--- Middleware verificarToken ---');
    const token = req.headers['authorization']?.split(' ')[1] || req.session.token; 
    console.log('Token recebido:', token);
    if (!token) {
        console.log('Token não encontrado, redirecionando para /auth/login');
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
        console.log('Token decodificado:', decodificado);
        req.usuario = decodificado;
        req.session.usuario = decodificado;
        console.log('Sessão atualizada:', req.session);
        next();
    });
};

const verificarAdmin = (req, res, next) => {
    console.log('--- Middleware verificarAdmin ---');
    console.log('Verificando usuário na sessão:', req.session.usuario);
    if (!req.session.usuario) {
        console.log('Usuário não logado, redirecionando para /auth/login');
        return res.redirect('/auth/login');
    }
    if (req.session.usuario.papel !== 'admin') {
        console.log('Acesso restrito: usuário não é admin');
        return res.status(403).send('Acesso restrito a administradores');
    }
    req.usuario = req.session.usuario; // Garante consistência
    console.log('Usuário autorizado como admin:', req.usuario);
    next();
};

module.exports = { verificarToken, verificarAdmin };