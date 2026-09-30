const express = require("express");
const pool = require("../config/database");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

// Auto-criação da tabela "urls" se não existir no banco de dados
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS urls (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        titulo VARCHAR(255) NOT NULL,
        url_original TEXT NOT NULL,
        categoria VARCHAR(100) DEFAULT 'Geral',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ Tabela 'urls' verificada/criada com sucesso no MySQL!");
  } catch (err) {
    console.error("Erro ao verificar/criar tabela 'urls':", err);
  }
})();

// 1. Rota para Cadastrar/Guardar uma nova URL (Protegida)
router.post("/", verifyToken, async (req, res) => {
  const { titulo, url_original, categoria } = req.body;
  const userId = req.user.id;

  if (!titulo || !url_original) {
    return res.status(400).json({ error: "Informe o título e a URL." });
  }

  try {
    const categoriaDefinida = categoria || "Geral";

    const [resultado] = await pool.query(
      "INSERT INTO urls (user_id, titulo, url_original, categoria) VALUES (?, ?, ?, ?)",
      [userId, titulo, url_original, categoriaDefinida]
    );

    res.status(201).json({
      message: "URL guardada com sucesso!",
      url: {
        id: resultado.insertId,
        user_id: userId,
        titulo,
        url_original,
        categoria: categoriaDefinida
      }
    });
  } catch (error) {
    console.error("Erro ao guardar URL:", error);
    res.status(500).json({ error: "Erro interno no servidor ao guardar a URL." });
  }
});

// 2. Rota para Listar URLs do usuário logado (Protegida)
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [urls] = await pool.query("SELECT * FROM urls WHERE user_id = ? ORDER BY id DESC", [userId]);
    res.status(200).json(urls);
  } catch (error) {
    console.error("Erro ao buscar URLs:", error);
    res.status(500).json({ error: "Erro ao buscar a lista de URLs." });
  }
});

// 3. Rota para Excluir uma URL do usuário logado (Protegida)
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await pool.query("DELETE FROM urls WHERE id = ? AND user_id = ?", [id, userId]);
    res.status(200).json({ message: "URL excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir URL:", error);
    res.status(500).json({ error: "Erro ao excluir a URL." });
  }
});

module.exports = router;
