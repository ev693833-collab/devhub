const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Auto-criar tabelas no MySQL se não existirem
(async () => {
  try {
    if (db && typeof db.query === "function") {
      await db.query(`
        CREATE TABLE IF NOT EXISTS devhub_gamificacao (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT UNIQUE,
          email VARCHAR(255),
          nivel INT DEFAULT 14,
          xp INT DEFAULT 8420,
          xp_max INT DEFAULT 10000,
          streak_dias INT DEFAULT 12,
          historico_dias JSON,
          skills JSON,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS devhub_batalhas (
          id INT AUTO_INCREMENT PRIMARY KEY,
          desafio VARCHAR(255),
          aluno1_nome VARCHAR(255),
          aluno2_nome VARCHAR(255),
          vencedor_nome VARCHAR(255),
          status VARCHAR(50) DEFAULT 'concluida',
          tempo_segundos INT DEFAULT 45,
          erros INT DEFAULT 0,
          xp_ganho INT DEFAULT 250,
          data_batalha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
      `);
      console.log("📌 Tabelas devhub_gamificacao e devhub_batalhas verificadas/criadas no MySQL.");
    }
  } catch (err) {
    console.warn("⚠️ Aviso de auto-migração de batalhas:", err.message);
  }
})();

// Dados iniciais padrão de Gamificação (Zerados para inicio de jornada do aluno)
const getGamificacaoPadrao = (email = "aluno@devhub.com") => ({
  nivel: 1,
  xp: 0,
  xp_max: 1000,
  streak_dias: 1,
  historico_dias: [
    { dia: "Seg", concluido: false },
    { dia: "Ter", concluido: false },
    { dia: "Qua", concluido: false },
    { dia: "Qui", concluido: false },
    { dia: "Sex", concluido: false },
    { dia: "Sáb", concluido: false },
    { dia: "Dom", concluido: false }
  ],
  skills: [
    { nome: "JavaScript", progresso: 0, cor: "#F7DF1E" },
    { nome: "React", progresso: 0, cor: "#61DAFB" },
    { nome: "Node.js", progresso: 0, cor: "#68A063" },
    { nome: "SQL", progresso: 0, cor: "#00758F" },
    { nome: "Git", progresso: 0, cor: "#F05032" }
  ]
});

// Desafios de Batalha de Código pré-cadastrados (10 temas diversificados)
const desafiosBatalha = [
  {
    id: 1,
    titulo: "Sistema de Cadastro & Filtro de Usuários",
    categoria: "JavaScript ES6 / Programação Funcional",
    dificuldade: "Médio",
    enunciado: "Filtre uma lista de objetos de usuários e retorne apenas os usuários ativos com idade >= 18.",
    codigoInicial: ""
  },
  {
    id: 2,
    titulo: "Validação de Parênteses & Chaves Balanceados",
    categoria: "Estrutura de Dados / Pilha (Stack)",
    dificuldade: "Difícil",
    enunciado: "Crie uma função para verificar se uma string de parênteses como '({[]})' está balanceada.",
    codigoInicial: ""
  },
  {
    id: 3,
    titulo: "Cálculo do Fatorial de um Número",
    categoria: "Matemática & Lógica",
    dificuldade: "Fácil",
    enunciado: "Crie uma função que receba um número inteiro positivo n e retorne o seu fatorial (ex: 5! = 120).",
    codigoInicial: ""
  },
  {
    id: 4,
    titulo: "Inversão de String & Palíndromo",
    categoria: "String & Manipulação de Texto",
    dificuldade: "Fácil",
    enunciado: "Escreva um algoritmo para verificar se uma palavra é um palíndromo (ex: 'arara').",
    codigoInicial: ""
  },
  {
    id: 5,
    titulo: "Encontrar o Maior Número em um Array",
    categoria: "Arrays / Vetores",
    dificuldade: "Fácil",
    enunciado: "Crie uma função que receba uma lista de números inteiros e retorne o maior número contido nela.",
    codigoInicial: ""
  },
  {
    id: 6,
    titulo: "Contagem de Vogais em uma Frase",
    categoria: "Strings & RegEx",
    dificuldade: "Fácil",
    enunciado: "Crie um algoritmo que receba um texto e conte quantas vogais (a, e, i, o, u) ele possui.",
    codigoInicial: ""
  },
  {
    id: 7,
    titulo: "Remoção de Duplicados de uma Lista",
    categoria: "ES6 Sets / Arrays",
    dificuldade: "Médio",
    enunciado: "Crie uma função que receba um array com elementos repetidos e retorne apenas os valores únicos.",
    codigoInicial: ""
  },
  {
    id: 8,
    titulo: "Soma de Números Pares",
    categoria: "Lógica de Programação",
    dificuldade: "Fácil",
    enunciado: "Escreva uma função que receba um array de inteiros e retorne a soma de todos os números pares.",
    codigoInicial: ""
  },
  {
    id: 9,
    titulo: "Algoritmo FizzBuzz Clássico",
    categoria: "Estruturas Condicionais",
    dificuldade: "Médio",
    enunciado: "Retorne 'Fizz' para múltiplos de 3, 'Buzz' para múltiplos de 5 e 'FizzBuzz' para múltiplos de ambos.",
    codigoInicial: ""
  },
  {
    id: 10,
    titulo: "Implementação de Debounce em JS",
    categoria: "JavaScript Avançado / Timers",
    dificuldade: "Desafiador",
    enunciado: "Implemente uma função debounce(fn, delay) que atrase a execução da função até que o tempo expire.",
    codigoInicial: ""
  }
];

// In-Memory Invites Array & Active Accepted Duels
let convitesPendentes = [
  {
    id: 1,
    remetenteNome: "bia brasil",
    destinatarioNome: "Enzo Vieira",
    desafioId: 1,
    desafioTitulo: "Sistema de Cadastro & Filtro de Usuários",
    dificuldade: "Médio",
    status: "pendente",
    data: "Agora mesmo"
  }
];

let duelosAceitos = [];

// Ranking semanal padrão de Gladiadores do DevHub
let rankingSemanal = [
  { posicao: 1, nome: "Enzo Vieira", vitorias: 28, batalhas: 30, xp: 9400, avatar: "👑" },
  { posicao: 2, nome: "Nicholas araujo", vitorias: 24, batalhas: 27, xp: 8850, avatar: "🔥" },
  { posicao: 3, nome: "Gabriel Costa", vitorias: 19, batalhas: 22, xp: 7600, avatar: "⚡" },
  { posicao: 4, nome: "Lucas Mendes", vitorias: 16, batalhas: 20, xp: 6900, avatar: "🛡️" },
  { posicao: 5, nome: "Mariana Souza", vitorias: 14, batalhas: 18, xp: 6200, avatar: "💻" }
];

// Histórico de batalhas inicial
let historicoBatalhas = [
  { id: 101, desafio: "Sistema de cadastro de usuários", aluno1: "Enzo Vieira", aluno2: "Nicholas araujo", vencedor: "Enzo Vieira", tempo: "42s", erros: 0, data: "Há 15 min" },
  { id: 102, desafio: "Inversão de String & Palíndromo", aluno1: "Gabriel Costa", aluno2: "Mariana Souza", vencedor: "Gabriel Costa", tempo: "38s", erros: 1, data: "Há 1 hora" }
];

// GET /gamificacao/stats — Retorna estatísticas de XP, Streak e Skills do Aluno
router.get("/stats", async (req, res) => {
  try {
    const email = req.query.email || "aluno@devhub.com";
    return res.json(getGamificacaoPadrao(email));
  } catch (err) {
    return res.json(getGamificacaoPadrao());
  }
});

// GET /batalhas — Retorna lista de desafios, ranking, histórico e se algum duelo foi aceito para o usuário
router.get("/", async (req, res) => {
  try {
    const { nome } = req.query;
    const nomeLower = (nome || "").toLowerCase().trim();

    // 🕐 Limpar convites expirados automaticamente
    const agora = Date.now();
    convitesPendentes = convitesPendentes.filter(c => !c.expirarEm || c.expirarEm > agora);

    let dueloAceitoParaUsuario = null;
    
    if (nomeLower) {
      dueloAceitoParaUsuario = duelosAceitos.find(
        d => d.remetenteNome.toLowerCase().trim() === nomeLower && d.status === "aceito"
      ) || null;
    }

    return res.json({
      desafios: desafiosBatalha,
      ranking: rankingSemanal,
      historico: historicoBatalhas,
      convites: convitesPendentes,
      dueloAceito: dueloAceitoParaUsuario
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar batalhas." });
  }
});

// GET /batalhas/convites — Lista convites pendentes
router.get("/convites", (req, res) => {
  const { nome } = req.query;
  const usuarioFiltro = (nome || "").toLowerCase().trim();
  const convitesDoUsuario = convitesPendentes.filter(
    c => !usuarioFiltro || c.destinatarioNome.toLowerCase().includes(usuarioFiltro) || c.remetenteNome.toLowerCase().includes(usuarioFiltro)
  );
  return res.json(convitesDoUsuario);
});

// POST /batalhas/convites — Envia novo convite de duelo
router.post("/convites", (req, res) => {
  const { remetenteNome, destinatarioNome, desafioId } = req.body;
  
  let desafio;
  if (desafioId === "random" || !desafioId) {
    const sortIndex = Math.floor(Math.random() * desafiosBatalha.length);
    desafio = desafiosBatalha[sortIndex];
  } else {
    desafio = desafiosBatalha.find(d => d.id === parseInt(desafioId)) || desafiosBatalha[0];
  }

  const EXPIRY_MS = 3 * 60 * 1000; // 3 minutos
  const novoConvite = {
    id: Date.now(),
    remetenteNome: remetenteNome || "Estudante",
    destinatarioNome: destinatarioNome || "Nicholas araujo",
    desafioId: desafio.id,
    desafioTitulo: desafio.titulo,
    dificuldade: desafio.dificuldade,
    status: "pendente",
    data: "Agora mesmo",
    criadoEm: Date.now(),
    expirarEm: Date.now() + EXPIRY_MS
  };

  convitesPendentes.unshift(novoConvite);
  return res.json({ success: true, convite: novoConvite, mensagem: `Solicitação de X1 enviada para ${destinatarioNome}!` });
});

// POST /batalhas/convites/responder — Aceita ou Recusa um convite
router.post("/convites/responder", (req, res) => {
  const { conviteId, resposta } = req.body; // resposta: 'aceito' | 'recusado'
  const targetId = parseInt(conviteId);
  const convite = convitesPendentes.find(c => c.id === targetId);

  if (convite) {
    convite.status = resposta;
    convitesPendentes = convitesPendentes.filter(c => c.id !== targetId);

    if (resposta === "aceito") {
      duelosAceitos.unshift({
        id: convite.id,
        remetenteNome: convite.remetenteNome,
        destinatarioNome: convite.destinatarioNome,
        desafioId: convite.desafioId,
        desafioTitulo: convite.desafioTitulo,
        status: "aceito",
        criadoEm: Date.now()
      });
    }
  }

  return res.json({
    success: true,
    resposta,
    convite,
    mensagem: resposta === "aceito" ? "⚔️ Desafio aceito! Iniciando arena 1v1..." : "❌ Convite recusado com sucesso."
  });
});

// POST /batalhas/limpar-duelo-aceito — Limpa duelo aceito consumido
router.post("/limpar-duelo-aceito", (req, res) => {
  const { remetenteNome } = req.body;
  if (remetenteNome) {
    const rLower = remetenteNome.toLowerCase().trim();
    duelosAceitos = duelosAceitos.filter(d => d.remetenteNome.toLowerCase().trim() !== rLower);
  }
  return res.json({ success: true });
});

// POST /batalhas/submeter — Finaliza uma batalha de código
router.post("/submeter", async (req, res) => {
  try {
    const { desafioId, usuarioNome, oponenteNome, codigo, tempoSegundos, erros } = req.body;
    const desafio = desafiosBatalha.find(d => d.id === parseInt(desafioId)) || desafiosBatalha[0];

    const vitorioso = erros === 0 || tempoSegundos < 60 ? (usuarioNome || "Enzo Vieira") : (oponenteNome || "Nicholas araujo");
    const xpGanho = vitorioso === usuarioNome ? 350 : 120;

    const novaBatalha = {
      id: Date.now(),
      desafio: desafio.titulo,
      aluno1: usuarioNome || "Enzo Vieira",
      aluno2: oponenteNome || "Nicholas araujo",
      vencedor: vitorioso,
      tempo: `${tempoSegundos || 45}s`,
      erros: erros || 0,
      data: "Agora mesmo"
    };

    historicoBatalhas.unshift(novaBatalha);
    if (historicoBatalhas.length > 20) historicoBatalhas.pop();

    return res.json({
      success: true,
      batalha: novaBatalha,
      vencedor: vitorioso,
      xpGanho,
      mensagem: vitorioso === usuarioNome ? "🏆 Vitória épica! Você venceu a Batalha de Código!" : "⚡ Bom combate! Tente novamente na próxima rodada."
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao submeter batalha." });
  }
});

module.exports = router;
