import React, { useState, useEffect } from "react";
import styles from "./VisaoGeralSection.module.css";
import StudentGamificationHeader from "../StudentGamificationHeader";
import { 
  Sparkles, Flame, Trophy, Calendar, 
  BookOpen, Code, Swords, 
  ArrowRight, Bell, Shield, CheckCircle2, Star, Clock, Home, ArrowLeft
} from "lucide-react";

export default function VisaoGeralSection({ user, setAbaAtiva, isDark, agendaAulas = [] }) {
  const [anuncio, setAnuncio] = useState(null);
  const [proximaReuniao, setProximaReuniao] = useState(null);

  // Helper para converter string de data PT-BR ("DD/MM/YYYY") em Date
  const parseDataBR = (str) => {
    if (!str) return null;
    const parts = str.split('/');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
    return new Date(str);
  };

  useEffect(() => {
    let lista = Array.isArray(agendaAulas) && agendaAulas.length > 0 ? agendaAulas : [];
    if (lista.length === 0 && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("devhub_agenda_aulas");
        if (saved) lista = JSON.parse(saved);
      } catch (e) {}
    }

    if (lista && lista.length > 0) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const hojeStr = new Date().toLocaleDateString('pt-BR');
      
      let proxima = lista.find(a => a.data === hojeStr && !a.status?.includes("Concluída"));
      
      if (!proxima) {
        const futuras = lista
          .filter(a => {
            if (a.status?.includes("Concluída")) return false;
            const dt = parseDataBR(a.data);
            if (!dt || isNaN(dt.getTime())) return false;
            dt.setHours(23, 59, 59, 999);
            return dt >= hoje;
          })
          .sort((a, b) => (parseDataBR(a.data) || 0) - (parseDataBR(b.data) || 0));

        proxima = futuras.length > 0 ? futuras[0] : null;
      }
      setProximaReuniao(proxima);
    } else {
      setProximaReuniao(null);
    }
  }, [agendaAulas]);

  const carregarAnuncio = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/superadmin/anuncio`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.anuncio && data.anuncio.mensagem) {
          setAnuncio(data.anuncio);
        } else {
          checkLocalAnuncio();
        }
      })
      .catch(() => {
        checkLocalAnuncio();
      });
  };

  const checkLocalAnuncio = () => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("devhub_anuncios_globais");
        if (raw) {
          const lista = JSON.parse(raw);
          if (Array.isArray(lista) && lista.length > 0) {
            const top = lista[0];
            const agora = Date.now();
            const limite48h = 48 * 60 * 60 * 1000;
            if (!top.id || (agora - top.id) < limite48h) {
              setAnuncio({
                mensagem: top.titulo ? `${top.titulo}${top.mensagem ? ` — ${top.mensagem}` : ''}` : top.mensagem,
                autor: top.autor || "Super Admin"
              });
              return;
            }
          }
        }
      } catch (e) {}
    }
    setAnuncio(null);
  };

  useEffect(() => {
    carregarAnuncio();

    const handleUpdate = () => carregarAnuncio();
    if (typeof window !== "undefined") {
      window.addEventListener("devhub_anuncio_publicado", handleUpdate);
      window.addEventListener("storage", handleUpdate);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("devhub_anuncio_publicado", handleUpdate);
        window.removeEventListener("storage", handleUpdate);
      }
    };
  }, []);

  const atalhosRapidos = [
    {
      id: "aulas",
      titulo: "Assistir Aulas",
      subtitulo: "Trilhas em vídeo e teoria",
      icon: BookOpen,
      color: "#3B82F6",
      bgIcon: "rgba(59, 130, 246, 0.16)"
    },
    {
      id: "caderno",
      titulo: "Caderno de Notas",
      subtitulo: "Anotações e blocos de código",
      icon: Code,
      color: "#8B5CF6",
      bgIcon: "rgba(139, 92, 246, 0.16)"
    }
  ];

  return (
    <div className={styles.container}>
      
      {/* BARRA SUPERIOR DO DASHBOARD COM BOTÃO VOLTAR AO INÍCIO */}
      <div className={`${styles.topNavHeader} ${!isDark ? styles.topNavHeaderLight : ""}`}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div className={styles.headerIconBadge}>
            <Home size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "900", margin: 0, color: isDark ? "#F8FAFC" : "#0F172A", letterSpacing: "-0.01em" }}>
              Visão Geral — Dashboard do Estudante
            </h2>
            <p style={{ fontSize: "0.84rem", color: isDark ? "#94A3B8" : "#64748B", margin: "3px 0 0 0" }}>
              Resumo limpo do seu progresso, próximas aulas e anúncios da plataforma.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Header Gamificado do Aluno (XP, Nível, Streak & Avatar) */}
      <StudentGamificationHeader user={user} />

      {/* 2. Central de Destaques & Próxima Aula (Layout Clean & Enxuto) */}
      <div className={styles.infoBox}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "18px" }}>
          
          {/* Card: Comunicado Recente */}
          <div 
            className={styles.infoBoxCard}
            style={{
              background: anuncio ? (isDark ? "rgba(245, 158, 11, 0.08)" : "rgba(245, 158, 11, 0.05)") : (isDark ? "rgba(255, 255, 255, 0.02)" : "#F8FAFC"),
              border: `1px solid ${anuncio ? "rgba(245, 158, 11, 0.3)" : (isDark ? "rgba(255, 255, 255, 0.07)" : "#E2E8F0")}`
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: anuncio ? "#F59E0B" : (isDark ? "#94A3B8" : "#64748B"), fontSize: "0.82rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <Bell size={16} />
              <span>Comunicado Recente</span>
            </div>

            {anuncio ? (
              <div>
                <div style={{ fontWeight: "800", fontSize: "0.95rem", color: isDark ? "#F8FAFC" : "#0F172A", marginBottom: "4px" }}>
                  {anuncio.mensagem}
                </div>
                <div style={{ fontSize: "0.78rem", color: isDark ? "#94A3B8" : "#64748B" }}>
                  Publicado por: {anuncio.autor || "Super Admin"}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: "0.88rem", color: isDark ? "#94A3B8" : "#64748B", fontWeight: "500" }}>
                📢 Nenhum aviso novo no momento. Bons estudos!
              </div>
            )}
          </div>

          {/* Card: Próxima Aula na Agenda */}
          <div 
            className={styles.infoBoxCard}
            onClick={() => setAbaAtiva && setAbaAtiva("agenda")}
            style={{
              background: proximaReuniao ? (isDark ? "rgba(16, 185, 129, 0.08)" : "rgba(16, 185, 129, 0.05)") : (isDark ? "rgba(255, 255, 255, 0.02)" : "#F8FAFC"),
              border: `1px solid ${proximaReuniao ? "rgba(16, 185, 129, 0.3)" : (isDark ? "rgba(255, 255, 255, 0.07)" : "#E2E8F0")}`,
              cursor: "pointer"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: proximaReuniao ? "#10B981" : (isDark ? "#94A3B8" : "#64748B"), fontSize: "0.82rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <Calendar size={16} />
                <span>Próxima Aula</span>
              </div>
              <span style={{ fontSize: "0.78rem", color: "#10B981", fontWeight: "800", display: "flex", alignItems: "center", gap: "3px" }}>
                Ver Agenda ↗
              </span>
            </div>

            {proximaReuniao ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Clock size={22} color="#10B981" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: "800", fontSize: "0.95rem", color: isDark ? "#F8FAFC" : "#0F172A" }}>
                    {proximaReuniao.titulo || "Aula Agendada"}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: isDark ? "#94A3B8" : "#64748B", marginTop: "3px" }}>
                    📅 {proximaReuniao.data || "Data a definir"} às {proximaReuniao.horario || proximaReuniao.horario_inicio || "19:00"} {proximaReuniao.instrutor ? `• ${proximaReuniao.instrutor.replace(/\s*\(.*?\)/, "").trim()}` : ""}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: "0.88rem", color: isDark ? "#94A3B8" : "#64748B", fontWeight: "500" }}>
                📅 Nenhuma aula pendente. Clique para abrir o calendário.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 3. Atalhos Rápidos */}
      <div>
        <h3 className={styles.sectionTitle} style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}>
          <Sparkles size={18} color="#3B82F6" />
          <span>Acesso Rápido aos Módulos</span>
        </h3>
        
        <div className={styles.quickGrid}>
          {atalhosRapidos.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id} 
                className={styles.quickCard}
                onClick={() => {
                  if (item.id === "dev_ia") {
                    window.dispatchEvent(new CustomEvent("devhub_abrir_ia"));
                  } else {
                    setAbaAtiva(item.id);
                  }
                }}
              >
                <div className={styles.quickCardHeader}>
                  <div className={styles.quickIcon} style={{ background: item.bgIcon, color: item.color }}>
                    <Icon size={22} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 className={styles.quickCardTitle}>{item.titulo}</h4>
                    <p className={styles.quickCardDesc}>{item.subtitulo}</p>
                  </div>
                  <ArrowRight size={18} className={styles.quickArrowIcon} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
