const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.mostrarLogin = (req, res) => {
    res.render('login', { usuario: req.session.usuario, erro: null });
};

exports.processarLogin = (req, res) => {
    const { email, senha } = req.body;
    const db = req.app.get('db');

    if (!email || !senha) {
        return res.render('login', { usuario: req.session.usuario, erro: 'Email e senha são obrigatórios' });
    }

    db.query('SELECT * FROM usuarios WHERE email = ?', [email])
        .then(([resultados]) => {
            if (!resultados.length) {
                return res.render('login', { usuario: req.session.usuario, erro: 'Email ou senha inválidos' });
            }
            const usuario = resultados[0];
            return bcrypt.compare(senha, usuario.senha).then((coincide) => {
                if (!coincide) {
                    return res.render('login', { usuario: req.session.usuario, erro: 'Email ou senha inválidos' });
                }
                req.session.usuario = usuario;
                res.redirect('/');
            });
        })
        .catch((erro) => {
            console.error('Erro ao processar login:', erro);
            res.render('login', { usuario: req.session.usuario, erro: 'Erro ao processar login' });
        });
};

exports.mostrarRegistrar = (req, res) => {
    res.render('registrar', { usuario: req.session.usuario, erro: null });
};

exports.processarRegistrar = (req, res) => {
    const { nome, email, senha } = req.body;
    const db = req.app.get('db');

    if (!nome || !email || !senha) {
        return res.render('registrar', { usuario: req.session.usuario, erro: 'Todos os campos são obrigatórios' });
    }

    db.query('SELECT * FROM usuarios WHERE email = ?', [email])
        .then(([resultados]) => {
            if (resultados.length > 0) {
                return res.render('registrar', { usuario: req.session.usuario, erro: 'Email já registrado' });
            }
            return bcrypt.hash(senha, 10);
        })
        .then((hash) => {
            return db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hash]);
        })
        .then(() => {
            res.redirect('/auth/login');
        })
        .catch((erro) => {
            console.error('Erro ao registrar:', erro);
            res.render('registrar', { usuario: req.session.usuario, erro: 'Erro ao criar conta' });
        });
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir sessão:', err);
            return res.redirect('/');
        }
        res.redirect('/auth/login');
    });
};