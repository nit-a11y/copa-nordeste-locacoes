# 🏛️ Pilares Basilares do Setor NIT — Guia de Aplicação e Verificação

> Este documento detalha como aplicar e verificar cada pilar em todas as etapas do desenvolvimento.
> A ordem é hierárquica: **Inteligência → Eficiência → Confiabilidade → Evolução → Transformação**.
> Nenhum pilar inferior pode ser atendido sacrificando um pilar superior.

---

## 🧠 1. Inteligência

> **Soluções pensadas com estratégia, lógica e visão de negócio — nunca código automático ou sem propósito.**

### O que significa na prática
Cada linha de código deve ter uma razão clara para existir. Não se escreve código "porque sim", "porque é padrão" ou "porque funcionou em outro projeto". A inteligência exige que o desenvolvedor entenda o problema antes de codificar a solução.

### Como aplicar
- **Nomear com propósito:** Variáveis, funções e classes devem ter nomes que revelem intenção (`buscarUsuarioPorId` e não `buscar`)
- **Estruturar com lógica:** A arquitetura do projeto deve refletir o domínio do negócio, não o acaso
- **Separar responsabilidades:** Cada arquivo, função e classe tem um motivo único para existir
- **Documentar o porquê:** Comentários explicam decisões não óbvias, não o que o código já diz
- **Escolher a ferramenta certa:** Não adicionar bibliotecas sem necessidade — cada dependência é uma decisão estratégica
- **Pensar no tomorrow:** Código é lido muito mais vezes do que é escrito

### Como verificar (checklist)
- [ ] Cada variável/função/classe tem um nome que revela sua intenção?
- [ ] A estrutura do projeto está organizada por domínio, não por tipo técnico?
- [ ] Cada arquivo tem uma única responsabilidade clara?
- [ ] As decisões técnicas (bibliotecas, padrões) são justificáveis?
- [ ] Um novo desenvolvedor consegue entender o fluxo sem explicação oral?

### Sinais de falha
- Nomes genéricos (`dados`, `info`, `tmp`, `teste`)
- Arquivos com mais de 500 linhas
- Funções que fazem mais de uma coisa
- Lógica de negócio misturada com código de infraestrutura
- Dependências não utilizadas no `package.json`

---

## ⚡ 2. Eficiência

> **Otimização de recursos, desempenho e simplicidade — fazer mais com menos.**

### O que significa na prática
O sistema deve entregar o máximo de valor com o mínimo de recursos (processamento, memória, banda, tempo de desenvolvimento). Código eficiente é código enxuto, direto e sem desperdício.

### Como aplicar
- **Queries enxutas:** Selecionar apenas as colunas necessárias, usar `LIMIT`, evitar `SELECT *`
- **Prepared statements:** Uma query preparada é mais eficiente que uma concatenada (além de segura)
- **CSS otimizado:** Mobile First, variáveis CSS, evitar redundância
- **JS assíncrono:** `async/await` para não bloquear a thread
- **Cache estratégico:** Dados que não mudam com frequência devem ser cacheados
- **Arquivos enxutos:** Máximo de 300~500 linhas por arquivo
- **Requisições mínimas:** Reduzir chamadas HTTP, consolidar assets, usar minificação
- **Lazy loading:** Carregar apenas o que é necessário no momento

### Como verificar (checklist)
- [ ] As queries SQL selecionam apenas colunas necessárias?
- [ ] Há uso consistente de prepared statements?
- [ ] O CSS segue Mobile First (sem estilos desktop desnecessários)?
- [ ] Operações assíncronas usam `async/await` em vez de callbacks ou `then()`?
- [ ] Arquivos têm no máximo 500 linhas?
- [ ] Há cache implementado onde faz sentido?
- [ ] Assets estão minificados para produção?

### Sinais de falha
- `SELECT *` em queries de produção
- `.then()` encadeados sem necessidade
- CSS duplicado ou regras não utilizadas
- Assets sem minificação em produção
- Múltiplas requisições HTTP onde uma bastaria

---

## 🛡️ 3. Confiabilidade

> **Segurança, previsibilidade e consistência — o sistema não falha sem que saibamos por quê.**

### O que significa na prática
O sistema deve ser seguro, previsível e auditável. O usuário e o negócio precisam confiar que o sistema funciona corretamente e que, se algo der errado, será detectado e rastreável.

### Como aplicar
- **Validação duplicada:** Frontend valida para experiência do usuário; backend valida como barreira de segurança real
- **Prepared statements:** Toda query usa `?` como placeholder — SQL Injection é inaceitável
- **Helmet:**Headers HTTP de segurança ativos em toda aplicação Express
- **Rate Limit:** Proteção contra abuso em rotas críticas (login, cadastro)
- **Sanitização:** Toda entrada do usuário é limpa antes de processar ou armazenar
- **Hash de senhas:** `bcrypt` com salt — nenhuma senha em texto puro
- **Logs:** Erros, logins, exclusões e alterações críticas são registrados
- **Tratamento de erros:** Nunca expor stack trace ou erro bruto ao cliente
- **Respostas padronizadas:** `{ sucesso, mensagem, dados }` consistente em toda API
- **Secrets protegidos:** `.env` no `.gitignore`, sem senhas no código
- **HTTPS obrigatório:** Toda comunicação criptografada em produção

### Como verificar (checklist)
- [ ] Toda rota crítica tem validação no backend?
- [ ] Nenhuma query concatena valores diretamente na string SQL?
- [ ] Helmet está configurado e ativo?
- [ ] Rate Limit está aplicado em rotas sensíveis?
- [ ] Entradas do usuário são sanitizadas?
- [ ] Senhas usam `bcrypt` com salt ≥ 10?
- [ ] Logs registram erros, logins e operações críticas?
- [ ] Respostas de erro não expõem detalhes internos?
- [ ] `.env` está no `.gitignore`?
- [ ] HTTPS está configurado em produção?

### Sinais de falha
- Query com concatenação de string (`SELECT * FROM usuarios WHERE id = ${id}`)
- `res.send(error)` retornando erro bruto
- Senha armazenada em texto puro no banco
- `.env` versionado no repositório
- Rota de login sem rate limit
- Erro 500 sem log correspondente

---

## 🌱 4. Evolução

> **Capacidade de crescer, ser mantido e adaptado sem quebrar o que já funciona.**

### O que significa na prática
O software não é estático — ele vai crescer, mudar de requisitos, receber novos módulos e ser mantido por diferentes desenvolvedores. O código precisa ser preparado para essa realidade.

### Como aplicar
- **SOLID:** Cada princípio existe para garantir que o código evolua sem quebrar
  - **S** — Single Responsibility: cada classe/arquivo muda por um único motivo
  - **O** — Open/Closed: extender comportamento, nunca modificar código que funciona
  - **L** — Liskov: comportamentos previsíveis — nada de surpresas
  - **I** — Interface Segregation: interfaces pequenas e específicas
  - **D** — Dependency Inversion: depender de abstrações, não de implementações
- **Versionamento Semântico:** `MAJOR.MINOR.PATCH` para comunicar impacto de mudanças
- **Git branches:** `main`, `develop`, `feature/*`, `hotfix/*` — nunca trabalhar direto na main
- **Commits padronizados:** Conventional Commits (`feat:`, `fix:`, `refactor:`, etc.)
- **Migrações de banco:** Banco evolui via migrations versionadas, nunca por script ad-hoc
- **Módulos independentes:** Cada entidade tem seu próprio conjunto controller/service/repository/routes
- **Testabilidade:** Código organizado para ser testável (embora testes não sejam obrigatórios neste guia)

### Como verificar (checklist)
- [ ] O código segue os 5 princípios SOLID?
- [ ] O versionamento segue SemVer (`MAJOR.MINOR.PATCH`)?
- [ ] Os commits seguem Conventional Commits?
- [ ] Branches seguem o fluxo `develop → feature → main`?
- [ ] Mudanças no banco são feitas via migration?
- [ ] Cada entidade tem seu módulo isolado?
- [ ] É possível adicionar uma nova funcionalidade sem modificar código existente?

### Sinais de falha
- Arquivo de 2000 linhas que "ninguém mexe porque quebra"
- Commit message vaga (`arrumado`, `teste`, `final`)
- Branch `main` recebendo commits diretos
- Mudança no banco feita na mão no SQLite
- Função que faz 3 coisas diferentes e ninguém sabe separar

---

## 🚀 5. Transformação

> **Impacto real no negócio e nas pessoas — o código existe para gerar valor.**

### O que significa na prática
O software não é um fim em si mesmo. Ele existe para resolver problemas reais de pessoas reais. Transformação é o pilar que conecta o código ao impacto: o sistema precisa chegar à produção, ser usado e fazer diferença.

### Como aplicar
- **Pronto para produção:** Checklist pré-deploy obrigatório
- **VPS configurada:** PM2, NGINX, HTTPS, logs, usuário não-root
- **Documentação mínima:** README com instruções de setup, .env.example, estrutura do projeto
- **Padrão corporativo:** O sistema segue o padrão NIT para ser compreensível por qualquer dev da equipe
- **Orientação ao usuário:** A interface é pensada para quem vai usar, não para quem vai desenvolver
- **Deploy automatizado:** Processo documentado e repetível
- **Monitoramento:** Logs ativos para identificar problemas antes do usuário reclamar

### Como verificar (checklist)
- [ ] O sistema está rodando em produção com PM2?
- [ ] HTTPS está ativo com certificado válido?
- [ ] NGINX está configurado como proxy reverso?
- [ ] Logs estão ativos e sendo monitorados?
- [ ] README tem instruções claras de setup e deploy?
- [ ] O sistema resolve o problema de negócio para o qual foi criado?
- [ ] Um novo dev consegue subir o ambiente local em menos de 15 minutos?

### Sinais de falha
- Sistema funciona local mas "deploy é com o X"
- README vazio ou inexistente
- Sem logs em produção — "descobrimos o erro quando o usuário reclama"
- NGINX não configurado, Node.js exposto diretamente na porta
- Aplicação rodando como root no servidor

---

## 📋 Verificação Integrada (Pré-Commit/Pré-Deploy)

Antes de todo commit e todo deploy, passe o código por este crivo rápido:

```txt
🧠 INTELIGÊNCIA  → O nome revela a intenção? A estrutura faz sentido?
⚡ EFICIÊNCIA    → Tem desperdício? Dá pra simplificar?
🛡️ CONFIABILIDADE → Tá seguro? Tá validado? Tá logado?
🌱 EVOLUÇÃO      → Vai quebrar quando alguém mexer? Dá pra extender?
🚀 TRANSFORMAÇÃO → Isso entrega valor? Tá pronto pra produção?
```

Se qualquer resposta for "não", o pilar correspondente precisa ser ajustado antes de prosseguir.
