const bcrypt = require('bcrypt');

exports.index = (req, res) => {
    if (!req.session.usuario || !req.session.usuario.id) {
        return res.redirect('/auth/login');
    }

    const db = req.app.get('db');

    db.query('SELECT papel FROM usuarios WHERE id = ?', [req.session.usuario.id])
        .then(([results]) => {
            if (!results.length || results[0].papel !== 'admin') {
                return res.redirect('/videos');
            }

            return Promise.all([
                db.query('SELECT COUNT(*) as total_usuarios FROM usuarios'),
                db.query('SELECT COUNT(*) as total_videos FROM videos WHERE aprovado = TRUE'),
                db.query('SELECT SUM(contagem_visualizacoes) as total_visualizacoes FROM videos'),
                db.query(`SELECT c.nome_categoria, COUNT(vc.video_id) as contagem
                          FROM categorias c
                          LEFT JOIN video_categorias vc ON c.id = vc.categoria_id
                          GROUP BY c.id, c.nome_categoria
                          ORDER BY contagem DESC
                          LIMIT 5`)
            ]).then(([[countResult], [videoResult], [viewResult], [catResult]]) => {
                const dados = {
                    total_usuarios: countResult[0].total_usuarios || 0,
                    total_videos: videoResult[0].total_videos || 0,
                    total_visualizacoes: viewResult[0].total_visualizacoes || 0,
                    categorias_populares: catResult || []
                };
                return db.query('SELECT id, nome, email, papel FROM usuarios').then(([usuarios]) => {
                    res.render('admin', { usuario: req.session.usuario, erro: null, usuarios, dados });
                });
            });
        })
        .catch((err) => {
            console.error('Erro inesperado no dashboard:', err);
            res.status(500).render('admin', { usuario: req.session.usuario, erro: 'Erro ao carregar dashboard', usuarios: [], dados: {} });
        });
};

exports.adicionarTutorial = async (req, res) => {
    const { categorias, titulo, descricao } = req.body;
    const db = req.app.get('db');
    if (!categorias || !titulo) {
        return res.redirect('/admin');
    }
    try {
        const [result] = await db.query(
            'INSERT INTO videos (usuario_id, titulo, descricao, caminho_arquivo, thumbnail, aprovado) VALUES (?, ?, ?, ?, ?, TRUE)',
            [req.session.usuario.id, titulo, descricao || '', '', '',]
        );
        const videoId = result.insertId;
        let categoriasArray = Array.isArray(categorias) ? categorias : [categorias];
        categoriasArray = categoriasArray.map((catId) => Number(catId));
        const valores = categoriasArray.map((catId) => [videoId, catId]);
        if (valores.length > 0) {
            await db.query('INSERT INTO video_categorias (video_id, categoria_id) VALUES ?', [valores]);
        }
        res.redirect('/admin');
    } catch (err) {
        console.error('Erro ao adicionar tutorial:', err);
        res.redirect('/admin');
    }
};

exports.gerenciarCategorias = (req, res) => {
    const db = req.app.get('db');
    db.query('SELECT * FROM categorias')
        .then(([categorias]) => {
            res.render('gerenciar_categorias', { usuario: req.session.usuario, erro: null, categorias });
        })
        .catch((err) => {
            console.error('Erro ao gerenciar categorias:', err);
            res.render('gerenciar_categorias', { usuario: req.session.usuario, erro: 'Erro ao carregar categorias', categorias: [] });
        });
};

exports.adicionarCategoria = (req, res) => {
    const { nome_categoria } = req.body;
    const db = req.app.get('db');
    if (!nome_categoria) {
        return res.redirect('/admin/gerenciar-categorias');
    }

    db.query('INSERT INTO categorias (nome_categoria) VALUES (?)', [nome_categoria])
        .then(() => {
            res.redirect('/admin/gerenciar-categorias');
        })
        .catch((err) => {
            console.error('Erro ao adicionar categoria:', err);
            res.redirect('/admin/gerenciar-categorias');
        });
};

exports.moderarConteudo = (req, res) => {
    const db = req.app.get('db');
    db.query('SELECT v.*, u.nome AS nome_usuario FROM videos v JOIN usuarios u ON v.usuario_id = u.id WHERE v.aprovado = FALSE')
        .then(([videos]) => {
            return db.query('SELECT u.* FROM usuarios u WHERE u.papel = "usuario"').then(([usuarios]) => {
                res.render('moderacao', { usuario: req.session.usuario, erro: null, videos, usuarios });
            });
        })
        .catch((err) => {
            console.error('Erro ao moderar conteúdo:', err);
            res.render('moderacao', { usuario: req.session.usuario, erro: 'Erro ao carregar moderação', videos: [], usuarios: [] });
        });
};

exports.aprovarVideo = (req, res) => {
    const videoId = req.params.id;
    const db = req.app.get('db');
    db.query('UPDATE videos SET aprovado = TRUE WHERE id = ?', [videoId])
        .then(() => {
            res.redirect('/admin/moderar');
        })
        .catch((err) => {
            console.error('Erro ao aprovar vídeo:', err);
            res.redirect('/admin/moderar');
        });
};

exports.banirUsuario = async (req, res) => {
    const usuarioId = req.params.id;
    const db = req.app.get('db');
    try {
        // Deleta os comentários do usuário primeiro
        await db.query('DELETE FROM comentarios WHERE usuario_id = ?', [usuarioId]);
        // Agora deleta o usuário
        await db.query('DELETE FROM usuarios WHERE id = ?', [usuarioId]);
        res.redirect('/admin/moderar');
    } catch (err) {
        console.error('Erro ao banir usuário:', err);
        res.redirect('/admin/moderar');
    }
};

exports.editarCategoria = (req, res) => {
    const { nome_categoria } = req.body;
    const categoriaId = req.params.id;
    const db = req.app.get('db');
    if (!nome_categoria) {
        return res.redirect('/admin/gerenciar-categorias');
    }
    db.query('UPDATE categorias SET nome_categoria = ? WHERE id = ?', [nome_categoria, categoriaId])
        .then(() => {
            res.redirect('/admin/gerenciar-categorias');
        })
        .catch((err) => {
            console.error('Erro ao editar categoria:', err);
            res.redirect('/admin/gerenciar-categorias');
        });
};

exports.excluirCategoria = (req, res) => {
    const categoriaId = req.params.id;
    const db = req.app.get('db');
    db.query('DELETE FROM categorias WHERE id = ?', [categoriaId])
        .then(() => {
            res.redirect('/admin/gerenciar-categorias');
        })
        .catch((err) => {
            console.error('Erro ao excluir categoria:', err);
            res.redirect('/admin/gerenciar-categorias');
        });
};