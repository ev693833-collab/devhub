import { useState, useEffect } from "react";
import styles from "./HallDaFamaModule.module.css";
import { Trophy, Medal, Award, Flame, Code, Sparkles, User, Star, Crown, Zap, BookOpen, Swords, CheckCircle2, Info, HelpCircle } from "lucide-react";

export default function HallDaFamaModule({ isDark, colors, user }) {
  const [categoria, setCategoria] = useState("geral");
  const [dadosHall, setDadosHall] = useState({
    geral: [],
    melhorFrontend: [],
    melhorBackend: [],
    melhorLogica: [],
    maiorEvolucao: []
  });
  const [loading, setLoading] = useState(true);
  const [mostrarGuia, setMostrarGuia] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    carregarHall();

    const handleAtualizar = () => {
      carregarHall();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("devhub_estudo_realizado", handleAtualizar);
      window.addEventListener("devhub_aula_assistida", handleAtualizar);
      window.addEventListener("devhub_batalha_concluida", handleAtualizar);
      window.addEventListener("devhub_gamificacao_update", handleAtualizar);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("devhub_estudo_realizado", handleAtualizar);
        window.removeEventListener("devhub_aula_assistida", handleAtualizar);
        window.removeEventListener("devhub_batalha_concluida", handleAtualizar);
        window.removeEventListener("devhub_gamificacao_update", handleAtualizar);
      }
    };
  }, [user]);

  const carregarHall = async () => {
    try {
      setLoading(true);
      let data = { geral: [], melhorFrontend: [], melhorBackend: [], melhorLogica: [], maiorEvolucao: [] };
      
      const res = await fetch(`${apiUrl}/gamificacao/hall-da-fama`);
      if (res.ok) {
        data = await res.json();
      }

      // Sincronizar dados do usuário logado localmente para garantir fogo aceso dinâmico!
      if (typeof window !== "undefined") {
        let currentUser = user;
        if (!currentUser) {
          try {
            const raw = localStorage.getItem("userData");
            if (raw) currentUser = JSON.parse(raw);
          } catch (e) {}
        }

        const nomeUser = currentUser?.nome || "Você";
        const emailUser = currentUser?.email || "aluno@devhub.com";

        // Calcular total de atividades do aluno logado
        let totalAulas = 0;
        let totalProvas = 0;
        let totalDuelos = 0;
        let totalNotas = 0;

        try {
          const rawAulas = localStorage.getItem("devhub_aulas_video_assistidas");
          if (rawAulas) {
            const parsed = JSON.parse(rawAulas);
            totalAulas = Object.values(parsed || {}).filter(Boolean).length;
          }
        } catch (e) {}

        try {
          const rawProvas = localStorage.getItem("devhub_provas_concluidas") || localStorage.getItem("devhub_notas_alunos");
          if (rawProvas) {
            const parsed = JSON.parse(rawProvas);
            if (Array.isArray(parsed)) totalProvas = parsed.length;
          }
        } catch (e) {}

        try {
          const rawDuelos = localStorage.getItem("devhub_duelos_historico") || localStorage.getItem("devhub_batalhas_concluidas");
          if (rawDuelos) {
            const parsed = JSON.parse(rawDuelos);
            if (Array.isArray(parsed)) totalDuelos = parsed.length;
          }
        } catch (e) {}

        try {
          const rawNotas = localStorage.getItem("devhub_caderno_anotacoes");
          if (rawNotas) {
            const parsed = JSON.parse(rawNotas);
            if (Array.isArray(parsed)) totalNotas = parsed.length;
          }
        } catch (e) {}

        const totalAtividades = totalAulas + totalProvas + totalDuelos + totalNotas;

        // Calcular título e chamas com base na quantidade/média de atividades concluídas
        let fogoSemanas = 0;
        let titulo = "💀 Chama Apagada";

        if (totalAtividades >= 5) {
          fogoSemanas = 3;
          titulo = "👑 Mestre do Fogo";
        } else if (totalAtividades >= 3) {
          fogoSemanas = 2;
          titulo = "⚡ Dev Incandescente";
        } else if (totalAtividades >= 1) {
          fogoSemanas = 1;
          titulo = "🔥 Chama Acesa";
        }

        const xpCalculado = 100 + totalAulas * 140 + totalProvas * 200 + totalDuelos * 300 + totalNotas * 100;

        // Atualizar ou inserir aluno logado na lista
        if (Array.isArray(data.geral)) {
          const userIndex = data.geral.findIndex(
            a => a.nome?.toLowerCase() === nomeUser.toLowerCase() || (a.email && a.email.toLowerCase() === emailUser.toLowerCase())
          );

          const objAluno = {
            posicao: 1,
            nome: nomeUser,
            email: emailUser,
            xp: Math.max(xpCalculado, data.geral[userIndex]?.xp || 0),
            fogoSemanas: Math.max(fogoSemanas, data.geral[userIndex]?.fogoSemanas || 1),
            titulo: totalAtividades > 0 ? titulo : (data.geral[userIndex]?.titulo || titulo),
            desafios: totalAtividades,
            batalhas: totalDuelos
          };

          if (userIndex >= 0) {
            data.geral[userIndex] = { ...data.geral[userIndex], ...objAluno };
          } else {
            data.geral.push(objAluno);
          }

          // Re-ordenar ranking por semanas em chamas e XP
          data.geral.sort((a, b) => b.fogoSemanas - a.fogoSemanas || b.xp - a.xp);
          data.geral = data.geral.map((item, idx) => ({ ...item, posicao: idx + 1 }));

          data.melhorFrontend = [...data.geral].sort((a, b) => b.fogoSemanas - a.fogoSemanas);
          data.melhorBackend = [...data.geral].sort((a, b) => b.xp - a.xp);
          data.melhorLogica = [...data.geral];
          data.maiorEvolucao = [...data.geral].slice().reverse();
        }
      }

      setDadosHall(data);
    } catch (e) {
      console.error("Erro ao carregar Hall da Fama:", e);
    } finally {
      setLoading(false);
    }
  };

  const listaAtual = Array.isArray(dadosHall?.[categoria])
    ? dadosHall[categoria]
    : (Array.isArray(dadosHall) ? dadosHall : []);
  const top3 = Array.isArray(listaAtual) ? listaAtual.slice(0, 3) : [];
  const restante = Array.isArray(listaAtual) ? listaAtual.slice(3) : [];

  const CATEGORIAS = [
    { id: "geral", nome: "Destaques Gerais", desc: "Os alunos com a maior constância de estudos" },
    { id: "melhorFrontend", nome: "Maior Foco Semanal", desc: "Líderes em constância de estudo" },
    { id: "melhorBackend", nome: "Maiores Pontuadores", desc: "Ranking por atividades acumuladas" },
    { id: "maiorEvolucao", nome: "Sequências Acadêmicas", desc: "Sequências ininterruptas de estudo" }
  ];

  return (
    <div className={styles.container}>
      {/* HEADER PRINCIPAL */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 className={styles.headerTitle}>
            Ranking & Desempenho Técnico
          </h2>
          <p className={styles.headerDesc}>
            Acompanhe os alunos em destaque por engajamento técnico e constância de estudos semanal.
          </p>
        </div>

        {/* ABAS DE CATEGORIAS */}
        <div className={styles.categoryBar}>
          {CATEGORIAS.map(cat => {
            const isActive = categoria === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoria(cat.id)}
                className={styles.categoryBtn}
                style={{
                  border: isActive ? "1.5px solid #3B82F6" : "1px solid rgba(255,255,255,0.12)",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.15) 100%)"
                    : "rgba(30, 41, 59, 0.6)",
                  color: isActive ? "#60A5FA" : "#94A3B8",
                  boxShadow: isActive ? "0 4px 20px rgba(59, 130, 246, 0.3)" : "none"
                }}
              >
                {cat.nome}
              </button>
            );
          })}
        </div>
      </div>

      {/* PAINEL EXPLICATIVO: MÉTRICA DE CONSTÂNCIA */}
      <div style={{
        background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        borderRadius: "16px",
        padding: "20px 24px",
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", cursor: "pointer" }} onClick={() => setMostrarGuia(!mostrarGuia)}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Award style={{ color: "#3B82F6", width: 22, height: 22 }} />
            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#FFF" }}>
              Métrica de Constância & Frequência Semanal
            </h3>
          </div>
          <span style={{ fontSize: "0.85rem", color: "#3B82F6", fontWeight: 700 }}>
            {mostrarGuia ? "Ocultar Guia ▲" : "Ver Regras de Frequência ▼"}
          </span>
        </div>

        {mostrarGuia && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "12px" }}>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "#CBD5E1", lineHeight: 1.5 }}>
              Para manter a <strong>presença ativa</strong> no ciclo acadêmico, o aluno deve concluir módulos ou atividades práticas na plataforma durante a semana.
            </p>

            {/* TABELA DE CRITÉRIOS DE FREQUÊNCIA */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
              <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)", padding: "12px 16px", borderRadius: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "#EF4444", fontSize: "0.9rem" }}>
                  Inativo na Semana
                </div>
                <div style={{ fontSize: "0.8rem", color: "#94A3B8", marginTop: "4px" }}>
                  0 atividades concluídas na semana.
                </div>
              </div>

              <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "12px 16px", borderRadius: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "#F59E0B", fontSize: "0.9rem" }}>
                  Frequência Ativa (1 sem)
                </div>
                <div style={{ fontSize: "0.8rem", color: "#CBD5E1", marginTop: "4px" }}>
                  <strong>1 a 2 Atividades</strong> concluídas (Videoaula ou Exercício).
                </div>
              </div>

              <div style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "12px 16px", borderRadius: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "#3B82F6", fontSize: "0.9rem" }}>
                  Frequência Alta (2 sem)
                </div>
                <div style={{ fontSize: "0.8rem", color: "#CBD5E1", marginTop: "4px" }}>
                  <strong>3 a 4 Atividades</strong> (Aulas + Prática no Executor + Prova).
                </div>
              </div>

              <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "12px 16px", borderRadius: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "#10B981", fontSize: "0.9rem" }}>
                  Constância Excepcional (3+ sem)
                </div>
                <div style={{ fontSize: "0.8rem", color: "#CBD5E1", marginTop: "4px" }}>
                  <strong>5+ Atividades</strong> ou +500 pontos acumulados no ciclo semanal.
                </div>
              </div>
            </div>

            {/* LISTA DE ATIVIDADES QUE REGISTRAM PRESENÇA */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "4px", fontSize: "0.82rem", color: "#94A3B8" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: "8px" }}>
                <BookOpen style={{ width: 14, height: 14, color: "#3B82F6" }} /> 1 Videoaula Assistida = Registra Presença
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: "8px" }}>
                <Code style={{ width: 14, height: 14, color: "#10B981" }} /> 1 Laboratório Prático Concluído = Registra Presença
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: "8px" }}>
                <CheckCircle2 style={{ width: 14, height: 14, color: "#10B981" }} /> 1 Prova Online Concluída = Acende o Fogo
              </span>
            </div>
          </div>
        )}
      </div>

      {/* PÓDIO 3D DOS TOP 3 (3D ESPORTS STAGE) */}
      {top3.length > 0 && (
        <div className={styles.podiumWrapper}>
          <div className={styles.podiumContainer}>
            {/* 2º LUGAR - PRATA (ESQUERDA) */}
            {top3[1] && (
              <div className={`${styles.podiumCard} ${styles.podiumCardSilver}`}>
                <div className={styles.podiumBoxSilver}>
                  <div className={styles.avatarCircleSilver}>
                    <span>{top3[1]?.nome?.charAt(0)?.toUpperCase() || "2"}</span>
                  </div>
                  <strong className={styles.userName}>{top3[1]?.nome || "Aluno"}</strong>
                  <span className={styles.userTitle}>{top3[1]?.titulo || "Frequência Alta"}</span>

                  <div className={styles.flameStreak}>
                    {top3[1]?.fogoSemanas || top3[1]?.desafios || 1} Semanas Consecutivas
                  </div>
                  <div className={styles.xpBadge}>{top3[1]?.xp || 0} Pontos</div>
                </div>
                <div className={styles.pedestalSilver}>2º LUGAR</div>
              </div>
            )}

            {/* 1º LUGAR - DESTAQUE PRINCIPAL */}
            {top3[0] && (
              <div className={`${styles.podiumCard} ${styles.podiumCardGold}`}>
                <div className={styles.podiumBoxGold}>
                  <div className={styles.avatarCircleGold}>
                    <span>{top3[0]?.nome?.charAt(0)?.toUpperCase() || "1"}</span>
                  </div>
                  <strong className={styles.userNameGold}>{top3[0]?.nome || "Aluno"}</strong>
                  <span className={styles.userTitleGold}>{top3[0]?.titulo || "Constância Excepcional"}</span>

                  <div className={styles.flameStreakGold}>
                    {top3[0]?.fogoSemanas || top3[0]?.desafios || 1} Semanas Consecutivas
                  </div>
                  <div className={styles.xpBadgeGold}>{top3[0]?.xp || 0} Pontos</div>
                </div>
                <div className={styles.pedestalGold}>1º LUGAR DESTAQUE</div>
              </div>
            )}

            {/* 3º LUGAR - BRONZE */}
            {top3[2] && (
              <div className={`${styles.podiumCard} ${styles.podiumCardBronze}`}>
                <div className={styles.podiumBoxBronze}>
                  <div className={styles.avatarCircleBronze}>
                    <span>{top3[2]?.nome?.charAt(0)?.toUpperCase() || "3"}</span>
                  </div>
                  <strong className={styles.userName}>{top3[2]?.nome || "Aluno"}</strong>
                  <span className={styles.userTitleBronze}>{top3[2]?.titulo || "Frequência Ativa"}</span>

                  <div className={styles.flameStreak}>
                    {top3[2]?.fogoSemanas || top3[2]?.desafios || 1} Semanas Consecutivas
                  </div>
                  <div className={styles.xpBadge}>{top3[2]?.xp || 0} Pontos</div>
                </div>
                <div className={styles.pedestalBronze}>3º LUGAR</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TABELA DE CLASSIFICAÇÃO (#4 A #10+) */}
      <div className={styles.tableWrapper}>
        <table className={styles.leaderTable}>
          <thead>
            <tr className={styles.tableHeader}>
              <th>Posição</th>
              <th>Aluno</th>
              <th>Título de Fogo</th>
              <th>Sequência de Fogo (Semanas 🔥)</th>
              <th style={{ textAlign: "right" }}>XP Total</th>
            </tr>
          </thead>
          <tbody>
            {restante.map((aluno, index) => {
              if (!aluno) return null;
              const isApagada = (aluno?.titulo || "").toLowerCase().includes("apagada");
              return (
                <tr key={index} className={styles.tableRow}>
                  <td className={styles.rankNumber}>#{index + 4}</td>
                  <td>
                    <div className={styles.studentCell}>
                      <div className={styles.studentAvatar}>
                        {aluno?.nome?.charAt(0)?.toUpperCase() || "D"}
                      </div>
                      <span className={styles.studentName}>{aluno?.nome || "Aluno"}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.titleBadge} ${isApagada ? styles.titleBadgeOff : styles.titleBadgeActive}`}>
                      {aluno?.titulo || "Chama Ativa"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.streakCell}>
                      🔥 {aluno?.fogoSemanas || aluno?.desafios || 1} Semanas Incandescente
                    </div>
                  </td>
                  <td className={styles.xpCell}>{aluno?.xp || 0} XP</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
