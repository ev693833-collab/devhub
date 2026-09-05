import { useState } from "react";
import BatalhaCodigoModule from "./BatalhaCodigoModule";
import PairProgrammingModule from "./PairProgrammingModule";
import MiniSistemasModule from "./MiniSistemasModule";

export default function GameCatalogModule({ user, isDark, colors, relatorioAlunos }) {
  const [jogoAtivo, setJogoAtivo] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const backBtnStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0"}`,
    color: isDark ? "#CBD5E1" : "#475569",
    padding: "8px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "20px",
    transition: "all 0.2s",
  };

  if (jogoAtivo === "batalha") {
    return (
      <div>
        <button style={backBtnStyle} onClick={() => setJogoAtivo(null)}>
          ← Voltar ao Catálogo
        </button>
        <BatalhaCodigoModule user={user} relatorioAlunos={relatorioAlunos} />
      </div>
    );
  }

  if (jogoAtivo === "pair") {
    return (
      <div>
        <button style={backBtnStyle} onClick={() => setJogoAtivo(null)}>
          ← Voltar ao Catálogo
        </button>
        <PairProgrammingModule user={user} isDark={isDark} colors={colors} />
      </div>
    );
  }

  if (jogoAtivo === "mini_sistemas") {
    return (
      <div>
        <button style={backBtnStyle} onClick={() => setJogoAtivo(null)}>
          ← Voltar ao Catálogo
        </button>
        <MiniSistemasModule user={user} isDark={isDark} colors={colors} />
      </div>
    );
  }

  const jogos = [
    {
      id: "batalha",
      emoji: "⚔️",
      titulo: "Batalha de Código",
      subtitulo: "Arena 1v1 PvP",
      descricao: "Enfrente outros devs em duelos de código em tempo real. Resolva desafios, mostre sua velocidade e suba no ranking global!",
      badge: "1v1 PvP",
      badgeColor: "#EF4444",
      cor: "#EF4444",
      corSecundaria: "#F97316",
      tags: ["Competitivo", "Tempo Real", "Ranking"],
      aura: "rgba(239,68,68,0.18)",
      gradientAura: "linear-gradient(135deg, rgba(239,68,68,0.22) 0%, rgba(249,115,22,0.12) 100%)",
    },
    {
      id: "pair",
      emoji: "🤝",
      titulo: "Programar em Dupla",
      subtitulo: "Pair Programming",
      descricao: "Colabore com um parceiro em projetos reais usando sessões de pair programming. Aprenda mais rápido e entregue código de qualidade!",
      badge: "Dupla 🤝",
      badgeColor: "#10B981",
      cor: "#10B981",
      corSecundaria: "#3B82F6",
      tags: ["Colaborativo", "Projetos", "Aprendizado"],
      aura: "rgba(16,185,129,0.18)",
      gradientAura: "linear-gradient(135deg, rgba(16,185,129,0.22) 0%, rgba(59,130,246,0.12) 100%)",
    },
    {
      id: "mini_sistemas",
      emoji: "🚀",
      titulo: "Mini-Sistemas Práticos",
      subtitulo: "Laboratório Playground",
      descricao: "Desenvolva a lógica de sistemas reais em miniatura (E-commerce, Kanban, Auth, Financeiro) com Live Preview ao vivo e ganhe XP!",
      badge: "Prático 🧪",
      badgeColor: "#8B5CF6",
      cor: "#8B5CF6",
      corSecundaria: "#EC4899",
      tags: ["Laboratório", "Live Preview", "Sistemas"],
      aura: "rgba(139,92,246,0.18)",
      gradientAura: "linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(236,72,153,0.12) 100%)",
    }
  ];

  return (
    <div style={{ padding: "0 0 40px 0" }}>
      {/* Header do Catálogo */}
      <div style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.10) 100%)"
          : "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.05) 100%)",
        border: `1px solid ${isDark ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.15)"}`,
        borderRadius: "20px",
        padding: "28px 32px",
        marginBottom: "32px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
      }}>
        <div style={{
          width: "60px",
          height: "60px",
          borderRadius: "18px",
          background: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          flexShrink: 0,
          boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
        }}>🎮</div>
        <div style={{ flex: 1 }}>
          <h2 style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: "900",
            color: isDark ? "#F1F5F9" : "#0F172A",
            letterSpacing: "-0.5px",
          }}>
            Catálogo de Jogos & Laboratório DevHub
          </h2>
          <p style={{
            margin: "4px 0 0 0",
            fontSize: "14px",
            color: isDark ? "#94A3B8" : "#64748B",
            fontWeight: "500",
          }}>
            Escolha uma modalidade: duelos PvP 1v1, pair programming em dupla ou construa mini-sistemas no laboratório com Live Preview!
          </p>
        </div>
        <span style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.2) 100%)",
          border: "1px solid rgba(99,102,241,0.35)",
          borderRadius: "20px",
          padding: "6px 14px",
          fontSize: "12px",
          fontWeight: "800",
          color: "#A5B4FC",
          flexShrink: 0,
        }}>🎮 3 Modalidades</span>
      </div>

      {/* Grid de Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px",
      }}>
        {jogos.map((jogo) => {
          const isHov = hoveredCard === jogo.id;
          return (
            <div
              key={jogo.id}
              onMouseEnter={() => setHoveredCard(jogo.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setJogoAtivo(jogo.id)}
              style={{
                background: isDark
                  ? "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.98) 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                border: `1.5px solid ${isHov ? jogo.cor : (isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0")}`,
                borderRadius: "22px",
                padding: "32px 28px",
                cursor: "pointer",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                boxShadow: isHov
                  ? `0 20px 60px ${jogo.cor}30, 0 8px 24px ${jogo.cor}20`
                  : isDark ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.08)",
                transform: isHov ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
              }}
            >
              {/* Brilho de fundo */}
              <div style={{
                position: "absolute",
                top: "-40px",
                right: "-40px",
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                background: jogo.gradientAura,
                filter: "blur(40px)",
                opacity: isHov ? 1 : 0.5,
                pointerEvents: "none",
                transition: "opacity 0.35s",
              }} />

              {/* Topo: ícone + badge */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "20px",
                position: "relative",
              }}>
                <div style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "20px",
                  background: jogo.aura,
                  border: `2px solid ${jogo.cor}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "36px",
                  boxShadow: isHov ? `0 8px 24px ${jogo.cor}40` : "none",
                  transition: "all 0.35s",
                }}>
                  {jogo.emoji}
                </div>
                <div style={{
                  background: `${jogo.badgeColor}20`,
                  border: `1.5px solid ${jogo.badgeColor}60`,
                  borderRadius: "12px",
                  padding: "5px 12px",
                  fontSize: "11px",
                  fontWeight: "900",
                  color: jogo.badgeColor,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}>
                  {jogo.badge}
                </div>
              </div>

              {/* Título */}
              <div style={{ position: "relative", marginBottom: "14px" }}>
                <h3 style={{
                  margin: "0 0 4px 0",
                  fontSize: "20px",
                  fontWeight: "900",
                  color: isDark ? "#F1F5F9" : "#0F172A",
                  letterSpacing: "-0.3px",
                }}>{jogo.titulo}</h3>
                <div style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: jogo.cor,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}>{jogo.subtitulo}</div>
              </div>

              {/* Descrição */}
              <p style={{
                margin: "0 0 20px 0",
                fontSize: "14px",
                lineHeight: "1.65",
                color: isDark ? "#94A3B8" : "#64748B",
                fontWeight: "500",
                position: "relative",
              }}>{jogo.descricao}</p>

              {/* Tags */}
              <div style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "24px",
                position: "relative",
              }}>
                {jogo.tags.map((tag) => (
                  <span key={tag} style={{
                    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                    borderRadius: "8px",
                    padding: "3px 10px",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: isDark ? "#CBD5E1" : "#475569",
                  }}>{tag}</span>
                ))}
              </div>

              {/* Botão Entrar */}
              <button
                onClick={(e) => { e.stopPropagation(); setJogoAtivo(jogo.id); }}
                style={{
                  width: "100%",
                  padding: "13px 20px",
                  borderRadius: "14px",
                  border: `1.5px solid ${isHov ? "transparent" : `${jogo.cor}40`}`,
                  background: isHov
                    ? `linear-gradient(135deg, ${jogo.cor} 0%, ${jogo.corSecundaria} 100%)`
                    : isDark ? `${jogo.cor}18` : `${jogo.cor}12`,
                  color: isHov ? "#FFF" : jogo.cor,
                  fontSize: "14px",
                  fontWeight: "800",
                  cursor: "pointer",
                  transition: "all 0.35s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: isHov ? `0 8px 24px ${jogo.cor}50` : "none",
                  position: "relative",
                }}
              >
                {isHov ? `Abrir ${jogo.titulo} →` : `Entrar no ${jogo.titulo}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: "28px",
        padding: "16px 20px",
        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
        border: `1px dashed ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}>
        <span style={{ fontSize: "18px" }}>💡</span>
        <span style={{
          fontSize: "13px",
          color: isDark ? "#64748B" : "#94A3B8",
          fontWeight: "500",
        }}>
          Explore o laboratório de mini-sistemas e batalhas para aplicar seu conhecimento na prática com feedback em tempo real!
        </span>
      </div>
    </div>
  );
}
