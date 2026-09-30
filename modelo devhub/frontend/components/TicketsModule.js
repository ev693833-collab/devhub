import React, { useState, useEffect, useRef } from "react";
import styles from "./TicketsModule.module.css";
import { 
  LifeBuoy, PlusCircle, Ticket, Bug, Lightbulb, HelpCircle, Headphones,
  Upload, X, CheckCircle, AlertTriangle, Clock, MessageSquare, 
  Send, User, Mail, ShieldCheck, ChevronRight, ChevronDown, Play, Image as ImageIcon, Video,
  Search, Filter, Check, CheckCheck, RotateCcw, Trash2, Inbox, CheckCircle2, XCircle, AlertCircle,
  Eye, Edit3, ExternalLink, Calendar, Paperclip, Bold, Italic, Code, Link2, List, Quote, Heading2,
  LayoutGrid, Table, Smile, Hash, FileText, MoreVertical, Reply
} from "lucide-react";

const TICKETS_PADRAO = [
  {
    id: "ONETY-1283",
    solicitacaoNum: "#7831",
    usuarioNome: "Enzo Vieira",
    usuarioEmail: "enzovieira.contabhub@gmail.com",
    baseNome: "ContabHub",
    responsavel: "Sem responsável",
    tipo: "bug",
    tipoLabel: "🐛 Bug / Falha no Sistema",
    prioridade: "media",
    prioridadeLabel: "Média",
    dificuldade: "-",
    modulo: "Processos",
    titulo: "Erro CSRF ao substituir o certificado",
    descricao: "Nenhuma descrição fornecida.",
    anexoUrl: null,
    anexoTipo: null,
    anexoNome: null,
    status: "Pendente",
    mensagens: [],
    dataCriacao: "25/09/2026, 12:02",
    prazo: "25/10/2026",
    concluidoEm: "Não concluído"
  },
  {
    id: "ONETY-1020",
    solicitacaoNum: "#7832",
    usuarioNome: "Nicholas Araujo",
    usuarioEmail: "nicholas.araujo@devhub.com",
    baseNome: "DevHub",
    responsavel: "Sem responsável",
    tipo: "bug",
    tipoLabel: "🐛 Bug / Falha no Sistema",
    prioridade: "alta",
    prioridadeLabel: "Alta",
    dificuldade: "Média",
    modulo: "Playground",
    titulo: "Falha na resposta do console no simulador web",
    descricao: "Ao tentar executar o código no playground em tela pequena, o console não abre e retorna mensagem vazia.",
    anexoUrl: null,
    anexoTipo: null,
    anexoNome: null,
    status: "Pendente",
    mensagens: [],
    dataCriacao: "08/09/2026, 00:45",
    prazo: "25/10/2026",
    concluidoEm: "Não concluído"
  },
  {
    id: "ONETY-1001",
    solicitacaoNum: "#7820",
    usuarioNome: "Enzo Vieira",
    usuarioEmail: "enzovieira.contabhub@gmail.com",
    baseNome: "ContabHub",
    responsavel: "Sem responsável",
    tipo: "bug",
    tipoLabel: "🐛 Bug / Falha no Sistema",
    prioridade: "alta",
    prioridadeLabel: "Alta",
    dificuldade: "Fácil",
    modulo: "Terminal",
    titulo: "Erro ao tentar abrir terminal no playground",
    descricao: "Ao clicar no botão de executar código no playground em dispositivos menores, a resposta do console demora para renderizar.",
    anexoUrl: null,
    anexoTipo: null,
    anexoNome: null,
    status: "Resolvido",
    mensagens: [
      {
        id: "msg-1",
        autor: "Suporte DevHub",
        email: "suporte@devhub.com",
        role: "admin",
        isSupport: true,
        texto: "Corrigido na atualização v2.4! O leitor do console foi otimizado para mobile.",
        data: "05/09/2026 15:10"
      }
    ],
    dataCriacao: "05/09/2026, 14:30",
    prazo: "15/09/2026",
    concluidoEm: "05/09/2026"
  },
  {
    id: "ONETY-1002",
    solicitacaoNum: "#7815",
    usuarioNome: "Enzo Vieira",
    usuarioEmail: "enzovieira.contabhub@gmail.com",
    baseNome: "DevHub",
    responsavel: "Sem responsável",
    tipo: "melhoria",
    tipoLabel: "💡 Sugestão de Melhoria",
    prioridade: "media",
    prioridadeLabel: "Média",
    dificuldade: "-",
    modulo: "Aulas",
    titulo: "Adicionar filtro de busca por assuntos nas aulas",
    descricao: "Seria excelente poder filtrar as aulas e módulos por temas como Frontend, Backend e Banco de Dados.",
    anexoUrl: null,
    anexoTipo: null,
    anexoNome: null,
    status: "Em Análise",
    mensagens: [
      {
        id: "msg-2",
        autor: "Suporte DevHub",
        email: "suporte@devhub.com",
        role: "admin",
        isSupport: true,
        texto: "Ótima sugestão! Já implementamos o filtro por áreas nas aulas.",
        data: "06/09/2026 11:00"
      }
    ],
    dataCriacao: "06/09/2026, 10:15",
    prazo: "30/09/2026",
    concluidoEm: "Não concluído"
  }
];

export default function TicketsModule({ user, isOpen, onClose, modoAdmin = false, defaultAba }) {
  const [abaAtiva, setAbaAtiva] = useState(defaultAba || (modoAdmin ? "todos" : "criar")); // 'criar', 'meus_tickets', 'correio', 'todos'
  const [subAbaCorreio, setSubAbaCorreio] = useState("pendentes"); // 'pendentes', 'rejeitados'
  const [tickets, setTickets] = useState([]);
  const [chatAbertoMap, setChatAbertoMap] = useState({});
  
  // Modo de visualização: Tabela x Seções
  const [viewMode, setViewMode] = useState("tabela"); // 'tabela' | 'secoes'

  // Drawer modal estado
  const [drawerTicket, setDrawerTicket] = useState(null);
  const [drawerTab, setDrawerTab] = useState("detalhes"); // 'detalhes', 'comentarios', 'historico'
  const [editorTab, setEditorTab] = useState("escrever"); // 'escrever', 'preview'
  const [novoComentarioDrawer, setNovoComentarioDrawer] = useState("");
  const [mencionarUser, setMencionarUser] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Estado dos 3 pontinhos e edição de comentários
  const [menuAbertoComentarioId, setMenuAbertoComentarioId] = useState(null);
  const [editandoComentarioId, setEditandoComentarioId] = useState(null);
  const [textoEdicaoComentario, setTextoEdicaoComentario] = useState("");
  const [respondingToComment, setRespondingToComment] = useState(null);

  const commentTextareaRef = useRef(null);
  const commentImageInputRef = useRef(null);
  const EMOJIS_POPULARES = ["😊", "👍", "🚀", "💬", "✅", "🔥", "❓", "🐞", "💡", "👏", "❤️", "🙏"];

  const MENSAGENS_PRONTAS_PADRAO = [
    {
      id: "solucao",
      titulo: "✅ Solução Confirmada",
      texto: "Olá! Analisamos a sua solicitação e o problema foi corrigido na versão mais recente do sistema. Por favor, faça um teste e nos confirme se está tudo funcionando!"
    },
    {
      id: "investigacao",
      titulo: "⏳ Em Investigação",
      texto: "Olá! Recebemos o seu ticket e a nossa equipe técnica já está analisando o caso com prioridade. Em breve retornaremos com mais detalhes."
    },
    {
      id: "dados",
      titulo: "🔍 Solicitar Prints/Dados",
      texto: "Olá! Para conseguirmos analisar a sua dúvida mais rapidamente, você poderia nos enviar um print da tela ou o código do erro retornado?"
    },
    {
      id: "sugestao",
      titulo: "💡 Sugestão Encaminhada",
      texto: "Muito obrigado por compartilhar essa sugestão! O seu feedback foi registrado e encaminhado para o time de produto avaliar a implementação."
    },
    {
      id: "escopo",
      titulo: "📌 Direcionamento ao Fórum",
      texto: "Olá! Para essa dúvida de conteúdo de aulas, você também pode postar no fórum da comunidade ou consultar o material de apoio na aba da aula."
    }
  ];

  const [mensagensProntas, setMensagensProntas] = useState(MENSAGENS_PRONTAS_PADRAO);
  const [showMensagensProntasBanner, setShowMensagensProntasBanner] = useState(false);
  const [criandoMensagemPronta, setCriandoMensagemPronta] = useState(false);
  const [novaMsgProntaTitulo, setNovaMsgProntaTitulo] = useState("");
  const [novaMsgProntaTexto, setNovaMsgProntaTexto] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("devhub_mensagens_prontas");
      if (saved) {
        setMensagensProntas(JSON.parse(saved));
      } else {
        localStorage.setItem("devhub_mensagens_prontas", JSON.stringify(MENSAGENS_PRONTAS_PADRAO));
      }
    } catch (e) {
      console.error("Erro ao carregar mensagens prontas:", e);
    }
  }, []);

  const handleSalvarNovaMensagemPronta = () => {
    if (!novaMsgProntaTitulo.trim() || !novaMsgProntaTexto.trim()) {
      alert("Por favor, preencha o título e o texto da mensagem pronta.");
      return;
    }
    const novaItem = {
      id: `custom-${Date.now()}`,
      titulo: novaMsgProntaTitulo.trim(),
      texto: novaMsgProntaTexto.trim(),
      custom: true
    };
    const atualizadas = [...mensagensProntas, novaItem];
    setMensagensProntas(atualizadas);
    try {
      localStorage.setItem("devhub_mensagens_prontas", JSON.stringify(atualizadas));
    } catch (e) {
      console.error(e);
    }
    setNovaMsgProntaTitulo("");
    setNovaMsgProntaTexto("");
    setCriandoMensagemPronta(false);
  };

  const handleExcluirMensagemPronta = (id, e) => {
    e.stopPropagation();
    const atualizadas = mensagensProntas.filter(m => m.id !== id);
    setMensagensProntas(atualizadas);
    try {
      localStorage.setItem("devhub_mensagens_prontas", JSON.stringify(atualizadas));
    } catch (err) {
      console.error(err);
    }
  };

  const inserirMarkdown = (prefix, suffix = "") => {
    const textarea = commentTextareaRef.current;
    if (!textarea) {
      setNovoComentarioDrawer(prev => prev + prefix + suffix);
      return;
    }
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const currentVal = novoComentarioDrawer;
    const hasSelection = start !== end;
    const selectedText = currentVal.substring(start, end);

    const isBlockPrefix = prefix.startsWith("##") || prefix.startsWith("-") || prefix.startsWith(">");

    let finalPrefix = prefix;
    let finalSuffix = suffix;
    let replacement = "";
    let newCursorPos = start;

    if (prefix === "[" && suffix === "](https://)") {
      if (hasSelection) {
        replacement = `[${selectedText}](https://exemplo.com)`;
        newCursorPos = start + selectedText.length + 11; // cursor inside https://exemplo.com
      } else {
        replacement = `[Texto do link](https://exemplo.com)`;
        newCursorPos = start + 1; // cursor inside 'Texto do link'
      }
    } else if (isBlockPrefix) {
      const isAtLineStart = start === 0 || currentVal.charAt(start - 1) === "\n";
      if (!isAtLineStart) {
        finalPrefix = "\n" + prefix;
      }
      if (hasSelection) {
        replacement = finalPrefix + selectedText + finalSuffix;
        newCursorPos = start + replacement.length;
      } else {
        replacement = finalPrefix + finalSuffix;
        newCursorPos = start + finalPrefix.length;
      }
    } else {
      if (hasSelection) {
        replacement = finalPrefix + selectedText + finalSuffix;
        newCursorPos = start + replacement.length;
      } else {
        replacement = finalPrefix + finalSuffix;
        newCursorPos = start + finalPrefix.length;
      }
    }

    const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    setNovoComentarioDrawer(newVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  const [commentAnexoUrl, setCommentAnexoUrl] = useState(null);
  const [commentAnexoNome, setCommentAnexoNome] = useState(null);
  const [commentAnexoTipo, setCommentAnexoTipo] = useState(null); // "imagem" ou "video"

  const handleCommentImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = (file.type && file.type.startsWith("video/")) || /\.(mp4|webm|mov|mkv|avi|m4v|ogv|3gp|flv)$/i.test(file.name);
    const isImage = (file.type && file.type.startsWith("image/")) || /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file.name);

    if (!isImage && !isVideo) {
      alert("Por favor, selecione um arquivo de imagem (PNG, JPG) ou vídeo (MP4, WebM, MOV, MKV).");
      e.target.value = "";
      return;
    }

    const LIMITE_IMAGEM_MB = 5;
    const LIMITE_VIDEO_MB = 15;
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);

    if (isImage && file.size > LIMITE_IMAGEM_MB * 1024 * 1024) {
      alert(`⚠️ Imagem muito pesada (${sizeInMB} MB)! O limite máximo permitido é ${LIMITE_IMAGEM_MB} MB para não sobrecarregar o sistema.`);
      e.target.value = "";
      return;
    }

    if (isVideo && file.size > LIMITE_VIDEO_MB * 1024 * 1024) {
      alert(`⚠️ Vídeo muito pesado (${sizeInMB} MB)! O limite máximo permitido é ${LIMITE_VIDEO_MB} MB para garantir a leveza da plataforma.`);
      e.target.value = "";
      return;
    }

    const fileType = isVideo ? "video" : "imagem";

    // Se o arquivo tiver mais de 4MB, usamos URL.createObjectURL para velocidade e leveza
    if (file.size > 4 * 1024 * 1024) {
      const blobUrl = URL.createObjectURL(file);
      setCommentAnexoUrl(blobUrl);
      setCommentAnexoNome(file.name);
      setCommentAnexoTipo(fileType);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setCommentAnexoUrl(reader.result);
        setCommentAnexoNome(file.name);
        setCommentAnexoTipo(fileType);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const parseInlineMarkdown = (str) => {
    if (!str || typeof str !== "string") return str;

    const parts = [];
    let key = 0;
    const regex = /(\*\*(.*?)\*\*|\*(.*?)\*|`(.*?)`|\[(.*?)\]\((.*?)\)|@([\w\.\-]+(?:\s[\w\.\-]+)?))/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }

      const fullMatch = match[0];
      if (fullMatch.startsWith("**") && fullMatch.endsWith("**")) {
        parts.push(
          <strong key={key++} style={{ color: "#f8fafc", fontWeight: "700" }}>
            {match[2]}
          </strong>
        );
      } else if (fullMatch.startsWith("*") && fullMatch.endsWith("*")) {
        parts.push(
          <em key={key++} style={{ fontStyle: "italic", color: "#e2e8f0", fontWeight: "600" }}>
            {match[3]}
          </em>
        );
      } else if (fullMatch.startsWith("`") && fullMatch.endsWith("`")) {
        parts.push(
          <code key={key++} style={{ background: "rgba(255,255,255,0.12)", color: "#38bdf8", padding: "2px 6px", borderRadius: "6px", fontSize: "12px", fontFamily: "monospace" }}>
            {match[4]}
          </code>
        );
      } else if (fullMatch.startsWith("[")) {
        parts.push(
          <a key={key++} href={match[6]} target="_blank" rel="noreferrer" style={{ color: "#60a5fa", textDecoration: "underline", fontWeight: "700" }}>
            {match[5]}
          </a>
        );
      } else if (fullMatch.startsWith("@")) {
        parts.push(
          <span key={key++} style={{ color: "#38bdf8", fontWeight: "800", background: "rgba(56, 189, 248, 0.15)", padding: "1px 6px", borderRadius: "6px" }}>
            {fullMatch}
          </span>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }

    return parts.length > 0 ? parts : str;
  };

  const parseMarkdownText = (text) => {
    if (!text) return null;
    const lines = String(text).split("\n");

    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("## ")) {
        const titleContent = trimmed.replace(/^##\s+/, "");
        return (
          <h4 key={idx} style={{ margin: "6px 0 4px 0", fontSize: "15px", fontWeight: "900", color: "#f8fafc" }}>
            {parseInlineMarkdown(titleContent)}
          </h4>
        );
      }

      if (trimmed.startsWith("> ")) {
        const quoteContent = trimmed.replace(/^>\s+/, "");
        return (
          <blockquote key={idx} style={{ margin: "4px 0", paddingLeft: "10px", borderLeft: "3px solid #10b981", color: "#94a3b8", fontStyle: "italic", fontSize: "12.5px" }}>
            {parseInlineMarkdown(quoteContent)}
          </blockquote>
        );
      }

      if (trimmed.startsWith("- ")) {
        const listContent = trimmed.replace(/^-\s+/, "");
        return (
          <div key={idx} style={{ display: "flex", gap: "6px", alignItems: "center", margin: "2px 0", paddingLeft: "8px" }}>
            <span style={{ color: "#10b981", fontWeight: "900" }}>•</span>
            <span style={{ fontSize: "13px", color: "#cbd5e1" }}>{parseInlineMarkdown(listContent)}</span>
          </div>
        );
      }

      if (!trimmed) {
        return <div key={idx} style={{ height: "4px" }} />;
      }

      return (
        <p key={idx} style={{ margin: 0, fontSize: "14.5px", color: "#e2e8f0", lineHeight: "1.6" }}>
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderConteudoComentario = (m) => {
    let rawText = m.texto || "";
    let extractedMediaUrl = m.anexoUrl || null;
    let mediaType = m.anexoTipo || null;

    if (!extractedMediaUrl) {
      if (rawText.includes("![") && rawText.includes("](data:image")) {
        const match = rawText.match(/\!\[(.*?)\]\((data:image\/.*?\))\)/);
        if (match) {
          extractedMediaUrl = match[2];
          mediaType = "imagem";
          rawText = rawText.replace(/\!\[(.*?)\]\((data:image\/.*?\))\)/g, "").trim();
        }
      } else if (rawText.includes("!(data:video") || (rawText.includes("![") && rawText.includes("](data:video"))) {
        const match = rawText.match(/\!\[(.*?)\]\((data:video\/.*?\))\)/);
        if (match) {
          extractedMediaUrl = match[2];
          mediaType = "video";
          rawText = rawText.replace(/\!\[(.*?)\]\((data:video\/.*?\))\)/g, "").trim();
        }
      }
    }

    if (extractedMediaUrl && !mediaType) {
      if (extractedMediaUrl.startsWith("data:video/") || extractedMediaUrl.startsWith("blob:") || extractedMediaUrl.match(/\.(mp4|webm|mov|ogg|mkv|avi|m4v)$/i)) {
        mediaType = "video";
      } else {
        mediaType = "imagem";
      }
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* CARD DE RESPOSTA VINCULADA */}
        {m.replyTo && (
          <div style={{
            background: "rgba(59, 130, 246, 0.12)",
            borderLeft: "3px solid #3b82f6",
            borderRadius: "8px",
            padding: "8px 12px",
            marginBottom: "2px",
            fontSize: "13px"
          }}>
            <div style={{ fontWeight: "800", color: "#60a5fa", fontSize: "12px", marginBottom: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
              <Reply size={13} /> Respondendo a <strong style={{ color: "#f8fafc" }}>@{m.replyTo.autor}</strong>
            </div>
            <div style={{ color: "#cbd5e1", fontStyle: "italic", fontSize: "13px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {m.replyTo.texto}
            </div>
          </div>
        )}

        {rawText && parseMarkdownText(rawText)}
        {extractedMediaUrl && (
          <div style={{ marginTop: "6px" }}>
            {mediaType === "video" ? (
              <video 
                src={extractedMediaUrl} 
                controls 
                style={{ maxWidth: "100%", maxHeight: "360px", borderRadius: "12px", border: "1px solid rgba(59, 130, 246, 0.3)", background: "#000" }} 
              />
            ) : (
              <img 
                src={extractedMediaUrl} 
                alt="Anexo de Imagem" 
                style={{ maxWidth: "100%", maxHeight: "280px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", objectFit: "contain" }} 
              />
            )}
          </div>
        )}
      </div>
    );
  };

  const handleSelectMencao = (val) => {
    setMencionarUser(val);
    if (val && !novoComentarioDrawer.includes(`@${val}`)) {
      setNovoComentarioDrawer(prev => `@${val} ` + prev);
    }
  };

  const inserirEmoji = (emoji) => {
    setNovoComentarioDrawer(prev => prev + " " + emoji + " ");
    setShowEmojiPicker(false);
  };

  // Filtros avançados
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [termoBusca, setTermoBusca] = useState("");

  const handleSelectCardStatus = (novoStatus) => {
    setFiltroStatus(novoStatus);
    if (abaAtiva === "correio") {
      setAbaAtiva(modoAdmin ? "todos" : "meus_tickets");
    }
  };

  const toggleChatExpandido = (ticketId) => {
    setChatAbertoMap(prev => ({ ...prev, [ticketId]: !prev[ticketId] }));
  };

  // Input de mensagens indexado por ticketId
  const [mensagemInputs, setMensagemInputs] = useState({});
  // Rejeição inline modal/prompts
  const [ticketRejeitandoId, setTicketRejeitandoId] = useState(null);
  const [motivoRejeicaoInput, setMotivoRejeicaoInput] = useState("");
  const [atribuirRespTriagemMap, setAtribuirRespTriagemMap] = useState({});

  // Dados do formulário
  const userName = user?.nome || user?.name || user?.username || "Enzo Vieira";
  const userEmail = user?.email || "enzovieira.contabhub@gmail.com";
  
  // Identificação EXCLUSIVA por TAG do nível SuperAdmin (Apenas quem tem a tag superadmin pode fazer a gestão de tickets)
  const isSuperAdmin = 
    user?.cargo === "superadmin" || 
    user?.cargo === "super_admin" || 
    user?.role === "superadmin" || 
    user?.role === "super_admin" || 
    user?.tag === "superadmin" || 
    user?.tag === "super_admin" || 
    (Array.isArray(user?.tags) && user.tags.some(t => String(t).toLowerCase().includes("superadmin"))) ||
    user?.is_super_admin === true;

  // Cargo Admin e SuperAdmin possuem permissão para gerenciar os tickets
  const isAdmin = 
    isSuperAdmin || 
    user?.cargo === "admin" || 
    user?.role === "admin" || 
    user?.is_admin === true;

  // Helper de visualização de tickets na gestão Admin
  const podeVerTicketComoAdmin = (t) => {
    return isAdmin;
  };

  const [adminUsersRemotos, setAdminUsersRemotos] = useState([]);
  const [superAdminUsersRemotos, setSuperAdminUsersRemotos] = useState([]);
  const [modoAceiteMap, setModoAceiteMap] = useState({});
  const [outroResponsavelMap, setOutroResponsavelMap] = useState({});

  useEffect(() => {
    if (isAdmin) {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      if (token) {
        fetch(`${apiUrl}/auth/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.ok ? res.json() : [])
          .then(data => {
            if (Array.isArray(data)) {
              const gestores = data
                .filter(u => {
                  const c = (u.cargo || "").toLowerCase();
                  if (["admin", "superadmin", "super_admin", "suporte", "gestor_base", "tutor"].includes(c)) return true;
                  let vinculos = u.vinculos_bases;
                  if (typeof vinculos === "string") {
                    try { vinculos = JSON.parse(vinculos); } catch (e) {}
                  }
                  if (Array.isArray(vinculos)) {
                    return vinculos.some(b => ["admin", "gestor", "suporte", "tutor"].includes((b.papel || "").toLowerCase()));
                  }
                  return false;
                })
                .map(u => u.nome)
                .filter(Boolean);

              const superAdmins = data
                .filter(u => {
                  const c = (u.cargo || "").toLowerCase();
                  const r = (u.role || "").toLowerCase();
                  const t = (u.tag || "").toLowerCase();
                  const hasTagArray = Array.isArray(u.tags) && u.tags.some(item => String(item).toLowerCase().includes("superadmin"));
                  return c.includes("superadmin") || c.includes("super_admin") || r.includes("superadmin") || r.includes("super_admin") || t.includes("superadmin") || t.includes("super_admin") || hasTagArray || u.is_super_admin === true;
                })
                .map(u => u.nome)
                .filter(Boolean);

              const DEFAULT_SUPER_ADMINS = ["Suporte DevHub", "Beatriz Santana", "Nicholas Araujo"];
              const todosSuperAdmins = Array.from(new Set([userName, ...superAdmins, ...DEFAULT_SUPER_ADMINS])).filter(Boolean);

              setAdminUsersRemotos(gestores);
              setSuperAdminUsersRemotos(todosSuperAdmins);
            }
          })
          .catch(() => {
            setSuperAdminUsersRemotos([userName, "Suporte DevHub", "Beatriz Santana", "Nicholas Araujo"]);
          });
      }
    }
  }, [isAdmin, userName]);

  const LISTA_RESPONSAVEIS_OPCOES = Array.from(new Set([
    userName || "Enzo Vieira",
    ...(Array.isArray(superAdminUsersRemotos) ? superAdminUsersRemotos : []),
    ...(Array.isArray(adminUsersRemotos) ? adminUsersRemotos : []),
    "Suporte DevHub",
    "Beatriz Santana",
    "Nicholas Araujo",
    "Enzo Vieira"
  ])).filter(item => item && typeof item === "string");

  const [tipo, setTipo] = useState("bug");
  const [prioridade, setPrioridade] = useState("media");
  const [dificuldade, setDificuldade] = useState("Média");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [anexoUrl, setAnexoUrl] = useState(null);
  const [anexoTipo, setAnexoTipo] = useState(null);
  const [anexoNome, setAnexoNome] = useState(null);
  const [sucessoMsg, setSucessoMsg] = useState(null);

  const getPrioridadeBadge = (pVal) => {
    const p = (pVal || "").toLowerCase();
    if (p.includes("baixa")) {
      return { bg: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "rgba(16, 185, 129, 0.35)", label: "Baixa" };
    }
    if (p.includes("alta")) {
      return { bg: "rgba(245, 158, 11, 0.18)", color: "#f59e0b", border: "rgba(245, 158, 11, 0.4)", label: "Alta" };
    }
    if (p.includes("critica") || p.includes("crítica")) {
      return { bg: "rgba(239, 68, 68, 0.18)", color: "#ef4444", border: "rgba(239, 68, 68, 0.4)", label: "Crítica" };
    }
    return { bg: "rgba(59, 130, 246, 0.18)", color: "#60a5fa", border: "rgba(59, 130, 246, 0.4)", label: "Média" };
  };

  const getDificuldadeBadge = (dVal) => {
    const d = (dVal || "").toLowerCase();
    if (d.includes("fácil") || d.includes("facil")) {
      return { bg: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "rgba(16, 185, 129, 0.35)", label: "🟢 Fácil" };
    }
    if (d.includes("média") || d.includes("media")) {
      return { bg: "rgba(245, 158, 11, 0.18)", color: "#f59e0b", border: "rgba(245, 158, 11, 0.4)", label: "🟡 Média" };
    }
    if (d.includes("difícil") || d.includes("dificil")) {
      return { bg: "rgba(239, 68, 68, 0.18)", color: "#ef4444", border: "rgba(239, 68, 68, 0.4)", label: "🔴 Difícil" };
    }
    return { bg: "rgba(148, 163, 184, 0.12)", color: "#94a3b8", border: "rgba(148, 163, 184, 0.25)", label: "- Não definida" };
  };

  // Carregar tickets do localStorage e sincronizar Status / Concluído
  useEffect(() => {
    try {
      const saved = localStorage.getItem("devhub_tickets");
      let baseList = saved ? JSON.parse(saved) : TICKETS_PADRAO;

      const sanitizados = baseList.map(t => {
        const msgs = (t.mensagens || []).map(m => {
          if (m.autor === "Sistema DevHub") return m;
          const ehAdminOficial = m.isSupport === true || 
            (m.autor?.includes("Suporte") && (m.texto?.includes("Corrigido") || m.texto?.includes("oficial") || m.texto?.includes("aprovado") || m.texto?.includes("reavaliado")));
          
          if (ehAdminOficial) {
            return { ...m, role: "admin", autor: "Suporte DevHub", isSupport: true };
          }
          return {
            ...m,
            role: "aluno",
            autor: (m.autor === "Suporte DevHub" || !m.autor) ? (t.usuarioNome || "Aluno") : m.autor,
            isSupport: false
          };
        });

        const isResolvido = t.status === "Resolvido";
        let concluidoCalculado = t.concluidoEm;
        if (isResolvido && (!concluidoCalculado || concluidoCalculado === "Não concluído")) {
          concluidoCalculado = t.dataCriacao?.split(",")[0] || new Date().toLocaleDateString("pt-BR");
        } else if (!isResolvido) {
          concluidoCalculado = "Não concluído";
        }

        return { 
          solicitacaoNum: t.solicitacaoNum || `#${Math.floor(7000 + Math.random() * 900)}`,
          responsavel: t.responsavel || "Sem responsável",
          dificuldade: t.dificuldade || "-",
          modulo: t.modulo || "Processos",
          prazo: t.prazo || "25/10/2026",
          baseNome: t.baseNome || t.base_nome || (t.usuarioEmail?.includes("contabhub") ? "ContabHub" : "DevHub"),
          ...t, 
          concluidoEm: concluidoCalculado,
          mensagens: msgs 
        };
      });

      setTickets(sanitizados);
      localStorage.setItem("devhub_tickets", JSON.stringify(sanitizados));
    } catch (e) {
      console.error("Erro ao carregar tickets:", e);
      setTickets(TICKETS_PADRAO);
    }
  }, []);

  useEffect(() => {
    if (modoAdmin && (abaAtiva === "criar" || abaAtiva === "meus_tickets")) {
      setAbaAtiva(defaultAba || "todos");
    } else if (!modoAdmin && (abaAtiva === "correio" || abaAtiva === "todos")) {
      setAbaAtiva("criar");
    }
  }, [modoAdmin, defaultAba]);

  if (isOpen !== undefined && !isOpen) return null;

  const salvarTickets = (novos) => {
    setTickets(novos);
    try {
      localStorage.setItem("devhub_tickets", JSON.stringify(novos));
    } catch (e) {
      console.warn("Cota do localStorage excedida por mídias grandes. Salvando estrutura dos tickets:", e);
      try {
        const sanitizados = novos.map(t => ({
          ...t,
          anexoUrl: (t.anexoUrl && t.anexoUrl.length > 300000) ? null : t.anexoUrl,
          mensagens: (t.mensagens || []).map(m => ({
            ...m,
            anexoUrl: (m.anexoUrl && m.anexoUrl.length > 300000) ? null : m.anexoUrl
          }))
        }));
        localStorage.setItem("devhub_tickets", JSON.stringify(sanitizados));
      } catch (err) {
        console.error("Erro ao salvar no localStorage:", err);
      }
    }
  };

  // Upload de imagem ou vídeo no modal de criar ticket
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = (file.type && file.type.startsWith("video/")) || /\.(mp4|webm|mov|mkv|avi|m4v|ogv|3gp|flv)$/i.test(file.name);
    const isImage = (file.type && file.type.startsWith("image/")) || /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file.name);

    if (!isImage && !isVideo) {
      alert("Por favor, selecione um arquivo de imagem (PNG, JPG) ou vídeo (MP4, WebM, MOV, MKV).");
      return;
    }

    const LIMITE_IMAGEM_MB = 5;
    const LIMITE_VIDEO_MB = 15;
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);

    if (isImage && file.size > LIMITE_IMAGEM_MB * 1024 * 1024) {
      alert(`⚠️ Imagem muito pesada (${sizeInMB} MB)! O limite máximo permitido é ${LIMITE_IMAGEM_MB} MB para não sobrecarregar o sistema.`);
      return;
    }

    if (isVideo && file.size > LIMITE_VIDEO_MB * 1024 * 1024) {
      alert(`⚠️ Vídeo muito pesado (${sizeInMB} MB)! O limite máximo permitido é ${LIMITE_VIDEO_MB} MB para garantir a leveza da plataforma.`);
      return;
    }

    const fileType = isVideo ? "video" : "imagem";

    if (file.size > 4 * 1024 * 1024) {
      const blobUrl = URL.createObjectURL(file);
      setAnexoUrl(blobUrl);
      setAnexoTipo(fileType);
      setAnexoNome(file.name);
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAnexoUrl(ev.target.result);
        setAnexoTipo(fileType);
        setAnexoNome(file.name);
      };
      reader.readAsDataURL(file);
    }
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
      baixa: "Baixa",
      media: "Média",
      alta: "Alta",
      critica: "Crítica"
    };

    const randNum = Math.floor(1000 + Math.random() * 9000);
    const userBase = user?.base_nome || user?.baseNome || user?.base || (userEmail.includes("contabhub") ? "ContabHub" : "DevHub");

    const novoTicket = {
      id: `ONETY-${randNum}`,
      solicitacaoNum: `#${Math.floor(7000 + Math.random() * 900)}`,
      usuarioNome: userName,
      usuarioEmail: userEmail,
      baseNome: userBase,
      responsavel: "Sem responsável",
      tipo,
      tipoLabel: tipoLabels[tipo],
      prioridade,
      prioridadeLabel: prioridadeLabels[prioridade],
      dificuldade: dificuldade || "Média",
      modulo: "Geral",
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      anexoUrl,
      anexoTipo,
      anexoNome,
      status: "Pendente",
      mensagens: [],
      dataCriacao: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
      prazo: "25/10/2026",
      concluidoEm: "Não concluído"
    };

    const atualizados = [novoTicket, ...tickets];
    salvarTickets(atualizados);

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

  // APROVAR TICKET (Com atribuição de responsável)
  const handleAprovarTicket = (ticketId, responsavelAtribuido) => {
    const respFinal = (responsavelAtribuido && responsavelAtribuido !== "Sem responsável")
      ? responsavelAtribuido 
      : (userName || "Suporte DevHub");
    const msgAprovado = {
      id: `msg-${Date.now()}`,
      autor: "Sistema DevHub",
      email: "suporte@devhub.com",
      role: "admin",
      texto: `✅ Ticket aprovado na Caixa de Correio de triagem e atribuído ao responsável: ${respFinal}`,
      data: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    };

    const atualizados = tickets.map(t => {
      if (String(t.id) === String(ticketId) || String(t.solicitacaoNum) === String(ticketId)) {
        return {
          ...t,
          status: "Aberto",
          responsavel: respFinal,
          mensagens: [...(t.mensagens || []), msgAprovado]
        };
      }
      return t;
    });

    salvarTickets(atualizados);
    setAbaAtiva("todos");
    setSucessoMsg(`🎉 Ticket ${ticketId} APROVADO e atribuído a ${respFinal}!`);
    setTimeout(() => {
      setSucessoMsg(null);
    }, 2500);
  };

  // REJEITAR TICKET
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
      if (String(t.id) === String(ticketId) || String(t.solicitacaoNum) === String(ticketId)) {
        return {
          ...t,
          status: "Rejeitado",
          motivoRejeicao: motivoText,
          concluidoEm: "Não concluído",
          mensagens: [...(t.mensagens || []), msgRejeitado]
        };
      }
      return t;
    });

    salvarTickets(atualizados);
    setTicketRejeitandoId(null);
    setMotivoRejeicaoInput("");
  };

  // REAVALIAR TICKET REJEITADO
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
      if (String(t.id) === String(ticketId) || String(t.solicitacaoNum) === String(ticketId)) {
        return {
          ...t,
          status: "Aberto",
          motivoRejeicao: null,
          concluidoEm: "Não concluído",
          mensagens: [...(t.mensagens || []), msgReavaliado]
        };
      }
      return t;
    });

    salvarTickets(atualizados);
    alert(`Ticket ${ticketId} reavaliado e transferido para a Gestão de Admin!`);
  };

  // Enviar Mensagem na thread do Ticket (Inline Card)
  const handleEnviarMensagem = (ticketId) => {
    const texto = mensagemInputs[ticketId] || "";
    if (!texto.trim()) return;

    const enviandoComoAdmin = modoAdmin || abaAtiva === "correio" || abaAtiva === "todos";

    const novaMsg = {
      id: `msg-${Date.now()}`,
      autor: enviandoComoAdmin ? "Suporte DevHub" : userName,
      email: userEmail,
      role: enviandoComoAdmin ? "admin" : "aluno",
      isSupport: enviandoComoAdmin,
      texto: texto.trim(),
      data: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    };

    const atualizados = tickets.map(t => {
      if (t.id === ticketId) {
        const historico = t.mensagens || [];
        return {
          ...t,
          mensagens: [...historico, novaMsg],
          status: enviandoComoAdmin && t.status === "Aberto" ? "Em Análise" : t.status
        };
      }
      return t;
    });

    salvarTickets(atualizados);
    setMensagemInputs(prev => ({ ...prev, [ticketId]: "" }));
  };

  // Enviar Comentário através da Modal Drawer
  const handleAdicionarComentarioDrawer = () => {
    if ((!novoComentarioDrawer.trim() && !commentAnexoUrl) || !drawerTicket) return;

    const textoComentario = (mencionarUser && !novoComentarioDrawer.includes(`@${mencionarUser}`))
      ? `@${mencionarUser} ${novoComentarioDrawer.trim()}`
      : novoComentarioDrawer.trim();

    const enviandoComoAdmin = modoAdmin || isAdmin;
    const now = Date.now();

    const novaMsg = {
      id: `msg-${now}`,
      timestamp: now,
      autor: enviandoComoAdmin ? "Suporte DevHub" : userName,
      email: userEmail,
      role: enviandoComoAdmin ? "admin" : "aluno",
      isSupport: enviandoComoAdmin,
      texto: textoComentario,
      replyTo: respondingToComment ? { id: respondingToComment.id, autor: respondingToComment.autor, texto: respondingToComment.texto } : null,
      anexoUrl: commentAnexoUrl,
      anexoNome: commentAnexoNome,
      anexoTipo: commentAnexoTipo,
      data: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    };

    const atualizados = tickets.map(t => {
      if (t.id === drawerTicket.id) {
        const msgs = [...(t.mensagens || []), novaMsg];
        const updatedTicket = { ...t, mensagens: msgs };
        setDrawerTicket(updatedTicket);
        return updatedTicket;
      }
      return t;
    });

    salvarTickets(atualizados);
    setNovoComentarioDrawer("");
    setMencionarUser("");
    setCommentAnexoUrl(null);
    setCommentAnexoNome(null);
    setCommentAnexoTipo(null);
    setRespondingToComment(null);
  };

  const TEMPO_LIMITE_EDICAO_MINUTOS = 15;

  const podeEditarComentario = (m) => {
    if (isAdmin || modoAdmin) return true;
    if (m.autor !== userName && m.email !== userEmail) return false;

    let ts = m.timestamp;
    if (!ts && m.id && typeof m.id === "string" && m.id.startsWith("msg-")) {
      const num = parseInt(m.id.replace("msg-", ""), 10);
      if (!isNaN(num) && num > 1600000000000) {
        ts = num;
      }
    }

    if (!ts) return true;

    const diferencaMinutos = (Date.now() - ts) / (1000 * 60);
    return diferencaMinutos <= TEMPO_LIMITE_EDICAO_MINUTOS;
  };

  const handleExcluirComentarioDrawer = (msgId) => {
    if (!drawerTicket) return;
    if (!confirm("Deseja realmente excluir este comentário?")) return;

    const novasMsgs = (drawerTicket.mensagens || []).filter(m => m.id !== msgId);
    const updatedTicket = { ...drawerTicket, mensagens: novasMsgs };
    setDrawerTicket(updatedTicket);

    const atualizados = tickets.map(t => {
      if (t.id === drawerTicket.id) {
        return updatedTicket;
      }
      return t;
    });

    salvarTickets(atualizados);
  };

  const handleSalvarEdicaoComentarioDrawer = (msgId) => {
    if (!drawerTicket) return;
    const novasMsgs = (drawerTicket.mensagens || []).map(m => {
      if (m.id === msgId) {
        return { ...m, texto: textoEdicaoComentario.trim() };
      }
      return m;
    });

    const updatedTicket = { ...drawerTicket, mensagens: novasMsgs };
    setDrawerTicket(updatedTicket);

    const atualizados = tickets.map(t => {
      if (t.id === drawerTicket.id) {
        return updatedTicket;
      }
      return t;
    });

    salvarTickets(atualizados);
    setEditandoComentarioId(null);
    setTextoEdicaoComentario("");
  };

  // Alterar Status do Ticket
  const handleAlterarStatus = (ticketId, novoStatus) => {
    const atualizados = tickets.map(t => {
      if (String(t.id) === String(ticketId) || String(t.solicitacaoNum) === String(ticketId)) {
        const isResolvido = novoStatus === "Resolvido";
        const hoje = new Date().toLocaleDateString("pt-BR");
        const concluidoCalculado = isResolvido ? (t.concluidoEm && t.concluidoEm !== "Não concluído" ? t.concluidoEm : hoje) : "Não concluído";

        const updated = { 
          ...t, 
          status: novoStatus,
          concluidoEm: concluidoCalculado
        };
        if (drawerTicket && (String(drawerTicket.id) === String(ticketId) || String(drawerTicket.solicitacaoNum) === String(ticketId))) {
          setDrawerTicket(updated);
        }
        return updated;
      }
      return t;
    });
    salvarTickets(atualizados);
    setSucessoMsg(`Status do ticket alterado para "${novoStatus}"!`);
    setTimeout(() => setSucessoMsg(null), 3000);
  };

  // Alterar Responsável do Ticket
  const handleAlterarResponsavel = (ticketId, novoResponsavel) => {
    const atualizados = tickets.map(t => {
      if (String(t.id) === String(ticketId) || String(t.solicitacaoNum) === String(ticketId)) {
        const updated = { ...t, responsavel: novoResponsavel };
        if (drawerTicket && (String(drawerTicket.id) === String(ticketId) || String(drawerTicket.solicitacaoNum) === String(ticketId))) {
          setDrawerTicket(updated);
        }
        return updated;
      }
      return t;
    });
    salvarTickets(atualizados);
    setSucessoMsg(`Responsável alterado para "${novoResponsavel}"!`);
    setTimeout(() => setSucessoMsg(null), 3000);
  };

  // Alterar Dificuldade do Ticket
  const handleAlterarDificuldade = (ticketId, novaDificuldade) => {
    const atualizados = tickets.map(t => {
      if (String(t.id) === String(ticketId) || String(t.solicitacaoNum) === String(ticketId)) {
        const updated = { ...t, dificuldade: novaDificuldade };
        if (drawerTicket && (String(drawerTicket.id) === String(ticketId) || String(drawerTicket.solicitacaoNum) === String(ticketId))) {
          setDrawerTicket(updated);
        }
        return updated;
      }
      return t;
    });
    salvarTickets(atualizados);
    setSucessoMsg(`Dificuldade alterada para "${novaDificuldade}"!`);
    setTimeout(() => setSucessoMsg(null), 3000);
  };

  // Excluir Ticket
  const handleExcluirTicket = (ticketId) => {
    if (confirm(`Deseja realmente excluir o ticket ${ticketId}?`)) {
      const atualizados = tickets.filter(t => String(t.id) !== String(ticketId) && String(t.solicitacaoNum) !== String(ticketId));
      salvarTickets(atualizados);
      if (drawerTicket && (String(drawerTicket.id) === String(ticketId) || String(drawerTicket.solicitacaoNum) === String(ticketId))) {
        setDrawerTicket(null);
      }
    }
  };

  // Filtrar apenas comentários reais colocados por usuários (exclui logs do sistema)
  const getComentariosReais = (mensagens) => {
    return (mensagens || []).filter(m => m.autor !== "Sistema DevHub" && m.texto?.trim().length > 0);
  };

  const meusTickets = tickets.filter(t => t.usuarioEmail === userEmail || t.usuarioNome === userName);

  // Lista de tickets visíveis para a gestão Admin (respeitando o isolamento por escopo de base se não for SuperAdmin)
  const ticketsVisiveisAdmin = isAdmin && !isSuperAdmin ? tickets.filter(podeVerTicketComoAdmin) : tickets;

  // Filtros de contagens (baseados na visão permitida do Admin)
  const countPendentes = ticketsVisiveisAdmin.filter(t => t.status === "Pendente" && (!t.responsavel || t.responsavel === "Sem responsável")).length;
  const countRejeitados = ticketsVisiveisAdmin.filter(t => t.status === "Rejeitado" || t.status === "Negado").length;

  const totalTickets = ticketsVisiveisAdmin.length;
  const countAndamento = ticketsVisiveisAdmin.filter(t => t.status === "Aberto" || t.status === "Em Análise" || t.status === "Pendente").length;
  const countResolvidos = ticketsVisiveisAdmin.filter(t => t.status === "Resolvido").length;
  const countNegados = ticketsVisiveisAdmin.filter(t => t.status === "Rejeitado" || t.status === "Negado").length;

  // Filtragem avançada e busca
  const listagemTicketsExibida = () => {
    let lista = [];

    if (abaAtiva === "correio") {
      if (subAbaCorreio === "pendentes") {
        lista = ticketsVisiveisAdmin.filter(t => t.status === "Pendente" && (!t.responsavel || t.responsavel === "Sem responsável"));
      } else {
        lista = ticketsVisiveisAdmin.filter(t => t.status === "Rejeitado" || t.status === "Negado");
      }
    } else if (abaAtiva === "todos") {
      lista = ticketsVisiveisAdmin;
    } else {
      lista = meusTickets;
    }

    if (filtroTipo !== "todos") {
      lista = lista.filter(t => t.tipo === filtroTipo);
    }

    if (filtroStatus !== "todos") {
      if (filtroStatus === "andamento") {
        lista = lista.filter(t => t.status === "Aberto" || t.status === "Em Análise" || t.status === "Pendente");
      } else if (filtroStatus === "resolvido") {
        lista = lista.filter(t => t.status === "Resolvido");
      } else if (filtroStatus === "negado") {
        lista = lista.filter(t => t.status === "Rejeitado" || t.status === "Negado");
      } else {
        lista = lista.filter(t => t.status.toLowerCase() === filtroStatus.toLowerCase());
      }
    }

    if (termoBusca.trim()) {
      const q = termoBusca.toLowerCase().trim();
      lista = lista.filter(t => 
        t.id.toLowerCase().includes(q) ||
        t.titulo.toLowerCase().includes(q) ||
        (t.baseNome && t.baseNome.toLowerCase().includes(q)) ||
        (t.usuarioNome && t.usuarioNome.toLowerCase().includes(q)) ||
        (t.usuarioEmail && t.usuarioEmail.toLowerCase().includes(q))
      );
    }

    return lista;
  };

  const getBadgeStatusStyle = (st) => {
    switch (st) {
      case "Pendente":
        return { bg: "rgba(245, 158, 11, 0.18)", color: "#f59e0b", border: "rgba(245, 158, 11, 0.35)", label: "🟡 Pendente" };
      case "Aberto":
        return { bg: "rgba(59, 130, 246, 0.18)", color: "#60a5fa", border: "rgba(59, 130, 246, 0.35)", label: "🔵 Em Aberto" };
      case "Em Análise":
        return { bg: "rgba(168, 85, 247, 0.18)", color: "#c084fc", border: "rgba(168, 85, 247, 0.35)", label: "🟣 Em Análise" };
      case "Resolvido":
        return { bg: "rgba(16, 185, 129, 0.18)", color: "#10b981", border: "rgba(16, 185, 129, 0.35)", label: "🟢 Resolvido" };
      case "Rejeitado":
      case "Negado":
        return { bg: "rgba(239, 68, 68, 0.18)", color: "#ef4444", border: "rgba(239, 68, 68, 0.35)", label: "🔴 Recusado" };
      default:
        return { bg: "rgba(148, 163, 184, 0.18)", color: "#94a3b8", border: "rgba(148, 163, 184, 0.35)", label: st };
    }
  };

  const renderTipoBadge = (tp) => {
    switch (tp) {
      case "bug":
        return (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "4px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "800",
            backgroundColor: "rgba(244, 63, 94, 0.18)", color: "#f87171", border: "1px solid rgba(244, 63, 94, 0.35)"
          }}>
            <Bug size={13} color="#f43f5e" /> Bug
          </span>
        );
      case "melhoria":
        return (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "4px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "800",
            backgroundColor: "rgba(245, 158, 11, 0.18)", color: "#fbbf24", border: "1px solid rgba(245, 158, 11, 0.35)"
          }}>
            <Lightbulb size={13} color="#f59e0b" /> Sugestão
          </span>
        );
      case "duvida":
      default:
        return (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "4px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "800",
            backgroundColor: "rgba(59, 130, 246, 0.18)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.35)"
          }}>
            <HelpCircle size={13} color="#3b82f6" /> Dúvida
          </span>
        );
    }
  };

  // RENDER DO CARD DE TICKET DO ALUNO ("MEUS TICKETS") — LIMPO, ORGANIZADO E ESPECÍFICO
  const renderAlunoTicketCard = (t) => {
    const badgeSt = getBadgeStatusStyle(t.status);
    const comentariosReais = getComentariosReais(t.mensagens);
    let statusBorderLeftColor = "#f59e0b";
    if (t.status === "Resolvido") statusBorderLeftColor = "#10b981";
    if (t.status === "Rejeitado" || t.status === "Negado") statusBorderLeftColor = "#ef4444";

    const isRecusado = t.status === "Rejeitado" || t.status === "Negado";

    return (
      <div 
        key={t.id} 
        style={{
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(11, 15, 25, 0.98) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderLeft: `5px solid ${statusBorderLeftColor}`,
          borderRadius: "20px",
          padding: "24px 28px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
          transition: "all 0.2s ease"
        }}
      >
        {/* CABEÇALHO DO TICKET */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", fontWeight: "900", color: "#38bdf8", background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.4)", padding: "4px 12px", borderRadius: "10px" }}>
              {t.id}
            </span>
            {renderTipoBadge(t.tipo)}
            <span 
              style={{
                backgroundColor: badgeSt.bg,
                color: badgeSt.color,
                border: `1px solid ${badgeSt.border}`,
                fontSize: "12px",
                fontWeight: "900",
                padding: "4px 14px",
                borderRadius: "12px"
              }}
            >
              {badgeSt.label}
            </span>
          </div>

          <button
            onClick={() => handleExcluirTicket(t.id)}
            style={{
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              color: "#ef4444",
              padding: "6px 14px",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: "800",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease"
            }}
            title="Excluir este Ticket"
          >
            <Trash2 size={14} /> Excluir
          </button>
        </div>

        {/* TÍTULO & DATA DE CRIAÇÃO */}
        <div>
          <h4 style={{ margin: "0 0 6px 0", fontSize: "19px", fontWeight: "900", color: "#f8fafc", letterSpacing: "-0.01em" }}>
            {t.titulo}
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", color: "#94a3b8", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Clock size={14} color="#a78bfa" /> Criado em: <strong style={{ color: "#f8fafc" }}>{t.dataCriacao}</strong>
            </span>
            {(isAdmin || modoAdmin) && t.responsavel && t.responsavel !== "Sem responsável" && (
              <span style={{ fontSize: "13px", color: "#38bdf8", display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: "700" }}>
                <User size={14} color="#38bdf8" /> Responsável: <strong style={{ color: "#e0f2fe" }}>{t.responsavel}</strong>
              </span>
            )}
          </div>
        </div>

        {/* BANNER DE REJEIÇÃO SE FOR RECUSADO */}
        {isRecusado && (
          <div style={{
            background: "rgba(239, 68, 68, 0.14)",
            border: "1px solid rgba(239, 68, 68, 0.45)",
            borderRadius: "14px",
            padding: "14px 18px",
            display: "flex",
            flexDirection: "column",
            gap: "6px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f87171", fontWeight: "900", fontSize: "14px" }}>
              <XCircle size={18} color="#ef4444" />
              <span>Solicitação Recusada pelo Suporte</span>
            </div>
            <div style={{ fontSize: "13.5px", color: "#fca5a5", lineHeight: "1.4" }}>
              <strong>Motivo da recusa:</strong> {t.motivoRejeicao || "Solicitação fora do escopo ou informações insuficientes."}
            </div>
          </div>
        )}

        {/* DESCRIÇÃO DO TICKET */}
        <div style={{
          background: "rgba(3, 7, 18, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "14px",
          padding: "16px 18px",
          fontSize: "14.5px",
          color: "#e2e8f0",
          lineHeight: "1.6"
        }}>
          {t.descricao ? parseMarkdownText(t.descricao) : "Nenhuma descrição fornecida."}
        </div>

        {/* ANEXO ENVIADO */}
        {t.anexoUrl && (
          <div style={{ marginTop: "2px" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
              📎 Anexo Enviado:
            </span>
            {t.anexoTipo === "video" ? (
              <video src={t.anexoUrl} controls style={{ maxHeight: "240px", width: "100%", borderRadius: "12px", background: "#000" }} />
            ) : (
              <img src={t.anexoUrl} alt="Anexo" style={{ maxHeight: "240px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", objectFit: "contain" }} />
            )}
          </div>
        )}

        {/* RODAPÉ UNIFICADO COM BOTÃO DE DETALHES E CONTADOR DE MENSAGENS */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            {comentariosReais.length > 0 ? (
              <div 
                onClick={() => { setDrawerTicket(t); setDrawerTab("comentarios"); }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  color: "#6ee7b7",
                  padding: "6px 14px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "800",
                  cursor: "pointer"
                }}
              >
                <MessageSquare size={15} />
                <span>{comentariosReais.length} resposta(s) disponível(is)</span>
              </div>
            ) : (
              <span style={{ fontSize: "12.5px", color: "#64748b", fontStyle: "italic" }}>
                Aguardando resposta do suporte...
              </span>
            )}
          </div>

          <button
            onClick={() => { setDrawerTicket(t); setDrawerTab("detalhes"); }}
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
              color: "#ffffff",
              border: "none",
              padding: "10px 22px",
              borderRadius: "12px",
              fontSize: "13.5px",
              fontWeight: "900",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 16px rgba(16, 185, 129, 0.35)",
              transition: "transform 0.15s ease"
            }}
          >
            <Eye size={16} /> Ver Detalhes & Respostas →
          </button>
        </div>
      </div>
    );
  };

  // Render do Modo Tabela (Para Gestão Admin)
  const renderTableView = (lista) => {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.ticketsTable}>
          <thead>
            <tr>
              <th className={styles.tableHeaderCell}>Ticket</th>
              <th className={styles.tableHeaderCell} style={{ textAlign: "center" }}>MSG</th>
              <th className={styles.tableHeaderCell}>Base</th>
              <th className={styles.tableHeaderCell}>Descrição</th>
              <th className={styles.tableHeaderCell}>Status</th>
              <th className={styles.tableHeaderCell}>TIPO</th>
              <th className={styles.tableHeaderCell}>PRIORIDADE</th>
              <th className={styles.tableHeaderCell}>DIFICULDADE</th>
              <th className={styles.tableHeaderCell}>CRIADO POR</th>
              <th className={styles.tableHeaderCell}>RESPONSÁVEL</th>
              <th className={styles.tableHeaderCell}>PRAZO</th>
              <th className={styles.tableHeaderCell}>Criação ∨</th>
              <th className={styles.tableHeaderCell}>CONCLUÍDO</th>
              <th className={styles.tableHeaderCell} style={{ textAlign: "right" }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {lista.map(t => {
              const badgeSt = getBadgeStatusStyle(t.status);
              const comentariosReais = getComentariosReais(t.mensagens);
              const numMsgs = comentariosReais.length;
              const isResolvido = t.status === "Resolvido";
              const ticketBaseName = t.baseNome || t.base_nome || "ContabHub";

              return (
                <tr 
                  key={t.id} 
                  className={styles.tableRow}
                  onClick={() => { setDrawerTicket(t); setDrawerTab("detalhes"); }}
                >
                  <td className={styles.tableCell}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "800", color: "#38bdf8" }}>{t.id}</span>
                      <strong style={{ fontSize: "13.5px", color: "#f8fafc", fontWeight: "900" }}>{t.titulo}</strong>
                    </div>
                  </td>
                  <td className={styles.tableCell} style={{ textAlign: "center" }}>
                    <div 
                      onClick={(e) => { e.stopPropagation(); setDrawerTicket(t); setDrawerTab("comentarios"); }}
                      style={{ display: "inline-flex", alignItems: "center", gap: "4px", cursor: "pointer", color: numMsgs > 0 ? "#10b981" : "#64748b" }}
                      title={`${numMsgs} comentários colocados`}
                    >
                      <MessageSquare size={16} />
                      {numMsgs > 0 && <span style={{ fontSize: "11px", fontWeight: "800" }}>{numMsgs}</span>}
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "3px 8px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: "800",
                      background: "rgba(59, 130, 246, 0.14)",
                      color: "#60a5fa",
                      border: "1px solid rgba(59, 130, 246, 0.25)"
                    }}>
                      {ticketBaseName}
                    </span>
                  </td>
                  <td className={styles.tableCell} style={{ color: "#94a3b8", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t.descricao || "Sem descrição"}
                  </td>

                  {/* SELETOR INTERATIVO DE STATUS */}
                  <td className={styles.tableCell} onClick={(e) => e.stopPropagation()}>
                    <select
                      value={t.status}
                      onChange={(e) => handleAlterarStatus(t.id, e.target.value)}
                      style={{
                        appearance: "none",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        backgroundColor: badgeSt.bg,
                        color: badgeSt.color,
                        border: `1px solid ${badgeSt.border}`,
                        borderRadius: "10px",
                        padding: "5px 14px",
                        fontSize: "11.5px",
                        fontWeight: "800",
                        cursor: "pointer",
                        outline: "none",
                        textAlign: "center",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <option value="Pendente" style={{ background: "#0f172a", color: "#f59e0b" }}>🟡 Pendente</option>
                      <option value="Aberto" style={{ background: "#0f172a", color: "#60a5fa" }}>🔵 Aberto</option>
                      <option value="Em Análise" style={{ background: "#0f172a", color: "#c084fc" }}>🟣 Em Análise</option>
                      <option value="Resolvido" style={{ background: "#0f172a", color: "#10b981" }}>🟢 Resolvido</option>
                      <option value="Rejeitado" style={{ background: "#0f172a", color: "#ef4444" }}>🔴 Rejeitado</option>
                    </select>
                  </td>

                  <td className={styles.tableCell}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {t.tipo === "bug" ? <Bug size={14} color="#f43f5e" /> : t.tipo === "melhoria" ? <Lightbulb size={14} color="#f59e0b" /> : <HelpCircle size={14} color="#3b82f6" />}
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    {(() => {
                      const prio = getPrioridadeBadge(t.prioridadeLabel || t.prioridade);
                      return (
                        <span style={{ backgroundColor: prio.bg, color: prio.color, border: `1px solid ${prio.border}`, fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "10px" }}>
                          {prio.label}
                        </span>
                      );
                    })()}
                  </td>

                  {/* SELETOR INTERATIVO DE DIFICULDADE */}
                  <td className={styles.tableCell} onClick={(e) => e.stopPropagation()}>
                    {(() => {
                      const dif = getDificuldadeBadge(t.dificuldade);
                      return (
                        <select
                          value={t.dificuldade || "-"}
                          onChange={(e) => handleAlterarDificuldade(t.id, e.target.value)}
                          style={{
                            appearance: "none",
                            WebkitAppearance: "none",
                            MozAppearance: "none",
                            backgroundColor: dif.bg,
                            color: dif.color,
                            border: `1px solid ${dif.border}`,
                            borderRadius: "10px",
                            padding: "5px 12px",
                            fontSize: "11.5px",
                            fontWeight: "800",
                            cursor: "pointer",
                            outline: "none",
                            textAlign: "center",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <option value="-" style={{ background: "#0f172a", color: "#94a3b8" }}>- Não definida</option>
                          <option value="Fácil" style={{ background: "#0f172a", color: "#10b981" }}>🟢 Fácil</option>
                          <option value="Média" style={{ background: "#0f172a", color: "#f59e0b" }}>🟡 Média</option>
                          <option value="Difícil" style={{ background: "#0f172a", color: "#ef4444" }}>🔴 Difícil</option>
                        </select>
                      );
                    })()}
                  </td>
                  
                  {/* CRIADO POR (SEM FOTO DE AVATAR) */}
                  <td className={styles.tableCell}>
                    <span style={{ color: "#38bdf8", fontWeight: "700", fontSize: "12.5px" }}>{t.usuarioNome}</span>
                  </td>

                  {/* SELETOR INTERATIVO DE RESPONSÁVEL (SEM FOTO DE AVATAR) */}
                  <td className={styles.tableCell} onClick={(e) => e.stopPropagation()}>
                    <select
                      value={t.responsavel || "Sem responsável"}
                      onChange={(e) => handleAlterarResponsavel(t.id, e.target.value)}
                      style={{
                        appearance: "none",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        backgroundColor: t.responsavel && t.responsavel !== "Sem responsável" ? "rgba(139, 92, 246, 0.18)" : "rgba(15, 23, 42, 0.8)",
                        color: t.responsavel && t.responsavel !== "Sem responsável" ? "#c084fc" : "#94a3b8",
                        border: `1px solid ${t.responsavel && t.responsavel !== "Sem responsável" ? "rgba(139, 92, 246, 0.4)" : "rgba(255, 255, 255, 0.15)"}`,
                        borderRadius: "10px",
                        padding: "5px 12px",
                        fontSize: "12px",
                        fontWeight: "800",
                        cursor: "pointer",
                        outline: "none",
                        textAlign: "center",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <option value="Sem responsável" style={{ background: "#0f172a", color: "#94a3b8" }}>Sem responsável</option>
                      {Array.from(new Set([...LISTA_RESPONSAVEIS_OPCOES, t.responsavel])).filter(r => r && r !== "Sem responsável").map(resp => (
                          <option key={resp} value={resp} style={{ background: "#0f172a", color: "#f8fafc" }}>
                            {resp === userName ? `Mim (${resp})` : resp}
                          </option>
                        ))}
                      </select>
                  </td>

                  <td className={styles.tableCell} style={{ color: "#ea580c", fontWeight: "800" }}>{t.prazo || "25/10/2026"}</td>
                  <td className={styles.tableCell} style={{ color: "#f8fafc" }}>{t.dataCriacao?.split(",")[0] || t.dataCriacao}</td>
                  
                  {/* CONCLUÍDO */}
                  <td className={styles.tableCell} style={{ color: isResolvido ? "#10b981" : "#64748b", fontWeight: isResolvido ? "800" : "500" }}>
                    {isResolvido ? (t.concluidoEm && t.concluidoEm !== "Não concluído" ? t.concluidoEm : (t.dataCriacao?.split(",")[0] || "Hoje")) : "Não concluído"}
                  </td>

                  <td className={styles.tableCell} style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                      <button
                        onClick={() => { setDrawerTicket(t); setDrawerTab("detalhes"); }}
                        style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", padding: "4px" }}
                        title="Ver Detalhes"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => { setDrawerTicket(t); setDrawerTab("comentarios"); }}
                        style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer", padding: "4px" }}
                        title="Adicionar Comentário"
                      >
                        <Edit3 size={16} />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleExcluirTicket(t.id)}
                          style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "4px" }}
                          title="Excluir Ticket"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Render da Modal Drawer Lateral
  const renderDrawerModal = () => {
    if (!drawerTicket) return null;
    const badgeSt = getBadgeStatusStyle(drawerTicket.status);
    const comentariosReais = getComentariosReais(drawerTicket.mensagens);
    const isResolvido = drawerTicket.status === "Resolvido";

    return (
      <div className={styles.drawerOverlay} onClick={() => setDrawerTicket(null)}>
        <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
          {/* HEADER DO DRAWER */}
          <div className={styles.drawerHeader}>
            <div className={styles.drawerTitleWrap}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: "900", color: "#38bdf8" }}>
                  {drawerTicket.id}
                </span>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  - {drawerTicket.solicitacaoNum || "#7831"}
                </span>
              </div>
              <h3 className={styles.drawerTitle}>{drawerTicket.titulo}</h3>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {(isAdmin || modoAdmin) && (
                <button
                  onClick={() => handleAlterarStatus(drawerTicket.id, isResolvido ? "Aberto" : "Resolvido")}
                  style={{ background: "none", border: "none", color: isResolvido ? "#10b981" : "#94a3b8", cursor: "pointer" }}
                  title={isResolvido ? "Marcar como Em Aberto" : "Marcar como Resolvido"}
                >
                  <CheckCircle2 size={20} />
                </button>
              )}
              {(isAdmin || modoAdmin || drawerTicket.usuarioEmail === userEmail) && (
                <button
                  onClick={() => handleExcluirTicket(drawerTicket.id)}
                  style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
                  title="Excluir Ticket"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <button
                onClick={() => setDrawerTicket(null)}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                title="Fechar"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* NAVEGAÇÃO DE SUB-ABAS */}
          <div className={styles.drawerTabs}>
            <button 
              className={`${styles.drawerTabBtn} ${drawerTab === "detalhes" ? styles.drawerTabBtnActive : ""}`}
              onClick={() => setDrawerTab("detalhes")}
            >
              Detalhes
            </button>
            <button 
              className={`${styles.drawerTabBtn} ${drawerTab === "comentarios" ? styles.drawerTabBtnActive : ""}`}
              onClick={() => setDrawerTab("comentarios")}
            >
              Comentários {comentariosReais.length > 0 && `(${comentariosReais.length})`}
            </button>
            <button 
              className={`${styles.drawerTabBtn} ${drawerTab === "historico" ? styles.drawerTabBtnActive : ""}`}
              onClick={() => setDrawerTab("historico")}
            >
              Histórico
            </button>
          </div>

          {/* CORPO DA MODAL */}
          <div className={styles.drawerBody}>
            {drawerTab === "detalhes" && (
              <>
                {/* LINHA DE BADGES E CONTROLES */}
                <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
                  <div>
                    <span className={styles.detailLabel}>Status</span>
                    {isAdmin ? (
                      <select
                        value={drawerTicket.status}
                        onChange={(e) => handleAlterarStatus(drawerTicket.id, e.target.value)}
                        style={{
                          backgroundColor: badgeSt.bg, color: badgeSt.color, border: `1px solid ${badgeSt.border}`,
                          fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "10px", outline: "none", cursor: "pointer"
                        }}
                      >
                        <option value="Pendente" style={{ background: "#0f172a", color: "#f59e0b" }}>🟡 Pendente</option>
                        <option value="Aberto" style={{ background: "#0f172a", color: "#60a5fa" }}>🔵 Aberto</option>
                        <option value="Em Análise" style={{ background: "#0f172a", color: "#c084fc" }}>🟣 Em Análise</option>
                        <option value="Resolvido" style={{ background: "#0f172a", color: "#10b981" }}>🟢 Resolvido</option>
                        <option value="Rejeitado" style={{ background: "#0f172a", color: "#ef4444" }}>🔴 Rejeitado</option>
                      </select>
                    ) : (
                      <span style={{ backgroundColor: badgeSt.bg, color: badgeSt.color, border: `1px solid ${badgeSt.border}`, fontSize: "11px", fontWeight: "800", padding: "4px 12px", borderRadius: "10px" }}>
                        {badgeSt.label}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className={styles.detailLabel}>Prioridade</span>
                    <span style={{ backgroundColor: "rgba(245, 158, 11, 0.2)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.4)", fontSize: "11px", fontWeight: "800", padding: "4px 12px", borderRadius: "10px" }}>
                      {drawerTicket.prioridadeLabel || drawerTicket.prioridade || "Média"}
                    </span>
                  </div>

                  <div>
                    <span className={styles.detailLabel}>Dificuldade</span>
                    <span style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#94a3b8", fontSize: "11px", fontWeight: "800", padding: "4px 12px", borderRadius: "10px" }}>
                      {drawerTicket.dificuldade || "-"}
                    </span>
                  </div>

                  <div>
                    <span className={styles.detailLabel}>Tipo</span>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {drawerTicket.tipo === "bug" ? <Bug size={14} color="#f43f5e" /> : <HelpCircle size={14} color="#3b82f6" />}
                    </div>
                  </div>
                </div>

                {/* DESCRIÇÃO */}
                <div>
                  <span className={styles.detailLabel}>Descrição</span>
                  <div className={styles.descricaoBox}>
                    {drawerTicket.descricao ? parseMarkdownText(drawerTicket.descricao) : "Nenhuma descrição fornecida."}
                  </div>
                </div>

                {/* ANEXOS */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <span className={styles.detailLabel}>Imagem</span>
                    <span style={{ fontSize: "12.5px", color: "#64748b" }}>
                      {drawerTicket.anexoTipo === "imagem" ? "1 Imagem anexada" : "Nenhuma Imagem anexada"}
                    </span>
                  </div>
                  <div>
                    <span className={styles.detailLabel}>Vídeo</span>
                    <span style={{ fontSize: "12.5px", color: "#64748b" }}>
                      {drawerTicket.anexoTipo === "video" ? "1 Vídeo anexado" : "Nenhum vídeo anexado"}
                    </span>
                  </div>
                  {drawerTicket.anexoUrl && (
                    <div style={{ marginTop: "6px" }}>
                      {drawerTicket.anexoTipo === "video" ? (
                        <video src={drawerTicket.anexoUrl} controls style={{ width: "100%", borderRadius: "12px", maxHeight: "250px" }} />
                      ) : (
                        <img src={drawerTicket.anexoUrl} alt="Anexo" style={{ width: "100%", borderRadius: "12px", maxHeight: "250px", objectFit: "cover" }} />
                      )}
                    </div>
                  )}
                </div>

                {/* RESPOSTA AO SOLICITANTE / ATENDIMENTO */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15, 23, 42, 0.6)", padding: "14px 18px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div>
                    <span className={styles.detailLabel}>
                      {(isAdmin || modoAdmin) ? "Resposta ao Solicitante" : "Atendimento & Respostas do Suporte"}
                    </span>
                    <span style={{ fontSize: "12.5px", color: "#64748b" }}>
                      {(isAdmin || modoAdmin)
                        ? (comentariosReais.length > 0 ? `${comentariosReais.length} resposta(s) enviada(s).` : "Nenhuma resposta enviada ainda.")
                        : (comentariosReais.length > 0 ? `${comentariosReais.length} comentário(s) no ticket.` : "Aguardando primeira resposta do suporte.")
                      }
                    </span>
                  </div>
                  <button 
                    onClick={() => setDrawerTab("comentarios")}
                    className={styles.btnGreenSubmit}
                    style={{ padding: "8px 18px", fontSize: "12.5px" }}
                  >
                    {(isAdmin || modoAdmin) ? "Responder ao Aluno" : "Ver Respostas & Comentar"}
                  </button>
                </div>

                {/* GRID DE INFORMAÇÕES DE CRIADOR, RESPONSÁVEL E PRAZOS */}
                <div className={styles.detailsGrid}>
                  <div className={styles.detailCard}>
                    <span className={styles.detailLabel}>Criado por</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#3b82f6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "900" }}>
                        {drawerTicket.usuarioNome?.charAt(0).toUpperCase() || "E"}
                      </div>
                      <span className={styles.detailValue}>{drawerTicket.usuarioNome}</span>
                    </div>
                  </div>

                  {(isAdmin || modoAdmin) && (
                    <div className={styles.detailCard}>
                      <span className={styles.detailLabel}>Responsável Atribuído</span>
                      <select
                        value={drawerTicket.responsavel || "Sem responsável"}
                        onChange={(e) => handleAlterarResponsavel(drawerTicket.id, e.target.value)}
                        style={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          color: drawerTicket.responsavel && drawerTicket.responsavel !== "Sem responsável" ? "#f8fafc" : "#94a3b8",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          borderRadius: "10px",
                          padding: "6px 10px",
                          fontSize: "12.5px",
                          fontWeight: "700",
                          width: "100%",
                          outline: "none",
                          cursor: "pointer"
                        }}
                      >
                        <option value="Sem responsável">👤 Sem responsável</option>
                        {Array.from(new Set([...LISTA_RESPONSAVEIS_OPCOES, drawerTicket.responsavel])).filter(r => r && r !== "Sem responsável").map(resp => (
                          <option key={resp} value={resp}>
                            {resp === userName ? `✋ Mim (${resp})` : `👨‍💻 ${resp}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className={styles.detailCard}>
                    <span className={styles.detailLabel}>Data de Criação</span>
                    <span className={styles.detailValue}>{drawerTicket.dataCriacao}</span>
                  </div>

                  {(isAdmin || modoAdmin) && (
                    <div className={styles.detailCard}>
                      <span className={styles.detailLabel}>Prazo</span>
                      <span className={styles.detailValue} style={{ color: "#ea580c" }}>{drawerTicket.prazo || "25/10/2026"}</span>
                    </div>
                  )}

                  <div className={styles.detailCard} style={{ gridColumn: (isAdmin || modoAdmin) ? "span 2" : "span 1" }}>
                    <span className={styles.detailLabel}>Data de Conclusão</span>
                    <span className={styles.detailValue} style={{ color: isResolvido ? "#10b981" : "#64748b" }}>
                      {isResolvido ? (drawerTicket.concluidoEm && drawerTicket.concluidoEm !== "Não concluído" ? drawerTicket.concluidoEm : (drawerTicket.dataCriacao?.split(",")[0] || "Hoje")) : "Não concluído"}
                    </span>
                  </div>
                </div>
              </>
            )}

            {drawerTab === "comentarios" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* SUBHEADER TICKET PAI */}
                <div>
                  <span 
                    style={{
                      backgroundColor: "rgba(16, 185, 129, 0.18)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.4)",
                      fontSize: "12px", fontWeight: "800", padding: "6px 14px", borderRadius: "10px", display: "inline-block"
                    }}
                  >
                    Ticket Pai: {drawerTicket.titulo}
                  </span>
                </div>

                {/* HISTÓRICO DE COMENTÁRIOS */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {comentariosReais.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "30px 10px", background: "rgba(15, 23, 42, 0.5)", borderRadius: "16px", border: "1px dashed rgba(255,255,255,0.08)" }}>
                      <MessageSquare size={36} color="#64748b" style={{ marginBottom: "10px" }} />
                      <h5 style={{ margin: 0, color: "#f8fafc", fontSize: "14px", fontWeight: "800" }}>Nenhum comentário ainda</h5>
                      <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#94a3b8" }}>Seja o primeiro a comentar neste ticket.</p>
                    </div>
                  ) : (
                    comentariosReais.map(m => {
                      const isEditingThis = editandoComentarioId === m.id;
                      const isMenuOpen = menuAbertoComentarioId === m.id;

                      return (
                        <div 
                          key={m.id} 
                          style={{
                            background: m.role === "admin" ? "rgba(16, 185, 129, 0.08)" : "rgba(15, 23, 42, 0.8)",
                            border: m.role === "admin" ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "14px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px",
                            position: "relative"
                          }}
                        >
                          {/* HEADER DO COMENTÁRIO */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "14px", fontWeight: "900", color: m.role === "admin" ? "#10b981" : "#38bdf8" }}>
                              {m.autor} {m.role === "admin" && "🛡️ (Suporte DevHub)"}
                            </span>

                            <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative" }}>
                              <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>{m.data}</span>

                              {/* BOTÃO 3 PONTINHOS */}
                              <button
                                type="button"
                                onClick={() => setMenuAbertoComentarioId(isMenuOpen ? null : m.id)}
                                style={{
                                  background: isMenuOpen ? "rgba(255,255,255,0.12)" : "transparent",
                                  border: "none",
                                  borderRadius: "6px",
                                  padding: "2px 4px",
                                  color: "#94a3b8",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}
                                title="Opções do comentário"
                              >
                                <MoreVertical size={16} />
                              </button>

                              {/* MENU DROPDOWN 3 PONTINHOS */}
                              {isMenuOpen && (
                                <div style={{
                                  position: "absolute",
                                  top: "26px",
                                  right: "0",
                                  backgroundColor: "rgba(15, 23, 42, 0.98)",
                                  border: "1px solid rgba(255, 255, 255, 0.15)",
                                  borderRadius: "12px",
                                  padding: "6px",
                                  boxShadow: "0 8px 24px rgba(0,0,0,0.7)",
                                  zIndex: 40,
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "4px",
                                  minWidth: "140px"
                                }}>
                                  {/* RESPONDER */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRespondingToComment({ id: m.id, autor: m.autor, texto: m.texto });
                                      setMenuAbertoComentarioId(null);
                                      setTimeout(() => commentTextareaRef.current?.focus(), 50);
                                    }}
                                    style={{ background: "none", border: "none", color: "#60a5fa", padding: "6px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", textAlign: "left" }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.15)"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                  >
                                    <Reply size={14} /> Responder
                                  </button>

                                  {/* EDITAR COM TEMPO LIMITE */}
                                  {(m.autor === userName || m.email === userEmail || isAdmin || modoAdmin) && podeEditarComentario(m) && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditandoComentarioId(m.id);
                                        setTextoEdicaoComentario(m.texto || "");
                                        setMenuAbertoComentarioId(null);
                                      }}
                                      style={{ background: "none", border: "none", color: "#f59e0b", padding: "6px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", textAlign: "left" }}
                                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(245, 158, 11, 0.15)"}
                                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                    >
                                      <Edit3 size={14} /> Editar
                                    </button>
                                  )}

                                  {/* EXCLUIR */}
                                  {(isAdmin || modoAdmin || m.autor === userName || m.email === userEmail) && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleExcluirComentarioDrawer(m.id);
                                        setMenuAbertoComentarioId(null);
                                      }}
                                      style={{ background: "none", border: "none", color: "#ef4444", padding: "6px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", textAlign: "left" }}
                                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.15)"}
                                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                    >
                                      <Trash2 size={14} /> Excluir
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* CORPO DO COMENTÁRIO (EDIÇÃO vs EXIBIÇÃO) */}
                          {isEditingThis ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                              <textarea
                                className={styles.textarea}
                                style={{ fontSize: "12.5px", minHeight: "70px", padding: "8px 10px" }}
                                value={textoEdicaoComentario}
                                onChange={(e) => setTextoEdicaoComentario(e.target.value)}
                              />
                              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                <button
                                  type="button"
                                  onClick={() => { setEditandoComentarioId(null); setTextoEdicaoComentario(""); }}
                                  style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "12px", cursor: "pointer" }}
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSalvarEdicaoComentarioDrawer(m.id)}
                                  style={{ backgroundColor: "#10b981", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}
                                >
                                  Salvar Alterações
                                </button>
                              </div>
                            </div>
                          ) : (
                            renderConteudoComentario(m)
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* FORMULÁRIO DE ADICIONAR COMENTÁRIO */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", position: "relative" }}>
                  <h5 style={{ margin: 0, fontSize: "14.5px", fontWeight: "900", color: "#f8fafc" }}>Adicionar comentário</h5>

                  {/* BANNER DE RESPOSTA ATIVA */}
                  {respondingToComment && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "rgba(59, 130, 246, 0.12)",
                      borderLeft: "4px solid #3b82f6",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      borderLeftWidth: "4px",
                      borderRadius: "12px",
                      padding: "10px 14px",
                      gap: "12px"
                    }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px", flex: 1, overflow: "hidden" }}>
                        <span style={{ fontSize: "12px", fontWeight: "900", color: "#60a5fa", display: "flex", alignItems: "center", gap: "5px" }}>
                          <Reply size={13} /> Respondendo a <strong style={{ color: "#f8fafc" }}>@{respondingToComment.autor}</strong>
                        </span>
                        <span style={{ fontSize: "13px", color: "#cbd5e1", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          {respondingToComment.texto}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRespondingToComment(null)}
                        style={{
                          background: "rgba(255, 255, 255, 0.08)",
                          border: "none",
                          color: "#94a3b8",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        title="Cancelar resposta"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}



                  <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "8px",
                      background: "rgba(15, 23, 42, 0.95)",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                      padding: "8px 14px"
                    }}>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <button 
                          type="button"
                          style={{
                            background: editorTab === "escrever" ? "rgba(16, 185, 129, 0.18)" : "transparent",
                            color: editorTab === "escrever" ? "#10b981" : "#94a3b8",
                            border: editorTab === "escrever" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid transparent",
                            borderRadius: "8px",
                            padding: "6px 14px",
                            fontSize: "13px",
                            fontWeight: "800",
                            cursor: "pointer",
                            transition: "all 0.15s ease"
                          }}
                          onClick={() => setEditorTab("escrever")}
                        >
                          Escrever
                        </button>
                        <button 
                          type="button"
                          style={{
                            background: editorTab === "preview" ? "rgba(16, 185, 129, 0.18)" : "transparent",
                            color: editorTab === "preview" ? "#10b981" : "#94a3b8",
                            border: editorTab === "preview" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid transparent",
                            borderRadius: "8px",
                            padding: "6px 14px",
                            fontSize: "13px",
                            fontWeight: "800",
                            cursor: "pointer",
                            transition: "all 0.15s ease"
                          }}
                          onClick={() => setEditorTab("preview")}
                        >
                          Preview
                        </button>
                      </div>

                      <div style={{ height: "20px", width: "1px", background: "rgba(255,255,255,0.12)" }} />

                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <button type="button" onClick={() => inserirMarkdown("## ")} className={styles.editorToolbarBtn} title="Título (H2)"><Heading2 size={16} /></button>
                        <button type="button" onClick={() => inserirMarkdown("**", "**")} className={styles.editorToolbarBtn} title="Negrito"><Bold size={16} /></button>
                        <button type="button" onClick={() => inserirMarkdown("*", "*")} className={styles.editorToolbarBtn} title="Itálico"><Italic size={16} /></button>
                        <button type="button" onClick={() => inserirMarkdown("- ")} className={styles.editorToolbarBtn} title="Lista"><List size={16} /></button>
                        <button type="button" onClick={() => inserirMarkdown("> ")} className={styles.editorToolbarBtn} title="Citação"><Quote size={16} /></button>
                        <button type="button" onClick={() => inserirMarkdown("`", "`")} className={styles.editorToolbarBtn} title="Código"><Code size={16} /></button>
                        <button type="button" onClick={() => inserirMarkdown("[", "](https://)")} className={styles.editorToolbarBtn} title="Link"><Link2 size={16} /></button>
                      </div>
                    </div>

                    {editorTab === "escrever" ? (
                      <textarea
                        ref={commentTextareaRef}
                        className={styles.textarea}
                        style={{ border: "none", borderRadius: 0, minHeight: "110px", padding: "12px 14px", fontSize: "14px", lineHeight: "1.5" }}
                        placeholder="Escreva seu comentário..."
                        value={novoComentarioDrawer}
                        onChange={(e) => setNovoComentarioDrawer(e.target.value)}
                      />
                    ) : (
                      <div style={{ padding: "14px", minHeight: "110px", background: "rgba(3, 7, 18, 0.6)", fontSize: "14.5px", color: "#cbd5e1" }}>
                        {novoComentarioDrawer.trim() ? parseMarkdownText(novoComentarioDrawer) : <span style={{ color: "#64748b" }}>Nada para visualizar ainda.</span>}
                      </div>
                    )}

                    {/* ANEXO DE MÍDIA PREVIEW (IMAGEM OU VÍDEO) */}
                    {commentAnexoUrl && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        background: commentAnexoTipo === "video" ? "rgba(59, 130, 246, 0.15)" : "rgba(16, 185, 129, 0.12)",
                        borderTop: commentAnexoTipo === "video" ? "1px solid rgba(59, 130, 246, 0.35)" : "1px solid rgba(16, 185, 129, 0.3)",
                        padding: "8px 14px"
                      }}>
                        {commentAnexoTipo === "video" ? (
                          <video src={commentAnexoUrl} style={{ width: "52px", height: "38px", borderRadius: "8px", objectFit: "cover", background: "#000" }} />
                        ) : (
                          <img src={commentAnexoUrl} alt="Preview" style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover" }} />
                        )}
                        <div style={{ flex: 1, overflow: "hidden" }}>
                          <span style={{ fontSize: "12px", fontWeight: "800", color: commentAnexoTipo === "video" ? "#93c5fd" : "#6ee7b7", display: "block" }}>
                            {commentAnexoTipo === "video" ? "🎥 Vídeo Anexado:" : "📷 Imagem Anexada:"}
                          </span>
                          <span style={{ fontSize: "11.5px", color: "#94a3b8", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", display: "block" }}>
                            {commentAnexoNome || (commentAnexoTipo === "video" ? "Vídeo de demonstração" : "Print de Tela")}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setCommentAnexoUrl(null); setCommentAnexoNome(null); setCommentAnexoTipo(null); }}
                          style={{ background: "rgba(239, 68, 68, 0.2)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#ef4444", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          title="Remover Mídia Anexada"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(15, 23, 42, 0.9)", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "11px", color: "#64748b" }}>
                      <span>Markdown é suportado</span>
                      <span>Anexar Mídia (Máx: 5MB Foto / 15MB Vídeo)</span>
                    </div>
                  </div>

                  {/* POPUP DE EMOJIS */}
                  {showEmojiPicker && (
                    <div style={{
                      backgroundColor: "rgba(15, 23, 42, 0.98)",
                      border: "1px solid rgba(139, 92, 246, 0.4)",
                      borderRadius: "14px",
                      padding: "10px 14px",
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      maxWidth: "280px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                      zIndex: 10
                    }}>
                      {EMOJIS_POPULARES.map(em => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => inserirEmoji(em)}
                          style={{
                            background: "rgba(255,255,255,0.08)",
                            border: "none",
                            borderRadius: "8px",
                            padding: "6px",
                            fontSize: "16px",
                            cursor: "pointer",
                            transition: "transform 0.15s ease"
                          }}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* POPUP BANNER DE MENSAGENS PRONTAS (EXCLUSIVO ADMIN) */}
                  {(isAdmin || modoAdmin) && showMensagensProntasBanner && (
                    <div style={{
                      backgroundColor: "rgba(15, 23, 42, 0.98)",
                      border: "1px solid rgba(16, 185, 129, 0.4)",
                      borderRadius: "16px",
                      padding: "14px 16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      maxWidth: "480px",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.8)",
                      zIndex: 20,
                      marginTop: "6px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#10b981", fontSize: "13px", fontWeight: "900" }}>
                          <MessageSquare size={16} />
                          <span>⚡ Mensagens Prontas & Respostas Rápidas</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {!criandoMensagemPronta && (
                            <button
                              type="button"
                              onClick={() => setCriandoMensagemPronta(true)}
                              style={{
                                backgroundColor: "rgba(16, 185, 129, 0.2)",
                                color: "#10b981",
                                border: "1px solid rgba(16, 185, 129, 0.4)",
                                borderRadius: "8px",
                                padding: "4px 10px",
                                fontSize: "11.5px",
                                fontWeight: "800",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              <PlusCircle size={13} /> Add Nova
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => { setShowMensagensProntasBanner(false); setCriandoMensagemPronta(false); }}
                            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>

                      {/* FORMULÁRIO DE CRIAÇÃO DE NOVA MENSAGEM PRONTA PELO ADMIN */}
                      {criandoMensagemPronta ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "rgba(16, 185, 129, 0.08)", padding: "12px", borderRadius: "12px", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
                          <span style={{ fontSize: "12px", fontWeight: "900", color: "#6ee7b7" }}>✨ Criar Nova Resposta Rápida (Admin)</span>
                          <input
                            type="text"
                            placeholder="Título (ex: 📌 Solicitar Logs do Servidor)"
                            value={novaMsgProntaTitulo}
                            onChange={(e) => setNovaMsgProntaTitulo(e.target.value)}
                            className={styles.input}
                            style={{ fontSize: "12px", padding: "8px 10px" }}
                          />
                          <textarea
                            placeholder="Texto da mensagem rápida..."
                            value={novaMsgProntaTexto}
                            onChange={(e) => setNovaMsgProntaTexto(e.target.value)}
                            className={styles.textarea}
                            style={{ fontSize: "12px", minHeight: "70px", padding: "8px 10px" }}
                          />
                          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button
                              type="button"
                              onClick={() => setCriandoMensagemPronta(false)}
                              style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "12px", cursor: "pointer" }}
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={handleSalvarNovaMensagemPronta}
                              style={{ backgroundColor: "#10b981", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}
                            >
                              Salvar Mensagem
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "240px", overflowY: "auto" }}>
                          {mensagensProntas.map(msg => (
                            <div
                              key={msg.id}
                              onClick={() => {
                                setNovoComentarioDrawer(prev => prev ? prev + "\n\n" + msg.texto : msg.texto);
                                setShowMensagensProntasBanner(false);
                              }}
                              style={{
                                backgroundColor: "rgba(30, 41, 59, 0.7)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                borderRadius: "10px",
                                padding: "10px 12px",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: "8px"
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.5)"; e.currentTarget.style.backgroundColor = "rgba(16, 185, 129, 0.12)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)"; e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.7)"; }}
                            >
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "12.5px", fontWeight: "800", color: "#f8fafc", marginBottom: "2px" }}>{msg.titulo}</div>
                                <div style={{ fontSize: "11.5px", color: "#94a3b8", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{msg.texto}</div>
                              </div>
                              {msg.custom && (
                                <button
                                  type="button"
                                  onClick={(e) => handleExcluirMensagemPronta(msg.id, e)}
                                  style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "2px" }}
                                  title="Excluir mensagem pronta personalizada"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button type="button" onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowMensagensProntasBanner(false); }} className={styles.editorBtn} title="Inserir Emoji"><Smile size={16} /></button>
                      {(isAdmin || modoAdmin) && (
                        <button 
                          type="button" 
                          onClick={() => { setShowMensagensProntasBanner(!showMensagensProntasBanner); setShowEmojiPicker(false); }} 
                          className={styles.editorBtn} 
                          style={{ color: showMensagensProntasBanner ? "#10b981" : "#94a3b8", backgroundColor: showMensagensProntasBanner ? "rgba(16, 185, 129, 0.15)" : "transparent" }}
                          title="Respostas Rápidas / Mensagens Prontas (Suporte)"
                        >
                          <MessageSquare size={16} />
                        </button>
                      )}
                      
                      <input 
                        ref={commentImageInputRef} 
                        type="file" 
                        accept="image/*,video/*,.mp4,.webm,.mov,.mkv,.avi,.m4v" 
                        onChange={handleCommentImageUpload} 
                        style={{ display: "none" }} 
                      />
                      <button 
                        type="button"
                        onClick={() => commentImageInputRef.current?.click()}
                        style={{
                          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)",
                          border: "1px solid rgba(16, 185, 129, 0.35)",
                          color: "#6ee7b7",
                          borderRadius: "12px",
                          padding: "7px 14px",
                          fontSize: "12.5px",
                          fontWeight: "800",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.6)";
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow = "0 6px 16px rgba(16, 185, 129, 0.25)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.35)";
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
                        }}
                        title="Anexar print, imagem de apoio ou vídeo"
                      >
                        <ImageIcon size={15} color="#10b981" />
                        <span>Anexar Imagem / Vídeo</span>
                      </button>
                    </div>

                    <button 
                      type="button"
                      onClick={handleAdicionarComentarioDrawer}
                      className={styles.btnGreenSubmit}
                    >
                      Adicionar comentário
                    </button>
                  </div>
                </div>
              </div>
            )}

            {drawerTab === "historico" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "12px 6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <Clock size={22} color="#10b981" />
                  <h5 style={{ margin: 0, color: "#f8fafc", fontSize: "17.5px", fontWeight: "800", letterSpacing: "-0.2px" }}>Linha do Tempo do Ticket</h5>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px", borderLeft: "2px solid rgba(255, 255, 255, 0.16)", paddingLeft: "22px", marginLeft: "10px" }}>
                  {/* EVENTO: CRIAÇÃO DO TICKET */}
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "-29px", top: "3px", width: "14px", height: "14px", borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 10px rgba(59, 130, 246, 0.7)" }} />
                    <div style={{ fontSize: "15px", fontWeight: "800", color: "#f8fafc" }}>📌 Ticket Criado no Sistema</div>
                    <div style={{ fontSize: "13.5px", color: "#cbd5e1", marginTop: "4px", lineHeight: "1.4" }}>
                      Aberto por <strong style={{ color: "#60a5fa", fontWeight: "800" }}>{drawerTicket.usuarioNome}</strong> em {drawerTicket.dataCriacao}
                    </div>
                  </div>

                  {/* EVENTOS: HISTÓRICO DE MENSAGENS / RESPOSTAS */}
                  {(drawerTicket.mensagens || []).map((m, idx) => {
                    const isSuporte = m.isSupport || m.role === "admin" || m.autor === "Sistema DevHub" || m.autor === "Suporte DevHub";
                    return (
                      <div key={m.id || idx} style={{ position: "relative" }}>
                        <div style={{ position: "absolute", left: "-29px", top: "3px", width: "14px", height: "14px", borderRadius: "50%", background: isSuporte ? "#10b981" : "#a855f7", boxShadow: isSuporte ? "0 0 10px rgba(16, 185, 129, 0.7)" : "0 0 10px rgba(168, 85, 247, 0.7)" }} />
                        <div style={{ fontSize: "15px", fontWeight: "800", color: isSuporte ? "#6ee7b7" : "#e9d5ff" }}>
                          {isSuporte ? "💬 Resposta do Suporte / Sistema" : "💬 Comentário do Aluno"}
                        </div>
                        <div style={{ fontSize: "13.5px", color: "#cbd5e1", marginTop: "4px", lineHeight: "1.4" }}>
                          <strong style={{ color: "#f8fafc", fontWeight: "800" }}>{m.autor}</strong> enviou uma mensagem em {m.data || "Recente"}
                        </div>
                      </div>
                    );
                  })}

                  {/* EVENTO DE STATUS FINAL: REALIZADO (CONCLUÍDO) */}
                  {drawerTicket.status === "Resolvido" && (
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: "-29px", top: "3px", width: "14px", height: "14px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 12px rgba(16, 185, 129, 0.9)" }} />
                      <div style={{ fontSize: "15px", fontWeight: "800", color: "#10b981" }}>✅ Ticket Realizado & Concluído</div>
                      <div style={{ fontSize: "13.5px", color: "#cbd5e1", marginTop: "4px", lineHeight: "1.4" }}>
                        Finalizado em <strong style={{ color: "#34d399" }}>{drawerTicket.concluidoEm && drawerTicket.concluidoEm !== "Não concluído" ? drawerTicket.concluidoEm : "Recente"}</strong>
                      </div>
                    </div>
                  )}

                  {/* EVENTO DE STATUS FINAL: NEGADO / REJEITADO */}
                  {(drawerTicket.status === "Rejeitado" || drawerTicket.status === "Negado") && (
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: "-29px", top: "3px", width: "14px", height: "14px", borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 12px rgba(239, 68, 68, 0.9)" }} />
                      <div style={{ fontSize: "15px", fontWeight: "800", color: "#ef4444" }}>❌ Ticket Negado / Recusado</div>
                      <div style={{ fontSize: "13.5px", color: "#fca5a5", marginTop: "4px", lineHeight: "1.4" }}>
                        Motivo: <strong style={{ color: "#f87171" }}>{drawerTicket.motivoRejeicao || "Solicitação não aprovada pela equipe técnica."}</strong>
                      </div>
                    </div>
                  )}

                  {/* EVENTO DE STATUS: EM ATENDIMENTO */}
                  {(drawerTicket.status === "Aberto" || drawerTicket.status === "Em Análise") && (
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: "-29px", top: "3px", width: "14px", height: "14px", borderRadius: "50%", background: "#38bdf8", boxShadow: "0 0 10px rgba(56, 189, 248, 0.8)" }} />
                      <div style={{ fontSize: "15px", fontWeight: "800", color: "#38bdf8" }}>⚡ Ticket Aceito & Em Atendimento</div>
                      <div style={{ fontSize: "13.5px", color: "#cbd5e1", marginTop: "4px", lineHeight: "1.4" }}>
                        Responsável atribuído: <strong style={{ color: "#7dd3fc" }}>{drawerTicket.responsavel && drawerTicket.responsavel !== "Sem responsável" ? drawerTicket.responsavel : "Equipe DevHub"}</strong>
                      </div>
                    </div>
                  )}

                  {/* EVENTO DE STATUS: PENDENTE */}
                  {drawerTicket.status === "Pendente" && (
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: "-29px", top: "3px", width: "14px", height: "14px", borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 10px rgba(245, 158, 11, 0.8)" }} />
                      <div style={{ fontSize: "15px", fontWeight: "800", color: "#f59e0b" }}>⏳ Ticket Pendente de Triagem</div>
                      <div style={{ fontSize: "13.5px", color: "#fde68a", marginTop: "4px", lineHeight: "1.4" }}>
                        Aguardando análise da equipe técnica na Caixa de Correio.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const contentJSX = (
    <div className={styles.container}>
      {/* HEADER PRINCIPAL DO MÓDULO DE TICKETS */}
      <div className={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className={styles.iconCircle}>
            <LifeBuoy size={24} color="#10b981" />
          </div>
          <div>
            <h2 className={styles.title}>DevHub • Central de Tickets & Suporte</h2>
            <p className={styles.subtitle}>
              Envie dúvidas, reporte bugs ou solicite suporte. Nossa equipe técnica responde em até 24h!
            </p>
          </div>
        </div>

      </div>

      {/* TABS PRINCIPAIS */}
      <div className={styles.navTabs}>
        {!modoAdmin && (
          <>
            <button
              className={`${styles.navTab} ${abaAtiva === "criar" ? styles.navTabActive : ""}`}
              onClick={() => setAbaAtiva("criar")}
            >
              <PlusCircle size={16} /> Abrir Novo Ticket
            </button>
            <button
              className={`${styles.navTab} ${abaAtiva === "meus_tickets" ? styles.navTabActive : ""}`}
              onClick={() => setAbaAtiva("meus_tickets")}
            >
              <Ticket size={16} /> Meus Tickets ({meusTickets.length})
            </button>
          </>
        )}

        {/* APENAS SE FOR NO MÓDULO DE GESTÃO DO SUPERADMIN */}
        {modoAdmin && (
          <>
            <button
              className={`${styles.navTab} ${abaAtiva === "correio" ? styles.navTabActive : ""}`}
              onClick={() => setAbaAtiva("correio")}
              style={{ position: "relative" }}
            >
              <Inbox size={16} color="#f59e0b" /> Caixa de Correio (Triagem)
              {countPendentes > 0 && (
                <span className={styles.badgeCount}>
                  {countPendentes}
                </span>
              )}
            </button>
            <button
              className={`${styles.navTab} ${abaAtiva === "todos" ? styles.navTabActive : ""}`}
              onClick={() => setAbaAtiva("todos")}
            >
              <ShieldCheck size={16} color="#a855f7" /> Gestão de Tickets ({totalTickets})
            </button>
          </>
        )}
      </div>

      {/* ALERTA DE SUCESSO */}
      {sucessoMsg && (
        <div style={{
          backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)",
          color: "#6ee7b7", padding: "12px 18px", borderRadius: "14px", fontSize: "14px", fontWeight: "700"
        }}>
          {sucessoMsg}
        </div>
      )}

      {/* TAB 1: FORMULÁRIO PARA CRIAR TICKET */}
      {abaAtiva === "criar" && !modoAdmin && (
        <form onSubmit={handleCriarTicket} className={styles.formCard} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#f8fafc", margin: "0" }}>
              ✏️ Descreva sua dúvida ou problema
            </h3>
            <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: "700" }}>
              * Campos obrigatórios
            </span>
          </div>

          {/* 1. TÍTULO DO TICKET */}
          <div>
            <label className={styles.label} style={{ display: "block", marginBottom: "6px" }}>
              Título do Ticket: <span style={{ color: "#ef4444", fontWeight: "900" }}>*</span>
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="Ex: Erro ao executar o terminal no módulo de React"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          {/* 2. DESCRIÇÃO DETALHADA */}
          <div>
            <label className={styles.label} style={{ display: "block", marginBottom: "6px" }}>
              Descrição Detalhada: <span style={{ color: "#ef4444", fontWeight: "900" }}>*</span>
            </label>
            <textarea
              className={styles.textarea}
              placeholder="Explique o que aconteceu, o que você esperava que ocorresse e como reproduzir..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>

          {/* 3. CARDS INTERATIVOS PARA TIPO DO TICKET */}
          <div>
            <label className={styles.label} style={{ display: "block", marginBottom: "8px" }}>Tipo do ticket</label>
            <div className={styles.tipoCardsGrid}>
              <div
                className={`${styles.tipoCard} ${styles.tipoCardBug} ${tipo === "bug" ? styles.tipoCardBugActive : ""}`}
                onClick={() => setTipo("bug")}
              >
                <div className={styles.tipoIconBox}>
                  <Bug size={22} />
                </div>
                <span className={styles.tipoCardText}>Bug</span>
              </div>

              <div
                className={`${styles.tipoCard} ${styles.tipoCardMelhoria} ${tipo === "melhoria" ? styles.tipoCardMelhoriaActive : ""}`}
                onClick={() => setTipo("melhoria")}
              >
                <div className={styles.tipoIconBox}>
                  <Lightbulb size={22} />
                </div>
                <span className={styles.tipoCardText}>Sugestão</span>
              </div>

              <div
                className={`${styles.tipoCard} ${styles.tipoCardDuvida} ${tipo === "duvida" ? styles.tipoCardDuvidaActive : ""}`}
                onClick={() => setTipo("duvida")}
              >
                <div className={styles.tipoIconBox}>
                  <Headphones size={22} />
                </div>
                <span className={styles.tipoCardText}>Suporte</span>
              </div>
            </div>
          </div>

          {/* 4. PRIORIDADE & DIFICULDADE */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label className={styles.label} style={{ display: "block", marginBottom: "6px" }}>Prioridade</label>
              <select className={styles.select} value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
                <option value="baixa">Baixa 🟢</option>
                <option value="media">Média 🔵</option>
                <option value="alta">Alta 🟠</option>
                <option value="critica">Crítica 🔴</option>
              </select>
            </div>

            <div>
              <label className={styles.label} style={{ display: "block", marginBottom: "6px" }}>Dificuldade</label>
              <select className={styles.select} value={dificuldade} onChange={(e) => setDificuldade(e.target.value)}>
                <option value="Fácil">🟢 Fácil</option>
                <option value="Média">🟡 Média</option>
                <option value="Difícil">🔴 Difícil</option>
              </select>
            </div>
          </div>

          {/* UPLOAD DE ANEXO DE MÍDIA */}
          <div>
            <label className={styles.label}>Anexar Imagem ou Vídeo (Opcional):</label>
            <label className={styles.uploadBox}>
              <Upload size={22} color="#10b981" />
              <span style={{ fontSize: "13px", color: "#94a3b8" }}>
                {anexoNome ? `Anexado: ${anexoNome}` : "Clique para anexar print ou vídeo (Máx: 5MB Foto / 15MB Vídeo)"}
              </span>
              <input type="file" accept="image/*,video/*,.mp4,.webm,.mov,.mkv,.avi,.m4v" onChange={handleFileUpload} style={{ display: "none" }} />
            </label>

            {anexoUrl && (
              <div style={{ marginTop: "12px", position: "relative", display: "inline-block" }}>
                {anexoTipo === "video" ? (
                  <video src={anexoUrl} controls className={styles.previewVideo} />
                ) : (
                  <img src={anexoUrl} alt="Preview" className={styles.previewImg} />
                )}
                <button
                  type="button"
                  onClick={() => { setAnexoUrl(null); setAnexoTipo(null); setAnexoNome(null); }}
                  style={{
                    position: "absolute", top: "8px", right: "8px", backgroundColor: "rgba(239, 68, 68, 0.85)",
                    color: "#fff", border: "none", borderRadius: "50%", width: "26px", height: "26px",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                  title="Remover anexo"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <button type="submit" className={styles.submitBtn}>
            <Send size={18} /> Enviar Ticket para Análise
          </button>
        </form>
      )}

      {/* TAB: CAIXA DE CORREIO PARA O SUPERADMIN */}
      {abaAtiva === "correio" && (isAdmin || modoAdmin) && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px" }}>
            <button
              onClick={() => setSubAbaCorreio("pendentes")}
              style={{
                background: subAbaCorreio === "pendentes" ? "rgba(245, 158, 11, 0.2)" : "transparent",
                color: subAbaCorreio === "pendentes" ? "#f59e0b" : "#94a3b8",
                border: subAbaCorreio === "pendentes" ? "1px solid rgba(245, 158, 11, 0.4)" : "1px solid transparent",
                padding: "8px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: "800", cursor: "pointer"
              }}
            >
              📥 Solicitações Pendentes de Aprovação ({countPendentes})
            </button>
            <button
              onClick={() => setSubAbaCorreio("rejeitados")}
              style={{
                background: subAbaCorreio === "rejeitados" ? "rgba(239, 68, 68, 0.2)" : "transparent",
                color: subAbaCorreio === "rejeitados" ? "#ef4444" : "#94a3b8",
                border: subAbaCorreio === "rejeitados" ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid transparent",
                padding: "8px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: "800", cursor: "pointer"
              }}
            >
              ❌ Tickets Rejeitados na Triagem ({countRejeitados})
            </button>
          </div>

          {subAbaCorreio === "pendentes" && (
            <div className={styles.ticketsList}>
              {tickets.filter(t => t.status === "Pendente").length === 0 ? (
                <div className={styles.emptyWrap}>
                  <Inbox size={42} color="#f59e0b" />
                  <h4 style={{ color: "#f8fafc", margin: "10px 0 4px 0", fontSize: "16px", fontWeight: "800" }}>Caixa de Correio limpa!</h4>
                  <p style={{ fontSize: "13px", color: "#94a3b8" }}>Nenhum ticket aguardando triagem no momento.</p>
                </div>
              ) : (
                tickets.filter(t => t.status === "Pendente").map(t => (
                  <div key={t.id} className={styles.ticketCard} style={{ borderLeft: "4px solid #f59e0b" }}>
                    <div className={styles.ticketCardHeader}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span className={styles.ticketId}>{t.id}</span>
                        {renderTipoBadge(t.tipo)}
                        <span className={styles.prioridadeBadge}>{t.prioridadeLabel}</span>
                      </div>
                      <span style={{ backgroundColor: "rgba(245, 158, 11, 0.18)", color: "#f59e0b", padding: "4px 12px", borderRadius: "10px", fontSize: "12px", fontWeight: "800" }}>
                        🟡 Aguardando Triagem
                      </span>
                    </div>

                    <h4 className={styles.ticketTitle}>{t.titulo}</h4>

                    <div style={{ fontSize: "12px", color: "#94a3b8", display: "flex", gap: "10px", alignItems: "center" }}>
                      <span style={{ fontWeight: "700", color: "#e2e8f0" }}>👤 {t.usuarioNome} ({t.usuarioEmail})</span>
                      <span>•</span>
                      <span>🕒 {t.dataCriacao}</span>
                    </div>

                    <div className={styles.descricaoBox}>{t.descricao ? parseMarkdownText(t.descricao) : "Nenhuma descrição fornecida."}</div>

                    {/* ATRIBUIÇÃO E BOTÃO ÚNICO DE ACEITE (CAIXA DE CORREIO) */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "14px" }}>
                      <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
                        
                        {/* SELETOR DE MODO DE ACEITE */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 260px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "800", color: "#94a3b8" }}>
                            Opção de Aceite do Ticket:
                          </label>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                            <select
                              value={modoAceiteMap[t.id] || "mim"}
                              onChange={(e) => {
                                const newModo = e.target.value;
                                setModoAceiteMap({ ...modoAceiteMap, [t.id]: newModo });
                                if (newModo === "outro" && !outroResponsavelMap[t.id]) {
                                  const listaAdmins = LISTA_RESPONSAVEIS_OPCOES;
                                  const defaultOutro = listaAdmins.find(u => u !== userName) || listaAdmins[0] || "Suporte DevHub";
                                  setOutroResponsavelMap({ ...outroResponsavelMap, [t.id]: defaultOutro });
                                }
                              }}
                              style={{
                                backgroundColor: "rgba(15, 23, 42, 0.95)",
                                color: "#f8fafc",
                                border: "1px solid rgba(16, 185, 129, 0.4)",
                                borderRadius: "10px",
                                padding: "8px 12px",
                                fontSize: "12.5px",
                                fontWeight: "800",
                                cursor: "pointer",
                                outline: "none"
                              }}
                            >
                              <option value="mim">✋ Aceitar para mim ({userName})</option>
                              <option value="outro">👥 Aceitar para outro responsável</option>
                            </select>

                            {modoAceiteMap[t.id] === "outro" && (() => {
                              const listaAdmins = LISTA_RESPONSAVEIS_OPCOES;
                              const selectedVal = outroResponsavelMap[t.id] || (listaAdmins.find(u => u !== userName) || listaAdmins[0] || userName);
                              return (
                                <select
                                  value={selectedVal}
                                  onChange={(e) => setOutroResponsavelMap({ ...outroResponsavelMap, [t.id]: e.target.value })}
                                  style={{
                                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                                    color: "#38bdf8",
                                    border: "1px solid rgba(56, 189, 248, 0.5)",
                                    borderRadius: "10px",
                                    padding: "8px 12px",
                                    fontSize: "12.5px",
                                    fontWeight: "800",
                                    cursor: "pointer",
                                    outline: "none"
                                  }}
                                >
                                  {listaAdmins.map(adminName => (
                                    <option key={adminName} value={adminName}>
                                      👑 {adminName} {adminName === userName ? "(Você)" : ""}
                                    </option>
                                  ))}
                                </select>
                              );
                            })()}
                          </div>
                        </div>

                        {/* BOTÃO ÚNICO DE ACEITE */}
                        <button
                          onClick={() => {
                            const modo = modoAceiteMap[t.id] || "mim";
                            const listaSA = (Array.isArray(superAdminUsersRemotos) && superAdminUsersRemotos.length > 0)
                              ? superAdminUsersRemotos
                              : [userName, "Suporte DevHub", "Beatriz Santana", "Nicholas Araujo"];
                            const defaultOutro = listaSA.find(u => u !== userName) || listaSA[0] || userName;
                            const respFinal = modo === "outro" 
                              ? (outroResponsavelMap[t.id] || defaultOutro) 
                              : userName;
                            handleAprovarTicket(t.id, respFinal);
                          }}
                          style={{
                            backgroundColor: "#10b981", color: "#fff", border: "none",
                            padding: "10px 20px", borderRadius: "12px", fontSize: "13px", fontWeight: "800",
                            cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                            boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)", minHeight: "38px"
                          }}
                          title="Aprovar e aceitar o ticket"
                        >
                          <Check size={16} /> Aceitar Ticket
                        </button>

                        {/* BOTÃO REJEITAR */}
                        <button
                          onClick={() => setTicketRejeitandoId(t.id)}
                          style={{
                            backgroundColor: "rgba(239, 68, 68, 0.18)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.4)",
                            padding: "10px 16px", borderRadius: "12px", fontSize: "13px", fontWeight: "800",
                            cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", minHeight: "38px"
                          }}
                        >
                          <X size={16} /> Rejeitar Ticket
                        </button>
                      </div>
                    </div>

                    {/* CAMPOS DE REJEIÇÃO */}
                    {ticketRejeitandoId === t.id && (
                      <div style={{ marginTop: "12px", background: "rgba(239, 68, 68, 0.1)", padding: "14px", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                        <label style={{ fontSize: "12px", fontWeight: "800", color: "#f87171", display: "block", marginBottom: "6px" }}>
                          Motivo da Rejeição para o Aluno:
                        </label>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="Ex: Por favor forneça mais detalhes ou o link do arquivo..."
                          value={motivoRejeicaoInput}
                          onChange={(e) => setMotivoRejeicaoInput(e.target.value)}
                        />
                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                          <button
                            onClick={() => handleConfirmarRejeicao(t.id)}
                            style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}
                          >
                            Confirmar Rejeição
                          </button>
                          <button
                            onClick={() => setTicketRejeitandoId(null)}
                            style={{ background: "transparent", color: "#94a3b8", border: "none", fontSize: "12px", cursor: "pointer" }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {subAbaCorreio === "rejeitados" && (
            <div className={styles.ticketsList}>
              {tickets.filter(t => t.status === "Rejeitado" || t.status === "Negado").length === 0 ? (
                <div className={styles.emptyWrap}>
                  <CheckCircle size={42} color="#10b981" />
                  <h4 style={{ color: "#f8fafc", margin: "10px 0 4px 0", fontSize: "16px", fontWeight: "800" }}>Nenhum ticket rejeitado!</h4>
                </div>
              ) : (
                tickets.filter(t => t.status === "Rejeitado" || t.status === "Negado").map(t => (
                  <div key={t.id} className={styles.ticketCard} style={{ borderLeft: "4px solid #ef4444" }}>
                    <div className={styles.ticketCardHeader}>
                      <span className={styles.ticketId}>{t.id}</span>
                      <span style={{ backgroundColor: "rgba(239, 68, 68, 0.18)", color: "#ef4444", padding: "4px 12px", borderRadius: "10px", fontSize: "12px", fontWeight: "800" }}>
                        🔴 Rejeitado
                      </span>
                    </div>
                    <h4 className={styles.ticketTitle}>{t.titulo}</h4>
                    <p style={{ fontSize: "13px", color: "#f87171" }}><strong>Motivo:</strong> {t.motivoRejeicao || "Sem motivo especificado."}</p>
                    <button
                      onClick={() => handleReavaliarTicket(t.id)}
                      style={{
                        backgroundColor: "rgba(59, 130, 246, 0.18)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.4)",
                        padding: "8px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: "800", cursor: "pointer", width: "fit-content"
                      }}
                    >
                      <RotateCcw size={14} style={{ display: "inline", marginRight: "6px" }} /> Reavaliar & Aprovar
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MEUS TICKETS (ALUNO) */}
      {abaAtiva === "meus_tickets" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* BARRA DE BUSCA DO ALUNO */}
          <div style={{
            backgroundColor: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(139, 92, 246, 0.25)",
            borderRadius: "20px",
            padding: "16px 20px",
            display: "flex",
            justify: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#f8fafc", margin: 0 }}>
              📋 Meus Tickets Enviados ({meusTickets.length})
            </h3>
            <div style={{ position: "relative", minWidth: "220px", maxWidth: "320px", flex: 1 }}>
              <Search size={16} color="#8b5cf6" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="text"
                placeholder="Pesquisar por título ou #TKT..."
                className={styles.input}
                style={{ paddingLeft: "40px", fontSize: "12.5px" }}
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
          </div>

          {/* CARDS DOS TICKETS DO ALUNO */}
          <div className={styles.ticketsList}>
            {(() => {
              const listTotal = listagemTicketsExibida();
              if (listTotal.length === 0) {
                return (
                  <div className={styles.emptyWrap}>
                    <Ticket size={42} color="#64748b" />
                    <h4 style={{ color: "#f8fafc", margin: "10px 0 4px 0", fontSize: "16px", fontWeight: "800" }}>Nenhum ticket encontrado</h4>
                    <p style={{ fontSize: "13px", color: "#94a3b8" }}>Você ainda não abriu solicitações com esses termos.</p>
                  </div>
                );
              }
              return listTotal.map(t => renderAlunoTicketCard(t));
            })()}
          </div>
        </div>
      )}

      {/* TAB 3: GESTÃO DE TICKETS DO ADMIN (COM MODO TABELA / SEÇÕES COMPLETO) */}
      {abaAtiva === "todos" && (isAdmin || modoAdmin) && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* BARRA DE PESQUISA & DUAL FILTRO & MODO DE VISUALIZAÇÃO */}
          <div style={{
            backgroundColor: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(139, 92, 246, 0.25)",
            borderRadius: "20px",
            padding: "18px 22px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#f8fafc", margin: 0, display: "flex", alignItems: "center", gap: "8px", letterSpacing: "-0.01em" }}>
                🛡️ Gestão de Tickets dos Alunos
              </h3>

              <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", flex: 1, justifyContent: "flex-end" }}>
                {/* BOTÕES TOGGLE SEÇÕES VS TABELA */}
                <div style={{ display: "flex", background: "rgba(3, 7, 18, 0.6)", padding: "4px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <button
                    onClick={() => setViewMode("tabela")}
                    style={{
                      background: viewMode === "tabela" ? "#10b981" : "transparent",
                      color: viewMode === "tabela" ? "#fff" : "#94a3b8",
                      border: "none", padding: "6px 14px", borderRadius: "9px", fontSize: "12px",
                      fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
                    }}
                  >
                    <Table size={14} /> Tabela
                  </button>
                  <button
                    onClick={() => setViewMode("secoes")}
                    style={{
                      background: viewMode === "secoes" ? "#10b981" : "transparent",
                      color: viewMode === "secoes" ? "#fff" : "#94a3b8",
                      border: "none", padding: "6px 14px", borderRadius: "9px", fontSize: "12px",
                      fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
                    }}
                  >
                    <LayoutGrid size={14} /> Seções
                  </button>
                </div>

                {/* INPUT DE BUSCA */}
                <div style={{ position: "relative", minWidth: "220px", maxWidth: "320px", flex: 1 }}>
                  <Search size={16} color="#8b5cf6" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                  <input 
                    type="text"
                    placeholder="Pesquisar por título, e-mail ou #TKT..."
                    className={styles.input}
                    style={{ paddingLeft: "40px", fontSize: "12.5px" }}
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* SELETORES DE FILTRO DE TIPO E STATUS (LAYOUT PREMIUM REFORMULADO) */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "12px", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "11.5px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tipo:</span>
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <select 
                    style={{
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      padding: "7px 32px 7px 14px",
                      fontSize: "12px",
                      fontWeight: "800",
                      width: "auto",
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      color: "#f8fafc",
                      border: "1px solid rgba(139, 92, 246, 0.4)",
                      borderRadius: "12px",
                      cursor: "pointer",
                      outline: "none",
                      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.3)",
                      transition: "all 0.2s ease"
                    }}
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                  >
                    <option value="todos" style={{ background: "#0f172a", color: "#f8fafc" }}>Todos os Tipos</option>
                    <option value="bug" style={{ background: "#0f172a", color: "#f43f5e" }}>🐛 Bugs / Falhas</option>
                    <option value="melhoria" style={{ background: "#0f172a", color: "#f59e0b" }}>💡 Sugestões de Melhoria</option>
                    <option value="duvida" style={{ background: "#0f172a", color: "#3b82f6" }}>❓ Dúvidas Técnicas</option>
                  </select>
                  <ChevronDown size={14} color="#a855f7" style={{ position: "absolute", right: "10px", pointerEvents: "none" }} />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "11.5px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status:</span>
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <select 
                    style={{
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      padding: "7px 32px 7px 14px",
                      fontSize: "12px",
                      fontWeight: "800",
                      width: "auto",
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      color: "#f8fafc",
                      border: "1px solid rgba(139, 92, 246, 0.4)",
                      borderRadius: "12px",
                      cursor: "pointer",
                      outline: "none",
                      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.3)",
                      transition: "all 0.2s ease"
                    }}
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                  >
                    <option value="todos" style={{ background: "#0f172a", color: "#f8fafc" }}>Todos os Status</option>
                    <option value="andamento" style={{ background: "#0f172a", color: "#f59e0b" }}>🟡 Em Andamento</option>
                    <option value="resolvido" style={{ background: "#0f172a", color: "#10b981" }}>🟢 Resolvidos</option>
                    <option value="negado" style={{ background: "#0f172a", color: "#ef4444" }}>🔴 Negados / Recusados</option>
                  </select>
                  <ChevronDown size={14} color="#a855f7" style={{ position: "absolute", right: "10px", pointerEvents: "none" }} />
                </div>
              </div>

              {(filtroTipo !== "todos" || filtroStatus !== "todos" || termoBusca) && (
                <button
                  onClick={() => { setFiltroTipo("todos"); setFiltroStatus("todos"); setTermoBusca(""); }}
                  style={{
                    padding: "6px 14px", borderRadius: "10px", border: "1px solid rgba(239, 68, 68, 0.4)",
                    backgroundColor: "rgba(239, 68, 68, 0.12)", color: "#ef4444", fontSize: "12px",
                    fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
                  }}
                >
                  <X size={14} /> Limpar Filtros
                </button>
              )}
            </div>
          </div>

          {/* RENDEREIZAÇÃO DOS TICKETS DO ADMIN (MODO TABELA OU MODO SEÇÕES) */}
          <div className={styles.ticketsList}>
            {(() => {
              const listTotal = listagemTicketsExibida();
              const ticketsAndamento = listTotal.filter(t => t.status === "Aberto" || t.status === "Em Análise" || t.status === "Pendente");
              const ticketsResolvidos = listTotal.filter(t => t.status === "Resolvido");
              const ticketsNegados = listTotal.filter(t => t.status === "Rejeitado" || t.status === "Negado");

              if (listTotal.length === 0) {
                return (
                  <div className={styles.emptyWrap}>
                    <Ticket size={42} color="#64748b" />
                    <h4 style={{ color: "#f8fafc", margin: "10px 0 4px 0", fontSize: "16px", fontWeight: "800" }}>Nenhum ticket encontrado</h4>
                    <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                      Tente alterar os filtros de busca ou abra uma nova solicitação.
                    </p>
                  </div>
                );
              }

              if (viewMode === "tabela") {
                return renderTableView(listTotal);
              }

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                  {/* SEÇÃO 1: TICKETS EM ANDAMENTO */}
                  {(filtroStatus === "todos" || filtroStatus === "andamento") && (
                    <div className={styles.sectionGroup}>
                      <div className={styles.sectionHeader} style={{ borderColor: "rgba(245, 158, 11, 0.4)", background: "linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "10px", backgroundColor: "rgba(245, 158, 11, 0.2)", border: "1px solid rgba(245, 158, 11, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b" }}>
                            <Clock size={18} />
                          </div>
                          <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#fcd34d" }}>
                            🟡 Tickets Em Andamento ({ticketsAndamento.length})
                          </h4>
                        </div>
                        <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>Solicitações abertas ou em análise</span>
                      </div>

                      {ticketsAndamento.length === 0 ? (
                        <div className={styles.emptySectionBox}>
                          <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Nenhum ticket em andamento nesta categoria.</p>
                        </div>
                      ) : (
                        ticketsAndamento.map(t => renderAlunoTicketCard(t))
                      )}
                    </div>
                  )}

                  {/* SEÇÃO 2: TICKETS RESOLVIDOS */}
                  {(filtroStatus === "todos" || filtroStatus === "resolvido") && (
                    <div className={styles.sectionGroup}>
                      <div className={styles.sectionHeader} style={{ borderColor: "rgba(16, 185, 129, 0.4)", background: "linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "10px", backgroundColor: "rgba(16, 185, 129, 0.2)", border: "1px solid rgba(16, 185, 129, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                            <CheckCircle2 size={18} />
                          </div>
                          <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#6ee7b7" }}>
                            🟢 Tickets Resolvidos ({ticketsResolvidos.length})
                          </h4>
                        </div>
                        <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>Solicitações concluídas e finalizadas</span>
                      </div>

                      {ticketsResolvidos.length === 0 ? (
                        <div className={styles.emptySectionBox}>
                          <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Nenhum ticket resolvido nesta categoria.</p>
                        </div>
                      ) : (
                        ticketsResolvidos.map(t => renderAlunoTicketCard(t))
                      )}
                    </div>
                  )}

                  {/* SEÇÃO 3: TICKETS NEGADOS / RECUSADOS */}
                  {(filtroStatus === "todos" || filtroStatus === "negado") && (
                    <div className={styles.sectionGroup}>
                      <div className={styles.sectionHeader} style={{ borderColor: "rgba(239, 68, 68, 0.4)", background: "linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "10px", backgroundColor: "rgba(239, 68, 68, 0.2)", border: "1px solid rgba(239, 68, 68, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
                            <XCircle size={18} />
                          </div>
                          <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#f87171" }}>
                            🔴 Tickets Negados / Recusados ({ticketsNegados.length})
                          </h4>
                        </div>
                        <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>Solicitações recusadas ou não aprovadas</span>
                      </div>

                      {ticketsNegados.length === 0 ? (
                        <div className={styles.emptySectionBox}>
                          <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Nenhum ticket negado ou recusado nesta categoria.</p>
                        </div>
                      ) : (
                        ticketsNegados.map(t => renderAlunoTicketCard(t))
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* DRAWER MODAL OVERLAY */}
      {renderDrawerModal()}
    </div>
  );

  if (isOpen !== undefined) {
    if (!isOpen) return null;
    return (
      <div 
        className={styles.overlay} 
        onClick={onClose}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.78)", backdropFilter: "blur(10px)",
          zIndex: 9999, display: "flex", justifyContent: "center",
          alignItems: "center", padding: "16px"
        }}
      >
        <div 
          className={styles.modalContent} 
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#0b0f19",
            border: "1px solid rgba(59,130,246,0.35)",
            width: "100%", maxWidth: "980px", maxHeight: "90vh",
            borderRadius: "20px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(59,130,246,0.15)",
            color: "#f8fafc", overflowY: "auto", padding: "20px",
            display: "flex", flexDirection: "column", gap: "16px",
            position: "relative"
          }}
        >
          {onClose && (
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "50%",
                width: "34px",
                height: "34px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                cursor: "pointer",
                zIndex: 20,
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)"; }}
              title="Fechar Suporte & Tickets"
            >
              <X size={18} />
            </button>
          )}
          {contentJSX}
        </div>
      </div>
    );
  }

  return contentJSX;
}
