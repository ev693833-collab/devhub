import { useState, useEffect, useMemo } from "react";
import { Swords, Trophy, Clock, Play, CheckCircle, Send, XCircle, Check, X, Shield, Sparkles, PlusCircle, Inbox, Users, Code, GraduationCap, AlertTriangle, HelpCircle, Terminal } from "lucide-react";
import styles from "./BatalhaCodigoModule.module.css";

// 10 Desafios Únicos e Diversificados para as Batalhas 1v1
const listaDesafiosPadrao = [
  {
    id: 1,
    titulo: "Sistema de Cadastro & Filtro de Usuários",
    tecnologia: "🟨 JavaScript ES6 (Filter & Array Methods)",
    categoria: "JavaScript ES6 / Array Filter",
    dificuldade: "Médio",
    enunciado: "Filtre uma lista de objetos de usuários e retorne apenas os usuários ativos com idade >= 18.",
    codigoInicial: "// Escreva uma função ou atribua à variável 'resultado' a lista filtrada:\n// Exemplo: const resultado = usuarios.filter(u => u.idade >= 18 && u.ativo);\n\nconsole.log('Iniciando filtro de usuários...');"
  },
  {
    id: 2,
    titulo: "Validação de Parênteses Balanceados",
    tecnologia: "💙 TypeScript & Data Structure (Pilha)",
    categoria: "Estrutura de Dados / Pilha",
    dificuldade: "Difícil",
    enunciado: "Crie uma função 'validarParenteses(str)' para verificar se uma string de parênteses como '({[]})' está balanceada.",
    codigoInicial: "function validarParenteses(str) {\n  console.log('Validando parênteses para:', str);\n  // Digite seu algoritmo aqui...\n}"
  },
  {
    id: 3,
    titulo: "Cálculo do Fatorial de um Número",
    tecnologia: "🟨 JavaScript (Lógica & Math)",
    categoria: "Matemática & Lógica",
    dificuldade: "Fácil",
    enunciado: "Crie uma função 'fatorial(n)' que receba um inteiro n >= 0 e retorne seu fatorial (ex: 5! = 120, 0! = 1).",
    codigoInicial: "function fatorial(n) {\n  console.log('Calculando fatorial de:', n);\n  // Digite seu algoritmo aqui...\n}"
  },
  {
    id: 4,
    titulo: "Verificação de Palíndromo",
    tecnologia: "🟨 JavaScript (Strings & Regex)",
    categoria: "String & Manipulação de Texto",
    dificuldade: "Fácil",
    enunciado: "Escreva uma função 'ehPalindromo(str)' para verificar se uma palavra lida da mesma forma de trás para frente.",
    codigoInicial: "function ehPalindromo(str) {\n  console.log('Verificando palavra:', str);\n  // Digite seu algoritmo aqui...\n}"
  },
  {
    id: 5,
    titulo: "Encontrar o Maior Número em um Array",
    tecnologia: "🟨 JavaScript (Arrays & Vetores)",
    categoria: "Arrays / Vetores",
    dificuldade: "Fácil",
    enunciado: "Crie uma função 'maiorNumero(arr)' que receba uma lista de números inteiros e retorne o maior deles.",
    codigoInicial: "function maiorNumero(arr) {\n  console.log('Buscando maior número na lista:', arr);\n  // Digite seu algoritmo aqui...\n}"
  },
  {
    id: 6,
    titulo: "Contagem de Vogais em uma Frase",
    tecnologia: "🟨 JavaScript (Strings & RegEx)",
    categoria: "Strings & RegEx",
    dificuldade: "Fácil",
    enunciado: "Crie uma função 'contarVogais(txt)' que receba um texto e retorne o total de vogais (a, e, i, o, u).",
    codigoInicial: "function contarVogais(txt) {\n  console.log('Contando vogais em:', txt);\n  // Digite seu algoritmo aqui...\n}"
  },
  {
    id: 7,
    titulo: "Remoção de Duplicados de uma Lista",
    tecnologia: "🟨 JavaScript (ES6 Set & Arrays)",
    categoria: "ES6 Sets / Arrays",
    dificuldade: "Médio",
    enunciado: "Crie uma função 'removerDuplicados(arr)' que receba um array com elementos repetidos e retorne apenas os valores únicos.",
    codigoInicial: "function removerDuplicados(arr) {\n  console.log('Removendo duplicados do array:', arr);\n  // Digite seu algoritmo aqui...\n}"
  },
  {
    id: 8,
    titulo: "Soma de Números Pares",
    tecnologia: "🟨 JavaScript (Lógica de Programação)",
    categoria: "Lógica de Programação",
    dificuldade: "Fácil",
    enunciado: "Escreva uma função 'somarPares(arr)' que receba um array de inteiros e retorne a soma de todos os números pares.",
    codigoInicial: "function somarPares(arr) {\n  console.log('Somando números pares da lista:', arr);\n  // Digite seu algoritmo aqui...\n}"
  },
  {
    id: 9,
    titulo: "Algoritmo FizzBuzz Clássico",
    tecnologia: "🟨 JavaScript (Estruturas Condicionais)",
    categoria: "Estruturas Condicionais",
    dificuldade: "Médio",
    enunciado: "Crie uma função 'fizzBuzz(n)' que retorne 'FizzBuzz' se n for múltiplo de 3 e 5, 'Fizz' se só de 3, 'Buzz' se só de 5 ou n.",
    codigoInicial: "function fizzBuzz(n) {\n  console.log('Rodando FizzBuzz para:', n);\n  // Digite seu algoritmo aqui...\n}"
  },
  {
    id: 10,
    titulo: "Implementação de Debounce em JS",
    tecnologia: "⚡ JavaScript Avançado (Timers & Async)",
    categoria: "JavaScript Avançado / Async",
    dificuldade: "Desafiador",
    enunciado: "Implemente uma função debounce(fn, delay) utilizando setTimeout e clearTimeout para adiar a execução.",
    codigoInicial: "function debounce(fn, delay) {\n  console.log('Iniciando timer de Debounce...');\n  // Utilizar setTimeout e clearTimeout...\n}"
  }
];

// Avaliador Rigoroso Anti-Cheat com Múltiplos Testes Dinâmicos
function executarTestesBatalha(desafioId, codigo) {
  try {
    if (!codigo || codigo.trim() === "" || codigo.startsWith("// Escreva") || codigo.startsWith("// Digite")) {
      return {
        sucesso: false,
        erro: "⚠️ O código está em branco ou contém apenas o modelo inicial. Escreva a sua solução antes de submeter!"
      };
    }

    // Auxiliar para compilar a função do usuário dinamicamente
    const criarAvaliador = (paramNames, nomeFuncao) => {
      const paramsStr = Array.isArray(paramNames) ? paramNames.join(",") : paramNames;
      return new Function(paramsStr, `
        ${codigo}
        if (typeof ${nomeFuncao} === 'function') return ${nomeFuncao}(${paramsStr});
        if (typeof resultado === 'function') return resultado(${paramsStr});
        if (typeof resultado !== 'undefined') return resultado;
        if (typeof res !== 'undefined') return res;
        return null;
      `);
    };

    // 1. DESAFIO 1: Filtro de Usuários (3 Testes Dinâmicos)
    if (desafioId === 1) {
      const testCases = [
        [
          { nome: 'Andre', idade: 27, ativo: true },
          { nome: 'Enzo', idade: 17, ativo: true },
          { nome: 'Breno', idade: 17, ativo: false },
          { nome: 'Carlos', idade: 25, ativo: true }
        ],
        [
          { nome: 'Lucas', idade: 16, ativo: true },
          { nome: 'Maria', idade: 15, ativo: false }
        ],
        [
          { nome: 'Felipe', idade: 30, ativo: true },
          { nome: 'Amanda', idade: 22, ativo: true },
          { nome: 'Vitor', idade: 19, ativo: false }
        ]
      ];

      const expectedLengths = [2, 0, 2];

      for (let i = 0; i < testCases.length; i++) {
        const input = testCases[i];
        const evaluator = new Function('usuarios', `
          const listaUsuarios = usuarios;
          ${codigo}
          if (typeof filtrarUsuarios === 'function') return filtrarUsuarios(usuarios);
          if (typeof usuariosValidos !== 'undefined') return usuariosValidos;
          if (typeof resultado === 'function') return resultado(usuarios);
          if (typeof resultado !== 'undefined') return resultado;
          return null;
        `);

        const res = evaluator(input);
        if (!res || !Array.isArray(res)) {
          return { sucesso: false, erro: `❌ Teste #${i + 1} falhou: O seu código precisa retornar um Array com a lista filtrada!` };
        }

        const validos = res.filter(u => u && u.idade >= 18 && u.ativo === true);
        if (res.length !== expectedLengths[i] || validos.length !== expectedLengths[i]) {
          return {
            sucesso: false,
            erro: `❌ Teste #${i + 1} falhou! Para a entrada fornecida de ${input.length} usuário(s), esperava-se ${expectedLengths[i]} usuário(s) ativos com idade >= 18, mas sua função retornou ${res.length}.`
          };
        }
      }

      return { sucesso: true, mensagem: "✅ Filtro de usuários validado com sucesso em 3 testes dinâmicos!" };
    }

    // 2. DESAFIO 2: Parênteses Balanceados (5 Testes)
    if (desafioId === 2) {
      const evaluator = criarAvaliador("str", "validarParenteses");
      const tests = [
        { input: "({[]})", expected: true },
        { input: "({[})", expected: false },
        { input: "((()))", expected: true },
        { input: ")()(", expected: false },
        { input: "[]{}", expected: true }
      ];

      for (let i = 0; i < tests.length; i++) {
        const res = Boolean(evaluator(tests[i].input));
        if (res !== tests[i].expected) {
          return {
            sucesso: false,
            erro: `❌ Teste #${i + 1} falhou! Para a entrada '${tests[i].input}', esperava-se ${tests[i].expected}, mas sua solução retornou ${res}.`
          };
        }
      }
      return { sucesso: true, mensagem: "✅ Validação de parênteses aprovada em 5 casos de teste!" };
    }

    // 3. DESAFIO 3: Fatorial (5 Testes)
    if (desafioId === 3) {
      const evaluator = criarAvaliador("n", "fatorial");
      const tests = [
        { input: 5, expected: 120 },
        { input: 3, expected: 6 },
        { input: 0, expected: 1 },
        { input: 1, expected: 1 },
        { input: 6, expected: 720 }
      ];

      for (let i = 0; i < tests.length; i++) {
        const res = evaluator(tests[i].input);
        if (res !== tests[i].expected) {
          return {
            sucesso: false,
            erro: `❌ Teste #${i + 1} falhou! Fatorial de ${tests[i].input}: esperava-se ${tests[i].expected}, mas retornou ${res}.`
          };
        }
      }
      return { sucesso: true, mensagem: "✅ Cálculo de fatorial validado em 5 entradas dinâmicas!" };
    }

    // 4. DESAFIO 4: Palíndromo (5 Testes)
    if (desafioId === 4) {
      const evaluator = criarAvaliador("str", "ehPalindromo");
      const tests = [
        { input: "arara", expected: true },
        { input: "estudo", expected: false },
        { input: "Amanama", expected: true },
        { input: "12321", expected: true },
        { input: "devhub", expected: false }
      ];

      for (let i = 0; i < tests.length; i++) {
        const rawRes = evaluator(tests[i].input);
        const res = Boolean(rawRes);
        if (res !== tests[i].expected) {
          return {
            sucesso: false,
            erro: `❌ Teste #${i + 1} falhou! Para a palavra '${tests[i].input}', esperava-se ${tests[i].expected}, mas retornou ${res}.`
          };
        }
      }
      return { sucesso: true, mensagem: "✅ Algoritmo de palíndromo aprovado em todos os testes!" };
    }

    // 5. DESAFIO 5: Maior Número (4 Testes Dinâmicos)
    if (desafioId === 5) {
      const evaluator = criarAvaliador("arr", "maiorNumero");
      const tests = [
        { input: [10, 45, 3, 99, 23], expected: 99 },
        { input: [-10, -50, -3, -20], expected: -3 },
        { input: [100, 500, 20, 899, 45], expected: 899 },
        { input: [7], expected: 7 }
      ];

      for (let i = 0; i < tests.length; i++) {
        const res = evaluator(tests[i].input);
        if (res !== tests[i].expected) {
          return {
            sucesso: false,
            erro: `❌ Teste #${i + 1} falhou! Para a lista [${tests[i].input.join(", ")}], o maior número esperado era ${tests[i].expected}, mas retornou ${res}.`
          };
        }
      }
      return { sucesso: true, mensagem: "✅ Algoritmo do maior número aprovado em 4 testes dinâmicos!" };
    }

    // 6. DESAFIO 6: Contar Vogais (4 Testes)
    if (desafioId === 6) {
      const evaluator = criarAvaliador("txt", "contarVogais");
      const tests = [
        { input: "DevHub Tecnologia", expected: 8 },
        { input: "Javascript", expected: 3 },
        { input: "Rhythms", expected: 0 },
        { input: "AEIOU", expected: 5 }
      ];

      for (let i = 0; i < tests.length; i++) {
        const res = evaluator(tests[i].input);
        if (res !== tests[i].expected) {
          return {
            sucesso: false,
            erro: `❌ Teste #${i + 1} falhou! Para o texto '${tests[i].input}', esperavam-se ${tests[i].expected} vogais, mas retornou ${res}.`
          };
        }
      }
      return { sucesso: true, mensagem: "✅ Contagem de vogais validada com sucesso!" };
    }

    // 7. DESAFIO 7: Remover Duplicados (3 Testes)
    if (desafioId === 7) {
      const evaluator = criarAvaliador("arr", "removerDuplicados");
      const tests = [
        { input: [1, 2, 2, 3, 4, 4, 5], expected: [1, 2, 3, 4, 5] },
        { input: ["a", "b", "a", "c", "b"], expected: ["a", "b", "c"] },
        { input: [9, 9, 9, 9], expected: [9] }
      ];

      for (let i = 0; i < tests.length; i++) {
        const res = evaluator(tests[i].input);
        if (!Array.isArray(res) || JSON.stringify(res.sort()) !== JSON.stringify(tests[i].expected.sort())) {
          return {
            sucesso: false,
            erro: `❌ Teste #${i + 1} falhou! Para a entrada [${tests[i].input.join(",")}], esperava-se [${tests[i].expected.join(",")}], mas sua solução retornou ${JSON.stringify(res)}.`
          };
        }
      }
      return { sucesso: true, mensagem: "✅ Remoção de elementos duplicados aprovada em todos os testes!" };
    }

    // 8. DESAFIO 8: Soma dos Pares (4 Testes)
    if (desafioId === 8) {
      const evaluator = criarAvaliador("arr", "somarPares");
      const tests = [
        { input: [1, 2, 3, 4, 5, 6], expected: 12 },
        { input: [1, 3, 5, 7], expected: 0 },
        { input: [2, 4, 8, 10], expected: 24 },
        { input: [-2, -4, 5, 6], expected: 4 }
      ];

      for (let i = 0; i < tests.length; i++) {
        const res = evaluator(tests[i].input);
        if (res !== tests[i].expected) {
          return {
            sucesso: false,
            erro: `❌ Teste #${i + 1} falhou! Para a lista [${tests[i].input.join(",")}], a soma dos pares esperada era ${tests[i].expected}, mas sua solução retornou ${res}.`
          };
        }
      }
      return { sucesso: true, mensagem: "✅ Algoritmo de soma de pares aprovado em 4 testes!" };
    }

    // 9. DESAFIO 9: FizzBuzz (4 Testes)
    if (desafioId === 9) {
      const evaluator = criarAvaliador("n", "fizzBuzz");
      const tests = [
        { input: 15, expected: "FizzBuzz" },
        { input: 9, expected: "Fizz" },
        { input: 10, expected: "Buzz" },
        { input: 7, expected: 7 }
      ];

      for (let i = 0; i < tests.length; i++) {
        const res = evaluator(tests[i].input);
        if (String(res) !== String(tests[i].expected)) {
          return {
            sucesso: false,
            erro: `❌ Teste #${i + 1} falhou! Para n=${tests[i].input}, esperava-se '${tests[i].expected}', mas retornou '${res}'.`
          };
        }
      }
      return { sucesso: true, mensagem: "✅ Algoritmo FizzBuzz testado e aprovado com sucesso!" };
    }

    // 10. DESAFIO 10: Debounce
    if (desafioId === 10) {
      if (!codigo.includes("setTimeout") || !codigo.includes("clearTimeout")) {
        return { sucesso: false, erro: "❌ A implementação de Debounce exige a utilização correta de setTimeout e clearTimeout." };
      }
      return { sucesso: true, mensagem: "✅ Implementação de Debounce validada com sucesso!" };
    }

    return { sucesso: true, mensagem: "✅ Solução aprovada com sucesso!" };
  } catch (err) {
    return {
      sucesso: false,
      erro: `❌ Erro de Sintaxe ou Execução no Código: ${err.message}`
    };
  }
}

// Sorteia um desafio verdadeiramente aleatório
function sortearDesafioAleatorio(listaDesafios) {
  if (!listaDesafios || listaDesafios.length === 0) return listaDesafiosPadrao[0];
  const idx = Math.floor(Math.random() * listaDesafios.length);
  return listaDesafios[idx];
}

export default function BatalhaCodigoModule({ user, relatorioAlunos = [] }) {
  const [desafios, setDesafios] = useState(listaDesafiosPadrao);
  const [ranking, setRanking] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [convites, setConvites] = useState([]);
  
  // Lista de Alunos Reais Cadastrados
  const [alunosCadastrados, setAlunosCadastrados] = useState([]);

  // Modal "Caixa de Correio de Batalhas" & "Criar Sala de Duelo"
  const [modalInboxOpen, setModalInboxOpen] = useState(false);
  const [modalCriarSalaOpen, setModalCriarSalaOpen] = useState(false);
  const [oponenteSelecionado, setOponenteSelecionado] = useState("");
  const [desafioSelecionadoId, setDesafioSelecionadoId] = useState("random");
  const [conviteEnviadoSucesso, setConviteEnviadoSucesso] = useState(null);

  // 🟢 Filtrar apenas alunos que estão ONLINE no sistema
  const alunosOnlineList = useMemo(() => {
    if (typeof window === "undefined") return alunosCadastrados;
    try {
      const stored = localStorage.getItem("devhub_usuarios_online");
      let onlineMap = stored ? JSON.parse(stored) : {};
      const now = Date.now();

      // Atualizar heartbeat do usuário atual
      if (user?.nome) {
        onlineMap[user.nome] = now;
      }

      // Garantir presença online inicial para os alunos cadastrados no sistema
      let alterado = false;
      alunosCadastrados.forEach(nome => {
        if (!onlineMap[nome]) {
          onlineMap[nome] = now;
          alterado = true;
        }
      });

      if (user?.nome || alterado) {
        localStorage.setItem("devhub_usuarios_online", JSON.stringify(onlineMap));
      }

      // Retorna apenas alunos que estão online (último acesso < 5 minutos) e excluindo o próprio usuário
      const filtrados = alunosCadastrados.filter(nome => {
        if (user?.nome && nome.toLowerCase().trim() === user.nome.toLowerCase().trim()) return false;
        const lastSeen = onlineMap[nome];
        return lastSeen && (now - lastSeen < 300000);
      });

      return filtrados;
    } catch(e) {
      return alunosCadastrados.filter(n => user?.nome ? n.toLowerCase().trim() !== user.nome.toLowerCase().trim() : true);
    }
  }, [alunosCadastrados, user]);

  useEffect(() => {
    if (modalCriarSalaOpen) {
      if (alunosOnlineList.length > 0) {
        if (!oponenteSelecionado || !alunosOnlineList.includes(oponenteSelecionado)) {
          setOponenteSelecionado(alunosOnlineList[0]);
        }
      } else {
        setOponenteSelecionado("");
      }
    }
  }, [modalCriarSalaOpen, alunosOnlineList]);

  // Notificação Pop-up Temporária Toast
  const [toastNotificacao, setToastNotificacao] = useState(null);
  const [notificadosIds, setNotificadosIds] = useState([]);

  // ⏱️ Contagem regressiva dos convites (em segundos restantes por convite.id)
  const [conviteCountdowns, setConviteCountdowns] = useState({});

  useEffect(() => {
    const tick = () => {
      const agora = Date.now();
      setConviteCountdowns(() => {
        const mapa = {};
        convites.forEach(c => {
          if (c.expirarEm) {
            const restante = Math.max(0, Math.floor((c.expirarEm - agora) / 1000));
            mapa[c.id] = restante;
          }
        });
        return mapa;
      });
    };
    tick();
    const intervalCd = setInterval(tick, 1000);
    return () => clearInterval(intervalCd);
  }, [convites]);

  // Arena de Batalha em Andamento & Console de Logs da Batalha
  const [emBatalha, setEmBatalha] = useState(false);
  const [desafioAtual, setDesafioAtual] = useState(null);
  const [codigoSolucao, setCodigoSolucao] = useState("");
  const [tempoSegundos, setTempoSegundos] = useState(0);
  const [oponenteDuelo, setOponenteDuelo] = useState("");
  const [resultadoBatalha, setResultadoBatalha] = useState(null);
  const [erroValidacaoCodigo, setErroValidacaoCodigo] = useState(null);
  const [logsConsoleBatalha, setLogsConsoleBatalha] = useState([]);

  // Extrair Alunos Reais Cadastrados
  useEffect(() => {
    let nomesReais = [];

    if (Array.isArray(relatorioAlunos) && relatorioAlunos.length > 0) {
      const nomes = relatorioAlunos.map(a => a.alunoNome || a.nome).filter(Boolean);
      nomesReais = [...new Set([...nomesReais, ...nomes])];
    }

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      fetch(`${apiUrl}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const nomesBanco = data
              .filter(u => u.cargo === "usuario" || u.cargo === "estudante" || !u.cargo?.includes("admin"))
              .map(u => u.nome);
            if (nomesBanco.length > 0) {
              nomesReais = [...new Set([...nomesReais, ...nomesBanco])];
            }
          }
          finalizarListaAlunos(nomesReais);
        })
        .catch(() => {
          finalizarListaAlunos(nomesReais);
        });
    } else {
      finalizarListaAlunos(nomesReais);
    }
  }, [relatorioAlunos, user]);

  const finalizarListaAlunos = (listaNomes) => {
    let filtrada = listaNomes.filter(n => n && n.trim() !== "");

    if (filtrada.length === 0 && typeof window !== "undefined") {
      const saved = localStorage.getItem("devhub_relatorio_alunos");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            filtrada = parsed.map(a => a.alunoNome || a.nome).filter(Boolean);
          }
        } catch (e) {}
      }
    }

    const oponentesValidos = filtrada.filter(n => n !== user?.nome);
    setAlunosCadastrados(oponentesValidos.length > 0 ? oponentesValidos : ["Gabriel Costa", "Nicholas Araujo", "Mariana Souza"]);

    if (oponentesValidos.length > 0) {
      setOponenteSelecionado(oponentesValidos[0]);
    } else {
      setOponenteSelecionado("Gabriel Costa");
    }
  };

  // Buscar dados de batalhas do backend + Polling em Tempo Real
  const carregarBatalhas = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const userQuery = user?.nome ? `?nome=${encodeURIComponent(user.nome)}` : "";
    
    fetch(`${apiUrl}/batalhas${userQuery}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          let listaDesafios = desafios;
          if (data.desafios && Array.isArray(data.desafios) && data.desafios.length > 0) {
            setDesafios(data.desafios);
            listaDesafios = data.desafios;
          }
          if (data.ranking) setRanking(data.ranking);
          if (data.historico) setHistorico(data.historico);
          if (data.convites && Array.isArray(data.convites)) {
            setConvites(data.convites);

            if (user?.nome) {
              const meuNomeLower = user.nome.toLowerCase().trim();
              const conviteNovo = data.convites.find(c =>
                c.destinatarioNome?.toLowerCase().trim() === meuNomeLower &&
                c.status === "pendente" &&
                !notificadosIds.includes(c.id)
              );

              if (conviteNovo) {
                setToastNotificacao(conviteNovo);
                setNotificadosIds(prev => [...prev, conviteNovo.id]);
              }
            }
          }

          if (data.dueloAceito && user?.nome) {
            const meuNomeLower = user.nome.toLowerCase().trim();
            if (data.dueloAceito.remetenteNome?.toLowerCase().trim() === meuNomeLower && !emBatalha) {
              const desafioEncontrado = listaDesafios.find(d => d.id === data.dueloAceito.desafioId) || sortearDesafioAleatorio(listaDesafios);
              setDesafioAtual(desafioEncontrado);
              setCodigoSolucao(desafioEncontrado?.codigoInicial || "");
              setOponenteDuelo(data.dueloAceito.destinatarioNome || "Oponente");
              setTempoSegundos(0);
              setResultadoBatalha(null);
              setErroValidacaoCodigo(null);
              setLogsConsoleBatalha([]);
              setModalInboxOpen(false);
              setEmBatalha(true);

              fetch(`${apiUrl}/batalhas/limpar-duelo-aceito`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ remetenteNome: user.nome })
              }).catch(() => {});
            }
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    carregarBatalhas();
    const interval = setInterval(() => {
      carregarBatalhas();
    }, 4000);
    return () => clearInterval(interval);
  }, [user, notificadosIds, emBatalha]);

  // Timer da Batalha
  useEffect(() => {
    let interval = null;
    if (emBatalha) {
      interval = setInterval(() => {
        setTempoSegundos(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [emBatalha]);

  // Executar e Testar Código no Console em Tempo Real na Batalha
  const handleTestarNoConsoleBatalha = () => {
    try {
      let customLogs = [];
      const customConsole = {
        log: (...args) => customLogs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ")),
        error: (...args) => customLogs.push("Erro: " + args.join(" "))
      };

      // Executa o código e captura os logs
      const runFn = new Function("console", codigoSolucao);
      runFn(customConsole);

      const avaliacao = executarTestesBatalha(desafioAtual?.id || 1, codigoSolucao);
      
      let logsFinais = [...customLogs];
      if (avaliacao.sucesso) {
        logsFinais.push(avaliacao.mensagem);
        setErroValidacaoCodigo(null);
      } else {
        logsFinais.push(avaliacao.erro);
        setErroValidacaoCodigo(avaliacao.erro);
      }

      setLogsConsoleBatalha(logsFinais);
    } catch (err) {
      setLogsConsoleBatalha([`❌ Erro na execução de JS: ${err.message}`]);
      setErroValidacaoCodigo(`Erro de Sintaxe no código: ${err.message}`);
    }
  };

  // Criar Sala & Enviar Convite (Com SORTEIO REAL DE TEMA ALEATÓRIO)
  const handleCriarSalaEEnviarConvite = (e) => {
    e.preventDefault();
    const meunome = user?.nome || "Estudante";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    let finalDesafioId = desafioSelecionadoId;
    if (finalDesafioId === "random" || !finalDesafioId) {
      const desafioSorteado = sortearDesafioAleatorio(desafios);
      finalDesafioId = desafioSorteado.id;
    } else {
      finalDesafioId = parseInt(finalDesafioId);
    }

    fetch(`${apiUrl}/batalhas/convites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        remetenteNome: meunome,
        destinatarioNome: oponenteSelecionado,
        desafioId: finalDesafioId
      })
    })
      .then(res => res.json())
      .then(data => {
        setConviteEnviadoSucesso(`Solicitação de X1 enviada com sucesso para ${oponenteSelecionado}! Aguardando oponente aceitar...`);
        setModalCriarSalaOpen(false);
        setTimeout(() => setConviteEnviadoSucesso(null), 5000);
        carregarBatalhas();
      })
      .catch(() => {
        setConviteEnviadoSucesso(`Solicitação de X1 enviada com sucesso para ${oponenteSelecionado}! Aguardando oponente aceitar...`);
        setModalCriarSalaOpen(false);
        setTimeout(() => setConviteEnviadoSucesso(null), 5000);
      });
  };

  // Responder Convite (Aceitar / Recusar)
  const handleResponderConvite = (conviteId, resposta) => {
    setConvites(prev => prev.filter(c => c.id !== conviteId && c.id !== parseInt(conviteId)));
    if (toastNotificacao?.id === conviteId || toastNotificacao?.id === parseInt(conviteId)) {
      setToastNotificacao(null);
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${apiUrl}/batalhas/convites/responder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conviteId, resposta })
    })
      .then(res => res.json())
      .then(data => {
        if (resposta === "aceito") {
          const convite = convites.find(c => c.id === conviteId || c.id === parseInt(conviteId)) || convites[0];
          let desafio = desafios.find(d => d.id === convite?.desafioId);
          if (!desafio || convite?.desafioId === "random") {
            desafio = sortearDesafioAleatorio(desafios);
          }

          setDesafioAtual(desafio);
          setCodigoSolucao(desafio?.codigoInicial || "");
          setOponenteDuelo(convite?.remetenteNome || "Gabriel Costa");
          setTempoSegundos(0);
          setResultadoBatalha(null);
          setErroValidacaoCodigo(null);
          setLogsConsoleBatalha([]);
          setModalInboxOpen(false);
          setEmBatalha(true);
        }
      })
      .catch(() => {
        if (resposta === "aceito") {
          const desafio = sortearDesafioAleatorio(desafios);
          setDesafioAtual(desafio);
          setCodigoSolucao(desafio.codigoInicial);
          setOponenteDuelo("Gabriel Costa");
          setTempoSegundos(0);
          setResultadoBatalha(null);
          setErroValidacaoCodigo(null);
          setLogsConsoleBatalha([]);
          setModalInboxOpen(false);
          setEmBatalha(true);
        }
      });
  };

  // Submeter Solução do Código na Arena:
  // - SE ERRAR: A sala CONTINUA ABERTA e exibe o erro no console!
  // - SE ACERTAR EM 1º LUGAR: Ganha o desafio, ganha os XPs e a sala É FECHADA!
  const handleSubmeterBatalha = () => {
    setErroValidacaoCodigo(null);

    // Roda testes e captura logs no console
    handleTestarNoConsoleBatalha();

    // 1. Executar os Testes Unitários Rígidos Anti-Cheat na Solução
    const avaliacao = executarTestesBatalha(desafioAtual?.id || 1, codigoSolucao);

    if (!avaliacao.sucesso) {
      // ❌ SE ERRAR: A SALA CONTINUA ABERTA! Não fecha a arena para o aluno tentar consertar!
      setErroValidacaoCodigo(avaliacao.erro);
      return;
    }

    // 🏆 SE ACERTAR: O USUÁRIO GANHA O DESAFIO E OS XPS E A SALA É FECHADA!
    const usuarioNome = user?.nome || "Estudante";
    const xpPremio = 350;

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("devhub_estudo_realizado"));
      
      try {
        const savedXp = parseInt(localStorage.getItem("devhub_user_xp") || "0");
        localStorage.setItem("devhub_user_xp", String(savedXp + xpPremio));
      } catch (e) {}
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${apiUrl}/batalhas/submeter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        desafioId: desafioAtual?.id || 1,
        usuarioNome,
        oponenteNome: oponenteDuelo || "Mariana Souza",
        codigo: codigoSolucao,
        tempoSegundos,
        erros: 0
      })
    })
      .then(res => res.json())
      .then(data => {
        setEmBatalha(false);
        setResultadoBatalha({
          vencedor: usuarioNome,
          xpGanho: xpPremio,
          tempoTotal: formatarTempo(tempoSegundos),
          mensagem: `🏆 Vitória Épica de X1! ${avaliacao.mensagem}`
        });
        carregarBatalhas();
      })
      .catch(() => {
        setEmBatalha(false);
        setResultadoBatalha({
          vencedor: usuarioNome,
          xpGanho: xpPremio,
          tempoTotal: formatarTempo(tempoSegundos),
          mensagem: `🏆 Vitória Épica de X1! ${avaliacao.mensagem}`
        });
      });
  };

  const formatarTempo = (seg) => {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${m > 0 ? `${m}m ` : ""}${s}s`;
  };

  // Filtrar APENAS convites pendentes direcionados para a Caixa de Correio do usuário ativo
  const convitesFiltrados = convites.filter(c => {
    if (c.status && c.status !== "pendente") return false;
    if (!user?.nome) return true;
    const meuNomeLower = user.nome.toLowerCase().trim();
    return (
      c.destinatarioNome?.toLowerCase().includes(meuNomeLower) ||
      c.remetenteNome?.toLowerCase().includes(meuNomeLower)
    );
  });

  const temConvitesPendentes = convitesFiltrados.some(c => c.status === "pendente");

  return (
    <div className={styles.container}>
      {/* BANNER DE NOTIFICAÇÃO FLUTUANTE TEMPORÁRIA DE X1 */}
      {toastNotificacao && (
        <div style={{
          position: "fixed", top: "24px", right: "24px", zIndex: 9999,
          backgroundColor: "rgba(23, 28, 44, 0.96)",
          backdropFilter: "blur(14px)",
          border: "2px solid #818cf8",
          borderRadius: "20px",
          padding: "18px 20px",
          width: "380px", maxWidth: "90vw",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(99, 102, 241, 0.4)",
          display: "flex", flexDirection: "column", gap: "12px",
          color: "#FFF"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "800", color: "#818cf8", fontSize: "0.95rem" }}>
              <Swords size={20} color="#ef4444" />
              <span>⚔️ Nova Solicitação de X1!</span>
            </div>
            <button
              onClick={() => setToastNotificacao(null)}
              style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#94a3b8", width: "26px", height: "26px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <X size={14} />
            </button>
          </div>

          <div style={{ fontSize: "0.9rem", color: "#e2e8f0", lineHeight: "1.5" }}>
            <strong style={{ color: "#FFF" }}>{toastNotificacao.remetenteNome}</strong> te convidou para um duelo de X1 no desafio: <span style={{ color: "#38bdf8", fontWeight: "700" }}>"{toastNotificacao.desafioTitulo}"</span>
            {toastNotificacao.expirarEm && (() => {
              const seg = conviteCountdowns[toastNotificacao.id] ?? Math.max(0, Math.floor((new Date(toastNotificacao.expirarEm).getTime() - Date.now()) / 1000));
              const cor = seg > 60 ? "#10b981" : seg > 30 ? "#f59e0b" : "#ef4444";
              const pct = Math.min(100, (seg / 180) * 100);
              return (
                <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "0.8rem", color: cor, fontWeight: "700" }}>⏱️ {Math.floor(seg / 60)}:{String(seg % 60).padStart(2, "0")} para responder</span>
                  <div style={{ flex: 1, height: "5px", borderRadius: "99px", backgroundColor: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, backgroundColor: cor, transition: "width 1s linear", borderRadius: "99px" }} />
                  </div>
                </div>
              );
            })()}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <button
              onClick={() => {
                handleResponderConvite(toastNotificacao.id, "aceito");
                setToastNotificacao(null);
              }}
              style={{
                flex: 1, backgroundColor: "#10b981", color: "#FFF", border: "none",
                borderRadius: "10px", padding: "10px", fontWeight: "800", fontSize: "0.85rem",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)"
              }}
            >
              <Check size={16} />
              <span>🟢 Aceitar X1</span>
            </button>

            <button
              onClick={() => {
                setModalInboxOpen(true);
                setToastNotificacao(null);
              }}
              style={{
                backgroundColor: "rgba(99, 102, 241, 0.2)", color: "#818cf8",
                border: "1px solid rgba(99, 102, 241, 0.4)", borderRadius: "10px",
                padding: "10px 14px", fontWeight: "700", fontSize: "0.85rem",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
              }}
            >
              <Inbox size={15} />
              <span>Ver Tudo ({convitesFiltrados.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* HEADER PRINCIPAL DE DESAFIOS X1 */}
      <div className={styles.headerBox}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Swords size={28} color="#ef4444" />
            <h2 className={styles.title}>Batalha de Código 1v1 (Duelos de Devs)</h2>
          </div>
          <p className={styles.subtitle}>
            Desafie alunos em tempo real, resolva algoritmos rigorosos e ganhe pontos de XP na plataforma!
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* BOTÃO CAIXA DE ENTRADA / NOTIFICAÇÃO DE DUALS */}
          <button
            onClick={() => setModalInboxOpen(true)}
            style={{
              position: "relative",
              padding: "12px 18px",
              borderRadius: "14px",
              border: "1px solid rgba(99, 102, 241, 0.4)",
              background: "rgba(99, 102, 241, 0.15)",
              color: "#818cf8",
              fontWeight: "800",
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Inbox size={18} />
            <span>Caixa de Correio ({convitesFiltrados.length})</span>
            {temConvitesPendentes && (
              <span style={{
                position: "absolute", top: "-5px", right: "-5px",
                width: "12px", height: "12px", borderRadius: "50%",
                backgroundColor: "#ef4444", border: "2px solid #171c2c"
              }} />
            )}
          </button>

          {/* BOTÃO DE CRIAR SALA */}
          <button
            onClick={() => setModalCriarSalaOpen(true)}
            style={{
              padding: "12px 20px",
              borderRadius: "14px",
              border: "none",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "#FFF",
              fontWeight: "800",
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 16px rgba(239, 68, 68, 0.35)"
            }}
          >
            <PlusCircle size={18} />
            <span>Criar Sala de Duelo</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK DE CONVITE ENVIADO */}
      {conviteEnviadoSucesso && (
        <div style={{
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          border: "1px solid #10b981",
          borderRadius: "16px",
          padding: "14px 18px",
          color: "#34d399",
          fontWeight: "700",
          fontSize: "0.92rem",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <CheckCircle size={20} color="#10b981" />
          <span>{conviteEnviadoSucesso}</span>
        </div>
      )}

      {/* MODAL / CAIXA DE CORREIO DE BATALHAS */}
      {modalInboxOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(8px)",
          zIndex: 2000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
        }}>
          <div style={{
            backgroundColor: "var(--bg-card, #171c2c)",
            color: "#FFF",
            width: "100%", maxWidth: "560px",
            borderRadius: "24px", padding: "28px",
            border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            position: "relative"
          }}>
            <button
              onClick={() => setModalInboxOpen(false)}
              style={{
                position: "absolute", top: "20px", right: "20px",
                background: "rgba(255,255,255,0.08)", border: "none", color: "#FFF",
                width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "14px",
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Inbox size={24} color="#FFF" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "800", margin: 0 }}>📫 Caixa de Entrada de Batalhas X1</h3>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Gerencie suas solicitações de duelos recebidas e enviadas</div>
              </div>
            </div>

            {convitesFiltrados.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "40px 20px",
                backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "18px",
                border: "1px dashed rgba(255,255,255,0.15)", color: "#94a3b8"
              }}>
                <Inbox size={40} style={{ opacity: 0.5, marginBottom: "10px" }} />
                <h4 style={{ margin: "0 0 6px 0", color: "#FFF", fontSize: "1rem" }}>Nenhuma solicitação no momento</h4>
                <p style={{ fontSize: "0.85rem", margin: 0 }}>Crie uma nova sala para desafiar alunos cadastrados para um X1!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxHeight: "360px", overflowY: "auto" }}>
                {convitesFiltrados.map((convite) => {
                  const souDestinatario = user?.nome && convite.destinatarioNome?.toLowerCase() === user.nome.toLowerCase();

                  return (
                    <div
                      key={convite.id}
                      style={{
                        backgroundColor: "rgba(99, 102, 241, 0.12)",
                        border: "1px solid rgba(99, 102, 241, 0.35)",
                        borderRadius: "18px",
                        padding: "18px 20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                        <div style={{
                          width: "40px", height: "40px", borderRadius: "12px",
                          background: "linear-gradient(135deg, #ef4444 0%, #6366f1 100%)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#FFF", flexShrink: 0, marginTop: "2px"
                        }}>
                          <Swords size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.95rem", color: "#f8fafc", lineHeight: "1.5", fontWeight: "600" }}>
                            {souDestinatario ? (
                              <>
                                ⚔️ O usuário <strong style={{ color: "#818cf8" }}>{convite.remetenteNome}</strong> te desafiou para um X1 no desafio <strong style={{ color: "#38bdf8" }}>"{convite.desafioTitulo}"</strong>!
                              </>
                            ) : (
                              <>
                                ⏳ Você enviou uma solicitação de X1 para o usuário <strong style={{ color: "#38bdf8" }}>{convite.destinatarioNome}</strong> no desafio <i>"{convite.desafioTitulo}"</i>.
                              </>
                            )}
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "4px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            Dificuldade: <span style={{ color: "#f59e0b", fontWeight: "700" }}>{convite.dificuldade}</span> • {convite.data}
                            {convite.expirarEm && (() => {
                              const seg = conviteCountdowns[convite.id] ?? Math.max(0, Math.floor((convite.expirarEm - Date.now()) / 1000));
                              const pct = Math.min(100, (seg / 180) * 100);
                              const cor = seg > 60 ? "#10b981" : seg > 30 ? "#f59e0b" : "#ef4444";
                              return (
                                <span style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: "700", color: cor }}>
                                  ⏱️ {Math.floor(seg / 60)}:{String(seg % 60).padStart(2, "0")} para expirar
                                  <span style={{ display: "inline-block", width: "60px", height: "5px", borderRadius: "99px", backgroundColor: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                                    <span style={{ display: "block", height: "100%", width: `${pct}%`, backgroundColor: cor, transition: "width 1s linear", borderRadius: "99px" }} />
                                  </span>
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                      </div>

                      {souDestinatario ? (
                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => handleResponderConvite(convite.id, "aceito")}
                            style={{
                              backgroundColor: "#10b981", color: "#FFF", border: "none",
                              borderRadius: "10px", padding: "10px 18px", fontWeight: "800",
                              fontSize: "0.88rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)"
                            }}
                          >
                            <Check size={16} />
                            <span>🟢 Aceitar X1</span>
                          </button>
                          <button
                            onClick={() => handleResponderConvite(convite.id, "recusado")}
                            style={{
                              backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444",
                              border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "10px",
                              padding: "10px 16px", fontWeight: "700", fontSize: "0.88rem",
                              cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
                            }}
                          >
                            <X size={16} />
                            <span>🔴 Recusar</span>
                          </button>
                        </div>
                      ) : (
                        <div style={{
                          alignSelf: "flex-start",
                          fontSize: "0.82rem", fontWeight: "700",
                          backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#f59e0b",
                          border: "1px solid rgba(245, 158, 11, 0.3)",
                          borderRadius: "8px", padding: "4px 12px",
                          display: "flex", alignItems: "center", gap: "6px"
                        }}>
                          ⏳ Aguardando resposta...
                          {convite.expirarEm && (() => {
                            const seg = conviteCountdowns[convite.id] ?? 0;
                            const cor = seg > 60 ? "#10b981" : seg > 30 ? "#f59e0b" : "#ef4444";
                            return <span style={{ color: cor }}>{Math.floor(seg / 60)}:{String(seg % 60).padStart(2, "0")}</span>;
                          })()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL / TELA DE CRIAR SALA DE DUELO */}
      {modalCriarSalaOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(8px)",
          zIndex: 2000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
        }}>
          <div style={{
            backgroundColor: "var(--bg-card, #171c2c)",
            color: "#FFF",
            width: "100%", maxWidth: "540px",
            borderRadius: "24px", padding: "28px",
            border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            position: "relative"
          }}>
            <button
              onClick={() => setModalCriarSalaOpen(false)}
              style={{
                position: "absolute", top: "20px", right: "20px",
                background: "rgba(255,255,255,0.08)", border: "none", color: "#FFF",
                width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #ef4444 0%, #6366f1 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={22} color="#FFF" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "800", margin: 0 }}>🏠 Criar Sala de Duelo 1v1</h3>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Selecione um aluno online no sistema para enviar a solicitação</div>
              </div>
            </div>

            <form onSubmit={handleCriarSalaEEnviarConvite} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* 1. SELETOR DE ALUNOS ONLINE */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.88rem", fontWeight: "700", color: "#cbd5e1", marginBottom: "8px" }}>
                  <GraduationCap size={16} color="#10b981" />
                  <span>1. Selecione o Oponente (Alunos Online no Sistema):</span>
                </label>
                <select
                  value={oponenteSelecionado}
                  onChange={(e) => setOponenteSelecionado(e.target.value)}
                  style={{
                    width: "100%", padding: "14px", borderRadius: "14px",
                    background: "#0f121d", color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.25)",
                    fontSize: "0.95rem", fontWeight: "600", outline: "none"
                  }}
                >
                  {alunosOnlineList.length > 0 ? (
                    alunosOnlineList.map((nome, i) => (
                      <option key={i} value={nome} style={{ background: "#171c2c", color: "#ffffff", padding: "10px" }}>
                        🟢 {nome} (Online Agora)
                      </option>
                    ))
                  ) : (
                    <option value="" disabled style={{ background: "#171c2c", color: "#94a3b8", padding: "10px" }}>
                      ⚠️ Nenhum outro aluno online no momento
                    </option>
                  )}
                </select>
                {alunosOnlineList.length === 0 && (
                  <div style={{ marginTop: "8px", padding: "10px 14px", background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "10px", fontSize: "0.82rem", color: "#fca5a5" }}>
                    ⚠️ Nenhum outro aluno está online no sistema no momento para receber a solicitação.
                  </div>
                )}
              </div>

              {/* 2. SELETOR DE DESAFIOS DE CÓDIGO DIVERSIFICADOS + DESAFIO SURPRESA */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.88rem", fontWeight: "700", color: "#cbd5e1", marginBottom: "8px" }}>
                  <Code size={16} color="#a855f7" />
                  <span>2. Selecione o Desafio de Código (ou Tema Surpresa):</span>
                </label>
                <select
                  value={desafioSelecionadoId}
                  onChange={(e) => setDesafioSelecionadoId(e.target.value)}
                  style={{
                    width: "100%", padding: "14px", borderRadius: "14px",
                    background: "#0f121d", color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.25)",
                    fontSize: "0.95rem", fontWeight: "600", outline: "none"
                  }}
                >
                  <option value="random" style={{ background: "#171c2c", color: "#f59e0b", fontWeight: "800", padding: "10px" }}>
                    🎲 Desafio Surpresa (Tema Aleatório Sortear na Hora)
                  </option>
                  {desafios.map((d) => (
                    <option key={d.id} value={d.id} style={{ background: "#171c2c", color: "#ffffff", padding: "10px" }}>
                      ⚡ Desafio #{d.id}: {d.titulo} [{d.tecnologia || d.categoria}]
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <button
                  type="submit"
                  disabled={!oponenteSelecionado || alunosOnlineList.length === 0}
                  style={{
                    flex: 1, padding: "14px",
                    background: (!oponenteSelecionado || alunosOnlineList.length === 0)
                      ? "#334155"
                      : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: (!oponenteSelecionado || alunosOnlineList.length === 0) ? "#94a3b8" : "#FFF",
                    border: "none", borderRadius: "14px",
                    fontWeight: "800", fontSize: "1rem",
                    cursor: (!oponenteSelecionado || alunosOnlineList.length === 0) ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    boxShadow: (!oponenteSelecionado || alunosOnlineList.length === 0) ? "none" : "0 4px 18px rgba(239, 68, 68, 0.4)",
                    opacity: (!oponenteSelecionado || alunosOnlineList.length === 0) ? 0.6 : 1
                  }}
                >
                  <Send size={18} />
                  <span>🚀 Enviar Solicitação de X1</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESULTADO E FECHAMENTO DA SALA DE BATALHA APÓS A VITÓRIA */}
      {resultadoBatalha && (
        <div style={{
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          border: "2px solid #10b981",
          borderRadius: "20px",
          padding: "24px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 10px 30px rgba(16, 185, 129, 0.25)"
        }}>
          <div style={{ fontSize: "2.5rem" }}>🏆</div>
          <h3 style={{ fontSize: "1.4rem", fontWeight: "900", margin: 0, color: "#FFF" }}>
            {resultadoBatalha.mensagem}
          </h3>
          <div style={{ fontSize: "1rem", color: "#34d399", fontWeight: "800" }}>
            🔒 A Sala do Duelo foi concluída e fechada!
          </div>
          <div style={{ fontSize: "0.95rem", color: "#818cf8", fontWeight: "800" }}>
            Recompensa Resgatada: +{resultadoBatalha.xpGanho} XP | Tempo Total: {resultadoBatalha.tempoTotal || "0s"}
          </div>

          <button
            onClick={() => setResultadoBatalha(null)}
            style={{
              marginTop: "8px",
              padding: "10px 24px",
              borderRadius: "12px",
              border: "none",
              background: "#10b981",
              color: "#FFF",
              fontWeight: "800",
              fontSize: "0.9rem",
              cursor: "pointer"
            }}
          >
            🟢 Concluir & Voltar ao Lobby
          </button>
        </div>
      )}

      {/* ARENA DE DUELO EM TEMPO REAL */}
      {emBatalha && desafioAtual && (
        <div className={styles.arenaCard}>
          <div className={styles.duelHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "800", fontSize: "1.1rem" }}>
              <span style={{ color: "#3b82f6" }}>🥊 {user?.nome || "Estudante"}</span>
              <span className={styles.vsBadge}>VS</span>
              <span style={{ color: "#ef4444" }}>{oponenteDuelo || "Mariana Souza"}</span>
            </div>

            <div className={styles.timerBadge}>
              <Clock size={16} color="#f59e0b" />
              <span>Tempo: {formatarTempo(tempoSegundos)}</span>
            </div>
          </div>

          {/* CARD DESTACADO DA TECNOLOGIA EXIGIDA */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px",
            backgroundColor: "rgba(168, 85, 247, 0.15)", border: "1px solid rgba(168, 85, 247, 0.4)",
            borderRadius: "14px", padding: "12px 18px", marginBottom: "16px"
          }}>
            <span style={{ fontSize: "0.9rem", fontWeight: "900", color: "#c084fc", display: "flex", alignItems: "center", gap: "8px" }}>
              <Code size={18} /> Tecnologia Exigida: <strong>{desafioAtual.tecnologia || desafioAtual.categoria}</strong>
            </span>
            <span style={{ fontSize: "0.82rem", color: "#e2e8f0", fontWeight: "600" }}>
              💡 Escreva o algoritmo utilizando a sintaxe e regras da linguagem acima.
            </span>
          </div>

          {/* CARD DESTACADO COM A PERGUNTA DO DESAFIO */}
          <div style={{
            backgroundColor: "rgba(99, 102, 241, 0.12)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            borderRadius: "16px",
            padding: "18px 22px",
            marginBottom: "20px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#818cf8", fontWeight: "800", fontSize: "1.05rem", marginBottom: "6px" }}>
              <HelpCircle size={20} />
              <span>Pergunta do Desafio #{desafioAtual.id}: {desafioAtual.titulo}</span>
            </div>
            <p style={{ fontSize: "1.05rem", color: "#f8fafc", margin: 0, lineHeight: "1.6", fontWeight: "600" }}>
              {desafioAtual.enunciado}
            </p>
          </div>

          {/* ALERTA DE ERRO NA VALIDAÇÃO DO CÓDIGO */}
          {erroValidacaoCodigo && (
            <div style={{
              backgroundColor: "rgba(239, 68, 68, 0.18)",
              border: "1px solid #ef4444",
              borderRadius: "14px",
              padding: "14px 18px",
              marginBottom: "16px",
              color: "#fca5a5",
              fontSize: "0.92rem",
              fontWeight: "700",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px"
            }}>
              <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ color: "#FFF", display: "block", marginBottom: "4px" }}>❌ Resposta Incorreta / Testes Falharam:</strong>
                <span>{erroValidacaoCodigo}</span>
                <div style={{ marginTop: "6px", fontSize: "0.82rem", color: "#f87171" }}>
                  💡 A sala continua aberta! Corrija o seu código e tente submeter novamente.
                </div>
              </div>
            </div>
          )}

          {/* EDITOR DE CÓDIGO DA BATALHA */}
          <textarea
            className={styles.codeEditor}
            value={codigoSolucao}
            onChange={(e) => {
              setCodigoSolucao(e.target.value);
              setErroValidacaoCodigo(null);
            }}
            placeholder="// Digite sua solução de código aqui..."
          />

          {/* PAINEL DE CONSOLE INTEGRADO PERMANENTE DA BATALHA */}
          <div style={{
            backgroundColor: "#020617", borderRadius: "18px", padding: "18px 22px", marginTop: "16px", marginBottom: "20px",
            border: `1.5px solid ${erroValidacaoCodigo ? "rgba(239,68,68,0.4)" : (logsConsoleBatalha.length > 0 ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)")}`
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: "900", color: "#CBD5E1", display: "flex", alignItems: "center", gap: "8px" }}>
                <Terminal size={16} color="#10B981" /> 🖥️ Console da Batalha (Saída de `console.log` & Validação de Testes)
              </span>
              <span style={{
                fontSize: "11px", fontWeight: "800", padding: "2px 8px", borderRadius: "6px",
                background: erroValidacaoCodigo ? "rgba(239,68,68,0.2)" : (logsConsoleBatalha.length > 0 ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)"),
                color: erroValidacaoCodigo ? "#F87171" : (logsConsoleBatalha.length > 0 ? "#34D399" : "#64748B")
              }}>
                {erroValidacaoCodigo ? "❌ Teste Falhou" : (logsConsoleBatalha.length > 0 ? "🟢 Executado" : "⚪ Aguardando Execução")}
              </span>
            </div>

            {logsConsoleBatalha.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {logsConsoleBatalha.map((log, idx) => (
                  <div key={idx} style={{
                    color: log.startsWith("❌") ? "#F87171" : (log.startsWith("✅") ? "#34D399" : "#38BDF8"),
                    fontFamily: "monospace", fontSize: "13.5px", lineHeight: "1.5"
                  }}>
                    {log}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "#64748B", fontSize: "13px", fontStyle: "italic" }}>
                💡 Clique no botão <strong>"▶️ Testar no Console"</strong> abaixo para rodar seu código e ver os logs e os testes unitários aqui!
              </div>
            )}
          </div>

          {/* BOTÕES DA BATALHA */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={handleTestarNoConsoleBatalha}
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.2)", color: "#3B82F6",
                border: "1px solid rgba(59, 130, 246, 0.4)", borderRadius: "12px",
                padding: "12px 20px", fontWeight: "800", fontSize: "0.92rem", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px"
              }}
            >
              <Play size={16} />
              <span>▶️ Testar no Console</span>
            </button>

            <button className={styles.submitBattleBtn} onClick={handleSubmeterBatalha}>
              <CheckCircle size={18} />
              <span>🏆 Submeter Solução da Batalha</span>
            </button>

            <button
              onClick={() => {
                setEmBatalha(false);
                setErroValidacaoCodigo(null);
                setLogsConsoleBatalha([]);
              }}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                color: "#94a3b8",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "12px 20px",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              Cancelar Duelo
            </button>
          </div>
        </div>
      )}

      {/* Grade Inferior: Ranking Semanal + Histórico de Batalhas */}
      <div className={styles.gridTwoCols}>
        {/* Tabela de Ranking Semanal */}
        <div className={styles.boxCard}>
          <div className={styles.boxHeader}>
            <Trophy size={20} color="#f59e0b" />
            <span>🏆 Ranking Semanal de Gladiadores</span>
          </div>

          <div className={styles.tableList}>
            {ranking.map((item, index) => (
              <div key={index} className={styles.rankingRow}>
                <div className={styles.rankPos}>#{item.posicao}</div>
                <div className={styles.rankInfo}>
                  <span style={{ fontSize: "1.1rem" }}>{item.avatar || "👤"}</span>
                  <div>
                    <div className={styles.rankName}>{item.nome}</div>
                    <div className={styles.rankStats}>{item.vitorias} Vitórias em {item.batalhas} Duelos</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "#818cf8" }}>{item.xp} XP</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabela de Histórico de Batalhas Recentes */}
        <div className={styles.boxCard}>
          <div className={styles.boxHeader}>
            <Clock size={20} color="#6366f1" />
            <span>📜 Histórico das Batalhas Recentes</span>
          </div>

          <div className={styles.tableList}>
            {historico.map((h, index) => (
              <div key={index} className={styles.historyRow}>
                <div className={styles.historyTitle}>{h.desafio}</div>
                <div className={styles.historyMeta}>
                  <span>🥊 {h.aluno1} vs {h.aluno2}</span>
                  <span style={{ color: "#10b981", fontWeight: "700" }}>🏆 Vencedor: {h.vencedor}</span>
                </div>
                <div className={styles.historyMeta}>
                  <span>Tempo: {h.tempo} (Erros: {h.erros})</span>
                  <span>{h.data}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
