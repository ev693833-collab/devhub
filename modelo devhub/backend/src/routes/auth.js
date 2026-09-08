const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const { verifyToken, requireRole } = require("../middlewares/auth");

const router = express.Router();
const saltRounds = 10;

// Garantir que as colunas 'cargo' e 'avatar_url' existam no banco de dados (auto-migração)
(async () => {
  try {
    await pool.query("ALTER TABLE users ADD COLUMN cargo VARCHAR(50) DEFAULT 'usuario'");
  } catch (err) {}
  try {
    await pool.query("ALTER TABLE users ADD COLUMN avatar_url LONGTEXT DEFAULT NULL");
  } catch (err) {}
})();

// 1. Rota de Cadastro de Usuário (suporta cargo: usuario, admin, super_admin)
router.post("/register", async (req, res) => {
  const { nome, email, senha, cargo } = req.body;

  // Validação dos campos obrigatórios
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos (nome, email e senha)." });
  }

  // Valida cargo permitido
  const cargosPermitidos = ["usuario", "admin", "super_admin"];
  const cargoDefinido = cargosPermitidos.includes(cargo) ? cargo : "usuario";

  try {
    // Validação 1: Verifica se o e-mail já está cadastrado no banco
    const [usuariosExistentes] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (usuariosExistentes.length > 0) {
      return res.status(400).json({ error: "Este e-mail já está em uso." });
    }

    // Validação 2: Criptografa a senha com bcrypt
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // Insere o novo usuário no banco com o cargo especificado
    await pool.query(
      "INSERT INTO users (nome, email, senha, cargo) VALUES (?, ?, ?, ?)",
      [nome, email, senhaHash, cargoDefinido]
    );

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(500).json({ error: "Erro interno no servidor ao cadastrar usuário." });
  }
});

// 2. Rota de Login de Usuário
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Informe e-mail e senha para entrar." });
  }

  try {
    const [usuarios] = await pool.query(
      "SELECT id, nome, email, senha, cargo, avatar_url, created_at FROM users WHERE email = ?",
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(400).json({ error: "E-mail ou senha incorretos." });
    }

    const usuario = usuarios[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json({ error: "E-mail ou senha incorretos." });
    }

    const secretKey = process.env.JWT_SECRET || "sua_chave_secreta_aqui";
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, cargo: usuario.cargo || "usuario" },
      secretKey,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo || "usuario",
        avatar_url: usuario.avatar_url,
        avatar: usuario.avatar_url,
        created_at: usuario.created_at
      }
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno no servidor ao fazer login." });
  }
});

// 3. Rota de Listagem de Todos os Usuários
router.get("/users", async (req, res) => {
  try {
    const [usuarios] = await pool.query(
      "SELECT id, nome, email, cargo, created_at FROM users ORDER BY id DESC"
    );
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar lista de usuários." });
  }
});

// 4. Rota para Excluir Usuário
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    res.status(200).json({ message: "Usuário excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ error: "Erro ao excluir usuário." });
  }
});

// 5. Rota para Atualizar Usuário / Cargo (Super Admin)
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, cargo } = req.body;

  const cargosPermitidos = ["usuario", "admin", "super_admin"];
  if (cargo && !cargosPermitidos.includes(cargo)) {
    return res.status(400).json({ error: "Cargo inválido." });
  }

  try {
    await pool.query(
      "UPDATE users SET nome = COALESCE(?, nome), email = COALESCE(?, email), cargo = COALESCE(?, cargo) WHERE id = ?",
      [nome || null, email || null, cargo || null, id]
    );

    res.status(200).json({ message: "Usuário atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
});

// 6. Promover / Rebaixar Cargo de Usuário (Super Admin exclusivo)
router.post("/users/:id/promover", async (req, res) => {
  const { id } = req.params;
  const { cargo } = req.body;

  const cargosPermitidos = ["usuario", "admin", "super_admin"];
  if (!cargosPermitidos.includes(cargo)) {
    return res.status(400).json({ error: "Cargo inválido. Use: usuario, admin ou super_admin." });
  }

  try {
    await pool.query("UPDATE users SET cargo = ? WHERE id = ?", [cargo, id]);
    res.status(200).json({ message: `Cargo atualizado para '${cargo}' com sucesso!` });
  } catch (error) {
    console.error("Erro ao promover usuário:", error);
    res.status(500).json({ error: "Erro ao promover usuário." });
  }
});

// 7. Reset de Senha (Super Admin pode redefinir senha de qualquer usuário)
router.post("/users/:id/reset-senha", async (req, res) => {
  const { id } = req.params;
  const { novaSenha } = req.body;

  if (!novaSenha || novaSenha.length < 4) {
    return res.status(400).json({ error: "A nova senha deve ter pelo menos 4 caracteres." });
  }

  try {
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    await pool.query("UPDATE users SET senha = ? WHERE id = ?", [senhaHash, id]);
    res.status(200).json({ message: "Senha redefinida com sucesso!" });
  } catch (error) {
    console.error("Erro ao resetar senha:", error);
    res.status(500).json({ error: "Erro ao resetar senha." });
  }
});

// 8. Suspender / Reativar Usuário (Super Admin)
router.post("/users/:id/suspender", async (req, res) => {
  const { id } = req.params;
  const { suspender, motivo } = req.body; // suspender: true | false

  try {
    // Garantir coluna suspenso existe
    try {
      await pool.query("ALTER TABLE users ADD COLUMN suspenso TINYINT(1) DEFAULT 0");
      await pool.query("ALTER TABLE users ADD COLUMN motivo_suspensao TEXT DEFAULT NULL");
    } catch (e) { /* já existe */ }

    const suspensoVal = suspender ? 1 : 0;
    const motivoVal = suspender ? (motivo || "Sem motivo informado.") : null;

    await pool.query(
      "UPDATE users SET suspenso = ?, motivo_suspensao = ? WHERE id = ?",
      [suspensoVal, motivoVal, id]
    );

    res.status(200).json({
      message: suspender ? `Usuário suspenso: ${motivo}` : "Usuário reativado com sucesso!"
    });
  } catch (error) {
    console.error("Erro ao suspender usuário:", error);
    res.status(500).json({ error: "Erro ao suspender usuário." });
  }
});

// 9. Listar usuários com status de suspensão incluído
router.get("/users/detalhes", async (req, res) => {
  try {
    // Garantir colunas existem
    try {
      await pool.query("ALTER TABLE users ADD COLUMN suspenso TINYINT(1) DEFAULT 0");
      await pool.query("ALTER TABLE users ADD COLUMN motivo_suspensao TEXT DEFAULT NULL");
    } catch (e) { /* já existe */ }

    const [usuarios] = await pool.query(
      "SELECT id, nome, email, cargo, suspenso, motivo_suspensao, created_at FROM users ORDER BY id DESC"
    );
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários detalhados:", error);
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

// Verificar se usuário suspenso no login (middleware de checagem)
router.post("/check-suspensao", async (req, res) => {
  const { email } = req.body;
  try {
    try {
      await pool.query("ALTER TABLE users ADD COLUMN suspenso TINYINT(1) DEFAULT 0");
    } catch (e) {}
    const [rows] = await pool.query(
      "SELECT suspenso, motivo_suspensao FROM users WHERE email = ?", [email]
    );
    if (rows.length > 0 && rows[0].suspenso) {
      return res.json({ suspenso: true, motivo: rows[0].motivo_suspensao });
    }
    return res.json({ suspenso: false });
  } catch (e) {
    return res.json({ suspenso: false });
  }
});

// 10. Atualizar Perfil do Usuário (Foto de Perfil / Nome)
router.put("/perfil", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { nome, avatar_url } = req.body;

  try {
    try {
      await pool.query("ALTER TABLE users ADD COLUMN avatar_url LONGTEXT DEFAULT NULL");
    } catch (e) {}

    await pool.query(
      "UPDATE users SET nome = COALESCE(?, nome), avatar_url = COALESCE(?, avatar_url) WHERE id = ?",
      [nome || null, avatar_url || null, userId]
    );

    res.status(200).json({
      message: "Perfil atualizado com sucesso!",
      user: { id: userId, nome, avatar_url }
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil no servidor:", error);
    res.status(500).json({ error: "Erro ao atualizar perfil no servidor." });
  }
});

module.exports = router;



