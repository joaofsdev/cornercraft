import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool = null;

/**
 * Inicializa o pool de conexões com o banco de dados
 */
export async function initPool() {
  if (pool) {
    return pool;
  }

  pool = mysql.createPool({
    host: process.env.BANCO_HOST || "localhost",
    user: process.env.BANCO_USUARIO || "root",
    password: process.env.BANCO_SENHA || "",
    database: process.env.BANCO_NOME || "cornercraft_db",
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
  });

  // Testa a conexão
  try {
    const connection = await pool.getConnection();
    connection.release();
    return pool;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    throw error;
  }
}

/**
 * Retorna a instância do pool de conexões
 */
export function getPool() {
  if (!pool) {
    throw new Error("Pool de conexões não foi inicializado. Chame initPool() primeiro.");
  }
  return pool;
}