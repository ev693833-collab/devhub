const express = require("express");
require("dotenv").config();
const pool = require("../config/database");
const verifyToken = require("../middlewares/auth");

const router = express.Router();

// Auto-criação das tabelas do Dev IA no MySQL
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS dev_ia_threads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        titulo VARCHAR(255) NOT NULL DEFAULT 'Nova conversa',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS dev_ia_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        thread_id INT NOT NULL,
        sender ENUM('user', 'ia') NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (thread_id) REFERENCES dev_ia_threads(id) ON DELETE CASCADE
      )
    `);

    console.log("✅ Tabelas 'dev_ia_threads' e 'dev_ia_messages' verificadas/criadas com sucesso!");
  } catch (err) {
    console.error("Erro ao verificar/criar tabelas da Dev IA:", err);
  }
})();

// Helper para chamar a API do Gemini via REST
async function chamarGeminiAPI(messagesHistory, userPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "SUA_CHAVE_GEMINI_AQUI") {
    return gerarRespostaFallback(userPrompt);
  }

  const modelosParaTentar = [
    "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.5-flash",
    "gemini-pro-latest",
    "gemini-3.6-flash",
    "gemma-4-26b-a4b-it"
  ];

  const systemInstruction = `Você é a Dev IA, uma assistente virtual de estudos focada ESTRITAMENTE em Programação, Engenharia de Software, Ciência da Computação e Tecnologia.

⛔ TRAVA E REGRAS DE CONTEÚDO (RIGOROSAMENTE OBRIGATÓRIAS):
1. VOCÊ É EXCLUSIVAMENTE UM TUTOR ACADÊMICO DE PROGRAMAÇÃO E TECNOLOGIA DA INFORMAÇÃO.
2. Se o usuário fizer perguntas que NÃO envolvam programação, código, tecnologia, banco de dados, lógica, infraestrutura, desenvolvimento web/mobile ou a plataforma DevHub (exemplo: fofocas, receitas culinárias, política, futebol, conselhos amorosos ou bate-papo geral não-técnico), VOCÊ DEVE RECUSAR RESPONDER DE FORMA EDUCADA E DIRETA.
3. Resposta de Recusa Padrão: "Olá! Sou a Dev IA 🤖, sua assistente focada exclusivamente em estudos de programação e tecnologia. Não posso responder sobre este assunto, mas estou pronta para te ajudar com códigos, bugs, linguagens de programação (JS, Python, React, SQL, etc.) ou lógica de sistemas. Qual dúvida de programação vamos resolver hoje?"
4. Para dúvidas técnicas de programação: Seja sempre didática, encorajadora, clara e forneça exemplos de código limpo com Markdown e especificação da linguagem.
5. Fale sempre em Português do Brasil.`;

  const contents = [
    {
      role: "user",
      parts: [{ text: `Instrução do Sistema: ${systemInstruction}` }]
    },
    {
      role: "model",
      parts: [{ text: "Entendido! Sou a Dev IA, sua tutora de programação no DevHub. Como posso te ajudar a codar hoje?" }]
    }
  ];

  const historicoRecente = messagesHistory.slice(-10);
  for (const msg of historicoRecente) {
    contents.push({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    });
  }

  contents.push({
    role: "user",
    parts: [{ text: userPrompt }]
  });

  for (const modelo of modelosParaTentar) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents })
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return candidateText;
        }
      }
    } catch (err) {
      console.warn(`Tentativa com modelo ${modelo} falhou:`, err.message);
    }
  }

  console.error("Nenhum modelo Gemini respondeu com sucesso. Acionando fallback.");
  return gerarRespostaFallback(userPrompt);
}

// Gerador de respostas fallback quando offline ou sem API key
function gerarRespostaFallback(prompt) {
  const pLower = prompt.toLowerCase();

  if (pLower.includes("erro") || pLower.includes("bug") || pLower.includes("corrigir")) {
    return `### 🐛 Análise de Bug / Correção pela Dev IA

Identifiquei que você está buscando ajuda para resolver um erro!

**Dicas para debugar seu código:**
1. **Leia a mensagem de erro do console**: Geralmente ela indica o número da linha e o tipo de erro (ex: \`TypeError: Cannot read properties of undefined\`).
2. **Use \`console.log()\`**: Verifique o valor real das variáveis logo antes de onde o erro ocorre.
3. **Sintaxe e Fechamento de Chaves**: Verifique se todas as aspas, parênteses \`()\`, chaves \`{}\` e colchetes \`[]\` estão alinhados.

\`\`\`javascript
// Exemplo de verificação defensiva de variável:
if (usuario && usuario.nome) {
  console.log("Nome do usuário:", usuario.nome);
} else {
  console.log("Usuário ainda não foi carregado.");
}
\`\`\`

> 💡 *Dica DevHub*: Adicione a sua \`GEMINI_API_KEY\` no arquivo \`.env\` do backend para habilitar a inteligência gerativa completa em tempo real!`;
  }

  if (pLower.includes("exercicio") || pLower.includes("exercício") || pLower.includes("desafio")) {
    return `### 🎯 Desafio Prático de Programação: Estruturas de Repetição (Loops)

**Nível:** Iniciante / Intermediário  
**Objetivo:** Escrever uma função que receba um array de números e retorne a soma de todos os números pares.

#### Enunciado:
Crie uma função chamada \`somarPares(numeros)\` que percorre o array e acumula apenas os valores pares.

\`\`\`javascript
// Exemplo de entrada:
const lista = [1, 2, 3, 4, 5, 6];
// Saída esperada: 12 (pois 2 + 4 + 6 = 12)
\`\`\`

<details>
<summary>💡 Clique para ver uma dica</summary>

Você pode usar o operador de resto da divisão \`%\`. Se \`numero % 2 === 0\`, o número é par!
</details>

---
> 🚀 Tente resolver este desafio no seu editor!`;
  }

  return `### 🤖 Olá! Eu sou a Dev IA, sua assistente de estudos no DevHub!

Estou pronta para te ajudar no seu aprendizado de desenvolvimento de software!

**O que você pode me pedir:**
- 🔍 **Explicar trechos de código**: Cole um código que você não entendeu.
- 🛠️ **Debugar erros**: Me envie a mensagem de erro que apareceu no seu terminal.
- 🎯 **Gerar exercícios práticos**: Peça desafios por linguagem (JS, Python, React, SQL, etc.).
- 💡 **Dicas de Clean Code & Boas Práticas**.

\`\`\`javascript
// Exemplo: Como declarar uma função limpa em JavaScript
const calcularMedia = (notas) => {
  if (!notas || notas.length === 0) return 0;
  const soma = notas.reduce((acc, curr) => acc + curr, 0);
  return (soma / notas.length).toFixed(1);
};
\`\`\`

> 📌 *Configuração*: Adicione a \`GEMINI_API_KEY\` no arquivo \`.env\` do servidor para respostas IA personalizadas ativas!`;
}

// --- ROTAS DO DEV IA ---

// 1. Obter todas as conversas (threads) do usuário logado
router.get("/threads", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [threads] = await pool.query(
      "SELECT id, titulo, created_at, updated_at FROM dev_ia_threads WHERE user_id = ? ORDER BY updated_at DESC",
      [userId]
    );
    res.status(200).json(threads);
  } catch (error) {
    console.error("Erro ao buscar threads da Dev IA:", error);
    res.status(500).json({ error: "Erro ao carregar histórico de conversas." });
  }
});

// 2. Criar uma nova conversa (thread)
router.post("/threads", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { titulo } = req.body;

    const tituloThread = titulo && titulo.trim() !== "" ? titulo.trim() : "Nova conversa";

    const [result] = await pool.query(
      "INSERT INTO dev_ia_threads (user_id, titulo) VALUES (?, ?)",
      [userId, tituloThread]
    );

    const threadId = result.insertId;

    // Mensagem de boas-vindas inicial da IA
    const boasVindas = "Olá! Eu sou a Dev IA 🤖, seu tutor de programação no DevHub. Como posso te ajudar hoje? Pode me enviar dúvidas, trechos de código para explicar ou pedir exercícios!";
    
    await pool.query(
      "INSERT INTO dev_ia_messages (thread_id, sender, content) VALUES (?, 'ia', ?)",
      [threadId, boasVindas]
    );

    res.status(201).json({
      id: threadId,
      user_id: userId,
      titulo: tituloThread,
      created_at: new Date()
    });
  } catch (error) {
    console.error("Erro ao criar thread da Dev IA:", error);
    res.status(500).json({ error: "Erro ao criar nova conversa." });
  }
});

// 3. Excluir uma conversa
router.delete("/threads/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await pool.query(
      "DELETE FROM dev_ia_threads WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    res.status(200).json({ message: "Conversa excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir thread:", error);
    res.status(500).json({ error: "Erro ao excluir conversa." });
  }
});

// 4. Buscar mensagens de uma conversa específica
router.get("/threads/:id/messages", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verificar se a thread pertence ao usuário
    const [threads] = await pool.query(
      "SELECT id, titulo FROM dev_ia_threads WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (threads.length === 0) {
      return res.status(404).json({ error: "Conversa não encontrada." });
    }

    const [messages] = await pool.query(
      "SELECT id, thread_id, sender, content, created_at FROM dev_ia_messages WHERE thread_id = ? ORDER BY id ASC",
      [id]
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error("Erro ao buscar mensagens da thread:", error);
    res.status(500).json({ error: "Erro ao carregar mensagens." });
  }
});

// 5. Enviar mensagem do usuário e obter resposta da Dev IA
router.post("/chat", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { thread_id, message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "A mensagem não pode estar vazia." });
    }

    let activeThreadId = thread_id;

    // Se não passou thread_id, cria uma nova thread automaticamente
    if (!activeThreadId) {
      const tituloGerado = message.length > 30 ? message.substring(0, 30) + "..." : message;
      const [newThread] = await pool.query(
        "INSERT INTO dev_ia_threads (user_id, titulo) VALUES (?, ?)",
        [userId, tituloGerado]
      );
      activeThreadId = newThread.insertId;
    } else {
      // Verificar se a thread existe
      const [threads] = await pool.query(
        "SELECT id, titulo FROM dev_ia_threads WHERE id = ? AND user_id = ?",
        [activeThreadId, userId]
      );
      if (threads.length === 0) {
        return res.status(404).json({ error: "Conversa não encontrada." });
      }
      
      // Atualizar o título se for o valor padrão "Nova conversa"
      if (threads[0].titulo === "Nova conversa") {
        const novoTitulo = message.length > 30 ? message.substring(0, 30) + "..." : message;
        await pool.query(
          "UPDATE dev_ia_threads SET titulo = ? WHERE id = ?",
          [novoTitulo, activeThreadId]
        );
      }
    }

    // Salvar mensagem do usuário no banco
    const [userMsgResult] = await pool.query(
      "INSERT INTO dev_ia_messages (thread_id, sender, content) VALUES (?, 'user', ?)",
      [activeThreadId, message]
    );

    // Buscar histórico de mensagens da thread
    const [history] = await pool.query(
      "SELECT sender, content FROM dev_ia_messages WHERE thread_id = ? ORDER BY id ASC",
      [activeThreadId]
    );

    // Chamar API da IA (Gemini ou Fallback)
    const responseText = await chamarGeminiAPI(history, message);

    // Salvar resposta da IA no banco
    const [iaMsgResult] = await pool.query(
      "INSERT INTO dev_ia_messages (thread_id, sender, content) VALUES (?, 'ia', ?)",
      [activeThreadId, responseText]
    );

    // Atualizar timestamp da thread
    await pool.query(
      "UPDATE dev_ia_threads SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [activeThreadId]
    );

    res.status(200).json({
      thread_id: activeThreadId,
      user_message: {
        id: userMsgResult.insertId,
        sender: "user",
        content: message
      },
      ia_message: {
        id: iaMsgResult.insertId,
        sender: "ia",
        content: responseText
      }
    });
  } catch (error) {
    console.error("Erro no chat da Dev IA:", error);
    res.status(500).json({ error: "Erro interno no processamento da resposta da IA." });
  }
});

// 6. Rota para obter Estatísticas Gerais (SuperAdmin / Admin)
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const [totaisUsuarios] = await pool.query("SELECT COUNT(*) as total FROM users");
    const [totaisAdmins] = await pool.query("SELECT COUNT(*) as total FROM users WHERE cargo IN ('admin', 'super_admin')");
    const [totaisThreads] = await pool.query("SELECT COUNT(*) as total FROM dev_ia_threads");
    const [totaisMsgs] = await pool.query("SELECT COUNT(*) as total FROM dev_ia_messages");
    const [totaisProvas] = await pool.query("SELECT COUNT(*) as total FROM provas").catch(() => [[{ total: 0 }]]);
    const [totaisUrls] = await pool.query("SELECT COUNT(*) as total FROM urls").catch(() => [[{ total: 0 }]]);

    res.status(200).json({
      total_usuarios: totaisUsuarios[0]?.total || 0,
      total_admins: totaisAdmins[0]?.total || 0,
      total_dev_ia_threads: totaisThreads[0]?.total || 0,
      total_dev_ia_messages: totaisMsgs[0]?.total || 0,
      total_provas: totaisProvas[0]?.total || 0,
      total_urls: totaisUrls[0]?.total || 0,
      has_gemini_key: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "")
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({ error: "Erro ao buscar métricas do sistema." });
  }
});

module.exports = router;
