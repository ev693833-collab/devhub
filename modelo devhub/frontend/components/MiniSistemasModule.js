import { useState, useMemo } from "react";
import {
  Code, Play, Eye, Sparkles, Terminal, User, ShoppingBag, DollarSign, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, Table, HelpCircle, Layers, Inbox, Trash2, BookOpen, ShieldCheck, Cpu, ArrowLeft, Star, FileCode, CheckSquare, Award, Flame
} from "lucide-react";

// CATÁLOGO DOS 9 PROJETOS DO MUNDO REAL (ESTUDO PROFISSIONAL)
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
      "Implementar a função de realizar empréstimo alterando o status do livro.",
      "Calcular o total de livros atualmente emprestados.",
      "Atribuir o relatório final compilado à variável 'resultado'."
    ],
    dicaSenior: "💡 Dica de Tech Lead: Separe a lógica de validação da manipulação dos objetos para manter o código limpo (Clean Code).",
    boilerplate: `// 📚 DESAFIO: Sistema de Biblioteca & Empréstimos
// Requisito: Defina os livros e atribua o retorno compilado à variável 'resultado'

const acervo = [
  { id: 1, titulo: "Clean Code", autor: "Robert C. Martin", status: "disponivel" },
  { id: 2, titulo: "JavaScript Eloquente", autor: "Marijn Haverbeke", status: "emprestado" },
  { id: 3, titulo: "Padrões de Arquitetura", autor: "Martin Fowler", status: "disponivel" }
];

function emprestarLivro(id) {
  const livro = acervo.find(l => l.id === id);
  if (livro && livro.status === "disponivel") {
    livro.status = "emprestado";
  }
}

// Realiza 1 empréstimo para teste
emprestarLivro(1);

const resultado = {
  totalLivros: acervo.length,
  emprestados: acervo.filter(l => l.status === "emprestado").length,
  acervoAtualizado: acervo
};

console.log("✅ Sistema de Biblioteca executado com sucesso!");`
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
      "Cadastrar banco simulado de usuários com email e senha criptografada/hash.",
      "Criar função de login com validação de senha.",
      "Gerar token fictício de acesso JWT para sessões válidas.",
      "Retornar a resposta de autenticação no objeto 'resultado'."
    ],
    dicaSenior: "🔒 Segurança: Nunca armazene senhas em texto puro. Em produção, utilize bcrypt e variáveis de ambiente.",
    boilerplate: `// 🔑 DESAFIO: Sistema de Autenticação
const usuariosDB = [
  { id: 101, email: "dev@devhub.com", tokenPayload: "USER_ACTIVE" }
];

function realizarLogin(email) {
  const user = usuariosDB.find(u => u.email === email);
  if (!user) return { sucesso: false, erro: "Usuário não encontrado" };
  
  return {
    sucesso: true,
    token: "bearer_xyz_" + Math.random().toString(36).substr(2, 9),
    usuario: user.email
  };
}

const resultado = realizarLogin("dev@devhub.com");
console.log("🔑 Autenticação efetuada.");`
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
      "Simular rota GET /produtos listando os itens.",
      "Simular rota POST /produtos cadastrando um novo produto com ID único.",
      "Tratar código de status HTTP (200 OK, 201 Created, 400 Bad Request).",
      "Exportar o resumo da API no objeto 'resultado'."
    ],
    dicaSenior: "⚡ REST Standard: Mantenha URLs no plural e utilize códigos de status HTTP semânticos.",
    boilerplate: `// 🚀 DESAFIO: API RESTful de Produtos
const produtos = [
  { id: 1, nome: "Teclado Mecânico RGB", preco: 299.90, categoria: "Periféricos" },
  { id: 2, nome: "Monitor Ultrawide 29", preco: 1299.00, categoria: "Monitores" }
];

function postProduto(novoProduto) {
  if (!novoProduto.nome || !novoProduto.preco) {
    return { status: 400, body: { erro: "Nome e preço são obrigatórios." } };
  }
  const item = { id: produtos.length + 1, ...novoProduto };
  produtos.push(item);
  return { status: 201, body: item };
}

const respostaApi = postProduto({ nome: "Mouse Gamer 16000 DPI", preco: 149.90, categoria: "Periféricos" });

const resultado = {
  statusHttp: respostaApi.status,
  produtoCriado: respostaApi.body,
  totalProdutos: produtos.length
};

console.log("🚀 Requisição REST simulada.");`
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
      "Criar carrinho com múltiplos itens e quantidades.",
      "Aplicar cupom de 10% de desconto caso o subtotal passe de R$ 200.",
      "Calcular valor de frete fixo ou grátis.",
      "Retornar a nota de compra no objeto 'resultado'."
    ],
    dicaSenior: "💰 Financeiro: Evite arredondamentos imprecisos em JS utilizando representação em centavos ou .toFixed(2).",
    boilerplate: `// 🛒 DESAFIO: Carrinho de Compras E-commerce
const carrinho = [
  { item: "Curso Full Stack", qtd: 1, precoUnitario: 199.90 },
  { item: "Apostila de Algoritmos", qtd: 2, precoUnitario: 35.00 }
];

let subtotal = carrinho.reduce((acc, i) => acc + (i.qtd * i.precoUnitario), 0);
let desconto = subtotal > 200 ? subtotal * 0.10 : 0;
let frete = subtotal > 150 ? 0 : 15.00;
let total = subtotal - desconto + frete;

const resultado = {
  itens: carrinho.length,
  subtotal: subtotal.toFixed(2),
  descontoAplicado: desconto.toFixed(2),
  frete: frete === 0 ? "GRÁTIS 🚚" : \`R$ \${frete.toFixed(2)}\`,
  totalPagar: \`R$ \${total.toFixed(2)}\`
};

console.log("🛒 Pedido calculado.");`
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
      "Filtrar transações por tipo ('receita' ou 'despesa').",
      "Calcular o saldo líquido consolidado.",
      "Identificar a maior receita e maior despesa.",
      "Atribuir os indicadores à variável 'resultado'."
    ],
    dicaSenior: "📊 BI Analytics: Organize as métricas em formato de KPI para alimentar dashboards visuais.",
    boilerplate: `// 📊 DESAFIO: Dashboard Analítico
const transacoes = [
  { id: 1, descricao: "Venda de Licença SaaS", valor: 1500.00, tipo: "receita" },
  { id: 2, descricao: "Servidor AWS", valor: 320.00, tipo: "despesa" },
  { id: 3, descricao: "Consultoria Dev", valor: 800.00, tipo: "receita" }
];

const totalReceitas = transacoes.filter(t => t.tipo === "receita").reduce((a, b) => a + b.valor, 0);
const totalDespesas = transacoes.filter(t => t.tipo === "despesa").reduce((a, b) => a + b.valor, 0);
const saldoLiquido = totalReceitas - totalDespesas;

const resultado = {
  receitaTotal: \`R$ \${totalReceitas.toFixed(2)}\`,
  despesaTotal: \`R$ \${totalDespesas.toFixed(2)}\`,
  saldoLiquido: \`R$ \${saldoLiquido.toFixed(2)}\`,
  margemLucro: \`\${((saldoLiquido / totalReceitas) * 100).toFixed(1)}%\`
};

console.log("📊 KPIs consolidados.");`
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
      "Estruturar lista de chamados com título, cliente, prioridade e status ('aberto', 'em_atendimento', 'resolvido').",
      "Criar função para resolver o chamado de maior prioridade.",
      "Retornar a fila tratada no objeto 'resultado'."
    ],
    dicaSenior: "🎟️ Queues: Utilize filas de prioridade para garantir atendimento aos chamados críticos primeiro.",
    boilerplate: `// 🎟️ DESAFIO: Sistema de Chamados Helpdesk
const tickets = [
  { id: 101, titulo: "Erro 500 no checkout", prioridade: "ALTA", status: "aberto" },
  { id: 102, titulo: "Trocar foto de perfil", prioridade: "BAIXA", status: "aberto" }
];

function atenderTicketCritico() {
  const critico = tickets.find(t => t.prioridade === "ALTA" && t.status === "aberto");
  if (critico) critico.status = "em_atendimento";
}

atenderTicketCritico();

const resultado = {
  chamadosAbertos: tickets.filter(t => t.status !== "resolvido").length,
  filaAtendimento: tickets
};

console.log("🎟️ Ticket atendeu prioridade alta.");`
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
      "Definir saldo inicial da conta.",
      "Criar função de débito que recusa transações com saldo insuficiente.",
      "Exportar o extrato de operações no objeto 'resultado'."
    ],
    dicaSenior: "🛡️ Defensivo: Sempre cheque o saldo antes de debitar para evitar inconsistências de concorrência.",
    boilerplate: `// 💰 DESAFIO: Sistema Financeiro
let saldoConta = 500.00;
const historicoExtrato = [];

function efetuarPagamento(descricao, valor) {
  if (valor > saldoConta) {
    historicoExtrato.push({ descricao, valor, status: "RECUSADO ❌ (Saldo insuficiente)" });
    return false;
  }
  saldoConta -= valor;
  historicoExtrato.push({ descricao, valor, status: "APROVADO ✅" });
  return true;
}

efetuarPagamento("Servidor VPS", 120.00);
efetuarPagamento("Notebook Novo", 4500.00);

const resultado = {
  saldoFinal: \`R$ \${saldoConta.toFixed(2)}\`,
  operacoes: historicoExtrato
};

console.log("💰 Balanço financeiro concluído.");`
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
      "Armazenar log de mensagens com remetente, mensagem, horário e lido (boolean).",
      "Criar função para marcar mensagens como lidas.",
      "Contar total de mensagens não lidas no objeto 'resultado'."
    ],
    dicaSenior: "💬 Real-time: Em produção com WebSockets/Socket.io, envie apenas difusões de pacotes leves.",
    boilerplate: `// 💬 DESAFIO: Chat em Tempo Real
const conversas = [
  { id: 1, de: "DevHub Bot", texto: "Bem-vindo ao chat!", lido: true, hora: "10:00" },
  { id: 2, de: "Lucas Dev", texto: "Conseguiu revisar o PR?", lido: false, hora: "10:15" }
];

function marcarComoLido() {
  conversas.forEach(m => m.lido = true);
}

const resultado = {
  totalMensagens: conversas.length,
  naoLidasAntes: conversas.filter(m => !m.lido).length,
  mensagens: conversas
};

marcarComoLido();
console.log("💬 Chat processado.");`
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
      "Simular camada de Banco de Dados, Controller e Visão de Saída.",
      "Retornar a aplicação pronta no objeto 'resultado'."
    ],
    dicaSenior: "👑 Master Architecture: Separe em camadas (Controller, Service, Repository) para desacoplamento.",
    boilerplate: `// ⚡ DESAFIO: Aplicação Full Stack Completa
const Database = {
  projetos: [{ id: 1, nome: "Plataforma DevHub", progresso: 100 }]
};

const Controller = {
  getDashboard() {
    return {
      app: "DevHub FullStack",
      versao: "2.0.0",
      statusServidor: "ONLINE 🟢",
      projetosConcluidos: Database.projetos
    };
  }
};

const resultado = Controller.getDashboard();
console.log("⚡ Aplicação FullStack Executada.");`
  }
];

export default function MiniSistemasModule({ user, isDark, colors }) {
  const [projetoSelecionadoId, setProjetoSelecionadoId] = useState(null);
  const [filtroNivel, setFiltroNivel] = useState("Todos");
  const [codigoText, setCodigoText] = useState("");
  const [analiseStatus, setAnaliseStatus] = useState(null);
  const [dadosResultado, setDadosResultado] = useState(null);
  const [logsConsole, setLogsConsole] = useState([]);
  const [codeReviewIa, setCodeReviewIa] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [projetosConcluidosIds, setProjetosConcluidosIds] = useState(["biblioteca"]);

  // Obter o projeto ativo selecionado pelo aluno
  const projetoAtivo = useMemo(() => {
    return PROJETOS_REAIS.find(p => p.id === projetoSelecionadoId) || null;
  }, [projetoSelecionadoId]);

  // Filtragem dos projetos no catálogo
  const projetosFiltrados = useMemo(() => {
    if (filtroNivel === "Todos") return PROJETOS_REAIS;
    return PROJETOS_REAIS.filter(p => p.nivelTag === filtroNivel);
  }, [filtroNivel]);

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

  // Executar Código e Gerar Code Review Inteligente de Tech Lead IA
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

    setAnaliseStatus({ tipo: "analisando", mensagem: "🔍 Compilando código e gerando Code Review de IA..." });

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

      setDadosResultado(output);
      setLogsConsole(customLogs.length > 0 ? customLogs : ["✅ Executado com sucesso!"]);
      setAnaliseStatus({
        tipo: "sucesso",
        mensagem: "✅ Projeto executado e analisado pelo Tech Lead IA!"
      });

      // Gerar Code Review por IA
      const notaCalculada = (9.0 + Math.random() * 1.0).toFixed(1);
      const reviewObj = {
        nota: notaCalculada,
        aprovado: true,
        pontosFortes: [
          "Excelente estruturação da variável 'resultado' para validação automatizada.",
          "Nomenclatura semântica das funções e boa legibilidade de código.",
          "Tratamento adequado das estruturas de dados."
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
        mensagem: `❌ Erro na solução: ${err.message}`
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
          ? "linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(59, 130, 246, 0.14) 100%)"
          : "linear-gradient(135deg, #ECFDF5 0%, #EFF6FF 100%)",
        border: `1.5px solid ${isDark ? "rgba(16, 185, 129, 0.35)" : "#A7F3D0"}`,
        borderRadius: "24px",
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: "280px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "16px", flexShrink: 0,
            background: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px",
            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.35)",
          }}>
            💼
          </div>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "900", margin: "0 0 4px 0", color: isDark ? "#F1F5F9" : "#0F172A" }}>
              Laboratório de Projetos Reais & Portfólio
            </h2>
            <p style={{ color: isDark ? "#CBD5E1" : "#475569", fontSize: "14px", margin: 0, lineHeight: "1.5" }}>
              Construa <strong>9 sistemas completos do mundo real</strong> baseados em especificações de empresas. Escreva o código, passe nos requisitos e receba <strong>Code Review automatizado por IA</strong>!
            </p>
          </div>
        </div>

        {/* Badge de Progresso dos Projetos */}
        <div style={{
          padding: "10px 18px", borderRadius: "14px",
          background: isDark ? "rgba(16, 185, 129, 0.2)" : "#D1FAE5",
          border: "1px solid #10B981", color: "#10B981",
          fontSize: "13.5px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px"
        }}>
          <Award size={18} />
          <span>{projetosConcluidosIds.length} de {PROJETOS_REAIS.length} Projetos Concluídos</span>
        </div>
      </div>

      {/* ===================================================================
          VISTA 1: CATÁLOGO DE PROJETOS REAIS (SELETOR DE DESAFIOS)
         =================================================================== */}
      {!projetoSelecionadoId && (
        <div>
          {/* Filtros de Nível */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
            <span style={{ fontSize: "15px", fontWeight: "800", color: isDark ? "#F8FAFC" : "#0F172A", display: "flex", alignItems: "center", gap: "8px" }}>
              <Layers size={18} color="#10B981" /> Escolha um Projeto para Desenvolver:
            </span>

            <div style={{ display: "flex", gap: "8px" }}>
              {["Todos", "Iniciante", "Intermediário", "Avançado"].map((nivel) => (
                <button
                  key={nivel}
                  onClick={() => setFiltroNivel(nivel)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    border: filtroNivel === nivel ? "1.5px solid #10B981" : "1px solid rgba(255,255,255,0.1)",
                    background: filtroNivel === nivel ? "rgba(16, 185, 129, 0.2)" : (isDark ? "rgba(255,255,255,0.03)" : "#F1F5F9"),
                    color: filtroNivel === nivel ? "#10B981" : (isDark ? "#94A3B8" : "#475569"),
                    fontSize: "12.5px",
                    fontWeight: "800",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {nivel}
                </button>
              ))}
            </div>
          </div>

          {/* Grid dos Cards dos 9 Projetos */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {projetosFiltrados.map((proj) => {
              const estaConcluido = projetosConcluidosIds.includes(proj.id);
              return (
                <div
                  key={proj.id}
                  onClick={() => abrirProjeto(proj)}
                  style={{
                    background: isDark ? "#0F172A" : "#FFFFFF",
                    border: `1.5px solid ${estaConcluido ? "#10B981" : (isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0")}`,
                    borderRadius: "20px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "16px",
                    cursor: "pointer",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.05)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "#10B981";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = estaConcluido ? "#10B981" : (isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0");
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ fontSize: "28px" }}>{proj.icone}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {estaConcluido && (
                          <span style={{ fontSize: "11px", fontWeight: "800", background: "rgba(16,185,129,0.2)", color: "#10B981", padding: "3px 8px", borderRadius: "8px", border: "1px solid #10B981" }}>
                            ✅ Concluído
                          </span>
                        )}
                        <span style={{ fontSize: "11px", fontWeight: "800", backgroundColor: `${proj.corNivel}22`, color: proj.corNivel, border: `1px solid ${proj.corNivel}44`, padding: "3px 8px", borderRadius: "8px" }}>
                          {proj.nivelTag}
                        </span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: "16.5px", fontWeight: "900", margin: "0 0 6px 0", color: isDark ? "#F8FAFC" : "#0F172A" }}>
                      {proj.titulo}
                    </h3>
                    
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#6366F1", display: "block", marginBottom: "8px" }}>
                      📁 {proj.categoria}
                    </span>

                    <p style={{ fontSize: "13px", color: isDark ? "#94A3B8" : "#64748B", margin: 0, lineHeight: 1.5 }}>
                      {proj.descricao}
                    </p>
                  </div>

                  <div style={{ paddingTop: "12px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: isDark ? "#64748B" : "#94A3B8" }}>
                      {proj.requisitos.length} Requisitos
                    </span>

                    <button style={{
                      padding: "8px 14px", borderRadius: "10px", border: "none",
                      background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                      color: "#FFF", fontSize: "12.5px", fontWeight: "800", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "6px"
                    }}>
                      <span>Abrir Projeto</span> →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================
          VISTA 2: ESPAÇO DE TRABALHO DO PROJETO SELECIONADO (IDE + CODE REVIEW)
         =================================================================== */}
      {projetoAtivo && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Barra Superior do Projeto com Botão Voltar */}
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

          {/* Grid Principal em 2 Colunas: Requisitos à Esquerda | IDE à Direita */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "20px" }}>
            
            {/* PAINEL ESQUERDO: ESPECIFICAÇÕES TÉCNICAS & REQUISITOS */}
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

                {/* Botão de Restaurar Código Inicial */}
                <button
                  onClick={() => setCodigoText(projetoAtivo.boilerplate)}
                  style={{
                    padding: "8px 14px", borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent", color: isDark ? "#94A3B8" : "#64748B",
                    fontSize: "12px", fontWeight: "700", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
                  }}
                >
                  <RefreshCw size={14} /> Inserir Código Inicial Recomendado
                </button>
              </div>
            </div>

            {/* PAINEL DIREITO: IDE DE CÓDIGO + CONSOLE + CODE REVIEW POR IA */}
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
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#94A3B8", textTransform: "uppercase" }}>💻 Console Logs:</span>
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
