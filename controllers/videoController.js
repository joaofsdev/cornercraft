const path = require('path');

const mostrarVideos = async (req, res) => {
    console.log('--- Iniciando videoController.mostrarVideos ---');
    const db = req.app.get('db');
    const categoriaSelecionada = req.query.categoria || '';
    const usuarioId = req.session.usuario ? req.session.usuario.id : null;

    let query = 'SELECT v.*, u.nome AS nome_usuario FROM videos v JOIN usuarios u ON v.usuario_id = u.id JOIN video_categorias vc ON v.id = vc.video_id JOIN categorias c ON vc.categoria_id = c.id WHERE v.aprovado = TRUE';
    const params = [];

    if (categoriaSelecionada) {
        query += ' AND vc.categoria_id = ?';
        params.push(categoriaSelecionada);
    }

    query += ' ORDER BY v.criado_em DESC';

    try {
        const [videos] = await db.query(query, params);
        const [categorias] = await db.query('SELECT * FROM categorias');
        let concluidos = [];
        if (usuarioId) {
            const [concluidosRows] = await db.query('SELECT video_id FROM projetos_concluidos WHERE usuario_id = ?', [usuarioId]);
            concluidos = concluidosRows.map(row => row.video_id);
        }
        console.log('Categorias recuperadas:', categorias.map(c => c.nome_categoria));
        if (!categorias.length) console.log('Nenhuma categoria encontrada no banco!');
        res.render('videos', { usuario: req.session.usuario, videos, categorias, categoriaSelecionada, erro: null, concluidos });
    } catch (erro) {
        console.error('Erro ao buscar vídeos ou categorias:', erro);
        res.status(500).render('videos', { usuario: req.session.usuario, videos: [], categorias: [], categoriaSelecionada: '', erro: 'Erro ao buscar vídeos', concluidos: [] });
    }
};

const mostrarPublicar = async (req, res) => {
    console.log('--- Iniciando videoController.mostrarPublicar ---');
    if (!req.session.usuario) {
        return res.redirect('/auth/login');
    }
    const db = req.app.get('db');
    try {
        const [categorias] = await db.query('SELECT * FROM categorias');
        console.log('Categorias para publicação:', categorias.map(c => c.nome_categoria));
        if (!categorias.length) console.log('Nenhuma categoria disponível para publicação!');
        res.render('publicar', { usuario: req.session.usuario, categorias, erro: null });
    } catch (erro) {
        console.error('Erro ao buscar categorias:', erro);
        res.status(500).render('publicar', { usuario: req.session.usuario, categorias: [], erro: 'Erro ao buscar categorias' });
    }
};

const processarPublicar = async (req, res) => {
    console.log('--- Iniciando videoController.processarPublicar ---');
    if (!req.session.usuario) {
        return res.redirect('/auth/login');
    }

    const { titulo, descricao, categorias } = req.body;
    const videoFile = req.files['video'] ? req.files['video'][0] : null;
    const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;
    const usuarioId = req.session.usuario.id;

    if (!titulo || !videoFile || !categorias) {
        const [categoriasList] = await req.app.get('db').query('SELECT * FROM categorias');
        return res.status(400).render('publicar', { usuario: req.session.usuario, categorias: categoriesList, erro: 'Título, vídeo e pelo menos uma categoria são obrigatórios' });
    }

    const caminhoArquivo = videoFile ? `/uploads/${videoFile.filename}` : null;
    const caminhoThumbnail = thumbnailFile ? `/uploads/${thumbnailFile.filename}` : null;

    const db = req.app.get('db');
    try {
        const [result] = await db.query(
            'INSERT INTO videos (usuario_id, titulo, descricao, caminho_arquivo, thumbnail) VALUES (?, ?, ?, ?, ?)',
            [usuarioId, titulo, descricao || '', caminhoArquivo, caminhoThumbnail || '']
        );
        const videoId = result.insertId;
        let categoriasArray = Array.isArray(categorias) ? categorias : [categorias];
        categoriasArray = categoriasArray.map((catId) => Number(catId));
        const valores = categoriasArray.map((catId) => [videoId, catId]);
        console.log('Valores para video_categorias:', valores);
        if (valores.length > 0) {
            await db.query('INSERT INTO video_categorias (video_id, categoria_id) VALUES ?', [valores]);
        }
        console.log('Vídeo publicado com sucesso:', videoId);
        res.redirect('/videos');
    } catch (erro) {
        console.error('Erro ao processar publicação:', erro);
        res.status(500).render('publicar', { usuario: req.session.usuario, categorias: [], erro: 'Erro ao publicar vídeo' });
    }
};

const mostrarCategoria = async (req, res) => {
    console.log('--- Iniciando videoController.mostrarCategoria ---');
    const db = req.app.get('db');
    const categoriaId = req.params.id;
    const usuarioId = req.session.usuario ? req.session.usuario.id : null;

    try {
        const [categoria] = await db.query('SELECT * FROM categorias WHERE id = ?', [categoriaId]);
        if (!categoria.length) {
            console.log(`Categoria com ID ${categoriaId} não encontrada`);
            return res.status(404).render('categoria', { usuario: req.session.usuario, videos: [], categoria: null, erro: 'Categoria não encontrada', concluidos: [] });
        }
        console.log('Categoria encontrada:', categoria[0].nome_categoria);

        let [videos] = await db.query(
            'SELECT v.*, u.nome AS nome_usuario FROM videos v JOIN usuarios u ON v.usuario_id = u.id JOIN video_categorias vc ON v.id = vc.video_id WHERE vc.categoria_id = ? AND v.aprovado = TRUE ORDER BY v.criado_em DESC',
            [categoriaId]
        );
        let concluidos = [];
        if (usuarioId) {
            const [concluidosRows] = await db.query('SELECT video_id FROM projetos_concluidos WHERE usuario_id = ?', [usuarioId]);
            concluidos = concluidosRows.map(row => row.video_id);
        }
        if (!videos.length) console.log('Nenhum vídeo encontrado para esta categoria');
        res.render('categoria', { usuario: req.session.usuario, videos, categoria: categoria[0], erro: null, concluidos });
    } catch (erro) {
        console.error('Erro ao buscar categoria ou vídeos:', erro);
        res.status(500).render('categoria', { usuario: req.session.usuario, videos: [], categoria: null, erro: 'Erro ao buscar vídeos', concluidos: [] });
    }
};

const mostrarVideo = async (req, res) => {
    console.log('--- Iniciando videoController.mostrarVideo ---');
    const db = req.app.get('db');
    const videoId = req.params.id;
    const usuarioId = req.session.usuario ? req.session.usuario.id : null;

    try {
        await db.query('UPDATE videos SET contagem_visualizacoes = contagem_visualizacoes + 1 WHERE id = ?', [videoId]);
        const [video] = await db.query(
            'SELECT v.*, u.nome AS nome_usuario, c.nome_categoria AS categoria FROM videos v LEFT JOIN usuarios u ON v.usuario_id = u.id LEFT JOIN video_categorias vc ON v.id = vc.video_id LEFT JOIN categorias c ON vc.categoria_id = c.id WHERE v.id = ? AND v.aprovado = TRUE',
            [videoId]
        );

        if (!video.length) {
            return res.status(404).render('404', { usuario: req.session.usuario, erro: 'Vídeo não encontrado' });
        }

        let concluido = false;
        if (usuarioId) {
            const [concluidoRows] = await db.query('SELECT 1 FROM projetos_concluidos WHERE usuario_id = ? AND video_id = ?', [usuarioId, videoId]);
            concluido = concluidoRows.length > 0;
        }

        const [videosSugeridos] = await db.query(
            'SELECT v.*, u.nome AS nome_usuario FROM videos v LEFT JOIN usuarios u ON v.usuario_id = u.id LEFT JOIN video_categorias vc ON v.id = vc.video_id WHERE vc.categoria_id IN (SELECT categoria_id FROM video_categorias WHERE video_id = ?) AND v.id != ? AND v.aprovado = TRUE ORDER BY RAND() LIMIT 5',
            [videoId, videoId]
        );
        const [comentarios] = await db.query(
            'SELECT c.*, u.nome AS nome_usuario FROM comentarios c LEFT JOIN usuarios u ON c.usuario_id = u.id WHERE c.video_id = ? ORDER BY c.criado_em DESC',
            [videoId]
        );
        const [resultados] = await db.query(
            'SELECT tipo, COUNT(*) as total FROM likes WHERE video_id = ? GROUP BY tipo',
            [videoId]
        );
        const likes = resultados?.find((r) => r.tipo === 'like')?.total || 0;
        const deslikes = resultados?.find((r) => r.tipo === 'deslike')?.total || 0;

        console.log('Vídeo carregado:', video[0].id);
        res.render('video', { usuario: req.session.usuario, video: video[0], videosSugeridos, comentarios, likes, deslikes, erro: null, concluido });
    } catch (erro) {
        console.error('Erro ao carregar vídeo:', erro);
        res.status(500).render('video', { usuario: req.session.usuario, video: null, videosSugeridos: [], comentarios: [], likes: 0, deslikes: 0, erro: 'Erro ao carregar vídeo', concluido: false });
    }
};

const adicionarComentario = async (req, res) => {
    console.log('--- Iniciando videoController.adicionarComentario ---');
    if (!req.session.usuario) return res.redirect('/auth/login');

    const videoId = req.params.id;
    const { comentario } = req.body;
    const usuarioId = req.session.usuario.id;

    if (!comentario) return res.redirect(`/videos/video/${videoId}`);

    const db = req.app.get('db');
    try {
        await db.query('INSERT INTO comentarios (video_id, usuario_id, comentario, criado_em) VALUES (?, ?, ?, NOW())', [videoId, usuarioId, comentario]);
        console.log('Comentário adicionado com sucesso');
        res.redirect(`/videos/video/${videoId}`);
    } catch (erro) {
        console.error('Erro ao adicionar comentário:', erro);
        res.redirect(`/videos/video/${videoId}`);
    }
};

const darLike = async (req, res) => {
    console.log('--- Iniciando videoController.darLike ---');
    if (!req.session.usuario) return res.json({ success: false, message: 'Usuário não autenticado' });

    const videoId = req.params.id;
    const usuarioId = req.session.usuario.id;

    const db = req.app.get('db');
    try {
        await db.query('INSERT INTO likes (video_id, usuario_id, tipo) VALUES (?, ?, "like") ON DUPLICATE KEY UPDATE tipo = "like"', [videoId, usuarioId]);
        console.log('Like adicionado com sucesso');
        res.json({ success: true });
    } catch (erro) {
        console.error('Erro ao adicionar like:', erro);
        res.json({ success: false });
    }
};

const darDeslike = async (req, res) => {
    console.log('--- Iniciando videoController.darDeslike ---');
    if (!req.session.usuario) return res.json({ success: false, message: 'Usuário não autenticado' });

    const videoId = req.params.id;
    const usuarioId = req.session.usuario.id;

    const db = req.app.get('db');
    try {
        await db.query('INSERT INTO likes (video_id, usuario_id, tipo) VALUES (?, ?, "deslike") ON DUPLICATE KEY UPDATE tipo = "deslike"', [videoId, usuarioId]);
        console.log('Deslike adicionado com sucesso');
        res.json({ success: true });
    } catch (erro) {
        console.error('Erro ao adicionar deslike:', erro);
        res.json({ success: false });
    }
};

const marcarProjetoConcluido = async (req, res) => {
    console.log('--- Iniciando videoController.marcarProjetoConcluido ---');
    if (!req.session.usuario) return res.json({ success: false, message: 'Usuário não autenticado' });

    const videoId = req.body.videoId;
    const usuarioId = req.session.usuario.id;

    const db = req.app.get('db');
    try {
        await db.query('INSERT INTO projetos_concluidos (usuario_id, video_id, foto_criacao) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE foto_criacao = ?', [usuarioId, videoId, '', '']);
        console.log('Projeto marcado como concluído:', { usuarioId, videoId });
        res.json({ success: true });
    } catch (erro) {
        console.error('Erro ao marcar projeto concluído:', erro);
        res.json({ success: false });
    }
};

const uploadFotoCriacao = async (req, res) => {
    console.log('--- Iniciando videoController.uploadFotoCriacao ---');
    if (!req.session.usuario) return res.redirect('/auth/login');

    const videoId = req.params.id;
    const foto = req.file?.filename ? `/uploads/${req.file.filename}` : '';
    const usuarioId = req.session.usuario.id;

    const db = req.app.get('db');
    try {
        await db.query('INSERT INTO projetos_concluidos (usuario_id, video_id, foto_criacao) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE foto_criacao = ?', [usuarioId, videoId, foto, foto]);
        console.log('Foto de criação enviada com sucesso:', { usuarioId, videoId, foto });
        res.redirect(`/videos/video/${videoId}`);
    } catch (erro) {
        console.error('Erro ao upload de foto:', erro);
        res.redirect(`/videos/video/${videoId}`);
    }
};

module.exports = {
    mostrarVideos,
    mostrarPublicar,
    processarPublicar,
    mostrarCategoria,
    mostrarVideo,
    adicionarComentario,
    darLike,
    darDeslike,
    marcarProjetoConcluido,
    uploadFotoCriacao,
};