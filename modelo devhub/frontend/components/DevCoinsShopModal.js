import { useState, useEffect } from "react";
import { Coins, ShoppingBag, Palette, Flame, Lightbulb, Award, Crown, Check, X, Sparkles, Eye, User, Zap, RefreshCw, Lock, ShieldAlert, Star } from "lucide-react";

export default function DevCoinsShopModal({ isOpen, onClose, devcoins, setDevcoins, user, isDark, colors, onTemaEquipado }) {
  const [compras, setCompras] = useState([]);
  const [comprando, setComprando] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [previewItem, setPreviewItem] = useState(null);
  const [temaAtivoId, setTemaAtivoId] = useState("padrao");
  const [avatarAtivo, setAvatarAtivo] = useState(null);
  const [tituloAtivo, setTituloAtivo] = useState("Dev Aprendiz");

  const ITENS_LOJA = [
    // TEMAS EFEITOS ESPECIAIS COMUNS & EXCLUSIVOS
    { 
      id: "tema-cyberpunk", tipo: "tema", nome: "Tema Cyberpunk Neon 🌌", preco: 150, icon: Palette, raridade: "comum",
      desc: "Aplica tons neon púrpura e azul eletrizante com iluminação fluorescente e brilho de neon nos cards.",
      previewStyle: { background: "linear-gradient(135deg, #1E1B4B 0%, #311042 100%)", border: "2px solid #C084FC", boxShadow: "0 0 20px #C084FC", color: "#F3E8FF" }
    },
    { 
      id: "tema-matrix", tipo: "tema", nome: "Tema Matrix Code 🟢", preco: 150, icon: Palette, raridade: "comum",
      desc: "Estilo hacker clássico verde com efeito de terminal e código em cascata e bordas esmeralda reluzentes.",
      previewStyle: { background: "#022C22", border: "2px solid #4ADE80", boxShadow: "0 0 20px #4ADE80", color: "#4ADE80", fontFamily: "monospace" }
    },
    { 
      id: "tema-gold-luxury", tipo: "tema", nome: "Tema Gold Luxury 👑", preco: 250, icon: Palette, raridade: "raro",
      desc: "Estilo luxuoso dourado com partículas brilhantes de ouro e bordas reluzentes de alta patente.",
      previewStyle: { background: "linear-gradient(135deg, #451A03 0%, #78350F 100%)", border: "2px solid #F59E0B", boxShadow: "0 0 22px #F59E0B", color: "#FDE68A" }
    },
    { 
      id: "tema-synthwave", tipo: "tema", nome: "Tema Synthwave Sunset 🌅", preco: 180, icon: Palette, raridade: "comum",
      desc: "Tons nostálgicos de por do sol retrô magenta e laranja com linhas horizontais reluzentes.",
      previewStyle: { background: "linear-gradient(135deg, #831843 0%, #500724 100%)", border: "2px solid #F472B6", boxShadow: "0 0 20px #F472B6", color: "#FBCFE8" }
    },

    // TEMAS RAROS & LENDÁRIOS (CONQUISTAS ESPECÍFICAS)
    { 
      id: "tema-raro-dragon", tipo: "tema", nome: "Tema Raro: Chama Dracônica 🐉🔥", preco: 500, icon: Palette, raridade: "raro",
      requerimento: "Vencer 3 Batalhas de Código seguidas",
      desc: "Aura vulcânica vermelha flamejante com efeito de brasas reluzentes nos elementos da tela.",
      previewStyle: { background: "linear-gradient(135deg, #450A0A 0%, #7F1D1D 100%)", border: "2px solid #EF4444", boxShadow: "0 0 25px #EF4444", color: "#FCA5A5" }
    },
    { 
      id: "tema-raro-quantum", tipo: "tema", nome: "Tema Lendário: Núcleo Quântico ⚛️✨", preco: 1000, icon: Palette, raridade: "lendario",
      requerimento: "Alcançar a Nota 10 em 5 Provas Diárias",
      desc: "Estilo quântico holográfico com iluminação safira cintilante em alta frequência.",
      previewStyle: { background: "linear-gradient(135deg, #0284C7 0%, #0F172A 100%)", border: "2px solid #38BDF8", boxShadow: "0 0 30px #38BDF8", color: "#E0F2FE" }
    },

    // AVATARES GAMER DE ALTA RESOLUÇÃO
    { id: "avatar-astro-gamer", tipo: "avatar", nome: "Avatar: Astro Gamer 👨‍🚀", preco: 100, icon: User, raridade: "comum", desc: "Chibi astronauta gamer em 3D com controle e headset azul reluzente.", avatarUrl: "/img/avatar_astro.png" },
    { id: "avatar-cyber-boy", tipo: "avatar", nome: "Avatar: Cyber Boy ⚡", preco: 140, icon: User, raridade: "comum", desc: "Mascote e-sport anime com capuz e fone neon verde de alta frequência.", avatarUrl: "/img/avatar_cyber_boy.png" },
    { id: "avatar-cyber-reaper", tipo: "avatar", nome: "Avatar: Cyber Reaper 🥷", preco: 160, icon: User, raridade: "raro", desc: "Assassino cibernético futurista com katanas duplas e olhos ciano.", avatarUrl: "/img/avatar_reaper.png" },
    { id: "avatar-ninja-gamer", tipo: "avatar", nome: "Avatar: Ninja Gamer 🎮", preco: 200, icon: User, raridade: "raro", desc: "Chibi ninja estiloso de pernas cruzadas jogando com fone vermelho.", avatarUrl: "/img/avatar_ninja.png" },

    // TÍTULOS MANEIROS COM DESIGN E EFEITOS DE BADGE
    { 
      id: "titulo-fullstack-god", tipo: "titulo", nome: "⚡ Deus do Full Stack", preco: 300, icon: Crown, raridade: "raro",
      desc: "Título lendário com badge dourado e efeito de raio cintilante no perfil.",
      badgeStyle: { background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#FFF", border: "1px solid #FBBF24", boxShadow: "0 0 12px rgba(245,158,11,0.6)" }
    },
    { 
      id: "titulo-bug-hunter", tipo: "titulo", nome: "🎯 Caçador de Bugs", preco: 180, icon: Crown, raridade: "comum",
      desc: "Título de precisão cirúrgica com badge rubi e raio laser no ranking.",
      badgeStyle: { background: "linear-gradient(135deg, #EF4444, #991B1B)", color: "#FFF", border: "1px solid #F87171", boxShadow: "0 0 12px rgba(239,68,68,0.6)" }
    },
    { 
      id: "titulo-code-ninja", tipo: "titulo", nome: "🥷 Code Ninja Supremo", preco: 220, icon: Crown, raridade: "raro",
      desc: "Insígnia das sombras cibernéticas com brilho roxo neon e borda metálica.",
      badgeStyle: { background: "linear-gradient(135deg, #8B5CF6, #4C1D95)", color: "#FFF", border: "1px solid #C084FC", boxShadow: "0 0 12px rgba(168,85,247,0.6)" }
    },
    { 
      id: "titulo-arqueto-senior", tipo: "titulo", nome: "🏗️ Arquiteto Sênior", preco: 250, icon: Crown, raridade: "raro",
      desc: "Selo executivo de maestria arquitetural com aura azul safira reluzente.",
      badgeStyle: { background: "linear-gradient(135deg, #3B82F6, #1E3A8A)", color: "#FFF", border: "1px solid #60A5FA", boxShadow: "0 0 12px rgba(59,130,246,0.6)" }
    },
    { 
      id: "titulo-campeao-invicto", tipo: "titulo", nome: "🏆 Campeão Invicto de Batalha", preco: 400, icon: Crown, raridade: "lendario",
      requerimento: "Exclusivo de Campeões da Arena PvP",
      desc: "Coroa dos guerreiros imbatíveis com brasão reluzente de honra.",
      badgeStyle: { background: "linear-gradient(135deg, #EC4899, #BE185D)", color: "#FFF", border: "1px solid #F472B6", boxShadow: "0 0 16px rgba(244,114,182,0.8)" }
    },

    // VANTAGENS & BOOSTS
    { id: "boost-2x-xp", tipo: "boost", nome: "Boost 2x de XP (24h) 🔥", preco: 200, icon: Flame, raridade: "comum", desc: "Dobrará todo o XP ganho em provas e batalhas pelas próximas 24 horas." },
    { id: "pacote-dicas", tipo: "dica", nome: "Pacote de 5 Dicas 💡", preco: 80, icon: Lightbulb, raridade: "comum", desc: "Desbloqueia dicas automáticas nas provas diárias e desafios de código." }
  ];

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (isOpen) {
      carregarCarteira();
    }
  }, [isOpen]);

  const carregarCarteira = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/gamificacao/carteira`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDevcoins(data.economia?.devcoins || 2500);
        setTemaAtivoId(data.economia?.tema_ativo || "padrao");
        setTituloAtivo(data.economia?.titulo_ativo || "Dev Aprendiz");
        setCompras((data.itensComprados || []).map(i => i.item_id));
      }
    } catch (e) {
      console.error("Erro ao carregar carteira:", e);
    }
  };

  const handleComprarOuEquipar = async (item) => {
    const jaComprou = compras.includes(item.id);

    if (jaComprou) {
      if (item.tipo === "tema") {
        setTemaAtivoId(item.id);
        // Persistir tema ativado no backend
        try {
          const token = localStorage.getItem("token");
          await fetch(`${apiUrl}/gamificacao/loja/equipar-tema`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ temaId: item.id })
          });
        } catch (err) {}
        if (onTemaEquipado) onTemaEquipado(item.id);
        setMensagemSucesso(`Tema "${item.nome}" equipado instantaneamente! ✨`);
      } else if (item.tipo === "avatar") {
        setAvatarAtivo(item.avatarUrl);
        setMensagemSucesso(`Avatar "${item.nome}" equipado no perfil! 🎭`);
      } else if (item.tipo === "titulo") {
        setTituloAtivo(item.nome);
        setMensagemSucesso(`Título "${item.nome}" equipado no perfil! 👑`);
      }
      setTimeout(() => setMensagemSucesso(""), 4000);
      return;
    }

    if (devcoins < item.preco) {
      alert(`⚠️ Você precisa de ${item.preco} DevCoins para resgatar este item.`);
      return;
    }

    setComprando(item.id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/gamificacao/loja/comprar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          itemId: item.id,
          itemTipo: item.tipo,
          itemNome: item.nome,
          preco: item.preco
        })
      });

      if (res.ok) {
        setDevcoins(prev => prev - item.preco);
        setCompras(prev => [...prev, item.id]);

        if (item.tipo === "tema") {
          setTemaAtivoId(item.id);
          if (onTemaEquipado) onTemaEquipado(item.id);
        }
        if (item.tipo === "avatar") setAvatarAtivo(item.avatarUrl);
        if (item.tipo === "titulo") setTituloAtivo(item.nome);

        setMensagemSucesso(`Parabéns! Você resgatou e equipou "${item.nome}" 🎉`);
        setTimeout(() => setMensagemSucesso(""), 4000);
      }
    } catch (e) {
      console.error("Erro ao efetuar compra:", e);
    } finally {
      setComprando(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
      zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
    }}>
      <div style={{
        backgroundColor: previewItem?.previewStyle ? previewItem.previewStyle.background : (colors?.bgCard || "#1E293B"),
        border: previewItem?.previewStyle ? previewItem.previewStyle.border : `1.5px solid ${colors?.borderCard || "rgba(255,255,255,0.1)"}`,
        boxShadow: previewItem?.previewStyle ? previewItem.previewStyle.boxShadow : "0 20px 50px rgba(0,0,0,0.5)",
        borderRadius: "24px", width: "100%", maxWidth: "900px", maxHeight: "90vh", overflowY: "auto",
        padding: "32px", color: previewItem?.previewStyle ? previewItem.previewStyle.color : (colors?.text || "#FFF"),
        position: "relative", transition: "all 0.3s ease"
      }}>
        {/* Fechar */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: colors?.textSecondary || "#94A3B8", cursor: "pointer" }}
        >
          <X size={24} />
        </button>

        {/* Header da Loja */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ padding: "10px", borderRadius: "14px", background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#FFF" }}>
                <ShoppingBag size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: "22px", fontWeight: "900", margin: 0 }}>🛒 Loja DevCoins — Coleção Expandida & Raros</h2>
                <span style={{ fontSize: "13px", opacity: 0.8 }}>Resgate temas raros, avatares gamer e títulos de conquista!</span>
              </div>
            </div>
          </div>

          {/* Card Saldo DevCoins */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px",
            borderRadius: "16px", background: "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.15))",
            border: "1.5px solid #F59E0B", boxShadow: "0 0 15px rgba(245,158,11,0.3)"
          }}>
            <Coins size={24} color="#F59E0B" />
            <div>
              <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "800", color: "#F59E0B", display: "block" }}>Seu Saldo</span>
              <strong style={{ fontSize: "18px", color: "#F59E0B" }}>{devcoins} DevCoins</strong>
            </div>
          </div>
        </div>

        {/* MODAL DE PRÉVIA EM TEMPO REAL COMPLETO DE CADA ITEM */}
        {previewItem && (
          <div style={{
            padding: "16px 20px", borderRadius: "18px", background: "rgba(255,255,255,0.08)",
            border: "1.5px solid rgba(255,255,255,0.25)", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              {previewItem.avatarUrl ? (
                <img src={previewItem.avatarUrl} alt="Preview" style={{ width: "50px", height: "50px", borderRadius: "12px", objectFit: "cover", border: "2px solid #FFF" }} />
              ) : (
                <div style={{ fontSize: "28px" }}>✨</div>
              )}
              <div>
                <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "800", opacity: 0.8 }}>Prévia de Demonstração</span>
                <h4 style={{ fontSize: "16px", fontWeight: "900", margin: "2px 0 0 0" }}>{previewItem.nome}</h4>
                <p style={{ fontSize: "12px", opacity: 0.8, margin: 0 }}>{previewItem.desc}</p>
                {previewItem.requerimento && (
                  <span style={{ fontSize: "11px", color: "#F59E0B", fontWeight: "800", marginTop: "4px", display: "block" }}>
                    🎯 Requisito Especial: {previewItem.requerimento}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setPreviewItem(null)}
              style={{ padding: "8px 16px", borderRadius: "10px", border: "none", backgroundColor: "rgba(255,255,255,0.2)", color: "#FFF", fontWeight: "800", cursor: "pointer", fontSize: "12px" }}
            >
              Fechar Prévia ✕
            </button>
          </div>
        )}

        {mensagemSucesso && (
          <div style={{
            padding: "14px 20px", borderRadius: "14px", backgroundColor: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.4)", color: "#10B981", fontWeight: "700", marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "10px"
          }}>
            <Sparkles size={20} />
            <span>{mensagemSucesso}</span>
          </div>
        )}

        {/* Grid de Itens */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
          {ITENS_LOJA.map(item => {
            const Icon = item.icon;
            const jaComprou = compras.includes(item.id);
            const semSaldo = !jaComprou && devcoins < item.preco;
            const estaEquipado = (item.tipo === "tema" && temaAtivoId === item.id) ||
                                (item.tipo === "avatar" && avatarAtivo === item.avatarUrl) ||
                                (item.tipo === "titulo" && tituloAtivo === item.nome);

            const isRaro = item.raridade === "raro" || item.raridade === "lendario";

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: item.previewStyle ? item.previewStyle.background : (isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC"),
                  border: estaEquipado ? "2px solid #10B981" : item.previewStyle ? item.previewStyle.border : isRaro ? "1.5px solid #F59E0B" : `1px solid ${colors?.borderCard || "rgba(255,255,255,0.08)"}`,
                  boxShadow: estaEquipado ? "0 0 15px rgba(16,185,129,0.3)" : item.previewStyle ? item.previewStyle.boxShadow : isRaro ? "0 0 12px rgba(245,158,11,0.25)" : "none",
                  borderRadius: "18px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between",
                  position: "relative", overflow: "hidden", transition: "transform 0.2s"
                }}
              >
                {/* Badge Raro / Lendário */}
                {isRaro && (
                  <div style={{
                    position: "absolute", top: "10px", right: "-30px", transform: "rotate(45deg)",
                    backgroundColor: item.raridade === "lendario" ? "#EC4899" : "#F59E0B", color: "#FFF",
                    fontSize: "9px", fontWeight: "900", padding: "3px 30px", textTransform: "uppercase"
                  }}>
                    {item.raridade}
                  </div>
                )}

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    {item.avatarUrl ? (
                      <img src={item.avatarUrl} alt="Avatar" style={{ width: "42px", height: "42px", borderRadius: "10px", objectFit: "cover", border: "1.5px solid #F59E0B" }} />
                    ) : (
                      <div style={{ padding: "8px", borderRadius: "10px", background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>
                        <Icon size={20} />
                      </div>
                    )}
                    <span style={{ fontSize: "14px", fontWeight: "900", color: "#F59E0B", display: "flex", alignItems: "center", gap: "4px" }}>
                      🪙 {item.preco}
                    </span>
                  </div>

                  <h4 style={{ fontSize: "15px", fontWeight: "800", marginBottom: "6px" }}>{item.nome}</h4>
                  
                  {/* Requisito de Item Raro */}
                  {item.requerimento && (
                    <div style={{ fontSize: "10.5px", color: "#F59E0B", fontWeight: "800", marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Star size={12} /> {item.requerimento}
                    </div>
                  )}

                  {/* Badge de título caso o item seja título */}
                  {item.badgeStyle && (
                    <div style={{ margin: "4px 0 8px 0" }}>
                      <span style={{ fontSize: "11px", fontWeight: "900", padding: "4px 10px", borderRadius: "12px", ...item.badgeStyle }}>
                        {item.nome}
                      </span>
                    </div>
                  )}

                  <p style={{ fontSize: "12px", opacity: 0.8, lineHeight: "1.4", marginBottom: "16px" }}>{item.desc}</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {/* Botão de Prévia do Item */}
                  <button
                    onClick={() => setPreviewItem(previewItem?.id === item.id ? null : item)}
                    style={{
                      width: "100%", padding: "8px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)",
                      backgroundColor: "rgba(255,255,255,0.08)", color: "inherit", fontWeight: "700", fontSize: "12px",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
                    }}
                  >
                    <Eye size={14} /> {previewItem?.id === item.id ? "Fechar Prévia" : "Ver Prévia do Item"}
                  </button>

                  <button
                    disabled={comprando === item.id}
                    onClick={() => handleComprarOuEquipar(item)}
                    style={{
                      width: "100%", padding: "10px", borderRadius: "12px", border: "none", fontWeight: "800", fontSize: "13px",
                      cursor: "pointer",
                      background: estaEquipado
                        ? "rgba(16,185,129,0.3)"
                        : jaComprou
                          ? "linear-gradient(135deg, #10B981, #059669)"
                          : "linear-gradient(135deg, #F59E0B, #D97706)",
                      color: estaEquipado ? "#10B981" : "#FFF",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
                    }}
                  >
                    {estaEquipado ? (
                      <>
                        <Check size={16} /> Item Equipado
                      </>
                    ) : jaComprou ? (
                      <>
                        <RefreshCw size={16} /> Equipar Item
                      </>
                    ) : (
                      comprando === item.id ? "Resgatando..." : "Resgatar Item"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
