const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const path = require('path');
const session = require('express-session');
const authRotas = require('./routes/auth');
const videosRotas = require('./routes/videos');
const adminRotas = require('./routes/admin');

dotenv.config();

const app = express();

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

app.use(session({
    secret: process.env.SESSION_SEGREDO,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const conexao = mysql.createConnection({
    host: process.env.BANCO_HOST,
    user: process.env.BANCO_USUARIO,
    password: process.env.BANCO_SENHA,
    database: process.env.BANCO_NOME
});

conexao.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar ao banco:', erro);
        process.exit(1);
    }
    console.log('Conectado ao banco de dados!');
});

app.set('db', conexao);

app.use('/auth', authRotas);
app.use('/videos', videosRotas);
app.use('/admin', adminRotas);

app.get('/', (req, res) => {
    const db = req.app.get('db');
    db.query('SELECT * FROM categorias', (erro, categorias) => {
        if (erro) {
            console.error('Erro ao buscar categorias:', erro);
            return res.status(500).render('index', { usuario: req.session.usuario, categorias: [], erro: 'Erro ao buscar categorias' });
        }
        res.render('index', { usuario: req.session.usuario, categorias, erro: null });
    });
});

app.use((req, res) => {
    res.status(404).render('404', { usuario: req.session.usuario, erro: 'Página não encontrada' });
});

const PORT = process.env.PORTA || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});