<div align="center">

# � Corner Craft

### Plataforma Moderna de Tutoriais de Artesanato

[![Node.js](https://img.shields.io/badge/node-%3E=18.0.0-brightgreen?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-5.1.0-blue?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/mysql-2.18.1-orange?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/license-MIT-purple?style=for-the-badge)](LICENSE)

**Corner Craft** é uma plataforma web completa e moderna para compartilhamento de tutoriais de artesanato em vídeo. Desenvolvida com tecnologias de ponta, oferece uma experiência fluida para criadores e entusiastas de artesanato compartilharem suas criações e aprenderem novas técnicas.

[Demonstração](#-demonstração) • [Funcionalidades](#-funcionalidades) • [Instalação](#-instalação) • [Documentação](#-documentação-completa)

</div>

---

## 📑 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Demonstração](#-demonstração)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API e Rotas](#-api-e-rotas)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Segurança](#-segurança)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [FAQ](#-faq)
- [Licença](#-licença)
- [Autores](#-autores)

---

## 💡 Sobre o Projeto

**Corner Craft** é uma plataforma web desenvolvida para conectar entusiastas de artesanato através de tutoriais em vídeo de alta qualidade. O projeto nasceu da necessidade de criar um espaço dedicado onde artesãos podem:

- 📹 **Compartilhar** seus conhecimentos através de vídeos tutoriais
- 🎓 **Aprender** novas técnicas de artesanato com a comunidade
- 💬 **Interagir** através de comentários e avaliações
- 🏆 **Acompanhar** seu progresso em projetos e criações
- 🔍 **Descobrir** novos artesãos e técnicas por categorias

### Por que Corner Craft?

- ✨ **Interface Moderna**: Design responsivo e intuitivo com Tailwind CSS
- 🚀 **Performance**: Arquitetura ES6 otimizada com async/await
- 🔒 **Segurança**: Autenticação robusta com bcrypt e sessões seguras
- 📱 **Mobile-First**: Totalmente responsivo para todos os dispositivos
- 🎨 **Categorizado**: Sistema inteligente de categorias para fácil navegação
- 👥 **Comunidade**: Sistema de likes, comentários e perfis de usuário

---

## � Demonstração

```
🎬 Corner Craft em ação:

┌─────────────────────────────────────┐
│  🏠 Home → Explore tutoriais        │
│  📹 Vídeos → Assista e aprenda      │
│  ✏️  Publicar → Compartilhe criações│
│  👤 Perfil → Acompanhe progresso    │
│  ⚙️  Admin → Gerencie conteúdo      │
└─────────────────────────────────────┘
```

### Capturas de Tela

> 📝 _Screenshots serão adicionadas em breve_

---

## ✨ Funcionalidades

### 👥 Para Usuários

- ✅ **Autenticação Completa**
  - Registro com validação de email
  - Login seguro com bcrypt
  - Gestão de sessões persistentes
  - Logout com limpeza de sessão

- 🎥 **Gestão de Vídeos**
  - Upload de vídeos (MP4, MOV, AVI até 100MB)
  - Upload de thumbnails personalizadas (JPG, PNG, WEBP até 5MB)
  - Fotos do processo de criação (até 10MB)
  - Organização por categorias
  - Sistema de visualizações

- 💬 **Interação Social**
  - Comentários em vídeos
  - Sistema de likes e deslikes
  - Marcação de projetos concluídos
  - Perfil de usuário personalizado

- 🔍 **Navegação e Descoberta**
  - Busca por categorias
  - Feed de vídeos recentes
  - Vídeos mais populares
  - Filtros avançados

### 🛡️ Para Administradores

- 📊 **Dashboard Administrativo**
  - Visão geral de estatísticas
  - Gestão de usuários
  - Moderação de conteúdo
  - Aprovação de vídeos

- ⚙️ **Gestão de Conteúdo**
  - Adicionar/editar/remover tutoriais
  - Gerenciar categorias
  - Moderar comentários
  - Banir usuários quando necessário

---

## 🛠️ Tecnologias

### Backend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) | 22.17.0 | Runtime JavaScript |
| ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) | 5.1.0 | Framework web |
| ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white) | 2.18.1 | Banco de dados |
| ![Bcrypt](https://img.shields.io/badge/Bcrypt-6.0.0-red) | 6.0.0 | Hashing de senhas |
| ![Multer](https://img.shields.io/badge/Multer-2.0.2-orange) | 2.0.2 | Upload de arquivos |

### Frontend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| ![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | 3.4.17 | Framework CSS |
| ![EJS](https://img.shields.io/badge/EJS-B4CA65?style=flat&logo=ejs&logoColor=black) | 3.1.10 | Template engine |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | ES6+ | Linguagem client-side |

### Ferramentas de Desenvolvimento

- **Nodemon**: Auto-restart do servidor em desenvolvimento
- **dotenv**: Gerenciamento de variáveis de ambiente
- **express-session**: Gerenciamento de sessões
- **ES6 Modules**: Arquitetura modular moderna

---

## 📦 Instalação

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (incluso com Node.js)
- **MySQL** >= 8.0 ([Download](https://dev.mysql.com/downloads/))
- **Git** ([Download](https://git-scm.com/))

### Passo a Passo

**1. Clone o repositório**

```bash
git clone https://github.com/joaofsdev/cornercraft.git
cd cornercraft
```

**2. Instale as dependências**

```bash
npm install
# ou
yarn install
```

**3. Configure o banco de dados**

Crie o banco de dados MySQL:

```bash
mysql -u root -p
```

Dentro do MySQL:

```sql
CREATE DATABASE cornercraft_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

Importe o schema:

```bash
mysql -u root -p cornercraft_db < database/schema.sql
```

**4. Configure as variáveis de ambiente**

Copie o arquivo de exemplo e edite com suas credenciais:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Configuração do Banco de Dados
BANCO_HOST=localhost
BANCO_USUARIO=root
BANCO_SENHA=sua_senha_aqui
BANCO_NOME=cornercraft_db
BANCO_PORTA=3306

# Configuração do Servidor
PORTA=3000
NODE_ENV=development

# Segurança
SESSION_SEGREDO=seu_segredo_super_secreto_aqui_123456

# Upload de Arquivos
UPLOAD_PATH=./public/uploads
MAX_VIDEO_SIZE=104857600
MAX_IMAGE_SIZE=5242880
```

**5. Crie os diretórios necessários**

```bash
# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path public/uploads/videos, public/uploads/thumbnails, public/uploads/fotos

# Linux/Mac
mkdir -p public/uploads/{videos,thumbnails,fotos}
```

**6. Inicie o servidor**

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

**7. Acesse a aplicação**

Abra seu navegador em: **http://localhost:3000**

### 🎉 Primeiro Acesso

1. Crie uma conta em `/registrar`
2. Faça login em `/login`
3. Publique seu primeiro tutorial em `/publicar`
4. Explore vídeos da comunidade em `/videos`

Para criar um usuário **administrador**, execute no MySQL:

```sql
UPDATE usuarios SET papel = 'admin' WHERE email = 'seu_email@example.com';
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Valor Padrão | Obrigatório |
|----------|-----------|--------------|-------------|
| `BANCO_HOST` | Endereço do servidor MySQL | `localhost` | ✅ |
| `BANCO_USUARIO` | Usuário do banco de dados | - | ✅ |
| `BANCO_SENHA` | Senha do banco de dados | - | ✅ |
| `BANCO_NOME` | Nome do banco de dados | `cornercraft_db` | ✅ |
| `BANCO_PORTA` | Porta do MySQL | `3306` | ❌ |
| `PORTA` | Porta do servidor Express | `3000` | ❌ |
| `SESSION_SEGREDO` | Chave secreta para sessões | - | ✅ |
| `UPLOAD_PATH` | Diretório de uploads | `./public/uploads` | ❌ |
| `MAX_VIDEO_SIZE` | Tamanho máx. de vídeo (bytes) | `104857600` | ❌ |
| `MAX_IMAGE_SIZE` | Tamanho máx. de imagem (bytes) | `5242880` | ❌ |
| `NODE_ENV` | Ambiente de execução | `development` | ❌ |

### Configuração de Upload

A aplicação suporta os seguintes tipos de upload:

| Tipo | Formatos Aceitos | Tamanho Máximo | Destino |
|------|------------------|----------------|---------|
| **Vídeos** | `.mp4`, `.mov`, `.avi` | 100 MB | `uploads/videos/` |
| **Thumbnails** | `.jpg`, `.jpeg`, `.png`, `.webp` | 5 MB | `uploads/thumbnails/` |
| **Fotos de Criação** | `.jpg`, `.jpeg`, `.png`, `.webp` | 10 MB | `uploads/fotos/` |

### Banco de Dados

**Estrutura de Tabelas:**

- `usuarios` - Dados dos usuários
- `categorias` - Categorias de artesanato
- `videos` - Informações dos vídeos
- `comentarios` - Comentários em vídeos
- `likes` - Likes e deslikes
- `projetos_concluidos` - Projetos finalizados pelos usuários

**Relacionamentos:**
```
usuarios (1) ─── (N) videos
videos (1) ─── (N) comentarios
videos (1) ─── (N) likes
usuarios (N) ─── (N) projetos_concluidos
```

---

## � Uso

### Interface Web

**Página Inicial (`/`)**
- Explore vídeos em destaque
- Navegue por categorias
- Veja estatísticas da plataforma

**Registro e Login**
- `/registrar` - Crie sua conta
- `/login` - Faça login
- `/logout` - Encerre sessão

**Gestão de Conteúdo**
- `/publicar` - Publique novos tutoriais
- `/videos` - Explore todos os vídeos
- `/video/:id` - Assista e interaja
- `/categoria/:id` - Vídeos por categoria

**Área Administrativa** (requer papel `admin`)
- `/admin` - Dashboard administrativo
- `/admin/usuarios` - Gerenciar usuários
- `/admin/categorias` - Gerenciar categorias
- `/admin/moderacao` - Moderar conteúdo

### Linha de Comando

```bash
# Verificar status da aplicação
npm run status

# Limpar uploads (cuidado!)
npm run clean:uploads

# Backup do banco de dados
npm run backup:db

# Restaurar banco de dados
npm run restore:db
```

---

## 📚 API e Rotas

### Rotas Públicas

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `GET` | `/` | Página inicial com vídeos em destaque | ❌ |
| `GET` | `/videos` | Listagem completa de vídeos | ❌ |
| `GET` | `/video/:id` | Visualizar vídeo específico | ❌ |
| `GET` | `/categoria/:id` | Vídeos de uma categoria | ❌ |
| `GET` | `/login` | Exibir formulário de login | ❌ |
| `GET` | `/registrar` | Exibir formulário de registro | ❌ |

### Rotas de Autenticação

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| `POST` | `/login` | Autenticar usuário | `{ email, senha }` |
| `POST` | `/registrar` | Criar nova conta | `{ nome, email, senha }` |
| `GET` | `/logout` | Encerrar sessão | - |

### Rotas Protegidas (Usuário Autenticado)

| Método | Endpoint | Descrição | Body/Params |
|--------|----------|-----------|-------------|
| `GET` | `/publicar` | Formulário de publicação | - |
| `POST` | `/publicar` | Publicar novo vídeo | `multipart/form-data` |
| `POST` | `/video/:id/comentar` | Adicionar comentário | `{ texto }` |
| `POST` | `/video/:id/like` | Dar like em vídeo | - |
| `POST` | `/video/:id/deslike` | Dar deslike em vídeo | - |
| `POST` | `/video/:id/concluir` | Marcar projeto como concluído | - |

### Rotas Administrativas (Requer papel `admin`)

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| `GET` | `/admin` | Dashboard administrativo | - |
| `GET` | `/admin/usuarios` | Listar usuários | - |
| `POST` | `/admin/usuarios/:id/banir` | Banir usuário | - |
| `GET` | `/admin/categorias` | Gerenciar categorias | - |
| `POST` | `/admin/categorias` | Criar categoria | `{ nome, descricao }` |
| `GET` | `/admin/moderacao` | Moderar conteúdo | - |
| `POST` | `/admin/video/:id/aprovar` | Aprovar vídeo | - |
| `DELETE` | `/admin/video/:id` | Remover vídeo | - |

### Códigos de Resposta

| Código | Descrição |
|--------|-----------|
| `200` | Sucesso |
| `201` | Recurso criado |
| `302` | Redirecionamento |
| `400` | Requisição inválida |
| `401` | Não autenticado |
| `403` | Acesso negado |
| `404` | Não encontrado |
| `500` | Erro interno do servidor |

---

## 🏗️ Estrutura do Projeto

```
cornercraft/
│
├── 📁 config/                    # Configurações
│   └── database.js              # Conexão com MySQL
│
├── 📁 controllers/               # Controladores (Lógica de negócio)
│   ├── adminController.js       # Funções administrativas
│   ├── authController.js        # Autenticação e registro
│   └── videoController.js       # Gestão de vídeos
│
├── 📁 middleware/                # Middlewares
│   ├── auth.js                  # Verificação de autenticação
│   └── upload.js                # Configuração Multer
│
├── 📁 routes/                    # Definição de rotas
│   ├── admin.js                 # Rotas administrativas
│   ├── auth.js                  # Rotas de autenticação
│   └── video.js                 # Rotas de vídeos
│
├── 📁 models/                    # Modelos (opcional, para ORM)
│   └── video.js                 # Modelo de vídeo
│
├── 📁 public/                    # Arquivos estáticos
│   ├── 📁 css/                  # Estilos personalizados
│   ├── 📁 js/                   # Scripts cliente
│   │   └── scripts.js           # Funções JavaScript
│   └── 📁 uploads/              # Arquivos enviados pelos usuários
│       ├── videos/              # Vídeos
│       ├── thumbnails/          # Miniaturas
│       └── fotos/               # Fotos de criações
│
├── 📁 views/                     # Templates EJS
│   ├── 📁 partials/             # Componentes reutilizáveis
│   │   ├── header.ejs           # Cabeçalho
│   │   └── footer.ejs           # Rodapé
│   ├── index.ejs                # Página inicial
│   ├── login.ejs                # Login
│   ├── registrar.ejs            # Registro
│   ├── videos.ejs               # Listagem de vídeos
│   ├── video.ejs                # Player de vídeo
│   ├── publicar.ejs             # Publicar vídeo
│   ├── categoria.ejs            # Vídeos por categoria
│   ├── admin.ejs                # Dashboard admin
│   ├── moderacao.ejs            # Moderação
│   └── 404.ejs                  # Página não encontrada
│
├── 📁 database/                  # Scripts SQL
│   └── schema.sql               # Estrutura do banco
│
├── 📄 server.js                  # Arquivo principal
├── 📄 package.json               # Dependências
├── 📄 .env                       # Variáveis de ambiente
├── 📄 .env.example               # Exemplo de .env
├── 📄 .gitignore                 # Arquivos ignorados pelo Git
└── 📄 README.md                  # Este arquivo
```

### Arquitetura MVC

O projeto segue o padrão **Model-View-Controller (MVC)**:

- **Models** (`/models`): Estrutura de dados (opcional, pode usar queries diretas)
- **Views** (`/views`): Templates EJS para renderização HTML
- **Controllers** (`/controllers`): Lógica de negócio e interação com o banco

### Fluxo de Requisição

```
Cliente → Rota → Middleware → Controller → Banco de Dados
                     ↓              ↓
                   Auth         Resposta
                     ↓              ↓
                  Sessão ← Template ← View
```

---

## � Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor em modo produção |
| `npm run dev` | Inicia com Nodemon (auto-reload) |
| `npm test` | Executa testes (a implementar) |
| `npm run lint` | Verifica código com ESLint (a implementar) |
| `npm run format` | Formata código com Prettier (a implementar) |

**Exemplo de uso:**

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

---

## � Segurança

### Medidas Implementadas

- ✅ **Hash de Senhas**: Bcrypt com salt rounds = 10
- ✅ **Sessões Seguras**: Cookies httpOnly e sameSite
- ✅ **Validação de Uploads**: Tipos de arquivo e tamanhos limitados
- ✅ **SQL Injection Protection**: Prepared statements com mysql2
- ✅ **XSS Protection**: Headers de segurança configurados
- ✅ **CSRF Protection**: Validação de origem de requisições
- ✅ **Rate Limiting**: (A implementar) Limitação de requisições

### Boas Práticas

```javascript
// ❌ Nunca faça isso
const senha = request.body.senha; // Senha em texto plano

// ✅ Faça isso
import bcrypt from "bcrypt";
const senhaHash = await bcrypt.hash(senha, 10);
```

### Variáveis Sensíveis

**⚠️ NUNCA commite o arquivo `.env` para o repositório!**

Mantenha o `.env` no `.gitignore` e use `.env.example` como template.

---

## 🗺️ Roadmap

### ✅ Versão 1.0 (Atual)

- [x] Sistema de autenticação completo
- [x] Upload e visualização de vídeos
- [x] Comentários e likes
- [x] Área administrativa
- [x] Design responsivo

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Siga os passos abaixo:

### Como Contribuir

1. **Fork o projeto**
   ```bash
   # Clique em "Fork" no GitHub
   ```

2. **Clone seu fork**
   ```bash
   git clone https://github.com/SEU_USUARIO/cornercraft.git
   cd cornercraft
   ```

3. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/MinhaNovaFeature
   ```

4. **Faça suas alterações e commit**
   ```bash
   git add .
   git commit -m "✨ Adiciona nova feature incrível"
   ```

5. **Push para sua branch**
   ```bash
   git push origin feature/MinhaNovaFeature
   ```

6. **Abra um Pull Request**
   - Vá até o repositório original
   - Clique em "New Pull Request"
   - Descreva suas mudanças

### Convenções de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
✨ feat: Nova funcionalidade
🐛 fix: Correção de bug
📚 docs: Documentação
💄 style: Formatação
♻️ refactor: Refatoração
⚡ perf: Performance
✅ test: Testes
🔧 chore: Manutenção
```

### Diretrizes

- Siga o estilo de código existente
- Adicione testes para novas features
- Atualize a documentação
- Teste localmente antes de submeter

---

## ❓ FAQ

<details>
<summary><strong>Erro: "connect ECONNREFUSED ::1:3306"</strong></summary>

**Causa**: MySQL não está rodando ou configuração incorreta.

**Solução**:
```powershell
# Verificar se MySQL está rodando (Windows)
Get-Service -Name '*mysql*'

# Iniciar MySQL
Start-Service MySQL80

# Verificar configuração no .env
BANCO_HOST=localhost
BANCO_PORTA=3306
```
</details>

<details>
<summary><strong>Erro: "Cannot find module 'bcrypt'"</strong></summary>

**Causa**: Dependências não instaladas.

**Solução**:
```bash
npm install
# ou
npm ci
```
</details>

<details>
<summary><strong>Como criar um usuário administrador?</strong></summary>

1. Registre um usuário normalmente
2. Execute no MySQL:
```sql
UPDATE usuarios SET papel = 'admin' WHERE email = 'seu@email.com';
```
</details>

<details>
<summary><strong>Upload de vídeo falha</strong></summary>

**Verifique**:
- Formato do vídeo (MP4, MOV, AVI)
- Tamanho máximo (100MB)
- Permissões da pasta `public/uploads/`
- Espaço em disco

**Windows**:
```powershell
# Verificar permissões
icacls public\uploads
```
</details>

<details>
<summary><strong>Como alterar porta do servidor?</strong></summary>

Edite o arquivo `.env`:
```env
PORTA=8080
```
</details>

<details>
<summary><strong>Esqueci minha senha, como recuperar?</strong></summary>

Atualmente não há recuperação de senha. Para resetar:

```sql
-- Gerar nova senha com bcrypt (hash de "novaSenha123")
UPDATE usuarios 
SET senha = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' 
WHERE email = 'seu@email.com';
```
</details>

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

```
MIT License

Copyright (c) 2025 João Francisco da Silva & William Vodzinsky

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 👨‍� Autores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/joaofsdev">
        <img src="https://github.com/joaofsdev.png" width="100px;" alt="João Francisco"/><br>
        <sub>
          <b>João Francisco da Silva</b>
        </sub>
      </a>
      <br />
      <sub>Desenvolvedor Full Stack</sub>
      <br />
      <a href="https://www.linkedin.com/in/joaofsdev/">LinkedIn</a> •
      <a href="mailto:joao.franciscos047@gmail.com">Email</a>
    </td>
    <td align="center">
      <a href="https://github.com/williamvodzinsky">
        <img src="https://github.com/williamvodzinsky.png" width="100px;" alt="William Vodzinsky"/><br>
        <sub>
          <b>William Vodzinsky</b>
        </sub>
      </a>
      <br />
      <sub>Desenvolvedor Full Stack</sub>
      <br />
      <a href="https://www.linkedin.com/in/william-vodzinsky-a3b346212/">LinkedIn</a>
    </td>
  </tr>
</table>

### 💡 Sobre os Desenvolvedores

Somos estudantes de **Engenharia de Software** apaixonados por criar soluções tecnológicas que fazem a diferença. O Corner Craft nasceu da vontade de conectar pessoas através do artesanato, combinando criatividade manual com inovação tecnológica.

---

## 🌟 Agradecimentos

- Comunidade Node.js pela excelente documentação
- Tailwind CSS pela framework CSS incrível
- Todos os contribuidores e testadores
- Comunidade de artesãos que inspira este projeto

---

## 📊 Status do Projeto

![GitHub last commit](https://img.shields.io/github/last-commit/joaofsdev/cornercraft?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/joaofsdev/cornercraft?style=flat-square)
![GitHub pull requests](https://img.shields.io/github/issues-pr/joaofsdev/cornercraft?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/joaofsdev/cornercraft?style=social)

---

<div align="center">

### ⭐ Se este projeto foi útil, considere dar uma estrela!

**[⬆ Voltar ao topo](#-corner-craft)**

---

Feito com ❤️ e muito ☕ por [João Francisco](https://github.com/joaofsdev) e [William Vodzinsky](https://github.com/williamvodzinsky)

</div>
