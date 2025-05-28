exports.mostrarDashboard = (req, res) => {
    const db = req.app.get('db');
    const dados = {};

    db.query('SELECT COUNT(*) AS total FROM usuarios', (erro, resultado) => {
        if (erro) return res.render('admin', { usuario: req.session.usuario, dados: {}, erro: 'Erro ao buscar dados' });
        dados.total_usuarios = resultado[0].total;

        db.query('SELECT COUNT(*) AS total FROM videos', (erro, resultado) => {
            if (erro) return res.render('admin', { usuario: req.session.usuario, dados: {}, erro: 'Erro ao buscar dados' });
            dados.total_videos = resultado[0].total;

            db.query('SELECT SUM(contagem_visualizacoes) AS total FROM videos', (erro, resultado) => {
                if (erro) return res.render('admin', { usuario: req.session.usuario, dados: {}, erro: 'Erro ao buscar dados' });
                dados.total_visualizacoes = resultado[0].total || 0;

                db.query(`
                    SELECT c.nome AS nome_categoria, COUNT(vc.video_id) AS contagem 
                    FROM categorias c 
                    LEFT JOIN video_categorias vc ON c.id = vc.categoria_id 
                    GROUP BY c.id, c.nome 
                    ORDER BY contagem DESC 
                    LIMIT 5
                `, (erro, resultado) => {
                    if (erro) return res.render('admin', { usuario: req.session.usuario, dados: {}, erro: 'Erro ao buscar dados' });
                    dados.categorias_populares = resultado || [];
                    res.render('admin', { usuario: req.session.usuario, dados, erro: null });
                });
            });
        });
    });
};