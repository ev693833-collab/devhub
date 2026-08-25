const express = require("express");
const pool = require("../config/database");

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

// 1. Rota para Cadastrar/Guardar uma nova URL
router.post("/", async (req, res) => {
  const { user_id, titulo, url_original, categoria } = req.body;

  if (!titulo || !url_original) {
    return res.status(400).json({ error: "Informe o título e a URL." });
  }

  try {
    const categoriaDefinida = categoria || "Geral";
    const userIdDefinido = user_id || null;

    const [resultado] = await pool.query(
      "INSERT INTO urls (user_id, titulo, url_original, categoria) VALUES (?, ?, ?, ?)",
      [userIdDefinido, titulo, url_original, categoriaDefinida]
    );

    res.status(201).json({
      message: "URL guardada com sucesso!",
      url: {
        id: resultado.insertId,
        user_id: userIdDefinido,
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

// 2. Rota para Listar URLs (por usuário ou todas)
router.get("/", async (req, res) => {
  const { user_id } = req.query;

  try {
    let query = "SELECT * FROM urls ORDER BY id DESC";
    let params = [];

    if (user_id) {
      query = "SELECT * FROM urls WHERE user_id = ? ORDER BY id DESC";
      params = [user_id];
    }

    const [urls] = await pool.query(query, params);
    res.status(200).json(urls);
  } catch (error) {
    console.error("Erro ao buscar URLs:", error);
    res.status(500).json({ error: "Erro ao buscar a lista de URLs." });
  }
});

// 3. Rota para Excluir uma URL
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM urls WHERE id = ?", [id]);
    res.status(200).json({ message: "URL excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir URL:", error);
    res.status(500).json({ error: "Erro ao excluir a URL." });
  }
});

module.exports = router;
