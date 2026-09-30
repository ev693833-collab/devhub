import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import DevHubLogo from "../components/Logo";
import { 
  Mail, Lock, Eye, EyeOff, Sparkles, Trophy, Zap, 
  ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Loader2,
  X, Code2, Users, Flame, BookOpen, ChevronRight, Play, Star, Check, HelpCircle,
  Github, PlayCircle
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  // Estado do Tema (sincronizado com localStorage)
  const [theme, setTheme] = useState("dark"); // 'dark' | 'light'

  // Estado do Modal de Login
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Estados do formulário de login
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(true);

  // Estados de controle da interface & Notificações
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucessoToast, setSucessoToast] = useState("");

  // Sincronizar tema com localStorage na inicialização e checar query string ?login=true
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "dark";
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  useEffect(() => {
    if (router.query.login === "true") {
      setIsLoginOpen(true);
    }
  }, [router.query]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const handleOpenLogin = () => {
    setErro("");
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
    setErro("");
  };

  const handleSubmitLogin = async (e) => {
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

      // Exibe notificação rápida de sucesso
      setSucessoToast(`🎉 Login realizado com sucesso! Bem-vindo(a), ${data.user.nome}.`);
      setIsLoginOpen(false);

      // Redireciona para o Dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 600);

    } catch (err) {
      setErro(err.message || "Falha ao realizar login.");
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
    bgPage: isDark ? "#06080F" : "#F8FAFC",
    bgCard: isDark ? "rgba(15, 23, 42, 0.85)" : "#FFFFFF",
    bgCardSolid: isDark ? "#0F172A" : "#FFFFFF",
    borderCard: isDark ? "rgba(255, 255, 255, 0.12)" : "#E2E8F0",
    textPrimary: isDark ? "#F8FAFC" : "#0F172A",
    textSecondary: isDark ? "#94A3B8" : "#475569",
    inputBg: isDark ? "rgba(10, 14, 26, 0.8)" : "#F1F5F9",
    inputBorder: isDark ? "rgba(255, 255, 255, 0.16)" : "#CBD5E1",
    navbarBg: isDark ? "rgba(6, 8, 15, 0.82)" : "rgba(255, 255, 255, 0.85)"
  };

  // Badges de tecnologias flutuantes animadas
  const techBadges = [
    { label: "React.js ⚛️", top: "18%", left: "5%", delay: "0s", duration: "6.5s", color: "#61DAFB" },
    { label: "Node.js 🚀", top: "72%", left: "6%", delay: "1.5s", duration: "7.5s", color: "#68A063" },
    { label: "Python 🐍", top: "20%", right: "6%", delay: "0.8s", duration: "7s", color: "#3870A0" },
    { label: "TypeScript 💙", top: "75%", right: "8%", delay: "2s", duration: "8s", color: "#3178C6" },
    { label: "Dev IA 🤖", top: "48%", right: "3%", delay: "1s", duration: "6s", color: "#A855F7" },
    { label: "Arena 1v1 ⚔️", top: "50%", left: "4%", delay: "2.5s", duration: "6.8s", color: "#EF4444" }
  ];

  // Recursos em destaque
  const features = [
    {
      icon: <Trophy size={28} color="#F59E0B" />,
      title: "Arena de Duelos 1v1",
      desc: "Desafie outros desenvolvedores em desafios de código em tempo real. Suba na liga semanal e ganhe prestígio.",
      badge: "Gamificado"
    },
    {
      icon: <Github size={28} color="#A855F7" />,
      title: "Portfólio no Perfil",
      desc: "Exiba seus projetos, habilidades e conquistas em um perfil público profissional para impressionar recrutadores e empresas.",
      badge: "Perfil Público"
    },
    {
      icon: <BookOpen size={28} color="#3B82F6" />,
      title: "Trilhas de Aprendizado",
      desc: "Conteúdos estruturados do básico ao avançado nas tecnologias mais requisitadas pelo mercado de trabalho.",
      badge: "Completo"
    },
    {
      icon: <Code2 size={28} color="#10B981" />,
      title: "Code Playground Integrado",
      desc: "Execute e teste seu código JavaScript, Python ou React sem precisar configurar nada na sua máquina local.",
      badge: "Na Nuvem"
    },
    {
      icon: <Users size={28} color="#EC4899" />,
      title: "Comunidade & Mentoria",
      desc: "Tire dúvidas no módulo de Tickets, compartilhe soluções e troque experiências com outros devs ativos.",
      badge: "Interativo"
    },
    {
      icon: <PlayCircle size={28} color="#6366F1" />,
      title: "Videoaulas na Plataforma",
      desc: "Assista aulas em vídeo gravadas por especialistas diretamente no sistema, acompanhando seu progresso em cada módulo.",
      badge: "Conteúdo em Vídeo"
    }
  ];

  return (
    <>
      <Head>
        <title>DevHub — Acelere sua Carreira em Programação</title>
        <meta name="description" content="Aprenda programação com videoaulas práticas, duelos 1v1 na Arena de Código, Dev IA Tutor 24/7 e ranking semanal em tempo real." />
      </Head>

      {/* ESTILOS DE ANIMAÇÃO E CSS GLOBAL */}
      <style jsx global>{`
        @keyframes floatAnim {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes pulseGlow {
          0% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.18); opacity: 0.65; }
          100% { transform: scale(1); opacity: 0.35; }
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.94) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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

        .card-hover {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-hover:hover {
          transform: translateY(-6px);
          border-color: rgba(99, 102, 241, 0.5) !important;
          box-shadow: 0 20px 40px -15px rgba(99, 102, 241, 0.25) !important;
        }

        .input-box:focus-within {
          border-color: #3B82F6 !important;
          box-shadow: 0 0 18px rgba(59, 130, 246, 0.35) !important;
        }
      `}</style>

      {/* TOAST FLUTUANTE DE SUCESSO */}
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

      <div style={{
        minHeight: "100vh", backgroundColor: colors.bgPage, color: colors.textPrimary,
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        overflowX: "hidden", position: "relative"
      }}>

        {/* ==================== NAVBAR ==================== */}
        <header style={{
          position: "sticky", top: 0, zIndex: 100,
          backgroundColor: colors.navbarBg,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: `1px solid ${colors.borderCard}`,
          padding: "16px 28px",
          transition: "all 0.3s ease"
        }}>
          <div style={{
            maxWidth: "1240px", margin: "0 auto",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            {/* Logo DevHub */}
            <Link href="/" style={{ textDecoration: "none" }}>
              <DevHubLogo size="normal" />
            </Link>

            {/* Nav Links */}
            <nav style={{
              display: "flex", alignItems: "center", gap: "32px",
              fontSize: "14.5px", fontWeight: "700"
            }}>
              <a href="#recursos" style={{ color: colors.textSecondary, textDecoration: "none", transition: "color 0.2s" }}>
                Recursos
              </a>
              <a href="#arena" style={{ color: colors.textSecondary, textDecoration: "none", transition: "color 0.2s" }}>
                Arena 1v1
              </a>
              <a href="#ia-tutor" style={{ color: colors.textSecondary, textDecoration: "none", transition: "color 0.2s" }}>
                Dev IA
              </a>
              <a href="#comunidade" style={{ color: colors.textSecondary, textDecoration: "none", transition: "color 0.2s" }}>
                Comunidade
              </a>
            </nav>

            {/* Ações da Navbar */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              
              {/* Botão de Tema */}
              <button
                onClick={toggleTheme}
                title="Alternar Tema"
                style={{
                  padding: "9px 16px", borderRadius: "12px",
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                  color: colors.textPrimary, border: `1px solid ${colors.borderCard}`,
                  cursor: "pointer", fontSize: "13px", fontWeight: "700",
                  display: "flex", alignItems: "center", gap: "7px", transition: "all 0.2s ease"
                }}
              >
                {isDark ? "☀️ Claro" : "🌙 Escuro"}
              </button>

              {/* Botão Entrar -> Navega para /login */}
              <Link href="/login" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "10px 22px", borderRadius: "12px",
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#FFFFFF",
                    color: colors.textPrimary,
                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.2)" : "#CBD5E1"}`,
                    cursor: "pointer", fontSize: "14px", fontWeight: "800",
                    display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s ease"
                  }}
                >
                  <span>Entrar</span>
                  <ArrowRight size={15} />
                </button>
              </Link>

              {/* Botão Cadastre-se Grátis */}
              <Link href="/cadastro" style={{ textDecoration: "none" }}>
                <button className="gradient-btn" style={{
                  padding: "10px 22px", borderRadius: "12px",
                  border: "none", color: "#FFFFFF",
                  fontSize: "14px", fontWeight: "900", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "8px",
                  boxShadow: "0 4px 15px rgba(139, 92, 246, 0.35)"
                }}>
                  <span>Cadastre-se Grátis</span>
                </button>
              </Link>

            </div>
          </div>
        </header>

        {/* ==================== HERO SECTION ==================== */}
        <section style={{
          position: "relative", padding: "100px 24px 80px 24px",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", textAlign: "center"
        }}>

          {/* Luzes Neon de Fundo */}
          <div style={{
            position: "absolute", top: "5%", left: "15%",
            width: "600px", height: "600px", borderRadius: "50%",
            background: `radial-gradient(circle, ${isDark ? "rgba(59, 130, 246, 0.28)" : "rgba(59, 130, 246, 0.12)"} 0%, transparent 75%)`,
            filter: "blur(90px)", pointerEvents: "none",
            animation: "pulseGlow 8s ease-in-out infinite"
          }} />

          <div style={{
            position: "absolute", top: "25%", right: "15%",
            width: "650px", height: "650px", borderRadius: "50%",
            background: `radial-gradient(circle, ${isDark ? "rgba(168, 85, 247, 0.28)" : "rgba(168, 85, 247, 0.12)"} 0%, transparent 75%)`,
            filter: "blur(90px)", pointerEvents: "none",
            animation: "pulseGlow 10s ease-in-out infinite 2s"
          }} />

          {/* Badges Flutuantes de Tecnologias */}
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

          {/* Conteúdo Hero Centrado */}
          <div style={{ relative: "relative", zIndex: 10, maxWidth: "860px" }}>

            {/* Badge de Destaque Topo */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "9px",
              padding: "8px 20px", borderRadius: "30px", marginBottom: "28px",
              backgroundColor: isDark ? "rgba(59, 130, 246, 0.14)" : "#EFF6FF",
              border: `1px solid ${isDark ? "rgba(59, 130, 246, 0.35)" : "#BFDBFE"}`,
              color: "#3B82F6", fontSize: "13.5px", fontWeight: "800", letterSpacing: "0.4px"
            }}>
              <Sparkles size={18} color="#3B82F6" />
              <span>PLATAFORMA #1 DE APRENDIZADO DEV INTERATIVO</span>
            </div>

            {/* Título Principal */}
            <h1 style={{
              fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)", fontWeight: "900",
              lineHeight: "1.12", letterSpacing: "-0.035em", margin: "0 0 24px 0"
            }}>
              Acelere sua Carreira Dev <br />
              <span className="gradient-text">na Prática & Interativo.</span>
            </h1>

            {/* Subtítulo */}
            <p style={{
              fontSize: "clamp(1.05rem, 2vw, 1.25rem)", color: colors.textSecondary,
              lineHeight: "1.65", maxWidth: "700px", margin: "0 auto 38px auto",
              fontWeight: "500"
            }}>
              Aprenda programação com videoaulas dinâmicas, duelos 1v1 na Arena de Código,
              assistente Dev IA Tutor 24/7 e ranking semanal em tempo real.
            </p>



            {/* Badges de Confiança */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "28px", marginTop: "44px", color: colors.textSecondary,
              fontSize: "13.5px", fontWeight: "700", flexWrap: "wrap"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>Sem necessidade de cartão de crédito</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>Acesso instantâneo à plataforma</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>+1.200 Duelos Disputados</span>
              </div>
            </div>

          </div>

          {/* SIMULADOR DE IDE / PREVIEW INTERATIVO */}
          <div style={{
            marginTop: "70px", width: "100%", maxWidth: "980px",
            position: "relative", zIndex: 10
          }}>
            <div style={{
              borderRadius: "24px", padding: "2px",
              background: "linear-gradient(135deg, rgba(59,130,246,0.5), rgba(168,85,247,0.5), rgba(16,185,129,0.3))",
              boxShadow: isDark ? "0 30px 80px -15px rgba(0, 0, 0, 0.9), 0 0 60px rgba(168, 85, 247, 0.2)" : "0 20px 50px rgba(0, 0, 0, 0.12)"
            }}>
              <div style={{
                backgroundColor: isDark ? "#0A0E1A" : "#1E293B",
                borderRadius: "22px", overflow: "hidden", color: "#F8FAFC"
              }}>
                {/* Barra do Editor */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 22px", backgroundColor: isDark ? "#06080F" : "#0F172A",
                  borderBottom: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#EF4444" }} />
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#F59E0B" }} />
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#10B981" }} />
                    <span style={{ fontSize: "12.5px", color: "#94A3B8", marginLeft: "12px", fontWeight: "600" }}>
                      desafio_duelo_arena.js — DevHub Playground
                    </span>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34D399",
                    padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "800"
                  }}>
                    <Play size={13} color="#34D399" />
                    <span>Executando Duelo 1v1</span>
                  </div>
                </div>

                {/* Código de Exemplo */}
                <div style={{ padding: "28px", textAlign: "left", fontFamily: "Fira Code, monospace", fontSize: "14px", lineHeight: "1.7" }}>
                  <p style={{ margin: 0, color: "#64748B" }}>// DevHub Arena: Resolva o algoritmo para somar o XP do usuário</p>
                  <p style={{ margin: 0, color: "#F472B6" }}>
                    <span style={{ color: "#60A5FA" }}>function</span> <span style={{ color: "#F59E0B" }}>calcularXpDuelo</span>(vitorias, streaks) {"{"}
                  </p>
                  <p style={{ margin: 0, paddingLeft: "24px", color: "#93C5FD" }}>
                    const baseXP = vitorias * <span style={{ color: "#F472B6" }}>150</span>;
                  </p>
                  <p style={{ margin: 0, paddingLeft: "24px", color: "#93C5FD" }}>
                    const bônusStreak = streaks &gt;= <span style={{ color: "#F472B6" }}>3</span> ? <span style={{ color: "#F472B6" }}>300</span> : <span style={{ color: "#F472B6" }}>0</span>;
                  </p>
                  <p style={{ margin: 0, paddingLeft: "24px", color: "#F472B6" }}>
                    return <span style={{ color: "#34D399" }}>baseXP + bônusStreak</span>;
                  </p>
                  <p style={{ margin: 0, color: "#F472B6" }}>{"}"}</p>

                  <div style={{
                    marginTop: "20px", padding: "16px 20px", borderRadius: "14px",
                    backgroundColor: "rgba(168, 85, 247, 0.12)", border: "1px solid rgba(168, 85, 247, 0.3)",
                    display: "flex", alignItems: "center", gap: "14px"
                  }}>
                    <Zap size={22} color="#C084FC" style={{ flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: "13px", fontWeight: "800", color: "#E9D5FF", display: "block" }}>
                        Dev IA Tutor Feedback:
                      </span>
                      <span style={{ fontSize: "12.5px", color: "#C084FC" }}>
                        "Excelente lógica! Sua solução é O(1) em tempo de execução. +450 XP adicionados ao seu perfil!"
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </section>

        {/* ==================== SEÇÃO DE ESTATÍSTICAS ==================== */}
        <section style={{
          padding: "60px 24px", borderTop: `1px solid ${colors.borderCard}`,
          borderBottom: `1px solid ${colors.borderCard}`,
          backgroundColor: isDark ? "rgba(15, 23, 42, 0.4)" : "#FFFFFF"
        }}>
          <div style={{
            maxWidth: "1100px", margin: "0 auto",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "32px", textAlign: "center"
          }}>
            <div>
              <h3 style={{ fontSize: "36px", fontWeight: "900", color: "#3B82F6", margin: 0 }}>+1.200</h3>
              <p style={{ color: colors.textSecondary, fontSize: "14px", margin: "6px 0 0 0", fontWeight: "700" }}>Duelos Disputados</p>
            </div>
            <div>
              <h3 style={{ fontSize: "36px", fontWeight: "900", color: "#A855F7", margin: 0 }}>98%</h3>
              <p style={{ color: colors.textSecondary, fontSize: "14px", margin: "6px 0 0 0", fontWeight: "700" }}>Satisfação dos Alunos</p>
            </div>
            <div>
              <h3 style={{ fontSize: "36px", fontWeight: "900", color: "#10B981", margin: 0 }}>24/7</h3>
              <p style={{ color: colors.textSecondary, fontSize: "14px", margin: "6px 0 0 0", fontWeight: "700" }}>Suporte Dev IA Tutor</p>
            </div>
            <div>
              <h3 style={{ fontSize: "36px", fontWeight: "900", color: "#F59E0B", margin: 0 }}>+50</h3>
              <p style={{ color: colors.textSecondary, fontSize: "14px", margin: "6px 0 0 0", fontWeight: "700" }}>Módulos & Trilhas Práticas</p>
            </div>
          </div>
        </section>

        {/* ==================== SEÇÃO DE RECURSOS (FEATURES) ==================== */}
        <section id="recursos" style={{ padding: "100px 24px", maxWidth: "1200px", margin: "0 auto" }}>
          
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "900", letterSpacing: "-0.02em", marginBottom: "16px" }}>
              Tudo que você precisa para <span className="gradient-text">dominar a programação</span>
            </h2>
            <p style={{ color: colors.textSecondary, fontSize: "16.5px", maxWidth: "620px", margin: "0 auto", lineHeight: "1.6" }}>
              Uma plataforma projetada para transformar o aprendizado de código em uma jornada envolvente, prática e rápida.
            </p>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
            gap: "28px"
          }}>
            {features.map((item, idx) => (
              <div
                key={idx}
                className="card-hover"
                style={{
                  backgroundColor: colors.bgCard,
                  border: `1px solid ${colors.borderCard}`,
                  borderRadius: "24px", padding: "36px 30px",
                  display: "flex", flexDirection: "column", gap: "18px",
                  backdropFilter: "blur(14px)", position: "relative", overflow: "hidden"
                }}
              >
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                  <div style={{
                    width: "56px", height: "56px", borderRadius: "16px",
                    backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {item.icon}
                  </div>
                  <span style={{
                    fontSize: "11.5px", fontWeight: "800", padding: "5px 12px",
                    borderRadius: "20px", backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0",
                    color: colors.textPrimary, letterSpacing: "0.5px"
                  }}>
                    {item.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: "20px", fontWeight: "900", margin: 0 }}>
                  {item.title}
                </h3>

                <p style={{ color: colors.textSecondary, fontSize: "14.5px", lineHeight: "1.65", margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </section>

        {/* ==================== BANNER DE APELATIVO (CTA FINAL) ==================== */}
        <section style={{ padding: "80px 24px 120px 24px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{
            position: "relative", overflow: "hidden",
            borderRadius: "32px", padding: "60px 40px",
            background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)",
            color: "#FFFFFF", textAlign: "center",
            boxShadow: "0 25px 60px rgba(76, 29, 149, 0.4)"
          }}>
            <h2 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)", fontWeight: "900", margin: "0 0 20px 0", letterSpacing: "-0.03em" }}>
              Pronto para transformar sua carreira em programação?
            </h2>
            <p style={{ fontSize: "17px", color: "#C7D2FE", maxWidth: "640px", margin: "0 auto 36px auto", lineHeight: "1.6" }}>
              Junte-se a milhares de estudantes e desenvolvedores que já usam o DevHub todos os dias para evoluir rápido.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "18px", flexWrap: "wrap" }}>
              <Link href="/cadastro" style={{ textDecoration: "none" }}>
                <button style={{
                  padding: "16px 36px", borderRadius: "16px", border: "none",
                  backgroundColor: "#FFFFFF", color: "#4338CA",
                  fontSize: "16.5px", fontWeight: "900", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "10px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
                }}>
                  <span>Criar Conta Grátis</span>
                  <ArrowRight size={20} />
                </button>
              </Link>

              <button
                onClick={handleOpenLogin}
                style={{
                  padding: "16px 32px", borderRadius: "16px",
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  color: "#FFFFFF", border: "1.5px solid rgba(255, 255, 255, 0.3)",
                  cursor: "pointer", fontSize: "16px", fontWeight: "800"
                }}
              >
                <span>Já tenho conta (Entrar)</span>
              </button>
            </div>
          </div>
        </section>

        {/* ==================== FOOTER ==================== */}
        <footer style={{
          backgroundColor: isDark ? "#030408" : "#F1F5F9",
          borderTop: `1px solid ${colors.borderCard}`,
          padding: "48px 24px 36px 24px"
        }}>
          <div style={{
            maxWidth: "1200px", margin: "0 auto",
            display: "flex", flexDirection: "column", gap: "32px"
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: "20px"
            }}>
              <DevHubLogo size="normal" />


            </div>

            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              borderTop: `1px solid ${colors.borderCard}`, paddingTop: "24px",
              fontSize: "13px", color: colors.textSecondary, flexWrap: "wrap", gap: "12px"
            }}>
              <span>© 2026 DevHub Plataforma de TI. Todos os direitos reservados.</span>
              <span>Feito para impulsionar desenvolvedores 🚀</span>
            </div>
          </div>
        </footer>

      </div>

      {/* ==================== MODAL DE LOGIN FLUTUANTE ==================== */}
      {isLoginOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.78)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          padding: "20px",
          animation: "overlayFadeIn 0.25s ease-out forwards"
        }}>
          
          <div style={{
            position: "relative", width: "100%", maxWidth: "440px",
            borderRadius: "28px", padding: "2px",
            background: "linear-gradient(135deg, rgba(59,130,246,0.8), rgba(168,85,247,0.8), rgba(245,158,11,0.7))",
            boxShadow: "0 30px 90px rgba(0, 0, 0, 0.9), 0 0 60px rgba(168, 85, 247, 0.4)",
            animation: "modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
          }}>
            
            <div style={{
              backgroundColor: colors.bgCardSolid,
              borderRadius: "26px", padding: "40px 32px",
              position: "relative"
            }}>

              {/* Botão Fechar Modal (X) */}
              <button
                onClick={handleCloseLogin}
                style={{
                  position: "absolute", top: "20px", right: "20px",
                  width: "36px", height: "36px", borderRadius: "50%",
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#F1F5F9",
                  border: `1px solid ${colors.borderCard}`,
                  color: colors.textPrimary, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s ease"
                }}
              >
                <X size={20} />
              </button>

              {/* Header do Modal */}
              <div style={{ textAlign: "center", marginBottom: "26px" }}>
                <div style={{ marginBottom: "18px", display: "inline-block" }}>
                  <DevHubLogo size="large" />
                </div>
                <h2 style={{ fontSize: "22px", fontWeight: "900", margin: "0 0 6px 0", letterSpacing: "-0.02em" }}>
                  Acessar Plataforma 👋
                </h2>
                <p style={{ color: colors.textSecondary, fontSize: "13.5px", margin: 0 }}>
                  Entre com suas credenciais para continuar estudando
                </p>
              </div>

              {/* Mensagem de Erro */}
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
              <form onSubmit={handleSubmitLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* Campo E-mail */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "800", marginBottom: "8px", color: colors.textPrimary }}>
                    E-mail do Usuário
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
                      autoFocus
                    />
                  </div>
                </div>

                {/* Campo Senha */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "800", color: colors.textPrimary }}>
                      Sua Senha
                    </label>
                    <Link href="/recuperar-senha" style={{ fontSize: "12.5px", color: "#3B82F6", fontWeight: "700", textDecoration: "none" }}>
                      Esqueceu?
                    </Link>
                  </div>
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

                {/* Lembrar de mim */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="checkbox"
                    id="lembrar"
                    checked={lembrar}
                    onChange={(e) => setLembrar(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "#3B82F6", cursor: "pointer" }}
                  />
                  <label htmlFor="lembrar" style={{ fontSize: "13px", color: colors.textSecondary, cursor: "pointer", fontWeight: "600" }}>
                    Lembrar de mim neste navegador
                  </label>
                </div>

                {/* Botão Entrar no Modal */}
                <button
                  type="submit"
                  disabled={loading}
                  className="gradient-btn"
                  style={{
                    width: "100%", padding: "16px", borderRadius: "14px",
                    border: "none", color: "#FFFFFF", fontSize: "15.5px",
                    fontWeight: "900", cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                    fontFamily: "inherit", opacity: loading ? 0.8 : 1,
                    marginTop: "6px"
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} style={{ animation: "spinSlow 1s linear infinite" }} />
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

              {/* Rodapé do Modal com Link de Cadastro */}
              <div style={{ textAlign: "center", marginTop: "24px", fontSize: "13.5px", color: colors.textSecondary }}>
                Não tem uma conta ainda?{" "}
                <Link href="/cadastro" style={{ color: "#3B82F6", fontWeight: "800", textDecoration: "none" }}>
                  Cadastre-se grátis
                </Link>
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
