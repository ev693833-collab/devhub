import { useState, useEffect } from "react";
import { X, Camera, Upload, LogOut, Check, Crown, Image as ImageIcon } from "lucide-react";
import styles from "./PerfilModal.module.css";

export default function PerfilModal({ isOpen, onClose, user, onUpdateUser, onLogout }) {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [nome, setNome] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("titulos");
  const [tituloAtivo, setTituloAtivo] = useState("Dev Aprendiz");

  // Títulos Disponíveis para Troca no Perfil
  const TITULOS_OPCOES = [
    {
      id: "Dev Aprendiz",
      nome: "Dev Aprendiz 🌱",
      desc: "Iniciando a jornada no DevHub",
      style: { background: "rgba(255, 255, 255, 0.05)", color: "#E2E8F0", border: "1px solid rgba(255, 255, 255, 0.12)" }
    },
    {
      id: "⚡ Deus do Full Stack",
      nome: "Deus do Full Stack ⚡",
      desc: "Domínio total de Frontend & Backend",
      style: { background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.2))", color: "#FBBF24", border: "1px solid rgba(245, 158, 11, 0.4)" }
    },
    {
      id: "🎯 Caçador de Bugs",
      nome: "Caçador de Bugs 🎯",
      desc: "Eliminador implacável de exceções",
      style: { background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(153, 27, 27, 0.2))", color: "#F87171", border: "1px solid rgba(239, 68, 68, 0.4)" }
    },
    {
      id: "🥷 Code Ninja Supremo",
      nome: "Code Ninja Supremo 🥷",
      desc: "Mestre na arte do código oculto",
      style: { background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(76, 29, 149, 0.2))", color: "#C084FC", border: "1px solid rgba(168, 85, 247, 0.4)" }
    },
    {
      id: "🏗️ Arquiteto Sênior",
      nome: "Arquiteto Sênior 🏗️",
      desc: "Projeta ecossistemas escaláveis",
      style: { background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(30, 58, 138, 0.2))", color: "#60A5FA", border: "1px solid rgba(59, 130, 246, 0.4)" }
    },
    {
      id: "🏆 Campeão Invicto de Batalha",
      nome: "Campeão Invicto 🏆",
      desc: "Imbatível nas arenas de código",
      style: { background: "linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(190, 24, 93, 0.2))", color: "#F472B6", border: "1px solid rgba(244, 114, 182, 0.4)" }
    },
    {
      id: "🔮 Mestre dos Algoritmos",
      nome: "Mestre Algorítmico 🔮",
      desc: "Soluções elegantes em O(1)",
      style: { background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(55, 48, 163, 0.2))", color: "#818CF8", border: "1px solid rgba(99, 102, 241, 0.4)" }
    }
  ];

  // Galeria de Avatares Dev Preset Estilizados
  const AVATARES_PRESET = [
    { id: "dev1", nome: "Cyber Bot", url: "https://api.dicebear.com/7.x/bottts/svg?seed=CyberCoderPro&backgroundColor=0f172a" },
    { id: "dev2", nome: "Code Ninja", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=CodeNinjaHero&backgroundColor=1e1b4b" },
    { id: "dev3", nome: "Tech Wizard", url: "https://api.dicebear.com/7.x/micah/svg?seed=TechWizardPro&backgroundColor=172554" },
    { id: "dev4", nome: "AI Master", url: "https://api.dicebear.com/7.x/bottts/svg?seed=AIBotMaster&backgroundColor=31104b" },
    { id: "dev5", nome: "Fullstack Dev", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=FullstackArchitect&backgroundColor=064e3b" },
    { id: "dev6", nome: "Frontend Queen", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=FrontendQueen&backgroundColor=4c0519" },
    { id: "dev7", nome: "Quantum Hacker", url: "https://api.dicebear.com/7.x/bottts/svg?seed=QuantumHacker&backgroundColor=042f2e" },
    { id: "dev8", nome: "Neon Architect", url: "https://api.dicebear.com/7.x/micah/svg?seed=NeonArchitect&backgroundColor=31104b" }
  ];


  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (user) {
      setAvatarUrl(user.avatar_url || user.avatar || "");
      setNome(user.nome || "");
      setTituloAtivo(user.titulo_ativo || "Dev Aprendiz");
    }
  }, [user]);

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
      }, 900);
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
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} title="Fechar modal">
          <X size={18} />
        </button>

        {/* User Header Info & Banner Incorporado */}
        <div className={styles.bannerHeader}>
          <div className={styles.avatarWrapper}>
            {isImageAvatar ? (
              <img 
                src={avatarUrl} 
                alt="Foto de perfil" 
                className={styles.avatarImg} 
              />
            ) : avatarUrl ? (
              <div className={styles.avatarPlaceholder}>
                {avatarUrl}
              </div>
            ) : (
              <div className={styles.avatarPlaceholder}>{initial}</div>
            )}
            
            <label className={styles.uploadBadge} title="Alterar Foto de Perfil">
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
          
          {/* Active Title Pill */}
          <span 
            className={styles.activeBadgePill}
            style={tituloAtualInfo.style}
          >
            👑 {tituloAtualInfo.nome}
          </span>
          <span className={styles.userEmail}>{user?.email || "usuario@devhub.com"}</span>
        </div>

        {/* Tab Navigation (Apenas 2 Abas: Títulos & Foto) */}
        <div className={styles.navTabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${abaAtiva === "titulos" ? styles.tabBtnActive : ""}`}
            onClick={() => setAbaAtiva("titulos")}
          >
            <Crown size={15} />
            <span>Títulos & Reputação</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${abaAtiva === "foto" ? styles.tabBtnActive : ""}`}
            onClick={() => setAbaAtiva("foto")}
          >
            <ImageIcon size={15} />
            <span>Foto de Perfil</span>
          </button>
        </div>

        {/* Form Outer Wrapper */}
        <form onSubmit={handleSalvarPerfil} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div className={styles.bodyContent}>
            
            {/* TAB 1: TÍTULOS & REPUTAÇÃO */}
            {abaAtiva === "titulos" && (
              <div>
                <label className={styles.sectionTitle}>
                  <Crown size={16} /> Escolha seu Título de Perfil
                </label>

                <div className={styles.titlesGrid}>
                  {TITULOS_OPCOES.map((tit) => {
                    const isSelected = tituloAtivo === tit.id;
                    return (
                      <div
                        key={tit.id}
                        onClick={() => setTituloAtivo(tit.id)}
                        className={`${styles.titleCard} ${isSelected ? styles.titleCardSelected : ""}`}
                        style={tit.style}
                      >
                        <div className={styles.titleCardHeader}>
                          <span className={styles.titleCardName}>{tit.nome}</span>
                          {isSelected && (
                            <span className={styles.checkIcon}>
                              <Check size={12} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                        <span className={styles.titleCardDesc}>{tit.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: FOTO DE PERFIL */}
            {abaAtiva === "foto" && (
              <div className={styles.uploadContainer}>
                {/* GALERIA DE AVATARES PRESET */}
                <label className={styles.sectionTitle}>
                  <Crown size={16} /> Galeria de Avatares Dev (Escolha Rápida)
                </label>
                
                <div className={styles.avatarGrid}>
                  {AVATARES_PRESET.map((av) => {
                    const isSelected = avatarUrl === av.url;
                    return (
                      <div
                        key={av.id}
                        className={`${styles.avatarOption} ${isSelected ? styles.avatarOptionSelected : ""}`}
                        onClick={() => setAvatarUrl(av.url)}
                        title={av.nome}
                      >
                        <img src={av.url} alt={av.nome} className={styles.avatarOptionImg} />
                        <span className={styles.avatarOptionName}>{av.nome}</span>
                        {isSelected && (
                          <div className={styles.avatarOptionCheck}>
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* UPLOAD DE FOTO PRÓPRIA */}
                <label className={styles.sectionTitle} style={{ marginTop: "22px" }}>
                  <ImageIcon size={16} /> Ou Envie Sua Foto Personalizada
                </label>

                <div className={styles.uploadBox}>
                  <div className={styles.uploadIconCircle}>
                    <Upload size={22} />
                  </div>
                  <div className={styles.uploadText}>
                    Enviar Foto do Seu Dispositivo
                  </div>
                  <div className={styles.uploadHint}>
                    Formatos suportados: PNG, JPG ou WEBP (Máx: 10MB)
                  </div>

                  <label className={styles.fileInputLabel}>
                    <Camera size={16} />
                    <span>Escolher Arquivo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Actions Footer Bar */}
          <div className={styles.actions}>
            <button 
              type="submit" 
              className={`${styles.saveBtn} ${sucesso ? styles.saveBtnSuccess : ""}`}
              disabled={salvando}
            >
              {sucesso ? (
                <>
                  <Check size={18} strokeWidth={3} /> Salvo com Sucesso!
                </>
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
