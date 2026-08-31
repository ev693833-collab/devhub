import { useState, useEffect } from "react";
import { Flame, Award, Zap, Check, X, Code, Crown, AlertCircle } from "lucide-react";
import styles from "./StudentGamificationHeader.module.css";

export default function StudentGamificationHeader({ user }) {
  const [stats, setStats] = useState({
    xp: 0,
    skills: [
      { nome: "JavaScript", progresso: 0, cor: "#F7DF1E" },
      { nome: "React", progresso: 0, cor: "#61DAFB" },
      { nome: "Node.js", progresso: 0, cor: "#68A063" },
      { nome: "SQL", progresso: 0, cor: "#00758F" },
      { nome: "Git", progresso: 0, cor: "#F05032" }
    ]
  });

  const [streakDias, setStreakDias] = useState(0);
  const [estudouHojeState, setEstudouHojeState] = useState(false);
  const [historicoDias, setHistoricoDias] = useState([
    { dia: "Seg", concluido: false },
    { dia: "Ter", concluido: false },
    { dia: "Qua", concluido: false },
    { dia: "Qui", concluido: false },
    { dia: "Sex", concluido: false },
    { dia: "Sáb", concluido: false },
    { dia: "Dom", concluido: false }
  ]);

  // Lógica de Streak: O fogo SÓ É ACENDIDO quando o aluno REALIZA PROVAS / EXERCÍCIOS
  const atualizarEstadoStreak = () => {
    if (typeof window === "undefined" || !user) return;

    const userEmailKey = user?.email ? user.email.toLowerCase().replace(/[^a-z0-9]/g, "_") : "aluno_default";
    const keyUltimoEstudo = `devhub_access_date_${userEmailKey}`;
    const keyStreakContador = `devhub_streak_count_${userEmailKey}`;
    const hojeStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const keyEstudouHoje = `devhub_estudou_hoje_${userEmailKey}_${hojeStr}`;

    const estudouHoje = localStorage.getItem(keyEstudouHoje) === "true";
    setEstudouHojeState(estudouHoje);

    const rawStreak = localStorage.getItem(keyStreakContador);
    const streakSalvo = rawStreak ? parseInt(rawStreak) : 0;
    setStreakDias(streakSalvo);

    const diasSemanaNomes = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const diaHojeIndex = new Date().getDay(); // 0 = Dom, 1 = Seg...

    const historicoAtualizado = [
      { dia: "Seg", concluido: false },
      { dia: "Ter", concluido: false },
      { dia: "Qua", concluido: false },
      { dia: "Qui", concluido: false },
      { dia: "Sex", concluido: false },
      { dia: "Sáb", concluido: false },
      { dia: "Dom", concluido: false }
    ];

    const nomeHoje = diasSemanaNomes[diaHojeIndex];
    const itemHoje = historicoAtualizado.find(d => d.dia === nomeHoje);
    if (itemHoje) {
      itemHoje.concluido = estudouHoje;
    }
    setHistoricoDias(historicoAtualizado);
  };

  useEffect(() => {
    atualizarEstadoStreak();

    // Event listener global para acender o fogo assim que o aluno realizar uma prova/exercício
    const handleEstudoConcluido = () => {
      if (!user) return;
      const userEmailKey = user?.email ? user.email.toLowerCase().replace(/[^a-z0-9]/g, "_") : "aluno_default";
      const hojeStr = new Date().toISOString().split("T")[0];
      const keyUltimoEstudo = `devhub_access_date_${userEmailKey}`;
      const keyStreakContador = `devhub_streak_count_${userEmailKey}`;
      const keyEstudouHoje = `devhub_estudou_hoje_${userEmailKey}_${hojeStr}`;

      const jaEstudou = localStorage.getItem(keyEstudouHoje) === "true";
      localStorage.setItem(keyEstudouHoje, "true");

      if (!jaEstudou) {
        const rawStreak = localStorage.getItem(keyStreakContador);
        const streakSalvo = rawStreak ? parseInt(rawStreak) : 0;
        const novoStreak = streakSalvo + 1;

        localStorage.setItem(keyUltimoEstudo, hojeStr);
        localStorage.setItem(keyStreakContador, String(novoStreak));

        setStreakDias(novoStreak);
      }

      setEstudouHojeState(true);
      setStats(prev => ({ ...prev, xp: prev.xp + 150 }));
      atualizarEstadoStreak();
    };

    window.addEventListener("devhub_estudo_realizado", handleEstudoConcluido);
    return () => window.removeEventListener("devhub_estudo_realizado", handleEstudoConcluido);
  }, [user]);

  // Buscar pontos de XP e skills do backend
  useEffect(() => {
    if (user?.email) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      fetch(`${apiUrl}/batalhas/stats?email=${user.email}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && typeof data.xp === "number") {
            setStats(prev => ({
              ...prev,
              xp: data.xp,
              skills: data.skills || prev.skills
            }));
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const nomeAluno = user?.nome ? user.nome.split(" ")[0] : "Estudante";

  // Nível Dinâmico Aumentando conforme o XP
  const nivelDinamico = Math.floor(stats.xp / 1000) + 1;
  const xpAtualNivel = stats.xp % 1000;
  const percentualXp = Math.min(100, Math.round((xpAtualNivel / 1000) * 100));

  // Identificação Dinâmica da Área Dominante
  const maxProgresso = Math.max(...stats.skills.map(s => s.progresso));
  const topSkill = stats.skills.find(s => s.progresso === maxProgresso);
  const temProgresso = maxProgresso > 0;

  return (
    <div className={styles.card}>
      {/* Topo: Saudação e Badges de Nível / Streak */}
      <div className={styles.topRow}>
        <div>
          <h2 className={styles.greeting}>
            Olá, {nomeAluno} 👋
          </h2>
          <div className={styles.subgreeting}>Realize provas e desafios para acender o fogo de estudo do dia!</div>
        </div>

        <div className={styles.badgesGroup}>
          <div
            className={styles.streakBadge}
            style={{
              backgroundColor: estudouHojeState ? "rgba(245, 158, 11, 0.2)" : "rgba(148, 163, 184, 0.1)",
              borderColor: estudouHojeState ? "#f59e0b" : "rgba(148, 163, 184, 0.3)",
              boxShadow: estudouHojeState ? "0 0 15px rgba(245, 158, 11, 0.4)" : "none"
            }}
            title={estudouHojeState ? "🔥 Fogo acendido hoje ao realizar prova!" : "⭕ Fogo apagado! Realize 1 prova para acender o fogo de hoje."}
          >
            <Flame size={18} fill={estudouHojeState ? "#f59e0b" : "none"} color={estudouHojeState ? "#f59e0b" : "#94a3b8"} />
            <span>
              {estudouHojeState ? `${streakDias} ${streakDias === 1 ? "dia" : "dias"} de sequência 🔥` : "Fogo Apagado 🛑 (Faça 1 Prova)"}
            </span>
          </div>

          <div className={styles.levelBadge} title="Nível atual dinâmico (sobe a cada 1000 XP)">
            <Award size={18} />
            <span>Nível: {nivelDinamico}</span>
          </div>
        </div>
      </div>

      {/* Barra de Progresso de XP Dinâmica */}
      <div className={styles.xpSection}>
        <div className={styles.xpLabelRow}>
          <span>Progresso de Experiência (Nível {nivelDinamico} → Nível {nivelDinamico + 1})</span>
          <span>
            XP Total: {stats.xp.toLocaleString("pt-BR")} | Próximo Nível: {xpAtualNivel} / 1.000 ({percentualXp}%)
          </span>
        </div>
        <div className={styles.xpTrack}>
          <div className={styles.xpFill} style={{ width: `${percentualXp}%` }} />
        </div>
      </div>

      {/* Conteúdo em Grade: Streak Semanal + Progresso de Habilidades */}
      <div className={styles.gridContent}>
        {/* Box 1: 🔥 Streak de estudos com indicação de Realizar Provas */}
        <div className={styles.box}>
          <div className={styles.boxTitle}>
            <Flame size={16} color={estudouHojeState ? "#f59e0b" : "#94a3b8"} />
            <span>🔥 Streak de Estudos (Acende ao Realizar Provas)</span>
          </div>

          <div className={styles.streakGrid}>
            {historicoDias.map((d, index) => (
              <div key={index} className={styles.dayCol}>
                <span className={styles.dayName}>{d.dia}</span>
                {d.concluido ? (
                  <div className={styles.dayIconChecked} title="Prova/Exercício concluído nesta data 🔥">
                    <Check size={16} />
                  </div>
                ) : (
                  <div className={styles.dayIconMissed} title="Faltou realizar prova nesta data">
                    <X size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {!estudouHojeState && (
            <div style={{ marginTop: "12px", fontSize: "0.82rem", color: "#f87171", display: "flex", alignItems: "center", gap: "6px", fontWeight: "700" }}>
              <AlertCircle size={14} />
              <span>Realize 1 prova ou desafio hoje para acender o fogo de sequência!</span>
            </div>
          )}
        </div>

        {/* Box 2: Progresso de Habilidades + Área Dominante */}
        <div className={styles.box}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
            <div className={styles.boxTitle} style={{ margin: 0 }}>
              <Code size={16} color="#3b82f6" />
              <span>Progresso em Habilidades</span>
            </div>

            {/* Badge da Área Dominante */}
            <div style={{
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(234, 179, 8, 0.25) 100%)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              borderRadius: "10px",
              padding: "4px 10px",
              fontSize: "0.78rem",
              fontWeight: "800",
              color: "#f59e0b",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}>
              <Crown size={14} color="#f59e0b" />
              <span>
                {temProgresso
                  ? `Área Dominante: ${topSkill.nome} (${topSkill.progresso}%)`
                  : "Área Dominante: Em Início de Jornada 🚀"}
              </span>
            </div>
          </div>

          <div className={styles.skillsList}>
            {stats.skills.map((skill, idx) => {
              const isDominante = temProgresso && skill.nome === topSkill.nome;
              return (
                <div key={idx} className={styles.skillItem}>
                  <span className={styles.skillName} style={{ fontWeight: isDominante ? "800" : "700", color: isDominante ? skill.cor : "var(--text-primary)" }}>
                    {isDominante ? `👑 ${skill.nome}` : skill.nome}
                  </span>
                  <div className={styles.skillBarTrack}>
                    <div
                      className={styles.skillBarFill}
                      style={{
                        width: `${skill.progresso}%`,
                        backgroundColor: skill.cor,
                        boxShadow: isDominante ? `0 0 12px ${skill.cor}` : `0 0 6px ${skill.cor}88`
                      }}
                    />
                  </div>
                  <span className={styles.skillPercent}>{skill.progresso}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
