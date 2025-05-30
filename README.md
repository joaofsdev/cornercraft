
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
npm install
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

Importe o arquivo cornercraft_db.sql;

```

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
│   ├── categoria.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── publicar.ejs
│   ├── registrar.ejs
│   ├── video.ejs
│   └── videos.ejs
├── controllers/
│   ├── authController.js
│   └── videoController.js
├── routes/
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

Desenvolvido por **Joao Francisco da Silva** e **William Vodzinsky**, estudantes de Engenharia de Software, com foco em soluções acessíveis e funcionais para o dia a dia.
