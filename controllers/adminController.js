exports.index = (req, res) => {
    if (!req.session.usuario) {
        console.log('Usuário não logado, redirecionando para /auth/login');
        return res.redirect('/auth/login');
    }

    const db = req.app.get('db');

    db.query('SELECT papel FROM usuarios WHERE id = ?', [req.session.usuario.id], (err, results) => {
        if (err) {
            console.error('Erro ao verificar papel no banco:', err);
            return res.redirect('/auth/login'); 
        }
        if (results.length === 0 || results[0].papel !== 'admin') {
            console.log('Usuário não é admin, redirecionando para /videos');
            return res.redirect('/videos');
        }

        db.query('SELECT COUNT(*) as total_usuarios FROM usuarios', (err, countResult) => {
            if (err) {
                console.error('Erro ao contar usuários:', err);
                return res.render('admin', { erro: 'Erro ao buscar dados', usuarios: [], dados: { total_usuarios: 0 } });
            }
            const dados = { total_usuarios: countResult[0].total_usuarios };
            db.query('SELECT id, nome, email, papel FROM usuarios', (err, usuarios) => {
                if (err) {
                    console.error('Erro ao listar usuários:', err);
                    return res.render('admin', { erro: 'Erro ao buscar usuários', usuarios: [], dados });
                }
                console.log('Renderizando admin.ejs com dados:', { erro: null, usuarios, dados });
                res.render('admin', { erro: null, usuarios, dados });
            });
        });
    });
};