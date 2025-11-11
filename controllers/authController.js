import bcrypt from "bcrypt";
import { getPool } from "../config/database.js";

class AuthController {
  /**
   * Exibe a página de login
   */
  async mostrarLogin(req, res) {
    res.render("login", { usuario: req.session.usuario, erro: null });
  }

  /**
   * Processa o login do usuário
   */
  async processarLogin(req, res) {
    const { email, senha } = req.body;
    const db = getPool();

    if (!email || !senha) {
      return res.render("login", {
        usuario: req.session.usuario,
        erro: "Email e senha são obrigatórios"
      });
    }

    try {
      const [resultados] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

      if (!resultados.length) {
        return res.render("login", {
          usuario: req.session.usuario,
          erro: "Email ou senha inválidos"
        });
      }

      const usuario = resultados[0];
      const coincide = await bcrypt.compare(senha, usuario.senha);

      if (!coincide) {
        return res.render("login", {
          usuario: req.session.usuario,
          erro: "Email ou senha inválidos"
        });
      }

      req.session.usuario = usuario;
      res.redirect("/");

    } catch (erro) {
      console.error("Erro ao processar login:", erro);
      res.render("login", {
        usuario: req.session.usuario,
        erro: "Erro ao processar login"
      });
    }
  }

  /**
   * Exibe a página de registro
   */
  async mostrarRegistrar(req, res) {
    res.render("registrar", { usuario: req.session.usuario, erro: null });
  }

  /**
   * Processa o registro de novo usuário
   */
  async processarRegistrar(req, res) {
    const { nome, email, senha } = req.body;
    const db = getPool();

    if (!nome || !email || !senha) {
      return res.render("registrar", {
        usuario: req.session.usuario,
        erro: "Todos os campos são obrigatórios"
      });
    }

    try {
      const [resultados] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

      if (resultados.length > 0) {
        return res.render("registrar", {
          usuario: req.session.usuario,
          erro: "Email já registrado"
        });
      }

      const hash = await bcrypt.hash(senha, 10);
      await db.query("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [nome, email, hash]);

      res.redirect("/auth/login");

    } catch (erro) {
      console.error("Erro ao registrar:", erro);
      res.render("registrar", {
        usuario: req.session.usuario,
        erro: "Erro ao criar conta"
      });
    }
  }

  /**
   * Realiza o logout do usuário
   */
  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Erro ao destruir sessão:", err);
        return res.redirect("/");
      }
      res.redirect("/auth/login");
    });
  }
}

// Exporta uma instância única
export default new AuthController();