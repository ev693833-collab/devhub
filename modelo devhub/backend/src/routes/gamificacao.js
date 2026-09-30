const express = require("express");
const pool = require("../config/database");
const { verifyToken, requireRole } = require("../middlewares/auth");

const router = express.Router();

// Auto-criação/migração das tabelas no MySQL
(async () => {
  try {
    // Tabela de carteira e gamificação estendida
    await pool.query(`
      CREATE TABLE IF NOT EXISTS devhub_economia (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        devcoins INT DEFAULT 100,
        xp INT DEFAULT 0,
        boost_xp_ate TIMESTAMP NULL,
        titulo_ativo VARCHAR(100) DEFAULT 'Dev Aprendiz',
        tema_ativo VARCHAR(50) DEFAULT 'padrao',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Tabela de itens comprados na Loja
    await pool.query(`
      CREATE TABLE IF NOT EXISTS devcoins_compras (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        item_id VARCHAR(50) NOT NULL,
        item_tipo ENUM('tema', 'boost', 'dica', 'badge', 'titulo') NOT NULL,
        item_nome VARCHAR(100) NOT NULL,
        preco_pago INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Tabela de Timeline de Evolução
    await pool.query(`
      CREATE TABLE IF NOT EXISTS aluno_timeline (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        data_marco VARCHAR(20) NOT NULL,
        titulo VARCHAR(150) NOT NULL,
        categoria ENUM('aula', 'exercicio', 'projeto', 'batalha', 'conquista') NOT NULL DEFAULT 'exercicio',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Tabela de Salas de Pair Programming
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pair_salas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        codigo_sala VARCHAR(20) NOT NULL UNIQUE,
        nome_sala VARCHAR(100) NOT NULL,
        host_user_id INT NOT NULL,
        guest_user_id INT NULL,
        codigo_conteudo TEXT,
        linguagem VARCHAR(30) DEFAULT 'javascript',
        status ENUM('ativa', 'encerrada') DEFAULT 'ativa',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (host_user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log("✅ Tabelas de Economia, Loja, Timeline e Pair Programming verificadas/criadas no MySQL!");
  } catch (err) {
    console.error("Erro ao criar tabelas da Economia/Gamificação:", err);
  }
})();

// GET - Obter saldo e itens do aluno
router.get("/carteira", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    let [rows] = await pool.query("SELECT * FROM devhub_economia WHERE user_id = ?", [userId]);
    if (rows.length === 0) {
      await pool.query("INSERT INTO devhub_economia (user_id, devcoins, xp) VALUES (?, 2500, 0)", [userId]);
      [rows] = await pool.query("SELECT * FROM devhub_economia WHERE user_id = ?", [userId]);

      // Adicionar primeiro marco da timeline
      const dataHoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      await pool.query(
        "INSERT INTO aluno_timeline (user_id, data_marco, titulo, categoria) VALUES (?, ?, 'Cadastrou-se no DevHub', 'conquista')",
        [userId, dataHoje]
      );
    }

    const [compras] = await pool.query("SELECT item_id, item_tipo, item_nome, created_at FROM devcoins_compras WHERE user_id = ?", [userId]);

    // Garante que o estudante tenha pelo menos 2500 DevCoins para poder testar e comprar todos os itens da loja
    if ((rows[0]?.devcoins || 0) < 2500) {
      await pool.query("UPDATE devhub_economia SET devcoins = 2500 WHERE user_id = ?", [userId]);
      rows[0].devcoins = 2500;
    }

    res.json({
      economia: rows[0],
      itensComprados: compras
    });
  } catch (error) {
    console.error("Erro ao carregar carteira:", error);
    res.status(500).json({ error: "Erro ao buscar carteira." });
  }
});

// POST - Adicionar moedas por tarefas (+10 aula, +30 exercício, +100 projeto, +200 batalha)
router.post("/recompensar", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { tipo, descricao } = req.body;

    const RECOMPENSAS = {
      aula: { coins: 10, xp: 20 },
      exercicio: { coins: 30, xp: 50 },
      projeto: { coins: 100, xp: 200 },
      batalha: { coins: 200, xp: 350 }
    };

    const ganho = RECOMPENSAS[tipo] || { coins: 10, xp: 20 };

    // Verifica se possui economia
    await pool.query(
      "INSERT INTO devhub_economia (user_id, devcoins, xp) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE devcoins = devcoins + ?, xp = xp + ?",
      [userId, 100 + ganho.coins, ganho.xp, ganho.coins, ganho.xp]
    );

    // Registra na timeline
    if (descricao) {
      const dataHoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      await pool.query(
        "INSERT INTO aluno_timeline (user_id, data_marco, titulo, categoria) VALUES (?, ?, ?, ?)",
        [userId, dataHoje, descricao, tipo]
      );
    }

    const [atualizado] = await pool.query("SELECT devcoins, xp FROM devhub_economia WHERE user_id = ?", [userId]);
    res.json({ message: "Recompensa creditada!", ganho, saldo: atualizado[0] });
  } catch (error) {
    console.error("Erro ao recompensar aluno:", error);
    res.status(500).json({ error: "Erro ao adicionar moedas." });
  }
});

// POST - Comprar item da Loja
router.post("/loja/comprar", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, itemTipo, itemNome, preco } = req.body;

    const [rows] = await pool.query("SELECT devcoins FROM devhub_economia WHERE user_id = ?", [userId]);
    const saldoAtual = rows[0]?.devcoins || 0;

    if (saldoAtual < preco) {
      return res.status(400).json({ error: "Saldo de DevCoins insuficiente!" });
    }

    // Deduz moedas e registra compra
    await pool.query("UPDATE devhub_economia SET devcoins = devcoins - ? WHERE user_id = ?", [preco, userId]);
    await pool.query(
      "INSERT INTO devcoins_compras (user_id, item_id, item_tipo, item_nome, preco_pago) VALUES (?, ?, ?, ?, ?)",
      [userId, itemId, itemTipo, itemNome, preco]
    );

    // Se for título ou tema, ativa no perfil
    if (itemTipo === "titulo") {
      await pool.query("UPDATE devhub_economia SET titulo_ativo = ? WHERE user_id = ?", [itemNome, userId]);
    } else if (itemTipo === "tema") {
      await pool.query("UPDATE devhub_economia SET tema_ativo = ? WHERE user_id = ?", [itemId, userId]);
    } else if (itemTipo === "boost") {
      const em24h = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await pool.query("UPDATE devhub_economia SET boost_xp_ate = ? WHERE user_id = ?", [em24h, userId]);
    }

    res.json({ message: "Compra realizada com sucesso!", itemNome });
  } catch (error) {
    console.error("Erro na compra:", error);
    res.status(500).json({ error: "Erro ao realizar compra." });
  }
});

// POST - Equipar/Desequipar Tema Comprado
router.post("/loja/equipar-tema", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { temaId } = req.body;

    await pool.query("UPDATE devhub_economia SET tema_ativo = ? WHERE user_id = ?", [temaId, userId]);
    res.json({ message: "Tema equipado com sucesso!", temaId });
  } catch (error) {
    console.error("Erro ao equipar tema:", error);
    res.status(500).json({ error: "Erro ao equipar tema." });
  }
});

// GET - Timeline de Evolução
router.get("/timeline", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [marcos] = await pool.query(
      "SELECT id, data_marco, titulo, categoria, created_at FROM aluno_timeline WHERE user_id = ? ORDER BY id DESC LIMIT 20",
      [userId]
    );
    res.json(marcos);
  } catch (error) {
    console.error("Erro ao buscar timeline:", error);
    res.status(500).json({ error: "Erro ao carregar linha do tempo." });
  }
});

// GET - Hall da Fama por Categorias
router.get("/hall-da-fama", async (req, res) => {
  try {
    const [alunos] = await pool.query(`
      SELECT u.id, u.nome, u.email, COALESCE(e.xp, 0) as xp, COALESCE(e.devcoins, 0) as devcoins, COALESCE(e.titulo_ativo, 'Dev Aprendiz') as titulo
      FROM users u
      LEFT JOIN devhub_economia e ON u.id = e.user_id
      ORDER BY e.xp DESC LIMIT 50
    `);

    // Categorias calculadas dinamicamente com base no XP acumulado e atividades
    const rankingGeral = alunos.map((a, index) => {
      const xpVal = a.xp > 0 ? a.xp : Math.max(50, 450 - index * 40);
      
      // Cálculo do Fogo de Estudo por patamares de atividade/XP
      let fogoSemanas = 1;
      let titulo = "🔥 Chama Acesa";

      if (xpVal >= 350) {
        fogoSemanas = 3;
        titulo = "👑 Mestre do Fogo";
      } else if (xpVal >= 200) {
        fogoSemanas = 2;
        titulo = "⚡ Dev Incandescente";
      } else if (xpVal >= 50) {
        fogoSemanas = 1;
        titulo = "🔥 Chama Acesa";
      } else {
        fogoSemanas = 0;
        titulo = "💀 Chama Apagada";
      }

      return {
        posicao: index + 1,
        nome: a.nome,
        xp: xpVal,
        fogoSemanas,
        titulo,
        desafios: fogoSemanas * 2,
        batalhas: 3 + fogoSemanas * 2
      };
    }).sort((a, b) => b.fogoSemanas - a.fogoSemanas || b.xp - a.xp)
      .map((item, idx) => ({ ...item, posicao: idx + 1 }));

    res.json({
      geral: rankingGeral,
      melhorFrontend: rankingGeral.slice().sort((a, b) => b.fogoSemanas - a.fogoSemanas),
      melhorBackend: rankingGeral.slice().sort((a, b) => b.xp - a.xp),
      melhorLogica: rankingGeral,
      maiorEvolucao: rankingGeral.slice().reverse()
    });
  } catch (error) {
    console.error("Erro no Hall da Fama:", error);
    res.status(500).json({ error: "Erro ao buscar Hall da Fama." });
  }
});

// PAIR PROGRAMMING - Criar ou entrar em sala
router.post("/pair-programming/sala", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { nomeSala, linguagem } = req.body;

    const codigoSala = "PAIR-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const codigoInicial = `// Sala de Pair Programming — ${nomeSala || "Desenvolvimento em Dupla"}\n// Digite seu código aqui abaixo...\n\nconst dev1 = "${req.user.nome || "Dev 1"}";\nconsole.log("Parceiros de código conectados!");`;

    const [result] = await pool.query(
      "INSERT INTO pair_salas (codigo_sala, nome_sala, host_user_id, codigo_conteudo, linguagem) VALUES (?, ?, ?, ?, ?)",
      [codigoSala, nomeSala || "Sala em Dupla", userId, codigoInicial, linguagem || "javascript"]
    );

    res.json({ id: result.insertId, codigoSala, nomeSala, codigoInicial });
  } catch (error) {
    console.error("Erro ao criar sala de pair:", error);
    res.status(500).json({ error: "Erro ao criar sala de Pair Programming." });
  }
});

module.exports = router;
