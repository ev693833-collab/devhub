import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
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
        if (parsedUser.cargo !== "superadmin" && parsedUser.cargo !== "super_admin") {
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
        backgroundColor: colors.bgPage,
        color: colors.textPrimary,
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "32px 24px",
        transition: "all 0.3s ease"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
          
          {/* Top Bar Navigation */}
          <header style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "20px",
            borderBottom: `1px solid ${colors.borderCard}`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <DevHubLogo size="normal" />
              <div style={{ borderLeft: `2px solid ${colors.borderCard}`, paddingLeft: "16px" }}>
                <h1 style={{ fontSize: "20px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                  👑 DevHub VIP Control Panel
                </h1>
                <p style={{ color: colors.textSecondary, fontSize: "13px", margin: "2px 0 0 0" }}>
                  {userLogado && `Conectado como: ${userLogado.nome} (${userLogado.email})`}
                </p>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button
                onClick={() => router.push("/dashboard")}
                style={{
                  padding: "10px 18px", borderRadius: "12px",
                  backgroundColor: "rgba(59, 130, 246, 0.15)",
                  color: "#3B82F6", border: "1px solid rgba(59, 130, 246, 0.4)",
                  cursor: "pointer", fontSize: "14px", fontWeight: "700"
                }}
              >
                📊 Voltar ao Dashboard
              </button>

              <button
                onClick={toggleTheme}
                style={{
                  padding: "10px 16px", borderRadius: "12px",
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                  color: colors.textPrimary, border: `1px solid ${colors.borderCard}`,
                  cursor: "pointer", fontSize: "14px", fontWeight: "700"
                }}
              >
                {isDark ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
              </button>

              <button
                onClick={handleLogout}
                style={{
                  padding: "10px 18px", borderRadius: "12px",
                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                  color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.4)",
                  cursor: "pointer", fontSize: "14px", fontWeight: "700"
                }}
              >
                Sair 🚪
              </button>
            </div>
          </header>

          {/* MÓDULO EXECUTIVO COMPLETO */}
          <SuperAdminModule isDark={isDark} colors={colors} currentUser={userLogado} />

        </div>
      </div>
    </>
  );
}
