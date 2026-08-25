import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import DevHubLogo from "../components/Logo";

export default function HomeLogin() {
  const router = useRouter();

  // Estado do Tema (sincronizado com localStorage)
  const [theme, setTheme] = useState("dark"); // 'dark' | 'light'

  // Estados do formulário
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Estados de controle da interface
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucessoToast, setSucessoToast] = useState("");

  // Sincronizar tema com localStorage na inicialização
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "dark";
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucessoToast("");

    if (!email || !senha) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "E-mail ou senha incorretos.");
      }

      // Armazena Token JWT e dados do Usuário no localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));

      // Exibe a notificação Toast flutuante na lateral
      setSucessoToast(`Login concluído! Bem-vindo(a), ${data.user.nome}.`);

      // Redireciona todos os usuários para a página inicial (Dashboard)
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);

    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cores adaptativas conforme o Modo Claro / Escuro
  const isDark = theme === "dark";
  const colors = {
    bgPage: isDark ? "#0B0F19" : "#F4F6F9",
    bgCard: isDark ? "rgba(15, 23, 42, 0.75)" : "#FFFFFF",
    borderCard: isDark ? "rgba(255, 255, 255, 0.12)" : "#E2E8F0",
    textPrimary: isDark ? "#F1F5F9" : "#1E293B",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    inputBg: isDark ? "rgba(30, 41, 59, 0.6)" : "#FFFFFF",
    inputBorder: isDark ? "rgba(255, 255, 255, 0.12)" : "#CBD5E1",
    boxShadow: isDark ? "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(59, 130, 246, 0.25)" : "0 20px 40px rgba(0, 0, 0, 0.08)"
  };

  return (
    <>
      <Head>
        <title>DevHub — Login</title>
      </Head>

      {/* Notificação Toast Flutuante na Lateral Superior Direita */}
      {sucessoToast && (
        <div style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backgroundColor: "#10B981",
          color: "#FFFFFF",
          padding: "14px 22px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
          fontWeight: "600",
          fontSize: "14px",
          backdropFilter: "blur(12px)"
        }}>
          <span style={{ fontSize: "18px" }}>🎉</span>
          <span>{sucessoToast}</span>
        </div>
      )}

      {/* Container Principal */}
      <div style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.bgPage,
        color: colors.textPrimary,
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "20px",
        transition: "all 0.3s ease"
      }}>
        
        {/* Botão de Alternar Tema no Topo Direito */}
        <div style={{ position: "absolute", top: "24px", right: "24px", zIndex: 100 }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#FFFFFF",
              color: colors.textPrimary,
              border: `1px solid ${colors.borderCard}`,
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease"
            }}
          >
            {isDark ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
          </button>
        </div>

        {/* Luzes Neons de Fundo no Modo Escuro */}
        {isDark && (
          <>
            <div style={{
              position: "absolute",
              top: "-10%",
              left: "15%",
              width: "450px",
              height: "450px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 80%)",
              filter: "blur(60px)",
              pointerEvents: "none"
            }} />

            <div style={{
              position: "absolute",
              bottom: "-10%",
              right: "15%",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 80%)",
              filter: "blur(70px)",
              pointerEvents: "none"
            }} />
          </>
        )}

        {/* Card do Formulário de Login (Adaptativo com Glassmorphism Vivo) */}
        <div style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "440px",
          backgroundColor: colors.bgCard,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "48px 40px",
          borderRadius: "28px",
          boxShadow: isDark 
            ? "0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 40px rgba(59, 130, 246, 0.3)" 
            : "0 20px 40px rgba(0, 0, 0, 0.08)",
          border: isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid #E2E8F0",
          textAlign: "center",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          {/* Logo do DevHub */}
          <div style={{ marginBottom: "28px" }}>
            <DevHubLogo size="large" />
          </div>

          {/* Cabeçalho */}
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "8px", letterSpacing: "-0.02em" }}>
              Bem-vindo(a) de volta! 👋
            </h1>
            <p style={{ color: colors.textSecondary, fontSize: "14px", lineHeight: "1.5" }}>
              Informe suas credenciais para acessar sua conta.
            </p>
          </div>

          {/* Mensagem de Erro */}
          {erro && (
            <div style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: isDark ? "#FCA5A5" : "#DC2626",
              padding: "14px 16px",
              borderRadius: "14px",
              fontSize: "14px",
              marginBottom: "24px",
              textAlign: "left",
              fontWeight: "600"
            }}>
              ⚠️ {erro}
            </div>
          )}

          {/* Formulário de Login */}
          <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
            <div style={{ marginBottom: "22px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "700", marginBottom: "8px", color: colors.textPrimary }}>
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  borderRadius: "14px",
                  border: `1px solid ${colors.inputBorder}`,
                  backgroundColor: colors.inputBg,
                  color: colors.textPrimary,
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.2s ease"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "700", marginBottom: "8px", color: colors.textPrimary }}>
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  borderRadius: "14px",
                  border: `1px solid ${colors.inputBorder}`,
                  backgroundColor: colors.inputBg,
                  color: colors.textPrimary,
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.2s ease"
                }}
                required
              />
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={loading}
              className="btn-vibrant"
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                fontSize: "16px",
                fontWeight: "800",
                letterSpacing: "0.02em"
              }}
            >
              {loading ? "Entrando..." : "Entrar 🚀"}
            </button>
          </form>

          {/* Rodapé com Link para Cadastro Padrão */}
          <div style={{ textAlign: "center", marginTop: "30px", fontSize: "14px", color: colors.textSecondary }}>
            Não tem uma conta ainda?{" "}
            <Link href="/cadastro" style={{ color: "#3B82F6", fontWeight: "700", textDecoration: "none" }}>
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}