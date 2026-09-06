import { useState, useEffect } from "react";
import { TrendingUp, CheckCircle, Trophy, Rocket, Code, Award, Calendar, Zap, Star, Target, BookOpen, Swords, GitBranch, Flame, CheckCircle2, Lock, Sparkles } from "lucide-react";

export default function EvolucaoTimelineModule({ isDark, colors, user }) {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [xpTotal, setXpTotal] = useState(0);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    carregarTimeline();
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
      data_marco: "03/09",
      titulo: `Cadastrou-se no DevHub (${nomeUser})`,
      descricao: `Início oficial da jornada de ${nomeUser} como programador na plataforma DevHub.`,
      categoria: "conquista",
      xp: 100,
      badge: "🎉 Boas-Vindas",
      status: "concluido"
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
                  data_marco: p.dataRealizacao || p.dataConclusao || "05/09",
                  titulo: `Prova Concluída: ${tituloProva}`,
                  descricao: `Realizou a avaliação online com nota final de ${notaVal.toFixed(1)}/10.`,
                  categoria: "prova",
                  xp: notaVal >= 9.0 ? 250 : 180,
                  badge: notaVal >= 9.0 ? "🌟 Nota Excelente" : "✅ Aprovado",
                  status: "concluido"
                });
              }
            });
          }
        }
      } catch (e) {}

      // 3. Duelos 1v1 na Arena de Código
      try {
        const rawDuelos = localStorage.getItem("devhub_duelos_historico");
        if (rawDuelos) {
          const list = JSON.parse(rawDuelos);
          if (Array.isArray(list)) {
            list.forEach((d, idx) => {
              marcosDinamicos.push({
                id: `duelo-${idx}`,
                data_marco: d.data || "05/09",
                titulo: `Batalha 1v1 na Arena: ${d.desafio || "Validação de Parênteses"}`,
                descricao: `Enfrentou ${d.oponente || "rival"} na Arena de Código. Resultado: ${d.resultado === 'vitoria' ? 'Vitória 🏆' : 'Participação ⚔️'}.`,
                categoria: "batalha",
                xp: d.resultado === 'vitoria' ? 300 : 120,
                badge: d.resultado === 'vitoria' ? "🏆 Gladiador Dev" : "⚔️ Duelista Arena",
                status: "concluido"
              });
            });
          }
        }
      } catch (e) {}

      // 4. Aulas e Módulos Assistidos
      try {
        const rawAulas = localStorage.getItem("devhub_aulas_concluidas");
        if (rawAulas) {
          const list = JSON.parse(rawAulas);
          if (Array.isArray(list)) {
            list.forEach((a, idx) => {
              marcosDinamicos.push({
                id: `aula-${idx}`,
                data_marco: a.data || "04/09",
                titulo: `Módulo Concluído: ${a.titulo || "Fundamentos de JavaScript ES6+"}`,
                descricao: `Estudou o conteúdo completo e dominou os conceitos do módulo.`,
                categoria: "aula",
                xp: 140,
                badge: "📚 Estudante ES6",
                status: "concluido"
              });
            });
          }
        }
      } catch (e) {}

      // 5. Exercícios e Anotações no Caderno de Estudos
      try {
        const rawCaderno = localStorage.getItem("devhub_caderno_anotacoes");
        if (rawCaderno) {
          const list = JSON.parse(rawCaderno);
          if (Array.isArray(list) && list.length > 0) {
            marcosDinamicos.push({
              id: "caderno-anotacoes",
              data_marco: "05/09",
              titulo: `Caderno de Estudos: ${list.length} Anotações Registradas`,
              descricao: `Registrou resumo técnico e anotações para revisão de conteúdo.`,
              categoria: "exercicio",
              xp: 110,
              badge: "📝 Caderno Ativo",
              status: "concluido"
            });
          }
        }
      } catch (e) {}
    }

    // Trilha de conquistas e objetivos futuros (desbloqueados conforme o usuário pratica)
    const MARCOS_PADRAO_COMPLEMENTARES = [
      { id: "p-aula1", data_marco: "Próximo", titulo: "Módulo Fundamentos de JavaScript ES6+", descricao: "Estude o módulo de JavaScript para desbloquear esta conquista.", categoria: "aula", xp: 120, badge: "📚 Estudante ES6", status: "em_progresso" },
      { id: "p-prova1", data_marco: "Próximo", titulo: "Primeira Prova Online Aprovada", descricao: "Realize e seja aprovado em uma prova online para conquistar o selo de aprovação.", categoria: "prova", xp: 200, badge: "✅ Aprovado", status: "proximo" },
      { id: "p-streak", data_marco: "Próximo", titulo: "Sequência de Estudos: 3 dias 🔥", descricao: "Acesse a plataforma por 3 dias consecutivos para acender a chama da ofensiva.", categoria: "streak", xp: 100, badge: "🔥 Em Chamas", status: "proximo" },
      { id: "p-batalha", data_marco: "Próximo", titulo: "Vitória na Arena Batalha de Código 1v1 ⚔️", descricao: "Vença um duelo de código contra um colega na Arena 1v1.", categoria: "batalha", xp: 300, badge: "⚔️ Duelista Dev", status: "proximo" },
      { id: "p-pair", data_marco: "Próximo", titulo: "Sessão de Pair Programming Concluída 🤝", descricao: "Complete um desafio colaborativo de programação em dupla.", categoria: "pair", xp: 220, badge: "🤝 Co-Piloto", status: "proximo" },
      { id: "f-react", data_marco: "Meta", titulo: "Módulo React & Componentização Funcional", descricao: "Dominando useState, useEffect e Hooks customizados no frontend.", categoria: "aula", xp: 180, badge: "⚛️ Dev React", status: "bloqueado" },
      { id: "f-level", data_marco: "Meta", titulo: "Subir para o Nível Superior (Rank Prata) 🚀", descricao: "Ultrapassar a marca de 1.000 XP acumulados na plataforma.", categoria: "conquista", xp: 500, badge: "🚀 Level Up!", status: "bloqueado" },
      { id: "f-project", data_marco: "Meta", titulo: "Projeto Full Stack API REST + Frontend", descricao: "Construção de uma API completa em Node.js integrada com dashboard React.", categoria: "projeto", xp: 450, badge: "🏗️ Full Stack", status: "bloqueado" },
      { id: "f-hall", data_marco: "Meta", titulo: "Entrada no Top 5 do Hall da Fama 🏆", descricao: "Alcance o topo do ranking acumulando conquistas e vitórias em batalhas.", categoria: "conquista", xp: 600, badge: "🏆 Hall da Fama", status: "bloqueado" }
    ];

    // Mescla mantendo marcos dinâmicos no topo sem duplicar IDs
    const idsExistentes = new Set(marcosDinamicos.map(m => m.id));
    const complementos = MARCOS_PADRAO_COMPLEMENTARES.filter(m => !idsExistentes.has(m.id));

    const finalTimeline = [...marcosDinamicos, ...complementos];
    const totalXp = finalTimeline.filter(i => i.status === "concluido").reduce((acc, i) => acc + (i.xp || 0), 0);

    setTimeline(finalTimeline);
    setXpTotal(totalXp);
    setLoading(false);
  };

  const listaExibicao = timeline;
  const totalXpExibir = xpTotal;
  const nivelAtual = Math.floor(totalXpExibir / 1000) + 1;
  const xpNoNivel = totalXpExibir % 1000;
  const percentualNivel = Math.min(100, Math.round((xpNoNivel / 1000) * 100));

  const CATEGORIAS = {
    conquista: { icon: Trophy, color: "#F59E0B", bg: "rgba(245,158,11,0.15)", label: "Conquista" },
    aula:      { icon: BookOpen, color: "#3B82F6", bg: "rgba(59,130,246,0.15)", label: "Aula" },
    prova:     { icon: CheckCircle, color: "#10B981", bg: "rgba(16,185,129,0.15)", label: "Prova" },
    exercicio: { icon: Code, color: "#8B5CF6", bg: "rgba(139,92,246,0.15)", label: "Exercício" },
    projeto:   { icon: Rocket, color: "#EC4899", bg: "rgba(236,72,153,0.15)", label: "Projeto" },
    batalha:   { icon: Swords, color: "#EF4444", bg: "rgba(239,68,68,0.15)", label: "Batalha" },
    streak:    { icon: Flame, color: "#F97316", bg: "rgba(249,115,22,0.15)", label: "Streak" },
    pair:      { icon: GitBranch, color: "#06B6D4", bg: "rgba(6,182,212,0.15)", label: "Pair Prog." },
  };

  const filtros = ["todos", ...Object.keys(CATEGORIAS)];
  const listaFiltrada = filtroCategoria === "todos"
    ? listaExibicao
    : listaExibicao.filter(i => i.categoria === filtroCategoria);

  const estatisticas = {
    totalMarcos: listaExibicao.length,
    totalXp: totalXpExibir,
    aulas: listaExibicao.filter(i => i.categoria === "aula").length,
    provas: listaExibicao.filter(i => i.categoria === "prova").length,
    batalhas: listaExibicao.filter(i => i.categoria === "batalha").length,
    projetos: listaExibicao.filter(i => i.categoria === "projeto").length,
  };

  const cardEstat = (label, valor, cor, emoji) => (
    <div style={{
      flex: 1, minWidth: "110px",
      background: isDark ? `${cor}12` : `${cor}10`,
      border: `1px solid ${cor}30`,
      borderRadius: "16px",
      padding: "16px 14px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "22px", marginBottom: "4px" }}>{emoji}</div>
      <div style={{ fontSize: "22px", fontWeight: "900", color: cor }}>{valor}</div>
      <div style={{ fontSize: "11px", fontWeight: "700", color: isDark ? "#94A3B8" : "#64748B", textTransform: "uppercase", marginTop: "2px" }}>{label}</div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header com Estilo Visual Rico */}
      <div style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(236,72,153,0.14) 0%, rgba(139,92,246,0.12) 100%)"
          : "linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(139,92,246,0.06) 100%)",
        border: `1px solid ${isDark ? "rgba(236,72,153,0.25)" : "rgba(236,72,153,0.15)"}`,
        borderRadius: "20px",
        padding: "26px 30px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
      }}>
        <div style={{
          width: "60px", height: "60px", borderRadius: "18px", flexShrink: 0,
          background: "linear-gradient(135deg, #EC4899 0%, #A855F7 100%)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px",
          boxShadow: "0 8px 24px rgba(236,72,153,0.35)",
        }}>📈</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "22px", fontWeight: "900", margin: "0 0 4px 0", color: isDark ? "#F1F5F9" : "#0F172A" }}>
            Sua Evolução no DevHub
          </h2>
          <p style={{ color: isDark ? "#94A3B8" : "#64748B", fontSize: "14px", margin: 0 }}>
            Linha do tempo completa mostrando cada conquista, prova, batalha e marco da sua jornada como programador.
          </p>
        </div>
        {/* Badge Nível e XP */}
        <div style={{
          background: isDark ? "rgba(245,158,11,0.12)" : "#FEF3C7",
          border: "1px solid rgba(245,158,11,0.35)",
          borderRadius: "18px", padding: "14px 22px", textAlign: "center", flexShrink: 0,
        }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.06em" }}>Nível Atual</div>
          <div style={{ fontSize: "28px", fontWeight: "900", color: "#F59E0B", lineHeight: 1 }}>Lv.{nivelAtual}</div>
          <div style={{ fontSize: "11px", color: isDark ? "#94A3B8" : "#64748B", marginTop: "2px" }}>{totalXpExibir.toLocaleString("pt-BR")} XP Acumulado</div>
        </div>
      </div>

      {/* Barra de Progresso de XP no Nível */}
      <div style={{
        background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "#E2E8F0"}`,
        borderRadius: "18px", padding: "18px 24px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ fontSize: "13.5px", fontWeight: "800", color: isDark ? "#CBD5E1" : "#374151" }}>
            ⚡ Progresso para o Nível {nivelAtual + 1}
          </span>
          <span style={{ fontSize: "12.5px", fontWeight: "800", color: "#A855F7" }}>
            {xpNoNivel} / 1.000 XP ({percentualNivel}%)
          </span>
        </div>
        <div style={{ height: "12px", borderRadius: "8px", background: isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${percentualNivel}%`,
            background: "linear-gradient(90deg, #EC4899 0%, #A855F7 50%, #6366F1 100%)",
            borderRadius: "8px", transition: "width 1s ease",
            boxShadow: "0 0 12px rgba(168,85,247,0.4)",
          }} />
        </div>
      </div>

      {/* Cards de Métricas e Estatísticas */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {cardEstat("Marcos", estatisticas.totalMarcos, "#6366F1", "🏅")}
        {cardEstat("XP Total", estatisticas.totalXp.toLocaleString("pt-BR"), "#F59E0B", "⭐")}
        {cardEstat("Aulas", estatisticas.aulas, "#3B82F6", "📚")}
        {cardEstat("Provas", estatisticas.provas, "#10B981", "✅")}
        {cardEstat("Batalhas", estatisticas.batalhas, "#EF4444", "⚔️")}
        {cardEstat("Projetos", estatisticas.projetos, "#EC4899", "🚀")}
      </div>

      {/* Filtros de Categoria */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {filtros.map(f => {
          const isAtivo = filtroCategoria === f;
          const cfg = CATEGORIAS[f];
          const cor = cfg ? cfg.color : "#6366F1";
          const label = cfg ? cfg.label : "Todos os Marcos";
          return (
            <button
              key={f}
              onClick={() => setFiltroCategoria(f)}
              style={{
                padding: "7px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "800", cursor: "pointer",
                border: `1.5px solid ${isAtivo ? cor : (isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0")}`,
                background: isAtivo ? `${cor}22` : "transparent",
                color: isAtivo ? cor : (isDark ? "#94A3B8" : "#64748B"),
                transition: "all 0.2s",
                textTransform: "capitalize",
              }}
            >
              {f === "todos" ? "🗂️ Todos os Marcos" : label}
            </button>
          );
        })}
      </div>

      {/* Container da Timeline Vertical Completa */}
      <div style={{
        backgroundColor: colors?.bgCard || "#1E293B", borderRadius: "24px", padding: "32px 26px",
        border: `1px solid ${colors?.borderCard || "rgba(255,255,255,0.1)"}`, position: "relative",
      }}>
        {/* Linha condutora vertical */}
        <div style={{
          position: "absolute", top: "50px", bottom: "50px", left: "80px", width: "3px",
          background: "linear-gradient(180deg, #F59E0B 0%, #10B981 25%, #3B82F6 50%, #A855F7 75%, #EC4899 100%)",
          borderRadius: "3px",
        }} />

        {listaFiltrada.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: isDark ? "#64748B" : "#94A3B8" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
            <p style={{ fontSize: "15px", fontWeight: "700" }}>Nenhum marco nessa categoria ainda.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
            {listaFiltrada.map((item, index) => {
              const config = CATEGORIAS[item.categoria] || CATEGORIAS.exercicio;
              const Icon = config.icon;
              const isConcluido = item.status === "concluido" || !item.status;
              const isEmProgresso = item.status === "em_progresso";
              const isProximo = item.status === "proximo";
              const isBloqueado = item.status === "bloqueado";

              return (
                <div key={item.id || index} style={{
                  display: "flex", alignItems: "flex-start", gap: "20px", position: "relative", zIndex: 2,
                  opacity: isBloqueado ? 0.65 : 1
                }}>
                  {/* Data */}
                  <div style={{
                    minWidth: "54px", textAlign: "center", fontSize: "12px", fontWeight: "900",
                    color: isBloqueado ? "#64748B" : config.color,
                    background: isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9",
                    padding: "6px 8px", borderRadius: "10px", flexShrink: 0,
                    border: `1px solid ${isBloqueado ? "rgba(255,255,255,0.08)" : config.color + "40"}`,
                  }}>
                    {item.data_marco}
                  </div>

                  {/* Ícone marcador */}
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    backgroundColor: isBloqueado ? "rgba(255,255,255,0.05)" : config.bg,
                    border: `2.5px solid ${isBloqueado ? "#64748B" : config.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: isBloqueado ? "#64748B" : config.color,
                    flexShrink: 0, boxShadow: isBloqueado ? "none" : `0 0 16px ${config.color}35`, marginTop: "2px",
                  }}>
                    {isBloqueado ? <Lock size={18} /> : <Icon size={20} />}
                  </div>

                  {/* Card do Marco */}
                  <div style={{
                    flex: 1, backgroundColor: isDark ? "rgba(255,255,255,0.025)" : "#F8FAFC",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "#E2E8F0"}`,
                    borderRadius: "18px", padding: "16px 20px",
                    borderLeft: `4px solid ${isBloqueado ? "#64748B" : config.color}`,
                    transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "6px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{
                            fontSize: "10px", fontWeight: "900", textTransform: "uppercase",
                            color: isBloqueado ? "#64748B" : config.color, letterSpacing: "0.06em",
                          }}>
                            MARCO DE {config.label}
                          </span>
                          {isConcluido && (
                            <span style={{ fontSize: "10px", fontWeight: "800", color: "#10B981", background: "rgba(16,185,129,0.15)", padding: "2px 8px", borderRadius: "8px" }}>
                              ✅ Concluído
                            </span>
                          )}
                          {isEmProgresso && (
                            <span style={{ fontSize: "10px", fontWeight: "800", color: "#F59E0B", background: "rgba(245,158,11,0.15)", padding: "2px 8px", borderRadius: "8px" }}>
                              🔥 Em Andamento
                            </span>
                          )}
                          {isProximo && (
                            <span style={{ fontSize: "10px", fontWeight: "800", color: "#3B82F6", background: "rgba(59,130,246,0.15)", padding: "2px 8px", borderRadius: "8px" }}>
                              🎯 Próxima Meta
                            </span>
                          )}
                          {isBloqueado && (
                            <span style={{ fontSize: "10px", fontWeight: "800", color: "#64748B", background: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: "8px" }}>
                              🔒 Futuro Marco
                            </span>
                          )}
                        </div>
                        <h4 style={{ fontSize: "16px", fontWeight: "800", margin: "4px 0 0 0", color: isDark ? "#F1F5F9" : "#0F172A" }}>
                          {item.titulo}
                        </h4>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                        {item.badge && (
                          <span style={{
                            background: isBloqueado ? "rgba(255,255,255,0.05)" : `${config.color}18`,
                            border: `1px solid ${isBloqueado ? "rgba(255,255,255,0.1)" : config.color + "40"}`,
                            borderRadius: "10px", padding: "4px 10px", fontSize: "11px", fontWeight: "800",
                            color: isBloqueado ? "#64748B" : config.color,
                          }}>
                            {item.badge}
                          </span>
                        )}
                        {item.xp && (
                          <span style={{
                            background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)",
                            borderRadius: "10px", padding: "4px 10px", fontSize: "11px", fontWeight: "900", color: "#F59E0B",
                          }}>
                            +{item.xp} XP
                          </span>
                        )}
                      </div>
                    </div>
                    {item.descricao && (
                      <p style={{ fontSize: "13.5px", color: isDark ? "#94A3B8" : "#64748B", margin: 0, lineHeight: "1.5", fontWeight: "500" }}>
                        {item.descricao}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Galeria de Badges Desbloqueados */}
      <div style={{
        background: isDark ? "rgba(245,158,11,0.06)" : "#FFFBEB",
        border: "1px solid rgba(245,158,11,0.2)",
        borderRadius: "22px", padding: "24px 26px",
      }}>
        <h3 style={{ fontSize: "17px", fontWeight: "900", margin: "0 0 16px 0", color: isDark ? "#F1F5F9" : "#0F172A", display: "flex", alignItems: "center", gap: "8px" }}>
          🏅 Sua Coleção de Conquistas & Badges
        </h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {listaExibicao.filter(i => i.badge).map((item, i) => {
            const cfg = CATEGORIAS[item.categoria] || CATEGORIAS.exercicio;
            return (
              <div key={i} style={{
                background: isDark ? `${cfg.color}15` : `${cfg.color}10`,
                border: `1.5px solid ${cfg.color}40`,
                borderRadius: "14px", padding: "8px 14px",
                fontSize: "13px", fontWeight: "800", color: cfg.color,
                display: "flex", alignItems: "center", gap: "6px",
              }}>
                {item.badge}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
