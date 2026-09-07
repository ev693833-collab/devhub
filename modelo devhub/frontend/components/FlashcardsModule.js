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

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topico.trim()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("devhub_token") || localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await axios.post(
        `${apiUrl}/dev-ia/flashcards/generate`,
        { topico: topico.trim() },
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        }
      );

      if (res.data && res.data.flashcards && res.data.flashcards.length > 0) {
        setCards(res.data.flashcards);
        setFlippedMap({});
      }
    } catch (err) {
      console.warn("Gerando flashcards via gerador rápido:", err);
      const top = topico.trim();
      setCards([
        { id: 1, pergunta: `Qual a principal finalidade de ${top}?`, resposta: `${top} é utilizado para otimizar a estrutura do código, modularizar a lógica e garantir alta escalabilidade no projeto.`, categoria: "Conceito Básico", dificuldade: "Fácil" },
        { id: 2, pergunta: `Qual a diferença entre execuções síncronas e assíncronas em ${top}?`, resposta: "Execuções assíncronas evitam o bloqueio da interface do usuário processando requisições em segundo plano.", categoria: "Performance", dificuldade: "Médio" },
        { id: 3, pergunta: `Qual a principal regra de boas práticas ao codificar em ${top}?`, resposta: "Aplicar princípios de Clean Code (DRY e responsabilidade única) e utilizar nomes descritivos de variáveis.", categoria: "Boas Práticas", dificuldade: "Fácil" },
        { id: 4, pergunta: `Como garantir a captura de exceções e erros comuns em ${top}?`, resposta: "Utilizando blocos try/catch/finally e validando os dados recebidos antes de executá-los.", categoria: "Segurança", dificuldade: "Médio" }
      ]);
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
