import React, { useState, useEffect } from "react";
import styles from "./CodePlaygroundModule.module.css";
import { Play, Trash2, Code2, Terminal, Sparkles, Info, CheckCircle2, Zap, Globe, Layers } from "lucide-react";

export default function CodePlaygroundModule({ initialCode }) {
  const defaultCode = `// 🚀 DevHub Web Playground - Javascript ES6+
// Digite e execute qualquer código JS puro, funções, requisições API e algoritmos!

function calcularProgressoEstudos(horasDedicadas) {
  const metaHoras = 40;
  const porcentagem = Math.min(100, Math.round((horasDedicadas / metaHoras) * 100));
  return \`Seu progresso está em \${porcentagem}% da meta de \${metaHoras}h!\`;
}

console.log("⚡ Executando script no navegador...");
console.log(calcularProgressoEstudos(28));
console.log("DevCoins estimados: +50 XP 🏆");
`;

  const [code, setCode] = useState(initialCode || defaultCode);
  const [mostrarGuia, setMostrarGuia] = useState(false);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const [output, setOutput] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const presets = [
    {
      nome: "Array & Map / Filter",
      codigo: `const alunos = ["Enzo", "Ana", "Carlos", "Beatriz"];\nconst aprovados = alunos.map((aluno, index) => \`\${index + 1}º Lugar: \${aluno}\`);\nconsole.log("🏆 Ranking de Alunos:");\nconsole.log(aprovados.join("\\n"));`
    },
    {
      nome: "Algoritmo Fibonacci",
      codigo: `function fibonacci(n) {\n  let a = 0, b = 1;\n  const result = [a];\n  for(let i = 1; i < n; i++) {\n    result.push(b);\n    const temp = a + b;\n    a = b;\n    b = temp;\n  }\n  return result;\n}\nconsole.log("🔢 Fibonacci (8 termos):", fibonacci(8));`
    },
    {
      nome: "Requisição API (fetch)",
      codigo: `console.log("🌐 Fazendo requisição HTTP real...");\nfetch("https://jsonplaceholder.typicode.com/users/1")\n  .then(res => res.json())\n  .then(user => {\n    console.log("✅ Usuário recebido:", user.name);\n    console.log("📧 Email:", user.email);\n    console.log("🏙️ Cidade:", user.address.city);\n  })\n  .catch(err => console.error("❌ Erro:", err.message));`
    },
    {
      nome: "JSON & Manipulação Objeto",
      codigo: `const dev = {\n  nome: "DevHub Member",\n  xp: 1450,\n  habilidades: ["JavaScript", "React", "Node.js"]\n};\nconst jsonString = JSON.stringify(dev, null, 2);\nconsole.log("📦 JSON formatado:");\nconsole.log(jsonString);`
    }
  ];

  const tipocodigos = [
    { icone: Zap, titulo: "Lógica ES6+", desc: "Funções, variáveis, loops, map, filter, reduce e manipulação de strings.", cor: "#10B981", bg: "rgba(16, 185, 129, 0.15)" },
    { icone: Globe, titulo: "Async & fetch()", desc: "Requisições HTTP reais, Promises, async/await e setTimeout/setInterval.", cor: "#38BDF8", bg: "rgba(56, 189, 248, 0.15)" },
    { icone: Layers, titulo: "Estruturas de Dados", desc: "Arrays, Objetos, JSON (parse/stringify), Math e expressões regulares.", cor: "#A855F7", bg: "rgba(168, 85, 247, 0.15)" },
    { icone: Terminal, titulo: "Saída de Console", desc: "Tudo impresso via console.log(), console.error() e console.warn().", cor: "#F59E0B", bg: "rgba(245, 158, 11, 0.15)" }
  ];

  const runCode = () => {
    setIsExecuting(true);
    setOutput([]);

    const appendLog = (type, args) => {
      const text = args
        .map(arg => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
        .join(" ");
      setOutput(prev => [...prev, { type, text }]);
    };

    const customConsole = {
      log: (...args) => appendLog("log", args),
      error: (...args) => appendLog("error", args),
      warn: (...args) => appendLog("log", args.map((arg, i) => i === 0 ? "⚠️ " + arg : arg))
    };

    try {
      const isAsync = code.includes("await") || code.includes("Promise") || code.includes("fetch");
      if (isAsync) {
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
        const runFn = new AsyncFunction("console", code);
        runFn(customConsole).catch((err) => {
          appendLog("error", [`❌ Erro de Execução (Async): ${err.message}`]);
        });
      } else {
        const runFn = new Function("console", code);
        runFn(customConsole);
      }
    } catch (err) {
      appendLog("error", [`❌ Erro de Execução: ${err.message}`]);
    } finally {
      setTimeout(() => setIsExecuting(false), 200);
    }
  };

  const clearConsole = () => {
    setOutput([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconBadge}>
            <Code2 size={24} />
          </div>
          <div>
            <h3 className={styles.title}>Playground & Executor de Código Web</h3>
            <p className={styles.subtitle}>Execute funções, lógica JS e requisições HTTP em tempo real no browser</p>
          </div>
        </div>
        <div className={styles.actionControls}>
          <button className={styles.btnClear} onClick={clearConsole} title="Limpar Console">
            <Trash2 size={16} /> Limpar Log
          </button>
          <button className={styles.btnRun} onClick={runCode} disabled={isExecuting}>
            <Play size={18} /> {isExecuting ? "Executando..." : "Executar Código"}
          </button>
        </div>
      </div>

      {/* PAINEL UNIFICADO DE INSTRUÇÃO E GUIA DE RECURSOS */}
      <div style={{
        background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "18px",
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)"
      }}>
        {/* Barra de Instrução / Status */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
              background: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
              boxShadow: "0 0 14px rgba(16, 185, 129, 0.35)"
            }}>
              💡
            </div>
            <div>
              <div style={{ fontSize: "13.5px", fontWeight: "800", color: "#F8FAFC", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                Executor JavaScript em Tempo Real
                <span style={{ fontSize: "10px", fontWeight: "800", color: "#10B981", background: "rgba(16, 185, 129, 0.15)", padding: "2px 8px", borderRadius: "10px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                  Sandbox Seguro
                </span>
              </div>
              <div style={{ fontSize: "11.5px", color: "#94A3B8", marginTop: "2px" }}>
                Os scripts rodam localmente. Resultados de <code style={{ color: "#4ADE80", background: "rgba(0,0,0,0.3)", padding: "1px 6px", borderRadius: "4px", fontSize: "11px" }}>console.log(...)</code> aparecem no console ao lado.
              </div>
            </div>
          </div>

          <button
            onClick={() => setMostrarGuia(!mostrarGuia)}
            style={{
              background: mostrarGuia ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.04)",
              border: `1px solid ${mostrarGuia ? "rgba(56, 189, 248, 0.4)" : "rgba(255, 255, 255, 0.1)"}`,
              borderRadius: "10px",
              padding: "7px 14px",
              fontSize: "11.5px",
              fontWeight: "800",
              color: mostrarGuia ? "#38BDF8" : "#CBD5E1",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease"
            }}
          >
            <Sparkles size={14} /> {mostrarGuia ? "Ocultar Recursos" : "Ver Códigos Suportados"}
          </button>
        </div>

        {/* Grid de Recursos Suportados (Expansível de Forma Elegante) */}
        {mostrarGuia && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
            paddingTop: "12px",
            borderTop: "1px dashed rgba(255, 255, 255, 0.08)"
          }}>
            {tipocodigos.map((item, idx) => {
              const IconComp = item.icone;
              return (
                <div key={idx} style={{
                  background: "rgba(15, 23, 42, 0.7)",
                  border: `1px solid ${item.cor}30`,
                  borderRadius: "14px",
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "8px",
                      background: item.bg, border: `1px solid ${item.cor}40`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: item.cor, flexShrink: 0
                    }}>
                      <IconComp size={15} />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "800", color: "#F8FAFC" }}>
                      {item.titulo}
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#94A3B8", lineHeight: "1.4" }}>
                    {item.desc}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.editorLayout}>
        <div className={styles.pane}>
          <div className={styles.paneHeader}>
            <span><Code2 size={14} style={{ display: 'inline', marginRight: 6 }} /> Editor JavaScript</span>
            <span style={{ color: '#38bdf8' }}>ES6+ Supported</span>
          </div>
          <textarea
            className={styles.codeTextarea}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Digite seu código JS aqui..."
            spellCheck={false}
          />
        </div>

        <div className={styles.pane}>
          <div className={styles.paneHeader}>
            <span><Terminal size={14} style={{ display: 'inline', marginRight: 6 }} /> Console de Saída</span>
            <span style={{ color: '#4ade80' }}>Live Output</span>
          </div>
          <div className={styles.consoleOutput}>
            {output.length === 0 ? (
              <div style={{ color: '#64748b', fontStyle: 'italic', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px' }}>
                <Terminal size={32} style={{ opacity: 0.4 }} />
                <span>Clique em "Executar Código" acima para ver o resultado do console.</span>
              </div>
            ) : (
              output.map((out, idx) => (
                <div key={idx} className={out.type === 'error' ? styles.consoleError : styles.consoleLog}>
                  {out.text}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className={styles.presetsBar}>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Sparkles size={14} /> Exemplo de Snippets (Clique para testar):
        </span>
        {presets.map((item, index) => (
          <span
            key={index}
            className={styles.presetTag}
            onClick={() => setCode(item.codigo)}
          >
            + {item.nome}
          </span>
        ))}
      </div>
    </div>
  );
}
