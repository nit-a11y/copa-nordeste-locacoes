# 🏆 Arena NDL

## Plataforma Interativa de Gamificação para Disseminação da Cultura Organizacional

**Copa Nordeste Locações**

---

## 📋 Agenda

1. Contexto & Problema
2. Proposta & Pilares
3. As Ligas — Cultura em Campo
4. Cartas & Atributos — Quem é Quem
5. Treinamento & Quizzes — Aprendizado na Prática
6. Arena — Campanha & Partidas
7. PvP — Integração Entre Colegas
8. Reconhecimento — Troféus & Ranking
9. Arquitetura Técnica
10. Impacto & Próximos Passos

---

## 🧩 Contexto

### Problema

- Cultura organizacional dispersa entre setores
- Treinamentos operacionais (NR-35, NR-12, segurança) vistos como obrigação burocrática
- Baixa integração entre colaboradores de diferentes áreas
- Dificuldade em medir engajamento com os valores da empresa

### Oportunidade

> "As pessoas não se engajam com manuais. Elas se engajam com **desafios, histórias e reconhecimento**."

Transformar a cultura e o treinamento em uma **experiência lúdica e competitiva**.

---

## 🎯 Proposta

### Arena NDL

Uma **plataforma gamificada** onde cada colaborador é protagonista.

| De | Para |
|----|------|
| Treinamento obrigatório | Desafio com recompensa |
| Desconhecimento entre setores | Duelo entre colegas |
| Cultura no papel | Conquistas visíveis |
| Engajamento abstrato | Métricas concretas (partidas, XP, moedas) |

---

## 🏛️ Pilares

```
┌──────────────────────────────────────┐
│         ARENA NDL                    │
├──────────┬───────────┬───────────────┤
│  CULTURA │ TREINO    │  INTEGRAÇÃO   │
│  &       │  &        │  &            │
│  PERTEN- │  OPERA-   │  RECONHECI-  │
│  CIMENTO │  CIONAL   │  MENTO        │
├──────────┴───────────┴───────────────┤
│  Ligas temáticas  │  PvP entre       │
│  representam      │  colegas com     │
│  setores reais    │  times reais     │
├──────────────────────────────────────┤
│  Quizzes de segurança e processos   │
│  Cartas colecionáveis com atributos │
│  Troféus e ranking visíveis a todos │
└──────────────────────────────────────┘
```

---

## ⚽️ As Ligas — Cultura em Campo

Cada setor vira uma **Liga** com tiers progressivos:

| Liga | Setor | Tiers |
|------|-------|-------|
| 🔧 **Manutenção** | Manutenção Predial | 4 tiers |
| 💼 **Comercial** | Vendas & Comercial | 4 tiers |
| 🚚 **Logística** | Logística & Entregas | 3 tiers |
| 📊 **Administrativa** | ADM & Financeiro | 4 tiers |
| 👑 **Elite** | NIT & Liderança | 4 tiers |

> ⚡ Vencer um tier = recompensa em moedas NDL + XP
> 🏆 Vencer a liga inteira = Troféu exclusivo

### Mecânica das Ligas

```
Liga da Manutenção
├── Tier 1: Básico     →  +80 NDL
├── Tier 2: Intermediário → +120 NDL
├── Tier 3: Avançado   → +180 NDL
└── Tier 4: Expert     → +280 NDL
                       ─────────
               Total:    660 NDL
```

---

## 🃏 Cartas & Atributos — Quem é Quem

15 colaboradores reais da NDL representados como **cartas colecionáveis**.

### Raridades

```
⭐ Comum   → base
⭐⭐ Raro   → atributos elevados
⭐⭐⭐ Épico → destaque no setor
⭐⭐⭐⭐ Lendário → referência na empresa
⭐⭐⭐⭐⭐ Mítico → raríssimo, atributos máximos
```

### Atributos

| Atributo | Função na Partida |
|----------|-------------------|
| ⚡ **Velocidade** | Drible, desmarque, corrida |
| 🎯 **Chute** | Finalização, gols |
| 🛡️ **Defesa** | Desarme, defesa do goleiro |
| 🔋 **Energia** | Stamina durante a partida |

**Overall** = média dos 4 atributos

---

## 📊 Evolução das Cartas

### Sistema de Níveis

```
Nível 1 ──► 10 XP ──► Nível 2 ──► ...
                              ▲
                         +5 por treino
                        (custa 40 XP)

XP máx por nível: 100
Nível máximo: 10
```

### Treino de Posição

- Goleiro · Defensor · Ala Esquerda · Ala Direita · Atacante
- Custo: **300 NDL**
- Permite escalar a carta em múltiplas posições no campo

### Fontes de XP

| Ação | XP |
|------|----|
| ✅ Acertar quiz | +50 XP (carta aleatória) |
| ⚽ Partida (qualquer resultado) | +15 XP por titular |
| 📦 Carta duplicada no booster | +150 XP |
| 📚 Treinar atributo | −40 XP (custo) |

---

## 🧠 Quizzes — Aprendizado na Prática

### Categorias

| Categoria | Temas |
|-----------|-------|
| 🏢 **Empresa** | Missão, visão, valores, história da NDL |
| 🔒 **Segurança** | NR-35 (altura), NR-12 (máquinas), EPIs |
| 🔧 **Operacional** | Processos, procedimentos, manutenção |
| 🏗️ **Setores** | Rotinas específicas de cada área |

### Funcionamento

```
Modo Infinito
     │
     ▼
Pergunta aleatória com 4 alternativas
     │
     ├── ✅ Acerto: +80 NDL · +50 XP
     │                └── Tela verde + confetes
     │
     └── ❌ Erro: +15 NDL (consolação)
                      └── Tela vermelha + resposta correta
```

---

## 🏟️ Arena — Simulação de Partidas

### O Coração do Jogo

Partida de futebol 2D simulada em tempo real via **WebSocket**.

```
Timer a cada 200ms
     │
     ▼
  │‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾│
  │  POSICIONAMENTO   │ ← formação 4-1 (Gol, Def, ALA-E, ALA-D, ATA)
  │  CÁLCULO DE POSSE │ ← baseado em Velocidade + Chute
  │  AÇÕES DE JOGO    │ ← passe, drible, desarme, finalização
  │  GOL?             │ ← Chute vs Defesa do goleiro
  │  CLIMA            │ ← Sol ☀️ | Nublado ☁️ | Chuva 🌧️
  │  EVENTOS          │ ← narração automática
  │____________________│
```

### Habilidades Especiais

| Raridade | Habilidade |
|----------|-----------|
| Épico | ⚡ **Chute Atômico** — 40% mais força na finalização |
| Lendário | 💨 **Velocidade da Luz** — +50% velocidade nos deslocamentos |
| Mítico | 🏰 **Muralha Defensiva** — goleiro com 60% a mais de defesa |

---

## ⚔️ PvP — Integração Entre Colegas

### Proposta

> "E se você pudesse desafiar o time do João da Logística?"

Cada colaborador monta seu **time titular real**. Na seção **Liga**, é possível:

1. Ver os oponentes disponíveis (outros usuários)
2. Ver o overall do time deles
3. Desafiar para uma partida

### Diferenciais

- ✅ Time titular **real** do oponente (com treinos e níveis)
- ✅ Partida simulada com as mesmas regras da Arena
- ✅ Resultado salvo para ambos os lados
- ✅ Histórico dos últimos 4 duelos
- ✅ Ranking de vitórias/derrotas

---

## 🏆 Reconhecimento — Troféus & Ranking

### Troféus Desbloqueáveis

```
🏆 Melhor do Mês         ──  Completar Liga da Manutenção
🏆 Vendedor Destaque     ──  Completar Liga Comercial
🏆 Entregador Ágil       ──  Completar Liga Logística
🏆 Guardião do Orçamento ──  Completar Liga Administrativa
🏆 Lenda da Nordeste     ──  Completar Liga de Elite
🏆 Colaborador Padrão    ──  6 quizzes acertados
🏆 Treinador Lendário    ──  Carta Nível 10
```

### Ranking Global

- **Posição** no leaderboard
- **Vitórias** totais (campanha + PvP)
- **Gols marcados**

---

## 🛍️ Economia do Jogo

### Moeda: NDL

```
NDL ◄──────────────────┐
  │                     │
  ├─ Quiz (acerto) +80  │
  ├─ Quiz (erro)   +15  │
  ├─ Partida    +80~450 │
  └─ Rejogada    50%    │
                         │
  ─── GASTOS ───         │
  ├─ Booster Bronze: 150 ─┘
  ├─ Booster Prata:  300
  ├─ Booster Ouro:   600
  ├─ Booster Lendário: 1200
  ├─ Treino Posição: 300
  └─ Treino Atributo: grátis (XP)
```

### Pacotes Booster

| Pacote | Custo | ⚡ Raridade mais alta |
|--------|-------|----------------------|
| 📦 Bronze | 150 | Épico (2%) |
| 📦 Prata | 300 | Lendário (2%) |
| 📦 Ouro | 600 | Mítico (2%) |
| 📦 Lendário | 1200 | Mítico (7%) |

---

## 🏗️ Arquitetura Técnica

```
┌──────────┐    ┌──────────────────┐    ┌──────────┐
│  CLIENTE │◄──►│    SERVIDOR      │◄──►│ SQLite   │
│  (SPA)   │    │  Express + WS    │    │   DB     │
│  index   │    │                  │    │          │
│  .html   │    │  Controllers     │    │ nordeste │
│          │    │  Services        │    │ _copa.db │
│  CSS     │    │  Repositories    │    │          │
│  JS      │    │  Middlewares     │    └──────────┘
└────▲─────┘    └──────────────────┘
     │  HTTP REST + WebSocket
     │
     ┌───────────────────────┐
     │      Navegador        │
     │  Canvas (partículas)  │
     │  CSS Grid (layout)    │
     │  DOM dinâmico (JS)    │
     └───────────────────────┘
```

### Stack

| Camada | Tecnologia |
|--------|-----------|
| Servidor | Node.js + Express |
| Tempo Real | WebSocket (`ws`) |
| Banco | SQLite3 |
| Frontend | Vanilla JS (ES Modules) |
| Estilo | CSS custom (tema escuro) |
| Segurança | Helmet + CORS + Rate Limit |

---

## 📊 Métricas de Impacto

| Indicador | Como a Plataforma Contribui |
|-----------|---------------------------|
| 🎯 **Taxa de conclusão de treinamentos** | Substitui curso chato por quiz recompensador |
| 🤝 **Integração entre setores** | PvP aproxima colegas de áreas diferentes |
| 🏆 **Reconhecimento de talentos** | Troféus e ranking dão visibilidade |
| 📈 **Engajamento com cultura** | Cada liga temática reforça valores do setor |
| 🔁 **Retenção de conhecimento** | Quiz infinito força revisão constante |

---

## 🚀 Próximos Passos

- Temporadas com reset de ranking e premiação
- Torneios agendados entre setores
- Loja de cosméticos (temas visuais para cartas)
- Notificações push para desafios
- Aplicativo mobile (PWA)
- Expansão de quizzes com conteúdos novos

---

## 👨‍💻 Ficha Técnica

```
Projeto:      Copa Nordeste Locações — Arena NDL
Desenvolvedor: Caique Custodio — NIT
Ano:          2025
Licença:      Proprietária — Nordeste Locações
Repositório:  [privado]
```

---

## 🙋 Perguntas?

> **"A cultura não se decreta. Ela se joga."**

---

### ⚡ Links Úteis

- 📖 [README.md](./README.md) — documentação técnica completa
- 🖥️ `npm run dev` — iniciar servidor local

---

*Apresentação gerada em Junho de 2026*
