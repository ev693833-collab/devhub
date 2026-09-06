import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import DevHubLogo from "../components/Logo";
import { 
  Mail, Lock, Eye, EyeOff, Sparkles, Trophy, Zap, 
  ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Loader2
} from "lucide-react";

export default function HomeLogin() {
  const router = useRouter();

  // Estado do Tema (sincronizado com localStorage)
  const [theme, setTheme] = useState("dark"); // 'dark' | 'light'

  // Estados do formulário
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Estados de controle da interface & Notificações rápidas
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
      setErro("Preencha seu e-mail e senha para continuar.");
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

      // Exibe a notificação Toast flutuante de Sucesso Rápida
      setSucessoToast(`🎉 Login realizado com sucesso! Bem-vindo(a), ${data.user.nome}.`);

      // Redireciona rapidamente para a página inicial (Dashboard)
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);

    } catch (err) {
      setErro(err.message);
      // Auto-limpar erro após 5 segundos se o usuário quiser tentar novamente
      setTimeout(() => {
        setErro((prev) => (prev === err.message ? "" : prev));
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  // Cores adaptativas conforme o Modo Claro / Escuro
  const isDark = theme === "dark";
  const colors = {
    bgPage: isDark ? "#06080F" : "#F4F6F9",
    bgCard: isDark ? "rgba(15, 23, 42, 0.82)" : "#FFFFFF",
    borderCard: isDark ? "rgba(255, 255, 255, 0.15)" : "#E2E8F0",
    textPrimary: isDark ? "#F8FAFC" : "#0F172A",
    textSecondary: isDark ? "#94A3B8" : "#475569",
    inputBg: isDark ? "rgba(10, 14, 26, 0.7)" : "#FFFFFF",
    inputBorder: isDark ? "rgba(255, 255, 255, 0.14)" : "#CBD5E1"
  };

  // Badges de tecnologias flutuantes animadas
  const techBadges = [
    { label: "React.js ⚛️", top: "12%", left: "6%", delay: "0s", duration: "6.5s", color: "#61DAFB" },
    { label: "Node.js 🚀", top: "78%", left: "8%", delay: "1.5s", duration: "7.5s", color: "#68A063" },
    { label: "Python 🐍", top: "16%", right: "8%", delay: "0.8s", duration: "7s", color: "#3870A0" },
    { label: "TypeScript 💙", top: "80%", right: "12%", delay: "2s", duration: "8s", color: "#3178C6" },
    { label: "Dev IA 🤖", top: "45%", right: "4%", delay: "1s", duration: "6s", color: "#A855F7" },
    { label: "Arena 1v1 ⚔️", top: "52%", left: "5%", delay: "2.5s", duration: "6.8s", color: "#EF4444" }
  ];

  return (
    <>
      <Head>
        <title>DevHub — Acelere sua Carreira em Programação</title>
      </Head>

      {/* ESTILOS DE ANIMAÇÃO KEYFRAMES */}
      <style jsx global>{`
        @keyframes floatAnim {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes pulseGlow {
          0% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.18); opacity: 0.65; }
          100% { transform: scale(1); opacity: 0.35; }
        }

        @keyframes toastSlide {
          0% { transform: translateY(-20px) scale(0.95); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        @keyframes spinSlow {
          100% { transform: rotate(360deg); }
        }

        .gradient-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #d946ef 100%);
          background-size: 200% 200%;
          transition: all 0.3s ease;
        }

        .gradient-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(139, 92, 246, 0.45);
          background-position: 100% 50%;
        }

        .gradient-text {
          background: linear-gradient(135deg, #60A5FA 0%, #A855F7 50%, #F59E0B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .login-card-wrapper {
          position: relative;
          padding: 2px;
          border-radius: 30px;
          background: linear-gradient(135deg, rgba(59,130,246,0.6), rgba(168,85,247,0.6), rgba(245,158,11,0.5));
          box-shadow: ${isDark ? "0 25px 70px -10px rgba(0, 0, 0, 0.9), 0 0 50px rgba(168, 85, 247, 0.3)" : "0 20px 40px rgba(0, 0, 0, 0.08)"};
        }

        .input-box:focus-within {
          border-color: #3B82F6 !important;
          box-shadow: 0 0 18px rgba(59, 130, 246, 0.35) !important;
        }
      `}</style>

      {/* NOTIFICAÇÃO RÁPIDA DE SUCESSO (TOAST NO TOPO DIREITO) */}
      {sucessoToast && (
        <div style={{
          position: "fixed", top: "24px", right: "24px", zIndex: 9999,
          display: "flex", alignItems: "center", gap: "12px",
          backgroundColor: "#10B981", color: "#FFFFFF",
          padding: "16px 24px", borderRadius: "16px",
          boxShadow: "0 12px 35px rgba(16, 185, 129, 0.45)",
          fontWeight: "800", fontSize: "14.5px", backdropFilter: "blur(14px)",
          animation: "toastSlide 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards"
        }}>
          <CheckCircle2 size={22} color="#FFF" />
          <span>{sucessoToast}</span>
        </div>
      )}

      {/* Container Principal */}
      <div style={{
        minHeight: "100vh", position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: colors.bgPage, color: colors.textPrimary,
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        padding: "24px", transition: "all 0.3s ease"
      }}>
        
        {/* Botão de Alternar Tema no Topo Direito */}
        <div style={{ position: "absolute", top: "24px", right: "24px", zIndex: 100 }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: "10px 18px", borderRadius: "14px",
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#FFFFFF",
              color: colors.textPrimary, border: `1px solid ${colors.borderCard}`,
              cursor: "pointer", fontSize: "13.5px", fontWeight: "700",
              boxShadow: "0 4px 14px rgba(0,0,0,0.12)", display: "flex",
              alignItems: "center", gap: "8px", transition: "all 0.2s ease"
            }}
          >
            {isDark ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
          </button>
        </div>

        {/* LUZES NEONS DE FUNDO E EFEITOS GLOW */}
        <div style={{
          position: "absolute", top: "-15%", left: "12%",
          width: "550px", height: "550px", borderRadius: "50%",
          background: `radial-gradient(circle, ${isDark ? "rgba(59, 130, 246, 0.35)" : "rgba(59, 130, 246, 0.15)"} 0%, transparent 75%)`,
          filter: "blur(75px)", pointerEvents: "none",
          animation: "pulseGlow 8s ease-in-out infinite"
        }} />

        <div style={{
          position: "absolute", bottom: "-15%", right: "12%",
          width: "600px", height: "600px", borderRadius: "50%",
          background: `radial-gradient(circle, ${isDark ? "rgba(168, 85, 247, 0.35)" : "rgba(168, 85, 247, 0.15)"} 0%, transparent 75%)`,
          filter: "blur(85px)", pointerEvents: "none",
          animation: "pulseGlow 10s ease-in-out infinite 2s"
        }} />

        {/* CHIPS DE TECNOLOGIAS FLUTUANTES ANIMADAS (VISÍVEIS EM AMBOS OS TEMAS) */}
        {techBadges.map((badge, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute", top: badge.top, left: badge.left, right: badge.right,
              animation: `floatAnim ${badge.duration} ease-in-out infinite alternate ${badge.delay}`,
              zIndex: 2, display: "flex", alignItems: "center", gap: "8px",
              padding: "9px 18px", borderRadius: "22px",
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.85)" : "#FFFFFF",
              border: isDark ? `1.5px solid ${badge.color}55` : `1.5px solid ${badge.color}88`,
              boxShadow: isDark ? `0 8px 24px ${badge.color}30` : `0 10px 25px rgba(0,0,0,0.08), 0 0 15px ${badge.color}25`,
              backdropFilter: "blur(12px)",
              fontSize: "13px", fontWeight: "800", color: colors.textPrimary,
              userSelect: "none"
            }}
          >
            <span>{badge.label}</span>
          </div>
        ))}

        {/* CONTAINER ESTRUTURAL */}
        <div style={{
          position: "relative", zIndex: 10, width: "100%", maxWidth: "1040px",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "48px", alignItems: "center", margin: "0 auto"
        }}>

          {/* ===== LADO ESQUERDO: TITULO & SOBRE O DEVHUB ===== */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "7px 16px", borderRadius: "20px", width: "fit-content",
              backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF",
              border: `1px solid ${isDark ? "rgba(59, 130, 246, 0.35)" : "#BFDBFE"}`,
              color: "#60A5FA", fontSize: "13px", fontWeight: "800", letterSpacing: "0.5px"
            }}>
              <Sparkles size={16} color="#60A5FA" />
              <span>PLATAFORMA DE ESTUDOS DE TI</span>
            </div>

            <h1 style={{
              fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", fontWeight: "900",
              lineHeight: "1.15", margin: 0, letterSpacing: "-0.03em"
            }}>
              Acelere sua Carreira Dev <br />
              <span className="gradient-text">na Prática & Interativo.</span>
            </h1>

            <p style={{
              fontSize: "16px", color: colors.textSecondary,
              lineHeight: "1.65", margin: 0, maxWidth: "460px"
            }}>
              Aprenda com videoaulas, duelos 1v1 na Arena de Código, assistente Dev IA Tutor 24/7 e ranking semanal em tempo real.
            </p>

            <div style={{
              display: "flex", alignItems: "center", gap: "12px", marginTop: "8px",
              padding: "12px 18px", borderRadius: "16px",
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "#FFFFFF",
              border: `1px solid ${colors.borderCard}`, width: "fit-content"
            }}>
              <div style={{ display: "flex" }}>
                {["👑", "🎓", "⚡"].map((emoji, i) => (
                  <span key={i} style={{ fontSize: "18px", marginRight: "-4px" }}>{emoji}</span>
                ))}
              </div>
              <span style={{ fontSize: "13px", fontWeight: "800", color: colors.textSecondary }}>
                +1.200 Duelos Disputados • Turma Ativa 2026
              </span>
            </div>

          </div>

          {/* ===== LADO DIREITO: CARD DE LOGIN ESTILIZADO COM BORDA GLOW ===== */}
          <div className="login-card-wrapper">
            <div style={{
              backgroundColor: colors.bgCard,
              backdropFilter: "blur(26px)",
              WebkitBackdropFilter: "blur(26px)",
              padding: "44px 38px",
              borderRadius: "28px"
            }}>

              {/* Logo do DevHub */}
              <div style={{ marginBottom: "22px", textAlign: "center" }}>
                <DevHubLogo size="large" />
              </div>

              {/* Cabeçalho do Card */}
              <div style={{ marginBottom: "26px", textAlign: "center" }}>
                <h2 style={{ fontSize: "22px", fontWeight: "900", marginBottom: "6px", letterSpacing: "-0.02em" }}>
                  Bem-vindo(a) de volta! 👋
                </h2>
                <p style={{ color: colors.textSecondary, fontSize: "13.5px", margin: 0 }}>
                  Informe suas credenciais para acessar sua conta.
                </p>
              </div>

              {/* MENSAGEM RÁPIDA DE ERRO NO LOGIN */}
              {erro && (
                <div style={{
                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: isDark ? "#FCA5A5" : "#DC2626",
                  padding: "13px 16px", borderRadius: "14px",
                  fontSize: "13.5px", marginBottom: "22px",
                  fontWeight: "700", display: "flex", alignItems: "center", gap: "10px",
                  animation: "toastSlide 0.3s ease-out forwards"
                }}>
                  <AlertCircle size={20} color="#EF4444" style={{ flexShrink: 0 }} />
                  <span>{erro}</span>
                </div>
              )}

              {/* Formulário de Login */}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* Campo E-mail */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "800", marginBottom: "8px", color: colors.textPrimary }}>
                    E-mail
                  </label>
                  <div className="input-box" style={{
                    position: "relative", borderRadius: "14px",
                    border: `1px solid ${colors.inputBorder}`,
                    backgroundColor: colors.inputBg,
                    transition: "all 0.25s ease"
                  }}>
                    <Mail size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: colors.textSecondary }} />
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: "100%", padding: "15px 16px 15px 46px",
                        background: "transparent", border: "none",
                        color: colors.textPrimary, fontSize: "14.5px",
                        outline: "none", fontFamily: "inherit"
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Campo Senha */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "800", marginBottom: "8px", color: colors.textPrimary }}>
                    Senha
                  </label>
                  <div className="input-box" style={{
                    position: "relative", borderRadius: "14px",
                    border: `1px solid ${colors.inputBorder}`,
                    backgroundColor: colors.inputBg,
                    transition: "all 0.25s ease"
                  }}>
                    <Lock size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: colors.textSecondary }} />
                    <input
                      type={mostrarSenha ? "text" : "password"}
                      placeholder="••••••••"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      style={{
                        width: "100%", padding: "15px 46px 15px 46px",
                        background: "transparent", border: "none",
                        color: colors.textPrimary, fontSize: "14.5px",
                        outline: "none", fontFamily: "inherit"
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      style={{
                        position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                        background: "transparent", border: "none", color: colors.textSecondary,
                        cursor: "pointer", padding: "4px", display: "flex", alignItems: "center"
                      }}
                    >
                      {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Botão Entrar com Gradiente Vibrante & Loading */}
                <button
                  type="submit"
                  disabled={loading}
                  className="gradient-btn"
                  style={{
                    width: "100%", padding: "16px", borderRadius: "14px",
                    border: "none", color: "#FFFFFF", fontSize: "15.5px",
                    fontWeight: "900", cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                    fontFamily: "inherit", opacity: loading ? 0.8 : 1
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="spin" style={{ animation: "spinSlow 1s linear infinite" }} />
                      <span>Autenticando...</span>
                    </>
                  ) : (
                    <>
                      <span>Entrar na Plataforma</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Rodapé com Link para Cadastro Padrão */}
              <div style={{ textAlign: "center", marginTop: "26px", fontSize: "13.5px", color: colors.textSecondary }}>
                Não tem uma conta ainda?{" "}
                <Link href="/cadastro" style={{ color: "#3B82F6", fontWeight: "800", textDecoration: "none" }}>
                  Cadastre-se grátis
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}