import React, { useState, useEffect } from "react";
import styles from "./AulasSection.module.css";
import { 
  BookOpen, Code, Layers, Sparkles, CheckCircle2, Copy, Check, 
  Lightbulb, Shield, Database, Cpu, Terminal, ArrowRight, ChevronDown, ChevronUp, FileCode, Play, Tv, Award, Zap, ExternalLink, Flame, X, HelpCircle, AlertTriangle
} from "lucide-react";

export default function AulasSection({ user }) {
  const [moduloAtivo, setModuloAtivo] = useState("todos");
  const [copiadoIdx, setCopiadoIdx] = useState(null);
  const [codigoExpandido, setCodigoExpandido] = useState({});

  const toggleCodigoExpandido = (idx) => {
    setCodigoExpandido(prev => ({ ...prev, [idx]: prev[idx] === undefined ? false : !prev[idx] }));
  };

  // Estado para armazenar o progresso de videoaulas assistidas do aluno
  const [aulasAssistidas, setAulasAssistidas] = useState({});
  // Estado para o modal do player de vídeo
  const [videoModal, setVideoModal] = useState(null);
  // Estado para o Desafio de Atenção (Quiz para acender o fogo!)
  const [quizModal, setQuizModal] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const salvas = localStorage.getItem("devhub_aulas_video_assistidas");
      if (salvas) {
        try {
          setAulasAssistidas(JSON.parse(salvas));
        } catch (e) {}
      }
    }
  }, []);

  const BANCO_QUIZ_ATENCAO = {
    "v-html-1": {
      pergunta: "Qual tag HTML5 é a estrutura semântica correta para delimitar o conteúdo principal da página?",
      opcoes: ["<main>", "<div>", "<section>", "<span>"],
      correta: 0
    },
    "v-html-2": {
      pergunta: "Qual propriedade CSS Flexbox alinha os elementos ao longo do eixo principal?",
      opcoes: ["justify-content", "align-items", "flex-direction", "grid-template-columns"],
      correta: 0
    },
    "v-js-1": {
      pergunta: "Qual destes métodos funcionais do ES6 retorna um NOVO array com os itens transformados?",
      opcoes: [".map()", ".forEach()", ".push()", ".unshift()"],
      correta: 0
    },
    "v-js-2": {
      pergunta: "Qual palavra-chave é utilizada em funções assíncronas para aguardar a resolução de uma Promise?",
      opcoes: ["await", "defer", "pause", "resolve"],
      correta: 0
    },
    "v-git-1": {
      pergunta: "Qual comando do Git exibe o estado atual dos arquivos modificados no diretório?",
      opcoes: ["git status", "git commit", "git push", "git init"],
      correta: 0
    },
    "v-git-2": {
      pergunta: "Como mesclar alterações de uma branch secundária para a branch atual no Git?",
      opcoes: ["git merge <nome-da-branch>", "git checkout -b", "git clone", "git status"],
      correta: 0
    },
    "v-react-1": {
      pergunta: "Qual Hook do React é utilizado para armazenar estado reativo local em componentes funcionais?",
      opcoes: ["useState", "useEffect", "useMemo", "useCallback"],
      correta: 0
    },
    "v-react-2": {
      pergunta: "O que é Server-Side Rendering (SSR) no ecossistema Next.js?",
      opcoes: ["Renderização do HTML final no servidor a cada requisição", "Compilação no navegador do cliente", "Execução no banco de dados", "Um plugin do VS Code"],
      correta: 0
    }
  };

  const clicarConcluirAula = (aulaId, tituloAula) => {
    // Se já foi concluída, permite desmarcar diretamente
    if (aulasAssistidas[aulaId]) {
      toggleAulaAssistida(aulaId);
      return;
    }

    // Se ainda NÃO foi concluída, EXIGE O DESAFIO DE ATENÇÃO (Validação de Conhecimento Técnico)!
    const quizData = BANCO_QUIZ_ATENCAO[aulaId] || {
      pergunta: `O que é fundamental para validar a atenção na videoaula "${tituloAula}"?`,
      opcoes: [
        "Compreender a sintaxe prática e aplicar o conceito no código",
        "Apenas deixar o vídeo rodando no mudo sem assistir",
        "Fechar a página antes de entender o conceito",
        "Copiar código sem testar"
      ],
      correta: 0
    };

    setQuizModal({
      aulaId,
      tituloAula,
      quiz: quizData,
      opcaoSelecionada: null,
      erroMsg: null,
      sucesso: false
    });
  };

  const confirmarRespostaQuiz = (aulaId) => {
    if (!quizModal || quizModal.opcaoSelecionada === null) {
      setQuizModal(prev => ({ ...prev, erroMsg: "⚠️ Selecione uma opção para comprovar seu aprendizado!" }));
      return;
    }

    if (quizModal.opcaoSelecionada !== quizModal.quiz.correta) {
      setQuizModal(prev => ({
        ...prev,
        erroMsg: "❌ Resposta incorreta! Preste atenção na aula e tente novamente para acender sua chama de estudo."
      }));
      return;
    }

    // Resposta Correta! Marca a aula e alimenta a chama de estudo
    setQuizModal(prev => ({ ...prev, sucesso: true, erroMsg: null }));

    setTimeout(() => {
      toggleAulaAssistida(aulaId);
      setQuizModal(null);
    }, 1200);
  };

  const toggleAulaAssistida = async (aulaId) => {
    const proximo = { ...aulasAssistidas, [aulaId]: !aulasAssistidas[aulaId] };
    setAulasAssistidas(proximo);
    localStorage.setItem("devhub_aulas_video_assistidas", JSON.stringify(proximo));

    // Se concluiu a aula agora, recompensa com evento de estudo (+50 XP) e acende o fogo!
    if (proximo[aulaId]) {
      window.dispatchEvent(new CustomEvent("devhub_estudo_realizado"));
      window.dispatchEvent(new CustomEvent("devhub_aula_assistida"));

      // Registrar/Atualizar presença do aluno no backend
      if (user && (user.email || user.nome)) {
        try {
          const totalConcluidas = Object.values(proximo).filter(Boolean).length;
          const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
          await fetch(`${apiHost}/frequencia`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              nome: user.nome || "Estudante DevHub",
              email: user.email || "aluno@devhub.com",
              aulasAssistidas: totalConcluidas,
              totalAulas: 10,
              frequenciaPct: Math.min(100, Math.round((totalConcluidas / 10) * 100)),
              statusBadge: totalConcluidas >= 3 ? "⚡ Presença Regular" : "⏳ Iniciando Presença",
              statusColor: totalConcluidas >= 3 ? "#10B981" : "#F59E0B",
              ultimaPresenca: new Date().toLocaleDateString("pt-BR")
            })
          });
        } catch (err) {
          console.warn("Aviso ao sincronizar presença no backend:", err);
        }
      }
    }
  };

  const modulosEstudo = [
    {
      id: "html_css",
      titulo: "🌐 HTML5 Semântico & CSS3 Moderno (Flexbox, Grid & Layouts)",
      emoji: "🎨",
      nivel: "Iniciante",
      cor: "#F97316",
      bgBadge: "rgba(249, 115, 22, 0.15)",
      videoAulas: [
        {
          id: "v-html-1",
          titulo: "🎥 HTML5 Semântico: Estrutura Profissional & Acessibilidade",
          duracao: "18 min",
          embedUrl: "https://www.youtube.com/embed/epDCjksKMok",
          descricao: "Aprenda a estruturar páginas web com as tags <header>, <nav>, <main>, <article> e <footer>."
        },
        {
          id: "v-html-2",
          titulo: "🎨 CSS Flexbox & CSS Grid: Criando Layouts Responsivos do Zero",
          duracao: "24 min",
          embedUrl: "https://www.youtube.com/embed/E6CdIawP3mI",
          descricao: "Dominando alinhamentos unidimensionais com Flexbox e sistemas bidimensionais com CSS Grid."
        }
      ],
      explicacaoCompleta: `O HTML5 é o esqueleto estrutural da web moderna. Utilizar HTML semântico (<header>, <nav>, <main>, <article>, <section>, <footer>) é fundamental para acessibilidade, usabilidade e otimização em motores de busca (SEO). 
O CSS3 complementa a estrutura controlando o estilo, responsividade e layout visual através de Flexbox (alinhamento unidimensional de componentes) e CSS Grid (sistemas bidimensionais complexos).`,
      pontosChave: [
        "🧱 Tags Semânticas: Usar <main>, <article> e <nav> melhora o SEO do Google e a leitura por leitores de tela.",
        "🎨 Flexbox: Ideal para distribuir elementos em linha (flex-row) ou coluna (flex-col) com gap dinâmico.",
        "📐 CSS Grid: Perfeito para grids de cards responsivos utilizando repeat(auto-fit, minmax(280px, 1fr)).",
        "🌙 Variáveis CSS (:root): Permite definir temas claros/escuros dinamizando cores em toda a aplicação."
      ],
      codigoExemplo: `<!-- Exemplo Profissional: Card Responsivo com Flexbox & Variáveis CSS -->
<style>
  :root {
    --primary: #3b82f6;
    --bg-card: #1e293b;
    --text: #f8fafc;
  }

  .card-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: var(--bg-card);
    color: var(--text);
    padding: 20px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>

<div class="card-container">
  <div class="card-header">
    <h3>Módulo DevHub</h3>
    <span style="color: var(--primary);">Semântico</span>
  </div>
  <p>Conteúdo estruturado de forma limpa e responsiva.</p>
</div>`,
      dicaSenior: "💡 Dica de Tech Lead: Sempre utilize unidades relativas (rem/em) em vez de pixels fixos (px) para garantir que sua interface responda perfeitamente ao zoom e preferências do usuário."
    },
    {
      id: "javascript",
      titulo: "⚙️ JavaScript ES6+ — Lógica, Arrays, Promises & Async/Await",
      emoji: "🧠",
      nivel: "Iniciante / Intermediário",
      cor: "#EAB308",
      bgBadge: "rgba(234, 179, 8, 0.15)",
      videoAulas: [
        {
          id: "v-js-1",
          titulo: "⚡ JavaScript ES6+: Métodos de Array (.map, .filter, .reduce)",
          duracao: "20 min",
          embedUrl: "https://www.youtube.com/embed/qZtT0_mB278",
          descricao: "Aprenda a manipular coleções de dados de forma declarativa e imutável."
        },
        {
          id: "v-js-2",
          titulo: "🔗 Async/Await, Promises & Tratamento de Erros no JavaScript",
          duracao: "25 min",
          embedUrl: "https://www.youtube.com/embed/7V8bwLh12zU",
          descricao: "Entenda o Event Loop, requisições HTTP com fetch e tratamento com try/catch."
        }
      ],
      explicacaoCompleta: `JavaScript é a linguagem de programação oficial da Web. No ecossistema ES6+, utilizamos escopos de bloco (let/const), desestruturação (destructuring), módulos (import/export) e métodos funcionais de array (.map(), .filter(), .reduce()).
Para requisições assíncronas em APIs REST sem travar a interface, o JavaScript utiliza o Event Loop com Promises e a sintaxe assíncrona moderna Async/Await acoplada a blocos de tratamento try/catch.`,
      pontosChave: [
        "⚡ Imutabilidade & Metodos de Array: .map() transforma itens, .filter() seleciona sob condição e .reduce() acumula valores.",
        "📦 Destructuring & Spread: Extraia propriedades de objetos de forma limpa com const { id, nome } = usuario.",
        "🔗 Async / Await: Pausa a execução assíncrona até a Promise resolver sem bloquear a thread principal.",
        "🛡️ Tratamento de Erros: Todo bloco await deve estar envelopado em um bloco try/catch para capturar falhas de rede."
      ],
      codigoExemplo: `// Exemplo Profissional: Consumo Assíncrono com Tratamento de Exceções
const buscarEstudantesDevHub = async (urlApi) => {
  try {
    console.log("🔄 Conectando à API...");
    const resposta = await fetch(urlApi);
    
    if (!resposta.ok) {
      throw new Error(\`Falha na requisição HTTP! Status: \${resposta.status}\`);
    }

    const estudantes = await resposta.json();
    const aprovados = estudantes.filter(est => est.nota >= 7.0);

    return {
      sucesso: true,
      total: estudantes.length,
      aprovados: aprovados.map(e => e.nome)
    };
  } catch (erro) {
    console.error("❌ Erro ao buscar estudantes:", erro.message);
    return { sucesso: false, erro: erro.message };
  }
};`,
      dicaSenior: "⚡ Dica de Performance: Evite usar loops 'for' tradicionais quando métodos funcionais como .map() e .reduce() deixam o código infinitamente mais declarativo e imutável."
    },
    {
      id: "git",
      titulo: "🔀 Git & GitHub — Controle de Versão & Fluxo de Trabalho",
      emoji: "🐙",
      nivel: "Iniciante",
      cor: "#F43F5E",
      bgBadge: "rgba(244, 63, 94, 0.15)",
      videoAulas: [
        {
          id: "v-git-1",
          titulo: "🐙 Git & GitHub do Zero: Commits, Repositórios e Push",
          duracao: "19 min",
          embedUrl: "https://www.youtube.com/embed/6CydGHlBYyU",
          descricao: "Passo a passo completo para versionar seu código e publicar projetos no GitHub."
        },
        {
          id: "v-git-2",
          titulo: "🌿 Working with Branches, Pull Requests & Merging",
          duracao: "16 min",
          embedUrl: "https://www.youtube.com/embed/kB5e-gTAle8",
          descricao: "Aprenda a trabalhar em equipe usando branches paralelas e Pull Requests de Code Review."
        }
      ],
      explicacaoCompleta: `O Git é o sistema de controle de versão distribuído mais utilizado no mundo. Ele permite registrar o histórico completo de edições de um código através de commits, criar ramificações (branches) paralelas para trabalhar em novas funcionalidades sem quebrar a versão de produção e resolver conflitos de código em equipe.`,
      pontosChave: [
        "📁 Ciclo de Vida: Working Directory (código local) ➔ Staging Area (git add) ➔ Local Repository (git commit).",
        "🌿 Feature Branch Workflow: Crie branches dedicadas para cada funcionalidade (git checkout -b feature/login).",
        "🚀 Commits Semânticos: Mensagens padronizadas como feat:, fix:, refactor: mantêm o histórico profissional.",
        "🔀 Pull Requests & Code Review: Abra PRs no GitHub antes de mesclar alterações na branch principal (main/master)."
      ],
      codigoExemplo: `# Comandos Essenciais do Fluxo Profissional Git:

# 1. Criar uma nova branch para desenvolver uma funcionalidade
git checkout -b feature/modulo-aulas

# 2. Adicionar arquivos alterados à Staging Area
git add .

# 3. Criar commit semântico limpo
git commit -m "feat: adiciona componente AulasSection com suporte a markdown"

# 4. Enviar a branch para o repositório remoto no GitHub
git push origin feature/modulo-aulas

# 5. Atualizar sua branch local com a main mais recente
git checkout main
git pull origin main`,
      dicaSenior: "🛡️ Boas Práticas: Sempre adicione o arquivo .gitignore ao criar um projeto para nunca subir pastas pesadas como node_modules ou chaves privadas (.env) para o GitHub."
    },
    {
      id: "react",
      titulo: "⚛️ React.js & Next.js 15 — Componentes, Hooks & Estado",
      emoji: "⚛️",
      nivel: "Intermediário",
      cor: "#38BDF8",
      bgBadge: "rgba(56, 189, 248, 0.15)",
      videoAulas: [
        {
          id: "v-react-1",
          titulo: "⚛️ React.js Fundamentos: Componentes, Props e useState",
          duracao: "28 min",
          embedUrl: "https://www.youtube.com/embed/2G_mWfG0DZE",
          descricao: "Entenda a renderização reativa do React e gerenciamento de estado local."
        },
        {
          id: "v-react-2",
          titulo: "🚀 Next.js 15: Server Components, Pages Router e Performance",
          duracao: "22 min",
          embedUrl: "https://www.youtube.com/embed/Sklc_fQBmcs",
          descricao: "Aprenda a construir aplicações web ultrarrápidas com Next.js e SSR."
        }
      ],
      explicacaoCompleta: `O React é a biblioteca criada pelo Meta para construir interfaces declarativas baseadas em componentes reutilizáveis. O Next.js 15 expande o React adicionando roteamento baseado em arquivos, suporte nativo a React Server Components (RSC), otimização de imagens e Server-Side Rendering (SSR).`,
      pontosChave: [
        "🧩 Componentização: Divida telas complexas em pequenos componentes isolados e reutilizáveis.",
        "🔄 useState & useEffect: useState gerencia o estado reativo local e useEffect lida com efeitos colaterais.",
        "⚡ Props: Passe dados de componentes pai para componentes filho com tipagem clara.",
        "🚀 Next.js App / Pages Router: Sistema inteligente de rotas com geração estática e SSR."
      ],
      codigoExemplo: `// Exemplo Profissional: Componente React com Estado e Efeito Assíncrono
import { useState, useEffect } from "react";

export default function ContadorDevCoins({ usuarioId }) {
  const [coins, setCoins] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Busca os moedas do aluno ao carregar o componente
    async function carregarCoins() {
      setCarregando(true);
      const res = await fetch(\`/api/devcoins/\${usuarioId}\`);
      const dados = await res.json();
      setCoins(dados.totalCoins);
      setCarregando(false);
    }
    carregarCoins();
  }, [usuarioId]);

  return (
    <div className="card-coins">
      <h4>DevCoins do Aluno</h4>
      {carregando ? <p>Carregando saldo...</p> : <h3>🪙 {coins} Coins</h3>}
    </div>
  );
}`,
      dicaSenior: "👑 Dica de React: Mantenha seus componentes focados em uma única responsabilidade. Se um componente passar de 300 linhas, é hora de extrair subcomponentes!"
    },
    {
      id: "node",
      titulo: "🚀 Node.js & Express — Construção de APIs RESTful e Backend",
      emoji: "🟢",
      nivel: "Intermediário / Avançado",
      cor: "#10B981",
      bgBadge: "rgba(16, 185, 129, 0.15)",
      videoAulas: [
        {
          id: "v-node-1",
          titulo: "🟢 Node.js & Express: Criando sua Primeira API RESTful",
          duracao: "26 min",
          embedUrl: "https://www.youtube.com/embed/vYek4N56e4A",
          descricao: "Aprenda a criar rotas GET, POST, PUT e DELETE com Express e Node.js."
        },
        {
          id: "v-node-2",
          titulo: "🛡️ Middlewares de Autenticação e Arquitetura Limpa (MVC)",
          duracao: "20 min",
          embedUrl: "https://www.youtube.com/embed/LLqq6FeXucg",
          descricao: "Organizando controllers, rotas e middlewares de validação no servidor."
        }
      ],
      explicacaoCompleta: `Node.js é um ambiente de execução JavaScript no servidor construído sobre o motor V8 do Google Chrome. Ele utiliza uma arquitetura orientada a eventos não-bloqueante (Event Loop I/O), permitindo atender milhares de requisições simultâneas com alto rendimento. O Express é o framework HTTP padrão para construir rotas RESTful com middlewares.`,
      pontosChave: [
        "🌐 Verbos HTTP Semânticos: GET (buscar), POST (criar), PUT/PATCH (atualizar), DELETE (remover).",
        "🛡️ Middlewares de Requisição: Funções intermediárias que validam autenticação e sanitizam payloads JSON.",
        "📦 Estrutura MVC / Clean Architecture: Separação clara entre Rotas, Controllers, Services e Database.",
        "⚡ Respostas JSON & Status Codes: Retorne respostas com códigos semânticos (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 500 Error)."
      ],
      codigoExemplo: `// Exemplo Profissional: Rota Express com Middleware de Validação
const express = require("express");
const router = express.Router();

// Middleware para verificar se o token de acesso é válido
const autenticarToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ erro: "Acesso negado. Token não fornecido." });
  next();
};

// Rota POST protegida para criar novo projeto
router.post("/projetos", autenticarToken, async (req, res) => {
  const { titulo, descricao } = req.body;
  if (!titulo) {
    return res.status(400).json({ erro: "O título do projeto é obrigatório." });
  }

  const novoProjeto = { id: Date.now(), titulo, descricao, criadoEm: new Date() };
  return res.status(201).json({ sucesso: true, projeto: novoProjeto });
});

module.exports = router;`,
      dicaSenior: "⚡ Dica de Backend: Sempre trate exceções não capturadas no Express com um middleware global de erro (err, req, res, next) para impedir que o servidor caia acidentalmente."
    },
    {
      id: "database",
      titulo: "🗄️ MySQL & Bancos Relacionais — Modelagem SQL, JOINs e Índices",
      emoji: "🗄️",
      nivel: "Intermediário",
      cor: "#3B82F6",
      bgBadge: "rgba(59, 130, 246, 0.15)",
      videoAulas: [
        {
          id: "v-db-1",
          titulo: "🗄️ MySQL & SQL do Zero: Tabelas, Chaves e Inserções",
          duracao: "25 min",
          embedUrl: "https://www.youtube.com/embed/Cz3WcZLRaWc",
          descricao: "Aprenda a modelar dados em tabelas relacionais com chaves primárias e estrangeiras."
        },
        {
          id: "v-db-2",
          titulo: "📊 Consultas Avançadas: INNER JOIN, LEFT JOIN e GROUP BY",
          duracao: "22 min",
          embedUrl: "https://www.youtube.com/embed/Ofktsne-utM",
          descricao: "Construindo relatórios analíticos unindo múltiplas tabelas relacionais."
        }
      ],
      explicacaoCompleta: `Bancos de dados relacionais (SQL) organizam informações em tabelas estruturadas com colunas e linhas. A integridade dos dados é garantida através de relacionamentos de chaves estrangeiras (FOREIGN KEY) e transações ACID. Consultas avançadas utilizam JOINs para unir dados entre tabelas e índices para acelerar a busca em milhões de registros.`,
      pontosChave: [
        "🔑 Chaves Primárias & Estrangeiras: PRIMARY KEY identifica linhas únicas; FOREIGN KEY vincula tabelas.",
        "🔗 Consultas com JOIN: INNER JOIN busca correspondências exatas; LEFT JOIN traz todos os dados da tabela esquerda.",
        "📊 Agregação SQL: COUNT(), SUM(), AVG(), GROUP BY e HAVING para relatórios analíticos.",
        "🛡️ Anti-SQL Injection: Utilize sempre Prepared Statements (queries parametrizadas com ? no mysql2)."
      ],
      codigoExemplo: `-- Script SQL Completo de Modelagem Relacional
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notas_provas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  prova_titulo VARCHAR(150) NOT NULL,
  nota DECIMAL(4,2) NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Consulta Analítica com INNER JOIN
SELECT 
  u.nome, 
  u.email, 
  COUNT(n.id) as total_provas, 
  AVG(n.nota) as media_aluno
FROM usuarios u
INNER JOIN notas_provas n ON u.id = n.usuario_id
GROUP BY u.id
HAVING media_aluno >= 7.0;`,
      dicaSenior: "🗄️ Dica de Banco de Dados: Crie índices (CREATE INDEX) nas colunas usadas com frequência em cláusulas WHERE e JOIN para transformar buscas lentas de segundos em milissegundos."
    },
    {
      id: "jwt",
      titulo: "🔒 Autenticação JWT, Criptografia Bcrypt & Segurança Web",
      emoji: "🔒",
      nivel: "Avançado",
      cor: "#A855F7",
      bgBadge: "rgba(168, 85, 247, 0.15)",
      videoAulas: [
        {
          id: "v-jwt-1",
          titulo: "🔒 Hashing de Senhas com Bcrypt e Geração de JWT Token",
          duracao: "27 min",
          embedUrl: "https://www.youtube.com/embed/mbsmsi7l3r4",
          descricao: "Aprenda a proteger senhas de usuários e emitir tokens JWT seguros com expiração."
        },
        {
          id: "v-jwt-2",
          titulo: "🛡️ Protegendo APIs Web: CORS, HTTPS e Token Security",
          duracao: "18 min",
          embedUrl: "https://www.youtube.com/embed/PAY5eIe69e0",
          descricao: "Boas práticas de segurança da informação para impedir ataques em produção."
        }
      ],
      explicacaoCompleta: `Segurança da informação é o pilar de qualquer software de produção. A autenticação baseada em JWT (JSON Web Tokens) permite que o cliente envie um token assinado digitalmente pelo servidor contendo os dados do usuário. As senhas dos usuários nunca devem ser armazenadas em texto puro; utiliza-se o algoritmo Bcrypt com salt para gerar hashes unidirecionais seguros.`,
      pontosChave: [
        "🔒 Hashing com Bcrypt: O salt adiciona aleatoriedade tornando a senha imune a ataques de Rainbow Table.",
        "🔑 Estrutura do JWT: Header (algoritmo), Payload (dados do usuário/cargo) e Signature (chave secreta do servidor).",
        "🛡️ Expiração do Token: Configure tokens com prazo de expiração (ex: 8h ou 1d) para revogação de sessões antigas.",
        "🌐 CORS & SSL: Habilite HTTPS e configure políticas de CORS para impedir requisições maliciosas de domínios externos."
      ],
      codigoExemplo: `// Exemplo Profissional: Hashing de Senha e Geração de JWT Token
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. Criptografar senha no cadastro de usuário
async function cadastrarUsuario(senhaPura) {
  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(senhaPura, salt);
  return senhaHash;
}

// 2. Verificar senha no login e emitir JWT Token
async function autenticarEGerarToken(senhaDigitada, senhaHashBanco, usuarioObj) {
  const senhaValida = await bcrypt.compare(senhaDigitada, senhaHashBanco);
  if (!senhaValida) throw new Error("Credenciais inválidas!");

  const token = jwt.sign(
    { id: usuarioObj.id, email: usuarioObj.email, cargo: usuarioObj.cargo },
    process.env.JWT_SECRET || "DEVHUB_SECRET_KEY",
    { expiresIn: "8h" }
  );

  return { token, usuario: usuarioObj.email };
}`,
      dicaSenior: "🛡️ Dica de Segurança: Nunca armazene informações confidenciais (como senhas, cartões de crédito ou chaves privadas) dentro do Payload do JWT, pois o Payload pode ser lido por qualquer pessoa decodificando a string Base64!"
    }
  ];

  const modulosFiltrados = moduloAtivo === "todos" 
    ? modulosEstudo 
    : modulosEstudo.filter(m => m.id === moduloAtivo);

  const handleCopiarCodigo = (texto, index) => {
    navigator.clipboard.writeText(texto);
    setCopiadoIdx(index);
    setTimeout(() => setCopiadoIdx(null), 2000);
  };

  const totalConcluidasTotal = Object.values(aulasAssistidas).filter(Boolean).length;

  return (
    <div className={styles.container}>
      {/* Banner Principal de Boas-vindas */}
      <div className={styles.headerBanner}>
        <h2 className={styles.mainTitle}>
          <BookOpen size={28} color="#3B82F6" /> Guia de Estudo & Videoaulas Práticas Full Stack
        </h2>
        <p className={styles.subtitle}>
          Explore os conceitos fundamentais, assista a videoaulas dedicadas, consulte resumos de engenharia e copie códigos prontos para praticar no DevHub.
        </p>

        <div className={styles.headerPills}>
          <span className={styles.pillStat}>
            <Layers size={14} color="#38BDF8" /> 7 Módulos de Engenharia
          </span>
          <span className={styles.pillStat}>
            <Tv size={14} color="#10B981" /> 14 Videoaulas Práticas HD
          </span>
          <span className={styles.pillStat}>
            <Code size={14} color="#EAB308" /> Exemplos de Código Copiáveis
          </span>
          <span className={styles.pillStat} style={{ borderColor: "#10B981", color: "#10B981", background: "rgba(16, 185, 129, 0.1)" }}>
            <CheckCircle2 size={14} color="#10B981" /> {totalConcluidasTotal} / 14 Aulas Concluídas (+{totalConcluidasTotal * 50} XP)
          </span>
        </div>
      </div>

      {/* Barra de Filtro de Módulos (Separados por Assunto) */}
      <div className={styles.moduleTabs}>
        <button
          className={`${styles.tabBtn} ${moduloAtivo === "todos" ? styles.activeTab : ""}`}
          onClick={() => setModuloAtivo("todos")}
        >
          <Layers size={16} /> Todos os Módulos ({modulosEstudo.length})
        </button>
        {modulosEstudo.map((mod) => (
          <button
            key={mod.id}
            className={`${styles.tabBtn} ${moduloAtivo === mod.id ? styles.activeTab : ""}`}
            onClick={() => setModuloAtivo(mod.id)}
          >
            <span>{mod.emoji}</span> {mod.titulo.split("—")[0].trim()}
          </button>
        ))}
      </div>

      {/* Lista dos Cards de Tópicos Detalhados */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
        {modulosFiltrados.map((mod, idx) => {
          const totalVideoAulas = mod.videoAulas?.length || 0;
          const assistidasNoModulo = mod.videoAulas?.filter(v => aulasAssistidas[v.id])?.length || 0;

          return (
            <div key={mod.id} id={`topico-slide-${idx}`} className={styles.topicCard}>
              {/* Header do Módulo */}
              <div className={styles.topicHeader}>
                <div className={styles.topicTitleGroup}>
                  <div className={styles.iconCircle} style={{ background: mod.bgBadge, borderColor: `${mod.cor}55` }}>
                    {mod.emoji}
                  </div>
                  <div>
                    <h3 className={styles.topicTitle}>{mod.titulo}</h3>
                    <div style={{ display: 'flex', gap: 10, marginTop: 6, alignItems: 'center' }}>
                      <span className={styles.nivelBadge} style={{ background: mod.bgBadge, color: mod.cor }}>
                        Nível: {mod.nivel}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '700' }}>
                        🎥 {assistidasNoModulo} / {totalVideoAulas} aulas concluídas
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid de Videoaulas Práticas do Módulo */}
              {mod.videoAulas && mod.videoAulas.length > 0 && (
                <div>
                  <div className={styles.videoSectionHeader}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "#F8FAFC" }}>
                      <Tv size={18} color={mod.cor} /> Videoaulas Práticas ({mod.videoAulas.length})
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
                      Ganhe +50 XP a cada aula assistida!
                    </span>
                  </div>

                  <div className={styles.videosGrid}>
                    {mod.videoAulas.map((video) => {
                      const foiConcluida = !!aulasAssistidas[video.id];

                      return (
                        <div key={video.id} className={styles.videoCard}>
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                              <span style={{ fontSize: "0.75rem", fontWeight: "800", color: mod.cor, backgroundColor: mod.bgBadge, padding: "2px 8px", borderRadius: "6px" }}>
                                ⏱️ {video.duracao}
                              </span>
                              {foiConcluida && (
                                <span style={{ fontSize: "0.75rem", fontWeight: "900", color: "#10B981" }}>
                                  ✅ Assistida (+50 XP)
                                </span>
                              )}
                            </div>
                            <h4 className={styles.videoTitle}>{video.titulo}</h4>
                            <p className={styles.videoDesc}>{video.descricao}</p>
                          </div>

                          <div className={styles.videoFooter}>
                            <button
                              className={styles.btnWatch}
                              onClick={() => setVideoModal(video)}
                            >
                              <Play size={14} fill="#FFF" /> Assistir Aula
                            </button>

                            <button
                              className={foiConcluida ? styles.btnCheckDone : styles.btnCheckPending}
                              onClick={() => clicarConcluirAula(video.id, video.titulo)}
                            >
                              <CheckCircle2 size={15} color={foiConcluida ? "#10B981" : "#94A3B8"} />
                              {foiConcluida ? "Concluída" : "Marcar Aula"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Explicação Conceitual Profunda */}
              <div className={styles.explanationSection} style={{ borderLeftColor: mod.cor }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, color: mod.cor, marginBottom: 8, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  <Sparkles size={16} color={mod.cor} />
                  <span>Explicação do Conceito</span>
                </div>
                <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{mod.explicacaoCompleta}</p>
              </div>

              {/* Grid de Pontos-Chave & Regras de Engenharia */}
              <div>
                <h5 style={{ margin: '4px 0 12px 0', color: '#F8FAFC', fontSize: '0.94rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🔑</span> Pontos-Chave & Regras de Engenharia:
                </h5>
                <div className={styles.keyPointsGrid}>
                  {mod.pontosChave.map((ponto, pIdx) => {
                    const partes = ponto.split(":");
                    const temTitulo = partes.length > 1;
                    const tituloPonto = temTitulo ? partes[0].trim() : "";
                    const descPonto = temTitulo ? partes.slice(1).join(":").trim() : ponto;

                    return (
                      <div key={pIdx} className={styles.keyPointItem}>
                        <div className={styles.keyPointHeader}>
                          <CheckCircle2 size={16} color={mod.cor} style={{ flexShrink: 0 }} />
                          <span>{tituloPonto || descPonto}</span>
                        </div>
                        {temTitulo && (
                          <div className={styles.keyPointDesc}>
                            {descPonto}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bloco de Exemplo de Código Profissional */}
              <div>
                <div className={styles.codeBlockHeader}>
                  <div className={styles.codeHeaderTitle}>
                    <div className={styles.macDots}>
                      <span className={styles.macDot} style={{ background: '#ef4444' }} />
                      <span className={styles.macDot} style={{ background: '#f59e0b' }} />
                      <span className={styles.macDot} style={{ background: '#10b981' }} />
                    </div>
                    <span style={{ marginLeft: 6, display: 'flex', alignItems: 'center', gap: 6, color: '#f8fafc' }}>
                      <FileCode size={15} color="#38bdf8" />
                      Exemplo de Código Prático
                    </span>
                  </div>

                  <div className={styles.codeHeaderActions}>
                    <button className={styles.toggleBtn} onClick={() => toggleCodigoExpandido(idx)}>
                      {codigoExpandido[idx] === true ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      <span>{codigoExpandido[idx] === true ? "Recolher" : "Expandir"}</span>
                    </button>
                    <button className={styles.btnCopy} onClick={() => handleCopiarCodigo(mod.codigoExemplo, idx)}>
                      {copiadoIdx === idx ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                      <span>{copiadoIdx === idx ? "Copiado!" : "Copiar"}</span>
                    </button>
                  </div>
                </div>

                {codigoExpandido[idx] !== true && (
                  <pre className={styles.codeTextarea}>
                    <code>{mod.codigoExemplo}</code>
                  </pre>
                )}
              </div>

              {/* Caixa de Dica de Tech Lead IA */}
              <div className={styles.tipBox}>
                <Lightbulb size={22} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ color: '#fbbf24', display: 'block', marginBottom: 2, fontWeight: "900" }}>Dica de Tech Lead:</strong>
                  {mod.dicaSenior.replace("💡 Dica de Tech Lead: ", "").replace("⚡ Dica de Performance: ", "")}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal do Player de Videoaula */}
      {videoModal && (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setVideoModal(null); }}>
          <div className={styles.modalPlayerContent}>
            <div className={styles.modalPlayerHeader}>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: "900", color: "#FFF", margin: 0 }}>
                  {videoModal.titulo}
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
                  ⏱️ Duração: {videoModal.duracao}
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                  onClick={() => {
                    const rawId = (videoModal.embedUrl || "").split("/embed/")[1] || "";
                    const videoId = rawId.split("?")[0];
                    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
                  }}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(239, 68, 68, 0.2)",
                    color: "#EF4444",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    fontWeight: "800",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <ExternalLink size={14} /> 📺 Abrir no YouTube
                </button>
                <button
                  onClick={() => setVideoModal(null)}
                  style={{ border: "none", backgroundColor: "transparent", color: "#94A3B8", fontSize: "1.2rem", cursor: "pointer", fontWeight: "900" }}
                >✕</button>
              </div>
            </div>

            <iframe
              className={styles.playerIframe}
              src={`${(videoModal.embedUrl || "").replace("youtube-nocookie.com", "www.youtube.com").split("?")[0]}?rel=0&modestbranding=1`}
              title={videoModal.titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />

            <div style={{ padding: "12px 20px", backgroundColor: "#0F172A", borderTop: "1px solid rgba(255, 255, 255, 0.08)", fontSize: "12px", color: "#94A3B8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>💡 Se o YouTube bloquear a exibição embutida no seu navegador, clique em <strong style={{ color: "#EF4444" }}>📺 Abrir no YouTube</strong> para assistir normalmente.</span>
              <button
                onClick={() => {
                  const vm = videoModal;
                  setVideoModal(null);
                  clicarConcluirAula(vm.id, vm.titulo);
                }}
                style={{ backgroundColor: "#10B981", color: "#FFF", border: "none", padding: "6px 14px", borderRadius: "8px", fontWeight: "800", cursor: "pointer" }}
              >
                ⚡ Responder Desafio de Atenção (+140 XP)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal do Desafio de Atenção para Acender a Chama de Estudo */}
      {quizModal && (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setQuizModal(null); }}>
          <div style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            border: "1.5px solid #F59E0B",
            borderRadius: "20px",
            padding: "28px",
            maxWidth: "520px",
            width: "90%",
            boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(245, 158, 11, 0.25)",
            color: "#FFF"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Flame style={{ color: "#F59E0B", width: 26, height: 26 }} />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 900, color: "#F59E0B" }}>
                  Desafio de Atenção — Acender o Fogo 🔥
                </h3>
              </div>
              <button onClick={() => setQuizModal(null)} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>

            <p style={{ fontSize: "0.88rem", color: "#CBD5E1", margin: "0 0 16px 0", lineHeight: 1.5 }}>
              Para comprovar sua atenção e <strong>abastecer o Combustível da sua Chama (+30% 🔥)</strong>, responda à pergunta sobre a videoaula:
            </p>

            <div style={{ background: "rgba(30, 41, 59, 0.6)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "16px" }}>
              <strong style={{ fontSize: "0.95rem", color: "#FFF", display: "block", marginBottom: "12px" }}>
                ❓ {quizModal.quiz.pergunta}
              </strong>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {quizModal.quiz.opcoes.map((opcao, idx) => (
                  <label
                    key={idx}
                    onClick={() => setQuizModal(prev => ({ ...prev, opcaoSelecionada: idx, erroMsg: null }))}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: quizModal.opcaoSelecionada === idx ? "2px solid #F59E0B" : "1px solid rgba(255,255,255,0.1)",
                      backgroundColor: quizModal.opcaoSelecionada === idx ? "rgba(245, 158, 11, 0.15)" : "rgba(15, 23, 42, 0.4)",
                      color: quizModal.opcaoSelecionada === idx ? "#F59E0B" : "#CBD5E1",
                      cursor: "pointer",
                      fontWeight: quizModal.opcaoSelecionada === idx ? "800" : "500",
                      fontSize: "0.88rem"
                    }}
                  >
                    <input
                      type="radio"
                      name="quiz_opcao"
                      checked={quizModal.opcaoSelecionada === idx}
                      onChange={() => {}}
                      style={{ accentColor: "#F59E0B" }}
                    />
                    <span>{opcao}</span>
                  </label>
                ))}
              </div>
            </div>

            {quizModal.erroMsg && (
              <div style={{ color: "#EF4444", fontSize: "0.85rem", fontWeight: 700, marginBottom: "14px" }}>
                {quizModal.erroMsg}
              </div>
            )}

            {quizModal.sucesso && (
              <div style={{ color: "#10B981", fontSize: "0.95rem", fontWeight: 900, marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                ⚡ RESPOSTA CORRETA! Fogo Alimentado (+30% Combustível 🔥) +140 XP!
              </div>
            )}

            <button
              onClick={() => confirmarRespostaQuiz(quizModal.aulaId)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                color: "#FFF",
                fontWeight: 900,
                fontSize: "0.95rem",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(245, 158, 11, 0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Flame size={18} /> Confirmar Resposta & Alimentar Chama 🔥
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
