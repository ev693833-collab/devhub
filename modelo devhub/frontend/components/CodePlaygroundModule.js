import React, { useState, useEffect } from "react";
import styles from "./CodePlaygroundModule.module.css";
import { Play, Trash2, Code2, Terminal, Sparkles } from "lucide-react";

export default function CodePlaygroundModule({ initialCode }) {
  const defaultCode = `// DevHub Web Playground 🚀
// Escreva e teste seu código JavaScript em tempo real!

function calcularProgressoEstudos(horasDedicadas) {
  const metaHoras = 40;
  const porcentagem = Math.min(100, Math.round((horasDedicadas / metaHoras) * 100));
  return \`Seu progresso esta em \${porcentagem}% da meta de \${metaHoras}h!\`;
}

console.log("Iniciando execução...");
console.log(calcularProgressoEstudos(28));
console.log("DevCoins estimados para ganhar: +50 XP");
`;

  const [code, setCode] = useState(initialCode || defaultCode);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const [output, setOutput] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const presets = [
    {
      nome: "Array & Map",
      codigo: `const alunos = ["Enzo", "Ana", "Carlos", "Beatriz"];\nconst formatados = alunos.map((aluno, index) => \`\${index + 1}º Lugar: \${aluno}\`);\nconsole.log(formatados.join("\\n"));`
    },
    {
      nome: "Fibonacci JS",
      codigo: `function fibonacci(n) {\n  let a = 0, b = 1;\n  const result = [a];\n  for(let i = 1; i < n; i++) {\n    result.push(b);\n    const temp = a + b;\n    a = b;\n    b = temp;\n  }\n  return result;\n}\nconsole.log("Sequência Fibonacci (8 termos):", fibonacci(8));`
    },
    {
      nome: "Promessa / Async",
      codigo: `console.log("Iniciando requisição simulada...");\nsetTimeout(() => {\n  console.log("✅ Dados recebidos do banco DevHub com sucesso!");\n}, 800);`
    }
  ];

  const runCode = () => {
    setIsExecuting(true);
    const logs = [];

    // Sandbox override do console.log e console.error
    const customConsole = {
      log: (...args) => {
        logs.push({ type: "log", text: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(" ") });
      },
      error: (...args) => {
        logs.push({ type: "error", text: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(" ") });
      },
      warn: (...args) => {
        logs.push({ type: "log", text: "⚠️ " + args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(" ") });
      }
    };

    try {
      // Execução em escopo seguro isolado
      const runFn = new Function("console", code);
      runFn(customConsole);
      if (logs.length === 0) {
        logs.push({ type: "log", text: "Código executado com sucesso (nenhum console.log emitido)." });
      }
    } catch (err) {
      logs.push({ type: "error", text: `❌ Erro de Execução: ${err.message}` });
    }

    setOutput(logs);
    setIsExecuting(false);
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
            <p className={styles.subtitle}>Teste funções, lógica e algoritmos em tempo real diretamente no browser</p>
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
              <div style={{ color: '#64748b', fontStyle: 'italic' }}>
                Clique em "Executar Código" acima para ver a saída de dados aqui no console.
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
          <Sparkles size={14} /> Snippets de Exemplo:
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
