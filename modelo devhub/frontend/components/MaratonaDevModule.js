import { useState, useEffect } from "react";
import { Trophy, Timer, Play, CheckCircle2, Award, Zap, Code, RefreshCw, Flame } from "lucide-react";

const DESAFIOS_MARATONA = [
  {
    id: 1,
    nivel: "Fácil",
    titulo: "Desafio 1: Inversor de Palavras e Filtro de Vogais",
    descricao: "Escreva a função `processarTexto(str)` que inverta a string recebida e remova todas as vogais em maiúsculas (A, E, I, O, U).",
    template: `function processarTexto(str) {
  // Seu código aqui
  // Exemplo: 'DevHub' -> 'buhvD'
  return str.split('').reverse().join('').replace(/[AEIOU]/g, '');
}`,
    testes: [
      { entrada: "DevHub", esperado: "buhvD" },
      { entrada: "JAVASCRIPT", esperado: "TPRCSVAJ" },
      { entrada: "React2026", esperado: "6202tcaeR" }
    ]
  },
  {
    id: 2,
    nivel: "Médio",
    titulo: "Desafio 2: Agrupador de Vendas por Categoria",
    descricao: "Escreva a função `somarVendas(vendas)` que receba um array de objetos `{ categoria, valor }` e retorne um objeto acumulando os totais por categoria.",
    template: `function somarVendas(vendas) {
  // Seu código aqui
  // Exemplo: [{ categoria: "tech", valor: 100 }, { categoria: "tech", valor: 50 }] -> { tech: 150 }
  const resultado = {};
  for (const item of vendas) {
    resultado[item.categoria] = (resultado[item.categoria] || 0) + item.valor;
  }
  return resultado;
}`,
    testes: [
      {
        entrada: [{ categoria: "tech", valor: 100 }, { categoria: "tech", valor: 50 }, { categoria: "livros", valor: 30 }],
        esperado: JSON.stringify({ tech: 150, livros: 30 })
      }
    ]
  },
  {
    id: 3,
    nivel: "Difícil",
    titulo: "Desafio 3: Validador de Matriz Simétrica",
    descricao: "Escreva a função `ehMatrizSimetrica(matriz)` que retorne true se a matriz for quadrada e igual à sua transposta (M[i][j] === M[j][i]).",
    template: `function ehMatrizSimetrica(matriz) {
  // Seu código aqui
  const n = matriz.length;
  for (let i = 0; i < n; i++) {
    if (matriz[i].length !== n) return false;
    for (let j = 0; j < n; j++) {
      if (matriz[i][j] !== matriz[j][i]) return false;
    }
  }
  return true;
}`,
    testes: [
      {
        entrada: [[1, 2], [2, 1]],
        esperado: true
      },
      {
        entrada: [[1, 2], [3, 4]],
        esperado: false
      }
    ]
  }
];

export default function MaratonaDevModule({ user, isDark, colors }) {
  const [desafioIndex, setDesafioIndex] = useState(0);
  const [codigos, setCodigos] = useState({
    0: DESAFIOS_MARATONA[0].template,
    1: DESAFIOS_MARATONA[1].template,
    2: DESAFIOS_MARATONA[2].template
  });
  const [logsConsole, setLogsConsole] = useState([]);
  const [tempoSegundos, setTempoSegundos] = useState(0);
  const [cronometroRodando, setCronometroRodando] = useState(true);
  const [concluido, setConcluido] = useState(false);
  const [testesPassados, setTestesPassados] = useState({ 0: false, 1: false, 2: false });

  useEffect(() => {
    let timer;
    if (cronometroRodando && !concluido) {
      timer = setInterval(() => setTempoSegundos(s => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cronometroRodando, concluido]);

  const formatarTempo = (totalSegs) => {
    const mins = Math.floor(totalSegs / 60);
    const segs = totalSegs % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const desafioAtual = DESAFIOS_MARATONA[desafioIndex];

  const testarCodigoAtual = () => {
    const codigo = codigos[desafioIndex];
    setLogsConsole([`▶️ Executando testes para o Desafio ${desafioIndex + 1}...`]);

    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`"use strict"; ${codigo}; return ${desafioIndex === 0 ? 'processarTexto' : desafioIndex === 1 ? 'somarVendas' : 'ehMatrizSimetrica'};`)();
      
      let passadouTodos = true;
      const logsTemp = [];

      desafioAtual.testes.forEach((t, idx) => {
        try {
          const res = fn(t.entrada);
          const resFormatada = typeof res === 'object' ? JSON.stringify(res) : res;
          const esperadoFormatado = typeof t.esperado === 'object' ? JSON.stringify(t.esperado) : t.esperado;

          if (resFormatada === esperadoFormatado) {
            logsTemp.push(`✅ Teste #${idx + 1}: PASSOU! Retorno: ${resFormatada}`);
          } else {
            passadouTodos = false;
            logsTemp.push(`❌ Teste #${idx + 1}: FALHOU! Esperava ${esperadoFormatado}, mas recebeu ${resFormatada}`);
          }
        } catch (err) {
          passadouTodos = false;
          logsTemp.push(`❌ Teste #${idx + 1}: Erro de execução: ${err.message}`);
        }
      });

      if (passadouTodos) {
        logsTemp.push(`🎉 TODOS OS TESTES PASSARAM NO DESAFIO ${desafioIndex + 1}!`);
        setTestesPassados(prev => ({ ...prev, [desafioIndex]: true }));
      }

      setLogsConsole(logsTemp);
    } catch (err) {
      setLogsConsole([`💥 Erro de sintaxe no código: ${err.message}`]);
    }
  };

  const finalizarMaratona = () => {
    setCronometroRodando(false);
    setConcluido(true);
  };

  return (
    <div style={{
      backgroundColor: colors?.bgCard || "#131722",
      borderRadius: "20px",
      border: "1px solid rgba(255,255,255,0.08)",
      padding: "24px",
      color: "#FFF"
    }}>
      {/* Cabeçalho do Hackathon */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "46px", height: "46px", borderRadius: "14px",
            background: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(245,158,11,0.4)"
          }}>
            <Trophy size={24} color="#FFF" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800 }}>🏆 Maratona Dev de Fim de Semana</h2>
            <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
              Resolva a bateria de 3 desafios em menor tempo e suba no Leaderboard!
            </div>
          </div>
        </div>

        {/* Cronômetro e Botão de Conclusão */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)",
            padding: "8px 16px", borderRadius: "12px", color: "#FBBF24", fontWeight: 800, fontSize: "1rem"
          }}>
            <Timer size={18} />
            <span>{formatarTempo(tempoSegundos)}</span>
          </div>

          <button
            onClick={finalizarMaratona}
            disabled={concluido}
            style={{
              background: "linear-gradient(135deg,#10B981,#059669)",
              color: "#FFF", border: "none", padding: "10px 18px", borderRadius: "12px",
              fontWeight: 800, cursor: concluido ? "not-allowed" : "pointer", fontSize: "0.9rem"
            }}
          >
            {concluido ? "🏁 Maratona Concluída" : "🚀 Submeter Resultado"}
          </button>
        </div>
      </div>

      {/* Tabs dos 3 Desafios */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        {DESAFIOS_MARATONA.map((d, idx) => {
          const passou = testesPassados[idx];
          const ativo = desafioIndex === idx;
          return (
            <button
              key={d.id}
              onClick={() => setDesafioIndex(idx)}
              style={{
                flex: 1, padding: "12px", borderRadius: "12px",
                border: ativo ? "2px solid #F59E0B" : "1px solid rgba(255,255,255,0.1)",
                background: ativo ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.03)",
                color: ativo ? "#FBBF24" : "#94a3b8",
                fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
              }}
            >
              <span>Desafio {idx + 1}</span>
              {passou && <CheckCircle2 size={16} color="#10B981" />}
            </button>
          );
        })}
      </div>

      {/* Enunciado do Desafio Atual */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px", padding: "18px", marginBottom: "16px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <h3 style={{ margin: 0, fontSize: "1.05rem", color: "#FFF" }}>{desafioAtual.titulo}</h3>
          <span style={{
            fontSize: "0.75rem", fontWeight: 900, padding: "3px 10px", borderRadius: "20px",
            background: desafioAtual.nivel === "Fácil" ? "rgba(16,185,129,0.2)" : desafioAtual.nivel === "Médio" ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.2)",
            color: desafioAtual.nivel === "Fácil" ? "#34D399" : desafioAtual.nivel === "Médio" ? "#FBBF24" : "#F87171"
          }}>
            {desafioAtual.nivel}
          </span>
        </div>
        <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.5 }}>{desafioAtual.descricao}</p>
      </div>

      {/* Editor + Console Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
        <div>
          <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#818cf8", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Code size={16} /> SEU CÓDIGO (JAVASCRIPT):
          </div>
          <textarea
            value={codigos[desafioIndex]}
            onChange={(e) => setCodigos({ ...codigos, [desafioIndex]: e.target.value })}
            style={{
              width: "100%", height: "240px", boxSizing: "border-box",
              background: "#0d1117", color: "#38bdf8", fontFamily: "monospace",
              fontSize: "0.88rem", padding: "14px", borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.15)", resize: "none", outline: "none"
            }}
          />
          <button
            onClick={testarCodigoAtual}
            style={{
              marginTop: "8px", width: "100%", padding: "10px",
              background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#FFF",
              border: "none", borderRadius: "10px", fontWeight: 800, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
            }}
          >
            <Play size={16} /> Testar Código no Console
          </button>
        </div>

        <div>
          <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#34D399", marginBottom: "6px" }}>
            🖥️ CONSOLE DE TESTES UNITÁRIOS:
          </div>
          <div style={{
            height: "280px", background: "#090d16", borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)", padding: "14px",
            overflowY: "auto", fontFamily: "monospace", fontSize: "0.83rem", color: "#cbd5e1"
          }}>
            {logsConsole.length === 0 ? (
              <div style={{ color: "#64748b" }}>Clique em "Testar Código" para rodar a suíte de testes automáticos.</div>
            ) : (
              logsConsole.map((l, i) => <div key={i} style={{ marginBottom: "6px", lineHeight: 1.4 }}>{l}</div>)
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard ao Vivo da Maratona */}
      <div style={{
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px", padding: "20px"
      }}>
        <h3 style={{ margin: "0 0 14px", fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
          <Flame color="#F59E0B" size={20} /> Ranking ao Vivo do Hackathon
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "10px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
            <span>🥇 1º Lugar: <strong>Alexandre Silva</strong></span>
            <span style={{ fontSize: "0.85rem", color: "#FBBF24" }}>Tempo: 04:12 • 3/3 Testes Passados (+500 XP)</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span>🥈 2º Lugar: <strong>Mariana Costa</strong></span>
            <span style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>Tempo: 06:45 • 3/3 Testes Passados (+350 XP)</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span>🥉 3º Lugar: <strong>{user?.nome || "Você"}</strong></span>
            <span style={{ fontSize: "0.85rem", color: "#34D399" }}>Tempo: {formatarTempo(tempoSegundos)} • {Object.values(testesPassados).filter(Boolean).length}/3 Testes Passados</span>
          </div>
        </div>
      </div>
    </div>
  );
}
