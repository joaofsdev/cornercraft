import { getPool } from "../config/database.js";

class VideoModel {
  criarThumbnail(caminhoArquivo) {
    return `${caminhoArquivo}-thumbnail.jpg`;
  }

  async salvarVideo(
    usuarioId,
    categorias,
    titulo,
    descricao,
    caminhoArquivo,
    thumbnail
  ) {
    const db = getPool();

    const query =
      "INSERT INTO videos (usuario_id, titulo, descricao, caminho_arquivo, thumbnail, aprovado) VALUES (?, ?, ?, ?, ?, FALSE)";
    const values = [usuarioId, titulo, descricao, caminhoArquivo, thumbnail];

    try {
      const [result] = await db.query(query, values);
      const videoId = result.insertId;

      let categoriasArray = Array.isArray(categorias)
        ? categorias
        : [categorias];
      categoriasArray = categoriasArray
        .map((catId) => Number(catId))
        .filter(Boolean);

      if (categoriasArray.length > 0) {
        const valores = categoriasArray.map((catId) => [videoId, catId]);
        await db.query(
          "INSERT INTO video_categorias (video_id, categoria_id) VALUES ?",
          [valores]
        );
      }

      return videoId;
    } catch (erro) {
      console.error("Erro ao salvar vídeo:", erro);
      throw erro;
    }
  }
  async buscarVideoPorCategoria(categoriaId) {
    const db = getPool();
    const query = `
      SELECT v.*, u.nome AS nome_usuario
      FROM videos v
      JOIN usuarios u ON v.usuario_id = u.id
      JOIN video_categorias vc ON v.id = vc.video_id
      WHERE vc.categoria_id = ? AND v.aprovado = TRUE
      ORDER BY v.criado_em DESC
    `;

    try {
      const [videos] = await db.query(query, [categoriaId]);
      return videos;
    } catch (erro) {
      console.error("Erro ao buscar vídeos por categoria:", erro);
      throw erro;
    }
  }
  async marcarProjetoConcluido(usuarioId, videoId, fotoCriacao = "") {
    const db = getPool();
    const query = `
      INSERT INTO projetos_concluidos (usuario_id, video_id, foto_criacao)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE foto_criacao = VALUES(foto_criacao)
    `;
    const values = [usuarioId, videoId, fotoCriacao];

    try {
      await db.query(query, values);
    } catch (erro) {
      console.error("Erro ao marcar projeto concluído:", erro);
      throw erro;
    }
  }
  async buscarVideoPorId(videoId) {
    const db = getPool();
    const query = `
      SELECT v.*, u.nome AS nome_usuario
      FROM videos v
      JOIN usuarios u ON v.usuario_id = u.id
      WHERE v.id = ? AND v.aprovado = TRUE
    `;

    try {
      const [videos] = await db.query(query, [videoId]);
      return videos[0] || null;
    } catch (erro) {
      console.error("Erro ao buscar vídeo por ID:", erro);
      throw erro;
    }
  }
}

export default new VideoModel();
