const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Para futura integração com JWT, se desejado

exports.mostrarLogin = (req, res) => {
    console.log('--- Iniciando authController.mostrarLogin ---');
    res.render('login', { usuario: req.session.usuario, erro: null });
};

exports.processarLogin = (req, res) => {
    console.log('--- Iniciando authController.processarLogin ---');
    const { email, senha } = req.body;
    const db = req.app.get('db');

    if (!email || !senha) {
        console.log('Campos obrigatórios faltando:', { email, senha });
        return res.render('login', { usuario: req.session.usuario, erro: 'Email e senha são obrigatórios' });
    }

    db.query('SELECT * FROM usuarios WHERE email = ?', [email])
        .then(([resultados]) => {
            console.log('Resultados da consulta de login:', resultados.length);
            if (!resultados.length) {
                return res.render('login', { usuario: req.session.usuario, erro: 'Email ou senha inválidos' });
            }
            const usuario = resultados[0];
            return bcrypt.compare(senha, usuario.senha).then((coincide) => {
                if (!coincide) {
                    return res.render('login', { usuario: req.session.usuario, erro: 'Email ou senha inválidos' });
                }
                req.session.usuario = usuario;
                console.log('Login bem-sucedido para:', email);
                res.redirect('/');
            });
        })
        .catch((erro) => {
            console.error('Erro ao processar login:', erro);
            res.render('login', { usuario: req.session.usuario, erro: 'Erro ao processar login' });
        });
};

exports.mostrarRegistrar = (req, res) => {
    console.log('--- Iniciando authController.mostrarRegistrar ---');
    res.render('registrar', { usuario: req.session.usuario, erro: null });
};

exports.processarRegistrar = (req, res) => {
    console.log('--- Iniciando authController.processarRegistrar ---');
    const { nome, email, senha } = req.body;
    const db = req.app.get('db');

    if (!nome || !email || !senha) {
        console.log('Campos obrigatórios faltando:', { nome, email, senha });
        return res.render('registrar', { usuario: req.session.usuario, erro: 'Todos os campos são obrigatórios' });
    }

    db.query('SELECT * FROM usuarios WHERE email = ?', [email])
        .then(([resultados]) => {
            console.log('Verificando email existente:', resultados.length);
            if (resultados.length > 0) {
                return res.render('registrar', { usuario: req.session.usuario, erro: 'Email já registrado' });
            }
            return bcrypt.hash(senha, 10);
        })
        .then((hash) => {
            return db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hash]);
        })
        .then(() => {
            console.log('Usuário registrado com sucesso:', email);
            res.redirect('/auth/login');
        })
        .catch((erro) => {
            console.error('Erro ao registrar:', erro);
            res.render('registrar', { usuario: req.session.usuario, erro: 'Erro ao criar conta' });
        });
};

exports.logout = (req, res) => {
    console.log('--- Iniciando authController.logout ---');
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir sessão:', err);
            return res.redirect('/');
        }
        console.log('Sessão destruída, redirecionando para /auth/login');
        res.redirect('/auth/login');
    });
};