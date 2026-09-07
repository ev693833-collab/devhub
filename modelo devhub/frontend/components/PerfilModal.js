import { useState, useEffect } from "react";
import { X, Camera, Upload, LogOut, Check, User, Sparkles, RefreshCw, Crown, Palette, Lock, ShieldAlert } from "lucide-react";
import styles from "./PerfilModal.module.css";

export default function PerfilModal({ isOpen, onClose, user, onUpdateUser, onLogout, onTemaEquipado }) {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [nome, setNome] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Inventário do Usuário
  const [compras, setCompras] = useState([]);
  const [temaAtivo, setTemaAtivo] = useState("padrao");
  const [tituloAtivo, setTituloAtivo] = useState("Dev Aprendiz");
  const [notificacaoTema, setNotificacaoTema] = useState("");

  // Lista de Temas com identificação para equipar direto do Inventário do Perfil
  const TEMAS_MAPA = {
    "padrao": { nome: "Tema Padrão DevHub", styleName: "Padrão" },
    "tema-cyberpunk": { nome: "Tema Cyberpunk Neon 🌌", styleName: "Cyberpunk Neon" },
    "tema-matrix": { nome: "Tema Matrix Code 🟢", styleName: "Matrix Hacker" },
    "tema-gold-luxury": { nome: "Tema Gold Luxury 👑", styleName: "Gold Luxury" },
    "tema-synthwave": { nome: "Tema Synthwave Sunset 🌅", styleName: "Synthwave Sunset" },
    "tema-raro-dragon": { nome: "Tema Raro: Chama Dracônica 🐉🔥", styleName: "Chama Dracônica" },
    "tema-raro-quantum": { nome: "Tema Lendário: Núcleo Quântico ⚛️✨", styleName: "Núcleo Quântico" }
  };


  // Títulos Disponíveis para Troca no Perfil
  const TITULOS_OPCOES = [
    { id: "Dev Aprendiz", nome: "Dev Aprendiz 🌱", style: { background: "rgba(255,255,255,0.1)", color: "#FFF", border: "1px solid rgba(255,255,255,0.2)" } },
    { id: "⚡ Deus do Full Stack", nome: "⚡ Deus do Full Stack", style: { background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#FFF", border: "1px solid #FBBF24", boxShadow: "0 0 12px rgba(245,158,11,0.6)" } },
    { id: "🎯 Caçador de Bugs", nome: "🎯 Caçador de Bugs", style: { background: "linear-gradient(135deg, #EF4444, #991B1B)", color: "#FFF", border: "1px solid #F87171", boxShadow: "0 0 12px rgba(239,68,68,0.6)" } },
    { id: "🥷 Code Ninja Supremo", nome: "🥷 Code Ninja Supremo", style: { background: "linear-gradient(135deg, #8B5CF6, #4C1D95)", color: "#FFF", border: "1px solid #C084FC", boxShadow: "0 0 12px rgba(168,85,247,0.6)" } },
    { id: "🏗️ Arquiteto Sênior", nome: "🏗️ Arquiteto Sênior", style: { background: "linear-gradient(135deg, #3B82F6, #1E3A8A)", color: "#FFF", border: "1px solid #60A5FA", boxShadow: "0 0 12px rgba(59,130,246,0.6)" } },
    { id: "🏆 Campeão Invicto de Batalha", nome: "🏆 Campeão Invicto", style: { background: "linear-gradient(135deg, #EC4899, #BE185D)", color: "#FFF", border: "1px solid #F472B6", boxShadow: "0 0 12px rgba(244,114,182,0.6)" } },
    { id: "🔮 Mestre dos Algoritmos", nome: "🔮 Mestre Algorítmico", style: { background: "linear-gradient(135deg, #6366F1, #3730A3)", color: "#FFF", border: "1px solid #818CF8", boxShadow: "0 0 12px rgba(99,102,241,0.6)" } }
  ];

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (user) {
      setAvatarUrl(user.avatar_url || user.avatar || "");
      setNome(user.nome || "");
      carregarInventario();
    }
  }, [user, isOpen]);

  const carregarInventario = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${apiUrl}/gamificacao/carteira`, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data) {
          setCompras(data.itensComprados || []);
          setTemaAtivo(data.economia?.tema_ativo || "padrao");
          setTituloAtivo(data.economia?.titulo_ativo || "Dev Aprendiz");
        }
      }
    } catch (e) {
      console.error("Erro ao carregar inventário no perfil:", e);
    }
  };

  const handleEquiparTemaDirect = async (temaId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${apiUrl}/gamificacao/loja/equipar-tema`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ temaId })
      }).catch(() => null);

      if (res && res.ok) {
        setTemaAtivo(temaId);
        setNotificacaoTema(`✨ ${TEMAS_MAPA[temaId]?.nome || temaId} equipado com sucesso!`);
        setTimeout(() => setNotificacaoTema(""), 4000);
        // Notifica o dashboard para atualizar o tema visualmente em tempo real
        if (onTemaEquipado) onTemaEquipado(temaId);
      }
    } catch (e) {
      console.error("Erro ao equipar tema direto do inventário:", e);
    }
  };

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("A imagem deve ser menor que 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Compressão inteligente para 250x250px max (otimizado para avatares leves)
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 250;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Converter para dataURL super otimizado
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setAvatarUrl(compressedDataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvarPerfil = async (e) => {
    e.preventDefault();
    setSalvando(true);

    try {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await fetch(`${apiUrl}/auth/perfil`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              nome: nome || user?.nome,
              avatar_url: avatarUrl
            })
          });
        } catch (netErr) {
          console.warn("Aviso ao sincronizar foto com o servidor (salvo localmente):", netErr);
        }
      }

      const userDataStr = localStorage.getItem("userData");
      let parsed = {};
      if (userDataStr) {
        try {
          parsed = JSON.parse(userDataStr);
        } catch (e) {}
      }

      const usuarioAtualizado = {
        ...parsed,
        ...user,
        nome: nome || user?.nome,
        avatar_url: avatarUrl,
        avatar: avatarUrl,
        titulo_ativo: tituloAtivo
      };

      localStorage.setItem("userData", JSON.stringify(usuarioAtualizado));

      if (onUpdateUser) {
        onUpdateUser(usuarioAtualizado);
      }

      setSucesso(true);
      setTimeout(() => {
        setSucesso(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
    } finally {
      setSalvando(false);
    }
  };

  const initial = user?.nome ? user.nome.charAt(0).toUpperCase() : "U";
  const isImageAvatar = avatarUrl && (avatarUrl.startsWith("data:") || avatarUrl.startsWith("http") || avatarUrl.startsWith("/img/"));
  const tituloAtualInfo = TITULOS_OPCOES.find(t => t.id === tituloAtivo) || TITULOS_OPCOES[0];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} style={{ maxWidth: "620px", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} title="Fechar">
          <X size={18} />
        </button>

        {/* Header do Usuário com Moldura Gamer e Ilustração */}
        <div className={styles.userHeader}>
          <div className={styles.avatarWrapper}>
            {isImageAvatar ? (
              <img 
                src={avatarUrl} 
                alt="Foto de perfil" 
                className={styles.avatarImg} 
                style={{ border: "2px solid #60A5FA", boxShadow: "0 0 20px rgba(59,130,246,0.5)" }}
              />
            ) : avatarUrl ? (
              <div 
                className={styles.avatarPlaceholder} 
                style={{ fontSize: "36px", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", border: "2px solid #60A5FA", boxShadow: "0 0 20px rgba(59,130,246,0.5)" }}
              >
                {avatarUrl}
              </div>
            ) : (
              <div className={styles.avatarPlaceholder}>{initial}</div>
            )}
            <label className={styles.uploadBadge} title="Carregar imagem do dispositivo">
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <h3 className={styles.userName}>{nome || "Usuário"}</h3>
          
          {/* Badge do Título com Efeito Cromatico */}
          <span style={{
            fontSize: "12px", fontWeight: "900", padding: "5px 16px", borderRadius: "14px", marginTop: "6px",
            display: "inline-flex", alignItems: "center", gap: "6px", ...tituloAtualInfo.style
          }}>
            👑 {tituloAtualInfo.nome}
          </span>
          <span className={styles.userEmail} style={{ marginTop: "6px" }}>{user?.email || "email@exemplo.com"}</span>
        </div>

        {notificacaoTema && (
          <div style={{
            padding: "12px 18px", borderRadius: "14px", backgroundColor: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.4)", color: "#10B981", fontWeight: "800", fontSize: "13px",
            marginBottom: "16px", textAlign: "center"
          }}>
            {notificacaoTema}
          </div>
        )}

        {/* FORMULÁRIO DE CUSTOMIZAÇÃO */}
        <form onSubmit={handleSalvarPerfil}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
            
            {/* SELETOR DE TÍTULO DE REPUTAÇÃO DO PERFIL */}
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", color: "#F59E0B", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Crown size={16} /> Escolher Título & Reputação do Perfil
              </label>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {TITULOS_OPCOES.map(tit => {
                  const isSelected = tituloAtivo === tit.id;
                  return (
                    <button
                      key={tit.id}
                      type="button"
                      onClick={() => setTituloAtivo(tit.id)}
                      style={{
                        padding: "8px 14px", borderRadius: "12px", fontSize: "12px", fontWeight: "800",
                        cursor: "pointer", border: isSelected ? "2px solid #FFF" : "1px solid rgba(255,255,255,0.1)",
                        opacity: isSelected ? 1 : 0.65,
                        transform: isSelected ? "scale(1.04)" : "scale(1)",
                        transition: "all 0.2s",
                        ...tit.style
                      }}
                    >
                      {tit.nome} {isSelected && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FOTO DE PERFIL - UPLOAD PERSONALIZADO */}
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", color: "#94a3b8", marginBottom: "10px" }}>
                📸 Foto de Perfil
              </label>
              
              <div className={styles.uploadBox}>
                <label className={styles.fileInputLabel}>
                  <Upload size={16} />
                  <span>Enviar Foto do Dispositivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>

            {/* SEÇÃO INVENTÁRIO COM BOTÃO EQUIPAR / DESEQUIPAR TEMAS COMPRADOS */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "800", textTransform: "uppercase", color: "#3B82F6", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={16} /> Meu Inventário ({compras.length} itens adquiridos)
              </label>

              {compras.length === 0 ? (
                <div style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic", textAlign: "center", padding: "12px", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "10px" }}>
                  Você ainda não resgatou nenhum item na Loja DevCoins.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "180px", overflowY: "auto" }}>
                  {/* Tema Padrão do Sistema */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "12px",
                    backgroundColor: "rgba(255,255,255,0.04)", border: temaAtivo === "padrao" ? "1.5px solid #10B981" : "1px solid rgba(255,255,255,0.08)"
                  }}>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#FFF" }}>🎨 Tema Padrão DevHub</span>
                    <button
                      type="button"
                      onClick={() => handleEquiparTemaDirect("padrao")}
                      style={{
                        padding: "6px 16px", borderRadius: "10px", fontWeight: "800", fontSize: "12px", cursor: "pointer",
                        background: temaAtivo === "padrao" ? "rgba(16,185,129,0.2)" : "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                        color: temaAtivo === "padrao" ? "#34D399" : "#FFFFFF",
                        border: temaAtivo === "padrao" ? "1px solid #10B981" : "none",
                        boxShadow: temaAtivo === "padrao" ? "none" : "0 4px 12px rgba(59,130,246,0.3)"
                      }}
                    >
                      {temaAtivo === "padrao" ? "✓ Equipado" : "Equipar"}
                    </button>
                  </div>

                  {compras.map((item, idx) => {
                    const isTema = item.item_tipo === "tema" || item.item_id.startsWith("tema-");
                    const estaEquipado = temaAtivo === item.item_id;

                    return (
                      <div key={idx} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "12px",
                        backgroundColor: "rgba(255,255,255,0.04)", border: estaEquipado ? "1.5px solid #10B981" : "1px solid rgba(255,255,255,0.08)"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "13px", fontWeight: "700", color: "#FFF" }}>{item.item_nome}</span>
                          {isTema && <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "6px", background: "rgba(59,130,246,0.2)", color: "#60A5FA", fontWeight: "800" }}>TEMA</span>}
                        </div>

                        {isTema ? (
                          <button
                            type="button"
                            onClick={() => handleEquiparTemaDirect(item.item_id)}
                            style={{
                              padding: "6px 16px", borderRadius: "10px", fontWeight: "800", fontSize: "12px", cursor: "pointer",
                              background: estaEquipado ? "rgba(16,185,129,0.2)" : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                              color: estaEquipado ? "#34D399" : "#FFFFFF",
                              border: estaEquipado ? "1px solid #10B981" : "none",
                              boxShadow: estaEquipado ? "none" : "0 4px 12px rgba(16,185,129,0.3)"
                            }}
                          >
                            {estaEquipado ? "✓ Equipado" : "Equipar Tema"}
                          </button>
                        ) : (
                          <span style={{ fontSize: "11px", fontWeight: "800", color: "#10B981" }}>Adquirido</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn} disabled={salvando}>
              {sucesso ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <Check size={18} /> Salvo com Sucesso!
                </span>
              ) : salvando ? (
                "Salvando..."
              ) : (
                "Salvar Alterações no Perfil"
              )}
            </button>

            <button type="button" className={styles.logoutBtn} onClick={onLogout}>
              <LogOut size={16} />
              <span>Sair da Conta (Logout)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
