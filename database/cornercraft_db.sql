-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 09/06/2025 às 22:40
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `cornercraft_db`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `categorias`
--

DROP TABLE IF EXISTS categorias;
CREATE TABLE categorias (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nome_categoria VARCHAR(100) NOT NULL UNIQUE,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Despejando dados para a tabela `categorias`
--

INSERT INTO categorias (nome_categoria) VALUES
('Pintura'),
('Macramê'),
('Bordado'),
('Tricô'),
('Crochê'),
('Cerâmica');

-- --------------------------------------------------------

--
-- Estrutura para tabela `comentarios`
--

DROP TABLE IF EXISTS comentarios;
CREATE TABLE comentarios (
  id INT(11) NOT NULL AUTO_INCREMENT,
  video_id INT(11) NOT NULL,
  usuario_id INT(11) NOT NULL,
  comentario TEXT NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (id),
  KEY idx_video_id (video_id),
  KEY idx_usuario_id (usuario_id),
  CONSTRAINT fk_comentario_video FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
  CONSTRAINT fk_comentario_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Despejando dados para a tabela `comentarios`
--

INSERT INTO comentarios (video_id, usuario_id, comentario) VALUES
(1, 1, 'Ótimo tutorial!'),
(1, 2, 'Muito bem explicado.'),
(2, 3, 'Vídeo muito bom');

-- --------------------------------------------------------

--
-- Estrutura para tabela `likes`
--

DROP TABLE IF EXISTS likes;
CREATE TABLE likes (
  id INT(11) NOT NULL AUTO_INCREMENT,
  video_id INT(11) NOT NULL,
  usuario_id INT(11) NOT NULL,
  tipo ENUM('like','deslike') NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (id),
  UNIQUE KEY unique_like (video_id, usuario_id),
  KEY idx_video_id (video_id),
  KEY idx_usuario_id (usuario_id),
  CONSTRAINT fk_like_video FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
  CONSTRAINT fk_like_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Despejando dados para a tabela `likes`
--

INSERT INTO likes (video_id, usuario_id, tipo) VALUES
(1, 1, 'like'),
(1, 2, 'deslike');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  inscritos INT(11) DEFAULT 0,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP(),
  papel ENUM('usuario','admin') NOT NULL DEFAULT 'usuario',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO usuarios (nome, email, senha, papel) VALUES
('Maria Silva', 'maria@example.com', 'senha123', 'usuario'),
('João Pereira', 'joao@example.com', 'senha456', 'usuario'),
('Admin', 'admin@cornercraft.com', '$2b$10$AfXN6NDfXiJ6Q3k93PBdtuywKlOpKp85uVcsUshBrIGEhn0UjHuV.', 'admin');

-- --------------------------------------------------------

--
-- Estrutura para tabela `videos`
--

DROP TABLE IF EXISTS videos;
CREATE TABLE videos (
  id INT(11) NOT NULL AUTO_INCREMENT,
  usuario_id INT(11) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT DEFAULT NULL,
  caminho_arquivo VARCHAR(255) NOT NULL,
  thumbnail VARCHAR(255) DEFAULT '/uploads/placeholder.jpg',
  contagem_visualizacoes INT(11) DEFAULT 0,
  likes INT(11) DEFAULT 0,
  deslikes INT(11) DEFAULT 0,
  aprovado BOOLEAN DEFAULT FALSE,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (id),
  KEY idx_usuario_id (usuario_id),
  KEY idx_criado_em (criado_em),
  CONSTRAINT fk_videos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Despejando dados para a tabela `videos`
--

INSERT INTO videos (usuario_id, titulo, descricao, caminho_arquivo, thumbnail, aprovado) VALUES
(1, 'Crochê Básico para Iniciantes', 'Tutorial básico de crochê', '/uploads/video1.mp4', '/uploads/thumbnail1.jpg', TRUE),
(1, 'Macramê Simples', 'Como fazer macramê', '/uploads/video2.mp4', '/uploads/thumbnail2.jpg', TRUE),
(2, 'Boneco de Palito', 'Brinquedo feito com palito de picolé', '/uploads/video3.mp4', '/uploads/thumbnail3.jpg', TRUE);

-- --------------------------------------------------------

--
-- Estrutura para tabela `video_categorias`
--

DROP TABLE IF EXISTS video_categorias;
CREATE TABLE video_categorias (
  video_id INT(11) NOT NULL,
  categoria_id INT(11) NOT NULL,
  PRIMARY KEY (video_id, categoria_id),
  KEY idx_video_id (video_id),
  KEY idx_categoria_id (categoria_id),
  CONSTRAINT fk_vc_video FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
  CONSTRAINT fk_vc_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Despejando dados para a tabela `video_categorias`
--

INSERT INTO video_categorias (video_id, categoria_id) VALUES
(1, 5),
(2, 2),
(3, 5);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `categorias`
--
ALTER TABLE categorias
  ADD UNIQUE KEY nome_categoria (`nome_categoria`);

--
-- Índices de tabela `comentarios`
--
ALTER TABLE comentarios
  ADD KEY idx_video_id (`video_id`),
  ADD KEY idx_usuario_id (`usuario_id`);

--
-- Índices de tabela `likes`
--
ALTER TABLE likes
  ADD KEY idx_video_id (`video_id`),
  ADD KEY idx_usuario_id (`usuario_id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE usuarios
  ADD UNIQUE KEY email (`email`);

--
-- Índices de tabela `videos`
--
ALTER TABLE videos
  ADD KEY idx_criado_em (`criado_em`);

--
-- Índices de tabela `video_categorias`
--
ALTER TABLE video_categorias
  ADD KEY idx_video_id (`video_id`),
  ADD KEY idx_categoria_id (`categoria_id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `categorias`
--
ALTER TABLE categorias
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `comentarios`
--
ALTER TABLE comentarios
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `likes`
--
ALTER TABLE likes
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE usuarios
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `videos`
--
ALTER TABLE videos
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `comentarios`
--
ALTER TABLE comentarios
  ADD CONSTRAINT comentarios_ibfk_1 FOREIGN KEY (video_id) REFERENCES videos (id) ON DELETE CASCADE,
  ADD CONSTRAINT comentarios_ibfk_2 FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE;

--
-- Restrições para tabelas `likes`
--
ALTER TABLE likes
  ADD CONSTRAINT likes_ibfk_1 FOREIGN KEY (video_id) REFERENCES videos (id) ON DELETE CASCADE,
  ADD CONSTRAINT likes_ibfk_2 FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE;

--
-- Restrições para tabelas `videos`
--
ALTER TABLE videos
  ADD CONSTRAINT videos_ibfk_1 FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE;

--
-- Restrições para tabelas `video_categorias`
--
ALTER TABLE video_categorias
  ADD CONSTRAINT video_categorias_ibfk_1 FOREIGN KEY (video_id) REFERENCES videos (id) ON DELETE CASCADE,
  ADD CONSTRAINT video_categorias_ibfk_2 FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
