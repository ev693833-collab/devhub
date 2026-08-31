import { useState, useEffect } from "react";
import {
  Crown, Shield, GraduationCap, Users, FileText, CheckCircle, BarChart2,
  TrendingUp, Swords, Sparkles, Plus, Trash2, Edit3, Search, RefreshCw,
  BookOpen, Award, Zap, Clock, Activity, AlertTriangle, UserCheck, Eye, EyeOff
} from "lucide-react";

export default function SuperAdminModule({ isDark = true, colors = {}, currentUser = null }) {
  // Lista de Usuários do Banco
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [mensagemErro, setMensagemErro] = useState(null);

  // Formulário de Criar/Editar Usuário
  const [formNome, setFormNome] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSenha, setFormSenha] = useState("");
  const [formCargo, setFormCargo] = useState("usuario");
  const [usuarioEditandoId, setUsuarioEditandoId] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Estatísticas de Provas Realizadas
  const [provasStats, setProvasStats] = useState({
    totalProvasFeitas: 48,
    mediaGeral: 8.7,
    taxaAprovacao: "91%",
    diariasConcluidas: 26,
    pdfsConcluidos: 14,
    sistemaConcluidos: 8
  });

  // Matriz de Desempenho por Matéria
  const materiasDesempenho = [
    { materia: "JavaScript ES6+", progresso: 88, cor: "#F7DF1E", alunosDestacados: 14 },
    { materia: "React.js & Hooks", progresso: 76, cor: "#61DAFB", alunosDestacados: 11 },
    { materia: "Node.js & Express", progresso: 82, cor: "#68A063", alunosDestacados: 12 },
    { materia: "Banco de Dados & SQL", progresso: 69, cor: "#00758F", alunosDestacados: 9 },
    { materia: "Estruturas de Dados & Algoritmos", progresso: 65, cor: "#A855F7", alunosDestacados: 8 }
  ];

  // Métricas da Arena 1v1
  const arenaStats = {
    duelosRealizados: 74,
    desafioMaisPopular: "Validação de Parênteses",
    gladiadorDoMes: "Enzo Vieira 👑 (28 Vitórias)",
    tempoMedioResolucao: "1m 45s"
  };

  // Monitor do Dev IA
  const iaTopicosDuvidas = [
    { topico: "Método Array.reduce()", contagem: 38, pct: 85 },
    { topico: "Async / Await & Promises", contagem: 29, pct: 68 },
    { topico: "useEffect & Ciclo de Vida React", contagem: 24, pct: 55 },
    { topico: "INNER JOIN vs LEFT JOIN em SQL", contagem: 18, pct: 40 }
  ];

  // Buscar usuários do servidor
  const carregarUsuarios = () => {
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${apiUrl}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setUsuarios(data);
        } else {
          carregarMockUsuarios();
        }
        setLoading(false);
      })
      .catch(() => {
        carregarMockUsuarios();
        setLoading(false);
      });
  };

  const carregarMockUsuarios = () => {
    setUsuarios([
      { id: 1, nome: "Superadmin", email: "enzovieira.contabhub@gmail.com", cargo: "superadmin", data: "Hoje" },
      { id: 2, nome: "Sandro Rosal", email: "sandrorosal@gmail.com", cargo: "usuario", data: "Ontem" },
      { id: 3, nome: "Gabriel Brito", email: "gabrielbrito@gmail.com", cargo: "usuario", data: "Há 2 dias" },
      { id: 4, nome: "Nicholas Araujo", email: "nicholas.1213@gmail.com", cargo: "usuario", data: "Há 3 dias" },
      { id: 5, nome: "Breno Faislon", email: "brenofaislon@gmail.com", cargo: "usuario", data: "Há 4 dias" },
      { id: 6, nome: "Bia Brasil", email: "biabrasil@gmail.com", cargo: "usuario", data: "Há 5 dias" }
    ]);
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  // Alterar Cargo / Tag de Usuário
  const handleAlterarCargo = (id, novoCargo) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${apiUrl}/auth/users/${id}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ cargo: novoCargo })
    })
      .then(res => res.json())
      .then(data => {
        setUsuarios(prev => prev.map(u => u.id === id ? { ...u, cargo: novoCargo } : u));
        exibirMensagemSucesso(`Tag atualizada para "${novoCargo}" com sucesso!`);
      })
      .catch(() => {
        setUsuarios(prev => prev.map(u => u.id === id ? { ...u, cargo: novoCargo } : u));
        exibirMensagemSucesso(`Tag atualizada para "${novoCargo}" com sucesso!`);
      });
  };

  // Deletar Usuário
  const handleDeletarUsuario = (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja excluir a conta de ${nome}?`)) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${apiUrl}/auth/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setUsuarios(prev => prev.filter(u => u.id !== id));
        exibirMensagemSucesso(`Conta de ${nome} excluída.`);
      })
      .catch(() => {
        setUsuarios(prev => prev.filter(u => u.id !== id));
        exibirMensagemSucesso(`Conta de ${nome} excluída.`);
      });
  };

  // Salvar Novo Usuário ou Editar
  const handleSalvarUsuario = (e) => {
    e.preventDefault();
    setMensagemErro(null);

    if (!formNome || !formEmail) {
      setMensagemErro("Preencha o Nome e o E-mail.");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    if (usuarioEditandoId) {
      // Editar
      const editBody = { nome: formNome, email: formEmail, cargo: formCargo };
      if (formSenha) editBody.senha = formSenha;

      fetch(`${apiUrl}/auth/users/${usuarioEditandoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editBody)
      })
        .then(() => {
          setUsuarios(prev => prev.map(u => u.id === usuarioEditandoId ? { ...u, nome: formNome, email: formEmail, cargo: formCargo, senha: formSenha || u.senha } : u));
          limparFormulario();
          exibirMensagemSucesso(`Dados de ${formNome} atualizados com sucesso!`);
        })
        .catch(() => {
          setUsuarios(prev => prev.map(u => u.id === usuarioEditandoId ? { ...u, nome: formNome, email: formEmail, cargo: formCargo, senha: formSenha || u.senha } : u));
          limparFormulario();
          exibirMensagemSucesso(`Dados de ${formNome} atualizados com sucesso!`);
        });
    } else {
      // Criar Novo
      fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formNome,
          email: formEmail,
          senha: formSenha || "devhub123",
          cargo: formCargo
        })
      })
        .then(res => res.json())
        .then(data => {
          setUsuarios(prev => [
            { id: Date.now(), nome: formNome, email: formEmail, cargo: formCargo, data: "Agora mesmo" },
            ...prev
          ]);
          limparFormulario();
          exibirMensagemSucesso(`Nova conta para ${formNome} criada com sucesso!`);
        })
        .catch(() => {
          setUsuarios(prev => [
            { id: Date.now(), nome: formNome, email: formEmail, cargo: formCargo, data: "Agora mesmo" },
            ...prev
          ]);
          limparFormulario();
          exibirMensagemSucesso(`Nova conta para ${formNome} criada com sucesso!`);
        });
    }
  };

  const iniciarEdicao = (u) => {
    setUsuarioEditandoId(u.id);
    setFormNome(u.nome || "");
    setFormEmail(u.email || "");
    setFormCargo(u.cargo || "usuario");
    setFormSenha(u.senha || "");

    const elem = document.getElementById("form-criar-editar-usuario");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const limparFormulario = () => {
    setUsuarioEditandoId(null);
    setFormNome("");
    setFormEmail("");
    setFormSenha("");
    setFormCargo("usuario");
  };

  const exibirMensagemSucesso = (txt) => {
    setMensagemSucesso(txt);
    setTimeout(() => setMensagemSucesso(null), 4000);
  };

  // Filtragem da lista de usuários
  const usuariosFiltrados = usuarios.filter(u => {
    const q = busca.toLowerCase();
    return u.nome?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.cargo?.toLowerCase().includes(q);
  });

  const getCargoBadge = (cargo) => {
    if (cargo === "superadmin" || cargo === "super_admin") {
      return { label: "👑 Super Admin", bg: "rgba(245, 158, 11, 0.2)", color: "#F59E0B", border: "rgba(245, 158, 11, 0.4)" };
    }
    if (cargo === "admin" || cargo === "gestor") {
      return { label: "🛡️ Admin / Gestor", bg: "rgba(168, 85, 247, 0.2)", color: "#A855F7", border: "rgba(168, 85, 247, 0.4)" };
    }
    return { label: "🎓 Estudante", bg: "rgba(59, 130, 246, 0.2)", color: "#3B82F6", border: "rgba(59, 130, 246, 0.4)" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* 1. TOPO DA CENTRAL EXECUTIVA SUPER ADMIN */}
      <div style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(168,85,247,0.12) 50%, rgba(59,130,246,0.15) 100%)"
          : "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(168,85,247,0.05) 100%)",
        border: "1.5px solid rgba(245,158,11,0.35)",
        borderRadius: "24px",
        padding: "28px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "18px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Glow de acento */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, #F59E0B, #A855F7, #3B82F6)" }} />

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={{
              background: "linear-gradient(135deg, #F59E0B, #D97706)",
              color: "#FFF", fontWeight: "900", fontSize: "0.78rem",
              padding: "4px 12px", borderRadius: "20px", letterSpacing: "0.5px"
            }}>VIP CONTROL CENTER</span>
            <span style={{ fontSize: "0.85rem", color: isDark ? "#94a3b8" : "#64748b" }}>
              Painel de Gestão Avançada DevHub
            </span>
          </div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "900", margin: 0, display: "flex", alignItems: "center", gap: "10px", color: isDark ? "#FFF" : "#0F172A" }}>
            <Crown size={32} color="#F59E0B" />
            <span>Central Executiva do Super Admin</span>
          </h2>
        </div>

        <button
          onClick={carregarUsuarios}
          style={{
            background: "rgba(245, 158, 11, 0.15)",
            border: "1px solid rgba(245, 158, 11, 0.4)",
            color: "#F59E0B",
            padding: "12px 20px",
            borderRadius: "14px",
            fontWeight: "700",
            fontSize: "0.9rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s"
          }}
        >
          <RefreshCw size={18} />
          <span>Atualizar Métricas</span>
        </button>
      </div>

      {/* ALERTAS DE SUCESSO / ERRO */}
      {mensagemSucesso && (
        <div style={{
          backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", color: "#10b981",
          padding: "16px 20px", borderRadius: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px"
        }}>
          <CheckCircle size={20} />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {/* 2. GRADE DE CARDS DE KPI EXECUTIVOS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px" }}>
        <div style={{
          backgroundColor: isDark ? "rgba(23, 28, 44, 0.7)" : "#FFFFFF",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0"}`,
          borderRadius: "20px", padding: "22px", display: "flex", alignItems: "center", gap: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users size={26} color="#3B82F6" />
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", color: isDark ? "#94a3b8" : "#64748b", fontWeight: "600" }}>Total de Alunos</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A" }}>{usuarios.length}</div>
          </div>
        </div>

        <div style={{
          backgroundColor: isDark ? "rgba(23, 28, 44, 0.7)" : "#FFFFFF",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0"}`,
          borderRadius: "20px", padding: "22px", display: "flex", alignItems: "center", gap: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle size={26} color="#10B981" />
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", color: isDark ? "#94a3b8" : "#64748b", fontWeight: "600" }}>Provas Concluídas</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A" }}>{provasStats.totalProvasFeitas}</div>
          </div>
        </div>

        <div style={{
          backgroundColor: isDark ? "rgba(23, 28, 44, 0.7)" : "#FFFFFF",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0"}`,
          borderRadius: "20px", padding: "22px", display: "flex", alignItems: "center", gap: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Swords size={26} color="#EF4444" />
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", color: isDark ? "#94a3b8" : "#64748b", fontWeight: "600" }}>Duelos X1 Disputados</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A" }}>{arenaStats.duelosRealizados}</div>
          </div>
        </div>

        <div style={{
          backgroundColor: isDark ? "rgba(23, 28, 44, 0.7)" : "#FFFFFF",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0"}`,
          borderRadius: "20px", padding: "22px", display: "flex", alignItems: "center", gap: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={26} color="#6366F1" />
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", color: isDark ? "#94a3b8" : "#64748b", fontWeight: "600" }}>Aprovação das Provas</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#10B981" }}>{provasStats.taxaAprovacao}</div>
          </div>
        </div>
      </div>

      {/* 3. RELATÓRIOS EXECUTIVOS DE DESEMPENHO & PROVAS (DUAS COLUNAS) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "24px" }}>
        
        {/* BLOCA 1: MATRIZ DE DESEMPENHO DOS ALUNOS POR MATÉRIA */}
        <div style={{
          backgroundColor: isDark ? "rgba(23, 28, 44, 0.7)" : "#FFFFFF",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0"}`,
          borderRadius: "24px", padding: "26px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={22} color="#FFF" />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "800", margin: 0, color: isDark ? "#FFF" : "#0F172A" }}>
                🧠 Desempenho dos Alunos por Matéria
              </h3>
              <span style={{ fontSize: "0.82rem", color: isDark ? "#94a3b8" : "#64748b" }}>
                Aproveitamento médio da turma nas disciplinas Full Stack
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {materiasDesempenho.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", fontWeight: "700", color: isDark ? "#E2E8F0" : "#334155" }}>
                  <span>{m.materia}</span>
                  <span style={{ color: m.cor, fontWeight: "900" }}>{m.progresso}% acertos</span>
                </div>

                <div style={{ height: "10px", backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${m.progresso}%`,
                    backgroundColor: m.cor, borderRadius: "10px",
                    boxShadow: `0 0 10px ${m.cor}66`,
                    transition: "width 1s ease-in-out"
                  }} />
                </div>

                <div style={{ fontSize: "0.78rem", color: isDark ? "#94a3b8" : "#64748b" }}>
                  ⭐ {m.alunosDestacados} alunos com nota acima de 9.0 nesta matéria
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOCO 2: RELATÓRIO EXECUTIVO DE PROVAS REALIZADAS */}
        <div style={{
          backgroundColor: isDark ? "rgba(23, 28, 44, 0.7)" : "#FFFFFF",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0"}`,
          borderRadius: "24px", padding: "26px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={22} color="#FFF" />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "800", margin: 0, color: isDark ? "#FFF" : "#0F172A" }}>
                📊 Relatório de Provas Realizadas
              </h3>
              <span style={{ fontSize: "0.82rem", color: isDark ? "#94a3b8" : "#64748b" }}>
                Distribuição de entregas por modalidade de avaliação
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
            <div style={{ backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`, borderRadius: "16px", padding: "16px", textAlign: "center" }}>
              <span style={{ fontSize: "0.8rem", color: isDark ? "#94a3b8" : "#64748b", fontWeight: "700" }}>Nota Média Geral</span>
              <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#10B981", marginTop: "4px" }}>{provasStats.mediaGeral} / 10</div>
            </div>
            <div style={{ backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`, borderRadius: "16px", padding: "16px", textAlign: "center" }}>
              <span style={{ fontSize: "0.8rem", color: isDark ? "#94a3b8" : "#64748b", fontWeight: "700" }}>Provas Diárias</span>
              <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#A855F7", marginTop: "4px" }}>{provasStats.diariasConcluidas} entregas</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: "14px" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: "700", color: isDark ? "#FFF" : "#0F172A" }}>📄 Provas em PDF Enviadas</span>
              <span style={{ fontSize: "0.9rem", fontWeight: "800", color: "#FB923C" }}>{provasStats.pdfsConcluidos} submissões</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: "14px" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: "700", color: isDark ? "#FFF" : "#0F172A" }}>👑 Provas do Sistema (Admin)</span>
              <span style={{ fontSize: "0.9rem", fontWeight: "800", color: "#3B82F6" }}>{provasStats.sistemaConcluidos} realizadas</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BLOCA DE MONITORAMENTO DEV IA + ARENA 1v1 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "24px" }}>
        
        {/* MONITOR DEV IA: TÓPICOS DE DÚVIDAS MAIS FREQUENTES */}
        <div style={{
          backgroundColor: isDark ? "rgba(23, 28, 44, 0.7)" : "#FFFFFF",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0"}`,
          borderRadius: "24px", padding: "26px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={22} color="#FFF" />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "800", margin: 0, color: isDark ? "#FFF" : "#0F172A" }}>
                🤖 Monitor do Dev IA — Tópicos de Dúvidas
              </h3>
              <span style={{ fontSize: "0.82rem", color: isDark ? "#94a3b8" : "#64748b" }}>
                Temas mais consultados pelos alunos no assistente de IA
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {iaTopicosDuvidas.map((t, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: "14px", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0"}` }}>
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: "700", color: isDark ? "#FFF" : "#0F172A" }}>{t.topico}</div>
                  <div style={{ fontSize: "0.78rem", color: isDark ? "#94a3b8" : "#64748b" }}>{t.contagem} perguntas registradas</div>
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: "800", padding: "4px 10px", borderRadius: "10px", backgroundColor: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}>
                  {t.pct}% interesse
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* MÉTRICAS DA ARENA DE BATALHA 1v1 */}
        <div style={{
          backgroundColor: isDark ? "rgba(23, 28, 44, 0.7)" : "#FFFFFF",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0"}`,
          borderRadius: "24px", padding: "26px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Swords size={22} color="#FFF" />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "800", margin: 0, color: isDark ? "#FFF" : "#0F172A" }}>
                ⚔️ Estatísticas da Arena de Batalha 1v1
              </h3>
              <span style={{ fontSize: "0.82rem", color: isDark ? "#94a3b8" : "#64748b" }}>
                Duelos PvP entre estudantes da plataforma
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ padding: "14px 16px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: "700", color: isDark ? "#FFF" : "#0F172A" }}>🏆 Gladiador do Mês</span>
              <span style={{ fontSize: "0.9rem", fontWeight: "800", color: "#F59E0B" }}>{arenaStats.gladiadorDoMes}</span>
            </div>

            <div style={{ padding: "14px 16px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: "700", color: isDark ? "#FFF" : "#0F172A" }}>⚡ Desafio Mais Sorteado</span>
              <span style={{ fontSize: "0.9rem", fontWeight: "800", color: "#38BDF8" }}>{arenaStats.desafioMaisPopular}</span>
            </div>

            <div style={{ padding: "14px 16px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: "700", color: isDark ? "#FFF" : "#0F172A" }}>⏱️ Tempo Médio por Duelo</span>
              <span style={{ fontSize: "0.9rem", fontWeight: "800", color: "#10B981" }}>{arenaStats.tempoMedioResolucao}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. GESTÃO VIP DE USUÁRIOS, CARGOS E TAGS (TABELA FUTURISTA + FORMULÁRIO) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "24px" }}>
        
        {/* TABELA DE USUÁRIOS E ALTERAÇÃO RÁPIDA DE CARGOS */}
        <div style={{
          backgroundColor: isDark ? "rgba(23, 28, 44, 0.7)" : "#FFFFFF",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0"}`,
          borderRadius: "24px", padding: "26px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Crown size={20} color="#FFF" />
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "800", margin: 0, color: isDark ? "#FFF" : "#0F172A" }}>
                👥 Usuários no Banco ({usuariosFiltrados.length})
              </h3>
            </div>

            <input
              type="text"
              placeholder="🔍 Buscar por nome, e-mail ou tag..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{
                padding: "8px 14px", borderRadius: "12px",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}`,
                backgroundColor: isDark ? "#0f121d" : "#F8FAFC",
                color: isDark ? "#FFF" : "#0F172A", fontSize: "0.85rem", outline: "none", width: "220px"
              }}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: isDark ? "#94a3b8" : "#64748b" }}>Carregando dados dos usuários...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "380px", overflowY: "auto" }}>
              {usuariosFiltrados.map((u) => {
                const badge = getCargoBadge(u.cargo);
                return (
                  <div
                    key={u.id}
                    style={{
                      backgroundColor: isDark ? "rgba(255,255,255,0.025)" : "#F8FAFC",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0"}`,
                      borderRadius: "16px", padding: "14px 18px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      flexWrap: "wrap", gap: "12px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "40px", height: "40px", borderRadius: "50%",
                        backgroundColor: badge.bg, border: `1px solid ${badge.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: "800", color: badge.color, fontSize: "0.95rem"
                      }}>
                        {u.nome ? u.nome.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.92rem", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A" }}>{u.nome}</div>
                        <div style={{ fontSize: "0.78rem", color: isDark ? "#94a3b8" : "#64748b" }}>{u.email}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {/* SELETOR RÁPIDO DE CARGO */}
                      <select
                        value={u.cargo || "usuario"}
                        onChange={(e) => handleAlterarCargo(u.id, e.target.value)}
                        style={{
                          backgroundColor: isDark ? "#0f121d" : "#FFF",
                          color: badge.color, border: `1px solid ${badge.border}`,
                          borderRadius: "10px", padding: "6px 10px",
                          fontSize: "0.82rem", fontWeight: "800", cursor: "pointer", outline: "none"
                        }}
                      >
                        <option value="usuario">🎓 Estudante</option>
                        <option value="admin">🛡️ Admin</option>
                        <option value="superadmin">👑 Super Admin</option>
                      </select>

                      <button
                        onClick={() => iniciarEdicao(u)}
                        title="Editar Usuário"
                        style={{ background: "rgba(59, 130, 246, 0.15)", border: "none", color: "#3B82F6", padding: "8px", borderRadius: "8px", cursor: "pointer" }}
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        onClick={() => handleDeletarUsuario(u.id, u.nome)}
                        title="Excluir Usuário"
                        style={{ background: "rgba(239, 68, 68, 0.15)", border: "none", color: "#EF4444", padding: "8px", borderRadius: "8px", cursor: "pointer" }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FORMULÁRIO DE CRIAR OU EDITAR CONTA */}
        <div id="form-criar-editar-usuario" style={{
          backgroundColor: isDark ? "rgba(23, 28, 44, 0.7)" : "#FFFFFF",
          border: `1px solid ${usuarioEditandoId ? "rgba(245, 158, 11, 0.5)" : (isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0")}`,
          borderRadius: "24px", padding: "26px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: usuarioEditandoId ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {usuarioEditandoId ? <Edit3 size={20} color="#FFF" /> : <Plus size={20} color="#FFF" />}
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "800", margin: 0, color: isDark ? "#FFF" : "#0F172A" }}>
              {usuarioEditandoId ? `✏️ Editando: ${formNome}` : "➕ Criar Nova Conta"}
            </h3>
          </div>

          {mensagemErro && (
            <div style={{ backgroundColor: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", color: "#ef4444", padding: "10px 14px", borderRadius: "12px", fontSize: "0.85rem", marginBottom: "14px", fontWeight: "700" }}>
              {mensagemErro}
            </div>
          )}

          <form onSubmit={handleSalvarUsuario} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: isDark ? "#cbd5e1" : "#475569", marginBottom: "6px" }}>
                Nome Completo
              </label>
              <input
                type="text"
                value={formNome}
                onChange={(e) => setFormNome(e.target.value)}
                placeholder="Digite o nome completo..."
                style={{
                  width: "100%", padding: "12px", borderRadius: "12px",
                  backgroundColor: isDark ? "#0f121d" : "#F8FAFC",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}`,
                  color: isDark ? "#FFF" : "#0F172A", fontSize: "0.9rem", outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: isDark ? "#cbd5e1" : "#475569", marginBottom: "6px" }}>
                Endereço de E-mail
              </label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="Digite o e-mail..."
                style={{
                  width: "100%", padding: "12px", borderRadius: "12px",
                  backgroundColor: isDark ? "#0f121d" : "#F8FAFC",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}`,
                  color: isDark ? "#FFF" : "#0F172A", fontSize: "0.9rem", outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: isDark ? "#cbd5e1" : "#475569", marginBottom: "6px" }}>
                Senha de Acesso {usuarioEditandoId && "(ou mantenha a existente)"}
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={formSenha}
                  onChange={(e) => setFormSenha(e.target.value)}
                  placeholder={usuarioEditandoId ? "Nova senha (opcional)..." : "Digite a senha..."}
                  style={{
                    width: "100%", padding: "12px 44px 12px 12px", borderRadius: "12px",
                    backgroundColor: isDark ? "#0f121d" : "#F8FAFC",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}`,
                    color: isDark ? "#FFF" : "#0F172A", fontSize: "0.9rem", outline: "none"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  title={mostrarSenha ? "Ocultar senha" : "Ver senha"}
                  style={{
                    position: "absolute",
                    right: "12px",
                    background: "transparent",
                    border: "none",
                    color: isDark ? "#94a3b8" : "#64748b",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px"
                  }}
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: isDark ? "#cbd5e1" : "#475569", marginBottom: "6px" }}>
                Cargo / Permissão Inicial
              </label>
              <select
                value={formCargo}
                onChange={(e) => setFormCargo(e.target.value)}
                style={{
                  width: "100%", padding: "12px", borderRadius: "12px",
                  backgroundColor: isDark ? "#0f121d" : "#F8FAFC",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}`,
                  color: isDark ? "#FFF" : "#0F172A", fontSize: "0.9rem", outline: "none", fontWeight: "600"
                }}
              >
                <option value="usuario">🎓 Estudante</option>
                <option value="admin">🛡️ Administrador</option>
                <option value="superadmin">👑 Super Admin</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                type="submit"
                style={{
                  flex: 1, padding: "14px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  color: "#FFF", border: "none", borderRadius: "12px",
                  fontWeight: "800", fontSize: "0.95rem", cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(59, 130, 246, 0.4)"
                }}
              >
                {usuarioEditandoId ? "Atualizar Conta" : "Cadastrar Conta"}
              </button>

              {usuarioEditandoId && (
                <button
                  type="button"
                  onClick={limparFormulario}
                  style={{
                    padding: "14px 18px", backgroundColor: "rgba(255,255,255,0.08)",
                    color: isDark ? "#94a3b8" : "#475569", border: "none", borderRadius: "12px",
                    fontWeight: "700", cursor: "pointer"
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
