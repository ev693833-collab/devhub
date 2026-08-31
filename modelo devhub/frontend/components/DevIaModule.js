import { useState, useEffect, useRef } from "react";
import { 
  Bot, Send, Plus, Trash2, MessageSquare, Sparkles, 
  Code, Bug, Target, Check, Copy, ChevronLeft, ChevronRight, History, X, User 
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./DevIaModule.module.css";

export default function DevIaModule({ user }) {
  const [collapsed, setCollapsed] = useState(false);
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  // Modal para ver Histórico das Minhas Mensagens Enviadas
  const [modalMinhasMensagensOpen, setModalMinhasMensagensOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  // Carregar histórico de conversas (threads)
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

  // Carregar mensagens da conversa ativa
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

  // Criar nova conversa
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

  // Excluir conversa
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

  // Enviar mensagem para a IA
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  // Filtrar apenas as mensagens enviadas pelo usuário
  const minhasMensagens = messages.filter(m => m.sender === "user");

  return (
    <div className={styles.container}>
      {/* Sidebar com lista de conversas */}
      <div className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          {!collapsed && <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--text-secondary)" }}>Conversas</h3>}
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
                onClick={() => setActiveThreadId(thread.id)}
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

      {/* Área principal do Chat */}
      <div className={styles.chatArea}>
        <div className={styles.chatHeader}>
          <div className={styles.botTitle}>
            <div className={styles.botBadge}>
              <Bot size={22} />
            </div>
            <div>
              <h2>Dev IA — Tutor de Estudos ⚡</h2>
              <p>Assistente acadêmico 24/7 para tirar dúvidas de programação e tecnologia</p>
            </div>
          </div>

          {/* BOTÃO PARA VER AS MENSAGENS QUE O USUÁRIO MANDOU */}
          <button
            onClick={() => setModalMinhasMensagensOpen(true)}
            style={{
              backgroundColor: "rgba(99, 102, 241, 0.15)",
              color: "#818cf8",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              borderRadius: "12px",
              padding: "8px 14px",
              fontSize: "0.85rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease"
            }}
            title="Ver todas as mensagens que você enviou nesta conversa"
          >
            <History size={16} />
            <span>📜 Minhas Mensagens ({minhasMensagens.length})</span>
          </button>
        </div>

        {/* Mensagens da Conversa (ROLAGEM VERTICAL SUAVE) */}
        <div className={styles.messagesContainer}>
          {messages.length === 0 && !loadingMessages ? (
            <div className={styles.welcomeBox}>
              <Sparkles size={40} className={styles.sparkleIcon} />
              <h3>Boas-vindas à Dev IA Tutor!</h3>
              <p>Tire dúvidas sobre programação, conceitos de software e orientação de carreira didática!</p>
              
              {/* Botões de Atalho */}
              <div className={styles.shortcutGrid}>
                <button
                  className={styles.shortcutCard}
                  onClick={() => handleEnviarMensagem("Como alinhar elementos no centro usando CSS Flexbox?")}
                >
                  <Code size={18} color="#3b82f6" />
                  <span>Como alinhar no centro com Flexbox?</span>
                </button>

                <button
                  className={styles.shortcutCard}
                  onClick={() => handleEnviarMensagem("Como funciona a manipulação de arrays com map, filter e reduce em JavaScript?")}
                >
                  <Code size={18} color="#10b981" />
                  <span>Como usar map, filter e reduce em JS?</span>
                </button>

                <button
                  className={styles.shortcutCard}
                  onClick={() => handleEnviarMensagem("Qual é a diferença entre useState e useEffect no React com exemplos?")}
                >
                  <Target size={18} color="#8b5cf6" />
                  <span>Qual a diferença de useState e useEffect?</span>
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
                        {msg.content}
                      </ReactMarkdown>
                    </div>

                    <div className={styles.timeLabel}>
                      {new Date(msg.created_at || Date.now()).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
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
                <div className={styles.typingIndicator}>
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input da Mensagem Elegante e Fixo */}
        <div className={styles.inputContainer}>
          <textarea
            className={styles.chatInput}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Digite sua dúvida de programação aqui..."
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

      {/* MODAL: HISTÓRICO DE MENSAGENS ENVIADAS PELO USUÁRIO */}
      {modalMinhasMensagensOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(8px)",
          zIndex: 2000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
        }}>
          <div style={{
            backgroundColor: "#171c2c",
            color: "#FFF",
            width: "100%", maxWidth: "560px",
            maxHeight: "80vh",
            borderRadius: "24px", padding: "28px",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            display: "flex", flexDirection: "column",
            position: "relative"
          }}>
            <button
              onClick={() => setModalMinhasMensagensOpen(false)}
              style={{
                position: "absolute", top: "20px", right: "20px",
                background: "rgba(255,255,255,0.08)", border: "none", color: "#FFF",
                width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <History size={22} color="#FFF" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", margin: 0 }}>📜 Mensagens Enviadas por Você</h3>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Total de {minhasMensagens.length} perguntas enviadas nesta conversa</div>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "4px" }}>
              {minhasMensagens.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "#94a3b8" }}>
                  Nenhuma mensagem enviada por você nesta conversa ainda.
                </div>
              ) : (
                minhasMensagens.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "14px",
                      padding: "14px 16px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#818cf8", fontWeight: "700", marginBottom: "6px" }}>
                      <span>Pergunta #{idx + 1}</span>
                      <span>{new Date(msg.created_at || Date.now()).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div style={{ fontSize: "0.93rem", color: "#f8fafc", lineHeight: "1.5", fontWeight: "500" }}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
