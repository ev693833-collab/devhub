import React, { useState, useEffect } from "react";
import styles from "./VisaoGeralSection.module.css";
import StudentGamificationHeader from "../StudentGamificationHeader";
import { 
  Sparkles, Flame, Trophy, Calendar, 
  BookOpen, Compass, Code, Swords, BrainCircuit, 
  ArrowRight, Bell, Shield, CheckCircle2, Star, Clock
} from "lucide-react";

export default function VisaoGeralSection({ user, setAbaAtiva, isDark }) {
  const [anuncio, setAnuncio] = useState(null);
  const [dadosEconomia, setDadosEconomia] = useState({ devcoins: 2500, xp: 8420, nivel: 14, streak: 12 });

  useEffect(() => {
    // Buscar Anúncio do Super Admin se houver
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/superadmin/anuncio`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.anuncio) setAnuncio(data.anuncio);
      })
      .catch(() => {});

    // Ouvir evento de atualização da carteira
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("devhub_token") || localStorage.getItem("token");
      if (token) {
        fetch(`${apiUrl}/gamificacao/carteira`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data) {
              setDadosEconomia({
                devcoins: data.devcoins || 2500,
                xp: data.xp || 8420,
                nivel: Math.floor((data.xp || 8420) / 600) + 1,
                streak: data.streakDias || 12
              });
            }
          })
          .catch(() => {});
      }
    }
  }, []);

  const atalhosRapidos = [
    {
      id: "aulas",
      titulo: "Assistir Aulas",
      descricao: "Acesse módulos de HTML, CSS, JS, React e Node.",
      icon: BookOpen,
      color: "#3B82F6",
      bgIcon: "rgba(59, 130, 246, 0.18)"
    },
    {
      id: "trilhas",
      titulo: "Trilhas de Carreira",
      descricao: "Roadmaps completos do iniciante ao sênior.",
      icon: Compass,
      color: "#10B981",
      bgIcon: "rgba(16, 185, 129, 0.18)"
    },
    {
      id: "caderno",
      titulo: "Caderno de Estudos",
      descricao: "Editor de notas rich-text com blocos de código.",
      icon: Code,
      color: "#8B5CF6",
      bgIcon: "rgba(139, 92, 246, 0.18)"
    },
    {
      id: "batalhas",
      titulo: "Batalhas de Código",
      descricao: "Desafie outros alunos em duelos 1v1 PvP.",
      icon: Swords,
      color: "#EF4444",
      bgIcon: "rgba(239, 68, 68, 0.18)"
    },
    {
      id: "dev_ia",
      titulo: "DevIA — Tutor IA",
      descricao: "Assistente virtual para tirar dúvidas e criar resumos.",
      icon: BrainCircuit,
      color: "#F59E0B",
      bgIcon: "rgba(245, 158, 11, 0.18)"
    }
  ];

  return (
    <div className={styles.container}>
      {/* Gamificação & Progresso do Aluno (Fogo de Sequência & Habilidades) */}
      <StudentGamificationHeader user={user} />

      {/* 2. Grade de KPIs e Metas do Dia */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: "rgba(249, 115, 22, 0.18)", color: "#F97316" }}>
            <Flame size={24} />
          </div>
          <div>
            <div className={styles.kpiLabel}>Ofensiva Diária (Streak)</div>
            <div className={styles.kpiValue} style={{ color: "#F97316" }}>{dadosEconomia.streak} Dias ⚡</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: "rgba(168, 85, 247, 0.18)", color: "#A855F7" }}>
            <Trophy size={24} />
          </div>
          <div>
            <div className={styles.kpiLabel}>Pontuação Total (XP)</div>
            <div className={styles.kpiValue} style={{ color: "#A855F7" }}>{dadosEconomia.xp} XP</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: "rgba(16, 185, 129, 0.18)", color: "#10B981" }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className={styles.kpiLabel}>Frequência de Aulas</div>
            <div className={styles.kpiValue} style={{ color: "#10B981" }}>100% Presença</div>
          </div>
        </div>
      </div>

      {/* 4. Atalhos Rápidos */}
      <div>
        <h3 className={styles.sectionTitle}>
          <Sparkles size={20} color="#3B82F6" />
          <span>Atalhos Rápidos de Acesso</span>
        </h3>
        <div className={styles.quickGrid}>
          {atalhosRapidos.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id} 
                className={styles.quickCard}
                onClick={() => setAbaAtiva(item.id)}
              >
                <div className={styles.quickCardHeader}>
                  <div className={styles.quickIcon} style={{ background: item.bgIcon, color: item.color }}>
                    <Icon size={22} />
                  </div>
                  <h4 className={styles.quickCardTitle}>{item.titulo}</h4>
                </div>
                <p className={styles.quickCardDesc}>{item.descricao}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Painel Duplo: Anúncios do Admin & Próximos Compromissos */}
      <div className={styles.dualGrid}>
        {/* Anúncio Global */}
        <div className={styles.infoBox}>
          <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
            <Bell size={18} color="#F59E0B" />
            <span>Comunicados do Super Admin</span>
          </h3>
          {anuncio ? (
            <div className={styles.announcementBadge}>
              <Sparkles size={20} style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: "800", fontSize: "0.92rem", marginBottom: "4px" }}>
                  {anuncio.mensagem}
                </div>
                <div style={{ fontSize: "0.78rem", opacity: 0.8 }}>
                  Publicado por: {anuncio.autor || "Super Admin"}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: "0.88rem", color: "#94a3b8", padding: "12px", textAlign: "center" }}>
              📢 Nenhum aviso global novo no momento. Bons estudos!
            </div>
          )}
        </div>

        {/* Próximos Compromissos na Agenda */}
        <div className={styles.infoBox}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
              <Calendar size={18} color="#10B981" />
              <span>Próxima Aula Agendada na Agenda</span>
            </h3>
            {setAbaAtiva && (
              <button 
                onClick={() => setAbaAtiva("agenda")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#10B981",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                Ver Agenda ↗
              </button>
            )}
          </div>
          <div 
            onClick={() => setAbaAtiva && setAbaAtiva("agenda")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "16px",
              borderRadius: "14px",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#34d399",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <Clock size={22} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "800", fontSize: "0.92rem" }}>
                Mentoria ao Vivo: React & Componentização
              </div>
              <div style={{ fontSize: "0.8rem", opacity: 0.85, marginTop: "2px" }}>
                Hoje às 19:00 com o Instrutor DevHub
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
