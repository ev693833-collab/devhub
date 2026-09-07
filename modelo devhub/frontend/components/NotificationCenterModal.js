import React, { useState, useEffect } from "react";
import styles from "./NotificationCenterModal.module.css";
import { Bell, X, Calendar, Award, Code, CheckCircle, Sparkles, Check, CheckCheck } from "lucide-react";

const NOTIFICACOES_PADRAO = [
  {
    id: 1,
    tipo: "agenda",
    titulo: "Aula de React & Next.js Hoje!",
    texto: "Lembrete: Sua aula interativa de Next.js inicia às 19:30. Não se atrase!",
    tempo: "Há 25 minutos",
    lida: false
  },
  {
    id: 2,
    tipo: "conquista",
    titulo: "+50 DevCoins Conquistados!",
    texto: "Você completou o módulo de Estrutura de Dados no Caderno de Estudos.",
    tempo: "Há 2 horas",
    lida: false
  },
  {
    id: 3,
    tipo: "ia",
    titulo: "DevIA: Code Review Disponível",
    texto: "Seu relatório de análise de código da Batalha Dev já está pronto.",
    tempo: "Ontem",
    lida: false
  }
];

export default function NotificationCenterModal({ isOpen, onClose, onUpdateUnreadCount }) {
  const [notifications, setNotifications] = useState([]);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);

  // Carregar notificações salvas no localStorage no início
  useEffect(() => {
    try {
      const saved = localStorage.getItem("devhub_notifications");
      if (saved) {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
      } else {
        setNotifications(NOTIFICACOES_PADRAO);
        localStorage.setItem("devhub_notifications", JSON.stringify(NOTIFICACOES_PADRAO));
      }
    } catch (e) {
      console.error("Erro ao carregar notificações:", e);
      setNotifications(NOTIFICACOES_PADRAO);
    }
  }, []);

  // Notificar o pai sempre que a contagem de não lidas mudar
  useEffect(() => {
    const unread = notifications.filter(n => !n.lida).length;
    if (onUpdateUnreadCount) {
      onUpdateUnreadCount(unread);
    }
  }, [notifications, onUpdateUnreadCount]);

  if (!isOpen) return null;

  const salvarEAtualizar = (novas) => {
    setNotifications(novas);
    try {
      localStorage.setItem("devhub_notifications", JSON.stringify(novas));
    } catch (e) {
      console.error("Erro ao salvar notificações:", e);
    }
  };

  const marcarTodasLidas = () => {
    const atualizadas = notifications.map(n => ({ ...n, lida: true }));
    salvarEAtualizar(atualizadas);
    setMensagemSucesso("Todas as notificações foram marcadas como lidas! ✅");
    setTimeout(() => setMensagemSucesso(null), 3000);
  };

  const marcarItemComoLido = (id) => {
    const atualizadas = notifications.map(n => 
      n.id === id ? { ...n, lida: !n.lida } : n
    );
    salvarEAtualizar(atualizadas);
  };

  const getIcon = (tipo) => {
    switch (tipo) {
      case "agenda": return <Calendar size={16} color="#38bdf8" />;
      case "conquista": return <Award size={16} color="#f59e0b" />;
      case "ia": return <Sparkles size={16} color="#a855f7" />;
      default: return <Bell size={16} color="#6366f1" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.lida).length;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h4 className={styles.title}>
            <Bell size={18} /> Central de Notificações
            {unreadCount > 0 && (
              <span className={styles.unreadBadgeHeader}>
                {unreadCount} novas
              </span>
            )}
          </h4>
          <button className={styles.btnClose} onClick={onClose} title="Fechar">
            <X size={18} />
          </button>
        </div>

        {mensagemSucesso && (
          <div className={styles.toastSuccess}>
            {mensagemSucesso}
          </div>
        )}

        <div className={styles.list}>
          {notifications.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
              Nenhuma notificação no momento.
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id} 
                className={`${styles.item} ${!n.lida ? styles.itemUnread : styles.itemRead}`}
                onClick={() => marcarItemComoLido(n.id)}
                title="Clique para alternar o status de leitura"
              >
                <div className={styles.iconWrap} style={{ background: n.lida ? '#0f172a' : '#1e293b' }}>
                  {getIcon(n.tipo)}
                </div>
                <div className={styles.info}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <h5 className={`${styles.itemTitle} ${!n.lida ? styles.titleUnread : styles.titleRead}`}>
                      {n.titulo}
                    </h5>
                    {!n.lida ? (
                      <span className={styles.dotUnread} title="Não lida">🔵</span>
                    ) : (
                      <span className={styles.tagRead} title="Lida"><Check size={13} /> Lida</span>
                    )}
                  </div>
                  <p className={styles.itemText}>{n.texto}</p>
                  <span className={styles.itemTime}>{n.tempo}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <button 
            className={styles.btnMarkAll} 
            onClick={marcarTodasLidas}
            disabled={unreadCount === 0}
            style={{ opacity: unreadCount === 0 ? 0.5 : 1, cursor: unreadCount === 0 ? 'default' : 'pointer' }}
          >
            <CheckCheck size={16} /> Marcar todas como lidas
          </button>
        </div>
      </div>
    </div>
  );
}
