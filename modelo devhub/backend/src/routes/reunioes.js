const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Auto-criação/Alinhamento da tabela "agenda_reunioes" e "presencas_reunioes" no MySQL
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
        sala_nome VARCHAR(255),
        link_gravacao TEXT,
        base_nome VARCHAR(255) DEFAULT 'ContabHub',
        carga_horaria VARCHAR(50) DEFAULT '2h',
        icone VARCHAR(20) DEFAULT '📅',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    try { await db.query("ALTER TABLE agenda_reunioes ADD COLUMN horario_inicio VARCHAR(20)"); } catch (e) {}
    try { await db.query("ALTER TABLE agenda_reunioes ADD COLUMN horario_fim VARCHAR(20)"); } catch (e) {}
    try { await db.query("ALTER TABLE agenda_reunioes ADD COLUMN horario VARCHAR(50)"); } catch (e) {}
    try { await db.query("ALTER TABLE agenda_reunioes ADD COLUMN sala_nome VARCHAR(255)"); } catch (e) {}
    try { await db.query("ALTER TABLE agenda_reunioes ADD COLUMN link_gravacao TEXT"); } catch (e) {}
    try { await db.query("ALTER TABLE agenda_reunioes ADD COLUMN base_nome VARCHAR(255) DEFAULT 'ContabHub'"); } catch (e) {}
    try { await db.query("ALTER TABLE agenda_reunioes ADD COLUMN carga_horaria VARCHAR(50) DEFAULT '2h'"); } catch (e) {}

    await db.query(`
      CREATE TABLE IF NOT EXISTS presencas_reunioes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        reuniao_id INT NOT NULL,
        user_id VARCHAR(100),
        user_nome VARCHAR(255),
        user_email VARCHAR(255),
        base_nome VARCHAR(255),
        horario_entrada VARCHAR(50),
        tipo_presenca VARCHAR(50) DEFAULT '🟢 Presente ao Vivo',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Tabelas 'agenda_reunioes' e 'presencas_reunioes' alinhadas no MySQL!");
  } catch (err) {
    console.error("Erro ao criar/alinhar tabelas de reuniões:", err);
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
      sala_nome: r.sala_nome || `devhub-live-room-${r.id}`,
      link_gravacao: r.link_gravacao || "",
      base_nome: r.base_nome || "ContabHub",
      carga_horaria: r.carga_horaria || "2h",
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
    console.error("Erro ao excluir reunião:", error);
    res.status(500).json({ message: "Erro ao excluir reunião" });
  }
});

// POST - Registrar presença do aluno na aula ao vivo ou reprise
router.post("/checkin", async (req, res) => {
  try {
    const { reuniao_id, user_id, user_nome, user_email, base_nome, tipo_presenca } = req.body;
    if (!reuniao_id) return res.status(400).json({ message: "ID da reunião é obrigatório." });

    const horarioEntrada = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const tipo = tipo_presenca || "🟢 Presente ao Vivo";

    // Evitar duplicidade de check-in na mesma aula
    const [existente] = await db.query(
      "SELECT * FROM presencas_reunioes WHERE reuniao_id = ? AND (user_id = ? OR user_email = ?)",
      [reuniao_id, user_id || "", user_email || ""]
    );

    if (existente.length > 0) {
      return res.json({ message: "Presença já registrada para esta aula!", jaRegistrado: true, presenca: existente[0] });
    }

    const [insert] = await db.query(
      `INSERT INTO presencas_reunioes (reuniao_id, user_id, user_nome, user_email, base_nome, horario_entrada, tipo_presenca)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [reuniao_id, user_id || "0", user_nome || "Aluno", user_email || "aluno@devhub.com", base_nome || "ContabHub", horarioEntrada, tipo]
    );

    res.status(201).json({
      message: "Presença registrada com sucesso! 🟢",
      presenca: { id: insert.insertId, reuniao_id, horarioEntrada, tipo_presenca: tipo }
    });
  } catch (error) {
    console.error("Erro ao registrar presença:", error);
    res.status(500).json({ message: "Erro ao registrar presença na reunião." });
  }
});

// GET - Listar presenças de uma reunião específica
router.get("/presencas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [presencas] = await db.query(
      "SELECT * FROM presencas_reunioes WHERE reuniao_id = ? ORDER BY created_at DESC",
      [id]
    );
    res.json(presencas);
  } catch (error) {
    console.error("Erro ao buscar presenças:", error);
    res.status(500).json({ message: "Erro ao buscar presenças da reunião." });
  }
});

module.exports = router;

