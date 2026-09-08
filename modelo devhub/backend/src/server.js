console.log("Iniciando servidor...");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const routes = require("./routes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware para injetar o Socket.io nas requisições da API
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(routes);

// Eventos em tempo real com Socket.io
io.on("connection", (socket) => {
  console.log("⚡ Novo cliente conectado via Socket.io:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`👤 Socket ${socket.id} entrou na sala ${room}`);
  });

  socket.on("pair_code_change", (data) => {
    if (data && data.sala) {
      socket.to(data.sala).emit("pair_code_change", data);
    }
  });

  socket.on("pair_chat_message", (data) => {
    if (data && data.sala) {
      io.to(data.sala).emit("pair_chat_message", data.mensagem);
    }
  });

  socket.on("pair_challenge_change", (data) => {
    if (data && data.sala) {
      socket.to(data.sala).emit("pair_challenge_change", data);
    }
  });

  // Eventos de Batalha de Código 1v1 PvP em Tempo Real
  socket.on("battle_invite", (data) => {
    io.emit("battle_invite_received", data);
  });

  socket.on("battle_accept", (data) => {
    io.emit("battle_accepted", data);
  });

  socket.on("battle_progress", (data) => {
    if (data && data.sala) {
      socket.to(data.sala).emit("battle_progress_update", data);
    }
  });

  socket.on("battle_finish", (data) => {
    if (data && data.sala) {
      io.to(data.sala).emit("battle_finished", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("⚡ Cliente desconectado do Socket.io:", socket.id);
  });
});

// Definir porta dinâmica para produção ou desenvolvimento
const port = process.env.PORT || 3000;

// Iniciar o servidor apenas se rodando localmente
if (require.main === module) {
    const runningServer = server.listen(port, "0.0.0.0", () => {
        console.log(`Servidor rodando com Socket.io em 0.0.0.0:${port}`);
    });

    runningServer.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Porta ${port} em uso, tentando outra...`);
            server.listen(0, () => {
                console.log(`Servidor rodando em uma porta aleatória`);
            });
        } else {
            console.error(err);
        }
    });
}

// Exportamos o app para a Vercel
module.exports = app;

