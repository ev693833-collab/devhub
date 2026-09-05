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

const MODELOS_GEMINI = [
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3.5-flash",
  "gemini-pro-latest",
  "gemini-3.6-flash",
  "gemma-4-26b-a4b-it"
];

const SYSTEM_DEV_IA = `Você é a Dev IA, uma assistente virtual de estudos focada ESTRITAMENTE em Programação, Engenharia de Software, Ciência da Computação e Tecnologia.

⛔ TRAVA E REGRAS DE CONTEÚDO (RIGOROSAMENTE OBRIGATÓRIAS):
1. VOCÊ É EXCLUSIVAMENTE UM TUTOR ACADÊMICO DE PROGRAMAÇÃO E TECNOLOGIA DA INFORMAÇÃO.
2. Se o usuário fizer perguntas que NÃO envolvam programação, código, tecnologia, banco de dados, lógica, infraestrutura, desenvolvimento web/mobile ou a plataforma DevHub (exemplo: fofocas, receitas culinárias, política, futebol, conselhos amorosos ou bate-papo geral não-técnico), VOCÊ DEVE RECUSAR RESPONDER DE FORMA EDUCADA E DIRETA.
3. Resposta de Recusa Padrão: "Olá! Sou a Dev IA 🤖, sua assistente focada exclusivamente em estudos de programação e tecnologia. Não posso responder sobre este assunto, mas estou pronta para te ajudar com códigos, bugs, linguagens de programação (JS, Python, React, SQL, etc.) ou lógica de sistemas. Qual dúvida de programação vamos resolver hoje?"
4. Para dúvidas técnicas de programação: Seja sempre didática, encorajadora, clara e forneça exemplos de código limpo com Markdown e especificação da linguagem.
5. Fale sempre em Português do Brasil.
6. Você também gera slides didáticos, roteiros de áudio, planos de estudo e roadmaps de aprendizado quando o aluno pedir.`;

function temChaveGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim() !== "" && apiKey !== "SUA_CHAVE_GEMINI_AQUI");
}

async function gerarComGemini(contents) {
  if (!temChaveGemini()) return null;
  const apiKey = process.env.GEMINI_API_KEY;

  for (const modelo of MODELOS_GEMINI) {
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
        if (candidateText) return candidateText;
      }
    } catch (err) {
      console.warn(`Tentativa com modelo ${modelo} falhou:`, err.message);
    }
  }

  return null;
}

function extrairJson(texto) {
  if (!texto) return null;
  const bloco = texto.match(/```(?:json)?\s*([\s\S]*?)```/);
  const bruto = bloco ? bloco[1] : texto;
  const objeto = bruto.match(/\{[\s\S]*\}/);
  if (!objeto) return null;
  try {
    return JSON.parse(objeto[0]);
  } catch {
    return null;
  }
}

// Helper para chamar a API do Gemini via REST
async function chamarGeminiAPI(messagesHistory, userPrompt) {
  if (!temChaveGemini()) {
    return gerarRespostaFallback(userPrompt);
  }

  const systemInstruction = SYSTEM_DEV_IA;

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

  const texto = await gerarComGemini(contents);
  if (texto) return texto;

  console.error("Nenhum modelo Gemini respondeu com sucesso. Acionando fallback.");
  return gerarRespostaFallback(userPrompt);
}

function fallbackSlides(tema) {
  return {
    titulo: `Slides: ${tema}`,
    slides: [
      { titulo: tema, bullets: ["O que vamos aprender", "Por que isso importa no dia a dia", "Como praticar depois da aula"], explicacao: `Visão geral de ${tema} para estudo.` },
      { titulo: "Conceito central", bullets: ["Definição simples", "Quando usar", "Erro comum de iniciante"], explicacao: "Comece pelo porquê antes da sintaxe." },
      { titulo: "Exemplo prático", bullets: ["Um caso real", "Passo a passo", "Resultado esperado"], explicacao: "Aprender vendo o código em ação." },
      { titulo: "Pratique agora", bullets: ["Exercício curto", "Checklist de revisão", "Próximo tópico"], explicacao: "Feche o ciclo com uma tarefa pequena." }
    ]
  };
}

function fallbackAudio(tema) {
  return {
    titulo: `Explicação em áudio: ${tema}`,
    roteiro: `Olá! Vamos falar sobre ${tema}. Primeiro, entenda o problema que essa tecnologia resolve. Depois, veja a ideia principal em uma frase simples. Em seguida, pense em um exemplo do dia a dia de quem programa. Por fim, pratique com um exercício curto e revise o que ficou confuso. Quando terminar, tente explicar ${tema} em voz alta com suas próprias palavras.`
  };
}

function fallbackPlano(tema) {
  return {
    titulo: `Plano de estudos: ${tema}`,
    duracao: "30 dias",
    objetivo: `Sair do zero e construir uma base sólida em ${tema}, com prática diária.`,
    semanas: [1, 2, 3, 4].map((semana) => ({
      semana,
      foco: semana === 1 ? "Fundamentos" : semana === 2 ? "Prática guiada" : semana === 3 ? "Projetos pequenos" : "Revisão e desafio final",
      dias: Array.from({ length: 7 }, (_, i) => ({
        dia: (semana - 1) * 7 + i + 1,
        tema: `${tema} — dia ${(semana - 1) * 7 + i + 1}`,
        tarefa: i === 6 ? "Revisar a semana e anotar dúvidas" : `Estudar e praticar um exercício de ${tema}`
      }))
    }))
  };
}

function fallbackRoadmap(tema) {
  const t = (tema || "").toLowerCase();
  if (t.includes("react") || t.includes("web") || t.includes("frontend") || !tema) {
    return {
      titulo: "Minha Jornada — Desenvolvimento Web",
      objetivo: tema || "Aprender o caminho clássico até React e Node.js",
      linhas: [
        { tipo: "passo", id: "html", label: "HTML", dica: "Estrutura das páginas" },
        { tipo: "passo", id: "css", label: "CSS", dica: "Estilo e layout" },
        { tipo: "passo", id: "javascript", label: "JavaScript", dica: "Lógica e interatividade" },
        {
          tipo: "bifurcacao",
          esquerda: { id: "react", label: "React", dica: "Interface no navegador" },
          direita: { id: "nodejs", label: "Node.js", dica: "Backend com JavaScript" }
        },
        { tipo: "passo", id: "projeto", label: "Projeto Full Stack", dica: "Juntar front e back" }
      ]
    };
  }

  return {
    titulo: `Minha Jornada — ${tema}`,
    objetivo: `Trilha progressiva para aprender ${tema}`,
    linhas: [
      { tipo: "passo", id: "base", label: "Fundamentos", dica: "Conceitos essenciais" },
      { tipo: "passo", id: "pratica", label: "Prática", dica: "Exercícios guiados" },
      { tipo: "passo", id: "projeto", label: "Primeiro projeto", dica: "Aplicar o que estudou" },
      {
        tipo: "bifurcacao",
        esquerda: { id: "profundar", label: "Aprofundar", dica: "Tópicos avançados" },
        direita: { id: "ferramentas", label: "Ferramentas", dica: "Ecossistema e deploy" }
      },
      { tipo: "passo", id: "portfolio", label: "Portfólio", dica: "Mostrar seu progresso" }
    ]
  };
}

async function gerarFerramentaEstudo(tipo, tema) {
  const temaLimpo = (tema || "").trim() || "programação web";

  const prompts = {
    slides: `Gere uma apresentação didática sobre "${temaLimpo}" para alunos de programação.
Retorne APENAS JSON válido, sem markdown, no formato:
{"titulo":"...","slides":[{"titulo":"...","bullets":["...","...","..."],"explicacao":"..."}]}
Use 6 a 8 slides, linguagem simples em português do Brasil.`,
    audio: `Escreva um roteiro FALADO (português do Brasil) explicando "${temaLimpo}" para um aluno iniciante.
Sem markdown, sem listas, sem emojis. Tom de professor paciente. Duração de 90 a 150 segundos quando lido em voz alta.
Retorne APENAS JSON: {"titulo":"...","roteiro":"..."}`,
    plano: `Crie um plano de estudos para este pedido: "${temaLimpo}".
Se o aluno não informar prazo, use 30 dias. Seja concreto (o que estudar e o que praticar em cada dia).
Retorne APENAS JSON:
{"titulo":"...","duracao":"...","objetivo":"...","semanas":[{"semana":1,"foco":"...","dias":[{"dia":1,"tema":"...","tarefa":"..."}]}]}`,
    roadmap: `Crie um roadmap visual de aprendizado para: "${temaLimpo}".
A trilha deve ter etapas lineares e UMA bifurcação (dois caminhos em paralelo que depois se encontram).
ids em snake_case, labels curtos (1 a 3 palavras).
Retorne APENAS JSON:
{"titulo":"...","objetivo":"...","linhas":[{"tipo":"passo","id":"...","label":"...","dica":"..."},{"tipo":"bifurcacao","esquerda":{"id":"...","label":"...","dica":"..."},"direita":{"id":"...","label":"...","dica":"..."}}]}`
  };

  const fallbacks = {
    slides: () => fallbackSlides(temaLimpo),
    audio: () => fallbackAudio(temaLimpo),
    plano: () => fallbackPlano(temaLimpo),
    roadmap: () => fallbackRoadmap(temaLimpo)
  };

  const texto = await gerarComGemini([
    { role: "user", parts: [{ text: `Instrução do Sistema: ${SYSTEM_DEV_IA}` }] },
    { role: "model", parts: [{ text: "Entendido. Vou responder só com JSON válido quando pedido." }] },
    { role: "user", parts: [{ text: prompts[tipo] }] }
  ]);

  const json = extrairJson(texto);
  if (json && typeof json === "object") return json;
  return fallbacks[tipo]();
}

function resumoMarkdownFerramenta(tipo, dados) {
  if (tipo === "slides") {
    const slides = dados.slides || [];
    return `### 🎨 Slides: ${dados.titulo || ""}\n\n` + slides.map((s, i) => `**${i + 1}. ${s.titulo}**\n${(s.bullets || []).map((b) => `- ${b}`).join("\n")}`).join("\n\n");
  }
  if (tipo === "audio") {
    return `### 🎧 Explicação em áudio: ${dados.titulo || ""}\n\n${dados.roteiro || ""}`;
  }
  if (tipo === "plano") {
    const semanas = dados.semanas || [];
    return `### 🎯 ${dados.titulo || "Plano de estudos"}\n\n**Duração:** ${dados.duracao || ""}\n\n**Objetivo:** ${dados.objetivo || ""}\n\n` + semanas.map((s) => `#### Semana ${s.semana} — ${s.foco}\n` + (s.dias || []).map((d) => `- Dia ${d.dia}: **${d.tema}** — ${d.tarefa}`).join("\n")).join("\n\n");
  }
  if (tipo === "roadmap") {
    return `### 🗺️ ${dados.titulo || "Roadmap"}\n\n${dados.objetivo || ""}\n\nAbra **Minha Jornada** para ver o mapa visual e marcar o que você já concluiu.`;
  }
  return "";
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

> 📌 *Configuração*: Adicione a \`GEMINI_API_KEY\` no arquivo \`.env\` do servidor para respostas IA personalizadas ativas!

Você também pode usar as ferramentas: **Criar slides**, **Explicar por áudio**, **Plano de estudos** e **Roadmap (Minha Jornada)**.`;
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

// 5b. Ferramentas de estudo: slides, áudio, plano e roadmap
router.post("/ferramenta", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { thread_id, tipo, tema } = req.body;
    const tiposOk = ["slides", "audio", "plano", "roadmap"];

    if (!tiposOk.includes(tipo)) {
      return res.status(400).json({ error: "Tipo de ferramenta inválido." });
    }

    const temaLimpo = (tema || "").trim();
    if (!temaLimpo) {
      return res.status(400).json({ error: "Informe o assunto para gerar o material." });
    }

    let activeThreadId = thread_id;
    if (!activeThreadId) {
      const tituloGerado = temaLimpo.length > 30 ? temaLimpo.substring(0, 30) + "..." : temaLimpo;
      const [newThread] = await pool.query(
        "INSERT INTO dev_ia_threads (user_id, titulo) VALUES (?, ?)",
        [userId, tituloGerado]
      );
      activeThreadId = newThread.insertId;
    } else {
      const [threads] = await pool.query(
        "SELECT id FROM dev_ia_threads WHERE id = ? AND user_id = ?",
        [activeThreadId, userId]
      );
      if (threads.length === 0) {
        return res.status(404).json({ error: "Conversa não encontrada." });
      }
    }

    const rotulos = {
      slides: "Criar slides",
      audio: "Explicar por áudio",
      plano: "Plano de estudos",
      roadmap: "Roadmap de aprendizado"
    };

    const mensagemUsuario = `${rotulos[tipo]}: ${temaLimpo}`;
    const dados = await gerarFerramentaEstudo(tipo, temaLimpo);
    const respostaMarkdown = resumoMarkdownFerramenta(tipo, dados);

    await pool.query(
      "INSERT INTO dev_ia_messages (thread_id, sender, content) VALUES (?, 'user', ?)",
      [activeThreadId, mensagemUsuario]
    );
    const [iaMsgResult] = await pool.query(
      "INSERT INTO dev_ia_messages (thread_id, sender, content) VALUES (?, 'ia', ?)",
      [activeThreadId, respostaMarkdown]
    );
    await pool.query(
      "UPDATE dev_ia_threads SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [activeThreadId]
    );

    res.status(200).json({
      thread_id: activeThreadId,
      tipo,
      dados,
      ia_message: {
        id: iaMsgResult.insertId,
        sender: "ia",
        content: respostaMarkdown
      }
    });
  } catch (error) {
    console.error("Erro na ferramenta da Dev IA:", error);
    res.status(500).json({ error: "Erro ao gerar o material de estudo." });
  }
});

// 5c. Simulador de Entrevista Técnica (Mock Technical Interview)
router.post("/entrevista", verifyToken, async (req, res) => {
  try {
    const { acao, cargo, nivel, historico, respostaUsuario, perguntaIndex } = req.body;
    const resultado = await gerarEntrevistaTecnica({
      acao: acao || "iniciar",
      cargo: cargo || "Frontend React",
      nivel: nivel || "Júnior",
      historico: historico || [],
      respostaUsuario: respostaUsuario || "",
      perguntaIndex: perguntaIndex || 1
    });

    res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no Simulador de Entrevista:", error);
    res.status(500).json({ error: "Erro ao processar a entrevista técnica." });
  }
});

async function gerarEntrevistaTecnica({ acao, cargo, nivel, historico, respostaUsuario, perguntaIndex }) {
  const stack = cargo || "Frontend React";
  const seniority = nivel || "Júnior";

  if (acao === "iniciar") {
    const prompt = `Você é um Tech Lead entrevistando um candidato para a vaga de ${stack} (${seniority}).
Gere a PRIMEIRA pergunta técnica de entrevista (pergunta 1 de 3) sobre ${stack} em nível ${seniority}.
Seja profissional, direto e encorajador. Retorne no formato JSON com a estrutura: {"pergunta": "..."}`;

    const contents = [{ role: "user", parts: [{ text: prompt }] }];
    const resGemini = await gerarComGemini(contents);
    const json = extrairJson(resGemini);
    const pergunta = json?.pergunta || (
      stack.includes("React")
        ? "Pergunta 1: Explique como funciona o Virtual DOM no React e qual a diferença prática entre useState e useEffect."
        : stack.includes("Node")
        ? "Pergunta 1: Como funciona o Event Loop no Node.js e como lidamos com operações não-bloqueantes (async)?"
        : "Pergunta 1: Qual a diferença entre INNER JOIN e LEFT JOIN no SQL e em quais casos devemos usar cada um?"
    );

    return {
      cargo: stack,
      nivel: seniority,
      perguntaAtual: pergunta,
      perguntaIndex: 1,
      totalPerguntas: 3
    };
  }

  if (acao === "avaliar") {
    const isUltima = perguntaIndex >= 3;
    const prompt = `Você é um Tech Lead avaliando a resposta de um candidato para a vaga de ${stack} (${seniority}).
Histórico anterior:
${JSON.stringify(historico || [])}
Resposta atual do candidato para a pergunta ${perguntaIndex}:
"${respostaUsuario}"

${isUltima ? `Esta foi a ÚLTIMA pergunta (3 de 3). Faça a avaliação final consolidada do candidato e retorne um JSON com a estrutura EXATA:
{
  "feedbackResposta": "Avaliação curta da resposta dada",
  "concluido": true,
  "notaFinal": 8.5,
  "aprovado": true,
  "pontosFortes": ["ponto 1", "ponto 2"],
  "pontosMelhorar": ["ponto a ser aprimorado"],
  "dicaSenior": "Dica prática para impressionar recrutadores reais"
}` : `Avalie a resposta e gere a PRÓXIMA pergunta (${perguntaIndex + 1} de 3). Retorne um JSON com a estrutura:
{
  "feedbackResposta": "Avaliação curta da resposta dada",
  "concluido": false,
  "proximaPergunta": "Pergunta 2 ou 3 técnica..."
}`}`;

    const contents = [{ role: "user", parts: [{ text: prompt }] }];
    const resGemini = await gerarComGemini(contents);
    const json = extrairJson(resGemini);

    if (json) {
      if (isUltima) {
        return {
          concluido: true,
          feedbackResposta: json.feedbackResposta || "Excelente raciocínio técnico demonstrado!",
          notaFinal: json.notaFinal || 8.5,
          aprovado: (json.notaFinal || 8.5) >= 7,
          pontosFortes: json.pontosFortes || ["Boa articulação técnica", "Compreensão clara dos conceitos de " + stack],
          pontosMelhorar: json.pontosMelhorar || ["Adicionar exemplos práticos de código na explicação"],
          dicaSenior: json.dicaSenior || "Em entrevistas técnicas, ilustre suas respostas com cenários reais em que você aplicou a solução.",
          xpGanha: 150
        };
      } else {
        return {
          concluido: false,
          perguntaIndex: perguntaIndex + 1,
          feedbackResposta: json.feedbackResposta || "Boa resposta! Vamos para a próxima pergunta.",
          perguntaAtual: json.proximaPergunta || `Pergunta ${perguntaIndex + 1}: Como você lida com tratamento de erros e exceções em ${stack}?`
        };
      }
    }

    // Fallback inteligente caso Gemini não retorne JSON
    if (isUltima) {
      return {
        concluido: true,
        feedbackResposta: "Boa explicação técnica geral!",
        notaFinal: 8.5,
        aprovado: true,
        pontosFortes: ["Conhecimento sólido dos conceitos fundamentais de " + stack, "Respostas objetivas e estruturadas"],
        pontosMelhorar: ["Aprofundar detalhes de otimização de performance e boas práticas de arquitetura"],
        dicaSenior: "Mencione sempre como suas escolhas de código impactam a experiência do usuário final e o desempenho do sistema.",
        xpGanha: 150
      };
    } else {
      const perguntasFallback = [
        "",
        "",
        `Pergunta 2: Como você lida com tratamento de erros e exceções assíncronas em ${stack}?`,
        `Pergunta 3: Como você garante a escalabilidade e a manutenção do Clean Code ao estruturar um projeto em ${stack}?`
      ];
      return {
        concluido: false,
        perguntaIndex: perguntaIndex + 1,
        feedbackResposta: "Ótima colocação! Vamos para a próxima questão técnica.",
        perguntaAtual: perguntasFallback[perguntaIndex + 1] || "Pergunta 3: Quais boas práticas de segurança você aplica no seu código?"
      };
    }
  }
}

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
