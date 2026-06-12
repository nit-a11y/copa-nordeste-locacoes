# 📘 Guia Oficial de Boas Práticas — Stack Fixa NIT

> Padrão oficial para desenvolvimento de sistemas internos utilizando:
>
> - HTML5 · CSS3 · JavaScript Puro
> - Node.js · Express · SQLite3
>
> **Arquitetura obrigatória:** `/public` + `/backend`
>
> **Objetivos:** Organização, Segurança, Escalabilidade, Facilidade de manutenção, Deploy em VPS, Integração futura com GitHub, Aplicação de SOLID, Código limpo, Padrão corporativo NIT

---

## 🏛️ Pilares Basilares do Setor (NIT)

> Tudo que for desenvolvido deve transparecer e respeitar estes pilares, nesta ordem de prioridade.

| # | Pilar | Significado |
|---|-------|-------------|
| 1 | **Inteligência** 🧠 | Soluções pensadas com estratégia, lógica e visão de negócio |
| 2 | **Eficiência** ⚡ | Otimização de recursos, desempenho e simplicidade |
| 3 | **Confiabilidade** 🛡️ | Segurança, previsibilidade e consistência |
| 4 | **Evolução** 🌱 | Capacidade de crescer sem quebrar o que já funciona |
| 5 | **Transformação** 🚀 | Impacto real no negócio e nas pessoas |

✅ **Regra de ouro:** Toda decisão técnica (naming, arquitetura, query, validação, deploy) deve passar pelo crivo: *"Isso reflete os pilares na ordem certa?"*. Se a resposta for não, repense a abordagem.

---

## 📂 Estrutura Oficial do Projeto 🧠🌱

> **🧠 Inteligência:** Organização estratégica do código.
> **🌱 Evolução:** Estrutura preparada para crescer.

```
PROJETO/
│
├── public/
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   ├── img/
│   │   └── icons/
│   ├── pages/
│   └── index.html
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── routes/
│   ├── middlewares/
│   ├── database/
│   │   ├── db.sqlite
│   │   └── migrations/
│   ├── utils/
│   ├── validations/
│   ├── logs/
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
├── README.md
└── ecosystem.config.js
```

---

## 📌 Regras Gerais 🧠

> **🧠 Inteligência:** Código claro começa com nomes claros e linguagem consistente.

### ✅ Linguagem

Todo o projeto deve estar em:

- **Português BR** — variáveis, tabelas, funções, comentários
- Nomes claros e padronizados
- Código autoexplicativo

---

## 📌 Padrão de Nomeação 🧠

> **🧠 Inteligência:** Nomes que revelam intenção eliminam a necessidade de comentários.

### ✅ Variáveis

```
✔ Correto:   const nomeUsuario = '';  const dataCadastro = '';
❌ Errado:   const x = '';             const data = '';
```

### ✅ Funções

```
✔ Correto:   function buscarUsuarioPorId() {}   function validarPermissaoAdministrador() {}
❌ Errado:   function buscar() {}                function teste() {}
```

### ✅ Classes

```
✔ Correto:   class UsuarioService {}   class RelatorioController {}
```

### ✅ Arquivos

```
✔ Correto:   usuarios.controller.js   usuarios.service.js   usuarios.repository.js   usuarios.routes.js
❌ Errado:   ControllerUsuarios.js    teste.js              rotas.js
```

---

## 📌 Organização do Frontend 🧠⚡

> **🧠 Inteligência:** Separação clara por responsabilidade.
> **⚡ Eficiência:** Carregamento otimizado por página/componente.

### 📂 CSS

Separar arquivos por responsabilidade:

```
css/
├── global.css
├── reset.css
├── variaveis.css
├── componentes/
├── paginas/
└── responsivo.css
```

### 📌 Regras CSS ⚡

> **⚡ Eficiência:** Variáveis, classes reutilizáveis e Mobile First reduzem repetição e aceleram carregamento.

✅ **Utilizar variáveis**

```css
:root {
  --cor-primaria: #b91c1c;
  --cor-secundaria: #6b7280;
  --cor-fundo: #f5f5f5;
}
```

✅ **Evitar IDs no CSS**

```
✔ Correto:   .botao-salvar {}   .card-usuario {}
❌ Errado:   #botaoSalvar {}
```

✅ **Padronizar espaçamentos**

```
padding: 16px;        margin-bottom: 24px;        border-radius: 8px;
```

✅ **Mobile First**

```css
.container { width: 100%; }

@media (min-width: 768px) {
  .container { max-width: 1200px; }
}
```

### 📌 Regras JavaScript ⚡🛡️

> **⚡ Eficiência:** Código assíncrono sem bloqueios.
> **🛡️ Confiabilidade:** Validação duplicada front + back.

✅ **Um arquivo por responsabilidade**

```
✔ Correto:   usuarios.api.js   usuarios.ui.js   usuarios.validacoes.js
```

❌ **Nunca misturar regras** — separe em: **API** · **Interface** · **Regras** · **Eventos**

✅ **Sempre usar async/await**

```js
async function buscarUsuarios() {
  const resposta = await fetch('/api/usuarios');
  return await resposta.json();
}
```

❌ **Evitar then()** — proibido: `fetch().then()`

✅ **Validar tudo no frontend** (mesmo validando no backend)

```js
if (!nomeUsuario.trim()) {
  alert('Informe o nome');
  return;
}
```

---

## 📌 Organização do Backend 🧠🌱

> **🧠 Inteligência:** Arquitetura em camadas com responsabilidades bem definidas.
> **🌱 Evolução:** Cada camada pode ser modificada sem afetar as outras.

### 📂 Controllers

Responsável **apenas** por: receber requisição → chamar service → retornar resposta.

❌ Controller **NÃO deve**: fazer SQL, validar regra complexa, manipular banco.

```js
async function listarUsuarios(req, res) {
  const usuarios = await usuariosService.listar();
  return res.json(usuarios);
}
```

### 📂 Services

Responsável por **todas as regras de negócio**: validações, orquestração, chamada a repositórios.

```js
async function cadastrarUsuario(dados) {
  validarUsuario(dados);
  return await usuariosRepository.criar(dados);
}
```

### 📂 Repository

Responsável **somente pelo acesso ao banco** — queries SQL com prepared statements.

```js
async function buscarPorId(id) {
  return db.get('SELECT * FROM usuarios WHERE id = ?', [id]);
}
```

---

## 📌 Aplicação do SOLID 🌱

> **🌱 Evolução:** SOLID garante que o software cresça sem quebrar.

| Princípio | Regra |
|-----------|-------|
| **S** — Single Responsibility | Cada arquivo tem UM motivo para mudar |
| **O** — Open/Closed | Estender comportamento, nunca modificar o que funciona |
| **L** — Liskov Substitution | Comportamento previsível — sem surpresas |
| **I** — Interface Segregation | Interfaces pequenas e específicas |
| **D** — Dependency Inversion | Depender de abstrações, não de implementações |

---

## 📌 Banco de Dados SQLite 🛡️⚡

> **🛡️ Confiabilidade:** Estrutura consistente e previsível.
> **⚡ Eficiência:** Queries otimizadas com prepared statements.

### ✅ Nome das tabelas

```
✔ Correto:   usuarios   funcionarios   setores   permissoes   movimentacoes
❌ Errado:   Usuario    tbl_user       FUNC
```

### ✅ Nome das colunas

```
✔ Correto:   nome_completo   data_cadastro   usuario_id   status_ativo
❌ Errado:   nomeCompleto    dtCad           ativoSN
```

### ✅ Colunas obrigatórias

```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME
```

---

## 📌 Segurança Obrigatória 🛡️

> **🛡️ Confiabilidade:** Segurança não é opcional — é a base da confiança no sistema.

✅ **Nunca confiar no frontend** — valide tudo novamente no backend.
✅ **Prepared statements** — sempre usar `?` como placeholder.
✅ **Nunca expor .env** — adicionar no `.gitignore`.
✅ **Nunca subir node_modules** no repositório.
✅ **Utilizar Helmet** — `app.use(helmet())`.
✅ **Rate Limit** — proteger rotas de login e cadastro.
✅ **Sanitizar entradas** — remover scripts, tags HTML, SQL Injection.
✅ **Hash de senhas com bcrypt** — `bcrypt.hash(senha, 10)`.

---

## 📌 Logs 🛡️

> **🛡️ Confiabilidade:** Sem logs, você não sabe se o sistema está funcionando — está apenas torcendo.

Registrar no diretório `/backend/logs/`:

- Erros (stack trace, contexto)
- Logins (sucesso e falha)
- Exclusões
- Alterações críticas

---

## 📌 API 🧠🛡️

> **🧠 Inteligência:** REST é um padrão consolidado.
> **🛡️ Confiabilidade:** Respostas padronizadas eliminam ambiguidade.

### ✅ Padrão REST

```
✔ Correto:   GET /usuarios   POST /usuarios   PUT /usuarios/:id   DELETE /usuarios/:id
❌ Errado:   /getUsuarios    /deletarUsuario
```

### ✅ Respostas padronizadas

```json
// Sucesso
{ "sucesso": true, "mensagem": "Usuário cadastrado", "dados": {} }

// Erro
{ "sucesso": false, "mensagem": "Usuário não encontrado" }
```

---

## 📌 Middlewares 🛡️🌱

> **🛡️ Confiabilidade:** Barreira organizada de segurança e logging.
> **🌱 Evolução:** Novos middlewares são adicionados sem modificar os existentes.

Separar em arquivos individuais:

- `autenticacao.middleware.js` — verificação de token
- `permissao.middleware.js` — autorização por papel
- `logs.middleware.js` — registro de requisições
- `erro.middleware.js` — tratamento global de erros

---

## 📌 Tratamento de Erros 🛡️

> **🛡️ Confiabilidade:** Erro tratado é erro controlado — erro vazado é falha de segurança.

```
❌ Errado:   res.send(error);
✔ Correto:  res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
```

---

## 📌 GitHub 🌱🚀

> **🌱 Evolução:** Commits padronizados contam a história do projeto.
> **🚀 Transformação:** GitHub é a ponte entre o código local e a produção.

### ✅ Commits padronizados (Conventional Commits)

```
feat: adiciona módulo de usuários
fix: corrige validação de login
refactor: reorganiza services
```

### ✅ Fluxo de branches

```
main  ←  develop  ←  feature/*
                       hotfix/*
```

❌ **Nunca trabalhar direto na main.**

---

## 📌 VPS 🛡️🚀

> **🛡️ Confiabilidade:** PM2, NGINX e HTTPS mantêm o sistema no ar e seguro.
> **🚀 Transformação:** Deploy leva o código ao usuário final.

✅ Utilizar **PM2** para gestão de processo.
✅ **ecosystem.config.js** configurado na raiz.
✅ **NGINX** como proxy reverso.
✅ **HTTPS** com Certbot + Let's Encrypt.
✅ **Nunca rodar como root** — criar usuário próprio.

---

## 📌 Performance ⚡

> **⚡ Eficiência:** Código enxuto = menos processamento, menos memória, mais velocidade.

- Arquivos com no máximo **300~500 linhas**
- Separar componentes em arquivos individuais
- Utilizar cache quando necessário (redis, memória, HTTP)

---

## 📌 Comentários 🧠

> **🧠 Inteligência:** Comente o *porquê*, não o *o quê*.

```
✔ Correto:   // Validação obrigatória de permissão administrativa
❌ Errado:   // Soma dois números
```

---

## 📌 Versionamento 🌱

> **🌱 Evolução:** SemVer comunica o impacto de cada mudança.

**MAJOR.MINOR.PATCH** — Exemplos: `1.0.0` · `1.1.0` · `1.1.1` · `2.0.0`

---

## 📌 Estrutura Recomendada de Módulo 🧠🌱

> **🧠 Inteligência:** Cada entidade é um módulo autocontinente.
> **🌱 Evolução:** Módulos podem ser alterados sem impacto nos demais.

```
usuarios/
├── usuarios.controller.js
├── usuarios.service.js
├── usuarios.repository.js
├── usuarios.routes.js
├── usuarios.validation.js
└── usuarios.utils.js
```

---

## 📌 Checklist Pré-Produção 🛡️🚀

> **🛡️ Confiabilidade:** Última barreira antes do usuário final.
> **🚀 Transformação:** Só vai para produção o que está maduro para gerar valor.

| Categoria | Itens |
|-----------|-------|
| ✅ **Segurança** | Helmet, Rate Limit, Validações, Sanitização, Hash de senha |
| ✅ **Organização** | Separação correta, SOLID, Arquivos organizados, Nomes padronizados |
| ✅ **GitHub** | `.gitignore` correto, README atualizado, `.env` protegido |
| ✅ **VPS** | PM2 configurado, HTTPS ativo, NGINX funcionando, Logs ativos |

---

## 📌 Padrão Oficial NIT 🚀

> **🚀 Transformação:** O padrão NIT existe para que todo sistema entregue valor com qualidade consistente.

- Organização modular
- Código limpo
- Separação de responsabilidades
- Segurança por padrão
- Escalabilidade e legibilidade
- Facilidade de manutenção
- Estrutura corporativa padronizada

---

## 🚀 Objetivo Final 🚀

> **🚀 Transformação:** Tudo converge para gerar impacto real no negócio e nas pessoas.

Criar sistemas: **Profissionais** · **Seguros** · **Escaláveis** · **Fáceis de manter** · **Compatíveis com VPS e GitHub** · **Prontos para crescimento empresarial**
