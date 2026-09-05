import { useState, useEffect } from "react";
import { Flame, Award, Zap, Check, X, Code, Crown, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import styles from "./StudentGamificationHeader.module.css";

export default function StudentGamificationHeader({ user }) {
  const [stats, setStats] = useState({
    xp: 0,
    skills: [
      { nome: "JavaScript", progresso: 0, cor: "#F7DF1E", icon: "🟨" },
      { nome: "React", progresso: 0, cor: "#61DAFB", icon: "⚛️" },
      { nome: "Node.js", progresso: 0, cor: "#68A063", icon: "🟢" },
      { nome: "SQL", progresso: 0, cor: "#38BDF8", icon: "🗄️" },
      { nome: "Git", progresso: 0, cor: "#F05032", icon: "🟠" }
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
      { dia: "Seg", concluido: false, eHoje: diaHojeIndex === 1 },
      { dia: "Ter", concluido: false, eHoje: diaHojeIndex === 2 },
      { dia: "Qua", concluido: false, eHoje: diaHojeIndex === 3 },
      { dia: "Qui", concluido: false, eHoje: diaHojeIndex === 4 },
      { dia: "Sex", concluido: false, eHoje: diaHojeIndex === 5 },
      { dia: "Sáb", concluido: false, eHoje: diaHojeIndex === 6 },
      { dia: "Dom", concluido: false, eHoje: diaHojeIndex === 0 }
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

  // Função para simular acendimento ou disparar evento de estudo
  const acenderFogoAgora = () => {
    window.dispatchEvent(new CustomEvent("devhub_estudo_realizado"));
  };

  const nomeAluno = user?.nome ? user.nome.split(" ")[0] : "Estudante";

  // Nível Dinâmico Aumentando conforme o XP
  const nivelDinamico = Math.floor(stats.xp / 1000) + 1;
  const xpAtualNivel = stats.xp % 1000;
  const percentualXp = Math.min(100, Math.round((xpAtualNivel / 1000) * 100));

  // Identificação Dinâmica da Área Dominante
  const maxProgresso = Math.max(...stats.skills.map(s => s.progresso));
  const topSkill = stats.skills.find(s => s.progresso === maxProgresso);
  const temProgresso = maxProgresso > 0;

  // Função para nomear o nível da habilidade
  const getSkillLabel = (prog) => {
    if (prog === 0) return "Iniciante 🐣";
    if (prog <= 25) return "Padawan 🛡️";
    if (prog <= 60) return "Praticante ⚡";
    if (prog <= 85) return "Especialista 🔥";
    return "Mestre Dev 👑";
  };

  return (
    <div className={`${styles.card} ${estudouHojeState ? styles.cardAcesa : ""}`}>
      {/* Topo: Saudação e Badges de Nível / Streak */}
      <div className={styles.topRow}>
        <div>
          <h2 className={styles.greeting}>
            Olá, {nomeAluno} 👋
          </h2>
          <div className={styles.subgreeting}>
            <Sparkles size={16} color="#f59e0b" />
            <span>Mantenha sua chama acesa diariamente completando exercícios e provas!</span>
          </div>
        </div>

        <div className={styles.badgesGroup}>
          <div
            className={estudouHojeState ? styles.streakBadgeActive : styles.streakBadgeInactive}
            title={estudouHojeState ? "🔥 Fogo acendido hoje!" : "⭕ Fogo apagado! Faça 1 atividade para acender."}
          >
            <Flame size={20} fill={estudouHojeState ? "#f59e0b" : "none"} color={estudouHojeState ? "#f59e0b" : "#ef4444"} />
            <span>
              {estudouHojeState
                ? `🔥 ${streakDias} ${streakDias === 1 ? "Dia" : "Dias"} Incandescente!`
                : "🌑 Chama Apagada Hoje"}
            </span>
          </div>

          <div className={styles.levelBadge} title="Nível atual dinâmico (sobe a cada 1.000 XP)">
            <Award size={20} color="#818cf8" />
            <span>Nível {nivelDinamico} — Dev Explorer</span>
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
        {/* Box 1: 🔥 Streak de estudos (FOGO DA SEQUÊNCIA) */}
        <div className={styles.box}>
          <div>
            <div className={styles.boxTitle}>
              <Flame size={18} color={estudouHojeState ? "#f59e0b" : "#ef4444"} fill={estudouHojeState ? "#f59e0b" : "none"} />
              <span>🔥 Fogo de Sequência Semanal</span>
            </div>

            {/* Grid dos 7 dias da semana estilo Duolingo */}
            <div className={styles.streakGrid}>
              {historicoDias.map((d, index) => (
                <div key={index} className={styles.dayCol}>
                  <span className={styles.dayName}>{d.dia}</span>
                  {d.concluido ? (
                    <div className={styles.dayIconChecked} title={`${d.dia}: Chama Acesa! 🔥`}>
                      <Flame size={20} fill="#f59e0b" color="#ef4444" />
                    </div>
                  ) : d.eHoje ? (
                    <div className={styles.dayIconToday} title="Hoje: Clique para acender sua chama!" onClick={acenderFogoAgora}>
                      <Zap size={18} />
                    </div>
                  ) : (
                    <div className={styles.dayIconMissed} title={`${d.dia}: Sem atividades`}>
                      <Flame size={18} color="#475569" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Banner de incentivo caso o fogo esteja apagado */}
          {!estudouHojeState && (
            <div className={styles.acenderFogoBanner}>
              <div className={styles.acenderText}>
                <AlertCircle size={16} color="#ef4444" />
                <span>Sua chama apaga à meia-noite! Faça 1 prova para acendê-la.</span>
              </div>
              <button className={styles.btnAcender} onClick={acenderFogoAgora}>
                <Flame size={15} fill="#FFF" />
                <span>Acender Chama (+150 XP)</span>
              </button>
            </div>
          )}
        </div>

        {/* Box 2: Progresso de Habilidades + Área Dominante */}
        <div className={styles.box}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
            <div className={styles.boxTitle} style={{ margin: 0 }}>
              <Code size={18} color="#3b82f6" />
              <span>Progresso em Habilidades</span>
            </div>

            {/* Badge da Área Dominante com Coroa Gold */}
            <div style={{
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(234, 179, 8, 0.25) 100%)",
              border: "1.5px solid rgba(245, 158, 11, 0.4)",
              borderRadius: "12px",
              padding: "4px 12px",
              fontSize: "0.78rem",
              fontWeight: "800",
              color: "#fbbf24",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <Crown size={14} color="#fbbf24" />
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
                  <div className={styles.skillInfo}>
                    <span className={styles.skillName} style={{ color: isDominante ? skill.cor : "#f8fafc" }}>
                      {skill.icon || "💻"} {skill.nome}
                    </span>
                    <span className={styles.skillLevelLabel}>
                      {getSkillLabel(skill.progresso)}
                    </span>
                  </div>

                  <div className={styles.skillBarTrack}>
                    <div
                      className={styles.skillBarFill}
                      style={{
                        width: `${Math.max(5, skill.progresso)}%`,
                        background: `linear-gradient(90deg, ${skill.cor}aa, ${skill.cor})`,
                        boxShadow: isDominante ? `0 0 14px ${skill.cor}` : `0 0 8px ${skill.cor}66`
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
