import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DevHubLogo from "../components/Logo";

export default function Dashboard() {
  const router = useRouter();

  // Estados de Usuário e Tema
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(true);

  // Controle de Navegação Lateral
  // 'aulas' | 'agenda' | 'frequencia' | 'notas'
  const [abaAtiva, setAbaAtiva] = useState("aulas");

  // Categoria Selecionada para Modal de Estudo
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [busca, setBusca] = useState("");
  const [filtroTag, setFiltroTag] = useState("todos");

  // Filtros para Frequência e Provas
  const [buscaAluno, setBuscaAluno] = useState("");
  const [filtroFrequencia, setFiltroFrequencia] = useState("todos");

  // ===== ESTADOS DO CALENDÁRIO DA AGENDA =====
  const [mesAtual, setMesAtual] = useState(7); // 7 = Agosto (0-indexed: 0..11)
  const [anoAtual, setAnoAtual] = useState(2026);
  const [diaSelecionado, setDiaSelecionado] = useState("24/08/2026");

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

  const salvarAgendaLS = (lista, novaReuniao = null, idExcluir = null, idEditar = null, reuniaoEditar = null) => {
    setAgendaAulas(lista);
    try {
      localStorage.setItem("devhub_agenda_aulas", JSON.stringify(lista));
    } catch (e) {}

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    if (novaReuniao) {
      fetch(`${apiUrl}/agenda`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novaReuniao)
      }).catch(() => {});
    } else if (idEditar && reuniaoEditar) {
      fetch(`${apiUrl}/agenda/${idEditar}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reuniaoEditar)
      }).catch(() => {});
    } else if (idExcluir) {
      fetch(`${apiUrl}/agenda/${idExcluir}`, { method: "DELETE" }).catch(() => {});
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
  };

  const handleAbrirCriarProvaSuperAdmin = () => {
    setFormCriarTitulo("");
    setFormCriarDescricao("");
    setFormCriarDataLimite("2026-09-15");
    setFormCriarHoraLimite("23:59");
    setFormCriarDuracao("45");
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

    const dataFormatada = toBrDate(formCriarDataLimite) || "30/09/2026";
    const novaProva = {
      id: Date.now(),
      titulo: formCriarTitulo,
      descricao: formCriarDescricao,
      dataLimite: dataFormatada,
      horarioLimite: formCriarHoraLimite,
      duracaoMinutos: parseInt(formCriarDuracao) || 45,
      criadoPor: `${user ? user.nome : "Administrador"} (${user && user.cargo === "super_admin" ? "Super Admin 👑" : "Admin 🛡️"})`,
      questoes: formCriarPerguntas.map((q, idx) => ({
        id: Date.now() + idx,
        pergunta: q.pergunta || `Pergunta ${idx + 1}`,
        opcoes: q.opcoes.map((o, oIdx) => o || `Opção ${oIdx + 1}`),
        respostaCorreta: parseInt(q.respostaCorreta) || 0
      }))
    };

    const listaAtualizada = [novaProva, ...provasSistema];
    salvarProvasLS(listaAtualizada);
    setModalCriarProvaOpen(false);
    alert("✨ Prova temporária publicada com sucesso no sistema!");
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
    
    let status = "Aprovado ✅";
    if (media >= 9.5) status = "Aprovado ✅ — Destaque 🌟";
    else if (media < 7.0) status = "Em Recuperação ⚠️";

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
  const [formHorario, setFormHorario] = useState("19:00 - 21:00");
  const [formHoraInicio, setFormHoraInicio] = useState("19:00");
  const [formHoraFim, setFormHoraFim] = useState("21:00");
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
                .map((u) => `${u.nome} (${u.cargo === "super_admin" ? "Super Admin 👑" : "Admin 🛡️"})`);
              
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

  const isSuperAdmin = user && user.cargo === "super_admin";
  const isAdmin = user && (user.cargo === "admin" || user.cargo === "super_admin");

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
    setAulaEmEdicaoId(null);
    setFormTitulo("");
    setFormDescricao("");
    setFormData(dataPreenchida || diaSelecionado || "24/08/2026");
    setFormHorario("19:00 - 21:00");
    setFormInstrutor(user ? user.nome : "Enzo Vieira");
    setFormStatus("Agendada 📅");
    setFormLink("https://www.youtube.com");
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
      setAgendaAulas(prev => prev.filter(item => item.id !== id));
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
    },
    {
      id: "banco-de-dados",
      titulo: "🗄️ Banco de Dados & Backend",
      subtitulo: "SQL, MySQL, criptografia bcrypt e tokens JWT",
      tag: "backend",
      icone: "🔐",
      corBadge: "#10B981",
      apenasAdmin: false,
      videos: [
        { titulo: "DEVHUB - AULA 1 - BACKEND", url: "https://www.youtube.com/watch?v=tFgjBZpTAkI" }
      ],
      conteudo: {
        introducao: "Conceitos essenciais sobre banco de dados relacionais e segurança de dados.",
        secoes: [
          { titulo: "🗄️ Banco de Dados SQL", texto: "Organização de dados em tabelas relacionais." },
          { titulo: "🔑 Criptografia bcrypt", texto: "Transformação de senhas em hashes seguros irreversíveis." }
        ],
        exemploCodigo: `CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);`,
        dica: "Sempre utilize Prepared Statements nas consultas SQL."
      }
    },
    {
      id: "o-que-e-html",
      titulo: "🌐 O que é HTML?",
      subtitulo: "Estrutura e marcação para páginas web modernas",
      tag: "fundamentos",
      icone: "🧱",
      corBadge: "#F97316",
      apenasAdmin: false,
      videos: [
        { titulo: "DEVHUB - AULA 2 - FRONTEND", url: "https://www.youtube.com/watch?v=sKqKtOJRh04" }
      ],
      conteudo: {
        introducao: "HyperText Markup Language (Linguagem de Marcação de Hipertexto).",
        secoes: [
          { titulo: "🏷️ Tags HTML", texto: "Elementos como header, main, section, input e button." }
        ],
        dica: "Utilize tags semânticas para melhorar a acessibilidade."
      }
    },
    {
      id: "o-que-e-css",
      titulo: "🎨 O que é CSS?",
      subtitulo: "Estilização, cores e layouts dinâmicos",
      tag: "fundamentos",
      icone: "✨",
      corBadge: "#06B6D4",
      apenasAdmin: false,
      videos: [
        { titulo: "DEVHUB - AULA 2 - FRONTEND", url: "https://www.youtube.com/watch?v=sKqKtOJRh04" }
      ],
      conteudo: {
        introducao: "Cascading Style Sheets para definição visual do HTML.",
        secoes: [
          { titulo: "📐 Flexbox & Grid", texto: "Alinhamento e distribuição de elementos na tela." }
        ],
        dica: "Use variáveis CSS para simplificar o suporte a temas."
      }
    },
    {
      id: "arquitetura-avancada",
      titulo: "👑 Arquitetura Avançada & Segurança",
      subtitulo: "Módulo avançado de proteção contra SQL Injection e RBAC",
      tag: "recurso-avancado",
      icone: "🛡️",
      corBadge: "#A855F7",
      apenasAdmin: true,
      videos: [
        { titulo: "DEVHUB - AULA 3 - IA E ESTRUTURA DE CÓDIGO", url: "https://www.youtube.com/watch?v=apk_52Gjq6E" }
      ],
      conteudo: {
        introducao: "Módulo avançado exclusivo para Administradores.",
        secoes: [
          { titulo: "🛑 Segurança de Servidores", texto: "Rate limiting, validação de tokens e prevenção de ataques." }
        ],
        dica: "Exclusivo para perfis de nível Administrador e Super Admin."
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
    const isEstudante = !nota.email.includes("admin") && !nota.email.includes("super.admin");
    const pertenceAoUsuario = !user || isAdmin || (user && (nota.userId === user.id || (nota.email && nota.email.toLowerCase() === user.email.toLowerCase())));
    const atendeBusca = nota.alunoNome.toLowerCase().includes(buscaAluno.toLowerCase()) ||
                        nota.email.toLowerCase().includes(buscaAluno.toLowerCase());
    return isEstudante && pertenceAoUsuario && atendeBusca;
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
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
                    color: "#FFFFFF",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "700"
                  }}
                >
                  👑 Super Admin
                </button>
              )}

              <button
                onClick={toggleTheme}
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                  color: colors.textPrimary,
                  border: `1px solid ${colors.borderCard}`,
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600"
                }}
              >
                {isDark ? "☀️ Claro" : "🌙 Escuro"}
              </button>

              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                  color: "#EF4444",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600"
                }}
              >
                Sair 🚪
              </button>
            </div>
          </div>
        </header>

        {/* CONTÊINER PRINCIPAL: SIDEBAR + CONTEÚDO */}
        <div style={{
          maxWidth: "1350px",
          margin: "0 auto",
          padding: "24px 20px",
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "24px"
        }}>

          {/* ===== SIDEBAR LATERAL ORGANIZADA ===== */}
          <aside style={{
            backgroundColor: colors.bgSidebar,
            border: `1px solid ${colors.borderCard}`,
            borderRadius: "20px",
            padding: "20px",
            height: "fit-content",
            position: "sticky",
            top: "85px"
          }}>
            <div style={{ marginBottom: "16px" }}>
              <span style={{
                fontSize: "11px",
                fontWeight: "800",
                color: colors.textSecondary,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: "12px"
              }}>
                Navegação Principal
              </span>

              <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                
                {/* Aba 1: Aulas */}
                <button
                  onClick={() => setAbaAtiva("aulas")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: abaAtiva === "aulas" ? "1px solid #3B82F6" : "1px solid transparent",
                    background: abaAtiva === "aulas" ? "rgba(59, 130, 246, 0.15)" : "transparent",
                    color: abaAtiva === "aulas" ? "#3B82F6" : colors.textPrimary,
                    fontWeight: abaAtiva === "aulas" ? "800" : "600",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>🎓</span>
                    <span>Aulas & Guia</span>
                  </span>
                  <span style={{ fontSize: "11px", color: colors.textSecondary }}>{categorias.length}</span>
                </button>

                {/* Aba 2: Calendário / Agenda de Aulas */}
                <button
                  onClick={() => setAbaAtiva("agenda")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: abaAtiva === "agenda" ? "1px solid #3B82F6" : "1px solid transparent",
                    background: abaAtiva === "agenda" ? "rgba(59, 130, 246, 0.15)" : "transparent",
                    color: abaAtiva === "agenda" ? "#3B82F6" : colors.textPrimary,
                    fontWeight: abaAtiva === "agenda" ? "800" : "600",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>📅</span>
                    <span>Calendário & Agenda</span>
                  </span>
                  <span style={{ fontSize: "11px", color: "#EF4444", fontWeight: "700" }}>Ao Vivo 🔴</span>
                </button>

                {/* Aba 3: Frequência */}
                <button
                  onClick={() => setAbaAtiva("frequencia")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: abaAtiva === "frequencia" ? "1px solid #10B981" : "1px solid transparent",
                    background: abaAtiva === "frequencia" ? "rgba(16, 185, 129, 0.15)" : "transparent",
                    color: abaAtiva === "frequencia" ? "#10B981" : colors.textPrimary,
                    fontWeight: abaAtiva === "frequencia" ? "800" : "600",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>📊</span>
                    <span>Relatório Frequência</span>
                  </span>
                </button>

                {/* Aba 4: Notas */}
                <button
                  onClick={() => setAbaAtiva("notas")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: abaAtiva === "notas" ? "1px solid #A855F7" : "1px solid transparent",
                    background: abaAtiva === "notas" ? "rgba(168, 85, 247, 0.15)" : "transparent",
                    color: abaAtiva === "notas" ? "#A855F7" : colors.textPrimary,
                    fontWeight: abaAtiva === "notas" ? "800" : "600",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>📝</span>
                    <span>Notas das Provas</span>
                  </span>
                </button>

                {/* Aba 5: Realizar Provas Online */}
                <button
                  onClick={() => setAbaAtiva("provas-online")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: abaAtiva === "provas-online" ? "1px solid #EC4899" : "1px solid transparent",
                    background: abaAtiva === "provas-online" ? "rgba(236, 72, 153, 0.15)" : "transparent",
                    color: abaAtiva === "provas-online" ? "#EC4899" : colors.textPrimary,
                    fontWeight: abaAtiva === "provas-online" ? "800" : "600",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>✍️</span>
                    <span>Realizar Provas</span>
                  </span>
                  <span style={{ fontSize: "11px", color: "#EC4899", fontWeight: "700" }}>Novo ✨</span>
                </button>

              </nav>
            </div>

            {/* Perfil Conectado na Sidebar */}
            <div style={{
              padding: "14px",
              borderRadius: "14px",
              backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
              marginTop: "20px"
            }}>
              <span style={{ fontSize: "11px", color: colors.textSecondary, fontWeight: "600" }}>Conectado como:</span>
              <h4 style={{ fontSize: "14px", fontWeight: "700", marginTop: "2px" }}>
                {user ? user.nome : "Usuário"}
              </h4>
              <span style={{ fontSize: "11px", color: cargoInfo.color, fontWeight: "700" }}>
                {cargoInfo.label}
              </span>
            </div>
          </aside>

          {/* ===== ÁREA DE CONTEÚDO PRINCIPAL ===== */}
          <main style={{ minWidth: 0 }}>
            
            {/* Banner de Topo Limpo */}
            <div style={{
              backgroundColor: colors.bgCard,
              border: `1px solid ${colors.borderCard}`,
              borderRadius: "20px",
              padding: "24px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px"
            }}>
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "4px" }}>
                  Bem-vindo, {user ? user.nome : "Estudante"}! 👋
                </h1>
                <p style={{ color: colors.textSecondary, fontSize: "14px" }}>
                  Plataforma didática DevHub — Selecione uma categoria no menu lateral para visualizar os relatórios, calendário e aulas.
                </p>
              </div>
            </div>

            {/* ABA 1: AULAS DE ESTUDO */}
            {abaAtiva === "aulas" && (
              <div>
                <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    placeholder="🔍 Pesquisar aulas por título..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: `1px solid ${colors.borderCard}`,
                      backgroundColor: colors.inputBg,
                      color: colors.textPrimary,
                      fontSize: "14px"
                    }}
                  />

                  <div style={{ display: "flex", gap: "6px" }}>
                    {["todos", "cursos", "fundamentos", "backend"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setFiltroTag(t)}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "10px",
                          border: filtroTag === t ? "1px solid #3B82F6" : `1px solid ${colors.borderCard}`,
                          backgroundColor: filtroTag === t ? "#3B82F6" : colors.bgCard,
                          color: filtroTag === t ? "#FFF" : colors.textPrimary,
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        {t === "todos" ? "Todas" : t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                  {categoriasFiltradas.map((cat) => {
                    const estaBloqueado = cat.apenasAdmin && !isAdmin;

                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          if (estaBloqueado) {
                            alert("🔒 Recurso exclusivo para Administradores.");
                            return;
                          }
                          setCategoriaAtiva(cat);
                        }}
                        style={{
                          backgroundColor: colors.bgCard,
                          border: `1px solid ${colors.borderCard}`,
                          borderRadius: "18px",
                          padding: "22px",
                          cursor: estaBloqueado ? "not-allowed" : "pointer",
                          opacity: estaBloqueado ? 0.7 : 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between"
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "28px", marginBottom: "12px" }}>{cat.icone}</div>
                          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "6px" }}>{cat.titulo}</h3>
                          <p style={{ fontSize: "13px", color: colors.textSecondary, marginBottom: "16px" }}>{cat.subtitulo}</p>
                        </div>

                        <span style={{ fontSize: "13px", fontWeight: "700", color: cat.corBadge }}>
                          {estaBloqueado ? "🔒 Restrito Admin" : "Acessar Conteúdo →"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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

                      return (
                        <div
                          key={item.dataStr}
                          onClick={() => setDiaSelecionado(item.dataStr)}
                          style={{
                            minHeight: "64px",
                            padding: "8px",
                            borderRadius: "12px",
                            border: isSelecionado ? "2px solid #3B82F6" : `1px solid ${colors.borderCard}`,
                            backgroundColor: isSelecionado
                              ? (isDark ? "rgba(59, 130, 246, 0.25)" : "#E0F2FE")
                              : (reunioesNoDia.length > 0 ? (isDark ? "rgba(30, 41, 59, 0.7)" : "#F8FAFC") : "transparent"),
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <span style={{ fontSize: "13px", fontWeight: isSelecionado ? "900" : "700", color: isSelecionado ? "#3B82F6" : colors.textPrimary }}>
                            {item.diaNum}
                          </span>

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
                              👨‍🏫 Conduzido por: {aula.instrutor}
                            </span>
                          </div>

                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            {isAdmin && (
                              <div style={{ display: "flex", gap: "6px" }}>
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

            {/* ABA 3: RELATÓRIO DE FREQUÊNCIA DOS ALUNOS */}
            {abaAtiva === "frequencia" && (
              <div>
                <div style={{ marginBottom: "20px" }}>
                  <h2 style={{ fontSize: "20px", fontWeight: "800" }}>📊 Relatório de Frequência dos Alunos</h2>
                  <p style={{ color: colors.textSecondary, fontSize: "13px", marginTop: "2px" }}>
                    Lista de alunos que participaram das aulas e percentual de presença.
                  </p>
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
                          <th style={{ padding: "12px 16px" }}>Cargo</th>
                          <th style={{ padding: "12px 16px" }}>Aulas Presenciadas</th>
                          <th style={{ padding: "12px 16px" }}>Presença (%)</th>
                          <th style={{ padding: "12px 16px" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {relatorioAlunosFiltrados.map((aluno) => (
                          <tr key={aluno.id} style={{ borderBottom: `1px solid ${colors.borderCard}` }}>
                            <td style={{ padding: "14px 16px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ fontSize: "20px" }}>{aluno.avatar}</span>
                                <div>
                                  <strong style={{ display: "block" }}>{aluno.nome}</strong>
                                  <span style={{ fontSize: "11px", color: colors.textSecondary }}>{aluno.email}</span>
                                </div>
                              </div>
                            </td>

                            <td style={{ padding: "14px 16px", fontWeight: "600" }}>
                              {aluno.cargo}
                            </td>

                            <td style={{ padding: "14px 16px", fontWeight: "700" }}>
                              {aluno.aulasAssistidas} de {aluno.totalAulas} aulas
                            </td>

                            <td style={{ padding: "14px 16px" }}>
                              <strong style={{ color: aluno.statusColor }}>{aluno.frequenciaPct}%</strong>
                            </td>

                            <td style={{ padding: "14px 16px" }}>
                              <span style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 12px",
                                borderRadius: "12px",
                                backgroundColor: `${aluno.statusColor}20`,
                                color: aluno.statusColor,
                                border: `1px solid ${aluno.statusColor}40`,
                                fontSize: "12px",
                                fontWeight: "700",
                                whiteSpace: "nowrap"
                              }}>
                                {aluno.statusBadge}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
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
                  const listaProvasRealizadas = notasProvas.filter(nota => {
                    const temNotaValida = nota.nota !== undefined && nota.nota !== null;
                    const temTitulo = Boolean(nota.provaTitulo || nota.ultimaProvaTitulo);
                    const temP1Valida = nota.prova1 !== undefined && nota.prova1 !== null && nota.prova1 > 0;
                    const realizouAlguma = temNotaValida || temTitulo || temP1Valida;

                    const bateBusca = !buscaAluno || 
                      (nota.alunoNome && nota.alunoNome.toLowerCase().includes(buscaAluno.toLowerCase())) || 
                      (nota.email && nota.email.toLowerCase().includes(buscaAluno.toLowerCase()));

                    return realizouAlguma && bateBusca;
                  });

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
                                      {nota.status || (valorNota >= 9.5 ? "Aprovado ✅ — Destaque 🌟" : valorNota >= 7 ? "Aprovado ✅" : "Em Recuperação ⚠️")}
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

            {/* ABA 5: SISTEMA DE PROVAS ONLINE / AVALIAÇÕES TEMPORÁRIAS */}
            {abaAtiva === "provas-online" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                      ✍️ Sistema de Avaliações & Provas do DevHub
                    </h2>
                    <p style={{ color: colors.textSecondary, fontSize: "13px", marginTop: "2px" }}>
                      Realize provas e testes teóricos/práticos temporários com contagem de notas.
                    </p>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={handleAbrirCriarProvaSuperAdmin}
                      style={{
                        padding: "10px 18px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
                        color: "#FFF",
                        border: "none",
                        fontWeight: "700",
                        fontSize: "13px",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(168, 85, 247, 0.35)"
                      }}
                    >
                      👑 ➕ Criar Prova Temporária
                    </button>
                  )}
                </div>

                {provasSistema.length === 0 ? (
                  <div style={{
                    backgroundColor: colors.bgCard,
                    border: `1px solid ${colors.borderCard}`,
                    borderRadius: "18px",
                    padding: "40px 20px",
                    textAlign: "center",
                    color: colors.textSecondary
                  }}>
                    <span style={{ fontSize: "36px", display: "block", marginBottom: "12px" }}>✍️</span>
                    <h3 style={{ fontSize: "16px", fontWeight: "800", color: colors.textPrimary, marginBottom: "4px" }}>
                      Nenhuma Prova Disponível no Momento
                    </h3>
                    <p style={{ fontSize: "13px", maxWidth: "450px", margin: "0 auto" }}>
                      {isAdmin
                        ? "Como Administrador / Super Admin, você pode usar o botão acima para criar novas provas temporárias para os estudantes."
                        : "Fique atento ao sistema! As avaliações serão publicadas aqui quando forem liberadas pelos Administradores."}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                    {provasSistema.map((prova) => {
                    const partesData = prova.dataLimite.split("/");
                    const dataExp = new Date(`${partesData[2]}-${partesData[1]}-${partesData[0]}T23:59:59`);
                    const expirada = new Date() > dataExp;
                    const provaJaRealizada = user && provasConcluidas.some(c => c.provaId === prova.id && (c.userId === user.id || (c.userEmail && c.userEmail.toLowerCase() === user.email.toLowerCase())));
                    const registroConclusao = user ? provasConcluidas.find(c => c.provaId === prova.id && (c.userId === user.id || (c.userEmail && c.userEmail.toLowerCase() === user.email.toLowerCase()))) : null;

                    return (
                      <div
                        key={prova.id}
                        style={{
                          backgroundColor: colors.bgCard,
                          border: `1px solid ${colors.borderCard}`,
                          borderRadius: "18px",
                          padding: "22px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between"
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            {expirada ? (
                              <span style={{
                                fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "8px",
                                backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.4)"
                              }}>
                                ⌛ Prova Encerrada
                              </span>
                            ) : provaJaRealizada ? (
                              <span style={{
                                fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "8px",
                                backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#A855F7", border: "1px solid rgba(168, 85, 247, 0.4)"
                              }}>
                                🔒 Prova Realizada & Trancada
                              </span>
                            ) : (
                              <span style={{
                                fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "8px",
                                backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.4)"
                              }}>
                                🟢 Prova Disponível
                              </span>
                            )}

                            <span style={{ fontSize: "12px", color: colors.textSecondary, fontWeight: "600" }}>
                              ⏱️ {prova.duracaoMinutos} min
                            </span>
                          </div>

                          <h3 style={{ fontSize: "17px", fontWeight: "800", marginBottom: "8px" }}>
                            {prova.titulo}
                          </h3>

                          <p style={{ fontSize: "13px", color: colors.textSecondary, marginBottom: "16px", lineHeight: "1.5" }}>
                            {prova.descricao}
                          </p>

                          <div style={{
                            fontSize: "12px",
                            color: colors.textSecondary,
                            backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            marginBottom: "18px"
                          }}>
                            <div>📅 <strong>Validade Limite:</strong> {prova.dataLimite} às {prova.horarioLimite}</div>
                            <div>❓ <strong>Total de Questões:</strong> {prova.questoes.length} perguntas</div>
                            <div style={{ marginTop: "4px", fontSize: "11px", color: "#A855F7" }}>👑 <strong>Criado por:</strong> {prova.criadoPor}</div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            disabled={expirada || provaJaRealizada}
                            onClick={() => handleIniciarProvaOnline(prova)}
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "10px",
                              backgroundColor: (expirada || provaJaRealizada) ? (isDark ? "rgba(255,255,255,0.06)" : "#CBD5E1") : "#EC4899",
                              color: (expirada || provaJaRealizada) ? colors.textSecondary : "#FFFFFF",
                              border: "none",
                              fontWeight: "700",
                              fontSize: "13px",
                              cursor: (expirada || provaJaRealizada) ? "not-allowed" : "pointer"
                            }}
                          >
                            {expirada ? "🔒 Prova Expirada" : provaJaRealizada ? `🔒 Prova Concluída (Nota: ${registroConclusao ? registroConclusao.nota : ''})` : "✍️ Realizar Prova Agora"}
                          </button>

                          {isSuperAdmin && (
                            <button
                              onClick={() => handleExcluirProvaSuperAdmin(prova.id)}
                              title="Excluir Prova (Super Admin)"
                              style={{
                                padding: "12px",
                                borderRadius: "10px",
                                backgroundColor: "rgba(239, 68, 68, 0.15)",
                                color: "#EF4444",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                                cursor: "pointer",
                                fontSize: "13px"
                              }}
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                )}
              </div>
            )}

          </main>
        </div>

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
                  {aulaEmEdicaoId ? "✏️ Editar Data da Reunião" : `📅 Agendar Reunião (${formData})`}
                </h3>
                <button
                  onClick={() => setModalAgendaOpen(false)}
                  style={{
                    border: "none", backgroundColor: "transparent",
                    color: colors.textPrimary, fontSize: "18px", cursor: "pointer"
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSalvarAgendamento} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>Título da Reunião / Aula</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: DEVHUB - AULA 6 - DEPLOY EM PRODUÇÃO"
                    value={formTitulo}
                    onChange={(e) => setFormTitulo(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: "8px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "13px"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>Descrição Resumida</label>
                  <input
                    type="text"
                    placeholder="Resumo da pauta ou assunto da reunião..."
                    value={formDescricao}
                    onChange={(e) => setFormDescricao(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: "8px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "13px"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>
                    👨‍🏫 Quem vai conduzir a reunião (Selecione um Admin 🛡️)
                  </label>
                  <select
                    value={formInstrutor}
                    onChange={(e) => setFormInstrutor(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: "8px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "13px", fontWeight: "600",
                      cursor: "pointer"
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
                  {/* SELETOR VISUAL DE DATA (MINI AGENDINHA) */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>
                      📅 Data da Reunião (Mini Agendinha)
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
                        width: "100%", padding: "10px 12px", borderRadius: "8px",
                        border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                        color: colors.textPrimary, fontSize: "13px", fontWeight: "600",
                        cursor: "pointer"
                      }}
                    />
                    <span style={{ fontSize: "11px", color: colors.textSecondary, marginTop: "2px", display: "block" }}>
                      Data: <strong>{formData || "Selecione..."}</strong>
                    </span>
                  </div>

                  {/* SELETOR DE HORÁRIOS & ATALHOS */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>
                      ⏰ Horário da Reunião
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
                          flex: 1, padding: "8px 6px", borderRadius: "8px",
                          border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                          color: colors.textPrimary, fontSize: "12px", fontWeight: "600"
                        }}
                      />
                      <span style={{ fontSize: "11px", color: colors.textSecondary }}>até</span>
                      <input
                        type="time"
                        value={formHoraFim}
                        onChange={(e) => {
                          setFormHoraFim(e.target.value);
                          setFormHorario(`${formHoraInicio} - ${e.target.value}`);
                        }}
                        style={{
                          flex: 1, padding: "8px 6px", borderRadius: "8px",
                          border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                          color: colors.textPrimary, fontSize: "12px", fontWeight: "600"
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>Status da Reunião</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: "8px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "13px", fontWeight: "600"
                    }}
                  >
                    <option value="Agendada 📅">Agendada 📅</option>
                    <option value="Ao Vivo 🔴">Ao Vivo 🔴</option>
                    <option value="Concluída ✅">Concluída ✅</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setModalAgendaOpen(false)}
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
                      border: "none", backgroundColor: "#3B82F6",
                      color: "#FFFFFF", fontWeight: "700", cursor: "pointer"
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
        {categoriaAtiva && (
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
              maxWidth: "650px",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              borderRadius: "20px",
              padding: "28px",
              position: "relative"
            }}>
              <button
                onClick={() => setCategoriaAtiva(null)}
                style={{
                  position: "absolute", top: "18px", right: "18px",
                  border: "none", backgroundColor: "transparent",
                  color: colors.textPrimary, fontSize: "18px", cursor: "pointer"
                }}
              >
                ✕
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <span style={{ fontSize: "28px" }}>{categoriaAtiva.icone}</span>
                <h2 style={{ fontSize: "22px", fontWeight: "800" }}>{categoriaAtiva.titulo}</h2>
              </div>

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
          </div>
        )}

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

        {/* MODAL CRIAR PROVA TEMPORÁRIA (SUPER ADMIN ONLY) */}
        {modalCriarProvaOpen && (
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
              maxWidth: "600px",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              position: "relative"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#A855F7" }}>
                  👑 Criar Prova Temporária (Super Admin)
                </h3>
                <button
                  onClick={() => setModalCriarProvaOpen(false)}
                  style={{ border: "none", backgroundColor: "transparent", color: colors.textPrimary, fontSize: "18px", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSalvarNovaProvaSuperAdmin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>Título da Prova</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Avaliação Teórica Módulo 3"
                    value={formCriarTitulo}
                    onChange={(e) => setFormCriarTitulo(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: "8px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "13px"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>Descrição & Instruções</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Descrição sobre os conteúdos cobrados..."
                    value={formCriarDescricao}
                    onChange={(e) => setFormCriarDescricao(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: "8px",
                      border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                      color: colors.textPrimary, fontSize: "13px", resize: "none"
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", marginBottom: "4px" }}>📅 Data Limite</label>
                    <input
                      type="date"
                      required
                      value={formCriarDataLimite}
                      onChange={(e) => setFormCriarDataLimite(e.target.value)}
                      style={{
                        width: "100%", padding: "8px", borderRadius: "8px",
                        border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                        color: colors.textPrimary, fontSize: "12px"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", marginBottom: "4px" }}>⏰ Hora Limite</label>
                    <input
                      type="time"
                      required
                      value={formCriarHoraLimite}
                      onChange={(e) => setFormCriarHoraLimite(e.target.value)}
                      style={{
                        width: "100%", padding: "8px", borderRadius: "8px",
                        border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                        color: colors.textPrimary, fontSize: "12px"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", marginBottom: "4px" }}>⏱️ Duração (min)</label>
                    <input
                      type="number"
                      required
                      min="5"
                      max="180"
                      value={formCriarDuracao}
                      onChange={(e) => setFormCriarDuracao(e.target.value)}
                      style={{
                        width: "100%", padding: "8px", borderRadius: "8px",
                        border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                        color: colors.textPrimary, fontSize: "12px"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "800", color: "#A855F7" }}>❓ Questões da Prova</label>
                    <button
                      type="button"
                      onClick={handleAdicionarPerguntaForm}
                      style={{
                        padding: "4px 10px", borderRadius: "6px",
                        backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#A855F7",
                        border: "1px solid rgba(168, 85, 247, 0.3)", fontSize: "12px", cursor: "pointer"
                      }}
                    >
                      + Nova Questão
                    </button>
                  </div>

                  {formCriarPerguntas.map((q, qIdx) => (
                    <div key={qIdx} style={{
                      padding: "14px", borderRadius: "12px",
                      backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                      border: `1px solid ${colors.borderCard}`, marginBottom: "12px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "800", color: "#A855F7" }}>
                          Pergunta #{qIdx + 1}
                        </span>

                        {formCriarPerguntas.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormCriarPerguntas(prev => prev.filter((_, i) => i !== qIdx));
                            }}
                            style={{
                              border: "none", backgroundColor: "transparent",
                              color: "#EF4444", fontSize: "12px", cursor: "pointer", fontWeight: "700"
                            }}
                          >
                            🗑️ Remover Pergunta
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        required
                        placeholder={`Digite o enunciado da Pergunta ${qIdx + 1}...`}
                        value={q.pergunta}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormCriarPerguntas(prev => prev.map((item, i) => i === qIdx ? { ...item, pergunta: val } : item));
                        }}
                        style={{
                          width: "100%", padding: "10px 12px", borderRadius: "8px",
                          border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                          color: colors.textPrimary, fontSize: "13px", marginBottom: "10px"
                        }}
                      />

                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", marginBottom: "6px", color: colors.textSecondary }}>
                        Opções de Resposta:
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                        {q.opcoes.map((op, oIdx) => (
                          <input
                            key={oIdx}
                            type="text"
                            required
                            placeholder={`Opção ${oIdx + 1}`}
                            value={op}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormCriarPerguntas(prev => prev.map((item, i) => i === qIdx ? {
                                ...item,
                                opcoes: item.opcoes.map((o, idx2) => idx2 === oIdx ? val : o)
                              } : item));
                            }}
                            style={{
                              padding: "8px 10px", borderRadius: "6px",
                              border: `1px solid ${colors.borderCard}`, backgroundColor: colors.inputBg,
                              color: colors.textPrimary, fontSize: "12px"
                            }}
                          />
                        ))}
                      </div>

                      {/* SELETOR DA RESPOSTA CORRETA */}
                      <div style={{ backgroundColor: isDark ? "rgba(16, 185, 129, 0.1)" : "#E6F4EA", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: "800", color: "#10B981", marginBottom: "4px" }}>
                          ✅ Qual é a Resposta CORRETA desta pergunta?
                        </label>
                        <select
                          value={q.respostaCorreta}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setFormCriarPerguntas(prev => prev.map((item, i) => i === qIdx ? { ...item, respostaCorreta: val } : item));
                          }}
                          style={{
                            width: "100%", padding: "8px", borderRadius: "6px",
                            border: "1px solid #10B981", backgroundColor: colors.inputBg,
                            color: colors.textPrimary, fontSize: "12px", fontWeight: "700",
                            cursor: "pointer"
                          }}
                        >
                          {q.opcoes.map((opText, oIdx) => (
                            <option key={oIdx} value={oIdx}>
                              Opção {oIdx + 1}: {opText ? opText : `(Opção ${oIdx + 1})`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setModalCriarProvaOpen(false)}
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
                      border: "none", background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
                      color: "#FFFFFF", fontWeight: "700", cursor: "pointer"
                    }}
                  >
                    👑 Publicar Prova Temporária
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
