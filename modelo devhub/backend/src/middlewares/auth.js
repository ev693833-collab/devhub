const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ error: "Acesso negado! Token não fornecido." });

  try {
    const secretKey = process.env.JWT_SECRET || "devhub_jwt_secret_key_default";
    const verified = jwt.verify(token.replace("Bearer ", "").trim(), secretKey);
    req.user = verified; // Adiciona os dados do usuário ao request (id, email, cargo)
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido ou expirado!" });
  }
};

const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Não autorizado." });
    }
    const cargoUsuario = req.user.cargo || "usuario";
    if (rolesPermitidos.includes(cargoUsuario) || cargoUsuario === "super_admin") {
      return next();
    }
    return res.status(403).json({ error: "Acesso negado: permissão insuficiente." });
  };
};

module.exports = {
  verifyToken,
  requireRole
};

