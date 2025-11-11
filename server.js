import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import authRotas from "./routes/auth.js";
import videosRotas from "./routes/video.js";
import adminRotas from "./routes/admin.js";
import { initPool, getPool } from "./config/database.js";

// Configuração para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis de ambiente
dotenv.config();

const app = express();

/**
 * Middlewares de segurança
 */
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

/**
 * Configuração de sessão
 */
app.use(session({
  secret: process.env.SESSION_SEGREDO || "seu_segredo_aqui",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

/**
 * Middlewares de parsing
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Arquivos estáticos
 */
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

/**
 * Configuração do template engine
 */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/**
 * Inicializa o pool de conexões do banco de dados
 */
try {
  await initPool();
  console.log("✓ Conectado ao banco de dados com pool!");
} catch (erro) {
  console.error("✗ Erro ao conectar ao banco de dados:", erro);
  process.exit(1);
}

/**
 * Rotas
 */
app.use("/", adminRotas);
app.use("/auth", authRotas);
app.use("/videos", videosRotas);

/**
 * Rota principal
 */
app.get("/", async (req, res) => {
  const db = getPool();
  
  try {
    const [categorias] = await db.query("SELECT * FROM categorias ORDER BY nome_categoria ASC");
    console.log(`✓ ${categorias.length} categorias carregadas para a página inicial`);
    
    res.render("index", { 
      usuario: req.session.usuario || null, 
      categorias, 
      erro: null 
    });
  } catch (erro) {
    console.error("✗ Erro ao buscar categorias:", erro);
    res.status(500).render("index", { 
      usuario: req.session.usuario || null, 
      categorias: [], 
      erro: "Erro ao carregar categorias" 
    });
  }
});

/**
 * Rota 404 - Não encontrado
 */
app.use((req, res) => {
  res.status(404).render("404", { 
    usuario: req.session.usuario || null, 
    erro: "Página não encontrada" 
  });
});

/**
 * Handler de erros global
 */
app.use((err, req, res, next) => {
  console.error("✗ Erro não tratado:", err);
  res.status(500).render("404", {
    usuario: req.session.usuario || null,
    erro: "Ocorreu um erro interno no servidor"
  });
});

/**
 * Inicia o servidor
 */
const PORT = process.env.PORTA || 3000;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════════╗
║     🎨 Corner Craft - Servidor Ativo      ║
╠════════════════════════════════════════════╣
║  URL: http://${HOST}:${PORT}${" ".repeat(Math.max(0, 23 - HOST.length - PORT.toString().length))}║
║  Ambiente: ${process.env.NODE_ENV || "development"}${" ".repeat(Math.max(0, 30 - (process.env.NODE_ENV || "development").length))}║
╚════════════════════════════════════════════╝
  `);
});

export default app;