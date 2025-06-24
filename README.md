# 🎥 Corner Craft – Plataforma de Vídeos Personalizados

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E=18.0.0-brightgreen)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)]()

**Corner Craft** é uma aplicação web interativa para publicar, assistir e interagir com vídeos personalizados. Ideal para criadores de conteúdo e comunidades que desejam compartilhar e engajar-se com vídeos de forma simples e eficiente.

---

## 📑 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Requisitos do Sistema](#-requisitos-do-sistema)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Funcionalidades](#-funcionalidades)
- [Como Executar Localmente](#-como-executar-localmente)
- [Configuração do Banco de Dados](#-configuração-do-banco-de-dados)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Upload de Arquivos](#-upload-de-arquivos)
- [Autenticação e Permissões](#-autenticação-e-permissões)
- [Principais Rotas](#-principais-rotas)
- [Scripts npm](#-scripts-npm)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Exemplo de Uso](#-exemplo-de-uso)
- [Contribuição](#-contribuição)
- [FAQ](#-faq)
- [Changelog](#-changelog)
- [Possíveis Expansões Futuras](#-possíveis-expansões-futuras)
- [Autor](#-autor)
- [Contato](#-contato)

---

## 💡 Sobre o Projeto

A plataforma oferece uma experiência completa para gerenciar vídeos, desde o upload até a visualização e interação. Os vídeos são organizados por categorias, e os usuários podem adicionar comentários e likes/deslikes. Os dados são armazenados em um banco de dados MySQL, e a interface é estilizada com TailwindCSS para uma experiência responsiva e moderna.

---

## 💻 Requisitos do Sistema

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MySQL** >= 8.x
- Sistema operacional: Windows, Linux ou MacOS

---

## 🚀 Tecnologias Utilizadas

- **HTML + TailwindCSS**: Interface responsiva, moderna e otimizada para diferentes dispositivos.
- **JavaScript (Node.js + Express)**: Lógica backend para manipulação de rotas, upload de arquivos e interação com o banco de dados.
- **MySQL**: Banco de dados relacional para persistência de vídeos, usuários, comentários e likes.
- **EJS**: Template engine para renderização dinâmica de páginas no backend.
- **Multer**: Upload de arquivos.
- **express-session**: Gerenciamento de sessões.
- **jsonwebtoken**: (Preparado para JWT).

---

## ⚙️ Funcionalidades

- 📤 Upload de vídeos com categorias associadas.
- 🎬 Exibição de vídeos com contagem de visualizações.
- 💬 Adição de comentários pelos usuários autenticados.
- 🔍 Listagem de vídeos por categoria ou página principal.
- 👍/👎 Likes e deslikes em vídeos.
- 👤 Sistema de autenticação e sessão.
- 🛡️ Área administrativa (restrita a admins).
- 📊 Interface responsiva e estilizada com TailwindCSS.

---

## 🛠️ Como Executar Localmente

1. **Clone o repositório:**

```bash
git clone https://github.com/joaofsdev/cornercraft.git
cd cornercraft
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
BANCO_HOST=localhost
BANCO_USUARIO=seu_usuario
BANCO_SENHA=sua_senha
BANCO_NOME=cornercraft_db
PORTA=3000
SESSION_SEGREDO=seu_segredo_aqui
UPLOAD_PATH=./public/uploads
NODE_ENV=development
```
- Substitua `seu_usuario`, `sua_senha` e `seu_segredo_aqui` pelos valores apropriados.

4. **Configure o banco de dados:**

```bash
mysql -u seu_usuario -p < database/cornercraft_db.sql
```

5. **Inicie o servidor:**

```bash
npm start
```

Acesse em [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Configuração do Banco de Dados

1. Certifique-se de ter o MySQL instalado e rodando.
2. Crie o banco de dados e as tabelas necessárias executando o script SQL fornecido:

```bash
mysql -u seu_usuario -p < database/cornercraft_db.sql
```

---

## 🔑 Variáveis de Ambiente

Exemplo de `.env`:

```env
BANCO_HOST=localhost
BANCO_USUARIO=seu_usuario
BANCO_SENHA=sua_senha
BANCO_NOME=cornercraft_db
PORTA=3000
SESSION_SEGREDO=seu_segredo_aqui
UPLOAD_PATH=./public/uploads
NODE_ENV=development
```
- **BANCO_HOST**: Host do MySQL
- **BANCO_USUARIO**: Usuário do MySQL
- **BANCO_SENHA**: Senha do MySQL
- **BANCO_NOME**: Nome do banco de dados
- **PORTA**: Porta do servidor Express
- **SESSION_SEGREDO**: Segredo para sessões
- **UPLOAD_PATH**: Caminho para uploads (opcional, padrão: ./public/uploads)
- **NODE_ENV**: Ambiente de execução (development/production)

---

## ⬆️ Upload de Arquivos

- **Vídeos**: Apenas `.mp4`, até 100MB
- **Thumbnail**: `.jpg`, `.jpeg`, `.png`, até 5MB
- **Foto de criação**: `.jpg`, `.jpeg`, `.png`, até 10MB
- O caminho de upload pode ser configurado via `UPLOAD_PATH` no `.env`

---

## 🔐 Autenticação e Permissões

- **Usuários**: Cadastro e login via email e senha (hash com bcrypt)
- **Sessão**: Gerenciada por `express-session`
- **Admin**: Usuários com papel `admin` têm acesso a rotas administrativas
- **JWT**: Middleware preparado para uso futuro (não obrigatório atualmente)

---

## 🌐 Principais Rotas

| Método | Rota                | Descrição                                 |
|--------|---------------------|-------------------------------------------|
| GET    | /                   | Página inicial, listagem de vídeos        |
| GET    | /login              | Página de login                           |
| POST   | /login              | Autenticação de usuário                   |
| GET    | /registrar          | Página de registro                        |
| POST   | /registrar          | Criação de novo usuário                   |
| GET    | /publicar           | Página de upload de vídeo                 |
| POST   | /publicar           | Upload de vídeo                           |
| GET    | /video/:id          | Visualização de vídeo específico          |
| POST   | /video/:id/comentar | Adicionar comentário em vídeo             |
| POST   | /video/:id/like     | Like/deslike em vídeo                     |
| GET    | /admin              | Área administrativa (admin)               |

---

## 🛠️ Scripts npm

- `npm start`: Inicia o servidor Express
- `npm test`: (Preparado) Executa testes com Mocha/Chai (nenhum teste implementado ainda)
- `npm run coverage`: (Preparado) Gera relatório de cobertura de testes

---

## 📁 Estrutura do Projeto

```
cornercraft/
├── public/
│   ├── uploads/         # Vídeos enviados
│   └── js/
│       └── scripts.js   # Scripts do frontend
├── views/
│   ├── partials/        # Partes reutilizáveis (header, footer)
│   ├── 404.ejs
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

## ▶️ Exemplo de Uso

1. Cadastre-se na plataforma
2. Faça login
3. Publique um vídeo (formato MP4, até 100MB)
4. Assista, comente e interaja com vídeos de outros usuários
5. (Se admin) Acesse a área administrativa

---

## ❓ FAQ

- **Erro de conexão com banco:** Verifique as variáveis do `.env` e se o MySQL está rodando
- **Problemas no upload:** Confirme o formato e tamanho dos arquivos
- **Porta ocupada:** Altere a variável `PORTA` no `.env`
- **Como redefinir senha?** Ainda não implementado
- **Como virar admin?** Altere o campo `papel` do usuário no banco para `admin`

---

## 📝 Changelog

- Veja o histórico de mudanças no [GitHub](https://github.com/joaofsdev/cornercraft/commits/main)

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

---

## 📬 Contato

- Email: joao.franciscos047@gmail.com
- LinkedIn: [Joao Francisco da Silva](https://www.linkedin.com/in/joaofsdev/)
- LinkedIn: [William Vodzinsky](https://www.linkedin.com/in/william-vodzinsky-a3b346212/)
