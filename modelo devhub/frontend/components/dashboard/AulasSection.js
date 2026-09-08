import React, { useState, useEffect } from "react";
import styles from "./AulasSection.module.css";
import { 
  BookOpen, Code, Layers, Sparkles, CheckCircle2, Copy, Check, 
  Lightbulb, Shield, Database, Cpu, Terminal, ArrowRight
} from "lucide-react";

export default function AulasSection({ user }) {
  const [moduloAtivo, setModuloAtivo] = useState("todos");
  const [copiadoIdx, setCopiadoIdx] = useState(null);

  // Estado para armazenar o progresso de videoaulas assistidas do aluno
  const [aulasAssistidas, setAulasAssistidas] = useState({});
  // Estado para o modal do player de vídeo
  const [videoModal, setVideoModal] = useState(null);

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

  const toggleAulaAssistida = async (aulaId) => {
    const proximo = { ...aulasAssistidas, [aulaId]: !aulasAssistidas[aulaId] };
    setAulasAssistidas(proximo);
    localStorage.setItem("devhub_aulas_video_assistidas", JSON.stringify(proximo));

    // Se concluiu a aula agora, recompensa com evento de estudo (+50 XP) e acende o fogo!
    if (proximo[aulaId]) {
      window.dispatchEvent(new CustomEvent("devhub_estudo_realizado"));

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
          embedUrl: "https://www.youtube.com/embed/QFAw0qL2aCg",
          descricao: "Aprenda a estruturar páginas web com as tags <header>, <nav>, <main>, <article> e <footer>."
        },
        {
          id: "v-html-2",
          titulo: "🎨 CSS Flexbox & CSS Grid: Criando Layouts Responsivos do Zero",
          duracao: "24 min",
          embedUrl: "https://www.youtube.com/embed/E6CdIawP3W4",
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
          embedUrl: "https://www.youtube.com/embed/HN1UjzRSLuo",
          descricao: "Aprenda a manipular coleções de dados de forma declarativa e imutável."
        },
        {
          id: "v-js-2",
          titulo: "🔗 Async/Await, Promises & Tratamento de Erros no JavaScript",
          duracao: "25 min",
          embedUrl: "https://www.youtube.com/embed/7v15pW-9gOQ",
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
          embedUrl: "https://www.youtube.com/embed/kB5e-gTAl_s",
          descricao: "Passo a passo completo para versionar seu código e publicar projetos no GitHub."
        },
        {
          id: "v-git-2",
          titulo: "🌿 Working with Branches, Pull Requests & Merging",
          duracao: "16 min",
          embedUrl: "https://www.youtube.com/embed/kB5e-gTAl_s",
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
          embedUrl: "https://www.youtube.com/embed/er_P0v_bJ2w",
          descricao: "Entenda a renderização reativa do React e gerenciamento de estado local."
        },
        {
          id: "v-react-2",
          titulo: "🚀 Next.js 15: Server Components, Pages Router e Performance",
          duracao: "22 min",
          embedUrl: "https://www.youtube.com/embed/er_P0v_bJ2w",
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
          embedUrl: "https://www.youtube.com/embed/vYEk6jStQ9Q",
          descricao: "Aprenda a criar rotas GET, POST, PUT e DELETE com Express e Node.js."
        },
        {
          id: "v-node-2",
          titulo: "🛡️ Middlewares de Autenticação e Arquitetura Limpa (MVC)",
          duracao: "20 min",
          embedUrl: "https://www.youtube.com/embed/vYEk6jStQ9Q",
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
          embedUrl: "https://www.youtube.com/embed/Ofktsne-utM",
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
          embedUrl: "https://www.youtube.com/embed/K5KAc5CoCuk",
          descricao: "Aprenda a proteger senhas de usuários e emitir tokens JWT seguros com expiração."
        },
        {
          id: "v-jwt-2",
          titulo: "🛡️ Protegendo APIs Web: CORS, HTTPS e Token Security",
          duracao: "18 min",
          embedUrl: "https://www.youtube.com/embed/K5KAc5CoCuk",
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

  return (
    <div className={styles.container}>
      {/* Banner Principal de Boas-vindas */}
      <div className={styles.headerBanner}>
        <h2 className={styles.mainTitle}>
          <BookOpen size={28} color="#3b82f6" /> Guia de Estudo & Videoaulas Práticas Full Stack
        </h2>
        <p className={styles.subtitle}>
          Explore abaixo os conceitos fundamentais, assista a videoaulas dedicadas, consulte resumos de engenharia e copie códigos prontos para praticar no DevHub.
        </p>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {modulosFiltrados.map((mod, idx) => {
          const totalVideoAulas = mod.videoAulas?.length || 0;
          const assistidasNoModulo = mod.videoAulas?.filter(v => aulasAssistidas[v.id])?.length || 0;

          return (
            <div key={mod.id} id={`topico-slide-${idx}`} className={styles.topicCard}>
              <div className={styles.topicHeader}>
                <div className={styles.topicTitleGroup}>
                  <div className={styles.iconCircle} style={{ background: mod.bgBadge }}>
                    {mod.emoji}
                  </div>
                  <div>
                    <h3 className={styles.topicTitle}>{mod.titulo}</h3>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                      <span className={styles.nivelBadge} style={{ background: mod.bgBadge, color: mod.cor }}>
                        Nível: {mod.nivel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explicação Conceitual Profunda */}
              <div className={styles.explanationSection} style={{ borderLeftColor: mod.cor }}>
                <div style={{ fontWeight: 800, color: mod.cor, marginBottom: 6, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  📖 Explicação do Conceito:
                </div>
                <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{mod.explicacaoCompleta}</p>
              </div>

              {/* Grid de Pontos-Chave & Boas Práticas */}
              <div>
                <h5 style={{ margin: '0 0 10px 0', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}>
                  🔑 Pontos-Chave & Regras de Engenharia:
                </h5>
                <div className={styles.keyPointsGrid}>
                  {mod.pontosChave.map((ponto, pIdx) => (
                    <div key={pIdx} className={styles.keyPointItem}>
                      <CheckCircle2 size={16} color={mod.cor} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{ponto}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloco de Exemplo de Código Profissional */}
              <div>
                <div className={styles.codeBlockHeader}>
                  <span><Code size={14} style={{ display: 'inline', marginRight: 6 }} /> Exemplo de Código Completo</span>
                  <button className={styles.btnCopy} onClick={() => handleCopiarCodigo(mod.codigoExemplo, idx)}>
                    {copiadoIdx === idx ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    {copiadoIdx === idx ? "Copiado!" : "Copiar Código"}
                  </button>
                </div>
                <pre className={styles.codeTextarea}>
                  <code>{mod.codigoExemplo}</code>
                </pre>
              </div>

              {/* Caixa de Dica de Tech Lead IA */}
              <div className={styles.tipBox}>
                <Lightbulb size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>{mod.dicaSenior}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

