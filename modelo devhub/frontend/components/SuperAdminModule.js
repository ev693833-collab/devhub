import { useState, useEffect, useRef } from "react";
import TicketsModule from "./TicketsModule";
import {
  Crown, Shield, GraduationCap, Users, FileText, CheckCircle, BarChart2,
  TrendingUp, Swords, Sparkles, Plus, Trash2, Edit3, Search, RefreshCw,
  BookOpen, Award, Zap, Clock, Activity, AlertTriangle, UserCheck, Eye, EyeOff,
  Bell, Mail, Megaphone, Lock, Unlock, Download, ToggleLeft, ToggleRight,
  Settings, Database, ClipboardList, Flame, Target, Send, BookMarked,
  LayoutDashboard, BarChart, WrenchIcon, Map, Inbox, LifeBuoy, HelpCircle, Info, ChevronRight, ChevronDown, Layers, Filter, CheckCircle2, ArrowLeft, LayoutGrid, ChevronLeft, ArrowRight,
  MoreVertical, Building2, Link2, Check, X, ShieldCheck, Globe, Calendar
} from "lucide-react";

// ─────────────────────────────────────────────────
// Componente auxiliar: Seção com cabeçalho padrão
// ─────────────────────────────────────────────────
function SectionCard({ isDark, icon, gradient, border, glow, title, subtitle, children, style = {} }) {
  return (
    <div style={{
      backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
      border: `1px solid ${isDark ? "#1E293B" : "#E2E8F0"}`,
      borderRadius: "18px", padding: "20px",
      boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.04)",
      ...style
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
        <div style={{
          width: "42px", height: "42px", borderRadius: "12px",
          background: gradient || "linear-gradient(135deg, #10b981, #059669)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          border: border || (isDark ? "1px solid rgba(255,255,255,0.18)" : "none"),
          boxShadow: glow || "0 4px 16px rgba(0,0,0,0.25)",
          backdropFilter: "blur(6px)"
        }}>
          {icon}
        </div>
        <div>
          <h3 style={{ fontSize: "1.05rem", fontWeight: "800", margin: 0, color: isDark ? "#FFF" : "#0F172A", letterSpacing: "-0.01em" }}>{title}</h3>
          {subtitle && <span style={{ fontSize: "0.78rem", color: isDark ? "#94a3b8" : "#64748b" }}>{subtitle}</span>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────
// Componente auxiliar: Input com label & Select estilizado
// ─────────────────────────────────────────────────
function FormInput({ isDark, label, type = "text", value, onChange, placeholder, as = "input", children, style = {} }) {
  const baseStyle = {
    width: "100%", padding: "13px 16px", borderRadius: "12px",
    backgroundColor: isDark ? "#0f121d" : "#F8FAFC",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}`,
    color: isDark ? "#FFF" : "#0F172A", fontSize: "0.95rem", fontWeight: "600", outline: "none",
    fontFamily: "inherit", transition: "all 0.2s ease", ...style
  };

  const selectStyle = {
    ...baseStyle,
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='${isDark ? '%23a855f7' : '%236366f1'}' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: "42px",
    cursor: "pointer",
    boxShadow: isDark ? "0 2px 10px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.08)"
  };

  return (
    <div>
      {label && <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "700", color: isDark ? "#cbd5e1" : "#475569", marginBottom: "7px" }}>{label}</label>}
      {as === "textarea"
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} style={{ ...baseStyle, resize: "vertical" }} />
        : as === "select"
        ? (
          <select
            value={value}
            onChange={onChange}
            style={selectStyle}
            onFocus={e => e.target.style.borderColor = isDark ? "#a855f7" : "#6366f1"}
            onBlur={e => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}
          >
            {children}
          </select>
        )
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={baseStyle} onFocus={e => e.target.style.borderColor = isDark ? "#a855f7" : "#6366f1"} onBlur={e => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"} />
      }
    </div>
  );
}

// ─────────────────────────────────────────────────
// Componente auxiliar: Botão de ação primária
// ─────────────────────────────────────────────────
function PrimaryButton({ onClick, gradient, shadow, children, style = {}, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "12px 24px",
        background: gradient || "linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)",
        color: "#FFF", border: "none", borderRadius: "9999px", fontWeight: "800",
        fontSize: "0.98rem", cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: shadow || "0 6px 20px -3px rgba(99, 102, 241, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.3)",
        display: "flex", alignItems: "center", gap: "8px", opacity: disabled ? 0.6 : 1,
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)", fontFamily: "inherit",
        letterSpacing: "-0.01em", ...style
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 10px 25px -4px rgba(99, 102, 241, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.4)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = shadow || "0 6px 20px -3px rgba(99, 102, 241, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.3)";
        }
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.96)"; }}
      onMouseUp={(e) => { if (!disabled) e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────
// Componente auxiliar: Toast de sucesso/erro
// ─────────────────────────────────────────────────
function Toast({ msg, type = "success" }) {
  if (!msg) return null;
  const isSuccess = type === "success";
  return (
    <div style={{
      backgroundColor: isSuccess ? "rgba(16, 185, 129, 0.15)" : "rgba(239,68,68,0.15)",
      border: `1px solid ${isSuccess ? "#10b981" : "#ef4444"}`,
      color: isSuccess ? "#10b981" : "#ef4444",
      padding: "14px 20px", borderRadius: "16px", fontWeight: "700",
      display: "flex", alignItems: "center", gap: "10px",
      animation: "fadeIn 0.3s ease"
    }}>
      {isSuccess ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
      <span>{msg}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════
export default function SuperAdminModule({ isDark = true, colors = {}, currentUser = null, onVoltarEntrada }) {

  // ── ABA ATIVA DE GESTÃO (Padrão: Dashboard Executivo) ──
  const [abaAdmin, setAbaAdmin] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const salva = localStorage.getItem("devhub_aba_admin");
        if (salva) return salva;
      } catch (e) {}
    }
    return "analytics";
  });

  useEffect(() => {
    if (typeof window !== "undefined" && abaAdmin) {
      try {
        localStorage.setItem("devhub_aba_admin", abaAdmin);
      } catch (e) {}
    }
  }, [abaAdmin]);

  // ── TOAST ──────────────────────────────────────
  const [toast, setToast] = useState({ msg: null, type: "success" });
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: null, type: "success" }), 4000);
  };

  // ── USUÁRIOS ───────────────────────────────────
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [formNome, setFormNome] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSenha, setFormSenha] = useState("");
  const [formCargo, setFormCargo] = useState("usuario");
  const [formFotoUrl, setFormFotoUrl] = useState("");
  const [usuarioEditandoId, setUsuarioEditandoId] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(null);

  // ── 3 PONTINHOS & VÍNCULOS ─────────────────────
  const [userMenuOpenId, setUserMenuOpenId] = useState(null);
  const [modalVinculosUser, setModalVinculosUser] = useState(null);
  const [modalCargoUser, setModalCargoUser] = useState(null);
  const [buscaBaseModal, setBuscaBaseModal] = useState("");
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [editandoCargoHeader, setEditandoCargoHeader] = useState(false);
  const [modalEstatisticaKpi, setModalEstatisticaKpi] = useState(null); // 'alunos' | 'bases' | 'provas' | 'suporte'

  const handleAlterarCargoUsuario = (usuarioId, novoCargo, usuarioNome) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    setUsuarios(prev => prev.map(u => String(u.id) === String(usuarioId) ? { ...u, cargo: novoCargo } : u));

    try {
      if (typeof window !== "undefined") {
        const rawCustom = localStorage.getItem("devhub_usuarios_customizados");
        let customList = rawCustom ? JSON.parse(rawCustom) : [];
        const idx = customList.findIndex(u => String(u.id) === String(usuarioId));
        if (idx >= 0) {
          customList[idx] = { ...customList[idx], cargo: novoCargo };
        } else {
          customList.push({ id: usuarioId, cargo: novoCargo });
        }
        localStorage.setItem("devhub_usuarios_customizados", JSON.stringify(customList));

        const rawRoles = localStorage.getItem("devhub_usuarios_roles") || "{}";
        const rolesObj = JSON.parse(rawRoles);
        rolesObj[usuarioId] = novoCargo;
        localStorage.setItem("devhub_usuarios_roles", JSON.stringify(rolesObj));
      }
    } catch (e) {}

    const badgeCargo = novoCargo === "superadmin" ? "Super Admin 👑" : novoCargo === "admin" ? "Admin 🛡️" : "Estudante 🎓";
    showToast(`Cargo de ${usuarioNome} alterado para ${badgeCargo}!`);

    fetch(`${apiUrl}/auth/users/${usuarioId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ cargo: novoCargo })
    }).catch(() => {});
  };

  const sanitizeListaBasesAdmin = (rawList) => {
    const BASES_PADRAO_ADM = [
      { id: "devhub", nome: "DevHub", codigo: "BASE-01", badge: "🚀 DevHub", cor: "#8B5CF6", color: "#8B5CF6", gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)", glow: "rgba(139, 92, 246, 0.55)", bg: "rgba(139, 92, 246, 0.18)", border: "rgba(139, 92, 246, 0.4)", desc: "Base Principal do Sistema — Formação Central e Chefe", icon: "🚀" },
      { id: "contabhub", nome: "ContabHub", codigo: "BASE-02", badge: "🏦 ContabHub", cor: "#3B82F6", color: "#3B82F6", gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", glow: "rgba(59, 130, 246, 0.55)", bg: "rgba(59, 130, 246, 0.18)", border: "rgba(59, 130, 246, 0.4)", desc: "Base de Inteligência e Estudos Contábeis", icon: "🏦" },
      { id: "cf_smart", nome: "CF Smart", codigo: "BASE-03", badge: "⚡ CF Smart", cor: "#10B981", color: "#10B981", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)", glow: "rgba(16, 185, 129, 0.55)", bg: "rgba(16, 185, 129, 0.18)", border: "rgba(16, 185, 129, 0.4)", desc: "Base de Automação, Finanças e Inteligência Fiscal", icon: "⚡" }
    ];

    let list = Array.isArray(rawList) && rawList.length > 0 ? [...rawList] : [...BASES_PADRAO_ADM];

    // 1. Garantir DevHub no topo
    const devIndex = list.findIndex(b => b && (b.id === "devhub" || (b.nome || "").toLowerCase() === "devhub"));
    if (devIndex === -1) {
      list.unshift(BASES_PADRAO_ADM[0]);
    } else {
      list[devIndex] = { ...BASES_PADRAO_ADM[0], ...list[devIndex], id: "devhub", nome: "DevHub" };
    }

    // 2. Preservar ContabHub se existir na lista
    const contabIndex = list.findIndex(b => b && (b.id === "contabhub" || (b.nome || "").toLowerCase() === "contabhub"));
    if (contabIndex !== -1) {
      list[contabIndex] = { ...BASES_PADRAO_ADM[1], ...list[contabIndex], id: "contabhub", nome: "ContabHub" };
    }

    // 3. Preservar CF Smart se existir na lista
    const smartIndex = list.findIndex(b => b && (b.id === "cf_smart" || b.id === "cfsmart" || (b.nome || "").toLowerCase().includes("smart")));
    if (smartIndex !== -1) {
      list[smartIndex] = { ...BASES_PADRAO_ADM[2], ...list[smartIndex], id: "cf_smart", nome: "CF Smart" };
    }

    const PALETTES = [
      { color: "#8B5CF6", gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)", glow: "rgba(139, 92, 246, 0.55)", icon: "🚀" },
      { color: "#3B82F6", gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", glow: "rgba(59, 130, 246, 0.55)", icon: "🏦" },
      { color: "#10B981", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)", glow: "rgba(16, 185, 129, 0.55)", icon: "⚡" },
      { color: "#F59E0B", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", glow: "rgba(245, 158, 11, 0.55)", icon: "💼" },
      { color: "#06B6D4", gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)", glow: "rgba(6, 182, 212, 0.55)", icon: "💻" },
      { color: "#EC4899", gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)", glow: "rgba(236, 72, 153, 0.55)", icon: "📊" }
    ];

    return list.map((item, idx) => {
      const isDevHub = item.id === "devhub" || (item.nome || "").toLowerCase() === "devhub";
      const isContab = item.id === "contabhub" || (item.nome || "").toLowerCase() === "contabhub";
      const isSmart = item.id === "cf_smart" || item.id === "cfsmart" || (item.nome || "").toLowerCase().includes("smart");

      const basePadrao = isDevHub ? BASES_PADRAO_ADM[0] : isContab ? BASES_PADRAO_ADM[1] : isSmart ? BASES_PADRAO_ADM[2] : null;
      const pal = PALETTES[idx % PALETTES.length];

      const color = item.color || item.cor || (basePadrao ? basePadrao.color : pal.color);
      const gradient = item.gradient || (basePadrao ? basePadrao.gradient : `linear-gradient(135deg, ${color} 0%, ${color}aa 100%)`);
      const glow = item.glow || (basePadrao ? basePadrao.glow : `${color}55`);
      const icon = item.icon || (basePadrao ? basePadrao.icon : (isDevHub ? "🚀" : isContab ? "🏦" : isSmart ? "⚡" : pal.icon));
      const codigo = item.codigo || (basePadrao ? basePadrao.codigo : `BASE-0${idx + 1}`);
      const badge = item.badge || `${icon} ${item.nome}`;

      return {
        ...item,
        id: isDevHub ? "devhub" : isContab ? "contabhub" : isSmart ? "cf_smart" : (item.id || `base_${idx}`),
        nome: isDevHub ? "DevHub" : isContab ? "ContabHub" : isSmart ? "CF Smart" : item.nome,
        codigo,
        badge,
        cor: color,
        color,
        gradient,
        glow,
        bg: `${color}20`,
        border: `${color}50`,
        icon,
        logoUrl: item.logoUrl || item.logo || "",
        desc: item.desc || (basePadrao ? basePadrao.desc : "Base de organização e estudos.")
      };
    });
  };

  const [basesDisponiveis, setBasesDisponiveis] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("devhub_lista_bases");
        if (saved) {
          const parsed = JSON.parse(saved);
          return sanitizeListaBasesAdmin(parsed);
        }
      } catch (e) {}
    }
    return sanitizeListaBasesAdmin([]);
  });

  const BASES_DISPONIVEIS = basesDisponiveis;

  useEffect(() => {
    // Salvar sanitizado no localStorage imediatamente
    try {
      localStorage.setItem("devhub_lista_bases", JSON.stringify(basesDisponiveis));
    } catch (e) {}

    const handleBasesUpdated = () => {
      try {
        const saved = localStorage.getItem("devhub_lista_bases");
        if (saved) {
          const parsed = JSON.parse(saved);
          setBasesDisponiveis(sanitizeListaBasesAdmin(parsed));
        }
      } catch (err) {}
    };

    window.addEventListener("devhub_bases_updated", handleBasesUpdated);
    return () => window.removeEventListener("devhub_bases_updated", handleBasesUpdated);
  }, []);

  // ── ESTADOS E HANDLERS DE GESTÃO DE BASES ──
  const [modalCriarBaseAberto, setModalCriarBaseAberto] = useState(false);
  const [abaCriarBase, setAbaCriarBase] = useState("dados"); // 'dados' | 'modulos'
  const [modalBaseUsuarios, setModalBaseUsuarios] = useState(null);
  const [buscaUsuarioBaseModal, setBuscaUsuarioBaseModal] = useState("");
  const [formNovaBase, setFormNovaBase] = useState({
    nome: "",
    desc: "",
    icon: "🚀",
    logoUrl: "",
    color: "#3B82F6",
    codigo: "",
    modulosPermitidos: ["aulas", "playground", "caderno", "provas", "ranking", "tickets"]
  });
  const [buscaBaseAdmin, setBuscaBaseAdmin] = useState("");

  const handleCriarNovaBase = (e) => {
    e.preventDefault();
    if (!formNovaBase.nome.trim()) {
      showToast("Digite o nome da empresa/base.", "error");
      return;
    }
    const slug = formNovaBase.nome.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const codNum = basesDisponiveis.length + 1;
    const codigoGerado = `BASE-0${codNum}`;
    const novaBaseObj = {
      id: slug || `base_${Date.now()}`,
      nome: formNovaBase.nome.trim(),
      codigo: codigoGerado,
      badge: `${formNovaBase.icon || '🚀'} ${formNovaBase.nome.trim()}`,
      cor: formNovaBase.color || "#3B82F6",
      color: formNovaBase.color || "#3B82F6",
      gradient: `linear-gradient(135deg, ${formNovaBase.color || '#3B82F6'} 0%, #1D4ED8 100%)`,
      glow: `${formNovaBase.color || '#3B82F6'}45`,
      bg: `${formNovaBase.color || '#3B82F6'}20`,
      border: `${formNovaBase.color || '#3B82F6'}50`,
      desc: formNovaBase.desc || "Base personalizada de estudos e projetos",
      icon: formNovaBase.icon || "🚀",
      logoUrl: formNovaBase.logoUrl ? formNovaBase.logoUrl.trim() : "",
      modulosPermitidos: formNovaBase.modulosPermitidos || ["aulas", "playground", "caderno", "provas", "ranking", "tickets"]
    };

    const listaAtualizada = [...basesDisponiveis, novaBaseObj];
    setBasesDisponiveis(listaAtualizada);
    try {
      localStorage.setItem("devhub_lista_bases", JSON.stringify(listaAtualizada));
    } catch (err) {}
    window.dispatchEvent(new CustomEvent("devhub_bases_updated", { detail: listaAtualizada }));
    showToast(`Base '${novaBaseObj.nome}' criada com sucesso (${codigoGerado})! 🚀`);
    setModalCriarBaseAberto(false);
    setFormNovaBase({ nome: "", desc: "", icon: "🚀", logoUrl: "", color: "#3B82F6", codigo: "", modulosPermitidos: ["aulas", "playground", "caderno", "provas", "ranking", "tickets"] });
  };

  const handleExcluirBaseAdmin = (baseId, baseNome) => {
    if (window.confirm(`Tem certeza que deseja excluir a base '${baseNome}'?`)) {
      const listaAtualizada = basesDisponiveis.filter(b => b.id !== baseId && b.nome !== baseNome);
      setBasesDisponiveis(listaAtualizada);
      try {
        localStorage.setItem("devhub_lista_bases", JSON.stringify(listaAtualizada));
      } catch (err) {}
      window.dispatchEvent(new CustomEvent("devhub_bases_updated", { detail: listaAtualizada }));
      showToast(`Base '${baseNome}' removida com sucesso.`);
    }
  };

  const [userBasesMap, setUserBasesMap] = useState(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("devhub_user_bases_map") : null;
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {};
  });

  const handleToggleBaseVinculada = (userId, baseId) => {
    const targetUser = usuarios.find(u => String(u.id) === String(userId));
    const currentBases = targetUser ? getBasesDoUsuario(targetUser) : (userBasesMap[userId] || ["devhub"]);
    const existe = currentBases.includes(baseId);
    const novasBases = existe
      ? currentBases.filter(b => b !== baseId)
      : [...currentBases, baseId];

    setUserBasesMap(prev => {
      const novomap = { ...prev, [userId]: novasBases, [String(userId)]: novasBases };
      if (targetUser && targetUser.email) {
        novomap[targetUser.email.toLowerCase()] = novasBases;
      }
      try {
        localStorage.setItem("devhub_user_bases_map", JSON.stringify(novomap));
      } catch (e) {}
      return novomap;
    });

    setUsuarios(prev => prev.map(u => {
      if (String(u.id) === String(userId)) {
        const novosVinculosObj = novasBases.map(bId => {
          const bMatch = BASES_DISPONIVEIS.find(b => b.id === bId);
          return { base_id: bId, base_nome: bMatch ? bMatch.nome : bId };
        });
        return { ...u, vinculos_bases: novosVinculosObj };
      }
      return u;
    }));
  };

  useEffect(() => {
    const handleDocumentClick = () => setUserMenuOpenId(null);
    if (userMenuOpenId !== null) {
      window.addEventListener("click", handleDocumentClick);
    }
    return () => window.removeEventListener("click", handleDocumentClick);
  }, [userMenuOpenId]);

  // ── KPIs ───────────────────────────────────────
  const provasStats = { totalProvasFeitas: 48, mediaGeral: 8.7, taxaAprovacao: "91%", diariasConcluidas: 26, pdfsConcluidos: 14, sistemaConcluidos: 8 };
  const materiasDesempenho = [
    { materia: "JavaScript ES6+", progresso: 88, cor: "#F7DF1E", alunosDestacados: 14 },
    { materia: "React.js & Hooks", progresso: 76, cor: "#61DAFB", alunosDestacados: 11 },
    { materia: "Node.js & Express", progresso: 82, cor: "#68A063", alunosDestacados: 12 },
    { materia: "Banco de Dados & SQL", progresso: 69, cor: "#00758F", alunosDestacados: 9 },
    { materia: "Estruturas de Dados", progresso: 65, cor: "#A855F7", alunosDestacados: 8 }
  ];
  const arenaStats = { duelosRealizados: 74, desafioMaisPopular: "Validação de Parênteses", gladiadorDoMes: "Enzo Vieira 👑 (28 Vitórias)", tempoMedioResolucao: "1m 45s" };
  const iaTopicosDuvidas = [
    { topico: "Método Array.reduce()", contagem: 38, pct: 85 },
    { topico: "Async / Await & Promises", contagem: 29, pct: 68 },
    { topico: "useEffect & Ciclo de Vida", contagem: 24, pct: 55 },
    { topico: "INNER JOIN vs LEFT JOIN", contagem: 18, pct: 40 }
  ];

  // ── CENTRAL DE COMUNICAÇÃO ─────────────────────
  const [anuncioTitulo, setAnuncioTitulo] = useState("");
  const [anuncioMsg, setAnuncioMsg] = useState("");
  const [anuncioTipo, setAnuncioTipo] = useState("info");
  const [anuncioDuracao, setAnuncioDuracao] = useState("24h"); // duração padrão: 24 horas
  const [notifAluno, setNotifAluno] = useState("");
  const [notifMensagem, setNotifMensagem] = useState("");
  const [emailAssunto, setEmailAssunto] = useState("");
  const [emailCorpo, setEmailCorpo] = useState("");
  const [anunciosEnviados, setAnunciosEnviados] = useState([
    { id: 1, titulo: "Nova aula de React disponível!", tipo: "info", data: "Há 2 dias" },
    { id: 2, titulo: "🏆 Resultado do Torneio Mensal!", tipo: "conquista", data: "Há 5 dias" }
  ]);

  // ── GESTÃO DE PROVAS ───────────────────────────
  const [provas, setProvas] = useState([
    {
      id: 1,
      titulo: "Prova Final — JavaScript ES6+",
      materia: "JavaScript",
      prazo: "2026-09-15",
      tipo: "📋 Múltipla Escolha",
      ativa: true,
      questoes: [
        {
          id: 101,
          enunciado: "Qual a principal diferença entre 'let' e 'const' no ES6?",
          opcoes: [
            "A) 'let' tem escopo global e 'const' tem escopo de função",
            "B) 'let' permite reatribuir o valor e 'const' impede a reatribuição",
            "C) Ambas são idênticas, mudando apenas a sintaxe",
            "D) 'const' não funciona com objetos ou arrays"
          ],
          gabarito: "B",
          explicacao: "'let' declara variáveis que podem ser reatribuídas. 'const' impede a reatribuição direta."
        }
      ]
    },
    {
      id: 2,
      titulo: "Desafio de Algoritmos",
      materia: "Estruturas de Dados",
      prazo: "2026-09-20",
      tipo: "💻 Desafio de Código",
      ativa: true,
      questoes: [
        {
          id: 102,
          enunciado: "Escreva uma função 'somaArray(arr)' que recebe um array de números e retorna a soma de seus elementos.",
          template: "function somaArray(arr) {\n  // Seu código aqui\n  return 0;\n}",
          testInput: "[10, 20, 30]",
          testOutput: "60"
        }
      ]
    },
    {
      id: 3,
      titulo: "Quiz de SQL Avançado",
      materia: "Banco de Dados",
      prazo: "2026-09-25",
      tipo: "⚡ Quiz Rápido (Time Attack)",
      ativa: false,
      questoes: []
    }
  ]);
  const [novaProvaTitulo, setNovaProvaTitulo] = useState("");
  const [novaProvaMateria, setNovaProvaMateria] = useState("JavaScript");
  const [novaProvaMateriaCustom, setNovaProvaMateriaCustom] = useState("");
  const [novaProvaPrazo, setNovaProvaPrazo] = useState("");
  const [novaProvaTipo, setNovaProvaTipo] = useState("📋 Múltipla Escolha");

  // ── MODAL DE GESTÃO DE QUESTÕES ──
  const [modalQuestoesProva, setModalQuestoesProva] = useState(null);
  const [novaQEnunciado, setNovaQEnunciado] = useState("");
  const [novaQOptA, setNovaQOptA] = useState("");
  const [novaQOptB, setNovaQOptB] = useState("");
  const [novaQOptC, setNovaQOptC] = useState("");
  const [novaQOptD, setNovaQOptD] = useState("");
  const [novaQGabaritoOpt, setNovaQGabaritoOpt] = useState("A");
  const [novaQExplicacao, setNovaQExplicacao] = useState("");
  const [novaQCodigoTemplate, setNovaQCodigoTemplate] = useState("");
  const [novaQTestInput, setNovaQTestInput] = useState("");
  const [novaQTestOutput, setNovaQTestOutput] = useState("");
  const [novaQCriterios, setNovaQCriterios] = useState("");
  const [modalMsg, setModalMsg] = useState(null);
  const modulos = ["Aulas", "Caderno", "Provas", "Arena", "Ranking", "Dev IA"];

  const PLANOS_ALUNOS = {
    dev_start: {
      id: "dev_start",
      nome: "Dev Start",
      badge: "🌱 Dev Start",
      cor: "#10B981",
      border: "rgba(16, 185, 129, 0.4)",
      bg: "rgba(16, 185, 129, 0.12)",
      modulosPermitidos: ["Aulas", "Caderno", "Ranking"],
      descricao: "Módulos básicos: Aulas, Caderno de Estudos e Ranking"
    },
    dev_plus: {
      id: "dev_plus",
      nome: "Dev Plus",
      badge: "⚡ Dev Plus",
      cor: "#3B82F6",
      border: "rgba(59, 130, 246, 0.4)",
      bg: "rgba(59, 130, 246, 0.12)",
      modulosPermitidos: ["Aulas", "Caderno", "Provas", "Arena", "Ranking"],
      descricao: "Dev Start + Adicionais: Provas e Arena de Código"
    },
    dev_master: {
      id: "dev_master",
      nome: "Dev Master",
      badge: "👑 Dev Master",
      cor: "#A855F7",
      border: "rgba(168, 85, 247, 0.4)",
      bg: "rgba(168, 85, 247, 0.12)",
      modulosPermitidos: ["Aulas", "Caderno", "Provas", "Arena", "Ranking", "Dev IA"],
      descricao: "Acesso total a todos os módulos do sistema (com Dev IA)"
    }
  };

  // ── ANALYTICS AVANÇADO ─────────────────────────
  const retencaoSemanal = [
    { nome: "Enzo Vieira", sessoes: 6, cor: "#10B981" },
    { nome: "Gabriel Brito", sessoes: 4, cor: "#10B981" },
    { nome: "Sandro Rosal", sessoes: 3, cor: "#F59E0B" },
    { nome: "Nicholas Araujo", sessoes: 2, cor: "#EF4444" },
    { nome: "Breno Faislon", sessoes: 1, cor: "#EF4444" },
    { nome: "Bia Brasil", sessoes: 0, cor: "#6B7280" }
  ];

  const mapaCalor = {
    dias: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    horas: ["08h", "10h", "12h", "14h", "16h", "18h", "20h", "22h"],
    dados: [
      [1, 2, 3, 4, 5, 3, 1, 2],
      [2, 3, 5, 6, 7, 5, 2, 3],
      [1, 4, 6, 8, 9, 6, 3, 2],
      [2, 3, 5, 7, 8, 5, 2, 1],
      [3, 5, 7, 9, 10, 7, 4, 2],
      [1, 2, 3, 4, 4, 3, 2, 1],
      [0, 1, 2, 3, 3, 2, 1, 0]
    ]
  };

  const alunosEmRisco = [
    { nome: "Breno Faislon", email: "brenofaislon@gmail.com", diasSemAcesso: 9 },
    { nome: "Bia Brasil", email: "biabrasil@gmail.com", diasSemAcesso: 14 }
  ];

  // ── GESTÃO ACADÊMICA ───────────────────────────
  const [notaAluno, setNotaAluno] = useState("");
  const [notaMateria, setNotaMateria] = useState("JavaScript");
  const [notaProvaId, setNotaProvaId] = useState("");
  const [notaValor, setNotaValor] = useState("");
  const [notaObservacao, setNotaObservacao] = useState("");
  const [trilhaAluno, setTrilhaAluno] = useState("");
  const [trilhaTema, setTrilhaTema] = useState("");
  const [trilhaMeta, setTrilhaMeta] = useState("");
  const [boletimAluno, setBoletimAluno] = useState("");
  const [notasLancadas, setNotasLancadas] = useState([
    { aluno: "Enzo Vieira", materia: "React.js", nota: 9.5, obs: "Excelente domínio de Hooks", data: "Há 3 dias" },
    { aluno: "Gabriel Brito", materia: "Node.js", nota: 8.2, obs: "Bom desempenho em rotas", data: "Há 5 dias" }
  ]);

  // ── CONTROLE DA PLATAFORMA ─────────────────────
  const [modoManutencao, setModoManutencao] = useState(false);
  const [msgManutencao, setMsgManutencao] = useState("A plataforma estará em manutenção por aproximadamente 30 minutos. Voltamos em breve!");

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("devhub_modo_manutencao") : null;
      if (raw) {
        const data = JSON.parse(raw);
        if (typeof data.ativo === "boolean") setModoManutencao(data.ativo);
        if (data.mensagem) setMsgManutencao(data.mensagem);
      }
    } catch (e) {}
  }, []);

  const handleToggleManutencao = () => {
    const novoEstado = !modoManutencao;
    setModoManutencao(novoEstado);
    try {
      localStorage.setItem("devhub_modo_manutencao", JSON.stringify({ ativo: novoEstado, mensagem: msgManutencao }));
      window.dispatchEvent(new CustomEvent("devhub_manutencao_update"));
    } catch (e) {}
    showToast(novoEstado ? "🔧 Modo manutenção ativado!" : "🟢 Modo manutenção desativado!");
  };

  const handleMsgManutencaoChange = (texto) => {
    setMsgManutencao(texto);
    try {
      localStorage.setItem("devhub_modo_manutencao", JSON.stringify({ ativo: modoManutencao, mensagem: texto }));
      window.dispatchEvent(new CustomEvent("devhub_manutencao_update"));
    } catch (e) {}
  };


  const [logsAuditoria] = useState([
    { user: "Enzo Vieira", acao: "Login realizado", modulo: "Auth", hora: "20:15", tipo: "login" },
    { user: "Gabriel Brito", acao: "Prova 'JavaScript ES6+' submetida", modulo: "Provas", hora: "19:58", tipo: "prova" },
    { user: "Sandro Rosal", acao: "Acessou módulo Caderno", modulo: "Caderno", hora: "19:42", tipo: "acesso" },
    { user: "Bia Brasil", acao: "Perdeu duelo na Arena 1v1", modulo: "Arena", hora: "19:30", tipo: "arena" },
    { user: "Nicholas Araujo", acao: "Login realizado", modulo: "Auth", hora: "19:20", tipo: "login" },
    { user: "Breno Faislon", acao: "Flashcard criado no Caderno", modulo: "Caderno", hora: "18:55", tipo: "acesso" },
    { user: "Enzo Vieira", acao: "Nota manual lançada para Gabriel", modulo: "Admin", hora: "18:40", tipo: "admin" },
    { user: "Gabriel Brito", acao: "Acessou Dev IA Tutor", modulo: "Dev IA", hora: "18:22", tipo: "acesso" },
    { user: "Sandro Rosal", acao: "Quiz do Caderno concluído", modulo: "Caderno", hora: "18:10", tipo: "prova" },
    { user: "Enzo Vieira", acao: "Modo Manutenção ativado brevemente", modulo: "Admin", hora: "17:55", tipo: "admin" }
  ]);

  // ── CARREGAR USUÁRIOS ──────────────────────────
  const carregarUsuarios = () => {
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    let rolesLocais = {};
    let customizadosLocais = [];
    try {
      if (typeof window !== "undefined") {
        const rawRoles = localStorage.getItem("devhub_usuarios_roles");
        if (rawRoles) rolesLocais = JSON.parse(rawRoles);
        const rawCustom = localStorage.getItem("devhub_usuarios_customizados");
        if (rawCustom) customizadosLocais = JSON.parse(rawCustom);
      }
    } catch (e) {}

    const aplicarOverrides = (lista) => {
      let finalLista = [...lista];
      customizadosLocais.forEach(cUser => {
        const idx = finalLista.findIndex(u => String(u.id) === String(cUser.id) || u.email?.toLowerCase() === cUser.email?.toLowerCase());
        if (idx >= 0) {
          finalLista[idx] = { ...finalLista[idx], ...cUser };
        } else {
          finalLista.unshift(cUser);
        }
      });
      return finalLista.map(u => {
        const cargoSalvo = rolesLocais[u.id] || rolesLocais[String(u.id)] || (u.email ? rolesLocais[u.email.toLowerCase()] : null);
        return cargoSalvo ? { ...u, cargo: cargoSalvo } : u;
      });
    };

    fetch(`${apiUrl}/auth/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const baseLista = Array.isArray(data) && data.length > 0 ? data : getMockUsuarios();
        setUsuarios(aplicarOverrides(baseLista));
        setLoading(false);
      })
      .catch(() => {
        setUsuarios(aplicarOverrides(getMockUsuarios()));
        setLoading(false);
      });
  };

  const getInitials = (nome) => {
    if (!nome || typeof nome !== "string") return "U";
    const parts = nome.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    if (parts[0] && parts[0].length >= 2) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return parts[0] ? parts[0].toUpperCase() : "U";
  };

  const getUserCustomPhoto = (u) => {
    if (!u) return null;
    const rawUrl = u.avatar_url || u.fotoUrl || u.foto || u.avatar;
    if (rawUrl && typeof rawUrl === "string" && rawUrl.trim().length > 0 && !rawUrl.includes("ui-avatars.com") && (rawUrl.startsWith("http") || rawUrl.startsWith("data:") || rawUrl.startsWith("/"))) {
      return rawUrl;
    }
    return null;
  };

  const getMockUsuarios = () => [
    { id: 1, nome: "Enzo Vieira", email: "enzovieira.contabhub@gmail.com", cargo: "superadmin", data: "Hoje" },
    { id: 2, nome: "Sandro Rosal", email: "sandrorosal@gmail.com", cargo: "usuario", data: "Ontem" },
    { id: 3, nome: "Gabriel Brito", email: "gabrielbrito@gmail.com", cargo: "usuario", data: "Há 2 dias" },
    { id: 4, nome: "Nicholas Araujo", email: "nicholas.1213@gmail.com", cargo: "usuario", data: "Há 3 dias" },
    { id: 5, nome: "Breno Faislon", email: "brenofaislon@gmail.com", cargo: "usuario", data: "Há 4 dias" },
    { id: 6, nome: "Bia Brasil", email: "biabrasil@gmail.com", cargo: "usuario", data: "Há 5 dias" }
  ];

  const [modulosLiberados, setModulosLiberados] = useState({});
  const [planosAlunos, setPlanosAlunos] = useState({});

  useEffect(() => { carregarUsuarios(); }, []);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("devhub_planos_alunos") : null;
      if (raw) setPlanosAlunos(JSON.parse(raw));
    } catch (e) {}
  }, []);

  const handleChangePlanoAluno = (usuarioId, usuarioNome, novoPlanoKey) => {
    const planoDef = PLANOS_ALUNOS[novoPlanoKey];
    if (!planoDef) return;

    setPlanosAlunos(prev => {
      const novostate = { ...prev, [usuarioId]: novoPlanoKey };
      const foundUser = usuarios.find(u => u.id === usuarioId || u.nome === usuarioNome);
      if (foundUser) {
        if (foundUser.email) novostate[foundUser.email.toLowerCase()] = novoPlanoKey;
        if (foundUser.nome) {
          const nLower = foundUser.nome.toLowerCase();
          novostate[nLower] = novoPlanoKey;
          const firstName = nLower.split(" ")[0];
          if (firstName) novostate[firstName] = novoPlanoKey;
        }
      }
      try {
        localStorage.setItem("devhub_planos_alunos", JSON.stringify(novostate));
      } catch (e) {}
      return novostate;
    });

    setModulosLiberados(prev => {
      const novostate = { ...prev };
      const configMod = {};
      modulos.forEach(m => {
        configMod[m] = planoDef.modulosPermitidos.includes(m);
      });
      novostate[usuarioId] = configMod;
      const foundUser = usuarios.find(u => u.id === usuarioId || u.nome === usuarioNome);
      if (foundUser) {
        if (foundUser.email) novostate[foundUser.email.toLowerCase()] = { ...configMod };
        if (foundUser.nome) {
          const nLower = foundUser.nome.toLowerCase();
          novostate[nLower] = { ...configMod };
          const firstName = nLower.split(" ")[0];
          if (firstName) novostate[firstName] = { ...configMod };
        }
      }
      try {
        localStorage.setItem("devhub_modulos_liberados", JSON.stringify(novostate));
      } catch (e) {}
      return novostate;
    });

    showToast(`Plano de ${usuarioNome} alterado para ${planoDef.badge}!`);
  };

  const handleEntrarNaBaseDoUsuario = (usuario) => {
    if (typeof window !== "undefined") {
      const currentToken = localStorage.getItem("token") || "";
      const currentUserData = localStorage.getItem("userData") || "";

      localStorage.setItem("superAdminReturnToken", currentToken);
      localStorage.setItem("superAdminReturnUser", currentUserData);

      const userBasesList = getBasesDoUsuario(usuario);
      const targetBaseName = usuario.base_nome || usuario.base || (userBasesList[0] ? userBasesList[0] : "DevHub");

      const usuarioBase = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo || "usuario",
        base_nome: targetBaseName,
        base: targetBaseName,
        vinculos_bases: usuario.vinculos_bases || [],
        isImpersonated: true,
        impersonatedBy: currentUser ? currentUser.nome : "Super Admin"
      };

      localStorage.setItem("userData", JSON.stringify(usuarioBase));
      localStorage.setItem("devhub_active_base", targetBaseName);
      showToast(`⚡ Entrando na Base de ${usuario.nome}... Redirecionando!`);

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 600);
    }
  };

  useEffect(() => {
    if (usuarios.length > 0) {
      let salvas = {};
      try {
        const raw = typeof window !== "undefined" ? localStorage.getItem("devhub_modulos_liberados") : null;
        if (raw) salvas = JSON.parse(raw);
      } catch (e) {}

      setModulosLiberados(prev => {
        const novo = { ...salvas, ...prev };
        usuarios.forEach(u => {
          if (!novo[u.id]) {
            novo[u.id] = {};
            modulos.forEach(m => { novo[u.id][m] = true; });
          }
        });
        try {
          localStorage.setItem("devhub_modulos_liberados", JSON.stringify(novo));
        } catch (e) {}
        return novo;
      });
    }
  }, [usuarios]);

  const handleToggleModulo = (usuarioId, usuarioNome, modulo, liberadoAtual) => {
    setModulosLiberados(prev => {
      const novoValor = !liberadoAtual;
      const novostate = {
        ...prev,
        [usuarioId]: {
          ...(prev[usuarioId] || {}),
          [modulo]: novoValor
        }
      };
      const foundUser = usuarios.find(u => u.id === usuarioId || u.nome === usuarioNome);
      if (foundUser) {
        if (foundUser.email) {
          novostate[foundUser.email.toLowerCase()] = {
            ...(novostate[foundUser.email.toLowerCase()] || {}),
            [modulo]: novoValor
          };
        }
        if (foundUser.nome) {
          const nLower = foundUser.nome.toLowerCase();
          novostate[nLower] = {
            ...(novostate[nLower] || {}),
            [modulo]: novoValor
          };
          const firstName = nLower.split(" ")[0];
          if (firstName) {
            novostate[firstName] = {
              ...(novostate[firstName] || {}),
              [modulo]: novoValor
            };
          }
        }
      }
      try {
        localStorage.setItem("devhub_modulos_liberados", JSON.stringify(novostate));
      } catch (e) {}
      return novostate;
    });
    showToast(`Módulo "${modulo}" ${liberadoAtual ? "🔒 bloqueado" : "🔓 liberado"} para ${usuarioNome}!`);
  };

  const handleToggleTodosModulos = (usuarioId, usuarioNome, bloquear) => {
    setModulosLiberados(prev => {
      const novostate = { ...prev };
      novostate[usuarioId] = {};
      modulos.forEach(m => { novostate[usuarioId][m] = !bloquear; });

      const foundUser = usuarios.find(u => u.id === usuarioId || u.nome === usuarioNome);
      if (foundUser) {
        if (foundUser.email) {
          novostate[foundUser.email.toLowerCase()] = {};
          modulos.forEach(m => { novostate[foundUser.email.toLowerCase()][m] = !bloquear; });
        }
        if (foundUser.nome) {
          novostate[foundUser.nome.toLowerCase()] = {};
          modulos.forEach(m => { novostate[foundUser.nome.toLowerCase()][m] = !bloquear; });
        }
      }

      try {
        localStorage.setItem("devhub_modulos_liberados", JSON.stringify(novostate));
      } catch (e) {}
      return novostate;
    });
    showToast(`Todos os módulos foram ${bloquear ? "🔒 bloqueados" : "🔓 liberados"} para ${usuarioNome}!`);
  };

  // ── FUNÇÕES USUÁRIOS ───────────────────────────
  const handleAlterarCargo = (id, novoCargo) => {
    setUsuarios(prev => prev.map(u => String(u.id) === String(id) ? { ...u, cargo: novoCargo } : u));

    try {
      if (typeof window !== "undefined") {
        const rawRoles = localStorage.getItem("devhub_usuarios_roles");
        const rolesMap = rawRoles ? JSON.parse(rawRoles) : {};
        rolesMap[id] = novoCargo;
        rolesMap[String(id)] = novoCargo;
        const targetUser = usuarios.find(u => String(u.id) === String(id));
        if (targetUser && targetUser.email) {
          rolesMap[targetUser.email.toLowerCase()] = novoCargo;
        }
        localStorage.setItem("devhub_usuarios_roles", JSON.stringify(rolesMap));

        const rawCustom = localStorage.getItem("devhub_usuarios_customizados");
        if (rawCustom) {
          let customList = JSON.parse(rawCustom);
          customList = customList.map(u => String(u.id) === String(id) ? { ...u, cargo: novoCargo } : u);
          localStorage.setItem("devhub_usuarios_customizados", JSON.stringify(customList));
        }

        if (currentUser && String(currentUser.id) === String(id)) {
          const updatedUser = { ...currentUser, cargo: novoCargo, role: novoCargo, tag: novoCargo };
          localStorage.setItem("userData", JSON.stringify(updatedUser));
        }
      }
    } catch (e) {}

    showToast(`Cargo atualizado para "${novoCargo}"!`);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${apiUrl}/auth/users/${id}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ cargo: novoCargo })
    }).catch(() => {
      fetch(`${apiUrl}/auth/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cargo: novoCargo })
      }).catch(() => {});
    });
  };

  const handleDeletarUsuario = (id, nome) => {
    if (!window.confirm(`Excluir a conta de ${nome}?`)) return;

    setUsuarios(prev => prev.filter(u => String(u.id) !== String(id)));

    try {
      if (typeof window !== "undefined") {
        const rawCustom = localStorage.getItem("devhub_usuarios_customizados");
        if (rawCustom) {
          const customList = JSON.parse(rawCustom).filter(u => String(u.id) !== String(id));
          localStorage.setItem("devhub_usuarios_customizados", JSON.stringify(customList));
        }
      }
    } catch (e) {}

    showToast(`Conta de ${nome} excluída.`);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/auth/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
  };

  const handleSalvarUsuario = (e) => {
    e.preventDefault();
    if (!formNome || !formEmail) { setMensagemErro("Preencha Nome e E-mail."); return; }
    setMensagemErro(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    if (usuarioEditandoId) {
      const body = { nome: formNome, email: formEmail, cargo: formCargo, avatar_url: formFotoUrl, fotoUrl: formFotoUrl, foto: formFotoUrl, avatar: formFotoUrl };
      if (formSenha) body.senha = formSenha;

      setUsuarios(prev => prev.map(u => String(u.id) === String(usuarioEditandoId) ? { ...u, ...body } : u));

      try {
        if (typeof window !== "undefined") {
          const rawCustom = localStorage.getItem("devhub_usuarios_customizados");
          let customList = rawCustom ? JSON.parse(rawCustom) : [];
          const idx = customList.findIndex(u => String(u.id) === String(usuarioEditandoId));
          if (idx >= 0) {
            customList[idx] = { ...customList[idx], ...body };
          } else {
            customList.push({ id: usuarioEditandoId, ...body });
          }
          localStorage.setItem("devhub_usuarios_customizados", JSON.stringify(customList));
        }
      } catch (e) {}

      limparForm();
      setModalFormAberto(false);
      showToast(`Dados de ${formNome} atualizados!`);

      fetch(`${apiUrl}/auth/users/${usuarioEditandoId}`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body)
      }).catch(() => {});
    } else {
      const autoAvatar = formFotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formNome)}&background=0284c7&color=ffffff&bold=true`;
      const novoUsuario = { id: Date.now(), nome: formNome, email: formEmail, cargo: formCargo, avatar_url: autoAvatar, fotoUrl: autoAvatar, foto: autoAvatar, avatar: autoAvatar, data: "Agora" };

      setUsuarios(prev => [novoUsuario, ...prev]);

      try {
        if (typeof window !== "undefined") {
          const rawCustom = localStorage.getItem("devhub_usuarios_customizados");
          const customList = rawCustom ? JSON.parse(rawCustom) : [];
          customList.unshift(novoUsuario);
          localStorage.setItem("devhub_usuarios_customizados", JSON.stringify(customList));
        }
      } catch (e) {}

      limparForm();
      setModalFormAberto(false);
      showToast(`Conta de ${formNome} criada!`);

      fetch(`${apiUrl}/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: formNome, email: formEmail, senha: formSenha || "devhub123", cargo: formCargo, avatar_url: formFotoUrl, fotoUrl: formFotoUrl })
      }).catch(() => {});
    }
  };

  const [enviandoEmail, setEnviandoEmail] = useState(false);

  const handleDispararEmail = async () => {
    if (!emailAssunto || !emailCorpo) {
      return showToast("Preencha o assunto e o corpo do e-mail.", "error");
    }
    setEnviandoEmail(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/superadmin/disparar-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ assunto: emailAssunto, corpo: emailCorpo })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Erro ao disparar e-mail.");
      }
      showToast(data.message || "E-mail disparado com sucesso!");
      setEmailAssunto("");
      setEmailCorpo("");
    } catch (err) {
      console.error("Erro ao disparar e-mail:", err);
      showToast(err.message || "Erro ao disparar e-mail.", "error");
    } finally {
      setEnviandoEmail(false);
    }
  };

  const iniciarEdicao = (u) => {
    setUsuarioEditandoId(u.id); setFormNome(u.nome || ""); setFormEmail(u.email || "");
    setFormCargo(u.cargo || "usuario"); setFormSenha(u.senha || "");
    setFormFotoUrl(u.avatar_url || u.fotoUrl || u.foto || u.avatar || "");
    setModalFormAberto(true);
  };

  const limparForm = () => { setUsuarioEditandoId(null); setFormNome(""); setFormEmail(""); setFormSenha(""); setFormCargo("usuario"); setFormFotoUrl(""); };

  const getCargoBadge = (cargo) => {
    if (cargo === "superadmin" || cargo === "super_admin") return { label: "👑 Super Admin", bg: "rgba(245,158,11,0.2)", color: "#F59E0B", border: "rgba(245,158,11,0.4)" };
    if (cargo === "admin" || cargo === "gestor") return { label: "🛡️ Admin", bg: "rgba(168,85,247,0.2)", color: "#A855F7", border: "rgba(168,85,247,0.4)" };
    return { label: "🎓 Estudante", bg: "rgba(59,130,246,0.2)", color: "#3B82F6", border: "rgba(59,130,246,0.4)" };
  };

  const formatarDataAmigavel = (rawDate) => {
    if (!rawDate) return "Ativo";
    let str = String(rawDate).trim();
    if (str === "Hoje" || str === "Ontem" || str === "Ativo") return str;

    if (str.includes("às")) {
      str = str.split("às")[0].trim();
    }
    if (str.includes("T")) {
      str = str.split("T")[0];
    }
    if (str.includes("-") && str.length >= 10) {
      const partes = str.split("-");
      if (partes.length >= 3) {
        return `${partes[2].slice(0, 2)}/${partes[1]}/${partes[0]}`;
      }
    }
    try {
      const d = new Date(str);
      if (!isNaN(d.getTime())) {
        const dia = String(d.getDate()).padStart(2, "0");
        const mes = String(d.getMonth() + 1).padStart(2, "0");
        const ano = d.getFullYear();
        return `${dia}/${mes}/${ano}`;
      }
    } catch (e) {}

    return str;
  };

  const getBasesDoUsuario = (u) => {
    if (!u) return ["devhub"];
    const setBases = new Set();
    setBases.add("devhub");

    const addIfValid = (rawVal) => {
      if (!rawVal) return;
      const n = String(rawVal).toLowerCase().trim();
      if (!n) return;
      const bMatch = BASES_DISPONIVEIS.find(b => b.id === n || (b.nome || "").toLowerCase().trim() === n);
      if (bMatch) {
        setBases.add(bMatch.id);
      }
    };

    addIfValid(u.base_nome);
    addIfValid(u.base);

    if (Array.isArray(u.vinculos_bases)) {
      u.vinculos_bases.forEach(v => {
        if (typeof v === "string") {
          addIfValid(v);
        } else if (v && typeof v === "object") {
          addIfValid(v.base_id || v.id || v.base_nome || v.nome);
        }
      });
    }

    const mapList = userBasesMap[u.id] || userBasesMap[String(u.id)] || (u.email ? userBasesMap[u.email.toLowerCase()] : null);
    if (Array.isArray(mapList)) {
      mapList.forEach(bId => addIfValid(bId));
    }

    return Array.from(setBases);
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const q = busca.toLowerCase().trim();
    if (!q) return true;

    const nome = (u.nome || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const cargo = (u.cargo || "").toLowerCase();

    const bases = getBasesDoUsuario(u);
    const basesStr = bases.map(bId => {
      const bInfo = BASES_DISPONIVEIS.find(b => b.id === bId || b.nome.toLowerCase() === bId);
      return bInfo ? `${bInfo.id} ${bInfo.nome} ${bInfo.badge}`.toLowerCase() : bId;
    }).join(" ");

    return nome.includes(q) || email.includes(q) || cargo.includes(q) || basesStr.includes(q);
  });

  // ── CATEGORIAS DE NAVEGAÇÃO ORGANIZADAS DA CENTRAL ──
  const categoriasAdmin = [
    {
      id: "principal",
      nome: "📊 Dashboard Executivo & Visão Geral",
      descricao: "Visão consolidada do painel de controle, métricas da turma e engajamento",
      itens: [
        { 
          id: "analytics", 
          label: "Dashboard", 
          icon: <LayoutDashboard size={16} />, 
          badge: "Geral 📊",
          desc: "Resumo executivo de alunos, turmas, provas e rendimento médio.",
          descExtensa: "Acompanhe indicadores gerais do sistema em tempo real: total de alunos, formações ativas, retenção semanal e taxa de conclusão de avaliações."
        }
      ]
    },
    {
      id: "comunicacao_suporte",
      nome: "💬 Comunicação & Atendimento",
      descricao: "Central de avisos globais e resposta a chamados de suporte dos alunos",
      itens: [
        { 
          id: "comunicacao", 
          label: "Central de Comunicação", 
          icon: <Megaphone size={16} />, 
          badge: "Avisos 📢",
          desc: "Envio de anúncios globais no topo da tela, notificações individuais e comunicados por e-mail.",
          descExtensa: "Crie anúncios em destaque que aparecem para todos os estudantes ao fazerem login, mande avisos diretos para um aluno específico ou dispare e-mails oficiais para a turma inteira."
        },
        { 
          id: "tickets", 
          label: "Tickets & Triagem", 
          icon: <Inbox size={16} />, 
          badge: "Suporte 🎟️",
          desc: "Caixa de entrada para triagem de bugs, dúvidas e atendimento em tempo real.",
          descExtensa: "Responda aos chamados abertos pelos alunos, trie tickets na Caixa de Correio, aprove relatos de bugs ou melhorias e converse diretamente com os alunos solucionando dúvidas."
        }
      ]
    },
    {
      id: "academico_provas",
      nome: "🎓 Gestão Acadêmica & Avaliações",
      descricao: "Controle de exames, quizzes, notas individuais e emissão de boletins em PDF",
      itens: [
        { 
          id: "provas", 
          label: "Provas & Quizzes", 
          icon: <FileText size={16} />, 
          badge: "Exames 📝",
          desc: "Cadastro e gerenciamento de avaliações online, testes práticos e prazos de entrega.",
          descExtensa: "Crie novas provas objetivas ou práticas de programação, defina a disciplina (JavaScript, React, Node.js, SQL), escolha a data limite e ative/desative avaliações da turma."
        },
        { 
          id: "academico", 
          label: "Notas & Boletins", 
          icon: <GraduationCap size={16} />, 
          badge: "Boletim 🎓",
          desc: "Lançamento manual de notas de provas, trilhas personalizadas e geração de boletins em PDF.",
          descExtensa: "Lance notas por disciplina para os alunos, acompanhe o histórico acadêmico da turma e gere boletins individuais ou relatórios gerenciais em PDF prontos para impressão."
        }
      ]
    },
    {
      id: "controle_sistema",
      nome: "⚙️ Permissões & Plataforma",
      descricao: "Controle de alunos, cargos, bases de conhecimento e auditoria",
      itens: [
        { 
          id: "usuarios", 
          label: "Gestão de Usuários", 
          icon: <Users size={16} />, 
          badge: "Alunos 👥",
          desc: "Tabela com todos os alunos cadastrados, busca por e-mail e atribuição de cargos.",
          descExtensa: "Gerencie todos os cadastros do DevHub. Altere cargos (Super Admin, Admin, Estudante), busque alunos rapidamente e exclua contas quando necessário."
        },
        { 
          id: "bases", 
          label: "Gestão de Bases", 
          icon: <Building2 size={16} />, 
          badge: "Bases 🏢",
          desc: "Criação, edição e controle de acesso às empresas e bases de estudo.",
          descExtensa: "Cadastre novas empresas e bases de estudo para os alunos, escolha cores, códigos e gerencie vínculos."
        },
        { 
          id: "plataforma", 
          label: "Modo Manutenção & Logs", 
          icon: <Settings size={16} />, 
          badge: "Sistema 🔧",
          desc: "Modo manutenção da plataforma, histórico de audit logs e exportação dos dados da turma.",
          descExtensa: "Ative a tela de manutenção quando for atualizar a plataforma, consulte os logs de auditoria (quem fez login, quem concluiu provas) e exporte dados da turma em CSV, JSON ou PDF."
        }
      ]
    }
  ];

  // Encontra item e categoria ativos
  let activeCategoryObj = categoriasAdmin.find(cat => cat.itens.some(it => it.id === abaAdmin)) || categoriasAdmin[0];
  let activeItemObj = activeCategoryObj.itens.find(it => it.id === abaAdmin) || activeCategoryObj.itens[0];

  const abas = categoriasAdmin.flatMap(cat => cat.itens);

  // ── MENU VERTICAL DO SUPER ADMIN (ESTILO IMAGEM 2) ──
  const menuVerticalAdmin = [
    { id: "analytics", label: "Dashboard", icon: <LayoutDashboard size={17} />, badge: "Geral 📊" },
    { id: "usuarios", label: "Usuários", icon: <Users size={17} />, badge: `${usuarios.length}` },
    { id: "bases", label: "Gestão de Bases", icon: <Building2 size={17} />, badge: `${basesDisponiveis.length}` },
    { id: "tickets", label: "Tickets & Triagem", icon: <Inbox size={17} />, badge: "Suporte 🎟️" },
    { id: "provas", label: "Provas & Quizzes", icon: <FileText size={17} />, badge: "Exames 📝" },
    { id: "comunicacao", label: "Central de Comunicação", icon: <Megaphone size={17} />, badge: "Avisos 📢" },
    { id: "academico", label: "Notas & Boletins", icon: <GraduationCap size={17} />, badge: "Boletim 🎓" },
    { id: "plataforma", label: "Plataforma & Logs", icon: <Settings size={17} />, badge: "Sistema 🔧" }
  ];

  // ─────────────────────────────────────────────
  // CORES DE CALOR DO MAPA
  // ─────────────────────────────────────────────
  const getHeatColor = (val) => {
    if (val === 0) return isDark ? "rgba(255,255,255,0.03)" : "#F1F5F9";
    if (val <= 2) return "rgba(59,130,246,0.15)";
    if (val <= 5) return "rgba(99,102,241,0.35)";
    if (val <= 8) return "rgba(168,85,247,0.5)";
    return "rgba(245,158,11,0.7)";
  };

  // ─────────────────────────────────────────────
  // EXPORTAR DADOS (CSV, JSON & PDF IMPRESSO VIP)
  // ─────────────────────────────────────────────
  const exportarCSV = () => {
    const headers = ["Nome", "Email", "Cargo", "Cadastro"];
    const rows = usuarios.map(u => [u.nome, u.email, u.cargo, u.data]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "turma_devhub.csv"; a.click();
    showToast("Dados exportados em CSV com sucesso!");
  };

  const exportarJSON = () => {
    const blob = new Blob([JSON.stringify(usuarios, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "turma_devhub.json"; a.click();
    showToast("Dados exportados em JSON com sucesso!");
  };

  const exportarPDFRelatorio = () => {
    const dataAtual = new Date().toLocaleDateString("pt-BR", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const win = window.open("", "_blank");
    if (!win) {
      showToast("Permita janelas pop-up no navegador para abrir o PDF.", "error");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Relatorio_Gerencial_DevHub_${new Date().toISOString().split('T')[0]}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
          body { font-family: 'Inter', sans-serif; background: #0f121d; color: #f8fafc; padding: 40px; margin: 0; }
          .header { border-bottom: 2px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
          .logo-badge { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; padding: 4px 12px; border-radius: 20px; font-weight: 900; font-size: 11px; letter-spacing: 0.5px; display: inline-block; }
          .title { font-size: 24px; font-weight: 900; color: #fff; margin: 8px 0 4px 0; }
          .subtitle { color: #94a3b8; font-size: 13px; margin: 0; }
          .meta-info { text-align: right; font-size: 12px; color: #94a3b8; }
          .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
          .kpi-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 18px; text-align: center; }
          .kpi-val { font-size: 28px; font-weight: 900; color: #f59e0b; margin-top: 4px; }
          .kpi-lbl { font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; }
          .section-title { font-size: 16px; font-weight: 800; color: #fff; margin: 25px 0 14px 0; border-left: 4px solid #3b82f6; padding-left: 10px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 25px; background: rgba(255,255,255,0.02); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
          th { background: rgba(255,255,255,0.08); color: #cbd5e1; text-align: left; padding: 12px 16px; font-size: 12px; text-transform: uppercase; font-weight: 800; }
          td { padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; color: #e2e8f0; }
          .tag { padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 800; display: inline-block; }
          .tag-superadmin { background: rgba(245,158,11,0.2); color: #f59e0b; border: 1px solid rgba(245,158,11,0.4); }
          .tag-admin { background: rgba(168,85,247,0.2); color: #a855f7; border: 1px solid rgba(168,85,247,0.4); }
          .tag-estudante { background: rgba(59,130,246,0.2); color: #3b82f6; border: 1px solid rgba(59,130,246,0.4); }
          .bar-bg { background: rgba(255,255,255,0.1); height: 8px; border-radius: 4px; overflow: hidden; margin-top: 4px; width: 100%; }
          .bar-fill { height: 100%; border-radius: 4px; }
          .footer { margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 18px; font-size: 11px; color: #64748b; text-align: center; display: flex; justify-content: space-between; }
          @media print {
            body { background: #fff !important; color: #0f172a !important; padding: 20px; }
            .title { color: #0f172a !important; }
            .subtitle, .meta-info { color: #64748b !important; }
            .kpi-card { background: #f8fafc !important; border-color: #cbd5e1 !important; }
            .kpi-val { color: #d97706 !important; }
            .section-title { color: #0f172a !important; }
            table { background: #fff !important; border-color: #cbd5e1 !important; }
            th { background: #f1f5f9 !important; color: #334155 !important; }
            td { border-bottom-color: #e2e8f0 !important; color: #1e293b !important; }
            .footer { border-top-color: #cbd5e1 !important; color: #94a3b8 !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <span class="logo-badge">DEVHUB VIP EXPORT</span>
            <h1 class="title">Relatório Gerencial de Desempenho da Turma</h1>
            <p class="subtitle">Visão executiva completa dos alunos, provas, matérias e atividades</p>
          </div>
          <div class="meta-info">
            <p style="margin: 0 0 4px 0;"><strong>Gerado em:</strong> ${dataAtual}</p>
            <p style="margin: 0 0 4px 0;"><strong>Emissor:</strong> Super Admin (DevHub System)</p>
            <p style="margin: 0;"><strong>Status:</strong> Documento Oficial Consolidado</p>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-lbl">Total de Alunos</div>
            <div class="kpi-val">${usuarios.length}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-lbl">Nota Média Geral</div>
            <div class="kpi-val" style="color: #10b981;">8.7</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-lbl">Provas Concluídas</div>
            <div class="kpi-val" style="color: #a855f7;">${provasStats.totalProvasFeitas}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-lbl">Taxa de Aprovação</div>
            <div class="kpi-val" style="color: #3b82f6;">${provasStats.taxaAprovacao}</div>
          </div>
        </div>

        <div class="section-title">🎓 Quadro de Alunos Cadastrados</div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome Completo</th>
              <th>E-mail</th>
              <th>Permissão / Tag</th>
              <th>Data de Cadastro</th>
            </tr>
          </thead>
          <tbody>
            ${usuarios.map((u, i) => `
              <tr>
                <td><strong>#${i + 1}</strong></td>
                <td><strong>${u.nome}</strong></td>
                <td>${u.email}</td>
                <td>
                  <span class="tag ${u.cargo === 'superadmin' ? 'tag-superadmin' : u.cargo === 'admin' ? 'tag-admin' : 'tag-estudante'}">
                    ${u.cargo === 'superadmin' ? '👑 SUPER ADMIN' : u.cargo === 'admin' ? '🛡️ ADMIN' : '🎓 ESTUDANTE'}
                  </span>
                </td>
                <td>${u.data || 'Ativo'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">🧠 Desempenho Médio por Matéria</div>
        <table>
          <thead>
            <tr>
              <th>Matéria / Disciplina</th>
              <th>Aproveitamento Média da Turma</th>
              <th>Alunos Acima de 9.0</th>
            </tr>
          </thead>
          <tbody>
            ${materiasDesempenho.map(m => `
              <tr>
                <td><strong>${m.materia}</strong></td>
                <td>
                  <div style="display: flex; justify-content: space-between; font-weight: 800;">
                    <span>${m.progresso}%</span>
                  </div>
                  <div class="bar-bg">
                    <div class="bar-fill" style="width: ${m.progresso}%; background-color: ${m.cor};"></div>
                  </div>
                </td>
                <td><strong>${m.alunosDestacados} alunos</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">⚔️ Resumo de Engajamento e Arena 1v1</div>
        <table>
          <thead>
            <tr>
              <th>Métrica Avaliada</th>
              <th>Valor Registrado</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Total de Duelos X1 na Arena</td><td><strong>${arenaStats.duelosRealizados} duelos</strong></td></tr>
            <tr><td>Gladiador do Mês (1º Lugar)</td><td><strong>${arenaStats.gladiadorDoMes}</strong></td></tr>
            <tr><td>Tempo Médio por Resolução</td><td><strong>${arenaStats.tempoMedioResolucao}</strong></td></tr>
            <tr><td>Provas Diárias Concluídas</td><td><strong>${provasStats.diariasConcluidas} entregas</strong></td></tr>
          </tbody>
        </table>

        <div class="footer">
          <span>DevHub Academic Platform — Autenticado digitalmente pelo Super Admin</span>
          <span>Documento Oficial de Exportação</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 600);
          }
        </script>
      </body>
      </html>
    `;

    win.document.write(htmlContent);
    win.document.close();
    showToast("📄 Relatório PDF gerado! Selecione 'Salvar como PDF' na janela que abriu.");
  };

  const gerarBoletimPDF = () => {
    const nome = boletimAluno || (usuarios[0] ? usuarios[0].nome : "Aluno DevHub");
    const dataAtual = new Date().toLocaleDateString("pt-BR", { day: '2-digit', month: 'long', year: 'numeric' });
    const win = window.open("", "_blank");
    if (!win) {
      showToast("Permita pop-ups no navegador para gerar o PDF.", "error");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Boletim_Academico_${nome.replace(/\s+/g, "_")}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
          body { font-family: 'Inter', sans-serif; background: #0f121d; color: #f8fafc; padding: 40px; margin: 0; }
          .header { border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
          .title { font-size: 24px; font-weight: 900; color: #fff; margin: 4px 0; }
          .student-card { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 16px; padding: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
          .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px; }
          .kpi-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 18px; text-align: center; }
          .kpi-val { font-size: 26px; font-weight: 900; color: #10b981; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; }
          th { background: rgba(255,255,255,0.08); color: #cbd5e1; text-align: left; padding: 12px 16px; font-size: 12px; text-transform: uppercase; font-weight: 800; }
          td { padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; color: #e2e8f0; }
          .status-aprovado { color: #10b981; font-weight: 800; }
          .footer { margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 18px; font-size: 11px; color: #64748b; text-align: center; }
          @media print {
            body { background: #fff !important; color: #0f172a !important; padding: 20px; }
            .title { color: #0f172a !important; }
            .student-card { background: #f0fdf4 !important; border-color: #bbf7d0 !important; color: #166534 !important; }
            .kpi-card { background: #f8fafc !important; border-color: #cbd5e1 !important; }
            .kpi-val { color: #059669 !important; }
            table { background: #fff !important; border-color: #cbd5e1 !important; }
            th { background: #f1f5f9 !important; color: #334155 !important; }
            td { border-bottom-color: #e2e8f0 !important; color: #1e293b !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <span style="background: #10b981; color: #fff; padding: 3px 10px; border-radius: 12px; font-weight: 900; font-size: 11px;">BOLETIM INDIVIDUAL DEVHUB</span>
            <h1 class="title">Boletim Escolar & Histórico do Estudante</h1>
            <p style="color: #94a3b8; margin: 0; font-size: 13px;">Relatório Oficial de Rendimento Acadêmico</p>
          </div>
          <div style="text-align: right; font-size: 12px; color: #94a3b8;">
            <p style="margin: 0 0 4px 0;"><strong>Emissão:</strong> ${dataAtual}</p>
            <p style="margin: 0;"><strong>Autenticação:</strong> DHB-2026-${Math.floor(1000 + Math.random() * 9000)}</p>
          </div>
        </div>

        <div class="student-card">
          <div>
            <span style="font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Estudante:</span>
            <h2 style="margin: 2px 0 0 0; font-size: 22px; font-weight: 900; color: #10b981;">${nome}</h2>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 12px; color: #94a3b8;">Situação Geral:</span>
            <div style="font-size: 16px; font-weight: 900; color: #10b981;">APROVADO COM LOUVOR 🏆</div>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Média Geral</div>
            <div class="kpi-val">9.2 / 10</div>
          </div>
          <div class="kpi-card">
            <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Frequência / Presença</div>
            <div class="kpi-val" style="color: #3b82f6;">98%</div>
          </div>
          <div class="kpi-card">
            <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700;">XP Acumulado</div>
            <div class="kpi-val" style="color: #f59e0b;">2.450 XP</div>
          </div>
        </div>

        <h3 style="font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 12px;">📚 Rendimento por Matéria</h3>
        <table>
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Nota Avaliativa</th>
              <th>Duelos Ganhos</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>JavaScript ES6+</td><td><strong>9.5</strong></td><td>12 vitórias</td><td class="status-aprovado">Aprovado ⭐</td></tr>
            <tr><td>React.js & Hooks</td><td><strong>9.0</strong></td><td>8 vitórias</td><td class="status-aprovado">Aprovado ⭐</td></tr>
            <tr><td>Node.js & Express</td><td><strong>8.8</strong></td><td>9 vitórias</td><td class="status-aprovado">Aprovado ⭐</td></tr>
            <tr><td>Banco de Dados & SQL</td><td><strong>9.2</strong></td><td>6 vitórias</td><td class="status-aprovado">Aprovado ⭐</td></tr>
            <tr><td>Estruturas de Dados</td><td><strong>8.5</strong></td><td>5 vitórias</td><td class="status-aprovado">Aprovado ⭐</td></tr>
          </tbody>
        </table>

        <div class="footer">
          <span>DevHub Learning System — Documento Gerado com Sucesso</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          }
        </script>
      </body>
      </html>
    `;

    win.document.write(htmlContent);
    win.document.close();
    showToast(`📄 Boletim PDF de ${nome} gerado!`);
  };

  const tipoLogColor = (tipo) => {
    if (tipo === "login") return "#10B981";
    if (tipo === "prova") return "#F59E0B";
    if (tipo === "admin") return "#EF4444";
    if (tipo === "arena") return "#F97316";
    return "#3B82F6";
  };

  // ── VERIFICAÇÃO DE PERMISSÃO DE ACESSO AO SUPER ADMIN ──
  const cargoLower = (currentUser?.cargo || "").toLowerCase();
  const isSuperAdminUser = cargoLower === "superadmin" || cargoLower === "super_admin" || currentUser?.is_super_admin || currentUser?.email?.toLowerCase().includes("superadmin");

  if (!isSuperAdminUser) {
    return (
      <div style={{
        padding: "48px 24px", textAlign: "center",
        backgroundColor: isDark ? "rgba(15,23,42,0.9)" : "#ffffff",
        borderRadius: "24px", border: "1px solid rgba(239, 68, 68, 0.35)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
      }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "20px",
          background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444"
        }}>
          <Lock size={32} />
        </div>
        <h3 style={{ fontSize: "1.4rem", fontWeight: "900", color: isDark ? "#fff" : "#0f172a", margin: 0 }}>
          Acesso Restrito ao Super Admin 👑
        </h3>
        <p style={{ color: isDark ? "#94a3b8" : "#64748b", maxWidth: "480px", fontSize: "0.9rem", margin: 0, lineHeight: "1.5" }}>
          Esta área de Controle Executivo é exclusiva para gerência do sistema. Se você for administrador, faça login com sua conta VIP.
        </p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* ════════════════ HEADER ════════════════ */}
      <div style={{
        background: isDark
          ? "linear-gradient(145deg, rgba(16, 12, 34, 0.95) 0%, rgba(5, 7, 18, 0.96) 100%)"
          : "#FFFFFF",
        border: `1px solid ${isDark ? "rgba(139, 92, 246, 0.25)" : "#E2E8F0"}`,
        borderRadius: "18px", padding: "18px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "12px",
        boxShadow: isDark ? "0 12px 36px rgba(0,0,0,0.6), 0 0 20px rgba(124, 58, 237, 0.15)" : "none"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ background: "linear-gradient(135deg, #7C3AED, #3B82F6)", color: "#FFF", fontWeight: "800", fontSize: "0.7rem", padding: "3px 10px", borderRadius: "12px", letterSpacing: "0.5px" }}>PAINEL EXECUTIVO</span>
            <span style={{ fontSize: "0.8rem", color: isDark ? "#94a3b8" : "#64748b" }}>Gestão Avançada de Usuários e Permissões</span>
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "800", margin: 0, display: "flex", alignItems: "center", gap: "10px", color: isDark ? "#FFF" : "#0F172A" }}>
            <ShieldCheck size={22} color="#8B5CF6" />
            <span>Central Executiva do Super Admin</span>
          </h2>
        </div>

      </div>

      {/* ════════════════ TOAST ════════════════ */}
      <Toast msg={toast.msg} type={toast.type} />

      {/* ════════════════ LAYOUT SUPER ADMIN COM MENU VERTICAL (ESTILO IMAGEM 2) ════════════════ */}
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>

        {/* SUB-SIDEBAR VERTICAL FIXA (ESTILO IMAGEM 2) */}
        <div style={{
          width: "250px", flexShrink: 0,
          backgroundColor: isDark ? "#090d16" : "#FFFFFF",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`,
          borderRadius: "18px", padding: "14px 10px",
          display: "flex", flexDirection: "column", gap: "6px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          position: "sticky", top: "20px"
        }}>


          {/* Card Header de identificação (Estilo Imagem 1) */}
          <div
            onClick={() => setAbaAdmin("painel-controle")}
            title="Ir para o Painel de Controle Principal"
            style={{
              padding: "12px 14px", borderRadius: "14px",
              backgroundColor: abaAdmin === "painel-controle" ? "rgba(59, 130, 246, 0.22)" : "rgba(59, 130, 246, 0.12)",
              border: `1px solid ${abaAdmin === "painel-controle" ? "#3b82f6" : "rgba(59, 130, 246, 0.35)"}`,
              marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px",
              cursor: "pointer", transition: "all 0.2s ease"
            }}
          >
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#FFF", boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
              flexShrink: 0
            }}>
              <Settings size={20} />
            </div>
            <div>
              <div style={{ fontSize: "0.9rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A", lineHeight: "1.2" }}>
                Painel de Controle
              </div>
              <div style={{ fontSize: "0.68rem", color: isDark ? "#94a3b8" : "#64748b", margin: "2px 0 0 0" }}>
                Administração geral da plataforma (superadmin)
              </div>
            </div>
          </div>

          {/* ITENS DO MENU VERTICAL COM INDICADOR AZUL (ESTILO IMAGEM 2) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {menuVerticalAdmin.map((item) => {
              const isAtivo = abaAdmin === item.id || (abaAdmin === "painel-controle" && item.id === "visao-geral");
              return (
                <button
                  key={item.id}
                  onClick={() => setAbaAdmin(item.id)}
                  style={{
                    width: "100%", padding: "10px 12px",
                    borderRadius: "10px", border: "none",
                    backgroundColor: isAtivo 
                      ? (isDark ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF") 
                      : "transparent",
                    color: isAtivo ? "#38bdf8" : (isDark ? "#94a3b8" : "#475569"),
                    fontSize: "0.84rem", fontWeight: isAtivo ? "800" : "600",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                    transition: "all 0.15s ease", fontFamily: "inherit",
                    position: "relative"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: isAtivo ? "#38bdf8" : (isDark ? "#64748b" : "#94a3b8") }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {/* Linha Azul de Destaque no Item Ativo (Estilo Imagem 2) */}
                  {isAtivo && (
                    <div style={{
                      position: "absolute", bottom: "0", left: "12px", right: "12px",
                      height: "2px", backgroundColor: "#3b82f6", borderRadius: "2px"
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* COLUNA DIREITA DE CONTEÚDO */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "20px" }}>



          {abaAdmin === "painel-controle" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Card de Boas-Vindas & Status Rápido */}
          <div style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))"
              : "#FFFFFF",
            border: `1px solid ${isDark ? "rgba(245,158,11,0.3)" : "#CBD5E1"}`,
            borderRadius: "20px", padding: "20px 24px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "16px",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#FFF", boxShadow: "0 4px 16px rgba(245,158,11,0.4)"
              }}>
                <LayoutGrid size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "900", margin: 0, color: isDark ? "#FFF" : "#0F172A" }}>
                  Painel de Controle do Super Admin 🎛️
                </h3>
                <p style={{ fontSize: "0.85rem", color: isDark ? "#94a3b8" : "#64748b", margin: "4px 0 0 0" }}>
                  Selecione qualquer módulo abaixo para gerenciar permissões, turmas, alunos e suporte de forma organizada.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)",
                padding: "8px 14px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "800",
                color: "#F59E0B", display: "flex", alignItems: "center", gap: "6px"
              }}>
                <Users size={15} /> <span>{usuarios.length} Alunos</span>
              </div>
            </div>
          </div>

          {/* Grade Principal de Módulos Organizados por Categorias */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
            {categoriasAdmin.map(cat => (
              <div 
                key={cat.id}
                style={{
                  backgroundColor: isDark ? "rgba(15,23,42,0.85)" : "#FFFFFF",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0"}`,
                  borderRadius: "20px", padding: "20px",
                  display: "flex", flexDirection: "column", gap: "16px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.2)"
                }}
              >
                <div>
                  <h4 style={{ fontSize: "1rem", fontWeight: "900", margin: "0 0 4px 0", color: isDark ? "#FFF" : "#0F172A" }}>
                    {cat.nome}
                  </h4>
                  <p style={{ fontSize: "0.78rem", color: isDark ? "#94a3b8" : "#64748b", margin: 0 }}>
                    {cat.descricao}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {cat.itens.map(item => (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#CBD5E1"}`,
                        borderRadius: "14px", padding: "14px",
                        display: "flex", flexDirection: "column", gap: "10px",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "34px", height: "34px", borderRadius: "10px",
                            background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#F59E0B"
                          }}>
                            {item.icon}
                          </div>
                          <span style={{ fontSize: "0.92rem", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A" }}>
                            {item.label}
                          </span>
                        </div>
                        <span style={{
                          fontSize: "0.72rem", fontWeight: "900", padding: "2px 8px",
                          borderRadius: "10px", background: "rgba(59,130,246,0.15)", color: "#38bdf8",
                          border: "1px solid rgba(59,130,246,0.3)"
                        }}>
                          {item.badge}
                        </span>
                      </div>

                      <p style={{ fontSize: "0.8rem", color: isDark ? "#94a3b8" : "#64748b", margin: 0, lineHeight: "1.4" }}>
                        {item.desc}
                      </p>

                      <button
                        onClick={() => setAbaAdmin(item.id)}
                        style={{
                          marginTop: "6px", width: "100%", padding: "11px 16px",
                          borderRadius: "12px", border: "none",
                          background: "linear-gradient(135deg, #f59e0b, #d97706)",
                          color: "#FFF", fontSize: "0.95rem", fontWeight: "800",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                          boxShadow: "0 4px 14px rgba(245,158,11,0.35)",
                          transition: "all 0.2s ease", fontFamily: "inherit"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                      >
                        <span>Abrir {item.label}</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}



      {/* ══════════════════════════════════════════════════
          ABA 1 — VISÃO GERAL
      ══════════════════════════════════════════════════ */}
      {abaAdmin === "visao-geral" && (
        <>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {[
              { label: "Total de Alunos", value: usuarios.length, icon: <Users size={24} color="#3B82F6" />, bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)" },
              { label: "Provas Concluídas", value: provasStats.totalProvasFeitas, icon: <CheckCircle size={24} color="#10B981" />, bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)" },
              { label: "Duelos X1 Disputados", value: arenaStats.duelosRealizados, icon: <Swords size={24} color="#EF4444" />, bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.3)" },
              { label: "Taxa de Aprovação", value: provasStats.taxaAprovacao, icon: <Sparkles size={24} color="#6366F1" />, bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.3)", color: "#10B981" }
            ].map((kpi, i) => (
              <div key={i} style={{
                backgroundColor: isDark ? "rgba(23,28,44,0.7)" : "#FFFFFF",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0"}`,
                borderRadius: "20px", padding: "20px",
                display: "flex", alignItems: "center", gap: "14px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
              }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: kpi.bg, border: `1px solid ${kpi.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{kpi.icon}</div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: isDark ? "#94a3b8" : "#64748b", fontWeight: "600" }}>{kpi.label}</div>
                  <div style={{ fontSize: "1.7rem", fontWeight: "900", color: kpi.color || (isDark ? "#FFF" : "#0F172A") }}>{kpi.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Desempenho + Provas */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "20px" }}>
            <SectionCard isDark={isDark} icon={<TrendingUp size={20} color="#FFF" />} gradient="linear-gradient(135deg, #a855f7, #7c3aed)" title="🧠 Desempenho por Matéria" subtitle="Aproveitamento médio da turma nas disciplinas">
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {materiasDesempenho.map((m, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.86rem", fontWeight: "700", color: isDark ? "#E2E8F0" : "#334155", marginBottom: "5px" }}>
                      <span>{m.materia}</span>
                      <span style={{ color: m.cor }}>{m.progresso}%</span>
                    </div>
                    <div style={{ height: "9px", backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${m.progresso}%`, backgroundColor: m.cor, borderRadius: "10px", boxShadow: `0 0 8px ${m.cor}66`, transition: "width 1s ease" }} />
                    </div>
                    <div style={{ fontSize: "0.75rem", color: isDark ? "#94a3b8" : "#64748b", marginTop: "3px" }}>⭐ {m.alunosDestacados} alunos acima de 9.0</div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard isDark={isDark} icon={<FileText size={20} color="#FFF" />} gradient="linear-gradient(135deg, #10b981, #059669)" title="📊 Relatório de Provas" subtitle="Distribuição por modalidade de avaliação">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                {[
                  { label: "Nota Média Geral", value: `${provasStats.mediaGeral} / 10`, color: "#10B981" },
                  { label: "Provas Diárias", value: `${provasStats.diariasConcluidas}`, color: "#A855F7" }
                ].map((s, i) => (
                  <div key={i} style={{ backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`, borderRadius: "14px", padding: "14px", textAlign: "center" }}>
                    <div style={{ fontSize: "0.78rem", color: isDark ? "#94a3b8" : "#64748b", fontWeight: "700" }}>{s.label}</div>
                    <div style={{ fontSize: "1.6rem", fontWeight: "900", color: s.color, marginTop: "4px" }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "📄 PDFs Enviados", value: `${provasStats.pdfsConcluidos} submissões`, color: "#FB923C" },
                  { label: "👑 Provas do Sistema", value: `${provasStats.sistemaConcluidos} realizadas`, color: "#3B82F6" }
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: "12px" }}>
                    <span style={{ fontSize: "0.86rem", fontWeight: "700", color: isDark ? "#FFF" : "#0F172A" }}>{r.label}</span>
                    <span style={{ fontSize: "0.88rem", fontWeight: "800", color: r.color }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Dev IA + Arena */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "20px" }}>
            <SectionCard isDark={isDark} icon={<Sparkles size={20} color="#FFF" />} gradient="linear-gradient(135deg, #6366f1, #4f46e5)" title="🤖 Monitor do Dev IA" subtitle="Tópicos mais consultados pelos alunos">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {iaTopicosDuvidas.map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: "12px", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0"}` }}>
                    <div>
                      <div style={{ fontSize: "0.88rem", fontWeight: "700", color: isDark ? "#FFF" : "#0F172A" }}>{t.topico}</div>
                      <div style={{ fontSize: "0.75rem", color: isDark ? "#94a3b8" : "#64748b" }}>{t.contagem} perguntas</div>
                    </div>
                    <span style={{ fontSize: "0.82rem", fontWeight: "800", padding: "4px 10px", borderRadius: "10px", backgroundColor: "rgba(99,102,241,0.15)", color: "#818cf8" }}>{t.pct}%</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard isDark={isDark} icon={<Swords size={20} color="#FFF" />} gradient="linear-gradient(135deg, #ef4444, #dc2626)" title="⚔️ Arena de Batalha 1v1" subtitle="Estatísticas dos duelos PvP">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "🏆 Gladiador do Mês", value: arenaStats.gladiadorDoMes, color: "#F59E0B" },
                  { label: "⚡ Desafio Mais Sorteado", value: arenaStats.desafioMaisPopular, color: "#38BDF8" },
                  { label: "⏱️ Tempo Médio por Duelo", value: arenaStats.tempoMedioResolucao, color: "#10B981" }
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: "12px" }}>
                    <span style={{ fontSize: "0.86rem", fontWeight: "700", color: isDark ? "#FFF" : "#0F172A" }}>{r.label}</span>
                    <span style={{ fontSize: "0.88rem", fontWeight: "800", color: r.color }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════
          ABA — GESTÃO DE BASES & ORGANIZAÇÕES
      ══════════════════════════════════════════════════ */}
      {abaAdmin === "bases" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Header e Ação Principal de Criar Base */}
          <div style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))"
              : "#FFFFFF",
            border: `1px solid ${isDark ? "rgba(59,130,246,0.3)" : "#CBD5E1"}`,
            borderRadius: "20px", padding: "20px 24px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "16px",
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#FFF", boxShadow: "0 4px 16px rgba(37,99,235,0.4)"
              }}>
                <Building2 size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "900", margin: 0, color: isDark ? "#FFF" : "#0F172A" }}>
                  Gestão de Organizações & Bases 🏢
                </h3>
                <p style={{ fontSize: "0.85rem", color: isDark ? "#94a3b8" : "#64748b", margin: "4px 0 0 0" }}>
                  Cadastre novas bases/empresas de estudo para a turma e gerencie acessos.
                </p>
              </div>
            </div>

            <button
              onClick={() => setModalCriarBaseAberto(true)}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                color: "#FFF", border: "none", borderRadius: "9999px",
                fontWeight: "800", fontSize: "0.95rem", cursor: "pointer",
                boxShadow: "0 6px 20px rgba(37,99,235,0.4)",
                display: "flex", alignItems: "center", gap: "8px",
                transition: "all 0.2s ease"
              }}
            >
              <Plus size={18} />
              <span>Cadastrar Nova Base</span>
            </button>
          </div>

          {/* Cards de Métricas de Bases */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div style={{
              background: isDark ? "rgba(15,23,42,0.8)" : "#FFF",
              border: `1px solid ${isDark ? "rgba(59,130,246,0.25)" : "#E2E8F0"}`,
              borderRadius: "16px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px"
            }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3B82F6" }}>
                <Building2 size={22} />
              </div>
              <div>
                <div style={{ fontSize: "0.78rem", color: isDark ? "#94a3b8" : "#64748b", fontWeight: "700" }}>Total de Bases</div>
                <div style={{ fontSize: "1.4rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A" }}>{basesDisponiveis.length}</div>
              </div>
            </div>

            <div style={{
              background: isDark ? "rgba(15,23,42,0.8)" : "#FFF",
              border: `1px solid ${isDark ? "rgba(16,185,129,0.25)" : "#E2E8F0"}`,
              borderRadius: "16px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px"
            }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
                <Users size={22} />
              </div>
              <div>
                <div style={{ fontSize: "0.78rem", color: isDark ? "#94a3b8" : "#64748b", fontWeight: "700" }}>Alunos Cadastrados</div>
                <div style={{ fontSize: "1.4rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A" }}>{usuarios.length}</div>
              </div>
            </div>

            <div style={{
              background: isDark ? "rgba(15,23,42,0.8)" : "#FFF",
              border: `1px solid ${isDark ? "rgba(245,158,11,0.25)" : "#E2E8F0"}`,
              borderRadius: "16px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px"
            }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#F59E0B" }}>
                <Crown size={22} />
              </div>
              <div>
                <div style={{ fontSize: "0.78rem", color: isDark ? "#94a3b8" : "#64748b", fontWeight: "700" }}>Base Padrão</div>
                <div style={{ fontSize: "1rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A" }}>DevHub (Base Chefe)</div>
              </div>
            </div>
          </div>

          {/* Busca e Filtros Rápidos de Bases */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <div style={{
              flex: "1 1 300px", display: "flex", alignItems: "center", gap: "10px",
              background: isDark ? "#0f121d" : "#F8FAFC",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}`,
              borderRadius: "14px", padding: "10px 16px"
            }}>
              <Search size={18} color="#94A3B8" />
              <input
                type="text"
                placeholder="Buscar base por nome ou código..."
                value={buscaBaseAdmin}
                onChange={(e) => setBuscaBaseAdmin(e.target.value)}
                style={{ background: "transparent", border: "none", outline: "none", color: isDark ? "#FFF" : "#0F172A", width: "100%", fontSize: "0.92rem", fontWeight: "600" }}
              />
              {buscaBaseAdmin && (
                <button onClick={() => setBuscaBaseAdmin("")} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}>✕</button>
              )}
            </div>
          </div>

          {/* Grid de Bases Cadastradas Organizadamente */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "18px" }}>
            {basesDisponiveis.filter(b => {
              const q = buscaBaseAdmin.toLowerCase().trim();
              return !q || (b.nome || "").toLowerCase().includes(q) || (b.codigo || "").toLowerCase().includes(q);
            }).map((b, index) => {
              const isProtectedBase = b.id === "devhub" || (b.nome || "").toLowerCase() === "devhub";
              
              // Paleta visual vibrante e diferenciada por índice
              const BASE_PALETTES = [
                { color: "#3B82F6", gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)", glow: "rgba(59, 130, 246, 0.4)", icon: "🏦" },
                { color: "#10B981", gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)", glow: "rgba(16, 185, 129, 0.4)", icon: "⚡" },
                { color: "#8B5CF6", gradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)", glow: "rgba(139, 92, 246, 0.4)", icon: "🚀" },
                { color: "#F59E0B", gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", glow: "rgba(245, 158, 11, 0.4)", icon: "💼" },
                { color: "#06B6D4", gradient: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)", glow: "rgba(6, 182, 212, 0.4)", icon: "💻" },
                { color: "#EC4899", gradient: "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)", glow: "rgba(236, 72, 153, 0.4)", icon: "📊" },
                { color: "#F97316", gradient: "linear-gradient(135deg, #F97316 0%, #C2410C 100%)", glow: "rgba(249, 115, 22, 0.4)", icon: "🏢" }
              ];
              const pal = BASE_PALETTES[index % BASE_PALETTES.length];

              const cardColor = b.cor || b.color || pal.color;
              const cardGradient = b.gradient || pal.gradient;
              const cardIcon = b.icon || pal.icon;
              const cardCode = b.codigo || `BASE-0${index + 1}`;

              // Cálculo real de alunos vinculados a esta base (DevHub conta todos os alunos do sistema)
              const targetNome = (b.nome || "").toLowerCase().trim();
              const targetId = (b.id || "").toLowerCase().trim();
              const isDevHub = targetId === "devhub" || targetNome === "devhub";

              const criadoEmail = (b.criadoPorEmail || "").toLowerCase().trim();
              const criadoId = String(b.criadoPorId || "");

              const alunosVinculados = isDevHub
                ? usuarios.length
                : usuarios.filter(u => {
                    const uBase = (u.base_nome || u.baseNome || u.base || "").toLowerCase().trim();
                    const uEmail = (u.email || "").toLowerCase().trim();
                    const uId = String(u.id || "");
                    if (uBase === targetNome || uBase === targetId) return true;
                    if (criadoEmail && uEmail === criadoEmail) return true;
                    if (criadoId && uId === criadoId) return true;
                    if (Array.isArray(u.vinculos_bases)) {
                      return u.vinculos_bases.some(v => {
                        const vNome = (v.base_nome || v.nome || "").toLowerCase().trim();
                        return vNome === targetNome || vNome === targetId;
                      });
                    }
                    return false;
                  }).length;

              return (
                <div key={b.id} style={{
                  backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                  border: `1.5px solid ${isDark ? `${cardColor}35` : "#E2E8F0"}`,
                  borderRadius: "20px", padding: "22px",
                  display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px",
                  boxShadow: isDark ? `0 10px 30px rgba(0,0,0,0.3), 0 0 20px ${cardColor}15` : "0 4px 15px rgba(0,0,0,0.05)",
                  transition: "all 0.25s ease", position: "relative"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.borderColor = cardColor;
                  e.currentTarget.style.boxShadow = `0 14px 35px rgba(0,0,0,0.4), 0 0 25px ${cardColor}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = isDark ? `${cardColor}35` : "#E2E8F0";
                  e.currentTarget.style.boxShadow = isDark ? `0 10px 30px rgba(0,0,0,0.3), 0 0 20px ${cardColor}15` : "0 4px 15px rgba(0,0,0,0.05)";
                }}
                >
                  <div>
                    {/* Linha Topo: Emblema com degradê / Foto Logo + Badges + Botão Excluir */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "14px",
                        background: cardGradient,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "22px", color: "#FFF", boxShadow: `0 6px 18px ${cardColor}45`,
                        overflow: "hidden"
                      }}>
                        {b.logoUrl && b.logoUrl.trim() ? (
                          <img src={b.logoUrl} alt={b.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          cardIcon
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{
                          fontSize: "0.75rem", fontWeight: "900",
                          color: cardColor, background: `${cardColor}18`,
                          padding: "4px 10px", borderRadius: "10px",
                          border: `1px solid ${cardColor}40`, letterSpacing: "0.5px"
                        }}>
                          {cardCode}
                        </span>

                        {!isProtectedBase && (
                          <button
                            title="Excluir esta base"
                            onClick={() => handleExcluirBaseAdmin(b.id, b.nome)}
                            style={{
                              background: "rgba(239, 68, 68, 0.12)",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              color: "#EF4444", borderRadius: "10px",
                              width: "32px", height: "32px",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: "pointer", transition: "all 0.2s ease"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#EF4444";
                              e.currentTarget.style.color = "#FFF";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)";
                              e.currentTarget.style.color = "#EF4444";
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Título e Descrição */}
                    <h4 style={{ margin: "0 0 6px 0", fontSize: "1.15rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A", letterSpacing: "-0.01em" }}>
                      {b.nome}
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: isDark ? "#94a3b8" : "#64748b", lineHeight: "1.45" }}>
                      {b.desc || "Base de organização de alunos, conteúdos e trilhas de aprendizado."}
                    </p>
                  </div>

                  {/* Rodapé: Alunos Vinculados + Ações */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    paddingTop: "14px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9"}`,
                    gap: "10px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Users size={15} color={cardColor} />
                      <span style={{ fontSize: "0.82rem", fontWeight: "800", color: isDark ? "#E2E8F0" : "#334155" }}>
                        {alunosVinculados} {alunosVinculados === 1 ? "Aluno" : "Alunos"}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setModalBaseUsuarios(b);
                        setBuscaUsuarioBaseModal("");
                      }}
                      style={{
                        padding: "7px 14px", borderRadius: "10px",
                        background: `${cardColor}18`, border: `1px solid ${cardColor}40`,
                        color: cardColor, fontSize: "0.8rem", fontWeight: "800", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = cardColor;
                        e.currentTarget.style.color = "#FFF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `${cardColor}18`;
                        e.currentTarget.style.color = cardColor;
                      }}
                    >
                      <span>Ver Usuários</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════════════════ MODAL: USUÁRIOS VINCULADOS À BASE ════════════════ */}
      {modalBaseUsuarios && (() => {
        const b = modalBaseUsuarios;
        const cardColor = b.cor || b.color || "#3B82F6";
        const cardGradient = b.gradient || `linear-gradient(135deg, ${cardColor} 0%, ${cardColor}aa 100%)`;
        const cardIcon = b.icon || "🚀";
        const targetNome = (b.nome || "").toLowerCase().trim();
        const targetId = (b.id || "").toLowerCase().trim();
        const isDevHubBase = targetId === "devhub" || targetNome === "devhub";

        const criadoEmailModal = (b.criadoPorEmail || "").toLowerCase().trim();
        const criadoIdModal = String(b.criadoPorId || "");

        const usuariosVinculadosList = usuarios.filter(u => {
          if (isDevHubBase) return true;
          const uBase = (u.base_nome || u.baseNome || u.base || "").toLowerCase().trim();
          const uEmail = (u.email || "").toLowerCase().trim();
          const uId = String(u.id || "");
          if (uBase === targetNome || uBase === targetId) return true;
          if (criadoEmailModal && uEmail === criadoEmailModal) return true;
          if (criadoIdModal && uId === criadoIdModal) return true;
          if (Array.isArray(u.vinculos_bases)) {
            return u.vinculos_bases.some(v => {
              const vNome = (v.base_nome || v.nome || "").toLowerCase().trim();
              return vNome === targetNome || vNome === targetId;
            });
          }
          return false;
        });

        const usuariosFiltradosModal = usuariosVinculadosList.filter(u => {
          if (!buscaUsuarioBaseModal || !buscaUsuarioBaseModal.trim()) return true;
          const q = buscaUsuarioBaseModal.toLowerCase().trim();
          return (u.nome || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
        });

        return (
          <div
            onClick={() => setModalBaseUsuarios(null)}
            style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 999999, background: "rgba(5, 7, 13, 0.88)",
              backdropFilter: "blur(18px)", display: "flex",
              alignItems: "center", justifyContent: "center", padding: "24px"
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: "760px", width: "95%", maxHeight: "85vh", display: "flex", flexDirection: "column",
                background: isDark ? "linear-gradient(165deg, #131728 0%, #0A0D18 100%)" : "#FFF",
                border: `1px solid ${isDark ? `${cardColor}50` : "#CBD5E1"}`,
                boxShadow: `0 25px 70px rgba(0,0,0,0.95), 0 0 50px ${cardColor}30`,
                borderRadius: "24px", padding: "28px", position: "relative"
              }}
            >
              {/* Botão Fechar X */}
              <button
                onClick={() => setModalBaseUsuarios(null)}
                style={{
                  position: "absolute", top: "20px", right: "20px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "#94A3B8", cursor: "pointer", borderRadius: "10px", width: "32px", height: "32px",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"; e.currentTarget.style.color = "#EF4444"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#94A3B8"; }}
              >
                <X size={18} />
              </button>

              {/* Cabeçalho do Modal */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "16px",
                  background: cardGradient, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "24px", color: "#FFF", boxShadow: `0 6px 20px ${cardColor}50`, flexShrink: 0,
                  overflow: "hidden"
                }}>
                  {b.logoUrl && b.logoUrl.trim() ? (
                    <img src={b.logoUrl} alt={b.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    cardIcon
                  )}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A", margin: 0 }}>
                      Usuários da Base: {b.nome}
                    </h3>
                    <span style={{
                      fontSize: "0.72rem", fontWeight: "900", color: cardColor,
                      background: `${cardColor}20`, border: `1px solid ${cardColor}40`,
                      padding: "2px 8px", borderRadius: "8px"
                    }}>
                      {b.codigo || "BASE"}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: isDark ? "#94A3B8" : "#64748B", margin: "3px 0 0 0" }}>
                    {isDevHubBase
                      ? "Esta é a base central do sistema contendo todos os usuários cadastrados."
                      : `Alunos e administradores vinculados à base ${b.nome}.`}
                  </p>
                </div>
              </div>

              {/* Campo de Busca + Contador */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "18px", alignItems: "center" }}>
                <div style={{
                  flex: 1, display: "flex", alignItems: "center", gap: "10px",
                  background: isDark ? "rgba(255,255,255,0.04)" : "#F8FAFC",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#CBD5E1"}`,
                  borderRadius: "12px", padding: "10px 14px"
                }}>
                  <Search size={16} color={isDark ? "#94A3B8" : "#64748B"} />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou e-mail..."
                    value={buscaUsuarioBaseModal}
                    onChange={(e) => setBuscaUsuarioBaseModal(e.target.value)}
                    style={{
                      width: "100%", background: "transparent", border: "none", outline: "none",
                      color: isDark ? "#FFF" : "#0F172A", fontSize: "0.9rem", fontFamily: "inherit"
                    }}
                  />
                  {buscaUsuarioBaseModal && (
                    <button
                      onClick={() => setBuscaUsuarioBaseModal("")}
                      style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer", display: "flex", padding: 0 }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div style={{
                  padding: "10px 16px", borderRadius: "12px",
                  background: `${cardColor}15`, border: `1px solid ${cardColor}30`,
                  display: "flex", alignItems: "center", gap: "8px", flexShrink: 0
                }}>
                  <Users size={16} color={cardColor} />
                  <span style={{ fontSize: "0.85rem", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A" }}>
                    {usuariosFiltradosModal.length} {usuariosFiltradosModal.length === 1 ? "Usuário" : "Usuários"}
                  </span>
                </div>
              </div>

              {/* Lista de Usuários (Scrollable) */}
              <div style={{
                flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px",
                paddingRight: "4px", minHeight: "220px", maxHeight: "420px"
              }}>
                {usuariosFiltradosModal.length === 0 ? (
                  <div style={{
                    textAlign: "center", padding: "40px 20px",
                    background: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC",
                    borderRadius: "16px", border: `1px dashed ${isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0"}`
                  }}>
                    <Users size={36} color={isDark ? "#475569" : "#94A3B8"} style={{ marginBottom: "10px" }} />
                    <p style={{ margin: 0, fontWeight: "700", color: isDark ? "#CBD5E1" : "#475569", fontSize: "0.95rem" }}>
                      {buscaUsuarioBaseModal ? "Nenhum usuário encontrado na busca." : "Nenhum usuário vinculado a esta base ainda."}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.82rem", color: isDark ? "#64748B" : "#94A3B8" }}>
                      {buscaUsuarioBaseModal ? "Tente pesquisar por outro termo." : "Os usuários vinculados a esta base aparecerão aqui."}
                    </p>
                  </div>
                ) : (
                  usuariosFiltradosModal.map(u => {
                    const cargoBadge = u.cargo === "superadmin"
                      ? { label: "Super Admin 👑", bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.3)", color: "#F59E0B" }
                      : u.cargo === "admin"
                      ? { label: "Admin 🛡️", bg: "rgba(59, 130, 246, 0.15)", border: "rgba(59, 130, 246, 0.3)", color: "#3B82F6" }
                      : { label: "Estudante 🎓", bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.3)", color: "#10B981" };

                    const inicial = (u.nome || u.email || "U").charAt(0).toUpperCase();

                    return (
                      <div
                        key={u.id}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                          padding: "12px 16px", borderRadius: "14px",
                          background: isDark ? "rgba(255, 255, 255, 0.03)" : "#F8FAFC",
                          border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.07)" : "#E2E8F0"}`,
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.06)" : "#F1F5F9";
                          e.currentTarget.style.borderColor = isDark ? `${cardColor}40` : "#CBD5E1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.03)" : "#F8FAFC";
                          e.currentTarget.style.borderColor = isDark ? "rgba(255, 255, 255, 0.07)" : "#E2E8F0";
                        }}
                      >
                        {/* Avatar + Info */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                          <div style={{
                            width: "38px", height: "38px", borderRadius: "50%",
                            background: "linear-gradient(135deg, #0284c7, #0369a1)",
                            border: "1px solid rgba(56,189,248,0.4)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: "800", color: "#FFFFFF", fontSize: "0.85rem", flexShrink: 0,
                            boxShadow: "0 0 10px rgba(2,132,199,0.35)", overflow: "hidden"
                          }}>
                            {getUserCustomPhoto(u) ? (
                              <img src={getUserCustomPhoto(u)} alt={u.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              getInitials(u.nome)
                            )}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{
                                fontWeight: "800", fontSize: "0.95rem",
                                color: isDark ? "#FFF" : "#0F172A",
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                              }}>
                                {u.nome || "Sem Nome"}
                              </span>
                              <span style={{
                                fontSize: "0.72rem", fontWeight: "800", padding: "2px 8px", borderRadius: "6px",
                                background: cargoBadge.bg, border: `1px solid ${cargoBadge.border}`, color: cargoBadge.color,
                                whiteSpace: "nowrap"
                              }}>
                                {cargoBadge.label}
                              </span>
                            </div>
                            <span style={{
                              fontSize: "0.8rem", color: isDark ? "#94A3B8" : "#64748B",
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block"
                            }}>
                              {u.email}
                            </span>
                          </div>
                        </div>

                        {/* Status / Tag */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                          <div style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            padding: "4px 10px", borderRadius: "8px",
                            background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.25)",
                            color: "#10B981", fontSize: "0.75rem", fontWeight: "800"
                          }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }} />
                            <span>Vinculado</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Rodapé do Modal com Botões de Ação */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginTop: "20px", paddingTop: "16px",
                borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`
              }}>
                <button
                  onClick={() => {
                    const nomeBase = b.nome;
                    setModalBaseUsuarios(null);
                    setAbaAdmin("usuarios");
                    setBusca(nomeBase);
                  }}
                  style={{
                    background: "rgba(59, 130, 246, 0.12)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    color: "#3B82F6", padding: "10px 18px", borderRadius: "12px",
                    fontSize: "0.85rem", fontWeight: "800", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#3B82F6"; e.currentTarget.style.color = "#FFF"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)"; e.currentTarget.style.color = "#3B82F6"; }}
                >
                  <span>Gerenciar na Tabela Geral</span>
                  <ChevronRight size={15} />
                </button>

                <button
                  onClick={() => setModalBaseUsuarios(null)}
                  style={{
                    background: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}`,
                    color: isDark ? "#FFF" : "#334155", padding: "10px 20px", borderRadius: "12px",
                    fontSize: "0.85rem", fontWeight: "800", cursor: "pointer"
                  }}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ════════════════ MODAL: CRIAR NOVA BASE (LAYOUT 2 COLUNAS COM PRÉVIA AO VIVO) ════════════════ */}
      {modalCriarBaseAberto && (
        <div
          onClick={() => setModalCriarBaseAberto(false)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 999999, background: "rgba(5, 7, 13, 0.88)",
            backdropFilter: "blur(18px)", display: "flex",
            alignItems: "center", justifyContent: "center", padding: "24px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "940px", width: "95%", maxHeight: "90vh", overflowY: "auto",
              background: isDark ? "linear-gradient(165deg, #131728 0%, #0A0D18 100%)" : "#FFF",
              border: `1px solid ${isDark ? "rgba(59, 130, 246, 0.35)" : "#CBD5E1"}`,
              boxShadow: "0 25px 70px rgba(0,0,0,0.95), 0 0 50px rgba(59, 130, 246, 0.25)",
              borderRadius: "24px", padding: "28px", position: "relative"
            }}
          >
            <button
              onClick={() => setModalCriarBaseAberto(false)}
              style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#94A3B8", cursor: "pointer", borderRadius: "10px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <X size={18} />
            </button>

            {/* Cabeçalho do Modal */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "22px" }}>
              <div style={{
                width: "50px", height: "50px", borderRadius: "16px",
                background: `linear-gradient(135deg, ${formNovaBase.color || "#2563EB"} 0%, ${formNovaBase.color || "#1D4ED8"}dd 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", color: "#FFF", boxShadow: `0 0 24px ${(formNovaBase.color || "#2563EB")}60`
              }}>
                {formNovaBase.icon || "🏢"}
              </div>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A", margin: 0 }}>
                  Cadastrar Nova Base
                </h3>
                <p style={{ fontSize: "13px", color: isDark ? "#94A3B8" : "#64748b", margin: "3px 0 0 0" }}>
                  Crie uma nova organização para associar alunos e conteúdos com prévia visual instantânea.
                </p>
              </div>
            </div>

            {/* Grid 2 Colunas: Formulário à Esquerda + Prévia da Base à Direita */}
            <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "24px", alignItems: "start" }}>

              {/* COLUNA ESQUERDA: FORMULÁRIO COM ABAS */}
              <form onSubmit={handleCriarNovaBase} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* NAVEGAÇÃO POR ABAS */}
                <div style={{
                  display: "flex", gap: "6px", padding: "4px",
                  backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9",
                  borderRadius: "12px", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`
                }}>
                  <button
                    type="button"
                    onClick={() => setAbaCriarBase("dados")}
                    style={{
                      flex: 1, padding: "8px 12px", borderRadius: "8px", border: "none",
                      backgroundColor: abaCriarBase === "dados" ? (formNovaBase.color || "#3B82F6") : "transparent",
                      color: abaCriarBase === "dados" ? "#FFF" : (isDark ? "#94A3B8" : "#64748B"),
                      fontWeight: "800", fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s ease",
                      boxShadow: abaCriarBase === "dados" ? `0 4px 12px ${(formNovaBase.color || "#3B82F6")}40` : "none"
                    }}
                  >
                    📋 1. Informações Básicas
                  </button>
                  <button
                    type="button"
                    onClick={() => setAbaCriarBase("modulos")}
                    style={{
                      flex: 1, padding: "8px 12px", borderRadius: "8px", border: "none",
                      backgroundColor: abaCriarBase === "modulos" ? (formNovaBase.color || "#3B82F6") : "transparent",
                      color: abaCriarBase === "modulos" ? "#FFF" : (isDark ? "#94A3B8" : "#64748B"),
                      fontWeight: "800", fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s ease",
                      boxShadow: abaCriarBase === "modulos" ? `0 4px 12px ${(formNovaBase.color || "#3B82F6")}40` : "none"
                    }}
                  >
                    ⚙️ 2. Módulos ({ (formNovaBase.modulosPermitidos || []).length })
                  </button>
                </div>

                {/* ABA 1: DADOS DA BASE */}
                {abaCriarBase === "dados" && (
                  <>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: isDark ? "#CBD5E1" : "#475569", marginBottom: "6px" }}>
                        Nome da Empresa / Base *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: TechHub Soluções, CF Smart..."
                        value={formNovaBase.nome}
                        onChange={(e) => setFormNovaBase(prev => ({ ...prev, nome: e.target.value }))}
                        style={{
                          width: "100%", padding: "12px 14px", borderRadius: "12px",
                          backgroundColor: isDark ? "#0f121d" : "#F8FAFC",
                          border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}`,
                          color: isDark ? "#FFF" : "#0F172A", fontSize: "0.95rem", outline: "none"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: isDark ? "#CBD5E1" : "#475569", marginBottom: "6px" }}>
                        🎨 Ícone / Emoji da Base
                      </label>
                      <select
                        value={formNovaBase.icon || "🚀"}
                        onChange={(e) => setFormNovaBase(prev => ({ ...prev, icon: e.target.value }))}
                        style={{
                          width: "100%", padding: "12px 14px", borderRadius: "12px",
                          backgroundColor: isDark ? "#0f121d" : "#F8FAFC",
                          border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}`,
                          color: isDark ? "#FFF" : "#0F172A", fontSize: "0.95rem", outline: "none"
                        }}
                      >
                        <option value="🚀">🚀 Foguete (Tech)</option>
                        <option value="⚡">⚡ CF Smart / Energia</option>
                        <option value="💻">💻 Programação / Dev</option>
                        <option value="🏦">🏦 Banco / Contábil</option>
                        <option value="🏢">🏢 Empresa / Corporativo</option>
                        <option value="📊">📊 Analytics / Finanças</option>
                        <option value="👑">👑 Base Chefe / Master</option>
                        <option value="🔥">🔥 Hot / Inovação</option>
                        <option value="🛡️">🛡️ Segurança / Cyber</option>
                        <option value="🌐">🌐 Global / Web3</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: isDark ? "#CBD5E1" : "#475569", marginBottom: "6px" }}>
                        Cor Temática Principal
                      </label>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {[
                          { color: "#3B82F6", label: "Azul" },
                          { color: "#10B981", label: "Verde" },
                          { color: "#8B5CF6", label: "Roxo" },
                          { color: "#F59E0B", label: "Amarelo" },
                          { color: "#06B6D4", label: "Ciano" },
                          { color: "#EC4899", label: "Rosa" }
                        ].map(c => (
                          <button
                            key={c.color}
                            type="button"
                            onClick={() => setFormNovaBase(prev => ({ ...prev, color: c.color }))}
                            style={{
                              width: "32px", height: "32px", borderRadius: "50%",
                              backgroundColor: c.color, border: formNovaBase.color === c.color ? "3px solid #FFF" : "none",
                              cursor: "pointer", boxShadow: formNovaBase.color === c.color ? `0 0 14px ${c.color}` : "none",
                              transition: "all 0.2s ease"
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: isDark ? "#CBD5E1" : "#475569", marginBottom: "6px" }}>
                        Descrição da Base
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Descreva a finalidade ou ramo desta base..."
                        value={formNovaBase.desc}
                        onChange={(e) => setFormNovaBase(prev => ({ ...prev, desc: e.target.value }))}
                        style={{
                          width: "100%", padding: "10px 14px", borderRadius: "12px",
                          backgroundColor: isDark ? "#0f121d" : "#F8FAFC",
                          border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}`,
                          color: isDark ? "#FFF" : "#0F172A", fontSize: "0.88rem", outline: "none", resize: "none"
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "10px" }}>
                      <button
                        type="button"
                        onClick={() => setModalCriarBaseAberto(false)}
                        style={{
                          padding: "10px 18px", borderRadius: "12px",
                          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
                          color: "#94A3B8", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer"
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => setAbaCriarBase("modulos")}
                        style={{
                          padding: "10px 22px", borderRadius: "12px",
                          background: `linear-gradient(135deg, ${formNovaBase.color || "#2563EB"} 0%, ${formNovaBase.color || "#1D4ED8"}dd 100%)`, border: "none",
                          color: "#FFF", fontSize: "0.9rem", fontWeight: "800", cursor: "pointer",
                          boxShadow: `0 4px 15px ${(formNovaBase.color || "#2563EB")}50`, display: "flex", alignItems: "center", gap: "6px"
                        }}
                      >
                        <span>Próximo: Módulos →</span>
                      </button>
                    </div>
                  </>
                )}

                {/* ABA 2: MÓDULOS HABILITADOS */}
                {abaCriarBase === "modulos" && (
                  <>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                        <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "800", color: isDark ? "#CBD5E1" : "#475569" }}>
                          ⚙️ Módulos Habilitados nesta Base:
                        </label>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: formNovaBase.color || "#3B82F6", background: `${formNovaBase.color || "#3B82F6"}20`, padding: "3px 10px", borderRadius: "8px", border: `1px solid ${(formNovaBase.color || "#3B82F6")}40` }}>
                          {(formNovaBase.modulosPermitidos || []).length} de 6 Ativos
                        </span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {[
                          { id: "aulas", label: "📚 Aulas & Treinamentos", desc: "Vídeos e exercícios" },
                          { id: "playground", label: "💻 Code Playground", desc: "IDE Web instantânea" },
                          { id: "caderno", label: "📖 Caderno (NotebookLM)", desc: "IA contextual e PDFs" },
                          { id: "provas", label: "📝 Provas & Avaliações", desc: "Exames oficiais" },
                          { id: "ranking", label: "🏆 Ranking & Duelos", desc: "PvP 1v1 e líderes" },
                          { id: "tickets", label: "🎟️ Tickets & Suporte", desc: "Atendimento direto" }
                        ].map(m => {
                          const isChecked = (formNovaBase.modulosPermitidos || []).includes(m.id);
                          return (
                            <div
                              key={m.id}
                              onClick={() => {
                                setFormNovaBase(prev => {
                                  const current = prev.modulosPermitidos || [];
                                  const updated = current.includes(m.id) ? current.filter(x => x !== m.id) : [...current, m.id];
                                  return { ...prev, modulosPermitidos: updated };
                                });
                              }}
                              style={{
                                padding: "12px 14px", borderRadius: "14px",
                                background: isChecked ? `${formNovaBase.color || "#3B82F6"}20` : "rgba(255, 255, 255, 0.03)",
                                border: `1px solid ${isChecked ? (formNovaBase.color || "#3B82F6") : "rgba(255, 255, 255, 0.08)"}`,
                                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                                transition: "all 0.2s ease"
                              }}
                            >
                              <div>
                                <div style={{ fontSize: "0.82rem", fontWeight: "800", color: isChecked ? "#FFF" : "#94A3B8" }}>
                                  {m.label}
                                </div>
                                <div style={{ fontSize: "0.72rem", color: "#64748B", marginTop: "2px" }}>{m.desc}</div>
                              </div>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                readOnly
                                style={{ accentColor: formNovaBase.color || "#3B82F6", cursor: "pointer", width: "16px", height: "16px" }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", justifyContent: "space-between", marginTop: "14px" }}>
                      <button
                        type="button"
                        onClick={() => setAbaCriarBase("dados")}
                        style={{
                          padding: "10px 18px", borderRadius: "12px",
                          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
                          color: "#94A3B8", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer"
                        }}
                      >
                        ← Voltar
                      </button>
                      <button
                        type="submit"
                        style={{
                          padding: "10px 22px", borderRadius: "12px",
                          background: `linear-gradient(135deg, ${formNovaBase.color || "#2563EB"} 0%, ${formNovaBase.color || "#1D4ED8"}dd 100%)`, border: "none",
                          color: "#FFF", fontSize: "0.9rem", fontWeight: "800", cursor: "pointer",
                          boxShadow: `0 4px 15px ${(formNovaBase.color || "#2563EB")}50`, display: "flex", alignItems: "center", gap: "6px"
                        }}
                      >
                        <Plus size={16} />
                        <span>Criar Base Agora</span>
                      </button>
                    </div>
                  </>
                )}
              </form>

              {/* COLUNA DIREITA: PRÉVIA DA BASE EM TEMPO REAL */}
              <div style={{
                display: "flex", flexDirection: "column", gap: "14px",
                background: isDark ? "rgba(15, 23, 42, 0.7)" : "#F8FAFC",
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "#CBD5E1"}`,
                borderRadius: "20px", padding: "20px"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 10px #10B981" }} />
                    <span style={{ fontSize: "11px", fontWeight: "900", color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Prévia em Tempo Real
                    </span>
                  </div>
                </div>

                {/* Card Mockup Fiel ao Launcher */}
                <div style={{
                  backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                  border: `2px solid ${formNovaBase.color || "#3B82F6"}`,
                  borderRadius: "20px", padding: "22px",
                  display: "flex", flexDirection: "column", gap: "14px",
                  boxShadow: `0 12px 35px rgba(0,0,0,0.6), 0 0 30px ${(formNovaBase.color || "#3B82F6")}35`,
                  transition: "all 0.3s ease"
                }}>
                  {/* Topo */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{
                      fontSize: "0.72rem", fontWeight: "900",
                      color: formNovaBase.color || "#3B82F6",
                      background: `${formNovaBase.color || "#3B82F6"}18`,
                      padding: "4px 10px", borderRadius: "8px",
                      border: `1px solid ${(formNovaBase.color || "#3B82F6")}45`, textTransform: "uppercase"
                    }}>
                      {formNovaBase.nome || "Nova Base"}
                    </span>
                  </div>

                  {/* Centro: Emblema + Nome + Descrição */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}>
                    <div style={{
                      position: "relative",
                      width: "68px", height: "68px", borderRadius: "20px",
                      background: `linear-gradient(135deg, ${formNovaBase.color || "#3B82F6"} 0%, ${formNovaBase.color || "#1D4ED8"} 100%)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "34px", color: "#FFF",
                      boxShadow: `0 10px 28px ${(formNovaBase.color || "#3B82F6")}65, inset 0 1px 2px rgba(255,255,255,0.45)`,
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      overflow: "hidden", transition: "all 0.3s ease"
                    }}>
                      {/* Reflexo Glossy superior */}
                      <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: "40%",
                        background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)",
                        pointerEvents: "none"
                      }} />

                      {formNovaBase.logoUrl && formNovaBase.logoUrl.trim() ? (
                        <img src={formNovaBase.logoUrl} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))" }}>
                          {formNovaBase.icon || "🚀"}
                        </span>
                      )}
                    </div>

                    <h4 style={{ margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A" }}>
                      {formNovaBase.nome || "Nome da Base"}
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: isDark ? "#94a3b8" : "#64748b", lineHeight: "1.4" }}>
                      {formNovaBase.desc || "Descreva a finalidade ou ramo desta base..."}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "800", color: formNovaBase.color || "#3B82F6" }}>👥 0 Alunos</span>
                      <span style={{ fontSize: "11px", color: "#94A3B8" }}>• Formação Ativa</span>
                    </div>

                    <div style={{
                      width: "100%", padding: "5px 10px", borderRadius: "8px",
                      background: `${formNovaBase.color || "#3B82F6"}18`, border: `1px solid ${(formNovaBase.color || "#3B82F6")}35`,
                      fontSize: "10.5px", fontWeight: "700", color: formNovaBase.color || "#3B82F6", textAlign: "center"
                    }}>
                      Seu Vínculo: Gestor / Admin
                    </div>
                  </div>

                  {/* Entrar Botão */}
                  <button style={{
                    width: "100%", padding: "10px 14px", borderRadius: "12px",
                    background: `linear-gradient(135deg, ${formNovaBase.color || "#3B82F6"} 0%, ${(formNovaBase.color || "#3B82F6")}cc 100%)`,
                    color: "#FFF", border: "none", fontWeight: "800", fontSize: "12.5px", cursor: "pointer",
                    boxShadow: `0 6px 18px ${(formNovaBase.color || "#3B82F6")}50`,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
                  }}>
                    <span>Entrar na Base →</span>
                  </button>

                  {/* Badges de Módulos Liberados */}
                  {Array.isArray(formNovaBase.modulosPermitidos) && formNovaBase.modulosPermitidos.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "2px", justifyContent: "center" }}>
                      {formNovaBase.modulosPermitidos.map(mId => (
                        <span key={mId} style={{
                          fontSize: "9px", fontWeight: "800", padding: "2px 6px", borderRadius: "6px",
                          background: "rgba(255,255,255,0.08)", color: "#CBD5E1", border: "1px solid rgba(255,255,255,0.12)"
                        }}>
                          {mId}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          ABA — TICKETS & TRIAGEM DE SUPORTE (ADMIN)
      ══════════════════════════════════════════════════ */}
      {abaAdmin === "tickets" && (
        <div style={{ marginTop: "4px" }}>
          <TicketsModule user={currentUser} modoAdmin={true} defaultAba="todos" />
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          ABA 2 — CENTRAL DE COMUNICAÇÃO
      ══════════════════════════════════════════════════ */}
      {abaAdmin === "comunicacao" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "20px" }}>

            {/* Anúncio Global */}
            <SectionCard isDark={isDark} icon={<Megaphone size={20} color="#FFF" />} gradient="linear-gradient(135deg, #f97316, #ea580c)" title="📢 Enviar Anúncio Global" subtitle="Aparece para todos os alunos ao acessar a plataforma">
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <FormInput isDark={isDark} label="Título do Anúncio" value={anuncioTitulo} onChange={e => setAnuncioTitulo(e.target.value)} placeholder="Ex: Nova aula disponível hoje às 19h!" />
                <FormInput isDark={isDark} label="Mensagem" as="textarea" value={anuncioMsg} onChange={e => setAnuncioMsg(e.target.value)} placeholder="Descreva o anúncio..." />
                <FormInput isDark={isDark} label="Tipo" as="select" value={anuncioTipo} onChange={e => setAnuncioTipo(e.target.value)}>
                  <option value="info">ℹ️ Informativo</option>
                  <option value="alerta">⚠️ Alerta Importante</option>
                  <option value="conquista">🏆 Conquista / Celebração</option>
                  <option value="manutencao">🔧 Manutenção</option>
                </FormInput>
                <FormInput isDark={isDark} label="⏱️ Duração do Anúncio" as="select" value={anuncioDuracao} onChange={e => setAnuncioDuracao(e.target.value)}>
                  <option value="1h">1 hora</option>
                  <option value="6h">6 horas</option>
                  <option value="12h">12 horas</option>
                  <option value="24h">24 horas (padrão)</option>
                  <option value="48h">48 horas</option>
                  <option value="72h">3 dias</option>
                  <option value="168h">7 dias</option>
                  <option value="never">Sem expiração</option>
                </FormInput>
                <PrimaryButton gradient="linear-gradient(135deg, #f97316, #ea580c)" shadow="0 4px 16px rgba(249,115,22,0.4)" onClick={() => {
                  if (!anuncioTitulo) return showToast("Digite um título para o anúncio.", "error");
                  const duracaoMs = anuncioDuracao === "never" ? null : parseInt(anuncioDuracao) * 60 * 60 * 1000;
                  const expiresAt = duracaoMs ? Date.now() + duracaoMs : null;
                  const novoItem = {
                    id: Date.now(),
                    titulo: anuncioTitulo,
                    mensagem: anuncioMsg,
                    tipo: anuncioTipo,
                    data: new Date().toLocaleDateString("pt-BR"),
                    expiresAt,
                    duracaoLabel: anuncioDuracao === "never" ? "Sem expiração" : `Expira em ${anuncioDuracao.replace("h", "h")}`
                  };
                  const novaLista = [novoItem, ...anunciosEnviados];
                  setAnunciosEnviados(novaLista);
                  try {
                    localStorage.setItem("devhub_anuncios_globais", JSON.stringify(novaLista));

                    // Sincroniza com o Backend MySQL
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                    fetch(`${apiUrl}/superadmin/anuncio`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ mensagem: `${anuncioTitulo}${anuncioMsg ? ` — ${anuncioMsg}` : ''}`, autor: "Super Admin" })
                    }).catch(() => {});

                    // Sincroniza com a Central de Notificações
                    const rawNotifs = localStorage.getItem("devhub_notifications");
                    const prevNotifs = rawNotifs ? JSON.parse(rawNotifs) : [];
                    const novaNotifCenter = {
                      id: Date.now(),
                      tipo: anuncioTipo === "alerta" ? "alerta" : anuncioTipo === "conquista" ? "conquista" : "agenda",
                      titulo: `📢 ${anuncioTitulo}`,
                      texto: anuncioMsg || anuncioTitulo,
                      tempo: "Agora",
                      lida: false
                    };
                    localStorage.setItem("devhub_notifications", JSON.stringify([novaNotifCenter, ...prevNotifs]));
                    
                    // Dispara evento global de atualização em tempo real
                    window.dispatchEvent(new CustomEvent("devhub_anuncio_publicado"));
                  } catch (e) {}
                  setAnuncioTitulo(""); setAnuncioMsg(""); setAnuncioTipo("info"); setAnuncioDuracao("24h");
                  showToast("📢 Anúncio global publicado para todos os alunos!");
                }}>
                  <Send size={17} /> Publicar Anúncio
                </PrimaryButton>

                {/* Histórico de Anúncios */}
                <div style={{ marginTop: "6px" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: "700", color: isDark ? "#94a3b8" : "#64748b", marginBottom: "10px" }}>HISTÓRICO DE ANÚNCIOS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {anunciosEnviados.map((a, i) => {
                      const expirado = a.expiresAt && Date.now() > a.expiresAt;
                      const expiraEm = a.expiresAt ? new Date(a.expiresAt).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : null;
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", backgroundColor: expirado ? (isDark ? "rgba(239,68,68,0.05)" : "rgba(239,68,68,0.04)") : (isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC"), borderRadius: "12px", border: `1px solid ${expirado ? "rgba(239,68,68,0.3)" : (isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0")}`, opacity: expirado ? 0.6 : 1 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "0.85rem", fontWeight: "700", color: isDark ? "#FFF" : "#0F172A", display: "flex", alignItems: "center", gap: "6px" }}>
                              {a.titulo}
                              {expirado && <span style={{ fontSize: "0.7rem", background: "rgba(239,68,68,0.15)", color: "#EF4444", padding: "2px 6px", borderRadius: "6px", fontWeight: "600" }}>EXPIRADO</span>}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: isDark ? "#94a3b8" : "#64748b", marginTop: "2px" }}>
                              {a.data} · {a.tipo}
                              {expiraEm && <span style={{ marginLeft: "6px", color: expirado ? "#EF4444" : "#f97316" }}>⏱️ {expirado ? `Expirou em ${expiraEm}` : `Expira em ${expiraEm}`}</span>}
                              {!a.expiresAt && <span style={{ marginLeft: "6px", color: isDark ? "#64748b" : "#94a3b8" }}>∞ Sem expiração</span>}
                            </div>
                          </div>
                          <button onClick={() => {
                            const novaLista = anunciosEnviados.filter(x => x.id !== a.id);
                            setAnunciosEnviados(novaLista);
                            try {
                              localStorage.setItem("devhub_anuncios_globais", JSON.stringify(novaLista));
                              if (novaLista.length === 0) {
                                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                                fetch(`${apiUrl}/superadmin/anuncio`, { method: "DELETE" }).catch(() => {});
                              }
                              window.dispatchEvent(new CustomEvent("devhub_anuncio_publicado"));
                            } catch (e) {}
                          }} style={{ background: "rgba(239,68,68,0.12)", border: "none", color: "#EF4444", padding: "6px", borderRadius: "8px", cursor: "pointer", flexShrink: 0 }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SectionCard>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Notificação Individual */}
              <SectionCard isDark={isDark} icon={<Bell size={20} color="#FFF" />} gradient="linear-gradient(135deg, #a855f7, #7c3aed)" title="🔔 Notificação para Aluno" subtitle="Enviar alerta direto para um aluno específico">
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <FormInput isDark={isDark} label="Selecionar Aluno" as="select" value={notifAluno} onChange={e => setNotifAluno(e.target.value)}>
                    <option value="">— Selecione um aluno —</option>
                    {usuarios.map(u => <option key={u.id} value={u.nome}>{u.nome}</option>)}
                  </FormInput>
                  <FormInput isDark={isDark} label="Mensagem" as="textarea" value={notifMensagem} onChange={e => setNotifMensagem(e.target.value)} placeholder="Ex: Você tem uma prova pendente!" style={{ minHeight: "80px" }} />
                  <PrimaryButton gradient="linear-gradient(135deg, #a855f7, #7c3aed)" shadow="0 4px 16px rgba(168,85,247,0.4)" onClick={() => {
                    if (!notifAluno || !notifMensagem) return showToast("Selecione um aluno e escreva a mensagem.", "error");
                    let salvas = [];
                    try {
                      const raw = localStorage.getItem("devhub_notificacoes_alunos");
                      if (raw) salvas = JSON.parse(raw);
                    } catch (e) {}
                    const novaNotif = {
                      id: Date.now(),
                      aluno: notifAluno,
                      mensagem: notifMensagem,
                      lida: false,
                      data: new Date().toLocaleDateString("pt-BR") + " " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                    };
                    const listaAtualizada = [novaNotif, ...salvas];
                    try {
                      localStorage.setItem("devhub_notificacoes_alunos", JSON.stringify(listaAtualizada));

                      // Sincroniza com a Central de Notificações
                      const rawNotifs = localStorage.getItem("devhub_notifications");
                      const prevNotifs = rawNotifs ? JSON.parse(rawNotifs) : [];
                      const novaNotifCenter = {
                        id: Date.now(),
                        tipo: "alerta",
                        titulo: `🔔 Notificação do Administrador`,
                        texto: `[Para ${notifAluno}]: ${notifMensagem}`,
                        tempo: "Agora",
                        lida: false
                      };
                      localStorage.setItem("devhub_notifications", JSON.stringify([novaNotifCenter, ...prevNotifs]));
                    } catch (e) {}
                    showToast(`🔔 Notificação enviada para ${notifAluno}!`);
                    setNotifAluno(""); setNotifMensagem("");
                  }}>
                    <Bell size={17} /> Enviar Notificação
                  </PrimaryButton>
                </div>
              </SectionCard>


            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════
          ABA 3 — GESTÃO DE PROVAS
      ══════════════════════════════════════════════════ */}
      {abaAdmin === "provas" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "20px" }}>

            {/* Criar Prova */}
            <SectionCard isDark={isDark} icon={<Plus size={20} color="#FFF" />} gradient="linear-gradient(135deg, rgba(16,185,129,0.35), rgba(5,150,105,0.25))" border="1px solid rgba(16,185,129,0.5)" glow="0 0 16px rgba(16,185,129,0.35)" title="📝 Criar Nova Prova" subtitle="Monte e publique uma avaliação para a turma">
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <FormInput isDark={isDark} label="Título da Prova" value={novaProvaTitulo} onChange={e => setNovaProvaTitulo(e.target.value)} placeholder="Ex: Prova Final de React.js & Next.js" />
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <FormInput isDark={isDark} label="Matéria / Tema" as="select" value={novaProvaMateria} onChange={e => setNovaProvaMateria(e.target.value)}>
                    {["JavaScript", "React.js", "Node.js", "Banco de Dados", "Estruturas de Dados", "CSS & HTML", "Python & Data", "DevOps & Cloud", "IA & Machine Learning", "Outro (Digite abaixo)"].map(m => (
                      <option key={m} value={m} style={{ backgroundColor: isDark ? "#0F172A" : "#FFFFFF", color: isDark ? "#F8FAFC" : "#0F172A", padding: "10px" }}>{m}</option>
                    ))}
                  </FormInput>

                  <FormInput isDark={isDark} label="Formato / Tipo" as="select" value={novaProvaTipo} onChange={e => setNovaProvaTipo(e.target.value)}>
                    <option value="📋 Múltipla Escolha" style={{ backgroundColor: isDark ? "#0F172A" : "#FFFFFF", color: isDark ? "#F8FAFC" : "#0F172A", padding: "10px" }}>📋 Múltipla Escolha</option>
                    <option value="💻 Desafio de Código" style={{ backgroundColor: isDark ? "#0F172A" : "#FFFFFF", color: isDark ? "#F8FAFC" : "#0F172A", padding: "10px" }}>💻 Desafio de Código</option>
                    <option value="✍️ Discursiva / Dissertativa" style={{ backgroundColor: isDark ? "#0F172A" : "#FFFFFF", color: isDark ? "#F8FAFC" : "#0F172A", padding: "10px" }}>✍️ Discursiva / Dissertativa</option>
                    <option value="⚡ Quiz Rápido (Time Attack)" style={{ backgroundColor: isDark ? "#0F172A" : "#FFFFFF", color: isDark ? "#F8FAFC" : "#0F172A", padding: "10px" }}>⚡ Quiz Rápido (Time Attack)</option>
                    <option value="🚀 Projeto Final / Entregável" style={{ backgroundColor: isDark ? "#0F172A" : "#FFFFFF", color: isDark ? "#F8FAFC" : "#0F172A", padding: "10px" }}>🚀 Projeto Final / Entregável</option>
                    <option value="🎤 Live Coding / Prática" style={{ backgroundColor: isDark ? "#0F172A" : "#FFFFFF", color: isDark ? "#F8FAFC" : "#0F172A", padding: "10px" }}>🎤 Live Coding / Prática</option>
                  </FormInput>
                </div>

                {novaProvaMateria === "Outro (Digite abaixo)" && (
                  <FormInput
                    isDark={isDark}
                    label="Digite o Tema Personalizado"
                    value={novaProvaMateriaCustom}
                    onChange={e => setNovaProvaMateriaCustom(e.target.value)}
                    placeholder="Ex: Cybersecurity, Golang, Flutter, etc."
                  />
                )}

                <FormInput isDark={isDark} label="Prazo de Entrega" type="date" value={novaProvaPrazo} onChange={e => setNovaProvaPrazo(e.target.value)} />
                
                <PrimaryButton gradient="linear-gradient(135deg, #10b981, #059669)" shadow="0 4px 16px rgba(16,185,129,0.4)" onClick={() => {
                  const materiaFinal = novaProvaMateria === "Outro (Digite abaixo)" ? (novaProvaMateriaCustom.trim() || "Geral") : novaProvaMateria;
                  if (!novaProvaTitulo || !novaProvaPrazo) return showToast("Preencha o título e o prazo da prova.", "error");
                  setProvas(prev => [{ id: Date.now(), titulo: novaProvaTitulo, materia: materiaFinal, prazo: novaProvaPrazo, tipo: novaProvaTipo, ativa: true }, ...prev]);
                  setNovaProvaTitulo(""); setNovaProvaPrazo(""); setNovaProvaMateriaCustom("");
                  showToast("✅ Prova criada e publicada com sucesso!");
                }}>
                  <Plus size={17} /> Publicar Prova
                </PrimaryButton>
              </div>
            </SectionCard>

            {/* Lista de Provas */}
            <SectionCard isDark={isDark} icon={<ClipboardList size={20} color="#FFF" />} gradient="linear-gradient(135deg, rgba(245,158,11,0.35), rgba(217,119,6,0.25))" border="1px solid rgba(245,158,11,0.5)" glow="0 0 16px rgba(245,158,11,0.35)" title="📋 Provas Cadastradas" subtitle="Gerencie as avaliações existentes">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "420px", overflowY: "auto" }}>
                {provas.map((p) => (
                  <div key={p.id} style={{
                    padding: "14px 16px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                    borderRadius: "14px", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <div>
                        <div style={{ fontSize: "0.92rem", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A" }}>{p.titulo}</div>
                        <div style={{ fontSize: "0.78rem", color: isDark ? "#94a3b8" : "#64748b", marginTop: "4px", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ fontWeight: "700", color: isDark ? "#cbd5e1" : "#334155" }}>📚 {p.materia}</span>
                          <span>•</span>
                          <span style={{ color: "#a855f7", fontWeight: "600" }}>{p.tipo.startsWith("📋") || p.tipo.startsWith("💻") || p.tipo.startsWith("✍️") || p.tipo.startsWith("⚡") || p.tipo.startsWith("🚀") || p.tipo.startsWith("🎤") ? p.tipo : `📝 ${p.tipo}`}</span>
                          <span>•</span>
                          <span>📅 Prazo: {p.prazo}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                        <button onClick={() => {
                          setNotaProvaId(String(p.id));
                          setNotaMateria(p.materia);
                          setNotaObservacao(`Referente à prova: "${p.titulo}"`);
                          setAbaAdmin("academico");
                          showToast(`Lançando notas para a prova "${p.titulo}"`);
                        }} title="Lançar / Corrigir Notas desta Prova" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", color: "#f59e0b", padding: "7px 11px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.75rem", fontWeight: "700" }}>
                          <Award size={14} />
                          <span>Lançar Nota</span>
                        </button>
                        <button onClick={() => { setModalQuestoesProva(p); setModalMsg(null); }} title="Cadastrar / Editar Questões da Prova" style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)", color: "#a855f7", padding: "7px 11px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.75rem", fontWeight: "700" }}>
                          <HelpCircle size={14} />
                          <span>Questões ({p.questoes?.length || 0})</span>
                        </button>
                        <button onClick={() => {
                          setProvas(prev => prev.map(x => x.id === p.id ? { ...x, ativa: !x.ativa } : x));
                          showToast(`Prova ${p.ativa ? "pausada" : "reativada"}!`);
                        }} title={p.ativa ? "Pausar Prova" : "Reativar Prova"} style={{ background: p.ativa ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.1)", border: "none", color: p.ativa ? "#10B981" : "#EF4444", padding: "7px 10px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: "700" }}>
                          {p.ativa ? <Unlock size={14} /> : <Lock size={14} />}
                          <span>{p.ativa ? "Ativa" : "Pausada"}</span>
                        </button>
                        <button onClick={() => { setProvas(prev => prev.filter(x => x.id !== p.id)); showToast("Prova excluída."); }}
                          title="Excluir Prova"
                          style={{ background: "rgba(239,68,68,0.12)", border: "none", color: "#EF4444", padding: "7px", borderRadius: "8px", cursor: "pointer" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════
          ABA 4 — DASHBOARD GERAL & ANALYTICS EXECUTIVO
      ══════════════════════════════════════════════════ */}
      {abaAdmin === "analytics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* 1. CARDS DE KPI DE RESUMO EXECUTIVO (CLICÁVEIS) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            
            {/* KPI 1: Alunos */}
            <div
              onClick={() => setModalEstatisticaKpi("alunos")}
              style={{
                backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                border: `1.5px solid ${isDark ? "rgba(168,85,247,0.3)" : "#E2E8F0"}`,
                borderRadius: "18px", padding: "18px 20px",
                boxShadow: isDark ? "0 10px 25px rgba(0,0,0,0.25)" : "0 4px 12px rgba(0,0,0,0.05)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                userSelect: "none"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = isDark ? "#a855f7" : "#8b5cf6";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(168,85,247,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = isDark ? "rgba(168,85,247,0.3)" : "#E2E8F0";
                e.currentTarget.style.boxShadow = isDark ? "0 10px 25px rgba(0,0,0,0.25)" : "0 4px 12px rgba(0,0,0,0.05)";
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: "700", color: isDark ? "#94a3b8" : "#64748b" }}>Total de Alunos</span>
                  <span style={{ fontSize: "0.68rem", backgroundColor: "rgba(168,85,247,0.15)", color: "#a855f7", padding: "2px 6px", borderRadius: "6px", fontWeight: "800" }}>📊 Ver stats</span>
                </div>
                <div style={{ fontSize: "1.7rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A", marginTop: "4px" }}>
                  {usuarios.length > 0 ? usuarios.length : 6} <span style={{ fontSize: "0.8rem", color: "#10B981", fontWeight: "700" }}>+14% ms</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: isDark ? "#cbd5e1" : "#475569", marginTop: "2px", display: "block" }}>Estudantes ativos na base</span>
              </div>
              <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(124,58,237,0.2))", border: "1px solid rgba(168,85,247,0.5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(168,85,247,0.3)" }}>
                <Users size={22} color="#a855f7" />
              </div>
            </div>

            {/* KPI 2: Turmas & Bases */}
            <div
              onClick={() => setModalEstatisticaKpi("bases")}
              style={{
                backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                border: `1.5px solid ${isDark ? "rgba(59,130,246,0.3)" : "#E2E8F0"}`,
                borderRadius: "18px", padding: "18px 20px",
                boxShadow: isDark ? "0 10px 25px rgba(0,0,0,0.25)" : "0 4px 12px rgba(0,0,0,0.05)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                userSelect: "none"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = isDark ? "#3B82F6" : "#2563EB";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(59,130,246,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = isDark ? "rgba(59,130,246,0.3)" : "#E2E8F0";
                e.currentTarget.style.boxShadow = isDark ? "0 10px 25px rgba(0,0,0,0.25)" : "0 4px 12px rgba(0,0,0,0.05)";
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: "700", color: isDark ? "#94a3b8" : "#64748b" }}>Bases & Formações</span>
                  <span style={{ fontSize: "0.68rem", backgroundColor: "rgba(59,130,246,0.15)", color: "#3B82F6", padding: "2px 6px", borderRadius: "6px", fontWeight: "800" }}>📊 Ver stats</span>
                </div>
                <div style={{ fontSize: "1.7rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A", marginTop: "4px" }}>
                  3 <span style={{ fontSize: "0.8rem", color: "#3B82F6", fontWeight: "700" }}>Ativas</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: isDark ? "#cbd5e1" : "#475569", marginTop: "2px", display: "block" }}>DevHub, Contab & CF Smart</span>
              </div>
              <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(29,78,216,0.2))", border: "1px solid rgba(59,130,246,0.5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(59,130,246,0.3)" }}>
                <Building2 size={22} color="#3B82F6" />
              </div>
            </div>

            {/* KPI 3: Provas & Avaliações */}
            <div
              onClick={() => setModalEstatisticaKpi("provas")}
              style={{
                backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                border: `1.5px solid ${isDark ? "rgba(16,185,129,0.3)" : "#E2E8F0"}`,
                borderRadius: "18px", padding: "18px 20px",
                boxShadow: isDark ? "0 10px 25px rgba(0,0,0,0.25)" : "0 4px 12px rgba(0,0,0,0.05)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                userSelect: "none"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = isDark ? "#10B981" : "#059669";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(16,185,129,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = isDark ? "rgba(16,185,129,0.3)" : "#E2E8F0";
                e.currentTarget.style.boxShadow = isDark ? "0 10px 25px rgba(0,0,0,0.25)" : "0 4px 12px rgba(0,0,0,0.05)";
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: "700", color: isDark ? "#94a3b8" : "#64748b" }}>Provas Publicadas</span>
                  <span style={{ fontSize: "0.68rem", backgroundColor: "rgba(16,185,129,0.15)", color: "#10B981", padding: "2px 6px", borderRadius: "6px", fontWeight: "800" }}>📊 Ver stats</span>
                </div>
                <div style={{ fontSize: "1.7rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A", marginTop: "4px" }}>
                  {provas.length} <span style={{ fontSize: "0.8rem", color: "#10B981", fontWeight: "700" }}>{provas.filter(p => p.ativa).length} ativas</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: isDark ? "#cbd5e1" : "#475569", marginTop: "2px", display: "block" }}>Taxa de conclusão: 89%</span>
              </div>
              <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(5,150,105,0.2))", border: "1px solid rgba(16,185,129,0.5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(16,185,129,0.3)" }}>
                <ClipboardList size={22} color="#10B981" />
              </div>
            </div>

            {/* KPI 4: Taxa de Resolução */}
            <div
              onClick={() => setModalEstatisticaKpi("suporte")}
              style={{
                backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                border: `1.5px solid ${isDark ? "rgba(245,158,11,0.3)" : "#E2E8F0"}`,
                borderRadius: "18px", padding: "18px 20px",
                boxShadow: isDark ? "0 10px 25px rgba(0,0,0,0.25)" : "0 4px 12px rgba(0,0,0,0.05)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                userSelect: "none"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = isDark ? "#F59E0B" : "#D97706";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(245,158,11,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = isDark ? "rgba(245,158,11,0.3)" : "#E2E8F0";
                e.currentTarget.style.boxShadow = isDark ? "0 10px 25px rgba(0,0,0,0.25)" : "0 4px 12px rgba(0,0,0,0.05)";
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: "700", color: isDark ? "#94a3b8" : "#64748b" }}>Suporte & Tickets</span>
                  <span style={{ fontSize: "0.68rem", backgroundColor: "rgba(245,158,11,0.15)", color: "#F59E0B", padding: "2px 6px", borderRadius: "6px", fontWeight: "800" }}>📊 Ver stats</span>
                </div>
                <div style={{ fontSize: "1.7rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A", marginTop: "4px" }}>
                  98% <span style={{ fontSize: "0.8rem", color: "#F59E0B", fontWeight: "700" }}>Resolvidos</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: isDark ? "#cbd5e1" : "#475569", marginTop: "2px", display: "block" }}>Tempo médio: 42 min</span>
              </div>
              <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "linear-gradient(135deg, rgba(245,158,11,0.3), rgba(217,119,6,0.2))", border: "1px solid rgba(245,158,11,0.5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(245,158,11,0.3)" }}>
                <LifeBuoy size={22} color="#F59E0B" />
              </div>
            </div>

          </div>

          {/* 2. GRID SEGUNDO NÍVEL: RETENÇÃO SEMANAL + DESEMPENHO POR MATÉRIA */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "20px" }}>
            
            {/* Retenção Semanal */}
            <SectionCard isDark={isDark} icon={<Flame size={20} color="#FFF" />} gradient="linear-gradient(135deg, rgba(249,115,22,0.35), rgba(234,88,12,0.25))" border="1px solid rgba(249,115,22,0.5)" glow="0 0 16px rgba(249,115,22,0.35)" title="🔥 Retenção Semanal de Alunos" subtitle="Sessões de estudo por aluno nesta semana">
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {retencaoSemanal.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `${a.cor}22`, border: `1px solid ${a.cor}55`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", color: a.cor, fontSize: "0.9rem", flexShrink: 0 }}>
                      {a.nome.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.86rem", fontWeight: "700", color: isDark ? "#E2E8F0" : "#334155", marginBottom: "4px" }}>
                        <span>{a.nome}</span>
                        <span style={{ color: a.cor, fontWeight: "800" }}>{a.sessoes}x esta semana</span>
                      </div>
                      <div style={{ height: "8px", backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0", borderRadius: "8px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(a.sessoes / 7) * 100}%`, backgroundColor: a.cor, borderRadius: "8px", transition: "width 1s ease" }} />
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: "6px", padding: "10px 14px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: "12px", fontSize: "0.8rem", color: isDark ? "#94a3b8" : "#64748b" }}>
                  🟢 Verde = 3+ sessões &nbsp;|&nbsp; 🟡 Amarelo = 1-2 &nbsp;|&nbsp; 🔴 Vermelho = Risco
                </div>
              </div>
            </SectionCard>

            {/* Desempenho por Matéria (Dinâmico com base nas Provas Criadas) */}
            <SectionCard isDark={isDark} icon={<BarChart2 size={20} color="#FFF" />} gradient="linear-gradient(135deg, rgba(168,85,247,0.35), rgba(124,58,237,0.25))" border="1px solid rgba(168,85,247,0.5)" glow="0 0 16px rgba(168,85,247,0.35)" title="📊 Rendimento Médio por Matéria" subtitle="Aproveitamento geral da turma por tecnologia">
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "360px", overflowY: "auto" }}>
                {(() => {
                  const PALETA_CORES = ["#10B981", "#3B82F6", "#F59E0B", "#A855F7", "#06B6D4", "#EC4899", "#EAB308", "#6366F1"];
                  const materiasDasProvas = Array.from(new Set(provas.map(p => p.materia).filter(Boolean)));
                  const materiasPadrao = ["JavaScript", "React.js", "Node.js", "Banco de Dados", "Estruturas de Dados"];
                  const listaUnica = Array.from(new Set([...materiasDasProvas, ...materiasPadrao]));

                  return listaUnica.map((materiaNome, idx) => {
                    const cor = PALETA_CORES[idx % PALETA_CORES.length];
                    const provasM = provas.filter(p => p.materia === materiaNome);
                    const pct = provasM.length > 0 
                      ? Math.min(98, Math.max(75, 80 + (provasM.length * 4)))
                      : 82 + ((idx * 5) % 15);

                    return (
                      <div key={materiaNome}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", fontWeight: "700", color: isDark ? "#FFF" : "#0F172A", marginBottom: "6px" }}>
                          <span>{materiaNome}</span>
                          <span style={{ color: cor, fontWeight: "800" }}>{pct}% de aproveitamento</span>
                        </div>
                        <div style={{ height: "10px", backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, backgroundColor: cor, borderRadius: "10px", transition: "width 1s ease", boxShadow: `0 0 10px ${cor}66` }} />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </SectionCard>

          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════
          ABA 5 — GESTÃO ACADÊMICA
      ══════════════════════════════════════════════════ */}
      {abaAdmin === "academico" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "20px" }}>

            {/* Lançar Nota Manual */}
            <SectionCard isDark={isDark} icon={<Award size={20} color="#FFF" />} gradient="linear-gradient(135deg, #f59e0b, #d97706)" title="📊 Lançar Nota Manual" subtitle="Inserir ou corrigir nota fora do sistema automático">
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <FormInput isDark={isDark} label="Aluno" as="select" value={notaAluno} onChange={e => setNotaAluno(e.target.value)}>
                  <option value="">— Selecione o aluno —</option>
                  {usuarios.map(u => <option key={u.id} value={u.nome}>{u.nome}</option>)}
                </FormInput>

                <FormInput isDark={isDark} label="Vincular à Prova Criada *" as="select" value={notaProvaId} onChange={e => {
                  const pId = e.target.value;
                  setNotaProvaId(pId);
                  const pEncontrada = provas.find(p => String(p.id) === String(pId));
                  if (pEncontrada) {
                    setNotaMateria(pEncontrada.materia);
                    setNotaObservacao(`Referente à prova: "${pEncontrada.titulo}"`);
                  }
                }}>
                  <option value="">— Selecione a prova (Obrigatório) —</option>
                  {provas.map(p => (
                    <option key={p.id} value={p.id}>{p.titulo} ({p.materia})</option>
                  ))}
                </FormInput>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <FormInput isDark={isDark} label="Matéria / Conteúdo (Opcional - Auto-preenchida)" as="select" value={notaMateria} onChange={e => setNotaMateria(e.target.value)}>
                    <option value="">— Manter Matéria da Prova —</option>
                    {(() => {
                      const materiasProvas = Array.from(new Set(provas.map(p => p.materia).filter(Boolean)));
                      const materiasPadrao = ["JavaScript", "React.js", "Node.js", "Banco de Dados", "Estruturas de Dados", "Git & GitHub"];
                      const todas = Array.from(new Set([...materiasPadrao, ...materiasProvas]));
                      return todas.map(m => <option key={m} value={m}>{m}</option>);
                    })()}
                  </FormInput>
                  <FormInput isDark={isDark} label="Nota (0-10) *" type="number" value={notaValor} onChange={e => setNotaValor(e.target.value)} placeholder="Ex: 8.5" />
                </div>
                <FormInput isDark={isDark} label="Observação (opcional)" as="textarea" value={notaObservacao} onChange={e => setNotaObservacao(e.target.value)} placeholder="Justificativa da nota..." style={{ minHeight: "70px" }} />
                <PrimaryButton gradient="linear-gradient(135deg, #f59e0b, #d97706)" shadow="0 4px 16px rgba(245,158,11,0.4)" onClick={() => {
                  if (!notaAluno) return showToast("Selecione o aluno.", "error");
                  if (!notaProvaId) return showToast("A seleção da prova é obrigatória!", "error");
                  if (!notaValor) return showToast("Informe a nota de 0 a 10.", "error");

                  const pEncontrada = provas.find(p => String(p.id) === String(notaProvaId));
                  const materiaFinal = notaMateria || (pEncontrada ? pEncontrada.materia : "Geral");
                  const provaTitulo = pEncontrada ? pEncontrada.titulo : "Prova";

                  // Registra a nota no histórico
                  const novaNota = {
                    aluno: notaAluno,
                    materia: materiaFinal,
                    prova: provaTitulo,
                    nota: parseFloat(notaValor),
                    obs: notaObservacao,
                    data: "Agora"
                  };
                  setNotasLancadas(prev => [novaNota, ...prev]);

                  // Envia notificação ao aluno e atualiza o storage
                  try {
                    const savedNotifs = localStorage.getItem("devhub_notifications") || "[]";
                    const notifsList = JSON.parse(savedNotifs);
                    const notifObj = {
                      id: Date.now(),
                      alunoAlvo: notaAluno,
                      titulo: `📝 Nota Lançada: ${provaTitulo}`,
                      mensagem: `Sua nota na prova "${provaTitulo}" (${materiaFinal}) foi lançada pelo professor: ${notaValor}/10.`,
                      tipo: "nota",
                      data: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
                      lida: false
                    };
                    localStorage.setItem("devhub_notifications", JSON.stringify([notifObj, ...notifsList]));
                    window.dispatchEvent(new Event("storage"));
                  } catch (e) {}

                  showToast(`✅ Nota ${notaValor} lançada para ${notaAluno} na prova "${provaTitulo}"!`);
                  setNotaAluno(""); setNotaProvaId(""); setNotaValor(""); setNotaObservacao(""); setNotaMateria("");
                }}>
                  <CheckCircle size={17} /> Lançar Nota
                </PrimaryButton>

                {/* Histórico de Notas */}
                <div style={{ marginTop: "6px" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: "700", color: isDark ? "#94a3b8" : "#64748b", marginBottom: "10px" }}>ÚLTIMAS NOTAS LANÇADAS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {notasLancadas.map((n, i) => (
                      <div key={i} style={{ padding: "10px 14px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: "12px", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0"}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.86rem", fontWeight: "700", color: isDark ? "#FFF" : "#0F172A" }}>{n.aluno} — {n.materia}</span>
                          <span style={{ fontSize: "0.88rem", fontWeight: "900", color: n.nota >= 7 ? "#10B981" : "#EF4444" }}>{n.nota} / 10</span>
                        </div>
                        {n.obs && <div style={{ fontSize: "0.75rem", color: isDark ? "#94a3b8" : "#64748b", marginTop: "2px" }}>{n.obs}</div>}
                        <div style={{ fontSize: "0.72rem", color: isDark ? "#64748b" : "#94a3b8", marginTop: "2px" }}>{n.data}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Gerar Boletim */}
              <SectionCard isDark={isDark} icon={<FileText size={20} color="#FFF" />} gradient="linear-gradient(135deg, #10b981, #059669)" title="📄 Gerar Boletim PDF" subtitle="Exportar relatório de desempenho individual">
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <FormInput isDark={isDark} label="Selecionar Aluno" as="select" value={boletimAluno} onChange={e => setBoletimAluno(e.target.value)}>
                    <option value="">— Selecione um aluno —</option>
                    {usuarios.map(u => <option key={u.id} value={u.nome}>{u.nome}</option>)}
                  </FormInput>
                  <div style={{ padding: "12px 14px", backgroundColor: isDark ? "rgba(16,185,129,0.07)" : "#F0FDF4", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "12px", fontSize: "0.8rem", color: isDark ? "#6ee7b7" : "#065f46" }}>
                    📋 O boletim trará notas por matéria, taxa de presença, duelos ganhos, XP acumulado e situação final em PDF oficial.
                  </div>
                  <PrimaryButton gradient="linear-gradient(135deg, #10b981, #059669)" shadow="0 4px 16px rgba(16,185,129,0.4)" onClick={gerarBoletimPDF}>
                    <FileText size={17} /> Gerar & Baixar Boletim PDF
                  </PrimaryButton>
                </div>
              </SectionCard>


            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════
          ABA 6 — CONTROLE DA PLATAFORMA
      ══════════════════════════════════════════════════ */}
      {abaAdmin === "plataforma" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "20px" }}>

            {/* Modo Manutenção */}
            <SectionCard isDark={isDark} icon={<WrenchIcon size={20} color="#FFF" />} gradient="linear-gradient(135deg, #ef4444, #dc2626)" title="🔧 Modo Manutenção" subtitle="Ativa um banner de aviso para todos os usuários">
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{
                  padding: "18px", borderRadius: "16px",
                  backgroundColor: modoManutencao ? "rgba(239,68,68,0.1)" : (isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC"),
                  border: `2px solid ${modoManutencao ? "rgba(239,68,68,0.4)" : (isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0")}`,
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", transition: "all 0.3s"
                }}>
                  <div>
                    <div style={{ fontSize: "1rem", fontWeight: "800", color: modoManutencao ? "#EF4444" : (isDark ? "#FFF" : "#0F172A") }}>
                      {modoManutencao ? "🔴 MANUTENÇÃO ATIVA" : "🟢 Plataforma Online"}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: isDark ? "#94a3b8" : "#64748b", marginTop: "2px" }}>
                      {modoManutencao ? "Alunos veem o banner de manutenção" : "Plataforma funcionando normalmente"}
                    </div>
                  </div>
                  <button
                    onClick={handleToggleManutencao}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: modoManutencao ? "#EF4444" : "#10B981" }}
                  >
                    {modoManutencao ? <ToggleRight size={42} /> : <ToggleLeft size={42} />}
                  </button>
                </div>

                <FormInput 
                  isDark={isDark} 
                  label="Mensagem de Manutenção" 
                  as="textarea" 
                  value={msgManutencao} 
                  onChange={e => handleMsgManutencaoChange(e.target.value)} 
                  style={{ minHeight: "80px" }} 
                />

                {modoManutencao && (
                  <div style={{ padding: "14px", backgroundColor: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "14px" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "#EF4444", marginBottom: "6px" }}>PREVIEW DO BANNER:</div>
                    <div style={{ fontSize: "0.85rem", color: isDark ? "#FCA5A5" : "#7F1D1D" }}>🔧 {msgManutencao}</div>
                  </div>
                )}
              </div>
            </SectionCard>


          </div>

          {/* Logs de Auditoria */}
          <SectionCard isDark={isDark} icon={<ClipboardList size={20} color="#FFF" />} gradient="linear-gradient(135deg, #64748b, #475569)" title="📋 Logs de Auditoria" subtitle="Histórico de ações dos usuários na plataforma (últimas 10)">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "380px", overflowY: "auto" }}>
              {logsAuditoria.map((log, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "11px 14px", backgroundColor: isDark ? "rgba(255,255,255,0.025)" : "#F8FAFC",
                  borderRadius: "12px", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#E2E8F0"}`
                }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: tipoLogColor(log.tipo), flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: "0.86rem", fontWeight: "700", color: isDark ? "#E2E8F0" : "#0F172A" }}>{log.user}</span>
                    <span style={{ fontSize: "0.84rem", color: isDark ? "#94a3b8" : "#64748b" }}> — {log.acao}</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0, alignItems: "center" }}>
                    <span style={{ fontSize: "0.74rem", fontWeight: "600", padding: "3px 8px", borderRadius: "8px", backgroundColor: `${tipoLogColor(log.tipo)}22`, color: tipoLogColor(log.tipo) }}>{log.modulo}</span>
                    <span style={{ fontSize: "0.76rem", color: isDark ? "#64748b" : "#94a3b8" }}>{log.hora}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}

      {/* ══════════════════════════════════════════════════
          ABA 7 — USUÁRIOS
      ══════════════════════════════════════════════════ */}
      {abaAdmin === "usuarios" && (
        <SectionCard isDark={isDark} icon={<Crown size={20} color="#FFF" />} gradient="linear-gradient(135deg, #F59E0B, #D97706)" title={`👥 Usuários no Banco (${usuariosFiltrados.length})`} subtitle="Gerencie as contas, permissões e vínculos de todos os membros">
          {/* Header Controls: Busca + Botão Criar Usuário */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: isDark ? "#64748b" : "#94a3b8" }} />
              <input
                type="text" placeholder="Buscar por nome, e-mail ou tag..."
                value={busca} onChange={e => setBusca(e.target.value)}
                style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: "12px", backgroundColor: isDark ? "#0f121d" : "#F8FAFC", border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}`, color: isDark ? "#FFF" : "#0F172A", fontSize: "0.86rem", outline: "none", fontFamily: "inherit" }}
              />
            </div>

            <button
              onClick={() => { limparForm(); setModalFormAberto(true); }}
              style={{
                padding: "11px 22px", borderRadius: "9999px",
                background: "linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)",
                color: "#FFF", border: "none",
                fontWeight: "800", fontSize: "0.98rem", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px",
                boxShadow: "0 8px 25px -4px rgba(99, 102, 241, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.35)",
                fontFamily: "inherit", whiteSpace: "nowrap",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                letterSpacing: "-0.01em"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.03)";
                e.currentTarget.style.boxShadow = "0 12px 30px -4px rgba(99, 102, 241, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 25px -4px rgba(99, 102, 241, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.35)";
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.96)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "translateY(-2px) scale(1.03)"}
            >
              <Plus size={19} /> Criar Nova Conta
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: isDark ? "#94a3b8" : "#64748b" }}>Carregando usuários...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "540px", overflowY: "auto" }}>
              {/* CABEÇALHO DAS COLUNAS (TÍTULOS SOLICITADOS) */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.2fr 1.5fr 1.5fr auto",
                alignItems: "center", gap: "16px",
                padding: "4px 18px 8px 18px",
                fontSize: "0.7rem", fontWeight: "800",
                color: isDark ? "#64748b" : "#94a3b8",
                textTransform: "uppercase", letterSpacing: "0.6px",
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0"}`
              }}>
                <div>Criado em</div>
                <div>Nome do Usuário</div>
                <div>Informações do Contato</div>
                <div>Bases Vinculadas</div>
                <div style={{ textAlign: "right" }}>Cargo & Opções</div>
              </div>

              {usuariosFiltrados.map(u => {
                const badge = getCargoBadge(u.cargo);
                const basesDoUsuario = getBasesDoUsuario(u);
                const rawDate = u.dataCriacao || u.created_at || u.createdAt || u.data;
                const dataCriacaoUser = formatarDataAmigavel(rawDate);
                const totalBases = basesDoUsuario.length;

                return (
                  <div key={u.id} style={{
                    backgroundColor: isDark ? "rgba(255,255,255,0.025)" : "#F8FAFC",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`,
                    borderRadius: "16px", padding: "12px 18px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1.2fr 1.5fr 1.5fr auto",
                    alignItems: "center", gap: "16px",
                    minWidth: 0, position: "relative",
                    transition: "all 0.2s ease"
                  }}>
                    {/* COLUNA 1: Criado em */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: "700", color: isDark ? "#E2E8F0" : "#1E293B" }}>
                      <Calendar size={14} color={isDark ? "#818CF8" : "#4F46E5"} />
                      <span>{dataCriacaoUser}</span>
                    </div>

                    {/* COLUNA 2: Nome do Usuário */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #0284c7, #0369a1)",
                        border: "1px solid rgba(56,189,248,0.4)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: "800", color: "#FFFFFF", fontSize: "0.85rem", flexShrink: 0,
                        boxShadow: "0 0 10px rgba(2,132,199,0.35)", overflow: "hidden"
                      }}>
                        {getUserCustomPhoto(u) ? (
                          <img src={getUserCustomPhoto(u)} alt={u.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          getInitials(u.nome)
                        )}
                      </div>
                      <span style={{ fontSize: "0.95rem", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {u.nome}
                      </span>
                    </div>

                    {/* COLUNA 3: Informações do Contato (E-mail) */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: isDark ? "#CBD5E1" : "#334155", minWidth: 0 }} title={u.email}>
                      <Mail size={14} color={isDark ? "#38BDF8" : "#0284C7"} />
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {u.email}
                      </span>
                    </div>

                    {/* COLUNA 4: Bases Vinculadas */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", minWidth: 0 }}>
                      {basesDoUsuario.slice(0, 2).map(bId => {
                        const bInfo = BASES_DISPONIVEIS.find(b => b.id === bId || (b.nome || "").toLowerCase().trim() === String(bId).toLowerCase().trim());
                        const baseColor = bInfo ? (bInfo.cor || bInfo.color || "#8B5CF6") : "#8B5CF6";
                        const baseNome = bInfo ? bInfo.nome : (bId === "devhub" ? "DevHub" : bId);

                        return (
                          <span key={bId} style={{
                            fontSize: "0.74rem", fontWeight: "800", padding: "4px 10px", borderRadius: "8px",
                            backgroundColor: `${baseColor}18`, color: baseColor, border: `1px solid ${baseColor}40`,
                            whiteSpace: "nowrap"
                          }}>
                            {baseNome}
                          </span>
                        );
                      })}

                      {totalBases > 2 && (
                        <span style={{
                          fontSize: "0.74rem", fontWeight: "800", padding: "4px 9px", borderRadius: "8px",
                          backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#C084FC", border: "1px solid rgba(168, 85, 247, 0.35)",
                          whiteSpace: "nowrap"
                        }}>
                          +{totalBases - 2} {totalBases - 2 === 1 ? "outra base" : "outras bases"}
                        </span>
                      )}
                    </div>

                    {/* COLUNA 5: Permissão / Cargo & Menu de 3 Pontinhos */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end", flexShrink: 0 }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: "800", padding: "3px 9px", borderRadius: "9999px", backgroundColor: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, whiteSpace: "nowrap" }}>
                        {badge.label}
                      </span>

                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUserMenuOpenId(userMenuOpenId === u.id ? null : u.id);
                          }}
                          title="Opções do Usuário"
                          style={{
                            width: "34px", height: "34px", borderRadius: "10px",
                            backgroundColor: userMenuOpenId === u.id ? (isDark ? "rgba(255,255,255,0.15)" : "#E2E8F0") : (isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9"),
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#CBD5E1"}`,
                            color: isDark ? "#FFF" : "#0F172A", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.2s"
                          }}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* Dropdown Popup Limpo */}
                        {userMenuOpenId === u.id && (
                          <div style={{
                            position: "absolute", right: 0, top: "42px", zIndex: 100,
                            minWidth: "220px", backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#E2E8F0"}`,
                            borderRadius: "14px", padding: "6px",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                            animation: "fadeIn 0.15s ease-out"
                          }}>
                            <div style={{ padding: "6px 10px 8px 10px", fontSize: "0.68rem", fontWeight: "800", color: isDark ? "#94a3b8" : "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              Opções do Usuário
                            </div>

                            {/* 1. Gerenciar Vínculos & Bases */}
                            <button
                              onClick={(e) => { e.stopPropagation(); setUserMenuOpenId(null); setModalVinculosUser(u); }}
                              style={{
                                width: "100%", padding: "9px 12px", borderRadius: "8px", border: "none",
                                backgroundColor: "transparent", color: isDark ? "#F3F4F6" : "#1F2937",
                                fontSize: "0.82rem", fontWeight: "700", textAlign: "left", cursor: "pointer",
                                display: "flex", alignItems: "center", gap: "10px", fontFamily: "inherit"
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? "rgba(59,130,246,0.15)" : "#EFF6FF"}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                              <Link2 size={16} color="#3B82F6" /> Gerenciar Vínculos & Bases
                            </button>

                            {/* 2. Alterar Cargo & Permissão */}
                            <button
                              onClick={(e) => { e.stopPropagation(); setUserMenuOpenId(null); setModalCargoUser(u); }}
                              style={{
                                width: "100%", padding: "9px 12px", borderRadius: "8px", border: "none",
                                backgroundColor: "transparent", color: isDark ? "#F3F4F6" : "#1F2937",
                                fontSize: "0.82rem", fontWeight: "700", textAlign: "left", cursor: "pointer",
                                display: "flex", alignItems: "center", gap: "10px", fontFamily: "inherit"
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? "rgba(245,158,11,0.15)" : "#FFFBEB"}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                              <ShieldCheck size={16} color="#F59E0B" /> Alterar Cargo / Permissão
                            </button>

                            {/* 3. Entrar na Base */}
                            <button
                              onClick={(e) => { e.stopPropagation(); setUserMenuOpenId(null); handleEntrarNaBaseDoUsuario(u); }}
                              style={{
                                width: "100%", padding: "9px 12px", borderRadius: "8px", border: "none",
                                backgroundColor: "transparent", color: "#10B981",
                                fontSize: "0.82rem", fontWeight: "700", textAlign: "left", cursor: "pointer",
                                display: "flex", alignItems: "center", gap: "10px", fontFamily: "inherit"
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(16,185,129,0.12)"}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                              <Zap size={16} color="#10B981" /> Entrar na Base
                            </button>

                            {/* 4. Editar Dados */}
                            <button
                              onClick={(e) => { e.stopPropagation(); setUserMenuOpenId(null); iniciarEdicao(u); }}
                              style={{
                                width: "100%", padding: "9px 12px", borderRadius: "8px", border: "none",
                                backgroundColor: "transparent", color: isDark ? "#F3F4F6" : "#1F2937",
                                fontSize: "0.82rem", fontWeight: "700", textAlign: "left", cursor: "pointer",
                                display: "flex", alignItems: "center", gap: "10px", fontFamily: "inherit"
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9"}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                              <Edit3 size={16} color="#3B82F6" /> Editar Dados
                            </button>

                            <div style={{ height: "1px", backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0", margin: "4px 0" }} />

                            {/* 5. Excluir Conta */}
                            <button
                              onClick={(e) => { e.stopPropagation(); setUserMenuOpenId(null); handleDeletarUsuario(u.id, u.nome); }}
                              style={{
                                width: "100%", padding: "9px 12px", borderRadius: "8px", border: "none",
                                backgroundColor: "transparent", color: "#EF4444",
                                fontSize: "0.82rem", fontWeight: "700", textAlign: "left", cursor: "pointer",
                                display: "flex", alignItems: "center", gap: "10px", fontFamily: "inherit"
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.12)"}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                              <Trash2 size={16} color="#EF4444" /> Excluir Conta
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      )}



      {/* Modal: Gerenciar Vínculos & Bases */}
      {modalVinculosUser && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.82)", backdropFilter: "blur(12px)",
          zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px"
        }} onClick={() => { setModalVinculosUser(null); setEditandoCargoHeader(false); }}>
          <div style={{
            backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
            border: `1.5px solid ${isDark ? "rgba(255,255,255,0.18)" : "#CBD5E1"}`,
            borderRadius: "24px", width: "100%", maxWidth: "620px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(59, 130, 246, 0.2)", overflow: "hidden",
            animation: "scaleUp 0.2s ease-out"
          }} onClick={e => e.stopPropagation()}>

            {/* Modal Header com Botão Lápis (Editar Cargo) */}
            <div style={{
              padding: "20px 24px",
              background: isDark ? "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)" : "linear-gradient(135deg, #F8FAFC, #EFF6FF)",
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0"}`,
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
                <div style={{
                  width: "46px", height: "46px", borderRadius: "14px",
                  background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 6px 16px rgba(59, 130, 246, 0.4)", flexShrink: 0
                }}>
                  <Link2 size={24} color="#FFF" />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: "900", margin: 0, color: isDark ? "#FFF" : "#0F172A" }}>
                      Gerenciar Vínculos & Bases
                    </h3>

                    {/* Badge do Cargo Atual + Botão Lápis */}
                    {(() => {
                      const currentU = usuarios.find(u => String(u.id) === String(modalVinculosUser.id)) || modalVinculosUser;
                      const currentCargo = (currentU.cargo || "usuario").toLowerCase();
                      const badge = currentCargo === "superadmin" || currentCargo === "super_admin"
                        ? { label: "Super Admin 👑", bg: "rgba(245,158,11,0.2)", color: "#F59E0B", border: "rgba(245,158,11,0.4)" }
                        : currentCargo === "admin"
                        ? { label: "Admin 🛡️", bg: "rgba(59,130,246,0.2)", color: "#3B82F6", border: "rgba(59,130,246,0.4)" }
                        : { label: "Aluno 🎓", bg: "rgba(16,185,129,0.2)", color: "#10B981", border: "rgba(16,185,129,0.4)" };

                      return (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{
                            fontSize: "0.75rem", fontWeight: "900", padding: "3px 10px", borderRadius: "8px",
                            background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color,
                            display: "inline-flex", alignItems: "center", gap: "4px"
                          }}>
                            {badge.label}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  <div style={{ fontSize: "0.82rem", color: isDark ? "#94A3B8" : "#64748B", marginTop: "3px" }}>
                    Usuário: <strong style={{ color: isDark ? "#FFF" : "#0F172A" }}>{modalVinculosUser.nome}</strong> ({modalVinculosUser.email})
                  </div>
                </div>
              </div>

              <button
                onClick={() => setModalVinculosUser(null)}
                style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer", padding: "6px", borderRadius: "8px" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Interface Limpa de Vínculos */}
            <div style={{ padding: "24px", maxHeight: "70vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "22px" }}>

              {(() => {
                const targetU = usuarios.find(u => String(u.id) === String(modalVinculosUser.id)) || modalVinculosUser;
                const userBases = getBasesDoUsuario(targetU);
                const basesVinculadas = BASES_DISPONIVEIS.filter(b => userBases.includes(b.id));
                const basesNaoVinculadas = BASES_DISPONIVEIS.filter(b => !userBases.includes(b.id));

                return (
                  <>
                    {/* SEÇÃO 1: BASES VINCULADAS */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                        <label style={{ display: "block", fontSize: "0.92rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A", margin: 0 }}>
                          🏢 Bases Vinculadas ({basesVinculadas.length})
                        </label>
                        <span style={{ fontSize: "0.78rem", color: isDark ? "#94A3B8" : "#64748B" }}>
                          Bases nas quais {modalVinculosUser.nome} possui acesso ativo.
                        </span>
                      </div>

                      {basesVinculadas.length === 0 ? (
                        <div style={{
                          padding: "24px", textAlign: "center", borderRadius: "16px",
                          background: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC",
                          border: `1px dashed ${isDark ? "rgba(255,255,255,0.1)" : "#CBD5E1"}`
                        }}>
                          <Building2 size={32} color={isDark ? "#475569" : "#94A3B8"} style={{ marginBottom: "8px" }} />
                          <p style={{ margin: 0, fontWeight: "700", color: isDark ? "#CBD5E1" : "#475569", fontSize: "0.9rem" }}>
                            Nenhuma base vinculada a este usuário.
                          </p>
                          <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: isDark ? "#64748B" : "#94A3B8" }}>
                            Selecione uma base abaixo para vincular.
                          </p>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {basesVinculadas.map(b => {
                            const cardColor = b.cor || b.color || "#3B82F6";
                            return (
                              <div
                                key={b.id}
                                style={{
                                  padding: "14px 18px", borderRadius: "16px",
                                  background: isDark ? "rgba(255, 255, 255, 0.04)" : "#F8FAFC",
                                  border: `1.5px solid ${isDark ? `${cardColor}45` : "#CBD5E1"}`,
                                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px"
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                                  {/* Fotinha / Emblema da Base */}
                                  <div style={{
                                    width: "44px", height: "44px", borderRadius: "14px",
                                    background: b.gradient || `linear-gradient(135deg, ${cardColor} 0%, ${cardColor}aa 100%)`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#FFF", flexShrink: 0, overflow: "hidden",
                                    boxShadow: `0 4px 14px ${cardColor}40`
                                  }}>
                                    {b.logoUrl && b.logoUrl.trim() ? (
                                      <img src={b.logoUrl} alt={b.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                      <span style={{ fontSize: "22px" }}>{b.icon || "🚀"}</span>
                                    )}
                                  </div>
                                  <div style={{ minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                      <span style={{ fontSize: "0.95rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A" }}>
                                        {b.nome}
                                      </span>
                                      <span style={{
                                        fontSize: "0.72rem", fontWeight: "900", color: cardColor,
                                        background: `${cardColor}20`, padding: "2px 8px", borderRadius: "6px",
                                        border: `1px solid ${cardColor}40`
                                      }}>
                                        {b.codigo || "BASE"}
                                      </span>
                                      <span style={{
                                        fontSize: "0.7rem", fontWeight: "800", color: "#10B981",
                                        background: "rgba(16, 185, 129, 0.15)", padding: "2px 8px", borderRadius: "6px",
                                        border: "1px solid rgba(16, 185, 129, 0.3)"
                                      }}>
                                        ✓ Vinculado
                                      </span>
                                    </div>
                                    <span style={{
                                      fontSize: "0.8rem", color: isDark ? "#94A3B8" : "#64748B",
                                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block"
                                    }}>
                                      {b.desc || "Base de organização e aprendizado."}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleToggleBaseVinculada(modalVinculosUser.id, b.id)}
                                  title="Desvincular usuário desta base"
                                  style={{
                                    padding: "8px 14px", borderRadius: "10px",
                                    background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)",
                                    color: "#EF4444", fontSize: "0.8rem", fontWeight: "800", cursor: "pointer",
                                    display: "flex", alignItems: "center", gap: "6px", flexShrink: 0,
                                    transition: "all 0.2s ease"
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = "#EF4444"; e.currentTarget.style.color = "#FFF"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)"; e.currentTarget.style.color = "#EF4444"; }}
                                >
                                  <Trash2 size={14} />
                                  <span>Desvincular</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* SEÇÃO 2: OUTRAS BASES DISPONÍVEIS PARA VINCULAR */}
                    {basesNaoVinculadas.length > 0 && (
                      <div>
                        <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "900", color: isDark ? "#CBD5E1" : "#475569", marginBottom: "10px" }}>
                          ➕ Vincular a Outras Bases ({basesNaoVinculadas.length}):
                        </label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {basesNaoVinculadas.map(b => {
                            const cardColor = b.cor || b.color || "#3B82F6";
                            return (
                              <div
                                key={b.id}
                                onClick={() => handleToggleBaseVinculada(modalVinculosUser.id, b.id)}
                                style={{
                                  padding: "12px 16px", borderRadius: "14px", cursor: "pointer",
                                  background: isDark ? "rgba(255, 255, 255, 0.02)" : "#FFF",
                                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0"}`,
                                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                                  transition: "all 0.2s ease"
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = cardColor;
                                  e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.05)" : "#F8FAFC";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0";
                                  e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.02)" : "#FFF";
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                                  {/* Fotinha / Emblema da Base */}
                                  <div style={{
                                    width: "38px", height: "38px", borderRadius: "10px",
                                    background: b.gradient || `linear-gradient(135deg, ${cardColor} 0%, ${cardColor}aa 100%)`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#FFF", flexShrink: 0, overflow: "hidden"
                                  }}>
                                    {b.logoUrl && b.logoUrl.trim() ? (
                                      <img src={b.logoUrl} alt={b.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                      <span style={{ fontSize: "18px" }}>{b.icon || "🏢"}</span>
                                    )}
                                  </div>
                                  <div style={{ minWidth: 0 }}>
                                    <span style={{ fontSize: "0.88rem", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A", display: "block" }}>
                                      {b.nome}
                                    </span>
                                    <span style={{ fontSize: "0.75rem", color: isDark ? "#94A3B8" : "#64748B" }}>
                                      {b.codigo || "BASE"}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  style={{
                                    padding: "6px 12px", borderRadius: "8px",
                                    background: `${cardColor}15`, border: `1px solid ${cardColor}40`,
                                    color: cardColor, fontSize: "0.78rem", fontWeight: "800", cursor: "pointer",
                                    display: "flex", alignItems: "center", gap: "5px", flexShrink: 0
                                  }}
                                >
                                  <Plus size={14} />
                                  <span>Vincular</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

            </div>

            {/* Modal Footer */}
            <div style={{
              padding: "16px 24px", backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC",
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`,
              display: "flex", justifyContent: "flex-end"
            }}>
              <button
                onClick={() => { setModalVinculosUser(null); showToast("Vínculos salvos com sucesso!"); }}
                style={{
                  padding: "12px 26px", background: "linear-gradient(135deg, #10B981, #059669)",
                  color: "#FFF", border: "none", borderRadius: "12px", fontWeight: "800",
                  fontSize: "0.9rem", cursor: "pointer", boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
                  fontFamily: "inherit", transition: "all 0.2s ease"
                }}
              >
                Concluir & Salvar Vínculos
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Criar / Editar Usuário */}
      {modalFormAberto && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
          zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px"
        }} onClick={() => setModalFormAberto(false)}>
          <div style={{
            backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
            border: `1.5px solid ${usuarioEditandoId ? "rgba(245,158,11,0.5)" : (isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1")}`,
            borderRadius: "24px", width: "100%", maxWidth: "520px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)", overflow: "hidden",
            animation: "scaleUp 0.2s ease-out"
          }} onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div style={{
              padding: "20px 24px",
              background: usuarioEditandoId ? "linear-gradient(135deg, #F59E0B, #D97706)" : "linear-gradient(135deg, #3B82F6, #1D4ED8)",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {usuarioEditandoId ? <Edit3 size={22} color="#FFF" /> : <Plus size={22} color="#FFF" />}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "800", margin: 0, color: "#FFF" }}>
                    {usuarioEditandoId ? `✏️ Editando: ${formNome}` : "➕ Criar Nova Conta"}
                  </h3>
                  <span style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.9)" }}>
                    {usuarioEditandoId ? "Altere as informações da conta do membro" : "Cadastre um novo aluno ou administrador"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModalFormAberto(false)}
                style={{ background: "transparent", border: "none", color: "#FFF", cursor: "pointer", padding: "6px" }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSalvarUsuario} style={{ padding: "26px", display: "flex", flexDirection: "column", gap: "18px" }}>
              
              {mensagemErro && (
                <div style={{ backgroundColor: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", color: "#ef4444", padding: "12px 16px", borderRadius: "12px", fontSize: "0.92rem", fontWeight: "700" }}>{mensagemErro}</div>
              )}

              <FormInput isDark={isDark} label="Nome Completo" value={formNome} onChange={e => setFormNome(e.target.value)} placeholder="Nome completo do aluno..." />
              
              <FormInput isDark={isDark} label="E-mail" type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="Email de acesso..." />
              
              <div>
                <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "700", color: isDark ? "#cbd5e1" : "#475569", marginBottom: "8px" }}>
                  Senha {usuarioEditandoId && "(ou mantenha a existente)"}
                </label>
                <div style={{ position: "relative" }}>
                  <input type={mostrarSenha ? "text" : "password"} value={formSenha} onChange={e => setFormSenha(e.target.value)} placeholder={usuarioEditandoId ? "Nova senha (opcional)..." : "Senha de acesso..."}
                    style={{ width: "100%", padding: "13px 44px 13px 16px", borderRadius: "12px", backgroundColor: isDark ? "#0f121d" : "#F8FAFC", border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}`, color: isDark ? "#FFF" : "#0F172A", fontSize: "1rem", outline: "none", fontFamily: "inherit" }} />
                  <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: isDark ? "#94a3b8" : "#64748b", cursor: "pointer", padding: "4px" }}>
                    {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>



              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <button type="submit" style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "#FFF", border: "none", borderRadius: "12px", fontWeight: "800", fontSize: "1.02rem", cursor: "pointer", boxShadow: "0 4px 16px rgba(59,130,246,0.4)", fontFamily: "inherit" }}>
                  {usuarioEditandoId ? "Atualizar Conta" : "Cadastrar Conta"}
                </button>
                <button type="button" onClick={() => setModalFormAberto(false)} style={{ padding: "14px 22px", backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0", color: isDark ? "#94a3b8" : "#475569", border: "none", borderRadius: "12px", fontWeight: "700", fontSize: "0.98rem", cursor: "pointer", fontFamily: "inherit" }}>
                  Cancelar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal: Alterar Cargo / Permissão */}
      {modalCargoUser && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
          zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px"
        }} onClick={() => setModalCargoUser(null)}>
          <div style={{
            backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
            border: `1.5px solid ${isDark ? "rgba(245,158,11,0.4)" : "#CBD5E1"}`,
            borderRadius: "24px", width: "100%", maxWidth: "480px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)", overflow: "hidden",
            animation: "scaleUp 0.2s ease-out"
          }} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div style={{
              padding: "20px 24px",
              background: "linear-gradient(135deg, #F59E0B, #D97706)",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "42px", height: "42px", borderRadius: "12px",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <ShieldCheck size={24} color="#FFF" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "800", margin: 0, color: "#FFF" }}>
                    Alterar Cargo / Permissão
                  </h3>
                  <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.9)" }}>
                    Membro: <strong style={{ color: "#FFF" }}>{modalCargoUser.nome}</strong>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModalCargoUser(null)}
                style={{ background: "transparent", border: "none", color: "#FFF", cursor: "pointer", padding: "6px" }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Options */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ fontSize: "0.85rem", color: isDark ? "#94a3b8" : "#64748b", margin: "0 0 4px 0" }}>
                Escolha o novo nível de acesso de <strong>{modalCargoUser.nome}</strong> no sistema:
              </p>

              {[
                { key: "usuario", label: "🎓 Estudante", desc: "Acesso padrão aos módulos de estudo, provas e caderno.", cor: "#3B82F6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)" },
                { key: "admin", label: "🛡️ Admin / Gestor", desc: "Gerencia turmas, notas, suporte e relatórios da base.", cor: "#A855F7", bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.3)" }
              ].map(opt => {
                const isSelected = (modalCargoUser.cargo || "usuario") === opt.key;
                return (
                  <div
                    key={opt.key}
                    onClick={() => {
                      handleAlterarCargoUsuario(modalCargoUser.id, opt.key, modalCargoUser.nome);
                      setModalCargoUser(null);
                    }}
                    style={{
                      padding: "14px 16px", borderRadius: "14px", cursor: "pointer",
                      backgroundColor: isSelected ? opt.bg : (isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC"),
                      border: `1.5px solid ${isSelected ? opt.cor : (isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0")}`,
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      transition: "all 0.2s"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.95rem", fontWeight: "800", color: opt.cor }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: isDark ? "#94a3b8" : "#64748b", marginTop: "2px" }}>
                        {opt.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <span style={{ fontSize: "0.72rem", fontWeight: "800", padding: "4px 9px", borderRadius: "6px", backgroundColor: opt.cor, color: "#FFF" }}>
                        Atual
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* Modal: Cadastrar & Gerenciar Questões da Prova */}
      {modalQuestoesProva && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)",
          zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px"
        }} onClick={() => setModalQuestoesProva(null)}>
          <div style={{
            backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
            border: `1.5px solid ${isDark ? "rgba(139,92,246,0.4)" : "#CBD5E1"}`,
            borderRadius: "24px", width: "100%", maxWidth: "780px", maxHeight: "90vh",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column",
            overflow: "hidden", animation: "scaleUp 0.2s ease-out"
          }} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div style={{
              padding: "20px 24px",
              background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "42px", height: "42px", borderRadius: "12px",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <HelpCircle size={24} color="#FFF" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "800", margin: 0, color: "#FFF" }}>
                    Cadastrar & Gerenciar Questões
                  </h3>
                  <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.9)" }}>
                    {modalQuestoesProva.titulo} • <strong style={{ color: "#FFF" }}>{modalQuestoesProva.materia}</strong> ({modalQuestoesProva.tipo})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModalQuestoesProva(null)}
                style={{ background: "transparent", border: "none", color: "#FFF", cursor: "pointer", padding: "6px" }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* Mensagem de Feedback Interna do Modal (Sucesso ou Erro) */}
              {modalMsg && (
                <div style={{
                  padding: "12px 16px", borderRadius: "12px", fontSize: "0.88rem", fontWeight: "700",
                  backgroundColor: modalMsg.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                  border: `1.5px solid ${modalMsg.type === "success" ? "#10b981" : "#ef4444"}`,
                  color: modalMsg.type === "success" ? "#10b981" : "#ef4444",
                  display: "flex", alignItems: "center", gap: "10px",
                  boxShadow: modalMsg.type === "success" ? "0 4px 14px rgba(16,185,129,0.2)" : "0 4px 14px rgba(239,68,68,0.2)",
                  animation: "fadeIn 0.25s ease-out"
                }}>
                  {modalMsg.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                  <span>{modalMsg.text}</span>
                </div>
              )}

              {/* Formulário para Nova Questão */}
              <div style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F1F5F9",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`,
                borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "14px"
              }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: "800", margin: 0, color: isDark ? "#A855F7" : "#7C3AED", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Plus size={16} /> Adicionar Nova Questão
                </h4>

                <FormInput
                  isDark={isDark}
                  label="Enunciado / Pergunta da Questão"
                  as="textarea"
                  value={novaQEnunciado}
                  onChange={e => { setNovaQEnunciado(e.target.value); if (modalMsg) setModalMsg(null); }}
                  placeholder="Ex: Qual o resultado da execução de typeof NaN em JavaScript?"
                />

                {/* Se for Múltipla Escolha ou Quiz Rápido */}
                {(modalQuestoesProva.tipo.includes("Múltipla") || modalQuestoesProva.tipo.includes("Quiz")) && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <FormInput isDark={isDark} label="Opção A" value={novaQOptA} onChange={e => { setNovaQOptA(e.target.value); if (modalMsg) setModalMsg(null); }} placeholder="Ex: 'number'" />
                      <FormInput isDark={isDark} label="Opção B" value={novaQOptB} onChange={e => { setNovaQOptB(e.target.value); if (modalMsg) setModalMsg(null); }} placeholder="Ex: 'NaN'" />
                      <FormInput isDark={isDark} label="Opção C" value={novaQOptC} onChange={e => { setNovaQOptC(e.target.value); if (modalMsg) setModalMsg(null); }} placeholder="Ex: 'undefined'" />
                      <FormInput isDark={isDark} label="Opção D" value={novaQOptD} onChange={e => { setNovaQOptD(e.target.value); if (modalMsg) setModalMsg(null); }} placeholder="Ex: 'object'" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <FormInput isDark={isDark} label="Gabarito (Alternativa Correta)" as="select" value={novaQGabaritoOpt} onChange={e => setNovaQGabaritoOpt(e.target.value)}>
                        <option value="A">Alternativa A</option>
                        <option value="B">Alternativa B</option>
                        <option value="C">Alternativa C</option>
                        <option value="D">Alternativa D</option>
                      </FormInput>
                      <FormInput isDark={isDark} label="Explicação / Feedback Automático" value={novaQExplicacao} onChange={e => setNovaQExplicacao(e.target.value)} placeholder="Ex: Em JS, NaN é do tipo 'number'." />
                    </div>
                  </>
                )}

                {/* Se for Desafio de Código */}
                {modalQuestoesProva.tipo.includes("Código") && (
                  <>
                    <FormInput isDark={isDark} label="Código Template Inicial (Boilerplate)" as="textarea" value={novaQCodigoTemplate} onChange={e => setNovaQCodigoTemplate(e.target.value)} placeholder={`function resolver(arr) {\n  // Escreva seu código aqui\n}`} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <FormInput isDark={isDark} label="Entrada do Teste Automático" value={novaQTestInput} onChange={e => setNovaQTestInput(e.target.value)} placeholder="Ex: [1, 2, 3]" />
                      <FormInput isDark={isDark} label="Saída Esperada" value={novaQTestOutput} onChange={e => setNovaQTestOutput(e.target.value)} placeholder="Ex: 6" />
                    </div>
                  </>
                )}

                {/* Se for Discursiva, Projeto ou Live Coding */}
                {(modalQuestoesProva.tipo.includes("Discursiva") || modalQuestoesProva.tipo.includes("Projeto") || modalQuestoesProva.tipo.includes("Live")) && (
                  <FormInput isDark={isDark} label="Critérios de Avaliação & Palavras-Chave (Para Dev IA & Professor)" as="textarea" value={novaQCriterios} onChange={e => setNovaQCriterios(e.target.value)} placeholder="Ex: O aluno deve explicar escopo de bloco, elevação (hoisting) e imutabilidade de referência." />
                )}

                <PrimaryButton
                  gradient="linear-gradient(135deg, #8B5CF6, #6D28D9)"
                  onClick={() => {
                    // Validação do enunciado
                    if (!novaQEnunciado.trim()) {
                      setModalMsg({ text: "⚠️ Não foi possível criar a questão: preencha o enunciado!", type: "error" });
                      return;
                    }

                    // Validação de alternativas se for Múltipla Escolha ou Quiz
                    if (modalQuestoesProva.tipo.includes("Múltipla") || modalQuestoesProva.tipo.includes("Quiz")) {
                      if (!novaQOptA.trim() || !novaQOptB.trim()) {
                        setModalMsg({ text: "⚠️ Não foi possível criar a questão: preencha pelo menos as Opções A e B!", type: "error" });
                        return;
                      }
                    }
                    
                    const novaQ = {
                      id: Date.now(),
                      enunciado: novaQEnunciado,
                      opcoes: modalQuestoesProva.tipo.includes("Múltipla") || modalQuestoesProva.tipo.includes("Quiz") ? [
                        `A) ${novaQOptA}`, `B) ${novaQOptB}`, `C) ${novaQOptC}`, `D) ${novaQOptD}`
                      ] : [],
                      gabarito: novaQGabaritoOpt,
                      explicacao: novaQExplicacao,
                      template: novaQCodigoTemplate,
                      testInput: novaQTestInput,
                      testOutput: novaQTestOutput,
                      criterios: novaQCriterios
                    };

                    const questoesAtuais = modalQuestoesProva.questoes || [];
                    const novasQuestoes = [...questoesAtuais, novaQ];
                    
                    setProvas(prev => prev.map(p => p.id === modalQuestoesProva.id ? { ...p, questoes: novasQuestoes } : p));
                    setModalQuestoesProva(prev => ({ ...prev, questoes: novasQuestoes }));
                    
                    setNovaQEnunciado(""); setNovaQOptA(""); setNovaQOptB(""); setNovaQOptC(""); setNovaQOptD("");
                    setNovaQExplicacao(""); setNovaQCodigoTemplate(""); setNovaQTestInput(""); setNovaQTestOutput(""); setNovaQCriterios("");
                    setModalMsg({ text: "✅ Questão criada e adicionada à prova com sucesso!", type: "success" });
                  }}
                >
                  <Plus size={16} /> Adicionar Questão à Prova
                </PrimaryButton>
              </div>

              {/* Lista de Questões Já Cadastradas */}
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>📋 Questões Cadastradas</span>
                  <span style={{ fontSize: "0.8rem", color: "#8B5CF6", backgroundColor: "rgba(139,92,246,0.15)", padding: "4px 10px", borderRadius: "999px" }}>
                    Total: {(modalQuestoesProva.questoes || []).length} Questões
                  </span>
                </h4>

                {(!modalQuestoesProva.questoes || modalQuestoesProva.questoes.length === 0) ? (
                  <div style={{ textAlign: "center", padding: "30px", color: isDark ? "#64748b" : "#94a3b8", fontSize: "0.88rem" }}>
                    Nenhuma questão cadastrada para esta prova ainda. Preencha o formulário acima para adicionar!
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {modalQuestoesProva.questoes.map((q, idx) => (
                      <div key={q.id} style={{
                        padding: "14px 16px", backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC",
                        borderRadius: "14px", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0"}`,
                        display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px"
                      }}>
                        <div>
                          <div style={{ fontSize: "0.86rem", fontWeight: "800", color: isDark ? "#38BDF8" : "#0284C7" }}>
                            Questão #{idx + 1}
                          </div>
                          <div style={{ fontSize: "0.9rem", fontWeight: "700", color: isDark ? "#FFF" : "#0F172A", marginTop: "2px" }}>
                            {q.enunciado}
                          </div>
                          {q.opcoes && q.opcoes.length > 0 && (
                            <div style={{ fontSize: "0.78rem", color: isDark ? "#94a3b8" : "#64748b", marginTop: "6px" }}>
                              Gabarito: <strong style={{ color: "#10B981" }}>Alternativa {q.gabarito}</strong>
                            </div>
                          )}
                          {q.testInput && (
                            <div style={{ fontSize: "0.78rem", color: isDark ? "#94a3b8" : "#64748b", marginTop: "6px" }}>
                              Teste: <code>Input: {q.testInput}</code> → <code>Output: {q.testOutput}</code>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            const novasQ = modalQuestoesProva.questoes.filter(x => x.id !== q.id);
                            setProvas(prev => prev.map(p => p.id === modalQuestoesProva.id ? { ...p, questoes: novasQ } : p));
                            setModalQuestoesProva(prev => ({ ...prev, questoes: novasQ }));
                            setModalMsg({ text: "🗑️ Questão removida da prova.", type: "error" });
                          }}
                          style={{ background: "rgba(239,68,68,0.12)", border: "none", color: "#EF4444", padding: "6px", borderRadius: "8px", cursor: "pointer", flexShrink: 0 }}
                          title="Remover Questão"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`, display: "flex", justifyContent: "flex-end" }}>
              <PrimaryButton onClick={() => setModalQuestoesProva(null)}>
                Concluir & Salvar Questões
              </PrimaryButton>
            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          MODAL — ESTATÍSTICAS DETALHADAS DE KPI
      ══════════════════════════════════════════════════ */}
      {modalEstatisticaKpi && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.82)", backdropFilter: "blur(12px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: "20px"
        }} onClick={() => setModalEstatisticaKpi(null)}>
          <div style={{
            backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
            border: `1.5px solid ${
              modalEstatisticaKpi === "alunos" ? "rgba(168,85,247,0.5)" :
              modalEstatisticaKpi === "bases" ? "rgba(59,130,246,0.5)" :
              modalEstatisticaKpi === "provas" ? "rgba(16,185,129,0.5)" : "rgba(245,158,11,0.5)"
            }`,
            borderRadius: "24px",
            boxShadow: `0 20px 60px ${
              modalEstatisticaKpi === "alunos" ? "rgba(168,85,247,0.25)" :
              modalEstatisticaKpi === "bases" ? "rgba(59,130,246,0.25)" :
              modalEstatisticaKpi === "provas" ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.25)"
            }`,
            width: "100%", maxWidth: "720px", maxHeight: "88vh", overflowY: "auto",
            animation: "fadeIn 0.25s ease-out"
          }} onClick={(e) => e.stopPropagation()}>

            {/* Cabeçalho do Modal */}
            <div style={{
              padding: "24px 28px",
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: isDark
                ? (modalEstatisticaKpi === "alunos" ? "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(15,23,42,0.6))" :
                   modalEstatisticaKpi === "bases" ? "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(15,23,42,0.6))" :
                   modalEstatisticaKpi === "provas" ? "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(15,23,42,0.6))" :
                   "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(15,23,42,0.6))")
                : "#F8FAFC"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "16px",
                  background: modalEstatisticaKpi === "alunos" ? "linear-gradient(135deg, #a855f7, #7c3aed)" :
                             modalEstatisticaKpi === "bases" ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" :
                             modalEstatisticaKpi === "provas" ? "linear-gradient(135deg, #10b981, #059669)" :
                             "linear-gradient(135deg, #f59e0b, #d97706)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.3)"
                }}>
                  {modalEstatisticaKpi === "alunos" && <Users size={24} color="#FFF" />}
                  {modalEstatisticaKpi === "bases" && <Building2 size={24} color="#FFF" />}
                  {modalEstatisticaKpi === "provas" && <ClipboardList size={24} color="#FFF" />}
                  {modalEstatisticaKpi === "suporte" && <LifeBuoy size={24} color="#FFF" />}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "900", margin: 0, color: isDark ? "#FFF" : "#0F172A" }}>
                    {modalEstatisticaKpi === "alunos" && "📊 Estatísticas Detalhadas: Alunos & Engajamento"}
                    {modalEstatisticaKpi === "bases" && "🏢 Estatísticas Detalhadas: Bases & Formações"}
                    {modalEstatisticaKpi === "provas" && "📝 Estatísticas Detalhadas: Provas & Avaliações"}
                    {modalEstatisticaKpi === "suporte" && "🎧 Estatísticas Detalhadas: Suporte & Atendimento"}
                  </h3>
                  <span style={{ fontSize: "0.82rem", color: isDark ? "#94a3b8" : "#64748b" }}>
                    {modalEstatisticaKpi === "alunos" && "Métricas consolidadas de estudantes cadastrados, cargos e acessos"}
                    {modalEstatisticaKpi === "bases" && "Visão geral de trilhas ativas, módulos liberados e presença dos alunos"}
                    {modalEstatisticaKpi === "provas" && "Métricas de rendimento da turma, notas médias e exames aplicados"}
                    {modalEstatisticaKpi === "suporte" && "Indicadores de SLA, velocidade de resposta e satisfação dos alunos"}
                  </span>
                </div>
              </div>
              <button onClick={() => setModalEstatisticaKpi(null)} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: isDark ? "#FFF" : "#0F172A", padding: "8px", borderRadius: "10px", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "22px" }}>

              {/* ── CONTEÚDO PARA ALUNOS ── */}
              {modalEstatisticaKpi === "alunos" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                    <div style={{ backgroundColor: isDark ? "rgba(168,85,247,0.1)" : "#F1F5F9", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "14px", padding: "14px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.78rem", color: isDark ? "#cbd5e1" : "#64748b", fontWeight: "700" }}>Total Registrados</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#a855f7", marginTop: "2px" }}>{usuarios.length > 0 ? usuarios.length : 11} Alunos</div>
                    </div>
                    <div style={{ backgroundColor: isDark ? "rgba(16,185,129,0.1)" : "#F1F5F9", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "14px", padding: "14px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.78rem", color: isDark ? "#cbd5e1" : "#64748b", fontWeight: "700" }}>Crescimento Mensal</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#10B981", marginTop: "2px" }}>+14.2%</div>
                    </div>
                    <div style={{ backgroundColor: isDark ? "rgba(59,130,246,0.1)" : "#F1F5F9", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "14px", padding: "14px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.78rem", color: isDark ? "#cbd5e1" : "#64748b", fontWeight: "700" }}>Retenção Semanal</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#3B82F6", marginTop: "2px" }}>92.5%</div>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "0.92rem", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A", marginBottom: "10px" }}>
                      🎭 Distribuição por Nível de Acesso
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: "700", marginBottom: "4px", color: isDark ? "#cbd5e1" : "#334155" }}>
                          <span>🎓 Estudantes ({usuarios.filter(u => u.cargo === "usuario" || !u.cargo).length || 9})</span>
                          <span>82%</span>
                        </div>
                        <div style={{ height: "8px", width: "100%", backgroundColor: isDark ? "#1E293B" : "#E2E8F0", borderRadius: "999px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: "82%", background: "linear-gradient(90deg, #a855f7, #7c3aed)", borderRadius: "999px" }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: "700", marginBottom: "4px", color: isDark ? "#cbd5e1" : "#334155" }}>
                          <span>🛡️ Administradores ({usuarios.filter(u => u.cargo === "admin").length || 1})</span>
                          <span>12%</span>
                        </div>
                        <div style={{ height: "8px", width: "100%", backgroundColor: isDark ? "#1E293B" : "#E2E8F0", borderRadius: "999px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: "12%", background: "linear-gradient(90deg, #3b82f6, #1d4ed8)", borderRadius: "999px" }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: "700", marginBottom: "4px", color: isDark ? "#cbd5e1" : "#334155" }}>
                          <span>👑 Super Admins ({usuarios.filter(u => u.cargo === "superadmin").length || 1})</span>
                          <span>6%</span>
                        </div>
                        <div style={{ height: "8px", width: "100%", backgroundColor: isDark ? "#1E293B" : "#E2E8F0", borderRadius: "999px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: "6%", background: "linear-gradient(90deg, #f59e0b, #d97706)", borderRadius: "999px" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "0.92rem", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A", marginBottom: "10px" }}>
                      👥 Usuários Recentes na Plataforma
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
                      {(usuarios.length > 0 ? usuarios : [
                        { id: 1, nome: "Enzo Vieira", email: "enzo@devhub.com", cargo: "superadmin" },
                        { id: 2, nome: "Lucas Mendes", email: "lucas@devhub.com", cargo: "admin" },
                        { id: 3, nome: "Amanda Rocha", email: "amanda@devhub.com", cargo: "usuario" },
                        { id: 4, nome: "Carlos Eduardo", email: "carlos@devhub.com", cargo: "usuario" }
                      ]).map(u => (
                        <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: "12px", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0"}` }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                              width: "32px", height: "32px", borderRadius: "50%",
                              background: "linear-gradient(135deg, #0284c7, #0369a1)",
                              border: "1px solid rgba(56,189,248,0.4)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontWeight: "800", color: "#FFFFFF", fontSize: "0.78rem", flexShrink: 0,
                              overflow: "hidden"
                            }}>
                              {getUserCustomPhoto(u) ? (
                                <img src={getUserCustomPhoto(u)} alt={u.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                getInitials(u.nome)
                              )}
                            </div>
                            <div>
                              <div style={{ fontSize: "0.85rem", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A" }}>{u.nome}</div>
                              <div style={{ fontSize: "0.74rem", color: isDark ? "#94a3b8" : "#64748b" }}>{u.email}</div>
                            </div>
                          </div>
                          <span style={{ fontSize: "0.72rem", fontWeight: "800", padding: "4px 8px", borderRadius: "6px", backgroundColor: u.cargo === "superadmin" ? "rgba(245,158,11,0.15)" : u.cargo === "admin" ? "rgba(59,130,246,0.15)" : "rgba(168,85,247,0.15)", color: u.cargo === "superadmin" ? "#F59E0B" : u.cargo === "admin" ? "#3B82F6" : "#a855f7" }}>
                            {u.cargo === "superadmin" ? "Super Admin 👑" : u.cargo === "admin" ? "Admin 🛡️" : "Estudante 🎓"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── CONTEÚDO PARA BASES ── */}
              {modalEstatisticaKpi === "bases" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                    <div style={{ backgroundColor: isDark ? "rgba(59,130,246,0.1)" : "#F1F5F9", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "14px", padding: "14px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.78rem", color: isDark ? "#cbd5e1" : "#64748b", fontWeight: "700" }}>Formações Ativas</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#3B82F6", marginTop: "2px" }}>3 Trilhas</div>
                    </div>
                    <div style={{ backgroundColor: isDark ? "rgba(168,85,247,0.1)" : "#F1F5F9", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "14px", padding: "14px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.78rem", color: isDark ? "#cbd5e1" : "#64748b", fontWeight: "700" }}>Módulos Liberados</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#a855f7", marginTop: "2px" }}>24 Módulos</div>
                    </div>
                    <div style={{ backgroundColor: isDark ? "rgba(16,185,129,0.1)" : "#F1F5F9", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "14px", padding: "14px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.78rem", color: isDark ? "#cbd5e1" : "#64748b", fontWeight: "700" }}>Conclusão Trilha</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#10B981", marginTop: "2px" }}>78.4%</div>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "0.92rem", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A", marginBottom: "12px" }}>
                      🏢 Detalhamento por Formação Acadêmica
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ padding: "14px 16px", backgroundColor: isDark ? "rgba(139,92,246,0.1)" : "#F8FAFC", borderRadius: "14px", border: "1px solid rgba(139,92,246,0.3)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#a855f7" }}>🚀 DevHub — Formação Central Fullstack</span>
                          <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#10B981", backgroundColor: "rgba(16,185,129,0.15)", padding: "3px 8px", borderRadius: "6px" }}>100% dos Alunos</span>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: isDark ? "#94a3b8" : "#64748b", marginTop: "4px" }}>
                          12 Módulos • JavaScript, React, Node.js & Bancos de Dados • 84% Aprovados
                        </div>
                      </div>

                      <div style={{ padding: "14px 16px", backgroundColor: isDark ? "rgba(59,130,246,0.1)" : "#F8FAFC", borderRadius: "14px", border: "1px solid rgba(59,130,246,0.3)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#3B82F6" }}>🏦 ContabHub — Inteligência Contábil</span>
                          <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#3B82F6", backgroundColor: "rgba(59,130,246,0.15)", padding: "3px 8px", borderRadius: "6px" }}>85% dos Alunos</span>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: isDark ? "#94a3b8" : "#64748b", marginTop: "4px" }}>
                          7 Módulos • Legislação Fiscal, Balanços & Análise de Custos • 79% Aprovados
                        </div>
                      </div>

                      <div style={{ padding: "14px 16px", backgroundColor: isDark ? "rgba(16,185,129,0.1)" : "#F8FAFC", borderRadius: "14px", border: "1px solid rgba(16,185,129,0.3)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#10B981" }}>⚡ CF Smart — Automação & Finanças</span>
                          <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#10B981", backgroundColor: "rgba(16,185,129,0.15)", padding: "3px 8px", borderRadius: "6px" }}>64% dos Alunos</span>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: isDark ? "#94a3b8" : "#64748b", marginTop: "4px" }}>
                          5 Módulos • Python para Finanças, Automação fiscal & Dashboard • 72% Aprovados
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── CONTEÚDO PARA PROVAS ── */}
              {modalEstatisticaKpi === "provas" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                    <div style={{ backgroundColor: isDark ? "rgba(16,185,129,0.1)" : "#F1F5F9", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "14px", padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.72rem", color: isDark ? "#cbd5e1" : "#64748b", fontWeight: "700" }}>Total Provas</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "900", color: "#10B981", marginTop: "2px" }}>{provas.length}</div>
                    </div>
                    <div style={{ backgroundColor: isDark ? "rgba(59,130,246,0.1)" : "#F1F5F9", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "14px", padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.72rem", color: isDark ? "#cbd5e1" : "#64748b", fontWeight: "700" }}>Provas Ativas</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "900", color: "#3B82F6", marginTop: "2px" }}>{provas.filter(p => p.ativa).length}</div>
                    </div>
                    <div style={{ backgroundColor: isDark ? "rgba(168,85,247,0.1)" : "#F1F5F9", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "14px", padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.72rem", color: isDark ? "#cbd5e1" : "#64748b", fontWeight: "700" }}>Taxa Conclusão</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "900", color: "#a855f7", marginTop: "2px" }}>89.0%</div>
                    </div>
                    <div style={{ backgroundColor: isDark ? "rgba(245,158,11,0.1)" : "#F1F5F9", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "14px", padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.72rem", color: isDark ? "#cbd5e1" : "#64748b", fontWeight: "700" }}>Média da Turma</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "900", color: "#F59E0B", marginTop: "2px" }}>8.4 / 10</div>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "0.92rem", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A", marginBottom: "10px" }}>
                      📝 Rendimento Detalhado por Prova
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "240px", overflowY: "auto" }}>
                      {provas.map(p => (
                        <div key={p.id} style={{ padding: "12px 16px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: "12px", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: "0.88rem", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A" }}>{p.titulo}</div>
                            <div style={{ fontSize: "0.76rem", color: isDark ? "#94a3b8" : "#64748b", marginTop: "2px" }}>
                              📚 {p.materia} • {p.questoes?.length || 0} questões • Prazo: {p.prazo}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span style={{ fontSize: "0.72rem", fontWeight: "800", padding: "4px 8px", borderRadius: "6px", backgroundColor: p.ativa ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: p.ativa ? "#10B981" : "#EF4444" }}>
                              {p.ativa ? "Ativa 🟢" : "Pausada 🔴"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── CONTEÚDO PARA SUPORTE ── */}
              {modalEstatisticaKpi === "suporte" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                    <div style={{ backgroundColor: isDark ? "rgba(245,158,11,0.1)" : "#F1F5F9", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "14px", padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.72rem", color: isDark ? "#cbd5e1" : "#64748b", fontWeight: "700" }}>Resolvidos</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "900", color: "#F59E0B", marginTop: "2px" }}>98%</div>
                    </div>
                    <div style={{ backgroundColor: isDark ? "rgba(16,185,129,0.1)" : "#F1F5F9", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "14px", padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.72rem", color: isDark ? "#cbd5e1" : "#64748b", fontWeight: "700" }}>SLA Médio</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "900", color: "#10B981", marginTop: "2px" }}>42 min</div>
                    </div>
                    <div style={{ backgroundColor: isDark ? "rgba(59,130,246,0.1)" : "#F1F5F9", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "14px", padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.72rem", color: isDark ? "#cbd5e1" : "#64748b", fontWeight: "700" }}>Fechados/Sem.</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "900", color: "#3B82F6", marginTop: "2px" }}>142</div>
                    </div>
                    <div style={{ backgroundColor: isDark ? "rgba(168,85,247,0.1)" : "#F1F5F9", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "14px", padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.72rem", color: isDark ? "#cbd5e1" : "#64748b", fontWeight: "700" }}>CSAT Média</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "900", color: "#a855f7", marginTop: "2px" }}>4.9 ⭐</div>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "0.92rem", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A", marginBottom: "10px" }}>
                      🎧 Categoria de Dúvidas Atendidas
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: "700", marginBottom: "4px", color: isDark ? "#cbd5e1" : "#334155" }}>
                          <span>💻 Exercícios & Dúvidas de Código</span>
                          <span>45% (64 chamados)</span>
                        </div>
                        <div style={{ height: "8px", width: "100%", backgroundColor: isDark ? "#1E293B" : "#E2E8F0", borderRadius: "999px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: "45%", background: "linear-gradient(90deg, #f59e0b, #d97706)", borderRadius: "999px" }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: "700", marginBottom: "4px", color: isDark ? "#cbd5e1" : "#334155" }}>
                          <span>🐛 Relatos de Bugs & Plataforma</span>
                          <span>30% (42 chamados)</span>
                        </div>
                        <div style={{ height: "8px", width: "100%", backgroundColor: isDark ? "#1E293B" : "#E2E8F0", borderRadius: "999px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: "30%", background: "linear-gradient(90deg, #10b981, #059669)", borderRadius: "999px" }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: "700", marginBottom: "4px", color: isDark ? "#cbd5e1" : "#334155" }}>
                          <span>🔑 Login, Acesso & Certificados</span>
                          <span>25% (36 chamados)</span>
                        </div>
                        <div style={{ height: "8px", width: "100%", backgroundColor: isDark ? "#1E293B" : "#E2E8F0", borderRadius: "999px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: "25%", background: "linear-gradient(90deg, #3b82f6, #1d4ed8)", borderRadius: "999px" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>

          </div>
        </div>
      )}
      </div>
    </div>
  </div>
);
}
