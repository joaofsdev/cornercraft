-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 30/05/2025 às 17:53
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

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `criado_em` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `categorias`
--

INSERT INTO `categorias` (`id`, `nome`, `criado_em`) VALUES
(1, 'Pintura', '2025-05-29 15:48:25'),
(2, 'Macramê', '2025-05-29 15:48:25'),
(3, 'Bordado', '2025-05-29 15:48:25'),
(4, 'Tricô', '2025-05-29 15:48:25'),
(5, 'Crochê', '2025-05-29 15:48:25'),
(6, 'Cerâmica', '2025-05-29 15:49:03');

-- --------------------------------------------------------

--
-- Estrutura para tabela `comentarios`
--

CREATE TABLE `comentarios` (
  `id` int(11) NOT NULL,
  `video_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `comentario` text NOT NULL,
  `criado_em` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `comentarios`
--

INSERT INTO `comentarios` (`id`, `video_id`, `usuario_id`, `comentario`, `criado_em`) VALUES
(1, 1, 1, 'Ótimo tutorial!', '2025-05-29 15:48:25'),
(2, 1, 2, 'Muito bem explicado.', '2025-05-29 15:48:25'),
(3, 2, 3, 'Video muito bom', '2025-05-29 15:52:53');

-- --------------------------------------------------------

--
-- Estrutura para tabela `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `video_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `tipo` enum('like','deslike') NOT NULL,
  `criado_em` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `likes`
--

INSERT INTO `likes` (`id`, `video_id`, `usuario_id`, `tipo`, `criado_em`) VALUES
(1, 1, 1, 'like', '2025-05-29 15:48:25'),
(2, 1, 2, 'deslike', '2025-05-29 15:48:25');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `inscritos` int(11) DEFAULT 0,
  `criado_em` datetime DEFAULT current_timestamp(),
  `papel` enum('usuario','admin') NOT NULL DEFAULT 'usuario' CHECK (`papel` in ('usuario','admin'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `inscritos`, `criado_em`, `papel`) VALUES
(1, 'Maria Silva', 'maria@example.com', 'senha123', 15432, '2025-05-29 15:48:25', 'usuario'),
(2, 'João Pereira', 'joao@example.com', 'senha456', 2345, '2025-05-29 15:48:25', 'usuario'),
(3, 'joao', 'joao@teste.com', '$2b$10$/mBJ/T15.c7xA/uXJfPL1OMCPaDRX11plTc8VDfZsDE535J4Uuq76', 0, '2025-05-29 15:51:54', 'admin');

-- --------------------------------------------------------

--
-- Estrutura para tabela `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `caminho_arquivo` varchar(255) NOT NULL,
  `thumbnail` varchar(255) DEFAULT '/uploads/placeholder.jpg',
  `contagem_visualizacoes` int(11) DEFAULT 0,
  `likes` int(11) DEFAULT 0,
  `deslikes` int(11) DEFAULT 0,
  `criado_em` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `videos`
--

INSERT INTO `videos` (`id`, `usuario_id`, `titulo`, `descricao`, `caminho_arquivo`, `thumbnail`, `contagem_visualizacoes`, `likes`, `deslikes`, `criado_em`) VALUES
(1, 1, 'Crochê Básico para Iniciantes', 'Tutorial básico de crochê', '/uploads/video1.mp4', '/uploads/thumbnail1.jpg', 2, 0, 0, '2025-05-01 10:00:00'),
(2, 1, 'Macramê Simples', 'Como fazer macramê', '/uploads/video2.mp4', '/uploads/thumbnail2.jpg', 14, 0, 0, '2025-05-02 12:00:00'),
(3, 3, 'Boneco de Palito', 'ase', '/uploads/1748545343152-Brinquedo muito legal feito com palito de picolÃ© e sacola..mp4', '', 5, 0, 0, '2025-05-29 16:02:23');

-- --------------------------------------------------------

--
-- Estrutura para tabela `video_categorias`
--

CREATE TABLE `video_categorias` (
  `video_id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `video_categorias`
--

INSERT INTO `video_categorias` (`video_id`, `categoria_id`) VALUES
(1, 5),
(2, 2),
(3, 5);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`),
  ADD KEY `idx_nome` (`nome`);

--
-- Índices de tabela `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_video_id` (`video_id`),
  ADD KEY `idx_usuario_id` (`usuario_id`);

--
-- Índices de tabela `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`video_id`,`usuario_id`),
  ADD KEY `idx_video_id` (`video_id`),
  ADD KEY `idx_usuario_id` (`usuario_id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`);

--
-- Índices de tabela `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_usuario_id` (`usuario_id`),
  ADD KEY `idx_criado_em` (`criado_em`);

--
-- Índices de tabela `video_categorias`
--
ALTER TABLE `video_categorias`
  ADD PRIMARY KEY (`video_id`,`categoria_id`),
  ADD KEY `idx_video_id` (`video_id`),
  ADD KEY `idx_categoria_id` (`categoria_id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `video_categorias`
--
ALTER TABLE `video_categorias`
  ADD CONSTRAINT `video_categorias_ibfk_1` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `video_categorias_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
