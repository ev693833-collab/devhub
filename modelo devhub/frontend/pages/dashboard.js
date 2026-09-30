import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DevHubLogo from "../components/Logo";
import DevIaModule from "../components/DevIaModule";
import PerfilModal from "../components/PerfilModal";
import StudentGamificationHeader from "../components/StudentGamificationHeader";
import SuperAdminModule from "../components/SuperAdminModule";
import HallDaFamaModule from "../components/HallDaFamaModule";
import EvolucaoTimelineModule from "../components/EvolucaoTimelineModule";
import GameCatalogModule from "../components/GameCatalogModule";
import MiniSistemasModule from "../components/MiniSistemasModule";
import CadernoEstudosModule from "../components/CadernoEstudosModule";
import CodePlaygroundModule from "../components/CodePlaygroundModule";
import FlashcardsModule from "../components/FlashcardsModule";
import TrilhasModule from "../components/TrilhasModule";
import AulasSection from "../components/dashboard/AulasSection";
import VisaoGeralSection from "../components/dashboard/VisaoGeralSection";
import ModuleHubLauncher from "../components/ModuleHubLauncher";
import NotificationCenterModal from "../components/NotificationCenterModal";
import TicketsModule from "../components/TicketsModule";
import { 
  BookOpen, Calendar, Trophy, FileText, CheckSquare, 
  Sparkles, ChevronLeft, ChevronRight, ChevronDown, User, Shield, Layers, Swords, Crown,
  LogOut, Moon, Sun, Settings, Bell, Zap, Check, BookMarked, Code, BrainCircuit, Compass, LifeBuoy, Home, X,
  HelpCircle, Megaphone, Award, Terminal, BarChart3
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  // Estados de Usuário e Tema
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(true);

  const [abaAtiva, setAbaAtiva] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const salva = localStorage.getItem("devhub_aba_ativa");
        if (salva) return salva;
      } catch (e) {}
    }
    return "inicio";
  });

  const [abaSubProvas, setAbaSubProvas] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const salva = localStorage.getItem("devhub_aba_sub_provas");
        if (salva) return salva;
      } catch (e) {}
    }
    return "provas";
  });

  useEffect(() => {
    if (typeof window !== "undefined" && abaAtiva) {
      try {
        localStorage.setItem("devhub_aba_ativa", abaAtiva);
      } catch (e) {}
    }
  }, [abaAtiva]);

  useEffect(() => {
    if (typeof window !== "undefined" && abaSubProvas) {
      try {
        localStorage.setItem("devhub_aba_sub_provas", abaSubProvas);
      } catch (e) {}
    }
  }, [abaSubProvas]);
  const [sidebarRecolhida, setSidebarRecolhida] = useState(false);
  const [menuAulasAberto, setMenuAulasAberto] = useState(false);
  const [modalPerfilOpen, setModalPerfilOpen] = useState(false);
  const [modalNotificacoesOpen, setModalNotificacoesOpen] = useState(false);
  const [modalTicketsOpen, setModalTicketsOpen] = useState(false);
  const [modalDevIaOpen, setModalDevIaOpen] = useState(false);

  useEffect(() => {
    const handleAbrirIa = () => setModalDevIaOpen(true);
    if (typeof window !== "undefined") {
      window.addEventListener("devhub_abrir_ia", handleAbrirIa);
      return () => window.removeEventListener("devhub_abrir_ia", handleAbrirIa);
    }
  }, []);

  // Estado e ouvinte do Modo Manutenção Global
  const [manutencaoState, setManutencaoState] = useState({ ativo: false, mensagem: "" });

  useEffect(() => {
    const checkManutencao = () => {
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("devhub_manutencao");
          if (saved) {
            setManutencaoState(JSON.parse(saved));
          } else {
            setManutencaoState({ ativo: false, mensagem: "" });
          }
        } catch (e) {}
      }
    };
    checkManutencao();
    window.addEventListener("devhub_manutencao_update", checkManutencao);
    return () => window.removeEventListener("devhub_manutencao_update", checkManutencao);
  }, []);
  const [unreadNotificacoesCount, setUnreadNotificacoesCount] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Estados de navegação profunda vindo das Trilhas de Aprendizado
  const [targetProjetoId, setTargetProjetoId] = useState(null);
  const [targetSnippetCodigo, setTargetSnippetCodigo] = useState(null);

  const handleNavegarDaTrilha = (abaTarget, params = {}) => {
    setAbaAtiva(abaTarget);
    if (params.slideIndex !== undefined) {
      setTimeout(() => {
        const el = document.getElementById(`topico-slide-${params.slideIndex}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 350);
    }
    if (params.projetoId) {
      setTargetProjetoId(params.projetoId);
    }
    if (params.snippetCodigo) {
      setTargetSnippetCodigo(params.snippetCodigo);
    }
  };

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

  // ===== SALA DE VÍDEOCHAMADA NATIVA, CHECK-IN & RELATÓRIOS DE PRESENÇA =====
  const [reuniaoAtivaVideo, setReuniaoAtivaVideo] = useState(null);
  const [modalPresencasAula, setModalPresencasAula] = useState(null);
  const [listaPresencasAula, setListaPresencasAula] = useState([]);
  const [carregandoPresencas, setCarregandoPresencas] = useState(false);
  const [repriseAulaModal, setRepriseAulaModal] = useState(null);
  const [servidorVideo, setServidorVideo] = useState("element");

  // ===== LIVE CHAT DA SALA DE VÍDEO =====
  const [chatMensagens, setChatMensagens] = useState([
    { id: 1, autor: "DevHub Bot 🤖", texto: "💬 Chat ao vivo ativo! Todos os participantes podem enviar mensagens aqui.", hora: "Agora" }
  ]);
  const [novoTextoChat, setNovoTextoChat] = useState("");
  const [chatPainelAberto, setChatPainelAberto] = useState(true);

  const handleEnviarMensagemChat = (e) => {
    e.preventDefault();
    if (!novoTextoChat.trim()) return;
    const agora = new Date();
    const horaStr = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
    const novaMsg = {
      id: Date.now(),
      autor: user?.nome || "Participante",
      texto: novoTextoChat.trim(),
      hora: horaStr
    };
    setChatMensagens(prev => [...prev, novaMsg]);
    setNovoTextoChat("");
  };

  const obterUrlVideoChamada = (reuniao, srv = servidorVideo) => {
    if (!reuniao) return "";
    const nomeBruto = reuniao.sala_nome || `devhub-aula-${reuniao.id}`;
    // Limpar caracteres especiais para evitar salas trancadas ou hashes quebrados
    const salaLimpa = nomeBruto.replace(/[^a-zA-Z0-9\-_]/g, "_");
    const userNome = user?.nome ? encodeURIComponent(user.nome) : "Aluno_DevHub";

    let domain = "meet.element.io";
    if (srv === "riot") domain = "jitsi.riot.im";
    if (srv === "jitsi") domain = "meet.jit.si";
    if (srv === "8x8") domain = "8x8.vc";

    return `https://${domain}/${salaLimpa}#config.prejoinPageEnabled=false&config.enableWelcomePage=false&config.enableClosePage=false&config.disableDeepLinking=true&config.startWithAudioMuted=false&config.startWithVideoMuted=false&config.requireDisplayName=false&config.openVideobridgeUrlWithOpenChat=true&config.enableChat=true&userInfo.displayName="${userNome}"`;
  };

  // Fechar o modal de vídeo automaticamente se a chamada for encerrada no player
  useEffect(() => {
    const handleJitsiMessage = (event) => {
      try {
        if (!event.data) return;
        let data = event.data;
        if (typeof data === "string") {
          try { data = JSON.parse(event.data); } catch (e) {}
        }
        if (
          data?.type === "readyToClose" ||
          data?.event === "videoConferenceLeft" ||
          data?.postMessage === "readyToClose" ||
          data?.action === "hangup"
        ) {
          setReuniaoAtivaVideo(null);
        }
      } catch (err) {}
    };

    window.addEventListener("message", handleJitsiMessage);
    return () => window.removeEventListener("message", handleJitsiMessage);
  }, []);

  // Modal de Chamada Instantânea
  const [modalChamadaInstantaneaOpen, setModalChamadaInstantaneaOpen] = useState(false);
  const [formInstantaneaTitulo, setFormInstantaneaTitulo] = useState("🔴 Chamada Ao Vivo");

  const handleAbrirChamadaInstantanea = () => {
    const agora = new Date();
    const horaStr = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
    setFormInstantaneaTitulo(`🔴 Chamada Ao Vivo — ${horaStr}`);
    setModalChamadaInstantaneaOpen(true);
  };

  const handleConfirmarChamadaInstantanea = async (e) => {
    e.preventDefault();
    const agora = new Date();
    const dataHoje = agora.toLocaleDateString("pt-BR");
    const horaInicioStr = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
    const horaFimDate = new Date(agora.getTime() + 2 * 60 * 60 * 1000);
    const horaFimStr = `${String(horaFimDate.getHours()).padStart(2, '0')}:${String(horaFimDate.getMinutes()).padStart(2, '0')}`;
    const salaNome = `devhub-live-room-${Date.now()}`;

    const novaReuniao = {
      id: Date.now(),
      titulo: formInstantaneaTitulo || `🔴 Chamada Ao Vivo — ${horaInicioStr}`,
      descricao: "Transmissão ao vivo iniciada no DevHub.",
      data_reuniao: dataHoje,
      data: dataHoje,
      horario_inicio: horaInicioStr,
      horario_fim: horaFimStr,
      horario: `${horaInicioStr} - ${horaFimStr}`,
      instrutor: user?.nome || "Enzo Vieira (DevHub Master)",
      status: "Ao Vivo 🔴",
      status_cor: "#EF4444",
      statusCor: "#EF4444",
      link: `https://meet.jit.si/${salaNome}`,
      sala_nome: salaNome,
      base_nome: user?.base || "ContabHub",
      carga_horaria: "2h",
      icone: "🔴"
    };

    const listaAtualizada = [novaReuniao, ...agendaAulas];
    await salvarAgendaLS(listaAtualizada, novaReuniao);
    setModalChamadaInstantaneaOpen(false);
    handleEntrarVideoChamada(novaReuniao);
  };

  // Entrar na Sala de VídeoChamada (com Check-in automático)
  const handleEntrarVideoChamada = async (aula) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      await fetch(`${apiUrl}/reunioes/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reuniao_id: aula.id,
          user_id: user?.id || user?.uid || "user-1",
          user_nome: user?.nome || user?.name || "Aluno DevHub",
          user_email: user?.email || "aluno@devhub.com",
          base_nome: user?.base || aula.base_nome || "ContabHub",
          tipo_presenca: "🟢 Presente ao Vivo"
        })
      });
    } catch (err) {
      console.error("Erro ao registrar presença ao vivo:", err);
    }

    if (aula.link && (aula.link.includes("zoom.us") || aula.link.includes("meet.google") || aula.link.includes("youtube.com"))) {
      window.open(aula.link, "_blank");
    } else {
      setReuniaoAtivaVideo(aula);
    }
  };

  // Ver Relatório de Presenças da Aula
  const handleVerPresencas = async (aula) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    setModalPresencasAula(aula);
    setCarregandoPresencas(true);
    try {
      const res = await fetch(`${apiUrl}/reunioes/presencas/${aula.id}`);
      if (res.ok) {
        const data = await res.json();
        setListaPresencasAula(data);
      } else {
        setListaPresencasAula([]);
      }
    } catch (err) {
      console.error("Erro ao carregar relatório de presenças:", err);
      setListaPresencasAula([]);
    } finally {
      setCarregandoPresencas(false);
    }
  };

  // Abrir Modal de Reprise (Assistir Gravação + Check-in)
  const handleAbrirReprise = async (aula) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    setRepriseAulaModal(aula);
    try {
      await fetch(`${apiUrl}/reunioes/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reuniao_id: aula.id,
          user_id: user?.id || user?.uid || "user-1",
          user_nome: user?.nome || user?.name || "Aluno DevHub",
          user_email: user?.email || "aluno@devhub.com",
          base_nome: user?.base || aula.base_nome || "ContabHub",
          tipo_presenca: "📹 Assistiu Reprise"
        })
      });
    } catch (err) {
      console.error("Erro ao registrar presença na reprise:", err);
    }
  };


  // Lista de Administradores cadastrados (Dropdown)
  const [listaAdmins, setListaAdmins] = useState([
    "Enzo Vieira (DevHub Master)",
    "Gabriel Costa (Super Admin 👑)",
    "Pedro Henrique (Administrador 🛡️)"
  ]);

  // Estado do Tema Ativo
  const [temaEquipado, setTemaEquipado] = useState("padrao");

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
  const [pdfVisualizarModal, setPdfVisualizarModal] = useState(null); // { id, titulo, pdfData, pdfNome }
  const [pdfModoResposta, setPdfModoResposta] = useState(false);
  const [pdfTextoResposta, setPdfTextoResposta] = useState("");

  // ===== GERADOR DE PROVAS DIÁRIAS (2 PROVAS POR DIA + ROTAÇÃO SEMANAL) =====
  const obterProvasDiarias = () => {
    // Calcula o número da semana atual no ano para rotacionar as variações e perguntas semanalmente
    const agora = new Date();
    const inicioAno = new Date(agora.getFullYear(), 0, 1);
    const numeroSemana = Math.ceil((((agora - inicioAno) / 86400000) + inicioAno.getDay() + 1) / 7);

    // Banco de Dados com Variações de Provas (2 Variações por dia da semana)
    const BANCO_VARIANCE = {
      0: [ // Domingo (JS & Lógica)
        {
          id: `diaria-0-v1-w${numeroSemana}`,
          diaSemana: 0,
          emoji: "⚡",
          tema: "JavaScript Avançado (Módulos & Async)",
          titulo: "Prova 1 do Dia — JS Avançado & Async",
          descricao: "Avaliação sobre closures, Promises, Async/Await, Event Loop e desestruturação em JS.",
          duracaoMinutos: 30,
          criadoPor: "DevHub Sistema 🤖",
          tipo: "questoes",
          questoes: [
            { id: "d0v1q1", pergunta: "O que é um closure em JavaScript?", opcoes: ["Uma função que lembra o escopo onde foi criada", "Um loop infinito no Event Loop", "Uma variável global imutável", "Uma função construtora legada"], respostaCorreta: 0 },
            { id: "d0v1q2", pergunta: "Qual é a saída de typeof null em JS?", opcoes: ["null", "undefined", "object", "string"], respostaCorreta: 2 },
            { id: "d0v1q3", pergunta: "O que faz a função Promise.all()?", opcoes: ["Executa em sequência", "Aguarda todas as Promises resolverem em paralelo", "Cancela requisições lentas", "Retorna apenas o primeiro resultado"], respostaCorreta: 1 },
            { id: "d0v1q4", pergunta: "Qual a diferença de 'let' e 'var' quanto ao escopo?", opcoes: ["'var' tem escopo de bloco e 'let' de função", "'let' possui escopo de bloco e 'var' tem escopo de função", "Não há diferença", "'let' é usado apenas em objetos"], respostaCorreta: 1 },
            { id: "d0v1q5", pergunta: "O que faz o método Array.prototype.reduce()?", opcoes: ["Remove itens duplicados", "Reduz a lista a um único valor acumulado", "Filtra apenas valores pares", "Ordena o array em ordem alfabética"], respostaCorreta: 1 }
          ]
        },
        {
          id: `diaria-0-v2-w${numeroSemana}`,
          diaSemana: 0,
          emoji: "🧩",
          tema: "Lógica & Algoritmos Avançados",
          titulo: "Prova 2 do Dia — Lógica & Algoritmos",
          descricao: "Desafios de complexidade de algoritmos (Big-O), recursão e estruturas de dados.",
          duracaoMinutos: 30,
          criadoPor: "DevHub Sistema 🤖",
          tipo: "questoes",
          questoes: [
            { id: "d0v2q1", pergunta: "Qual a complexidade de tempo de uma busca binária em um array ordenado?", opcoes: ["O(n)", "O(log n)", "O(n²)", "O(1)"], respostaCorreta: 1 },
            { id: "d0v2q2", pergunta: "O que caracteriza a estrutura de dados Pilha (Stack)?", opcoes: ["FIFO (Primeiro a entrar, primeiro a sair)", "LIFO (Último a entrar, primeiro a sair)", "Acesso aleatório por índice", "Chave-Valor associativa"], respostaCorreta: 1 },
            { id: "d0v2q3", pergunta: "O que é recursão em programação?", opcoes: ["Um loop while sem condição de parada", "Uma função que chama a si mesma até atingir o caso base", "Um erro de estouro de memória", "Um método de ordenação de strings"], respostaCorreta: 1 },
            { id: "d0v2q4", pergunta: "Na estrutura Fila (Queue), onde novos elementos são inseridos?", opcoes: ["No início", "No final (tail/rear)", "No meio", "Em qualquer posição aleatória"], respostaCorreta: 1 },
            { id: "d0v2q5", pergunta: "Qual estrutura de dados utiliza tabelas Hash para busca rápida O(1)?", opcoes: ["Lista Encadeada", "Dicionário / Map", "Árvore Binária", "Matriz tridimensional"], respostaCorreta: 1 }
          ]
        }
      ],
      1: [ // Segunda (Backend & Arquitetura)
        {
          id: `diaria-1-v1-w${numeroSemana}`,
          diaSemana: 1,
          emoji: "🟢",
          tema: "Backend com Node.js & Express",
          titulo: "Prova 1 do Dia — Node.js & Express",
          descricao: "Avaliação sobre rotas REST, middlewares, requisições HTTP e manipulação do req/res.",
          duracaoMinutos: 30,
          criadoPor: "DevHub Sistema 🤖",
          tipo: "questoes",
          questoes: [
            { id: "d1v1q1", pergunta: "Qual método HTTP é utilizado para criação de novos recursos?", opcoes: ["GET", "POST", "PUT", "DELETE"], respostaCorreta: 1 },
            { id: "d1v1q2", pergunta: "O que faz uma função Middleware no Express.js?", opcoes: ["Conecta diretamente com o MySQL", "Intercepta e processa requisições HTTP antes de responder", "Compila o código JS para C++", "Renderiza o HTML no cliente"], respostaCorreta: 1 },
            { id: "d1v1q3", pergunta: "O que é o arquivo package.json em um projeto Node?", opcoes: ["Onde fica o banco de dados", "Manifesto do projeto com metadados e dependências", "Um script de inicialização do sistema", "Arquivo de estilos globais"], respostaCorreta: 1 },
            { id: "d1v1q4", pergunta: "Qual status HTTP indica que o recurso foi criado com sucesso?", opcoes: ["200 OK", "201 Created", "204 No Content", "404 Not Found"], respostaCorreta: 1 },
            { id: "d1v1q5", pergunta: "O que faz o comando npm install express?", opcoes: ["Baixa e salva o pacote Express nas dependências do projeto", "Inicia o servidor em modo de desenvolvimento", "Cria o arquivo index.js", "Atualiza a versão do Node"], respostaCorreta: 0 }
          ]
        },
        {
          id: `diaria-1-v2-w${numeroSemana}`,
          diaSemana: 1,
          emoji: "🛡️",
          tema: "Autenticação & Segurança em APIs",
          titulo: "Prova 2 do Dia — Segurança & JWT",
          descricao: "Conceitos de autenticação com JSON Web Tokens (JWT), criptografia com bcrypt e CORS.",
          duracaoMinutos: 30,
          criadoPor: "DevHub Sistema 🤖",
          tipo: "questoes",
          questoes: [
            { id: "d1v2q1", pergunta: "Quais são as três partes que compõem um token JWT?", opcoes: ["Header, Payload e Signature", "User, Pass e Key", "Issuer, Audience e Scope", "Token, Hash e Secret"], respostaCorreta: 0 },
            { id: "d1v2q2", pergunta: "Para que serve a biblioteca bcrypt em sistemas de login?", opcoes: ["Gerar tokens de sessão", "Criptografar/hashear senhas antes de salvar no banco", "Validar o e-mail do usuário", "Bloquear ataques de DDoS"], respostaCorreta: 1 },
            { id: "d1v2q3", pergunta: "O que é a política CORS no navegador?", opcoes: ["Mecanismo de segurança para restringir requisições de origens diferentes", "Formato de compactação de arquivos", "Gerenciador de rotas no cliente", "Protocolo de banco de dados"], respostaCorreta: 0 },
            { id: "d1v2q4", pergunta: "Em qual header da requisição HTTP o JWT geralmente é transmitido?", opcoes: ["Content-Type", "Authorization (Bearer)", "User-Agent", "Accept-Language"], respostaCorreta: 1 },
            { id: "d1v2q5", pergunta: "Qual status HTTP indica falta de autenticação (Token inválido/ausente)?", opcoes: ["400 Bad Request", "401 Unauthorized", "403 Forbidden", "500 Internal Error"], respostaCorreta: 1 }
          ]
        }
      ],
      2: [ // Terça (Banco de Dados)
        {
          id: `diaria-2-v1-w${numeroSemana}`,
          diaSemana: 2,
          emoji: "🗄️",
          tema: "Banco de Dados & SQL Relacional",
          titulo: "Prova 1 do Dia — SQL Relacional & Consultas",
          descricao: "Testes sobre SELECT, JOINs, WHERE, GROUP BY e subconsultas SQL.",
          duracaoMinutos: 30,
          criadoPor: "DevHub Sistema 🤖",
          tipo: "questoes",
          questoes: [
            { id: "d2v1q1", pergunta: "Qual cláusula SQL é utilizada para filtrar registros em uma consulta?", opcoes: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"], respostaCorreta: 2 },
            { id: "d2v1q2", pergunta: "O que faz um INNER JOIN em uma consulta SQL?", opcoes: ["Retorna todos os dados das duas tabelas", "Retorna apenas os registros que possuem correspondência em ambas as tabelas", "Remove valores nulos", "Cria uma nova tabela temporária"], respostaCorreta: 1 },
            { id: "d2v1q3", pergunta: "O que é uma PRIMARY KEY?", opcoes: ["Uma senha do banco de dados", "Um identificador único exclusivo para cada registro na tabela", "Uma chave estrangeira de relacionamento", "Uma coluna com dados duplicados"], respostaCorreta: 1 },
            { id: "d2v1q4", pergunta: "Qual comando SQL apaga completamente uma tabela e sua estrutura?", opcoes: ["DELETE TABLE", "DROP TABLE", "TRUNCATE TABLE", "CLEAR TABLE"], respostaCorreta: 1 },
            { id: "d2v1q5", pergunta: "Para ordenar o resultado de uma busca de forma decrescente usamos:", opcoes: ["ORDER BY coluna DESC", "SORT BY coluna DOWN", "GROUP BY coluna DESC", "ALIGN BY coluna MINUS"], respostaCorreta: 0 }
          ]
        },
        {
          id: `diaria-2-v2-w${numeroSemana}`,
          diaSemana: 2,
          emoji: "🍃",
          tema: "Modelagem de Dados & NoSQL",
          titulo: "Prova 2 do Dia — Modelagem & NoSQL",
          descricao: "Normalização de dados, conceitos de bancos NoSQL (MongoDB), Índices e ACID.",
          duracaoMinutos: 30,
          criadoPor: "DevHub Sistema 🤖",
          tipo: "questoes",
          questoes: [
            { id: "d2v2q1", pergunta: "O que significa a sigla ACID em gerenciadores de banco de dados?", opcoes: ["Atomicity, Consistency, Isolation, Durability", "Agility, Control, Integrity, Data", "Access, Code, Index, Distribution", "Authentication, Concurrency, Isolation, Design"], respostaCorreta: 0 },
            { id: "d2v2q2", pergunta: "Qual a principal diferença entre bancos SQL e NoSQL?", opcoes: ["SQL guarda arquivos e NoSQL apenas textos", "SQL é baseado em tabelas relacionais com esquema rígido e NoSQL em documentos/chave-valor flexíveis", "NoSQL não suporta consultas", "SQL não funciona na nuvem"], respostaCorreta: 1 },
            { id: "d2v2q3", pergunta: "Para que serve a criação de Índices em um banco de dados?", opcoes: ["Aumentar o espaço em disco", "Acelerar a busca e leitura de dados em colunas consultadas com frequência", "Garantir backup automático", "Ocultar dados confidenciais"], respostaCorreta: 1 },
            { id: "d2v2q4", pergunta: "No MongoDB, como são armazenados os documentos principais?", opcoes: ["Em planilhas Excel", "No formato BSON (JSON binário)", "Em tabelas de chave primária estrita", "Em arquivos XML"], respostaCorreta: 1 },
            { id: "d2v2q5", pergunta: "O que visa a Primeira Forma Normal (1FN) na normalização?", opcoes: ["Garantir que a tabela não tenha grupos repetidos nem atributos multivalorados", "Eliminar chaves estrangeiras", "Dividir a tabela em duas metades", "Criar restrições de verificação em triggers"], respostaCorreta: 0 }
          ]
        }
      ],
      3: [ // Quarta (Git & Devops)
        {
          id: `diaria-3-v1-w${numeroSemana}`,
          diaSemana: 3,
          emoji: "🔀",
          tema: "Git & Fluxos de Versionamento",
          titulo: "Prova 1 do Dia — Git & Versionamento",
          descricao: "Comandos Git, estratégias de branch (Git Flow), merge e resolução de conflitos.",
          duracaoMinutos: 30,
          criadoPor: "DevHub Sistema 🤖",
          tipo: "questoes",
          questoes: [
            { id: "d3v1q1", pergunta: "Qual comando cria uma nova branch e alterna imediatamente para ela?", opcoes: ["git branch nova", "git checkout -b nova", "git switch -c nova", "git create branch nova"], respostaCorreta: 1 },
            { id: "d3v1q2", pergunta: "O que faz o comando 'git stash'?", opcoes: ["Descarta todas as alterações locais definitivamente", "Guarda temporariamente o trabalho não commitado no repositório", "Publica os commits no GitHub", "Cria uma nova tag de versão"], respostaCorreta: 1 },
            { id: "d3v1q3", pergunta: "Qual a diferença entre git merge e git rebase?", opcoes: ["Não há diferença", "Merge junta histórico criando um commit de junção; Rebase aplica os commits sobre a base de maneira linear", "Rebase apaga as alterações e Merge adiciona", "Merge altera apenas repositórios remotos"], respostaCorreta: 1 },
            { id: "d3v1q4", pergunta: "Qual comando desfaria o último commit local sem perder as alterações feitas no código?", opcoes: ["git reset --hard HEAD~1", "git reset --soft HEAD~1", "git clean -f", "git revert HEAD"], respostaCorreta: 1 },
            { id: "d3v1q5", pergunta: "Para atualizar seu repositório local com as alterações do servidor remoto trazendo e aplicando commits usamos:", opcoes: ["git push", "git pull", "git commit", "git status"], respostaCorreta: 1 }
          ]
        },
        {
          id: `diaria-3-v2-w${numeroSemana}`,
          diaSemana: 3,
          emoji: "🐳",
          tema: "Docker & Containerização",
          titulo: "Prova 2 do Dia — Docker & CI/CD",
          descricao: "Containers, Dockerfile, Docker Compose, imagens e integração contínua.",
          duracaoMinutos: 30,
          criadoPor: "DevHub Sistema 🤖",
          tipo: "questoes",
          questoes: [
            { id: "d3v2q1", pergunta: "O que é um Container Docker?", opcoes: ["Uma máquina virtual inteira com sistema operacional completo", "Um ambiente isolado e leve para rodar aplicações com suas dependências", "Um servidor de hospedagem física", "Um gerenciador de banco de dados"], respostaCorreta: 1 },
            { id: "d3v2q2", pergunta: "Qual o arquivo responsável por definir a receita de construção de uma Imagem Docker?", opcoes: ["docker-compose.yml", "Dockerfile", "package.json", "index.html"], respostaCorreta: 1 },
            { id: "d3v2q3", pergunta: "Qual comando sobe e executa todos os serviços mapeados em um arquivo docker-compose.yml?", opcoes: ["docker build .", "docker-compose up -d", "docker run container", "docker start all"], respostaCorreta: 1 },
            { id: "d3v2q4", pergunta: "O que é uma Imagem Docker?", opcoes: ["Um print da tela da aplicação", "Um modelo estático somente-leitura com código e dependências para criar containers", "Um arquivo de banco de dados", "Um certificado de segurança SSL"], respostaCorreta: 1 },
            { id: "d3v2q5", pergunta: "No Docker, qual instrução no Dockerfile define o comando padrão ao iniciar o container?", opcoes: ["FROM", "WORKDIR", "CMD", "COPY"], respostaCorreta: 2 }
          ]
        }
      ],
      4: [ // Quinta (CSS & Frontend UI)
        {
          id: `diaria-4-v1-w${numeroSemana}`,
          diaSemana: 4,
          emoji: "🎨",
          tema: "UI/UX & CSS Layouts",
          titulo: "Prova 1 do Dia — Flexbox, Grid & Responsividade",
          descricao: "Alinhamento, layouts responsivos, unidades dinâmicas e Media Queries.",
          duracaoMinutos: 30,
          criadoPor: "DevHub Sistema 🤖",
          tipo: "questoes",
          questoes: [
            { id: "d4v1q1", pergunta: "Qual combinação Flexbox alinha elementos perfeitamente no centro horizontal e vertical?", opcoes: ["align-items: center + justify-content: center", "text-align: center + margin: auto", "float: center", "display: inline-block"], respostaCorreta: 0 },
            { id: "d4v1q2", pergunta: "Qual a diferença entre a unidade 'em' e 'rem' no CSS?", opcoes: ["São idênticas", "'em' é relativo ao tamanho da fonte do elemento pai; 'rem' é relativo à raiz (html)", "'rem' só funciona em telas grandes", "'em' é usado apenas para largura de div"], respostaCorreta: 1 },
            { id: "d4v1q3", pergunta: "O que faz a propriedade CSS 'position: sticky'?", opcoes: ["Fixa o elemento na tela o tempo todo", "Comporta-se como relativo até atingir o limite de rolagem definido e então fica fixo", "Remove o elemento da tela", "Alinha o elemento ao fundo do rodapé"], respostaCorreta: 1 },
            { id: "d4v1q4", pergunta: "O que caracteriza a abordagem 'Mobile First' no desenvolvimento de layouts?", opcoes: ["Criar código apenas para celulares", "Desenvolver primeiro o CSS para dispositivos móveis e depois aplicar Media Queries para telas maiores", "Bloquear acesso via computador", "Usar apenas imagens pequenas"], respostaCorreta: 1 },
            { id: "d4v1q5", pergunta: "Qual propriedade CSS Grid define o número e o tamanho das colunas?", opcoes: ["grid-template-columns", "grid-column-gap", "display-columns", "flex-grid"], respostaCorreta: 0 }
          ]
        },
        {
          id: `diaria-4-v2-w${numeroSemana}`,
          diaSemana: 4,
          emoji: "✨",
          tema: "Animações CSS & Design Systems",
          titulo: "Prova 2 do Dia — CSS Avançado & Animações",
          descricao: "Keyframes, transformações 2D/3D, variáveis CSS e conceitos de Design Systems.",
          duracaoMinutos: 30,
          criadoPor: "DevHub Sistema 🤖",
          tipo: "questoes",
          questoes: [
            { id: "d4v2q1", pergunta: "Como declaramos uma variável customizada em CSS global?", opcoes: ["$primary-color: #000;", "--primary-color: #000;", "var primary = #000;", "@color-primary: #000;"], respostaCorreta: 1 },
            { id: "d4v2q2", pergunta: "Qual propriedade é usada para mover, rotacionar ou escalar um elemento em CSS sem afetar o layout dos vizinhos?", opcoes: ["transition", "transform", "animation", "position"], respostaCorreta: 1 },
            { id: "d4v2q3", pergunta: "Qual regra CSS permite criar etapas com porcentagens para animações complexas?", opcoes: ["@keyframes", "@keyframes-set", "@media", "@import"], respostaCorreta: 0 },
            { id: "d4v2q4", pergunta: "Para que serve a propriedade CSS 'backdrop-filter: blur(...)'?", opcoes: ["Desfoca o texto interno", "Aplica efeito de vidro (glassmorphism) desfocando os elementos atrás do contêiner", "Aumenta o contraste da página", "Cria sombra na borda"], respostaCorreta: 1 },
            { id: "d4v2q5", pergunta: "O que é a propriedade CSS 'pointer-events: none'?", opcoes: ["Desabilita cliques e eventos de ponteiro do mouse no elemento", "Esconde o cursor do mouse", "Acelera a animação", "Desativa o touch screen"], respostaCorreta: 0 }
          ]
        }
      ],
      5: [ // Sexta (APIs & Engenharia)
        {
          id: `diaria-5-v1-w${numeroSemana}`,
          diaSemana: 5,
          emoji: "🌐",
          tema: "APIs RESTful & Protocolo HTTP",
          titulo: "Prova 1 do Dia — APIs & HTTP",
          descricao: "Status codes, verbos HTTP, payloads JSON e arquitetura de comunicação.",
          duracaoMinutos: 30,
          criadoPor: "DevHub Sistema 🤖",
          tipo: "questoes",
          questoes: [
            { id: "d5v1q1", pergunta: "O que significa a sigla REST em desenvolvimento de APIs?", opcoes: ["Remote Execution Service Transfer", "Representational State Transfer", "Resource Endpoint Standard Type", "Routing Express Socket Technology"], respostaCorreta: 1 },
            { id: "d5v1q2", pergunta: "Qual status HTTP representa erro de servidor interno indisponível?", opcoes: ["400 Bad Request", "404 Not Found", "500 Internal Server Error", "503 Unauthorized"], respostaCorreta: 2 },
            { id: "d5v1q3", pergunta: "O que caracteriza uma operação idempotente no protocolo HTTP?", opcoes: ["Fazer a mesma requisição múltiplas vezes produz o mesmo efeito no servidor que fazer uma única vez", "Executa apenas em servidores de teste", "Altera a senha do banco de dados", "Retorna dados criptografados em 256 bits"], respostaCorreta: 0 },
            { id: "d5v1q4", pergunta: "Qual verbo HTTP é recomendado para atualizações parciais de um recurso?", opcoes: ["PUT", "PATCH", "POST", "UPDATE"], respostaCorreta: 1 },
            { id: "d5v1q5", pergunta: "Para que serve o cabeçalho 'Content-Type: application/json'?", opcoes: ["Indica que a mensagem enviada/recebida está no formato JSON", "Protege a requisição contra vírus", "Autentica o usuário no banco", "Força a conexão via HTTPS"], respostaCorreta: 0 }
          ]
        },
        {
          id: `diaria-5-v2-w${numeroSemana}`,
          diaSemana: 5,
          emoji: "🏗️",
          tema: "Arquitetura & Clean Code",
          titulo: "Prova 2 do Dia — Clean Code & Princípios SOLID",
          descricao: "Boas práticas de código, refatoração, padrões de projeto e SOLID.",
          duracaoMinutos: 30,
          criadoPor: "DevHub Sistema 🤖",
          tipo: "questoes",
          questoes: [
            { id: "d5v2q1", pergunta: "O que dita o 'Single Responsibility Principle' (SRP) do SOLID?", opcoes: ["Uma classe/módulo deve ter apenas uma única razão para mudar", "Toda classe deve ser estática", "O projeto deve ter apenas um arquivo principal", "Funções só podem aceitar um parâmetro"], respostaCorreta: 0 },
            { id: "d5v2q2", pergunta: "O que é 'Clean Code'?", opcoes: ["Código sem comentários", "Código legível, simples, direto e de fácil manutenção por outros desenvolvedores", "Código compilado para binário", "Código escrito sem usar bibliotecas externas"], respostaCorreta: 1 },
            { id: "d5v2q3", pergunta: "O princípio Open/Closed (OCP) estabelece que entidades de software devem ser:", opcoes: ["Abertas para modificação e fechadas para extensão", "Abertas para extensão, mas fechadas para modificação", "Fechadas para acesso externo", "Abertas apenas para leitura de dados"], respostaCorreta: 1 },
            { id: "d5v2q4", pergunta: "O que é 'DRY' em Engenharia de Software?", opcoes: ["Don't Repeat Yourself (Não se repita)", "Do Read Yourself", "Data Recovery Yield", "Dynamic Rendering Yield"], respostaCorreta: 0 },
            { id: "d5v2q5", pergunta: "Qual a vantagem da Injeção de Dependências?", opcoes: ["Reduzir o acoplamento entre classes tornando-as mais fáceis de testar e manter", "Aumentar a velocidade do processador", "Substituir o banco de dados SQL por arquivos de texto", "Eliminar o uso de interfaces"], respostaCorreta: 0 }
          ]
        }
      ],
      6: [ // Sábado (React & Frameworks)
        {
          id: `diaria-6-v1-w${numeroSemana}`,
          diaSemana: 6,
          emoji: "⚛️",
          tema: "React & Hooks Essenciais",
          titulo: "Prova 1 do Dia — React & Hooks",
          descricao: "Gerenciamento de estado (useState), efeitos colaterais (useEffect), props e ciclo de vida.",
          duracaoMinutos: 30,
          criadoPor: "DevHub Sistema 🤖",
          tipo: "questoes",
          questoes: [
            { id: "d6v1q1", pergunta: "Qual hook do React é utilizado para declarar e gerenciar estado local em componentes funcionais?", opcoes: ["useEffect", "useState", "useContext", "useRef"], respostaCorreta: 1 },
            { id: "d6v1q2", pergunta: "Quando o hook useEffect com o array de dependências vazio [] é executado?", opcoes: ["A cada nova renderização do componente", "Apenas uma vez, logo após a montagem inicial do componente", "Sempre que uma prop muda", "Nunca é executado"], respostaCorreta: 1 },
            { id: "d6v1q3", pergunta: "O que é o Virtual DOM no React?", opcoes: ["Uma cópia exata do HTML real sincronizada de forma eficiente para minimizar edições diretas no DOM do navegador", "Uma biblioteca para criar servidores web", "Um plugin de animação 3D", "Um banco de dados local no navegador"], respostaCorreta: 0 },
            { id: "d6v1q4", pergunta: "Por que a propriedade 'key' é obrigatória ao renderizar listas no React com .map()?", opcoes: ["Para aplicar estilos CSS automáticos", "Para ajudar o algoritmo do React a identificar de forma única quais itens mudaram, foram adicionados ou removidos", "Para criar links entre páginas", "Para armazenar o índice da lista no localStorage"], respostaCorreta: 1 },
            { id: "d6v1q5", pergunta: "Qual hook permite manter uma referência mutável que não dispara renderização ao ser alterada?", opcoes: ["useMemo", "useCallback", "useRef", "useState"], respostaCorreta: 2 }
          ]
        },
        {
          id: `diaria-6-v2-w${numeroSemana}`,
          diaSemana: 6,
          emoji: "🚀",
          tema: "Next.js & Server-Side Rendering",
          titulo: "Prova 2 do Dia — Next.js & Performance",
          descricao: "SSR, SSG, rotas no Next.js, otimização de imagens e hidratação.",
          duracaoMinutos: 30,
          criadoPor: "DevHub Sistema 🤖",
          tipo: "questoes",
          questoes: [
            { id: "d6v2q1", pergunta: "O que significa SSR em Next.js?", opcoes: ["Server-Side Rendering (Renderização no lado do servidor)", "Static Site Restoration", "Single State React", "System Server Redirection"], respostaCorreta: 0 },
            { id: "d6v2q2", pergunta: "Qual a vantagem do SSG (Static Site Generation)?", opcoes: ["Pré-gerar as páginas HTML durante o build, garantindo carregamento ultrarrápido e ótimo SEO", "Permitir editar o código sem salvar", "Rodar o React sem JavaScript", "Eliminar o uso de CSS"], respostaCorreta: 0 },
            { id: "d6v2q3", pergunta: "No Next.js (App Router / Pages Router), como são criadas as rotas de página?", opcoes: ["Declarando rotas manualmente em um arquivo XML", "Baseado na estrutura de arquivos e pastas no diretório pages ou app", "Usando o comando npx create-route", "Com tags <Route> no HTML main"], respostaCorreta: 1 },
            { id: "d6v2q4", pergunta: "Para que serve o componente <Image /> nativo do Next.js?", opcoes: ["Otimizar imagens automaticamente em tamanho, formato moderno (WebP) e lazy loading", "Converter imagens em texto", "Criar desenhos vetoriais dinâmicos", "Filtrar imagens impróprias"], respostaCorreta: 0 },
            { id: "d6v2q5", pergunta: "O que é 'Hidratação' em aplicações SSR React?", opcoes: ["O processo onde o JavaScript do React se anexa ao HTML pré-renderizado pelo servidor, tornando a página interativa", "Limpeza de memória RAM no cliente", "Download dos arquivos CSS da página", "Compressão Gzip dos arquivos de fonte"], respostaCorreta: 0 }
          ]
        }
      ]
    };

    // Retorna as 2 provas configuradas para cada dia da semana
    const listaFinal = [];
    Object.keys(BANCO_VARIANCE).forEach(diaKey => {
      const diaNum = parseInt(diaKey, 10);
      const provasDoDia = BANCO_VARIANCE[diaNum] || [];
      // Se por algum motivo o número da semana for par/ímpar, podemos até alternar a ordem para renovar a experiência
      if (numeroSemana % 2 === 0) {
        listaFinal.push(...provasDoDia);
      } else {
        listaFinal.push(...[...provasDoDia].reverse());
      }
    });

    return listaFinal;
  };

  const PROVAS_DIARIAS = obterProvasDiarias();


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

    // 6. Carregar Tema Ativo do Backend
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${apiUrl}/gamificacao/carteira`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.economia) {
          if (data.economia.tema_ativo && data.economia.tema_ativo !== "padrao") {
            setTemaEquipado(data.economia.tema_ativo);
          }
        }
      })
      .catch(() => {});
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

    // Atualizar Streak (Manter o fogo aceso!)
    try {
      const hojeStr = new Date().toLocaleDateString("pt-BR");
      let diasAtuais = 1;
      const rawStreak = localStorage.getItem("devhub_streak_info");
      if (rawStreak) {
        const info = JSON.parse(rawStreak);
        if (info.ultimaData !== hojeStr) {
          diasAtuais = (info.dias || 0) + 1;
        } else {
          diasAtuais = info.dias || 1;
        }
      }
      localStorage.setItem("devhub_streak_info", JSON.stringify({ dias: diasAtuais, ultimaData: hojeStr }));
    } catch (e) {}

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
      window.dispatchEvent(new Event("devhub_gamificacao_update"));
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
  const [formBaseNome, setFormBaseNome] = useState("Todas as Bases");
  const [formCargaHoraria, setFormCargaHoraria] = useState("2h");
  const [formLinkGravacao, setFormLinkGravacao] = useState("");
  const [formPlataforma, setFormPlataforma] = useState("nativa");

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
        setLoading(false);
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
              const estudantesDoBanco = data.filter((u) => u.cargo === "usuario" || u.cargo === "estudante" || !(u.cargo && String(u.cargo).toLowerCase().includes("admin")));

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
          .catch(() => {});
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
        setLoading(false);
        router.push("/");
        return;
      }
      // Libera loading imediatamente após parsear usuário (fetches secundários são em paralelo)
      setLoading(false);
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

  const userCargoLower = (user?.cargo || "").toLowerCase();
  const isSuperAdmin = Boolean(user && (userCargoLower === "super_admin" || userCargoLower === "superadmin" || user.is_super_admin || (user.email && user.email.toLowerCase().includes("superadmin"))));
  const isAdmin = Boolean(user && (isSuperAdmin || userCargoLower === "admin" || user.is_admin));

  // Helper para rótulo do cargo
  const getCargoInfo = (role) => {
    const roleLower = (role || "").toLowerCase();
    if (roleLower === "super_admin" || roleLower === "superadmin") {
      return { label: "Super Admin 👑", desc: "Gestão do Sistema", bg: "rgba(168, 85, 247, 0.2)", color: "#c084fc", border: "#a855f7" };
    } else if (roleLower === "admin") {
      return { label: "Administrador 🛡️", desc: "Gerenciamento de Aulas & Relatórios", bg: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", border: "#3b82f6" };
    } else {
      return { label: "Estudante 👤", desc: "Acesso às Aulas", bg: "rgba(16, 185, 129, 0.2)", color: "#34d399", border: "#10b981" };
    }
  };

  // Verifica se o módulo está liberado para o aluno logado
  const isModuloLiberado = (abaId) => {
    if (!user) return true;
    if (abaId === "super_admin") return isSuperAdmin;

    const mapaModulo = {
      aulas: "Aulas",
      caderno: "Caderno",
      "provas-online": "Provas",
      notas: "Provas",
      games: "Arena",
      ranking: "Ranking",
      dev_ia: "Dev IA"
    };

    const nomeModulo = mapaModulo[abaId];
    if (!nomeModulo) return true;

    try {
      const userIdStr = user.id ? user.id.toString() : "";
      const userEmailStr = user.email ? user.email.toLowerCase().trim() : "";
      const userNomeStr = user.nome ? user.nome.toLowerCase().trim() : "";
      const userFirstName = userNomeStr.split(" ")[0];

      // 1. Checar Plano do Aluno (devhub_planos_alunos)
      const rawPlanos = typeof window !== "undefined" ? localStorage.getItem("devhub_planos_alunos") : null;
      if (rawPlanos) {
        const planosMap = JSON.parse(rawPlanos);
        let planoEncontrado = null;

        for (const [key, planoKey] of Object.entries(planosMap)) {
          const kLower = key.toLowerCase().trim();
          if (
            (userIdStr && kLower === userIdStr) ||
            (userEmailStr && (kLower === userEmailStr || userEmailStr.includes(kLower))) ||
            (userNomeStr && (kLower === userNomeStr || kLower === userFirstName || userNomeStr.startsWith(kLower) || kLower.startsWith(userFirstName)))
          ) {
            planoEncontrado = planoKey;
            break;
          }
        }

        if (planoEncontrado) {
          const PLANOS_PERMISSOES = {
            dev_start: ["Aulas", "Caderno", "Ranking"],
            dev_plus: ["Aulas", "Caderno", "Provas", "Arena", "Ranking"],
            dev_master: ["Aulas", "Caderno", "Provas", "Arena", "Ranking", "Dev IA"]
          };
          const permitidos = PLANOS_PERMISSOES[planoEncontrado] || PLANOS_PERMISSOES.dev_master;
          if (!permitidos.includes(nomeModulo)) {
            return false;
          }
        }
      }

      // 2. Checar Travas Individuais por Módulo (devhub_modulos_liberados)
      const rawModulos = typeof window !== "undefined" ? localStorage.getItem("devhub_modulos_liberados") : null;
      if (rawModulos) {
        const modulosMap = JSON.parse(rawModulos);
        for (const [key, modObj] of Object.entries(modulosMap)) {
          const kLower = key.toLowerCase().trim();
          if (
            (userIdStr && kLower === userIdStr) ||
            (userEmailStr && (kLower === userEmailStr || userEmailStr.includes(kLower))) ||
            (userNomeStr && (kLower === userNomeStr || kLower === userFirstName || userNomeStr.startsWith(kLower) || kLower.startsWith(userFirstName)))
          ) {
            if (modObj && modObj[nomeModulo] === false) {
              return false;
            }
          }
        }
      }
    } catch (e) {}

    return true;
  };

  useEffect(() => {
    if (abaAtiva && abaAtiva !== "aulas" && !isModuloLiberado(abaAtiva)) {
      setAbaAtiva("aulas");
    }
  }, [abaAtiva, user]);

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
    setFormBaseNome(user?.base || "Todas as Bases");
    setFormCargaHoraria("2h");
    setFormLinkGravacao("");
    setFormPlataforma("nativa");
    setModalAgendaOpen(true);
  };

  // Abrir Modal para Editar Aula
  const handleAbrirEditarAula = (aula) => {
    setAulaEmEdicaoId(aula.id);
    setFormTitulo(aula.titulo);
    setFormDescricao(aula.descricao);
    setFormData(aula.data || aula.data_reuniao);
    setFormHorario(aula.horario);
    setFormInstrutor(aula.instrutor);
    setFormStatus(aula.status);
    setFormLink(aula.link);
    setFormIcone(aula.icone);
    setFormBaseNome(aula.base_nome || "Todas as Bases");
    setFormCargaHoraria(aula.carga_horaria || "2h");
    setFormLinkGravacao(aula.link_gravacao || "");
    const linkStr = aula.link || "";
    if (linkStr.includes("zoom.us")) setFormPlataforma("zoom");
    else if (linkStr.includes("meet.google")) setFormPlataforma("meet");
    else if (linkStr.includes("youtube")) setFormPlataforma("youtube");
    else setFormPlataforma("nativa");
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

    const salaNome = aulaEmEdicaoId 
      ? (agendaAulas.find(a => a.id === aulaEmEdicaoId)?.sala_nome || `devhub-aula-${aulaEmEdicaoId}`)
      : `devhub-aula-${Date.now()}`;

    let finalLink = formLink;
    if (formPlataforma === "nativa" || !formLink) {
      finalLink = `https://meet.jit.si/${salaNome}`;
    }

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
      link: finalLink,
      sala_nome: salaNome,
      link_gravacao: formLinkGravacao,
      base_nome: formBaseNome || "Todas as Bases",
      carga_horaria: formCargaHoraria || "2h",
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
    const cargoStr = String(aluno.cargo || "");
    const isEstudante = cargoStr.includes("Estudante") || !cargoStr.toLowerCase().includes("admin");
    const pertenceAoUsuario = !user || isAdmin || (user && (aluno.id === user.id || (aluno.email && user.email && aluno.email.toLowerCase() === user.email.toLowerCase())));
    const atendeBusca = (aluno.nome || "").toLowerCase().includes((buscaAluno || "").toLowerCase()) ||
                        (aluno.email || "").toLowerCase().includes((buscaAluno || "").toLowerCase());
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

  // Sistema de Acento por Tema: muda apenas bordas, highlights e elementos de destaque
  // Sem alterar o fundo da página para não destruir o layout
  const ESTILOS_TEMAS = {
    "tema-cyberpunk": {
      accent: "#C084FC",
      accentSecondary: "#818CF8",
      glow: "0 0 14px rgba(192,132,252,0.35)",
      borderHighlight: "1px solid rgba(192,132,252,0.4)",
      badgeBg: "rgba(192,132,252,0.12)",
      label: "Cyberpunk Neon 🌌"
    },
    "tema-matrix": {
      accent: "#4ADE80",
      accentSecondary: "#22C55E",
      glow: "0 0 14px rgba(74,222,128,0.35)",
      borderHighlight: "1px solid rgba(74,222,128,0.4)",
      badgeBg: "rgba(74,222,128,0.12)",
      label: "Matrix Code 🟢"
    },
    "tema-gold-luxury": {
      accent: "#F59E0B",
      accentSecondary: "#FBBF24",
      glow: "0 0 14px rgba(245,158,11,0.4)",
      borderHighlight: "1px solid rgba(245,158,11,0.45)",
      badgeBg: "rgba(245,158,11,0.12)",
      label: "Gold Luxury 👑"
    },
    "tema-synthwave": {
      accent: "#F472B6",
      accentSecondary: "#EC4899",
      glow: "0 0 14px rgba(244,114,182,0.35)",
      borderHighlight: "1px solid rgba(244,114,182,0.4)",
      badgeBg: "rgba(244,114,182,0.12)",
      label: "Synthwave Sunset 🌅"
    },
    "tema-raro-dragon": {
      accent: "#EF4444",
      accentSecondary: "#F97316",
      glow: "0 0 16px rgba(239,68,68,0.45)",
      borderHighlight: "1px solid rgba(239,68,68,0.5)",
      badgeBg: "rgba(239,68,68,0.12)",
      label: "Chama Dracônica 🐉🔥"
    },
    "tema-raro-quantum": {
      accent: "#38BDF8",
      accentSecondary: "#0EA5E9",
      glow: "0 0 18px rgba(56,189,248,0.45)",
      borderHighlight: "1px solid rgba(56,189,248,0.5)",
      badgeBg: "rgba(56,189,248,0.12)",
      label: "Núcleo Quântico ⚛️"
    }
  };

  const tema = ESTILOS_TEMAS[temaEquipado] || null;

  // Cores base do layout — sempre limpas e profissionais
  const colors = {
    bgPage: isDark ? "#0B0F19" : "#F8FAFC",
    bgSidebar: isDark ? "#111827" : "#FFFFFF",
    bgCard: isDark ? "#111827" : "#FFFFFF",
    borderCard: tema ? tema.accent + "55" : (isDark ? "rgba(255, 255, 255, 0.1)" : "#E2E8F0"),
    textPrimary: isDark ? "#F8FAFC" : "#0F172A",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    inputBg: isDark ? "rgba(0,0,0,0.3)" : "#FFFFFF",
    // Accent dinâmico pelo tema equipado
    accent: tema ? tema.accent : (isDark ? "#3B82F6" : "#2563EB"),
    accentGlow: tema ? tema.glow : "none",
    accentBadgeBg: tema ? tema.badgeBg : "rgba(59,130,246,0.12)",
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: colors.bgPage, color: colors.textPrimary }}>
        <h2>Carregando DevHub... 🚀</h2>
      </div>
    );
  }

  const isUserAdmin = isAdmin || isSuperAdmin || (user && (user.role === "admin" || user.role === "superadmin" || user.is_admin || user.is_superadmin || (user.email && user.email.toLowerCase().includes("superadmin"))));

  if (manutencaoState.ativo && !isUserAdmin) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0B0F19",
        color: "#F8FAFC",
        padding: "20px",
        textAlign: "center",
        fontFamily: "'Inter', system-ui, sans-serif"
      }}>
        <Head>
          <title>Em Manutenção | DevHub</title>
        </Head>
        <div style={{
          maxWidth: "550px",
          width: "100%",
          padding: "40px 32px",
          borderRadius: "24px",
          background: "linear-gradient(145deg, rgba(17, 24, 39, 0.95), rgba(15, 23, 42, 0.98))",
          border: "1px solid rgba(239, 68, 68, 0.4)",
          boxShadow: "0 20px 50px rgba(239, 68, 68, 0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "2px solid #ef4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
            marginBottom: "24px"
          }}>
            🛠️
          </div>

          <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "12px", color: "#F8FAFC", letterSpacing: "-0.5px" }}>
            DevHub em Manutenção
          </h1>

          <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: "1.6", marginBottom: "28px" }}>
            {manutencaoState.mensagem || "Estamos realizando atualizações técnicas e melhorias na plataforma para você. Voltaremos em breve!"}
          </p>

          <div style={{
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            border: "1px dashed rgba(239, 68, 68, 0.3)",
            marginBottom: "32px",
            fontSize: "13px",
            color: "#fca5a5"
          }}>
            🔒 Acesso restrito temporariamente a administradores do sistema.
          </div>

          <div style={{ display: "flex", gap: "12px", width: "100%", justifyContent: "center" }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                backgroundColor: "#ef4444",
                color: "#ffffff",
                border: "none",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              🔄 Tentar Novamente
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                color: "#94A3B8",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer"
              }}
            >
              🚪 Sair da Conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>DevHub — Central de Estudos & Calendário</title>
      </Head>

      <div className="appBackgroundWrapper" style={{
        minHeight: abaAtiva === "inicio" ? "auto" : "100vh",
        backgroundColor: isDark ? "#050508" : colors.bgPage,
        color: colors.textPrimary,
        fontFamily: "system-ui, -apple-system, sans-serif",
        transition: "all 0.3s ease",
        position: "relative"
      }}>
        
        {/* Banner de Super Admin Impersonate (Navegando na Base de um Aluno) */}
        {typeof window !== "undefined" && Boolean(localStorage.getItem("superAdminReturnUser")) && (
          <>
            {/* Ambient Viewport Border glow */}
            <div style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              border: "2px solid rgba(245, 158, 11, 0.35)",
              boxShadow: "inset 0 0 40px rgba(245, 158, 11, 0.12)",
              pointerEvents: "none", zIndex: 99999
            }} />

            {/* Glowing Super Admin Banner */}
            <div style={{
              background: "linear-gradient(135deg, #0B0F19 0%, #17153B 35%, #2E1065 70%, #78350F 100%)",
              color: "#FFF",
              padding: "10px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: "700",
              fontSize: "13.5px",
              borderBottom: "1.5px solid rgba(245, 158, 11, 0.7)",
              boxShadow: "0 8px 30px rgba(245, 158, 11, 0.35), 0 4px 15px rgba(0,0,0,0.8)",
              position: "relative",
              zIndex: 102,
              backdropFilter: "blur(12px)",
              flexWrap: "wrap",
              gap: "10px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "34px", height: "34px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #F59E0B, #D97706)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", boxShadow: "0 0 15px rgba(245, 158, 11, 0.7)",
                  flexShrink: 0
                }}>
                  👑
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <span style={{
                    background: "rgba(245, 158, 11, 0.18)",
                    color: "#FBBF24",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                    padding: "3px 10px",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontWeight: "900",
                    letterSpacing: "0.5px"
                  }}>
                    MODO DE INSPEÇÃO SUPER ADMIN
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.88rem" }}>
                    Você está navegando na conta de: <strong style={{ color: "#FFF", textDecoration: "underline", textUnderlineOffset: "3px" }}>{user?.nome}</strong> <span style={{ color: "#FBBF24", opacity: 0.9 }}>({user?.email})</span>
                  </span>
                  <span style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#E2E8F0",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontSize: "0.72rem",
                    fontWeight: "800"
                  }}>
                    Base: {user?.base || user?.base_nome || "DevHub"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    const returnUser = localStorage.getItem("superAdminReturnUser");
                    const returnToken = localStorage.getItem("superAdminReturnToken");
                    if (returnUser) localStorage.setItem("userData", returnUser);
                    if (returnToken) localStorage.setItem("token", returnToken);
                    localStorage.removeItem("superAdminReturnUser");
                    localStorage.removeItem("superAdminReturnToken");
                    window.location.href = "/super-admin";
                  }
                }}
                style={{
                  background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                  color: "#0F172A",
                  border: "none",
                  borderRadius: "10px",
                  padding: "8px 18px",
                  fontWeight: "900",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(245, 158, 11, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(245, 158, 11, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(245, 158, 11, 0.4)";
                }}
              >
                <span>↩️ Sair e Voltar ao Painel Super Admin</span>
              </button>
            </div>

            {/* Floating Live Badge at bottom right */}
            <div style={{
              position: "fixed", bottom: "18px", right: "24px", zIndex: 99998,
              display: "flex", alignItems: "center", gap: "10px",
              background: "rgba(15, 23, 42, 0.94)",
              border: "1px solid rgba(245, 158, 11, 0.5)",
              borderRadius: "30px", padding: "8px 18px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(245, 158, 11, 0.25)",
              backdropFilter: "blur(14px)",
              pointerEvents: "none"
            }}>
              <span style={{
                width: "9px", height: "9px", borderRadius: "50%",
                background: "#10B981", boxShadow: "0 0 10px #10B981"
              }} />
              <span style={{ fontSize: "0.78rem", fontWeight: "800", color: "#FBBF24" }}>
                👑 Inspeção Super Admin: Visão de {user?.nome || "Aluno"}
              </span>
            </div>
          </>
        )}

        {/* Banner de Aviso de Manutenção para Admins */}
        {manutencaoState.ativo && isUserAdmin && (
          <div style={{
            backgroundColor: "#ef4444",
            color: "#ffffff",
            padding: "10px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: "600",
            fontSize: "14px",
            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
            position: "relative",
            zIndex: 101
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span>🚨 MODO DE MANUTENÇÃO ATIVO — Alunos estão bloqueados com a mensagem cadastrada. Você possui acesso VIP.</span>
            </div>
            <button
              onClick={() => {
                const novo = { ativo: false, mensagem: "" };
                setManutencaoState(novo);
                localStorage.setItem("devhub_manutencao", JSON.stringify(novo));
                window.dispatchEvent(new Event("devhub_manutencao_update"));
              }}
              style={{
                backgroundColor: "#ffffff",
                color: "#ef4444",
                border: "none",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "800",
                cursor: "pointer"
              }}
            >
              ✅ Desativar Manutenção Agora
            </button>
          </div>
        )}

        {/* Top Header Navbar */}
        <header style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: isDark ? "rgba(11, 15, 25, 0.97)" : "rgba(255, 255, 255, 0.97)",
          borderBottom: `1px solid ${colors.borderCard}`,
          padding: "14px 24px"
        }}>
          <div style={{ maxWidth: "100%", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            
            <div onClick={() => setAbaAtiva("inicio")} style={{ cursor: "pointer" }} title="Voltar ao Início">
              <DevHubLogo size="normal" />
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {abaAtiva !== "inicio" && (
                <button
                  onClick={() => setAbaAtiva("inicio")}
                  title="Voltar à Tela Principal (Hub de Aprendizado)"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "12px",
                    border: "1px solid rgba(139, 92, 246, 0.4)",
                    background: "linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)",
                    color: "#FFFFFF",
                    fontWeight: "800",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 4px 14px rgba(124, 58, 237, 0.3)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 6px 18px rgba(124, 58, 237, 0.45)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(124, 58, 237, 0.3)";
                  }}
                >
                  <Home size={15} color="#A855F7" />
                  <span>Voltar ao Hub</span>
                </button>
              )}
              {isSuperAdmin && (
                <button
                  onClick={() => router.push("/super-admin")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                    color: "#FFFFFF",
                    fontWeight: "800",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 4px 14px rgba(239, 68, 68, 0.4)",
                    transition: "all 0.2s ease"
                  }}
                >
                  <Shield size={14} />
                  <span>Painel Super Admin</span>
                </button>
              )}

              {/* Botão de Notificações com Badge */}
              <button
                onClick={() => setModalNotificacoesOpen(true)}
                style={{
                  position: "relative",
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  border: `1px solid ${colors.borderCard}`,
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#F1F5F9",
                  color: colors.textPrimary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                title="Central de Notificações"
              >
                <Bell size={18} />
                {unreadNotificacoesCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: "#EF4444",
                    color: "#FFFFFF",
                    fontSize: "10px",
                    fontWeight: "900",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.5)"
                  }}>
                    {unreadNotificacoesCount > 9 ? "9+" : unreadNotificacoesCount}
                  </span>
                )}
              </button>

              {/* Menu Dropdown do Usuário Logado */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "6px 12px 6px 6px",
                    borderRadius: "14px",
                    border: `1px solid ${colors.borderCard}`,
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#F1F5F9",
                    color: colors.textPrimary,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontWeight: "900",
                    fontSize: "14px"
                  }}>
                    {(user?.avatar_url || user?.avatar) ? (
                      <img src={user.avatar_url || user.avatar} alt="Foto" style={{ width: "100%", height: "100%", borderRadius: "10px", objectFit: "cover" }} />
                    ) : (
                      user?.nome ? user.nome.charAt(0).toUpperCase() : "U"
                    )}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: "800", lineHeight: "1.1" }}>
                      {user?.nome ? user.nome.split(" ")[0] : "Usuário"}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: colors.textSecondary }}>
                      {isAdmin ? (isSuperAdmin ? "Super Admin 👑" : "Admin 🛡️") : "Estudante 👤"}
                    </div>
                  </div>
                  <ChevronDown size={14} style={{ transform: userDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      onClick={() => setUserDropdownOpen(false)}
                      style={{ position: "fixed", inset: 0, zIndex: 998 }}
                    />
                    <div style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      width: "240px",
                      borderRadius: "18px",
                      backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                      border: `1px solid ${colors.borderCard}`,
                      boxShadow: isDark ? "0 16px 40px rgba(0,0,0,0.8)" : "0 10px 30px rgba(0,0,0,0.15)",
                      padding: "8px",
                      zIndex: 999
                    }}>
                      <div style={{ padding: "10px 12px", borderBottom: `1px solid ${colors.borderCard}`, marginBottom: "6px" }}>
                        <div style={{ fontSize: "0.88rem", fontWeight: "800", color: colors.textPrimary }}>
                          {user?.nome || "Usuário DevHub"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: colors.textSecondary, marginTop: "2px" }}>
                          {user?.email || "aluno@devhub.com"}
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        {/* Voltar ao Hub / Tela Principal */}
                        <button
                          onClick={() => {
                            setAbaAtiva("inicio");
                            setUserDropdownOpen(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "12px",
                            border: "1px solid rgba(139, 92, 246, 0.3)",
                            backgroundColor: "rgba(139, 92, 246, 0.12)",
                            color: colors.textPrimary,
                            fontSize: "13.5px",
                            fontWeight: "800",
                            cursor: "pointer",
                            marginBottom: "4px",
                            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(139, 92, 246, 0.25)";
                            e.currentTarget.style.transform = "translateX(4px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(139, 92, 246, 0.12)";
                            e.currentTarget.style.transform = "none";
                          }}
                        >
                          <div style={{
                            width: "30px", height: "30px", borderRadius: "9px",
                            backgroundColor: "rgba(139, 92, 246, 0.25)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#A855F7", flexShrink: 0
                          }}>
                            <Home size={16} />
                          </div>
                          <span>Voltar à Tela Principal</span>
                        </button>

                        {/* Editar Perfil */}
                        <button
                          onClick={() => {
                            setModalPerfilOpen(true);
                            setUserDropdownOpen(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "12px",
                            border: "none",
                            backgroundColor: "transparent",
                            color: colors.textPrimary,
                            fontSize: "13.5px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? "rgba(99, 102, 241, 0.14)" : "rgba(99, 102, 241, 0.08)";
                            e.currentTarget.style.transform = "translateX(4px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.transform = "none";
                          }}
                        >
                          <div style={{
                            width: "30px", height: "30px", borderRadius: "9px",
                            backgroundColor: "rgba(99, 102, 241, 0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#6366F1", flexShrink: 0
                          }}>
                            <User size={16} />
                          </div>
                          <span>Editar Perfil</span>
                        </button>

                        {/* Modo Escuro / Claro Toggle */}
                        <button
                          onClick={() => {
                            toggleTheme && toggleTheme();
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "12px",
                            border: "none",
                            backgroundColor: "transparent",
                            color: colors.textPrimary,
                            fontSize: "13.5px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? "rgba(245, 158, 11, 0.14)" : "rgba(245, 158, 11, 0.08)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{
                              width: "30px", height: "30px", borderRadius: "9px",
                              backgroundColor: "rgba(245, 158, 11, 0.15)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "#F59E0B", flexShrink: 0
                            }}>
                              {isDark ? <Sun size={16} /> : <Moon size={16} />}
                            </div>
                            <span>{isDark ? "Modo Claro" : "Modo Escuro"}</span>
                          </div>
                        </button>

                        {/* Arena Batalha 1v1 */}
                        <button
                          onClick={() => {
                            setAbaAtiva("games");
                            setUserDropdownOpen(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "12px",
                            border: "none",
                            backgroundColor: "transparent",
                            color: colors.textPrimary,
                            fontSize: "13.5px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? "rgba(239, 68, 68, 0.14)" : "rgba(239, 68, 68, 0.08)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <div style={{
                            width: "30px", height: "30px", borderRadius: "9px",
                            backgroundColor: "rgba(239, 68, 68, 0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#EF4444", flexShrink: 0
                          }}>
                            <Swords size={16} />
                          </div>
                          <span>Arena Batalha 1v1</span>
                        </button>

                        {/* Tickets & Suporte */}
                        <button
                          onClick={() => {
                            setModalTicketsOpen(true);
                            setUserDropdownOpen(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "12px",
                            border: "none",
                            backgroundColor: "transparent",
                            color: colors.textPrimary,
                            fontSize: "13.5px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? "rgba(56, 189, 248, 0.14)" : "rgba(56, 189, 248, 0.08)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <div style={{
                            width: "30px", height: "30px", borderRadius: "9px",
                            backgroundColor: "rgba(56, 189, 248, 0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#38BDF8", flexShrink: 0
                          }}>
                            <HelpCircle size={16} />
                          </div>
                          <span>Suporte & Tickets</span>
                        </button>

                        {/* Botão de Logout */}
                        <button
                          onClick={handleLogout}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "12px",
                            border: "none",
                            backgroundColor: "rgba(239, 68, 68, 0.12)",
                            color: "#EF4444",
                            fontSize: "13.5px",
                            fontWeight: "800",
                            cursor: "pointer",
                            marginTop: "6px",
                            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.25)";
                            e.currentTarget.style.boxShadow = "0 4px 14px rgba(239, 68, 68, 0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.12)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
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

        {/* BANNER GLOBAL DE MODO MANUTENÇÃO */}
        {manutencaoState.ativo && (
          <div style={{
            background: "linear-gradient(135deg, #b91c1c, #7f1d1d)",
            borderBottom: "2px solid #ef4444",
            color: "#ffffff",
            padding: "12px 24px",
            textAlign: "center",
            fontWeight: "800",
            fontSize: "0.88rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            boxShadow: "0 4px 20px rgba(239, 68, 68, 0.4)",
            position: "relative",
            zIndex: 90
          }}>
            <span style={{ fontSize: "1.2rem" }}>🔧</span>
            <span><strong>AVISO DE MANUTENÇÃO DA PLATAFORMA:</strong> {manutencaoState.mensagem || "A plataforma está passando por atualizações no sistema. Voltamos em breve!"}</span>
          </div>
        )}

        {/* CONTÊINER PRINCIPAL: SIDEBAR + CONTEÚDO */}
        <div style={{
          width: "100%",
          maxWidth: "100%",
          margin: "0",
          padding: (abaAtiva === "inicio" || abaAtiva === "super_admin") ? "0" : "20px 24px",
          display: (abaAtiva === "inicio" || abaAtiva === "super_admin") ? "block" : "grid",
          gridTemplateColumns: sidebarRecolhida ? "72px 1fr" : "260px 1fr",
          gap: "24px",
          position: "relative",
          zIndex: 1,
          transition: "grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}>

          {/* ===== SIDEBAR LATERAL NOVO LAYOUT MODERNO (EXIBIDA APENAS AO ENTRAR EM UM MÓDULO ALUNO) ===== */}
          {abaAtiva !== "inicio" && abaAtiva !== "super_admin" && (
            <aside style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.75)" : "#FFFFFF",
              border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "#E2E8F0"}`,
              borderRadius: "22px",
              padding: sidebarRecolhida ? "18px 10px" : "20px 16px",
              height: "fit-content",
              maxHeight: "calc(100vh - 110px)",
              overflowY: "auto",
              position: "sticky",
              top: "85px",
              boxShadow: isDark ? "0 16px 36px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)" : "0 10px 30px rgba(0,0,0,0.06)",
              backdropFilter: "blur(18px)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }}>
            {/* Header da Sidebar com botão de fechar/abrir */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: sidebarRecolhida ? "center" : "space-between",
              marginBottom: "20px",
              paddingBottom: "12px",
              borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0"}`
            }}>
              {!sidebarRecolhida && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    width: "30px", height: "30px", borderRadius: "10px",
                    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#FFF",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)"
                  }}>
                    <Layers size={16} />
                  </span>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: "900",
                    color: colors.textPrimary,
                    textTransform: "uppercase",
                    letterSpacing: "0.09em"
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
                  background: sidebarRecolhida 
                    ? "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" 
                    : (isDark ? "rgba(255, 255, 255, 0.08)" : "#F1F5F9"),
                  border: sidebarRecolhida ? "1.5px solid #a855f7" : `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : colors.borderCard}`,
                  color: sidebarRecolhida ? "#FFFFFF" : colors.textPrimary,
                  borderRadius: "12px",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: sidebarRecolhida ? "0 4px 16px rgba(99, 102, 241, 0.4)" : "none",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  margin: sidebarRecolhida ? "0 auto" : "0"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = sidebarRecolhida ? "0 4px 16px rgba(59, 130, 246, 0.3)" : "none";
                }}
              >
                {sidebarRecolhida ? <ChevronRight size={20} /> : <ChevronLeft size={18} />}
              </button>
            </div>

            {/* Navegação por Itens do Catálogo */}
            <nav style={{ display: "flex", flexDirection: "column", gap: sidebarRecolhida ? "12px" : "8px" }}>
              {[
                { id: "visao_geral", label: "Visão Geral", sublabel: "Dashboard do Aluno", icon: Home, color: "#3B82F6", badge: "Dashboard" },
                { id: "aulas", label: "Aulas & Guia", sublabel: "Formação Full Stack", icon: BookOpen, color: "#8B5CF6", badge: `${categorias[0]?.slides?.length || 0}` },
                { id: "agenda", label: "Calendário & Agenda", sublabel: "Aulas & Reuniões", icon: Calendar, color: "#6366F1", badge: "Ao Vivo" },
                { id: "games", label: "Laboratório Prático", sublabel: "Projetos & Exercícios", icon: Terminal, color: "#A855F7", badge: "Prática" },
                { id: "caderno", label: "Caderno de Estudos", sublabel: "Anotações Dev", icon: BookMarked, color: "#38BDF8", badge: "Notas" },
                { id: "playground", label: "Code Playground", sublabel: "Executor Web", icon: Code, color: "#7C3AED", badge: "Novo" },
                { id: "ranking", label: "Ranking & Desempenho", sublabel: "Desempenho Acadêmico", icon: Award, color: "#2563EB", badge: "Ranking" },
                { id: "evolucao", label: "Sua Evolução", sublabel: "Linha do Tempo", icon: Zap, color: "#9333EA", badge: "Trilha" },
                { id: "provas-online", label: "Provas & Avaliações", sublabel: "Boletim & Certificados", icon: CheckSquare, color: "#06B6D4", badge: "Avaliações" }
              ]
                .filter((item) => isModuloLiberado(item.id))
                .map((item) => {
                const isAtivo = abaAtiva === item.id;
                const IconComponent = item.icon;

                if (sidebarRecolhida) {
                  return (
                    <div key={item.id} style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                      {/* Marcador Ativo em Neon na Lateral */}
                      {isAtivo && (
                        <span style={{
                          position: "absolute",
                          left: "-10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "4px",
                          height: "22px",
                          borderRadius: "4px",
                          backgroundColor: item.color,
                          boxShadow: `0 0 12px ${item.color}, 0 0 4px ${item.color}`,
                          zIndex: 2
                        }} />
                      )}

                      <button
                        onClick={() => {
                          setAbaAtiva(item.id);
                          if (item.id === "aulas") setMenuAulasAberto(true);
                        }}
                        title={`${item.label} — ${item.sublabel}`}
                        style={{
                          width: "46px",
                          height: "46px",
                          borderRadius: "15px",
                          border: isAtivo ? `1.5px solid ${item.color}` : `1px solid ${item.color}44`,
                          background: isAtivo
                            ? `linear-gradient(135deg, ${item.color}45 0%, ${item.color}20 100%)`
                            : (isDark ? `linear-gradient(135deg, ${item.color}15 0%, rgba(15, 23, 42, 0.6) 100%)` : `${item.color}12`),
                          color: item.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                          boxShadow: isAtivo 
                            ? `0 0 24px ${item.color}60, 0 6px 18px ${item.color}35, inset 0 1px 0 rgba(255, 255, 255, 0.3)` 
                            : `0 2px 10px rgba(0, 0, 0, 0.2)`,
                          position: "relative"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.16) translateY(-2px)";
                          e.currentTarget.style.boxShadow = `0 0 24px ${item.color}88, 0 8px 20px ${item.color}45`;
                          e.currentTarget.style.borderColor = item.color;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.boxShadow = isAtivo 
                            ? `0 0 24px ${item.color}60, 0 6px 18px ${item.color}35, inset 0 1px 0 rgba(255, 255, 255, 0.3)` 
                            : `0 2px 10px rgba(0, 0, 0, 0.2)`;
                          e.currentTarget.style.borderColor = isAtivo ? item.color : `${item.color}44`;
                        }}
                      >
                        <IconComponent size={21} style={{ color: item.color, filter: isAtivo ? `drop-shadow(0 0 6px ${item.color})` : "none" }} />
                      </button>
                    </div>
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
                        } else {
                          setMenuAulasAberto(false);
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "16px",
                        border: isAtivo ? `1.5px solid ${item.color}` : `1px solid ${isDark ? "rgba(255, 255, 255, 0.07)" : "#E2E8F0"}`,
                        borderLeft: `4px solid ${item.color}`,
                        background: isAtivo 
                          ? `linear-gradient(135deg, ${item.color}35 0%, rgba(15, 23, 42, 0.75) 100%)` 
                          : (isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(241, 245, 249, 0.7)"),
                        color: isAtivo ? "#FFFFFF" : colors.textPrimary,
                        fontWeight: isAtivo ? "800" : "600",
                        fontSize: "13.5px",
                        cursor: "pointer",
                        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                        boxShadow: isAtivo 
                          ? `0 0 22px ${item.color}50, 0 6px 18px ${item.color}30, inset 0 1px 0 rgba(255, 255, 255, 0.2)` 
                          : "0 2px 8px rgba(0, 0, 0, 0.1)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateX(5px)";
                        e.currentTarget.style.borderColor = item.color;
                        e.currentTarget.style.boxShadow = `0 6px 20px ${item.color}40`;
                        e.currentTarget.style.background = isAtivo
                          ? `linear-gradient(135deg, ${item.color}45 0%, rgba(15, 23, 42, 0.85) 100%)`
                          : `linear-gradient(135deg, ${item.color}22 0%, rgba(30, 41, 59, 0.7) 100%)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.borderColor = isAtivo ? item.color : (isDark ? "rgba(255, 255, 255, 0.07)" : "#E2E8F0");
                        e.currentTarget.style.boxShadow = isAtivo 
                          ? `0 0 22px ${item.color}50, 0 6px 18px ${item.color}30, inset 0 1px 0 rgba(255, 255, 255, 0.2)` 
                          : "0 2px 8px rgba(0, 0, 0, 0.1)";
                        e.currentTarget.style.background = isAtivo 
                          ? `linear-gradient(135deg, ${item.color}35 0%, rgba(15, 23, 42, 0.75) 100%)` 
                          : (isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(241, 245, 249, 0.7)");
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "12px",
                          background: `linear-gradient(135deg, ${item.color}45 0%, ${item.color}20 100%)`,
                          border: `1px solid ${item.color}66`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: item.color,
                          flexShrink: 0,
                          boxShadow: `0 4px 12px ${item.color}35`
                        }}>
                          <IconComponent size={20} style={{ filter: `drop-shadow(0 0 4px ${item.color})` }} />
                        </div>

                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontSize: "13.5px", fontWeight: "800", lineHeight: "1.2", color: isAtivo ? "#FFFFFF" : colors.textPrimary }}>{item.label}</div>
                          <div style={{ fontSize: "11px", color: isAtivo ? `${item.color}` : colors.textSecondary, marginTop: "2px", fontWeight: "600" }}>{item.sublabel}</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {item.badge && (
                          <span style={{
                            fontSize: "10px",
                            fontWeight: "800",
                            padding: "4px 10px",
                            borderRadius: "10px",
                            background: `linear-gradient(135deg, ${item.color}30 0%, ${item.color}15 100%)`,
                            color: item.color,
                            border: `1px solid ${item.color}55`,
                            boxShadow: `0 2px 8px ${item.color}25`
                          }}>
                            {item.badge}
                          </span>
                        )}
                        {isAulasItem && (
                          <ChevronDown
                            size={16}
                            style={{
                              transform: menuAulasAberto ? "rotate(180deg)" : "rotate(0deg)",
                              transition: "transform 0.25s ease",
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
          )}

          {/* ===== ÁREA DE CONTEÚDO PRINCIPAL ===== */}
          <main style={{ minWidth: 0 }}>
            {/* Banner de Anúncio Global (se houver) */}
            {(() => {
              try {
                const raw = typeof window !== "undefined" ? localStorage.getItem("devhub_anuncios_globais") : null;
                if (raw) {
                  const lista = JSON.parse(raw);
                  if (lista && lista.length > 0) {
                    const top = lista[0];
                    return (
                      <div style={{
                        padding: "14px 20px",
                        borderRadius: "18px",
                        background: "linear-gradient(135deg, rgba(249, 115, 22, 0.18), rgba(234, 88, 12, 0.18))",
                        border: "1px solid rgba(249, 115, 22, 0.4)",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "14px",
                        boxShadow: "0 8px 24px rgba(249, 115, 22, 0.15)"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <div style={{
                            width: "40px", height: "40px", borderRadius: "12px",
                            backgroundColor: "#f97316", display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#FFF", flexShrink: 0, boxShadow: "0 4px 12px rgba(249, 115, 22, 0.4)"
                          }}>
                            <Megaphone size={20} />
                          </div>
                          <div>
                            <div style={{ fontSize: "0.95rem", fontWeight: "900", color: "#FFF" }}>
                              📢 {top.titulo}
                            </div>
                            {top.mensagem && (
                              <div style={{ fontSize: "0.84rem", color: "#fdba74", marginTop: "2px" }}>
                                {top.mensagem}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                }
              } catch (e) {}
              return null;
            })()}
            {!isModuloLiberado(abaAtiva) ? (
              <div style={{
                backgroundColor: isDark ? "rgba(23, 28, 44, 0.9)" : "#FFFFFF",
                border: "2px dashed rgba(239, 68, 68, 0.4)",
                borderRadius: "24px",
                padding: "60px 30px",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                margin: "20px 0"
              }}>
                <div style={{
                  width: "70px", height: "70px", borderRadius: "50%",
                  backgroundColor: "rgba(239,68,68,0.15)", border: "2px solid rgba(239,68,68,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px auto", color: "#EF4444"
                }}>
                  <Shield size={36} />
                </div>
                <h2 style={{ fontSize: "1.6rem", fontWeight: "900", color: isDark ? "#FFF" : "#0F172A", margin: "0 0 10px 0" }}>
                  🔒 Módulo Trancado pelo Administrador
                </h2>
                <p style={{ fontSize: "0.95rem", color: colors.textSecondary, maxWidth: "480px", margin: "0 auto 24px auto", lineHeight: "1.5" }}>
                  O seu acesso a esta seção foi temporariamente bloqueado para a sua conta por decisão do seu professor ou administrador.
                </p>
                <button
                  onClick={() => setAbaAtiva("aulas")}
                  style={{
                    padding: "12px 24px", backgroundColor: "#3B82F6", color: "#FFF",
                    border: "none", borderRadius: "14px", fontWeight: "800", fontSize: "0.9rem",
                    cursor: "pointer", boxShadow: "0 4px 16px rgba(59,130,246,0.4)", fontFamily: "inherit"
                  }}
                >
                  Voltar para as Aulas
                </button>
              </div>
            ) : (
              <>
            {abaAtiva === "inicio" && (
              <ModuleHubLauncher
                user={user}
                onSelectAba={(abaId) => {
                  if (abaId === "super_admin") {
                    router.push("/super-admin");
                  } else {
                    setAbaAtiva(abaId);
                  }
                }}
                onOpenPerfil={() => setModalPerfilOpen(true)}
                onOpenTickets={() => setModalTicketsOpen(true)}
                onOpenDevIa={() => setModalDevIaOpen(true)}
                onOpenNotificacoes={() => setModalNotificacoesOpen(true)}
              />
            )}
            {abaAtiva === "visao_geral" && (
              <VisaoGeralSection
                user={user}
                setAbaAtiva={(abaId) => setAbaAtiva(abaId)}
                isDark={isDark}
                agendaAulas={agendaAulas}
              />
            )}
            {/* ABA 1: AULAS DE ESTUDO */}
            {abaAtiva === "aulas" && <AulasSection user={user} />}


            {/* ABA 2: CALENDÁRIO & AGENDA MENSAL/DIÁRIA */}
            {abaAtiva === "agenda" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                      📅 Calendário da Agenda de Reuniões & Aulas
                    </h2>
                    <p style={{ color: colors.textSecondary, fontSize: "13px", marginTop: "2px" }}>
                      Clique no botão ao lado para agendar reuniões ou selecione um dia no calendário.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <button
                      onClick={handleAbrirChamadaInstantanea}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                        color: "#FFF",
                        border: "none",
                        fontWeight: "900",
                        fontSize: "13.5px",
                        cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(239, 68, 68, 0.45)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      ⚡ Iniciar Chamada Instantânea (Ao Vivo Agora)
                    </button>

                    <button
                      onClick={() => handleAbrirNovaAula(diaSelecionado)}
                      style={{
                        padding: "10px 18px",
                        borderRadius: "12px",
                        backgroundColor: "#3B82F6",
                        color: "#FFF",
                        border: "none",
                        fontWeight: "800",
                        fontSize: "13px",
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      📅 Agendar Aula Futura
                    </button>
                  </div>
                </div>

                {/* SELETOR DE MÊS / ANO & GRADE DO CALENDÁRIO - REDESIGN 2026 FUTURISTIC GLASSMORPHISM */}
                <div style={{
                  backgroundColor: isDark ? "rgba(15, 23, 42, 0.8)" : "#FFFFFF",
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${isDark ? "rgba(59, 130, 246, 0.25)" : "#E2E8F0"}`,
                  borderRadius: "24px",
                  padding: "24px 28px",
                  marginBottom: "24px",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.1)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px", flexWrap: "wrap", gap: "12px" }}>
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
                        padding: "10px 18px",
                        borderRadius: "14px",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        backgroundColor: isDark ? "rgba(30, 41, 59, 0.7)" : "#F1F5F9",
                        color: colors.textPrimary,
                        fontWeight: "800",
                        cursor: "pointer",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      ◀ Mês Anterior
                    </button>

                    <div style={{
                      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)",
                      border: "1px solid rgba(59, 130, 246, 0.35)",
                      borderRadius: "16px",
                      padding: "8px 24px",
                      boxShadow: "0 4px 20px rgba(59, 130, 246, 0.2)"
                    }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#38BDF8", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                        🗓️ {nomesMeses[mesAtual]} de {anoAtual}
                      </h3>
                    </div>

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
                        padding: "10px 18px",
                        borderRadius: "14px",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        backgroundColor: isDark ? "rgba(30, 41, 59, 0.7)" : "#F1F5F9",
                        color: colors.textPrimary,
                        fontWeight: "800",
                        cursor: "pointer",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      Mês Seguinte ▶
                    </button>
                  </div>

                  {/* GRADE DE DIAS DO MÊS */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px", textAlign: "center" }}>
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                      <div key={d} style={{ fontSize: "11px", fontWeight: "900", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px", paddingBottom: "8px" }}>
                        {d}
                      </div>
                    ))}

                    {getDiasDoMes(mesAtual, anoAtual).map((item, idx) => {
                      if (!item) {
                        return <div key={`empty-${idx}`} style={{ minHeight: "72px" }} />;
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
                            minHeight: "72px",
                            padding: "10px",
                            borderRadius: "16px",
                            border: isSelecionado 
                              ? "2px solid #3B82F6" 
                              : isHoje 
                              ? "2px solid #10B981" 
                              : `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0"}`,
                            backgroundColor: isSelecionado
                              ? (isDark ? "rgba(59, 130, 246, 0.25)" : "#E0F2FE")
                              : isHoje
                              ? (isDark ? "rgba(16, 185, 129, 0.2)" : "#ECFDF5")
                              : (reunioesNoDia.length > 0 ? (isDark ? "rgba(30, 41, 59, 0.8)" : "#F8FAFC") : "rgba(15, 23, 42, 0.4)"),
                            boxShadow: isSelecionado
                              ? "0 0 20px rgba(59, 130, 246, 0.4)"
                              : isHoje
                              ? "0 0 15px rgba(16, 185, 129, 0.3)"
                              : "none",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                            transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ fontSize: "14px", fontWeight: isSelecionado || isHoje ? "900" : "700", color: isSelecionado ? "#3B82F6" : isHoje ? "#10B981" : colors.textPrimary }}>
                              {item.diaNum}
                            </span>
                            {isHoje && (
                              <span style={{ fontSize: "9px", fontWeight: "900", color: "#10B981", textTransform: "uppercase", backgroundColor: "rgba(16,185,129,0.2)", padding: "1px 4px", borderRadius: "4px" }}>
                                Hoje
                              </span>
                            )}
                          </div>

                          {reunioesNoDia.length > 0 && (
                            <span style={{
                              fontSize: "10.5px",
                              fontWeight: "900",
                              padding: "3px 10px",
                              borderRadius: "9999px",
                              background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                              color: "#FFFFFF",
                              whiteSpace: "nowrap",
                              marginTop: "4px",
                              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.5)"
                            }}>
                              📅 {reunioesNoDia.length} {reunioesNoDia.length === 1 ? "aula" : "aulas"}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PAINEL DE REUNIÕES NO DIA SELECIONADO — REDESIGN ULTRA MODERN 2026 */}
                <div style={{
                  backgroundColor: isDark ? "rgba(15, 23, 42, 0.75)" : "#FFFFFF",
                  backdropFilter: "blur(16px)",
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "#E2E8F0"}`,
                  borderRadius: "24px",
                  padding: "24px",
                  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                    gap: "14px",
                    paddingBottom: "16px",
                    borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0"}`
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <div style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)"
                      }}>
                        📍
                      </div>
                      <div>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "900", margin: 0, color: isDark ? "#FFF" : "#0F172A" }}>
                          Reuniões & Aulas Marcadas
                        </h3>
                        <span style={{ fontSize: "0.82rem", color: isDark ? "#94A3B8" : "#64748B", fontWeight: "600" }}>
                          Exibindo compromissos em <strong style={{ color: "#3B82F6" }}>{diaSelecionado}</strong>
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{
                        fontSize: "12px",
                        fontWeight: "800",
                        padding: "6px 14px",
                        borderRadius: "12px",
                        backgroundColor: "rgba(59, 130, 246, 0.15)",
                        color: "#3B82F6",
                        border: "1px solid rgba(59, 130, 246, 0.3)"
                      }}>
                        📅 {agendaAulas.filter(a => a.data === diaSelecionado).length} {agendaAulas.filter(a => a.data === diaSelecionado).length === 1 ? "Evento" : "Eventos"}
                      </span>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setFormAulaTitulo("");
                            setFormAulaDescricao("");
                            setFormAulaHorario("19:00 - 20:30");
                            setFormAulaData(diaSelecionado || hojeBR);
                            setModalCriarAulaAberto(true);
                          }}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                            color: "#FFF",
                            border: "none",
                            fontSize: "12px",
                            fontWeight: "800",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: "0 4px 16px rgba(59, 130, 246, 0.4)",
                            transition: "all 0.2s"
                          }}
                        >
                          ➕ Agendar Aula
                        </button>
                      )}
                    </div>
                  </div>

                  {agendaAulas.filter(a => a.data === diaSelecionado).length === 0 ? (
                    <div style={{
                      padding: "40px 20px",
                      textAlign: "center",
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#F8FAFC",
                      borderRadius: "16px",
                      border: `1px dashed ${isDark ? "rgba(255, 255, 255, 0.1)" : "#CBD5E1"}`
                    }}>
                      <div style={{ fontSize: "32px", marginBottom: "8px" }}>📆</div>
                      <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "800", color: isDark ? "#FFF" : "#0F172A" }}>
                        Nenhuma reunião ou aula agendada para {diaSelecionado}
                      </h4>
                      <p style={{ margin: 0, fontSize: "13px", color: isDark ? "#94A3B8" : "#64748B" }}>
                        Selecione outra data no calendário acima ou agende um novo encontro ao vivo.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {agendaAulas.filter(a => a.data === diaSelecionado).map((aula) => {
                        const isAoVivo = aula.status && aula.status.includes("Ao Vivo");
                        const isConcluida = aula.status && aula.status.includes("Concluída");
                        const accentColor = isAoVivo ? "#EF4444" : isConcluida ? "#10B981" : "#3B82F6";

                        return (
                          <div
                            key={aula.id}
                            style={{
                              backgroundColor: isDark
                                ? isAoVivo ? "rgba(239, 68, 68, 0.08)" : "rgba(15, 23, 42, 0.9)"
                                : isAoVivo ? "rgba(239, 68, 68, 0.05)" : "#F8FAFC",
                              border: `1px solid ${isAoVivo ? "rgba(239, 68, 68, 0.4)" : isDark ? "rgba(255, 255, 255, 0.1)" : "#E2E8F0"}`,
                              borderLeft: `5px solid ${accentColor}`,
                              borderRadius: "18px",
                              padding: "20px 22px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: "16px",
                              boxShadow: isAoVivo ? "0 8px 30px rgba(239, 68, 68, 0.2)" : "0 4px 20px rgba(0, 0, 0, 0.15)",
                              transition: "transform 0.2s, box-shadow 0.2s"
                            }}
                          >
                            {/* LADO ESQUERDO: INFOS DA AULA */}
                            <div style={{ flex: "1 1 320px", minWidth: "280px" }}>
                              {/* TAGS HEADER */}
                              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px", flexWrap: "wrap" }}>
                                {/* BADGE AO VIVO / STATUS COM PULSO */}
                                <span style={{
                                  fontSize: "11px",
                                  fontWeight: "900",
                                  padding: "4px 10px",
                                  borderRadius: "20px",
                                  backgroundColor: `${accentColor}22`,
                                  color: accentColor,
                                  border: `1px solid ${accentColor}55`,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px"
                                }}>
                                  {isAoVivo && <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#EF4444", display: "inline-block" }} />}
                                  {aula.status}
                                </span>

                                {/* HORÁRIO */}
                                <span style={{
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  color: isDark ? "#CBD5E1" : "#475569",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0",
                                  padding: "4px 10px",
                                  borderRadius: "8px"
                                }}>
                                  ⏰ {aula.horario}
                                </span>

                                {/* BASE */}
                                <span style={{
                                  fontSize: "11px",
                                  fontWeight: "800",
                                  padding: "3px 8px",
                                  borderRadius: "8px",
                                  backgroundColor: isDark ? "rgba(59,130,246,0.15)" : "#EFF6FF",
                                  color: "#3B82F6",
                                  border: "1px solid rgba(59,130,246,0.3)"
                                }}>
                                  🏢 {aula.base_nome || "ContabHub"}
                                </span>

                                {/* CARGA HORÁRIA */}
                                <span style={{
                                  fontSize: "11px",
                                  fontWeight: "800",
                                  padding: "3px 8px",
                                  borderRadius: "8px",
                                  backgroundColor: isDark ? "rgba(16,185,129,0.15)" : "#ECFDF5",
                                  color: "#10B981",
                                  border: "1px solid rgba(16,185,129,0.3)"
                                }}>
                                  🎓 {aula.carga_horaria || "2h"}
                                </span>
                              </div>

                              {/* TÍTULO DA AULA */}
                              <h4 style={{
                                fontSize: "1.1rem",
                                fontWeight: "900",
                                margin: "0 0 6px 0",
                                color: isDark ? "#FFFFFF" : "#0F172A",
                                lineHeight: "1.3"
                              }}>
                                {aula.titulo}
                              </h4>

                              {/* DESCRIÇÃO */}
                              {aula.descricao && (
                                <p style={{
                                  fontSize: "13px",
                                  color: isDark ? "#94A3B8" : "#64748B",
                                  margin: "0 0 10px 0",
                                  lineHeight: "1.4"
                                }}>
                                  {aula.descricao}
                                </p>
                              )}

                              {/* INSTRUTOR BADGE */}
                              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: isDark ? "#38BDF8" : "#0284C7", fontWeight: "700" }}>
                                <span>🧑‍🏫 Conduzido por:</span>
                                <span style={{ backgroundColor: isDark ? "rgba(56, 189, 248, 0.12)" : "#E0F2FE", padding: "2px 8px", borderRadius: "6px", color: isDark ? "#38BDF8" : "#0369A1", fontWeight: "800" }}>
                                  {aula.instrutor ? aula.instrutor.replace(/\s*\(.*?\)/, "").trim() : "Superadmin"}
                                </span>
                              </div>
                            </div>

                            {/* LADO DIREITO: BARRA DE AÇÕES LIMPA E ULTRA MODERNA */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end", flexShrink: 0 }}>
                              {/* BOTÃO PRINCIPAL HERO DA CHAMADA */}
                              <button
                                onClick={() => handleEntrarVideoChamada(aula)}
                                style={{
                                  padding: "10px 20px",
                                  borderRadius: "14px",
                                  background: isAoVivo
                                    ? "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)"
                                    : (aula.link && aula.link.includes("zoom.us"))
                                    ? "linear-gradient(135deg, #2D8CFF 0%, #1D4ED8 100%)"
                                    : (aula.link && aula.link.includes("meet.google"))
                                    ? "linear-gradient(135deg, #10B981 0%, #047857 100%)"
                                    : "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                                  color: "#FFFFFF",
                                  border: "none",
                                  fontSize: "13px",
                                  fontWeight: "900",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  cursor: "pointer",
                                  boxShadow: isAoVivo
                                    ? "0 0 24px rgba(239, 68, 68, 0.6)"
                                    : "0 6px 20px rgba(59, 130, 246, 0.35)",
                                  transition: "all 0.2s"
                                }}
                              >
                                {aula.link && aula.link.includes("zoom.us")
                                  ? "🔵 Entrar via Zoom"
                                  : aula.link && aula.link.includes("meet.google")
                                  ? "🟢 Entrar via Google Meet"
                                  : isAoVivo
                                  ? "🔴 Entrar na Aula Ao Vivo (Nativa)"
                                  : "💻 Entrar na VídeoChamada Nativa"}
                              </button>

                              {/* BARRA DE AÇÕES SECUNDÁRIAS (REPRISE, PRESENÇAS, EDITAR, DELETAR) */}
                              <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                                {/* BOTÃO REPRISE */}
                                {(aula.link_gravacao || aula.status.includes("Reprise") || isConcluida) && (
                                  <button
                                    onClick={() => handleAbrirReprise(aula)}
                                    style={{
                                      padding: "7px 12px",
                                      borderRadius: "10px",
                                      backgroundColor: "rgba(168, 85, 247, 0.15)",
                                      color: "#A855F7",
                                      border: "1px solid rgba(168, 85, 247, 0.35)",
                                      fontSize: "11.5px",
                                      fontWeight: "800",
                                      cursor: "pointer",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "5px"
                                    }}
                                  >
                                    📹 Reprise
                                  </button>
                                )}

                                {/* BOTÃO PRESENÇAS (ADMIN) */}
                                {isAdmin && (
                                  <button
                                    onClick={() => handleVerPresencas(aula)}
                                    style={{
                                      padding: "7px 12px",
                                      borderRadius: "10px",
                                      backgroundColor: "rgba(59, 130, 246, 0.12)",
                                      color: "#3B82F6",
                                      border: "1px solid rgba(59, 130, 246, 0.3)",
                                      cursor: "pointer",
                                      fontSize: "11.5px",
                                      fontWeight: "800",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "5px"
                                    }}
                                    title="Ver check-ins e presenças da aula"
                                  >
                                    📊 Presenças
                                  </button>
                                )}

                                {/* ALTERNAR CONCLUÍDA (ADMIN) */}
                                {isAdmin && (
                                  <button
                                    onClick={() => {
                                      const proximoStatus = isConcluida ? "Agendada 📅" : "Concluída ✅";
                                      const statusCor = proximoStatus.includes("Concluída") ? "#10B981" : "#3B82F6";
                                      const listaAtualizada = agendaAulas.map(item => item.id === aula.id ? { ...item, status: proximoStatus, statusCor, status_cor: statusCor } : item);
                                      salvarAgendaLS(listaAtualizada, null, null, aula.id, { ...aula, status: proximoStatus, statusCor, status_cor: statusCor });
                                    }}
                                    title="Alternar entre Concluída e Agendada"
                                    style={{
                                      padding: "7px 12px",
                                      borderRadius: "10px",
                                      backgroundColor: isConcluida ? "rgba(16, 185, 129, 0.15)" : (isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0"),
                                      color: isConcluida ? "#10B981" : (isDark ? "#CBD5E1" : "#475569"),
                                      border: `1px solid ${isConcluida ? "rgba(16, 185, 129, 0.35)" : (isDark ? "rgba(255,255,255,0.12)" : "#CBD5E1")}`,
                                      cursor: "pointer",
                                      fontSize: "11.5px",
                                      fontWeight: "800"
                                    }}
                                  >
                                    {isConcluida ? "✅ Concluída" : "Marcar Concluída"}
                                  </button>
                                )}

                                {/* BOTÃO EDITAR (ADMIN) */}
                                {isAdmin && (
                                  <button
                                    onClick={() => handleAbrirEditarAula(aula)}
                                    title="Editar aula"
                                    style={{
                                      padding: "7px 10px",
                                      borderRadius: "10px",
                                      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0",
                                      color: isDark ? "#CBD5E1" : "#475569",
                                      border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#CBD5E1"}`,
                                      cursor: "pointer",
                                      fontSize: "11.5px",
                                      fontWeight: "700"
                                    }}
                                  >
                                    ✏️
                                  </button>
                                )}

                                {/* BOTÃO EXCLUIR (ADMIN) */}
                                {isAdmin && (
                                  <button
                                    onClick={() => handleExcluirAula(aula.id)}
                                    title="Excluir aula"
                                    style={{
                                      padding: "7px 10px",
                                      borderRadius: "10px",
                                      backgroundColor: "rgba(239, 68, 68, 0.15)",
                                      color: "#EF4444",
                                      border: "1px solid rgba(239, 68, 68, 0.3)",
                                      cursor: "pointer",
                                      fontSize: "11.5px",
                                      fontWeight: "700"
                                    }}
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ABA: CATÁLOGO DE JOGOS & LABORATÓRIO (Batalha de Código + Programar em Dupla + Mini-Sistemas) */}
            {(abaAtiva === "games" || abaAtiva === "mini_sistemas") && (
              <GameCatalogModule 
                user={user} 
                isDark={isDark} 
                colors={colors} 
                relatorioAlunos={relatorioAlunos} 
                initialJogo={abaAtiva === "mini_sistemas" || targetProjetoId ? "mini_sistemas" : null}
                targetProjetoId={targetProjetoId}
              />
            )}

            {/* ABA: CADERNO DE ESTUDOS */}
            {abaAtiva === "caderno" && (
              <CadernoEstudosModule user={user} isDark={isDark} colors={colors} />
            )}

            {/* ABA: CODE PLAYGROUND WEB */}
            {abaAtiva === "playground" && (
              <CodePlaygroundModule initialCode={targetSnippetCodigo} />
            )}

            {/* ABA 3: HALL DA FAMA / RANKING DE DEVS */}
            {abaAtiva === "ranking" && (
              <HallDaFamaModule isDark={isDark} colors={colors} user={user} />
            )}

            {/* ABA 5: PROVAS & NOTAS DE PROVA (MÓDULO UNIFICADO) */}
            {(abaAtiva === "provas-online" || abaAtiva === "notas") && (() => {
              const subAba = abaAtiva === "notas" ? (abaSubProvas === "provas" ? "minhas_notas" : abaSubProvas) : abaSubProvas;
              const hoje = new Date();
              const diaSemanaHoje = hoje.getDay();
              const provaDoDia = PROVAS_DIARIAS.find(p => p.diaSemana === diaSemanaHoje);
              const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

              // Função helper para renderizar card de prova
              const renderCardProva = (prova, isDiaria = false) => {
                const ehPdf = prova.tipo === "pdf";
                const partesData = prova.dataLimite ? prova.dataLimite.split("/") : ["2099","12","31"];
                const dataExp = prova.dataLimite
                  ? new Date(`${partesData[2]}-${partesData[1]}-${partesData[0]}T23:59:59`)
                  : new Date("2099-12-31");
                const expirada = new Date() > dataExp;
                const isFutura = isDiaria && (typeof prova.diaSemana === "number") && (prova.diaSemana > diaSemanaHoje);
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
                      background: isDark
                        ? (ehPdf
                          ? "linear-gradient(145deg, rgba(251, 146, 60, 0.12) 0%, rgba(15, 23, 42, 0.75) 100%)"
                          : "linear-gradient(145deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.75) 100%)")
                        : "linear-gradient(145deg, rgba(251, 146, 60, 0.05) 0%, #FFFFFF 100%)",
                      border: `1.5px solid ${ehPdf ? (isDark ? "rgba(251,146,60,0.35)" : "rgba(251,146,60,0.25)") : (isDark ? "rgba(245,158,11,0.35)" : "rgba(245,158,11,0.25)")}`,
                      borderRadius: "20px",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "18px",
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.3)" : "0 8px 24px rgba(0,0,0,0.06)",
                      opacity: isFutura ? 0.85 : 1
                    }}
                  >
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: "4px",
                      background: ehPdf
                        ? "linear-gradient(90deg, #FB923C, #F97316, #FBBF24)"
                        : (expirada
                          ? "linear-gradient(90deg, #EF4444, #F59E0B)"
                          : "linear-gradient(90deg, #F59E0B, #10B981, #3B82F6)")
                    }} />

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                          {isFutura ? (
                            <span style={{ fontSize: "10px", fontWeight: "900", padding: "3px 10px", borderRadius: "10px", backgroundColor: "rgba(234,179,8,0.15)", color: "#EAB308", border: "1px solid rgba(234,179,8,0.35)" }}>🔒 AGENDADA ({diasSemana[prova.diaSemana]})</span>
                          ) : expirada ? (
                            <span style={{ fontSize: "10px", fontWeight: "900", padding: "3px 10px", borderRadius: "10px", backgroundColor: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.35)" }}>⌛ ENCERRADA</span>
                          ) : provaJaRealizada ? (
                            <span style={{ fontSize: "10px", fontWeight: "900", padding: "3px 10px", borderRadius: "10px", backgroundColor: "rgba(168,85,247,0.15)", color: "#A855F7", border: "1px solid rgba(168,85,247,0.35)" }}>🔒 REALIZADA</span>
                          ) : (
                            <span style={{ fontSize: "10px", fontWeight: "900", padding: "3px 10px", borderRadius: "10px", backgroundColor: "rgba(16,185,129,0.15)", color: "#10B981", border: "1px solid rgba(16,185,129,0.35)" }}>🟢 DISPONÍVEL</span>
                          )}
                          {ehPdf && (
                            <span style={{ fontSize: "10px", fontWeight: "900", padding: "3px 10px", borderRadius: "10px", backgroundColor: "rgba(251,146,60,0.18)", color: "#FB923C", border: "1px solid rgba(251,146,60,0.4)", boxShadow: "0 2px 8px rgba(251,146,60,0.2)" }}>📄 PROVA EM PDF</span>
                          )}
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: colors.textSecondary, backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9", padding: "2px 8px", borderRadius: "8px" }}>
                          ⏱️ {prova.duracaoMinutos} min
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "12px" }}>
                        <div style={{
                          width: "48px", height: "48px", borderRadius: "14px", flexShrink: 0,
                          background: ehPdf
                            ? "linear-gradient(135deg, rgba(251,146,60,0.25), rgba(249,115,22,0.15))"
                            : "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(239,68,68,0.15))",
                          border: `1.5px solid ${ehPdf ? "rgba(251,146,60,0.4)" : "rgba(245,158,11,0.4)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px"
                        }}>
                          {ehPdf ? "📄" : "✍️"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: "17.5px", fontWeight: "900", margin: "0 0 4px 0", color: colors.textPrimary, lineHeight: "1.3" }}>
                            {prova.titulo}
                          </h3>
                          <p style={{ fontSize: "12.5px", color: colors.textSecondary, lineHeight: "1.5", margin: 0 }}>
                            {prova.descricao}
                          </p>
                        </div>
                      </div>

                      <div style={{
                        fontSize: "12px", color: colors.textSecondary,
                        backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : colors.borderCard}`,
                        padding: "12px 14px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "4px"
                      }}>
                        {prova.dataLimite && (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span>📅</span> <strong>Validade:</strong> {prova.dataLimite} às {prova.horarioLimite}
                          </div>
                        )}
                        {ehPdf ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#FB923C", fontWeight: "700" }}>
                            <span>📄</span> <strong>Arquivo:</strong> {prova.pdfNome || "prova.pdf"}
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span>❓</span> <strong>Questões:</strong> {prova.questoes ? prova.questoes.length : 0} perguntas
                          </div>
                        )}
                        <div style={{ marginTop: "2px", fontSize: "11px", color: "#A855F7", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>👑</span> <strong>Criado por:</strong> {prova.criadoPor}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      {ehPdf ? (
                        <button
                          onClick={() => {
                            if (prova.pdfData) {
                              setPdfVisualizarModal({
                                id: prova.id,
                                titulo: prova.titulo,
                                pdfData: prova.pdfData,
                                pdfNome: prova.pdfNome || "prova.pdf"
                              });
                            } else {
                              alert("⚠️ O arquivo PDF desta prova não foi anexado corretamente.");
                            }
                          }}
                          style={{
                            flex: 1, padding: "12px 18px", borderRadius: "12px",
                            background: "linear-gradient(135deg, #FB923C 0%, #F97316 100%)",
                            color: "#FFFFFF", border: "none", fontWeight: "900", fontSize: "13px", cursor: "pointer",
                            boxShadow: "0 4px 16px rgba(251, 146, 60, 0.4)",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <span>📄</span> Abrir Prova em PDF
                        </button>
                      ) : (
                        <button
                          disabled={expirada || provaJaRealizada || isFutura}
                          onClick={() => handleIniciarProvaOnline(prova)}
                          style={{
                            flex: 1, padding: "12px 18px", borderRadius: "12px",
                            backgroundColor: (expirada || provaJaRealizada || isFutura)
                              ? (isDark ? "rgba(255,255,255,0.08)" : "#CBD5E1")
                              : "#F59E0B",
                            background: (expirada || provaJaRealizada || isFutura)
                              ? "none"
                              : "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                            color: (expirada || provaJaRealizada || isFutura) ? colors.textSecondary : "#FFFFFF",
                            border: "none", fontWeight: "900", fontSize: "13px",
                            cursor: (expirada || provaJaRealizada || isFutura) ? "not-allowed" : "pointer",
                            boxShadow: (expirada || provaJaRealizada || isFutura) ? "none" : "0 4px 16px rgba(245, 158, 11, 0.4)",
                            transition: "all 0.2s ease"
                          }}
                        >
                          {isFutura
                            ? `🔒 Agendada para ${diasSemana[prova.diaSemana]}`
                            : expirada
                            ? "🔒 Prova Expirada"
                            : provaJaRealizada
                            ? `🔒 Concluída (Nota: ${registroConclusao ? registroConclusao.nota : "?"})`
                            : "✍️ Realizar Prova Agora"}
                        </button>
                      )}

                      {isSuperAdmin && !isDiaria && (
                        <button
                          onClick={() => handleExcluirProvaSuperAdmin(prova.id)}
                          title="Excluir Prova"
                          style={{
                            padding: "12px 14px", borderRadius: "12px",
                            backgroundColor: "rgba(239,68,68,0.12)", color: "#EF4444",
                            border: "1px solid rgba(239,68,68,0.3)", cursor: "pointer", fontSize: "14px",
                            transition: "all 0.2s ease"
                          }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                );
              };

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

                  {/* ===== HEADER INTEGRADO DO MÓDULO COM SELETOR DE SUB-ABAS ===== */}
                  <div style={{
                    background: isDark ? "linear-gradient(135deg, rgba(20, 184, 166, 0.12), rgba(13, 148, 136, 0.05))" : "#FFFFFF",
                    border: `1px solid ${isDark ? "rgba(20, 184, 166, 0.3)" : colors.borderCard}`,
                    borderRadius: "20px",
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                    boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.05)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "14px",
                        background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#FFF", boxShadow: "0 4px 16px rgba(20, 184, 166, 0.4)",
                        flexShrink: 0
                      }}>
                        <CheckSquare size={24} />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                          <span style={{ backgroundColor: "rgba(20, 184, 166, 0.18)", color: "#14b8a6", fontSize: "11px", fontWeight: "800", padding: "2px 8px", borderRadius: "8px", border: "1px solid rgba(20, 184, 166, 0.3)" }}>
                            MÓDULO DE AVALIAÇÕES
                          </span>
                        </div>
                        <h2 style={{ fontSize: "20px", fontWeight: "900", margin: 0, color: colors.textPrimary }}>
                          Provas & Notas de Prova ✍️📊
                        </h2>
                        <p style={{ color: colors.textSecondary, fontSize: "13px", margin: "2px 0 0 0" }}>
                          Realize suas avaliações online e consulte seu boletim completo de notas.
                        </p>
                      </div>
                    </div>

                    {/* CONTROLES DE SUB-ABA */}
                    <div style={{
                      display: "flex",
                      gap: "6px",
                      backgroundColor: isDark ? "rgba(0, 0, 0, 0.3)" : "#F1F5F9",
                      padding: "5px",
                      borderRadius: "14px",
                      border: `1px solid ${colors.borderCard}`
                    }}>
                      <button
                        onClick={() => { setAbaSubProvas("provas"); if (abaAtiva === "notas") setAbaAtiva("provas-online"); }}
                        style={{
                          padding: "9px 18px",
                          borderRadius: "10px",
                          border: "none",
                          background: subAba === "provas" ? "linear-gradient(135deg, #14b8a6, #0d9488)" : "transparent",
                          color: subAba === "provas" ? "#FFFFFF" : colors.textPrimary,
                          fontWeight: subAba === "provas" ? "800" : "600",
                          fontSize: "13px",
                          cursor: "pointer",
                          boxShadow: subAba === "provas" ? "0 4px 14px rgba(20,184,166,0.35)" : "none",
                          transition: "all 0.2s ease"
                        }}
                      >
                        ✍️ Realizar Provas
                      </button>

                      <button
                        onClick={() => { setAbaSubProvas("minhas_notas"); if (abaAtiva === "notas") setAbaAtiva("provas-online"); }}
                        style={{
                          padding: "9px 18px",
                          borderRadius: "10px",
                          border: "none",
                          background: subAba === "minhas_notas" ? "linear-gradient(135deg, #a855f7, #7c3aed)" : "transparent",
                          color: subAba === "minhas_notas" ? "#FFFFFF" : colors.textPrimary,
                          fontWeight: subAba === "minhas_notas" ? "800" : "600",
                          fontSize: "13px",
                          cursor: "pointer",
                          boxShadow: subAba === "minhas_notas" ? "0 4px 14px rgba(168,85,247,0.35)" : "none",
                          transition: "all 0.2s ease"
                        }}
                      >
                        📊 Minhas Notas
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => { setAbaSubProvas("relatorio_admin"); if (abaAtiva === "notas") setAbaAtiva("provas-online"); }}
                          style={{
                            padding: "9px 18px",
                            borderRadius: "10px",
                            border: "none",
                            background: subAba === "relatorio_admin" ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" : "transparent",
                            color: subAba === "relatorio_admin" ? "#FFFFFF" : colors.textPrimary,
                            fontWeight: subAba === "relatorio_admin" ? "800" : "600",
                            fontSize: "13px",
                            cursor: "pointer",
                            boxShadow: subAba === "relatorio_admin" ? "0 4px 14px rgba(59,130,246,0.35)" : "none",
                            transition: "all 0.2s ease"
                          }}
                        >
                          👑 Boletim Geral (Admin)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ===== SUB-ABA 1: REALIZAR PROVAS ===== */}
                  {subAba === "provas" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                      {/* Botão Criar Prova para Admin */}
                      {isAdmin && (
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
                        </div>
                      )}

                      {/* SEÇÃO: PROVA DO DIA */}
                      <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "4px", height: "24px", background: "linear-gradient(180deg,#14b8a6,#0d9488)", borderRadius: "4px" }} />
                            <h3 style={{ fontSize: "18px", fontWeight: "900", color: colors.textPrimary, margin: 0 }}>🗓️ Cronograma Semanal de Provas</h3>
                            <span style={{
                              fontSize: "11px", fontWeight: "800", padding: "3px 10px", borderRadius: "20px",
                              background: "linear-gradient(135deg,#14b8a6,#0d9488)", color: "#FFF",
                              boxShadow: "0 2px 10px rgba(20,184,166,0.3)", letterSpacing: "0.5px"
                            }}>HOJE</span>
                          </div>
                        </div>

                        {/* CRONOGRAMA SEMANAL TRACK FULL-WIDTH */}
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                          gap: "12px",
                          marginBottom: "24px"
                        }}>
                          {PROVAS_DIARIAS.map((p) => {
                            const isHoje = p.diaSemana === diaSemanaHoje;
                            const jaPassou = p.diaSemana < diaSemanaHoje;
                            return (
                              <div
                                key={p.id}
                                style={{
                                  padding: "14px 16px",
                                  borderRadius: "16px",
                                  border: isHoje ? "2px solid #14b8a6" : `1px solid ${isDark ? "rgba(255,255,255,0.08)" : colors.borderCard}`,
                                  backgroundColor: isHoje
                                    ? (isDark ? "rgba(20, 184, 166, 0.15)" : "#F0FDFA")
                                    : (isDark ? "rgba(15, 23, 42, 0.4)" : colors.bgCard),
                                  boxShadow: isHoje ? "0 4px 20px rgba(20, 184, 166, 0.25)" : "none",
                                  transition: "all 0.2s ease",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "8px",
                                  opacity: jaPassou ? 0.6 : 1
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <span style={{ fontSize: "22px" }}>{p.emoji}</span>
                                  <span style={{
                                    fontSize: "10px",
                                    fontWeight: "800",
                                    padding: "2px 8px",
                                    borderRadius: "8px",
                                    background: isHoje
                                      ? "linear-gradient(135deg, #14b8a6, #0d9488)"
                                      : (isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"),
                                    color: isHoje ? "#FFF" : colors.textSecondary
                                  }}>
                                    {p.id.includes("-v2-") ? "P2" : "P1"}
                                  </span>
                                </div>

                                <div>
                                  <div style={{ fontSize: "13px", fontWeight: "900", color: isHoje ? "#14b8a6" : colors.textPrimary }}>
                                    {diasSemana[p.diaSemana]}
                                  </div>
                                  <div style={{ fontSize: "11px", color: colors.textSecondary, fontWeight: "500", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {p.tema}
                                  </div>
                                </div>

                                <div style={{ marginTop: "4px", fontSize: "10px", fontWeight: "800", color: isHoje ? "#14b8a6" : colors.textSecondary, display: "flex", alignItems: "center", gap: "4px" }}>
                                  {isHoje ? "🔥 Liberada Hoje" : jaPassou ? "✔ Concluída" : "🔒 Em Breve"}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* PROVAS DISPONÍVEIS HOJE */}
                        {(() => {
                          const provasHoje = PROVAS_DIARIAS.filter(p => p.diaSemana === diaSemanaHoje);
                          if (provasHoje.length === 0) {
                            return (
                              <div style={{
                                backgroundColor: isDark ? "rgba(15, 23, 42, 0.4)" : colors.bgCard,
                                border: `1px dashed ${colors.borderCard}`,
                                borderRadius: "18px", padding: "28px 20px", textAlign: "center", color: colors.textSecondary,
                                marginBottom: "24px"
                              }}>
                                <span style={{ fontSize: "32px", display: "block", marginBottom: "8px" }}>☕</span>
                                <h4 style={{ fontSize: "15px", fontWeight: "800", color: colors.textPrimary, margin: "0 0 4px 0" }}>Nenhuma Prova Diária para Hoje</h4>
                                <p style={{ fontSize: "12px", margin: 0 }}>Consulte o cronograma semanal acima para se preparar para as próximas avaliações.</p>
                              </div>
                            );
                          }
                          return (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px", marginBottom: "24px" }}>
                              {provasHoje.map((pHoje) => (
                                <div key={pHoje.id} style={{
                                  background: isDark
                                    ? "linear-gradient(145deg, rgba(20, 184, 166, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)"
                                    : "linear-gradient(145deg, rgba(20, 184, 166, 0.05) 0%, #FFFFFF 100%)",
                                  border: `1.5px solid ${isDark ? "rgba(20, 184, 166, 0.35)" : "rgba(20, 184, 166, 0.25)"}`,
                                  borderRadius: "20px", padding: "24px",
                                  display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "20px",
                                  position: "relative", overflow: "hidden",
                                  boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.3)" : "0 8px 24px rgba(20, 184, 166, 0.08)"
                                }}>
                                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, #14b8a6, #0d9488, #2dd4bf)" }} />
                                  <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                                    <div style={{
                                      width: "56px", height: "56px", flexShrink: 0,
                                      background: "linear-gradient(135deg, rgba(20, 184, 166, 0.25), rgba(13, 148, 136, 0.15))",
                                      border: "2px solid rgba(20, 184, 166, 0.4)", borderRadius: "16px",
                                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px",
                                      boxShadow: "0 4px 12px rgba(20, 184, 166, 0.2)"
                                    }}>
                                      {pHoje.emoji}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
                                        <span style={{ fontSize: "10px", fontWeight: "900", padding: "3px 10px", borderRadius: "10px", background: "linear-gradient(135deg,#14b8a6,#0d9488)", color: "#FFF", boxShadow: "0 2px 8px rgba(20,184,166,0.3)" }}>🔥 PROVA DO DIA</span>
                                        <span style={{ fontSize: "11px", fontWeight: "700", color: colors.textSecondary, backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9", padding: "2px 8px", borderRadius: "8px" }}>⏱️ {pHoje.duracaoMinutos} min</span>
                                        <span style={{ fontSize: "11px", fontWeight: "700", color: colors.textSecondary, backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9", padding: "2px 8px", borderRadius: "8px" }}>❓ {pHoje.questoes.length} q.</span>
                                      </div>
                                      <h3 style={{ fontSize: "18px", fontWeight: "900", margin: "0 0 6px 0", color: colors.textPrimary, lineHeight: "1.3" }}>{pHoje.titulo}</h3>
                                      <p style={{ fontSize: "12.5px", color: colors.textSecondary, lineHeight: "1.5", margin: 0 }}>{pHoje.descricao}</p>
                                    </div>
                                  </div>

                                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {(() => {
                                      const jaFezHoje = user && provasConcluidas.some(c =>
                                        c.provaId === pHoje.id && (c.userId === user.id || (c.userEmail && c.userEmail.toLowerCase() === user.email.toLowerCase()))
                                      );
                                      const regHoje = user ? provasConcluidas.find(c =>
                                        c.provaId === pHoje.id && (c.userId === user.id || (c.userEmail && c.userEmail.toLowerCase() === user.email.toLowerCase()))
                                      ) : null;
                                      return (
                                        <button
                                          disabled={jaFezHoje}
                                          onClick={() => handleIniciarProvaOnline(pHoje)}
                                          style={{
                                            padding: "12px 20px", borderRadius: "12px",
                                            background: jaFezHoje
                                              ? (isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0")
                                              : "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                                            color: jaFezHoje ? colors.textSecondary : "#FFF",
                                            border: "none", fontWeight: "800", fontSize: "13px",
                                            cursor: jaFezHoje ? "not-allowed" : "pointer",
                                            boxShadow: jaFezHoje ? "none" : "0 4px 16px rgba(20, 184, 166, 0.4)",
                                            transition: "all 0.2s ease"
                                          }}
                                        >
                                          {jaFezHoje ? `✅ Concluída hoje! (Nota: ${regHoje ? regHoje.nota : "?"})` : "🚀 Realizar Prova do Dia"}
                                        </button>
                                      );
                                    })()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>

                      {/* SEÇÃO: PROVAS DO SISTEMA */}
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                          <div style={{ width: "4px", height: "24px", background: "linear-gradient(180deg,#F59E0B,#EF4444)", borderRadius: "4px" }} />
                          <h3 style={{ fontSize: "18px", fontWeight: "900", color: colors.textPrimary, margin: 0 }}>👑 Provas Especiais do Sistema</h3>
                        </div>

                        {provasSistema.length === 0 ? (
                          <div style={{
                            backgroundColor: isDark ? "rgba(15, 23, 42, 0.4)" : colors.bgCard,
                            border: `1.5px dashed ${isDark ? "rgba(255,255,255,0.12)" : colors.borderCard}`,
                            borderRadius: "20px", padding: "40px 24px", textAlign: "center", color: colors.textSecondary,
                            boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 2px 10px rgba(0,0,0,0.03)"
                          }}>
                            <div style={{
                              width: "54px", height: "54px", borderRadius: "16px",
                              background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.25)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              margin: "0 auto 16px auto", fontSize: "24px", color: "#F59E0B"
                            }}>
                              📋
                            </div>
                            <h3 style={{ fontSize: "16px", fontWeight: "900", color: colors.textPrimary, marginBottom: "6px" }}>
                              Nenhuma Prova Publicada pelo Admin
                            </h3>
                            <p style={{ fontSize: "13px", maxWidth: "460px", margin: "0 auto", lineHeight: "1.5" }}>
                              {isAdmin
                                ? "Use o botão \"Criar Prova\" no topo da página para publicar avaliações customizadas em formulário ou PDF."
                                : "Fique atento! Provas oficiais e desafios especiais serão disponibilizados aqui pela coordenação."}
                            </p>
                          </div>
                        ) : (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
                            {provasSistema.map(prova => renderCardProva(prova, false))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ===== SUB-ABA 2: MINHAS NOTAS (BOLETIM INDIVIDUAL DO ESTUDANTE) ===== */}
                  {subAba === "minhas_notas" && (() => {
                    const minhasProvas = user ? notasProvas.filter(n =>
                      (n.userId && n.userId.toString() === user.id.toString()) ||
                      (n.email && user.email && n.email.toLowerCase() === user.email.toLowerCase())
                    ) : [];

                    const totalFeitas = minhasProvas.length;
                    const somaNotas = minhasProvas.reduce((acc, curr) => {
                      const val = curr.nota !== undefined ? parseFloat(curr.nota) : (curr.mediaFinal !== undefined ? parseFloat(curr.mediaFinal) : 0);
                      return acc + val;
                    }, 0);
                    const mediaAluno = totalFeitas > 0 ? (somaNotas / totalFeitas).toFixed(1) : "0.0";
                    const aprovadasCount = minhasProvas.filter(n => {
                      const val = n.nota !== undefined ? parseFloat(n.nota) : (n.mediaFinal !== undefined ? parseFloat(n.mediaFinal) : 0);
                      return val >= 7.0;
                    }).length;

                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {/* STATS DE NOTAS */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                          <div style={{ backgroundColor: colors.bgCard, border: `1px solid ${colors.borderCard}`, borderRadius: "16px", padding: "18px 20px" }}>
                            <span style={{ fontSize: "12px", color: colors.textSecondary, fontWeight: "700" }}>🎓 SUA MÉDIA GERAL</span>
                            <div style={{ fontSize: "26px", fontWeight: "900", color: parseFloat(mediaAluno) >= 7 ? "#10B981" : "#A855F7", marginTop: "4px" }}>
                              {mediaAluno} <span style={{ fontSize: "14px", color: colors.textSecondary }}>/ 10.0</span>
                            </div>
                          </div>
                          <div style={{ backgroundColor: colors.bgCard, border: `1px solid ${colors.borderCard}`, borderRadius: "16px", padding: "18px 20px" }}>
                            <span style={{ fontSize: "12px", color: colors.textSecondary, fontWeight: "700" }}>✍️ PROVAS REALIZADAS</span>
                            <div style={{ fontSize: "26px", fontWeight: "900", color: "#3B82F6", marginTop: "4px" }}>
                              {totalFeitas} {totalFeitas === 1 ? "prova" : "provas"}
                            </div>
                          </div>
                          <div style={{ backgroundColor: colors.bgCard, border: `1px solid ${colors.borderCard}`, borderRadius: "16px", padding: "18px 20px" }}>
                            <span style={{ fontSize: "12px", color: colors.textSecondary, fontWeight: "700" }}>🏆 PROVAS APROVADAS</span>
                            <div style={{ fontSize: "26px", fontWeight: "900", color: "#10B981", marginTop: "4px" }}>
                              {aprovadasCount} / {totalFeitas}
                            </div>
                          </div>
                        </div>

                        {minhasProvas.length === 0 ? (
                          <div style={{
                            backgroundColor: colors.bgCard, border: `1px dashed ${colors.borderCard}`,
                            borderRadius: "18px", padding: "40px 20px", textAlign: "center", color: colors.textSecondary
                          }}>
                            <span style={{ fontSize: "36px", display: "block", marginBottom: "10px" }}>📊</span>
                            <h3 style={{ fontSize: "16px", fontWeight: "800", color: colors.textPrimary, marginBottom: "4px" }}>
                              Você ainda não realizou nenhuma prova
                            </h3>
                            <p style={{ fontSize: "13px", maxWidth: "440px", margin: "0 auto 16px auto" }}>
                              Acesse a aba <strong>"✍️ Realizar Provas"</strong> para responder à Prova do Dia ou avaliações disponíveis no sistema!
                            </p>
                            <button
                              onClick={() => setAbaSubProvas("provas")}
                              style={{ padding: "10px 20px", borderRadius: "12px", backgroundColor: "#14b8a6", color: "#FFF", border: "none", fontWeight: "800", cursor: "pointer" }}
                            >
                              🚀 Ver Provas Disponíveis
                            </button>
                          </div>
                        ) : (
                          <div style={{ backgroundColor: colors.bgCard, border: `1px solid ${colors.borderCard}`, borderRadius: "16px", overflow: "hidden" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                              <thead>
                                <tr style={{ backgroundColor: isDark ? "#1E293B" : "#F1F5F9", borderBottom: `1px solid ${colors.borderCard}` }}>
                                  <th style={{ padding: "12px 16px" }}>Avaliação / Prova</th>
                                  <th style={{ padding: "12px 16px" }}>Nota Obtida</th>
                                  <th style={{ padding: "12px 16px" }}>Status</th>
                                  <th style={{ padding: "12px 16px" }}>Data de Conclusão</th>
                                </tr>
                              </thead>
                              <tbody>
                                {minhasProvas.map((nota) => {
                                  const valorNota = nota.nota !== undefined ? parseFloat(nota.nota) : (nota.mediaFinal !== undefined ? parseFloat(nota.mediaFinal) : 0);
                                  const titulo = nota.provaTitulo || nota.titulo || "Prova DevHub";
                                  return (
                                    <tr key={nota.id} style={{ borderBottom: `1px solid ${colors.borderCard}` }}>
                                      <td style={{ padding: "14px 16px" }}>
                                        <strong style={{ display: "block" }}>✍️ {titulo}</strong>
                                      </td>
                                      <td style={{ padding: "14px 16px" }}>
                                        <strong style={{ fontSize: "16px", color: valorNota >= 7 ? "#10B981" : "#EF4444" }}>
                                          {valorNota.toFixed(1)} <span style={{ fontSize: "12px", color: colors.textSecondary, fontWeight: "normal" }}>/ 10</span>
                                        </strong>
                                      </td>
                                      <td style={{ padding: "14px 16px" }}>
                                        <span style={{
                                          fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "6px",
                                          backgroundColor: valorNota >= 9.5 ? "rgba(168,85,247,0.15)" : valorNota >= 7 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                                          color: valorNota >= 9.5 ? "#A855F7" : valorNota >= 7 ? "#10B981" : "#EF4444",
                                          border: valorNota >= 9.5 ? "1px solid rgba(168,85,247,0.3)" : valorNota >= 7 ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)"
                                        }}>
                                          {nota.status || (valorNota >= 9.5 ? "Excelente 🌟" : valorNota >= 7 ? "Aprovado 👍" : "Abaixo da Média ❌")}
                                        </span>
                                      </td>
                                      <td style={{ padding: "14px 16px", color: colors.textSecondary, fontSize: "12px" }}>
                                        📅 {nota.dataRealizacao || nota.dataConclusao || "Hoje"}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* ===== SUB-ABA 3: BOLETIM GERAL DE NOTAS (ADMIN / GERAL) ===== */}
                  {subAba === "relatorio_admin" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                        <div>
                          <h3 style={{ fontSize: "18px", fontWeight: "800", margin: 0 }}>📊 Relatório Geral de Notas dos Alunos</h3>
                          <p style={{ color: colors.textSecondary, fontSize: "13px", margin: "2px 0 0 0" }}>
                            Acompanhe e lance notas individuais para todos os estudantes.
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
                                padding: "10px 16px", borderRadius: "12px",
                                backgroundColor: isDark ? "rgba(239, 68, 68, 0.15)" : "#FEE2E2",
                                color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.3)",
                                fontWeight: "700", fontSize: "13px", cursor: "pointer"
                              }}
                            >
                              🗑️ Resetar Notas Antigas
                            </button>

                            <button
                              onClick={handleAbrirNovaProva}
                              style={{
                                padding: "10px 18px", borderRadius: "12px",
                                backgroundColor: "#A855F7", color: "#FFF",
                                border: "none", fontWeight: "700", fontSize: "13px",
                                cursor: "pointer", boxShadow: "0 4px 12px rgba(168, 85, 247, 0.3)"
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
                            width: "100%", padding: "10px 14px", borderRadius: "10px",
                            border: `1px solid ${colors.borderCard}`,
                            backgroundColor: colors.inputBg,
                            color: colors.textPrimary, fontSize: "14px"
                          }}
                        />
                      </div>

                      {(() => {
                        const listaProvasRealizadas = notasProvasFiltradas;
                        if (listaProvasRealizadas.length === 0) {
                          return (
                            <div style={{
                              backgroundColor: colors.bgCard, border: `1px solid ${colors.borderCard}`,
                              borderRadius: "18px", padding: "45px 20px", textAlign: "center", color: colors.textSecondary
                            }}>
                              <span style={{ fontSize: "38px", display: "block", marginBottom: "12px" }}>📊</span>
                              <h3 style={{ fontSize: "16px", fontWeight: "800", color: colors.textPrimary, marginBottom: "4px" }}>
                                Nenhuma Nota Registrada
                              </h3>
                              <p style={{ fontSize: "13px", maxWidth: "460px", margin: "0 auto" }}>
                                As notas dos estudantes aparecerão nesta tabela assim que realizarem provas no sistema!
                              </p>
                            </div>
                          );
                        }

                        return (
                          <div style={{ backgroundColor: colors.bgCard, border: `1px solid ${colors.borderCard}`, borderRadius: "16px", overflow: "hidden" }}>
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
                                            fontSize: "12px", fontWeight: "700", padding: "4px 10px", borderRadius: "6px",
                                            backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#A855F7",
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
                                            fontSize: "11px", fontWeight: "800", padding: "4px 8px", borderRadius: "6px",
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
                                                  padding: "6px 10px", borderRadius: "6px",
                                                  backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0",
                                                  color: colors.textPrimary, border: `1px solid ${colors.borderCard}`,
                                                  cursor: "pointer", fontSize: "12px"
                                                }}
                                              >
                                                ✏️
                                              </button>
                                              <button
                                                onClick={() => handleExcluirProva(nota.id)}
                                                title="Excluir Registro"
                                                style={{
                                                  padding: "6px 10px", borderRadius: "6px",
                                                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                                                  color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.3)",
                                                  cursor: "pointer", fontSize: "12px"
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

                </div>
              );
            })()}

            {/* ABA: SUA EVOLUÇÃO — TIMELINE & XP */}
            {abaAtiva === "evolucao" && (
              <EvolucaoTimelineModule isDark={isDark} colors={colors} user={user} />
            )}

            {/* ABA SUPER ADMIN / PAINEL DE CONTROLE (SEM MODULOS ALUNO NA SIDEBAR) */}
            {abaAtiva === "super_admin" && (
              <div style={{ padding: "28px 24px", maxWidth: "1400px", margin: "0 auto" }}>
                <SuperAdminModule 
                  isDark={isDark} 
                  colors={colors} 
                  currentUser={user}
                  onVoltarEntrada={() => setAbaAtiva("visao_geral")}
                />
              </div>
            )}
              </>
            )}
          </main>
        </div>

        {modalPerfilOpen && (
        <PerfilModal
          isOpen={modalPerfilOpen}
          onClose={() => setModalPerfilOpen(false)}
          user={user}
          onUpdateUser={(updatedUser) => setUser(updatedUser)}
          onLogout={handleLogout}
          onTemaEquipado={(temaId) => setTemaEquipado(temaId)}
        />
        )}

        {/* MODAL REDUZIDO DE TICKETS & SUPORTE */}
        <TicketsModule
          user={user}
          isOpen={modalTicketsOpen}
          onClose={() => setModalTicketsOpen(false)}
          modoAdmin={user?.cargo === "admin" || user?.cargo === "superadmin" || user?.cargo === "super_admin" || user?.role === "admin" || user?.role === "superadmin"}
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
              backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
              color: colors.textPrimary,
              maxWidth: "720px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "24px",
              padding: "32px",
              border: `1.5px solid ${isDark ? "rgba(59, 130, 246, 0.35)" : "rgba(59, 130, 246, 0.2)"}`,
              boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.65)",
              position: "relative"
            }}>
              {/* Barra de gradiente no topo */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, #3B82F6, #A855F7, #EC4899)", borderRadius: "24px 24px 0 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "22px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "900", padding: "2px 8px", borderRadius: "6px", backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#3B82F6", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
                      📅 GESTÃO DE AULAS & REUNIÕES
                    </span>
                    <span style={{ fontSize: "11.5px", color: colors.textSecondary, fontWeight: "600" }}>
                      Data: <strong style={{ color: "#3B82F6" }}>{formData}</strong>
                    </span>
                  </div>
                  <h3 style={{ fontSize: "21px", fontWeight: "900", background: "linear-gradient(135deg, #3B82F6, #A855F7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
                    {aulaEmEdicaoId ? "✏️ Editar Reunião" : `✨ Agendar Nova Reunião`}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setModalAgendaOpen(false)}
                  style={{
                    border: "none",
                    backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
                    color: colors.textPrimary,
                    width: "36px", height: "36px", borderRadius: "12px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px", cursor: "pointer", transition: "all 0.2s ease"
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSalvarAgendamento} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {/* TÍTULO DA REUNIÃO */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: colors.textPrimary, marginBottom: "6px" }}>
                    📝 Título da Reunião / Aula *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Treinamento Fiscal & Contábil — Módulo Prático"
                    value={formTitulo}
                    onChange={(e) => setFormTitulo(e.target.value)}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: "12px",
                      border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : colors.borderCard}`,
                      backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "13.5px", outline: "none"
                    }}
                  />
                </div>

                {/* DESCRIÇÃO RESUMIDA */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: colors.textPrimary, marginBottom: "6px" }}>
                    📋 Descrição & Pauta da Reunião
                  </label>
                  <input
                    type="text"
                    placeholder="Resumo dos temas que serão abordados durante a transmissão..."
                    value={formDescricao}
                    onChange={(e) => setFormDescricao(e.target.value)}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: "12px",
                      border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : colors.borderCard}`,
                      backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "13.5px", outline: "none"
                    }}
                  />
                </div>

                {/* GRID 2 COLUNAS: INSTRUTOR E STATUS */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: colors.textPrimary, marginBottom: "6px" }}>
                      👨‍🏫 Instrutor / Condutor *
                    </label>
                    <select
                      value={formInstrutor}
                      onChange={(e) => setFormInstrutor(e.target.value)}
                      style={{
                        width: "100%", padding: "12px 14px", borderRadius: "12px",
                        border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : colors.borderCard}`,
                        backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "13px", fontWeight: "700",
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

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: colors.textPrimary, marginBottom: "6px" }}>
                      📡 Status da Reunião *
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      style={{
                        width: "100%", padding: "12px 14px", borderRadius: "12px",
                        border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : colors.borderCard}`,
                        backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "13px", fontWeight: "700",
                        cursor: "pointer", outline: "none"
                      }}
                    >
                      <option value="Agendada 📅">Agendada 📅</option>
                      <option value="Ao Vivo 🔴">Ao Vivo 🔴 (Acontecendo Agora)</option>
                      <option value="📹 Reprise Disponível">📹 Reprise Disponível</option>
                      <option value="Concluída ✅">Concluída ✅</option>
                    </select>
                  </div>
                </div>

                {/* GRID 2 COLUNAS: DATA E HORÁRIO */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: colors.textPrimary, marginBottom: "6px" }}>
                      📅 Data da Reunião *
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
                        width: "100%", padding: "11px 14px", borderRadius: "12px",
                        border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : colors.borderCard}`,
                        backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "13px", fontWeight: "700",
                        cursor: "pointer", outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: colors.textPrimary, marginBottom: "6px" }}>
                      ⏰ Horário (Início / Fim) *
                    </label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="time"
                        value={formHoraInicio}
                        onChange={(e) => {
                          setFormHoraInicio(e.target.value);
                          setFormHorario(`${e.target.value} - ${formHoraFim}`);
                        }}
                        style={{
                          flex: 1, padding: "11px 10px", borderRadius: "12px",
                          border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : colors.borderCard}`,
                          backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "12.5px", fontWeight: "800", outline: "none"
                        }}
                      />
                      <span style={{ fontSize: "11px", color: colors.textSecondary, fontWeight: "800" }}>até</span>
                      <input
                        type="time"
                        value={formHoraFim}
                        onChange={(e) => {
                          setFormHoraFim(e.target.value);
                          setFormHorario(`${formHoraInicio} - ${e.target.value}`);
                        }}
                        style={{
                          flex: 1, padding: "11px 10px", borderRadius: "12px",
                          border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : colors.borderCard}`,
                          backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "12.5px", fontWeight: "800", outline: "none"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* GRID 2 COLUNAS: BASE E CARGA HORÁRIA */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: colors.textPrimary, marginBottom: "6px" }}>
                      🏢 Base de Origem / Empresa
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: ContabHub, CF Smart ou Todas as Bases"
                      value={formBaseNome}
                      onChange={(e) => setFormBaseNome(e.target.value)}
                      style={{
                        width: "100%", padding: "12px 14px", borderRadius: "12px",
                        border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : colors.borderCard}`,
                        backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "13px", outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: colors.textPrimary, marginBottom: "6px" }}>
                      ⏱️ Carga Horária de Treinamento
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 2h, 1.5h, 4h"
                      value={formCargaHoraria}
                      onChange={(e) => setFormCargaHoraria(e.target.value)}
                      style={{
                        width: "100%", padding: "12px 14px", borderRadius: "12px",
                        border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : colors.borderCard}`,
                        backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "13px", outline: "none"
                      }}
                    />
                  </div>
                </div>

                {/* SELETOR INTERATIVO DE PLATAFORMA DE VÍDEO (ZOOM / MEET / NATIVA) */}
                <div style={{
                  padding: "18px", borderRadius: "18px",
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.5)" : "#F8FAFC",
                  border: `1.5px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : colors.borderCard}`
                }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "900", color: colors.textPrimary, marginBottom: "10px" }}>
                    🎥 Escolha a Plataforma de Transmissão da Chamada:
                  </label>

                  {/* ABAS SELETORAS */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", marginBottom: "14px" }}>
                    {[
                      { id: "zoom", label: "🔵 Zoom Meeting", color: "#2D8CFF", desc: "Link do Zoom" },
                      { id: "meet", label: "🟢 Google Meet", color: "#10B981", desc: "Link do Meet" },
                      { id: "nativa", label: "🎥 Nativa DevHub", color: "#A855F7", desc: "Sem link externo" },
                      { id: "youtube", label: "📺 YouTube Live", color: "#EF4444", desc: "Transmissão" }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setFormPlataforma(item.id);
                          if (item.id === "nativa") setFormLink("");
                        }}
                        style={{
                          padding: "10px 8px", borderRadius: "12px",
                          border: formPlataforma === item.id ? `2px solid ${item.color}` : `1px solid ${colors.borderCard}`,
                          backgroundColor: formPlataforma === item.id ? `${item.color}15` : "transparent",
                          color: formPlataforma === item.id ? item.color : colors.textPrimary,
                          fontWeight: "800", fontSize: "12px", cursor: "pointer",
                          transition: "all 0.2s ease", textAlign: "center"
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* CAMPO DE LINK CONFORME A PLATAFORMA SELECIONADA */}
                  {formPlataforma === "zoom" && (
                    <div>
                      <label style={{ display: "block", fontSize: "11.5px", fontWeight: "800", color: "#2D8CFF", marginBottom: "4px" }}>
                        🔵 Cole aqui o Link da Reunião no Zoom (zoom.us):
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://zoom.us/j/1234567890?pwd=..."
                        value={formLink}
                        onChange={(e) => setFormLink(e.target.value)}
                        style={{
                          width: "100%", padding: "12px 14px", borderRadius: "12px",
                          border: "1.5px solid #2D8CFF", backgroundColor: colors.inputBg,
                          color: colors.textPrimary, fontSize: "13px", fontWeight: "600", outline: "none"
                        }}
                      />
                      <span style={{ fontSize: "11px", color: colors.textSecondary, marginTop: "4px", display: "block" }}>
                        💡 Os alunos poderão entrar diretamente na chamada Zoom clicando no botão no DevHub!
                      </span>
                    </div>
                  )}

                  {formPlataforma === "meet" && (
                    <div>
                      <label style={{ display: "block", fontSize: "11.5px", fontWeight: "800", color: "#10B981", marginBottom: "4px" }}>
                        🟢 Cole aqui o Link da Reunião no Google Meet:
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://meet.google.com/abc-defg-hij"
                        value={formLink}
                        onChange={(e) => setFormLink(e.target.value)}
                        style={{
                          width: "100%", padding: "12px 14px", borderRadius: "12px",
                          border: "1.5px solid #10B981", backgroundColor: colors.inputBg,
                          color: colors.textPrimary, fontSize: "13px", fontWeight: "600", outline: "none"
                        }}
                      />
                    </div>
                  )}

                  {formPlataforma === "youtube" && (
                    <div>
                      <label style={{ display: "block", fontSize: "11.5px", fontWeight: "800", color: "#EF4444", marginBottom: "4px" }}>
                        📺 Cole aqui o Link da Live ou Vídeo do YouTube:
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={formLink}
                        onChange={(e) => setFormLink(e.target.value)}
                        style={{
                          width: "100%", padding: "12px 14px", borderRadius: "12px",
                          border: "1.5px solid #EF4444", backgroundColor: colors.inputBg,
                          color: colors.textPrimary, fontSize: "13px", fontWeight: "600", outline: "none"
                        }}
                      />
                    </div>
                  )}

                  {formPlataforma === "nativa" && (
                    <div style={{ padding: "12px 14px", borderRadius: "12px", backgroundColor: "rgba(168, 85, 247, 0.12)", border: "1px solid rgba(168, 85, 247, 0.3)" }}>
                      <span style={{ fontSize: "12px", color: "#A855F7", fontWeight: "800" }}>
                        ✨ Chamada Nativa DevHub Ativada!
                      </span>
                      <p style={{ fontSize: "11.5px", color: colors.textSecondary, margin: "2px 0 0 0" }}>
                        Não é necessário cole nenhum link externo. O DevHub criará a sala WebRTC integrada automaticamente para alunos e instrutores com áudio, vídeo e compartilhamento de tela!
                      </p>
                    </div>
                  )}
                </div>

                {/* LINK DA GRAVAÇÃO / REPRISE */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: colors.textPrimary, marginBottom: "6px" }}>
                    📹 Link da Gravação / Reprise (Opcional para Aulas Concluídas)
                  </label>
                  <input
                    type="url"
                    placeholder="Link do YouTube ou arquivo MP4 para gravação posterior..."
                    value={formLinkGravacao}
                    onChange={(e) => setFormLinkGravacao(e.target.value)}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: "12px",
                      border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : colors.borderCard}`,
                      backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "13px", outline: "none"
                    }}
                  />
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setModalAgendaOpen(false)}
                    style={{
                      flex: 1, padding: "13px", borderRadius: "12px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: "transparent",
                      color: colors.textPrimary, fontWeight: "700", cursor: "pointer", fontSize: "13px"
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    style={{
                      flex: 2, padding: "13px", borderRadius: "12px",
                      border: "none",
                      background: formPlataforma === "zoom"
                        ? "linear-gradient(135deg, #2D8CFF 0%, #1A73E8 100%)"
                        : "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                      color: "#FFFFFF", fontWeight: "900", fontSize: "13.5px", cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(59, 130, 246, 0.4)",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                    }}
                  >
                    🚀 Salvar Reunião
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
        {provaEmAndamento && (() => {
          const totalQuestoes = provaEmAndamento.questoes ? provaEmAndamento.questoes.length : 0;
          const respondidasCount = provaEmAndamento.questoes
            ? provaEmAndamento.questoes.filter(q => respostasUsuario[q.id] !== undefined && respostasUsuario[q.id] !== null).length
            : 0;
          const pctProgresso = totalQuestoes > 0 ? Math.round((respondidasCount / totalQuestoes) * 100) : 0;

          return (
            <div style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(10, 15, 30, 0.82)",
              backdropFilter: "blur(12px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}>
              <div style={{
                backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                color: colors.textPrimary,
                maxWidth: "720px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
                position: "relative",
                border: `1.5px solid ${isDark ? "rgba(20, 184, 166, 0.3)" : "rgba(20, 184, 166, 0.2)"}`
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "5px", background: "linear-gradient(90deg, #14b8a6, #0d9488, #38bdf8)" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "11px", color: "#14b8a6", fontWeight: "900", padding: "2px 8px", borderRadius: "8px", background: "rgba(20, 184, 166, 0.15)", border: "1px solid rgba(20, 184, 166, 0.3)" }}>
                        ✍️ PROVA EM ANDAMENTO
                      </span>
                      <span style={{ fontSize: "11px", color: colors.textSecondary, fontWeight: "700" }}>⏱️ Prova Individual</span>
                    </div>
                    <h3 style={{ fontSize: "21px", fontWeight: "900", color: colors.textPrimary, margin: 0, lineHeight: "1.3" }}>
                      {provaEmAndamento.titulo}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setProvaEmAndamento(null)}
                    style={{
                      border: "none",
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#F1F5F9",
                      color: colors.textPrimary,
                      width: "36px", height: "36px", borderRadius: "12px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px", cursor: "pointer", transition: "all 0.2s ease"
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* BARRA DE PROGRESSO EM TEMPO REAL */}
                <div style={{
                  marginBottom: "24px", padding: "16px", borderRadius: "16px",
                  background: isDark ? "rgba(30, 41, 59, 0.7)" : "#F8FAFC",
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : colors.borderCard}`
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", fontSize: "12px", fontWeight: "700" }}>
                    <span style={{ color: colors.textSecondary }}>Progresso da Avaliação</span>
                    <span style={{ color: "#14b8a6", fontWeight: "900" }}>{respondidasCount} de {totalQuestoes} respondidas ({pctProgresso}%)</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${pctProgresso}%`, height: "100%", background: "linear-gradient(90deg, #14b8a6, #2dd4bf)", borderRadius: "4px", transition: "width 0.3s ease" }} />
                  </div>
                </div>

                <form onSubmit={handleEnviarProvaOnline} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {provaEmAndamento.questoes.map((q, idx) => {
                    const respondida = respostasUsuario[q.id] !== undefined && respostasUsuario[q.id] !== null;
                    return (
                      <div key={q.id} style={{
                        backgroundColor: isDark ? "rgba(30, 41, 59, 0.4)" : "#FFFFFF",
                        border: `1.5px solid ${respondida ? "rgba(20, 184, 166, 0.4)" : (isDark ? "rgba(255,255,255,0.08)" : colors.borderCard)}`,
                        borderRadius: "18px",
                        padding: "20px",
                        boxShadow: respondida ? "0 4px 20px rgba(20, 184, 166, 0.08)" : "none",
                        transition: "all 0.2s ease"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                          <span style={{
                            fontSize: "10px", fontWeight: "900", padding: "3px 10px", borderRadius: "8px",
                            background: respondida ? "linear-gradient(135deg, #14b8a6, #0d9488)" : (isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"),
                            color: respondida ? "#FFF" : colors.textSecondary
                          }}>
                            QUESTÃO {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                          </span>
                          {respondida && <span style={{ fontSize: "11px", color: "#14b8a6", fontWeight: "800" }}>✓ Respondida</span>}
                        </div>

                        <h4 style={{ fontSize: "15px", fontWeight: "800", marginBottom: "16px", color: colors.textPrimary, lineHeight: "1.4" }}>
                          {q.pergunta}
                        </h4>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {q.opcoes.map((opcao, oIdx) => {
                            const letras = ["A", "B", "C", "D", "E"];
                            const isSelected = respostasUsuario[q.id] === oIdx;
                            return (
                              <label
                                key={oIdx}
                                onClick={() => handleSelecionarResposta(q.id, oIdx)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                  padding: "12px 16px",
                                  borderRadius: "14px",
                                  border: isSelected ? "2px solid #14b8a6" : `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                                  backgroundColor: isSelected
                                    ? (isDark ? "rgba(20, 184, 166, 0.15)" : "#F0FDFA")
                                    : (isDark ? "rgba(15, 23, 42, 0.5)" : "#FFFFFF"),
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                  boxShadow: isSelected ? "0 4px 16px rgba(20, 184, 166, 0.2)" : "none"
                                }}
                              >
                                <div style={{
                                  width: "32px", height: "32px", borderRadius: "10px", flexShrink: 0,
                                  background: isSelected ? "linear-gradient(135deg, #14b8a6, #0d9488)" : (isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0"),
                                  color: isSelected ? "#FFF" : colors.textSecondary,
                                  fontWeight: "900", fontSize: "13px",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  boxShadow: isSelected ? "0 2px 8px rgba(20, 184, 166, 0.35)" : "none"
                                }}>
                                  {isSelected ? "✓" : letras[oIdx] || (oIdx + 1)}
                                </div>

                                <span style={{ fontSize: "13.5px", fontWeight: isSelected ? "700" : "500", color: colors.textPrimary, flex: 1, lineHeight: "1.4" }}>
                                  {opcao}
                                </span>
                                <input
                                  type="radio"
                                  name={`questao-${q.id}`}
                                  checked={isSelected}
                                  onChange={() => handleSelecionarResposta(q.id, oIdx)}
                                  style={{ display: "none" }}
                                  required
                                />
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                    <button
                      type="button"
                      onClick={() => setProvaEmAndamento(null)}
                      style={{
                        padding: "13px 20px", borderRadius: "14px",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : colors.borderCard}`, backgroundColor: "transparent",
                        color: colors.textPrimary, fontWeight: "700", fontSize: "13px", cursor: "pointer"
                      }}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      style={{
                        flex: 1, padding: "13px 24px", borderRadius: "14px",
                        border: "none", background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                        color: "#FFFFFF", fontWeight: "900", fontSize: "14px", cursor: "pointer",
                        boxShadow: "0 4px 20px rgba(20, 184, 166, 0.4)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                      }}
                    >
                      <span>📤</span> Finalizar e Enviar Prova
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        })()}

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

        {/* MODAL CRIAR PROVA (ADMIN / SUPER ADMIN) */}
        {modalCriarProvaOpen && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(10, 15, 30, 0.82)",
            backdropFilter: "blur(12px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}>
            <div style={{
              backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
              color: colors.textPrimary,
              maxWidth: "720px", width: "100%",
              maxHeight: "90vh", overflowY: "auto",
              borderRadius: "24px",
              border: `1.5px solid ${isDark ? "rgba(168, 85, 247, 0.35)" : "rgba(168, 85, 247, 0.2)"}`,
              boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.65)",
              position: "relative"
            }}>
              {/* Barra de gradiente no topo */}
              <div style={{ height: "4px", background: "linear-gradient(90deg, #14b8a6, #a855f7, #ec4899)", borderRadius: "24px 24px 0 0" }} />

              <div style={{ padding: "30px" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "22px" }}>
                  <div>
                    <h3 style={{ fontSize: "21px", fontWeight: "900", background: "linear-gradient(135deg, #a855f7, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
                      ✨ Criar Nova Avaliação
                    </h3>
                    <p style={{ fontSize: "12.5px", color: colors.textSecondary, marginTop: "4px", margin: 0 }}>
                      Defina as instruções e escolha entre questões interativas de múltipla escolha ou arquivo PDF.
                    </p>
                  </div>
                  <button
                    onClick={() => setModalCriarProvaOpen(false)}
                    style={{
                      border: "none",
                      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
                      color: colors.textPrimary,
                      width: "36px", height: "36px", borderRadius: "12px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px", cursor: "pointer", transition: "all 0.2s ease"
                    }}
                  >✕</button>
                </div>

                {/* ABAS: Questões / PDF */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "24px", backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F8FAFC", borderRadius: "16px", padding: "5px", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : colors.borderCard}` }}>
                  {[
                    { key: "questoes", label: "✍️ Criar com Questões", desc: "Perguntas de múltipla escolha interativas" },
                    { key: "pdf",      label: "📄 Upload de PDF",      desc: "Anexar arquivo em PDF já formatado" }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setModalModoProva(tab.key)}
                      style={{
                        flex: 1, padding: "12px 14px", borderRadius: "12px",
                        border: "none",
                        backgroundColor: modalModoProva === tab.key ? (isDark ? "#1E293B" : "#FFFFFF") : "transparent",
                        color: modalModoProva === tab.key ? "#A855F7" : colors.textSecondary,
                        fontWeight: modalModoProva === tab.key ? "900" : "600",
                        fontSize: "13px", cursor: "pointer",
                        boxShadow: modalModoProva === tab.key ? "0 4px 14px rgba(168,85,247,0.2)" : "none",
                        transition: "all 0.2s ease",
                        textAlign: "center"
                      }}
                    >
                      {tab.label}
                      <div style={{ fontSize: "10.5px", opacity: 0.75, marginTop: "2px", fontWeight: "500" }}>{tab.desc}</div>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSalvarNovaProvaSuperAdmin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {/* Campos comuns */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "800", marginBottom: "6px", color: colors.textPrimary }}>📝 Título da Prova *</label>
                    <input
                      type="text" required
                      placeholder="Ex: Avaliação Final — Módulo Backend & APIs REST"
                      value={formCriarTitulo}
                      onChange={(e) => setFormCriarTitulo(e.target.value)}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : colors.borderCard}`, backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "13.5px", transition: "all 0.2s ease" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "800", marginBottom: "6px", color: colors.textPrimary }}>📋 Descrição & Instruções *</label>
                    <textarea
                      rows={3} required
                      placeholder="Descreva o conteúdo cobrado, critérios de aprovação e orientações aos alunos..."
                      value={formCriarDescricao}
                      onChange={(e) => setFormCriarDescricao(e.target.value)}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : colors.borderCard}`, backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "13.5px", resize: "vertical", transition: "all 0.2s ease" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11.5px", fontWeight: "800", marginBottom: "5px", color: colors.textSecondary }}>📅 Data Limite</label>
                      <input type="date" value={formCriarDataLimite} onChange={(e) => setFormCriarDataLimite(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : colors.borderCard}`, backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "12.5px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11.5px", fontWeight: "800", marginBottom: "5px", color: colors.textSecondary }}>⏰ Hora Limite</label>
                      <input type="time" value={formCriarHoraLimite} onChange={(e) => setFormCriarHoraLimite(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : colors.borderCard}`, backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "12.5px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11.5px", fontWeight: "800", marginBottom: "5px", color: colors.textSecondary }}>⏱️ Duração (min)</label>
                      <input type="number" min="5" max="360" value={formCriarDuracao} onChange={(e) => setFormCriarDuracao(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : colors.borderCard}`, backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "12.5px" }}
                      />
                    </div>
                  </div>

                  {/* ===== MODO QUESTÕES ===== */}
                  {modalModoProva === "questoes" && (
                    <div style={{ marginTop: "6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                        <label style={{ fontSize: "14px", fontWeight: "900", color: "#A855F7", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>❓</span> Questões da Prova ({formCriarPerguntas.length})
                        </label>
                        <button
                          type="button"
                          onClick={handleAdicionarPerguntaForm}
                          style={{
                            padding: "7px 14px", borderRadius: "10px",
                            backgroundColor: "rgba(168,85,247,0.15)", color: "#A855F7",
                            border: "1px solid rgba(168,85,247,0.35)", fontSize: "12px",
                            cursor: "pointer", fontWeight: "800", transition: "all 0.2s ease"
                          }}
                        >
                          ➕ Nova Questão
                        </button>
                      </div>

                      {formCriarPerguntas.map((q, qIdx) => (
                        <div key={qIdx} style={{
                          padding: "20px", borderRadius: "18px",
                          backgroundColor: isDark ? "rgba(30, 41, 59, 0.4)" : "#F8FAFC",
                          border: `1.5px solid ${isDark ? "rgba(255,255,255,0.08)" : colors.borderCard}`,
                          marginBottom: "16px",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <span style={{ fontSize: "11px", fontWeight: "900", color: "#A855F7", background: "rgba(168,85,247,0.15)", padding: "4px 12px", borderRadius: "10px", border: "1px solid rgba(168,85,247,0.3)" }}>
                              QUESTÃO {qIdx + 1 < 10 ? `0${qIdx + 1}` : qIdx + 1}
                            </span>
                            {formCriarPerguntas.length > 1 && (
                              <button type="button" onClick={() => setFormCriarPerguntas(prev => prev.filter((_, i) => i !== qIdx))}
                                style={{ border: "none", backgroundColor: "rgba(239,68,68,0.12)", color: "#EF4444", fontSize: "11px", cursor: "pointer", fontWeight: "800", padding: "5px 12px", borderRadius: "8px" }}>
                                🗑️ Remover
                              </button>
                            )}
                          </div>

                          <div style={{ marginBottom: "12px" }}>
                            <label style={{ display: "block", fontSize: "11.5px", fontWeight: "800", color: colors.textSecondary, marginBottom: "4px" }}>Enunciado da Pergunta:</label>
                            <input
                              type="text" required
                              placeholder={`Ex: O que é um middleware no contexto do ExpressJS?`}
                              value={q.pergunta}
                              onChange={(e) => { const val = e.target.value; setFormCriarPerguntas(prev => prev.map((item, i) => i === qIdx ? { ...item, pergunta: val } : item)); }}
                              style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : colors.borderCard}`, backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "13px" }}
                            />
                          </div>

                          <label style={{ display: "block", fontSize: "11.5px", fontWeight: "800", marginBottom: "8px", color: colors.textSecondary }}>Opções de Resposta (A, B, C, D):</label>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                            {q.opcoes.map((op, oIdx) => {
                              const letras = ["A", "B", "C", "D"];
                              return (
                                <div key={oIdx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div style={{
                                    width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
                                    backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#A855F7",
                                    fontWeight: "900", fontSize: "12px",
                                    display: "flex", alignItems: "center", justifyContent: "center"
                                  }}>
                                    {letras[oIdx]}
                                  </div>
                                  <input
                                    type="text" required
                                    placeholder={`Texto da Opção ${letras[oIdx]}`}
                                    value={op}
                                    onChange={(e) => { const val = e.target.value; setFormCriarPerguntas(prev => prev.map((item, i) => i === qIdx ? { ...item, opcoes: item.opcoes.map((o, idx2) => idx2 === oIdx ? val : o) } : item)); }}
                                    style={{ flex: 1, padding: "10px 12px", borderRadius: "10px", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : colors.borderCard}`, backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "12.5px" }}
                                  />
                                </div>
                              );
                            })}
                          </div>

                          <div style={{ backgroundColor: isDark ? "rgba(16,185,129,0.12)" : "#E6F4EA", padding: "12px 16px", borderRadius: "12px", border: "1px solid rgba(16,185,129,0.3)" }}>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: "900", color: "#10B981", marginBottom: "6px" }}>✅ Qual é a Resposta CORRETA?</label>
                            <select
                              value={q.respostaCorreta}
                              onChange={(e) => { const val = parseInt(e.target.value); setFormCriarPerguntas(prev => prev.map((item, i) => i === qIdx ? { ...item, respostaCorreta: val } : item)); }}
                              style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #10B981", backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "13px", fontWeight: "800", cursor: "pointer" }}
                            >
                              {q.opcoes.map((opText, oIdx) => {
                                const letras = ["A", "B", "C", "D"];
                                return (
                                  <option key={oIdx} value={oIdx}>
                                    Opção {letras[oIdx]}: {opText ? `"${opText}"` : `(Preencha a opção ${letras[oIdx]})`}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ===== MODO PDF ===== */}
                  {modalModoProva === "pdf" && (
                    <div style={{ marginTop: "6px" }}>
                      <label style={{ display: "block", fontSize: "13.5px", fontWeight: "900", color: "#FB923C", marginBottom: "10px" }}>📄 Arquivo PDF da Prova</label>

                      <label
                        htmlFor="pdf-upload-input"
                        style={{
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                          padding: "36px 20px", borderRadius: "20px",
                          border: pdfUploadNome ? "2px solid #FB923C" : `2px dashed ${isDark ? "rgba(251,146,60,0.4)" : colors.borderCard}`,
                          backgroundColor: pdfUploadNome ? "rgba(251,146,60,0.1)" : (isDark ? "rgba(255,255,255,0.02)" : "#FAFBFC"),
                          cursor: "pointer", textAlign: "center", transition: "all 0.2s ease"
                        }}
                      >
                        <span style={{ fontSize: "44px", marginBottom: "12px" }}>{pdfUploadNome ? "📄" : "⬆️"}</span>
                        {pdfUploadNome ? (
                          <>
                            <span style={{ fontSize: "15px", fontWeight: "900", color: "#FB923C", marginBottom: "4px" }}>{pdfUploadNome}</span>
                            <span style={{ fontSize: "12px", color: colors.textSecondary }}>✅ PDF pronto para publicação! Clique para trocar o arquivo.</span>
                          </>
                        ) : (
                          <>
                            <span style={{ fontSize: "14.5px", fontWeight: "800", marginBottom: "4px", color: colors.textPrimary }}>Clique ou arraste o arquivo PDF aqui</span>
                            <span style={{ fontSize: "12px", color: colors.textSecondary }}>Formatos aceitos: .pdf (Máx. 15MB)</span>
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
                        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "12px", backgroundColor: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.35)" }}>
                          <span style={{ fontSize: "20px" }}>📄</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "13.5px", fontWeight: "800", color: "#FB923C" }}>{pdfUploadNome}</div>
                            <div style={{ fontSize: "11.5px", color: colors.textSecondary }}>Arquivo anexado e pronto para publicação</div>
                          </div>
                          <button type="button" onClick={() => { setPdfUploadData(null); setPdfUploadNome(""); }}
                            style={{ border: "none", backgroundColor: "transparent", color: "#EF4444", cursor: "pointer", fontSize: "16px", fontWeight: "900" }}>✕</button>
                        </div>
                      )}

                      <div style={{ marginTop: "14px", padding: "14px 16px", borderRadius: "14px", backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F0F4FF", border: `1px solid ${colors.borderCard}` }}>
                        <p style={{ fontSize: "12px", color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                          💡 <strong>Como funciona:</strong> O PDF é disponibilizado aos alunos diretamente para download/leitura online durante o período de avaliação.
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

        {/* MODAL VISUALIZADOR DE PROVA EM PDF */}
        {pdfVisualizarModal && (() => {
          const jaConcluidaPdf = user && provasConcluidas.some(c =>
            c.provaId === pdfVisualizarModal.id && (c.userId === user.id || (c.userEmail && c.userEmail.toLowerCase() === user.email.toLowerCase()))
          );

          const handleFinalizarProvaPdf = (e) => {
            e.preventDefault();
            if (!pdfVisualizarModal) return;

            const novaNota = {
              id: Date.now().toString(),
              provaId: pdfVisualizarModal.id,
              titulo: pdfVisualizarModal.titulo,
              userId: user ? user.id : "anon",
              userName: user ? (user.nome || user.email) : "Estudante",
              userEmail: user ? user.email : "",
              nota: 0.0,
              status: "Pendente ⏳",
              statusTexto: "Aguardando Correção do Professor",
              isPendenteCorrecao: true,
              acertos: 0,
              total: 1,
              data: new Date().toLocaleDateString("pt-BR"),
              horario: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
              respostaTexto: pdfTextoResposta || "Resposta enviada via PDF."
            };

            const novasNotas = [novaNota, ...notasProvas];
            setNotasProvas(novasNotas);
            try { localStorage.setItem("devhub_notas_provas", JSON.stringify(novasNotas)); } catch (err) {}

            const novasConcluidas = [novaNota, ...provasConcluidas];
            setProvasConcluidas(novasConcluidas);
            try { localStorage.setItem("devhub_provas_concluidas", JSON.stringify(novasConcluidas)); } catch (err) {}

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            fetch(`${apiUrl}/notas`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(novaNota)
            }).catch(() => {});

            setPdfVisualizarModal(null);
            setPdfModoResposta(false);
            setPdfTextoResposta("");
            alert("📩 Resposta enviada com sucesso!\n\nSua prova em PDF foi enviada para o professor e está com o status 'Aguardando Correção'. A nota final será atualizada no seu Boletim assim que for corrigida.");
          };

          return (
            <div style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(10, 15, 30, 0.85)",
              backdropFilter: "blur(14px)",
              zIndex: 1100,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}>
              <div style={{
                backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                color: colors.textPrimary,
                maxWidth: "1200px",
                width: "100%",
                height: "92vh",
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.75)",
                overflow: "hidden",
                border: `1.5px solid ${isDark ? "rgba(251, 146, 60, 0.35)" : "rgba(251, 146, 60, 0.2)"}`
              }}>
                {/* Top Header */}
                <div style={{
                  padding: "16px 24px",
                  background: isDark ? "rgba(30, 41, 59, 0.8)" : "#F8FAFC",
                  borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : colors.borderCard}`,
                  display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: "42px", height: "42px", borderRadius: "12px",
                      background: "linear-gradient(135deg, #FB923C, #F97316)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#FFF", fontSize: "20px", boxShadow: "0 4px 14px rgba(251, 146, 60, 0.4)"
                    }}>
                      📄
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "10.5px", fontWeight: "900", padding: "2px 8px", borderRadius: "6px", background: "rgba(251, 146, 60, 0.15)", color: "#FB923C", border: "1px solid rgba(251, 146, 60, 0.3)" }}>
                          AVALIAÇÃO EM PDF
                        </span>
                        <span style={{ fontSize: "11px", color: colors.textSecondary }}>{pdfVisualizarModal.pdfNome}</span>
                      </div>
                      <h3 style={{ fontSize: "17px", fontWeight: "900", color: colors.textPrimary, margin: "2px 0 0 0" }}>
                        {pdfVisualizarModal.titulo}
                      </h3>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {jaConcluidaPdf ? (
                      <span style={{
                        padding: "8px 14px", borderRadius: "10px",
                        background: "rgba(16, 185, 129, 0.15)", color: "#10B981",
                        border: "1px solid rgba(16, 185, 129, 0.3)", fontWeight: "800", fontSize: "12.5px"
                      }}>
                        ✅ PROVA JÁ CONCLUÍDA
                      </span>
                    ) : (
                      <button
                        onClick={() => setPdfModoResposta(!pdfModoResposta)}
                        style={{
                          padding: "9px 18px", borderRadius: "10px", border: "none",
                          background: pdfModoResposta ? "linear-gradient(135deg, #14b8a6, #0d9488)" : "linear-gradient(135deg, #FB923C, #F97316)",
                          color: "#FFF", fontWeight: "900", fontSize: "12.5px", cursor: "pointer",
                          boxShadow: "0 4px 14px rgba(251, 146, 60, 0.35)", transition: "all 0.2s ease"
                        }}
                      >
                        {pdfModoResposta ? "📖 Ver Apenas o PDF" : "✍️ Responder / Finalizar Prova"}
                      </button>
                    )}

                    <a
                      href={pdfVisualizarModal.pdfData}
                      download={pdfVisualizarModal.pdfNome || "prova.pdf"}
                      style={{
                        padding: "9px 16px", borderRadius: "10px",
                        background: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0",
                        color: colors.textPrimary, fontWeight: "700", fontSize: "12.5px",
                        textDecoration: "none", display: "flex", alignItems: "center", gap: "6px",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span>📥</span> Baixar PDF
                    </a>

                    <button
                      onClick={() => { setPdfVisualizarModal(null); setPdfModoResposta(false); }}
                      style={{
                        border: "none",
                        backgroundColor: "rgba(239,68,68,0.15)", color: "#EF4444",
                        padding: "9px 16px", borderRadius: "10px",
                        fontWeight: "800", fontSize: "12.5px", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "6px",
                        border: "1px solid rgba(239,68,68,0.3)"
                      }}
                    >
                      ✕ Fechar
                    </button>
                  </div>
                </div>

                {/* PDF & Submission Body */}
                <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                  {/* PDF Viewer */}
                  <div style={{ flex: pdfModoResposta ? 0.6 : 1, backgroundColor: "#1e293b", position: "relative", transition: "flex 0.3s ease" }}>
                    <iframe
                      src={pdfVisualizarModal.pdfData}
                      title={pdfVisualizarModal.titulo}
                      style={{ width: "100%", height: "100%", border: "none" }}
                    />
                  </div>

                  {/* Sidebar de Resposta */}
                  {pdfModoResposta && (
                    <div style={{
                      flex: 0.4,
                      backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                      borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : colors.borderCard}`,
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      overflowY: "auto"
                    }}>
                      <form onSubmit={handleFinalizarProvaPdf} style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <span style={{ fontSize: "11px", fontWeight: "900", color: "#FB923C", background: "rgba(251, 146, 60, 0.15)", padding: "3px 10px", borderRadius: "8px" }}>
                              ✍️ FOLHA DE RESPOSTA
                            </span>
                          </div>
                          <h4 style={{ fontSize: "16px", fontWeight: "900", margin: "0 0 6px 0", color: colors.textPrimary }}>
                            Envio de Avaliação em PDF
                          </h4>
                          <p style={{ fontSize: "12px", color: colors.textSecondary, lineHeight: "1.5", margin: 0 }}>
                            Leia as perguntas no documento ao lado e digite abaixo suas respostas ou resumo final. Ao enviar, a nota será registrada em seu boletim.
                          </p>

                          <div style={{ marginTop: "18px" }}>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: "800", marginBottom: "6px", color: colors.textPrimary }}>
                              📝 Suas Respostas / Comentários:
                            </label>
                            <textarea
                              rows={10}
                              required
                              placeholder="Digite aqui suas respostas (ex: Questão 1: A, Questão 2: C...) ou o resumo solicitado no documento..."
                              value={pdfTextoResposta}
                              onChange={(e) => setPdfTextoResposta(e.target.value)}
                              style={{
                                width: "100%", padding: "14px", borderRadius: "14px",
                                border: `1.5px solid ${isDark ? "rgba(255,255,255,0.12)" : colors.borderCard}`,
                                backgroundColor: colors.inputBg, color: colors.textPrimary,
                                fontSize: "13px", resize: "vertical", lineHeight: "1.5"
                              }}
                            />
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                          <button
                            type="button"
                            onClick={() => setPdfModoResposta(false)}
                            style={{
                              padding: "12px 16px", borderRadius: "12px",
                              border: `1px solid ${colors.borderCard}`, backgroundColor: "transparent",
                              color: colors.textPrimary, fontWeight: "700", fontSize: "12.5px", cursor: "pointer"
                            }}
                          >
                            Voltar ao PDF
                          </button>

                          <button
                            type="submit"
                            style={{
                              flex: 1, padding: "12px 18px", borderRadius: "12px", border: "none",
                              background: "linear-gradient(135deg, #FB923C 0%, #F97316 100%)",
                              color: "#FFF", fontWeight: "900", fontSize: "13px", cursor: "pointer",
                              boxShadow: "0 4px 16px rgba(251, 146, 60, 0.4)"
                            }}
                          >
                            🚀 Enviar e Registrar Nota
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* MODAL DA CENTRAL DE NOTIFICAÇÕES */}
        <NotificationCenterModal 
          isOpen={modalNotificacoesOpen} 
          onClose={() => setModalNotificacoesOpen(false)} 
          onUpdateUnreadCount={(count) => setUnreadNotificacoesCount(count)}
        />

        {/* ===================================================================
            BALÃO FLUTUANTE & MODAL GRANDE DA DEV IA TUTOR
           =================================================================== */}
        {/* Modal / Tela Grande da Dev IA */}
        {modalDevIaOpen && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setModalDevIaOpen(false);
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(10, 15, 30, 0.8)",
              backdropFilter: "blur(10px)",
              zIndex: 99990,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}
          >
            <div style={{
              width: "100%",
              maxWidth: "1350px",
              height: "calc(100vh - 40px)",
              maxHeight: "920px",
              backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
              borderRadius: "24px",
              border: `1.5px solid ${isDark ? "rgba(168, 85, 247, 0.4)" : "#E2E8F0"}`,
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7), 0 0 45px rgba(99, 102, 241, 0.35)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative"
            }}>
              <DevIaModule user={user} isFloating={false} onClose={() => setModalDevIaOpen(false)} />
            </div>
          </div>
        )}

        {/* Botão de Balão Flutuante (FAB) - Sempre Visível no Canto Inferior */}
        <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 99999 }}>
          <button
            onClick={() => setModalDevIaOpen(prev => !prev)}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              color: "#ffffff",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 8px 25px rgba(99, 102, 241, 0.6), 0 0 25px rgba(168, 85, 247, 0.5)",
              transition: "all 0.25s ease",
              transform: modalDevIaOpen ? "scale(1.05)" : "scale(1)"
            }}
            title={modalDevIaOpen ? "Fechar Dev IA (X)" : "Abrir Dev IA — Guia do DevHub 🤖"}
          >
            {modalDevIaOpen ? <X size={28} /> : <Sparkles size={28} />}
            {!modalDevIaOpen && (
              <span style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                width: "14px",
                height: "14px",
                backgroundColor: "#10b981",
                borderRadius: "50%",
                border: "2px solid #0f121d",
                boxShadow: "0 0 8px #10b981"
              }} />
            )}
          </button>
        </div>

        {/* MODAL PARA CRIAR CHAMADA INSTANTÂNEA AO VIVO */}
        {modalChamadaInstantaneaOpen && (
          <div
            style={{
              position: "fixed",
              top: 0, left: 0, width: "100vw", height: "100vh",
              backgroundColor: "rgba(10, 15, 30, 0.85)",
              backdropFilter: "blur(12px)",
              zIndex: 99999,
              display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
            }}
          >
            <div
              style={{
                backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                color: colors.textPrimary,
                maxWidth: "480px", width: "100%",
                borderRadius: "24px", padding: "30px",
                border: "1.5px solid rgba(239, 68, 68, 0.4)",
                boxShadow: "0 25px 60px rgba(239, 68, 68, 0.3)",
                position: "relative"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <span style={{ fontSize: "11px", fontWeight: "900", padding: "4px 12px", borderRadius: "8px", backgroundColor: "rgba(239,68,68,0.2)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  🔴 CHAMADA AO VIVO
                </span>
                <button
                  onClick={() => setModalChamadaInstantaneaOpen(false)}
                  style={{ border: "none", backgroundColor: "transparent", color: colors.textSecondary, fontSize: "20px", cursor: "pointer", fontWeight: "900" }}
                >✕</button>
              </div>

              <h3 style={{ fontSize: "20px", fontWeight: "900", margin: "0 0 6px 0", color: colors.textPrimary }}>
                ⚡ Nome da Chamada
              </h3>
              <p style={{ fontSize: "12.5px", color: colors.textSecondary, margin: "0 0 20px 0" }}>
                Digite o título ou nome da reunião. Ela será salva no sistema e aparecerá instantaneamente em <strong>Agendas</strong> com status <strong>Ao Vivo 🔴</strong>.
              </p>

              <form onSubmit={handleConfirmarChamadaInstantanea} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "800", marginBottom: "8px" }}>📝 Título / Nome da Chamada *</label>
                  <input
                    type="text" required autoFocus
                    placeholder="Ex: Reunião com a Turma, Tira-Dúvidas Módulo 2..."
                    value={formInstantaneaTitulo}
                    onChange={(e) => setFormInstantaneaTitulo(e.target.value)}
                    style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", border: `1.5px solid ${colors.borderCard}`, backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: "14px", fontWeight: "600" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
                  <button
                    type="button"
                    onClick={() => setModalChamadaInstantaneaOpen(false)}
                    style={{ flex: 1, padding: "13px", borderRadius: "12px", border: `1px solid ${colors.borderCard}`, backgroundColor: "transparent", color: colors.textPrimary, fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 2, padding: "13px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)", color: "#FFF", fontWeight: "900", fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 18px rgba(239, 68, 68, 0.5)" }}
                  >
                    🔴 Iniciar e Salvar Chamada
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================================================================
            MODAIS DE VÍDEOCHAMADA NATIVA, PRESENÇAS & REPRISE DA AGENDA
           =================================================================== */}

        {/* 1. Modal da Sala de VídeoChamada Nativa com Design Ultra Premium (2026 Layout) */}
        {reuniaoAtivaVideo && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "#080B11",
              zIndex: 999999,
              display: "flex",
              flexDirection: "column",
              fontFamily: "'Inter', sans-serif"
            }}
          >
            <div
              style={{
                padding: "14px 28px",
                backgroundColor: "rgba(11, 17, 32, 0.85)",
                backdropFilter: "blur(24px)",
                borderBottom: "1px solid rgba(59, 130, 246, 0.25)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
                zIndex: 1000000
              }}
            >
              {/* Título & Info da Aula */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span
                  style={{
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.3) 100%)",
                    color: "#EF4444",
                    fontWeight: "900",
                    fontSize: "11px",
                    border: "1px solid rgba(239, 68, 68, 0.5)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    letterSpacing: "0.08em",
                    boxShadow: "0 0 16px rgba(239, 68, 68, 0.3)"
                  }}
                >
                  <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#EF4444", boxShadow: "0 0 12px #EF4444" }} />
                  🔴 AO VIVO (Transmissão HD)
                </span>

                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "900", color: "#FFFFFF", margin: 0, letterSpacing: "-0.02em" }}>
                    {reuniaoAtivaVideo.titulo}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "3px" }}>
                    <span style={{ fontSize: "12px", color: "#94A3B8", fontWeight: "600" }}>
                      👨‍🏫 {reuniaoAtivaVideo.instrutor || "Instrutor DevHub"}
                    </span>
                    <span style={{ fontSize: "11.5px", color: "#10B981", fontWeight: "800", backgroundColor: "rgba(16,185,129,0.15)", padding: "2px 8px", borderRadius: "6px" }}>
                      ✅ Presença Confirmada
                    </span>
                  </div>
                </div>
              </div>

              {/* Cluster de Ações Rápida */}
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                {/* Botão Chat */}
                <button
                  onClick={() => setChatPainelAberto(!chatPainelAberto)}
                  style={{
                    padding: "9px 16px",
                    borderRadius: "12px",
                    background: chatPainelAberto 
                      ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" 
                      : "rgba(255, 255, 255, 0.08)",
                    color: "#FFFFFF",
                    border: chatPainelAberto ? "1px solid #3B82F6" : "1px solid rgba(255, 255, 255, 0.15)",
                    fontWeight: "800",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: chatPainelAberto ? "0 4px 20px rgba(37, 99, 235, 0.4)" : "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  💬 Chat ao Vivo ({chatMensagens.length})
                </button>

                {/* Copiar Link Direct */}
                <button
                  onClick={() => {
                    const url = obterUrlVideoChamada(reuniaoAtivaVideo, servidorVideo);
                    navigator.clipboard.writeText(url);
                    alert("📋 Link direto da chamada copiado para a área de transferência!");
                  }}
                  style={{
                    padding: "9px 16px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    color: "#F1F5F9",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    fontWeight: "800",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  🔗 Compartilhar Link
                </button>

                {/* Botão Sair */}
                <button
                  onClick={() => setReuniaoAtivaVideo(null)}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: "900",
                    fontSize: "13px",
                    cursor: "pointer",
                    boxShadow: "0 4px 18px rgba(239, 68, 68, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  🚪 Sair da Chamada
                </button>
              </div>
            </div>

            {/* Container Principal de Transmissão */}
            <div style={{ flex: 1, display: "flex", position: "relative", backgroundColor: "#030712", overflow: "hidden" }}>
              {/* Moldura de Vídeo WebRTC */}
              <div style={{ flex: 1, position: "relative" }}>
                <iframe
                  src={obterUrlVideoChamada(reuniaoAtivaVideo, servidorVideo)}
                  allow="camera *; microphone *; display-capture *; autoplay *; clipboard-write *; fullscreen *; media-record *"
                  style={{ width: "100%", height: "100%", border: "none" }}
                />
              </div>

              {/* Chat Lateral DevHub Live */}
              {chatPainelAberto && (
                <div
                  style={{
                    width: "360px",
                    backgroundColor: "rgba(11, 17, 32, 0.95)",
                    backdropFilter: "blur(20px)",
                    borderLeft: "1px solid rgba(59, 130, 246, 0.2)",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 10
                  }}
                >
                  {/* Chat Header */}
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "18px" }}>💬</span>
                      <strong style={{ color: "#F8FAFC", fontSize: "15px", fontWeight: "900" }}>Chat da Chamada</strong>
                    </div>
                    <button
                      onClick={() => setChatPainelAberto(false)}
                      style={{ border: "none", backgroundColor: "transparent", color: "#64748B", fontSize: "18px", cursor: "pointer" }}
                    >✕</button>
                  </div>

                  {/* Feed de Mensagens */}
                  <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {chatMensagens.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          backgroundColor: msg.autor === user?.nome ? "rgba(37, 99, 235, 0.2)" : "rgba(255, 255, 255, 0.04)",
                          padding: "12px 16px",
                          borderRadius: "16px",
                          border: msg.autor === user?.nome ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontSize: "12.5px", fontWeight: "900", color: msg.autor === user?.nome ? "#60A5FA" : "#38BDF8" }}>
                            {msg.autor}
                          </span>
                          <span style={{ fontSize: "10px", color: "#64748B", fontWeight: "700" }}>{msg.hora}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: "13.5px", color: "#E2E8F0", lineHeight: "1.45", wordBreak: "break-word" }}>
                          {msg.texto}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Reações Rápidas por Emojis */}
                  <div style={{ padding: "10px 16px", display: "flex", gap: "8px", justifyContent: "space-around", borderTop: "1px solid rgba(255, 255, 255, 0.06)", backgroundColor: "rgba(15, 23, 42, 0.6)" }}>
                    {["👍", "👏", "❤️", "🔥", "🎉", "🙋‍♂️"].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNovoTextoChat(prev => prev + " " + emoji)}
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "6px 10px", cursor: "pointer", fontSize: "15px" }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Input do Chat */}
                  <form onSubmit={handleEnviarMensagemChat} style={{ padding: "16px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", gap: "10px" }}>
                    <input
                      type="text"
                      placeholder="Digite no chat ao vivo..."
                      value={novoTextoChat}
                      onChange={(e) => setNovoTextoChat(e.target.value)}
                      style={{ flex: 1, padding: "12px 16px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.15)", backgroundColor: "rgba(30, 41, 59, 0.8)", color: "#FFF", fontSize: "13px", outline: "none" }}
                    />
                    <button
                      type="submit"
                      style={{ padding: "12px 18px", borderRadius: "12px", background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)", color: "#FFF", border: "none", fontWeight: "900", fontSize: "13px", cursor: "pointer", boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)" }}
                    >
                      Enviar
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Modal de Relatório de Presenças */}
        {modalPresencasAula && (
          <div
            onClick={(e) => { if (e.target === e.currentTarget) setModalPresencasAula(null); }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(8px)",
              zIndex: 999998,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}
          >
            <div
              style={{
                backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                color: colors.textPrimary,
                maxWidth: "680px",
                width: "100%",
                maxHeight: "85vh",
                borderRadius: "24px",
                border: `1.5px solid ${colors.borderCard}`,
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}
            >
              <div style={{ padding: "24px", borderBottom: `1px solid ${colors.borderCard}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "900", margin: 0, color: colors.textPrimary }}>
                    📊 Relatório de Presenças & Check-in
                  </h3>
                  <p style={{ fontSize: "12.5px", color: colors.textSecondary, margin: "4px 0 0 0" }}>
                    Aula: <strong>{modalPresencasAula.titulo}</strong> ({modalPresencasAula.data})
                  </p>
                </div>
                <button
                  onClick={() => setModalPresencasAula(null)}
                  style={{ border: "none", backgroundColor: "transparent", color: colors.textSecondary, fontSize: "20px", cursor: "pointer", fontWeight: "900" }}
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
                {carregandoPresencas ? (
                  <div style={{ textAlign: "center", padding: "40px", color: colors.textSecondary }}>
                    ⏳ Carregando registro de presenças...
                  </div>
                ) : listaPresencasAula.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: colors.textSecondary }}>
                    📅 Nenhum check-in registrado para esta aula ainda.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ fontSize: "12px", color: colors.textSecondary, fontWeight: "700", marginBottom: "4px" }}>
                      Total de Participantes Confirmados: {listaPresencasAula.length}
                    </div>
                    {listaPresencasAula.map((p, idx) => (
                      <div
                        key={p.id || idx}
                        style={{
                          padding: "14px 18px",
                          borderRadius: "12px",
                          backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                          border: `1px solid ${colors.borderCard}`,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "800", color: colors.textPrimary }}>
                            👤 {p.user_nome}
                          </div>
                          <div style={{ fontSize: "12px", color: colors.textSecondary }}>
                            📧 {p.user_email} • 🏢 Base: {p.base_nome || "ContabHub"}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "11px", fontWeight: "800", padding: "3px 8px", borderRadius: "6px", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10B981" }}>
                            {p.tipo_presenca || "🟢 Presente"}
                          </span>
                          <div style={{ fontSize: "11px", color: colors.textSecondary, marginTop: "4px" }}>
                            ⏰ {p.horario_entrada}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. Modal de Reprise de Aula Gravação */}
        {repriseAulaModal && (
          <div
            onClick={(e) => { if (e.target === e.currentTarget) setRepriseAulaModal(null); }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              backdropFilter: "blur(10px)",
              zIndex: 999998,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}
          >
            <div
              style={{
                backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                color: colors.textPrimary,
                maxWidth: "900px",
                width: "100%",
                borderRadius: "24px",
                border: `1.5px solid ${colors.borderCard}`,
                boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
                overflow: "hidden"
              }}
            >
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${colors.borderCard}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "900", color: "#A855F7", backgroundColor: "rgba(168, 85, 247, 0.15)", padding: "3px 10px", borderRadius: "6px" }}>
                    📹 REPRISE DE AULA
                  </span>
                  <h3 style={{ fontSize: "17px", fontWeight: "900", margin: "4px 0 0 0", color: colors.textPrimary }}>
                    {repriseAulaModal.titulo}
                  </h3>
                </div>
                <button
                  onClick={() => setRepriseAulaModal(null)}
                  style={{ border: "none", backgroundColor: "transparent", color: colors.textSecondary, fontSize: "20px", cursor: "pointer", fontWeight: "900" }}
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: "24px" }}>
                {repriseAulaModal.link_gravacao && (repriseAulaModal.link_gravacao.includes("youtube") || repriseAulaModal.link_gravacao.includes("youtu.be")) ? (
                  <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: "16px", overflow: "hidden", backgroundColor: "#000" }}>
                    <iframe
                      src={repriseAulaModal.link_gravacao.includes("embed") ? repriseAulaModal.link_gravacao : `https://www.youtube-nocookie.com/embed/${repriseAulaModal.link_gravacao.split("v=")[1]?.split("&")[0] || repriseAulaModal.link_gravacao.split("/").pop()}?autoplay=1&rel=0`}
                      title={repriseAulaModal.titulo}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div style={{ padding: "30px", textAlign: "center", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: "16px" }}>
                    <p style={{ fontSize: "15px", color: colors.textPrimary, fontWeight: "700", marginBottom: "12px" }}>
                      📹 A gravação está disponível no link do instrutor:
                    </p>
                    <a
                      href={repriseAulaModal.link_gravacao || repriseAulaModal.link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "12px 24px",
                        borderRadius: "12px",
                        backgroundColor: "#A855F7",
                        color: "#FFFFFF",
                        fontWeight: "900",
                        textDecoration: "none",
                        display: "inline-block"
                      }}
                    >
                      ▶️ Assistir Gravação Externa
                    </a>
                  </div>
                )}
                <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: colors.textSecondary }}>
                  <span>👨‍🏫 Instrutor: {repriseAulaModal.instrutor}</span>
                  <span>✅ Presença de Reprise Registrada</span>
                </div>
              </div>
            </div>
          </div>
        )}

        </div>
    </>
  );
}

