
# 🎥 Corner Craft – Plataforma de Vídeos Personalizados

**Corner Craft** é uma aplicação web interativa que permite aos usuários publicar, assistir e interagir com vídeos personalizados. Ideal para criadores de conteúdo e comunidades que desejam compartilhar e engajar-se com vídeos de forma simples e eficiente.

---

## 💡 Sobre o Projeto

A plataforma oferece uma experiência completa para gerenciar vídeos, desde o upload até a visualização e interação. Os vídeos são organizados por categorias, e os usuários podem adicionar comentários e likes/deslikes. Os dados são armazenados em um banco de dados MySQL, e a interface é estilizada com TailwindCSS para uma experiência responsiva e moderna.

---

## 🚀 Tecnologias Utilizadas

- **HTML + TailwindCSS**: Interface responsiva, moderna e otimizada para diferentes dispositivos.
- **JavaScript (Node.js + Express)**: Lógica backend para manipulação de rotas, upload de arquivos e interação com o banco de dados.
- **MySQL**: Banco de dados relacional para persistência de vídeos, usuários, comentários e likes.
- **EJS**: Template engine para renderização dinâmica de páginas no backend.
---

## ⚙️ Funcionalidades

- 📤 Upload de vídeos com categorias associadas.
- 🎬 Exibição de vídeos com contagem de visualizações.
- 👍 Sistema de likes e deslikes por vídeo.
- 💬 Adição de comentários pelos usuários autenticados.
- 🔍 Listagem de vídeos por categoria ou página principal.
- 📊 Interface responsiva e estilizada com TailwindCSS.

---

## 🛠️ Como Executar Localmente

1. **Clone o repositório:**

```bash
git clone https://github.com/joaofsdev/cornercraft.git
cd cornercraft
```

2. **Instale as dependências do backend:**

```bash
npm install express ejs mysql2 dotenv express-session bcrypt tailwindcss
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
BANCO_HOST=localhost
BANCO_USUARIO=seu_usuario
BANCO_SENHA=sua_senha
BANCO_NOME=seu_banco
PORTA=3000
SESSION_SEGREDO=seu_segredo_aqui
```
- Substitua seu_usuario, sua_senha e seu_segredo_aqui pelos valores apropriados.
- Ajuste BANCO_NOME para o nome do banco de dados que você criou.

4. **Configure o Banco de Dados:**

- Crie um banco de dados MySQL com o nome cornercraft_db.
- Execute o script SQL abaixo para criar as tabelas necessárias (salve como sql/db.sql):

```bash
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
```

---

## 📁 Estrutura do Projeto

```
cornercraft/
├── public/
│   ├── uploads/         
│   └── js/
│       └── scripts.js 
├── views/
│   ├── partials/ 
│   │    ├── footer.ejs
│   │    └── header.ejs
│   ├── 404.ejs
│   ├── admin.ejs
│   ├── categoria.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── publicar.ejs
│   ├── registrar.ejs
│   ├── video.ejs
│   └── videos.ejs
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   └── videoController.js
├── routes/
│   ├── admin.js
│   ├── auth.js
│   └── videos.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── server.js
├── database/
│   └── cornercraft_db.sql
├── package.json
└── README.md
```

---

## 📌 Observações Importantes

- Os arquivos de vídeo devem ser salvos manualmente em public/uploads se não forem enviados via upload.
- A autenticação de usuários ainda está em desenvolvimento (rota /auth não incluída aqui).
- Mensagens de erro são exibidas para vídeos não encontrados ou problemas de upload.

---

## 🔮 Possíveis Expansões Futuras

- 🔐 Sistema completo de autenticação e autorização de usuários.
- 📊 Adição de gráficos para visualização de estatísticas (ex.: número de likes por vídeo).
- 📡 Integração com APIs externas para sugestões de vídeos relacionadas.
- 📱 Otimização para dispositivos móveis com layout adaptável.
- 💾 Cache de vídeos mais acessados para melhorar o desempenho.

---

## 🧠 Autor

Desenvolvido por **Joao Francisco da Silva**, estudante de Engenharia de Software, com foco em soluções acessíveis e funcionais para o dia a dia.
