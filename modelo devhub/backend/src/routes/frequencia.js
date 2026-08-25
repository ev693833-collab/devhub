const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Auto-criação da tabela "frequencia_alunos" no MySQL
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS frequencia_alunos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        aluno_nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        aulas_assistidas INT DEFAULT 0,
        total_aulas INT DEFAULT 3,
        frequencia_pct INT DEFAULT 0,
        status_badge VARCHAR(100) DEFAULT '⏳ Sem Presença',
        status_color VARCHAR(20) DEFAULT '#64748B',
        ultima_presenca VARCHAR(50) DEFAULT 'Nenhuma',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tabela 'frequencia_alunos' verificada/criada no MySQL!");
  } catch (err) {
    console.error("Erro ao criar tabela 'frequencia_alunos':", err);
  }
})();

// GET - Listar relatório de frequência
router.get("/", async (req, res) => {
  try {
    const [frequencias] = await db.query("SELECT * FROM frequencia_alunos ORDER BY id DESC");
    const formatadas = frequencias.map(f => ({
      id: f.id,
      userId: f.user_id,
      nome: f.aluno_nome,
      email: f.email,
      cargo: "Estudante 👤",
      aulasAssistidas: f.aulas_assistidas,
      totalAulas: f.total_aulas,
      frequenciaPct: f.frequencia_pct,
      statusBadge: f.status_badge,
      statusColor: f.status_color,
      ultimaPresenca: f.ultima_presenca,
      avatar: "🎓"
    }));
    res.json(formatadas);
  } catch (error) {
    console.error("Erro ao buscar frequência:", error);
    res.status(500).json({ message: "Erro ao buscar relatório de frequência" });
  }
});

// POST/PUT - Salvar ou atualizar presença do estudante
router.post("/", async (req, res) => {
  const { userId, nome, email, aulasAssistidas, totalAulas, frequenciaPct, statusBadge, statusColor, ultimaPresenca } = req.body;

  if (!email) {
    return res.status(400).json({ message: "E-mail é obrigatório." });
  }

  try {
    const [existentes] = await db.query("SELECT id FROM frequencia_alunos WHERE email = ? OR user_id = ?", [email, userId || 0]);

    if (existentes.length > 0) {
      await db.query(
        "UPDATE frequencia_alunos SET aluno_nome=?, email=?, aulas_assistidas=?, total_aulas=?, frequencia_pct=?, status_badge=?, status_color=?, ultima_presenca=? WHERE id=?",
        [nome, email, aulasAssistidas, totalAulas, frequenciaPct, statusBadge, statusColor, ultimaPresenca, existentes[0].id]
      );
      res.json({ message: "Frequência atualizada com sucesso!" });
    } else {
      const [result] = await db.query(
        "INSERT INTO frequencia_alunos (user_id, aluno_nome, email, aulas_assistidas, total_aulas, frequencia_pct, status_badge, status_color, ultima_presenca) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [userId || null, nome, email, aulasAssistidas || 1, totalAulas || 3, frequenciaPct || 33, statusBadge || "⚡ Presença Regular", statusColor || "#F59E0B", ultimaPresenca || "Hoje"]
      );
      res.status(201).json({ message: "Registro de presença cadastrado com sucesso!", id: result.insertId });
    }
  } catch (error) {
    console.error("Erro ao salvar frequência:", error);
    res.status(500).json({ message: "Erro ao salvar presença" });
  }
});

module.exports = router;
