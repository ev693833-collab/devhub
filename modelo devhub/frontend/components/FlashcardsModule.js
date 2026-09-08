import React, { useState } from "react";
import styles from "./FlashcardsModule.module.css";
import { BrainCircuit, Sparkles, RefreshCw, RotateCcw, CheckCircle } from "lucide-react";
import axios from "axios";

export default function FlashcardsModule() {
  const [topico, setTopico] = useState("JavaScript & Async/Await");
  const [loading, setLoading] = useState(false);
  const [flippedMap, setFlippedMap] = useState({});

  const [cards, setCards] = useState([
    {
      id: 1,
      pergunta: "O que é uma Promise em JavaScript e quais são seus 3 estados?",
      resposta: "Uma Promise é um objeto representando a eventual conclusão ou falha de uma operação assíncrona. Seus estados são: Pending (pendente), Fulfilled (realizada) e Rejected (rejeitada).",
      categoria: "Conceito Básico",
      dificuldade: "Fácil"
    },
    {
      id: 2,
      pergunta: "Qual a diferença prática entre `null` e `undefined`?",
      resposta: "`undefined` significa que a variável foi declarada mas ainda não recebeu um valor. `null` é um valor de atribuição explícito indicando ausência intencional de objeto.",
      categoria: "Fundamentos",
      dificuldade: "Fácil"
    },
    {
      id: 3,
      pergunta: "O que faz a palavra-chave `await` dentro de uma função `async`?",
      resposta: "Pausa a execução da função assíncrona até que a Promise seja resolvida ou rejeitada, tornando o código assíncrono legível como síncrono.",
      categoria: "Performance",
      dificuldade: "Médio"
    },
    {
      id: 4,
      pergunta: "Qual é a principal utilidade do método `Array.prototype.reduce()`?",
      resposta: "Executa uma função acumuladora para cada elemento do array, resultando em um único valor de retorno (como uma soma total ou agrupamento de dados).",
      categoria: "Algoritmos",
      dificuldade: "Médio"
    }
  ]);

  const toggleFlip = (id) => {
    setFlippedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const eTopicoProgramacao = (top) => {
    if (!top || typeof top !== "string") return false;
    const lower = top.toLowerCase().trim();

    const naoTecnicos = [
      "arroz", "feijao", "feijão", "flamengo", "corinthians", "palmeiras", "vasco", "sao paulo", "são paulo",
      "santos", "gremio", "grêmio", "inter", "botafogo", "fluminense", "futebol", "comida", "receita", "carro",
      "fofoca", "politica", "política", "novela", "filme", "musica", "música", "amor", "namoro", "maquiagem",
      "roupa", "sapato", "viagem", "praia", "cerveja", "churrasco", "basquete", "vôlei", "volei", "casa",
      "jardim", "cachorro", "gato", "pet", "almoço", "jantar", "vinho", "pizza", "hamburguer", "hambúrguer"
    ];

    if (naoTecnicos.some(item => lower.includes(item))) return false;

    const termosTecnicos = [
      "js", "javascript", "ts", "typescript", "react", "next", "vue", "angular", "node", "express",
      "python", "django", "flask", "java", "spring", "c#", ".net", "c++", "ruby", "rails", "php", "laravel",
      "go", "golang", "rust", "swift", "kotlin", "sql", "mysql", "postgres", "postgresql", "mongodb", "redis",
      "html", "css", "flexbox", "grid", "tailwind", "sass", "git", "github", "gitlab", "docker", "kubernetes",
      "aws", "cloud", "api", "rest", "graphql", "json", "http", "https", "web", "frontend", "backend", "fullstack",
      "devops", "linux", "bash", "terminal", "algoritmo", "estrutura", "array", "objeto", "funcao", "função",
      "promise", "async", "await", "hook", "hooks", "state", "props", "redux", "zod", "jwt", "auth", "autenticacao",
      "banco de dados", "query", "crud", "orm", "prisma", "sequelize", "oo", "poo", "dry", "solid", "clean code",
      "design pattern", "tdd", "ci/cd", "microservicos", "microserviços", "security", "segurança", "teste", "codigo", "código"
    ];

    return termosTecnicos.some(termo => lower.includes(termo));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topico.trim()) return;

    const top = topico.trim();
    const eTecnico = eTopicoProgramacao(top);

    const cardAviso = [
      {
        id: 1,
        pergunta: `⚠️ "${top}" não é um assunto de Programação`,
        resposta: `A DevIA é uma tutora focada estritamente em Programação e Tecnologia. Por favor, insira um assunto de TI como JavaScript, React, SQL, Python, Git ou Docker para gerar seus flashcards.`,
        categoria: "DevIA 🤖",
        dificuldade: "Aviso"
      }
    ];

    // Se o usuário digitou algo fora de TI (ex: arroz e feijão, flamengo), exibe o aviso do Tutor DevIA
    if (!eTecnico) {
      setCards(cardAviso);
      setFlippedMap({});
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("devhub_token") || localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await axios.post(
        `${apiUrl}/dev-ia/flashcards/generate`,
        { topico: top },
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 7000
        }
      );

      if (res.data && res.data.flashcards && res.data.flashcards.length > 0) {
        setCards(res.data.flashcards);
        setFlippedMap({});
      }
    } catch (err) {
      console.warn("Gerando flashcards via gerador seguro:", err);
      if (!eTecnico) {
        setCards(cardAviso);
      } else {
        setCards([
          { id: 1, pergunta: `Qual a principal finalidade de ${top} na programação?`, resposta: `${top} é utilizado para estruturar a lógica da aplicação, otimizar o fluxo de dados e garantir manutenibilidade do código.`, categoria: "Conceito Básico", dificuldade: "Fácil" },
          { id: 2, pergunta: `Quais as melhores práticas ao codificar em ${top}?`, resposta: "Aplicar o princípio DRY (Don't Repeat Yourself), nomear funções e variáveis declarativamente e isolar responsabilidades.", categoria: "Boas Práticas", dificuldade: "Médio" },
          { id: 3, pergunta: `Como funciona o controle de exceções e erros em ${top}?`, resposta: "Utilizando blocos try/catch/finally e validando os tipos de dados de entrada antes do processamento.", categoria: "Segurança", dificuldade: "Médio" },
          { id: 4, pergunta: `Qual a diferença entre execuções síncronas e assíncronas em ${top}?`, resposta: "Operações assíncronas evitam o travamento da interface do usuário processando requisições em segundo plano.", categoria: "Performance", dificuldade: "Médio" }
        ]);
      }
      setFlippedMap({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconBadge}>
            <BrainCircuit size={24} />
          </div>
          <div>
            <h3 className={styles.title}>Flashcards de Estudo Inteligentes</h3>
            <p className={styles.subtitle}>Revisão rápida por repetição espaçada gerada pela DevIA</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className={styles.generateForm}>
          <input
            type="text"
            className={styles.inputTopic}
            value={topico}
            onChange={(e) => setTopico(e.target.value)}
            placeholder="Ex: React Hooks, SQL Joins..."
          />
          <button type="submit" className={styles.btnGenerate} disabled={loading}>
            {loading ? <RefreshCw size={16} className={styles.spin} /> : <Sparkles size={16} />}
            {loading ? "Gerando..." : "Gerar com IA"}
          </button>
        </form>
      </div>

      {loading && (
        <div className={styles.loadingBanner}>
          <RefreshCw size={22} className={styles.spin} />
          <div>
            <div>🤖 DevIA está formulando os 4 Flashcards de estudo sobre "{topico}"...</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 400, opacity: 0.85, marginTop: 2 }}>
              Aguarde alguns instantes enquanto a inteligência artificial analisa o conceito e elabora as perguntas!
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.cardsGrid}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={styles.skeletonCard}>
              <div className={styles.skeletonLine} style={{ width: '40%' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className={styles.skeletonLine} style={{ width: '90%' }} />
                <div className={styles.skeletonLine} style={{ width: '70%' }} />
              </div>
              <div className={styles.skeletonLine} style={{ width: '50%' }} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {cards.map((card) => {
            const isFlipped = Boolean(flippedMap[card.id]);
            return (
              <div key={card.id} className={styles.cardWrapper} onClick={() => toggleFlip(card.id)}>
                <div className={`${styles.cardInner} ${isFlipped ? styles.flipped : ""}`}>
                  <div className={styles.cardFront}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className={styles.categoryTag}>{card.categoria}</span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{card.dificuldade}</span>
                    </div>
                    <div className={styles.cardQuestion}>{card.pergunta}</div>
                    <div className={styles.cardFooterHint}>
                      <span>Clique para virar o cartão</span>
                      <RotateCcw size={14} />
                    </div>
                  </div>

                  <div className={styles.cardBack}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c084fc' }}>
                      <span className={styles.categoryTag}>Resposta Correta</span>
                      <CheckCircle size={16} />
                    </div>
                    <div className={styles.cardAnswer}>{card.resposta}</div>
                    <div className={styles.cardFooterHint} style={{ color: '#d8b4fe' }}>
                      <span>Clique para voltar</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
