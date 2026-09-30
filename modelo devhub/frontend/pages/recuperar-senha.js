import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import DevHubLogo from "../components/Logo";
import { 
  Mail, ArrowLeft, AlertCircle, CheckCircle2, 
  Loader2, KeyRound, Lock, ShieldCheck, Eye, EyeOff, 
  ArrowRight, X 
} from "lucide-react";

export default function RecuperarSenha() {
  const router = useRouter();

  // Estado do Tema (sincronizado com localStorage)
  const [theme, setTheme] = useState("dark"); // 'dark' | 'light'

  // Fluxo de Etapas (1: Solicitar Código | 2: Inserir Código & Nova Senha | 3: Sucesso)
  const [etapa, setEtapa] = useState(1);

  // Estados do formulário
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Estados para alternar exibição das senhas
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  // Estados de interface (carregamento, erro e sucesso)
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

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

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  // Etapa 1: Enviar Código de 6 Dígitos para o E-mail
  const handleSolicitarCodigo = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!email.trim()) {
      setErro("Por favor, digite seu endereço de e-mail.");
      return;
    }

    if (!validateEmail(email.trim())) {
      setErro("Informe um e-mail válido (ex: seuemail@dominio.com).");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/auth/recuperar-senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível enviar o código.");
      }

      setSucesso(data.message || `Código de 6 dígitos enviado para ${email.trim()}!`);
      setEtapa(2); // Avançar para a etapa de inserção do código e nova senha

    } catch (err) {
      let errorMessage = err.message || "Erro ao solicitar código de recuperação.";
      if (errorMessage === "Failed to fetch") {
        errorMessage = "Não foi possível conectar ao servidor backend. Verifique a conexão.";
      }
      setErro(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Etapa 2: Validar Código de 6 Dígitos e Redefinir a Senha
  const handleRedefinirSenha = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!codigo.trim()) {
      setErro("Digite o código de 6 dígitos enviado ao seu e-mail.");
      return;
    }

    if (codigo.trim().length !== 6) {
      setErro("O código de verificação precisa ter exatamente 6 dígitos.");
      return;
    }

    if (!novaSenha) {
      setErro("Por favor, digite sua nova senha.");
      return;
    }

    if (novaSenha.length < 6) {
      setErro("A nova senha precisa conter no mínimo 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem. Digite novamente.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/auth/redefinir-senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          codigo: codigo.trim(),
          novaSenha
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível redefinir sua senha.");
      }

      setSucesso("Sua senha foi alterada com sucesso! Você já pode fazer login.");
      setEtapa(3); // Etapa final de Sucesso

    } catch (err) {
      let errorMessage = err.message || "Erro ao redefinir a senha.";
      if (errorMessage === "Failed to fetch") {
        errorMessage = "Não foi possível conectar ao servidor backend. Verifique sua conexão.";
      }
      setErro(errorMessage);
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

  return (
    <>
      <Head>
        <title>DevHub — Redefinição de Senha</title>
      </Head>

      {/* ESTILOS DE ANIMAÇÃO KEYFRAMES & MICRO-INTERAÇÕES */}
      <style jsx global>{`
        @keyframes pulseGlow {
          0% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.18); opacity: 0.65; }
          100% { transform: scale(1); opacity: 0.35; }
        }

        @keyframes toastSlide {
          0% { transform: translateY(-12px) scale(0.96); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        @keyframes spinSlow {
          100% { transform: rotate(360deg); }
        }

        .gradient-text {
          background: linear-gradient(135deg, #60A5FA 0%, #A855F7 50%, #F59E0B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .recover-card-wrapper {
          position: relative;
          padding: 1.5px;
          border-radius: 28px;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
        }

        .recover-card-wrapper:hover {
          box-shadow: ${isDark ? "0 30px 80px -10px rgba(59, 130, 246, 0.35), 0 0 60px rgba(168, 85, 247, 0.35)" : "0 25px 50px rgba(0, 0, 0, 0.12)"};
        }

        .input-box {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .input-box:focus-within {
          border-color: #3B82F6 !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2), inset 0 2px 4px rgba(0,0,0,0.1) !important;
          background-color: ${isDark ? "rgba(10, 14, 26, 0.85)" : "#FFFFFF"} !important;
        }

        .input-box:focus-within .input-icon {
          color: #3B82F6 !important;
        }

        .submit-btn {
          background: linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%);
          background-size: 200% 200%;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 35px rgba(99, 102, 241, 0.55);
          background-position: 100% 50%;
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0) scale(0.985);
        }
      `}</style>

      {/* Container Principal */}
      <div style={{
        minHeight: "100vh", position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: colors.bgPage, color: colors.textPrimary,
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        padding: "28px 20px", transition: "all 0.3s ease"
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

        {/* LUZES NEONS DE FUNDO */}
        <div style={{
          position: "absolute", top: "-15%", left: "20%",
          width: "550px", height: "550px", borderRadius: "50%",
          background: `radial-gradient(circle, ${isDark ? "rgba(59, 130, 246, 0.35)" : "rgba(59, 130, 246, 0.15)"} 0%, transparent 75%)`,
          filter: "blur(75px)", pointerEvents: "none",
          animation: "pulseGlow 8s ease-in-out infinite"
        }} />

        <div style={{
          position: "absolute", bottom: "-15%", right: "20%",
          width: "600px", height: "600px", borderRadius: "50%",
          background: `radial-gradient(circle, ${isDark ? "rgba(168, 85, 247, 0.35)" : "rgba(168, 85, 247, 0.15)"} 0%, transparent 75%)`,
          filter: "blur(85px)", pointerEvents: "none",
          animation: "pulseGlow 10s ease-in-out infinite 2s"
        }} />

        {/* CARD DE RECUPERAÇÃO COM GLASSMORPHISM */}
        <div className="recover-card-wrapper" style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "460px",
          borderRadius: "28px",
          background: isDark
            ? "linear-gradient(145deg, rgba(59, 130, 246, 0.4) 0%, rgba(168, 85, 247, 0.25) 50%, rgba(255, 255, 255, 0.05) 100%)"
            : "linear-gradient(145deg, rgba(59, 130, 246, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)",
          boxShadow: isDark
            ? "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(59, 130, 246, 0.2)"
            : "0 20px 40px -10px rgba(0, 0, 0, 0.08)"
        }}>
          <div style={{
            backgroundColor: colors.bgCard,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "26.5px",
            padding: "40px 36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            
            {/* Logo DevHub */}
            <div style={{ marginBottom: "22px" }}>
              <DevHubLogo size="large" />
            </div>

            {/* Ícone Indicador de Chave / Cadeado */}
            <div style={{
              width: "54px",
              height: "54px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)",
              border: `1px solid ${isDark ? "rgba(59, 130, 246, 0.35)" : "rgba(59, 130, 246, 0.2)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "18px"
            }}>
              <KeyRound size={26} color="#3B82F6" />
            </div>

            {/* Cabeçalho Conforme a Etapa */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <h1 style={{
                fontSize: "24px",
                fontWeight: "900",
                color: colors.textPrimary,
                margin: "0 0 8px 0",
                letterSpacing: "-0.02em"
              }}>
                {etapa === 1 && "Recuperar Senha 🔑"}
                {etapa === 2 && "Verificar Código & Criar Senha 🔐"}
                {etapa === 3 && "Senha Alterada com Sucesso! 🎉"}
              </h1>
              <p style={{
                fontSize: "14px",
                color: colors.textSecondary,
                margin: 0,
                lineHeight: "1.55",
                maxWidth: "360px"
              }}>
                {etapa === 1 && "Informe seu e-mail cadastrado e enviaremos um código de 6 dígitos para você redefinir sua senha."}
                {etapa === 2 && `Digite o código de 6 dígitos enviado para ${email} e crie sua nova senha.`}
                {etapa === 3 && "Sua senha foi redefinida com sucesso. Clique abaixo para retornar à tela de login e acessar sua conta."}
              </p>
            </div>

            {/* Mensagem de Erro Elegante */}
            {erro && (
              <div style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "16px",
                backgroundColor: isDark ? "rgba(239, 68, 68, 0.12)" : "#FEF2F2",
                border: `1px solid ${isDark ? "rgba(239, 68, 68, 0.35)" : "#FCA5A5"}`,
                color: isDark ? "#FCA5A5" : "#991B1B",
                fontSize: "13.5px",
                fontWeight: "600",
                lineHeight: "1.45",
                marginBottom: "20px",
                animation: "toastSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
              }}>
                <AlertCircle size={20} color={isDark ? "#EF4444" : "#DC2626"} style={{ flexShrink: 0, marginTop: "1px" }} />
                <div style={{ flex: 1 }}>{erro}</div>
                <button
                  type="button"
                  onClick={() => setErro("")}
                  style={{
                    background: "none", border: "none", color: "inherit",
                    cursor: "pointer", padding: 0, display: "flex", opacity: 0.7
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Mensagem de Sucesso Elegante */}
            {sucesso && (
              <div style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "16px",
                backgroundColor: isDark ? "rgba(16, 185, 129, 0.12)" : "#ECFDF5",
                border: `1px solid ${isDark ? "rgba(16, 185, 129, 0.35)" : "#6EE7B7"}`,
                color: isDark ? "#6EE7B7" : "#065F46",
                fontSize: "13.5px",
                fontWeight: "600",
                lineHeight: "1.45",
                marginBottom: "22px",
                animation: "toastSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
              }}>
                <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: "1px" }} />
                <div style={{ flex: 1 }}>{sucesso}</div>
              </div>
            )}

            {/* ETAPA 1: SOLICITAR CÓDIGO */}
            {etapa === 1 && (
              <form noValidate onSubmit={handleSolicitarCodigo} autoComplete="off" style={{ width: "100%" }}>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: colors.textPrimary,
                    marginBottom: "8px",
                    letterSpacing: "0.2px"
                  }}>
                    E-mail Cadastrado
                  </label>
                  <div className="input-box" style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "14px",
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)"
                  }}>
                    <Mail size={19} className="input-icon" style={{
                      position: "absolute", left: "16px", color: colors.textSecondary,
                      transition: "color 0.2s ease", pointerEvents: "none"
                    }} />
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      autoComplete="off"
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (erro) setErro("");
                      }}
                      style={{
                        width: "100%",
                        padding: "14px 16px 14px 48px",
                        borderRadius: "14px",
                        border: "none",
                        backgroundColor: "transparent",
                        color: colors.textPrimary,
                        fontSize: "14.5px",
                        fontWeight: "500",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn"
                  style={{
                    width: "100%",
                    padding: "15px",
                    borderRadius: "14px",
                    color: "#FFFFFF",
                    fontWeight: "800",
                    fontSize: "15.5px",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.75 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    boxShadow: "0 10px 25px rgba(99, 102, 241, 0.35)",
                    letterSpacing: "0.3px"
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} style={{ animation: "spinSlow 1s linear infinite" }} />
                      <span>Enviando código...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar Código</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ETAPA 2: DIGITAR CÓDIGO E CRIAR NOVA SENHA */}
            {etapa === 2 && (
              <form noValidate onSubmit={handleRedefinirSenha} autoComplete="off" style={{ width: "100%" }}>

                {/* Campo Código de 6 Dígitos */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: colors.textPrimary,
                    marginBottom: "8px",
                    letterSpacing: "0.2px"
                  }}>
                    Código de Verificação (6 Dígitos)
                  </label>
                  <div className="input-box" style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "14px",
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)"
                  }}>
                    <ShieldCheck size={19} className="input-icon" style={{
                      position: "absolute", left: "16px", color: colors.textSecondary,
                      transition: "color 0.2s ease", pointerEvents: "none"
                    }} />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={codigo}
                      autoComplete="off"
                      onChange={(e) => {
                        setCodigo(e.target.value.replace(/\D/g, ""));
                        if (erro) setErro("");
                      }}
                      style={{
                        width: "100%",
                        padding: "14px 16px 14px 48px",
                        borderRadius: "14px",
                        border: "none",
                        backgroundColor: "transparent",
                        color: "#60A5FA",
                        fontSize: "18px",
                        fontWeight: "800",
                        letterSpacing: "4px",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                {/* Campo Nova Senha */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: colors.textPrimary,
                    marginBottom: "8px",
                    letterSpacing: "0.2px"
                  }}>
                    Nova Senha
                  </label>
                  <div className="input-box" style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "14px",
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)"
                  }}>
                    <Lock size={19} className="input-icon" style={{
                      position: "absolute", left: "16px", color: colors.textSecondary,
                      transition: "color 0.2s ease", pointerEvents: "none"
                    }} />
                    <input
                      type={mostrarNovaSenha ? "text" : "password"}
                      placeholder="Mínimo de 6 caracteres"
                      value={novaSenha}
                      autoComplete="new-password"
                      onChange={(e) => {
                        setNovaSenha(e.target.value);
                        if (erro) setErro("");
                      }}
                      style={{
                        width: "100%",
                        padding: "14px 46px 14px 48px",
                        borderRadius: "14px",
                        border: "none",
                        backgroundColor: "transparent",
                        color: colors.textPrimary,
                        fontSize: "14.5px",
                        fontWeight: "500",
                        outline: "none"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                      style={{
                        position: "absolute", right: "14px", background: "none",
                        border: "none", color: colors.textSecondary, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "4px"
                      }}
                    >
                      {mostrarNovaSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Campo Confirmar Nova Senha */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: colors.textPrimary,
                    marginBottom: "8px",
                    letterSpacing: "0.2px"
                  }}>
                    Confirmar Nova Senha
                  </label>
                  <div className="input-box" style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "14px",
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)"
                  }}>
                    <Lock size={19} className="input-icon" style={{
                      position: "absolute", left: "16px", color: colors.textSecondary,
                      transition: "color 0.2s ease", pointerEvents: "none"
                    }} />
                    <input
                      type={mostrarConfirmarSenha ? "text" : "password"}
                      placeholder="Repita sua nova senha"
                      value={confirmarSenha}
                      autoComplete="new-password"
                      onChange={(e) => {
                        setConfirmarSenha(e.target.value);
                        if (erro) setErro("");
                      }}
                      style={{
                        width: "100%",
                        padding: "14px 46px 14px 48px",
                        borderRadius: "14px",
                        border: "none",
                        backgroundColor: "transparent",
                        color: colors.textPrimary,
                        fontSize: "14.5px",
                        fontWeight: "500",
                        outline: "none"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                      style={{
                        position: "absolute", right: "14px", background: "none",
                        border: "none", color: colors.textSecondary, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "4px"
                      }}
                    >
                      {mostrarConfirmarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Botão Salvar Nova Senha */}
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn"
                  style={{
                    width: "100%",
                    padding: "15px",
                    borderRadius: "14px",
                    color: "#FFFFFF",
                    fontWeight: "800",
                    fontSize: "15.5px",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.75 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    boxShadow: "0 10px 25px rgba(99, 102, 241, 0.35)",
                    letterSpacing: "0.3px"
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} style={{ animation: "spinSlow 1s linear infinite" }} />
                      <span>Atualizando senha...</span>
                    </>
                  ) : (
                    <>
                      <span>Redefinir Senha</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ETAPA 3: SUCESSO & BOTÃO IR PARA O LOGIN */}
            {etapa === 3 && (
              <div style={{ width: "100%", textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="submit-btn"
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "14px",
                    color: "#FFFFFF",
                    fontWeight: "800",
                    fontSize: "16px",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)",
                    letterSpacing: "0.3px"
                  }}
                >
                  <span>Ir para o Login</span>
                  <ArrowRight size={19} />
                </button>
              </div>
            )}

            {/* Rodapé com Link para Voltar ao Login ou Reenviar Código */}
            <div style={{
              textAlign: "center",
              marginTop: "24px",
              fontSize: "14px",
              color: colors.textSecondary
            }}>
              {etapa === 2 && (
                <div style={{ marginBottom: "12px" }}>
                  Não recebeu o código?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setEtapa(1);
                      setErro("");
                      setSucesso("");
                    }}
                    style={{
                      background: "none", border: "none", color: "#3B82F6",
                      fontWeight: "700", cursor: "pointer", padding: 0
                    }}
                  >
                    Reenviar e-mail
                  </button>
                </div>
              )}
              
              <Link href="/" style={{
                color: "#60A5FA",
                fontWeight: "700",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}>
                <ArrowLeft size={16} />
                <span>Voltar para o login</span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
