# Prompts de Boas Práticas — Stack Fixa NIT

> Cada prompt abaixo é uma variação autocontida de uma regra do `boaspraticas.md`,
> formatada como instrução direta para criação de sistemas.
>
> 📌 **Legenda:** 🧠 = Inteligência | ⚡ = Eficiência | 🛡️ = Confiabilidade | 🌱 = Evolução | 🚀 = Transformação

---

## 0. Pilares Basilares do Setor (NIT)

"Antes de escrever qualquer linha de código, todo sistema deve respeitar os **Pilares Basilares do Setor NIT**, nesta ordem de prioridade:

1. **Inteligência** — Soluções estratégicas e pensadas; cada linha de código deve ter um propósito claro.
2. **Eficiência** — Otimização de recursos, desempenho e simplicidade; fazer mais com menos.
3. **Confiabilidade** — Segurança, previsibilidade e consistência; o sistema não falha sem rastreabilidade.
4. **Evolução** — Capacidade de crescer e ser mantido sem quebrar o que já funciona.
5. **Transformação** — Impacto real no negócio e nas pessoas; o código existe para gerar valor.

✅ **Regra de ouro:** Toda decisão técnica (naming, arquitetura, query, validação, deploy) deve passar pelo crivo: *'Isso reflete os pilares na ordem correta?'*. Se não, repense. Um sistema que não transparece esses pilares **não está alinhado ao padrão NIT**."

📌 Pilares: 🧠⚡🛡️🌱🚀

---

## 1. Estrutura do Projeto

"Crie a estrutura de diretórios obrigatória: `/public` para frontend (com `assets/css/`, `assets/js/`, `assets/img/`, `assets/icons/`, `pages/`, `index.html`) e `/backend` para backend (com `config/`, `controllers/`, `services/`, `repositories/`, `routes/`, `middlewares/`, `database/` com `db.sqlite` e `migrations/`, `utils/`, `validations/`, `logs/`, `server.js`). Na raiz, inclua `.env`, `.gitignore`, `package.json`, `README.md` e `ecosystem.config.js`. Essa separação rígida entre frontend e backend é obrigatória e deve ser mantida em todo o sistema."

📌 Pilares: 🧠🌱 — Estrutura pensada e preparada para crescer.

---

## 2. Linguagem do Projeto

"Todo o código do sistema deve ser escrito em **Português BR**. Variáveis, nomes de tabelas, nomes de funções e comentários devem estar em português. O código deve ser autoexplicativo, com nomes claros e padronizados. Nenhum termo em inglês é permitido para identificadores de domínio."

📌 Pilares: 🧠 — Clareza e intencionalidade desde o vocabulário.

---

## 3. Nomeação de Variáveis

"Use **camelCase** descritivo para variáveis. Exemplo correto: `nomeUsuario`, `dataCadastro`, `totalFuncionarios`. Exemplo errado: `x`, `data`, `total`. Nomes devem ser autoexplicativos e refletir exatamente o que a variável armazena, sem abreviações ou letras soltas."

📌 Pilares: 🧠 — Nomes que revelam intenção eliminam dúvidas.

---

## 4. Nomeação de Funções

"Use o padrão **verbo + contexto** para funções. Exemplo correto: `buscarUsuarioPorId()`, `validarPermissaoAdministrador()`. Exemplo errado: `buscar()`, `teste()`. Toda função deve ter seu propósito claro no nome, iniciando com um verbo no infinitivo."

📌 Pilares: 🧠 — Funções com nomes precisos são auto-documentadas.

---

## 5. Nomeação de Classes

"Use **PascalCase** com sufixo de responsabilidade para classes. Exemplo correto: `UsuarioService`, `RelatorioController`. Classes representam entidades do sistema e devem ter nomes que indiquem claramente seu papel na arquitetura."

📌 Pilares: 🧠 — Classes nomeadas por papel, não por tipo.

---

## 6. Nomeação de Arquivos

"Use o padrão **entidade.camada.js** para arquivos. Exemplo correto: `usuarios.controller.js`, `usuarios.service.js`, `usuarios.repository.js`, `usuarios.routes.js`. Exemplo errado: `ControllerUsuarios.js`, `teste.js`, `rotas.js`. O nome da entidade vem primeiro, seguido por ponto e a camada arquitetural."

📌 Pilares: 🧠 — O nome do arquivo já revela seu lugar na arquitetura.

---

## 7. Organização do CSS

"Separe os arquivos CSS por responsabilidade dentro de `public/assets/css/`. Estrutura obrigatória: `global.css` (estilos globais), `reset.css` (reset de navegador), `variaveis.css` (variáveis CSS), `componentes/` (estilos de componentes reutilizáveis), `paginas/` (estilos específicos por página) e `responsivo.css` (media queries). Cada arquivo deve ter uma única responsabilidade."

📌 Pilares: 🧠⚡ — Organização inteligente que otimiza o carregamento.

---

## 8. Regras CSS — Variáveis e Padronização

"Use variáveis CSS no `:root` para cores e valores repetidos. Exemplo: `--cor-primaria: #b91c1c; --cor-secundaria: #6b7280; --cor-fundo: #f5f5f5;`. **Evite IDs em seletores CSS** — use apenas classes (`.botao-salvar`, `.card-usuario`). Padronize espaçamentos com valores consistentes: `padding: 16px`, `margin-bottom: 24px`, `border-radius: 8px`."

📌 Pilares: ⚡ — Variáveis eliminam repetição; classes reutilizáveis reduzem CSS.

---

## 9. Regras CSS — Mobile First

"Sempre desenvolva CSS com abordagem **Mobile First**. Comece com estilos para telas pequenas (width: 100%) e use `@media (min-width: 768px)` para breakpoints progressivos. Exemplo: `.container { width: 100%; } @media (min-width: 768px) { .container { max-width: 1200px; } }`."

📌 Pilares: ⚡ — Menos CSS para mobile, carregamento mais rápido.

---

## 10. JavaScript Frontend — Separação por Responsabilidade

"Crie **um arquivo JS por responsabilidade** no frontend. Separe em: `usuarios.api.js` (chamadas HTTP), `usuarios.ui.js` (manipulação do DOM), `usuarios.validacoes.js` (regras de validação) e `usuarios.eventos.js` (event listeners). **Nunca misture** chamadas de API com manipulação de DOM ou lógica de validação no mesmo arquivo."

📌 Pilares: 🧠⚡ — Separação lógica que facilita manutenção e carregamento seletivo.

---

## 11. JavaScript Frontend — Async/Await

"Use **sempre async/await** para operações assíncronas. Exemplo correto: `async function buscarUsuarios() { const resposta = await fetch('/api/usuarios'); return await resposta.json(); }`. **Evite then()** — código com `.then().catch()` não é permitido. Prefira try/catch com async/await."

📌 Pilares: ⚡ — Operações não-bloqueantes aproveitam melhor os recursos.

---

## 12. JavaScript Frontend — Validação Duplicada

"Valide **todos os campos no frontend**, mesmo que o backend também valide. Exemplo: `if (!nomeUsuario.trim()) { alert('Informe o nome'); return; }`. A validação no frontend é para experiência do usuário (feedback imediato), mas nunca substitui a validação no backend (que é a verdadeira barreira de segurança)."

📌 Pilares: 🛡️ — Duas camadas de validação = duas camadas de confiança.

---

## 13. Controllers (Backend)

"Controllers são responsáveis **apenas** por: receber a requisição, chamar o service e retornar a resposta. **Controllers NÃO devem**: fazer SQL, validar regras complexas ou manipular o banco diretamente. Exemplo correto: `async function listarUsuarios(req, res) { const usuarios = await usuariosService.listar(); return res.json(usuarios); }`."

📌 Pilares: 🧠🌱 — Responsabilidade única que isola mudanças por camada.

---

## 14. Services (Backend)

"Services são responsáveis por **todas as regras de negócio**. Eles orquestram validações, chamam repositórios e aplicam a lógica do domínio. Exemplo: `async function cadastrarUsuario(dados) { validarUsuario(dados); return await usuariosRepository.criar(dados); }`. Services nunca devem expor detalhes de infraestrutura (banco, HTTP, etc.)."

📌 Pilares: 🧠🛡️ — Regras de negócio centralizadas e validades em um lugar só.

---

## 15. Repository (Backend)

"Repositories são responsáveis **somente pelo acesso ao banco de dados**. Contêm queries SQL puras com prepared statements. Exemplo: `async function buscarPorId(id) { return db.get('SELECT * FROM usuarios WHERE id = ?', [id]); }`. Nenhuma regra de negócio deve existir no repository — apenas operações CRUD."

📌 Pilares: 🛡️⚡ — Prepared statements para segurança; queries enxutas para desempenho.

---

## 16. SOLID — S (Single Responsibility)

"Cada arquivo no sistema deve ter **uma única responsabilidade**. Um controller só controla o fluxo HTTP. Um service só contém regras de negócio. Um repository só acessa o banco. Um arquivo CSS só estiliza um componente. Se um arquivo tem mais de um motivo para mudar, ele viola o princípio."

📌 Pilares: 🌱 — Um motivo para mudar = mudanças previsíveis e seguras.

---

## 17. SOLID — O (Open/Closed)

"Classes e funções devem estar **abertas para extensão, fechadas para modificação**. Prefira criar novas funções ou estender comportamento existente em vez de alterar código que já funciona. Crie extensões em novos arquivos ao invés de modificar os originais."

📌 Pilares: 🌱 — Código que cresce sem quebrar o que já está funcionando.

---

## 18. SOLID — L (Liskov Substitution)

"Funções devem manter **comportamento previsível**. Se uma função recebe um tipo de dado, subtipos ou variações desse dado devem funcionar sem quebrar o comportamento esperado. Nunca sobrescreva uma função com comportamento que surpreenda quem a chama."

📌 Pilares: 🌱 — Previsibilidade é a base da evolução segura.

---

## 19. SOLID — I (Interface Segregation)

"**Separe responsabilidades em interfaces pequenas e específicas.** Em vez de uma função ou módulo que faz tudo, crie várias funções pequenas com responsabilidades bem definidas. Nenhum módulo deve ser forçado a depender de métodos que não usa."

📌 Pilares: 🌱 — Módulos pequenos evoluem independentemente.

---

## 20. SOLID — D (Dependency Inversion)

"**Services devem depender de abstrações, não de implementações concretas.** Controllers não chamam repositories diretamente — passam por services. Nunca dependa diretamente de rotas ou detalhes de infraestrutura. Injete as dependências necessárias em vez de instanciá-las internamente."

📌 Pilares: 🌱 — Acoplamento baixo = liberdade para evoluir cada parte.

---

## 21. Banco de Dados — Nome de Tabelas

"Use **minúsculo, português e plural** para nomes de tabelas. Exemplo correto: `usuarios`, `funcionarios`, `setores`, `permissoes`, `movimentacoes`. Exemplo errado: `Usuario`, `tbl_user`, `FUNC`. O plural é obrigatório porque tabelas armazenam coleções."

📌 Pilares: 🧠🛡️ — Nomes consistentes evitam ambiguidade e erros de mapeamento.

---

## 22. Banco de Dados — Nome de Colunas

"Use **snake_case** em português para colunas. Exemplo correto: `nome_completo`, `data_cadastro`, `usuario_id`, `status_ativo`. Exemplo errado: `nomeCompleto`, `dtCad`, `ativoSN`. Seja descritivo — `data_cadastro` é melhor que `dtCad`."

📌 Pilares: 🧠🛡️ — Colunas descritivas eliminam suposições sobre os dados.

---

## 23. Banco de Dados — Colunas Obrigatórias

"Toda tabela **deve** ter: `id INTEGER PRIMARY KEY AUTOINCREMENT`, `created_at DATETIME DEFAULT CURRENT_TIMESTAMP` e `updated_at DATETIME`. O `id` é a chave primária padrão. `created_at` é preenchido automaticamente. `updated_at` é atualizado manualmente pela aplicação em operações de update."

📌 Pilares: 🛡️ — Estrutura consistente em todas as tabelas do sistema.

---

## 24. Segurança — Validação no Backend

"**Nunca confie no frontend.** Tudo que chega do frontend (campos, tokens, headers) deve ser validado novamente no backend. O frontend pode ser manipulado pelo usuário. A validação no backend é a barreira de segurança real e obrigatória."

📌 Pilares: 🛡️ — A confiança não é transferida, é verificada.

---

## 25. Segurança — Prepared Statements

"**Sempre use prepared statements** para queries SQL. Exemplo correto: `db.get('SELECT * FROM usuarios WHERE id = ?', [id])`. Exemplo errado (proibido): `` db.get(`SELECT * FROM usuarios WHERE id = ${id}`) ``. Nunca concatene valores diretamente na string SQL — isso previne SQL Injection."

📌 Pilares: 🛡️ — SQL Injection é inaceitável em qualquer sistema.

---

## 26. Segurança — .env e node_modules

"**Nunca exponha** arquivos `.env` ou `node_modules/` no repositório. Adicione ambos ao `.gitignore`. O `.env` contém senhas, chaves de API e configurações sensíveis. `node_modules` é regenerável com `npm install`. Vazar esses arquivos é falha grave de segurança."

📌 Pilares: 🛡️ — Segredo vazado é confiança quebrada.

---

## 27. Segurança — Helmet

"Instale e configure **Helmet** em toda aplicação Express: `npm install helmet` e depois `const helmet = require('helmet'); app.use(helmet());`. Helmet protege contra ataques comuns de segurança web definindo headers HTTP adequados (X-Content-Type-Options, X-Frame-Options, etc.)."

📌 Pilares: 🛡️ — Headers de segurança são a primeira linha de defesa HTTP.

---

## 28. Segurança — Rate Limit

"Instale e configure **express-rate-limit** para evitar ataques de força bruta e DDoS: `npm install express-rate-limit`. Defina limites razoáveis de requisições por IP (ex.: 100 requisições por 15 minutos). Aplique especialmente em rotas de login e cadastro."

📌 Pilares: 🛡️ — Rate limit protege o sistema contra abuso e sobrecarga.

---

## 29. Segurança — Sanitização de Entradas

"**Sanitize toda entrada do usuário.** Remova: scripts maliciosos, tags HTML, tentativas de SQL Injection e caracteres inválidos. Use bibliotecas de sanitização ou funções dedicadas. Nunca confie que o dado chegará limpo — a sanitização é a última barreira antes de processar ou armazenar."

📌 Pilares: 🛡️ — Dado não sanitizado é vulnerabilidade em potencial.

---

## 30. Segurança — Hash de Senhas com bcrypt

"**Nunca armazene senhas em texto puro.** Instale bcrypt: `npm install bcrypt`. Sempre: gere hash com salt, compare usando `bcrypt.compare()`, nunca salve a string original. Exemplo: `const hash = await bcrypt.hash(senha, 10);` — o número 10 é o mínimo recomendado de rounds de salt."

📌 Pilares: 🛡️ — Senha em texto puro é falha grave de confiabilidade.

---

## 31. Logs

"**Registre em logs** no diretório `/backend/logs/` todas as operações críticas: erros (stack trace, contexto), logins (bem-sucedidos e falhos), exclusões de registros e alterações críticas (dados sensíveis modificados). Use níveis de log (error, warn, info) para facilitar a filtragem e investigação."

📌 Pilares: 🛡️ — Sem logs, você não sabe se o sistema está seguro — está apenas torcendo.

---

## 32. API — Padrão REST

"Siga o **padrão REST** estritamente. Exemplo correto: `GET /usuarios`, `POST /usuarios`, `PUT /usuarios/:id`, `DELETE /usuarios/:id`. Exemplo errado (proibido): `/getUsuarios`, `/deletarUsuario`. Use substantivos no plural para recursos e verbos HTTP para ações. Nunca coloque verbos na URL."

📌 Pilares: 🧠 — REST é um padrão consolidado que qualquer dev reconhece.

---

## 33. API — Respostas Padronizadas

"Todas as respostas da API devem seguir o formato padronizado. **Sucesso:** `{ "sucesso": true, "mensagem": "Usuário cadastrado", "dados": {} }`. **Erro:** `{ "sucesso": false, "mensagem": "Usuário não encontrado" }`. O campo `sucesso` (booleano) é obrigatório em todas as respostas. `mensagem` é obrigatório. `dados` é opcional (apenas em sucesso)."

📌 Pilares: 🧠🛡️ — Respostas previsíveis = consumo confiável da API.

---

## 34. Middlewares

"**Separe middlewares por responsabilidade** em arquivos individuais em `/backend/middlewares/`: `autenticacao.middleware.js` (verificação de token/JWT), `permissao.middleware.js` (autorização por papel/função), `logs.middleware.js` (registro de requisições), `erro.middleware.js` (tratamento global de erros). Cada middleware tem uma única função na cadeia de requisição."

📌 Pilares: 🛡️🌱 — Middlewares organizados = segurança modular e extensível.

---

## 35. Tratamento de Erros Global

"**Nunca retorne erro bruto para o cliente.** Exemplo errado (proibido): `res.send(error)`. Exemplo correto: `res.status(500).json({ sucesso: false, mensagem: 'Erro interno' })`. Use um middleware global de erro que capture exceções, logue o erro real e retorne uma resposta segura e padronizada sem expor detalhes internos."

📌 Pilares: 🛡️ — Erro controlado = sistema confiável; erro exposto = vulnerabilidade.

---

## 36. GitHub — Commits Padronizados

"Use **Conventional Commits** para todas as mensagens de commit. Exemplo correto: `feat: adiciona módulo de usuários`, `fix: corrige validação de login`, `refactor: reorganiza services`. Prefixos obrigatórios: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `style`. A mensagem deve estar em português e descrever o que o commit faz."

📌 Pilares: 🌱 — Commits padronizados contam a história da evolução do sistema.

---

## 37. GitHub — Branches

"**Nunca trabalhe direto na branch main.** Use o fluxo: `main` (produção), `develop` (desenvolvimento), `feature/*` (novas funcionalidades a partir de develop), `hotfix/*` (correções urgentes a partir de main). Branches `feature` e `hotfix` são temporárias e devem ser deletadas após o merge."

📌 Pilares: 🌱 — Fluxo de branches organizado = evolução controlada.

---

## 38. VPS — PM2

"Use **PM2** para gerenciar o processo Node.js em produção: `npm install pm2 -g`. Crie o arquivo `ecosystem.config.js` na raiz com configuração de name, script (`backend/server.js`), watch, max_memory_restart e env. Use `pm2 start ecosystem.config.js` para iniciar. Configure o PM2 para reiniciar automaticamente com `pm2 startup`."

📌 Pilares: 🚀 — Sem PM2, não há transformação: o sistema não chega à produção.

---

## 39. VPS — NGINX como Proxy Reverso

"Configure **NGINX** como proxy reverso para a aplicação Node.js. O NGINX escuta nas portas 80/443 (HTTP/HTTPS) e redireciona o tráfego para o Node.js (ex.: localhost:3000). Configure também: limits de upload, cabeçalhos de segurança, cache de arquivos estáticos e compressão gzip. O Node.js nunca deve ficar exposto diretamente à internet."

📌 Pilares: 🛡️🚀 — NGINX protege e prepara o sistema para o mundo real.

---

## 40. VPS — HTTPS com Certbot e Let's Encrypt

"Configure **HTTPS obrigatório** usando Certbot e Let's Encrypt. Obtenha certificados SSL gratuitos com `certbot --nginx`. Configure renovação automática. **Toda comunicação** com o sistema deve ser criptografada. HTTP puro deve redirecionar para HTTPS. Sem certificado SSL válido, o sistema não pode ir para produção."

📌 Pilares: 🛡️ — Conexão criptografada é requisito mínimo de confiabilidade.

---

## 41. VPS — Segurança (Usuário Não-Root)

"**Nunca rode a aplicação como root** no servidor. Crie um usuário específico para a aplicação (ex.: `adduser nitapp`), conceda permissões mínimas necessárias e execute o PM2 sob esse usuário. O usuário root deve ser usado apenas para configurações administrativas iniciais."

📌 Pilares: 🛡️ — Menos privilégio = menos superfície de ataque.

---

## 42. Performance

"**Limite arquivos a 300~500 linhas** no máximo. Separe componentes em arquivos individuais. Utilize cache quando necessário (redis, cache em memória ou cache de respostas HTTP). Evite arquivos gigantes — se um arquivo ultrapassa 500 linhas, refatore-o em múltiplos arquivos menores."

📌 Pilares: ⚡ — Código enxuto = menos processamento, menos memória, mais velocidade.

---

## 43. Comentários no Código

"**Comente apenas regras importantes** ou trechos de lógica não óbvia. Exemplo correto: `// Validação obrigatória de permissão administrativa`. Exemplo errado: `// Soma dois números` — código autoexplicativo não precisa de comentário. Prefira código limpo e nomes descritivos a comentários."

📌 Pilares: 🧠 — Comente o *porquê*, não o *o quê*.

---

## 44. Versionamento Semântico

"Use **Versionamento Semântico (SemVer)** no formato `MAJOR.MINOR.PATCH`. Exemplos: `1.0.0` (primeira versão estável), `1.1.0` (nova funcionalidade compatível), `1.1.1` (correção de bug compatível), `2.0.0` (mudança incompatível). Atualize a versão no `package.json` a cada release."

📌 Pilares: 🌱 — SemVer comunica o impacto de cada mudança para toda a equipe.

---

## 45. Estrutura de Módulo

"Para cada entidade do sistema, crie um módulo com a estrutura: `entidade.controller.js`, `entidade.service.js`, `entidade.repository.js`, `entidade.routes.js`, `entidade.validation.js` e `entidade.utils.js`. Exemplo: `usuarios.controller.js`, `usuarios.service.js`, `usuarios.repository.js`, `usuarios.routes.js`. A pasta do módulo pode ficar dentro de `controllers/` ou em uma pasta específica `modulos/`."

📌 Pilares: 🧠🌱 — Módulos autocontinentes = inteligência estrutural + evolução independente.

---

## 46. Checklist Pré-Produção

"Antes de publicar qualquer sistema em produção, verifique:
- **Segurança:** Helmet ativo, Rate Limit configurado, validações implementadas, sanitização ativa, hash de senha com bcrypt.
- **Organização:** Separação correta controller/service/repository, SOLID aplicado, arquivos organizados, nomes padronizados.
- **GitHub:** `.gitignore` correto, README atualizado, variáveis no `.env` (não no código), nenhum segredo exposto.
- **VPS:** PM2 configurado, HTTPS ativo, NGINX funcionando, logs ativos, aplicação não roda como root."

📌 Pilares: 🛡️🚀 — O checklist é a certificação de que o sistema é confiável e está pronto para transformar.

---

## 47. Padrão Corporativo NIT

"O sistema deve seguir o **Padrão Oficial NIT**: organização modular, código limpo, separação de responsabilidades, segurança por padrão, escalabilidade, legibilidade e facilidade de manutenção. O objetivo final é criar sistemas profissionais, seguros, escaláveis, fáceis de manter, compatíveis com VPS e GitHub, prontos para crescimento empresarial."

📌 Pilares: 🚀 — O padrão NIT existe para que todo sistema entregue valor com qualidade consistente.

---

## 48. Padrão para Criar App no Google AI Studio (NIT)

"Crie usando somente **HTML**, **CSS** e **JavaScript puro** no frontend com **Node.js** e **SQLite3** no backend, separando em duas pastas: `public/` e `backend/`. Siga toda a estrutura, nomeação, validação de segurança e padrões definidos neste guia. O sistema deve transparecer os pilares: 🧠 Inteligência, ⚡ Eficiência, 🛡️ Confiabilidade, 🌱 Evolução e 🚀 Transformação."

📌 Pilares: 🧠⚡🛡️🌱🚀 — Prompt inicial do Google AI Studio deve gerar código alinhado a todos os pilares.