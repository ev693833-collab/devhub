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
import NotificationCenterModal from "../components/NotificationCenterModal";
import TicketsModule from "../components/TicketsModule";
import { 
  BookOpen, Calendar, Trophy, FileText, CheckSquare, 
  Sparkles, ChevronLeft, ChevronRight, ChevronDown, User, Shield, Layers, Swords, Crown,
  LogOut, Moon, Sun, Settings, Bell, Zap, Check, BookMarked, Code, BrainCircuit, Compass, LifeBuoy, Home
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  // Estados de Usuário e Tema
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(true);

  // Controle de Navegação Lateral & Perfil
  const [abaAtiva, setAbaAtiva] = useState("visao_geral");
  const [sidebarRecolhida, setSidebarRecolhida] = useState(false);
  const [menuAulasAberto, setMenuAulasAberto] = useState(true);
  const [modalPerfilOpen, setModalPerfilOpen] = useState(false);
  const [modalNotificacoesOpen, setModalNotificacoesOpen] = useState(false);
  const [modalTicketsOpen, setModalTicketsOpen] = useState(false);
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

  // Verifica se o módulo está liberado para o aluno logado
  const isModuloLiberado = (abaId) => {
    if (!user) return true;
    if (abaId === "super_admin") return user.cargo === "superadmin" || user.cargo === "super_admin" || user.cargo === "admin";

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
    if (abaAtiva && !isModuloLiberado(abaAtiva)) {
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

              {/* Botão de Notificações com Sininho */}
              <button
                onClick={() => setModalNotificacoesOpen(true)}
                title="Central de Notificações"
                style={{
                  position: "relative",
                  background: isDark ? "rgba(255, 255, 255, 0.06)" : "#F1F5F9",
                  border: `1px solid ${colors.borderCard}`,
                  color: colors.textPrimary,
                  borderRadius: "12px",
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <Bell size={18} color="#38bdf8" />
                {unreadNotificacoesCount > 0 && (
                  <span style={{
                    position: "absolute", top: "-4px", right: "-4px",
                    width: "16px", height: "16px", borderRadius: "50%",
                    background: "#ef4444", color: "#fff", fontSize: "10px",
                    fontWeight: "800", display: "flex", alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {unreadNotificacoesCount}
                  </span>
                )}
              </button>

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
                            setAbaAtiva("games");
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

                        {/* Tickets & Suporte */}
                        <button
                          onClick={() => {
                            setAbaAtiva("tickets");
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
                          <LifeBuoy size={16} style={{ color: "#3B82F6" }} />
                          <span>Tickets & Suporte 🎟️</span>
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
                { id: "visao_geral", label: "Visão Geral", sublabel: "Home do Aluno", icon: Home, color: "#10B981", badge: "Início 🏠" },
                { id: "aulas", label: "Aulas & Guia", sublabel: "Full Stack", icon: BookOpen, color: "#3B82F6", badge: `${categorias[0]?.slides?.length || 0}` },
                { id: "agenda", label: "Calendário & Agenda", sublabel: "Aulas & Reuniões", icon: Calendar, color: "#EF4444", badge: "Ao Vivo 🔴" },
                { id: "games", label: "Jogos DevHub", sublabel: "Catálogo de Jogos", icon: Swords, color: "#6366F1", badge: "2 Jogos 🎮" },
                { id: "caderno", label: "Caderno de Estudos", sublabel: "Anotações Dev", icon: BookMarked, color: "#818CF8", badge: "Notas 📝" },
                { id: "playground", label: "Code Playground", sublabel: "Executor Web", icon: Code, color: "#10B981", badge: "Novo ⚡" },
                { id: "flashcards", label: "Flashcards IA", sublabel: "Revisão Rápida", icon: BrainCircuit, color: "#F59E0B", badge: "IA 🧠" },
                { id: "trilhas", label: "Trilhas & Badges", sublabel: "Roadmap Career", icon: Compass, color: "#06B6D4", badge: "Roadmap 🚀" },
                { id: "mini_sistemas", label: "Mini-Sistemas", sublabel: "Laboratório Prático", icon: Layers, color: "#10B981", badge: "Prático 🧪" },
                { id: "ranking", label: "Hall da Fama", sublabel: "Top Alunos", icon: Trophy, color: "#F59E0B", badge: "TOP 🏆" },
                { id: "evolucao", label: "Sua Evolução", sublabel: "Timeline", icon: Zap, color: "#EC4899", badge: "Trilha 📈" },
                { id: "notas", label: "Notas das Provas", sublabel: "Boletim", icon: FileText, color: "#A855F7" },
                { id: "provas-online", label: "Realizar Provas", sublabel: "Avaliações", icon: CheckSquare, color: "#EC4899" },
                { id: "dev_ia", label: "Dev IA Tutor", sublabel: "Assistente 24/7", icon: Sparkles, color: "#6366F1", badge: "IA ⚡" },
                { id: "tickets", label: "Tickets & Suporte", sublabel: "Central de Ajuda", icon: LifeBuoy, color: "#3B82F6", badge: "Suporte 🎟️" }
              ]
                .filter((item) => isModuloLiberado(item.id))
                .map((item) => {
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
                        setSidebarRecolhida(true);
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
            {abaAtiva === "visao_geral" && (
              <VisaoGeralSection user={user} setAbaAtiva={setAbaAtiva} isDark={isDark} />
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

            {/* ABA: CATÁLOGO DE JOGOS (Batalha de Código + Programar em Dupla) */}
            {abaAtiva === "games" && (
              <GameCatalogModule user={user} isDark={isDark} colors={colors} relatorioAlunos={relatorioAlunos} />
            )}

            {/* ABA: CADERNO DE ESTUDOS */}
            {abaAtiva === "caderno" && (
              <CadernoEstudosModule user={user} isDark={isDark} colors={colors} />
            )}

            {/* ABA: CODE PLAYGROUND WEB */}
            {abaAtiva === "playground" && (
              <CodePlaygroundModule initialCode={targetSnippetCodigo} />
            )}

            {/* ABA: FLASHCARDS IA */}
            {abaAtiva === "flashcards" && (
              <FlashcardsModule />
            )}

            {/* ABA: TRILHAS DE APRENDIZADO & BADGES */}
            {abaAtiva === "trilhas" && (
              <TrilhasModule user={user} onSelectAba={handleNavegarDaTrilha} />
            )}

            {/* ABA: LABORATÓRIO DE MINI-SISTEMAS PRÁTICOS */}
            {abaAtiva === "mini_sistemas" && (
              <MiniSistemasModule user={user} isDark={isDark} colors={colors} initialProjetoId={targetProjetoId} />
            )}

            {/* ABA 3: HALL DA FAMA / RANKING DE DEVS */}
            {abaAtiva === "ranking" && (
              <HallDaFamaModule isDark={isDark} colors={colors} />
            )}

            {/* ABA 5: EVOLUÇÃO / TIMELINE */}
            {abaAtiva === "evolucao" && (
              <EvolucaoTimelineModule isDark={isDark} colors={colors} />
            )}

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
                      backgroundColor: colors.bgCard,
                      border: `1px solid ${isDiaria && !isDiaria._small ? "rgba(168,85,247,0.35)" : colors.borderCard}`,
                      borderRadius: "18px",
                      padding: "22px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      overflow: "hidden",
                      opacity: isFutura ? 0.85 : 1
                    }}
                  >
                    {/* Glow sutil para provas diárias */}
                    {isDiaria && (
                      <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                        background: isFutura
                          ? "linear-gradient(90deg, #eab308, #a855f7)"
                          : "linear-gradient(90deg, #a855f7, #ec4899, #a855f7)",
                        borderRadius: "18px 18px 0 0"
                      }} />
                    )}

                    <div>
                      {/* Header do card */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                          {isFutura ? (
                            <span style={{ fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "8px", backgroundColor: "rgba(234,179,8,0.15)", color: "#EAB308", border: "1px solid rgba(234,179,8,0.4)" }}>🔒 Agendada ({diasSemana[prova.diaSemana]})</span>
                          ) : expirada ? (
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
                          disabled={expirada || provaJaRealizada || isFutura}
                          onClick={() => handleIniciarProvaOnline(prova)}
                          style={{
                            flex: 1, padding: "12px", borderRadius: "10px",
                            backgroundColor: (expirada || provaJaRealizada || isFutura) ? (isDark ? "rgba(255,255,255,0.06)" : "#CBD5E1") : "#EC4899",
                            color: (expirada || provaJaRealizada || isFutura) ? colors.textSecondary : "#FFFFFF",
                            border: "none", fontWeight: "700", fontSize: "13px",
                            cursor: (expirada || provaJaRealizada || isFutura) ? "not-allowed" : "pointer"
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

                    {/* Calendário semanal (Disponível a partir de Hoje) */}
                    <div style={{ display: "flex", gap: "8px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
                      {PROVAS_DIARIAS.filter(p => p.diaSemana >= diaSemanaHoje).map((p) => {
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
                            <div style={{ fontSize: "11px", fontWeight: "800", color: isHoje ? "#A855F7" : colors.textSecondary }}>
                              {diasSemana[p.diaSemana]} <span style={{ fontSize: "9.5px", opacity: 0.85, fontWeight: "900" }}>{p.id.includes("-v2-") ? "P2" : "P1"}</span>
                            </div>
                            <div style={{ fontSize: "10px", color: isHoje ? "#A855F7" : colors.textSecondary, marginTop: "2px", lineHeight: "1.2" }}>{p.tema.split(" ").slice(0, 2).join(" ")}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Provas em Destaque do Dia (2 Provas por dia) */}
                    {(() => {
                      const provasHoje = PROVAS_DIARIAS.filter(p => p.diaSemana === diaSemanaHoje);
                      if (provasHoje.length === 0) return null;
                      return (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
                          {provasHoje.map((pHoje) => (
                            <div key={pHoje.id} style={{
                              background: isDark
                                ? "linear-gradient(135deg, rgba(168,85,247,0.18) 0%, rgba(236,72,153,0.10) 100%)"
                                : "linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(236,72,153,0.05) 100%)",
                              border: "1.5px solid rgba(168,85,247,0.35)",
                              borderRadius: "20px",
                              padding: "24px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              gap: "16px",
                              position: "relative",
                              overflow: "hidden"
                            }}>
                              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #a855f7, #ec4899, #a855f7)" }} />
                              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                                <div style={{
                                  width: "56px", height: "56px", flexShrink: 0,
                                  background: "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(236,72,153,0.15))",
                                  border: "2px solid rgba(168,85,247,0.4)",
                                  borderRadius: "16px",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: "28px"
                                }}>
                                  {pHoje.emoji}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", flexWrap: "wrap" }}>
                                    <span style={{
                                      fontSize: "10px", fontWeight: "900", padding: "2px 8px", borderRadius: "12px",
                                      background: "linear-gradient(135deg,#a855f7,#ec4899)", color: "#FFF", letterSpacing: "0.5px"
                                    }}>✨ PROVA DO DIA</span>
                                    <span style={{ fontSize: "11px", color: colors.textSecondary }}>⏱️ {pHoje.duracaoMinutos} min</span>
                                    <span style={{ fontSize: "11px", color: colors.textSecondary }}>❓ {pHoje.questoes.length} q.</span>
                                  </div>
                                  <h3 style={{ fontSize: "17px", fontWeight: "900", marginBottom: "6px" }}>{pHoje.titulo}</h3>
                                  <p style={{ fontSize: "12px", color: colors.textSecondary, lineHeight: "1.5" }}>{pHoje.descricao}</p>
                                </div>
                              </div>

                              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
                                        padding: "11px 20px",
                                        borderRadius: "12px",
                                        background: jaFezHoje ? (isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0") : "linear-gradient(135deg,#EC4899,#a855f7)",
                                        color: jaFezHoje ? colors.textSecondary : "#FFF",
                                        border: "none", fontWeight: "800", fontSize: "13px",
                                        cursor: jaFezHoje ? "not-allowed" : "pointer",
                                        boxShadow: jaFezHoje ? "none" : "0 4px 14px rgba(236,72,153,0.35)",
                                        transition: "all 0.2s"
                                      }}
                                    >
                                      {jaFezHoje ? `🔒 Concluída hoje! (Nota: ${regHoje ? regHoje.nota : "?"})` : "🚀 Realizar Prova do Dia"}
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

                  {/* ===== SEÇÃO: PROVAS A PARTIR DE HOJE ===== */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <div style={{ width: "4px", height: "24px", background: "linear-gradient(180deg,#10B981,#3B82F6)", borderRadius: "4px" }} />
                      <h3 style={{ fontSize: "17px", fontWeight: "800" }}>📅 Próximas Provas da Semana</h3>
                      <span style={{ fontSize: "12px", color: colors.textSecondary }}>— agendadas para os próximos dias</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
                      {PROVAS_DIARIAS.filter(p => p.diaSemana > diaSemanaHoje).map(prova => renderCardProva(prova, true))}
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
            {/* ABA TICKETS & SUPORTE */}
            {abaAtiva === "tickets" && (
              <TicketsModule user={user} />
            )}

            {abaAtiva === "super_admin" && (
              <SuperAdminModule isDark={isDark} colors={colors} currentUser={user} />
            )}



            {/* ABA: SUA EVOLUÇÃO — TIMELINE & XP */}
            {abaAtiva === "evolucao" && (
              <EvolucaoTimelineModule isDark={isDark} colors={colors} user={user} />
            )}

            {/* ABA: DEV IA — ASSISTENTE DE ESTUDOS DE PROGRAMAÇÃO */}
            {abaAtiva === "dev_ia" && (
              <DevIaModule user={user} />
            )}
              </>
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
          onTemaEquipado={(temaId) => setTemaEquipado(temaId)}
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


        {/* MODAL DA CENTRAL DE NOTIFICAÇÕES */}
        <NotificationCenterModal 
          isOpen={modalNotificacoesOpen} 
          onClose={() => setModalNotificacoesOpen(false)} 
          onUpdateUnreadCount={(count) => setUnreadNotificacoesCount(count)}
        />



        </div>
    </>
  );
}
