const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Auto-criação/Alinhamento da tabela "agenda_reunioes" no MySQL
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS agenda_reunioes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        data_reuniao VARCHAR(50) NOT NULL,
        horario_inicio VARCHAR(20),
        horario_fim VARCHAR(20),
        horario VARCHAR(50),
        instrutor VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'Agendada 📅',
        status_cor VARCHAR(20) DEFAULT '#3B82F6',
        link TEXT,
        icone VARCHAR(20) DEFAULT '📅',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    try { await db.query("ALTER TABLE agenda_reunioes ADD COLUMN horario_inicio VARCHAR(20)"); } catch (e) {}
    try { await db.query("ALTER TABLE agenda_reunioes ADD COLUMN horario_fim VARCHAR(20)"); } catch (e) {}
    try { await db.query("ALTER TABLE agenda_reunioes ADD COLUMN horario VARCHAR(50)"); } catch (e) {}

    console.log("✅ Tabela 'agenda_reunioes' verificada e alinhada com sucesso no MySQL!");
  } catch (err) {
    console.error("Erro ao criar/alinhar tabela 'agenda_reunioes':", err);
  }
})();

// GET - Listar reuniões
router.get("/", async (req, res) => {
  try {
    const [reunioes] = await db.query(
      "SELECT * FROM agenda_reunioes ORDER BY data_reuniao DESC, id DESC"
    );

    const formatadas = reunioes.map(r => ({
      id: r.id,
      titulo: r.titulo,
      descricao: r.descricao,
      data: r.data_reuniao,
      data_reuniao: r.data_reuniao,
      horario_inicio: r.horario_inicio || (r.horario ? r.horario.split("-")[0]?.trim() : "19:00"),
      horario_fim: r.horario_fim || (r.horario ? r.horario.split("-")[1]?.trim() : "21:00"),
      horario: r.horario || `${r.horario_inicio || "19:00"} - ${r.horario_fim || "21:00"}`,
      instrutor: r.instrutor,
      status: r.status || "Agendada 📅",
      statusCor: r.status_cor || "#3B82F6",
      status_cor: r.status_cor || "#3B82F6",
      link: r.link,
      icone: r.icone || "📅"
    }));

    res.json(formatadas);
  } catch (error) {
    console.error("Erro ao buscar reuniões:", error);
    res.status(500).json({
      message: "Erro ao buscar reuniões"
    });
  }
});

// POST - Criar reunião
router.post("/", async (req, res) => {
  try {
    const {
      titulo,
      descricao,
      data,
      data_reuniao,
      horario,
      horario_inicio,
      horario_fim,
      instrutor,
      status,
      statusCor,
      status_cor,
      link,
      icone
    } = req.body;

    const dataFinal = data_reuniao || data;
    const inicioFinal = horario_inicio || (horario ? horario.split("-")[0]?.trim() : "19:00");
    const fimFinal = horario_fim || (horario ? horario.split("-")[1]?.trim() : "21:00");
    const horarioFormatado = horario || `${inicioFinal} - ${fimFinal}`;
    const statusFinal = status || "Agendada 📅";
    const statusCorFinal = status_cor || statusCor || "#3B82F6";
    const iconeFinal = icone || "📅";

    if (!titulo || !dataFinal) {
      return res.status(400).json({ message: "Título e Data da reunião são obrigatórios." });
    }

    const [resultado] = await db.query(
      `
      INSERT INTO agenda_reunioes
      (
        titulo,
        descricao,
        data_reuniao,
        horario_inicio,
        horario_fim,
        horario,
        instrutor,
        status,
        status_cor,
        link,
        icone
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        titulo,
        descricao || "",
        dataFinal,
        inicioFinal,
        fimFinal,
        horarioFormatado,
        instrutor || "Instrutor DevHub",
        statusFinal,
        statusCorFinal,
        link || "https://www.youtube.com",
        iconeFinal
      ]
    );

    res.status(201).json({
      id: resultado.insertId,
      message: "Reunião criada com sucesso",
      reuniao: {
        id: resultado.insertId,
        titulo,
        descricao,
        data: dataFinal,
        data_reuniao: dataFinal,
        horario_inicio: inicioFinal,
        horario_fim: fimFinal,
        horario: horarioFormatado,
        instrutor,
        status: statusFinal,
        status_cor: statusCorFinal,
        statusCor: statusCorFinal,
        link,
        icone: iconeFinal
      }
    });

  } catch (error) {
    console.error("Erro ao criar reunião:", error);
    res.status(500).json({
      message: "Erro ao criar reunião"
    });
  }
});

// PUT - Atualizar reunião
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      titulo,
      descricao,
      data,
      data_reuniao,
      horario,
      horario_inicio,
      horario_fim,
      instrutor,
      status,
      statusCor,
      status_cor,
      link,
      icone
    } = req.body;

    const dataFinal = data_reuniao || data;
    const inicioFinal = horario_inicio || (horario ? horario.split("-")[0]?.trim() : "19:00");
    const fimFinal = horario_fim || (horario ? horario.split("-")[1]?.trim() : "21:00");
    const horarioFormatado = horario || `${inicioFinal} - ${fimFinal}`;
    const statusFinal = status || "Agendada 📅";
    const statusCorFinal = status_cor || statusCor || "#3B82F6";
    const iconeFinal = icone || "📅";

    await db.query(
      `
      UPDATE agenda_reunioes
      SET
        titulo = ?,
        descricao = ?,
        data_reuniao = ?,
        horario_inicio = ?,
        horario_fim = ?,
        horario = ?,
        instrutor = ?,
        status = ?,
        status_cor = ?,
        link = ?,
        icone = ?
      WHERE id = ?
      `,
      [
        titulo,
        descricao,
        dataFinal,
        inicioFinal,
        fimFinal,
        horarioFormatado,
        instrutor,
        statusFinal,
        statusCorFinal,
        link,
        iconeFinal,
        id
      ]
    );

    res.json({
      message: "Reunião atualizada com sucesso"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao atualizar reunião"
    });
  }
});

// DELETE - Excluir reunião
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM agenda_reunioes WHERE id = ?",
      [id]
    );

    res.json({
      message: "Reunião excluída com sucesso"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao excluir reunião"
    });
  }
});

module.exports = router;
