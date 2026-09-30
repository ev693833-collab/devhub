import { useState, useEffect, useRef } from "react";
import {
  Bot, Send, Plus, Trash2, MessageSquare, Sparkles,
  Target, ChevronLeft, ChevronRight, History, X,
  Palette, Headphones, Map, Check, Copy, Play, Pause, Volume2,
  Briefcase, Award, CheckCircle, AlertTriangle, Lightbulb,
  Mic, MicOff, CheckCheck
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

const MAX_MENSAGENS_DIA = 20;

export default function DevIaModule({ user, isFloating = false, onClose = null }) {
  const [collapsed, setCollapsed] = useState(true);
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  // 🎯 Controle do Limite Diário de Mensagens / Proteção de Tokens
  const [mensagensUsadasHoje, setMensagensUsadasHoje] = useState(0);

  const getHojeKey = () => {
    const hoje = new Date().toISOString().split("T")[0];
    const userKey = user?.email || user?.id || "usuario";
    return `devhub_ia_limite_${userKey}_${hoje}`;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const count = localStorage.getItem(getHojeKey());
        setMensagensUsadasHoje(count ? parseInt(count, 10) : 0);
      } catch (e) {}
    }
  }, [user]);

  const incrementarUsoDiario = () => {
    if (typeof window !== "undefined") {
      try {
        const novo = mensagensUsadasHoje + 1;
        localStorage.setItem(getHojeKey(), String(novo));
        setMensagensUsadasHoje(novo);
      } catch (e) {}
    }
  };

  const [modalMinhasMensagensOpen, setModalMinhasMensagensOpen] = useState(false);
  
  // 🎙️ Gravação de Áudio por Voz (Estilo WhatsApp)
  const [gravandoAudio, setGravandoAudio] = useState(false);
  const [segundosGravacao, setSegundosGravacao] = useState(0);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  const iniciarGravacaoAudio = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta gravação de áudio por voz diretamente. Tente utilizar o Google Chrome ou Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "pt-BR";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setGravandoAudio(true);
        setSegundosGravacao(0);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setSegundosGravacao(prev => prev + 1);
        }, 1000);
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setInputMessage(transcript);
        }
      };

      recognition.onerror = (err) => {
        console.warn("Erro na gravação por voz:", err);
        pararGravacaoAudio();
      };

      recognition.onend = () => {
        setGravandoAudio(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Falha ao iniciar gravação de áudio:", err);
      setGravandoAudio(false);
    }
  };

  const pararGravacaoAudio = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setGravandoAudio(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const pararEEnviarGravacao = () => {
    pararGravacaoAudio();
    setTimeout(() => {
      handleEnviarMensagem();
    }, 400);
  };

  const cancelarGravacaoAudio = () => {
    pararGravacaoAudio();
    setInputMessage("");
  };
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

  const [ultimoEnvioTs, setUltimoEnvioTs] = useState(0);

  const handleEnviarMensagem = async (promptTexto) => {
    const textoFinal = promptTexto || inputMessage;
    if (!textoFinal || textoFinal.trim() === "" || sending) return;

    // Trava de Cooldown (Mínimo 4 segundos entre perguntas contra spam/flood)
    const agora = Date.now();
    if (agora - ultimoEnvioTs < 4000) {
      const faltam = Math.ceil((4000 - (agora - ultimoEnvioTs)) / 1000);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ia",
          content: `⏳ **Aguarde ${faltam} segundo(s)** antes de enviar a próxima pergunta.`
        }
      ]);
      return;
    }

    if (mensagensUsadasHoje >= MAX_MENSAGENS_DIA) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: "user",
          content: textoFinal,
          created_at: new Date().toISOString()
        },
        {
          id: Date.now() + 1,
          sender: "ia",
          content: "⚠️ **Limite Diário Atingido!**\n\nVocê atingiu o limite de **20 interações diárias** com a Dev IA para proteção do uso de tokens da plataforma. O seu limite será renovado amanhã às 00:00! 🌙"
        }
      ]);
      if (!promptTexto) setInputMessage("");
      return;
    }

    setUltimoEnvioTs(agora);
    incrementarUsoDiario();

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
    <div className={styles.container} style={isFloating ? { height: "100%", minHeight: 0, marginTop: 0, borderRadius: 0, border: "none", backgroundColor: "transparent" } : {}}>
      <div className={styles.waChatArea}>
        {/* CABEÇALHO ESTILO WHATSAPP WEB */}
        <div className={styles.waHeader}>
          <div className={styles.waProfileInfo}>
            <div className={styles.waAvatar}>
              <Bot size={22} />
              <span className={styles.waOnlineDot} title="Online agora" />
            </div>
            <div>
              <h3 className={styles.waTitle}>
                Dev IA — Suporte & Guia DevHub
              </h3>
              <p className={styles.waSubtitle}>online • tira dúvidas sobre o sistema</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: "800",
                padding: "4px 10px",
                borderRadius: "12px",
                backgroundColor: mensagensUsadasHoje >= MAX_MENSAGENS_DIA ? "rgba(239, 68, 68, 0.2)" : "rgba(37, 211, 102, 0.15)",
                border: `1px solid ${mensagensUsadasHoje >= MAX_MENSAGENS_DIA ? "#EF4444" : "#25D366"}`,
                color: mensagensUsadasHoje >= MAX_MENSAGENS_DIA ? "#F87171" : "#25D366",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                whiteSpace: "nowrap"
              }}
              title="Limite diário de interações por usuário para economia de tokens"
            >
              ⚡ {Math.max(0, MAX_MENSAGENS_DIA - mensagensUsadasHoje)}/20 Diárias
            </span>

            {onClose && (
              <button
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#aebac1",
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s"
                }}
                title="Fechar Conversa (X)"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* CONTAINER DE MENSAGENS NO ESTILO WHATSAPP */}
        <div className={styles.waMessagesContainer}>
          {messages.length === 0 && !loadingMessages ? (
            <div className={`${styles.waRow} ${styles.waIaRow}`}>
              <div className={`${styles.waBubble} ${styles.waIaBubble}`} style={{ maxWidth: "85%" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#00a884", marginBottom: "6px" }}>
                  Dev IA Suporte 🤖
                </div>
                <div style={{ wordBreak: "break-word", lineHeight: "1.5", fontSize: "0.92rem", color: "#e9edef" }}>
                  👋 <strong>Olá! Eu sou a Dev IA, sua assistente e guia oficial do DevHub 🟢</strong><br /><br />
                  Estou aqui para te ajudar a entender e navegar por todas as partes da nossa plataforma! Pode me perguntar qualquer coisa sobre como funciona o sistema, incluindo:<br /><br />
                  - 📊 <strong>Visão Geral & Provas Diárias</strong> (Como responder provas e acumular XP/Nível)<br />
                  - ⚔️ <strong>Batalha de Código</strong> (Arena de desafios de programação e ranking)<br />
                  - 📝 <strong>Caderno de Estudos & Flashcards</strong> (Bloco de anotações e cartões de memória)<br />
                  - 🛒 <strong>Loja de Temas & DevCoins</strong> (Como trocar moedas por temas exclusivos)<br />
                  - 📅 <strong>Agenda de Aulas & Mentoria</strong> (Ver horários e aulas ao vivo)<br />
                  - 🎫 <strong>Suporte & Tickets</strong> (Como abrir chamados com nossa equipe)<br /><br />
                  Como posso te ajudar hoje? <strong>Digite sua dúvida abaixo</strong> ou <strong>clique no microfone para enviar uma mensagem por voz! 🎙️</strong>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
                  <button
                    type="button"
                    style={{ backgroundColor: "#111b21", border: "1px solid #00a884", borderRadius: "18px", padding: "6px 12px", color: "#00a884", fontSize: "0.78rem", fontWeight: "700", cursor: "pointer" }}
                    onClick={() => handleEnviarMensagem("Quais são todos os módulos e recursos disponíveis dentro do DevHub?")}
                  >
                    📊 O que tem no DevHub?
                  </button>
                  <button
                    type="button"
                    style={{ backgroundColor: "#111b21", border: "1px solid #00a884", borderRadius: "18px", padding: "6px 12px", color: "#00a884", fontSize: "0.78rem", fontWeight: "700", cursor: "pointer" }}
                    onClick={() => handleEnviarMensagem("Como funciona a Batalha de Código e como ganho XP e DevCoins?")}
                  >
                    ⚔️ Batalha de Código
                  </button>
                  <button
                    type="button"
                    style={{ backgroundColor: "#111b21", border: "1px solid #00a884", borderRadius: "18px", padding: "6px 12px", color: "#00a884", fontSize: "0.78rem", fontWeight: "700", cursor: "pointer" }}
                    onClick={() => handleEnviarMensagem("Como uso o Caderno de Estudos e os Flashcards?")}
                  >
                    📝 Caderno & Flashcards
                  </button>
                  <button
                    type="button"
                    style={{ backgroundColor: "#111b21", border: "1px solid #00a884", borderRadius: "18px", padding: "6px 12px", color: "#00a884", fontSize: "0.78rem", fontWeight: "700", cursor: "pointer" }}
                    onClick={() => handleEnviarMensagem("Como posso usar minhas DevCoins na Loja de Temas?")}
                  >
                    🛒 Loja & DevCoins
                  </button>
                </div>

                <div className={styles.waMeta} style={{ marginTop: "8px" }}>
                  <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.sender === "user";
              const dadosFerramenta = !isUser ? extrairDadosFerramenta(msg.content) : null;
              const textoSemMarcador = !isUser && msg.content
                ? msg.content.replace(/<!--FERRAMENTA_DADOS:[\s\S]*?:FERRAMENTA_DADOS-->/, "").trim()
                : msg.content;

              return (
                <div
                  key={msg.id}
                  className={`${styles.waRow} ${isUser ? styles.waUserRow : styles.waIaRow}`}
                >
                  <div className={`${styles.waBubble} ${isUser ? styles.waUserBubble : styles.waIaBubble}`}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px", borderBottom: isUser ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,168,132,0.2)", paddingBottom: "4px" }}>
                      <span style={{ fontSize: "0.76rem", fontWeight: "800", color: isUser ? "#38bdf8" : "#25d366" }}>
                        {isUser ? (user?.nome || "Você") : "Dev IA Suporte 🤖"}
                      </span>
                      {!isUser && (
                        <span style={{ fontSize: "0.65rem", backgroundColor: "rgba(0,168,132,0.15)", color: "#25d366", border: "1px solid rgba(37,211,102,0.3)", padding: "1px 6px", borderRadius: "6px", fontWeight: "800" }}>
                          DEVHUB OFICIAL
                        </span>
                      )}
                    </div>

                    <div className={styles.markdownContent} style={{ wordBreak: "break-word" }}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {textoSemMarcador}
                      </ReactMarkdown>
                    </div>

                    {dadosFerramenta?.tipo === "slides" && (
                      <InlineSlideWidget
                        dados={dadosFerramenta.dados}
                        onFullscreen={(dados) => { setSlides(dados); setSlideIndex(0); }}
                      />
                    )}
                    {dadosFerramenta?.tipo === "audio" && (
                      <InlineAudioWidget
                        dados={dadosFerramenta.dados}
                        tocarAudio={(roteiro) => falarTexto(roteiro, () => setAudioTocando(false))}
                      />
                    )}
                    {dadosFerramenta?.tipo === "plano" && (
                      <InlinePlanoWidget dados={dadosFerramenta.dados} />
                    )}
                    {dadosFerramenta?.tipo === "roadmap" && (
                      <InlineRoadmapWidget
                        dados={dadosFerramenta.dados}
                        onAbrirJornada={() => aplicarResultadoFerramenta("roadmap", dadosFerramenta.dados)}
                      />
                    )}

                    <div className={styles.waMeta}>
                      <span>
                        {msg.created_at
                          ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {isUser && (
                        <span className={styles.waCheckmark} title="Entregue e Lido">
                          <CheckCheck size={15} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {sending && (
            <div className={`${styles.waRow} ${styles.waIaRow}`}>
              <div className={`${styles.waBubble} ${styles.waIaBubble}`}>
                <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#00a884", marginBottom: "4px" }}>
                  Dev IA Suporte 🤖
                </div>
                <div style={{ fontSize: "0.85rem", color: "#8696a0" }}>
                  <span>Digitando resposta sobre o DevHub...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* BARRA DE ENTRADA ESTILO WHATSAPP (COM GRAVAÇÃO DE ÁUDIO POR VOZ 🎙️) */}
        <div className={styles.waInputBar}>
          {gravandoAudio ? (
            <div className={styles.waRecordingBar}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ef4444", display: "inline-block", animation: "pulse 1s infinite" }} />
                <span>Gravando áudio por voz... ({segundosGravacao}s)</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={cancelarGravacaoAudio}
                  style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }}
                  title="Cancelar gravação"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  type="button"
                  onClick={pararEEnviarGravacao}
                  style={{ backgroundColor: "#00a884", border: "none", color: "#FFF", padding: "6px 12px", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}
                >
                  Enviar Áudio 🎙️
                </button>
              </div>
            </div>
          ) : (
            <>
              <textarea
                className={styles.waTextarea}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={sending || mensagensUsadasHoje >= MAX_MENSAGENS_DIA}
                placeholder={mensagensUsadasHoje >= MAX_MENSAGENS_DIA ? "🔒 Limite de 20 mensagens diárias atingido." : "Mensagem (ou clique no microfone para falar por voz)..."}
                rows={1}
              />

              {inputMessage.trim() ? (
                <button
                  className={styles.waActionBtn}
                  onClick={() => handleEnviarMensagem()}
                  disabled={sending || mensagensUsadasHoje >= MAX_MENSAGENS_DIA}
                  title="Enviar mensagem"
                >
                  <Send size={18} />
                </button>
              ) : (
                <button
                  className={`${styles.waActionBtn} ${gravandoAudio ? styles.waMicPulse : ""}`}
                  onClick={iniciarGravacaoAudio}
                  disabled={sending || mensagensUsadasHoje >= MAX_MENSAGENS_DIA}
                  title="Mandar mensagem de áudio por voz (Microfone)"
                >
                  <Mic size={20} />
                </button>
              )}
            </>
          )}
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
