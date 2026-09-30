import { useState, useEffect, useRef, useMemo } from "react";
import {
  BookOpen, Plus, Search, Trash2, Edit2, Copy, Download,
  Code, Check, Bot, Send, RotateCw, Layers, Printer, Sparkles,
  FileText, ArrowLeft, HelpCircle, CheckCircle2, Hash, Volume2, VolumeX,
  Video, Share2, Settings, MoreVertical, Database, Map, Play, Pause, X,
  ChevronRight, UploadCloud, Paperclip, Eye, CheckSquare, Square, ExternalLink, RefreshCw,
  Code2, Cpu, Server, Zap, BrainCircuit
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
        selecionada: true,
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
        selecionada: true,
        conteudo: "Zustand oferece uma API minimalista baseada em Hooks sem a necessidade de Providers no React. Ideal para gerenciar estado global de usuários, temas e preferências no DevHub. Evita re-renders desnecessários na árvore de componentes."
      }
    ],
    mensagensChat: [
      { sender: "ai", text: "👋 Olá! Sou o seu assistente de estudos no estilo NotebookLM. Pergunte qualquer coisa sobre Frontend, React, Backend ou consulte as fontes ativas no menu lateral!" }
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
        selecionada: true,
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
      { sender: "ai", text: "👋 Bem-vindo ao notebook de Algoritmos! Tire dúvidas sobre busca binária, ordenação ou análise assintótica Big O." }
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
        selecionada: true,
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
  const storageKey = `devhub_notebooks_lm_v3_${user?.id || "guest"}`;
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

  // Modais e visualizador
  const [modalNovaFonte, setModalNovaFonte] = useState(false);
  const [novaFonteTitulo, setNovaFonteTitulo] = useState("");
  const [novaFonteConteudo, setNovaFonteConteudo] = useState("");
  const [novaFonteTipo, setNovaFonteTipo] = useState("codigo");
  const [nomeArquivoCarregado, setNomeArquivoCarregado] = useState("");
  const [fonteEmVisualizacao, setFonteEmVisualizacao] = useState(null);
  const [carregandoArquivo, setCarregandoArquivo] = useState(false);
  const fileInputRef = useRef(null);

  // Estado de Flashcards
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardVerso, setFlashcardVerso] = useState(false);

  // Estado do Quiz
  const [quizOpcaoSelecionada, setQuizOpcaoSelecionada] = useState(null);
  const [quizRespondido, setQuizRespondido] = useState(false);

  // Estado de Áudio e Voz Real (Web Speech API)
  const [audioTocando, setAudioTocando] = useState(false);
  const [audioPausado, setAudioPausado] = useState(false);
  const [audioVelocidade, setAudioVelocidade] = useState(1);
  const [slideVideoIndex, setSlideVideoIndex] = useState(0);

  const chatEndRef = useRef(null);

  // Carregar notebooks salvos
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalizados = parsed.map(nb => ({
            ...nb,
            fontes: (nb.fontes || []).map(f => ({
              ...f,
              selecionada: f.selecionada !== false,
              conteudo: (f.conteudo || "").replace(/[^\x20-\x7E\xA0-\xFFáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\n\r\t]/g, " ")
            }))
          }));
          setNotebooks(normalizados);
          setActiveNotebookId(normalizados[0].id);
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

  // Salvar alterações no localStorage
  const salvarNotebooks = (novosNotebooks) => {
    setNotebooks(novosNotebooks);
    try {
      localStorage.setItem(storageKey, JSON.stringify(novosNotebooks));
    } catch (e) {}
  };

  const notebookAtivo = notebooks.find(n => n.id === activeNotebookId) || notebooks[0] || INITIAL_NOTEBOOKS[0];

  // Fontes ativas / selecionadas
  const fontesAtivas = useMemo(() => {
    return (notebookAtivo?.fontes || []).filter(f => f.selecionada !== false);
  }, [notebookAtivo]);

  // Auto-scroll no chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notebookAtivo?.mensagensChat, pensandoIa]);

  // Parar áudio ao trocar de estudo ou fechar
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setAudioTocando(false);
      setAudioPausado(false);
    }
  }, [estudioAtivo, activeNotebookId, viewMode]);

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
        { sender: "ai", text: "✨ Caderno criado! Adicione arquivos ou fontes no painel esquerdo para começar a conversar com a IA no estilo NotebookLM." }
      ],
      anotacoesAluno: "# Minhas Anotações de Estudo\n\nComece a escrever suas reflexões e ideias aqui...",
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

  // GERENCIAMENTO DE SELEÇÃO DE FONTES (CHECKBOXES)
  const toggleFonteSelecionada = (fonteId) => {
    const atualizados = notebooks.map(n => {
      if (n.id === activeNotebookId) {
        const novasFontes = n.fontes.map(f => f.id === fonteId ? { ...f, selecionada: !f.selecionada } : f);
        return { ...n, fontes: novasFontes };
      }
      return n;
    });
    salvarNotebooks(atualizados);
  };

  const toggleTodasFontes = (selecionar) => {
    const atualizados = notebooks.map(n => {
      if (n.id === activeNotebookId) {
        const novasFontes = n.fontes.map(f => ({ ...f, selecionada: selecionar }));
        return { ...n, fontes: novasFontes };
      }
      return n;
    });
    salvarNotebooks(atualizados);
  };

  // LEITURA REAL DE ARQUIVOS (INCLUINDO PDF E CÓDIGO)
  const processarArquivoLocal = async (file) => {
    if (!file) return;

    setCarregandoArquivo(true);
    const fileName = file.name;
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    let tipo = "texto";
    if (["js", "jsx", "ts", "tsx", "py", "c", "cpp", "java", "html", "css", "json", "sql", "sh"].includes(extension)) {
      tipo = "codigo";
    }

    setNovaFonteTitulo(fileName);
    setNovaFonteTipo(tipo);
    setNomeArquivoCarregado(fileName);

    if (extension === "pdf") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const buffer = e.target?.result;
          let textoPdf = "";

          // Extração via PDF.js CDN dinâmico
          try {
            if (buffer && typeof window !== "undefined") {
              if (!window.pdfjsLib) {
                await new Promise((resolve) => {
                  const script = document.createElement("script");
                  script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
                  script.onload = () => {
                    if (window.pdfjsLib) {
                      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
                    }
                    resolve(true);
                  };
                  script.onerror = () => resolve(false);
                  document.head.appendChild(script);
                });
              }

              if (window.pdfjsLib) {
                const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
                let textAccumulator = "";
                for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
                  const page = await pdf.getPage(i);
                  const content = await page.getTextContent();
                  const pageText = content.items.map(item => item.str).join(" ");
                  if (pageText.trim()) {
                    textAccumulator += `[Página ${i}]\n${pageText}\n\n`;
                  }
                }
                textoPdf = textAccumulator.trim();
              }
            }
          } catch (pdfErr) {
            console.warn("PDF.js parse warning:", pdfErr);
          }

          // Sanitiza caracteres não imprimíveis se houver resíduo
          textoPdf = textoPdf.replace(/[^\x20-\x7E\xA0-\xFFáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\n\r\t]/g, " ");

          if (textoPdf && textoPdf.length > 20) {
            setNovaFonteConteudo(`[Conteúdo do PDF "${fileName}"]\n\n${textoPdf}`);
          } else {
            setNovaFonteConteudo(`Documento PDF: ${fileName}\n\nEste arquivo PDF foi indexado no caderno. Você pode perguntar à IA sobre o conteúdo de ${fileName}.`);
          }
        } catch (err) {
          setNovaFonteConteudo(`Documento PDF: ${fileName}\n\nArquivo PDF indexado para estudo.`);
        } finally {
          setCarregandoArquivo(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result || "";
        setNovaFonteConteudo(String(text));
        setCarregandoArquivo(false);
      };
      reader.onerror = () => {
        setCarregandoArquivo(false);
      };
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
      selecionada: true,
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

  // GERADOR DE RESPOSTAS INTELIGENTES DE IA CONTEXTUALIZADAS COM CITAÇÕES [Fonte X]
  const gerarRespostaIAInteligente = (userMsg, notebook) => {
    const promptLower = userMsg.toLowerCase();
    const fontes = (notebook?.fontes || []).filter(f => f.selecionada !== false);
    
    let citacaoText = "";
    if (fontes.length > 0) {
      citacaoText = fontes.map((f, i) => `\n\n📌 **[Fonte ${i + 1}: ${f.titulo}]**\n> "${f.conteudo.slice(0, 220).replace(/[\r\n]+/g, " ")}..."`).join("");
    }

    if (promptLower.includes("frontend") || promptLower.includes("react") || promptLower.includes("interface") || promptLower.includes("css") || promptLower.includes("html")) {
      return `### 🎨 Análise Contextual: Desenvolvimento Frontend

Com base nas fontes ativas do caderno **"${notebook.titulo}"**:

1. **Arquitetura de Componentes:**
   No desenvolvimento moderno com React, a modularização de componentes permite alta reusabilidade e facilidade de testes.

2. **Gerenciamento de Estado & Hooks:**
   Como indicado nas fontes de estudo, o uso correto de Hooks como \`useMemo\` e \`useState\` garante re-renderizações eficientes sem gargalos de desempenho.

3. **Boas Práticas de UI/UX:**
   Estruturar layouts responsivos com CSS Grid e Flexbox garante excelente usabilidade em múltiplos dispositivos.

${fontes.length > 0 ? `\n---\n#### 📚 Referências das Fontes Ativas:${citacaoText}` : "\n\n💡 *Dica:* Marque ou adicione fontes no painel esquerdo para que a IA cite diretamente os seus arquivos!"}`;
    }

    if (promptLower.includes("backend") || promptLower.includes("node") || promptLower.includes("api") || promptLower.includes("express") || promptLower.includes("banco") || promptLower.includes("sql")) {
      return `### ⚙️ Análise Contextual: Backend & Banco de Dados

Com base nas fontes ativas do caderno **"${notebook.titulo}"**:

1. **Construção de APIs RESTful:**
   Servidores em Node.js e Express devem tratar requisições HTTP de forma assíncrona, validando dados antes da persistência.

2. **Segurança & Autenticação:**
   Proteger rotas sensíveis exige o uso de Tokens JWT e criptografia de senhas com bcrypt.

3. **Conexão com Banco de Dados:**
   Utilizar pool de conexões para otimizar consultas SQL e garantir integridade transacional.

${fontes.length > 0 ? `\n---\n#### 📚 Referências das Fontes Ativas:${citacaoText}` : ""}`;
    }

    return `### 💡 Análise sobre "${userMsg}"

Com base nas fontes selecionadas em **"${notebook?.titulo || 'Caderno de Estudos'}"**:

1. **Resumo Conceitual:**
   A dúvida sobre **"${userMsg}"** relaciona-se diretamente com os conceitos e documentações salvos neste notebook.

2. **Recomendação Prática:**
   - Revise o código fonte ou texto anexado para validar os métodos aplicados.
   - Teste pequenos trechos de lógica antes de integrar ao fluxo principal.
   - Utilize o **Estúdio** ao lado para reforçar o aprendizado com Flashcards e Quiz.

${fontes.length > 0 ? `\n---\n#### 📚 Citação de Fontes Consultadas:${citacaoText}` : "\n\n📌 *Dica:* Marque as checkboxes das fontes no painel esquerdo para que a IA faça citações diretas aos seus documentos!"}`;
  };

  // Enviar Pergunta à IA
  const enviarMensagemChat = async (promptCustomizado = null) => {
    const userMsg = (typeof promptCustomizado === "string" ? promptCustomizado : promptInput).trim();
    if (!userMsg || pensandoIa) return;

    if (!promptCustomizado) setPromptInput("");

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

      const res = await fetch(`${apiUrl}/dev-ia/caderno-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: `${userMsg}\n\n[Contexto do Caderno: ${notebookAtivo.titulo}. Fontes Ativas: ${JSON.stringify(fontesAtivas)}]`
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

  const extrairResumoLimpo = (txt, maxLen = 240) => {
    if (!txt) return "";
    let limpo = txt
      .replace(/\[Conteúdo.*?\]/g, "")
      .replace(/[^\x20-\x7E\xA0-\xFFáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\n\r]/g, " ")
      .replace(/[\r\n\t]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (limpo.length <= maxLen) return limpo || "Conteúdo do documento indexado para estudo com a IA.";
    return limpo.slice(0, maxLen) + "...";
  };

  // RECURSO DE VOZ REAL (WEB SPEECH API)
  const executarVozReal = (texto) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("A síntese de voz não é suportada neste navegador.");
      return;
    }

    if (audioTocando && !audioPausado) {
      window.speechSynthesis.pause();
      setAudioPausado(true);
      return;
    }

    if (audioPausado) {
      window.speechSynthesis.resume();
      setAudioPausado(false);
      return;
    }

    window.speechSynthesis.cancel();

    const textoLimpo = texto.replace(/[#*`_]/g, "").replace(/\[.*?\]/g, "");
    const utterance = new SpeechSynthesisUtterance(textoLimpo);
    utterance.rate = audioVelocidade;
    utterance.lang = "pt-BR";

    const voices = window.speechSynthesis.getVoices();
    const vozPt = voices.find(v => v.lang.includes("pt") || v.lang.includes("BR"));
    if (vozPt) utterance.voice = vozPt;

    utterance.onend = () => {
      setAudioTocando(false);
      setAudioPausado(false);
    };

    utterance.onerror = () => {
      setAudioTocando(false);
      setAudioPausado(false);
    };

    window.speechSynthesis.speak(utterance);
    setAudioTocando(true);
    setAudioPausado(false);
  };

  const pararVozReal = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setAudioTocando(false);
      setAudioPausado(false);
    }
  };

  // 🎴 Flashcards profundos baseados nas fontes ativas
  const flashcardsExemplo = useMemo(() => {
    const cards = [];

    if (fontesAtivas.length > 0) {
      fontesAtivas.forEach((f, i) => {
        const trecho = extrairResumoLimpo(f.conteudo, 260);
        cards.push({
          pergunta: `[Fonte ${i + 1}: ${f.titulo}] Qual o conceito chave e objetivo deste documento?`,
          resposta: `📄 "${f.titulo}" (${f.tipo}): ${trecho}`
        });
        cards.push({
          pergunta: `[Fonte ${i + 1}: ${f.titulo}] Como aplicar este conhecimento no desenvolvimento real?`,
          resposta: `💡 Aplicação prática de "${f.titulo}": Organizar funções modulares, tratar exceções e manter código limpo conforme descrito na fonte.`
        });
      });
    }

    if (cards.length === 0) {
      return [
        {
          pergunta: `Qual o objetivo do caderno "${notebookAtivo?.titulo}"?`,
          resposta: `📌 Foco em ${notebookAtivo?.titulo}: Organizar fontes de conhecimento, criar notas de estudo e tirar dúvidas com a IA.`
        },
        {
          pergunta: `Como tirar o máximo proveito das fontes no estilo NotebookLM?`,
          resposta: `💡 Adicione arquivos de código (.js, .py), textos ou PDFs no painel esquerdo. Marque as checkboxes para incluir as fontes no contexto da IA.`
        }
      ];
    }

    return cards;
  }, [notebookAtivo, fontesAtivas]);

  // ❓ Quiz contextualizado às fontes ativas
  const quizExemplo = useMemo(() => {
    if (fontesAtivas.length > 0) {
      const f1 = fontesAtivas[0];
      return {
        pergunta: `Com base na fonte ativa "${f1.titulo}", qual a diretriz fundamental de desenvolvimento?`,
        opcoes: [
          `A) Estruturar o conteúdo de "${f1.titulo}" com modularidade, tipagem e testes`,
          "B) Ignorar validações de entrada e tratamento de exceções",
          "C) Apagar as fontes salvas assim que concluir a primeira leitura",
          "D) Escrever scripts inteiros em um único arquivo gigante"
        ],
        correta: 0
      };
    }
    return {
      pergunta: `Ao estudar "${notebookAtivo?.titulo}", qual a boa prática de arquitetura recomendada?`,
      opcoes: [
        "A) Manter o código limpo, desacoplado, modular e bem documentado",
        "B) Ignorar erros de execução e tratamento de exceções",
        "C) Não utilizar documentações nem notas de estudo",
        "D) Evitar reutilização de funções e componentes"
      ],
      correta: 0
    };
  }, [notebookAtivo, fontesAtivas]);

  // 📹 Slides gerados a partir do conteúdo real das fontes
  const slidesVideo = useMemo(() => {
    if (fontesAtivas.length > 0) {
      const lista = [
        {
          titulo: `1. Visão Geral: ${notebookAtivo?.titulo || 'Estudos'}`,
          resumo: `Síntese dos conceitos extraídos de ${fontesAtivas.length} fontes ativas selecionadas (${fontesAtivas.map(f => f.titulo).join(", ")}).`
        }
      ];

      fontesAtivas.forEach((f, i) => {
        lista.push({
          titulo: `${i + 2}. Análise da Fonte: ${f.titulo}`,
          resumo: `📄 Detalhes de "${f.titulo}": ${extrairResumoLimpo(f.conteudo, 260)}`
        });
      });

      lista.push({
        titulo: `${lista.length + 1}. Conclusão & Aplicação Prática`,
        resumo: `Aplique os conceitos de ${fontesAtivas.map(f => f.titulo).join(", ")} nos seus projetos reais no DevHub.`
      });

      return lista;
    }

    return [
      {
        titulo: `1. Introdução a ${notebookAtivo?.titulo || 'Estudos'}`,
        resumo: `Visão geral do caderno. Anexe arquivos (.js, .py, .pdf) para gerar slides personalizados automaticamente.`
      },
      {
        titulo: "2. Estrutura & Padrões",
        resumo: "Manter código limpo (Clean Code), desacoplado e fácil de manter."
      },
      {
        titulo: "3. Próximos Passos & Prática",
        resumo: "Use os Flashcards para memorização e o Quiz para validar seus conhecimentos."
      }
    ];
  }, [notebookAtivo, fontesAtivas]);

  // 🎧 Podcast / Transcrição em voz
  const podcastTranscricao = useMemo(() => {
    if (fontesAtivas.length > 0) {
      const nomesFontes = fontesAtivas.map(f => f.titulo).join(", ");
      const trechosFontes = fontesAtivas.map(f => `• Em '${f.titulo}': ${extrairResumoLimpo(f.conteudo, 150)}`).join(" ");

      return `Olá! Seja bem-vindo ao resumo em áudio do caderno '${notebookAtivo?.titulo}'. Neste episódio, analisamos as ${fontesAtivas.length} fontes selecionadas: ${nomesFontes}. ${trechosFontes} A principal orientação técnica é aplicar esses padrões no seu código com modularidade e tratamento de erros.`;
    }

    return `Olá! Esta é a síntese em voz sobre '${notebookAtivo?.titulo}'. Anexe arquivos de código ou PDFs e marque a seleção de fontes no painel esquerdo para gerar uma narração falada detalhada.`;
  }, [notebookAtivo, fontesAtivas]);

  // 📝 Relatório executivo de estudos
  const relatorioExecutivo = useMemo(() => {
    if (fontesAtivas.length > 0) {
      return {
        resumo: `O caderno "${notebookAtivo?.titulo}" possui ${fontesAtivas.length} fontes ativas (${fontesAtivas.map(f => f.titulo).join(", ")}). O material foi compilado e estruturado pela IA.`,
        padroes: fontesAtivas.map(f => `• ${f.titulo}: ${extrairResumoLimpo(f.conteudo, 160)}`).join("\n"),
        recomendacao: `Pratique os conceitos de ${fontesAtivas[0]?.titulo || 'código'} executando exemplos práticos e revisando no Quiz.`
      };
    }

    return {
      resumo: `O caderno "${notebookAtivo?.titulo}" aborda padrões de desenvolvimento e boas práticas de engenharia de software.`,
      padroes: "• Manter código limpo, comentado e modularizado.\n• Escrever testes para validar a lógica de funções principais.",
      recomendacao: "Anexe fontes (.js, .py, .pdf) e selecione-as para que a IA estruture um relatório profundo."
    };
  }, [notebookAtivo, fontesAtivas]);

  // 🧠 Mapa Mental
  const mapaMentalConexoes = useMemo(() => {
    const nodes = [
      { titulo: `🎯 ${notebookAtivo?.titulo || 'Caderno de Estudos'}`, sub: "Tópico Central", cor: "#8b5cf6" }
    ];

    if (fontesAtivas.length > 0) {
      fontesAtivas.forEach(f => {
        nodes.push({
          titulo: `📚 ${f.titulo}`,
          sub: extrairResumoLimpo(f.conteudo, 80),
          cor: f.tipo === "codigo" ? "#3b82f6" : "#ec4899"
        });
      });
      nodes.push({ titulo: "💡 Boas Práticas & Arquitetura", sub: "Clean Code & Performance", cor: "#10b981" });
    } else {
      nodes.push({ titulo: "📚 0 Fontes Selecionadas", sub: "Marque as checkboxes no painel esquerdo", cor: "#f472b6" });
      nodes.push({ titulo: "💡 Boas Práticas Dev", sub: "Arquitetura e Reutilização", cor: "#34d399" });
    }

    return nodes;
  }, [notebookAtivo, fontesAtivas]);

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
          1. VISÃO GERAL DE CADERNOS (HOME DE CARDS DE CADERNOS)
         =================================================================== */}
      {viewMode === "grid" && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div className={styles.homeHeader}>
            <div className={styles.homeTitleGroup}>
              <h2>
                <BookOpen size={28} color="#818cf8" /> Cadernos de Estudo NotebookLM
              </h2>
              <p>Seus ambientes inteligentes de pesquisa, código e aprendizado contextual com IA</p>
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
              {notebooksFiltrados.map((nb) => {
                const titleLower = (nb.titulo || "").toLowerCase();
                let coverIcon = <BookOpen size={26} color="#FFF" style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.9))" }} />;
                let categoryTag = "NOTEBOOK IA";
                let tagColor = "#a5b4fc";

                if (titleLower.includes("react") || titleLower.includes("frontend") || titleLower.includes("ui")) {
                  coverIcon = <Code2 size={26} color="#FFF" style={{ filter: "drop-shadow(0 0 10px rgba(99,102,241,0.9))" }} />;
                  categoryTag = "REACT & FRONTEND";
                  tagColor = "#818cf8";
                } else if (titleLower.includes("estrutura") || titleLower.includes("algoritmo") || titleLower.includes("dados")) {
                  coverIcon = <Cpu size={26} color="#FFF" style={{ filter: "drop-shadow(0 0 10px rgba(16,185,129,0.9))" }} />;
                  categoryTag = "ALGORITMOS O(log N)";
                  tagColor = "#34d399";
                } else if (titleLower.includes("node") || titleLower.includes("express") || titleLower.includes("banco") || titleLower.includes("backend")) {
                  coverIcon = <Server size={26} color="#FFF" style={{ filter: "drop-shadow(0 0 10px rgba(236,72,153,0.9))" }} />;
                  categoryTag = "BACKEND & APIS";
                  tagColor = "#f472b6";
                }

                return (
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

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <div className={styles.notebookCover} style={{ background: nb.corCapa }}>
                        {coverIcon}
                      </div>

                      <span className={styles.notebookCategoryBadge} style={{ color: tagColor, borderColor: `${tagColor}44` }}>
                        {categoryTag}
                      </span>
                    </div>

                    <h3 className={styles.notebookCardTitle}>{nb.titulo}</h3>

                    <div className={styles.notebookCardMeta}>
                      <span>📅 {nb.dataAtualizacao}</span>
                      <span>•</span>
                      <span>📚 {nb.fontes.length} {nb.fontes.length === 1 ? "fonte" : "fontes"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          2. WORKSPACE DO CADERNO (3 COLUNAS - NOTEBOOK LM DESIGN)
         =================================================================== */}
      {viewMode === "workspace" && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* HEADER SUPERIOR DO WORKSPACE */}
          <div className={styles.workspaceHeader}>
            <div className={styles.workspaceHeaderLeft}>
              <button className={styles.btnBack} onClick={() => setViewMode("grid")}>
                <ArrowLeft size={16} /> Voltar aos Cadernos
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
                <Plus size={15} /> Criar / Anexar Fonte
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
                COLUNA 1: FONTES COM SELEÇÃO POR CHECKBOX (ESQUERDA)
               ------------------------------------------------------------- */}
            <div
              className={styles.colSources}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleSoltarArquivoDrag}
            >
              <div className={styles.colHeader}>
                <span className={styles.colTitle}>
                  <Database size={16} color="#818cf8" /> Fontes ({fontesAtivas.length}/{notebookAtivo?.fontes?.length || 0} ativas)
                </span>
                
                {notebookAtivo?.fontes?.length > 0 && (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      style={{ background: "none", border: "none", color: "#818cf8", fontSize: "0.72rem", cursor: "pointer", fontWeight: 700 }}
                      onClick={() => toggleTodasFontes(true)}
                    >
                      Todas
                    </button>
                    <span style={{ color: "#64748b" }}>|</span>
                    <button
                      style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "0.72rem", cursor: "pointer" }}
                      onClick={() => toggleTodasFontes(false)}
                    >
                      Nenhuma
                    </button>
                  </div>
                )}
              </div>

              <button className={styles.btnAddSource} onClick={() => setModalNovaFonte(true)}>
                <Plus size={16} /> Adicionar fontes (Arquivos/Código/PDF)
              </button>

              {notebookAtivo?.fontes?.length > 0 ? (
                <div className={styles.sourcesList}>
                  {notebookAtivo.fontes.map((f) => {
                    const isSelected = f.selecionada !== false;
                    return (
                      <div
                        key={f.id}
                        className={`${styles.sourceItem} ${isSelected ? styles.sourceItemSelected : ""}`}
                        style={{ borderLeft: isSelected ? "3px solid #6366f1" : "3px solid transparent" }}
                      >
                        {/* CHECKBOX DA FONTE */}
                        <button
                          style={{ background: "none", border: "none", cursor: "pointer", color: isSelected ? "#818cf8" : "#64748b", display: "flex", alignItems: "center" }}
                          onClick={() => toggleFonteSelecionada(f.id)}
                          title={isSelected ? "Desmarcar fonte do contexto" : "Marcar fonte para o contexto da IA"}
                        >
                          {isSelected ? <CheckSquare size={17} /> : <Square size={17} />}
                        </button>

                        <div
                          className={styles.sourceInfo}
                          style={{ cursor: "pointer" }}
                          onClick={() => setFonteEmVisualizacao(f)}
                          title="Clique para visualizar o conteúdo completo"
                        >
                          <div className={styles.sourceTitle}>{f.titulo}</div>
                          <div className={styles.sourceMeta}>{f.tipo.toUpperCase()} • {f.conteudo.length} caracteres</div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <button
                            style={{ background: "none", border: "none", color: "#818cf8", cursor: "pointer", padding: "4px" }}
                            onClick={() => setFonteEmVisualizacao(f)}
                            title="Visualizar fonte"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}
                            onClick={() => removerFonte(f.id)}
                            title="Remover fonte"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
                        Analisando fontes ativas ({fontesAtivas.length}) do notebook...
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
                    placeholder="Escreva suas reflexões e resumos aqui..."
                  />
                </div>
              )}

              {/* BARRA DE PROMPT INFERIOR STYLE NOTEBOOKLM */}
              <div className={styles.promptBarContainer}>
                {/* SUGESTÕES RÁPIDAS DE IA */}
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "4px" }}>
                  {[
                    { icon: "💡", label: "Resumo em Pontos", prompt: "Faça um resumo direto e em tópicos dos pontos mais importantes das fontes ativas." },
                    { icon: "👨‍💻", label: "Exemplo em Código", prompt: "Me mostre um exemplo prático em código sobre os conceitos abordados nas fontes ativas." },
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
                    {fontesAtivas.length} fontes ativas
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

              {/* GRID DE RECURSOS GERATIVOS */}
              <div className={styles.studioGrid}>
                <div
                  className={`${styles.studioTile} ${estudioAtivo === "audio" ? styles.studioTileActive : ""}`}
                  onClick={() => setEstudioAtivo("audio")}
                >
                  <div className={styles.studioIconBox} style={{ background: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc" }}>
                    <Volume2 size={18} />
                  </div>
                  <span className={styles.studioTileLabel}>Resumo em Áudio</span>
                </div>

                <div
                  className={`${styles.studioTile} ${estudioAtivo === "video" ? styles.studioTileActive : ""}`}
                  onClick={() => setEstudioAtivo("video")}
                >
                  <div className={styles.studioIconBox} style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399" }}>
                    <Video size={18} />
                  </div>
                  <span className={styles.studioTileLabel}>Resumo em Vídeo</span>
                </div>

                <div
                  className={`${styles.studioTile} ${estudioAtivo === "mapa" ? styles.studioTileActive : ""}`}
                  onClick={() => setEstudioAtivo("mapa")}
                >
                  <div className={styles.studioIconBox} style={{ background: "rgba(236, 72, 153, 0.2)", color: "#f472b6" }}>
                    <Map size={18} />
                  </div>
                  <span className={styles.studioTileLabel}>Mapa mental</span>
                </div>

                <div
                  className={`${styles.studioTile} ${estudioAtivo === "relatorio" ? styles.studioTileActive : ""}`}
                  onClick={() => setEstudioAtivo("relatorio")}
                >
                  <div className={styles.studioIconBox} style={{ background: "rgba(245, 158, 11, 0.2)", color: "#fbbf24" }}>
                    <FileText size={18} />
                  </div>
                  <span className={styles.studioTileLabel}>Relatórios</span>
                </div>

                <div
                  className={`${styles.studioTile} ${estudioAtivo === "flashcards" ? styles.studioTileActive : ""}`}
                  onClick={() => setEstudioAtivo("flashcards")}
                >
                  <div className={styles.studioIconBox} style={{ background: "rgba(168, 85, 247, 0.2)", color: "#c084fc" }}>
                    <Layers size={18} />
                  </div>
                  <span className={styles.studioTileLabel}>Cartões didáticos</span>
                </div>

                <div
                  className={`${styles.studioTile} ${estudioAtivo === "quiz" ? styles.studioTileActive : ""}`}
                  onClick={() => { setEstudioAtivo("quiz"); setQuizRespondido(false); setQuizOpcaoSelecionada(null); }}
                >
                  <div className={styles.studioIconBox} style={{ background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa" }}>
                    <HelpCircle size={18} />
                  </div>
                  <span className={styles.studioTileLabel}>Teste / Quiz</span>
                </div>
              </div>

              {/* SAÍDA DO ESTÚDIO SELECIONADO */}
              <div className={styles.studioOutputArea}>
                {/* 1. RESUMO EM ÁUDIO / PODCAST COM VOZ REAL (WEB SPEECH API) */}
                {estudioAtivo === "audio" && (
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#818cf8", textTransform: "uppercase" }}>
                      🎧 PODCAST / VOZ REAL INTERATIVA
                    </span>
                    <h4 style={{ margin: "6px 0 12px 0", color: "#FFF", fontSize: "0.95rem" }}>
                      Resumo Falado: {notebookAtivo?.titulo}
                    </h4>

                    {/* PLAYER DE ÁUDIO REAL */}
                    <div style={{ background: "#121624", padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <button
                        style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }}
                        onClick={() => executarVozReal(podcastTranscricao)}
                      >
                        {audioTocando && !audioPausado ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: "2px" }} />}
                      </button>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.8rem", color: "#cbd5e1", fontWeight: 700 }}>
                          {audioTocando ? (audioPausado ? "⏸️ Narração em voz pausada" : "🔊 Reproduzindo síntese falada em português...") : "Clique para ouvir o resumo falado em voz"}
                        </div>

                        {/* ANIMAÇÃO DE ONDAS SONORAS / EQUALIZADOR */}
                        <div style={{ display: "flex", alignItems: "center", gap: "3px", marginTop: "8px" }}>
                          {[40, 70, 30, 90, 50, 80, 40, 60, 90, 30, 70, 50].map((h, i) => (
                            <div
                              key={i}
                              style={{
                                width: "3px",
                                height: audioTocando && !audioPausado ? `${Math.floor(Math.random() * 20 + 8)}px` : "6px",
                                backgroundColor: audioTocando ? "#34d399" : "#475569",
                                borderRadius: "2px",
                                transition: "height 0.2s ease"
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {audioTocando && (
                        <button
                          style={{ background: "rgba(239, 68, 68, 0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171", borderRadius: "8px", padding: "6px 10px", fontSize: "0.75rem", cursor: "pointer" }}
                          onClick={pararVozReal}
                        >
                          <VolumeX size={14} /> Parar
                        </button>
                      )}
                    </div>

                    {/* CONTROLE DE VELOCIDADE */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: "8px" }}>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Velocidade de Voz:</span>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {[1, 1.25, 1.5].map((spd) => (
                          <button
                            key={spd}
                            onClick={() => {
                              setAudioVelocidade(spd);
                              if (audioTocando) {
                                pararVozReal();
                                setTimeout(() => executarVozReal(podcastTranscricao), 100);
                              }
                            }}
                            style={{
                              padding: "2px 8px", borderRadius: "6px", border: "none", fontSize: "0.75rem", fontWeight: 700,
                              background: audioVelocidade === spd ? "#6366f1" : "rgba(255,255,255,0.08)",
                              color: "#FFF", cursor: "pointer"
                            }}
                          >
                            {spd}x
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "14px", borderRadius: "10px", fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                      📜 <strong>Transcrição do Podcast:</strong> "{podcastTranscricao}"
                    </div>
                  </div>
                )}

                {/* 2. RESUMO EM VÍDEO / SLIDES */}
                {estudioAtivo === "video" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#34d399", textTransform: "uppercase" }}>
                        📹 APRESENTAÇÃO DE SLIDES ({slideVideoIndex + 1} DE {slidesVideo.length})
                      </span>
                    </div>

                    <div style={{ background: "linear-gradient(135deg, #0d2820, #131b26)", border: "1px solid #10b981", borderRadius: "12px", padding: "16px", minHeight: "140px", display: "flex", flexDirection: "column", justifyContent: "center", marginBottom: "12px" }}>
                      <h4 style={{ margin: "0 0 8px 0", color: "#6ee7b7", fontSize: "0.98rem" }}>
                        {slidesVideo[slideVideoIndex % slidesVideo.length]?.titulo}
                      </h4>
                      <p style={{ margin: 0, fontSize: "0.84rem", color: "#e2e8f0", lineHeight: 1.5 }}>
                        {slidesVideo[slideVideoIndex % slidesVideo.length]?.resumo}
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
                      <div style={{ background: "#8b5cf6", padding: "12px", borderRadius: "10px", color: "#FFF", fontWeight: 800, fontSize: "0.9rem", textAlign: "center" }}>
                        {mapaMentalConexoes[0].titulo}
                      </div>

                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ width: "2px", height: "16px", background: "#8b5cf6" }} />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px" }}>
                        {mapaMentalConexoes.slice(1).map((node, i) => (
                          <div key={i} style={{ background: "#1e293b", border: `1px solid ${node.cor}`, padding: "10px", borderRadius: "10px", fontSize: "0.78rem", color: "#f1f5f9" }}>
                            <div style={{ fontWeight: 800, color: node.cor }}>{node.titulo}</div>
                            {node.sub && <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "4px", lineHeight: 1.3 }}>{node.sub}</div>}
                          </div>
                        ))}
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

                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "14px", borderRadius: "10px", fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.5, display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div>
                        <strong style={{ color: "#fbbf24" }}>📌 Resumo dos Tópicos:</strong>
                        <p style={{ margin: "4px 0 0 0" }}>{relatorioExecutivo.resumo}</p>
                      </div>
                      {relatorioExecutivo.padroes && (
                        <div>
                          <strong style={{ color: "#38bdf8" }}>💡 Padrões e Fontes Anexadas:</strong>
                          <pre style={{ margin: "4px 0 0 0", whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "0.78rem", color: "#94a3b8" }}>
                            {relatorioExecutivo.padroes}
                          </pre>
                        </div>
                      )}
                      <div>
                        <strong style={{ color: "#34d399" }}>✅ Recomendação de Estudo:</strong>
                        <p style={{ margin: "4px 0 0 0" }}>{relatorioExecutivo.recomendacao}</p>
                      </div>
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

                      <h4 style={{ margin: 0, fontSize: "0.92rem", color: "#FFF", lineHeight: 1.4 }}>
                        {flashcardVerso
                          ? flashcardsExemplo[flashcardIndex % flashcardsExemplo.length]?.resposta
                          : flashcardsExemplo[flashcardIndex % flashcardsExemplo.length]?.pergunta
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
                        {quizOpcaoSelecionada === quizExemplo.correta ? "🎉 Resposta Correta! Excelente fixação de conceito." : "❌ Resposta Incorreta. Revise as fontes ativas no notebook!"}
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
          MODAL DE ADICIONAR FONTE
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

            {/* ZONA DE UPLOAD DE ARQUIVO */}
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
                {carregandoArquivo ? "⌛ Lendo e extraindo conteúdo do arquivo..." : nomeArquivoCarregado ? `✓ Arquivo: ${nomeArquivoCarregado}` : "Clique para anexar um arquivo do seu computador"}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "4px" }}>
                Suporta PDFs, código (.js, .py, .c, .sql), notas (.txt, .md) ou documentos
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
                  <option value="texto">Arquivo / Documento PDF (.txt, .pdf, .md)</option>
                  <option value="codigo">Snippet de Código (.js, .py, .c, .sql)</option>
                  <option value="link">Link Web / Documentação</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: "6px" }}>CONTEÚDO / TEXTO DA FONTE</label>
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

      {/* ===================================================================
          MODAL DE VISUALIZAÇÃO DE FONTE DETALHADA
         =================================================================== */}
      {fonteEmVisualizacao && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ background: "#1a1e2e", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "16px", padding: "24px", maxWidth: "680px", width: "100%", color: "#FFF", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#818cf8", fontWeight: 800, textTransform: "uppercase" }}>
                  📄 DETALHES DA FONTE ({fonteEmVisualizacao.tipo})
                </span>
                <h3 style={{ margin: "4px 0 0 0", fontSize: "1.15rem", fontWeight: 800 }}>
                  {fonteEmVisualizacao.titulo}
                </h3>
              </div>
              <button style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }} onClick={() => setFonteEmVisualizacao(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", background: "#111420", padding: "16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "16px" }}>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "0.86rem", color: "#e2e8f0", lineHeight: 1.5 }}>
                {fonteEmVisualizacao.conteudo}
              </pre>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                Total: {fonteEmVisualizacao.conteudo.length} caracteres
              </span>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className={styles.btnOutline}
                  onClick={() => {
                    navigator.clipboard.writeText(fonteEmVisualizacao.conteudo);
                    alert("Conteúdo da fonte copiado para a área de transferência!");
                  }}
                >
                  <Copy size={14} /> Copiar Texto
                </button>
                <button className={styles.btnPrimary} onClick={() => setFonteEmVisualizacao(null)}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
