const express = require("express");
const router = express.Router();

// =============================================================
// SUPER ADMIN — Rotas Exclusivas
// =============================================================

// --- Anúncio Global ---
let anuncioGlobal = null;

router.post("/anuncio", (req, res) => {
  const { mensagem, autor } = req.body;
  if (!mensagem || mensagem.trim() === "") {
    return res.status(400).json({ error: "A mensagem do anúncio não pode estar vazia." });
  }
  anuncioGlobal = {
    mensagem: mensagem.trim(),
    autor: autor || "Super Admin",
    criadoEm: new Date().toISOString()
  };
  return res.json({ success: true, anuncio: anuncioGlobal });
});

router.delete("/anuncio", (req, res) => {
  anuncioGlobal = null;
  return res.json({ success: true, message: "Anúncio removido." });
});

router.get("/anuncio", (req, res) => {
  return res.json({ anuncio: anuncioGlobal });
});

// --- Log de Atividades ---
let logAtividades = [
  { id: 1, tipo: "login", usuario: "Enzo Vieira", descricao: "Fez login na plataforma", hora: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 2, tipo: "prova", usuario: "Nicholas Araujo", descricao: "Realizou a prova de JavaScript ES6+", hora: new Date(Date.now() - 18 * 60000).toISOString() },
  { id: 3, tipo: "batalha", usuario: "Gabriel Costa", descricao: "Venceu batalha X1 contra Mariana Souza", hora: new Date(Date.now() - 35 * 60000).toISOString() },
  { id: 4, tipo: "login", usuario: "Mariana Souza", descricao: "Fez login na plataforma", hora: new Date(Date.now() - 52 * 60000).toISOString() },
  { id: 5, tipo: "prova", usuario: "Lucas Mendes", descricao: "Realizou a prova de Node.js & Express", hora: new Date(Date.now() - 68 * 60000).toISOString() }
];

router.get("/logs", (req, res) => {
  return res.json({ logs: logAtividades.slice(0, 50) });
});

router.post("/logs", (req, res) => {
  const { tipo, usuario, descricao } = req.body;
  const novoLog = {
    id: Date.now(),
    tipo: tipo || "geral",
    usuario: usuario || "Anônimo",
    descricao: descricao || "",
    hora: new Date().toISOString()
  };
  logAtividades.unshift(novoLog);
  if (logAtividades.length > 100) logAtividades = logAtividades.slice(0, 100);
  return res.json({ success: true, log: novoLog });
});

// --- Analytics ---
router.get("/analytics", (req, res) => {
  const analytics = {
    usuariosAtivos: Math.floor(Math.random() * 8) + 5,
    totalLogins: 142,
    provasRealizadas: 48,
    mediaGeralNotas: 8.7,
    batalhasHoje: Math.floor(Math.random() * 6) + 2,
    totalBatalhas: 74,
    topDesafio: "Validação de Parênteses Balanceados",
    atividadesPorDia: [
      { dia: "Seg", logins: 12, provas: 6, batalhas: 4 },
      { dia: "Ter", logins: 18, provas: 9, batalhas: 7 },
      { dia: "Qua", logins: 22, provas: 11, batalhas: 9 },
      { dia: "Qui", logins: 16, provas: 7, batalhas: 5 },
      { dia: "Sex", logins: 28, provas: 14, batalhas: 12 },
      { dia: "Sab", logins: 9,  provas: 3,  batalhas: 3 },
      { dia: "Dom", logins: 5,  provas: 1,  batalhas: 1 }
    ],
    atualizadoEm: new Date().toISOString()
  };
  return res.json(analytics);
});

// --- Ranking Reset ---
router.post("/ranking/resetar", (req, res) => {
  return res.json({
    success: true,
    message: "Ranking semanal resetado com sucesso!",
    resetadoEm: new Date().toISOString()
  });
});

// --- Exportar Dados ---
router.get("/exportar", (req, res) => {
  const payload = {
    exportadoEm: new Date().toISOString(),
    versao: "1.0",
    plataforma: "DevHub",
    nota: "Dados exportados pelo Super Admin.",
    secoes: {
      analytics: {
        totalProvas: 48,
        mediaGeral: 8.7,
        totalBatalhas: 74,
        taxaAprovacao: "91%"
      },
      logs: logAtividades.slice(0, 20)
    }
  };
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", "attachment; filename=devhub-export.json");
  return res.json(payload);
});

module.exports = router;
