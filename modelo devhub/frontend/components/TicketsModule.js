import React, { useState, useEffect } from "react";
import styles from "./TicketsModule.module.css";
import { 
  LifeBuoy, PlusCircle, Ticket, Bug, Lightbulb, HelpCircle, 
  Upload, X, CheckCircle, AlertTriangle, Clock, MessageSquare, 
  Send, User, Mail, ShieldCheck, ChevronRight, Play, Image as ImageIcon,
  Search, Filter, Check, CheckCheck, RotateCcw, Trash2
} from "lucide-react";

const TICKETS_PADRAO = [
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
  const [abaAtiva, setAbaAtiva] = useState("criar"); // 'criar', 'meus_tickets', 'todos'
  const [tickets, setTickets] = useState([]);
  
  // Filtros avançados para o SuperAdmin / Usuário
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [termoBusca, setTermoBusca] = useState("");

  // Input de mensagens indexado por ticketId
  const [mensagemInputs, setMensagemInputs] = useState({});

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

  // Criar novo Ticket
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
      status: "Aberto",
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

    setSucessoMsg(`🎉 Ticket ${novoTicket.id} aberto com sucesso!`);
    setTimeout(() => {
      setSucessoMsg(null);
      setAbaAtiva("meus_tickets");
    }, 1500);
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

  // Alterar Status do Ticket
  const handleAlterarStatus = (ticketId, novoStatus) => {
    const atualizados = tickets.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: novoStatus };
      }
      return t;
    });
    salvarTickets(atualizados);
  };

  // Reabrir Ticket
  const handleReabrirTicket = (ticketId) => {
    const msgReabrir = {
      id: `msg-${Date.now()}`,
      autor: userName,
      email: userEmail,
      role: isAdmin ? "admin" : "aluno",
      texto: "🔄 Ticket reaberto para nova revisão.",
      data: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    };

    const atualizados = tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: "Aberto",
          mensagens: [...(t.mensagens || []), msgReabrir]
        };
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

  // Filtragem avançada e busca
  const listagemTicketsExibida = () => {
    let lista = abaAtiva === "todos" ? tickets : meusTickets;

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

  // Estatísticas do Admin
  const totalTickets = tickets.length;
  const countAbertos = tickets.filter(t => t.status === "Aberto").length;
  const countAnalise = tickets.filter(t => t.status === "Em Análise").length;
  const countResolvidos = tickets.filter(t => t.status === "Resolvido").length;
  const countBugs = tickets.filter(t => t.tipo === "bug").length;

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
          {/* NAU TABS */}
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
            {isAdmin && (
              <button 
                className={`${styles.tabBtn} ${abaAtiva === "todos" ? styles.tabBtnActive : ""}`}
                onClick={() => setAbaAtiva("todos")}
                style={{ borderColor: "#a855f7" }}
              >
                <ShieldCheck size={15} color="#a855f7" /> Admin ({tickets.length})
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
          {/* BANNER COM DADOS AUTOMÁTICOS DO USUÁRIO */}
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
                placeholder="Descreva detalhadamente o que aconteceu, os passos para reproduzir o problema ou a melhoria que você gostaria de ver..."
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
              <Send size={16} /> Enviar Ticket de Suporte
            </button>
          </form>
        </div>
      )}

      {/* TAB 2 & 3: LISTA DE MEUS TICKETS OU GESTÃO ADMIN */}
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
                  ✕ Limpar Filtros
                </button>
              )}
            </div>
          </div>

          {/* GRID DE CARDS DE TICKETS */}
          <div className={styles.ticketsGrid}>
            {listagemTicketsExibida().length === 0 ? (
              <div style={{ padding: "36px", textAlign: "center", backgroundColor: "#0f172a", borderRadius: "18px", border: "1px solid #1e293b", color: "#94a3b8" }}>
                <Ticket size={32} color="#64748b" style={{ marginBottom: "8px" }} />
                <p style={{ fontSize: "14px", fontWeight: "700", margin: 0 }}>Nenhum ticket encontrado com os filtros aplicados.</p>
              </div>
            ) : (
              listagemTicketsExibida().map((t) => {
                const mensagensThread = t.mensagens || [];

                return (
                  <div key={t.id} className={styles.ticketCard}>
                    
                    {/* CABEÇALHO DO TICKET */}
                    <div className={styles.ticketHeader}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span className={styles.ticketId}>{t.id}</span>
                          <span className={styles.badge} style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#cbd5e1", border: "1px solid #334155" }}>
                            {t.tipoLabel}
                          </span>
                          <span className={styles.badge} style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#cbd5e1", border: "1px solid #334155" }}>
                            {t.prioridadeLabel}
                          </span>
                        </div>

                        <h4 className={styles.ticketTitle}>{t.titulo}</h4>
                        <p style={{ fontSize: "11.5px", color: "#64748b", margin: "4px 0 0 0" }}>
                          👤 <strong>{t.usuarioNome}</strong> ({t.usuarioEmail}) • ⏰ {t.dataCriacao}
                        </p>
                      </div>

                      {/* STATUS BADGE */}
                      <span className={`${styles.badge} ${
                        t.status === "Resolvido" 
                          ? styles.statusResolvido 
                          : t.status === "Em Análise" 
                          ? styles.statusAnalise 
                          : styles.statusAberto
                      }`}>
                        {t.status === "Resolvido" ? "🟢 Resolvido" : t.status === "Em Análise" ? "🔵 Em Análise" : "🟡 Aberto"}
                      </span>
                    </div>

                    {/* DESCRIÇÃO DA SOLICITAÇÃO INICIAL */}
                    <div>
                      <p style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", marginBottom: "4px", textTransform: "uppercase" }}>
                        📝 Relato Inicial do Aluno:
                      </p>
                      <p className={styles.ticketDesc}>{t.descricao}</p>
                    </div>

                    {/* ANEXO DE IMAGEM/VÍDEO SE HOUVER */}
                    {t.anexoUrl && (
                      <div>
                        <p style={{ fontSize: "11px", fontWeight: "800", color: "#38bdf8", marginBottom: "4px", textTransform: "uppercase" }}>
                          📎 Arquivo Anexado pelo Aluno:
                        </p>
                        <div className={styles.previewWrap}>
                          {t.anexoTipo === "video" ? (
                            <video src={t.anexoUrl} controls className={styles.previewVideo} />
                          ) : (
                            <img src={t.anexoUrl} alt="Anexo do ticket" className={styles.previewImg} />
                          )}
                        </div>
                      </div>
                    )}

                    {/* HISTÓRICO DE MENSAGENS E CHAT DE CONVERSA */}
                    {mensagensThread.length > 0 && (
                      <div className={styles.messagesThread}>
                        <p style={{ fontSize: "11px", fontWeight: "800", color: "#a855f7", margin: "0 0 4px 0", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
                          💬 Histórico de Mensagens ({mensagensThread.length}):
                        </p>
                        {mensagensThread.map((msg) => (
                          <div key={msg.id} className={`${styles.msgBubble} ${msg.role === "admin" ? styles.msgAdmin : styles.msgAluno}`}>
                            <div className={styles.msgHeader}>
                              <span className={msg.role === "admin" ? styles.msgAutorAdmin : styles.msgAutorAluno}>
                                {msg.role === "admin" ? "🛡️ Equipe DevHub (Admin)" : `👤 ${msg.autor}`}
                              </span>
                              <span style={{ color: "#64748b", fontSize: "10.5px" }}>{msg.data}</span>
                            </div>
                            <div style={{ whiteSpace: "pre-line" }}>{msg.texto}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CAMPOS DE RESPOSTA E ENVIAR MENSAGEM */}
                    <div style={{ marginTop: "6px" }}>
                      <p style={{ fontSize: "11.5px", fontWeight: "800", color: "#3b82f6", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                        💬 Escrever Mensagem na Conversa:
                      </p>
                      
                      <div className={styles.replyForm}>
                        <input 
                          type="text"
                          placeholder="Digite sua mensagem e clique em Enviar ou pressione Enter..."
                          className={styles.replyInput}
                          value={mensagemInputs[t.id] || ""}
                          onChange={(e) => setMensagemInputs({ ...mensagemInputs, [t.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleEnviarMensagem(t.id);
                            }
                          }}
                        />

                        <button 
                          type="button"
                          className={styles.btnReplySend}
                          onClick={() => handleEnviarMensagem(t.id)}
                        >
                          <Send size={15} /> Enviar Mensagem
                        </button>
                      </div>
                    </div>

                    {/* AÇÕES DE STATUS E RESOLUÇÃO DO TICKET */}
                    <div className={styles.adminControlBar}>
                      {t.status === "Resolvido" && (
                        <div style={{
                          width: "100%", padding: "10px 14px", borderRadius: "12px",
                          backgroundColor: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)",
                          color: "#10b981", fontSize: "12px", fontWeight: "700", display: "flex",
                          alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px"
                        }}>
                          <span>🟢 Este ticket foi marcado como Resolvido! Se o problema persistir, você pode reabri-lo.</span>
                        </div>
                      )}

                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {t.status === "Resolvido" && (
                            <button
                              onClick={() => handleReabrirTicket(t.id)}
                              style={{
                                padding: "7px 14px", borderRadius: "10px",
                                backgroundColor: "rgba(59,130,246,0.2)", color: "#38bdf8",
                                border: "1px solid rgba(59,130,246,0.4)", fontWeight: "800",
                                cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px"
                              }}
                            >
                              <RotateCcw size={14} /> Reabrir Ticket
                            </button>
                          )}

                          <button
                            onClick={() => handleExcluirTicket(t.id)}
                            style={{
                              padding: "7px 14px", borderRadius: "10px",
                              backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444",
                              border: "1px solid rgba(239, 68, 68, 0.3)", fontWeight: "700",
                              cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px"
                            }}
                          >
                            <Trash2 size={14} /> Excluir Ticket
                          </button>
                        </div>

                        {isAdmin && abaAtiva === "todos" && (
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            <button
                              onClick={() => handleAlterarStatus(t.id, "Aberto")}
                              style={{
                                padding: "6px 12px", borderRadius: "8px",
                                backgroundColor: t.status === "Aberto" ? "rgba(245,158,11,0.25)" : "#1e293b",
                                color: "#f59e0b", border: "1px solid rgba(245,158,11,0.4)",
                                fontWeight: "700", cursor: "pointer", fontSize: "11px"
                              }}
                            >
                              🟡 Aberto
                            </button>

                            <button
                              onClick={() => handleAlterarStatus(t.id, "Em Análise")}
                              style={{
                                padding: "6px 12px", borderRadius: "8px",
                                backgroundColor: t.status === "Em Análise" ? "rgba(59,130,246,0.25)" : "#1e293b",
                                color: "#38bdf8", border: "1px solid rgba(59,130,246,0.4)",
                                fontWeight: "700", cursor: "pointer", fontSize: "11px"
                              }}
                            >
                              🔵 Em Análise
                            </button>

                            <button
                              onClick={() => handleAlterarStatus(t.id, "Resolvido")}
                              style={{
                                padding: "6px 12px", borderRadius: "8px",
                                backgroundColor: t.status === "Resolvido" ? "rgba(16,185,129,0.25)" : "#1e293b",
                                color: "#10b981", border: "1px solid rgba(16,185,129,0.4)",
                                fontWeight: "700", cursor: "pointer", fontSize: "11px"
                              }}
                            >
                              🟢 Resolvido
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
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          {contentJSX}
        </div>
      </div>
    );
  }

  return contentJSX;
}
