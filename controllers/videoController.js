import { getPool } from "../config/database.js";

class VideoController {
  /**
   * Exibe a página de vídeos com filtro por categoria
   */
  async mostrarVideos(req, res) {
    const db = getPool();
    const categoriaSelecionada = req.query.categoria || "";
    const usuarioId = req.session.usuario ? req.session.usuario.id : null;

    let query = "SELECT v.*, u.nome AS nome_usuario FROM videos v JOIN usuarios u ON v.usuario_id = u.id JOIN video_categorias vc ON v.id = vc.video_id JOIN categorias c ON vc.categoria_id = c.id WHERE v.aprovado = TRUE";
    const params = [];

    if (categoriaSelecionada) {
      query += " AND vc.categoria_id = ?";
      params.push(categoriaSelecionada);
    }

    query += " ORDER BY v.criado_em DESC";

    try {
      const [videos] = await db.query(query, params);
      const [categorias] = await db.query("SELECT * FROM categorias");
      
      let concluidos = [];
      if (usuarioId) {
        const [concluidosRows] = await db.query("SELECT video_id FROM projetos_concluidos WHERE usuario_id = ?", [usuarioId]);
        concluidos = concluidosRows.map(row => row.video_id);
      }

      res.render("videos", {
        usuario: req.session.usuario,
        videos,
        categorias,
        categoriaSelecionada,
        erro: null,
        concluidos
      });
    } catch (erro) {
      console.error("Erro ao buscar vídeos ou categorias:", erro);
      res.status(500).render("videos", {
        usuario: req.session.usuario,
        videos: [],
        categorias: [],
        categoriaSelecionada: "",
        erro: "Erro ao buscar vídeos",
        concluidos: []
      });
    }
  }

  /**
   * Exibe a página de publicação de vídeo
   */
  async mostrarPublicar(req, res) {
    if (!req.session.usuario) {
      return res.redirect("/auth/login");
    }

    const db = getPool();

    try {
      const [categorias] = await db.query("SELECT * FROM categorias");
      res.render("publicar", {
        usuario: req.session.usuario,
        categorias,
        erro: null
      });
    } catch (erro) {
      console.error("Erro ao buscar categorias:", erro);
      res.status(500).render("publicar", {
        usuario: req.session.usuario,
        categorias: [],
        erro: "Erro ao buscar categorias"
      });
    }
  }

  /**
   * Processa a publicação de um novo vídeo
   */
  async processarPublicar(req, res) {
    if (!req.session.usuario) {
      return res.redirect("/auth/login");
    }

    const { titulo, descricao, categorias } = req.body;
    const videoFile = req.files["video"] ? req.files["video"][0] : null;
    const thumbnailFile = req.files["thumbnail"] ? req.files["thumbnail"][0] : null;
    const usuarioId = req.session.usuario.id;

    if (!titulo || !videoFile || !categorias) {
      const db = getPool();
      const [categoriasList] = await db.query("SELECT * FROM categorias");
      return res.status(400).render("publicar", {
        usuario: req.session.usuario,
        categorias: categoriasList,
        erro: "Título, vídeo e pelo menos uma categoria são obrigatórios"
      });
    }

    const caminhoArquivo = videoFile ? `/uploads/${videoFile.filename}` : null;
    const caminhoThumbnail = thumbnailFile ? `/uploads/${thumbnailFile.filename}` : null;

    const db = getPool();

    try {
      const [result] = await db.query(
        "INSERT INTO videos (usuario_id, titulo, descricao, caminho_arquivo, thumbnail) VALUES (?, ?, ?, ?, ?)",
        [usuarioId, titulo, descricao || "", caminhoArquivo, caminhoThumbnail || ""]
      );

      const videoId = result.insertId;
      let categoriasArray = Array.isArray(categorias) ? categorias : [categorias];
      categoriasArray = categoriasArray.map((catId) => Number(catId));
      const valores = categoriasArray.map((catId) => [videoId, catId]);

      if (valores.length > 0) {
        await db.query("INSERT INTO video_categorias (video_id, categoria_id) VALUES ?", [valores]);
      }

      res.redirect("/videos");
    } catch (erro) {
      console.error("Erro ao processar publicação:", erro);
      res.status(500).render("publicar", {
        usuario: req.session.usuario,
        categorias: [],
        erro: "Erro ao publicar vídeo"
      });
    }
  }

  /**
   * Exibe vídeos de uma categoria específica
   */
  async mostrarCategoria(req, res) {
    const db = getPool();
    const categoriaId = req.params.id;
    const usuarioId = req.session.usuario ? req.session.usuario.id : null;

    try {
      const [categoria] = await db.query("SELECT * FROM categorias WHERE id = ?", [categoriaId]);

      if (!categoria.length) {
        return res.status(404).render("categoria", {
          usuario: req.session.usuario,
          videos: [],
          categoria: null,
          erro: "Categoria não encontrada",
          concluidos: []
        });
      }

      const [videos] = await db.query(
        "SELECT v.*, u.nome AS nome_usuario FROM videos v JOIN usuarios u ON v.usuario_id = u.id JOIN video_categorias vc ON v.id = vc.video_id WHERE vc.categoria_id = ? AND v.aprovado = TRUE ORDER BY v.criado_em DESC",
        [categoriaId]
      );

      let concluidos = [];
      if (usuarioId) {
        const [concluidosRows] = await db.query("SELECT video_id FROM projetos_concluidos WHERE usuario_id = ?", [usuarioId]);
        concluidos = concluidosRows.map(row => row.video_id);
      }

      res.render("categoria", {
        usuario: req.session.usuario,
        videos,
        categoria: categoria[0],
        erro: null,
        concluidos
      });
    } catch (erro) {
      console.error("Erro ao buscar categoria ou vídeos:", erro);
      res.status(500).render("categoria", {
        usuario: req.session.usuario,
        videos: [],
        categoria: null,
        erro: "Erro ao buscar vídeos",
        concluidos: []
      });
    }
  }

  /**
   * Exibe os detalhes de um vídeo específico
   */
  async mostrarVideo(req, res) {
    const db = getPool();
    const videoId = req.params.id;
    const usuarioId = req.session.usuario ? req.session.usuario.id : null;

    try {
      await db.query("UPDATE videos SET contagem_visualizacoes = contagem_visualizacoes + 1 WHERE id = ?", [videoId]);

      const [video] = await db.query(
        "SELECT v.*, u.nome AS nome_usuario, c.nome_categoria AS categoria FROM videos v LEFT JOIN usuarios u ON v.usuario_id = u.id LEFT JOIN video_categorias vc ON v.id = vc.video_id LEFT JOIN categorias c ON vc.categoria_id = c.id WHERE v.id = ? AND v.aprovado = TRUE",
        [videoId]
      );

      if (!video.length) {
        return res.status(404).render("404", {
          usuario: req.session.usuario,
          erro: "Vídeo não encontrado"
        });
      }

      let concluido = false;
      if (usuarioId) {
        const [concluidoRows] = await db.query("SELECT 1 FROM projetos_concluidos WHERE usuario_id = ? AND video_id = ?", [usuarioId, videoId]);
        concluido = concluidoRows.length > 0;
      }

      const [videosSugeridos] = await db.query(
        "SELECT v.*, u.nome AS nome_usuario FROM videos v LEFT JOIN usuarios u ON v.usuario_id = u.id LEFT JOIN video_categorias vc ON v.id = vc.video_id WHERE vc.categoria_id IN (SELECT categoria_id FROM video_categorias WHERE video_id = ?) AND v.id != ? AND v.aprovado = TRUE ORDER BY RAND() LIMIT 5",
        [videoId, videoId]
      );

      const [comentarios] = await db.query(
        "SELECT c.*, u.nome AS nome_usuario FROM comentarios c LEFT JOIN usuarios u ON c.usuario_id = u.id WHERE c.video_id = ? ORDER BY c.criado_em DESC",
        [videoId]
      );

      const [resultados] = await db.query(
        "SELECT tipo, COUNT(*) as total FROM likes WHERE video_id = ? GROUP BY tipo",
        [videoId]
      );

      const likes = resultados?.find((r) => r.tipo === "like")?.total || 0;
      const deslikes = resultados?.find((r) => r.tipo === "deslike")?.total || 0;

      res.render("video", {
        usuario: req.session.usuario,
        video: video[0],
        videosSugeridos,
        comentarios,
        likes,
        deslikes,
        erro: null,
        concluido
      });
    } catch (erro) {
      console.error("Erro ao carregar vídeo:", erro);
      res.status(500).render("video", {
        usuario: req.session.usuario,
        video: null,
        videosSugeridos: [],
        comentarios: [],
        likes: 0,
        deslikes: 0,
        erro: "Erro ao carregar vídeo",
        concluido: false
      });
    }
  }

  /**
   * Adiciona um comentário a um vídeo
   */
  async adicionarComentario(req, res) {
    if (!req.session.usuario) {
      return res.redirect("/auth/login");
    }

    const videoId = req.params.id;
    const { comentario } = req.body;
    const usuarioId = req.session.usuario.id;

    if (!comentario) {
      return res.redirect(`/videos/video/${videoId}`);
    }

    const db = getPool();

    try {
      await db.query("INSERT INTO comentarios (video_id, usuario_id, comentario, criado_em) VALUES (?, ?, ?, NOW())", [videoId, usuarioId, comentario]);
      res.redirect(`/videos/video/${videoId}`);
    } catch (erro) {
      console.error("Erro ao adicionar comentário:", erro);
      res.redirect(`/videos/video/${videoId}`);
    }
  }

  /**
   * Registra um like em um vídeo
   */
  async darLike(req, res) {
    if (!req.session.usuario) {
      return res.json({ success: false, message: "Usuário não autenticado" });
    }

    const videoId = req.params.id;
    const usuarioId = req.session.usuario.id;
    const db = getPool();

    try {
      await db.query('INSERT INTO likes (video_id, usuario_id, tipo) VALUES (?, ?, "like") ON DUPLICATE KEY UPDATE tipo = "like"', [videoId, usuarioId]);
      res.json({ success: true });
    } catch (erro) {
      console.error("Erro ao adicionar like:", erro);
      res.json({ success: false });
    }
  }

  /**
   * Registra um deslike em um vídeo
   */
  async darDeslike(req, res) {
    if (!req.session.usuario) {
      return res.json({ success: false, message: "Usuário não autenticado" });
    }

    const videoId = req.params.id;
    const usuarioId = req.session.usuario.id;
    const db = getPool();

    try {
      await db.query('INSERT INTO likes (video_id, usuario_id, tipo) VALUES (?, ?, "deslike") ON DUPLICATE KEY UPDATE tipo = "deslike"', [videoId, usuarioId]);
      res.json({ success: true });
    } catch (erro) {
      console.error("Erro ao adicionar deslike:", erro);
      res.json({ success: false });
    }
  }

  /**
   * Marca um projeto como concluído
   */
  async marcarProjetoConcluido(req, res) {
    if (!req.session.usuario) {
      return res.json({ success: false, message: "Usuário não autenticado" });
    }

    const videoId = req.body.videoId;
    const usuarioId = req.session.usuario.id;
    const db = getPool();

    try {
      await db.query("INSERT INTO projetos_concluidos (usuario_id, video_id, foto_criacao) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE foto_criacao = ?", [usuarioId, videoId, "", ""]);
      res.json({ success: true });
    } catch (erro) {
      console.error("Erro ao marcar projeto concluído:", erro);
      res.json({ success: false });
    }
  }

  /**
   * Faz upload de uma foto de criação concluída
   */
  async uploadFotoCriacao(req, res) {
    if (!req.session.usuario) {
      return res.redirect("/auth/login");
    }

    const videoId = req.params.id;
    const foto = req.file?.filename ? `/uploads/${req.file.filename}` : "";
    const usuarioId = req.session.usuario.id;
    const db = getPool();

    try {
      await db.query("INSERT INTO projetos_concluidos (usuario_id, video_id, foto_criacao) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE foto_criacao = ?", [usuarioId, videoId, foto, foto]);
      res.redirect(`/videos/video/${videoId}`);
    } catch (erro) {
      console.error("Erro ao upload de foto:", erro);
      res.redirect(`/videos/video/${videoId}`);
    }
  }
}

// Exporta uma instância única
export default new VideoController();