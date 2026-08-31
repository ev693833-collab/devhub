const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Auto-criação e migração das tabelas "provas" e "provas_questoes" no MySQL
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS provas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        data_limite VARCHAR(50) NOT NULL,
        horario_limite VARCHAR(20) NOT NULL,
        duracao_minutos INT DEFAULT 45,
        criado_por VARCHAR(255) NOT NULL,
        tipo VARCHAR(20) DEFAULT 'questoes',
        pdf_data LONGTEXT,
        pdf_nome VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Migração: adicionar colunas novas se não existirem (para bancos já existentes)
    try {
      await db.query(`ALTER TABLE provas ADD COLUMN tipo VARCHAR(20) DEFAULT 'questoes'`);
    } catch (e) { /* coluna já existe */ }
    try {
      await db.query(`ALTER TABLE provas ADD COLUMN pdf_data LONGTEXT`);
    } catch (e) { /* coluna já existe */ }
    try {
      await db.query(`ALTER TABLE provas ADD COLUMN pdf_nome VARCHAR(255)`);
    } catch (e) { /* coluna já existe */ }

    await db.query(`
      CREATE TABLE IF NOT EXISTS provas_questoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        prova_id INT NOT NULL,
        pergunta TEXT NOT NULL,
        opcao_1 TEXT NOT NULL,
        opcao_2 TEXT NOT NULL,
        opcao_3 TEXT NOT NULL,
        opcao_4 TEXT NOT NULL,
        resposta_correta INT NOT NULL,
        FOREIGN KEY (prova_id) REFERENCES provas(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ Tabelas 'provas' e 'provas_questoes' verificadas/criadas no MySQL!");
  } catch (err) {
    console.error("Erro ao criar tabelas de provas:", err);
  }
})();

// GET - Listar todas as provas com suas perguntas
router.get("/", async (req, res) => {
  try {
    const [provas] = await db.query("SELECT * FROM provas ORDER BY id DESC");
    const [questoes] = await db.query("SELECT * FROM provas_questoes");

    const provasComQuestoes = provas.map(p => {
      const qProva = questoes.filter(q => q.prova_id === p.id).map(q => ({
        id: q.id,
        pergunta: q.pergunta,
        opcoes: [q.opcao_1, q.opcao_2, q.opcao_3, q.opcao_4],
        respostaCorreta: q.resposta_correta
      }));

      return {
        id: p.id,
        titulo: p.titulo,
        descricao: p.descricao,
        dataLimite: p.data_limite,
        horarioLimite: p.horario_limite,
        duracaoMinutos: p.duracao_minutos,
        criadoPor: p.criado_por,
        tipo: p.tipo || "questoes",
        pdfData: p.pdf_data || null,
        pdfNome: p.pdf_nome || null,
        questoes: qProva
      };
    });

    res.json(provasComQuestoes);
  } catch (error) {
    console.error("Erro ao buscar provas:", error);
    res.status(500).json({ message: "Erro ao buscar provas" });
  }
});

// POST - Criar nova prova temporária (com questões ou com PDF)
router.post("/", async (req, res) => {
  const {
    titulo, descricao, dataLimite, horarioLimite,
    duracaoMinutos, criadoPor, questoes,
    tipo, pdfData, pdfNome
  } = req.body;

  if (!titulo || !descricao) {
    return res.status(400).json({ message: "Título e descrição são obrigatórios." });
  }

  const tipoProva = tipo || "questoes";

  try {
    const [result] = await db.query(
      "INSERT INTO provas (titulo, descricao, data_limite, horario_limite, duracao_minutos, criado_por, tipo, pdf_data, pdf_nome) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        titulo,
        descricao,
        dataLimite || "30/09/2026",
        horarioLimite || "23:59",
        duracaoMinutos || 45,
        criadoPor || "Admin DevHub",
        tipoProva,
        tipoProva === "pdf" ? (pdfData || null) : null,
        tipoProva === "pdf" ? (pdfNome || null) : null
      ]
    );

    const provaId = result.insertId;

    // Inserir questões apenas se for do tipo "questoes"
    if (tipoProva === "questoes" && Array.isArray(questoes) && questoes.length > 0) {
      for (const q of questoes) {
        await db.query(
          "INSERT INTO provas_questoes (prova_id, pergunta, opcao_1, opcao_2, opcao_3, opcao_4, resposta_correta) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            provaId,
            q.pergunta || "Pergunta",
            q.opcoes[0] || "Opção 1",
            q.opcoes[1] || "Opção 2",
            q.opcoes[2] || "Opção 3",
            q.opcoes[3] || "Opção 4",
            parseInt(q.respostaCorreta) || 0
          ]
        );
      }
    }

    res.status(201).json({ message: "Prova criada com sucesso!", provaId });
  } catch (error) {
    console.error("Erro ao criar prova:", error);
    res.status(500).json({ message: "Erro ao criar prova" });
  }
});

// DELETE - Excluir prova
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM provas WHERE id = ?", [id]);
    res.json({ message: "Prova excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir prova:", error);
    res.status(500).json({ message: "Erro ao excluir prova" });
  }
});

module.exports = router;
