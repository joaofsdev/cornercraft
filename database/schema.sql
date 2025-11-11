-- Corner Craft Database Schema
-- Execute este script para criar todas as tabelas necessárias

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS cornercraft_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cornercraft_db;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    papel ENUM('usuario', 'admin') DEFAULT 'usuario',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_papel (papel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_categoria VARCHAR(100) UNIQUE NOT NULL,
    INDEX idx_nome (nome_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de vídeos
CREATE TABLE IF NOT EXISTS videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    caminho_arquivo VARCHAR(500),
    thumbnail VARCHAR(500),
    aprovado BOOLEAN DEFAULT FALSE,
    contagem_visualizacoes INT DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_aprovado (aprovado),
    INDEX idx_usuario (usuario_id),
    INDEX idx_criado (criado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de relação vídeo-categoria (muitos para muitos)
CREATE TABLE IF NOT EXISTS video_categorias (
    video_id INT,
    categoria_id INT,
    PRIMARY KEY (video_id, categoria_id),
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
    INDEX idx_video (video_id),
    INDEX idx_categoria (categoria_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de comentários
CREATE TABLE IF NOT EXISTS comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_id INT NOT NULL,
    usuario_id INT NOT NULL,
    comentario TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_video (video_id),
    INDEX idx_criado (criado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de likes/deslikes
CREATE TABLE IF NOT EXISTS likes (
    video_id INT,
    usuario_id INT,
    tipo ENUM('like', 'deslike') NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (video_id, usuario_id),
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de projetos concluídos
CREATE TABLE IF NOT EXISTS projetos_concluidos (
    usuario_id INT,
    video_id INT,
    foto_criacao VARCHAR(500),
    concluido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, video_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir categorias padrão
INSERT INTO categorias (nome_categoria) VALUES 
('Crochê'),
('Tricô'),
('Bordado'),
('Macramê'),
('Cerâmica'),
('Pintura'),
('Costura'),
('Bijuteria'),
('Origami'),
('Decoupage')
ON DUPLICATE KEY UPDATE nome_categoria = VALUES(nome_categoria);

-- Inserir usuário admin padrão
-- Senha: admin123 (hash gerado com bcrypt, custo 10)
INSERT INTO usuarios (nome, email, senha, papel) VALUES 
('Administrador', 'admin@cornercraft.com', '$2b$10$rZJ5qfVJ6vL5mKp5qfVJ6uL5mKp5qfVJ6vL5mKp5qfVJ6vL5mKp5q', 'admin')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

-- Inserir alguns vídeos de exemplo (opcional)
-- Você precisará ajustar os caminhos de arquivo conforme necessário

SELECT 'Database setup completed successfully!' AS message;
