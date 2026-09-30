import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Users, Code, Send, Mic, Video, Share2, Play, Copy, Check, MessageSquare, AlertCircle, Sparkles, RefreshCw, HelpCircle, CheckCircle2, Award, User, Terminal, Layers, Globe, ArrowRight, X } from "lucide-react";

export default function PairProgrammingModule({ user, isDark, colors }) {
  const [salaAtiva, setSalaAtiva] = useState(null);
  const [nomeNovaSala, setNomeNovaSala] = useState("");
  const [codigoSalaEntrar, setCodigoSalaEntrar] = useState("");
  const [desafioIndex, setDesafioIndex] = useState(0);
  const [modalSucessoConcluido, setModalSucessoConcluido] = useState(false);

  // Múltiplos Exercícios Diversificados sem resolução pronta + Validação automática + Exemplos explícitos
  const DESAFIOS_PAIR = [
    {
      id: 1,
      titulo: "Exercício 1: Formatador de Perfil & Tag de Dev 🏷️",
      tecnologia: "🟨 JavaScript (ES6)",
      dificuldade: "Fácil / Iniciante",
      instrucao: "Implemente a função 'formatarDev(nome, nivel, skillPrincipal)' que receba os 3 argumentos e retorne um objeto no formato: { nome, tag, ativo: true }.\n\nA propriedade 'tag' deve seguir estritamente o padrão: \"[DEV-LVL{nivel}] {nome} - {skillPrincipal}\".",
      exemplo: "formatarDev('Breno', 3, 'JavaScript') => { nome: 'Breno', tag: '[DEV-LVL3] Breno - JavaScript', ativo: true }",
      codigoInicial: `// 🎯 DESAFIO #1: Formatador de Perfil Dev (JavaScript)
const piloto = "${user?.nome || "Breno"}";
const copiloto = "Nicholas";

function formatarDev(nome, nivel, skillPrincipal) {
  // 💡 TODO: Escreva sua solução aqui!
  // Retorne um objeto com: { nome, tag, ativo: true }
  // A propriedade 'tag' deve ser: "[DEV-LVL" + nivel + "] " + nome + " - " + skillPrincipal
  
}

// Testando a execução (execute quando pronto):
const dev1 = formatarDev(piloto, 3, "JavaScript");
const dev2 = formatarDev(copiloto, 5, "React");

console.log("Dev 1:", dev1 ? dev1.tag : "Aguardando implementação...");
console.log("Dev 2:", dev2 ? dev2.tag : "Aguardando implementação...");`,
      testar: (customConsole, codeText) => {
        try {
          const runFn = new Function("console", codeText + "; return formatarDev;");
          const formatarDev = runFn(customConsole);
          if (typeof formatarDev !== "function") return false;
          const res1 = formatarDev("Breno", 3, "JavaScript");
          const res2 = formatarDev("Dev", 5, "React");
          return res1 && res1.tag === "[DEV-LVL3] Breno - JavaScript" && res1.nome === "Breno" && res1.ativo === true &&
                 res2 && res2.tag === "[DEV-LVL5] Dev - React";
        } catch (e) {
          return false;
        }
      }
    },
    {
      id: 2,
      titulo: "Exercício 2: Componente Card de Perfil Dev ⚛️",
      tecnologia: "⚛️ React & JSX",
      dificuldade: "Médio / Intermediário",
      instrucao: "Implemente a função 'PerfilDevCard(props)' que receba 'props' com { dev: { nome, nivel, stack } } e retorne um objeto contendo:\n- componente: \"PerfilDevCard\"\n- renderHTML: \"<div class=\\\"card\\\"><h2>{nome}</h2><p>Nível {nivel}</p></div>\"\n- skills: string das tecnologias unidas por vírgula e espaço (ex: \"React, Next.js, Node.js\").",
      exemplo: "PerfilDevCard({ dev: { nome: 'Breno', nivel: 4, stack: ['React', 'Node.js'] } }) => { componente: 'PerfilDevCard', renderHTML: '<div class=\"card\"><h2>Breno</h2><p>Nível 4</p></div>', skills: 'React, Node.js' }",
      codigoInicial: `// 🎯 DESAFIO #2: Componente React (JSX & Props)
const devExemplo = {
  nome: "${user?.nome || "Breno"}",
  nivel: 4,
  stack: ["React", "Next.js", "Node.js"]
};

function PerfilDevCard(props) {
  // 💡 TODO: Extraia 'dev' de props e monte o objeto de retorno esperado:
  // 1. renderHTML: \`<div class="card"><h2>\${dev.nome}</h2><p>Nível \${dev.nivel}</p></div>\`
  // 2. skills: dev.stack unidas por vírgula e espaço (ex: dev.stack.join(", "))
  
}

const resultadoRender = PerfilDevCard({ dev: devExemplo });
console.log("HTML Renderizado:", resultadoRender ? resultadoRender.renderHTML : "Aguardando implementação...");
console.log("Tecnologias:", resultadoRender ? resultadoRender.skills : "Aguardando implementação...");`,
      testar: (customConsole, codeText) => {
        try {
          const runFn = new Function("console", codeText + "; return PerfilDevCard;");
          const PerfilDevCard = runFn(customConsole);
          if (typeof PerfilDevCard !== "function") return false;
          const res = PerfilDevCard({ dev: { nome: "Breno", nivel: 4, stack: ["React", "Node.js"] } });
          return res && res.componente === "PerfilDevCard" && res.skills === "React, Node.js" && res.renderHTML.includes("<h2>Breno</h2>");
        } catch (e) {
          return false;
        }
      }
    },
    {
      id: 3,
      titulo: "Exercício 3: Validação com Tipagem de Dados 💙",
      tecnologia: "💙 TypeScript / Lógica",
      dificuldade: "Médio / Avançado",
      instrucao: "Implemente a função 'validarUsuarioTS(user)' que receba um objeto e verifique seus tipos:\n- Se typeof user.id !== 'number', retorne \"Erro: id deve ser number\"\n- Se typeof user.nome !== 'string', retorne \"Erro: nome deve ser string\"\n- Se typeof user.xp !== 'number', retorne \"Erro: xp deve ser number\"\n- Se todos forem válidos, retorne: \"✅ Aluno {nome} validado com sucesso com {xp} XP!\".",
      exemplo: "validarUsuarioTS({ id: 101, nome: 'Breno', xp: 1250 }) => '✅ Aluno Breno validado com sucesso com 1250 XP!'",
      codigoInicial: `// 🎯 DESAFIO #3: Validação de Tipos (TypeScript)
const aluno = { id: 101, nome: "${user?.nome || "Breno"}", xp: 1250, ativo: true };

function validarUsuarioTS(user) {
  // 💡 TODO: Implemente as validações comtypeof:
  // 1. Cheque se user.id é number
  // 2. Cheque se user.nome é string
  // 3. Cheque se user.xp é number
  // Retorne a mensagem de sucesso se todos os tipos forem válidos!
  
}

const resultadoValidacao = validarUsuarioTS(aluno);
console.log(resultadoValidacao || "Aguardando implementação...");`,
      testar: (customConsole, codeText) => {
        try {
          const runFn = new Function("console", codeText + "; return validarUsuarioTS;");
          const validarUsuarioTS = runFn(customConsole);
          if (typeof validarUsuarioTS !== "function") return false;
          const resOk = validarUsuarioTS({ id: 101, nome: "Breno", xp: 1250 });
          const resErr = validarUsuarioTS({ id: "101", nome: "Breno", xp: 1250 });
          return resOk && resOk.includes("✅") && resErr && resErr.includes("Erro");
        } catch (e) {
          return false;
        }
      }
    },
    {
      id: 4,
      titulo: "Exercício 4: Calculadora de Desempenho & Bônus de XP 🚀",
      tecnologia: "🟨 JavaScript (Lógica & Math)",
      dificuldade: "Fácil",
      instrucao: "Implemente a função 'calcularDesempenho(notas)' que receba um array de números (notas).\n\nCalcule a média arredondada com Math.round(). Se a média for >= 70, a dupla é aprovada (aprovado = true) e o bônus de XP é 150 (xpBonus = 150). Senão, aprovado = false e xpBonus = 50.\n\nRetorne o objeto: { media, aprovado, xpBonus }.",
      exemplo: "calcularDesempenho([85, 90, 78, 92]) => { media: 86, aprovado: true, xpBonus: 150 }",
      codigoInicial: `// 🎯 DESAFIO #4: Calculadora de Desempenho e XP
const pontuacoes = [85, 90, 78, 92];

function calcularDesempenho(notas) {
  // 💡 TODO: Calcule a média e retorne o objeto { media, aprovado, xpBonus }
  // 1. Calcule a soma das notas e a média arredondada com Math.round()
  // 2. Determine se aprovado (media >= 70)
  // 3. Define xpBonus = 150 se aprovado, senão 50
  
}

const res = calcularDesempenho(pontuacoes);
console.log(res ? \`Média da Dupla: \${res.media} | Aprovado: \${res.aprovado} | Bônus: +\${res.xpBonus} XP!\` : "Aguardando implementação...");`,
      testar: (customConsole, codeText) => {
        try {
          const runFn = new Function("console", codeText + "; return calcularDesempenho;");
          const calcularDesempenho = runFn(customConsole);
          if (typeof calcularDesempenho !== "function") return false;
          const res = calcularDesempenho([80, 90]);
          return res && res.media === 85 && res.aprovado === true && res.xpBonus === 150;
        } catch (e) {
          return false;
        }
      }
    },
    {
      id: 5,
      titulo: "Exercício 5: Elemento DOM & Estilos Dinâmicos CSS 🌐",
      tecnologia: "🌐 HTML5, CSS & DOM",
      dificuldade: "Médio",
      instrucao: "Implemente a função 'criarBotaoDOM(texto, corBg)' que receba o texto (string) e a cor de fundo (string) e retorne o objeto estilizado representando o elemento DOM:\n{ tag: \"button\", texto, estilos: { backgroundColor: corBg, color: \"#FFFFFF\", padding: \"10px 20px\", borderRadius: \"8px\", border: \"none\" } }.",
      exemplo: "criarBotaoDOM('🚀 Clique Aqui', '#10B981') => { tag: 'button', texto: '🚀 Clique Aqui', estilos: { backgroundColor: '#10B981', ... } }",
      codigoInicial: `// 🎯 DESAFIO #5: Manipulação de Elementos HTML/DOM
function criarBotaoDOM(texto, corBg) {
  // 💡 TODO: Retorne o objeto do elemento DOM estilizado:
  // { tag: "button", texto: texto, estilos: { backgroundColor: corBg, color: "#FFFFFF", padding: "10px 20px", borderRadius: "8px", border: "none" } }
  
}

const meuBotao = criarBotaoDOM("🚀 Clique Aqui", "#10B981");
console.log("Elemento DOM criado:", meuBotao ? \`<button style="background: \${meuBotao.estilos?.backgroundColor}">\${meuBotao.texto}</button>\` : "Aguardando implementação...");`,
      testar: (customConsole, codeText) => {
        try {
          const runFn = new Function("console", codeText + "; return criarBotaoDOM;");
          const criarBotaoDOM = runFn(customConsole);
          if (typeof criarBotaoDOM !== "function") return false;
          const res = criarBotaoDOM("Teste", "#10B981");
          return res && res.tag === "button" && res.texto === "Teste" && res.estilos && res.estilos.backgroundColor === "#10B981";
        } catch (e) {
          return false;
        }
      }
    }
  ];

  const desafioAtual = DESAFIOS_PAIR[desafioIndex];
  const [codigo, setCodigo] = useState(desafioAtual.codigoInicial);
  const [mensagensChat, setMensagensChat] = useState([
    { id: 1, autor: "DevHub Bot 🤖", texto: "Bem-vindos ao ambiente de Pair Programming! Conectados em tempo real." }
  ]);
  const [inputChat, setInputChat] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [modoVoz, setModoVoz] = useState(false);
  const [modoTela, setModoTela] = useState(false);
  const [notificacaoMidia, setNotificacaoMidia] = useState("");
  const [resultadoConsole, setResultadoConsole] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const socketRef = useRef(null);

  // Conectar ao Socket.io para sincronização simultânea de Pair Programming
  useEffect(() => {
    if (!salaAtiva || salaAtiva.modo !== "dupla") return;

    const socket = io(apiUrl, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.emit("join_room", salaAtiva.codigoSala);

    socket.on("pair_code_change", (data) => {
      if (data && data.codigo !== undefined) {
        setCodigo(data.codigo);
      }
    });

    socket.on("pair_chat_message", (msg) => {
      if (msg) {
        setMensagensChat(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    });

    socket.on("pair_challenge_change", (data) => {
      if (data && data.index !== undefined) {
        setDesafioIndex(data.index);
        if (DESAFIOS_PAIR[data.index]) {
          setCodigo(DESAFIOS_PAIR[data.index].codigoInicial);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [salaAtiva]);

  const handleCodigoChange = (e) => {
    const novoCodigo = e.target.value;
    setCodigo(novoCodigo);
    if (salaAtiva && salaAtiva.modo === "dupla" && socketRef.current) {
      socketRef.current.emit("pair_code_change", {
        sala: salaAtiva.codigoSala,
        codigo: novoCodigo
      });
    }
  };

  const handleMudarDesafio = () => {
    const proximoIndex = (desafioIndex + 1) % DESAFIOS_PAIR.length;
    setDesafioIndex(proximoIndex);
    setCodigo(DESAFIOS_PAIR[proximoIndex].codigoInicial);
    setResultadoConsole("");
    setNotificacaoMidia(`🔄 Novo desafio carregado [${DESAFIOS_PAIR[proximoIndex].tecnologia}]: ${DESAFIOS_PAIR[proximoIndex].titulo}`);
    setTimeout(() => setNotificacaoMidia(""), 4000);

    if (salaAtiva && salaAtiva.modo === "dupla" && socketRef.current) {
      socketRef.current.emit("pair_challenge_change", {
        sala: salaAtiva.codigoSala,
        index: proximoIndex
      });
    }
  };

  // Execução Real do Código em Tempo Real com Captura de Console & Validação Automática
  const handleExecutarCodigo = () => {
    try {
      let logs = [];
      const customConsole = {
        log: (...args) => logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
        error: (...args) => logs.push("Erro: " + args.join(" "))
      };

      // Executa o código JavaScript do editor em tempo real
      const runFn = new Function("console", codigo);
      runFn(customConsole);

      const logText = logs.join("\n");

      // Validar se o código passou no teste do desafio atual
      if (desafioAtual && desafioAtual.testar) {
        const passouNoTeste = desafioAtual.testar(customConsole, codigo);
        if (passouNoTeste) {
          setResultadoConsole((logText ? logText + "\n\n" : "") + "🎉 DESAFIO RESOLVIDO E TESTADO COM SUCESSO! 🏆 (+200 XP)");
          setModalSucessoConcluido(true);
          return;
        }
      }

      setResultadoConsole(logText || "⚡ Código executado sem saídas do console. Implemente a função exigida e clique em Executar!");
    } catch (err) {
      setResultadoConsole(`❌ Erro na execução: ${err.message}`);
    }
  };

  // Iniciar Treino Solo (Individual)
  const handleIniciarSolo = () => {
    setSalaAtiva({
      modo: "solo",
      codigoSala: "SOLO-INDIVIDUAL",
      nomeSala: `Treino Solo — ${user?.nome || "Dev"}`
    });
  };

  // Criar Sala de Pair em Dupla
  const handleCriarSala = async () => {
    const codigoUnico = "PAIR-" + Math.floor(100000 + Math.random() * 900000);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/gamificacao/pair-programming/sala`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nomeSala: nomeNovaSala || "Pair Session DevHub", codigoSala: codigoUnico })
      });
      if (res.ok) {
        const data = await res.json();
        setSalaAtiva({ ...data, modo: "dupla", codigoSala: data.codigoSala || codigoUnico });
      } else {
        setSalaAtiva({ modo: "dupla", codigoSala: codigoUnico, nomeSala: nomeNovaSala || "Pair Session DevHub" });
      }
    } catch (e) {
      setSalaAtiva({ modo: "dupla", codigoSala: codigoUnico, nomeSala: nomeNovaSala || "Pair Session DevHub" });
    }
  };

  const handleToggleVoz = async () => {
    if (!modoVoz) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setModoVoz(true);
        setNotificacaoMidia("🎤 Microfone ativado! Transmitindo áudio.");
      } catch (err) {
        setNotificacaoMidia("⚠️ Permissão de microfone negada no navegador.");
      }
    } else {
      setModoVoz(false);
      setNotificacaoMidia("🎙️ Microfone mutado.");
    }
    setTimeout(() => setNotificacaoMidia(""), 4000);
  };

  const handleToggleTela = async () => {
    if (!modoTela) {
      try {
        await navigator.mediaDevices.getDisplayMedia({ video: true });
        setModoTela(true);
        setNotificacaoMidia("🖥️ Compartilhamento de tela iniciado!");
      } catch (err) {
        setNotificacaoMidia("⚠️ Compartilhamento de tela cancelado.");
      }
    } else {
      setModoTela(false);
      setNotificacaoMidia("🖥️ Compartilhamento de tela encerrado.");
    }
    setTimeout(() => setNotificacaoMidia(""), 4000);
  };

  const handleEnviarMensagem = () => {
    if (!inputChat.trim()) return;
    const novaMensagem = { id: Date.now(), autor: user?.nome || "Eu", texto: inputChat.trim() };
    if (salaAtiva && salaAtiva.modo === "dupla" && socketRef.current) {
      socketRef.current.emit("pair_chat_message", {
        sala: salaAtiva.codigoSala,
        mensagem: novaMensagem
      });
    } else {
      setMensagensChat(prev => [...prev, novaMensagem]);
    }
    setInputChat("");
  };

  const copiarCodigoSala = () => {
    if (!salaAtiva) return;
    navigator.clipboard.writeText(salaAtiva.codigoSala);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  // TELA INICIAL: Escolher entre Treino Solo ou Sala em Dupla
  if (!salaAtiva) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "900", display: "flex", alignItems: "center", gap: "10px", margin: "0 0 6px 0", color: isDark ? "#F1F5F9" : "#0F172A" }}>
            🤝 Programação Colaborativa & Treino (Pair Programming)
          </h2>
          <p style={{ color: isDark ? "#94A3B8" : "#64748B", fontSize: "14px", margin: 0 }}>
            Pratique sozinho no modo <strong>Solo</strong> ou crie salas para programar <strong>em Dupla</strong> com colegas em tempo real!
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          
          {/* Card Modo Solo (Praticar Sozinho) */}
          <div style={{
            backgroundColor: isDark ? "#1E293B" : "#FFF", borderRadius: "20px", padding: "28px",
            border: `2px solid ${isDark ? "rgba(16,185,129,0.4)" : "#CBD5E1"}`, display: "flex", flexDirection: "column", justifyContent: "space-between",
            boxShadow: "0 4px 18px rgba(0,0,0,0.08)"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(16,185,129,0.18)", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={22} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "900", margin: 0, color: isDark ? "#F1F5F9" : "#0F172A" }}>
                  👤 Modo Solo (Praticar Sozinho)
                </h3>
              </div>
              <p style={{ fontSize: "13.5px", color: isDark ? "#CBD5E1" : "#475569", marginBottom: "20px", lineHeight: "1.5" }}>
                Resolva os exercícios no seu próprio ritmo, sem precisar convidar ninguém ou esperar um parceiro.
              </p>
            </div>
            <button
              onClick={handleIniciarSolo}
              style={{
                width: "100%", padding: "13px", borderRadius: "12px", border: "none", fontWeight: "800", fontSize: "14px", cursor: "pointer",
                background: "linear-gradient(135deg, #10B981, #059669)", color: "#FFF", boxShadow: "0 4px 14px rgba(16,185,129,0.3)"
              }}
            >
              ⚡ Entrar no Modo Solo
            </button>
          </div>

          {/* Card Criar Sala em Dupla */}
          <div style={{
            backgroundColor: isDark ? "#1E293B" : "#FFF", borderRadius: "20px", padding: "28px",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0"}`, display: "flex", flexDirection: "column", justifyContent: "space-between",
            boxShadow: "0 4px 18px rgba(0,0,0,0.08)"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(59,130,246,0.18)", color: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users size={22} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "900", margin: 0, color: isDark ? "#F1F5F9" : "#0F172A" }}>
                  👥 Criar Sala em Dupla
                </h3>
              </div>
              <p style={{ fontSize: "13.5px", color: isDark ? "#CBD5E1" : "#475569", marginBottom: "16px", lineHeight: "1.5" }}>
                Gere um código exclusivo para convidar outro aluno e codificarem juntos no mesmo ambiente.
              </p>
              <input
                type="text"
                placeholder="Nome da sala (ex: Pair Session Nicholas & Enzo)"
                value={nomeNovaSala}
                onChange={e => setNomeNovaSala(e.target.value)}
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: "12px", marginBottom: "16px",
                  backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#CBD5E1"}`,
                  color: isDark ? "#FFF" : "#0F172A", fontSize: "13.5px", outline: "none"
                }}
              />
            </div>
            <button
              onClick={handleCriarSala}
              style={{
                width: "100%", padding: "13px", borderRadius: "12px", border: "none", fontWeight: "800", fontSize: "14px", cursor: "pointer",
                background: "linear-gradient(135deg, #3B82F6, #2563EB)", color: "#FFF", boxShadow: "0 4px 14px rgba(59,130,246,0.3)"
              }}
            >
              🚀 Iniciar Sala de Pair
            </button>
          </div>

          {/* Card Entrar com Código */}
          <div style={{
            backgroundColor: isDark ? "#1E293B" : "#FFF", borderRadius: "20px", padding: "28px",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0"}`, display: "flex", flexDirection: "column", justifyContent: "space-between",
            boxShadow: "0 4px 18px rgba(0,0,0,0.08)"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(168,85,247,0.18)", color: "#A855F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Code size={22} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "900", margin: 0, color: isDark ? "#F1F5F9" : "#0F172A" }}>
                  🔑 Entrar com Código
                </h3>
              </div>
              <p style={{ fontSize: "13.5px", color: isDark ? "#CBD5E1" : "#475569", marginBottom: "16px", lineHeight: "1.5" }}>
                Digite o código da sala fornecido por um colega para entrar na sessão existente.
              </p>
              <input
                type="text"
                placeholder="Código da sala (ex: PAIR-789X22)"
                value={codigoSalaEntrar}
                onChange={e => setCodigoSalaEntrar(e.target.value.toUpperCase())}
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: "12px", marginBottom: "16px",
                  backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#CBD5E1"}`,
                  color: isDark ? "#FFF" : "#0F172A", fontSize: "13.5px", outline: "none", textTransform: "uppercase"
                }}
              />
            </div>
            <button
              onClick={() => setSalaAtiva({ modo: "dupla", codigoSala: codigoSalaEntrar || "PAIR-789X22", nomeSala: "Sala Compartilhada DevHub" })}
              style={{
                width: "100%", padding: "13px", borderRadius: "12px", border: "none", fontWeight: "800", fontSize: "14px", cursor: "pointer",
                background: "linear-gradient(135deg, #A855F7, #9333EA)", color: "#FFF", boxShadow: "0 4px 14px rgba(168,85,247,0.3)"
              }}
            >
              🔗 Conectar à Sala
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Banner do Desafio + Tecnologia Especificada + Botão Trocar Exercício */}
      <div style={{
        padding: "20px 24px", borderRadius: "20px",
        background: "linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(59,130,246,0.12) 100%)",
        border: "1.5px solid rgba(16,185,129,0.35)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", flex: 1, minWidth: "280px" }}>
          <div style={{ padding: "12px", borderRadius: "14px", background: "rgba(16,185,129,0.2)", color: "#10B981" }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", color: "#10B981", letterSpacing: "0.5px" }}>
                🤝 Pair Programming — Exercício #{desafioIndex + 1} de {DESAFIOS_PAIR.length}
              </span>

              <span style={{
                background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.4)",
                borderRadius: "10px", padding: "3px 10px", fontSize: "11px", fontWeight: "900", color: "#A855F7"
              }}>
                Tecnologia: {desafioAtual.tecnologia}
              </span>

              <span style={{ background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.4)", borderRadius: "10px", padding: "3px 10px", fontSize: "11px", fontWeight: "800", color: "#3B82F6" }}>
                Nível: {desafioAtual.dificuldade}
              </span>
            </div>

            <h4 style={{ fontSize: "17px", fontWeight: "900", margin: "4px 0 6px 0", color: isDark ? "#F1F5F9" : "#0F172A" }}>
              {desafioAtual.titulo}
            </h4>
            <p style={{ fontSize: "13.5px", color: isDark ? "#CBD5E1" : "#475569", margin: "0 0 10px 0", lineHeight: "1.5", whiteSpace: "pre-line" }}>
              {desafioAtual.instrucao}
            </p>

            {desafioAtual.exemplo && (
              <div style={{
                backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.8)",
                padding: "8px 12px", borderRadius: "10px", border: "1px solid rgba(16,185,129,0.3)",
                fontSize: "12px", fontFamily: "monospace", color: "#10B981"
              }}>
                💡 <strong>Exemplo Esperado:</strong> {desafioAtual.exemplo}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleMudarDesafio}
          style={{
            padding: "11px 18px", borderRadius: "12px", border: "1px solid rgba(16,185,129,0.4)",
            background: "linear-gradient(135deg, #10B981, #059669)", color: "#FFF", fontWeight: "800", fontSize: "13px",
            cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 14px rgba(16,185,129,0.3)"
          }}
        >
          <RefreshCw size={16} /> Próximo Desafio
        </button>
      </div>

      {notificacaoMidia && (
        <div style={{
          padding: "12px 18px", borderRadius: "12px", backgroundColor: "rgba(16,185,129,0.15)",
          border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", fontWeight: "700", fontSize: "13px",
          display: "flex", alignItems: "center", gap: "8px"
        }}>
          <Sparkles size={16} /> {notificacaoMidia}
        </div>
      )}

      {/* Bar Topo da Sala */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px",
        backgroundColor: isDark ? "#1E293B" : "#FFF", padding: "16px 24px", borderRadius: "20px",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0"}`
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            fontSize: "11px", fontWeight: "900", padding: "4px 12px", borderRadius: "20px",
            background: salaAtiva.modo === "solo" ? "linear-gradient(135deg, #3B82F6, #2563EB)" : "#10B981", color: "#FFF"
          }}>
            {salaAtiva.modo === "solo" ? "👤 MODO SOLO ATIVO" : "👥 SALA EM DUPLA ATIVA"}
          </span>
          <h3 style={{ fontSize: "18px", fontWeight: "800", margin: 0, color: isDark ? "#F1F5F9" : "#0F172A" }}>{salaAtiva.nomeSala}</h3>
        </div>

        {/* Ferramentas de chamada e compartilhamento */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {salaAtiva.modo === "dupla" && (
            <>
              <button
                onClick={handleToggleVoz}
                style={{
                  padding: "8px 14px", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: "800", cursor: "pointer",
                  backgroundColor: modoVoz ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)", color: modoVoz ? "#EF4444" : (isDark ? "#FFF" : "#0F172A"),
                  display: "flex", alignItems: "center", gap: "6px"
                }}
              >
                <Mic size={16} /> {modoVoz ? "Voz Ativa (Mutar)" : "Chamada de Voz"}
              </button>

              <button
                onClick={handleToggleTela}
                style={{
                  padding: "8px 14px", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: "800", cursor: "pointer",
                  backgroundColor: modoTela ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.08)", color: modoTela ? "#3B82F6" : (isDark ? "#FFF" : "#0F172A"),
                  display: "flex", alignItems: "center", gap: "6px"
                }}
              >
                <Share2 size={16} /> {modoTela ? "Compartilhando Tela" : "Compartilhar Tela"}
              </button>

              <button
                onClick={copiarCodigoSala}
                style={{
                  padding: "8px 14px", borderRadius: "10px", border: "1px solid rgba(16,185,129,0.4)",
                  backgroundColor: "rgba(16,185,129,0.15)", color: "#10B981", fontSize: "12px", fontWeight: "800", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "6px"
                }}
              >
                {copiado ? <Check size={16} /> : <Copy size={16} />} Código: {salaAtiva.codigoSala}
              </button>
            </>
          )}

          <button
            onClick={() => setSalaAtiva(null)}
            style={{ padding: "8px 14px", borderRadius: "10px", border: "none", backgroundColor: "rgba(239,68,68,0.15)", color: "#EF4444", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}
          >
            Sair da Sala
          </button>
        </div>
      </div>

      {/* Grid Principal: Editor de Código + Console Integrado + Chat */}
      <div style={{ display: "grid", gridTemplateColumns: salaAtiva.modo === "solo" ? "1fr" : "2fr 1fr", gap: "20px" }}>
        
        {/* Lado Esquerdo: Editor + Console Integrado */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Editor de Código */}
          <div style={{
            backgroundColor: "#0F172A", border: "1.5px solid rgba(16,185,129,0.4)", borderRadius: "20px", padding: "20px",
            display: "flex", flexDirection: "column", gap: "12px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#94A3B8", fontSize: "13px", fontWeight: "700" }}>
              <span>👤 PILOTO: <strong>{user?.nome || "Breno"} (Você)</strong></span>
              {salaAtiva.modo === "dupla" ? (
                <span>👥 CO-PILOTO: <strong>Nicholas (Online 🟢)</strong></span>
              ) : (
                <span style={{ color: "#3B82F6" }}>⚡ MODOS SOLO: Treinando Individualmente</span>
              )}
            </div>

            <textarea
              value={codigo}
              onChange={handleCodigoChange}
              rows={14}
              spellCheck={false}
              style={{
                width: "100%", backgroundColor: "transparent", border: "none", color: "#34D399", fontFamily: "monospace",
                fontSize: "14px", lineHeight: "1.6", outline: "none", resize: "none"
              }}
            />

            {/* BOTÃO PRINCIPAL DE EXECUÇÃO */}
            <button
              onClick={handleExecutarCodigo}
              style={{
                alignSelf: "flex-end", padding: "12px 24px", borderRadius: "12px",
                background: "linear-gradient(135deg, #10B981, #059669)",
                color: "#FFF", border: "none", fontWeight: "900", fontSize: "14px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 16px rgba(16,185,129,0.35)"
              }}
            >
              <Play size={18} /> ▶️ Executar & Testar Código
            </button>
          </div>

          {/* PAINEL DE CONSOLE INTEGRADO PERMANENTE */}
          <div style={{
            backgroundColor: "#020617", borderRadius: "18px", padding: "18px 22px",
            border: `1.5px solid ${resultadoConsole.includes("❌") ? "rgba(239,68,68,0.4)" : (resultadoConsole.includes("🎉") ? "rgba(16,185,129,0.6)" : "rgba(255,255,255,0.1)")}`
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: "900", color: "#CBD5E1", display: "flex", alignItems: "center", gap: "8px" }}>
                <Terminal size={16} color="#10B981" /> 🖥️ Console de Saída (Execução do Código & console.log)
              </span>
              <span style={{
                fontSize: "11px", fontWeight: "800", padding: "2px 8px", borderRadius: "6px",
                background: resultadoConsole.includes("❌") ? "rgba(239,68,68,0.2)" : (resultadoConsole.includes("🎉") ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.05)"),
                color: resultadoConsole.includes("❌") ? "#F87171" : (resultadoConsole.includes("🎉") ? "#34D399" : "#64748B")
              }}>
                {resultadoConsole.includes("❌") ? "❌ Erro no Console" : (resultadoConsole.includes("🎉") ? "🏆 Desafio Concluído" : (resultadoConsole ? "🟢 Código Executado" : "⚪ Aguardando Execução"))}
              </span>
            </div>

            {resultadoConsole ? (
              <pre style={{
                margin: 0, color: resultadoConsole.includes("❌") ? "#F87171" : "#34D399",
                fontFamily: "monospace", fontSize: "13.5px", lineHeight: "1.6", whiteSpace: "pre-wrap"
              }}>
                {resultadoConsole}
              </pre>
            ) : (
              <div style={{ color: "#64748B", fontSize: "13px", fontStyle: "italic" }}>
                💡 Escreva sua função acima e clique em <strong>"▶️ Executar & Testar Código"</strong> para validar seu desafio!
              </div>
            )}
          </div>

        </div>

        {/* Lado Direito: Chat da Dupla (Apenas no Modo Dupla) */}
        {salaAtiva.modo === "dupla" && (
          <div style={{
            backgroundColor: isDark ? "#1E293B" : "#FFF", borderRadius: "20px", padding: "20px",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0"}`,
            display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "500px"
          }}>
            <h4 style={{ fontSize: "15px", fontWeight: "800", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: "6px", color: isDark ? "#F1F5F9" : "#0F172A" }}>
              <MessageSquare size={18} /> Chat da Dupla
            </h4>

            {/* Mensagens */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
              {mensagensChat.map(m => (
                <div key={m.id} style={{ backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9", padding: "10px 12px", borderRadius: "12px" }}>
                  <strong style={{ fontSize: "12px", color: "#10B981", display: "block" }}>{m.autor}</strong>
                  <span style={{ fontSize: "13px", color: isDark ? "#CBD5E1" : "#334155" }}>{m.texto}</span>
                </div>
              ))}
            </div>

            {/* Input Chat */}
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Digite uma mensagem..."
                value={inputChat}
                onChange={e => setInputChat(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleEnviarMensagem(); }}
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: "10px", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#CBD5E1"}`,
                  backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9", color: isDark ? "#FFF" : "#0F172A", outline: "none", fontSize: "13px"
                }}
              />
              <button
                onClick={handleEnviarMensagem}
                style={{ padding: "10px 14px", borderRadius: "10px", border: "none", backgroundColor: "#10B981", color: "#FFF", cursor: "pointer" }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* MODAL DE SUCESSO DO DESAFIO */}
      {modalSucessoConcluido && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.78)",
          backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: "20px"
        }}>
          <div style={{
            backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
            border: "2px solid #10B981",
            borderRadius: "24px",
            padding: "32px 28px",
            maxWidth: "480px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 20px 50px rgba(16,185,129,0.35)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              backgroundColor: "rgba(16,185,129,0.15)",
              border: "2px solid #10B981",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "36px"
            }}>
              🎉
            </div>

            <div>
              <h3 style={{ fontSize: "22px", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A", margin: "0 0 6px 0" }}>
                Desafio Concluído! 🏆
              </h3>
              <p style={{ fontSize: "14px", color: isDark ? "#94A3B8" : "#64748B", margin: 0, lineHeight: "1.5" }}>
                Parabéns! Você resolveu com sucesso o <strong>{desafioAtual.titulo}</strong>!
              </p>
            </div>

            <div style={{
              width: "100%", padding: "14px", borderRadius: "14px",
              backgroundColor: isDark ? "rgba(16,185,129,0.1)" : "#ECFDF5",
              border: "1px solid rgba(16,185,129,0.3)",
              fontSize: "13px", color: "#10B981", fontWeight: "700"
            }}>
              ✨ +200 XP concedidos por esta conquista!
            </div>

            <p style={{ fontSize: "13px", color: isDark ? "#CBD5E1" : "#475569", margin: 0 }}>
              Deseja avançar para o próximo desafio ou sair da sala?
            </p>

            <div style={{ display: "flex", gap: "12px", width: "100%", marginTop: "8px" }}>
              <button
                onClick={() => {
                  setModalSucessoConcluido(false);
                  handleMudarDesafio();
                }}
                style={{
                  flex: 1, padding: "14px", borderRadius: "14px", border: "none",
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  color: "#FFF", fontWeight: "800", fontSize: "14px", cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(16,185,129,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                }}
              >
                <span>🚀 Continuar Próximo Desafio</span>
              </button>

              <button
                onClick={() => {
                  setModalSucessoConcluido(false);
                  setSalaAtiva(null);
                }}
                style={{
                  padding: "14px 20px", borderRadius: "14px",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1"}`,
                  backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
                  color: isDark ? "#FFF" : "#0F172A", fontWeight: "700", fontSize: "14px", cursor: "pointer"
                }}
              >
                🚪 Sair da Sala
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
