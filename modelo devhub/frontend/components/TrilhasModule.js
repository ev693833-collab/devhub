import React, { useState, useEffect } from "react";
import styles from "./TrilhasModule.module.css";
import { Compass, CheckCircle2, Circle, Award, Sparkles, BookOpen, Layers, Code, Play, Check, Target } from "lucide-react";

export default function TrilhasModule({ user, onSelectAba }) {
  const [trilhaAtivaKey, setTrilhaAtivaKey] = useState("fullstack");
  const [trilhaEscolhidaPeloAluno, setTrilhaEscolhidaPeloAluno] = useState("fullstack");

  // 🎯 Trilha Individual Definida pelo Super Admin
  const [trilhaIndividual, setTrilhaIndividual] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("devhub_trilhas_individuais");
        if (saved) {
          const mapa = JSON.parse(saved);
          const meuNome = user?.nome;
          if (meuNome) {
            const minhaTrilha = mapa[meuNome] || mapa[meuNome.trim()] || Object.values(mapa)[0];
            if (minhaTrilha) {
              setTrilhaIndividual(minhaTrilha);
            }
          }
        }
      } catch (e) {}
    }
  }, [user]);

  // Estado interativo de checkpoints por trilha com direcionamento exato
  const [checkpointsState, setCheckpointsState] = useState({
    fullstack: [
      { id: 1, titulo: "Fundamentos Web (HTML5, CSS3 Moderno, Flexbox & Grid)", feito: true, xp: 100, slideIndex: 0, praticaAba: "playground", snippetCodigo: "// 🎨 Prática: HTML5 & Flexbox\nconst layout = {\n  header: 'DevHub Fullstack',\n  itens: ['Flexbox', 'CSS Grid', 'Responsividade']\n};\nconsole.log('Módulo 1: Layout Responsivo', layout);" },
      { id: 2, titulo: "Lógica de Programação & ES6+ (Async/Await, Promises)", feito: true, xp: 150, slideIndex: 1, praticaAba: "playground", snippetCodigo: "// ⚡ Prática: Promises & Async/Await\nasync function carregarDados() {\n  console.log('Buscando dados da API...');\n  return { status: 200, usuario: 'Enzo Dev' };\n}\ncarregarDados().then(res => console.log('Resultado:', res));" },
      { id: 3, titulo: "Construção de APIs RESTful com Express & MySQL", feito: true, xp: 200, slideIndex: 4, praticaAba: "mini_sistemas", projetoId: "api_rest" },
      { id: 4, titulo: "Desenvolvimento Frontend com React & Next.js 15", feito: false, xp: 250, slideIndex: 3, praticaAba: "mini_sistemas", projetoId: "biblioteca" },
      { id: 5, titulo: "Arquitetura Clean Code, Autenticação JWT & Deploy Vercel", feito: false, xp: 300, slideIndex: 6, praticaAba: "mini_sistemas", projetoId: "auth_jwt" }
    ],
    frontend: [
      { id: 1, titulo: "Design Systems & CSS Modules Avançado", feito: true, xp: 100, slideIndex: 0, praticaAba: "playground", snippetCodigo: "// 🎨 Prática: Design System & Tokens\nconst themeTokens = {\n  primary: '#3b82f6',\n  darkBg: '#0f172a'\n};\nconsole.log('Tokens de Design:', themeTokens);" },
      { id: 2, titulo: "React Component Architecture & Hooks", feito: true, xp: 150, slideIndex: 3, praticaAba: "mini_sistemas", projetoId: "biblioteca" },
      { id: 3, titulo: "Gerenciamento de Estado & Consumo de APIs", feito: false, xp: 200, slideIndex: 1, praticaAba: "mini_sistemas", projetoId: "ecommerce" },
      { id: 4, titulo: "Animações CSS & Lottie Interativo", feito: false, xp: 200, slideIndex: 0, praticaAba: "playground", snippetCodigo: "// 💫 Prática: Animação CSS\nconsole.log('Simulando gatilho de animação Lottie em 60fps...');" }
    ],
    backend: [
      { id: 1, titulo: "Modelagem Relacional de Bancos de Dados (MySQL / PostgreSQL)", feito: true, xp: 150, slideIndex: 5, praticaAba: "mini_sistemas", projetoId: "financeiro" },
      { id: 2, titulo: "Autenticação Segura (Bcrypt, JWT Tokens & Middlewares)", feito: true, xp: 150, slideIndex: 6, praticaAba: "mini_sistemas", projetoId: "auth_jwt" },
      { id: 3, titulo: "Integração de LLMs & APIs Generativas (Gemini / OpenAI)", feito: false, xp: 250, slideIndex: 1, praticaAba: "playground", snippetCodigo: "// 🤖 Prática: Chamada REST API Gemini AI\nconst prompt = 'Explique Async/Await em 1 frase';\nconsole.log('Enviando prompt para a DevIA:', prompt);" },
      { id: 4, titulo: "Docker, Microsserviços e Testes Automatizados", feito: false, xp: 300, slideIndex: 4, praticaAba: "mini_sistemas", projetoId: "fullstack_app" }
    ]
  });

  const infoTrilhas = {
    fullstack: {
      titulo: "Trilha Fullstack JavaScript & Node.js",
      descricao: "Domine React, Next.js, Node.js Express, Banco MySQL e Deploy de ponta a ponta.",
      badges: ["Mestre HTML/CSS", "API Ninja", "React Explorer"]
    },
    frontend: {
      titulo: "Trilha Frontend & UX/UI Dev",
      descricao: "Crie interfaces ultra modernas, fluidas e gamificadas com alta performance.",
      badges: ["UI Specialist", "Hooks Master"]
    },
    backend: {
      titulo: "Trilha Backend, Databases & IA",
      descricao: "Especialize-se em modelagem de dados, segurança, otimização de banco e IA.",
      badges: ["Database Architect", "Security Guard"]
    }
  };

  const checkpointsAtuais = checkpointsState[trilhaAtivaKey] || [];
  const concluidosCount = checkpointsAtuais.filter(c => c.feito).length;
  const progressoPercent = Math.round((concluidosCount / (checkpointsAtuais.length || 1)) * 100);
  const infoAtual = infoTrilhas[trilhaAtivaKey];

  const toggleCheckpoint = (id) => {
    setCheckpointsState(prev => ({
      ...prev,
      [trilhaAtivaKey]: prev[trilhaAtivaKey].map(cp => 
        cp.id === id ? { ...cp, feito: !cp.feito } : cp
      )
    }));
  };

  const handleIrEstudar = (cp) => {
    if (onSelectAba) {
      onSelectAba("aulas", { slideIndex: cp.slideIndex });
    }
  };

  const handleIrPraticar = (cp) => {
    if (onSelectAba) {
      onSelectAba(cp.praticaAba || "playground", { projetoId: cp.projetoId, snippetCodigo: cp.snippetCodigo });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconBadge}>
            <Compass size={24} />
          </div>
          <div>
            <h3 className={styles.title}>Trilhas de Aprendizado Interativas</h3>
            <p className={styles.subtitle}>Escolha sua formação, acesse aulas diretas e pratique desafios com 1 clique</p>
          </div>
        </div>

        <div className={styles.badgeList}>
          {infoAtual.badges.map((badge, idx) => (
            <span key={idx} className={styles.badgeItem}>
              <Award size={16} /> {badge}
            </span>
          ))}
        </div>
      </div>

      {/* 🎯 CARD DE TRILHA INDIVIDUAL DEFINIDA PELO PROFESSOR */}
      {trilhaIndividual && (
        <div style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(168,85,247,0.18) 100%)",
          border: "1px solid rgba(168,85,247,0.4)",
          borderRadius: "16px",
          padding: "18px 22px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
          boxShadow: "0 8px 24px rgba(99,102,241,0.15)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", padding: "12px", borderRadius: "14px", color: "#fff", display: "flex" }}>
              <Target size={24} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: "800", color: "#c084fc", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                🎯 Trilha Individual Definida pelo Professor
              </div>
              <div style={{ fontSize: "1.15rem", fontWeight: "800", color: "#ffffff", marginTop: "2px" }}>
                {trilhaIndividual.tema}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#cbd5e1", marginTop: "4px", display: "flex", gap: "12px" }}>
                <span>🔥 Meta Semanal: <strong style={{ color: "#38bdf8" }}>{trilhaIndividual.metaXp} XP</strong></span>
                <span>• Instrutor: {trilhaIndividual.instrutor || "Super Admin"}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onSelectAba && onSelectAba("playground")}
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              color: "#ffffff", border: "none", borderRadius: "12px",
              padding: "10px 18px", fontWeight: "800", fontSize: "0.9rem",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
              boxShadow: "0 4px 14px rgba(99,102,241,0.35)"
            }}
          >
            <Play size={16} /> Praticar Foco Agora
          </button>
        </div>
      )}

      <div className={styles.trilhasNav}>
        <button
          className={`${styles.tabBtn} ${trilhaAtivaKey === "fullstack" ? styles.activeTab : ""}`}
          onClick={() => setTrilhaAtivaKey("fullstack")}
        >
          <Layers size={16} /> Fullstack Web
        </button>
        <button
          className={`${styles.tabBtn} ${trilhaAtivaKey === "frontend" ? styles.activeTab : ""}`}
          onClick={() => setTrilhaAtivaKey("frontend")}
        >
          <BookOpen size={16} /> Frontend UI/UX
        </button>
        <button
          className={`${styles.tabBtn} ${trilhaAtivaKey === "backend" ? styles.activeTab : ""}`}
          onClick={() => setTrilhaAtivaKey("backend")}
        >
          <Sparkles size={16} /> Backend & IA
        </button>
      </div>

      <div className={styles.progressCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc' }}>{infoAtual.titulo}</h4>
              {trilhaEscolhidaPeloAluno === trilhaAtivaKey ? (
                <span style={{ background: '#10b981', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: 8 }}>
                  ⭐ Minha Trilha Ativa
                </span>
              ) : (
                <button 
                  onClick={() => setTrilhaEscolhidaPeloAluno(trilhaAtivaKey)}
                  style={{ background: '#334155', border: 'none', color: '#cbd5e1', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: 8, cursor: 'pointer' }}
                >
                  Selecionar esta Trilha
                </button>
              )}
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>{infoAtual.descricao}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>{progressoPercent}%</span>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{concluidosCount} de {checkpointsAtuais.length} Módulos</div>
          </div>
        </div>

        <div className={styles.progressBarBg}>
          <div className={styles.progressBarFill} style={{ width: `${progressoPercent}%` }} />
        </div>
      </div>

      <div className={styles.checkpointsList}>
        <h5 style={{ margin: '10px 0 0 0', fontSize: '0.95rem', color: '#cbd5e1' }}>Módulos de Ação Direta (Estude & Pratique):</h5>
        {checkpointsAtuais.map((cp) => (
          <div key={cp.id} className={styles.checkpointItem} style={{ flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
              <div 
                style={{ cursor: 'pointer' }} 
                onClick={() => toggleCheckpoint(cp.id)}
                title="Clique para alternar status de conclusão"
              >
                {cp.feito ? (
                  <div className={styles.checkIconDone}><CheckCircle2 size={20} /></div>
                ) : (
                  <div className={styles.checkIconPending}><Circle size={20} /></div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: cp.feito ? '#f8fafc' : '#94a3b8', fontSize: '0.95rem' }}>{cp.titulo}</div>
                <div style={{ fontSize: '0.8rem', color: cp.feito ? '#34d399' : '#64748b', marginTop: 2 }}>
                  {cp.feito ? "✅ Módulo Concluído e Validado" : "⏳ Módulo Pendente"}
                </div>
              </div>
              <div style={{ background: '#0f172a', padding: '4px 10px', borderRadius: 8, fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>
                +{cp.xp} XP
              </div>
            </div>

            {/* BARRAS DE AÇÃO DIRETA - O Aluno pode clicar para Estudar ou Praticar */}
            <div className={styles.actionBtns} style={{ width: '100%', borderTop: '1px solid #334155', paddingTop: 10 }}>
              <button className={styles.btnStudy} onClick={() => handleIrEstudar(cp)}>
                <BookOpen size={14} /> 📖 Estudar Teoria
              </button>
              <button className={styles.btnPractice} onClick={() => handleIrPraticar(cp)}>
                <Code size={14} /> 💻 Praticar Exercício
              </button>
              <button className={styles.btnToggle} onClick={() => toggleCheckpoint(cp.id)}>
                <Check size={14} /> {cp.feito ? "Desmarcar Módulo" : "Concluir Módulo (+XP)"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
