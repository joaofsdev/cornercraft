const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const path = require('path');
const session = require('express-session');
const authRotas = require('./routes/auth');
const videosRotas = require('./routes/videos');
const adminRotas = require('./routes/admin');
const authMiddleware = require('./middleware/auth');

dotenv.config();

const app = express();

// Middleware de segurança
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// Configuração de sessão
app.use(session({
    secret: process.env.SESSION_SEGREDO || 'seu_segredo_aqui',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Middleware para parse de JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para arquivos estáticos e uploads
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuração do pool de conexões MySQL
const pool = mysql.createPool({
    host: process.env.BANCO_HOST,
    user: process.env.BANCO_USUARIO,
    password: process.env.BANCO_SENHA,
    database: process.env.BANCO_NOME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(() => console.log('Conectado ao banco de dados com pool!'))
    .catch((erro) => {
        console.error('Erro ao conectar ao banco com pool:', erro);
        process.exit(1);
    });

app.set('db', pool);

app.use('/', adminRotas);
app.use('/auth', authRotas);
app.use('/videos', videosRotas);

// Página inicial
app.get('/', async (req, res) => {
    const db = req.app.get('db');
    try {
        const [categorias] = await db.query('SELECT * FROM categorias');
        console.log('Categorias carregadas para a página inicial:', categorias.length);
        res.render('index', { usuario: req.session.usuario, categorias, erro: null });
    } catch (erro) {
        console.error('Erro ao buscar categorias:', erro);
        res.status(500).render('index', { usuario: req.session.usuario, categorias: [], erro: 'Erro ao buscar categorias' });
    }
});

// Tratamento de erro 404
app.use((req, res) => {
    res.status(404).render('404', { usuario: req.session.usuario, erro: 'Página não encontrada' });
});

const PORT = process.env.PORTA || 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app;