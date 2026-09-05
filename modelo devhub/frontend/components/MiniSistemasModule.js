import { useState } from "react";
import { 
  Code, Play, Eye, Sparkles, Terminal, User, ShoppingBag, DollarSign, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, Table, HelpCircle, Layers, Inbox, Trash2
} from "lucide-react";

export default function MiniSistemasModule({ isDark, colors }) {
  // O campo de código inicia VAZIO
  const [codigoText, setCodigoText] = useState("");
  const [analiseStatus, setAnaliseStatus] = useState(null);
  const [dadosResultado, setDadosResultado] = useState(null);
  const [logsConsole, setLogsConsole] = useState([]);
  const [copiado, setCopiado] = useState(false);

  // Template Exemplo que o usuário pode inserir com 1 clique se desejar
  const CODIGO_EXEMPLO = `// 💡 CÓDIGO EXEMPLO: QUALQUER DADO OU CONSULTA
// Qualquer retorno atribuído à variável 'resultado' será lido dinamicamente na tabela!

const listaAlunos = [
  { id: 1, aluno: "Lucas", nota: 9.5, status: "Aprovado 🎉" },
  { id: 2, aluno: "Maria", nota: 8.0, status: "Aprovado 🎉" },
  { id: 3, aluno: "Enzo", nota: 10.0, status: "Aprovado 🎉" }
];

const resultado = {
  turma: "DevHub - Módulo JS",
  itens: listaAlunos
};

console.log("Código analisado com sucesso! Tabela povoada.");`;

  // Função para Rever o Código e Puxar para a Tabela ao Lado
  const handleReverEPuxarParaTabela = () => {
    setLogsConsole([]);

    if (!codigoText || codigoText.trim() === "") {
      setAnaliseStatus({
        tipo: "erro",
        mensagem: "⚠️ O campo de código está vazio! Digite seu código no campo à esquerda para analisar e puxar para a tabela."
      });
      setDadosResultado(null);
      return;
    }

    setAnaliseStatus({ tipo: "analisando", mensagem: "🔍 Analisando código e processando dados..." });

    try {
      let customLogs = [];
      const customConsole = {
        log: (...args) => customLogs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ")),
        error: (...args) => customLogs.push("Erro: " + args.join(" "))
      };

      // Compila e executa o código fornecido no campo
      const runFn = new Function("console", `${codigoText}\nif (typeof resultado !== 'undefined') return resultado;\nreturn null;`);
      const output = runFn(customConsole);

      if (output === null || output === undefined) {
        throw new Error("O seu código precisa definir uma variável ou objeto 'resultado' (ex: const resultado = { ... }) para que os dados sejam puxados para a tabela!");
      }

      setDadosResultado(output);
      setLogsConsole(customLogs.length > 0 ? customLogs : ["✅ Código analisado com sucesso! Dados puxados."]);
      setAnaliseStatus({
        tipo: "sucesso",
        mensagem: "✅ Código revisto e analisado! Os dados do seu código foram puxados com sucesso para a tabela ao lado."
      });

    } catch (err) {
      setDadosResultado(null);
      setLogsConsole([`❌ Erro na análise do código: ${err.message}`]);
      setAnaliseStatus({
        tipo: "erro",
        mensagem: `❌ Erro ao analisar código: ${err.message}`
      });
    }
  };

  const handleCopiar = () => {
    if (!codigoText) return;
    navigator.clipboard.writeText(codigoText);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const handleLimpar = () => {
    setCodigoText("");
    setDadosResultado(null);
    setAnaliseStatus(null);
    setLogsConsole([]);
  };

  const handleCodigoChange = (e) => {
    const val = e.target.value;
    setCodigoText(val);

    // Se o usuário apagar o código do campo (ficar vazio), a tabela ao lado fica vazia imediatamente
    if (!val || val.trim() === "") {
      setDadosResultado(null);
      setAnaliseStatus(null);
      setLogsConsole([]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* Header Explicativo em Destaque */}
      <div style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(16,185,129,0.16) 0%, rgba(59,130,246,0.12) 100%)"
          : "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(59,130,246,0.06) 100%)",
        border: `1.5px solid ${isDark ? "rgba(16,185,129,0.3)" : "rgba(16,185,129,0.2)"}`,
        borderRadius: "22px",
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: "280px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "16px", flexShrink: 0,
            background: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px",
            boxShadow: "0 8px 24px rgba(16,185,129,0.35)",
          }}>💡</div>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "900", margin: "0 0 4px 0", color: isDark ? "#F1F5F9" : "#0F172A" }}>
              Laboratório de Código & Tabela Dinâmica
            </h2>
            <p style={{ color: isDark ? "#CBD5E1" : "#475569", fontSize: "14px", margin: 0, lineHeight: "1.5" }}>
              💡 <strong>Como Funciona:</strong> Ambos os campos iniciam vazios. Qualquer código com qualquer estrutura que você colocar no <strong>Campo de Código</strong> será lido dinamicamente e suas colunas e dados serão <strong>puxados automaticamente para a Tabela ao lado</strong> assim que você clicar em <strong>"Rever Código & Puxar para Tabela"</strong>!
            </p>
          </div>
        </div>

        {/* Botão de Inserir Exemplo */}
        <button
          onClick={() => { setCodigoText(CODIGO_EXEMPLO); }}
          style={{
            padding: "10px 18px", borderRadius: "12px", border: "1px solid rgba(16,185,129,0.4)",
            background: "rgba(16,185,129,0.15)", color: "#10B981",
            fontSize: "13px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
          }}
        >
          <Sparkles size={16} /> Inserir Código Exemplo
        </button>
      </div>

      {/* Grid Principal em 2 Colunas */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        
        {/* LADO ESQUERDO: CAMPO DE CÓDIGO (INICIA VAZIO) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{
            background: "#0F172A", border: "1.5px solid rgba(16,185,129,0.4)", borderRadius: "20px", padding: "20px",
            display: "flex", flexDirection: "column", gap: "12px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", fontWeight: "800", color: "#10B981", display: "flex", alignItems: "center", gap: "8px" }}>
                <Code size={18} /> Campo de Código (Cole ou digite seu código JS)
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {codigoText && (
                  <button
                    onClick={handleLimpar}
                    title="Apagar código e limpar tabela"
                    style={{
                      background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#F87171", cursor: "pointer",
                      fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", borderRadius: "6px"
                    }}
                  >
                    <Trash2 size={13} /> Limpar
                  </button>
                )}
                <button
                  onClick={handleCopiar}
                  style={{
                    background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer",
                    fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px"
                  }}
                >
                  {copiado ? <Check size={14} color="#10B981" /> : <Copy size={14} />} {copiado ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

            <textarea
              value={codigoText}
              onChange={handleCodigoChange}
              placeholder="// O campo está vazio. Cole ou digite qualquer código JS com 'const resultado = { ... }' ou 'const resultado = [...]'..."
              rows={18}
              spellCheck={false}
              style={{
                width: "100%", backgroundColor: "transparent", border: "none", color: "#34D399", fontFamily: "monospace",
                fontSize: "13.5px", lineHeight: "1.6", outline: "none", resize: "none"
              }}
            />

            {/* BOTÃO PRINCIPAL */}
            <button
              onClick={handleReverEPuxarParaTabela}
              style={{
                width: "100%", padding: "14px", borderRadius: "14px", border: "none",
                background: "linear-gradient(135deg, #10B981 0%, #2563EB 100%)", color: "#FFF",
                fontWeight: "900", fontSize: "15px", cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center", gap: "10px",
                boxShadow: "0 4px 18px rgba(16,185,129,0.35)"
              }}
            >
              <Play size={18} /> 🔍 Rever Código & Puxar para Tabela
            </button>
          </div>

          {/* Console de Logs */}
          <div style={{
            background: "#020617", borderRadius: "16px", padding: "16px",
            border: `1px solid ${analiseStatus?.tipo === "sucesso" ? "rgba(16,185,129,0.4)" : (analiseStatus?.tipo === "erro" ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)")}`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#94A3B8", fontSize: "12px", fontWeight: "800", marginBottom: "8px" }}>
              <Terminal size={14} /> Status de Análise & Console:
            </div>
            {logsConsole.length === 0 ? (
              <div style={{ color: "#64748B", fontSize: "13px", fontStyle: "italic" }}>
                Aguardando execução do código...
              </div>
            ) : (
              logsConsole.map((log, i) => (
                <div key={i} style={{ color: log.startsWith("❌") ? "#F87171" : "#34D399", fontFamily: "monospace", fontSize: "13px" }}>
                  {log}
                </div>
              ))
            )}
          </div>

        </div>

        {/* LADO DIREITO: TABELA / PAINEL (100% DINÂMICA) */}
        <div style={{
          backgroundColor: isDark ? "#1E293B" : "#FFF", borderRadius: "20px", padding: "24px",
          border: `2px solid ${isDark ? "rgba(16,185,129,0.4)" : "#CBD5E1"}`, display: "flex", flexDirection: "column", gap: "18px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)", minHeight: "500px"
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "14px",
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`
          }}>
            <span style={{ fontSize: "14px", fontWeight: "900", color: "#10B981", display: "flex", alignItems: "center", gap: "8px" }}>
              <Table size={18} /> Tabela de Dados Puxados pelo Código
            </span>
            <span style={{
              fontSize: "11px", fontWeight: "800",
              background: dadosResultado ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)",
              color: dadosResultado ? "#10B981" : "#94A3B8", padding: "4px 10px", borderRadius: "8px"
            }}>
              {dadosResultado ? "🟢 Dados Carregados" : "⚪ Tabela Vazia"}
            </span>
          </div>

          {/* RENDERIZAÇÃO TOTALMENTE DINÂMICA DO RESULTADO */}
          {dadosResultado ? (
            renderDynamicContent(dadosResultado, isDark)
          ) : (
            /* Estado Inicial: Tabela Vazia */
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              flex: 1, textAlign: "center", padding: "40px 20px", color: isDark ? "#64748B" : "#94A3B8"
            }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "20px", background: isDark ? "rgba(255,255,255,0.03)" : "#F1F5F9",
                border: `1px dashed ${isDark ? "rgba(255,255,255,0.1)" : "#CBD5E1"}`, display: "flex",
                alignItems: "center", justifyContent: "center", color: "#94A3B8", marginBottom: "16px"
              }}>
                <Inbox size={32} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "800", margin: "0 0 6px 0", color: isDark ? "#CBD5E1" : "#475569" }}>
                A Tabela está Vazia no momento
              </h3>
              <p style={{ fontSize: "13.5px", maxWidth: "340px", margin: 0, lineHeight: "1.5" }}>
                Digite ou cole seu código no <strong>Campo de Código</strong> à esquerda e clique em <strong>"Rever Código & Puxar para Tabela"</strong> para carregar os dados aqui!
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

// RENDERIZADOR 100% DINÂMICO DE CONTEÚDO
function renderDynamicContent(dadosResultado, isDark) {
  if (!dadosResultado) return null;

  // Se o resultado for um array direto (ex: const resultado = [ ... ])
  if (Array.isArray(dadosResultado)) {
    return renderDynamicTable("Tabela de Itens Puxados", dadosResultado, isDark);
  }

  // Se o resultado for um valor primitivo
  if (typeof dadosResultado !== "object") {
    return (
      <div style={{
        background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
        borderRadius: "14px", padding: "16px 20px", fontSize: "16px", fontWeight: "800", color: "#10B981"
      }}>
        Resultado: {String(dadosResultado)}
      </div>
    );
  }

  // Se for um Objeto (ex: const resultado = { turma: '...', itens: [...] })
  const arrayEntries = [];
  const scalarEntries = [];

  Object.entries(dadosResultado).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      arrayEntries.push({ key, list: val });
    } else {
      scalarEntries.push({ key, val });
    }
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      
      {/* 1. CARDS/PAINÉIS PARA VALORES RESUMIDOS (ex: turma, totalGasto, usuario, etc.) */}
      {scalarEntries.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
          {scalarEntries.map(({ key, val }, idx) => {
            const formattedKey = formatColumnName(key);
            const isUserObj = typeof val === "object" && val !== null && (val.nome || val.name || val.email);

            if (isUserObj) {
              return (
                <div key={idx} style={{
                  gridColumn: "1 / -1", background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`,
                  borderRadius: "16px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px"
                }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "14px", background: "rgba(16,185,129,0.2)",
                    color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <User size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: isDark ? "#94A3B8" : "#64748B", fontWeight: "800" }}>{formattedKey}</div>
                    <div style={{ fontSize: "16px", fontWeight: "900", color: isDark ? "#F1F5F9" : "#0F172A" }}>
                      {val.nome || val.name || "Usuário"} {val.plano ? `(${val.plano})` : ""}
                    </div>
                    {val.email && <div style={{ fontSize: "12px", color: "#3B82F6" }}>📧 {val.email}</div>}
                  </div>
                </div>
              );
            }

            const isCurrency = typeof val === "number" && /valor|preco|total|gasto|salario|pagamento/i.test(key);
            const displayVal = isCurrency
              ? `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
              : (typeof val === "object" && val !== null ? JSON.stringify(val) : String(val));

            return (
              <div key={idx} style={{
                background: isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`,
                borderRadius: "14px", padding: "12px 16px"
              }}>
                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: isDark ? "#94A3B8" : "#64748B", fontWeight: "800", marginBottom: "4px" }}>
                  {formattedKey}
                </div>
                <div style={{ fontSize: "15px", fontWeight: "900", color: isCurrency ? "#10B981" : (isDark ? "#F1F5F9" : "#0F172A") }}>
                  {displayVal}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. TABELAS DINÂMICAS PARA CADA ARRAY ENCONTRADO NO RESULTADO */}
      {arrayEntries.map(({ key, list }, idx) => (
        <div key={idx}>
          {renderDynamicTable(formatColumnName(key), list, isDark)}
        </div>
      ))}

      {/* Se o objeto não tiver nem tabelas nem escalares legíveis */}
      {arrayEntries.length === 0 && scalarEntries.length === 0 && (
        <pre style={{
          background: isDark ? "#0F172A" : "#F1F5F9", padding: "16px", borderRadius: "12px",
          fontSize: "13px", color: "#34D399", overflowX: "auto"
        }}>
          {JSON.stringify(dadosResultado, null, 2)}
        </pre>
      )}
    </div>
  );
}

// RENDERIZADOR DINÂMICO DE TABELAS (Extrai dinamicamente TODAS as propriedades dos objetos)
function renderDynamicTable(titulo, list, isDark) {
  if (!list || list.length === 0) {
    return (
      <div style={{ color: isDark ? "#94A3B8" : "#64748B", fontSize: "13px", fontStyle: "italic" }}>
        {titulo} (0 itens).
      </div>
    );
  }

  // Se os itens forem primitivos
  const firstObj = list.find(item => typeof item === "object" && item !== null);
  if (!firstObj) {
    return (
      <div>
        <h4 style={{ fontSize: "14px", fontWeight: "800", color: isDark ? "#CBD5E1" : "#475569", margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: "6px" }}>
          <ShoppingBag size={16} color="#10B981" /> {titulo} ({list.length}):
        </h4>
        <div style={{ borderRadius: "12px", overflow: "hidden", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9", color: isDark ? "#CBD5E1" : "#475569" }}>
                <th style={{ padding: "10px 14px", fontWeight: "800" }}>#</th>
                <th style={{ padding: "10px 14px", fontWeight: "800" }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {list.map((val, idx) => (
                <tr key={idx} style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#E2E8F0"}` }}>
                  <td style={{ padding: "10px 14px", fontWeight: "700", color: "#3B82F6" }}>#{idx + 1}</td>
                  <td style={{ padding: "10px 14px", color: isDark ? "#F1F5F9" : "#0F172A", fontWeight: "700" }}>{String(val)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Coleciona todas as chaves existentes nos objetos da lista para criar as colunas automaticamente
  const keysSet = new Set();
  list.forEach(item => {
    if (typeof item === "object" && item !== null) {
      Object.keys(item).forEach(k => keysSet.add(k));
    }
  });

  const columns = Array.from(keysSet);

  return (
    <div>
      <h4 style={{ fontSize: "14px", fontWeight: "800", color: isDark ? "#CBD5E1" : "#475569", margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: "6px" }}>
        <ShoppingBag size={16} color="#10B981" /> {titulo} ({list.length}):
      </h4>

      <div style={{ borderRadius: "12px", overflowX: "auto", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9", color: isDark ? "#CBD5E1" : "#475569" }}>
              {columns.map(col => (
                <th key={col} style={{ padding: "10px 14px", fontWeight: "800" }}>
                  {formatColumnName(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((item, rowIdx) => (
              <tr key={rowIdx} style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#E2E8F0"}` }}>
                {columns.map(col => {
                  const val = item[col];
                  const isId = col.toLowerCase() === "id";
                  const isCurrency = typeof val === "number" && /valor|preco|total|gasto|salario|pagamento/i.test(col);
                  
                  let formattedCell = "-";
                  if (val !== undefined && val !== null) {
                    if (isCurrency) {
                      formattedCell = `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
                    } else if (typeof val === "object") {
                      formattedCell = JSON.stringify(val);
                    } else {
                      formattedCell = String(val);
                    }
                  }

                  return (
                    <td key={col} style={{
                      padding: "10px 14px",
                      fontWeight: isId || isCurrency ? "800" : "600",
                      color: isId ? "#3B82F6" : (isCurrency ? "#10B981" : (isDark ? "#F1F5F9" : "#0F172A"))
                    }}>
                      {isId && typeof val === "number" ? `#${val}` : formattedCell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Formata nomes de chaves de objetos para cabeçalho da tabela (ex: 'totalGasto' -> 'Total Gasto', 'nomeAluno' -> 'Nome Aluno')
function formatColumnName(key) {
  if (!key) return "";
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}
