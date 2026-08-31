import { useState, useEffect } from "react";
import { X, Camera, Upload, Link, LogOut, Check, User } from "lucide-react";
import styles from "./PerfilModal.module.css";

export default function PerfilModal({ isOpen, onClose, user, onUpdateUser, onLogout }) {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [nome, setNome] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (user) {
      setAvatarUrl(user.avatar_url || user.avatar || "");
      setNome(user.nome || "");
    }
  }, [user]);

  if (!isOpen) return null;

  // Handler para upload de foto local (Base64 DataURL)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem deve ser menor que 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler para salvar edições
  const handleSalvarPerfil = (e) => {
    e.preventDefault();
    setSalvando(true);

    try {
      const userDataStr = localStorage.getItem("userData");
      let parsed = {};
      if (userDataStr) {
        parsed = JSON.parse(userDataStr);
      }

      const usuarioAtualizado = {
        ...parsed,
        ...user,
        nome: nome || user?.nome,
        avatar_url: avatarUrl,
        avatar: avatarUrl
      };

      // Atualizar localStorage
      localStorage.setItem("userData", JSON.stringify(usuarioAtualizado));

      // Notificar o pai (Dashboard)
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
      alert("Erro ao salvar perfil.");
    } finally {
      setSalvando(false);
    }
  };

  const initial = user?.nome ? user.nome.charAt(0).toUpperCase() : "U";
  const cargoLabel = user?.cargo === "super_admin" ? "Super Admin 👑" : user?.cargo === "admin" ? "Admin 🛡️" : "Estudante 👤";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} title="Fechar">
          <X size={18} />
        </button>

        {/* Informações Atuais do Usuário */}
        <div className={styles.userHeader}>
          <div className={styles.avatarWrapper}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Foto de perfil" className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarPlaceholder}>{initial}</div>
            )}
            <label className={styles.uploadBadge} title="Alterar foto de perfil">
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <h3 className={styles.userName}>{user?.nome || "Usuário"}</h3>
          <span className={styles.userEmail}>{user?.email || "email@exemplo.com"}</span>
          <span className={styles.userBadge}>{cargoLabel}</span>
        </div>

        {/* Formulário de Alteração de Foto / Nome */}
        <form onSubmit={handleSalvarPerfil}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#94a3b8", marginBottom: "8px" }}>
                Nome de Exibição
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backgroundColor: "rgba(0,0,0,0.25)",
                  color: "#FFFFFF",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#94a3b8", marginBottom: "8px" }}>
                Foto de Perfil
              </label>
              <div className={styles.uploadBox}>
                <label className={styles.fileInputLabel}>
                  <Upload size={16} />
                  <span>Escolher Foto do Dispositivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
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
                "Salvar Alterações"
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
