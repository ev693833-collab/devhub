import { useState, useEffect } from "react";
import { Flame, Award, Zap, Check, X, Code, Crown, AlertCircle, Sparkles, ArrowRight, BookOpen, Calendar, CheckCircle2, ShieldCheck } from "lucide-react";
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
      window.dispatchEvent(new CustomEvent("devhub_gamificacao_update"));
    };

    window.addEventListener("devhub_estudo_realizado", handleEstudoConcluido);
    return () => window.removeEventListener("devhub_estudo_realizado", handleEstudoConcluido);
  }, [user]);

  const calcularSkillsLocais = () => {
    if (typeof window === "undefined") return null;

    let jsPoints = 0, reactPoints = 0, nodePoints = 0, sqlPoints = 0, gitPoints = 0;

    // 1. Trilhas de Aprendizado (Checkpoints Concluídos)
    try {
      const rawTrilhas = localStorage.getItem("devhub_checkpoints_trilhas");
      if (rawTrilhas) {
        const trilhasObj = JSON.parse(rawTrilhas);
        if (trilhasObj.fullstack) {
          trilhasObj.fullstack.forEach(cp => {
            if (cp.feito) { jsPoints += 20; nodePoints += 20; reactPoints += 20; }
          });
        }
        if (trilhasObj.frontend) {
          trilhasObj.frontend.forEach(cp => {
            if (cp.feito) { reactPoints += 25; jsPoints += 15; gitPoints += 10; }
          });
        }
        if (trilhasObj.backend) {
          trilhasObj.backend.forEach(cp => {
            if (cp.feito) { nodePoints += 25; sqlPoints += 25; gitPoints += 10; }
          });
        }
      }
    } catch (e) {}

    // 2. Provas e Avaliações Teóricas/Práticas Concluídas
    try {
      const rawProvas = localStorage.getItem("devhub_provas_concluidas") || localStorage.getItem("devhub_notas_provas");
      if (rawProvas) {
        const list = JSON.parse(rawProvas);
        if (Array.isArray(list)) {
          list.forEach(p => {
            const mat = (p.materia || p.titulo || p.provaTitulo || "").toLowerCase();
            const nVal = p.nota !== undefined ? parseFloat(p.nota) : 8.0;
            const pt = Math.round((nVal / 10) * 35);
            if (mat.includes("react")) reactPoints += pt;
            else if (mat.includes("node")) nodePoints += pt;
            else if (mat.includes("sql") || mat.includes("banco")) sqlPoints += pt;
            else if (mat.includes("git")) gitPoints += pt;
            else jsPoints += pt;
          });
        }
      }
    } catch (e) {}

    // 3. Mini Sistemas & Projetos Práticos Concluídos
    try {
      const rawMinis = localStorage.getItem("devhub_minisistemas_completos") || localStorage.getItem("devhub_projetos_concluidos");
      if (rawMinis) {
        const listM = JSON.parse(rawMinis);
        if (Array.isArray(listM)) {
          listM.forEach(proj => {
            const pId = String(proj).toLowerCase();
            if (pId.includes("react") || pId.includes("biblioteca") || pId.includes("ecommerce")) reactPoints += 30;
            if (pId.includes("api") || pId.includes("node") || pId.includes("auth")) nodePoints += 30;
            if (pId.includes("sql") || pId.includes("financeiro") || pId.includes("banco")) sqlPoints += 30;
            if (pId.includes("git")) gitPoints += 30;
            jsPoints += 20;
          });
        }
      }
    } catch (e) {}

    // 4. Code Playground & Desafios de Código Executados
    try {
      const rawPlay = localStorage.getItem("devhub_playground_execucoes");
      if (rawPlay) {
        const countPlay = parseInt(rawPlay) || 0;
        jsPoints += Math.min(30, countPlay * 10);
      }
    } catch (e) {}

    // 5. Duelos e Batalhas na Arena PvP
    try {
      const rawDuelos = localStorage.getItem("devhub_duelos_historico");
      if (rawDuelos) {
        const list = JSON.parse(rawDuelos);
        if (Array.isArray(list)) {
          list.forEach(d => {
            if (d.resultado === 'vitoria') jsPoints += 25;
            else jsPoints += 10;
          });
        }
      }
    } catch (e) {}

    // 6. Caderno de Estudos & Flashcards Revisados
    try {
      const rawCaderno = localStorage.getItem("devhub_caderno_notas");
      if (rawCaderno) {
        const listNotas = JSON.parse(rawCaderno);
        if (Array.isArray(listNotas)) {
          jsPoints += Math.min(20, listNotas.length * 5);
        }
      }
    } catch (e) {}

    return [
      { nome: "JavaScript", progresso: Math.min(100, jsPoints), cor: "#F7DF1E", icon: "💻" },
      { nome: "React", progresso: Math.min(100, reactPoints), cor: "#61DAFB", icon: "⚛️" },
      { nome: "Node.js", progresso: Math.min(100, nodePoints), cor: "#68A063", icon: "🟢" },
      { nome: "SQL", progresso: Math.min(100, sqlPoints), cor: "#38BDF8", icon: "🗄️" },
      { nome: "Git", progresso: Math.min(100, gitPoints), cor: "#F05032", icon: "🟠" }
    ];
  };

  const carregarStatsEProgressos = () => {
    const skillsLocais = calcularSkillsLocais();

    if (user?.email) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      fetch(`${apiUrl}/batalhas/stats?email=${user.email}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          setStats(prev => {
            const backendSkills = data?.skills || [];
            const mergedSkills = prev.skills.map(s => {
              const back = backendSkills.find(b => b.nome === s.nome);
              const loc = skillsLocais ? skillsLocais.find(l => l.nome === s.nome) : null;
              const maxVal = Math.max(
                s.progresso || 0,
                back ? back.progresso : 0,
                loc ? loc.progresso : 0
              );
              return { ...s, progresso: maxVal };
            });
            return {
              ...prev,
              xp: data && typeof data.xp === "number" ? Math.max(prev.xp, data.xp) : prev.xp,
              skills: mergedSkills
            };
          });
        })
        .catch(() => {
          if (skillsLocais) {
            setStats(prev => ({
              ...prev,
              skills: prev.skills.map(s => {
                const loc = skillsLocais.find(l => l.nome === s.nome);
                return { ...s, progresso: Math.max(s.progresso || 0, loc ? loc.progresso : 0) };
              })
            }));
          }
        });
    } else if (skillsLocais) {
      setStats(prev => ({
        ...prev,
        skills: prev.skills.map(s => {
          const loc = skillsLocais.find(l => l.nome === s.nome);
          return { ...s, progresso: Math.max(s.progresso || 0, loc ? loc.progresso : 0) };
        })
      }));
    }
  };

  useEffect(() => {
    carregarStatsEProgressos();
    window.addEventListener("devhub_estudo_realizado", carregarStatsEProgressos);
    window.addEventListener("devhub_gamificacao_update", carregarStatsEProgressos);
    return () => {
      window.removeEventListener("devhub_estudo_realizado", carregarStatsEProgressos);
      window.removeEventListener("devhub_gamificacao_update", carregarStatsEProgressos);
    };
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

  // Função para nomear a proficiência da habilidade (Estilo Executivo Corporate)
  const getSkillLabel = (prog) => {
    if (prog === 0) return "Iniciante";
    if (prog <= 25) return "Nível Júnior";
    if (prog <= 60) return "Nível Pleno";
    if (prog <= 85) return "Nível Sênior";
    return "Especialista Tech";
  };

  return (
    <>
      <div className={`${styles.card} ${estudouHojeState ? styles.cardAcesa : ""}`}>
      {/* Topo: Saudação e Badges de Desempenho Executivo */}
      <div className={styles.topRow}>
        <div>
          <h2 className={styles.greeting}>
            Olá, {nomeAluno} 👋
          </h2>
          <div className={styles.subgreeting}>
            <Sparkles size={16} color="#3B82F6" />
            <span>Acompanhe seu desempenho acadêmico, carga horária e matriz de competências técnicas.</span>
          </div>
        </div>

        <div className={styles.badgesGroup}>
          <div
            className={estudouHojeState ? styles.streakBadgeActive : styles.streakBadgeInactive}
            title={estudouHojeState ? "Frequência confirmada nesta semana!" : "Frequência pendente esta semana. Realize uma aula."}
          >
            <Calendar size={18} color={estudouHojeState ? "#10B981" : "#EF4444"} />
            <span>
              {estudouHojeState
                ? `Frequência Ativa: ${streakDias} ${streakDias === 1 ? "Semana" : "Semanas"}`
                : "Frequência Pendente na Semana"}
            </span>
          </div>

          <div className={styles.levelBadge} title="Nível executivo de proficiência">
            <Award size={18} color="#3B82F6" />
            <span>Formação Dev — Nível {nivelDinamico}</span>
          </div>
        </div>
      </div>

      {/* Barra de Carga Horária / Progresso da Formação */}
      <div className={styles.xpSection}>
        <div className={styles.xpLabelRow}>
          <span>Progresso de Formação Técnica (Nível {nivelDinamico} → Nível {nivelDinamico + 1})</span>
          <span>
            Pontuação de Desempenho: {stats.xp.toLocaleString("pt-BR")} pts | Meta: {xpAtualNivel} / 1.000 ({percentualXp}%)
          </span>
        </div>
        <div className={styles.xpTrack}>
          <div className={styles.xpFill} style={{ width: `${percentualXp}%` }} />
        </div>
      </div>

      {/* Conteúdo em Grade: Frequência Semanal + Matriz de Competências */}
      <div className={styles.gridContent}>
        {/* Box 1: Frequência Semanal de Atividades */}
        <div className={styles.box}>
          <div>
            <div className={styles.boxTitle}>
              <Calendar size={18} color={estudouHojeState ? "#10B981" : "#EF4444"} />
              <span>Frequência Semanal de Estudos</span>
            </div>

            {/* Grid dos 7 dias da semana */}
            <div className={styles.streakGrid}>
              {historicoDias.map((d, index) => (
                <div key={index} className={styles.dayCol}>
                  <span className={styles.dayName}>{d.dia}</span>
                  {d.concluido ? (
                    <div className={styles.dayIconChecked} title={`${d.dia}: Presença registrada!`}>
                      <CheckCircle2 size={19} color="#10B981" />
                    </div>
                  ) : d.eHoje ? (
                    <div className={styles.dayIconToday} title="Registrar atividade de hoje" onClick={acenderFogoAgora}>
                      <Zap size={17} color="#3B82F6" />
                    </div>
                  ) : (
                    <div className={styles.dayIconMissed} title={`${d.dia}: Sem atividade registrada`}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#475569" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Banner de incentivo para registrar presença */}
          {!estudouHojeState ? (
            <div className={styles.acenderFogoBanner}>
              <div className={styles.acenderText}>
                <AlertCircle size={16} color="#3B82F6" />
                <span>Registre sua presença semanal concluindo 1 aula ou exercício técnico!</span>
              </div>
              <button className={styles.btnAcender} onClick={acenderFogoAgora}>
                <CheckCircle2 size={15} color="#FFF" />
                <span>Registrar Presença Semanal (+150 pts)</span>
              </button>
            </div>
          ) : (
            <div style={{
              marginTop: "16px", padding: "12px 16px", borderRadius: "14px",
              backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)",
              color: "#10B981", fontSize: "12.5px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px"
            }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>Sua presença semanal está confirmada. Continue estudando!</span>
            </div>
          )}
        </div>

        {/* Box 2: Matriz de Competências Técnicas */}
        <div className={styles.box}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
            <div className={styles.boxTitle} style={{ margin: 0 }}>
              <Code size={18} color="#3B82F6" />
              <span>Matriz de Competências Técnicas</span>
            </div>

            {/* Badge de Competência Principal */}
            <div style={{
              background: "rgba(59, 130, 246, 0.12)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "10px",
              padding: "4px 12px",
              fontSize: "0.78rem",
              fontWeight: "800",
              color: "#60A5FA",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <ShieldCheck size={14} color="#60A5FA" />
              <span>
                {temProgresso
                  ? `Competência Principal: ${topSkill.nome} (${topSkill.progresso}%)`
                  : "Jornada Técnica em Inicialização"}
              </span>
            </div>
          </div>

          <div className={styles.skillsList}>
            {stats.skills.map((skill, idx) => {
              const isDominante = temProgresso && skill.nome === topSkill.nome;
              return (
                <div key={idx} className={styles.skillItem}>
                  <div className={styles.skillInfo}>
                    <span className={styles.skillName} style={{ color: "#F8FAFC" }}>
                      {skill.nome}
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
                        background: `linear-gradient(90deg, #2563EB, #3B82F6)`,
                        boxShadow: `0 0 10px rgba(59, 130, 246, 0.4)`
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
