import jwt from "jsonwebtoken";

class AuthMiddleware {
  /**
   * Verifica se o usuário está autenticado via token JWT
   */
  verificarToken(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1] || req.session.token;
    
    if (!token) {
      return res.redirect("/auth/login");
    }

    jwt.verify(
      token,
      process.env.JWT_SEGREDO || "seu_segredo_aqui",
      (erro, decodificado) => {
        if (erro) {
          console.error("✗ Erro ao verificar token:", erro.message);
          req.session.destroy((err) => {
            if (err) console.error("✗ Erro ao destruir sessão:", err);
            return res.redirect("/auth/login");
          });
          return;
        }
        req.usuario = decodificado;
        req.session.usuario = decodificado;
        next();
      }
    );
  }

  /**
   * Verifica se o usuário tem permissões de administrador
   */
  verificarAdmin(req, res, next) {
    if (!req.session.usuario) {
      return res.redirect("/auth/login");
    }
    
    if (req.session.usuario.papel !== "admin") {
      return res.status(403).render("404", {
        usuario: req.session.usuario,
        erro: "Acesso restrito a administradores"
      });
    }
    
    req.usuario = req.session.usuario;
    next();
  }

  /**
   * Verifica se o usuário está autenticado (qualquer papel)
   */
  verificarAutenticado(req, res, next) {
    if (!req.session.usuario) {
      return res.redirect("/auth/login");
    }
    req.usuario = req.session.usuario;
    next();
  }
}

export default new AuthMiddleware();
