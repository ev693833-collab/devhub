import { useState, useEffect } from "react";
import {
  Crown, Shield, GraduationCap, Users, FileText, CheckCircle, BarChart2,
  TrendingUp, Swords, Sparkles, Plus, Trash2, Edit3, Search, RefreshCw,
  BookOpen, Award, Zap, Clock, Activity, AlertTriangle, UserCheck, Eye, EyeOff,
  Bell, Mail, Megaphone, Lock, Unlock, Download, ToggleLeft, ToggleRight,
  Settings, Database, ClipboardList, Flame, Target, Send, BookMarked,
  LayoutDashboard, BarChart, WrenchIcon, Map
} from "lucide-react";

// ─────────────────────────────────────────────────
// Componente auxiliar: Seção com cabeçalho padrão
// ─────────────────────────────────────────────────
function SectionCard({ isDark, icon, gradient, title, subtitle, children, style = {} }) {
  return (
    <div style={{
      backgroundColor: isDark ? "rgba(23, 28, 44, 0.7)" : "#FFFFFF",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0"}`,
      borderRadius: "24px", padding: "26px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      ...style
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "800", margin: 0, color: isDark ? "#FFF" : "#0F172A" }}>{title}</h3>
          {subtitle && <span style={{ fontSize: "0.8rem", color: isDark ? "#94a3b8" : "#64748b" }}>{subtitle}</span>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────
// Componente auxiliar: Input com label
// ─────────────────────────────────────────────────
function FormInput({ isDark, label, type = "text", value, onChange, placeholder, as = "input", children, style = {} }) {
  const baseStyle = {
    width: "100%", padding: "11px 14px", borderRadius: "12px",
    backgroundColor: isDark ? "#0f121d" : "#F8FAFC",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}`,
    color: isDark ? "#FFF" : "#0F172A", fontSize: "0.88rem", outline: "none",
    fontFamily: "inherit", ...style
  };
  return (
    <div>
      {label && <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: isDark ? "#cbd5e1" : "#475569", marginBottom: "6px" }}>{label}</label>}
      {as === "textarea"
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} style={{ ...baseStyle, resize: "vertical" }} />
        : as === "select"
        ? <select value={value} onChange={onChange} style={baseStyle}>{children}</select>
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={baseStyle} />
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
        padding: "12px 22px", background: gradient || "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        color: "#FFF", border: "none", borderRadius: "12px", fontWeight: "800",
        fontSize: "0.9rem", cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: shadow || "0 4px 16px rgba(59,130,246,0.4)",
        display: "flex", alignItems: "center", gap: "8px", opacity: disabled ? 0.6 : 1,
        transition: "all 0.2s", fontFamily: "inherit", ...style
      }}
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
export default function SuperAdminModule({ isDark = true, colors = {}, currentUser = null }) {

  // ── ABA ATIVA ──────────────────────────────────
  const [abaAdmin, setAbaAdmin] = useState("visao-geral");

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
  const [usuarioEditandoId, setUsuarioEditandoId] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(null);

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
    { id: 1, titulo: "Prova Final — JavaScript ES6+", materia: "JavaScript", prazo: "2026-09-15", tipo: "multipla", ativa: true },
    { id: 2, titulo: "Desafio de Algoritmos", materia: "Estruturas de Dados", prazo: "2026-09-20", tipo: "codigo", ativa: true },
    { id: 3, titulo: "Quiz de SQL Avançado", materia: "Banco de Dados", prazo: "2026-09-25", tipo: "multipla", ativa: false }
  ]);
  const [novaProvaTitulo, setNovaProvaTitulo] = useState("");
  const [novaProvaMateria, setNovaProvaMateria] = useState("JavaScript");
  const [novaProvaPrazo, setNovaProvaPrazo] = useState("");
  const [novaProvaTipo, setNovaProvaTipo] = useState("multipla");
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
    fetch(`${apiUrl}/auth/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(data => { setUsuarios(Array.isArray(data) && data.length > 0 ? data : getMockUsuarios()); setLoading(false); })
      .catch(() => { setUsuarios(getMockUsuarios()); setLoading(false); });
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
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/auth/users/${id}/role`, {
      method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ cargo: novoCargo })
    })
      .then(() => { setUsuarios(prev => prev.map(u => u.id === id ? { ...u, cargo: novoCargo } : u)); showToast(`Tag atualizada para "${novoCargo}"!`); })
      .catch(() => { setUsuarios(prev => prev.map(u => u.id === id ? { ...u, cargo: novoCargo } : u)); showToast(`Tag atualizada para "${novoCargo}"!`); });
  };

  const handleDeletarUsuario = (id, nome) => {
    if (!window.confirm(`Excluir a conta de ${nome}?`)) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/auth/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
      .then(() => { setUsuarios(prev => prev.filter(u => u.id !== id)); showToast(`Conta de ${nome} excluída.`); })
      .catch(() => { setUsuarios(prev => prev.filter(u => u.id !== id)); showToast(`Conta de ${nome} excluída.`); });
  };

  const handleSalvarUsuario = (e) => {
    e.preventDefault();
    if (!formNome || !formEmail) { setMensagemErro("Preencha Nome e E-mail."); return; }
    setMensagemErro(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    if (usuarioEditandoId) {
      const body = { nome: formNome, email: formEmail, cargo: formCargo };
      if (formSenha) body.senha = formSenha;
      fetch(`${apiUrl}/auth/users/${usuarioEditandoId}`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body)
      })
        .then(() => { setUsuarios(prev => prev.map(u => u.id === usuarioEditandoId ? { ...u, ...body } : u)); limparForm(); showToast(`Dados de ${formNome} atualizados!`); })
        .catch(() => { setUsuarios(prev => prev.map(u => u.id === usuarioEditandoId ? { ...u, ...body } : u)); limparForm(); showToast(`Dados de ${formNome} atualizados!`); });
    } else {
      fetch(`${apiUrl}/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: formNome, email: formEmail, senha: formSenha || "devhub123", cargo: formCargo })
      })
        .then(() => { setUsuarios(prev => [{ id: Date.now(), nome: formNome, email: formEmail, cargo: formCargo, data: "Agora" }, ...prev]); limparForm(); showToast(`Conta de ${formNome} criada!`); })
        .catch(() => { setUsuarios(prev => [{ id: Date.now(), nome: formNome, email: formEmail, cargo: formCargo, data: "Agora" }, ...prev]); limparForm(); showToast(`Conta de ${formNome} criada!`); });
    }
  };

  const iniciarEdicao = (u) => {
    setUsuarioEditandoId(u.id); setFormNome(u.nome || ""); setFormEmail(u.email || "");
    setFormCargo(u.cargo || "usuario"); setFormSenha(u.senha || "");
    setTimeout(() => document.getElementById("form-criar-editar-usuario")?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  };

  const limparForm = () => { setUsuarioEditandoId(null); setFormNome(""); setFormEmail(""); setFormSenha(""); setFormCargo("usuario"); };

  const getCargoBadge = (cargo) => {
    if (cargo === "superadmin" || cargo === "super_admin") return { label: "👑 Super Admin", bg: "rgba(245,158,11,0.2)", color: "#F59E0B", border: "rgba(245,158,11,0.4)" };
    if (cargo === "admin" || cargo === "gestor") return { label: "🛡️ Admin", bg: "rgba(168,85,247,0.2)", color: "#A855F7", border: "rgba(168,85,247,0.4)" };
    return { label: "🎓 Estudante", bg: "rgba(59,130,246,0.2)", color: "#3B82F6", border: "rgba(59,130,246,0.4)" };
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const q = busca.toLowerCase();
    return u.nome?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.cargo?.toLowerCase().includes(q);
  });

  // ── ABAS DE NAVEGAÇÃO ─────────────────────────
  const abas = [
    { id: "visao-geral", label: "Visão Geral", icon: <LayoutDashboard size={16} /> },
    { id: "comunicacao", label: "Comunicação", icon: <Megaphone size={16} /> },
    { id: "provas", label: "Provas", icon: <FileText size={16} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart size={16} /> },
    { id: "academico", label: "Acadêmico", icon: <GraduationCap size={16} /> },
    { id: "plataforma", label: "Plataforma", icon: <Settings size={16} /> },
    { id: "usuarios", label: "Usuários", icon: <Users size={16} /> },
    { id: "planos", label: "Planos & Acessos", icon: <Shield size={16} /> }
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

  // ─────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* ════════════════ HEADER ════════════════ */}
      <div style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(168,85,247,0.12) 50%, rgba(59,130,246,0.15) 100%)"
          : "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(168,85,247,0.05) 100%)",
        border: "1.5px solid rgba(245,158,11,0.35)",
        borderRadius: "24px", padding: "24px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, #F59E0B, #A855F7, #3B82F6)" }} />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#FFF", fontWeight: "900", fontSize: "0.72rem", padding: "3px 10px", borderRadius: "20px", letterSpacing: "0.5px" }}>VIP CONTROL CENTER</span>
            <span style={{ fontSize: "0.82rem", color: isDark ? "#94a3b8" : "#64748b" }}>Painel de Gestão Avançada DevHub</span>
          </div>
          <h2 style={{ fontSize: "1.7rem", fontWeight: "900", margin: 0, display: "flex", alignItems: "center", gap: "10px", color: isDark ? "#FFF" : "#0F172A" }}>
            <Crown size={30} color="#F59E0B" />
            <span>Central Executiva do Super Admin</span>
          </h2>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={exportarPDFRelatorio} style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none",
            color: "#FFF", padding: "11px 18px", borderRadius: "14px",
            fontWeight: "800", fontSize: "0.88rem", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "8px", fontFamily: "inherit",
            boxShadow: "0 4px 16px rgba(245,158,11,0.4)"
          }}>
            <FileText size={17} /><span>Relatório PDF</span>
          </button>
          <button onClick={carregarUsuarios} style={{
            background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)",
            color: "#F59E0B", padding: "11px 18px", borderRadius: "14px",
            fontWeight: "700", fontSize: "0.88rem", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "8px", fontFamily: "inherit"
          }}>
            <RefreshCw size={17} /><span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* ════════════════ TOAST ════════════════ */}
      <Toast msg={toast.msg} type={toast.type} />

      {/* ════════════════ BARRA DE ABAS ════════════════ */}
      <div style={{
        display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "2px",
        scrollbarWidth: "thin"
      }}>
        {abas.map(aba => {
          const isActive = abaAdmin === aba.id;
          return (
            <button
              key={aba.id}
              onClick={() => setAbaAdmin(aba.id)}
              style={{
                padding: "10px 18px",
                background: isActive
                  ? "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(168,85,247,0.2))"
                  : (isDark ? "rgba(255,255,255,0.04)" : "#F8FAFC"),
                border: `1.5px solid ${isActive ? "rgba(245,158,11,0.6)" : (isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0")}`,
                borderRadius: "14px", color: isActive ? "#F59E0B" : (isDark ? "#94a3b8" : "#64748b"),
                fontWeight: isActive ? "800" : "600", fontSize: "0.85rem",
                cursor: "pointer", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: "7px",
                transition: "all 0.2s", fontFamily: "inherit",
                boxShadow: isActive ? "0 4px 16px rgba(245,158,11,0.2)" : "none"
              }}
            >
              {aba.icon}
              {aba.label}
            </button>
          );
        })}
      </div>

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
                <PrimaryButton gradient="linear-gradient(135deg, #f97316, #ea580c)" shadow="0 4px 16px rgba(249,115,22,0.4)" onClick={() => {
                  if (!anuncioTitulo) return showToast("Digite um título para o anúncio.", "error");
                  const novoItem = {
                    id: Date.now(),
                    titulo: anuncioTitulo,
                    mensagem: anuncioMsg,
                    tipo: anuncioTipo,
                    data: new Date().toLocaleDateString("pt-BR")
                  };
                  const novaLista = [novoItem, ...anunciosEnviados];
                  setAnunciosEnviados(novaLista);
                  try {
                    localStorage.setItem("devhub_anuncios_globais", JSON.stringify(novaLista));

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
                  } catch (e) {}
                  setAnuncioTitulo(""); setAnuncioMsg(""); setAnuncioTipo("info");
                  showToast("📢 Anúncio global publicado para todos os alunos!");
                }}>
                  <Send size={17} /> Publicar Anúncio
                </PrimaryButton>

                {/* Histórico de Anúncios */}
                <div style={{ marginTop: "6px" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: "700", color: isDark ? "#94a3b8" : "#64748b", marginBottom: "10px" }}>HISTÓRICO DE ANÚNCIOS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {anunciosEnviados.map((a, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: "12px", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0"}` }}>
                        <div>
                          <div style={{ fontSize: "0.85rem", fontWeight: "700", color: isDark ? "#FFF" : "#0F172A" }}>{a.titulo}</div>
                          <div style={{ fontSize: "0.75rem", color: isDark ? "#94a3b8" : "#64748b" }}>{a.data} · {a.tipo}</div>
                        </div>
                        <button onClick={() => {
                          const novaLista = anunciosEnviados.filter(x => x.id !== a.id);
                          setAnunciosEnviados(novaLista);
                          try { localStorage.setItem("devhub_anuncios_globais", JSON.stringify(novaLista)); } catch (e) {}
                        }} style={{ background: "rgba(239,68,68,0.12)", border: "none", color: "#EF4444", padding: "6px", borderRadius: "8px", cursor: "pointer" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
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

              {/* E-mail para Turma */}
              <SectionCard isDark={isDark} icon={<Mail size={20} color="#FFF" />} gradient="linear-gradient(135deg, #3b82f6, #1d4ed8)" title="📧 E-mail para a Turma" subtitle="Disparo de e-mail para todos ou grupo selecionado">
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <FormInput isDark={isDark} label="Assunto" value={emailAssunto} onChange={e => setEmailAssunto(e.target.value)} placeholder="Assunto do e-mail..." />
                  <FormInput isDark={isDark} label="Corpo do E-mail" as="textarea" value={emailCorpo} onChange={e => setEmailCorpo(e.target.value)} placeholder="Escreva o conteúdo do e-mail..." style={{ minHeight: "90px" }} />
                  <PrimaryButton gradient="linear-gradient(135deg, #3b82f6, #1d4ed8)" shadow="0 4px 16px rgba(59,130,246,0.4)" onClick={() => {
                    if (!emailAssunto || !emailCorpo) return showToast("Preencha o assunto e o corpo do e-mail.", "error");
                    showToast(`📧 E-mail "${emailAssunto}" disparado para ${usuarios.length} alunos!`);
                    setEmailAssunto(""); setEmailCorpo("");
                  }}>
                    <Send size={17} /> Disparar E-mail
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
            <SectionCard isDark={isDark} icon={<Plus size={20} color="#FFF" />} gradient="linear-gradient(135deg, #10b981, #059669)" title="📝 Criar Nova Prova" subtitle="Monte e publique uma avaliação para a turma">
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <FormInput isDark={isDark} label="Título da Prova" value={novaProvaTitulo} onChange={e => setNovaProvaTitulo(e.target.value)} placeholder="Ex: Prova Final de React.js" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <FormInput isDark={isDark} label="Matéria" as="select" value={novaProvaMateria} onChange={e => setNovaProvaMateria(e.target.value)}>
                    {["JavaScript", "React.js", "Node.js", "Banco de Dados", "Estruturas de Dados", "CSS & HTML"].map(m => <option key={m}>{m}</option>)}
                  </FormInput>
                  <FormInput isDark={isDark} label="Tipo" as="select" value={novaProvaTipo} onChange={e => setNovaProvaTipo(e.target.value)}>
                    <option value="multipla">📋 Múltipla Escolha</option>
                    <option value="codigo">💻 Desafio de Código</option>
                    <option value="discursiva">✍️ Discursiva</option>
                  </FormInput>
                </div>
                <FormInput isDark={isDark} label="Prazo de Entrega" type="date" value={novaProvaPrazo} onChange={e => setNovaProvaPrazo(e.target.value)} />
                <PrimaryButton gradient="linear-gradient(135deg, #10b981, #059669)" shadow="0 4px 16px rgba(16,185,129,0.4)" onClick={() => {
                  if (!novaProvaTitulo || !novaProvaPrazo) return showToast("Preencha o título e o prazo da prova.", "error");
                  setProvas(prev => [{ id: Date.now(), titulo: novaProvaTitulo, materia: novaProvaMateria, prazo: novaProvaPrazo, tipo: novaProvaTipo, ativa: true }, ...prev]);
                  setNovaProvaTitulo(""); setNovaProvaPrazo("");
                  showToast("✅ Prova criada e publicada com sucesso!");
                }}>
                  <Plus size={17} /> Publicar Prova
                </PrimaryButton>
              </div>
            </SectionCard>

            {/* Lista de Provas */}
            <SectionCard isDark={isDark} icon={<ClipboardList size={20} color="#FFF" />} gradient="linear-gradient(135deg, #f59e0b, #d97706)" title="📋 Provas Cadastradas" subtitle="Gerencie as avaliações existentes">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "400px", overflowY: "auto" }}>
                {provas.map((p) => (
                  <div key={p.id} style={{
                    padding: "14px 16px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                    borderRadius: "14px", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <div>
                        <div style={{ fontSize: "0.9rem", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A" }}>{p.titulo}</div>
                        <div style={{ fontSize: "0.76rem", color: isDark ? "#94a3b8" : "#64748b", marginTop: "3px" }}>
                          {p.materia} · {p.tipo} · Prazo: {p.prazo}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                        <button onClick={() => {
                          setProvas(prev => prev.map(x => x.id === p.id ? { ...x, ativa: !x.ativa } : x));
                          showToast(`Prova ${p.ativa ? "pausada" : "reativada"}!`);
                        }} style={{ background: p.ativa ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.1)", border: "none", color: p.ativa ? "#10B981" : "#EF4444", padding: "7px", borderRadius: "8px", cursor: "pointer" }}>
                          {p.ativa ? <Unlock size={14} /> : <Lock size={14} />}
                        </button>
                        <button onClick={() => { setProvas(prev => prev.filter(x => x.id !== p.id)); showToast("Prova excluída."); }}
                          style={{ background: "rgba(239,68,68,0.12)", border: "none", color: "#EF4444", padding: "7px", borderRadius: "8px", cursor: "pointer" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div style={{ marginTop: "8px" }}>
                      <span style={{ fontSize: "0.74rem", fontWeight: "700", padding: "3px 8px", borderRadius: "8px", backgroundColor: p.ativa ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.1)", color: p.ativa ? "#10B981" : "#EF4444" }}>
                        {p.ativa ? "✅ Ativa" : "🔒 Pausada"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════
          ABA 4 — ANALYTICS AVANÇADO
      ══════════════════════════════════════════════════ */}
      {abaAdmin === "analytics" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "20px" }}>

            {/* Retenção Semanal */}
            <SectionCard isDark={isDark} icon={<Flame size={20} color="#FFF" />} gradient="linear-gradient(135deg, #f97316, #ea580c)" title="🔥 Retenção Semanal" subtitle="Sessões de estudo por aluno nesta semana">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {retencaoSemanal.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `${a.cor}22`, border: `1px solid ${a.cor}55`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", color: a.cor, fontSize: "0.9rem", flexShrink: 0 }}>
                      {a.nome.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.86rem", fontWeight: "700", color: isDark ? "#E2E8F0" : "#334155", marginBottom: "4px" }}>
                        <span>{a.nome}</span>
                        <span style={{ color: a.cor }}>{a.sessoes}x esta semana</span>
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

            {/* Alunos em Risco */}
            <SectionCard isDark={isDark} icon={<AlertTriangle size={20} color="#FFF" />} gradient="linear-gradient(135deg, #ef4444, #dc2626)" title="⚠️ Alunos em Risco" subtitle="Estudantes sem acesso há 7 ou mais dias">
              {alunosEmRisco.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#10B981", fontWeight: "700" }}>✅ Nenhum aluno em risco esta semana!</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {alunosEmRisco.map((a, i) => (
                    <div key={i} style={{
                      padding: "16px", backgroundColor: isDark ? "rgba(239,68,68,0.07)" : "#FEF2F2",
                      border: "1px solid rgba(239,68,68,0.3)", borderRadius: "16px",
                      display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px"
                    }}>
                      <div>
                        <div style={{ fontSize: "0.92rem", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A" }}>{a.nome}</div>
                        <div style={{ fontSize: "0.78rem", color: isDark ? "#94a3b8" : "#64748b" }}>{a.email}</div>
                        <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#EF4444", marginTop: "4px" }}>🚨 {a.diasSemAcesso} dias sem acessar</div>
                      </div>
                      <PrimaryButton gradient="linear-gradient(135deg, #ef4444, #dc2626)" shadow="0 4px 12px rgba(239,68,68,0.3)" onClick={() => showToast(`🔔 Notificação de retorno enviada para ${a.nome}!`)}>
                        <Bell size={15} /> Notificar
                      </PrimaryButton>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          {/* Mapa de Calor */}
          <SectionCard isDark={isDark} icon={<Activity size={20} color="#FFF" />} gradient="linear-gradient(135deg, #a855f7, #7c3aed)" title="🗺️ Mapa de Calor de Atividade" subtitle="Concentração de acessos por hora × dia da semana">
            <div style={{ overflowX: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: `80px repeat(${mapaCalor.dias.length}, 1fr)`, gap: "4px", minWidth: "500px" }}>
                {/* Cabeçalho dos dias */}
                <div />
                {mapaCalor.dias.map(d => (
                  <div key={d} style={{ textAlign: "center", fontSize: "0.78rem", fontWeight: "700", color: isDark ? "#94a3b8" : "#64748b", paddingBottom: "6px" }}>{d}</div>
                ))}
                {/* Linhas por hora */}
                {mapaCalor.horas.map((h, hi) => (
                  <>
                    <div key={h} style={{ fontSize: "0.75rem", fontWeight: "600", color: isDark ? "#94a3b8" : "#64748b", display: "flex", alignItems: "center", paddingRight: "8px" }}>{h}</div>
                    {mapaCalor.dados.map((dia, di) => {
                      const val = dia[hi];
                      return (
                        <div key={di} title={`${mapaCalor.dias[di]} ${h}: ${val} acessos`} style={{
                          height: "32px", borderRadius: "6px",
                          backgroundColor: getHeatColor(val),
                          cursor: "pointer", transition: "transform 0.15s",
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          {val > 0 && <span style={{ fontSize: "0.65rem", fontWeight: "800", color: "rgba(255,255,255,0.8)" }}>{val}</span>}
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
              <div style={{ display: "flex", gap: "16px", marginTop: "14px", flexWrap: "wrap" }}>
                {[
                  { cor: "rgba(59,130,246,0.15)", label: "1-2 acessos" },
                  { cor: "rgba(99,102,241,0.35)", label: "3-5 acessos" },
                  { cor: "rgba(168,85,247,0.5)", label: "6-8 acessos" },
                  { cor: "rgba(245,158,11,0.7)", label: "9+ acessos" }
                ].map((l, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: l.cor }} />
                    <span style={{ fontSize: "0.75rem", color: isDark ? "#94a3b8" : "#64748b" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </>
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <FormInput isDark={isDark} label="Matéria" as="select" value={notaMateria} onChange={e => setNotaMateria(e.target.value)}>
                    {["JavaScript", "React.js", "Node.js", "Banco de Dados", "Estruturas de Dados"].map(m => <option key={m}>{m}</option>)}
                  </FormInput>
                  <FormInput isDark={isDark} label="Nota (0-10)" type="number" value={notaValor} onChange={e => setNotaValor(e.target.value)} placeholder="Ex: 8.5" />
                </div>
                <FormInput isDark={isDark} label="Observação (opcional)" as="textarea" value={notaObservacao} onChange={e => setNotaObservacao(e.target.value)} placeholder="Justificativa da nota..." style={{ minHeight: "70px" }} />
                <PrimaryButton gradient="linear-gradient(135deg, #f59e0b, #d97706)" shadow="0 4px 16px rgba(245,158,11,0.4)" onClick={() => {
                  if (!notaAluno || !notaValor) return showToast("Selecione o aluno e informe a nota.", "error");
                  setNotasLancadas(prev => [{ aluno: notaAluno, materia: notaMateria, nota: parseFloat(notaValor), obs: notaObservacao, data: "Agora" }, ...prev]);
                  showToast(`✅ Nota ${notaValor} lançada para ${notaAluno} em ${notaMateria}!`);
                  setNotaAluno(""); setNotaValor(""); setNotaObservacao("");
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

              {/* Trilha Individual */}
              <SectionCard isDark={isDark} icon={<Map size={20} color="#FFF" />} gradient="linear-gradient(135deg, #6366f1, #4f46e5)" title="🗺️ Definir Trilha Individual" subtitle="Personalizar o roteiro de estudos de um aluno">
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <FormInput isDark={isDark} label="Aluno" as="select" value={trilhaAluno} onChange={e => setTrilhaAluno(e.target.value)}>
                    <option value="">— Selecione o aluno —</option>
                    {usuarios.map(u => <option key={u.id} value={u.nome}>{u.nome}</option>)}
                  </FormInput>
                  <FormInput isDark={isDark} label="Próximo Tópico / Foco" value={trilhaTema} onChange={e => setTrilhaTema(e.target.value)} placeholder="Ex: Closures e Prototype em JS" />
                  <FormInput isDark={isDark} label="Meta de XP Semanal" type="number" value={trilhaMeta} onChange={e => setTrilhaMeta(e.target.value)} placeholder="Ex: 500" />
                  <PrimaryButton gradient="linear-gradient(135deg, #6366f1, #4f46e5)" shadow="0 4px 16px rgba(99,102,241,0.4)" onClick={() => {
                    if (!trilhaAluno || !trilhaTema) return showToast("Selecione o aluno e defina o foco.", "error");

                    try {
                      const savedTrilhas = localStorage.getItem("devhub_trilhas_individuais");
                      const mapa = savedTrilhas ? JSON.parse(savedTrilhas) : {};
                      mapa[trilhaAluno] = {
                        tema: trilhaTema,
                        metaXp: trilhaMeta || 500,
                        data: new Date().toLocaleDateString("pt-BR"),
                        instrutor: user?.nome || "Super Admin"
                      };
                      localStorage.setItem("devhub_trilhas_individuais", JSON.stringify(mapa));

                      const savedNotifs = localStorage.getItem("devhub_notifications");
                      const notifsList = savedNotifs ? JSON.parse(savedNotifs) : [];
                      const novaNotif = {
                        id: Date.now(),
                        alunoAlvo: trilhaAluno,
                        titulo: "🎯 Nova Trilha Individual Definida!",
                        mensagem: `Seu professor definiu um novo foco de estudos: "${trilhaTema}" com meta de ${trilhaMeta || 500} XP/semana.`,
                        tipo: "trilha",
                        data: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
                        lida: false
                      };
                      localStorage.setItem("devhub_notifications", JSON.stringify([novaNotif, ...notifsList]));
                      window.dispatchEvent(new Event("storage"));
                    } catch (e) {}

                    showToast(`🗺️ Trilha personalizada definida para ${trilhaAluno}!`);
                    setTrilhaAluno(""); setTrilhaTema(""); setTrilhaMeta("");
                  }}>
                    <Target size={17} /> Salvar Trilha
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
                    onClick={() => { setModoManutencao(!modoManutencao); showToast(modoManutencao ? "✅ Modo manutenção desativado!" : "🔧 Modo manutenção ativado!"); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: modoManutencao ? "#EF4444" : "#10B981" }}
                  >
                    {modoManutencao ? <ToggleRight size={42} /> : <ToggleLeft size={42} />}
                  </button>
                </div>

                <FormInput isDark={isDark} label="Mensagem de Manutenção" as="textarea" value={msgManutencao} onChange={e => setMsgManutencao(e.target.value)} style={{ minHeight: "80px" }} />

                {modoManutencao && (
                  <div style={{ padding: "14px", backgroundColor: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "14px" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "#EF4444", marginBottom: "6px" }}>PREVIEW DO BANNER:</div>
                    <div style={{ fontSize: "0.85rem", color: isDark ? "#FCA5A5" : "#7F1D1D" }}>🔧 {msgManutencao}</div>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Exportar Dados */}
            <SectionCard isDark={isDark} icon={<Database size={20} color="#FFF" />} gradient="linear-gradient(135deg, #10b981, #059669)" title="💾 Exportar Relatório & Dados da Turma" subtitle="Gerar relatório em PDF com visual executivo ou backups em CSV/JSON">
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ padding: "16px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: "14px", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}` }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: "700", color: isDark ? "#FFF" : "#0F172A", marginBottom: "10px" }}>📦 Conteúdo dos arquivos:</div>
                  {["Relatório Gerencial completo em PDF estilizado", "Dados cadastrais e e-mails de todos os alunos", "Desempenho por matéria e taxas de aprovação", "Registros da Arena 1v1 e provas diárias"].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: isDark ? "#94a3b8" : "#64748b", marginBottom: "6px" }}>
                      <CheckCircle size={14} color="#10B981" />
                      {item}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <PrimaryButton style={{ flex: 1, justifyContent: "center" }} gradient="linear-gradient(135deg, #10b981, #059669)" shadow="0 4px 16px rgba(16,185,129,0.4)" onClick={exportarCSV}>
                    <Download size={17} /> Exportar CSV
                  </PrimaryButton>
                  <PrimaryButton style={{ flex: 1, justifyContent: "center" }} gradient="linear-gradient(135deg, #6366f1, #4f46e5)" shadow="0 4px 16px rgba(99,102,241,0.4)" onClick={exportarJSON}>
                    <Download size={17} /> Exportar JSON
                  </PrimaryButton>
                </div>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "20px" }}>

          {/* Tabela de Usuários */}
          <SectionCard isDark={isDark} icon={<Crown size={20} color="#FFF" />} gradient="linear-gradient(135deg, #F59E0B, #D97706)" title={`👥 Usuários no Banco (${usuariosFiltrados.length})`} subtitle="Gerencie e altere as tags de todos os membros">
            <div style={{ marginBottom: "14px" }}>
              <div style={{ position: "relative" }}>
                <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: isDark ? "#64748b" : "#94a3b8" }} />
                <input
                  type="text" placeholder="Buscar por nome, e-mail ou tag..."
                  value={busca} onChange={e => setBusca(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: "12px", backgroundColor: isDark ? "#0f121d" : "#F8FAFC", border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}`, color: isDark ? "#FFF" : "#0F172A", fontSize: "0.86rem", outline: "none", fontFamily: "inherit" }}
                />
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: isDark ? "#94a3b8" : "#64748b" }}>Carregando usuários...</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "420px", overflowY: "auto" }}>
                {usuariosFiltrados.map(u => {
                  const badge = getCargoBadge(u.cargo);
                  return (
                    <div key={u.id} style={{ backgroundColor: isDark ? "rgba(255,255,255,0.025)" : "#F8FAFC", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0"}`, borderRadius: "16px", padding: "13px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: badge.bg, border: `1px solid ${badge.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", color: badge.color, fontSize: "0.9rem" }}>
                          {u.nome ? u.nome.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.9rem", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A" }}>{u.nome}</div>
                          <div style={{ fontSize: "0.76rem", color: isDark ? "#94a3b8" : "#64748b" }}>{u.email}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <select value={u.cargo || "usuario"} onChange={e => handleAlterarCargo(u.id, e.target.value)} style={{ backgroundColor: isDark ? "#0f121d" : "#FFF", color: badge.color, border: `1px solid ${badge.border}`, borderRadius: "10px", padding: "6px 10px", fontSize: "0.8rem", fontWeight: "800", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                          <option value="usuario">🎓 Estudante</option>
                          <option value="admin">🛡️ Admin</option>
                          <option value="superadmin">👑 Super Admin</option>
                        </select>
                        <button onClick={() => iniciarEdicao(u)} title="Editar" style={{ background: "rgba(59,130,246,0.15)", border: "none", color: "#3B82F6", padding: "8px", borderRadius: "8px", cursor: "pointer" }}><Edit3 size={14} /></button>
                        <button onClick={() => handleDeletarUsuario(u.id, u.nome)} title="Excluir" style={{ background: "rgba(239,68,68,0.15)", border: "none", color: "#EF4444", padding: "8px", borderRadius: "8px", cursor: "pointer" }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* Formulário de Criar/Editar */}
          <div id="form-criar-editar-usuario" style={{
            backgroundColor: isDark ? "rgba(23, 28, 44, 0.7)" : "#FFFFFF",
            border: `1.5px solid ${usuarioEditandoId ? "rgba(245,158,11,0.5)" : (isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0")}`,
            borderRadius: "24px", padding: "26px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", transition: "all 0.3s"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: usuarioEditandoId ? "linear-gradient(135deg, #F59E0B, #D97706)" : "linear-gradient(135deg, #3b82f6, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {usuarioEditandoId ? <Edit3 size={19} color="#FFF" /> : <Plus size={19} color="#FFF" />}
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", margin: 0, color: isDark ? "#FFF" : "#0F172A" }}>
                {usuarioEditandoId ? `✏️ Editando: ${formNome}` : "➕ Criar Nova Conta"}
              </h3>
            </div>

            {mensagemErro && (
              <div style={{ backgroundColor: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", color: "#ef4444", padding: "10px 14px", borderRadius: "12px", fontSize: "0.84rem", marginBottom: "14px", fontWeight: "700" }}>{mensagemErro}</div>
            )}

            <form onSubmit={handleSalvarUsuario} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <FormInput isDark={isDark} label="Nome Completo" value={formNome} onChange={e => setFormNome(e.target.value)} placeholder="Nome completo do aluno..." />
              <FormInput isDark={isDark} label="E-mail" type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="Email de acesso..." />
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: isDark ? "#cbd5e1" : "#475569", marginBottom: "6px" }}>Senha {usuarioEditandoId && "(ou mantenha a existente)"}</label>
                <div style={{ position: "relative" }}>
                  <input type={mostrarSenha ? "text" : "password"} value={formSenha} onChange={e => setFormSenha(e.target.value)} placeholder={usuarioEditandoId ? "Nova senha (opcional)..." : "Senha de acesso..."}
                    style={{ width: "100%", padding: "11px 40px 11px 14px", borderRadius: "12px", backgroundColor: isDark ? "#0f121d" : "#F8FAFC", border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}`, color: isDark ? "#FFF" : "#0F172A", fontSize: "0.88rem", outline: "none", fontFamily: "inherit" }} />
                  <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: isDark ? "#94a3b8" : "#64748b", cursor: "pointer", padding: "4px" }}>
                    {mostrarSenha ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              <FormInput isDark={isDark} label="Cargo / Permissão" as="select" value={formCargo} onChange={e => setFormCargo(e.target.value)}>
                <option value="usuario">🎓 Estudante</option>
                <option value="admin">🛡️ Administrador</option>
                <option value="superadmin">👑 Super Admin</option>
              </FormInput>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button type="submit" style={{ flex: 1, padding: "13px", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "#FFF", border: "none", borderRadius: "12px", fontWeight: "800", fontSize: "0.9rem", cursor: "pointer", boxShadow: "0 4px 16px rgba(59,130,246,0.4)", fontFamily: "inherit" }}>
                  {usuarioEditandoId ? "Atualizar Conta" : "Cadastrar Conta"}
                </button>
                {usuarioEditandoId && (
                  <button type="button" onClick={limparForm} style={{ padding: "13px 16px", backgroundColor: "rgba(255,255,255,0.08)", color: isDark ? "#94a3b8" : "#475569", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          ABA 8 — PLANOS & ACESSOS DOS ALUNOS
      ══════════════════════════════════════════════════ */}
      {abaAdmin === "planos" && (
        <SectionCard isDark={isDark} icon={<Shield size={20} color="#FFF" />} gradient="linear-gradient(135deg, #6366f1, #4f46e5)" title="🔓 Gestão de Planos & Liberação de Módulos" subtitle="Defina o Plano de cada aluno ou altere individualmente a liberação de cada módulo do sistema (exclusivo para SuperAdmin)">
          {/* Banner Informativo dos Planos */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "20px" }}>
            {Object.values(PLANOS_ALUNOS).map(p => (
              <div key={p.id} style={{
                padding: "12px 16px",
                borderRadius: "12px",
                backgroundColor: p.bg,
                border: `1px solid ${p.border}`,
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}>
                <div style={{ fontWeight: "800", color: p.cor, fontSize: "0.95rem" }}>{p.badge}</div>
                <div style={{ fontSize: "0.78rem", color: isDark ? "#cbd5e1" : "#475569" }}>{p.descricao}</div>
              </div>
            ))}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "10px 14px", color: isDark ? "#94a3b8" : "#64748b", fontWeight: "700", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}` }}>Aluno</th>
                  <th style={{ textAlign: "left", padding: "10px 14px", color: isDark ? "#94a3b8" : "#64748b", fontWeight: "700", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}` }}>Plano Atual</th>
                  {modulos.map(m => (
                    <th key={m} style={{ padding: "10px 14px", textAlign: "center", color: isDark ? "#94a3b8" : "#64748b", fontWeight: "700", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}` }}>{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => {
                  const planoKey = planosAlunos[u.id] || planosAlunos[u.email?.toLowerCase()] || planosAlunos[u.nome?.toLowerCase()] || "dev_master";
                  const planoAtual = PLANOS_ALUNOS[planoKey] || PLANOS_ALUNOS.dev_master;

                  return (
                    <tr key={u.id}>
                      <td style={{ padding: "10px 14px", fontWeight: "700", color: isDark ? "#E2E8F0" : "#0F172A", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9"}` }}>{u.nome}</td>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9"}` }}>
                        <select
                          value={planoKey}
                          onChange={(e) => handleChangePlanoAluno(u.id, u.nome, e.target.value)}
                          style={{
                            backgroundColor: planoAtual.bg,
                            color: planoAtual.cor,
                            border: `1px solid ${planoAtual.border}`,
                            borderRadius: "10px",
                            padding: "5px 10px",
                            fontSize: "0.8rem",
                            fontWeight: "800",
                            cursor: "pointer",
                            outline: "none",
                            fontFamily: "inherit"
                          }}
                        >
                          <option value="dev_start">🌱 Dev Start</option>
                          <option value="dev_plus">⚡ Dev Plus</option>
                          <option value="dev_master">👑 Dev Master</option>
                        </select>
                      </td>
                      {modulos.map(m => {
                        const liberado = modulosLiberados[u.id]?.[m] !== false;
                        return (
                          <td key={m} style={{ textAlign: "center", padding: "10px", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9"}` }}>
                            <button
                              onClick={() => handleToggleModulo(u.id, u.nome, m, liberado)}
                              title={liberado ? `Trancar ${m} para ${u.nome}` : `Liberar ${m} para ${u.nome}`}
                              style={{ background: "none", border: "none", cursor: "pointer", color: liberado ? "#10B981" : "#EF4444", padding: "4px", transition: "transform 0.15s ease" }}
                            >
                              {liberado ? <Unlock size={18} /> : <Lock size={18} />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

    </div>
  );
}
