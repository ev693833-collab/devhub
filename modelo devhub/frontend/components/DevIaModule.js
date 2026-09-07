import { useState, useEffect, useRef } from "react";
import {
  Bot, Send, Plus, Trash2, MessageSquare, Sparkles,
  Target, ChevronLeft, ChevronRight, History, X,
  Palette, Headphones, Map, Check, Copy, Play, Pause, Volume2,
  Briefcase, Award, CheckCircle, AlertTriangle, Lightbulb
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./DevIaModule.module.css";

const JORNADA_PADRAO = {
  titulo: "Minha Jornada — Desenvolvimento Web",
  objetivo: "Caminho clássico: HTML, CSS e JavaScript, depois React ou Node.js.",
  linhas: [
    { tipo: "passo", id: "html", label: "HTML", dica: "Estrutura das páginas" },
    { tipo: "passo", id: "css", label: "CSS", dica: "Estilo e layout" },
    { tipo: "passo", id: "javascript", label: "JavaScript", dica: "Lógica e interatividade" },
    {
      tipo: "bifurcacao",
      esquerda: { id: "react", label: "React", dica: "Interface no navegador" },
      direita: { id: "nodejs", label: "Node.js", dica: "Backend com JavaScript" }
    }
  ]
};

function idsDaJornada(jornada) {
  const ids = [];
  (jornada?.linhas || []).forEach((linha) => {
    if (linha.tipo === "bifurcacao") {
      if (linha.esquerda?.id) ids.push(linha.esquerda.id);
      if (linha.direita?.id) ids.push(linha.direita.id);
    } else if (linha.id) {
      ids.push(linha.id);
    }
  });
  return ids;
}

function falarTexto(texto, onEnd) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    onEnd?.();
    return null;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(texto);
  utter.lang = "pt-BR";
  utter.rate = 1;
  utter.onend = () => onEnd?.();
  utter.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utter);
  return utter;
}

function extrairDadosFerramenta(content) {
  if (!content) return null;
  const match = content.match(/<!--FERRAMENTA_DADOS:([\s\S]*?):FERRAMENTA_DADOS-->/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function InlineSlideWidget({ dados, onFullscreen }) {
  const [index, setIndex] = useState(0);
  const slidesList = dados.slides || [];
  const currentSlide = slidesList[index] || slidesList[0];

  if (!slidesList.length) return null;

  return (
    <div style={{
      marginTop: "12px",
      padding: "16px",
      borderRadius: "16px",
      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))",
      border: "1px solid rgba(99, 102, 241, 0.3)",
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: "900", color: "#c084fc" }}>
          🎨 {dados.titulo || "Slides Educativos"}
        </div>
        <div style={{ fontSize: "0.76rem", fontWeight: "800", color: "#cbd5e1", background: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: "8px" }}>
          Slide {index + 1} / {slidesList.length}
        </div>
      </div>

      <div style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "#FFF", marginBottom: "8px" }}>
          {currentSlide?.titulo}
        </div>
        <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.84rem", color: "#cbd5e1", lineHeight: "1.5" }}>
          {(currentSlide?.bullets || []).map((b, i) => (
            <li key={i} style={{ marginBottom: "4px" }}>{b}</li>
          ))}
        </ul>
        {currentSlide?.explicacao && (
          <div style={{ marginTop: "8px", fontSize: "0.78rem", color: "#94a3b8", fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "6px" }}>
            💡 {currentSlide.explicacao}
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setIndex(i => i - 1)}
            style={{
              padding: "6px 12px", borderRadius: "8px", border: "none",
              backgroundColor: index === 0 ? "rgba(255,255,255,0.05)" : "#6366f1",
              color: index === 0 ? "#64748b" : "#FFF", fontSize: "0.78rem", fontWeight: "700",
              cursor: index === 0 ? "default" : "pointer"
            }}
          >
            ◄ Anterior
          </button>
          <button
            type="button"
            disabled={index >= slidesList.length - 1}
            onClick={() => setIndex(i => i + 1)}
            style={{
              padding: "6px 12px", borderRadius: "8px", border: "none",
              backgroundColor: index >= slidesList.length - 1 ? "rgba(255,255,255,0.05)" : "#6366f1",
              color: index >= slidesList.length - 1 ? "#64748b" : "#FFF", fontSize: "0.78rem", fontWeight: "700",
              cursor: index >= slidesList.length - 1 ? "default" : "pointer"
            }}
          >
            Próximo ►
          </button>
        </div>

        <button
          type="button"
          onClick={() => onFullscreen(dados)}
          style={{
            padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(168, 85, 247, 0.4)",
            backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#c084fc",
            fontSize: "0.78rem", fontWeight: "700", cursor: "pointer"
          }}
        >
          🖥️ Abrir em Tela Cheia
        </button>
      </div>
    </div>
  );
}

function InlineAudioWidget({ dados, tocarAudio }) {
  return (
    <div style={{
      marginTop: "12px",
      padding: "14px 16px",
      borderRadius: "16px",
      background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15))",
      border: "1px solid rgba(16, 185, 129, 0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "12px",
          backgroundColor: "#10b981", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#FFF", boxShadow: "0 4px 12px rgba(16,185,129,0.3)"
        }}>
          <Headphones size={22} />
        </div>
        <div>
          <div style={{ fontSize: "0.88rem", fontWeight: "800", color: "#FFF" }}>
            🎧 {dados.titulo || "Explicação em Áudio"}
          </div>
          <div style={{ fontSize: "0.76rem", color: "#a7f3d0" }}>
            Ouvir áudio explicativo em voz alta
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => tocarAudio(dados.roteiro || "")}
        style={{
          padding: "8px 16px", borderRadius: "10px", border: "none",
          backgroundColor: "#10b981", color: "#FFF", fontSize: "0.8rem", fontWeight: "800",
          cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
          boxShadow: "0 4px 12px rgba(16,185,129,0.4)"
        }}
      >
        <Volume2 size={16} /> Ouvir Áudio
      </button>
    </div>
  );
}

function InlinePlanoWidget({ dados }) {
  const semanas = dados.semanas || [];
  return (
    <div style={{
      marginTop: "12px",
      padding: "16px",
      borderRadius: "16px",
      background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(236, 72, 153, 0.15))",
      border: "1px solid rgba(245, 158, 11, 0.3)",
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    }}>
      <div style={{ fontSize: "0.9rem", fontWeight: "900", color: "#f59e0b" }}>
        🎯 {dados.titulo || "Plano de Estudos Personalizado"}
      </div>
      {dados.duracao && (
        <div style={{ fontSize: "0.78rem", color: "#fcd34d", fontWeight: "700" }}>
          ⏱️ Duração estimada: {dados.duracao}
        </div>
      )}
      {dados.objetivo && (
        <div style={{ fontSize: "0.82rem", color: "#cbd5e1" }}>
          📌 {dados.objetivo}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
        {semanas.map((s, idx) => (
          <div key={idx} style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "10px 12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: "800", color: "#fbbf24", marginBottom: "4px" }}>
              Semana {s.semana || idx + 1}: {s.foco}
            </div>
            {(s.dias || []).map((d, dIdx) => (
              <div key={dIdx} style={{ fontSize: "0.78rem", color: "#cbd5e1", marginLeft: "8px", marginTop: "2px" }}>
                • Dia {d.dia}: <strong>{d.tema}</strong> — {d.tarefa}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function InlineRoadmapWidget({ dados, onAbrirJornada }) {
  return (
    <div style={{
      marginTop: "12px",
      padding: "16px",
      borderRadius: "16px",
      background: "linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.15))",
      border: "1px solid rgba(6, 182, 212, 0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px"
    }}>
      <div>
        <div style={{ fontSize: "0.9rem", fontWeight: "900", color: "#06b6d4" }}>
          🗺️ {dados.titulo || "Roadmap de Aprendizado"}
        </div>
        <div style={{ fontSize: "0.78rem", color: "#a5f3fc", marginTop: "2px" }}>
          {dados.objetivo || "Trilha visual com etapas e bifurcação de estudo"}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onAbrirJornada()}
        style={{
          padding: "8px 14px", borderRadius: "10px", border: "none",
          backgroundColor: "#06b6d4", color: "#FFF", fontSize: "0.8rem", fontWeight: "800",
          cursor: "pointer", whiteSpace: "nowrap"
        }}
      >
        🗺️ Ver Mapa Visual
      </button>
    </div>
  );
}

export default function DevIaModule({ user }) {
  const [collapsed, setCollapsed] = useState(false);
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const [modalMinhasMensagensOpen, setModalMinhasMensagensOpen] = useState(false);
  const [painelJornada, setPainelJornada] = useState(false);
  const [ferramenta, setFerramenta] = useState(null);
  const [temaFerramenta, setTemaFerramenta] = useState("");
  const [gerandoFerramenta, setGerandoFerramenta] = useState(false);

  const [slides, setSlides] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [audioAtivo, setAudioAtivo] = useState(null);
  const [audioTocando, setAudioTocando] = useState(false);
  const [plano, setPlano] = useState(null);

  // Estados do Simulador de Entrevista Técnica
  const [entrevistaAtiva, setEntrevistaAtiva] = useState(false);
  const [entrevistaCargo, setEntrevistaCargo] = useState("Frontend React");
  const [entrevistaNivel, setEntrevistaNivel] = useState("Júnior");
  const [entrevistaDados, setEntrevistaDados] = useState(null);
  const [entrevistaResposta, setEntrevistaResposta] = useState("");
  const [entrevistaHistorico, setEntrevistaHistorico] = useState([]);
  const [processandoEntrevista, setProcessandoEntrevista] = useState(false);
  const [entrevistaRelatorio, setEntrevistaRelatorio] = useState(null);

  const storageKey = `devhub_jornada_${user?.id || "anon"}`;
  const [jornada, setJornada] = useState(JORNADA_PADRAO);
  const [concluidos, setConcluidos] = useState([]);

  const messagesEndRef = useRef(null);
  const topToolsRef = useRef(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const rolarFerramentas = (direcao) => {
    if (topToolsRef.current) {
      topToolsRef.current.scrollBy({
        left: direcao === "esquerda" ? -180 : 180,
        behavior: "smooth"
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.jornada) setJornada(saved.jornada);
      if (Array.isArray(saved.concluidos)) setConcluidos(saved.concluidos);
    } catch (e) {}
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ jornada, concluidos }));
    } catch (e) {}
  }, [jornada, concluidos, storageKey]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  const carregarThreads = async () => {
    try {
      setLoadingThreads(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/dev-ia/threads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setThreads(data);
        if (data.length > 0 && !activeThreadId) {
          setActiveThreadId(data[0].id);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar conversas:", err);
    } finally {
      setLoadingThreads(false);
    }
  };

  const carregarMensagens = async (threadId) => {
    if (!threadId) return;
    try {
      setLoadingMessages(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/dev-ia/threads/${threadId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Erro ao carregar mensagens:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    carregarThreads();
  }, []);

  useEffect(() => {
    if (activeThreadId) {
      carregarMensagens(activeThreadId);
    } else {
      setMessages([]);
    }
  }, [activeThreadId]);

  const handleCriarNovaConversa = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/dev-ia/threads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ titulo: "Nova Sessão de Estudos" })
      });
      if (res.ok) {
        const newThread = await res.json();
        setThreads(prev => [newThread, ...prev]);
        setActiveThreadId(newThread.id);
      }
    } catch (err) {
      console.error("Erro ao criar nova conversa:", err);
    }
  };

  const handleExcluirConversa = async (e, id) => {
    e.stopPropagation();
    if (!confirm("Tem certeza que deseja excluir esta conversa?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/dev-ia/threads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const restante = threads.filter(t => t.id !== id);
        setThreads(restante);
        if (activeThreadId === id) {
          setActiveThreadId(restante.length > 0 ? restante[0].id : null);
          if (restante.length === 0) setMessages([]);
        }
      }
    } catch (err) {
      console.error("Erro ao excluir conversa:", err);
    }
  };

  const handleEnviarMensagem = async (promptTexto) => {
    const textoFinal = promptTexto || inputMessage;
    if (!textoFinal || textoFinal.trim() === "" || sending) return;

    const userMsgObj = {
      id: Date.now(),
      sender: "user",
      content: textoFinal,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsgObj]);
    if (!promptTexto) setInputMessage("");
    setSending(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/dev-ia/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          thread_id: activeThreadId,
          message: textoFinal
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (!activeThreadId) {
          setActiveThreadId(data.thread_id);
          carregarThreads();
        }
        setMessages(prev => [...prev, data.ia_message]);
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "ia",
            content: errData.error || "Desculpe, ocorreu um erro ao se comunicar com a Dev IA."
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ia",
          content: "Erro de conexão com o servidor da Dev IA."
        }
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleIniciarEntrevista = async () => {
    try {
      setProcessandoEntrevista(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/dev-ia/entrevista`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          acao: "iniciar",
          cargo: entrevistaCargo,
          nivel: entrevistaNivel
        })
      });

      if (res.ok) {
        const data = await res.json();
        setEntrevistaDados(data);
        setEntrevistaHistorico([]);
        setEntrevistaResposta("");
        setEntrevistaRelatorio(null);
        setEntrevistaAtiva(true);
        setFerramenta(null);
      }
    } catch (err) {
      console.error("Erro ao iniciar entrevista:", err);
    } finally {
      setProcessandoEntrevista(false);
    }
  };

  const handleEnviarRespostaEntrevista = async () => {
    if (!entrevistaResposta.trim() || processandoEntrevista || !entrevistaDados) return;
    try {
      setProcessandoEntrevista(true);
      const token = localStorage.getItem("token");
      const novoHistorico = [
        ...entrevistaHistorico,
        { pergunta: entrevistaDados.perguntaAtual, resposta: entrevistaResposta }
      ];

      const res = await fetch(`${apiUrl}/dev-ia/entrevista`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          acao: "avaliar",
          cargo: entrevistaCargo,
          nivel: entrevistaNivel,
          perguntaIndex: entrevistaDados.perguntaIndex,
          respostaUsuario: entrevistaResposta,
          historico: novoHistorico
        })
      });

      if (res.ok) {
        const data = await res.json();
        setEntrevistaHistorico(novoHistorico);
        setEntrevistaResposta("");

        if (data.concluido) {
          setEntrevistaRelatorio(data);
          setEntrevistaDados(null);
        } else {
          setEntrevistaDados({
            perguntaAtual: data.perguntaAtual,
            perguntaIndex: data.perguntaIndex,
            totalPerguntas: 3
          });
        }
      }
    } catch (err) {
      console.error("Erro ao enviar resposta da entrevista:", err);
    } finally {
      setProcessandoEntrevista(false);
    }
  };

  const abrirFerramenta = (tipo) => {
    const exemplos = {
      slides: "Flexbox no CSS",
      audio: "O que é JavaScript",
      plano: "Quero aprender React em 30 dias",
      roadmap: "Desenvolvimento web do zero",
      entrevista: "Frontend React"
    };
    setFerramenta(tipo);
    setTemaFerramenta((inputMessage && inputMessage.trim()) || exemplos[tipo] || "");
  };

  const aplicarResultadoFerramenta = (tipo, dados) => {
    if (tipo === "slides") {
      setSlides(dados);
      setSlideIndex(0);
    }
    if (tipo === "audio") {
      setAudioAtivo(dados);
      setAudioTocando(false);
    }
    if (tipo === "plano") {
      setPlano(dados);
    }
    if (tipo === "roadmap" && dados?.linhas) {
      setJornada(dados);
      setConcluidos([]);
      setPainelJornada(true);
    }
  };

  const executarFerramenta = async () => {
    const tema = temaFerramenta.trim();
    const tipoAtual = ferramenta;
    if (!tema || !tipoAtual || gerandoFerramenta) return;

    setGerandoFerramenta(true);
    setSending(true);
    setFerramenta(null); // Fecha o modal imediatamente e retorna ao chat
    setTemaFerramenta("");

    const rotulos = {
      slides: "🎨 Criar slides educativos",
      audio: "🎧 Explicação em áudio",
      plano: "🎯 Plano de estudos",
      roadmap: "🗺️ Roadmap de aprendizado"
    };

    const userMsgObj = {
      id: Date.now(),
      sender: "user",
      content: `${rotulos[tipoAtual] || "Gerar material"}: ${tema}`,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsgObj]);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/dev-ia/ferramenta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          thread_id: activeThreadId,
          tipo: tipoAtual,
          tema
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (!activeThreadId) {
          setActiveThreadId(data.thread_id);
          carregarThreads();
        }
        if (data.ia_message) setMessages(prev => [...prev, data.ia_message]);
        aplicarResultadoFerramenta(tipoAtual, data.dados);
        setInputMessage("");
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "ia",
            content: errData.error || "Não consegui gerar esse material agora."
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ia",
          content: "Erro de conexão ao gerar o material de estudo."
        }
      ]);
    } finally {
      setGerandoFerramenta(false);
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  const toggleConcluido = (id) => {
    setConcluidos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const copiarJornada = async () => {
    const texto = [
      jornada.titulo,
      jornada.objetivo,
      ...idsDaJornada(jornada).map((id) => {
        const feito = concluidos.includes(id) ? "[x]" : "[ ]";
        return `${feito} ${id}`;
      })
    ].join("\n");
    try {
      await navigator.clipboard.writeText(texto);
    } catch (e) {}
  };

  const tocarAudio = (texto) => {
    if (audioTocando) {
      window.speechSynthesis?.cancel();
      setAudioTocando(false);
      return;
    }
    setAudioTocando(true);
    falarTexto(texto, () => setAudioTocando(false));
  };

  const minhasMensagens = messages.filter(m => m.sender === "user");
  const totalEtapas = idsDaJornada(jornada).length;
  const feitos = concluidos.filter((id) => idsDaJornada(jornada).includes(id)).length;
  const slideAtual = slides?.slides?.[slideIndex];

  const ferramentas = [
    {
      id: "slides",
      icon: Palette,
      titulo: "Criar slides",
      desc: "Gera uma apresentação sobre o assunto."
    },
    {
      id: "audio",
      icon: Headphones,
      titulo: "Explicar por áudio",
      desc: "O aluno pode ouvir a explicação."
    },
    {
      id: "plano",
      icon: Target,
      titulo: "Plano de estudos",
      desc: "Ex.: “Quero aprender React em 30 dias.”"
    },
    {
      id: "roadmap",
      icon: Map,
      titulo: "Roadmap de aprendizado",
      desc: "Trilha visual da sua jornada de estudos."
    },
    {
      id: "entrevista",
      icon: Briefcase,
      titulo: "Simulador de Entrevista",
      desc: "Simule uma entrevista técnica com um Tech Lead IA!"
    }
  ];

  const NoCheck = ({ id, label, dica }) => {
    const feito = concluidos.includes(id);
    return (
      <button
        type="button"
        className={`${styles.roadmapNode} ${feito ? styles.roadmapNodeDone : ""}`}
        onClick={() => toggleConcluido(id)}
        title={dica || "Marcar como concluído"}
      >
        <span className={styles.roadmapLabel}>{label}</span>
        <span className={`${styles.roadmapCheck} ${feito ? styles.roadmapCheckOn : ""}`}>
          {feito ? <Check size={14} strokeWidth={3} /> : null}
        </span>
      </button>
    );
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", marginBottom: "12px", width: "100%" }}>
          {!collapsed && <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>Conversas</h3>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={styles.toggleBtn}
            title={collapsed ? "Expandir histórico" : "Recolher histórico"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <button className={styles.newChatBtn} onClick={handleCriarNovaConversa}>
          <Plus size={18} />
          {!collapsed && <span>Nova Conversa</span>}
        </button>

        <button
          className={`${styles.jornadaSidebarBtn} ${painelJornada ? styles.jornadaSidebarBtnOn : ""}`}
          onClick={() => setPainelJornada((v) => !v)}
          title="Minha Jornada"
        >
          <Map size={18} />
          {!collapsed && <span>Minha Jornada</span>}
        </button>

        <div className={styles.threadList}>
          {loadingThreads ? (
            <div className={styles.loadingText}>Carregando...</div>
          ) : threads.length === 0 ? (
            <div className={styles.emptyThreads}>{!collapsed && "Nenhuma conversa iniciada"}</div>
          ) : (
            threads.map(thread => (
              <div
                key={thread.id}
                className={`${styles.threadItem} ${activeThreadId === thread.id ? styles.activeThread : ""}`}
                onClick={() => { setActiveThreadId(thread.id); setPainelJornada(false); }}
                title={thread.titulo}
              >
                <MessageSquare size={16} className={styles.threadIcon} />
                {!collapsed && (
                  <>
                    <span className={styles.threadTitle}>{thread.titulo}</span>
                    <button
                      className={styles.deleteBtn}
                      onClick={(e) => handleExcluirConversa(e, thread.id)}
                      title="Excluir conversa"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.chatArea}>
        <div className={styles.chatHeader}>
          <div className={styles.botTitle}>
            <div className={styles.botBadge}>
              <Bot size={22} />
            </div>
            <div>
              <h2>Dev IA — Tutor de Estudos ⚡</h2>
              <p>Slides, áudio, plano de estudos e roadmap para aprender programação</p>
            </div>
          </div>

          <button
            onClick={() => setModalMinhasMensagensOpen(true)}
            className={styles.headerGhostBtn}
            title="Ver todas as mensagens que você enviou nesta conversa"
          >
            <History size={16} />
            <span>Minhas Mensagens ({minhasMensagens.length})</span>
          </button>
        </div>

        {/* BARRA DE FERRAMENTAS RÁPIDAS NO TOPO (SUBIDA COM ROLAGEM SUAVE) */}
        <div className={styles.topToolsBar}>
          <span className={styles.topToolsLabel}>✨ Ferramentas IA:</span>
          <button
            type="button"
            className={styles.scrollToolBtn}
            onClick={() => rolarFerramentas("esquerda")}
            title="Rolar para a esquerda"
          >
            <ChevronLeft size={15} />
          </button>
          <div className={styles.topToolsList} ref={topToolsRef}>
            {ferramentas.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={styles.topToolPill}
                  onClick={() => abrirFerramenta(item.id)}
                  disabled={sending}
                  title={item.desc}
                >
                  <Icon size={15} />
                  <span>{item.titulo}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className={styles.scrollToolBtn}
            onClick={() => rolarFerramentas("direita")}
            title="Rolar para a direita"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        {painelJornada ? (
          <div className={styles.jornadaPanel}>
            <div className={styles.jornadaHead}>
              <div>
                <h3>📖 Minha Jornada</h3>
                <p>{jornada.objetivo}</p>
              </div>
              <div className={styles.jornadaActions}>
                <span className={styles.jornadaProgress}>{feitos}/{totalEtapas} etapas</span>
                <button type="button" onClick={copiarJornada} title="Copiar trilha">
                  <Copy size={16} />
                </button>
                <button type="button" onClick={() => abrirFerramenta("roadmap")}>Gerar nova trilha</button>
              </div>
            </div>

            <div className={styles.roadmapBox}>
              <button type="button" className={styles.roadmapCopy} onClick={copiarJornada} title="Copiar">
                <Copy size={14} />
              </button>
              <div className={styles.roadmapTitle}>{jornada.titulo}</div>
              <div className={styles.roadmapTree}>
                {(jornada.linhas || []).map((linha, idx) => (
                  <div key={idx} className={styles.roadmapBlock}>
                    {idx > 0 && <div className={styles.roadmapVLine} />}
                    {linha.tipo === "bifurcacao" ? (
                      <div className={styles.roadmapSplitWrap}>
                        <div className={styles.roadmapTBar} />
                        <div className={styles.roadmapSplit}>
                          <div className={styles.roadmapBranch}>
                            <div className={styles.roadmapVLineShort} />
                            <NoCheck id={linha.esquerda.id} label={linha.esquerda.label} dica={linha.esquerda.dica} />
                          </div>
                          <div className={styles.roadmapBranch}>
                            <div className={styles.roadmapVLineShort} />
                            <NoCheck id={linha.direita.id} label={linha.direita.label} dica={linha.direita.dica} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <NoCheck id={linha.id} label={linha.label} dica={linha.dica} />
                    )}
                  </div>
                ))}
              </div>
              <p className={styles.roadmapHint}>Clique no quadrado verde para marcar o que você já concluiu.</p>
            </div>
          </div>
        ) : (
          <div className={styles.messagesContainer}>
            {messages.length === 0 && !loadingMessages ? (
              <div className={styles.welcomeBox}>
                <div className={styles.welcomeHeader}>
                  <Sparkles size={36} className={styles.sparkleIcon} />
                  <h3>Boas-vindas à Dev IA Tutor!</h3>
                  <p className={styles.welcomeSubtitle}>Tire dúvidas de programação ou escolha uma sugestão abaixo:</p>
                </div>
                <div className={styles.welcomeSuggestions}>
                  <button
                    type="button"
                    className={styles.suggestionCard}
                    onClick={() => handleEnviarMensagem("Como funciona Flexbox e CSS Grid? Me dê exemplos práticos.")}
                  >
                    <span className={styles.suggestionIcon}>🎨</span>
                    <div>
                      <div className={styles.suggestionTitle}>Flexbox & CSS Grid</div>
                      <div className={styles.suggestionDesc}>Exemplos práticos de layout no CSS</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={styles.suggestionCard}
                    onClick={() => handleEnviarMensagem("Qual a diferença entre useState e useEffect no React?")}
                  >
                    <span className={styles.suggestionIcon}>⚡</span>
                    <div>
                      <div className={styles.suggestionTitle}>React Hooks</div>
                      <div className={styles.suggestionDesc}>Entenda useState, useEffect e estado</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={styles.suggestionCard}
                    onClick={() => handleEnviarMensagem("Monte um plano de estudos em Python para iniciantes de 30 dias.")}
                  >
                    <span className={styles.suggestionIcon}>🐍</span>
                    <div>
                      <div className={styles.suggestionTitle}>Plano Python 30 Dias</div>
                      <div className={styles.suggestionDesc}>Roteiro passo a passo do zero</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={styles.suggestionCard}
                    onClick={() => handleEnviarMensagem("Quais são os primeiros passos para se tornar um Dev Fullstack?")}
                  >
                    <span className={styles.suggestionIcon}>🚀</span>
                    <div>
                      <div className={styles.suggestionTitle}>Trilha Fullstack</div>
                      <div className={styles.suggestionDesc}>Tecnologias essenciais de Frontend e Backend</div>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`${styles.messageRow} ${isUser ? styles.userRow : styles.iaRow}`}
                  >
                    <div className={`${styles.avatar} ${isUser ? styles.userAvatar : styles.iaAvatar}`} style={{ overflow: "hidden" }}>
                      {isUser ? (
                        (user?.avatar_url || user?.avatar) ? (
                          <img
                            src={user.avatar_url || user.avatar}
                            alt="Avatar"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          user?.nome ? user.nome.charAt(0).toUpperCase() : "U"
                        )
                      ) : (
                        <Bot size={18} />
                      )}
                    </div>

                    <div className={styles.messageBubble}>
                      <div className={styles.senderName}>{isUser ? (user?.nome || "Você") : "Dev IA Tutor"}</div>

                      <div className={styles.markdownContent}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content ? msg.content.replace(/<!--FERRAMENTA_DADOS:[\s\S]*?:FERRAMENTA_DADOS-->/g, '') : ""}
                        </ReactMarkdown>
                      </div>

                      {(() => {
                        const fObj = extrairDadosFerramenta(msg.content);
                        if (!fObj || !fObj.dados) return null;

                        if (fObj.tipo === "slides") {
                          return <InlineSlideWidget dados={fObj.dados} onFullscreen={(d) => setSlides(d)} />;
                        }
                        if (fObj.tipo === "audio") {
                          return <InlineAudioWidget dados={fObj.dados} tocarAudio={(txt) => tocarAudio(txt)} />;
                        }
                        if (fObj.tipo === "plano") {
                          return <InlinePlanoWidget dados={fObj.dados} />;
                        }
                        if (fObj.tipo === "roadmap") {
                          return <InlineRoadmapWidget dados={fObj.dados} onAbrirJornada={() => setPainelJornada(true)} />;
                        }
                        return null;
                      })()}

                      <div className={styles.msgFooter}>
                        <span className={styles.timeLabel}>
                          {new Date(msg.created_at || Date.now()).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {!isUser && (
                          <button
                            type="button"
                            className={styles.speakBtn}
                            onClick={() => tocarAudio(String(msg.content).replace(/[#*_`>-]/g, " "))}
                            title="Ouvir esta explicação"
                          >
                            <Volume2 size={14} /> Ouvir
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {sending && (
              <div className={`${styles.messageRow} ${styles.iaRow}`}>
                <div className={`${styles.avatar} ${styles.iaAvatar}`}>
                  <Bot size={18} />
                </div>
                <div className={styles.messageBubble}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.86rem", color: "#818cf8", fontWeight: "700" }}>
                    <Sparkles size={16} style={{ animation: "spin 1.5s linear infinite" }} />
                    <span>A Dev IA está gerando o seu conteúdo...</span>
                  </div>
                  <div className={styles.typingIndicator} style={{ marginTop: "6px" }}>
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className={styles.inputContainer}>
          <textarea
            className={styles.chatInput}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Digite sua dúvida de programação ou assunto de estudos (ex.: React, Python, SQL)..."
            rows={1}
          />
          <button
            className={styles.sendBtn}
            onClick={() => handleEnviarMensagem()}
            disabled={sending || !inputMessage.trim()}
            title="Enviar mensagem"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {ferramenta && ferramenta !== "entrevista" && (
        <div className={styles.overlay}>
          <div className={styles.modalCard}>
            <button className={styles.modalClose} onClick={() => setFerramenta(null)}><X size={18} /></button>

            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
              <div className={styles.botBadge} style={{ width: "44px", height: "44px", borderRadius: "14px", background: "linear-gradient(135deg,#6366f1,#a855f7)", flexShrink: 0 }}>
                {ferramenta === "slides" && <Palette size={24} color="#FFF" />}
                {ferramenta === "audio" && <Headphones size={24} color="#FFF" />}
                {ferramenta === "plano" && <Target size={24} color="#FFF" />}
                {ferramenta === "roadmap" && <Map size={24} color="#FFF" />}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "900", color: "#FFF" }}>
                  {ferramenta === "slides" && "🎨 Criar Slides Educativos"}
                  {ferramenta === "audio" && "🎧 Explicação por Áudio"}
                  {ferramenta === "plano" && "🎯 Gerar Plano de Estudos"}
                  {ferramenta === "roadmap" && "🗺️ Roadmap de Aprendizado"}
                </h3>
                <p style={{ margin: "3px 0 0", fontSize: "0.85rem", color: "#94a3b8" }}>
                  A Dev IA vai estruturar o conteúdo completo em segundos
                </p>
              </div>
            </div>

            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "800", color: "#cbd5e1", marginBottom: "4px" }}>
              Qual assunto de programação você quer estudar?
            </label>

            <input
              className={styles.temaInput}
              value={temaFerramenta || ""}
              onChange={(e) => setTemaFerramenta(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") executarFerramenta(); }}
              placeholder="Ex.: Desenvolvimento Web do Zero, React.js, Python, Node.js..."
              autoFocus
            />

            {/* SUGESTÕES RÁPIDAS CLICÁVEIS */}
            <div style={{ marginBottom: "22px" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: "800", color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                💡 Sugestões Rápidas:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {[
                  "Desenvolvimento Web do Zero 🚀",
                  "React.js & Hooks ⚛️",
                  "Node.js & Express 🟢",
                  "Python para Iniciantes 🐍",
                  "SQL & Banco de Dados 🗄️",
                  "Estrutura de Dados 🧩"
                ].map((sugestao, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTemaFerramenta(sugestao.replace(/ [^\s]+$/, ""))}
                    style={{
                      padding: "6px 12px", borderRadius: "20px",
                      backgroundColor: "rgba(99, 102, 241, 0.12)",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      color: "#c084fc", fontSize: "0.8rem", fontWeight: "700",
                      cursor: "pointer", transition: "all 0.2s ease"
                    }}
                  >
                    {sugestao}
                  </button>
                ))}
              </div>
            </div>

            <button className={styles.modalPrimary} onClick={executarFerramenta} disabled={gerandoFerramenta || !temaFerramenta || !temaFerramenta.trim()}>
              {gerandoFerramenta ? (
                <>
                  <Sparkles size={18} style={{ animation: "spin 1.5s linear infinite" }} />
                  <span>Gerando com a Dev IA...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Gerar Conteúdo com Dev IA ➔</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {slides?.slides?.length > 0 && (
        <div className={styles.overlay}>
          <div className={styles.slideModal}>
            <button className={styles.modalClose} onClick={() => setSlides(null)}><X size={18} /></button>
            <div className={styles.slideDeck}>
              <div className={styles.slideKicker}>{slides.titulo}</div>
              <h2>{slideAtual?.titulo}</h2>
              <ul>
                {(slideAtual?.bullets || []).map((b, i) => <li key={i}>{b}</li>)}
              </ul>
              {slideAtual?.explicacao && <p className={styles.slideNote}>{slideAtual.explicacao}</p>}
            </div>
            <div className={styles.slideNav}>
              <button disabled={slideIndex === 0} onClick={() => setSlideIndex((i) => i - 1)}>Anterior</button>
              <span>{slideIndex + 1} / {slides.slides.length}</span>
              <button disabled={slideIndex >= slides.slides.length - 1} onClick={() => setSlideIndex((i) => i + 1)}>Próximo</button>
            </div>
          </div>
        </div>
      )}

      {audioAtivo && (
        <div className={styles.overlay}>
          <div className={styles.modalCard}>
            <button className={styles.modalClose} onClick={() => { window.speechSynthesis?.cancel(); setAudioAtivo(null); setAudioTocando(false); }}><X size={18} /></button>
            <h3>🎧 {audioAtivo.titulo}</h3>
            <p className={styles.audioScript}>{audioAtivo.roteiro}</p>
            <button className={styles.modalPrimary} onClick={() => tocarAudio(audioAtivo.roteiro)}>
              {audioTocando ? <><Pause size={16} /> Pausar</> : <><Play size={16} /> Ouvir explicação</>}
            </button>
          </div>
        </div>
      )}

      {plano && (
        <div className={styles.overlay}>
          <div className={styles.planoModal}>
            <button className={styles.modalClose} onClick={() => setPlano(null)}><X size={18} /></button>
            <h3>🎯 {plano.titulo}</h3>
            <p><strong>{plano.duracao}</strong> — {plano.objetivo}</p>
            <div className={styles.planoList}>
              {(plano.semanas || []).map((semana) => (
                <section key={semana.semana}>
                  <h4>Semana {semana.semana}: {semana.foco}</h4>
                  <ul>
                    {(semana.dias || []).map((d) => (
                      <li key={d.dia}><strong>Dia {d.dia}.</strong> {d.tema} — {d.tarefa}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      )}

      {modalMinhasMensagensOpen && (
        <div className={styles.overlay}>
          <div className={styles.modalCard} style={{ maxWidth: "560px" }}>
            <button className={styles.modalClose} onClick={() => setModalMinhasMensagensOpen(false)}><X size={18} /></button>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
              <div className={styles.botBadge}><History size={22} color="#FFF" /></div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", margin: 0 }}>Mensagens Enviadas por Você</h3>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Total de {minhasMensagens.length} perguntas nesta conversa</div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
              {minhasMensagens.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "#94a3b8" }}>
                  Nenhuma mensagem enviada por você nesta conversa ainda.
                </div>
              ) : (
                minhasMensagens.map((msg, idx) => (
                  <div key={idx} className={styles.historyItem}>
                    <div className={styles.historyMeta}>
                      <span>Pergunta #{idx + 1}</span>
                      <span>{new Date(msg.created_at || Date.now()).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div>{msg.content}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Configuração da Entrevista Técnica */}
      {ferramenta === "entrevista" && (
        <div className={styles.overlay}>
          <div className={styles.entrevistaModal}>
            <button className={styles.modalClose} onClick={() => setFerramenta(null)}><X size={18} /></button>
            <div className={styles.entrevistaHeader}>
              <div className={styles.botBadge} style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}>
                <Briefcase size={22} color="#FFF" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>Simulador de Entrevista Técnica</h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "#94a3b8" }}>Simule uma entrevista com um Tech Lead Sênior da Dev IA</p>
              </div>
            </div>

            <div className={styles.entrevistaSelectGroup}>
              <div>
                <div className={styles.entrevistaLabel}>Selecione a Tecnologia / Cargo:</div>
                <select
                  className={styles.entrevistaSelect}
                  value={entrevistaCargo}
                  onChange={(e) => setEntrevistaCargo(e.target.value)}
                >
                  <option value="Frontend React">Frontend React & JavaScript</option>
                  <option value="Backend Node.js">Backend Node.js & APIs Express</option>
                  <option value="Dev Fullstack">Desenvolvedor Fullstack JS</option>
                  <option value="SQL & Banco de Dados">SQL & Banco de Dados Relacional</option>
                </select>
              </div>

              <div>
                <div className={styles.entrevistaLabel}>Selecione o Nível de Sênioridade:</div>
                <select
                  className={styles.entrevistaSelect}
                  value={entrevistaNivel}
                  onChange={(e) => setEntrevistaNivel(e.target.value)}
                >
                  <option value="Júnior">Nível Júnior / Estágio</option>
                  <option value="Pleno">Nível Pleno</option>
                </select>
              </div>
            </div>

            <button
              className={styles.modalPrimary}
              onClick={handleIniciarEntrevista}
              disabled={processandoEntrevista}
            >
              {processandoEntrevista ? "Iniciando Entrevista..." : "🎙️ Iniciar Entrevista Agora"}
            </button>
          </div>
        </div>
      )}

      {/* Sala de Entrevista Técnica Ativa */}
      {entrevistaAtiva && entrevistaDados && (
        <div className={styles.overlay}>
          <div className={styles.entrevistaModal}>
            <button className={styles.modalClose} onClick={() => { setEntrevistaAtiva(false); setEntrevistaDados(null); }}><X size={18} /></button>
            <div className={styles.entrevistaHeader}>
              <div className={styles.botBadge}>
                <Briefcase size={20} color="#FFF" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>Entrevista Técnica: {entrevistaCargo} ({entrevistaNivel})</h3>
                <div style={{ fontSize: "0.8rem", color: "#818cf8", fontWeight: 700 }}>Pergunta {entrevistaDados.perguntaIndex} de {entrevistaDados.totalPerguntas || 3}</div>
              </div>
            </div>

            <div className={styles.questionCard}>
              <div className={styles.interviewerTitle}>
                <Bot size={16} /> Tech Lead Entrevistador diz:
              </div>
              <p className={styles.questionText}>{entrevistaDados.perguntaAtual}</p>
            </div>

            <textarea
              className={styles.answerTextarea}
              placeholder="Escreva sua resposta técnica detalhada aqui (explique os conceitos, por que e como funciona na prática)..."
              value={entrevistaResposta}
              onChange={(e) => setEntrevistaResposta(e.target.value)}
              disabled={processandoEntrevista}
            />

            <button
              className={styles.modalPrimary}
              onClick={handleEnviarRespostaEntrevista}
              disabled={processandoEntrevista || !entrevistaResposta.trim()}
            >
              {processandoEntrevista ? "Avaliando sua resposta..." : "Enviar Resposta e Continuar ➔"}
            </button>
          </div>
        </div>
      )}

      {/* Relatório Final da Entrevista Técnica */}
      {entrevistaRelatorio && (
        <div className={styles.overlay}>
          <div className={styles.entrevistaModal}>
            <button className={styles.modalClose} onClick={() => setEntrevistaRelatorio(null)}><X size={18} /></button>

            <div className={styles.reportBox}>
              <div className={styles.scoreBadge}>
                <Award size={24} /> Nota Final: {entrevistaRelatorio.notaFinal} / 10
              </div>

              <h3 style={{ color: "#FFF", margin: "8px 0 4px", fontSize: "1.3rem" }}>
                {entrevistaRelatorio.aprovado ? "🎉 Parabéns! Candidato Aprovado!" : "💪 Quase lá! Continue Praticando"}
              </h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.88rem", margin: "0 0 16px" }}>
                {entrevistaRelatorio.feedbackResposta}
              </p>

              <div className={styles.reportGrid}>
                <div className={styles.reportCard}>
                  <h4 style={{ color: "#4ade80" }}><CheckCircle size={16} /> Pontos Fortes</h4>
                  <ul>
                    {(entrevistaRelatorio.pontosFortes || []).map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>

                <div className={styles.reportCard}>
                  <h4 style={{ color: "#fbbf24" }}><AlertTriangle size={16} /> O que Pode Melhorar</h4>
                  <ul>
                    {(entrevistaRelatorio.pontosMelhorar || []).map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              </div>

              {entrevistaRelatorio.dicaSenior && (
                <div className={styles.dicaSeniorBox}>
                  <div style={{ fontWeight: 800, color: "#c084fc", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Lightbulb size={16} /> Dica de Ouro de Tech Lead Sênior:
                  </div>
                  {entrevistaRelatorio.dicaSenior}
                </div>
              )}

              <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                <button
                  className={styles.modalPrimary}
                  onClick={() => { setEntrevistaRelatorio(null); setFerramenta("entrevista"); }}
                  style={{ flex: 1 }}
                >
                  🔄 Fazer Nova Entrevista
                </button>
                <button
                  className={styles.modalPrimary}
                  onClick={() => setEntrevistaRelatorio(null)}
                  style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  Fechar Relatório
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
