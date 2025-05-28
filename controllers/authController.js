const bcrypt = require('bcrypt');

exports.mostrarLogin = (req, res) => {
    res.render('login', { usuario: req.session.usuario, erro: null });
};

exports.processarLogin = (req, res) => {
    const { email, senha } = req.body;
    const db = req.app.get('db');

    if (!email || !senha) {
        return res.render('login', { usuario: req.session.usuario, erro: 'Email e senha são obrigatórios' });
    }

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (erro, resultados) => {
        if (erro || resultados.length === 0) {
            return res.render('login', { usuario: req.session.usuario, erro: 'Email ou senha inválidos' });
        }

        const usuario = resultados[0];
        bcrypt.compare(senha, usuario.senha, (erro, coincide) => {
            if (erro || !coincide) {
                return res.render('login', { usuario: req.session.usuario, erro: 'Email ou senha inválidos' });
            }

            req.session.usuario = usuario;
            res.redirect('/');
        });
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

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (erro, resultados) => {
        if (erro) return res.render('registrar', { usuario: req.session.usuario, erro: 'Erro ao verificar email' });
        if (resultados.length > 0) {
            return res.render('registrar', { usuario: req.session.usuario, erro: 'Email já registrado' });
        }

        bcrypt.hash(senha, 10, (erro, hash) => {
            if (erro) return res.render('registrar', { usuario: req.session.usuario, erro: 'Erro ao criar conta' });

            db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hash], (erro) => {
                if (erro) return res.render('registrar', { usuario: req.session.usuario, erro: 'Erro ao criar conta' });
                res.redirect('/auth/login');
            });
        });
    });
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.redirect('/auth/login');
    });
};