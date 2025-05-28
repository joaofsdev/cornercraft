const path = require('path');

exports.mostrarVideos = (req, res) => {
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

exports.mostrarPublicar = (req, res) => {
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

exports.processarPublicar = (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/auth/login');
    }

    const { titulo, descricao, categorias } = req.body;
    const arquivo = req.file;
    const usuarioId = req.session.usuario.id;

    if (!titulo || !arquivo || !categorias) {
        const db = req.app.get('db');
        db.query('SELECT * FROM categorias', (erro, categorias) => {
            if (erro) return res.status(400).render('publicar', { usuario: req.session.usuario, categorias: [], erro: 'Erro ao buscar categorias' });
            return res.status(400).render('publicar', { usuario: req.session.usuario, categorias, erro: 'Título, vídeo e pelo menos uma categoria são obrigatórios' });
        });
        return;
    }

    const caminhoArquivo = `/uploads/${arquivo.filename}`;
    const db = req.app.get('db');

    db.query('INSERT INTO videos (usuario_id, titulo, descricao, caminho_arquivo) VALUES (?, ?, ?, ?)', 
        [usuarioId, titulo, descricao || '', caminhoArquivo], (erro, resultado) => {
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
    });
};

exports.mostrarCategoria = (req, res) => {
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

exports.mostrarVideo = (req, res) => {
    const db = req.app.get('db');
    const videoId = req.params.id;

    console.log(`Acessando vídeo com ID: ${videoId}`); 

    db.query('UPDATE videos SET contagem_visualizacoes = contagem_visualizacoes + 1 WHERE id = ?', [videoId], (erro) => {
        if (erro) {
            console.error('Erro ao atualizar visualizações:', erro);
            return res.status(500).render('video', { usuario: req.session.usuario, video: null, videosSugeridos: [], comentarios: [], likes: 0, deslikes: 0, erro: 'Erro ao carregar vídeo' });
        }

        db.query('SELECT v.*, u.nome AS nome_usuario FROM videos v LEFT JOIN usuarios u ON v.usuario_id = u.id WHERE v.id = ?', [videoId], (erro, video) => {
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

            db.query('SELECT v.*, u.nome AS nome_usuario FROM videos v LEFT JOIN usuarios u ON v.usuario_id = u.id WHERE v.id != ? ORDER BY RAND() LIMIT 5', [videoId], (erro, videosSugeridos) => {
                if (erro) {
                    console.error('Erro ao buscar vídeos sugeridos:', erro);
                    videosSugeridos = [];
                }

                db.query('SELECT c.*, u.nome AS nome_usuario FROM comentarios c LEFT JOIN usuarios u ON c.usuario_id = u.id WHERE c.video_id = ? ORDER BY c.criado_em DESC', [videoId], (erro, comentarios) => {
                    if (erro) {
                        console.error('Erro ao buscar comentários:', erro);
                        comentarios = [];
                    }

                    db.query('SELECT tipo, COUNT(*) as total FROM likes WHERE video_id = ? GROUP BY tipo', [videoId], (erro, resultados) => {
                        if (erro) {
                            console.error('Erro ao buscar likes/deslikes:', erro);
                            return res.status(500).render('video', { usuario: req.session.usuario, video: null, videosSugeridos: [], comentarios: [], likes: 0, deslikes: 0, erro: 'Erro ao carregar vídeo' });
                        }

                        const likes = resultados?.find(r => r.tipo === 'like')?.total || 0;
                        const deslikes = resultados?.find(r => r.tipo === 'deslike')?.total || 0;

                        console.log('Renderizando vídeo:', video[0]); 

                        res.render('video', { 
                            usuario: req.session.usuario, 
                            video: video[0], 
                            videosSugeridos: videosSugeridos || [], 
                            comentarios: comentarios || [], 
                            likes, 
                            deslikes, 
                            erro: null 
                        });
                    });
                });
            });
        });
    });
};

exports.adicionarComentario = (req, res) => {
    if (!req.session.usuario) return res.redirect('/auth/login');

    const videoId = req.params.id;
    const { comentario } = req.body;
    const usuarioId = req.session.usuario.id;

    if (!comentario) return res.redirect(`/video/${videoId}`);

    const db = req.app.get('db');
    db.query('INSERT INTO comentarios (video_id, usuario_id, comentario) VALUES (?, ?, ?)', [videoId, usuarioId, comentario], (erro) => {
        if (erro) {
            console.error('Erro ao adicionar comentário:', erro);
        }
        res.redirect(`/video/${videoId}`);
    });
};

exports.darLike = (req, res) => {
    if (!req.session.usuario) return res.redirect('/auth/login');

    const videoId = req.params.id;
    const usuarioId = req.session.usuario.id;
    const tipo = req.path.includes('like') ? 'like' : 'deslike';

    const db = req.app.get('db');
    db.query('INSERT INTO likes (video_id, usuario_id, tipo) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE tipo = ?', 
        [videoId, usuarioId, tipo, tipo], (erro) => {
        if (erro) {
            console.error('Erro ao adicionar like/deslike:', erro);
        }
        res.redirect(`/video/${videoId}`);
    });
};