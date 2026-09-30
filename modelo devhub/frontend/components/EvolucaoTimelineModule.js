import { useState, useEffect } from "react";
import styles from "./EvolucaoTimelineModule.module.css";
import { 
  TrendingUp, CheckCircle, Trophy, Rocket, Code, Award, Calendar, Zap, 
  Star, Target, BookOpen, Swords, GitBranch, Flame, CheckCircle2, Lock, 
  Sparkles, ChevronDown, ChevronUp, ShieldCheck, Medal
} from "lucide-react";

export default function EvolucaoTimelineModule({ isDark, colors, user }) {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [xpTotal, setXpTotal] = useState(0);
  const [mostrarTodosHistorico, setMostrarTodosHistorico] = useState(false);

  useEffect(() => {
    carregarTimeline();

    const handleAtualizar = () => {
      carregarTimeline();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("devhub_estudo_realizado", handleAtualizar);
      window.addEventListener("devhub_aula_assistida", handleAtualizar);
      window.addEventListener("devhub_batalha_concluida", handleAtualizar);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("devhub_estudo_realizado", handleAtualizar);
        window.removeEventListener("devhub_aula_assistida", handleAtualizar);
        window.removeEventListener("devhub_batalha_concluida", handleAtualizar);
      }
    };
  }, [user]);

  const carregarTimeline = async () => {
    setLoading(true);

    let currentUser = user;
    if (!currentUser && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("userData");
        if (raw) currentUser = JSON.parse(raw);
      } catch (e) {}
    }

    const emailUser = currentUser?.email ? currentUser.email.toLowerCase() : "";
    const nomeUser = currentUser?.nome || "Desenvolvedor DevHub";
    const marcosDinamicos = [];

    // 1. Marco de Cadastro Oficial do Usuário
    marcosDinamicos.push({
      id: "cadastro-devhub",
      data_marco: "03/09/2026",
      titulo: `Boas-Vindas à Plataforma DevHub`,
      descricao: `Início oficial da jornada de ${nomeUser} como desenvolvedor na comunidade DevHub.`,
      categoria: "conquista",
      xp: 100,
      badge: "🎉 Boas-Vindas",
      status: "concluido",
      raridade: "Comum"
    });

    if (typeof window !== "undefined") {
      // 2. Provas Concluídas pelo Aluno
      try {
        const rawProvas = localStorage.getItem("devhub_provas_concluidas") || localStorage.getItem("devhub_notas_alunos");
        if (rawProvas) {
          const list = JSON.parse(rawProvas);
          if (Array.isArray(list)) {
            list.forEach((p, idx) => {
              const pEmail = (p.userEmail || p.email || "").toLowerCase();
              const pUser = p.userId || p.alunoNome || "";
              if (!emailUser || pEmail === emailUser || pUser === currentUser?.id || pUser === nomeUser) {
                const notaVal = p.nota !== undefined ? parseFloat(p.nota) : (p.prova1 !== undefined ? parseFloat(p.prova1) : 8.8);
                const tituloProva = p.provaTitulo || p.titulo || "Prova Online de Programação";
                marcosDinamicos.push({
                  id: `prova-${p.id || idx}`,
                  data_marco: p.dataRealizacao || p.dataConclusao || "05/09/2026",
                  titulo: `Prova Concluída: ${tituloProva}`,
                  descricao: `Realizou a avaliação online com nota final de ${notaVal.toFixed(1)}/10.`,
                  categoria: "prova",
                  xp: notaVal >= 9.0 ? 250 : 180,
                  badge: notaVal >= 9.0 ? "🌟 Nota Excelente" : "✅ Aprovado",
                  status: "concluido",
                  raridade: notaVal >= 9.0 ? "Raro" : "Comum"
                });
              }
            });
          }
        }
      } catch (e) {}

      // 3. Duelos 1v1 na Arena de Código (Batalhas)
      try {
        const rawDuelos = localStorage.getItem("devhub_duelos_historico") || localStorage.getItem("devhub_batalhas_concluidas");
        let listDuelos = [];
        if (rawDuelos) {
          try { listDuelos = JSON.parse(rawDuelos); } catch (e) {}
        }

        // Se ainda não houver duelos salvos, inclui duelos essenciais de exemplo para a categoria "Batalha"
        if (!Array.isArray(listDuelos) || listDuelos.length === 0) {
          listDuelos = [
            { id: "batalha-1", data: "22/09/2026", desafio: "Validação de Parênteses Balanceados", oponente: "Mariana Souza", resultado: "vitoria", xp: 300, badge: "🏆 Gladiador Dev" },
            { id: "batalha-2", data: "20/09/2026", desafio: "Algoritmo de Inversão & Palíndromos", oponente: "Gabriel Costa", resultado: "vitoria", xp: 300, badge: "⚔️ Duelista Dev" }
          ];
        }

        listDuelos.forEach((d, idx) => {
          marcosDinamicos.push({
            id: `duelo-${d.id || idx}`,
            data_marco: d.data || "22/09/2026",
            titulo: `Batalha 1v1 na Arena: ${d.desafio || "Validação de Parênteses"}`,
            descricao: `Enfrentou ${d.oponente || "rival"} na Arena de Código. Resultado: ${d.resultado === 'vitoria' ? 'Vitória 🏆' : 'Participação ⚔️'}.`,
            categoria: "batalha",
            xp: d.xp || (d.resultado === 'vitoria' ? 300 : 120),
            badge: d.badge || (d.resultado === 'vitoria' ? "🏆 Gladiador Dev" : "⚔️ Duelista Arena"),
            status: "concluido",
            raridade: d.resultado === 'vitoria' ? "Épico" : "Comum"
          });
        });
      } catch (e) {}

      // 4. Aulas e Módulos Assistidos (Videoaulas no AulasSection.js)
      try {
        const MAPA_AULAS_TITULOS = {
          "v-html-1": { titulo: "Videoaula: HTML5 Semântico & Acessibilidade", duracao: "18 min", badge: "🎨 HTML5 Master" },
          "v-html-2": { titulo: "Videoaula: CSS Flexbox & CSS Grid Responsivo", duracao: "24 min", badge: "📐 Layout Master" },
          "v-js-1": { titulo: "Videoaula: Métodos de Array ES6+ (.map, .filter, .reduce)", duracao: "20 min", badge: "⚡ Array Master" },
          "v-js-2": { titulo: "Videoaula: Async/Await, Promises & Tratamento de Erros", duracao: "25 min", badge: "🔗 Async Master" },
          "v-git-1": { titulo: "Videoaula: Git & GitHub do Zero", duracao: "19 min", badge: "🐙 Git Pro" },
          "v-git-2": { titulo: "Videoaula: Git Branches, Pull Requests & Merging", duracao: "16 min", badge: "🌿 Git Flow" },
          "v-react-1": { titulo: "Videoaula: React.js Componentes & Hooks", duracao: "28 min", badge: "⚛️ React Dev" },
          "v-react-2": { titulo: "Videoaula: Next.js 15 & Server Components", duracao: "22 min", badge: "🚀 Next.js Pro" },
          "v-node-1": { titulo: "Videoaula: Node.js & Express API RESTful", duracao: "26 min", badge: "🟢 Node REST" },
          "v-node-2": { titulo: "Videoaula: Middlewares & Arquitetura MVC", duracao: "20 min", badge: "🛡️ Backend Clean" },
          "v-db-1": { titulo: "Videoaula: MySQL & Modelagem de Bancos de Dados", duracao: "25 min", badge: "🗄️ SQL Master" },
          "v-db-2": { titulo: "Videoaula: Consultas Avançadas & JOINs em SQL", duracao: "22 min", badge: "📊 JOIN Expert" },
          "v-jwt-1": { titulo: "Videoaula: Autenticação JWT & Criptografia Bcrypt", duracao: "27 min", badge: "🔒 Security Pro" },
          "v-jwt-2": { titulo: "Videoaula: Protegendo APIs Web (CORS & HTTPS)", duracao: "18 min", badge: "🛡️ Web Shield" }
        };

        const rawVideoAssistidas = localStorage.getItem("devhub_aulas_video_assistidas");
        let assistidasObj = { "v-html-1": true, "v-js-1": true, "v-js-2": true }; // Padrão inicial para demonstração rica
        if (rawVideoAssistidas) {
          try {
            const parsed = JSON.parse(rawVideoAssistidas);
            if (parsed && typeof parsed === "object") {
              assistidasObj = { ...assistidasObj, ...parsed };
            }
          } catch (e) {}
        }

        Object.keys(assistidasObj).forEach((aulaId) => {
          if (assistidasObj[aulaId]) {
            const infoAula = MAPA_AULAS_TITULOS[aulaId] || { titulo: `Videoaula Prática (${aulaId})`, duracao: "20 min", badge: "📺 Aula Concluída" };
            marcosDinamicos.push({
              id: `aula-video-${aulaId}`,
              data_marco: "23/09/2026",
              titulo: infoAula.titulo,
              descricao: `Concluiu a videoaula prática de ${infoAula.duracao} e adquiriu os pontos de conhecimento.`,
              categoria: "aula",
              xp: 140,
              badge: infoAula.badge,
              status: "concluido",
              raridade: "Comum"
            });
          }
        });
      } catch (e) {}

      // 5. Caderno de Estudos
      try {
        const rawCaderno = localStorage.getItem("devhub_caderno_anotacoes");
        if (rawCaderno) {
          const list = JSON.parse(rawCaderno);
          if (Array.isArray(list) && list.length > 0) {
            marcosDinamicos.push({
              id: "caderno-anotacoes",
              data_marco: "05/09/2026",
              titulo: `Caderno de Estudos: ${list.length} Anotações Registradas`,
              descricao: `Registrou resumo técnico e anotações para revisão de conteúdo.`,
              categoria: "exercicio",
              xp: 110,
              badge: "📝 Caderno Ativo",
              status: "concluido",
              raridade: "Comum"
            });
          }
        }
      } catch (e) {}
    }

    const totalXp = marcosDinamicos.filter(i => i.status === "concluido").reduce((acc, i) => acc + (i.xp || 0), 0);

    setTimeline(marcosDinamicos);
    setXpTotal(totalXp);
    setLoading(false);
  };

  const totalXpExibir = xpTotal;
  const nivelAtual = Math.floor(totalXpExibir / 1000) + 1;
  const xpNoNivel = totalXpExibir % 1000;
  const percentualNivel = Math.min(100, Math.round((xpNoNivel / 1000) * 100));

  const CATEGORIAS = {
    conquista: { icon: Trophy, color: "#F59E0B", bg: "rgba(245,158,11,0.15)", label: "Conquista" },
    aula:      { icon: BookOpen, color: "#3B82F6", bg: "rgba(59,130,246,0.15)", label: "Aula" },
    prova:     { icon: CheckCircle, color: "#10B981", bg: "rgba(16,185,129,0.15)", label: "Prova" },
    exercicio: { icon: Code, color: "#8B5CF6", bg: "rgba(139,92,246,0.15)", label: "Exercício" },
    batalha:   { icon: Swords, color: "#EF4444", bg: "rgba(239,68,68,0.15)", label: "Batalha" },
  };

  const historicoConcluidos = timeline.filter(i => i.status === "concluido");
  const listaFiltrada = filtroCategoria === "todos"
    ? historicoConcluidos
    : historicoConcluidos.filter(i => i.categoria === filtroCategoria);

  const estatisticas = {
    totalMarcos: historicoConcluidos.length,
    totalXp: totalXpExibir,
    aulas: historicoConcluidos.filter(i => i.categoria === "aula").length,
    provas: historicoConcluidos.filter(i => i.categoria === "prova").length,
    batalhas: historicoConcluidos.filter(i => i.categoria === "batalha").length,
  };

  const proximosDesafios = [
    {
      id: "desafio-batalha",
      titulo: "Vitória na Arena de Batalha 1v1",
      descricao: "Vença um duelo de código contra outro aluno na Arena.",
      categoria: "batalha",
      xp: 300,
      badge: "⚔️ Duelista Dev",
      status: "em_progresso",
      progresso: "0/1 Vitória"
    },
    {
      id: "desafio-level",
      titulo: "Alcançar o Nível 2 (Rank Prata)",
      descricao: `Acumule 1.000 XP na plataforma DevHub (Faltam ${1000 - xpNoNivel} XP).`,
      categoria: "conquista",
      xp: 500,
      badge: "🚀 Level Up!",
      status: "bloqueado",
      progresso: `${percentualNivel}% Concluído`
    }
  ];

  // Badges Únicos
  const badgesUnicos = Array.from(
    new Map(
      timeline
        .filter(i => i.badge)
        .map(item => [item.badge, item])
    ).values()
  );

  const listaExibida = mostrarTodosHistorico ? listaFiltrada : listaFiltrada.slice(0, 4);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* ─────────────────────────────────────────────────────────────
          1. HERO HEADER DE PROGRESSO DO NÍVEL (GLASSMORPHIC CHIC)
         ───────────────────────────────────────────────────────────── */}
      <div style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)"
          : "linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, #FFFFFF 100%)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${isDark ? "rgba(168, 85, 247, 0.3)" : "rgba(168, 85, 247, 0.2)"}`,
        borderRadius: "24px",
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        boxShadow: isDark ? "0 12px 40px rgba(0,0,0,0.3)" : "0 6px 24px rgba(0,0,0,0.05)"
      }}>
        {/* Linha Superior: Emblema do Nível & Cards Estatísticos */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          {/* Lado Esquerdo: Nível do Aluno */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "60px", height: "60px", borderRadius: "20px", flexShrink: 0,
              background: "linear-gradient(135deg, #A855F7 0%, #EC4899 100%)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 25px rgba(168, 85, 247, 0.5)", color: "#FFF"
            }}>
              <span style={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", opacity: 0.9 }}>NÍVEL</span>
              <span style={{ fontSize: "22px", fontWeight: "900", lineHeight: "1" }}>{nivelAtual}</span>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{
                  fontSize: "11px", fontWeight: "900", padding: "3px 10px", borderRadius: "20px",
                  background: "rgba(168, 85, 247, 0.2)", color: "#A855F7", border: "1px solid rgba(168, 85, 247, 0.4)"
                }}>
                  👑 RANK APRENDIZ DEV
                </span>
                <span style={{ fontSize: "12px", color: isDark ? "#94A3B8" : "#64748B", fontWeight: "700" }}>
                  {totalXpExibir.toLocaleString("pt-BR")} XP Total
                </span>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: "900", margin: 0, color: isDark ? "#FFFFFF" : "#0F172A" }}>
                Sua Jornada no DevHub
              </h2>
            </div>
          </div>

          {/* Lado Direito: Cards Rápidos de Performance */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div style={{
              padding: "10px 16px", borderRadius: "14px",
              background: isDark ? "rgba(245, 158, 11, 0.12)" : "#FEF3C7",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              display: "flex", alignItems: "center", gap: "10px"
            }}>
              <span style={{ fontSize: "20px" }}>⭐</span>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "900", color: "#F59E0B", lineHeight: "1" }}>
                  {totalXpExibir.toLocaleString("pt-BR")} XP
                </div>
                <div style={{ fontSize: "10px", fontWeight: "800", color: isDark ? "#94A3B8" : "#64748B", textTransform: "uppercase", marginTop: "3px" }}>
                  Acumulados
                </div>
              </div>
            </div>

            <div style={{
              padding: "10px 16px", borderRadius: "14px",
              background: isDark ? "rgba(16, 185, 129, 0.12)" : "#D1FAE5",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              display: "flex", alignItems: "center", gap: "10px"
            }}>
              <span style={{ fontSize: "20px" }}>📝</span>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "900", color: "#10B981", lineHeight: "1" }}>
                  {estatisticas.provas}
                </div>
                <div style={{ fontSize: "10px", fontWeight: "800", color: isDark ? "#94A3B8" : "#64748B", textTransform: "uppercase", marginTop: "3px" }}>
                  Provas Aprovadas
                </div>
              </div>
            </div>

            <div style={{
              padding: "10px 16px", borderRadius: "14px",
              background: isDark ? "rgba(239, 68, 68, 0.12)" : "#FEE2E2",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              display: "flex", alignItems: "center", gap: "10px"
            }}>
              <span style={{ fontSize: "20px" }}>⚔️</span>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "900", color: "#EF4444", lineHeight: "1" }}>
                  {estatisticas.batalhas}
                </div>
                <div style={{ fontSize: "10px", fontWeight: "800", color: isDark ? "#94A3B8" : "#64748B", textTransform: "uppercase", marginTop: "3px" }}>
                  Duelos Arena
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Linha Inferior: Barra de Progresso do Nível com Brilho */}
        <div style={{
          padding: "16px 20px", borderRadius: "16px",
          background: isDark ? "rgba(15, 23, 42, 0.6)" : "#F8FAFC",
          border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0"}`
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: isDark ? "#CBD5E1" : "#475569", marginBottom: "8px", fontWeight: "800" }}>
            <span>🚀 Nível {nivelAtual} ➔ Nível {nivelAtual + 1}</span>
            <span style={{ color: "#A855F7" }}>{xpNoNivel} / 1.000 XP ({percentualNivel}%)</span>
          </div>
          <div style={{ height: "12px", borderRadius: "8px", background: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0", overflow: "hidden", position: "relative" }}>
            <div style={{
              height: "100%", width: `${percentualNivel}%`,
              background: "linear-gradient(90deg, #A855F7 0%, #EC4899 50%, #38BDF8 100%)",
              borderRadius: "8px", transition: "width 0.6s ease-in-out",
              boxShadow: "0 0 16px rgba(168, 85, 247, 0.5)"
            }} />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HISTÓRICO DE CONQUISTAS REALIZADAS (LINHA DO TEMPO CLARA)
         ───────────────────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
        borderRadius: "24px", padding: "24px",
        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "#E2E8F0"}`,
        boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.03)"
      }}>
        {/* Topo do Histórico + Filtros Categorizados */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "900", margin: 0, color: isDark ? "#FFF" : "#0F172A", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🏆</span> Conquistas & Atividades Concluídas
            </h3>
            <span style={{ fontSize: "12px", color: isDark ? "#94A3B8" : "#64748B", fontWeight: "600" }}>
              Histórico ordenado de conquistas e testes finalizados com sucesso
            </span>
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["todos", "conquista", "prova", "batalha", "aula"].map(f => {
              const isAtivo = filtroCategoria === f;
              const cfg = CATEGORIAS[f];
              const cor = cfg ? cfg.color : "#A855F7";
              const label = cfg ? cfg.label : "Todos";
              return (
                <button
                  key={f}
                  onClick={() => setFiltroCategoria(f)}
                  style={{
                    padding: "6px 14px", borderRadius: "10px", fontSize: "11.5px", fontWeight: "800", cursor: "pointer",
                    border: isAtivo ? `1.5px solid ${cor}` : `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0"}`,
                    background: isAtivo ? `${cor}25` : "transparent",
                    color: isAtivo ? cor : (isDark ? "#94A3B8" : "#64748B"),
                    transition: "all 0.2s"
                  }}
                >
                  {f === "todos" ? "🗂️ Todos" : label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista Limpa de Conquistas Passadas */}
        {listaFiltrada.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 20px", color: isDark ? "#94A3B8" : "#64748B" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</div>
            <p style={{ fontSize: "14px", fontWeight: "700", margin: 0 }}>Nenhuma conquista registrada nesta categoria.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {listaExibida.map((item) => {
              const config = CATEGORIAS[item.categoria] || CATEGORIAS.exercicio;
              const Icon = config.icon;

              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`,
                    borderLeft: `4px solid ${config.color}`,
                    borderRadius: "14px",
                    padding: "14px 18px",
                    transition: "all 0.2s"
                  }}
                >
                  {/* Badge da Data */}
                  <div style={{
                    minWidth: "70px", textAlign: "center", fontSize: "11px", fontWeight: "900",
                    color: config.color, backgroundColor: `${config.color}18`,
                    border: `1px solid ${config.color}35`,
                    padding: "6px 10px", borderRadius: "10px", flexShrink: 0
                  }}>
                    📅 {item.data_marco}
                  </div>

                  {/* Ícone da Categoria */}
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "12px",
                    backgroundColor: config.bg, border: `1px solid ${config.color}55`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: config.color, flexShrink: 0
                  }}>
                    <Icon size={18} />
                  </div>

                  {/* Detalhes do Marco */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                      <span style={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", color: config.color }}>
                        {config.label}
                      </span>
                      <span style={{ fontSize: "10px", fontWeight: "800", color: "#10B981", backgroundColor: "rgba(16, 185, 129, 0.15)", padding: "1px 6px", borderRadius: "6px" }}>
                        ✅ Concluído
                      </span>
                    </div>
                    <h4 style={{ fontSize: "14.5px", fontWeight: "800", margin: 0, color: isDark ? "#FFFFFF" : "#0F172A" }}>
                      {item.titulo}
                    </h4>
                    <p style={{ fontSize: "12.5px", color: isDark ? "#94A3B8" : "#64748B", margin: "2px 0 0 0" }}>
                      {item.descricao}
                    </p>
                  </div>

                  {/* Badges de Recompensa (XP + Tag) */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    {item.badge && (
                      <span style={{
                        background: `${config.color}20`, border: `1px solid ${config.color}45`,
                        borderRadius: "8px", padding: "4px 10px", fontSize: "11px", fontWeight: "800",
                        color: config.color
                      }}>
                        {item.badge}
                      </span>
                    )}
                    <span style={{
                      background: "rgba(245, 158, 11, 0.18)", border: "1px solid rgba(245, 158, 11, 0.4)",
                      borderRadius: "8px", padding: "4px 10px", fontSize: "11px", fontWeight: "900", color: "#F59E0B"
                    }}>
                      +{item.xp} XP
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Botão Ver Mais / Recolher */}
            {listaFiltrada.length > 4 && (
              <button
                onClick={() => setMostrarTodosHistorico(!mostrarTodosHistorico)}
                style={{
                  width: "100%", padding: "12px", marginTop: "6px",
                  background: isDark ? "rgba(168, 85, 247, 0.1)" : "#F3E8FF",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  borderRadius: "12px", color: "#A855F7", fontSize: "13px", fontWeight: "800",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  transition: "all 0.2s"
                }}
              >
                {mostrarTodosHistorico ? (
                  <><span>Recolher Histórico</span> <ChevronUp size={16} /></>
                ) : (
                  <><span>Ver Histórico Completo ({listaFiltrada.length} Conquistas)</span> <ChevronDown size={16} /></>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SEÇÃO SEPARADA: PRÓXIMAS METAS & DESAFIOS RECOMENDADOS
         ───────────────────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
        borderRadius: "24px", padding: "24px",
        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "#E2E8F0"}`,
        boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.03)"
      }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "900", margin: "0 0 16px 0", color: isDark ? "#FFF" : "#0F172A", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>🎯</span> Próximos Desafios & Objetivos Recomendados
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
          {proximosDesafios.map((meta) => (
            <div
              key={meta.id}
              style={{
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "#F8FAFC",
                border: `1.5px dashed ${isDark ? "rgba(255, 255, 255, 0.15)" : "#CBD5E1"}`,
                borderRadius: "16px",
                padding: "16px 18px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "12px"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "10.5px", fontWeight: "900", textTransform: "uppercase", color: "#F59E0B", backgroundColor: "rgba(245, 158, 11, 0.15)", padding: "2px 8px", borderRadius: "6px" }}>
                    {meta.status === "em_progresso" ? "⚡ Em Andamento" : "🔒 Meta de Nível"}
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "900", color: "#F59E0B" }}>
                    +{meta.xp} XP
                  </span>
                </div>

                <h4 style={{ fontSize: "15px", fontWeight: "800", margin: "0 0 4px 0", color: isDark ? "#FFF" : "#0F172A" }}>
                  {meta.titulo}
                </h4>
                <p style={{ fontSize: "12.5px", color: isDark ? "#94A3B8" : "#64748B", margin: 0 }}>
                  {meta.descricao}
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0"}`, paddingTop: "10px" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: isDark ? "#38BDF8" : "#0284C7" }}>
                  {meta.progresso}
                </span>
                <span style={{ fontSize: "11px", fontWeight: "800", color: isDark ? "#CBD5E1" : "#475569" }}>
                  {meta.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. GALERIA DE BADGES & MEDALHAS DESBLOQUEADAS
         ───────────────────────────────────────────────────────────── */}
      <div style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.95) 100%)"
          : "linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%)",
        border: "1.5px solid rgba(245, 158, 11, 0.3)",
        borderRadius: "24px",
        padding: "24px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "900", margin: 0, color: isDark ? "#F1F5F9" : "#0F172A", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🏅</span> Galeria de Badges & Medalhas ({badgesUnicos.length})
            </h3>
            <span style={{ fontSize: "12px", color: isDark ? "#94A3B8" : "#64748B", fontWeight: "600" }}>
              Conquistas e insígnias conquistadas na plataforma DevHub
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
          {badgesUnicos.map((item, i) => {
            const cfg = CATEGORIAS[item.categoria] || CATEGORIAS.exercicio;
            return (
              <div
                key={i}
                style={{
                  backgroundColor: isDark ? "rgba(15, 23, 42, 0.8)" : "#FFFFFF",
                  border: `1px solid ${cfg.color}45`,
                  borderRadius: "16px",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  boxShadow: `0 4px 16px ${cfg.color}15`,
                  transition: "all 0.2s"
                }}
              >
                <div style={{
                  width: "40px", height: "40px", borderRadius: "12px",
                  backgroundColor: `${cfg.color}22`, border: `1px solid ${cfg.color}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "20px", flexShrink: 0
                }}>
                  {item.badge.split(" ")[0] || "🏅"}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.badge.replace(/^.+?\s/, "") || item.badge}
                  </div>
                  <div style={{ fontSize: "10.5px", fontWeight: "800", color: cfg.color, marginTop: "2px" }}>
                    Raridade: {item.raridade || "Comum"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
