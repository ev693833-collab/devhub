import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DevHubLogo from "../components/Logo";

export default function SuperAdminDashboard() {
  const router = useRouter();

  // Estado do Tema (claro / escuro)
  const [theme, setTheme] = useState("dark"); // 'dark' | 'light'

  // Estados de Controle de Acesso e Autenticação
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userLogado, setUserLogado] = useState(null);

  // Lista de usuários cadastrados
  const [usuarios, setUsuarios] = useState([]);
  const [carregandoLista, setCarregandoLista] = useState(true);

  // Formulário de Criação de Conta (Super Admin)
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("usuario"); // usuario | admin | super_admin

  // Modal de Edição de Usuário & Tag
  const [modalEditUserOpen, setModalEditUserOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCargo, setEditCargo] = useState("usuario");
  const [salvandoEdit, setSalvandoEdit] = useState(false);

  // Estados de Interface
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Carregar tema preferido
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "dark";
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  // Alternar tema entre claro e escuro
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  // Verificar se o usuário está autenticado e se é SUPER_ADMIN
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userDataStr = localStorage.getItem("userData");

      if (!token || !userDataStr) {
        router.push("/");
        return;
      }

      try {
        const parsedUser = JSON.parse(userDataStr);
        if (parsedUser.cargo !== "super_admin") {
          setAuthorized(false);
          setCheckingAuth(false);
          return;
        }

        setUserLogado(parsedUser);
        setAuthorized(true);
      } catch (err) {
        router.push("/");
      } finally {
        setCheckingAuth(false);
      }
    }
  }, [router]);

  // Helper para parsing seguro de JSON de respostas HTTP
  const getJsonResponse = async (res) => {
    try {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await res.json();
      }
    } catch (e) {}
    return null;
  };

  // Buscar lista de usuários do backend
  const carregarUsuarios = useCallback(async () => {
    try {
      setCarregandoLista(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${apiUrl}/auth/users`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await getJsonResponse(response);
        if (Array.isArray(data)) {
          setUsuarios(data);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setCarregandoLista(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    if (authorized) {
      carregarUsuarios();
    }
  }, [authorized, carregarUsuarios]);

  // Handler para criar nova conta (Super Admin)
  const handleCriarConta = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!nome || !email || !senha) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, cargo }),
      });

      const data = await getJsonResponse(response);

      if (!response.ok) {
        throw new Error((data && data.error) || `Falha ao criar conta (código HTTP ${response.status}).`);
      }

      setSucesso(`Conta do tipo "${formatCargoLabel(cargo)}" criada com sucesso!`);
      setNome("");
      setEmail("");
      setSenha("");
      setCargo("usuario");

      carregarUsuarios();
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler para abrir modal de edição
  const handleAbrirEditarUsuario = (u) => {
    setEditUserId(u.id);
    setEditNome(u.nome);
    setEditEmail(u.email);
    setEditCargo(u.cargo || "usuario");
    setModalEditUserOpen(true);
  };

  // Handler para salvar edição de usuário e tag
  const handleSalvarEdicaoUsuario = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setSalvandoEdit(true);

    try {
      const response = await fetch(`${apiUrl}/auth/users/${editUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: editNome,
          email: editEmail,
          cargo: editCargo
        }),
      });

      const data = await getJsonResponse(response);

      if (!response.ok) {
        throw new Error((data && data.error) || `Erro ao salvar alterações da conta (código HTTP ${response.status}).`);
      }

      setSucesso(`Conta de "${editNome}" atualizada com a tag "${formatCargoLabel(editCargo)}"!`);
      setModalEditUserOpen(false);
      carregarUsuarios();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvandoEdit(false);
    }
  };

  // Handler para alterar tag do cargo rapidamente direto no dropdown da lista
  const handleAlterarCargoRapido = async (id, nomeUser, novoCargo) => {
    try {
      const response = await fetch(`${apiUrl}/auth/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cargo: novoCargo }),
      });

      if (response.ok) {
        setSucesso(`Tag de "${nomeUser}" alterada para "${formatCargoLabel(novoCargo)}"!`);
        carregarUsuarios();
      } else {
        const data = await getJsonResponse(response);
        alert((data && data.error) || `Erro ao atualizar tag (${response.status}).`);
      }
    } catch (err) {
      console.error("Erro ao alterar tag:", err);
    }
  };

  // Handler para excluir conta
  const handleExcluirUsuario = async (id, nomeUser) => {
    if (!confirm(`Tem certeza que deseja excluir a conta de "${nomeUser}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/auth/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSucesso(`Usuário "${nomeUser}" removido.`);
        carregarUsuarios();
      } else {
        const data = await getJsonResponse(response);
        alert((data && data.error) || `Erro ao excluir usuário (${response.status}).`);
      }
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    router.push("/");
  };

  // Rótulos dos cargos
  const formatCargoLabel = (role) => {
    switch (role) {
      case "super_admin":
        return "Super Admin 👑";
      case "admin":
        return "Admin 🛡️";
      default:
        return "Usuário 👤";
    }
  };

  // Cores adaptativas das Tags (Cargos)
  const getBadgeStyle = (role) => {
    const isDark = theme === "dark";

    switch (role) {
      case "super_admin":
        return isDark
          ? { backgroundColor: "rgba(168, 85, 247, 0.25)", color: "#d8b4fe", border: "1px solid #a855f7" }
          : { backgroundColor: "#f3e8ff", color: "#6b21a8", border: "1px solid #c084fc" };
      case "admin":
        return isDark
          ? { backgroundColor: "rgba(59, 130, 246, 0.25)", color: "#93c5fd", border: "1px solid #3b82f6" }
          : { backgroundColor: "#dbeafe", color: "#1e40af", border: "1px solid #60a5fa" };
      default:
        return isDark
          ? { backgroundColor: "rgba(16, 185, 129, 0.25)", color: "#6ee7b7", border: "1px solid #10b981" }
          : { backgroundColor: "#d1fae5", color: "#065f46", border: "1px solid #34d399" };
    }
  };

  // Estilos adaptativos gerais
  const isDark = theme === "dark";
  const colors = {
    bgPage: isDark ? "#1A1A2E" : "#F4F6F9",
    bgCard: isDark ? "#2A2A4A" : "#FFFFFF",
    bgItem: isDark ? "rgba(0,0,0,0.25)" : "#F0F2F5",
    borderCard: isDark ? "#4A4A6A" : "#E2E8F0",
    textPrimary: isDark ? "#F0F2F5" : "#1E293B",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    inputBg: isDark ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
    inputBorder: isDark ? "#4A4A6A" : "#CBD5E1",
    selectBg: isDark ? "#1A1A2E" : "#FFFFFF",
  };

  if (checkingAuth) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: colors.bgPage, color: colors.textPrimary }}>
        <h2>Verificando permissões de acesso... 🔒</h2>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: colors.bgPage, color: colors.textPrimary, padding: "20px", textAlign: "center" }}>
        <div style={{ backgroundColor: colors.bgCard, padding: "40px", borderRadius: "16px", maxWidth: "450px", border: "1px solid #EF4444" }}>
          <h1 style={{ fontSize: "48px", marginBottom: "12px" }}>🚫</h1>
          <h2 style={{ color: "#EF4444", marginBottom: "12px" }}>Acesso Restrito!</h2>
          <p style={{ color: colors.textSecondary, marginBottom: "24px", fontSize: "15px" }}>
            Apenas usuários com a tag <strong>Super Admin 👑</strong> têm permissão para acessar este painel.
          </p>
          <button onClick={() => router.push("/")} style={{ padding: "12px 24px", borderRadius: "8px", backgroundColor: "var(--color-primary, #8b5cf6)", color: "#FFF", fontWeight: "600", border: "none", cursor: "pointer" }}>
            Voltar para a Tela de Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>DevHub — Painel Super Admin</title>
      </Head>

      <div style={{
        minHeight: "100vh",
        backgroundColor: colors.bgPage,
        color: colors.textPrimary,
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "32px 16px",
        transition: "all 0.3s ease"
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          
          {/* Top Bar Navigation */}
          <header style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            paddingBottom: "16px",
            borderBottom: `1px solid ${colors.borderCard}`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <DevHubLogo size="normal" />
              <div style={{ borderLeft: `2px solid ${colors.borderCard}`, paddingLeft: "16px" }}>
                <h1 style={{ fontSize: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                  👑 Painel do Super Admin
                </h1>
                <p style={{ color: colors.textSecondary, fontSize: "13px" }}>
                  Gerenciamento de contas e tags. {userLogado && `(Conectado como: ${userLogado.nome})`}
                </p>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button
                onClick={() => router.push("/dashboard")}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(59, 130, 246, 0.15)",
                  color: "#3B82F6",
                  border: "1px solid rgba(59, 130, 246, 0.4)",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600"
                }}
              >
                Voltar ao Dashboard 📊
              </button>

              <button
                onClick={toggleTheme}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#E2E8F0",
                  color: colors.textPrimary,
                  border: `1px solid ${colors.borderCard}`,
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600"
                }}
              >
                {isDark ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
              </button>

              <button
                onClick={handleLogout}
                style={{
                  padding: "10px 18px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                  color: "#EF4444",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600"
                }}
              >
                Sair 🚪
              </button>
            </div>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

            {/* Coluna 1: Criar Contas (Super Admin) */}
            <div style={{
              backgroundColor: colors.bgCard,
              padding: "28px",
              borderRadius: "16px",
              border: `1px solid ${colors.borderCard}`,
              boxShadow: isDark ? "0 12px 24px rgba(0,0,0,0.3)" : "0 10px 25px rgba(0,0,0,0.05)"
            }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
                ➕ Criar Nova Conta
              </h2>

              {erro && (
                <div style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid #EF4444", color: "#EF4444", padding: "10px 14px", borderRadius: "8px", fontSize: "14px", marginBottom: "16px" }}>
                  ⚠️ {erro}
                </div>
              )}

              {sucesso && (
                <div style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid #10B981", color: "#10B981", padding: "10px 14px", borderRadius: "8px", fontSize: "14px", marginBottom: "16px" }}>
                  ✅ {sucesso}
                </div>
              )}

              <form onSubmit={handleCriarConta}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "14px", marginBottom: "6px", fontWeight: "500" }}>
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Carlos Silva"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    style={{
                      width: "100%", padding: "12px", borderRadius: "8px",
                      border: `1px solid ${colors.inputBorder}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "14px", outline: "none"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "14px", marginBottom: "6px", fontWeight: "500" }}>
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="carlos@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: "100%", padding: "12px", borderRadius: "8px",
                      border: `1px solid ${colors.inputBorder}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "14px", outline: "none"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "14px", marginBottom: "6px", fontWeight: "500" }}>
                    Senha
                  </label>
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    style={{
                      width: "100%", padding: "12px", borderRadius: "8px",
                      border: `1px solid ${colors.inputBorder}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "14px", outline: "none"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "14px", marginBottom: "6px", fontWeight: "500" }}>
                    Tipo de Conta (Tag / Cargo)
                  </label>
                  <select
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: `1px solid ${colors.inputBorder}`,
                      backgroundColor: colors.selectBg,
                      color: colors.textPrimary,
                      fontSize: "15px",
                      fontWeight: "500",
                      outline: "none",
                      cursor: "pointer"
                    }}
                  >
                    <option value="usuario" style={{ backgroundColor: colors.selectBg, color: colors.textPrimary }}>👤 Usuário Padrão</option>
                    <option value="admin" style={{ backgroundColor: colors.selectBg, color: colors.textPrimary }}>🛡️ Administrador (Admin)</option>
                    <option value="super_admin" style={{ backgroundColor: colors.selectBg, color: colors.textPrimary }}>👑 Super Administrador (Super Admin)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%", padding: "14px", borderRadius: "8px",
                    background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)", color: "#FFF",
                    fontWeight: "600", border: "none", cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "15px", boxShadow: "0 6px 20px rgba(37, 99, 235, 0.35)"
                  }}
                >
                  {loading ? "Criando Conta..." : "Criar Conta pelo Super Admin"}
                </button>
              </form>
            </div>

            {/* Coluna 2: Lista de Contas & Edição de Tags */}
            <div style={{
              backgroundColor: colors.bgCard,
              padding: "28px",
              borderRadius: "16px",
              border: `1px solid ${colors.borderCard}`,
              boxShadow: isDark ? "0 12px 24px rgba(0,0,0,0.3)" : "0 10px 25px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "600" }}>
                  📋 Usuários no Banco ({usuarios.length})
                </h2>
                <button onClick={carregarUsuarios} style={{
                  backgroundColor: "transparent", border: "none", color: "var(--color-primary, #8b5cf6)",
                  cursor: "pointer", fontSize: "13px", fontWeight: "600"
                }}>
                  🔄 Atualizar
                </button>
              </div>

              {carregandoLista ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: colors.textSecondary }}>
                  Carregando usuários do banco de dados...
                </div>
              ) : usuarios.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: colors.textSecondary }}>
                  Nenhum usuário cadastrado ainda. Crie a primeira conta ao lado!
                </div>
              ) : (
                <div style={{ overflowY: "auto", maxHeight: "450px", paddingRight: "4px" }}>
                  {usuarios.map((user) => (
                    <div key={user.id} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: colors.bgItem,
                      padding: "14px 16px",
                      borderRadius: "12px",
                      marginBottom: "12px",
                      border: `1px solid ${colors.borderCard}`,
                      gap: "12px"
                    }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: "700", fontSize: "15px", color: colors.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {user.nome}
                        </div>
                        <div style={{ fontSize: "13px", color: colors.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {user.email}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                        {/* DROPDOWN RÁPIDO PARA EDITAR A TAG / CARGO DO USUÁRIO */}
                        <select
                          value={user.cargo || "usuario"}
                          onChange={(e) => handleAlterarCargoRapido(user.id, user.nome, e.target.value)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "10px",
                            fontSize: "12px",
                            fontWeight: "700",
                            border: `1px solid ${colors.borderCard}`,
                            backgroundColor: colors.selectBg,
                            color: colors.textPrimary,
                            cursor: "pointer"
                          }}
                        >
                          <option value="usuario">👤 Usuário</option>
                          <option value="admin">🛡️ Admin</option>
                          <option value="super_admin">👑 Super Admin</option>
                        </select>

                        {/* BOTÃO PARA EDITAR TODOS OS DADOS DO USUÁRIO */}
                        <button
                          onClick={() => handleAbrirEditarUsuario(user)}
                          title="Editar Usuário & Tag"
                          style={{
                            backgroundColor: "rgba(59, 130, 246, 0.15)",
                            color: "#3B82F6",
                            border: "1px solid rgba(59, 130, 246, 0.4)",
                            borderRadius: "8px",
                            padding: "6px 10px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "600"
                          }}
                        >
                          ✏️ Editar
                        </button>

                        <button
                          onClick={() => handleExcluirUsuario(user.id, user.nome)}
                          title="Excluir usuário"
                          style={{
                            backgroundColor: "rgba(239, 68, 68, 0.15)",
                            color: "#EF4444",
                            border: "1px solid rgba(239, 68, 68, 0.4)",
                            borderRadius: "8px",
                            padding: "6px 10px",
                            cursor: "pointer",
                            fontSize: "12px"
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* MODAL DE EDIÇÃO COMPLETA DE USUÁRIO & TAG */}
        {modalEditUserOpen && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}>
            <div style={{
              backgroundColor: colors.bgCard,
              color: colors.textPrimary,
              maxWidth: "480px",
              width: "100%",
              borderRadius: "20px",
              padding: "28px",
              border: `1px solid ${colors.borderCard}`,
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800" }}>
                  ✏️ Editar Usuário & Permissão (Tag)
                </h3>
                <button
                  onClick={() => setModalEditUserOpen(false)}
                  style={{
                    border: "none", backgroundColor: "transparent",
                    color: colors.textPrimary, fontSize: "18px", cursor: "pointer"
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSalvarEdicaoUsuario} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                    style={{
                      width: "100%", padding: "12px", borderRadius: "8px",
                      border: `1px solid ${colors.inputBorder}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "14px", outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                    Endereço de E-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    style={{
                      width: "100%", padding: "12px", borderRadius: "8px",
                      border: `1px solid ${colors.inputBorder}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "14px", outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                    Permissão da Conta (Tag / Cargo)
                  </label>
                  <select
                    value={editCargo}
                    onChange={(e) => setEditCargo(e.target.value)}
                    style={{
                      width: "100%", padding: "12px", borderRadius: "8px",
                      border: `1px solid ${colors.inputBorder}`, backgroundColor: colors.selectBg,
                      color: colors.textPrimary, fontSize: "14px", fontWeight: "600",
                      cursor: "pointer", outline: "none"
                    }}
                  >
                    <option value="usuario">👤 Usuário Padrão (Estudante)</option>
                    <option value="admin">🛡️ Administrador (Admin)</option>
                    <option value="super_admin">👑 Super Administrador (Super Admin)</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setModalEditUserOpen(false)}
                    style={{
                      flex: 1, padding: "12px", borderRadius: "8px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: "transparent",
                      color: colors.textPrimary, fontWeight: "600", cursor: "pointer"
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={salvandoEdit}
                    style={{
                      flex: 1, padding: "12px", borderRadius: "8px",
                      border: "none", background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
                      color: "#FFF", fontWeight: "700", cursor: salvandoEdit ? "not-allowed" : "pointer"
                    }}
                  >
                    {salvandoEdit ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
