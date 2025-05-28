CREATE DATABASE IF NOT EXISTS cornercraft_db;

USE cornercraft_db;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    papel ENUM('user', 'admin') DEFAULT 'user'
);

CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    caminho_arquivo VARCHAR(255) NOT NULL,
    contagem_visualizacoes INT DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE video_categorias (
    video_id INT NOT NULL,
    categoria_id INT NOT NULL,
    PRIMARY KEY (video_id, categoria_id),
    FOREIGN KEY (video_id) REFERENCES videos(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_id INT NOT NULL,
    usuario_id INT NOT NULL,
    comentario TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES videos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo ENUM('like', 'deslike') NOT NULL,
    UNIQUE (video_id, usuario_id),
    FOREIGN KEY (video_id) REFERENCES videos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Dados de teste
INSERT INTO usuarios (nome, email, senha, papel) VALUES ('Teste', 'teste@cornercraft.com', '$2b$10$exemploDeHash', 'user');
INSERT INTO categorias (nome) VALUES ('Tutoriais'), ('Entretenimento');
INSERT INTO videos (usuario_id, titulo, descricao, caminho_arquivo) VALUES (1, 'Vídeo de Teste', 'Descrição de teste', '/uploads/test-video.mp4');
INSERT INTO video_categorias (video_id, categoria_id) VALUES (1, 1);