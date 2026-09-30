import { useState, useEffect, useMemo } from "react";
import DevHubLogo from "./Logo";
import {
  BookOpen, Code, Sparkles, BookMarked, Compass, Trophy, Zap,
  Layers, Calendar, CheckSquare, Shield, LifeBuoy, Settings, Bell,
  Crown, Search, ChevronRight, User, Flame, Coins,
  Grid, ListFilter, ArrowRight, Info, X, ChevronDown, Check,
  Building2, Users, Building, Plus, Award, CheckCircle2, MoreVertical
} from "lucide-react";
import styles from "./ModuleHubLauncher.module.css";

export default function ModuleHubLauncher({
  user,
  onSelectAba,
  onOpenPerfil,
  onOpenTickets,
  onOpenDevIa,
  onOpenNotificacoes
}) {
  // Estado Dinâmico Real de Gamificação do Usuário
  const [gamificacao, setGamificacao] = useState({
    xpTotal: 0,
    nivel: 1,
    xpAtualNoNivel: 0,
    xpMaxNivel: 1000,
    pctNivel: 0,
    streakDias: 0,
    streakAtivoHoje: false
  });

  // Helper para semana/ano atual
  const getSemanaAnoObj = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDays = (now - startOfYear) / 86400000;
    const semNum = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
    return { ano: now.getFullYear(), semana: semNum, semId: `${now.getFullYear()}_W${semNum}` };
  };

  useEffect(() => {
    const calcularGamificacaoReal = () => {
      if (typeof window === "undefined") return;

      const hojeStr = new Date().toLocaleDateString("pt-BR");
      let xpAcumulado = 0;
      let fezAtividadeHoje = false;
      let diasSequenciais = 0;

      const userEmailKey = user?.email ? user.email.toLowerCase().replace(/[^a-z0-9]/g, "_") : "aluno_default";
      const semInfo = getSemanaAnoObj();
      const keyEstudouSemana = `devhub_chama_semanal_${userEmailKey}_${semInfo.semId}`;
      const keyStreakSemanal = `devhub_weekly_streak_${userEmailKey}`;

      const estudouNaSemana = localStorage.getItem(keyEstudouSemana) === "true";
      const streakSemanalVal = parseInt(localStorage.getItem(keyStreakSemanal) || "0");

      if (estudouNaSemana) {
        fezAtividadeHoje = true;
        diasSequenciais = streakSemanalVal > 0 ? streakSemanalVal : 1;
      }

      // 1. Somar XP de Provas Concluídas pelo Aluno
      try {
        const rawProvas = localStorage.getItem("devhub_provas_concluidas") || localStorage.getItem("devhub_notas_provas");
        if (rawProvas) {
          const list = JSON.parse(rawProvas);
          if (Array.isArray(list)) {
            list.forEach(p => {
              const notaVal = p.nota !== undefined ? parseFloat(p.nota) : 7.5;
              xpAcumulado += Math.round(notaVal * 25);
              const dataReg = p.dataRealizacao || p.dataConclusao;
              if (dataReg === hojeStr) fezAtividadeHoje = true;
            });
          }
        }
      } catch (e) {}

      // 2. Somar XP de Duelos 1v1
      try {
        const rawDuelos = localStorage.getItem("devhub_duelos_historico");
        if (rawDuelos) {
          const list = JSON.parse(rawDuelos);
          if (Array.isArray(list)) {
            list.forEach(d => {
              xpAcumulado += (d.resultado === 'vitoria' ? 250 : 100);
              if (d.data === hojeStr) fezAtividadeHoje = true;
            });
          }
        }
      } catch (e) {}

      // 3. Somar XP de Aulas Concluídas
      try {
        const rawAulas = localStorage.getItem("devhub_aulas_concluidas");
        if (rawAulas) {
          const list = JSON.parse(rawAulas);
          if (Array.isArray(list)) {
            xpAcumulado += list.length * 150;
            if (list.some(a => a.data === hojeStr)) fezAtividadeHoje = true;
          }
        }
      } catch (e) {}

      // 4. Checar se usuário já possui XP base no perfil
      if (user && typeof user.xp === "number" && user.xp > 0) {
        xpAcumulado = Math.max(xpAcumulado, user.xp);
      }

      // 5. Histórico de Streak (Sequência de Estudos)
      try {
        const rawStreak = localStorage.getItem("devhub_streak_info");
        if (rawStreak) {
          const info = JSON.parse(rawStreak);
          if (info.dias && info.dias > diasSequenciais) {
            diasSequenciais = info.dias;
          }
          if (info.ultimaData === hojeStr) {
            fezAtividadeHoje = true;
          }
        }
      } catch (e) {}

      if (fezAtividadeHoje && diasSequenciais === 0) {
        diasSequenciais = 1;
      }

      // Cálculo de Nível (1000 XP por nível)
      const nivelCalc = Math.floor(xpAcumulado / 1000) + 1;
      const xpAtualNoNivel = xpAcumulado % 1000;
      const xpMaxNivel = 1000;
      const pctNivel = Math.min(100, Math.round((xpAtualNoNivel / xpMaxNivel) * 100));

      setGamificacao({
        xpTotal: xpAcumulado,
        nivel: (user && user.nivel) ? user.nivel : nivelCalc,
        xpAtualNoNivel,
        xpMaxNivel,
        pctNivel,
        streakDias: diasSequenciais,
        streakAtivoHoje: fezAtividadeHoje
      });
    };

    calcularGamificacaoReal();
    window.addEventListener("devhub_estudo_realizado", calcularGamificacaoReal);
    window.addEventListener("devhub_gamificacao_update", calcularGamificacaoReal);
    window.addEventListener("storage", calcularGamificacaoReal);
    return () => {
      window.removeEventListener("devhub_estudo_realizado", calcularGamificacaoReal);
      window.removeEventListener("devhub_gamificacao_update", calcularGamificacaoReal);
      window.removeEventListener("storage", calcularGamificacaoReal);
    };
  }, [user]);

  const userCargoLower = (user?.cargo || "").toLowerCase();
  const isAdminUser = Boolean(user && (userCargoLower === "super_admin" || userCargoLower === "superadmin" || userCargoLower === "admin" || user.is_super_admin || user.is_admin || (user.email && user.email.toLowerCase().includes("superadmin"))));
  const isSuperAdminReturn = typeof window !== "undefined" ? Boolean(localStorage.getItem("superAdminReturnUser")) : false;

  const [activeTab, setActiveTab] = useState("bases"); // 'bases' | 'modulos' | 'atalhos'
  const [baseAtivaUsuario, setBaseAtivaUsuario] = useState(null); // Base selecionada pelo usuário para estudos
  const [searchTerm, setSearchTerm] = useState("");
  const [resumoModalModulo, setResumoModalModulo] = useState(null);
  const [usuarioConfigModal, setUsuarioConfigModal] = useState(null);
  const [usuarioConfigBase, setUsuarioConfigBase] = useState(null);
  const [editCargo, setEditCargo] = useState("usuario");
  const [toastMsg, setToastMsg] = useState(null);

  const handleAbrirPermissoes = (userObj, baseObj) => {
    setUsuarioConfigModal(userObj);
    setUsuarioConfigBase(baseObj);
    setEditCargo(userObj?.cargo || "usuario");
    setAlunosModalBase(null);
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSalvarPermissoes = () => {
    if (!usuarioConfigModal) return;
    const updated = usuariosBases.map(u => {
      if (String(u.id) === String(usuarioConfigModal.id)) {
        return { ...u, cargo: editCargo };
      }
      return u;
    });
    setUsuariosBases(updated);
    try {
      localStorage.setItem("devhub_usuarios_bases", JSON.stringify(updated));
    } catch (e) {}
    showToast(`Permissões de ${usuarioConfigModal.nome} atualizadas com sucesso! 🚀`);
    const baseVoltar = usuarioConfigBase;
    setUsuarioConfigModal(null);
    setUsuarioConfigBase(null);
    if (baseVoltar) {
      setAlunosModalBase(baseVoltar);
    }
  };

  const handleFecharPermissoes = () => {
    const baseVoltar = usuarioConfigBase;
    setUsuarioConfigModal(null);
    setUsuarioConfigBase(null);
    if (baseVoltar) {
      setAlunosModalBase(baseVoltar);
    }
  };

  const handleDesvincularUsuarioBase = (userId, baseNome) => {
    const updated = usuariosBases.map(u => {
      if (String(u.id) === String(userId)) {
        if (Array.isArray(u.vinculos_bases)) {
          const novov = u.vinculos_bases.filter(b => (b.base_nome || "").toLowerCase() !== (baseNome || "").toLowerCase());
          return { ...u, vinculos_bases: novov };
        }
        return { ...u, base_nome: u.base_nome === baseNome ? "" : u.base_nome };
      }
      return u;
    });
    setUsuariosBases(updated);
    try {
      localStorage.setItem("devhub_usuarios_bases", JSON.stringify(updated));
    } catch (e) {}
    showToast(`Aluno desvinculado da base ${baseNome || "selecionada"} com sucesso! 🗑️`);
    const baseVoltar = usuarioConfigBase;
    setUsuarioConfigModal(null);
    setUsuarioConfigBase(null);
    if (baseVoltar) {
      setAlunosModalBase(baseVoltar);
    }
  };

  // Lista de Bases (Empresas / Organizações) disponíveis com persistência no LocalStorage
  const BASES_PADRAO = [
    {
      id: "devhub",
      nome: "DevHub",
      codigo: "BASE-01",
      badge: "🚀 DevHub",
      color: "#8B5CF6",
      cor: "#8B5CF6",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
      glow: "rgba(139, 92, 246, 0.55)",
      bg: "rgba(139, 92, 246, 0.18)",
      border: "rgba(139, 92, 246, 0.4)",
      desc: "Base Principal do Sistema — Formação Central e Chefe",
      icon: "🚀"
    },
    {
      id: "contabhub",
      nome: "ContabHub",
      codigo: "BASE-02",
      badge: "🏦 ContabHub",
      color: "#3B82F6",
      cor: "#3B82F6",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      glow: "rgba(59, 130, 246, 0.55)",
      bg: "rgba(59, 130, 246, 0.18)",
      border: "rgba(59, 130, 246, 0.4)",
      desc: "Base de Inteligência e Estudos Contábeis",
      icon: "🏦"
    },
    {
      id: "cf_smart",
      nome: "CF Smart",
      codigo: "BASE-03",
      badge: "⚡ CF Smart",
      color: "#10B981",
      cor: "#10B981",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      glow: "rgba(16, 185, 129, 0.55)",
      bg: "rgba(16, 185, 129, 0.18)",
      border: "rgba(16, 185, 129, 0.4)",
      desc: "Base de Automação, Finanças e Inteligência Fiscal",
      icon: "⚡"
    },
    {
      id: "devops_cloud",
      nome: "Devops & Cloud",
      codigo: "BASE-04",
      badge: "☁️ Devops & Cloud",
      color: "#F59E0B",
      cor: "#F59E0B",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      glow: "rgba(245, 158, 11, 0.55)",
      bg: "rgba(245, 158, 11, 0.18)",
      border: "rgba(245, 158, 11, 0.4)",
      desc: "Base de Devops & Cloud e Estudos Contábeis",
      icon: "☁️"
    }
  ];

  const sanitizeListaBases = (rawList) => {
    let list = Array.isArray(rawList) && rawList.length > 0 ? [...rawList] : [...BASES_PADRAO];

    const PALETTES = [
      { color: "#8B5CF6", gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)", glow: "rgba(139, 92, 246, 0.55)", icon: "🚀" },
      { color: "#3B82F6", gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", glow: "rgba(59, 130, 246, 0.55)", icon: "🏦" },
      { color: "#10B981", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)", glow: "rgba(16, 185, 129, 0.55)", icon: "⚡" },
      { color: "#F59E0B", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", glow: "rgba(245, 158, 11, 0.55)", icon: "☁️" },
      { color: "#06B6D4", gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)", glow: "rgba(6, 182, 212, 0.55)", icon: "💻" },
      { color: "#EC4899", gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)", glow: "rgba(236, 72, 153, 0.55)", icon: "📊" }
    ];

    return list.map((item, idx) => {
      const isDevHub = item.id === "devhub" || (item.nome || "").toLowerCase() === "devhub";
      const isContab = item.id === "contabhub" || (item.nome || "").toLowerCase() === "contabhub";
      const isSmart = item.id === "cf_smart" || item.id === "cfsmart" || (item.nome || "").toLowerCase().includes("smart");
      const isDevops = item.id === "devops_cloud" || (item.nome || "").toLowerCase().includes("devops");

      const baseDefault = isDevHub ? BASES_PADRAO[0] : isContab ? BASES_PADRAO[1] : isSmart ? BASES_PADRAO[2] : isDevops ? BASES_PADRAO[3] : null;
      const pal = PALETTES[idx % PALETTES.length];

      const color = item.color || item.cor || (baseDefault ? baseDefault.color : pal.color);
      const gradient = item.gradient || (baseDefault ? baseDefault.gradient : `linear-gradient(135deg, ${color} 0%, ${color}aa 100%)`);
      const glow = item.glow || (baseDefault ? baseDefault.glow : `${color}55`);
      const icon = item.icon || (baseDefault ? baseDefault.icon : (isDevHub ? "🚀" : isContab ? "🏦" : isSmart ? "⚡" : isDevops ? "☁️" : pal.icon));
      const codigo = item.codigo || (baseDefault ? baseDefault.codigo : `BASE-0${idx + 1}`);
      const badge = item.badge || `${icon} ${item.nome}`;

      return {
        ...item,
        id: isDevHub ? "devhub" : isContab ? "contabhub" : isSmart ? "cf_smart" : isDevops ? "devops_cloud" : (item.id || `base_${idx}`),
        nome: isDevHub ? "DevHub" : isContab ? "ContabHub" : isSmart ? "CF Smart" : isDevops ? "Devops & Cloud" : item.nome,
        codigo,
        badge,
        color,
        cor: color,
        gradient,
        glow,
        bg: `${color}20`,
        border: `${color}50`,
        icon,
        logoUrl: item.logoUrl || item.logo || "",
        desc: item.desc || (baseDefault ? baseDefault.desc : "Base de organização e estudos.")
      };
    });
  };

  const [listaBases, setListaBases] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("devhub_lista_bases");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return sanitizeListaBases(parsed);
          }
        }
      } catch (e) {}
    }
    return sanitizeListaBases(BASES_PADRAO);
  });

  useEffect(() => {
    // Salva a lista limpa e atualizada no localStorage no carregamento inicial
    try {
      localStorage.setItem("devhub_lista_bases", JSON.stringify(listaBases));
    } catch (e) {}

    const handleBasesUpdated = (e) => {
      if (e && e.detail && Array.isArray(e.detail)) {
        const sanitizada = sanitizeListaBases(e.detail);
        setListaBases(sanitizada);
      } else {
        try {
          const saved = localStorage.getItem("devhub_lista_bases");
          if (saved) setListaBases(sanitizeListaBases(JSON.parse(saved)));
        } catch (err) {}
      }
    };
    window.addEventListener("devhub_bases_updated", handleBasesUpdated);
    return () => window.removeEventListener("devhub_bases_updated", handleBasesUpdated);
  }, []);

  const [filtroBaseAtiva, setFiltroBaseAtiva] = useState("todas");
  const [baseEmDestaqueId, setBaseEmDestaqueId] = useState("devhub");
  const [modoVisualizacao, setModoVisualizacao] = useState("bases"); // 'bases' | 'alunos'
  const [searchUsuario, setSearchUsuario] = useState("");
  const [novaBaseModal, setNovaBaseModal] = useState(false);
  const [novaBaseForm, setNovaBaseForm] = useState({ nome: "", desc: "", icon: "🚀", color: "#A855F7" });

  // Modal para Vincular Aluno a uma Base com Cargo e Estudos Específicos
  const [vincularModalBase, setVincularModalBase] = useState(null);

  // Modal e Estado para Alteração da Foto / Emblema da Base
  const [modalFotoBase, setModalFotoBase] = useState(null);
  const [inputFotoUrl, setInputFotoUrl] = useState("");

  const handleSalvarFotoBase = () => {
    if (!modalFotoBase) return;
    const novaLista = listaBases.map(b => {
      if (b.id === modalFotoBase.id || b.nome === modalFotoBase.nome) {
        return { ...b, logoUrl: inputFotoUrl };
      }
      return b;
    });
    setListaBases(novaLista);
    try {
      localStorage.setItem("devhub_lista_bases", JSON.stringify(novaLista));
    } catch (e) {}
    window.dispatchEvent(new CustomEvent("devhub_bases_updated", { detail: novaLista }));
    showToast(`🎉 Foto da Base '${modalFotoBase.nome}' atualizada com sucesso!`);
    setModalFotoBase(null);
    setInputFotoUrl("");
  };

  // Modal e Estado para Criação da 1 Base Pessoal do Usuário (Limite: 1 Base)
  const [modalCriarBaseUsuario, setModalCriarBaseUsuario] = useState(false);
  const [formBaseUsuario, setFormBaseUsuario] = useState({ nome: "", desc: "", icon: "💻", color: "#8B5CF6" });

  const basesCriadasPeloUsuario = useMemo(() => {
    if (!user) return [];
    const uEmail = (user.email || "").toLowerCase().trim();
    const uId = String(user.id || "");
    return listaBases.filter(b => 
      (b.criadoPorEmail && b.criadoPorEmail.toLowerCase().trim() === uEmail) ||
      (b.criadoPorId && String(b.criadoPorId) === uId)
    );
  }, [listaBases, user]);

  const jaPossuiBasePessoal = basesCriadasPeloUsuario.length >= 1;

  const handleCriarBasePessoalUsuario = (e) => {
    e.preventDefault();
    if (!formBaseUsuario.nome.trim()) {
      return showToast("Por favor, informe o nome da sua base!", "error");
    }
    if (jaPossuiBasePessoal) {
      return showToast("Você já atingiu o limite de 1 base personalizada!", "error");
    }

    const slug = formBaseUsuario.nome.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const novaBase = {
      id: slug || `user_base_${Date.now()}`,
      nome: formBaseUsuario.nome.trim(),
      codigo: "BASE-PESSOAL",
      badge: `${formBaseUsuario.icon || '💻'} ${formBaseUsuario.nome.trim()}`,
      color: formBaseUsuario.color || "#8B5CF6",
      gradient: `linear-gradient(135deg, ${formBaseUsuario.color || '#8B5CF6'} 0%, #6D28D9 100%)`,
      glow: `${formBaseUsuario.color || '#8B5CF6'}45`,
      desc: formBaseUsuario.desc || "Sua base pessoal de estudos e práticas",
      icon: formBaseUsuario.icon || "💻",
      criadoPorEmail: user?.email,
      criadoPorId: user?.id,
      tipo: "pessoal_limitada"
    };

    const novaLista = [...listaBases, novaBase];
    setListaBases(novaLista);
    try {
      localStorage.setItem("devhub_lista_bases", JSON.stringify(novaLista));
    } catch (err) {}
    window.dispatchEvent(new CustomEvent("devhub_bases_updated", { detail: novaLista }));
    setBaseEmDestaqueId(novaBase.id);
    showToast(`🎉 Sua Base Personalizada '${novaBase.nome}' foi criada com sucesso!`);
    setModalCriarBaseUsuario(false);
    setFormBaseUsuario({ nome: "", desc: "", icon: "💻", color: "#8B5CF6" });
  };
  const [vincularSelectedUserId, setVincularSelectedUserId] = useState("");
  const [vincularCargo, setVincularCargo] = useState("usuario");
  const [vincularPlano, setVincularPlano] = useState("dev_start");
  const [vincularTrilha, setVincularTrilha] = useState("Contabilidade & Tech");
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  // Modal para Exibir Alunos Vinculados a uma Base
  const [alunosModalBase, setAlunosModalBase] = useState(null);
  const [modalSearchStudent, setModalSearchStudent] = useState("");

  // Lista de Usuários das Bases
  const [usuariosBases, setUsuariosBases] = useState([]);

  // Usuário Atual e seus Vínculos de Bases
  const currentUserObj = useMemo(() => {
    if (!user) return null;
    return usuariosBases.find(u => String(u.id) === String(user.id) || (u.email && u.email.toLowerCase() === user.email.toLowerCase())) || user;
  }, [user, usuariosBases]);

  const userVinculos = useMemo(() => {
    if (!currentUserObj) return [];
    if (Array.isArray(currentUserObj.vinculos_bases) && currentUserObj.vinculos_bases.length > 0) {
      return currentUserObj.vinculos_bases;
    }
    if (currentUserObj.base_nome) {
      return [{
        base_nome: currentUserObj.base_nome,
        cargo: currentUserObj.cargo || "usuario",
        plano: currentUserObj.plano || "dev_start",
        trilha: currentUserObj.trilha || "Contabilidade & Tech"
      }];
    }
    return [];
  }, [currentUserObj]);

  const isSuperAdmin = useMemo(() => {
    if (!user) return false;
    return (
      user.cargo === "superadmin" || 
      user.cargo === "super_admin" || 
      user.role === "superadmin" || 
      user.role === "super_admin" || 
      user.tag === "superadmin" || 
      user.tag === "super_admin" || 
      (Array.isArray(user.tags) && user.tags.some(t => String(t).toLowerCase().includes("superadmin"))) ||
      user.is_super_admin === true
    );
  }, [user]);

  const isAdminOrGestor = useMemo(() => {
    if (!user) return false;
    const c = (user.cargo || user.role || user.tag || "").toLowerCase();
    return (
      isSuperAdmin ||
      c === "admin" ||
      c === "gestor" ||
      user.is_admin === true ||
      (Array.isArray(userVinculos) && userVinculos.some(v => v.cargo === "admin" || v.cargo === "gestor" || v.cargo === "superadmin"))
    );
  }, [user, isSuperAdmin, userVinculos]);

  // Filtra as bases visíveis para o usuário atual (apenas as que possui vínculo ou criou, a menos que seja SuperAdmin)
  const basesPermitidasUsuario = useMemo(() => {
    if (isSuperAdmin) return listaBases;

    const vinculosSet = new Set();

    if (user?.base_nome) vinculosSet.add(user.base_nome.toLowerCase().trim());
    if (user?.baseNome) vinculosSet.add(user.baseNome.toLowerCase().trim());
    if (user?.base) vinculosSet.add(user.base.toLowerCase().trim());

    if (Array.isArray(userVinculos)) {
      userVinculos.forEach(v => {
        const n = v.base_nome || v.baseNome || v.nome;
        if (n) vinculosSet.add(n.toLowerCase().trim());
      });
    }

    if (Array.isArray(user?.vinculos_bases)) {
      user.vinculos_bases.forEach(v => {
        const n = v.base_nome || v.baseNome || v.nome;
        if (n) vinculosSet.add(n.toLowerCase().trim());
      });
    }

    const uEmail = (user?.email || "").toLowerCase().trim();
    const uId = String(user?.id || "");

    const filtradas = listaBases.filter(b => {
      const bNome = (b.nome || "").toLowerCase().trim();
      const bId = (b.id || "").toLowerCase().trim();
      const isCriador = Boolean(
        (b.criadoPorEmail && b.criadoPorEmail.toLowerCase().trim() === uEmail) ||
        (b.criadoPorId && String(b.criadoPorId) === uId)
      );
      return bId === "devhub" || bNome === "devhub" || vinculosSet.has(bNome) || vinculosSet.has(bId) || isCriador;
    });

    return filtradas;
  }, [isSuperAdmin, listaBases, userVinculos, user]);

  useEffect(() => {
    const carregarUsuarios = () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      fetch(`${apiUrl}/auth/users`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setUsuariosBases(deduplicarUsuarios(data));
          } else {
            setUsuariosBases(getMockBases());
          }
        })
        .catch(() => setUsuariosBases(getMockBases()));
    };

    carregarUsuarios();
  }, []);

  const deduplicarUsuarios = (list) => {
    const map = new Map();
    list.forEach((u, index) => {
      const key = (u.email || u.nome || String(u.id)).toLowerCase().trim();
      if (!map.has(key)) {
        const userId = u.id || (index + 1);
        const baseAtribuida = u.base_nome || "DevHub";
        map.set(key, { ...u, id: userId, base_nome: baseAtribuida });
      }
    });
    return Array.from(map.values());
  };

  const getMockBases = () => [
    { id: 1, nome: "Enzo Vieira", email: "enzovieira.contabhub@gmail.com", cargo: "superadmin", plano: "superadmin", base_nome: "DevHub", xp: 5200, nivel: 6, provas: 15, avatar: "👑" },
    { id: 2, nome: "Nicholas Araujo", email: "nicholas.1213@gmail.com", cargo: "usuario", plano: "dev_pro", base_nome: "DevHub", xp: 4900, nivel: 5, provas: 12, avatar: "🔥" },
    { id: 3, nome: "Gabriel Brito", email: "gabrielbrito@gmail.com", cargo: "usuario", plano: "dev_master", base_nome: "DevHub", xp: 3850, nivel: 4, provas: 9, avatar: "👑" },
    { id: 4, nome: "Sandro Rosal", email: "sandrorosal@gmail.com", cargo: "usuario", plano: "dev_plus", base_nome: "DevHub", xp: 2450, nivel: 3, provas: 6, avatar: "⚡" },
    { id: 5, nome: "Breno Faislon", email: "brenofaislon@gmail.com", cargo: "usuario", plano: "dev_ultra", base_nome: "DevHub", xp: 3100, nivel: 4, provas: 8, avatar: "💎" },
    { id: 6, nome: "Bia Brasil", email: "biabrasil@gmail.com", cargo: "usuario", plano: "dev_ai", base_nome: "DevHub", xp: 1950, nivel: 2, provas: 5, avatar: "🧠" }
  ];

  const usuariosFiltradosPorBase = useMemo(() => {
    return usuariosBases.filter(u => {
      const baseMatch = filtroBaseAtiva === "todas" || (u.base_nome || "DevHub").toLowerCase() === filtroBaseAtiva.toLowerCase();
      const termLower = searchUsuario.toLowerCase().trim();
      const searchMatch = !termLower || (
        (u.nome && u.nome.toLowerCase().includes(termLower)) ||
        (u.email && u.email.toLowerCase().includes(termLower)) ||
        (u.base_nome && u.base_nome.toLowerCase().includes(termLower)) ||
        String(u.id) === termLower ||
        `#id: ${u.id}`.toLowerCase().includes(termLower) ||
        `#${u.id}`.toLowerCase().includes(termLower)
      );
      return baseMatch && searchMatch;
    });
  }, [usuariosBases, filtroBaseAtiva, searchUsuario]);

  const SCHEMES = [
    {
      planoKey: "dev_master",
      color: "#A855F7",
      gradient: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
      glow: "rgba(168, 85, 247, 0.45)",
      badge: "👑 Dev Master",
      avatar: "👑",
      xpBase: 3850, nivelBase: 4, provasBase: 9
    },
    {
      planoKey: "dev_plus",
      color: "#3B82F6",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      glow: "rgba(59, 130, 246, 0.45)",
      badge: "⚡ Dev Plus",
      avatar: "⚡",
      xpBase: 2450, nivelBase: 3, provasBase: 6
    },
    {
      planoKey: "dev_pro",
      color: "#F59E0B",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      glow: "rgba(245, 158, 11, 0.45)",
      badge: "🔥 Dev Pro",
      avatar: "🔥",
      xpBase: 4900, nivelBase: 5, provasBase: 12
    },
    {
      planoKey: "dev_ultra",
      color: "#F43F5E",
      gradient: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
      glow: "rgba(244, 63, 94, 0.45)",
      badge: "💎 Dev Ultra",
      avatar: "💎",
      xpBase: 3100, nivelBase: 4, provasBase: 8
    },
    {
      planoKey: "dev_ai",
      color: "#6366F1",
      gradient: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
      glow: "rgba(99, 102, 241, 0.45)",
      badge: "🧠 Dev AI",
      avatar: "🧠",
      xpBase: 1950, nivelBase: 2, provasBase: 5
    },
    {
      planoKey: "dev_cyber",
      color: "#06B6D4",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      glow: "rgba(6, 182, 212, 0.45)",
      badge: "💻 Dev Cyber",
      avatar: "💻",
      xpBase: 2750, nivelBase: 3, provasBase: 7
    },
    {
      planoKey: "dev_start",
      color: "#10B981",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      glow: "rgba(16, 185, 129, 0.45)",
      badge: "🌱 Dev Start",
      avatar: "🌱",
      xpBase: 1250, nivelBase: 2, provasBase: 4
    }
  ];

  const PLANOS_CARDS = {
    dev_start: SCHEMES[6],
    dev_plus: SCHEMES[1],
    dev_master: SCHEMES[0],
    dev_pro: SCHEMES[2],
    dev_ultra: SCHEMES[3],
    dev_ai: SCHEMES[4],
    dev_cyber: SCHEMES[5],
    superadmin: { label: "SUPER ADMIN", color: "#F59E0B", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", glow: "rgba(245, 158, 11, 0.45)", badge: "👑 Super Admin", avatar: "👑", xpBase: 5200, nivelBase: 6, provasBase: 15 }
  };

  const getUserCardDetails = (u, index) => {
    const userCargo = (u.cargo || "").toLowerCase();
    if (userCargo === "superadmin" || userCargo === "super_admin" || u.plano === "superadmin") {
      return {
        color: "#F59E0B",
        gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        glow: "rgba(245, 158, 11, 0.45)",
        badge: "👑 Super Admin",
        avatar: "👑",
        xp: u.xp || 5200,
        nivel: u.nivel || 6,
        provas: u.provas || 15
      };
    }

    if (u.plano && PLANOS_CARDS[u.plano]) {
      const p = PLANOS_CARDS[u.plano];
      return {
        ...p,
        avatar: u.avatar || p.avatar || "⚡",
        xp: u.xp || (index * 750 + 1200),
        nivel: u.nivel || ((index % 4) + 2),
        provas: u.provas || (index * 2 + 4)
      };
    }

    // Variar dinamicamente as cores e estatísticas por índice se não houver plano explícito no banco
    const schemeIndex = (index + (u.id || 0)) % SCHEMES.length;
    const s = SCHEMES[schemeIndex];

    return {
      color: s.color,
      gradient: s.gradient,
      glow: s.glow,
      badge: s.badge,
      avatar: u.avatar || s.avatar,
      xp: u.xp || (s.xpBase + (index * 320) % 900),
      nivel: u.nivel || (s.nivelBase + (index % 2)),
      provas: u.provas || (s.provasBase + (index % 3))
    };
  };

  const handleEntrarNaBaseDoUsuario = (usuarioBase) => {
    if (typeof window !== "undefined") {
      const currentToken = localStorage.getItem("token") || "";
      const currentUserData = localStorage.getItem("userData") || "";

      if (!localStorage.getItem("superAdminReturnUser")) {
        localStorage.setItem("superAdminReturnToken", currentToken);
        localStorage.setItem("superAdminReturnUser", currentUserData);
      }

      const targetBaseName = usuarioBase.base_nome || usuarioBase.base || "DevHub";

      const usuarioSessao = {
        id: usuarioBase.id,
        nome: usuarioBase.nome,
        email: usuarioBase.email,
        cargo: usuarioBase.cargo || "usuario",
        base_nome: targetBaseName,
        base: targetBaseName,
        vinculos_bases: usuarioBase.vinculos_bases || [],
        isImpersonated: true,
        impersonatedBy: user ? user.nome : "Super Admin"
      };

      localStorage.setItem("userData", JSON.stringify(usuarioSessao));
      localStorage.setItem("devhub_active_base", targetBaseName);
      showToast(`⚡ Entrando na Base de ${usuarioBase.nome}...`);

      setTimeout(() => {
        setActiveTab("modulos");
        window.dispatchEvent(new Event("storage"));
      }, 500);
    }
  };

  const handleVoltarCentralBases = () => {
    if (typeof window !== "undefined") {
      const returnUser = localStorage.getItem("superAdminReturnUser");
      const returnToken = localStorage.getItem("superAdminReturnToken");
      if (returnUser) localStorage.setItem("userData", returnUser);
      if (returnToken) localStorage.setItem("token", returnToken);
      localStorage.removeItem("superAdminReturnUser");
      localStorage.removeItem("superAdminReturnToken");
      setActiveTab("bases");
      window.dispatchEvent(new Event("storage"));
      showToast("👑 Retornado à Central de Bases dos Usuários!");
    }
  };

  // Lista Completa de Módulos DevHub (Cards Neons da Aba 1)
  const listModulos = useMemo(() => {
    return [
      {
        id: "aulas",
        titulo: "Aulas & Treinamentos",
        badge: "Cursos & Exercícios",
        desc: "Aulas gravadas, exercícios práticos e materiais de apoio técnico",
        resumoDetalhado: "Acesse todo o catálogo de videoaulas da plataforma organizadas por módulos e níveis de conhecimento. Inclui exercícios de fixação, código para acompanhar o professor e material de apoio em PDF.",
        icon: BookOpen,
        color: "#3b82f6",
        gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        glow: "rgba(59, 130, 246, 0.45)",
        tintBg: "rgba(59, 130, 246, 0.12)",
        tag: "MAIS ACESSADO",
        stat1: "12+ Módulos",
        stat2: "Trilha Dev"
      },
      {
        id: "playground",
        titulo: "Code Playground",
        badge: "Editor Web IDE",
        desc: "IDE online para codar em HTML, CSS, JavaScript, Python e SQL com compilação instantânea",
        resumoDetalhado: "Editor de código interativo diretamente no navegador com suporte a múltiplas linguagens. Permite executar scripts, visualizar a renderização em tempo real e testar trechos de código sem instalar nada no computador.",
        icon: Code,
        color: "#06b6d4",
        gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
        glow: "rgba(6, 182, 212, 0.45)",
        tintBg: "rgba(6, 182, 212, 0.12)",
        tag: "COMPILADOR WEB",
        stat1: "HTML, JS, Py, SQL",
        stat2: "IDE Instantânea"
      },
      {
        id: "caderno",
        titulo: "Caderno de Estudos (NotebookLM)",
        badge: "IA Contextual",
        desc: "Ambiente contextual de pesquisa com síntese de voz real, flashcards e citação de fontes",
        resumoDetalhado: "Caderno inteligente no estilo NotebookLM. Anexe PDFs, arquivos de código e anotações para conversar com a IA, gerar resumos falados em voz real (Web Speech), mapas mentais e questionários baseados estritamente nos seus documentos.",
        icon: BookMarked,
        color: "#6366f1",
        gradient: "linear-gradient(135deg, #6366f1, #4338ca)",
        glow: "rgba(99, 102, 241, 0.45)",
        tintBg: "rgba(99, 102, 241, 0.12)",
        tag: "SÍNTESE DE VOZ",
        stat1: "Leitor de PDF",
        stat2: "NotebookLM"
      },
      {
        id: "ranking",
        titulo: "Ranking & Desempenho",
        badge: "Desempenho Técnico",
        desc: "Classificação em tempo real e acompanhamento do engajamento técnico dos alunos",
        resumoDetalhado: "Tabela de liderança e acompanhamento acadêmico. Veja os alunos em destaque em constância de estudos, provas concluídas e entrega de exercícios.",
        icon: Trophy,
        color: "#2563eb",
        gradient: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        glow: "rgba(37, 99, 235, 0.45)",
        tintBg: "rgba(37, 99, 235, 0.12)",
        tag: "DESEMPENHO",
        stat1: "Provas & Exercícios",
        stat2: "Pontuação Semanal"
      },
      {
        id: "games",
        titulo: "Laboratório Prático & Mini Sistemas",
        badge: "Prática Real",
        desc: "Projetos práticos e simuladores de arquitetura e engenharia de software",
        resumoDetalhado: "Catálogo de projetos reais e minissistemas simulados (gerenciador financeiro, simulador de API, utilitários) para praticar lógica e arquitetura.",
        icon: Zap,
        color: "#a855f7",
        gradient: "linear-gradient(135deg, #a855f7, #7c3aed)",
        glow: "rgba(168, 85, 247, 0.45)",
        tintBg: "rgba(168, 85, 247, 0.12)",
        tag: "SIMULADORES",
        stat1: "6+ Minissistemas",
        stat2: "Projetos Reais"
      },
      {
        id: "evolucao",
        titulo: "Linha do Tempo de Evolução",
        badge: "Histórico & Progresso",
        desc: "Acompanhe seu progresso diário, módulos concluídos e carga horária acumulada",
        resumoDetalhado: "Histórico cronológico detalhado do seu desenvolvimento na plataforma. Registra aulas concluídas, notas obtidas em provas e marcos batidos.",
        icon: Calendar,
        color: "#8b5cf6",
        gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
        glow: "rgba(139, 92, 246, 0.45)",
        tintBg: "rgba(139, 92, 246, 0.12)",
        tag: "TRILHA DEV",
        stat1: "Gráficos de Atividade",
        stat2: "Histórico Completo"
      },
      {
        id: "provas-online",
        titulo: "Provas & Avaliações",
        badge: "Boletim & Certificados",
        desc: "Realize avaliações teóricas e práticas e acompanhe seu boletim de notas de forma integrada",
        resumoDetalhado: "Avaliações do seu nível técnico. Faça provas online com limite de tempo e consulte o relatório completo de notas obtidas nas avaliações.",
        icon: CheckSquare,
        color: "#06b6d4",
        gradient: "linear-gradient(135deg, #06b6d4, #0284c7)",
        glow: "rgba(6, 182, 212, 0.45)",
        tintBg: "rgba(6, 182, 212, 0.12)",
        tag: "AVALIAÇÕES & NOTAS",
        stat1: "Provas Diárias",
        stat2: "Histórico de Notas"
      }
    ];
  }, []);

  // Filtragem da busca de módulos
  const modulosFiltrados = listModulos.filter(m =>
    m.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lista de Atalhos e Suporte da Aba 2 (Painel de Controle SuperAdmin no topo apenas para admins)
  const listAtalhos = useMemo(() => {
    const atalhos = [];
    if (isAdminUser) {
      atalhos.push({
        id: "super_admin",
        titulo: "Painel de Controle SuperAdmin",
        badge: "ADMINISTRAÇÃO",
        desc: "Administração geral da plataforma: usuários, turmas, permissões de módulos, provas e chamados de suporte",
        icon: Shield,
        color: "#ef4444",
        gradient: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
        glow: "rgba(239, 68, 68, 0.45)",
        action: () => {
          if (typeof window !== "undefined") {
            window.location.href = "/super-admin";
          } else {
            onSelectAba("super_admin");
          }
        }
      });
    }
    atalhos.push(
      {
        id: "tickets",
        titulo: "Tickets & Suporte Técnico",
        badge: "ATENDIMENTO",
        desc: "Abra chamados, tire dúvidas técnicas com a equipe e acompanhe seus atendimentos",
        icon: LifeBuoy,
        color: "#38bdf8",
        gradient: "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",
        glow: "rgba(56, 189, 248, 0.45)",
        action: onOpenTickets
      },
      {
        id: "perfil",
        titulo: "Configurações da Conta & Perfil",
        badge: "MINHA CONTA",
        desc: "Edite seus dados pessoais, foto de perfil, preferências de tema e altere sua senha",
        icon: Settings,
        color: "#818cf8",
        gradient: "linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)",
        glow: "rgba(129, 140, 248, 0.45)",
        action: onOpenPerfil
      }
    );
    return atalhos;
  }, [isAdminUser, onOpenTickets, onOpenPerfil, onSelectAba]);

  const handleEntrarModulo = (mod) => {
    if (mod.isModal) {
      if (mod.id === "dev_ia") onOpenDevIa();
    } else {
      onSelectAba(mod.id);
    }
  };

  return (
    <div className={styles.container}>
      {/* BACKGROUND ANIMADO ULTRA LIGHTWEIGHT (GPU-ACCELERATED PURE CSS - 0 SERVER OVERHEAD) */}
      <div className={styles.bgAmbientWrapper}>
        <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
        <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
        <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />
        <div className={styles.bgGridAnimated} />
      </div>

      {/* ===================================================================
          1. CONTEÚDO CENTRAL (TÍTULO, GAMIFICAÇÃO, ABAS & BUSCA)
         =================================================================== */}
      <main className={styles.mainContent}>
        <div className={styles.headerRow} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginBottom: "20px" }}>
          {/* LINHA 1: TÍTULO DA PÁGINA */}
          <div>
            <span className={styles.workspaceTag} style={{ marginBottom: "2px" }}>ECOSSISTEMA DEVHUB</span>
            <h1 className={styles.mainTitle} style={{ margin: 0 }}>Hub de Aprendizado</h1>
          </div>

          {/* LINHA 2: BARRA DE MÉTRICAS (ESQUERDA) E SELETOR DE ABAS ALINHADOS PERFEITAMENTE NA MESMA LINHA (DIREITA) */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: "16px", marginTop: "4px" }}>
            {/* LADO ESQUERDO: BARRA DE GAMIFICAÇÃO */}
            <div className={styles.gamificationStats}>
              <div className={styles.levelBadge} title={`Nível da Formação: Nível ${gamificacao.nivel}`}>
                <Award size={15} color="#3B82F6" />
                <span>Nível {gamificacao.nivel}</span>
              </div>

              <div className={styles.xpBarBox} title={`Progresso de Formação: ${gamificacao.pctNivel}% Concluído (${gamificacao.xpTotal} Pontos)`}>
                <div className={styles.xpTextRow} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>PROGRESSO DA FORMAÇÃO</span>
                  <span style={{ color: "#38BDF8", fontWeight: "800", marginLeft: "4px" }}>{gamificacao.pctNivel}% Concluído</span>
                </div>
                <div className={styles.xpBarTrack}>
                  <div className={styles.xpBarFill} style={{ width: `${gamificacao.pctNivel}%` }} />
                </div>
              </div>

              <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.1)" }} />

              <div 
                className={gamificacao.streakAtivoHoje ? styles.streakBadgeLit : styles.streakBadgeUnlit}
                title={
                  gamificacao.streakAtivoHoje 
                    ? `Frequência Confirmada! Você realizou atividades e mantém sua presença ativa nesta semana.`
                    : "Frequência Pendente. Realize uma prova ou aula no sistema para registrar sua presença!"
                }
              >
                <CheckCircle2 
                  size={16} 
                  color={gamificacao.streakAtivoHoje ? "#10B981" : "#64748B"} 
                />
                <span>
                  {gamificacao.streakAtivoHoje 
                    ? `Frequência Ativa (${gamificacao.streakDias} ${gamificacao.streakDias === 1 ? 'Semana' : 'Semanas'})` 
                    : 'Frequência Pendente'}
                </span>
              </div>
            </div>

            {/* LADO DIREITO: SELETOR DE ABAS ALINHADO NA MESMA LINHA DAS MÉTRICAS */}
            <div className={styles.tabSwitchBox} style={{ margin: 0 }}>
              <button
                className={`${styles.tabSwitchBtn} ${activeTab === "bases" ? styles.tabSwitchBtnActive : ""}`}
                onClick={() => setActiveTab("bases")}
              >
                <Layers size={16} color="#3B82F6" /> Minhas Bases
                <span className={styles.tabBadge}>{basesPermitidasUsuario.length}</span>
              </button>

              <button
                className={`${styles.tabSwitchBtn} ${activeTab === "atalhos" ? styles.tabSwitchBtnActive : ""}`}
                onClick={() => setActiveTab("atalhos")}
              >
                <ListFilter size={16} /> Atalhos
                <span className={styles.tabBadge}>{listAtalhos.length}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Toast Notificação Rápida */}
        {toastMsg && (
          <div style={{
            position: "fixed", top: "20px", right: "20px", zIndex: 9999,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#FFF", padding: "12px 20px", borderRadius: "14px",
            fontWeight: "800", fontSize: "13px", boxShadow: "0 8px 24px rgba(16,185,129,0.4)"
          }}>
            {toastMsg}
          </div>
        )}

        {/* ===================================================================
            ABA 0: BASES DOS USUÁRIOS (ORGANIZAÇÃO POR EMPRESA/BASE)
           =================================================================== */}
        {activeTab === "bases" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
            {/* MODO 1: VISÃO DE ORGANIZAÇÕES / BASES (GRID PRINCIPAL) */}
            {/* MODO 1: VISÃO DE ORGANIZAÇÕES / BASES (HUB DE APRENDIZADO - ASYMMETRIC GRID) */}
            {modoVisualizacao === "bases" && !searchUsuario && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Bases Ativas ({basesPermitidasUsuario.length})
                  </h4>
                </div>

                {(() => {
                  const baseDestaque = (basesPermitidasUsuario && basesPermitidasUsuario.length > 0)
                    ? (basesPermitidasUsuario.find(b => b && (b.id === baseEmDestaqueId || (b.nome || "").toLowerCase() === String(baseEmDestaqueId).toLowerCase())) || basesPermitidasUsuario[0])
                    : (BASES_PADRAO[0]);

                  if (!baseDestaque) return null;

                  const outrasBases = basesPermitidasUsuario.filter(b => b && b.id !== baseDestaque.id && (b.nome || "").toLowerCase() !== (baseDestaque.nome || "").toLowerCase());

                  const isDevHubChefe = baseDestaque.id === "devhub" || (baseDestaque.nome || "").toLowerCase() === "devhub";
                  const criadoEmailDestaque = (baseDestaque.criadoPorEmail || "").toLowerCase().trim();
                  const criadoIdDestaque = String(baseDestaque.criadoPorId || "");

                  const alunosDaBaseDestaque = isDevHubChefe
                    ? usuariosBases
                    : usuariosBases.filter(u => {
                        const uBase = (u.base_nome || u.base || "").toLowerCase().trim();
                        const uEmail = (u.email || "").toLowerCase().trim();
                        const uId = String(u.id || "");
                        if (uBase === baseDestaque.id || uBase === baseDestaque.nome.toLowerCase()) return true;
                        if (criadoEmailDestaque && uEmail === criadoEmailDestaque) return true;
                        if (criadoIdDestaque && uId === criadoIdDestaque) return true;
                        if (Array.isArray(u.vinculos_bases)) {
                          return u.vinculos_bases.some(v => (v.base_nome || "").toLowerCase().trim() === baseDestaque.nome.toLowerCase());
                        }
                        return false;
                      });

                  const temCriadorDestaque = Boolean(baseDestaque.criadoPorEmail || baseDestaque.criadoPorId || baseDestaque.tipo === "pessoal_limitada");
                  const totalAlunosDestaqueCount = (temCriadorDestaque && alunosDaBaseDestaque.length === 0) ? 1 : alunosDaBaseDestaque.length;

                  const cardColor = baseDestaque.color || baseDestaque.cor || "#8B5CF6";
                  const cardGlow = baseDestaque.glow || `${cardColor}55`;
                  const cardGradient = baseDestaque.gradient || `linear-gradient(135deg, ${cardColor} 0%, ${cardColor}dd 100%)`;

                  const userEmailLower = (user?.email || "").toLowerCase().trim();
                  const userIdStr = String(user?.id || "");

                  const isBasePropriaDestaque = Boolean(
                    user && baseDestaque && (
                      ((baseDestaque.criadoPorEmail || "").toLowerCase().trim() === userEmailLower && userEmailLower !== "") ||
                      (String(baseDestaque.criadoPorId || "") === userIdStr && userIdStr !== "") ||
                      baseDestaque.tipo === "pessoal_limitada"
                    )
                  );

                  const podeMexerOuVerInfoDestaque = isAdminUser || isSuperAdminReturn || isBasePropriaDestaque;

                  return (
                    <>
                      <style>{`
                        @keyframes spinOrbitClockwise {
                          0% { transform: rotate(0deg); }
                          100% { transform: rotate(360deg); }
                        }
                        @keyframes spinOrbitCounter {
                          0% { transform: rotate(360deg); }
                          100% { transform: rotate(-360deg); }
                        }
                        @keyframes floatEmblemIcon {
                          0%, 100% { transform: translateY(0px) scale(1); }
                          50% { transform: translateY(-5px) scale(1.03); }
                        }
                        .orbit-ring-primary {
                          animation: spinOrbitClockwise 10s linear infinite;
                          transform-origin: 75px 45px;
                        }
                        .orbit-ring-secondary {
                          animation: spinOrbitCounter 16s linear infinite;
                          transform-origin: 75px 45px;
                        }
                        .floating-emblem-icon {
                          animation: floatEmblemIcon 3.5s ease-in-out infinite;
                        }
                      `}</style>
                      
                      <div style={{
                        display: "flex",
                        gap: "24px",
                        width: "100%",
                        maxWidth: "1350px",
                        marginTop: "16px",
                        alignItems: "stretch",
                        flexWrap: "wrap",
                        boxSizing: "border-box"
                      }}>
                        {/* LADO ESQUERDO: CARD DESTAQUE BASE EM DESTAQUE (HERO CARD REVERSÍVEL COM ANIMAÇÃO DE ÓRBITA) */}
                        <div
                          style={{
                            flex: "0 0 420px",
                            maxWidth: "450px",
                            minWidth: "320px",
                            width: "100%",
                            background: "linear-gradient(165deg, rgba(19, 14, 38, 0.96) 0%, rgba(8, 10, 22, 0.98) 100%)",
                            border: `1.5px solid ${cardColor}60`,
                            boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 40px ${cardGlow}`,
                            borderRadius: "26px",
                            padding: "26px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justify: "space-between",
                            gap: "16px",
                            position: "relative",
                            transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
                          }}
                        >
                          {/* Topo do Card Destaque */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <span style={{
                              color: isDevHubChefe ? "#F59E0B" : cardColor,
                              borderColor: isDevHubChefe ? "rgba(245, 158, 11, 0.5)" : `${cardColor}60`,
                              background: isDevHubChefe ? "rgba(245, 158, 11, 0.18)" : `${cardColor}18`,
                              border: `1px solid ${isDevHubChefe ? "rgba(245, 158, 11, 0.4)" : `${cardColor}40`}`,
                              padding: "4px 12px", borderRadius: "10px", fontWeight: "900", fontSize: "11px", letterSpacing: "0.5px"
                            }}>
                              {isDevHubChefe ? "👑 BASE CHEFE" : `⚡ ${baseDestaque.nome}`}
                            </span>
                            <span style={{ fontSize: "11px", fontWeight: "900", color: cardColor, background: `${cardColor}20`, padding: "4px 10px", borderRadius: "10px" }}>
                              {baseDestaque.codigo || "BASE-01"}
                            </span>
                          </div>

                          {/* Emblema Orbital 3D Cosmic Rocket com Animação Dupla da Órbita Girando */}
                          <div 
                            title={podeMexerOuVerInfoDestaque ? "Clique para alterar a foto/logo desta base" : undefined}
                            onClick={podeMexerOuVerInfoDestaque ? () => {
                              setModalFotoBase(baseDestaque);
                              setInputFotoUrl(baseDestaque.logoUrl || "");
                            } : undefined}
                            style={{
                              position: "relative", width: "150px", height: "150px",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: podeMexerOuVerInfoDestaque ? "pointer" : "default"
                            }}
                          >
                            {/* Brilho de Fundo Pulsante */}
                            <div style={{
                              position: "absolute", width: "115px", height: "115px", borderRadius: "50%",
                              background: `radial-gradient(circle, ${cardGlow} 0%, rgba(109, 40, 217, 0.15) 70%, transparent 100%)`,
                              filter: "blur(16px)"
                            }} />

                            {/* Ícone Central Flutuante */}
                            <div className="floating-emblem-icon" style={{
                              width: "92px", height: "92px", borderRadius: "50%",
                              background: cardGradient,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "42px", color: "#FFF",
                              boxShadow: `0 0 35px ${cardGlow}, inset 0 -4px 12px rgba(0,0,0,0.4)`,
                              zIndex: 4, overflow: "hidden",
                              position: "relative"
                            }}>
                              {baseDestaque.logoUrl && baseDestaque.logoUrl.trim() ? (
                                <img src={baseDestaque.logoUrl} alt={baseDestaque.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                baseDestaque.icon || "🚀"
                              )}
                            </div>

                            {/* Órbita Giratória Dupla 3D (Posicionada ATRÁS da foto para não cobrir a imagem) */}
                            <svg width="170" height="110" viewBox="0 0 150 90" style={{ position: "absolute", top: "20px", left: "-10px", pointerEvents: "none", zIndex: 1 }}>
                              <g className="orbit-ring-primary">
                                <ellipse cx="75" cy="45" rx="74" ry="28" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="6 4" style={{ opacity: 0.9, filter: "drop-shadow(0 0 8px #38BDF8)" }} />
                              </g>
                              <g className="orbit-ring-secondary">
                                <ellipse cx="75" cy="45" rx="70" ry="24" fill="none" stroke={cardColor} strokeWidth="1.8" strokeDasharray="2 6" style={{ opacity: 0.75, filter: `drop-shadow(0 0 6px ${cardColor})` }} />
                              </g>
                            </svg>
                          </div>

                          {/* Botão de Alterar Foto da Base (SuperAdmin, Admin ou Dono da Base Pessoal) */}
                          {podeMexerOuVerInfoDestaque && (
                            <button
                              type="button"
                              onClick={() => {
                                setModalFotoBase(baseDestaque);
                                setInputFotoUrl(baseDestaque.logoUrl || "");
                              }}
                              style={{
                                background: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                borderRadius: "8px",
                                padding: "4px 10px",
                                color: "#CBD5E1",
                                fontSize: "10.5px",
                                fontWeight: "800",
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                              }}
                            >
                              📷 Alterar Foto da Base
                            </button>
                          )}

                          {/* Conteúdo Central */}
                          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                            <h3 style={{ fontSize: "22px", margin: 0, fontWeight: "900", color: "#FFF", letterSpacing: "-0.02em" }}>
                              {baseDestaque.nome}
                            </h3>
                            <p style={{ margin: 0, fontSize: "12px", color: "#94A3B8", lineHeight: "1.4" }}>
                              {baseDestaque.desc || "Base de estudos e treinamentos da plataforma."}
                            </p>

                            {/* Caixa Única com Informação Exata e Real dos Alunos Vinculados (SuperAdmin, Admin ou Dono da Base Pessoal) */}
                            {/* Caixa Única com Informação Exata e Real dos Alunos Vinculados (SuperAdmin, Admin ou Dono da Base Pessoal) */}
                            {podeMexerOuVerInfoDestaque && (
                              <div style={{
                                background: "rgba(15, 23, 42, 0.8)",
                                border: `1px solid ${cardColor}40`,
                                padding: "12px",
                                borderRadius: "14px",
                                textAlign: "center",
                                marginTop: "10px",
                                width: "100%",
                                boxSizing: "border-box"
                              }}>
                                <span style={{ display: "block", fontSize: "16px", fontWeight: "900", color: cardColor }}>
                                  {totalAlunosDestaqueCount} {totalAlunosDestaqueCount === 1 ? "Aluno Vinculado" : "Alunos Vinculados"}
                                </span>
                                <span style={{ fontSize: "11px", color: "#94A3B8", fontWeight: "700" }}>Formação Ativa nesta Base</span>
                              </div>
                            )}

                            {/* Status Pill */}
                            <div style={{
                              marginTop: "8px", padding: "6px 12px", borderRadius: "10px",
                              background: `${cardColor}15`, border: `1px solid ${cardColor}30`,
                              fontSize: "11px", fontWeight: "700", color: cardColor
                            }}>
                              Seu Aberto para Estudo
                            </div>
                          </div>

                          {/* Botões de Ação da Base em Destaque */}
                          <div style={{ width: "100%", display: "flex", gap: "10px", alignItems: "center" }}>
                            <button
                              onClick={() => {
                                setBaseAtivaUsuario(baseDestaque);
                                setActiveTab("modulos");
                                showToast(`Você entrou na Base ${baseDestaque.nome}! Exibindo módulos.`);
                              }}
                              style={{
                                flex: 1,
                                background: cardGradient,
                                color: "#FFF", border: "none", borderRadius: "14px",
                                padding: "12px 18px", fontWeight: "900", fontSize: "13.5px",
                                boxShadow: `0 8px 25px ${cardGlow}`,
                                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                transition: "all 0.25s ease"
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                            >
                              <span>Entrar na Base</span>
                              <ArrowRight size={16} />
                            </button>

                            {isAdminOrGestor && (
                              <button
                                onClick={() => { setAlunosModalBase(baseDestaque); setModalSearchStudent(""); }}
                                style={{
                                  padding: "12px 16px", borderRadius: "14px",
                                  background: "rgba(255, 255, 255, 0.07)",
                                  border: "1px solid rgba(255, 255, 255, 0.15)",
                                  color: "#E2E8F0", fontWeight: "800", fontSize: "12.5px", cursor: "pointer",
                                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                                  whiteSpace: "nowrap", transition: "all 0.2s ease"
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.14)";
                                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.07)";
                                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                                }}
                              >
                                <Users size={15} style={{ color: cardColor }} />
                                <span>Alunos ({totalAlunosDestaqueCount})</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* LADO DIREITO: PILHA VERTICAL DE BASES SECUNDÁRIAS VINCULADAS COM TROCA AO CLICAR */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: "1 1 650px", maxWidth: "850px", minWidth: "320px" }}>
                          {outrasBases.map((b) => {
                            const criadoEmailB = (b.criadoPorEmail || "").toLowerCase().trim();
                            const criadoIdB = String(b.criadoPorId || "");

                            const countAlunosRaw = usuariosBases.filter(u => {
                              const uBase = (u.base_nome || u.base || "").toLowerCase().trim();
                              const uEmail = (u.email || "").toLowerCase().trim();
                              const uId = String(u.id || "");
                              if (uBase === b.id || uBase === b.nome.toLowerCase()) return true;
                              if (criadoEmailB && uEmail === criadoEmailB) return true;
                              if (criadoIdB && uId === criadoIdB) return true;
                              if (Array.isArray(u.vinculos_bases)) {
                                return u.vinculos_bases.some(v => (v.base_nome || "").toLowerCase().trim() === b.nome.toLowerCase());
                              }
                              return false;
                            }).length;

                            const temCriadorB = Boolean(b.criadoPorEmail || b.criadoPorId || b.tipo === "pessoal_limitada");
                            const countAlunos = (temCriadorB && countAlunosRaw === 0) ? 1 : countAlunosRaw;

                            const itemColor = b.color || b.cor || (b.id === 'contabhub' ? '#3B82F6' : b.id === 'cf_smart' ? '#10B981' : '#F59E0B');
                            const itemGradient = b.gradient || (b.id === 'contabhub' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : b.id === 'cf_smart' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : `linear-gradient(135deg, ${itemColor} 0%, ${itemColor}aa 100%)`);
                            const itemGlow = b.glow || `${itemColor}55`;
                            const itemIcon = b.icon || (b.id === 'contabhub' ? "🏦" : b.id === 'cf_smart' ? "⚡" : "☁️");

                            return (
                              <div
                                key={b.id}
                                title="Clique para colocar esta base em destaque no painel principal"
                                onClick={() => {
                                  setBaseEmDestaqueId(b.id);
                                  showToast(`🔄 Base '${b.nome}' selecionada para o painel principal!`);
                                }}
                                style={{
                                  background: "linear-gradient(160deg, rgba(14, 18, 34, 0.95) 0%, rgba(7, 9, 18, 0.98) 100%)",
                                  border: `1.5px solid ${itemColor}40`,
                                  boxShadow: `0 8px 25px rgba(0,0,0,0.4), 0 0 15px ${itemColor}18`,
                                  borderRadius: "20px",
                                  padding: "16px 22px",
                                  display: "flex",
                                  alignItems: "center",
                                  justify: "space-between",
                                  gap: "16px",
                                  cursor: "pointer",
                                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = "translateX(-4px) scale(1.01)";
                                  e.currentTarget.style.borderColor = itemColor;
                                  e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.5), 0 0 25px ${itemColor}35`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = "translateX(0) scale(1)";
                                  e.currentTarget.style.borderColor = `${itemColor}40`;
                                  e.currentTarget.style.boxShadow = `0 8px 25px rgba(0,0,0,0.4), 0 0 15px ${itemColor}18`;
                                }}
                              >
                                {/* Esquerda: Ícone + Nome + Descrição */}
                                <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
                                  <div style={{
                                    width: "50px", height: "50px", borderRadius: "16px",
                                    background: itemGradient,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "24px", color: "#FFF",
                                    boxShadow: `0 6px 18px ${itemGlow}`, flexShrink: 0, overflow: "hidden"
                                  }}>
                                    {b.logoUrl && b.logoUrl.trim() ? (
                                      <img src={b.logoUrl} alt={b.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                      itemIcon
                                    )}
                                  </div>

                                  <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                      <h3 style={{ fontSize: "16px", margin: 0, fontWeight: "800", color: "#FFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {b.nome}
                                      </h3>
                                      <span style={{ fontSize: "10.5px", fontWeight: "900", color: itemColor, background: `${itemColor}20`, padding: "2px 7px", borderRadius: "6px" }}>
                                        {b.codigo}
                                      </span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: "12px", color: "#94A3B8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                      {b.desc}
                                    </p>
                                  </div>
                                </div>

                                {/* Direita: Alunos Badges + Botão Excluir */}
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                                  <span style={{
                                    fontSize: "11px", fontWeight: "800", color: itemColor,
                                    background: `${itemColor}18`, border: `1px solid ${itemColor}40`,
                                    padding: "5px 12px", borderRadius: "8px"
                                  }}>
                                    {countAlunos} Alunos
                                  </span>

                                  <span style={{
                                    fontSize: "11px", fontWeight: "700", color: "#94A3B8",
                                    background: "rgba(255,255,255,0.06)", padding: "5px 10px", borderRadius: "8px",
                                    border: "1px solid rgba(255,255,255,0.1)"
                                  }}>
                                    Formação Ativo
                                  </span>

                                  {b.id !== "devhub" && (
                                    <button
                                      title="Excluir esta base da plataforma"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm(`Tem certeza que deseja excluir a base '${b.nome}'?`)) {
                                          setListaBases(prev => {
                                            const filtradas = prev.filter(item => item.id !== b.id && item.nome !== b.nome);
                                            try {
                                              localStorage.setItem("devhub_lista_bases", JSON.stringify(filtradas));
                                            } catch (err) {}
                                            window.dispatchEvent(new CustomEvent("devhub_bases_updated", { detail: filtradas }));
                                            return filtradas;
                                          });
                                          if (baseEmDestaqueId === b.id) {
                                            setBaseEmDestaqueId("devhub");
                                          }
                                          showToast(`Base '${b.nome}' removida com sucesso. 🗑️`);
                                        }
                                      }}
                                      style={{
                                        background: "rgba(239, 68, 68, 0.2)",
                                        border: "1px solid rgba(239, 68, 68, 0.4)",
                                        color: "#EF4444", borderRadius: "8px", padding: "5px 10px",
                                        cursor: "pointer", fontSize: "12px", fontWeight: "900",
                                        transition: "all 0.2s ease"
                                      }}
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* SLOT DE CRIAÇÃO DE BASE (Visível Apenas para SuperAdmin / Quem pode criar) */}
                          {(!jaPossuiBasePessoal || isSuperAdmin) && (
                            <div
                              onClick={() => {
                                setNovaBaseModal(true);
                                setModalCriarBaseUsuario(true);
                              }}
                              style={{
                                border: "2px dashed rgba(168, 85, 247, 0.4)",
                                background: "rgba(168, 85, 247, 0.05)",
                                borderRadius: "20px",
                                padding: "18px 24px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "12px",
                                cursor: "pointer",
                                transition: "all 0.25s ease",
                                width: "100%"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#8B5CF6";
                                e.currentTarget.style.background = "rgba(168, 85, 247, 0.12)";
                                e.currentTarget.style.transform = "translateY(-2px)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.4)";
                                e.currentTarget.style.background = "rgba(168, 85, 247, 0.05)";
                                e.currentTarget.style.transform = "translateY(0)";
                              }}
                            >
                              <div style={{
                                width: "36px", height: "36px", borderRadius: "12px",
                                background: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
                                color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)", flexShrink: 0
                              }}>
                                <Plus size={20} />
                              </div>
                              <span style={{ fontSize: "14px", fontWeight: "800", color: "#CBD5E1" }}>
                                {isSuperAdmin ? "Criar Nova Base (Super Admin)" : `Criar Sua Base Pessoal (${jaPossuiBasePessoal ? "1/1" : "0/1"})`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* MODO 2: LISTA ORGANIZADA DE ALUNOS COM ID PRÓPRIO */}
            {(modoVisualizacao === "alunos" || searchUsuario) && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
                  background: "rgba(20, 26, 45, 0.75)", border: "1px solid rgba(255, 255, 255, 0.12)",
                  padding: "10px 18px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.3)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "11px", fontWeight: "800", color: "#3B82F6", background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "3px 10px", borderRadius: "8px", textTransform: "uppercase" }}>
                      LISTA DE ALUNOS
                    </span>
                    <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "#F8FAFC" }}>
                      Vinculados {filtroBaseAtiva !== "todas" ? `à Base ${filtroBaseAtiva}` : "a Todas as Bases"} ({usuariosFiltradosPorBase.length})
                    </h4>
                    {filtroBaseAtiva !== "todas" && (
                      <button
                        onClick={() => { setFiltroBaseAtiva("todas"); setModoVisualizacao("bases"); }}
                        style={{ fontSize: "11px", fontWeight: "800", color: "#3B82F6", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", padding: "3px 10px", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }}
                      >
                        Limpar filtro de Base ✕
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setModoVisualizacao("bases")}
                    style={{
                      padding: "7px 14px", borderRadius: "10px",
                      background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.14)",
                      color: "#CBD5E1", fontSize: "12px", fontWeight: "800", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s"
                    }}
                  >
                    ← Voltar para Visão de Bases
                  </button>
                </div>

                {usuariosFiltradosPorBase.length === 0 ? (
                  <div style={{ padding: "40px 20px", textAlign: "center", background: "rgba(15, 23, 42, 0.6)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <Search style={{ color: "#94A3B8" }} size={32} />
                    <h4 style={{ margin: "10px 0 4px 0", color: "#FFF", fontSize: "16px" }}>Nenhum usuário encontrado</h4>
                    <p style={{ margin: 0, color: "#94A3B8", fontSize: "13px" }}>Nenhum aluno corresponde à busca "{searchUsuario}" na Base selecionada.</p>
                  </div>
                ) : (
                  <div className={styles.modulesGrid}>
                    {usuariosFiltradosPorBase.map((u, index) => {
                      const details = getUserCardDetails(u, index);
                      const baseNome = u.base_nome || "DevHub";
                      const baseObj = listaBases.find(b => b.nome.toLowerCase() === baseNome.toLowerCase()) || listaBases[0];

                      return (
                        <div
                          key={u.id || u.email || index}
                          className={styles.studentCardContainer}
                          style={{
                            "--module-accent": baseObj.color || details.color,
                            "--module-glow": baseObj.glow || details.glow,
                            padding: "16px",
                            gap: "12px"
                          }}
                        >
                          {/* CABEÇALHO DO CARD: ID E CARGO DO ALUNO */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                            <span style={{
                              color: "#FFF",
                              background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                              padding: "3px 9px",
                              borderRadius: "8px",
                              fontSize: "11px",
                              fontWeight: "900",
                              boxShadow: "0 0 10px rgba(6,182,212,0.35)"
                            }}>
                              #ID: {u.id}
                            </span>

                            <span style={{
                              fontSize: "10.5px", fontWeight: "800",
                              color: u.cargo === "admin" ? "#F59E0B" : u.cargo === "superadmin" ? "#A855F7" : "#34D399",
                              background: u.cargo === "admin" ? "rgba(245,158,11,0.18)" : u.cargo === "superadmin" ? "rgba(168,85,247,0.18)" : "rgba(16,185,129,0.18)",
                              border: `1px solid ${u.cargo === "admin" ? "#F59E0B" : u.cargo === "superadmin" ? "#A855F7" : "#10B981"}40`,
                              padding: "2px 8px", borderRadius: "6px"
                            }}>
                              {u.cargo === "admin" ? "Gestor" : u.cargo === "superadmin" ? "Admin" : "Aluno"}
                            </span>
                          </div>

                          {/* AVATAR CIRCULAR + NOME + EMAIL + BADGE DA BASE */}
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div className={styles.studentAvatarCircle} style={{ width: "48px", height: "48px" }}>
                              <div className={styles.studentAvatarCircleInner} style={{ fontSize: "18px" }}>
                                {u.nome ? u.nome.charAt(0).toUpperCase() : "👤"}
                              </div>
                              <div className={styles.studentStatusDot} title="Aluno Cadastrado e Ativo" />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "900", color: "#FFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {u.nome}
                              </h3>
                              <span style={{ fontSize: "11.5px", color: "#94A3B8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: "1px 0 3px 0" }}>
                                {u.email}
                              </span>
                              <div>
                                <span style={{
                                  fontSize: "10px", fontWeight: "800",
                                  color: baseObj.color || "#3B82F6",
                                  background: `${baseObj.color || '#3B82F6'}20`,
                                  border: `1px solid ${baseObj.color || '#3B82F6'}40`,
                                  padding: "2px 7px", borderRadius: "6px"
                                }}>
                                  {baseObj.icon || "📍"} Base: {baseNome}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* ESTATÍSTICAS GAMIFICADAS SUTIS */}
                          <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px",
                            background: "rgba(0, 0, 0, 0.25)", border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "10px", padding: "6px 10px"
                          }}>
                            <span style={{ fontSize: "10.5px", fontWeight: "800", color: "#3B82F6" }}>Pontos: {details.xp}</span>
                            <span style={{ fontSize: "10.5px", fontWeight: "800", color: "#A855F7" }}>Nível {details.nivel}</span>
                            <span style={{ fontSize: "10.5px", fontWeight: "800", color: "#34D399" }}>{details.provas} Provas</span>
                          </div>

                          {/* ÚNICO BOTÃO DE AÇÃO: GERENCIAR VÍNCULO E PERMISSÕES */}
                          <button
                            onClick={() => setUsuarioConfigModal(u)}
                            style={{
                              width: "100%", padding: "9px 12px", borderRadius: "10px",
                              background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.14)",
                              color: "#FFF", fontWeight: "800", fontSize: "12px", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                              transition: "all 0.2s ease"
                            }}
                          >
                            <Settings size={14} />
                            <span>Gerenciar Permissões da Base</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            ABA 1: MÓDULOS (GRID DE CARDS CORPORATIVOS)
           =================================================================== */}
        {activeTab === "modulos" && (
          <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "20px" }}>
            {/* BANNER DA BASE ATIVA SELECIONADA PELO USUÁRIO (Design Ultra Premium) */}
            {(() => {
              const activeColor = baseAtivaUsuario?.color || baseAtivaUsuario?.cor || "#8B5CF6";
              const activeGradient = baseAtivaUsuario?.gradient || `linear-gradient(135deg, ${activeColor} 0%, ${activeColor}aa 100%)`;
              const activeGlow = baseAtivaUsuario?.glow || `${activeColor}40`;
              const activeIcon = baseAtivaUsuario?.icon || (baseAtivaUsuario?.id === 'devhub' ? "🚀" : baseAtivaUsuario?.id === 'contabhub' ? "🏦" : baseAtivaUsuario?.id === 'cf_smart' ? "⚡" : "🏢");
              const activeLogo = baseAtivaUsuario?.logoUrl || baseAtivaUsuario?.logo || "";
              const activeCode = baseAtivaUsuario?.codigo || "BASE-01";
              const activeNome = baseAtivaUsuario?.nome || "DevHub (Base Chefe)";
              const vinculo = baseAtivaUsuario ? userVinculos.find(v => (v.base_nome || "").toLowerCase() === baseAtivaUsuario.nome.toLowerCase()) : null;

              return (
                <div style={{
                  width: "100%", padding: "16px 22px", borderRadius: "20px",
                  background: `linear-gradient(135deg, ${activeColor}15 0%, rgba(15, 23, 42, 0.95) 45%, ${activeColor}10 100%)`,
                  border: `1.5px solid ${activeColor}45`,
                  boxShadow: `0 12px 35px rgba(0,0,0,0.6), 0 0 30px ${activeGlow}`,
                  backdropFilter: "blur(20px)",
                  display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px",
                  transition: "all 0.3s ease"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {/* Emblema / Foto da Logo */}
                    <div style={{
                      width: "50px", height: "50px",
                      borderRadius: "15px",
                      background: activeGradient,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "24px", color: "#FFF",
                      boxShadow: `0 8px 24px ${activeGlow}`,
                      overflow: "hidden", flexShrink: 0
                    }}>
                      {activeLogo && activeLogo.trim() ? (
                        <img src={activeLogo} alt={activeNome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span>{activeIcon}</span>
                      )}
                    </div>

                    <div>
                      {/* Topo do Header: Tag + Nome da Base + Indicador Ativo */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: "11px", fontWeight: "900",
                          color: activeColor,
                          background: `${activeColor}22`,
                          border: `1px solid ${activeColor}45`,
                          padding: "3px 10px", borderRadius: "8px",
                          letterSpacing: "0.5px"
                        }}>
                          {activeCode}
                        </span>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#FFF", margin: 0, letterSpacing: "-0.01em" }}>
                          Base Ativa: {activeNome}
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 8px", borderRadius: "9999px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px #10B981" }} />
                          <span style={{ fontSize: "10.5px", fontWeight: "800", color: "#34D399" }}>Ativa & Conectada</span>
                        </div>
                      </div>

                      {/* Linha de Vínculo e Detalhes da Base */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px", flexWrap: "wrap", fontSize: "12px", color: "#CBD5E1" }}>
                        {vinculo ? (
                          <>
                            <span style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "2px 8px", borderRadius: "6px" }}>
                              Vínculo: <strong style={{ color: activeColor }}>{vinculo.cargo === 'usuario' ? '🎓 Aluno' : vinculo.cargo === 'admin' ? '🛡️ Gestor' : '👑 Admin Executivo'}</strong>
                            </span>
                            <span style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "2px 8px", borderRadius: "6px" }}>
                              Plano: <strong style={{ color: "#3B82F6" }}>{vinculo.plano || 'Dev Start'}</strong>
                            </span>
                            <span style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "2px 8px", borderRadius: "6px" }}>
                              Trilha: <strong style={{ color: "#10B981" }}>{vinculo.trilha || 'Contabilidade & Tech'}</strong>
                            </span>
                          </>
                        ) : (
                          <span style={{ background: `${activeColor}15`, border: `1px solid ${activeColor}30`, padding: "3px 10px", borderRadius: "6px", color: activeColor, fontWeight: "700" }}>
                            ⚡ Acesso Aberto nesta Base • Módulos Liberados para Estudo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botão de Trocar Base */}
                  <button
                    onClick={() => setActiveTab("bases")}
                    style={{
                      padding: "10px 18px", borderRadius: "14px",
                      background: `linear-gradient(135deg, ${activeColor} 0%, ${activeColor}cc 100%)`,
                      border: "none",
                      color: "#FFF", fontSize: "12.5px", fontWeight: "800",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                      boxShadow: `0 6px 20px ${activeGlow}`,
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.03)";
                      e.currentTarget.style.boxShadow = `0 8px 25px ${activeColor}70`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = `0 6px 20px ${activeGlow}`;
                    }}
                  >
                    <Compass size={16} />
                    <span>Trocar / Selecionar Base</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })()}

            <div className={styles.modulesGrid}>
            {modulosFiltrados.map((mod) => {
              const IconComp = mod.icon;
              return (
                <div
                  key={mod.id}
                  className={styles.moduleCard}
                  style={{
                    "--module-accent": mod.color,
                    "--module-glow": mod.glow,
                    "--module-tint": mod.tintBg || `${mod.color}15`
                  }}
                  onClick={() => handleEntrarModulo(mod)}
                >
                  <div className={styles.cardTopBar}>
                    <span 
                      className={styles.cardTagHeader} 
                      style={{ 
                        color: mod.color, 
                        borderColor: `${mod.color}45`, 
                        background: `${mod.color}18` 
                      }}
                    >
                      {mod.tag}
                    </span>

                    <button 
                      className={styles.btnResumoCard} 
                      title="Ver resumo sobre este módulo"
                      onClick={(e) => {
                        e.stopPropagation();
                        setResumoModalModulo(mod);
                      }}
                    >
                      <Info size={13} />
                      <span>Resumo</span>
                    </button>
                  </div>

                  <div className={styles.iconContainerBox}>
                    <div className={styles.iconGlowAmbient} style={{ background: mod.color }} />
                    <div className={styles.iconPulseRing} style={{ borderColor: `${mod.color}60` }} />
                    <div className={styles.iconWrapper} style={{ background: mod.gradient }}>
                      <IconComp size={36} color="#FFF" style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))", zIndex: 3 }} />
                    </div>
                    {mod.floatingBadge && (
                      <div className={styles.iconFloatingChip} style={{ background: mod.gradient, boxShadow: `0 4px 14px ${mod.glow}` }}>
                        {mod.floatingBadge}
                      </div>
                    )}
                  </div>

                  <span className={styles.cardBadge} style={{ color: mod.color, background: `${mod.color}15`, border: `1px solid ${mod.color}35` }}>
                    {mod.badge}
                  </span>

                  <h3 className={styles.moduleTitle}>{mod.titulo}</h3>
                  <p className={styles.moduleDesc}>{mod.desc}</p>

                  <div className={styles.cardQuickStats}>
                    <span className={styles.statPill}>{mod.stat1}</span>
                    <span className={styles.statPill}>{mod.stat2}</span>
                  </div>

                  <button className={styles.btnEnterModule} style={{ background: mod.gradient }}>
                    <span>Entrar na Ferramenta</span>
                    <ArrowRight size={15} className={styles.btnArrowIcon} />
                  </button>
                </div>
              );
            })}
          </div>
          </div>
        )}

        {/* ===================================================================
            ABA 2: ATALHOS & CONFIGURAÇÕES (CARDS GAMIFICADOS PREMIUM)
           =================================================================== */}
        {activeTab === "atalhos" && (
          <div className={styles.shortcutsContainer}>
            <div className={styles.shortcutsHeader}>
              <div className={styles.shortcutsHeaderInfo}>
                <div className={styles.shortcutsHeaderBadge}>
                  <Sparkles size={13} color="#c084fc" />
                  <span>Central de Recursos</span>
                </div>
                <h3>Atalhos Rápidos da Plataforma</h3>
                <p>Acesse ferramentas de suporte e perfil sem precisar escolher um módulo de estudos</p>
              </div>
            </div>

            <div className={styles.shortcutsList}>
              {listAtalhos.map((at) => {
                const AtIcon = at.icon;
                return (
                  <div
                    key={at.id}
                    className={styles.shortcutItem}
                    style={{
                      "--item-color": at.color,
                      "--item-glow": at.glow
                    }}
                    onClick={at.action}
                  >
                    <div className={styles.shortcutIconBox} style={{ background: at.gradient }}>
                      <AtIcon size={24} color="#FFF" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }} />
                    </div>

                    <div className={styles.shortcutInfo}>
                      <div className={styles.shortcutTitleRow}>
                        <span className={styles.shortcutTitle}>{at.titulo}</span>
                        {at.badge && (
                          <span className={styles.shortcutBadgePill} style={{ color: at.color, background: `${at.color}18`, borderColor: `${at.color}35` }}>
                            {at.badge}
                          </span>
                        )}
                      </div>
                      <p className={styles.shortcutDesc}>{at.desc}</p>
                    </div>

                    <div className={styles.shortcutArrowBox}>
                      <ChevronRight size={18} className={styles.shortcutArrowIcon} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* MODAL DE RESUMO DO MÓDULO */}
      {resumoModalModulo && (
        <div className={styles.modalOverlay} onClick={() => setResumoModalModulo(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.modalCloseBtn} 
              onClick={() => setResumoModalModulo(null)}
              title="Fechar"
            >
              <X size={18} />
            </button>

            <div className={styles.modalHeader}>
              <div 
                className={styles.modalIconBox} 
                style={{ background: resumoModalModulo.gradient }}
              >
                {resumoModalModulo.icon && <resumoModalModulo.icon size={28} color="#FFF" />}
              </div>
              <div className={styles.modalHeaderInfo}>
                <span 
                  className={styles.cardBadge} 
                  style={{ 
                    color: resumoModalModulo.color, 
                    background: `${resumoModalModulo.color}18`, 
                    border: `1px solid ${resumoModalModulo.color}40`,
                    display: "inline-block",
                    marginBottom: "4px"
                  }}
                >
                  {resumoModalModulo.badge}
                </span>
                <h2 className={styles.modalTitle}>{resumoModalModulo.titulo}</h2>
              </div>
            </div>

            <div className={styles.modalBody}>
              <h4 className={styles.modalSectionLabel}>
                📌 O QUE É ESTE MÓDULO
              </h4>
              <p className={styles.modalDescText}>
                {resumoModalModulo.resumoDetalhado || resumoModalModulo.desc}
              </p>
            </div>

            <div className={styles.modalFooter}>
              <button 
                className={styles.btnModalEntrar} 
                style={{ background: resumoModalModulo.gradient }}
                onClick={() => {
                  const target = resumoModalModulo;
                  setResumoModalModulo(null);
                  handleEntrarModulo(target);
                }}
              >
                Entrar na Ferramenta agora <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIGURAÇÕES RÁPIDAS DA ENGRENAGEM DA BASE DO USUÁRIO */}
      {usuarioConfigModal && (
        <div className={styles.modalOverlay} onClick={() => setUsuarioConfigModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
            <button className={styles.modalCloseBtn} onClick={() => setUsuarioConfigModal(null)} title="Fechar">
              <X size={18} />
            </button>

            <div className={styles.modalHeader}>
              <div
                className={styles.modalIconBox}
                style={{ background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}
              >
                <Settings size={28} color="#FFF" />
              </div>
              <div className={styles.modalHeaderInfo}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className={styles.cardBadge} style={{ color: "#F59E0B", background: "rgba(245,158,11,0.18)", border: "1px solid rgba(245,158,11,0.4)" }}>
                    ⚙️ CONFIGURAÇÃO DA BASE
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "900", color: "#FFF", background: "linear-gradient(135deg, #06b6d4, #0891b2)", padding: "2px 8px", borderRadius: "6px" }}>
                    #ID: {usuarioConfigModal.id}
                  </span>
                </div>
                <h2 className={styles.modalTitle}>{usuarioConfigModal.nome}</h2>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#94A3B8" }}>{usuarioConfigModal.email}</p>
              </div>
            </div>

            <div className={styles.modalBody} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* VÍNCULO DE BASE / EMPRESA DO USUÁRIO */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: "#F59E0B", marginBottom: "6px" }}>
                  🏢 Base / Organização Vinculada
                </label>
                <select
                  value={usuarioConfigModal.base_nome || "DevHub"}
                  onChange={(e) => setUsuarioConfigModal({ ...usuarioConfigModal, base_nome: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "#0F172A", border: "1px solid rgba(245, 158, 11, 0.4)", color: "#FFF", fontSize: "13px", fontWeight: "700" }}
                >
                  {listaBases.map((b) => (
                    <option key={b.id} value={b.nome}>
                      {b.icon} {b.nome} ({b.codigo})
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px", display: "block" }}>
                  Vincule este aluno a uma base para ele realizar seus estudos.
                </span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: "#CBD5E1", marginBottom: "6px" }}>
                  Plano da Base do Aluno
                </label>
                <select
                  value={usuarioConfigModal.plano || "dev_start"}
                  onChange={(e) => setUsuarioConfigModal({ ...usuarioConfigModal, plano: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "#0F172A", border: "1px solid rgba(255,255,255,0.15)", color: "#FFF", fontSize: "13px", fontWeight: "700" }}
                >
                  <option value="dev_start">🌱 Dev Start (Aulas + Caderno + Ranking)</option>
                  <option value="dev_plus">⚡ Dev Plus (Dev Start + Provas + Arena 1v1)</option>
                  <option value="dev_master">👑 Dev Master (Acesso Total + Dev IA)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: "#CBD5E1", marginBottom: "6px" }}>
                  Cargo / Permissão no Sistema
                </label>
                <select
                  value={usuarioConfigModal.cargo || "usuario"}
                  onChange={(e) => setUsuarioConfigModal({ ...usuarioConfigModal, cargo: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "#0F172A", border: "1px solid rgba(255,255,255,0.15)", color: "#FFF", fontSize: "13px", fontWeight: "700" }}
                >
                  <option value="usuario">🎓 Estudante / Aluno</option>
                  <option value="admin">🛡️ Administrador de Provas</option>
                  <option value="superadmin">👑 Super Admin Executivo</option>
                </select>
              </div>
            </div>

            <div className={styles.modalFooter} style={{ display: "flex", gap: "10px" }}>
              <button
                className={styles.btnModalEntrar}
                style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", flex: 1 }}
                onClick={() => {
                  // Atualizar backend se houver conexão
                  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                  if (usuarioConfigModal.id) {
                    fetch(`${apiUrl}/auth/users/${usuarioConfigModal.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                      body: JSON.stringify({
                        nome: usuarioConfigModal.nome,
                        email: usuarioConfigModal.email,
                        cargo: usuarioConfigModal.cargo,
                        base_nome: usuarioConfigModal.base_nome
                      })
                    }).catch(() => {});
                  }

                  setUsuariosBases(prev => prev.map(u => u.id === usuarioConfigModal.id ? usuarioConfigModal : u));
                  showToast(`⚙️ Configurações e Base de ${usuarioConfigModal.nome} atualizadas!`);
                  setUsuarioConfigModal(null);
                }}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ULTRA PREMIUM PARA CADASTRAR NOVA BASE / EMPRESA (LAYOUT SPLIT 2-COLUNAS COM PRÉVIA AO VIVO) */}
      {(novaBaseModal || modalCriarBaseUsuario) && (
        <div className={styles.modalOverlay} onClick={() => { setNovaBaseModal(false); setModalCriarBaseUsuario(false); }}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "880px", width: "95%",
              background: "linear-gradient(165deg, #131728 0%, #0A0D18 100%)",
              border: `1px solid ${novaBaseForm.color}50`,
              boxShadow: `0 24px 70px rgba(0,0,0,0.85), 0 0 50px ${novaBaseForm.color}25`,
              borderRadius: "24px",
              padding: "28px",
              position: "relative"
            }}
          >
            {/* BOTÃO FECHAR NO CANTO SUPERIOR DIREITO */}
            <button
              className={styles.modalCloseBtn}
              onClick={() => { setNovaBaseModal(false); setModalCriarBaseUsuario(false); }}
              title="Fechar"
            >
              <X size={18} />
            </button>

            {/* CABEÇALHO DO MODAL */}
            <div className={styles.modalHeader} style={{ marginBottom: "20px", gap: "14px" }}>
              <div
                className={styles.modalIconBox}
                style={{
                  background: `linear-gradient(135deg, ${novaBaseForm.color} 0%, ${novaBaseForm.color}99 100%)`,
                  boxShadow: `0 0 24px ${novaBaseForm.color}60`,
                  width: "48px", height: "48px"
                }}
              >
                <span style={{ fontSize: "24px" }}>{novaBaseForm.icon}</span>
              </div>
              <div className={styles.modalHeaderInfo}>
                <h2 className={styles.modalTitle} style={{ fontSize: "1.3rem" }}>Cadastrar Nova Base</h2>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#94A3B8" }}>
                  {isSuperAdmin
                    ? "Super Admin: Crie um novo ecossistema de estudos sem restrição de limite."
                    : "Crie sua base pessoal de estudos e prática individual."}
                </p>
              </div>
            </div>

            {/* CORPO DO MODAL EM 2 COLUNAS IGUAIS */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px", alignItems: "start" }}>
              
              {/* COLUNA ESQUERDA: FORMULÁRIO */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* NOME DA BASE */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "800", color: "#CBD5E1", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Nome da Empresa / Base <span style={{ color: "#F43F5E" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: ContabHub Pro, CF Smart..."
                    value={novaBaseForm.nome}
                    onChange={(e) => setNovaBaseForm({ ...novaBaseForm, nome: e.target.value })}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: "10px",
                      background: "rgba(15, 23, 42, 0.9)", border: `1px solid ${novaBaseForm.nome ? novaBaseForm.color : "rgba(255,255,255,0.15)"}`,
                      color: "#FFF", fontSize: "13px", fontWeight: "600", outline: "none",
                      transition: "all 0.2s"
                    }}
                  />
                </div>

                {/* DESCRIÇÃO CURTA */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "800", color: "#CBD5E1", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Descrição Curta
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Base voltada para formação fiscal..."
                    value={novaBaseForm.desc}
                    onChange={(e) => setNovaBaseForm({ ...novaBaseForm, desc: e.target.value })}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: "10px",
                      background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.15)",
                      color: "#FFF", fontSize: "13px", fontWeight: "600", outline: "none"
                    }}
                  />
                </div>

                {/* SELEÇÃO DE ÍCONE */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "800", color: "#CBD5E1", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Ícone da Base
                  </label>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {[
                      { icon: "🏢", label: "Prédio" },
                      { icon: "🏦", label: "Contab" },
                      { icon: "⚡", label: "Smart" },
                      { icon: "🔥", label: "Hot" },
                      { icon: "💎", label: "Premium" },
                      { icon: "🚀", label: "StartUp" }
                    ].map(item => {
                      const isSelected = novaBaseForm.icon === item.icon;
                      return (
                        <button
                          key={item.icon}
                          type="button"
                          onClick={() => setNovaBaseForm({ ...novaBaseForm, icon: item.icon })}
                          style={{
                            padding: "5px 9px", borderRadius: "8px", fontSize: "11px", fontWeight: "800",
                            background: isSelected ? `${novaBaseForm.color}25` : "rgba(255,255,255,0.05)",
                            border: `1px solid ${isSelected ? novaBaseForm.color : "rgba(255,255,255,0.12)"}`,
                            color: isSelected ? novaBaseForm.color : "#94A3B8",
                            cursor: "pointer", transition: "all 0.2s",
                            display: "flex", alignItems: "center", gap: "4px"
                          }}
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SELEÇÃO DE COR */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "800", color: "#CBD5E1", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Cor do Tema
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[
                      { color: "#3B82F6", label: "Azul" },
                      { color: "#10B981", label: "Verde" },
                      { color: "#A855F7", label: "Roxo" },
                      { color: "#F59E0B", label: "Dourado" },
                      { color: "#F43F5E", label: "Rosa" },
                      { color: "#06B6D4", label: "Ciano" }
                    ].map(c => {
                      const isSelected = novaBaseForm.color === c.color;
                      return (
                        <button
                          key={c.color}
                          type="button"
                          onClick={() => setNovaBaseForm({ ...novaBaseForm, color: c.color })}
                          style={{
                            width: "28px", height: "28px", borderRadius: "50%",
                            background: c.color,
                            border: `2px solid ${isSelected ? "#FFF" : "transparent"}`,
                            boxShadow: isSelected ? `0 0 12px ${c.color}` : "none",
                            cursor: "pointer", transition: "all 0.2s"
                          }}
                          title={c.label}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* COLUNA DIREITA: CARD AO VIVO EM TAMANHO REAL */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#94A3B8", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                  👁️ Pré-visualização do Card
                </span>

                <div
                  className={styles.moduleCard}
                  style={{
                    "--module-accent": novaBaseForm.color,
                    "--module-glow": `${novaBaseForm.color}70`,
                    "--module-tint": `${novaBaseForm.color}15`,
                    margin: 0
                  }}
                >
                  <div className={styles.cardTopBar}>
                    <span className={styles.cardTagHeader} style={{ color: novaBaseForm.color, borderColor: `${novaBaseForm.color}45`, background: `${novaBaseForm.color}18` }}>
                      {novaBaseForm.icon} {novaBaseForm.nome || "Nova Base"}
                    </span>
                    <span style={{ fontSize: "10px", fontWeight: "900", color: novaBaseForm.color, background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: "6px" }}>
                      BASE-0{listaBases.length + 1}
                    </span>
                  </div>

                  <div className={styles.baseEmblemContainer}>
                    <div className={styles.baseEmblemGlow} style={{ background: novaBaseForm.color }} />
                    <div className={styles.baseEmblemPulseRing} style={{ "--module-accent": novaBaseForm.color }} />
                    <div className={styles.baseEmblemShield} style={{ "--module-accent": novaBaseForm.color, "--module-glow": `${novaBaseForm.color}70` }}>
                      <div className={styles.baseEmblemShieldInner}>
                        <span className={styles.baseEmblemIcon}>{novaBaseForm.icon}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className={styles.moduleTitle} style={{ fontSize: "16px" }}>{novaBaseForm.nome || "Nome da Base"}</h3>
                  <p className={styles.moduleDesc} style={{ fontSize: "11px" }}>{novaBaseForm.desc || "Descrição curta da base..."}</p>

                  <div className={styles.cardQuickStats}>
                    <span className={styles.statPill} style={{ color: novaBaseForm.color, fontWeight: "800", fontSize: "10px" }}>👥 0 Alunos</span>
                    <span className={styles.statPill} style={{ fontSize: "10px" }}>⭐ 0 XP Total</span>
                  </div>

                  <button
                    className={styles.btnEnterModule}
                    style={{ background: `linear-gradient(135deg, ${novaBaseForm.color}, ${novaBaseForm.color}cc)`, padding: "8px 12px", fontSize: "12px" }}
                  >
                    <span>Entrar na Base →</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RODAPÉ DO MODAL E BOTÃO */}
            <div className={styles.modalFooter} style={{ marginTop: "22px" }}>
              <button
                className={styles.btnModalEntrar}
                style={{
                  background: `linear-gradient(135deg, ${novaBaseForm.color} 0%, ${novaBaseForm.color}dd 100%)`,
                  boxShadow: `0 6px 20px ${novaBaseForm.color}50`,
                  borderRadius: "14px",
                  padding: "12px 20px"
                }}
                onClick={() => {
                  if (!novaBaseForm.nome.trim()) {
                    showToast("⚠️ Digite um nome para a nova base.");
                    return;
                  }

                  const novabase = {
                    id: `base_${Date.now()}`,
                    nome: novaBaseForm.nome.trim(),
                    codigo: `BASE-0${listaBases.length + 1}`,
                    badge: `${novaBaseForm.icon} ${novaBaseForm.nome.trim()}`,
                    color: novaBaseForm.color,
                    gradient: `linear-gradient(135deg, ${novaBaseForm.color} 0%, ${novaBaseForm.color}cc 100%)`,
                    glow: `${novaBaseForm.color}70`,
                    desc: novaBaseForm.desc.trim() || "Base personalizada de treinamento e estudos.",
                    icon: novaBaseForm.icon,
                    criadoPorEmail: user?.email,
                    criadoPorId: user?.id,
                    tipo: "pessoal_limitada"
                  };

                  setListaBases(prev => {
                    const proximaLista = [...prev, novabase];
                    try {
                      localStorage.setItem("devhub_lista_bases", JSON.stringify(proximaLista));
                    } catch (e) {}
                    window.dispatchEvent(new CustomEvent("devhub_bases_updated", { detail: proximaLista }));
                    return proximaLista;
                  });
                  setBaseEmDestaqueId(novabase.id);
                  showToast(`🏢 Nova Base '${novabase.nome}' criada com sucesso!`);
                  setNovaBaseModal(false);
                  setModalCriarBaseUsuario(false);
                  setNovaBaseForm({ nome: "", desc: "", icon: "🚀", color: "#A855F7" });
                }}
              >
                <span>Cadastrar Base Agora ✨</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ULTRA PREMIUM PARA VINCULAR ALUNO COM CARGO E ESTUDOS ESPECÍFICOS */}
      {vincularModalBase && (
        <div
          className={styles.modalOverlay}
          onClick={() => { setVincularModalBase(null); setStudentDropdownOpen(false); }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            background: "rgba(5, 7, 13, 0.88)",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justify: "center",
            padding: "24px"
          }}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "540px",
              background: "linear-gradient(165deg, #131728 0%, #0A0D18 100%)",
              border: `1px solid ${vincularModalBase.color || '#3B82F6'}60`,
              boxShadow: `0 24px 70px rgba(0,0,0,0.9), 0 0 50px ${vincularModalBase.color || '#3B82F6'}30`,
              borderRadius: "24px",
              padding: "26px",
              position: "relative"
            }}
          >
            <button className={styles.modalCloseBtn} onClick={() => { setVincularModalBase(null); setStudentDropdownOpen(false); }} title="Fechar">
              <X size={18} />
            </button>

            <div className={styles.modalHeader} style={{ marginBottom: "18px", gap: "14px" }}>
              <div
                className={styles.modalIconBox}
                style={{
                  background: `linear-gradient(135deg, ${vincularModalBase.color || '#8B5CF6'} 0%, ${vincularModalBase.color || '#8B5CF6'}bb 100%)`,
                  width: "52px", height: "52px",
                  borderRadius: "16px",
                  boxShadow: `0 0 20px ${vincularModalBase.color || '#8B5CF6'}60`,
                  overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                {vincularModalBase.logoUrl && vincularModalBase.logoUrl.trim() ? (
                  <img src={vincularModalBase.logoUrl} alt={vincularModalBase.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "26px" }}>{vincularModalBase.icon || "🚀"}</span>
                )}
              </div>
              <div className={styles.modalHeaderInfo}>
                <span style={{ color: vincularModalBase.color || '#3B82F6', background: `${vincularModalBase.color || '#3B82F6'}20`, border: `1px solid ${vincularModalBase.color || '#3B82F6'}40`, padding: "2px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "900", display: "inline-block", width: "fit-content" }}>
                  {vincularModalBase.codigo}
                </span>
                <h2 className={styles.modalTitle} style={{ fontSize: "1.25rem", marginTop: "2px" }}>
                  Vincular Aluno à Base {vincularModalBase.nome}
                </h2>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#94A3B8" }}>
                  Defina o cargo e os acessos de estudos deste aluno nesta base
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* SELEÇÃO DO ALUNO COM DROPDOWN CUSTOMIZADO ULTRA PREMIUM */}
              <div style={{ position: "relative" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: "#CBD5E1", marginBottom: "6px" }}>
                  Selecione o Aluno <span style={{ color: "#F43F5E" }}>*</span>
                </label>
                
                {/* Botão Gatilho do Dropdown */}
                <button
                  type="button"
                  onClick={() => setStudentDropdownOpen(!studentDropdownOpen)}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: "16px",
                    background: studentDropdownOpen
                      ? "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 27, 75, 0.95) 100%)"
                      : "rgba(15, 23, 42, 0.85)",
                    border: `1.5px solid ${studentDropdownOpen ? (vincularModalBase.color || '#8B5CF6') : vincularSelectedUserId ? `${vincularModalBase.color || '#8B5CF6'}90` : 'rgba(255,255,255,0.14)'}`,
                    boxShadow: studentDropdownOpen || vincularSelectedUserId ? `0 8px 25px rgba(0,0,0,0.5), 0 0 20px ${vincularModalBase.color || '#8B5CF6'}35` : "none",
                    color: "#FFF", fontSize: "13px", fontWeight: "700",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    cursor: "pointer", transition: "all 0.25s ease"
                  }}
                >
                  {vincularSelectedUserId ? (
                    (() => {
                      const u = usuariosBases.find(user => String(user.id) === String(vincularSelectedUserId));
                      if (!u) return <span style={{ color: "#94A3B8" }}>-- Escolha um Aluno cadastrado --</span>;
                      
                      const getInitials = (nome) => {
                        if (!nome || typeof nome !== "string") return "U";
                        const parts = nome.trim().split(/\s+/).filter(Boolean);
                        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                        if (parts[0] && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
                        return parts[0] ? parts[0].toUpperCase() : "U";
                      };
                      const uPhoto = u.avatar_url || u.fotoUrl || u.foto || u.avatar;
                      const hasPhoto = uPhoto && typeof uPhoto === "string" && uPhoto.trim().length > 0 && !uPhoto.includes("ui-avatars.com");

                      return (
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", overflow: "hidden" }}>
                          <div style={{
                            width: "36px", height: "36px", borderRadius: "50%",
                            background: `linear-gradient(135deg, ${vincularModalBase.color || '#3B82F6'} 0%, #8B5CF6 100%)`,
                            border: "1px solid rgba(255,255,255,0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: "900", fontSize: "13px", color: "#FFF", flexShrink: 0,
                            overflow: "hidden", boxShadow: `0 0 12px ${vincularModalBase.color || '#3B82F6'}50`
                          }}>
                            {hasPhoto ? (
                              <img src={uPhoto} alt={u.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              getInitials(u.nome)
                            )}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", textAlign: "left", minWidth: 0, flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "11px", fontWeight: "900", color: vincularModalBase.color || '#3B82F6', background: `${vincularModalBase.color || '#3B82F6'}20`, padding: "1px 7px", borderRadius: "6px", border: `1px solid ${vincularModalBase.color || '#3B82F6'}40` }}>
                                #ID: {u.id}
                              </span>
                              <span style={{ fontWeight: "800", color: "#FFF", fontSize: "13.5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {u.nome}
                              </span>
                            </div>
                            <span style={{ fontSize: "11.5px", color: "#94A3B8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {u.email}
                            </span>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#94A3B8" }}>
                      <User size={18} style={{ color: vincularModalBase.color || '#8B5CF6' }} />
                      <span style={{ fontWeight: "700" }}>-- Clique para Escolher um Aluno Cadastrado --</span>
                    </div>
                  )}
                  <ChevronDown size={18} style={{ color: vincularModalBase.color || '#8B5CF6', transform: studentDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease", flexShrink: 0 }} />
                </button>

                {/* Painel Suspenso do Dropdown Customizado Ultra Premium */}
                {studentDropdownOpen && (
                  <div
                    style={{
                      position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
                      zIndex: 1200,
                      background: "linear-gradient(165deg, rgba(16, 21, 37, 0.98) 0%, rgba(9, 12, 22, 0.99) 100%)",
                      border: `1.5px solid ${vincularModalBase.color || '#8B5CF6'}70`,
                      borderRadius: "20px",
                      boxShadow: `0 25px 70px rgba(0,0,0,0.95), 0 0 40px ${vincularModalBase.color || '#8B5CF6'}25`,
                      backdropFilter: "blur(24px)",
                      padding: "12px",
                      maxHeight: "310px",
                      display: "flex", flexDirection: "column", gap: "10px"
                    }}
                  >
                    <div style={{
                      display: "flex", alignItems: "center",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${vincularModalBase.color || '#8B5CF6'}40`,
                      borderRadius: "12px", padding: "8px 12px", gap: "10px"
                    }}>
                      <Search size={15} style={{ color: vincularModalBase.color || '#8B5CF6' }} />
                      <input
                        type="text"
                        placeholder="Buscar por ID, nome ou e-mail..."
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                        autoFocus
                        style={{
                          background: "transparent", border: "none", color: "#FFF", fontSize: "12.5px", fontWeight: "600", outline: "none", width: "100%"
                        }}
                      />
                      {studentSearchQuery && (
                        <button type="button" onClick={() => setStudentSearchQuery("")} style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer", padding: 0 }}>
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px", paddingRight: "4px" }}>
                      {usuariosBases.filter(u => {
                        if (!studentSearchQuery) return true;
                        const q = studentSearchQuery.toLowerCase();
                        return String(u.id).includes(q) || (u.nome || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
                      }).length === 0 ? (
                        <div style={{ padding: "20px", textAlign: "center", color: "#64748B", fontSize: "12px", fontWeight: "600" }}>
                          🔍 Nenhum aluno encontrado para "{studentSearchQuery}".
                        </div>
                      ) : (
                        usuariosBases
                          .filter(u => {
                            if (!studentSearchQuery) return true;
                            const q = studentSearchQuery.toLowerCase();
                            return String(u.id).includes(q) || (u.nome || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
                          })
                          .map(u => {
                            const isSel = String(vincularSelectedUserId) === String(u.id);
                            const getInitials = (nome) => {
                              if (!nome || typeof nome !== "string") return "U";
                              const parts = nome.trim().split(/\s+/).filter(Boolean);
                              if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                              if (parts[0] && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
                              return parts[0] ? parts[0].toUpperCase() : "U";
                            };
                            const uPhoto = u.avatar_url || u.fotoUrl || u.foto || u.avatar;
                            const hasPhoto = uPhoto && typeof uPhoto === "string" && uPhoto.trim().length > 0 && !uPhoto.includes("ui-avatars.com");
                            const listBases = Array.from(new Set([
                              u.base_nome,
                              u.base,
                              ...(Array.isArray(u.vinculos_bases) ? u.vinculos_bases.map(v => v.base_nome).filter(Boolean) : [])
                            ].filter(Boolean)));

                            return (
                              <div
                                key={u.id}
                                onClick={() => {
                                  setVincularSelectedUserId(u.id);
                                  setStudentDropdownOpen(false);
                                  setStudentSearchQuery("");
                                }}
                                style={{
                                  display: "flex", alignItems: "center", justifyContent: "space-between",
                                  padding: "10px 14px", borderRadius: "14px", cursor: "pointer",
                                  background: isSel
                                    ? `linear-gradient(135deg, ${vincularModalBase.color || '#8B5CF6'}35 0%, ${vincularModalBase.color || '#8B5CF6'}18 100%)`
                                    : "rgba(255, 255, 255, 0.03)",
                                  border: `1.5px solid ${isSel ? (vincularModalBase.color || '#8B5CF6') : 'rgba(255, 255, 255, 0.08)'}`,
                                  boxShadow: isSel ? `0 4px 15px ${vincularModalBase.color || '#8B5CF6'}30` : "none",
                                  transition: "all 0.2s ease"
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSel) {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.07)";
                                    e.currentTarget.style.borderColor = `${vincularModalBase.color || '#8B5CF6'}50`;
                                    e.currentTarget.style.transform = "translateX(3px)";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSel) {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                                    e.currentTarget.style.transform = "translateX(0)";
                                  }
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                                  <div style={{
                                    width: "34px", height: "34px", borderRadius: "50%",
                                    background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontWeight: "900", fontSize: "12px", color: "#FFF", flexShrink: 0,
                                    boxShadow: "0 0 10px rgba(139, 92, 246, 0.3)", overflow: "hidden"
                                  }}>
                                    {hasPhoto ? (
                                      <img src={uPhoto} alt={u.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                      getInitials(u.nome)
                                    )}
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", minWidth: 0, gap: "1px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                                      <span style={{ fontSize: "10.5px", fontWeight: "900", color: "#C084FC", background: "rgba(168, 85, 247, 0.18)", border: "1px solid rgba(168, 85, 247, 0.3)", padding: "1px 6px", borderRadius: "6px" }}>
                                        #ID: {u.id}
                                      </span>
                                      <span style={{ fontWeight: "800", color: "#F8FAFC", fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {u.nome}
                                      </span>
                                    </div>
                                    <span style={{ fontSize: "11px", color: "#94A3B8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                      {u.email}
                                    </span>
                                  </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                                  {listBases.length > 0 && (
                                    <div
                                      title={`Vinculado às bases: ${listBases.join(", ")}`}
                                      style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "nowrap" }}
                                    >
                                      {listBases.slice(0, 2).map((bName, idx) => (
                                        <span
                                          key={idx}
                                          style={{
                                            fontSize: "10px", fontWeight: "700",
                                            background: "rgba(255,255,255,0.08)", color: "#CBD5E1",
                                            border: "1px solid rgba(255,255,255,0.12)",
                                            padding: "2px 7px", borderRadius: "7px",
                                            display: "flex", alignItems: "center", gap: "3px",
                                            whiteSpace: "nowrap"
                                          }}
                                        >
                                          📍 {bName}
                                        </span>
                                      ))}
                                      {listBases.length > 2 && (
                                        <span
                                          style={{
                                            fontSize: "10px", fontWeight: "900",
                                            background: "rgba(139, 92, 246, 0.2)", color: "#C084FC",
                                            border: "1px solid rgba(139, 92, 246, 0.35)",
                                            padding: "2px 6px", borderRadius: "7px",
                                            whiteSpace: "nowrap"
                                          }}
                                        >
                                          +{listBases.length - 2} bases
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {isSel && (
                                    <div style={{
                                      width: "22px", height: "22px", borderRadius: "50%",
                                      background: vincularModalBase.color || '#8B5CF6',
                                      display: "flex", alignItems: "center", justifyContent: "center",
                                      boxShadow: `0 0 10px ${vincularModalBase.color || '#8B5CF6'}`
                                    }}>
                                      <Check size={14} style={{ color: "#FFF" }} />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* SELEÇÃO DO CARGO ESPECÍFICO NESTA BASE */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: "#CBD5E1", marginBottom: "8px" }}>
                  Cargo do Aluno na Base {vincularModalBase.nome}
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[
                    { id: "usuario", label: "🎓 Aluno / Estudante", desc: "Acesso normal às aulas e conteúdos" },
                    { id: "admin", label: "👑 Admin", desc: "Controle total da base e permissões" }
                  ].map(c => {
                    const isSelected = vincularCargo === c.id;
                    const accentColor = vincularModalBase.color || "#8B5CF6";

                    return (
                      <div
                        key={c.id}
                        onClick={() => setVincularCargo(c.id)}
                        style={{
                          padding: "12px 14px", borderRadius: "16px",
                          background: isSelected
                            ? `linear-gradient(135deg, ${accentColor}28 0%, ${accentColor}10 100%)`
                            : "rgba(255, 255, 255, 0.03)",
                          border: `1.5px solid ${isSelected ? accentColor : "rgba(255, 255, 255, 0.1)"}`,
                          boxShadow: isSelected ? `0 8px 20px ${accentColor}30, 0 0 15px ${accentColor}20` : "none",
                          cursor: "pointer", display: "flex", flexDirection: "column", gap: "4px",
                          transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)", position: "relative"
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.07)";
                            e.currentTarget.style.borderColor = `${accentColor}50`;
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                            e.currentTarget.style.transform = "translateY(0)";
                          }
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "13px", fontWeight: "900", color: isSelected ? "#FFF" : "#CBD5E1" }}>
                            {c.label}
                          </span>
                          <div style={{
                            width: "18px", height: "18px", borderRadius: "50%",
                            border: `2px solid ${isSelected ? accentColor : "rgba(255,255,255,0.3)"}`,
                            background: isSelected ? accentColor : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: isSelected ? `0 0 10px ${accentColor}` : "none"
                          }}>
                            {isSelected && <Check size={11} style={{ color: "#FFF" }} />}
                          </div>
                        </div>
                        <span style={{ fontSize: "11px", color: isSelected ? "#94A3B8" : "#64748B", fontWeight: "600" }}>{c.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RESUMO EM TEMPO REAL DO VÍNCULO */}
              {(() => {
                const selUser = usuariosBases.find(u => String(u.id) === String(vincularSelectedUserId));
                const cargoLabel = vincularCargo === "usuario" ? "🎓 Aluno / Estudante" : "👑 Admin";
                
                return (
                  <div style={{
                    padding: "12px 14px", borderRadius: "14px",
                    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)",
                    border: `1px solid ${vincularModalBase.color || '#3B82F6'}40`,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                  }}>
                    <div style={{ fontSize: "10px", fontWeight: "900", color: vincularModalBase.color || '#3B82F6', textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                      ⚡ Resumo do Vínculo
                    </div>
                    <div style={{ fontSize: "12px", color: "#F1F5F9", fontWeight: "600", lineHeight: "1.4" }}>
                      {selUser ? (
                        <>
                          Aluno <strong style={{ color: "#FFF" }}>{selUser.nome}</strong> (#ID: {selUser.id}) ➔ Base <strong style={{ color: vincularModalBase.color || '#3B82F6' }}>{vincularModalBase.nome}</strong> como <span style={{ color: "#F59E0B", fontWeight: "800" }}>{cargoLabel}</span>.
                        </>
                      ) : (
                        <span style={{ color: "#94A3B8" }}>Selecione um aluno acima para visualizar o resumo do vínculo.</span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className={styles.modalFooter} style={{ marginTop: "22px" }}>
              <button
                className={styles.btnModalEntrar}
                style={{
                  width: "100%",
                  background: `linear-gradient(135deg, ${vincularModalBase.color || '#3B82F6'} 0%, #8B5CF6 100%)`,
                  boxShadow: `0 8px 25px ${vincularModalBase.color || '#3B82F6'}50`,
                  borderRadius: "14px", padding: "13px 20px",
                  fontSize: "14px", fontWeight: "900"
                }}
                onClick={() => {
                  if (!vincularSelectedUserId) {
                    showToast("⚠️ Escolha um aluno na lista para vincular.");
                    return;
                  }

                  const targetUser = usuariosBases.find(u => String(u.id) === String(vincularSelectedUserId));
                  if (targetUser) {
                    const vinculosExistentes = Array.isArray(targetUser.vinculos_bases) ? targetUser.vinculos_bases : [];
                    const vinculoNovo = {
                      base_nome: vincularModalBase.nome,
                      cargo: vincularCargo,
                      plano: vincularPlano,
                      trilha: vincularTrilha
                    };

                    // Atualiza ou adiciona vínculo da base
                    const vinculosAtualizados = [
                      ...vinculosExistentes.filter(v => (v.base_nome || "").toLowerCase() !== vincularModalBase.nome.toLowerCase()),
                      vinculoNovo
                    ];

                    // Atualiza backend se houver conexão
                    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                    fetch(`${apiUrl}/auth/users/${targetUser.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                      body: JSON.stringify({
                        base_nome: vincularModalBase.nome,
                        cargo: vincularCargo,
                        plano: vincularPlano,
                        vinculos_bases: vinculosAtualizados
                      })
                    }).catch(() => {});

                    // Atualiza estado local
                    setUsuariosBases(prev => prev.map(u => String(u.id) === String(targetUser.id) ? {
                      ...u,
                      base_nome: vincularModalBase.nome,
                      cargo: vincularCargo,
                      plano: vincularPlano,
                      vinculos_bases: vinculosAtualizados
                    } : u));

                    showToast(`🎉 ${targetUser.nome} (#ID: ${targetUser.id}) vinculado a ${vincularModalBase.nome} com permissão personalizada!`);
                    setVincularModalBase(null);
                    setVincularSelectedUserId("");
                    setStudentDropdownOpen(false);
                  }
                }}
              >
                <span>Vincular Aluno à Base Agora 🔗</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EXIBIÇÃO E BUSCA DE ALUNOS DE UMA BASE */}
      {alunosModalBase && (() => {
        const b = alunosModalBase;
        const cardColor = b.cor || b.color || "#3B82F6";
        const cardGradient = b.gradient || `linear-gradient(135deg, ${cardColor} 0%, ${cardColor}aa 100%)`;
        const cardIcon = b.icon || "🚀";
        const targetNome = (b.nome || "").toLowerCase().trim();
        const targetId = (b.id || "").toLowerCase().trim();
        const isDevHubBase = targetId === "devhub" || targetNome === "devhub";

        const list = usuariosBases.filter(u => {
          let matchBase = false;
          if (b.id === "todas" || isDevHubBase) {
            matchBase = true;
          } else {
            const uBase = (u.base_nome || u.base || "").toLowerCase().trim();
            if (uBase === targetId || uBase === targetNome) {
              matchBase = true;
            } else if (Array.isArray(u.vinculos_bases)) {
              matchBase = u.vinculos_bases.some(v => (v.base_nome || "").toLowerCase().trim() === targetNome);
            }
          }
          const q = modalSearchStudent.toLowerCase().trim();
          const matchSearch = !q || String(u.id).includes(q) || (u.nome || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
          return matchBase && matchSearch;
        });

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

        return (
          <div
            onClick={() => setAlunosModalBase(null)}
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
                background: "linear-gradient(165deg, #131728 0%, #0A0D18 100%)",
                border: `1px solid ${cardColor}50`,
                boxShadow: `0 25px 70px rgba(0,0,0,0.95), 0 0 50px ${cardColor}30`,
                borderRadius: "24px", padding: "28px", position: "relative"
              }}
            >
              {/* Botão Fechar X */}
              <button
                onClick={() => setAlunosModalBase(null)}
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
                    <h3 style={{ fontSize: "1.3rem", fontWeight: "900", color: "#FFF", margin: 0 }}>
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
                  <p style={{ fontSize: "0.85rem", color: "#94A3B8", margin: "3px 0 0 0" }}>
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
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px", padding: "10px 14px"
                }}>
                  <Search size={16} color="#94A3B8" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou e-mail..."
                    value={modalSearchStudent}
                    onChange={(e) => setModalSearchStudent(e.target.value)}
                    style={{
                      width: "100%", background: "transparent", border: "none", outline: "none",
                      color: "#FFF", fontSize: "0.9rem", fontFamily: "inherit"
                    }}
                  />
                  {modalSearchStudent && (
                    <button
                      onClick={() => setModalSearchStudent("")}
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
                  <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "#FFF" }}>
                    {list.length} {list.length === 1 ? "Usuário" : "Usuários"}
                  </span>
                </div>
              </div>

              {/* Lista de Usuários (Scrollable) */}
              <div style={{
                flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px",
                paddingRight: "4px", minHeight: "220px", maxHeight: "420px"
              }}>
                {list.length === 0 ? (
                  <div style={{
                    textAlign: "center", padding: "40px 20px",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "16px", border: "1px dashed rgba(255,255,255,0.1)"
                  }}>
                    <Users size={36} color="#475569" style={{ marginBottom: "10px" }} />
                    <p style={{ margin: 0, fontWeight: "700", color: "#CBD5E1", fontSize: "0.95rem" }}>
                      {modalSearchStudent ? "Nenhum usuário encontrado na busca." : "Nenhum usuário vinculado a esta base ainda."}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.82rem", color: "#64748B" }}>
                      {modalSearchStudent ? "Tente pesquisar por outro termo." : "Os usuários vinculados a esta base aparecerão aqui."}
                    </p>
                  </div>
                ) : (
                  list.map(u => {
                    const cargoBadge = u.cargo === "superadmin"
                      ? { label: "Super Admin 👑", bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.3)", color: "#F59E0B" }
                      : u.cargo === "admin"
                      ? { label: "Admin 🛡️", bg: "rgba(59, 130, 246, 0.15)", border: "rgba(59, 130, 246, 0.3)", color: "#3B82F6" }
                      : { label: "Estudante 🎓", bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.3)", color: "#10B981" };

                    return (
                      <div
                        key={u.id}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                          padding: "12px 16px", borderRadius: "14px",
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.07)",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                          e.currentTarget.style.borderColor = `${cardColor}40`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.07)";
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
                                color: "#FFF",
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                              }}>
                                {u.nome || "Sem Nome"}
                              </span>
                              <span style={{
                                fontSize: "0.72rem", fontWeight: "800", padding: "3px 9px", borderRadius: "8px",
                                background: cargoBadge.bg, border: `1px solid ${cargoBadge.border}`, color: cargoBadge.color,
                                whiteSpace: "nowrap"
                              }}>
                                {cargoBadge.label}
                              </span>
                            </div>
                            <span style={{
                              fontSize: "0.8rem", color: "#94A3B8",
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block"
                            }}>
                              {u.email}
                            </span>
                          </div>
                        </div>

                        {/* Opções do Aluno (3 pontinhos para alterar cargo / desvincular) */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                          {isAdminUser && (
                            <button
                              type="button"
                              onClick={() => handleAbrirPermissoes(u, b)}
                              title="Opções do aluno (Alterar cargo / Desvincular)"
                              style={{
                                width: "34px", height: "34px", borderRadius: "10px",
                                background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.12)",
                                color: "#CBD5E1", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.2s ease"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(139, 92, 246, 0.25)";
                                e.currentTarget.style.borderColor = "#8B5CF6";
                                e.currentTarget.style.color = "#FFF";
                                e.currentTarget.style.boxShadow = "0 0 12px rgba(139, 92, 246, 0.4)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                                e.currentTarget.style.color = "#CBD5E1";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              <MoreVertical size={18} />
                            </button>
                          )}
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
                borderTop: "1px solid rgba(255,255,255,0.08)"
              }}>
                {isAdminUser ? (
                  <button
                    onClick={() => {
                      const baseParaVincular = b;
                      setAlunosModalBase(null);
                      setVincularModalBase(baseParaVincular);
                      setVincularSelectedUserId("");
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
                    <span>+ Vincular Novo Aluno</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={() => setAlunosModalBase(null)}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#FFF", padding: "10px 20px", borderRadius: "12px",
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

      {/* MODAL DE GERENCIAMENTO DE PERMISSÕES DO USUÁRIO */}
      {usuarioConfigModal && (
        <div
          className={styles.modalOverlay}
          onClick={handleFecharPermissoes}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            background: "rgba(5, 7, 13, 0.88)",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justify: "center",
            padding: "24px"
          }}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "540px",
              width: "95%",
              background: "linear-gradient(165deg, #131728 0%, #0A0D18 100%)",
              border: "1px solid rgba(99, 102, 241, 0.4)",
              boxShadow: "0 25px 70px rgba(0,0,0,0.9), 0 0 45px rgba(99, 102, 241, 0.25)",
              backdropFilter: "blur(25px)",
              borderRadius: "24px",
              padding: "26px",
              position: "relative"
            }}
          >
            <button className={styles.modalCloseBtn} onClick={handleFecharPermissoes} title="Fechar">
              <X size={18} />
            </button>

            {/* Header do Modal de Permissões */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "22px", color: "#FFF", boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
                flexShrink: 0
              }}>
                ⚙️
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "900", color: "#FFF", margin: 0 }}>
                  Gerenciar Permissões
                </h3>
                <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0, marginTop: "2px" }}>
                  Ajuste a função e o nível de acesso de {usuarioConfigModal.nome}
                </p>
              </div>
            </div>

            {/* Card de Detalhes do Aluno */}
            <div style={{
              display: "flex", alignItems: "center", gap: "14px",
              padding: "14px 16px", borderRadius: "16px",
              background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.1)",
              marginBottom: "20px"
            }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: "900", fontSize: "16px", color: "#FFF", flexShrink: 0
              }}>
                {usuarioConfigModal.nome ? usuarioConfigModal.nome.charAt(0).toUpperCase() : "👤"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "900", color: "#60A5FA", background: "rgba(96, 165, 250, 0.15)", padding: "2px 6px", borderRadius: "6px" }}>
                    #{usuarioConfigModal.id}
                  </span>
                  <span style={{ fontWeight: "800", color: "#FFF", fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {usuarioConfigModal.nome}
                  </span>
                </div>
                <span style={{ fontSize: "12px", color: "#94A3B8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {usuarioConfigModal.email}
                </span>
              </div>
            </div>

            {/* Seleção do Cargo / Função */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: "#CBD5E1", marginBottom: "10px" }}>
                Função do Aluno na Base {usuarioConfigBase?.nome || "do Sistema"}:
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { id: "usuario", label: "🎓 Aluno / Estudante", desc: "Acesso normal às aulas, exames e simulados" },
                  { id: "admin", label: "👑 Admin", desc: "Controle total da base e permissões administrativas" }
                ].map(item => {
                  const isSel = editCargo === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setEditCargo(item.id)}
                      style={{
                        padding: "12px 16px", borderRadius: "14px",
                        background: isSel ? "rgba(99, 102, 241, 0.18)" : "rgba(255, 255, 255, 0.04)",
                        border: `1.5px solid ${isSel ? "#8B5CF6" : "rgba(255, 255, 255, 0.08)"}`,
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                        transition: "all 0.2s ease",
                        boxShadow: isSel ? "0 0 15px rgba(139, 92, 246, 0.25)" : "none"
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "800", color: isSel ? "#FFF" : "#E2E8F0", fontSize: "13px" }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>
                          {item.desc}
                        </div>
                      </div>
                      {isSel && (
                        <div style={{
                          width: "22px", height: "22px", borderRadius: "50%",
                          background: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          <Check size={14} style={{ color: "#FFF" }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Botões de Ação */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => handleDesvincularUsuarioBase(usuarioConfigModal.id, usuarioConfigBase?.nome || usuarioConfigModal.base_nome || "DevHub")}
                style={{
                  padding: "10px 14px", borderRadius: "12px",
                  background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#F87171", fontSize: "12px", fontWeight: "800", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)";
                  e.currentTarget.style.borderColor = "#EF4444";
                  e.currentTarget.style.color = "#FFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
                  e.currentTarget.style.color = "#F87171";
                }}
              >
                <X size={15} />
                <span>Desvincular da Base</span>
              </button>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleFecharPermissoes}
                  style={{
                    padding: "10px 18px", borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.14)",
                    color: "#94A3B8", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSalvarPermissoes}
                  style={{
                    padding: "10px 22px", borderRadius: "12px",
                    background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)", border: "none",
                    color: "#FFF", fontSize: "12.5px", fontWeight: "800", cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)", display: "flex", alignItems: "center", gap: "6px"
                  }}
                >
                  <Check size={16} />
                  <span>Salvar Permissões</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ALTERAÇÃO DE FOTO DA BASE */}
      {modalFotoBase && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalFotoBase(null)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 999999, background: "rgba(5, 7, 13, 0.88)",
            backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px"
          }}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "500px", width: "95%",
              background: "linear-gradient(165deg, #131728 0%, #0A0D18 100%)",
              border: `1.5px solid ${modalFotoBase.color || '#8B5CF6'}60`,
              boxShadow: `0 25px 70px rgba(0,0,0,0.9), 0 0 45px ${modalFotoBase.color || '#8B5CF6'}30`,
              backdropFilter: "blur(25px)", borderRadius: "24px", padding: "26px", position: "relative"
            }}
          >
            <button className={styles.modalCloseBtn} onClick={() => setModalFotoBase(null)} title="Fechar">
              <X size={18} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: modalFotoBase.gradient || "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", color: "#FFF", boxShadow: `0 0 20px ${modalFotoBase.color || '#8B5CF6'}50`, flexShrink: 0
              }}>
                📷
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "900", color: "#FFF", margin: 0 }}>
                  Alterar Foto da Base {modalFotoBase.nome}
                </h3>
                <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0, marginTop: "2px" }}>
                  Cole o link da foto ou selecione uma imagem abaixo para personalização.
                </p>
              </div>
            </div>

            {/* PREVIEW DA FOTO */}
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
              padding: "20px", background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "18px", marginBottom: "20px"
            }}>
              <div style={{
                position: "relative", width: "100px", height: "100px",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <div style={{
                  width: "88px", height: "88px", borderRadius: "50%",
                  background: modalFotoBase.gradient || "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "40px", color: "#FFF", overflow: "hidden",
                  boxShadow: `0 0 25px ${modalFotoBase.color || '#8B5CF6'}60`
                }}>
                  {inputFotoUrl && inputFotoUrl.trim() ? (
                    <img src={inputFotoUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    modalFotoBase.icon || "🚀"
                  )}
                </div>
              </div>
              <span style={{ fontSize: "11px", color: "#94A3B8", fontWeight: "700" }}>
                Preview em Tempo Real no Anel Orbital 3D
              </span>
            </div>

            {/* SELEÇÃO DE ARQUIVO LOCAL (UPLOAD) */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: "#CBD5E1", marginBottom: "8px" }}>
                Escolha uma foto ou imagem do seu computador:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target && event.target.result) {
                        setInputFotoUrl(event.target.result);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                style={{
                  width: "100%", padding: "12px", borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)", border: "1px dashed rgba(59, 130, 246, 0.4)",
                  color: "#94A3B8", fontSize: "13px", cursor: "pointer", boxSizing: "border-box"
                }}
              />
              {inputFotoUrl && (
                <button
                  type="button"
                  onClick={() => setInputFotoUrl("")}
                  style={{
                    marginTop: "8px", background: "none", border: "none", color: "#EF4444",
                    fontSize: "11px", fontWeight: "700", cursor: "pointer", textDecoration: "underline"
                  }}
                >
                  Remover Foto (Usar Ícone Padrão)
                </button>
              )}
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setModalFotoBase(null)}
                style={{
                  padding: "10px 18px", borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.14)",
                  color: "#94A3B8", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSalvarFotoBase}
                style={{
                  padding: "10px 22px", borderRadius: "12px",
                  background: `linear-gradient(135deg, ${modalFotoBase.color || '#8B5CF6'} 0%, #3B82F6 100%)`,
                  border: "none", color: "#FFF", fontSize: "12.5px", fontWeight: "800", cursor: "pointer",
                  boxShadow: `0 4px 15px ${modalFotoBase.color || '#8B5CF6'}50`, display: "flex", alignItems: "center", gap: "6px"
                }}
              >
                <Check size={16} />
                <span>Salvar Foto</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
