import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DevHubLogo from "../components/Logo";
import DevIaModule from "../components/DevIaModule";
import PerfilModal from "../components/PerfilModal";
import StudentGamificationHeader from "../components/StudentGamificationHeader";
import BatalhaCodigoModule from "../components/BatalhaCodigoModule";
import SuperAdminModule from "../components/SuperAdminModule";
import { 
  BookOpen, Calendar, Trophy, FileText, CheckSquare, 
  Sparkles, ChevronLeft, ChevronRight, ChevronDown, User, Shield, Layers, Swords, Crown,
  LogOut, Moon, Sun, Settings, Bell, Zap, Check
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  // Estados de Usuário e Tema
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(true);

  // Controle de Navegação Lateral & Perfil
  const [abaAtiva, setAbaAtiva] = useState("aulas");
  const [sidebarRecolhida, setSidebarRecolhida] = useState(false);
  const [menuAulasAberto, setMenuAulasAberto] = useState(true);
  const [modalPerfilOpen, setModalPerfilOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Categoria Selecionada para Modal de Estudo
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [busca, setBusca] = useState("");
  const [filtroTag, setFiltroTag] = useState("todos");

  // Filtros para Frequência e Provas
  const [buscaAluno, setBuscaAluno] = useState("");
  const [filtroFrequencia, setFiltroFrequencia] = useState("todos");

  // ===== ESTADOS DO CALENDÁRIO DA AGENDA (DINÂMICO PELO DIA HOJE) =====
  const [mesAtual, setMesAtual] = useState(() => new Date().getMonth());
  const [anoAtual, setAnoAtual] = useState(() => new Date().getFullYear());
  const [diaSelecionado, setDiaSelecionado] = useState(() => {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    return `${dia}/${mes}/${ano}`;
  });

  const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Helper para gerar os dias do mês na grade
  const getDiasDoMes = (mes, ano) => {
    const primeiroDia = new Date(ano, mes, 1).getDay(); // 0 = Domingo
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    
    const dias = [];
    for (let i = 0; i < primeiroDia; i++) {
      dias.push(null);
    }
    for (let d = 1; d <= totalDias; d++) {
      const diaFormatado = String(d).padStart(2, "0");
      const mesFormatado = String(mes + 1).padStart(2, "0");
      const dataStr = `${diaFormatado}/${mesFormatado}/${ano}`;
      dias.push({ diaNum: d, dataStr });
    }
    return dias;
  };

  // ===== AGENDA DE REUNIÕES & AULAS GERENCIÁVEL (INICIA VAZIA) =====
  const [agendaAulas, setAgendaAulas] = useState([]);

  // Modal de Agendamento (Admin Only)
  const [modalAgendaOpen, setModalAgendaOpen] = useState(false);
  const [aulaEmEdicaoId, setAulaEmEdicaoId] = useState(null);

  // Lista de Administradores cadastrados (Dropdown)
  const [listaAdmins, setListaAdmins] = useState([
    "Enzo Vieira (DevHub Master)",
    "Gabriel Costa (Super Admin 👑)",
    "Pedro Henrique (Administrador 🛡️)"
  ]);

  // Sistema de Provas Online (Persistido no localStorage)
  const [provasSistema, setProvasSistema] = useState([]);
  const [provasConcluidas, setProvasConcluidas] = useState([]);

  // Modal Realizar Prova (Estudantes)
  const [provaEmAndamento, setProvaEmAndamento] = useState(null);
  const [respostasUsuario, setRespostasUsuario] = useState({});
  const [modalProvaConcluida, setModalProvaConcluida] = useState(null);

  // Modal Criar Prova Temporária (Admin / Super Admin)
  const [modalCriarProvaOpen, setModalCriarProvaOpen] = useState(false);
  const [modalModoProva, setModalModoProva] = useState("questoes"); // "questoes" | "pdf"
  const [formCriarTitulo, setFormCriarTitulo] = useState("");
  const [formCriarDescricao, setFormCriarDescricao] = useState("");
  const [formCriarDataLimite, setFormCriarDataLimite] = useState("2026-09-15");
  const [formCriarHoraLimite, setFormCriarHoraLimite] = useState("23:59");
  const [formCriarDuracao, setFormCriarDuracao] = useState("45");
  const [formCriarPerguntas, setFormCriarPerguntas] = useState([
    {
      pergunta: "Qual comando inicializa um projeto Node.js?",
      opcoes: ["npm init -y", "git init", "npm start", "node index.js"],
      respostaCorreta: 0
    }
  ]);
  // Estados de PDF
  const [pdfUploadData, setPdfUploadData] = useState(null);   // base64 do PDF
  const [pdfUploadNome, setPdfUploadNome] = useState("");     // nome do arquivo

  // ===== PROVAS ROTATIVAS POR DIA DA SEMANA (hardcoded) =====
  const PROVAS_DIARIAS = [
    {
      id: "diaria-0", // Domingo
      diaSemana: 0,
      emoji: "⚡",
      tema: "JavaScript Avançado",
      titulo: "Prova do Dia — JavaScript Avançado",
      descricao: "Teste seus conhecimentos sobre closures, promises, async/await, destructuring e conceitos avançados de JS.",
      duracaoMinutos: 30,
      criadoPor: "DevHub Sistema 🤖",
      tipo: "questoes",
      questoes: [
        { id: "d0q1", pergunta: "O que é um closure em JavaScript?", opcoes: ["Uma função que lembra o escopo onde foi criada", "Um loop infinito", "Um tipo de variável global", "Uma classe abstrata"], respostaCorreta: 0 },
        { id: "d0q2", pergunta: "Qual é a saída de: console.log(typeof null)?", opcoes: ["null", "undefined", "object", "string"], respostaCorreta: 2 },
        { id: "d0q3", pergunta: "O que faz o método Array.prototype.reduce()?", opcoes: ["Remove elementos do array", "Acumula valores e retorna um único resultado", "Filtra elementos do array", "Mapeia elementos para novos valores"], respostaCorreta: 1 },
        { id: "d0q4", pergunta: "Qual palavra-chave cria uma variável com escopo de bloco?", opcoes: ["var", "let", "function", "global"], respostaCorreta: 1 },
        { id: "d0q5", pergunta: "O que é Promise.all()?", opcoes: ["Executa promises em sequência", "Executa todas as promises em paralelo e aguarda todas resolverem", "Cancela todas as promises", "Retorna a primeira promise resolvida"], respostaCorreta: 1 },
      ]
    },
    {
      id: "diaria-1", // Segunda
      diaSemana: 1,
      emoji: "🟢",
      tema: "Backend com Node.js",
      titulo: "Prova do Dia — Backend com Node.js",
      descricao: "Avaliação sobre Express.js, rotas REST, middlewares, autenticação JWT e boas práticas de API.",
      duracaoMinutos: 30,
      criadoPor: "DevHub Sistema 🤖",
      tipo: "questoes",
      questoes: [
        { id: "d1q1", pergunta: "Qual método HTTP é usado para criar um novo recurso no padrão REST?", opcoes: ["GET", "POST", "PUT", "DELETE"], respostaCorreta: 1 },
        { id: "d1q2", pergunta: "O que é um middleware no Express.js?", opcoes: ["Um banco de dados embutido", "Uma função que tem acesso ao req, res e next", "Um tipo de rota protegida", "Um servidor de arquivos estáticos"], respostaCorreta: 1 },
        { id: "d1q3", pergunta: "Qual comando instala as dependências de um projeto Node.js?", opcoes: ["node install", "npm init", "npm install", "node start"], respostaCorreta: 2 },
        { id: "d1q4", pergunta: "O que significa JWT?", opcoes: ["JavaScript Web Transfer", "JSON Web Token", "Java Web Template", "JavaScript Worker Thread"], respostaCorreta: 1 },
        { id: "d1q5", pergunta: "Qual status HTTP indica que um recurso foi criado com sucesso?", opcoes: ["200 OK", "201 Created", "204 No Content", "202 Accepted"], respostaCorreta: 1 },
      ]
    },
    {
      id: "diaria-2", // Terça
      diaSemana: 2,
      emoji: "🗄️",
      tema: "Banco de Dados & SQL",
      titulo: "Prova do Dia — Banco de Dados & SQL",
      descricao: "Teste seus conhecimentos em consultas SQL, JOINs, índices, normalização e modelagem de dados.",
      duracaoMinutos: 30,
      criadoPor: "DevHub Sistema 🤖",
      tipo: "questoes",
      questoes: [
        { id: "d2q1", pergunta: "Qual cláusula SQL é usada para filtrar resultados?", opcoes: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"], respostaCorreta: 2 },
        { id: "d2q2", pergunta: "O que faz um INNER JOIN?", opcoes: ["Retorna todos os registros das duas tabelas", "Retorna apenas registros com correspondência nas duas tabelas", "Retorna registros somente da tabela esquerda", "Remove duplicatas da consulta"], respostaCorreta: 1 },
        { id: "d2q3", pergunta: "O que é uma chave primária (PRIMARY KEY)?", opcoes: ["Uma senha de acesso ao banco", "Um índice que identifica unicamente cada registro", "Uma coluna que aceita valores nulos", "Um relacionamento entre tabelas"], respostaCorreta: 1 },
        { id: "d2q4", pergunta: "Qual comando SQL remove todos os dados de uma tabela sem apagar a estrutura?", opcoes: ["DROP TABLE", "DELETE FROM", "TRUNCATE TABLE", "REMOVE ALL"], respostaCorreta: 2 },
        { id: "d2q5", pergunta: "O que significa a sigla ACID em banco de dados?", opcoes: ["Agility, Consistency, Integrity, Durability", "Atomicity, Consistency, Isolation, Durability", "Availability, Concurrency, Integrity, Distribution", "Atomicity, Concurrency, Isolation, Data"], respostaCorreta: 1 },
      ]
    },
    {
      id: "diaria-3", // Quarta
      diaSemana: 3,
      emoji: "🔀",
      tema: "Git & Versionamento",
      titulo: "Prova do Dia — Git & Versionamento",
      descricao: "Avaliação sobre comandos Git, branching, merging, rebase, pull requests e fluxo de trabalho em equipe.",
      duracaoMinutos: 30,
      criadoPor: "DevHub Sistema 🤖",
      tipo: "questoes",
      questoes: [
        { id: "d3q1", pergunta: "Qual comando cria uma nova branch e já muda para ela?", opcoes: ["git branch nova", "git checkout -b nova", "git switch nova", "git create nova"], respostaCorreta: 1 },
        { id: "d3q2", pergunta: "O que faz o comando 'git stash'?", opcoes: ["Apaga o histórico de commits", "Salva temporariamente alterações não commitadas", "Cria uma nova tag de versão", "Faz merge de duas branches"], respostaCorreta: 1 },
        { id: "d3q3", pergunta: "Qual a diferença entre 'git merge' e 'git rebase'?", opcoes: ["São idênticos", "Merge cria um commit de junção; rebase reaplica commits linearmente", "Rebase apaga o histórico; merge mantém", "Merge é para branches locais; rebase é para remotas"], respostaCorreta: 1 },
        { id: "d3q4", pergunta: "O que é um 'pull request'?", opcoes: ["Um comando para baixar código do servidor", "Uma solicitação para mesclar uma branch em outra, geralmente com revisão", "Um tipo de commit especial", "Uma branch protegida no repositório"], respostaCorreta: 1 },
        { id: "d3q5", pergunta: "Qual comando desfaz o último commit mas mantém as alterações?", opcoes: ["git reset --hard HEAD~1", "git reset --soft HEAD~1", "git revert HEAD", "git checkout HEAD~1"], respostaCorreta: 1 },
      ]
    },
    {
      id: "diaria-4", // Quinta
      diaSemana: 4,
      emoji: "🎨",
      tema: "UI/UX e CSS Avançado",
      titulo: "Prova do Dia — UI/UX e CSS Avançado",
      descricao: "Teste seus conhecimentos sobre design responsivo, Flexbox, Grid, animações CSS e boas práticas de UX.",
      duracaoMinutos: 30,
      criadoPor: "DevHub Sistema 🤖",
      tipo: "questoes",
      questoes: [
        { id: "d4q1", pergunta: "Qual propriedade CSS centraliza elementos com Flexbox?", opcoes: ["align-items: center + justify-content: center", "text-align: center", "margin: 0 auto", "position: center"], respostaCorreta: 0 },
        { id: "d4q2", pergunta: "O que faz 'position: sticky'?", opcoes: ["Fixo na tela sempre", "Segue o scroll até atingir um limite e então fica fixo", "Remove o elemento do fluxo normal", "Posiciona relativo ao pai"], respostaCorreta: 1 },
        { id: "d4q3", pergunta: "Qual a diferença entre 'em' e 'rem' em CSS?", opcoes: ["São iguais", "'em' é relativo ao elemento pai; 'rem' é relativo ao elemento raiz (html)", "'rem' é maior que 'em' sempre", "'em' é para telas grandes; 'rem' para mobile"], respostaCorreta: 1 },
        { id: "d4q4", pergunta: "O que é 'mobile first' no design responsivo?", opcoes: ["Criar o app apenas para mobile", "Desenvolver a versão mobile primeiro e escalar para telas maiores", "Usar frameworks mobile", "Desabilitar features em desktop"], respostaCorreta: 1 },
        { id: "d4q5", pergunta: "Qual propriedade CSS cria uma transição suave?", opcoes: ["animation", "transition", "transform", "keyframes"], respostaCorreta: 1 },
      ]
    },
    {
      id: "diaria-5", // Sexta
      diaSemana: 5,
      emoji: "🌐",
      tema: "APIs & REST",
      titulo: "Prova do Dia — APIs & REST",
      descricao: "Avaliação sobre design de APIs RESTful, autenticação, versionamento, documentação e boas práticas.",
      duracaoMinutos: 30,
      criadoPor: "DevHub Sistema 🤖",
      tipo: "questoes",
      questoes: [
        { id: "d5q1", pergunta: "O que significa a sigla REST?", opcoes: ["Remote Execution State Transfer", "Representational State Transfer", "Resource Endpoint Structure Type", "Routing Express State Technology"], respostaCorreta: 1 },
        { id: "d5q2", pergunta: "Qual status HTTP indica 'Não Autorizado'?", opcoes: ["403 Forbidden", "401 Unauthorized", "404 Not Found", "500 Server Error"], respostaCorreta: 1 },
        { id: "d5q3", pergunta: "O que é CORS?", opcoes: ["Um tipo de banco de dados", "Cross-Origin Resource Sharing — política que controla acesso entre origens diferentes", "Um protocolo de segurança SSL", "Um framework de API REST"], respostaCorreta: 1 },
        { id: "d5q4", pergunta: "Qual método HTTP é idempotente por natureza?", opcoes: ["POST", "PATCH", "GET", "Nenhum"], respostaCorreta: 2 },
        { id: "d5q5", pergunta: "O que é paginação em APIs?", opcoes: ["Dividir a resposta em partes menores para não sobrecarregar", "Criar múltiplas versões da API", "Cachear respostas no cliente", "Compressão dos dados JSON"], respostaCorreta: 0 },
      ]
    },
    {
      id: "diaria-6", // Sábado
      diaSemana: 6,
      emoji: "⚛️",
      tema: "React & Frontend Moderno",
      titulo: "Prova do Dia — React & Frontend Moderno",
      descricao: "Teste seus conhecimentos sobre React, hooks, gerenciamento de estado, performance e Next.js.",
      duracaoMinutos: 30,
      criadoPor: "DevHub Sistema 🤖",
      tipo: "questoes",
      questoes: [
        { id: "d6q1", pergunta: "Qual hook é usado para gerenciar estado local em React?", opcoes: ["useEffect", "useState", "useContext", "useRef"], respostaCorreta: 1 },
        { id: "d6q2", pergunta: "O que faz o hook useEffect com array de dependências vazio []?", opcoes: ["Executa a cada render", "Executa apenas uma vez após a montagem do componente", "Executa antes do componente montar", "Nunca executa"], respostaCorreta: 1 },
        { id: "d6q3", pergunta: "O que é o Virtual DOM no React?", opcoes: ["O HTML real do navegador", "Uma representação em memória do DOM real para otimizar atualizações", "Um banco de dados de componentes", "O servidor de renderização SSR"], respostaCorreta: 1 },
        { id: "d6q4", pergunta: "Qual é o propósito de 'key' em listas React?", opcoes: ["Estilização de elementos", "Ajudar o React a identificar quais itens mudaram para otimizar renders", "Criar IDs únicos no HTML", "Ordenar automaticamente a lista"], respostaCorreta: 1 },
        { id: "d6q5", pergunta: "O que é Server Side Rendering (SSR) no Next.js?", opcoes: ["Renderizar componentes apenas no cliente", "Gerar o HTML no servidor a cada requisição para melhor SEO e performance", "Um tipo de cache do servidor", "Renderização estática de páginas"], respostaCorreta: 1 },
      ]
    },
  ];

  const salvarRelatorioAlunosLS = (lista, itemParaSalvar = null) => {
    setRelatorioAlunos(lista);
    try {
      localStorage.setItem("devhub_relatorio_alunos", JSON.stringify(lista));
    } catch (e) {}

    if (itemParaSalvar) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      fetch(`${apiUrl}/frequencia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemParaSalvar)
      }).catch(() => {});
    }
  };

  // Carregar dados salvos do backend (MySQL) com fallback para localStorage
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // 1. Reuniões
    fetch(`${apiUrl}/reunioes`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAgendaAulas(data);
        } else {
          const savedAgenda = localStorage.getItem("devhub_agenda_aulas");
          if (savedAgenda) setAgendaAulas(JSON.parse(savedAgenda));
        }
      })
      .catch(() => {
        const savedAgenda = localStorage.getItem("devhub_agenda_aulas");
        if (savedAgenda) setAgendaAulas(JSON.parse(savedAgenda));
      });

    // 2. Provas
    fetch(`${apiUrl}/provas`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProvasSistema(data);
        } else {
          const savedProvas = localStorage.getItem("devhub_provas_sistema");
          if (savedProvas) setProvasSistema(JSON.parse(savedProvas));
        }
      })
      .catch(() => {
        const savedProvas = localStorage.getItem("devhub_provas_sistema");
        if (savedProvas) setProvasSistema(JSON.parse(savedProvas));
      });

    // 3. Notas
    fetch(`${apiUrl}/notas`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setNotasProvas(data);
        } else {
          const savedNotas = localStorage.getItem("devhub_notas_provas");
          if (savedNotas) setNotasProvas(JSON.parse(savedNotas));
        }
      })
      .catch(() => {
        const savedNotas = localStorage.getItem("devhub_notas_provas");
        if (savedNotas) setNotasProvas(JSON.parse(savedNotas));
      });

    // 4. Frequência
    fetch(`${apiUrl}/frequencia`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setRelatorioAlunos(data);
        } else {
          const savedAlunos = localStorage.getItem("devhub_relatorio_alunos");
          if (savedAlunos) setRelatorioAlunos(JSON.parse(savedAlunos));
        }
      })
      .catch(() => {
        const savedAlunos = localStorage.getItem("devhub_relatorio_alunos");
        if (savedAlunos) setRelatorioAlunos(JSON.parse(savedAlunos));
      });

    // 5. Histórico de Provas Concluídas (Trancamento)
    const savedConcluidas = localStorage.getItem("devhub_provas_concluidas");
    if (savedConcluidas) {
      try { setProvasConcluidas(JSON.parse(savedConcluidas)); } catch (e) {}
    }
  }, []);

  const salvarProvasLS = (lista, novaProva = null, idExcluir = null) => {
    setProvasSistema(lista);
    try {
      localStorage.setItem("devhub_provas_sistema", JSON.stringify(lista));
    } catch (e) {}

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    if (novaProva) {
      fetch(`${apiUrl}/provas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaProva)
      }).catch(() => {});
    } else if (idExcluir) {
      fetch(`${apiUrl}/provas/${idExcluir}`, { method: "DELETE" }).catch(() => {});
    }
  };

  const salvarAgendaLS = async (lista, novaReuniao = null, idExcluir = null, idEditar = null, reuniaoEditar = null) => {
    setAgendaAulas(lista);
    try {
      localStorage.setItem("devhub_agenda_aulas", JSON.stringify(lista));
    } catch (e) {}

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    if (novaReuniao) {
      try {
        const res = await fetch(`${apiUrl}/reunioes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novaReuniao)
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData && resData.reuniao) {
            setAgendaAulas(prev => prev.map(item => item.id === novaReuniao.id ? resData.reuniao : item));
          }
        }
      } catch (e) {}
    } else if (idEditar && reuniaoEditar) {
      fetch(`${apiUrl}/reunioes/${idEditar}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reuniaoEditar)
      }).catch(() => {});
    } else if (idExcluir) {
      fetch(`${apiUrl}/reunioes/${idExcluir}`, { method: "DELETE" }).catch(() => {});
    }
  };

  const salvarNotasLS = (lista, notaSalvar = null) => {
    setNotasProvas(lista);
    try {
      localStorage.setItem("devhub_notas_provas", JSON.stringify(lista));
    } catch (e) {}

    if (notaSalvar) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      fetch(`${apiUrl}/notas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notaSalvar)
      }).catch(() => {});
    }
  };

  const handleIniciarProvaOnline = (prova) => {
    const jaFez = user && provasConcluidas.some(c => c.provaId === prova.id && (c.userId === user.id || (c.userEmail && c.userEmail.toLowerCase() === user.email.toLowerCase())));
    if (jaFez) {
      alert("🔒 Você já realizou esta prova! Ela está trancada para o seu usuário.");
      return;
    }
    setProvaEmAndamento(prova);
    setRespostasUsuario({});
    if (typeof window !== 'undefined') window.__provaEmAndamento = true;
  };

  const handleSelecionarResposta = (questaoId, opcaoIndex) => {
    setRespostasUsuario(prev => ({
      ...prev,
      [questaoId]: opcaoIndex
    }));
  };

  const handleEnviarProvaOnline = (e) => {
    e.preventDefault();
    if (!provaEmAndamento) return;

    let acertos = 0;
    const gabarito = provaEmAndamento.questoes.map(q => {
      const respIndex = respostasUsuario[q.id];
      const acertou = respIndex === q.respostaCorreta;
      if (acertou) acertos++;
      return {
        id: q.id,
        pergunta: q.pergunta,
        opcaoEscolhidaTexto: respIndex !== undefined ? q.opcoes[respIndex] : "Não respondida",
        opcaoCorretaTexto: q.opcoes[q.respostaCorreta],
        acertou
      };
    });

    const notaCalculada = parseFloat(((acertos / provaEmAndamento.questoes.length) * 10).toFixed(1));
    const statusCalculado = notaCalculada >= 9.5 ? "Excelente 🌟" : notaCalculada >= 7 ? "Bom 👍" : "Ruim ❌";
    const studentId = user ? user.id : Date.now();
    const nomeAluno = user ? user.nome : "Estudante DevHub";
    const emailAluno = user ? user.email : "estudante@devhub.com";

    // 1. Lançamento Automático do Registro da Prova Realizada
    const registroNotaSalvar = {
      id: Date.now(),
      userId: studentId,
      alunoNome: nomeAluno,
      email: emailAluno,
      provaId: provaEmAndamento.id,
      provaTitulo: provaEmAndamento.titulo,
      nota: notaCalculada,
      status: statusCalculado,
      destaque: notaCalculada >= 9.5,
      dataRealizacao: new Date().toLocaleDateString("pt-BR")
    };

    // Remove registros antigos com 0.0 sem prova e adiciona a nova nota realizada
    const listaFiltradaSemVazios = notasProvas.filter(n => n.nota !== undefined || n.provaTitulo || n.ultimaProvaTitulo);
    const novaListaNotas = [registroNotaSalvar, ...listaFiltradaSemVazios];
    salvarNotasLS(novaListaNotas, registroNotaSalvar);

    // 2. Atualização Automática no Relatório de Frequência das Aulas (Vinculado ao ID do Estudante)
    let novaListaAlunos = [];
    const idxAlunoExistente = relatorioAlunos.findIndex(a => a.id === studentId || (a.email && a.email.toLowerCase() === emailAluno.toLowerCase()));
    const dataHoje = new Date().toLocaleDateString('pt-BR');

    if (idxAlunoExistente !== -1) {
      novaListaAlunos = [...relatorioAlunos];
      const assistidas = (novaListaAlunos[idxAlunoExistente].aulasAssistidas || 0) + 1;
      const total = Math.max(novaListaAlunos[idxAlunoExistente].totalAulas || 3, assistidas);
      const pct = Math.round((assistidas / total) * 100);

      novaListaAlunos[idxAlunoExistente] = {
        ...novaListaAlunos[idxAlunoExistente],
        id: studentId,
        nome: nomeAluno,
        email: emailAluno,
        cargo: "Estudante 👤",
        aulasAssistidas: assistidas,
        totalAulas: total,
        frequenciaPct: pct,
        statusBadge: pct === 100 ? "🏆 100% Presença" : "⚡ Presença Regular",
        statusColor: pct === 100 ? "#10B981" : "#F59E0B",
        ultimaPresenca: dataHoje
      };
    } else {
      const novoAluno = {
        id: studentId,
        nome: nomeAluno,
        email: emailAluno,
        cargo: "Estudante 👤",
        aulasAssistidas: 1,
        totalAulas: 3,
        frequenciaPct: 100,
        statusBadge: "🏆 100% Presença",
        statusColor: "#10B981",
        ultimaPresenca: dataHoje,
        avatar: "🚀"
      };
      novaListaAlunos = [novoAluno, ...relatorioAlunos];
    }
    salvarRelatorioAlunosLS(novaListaAlunos);

    // 3. Registrar Conclusão para Trancar a Prova
    const novaConclusao = {
      provaId: provaEmAndamento.id,
      userId: studentId,
      userEmail: emailAluno,
      nota: notaCalculada,
      dataConclusao: new Date().toLocaleDateString("pt-BR")
    };
    setProvasConcluidas(prev => {
      const novaLista = [...prev, novaConclusao];
      try {
        localStorage.setItem("devhub_provas_concluidas", JSON.stringify(novaLista));
      } catch (e) {}
      return novaLista;
    });

    setModalProvaConcluida({
      titulo: provaEmAndamento.titulo,
      nota: notaCalculada,
      acertos,
      total: provaEmAndamento.questoes.length,
      gabarito
    });
    setProvaEmAndamento(null);
    if (typeof window !== 'undefined') {
      window.__provaEmAndamento = false;
      window.dispatchEvent(new Event("devhub_estudo_realizado"));
    }
  };

  const handleAbrirCriarProvaSuperAdmin = () => {
    setFormCriarTitulo("");
    setFormCriarDescricao("");
    setFormCriarDataLimite("2026-09-15");
    setFormCriarHoraLimite("23:59");
    setFormCriarDuracao("45");
    setModalModoProva("questoes");
    setPdfUploadData(null);
    setPdfUploadNome("");
    setFormCriarPerguntas([
      {
        pergunta: "",
        opcoes: ["", "", "", ""],
        respostaCorreta: 0
      }
    ]);
    setModalCriarProvaOpen(true);
  };

  const handleAdicionarPerguntaForm = () => {
    setFormCriarPerguntas(prev => [
      ...prev,
      {
        pergunta: "",
        opcoes: ["", "", "", ""],
        respostaCorreta: 0
      }
    ]);
  };

  const handleSalvarNovaProvaSuperAdmin = (e) => {
    e.preventDefault();
    if (!formCriarTitulo || !formCriarDescricao) {
      alert("Por favor, preencha o título e descrição da prova.");
      return;
    }
    if (modalModoProva === "pdf" && !pdfUploadData) {
      alert("Por favor, selecione um arquivo PDF para a prova.");
      return;
    }

    const dataFormatada = toBrDate(formCriarDataLimite) || "30/09/2026";
    const criadoPorStr = `${user ? user.nome : "Administrador"} (${user && user.cargo === "super_admin" ? "Super Admin 👑" : "Admin 🛡️"})`;

    const novaProva = {
      id: Date.now(),
      titulo: formCriarTitulo,
      descricao: formCriarDescricao,
      dataLimite: dataFormatada,
      horarioLimite: formCriarHoraLimite,
      duracaoMinutos: parseInt(formCriarDuracao) || 45,
      criadoPor: criadoPorStr,
      tipo: modalModoProva,
      pdfData: modalModoProva === "pdf" ? pdfUploadData : null,
      pdfNome: modalModoProva === "pdf" ? pdfUploadNome : null,
      questoes: modalModoProva === "questoes" ? formCriarPerguntas.map((q, idx) => ({
        id: Date.now() + idx,
        pergunta: q.pergunta || `Pergunta ${idx + 1}`,
        opcoes: q.opcoes.map((o, oIdx) => o || `Opção ${oIdx + 1}`),
        respostaCorreta: parseInt(q.respostaCorreta) || 0
      })) : []
    };

    const listaAtualizada = [novaProva, ...provasSistema];
    salvarProvasLS(listaAtualizada, novaProva);
    setModalCriarProvaOpen(false);
    alert(`✨ Prova ${modalModoProva === "pdf" ? "com PDF" : "temporária"} publicada com sucesso!`);
  };

  const handleExcluirProvaSuperAdmin = (id) => {
    if (confirm("Deseja remover esta prova temporária do sistema?")) {
      const listaAtualizada = provasSistema.filter(p => p.id !== id);
      salvarProvasLS(listaAtualizada);
    }
  };

  // Modal de Adicionar/Editar Notas das Provas (Admin)
  const [modalProvaOpen, setModalProvaOpen] = useState(false);
  const [provaEmEdicaoId, setProvaEmEdicaoId] = useState(null);
  const [formProvaAlunoNome, setFormProvaAlunoNome] = useState("");
  const [formProvaEmail, setFormProvaEmail] = useState("");
  const [formProvaP1, setFormProvaP1] = useState("10.0");
  const [formProvaP2, setFormProvaP2] = useState("10.0");
  const [formProvaProjeto, setFormProvaProjeto] = useState("10.0");

  const handleAbrirNovaProva = () => {
    setProvaEmEdicaoId(null);
    setFormProvaAlunoNome("");
    setFormProvaEmail("");
    setFormProvaP1("10.0");
    setFormProvaP2("10.0");
    setFormProvaProjeto("10.0");
    setModalProvaOpen(true);
  };

  const handleAbrirEditarProva = (nota) => {
    setProvaEmEdicaoId(nota.id);
    setFormProvaAlunoNome(nota.alunoNome);
    setFormProvaEmail(nota.email);
    setFormProvaP1(String(nota.prova1));
    setFormProvaP2(String(nota.prova2));
    setFormProvaProjeto(String(nota.projetoFinal));
    setModalProvaOpen(true);
  };

  const handleSalvarProva = (e) => {
    e.preventDefault();
    if (!formProvaAlunoNome || !formProvaEmail) {
      alert("Por favor, informe o nome e e-mail do aluno.");
      return;
    }

    const p1 = parseFloat(formProvaP1) || 0;
    const p2 = parseFloat(formProvaP2) || 0;
    const proj = parseFloat(formProvaProjeto) || 0;
    const media = (p1 + p2 + proj) / 3;
    const destaque = media >= 9.5;
    
    let status = "Bom 👍";
    if (media >= 9.5) status = "Excelente 🌟";
    else if (media < 7.0) status = "Ruim ❌";

    if (provaEmEdicaoId) {
      setNotasProvas(prev => prev.map(n => n.id === provaEmEdicaoId ? {
        ...n,
        alunoNome: formProvaAlunoNome,
        email: formProvaEmail,
        prova1: p1,
        prova2: p2,
        projetoFinal: proj,
        mediaFinal: media,
        status,
        destaque
      } : n));
    } else {
      const nova = {
        id: Date.now(),
        alunoNome: formProvaAlunoNome,
        email: formProvaEmail,
        prova1: p1,
        prova2: p2,
        projetoFinal: proj,
        mediaFinal: media,
        status,
        destaque
      };
      setNotasProvas(prev => [...prev, nova]);
    }

    setModalProvaOpen(false);
  };

  const handleExcluirProva = (id) => {
    if (confirm("Deseja remover este registro de nota de prova?")) {
      setNotasProvas(prev => prev.filter(n => n.id !== id));
    }
  };

  const [formTitulo, setFormTitulo] = useState("");
  const [formDescricao, setFormDescricao] = useState("");
  const [formData, setFormData] = useState("");
  const [formHoraInicio, setFormHoraInicio] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [formHoraFim, setFormHoraFim] = useState(() => {
    const d = new Date(Date.now() + 3600000);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [formHorario, setFormHorario] = useState("");
  const [formInstrutor, setFormInstrutor] = useState("Enzo Vieira (DevHub Master)");
  const [formStatus, setFormStatus] = useState("Agendada 📅");
  const [formLink, setFormLink] = useState("");
  const [formIcone, setFormIcone] = useState("📅");

  // Conversores para a Mini Agendinha (Seletor de Data input type="date")
  const toIsoDate = (dataStr) => {
    if (!dataStr || !dataStr.includes("/")) return "";
    const parts = dataStr.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    }
    return "";
  };

  const toBrDate = (isoStr) => {
    if (!isoStr || !isoStr.includes("-")) return "";
    const parts = isoStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return "";
  };

  // Carregar tema e dados do usuário
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "dark";
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);

      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userData");

      if (!token || !userData) {
        router.push("/");
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Buscar lista de usuários do banco para sincronizar Relatórios e Permissões por ID
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        fetch(`${apiUrl}/auth/users`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then((res) => {
            if (!res.ok) return [];
            return res.json().catch(() => []);
          })
          .then((data) => {
            if (Array.isArray(data)) {
              // 1. Condutores de Reuniões (Apenas Admin / Super Admin cadastrados)
              const adminsEncontrados = data
                .filter((u) => u.cargo === "admin" || u.cargo === "super_admin")
                .map((u) => u.nome);
              
              if (adminsEncontrados.length > 0) {
                setListaAdmins(adminsEncontrados);
              }

              // 2. Estudantes Cadastrados no Banco para Frequência e Relatório de Notas (por ID)
              const estudantesDoBanco = data.filter((u) => u.cargo === "usuario" || u.cargo === "estudante" || !u.cargo.includes("admin"));

              // Sincronizar Frequência nas Aulas/Provas
              setRelatorioAlunos(prevAlunos => {
                return estudantesDoBanco.map((dbUser) => {
                  const existente = prevAlunos.find(a => a.id === dbUser.id || (a.email && a.email.toLowerCase() === dbUser.email.toLowerCase()));
                  if (existente) {
                    return {
                      ...existente,
                      id: dbUser.id,
                      nome: dbUser.nome,
                      email: dbUser.email,
                      cargo: "Estudante 👤"
                    };
                  }
                  return {
                    id: dbUser.id,
                    nome: dbUser.nome,
                    email: dbUser.email,
                    cargo: "Estudante 👤",
                    aulasAssistidas: 0,
                    totalAulas: 3,
                    frequenciaPct: 0,
                    statusBadge: "⏳ Sem Presença",
                    statusColor: "#64748B",
                    ultimaPresenca: "Nenhuma",
                    avatar: "🎓"
                  };
                });
              });

              // Sincronizar Notas das Provas (Apenas dados de quem já realizou provas)
              setNotasProvas(prevNotas => {
                return prevNotas.map((existente) => {
                  const dbUser = estudantesDoBanco.find(u => u.id === existente.userId || (u.email && u.email.toLowerCase() === existente.email.toLowerCase()));
                  if (dbUser) {
                    return {
                      ...existente,
                      id: dbUser.id,
                      userId: dbUser.id,
                      alunoNome: dbUser.nome,
                      email: dbUser.email
                    };
                  }
                  return existente;
                });
              });
            }
          })
        // Buscar notas das provas no backend (Banco de Dados MySQL)
        fetch(`${apiUrl}/notas`)
          .then(res => res.ok ? res.json() : [])
          .then(dataNotas => {
            if (Array.isArray(dataNotas)) {
              setNotasProvas(dataNotas);
              try {
                localStorage.setItem("devhub_notas_provas", JSON.stringify(dataNotas));
              } catch (e) {}
            }
          })
          .catch(() => {
            const savedNotas = localStorage.getItem("devhub_notas_provas");
            if (savedNotas) {
              try {
                setNotasProvas(JSON.parse(savedNotas));
              } catch (e) {}
            }
          });

        // Buscar reuniões cadastradas no backend (Banco de Dados MySQL)
        fetch(`${apiUrl}/reunioes`)
          .then(res => res.ok ? res.json() : [])
          .then(dataReunioes => {
            if (Array.isArray(dataReunioes) && dataReunioes.length > 0) {
              setAgendaAulas(dataReunioes);
              try {
                localStorage.setItem("devhub_agenda_aulas", JSON.stringify(dataReunioes));
              } catch (e) {}
            } else {
              const savedAgenda = localStorage.getItem("devhub_agenda_aulas");
              if (savedAgenda) {
                try {
                  setAgendaAulas(JSON.parse(savedAgenda));
                } catch (e) {}
              }
            }
          })
          .catch(() => {
            const savedAgenda = localStorage.getItem("devhub_agenda_aulas");
            if (savedAgenda) {
              try {
                setAgendaAulas(JSON.parse(savedAgenda));
              } catch (e) {}
            }
          });
      } catch (err) {
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
  }, [router]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    router.push("/");
  };

  const isSuperAdmin = user && (user.cargo === "super_admin" || user.cargo === "superadmin");
  const isAdmin = user && (user.cargo === "admin" || user.cargo === "super_admin" || user.cargo === "superadmin");

  // Helper para rótulo do cargo
  const getCargoInfo = (role) => {
    switch (role) {
      case "super_admin":
        return { label: "Super Admin 👑", desc: "Gestão do Sistema", bg: "rgba(168, 85, 247, 0.2)", color: "#c084fc", border: "#a855f7" };
      case "admin":
        return { label: "Administrador 🛡️", desc: "Gerenciamento de Aulas & Relatórios", bg: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", border: "#3b82f6" };
      default:
        return { label: "Estudante 👤", desc: "Acesso às Aulas", bg: "rgba(16, 185, 129, 0.2)", color: "#34d399", border: "#10b981" };
    }
  };

  // Abrir Modal para Nova Aula
  const handleAbrirNovaAula = (dataPreenchida = "") => {
    const agora = new Date();
    const horaInicioStr = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
    const horaFimDate = new Date(agora.getTime() + 60 * 60 * 1000);
    const horaFimStr = `${String(horaFimDate.getHours()).padStart(2, '0')}:${String(horaFimDate.getMinutes()).padStart(2, '0')}`;

    setAulaEmEdicaoId(null);
    setFormTitulo("");
    setFormDescricao("");
    setFormData(dataPreenchida || diaSelecionado || new Date().toLocaleDateString('pt-BR'));
    setFormHoraInicio(horaInicioStr);
    setFormHoraFim(horaFimStr);
    setFormHorario(`${horaInicioStr} - ${horaFimStr}`);
    setFormInstrutor(user ? user.nome : "Enzo Vieira");
    setFormStatus("Agendada 📅");
    setFormLink("");
    setFormIcone("📅");
    setModalAgendaOpen(true);
  };

  // Abrir Modal para Editar Aula
  const handleAbrirEditarAula = (aula) => {
    setAulaEmEdicaoId(aula.id);
    setFormTitulo(aula.titulo);
    setFormDescricao(aula.descricao);
    setFormData(aula.data);
    setFormHorario(aula.horario);
    setFormInstrutor(aula.instrutor);
    setFormStatus(aula.status);
    setFormLink(aula.link);
    setFormIcone(aula.icone);
    setModalAgendaOpen(true);
  };

  // Salvar Agendamento no /agenda (POST / PUT)
  const handleSalvarAgendamento = async (e) => {
    e.preventDefault();
    if (!formTitulo || !formData) {
      alert("Por favor, preencha ao menos o título e a data da aula.");
      return;
    }

    let statusCor = "#3B82F6";
    if (formStatus.includes("Ao Vivo")) statusCor = "#EF4444";
    if (formStatus.includes("Concluída")) statusCor = "#10B981";

    const reuniao = {
      titulo: formTitulo,
      descricao: formDescricao,
      data_reuniao: formData,
      data: formData,
      horario_inicio: formHoraInicio || "19:00",
      horario_fim: formHoraFim || "21:00",
      horario: `${formHoraInicio || "19:00"} - ${formHoraFim || "21:00"}`,
      instrutor: formInstrutor,
      status: formStatus,
      status_cor: statusCor,
      statusCor,
      link: formLink,
      icone: formIcone
    };

    if (aulaEmEdicaoId) {
      const listaAtualizada = agendaAulas.map(item => item.id === aulaEmEdicaoId ? { ...item, ...reuniao, id: aulaEmEdicaoId } : item);
      salvarAgendaLS(listaAtualizada, null, null, aulaEmEdicaoId, reuniao);
    } else {
      const novaReuniao = { ...reuniao, id: Date.now() };
      const listaAtualizada = [novaReuniao, ...agendaAulas];
      salvarAgendaLS(listaAtualizada, novaReuniao);
    }

    setModalAgendaOpen(false);
  };

  // Excluir Aula da Agenda
  const handleExcluirAula = (id) => {
    if (confirm("Tem certeza que deseja cancelar esta aula da agenda?")) {
      const listaFiltrada = agendaAulas.filter(item => item.id !== id);
      salvarAgendaLS(listaFiltrada, null, id);
    }
  };

  // Lista de Categorias de Aprendizado (Aulas)
  const categorias = [
    {
      id: "aulas-devhub",
      titulo: "🎓 Aulas do DevHub",
      subtitulo: "Trilha completa em vídeo e texto para desenvolvimento Full Stack",
      tag: "cursos",
      icone: "📚",
      corBadge: "#3B82F6",
      apenasAdmin: false,
      videos: [
        { titulo: "DEVHUB - AULA 1 - BACKEND", url: "https://www.youtube.com/watch?v=tFgjBZpTAkI" },
        { titulo: "DEVHUB - AULA 2 - FRONTEND", url: "https://www.youtube.com/watch?v=sKqKtOJRh04" },
        { titulo: "DEVHUB - AULA 3 - IA E ESTRUTURA DE CÓDIGO", url: "https://www.youtube.com/watch?v=apk_52Gjq6E" }
      ],
      slides: [
        {
          titulo: "🌐 HTML5 & CSS3 — Estrutura e Estilo",
          cor: "#F97316",
          emoji: "🎨",
          nivel: "Iniciante",
          descricao: "HTML estrutura o conteúdo e CSS aplica o visual responsivo com Flexbox, Grid e variáveis.",
          topicos: [
            "🧱 Tags semânticas (<main>, <header>, <article>)",
            "🎨 Flexbox & Grid para layouts responsivos",
            "🌙 Variáveis CSS (:root) para temas"
          ],
          exemplo: `<!-- HTML semântico com CSS Flexbox -->\n<div style="display: flex; gap: 12px; align-items: center;">\n  <span class="badge">DevHub</span>\n  <h1>Aulas Práticas</h1>\n</div>`
        },
        {
          titulo: "⚙️ JavaScript ES6+ — Fundamentos",
          cor: "#EAB308",
          emoji: "🧠",
          nivel: "Iniciante",
          descricao: "Lógica de programação moderna com funções assíncronas, manipulação do DOM e Arrow Functions.",
          topicos: [
            "⚡ Arrow Functions, const & let",
            "📦 Destructuring, Spread (...) e Array methods",
            "🔗 Async / Await para consumir APIs"
          ],
          exemplo: `// Arrow function assíncrona\nconst buscarDados = async (url) => {\n  const res = await fetch(url);\n  return await res.json();\n};`
        },
        {
          titulo: "🔀 Git & GitHub — Controle de Versão",
          cor: "#F43F5E",
          emoji: "🐙",
          nivel: "Iniciante",
          descricao: "Versionamento de código para salvar checkpoints, trabalhar em equipe e subir projetos.",
          topicos: [
            "📁 git add . && git commit -m 'feat: nova página'",
            "🌿 git checkout -b feature/minha-branch",
            "🚀 git push origin main"
          ],
          exemplo: `# Fluxo básico de commit e envio\ngit add .\ngit commit -m "feat: adiciona sistema de provas"\ngit push origin main`
        },
        {
          titulo: "⚛️ React & Next.js — Frontend Moderno",
          cor: "#38BDF8",
          emoji: "⚛️",
          nivel: "Intermediário",
          descricao: "Criação de interfaces reativas com componentes reutilizáveis, hooks de estado e rotas.",
          topicos: [
            "🧩 Componentes e Props",
            "🔄 useState & useEffect para estados",
            "🚀 Next.js para renderização rápida e rotas"
          ],
          exemplo: `import { useState } from 'react';\n\nexport default function Contador() {\n  const [val, setVal] = useState(0);\n  return <button onClick={() => setVal(val + 1)}>Count: {val}</button>;\n}`
        },
        {
          titulo: "🔐 Node.js & Express — Backend & REST",
          cor: "#10B981",
          emoji: "🖥️",
          nivel: "Intermediário",
          descricao: "Construção de servidores web, criação de APIs RESTful e autenticação com JWT.",
          topicos: [
            "🚦 Rotas GET, POST, PUT, DELETE",
            "🛡️ Middlewares de validação e CORS",
            "🔑 Autenticação com JWT e Bcrypt"
          ],
          exemplo: `const express = require('express');\nconst app = express();\n\napp.get('/api/status', (req, res) => {\n  res.json({ ok: true, msg: 'Servidor rodando' });\n});`
        },
        {
          titulo: "🗄️ Banco de Dados & SQL — Persistência",
          cor: "#8B5CF6",
          emoji: "🗃️",
          nivel: "Intermediário",
          descricao: "Modelagem relacional e consultas eficientes em bancos MySQL e PostgreSQL.",
          topicos: [
            "🔍 SELECT, INSERT, UPDATE, DELETE",
            "🔗 INNER JOIN para relacionar dados",
            "🔑 Primary Keys & Foreign Keys"
          ],
          exemplo: `-- Consulta relacional com JOIN\nSELECT u.nome, p.nota \nFROM usuarios u \nINNER JOIN provas p ON p.user_id = u.id;`
        }
      ],

      conteudo: {
        introducao: "Trilha prática conectando videoaulas do YouTube a explicações escritas passo a passo.",
        secoes: [
          { titulo: "🚀 Passo 1: HTML5 Semântico", texto: "Estruturação semântica de páginas e formulários." },
          { titulo: "🎨 Passo 2: CSS3 & Layouts", texto: "Flexbox, CSS Grid e temas claro/escuro com variáveis." },
          { titulo: "⚡ Passo 3: JavaScript ES6+", texto: "Funções assíncronas, manipulação do DOM e fetch API." },
          { titulo: "⚙️ Passo 4: Node.js & Express", texto: "Construção de servidores e rotas de API." }
        ],
        dica: "Pratique com o código de exemplo disponibilizado nas aulas."
      }
    }
  ];

  // Dados do Relatório de Frequência de Alunos (Sincronizado Dinamicamente pelo Banco)
  const [relatorioAlunos, setRelatorioAlunos] = useState([]);

  // Dados das Notas das Provas (Sincronizado Dinamicamente pelo Banco)
  const [notasProvas, setNotasProvas] = useState([]);

  // Filtros
  const categoriasFiltradas = categorias.filter((cat) => {
    const atendeBusca = cat.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                        cat.subtitulo.toLowerCase().includes(busca.toLowerCase());
    const atendeTag = filtroTag === "todos" || cat.tag === filtroTag;
    return atendeBusca && atendeTag;
  });

  // Verificação de permissões do usuário logado (declarado acima)

  const relatorioAlunosFiltrados = relatorioAlunos.filter((aluno) => {
    const isEstudante = aluno.cargo === "Estudante 👤" || !aluno.cargo.includes("Admin");
    const pertenceAoUsuario = !user || isAdmin || (user && (aluno.id === user.id || (aluno.email && aluno.email.toLowerCase() === user.email.toLowerCase())));
    const atendeBusca = aluno.nome.toLowerCase().includes(buscaAluno.toLowerCase()) ||
                        aluno.email.toLowerCase().includes(buscaAluno.toLowerCase());
    const atendeFiltro = filtroFrequencia === "todos" || 
                         (filtroFrequencia === "100" && aluno.frequenciaPct === 100) ||
                         (filtroFrequencia === "parcial" && aluno.frequenciaPct < 100);
    return isEstudante && pertenceAoUsuario && atendeBusca && atendeFiltro;
  });

  const notasProvasFiltradas = notasProvas.filter((nota) => {
    const pertenceAoUsuario = isSuperAdmin || (user && (
      nota.userId === user.id || 
      (nota.email && user.email && nota.email.toLowerCase().trim() === user.email.toLowerCase().trim()) ||
      (nota.alunoNome && user.nome && nota.alunoNome.toLowerCase().trim() === user.nome.toLowerCase().trim())
    ));
    const atendeBusca = !buscaAluno || 
                        (nota.alunoNome && nota.alunoNome.toLowerCase().includes(buscaAluno.toLowerCase())) ||
                        (nota.email && nota.email.toLowerCase().includes(buscaAluno.toLowerCase()));
    return pertenceAoUsuario && atendeBusca;
  });

  const cargoInfo = user ? getCargoInfo(user.cargo) : getCargoInfo("usuario");

  const isDark = theme === "dark";
  const colors = {
    bgPage: isDark ? "#0B0F19" : "#F8FAFC",
    bgSidebar: isDark ? "#111827" : "#FFFFFF",
    bgCard: isDark ? "#111827" : "#FFFFFF",
    borderCard: isDark ? "rgba(255, 255, 255, 0.1)" : "#E2E8F0",
    textPrimary: isDark ? "#F8FAFC" : "#0F172A",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    inputBg: isDark ? "#1E293B" : "#FFFFFF",
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: colors.bgPage, color: colors.textPrimary }}>
        <h2>Carregando DevHub... 🚀</h2>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>DevHub — Central de Estudos & Calendário</title>
      </Head>

      <div style={{
        minHeight: "100vh",
        backgroundColor: colors.bgPage,
        color: colors.textPrimary,
        fontFamily: "system-ui, -apple-system, sans-serif",
        transition: "all 0.3s ease"
      }}>
        
        {/* Top Header Navbar */}
        <header style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: isDark ? "rgba(11, 15, 25, 0.9)" : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${colors.borderCard}`,
          padding: "16px 28px"
        }}>
          <div style={{ maxWidth: "1350px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            
            <DevHubLogo size="normal" />

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {isSuperAdmin && (
                <button
                  onClick={() => router.push("/super-admin")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
                    color: "#FFFFFF",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 4px 14px rgba(168, 85, 247, 0.35)"
                  }}
                >
                  <Crown size={15} /> Super Admin
                </button>
              )}

              {/* Botão Principal do Usuário (Dropdown) */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "6px 12px 6px 6px",
                    borderRadius: "14px",
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#F1F5F9",
                    border: `1px solid ${userDropdownOpen ? "#3B82F6" : colors.borderCard}`,
                    color: colors.textPrimary,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: userDropdownOpen ? "0 0 0 3px rgba(59, 130, 246, 0.2)" : "none"
                  }}
                >
                  {/* Avatar com Indicador Online */}
                  <div style={{ position: "relative" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#FFF", fontWeight: "700", fontSize: "14px",
                      overflow: "hidden"
                    }}>
                      {(user?.avatar_url || user?.avatar) ? (
                        <img
                          src={user.avatar_url || user.avatar}
                          alt="Foto"
                          style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                        />
                      ) : (
                        user?.nome ? user.nome.charAt(0).toUpperCase() : "U"
                      )}
                    </div>
                    {/* Status Online */}
                    <span style={{
                      width: "10px", height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#10B981",
                      border: `2px solid ${isDark ? "#0B0F19" : "#FFF"}`,
                      position: "absolute",
                      bottom: "0", right: "0"
                    }} />
                  </div>

                  <div style={{ textAlign: "left", paddingRight: "4px" }}>
                    <div style={{ fontSize: "13px", fontWeight: "700", lineHeight: "1.1", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "120px" }}>
                      {user ? user.nome.split(" ")[0] : "Usuário"}
                    </div>
                    <div style={{ fontSize: "10.5px", color: cargoInfo.color, fontWeight: "600", marginTop: "2px" }}>
                      {cargoInfo.label.split(" ")[0]}
                    </div>
                  </div>

                  <ChevronDown
                    size={16}
                    style={{
                      transform: userDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      color: colors.textSecondary
                    }}
                  />
                </button>

                {/* ===== MENU DROPDOWN ===== */}
                {userDropdownOpen && (
                  <>
                    {/* Overlay invisível para fechar ao clicar fora */}
                    <div
                      onClick={() => setUserDropdownOpen(false)}
                      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }}
                    />

                    <div style={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      right: 0,
                      width: "260px",
                      backgroundColor: isDark ? "#111827" : "#FFFFFF",
                      border: `1px solid ${colors.borderCard}`,
                      borderRadius: "18px",
                      boxShadow: isDark ? "0 20px 40px rgba(0, 0, 0, 0.6)" : "0 12px 30px rgba(0, 0, 0, 0.12)",
                      padding: "12px",
                      zIndex: 999,
                      backdropFilter: "blur(16px)"
                    }}>
                      {/* Header do Menu */}
                      <div style={{
                        padding: "10px 12px",
                        borderBottom: `1px solid ${colors.borderCard}`,
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                      }}>
                        <div style={{
                          width: "42px", height: "42px", borderRadius: "50%",
                          background: "linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#FFF", fontWeight: "800", fontSize: "16px"
                        }}>
                          {(user?.avatar_url || user?.avatar) ? (
                            <img src={user.avatar_url || user.avatar} alt="Foto" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                          ) : (
                            user?.nome ? user.nome.charAt(0).toUpperCase() : "U"
                          )}
                        </div>
                        <div style={{ overflow: "hidden" }}>
                          <div style={{ fontSize: "14px", fontWeight: "800", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                            {user ? user.nome : "Estudante DevHub"}
                          </div>
                          <div style={{ fontSize: "11px", color: colors.textSecondary, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                            {user ? user.email : "aluno@devhub.com"}
                          </div>
                          <span style={{
                            display: "inline-block",
                            fontSize: "10px",
                            fontWeight: "800",
                            padding: "2px 8px",
                            borderRadius: "6px",
                            backgroundColor: cargoInfo.bg,
                            color: cargoInfo.color,
                            border: `1px solid ${cargoInfo.border}44`,
                            marginTop: "4px"
                          }}>
                            {cargoInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Opções do Menu */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        
                        {/* Editar Perfil */}
                        <button
                          onClick={() => {
                            setModalPerfilOpen(true);
                            setUserDropdownOpen(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: "10px",
                            border: "none",
                            backgroundColor: "transparent",
                            color: colors.textPrimary,
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "background 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <User size={16} style={{ color: "#3B82F6" }} />
                          <span>Meu Perfil & Conta</span>
                        </button>

                        {/* Alternar Tema */}
                        <button
                          onClick={() => {
                            toggleTheme();
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: "10px",
                            border: "none",
                            backgroundColor: "transparent",
                            color: colors.textPrimary,
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "background 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {isDark ? <Sun size={16} style={{ color: "#F59E0B" }} /> : <Moon size={16} style={{ color: "#6366F1" }} />}
                            <span>Tema {isDark ? "Escuro" : "Claro"}</span>
                          </div>
                          <span style={{
                            fontSize: "10px",
                            fontWeight: "700",
                            padding: "2px 6px",
                            borderRadius: "6px",
                            backgroundColor: isDark ? "rgba(245, 158, 11, 0.15)" : "rgba(99, 102, 241, 0.15)",
                            color: isDark ? "#F59E0B" : "#6366F1"
                          }}>
                            {isDark ? "🌙 Dark" : "☀️ Light"}
                          </span>
                        </button>

                        {/* Ir para Assistente IA */}
                        <button
                          onClick={() => {
                            setAbaAtiva("dev_ia");
                            setUserDropdownOpen(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: "10px",
                            border: "none",
                            backgroundColor: "transparent",
                            color: colors.textPrimary,
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "background 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <Sparkles size={16} style={{ color: "#8B5CF6" }} />
                          <span>Dev IA Tutor ⚡</span>
                        </button>

                        {/* Ir para Arena Batalhas */}
                        <button
                          onClick={() => {
                            setAbaAtiva("batalhas");
                            setUserDropdownOpen(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: "10px",
                            border: "none",
                            backgroundColor: "transparent",
                            color: colors.textPrimary,
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "background 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <Swords size={16} style={{ color: "#EF4444" }} />
                          <span>Arena Batalha 1v1</span>
                        </button>

                        <div style={{ height: "1px", backgroundColor: colors.borderCard, margin: "4px 0" }} />

                        {/* Botão Sair */}
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleLogout();
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: "10px",
                            border: "none",
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            color: "#EF4444",
                            fontSize: "13px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.2)"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)"}
                        >
                          <LogOut size={16} />
                          <span>Sair da Conta</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* CONTÊINER PRINCIPAL: SIDEBAR + CONTEÚDO */}
        <div style={{
          maxWidth: "1380px",
          margin: "0 auto",
          padding: "24px 20px",
          display: "grid",
          gridTemplateColumns: sidebarRecolhida ? "80px 1fr" : "270px 1fr",
          gap: "24px",
          transition: "grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}>

          {/* ===== SIDEBAR LATERAL NOVO LAYOUT MODERNO ===== */}
          <aside style={{
            backgroundColor: isDark ? "rgba(23, 28, 44, 0.95)" : "#FFFFFF",
            border: `1px solid ${colors.borderCard}`,
            borderRadius: "22px",
            padding: sidebarRecolhida ? "18px 10px" : "20px 16px",
            height: "fit-content",
            maxHeight: "calc(100vh - 110px)",
            overflowY: "auto",
            position: "sticky",
            top: "85px",
            boxShadow: isDark ? "0 16px 36px rgba(0,0,0,0.4)" : "0 10px 30px rgba(0,0,0,0.06)",
            backdropFilter: "blur(12px)",
            transition: "all 0.3s ease"
          }}>
            {/* Header da Sidebar com botão de fechar/abrir */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: sidebarRecolhida ? "center" : "space-between",
              marginBottom: "20px",
              paddingBottom: "12px",
              borderBottom: `1px solid ${colors.borderCard}`
            }}>
              {!sidebarRecolhida && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    width: "28px", height: "28px", borderRadius: "8px",
                    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#FFF"
                  }}>
                    <Layers size={16} />
                  </span>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: "800",
                    color: colors.textPrimary,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em"
                  }}>
                    Catálogo DevHub
                  </span>
                </div>
              )}

              {/* Botão de Alternância com ícones Lucide */}
              <button
                onClick={() => setSidebarRecolhida(!sidebarRecolhida)}
                title={sidebarRecolhida ? "Expandir Catálogo" : "Recolher Catálogo"}
                style={{
                  background: isDark ? "rgba(255, 255, 255, 0.08)" : "#F1F5F9",
                  border: `1px solid ${colors.borderCard}`,
                  color: colors.textPrimary,
                  borderRadius: "10px",
                  width: "34px",
                  height: "34px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {sidebarRecolhida ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
            </div>

            {/* Navegação por Itens do Catálogo */}
            <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                ...(user?.cargo === "superadmin" || user?.cargo === "super_admin" || isAdmin ? [
                  { id: "super_admin", label: "Painel Super Admin", sublabel: "Central Executiva", icon: Crown, color: "#F59E0B", badge: "VIP 👑" }
                ] : []),
                { id: "aulas", label: "Aulas & Guia", sublabel: "Full Stack", icon: BookOpen, color: "#3B82F6", badge: `${categorias[0]?.slides?.length || 0}` },
                { id: "agenda", label: "Calendário & Agenda", sublabel: "Aulas & Reuniões", icon: Calendar, color: "#EF4444", badge: "Ao Vivo 🔴" },
                { id: "batalhas", label: "Batalha de Código", sublabel: "Arena 1v1 PvP", icon: Swords, color: "#EF4444", badge: "1v1 ⚔️" },
                { id: "frequencia", label: "Ranking de Devs", sublabel: "Frequência", icon: Trophy, color: "#F59E0B" },
                { id: "notas", label: "Notas das Provas", sublabel: "Boletim", icon: FileText, color: "#A855F7" },
                { id: "provas-online", label: "Realizar Provas", sublabel: "Avaliações", icon: CheckSquare, color: "#EC4899" },
                { id: "dev_ia", label: "Dev IA Tutor", sublabel: "Assistente 24/7", icon: Sparkles, color: "#6366F1", badge: "IA ⚡" }
              ].map((item) => {
                const isAtivo = abaAtiva === item.id;
                const IconComponent = item.icon;

                if (sidebarRecolhida) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setAbaAtiva(item.id);
                        if (item.id === "aulas") setMenuAulasAberto(true);
                      }}
                      title={`${item.label} — ${item.sublabel}`}
                      style={{
                        width: "44px",
                        height: "44px",
                        margin: "0 auto",
                        borderRadius: "13px",
                        border: isAtivo ? `2px solid ${item.color}` : `1px solid ${item.color}33`,
                        background: isAtivo ? `${item.color}2E` : `${item.color}12`,
                        color: isAtivo ? item.color : colors.textPrimary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: isAtivo ? `0 4px 14px ${item.color}40` : "none"
                      }}
                    >
                      <IconComponent size={20} style={{ color: isAtivo ? item.color : (isDark ? "#cbd5e1" : "#475569") }} />
                    </button>
                  );
                }

                const isAulasItem = item.id === "aulas";

                return (
                  <div key={item.id} style={{ display: "flex", flexDirection: "column" }}>
                    <button
                      onClick={() => {
                        setAbaAtiva(item.id);
                        if (isAulasItem) {
                          setMenuAulasAberto(prev => !prev);
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "14px",
                        border: isAtivo ? `1px solid ${item.color}` : "1px solid transparent",
                        background: isAtivo ? `${item.color}1F` : (isDark ? "rgba(255,255,255,0.02)" : "transparent"),
                        color: isAtivo ? item.color : colors.textPrimary,
                        fontWeight: isAtivo ? "800" : "600",
                        fontSize: "13.5px",
                        cursor: "pointer",
                        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: isAtivo ? `0 4px 14px ${item.color}25` : "none"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          backgroundColor: `${item.color}22`,
                          border: `1px solid ${item.color}44`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: item.color,
                          flexShrink: 0
                        }}>
                          <IconComponent size={19} />
                        </div>

                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontSize: "13.5px", fontWeight: "700", lineHeight: "1.2" }}>{item.label}</div>
                          <div style={{ fontSize: "10.5px", color: colors.textSecondary, marginTop: "2px" }}>{item.sublabel}</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {item.badge && (
                          <span style={{
                            fontSize: "10px",
                            fontWeight: "800",
                            padding: "3px 8px",
                            borderRadius: "8px",
                            backgroundColor: `${item.color}22`,
                            color: item.color,
                            border: `1px solid ${item.color}44`
                          }}>
                            {item.badge}
                          </span>
                        )}
                        {isAulasItem && (
                          <ChevronDown
                            size={16}
                            style={{
                              transform: menuAulasAberto ? "rotate(180deg)" : "rotate(0deg)",
                              transition: "transform 0.2s ease",
                              color: isAtivo ? item.color : colors.textSecondary
                            }}
                          />
                        )}
                      </div>
                    </button>

                    {/* Submenu de Assuntos do Guia de Estudo */}
                    {isAulasItem && menuAulasAberto && (
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        marginLeft: "14px",
                        marginTop: "8px",
                        paddingLeft: "10px",
                        borderLeft: `2px solid ${isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.2)"}`,
                        maxHeight: "320px",
                        overflowY: "auto",
                        paddingRight: "4px"
                      }}>
                        {(categorias[0]?.slides || []).map((slide, idx) => {
                          // Remover emojis duplicados do início do título para layout limpo
                          const tituloLimpo = slide.titulo.replace(/^[\p{Emoji}\u200d\s]+/gu, '').trim();

                          return (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setAbaAtiva("aulas");
                                const targetEl = document.getElementById(`topico-slide-${idx}`);
                                if (targetEl) {
                                  targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
                                }
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                width: "100%",
                                padding: "7px 10px",
                                borderRadius: "8px",
                                border: "1px solid transparent",
                                backgroundColor: "transparent",
                                color: isDark ? "#94A3B8" : "#64748B",
                                fontSize: "12px",
                                fontWeight: "600",
                                textAlign: "left",
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = isDark ? `${slide.cor || '#3B82F6'}15` : `${slide.cor || '#3B82F6'}10`;
                                e.currentTarget.style.color = slide.cor || (isDark ? "#F8FAFC" : "#0F172A");
                                e.currentTarget.style.borderColor = `${slide.cor || '#3B82F6'}33`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = isDark ? "#94A3B8" : "#64748B";
                                e.currentTarget.style.borderColor = "transparent";
                              }}
                            >
                              <span style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "6px",
                                backgroundColor: `${slide.cor || '#3B82F6'}1D`,
                                border: `1px solid ${slide.cor || '#3B82F6'}35`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "13px",
                                flexShrink: 0
                              }}>
                                {slide.emoji}
                              </span>
                              <span style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                flex: 1
                              }}>
                                {tituloLimpo}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* ===== ÁREA DE CONTEÚDO PRINCIPAL ===== */}
          <main style={{ minWidth: 0 }}>
            
            {/* Banner de Topo Inteligente com Estatísticas Rápidas */}
            <div style={{
              background: isDark 
                ? "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)" 
                : "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
              border: `1px solid ${colors.borderCard}`,
              borderRadius: "24px",
              padding: "24px 28px",
              marginBottom: "24px",
              boxShadow: isDark ? "0 12px 30px rgba(0,0,0,0.3)" : "0 8px 24px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}>
              {/* Parte Superior do Hero */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "52px", height: "52px", borderRadius: "16px",
                    background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#FFF", fontSize: "24px", fontWeight: "800",
                    boxShadow: "0 8px 20px rgba(59, 130, 246, 0.35)",
                    flexShrink: 0
                  }}>
                    {(user?.avatar_url || user?.avatar) ? (
                      <img src={user.avatar_url || user.avatar} alt="Foto" style={{ width: "100%", height: "100%", borderRadius: "16px", objectFit: "cover" }} />
                    ) : (
                      user?.nome ? user.nome.charAt(0).toUpperCase() : "👋"
                    )}
                  </div>
                  <div>
                    <h1 style={{ fontSize: "22px", fontWeight: "800", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                      Bem-vindo, {user ? user.nome : "Estudante"}! <span style={{ animation: "pulse 2s infinite" }}>🚀</span>
                    </h1>
                    <p style={{ color: colors.textSecondary, fontSize: "13.5px", margin: "4px 0 0 0" }}>
                      Plataforma interativa DevHub — Escolha um módulo abaixo para começar os estudos.
                    </p>
                  </div>
                </div>

                {/* Cards de Métricas Rápidas no Meio */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <div style={{
                    padding: "8px 14px",
                    borderRadius: "14px",
                    backgroundColor: isDark ? "rgba(59, 130, 246, 0.12)" : "#EFF6FF",
                    border: `1px solid ${isDark ? "rgba(59, 130, 246, 0.25)" : "#BFDBFE"}`,
                    display: "flex", alignItems: "center", gap: "8px"
                  }}>
                    <BookOpen size={16} style={{ color: "#3B82F6" }} />
                    <div>
                      <div style={{ fontSize: "10px", color: colors.textSecondary, fontWeight: "700", textTransform: "uppercase" }}>Módulos</div>
                      <div style={{ fontSize: "13px", fontWeight: "800", color: "#3B82F6" }}>{categorias[0]?.slides?.length || 6} Tópicos</div>
                    </div>
                  </div>

                  <div style={{
                    padding: "8px 14px",
                    borderRadius: "14px",
                    backgroundColor: isDark ? "rgba(16, 185, 129, 0.12)" : "#ECFDF5",
                    border: `1px solid ${isDark ? "rgba(16, 185, 129, 0.25)" : "#A7F3D0"}`,
                    display: "flex", alignItems: "center", gap: "8px"
                  }}>
                    <Zap size={16} style={{ color: "#10B981" }} />
                    <div>
                      <div style={{ fontSize: "10px", color: colors.textSecondary, fontWeight: "700", textTransform: "uppercase" }}>Status</div>
                      <div style={{ fontSize: "13px", fontWeight: "800", color: "#10B981" }}>Ativo 🟢</div>
                    </div>
                  </div>

                  <div style={{
                    padding: "8px 14px",
                    borderRadius: "14px",
                    backgroundColor: isDark ? "rgba(168, 85, 247, 0.12)" : "#F3E8FF",
                    border: `1px solid ${isDark ? "rgba(168, 85, 247, 0.25)" : "#DDD6FE"}`,
                    display: "flex", alignItems: "center", gap: "8px"
                  }}>
                    <Crown size={16} style={{ color: "#A855F7" }} />
                    <div>
                      <div style={{ fontSize: "10px", color: colors.textSecondary, fontWeight: "700", textTransform: "uppercase" }}>Trilha</div>
                      <div style={{ fontSize: "13px", fontWeight: "800", color: "#A855F7" }}>Full Stack</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ABA 1: AULAS DE ESTUDO */}
            {abaAtiva === "aulas" && (() => {
              const topicos = categorias[0]?.slides || [];
              const videos = categorias[0]?.videos || [];

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

                  {/* Dashboard Inteligente com Nível, XP, Streak de 7 Dias e Progresso de Habilidades */}
                  <StudentGamificationHeader user={user} />

                  {/* Cabeçalho da página */}
                  <div>
                    <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "4px" }}>
                      📖 Guia de Estudo — Desenvolvimento Full Stack
                    </h2>
                    <p style={{ color: colors.textSecondary, fontSize: "14px" }}>
                      Leia os conceitos fundamentais abaixo e assista às videoaulas para complementar seu aprendizado.
                    </p>
                  </div>

                  {/* ===== SEÇÃO DE CONTEÚDO ESCRITO ===== */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {topicos.map((topico, idx) => (
                      <div
                        key={idx}
                        id={`topico-slide-${idx}`}
                        style={{
                          backgroundColor: colors.bgCard,
                          border: `1px solid ${colors.borderCard}`,
                          borderRadius: "20px",
                          overflow: "hidden",
                          scrollMarginTop: "90px"
                        }}
                      >
                        {/* Header do tópico */}
                        <div style={{
                          padding: "18px 24px",
                          borderBottom: `1px solid ${topico.cor}33`,
                          background: `linear-gradient(135deg, ${topico.cor}14, transparent)`,
                          display: "flex",
                          alignItems: "center",
                          gap: "12px"
                        }}>
                          <span style={{
                            fontSize: "28px",
                            width: "48px", height: "48px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            backgroundColor: `${topico.cor}22`,
                            borderRadius: "14px",
                            border: `1px solid ${topico.cor}33`
                          }}>
                            {topico.emoji}
                          </span>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: "18px", fontWeight: "800", margin: 0, color: topico.cor }}>
                              {topico.titulo}
                            </h3>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
                              <span style={{ fontSize: "11px", fontWeight: "700", color: colors.textSecondary }}>
                                Módulo {idx + 1} de {topicos.length}
                              </span>
                              {topico.nivel && (
                                <span style={{
                                  fontSize: "10px", fontWeight: "800",
                                  padding: "2px 8px", borderRadius: "20px",
                                  backgroundColor: topico.nivel === "Iniciante"
                                    ? "rgba(16,185,129,0.15)"
                                    : topico.nivel === "Intermediário"
                                    ? "rgba(59,130,246,0.15)"
                                    : "rgba(239,68,68,0.15)",
                                  color: topico.nivel === "Iniciante"
                                    ? "#10B981"
                                    : topico.nivel === "Intermediário"
                                    ? "#3B82F6"
                                    : "#EF4444",
                                  border: `1px solid ${
                                    topico.nivel === "Iniciante"
                                      ? "rgba(16,185,129,0.3)"
                                      : topico.nivel === "Intermediário"
                                      ? "rgba(59,130,246,0.3)"
                                      : "rgba(239,68,68,0.3)"
                                  }`
                                }}>
                                  {topico.nivel === "Iniciante" ? "🌱" : topico.nivel === "Intermediário" ? "🚀" : "⚡"} {topico.nivel}
                                </span>
                              )}
                            </div>
                          </div>

                        </div>

                        {/* Corpo do tópico */}
                        <div style={{ padding: "20px 24px" }}>

                          {/* Descrição */}
                          <p style={{
                            fontSize: "14px", lineHeight: "1.75",
                            color: colors.textSecondary,
                            borderLeft: `3px solid ${topico.cor}`,
                            paddingLeft: "14px",
                            marginBottom: "20px"
                          }}>
                            {topico.descricao}
                          </p>

                          {/* Tópicos */}
                          <div style={{ marginBottom: "20px" }}>
                            <p style={{ fontSize: "12px", fontWeight: "800", color: topico.cor, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              📌 Pontos-chave
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "8px" }}>
                              {topico.topicos.map((item, i) => (
                                <div key={i} style={{
                                  padding: "10px 14px",
                                  borderRadius: "10px",
                                  backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F8FAFC",
                                  border: `1px solid ${colors.borderCard}`,
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  color: colors.textPrimary
                                }}>
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Exemplo de código */}
                          {topico.exemplo && (
                            <div>
                              <p style={{ fontSize: "12px", fontWeight: "800", color: topico.cor, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                💻 Exemplo de Código
                              </p>
                              <pre style={{
                                backgroundColor: isDark ? "#0F172A" : "#1E293B",
                                color: "#E2E8F0",
                                padding: "16px 20px",
                                borderRadius: "12px",
                                fontSize: "13px",
                                fontFamily: "monospace",
                                overflowX: "auto",
                                lineHeight: "1.7",
                                border: `1px solid ${topico.cor}33`,
                                margin: 0
                              }}>
                                {topico.exemplo}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ===== SEÇÃO DE VIDEOAULAS ===== */}
                  <div style={{
                    backgroundColor: colors.bgCard,
                    border: `1px solid ${colors.borderCard}`,
                    borderRadius: "20px",
                    padding: "24px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                      <span style={{
                        fontSize: "22px", width: "44px", height: "44px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        backgroundColor: "rgba(59,130,246,0.12)",
                        borderRadius: "12px", border: "1px solid rgba(59,130,246,0.25)"
                      }}>🎥</span>
                      <div>
                        <h3 style={{ fontSize: "17px", fontWeight: "800", margin: 0 }}>
                          Videoaulas do DevHub
                        </h3>
                        <p style={{ fontSize: "13px", color: colors.textSecondary, margin: "2px 0 0 0" }}>
                          Assista às aulas gravadas para reforçar o conteúdo
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {videos.map((v, i) => (
                        <a
                          key={i}
                          href={v.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "14px 18px",
                            borderRadius: "12px",
                            backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F8FAFC",
                            border: `1px solid ${colors.borderCard}`,
                            color: colors.textPrimary,
                            textDecoration: "none",
                            transition: "border-color 0.2s"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{
                              width: "32px", height: "32px",
                              backgroundColor: "rgba(239,68,68,0.12)",
                              border: "1px solid rgba(239,68,68,0.25)",
                              borderRadius: "8px",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "14px"
                            }}>▶</span>
                            <span style={{ fontWeight: "600", fontSize: "14px" }}>{v.titulo}</span>
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: "700", color: "#3B82F6" }}>
                            Assistir →
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })()}


            {/* ABA 2: CALENDÁRIO & AGENDA MENSAL/DIÁRIA */}
            {abaAtiva === "agenda" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                      📅 Calendário da Agenda de Reuniões & Aulas
                    </h2>
                    <p style={{ color: colors.textSecondary, fontSize: "13px", marginTop: "2px" }}>
                      {isAdmin 
                        ? "🛡️ Modo Administrador: Clique no botão ao lado para agendar reuniões."
                        : "Navegue pelos meses e clique nos dias para visualizar quem vai conduzir cada reunião."}
                    </p>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => handleAbrirNovaAula(diaSelecionado)}
                      style={{
                        padding: "10px 18px",
                        borderRadius: "12px",
                        backgroundColor: "#3B82F6",
                        color: "#FFF",
                        border: "none",
                        fontWeight: "700",
                        fontSize: "13px",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
                      }}
                    >
                      ➕ Agendar Reunião
                    </button>
                  )}
                </div>

                {/* SELETOR DE MÊS / ANO & GRADE DO CALENDÁRIO */}
                <div style={{
                  backgroundColor: colors.bgCard,
                  border: `1px solid ${colors.borderCard}`,
                  borderRadius: "20px",
                  padding: "20px 24px",
                  marginBottom: "24px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                    <button
                      onClick={() => {
                        if (mesAtual === 0) {
                          setMesAtual(11);
                          setAnoAtual(anoAtual - 1);
                        } else {
                          setMesAtual(mesAtual - 1);
                        }
                      }}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "10px",
                        border: `1px solid ${colors.borderCard}`,
                        backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
                        color: colors.textPrimary,
                        fontWeight: "700",
                        cursor: "pointer",
                        fontSize: "13px"
                      }}
                    >
                      ◀ Mês Anterior
                    </button>

                    <h3 style={{ fontSize: "18px", fontWeight: "900", color: "#3B82F6" }}>
                      🗓️ {nomesMeses[mesAtual]} de {anoAtual}
                    </h3>

                    <button
                      onClick={() => {
                        if (mesAtual === 11) {
                          setMesAtual(0);
                          setAnoAtual(anoAtual + 1);
                        } else {
                          setMesAtual(mesAtual + 1);
                        }
                      }}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "10px",
                        border: `1px solid ${colors.borderCard}`,
                        backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
                        color: colors.textPrimary,
                        fontWeight: "700",
                        cursor: "pointer",
                        fontSize: "13px"
                      }}
                    >
                      Mês Seguinte ▶
                    </button>
                  </div>

                  {/* GRADE DE DIAS DO MÊS */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", textAlign: "center" }}>
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                      <div key={d} style={{ fontSize: "12px", fontWeight: "800", color: colors.textSecondary, paddingBottom: "6px" }}>
                        {d}
                      </div>
                    ))}

                    {getDiasDoMes(mesAtual, anoAtual).map((item, idx) => {
                      if (!item) {
                        return <div key={`empty-${idx}`} style={{ minHeight: "64px" }} />;
                      }

                      const reunioesNoDia = agendaAulas.filter(a => a.data === item.dataStr);
                      const isSelecionado = item.dataStr === diaSelecionado;
                      const hojeStr = `${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`;
                      const isHoje = item.dataStr === hojeStr;

                      return (
                        <div
                          key={item.dataStr}
                          onClick={() => setDiaSelecionado(item.dataStr)}
                          style={{
                            minHeight: "64px",
                            padding: "8px",
                            borderRadius: "12px",
                            border: isSelecionado 
                              ? "2px solid #3B82F6" 
                              : isHoje 
                              ? "2px solid #10B981" 
                              : `1px solid ${colors.borderCard}`,
                            backgroundColor: isSelecionado
                              ? (isDark ? "rgba(59, 130, 246, 0.25)" : "#E0F2FE")
                              : isHoje
                              ? (isDark ? "rgba(16, 185, 129, 0.15)" : "#ECFDF5")
                              : (reunioesNoDia.length > 0 ? (isDark ? "rgba(30, 41, 59, 0.7)" : "#F8FAFC") : "transparent"),
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ fontSize: "13px", fontWeight: isSelecionado || isHoje ? "900" : "700", color: isSelecionado ? "#3B82F6" : isHoje ? "#10B981" : colors.textPrimary }}>
                              {item.diaNum}
                            </span>
                            {isHoje && (
                              <span style={{ fontSize: "9px", fontWeight: "900", color: "#10B981", textTransform: "uppercase" }}>
                                (Hoje)
                              </span>
                            )}
                          </div>

                          {reunioesNoDia.length > 0 && (
                            <span style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              padding: "2px 6px",
                              borderRadius: "8px",
                              backgroundColor: reunioesNoDia[0].statusCor,
                              color: "#FFFFFF",
                              whiteSpace: "nowrap",
                              marginTop: "4px"
                            }}>
                              {reunioesNoDia.length} reunião
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PAINEL DE REUNIÕES NO DIA SELECIONADO */}
                <div style={{
                  backgroundColor: colors.bgCard,
                  border: `1px solid ${colors.borderCard}`,
                  borderRadius: "20px",
                  padding: "22px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                    <h3 style={{ fontSize: "17px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                      📍 Reuniões & Aulas Marcadas em: <span style={{ color: "#3B82F6" }}>{diaSelecionado}</span>
                    </h3>
                  </div>

                  {agendaAulas.filter(a => a.data === diaSelecionado).length === 0 ? (
                    <div style={{ padding: "32px", textAlign: "center", color: colors.textSecondary }}>
                      <p style={{ fontSize: "15px", marginBottom: "8px" }}>📅 Nenhuma reunião agendada para o dia {diaSelecionado}.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {agendaAulas.filter(a => a.data === diaSelecionado).map((aula) => (
                        <div
                          key={aula.id}
                          style={{
                            backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                            border: `1px solid ${colors.borderCard}`,
                            borderRadius: "14px",
                            padding: "18px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "12px"
                          }}
                        >
                          <div>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                              <span style={{
                                fontSize: "11px",
                                fontWeight: "700",
                                padding: "3px 8px",
                                borderRadius: "8px",
                                backgroundColor: `${aula.statusCor}20`,
                                color: aula.statusCor,
                                whiteSpace: "nowrap"
                              }}>
                                {aula.status}
                              </span>
                              <span style={{ fontSize: "12px", color: colors.textSecondary, fontWeight: "600" }}>
                                ⏰ {aula.horario}
                              </span>
                            </div>

                            <h4 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "4px" }}>
                              {aula.titulo}
                            </h4>

                            <p style={{ fontSize: "13px", color: colors.textSecondary, marginBottom: "6px" }}>
                              {aula.descricao}
                            </p>

                            <span style={{ fontSize: "12px", color: "#3B82F6", fontWeight: "700" }}>
                              👨‍🏫 Conduzido por: {aula.instrutor ? aula.instrutor.replace(/\s*\(.*?\)/, "").trim() : "A definir"}
                            </span>
                          </div>

                          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                            {/* Botão Entrar na Reunião */}
                            {aula.link && (
                              <a
                                href={aula.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  padding: "8px 14px",
                                  borderRadius: "10px",
                                  backgroundColor: "#3B82F6",
                                  color: "#FFFFFF",
                                  textDecoration: "none",
                                  fontSize: "12px",
                                  fontWeight: "800",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
                                }}
                              >
                                🔗 Entrar na Reunião
                              </a>
                            )}

                            {isAdmin && (
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button
                                  onClick={() => {
                                    const proximoStatus = aula.status.includes("Concluída") 
                                      ? "Agendada 📅" 
                                      : "Concluída ✅";
                                    const statusCor = proximoStatus.includes("Concluída") ? "#10B981" : "#3B82F6";
                                    const listaAtualizada = agendaAulas.map(item => item.id === aula.id ? { ...item, status: proximoStatus, statusCor, status_cor: statusCor } : item);
                                    salvarAgendaLS(listaAtualizada, null, null, aula.id, { ...aula, status: proximoStatus, statusCor, status_cor: statusCor });
                                  }}
                                  title="Alternar entre Concluída e Agendada"
                                  style={{
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    backgroundColor: aula.status.includes("Concluída") ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.08)",
                                    color: aula.status.includes("Concluída") ? "#10B981" : colors.textPrimary,
                                    border: `1px solid ${aula.status.includes("Concluída") ? "rgba(16, 185, 129, 0.4)" : colors.borderCard}`,
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    fontWeight: "700"
                                  }}
                                >
                                  {aula.status.includes("Concluída") ? "✅ Concluída" : "Marcar Concluída"}
                                </button>

                                <button
                                  onClick={() => handleAbrirEditarAula(aula)}
                                  style={{
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0",
                                    color: colors.textPrimary,
                                    border: `1px solid ${colors.borderCard}`,
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    fontWeight: "600"
                                  }}
                                >
                                  ✏️ Editar
                                </button>
                                <button
                                  onClick={() => handleExcluirAula(aula.id)}
                                  style={{
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    backgroundColor: "rgba(239, 68, 68, 0.15)",
                                    color: "#EF4444",
                                    border: "1px solid rgba(239, 68, 68, 0.3)",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    fontWeight: "600"
                                  }}
                                >
                                  🗑️
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ABA 3: RANKING DE DEVS */}
            {abaAtiva === "frequencia" && (() => {

              // ===== Calcular XP baseado nas NOTAS DAS PROVAS =====
              // Agrupa todas as provas por aluno (por nome ou email)
              const xpPorAluno = {};
              notasProvas.forEach(nota => {
                const chave = (nota.email || nota.alunoNome || "").toLowerCase().trim();
                if (!chave) return;

                // Pega o melhor valor de nota disponível
                const valorNota = parseFloat(
                  nota.mediaFinal ?? nota.nota ?? nota.prova1 ?? 0
                ) || 0;

                // Converte nota (0-10) para XP (0-1000) por prova
                const xpProva = Math.round((valorNota / 10) * 100);

                if (!xpPorAluno[chave]) {
                  xpPorAluno[chave] = {
                    nome: nota.alunoNome || "Desconhecido",
                    email: nota.email || chave,
                    totalXP: 0,
                    provasFeitas: 0,
                    somaNota: 0
                  };
                }
                xpPorAluno[chave].totalXP += xpProva;
                xpPorAluno[chave].provasFeitas += 1;
                xpPorAluno[chave].somaNota += valorNota;
              });

              // Determina nível pelo XP total acumulado
              const calcularNivel = (xpTotal) => {
                if (xpTotal >= 800) return { label: "Principal", emoji: "💎", cor: "#A855F7" };
                if (xpTotal >= 500) return { label: "Sênior",    emoji: "🔥", cor: "#EF4444" };
                if (xpTotal >= 250) return { label: "Pleno",     emoji: "🚀", cor: "#3B82F6" };
                if (xpTotal > 0)    return { label: "Júnior",    emoji: "🌱", cor: "#10B981" };
                return                     { label: "Iniciante", emoji: "🐣", cor: "#64748B" };
              };

              // Mescla com relatorioAlunos (para ter avatar) e filtra pela busca
              const rankingOrdenado = Object.values(xpPorAluno)
                .map(dev => {
                  const alunoMatch = relatorioAlunos.find(a =>
                    (a.email && a.email.toLowerCase() === dev.email.toLowerCase()) ||
                    (a.nome && a.nome.toLowerCase() === dev.nome.toLowerCase())
                  );
                  const mediaGeral = dev.provasFeitas > 0
                    ? (dev.somaNota / dev.provasFeitas).toFixed(1)
                    : "0.0";

                  return {
                    ...dev,
                    avatar: alunoMatch?.avatar || "🎓",
                    mediaGeral,
                    nivel: calcularNivel(dev.totalXP)
                  };
                })
                .filter(dev => {
                  if (!buscaAluno) return true;
                  const q = buscaAluno.toLowerCase();
                  return dev.nome.toLowerCase().includes(q) || dev.email.toLowerCase().includes(q);
                })
                .sort((a, b) => b.totalXP - a.totalXP);

              const medalhas = ["🥇", "🥈", "🥉"];



              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                  {/* Header */}
                  <div>
                    <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "4px" }}>
                      🏆 Ranking de Devs
                    </h2>
                    <p style={{ color: colors.textSecondary, fontSize: "14px" }}>
                      Classificação dos estudantes baseada na frequência e dedicação às aulas.
                    </p>
                  </div>

                  {/* Busca */}
                  <input
                    type="text"
                    placeholder="🔍 Buscar dev por nome ou e-mail..."
                    value={buscaAluno}
                    onChange={(e) => setBuscaAluno(e.target.value)}
                    style={{
                      width: "100%", padding: "11px 16px",
                      borderRadius: "12px",
                      border: `1px solid ${colors.borderCard}`,
                      backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "14px"
                    }}
                  />

                  {/* Pódio Top 3 */}
                  {rankingOrdenado.length >= 3 && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                      {rankingOrdenado.slice(0, 3).map((dev, i) => (
                        <div key={dev.id} style={{
                          backgroundColor: colors.bgCard,
                          border: `2px solid ${i === 0 ? "#F59E0B" : i === 1 ? "#94A3B8" : "#CD7C2F"}`,
                          borderRadius: "20px",
                          padding: "20px",
                          textAlign: "center",
                          position: "relative",
                          background: i === 0
                            ? `linear-gradient(135deg, rgba(245,158,11,0.12), ${colors.bgCard})`
                            : i === 1
                            ? `linear-gradient(135deg, rgba(148,163,184,0.10), ${colors.bgCard})`
                            : `linear-gradient(135deg, rgba(205,124,47,0.10), ${colors.bgCard})`
                        }}>
                          <div style={{ fontSize: "32px", marginBottom: "4px" }}>{medalhas[i]}</div>
                          <div style={{
                            fontSize: "22px", marginBottom: "8px",
                            width: "48px", height: "48px",
                            backgroundColor: `${dev.nivel.cor}22`,
                            border: `2px solid ${dev.nivel.cor}55`,
                            borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 8px"
                          }}>{dev.avatar}</div>
                          <strong style={{ display: "block", fontSize: "14px", marginBottom: "2px" }}>{dev.nome}</strong>
                          <span style={{
                            fontSize: "11px", fontWeight: "800",
                            padding: "2px 10px", borderRadius: "20px",
                            backgroundColor: `${dev.nivel.cor}22`,
                            color: dev.nivel.cor,
                            border: `1px solid ${dev.nivel.cor}44`
                          }}>{dev.nivel.emoji} {dev.nivel.label}</span>
                          <div style={{ marginTop: "10px", fontSize: "18px", fontWeight: "900", color: dev.nivel.cor }}>
                            {dev.totalXP} <span style={{ fontSize: "11px", fontWeight: "600", color: colors.textSecondary }}>XP</span>
                          </div>
                          <div style={{ fontSize: "11px", color: colors.textSecondary, marginTop: "2px" }}>
                            Média: <strong style={{ color: dev.nivel.cor }}>{dev.mediaGeral}</strong> · {dev.provasFeitas} prova{dev.provasFeitas !== 1 ? "s" : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Lista completa */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {rankingOrdenado.map((dev, idx) => (
                      <div
                        key={dev.email}
                        style={{
                          backgroundColor: colors.bgCard,
                          border: `1px solid ${idx < 3 ? dev.nivel.cor + "44" : colors.borderCard}`,
                          borderRadius: "14px",
                          padding: "14px 18px",
                          display: "flex",
                          alignItems: "center",
                          gap: "14px"
                        }}
                      >
                        {/* Posição */}
                        <div style={{
                          width: "32px", height: "32px", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: idx < 3 ? "20px" : "13px",
                          fontWeight: "800",
                          color: idx < 3 ? undefined : colors.textSecondary
                        }}>
                          {idx < 3 ? medalhas[idx] : `#${idx + 1}`}
                        </div>

                        {/* Avatar */}
                        <div style={{
                          width: "40px", height: "40px", flexShrink: 0,
                          backgroundColor: `${dev.nivel.cor}22`,
                          border: `2px solid ${dev.nivel.cor}44`,
                          borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "18px"
                        }}>{dev.avatar}</div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <strong style={{ fontSize: "14px" }}>{dev.nome}</strong>
                            <span style={{
                              fontSize: "10px", fontWeight: "800",
                              padding: "2px 8px", borderRadius: "20px",
                              backgroundColor: `${dev.nivel.cor}18`,
                              color: dev.nivel.cor,
                              border: `1px solid ${dev.nivel.cor}33`
                            }}>{dev.nivel.emoji} {dev.nivel.label}</span>
                          </div>
                          <span style={{ fontSize: "11px", color: colors.textSecondary }}>{dev.email}</span>

                          {/* Barra de XP */}
                          <div style={{ marginTop: "6px", height: "4px", backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{
                              height: "100%",
                              width: `${Math.min((dev.totalXP / 1000) * 100, 100)}%`,
                              backgroundColor: dev.nivel.cor,
                              borderRadius: "4px",
                              transition: "width 0.8s ease"
                            }} />
                          </div>
                        </div>

                        {/* XP + Média */}
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: "16px", fontWeight: "900", color: dev.nivel.cor }}>
                            {dev.totalXP} XP
                          </div>
                          <div style={{ fontSize: "11px", color: colors.textSecondary, fontWeight: "600" }}>
                            Média: {dev.mediaGeral}
                          </div>
                          <div style={{ fontSize: "10px", color: colors.textSecondary }}>
                            {dev.provasFeitas} prova{dev.provasFeitas !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                    ))}

                    {rankingOrdenado.length === 0 && (
                      <div style={{
                        backgroundColor: colors.bgCard,
                        border: `1px solid ${colors.borderCard}`,
                        borderRadius: "18px", padding: "48px 20px",
                        textAlign: "center", color: colors.textSecondary
                      }}>
                        <span style={{ fontSize: "40px", display: "block", marginBottom: "12px" }}>🏆</span>
                        <h3 style={{ fontSize: "16px", fontWeight: "800", color: colors.textPrimary, marginBottom: "4px" }}>
                          Ranking vazio por enquanto!
                        </h3>
                        <p style={{ fontSize: "13px" }}>Nenhum dev encontrado com esses critérios.</p>
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}

            {/* ABA 4: NOTAS DAS PROVAS COM LANÇAMENTO ADMIN */}
            {abaAtiva === "notas" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: "800" }}>📝 Relatório de Notas das Provas</h2>
                    <p style={{ color: colors.textSecondary, fontSize: "13px", marginTop: "2px" }}>
                      Desempenho individual dos estudantes nas avaliações teóricas e práticas.
                    </p>
                  </div>

                  {isAdmin && (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => {
                          if (confirm("Tem certeza que deseja limpar todas as notas antigas de teste do relatório?")) {
                            setNotasProvas([]);
                            try {
                              localStorage.setItem("devhub_notas_provas", JSON.stringify([]));
                            } catch (e) {}
                          }
                        }}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "12px",
                          backgroundColor: isDark ? "rgba(239, 68, 68, 0.15)" : "#FEE2E2",
                          color: "#EF4444",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          fontWeight: "700",
                          fontSize: "13px",
                          cursor: "pointer"
                        }}
                      >
                        🗑️ Resetar Notas Antigas
                      </button>

                      <button
                        onClick={handleAbrirNovaProva}
                        style={{
                          padding: "10px 18px",
                          borderRadius: "12px",
                          backgroundColor: "#A855F7",
                          color: "#FFF",
                          border: "none",
                          fontWeight: "700",
                          fontSize: "13px",
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(168, 85, 247, 0.3)"
                        }}
                      >
                        ➕ Lançar Nota de Prova
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <input
                    type="text"
                    placeholder="🔍 Buscar aluno por nome ou e-mail..."
                    value={buscaAluno}
                    onChange={(e) => setBuscaAluno(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: `1px solid ${colors.borderCard}`,
                      backgroundColor: colors.inputBg,
                      color: colors.textPrimary,
                      fontSize: "14px"
                    }}
                  />
                </div>

                {(() => {
                  const listaProvasRealizadas = notasProvasFiltradas;

                  if (listaProvasRealizadas.length === 0) {
                    return (
                      <div style={{
                        backgroundColor: colors.bgCard,
                        border: `1px solid ${colors.borderCard}`,
                        borderRadius: "18px",
                        padding: "45px 20px",
                        textAlign: "center",
                        color: colors.textSecondary
                      }}>
                        <span style={{ fontSize: "38px", display: "block", marginBottom: "12px" }}>📊</span>
                        <h3 style={{ fontSize: "16px", fontWeight: "800", color: colors.textPrimary, marginBottom: "4px" }}>
                          Nenhuma Nota de Prova Registrada
                        </h3>
                        <p style={{ fontSize: "13px", maxWidth: "460px", margin: "0 auto" }}>
                          As notas dos estudantes aparecerão nesta tabela automaticamente assim que as provas forem sendo realizadas no sistema!
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div style={{
                      backgroundColor: colors.bgCard,
                      border: `1px solid ${colors.borderCard}`,
                      borderRadius: "16px",
                      overflow: "hidden"
                    }}>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                          <thead>
                            <tr style={{ backgroundColor: isDark ? "#1E293B" : "#F1F5F9", borderBottom: `1px solid ${colors.borderCard}` }}>
                              <th style={{ padding: "12px 16px" }}>Aluno</th>
                              <th style={{ padding: "12px 16px" }}>Prova Realizada</th>
                              <th style={{ padding: "12px 16px" }}>Nota Obtida</th>
                              <th style={{ padding: "12px 16px" }}>Status</th>
                              <th style={{ padding: "12px 16px" }}>Data de Realização</th>
                              {isAdmin && <th style={{ padding: "12px 16px" }}>Ações (Admin)</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {listaProvasRealizadas.map((nota) => {
                              const valorNota = nota.nota !== undefined && nota.nota !== null ? parseFloat(nota.nota) : (nota.prova1 !== undefined ? parseFloat(nota.prova1) : 0);
                              const titulo = nota.provaTitulo || nota.ultimaProvaTitulo || "Prova do Sistema";
                              const dataStr = nota.dataRealizacao || nota.dataConclusao || "Hoje";

                              return (
                                <tr key={nota.id} style={{ borderBottom: `1px solid ${colors.borderCard}` }}>
                                  <td style={{ padding: "14px 16px" }}>
                                    <strong style={{ display: "block" }}>{nota.alunoNome}</strong>
                                    <span style={{ fontSize: "11px", color: colors.textSecondary }}>{nota.email}</span>
                                  </td>

                                  <td style={{ padding: "14px 16px" }}>
                                    <span style={{
                                      fontSize: "12px",
                                      fontWeight: "700",
                                      padding: "4px 10px",
                                      borderRadius: "6px",
                                      backgroundColor: "rgba(168, 85, 247, 0.15)",
                                      color: "#A855F7",
                                      border: "1px solid rgba(168, 85, 247, 0.3)"
                                    }}>
                                      ✍️ {titulo}
                                    </span>
                                  </td>

                                  <td style={{ padding: "14px 16px" }}>
                                    <strong style={{ fontSize: "16px", color: valorNota >= 7 ? "#10B981" : "#EF4444" }}>
                                      {valorNota.toFixed(1)} <span style={{ fontSize: "12px", color: colors.textSecondary, fontWeight: "normal" }}>/ 10</span>
                                    </strong>
                                  </td>

                                  <td style={{ padding: "14px 16px" }}>
                                    <span style={{
                                      fontSize: "11px",
                                      fontWeight: "800",
                                      padding: "4px 8px",
                                      borderRadius: "6px",
                                      backgroundColor: valorNota >= 9.5 ? "rgba(168, 85, 247, 0.15)" : valorNota >= 7 ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                                      color: valorNota >= 9.5 ? "#A855F7" : valorNota >= 7 ? "#10B981" : "#EF4444",
                                      border: valorNota >= 9.5 ? "1px solid rgba(168, 85, 247, 0.3)" : valorNota >= 7 ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)"
                                    }}>
                                      {nota.status || (valorNota >= 9.5 ? "Excelente 🌟" : valorNota >= 7 ? "Bom 👍" : "Ruim ❌")}
                                    </span>
                                  </td>

                                  <td style={{ padding: "14px 16px", color: colors.textSecondary, fontSize: "12px" }}>
                                    📅 {dataStr}
                                  </td>

                                  {isAdmin && (
                                    <td style={{ padding: "14px 16px" }}>
                                      <div style={{ display: "flex", gap: "6px" }}>
                                        <button
                                          onClick={() => handleAbrirEditarProva(nota)}
                                          title="Editar Nota"
                                          style={{
                                            padding: "6px 10px",
                                            borderRadius: "6px",
                                            backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0",
                                            color: colors.textPrimary,
                                            border: `1px solid ${colors.borderCard}`,
                                            cursor: "pointer",
                                            fontSize: "12px"
                                          }}
                                        >
                                          ✏️
                                        </button>
                                        <button
                                          onClick={() => handleExcluirProva(nota.id)}
                                          title="Excluir Registro"
                                          style={{
                                            padding: "6px 10px",
                                            borderRadius: "6px",
                                            backgroundColor: "rgba(239, 68, 68, 0.15)",
                                            color: "#EF4444",
                                            border: "1px solid rgba(239, 68, 68, 0.3)",
                                            cursor: "pointer",
                                            fontSize: "12px"
                                          }}
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ABA 5: SISTEMA DE PROVAS ONLINE / AVALIAÇÕES */}
            {abaAtiva === "provas-online" && (() => {
              const hoje = new Date();
              const diaSemanaHoje = hoje.getDay();
              const provaDoDia = PROVAS_DIARIAS.find(p => p.diaSemana === diaSemanaHoje);
              const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

              // Função helper para renderizar card de prova (usada tanto para provas diárias quanto do sistema)
              const renderCardProva = (prova, isDiaria = false) => {
                const ehPdf = prova.tipo === "pdf";
                const partesData = prova.dataLimite ? prova.dataLimite.split("/") : ["2099","12","31"];
                const dataExp = prova.dataLimite
                  ? new Date(`${partesData[2]}-${partesData[1]}-${partesData[0]}T23:59:59`)
                  : new Date("2099-12-31");
                const expirada = new Date() > dataExp;
                const provaJaRealizada = user && provasConcluidas.some(c =>
                  c.provaId === prova.id && (c.userId === user.id || (c.userEmail && c.userEmail.toLowerCase() === user.email.toLowerCase()))
                );
                const registroConclusao = user ? provasConcluidas.find(c =>
                  c.provaId === prova.id && (c.userId === user.id || (c.userEmail && c.userEmail.toLowerCase() === user.email.toLowerCase()))
                ) : null;

                return (
                  <div
                    key={prova.id}
                    style={{
                      backgroundColor: colors.bgCard,
                      border: `1px solid ${isDiaria && !isDiaria._small ? "rgba(168,85,247,0.35)" : colors.borderCard}`,
                      borderRadius: "18px",
                      padding: "22px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    {/* Glow sutil para provas diárias */}
                    {isDiaria && (
                      <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                        background: "linear-gradient(90deg, #a855f7, #ec4899, #a855f7)",
                        borderRadius: "18px 18px 0 0"
                      }} />
                    )}

                    <div>
                      {/* Header do card */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                          {expirada ? (
                            <span style={{ fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "8px", backgroundColor: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.4)" }}>⌛ Encerrada</span>
                          ) : provaJaRealizada ? (
                            <span style={{ fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "8px", backgroundColor: "rgba(168,85,247,0.15)", color: "#A855F7", border: "1px solid rgba(168,85,247,0.4)" }}>🔒 Realizada & Trancada</span>
                          ) : (
                            <span style={{ fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "8px", backgroundColor: "rgba(16,185,129,0.15)", color: "#10B981", border: "1px solid rgba(16,185,129,0.4)" }}>🟢 Disponível</span>
                          )}
                          {ehPdf && (
                            <span style={{ fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "8px", backgroundColor: "rgba(251,146,60,0.15)", color: "#FB923C", border: "1px solid rgba(251,146,60,0.4)" }}>📄 PDF</span>
                          )}
                          {isDiaria && (
                            <span style={{ fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "8px", backgroundColor: "rgba(168,85,247,0.15)", color: "#A855F7", border: "1px solid rgba(168,85,247,0.4)" }}>🤖 Sistema</span>
                          )}
                        </div>
                        <span style={{ fontSize: "12px", color: colors.textSecondary, fontWeight: "600" }}>
                          ⏱️ {prova.duracaoMinutos} min
                        </span>
                      </div>

                      <h3 style={{ fontSize: "17px", fontWeight: "800", marginBottom: "8px" }}>{prova.titulo}</h3>
                      <p style={{ fontSize: "13px", color: colors.textSecondary, marginBottom: "14px", lineHeight: "1.5" }}>{prova.descricao}</p>

                      <div style={{ fontSize: "12px", color: colors.textSecondary, backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9", padding: "10px 12px", borderRadius: "10px", marginBottom: "16px" }}>
                        {prova.dataLimite && <div>📅 <strong>Validade:</strong> {prova.dataLimite} às {prova.horarioLimite}</div>}
                        {ehPdf
                          ? <div>📄 <strong>Arquivo:</strong> {prova.pdfNome || "prova.pdf"}</div>
                          : <div>❓ <strong>Questões:</strong> {prova.questoes.length} perguntas</div>
                        }
                        <div style={{ marginTop: "4px", fontSize: "11px", color: "#A855F7" }}>👑 <strong>Criado por:</strong> {prova.criadoPor}</div>
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      {ehPdf ? (
                        <button
                          onClick={() => {
                            if (prova.pdfData) {
                              const win = window.open();
                              win.document.write(`<iframe src="${prova.pdfData}" style="width:100%;height:100vh;border:none;"></iframe>`);
                            }
                          }}
                          style={{
                            flex: 1, padding: "12px", borderRadius: "10px",
                            background: "linear-gradient(135deg,#FB923C,#F97316)",
                            color: "#FFFFFF", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer"
                          }}
                        >
                          📄 Abrir Prova em PDF
                        </button>
                      ) : (
                        <button
                          disabled={expirada || provaJaRealizada}
                          onClick={() => handleIniciarProvaOnline(prova)}
                          style={{
                            flex: 1, padding: "12px", borderRadius: "10px",
                            backgroundColor: (expirada || provaJaRealizada) ? (isDark ? "rgba(255,255,255,0.06)" : "#CBD5E1") : "#EC4899",
                            color: (expirada || provaJaRealizada) ? colors.textSecondary : "#FFFFFF",
                            border: "none", fontWeight: "700", fontSize: "13px",
                            cursor: (expirada || provaJaRealizada) ? "not-allowed" : "pointer"
                          }}
                        >
                          {expirada ? "🔒 Prova Expirada" : provaJaRealizada ? `🔒 Concluída (Nota: ${registroConclusao ? registroConclusao.nota : "?"})` : "✍️ Realizar Prova Agora"}
                        </button>
                      )}

                      {isSuperAdmin && !isDiaria && (
                        <button
                          onClick={() => handleExcluirProvaSuperAdmin(prova.id)}
                          title="Excluir Prova"
                          style={{ padding: "12px", borderRadius: "10px", backgroundColor: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)", cursor: "pointer", fontSize: "13px" }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                );
              };

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

                  {/* ===== HEADER DA SEÇÃO ===== */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <h2 style={{ fontSize: "22px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        ✍️ Sistema de Avaliações & Provas
                      </h2>
                      <p style={{ color: colors.textSecondary, fontSize: "13px" }}>
                        Provas automáticas por dia da semana + provas criadas pelos administradores
                      </p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={handleAbrirCriarProvaSuperAdmin}
                        style={{
                          padding: "11px 22px", borderRadius: "12px",
                          background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
                          color: "#FFF", border: "none", fontWeight: "700", fontSize: "13px",
                          cursor: "pointer", boxShadow: "0 4px 16px rgba(168,85,247,0.4)",
                          display: "flex", alignItems: "center", gap: "8px"
                        }}
                      >
                        <span>➕</span> Criar Prova
                      </button>
                    )}
                  </div>

                  {/* ===== SEÇÃO: PROVA DO DIA ===== */}
                  <div>
                    {/* Título da seção */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <div style={{ width: "4px", height: "24px", background: "linear-gradient(180deg,#a855f7,#ec4899)", borderRadius: "4px" }} />
                      <h3 style={{ fontSize: "17px", fontWeight: "800" }}>🗓️ Prova do Dia</h3>
                      <span style={{
                        fontSize: "10px", fontWeight: "900", padding: "3px 10px", borderRadius: "20px",
                        background: "linear-gradient(135deg,#a855f7,#ec4899)", color: "#FFF",
                        letterSpacing: "0.5px", animation: "pulse 2s infinite"
                      }}>HOJE</span>
                    </div>

                    {/* Calendário semanal */}
                    <div style={{ display: "flex", gap: "8px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
                      {PROVAS_DIARIAS.map((p) => {
                        const isHoje = p.diaSemana === diaSemanaHoje;
                        return (
                          <div
                            key={p.id}
                            style={{
                              minWidth: "70px",
                              padding: "10px 6px",
                              borderRadius: "12px",
                              textAlign: "center",
                              border: isHoje ? "2px solid #a855f7" : `1px solid ${colors.borderCard}`,
                              backgroundColor: isHoje ? "rgba(168,85,247,0.12)" : colors.bgCard,
                              cursor: "default",
                              flexShrink: 0,
                              transition: "all 0.2s"
                            }}
                          >
                            <div style={{ fontSize: "18px", marginBottom: "4px" }}>{p.emoji}</div>
                            <div style={{ fontSize: "11px", fontWeight: "800", color: isHoje ? "#A855F7" : colors.textSecondary }}>{diasSemana[p.diaSemana]}</div>
                            <div style={{ fontSize: "10px", color: isHoje ? "#A855F7" : colors.textSecondary, marginTop: "2px", lineHeight: "1.2" }}>{p.tema.split(" ").slice(0, 2).join(" ")}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Card destaque da prova de hoje */}
                    {provaDoDia && (
                      <div style={{
                        background: isDark
                          ? "linear-gradient(135deg, rgba(168,85,247,0.18) 0%, rgba(236,72,153,0.10) 100%)"
                          : "linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(236,72,153,0.05) 100%)",
                        border: "1.5px solid rgba(168,85,247,0.35)",
                        borderRadius: "20px",
                        padding: "28px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        position: "relative",
                        overflow: "hidden"
                      }}>
                        {/* Barra de gradiente no topo */}
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #a855f7, #ec4899, #a855f7)" }} />

                        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
                          {/* Ícone grande */}
                          <div style={{
                            width: "72px", height: "72px", flexShrink: 0,
                            background: "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(236,72,153,0.15))",
                            border: "2px solid rgba(168,85,247,0.4)",
                            borderRadius: "20px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "36px"
                          }}>
                            {provaDoDia.emoji}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                              <span style={{
                                fontSize: "11px", fontWeight: "900", padding: "3px 12px", borderRadius: "20px",
                                background: "linear-gradient(135deg,#a855f7,#ec4899)", color: "#FFF", letterSpacing: "0.5px"
                              }}>✨ PROVA DO DIA</span>
                              <span style={{ fontSize: "12px", color: colors.textSecondary }}>⏱️ {provaDoDia.duracaoMinutos} min</span>
                              <span style={{ fontSize: "12px", color: colors.textSecondary }}>❓ {provaDoDia.questoes.length} questões</span>
                            </div>
                            <h3 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "8px" }}>{provaDoDia.titulo}</h3>
                            <p style={{ fontSize: "14px", color: colors.textSecondary, lineHeight: "1.6", maxWidth: "600px" }}>{provaDoDia.descricao}</p>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                          {(() => {
                            const jaFezHoje = user && provasConcluidas.some(c =>
                              c.provaId === provaDoDia.id && (c.userId === user.id || (c.userEmail && c.userEmail.toLowerCase() === user.email.toLowerCase()))
                            );
                            const regHoje = user ? provasConcluidas.find(c =>
                              c.provaId === provaDoDia.id && (c.userId === user.id || (c.userEmail && c.userEmail.toLowerCase() === user.email.toLowerCase()))
                            ) : null;
                            return (
                              <button
                                disabled={jaFezHoje}
                                onClick={() => handleIniciarProvaOnline(provaDoDia)}
                                style={{
                                  padding: "13px 32px",
                                  borderRadius: "12px",
                                  background: jaFezHoje ? (isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0") : "linear-gradient(135deg,#EC4899,#a855f7)",
                                  color: jaFezHoje ? colors.textSecondary : "#FFF",
                                  border: "none", fontWeight: "800", fontSize: "14px",
                                  cursor: jaFezHoje ? "not-allowed" : "pointer",
                                  boxShadow: jaFezHoje ? "none" : "0 6px 20px rgba(236,72,153,0.4)",
                                  transition: "all 0.2s"
                                }}
                              >
                                {jaFezHoje ? `🔒 Concluída hoje! (Nota: ${regHoje ? regHoje.nota : "?"})` : "🚀 Fazer a Prova do Dia"}
                              </button>
                            );
                          })()}
                          <span style={{ fontSize: "12px", color: colors.textSecondary }}>🤖 Gerada automaticamente pelo sistema DevHub</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ===== SEÇÃO: PRÓXIMAS PROVAS DO SISTEMA ===== */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <div style={{ width: "4px", height: "24px", background: "linear-gradient(180deg,#10B981,#3B82F6)", borderRadius: "4px" }} />
                      <h3 style={{ fontSize: "17px", fontWeight: "800" }}>📅 Provas da Semana</h3>
                      <span style={{ fontSize: "12px", color: colors.textSecondary }}>— temas por dia</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
                      {PROVAS_DIARIAS.filter(p => p.diaSemana !== diaSemanaHoje).map(prova => renderCardProva(prova, true))}
                    </div>
                  </div>

                  {/* ===== SEÇÃO: PROVAS DO SISTEMA (CRIADAS PELOS ADMINS) ===== */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <div style={{ width: "4px", height: "24px", background: "linear-gradient(180deg,#F59E0B,#EF4444)", borderRadius: "4px" }} />
                      <h3 style={{ fontSize: "17px", fontWeight: "800" }}>👑 Provas do Sistema</h3>
                      <span style={{ fontSize: "12px", color: colors.textSecondary }}>— criadas pelos administradores</span>
                    </div>

                    {provasSistema.length === 0 ? (
                      <div style={{
                        backgroundColor: colors.bgCard, border: `1px dashed ${colors.borderCard}`,
                        borderRadius: "18px", padding: "40px 20px", textAlign: "center", color: colors.textSecondary
                      }}>
                        <span style={{ fontSize: "36px", display: "block", marginBottom: "12px" }}>📋</span>
                        <h3 style={{ fontSize: "16px", fontWeight: "800", color: colors.textPrimary, marginBottom: "6px" }}>
                          Nenhuma Prova Publicada pelo Admin
                        </h3>
                        <p style={{ fontSize: "13px", maxWidth: "450px", margin: "0 auto" }}>
                          {isAdmin
                            ? "Use o botão \"Criar Prova\" acima para publicar uma prova com questões ou em PDF."
                            : "Fique atento! Provas especiais serão publicadas aqui pelos administradores."}
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                        {provasSistema.map(prova => renderCardProva(prova, false))}
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}

            {/* ABA: PAINEL SUPER ADMIN VIP */}
            {abaAtiva === "super_admin" && (
              <SuperAdminModule isDark={isDark} colors={colors} currentUser={user} />
            )}

            {/* ABA: BATALHA DE CÓDIGO 1v1 */}
            {abaAtiva === "batalhas" && (
              <BatalhaCodigoModule user={user} relatorioAlunos={relatorioAlunos} />
            )}

            {/* ABA: DEV IA — ASSISTENTE DE ESTUDOS DE PROGRAMAÇÃO */}
            {abaAtiva === "dev_ia" && (
              <DevIaModule user={user} />
            )}

          </main>
        </div>

        {/* MODAL INTERATIVO DE PERFIL DO USUÁRIO & FOTO */}
        <PerfilModal
          isOpen={modalPerfilOpen}
          onClose={() => setModalPerfilOpen(false)}
          user={user}
          onUpdateUser={(updatedUser) => setUser(updatedUser)}
          onLogout={handleLogout}
        />

        {/* MODAL DE AGENDAMENTO (ADMIN ONLY) */}
        {modalAgendaOpen && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}>
            <div style={{
              backgroundColor: isDark ? "rgba(17, 24, 39, 0.95)" : "#FFFFFF",
              color: colors.textPrimary,
              maxWidth: "520px",
              width: "100%",
              borderRadius: "24px",
              padding: "30px",
              border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "#E2E8F0"}`,
              boxShadow: isDark ? "0 25px 50px rgba(0, 0, 0, 0.6)" : "0 20px 40px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(16px)",
              position: "relative"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
                <div>
                  <h3 style={{ fontSize: "19px", fontWeight: "800", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    {aulaEmEdicaoId ? "✏️ Editar Reunião" : `📅 Agendar Nova Reunião`}
                  </h3>
                  <span style={{ fontSize: "12px", color: colors.textSecondary, marginTop: "2px", display: "block" }}>
                    Data selecionada: <strong style={{ color: "#3B82F6" }}>{formData}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setModalAgendaOpen(false)}
                  style={{
                    border: "none",
                    backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9",
                    color: colors.textPrimary,
                    width: "32px", height: "32px",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", cursor: "pointer"
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSalvarAgendamento} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em", color: colors.textSecondary, marginBottom: "6px" }}>
                    Título da Reunião / Aula
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: DEVHUB - AULA 6 - DEPLOY EM PRODUÇÃO"
                    value={formTitulo}
                    onChange={(e) => setFormTitulo(e.target.value)}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: "12px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "13.5px", outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em", color: colors.textSecondary, marginBottom: "6px" }}>
                    Descrição Resumida
                  </label>
                  <input
                    type="text"
                    placeholder="Resumo da pauta ou assunto da reunião..."
                    value={formDescricao}
                    onChange={(e) => setFormDescricao(e.target.value)}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: "12px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "13.5px", outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em", color: colors.textSecondary, marginBottom: "6px" }}>
                    👨‍🏫 Instrutor / Condutor
                  </label>
                  <select
                    value={formInstrutor}
                    onChange={(e) => setFormInstrutor(e.target.value)}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: "12px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "13.5px", fontWeight: "600",
                      cursor: "pointer", outline: "none"
                    }}
                  >
                    {listaAdmins.map((adminNome, idx) => (
                      <option key={idx} value={adminNome}>
                        {adminNome}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {/* SELETOR VISUAL DE DATA */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em", color: colors.textSecondary, marginBottom: "6px" }}>
                      📅 Data da Reunião
                    </label>
                    <input
                      type="date"
                      required
                      value={toIsoDate(formData)}
                      onChange={(e) => {
                        const br = toBrDate(e.target.value);
                        if (br) setFormData(br);
                      }}
                      style={{
                        width: "100%", padding: "11px 12px", borderRadius: "12px",
                        border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                        color: colors.textPrimary, fontSize: "13px", fontWeight: "600",
                        cursor: "pointer", outline: "none"
                      }}
                    />
                  </div>

                  {/* SELETOR DE HORÁRIOS AUTOMÁTICOS */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em", color: colors.textSecondary, marginBottom: "6px" }}>
                      ⏰ Horário (Início / Fim)
                    </label>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <input
                        type="time"
                        value={formHoraInicio}
                        onChange={(e) => {
                          setFormHoraInicio(e.target.value);
                          setFormHorario(`${e.target.value} - ${formHoraFim}`);
                        }}
                        style={{
                          flex: 1, padding: "11px 8px", borderRadius: "12px",
                          border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                          color: colors.textPrimary, fontSize: "12.5px", fontWeight: "700", outline: "none"
                        }}
                      />
                      <span style={{ fontSize: "11px", color: colors.textSecondary, fontWeight: "700" }}>até</span>
                      <input
                        type="time"
                        value={formHoraFim}
                        onChange={(e) => {
                          setFormHoraFim(e.target.value);
                          setFormHorario(`${formHoraInicio} - ${e.target.value}`);
                        }}
                        style={{
                          flex: 1, padding: "11px 8px", borderRadius: "12px",
                          border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                          color: colors.textPrimary, fontSize: "12.5px", fontWeight: "700", outline: "none"
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em", color: colors.textSecondary, marginBottom: "6px" }}>
                    🔗 Link da Reunião (Google Meet / Zoom / YouTube)
                  </label>
                  <input
                    type="url"
                    placeholder="Cole o link aqui (ex: https://meet.google.com/...)"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: "12px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "13.5px", outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em", color: colors.textSecondary, marginBottom: "6px" }}>
                    Status da Reunião
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: "12px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "13.5px", fontWeight: "600",
                      cursor: "pointer", outline: "none"
                    }}
                  >
                    <option value="Agendada 📅">Agendada 📅</option>
                    <option value="Ao Vivo 🔴">Ao Vivo 🔴 (Acontecendo Agora)</option>
                    <option value="Concluída ✅">Concluída ✅</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setModalAgendaOpen(false)}
                    style={{
                      flex: 1, padding: "12px", borderRadius: "12px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: "transparent",
                      color: colors.textPrimary, fontWeight: "700", cursor: "pointer"
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    style={{
                      flex: 1, padding: "12px", borderRadius: "12px",
                      border: "none",
                      background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                      color: "#FFFFFF", fontWeight: "800", cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(59, 130, 246, 0.35)"
                    }}
                  >
                    Salvar Reunião
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DE ADICIONAR / EDITAR NOTAS DAS PROVAS (ADMIN) */}
        {modalProvaOpen && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}>
            <div style={{
              backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
              color: colors.textPrimary,
              maxWidth: "500px",
              width: "100%",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              position: "relative"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800" }}>
                  {provaEmEdicaoId ? "✏️ Editar Nota de Prova" : "📝 Lançar Nova Nota de Prova"}
                </h3>
                <button
                  onClick={() => setModalProvaOpen(false)}
                  style={{
                    border: "none", backgroundColor: "transparent",
                    color: colors.textPrimary, fontSize: "18px", cursor: "pointer"
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSalvarProva} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>Nome do Estudante</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Silva"
                    value={formProvaAlunoNome}
                    onChange={(e) => setFormProvaAlunoNome(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: "8px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "13px"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>E-mail do Estudante</label>
                  <input
                    type="email"
                    required
                    placeholder="carlos@empresa.com"
                    value={formProvaEmail}
                    onChange={(e) => setFormProvaEmail(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: "8px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "13px"
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", marginBottom: "4px" }}>Backend (P1)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      required
                      value={formProvaP1}
                      onChange={(e) => setFormProvaP1(e.target.value)}
                      style={{
                        width: "100%", padding: "10px 8px", borderRadius: "8px",
                        border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                        color: colors.textPrimary, fontSize: "13px", fontWeight: "700"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", marginBottom: "4px" }}>Frontend (P2)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      required
                      value={formProvaP2}
                      onChange={(e) => setFormProvaP2(e.target.value)}
                      style={{
                        width: "100%", padding: "10px 8px", borderRadius: "8px",
                        border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                        color: colors.textPrimary, fontSize: "13px", fontWeight: "700"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", marginBottom: "4px" }}>Projeto Final</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      required
                      value={formProvaProjeto}
                      onChange={(e) => setFormProvaProjeto(e.target.value)}
                      style={{
                        width: "100%", padding: "10px 8px", borderRadius: "8px",
                        border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                        color: colors.textPrimary, fontSize: "13px", fontWeight: "700"
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setModalProvaOpen(false)}
                    style={{
                      flex: 1, padding: "12px", borderRadius: "10px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: "transparent",
                      color: colors.textPrimary, fontWeight: "600", cursor: "pointer"
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    style={{
                      flex: 1, padding: "12px", borderRadius: "10px",
                      border: "none", backgroundColor: "#A855F7",
                      color: "#FFFFFF", fontWeight: "700", cursor: "pointer"
                    }}
                  >
                    Salvar Nota
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DE ESTUDO DE AULA */}
        {categoriaAtiva && (() => {
          const temSlides = categoriaAtiva.slides && categoriaAtiva.slides.length > 0;
          const slideAtual = categoriaAtiva._slideIdx || 0;
          const totalSlides = temSlides ? categoriaAtiva.slides.length : 0;
          const slide = temSlides ? categoriaAtiva.slides[slideAtual] : null;

          const irParaSlide = (idx) => {
            setCategoriaAtiva({ ...categoriaAtiva, _slideIdx: idx });
          };

          return (
            <div style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              backdropFilter: "blur(8px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}>
              <div style={{
                backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                color: colors.textPrimary,
                maxWidth: temSlides ? "700px" : "650px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                borderRadius: "24px",
                padding: "32px",
                position: "relative",
                boxShadow: "0 30px 60px rgba(0,0,0,0.5)"
              }}>
                {/* Botão Fechar */}
                <button
                  onClick={() => setCategoriaAtiva(null)}
                  style={{
                    position: "absolute", top: "18px", right: "18px",
                    border: "none", backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
                    color: colors.textPrimary, fontSize: "16px", cursor: "pointer",
                    borderRadius: "50%", width: "32px", height: "32px",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                >✕</button>

                {/* Header do modal */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                  <span style={{ fontSize: "30px" }}>{categoriaAtiva.icone}</span>
                  <div>
                    <h2 style={{ fontSize: "22px", fontWeight: "800", margin: 0 }}>{categoriaAtiva.titulo}</h2>
                    <p style={{ fontSize: "13px", color: colors.textSecondary, margin: "2px 0 0 0" }}>{categoriaAtiva.subtitulo}</p>
                  </div>
                </div>

                {/* ===== MODO SLIDES ===== */}
                {temSlides && slide ? (
                  <div>
                    {/* Indicador de progresso */}
                    <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
                      {categoriaAtiva.slides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => irParaSlide(idx)}
                          style={{
                            flex: 1, height: "4px", borderRadius: "4px", border: "none",
                            backgroundColor: idx === slideAtual ? slide.cor : (isDark ? "rgba(255,255,255,0.15)" : "#E2E8F0"),
                            cursor: "pointer", transition: "background 0.3s"
                          }}
                        />
                      ))}
                    </div>

                    {/* Número do slide */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <span style={{ fontSize: "12px", color: colors.textSecondary, fontWeight: "600" }}>
                        Aula {slideAtual + 1} de {totalSlides}
                      </span>
                      <span style={{
                        fontSize: "11px", fontWeight: "800", padding: "3px 10px", borderRadius: "20px",
                        backgroundColor: `${slide.cor}22`, color: slide.cor, border: `1px solid ${slide.cor}44`
                      }}>
                        {slide.emoji} {slide.titulo}
                      </span>
                    </div>

                    {/* Título do slide */}
                    <h3 style={{
                      fontSize: "26px", fontWeight: "900", marginBottom: "12px",
                      background: `linear-gradient(135deg, ${slide.cor}, ${slide.cor}99)`,
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                    }}>
                      {slide.titulo}
                    </h3>

                    {/* Descrição */}
                    <p style={{
                      fontSize: "15px", lineHeight: "1.7", color: colors.textSecondary,
                      marginBottom: "20px", padding: "14px 16px",
                      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F8FAFC",
                      borderRadius: "12px", borderLeft: `3px solid ${slide.cor}`
                    }}>
                      {slide.descricao}
                    </p>

                    {/* Tópicos */}
                    <div style={{ marginBottom: "20px" }}>
                      <h4 style={{ fontSize: "13px", fontWeight: "800", color: slide.cor, marginBottom: "10px" }}>
                        📌 O que você vai aprender:
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {slide.topicos.map((topico, i) => (
                          <div key={i} style={{
                            display: "flex", alignItems: "flex-start", gap: "10px",
                            padding: "10px 14px", borderRadius: "10px",
                            backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9",
                            fontSize: "14px", fontWeight: "500"
                          }}>
                            {topico}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exemplo de código */}
                    {slide.exemplo && (
                      <div style={{ marginBottom: "24px" }}>
                        <h4 style={{ fontSize: "13px", fontWeight: "800", color: slide.cor, marginBottom: "8px" }}>
                          💻 Exemplo de Código:
                        </h4>
                        <pre style={{
                          backgroundColor: isDark ? "#0F172A" : "#1E293B",
                          color: "#E2E8F0",
                          padding: "16px", borderRadius: "12px",
                          fontSize: "13px", fontFamily: "monospace",
                          overflowX: "auto", lineHeight: "1.6",
                          border: `1px solid ${slide.cor}33`
                        }}>
                          {slide.exemplo}
                        </pre>
                      </div>
                    )}

                    {/* Navegação entre slides */}
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => irParaSlide(slideAtual - 1)}
                        disabled={slideAtual === 0}
                        style={{
                          flex: 1, padding: "12px", borderRadius: "12px",
                          border: `1px solid ${colors.borderCard}`, backgroundColor: "transparent",
                          color: slideAtual === 0 ? colors.textSecondary : colors.textPrimary,
                          fontWeight: "700", cursor: slideAtual === 0 ? "not-allowed" : "pointer",
                          opacity: slideAtual === 0 ? 0.4 : 1, fontSize: "14px"
                        }}
                      >
                        ← Anterior
                      </button>

                      {slideAtual < totalSlides - 1 ? (
                        <button
                          onClick={() => irParaSlide(slideAtual + 1)}
                          style={{
                            flex: 2, padding: "12px", borderRadius: "12px",
                            border: "none", backgroundColor: slide.cor, color: "#FFF",
                            fontWeight: "800", cursor: "pointer", fontSize: "14px"
                          }}
                        >
                          Próxima Aula →
                        </button>
                      ) : (
                        <button
                          onClick={() => setCategoriaAtiva(null)}
                          style={{
                            flex: 2, padding: "12px", borderRadius: "12px",
                            border: "none", background: `linear-gradient(135deg, ${slide.cor}, #3B82F6)`,
                            color: "#FFF", fontWeight: "800", cursor: "pointer", fontSize: "14px"
                          }}
                        >
                          🎉 Concluir Trilha!
                        </button>
                      )}
                    </div>

                    {/* Vídeos */}
                    {categoriaAtiva.videos && (
                      <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: `1px solid ${colors.borderCard}` }}>
                        <h4 style={{ fontSize: "13px", fontWeight: "700", color: "#3B82F6", marginBottom: "10px" }}>
                          🎥 Videoaulas Complementares:
                        </h4>
                        {categoriaAtiva.videos.map((v, i) => (
                          <a
                            key={i}
                            href={v.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "flex", justifyContent: "space-between", alignItems: "center",
                              padding: "12px 16px", borderRadius: "10px",
                              backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                              color: colors.textPrimary, textDecoration: "none",
                              fontWeight: "600", fontSize: "13px", marginBottom: "8px"
                            }}
                          >
                            <span>▶ {v.titulo}</span>
                            <span style={{ color: "#3B82F6" }}>Assistir →</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* ===== MODO SIMPLES (sem slides) ===== */
                  <div>
                    <p style={{ fontSize: "14px", color: colors.textSecondary, marginBottom: "20px" }}>
                      {categoriaAtiva.conteudo.introducao}
                    </p>

                    {categoriaAtiva.videos && (
                      <div style={{ marginBottom: "20px" }}>
                        <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#3B82F6", marginBottom: "10px" }}>
                          🎥 Transmissão & Vídeo:
                        </h4>
                        {categoriaAtiva.videos.map((v, i) => (
                          <a
                            key={i}
                            href={v.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "flex", justifyContent: "space-between", alignItems: "center",
                              padding: "12px 16px", borderRadius: "10px",
                              backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                              color: colors.textPrimary, textDecoration: "none",
                              fontWeight: "600", fontSize: "13px", marginBottom: "8px"
                            }}
                          >
                            <span>▶ {v.titulo}</span>
                            <span style={{ color: "#3B82F6" }}>Assistir →</span>
                          </a>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => setCategoriaAtiva(null)}
                      style={{
                        width: "100%", padding: "12px", borderRadius: "10px",
                        border: "none", backgroundColor: "#3B82F6", color: "#FFF",
                        fontWeight: "700", cursor: "pointer"
                      }}
                    >
                      Concluir Leitura 🚀
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })()}


        {/* MODAL REALIZAR PROVA (ESTUDANTES) */}
        {provaEmAndamento && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}>
            <div style={{
              backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
              color: colors.textPrimary,
              maxWidth: "650px",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              position: "relative"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#EC4899", fontWeight: "700" }}>✍️ Prova em Andamento</span>
                  <h3 style={{ fontSize: "19px", fontWeight: "800" }}>{provaEmAndamento.titulo}</h3>
                </div>
                <button
                  onClick={() => setProvaEmAndamento(null)}
                  style={{ border: "none", backgroundColor: "transparent", color: colors.textPrimary, fontSize: "18px", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEnviarProvaOnline} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {provaEmAndamento.questoes.map((q, idx) => (
                  <div key={q.id} style={{
                    backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                    border: `1px solid ${colors.borderCard}`,
                    borderRadius: "14px",
                    padding: "16px"
                  }}>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>
                      {idx + 1}. {q.pergunta}
                    </h4>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {q.opcoes.map((opcao, oIdx) => (
                        <label
                          key={oIdx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            border: `1px solid ${respostasUsuario[q.id] === oIdx ? "#EC4899" : colors.borderCard}`,
                            backgroundColor: respostasUsuario[q.id] === oIdx ? "rgba(236, 72, 153, 0.1)" : "transparent",
                            cursor: "pointer",
                            fontSize: "13px"
                          }}
                        >
                          <input
                            type="radio"
                            name={`questao-${q.id}`}
                            checked={respostasUsuario[q.id] === oIdx}
                            onChange={() => handleSelecionarResposta(q.id, oIdx)}
                            required
                          />
                          <span>{opcao}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setProvaEmAndamento(null)}
                    style={{
                      flex: 1, padding: "12px", borderRadius: "10px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: "transparent",
                      color: colors.textPrimary, fontWeight: "600", cursor: "pointer"
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    style={{
                      flex: 1, padding: "12px", borderRadius: "10px",
                      border: "none", backgroundColor: "#EC4899",
                      color: "#FFFFFF", fontWeight: "700", cursor: "pointer"
                    }}
                  >
                    📤 Finalizar e Enviar Prova
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL PROVA CONCLUÍDA COM CORREÇÃO EM TEMPO REAL */}
        {modalProvaConcluida && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}>
            <div style={{
              backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
              color: colors.textPrimary,
              maxWidth: "580px",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
            }}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <span style={{ fontSize: "44px", display: "block", marginBottom: "8px" }}>
                  {modalProvaConcluida.nota >= 7.0 ? "🎉" : "📚"}
                </span>
                <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "4px" }}>
                  Prova Concluída e Corrigida!
                </h3>
                <p style={{ fontSize: "13px", color: colors.textSecondary }}>
                  {modalProvaConcluida.titulo}
                </p>
              </div>

              {/* CARD DE NOTA E RESULTADO */}
              <div style={{
                backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                border: `1px solid ${colors.borderCard}`,
                borderRadius: "16px",
                padding: "20px",
                textAlign: "center",
                marginBottom: "24px"
              }}>
                <span style={{ fontSize: "12px", color: colors.textSecondary, fontWeight: "700", textTransform: "uppercase" }}>
                  🎯 Sua Nota Final (Lançada Automaticamente):
                </span>
                <div style={{ fontSize: "42px", fontWeight: "900", color: modalProvaConcluida.nota >= 7.0 ? "#10B981" : "#EF4444", margin: "4px 0" }}>
                  {modalProvaConcluida.nota} / 10
                </div>
                <div style={{ fontSize: "13px", color: colors.textSecondary, fontWeight: "600" }}>
                  Você acertou <strong>{modalProvaConcluida.acertos}</strong> de <strong>{modalProvaConcluida.total}</strong> questões.
                </div>
              </div>

              {/* CORREÇÃO DAS RESPOSTAS NA HORA */}
              <div style={{ marginBottom: "24px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#EC4899", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>⚡</span> Correção Detalhada em Tempo Real:
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {modalProvaConcluida.gabarito && modalProvaConcluida.gabarito.map((item, i) => (
                    <div
                      key={item.id || i}
                      style={{
                        padding: "14px",
                        borderRadius: "12px",
                        backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F1F5F9",
                        borderLeft: item.acertou ? "4px solid #10B981" : "4px solid #EF4444",
                        borderTop: `1px solid ${colors.borderCard}`,
                        borderRight: `1px solid ${colors.borderCard}`,
                        borderBottom: `1px solid ${colors.borderCard}`
                      }}
                    >
                      <h5 style={{ fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>
                        {i + 1}. {item.pergunta}
                      </h5>

                      <div style={{ fontSize: "12px", marginBottom: "4px" }}>
                        <span style={{ color: colors.textSecondary }}>Sua Resposta: </span>
                        <strong style={{ color: item.acertou ? "#10B981" : "#EF4444" }}>
                          {item.opcaoEscolhidaTexto} {item.acertou ? "✅" : "❌"}
                        </strong>
                      </div>

                      {!item.acertou && (
                        <div style={{ fontSize: "12px", color: "#10B981" }}>
                          <span>Resposta Correta: </span>
                          <strong>{item.opcaoCorretaTexto} ✅</strong>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTAO PARA NAVEGAR PARA O RELATORIO DE NOTAS */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => {
                    setModalProvaConcluida(null);
                    setAbaAtiva("notas");
                  }}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "12px",
                    border: "none", backgroundColor: "#A855F7", color: "#FFF",
                    fontWeight: "700", cursor: "pointer", fontSize: "13px",
                    boxShadow: "0 4px 12px rgba(168, 85, 247, 0.3)"
                  }}
                >
                  📊 Ver no Relatório de Notas
                </button>

                <button
                  onClick={() => setModalProvaConcluida(null)}
                  style={{
                    padding: "12px 18px", borderRadius: "12px",
                    border: `1px solid ${colors.borderCard}`, backgroundColor: "transparent",
                    color: colors.textPrimary, fontWeight: "600", cursor: "pointer", fontSize: "13px"
                  }}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL CRIAR PROVA — REDESENHADO COM ABAS */}
        {modalCriarProvaOpen && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)",
            zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
          }}>
            <div style={{
              backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
              color: colors.textPrimary,
              maxWidth: "640px", width: "100%",
              maxHeight: "90vh", overflowY: "auto",
              borderRadius: "24px",
              border: isDark ? "1px solid rgba(168,85,247,0.25)" : "1px solid rgba(168,85,247,0.15)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
              position: "relative"
            }}>
              {/* Barra de gradiente no topo */}
              <div style={{ height: "3px", background: "linear-gradient(90deg,#a855f7,#ec4899,#a855f7)", borderRadius: "24px 24px 0 0" }} />

              <div style={{ padding: "26px" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <div>
                    <h3 style={{ fontSize: "19px", fontWeight: "900", background: "linear-gradient(135deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      ➕ Criar Nova Prova
                    </h3>
                    <p style={{ fontSize: "12px", color: colors.textSecondary, marginTop: "2px" }}>Escolha o formato da prova abaixo</p>
                  </div>
                  <button
                    onClick={() => setModalCriarProvaOpen(false)}
                    style={{ border: "none", backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9", color: colors.textPrimary, fontSize: "16px", cursor: "pointer", borderRadius: "10px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >✕</button>
                </div>

                {/* ABAS: Questões / PDF */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "22px", backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#F8FAFC", borderRadius: "14px", padding: "4px" }}>
                  {[
                    { key: "questoes", label: "✍️ Criar com Questões", desc: "Adicione perguntas de múltipla escolha" },
                    { key: "pdf",      label: "📄 Upload de PDF",      desc: "Anexe uma prova já pronta em PDF" }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setModalModoProva(tab.key)}
                      style={{
                        flex: 1, padding: "10px 12px", borderRadius: "10px",
                        border: "none",
                        backgroundColor: modalModoProva === tab.key ? (isDark ? "#1E293B" : "#FFFFFF") : "transparent",
                        color: modalModoProva === tab.key ? "#A855F7" : colors.textSecondary,
                        fontWeight: modalModoProva === tab.key ? "800" : "600",
                        fontSize: "13px", cursor: "pointer",
                        boxShadow: modalModoProva === tab.key ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                        transition: "all 0.2s",
                        textAlign: "center"
                      }}
                    >
                      {tab.label}
                      <div style={{ fontSize: "10px", opacity: 0.7, marginTop: "2px", fontWeight: "400" }}>{tab.desc}</div>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSalvarNovaProvaSuperAdmin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {/* Campos comuns */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "5px" }}>📝 Título da Prova *</label>
                    <input
                      type="text" required
                      placeholder="Ex: Avaliação Final — Módulo Backend"
                      value={formCriarTitulo}
                      onChange={(e) => setFormCriarTitulo(e.target.value)}
                      style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "5px" }}>📋 Descrição & Instruções *</label>
                    <textarea
                      rows={2} required
                      placeholder="Descreva o que será cobrado e as instruções para os alunos..."
                      value={formCriarDescricao}
                      onChange={(e) => setFormCriarDescricao(e.target.value)}
                      style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "13px", resize: "vertical" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", marginBottom: "4px" }}>📅 Data Limite</label>
                      <input type="date" value={formCriarDataLimite} onChange={(e) => setFormCriarDataLimite(e.target.value)}
                        style={{ width: "100%", padding: "9px", borderRadius: "8px", border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "12px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", marginBottom: "4px" }}>⏰ Hora Limite</label>
                      <input type="time" value={formCriarHoraLimite} onChange={(e) => setFormCriarHoraLimite(e.target.value)}
                        style={{ width: "100%", padding: "9px", borderRadius: "8px", border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "12px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", marginBottom: "4px" }}>⏱️ Duração (min)</label>
                      <input type="number" min="5" max="360" value={formCriarDuracao} onChange={(e) => setFormCriarDuracao(e.target.value)}
                        style={{ width: "100%", padding: "9px", borderRadius: "8px", border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "12px" }}
                      />
                    </div>
                  </div>

                  {/* ===== MODO QUESTÕES ===== */}
                  {modalModoProva === "questoes" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "800", color: "#A855F7" }}>❓ Questões da Prova</label>
                        <button
                          type="button"
                          onClick={handleAdicionarPerguntaForm}
                          style={{ padding: "5px 12px", borderRadius: "8px", backgroundColor: "rgba(168,85,247,0.15)", color: "#A855F7", border: "1px solid rgba(168,85,247,0.3)", fontSize: "12px", cursor: "pointer", fontWeight: "700" }}
                        >+ Nova Questão</button>
                      </div>

                      {formCriarPerguntas.map((q, qIdx) => (
                        <div key={qIdx} style={{ padding: "16px", borderRadius: "14px", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", border: `1px solid ${colors.borderCard}`, marginBottom: "12px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <span style={{ fontSize: "12px", fontWeight: "900", color: "#A855F7", background: "rgba(168,85,247,0.12)", padding: "3px 10px", borderRadius: "8px" }}>
                              Pergunta #{qIdx + 1}
                            </span>
                            {formCriarPerguntas.length > 1 && (
                              <button type="button" onClick={() => setFormCriarPerguntas(prev => prev.filter((_, i) => i !== qIdx))}
                                style={{ border: "none", backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444", fontSize: "11px", cursor: "pointer", fontWeight: "700", padding: "4px 10px", borderRadius: "6px" }}>
                                🗑️ Remover
                              </button>
                            )}
                          </div>

                          <input
                            type="text" required
                            placeholder={`Enunciado da Pergunta ${qIdx + 1}...`}
                            value={q.pergunta}
                            onChange={(e) => { const val = e.target.value; setFormCriarPerguntas(prev => prev.map((item, i) => i === qIdx ? { ...item, pergunta: val } : item)); }}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "13px", marginBottom: "10px" }}
                          />

                          <label style={{ display: "block", fontSize: "11px", fontWeight: "700", marginBottom: "6px", color: colors.textSecondary }}>Opções de Resposta:</label>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                            {q.opcoes.map((op, oIdx) => (
                              <input
                                key={oIdx} type="text" required
                                placeholder={`Opção ${oIdx + 1}`}
                                value={op}
                                onChange={(e) => { const val = e.target.value; setFormCriarPerguntas(prev => prev.map((item, i) => i === qIdx ? { ...item, opcoes: item.opcoes.map((o, idx2) => idx2 === oIdx ? val : o) } : item)); }}
                                style={{ padding: "9px 10px", borderRadius: "8px", border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "12px" }}
                              />
                            ))}
                          </div>

                          <div style={{ backgroundColor: isDark ? "rgba(16,185,129,0.08)" : "#E6F4EA", padding: "10px 12px", borderRadius: "10px", border: "1px solid rgba(16,185,129,0.25)" }}>
                            <label style={{ display: "block", fontSize: "11px", fontWeight: "800", color: "#10B981", marginBottom: "5px" }}>✅ Qual é a Resposta CORRETA?</label>
                            <select
                              value={q.respostaCorreta}
                              onChange={(e) => { const val = parseInt(e.target.value); setFormCriarPerguntas(prev => prev.map((item, i) => i === qIdx ? { ...item, respostaCorreta: val } : item)); }}
                              style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #10B981", backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                            >
                              {q.opcoes.map((opText, oIdx) => (
                                <option key={oIdx} value={oIdx}>Opção {oIdx + 1}: {opText || `(Opção ${oIdx + 1})`}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ===== MODO PDF ===== */}
                  {modalModoProva === "pdf" && (
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#FB923C", marginBottom: "10px" }}>📄 Arquivo PDF da Prova</label>

                      <label
                        htmlFor="pdf-upload-input"
                        style={{
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                          padding: "32px 20px", borderRadius: "16px",
                          border: pdfUploadNome ? "2px solid #FB923C" : `2px dashed ${colors.borderCard}`,
                          backgroundColor: pdfUploadNome ? "rgba(251,146,60,0.08)" : (isDark ? "rgba(255,255,255,0.02)" : "#FAFBFC"),
                          cursor: "pointer", textAlign: "center", transition: "all 0.2s"
                        }}
                      >
                        <span style={{ fontSize: "40px", marginBottom: "12px" }}>{pdfUploadNome ? "📄" : "⬆️"}</span>
                        {pdfUploadNome ? (
                          <>
                            <span style={{ fontSize: "14px", fontWeight: "800", color: "#FB923C", marginBottom: "4px" }}>{pdfUploadNome}</span>
                            <span style={{ fontSize: "12px", color: colors.textSecondary }}>✅ PDF carregado com sucesso! Clique para trocar.</span>
                          </>
                        ) : (
                          <>
                            <span style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>Arraste ou clique para enviar o PDF</span>
                            <span style={{ fontSize: "12px", color: colors.textSecondary }}>Formatos aceitos: .pdf · Máximo recomendado: 10MB</span>
                          </>
                        )}
                        <input
                          id="pdf-upload-input"
                          type="file"
                          accept=".pdf"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            if (file.size > 15 * 1024 * 1024) {
                              alert("⚠️ O PDF é muito grande (máx. 15MB). Comprima o arquivo antes de enviar.");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setPdfUploadData(ev.target.result);
                              setPdfUploadNome(file.name);
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>

                      {pdfUploadNome && (
                        <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "10px", backgroundColor: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)" }}>
                          <span style={{ fontSize: "18px" }}>📄</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "13px", fontWeight: "700", color: "#FB923C" }}>{pdfUploadNome}</div>
                            <div style={{ fontSize: "11px", color: colors.textSecondary }}>Arquivo pronto para publicação</div>
                          </div>
                          <button type="button" onClick={() => { setPdfUploadData(null); setPdfUploadNome(""); }}
                            style={{ border: "none", backgroundColor: "transparent", color: "#EF4444", cursor: "pointer", fontSize: "14px" }}>✕</button>
                        </div>
                      )}

                      <div style={{ marginTop: "14px", padding: "12px 14px", borderRadius: "10px", backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F0F4FF", border: `1px solid ${colors.borderCard}` }}>
                        <p style={{ fontSize: "12px", color: colors.textSecondary, lineHeight: "1.6" }}>
                          💡 <strong>Como funciona:</strong> O PDF será armazenado e os alunos poderão abrir o arquivo diretamente no navegador para realizar a prova. Ideal para provas já formatadas em Word, Google Docs, etc.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Botões de ação */}
                  <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                    <button
                      type="button"
                      onClick={() => setModalCriarProvaOpen(false)}
                      style={{ flex: 1, padding: "13px", borderRadius: "12px", border: `1px solid ${colors.borderCard}`, backgroundColor: "transparent", color: colors.textPrimary, fontWeight: "600", cursor: "pointer", fontSize: "13px" }}
                    >Cancelar</button>

                    <button
                      type="submit"
                      style={{
                        flex: 2, padding: "13px", borderRadius: "12px", border: "none",
                        background: modalModoProva === "pdf"
                          ? "linear-gradient(135deg,#FB923C,#F97316)"
                          : "linear-gradient(135deg,#a855f7,#7c3aed)",
                        color: "#FFF", fontWeight: "800", cursor: "pointer", fontSize: "13px",
                        boxShadow: modalModoProva === "pdf" ? "0 4px 16px rgba(251,146,60,0.4)" : "0 4px 16px rgba(168,85,247,0.4)"
                      }}
                    >
                      {modalModoProva === "pdf" ? "📄 Publicar Prova em PDF" : "✍️ Publicar Prova com Questões"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

