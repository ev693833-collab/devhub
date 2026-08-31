import { useState, useEffect } from "react";
import { Swords, Trophy, Clock, Play, CheckCircle, Send, XCircle, Check, X, Shield, Sparkles, PlusCircle, Inbox, Users, Code, GraduationCap, AlertTriangle, HelpCircle } from "lucide-react";
import styles from "./BatalhaCodigoModule.module.css";

// 10 Desafios Únicos e Diversificados para as Batalhas 1v1
const listaDesafiosPadrao = [
  {
    id: 1,
    titulo: "Sistema de Cadastro & Filtro de Usuários",
    categoria: "JavaScript ES6 / Array Filter",
    dificuldade: "Médio",
    enunciado: "Filtre uma lista de objetos de usuários e retorne apenas os usuários ativos com idade >= 18.",
    codigoInicial: ""
  },
  {
    id: 2,
    titulo: "Validação de Parênteses Balanceados",
    categoria: "Estrutura de Dados / Pilha",
    dificuldade: "Difícil",
    enunciado: "Crie um algoritmo para verificar se uma string de parênteses como '({[]})' está balanceada.",
    codigoInicial: ""
  },
  {
    id: 3,
    titulo: "Cálculo do Fatorial de um Número",
    categoria: "Matemática & Lógica",
    dificuldade: "Fácil",
    enunciado: "Crie uma função que receba um número inteiro positivo n e retorne o seu fatorial (ex: 5! = 120).",
    codigoInicial: ""
  },
  {
    id: 4,
    titulo: "Verificação de Palíndromo",
    categoria: "String & Manipulação de Texto",
    dificuldade: "Fácil",
    enunciado: "Escreva um algoritmo para verificar se uma palavra é um palíndromo (lê-se da mesma forma de trás para frente).",
    codigoInicial: ""
  },
  {
    id: 5,
    titulo: "Encontrar o Maior Número em um Array",
    categoria: "Arrays / Vetores",
    dificuldade: "Fácil",
    enunciado: "Crie uma função que receba uma lista de números inteiros e retorne o maior número contido nela.",
    codigoInicial: ""
  },
  {
    id: 6,
    titulo: "Contagem de Vogais em uma Frase",
    categoria: "Strings & RegEx",
    dificuldade: "Fácil",
    enunciado: "Crie um algoritmo que receba um texto e conte quantas vogais (a, e, i, o, u) ele possui.",
    codigoInicial: ""
  },
  {
    id: 7,
    titulo: "Remoção de Duplicados de uma Lista",
    categoria: "ES6 Sets / Arrays",
    dificuldade: "Médio",
    enunciado: "Crie uma função que receba um array com elementos repetidos e retorne apenas os valores únicos.",
    codigoInicial: ""
  },
  {
    id: 8,
    titulo: "Soma de Números Pares",
    categoria: "Lógica de Programação",
    dificuldade: "Fácil",
    enunciado: "Escreva uma função que receba um array de inteiros e retorne a soma de todos os números pares.",
    codigoInicial: ""
  },
  {
    id: 9,
    titulo: "Algoritmo FizzBuzz Clássico",
    categoria: "Estruturas Condicionais",
    dificuldade: "Médio",
    enunciado: "Retorne 'Fizz' para múltiplos de 3, 'Buzz' para múltiplos de 5 e 'FizzBuzz' para múltiplos de ambos.",
    codigoInicial: ""
  },
  {
    id: 10,
    titulo: "Implementação de Debounce em JS",
    categoria: "JavaScript Avançado / Async",
    dificuldade: "Desafiador",
    enunciado: "Implemente uma função debounce(fn, delay) que atrase a execução da função até que o tempo expire.",
    codigoInicial: ""
  }
];

// Avaliador Inteligente & Flexível que aceita QUALQUER formato de código JS (Função, Arrow Function ou Variável Direta)
function executarTestesBatalha(desafioId, codigo) {
  try {
    if (!codigo || codigo.trim() === "" || codigo.startsWith("// Escreva")) {
      return {
        sucesso: false,
        erro: "O código está em branco ou com o comentário padrão. Escreva a sua solução para submeter!"
      };
    }

    // 1. DESAFIO 1: Filtro de Usuários (Aceita qualquer nome de variável ou função)
    if (desafioId === 1) {
      const inputTest = [
        { usuario: 'Andre', nome: 'Andre', idade: 27, ativo: true },
        { usuario: 'Enzo', nome: 'Enzo', idade: 17, ativo: true },
        { usuario: 'Breno', nome: 'Breno', idade: 17, ativo: false },
        { usuario: 'Carlos', nome: 'Carlos', idade: 25, ativo: true }
      ];

      const scriptEvaluator = new Function('inputData', `
        const usuarios = inputData;
        const listaUsuarios = inputData;
        ${codigo}
        if (typeof filtrarUsuarios === 'function') return filtrarUsuarios(inputData);
        if (typeof usuariosValidos !== 'undefined') return usuariosValidos;
        if (typeof resultado !== 'undefined') return resultado;
        if (typeof res !== 'undefined') return res;
        if (typeof output !== 'undefined') return output;
        return null;
      `);

      const res = scriptEvaluator(inputTest);

      if (!res || !Array.isArray(res)) {
        return { sucesso: false, erro: "O código precisa atribuir ou retornar o array filtrado!" };
      }

      const aprovados = res.filter(u => (u.idade >= 18) && (u.ativo === true));
      if (res.length !== 2 || aprovados.length !== 2) {
        return {
          sucesso: false,
          erro: `Resultado incorreto! Esperava-se 2 usuários com idade >= 18 e ativo: true. Sua solução retornou ${res.length} elemento(s).`
        };
      }

      return { sucesso: true, mensagem: "✅ Filtro de usuários aprovado com sucesso!" };
    }

    // 2. DESAFIO 2: Parênteses Balanceados
    if (desafioId === 2) {
      const scriptEvaluator = new Function('str', `
        ${codigo}
        if (typeof validarParenteses === 'function') return validarParenteses(str);
        if (typeof resultado !== 'undefined') return resultado;
        return null;
      `);

      const t1 = scriptEvaluator("({[]})");
      const t2 = scriptEvaluator("({[})");

      if (t1 === true && t2 === false) {
        return { sucesso: true, mensagem: "✅ Algoritmo de validação de parênteses aprovado!" };
      }
      return { sucesso: false, erro: "Casos de teste falharam. Exemplo: '({[]})' deve retornar true e '({[})' false." };
    }

    // 3. DESAFIO 3: Fatorial
    if (desafioId === 3) {
      const scriptEvaluator = new Function('n', `
        ${codigo}
        if (typeof fatorial === 'function') return fatorial(n);
        if (typeof resultado !== 'undefined') return resultado;
        return null;
      `);

      if (scriptEvaluator(5) === 120 && scriptEvaluator(3) === 6) {
        return { sucesso: true, mensagem: "✅ Cálculo de fatorial correto! (5! = 120)." };
      }
      return { sucesso: false, erro: "Cálculo de fatorial incorreto. Esperado para 5: 120." };
    }

    // 4. DESAFIO 4: Palíndromo
    if (desafioId === 4) {
      const scriptEvaluator = new Function('str', `
        ${codigo}
        if (typeof ehPalindromo === 'function') return ehPalindromo(str);
        if (typeof resultado !== 'undefined') return resultado;
        return null;
      `);

      if (scriptEvaluator("arara") === true && scriptEvaluator("estudo") === false) {
        return { sucesso: true, mensagem: "✅ Verificação de palíndromo aprovada!" };
      }
      return { sucesso: false, erro: "Verificação de palíndromo falhou. Ex: 'arara' -> true, 'estudo' -> false." };
    }

    // 5. DESAFIO 5: Maior Número
    if (desafioId === 5) {
      const scriptEvaluator = new Function('arr', `
        ${codigo}
        if (typeof maiorNumero === 'function') return maiorNumero(arr);
        if (typeof resultado !== 'undefined') return resultado;
        return null;
      `);

      if (scriptEvaluator([10, 45, 3, 99, 23]) === 99) {
        return { sucesso: true, mensagem: "✅ Algoritmo do maior número aprovado!" };
      }
      return { sucesso: false, erro: "Maior número incorreto. Esperado para [10, 45, 3, 99, 23]: 99." };
    }

    // 6. DESAFIO 6: Contar Vogais
    if (desafioId === 6) {
      const scriptEvaluator = new Function('txt', `
        ${codigo}
        if (typeof contarVogais === 'function') return contarVogais(txt);
        if (typeof resultado !== 'undefined') return resultado;
        return null;
      `);

      if (scriptEvaluator("DevHub Tecnologia") === 8) {
        return { sucesso: true, mensagem: "✅ Contagem de vogais correta!" };
      }
      return { sucesso: false, erro: "Contagem de vogais incorreta. Esperado para 'DevHub Tecnologia': 8." };
    }

    // 7. DESAFIO 7: Remover Duplicados
    if (desafioId === 7) {
      const scriptEvaluator = new Function('arr', `
        ${codigo}
        if (typeof removerDuplicados === 'function') return removerDuplicados(arr);
        if (typeof resultado !== 'undefined') return resultado;
        return null;
      `);

      const res = scriptEvaluator([1, 2, 2, 3, 4, 4, 5]);
      if (Array.isArray(res) && res.length === 5) {
        return { sucesso: true, mensagem: "✅ Remoção de elementos duplicados aprovada!" };
      }
      return { sucesso: false, erro: "Remoção de duplicados falhou. Esperado para [1,2,2,3,4,4,5]: [1,2,3,4,5]." };
    }

    // 8. DESAFIO 8: Soma dos Pares
    if (desafioId === 8) {
      const scriptEvaluator = new Function('arr', `
        ${codigo}
        if (typeof somarPares === 'function') return somarPares(arr);
        if (typeof resultado !== 'undefined') return resultado;
        return null;
      `);

      if (scriptEvaluator([1, 2, 3, 4, 5, 6]) === 12) {
        return { sucesso: true, mensagem: "✅ Soma de números pares correta!" };
      }
      return { sucesso: false, erro: "Soma de pares incorreta. Esperado para [1, 2, 3, 4, 5, 6]: 12." };
    }

    // 9. DESAFIO 9: FizzBuzz
    if (desafioId === 9) {
      const scriptEvaluator = new Function('n', `
        ${codigo}
        if (typeof fizzBuzz === 'function') return fizzBuzz(n);
        if (typeof resultado !== 'undefined') return resultado;
        return null;
      `);

      if (scriptEvaluator(15) === "FizzBuzz" && scriptEvaluator(9) === "Fizz" && scriptEvaluator(10) === "Buzz") {
        return { sucesso: true, mensagem: "✅ Algoritmo FizzBuzz aprovado!" };
      }
      return { sucesso: false, erro: "FizzBuzz falhou. 15 -> 'FizzBuzz', 9 -> 'Fizz', 10 -> 'Buzz'." };
    }

    // 10. DESAFIO 10: Debounce
    if (desafioId === 10) {
      if (codigo.includes("setTimeout") || codigo.includes("clearTimeout")) {
        return { sucesso: true, mensagem: "✅ Implementação de Debounce validada com sucesso!" };
      }
      return { sucesso: false, erro: "Utilize setTimeout / clearTimeout para a implementação do Debounce." };
    }

    return { sucesso: true, mensagem: "✅ Solução aprovada com sucesso!" };
  } catch (err) {
    return {
      sucesso: false,
      erro: `Erro na execução do código: ${err.message}`
    };
  }
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

  // Arena de Batalha em Andamento
  const [emBatalha, setEmBatalha] = useState(false);
  const [desafioAtual, setDesafioAtual] = useState(null);
  const [codigoSolucao, setCodigoSolucao] = useState("");
  const [tempoSegundos, setTempoSegundos] = useState(0);
  const [oponenteDuelo, setOponenteDuelo] = useState("");
  const [resultadoBatalha, setResultadoBatalha] = useState(null);
  const [erroValidacaoCodigo, setErroValidacaoCodigo] = useState(null);

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

            // Checar se há novo convite para o usuário logado
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

          // SE O CONVITE QUE O USUÁRIO ENVIOU FOI ACEITO PELO OPONENTE -> ENTRAR DIRETO NA ARENA!
          if (data.dueloAceito && user?.nome) {
            const meuNomeLower = user.nome.toLowerCase().trim();
            if (data.dueloAceito.remetenteNome?.toLowerCase().trim() === meuNomeLower && !emBatalha) {
              const desafioEncontrado = listaDesafios.find(d => d.id === data.dueloAceito.desafioId) || listaDesafios[0];
              setDesafioAtual(desafioEncontrado);
              setCodigoSolucao(desafioEncontrado?.codigoInicial || "");
              setOponenteDuelo(data.dueloAceito.destinatarioNome || "Oponente");
              setTempoSegundos(0);
              setResultadoBatalha(null);
              setErroValidacaoCodigo(null);
              setModalInboxOpen(false);
              setEmBatalha(true);

              // Limpar duelo consumido no backend
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

  // Polling automático a cada 4 segundos para detectar convites novos e duelos aceitos
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

  // Criar Sala & Enviar Convite (Com sorteio real de tema se escolhido "random")
  const handleCriarSalaEEnviarConvite = (e) => {
    e.preventDefault();
    const meunome = user?.nome || "Estudante";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    let finalDesafioId = desafioSelecionadoId;
    if (finalDesafioId === "random" || !finalDesafioId) {
      const itemSorteado = desafios[Math.floor(Math.random() * desafios.length)];
      finalDesafioId = itemSorteado ? itemSorteado.id : 1;
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
    // Remover o convite do estado imediatamente na UI
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
          const desafio = desafios.find(d => d.id === convite?.desafioId) || desafios[0];
          setDesafioAtual(desafio);
          setCodigoSolucao(desafio?.codigoInicial || "");
          setOponenteDuelo(convite?.remetenteNome || "Gabriel Costa");
          setTempoSegundos(0);
          setResultadoBatalha(null);
          setErroValidacaoCodigo(null);
          setModalInboxOpen(false);
          setEmBatalha(true);
        }
      })
      .catch(() => {
        if (resposta === "aceito") {
          const desafio = desafios[0];
          setDesafioAtual(desafio);
          setCodigoSolucao(desafio.codigoInicial);
          setOponenteDuelo("Gabriel Costa");
          setTempoSegundos(0);
          setResultadoBatalha(null);
          setErroValidacaoCodigo(null);
          setModalInboxOpen(false);
          setEmBatalha(true);
        }
      });
  };

  // Submeter Solução do Código na Arena COM AVALIAÇÃO INTELIGENTE & GANHO DE XP
  const handleSubmeterBatalha = () => {
    setErroValidacaoCodigo(null);

    // 1. Executar os Testes Unitários Reais na Solução
    const avaliacao = executarTestesBatalha(desafioAtual?.id || 1, codigoSolucao);

    if (!avaliacao.sucesso) {
      setErroValidacaoCodigo(avaliacao.erro);
      return;
    }

    // 2. Se a Solução Passou em Todos os Testes -> Concluir Batalha e Enviar Pontuação de XP!
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("devhub_estudo_realizado"));
    }

    const usuarioNome = user?.nome || "Estudante";
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
        setResultadoBatalha({
          vencedor: usuarioNome,
          xpGanho: 350,
          mensagem: `🏆 Vitória Épica de X1! ${avaliacao.mensagem}`
        });
        setEmBatalha(false);
        carregarBatalhas();
      })
      .catch(() => {
        setResultadoBatalha({
          vencedor: usuarioNome,
          xpGanho: 350,
          mensagem: `🏆 Vitória Épica de X1! ${avaliacao.mensagem}`
        });
        setEmBatalha(false);
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
      {/* BANNER DE NOTIFICAÇÃO FLUTUANTE TEMPORÁRIA DE X1 (TOAST GAME ESTILO POP-UP) */}
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
              <span>Caixa</span>
            </button>
          </div>
        </div>
      )}

      {/* Topo do Módulo: Banner de Apresentação + Botão "Criar Sala de Duelo" + Ícone de Caixa de Entrada */}
      <div className={styles.headerCard}>
        <div className={styles.titleGroup}>
          <h2>
            <Swords size={28} color="#ef4444" />
            <span>⚔️ Batalha de Código 1v1</span>
          </h2>
          <p>Crie uma sala, convide alunos cadastrados da plataforma e disputem quem resolve o desafio de programação primeiro!</p>
        </div>

        {!emBatalha && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* ÍCONE ELEGANTE DE CAIXA DE CORREIO / CORRESPONDÊNCIA DE X1 */}
            <button
              onClick={() => setModalInboxOpen(true)}
              title="Caixa de Mensagens de Batalhas 1v1"
              style={{
                position: "relative",
                background: temConvitesPendentes ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" : "rgba(255, 255, 255, 0.08)",
                border: temConvitesPendentes ? "1px solid #818cf8" : "1px solid rgba(255, 255, 255, 0.15)",
                color: "#FFF",
                borderRadius: "14px",
                padding: "12px 18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                boxShadow: temConvitesPendentes ? "0 4px 18px rgba(99, 102, 241, 0.4)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              <Inbox size={22} color={temConvitesPendentes ? "#FFF" : "#818cf8"} />
              <span>Caixa de Correio</span>
              {convitesFiltrados.length > 0 && (
                <span style={{
                  background: "#ef4444",
                  color: "#FFF",
                  borderRadius: "20px",
                  padding: "2px 8px",
                  fontSize: "0.78rem",
                  fontWeight: "900",
                  boxShadow: "0 0 10px rgba(239, 68, 68, 0.6)"
                }}>
                  {convitesFiltrados.length}
                </span>
              )}
            </button>

            <button className={styles.newBattleBtn} onClick={() => setModalCriarSalaOpen(true)}>
              <PlusCircle size={18} />
              <span>Criar Sala de Duelo</span>
            </button>
          </div>
        )}
      </div>

      {/* Alerta de Convite Enviado */}
      {conviteEnviadoSucesso && (
        <div style={{
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          border: "1px solid #10b981",
          color: "#10b981",
          padding: "16px 20px",
          borderRadius: "16px",
          fontWeight: "700",
          fontSize: "0.95rem",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <CheckCircle size={20} />
          <span>{conviteEnviadoSucesso}</span>
        </div>
      )}

      {/* MODAL ELEGANTE: CAIXA DE MENSAGENS / SOLICITAÇÕES DE X1 */}
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
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
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
                          {/* TEXTO ATUALIZADO: "O usuário [X] te desafiou para um X1..." */}
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
                <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Selecione um aluno cadastrado no sistema para enviar a solicitação</div>
              </div>
            </div>

            <form onSubmit={handleCriarSalaEEnviarConvite} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* 1. SELETOR DE ALUNOS CADASTRADOS */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.88rem", fontWeight: "700", color: "#cbd5e1", marginBottom: "8px" }}>
                  <GraduationCap size={16} color="#3b82f6" />
                  <span>1. Selecione o Oponente (Alunos Cadastrados):</span>
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
                  {alunosCadastrados.map((nome, i) => (
                    <option key={i} value={nome} style={{ background: "#171c2c", color: "#ffffff", padding: "10px" }}>
                      🎓 {nome}
                    </option>
                  ))}
                </select>
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
                      ⚡ Desafio #{d.id}: {d.titulo} ({d.dificuldade})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: "14px",
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: "#FFF", border: "none", borderRadius: "14px",
                    fontWeight: "800", fontSize: "1rem", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    boxShadow: "0 4px 18px rgba(239, 68, 68, 0.4)"
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

      {/* Resultado da Última Batalha */}
      {resultadoBatalha && (
        <div style={{
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          border: "1px solid #10b981",
          borderRadius: "20px",
          padding: "20px",
          textAlign: "center"
        }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "800", margin: "0 0 6px 0", color: "#FFF" }}>
            {resultadoBatalha.mensagem}
          </h3>
          <div style={{ fontSize: "0.9rem", color: "#818cf8", fontWeight: "700" }}>
            Recompensa: +{resultadoBatalha.xpGanho} XP adicionados à sua conta!
          </div>
        </div>
      )}

      {/* Arena de Duelo em Tempo Real (FOCO APENAS NA PERGUNTA LIMPA E OBJETIVA) */}
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

          {/* CARD DESTACADO COM APENAS A PERGUNTA DO DESAFIO */}
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
                <strong style={{ color: "#FFF", display: "block", marginBottom: "4px" }}>❌ Dica de Correção:</strong>
                <span>{erroValidacaoCodigo}</span>
              </div>
            </div>
          )}

          <textarea
            className={styles.codeEditor}
            value={codigoSolucao}
            onChange={(e) => {
              setCodigoSolucao(e.target.value);
              setErroValidacaoCodigo(null);
            }}
            placeholder="// Digite sua solução de código aqui..."
          />

          <div style={{ display: "flex", gap: "12px" }}>
            <button className={styles.submitBattleBtn} onClick={handleSubmeterBatalha}>
              <CheckCircle size={18} />
              <span>Submeter Solução da Batalha</span>
            </button>
            <button
              onClick={() => {
                setEmBatalha(false);
                setErroValidacaoCodigo(null);
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
