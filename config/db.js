const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cornercraft_db',
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
});

const getPool = () => pool;

module.exports = { getPool };