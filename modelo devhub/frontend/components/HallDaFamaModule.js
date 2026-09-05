import { useState, useEffect } from "react";
import { Trophy, Medal, Award, Flame, Code, Sparkles, User, Star } from "lucide-react";

export default function HallDaFamaModule({ isDark, colors }) {
  const [categoria, setCategoria] = useState("geral"); // "geral" | "melhorFrontend" | "melhorBackend" | "melhorLogica" | "maiorEvolucao"
  const [dadosHall, setDadosHall] = useState({
    geral: [],
    melhorFrontend: [],
    melhorBackend: [],
    melhorLogica: [],
    maiorEvolucao: []
  });
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    carregarHall();
  }, []);

  const carregarHall = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/gamificacao/hall-da-fama`);
      if (res.ok) {
        const data = await res.json();
        setDadosHall(data);
      }
    } catch (e) {
      console.error("Erro ao carregar Hall da Fama:", e);
    } finally {
      setLoading(false);
    }
  };

  const listaAtual = dadosHall[categoria] || [];
  const top3 = listaAtual.slice(0, 3);
  const restante = listaAtual.slice(3);

  const CATEGORIAS = [
    { id: "geral", nome: "Ranking Geral 👑", desc: "Os maiores pontuadores de XP" },
    { id: "melhorFrontend", nome: "Melhor Front-end 🎨", desc: "Líderes em desafios visuais e UI" },
    { id: "melhorBackend", nome: "Melhor Back-end ⚙️", desc: "Mestres em bancos de dados e APIs" },
    { id: "melhorLogica", nome: "Melhor Lógica 🧩", desc: "Campeões em algoritmos e complexidade" },
    { id: "maiorEvolucao", nome: "Maior Evolução 🚀", desc: "Alunos com maior crescimento recente" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "900", display: "flex", alignItems: "center", gap: "10px", margin: "0 0 6px 0" }}>
            🏆 Hall da Fama DevHub
          </h2>
          <p style={{ color: colors?.textSecondary || "#94A3B8", fontSize: "14px", margin: 0 }}>
            Reconhecimento oficial dos melhores alunos em cada especialidade da tecnologia.
          </p>
        </div>

        {/* Abas de Categorias */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", maxWidth: "100%" }}>
          {CATEGORIAS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoria(cat.id)}
              style={{
                padding: "10px 16px", borderRadius: "12px", fontSize: "13px", fontWeight: "800", cursor: "pointer", whitespace: "nowrap",
                border: categoria === cat.id ? "1.5px solid #F59E0B" : `1px solid ${colors?.borderCard || "rgba(255,255,255,0.1)"}`,
                backgroundColor: categoria === cat.id ? "rgba(245,158,11,0.15)" : (colors?.bgCard || "#1E293B"),
                color: categoria === cat.id ? "#F59E0B" : (colors?.textSecondary || "#94A3B8"),
                transition: "all 0.2s"
              }}
            >
              {cat.nome}
            </button>
          ))}
        </div>
      </div>

      {/* Pódio 3D dos Top 3 */}
      {top3.length > 0 && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", alignItems: "end",
          padding: "24px", borderRadius: "24px", background: isDark ? "linear-gradient(180deg, rgba(245,158,11,0.08) 0%, rgba(30,41,59,0.5) 100%)" : "#FFF",
          border: `1px dashed ${colors?.borderCard || "rgba(255,255,255,0.1)"}`
        }}>
          {/* 2º Lugar */}
          {top3[1] && (
            <div style={{ textAlign: "center", order: 1 }}>
              <div style={{ fontSize: "28px", marginBottom: "6px" }}>🥈</div>
              <div style={{
                backgroundColor: colors?.bgCard || "#1E293B", border: "2px solid #94A3B8", borderRadius: "18px", padding: "20px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
              }}>
                <strong style={{ fontSize: "16px", display: "block" }}>{top3[1].nome}</strong>
                <span style={{ fontSize: "12px", color: "#94A3B8", fontWeight: "700" }}>{top3[1].titulo || "Dev Pleno"}</span>
                <div style={{ marginTop: "12px", fontSize: "14px", fontWeight: "900", color: "#F59E0B" }}>⚡ {top3[1].xp} XP</div>
              </div>
            </div>
          )}

          {/* 1º Lugar (Destaque Central) */}
          {top3[0] && (
            <div style={{ textAlign: "center", order: 2 }}>
              <div style={{ fontSize: "36px", marginBottom: "6px" }}>👑</div>
              <div style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.15))", border: "2px solid #F59E0B", borderRadius: "20px", padding: "24px",
                boxShadow: "0 12px 30px rgba(245,158,11,0.3)"
              }}>
                <strong style={{ fontSize: "18px", display: "block", color: "#F59E0B" }}>{top3[0].nome}</strong>
                <span style={{ fontSize: "13px", color: "#FBBF24", fontWeight: "800" }}>{top3[0].titulo || "Senior Developer"}</span>
                <div style={{ marginTop: "14px", fontSize: "18px", fontWeight: "900", color: "#F59E0B" }}>🔥 {top3[0].xp} XP</div>
                <div style={{ fontSize: "11px", color: colors?.textSecondary, marginTop: "4px" }}>{top3[0].desafios} desafios • {top3[0].batalhas} batalhas</div>
              </div>
            </div>
          )}

          {/* 3º Lugar */}
          {top3[2] && (
            <div style={{ textAlign: "center", order: 3 }}>
              <div style={{ fontSize: "28px", marginBottom: "6px" }}>🥉</div>
              <div style={{
                backgroundColor: colors?.bgCard || "#1E293B", border: "2px solid #D97706", borderRadius: "18px", padding: "20px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
              }}>
                <strong style={{ fontSize: "16px", display: "block" }}>{top3[2].nome}</strong>
                <span style={{ fontSize: "12px", color: "#D97706", fontWeight: "700" }}>{top3[2].titulo || "Dev Jr"}</span>
                <div style={{ marginTop: "12px", fontSize: "14px", fontWeight: "900", color: "#F59E0B" }}>⚡ {top3[2].xp} XP</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabela do Restante da Classificação */}
      <div style={{ backgroundColor: colors?.bgCard || "#1E293B", borderRadius: "20px", border: `1px solid ${colors?.borderCard || "rgba(255,255,255,0.1)"}`, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors?.borderCard || "rgba(255,255,255,0.1)"}`, color: colors?.textSecondary || "#94A3B8" }}>
              <th style={{ padding: "16px 20px" }}>Posição</th>
              <th style={{ padding: "16px 20px" }}>Aluno</th>
              <th style={{ padding: "16px 20px" }}>Título</th>
              <th style={{ padding: "16px 20px" }}>Desafios Concluídos</th>
              <th style={{ padding: "16px 20px", textAlign: "right" }}>XP Total</th>
            </tr>
          </thead>
          <tbody>
            {restante.map((aluno, index) => (
              <tr key={index} style={{ borderBottom: `1px solid ${colors?.borderCard || "rgba(255,255,255,0.05)"}` }}>
                <td style={{ padding: "16px 20px", fontWeight: "800", color: colors?.textSecondary }}>#{index + 4}</td>
                <td style={{ padding: "16px 20px", fontWeight: "700" }}>{aluno.nome}</td>
                <td style={{ padding: "16px 20px" }}><span style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "10px", backgroundColor: "rgba(245,158,11,0.12)", color: "#F59E0B", fontWeight: "800" }}>{aluno.titulo}</span></td>
                <td style={{ padding: "16px 20px", color: colors?.textSecondary }}>{aluno.desafios} exercícios</td>
                <td style={{ padding: "16px 20px", textAlign: "right", fontWeight: "900", color: "#F59E0B" }}>{aluno.xp} XP</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
