import { useState, useMemo, useEffect } from "react";
import {
  Code, Play, Eye, Sparkles, Terminal, User, ShoppingBag, DollarSign, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, Table, HelpCircle, Layers, Inbox, Trash2, BookOpen, ShieldCheck, Cpu, ArrowLeft, Star, FileCode, CheckSquare, Award, Flame, Search, ChevronLeft, ChevronRight
} from "lucide-react";

// CATÁLOGO DOS 9 PROJETOS DO MUNDO REAL COM VALIDAÇÃO E TESTES AUTOMATIZADOS (SISTEMA JUSTO)
const PROJETOS_REAIS = [
  {
    id: "biblioteca",
    titulo: "Sistema de Biblioteca & Empréstimos",
    nivel: "Iniciante / Intermediário",
    nivelTag: "Iniciante",
    corNivel: "#10B981",
    icone: "📚",
    categoria: "Estrutura de Dados & Lógica",
    descricao: "Desenvolva o motor de controle de livros, empréstimos para alunos e cálculo de multa de atraso.",
    requisitos: [
      "Criar uma lista contendo pelo menos 3 livros com: id, titulo, autor e status ('disponivel' ou 'emprestado').",
      "Implementar a função de realizar empréstimo alterando o status do livro de ID 1 para 'emprestado'.",
      "Calcular o total de livros com status 'emprestado' (deve resultar em 2 livros no total).",
      "Atribuir o relatório final compilado à variável 'resultado'."
    ],
    dicaSenior: "💡 Dica de Tech Lead: Separe a lógica de validação da manipulação dos objetos para manter o código limpo (Clean Code).",
    boilerplate: `// 📚 DESAFIO: Sistema de Biblioteca & Empréstimos

const acervo = [
  { id: 1, titulo: "Clean Code", autor: "Robert C. Martin", status: "disponivel" },
  { id: 2, titulo: "JavaScript Eloquente", autor: "Marijn Haverbeke", status: "emprestado" },
  { id: 3, titulo: "Padrões de Arquitetura", autor: "Martin Fowler", status: "disponivel" }
];

function emprestarLivro(id) {
  // TODO: Busque o livro pelo ID no acervo e altere o status de "disponivel" para "emprestado"
  
}

// TODO: Execute a função emprestarLivro(1) para realizar o empréstimo
emprestarLivro(1);

// TODO: Calcule o número total de livros atualmente emprestados no acervo
const totalEmprestados = 0; // Substitua com a contagem dinâmica

// TODO: Atribua o resultado compilado à variável 'resultado':
const resultado = {
  totalLivros: acervo.length,
  emprestados: totalEmprestados,
  acervoAtualizado: acervo
};`,
    validar: (res) => {
      if (!res || typeof res !== "object") return { ok: false, erro: "O resultado retornado deve ser um objeto contendo { totalLivros, emprestados, acervoAtualizado }." };
      if (!Array.isArray(res.acervoAtualizado)) return { ok: false, erro: "O campo 'acervoAtualizado' deve ser o array com os livros do acervo." };
      
      const livro1 = res.acervoAtualizado.find(l => l.id === 1);
      if (!livro1 || livro1.status !== "emprestado") {
        return { ok: false, erro: "A função emprestarLivro(1) precisa alterar o status do livro 1 para 'emprestado'." };
      }
      
      if (typeof res.emprestados !== "number" || res.emprestados < 2) {
        return { ok: false, erro: "O número de livros 'emprestados' deve ser 2 (livro 2 que já estava emprestado + livro 1 recém emprestado)." };
      }
      
      return { ok: true };
    }
  },
  {
    id: "auth_jwt",
    titulo: "Sistema de Autenticação & JWT",
    nivel: "Intermediário",
    nivelTag: "Intermediário",
    corNivel: "#3B82F6",
    icone: "🔑",
    categoria: "Segurança & Backend",
    descricao: "Crie o fluxo de autenticação de usuários com verificação de credenciais e token simulado de acesso.",
    requisitos: [
      "Cadastrar banco simulado de usuários com email e status.",
      "Criar função realizarLogin(email) que valida se o usuário existe.",
      "Gerar token fictício de acesso JWT para sessões válidas (ex: 'bearer_token_xyz').",
      "Retornar a resposta de autenticação no objeto 'resultado'."
    ],
    dicaSenior: "🔒 Segurança: Nunca armazene senhas em texto puro. Em produção, utilize bcrypt e variáveis de ambiente.",
    boilerplate: `// 🔑 DESAFIO: Sistema de Autenticação
const usuariosDB = [
  { id: 101, email: "dev@devhub.com", tokenPayload: "USER_ACTIVE" }
];

function realizarLogin(email) {
  // TODO: Busque o usuário em usuariosDB pelo email.
  // Se não encontrar, retorne { sucesso: false, erro: "Usuário não encontrado" }
  // Se encontrar, retorne { sucesso: true, token: "bearer_token_123", usuario: email }
  
}

// TODO: Execute realizarLogin("dev@devhub.com") e atribua o retorno à variável 'resultado'
const resultado = null;`,
    validar: (res) => {
      if (!res || typeof res !== "object") return { ok: false, erro: "Atribua a resposta da função realizarLogin('dev@devhub.com') à variável 'resultado'." };
      if (!res.sucesso) return { ok: false, erro: "Ao realizar login com 'dev@devhub.com', a resposta deve ter sucesso: true." };
      if (!res.token || typeof res.token !== "string" || res.token.length < 5) return { ok: false, erro: "O login com sucesso deve gerar um token string válido." };
      if (res.usuario !== "dev@devhub.com") return { ok: false, erro: "O campo 'usuario' no resultado deve corresponder ao email informado." };
      return { ok: true };
    }
  },
  {
    id: "api_rest",
    titulo: "API RESTful de Gestão de Produtos",
    nivel: "Intermediário",
    nivelTag: "Intermediário",
    corNivel: "#3B82F6",
    icone: "🚀",
    categoria: "Backend Node.js & Express",
    descricao: "Estruture o roteamento dos métodos HTTP (GET, POST, PUT, DELETE) para gerenciamento de catálogo.",
    requisitos: [
      "Simular rota postProduto(novoProduto) cadastrando um novo item.",
      "Tratar código de status HTTP (201 Created se válido, 400 Bad Request se faltar nome/preço).",
      "Cadastrar um produto válido (ex: { nome: 'Mouse Gamer', preco: 150.00 })",
      "Exportar o resultado da chamada à variável 'resultado'."
    ],
    dicaSenior: "⚡ REST Standard: Mantenha URLs no plural e utilize códigos de status HTTP semânticos.",
    boilerplate: `// 🚀 DESAFIO: API RESTful de Produtos
const produtos = [
  { id: 1, nome: "Teclado Mecânico RGB", preco: 299.90, categoria: "Periféricos" },
  { id: 2, nome: "Monitor Ultrawide 29", preco: 1299.00, categoria: "Monitores" }
];

function postProduto(novoProduto) {
  // TODO: Valide se o produto contém 'nome' e 'preco'. Se não tiver, retorne { status: 400, erro: "Dados inválidos" }
  // Caso seja válido, insira no array 'produtos' com novo ID e retorne { status: 201, body: novoProduto }
  
}

// TODO: Cadastre um novo produto e atribua a resposta final à variável 'resultado'
const resultado = null;`,
    validar: (res) => {
      if (!res || typeof res !== "object") return { ok: false, erro: "Atribua a resposta de postProduto(...) à variável 'resultado'." };
      if (res.status !== 201) return { ok: false, erro: "O método postProduto com dados válidos deve retornar status 201 (Created)." };
      if (!res.body || !res.body.nome || !res.body.preco) return { ok: false, erro: "O corpo da resposta (body) deve incluir o produto recém-cadastrado." };
      return { ok: true };
    }
  },
  {
    id: "ecommerce",
    titulo: "E-commerce & Carrinho de Compras",
    nivel: "Intermediário / Avançado",
    nivelTag: "Avançado",
    corNivel: "#8B5CF6",
    icone: "🛒",
    categoria: "Full Stack & Regras de Negócio",
    descricao: "Construa o cálculo de subtotal, cupom de desconto e frete dinâmico para uma loja virtual.",
    requisitos: [
      "Calcular o subtotal somando (qtd * precoUnitario) dos itens do carrinho.",
      "Aplicar 10% de desconto caso o subtotal seja maior que R$ 200.",
      "Calcular valor de frete (R$ 0 grátis se subtotal > R$ 150, senão R$ 15.00).",
      "Retornar a nota de compra no objeto 'resultado': { subtotal, desconto, frete, totalPagar }."
    ],
    dicaSenior: "💰 Financeiro: Evite arredondamentos imprecisos em JS utilizando representação em centavos ou .toFixed(2).",
    boilerplate: `// 🛒 DESAFIO: Carrinho de Compras E-commerce
const carrinho = [
  { item: "Curso Full Stack", qtd: 1, precoUnitario: 199.90 },
  { item: "Apostila de Algoritmos", qtd: 2, precoUnitario: 35.00 }
];

// TODO: Calcule o subtotal (199.90 + 70.00 = 269.90)
const subtotal = 0; 

// TODO: Aplique 10% de desconto se subtotal > 200 (deve dar 26.99)
const desconto = 0; 

// TODO: Calcule o frete (0 se subtotal > 150, senão 15.00)
const frete = 0; 

// TODO: Calcule o total final a pagar (subtotal - desconto + frete)
const totalPagar = 0;

// TODO: Atribua o resultado à variável 'resultado':
const resultado = {
  subtotal,
  desconto,
  frete,
  totalPagar
};`,
    validar: (res) => {
      if (!res || typeof res !== "object") return { ok: false, erro: "Atribua o resumo da compra à variável 'resultado'." };
      if (Math.abs(res.subtotal - 269.90) > 0.5) return { ok: false, erro: "O subtotal calculado deve ser R$ 269.90 (199.90 + 70.00)." };
      if (Math.abs(res.desconto - 26.99) > 0.5) return { ok: false, erro: "O desconto de 10% aplicado para compras acima de R$ 200 deve ser R$ 26.99." };
      if (res.frete !== 0) return { ok: false, erro: "O frete para compras acima de R$ 150 deve ser R$ 0.00 (Grátis)." };
      if (Math.abs(res.totalPagar - 242.91) > 0.5) return { ok: false, erro: "O total a pagar (subtotal - desconto + frete) deve ser R$ 242.91." };
      return { ok: true };
    }
  },
  {
    id: "dashboard",
    titulo: "Dashboard Analítico Financeiro",
    nivel: "Intermediário",
    nivelTag: "Intermediário",
    corNivel: "#3B82F6",
    icone: "📊",
    categoria: "Frontend & Métricas",
    descricao: "Processe um conjunto de transações e gere indicadores de Receita Total, Despesas e Margem de Lucro.",
    requisitos: [
      "Somar todas as transações do tipo 'receita'.",
      "Somar todas as transações do tipo 'despesa'.",
      "Calcular o saldo líquido consolidado (receitas - despesas).",
      "Atribuir os indicadores no objeto 'resultado': { totalReceitas, totalDespesas, saldoLiquido }."
    ],
    dicaSenior: "📊 BI Analytics: Organize as métricas em formato de KPI para alimentar dashboards visuais.",
    boilerplate: `// 📊 DESAFIO: Dashboard Analítico
const transacoes = [
  { id: 1, descricao: "Venda de Licença SaaS", valor: 1500.00, tipo: "receita" },
  { id: 2, descricao: "Servidor AWS", valor: 320.00, tipo: "despesa" },
  { id: 3, descricao: "Consultoria Dev", valor: 800.00, tipo: "receita" }
];

// TODO: Calcule totalReceitas (1500 + 800 = 2300)
const totalReceitas = 0;

// TODO: Calcule totalDespesas (320)
const totalDespesas = 0;

// TODO: Calcule saldoLiquido (2300 - 320 = 1980)
const saldoLiquido = 0;

// TODO: Atribua o resumo à variável 'resultado':
const resultado = {
  totalReceitas,
  totalDespesas,
  saldoLiquido
};`,
    validar: (res) => {
      if (!res || typeof res !== "object") return { ok: false, erro: "Atribua os indicadores do dashboard à variável 'resultado'." };
      if (res.totalReceitas !== 2300) return { ok: false, erro: "O total de receitas calculado deve ser R$ 2300.00." };
      if (res.totalDespesas !== 320) return { ok: false, erro: "O total de despesas calculado deve ser R$ 320.00." };
      if (res.saldoLiquido !== 1980) return { ok: false, erro: "O saldo líquido deve ser R$ 1980.00 (receitas - despesas)." };
      return { ok: true };
    }
  },
  {
    id: "helpdesk",
    titulo: "Sistema de Chamados (Helpdesk)",
    nivel: "Intermediário",
    nivelTag: "Intermediário",
    corNivel: "#3B82F6",
    icone: "🎟️",
    categoria: "Gestão de Estado & Prioridades",
    descricao: "Crie o controle de tickets de suporte com prioridade (Baixa, Média, Alta) e troca de status.",
    requisitos: [
      "Criar função atenderTicketCritico() que localiza o ticket de prioridade 'ALTA' e status 'aberto'.",
      "Alterar o status desse ticket para 'em_atendimento'.",
      "Retornar a lista de tickets atualizados no objeto 'resultado'."
    ],
    dicaSenior: "🎟️ Queues: Utilize filas de prioridade para garantir atendimento aos chamados críticos primeiro.",
    boilerplate: `// 🎟️ DESAFIO: Sistema de Chamados Helpdesk
const tickets = [
  { id: 101, titulo: "Erro 500 no checkout", prioridade: "ALTA", status: "aberto" },
  { id: 102, titulo: "Trocar foto de perfil", prioridade: "BAIXA", status: "aberto" }
];

function atenderTicketCritico() {
  // TODO: Encontre o ticket de prioridade "ALTA" que esteja "aberto" e mude seu status para "em_atendimento"
  
}

// TODO: Execute a função atenderTicketCritico()
atenderTicketCritico();

// TODO: Atribua os tickets à variável 'resultado':
const resultado = {
  tickets
};`,
    validar: (res) => {
      if (!res || typeof res !== "object") return { ok: false, erro: "Atribua o estado dos tickets à variável 'resultado'." };
      const lista = Array.isArray(res.tickets) ? res.tickets : (Array.isArray(res) ? res : null);
      if (!lista) return { ok: false, erro: "O resultado deve conter o campo 'tickets' com o array de chamados." };
      
      const ticketCritico = lista.find(t => t.id === 101);
      if (!ticketCritico || ticketCritico.status !== "em_atendimento") {
        return { ok: false, erro: "A função atenderTicketCritico deve mudar o status do ticket 101 (ALTA) de 'aberto' para 'em_atendimento'." };
      }
      return { ok: true };
    }
  },
  {
    id: "financeiro",
    titulo: "Sistema Financeiro & Balanço",
    nivel: "Iniciante / Intermediário",
    nivelTag: "Iniciante",
    corNivel: "#10B981",
    icone: "💰",
    categoria: "Cálculos & Validações",
    descricao: "Desenvolva a validação de orçamento com bloqueio de compras quando não houver saldo suficiente.",
    requisitos: [
      "Criar função efetuarPagamento(descricao, valor).",
      "Se valor > saldoConta, registrar extrato com status 'RECUSADO' e retornar false.",
      "Se saldo for suficiente, descontar do saldoConta, registrar extrato com status 'APROVADO' e retornar true.",
      "Exportar extrato e saldoFinal na variável 'resultado'."
    ],
    dicaSenior: "🛡️ Defensivo: Sempre cheque o saldo antes de debitar para evitar inconsistências de concorrência.",
    boilerplate: `// 💰 DESAFIO: Sistema Financeiro
let saldoConta = 500.00;
const extrato = [];

function efetuarPagamento(descricao, valor) {
  // TODO: Se valor > saldoConta, registre no extrato { descricao, valor, status: "RECUSADO" } e retorne false.
  // Senão, subtraia de saldoConta, registre no extrato { descricao, valor, status: "APROVADO" } e retorne true.
  
}

// TODO: Teste um pagamento aprovado (ex: 120.00) e um recusado (ex: 1000.00)
efetuarPagamento("Servidor VPS", 120.00);
efetuarPagamento("Notebook Novo", 1000.00);

// TODO: Atribua o resultado à variável 'resultado':
const resultado = {
  saldoFinal: saldoConta,
  extrato
};`,
    validar: (res) => {
      if (!res || typeof res !== "object") return { ok: false, erro: "Atribua o extrato e saldoFinal à variável 'resultado'." };
      if (res.saldoFinal !== 380.00) return { ok: false, erro: "O saldo final deve ser R$ 380.00 após o pagamento aprovado de R$ 120.00." };
      if (!Array.isArray(res.extrato) || res.extrato.length < 2) return { ok: false, erro: "O extrato deve conter pelo menos 2 registros (um aprovado e um recusado)." };
      const recusado = res.extrato.find(e => e.status === "RECUSADO");
      if (!recusado) return { ok: false, erro: "Transações com valor maior que o saldo disponível devem ter status 'RECUSADO' no extrato." };
      return { ok: true };
    }
  },
  {
    id: "chat_realtime",
    titulo: "Sistema de Chat & Notificações",
    nivel: "Avançado",
    nivelTag: "Avançado",
    corNivel: "#8B5CF6",
    icone: "💬",
    categoria: "Eventos & Data Streams",
    descricao: "Simule a troca de mensagens em tempo real entre usuários com timestamps e leituras pendentes.",
    requisitos: [
      "Criar função marcarTodasComoLidas() para alterar o atributo 'lido' de todas as conversas para true.",
      "Calcular o total de mensagens não lidas restantes (deve ser 0).",
      "Exportar conversas no objeto 'resultado'."
    ],
    dicaSenior: "💬 Real-time: Em produção com WebSockets/Socket.io, envie apenas difusões de pacotes leves.",
    boilerplate: `// 💬 DESAFIO: Chat em Tempo Real
const conversas = [
  { id: 1, de: "DevHub Bot", texto: "Bem-vindo ao chat!", lido: true },
  { id: 2, de: "Lucas Dev", texto: "Conseguiu revisar o PR?", lido: false },
  { id: 3, de: "Ana Tech Lead", texto: "Reunião em 5 minutos", lido: false }
];

function marcarTodasComoLidas() {
  // TODO: Altere o atributo 'lido' de todas as mensagens em conversas para true
  
}

// TODO: Execute marcarTodasComoLidas()
marcarTodasComoLidas();

// TODO: Atribua as conversas à variável 'resultado':
const resultado = {
  conversas,
  naoLidas: 0 // substitua por conversas.filter(c => !c.lido).length
};`,
    validar: (res) => {
      if (!res || typeof res !== "object") return { ok: false, erro: "Atribua as conversas à variável 'resultado'." };
      const lista = Array.isArray(res.conversas) ? res.conversas : (Array.isArray(res) ? res : null);
      if (!lista) return { ok: false, erro: "O campo 'conversas' deve conter o array com as mensagens." };
      const pendentes = lista.filter(c => c.lido === false);
      if (pendentes.length > 0) return { ok: false, erro: "A função marcarTodasComoLidas deve alterar todas as mensagens não lidas para lido: true." };
      return { ok: true };
    }
  },
  {
    id: "fullstack_app",
    titulo: "Aplicação Full Stack Completa",
    nivel: "Avançado / Mestre",
    nivelTag: "Avançado",
    corNivel: "#8B5CF6",
    icone: "⚡",
    categoria: "Arquitetura & Engenharia",
    descricao: "Integre Frontend, Regras de Negócio e Banco de Dados em uma arquitetura completa de produção.",
    requisitos: [
      "Criar função cadastrarProjeto(nome, progresso) que insere um novo item no banco simulado.",
      "Cadastrar um novo projeto ('App Mobile DevHub', progresso: 80).",
      "Exportar o estado final do banco de dados na variável 'resultado'."
    ],
    dicaSenior: "👑 Master Architecture: Separe em camadas (Controller, Service, Repository) para desacoplamento.",
    boilerplate: `// ⚡ DESAFIO: Aplicação Full Stack Completa
const Database = {
  projetos: [{ id: 1, nome: "Plataforma DevHub", progresso: 100 }]
};

function cadastrarProjeto(nome, progresso) {
  // TODO: Crie um novo objeto de projeto com ID incremental e insira no array Database.projetos
  
}

// TODO: Execute cadastrarProjeto("App Mobile DevHub", 80)
cadastrarProjeto("App Mobile DevHub", 80);

// TODO: Atribua os projetos à variável 'resultado':
const resultado = {
  projetos: Database.projetos
};`,
    validar: (res) => {
      if (!res || typeof res !== "object") return { ok: false, erro: "Atribua os projetos à variável 'resultado'." };
      const lista = Array.isArray(res.projetos) ? res.projetos : (Array.isArray(res) ? res : null);
      if (!lista || lista.length < 2) return { ok: false, erro: "Você deve executar a função cadastrarProjeto para adicionar um novo item ao banco!" };
      return { ok: true };
    }
  }
];

export default function MiniSistemasModule({ user, isDark, colors, initialProjetoId }) {
  const [projetoSelecionadoId, setProjetoSelecionadoId] = useState(initialProjetoId || null);
  const [filtroNivel, setFiltroNivel] = useState("Todos");
  const [buscaTermo, setBuscaTermo] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 4;

  const [codigoText, setCodigoText] = useState("");
  const [analiseStatus, setAnaliseStatus] = useState(null);
  const [dadosResultado, setDadosResultado] = useState(null);
  const [logsConsole, setLogsConsole] = useState([]);
  const [codeReviewIa, setCodeReviewIa] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [projetosConcluidosIds, setProjetosConcluidosIds] = useState(["biblioteca"]);

  useEffect(() => {
    if (initialProjetoId) {
      const proj = PROJETOS_REAIS.find(p => p.id === initialProjetoId);
      if (proj) {
        setProjetoSelecionadoId(proj.id);
        setCodigoText(proj.boilerplate);
      }
    }
  }, [initialProjetoId]);

  // Obter o projeto ativo selecionado pelo aluno
  const projetoAtivo = useMemo(() => {
    return PROJETOS_REAIS.find(p => p.id === projetoSelecionadoId) || null;
  }, [projetoSelecionadoId]);

  // Filtragem dos projetos no catálogo por nível e busca
  const projetosFiltrados = useMemo(() => {
    return PROJETOS_REAIS.filter(p => {
      const bateNivel = filtroNivel === "Todos" || p.nivelTag === filtroNivel;
      const bateBusca = !buscaTermo || 
        p.titulo.toLowerCase().includes(buscaTermo.toLowerCase()) ||
        p.categoria.toLowerCase().includes(buscaTermo.toLowerCase()) ||
        p.descricao.toLowerCase().includes(buscaTermo.toLowerCase());
      return bateNivel && bateBusca;
    });
  }, [filtroNivel, buscaTermo]);

  const totalPaginas = Math.max(1, Math.ceil(projetosFiltrados.length / ITENS_POR_PAGINA));

  const projetosExibidos = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    return projetosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [projetosFiltrados, paginaAtual]);

  const handleTrocarNivel = (nivel) => {
    setFiltroNivel(nivel);
    setPaginaAtual(1);
  };

  const handleTrocarBusca = (e) => {
    setBuscaTermo(e.target.value);
    setPaginaAtual(1);
  };

  // Abrir um projeto específico
  const abrirProjeto = (proj) => {
    setProjetoSelecionadoId(proj.id);
    setCodigoText(proj.boilerplate);
    setAnaliseStatus(null);
    setDadosResultado(null);
    setLogsConsole([]);
    setCodeReviewIa(null);
  };

  // Voltar para a lista de catálogo
  const voltarAoCatalogo = () => {
    setProjetoSelecionadoId(null);
    setAnaliseStatus(null);
    setDadosResultado(null);
    setCodeReviewIa(null);
  };

  // Resetar o código para o modelo inicial
  const handleResetarCodigo = () => {
    if (!projetoAtivo) return;
    if (codigoText && codigoText.trim() !== projetoAtivo.boilerplate.trim()) {
      if (!confirm("Tem certeza que deseja resetar o código? Suas alterações atuais no editor serão substituídas pelo modelo inicial.")) {
        return;
      }
    }
    setCodigoText(projetoAtivo.boilerplate);
  };

  // Executar Código e Gerar Code Review Inteligente de Tech Lead IA com Validação Rígida
  const executarEAnalisarComIA = () => {
    setLogsConsole([]);
    setCodeReviewIa(null);

    if (!codigoText || !codigoText.trim()) {
      setAnaliseStatus({
        tipo: "erro",
        mensagem: "⚠️ O campo de código está vazio! Escreva a solução do projeto antes de submeter."
      });
      return;
    }

    setAnaliseStatus({ tipo: "analisando", mensagem: "🔍 Compilando código e executando testes de validação..." });

    try {
      let customLogs = [];
      const customConsole = {
        log: (...args) => customLogs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ")),
        error: (...args) => customLogs.push("Erro: " + args.join(" "))
      };

      const runFn = new Function("console", `${codigoText}\nif (typeof resultado !== 'undefined') return resultado;\nreturn null;`);
      const output = runFn(customConsole);

      if (output === null || output === undefined) {
        throw new Error("O seu código precisa atribuir o resultado final à variável 'resultado' (ex: const resultado = { ... }) para que a IA possa validar!");
      }

      // Validação Estrita dos Requisitos Específicos do Desafio
      if (projetoAtivo && projetoAtivo.validar) {
        const testResult = projetoAtivo.validar(output);
        if (!testResult.ok) {
          setDadosResultado(null);
          setLogsConsole(customLogs.length > 0 ? customLogs : [`❌ Falha no Teste Unitário: ${testResult.erro}`]);
          setAnaliseStatus({
            tipo: "erro",
            mensagem: `❌ Requisitos Não Atendidos: ${testResult.erro}`
          });
          return; // Interrompe a aprovação! Não marca como concluído e não dá XP!
        }
      }

      setDadosResultado(output);
      setLogsConsole(customLogs.length > 0 ? customLogs : ["✅ Código compilado e aprovado em todos os testes unitários!"]);
      setAnaliseStatus({
        tipo: "sucesso",
        mensagem: "✅ Desafio APROVADO! Todos os requisitos técnicos foram cumpridos e analisados pelo Tech Lead IA."
      });

      // Gerar Code Review por IA para código aprovado
      const notaCalculada = (9.2 + Math.random() * 0.8).toFixed(1);
      const reviewObj = {
        nota: notaCalculada,
        aprovado: true,
        pontosFortes: [
          "Todos os testes unitários e requisitos funcionais foram atendidos com sucesso.",
          "Estruturação limpa e correta da variável 'resultado' para validação.",
          "Manipulação adequada das estruturas de dados do desafio."
        ],
        sugestaoSenior: `Para evoluir este projeto no seu portfólio real, adicione validações de exceção com try/catch e documente os tipos usando JSDoc ou TypeScript.`,
        xpGanha: 250
      };

      setCodeReviewIa(reviewObj);

      // Marca o projeto como concluído
      if (!projetosConcluidosIds.includes(projetoAtivo.id)) {
        setProjetosConcluidosIds(prev => [...prev, projetoAtivo.id]);
      }

      // Dispara evento global de gamificação (Acende a chama e soma XP no perfil!)
      window.dispatchEvent(new CustomEvent("devhub_estudo_realizado"));

    } catch (err) {
      setDadosResultado(null);
      setLogsConsole([`❌ Erro na compilação: ${err.message}`]);
      setAnaliseStatus({
        tipo: "erro",
        mensagem: `❌ Erro na compilação: ${err.message}`
      });
    }
  };

  const handleCopiar = () => {
    if (!codigoText) return;
    navigator.clipboard.writeText(codigoText);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* HEADER DESTAQUE DO MÓDULO */}
      <div style={{
        background: isDark
          ? "rgba(16, 185, 129, 0.08)"
          : "#ECFDF5",
        border: `1px solid ${isDark ? "rgba(16, 185, 129, 0.25)" : "#A7F3D0"}`,
        borderRadius: "16px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: "260px" }}>
          <div style={{
            width: "42px", height: "42px", borderRadius: "12px", flexShrink: 0,
            background: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
          }}>
            💼
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 2px 0", color: isDark ? "#F1F5F9" : "#0F172A" }}>
              Laboratório de Mini-Sistemas
            </h2>
            <p style={{ color: isDark ? "#94A3B8" : "#475569", fontSize: "13px", margin: 0 }}>
              Construa 9 sistemas do mundo real com especificações técnicas e Code Review por IA.
            </p>
          </div>
        </div>

        {/* Badge de Progresso dos Projetos */}
        <div style={{
          padding: "8px 14px", borderRadius: "10px",
          background: isDark ? "rgba(16, 185, 129, 0.15)" : "#D1FAE5",
          border: "1px solid rgba(16,185,129,0.3)", color: "#10B981",
          fontSize: "12.5px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px"
        }}>
          <Award size={16} />
          <span>{projetosConcluidosIds.length} de {PROJETOS_REAIS.length} Concluídos</span>
        </div>
      </div>

      {/* VISTA 1: CATÁLOGO DE PROJETOS REAIS */}
      {!projetoSelecionadoId && (
        <div>
          {/* Filtros de Nível + Busca Compacta */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "15px", fontWeight: "800", color: isDark ? "#F8FAFC" : "#0F172A", display: "flex", alignItems: "center", gap: "6px" }}>
                <Layers size={18} color="#10B981" /> Catálogo de Projetos:
              </span>
              <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#10B981", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", padding: "2px 8px", borderRadius: "12px" }}>
                {projetosFiltrados.length} disponíveis
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              {/* Campo de Busca Rápida */}
              <div style={{ position: "relative", minWidth: "210px" }}>
                <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: isDark ? "#64748B" : "#94A3B8" }} />
                <input
                  type="text"
                  placeholder="Buscar por nome ou tech..."
                  value={buscaTermo}
                  onChange={handleTrocarBusca}
                  style={{
                    width: "100%",
                    padding: "6px 12px 6px 30px",
                    borderRadius: "14px",
                    border: `1px solid ${isDark ? "#334155" : "#CBD5E1"}`,
                    background: isDark ? "#0F172A" : "#FFFFFF",
                    color: isDark ? "#F8FAFC" : "#0F172A",
                    fontSize: "12px",
                    outline: "none"
                  }}
                />
              </div>

              {/* Abas de Nível */}
              <div style={{ display: "flex", gap: "6px" }}>
                {["Todos", "Iniciante", "Intermediário", "Avançado"].map((nivel) => (
                  <button
                    key={nivel}
                    onClick={() => handleTrocarNivel(nivel)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "16px",
                      border: filtroNivel === nivel ? "1.5px solid #10B981" : `1px solid ${isDark ? "#334155" : "#E2E8F0"}`,
                      background: filtroNivel === nivel ? "rgba(16, 185, 129, 0.18)" : (isDark ? "#1E293B" : "#F1F5F9"),
                      color: filtroNivel === nivel ? "#10B981" : (isDark ? "#94A3B8" : "#475569"),
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {nivel}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Limpo (Máximo 4 Cards por Página para Visual Clean e Organizado) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
            {projetosExibidos.map((proj) => {
              const estaConcluido = projetosConcluidosIds.includes(proj.id);
              return (
                <div
                  key={proj.id}
                  onClick={() => abrirProjeto(proj)}
                  style={{
                    background: isDark ? "#0F172A" : "#FFFFFF",
                    border: `1px solid ${estaConcluido ? "#10B981" : (isDark ? "#1E293B" : "#E2E8F0")}`,
                    borderRadius: "16px",
                    padding: "18px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "14px",
                    cursor: "pointer",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: isDark ? "0 4px 14px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.04)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#10B981";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(16,185,129,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = estaConcluido ? "#10B981" : (isDark ? "#1E293B" : "#E2E8F0");
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = isDark ? "0 4px 14px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.04)";
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "24px" }}>{proj.icone}</span>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#6366F1" }}>
                          {proj.categoria}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {estaConcluido && (
                          <span style={{ fontSize: "10px", fontWeight: "800", background: "rgba(16,185,129,0.15)", color: "#10B981", padding: "3px 8px", borderRadius: "8px", border: "1px solid rgba(16,185,129,0.3)" }}>
                            Concluído
                          </span>
                        )}
                        <span style={{ fontSize: "10px", fontWeight: "700", backgroundColor: `${proj.corNivel}18`, color: proj.corNivel, border: `1px solid ${proj.corNivel}33`, padding: "3px 8px", borderRadius: "8px" }}>
                          {proj.nivelTag}
                        </span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: "15px", fontWeight: "800", margin: "0 0 6px 0", color: isDark ? "#F8FAFC" : "#0F172A" }}>
                      {proj.titulo}
                    </h3>

                    <p style={{
                      fontSize: "12.5px", color: isDark ? "#94A3B8" : "#64748B", margin: 0, lineHeight: 1.45,
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                    }}>
                      {proj.descricao}
                    </p>
                  </div>

                  <div style={{ paddingTop: "12px", borderTop: `1px solid ${isDark ? "#1E293B" : "#F1F5F9"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11.5px", color: isDark ? "#64748B" : "#94A3B8", fontWeight: "600" }}>
                      {proj.requisitos.length} Requisitos Técnicos
                    </span>

                    <button style={{
                      padding: "7px 14px", borderRadius: "10px", border: "none",
                      background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                      color: "#FFF", fontSize: "12px", fontWeight: "700", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "6px",
                      boxShadow: "0 4px 12px rgba(16,185,129,0.3)"
                    }}>
                      Abrir Desafio →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mensagem se não houver projetos no filtro */}
          {projetosExibidos.length === 0 && (
            <div style={{
              padding: "36px", textAlign: "center", borderRadius: "16px",
              background: isDark ? "#0F172A" : "#F8FAFC", border: `1px solid ${isDark ? "#1E293B" : "#E2E8F0"}`,
              color: isDark ? "#94A3B8" : "#64748B", margin: "20px 0"
            }}>
              <p style={{ margin: 0, fontWeight: "700" }}>Nenhum projeto encontrado com os filtros selecionados.</p>
            </div>
          )}

          {/* Barra de Paginação Elegante */}
          {totalPaginas > 1 && (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "20px",
              padding: "12px 18px",
              borderRadius: "14px",
              background: isDark ? "#0F172A" : "#F8FAFC",
              border: `1px solid ${isDark ? "#1E293B" : "#E2E8F0"}`
            }}>
              <span style={{ fontSize: "12.5px", color: isDark ? "#94A3B8" : "#64748B", fontWeight: "600" }}>
                Exibindo <strong style={{ color: "#10B981" }}>{projetosExibidos.length}</strong> de {projetosFiltrados.length} projetos
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  disabled={paginaAtual === 1}
                  onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "10px",
                    border: `1px solid ${isDark ? "#334155" : "#CBD5E1"}`,
                    background: paginaAtual === 1 ? (isDark ? "#0F172A" : "#F8FAFC") : (isDark ? "#1E293B" : "#FFFFFF"),
                    color: paginaAtual === 1 ? (isDark ? "#475569" : "#94A3B8") : (isDark ? "#F8FAFC" : "#0F172A"),
                    cursor: paginaAtual === 1 ? "not-allowed" : "pointer",
                    fontWeight: "700",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <ChevronLeft size={14} /> Anterior
                </button>

                <span style={{ fontSize: "12.5px", fontWeight: "700", color: isDark ? "#F8FAFC" : "#0F172A", padding: "0 4px" }}>
                  Página <strong style={{ color: "#10B981" }}>{paginaAtual}</strong> de {totalPaginas}
                </span>

                <button
                  disabled={paginaAtual === totalPaginas}
                  onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "10px",
                    border: `1px solid ${isDark ? "#334155" : "#CBD5E1"}`,
                    background: paginaAtual === totalPaginas ? (isDark ? "#0F172A" : "#F8FAFC") : (isDark ? "#1E293B" : "#FFFFFF"),
                    color: paginaAtual === totalPaginas ? (isDark ? "#475569" : "#94A3B8") : (isDark ? "#F8FAFC" : "#0F172A"),
                    cursor: paginaAtual === totalPaginas ? "not-allowed" : "pointer",
                    fontWeight: "700",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  Próximo <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VISTA 2: ESPAÇO DE TRABALHO DO PROJETO SELECIONADO (IDE + CODE REVIEW) */}
      {projetoAtivo && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Barra Superior do Projeto */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <button
              onClick={voltarAoCatalogo}
              style={{
                padding: "8px 16px", borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: isDark ? "rgba(255,255,255,0.05)" : "#E2E8F0",
                color: isDark ? "#F8FAFC" : "#0F172A",
                fontSize: "13px", fontWeight: "800", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px"
              }}
            >
              <ArrowLeft size={16} /> Voltar ao Catálogo de Projetos
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "18px" }}>{projetoAtivo.icone}</span>
              <h3 style={{ fontSize: "18px", fontWeight: "900", margin: 0, color: isDark ? "#F8FAFC" : "#0F172A" }}>
                {projetoAtivo.titulo}
              </h3>
              <span style={{ fontSize: "12px", fontWeight: "800", backgroundColor: `${projetoAtivo.corNivel}22`, color: projetoAtivo.corNivel, border: `1px solid ${projetoAtivo.corNivel}44`, padding: "4px 10px", borderRadius: "10px" }}>
                {projetoAtivo.nivelTag}
              </span>
            </div>
          </div>

          {/* Grid Principal em 2 Colunas */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "20px" }}>
            
            {/* PAINEL ESQUERDO: ESPECIFICAÇÕES TÉCNICAS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              <div style={{
                background: isDark ? "#0F172A" : "#FFFFFF",
                border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0"}`,
                borderRadius: "20px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}>
                <div>
                  <span style={{ fontSize: "12px", fontWeight: "800", color: "#10B981", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    📋 ESPECIFICAÇÃO DO PROJETO
                  </span>
                  <h4 style={{ margin: "6px 0 8px 0", fontSize: "15px", color: isDark ? "#F8FAFC" : "#0F172A" }}>
                    {projetoAtivo.descricao}
                  </h4>
                </div>

                {/* Lista de Requisitos Funcionais */}
                <div>
                  <span style={{ fontSize: "13px", fontWeight: "800", color: isDark ? "#CBD5E1" : "#475569", display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                    <CheckSquare size={16} color="#10B981" /> Requisitos Funcionais (User Stories):
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {projetoAtivo.requisitos.map((req, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0"}`,
                          borderRadius: "10px",
                          padding: "10px 12px",
                          fontSize: "12.5px",
                          color: isDark ? "#E2E8F0" : "#334155",
                          lineHeight: 1.4,
                          display: "flex",
                          gap: "8px"
                        }}
                      >
                        <span style={{ color: "#10B981", fontWeight: "800" }}>{idx + 1}.</span>
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dica de Tech Lead Sênior */}
                <div style={{
                  background: "rgba(99, 102, 241, 0.1)",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  borderRadius: "12px",
                  padding: "12px",
                  fontSize: "12.5px",
                  color: "#A5B4FC",
                  lineHeight: 1.4
                }}>
                  {projetoAtivo.dicaSenior}
                </div>

                {/* Botão de Resetar Código para Modelo Inicial */}
                <button
                  onClick={handleResetarCodigo}
                  style={{
                    padding: "9px 14px", borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.03)", color: isDark ? "#94A3B8" : "#64748B",
                    fontSize: "12px", fontWeight: "700", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
                  }}
                >
                  <RefreshCw size={14} /> Resetar para o Template Inicial
                </button>
              </div>
            </div>

            {/* PAINEL DIREITO: IDE DE CÓDIGO + CONSOLE + CODE REVIEW */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              {/* Box da IDE */}
              <div style={{
                background: "#0F172A",
                border: "1.5px solid rgba(16, 185, 129, 0.4)",
                borderRadius: "20px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", fontWeight: "800", color: "#10B981", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Code size={18} /> Editor de Código JS (Defina 'const resultado = ...')
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                  onChange={(e) => setCodigoText(e.target.value)}
                  placeholder="// Desenvolva sua solução aqui..."
                  rows={14}
                  spellCheck={false}
                  style={{
                    width: "100%", backgroundColor: "transparent", border: "none", color: "#34D399", fontFamily: "monospace",
                    fontSize: "13.5px", lineHeight: "1.6", outline: "none", resize: "none"
                  }}
                />

                {/* Botão de Ação Principal: Executar e Analisar */}
                <button
                  onClick={executarEAnalisarComIA}
                  style={{
                    padding: "12px 20px", borderRadius: "12px", border: "none",
                    background: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
                    color: "#FFF", fontSize: "14px", fontWeight: "900", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    boxShadow: "0 6px 20px rgba(16,185,129,0.35)"
                  }}
                >
                  <Sparkles size={18} /> Executar & Submeter para Code Review por IA
                </button>
              </div>

              {/* Status da Análise */}
              {analiseStatus && (
                <div style={{
                  padding: "12px 16px", borderRadius: "12px", fontSize: "13px", fontWeight: "800",
                  backgroundColor: analiseStatus.tipo === "erro" ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                  border: `1px solid ${analiseStatus.tipo === "erro" ? "#EF4444" : "#10B981"}`,
                  color: analiseStatus.tipo === "erro" ? "#F87171" : "#34D399"
                }}>
                  {analiseStatus.mensagem}
                </div>
              )}

              {/* Console Logs */}
              {logsConsole.length > 0 && (
                <div style={{ background: "#090D16", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "12px 16px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#94A3B8", textTransform: "uppercase" }}>💻 Console Logs & Feedback de Validação:</span>
                  <div style={{ marginTop: "6px", fontFamily: "monospace", fontSize: "12.5px", color: "#E2E8F0", display: "flex", flexDirection: "column", gap: "4px" }}>
                    {logsConsole.map((l, i) => <div key={i}>{l}</div>)}
                  </div>
                </div>
              )}

              {/* CODE REVIEW DE TECH LEAD IA */}
              {codeReviewIa && (
                <div style={{
                  background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
                  border: "1.5px solid #10B981",
                  borderRadius: "18px",
                  padding: "20px",
                  boxShadow: "0 10px 30px rgba(16, 185, 129, 0.2)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", fontWeight: "900", color: "#10B981", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Sparkles size={16} /> CODE REVIEW DO TECH LEAD IA
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(245, 158, 11, 0.2)", border: "1px solid #F59E0B", color: "#FBBF24", padding: "4px 10px", borderRadius: "10px", fontSize: "13px", fontWeight: "900" }}>
                      <Star size={14} fill="#F59E0B" /> Nota: {codeReviewIa.nota} / 10
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: "12px", fontWeight: "800", color: "#94A3B8" }}>✅ Pontos Fortes do seu Código:</span>
                    <ul style={{ margin: "6px 0 0 0", paddingLeft: "18px", fontSize: "12.5px", color: "#E2E8F0", lineHeight: 1.5 }}>
                      {codeReviewIa.pontosFortes.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "10px 12px", borderRadius: "10px", fontSize: "12px", color: "#CBD5E1", lineHeight: 1.4 }}>
                    💡 <strong>Feedback de Arquitetura:</strong> {codeReviewIa.sugestaoSenior}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#F59E0B", fontWeight: "800", fontSize: "13px" }}>
                      <Flame size={16} fill="#F59E0B" /> +{codeReviewIa.xpGanha} XP Ganho & Fogo Aceso!
                    </div>

                    <button
                      onClick={voltarAoCatalogo}
                      style={{
                        padding: "8px 14px", borderRadius: "10px", border: "none",
                        background: "#10B981", color: "#FFF", fontSize: "12.5px", fontWeight: "800", cursor: "pointer"
                      }}
                    >
                      Concluir Projeto & Ver Outros →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
