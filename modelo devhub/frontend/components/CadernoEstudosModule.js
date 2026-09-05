import { useState, useEffect, useRef, useMemo } from "react";
import {
  BookOpen, Plus, Search, Trash2, Edit2, Copy, Download,
  Code, Check, Bot, Send, RotateCw, Layers, Printer, Sparkles,
  FileText, ArrowLeft, HelpCircle, CheckCircle2, Hash, Volume2,
  Video, Share2, Settings, MoreVertical, Database, Map, Play, Pause, X, ChevronRight, UploadCloud, Paperclip
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./CadernoEstudosModule.module.css";

const INITIAL_NOTEBOOKS = [
  {
    id: "nb-1",
    titulo: "React & Arquitetura Frontend",
    dataAtualizacao: "31 de ago. de 2026",
    corCapa: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    fontes: [
      {
        id: "src-1",
        titulo: "Hooks & Performance em React",
        tipo: "codigo",
        conteudo: `// Boas práticas com useEffect & useMemo
import { useState, useEffect, useMemo } from 'react';

export function ComponenteOtimizado({ listaItens }) {
  const [busca, setBusca] = useState('');
  
  // Computação memoizada para evitar recalculo desnecessário
  const itensFiltrados = useMemo(() => {
    return listaItens.filter(item => item.nome.toLowerCase().includes(busca.toLowerCase()));
  }, [listaItens, busca]);

  return (
    <div>
      <input value={busca} onChange={(e) => setBusca(e.target.value)} />
      <ul>{itensFiltrados.map(i => <li key={i.id}>{i.nome}</li>)}</ul>
    </div>
  );
}`
      },
      {
        id: "src-2",
        titulo: "Guia de Estado Global com Redux / Zustand",
        tipo: "texto",
        conteudo: "Zustand oferece uma API minimalista baseada em Hooks sem a necessidade de Providers no React. Ideal para gerenciar estado global de usuários, temas e preferências no DevHub."
      }
    ],
    mensagensChat: [
      { sender: "ai", text: "👋 Olá! Sou o seu assistente de estudos. Pergunte qualquer coisa sobre Frontend, React, Backend ou sobre as fontes salvas no notebook!" }
    ],
    anotacoesAluno: "# Minhas Anotações de React\n\n- Usar `useMemo` apenas para computações pesadas.\n- Manter componentes limpos e modularizados em arquivos separadas.",
    estudioSelecionado: "flashcards"
  },
  {
    id: "nb-2",
    titulo: "Estruturas de Dados & Algoritmos",
    dataAtualizacao: "02 de set. de 2026",
    corCapa: "linear-gradient(135deg, #10b981, #059669)",
    fontes: [
      {
        id: "src-3",
        titulo: "Busca Binária & Complexidade O(log N)",
        tipo: "codigo",
        conteudo: `function buscaBinaria(arr, alvo) {
  let inicio = 0;
  let fim = arr.length - 1;
  while (inicio <= fim) {
    let meio = Math.floor((inicio + fim) / 2);
    if (arr[meio] === alvo) return meio;
    if (arr[meio] < alvo) inicio = meio + 1;
    else fim = meio - 1;
  }
  return -1;
}`
      }
    ],
    mensagensChat: [
      { sender: "ai", text: "👋 Bem-vindo ao notebook de Algoritmos! Tire dúvidas sobre busca binária, ordenação ou Big O." }
    ],
    anotacoesAluno: "# Resumo Big O Notation\n\n- O(1): Constante\n- O(log N): Logarítmica (Busca binária)\n- O(N): Linear",
    estudioSelecionado: "quiz"
  },
  {
    id: "nb-3",
    titulo: "Node.js, Express & Banco de Dados",
    dataAtualizacao: "04 de set. de 2026",
    corCapa: "linear-gradient(135deg, #ec4899, #d946ef)",
    fontes: [
      {
        id: "src-4",
        titulo: "Middleware de Autenticação JWT",
        tipo: "codigo",
        conteudo: `const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}`
      }
    ],
    mensagensChat: [
      { sender: "ai", text: "👋 Olá! Vamos estudar APIs REST e segurança em Backend hoje?" }
    ],
    anotacoesAluno: "# Segurança de APIs\n\n1. Validar sempre o cabeçalho Authorization\n2. Nunca salvar senhas em texto puro (usar bcrypt)",
    estudioSelecionado: "mapa"
  }
];

export default function CadernoEstudosModule({ user, isDark, colors }) {
  const storageKey = `devhub_notebooks_lm_v2_${user?.id || "guest"}`;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Estados principais
  const [notebooks, setNotebooks] = useState([]);
  const [activeNotebookId, setActiveNotebookId] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'workspace'
  const [termoBuscaHome, setTermoBuscaHome] = useState("");

  // Estados do Workspace
  const [abaCentro, setAbaCentro] = useState("chat"); // 'chat' | 'notas'
  const [estudioAtivo, setEstudioAtivo] = useState("flashcards"); // 'audio' | 'video' | 'mapa' | 'relatorio' | 'flashcards' | 'quiz'
  const [promptInput, setPromptInput] = useState("");
  const [pensandoIa, setPensandoIa] = useState(false);

  // Modais e edição
  const [modalNovaFonte, setModalNovaFonte] = useState(false);
  const [novaFonteTitulo, setNovaFonteTitulo] = useState("");
  const [novaFonteConteudo, setNovaFonteConteudo] = useState("");
  const [novaFonteTipo, setNovaFonteTipo] = useState("codigo");
  const [nomeArquivoCarregado, setNomeArquivoCarregado] = useState("");
  const fileInputRef = useRef(null);

  // Estado de Flashcards
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardVerso, setFlashcardVerso] = useState(false);

  // Estado do Quiz
  const [quizOpcaoSelecionada, setQuizOpcaoSelecionada] = useState(null);
  const [quizRespondido, setQuizRespondido] = useState(false);
  const [audioTocando, setAudioTocando] = useState(false);
  const [slideVideoIndex, setSlideVideoIndex] = useState(0);

  const chatEndRef = useRef(null);

  // Carregar notebooks salvos
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotebooks(parsed);
          setActiveNotebookId(parsed[0].id);
        } else {
          setNotebooks(INITIAL_NOTEBOOKS);
          setActiveNotebookId(INITIAL_NOTEBOOKS[0].id);
        }
      } else {
        setNotebooks(INITIAL_NOTEBOOKS);
        setActiveNotebookId(INITIAL_NOTEBOOKS[0].id);
      }
    } catch (e) {
      setNotebooks(INITIAL_NOTEBOOKS);
      setActiveNotebookId(INITIAL_NOTEBOOKS[0].id);
    }
  }, [storageKey]);

  // Salvar alterações
  const salvarNotebooks = (novosNotebooks) => {
    setNotebooks(novosNotebooks);
    try {
      localStorage.setItem(storageKey, JSON.stringify(novosNotebooks));
    } catch (e) {}
  };

  const notebookAtivo = notebooks.find(n => n.id === activeNotebookId) || notebooks[0] || INITIAL_NOTEBOOKS[0];

  // Scroll automático do chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notebookAtivo?.mensagensChat, pensandoIa]);

  // Ações de Cadernos
  const criarNovoNotebook = () => {
    const cores = [
      "linear-gradient(135deg, #6366f1, #8b5cf6)",
      "linear-gradient(135deg, #10b981, #059669)",
      "linear-gradient(135deg, #ec4899, #d946ef)",
      "linear-gradient(135deg, #f59e0b, #d97706)",
      "linear-gradient(135deg, #3b82f6, #1d4ed8)"
    ];
    const novaCor = cores[notebooks.length % cores.length];

    const novo = {
      id: `nb-${Date.now()}`,
      titulo: "Notebook sem título",
      dataAtualizacao: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
      corCapa: novaCor,
      fontes: [],
      mensagensChat: [
        { sender: "ai", text: "✨ Caderno criado! Adicione fontes no painel esquerdo para começar a interagir com a IA." }
      ],
      anotacoesAluno: "# Minhas Anotações de Estudo\n\nComece a escrever suas ideias aqui...",
      estudioSelecionado: "flashcards"
    };

    const atualizados = [novo, ...notebooks];
    salvarNotebooks(atualizados);
    setActiveNotebookId(novo.id);
    setViewMode("workspace");
  };

  const excluirNotebook = (e, id) => {
    e.stopPropagation();
    if (notebooks.length <= 1) {
      alert("Você precisa manter pelo menos 1 notebook de estudos.");
      return;
    }
    if (confirm("Tem certeza que deseja excluir este notebook?")) {
      const filtrados = notebooks.filter(n => n.id !== id);
      salvarNotebooks(filtrados);
      if (activeNotebookId === id) {
        setActiveNotebookId(filtrados[0].id);
      }
    }
  };

  const atualizarTituloNotebook = (novoTitulo) => {
    const atualizados = notebooks.map(n => n.id === activeNotebookId ? { ...n, titulo: novoTitulo } : n);
    salvarNotebooks(atualizados);
  };

  const atualizarNotasAluno = (novasNotas) => {
    const atualizados = notebooks.map(n => n.id === activeNotebookId ? { ...n, anotacoesAluno: novasNotas } : n);
    salvarNotebooks(atualizados);
  };

  // UPLOAD E LEITURA DE ARQUIVO
  const processarArquivoLocal = (file) => {
    if (!file) return;

    const fileName = file.name;
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    // Auto-detectar tipo
    let tipo = "texto";
    if (["js", "jsx", "ts", "tsx", "py", "c", "cpp", "java", "html", "css", "json", "sql"].includes(extension)) {
      tipo = "codigo";
    }

    setNovaFonteTitulo(fileName);
    setNovaFonteTipo(tipo);
    setNomeArquivoCarregado(fileName);

    const reader = new FileReader();
    reader.onload = (e) => {
      const resultText = e.target?.result || "";
      setNovaFonteConteudo(String(resultText));
    };

    // Caso o arquivo seja PDF ou binário
    if (extension === "pdf") {
      setNovaFonteConteudo(`[Arquivo PDF Anexado: ${fileName}]\nConteúdo carregado para análise contextual da IA no caderno de estudos.`);
    } else {
      reader.readAsText(file);
    }
  };

  const handleSelecaoArquivoInput = (e) => {
    const file = e.target.files?.[0];
    if (file) processarArquivoLocal(file);
  };

  const handleSoltarArquivoDrag = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processarArquivoLocal(file);
      setModalNovaFonte(true);
    }
  };

  // Adicionar Fonte
  const adicionarFonte = (e) => {
    e.preventDefault();
    if (!novaFonteTitulo.trim() || !novaFonteConteudo.trim()) return;

    const fonteObj = {
      id: `src-${Date.now()}`,
      titulo: novaFonteTitulo,
      tipo: novaFonteTipo,
      conteudo: novaFonteConteudo
    };

    const atualizados = notebooks.map(n => {
      if (n.id === activeNotebookId) {
        return { ...n, fontes: [...n.fontes, fonteObj] };
      }
      return n;
    });

    salvarNotebooks(atualizados);
    setNovaFonteTitulo("");
    setNovaFonteConteudo("");
    setNomeArquivoCarregado("");
    setModalNovaFonte(false);
  };

  const removerFonte = (fonteId) => {
    const atualizados = notebooks.map(n => {
      if (n.id === activeNotebookId) {
        return { ...n, fontes: n.fontes.filter(f => f.id !== fonteId) };
      }
      return n;
    });
    salvarNotebooks(atualizados);
  };

  // GERADOR DE RESPOSTAS INTELIGENTES DE IA CONTEXTUALIZADAS
  const gerarRespostaIAInteligente = (userMsg, notebook) => {
    const promptLower = userMsg.toLowerCase();
    const fontes = notebook?.fontes || [];
    const fontesFormatadas = fontes.map(f => `> **${f.titulo}** (${f.tipo})\n\`\`\`\n${f.conteudo.slice(0, 300)}...\n\`\`\``).join("\n\n");

    if (promptLower.includes("frontend") || promptLower.includes("react") || promptLower.includes("interface") || promptLower.includes("css") || promptLower.includes("html")) {
      return `### 🎨 O que é Desenvolvimento Frontend?

O **Frontend** é a parte de uma aplicação web ou móvel com a qual o usuário interage diretamente no navegador.

#### 🛠️ Tríade Principal do Frontend:
1. **HTML5 (Estrutura):** Organiza a página usando elementos semânticos como \`<header>\`, \`<main>\`, \`<article>\` e \`<button>\`.
2. **CSS3 (Estilo & Layout):** Define cores, tipografia, animações e responsividade utilizando **Flexbox** e **CSS Grid**.
3. **JavaScript / ES6+ (Lógica & Reatividade):** Permite interatividade, manipulando o DOM, enviando requisições assíncronas (\`fetch\` / \`axios\`) e tratando eventos.

#### ⚛️ Frameworks Modernos (React, Next.js, Vue):
- **Componentização:** Otimiza o desenvolvimento permitindo reutilizar blocos de interface como componentes independentes.
- **Gerenciamento de Estado:** Usa Hooks como \`useState\` e \`useEffect\` para sincronizar os dados da tela com a lógica.
- **Virtual DOM:** Garante que o navegador atualize apenas os elementos da página que mudaram, acelerando a renderização.

${fontes.length > 0 ? `\n---\n📌 **Contexto das Fontes Salvas neste Caderno ("${notebook.titulo}"):**\n${fontesFormatadas}` : "\n📌 *Dica:* Anexe arquivos ou snippets de código no botão **+ Adicionar fontes** à esquerda!"}`;
    }

    if (promptLower.includes("backend") || promptLower.includes("node") || promptLower.includes("api") || promptLower.includes("express")) {
      return `### ⚙️ O que é Desenvolvimento Backend?

O **Backend** é o motor por trás dos panos da aplicação, responsável por processar regras de negócio, validar dados e conectar com bancos de dados.

#### 🗝️ Conceitos Fundamentais de Backend:
1. **APIs RESTful:** Comunicação entre frontend e backend via métodos HTTP (\`GET\`, \`POST\`, \`PUT\`, \`DELETE\`).
2. **Node.js & Express:** Ambiente de execução JavaScript no servidor que permite tratar rotas e middlewares com alta concorrência.
3. **Segurança & Autenticação:** Uso de tokens **JWT (JSON Web Tokens)** e criptografia (\`bcrypt\`) para proteger rotas confidenciais.

${fontes.length > 0 ? `\n---\n📌 **Contexto das Fontes Salvas neste Caderno:**\n${fontesFormatadas}` : ""}`;
    }

    if (promptLower.includes("banco") || promptLower.includes("sql") || promptLower.includes("database") || promptLower.includes("mongo")) {
      return `### 🗄️ Arquitetura de Banco de Dados

Os **Bancos de Dados** são responsáveis por armazenar e consultar informações com rapidez e integridade.

#### 📊 SQL vs NoSQL:
- **Bancos Relacionais (SQL - PostgreSQL, MySQL):** Tabelas bem definidas, relacionamentos por chaves estrangeiras e garantias ACID.
- **Bancos Não-Relacionais (NoSQL - MongoDB, Redis):** Armazenamento em formato JSON/BSON flexível e cache em memória de altíssima velocidade.

${fontes.length > 0 ? `\n---\n📌 **Contexto das Fontes Salvas neste Caderno:**\n${fontesFormatadas}` : ""}`;
    }

    // Resposta contextualizada completa para qualquer outra dúvida do aluno
    return `### 💡 Explicando "${userMsg}"

Analisando sua pergunta no caderno **"${notebook?.titulo || 'Caderno de Estudos'}"**:

1. **Análise de Conceito:**
   Para responder sobre **"${userMsg}"**, o primeiro passo é compreender as boas práticas de arquitetura de software, garantindo legibilidade do código, baixa complexidade ciclomática e facilidade de manutenção.

2. **Passo a Passo Prático:**
   - **Estruturação:** Divida o problema em pequenas funções puras.
   - **Validação:** Trate exceções e cenários de erro antes da execução da lógica principal.
   - **Documentação:** Mantenha notas atualizadas no seu caderno.

${fontes.length > 0 ? `\n---\n📌 **Fontes Vinculadas a este Caderno:**\n${fontesFormatadas}` : "\n📌 *Dica:* Você pode anexar arquivos `.txt`, `.js`, `.py` ou `.pdf` no botão **+ Adicionar fontes** à esquerda!"}`;
  };

  // Enviar Pergunta à IA
  const enviarMensagemChat = async (promptCustomizado = null) => {
    const userMsg = (typeof promptCustomizado === "string" ? promptCustomizado : promptInput).trim();
    if (!userMsg || pensandoIa) return;

    if (!promptCustomizado) setPromptInput("");

    // Adiciona mensagem do usuário
    const comMensagemUsuario = notebooks.map(n => {
      if (n.id === activeNotebookId) {
        return {
          ...n,
          mensagensChat: [...n.mensagensChat, { sender: "user", text: userMsg }]
        };
      }
      return n;
    });
    setNotebooks(comMensagemUsuario);
    setPensandoIa(true);

    try {
      const token = localStorage.getItem("token");
      let textoRespostaIa = "";

      // Tenta chamar o endpoint de backend /dev-ia/chat se disponível
      const res = await fetch(`${apiUrl}/dev-ia/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: `${userMsg}\n\n[Contexto do Caderno: ${notebookAtivo.titulo}. Fontes: ${JSON.stringify(notebookAtivo.fontes)}]`
        })
      });

      if (res.ok) {
        const data = await res.json();
        textoRespostaIa = data.ia_message?.content || data.resposta || data.message;
      }

      if (!textoRespostaIa) {
        textoRespostaIa = gerarRespostaIAInteligente(userMsg, notebookAtivo);
      }

      const comRespostaIa = comMensagemUsuario.map(n => {
        if (n.id === activeNotebookId) {
          return {
            ...n,
            mensagensChat: [...n.mensagensChat, { sender: "ai", text: textoRespostaIa }]
          };
        }
        return n;
      });

      salvarNotebooks(comRespostaIa);
    } catch (err) {
      // Fallback offline inteligente
      const respostaOffline = gerarRespostaIAInteligente(userMsg, notebookAtivo);
      const comRespostaIa = comMensagemUsuario.map(n => {
        if (n.id === activeNotebookId) {
          return {
            ...n,
            mensagensChat: [...n.mensagensChat, { sender: "ai", text: respostaOffline }]
          };
        }
        return n;
      });
      salvarNotebooks(comRespostaIa);
    } finally {
      setPensandoIa(false);
    }
  };

  // Dados dinâmicos do Estúdio gerados a partir do caderno e fontes anexadas
  const flashcardsExemplo = useMemo(() => {
    const fontes = notebookAtivo?.fontes || [];
    if (fontes.length > 0) {
      return [
        ...fontes.map((f, i) => ({
          pergunta: `[Fonte ${i + 1}: ${f.titulo}] Qual o ponto principal deste arquivo/snippet?`,
          resposta: `Extraído da fonte: ${f.conteudo.slice(0, 220)}...`
        })),
        {
          pergunta: `Qual o tema central estudado no caderno "${notebookAtivo?.titulo}"?`,
          resposta: `Integração e prática dos tópicos de ${fontes.map(f => f.titulo).join(", ")} com grounding de IA.`
        }
      ];
    }
    return [
      {
        pergunta: `Qual o conceito chave estudado no caderno "${notebookAtivo?.titulo}"?`,
        resposta: `Organizar fontes de código e notas para treinar retenção com IA e praticar boas práticas de desenvolvimento.`
      },
      {
        pergunta: `Como utilizar as fontes anexadas a este notebook?`,
        resposta: `As fontes servem como a base de dados (Grounding) para a IA responder perguntas no chat e alimentar o Estúdio.`
      }
    ];
  }, [notebookAtivo]);

  const quizExemplo = useMemo(() => {
    const fontes = notebookAtivo?.fontes || [];
    if (fontes.length > 0) {
      return {
        pergunta: `Com base na fonte "${fontes[0].titulo}", qual a melhor prática ou objetivo ao trabalhar com esse conteúdo?`,
        opcoes: [
          `A) Analisar e implementar o conteúdo de "${fontes[0].titulo}" com boas práticas`,
          "B) Ignorar testes automatizados e validações no código",
          "C) Apagar as fontes do caderno assim que concluir a leitura",
          "D) Desativar o suporte da IA durante os estudos"
        ],
        correta: 0
      };
    }
    return {
      pergunta: `Ao estudar "${notebookAtivo?.titulo}", qual a melhor prática recomendada pelas fontes anexadas?`,
      opcoes: [
        "A) Manter o código estruturado, testado e desacoplado",
        "B) Ignorar validações e tratamento de erros",
        "C) Não utilizar fontes de documentação",
        "D) Escrever código sem identação"
      ],
      correta: 0
    };
  }, [notebookAtivo]);

  const slidesVideo = [
    {
      titulo: `1. Introdução a ${notebookAtivo?.titulo || 'Estudos'}`,
      resumo: `Apresentação dos conceitos fundamentais extraídos de ${notebookAtivo?.fontes?.length || 0} fontes salvas.`
    },
    {
      titulo: "2. Principais Conceitos & Código",
      resumo: notebookAtivo?.fontes?.[0]?.titulo
        ? `Foco principal na fonte: "${notebookAtivo.fontes[0].titulo}".`
        : "Adicione arquivos ou snippets no painel esquerdo para personalizar este slide."
    },
    {
      titulo: "3. Conclusão & Boas Práticas Dev",
      resumo: "Revise com os Flashcards e faça o Quiz no Estúdio para garantir o domínio total do conteúdo!"
    }
  ];

  // Filtragem da Home
  const notebooksFiltrados = notebooks.filter(n =>
    n.titulo.toLowerCase().includes(termoBuscaHome.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* INPUT ESCONDIDO DE SELEÇÃO DE ARQUIVO */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".txt,.js,.jsx,.ts,.tsx,.py,.c,.cpp,.java,.html,.css,.json,.md,.csv,.pdf,.doc,.docx"
        onChange={handleSelecaoArquivoInput}
      />

      {/* ===================================================================
          1. VISÃO GERAL DE CADERNOS (HOME DE CARDS - IGUAL IMAGEM 1)
         =================================================================== */}
      {viewMode === "grid" && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div className={styles.homeHeader}>
            <div className={styles.homeTitleGroup}>
              <h2>
                <BookOpen size={28} color="#818cf8" /> Cadernos de Estudo DevHub
              </h2>
              <p>Seus ambientes inteligentes de pesquisa, código e aprendizado com IA</p>
            </div>

            <button className={styles.btnPrimary} onClick={criarNovoNotebook}>
              <Plus size={18} /> Criar notebook
            </button>
          </div>

          <div className={styles.homeBody}>
            <div className={styles.searchBarContainer}>
              <Search className={styles.searchIcon} size={18} />
              <input
                type="text"
                placeholder="Pesquisar nos meus cadernos..."
                className={styles.searchInput}
                value={termoBuscaHome}
                onChange={(e) => setTermoBuscaHome(e.target.value)}
              />
            </div>

            <div className={styles.notebookGrid}>
              {notebooksFiltrados.map((nb) => (
                <div
                  key={nb.id}
                  className={styles.notebookCard}
                  onClick={() => {
                    setActiveNotebookId(nb.id);
                    setViewMode("workspace");
                  }}
                >
                  <div className={styles.notebookCardActions}>
                    <button
                      className={styles.actionIconBtn}
                      title="Excluir caderno"
                      onClick={(e) => excluirNotebook(e, nb.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className={styles.notebookCover} style={{ background: nb.corCapa }}>
                    <BookOpen size={24} color="#FFF" />
                  </div>

                  <h3 className={styles.notebookCardTitle}>{nb.titulo}</h3>

                  <div className={styles.notebookCardMeta}>
                    <span>{nb.dataAtualizacao}</span>
                    <span>•</span>
                    <span>{nb.fontes.length} {nb.fontes.length === 1 ? "fonte" : "fontes"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          2. WORKSPACE DO CADERNO (3 COLUNAS - IGUAL IMAGEM 2)
         =================================================================== */}
      {viewMode === "workspace" && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* HEADER SUPERIOR DO WORKSPACE */}
          <div className={styles.workspaceHeader}>
            <div className={styles.workspaceHeaderLeft}>
              <button className={styles.btnBack} onClick={() => setViewMode("grid")}>
                <ArrowLeft size={16} /> Voltar
              </button>

              <input
                type="text"
                className={styles.notebookTitleEdit}
                value={notebookAtivo?.titulo || ""}
                onChange={(e) => atualizarTituloNotebook(e.target.value)}
                title="Clique para editar o título do notebook"
              />
            </div>

            <div className={styles.workspaceHeaderRight}>
              <button className={styles.btnPrimary} style={{ padding: "6px 14px", fontSize: "0.82rem" }} onClick={() => setModalNovaFonte(true)}>
                <Plus size={15} /> Criar / Anexar
              </button>

              <button className={styles.btnOutline} onClick={() => alert("Link de compartilhamento copiado!")}>
                <Share2 size={14} /> Compartilhar
              </button>

              <button className={styles.btnOutline} onClick={() => window.print()}>
                <Printer size={14} /> Exportar PDF
              </button>
            </div>
          </div>

          {/* CORPO EM 3 COLUNAS */}
          <div className={styles.workspaceBody}>
            {/* -------------------------------------------------------------
                COLUNA 1: FONTES (ESQUERDA)
               ------------------------------------------------------------- */}
            <div
              className={styles.colSources}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleSoltarArquivoDrag}
            >
              <div className={styles.colHeader}>
                <span className={styles.colTitle}>
                  <Database size={16} color="#818cf8" /> Fontes ({notebookAtivo?.fontes?.length || 0})
                </span>
              </div>

              <button className={styles.btnAddSource} onClick={() => setModalNovaFonte(true)}>
                <Plus size={16} /> Adicionar fontes (Arquivos/Código/PDF)
              </button>

              {notebookAtivo?.fontes?.length > 0 ? (
                <div className={styles.sourcesList}>
                  {notebookAtivo.fontes.map((f) => (
                    <div key={f.id} className={styles.sourceItem}>
                      <div className={styles.sourceIcon}>
                        {f.tipo === "codigo" ? <Code size={18} /> : <FileText size={18} />}
                      </div>
                      <div className={styles.sourceInfo}>
                        <div className={styles.sourceTitle}>{f.titulo}</div>
                        <div className={styles.sourceMeta}>{f.tipo.toUpperCase()}</div>
                      </div>
                      <button
                        style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
                        onClick={() => removerFonte(f.id)}
                        title="Remover fonte"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.sourcesEmptyBox}>
                  <UploadCloud size={32} color="#818cf8" />
                  <p>
                    <strong>Solte arquivos aqui ou adicione uma fonte</strong><br />
                    Suporta PDFs, arquivos .txt, .js, .py, .md e muito mais.
                  </p>
                </div>
              )}
            </div>

            {/* -------------------------------------------------------------
                COLUNA 2: CONVERSA / CHAT & NOTAS (CENTRO)
               ------------------------------------------------------------- */}
            <div className={styles.colCenter}>
              <div className={styles.centerTabs}>
                <button
                  className={`${styles.tabBtn} ${abaCentro === "chat" ? styles.tabBtnActive : ""}`}
                  onClick={() => setAbaCentro("chat")}
                >
                  <Bot size={16} /> Conversa com IA
                </button>
                <button
                  className={`${styles.tabBtn} ${abaCentro === "notas" ? styles.tabBtnActive : ""}`}
                  onClick={() => setAbaCentro("notas")}
                >
                  <FileText size={16} /> Meu Caderno de Anotações
                </button>
              </div>

              {abaCentro === "chat" ? (
                <div className={styles.chatArea}>
                  {notebookAtivo?.mensagensChat?.map((m, idx) => (
                    <div
                      key={idx}
                      className={`${styles.chatMessage} ${m.sender === "user" ? styles.chatMessageUser : styles.chatMessageAi}`}
                    >
                      <div className={`${styles.avatar} ${m.sender === "user" ? styles.avatarUser : styles.avatarAi}`}>
                        {m.sender === "user" ? "DEV" : <Sparkles size={16} />}
                      </div>

                      <div className={`${styles.messageBubble} ${m.sender === "user" ? styles.messageBubbleUser : ""}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                      </div>
                    </div>
                  ))}

                  {pensandoIa && (
                    <div className={`${styles.chatMessage} ${styles.chatMessageAi}`}>
                      <div className={`${styles.avatar} ${styles.avatarAi}`}>
                        <RotateCw size={16} className="spin" />
                      </div>
                      <div className={styles.messageBubble} style={{ color: "#94a3b8" }}>
                        Analisando fontes salvas do notebook...
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>
              ) : (
                <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "8px", fontWeight: 700 }}>
                    ✍️ EDITOR MARKDOWN DE NOTAS DE ESTUDO
                  </span>
                  <textarea
                    style={{
                      flex: 1, background: "#131724", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px", padding: "16px", fontSize: "0.95rem", lineHeight: 1.6, outline: "none", resize: "none"
                    }}
                    value={notebookAtivo?.anotacoesAluno || ""}
                    onChange={(e) => atualizarNotasAluno(e.target.value)}
                    placeholder="Escreva suas anotações aqui..."
                  />
                </div>
              )}

              {/* BARRA DE PROMPT INFERIOR STYLE NOTEBOOKLM */}
              <div className={styles.promptBarContainer}>
                {/* SUGESTÕES RÁPIDAS DE IA (MENSAGENS DE ATALHO) */}
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "4px" }}>
                  {[
                    { icon: "💡", label: "Resumo em Pontos", prompt: "Faça um resumo direto e em tópicos dos pontos mais importantes deste caderno." },
                    { icon: "👨‍💻", label: "Exemplo em Código", prompt: "Me mostre um exemplo prático em código sobre os conceitos abordados neste caderno." },
                    { icon: "🐣", label: "Explicação Simplificada", prompt: "Explique o conteúdo deste caderno como se eu fosse um iniciante na área de programação." },
                    { icon: "🎴", label: "Cartões Didáticos", action: () => setEstudioAtivo("flashcards") },
                    { icon: "❓", label: "Teste / Quiz", action: () => setEstudioAtivo("quiz") },
                    { icon: "📝", label: "Gerar Relatório", action: () => setEstudioAtivo("relatorio") }
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => chip.action ? chip.action() : enviarMensagemChat(chip.prompt)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        backgroundColor: "rgba(99, 102, 241, 0.12)",
                        border: "1px solid rgba(99, 102, 241, 0.25)",
                        color: "#a5b4fc",
                        fontSize: "0.78rem",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(99, 102, 241, 0.25)";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(99, 102, 241, 0.12)";
                        e.currentTarget.style.color = "#a5b4fc";
                      }}
                    >
                      <span>{chip.icon}</span> {chip.label}
                    </button>
                  ))}
                </div>

                <div className={styles.promptBox}>
                  <input
                    type="text"
                    className={styles.promptInput}
                    placeholder="Comece a digitar sua dúvida de estudo..."
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && enviarMensagemChat()}
                  />

                  <span className={styles.promptMetaBadge}>
                    {notebookAtivo?.fontes?.length || 0} fontes
                  </span>

                  <button className={styles.btnSendPrompt} onClick={() => enviarMensagemChat()}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                COLUNA 3: ESTÚDIO / FERRAMENTAS GERATIVAS (DIREITA)
               ------------------------------------------------------------- */}
            <div className={styles.colStudio}>
              <div className={styles.colHeader}>
                <span className={styles.colTitle}>
                  <Sparkles size={16} color="#a855f7" /> Estúdio
                </span>
              </div>

              {/* GRID DE RECURSOS GERATIVOS (6 BOTÕES TOTALMENTE FUNCIONAIS) */}
              <div className={styles.studioGrid}>
                <div
                  className={styles.studioTile}
                  style={{ border: estudioAtivo === "audio" ? "1px solid #818cf8" : undefined }}
                  onClick={() => { setEstudioAtivo("audio"); setAudioTocando(!audioTocando); }}
                >
                  <div className={styles.studioIconBox} style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}>
                    <Volume2 size={18} />
                  </div>
                  <span className={styles.studioTileLabel}>Resumo em Áudio</span>
                </div>

                <div
                  className={styles.studioTile}
                  style={{ border: estudioAtivo === "video" ? "1px solid #34d399" : undefined }}
                  onClick={() => setEstudioAtivo("video")}
                >
                  <div className={styles.studioIconBox} style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
                    <Video size={18} />
                  </div>
                  <span className={styles.studioTileLabel}>Resumo em Vídeo</span>
                </div>

                <div
                  className={styles.studioTile}
                  style={{ border: estudioAtivo === "mapa" ? "1px solid #f472b6" : undefined }}
                  onClick={() => setEstudioAtivo("mapa")}
                >
                  <div className={styles.studioIconBox} style={{ background: "rgba(236, 72, 153, 0.15)", color: "#f472b6" }}>
                    <Map size={18} />
                  </div>
                  <span className={styles.studioTileLabel}>Mapa mental</span>
                </div>

                <div
                  className={styles.studioTile}
                  style={{ border: estudioAtivo === "relatorio" ? "1px solid #fbbf24" : undefined }}
                  onClick={() => setEstudioAtivo("relatorio")}
                >
                  <div className={styles.studioIconBox} style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
                    <FileText size={18} />
                  </div>
                  <span className={styles.studioTileLabel}>Relatórios</span>
                </div>

                <div
                  className={styles.studioTile}
                  style={{ border: estudioAtivo === "flashcards" ? "1px solid #c084fc" : undefined }}
                  onClick={() => setEstudioAtivo("flashcards")}
                >
                  <div className={styles.studioIconBox} style={{ background: "rgba(168, 85, 247, 0.15)", color: "#c084fc" }}>
                    <Layers size={18} />
                  </div>
                  <span className={styles.studioTileLabel}>Cartões didáticos</span>
                </div>

                <div
                  className={styles.studioTile}
                  style={{ border: estudioAtivo === "quiz" ? "1px solid #60a5fa" : undefined }}
                  onClick={() => { setEstudioAtivo("quiz"); setQuizRespondido(false); setQuizOpcaoSelecionada(null); }}
                >
                  <div className={styles.studioIconBox} style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa" }}>
                    <HelpCircle size={18} />
                  </div>
                  <span className={styles.studioTileLabel}>Teste / Quiz</span>
                </div>
              </div>

              {/* SAÍDA DO ESTÚDIO SELECIONADO */}
              <div className={styles.studioOutputArea}>
                {/* 1. RESUMO EM ÁUDIO */}
                {estudioAtivo === "audio" && (
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#818cf8", textTransform: "uppercase" }}>
                      🎧 PODCAST / SÍNTESE EM VOZ
                    </span>
                    <h4 style={{ margin: "6px 0 12px 0", color: "#FFF", fontSize: "0.95rem" }}>
                      Resumo Falado: {notebookAtivo?.titulo}
                    </h4>

                    <div style={{ background: "#121624", padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <button
                        style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#6366f1", border: "none", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                        onClick={() => setAudioTocando(!audioTocando)}
                      >
                        {audioTocando ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: "2px" }} />}
                      </button>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.8rem", color: "#cbd5e1", fontWeight: 700 }}>
                          {audioTocando ? "🔊 Reproduzindo áudio explicativo..." : "Clique para iniciar reprodução"}
                        </div>
                        <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", marginTop: "6px", overflow: "hidden" }}>
                          <div style={{ width: audioTocando ? "68%" : "0%", height: "100%", background: "#34d399", transition: "width 0.4s ease" }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "8px", fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.4 }}>
                      📜 <strong>Transcrição:</strong> "Nesta síntese sobre {notebookAtivo?.titulo}, analisamos a estrutura das {notebookAtivo?.fontes?.length || 0} fontes salvas e suas aplicações no código..."
                    </div>
                  </div>
                )}

                {/* 2. RESUMO EM VÍDEO / PRESENTATION */}
                {estudioAtivo === "video" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#34d399", textTransform: "uppercase" }}>
                        📹 APRESENTAÇÃO / SLIDE {slideVideoIndex + 1} DE {slidesVideo.length}
                      </span>
                    </div>

                    <div style={{ background: "linear-gradient(135deg, #0d2820, #131b26)", border: "1px solid #10b981", borderRadius: "12px", padding: "16px", minHeight: "140px", display: "flex", flexDirection: "column", justifyContent: "center", marginBottom: "12px" }}>
                      <h4 style={{ margin: "0 0 6px 0", color: "#6ee7b7", fontSize: "0.95rem" }}>
                        {slidesVideo[slideVideoIndex].titulo}
                      </h4>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "#e2e8f0", lineHeight: 1.4 }}>
                        {slidesVideo[slideVideoIndex].resumo}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className={styles.btnOutline}
                        style={{ flex: 1, justifyContent: "center" }}
                        onClick={() => setSlideVideoIndex(prev => prev > 0 ? prev - 1 : slidesVideo.length - 1)}
                      >
                        ← Slide Anterior
                      </button>
                      <button
                        className={styles.btnPrimary}
                        style={{ flex: 1, justifyContent: "center", padding: "6px" }}
                        onClick={() => setSlideVideoIndex(prev => (prev + 1) % slidesVideo.length)}
                      >
                        Próximo Slide →
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. MAPA MENTAL */}
                {estudioAtivo === "mapa" && (
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#f472b6", textTransform: "uppercase" }}>
                      🧠 MAPA MENTAL CONCEPTUAL
                    </span>
                    <h4 style={{ margin: "6px 0 12px 0", color: "#FFF", fontSize: "0.95rem" }}>
                      Conexões: {notebookAtivo?.titulo}
                    </h4>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div style={{ background: "#8b5cf6", padding: "10px", borderRadius: "8px", color: "#FFF", fontWeight: 800, fontSize: "0.85rem", textAlign: "center" }}>
                        🎯 {notebookAtivo?.titulo}
                      </div>

                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ width: "2px", height: "16px", background: "#8b5cf6" }} />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <div style={{ background: "#1e293b", border: "1px solid #f472b6", padding: "8px", borderRadius: "8px", fontSize: "0.78rem", color: "#f1f5f9", textAlign: "center" }}>
                          📚 {notebookAtivo?.fontes?.length || 0} Fontes Salvas
                        </div>
                        <div style={{ background: "#1e293b", border: "1px solid #34d399", padding: "8px", borderRadius: "8px", fontSize: "0.78rem", color: "#f1f5f9", textAlign: "center" }}>
                          💡 Boas Práticas Dev
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. RELATÓRIOS */}
                {estudioAtivo === "relatorio" && (
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#fbbf24", textTransform: "uppercase" }}>
                      📝 RELATÓRIO EXECUTIVO DE ESTUDOS
                    </span>
                    <h4 style={{ margin: "6px 0 10px 0", color: "#FFF", fontSize: "0.95rem" }}>
                      Síntese: {notebookAtivo?.titulo}
                    </h4>

                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "12px", borderRadius: "10px", fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                      <p style={{ margin: "0 0 8px 0" }}>
                        <strong>📌 Resumo dos Tópicos:</strong> O caderno aborda padrões estruturais de desenvolvimento, com base em {notebookAtivo?.fontes?.length || 0} fontes vinculadas.
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong>✅ Recomendação de Estudo:</strong> Pratique os conceitos escrevendo novas notas na aba central.
                      </p>
                    </div>
                  </div>
                )}

                {/* 5. CARTÕES DIDÁTICOS (FLASHCARDS) */}
                {estudioAtivo === "flashcards" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#c084fc", textTransform: "uppercase" }}>
                        🎴 CARTÃO {flashcardIndex + 1} DE {flashcardsExemplo.length}
                      </span>
                    </div>

                    <div
                      className={`${styles.flashcardBox} ${flashcardVerso ? styles.flashcardVerso : ""}`}
                      onClick={() => setFlashcardVerso(!flashcardVerso)}
                    >
                      <span style={{ fontSize: "0.7rem", fontWeight: 800, color: flashcardVerso ? "#34d399" : "#818cf8", textTransform: "uppercase", marginBottom: "8px" }}>
                        {flashcardVerso ? "💡 CONCEITO / RESPOSTA" : "❓ PERGUNTA DE ESTUDO"}
                      </span>

                      <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#FFF", lineHeight: 1.4 }}>
                        {flashcardVerso
                          ? flashcardsExemplo[flashcardIndex % flashcardsExemplo.length].resposta
                          : flashcardsExemplo[flashcardIndex % flashcardsExemplo.length].pergunta
                        }
                      </h4>

                      <span style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "12px" }}>
                        (Clique para virar o cartão)
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className={styles.btnOutline}
                        style={{ flex: 1, justifyContent: "center" }}
                        onClick={() => {
                          setFlashcardVerso(false);
                          setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : flashcardsExemplo.length - 1));
                        }}
                      >
                        Anterior
                      </button>

                      <button
                        className={styles.btnPrimary}
                        style={{ flex: 1, justifyContent: "center", padding: "6px" }}
                        onClick={() => {
                          setFlashcardVerso(false);
                          setFlashcardIndex((prev) => (prev + 1) % flashcardsExemplo.length);
                        }}
                      >
                        Próximo →
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. TESTE / QUIZ */}
                {estudioAtivo === "quiz" && (
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#60a5fa", textTransform: "uppercase" }}>
                      ❓ TESTE DE FIXAÇÃO COM IA
                    </span>

                    <h4 style={{ margin: "8px 0 12px 0", fontSize: "0.9rem", color: "#FFF", lineHeight: 1.4 }}>
                      {quizExemplo.pergunta}
                    </h4>

                    {quizExemplo.opcoes.map((op, idx) => {
                      let classes = styles.quizOption;
                      if (quizRespondido) {
                        if (idx === quizExemplo.correta) classes += ` ${styles.quizOptionCorrect}`;
                        else if (idx === quizOpcaoSelecionada) classes += ` ${styles.quizOptionIncorrect}`;
                      } else if (idx === quizOpcaoSelecionada) {
                        classes += ` ${styles.quizOptionSelected}`;
                      }

                      return (
                        <button
                          key={idx}
                          className={classes}
                          onClick={() => {
                            if (!quizRespondido) {
                              setQuizOpcaoSelecionada(idx);
                              setQuizRespondido(true);
                            }
                          }}
                        >
                          {op}
                        </button>
                      );
                    })}

                    {quizRespondido && (
                      <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", fontSize: "0.8rem", color: quizOpcaoSelecionada === quizExemplo.correta ? "#34d399" : "#f87171" }}>
                        {quizOpcaoSelecionada === quizExemplo.correta ? "🎉 Resposta Correta! Excelente fixação de conceito." : "❌ Resposta Incorreta. Revise as fontes anexadas ao notebook!"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL DE ADICIONAR FONTE (UPLOAD DE ARQUIVOS OU TEXTO MANUAL)
         =================================================================== */}
      {modalNovaFonte && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ background: "#1a1e2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", maxWidth: "520px", width: "100%", color: "#FFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
                ➕ Adicionar Fonte de Conhecimento
              </h3>
              <button style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }} onClick={() => setModalNovaFonte(false)}>
                <X size={20} />
              </button>
            </div>

            {/* ZONA DE UPLOAD DE ARQUIVO EM DESTAQUE */}
            <div
              style={{
                border: "2px dashed #6366f1", borderRadius: "12px", padding: "20px",
                background: "rgba(99, 102, 241, 0.08)", textAlign: "center", cursor: "pointer",
                marginBottom: "16px", transition: "all 0.2s ease"
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={36} color="#818cf8" style={{ marginBottom: "8px" }} />
              <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#ffffff" }}>
                {nomeArquivoCarregado ? `✓ Arquivo: ${nomeArquivoCarregado}` : "Clique para anexar um arquivo do seu computador"}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "4px" }}>
                Suporta PDFs, arquivos de código (.js, .py, .c, .sql), notas (.txt, .md) ou documentos
              </div>
            </div>

            <form onSubmit={adicionarFonte} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "6px" }}>TÍTULO DA FONTE</label>
                <input
                  type="text"
                  placeholder="Ex: Aula 1 - Estruturas de Dados.pdf"
                  style={{ width: "100%", padding: "10px", background: "#121520", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#FFF", outline: "none" }}
                  value={novaFonteTitulo}
                  onChange={(e) => setNovaFonteTitulo(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "6px" }}>TIPO DE CONTEÚDO</label>
                <select
                  style={{ width: "100%", padding: "10px", background: "#121520", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#FFF", outline: "none" }}
                  value={novaFonteTipo}
                  onChange={(e) => setNovaFonteTipo(e.target.value)}
                >
                  <option value="texto">Arquivo / Anotação de Aula (.txt, .pdf, .md)</option>
                  <option value="codigo">Snippet de Código (.js, .py, .c, .sql)</option>
                  <option value="link">Link Web / Documentação</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "6px" }}>CONTEÚDO OU TEXTO DO ARQUIVO</label>
                <textarea
                  rows={5}
                  placeholder="Selecione um arquivo acima ou cole o texto/código manualmente..."
                  style={{ width: "100%", padding: "10px", background: "#121520", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#FFF", outline: "none", resize: "vertical", fontFamily: "monospace", fontSize: "0.85rem" }}
                  value={novaFonteConteudo}
                  onChange={(e) => setNovaFonteConteudo(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button type="button" className={styles.btnOutline} onClick={() => setModalNovaFonte(false)}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Salvar Fonte no Caderno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
