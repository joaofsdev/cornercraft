const bcrypt = require('bcrypt'); // Para hash de senhas em moderação (ex.: redefinir senha)

exports.index = (req, res) => {
    console.log('--- Iniciando adminController.index ---');
    console.log('Sessão do usuário:', req.session.usuario);
    if (!req.session.usuario || !req.session.usuario.id) {
        console.log('Usuário não logado ou ID inválido, redirecionando para /auth/login');
        return res.redirect('/auth/login');
    }

    const db = req.app.get('db');
    console.log('Conexão DB (Pool):', db);

    db.query('SELECT papel FROM usuarios WHERE id = ?', [req.session.usuario.id])
        .then(([results]) => {
            console.log('Resultado da consulta de papel:', results);
            if (!results.length || results[0].papel !== 'admin') {
                console.log('Usuário não é admin ou não encontrado, redirecionando para /videos');
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
                console.log('Dados estatísticos coletados:', { countResult, videoResult, viewResult, catResult });
                const dados = {
                    total_usuarios: countResult[0].total_usuarios || 0,
                    total_videos: videoResult[0].total_videos || 0,
                    total_visualizacoes: viewResult[0].total_visualizacoes || 0,
                    categorias_populares: catResult || []
                };
                return db.query('SELECT id, nome, email, papel FROM usuarios').then(([usuarios]) => {
                    console.log('Lista de usuários:', usuarios);
                    console.log('Renderizando admin.ejs com dados:', { erro: null, usuarios, dados });
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
    console.log('--- Iniciando adminController.adicionarTutorial ---');
    const { categorias, titulo, descricao } = req.body;
    const db = req.app.get('db');
    if (!categorias || !titulo) {
        console.log('Campos obrigatórios faltando:', { categorias, titulo });
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
        console.log('Tutorial adicionado com sucesso');
        res.redirect('/admin');
    } catch (err) {
        console.error('Erro ao adicionar tutorial:', err);
        res.redirect('/admin');
    }
};

exports.gerenciarCategorias = (req, res) => {
    console.log('--- Iniciando adminController.gerenciarCategorias ---');
    const db = req.app.get('db');
    db.query('SELECT * FROM categorias')
        .then(([categorias]) => {
            console.log('Categorias carregadas:', categorias.length);
            res.render('gerenciar_categorias', { usuario: req.session.usuario, erro: null, categorias });
        })
        .catch((err) => {
            console.error('Erro ao gerenciar categorias:', err);
            res.render('gerenciar_categorias', { usuario: req.session.usuario, erro: 'Erro ao carregar categorias', categorias: [] });
        });
};

exports.adicionarCategoria = (req, res) => {
    console.log('--- Iniciando adminController.adicionarCategoria ---');
    const { nome_categoria } = req.body;
    const db = req.app.get('db');
    if (!nome_categoria) {
        console.log('Nome da categoria não fornecido');
        return res.redirect('/admin/gerenciar-categorias');
    }

    db.query('INSERT INTO categorias (nome_categoria) VALUES (?)', [nome_categoria])
        .then(() => {
            console.log('Categoria adicionada:', nome_categoria);
            res.redirect('/admin/gerenciar-categorias');
        })
        .catch((err) => {
            console.error('Erro ao adicionar categoria:', err);
            res.redirect('/admin/gerenciar-categorias');
        });
};

exports.moderarConteudo = (req, res) => {
    console.log('--- Iniciando adminController.moderarConteudo ---');
    const db = req.app.get('db');
    db.query('SELECT v.*, u.nome AS nome_usuario FROM videos v JOIN usuarios u ON v.usuario_id = u.id WHERE v.aprovado = FALSE')
        .then(([videos]) => {
            console.log('Vídeos pendentes encontrados:', videos.length);
            return db.query('SELECT u.* FROM usuarios u WHERE u.papel = "usuario"').then(([usuarios]) => {
                console.log('Usuários comuns encontrados:', usuarios.length);
                res.render('moderacao', { usuario: req.session.usuario, erro: null, videos, usuarios });
            });
        })
        .catch((err) => {
            console.error('Erro ao moderar conteúdo:', err);
            res.render('moderacao', { usuario: req.session.usuario, erro: 'Erro ao carregar moderação', videos: [], usuarios: [] });
        });
};

exports.aprovarVideo = (req, res) => {
    console.log('--- Iniciando adminController.aprovarVideo ---');
    const videoId = req.params.id;
    const db = req.app.get('db');
    db.query('UPDATE videos SET aprovado = TRUE WHERE id = ?', [videoId])
        .then(() => {
            console.log('Vídeo aprovado com ID:', videoId);
            res.redirect('/admin/moderar');
        })
        .catch((err) => {
            console.error('Erro ao aprovar vídeo:', err);
            res.redirect('/admin/moderar');
        });
};

exports.banirUsuario = (req, res) => {
    console.log('--- Iniciando adminController.banirUsuario ---');
    const usuarioId = req.params.id;
    const db = req.app.get('db');
    db.query('DELETE FROM usuarios WHERE id = ?', [usuarioId])
        .then(() => {
            console.log('Usuário banido com ID:', usuarioId);
            res.redirect('/admin/moderar');
        })
        .catch((err) => {
            console.error('Erro ao banir usuário:', err);
            res.redirect('/admin/moderar');
        });
};

exports.editarCategoria = (req, res) => {
    console.log('--- Iniciando adminController.editarCategoria ---');
    const { nome_categoria } = req.body;
    const categoriaId = req.params.id;
    const db = req.app.get('db');
    if (!nome_categoria) {
        console.log('Nome da categoria não fornecido para edição');
        return res.redirect('/admin/gerenciar-categorias');
    }
    db.query('UPDATE categorias SET nome_categoria = ? WHERE id = ?', [nome_categoria, categoriaId])
        .then(() => {
            console.log('Categoria editada:', nome_categoria);
            res.redirect('/admin/gerenciar-categorias');
        })
        .catch((err) => {
            console.error('Erro ao editar categoria:', err);
            res.redirect('/admin/gerenciar-categorias');
        });
};

exports.excluirCategoria = (req, res) => {
    console.log('--- Iniciando adminController.excluirCategoria ---');
    const categoriaId = req.params.id;
    const db = req.app.get('db');
    db.query('DELETE FROM categorias WHERE id = ?', [categoriaId])
        .then(() => {
            console.log('Categoria excluída com ID:', categoriaId);
            res.redirect('/admin/gerenciar-categorias');
        })
        .catch((err) => {
            console.error('Erro ao excluir categoria:', err);
            res.redirect('/admin/gerenciar-categorias');
        });
};