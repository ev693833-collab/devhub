const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const urlRoutes = require("./urls");
const reunioesRoutes = require("./reunioes");
const agendaRoutes = require("./agenda");
const provasRoutes = require("./provas");
const notasRoutes = require("./notas");
const frequenciaRoutes = require("./frequencia");

router.use("/auth", authRoutes);
router.use("/urls", urlRoutes);
router.use("/reunioes", reunioesRoutes);
router.use("/agenda", agendaRoutes);
router.use("/provas", provasRoutes);
router.use("/notas", notasRoutes);
router.use("/frequencia", frequenciaRoutes);

router.get("/", (req, res) => {
  res.send("API DevHub rodando com integração MySQL 🚀!");
});

module.exports = router;
