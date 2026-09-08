import { useState, useEffect } from "react";
import { Flame, Award, Zap, Check, X, Code, Crown, AlertCircle, Sparkles, ArrowRight, BookOpen } from "lucide-react";
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

  const [streakDias, setStreakDias] = useState(1);
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

  // Função para pegar ano e semana atual
  const getSemanaAnoObj = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDays = (now - startOfYear) / 86400000;
    const semNum = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
    return { ano: now.getFullYear(), semana: semNum, semId: `${now.getFullYear()}_W${semNum}` };
  };

  // Lógica de Streak Semanal (Se falhar a semana, o fogo morre e zera!)
  const atualizarEstadoStreak = () => {
    if (typeof window === "undefined" || !user) return;

    const userEmailKey = user?.email ? user.email.toLowerCase().replace(/[^a-z0-9]/g, "_") : "aluno_default";
    const semInfo = getSemanaAnoObj();
    const keyEstudouSemana = `devhub_chama_semanal_${userEmailKey}_${semInfo.semId}`;
    const keyStreakSemanal = `devhub_weekly_streak_${userEmailKey}`;
    const keyUltimoAno = `devhub_last_lit_year_${userEmailKey}`;
    const keyUltimaSemanaNum = `devhub_last_lit_week_num_${userEmailKey}`;

    const estudouNaSemana = localStorage.getItem(keyEstudouSemana) === "true";
    setEstudouHojeState(estudouNaSemana);

    const lastYear = parseInt(localStorage.getItem(keyUltimoAno) || "0");
    const lastWeekNum = parseInt(localStorage.getItem(keyUltimaSemanaNum) || "0");

    let streakSalvo = parseInt(localStorage.getItem(keyStreakSemanal) || "0");

    // Se o aluno ficou mais de 1 semana sem acender a chama, O FOGO MORREU 💀 (Zera!)
    if (lastYear > 0 && lastWeekNum > 0) {
      const difSemanas = (semInfo.ano - lastYear) * 52 + (semInfo.semana - lastWeekNum);
      if (difSemanas > 1 && !estudouNaSemana) {
        streakSalvo = 0;
        localStorage.setItem(keyStreakSemanal, "0");
      }
    }

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
      itemHoje.concluido = estudouNaSemana;
    }
    setHistoricoDias(historicoAtualizado);
  };

  useEffect(() => {
    atualizarEstadoStreak();

    // Event listener global para acender a chama semanal
    const handleEstudoConcluido = () => {
      if (!user) return;
      const userEmailKey = user?.email ? user.email.toLowerCase().replace(/[^a-z0-9]/g, "_") : "aluno_default";
      const semInfo = getSemanaAnoObj();
      const keyEstudouSemana = `devhub_chama_semanal_${userEmailKey}_${semInfo.semId}`;
      const keyStreakSemanal = `devhub_weekly_streak_${userEmailKey}`;
      const keyUltimoAno = `devhub_last_lit_year_${userEmailKey}`;
      const keyUltimaSemanaNum = `devhub_last_lit_week_num_${userEmailKey}`;

      const jaEstudouNaSemana = localStorage.getItem(keyEstudouSemana) === "true";
      localStorage.setItem(keyEstudouSemana, "true");

      if (!jaEstudouNaSemana) {
        const lastYear = parseInt(localStorage.getItem(keyUltimoAno) || "0");
        const lastWeekNum = parseInt(localStorage.getItem(keyUltimaSemanaNum) || "0");
        let streakAtual = parseInt(localStorage.getItem(keyStreakSemanal) || "0");

        if (lastYear > 0 && lastWeekNum > 0) {
          const difSemanas = (semInfo.ano - lastYear) * 52 + (semInfo.semana - lastWeekNum);
          if (difSemanas > 1) {
            streakAtual = 1; // Reiniciou do zero
          } else {
            streakAtual = streakAtual + 1; // Mantém a sequência
          }
        } else {
          streakAtual = 1;
        }

        localStorage.setItem(keyUltimoAno, String(semInfo.ano));
        localStorage.setItem(keyUltimaSemanaNum, String(semInfo.semana));
        localStorage.setItem(keyStreakSemanal, String(streakAtual));
        setStreakDias(streakAtual);
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
    <>
      {/* Banner Principal de Boas-Vindas */}
      <div style={{
        background: "linear-gradient(135deg, rgba(23, 28, 44, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "24px",
        padding: "20px 24px",
        marginBottom: "20px",
        boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "16px",
            background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#FFF", fontSize: "24px", fontWeight: "800",
            boxShadow: "0 8px 20px rgba(59, 130, 246, 0.35)",
            flexShrink: 0
          }}>
            {(user?.avatar_url || user?.avatar) ? (
              <img src={user.avatar_url || user.avatar} alt="Foto" style={{ width: "100%", height: "100%", borderRadius: "16px", objectFit: "cover" }} />
            ) : (
              user?.nome ? user.nome.charAt(0).toUpperCase() : "👋"
            )}
          </div>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", margin: 0, display: "flex", alignItems: "center", gap: "8px", color: "#FFF" }}>
              Bem-vindo, {user ? user.nome : "Estudante"}! <span style={{ animation: "pulse 2s infinite" }}>🚀</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: "4px 0 0 0" }}>
              Plataforma interativa DevHub — Escolha um módulo abaixo para começar os estudos.
            </p>
          </div>
        </div>

        {/* Cards de Métricas Rápidas no Meio */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <div style={{
            padding: "8px 14px",
            borderRadius: "14px",
            backgroundColor: "rgba(59, 130, 246, 0.12)",
            border: "1px solid rgba(59, 130, 246, 0.25)",
            display: "flex", alignItems: "center", gap: "8px"
          }}>
            <BookOpen size={16} style={{ color: "#3B82F6" }} />
            <div>
              <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Módulos</div>
              <div style={{ fontSize: "13px", fontWeight: "800", color: "#3B82F6" }}>7 Módulos de Estudo</div>
            </div>
          </div>

          <div style={{
            padding: "8px 14px",
            borderRadius: "14px",
            backgroundColor: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            display: "flex", alignItems: "center", gap: "8px"
          }}>
            <Zap size={16} style={{ color: "#10B981" }} />
            <div>
              <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Status</div>
              <div style={{ fontSize: "13px", fontWeight: "800", color: "#10B981" }}>Ativo 🟢</div>
            </div>
          </div>

          <div style={{
            padding: "8px 14px",
            borderRadius: "14px",
            backgroundColor: "rgba(168, 85, 247, 0.12)",
            border: "1px solid rgba(168, 85, 247, 0.25)",
            display: "flex", alignItems: "center", gap: "8px"
          }}>
            <Crown size={16} style={{ color: "#A855F7" }} />
            <div>
              <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Trilha</div>
              <div style={{ fontSize: "13px", fontWeight: "800", color: "#A855F7" }}>Full Stack</div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${estudouHojeState ? styles.cardAcesa : ""}`}>
      {/* Topo: Saudação e Badges de Nível / Streak */}
      <div className={styles.topRow}>
        <div>
          <h2 className={styles.greeting}>
            Olá, {nomeAluno} 👋
          </h2>
          <div className={styles.subgreeting}>
            <Sparkles size={16} color="#f59e0b" />
            <span>Mantenha sua chama acesa semanalmente estudando e praticando no DevHub!</span>
          </div>
        </div>

        <div className={styles.badgesGroup}>
          <div
            className={estudouHojeState ? styles.streakBadgeActive : styles.streakBadgeInactive}
            title={estudouHojeState ? "🔥 Fogo acendido esta semana!" : "⭕ Chama apagada esta semana! Estude para acendê-la."}
          >
            <Flame size={20} fill={estudouHojeState ? "#f59e0b" : "none"} color={estudouHojeState ? "#f59e0b" : "#ef4444"} />
            <span>
              {estudouHojeState
                ? `🔥 ${streakDias} ${streakDias === 1 ? "Semana" : "Semanas"} Incandescente!`
                : "🌑 Chama Apagada Esta Semana"}
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

            {/* Grid dos 7 dias da semana */}
            <div className={styles.streakGrid}>
              {historicoDias.map((d, index) => (
                <div key={index} className={styles.dayCol}>
                  <span className={styles.dayName}>{d.dia}</span>
                  {d.concluido ? (
                    <div className={styles.dayIconChecked} title={`${d.dia}: Chama Acesa nesta Semana! 🔥`}>
                      <Flame size={20} fill="#f59e0b" color="#ef4444" />
                    </div>
                  ) : d.eHoje ? (
                    <div className={styles.dayIconToday} title="Acenda sua chama semanal!" onClick={acenderFogoAgora}>
                      <Zap size={18} />
                    </div>
                  ) : (
                    <div className={styles.dayIconMissed} title={`${d.dia}: Sem atividade registrada`}>
                      <Flame size={18} color="#475569" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Banner de incentivo para acender a chama semanal */}
          {!estudouHojeState ? (
            <div className={styles.acenderFogoBanner}>
              <div className={styles.acenderText}>
                <AlertCircle size={16} color="#ef4444" />
                <span>Acenda sua chama semanal realizando 1 atividade ou clicando abaixo!</span>
              </div>
              <button className={styles.btnAcender} onClick={acenderFogoAgora}>
                <Flame size={15} fill="#FFF" />
                <span>Acender Chama Semanal (+150 XP)</span>
              </button>
            </div>
          ) : (
            <div style={{
              marginTop: "16px", padding: "12px 16px", borderRadius: "14px",
              backgroundColor: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#10b981", fontSize: "12.5px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px"
            }}>
              <Flame size={16} fill="#10b981" />
              <span>🔥 Sua chama está acesa esta semana! Continue praticando para acumular XP.</span>
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
    </>
  );
}
