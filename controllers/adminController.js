import bcrypt from "bcrypt";
import { getPool } from "../config/database.js";

class AdminController {
  /**
   * Exibe o dashboard do administrador
   */
  async index(req, res) {
    if (!req.session.usuario || !req.session.usuario.id) {
      return res.redirect("/auth/login");
    }

    const db = getPool();

    try {
      const [[usuario]] = await db.query("SELECT papel FROM usuarios WHERE id = ?", [req.session.usuario.id]);

      if (!usuario || usuario.papel !== "admin") {
        return res.redirect("/videos");
      }

      // Executa consultas em paralelo
      const [
        [usuariosCount],
        [videosCount],
        [viewsCount],
        [categoriasPopulares]
      ] = await Promise.all([
        db.query("SELECT COUNT(*) as total_usuarios FROM usuarios"),
        db.query("SELECT COUNT(*) as total_videos FROM videos WHERE aprovado = TRUE"),
        db.query("SELECT SUM(contagem_visualizacoes) as total_visualizacoes FROM videos"),
        db.query(`
          SELECT c.nome_categoria, COUNT(vc.video_id) as contagem
          FROM categorias c
          LEFT JOIN video_categorias vc ON c.id = vc.categoria_id
          GROUP BY c.id, c.nome_categoria
          ORDER BY contagem DESC
          LIMIT 5
        `)
      ]);

      const dados = {
        total_usuarios: usuariosCount[0]?.total_usuarios || 0,
        total_videos: videosCount[0]?.total_videos || 0,
        total_visualizacoes: viewsCount[0]?.total_visualizacoes || 0,
        categorias_populares: categoriasPopulares || []
      };

      const [usuarios] = await db.query("SELECT id, nome, email, papel FROM usuarios");

      res.render("admin", {
        usuario: req.session.usuario,
        erro: null,
        usuarios,
        dados
      });

    } catch (err) {
      console.error("Erro inesperado no dashboard:", err);
      res.status(500).render("admin", {
        usuario: req.session.usuario,
        erro: "Erro ao carregar dashboard",
        usuarios: [],
        dados: {}
      });
    }
  }

  /**
   * Adiciona um tutorial aprovado diretamente pelo admin
   */
  async adicionarTutorial(req, res) {
    const { categorias, titulo, descricao } = req.body;
    const db = getPool();

    if (!categorias || !titulo) return res.redirect("/admin");

    try {
      const [result] = await db.query(
        "INSERT INTO videos (usuario_id, titulo, descricao, caminho_arquivo, thumbnail, aprovado) VALUES (?, ?, ?, ?, ?, TRUE)",
        [req.session.usuario.id, titulo, descricao || "", "", ""]
      );

      const videoId = result.insertId;

      const categoriasArray = (Array.isArray(categorias) ? categorias : [categorias])
        .map(Number)
        .filter(Boolean);

      if (categoriasArray.length > 0) {
        const valores = categoriasArray.map((catId) => [videoId, catId]);
        await db.query("INSERT INTO video_categorias (video_id, categoria_id) VALUES ?", [valores]);
      }

      res.redirect("/admin");
    } catch (err) {
      console.error("Erro ao adicionar tutorial:", err);
      res.redirect("/admin");
    }
  }

  /**
   * Página de gerenciamento de categorias
   */
  async gerenciarCategorias(req, res) {
    const db = getPool();

    try {
      const [categorias] = await db.query("SELECT * FROM categorias");
      res.render("gerenciar_categorias", {
        usuario: req.session.usuario,
        erro: null,
        categorias
      });
    } catch (err) {
      console.error("Erro ao gerenciar categorias:", err);
      res.render("gerenciar_categorias", {
        usuario: req.session.usuario,
        erro: "Erro ao carregar categorias",
        categorias: []
      });
    }
  }

  /**
   * Adiciona uma nova categoria
   */
  async adicionarCategoria(req, res) {
    const { nome_categoria } = req.body;
    if (!nome_categoria) return res.redirect("/admin/gerenciar-categorias");

    const db = getPool();

    try {
      await db.query("INSERT INTO categorias (nome_categoria) VALUES (?)", [nome_categoria]);
      res.redirect("/admin/gerenciar-categorias");
    } catch (err) {
      console.error("Erro ao adicionar categoria:", err);
      res.redirect("/admin/gerenciar-categorias");
    }
  }

  /**
   * Página de moderação de conteúdo
   */
  async moderarConteudo(req, res) {
    const db = getPool();

    try {
      const [videos] = await db.query(`
        SELECT v.*, u.nome AS nome_usuario
        FROM videos v
        JOIN usuarios u ON v.usuario_id = u.id
        WHERE v.aprovado = FALSE
      `);

      const [usuarios] = await db.query('SELECT * FROM usuarios WHERE papel = "usuario"');

      res.render("moderacao", {
        usuario: req.session.usuario,
        erro: null,
        videos,
        usuarios
      });
    } catch (err) {
      console.error("Erro ao moderar conteúdo:", err);
      res.render("moderacao", {
        usuario: req.session.usuario,
        erro: "Erro ao carregar moderação",
        videos: [],
        usuarios: []
      });
    }
  }

  /**
   * Aprova um vídeo
   */
  async aprovarVideo(req, res) {
    const { id: videoId } = req.params;
    const db = getPool();

    try {
      await db.query("UPDATE videos SET aprovado = TRUE WHERE id = ?", [videoId]);
      res.redirect("/admin/moderar");
    } catch (err) {
      console.error("Erro ao aprovar vídeo:", err);
      res.redirect("/admin/moderar");
    }
  }

  /**
   * Bane um usuário (e remove seus comentários)
   */
  async banirUsuario(req, res) {
    const { id: usuarioId } = req.params;
    const db = getPool();

    try {
      await db.query("DELETE FROM comentarios WHERE usuario_id = ?", [usuarioId]);
      await db.query("DELETE FROM usuarios WHERE id = ?", [usuarioId]);
      res.redirect("/admin/moderar");
    } catch (err) {
      console.error("Erro ao banir usuário:", err);
      res.redirect("/admin/moderar");
    }
  }

  /**
   * Edita uma categoria
   */
  async editarCategoria(req, res) {
    const { nome_categoria } = req.body;
    const { id: categoriaId } = req.params;
    const db = getPool();

    if (!nome_categoria) return res.redirect("/admin/gerenciar-categorias");

    try {
      await db.query("UPDATE categorias SET nome_categoria = ? WHERE id = ?", [nome_categoria, categoriaId]);
      res.redirect("/admin/gerenciar-categorias");
    } catch (err) {
      console.error("Erro ao editar categoria:", err);
      res.redirect("/admin/gerenciar-categorias");
    }
  }

  /**
   * Exclui uma categoria
   */
  async excluirCategoria(req, res) {
    const { id: categoriaId } = req.params;
    const db = getPool();

    try {
      await db.query("DELETE FROM categorias WHERE id = ?", [categoriaId]);
      res.redirect("/admin/gerenciar-categorias");
    } catch (err) {
      console.error("Erro ao excluir categoria:", err);
      res.redirect("/admin/gerenciar-categorias");
    }
  }
}

// Exporta uma instância única, igual ao padrão dos outros middlewares/models
export default new AdminController();
