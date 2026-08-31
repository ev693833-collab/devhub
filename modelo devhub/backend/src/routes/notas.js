const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Auto-criação da tabela "notas_provas" no MySQL
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS notas_provas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        aluno_nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        prova1 DECIMAL(4,1) DEFAULT 0.0,
        prova2 DECIMAL(4,1) DEFAULT 0.0,
        projeto_final DECIMAL(4,1) DEFAULT 0.0,
        media_final DECIMAL(4,1) DEFAULT 0.0,
        status VARCHAR(100) DEFAULT 'Pendente ⏳',
        destaque BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tabela 'notas_provas' verificada/criada no MySQL!");
  } catch (err) {
    console.error("Erro ao criar tabela 'notas_provas':", err);
  }
})();

// GET - Listar notas de provas
router.get("/", async (req, res) => {
  try {
    const [notas] = await db.query("SELECT * FROM notas_provas ORDER BY id DESC");
    // Normaliza status antigos para os novos labels
    const normalizarStatus = (status, mediaFinal) => {
      if (!status || status.includes("Aprovado") || status.includes("Recuperação") || status.includes("Pendente")) {
        const media = parseFloat(mediaFinal) || 0;
        if (media >= 9.5) return "Excelente 🌟";
        if (media >= 7.0) return "Bom 👍";
        return "Ruim ❌";
      }
      return status;
    };

    const notasFormatadas = notas.map(n => ({
      id: n.id,
      userId: n.user_id,
      alunoNome: n.aluno_nome,
      email: n.email,
      prova1: parseFloat(n.prova1),
      prova2: parseFloat(n.prova2),
      projetoFinal: parseFloat(n.projeto_final),
      mediaFinal: parseFloat(n.media_final),
      status: normalizarStatus(n.status, n.media_final),
      destaque: Boolean(n.destaque)
    }));
    res.json(notasFormatadas);
  } catch (error) {
    console.error("Erro ao buscar notas:", error);
    res.status(500).json({ message: "Erro ao buscar notas" });
  }
});

// POST/PUT - Salvar ou atualizar nota do estudante
router.post("/", async (req, res) => {
  const { userId, alunoNome, email, prova1, prova2, projetoFinal, mediaFinal, status, destaque } = req.body;

  if (!email) {
    return res.status(400).json({ message: "E-mail do estudante é obrigatório." });
  }

  try {
    const [existentes] = await db.query("SELECT id FROM notas_provas WHERE email = ? OR user_id = ?", [email, userId || 0]);

    if (existentes.length > 0) {
      await db.query(
        "UPDATE notas_provas SET aluno_nome=?, email=?, prova1=?, prova2=?, projeto_final=?, media_final=?, status=?, destaque=? WHERE id=?",
        [alunoNome, email, prova1, prova2, projetoFinal, mediaFinal, status, destaque ? 1 : 0, existentes[0].id]
      );
      res.json({ message: "Nota do estudante atualizada com sucesso!" });
    } else {
      const [result] = await db.query(
        "INSERT INTO notas_provas (user_id, aluno_nome, email, prova1, prova2, projeto_final, media_final, status, destaque) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [userId || null, alunoNome, email, prova1 || 0, prova2 || 0, projetoFinal || 0, mediaFinal || 0, status || "Pendente ⏳", destaque ? 1 : 0]
      );
      res.status(201).json({ message: "Nota cadastrada com sucesso!", id: result.insertId });
    }
  } catch (error) {
    console.error("Erro ao salvar nota:", error);
    res.status(500).json({ message: "Erro ao salvar nota" });
  }
});

// DELETE - Remover registro de nota
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM notas_provas WHERE id = ?", [id]);
    res.json({ message: "Registro de nota removido!" });
  } catch (error) {
    console.error("Erro ao remover nota:", error);
    res.status(500).json({ message: "Erro ao remover nota" });
  }
});

module.exports = router;
