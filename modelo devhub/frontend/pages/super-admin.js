import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { LayoutDashboard, Sun, Moon, LogOut } from "lucide-react";
import DevHubLogo from "../components/Logo";
import SuperAdminModule from "../components/SuperAdminModule";

export default function SuperAdminDashboard() {
  const router = useRouter();

  // Estado do Tema (claro / escuro)
  const [theme, setTheme] = useState("dark"); // 'dark' | 'light'

  // Estados de Controle de Acesso e Autenticação
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userLogado, setUserLogado] = useState(null);

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
        const cargoLower = (parsedUser.cargo || "").toLowerCase();
        const isAllowed = cargoLower === "superadmin" || cargoLower === "super_admin" || cargoLower === "admin" || parsedUser.is_super_admin || parsedUser.is_admin || (parsedUser.email && parsedUser.email.toLowerCase().includes("superadmin"));
        if (!isAllowed) {
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

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      router.push("/");
    }
  };

  if (checkingAuth) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#0F172A", color: "#FFF" }}>
        <h2>Verificando permissões de acesso ao Painel VIP...</h2>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#0F172A", color: "#FFF", gap: "16px" }}>
        <h2 style={{ color: "#EF4444" }}>🔒 Acesso Restrito ao Super Admin</h2>
        <p>Você não possui a tag de Super Admin para visualizar este painel.</p>
        <button onClick={() => router.push("/dashboard")} style={{ padding: "12px 24px", borderRadius: "10px", backgroundColor: "#3B82F6", color: "#FFF", border: "none", cursor: "pointer", fontWeight: "700" }}>
          Voltar ao Dashboard Principal
        </button>
      </div>
    );
  }

  const isDark = theme === "dark";
  const colors = {
    bgPage: isDark ? "#0F172A" : "#F8FAFC",
    bgCard: isDark ? "#1E293B" : "#FFFFFF",
    textPrimary: isDark ? "#F8FAFC" : "#0F172A",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    borderCard: isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0"
  };

  return (
    <>
      <Head>
        <title>DevHub — Painel Executivo Super Admin</title>
      </Head>

      <div style={{
        minHeight: "100vh",
        backgroundColor: isDark ? "#030712" : colors.bgPage,
        color: colors.textPrimary,
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "24px 36px",
        transition: "all 0.3s ease"
      }}>
        <div style={{ maxWidth: "100%", width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Top Bar Navigation */}
          <header style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "20px",
            borderBottom: `1px solid ${isDark ? "rgba(139, 92, 246, 0.25)" : colors.borderCard}`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <DevHubLogo size="normal" />
              <div style={{ borderLeft: `2px solid ${isDark ? "rgba(139, 92, 246, 0.25)" : colors.borderCard}`, paddingLeft: "16px" }}>
                <h1 style={{ fontSize: "20px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", margin: 0, color: isDark ? "#F8FAFC" : "#0F172A" }}>
                  🛡️ Painel Executivo Super Admin
                </h1>
                <p style={{ color: isDark ? "#94A3B8" : colors.textSecondary, fontSize: "13px", margin: "2px 0 0 0" }}>
                  {userLogado && `Conectado como: ${userLogado.nome} (${userLogado.email})`}
                </p>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button
                onClick={() => router.push("/dashboard")}
                style={{
                  padding: "10px 20px", borderRadius: "9999px",
                  background: isDark
                    ? "linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.35) 100%)"
                    : "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
                  color: isDark ? "#60A5FA" : "#1D4ED8",
                  border: `1px solid ${isDark ? "rgba(96, 165, 250, 0.35)" : "rgba(37, 99, 235, 0.3)"}`,
                  backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                  cursor: "pointer", fontSize: "14.5px", fontWeight: "800",
                  display: "flex", alignItems: "center", gap: "8px",
                  boxShadow: isDark
                    ? "0 4px 15px -3px rgba(37, 99, 235, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)"
                    : "0 4px 15px -3px rgba(37, 99, 235, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.8)",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  fontFamily: "inherit", letterSpacing: "-0.01em"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                  e.currentTarget.style.boxShadow = isDark
                    ? "0 8px 25px -4px rgba(37, 99, 235, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.3)"
                    : "0 8px 25px -4px rgba(37, 99, 235, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.9)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = isDark
                    ? "0 4px 15px -3px rgba(37, 99, 235, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)"
                    : "0 4px 15px -3px rgba(37, 99, 235, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.8)";
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.96)"}
                onMouseUp={(e) => e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"}
              >
                <LayoutDashboard size={18} />
                <span>Voltar ao Dashboard</span>
              </button>

              <button
                onClick={toggleTheme}
                style={{
                  padding: "10px 18px", borderRadius: "9999px",
                  background: isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(15, 23, 42, 0.06)",
                  color: colors.textPrimary,
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(15, 23, 42, 0.12)"}`,
                  backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                  cursor: "pointer", fontSize: "14.5px", fontWeight: "800",
                  display: "flex", alignItems: "center", gap: "8px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  fontFamily: "inherit", letterSpacing: "-0.01em"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                  e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.13)" : "rgba(15, 23, 42, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(15, 23, 42, 0.06)";
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.96)"}
                onMouseUp={(e) => e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"}
              >
                {isDark ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#6366F1" />}
                <span>{isDark ? "Modo Claro" : "Modo Escuro"}</span>
              </button>

              <button
                onClick={handleLogout}
                style={{
                  padding: "10px 18px", borderRadius: "9999px",
                  background: isDark
                    ? "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.3) 100%)"
                    : "linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)",
                  color: isDark ? "#FCA5A5" : "#DC2626",
                  border: `1px solid ${isDark ? "rgba(239, 68, 68, 0.35)" : "rgba(239, 68, 68, 0.3)"}`,
                  backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                  cursor: "pointer", fontSize: "14.5px", fontWeight: "800",
                  display: "flex", alignItems: "center", gap: "8px",
                  boxShadow: "0 4px 15px -3px rgba(239, 68, 68, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  fontFamily: "inherit", letterSpacing: "-0.01em"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 8px 25px -4px rgba(239, 68, 68, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 15px -3px rgba(239, 68, 68, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)";
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.96)"}
                onMouseUp={(e) => e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"}
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </div>
          </header>

          {/* MÓDULO EXECUTIVO COMPLETO */}
          <SuperAdminModule 
            isDark={isDark} 
            colors={colors} 
            currentUser={userLogado} 
            onVoltarEntrada={() => router.push("/")}
          />

        </div>
      </div>
    </>
  );
}
