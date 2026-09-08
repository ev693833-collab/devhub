import React, { useState, useEffect } from "react";
import styles from "./TicketsModule.module.css";
import { 
  LifeBuoy, PlusCircle, Ticket, Bug, Lightbulb, HelpCircle, 
  Upload, X, CheckCircle, AlertTriangle, Clock, MessageSquare, 
  Send, User, Mail, ShieldCheck, ChevronRight, Play, Image as ImageIcon,
  Search, Filter, Check, CheckCheck, RotateCcw, Trash2, Inbox, CheckCircle2, XCircle, AlertCircle
} from "lucide-react";

const TICKETS_PADRAO = [
  {
    id: "TKT-1020",
    usuarioNome: "Nicholas Araujo",
    usuarioEmail: "nicholas.araujo@devhub.com",
    tipo: "bug",
    tipoLabel: "🐛 Bug / Falha no Sistema",
    prioridade: "alta",
    prioridadeLabel: "🔴 Alta",
    titulo: "Falha na resposta do console no simulador web",
    descricao: "Ao tentar executar o código no playground em tela pequena, o console não abre e retorna mensagem vazia.",
    anexoUrl: null,
    anexoTipo: null,
    anexoNome: null,
    status: "Pendente",
    mensagens: [],
    dataCriacao: "08/09/2026 00:45"
  },
  {
    id: "TKT-1001",
    usuarioNome: "Enzo Vieira",
    usuarioEmail: "enzovieira.contabhub@gmail.com",
    tipo: "bug",
    tipoLabel: "🐛 Bug / Falha no Sistema",
    prioridade: "alta",
    prioridadeLabel: "🔴 Alta",
    titulo: "Erro ao tentar abrir terminal no playground",
    descricao: "Ao clicar no botão de executar código no playground em dispositivos menores, a resposta do console demora para renderizar.",
    anexoUrl: null,
    anexoTipo: null,
    anexoNome: null,
    status: "Resolvido",
    mensagens: [
      {
        id: "msg-1",
        autor: "Superadmin",
        email: "enzovieira.contabhub@gmail.com",
        role: "admin",
        texto: "Corrigido na atualização v2.4! O leitor do console foi otimizado para mobile.",
        data: "05/09/2026 15:10"
      }
    ],
    dataCriacao: "05/09/2026 14:30"
  },
  {
    id: "TKT-1002",
    usuarioNome: "Enzo Vieira",
    usuarioEmail: "enzovieira.contabhub@gmail.com",
    tipo: "melhoria",
    tipoLabel: "💡 Sugestão de Melhoria",
    prioridade: "media",
    prioridadeLabel: "🟡 Média",
    titulo: "Adicionar filtro de busca por assuntos nas aulas",
    descricao: "Seria excelente poder filtrar as aulas e módulos por temas como Frontend, Backend e Banco de Dados.",
    anexoUrl: null,
    anexoTipo: null,
    anexoNome: null,
    status: "Em Análise",
    mensagens: [
      {
        id: "msg-2",
        autor: "Superadmin",
        email: "enzovieira.contabhub@gmail.com",
        role: "admin",
        texto: "Ótima sugestão! Já implementamos o filtro por áreas nas aulas.",
        data: "06/09/2026 11:00"
      }
    ],
    dataCriacao: "06/09/2026 10:15"
  }
];

export default function TicketsModule({ user, isOpen, onClose }) {
  const [abaAtiva, setAbaAtiva] = useState("criar"); // 'criar', 'meus_tickets', 'correio', 'todos'
  const [subAbaCorreio, setSubAbaCorreio] = useState("pendentes"); // 'pendentes', 'rejeitados'
  const [tickets, setTickets] = useState([]);
  
  // Filtros avançados para o SuperAdmin / Usuário
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [termoBusca, setTermoBusca] = useState("");

  // Input de mensagens indexado por ticketId
  const [mensagemInputs, setMensagemInputs] = useState({});
  // Rejeição inline modal/prompts
  const [ticketRejeitandoId, setTicketRejeitandoId] = useState(null);
  const [motivoRejeicaoInput, setMotivoRejeicaoInput] = useState("");

  // Dados do formulário
  const userName = user?.nome || user?.name || user?.username || "Aluno DevHub";
  const userEmail = user?.email || "aluno@devhub.com";
  const isAdmin = user?.cargo === "superadmin" || user?.cargo === "super_admin" || user?.is_super_admin || user?.cargo === "admin";

  const [tipo, setTipo] = useState("bug");
  const [prioridade, setPrioridade] = useState("media");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [anexoUrl, setAnexoUrl] = useState(null);
  const [anexoTipo, setAnexoTipo] = useState(null);
  const [anexoNome, setAnexoNome] = useState(null);
  const [sucessoMsg, setSucessoMsg] = useState(null);

  // Carregar tickets do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("devhub_tickets");
      if (saved) {
        setTickets(JSON.parse(saved));
      } else {
        setTickets(TICKETS_PADRAO);
        localStorage.setItem("devhub_tickets", JSON.stringify(TICKETS_PADRAO));
      }
    } catch (e) {
      console.error("Erro ao carregar tickets:", e);
      setTickets(TICKETS_PADRAO);
    }
  }, []);

  if (isOpen !== undefined && !isOpen) return null;

  const salvarTickets = (novos) => {
    setTickets(novos);
    try {
      localStorage.setItem("devhub_tickets", JSON.stringify(novos));
    } catch (e) {
      console.error("Erro ao salvar tickets:", e);
    }
  };

  // Upload de imagem ou vídeo
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isImage && !isVideo) {
      alert("Por favor, selecione um arquivo de imagem (PNG, JPG) ou vídeo (MP4, WebM).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setAnexoUrl(ev.target.result);
      setAnexoTipo(isVideo ? "video" : "imagem");
      setAnexoNome(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Criar novo Ticket (Inicia na Caixa de Correio como Pendente)
  const handleCriarTicket = (e) => {
    e.preventDefault();

    if (!titulo.trim() || !descricao.trim()) {
      alert("Por favor, preencha o título e a descrição do ticket.");
      return;
    }

    const tipoLabels = {
      bug: "🐛 Bug / Falha no Sistema",
      melhoria: "💡 Sugestão de Melhoria",
      duvida: "❓ Dúvida Técnica / Suporte"
    };

    const prioridadeLabels = {
      baixa: "🟢 Baixa",
      media: "🟡 Média",
      alta: "🔴 Alta",
      critica: "⚡ Crítica"
    };

    const novoTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      usuarioNome: userName,
      usuarioEmail: userEmail,
      tipo,
      tipoLabel: tipoLabels[tipo],
      prioridade,
      prioridadeLabel: prioridadeLabels[prioridade],
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      anexoUrl,
      anexoTipo,
      anexoNome,
      status: "Pendente", // Chega na Caixa de Correio para Triagem do Admin!
      mensagens: [],
      dataCriacao: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    };

    const atualizados = [novoTicket, ...tickets];
    salvarTickets(atualizados);

    // Reset formulário
    setTitulo("");
    setDescricao("");
    setAnexoUrl(null);
    setAnexoTipo(null);
    setAnexoNome(null);

    setSucessoMsg(`🎉 Ticket ${novoTicket.id} enviado para a Caixa de Correio! Aguardando aprovação do suporte.`);
    setTimeout(() => {
      setSucessoMsg(null);
      setAbaAtiva("meus_tickets");
    }, 2000);
  };

  // Triagem: APROVAR TICKET (Mover para Admin Gestão com status Aberto)
  const handleAprovarTicket = (ticketId) => {
    const msgAprovado = {
      id: `msg-${Date.now()}`,
      autor: "Sistema DevHub",
      email: "suporte@devhub.com",
      role: "admin",
      texto: "✅ Ticket aprovado na Caixa de Correio de triagem e liberado para atendimento da equipe.",
      data: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    };

    const atualizados = tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: "Aberto",
          mensagens: [...(t.mensagens || []), msgAprovado]
        };
      }
      return t;
    });

    salvarTickets(atualizados);
    alert(`Ticket ${ticketId} APROVADO com sucesso! Ele foi transferido para a Gestão de Admin.`);
  };

  // Triagem: REJEITAR TICKET (Mover para aba de Rejeitados com motivo)
  const handleConfirmarRejeicao = (ticketId) => {
    const motivoText = motivoRejeicaoInput.trim() || "Solicitação fora do escopo ou dados insuficientes.";

    const msgRejeitado = {
      id: `msg-${Date.now()}`,
      autor: "Sistema DevHub",
      email: "suporte@devhub.com",
      role: "admin",
      texto: `❌ Ticket rejeitado na triagem. Motivo: ${motivoText}`,
      data: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    };

    const atualizados = tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: "Rejeitado",
          motivoRejeicao: motivoText,
          mensagens: [...(t.mensagens || []), msgRejeitado]
        };
      }
      return t;
    });

    salvarTickets(atualizados);
    setTicketRejeitandoId(null);
    setMotivoRejeicaoInput("");
  };

  // Triagem: REAVALIAR / RE-APROVAR TICKET REJEITADO
  const handleReavaliarTicket = (ticketId) => {
    const msgReavaliado = {
      id: `msg-${Date.now()}`,
      autor: "Sistema DevHub",
      email: "suporte@devhub.com",
      role: "admin",
      texto: "🔄 Ticket reavaliado e aprovado! Transferido para Gestão de Atendimento.",
      data: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    };

    const atualizados = tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: "Aberto",
          motivoRejeicao: null,
          mensagens: [...(t.mensagens || []), msgReavaliado]
        };
      }
      return t;
    });

    salvarTickets(atualizados);
    alert(`Ticket ${ticketId} reavaliado e transferido para a Gestão de Admin!`);
  };

  // Enviar Mensagem na thread do Ticket
  const handleEnviarMensagem = (ticketId) => {
    const texto = mensagemInputs[ticketId] || "";
    if (!texto.trim()) return;

    const novaMsg = {
      id: `msg-${Date.now()}`,
      autor: userName,
      email: userEmail,
      role: isAdmin ? "admin" : "aluno",
      texto: texto.trim(),
      data: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    };

    const atualizados = tickets.map(t => {
      if (t.id === ticketId) {
        const historico = t.mensagens || [];
        return {
          ...t,
          mensagens: [...historico, novaMsg],
          status: isAdmin && t.status === "Aberto" ? "Em Análise" : t.status
        };
      }
      return t;
    });

    salvarTickets(atualizados);
    setMensagemInputs(prev => ({ ...prev, [ticketId]: "" }));
  };

  // Alterar Status do Ticket no Admin
  const handleAlterarStatus = (ticketId, novoStatus) => {
    const atualizados = tickets.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: novoStatus };
      }
      return t;
    });
    salvarTickets(atualizados);
  };

  // Excluir Ticket
  const handleExcluirTicket = (ticketId) => {
    if (confirm(`Deseja realmente excluir o ticket ${ticketId}?`)) {
      const atualizados = tickets.filter(t => t.id !== ticketId);
      salvarTickets(atualizados);
    }
  };

  const meusTickets = tickets.filter(t => t.usuarioEmail === userEmail || t.usuarioNome === userName);

  // Filtros de contagens
  const countPendentes = tickets.filter(t => t.status === "Pendente").length;
  const countRejeitados = tickets.filter(t => t.status === "Rejeitado").length;
  const countAtivosAdmin = tickets.filter(t => t.status !== "Pendente" && t.status !== "Rejeitado").length;

  const totalTickets = tickets.length;
  const countAbertos = tickets.filter(t => t.status === "Aberto").length;
  const countAnalise = tickets.filter(t => t.status === "Em Análise").length;
  const countResolvidos = tickets.filter(t => t.status === "Resolvido").length;
  const countBugs = tickets.filter(t => t.tipo === "bug").length;

  // Filtragem avançada e busca
  const listagemTicketsExibida = () => {
    let lista = [];

    if (abaAtiva === "correio") {
      if (subAbaCorreio === "pendentes") {
        lista = tickets.filter(t => t.status === "Pendente");
      } else {
        lista = tickets.filter(t => t.status === "Rejeitado");
      }
    } else if (abaAtiva === "todos") {
      lista = tickets.filter(t => t.status !== "Pendente" && t.status !== "Rejeitado");
    } else {
      lista = meusTickets;
    }

    if (filtroTipo !== "todos") {
      lista = lista.filter(t => t.tipo === filtroTipo);
    }

    if (filtroStatus !== "todos") {
      lista = lista.filter(t => t.status.toLowerCase() === filtroStatus.toLowerCase());
    }

    if (termoBusca.trim()) {
      const q = termoBusca.toLowerCase().trim();
      lista = lista.filter(t => 
        t.id.toLowerCase().includes(q) ||
        t.titulo.toLowerCase().includes(q) ||
        t.usuarioNome.toLowerCase().includes(q) ||
        t.usuarioEmail.toLowerCase().includes(q)
      );
    }

    return lista;
  };

  const getBadgeStatusStyle = (st) => {
    switch (st) {
      case "Pendente":
        return { bg: "rgba(245, 158, 11, 0.18)", color: "#f59e0b", border: "rgba(245, 158, 11, 0.35)", label: "⏳ Pendente de Triagem" };
      case "Aberto":
        return { bg: "rgba(59, 130, 246, 0.18)", color: "#3b82f6", border: "rgba(59, 130, 246, 0.35)", label: "🟡 Aberto" };
      case "Em Análise":
        return { bg: "rgba(168, 85, 247, 0.18)", color: "#a855f7", border: "rgba(168, 85, 247, 0.35)", label: "🔵 Em Análise" };
      case "Resolvido":
        return { bg: "rgba(16, 185, 129, 0.18)", color: "#10b981", border: "rgba(16, 185, 129, 0.35)", label: "🟢 Resolvido" };
      case "Rejeitado":
        return { bg: "rgba(239, 68, 68, 0.18)", color: "#ef4444", border: "rgba(239, 68, 68, 0.35)", label: "❌ Ticket Rejeitado" };
      default:
        return { bg: "rgba(148, 163, 184, 0.18)", color: "#94a3b8", border: "rgba(148, 163, 184, 0.35)", label: st };
    }
  };

  const contentJSX = (
    <div className={styles.container}>

      {/* HEADER CARD */}
      <div className={styles.headerCard}>
        <div className={styles.headerTitleWrap}>
          <div className={styles.headerIcon}>
            <LifeBuoy />
          </div>
          <div>
            <h2 className={styles.title}>Central de Tickets & Suporte</h2>
            <p className={styles.subtitle}>
              Relate bugs, sugira melhorias e converse em tempo real com a equipe DevHub.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* NAV TABS */}
          <div className={styles.navTabs}>
            <button 
              className={`${styles.tabBtn} ${abaAtiva === "criar" ? styles.tabBtnActive : ""}`}
              onClick={() => setAbaAtiva("criar")}
            >
              <PlusCircle size={15} /> Abrir Ticket
            </button>
            <button 
              className={`${styles.tabBtn} ${abaAtiva === "meus_tickets" ? styles.tabBtnActive : ""}`}
              onClick={() => setAbaAtiva("meus_tickets")}
            >
              <Ticket size={15} /> Meus Tickets ({meusTickets.length})
            </button>

            {/* ABA CAIXA DE CORREIO DE TRIAGEM (ADMIN) */}
            {isAdmin && (
              <button 
                className={`${styles.tabBtn} ${abaAtiva === "correio" ? styles.tabBtnActive : ""}`}
                onClick={() => setAbaAtiva("correio")}
                style={{ 
                  borderColor: countPendentes > 0 ? "#f59e0b" : "#38bdf8",
                  position: "relative"
                }}
              >
                <Inbox size={15} color={countPendentes > 0 ? "#f59e0b" : "#38bdf8"} /> 
                Caixa de Correio ({countPendentes})
                {countPendentes > 0 && (
                  <span style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    backgroundColor: "#f59e0b", display: "inline-block", marginLeft: "4px"
                  }} />
                )}
              </button>
            )}

            {/* ABA GESTÃO DE ADMIN */}
            {isAdmin && (
              <button 
                className={`${styles.tabBtn} ${abaAtiva === "todos" ? styles.tabBtnActive : ""}`}
                onClick={() => setAbaAtiva("todos")}
                style={{ borderColor: "#a855f7" }}
              >
                <ShieldCheck size={15} color="#a855f7" /> Admin ({countAtivosAdmin})
              </button>
            )}
          </div>

          {onClose && (
            <button className={styles.btnCloseModal} onClick={onClose} title="Fechar Modal">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* MENSAGEM DE SUCESSO */}
      {sucessoMsg && (
        <div style={{
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          color: "#10b981",
          padding: "14px 18px",
          borderRadius: "16px",
          fontWeight: "800",
          fontSize: "13.5px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <CheckCircle size={18} /> {sucessoMsg}
        </div>
      )}

      {/* TAB 1: FORMULÁRIO DE ABERTURA DE TICKET */}
      {abaAtiva === "criar" && (
        <div className={styles.formCard}>
          <div className={styles.userBanner}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className={styles.userName}>{userName}</h4>
                <p className={styles.userEmail}>{userEmail}</p>
              </div>
            </div>
            <span style={{
              fontSize: "11px", fontWeight: "800",
              padding: "4px 10px", borderRadius: "10px",
              backgroundColor: "rgba(59, 130, 246, 0.15)",
              color: "#3b82f6", border: "1px solid rgba(59, 130, 246, 0.3)"
            }}>
              ✅ Identificação Automática DevHub
            </span>
          </div>

          <form onSubmit={handleCriarTicket}>
            <div className={styles.formGrid}>
              
              {/* TIPO DE TICKET */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Tipo de Solicitação</label>
                <select 
                  className={styles.select} 
                  value={tipo} 
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="bug">🐛 Relatar Bug / Falha no Sistema</option>
                  <option value="melhoria">💡 Sugestão de Melhoria</option>
                  <option value="duvida">❓ Dúvida Técnica / Suporte</option>
                </select>
              </div>

              {/* PRIORIDADE */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Prioridade</label>
                <select 
                  className={styles.select} 
                  value={prioridade} 
                  onChange={(e) => setPrioridade(e.target.value)}
                >
                  <option value="baixa">🟢 Baixa (Dúvida simples / Pequeno detalhe)</option>
                  <option value="media">🟡 Média (Melhoria ou falha secundária)</option>
                  <option value="alta">🔴 Alta (Bug que impede uma funcionalidade)</option>
                  <option value="critica">⚡ Crítica (Erro grave no sistema)</option>
                </select>
              </div>
            </div>

            {/* TÍTULO */}
            <div className={styles.formGroup} style={{ marginBottom: "16px" }}>
              <label className={styles.label}>Título Resumido do Ticket</label>
              <input 
                type="text"
                className={styles.input}
                placeholder="Ex: Erro ao enviar resposta na prova de React..."
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            {/* DESCRIÇÃO */}
            <div className={styles.formGroup} style={{ marginBottom: "16px" }}>
              <label className={styles.label}>Descrição Detalhada do Ocorrido</label>
              <textarea 
                className={styles.textarea}
                placeholder="Descreva detalhadamente o que aconteceu, os passos para reproduzir o problema..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>

            {/* ANEXO (FOTO OU VÍDEO) */}
            <div className={styles.formGroup} style={{ marginBottom: "20px" }}>
              <label className={styles.label}>Anexar Imagem ou Vídeo (Opcional)</label>
              
              {!anexoUrl ? (
                <label className={styles.uploadZone}>
                  <input 
                    type="file" 
                    accept="image/*,video/*" 
                    onChange={handleFileUpload} 
                    style={{ display: "none" }} 
                  />
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <Upload size={24} color="#3b82f6" />
                    <span style={{ fontSize: "13.5px", fontWeight: "700", color: "#f8fafc" }}>
                      Clique para escolher uma imagem ou vídeo
                    </span>
                    <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                      Suporta PNG, JPG, GIF ou vídeos curtos em MP4/WebM
                    </span>
                  </div>
                </label>
              ) : (
                <div className={styles.previewWrap}>
                  <button 
                    type="button" 
                    className={styles.btnRemoveMedia} 
                    onClick={() => { setAnexoUrl(null); setAnexoTipo(null); setAnexoNome(null); }}
                  >
                    <X size={13} /> Remover Anexo
                  </button>

                  {anexoTipo === "video" ? (
                    <video src={anexoUrl} controls className={styles.previewVideo} />
                  ) : (
                    <img src={anexoUrl} alt="Anexo do ticket" className={styles.previewImg} />
                  )}
                </div>
              )}
            </div>

            <button type="submit" className={styles.btnSubmit}>
              <Send size={16} /> Enviar Ticket para a Caixa de Correio
            </button>
          </form>
        </div>
      )}

      {/* ABA CAIXA DE CORREIO (TRIAGEM DE TICKETS PARA SUPERADMIN) */}
      {abaAtiva === "correio" && isAdmin && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          
          {/* CAIXA DE CORREIO HERO BANNER */}
          <div style={{
            backgroundColor: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "20px",
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#f8fafc", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                <Inbox color="#f59e0b" size={22} />
                <span>📫 Caixa de Correio (Triagem de Solicitações)</span>
              </h3>
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0 0" }}>
                Avalie cada ticket criado pelos alunos. Aprove para liberar na aba Admin ou rejeite com motivo.
              </p>
            </div>

            {/* SUB-ABAS DA CAIXA DE CORREIO: PENDENTES VS REJEITADOS */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setSubAbaCorreio("pendentes")}
                style={{
                  padding: "10px 18px",
                  borderRadius: "14px",
                  fontWeight: "800",
                  fontSize: "13px",
                  cursor: "pointer",
                  border: subAbaCorreio === "pendentes" ? "1.5px solid #f59e0b" : "1px solid #334155",
                  backgroundColor: subAbaCorreio === "pendentes" ? "rgba(245, 158, 11, 0.15)" : "#1e293b",
                  color: subAbaCorreio === "pendentes" ? "#fbbf24" : "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <Clock size={16} /> 📥 Pendentes de Triagem ({countPendentes})
              </button>

              <button
                onClick={() => setSubAbaCorreio("rejeitados")}
                style={{
                  padding: "10px 18px",
                  borderRadius: "14px",
                  fontWeight: "800",
                  fontSize: "13px",
                  cursor: "pointer",
                  border: subAbaCorreio === "rejeitados" ? "1.5px solid #ef4444" : "1px solid #334155",
                  backgroundColor: subAbaCorreio === "rejeitados" ? "rgba(239, 68, 68, 0.15)" : "#1e293b",
                  color: subAbaCorreio === "rejeitados" ? "#f87171" : "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <XCircle size={16} /> ❌ Tickets Rejeitados ({countRejeitados})
              </button>
            </div>
          </div>

          {/* LISTAGEM DOS TICKETS DA CAIXA DE CORREIO */}
          <div className={styles.ticketsList}>
            {listagemTicketsExibida().length === 0 ? (
              <div className={styles.emptyWrap}>
                <Inbox size={42} color="#64748b" />
                <h4 style={{ color: "#f8fafc", margin: "10px 0 4px 0" }}>
                  {subAbaCorreio === "pendentes" 
                    ? "Nenhum ticket pendente na Caixa de Correio 🎉" 
                    : "Nenhum ticket rejeitado até o momento"}
                </h4>
                <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                  {subAbaCorreio === "pendentes"
                    ? "Todas as solicitações enviadas pelos alunos foram triadas."
                    : "Os tickets recusados no processo de triagem ficarão salvos aqui."}
                </p>
              </div>
            ) : (
              listagemTicketsExibida().map((t) => {
                const badgeSt = getBadgeStatusStyle(t.status);
                const isRejeitando = ticketRejeitandoId === t.id;

                return (
                  <div key={t.id} className={styles.ticketCard} style={{ borderColor: subAbaCorreio === "pendentes" ? "rgba(245, 158, 11, 0.4)" : "rgba(239, 68, 68, 0.3)" }}>
                    <div className={styles.ticketCardHeader}>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                        <span className={styles.ticketId}>{t.id}</span>
                        <span className={styles.typeBadge}>{t.tipoLabel}</span>
                        <span className={styles.prioridadeBadge}>{t.prioridadeLabel}</span>
                      </div>

                      <span 
                        style={{
                          backgroundColor: badgeSt.bg,
                          color: badgeSt.color,
                          border: `1px solid ${badgeSt.border}`,
                          fontSize: "11px",
                          fontWeight: "800",
                          padding: "4px 12px",
                          borderRadius: "12px"
                        }}
                      >
                        {badgeSt.label}
                      </span>
                    </div>

                    <h4 className={styles.ticketTitle}>{t.titulo}</h4>

                    <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span><User size={13} style={{ display: "inline", marginRight: "4px" }} /> {t.usuarioNome} ({t.usuarioEmail})</span>
                      <span>•</span>
                      <span><Clock size={13} style={{ display: "inline", marginRight: "4px" }} /> {t.dataCriacao}</span>
                    </div>

                    <div className={styles.descricaoBox}>
                      <span style={{ fontSize: "10.5px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                        📄 Relato Inicial do Aluno:
                      </span>
                      {t.descricao}
                    </div>

                    {/* ANEXO SE HOUVER */}
                    {t.anexoUrl && (
                      <div style={{ marginTop: "12px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                          📎 Anexo Enviado:
                        </span>
                        {t.anexoTipo === "video" ? (
                          <video src={t.anexoUrl} controls className={styles.previewVideo} style={{ maxHeight: "200px" }} />
                        ) : (
                          <img src={t.anexoUrl} alt="Anexo do ticket" className={styles.previewImg} style={{ maxHeight: "200px" }} />
                        )}
                      </div>
                    )}

                    {/* MOTIVO SE FOI REJEITADO */}
                    {t.status === "Rejeitado" && t.motivoRejeicao && (
                      <div style={{
                        marginTop: "12px",
                        backgroundColor: "rgba(239, 68, 68, 0.12)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#f87171",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        fontSize: "12.5px"
                      }}>
                        <strong>Motivo da Rejeição:</strong> {t.motivoRejeicao}
                      </div>
                    )}

                    {/* BARRA DE AÇÕES DE TRIAGEM (APROVAR OU REJEITAR) */}
                    {subAbaCorreio === "pendentes" && (
                      <div style={{
                        marginTop: "16px",
                        paddingTop: "14px",
                        borderTop: "1px solid #1e293b",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                      }}>
                        {!isRejeitando ? (
                          <div style={{ display: "flex", gap: "12px" }}>
                            <button
                              onClick={() => handleAprovarTicket(t.id)}
                              style={{
                                flex: 1,
                                backgroundColor: "#10b981",
                                color: "#FFF",
                                border: "none",
                                borderRadius: "12px",
                                padding: "12px",
                                fontWeight: "800",
                                fontSize: "13px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)"
                              }}
                            >
                              <CheckCircle2 size={18} /> ✅ Aprovar Ticket (Enviar p/ Admin)
                            </button>

                            <button
                              onClick={() => { setTicketRejeitandoId(t.id); setMotivoRejeicaoInput(""); }}
                              style={{
                                flex: 1,
                                backgroundColor: "rgba(239, 68, 68, 0.15)",
                                color: "#ef4444",
                                border: "1px solid rgba(239, 68, 68, 0.4)",
                                borderRadius: "12px",
                                padding: "12px",
                                fontWeight: "800",
                                fontSize: "13px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px"
                              }}
                            >
                              <XCircle size={18} /> ❌ Rejeitar Ticket
                            </button>
                          </div>
                        ) : (
                          <div style={{
                            backgroundColor: "rgba(239, 68, 68, 0.08)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            borderRadius: "14px",
                            padding: "14px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                          }}>
                            <div style={{ fontSize: "12px", fontWeight: "800", color: "#f87171" }}>
                              Motivo da Rejeição do Ticket #{t.id}:
                            </div>
                            <input 
                              type="text"
                              className={styles.input}
                              placeholder="Digite por que este ticket está sendo rejeitado..."
                              value={motivoRejeicaoInput}
                              onChange={(e) => setMotivoRejeicaoInput(e.target.value)}
                              autoFocus
                            />
                            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                              <button
                                onClick={() => setTicketRejeitandoId(null)}
                                style={{
                                  padding: "8px 14px", borderRadius: "10px",
                                  border: "1px solid #334155", backgroundColor: "transparent",
                                  color: "#94a3b8", fontSize: "12px", fontWeight: "700", cursor: "pointer"
                                }}
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => handleConfirmarRejeicao(t.id)}
                                style={{
                                  padding: "8px 16px", borderRadius: "10px",
                                  border: "none", backgroundColor: "#ef4444",
                                  color: "#FFF", fontSize: "12px", fontWeight: "800", cursor: "pointer"
                                }}
                              >
                                Confirmar Rejeição
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* BARRA DE RE-APROVAÇÃO PARA REJEITADOS */}
                    {subAbaCorreio === "rejeitados" && (
                      <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #1e293b", display: "flex", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleReavaliarTicket(t.id)}
                          style={{
                            backgroundColor: "rgba(59, 130, 246, 0.15)",
                            color: "#3b82f6",
                            border: "1px solid rgba(59, 130, 246, 0.35)",
                            borderRadius: "10px",
                            padding: "8px 14px",
                            fontWeight: "800",
                            fontSize: "12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                        >
                          <RotateCcw size={14} /> 🔄 Reavaliar e Aprovar Ticket
                        </button>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2 & 3: LISTA DE MEUS TICKETS OU GESTÃO ADMIN ATIVOS */}
      {(abaAtiva === "meus_tickets" || abaAtiva === "todos") && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          
          {/* PAINEL DE MÉTRICAS DO SUPERADMIN */}
          {abaAtiva === "todos" && isAdmin && (
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{totalTickets}</span>
                <span className={styles.statLabel}>Total Tickets</span>
              </div>
              <div className={styles.statCard} style={{ borderColor: "rgba(245, 158, 11, 0.4)" }}>
                <span className={styles.statValue} style={{ color: "#f59e0b" }}>{countAbertos}</span>
                <span className={styles.statLabel}>🟡 Abertos</span>
              </div>
              <div className={styles.statCard} style={{ borderColor: "rgba(59, 130, 246, 0.4)" }}>
                <span className={styles.statValue} style={{ color: "#3b82f6" }}>{countAnalise}</span>
                <span className={styles.statLabel}>🔵 Em Análise</span>
              </div>
              <div className={styles.statCard} style={{ borderColor: "rgba(16, 185, 129, 0.4)" }}>
                <span className={styles.statValue} style={{ color: "#10b981" }}>{countResolvidos}</span>
                <span className={styles.statLabel}>🟢 Resolvidos</span>
              </div>
              <div className={styles.statCard} style={{ borderColor: "rgba(239, 68, 68, 0.4)" }}>
                <span className={styles.statValue} style={{ color: "#ef4444" }}>{countBugs}</span>
                <span className={styles.statLabel}>🐛 Bugs</span>
              </div>
            </div>
          )}

          {/* BARRA DE PESQUISA & DUAL FILTRO */}
          <div style={{
            backgroundColor: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "18px",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#f8fafc", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                {abaAtiva === "todos" ? "🛡️ Gestão de Tickets dos Alunos" : "📋 Seus Tickets Enviados"}
              </h3>

              {/* INPUT DE BUSCA */}
              <div style={{ position: "relative", minWidth: "240px", flex: 1, maxWidth: "340px" }}>
                <Search size={16} color="#64748b" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                <input 
                  type="text"
                  placeholder="Pesquisar por título, e-mail ou #TKT..."
                  className={styles.input}
                  style={{ paddingLeft: "36px", fontSize: "12.5px" }}
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
              </div>
            </div>

            {/* SELETORES DE FILTRO DE TIPO E STATUS */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", borderTop: "1px solid #1e293b", paddingTop: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8" }}>Tipo:</span>
                <select 
                  className={styles.select}
                  style={{ padding: "6px 12px", fontSize: "12px", width: "auto" }}
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                >
                  <option value="todos">Todos os Tipos</option>
                  <option value="bug">🐛 Bugs / Falhas</option>
                  <option value="melhoria">💡 Sugestões de Melhoria</option>
                  <option value="duvida">❓ Dúvidas Técnicas</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8" }}>Status:</span>
                <select 
                  className={styles.select}
                  style={{ padding: "6px 12px", fontSize: "12px", width: "auto" }}
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                >
                  <option value="todos">Todos os Status</option>
                  <option value="aberto">🟡 Abertos</option>
                  <option value="em análise">🔵 Em Análise</option>
                  <option value="resolvido">🟢 Resolvidos</option>
                </select>
              </div>

              {(filtroTipo !== "todos" || filtroStatus !== "todos" || termoBusca) && (
                <button
                  onClick={() => { setFiltroTipo("todos"); setFiltroStatus("todos"); setTermoBusca(""); }}
                  style={{
                    padding: "6px 12px", borderRadius: "10px", border: "1px solid #334155",
                    backgroundColor: "transparent", color: "#ef4444", fontSize: "12px",
                    fontWeight: "700", cursor: "pointer"
                  }}
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>

          {/* LISTAGEM DOS TICKETS */}
          <div className={styles.ticketsList}>
            {listagemTicketsExibida().length === 0 ? (
              <div className={styles.emptyWrap}>
                <Ticket size={40} color="#64748b" />
                <h4 style={{ color: "#f8fafc", margin: "8px 0 4px 0" }}>Nenhum ticket encontrado</h4>
                <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                  Tente alterar os filtros de busca ou abra uma nova solicitação.
                </p>
              </div>
            ) : (
              listagemTicketsExibida().map((t) => {
                const badgeSt = getBadgeStatusStyle(t.status);

                return (
                  <div key={t.id} className={styles.ticketCard}>
                    {/* CABEÇALHO DO CARD */}
                    <div className={styles.ticketCardHeader}>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                        <span className={styles.ticketId}>{t.id}</span>
                        <span className={styles.typeBadge}>{t.tipoLabel}</span>
                        <span className={styles.prioridadeBadge}>{t.prioridadeLabel}</span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span 
                          style={{
                            backgroundColor: badgeSt.bg,
                            color: badgeSt.color,
                            border: `1px solid ${badgeSt.border}`,
                            fontSize: "11px",
                            fontWeight: "800",
                            padding: "4px 12px",
                            borderRadius: "12px"
                          }}
                        >
                          {badgeSt.label}
                        </span>

                        {isAdmin && (
                          <button
                            onClick={() => handleExcluirTicket(t.id)}
                            style={{
                              background: "transparent", border: "none",
                              color: "#ef4444", cursor: "pointer", padding: "4px"
                            }}
                            title="Excluir Ticket"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    <h4 className={styles.ticketTitle}>{t.titulo}</h4>

                    <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span><User size={13} style={{ display: "inline", marginRight: "4px" }} /> {t.usuarioNome} ({t.usuarioEmail})</span>
                      <span>•</span>
                      <span><Clock size={13} style={{ display: "inline", marginRight: "4px" }} /> {t.dataCriacao}</span>
                    </div>

                    <div className={styles.descricaoBox}>
                      <span style={{ fontSize: "10.5px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                        📄 Relato do Aluno:
                      </span>
                      {t.descricao}
                    </div>

                    {/* ANEXO SE HOUVER */}
                    {t.anexoUrl && (
                      <div style={{ marginTop: "12px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                          📎 Anexo Enviado:
                        </span>
                        {t.anexoTipo === "video" ? (
                          <video src={t.anexoUrl} controls className={styles.previewVideo} style={{ maxHeight: "200px" }} />
                        ) : (
                          <img src={t.anexoUrl} alt="Anexo do ticket" className={styles.previewImg} style={{ maxHeight: "200px" }} />
                        )}
                      </div>
                    )}

                    {/* MOTIVO DE REJEIÇÃO EXIBIDO AO ALUNO */}
                    {t.status === "Rejeitado" && t.motivoRejeicao && (
                      <div style={{
                        marginTop: "12px",
                        backgroundColor: "rgba(239, 68, 68, 0.12)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#f87171",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        fontSize: "12.5px"
                      }}>
                        <strong>Motivo da Rejeição:</strong> {t.motivoRejeicao}
                      </div>
                    )}

                    {/* THREAD DE MENSAGENS / RESPOSTAS */}
                    <div style={{ marginTop: "20px" }}>
                      {/* Header do histórico */}
                      <div style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        marginBottom: "14px", paddingBottom: "12px",
                        borderBottom: "1px solid rgba(255,255,255,0.07)"
                      }}>
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "8px",
                          background: "rgba(59,130,246,0.15)",
                          border: "1px solid rgba(59,130,246,0.3)",
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          <MessageSquare size={14} color="#3b82f6" />
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: "800", color: "#cbd5e1" }}>
                          Histórico de Atendimento
                        </span>
                        {t.mensagens?.length > 0 && (
                          <span style={{
                            background: "rgba(59,130,246,0.2)", color: "#38bdf8",
                            border: "1px solid rgba(59,130,246,0.35)",
                            fontSize: "11px", fontWeight: "800",
                            padding: "2px 8px", borderRadius: "20px"
                          }}>
                            {t.mensagens.length}
                          </span>
                        )}
                      </div>

                      {/* Mensagens */}
                      {t.mensagens && t.mensagens.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                          {t.mensagens.map((msg) => {
                            const isMsgAdmin = msg.role === "admin";
                            const isSystem = msg.autor === "Sistema DevHub";

                            if (isSystem) {
                              return (
                                <div key={msg.id} style={{
                                  display: "flex", alignItems: "center", gap: "10px",
                                  padding: "10px 14px",
                                  background: "rgba(16,185,129,0.08)",
                                  border: "1px solid rgba(16,185,129,0.2)",
                                  borderRadius: "12px"
                                }}>
                                  <CheckCircle size={14} color="#10b981" style={{ flexShrink: 0 }} />
                                  <div style={{ flex: 1 }}>
                                    <span style={{ fontSize: "12.5px", color: "#6ee7b7", fontWeight: "600" }}>
                                      {msg.texto}
                                    </span>
                                  </div>
                                  <span style={{ fontSize: "10.5px", color: "#475569", whiteSpace: "nowrap" }}>{msg.data}</span>
                                </div>
                              );
                            }

                            return (
                              <div key={msg.id} style={{
                                display: "flex",
                                flexDirection: isMsgAdmin ? "row-reverse" : "row",
                                gap: "10px", alignItems: "flex-start"
                              }}>
                                {/* Avatar */}
                                <div style={{
                                  width: "34px", height: "34px", borderRadius: "10px", flexShrink: 0,
                                  background: isMsgAdmin
                                    ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                                    : "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: "13px", fontWeight: "900", color: "#fff",
                                  boxShadow: isMsgAdmin ? "0 4px 12px rgba(168,85,247,0.35)" : "0 4px 12px rgba(59,130,246,0.3)"
                                }}>
                                  {isMsgAdmin ? "🛡️" : msg.autor.charAt(0).toUpperCase()}
                                </div>

                                {/* Bolha */}
                                <div style={{ maxWidth: "75%", display: "flex", flexDirection: "column", gap: "4px" }}>
                                  <div style={{
                                    display: "flex", alignItems: "center", gap: "6px",
                                    flexDirection: isMsgAdmin ? "row-reverse" : "row"
                                  }}>
                                    <span style={{
                                      fontSize: "11.5px", fontWeight: "800",
                                      color: isMsgAdmin ? "#c084fc" : "#38bdf8"
                                    }}>
                                      {isMsgAdmin ? "🛡️ Suporte DevHub" : msg.autor}
                                    </span>
                                    <span style={{ fontSize: "10.5px", color: "#475569" }}>{msg.data}</span>
                                  </div>
                                  <div style={{
                                    padding: "11px 15px",
                                    borderRadius: isMsgAdmin ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                                    background: isMsgAdmin
                                      ? "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.15))"
                                      : "rgba(30,41,59,0.9)",
                                    border: isMsgAdmin
                                      ? "1px solid rgba(168,85,247,0.3)"
                                      : "1px solid rgba(51,65,85,0.8)",
                                    fontSize: "13px", color: "#e2e8f0", lineHeight: "1.6",
                                    boxShadow: isMsgAdmin
                                      ? "0 4px 16px rgba(124,58,237,0.15)"
                                      : "0 2px 8px rgba(0,0,0,0.2)"
                                  }}>
                                    {msg.texto}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div style={{
                          display: "flex", flexDirection: "column", alignItems: "center",
                          padding: "20px", gap: "8px", opacity: 0.5
                        }}>
                          <MessageSquare size={22} color="#475569" />
                          <span style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>
                            Nenhuma resposta ainda
                          </span>
                        </div>
                      )}

                      {/* CONTROLES: STATUS + RESPOSTA */}
                      <div style={{
                        borderTop: "1px solid rgba(255,255,255,0.07)",
                        paddingTop: "14px",
                        display: "flex", flexDirection: "column", gap: "12px"
                      }}>
                        {/* Botões de Status (Admin) */}
                        {isAdmin && (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <span style={{
                              fontSize: "11px", fontWeight: "700", color: "#64748b",
                              textTransform: "uppercase", letterSpacing: "0.06em"
                            }}>
                              Status:
                            </span>
                            {[
                              { label: "Aberto", color: "#f59e0b", bg: "rgba(245,158,11,0.15)", glow: "rgba(245,158,11,0.3)", emoji: "🟡" },
                              { label: "Em Análise", color: "#a855f7", bg: "rgba(168,85,247,0.15)", glow: "rgba(168,85,247,0.3)", emoji: "🔵" },
                              { label: "Resolvido", color: "#10b981", bg: "rgba(16,185,129,0.15)", glow: "rgba(16,185,129,0.3)", emoji: "✅" }
                            ].map(({ label, color, bg, glow, emoji }) => {
                              const isActive = t.status === label;
                              return (
                                <button
                                  key={label}
                                  onClick={() => handleAlterarStatus(t.id, label)}
                                  style={{
                                    padding: "6px 14px",
                                    borderRadius: "20px",
                                    border: `1px solid ${isActive ? color : "rgba(255,255,255,0.1)"}`,
                                    background: isActive ? bg : "transparent",
                                    color: isActive ? color : "#64748b",
                                    fontSize: "11.5px", fontWeight: "800", cursor: "pointer",
                                    display: "flex", alignItems: "center", gap: "5px",
                                    transition: "all 0.2s ease",
                                    boxShadow: isActive ? `0 0 12px ${glow}` : "none"
                                  }}
                                >
                                  {emoji} {label}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Input de Resposta */}
                        {t.status !== "Resolvido" && t.status !== "Rejeitado" && (
                          <div style={{
                            display: "flex", gap: "8px", alignItems: "center",
                            background: "rgba(15,23,42,0.6)",
                            border: "1px solid rgba(51,65,85,0.8)",
                            borderRadius: "14px", padding: "6px 6px 6px 14px",
                            transition: "border-color 0.2s ease"
                          }}>
                            <div style={{
                              width: "28px", height: "28px", borderRadius: "8px",
                              background: isAdmin
                                ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                                : "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "12px", flexShrink: 0
                            }}>
                              {isAdmin ? "🛡️" : "💬"}
                            </div>
                            <input
                              type="text"
                              style={{
                                flex: 1, background: "transparent", border: "none",
                                outline: "none", color: "#e2e8f0", fontSize: "13px",
                                fontFamily: "inherit"
                              }}
                              placeholder={isAdmin ? "Escreva uma resposta oficial..." : "Adicionar comentário..."}
                              value={mensagemInputs[t.id] || ""}
                              onChange={(e) => setMensagemInputs({ ...mensagemInputs, [t.id]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleEnviarMensagem(t.id);
                              }}
                            />
                            <button
                              onClick={() => handleEnviarMensagem(t.id)}
                              style={{
                                width: "36px", height: "36px", borderRadius: "10px",
                                border: "none",
                                background: mensagemInputs[t.id]?.trim()
                                  ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                                  : "rgba(51,65,85,0.6)",
                                color: mensagemInputs[t.id]?.trim() ? "#fff" : "#475569",
                                cursor: mensagemInputs[t.id]?.trim() ? "pointer" : "default",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.2s ease",
                                flexShrink: 0,
                                boxShadow: mensagemInputs[t.id]?.trim() ? "0 4px 12px rgba(59,130,246,0.4)" : "none"
                              }}
                            >
                              <Send size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

    </div>
  );

  if (isOpen !== undefined) {
    if (!isOpen) return null;
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
        zIndex: 9999, display: "flex", justifyContent: "center",
        alignItems: "center", padding: "24px"
      }} onClick={onClose}>
        <div style={{
          background: "#0b0f19",
          border: "1px solid rgba(59,130,246,0.3)",
          width: "100%", maxWidth: "900px", maxHeight: "90vh",
          borderRadius: "24px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
          color: "#f8fafc", overflowY: "auto", padding: "28px",
          display: "flex", flexDirection: "column", gap: "24px"
        }} onClick={(e) => e.stopPropagation()}>
          {contentJSX}
        </div>
      </div>
    );
  }

  return contentJSX;
}
