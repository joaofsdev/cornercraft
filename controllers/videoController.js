const path = require('path');

const mostrarVideos = (req, res) => {
    const db = req.app.get('db');
    const categoriaSelecionada = req.query.categoria || '';
    let query = 'SELECT v.*, u.nome AS nome_usuario FROM videos v JOIN usuarios u ON v.usuario_id = u.id';
    let params = [];

    if (categoriaSelecionada) {
        query += ' JOIN video_categorias vc ON v.id = vc.video_id WHERE vc.categoria_id = ?';
        params.push(categoriaSelecionada);
    }

    query += ' ORDER BY v.criado_em DESC';

    db.query(query, params, (erro, videos) => {
        if (erro) {
            console.error('Erro ao buscar vídeos:', erro);
            return res.status(500).render('videos', { usuario: req.session.usuario, videos: [], categorias: [], categoriaSelecionada: '', erro: 'Erro ao buscar vídeos' });
        }

        db.query('SELECT * FROM categorias', (erro, categorias) => {
            if (erro) {
                console.error('Erro ao buscar categorias:', erro);
                return res.status(500).render('videos', { usuario: req.session.usuario, videos: [], categorias: [], categoriaSelecionada: '', erro: 'Erro ao buscar categorias' });
            }
            res.render('videos', { usuario: req.session.usuario, videos, categorias, categoriaSelecionada, erro: null });
        });
    });
};

const mostrarPublicar = (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/auth/login');
    }
    const db = req.app.get('db');
    db.query('SELECT * FROM categorias', (erro, categorias) => {
        if (erro) {
            console.error('Erro ao buscar categorias:', erro);
            return res.status(500).render('publicar', { usuario: req.session.usuario, categorias: [], erro: 'Erro ao buscar categorias' });
        }
        res.render('publicar', { usuario: req.session.usuario, categorias, erro: null });
    });
};

const processarPublicar = (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/auth/login');
    }

    const { titulo, descricao, categorias } = req.body;
    const videoFile = req.files['video'] ? req.files['video'][0] : null;
    const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;
    const usuarioId = req.session.usuario.id;

    if (!titulo || !videoFile || !categorias) {
        const db = req.app.get('db');
        db.query('SELECT * FROM categorias', (erro, categorias) => {
            if (erro) return res.status(400).render('publicar', { usuario: req.session.usuario, categorias: [], erro: 'Erro ao buscar categorias' });
            return res.status(400).render('publicar', { usuario: req.session.usuario, categorias, erro: 'Título, vídeo e pelo menos uma categoria são obrigatórios' });
        });
        return;
    }

    const caminhoArquivo = videoFile ? `/uploads/${videoFile.filename}` : null;
    const caminhoThumbnail = thumbnailFile ? `/uploads/${thumbnailFile.filename}` : null;

    const db = req.app.get('db');

    db.query(
        'INSERT INTO videos (usuario_id, titulo, descricao, caminho_arquivo, thumbnail) VALUES (?, ?, ?, ?, ?)',
        [usuarioId, titulo, descricao || '', caminhoArquivo, caminhoThumbnail || ''],
        (erro, resultado) => {
            if (erro) {
                console.error('Erro ao inserir vídeo:', erro);
                return res.status(500).render('publicar', { usuario: req.session.usuario, categorias: [], erro: 'Erro ao publicar vídeo' });
            }

            const videoId = resultado.insertId;
            const categoriasArray = Array.isArray(categorias) ? categorias : [categorias];
            const valores = categoriasArray.map(catId => [videoId, catId]);

            db.query('INSERT INTO video_categorias (video_id, categoria_id) VALUES ?', [valores], (erro) => {
                if (erro) {
                    console.error('Erro ao associar categorias:', erro);
                    return res.status(500).render('publicar', { usuario: req.session.usuario, categorias: [], erro: 'Erro ao associar categorias' });
                }
                res.redirect('/videos');
            });
        }
    );
};

const mostrarCategoria = (req, res) => {
    const db = req.app.get('db');
    const categoriaId = req.params.id;

    db.query('SELECT * FROM categorias WHERE id = ?', [categoriaId], (erro, categoria) => {
        if (erro || !categoria[0]) {
            console.error('Erro ao buscar categoria:', erro);
            return res.status(404).render('categoria', { usuario: req.session.usuario, videos: [], categoria: null, erro: 'Categoria não encontrada' });
        }

        db.query(`
            SELECT v.*, u.nome AS nome_usuario 
            FROM videos v 
            JOIN usuarios u ON v.usuario_id = u.id 
            JOIN video_categorias vc ON v.id = vc.video_id 
            WHERE vc.categoria_id = ? 
            ORDER BY v.criado_em DESC
        `, [categoriaId], (erro, videos) => {
            if (erro) {
                console.error('Erro ao buscar vídeos da categoria:', erro);
                return res.status(500).render('categoria', { usuario: req.session.usuario, videos: [], categoria: categoria[0], erro: 'Erro ao buscar vídeos' });
            }
            res.render('categoria', { usuario: req.session.usuario, videos, categoria: categoria[0], erro: null });
        });
    });
};

const mostrarVideo = (req, res) => {
    const db = req.app.get('db');
    const videoId = req.params.id;

    db.query('UPDATE videos SET contagem_visualizacoes = contagem_visualizacoes + 1 WHERE id = ?', [videoId], (erro) => {
        if (erro) {
            console.error('Erro ao atualizar visualizações:', erro);
            return res.status(500).render('video', { usuario: req.session.usuario, video: null, videosSugeridos: [], comentarios: [], likes: 0, deslikes: 0, erro: 'Erro ao carregar vídeo' });
        }

        db.query(
            'SELECT v.*, u.nome AS nome_usuario, c.nome AS categoria FROM videos v LEFT JOIN usuarios u ON v.usuario_id = u.id LEFT JOIN video_categorias vc ON v.id = vc.video_id LEFT JOIN categorias c ON vc.categoria_id = c.id WHERE v.id = ?',
            [videoId],
            (erro, video) => {
                if (erro) {
                    console.error('Erro ao buscar vídeo:', erro);
                    return res.status(500).render('video', { usuario: req.session.usuario, video: null, videosSugeridos: [], comentarios: [], likes: 0, deslikes: 0, erro: 'Erro ao buscar vídeo' });
                }

                console.log('Resultado da busca do vídeo:', video);

                if (!video[0]) {
                    console.log(`Vídeo com ID ${videoId} não encontrado`);
                    return res.status(404).render('404', { usuario: req.session.usuario, erro: 'Vídeo não encontrado' });
                }

                console.log('Caminho do arquivo de vídeo:', video[0].caminho_arquivo);

                db.query(
                    'SELECT v.*, u.nome AS nome_usuario FROM videos v LEFT JOIN usuarios u ON v.usuario_id = u.id LEFT JOIN video_categorias vc ON v.id = vc.video_id WHERE vc.categoria_id IN (SELECT categoria_id FROM video_categorias WHERE video_id = ?) AND v.id != ? ORDER BY RAND() LIMIT 5',
                    [videoId, videoId],
                    (erro, videosSugeridos) => {
                        if (erro) {
                            console.error('Erro ao buscar vídeos sugeridos:', erro);
                            videosSugeridos = [];
                        }

                        db.query(
                            'SELECT c.*, u.nome AS nome_usuario FROM comentarios c LEFT JOIN usuarios u ON c.usuario_id = u.id WHERE c.video_id = ? ORDER BY c.criado_em DESC',
                            [videoId],
                            (erro, comentarios) => {
                                if (erro) {
                                    console.error('Erro ao buscar comentários:', erro);
                                    comentarios = [];
                                }

                                db.query(
                                    'SELECT tipo, COUNT(*) as total FROM likes WHERE video_id = ? GROUP BY tipo',
                                    [videoId],
                                    (erro, resultados) => {
                                        if (erro) {
                                            console.error('Erro ao buscar likes/deslikes:', erro);
                                            return res.status(500).render('video', { usuario: req.session.usuario, video: null, videosSugeridos: [], comentarios: [], likes: 0, deslikes: 0, erro: 'Erro ao carregar vídeo' });
                                        }

                                        const likes = resultados?.find(r => r.tipo === 'like')?.total || 0;
                                        const deslikes = resultados?.find(r => r.tipo === 'deslike')?.total || 0;

                                        res.render('video', {
                                            usuario: req.session.usuario,
                                            video: video[0],
                                            videosSugeridos: videosSugeridos || [],
                                            comentarios: comentarios || [],
                                            likes,
                                            deslikes,
                                            erro: null
                                        });
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    });
};

const adicionarComentario = (req, res) => {
    if (!req.session.usuario) return res.redirect('/auth/login');

    const videoId = req.params.id;
    const { comentario } = req.body;
    const usuarioId = req.session.usuario.id;

    if (!comentario) return res.redirect(`/videos/video/${videoId}`);

    const db = req.app.get('db');
    db.query(
        'INSERT INTO comentarios (video_id, usuario_id, comentario, criado_em) VALUES (?, ?, ?, NOW())',
        [videoId, usuarioId, comentario],
        (erro) => {
            if (erro) {
                console.error('Erro ao adicionar comentário:', erro);
            }
            res.redirect(`/videos/video/${videoId}`);
        }
    );
};

const darLike = (req, res) => {
    if (!req.session.usuario) return res.json({ success: false, message: 'Usuário não autenticado' });

    const videoId = req.params.id;
    const usuarioId = req.session.usuario.id;

    const db = req.app.get('db');
    db.query(
        'INSERT INTO likes (video_id, usuario_id, tipo) VALUES (?, ?, "like") ON DUPLICATE KEY UPDATE tipo = "like"',
        [videoId, usuarioId],
        (erro) => {
            if (erro) {
                console.error('Erro ao adicionar like:', erro);
                return res.json({ success: false });
            }
            res.json({ success: true });
        }
    );
};

const darDeslike = (req, res) => {
    if (!req.session.usuario) return res.json({ success: false, message: 'Usuário não autenticado' });

    const videoId = req.params.id;
    const usuarioId = req.session.usuario.id;

    const db = req.app.get('db');
    db.query(
        'INSERT INTO likes (video_id, usuario_id, tipo) VALUES (?, ?, "deslike") ON DUPLICATE KEY UPDATE tipo = "deslike"',
        [videoId, usuarioId],
        (erro) => {
            if (erro) {
                console.error('Erro ao adicionar deslike:', erro);
                return res.json({ success: false });
            }
            res.json({ success: true });
        }
    );
};

module.exports = {
    mostrarVideos,
    mostrarPublicar,
    processarPublicar,
    mostrarCategoria,
    mostrarVideo,
    adicionarComentario,
    darLike,
    darDeslike
};