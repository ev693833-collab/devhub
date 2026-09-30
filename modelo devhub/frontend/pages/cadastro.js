import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ type, message, duration = 2500, onDone }) {
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(false);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    startRef.current = performance.now();
    const tick = (now) => {
      const pct = Math.max(0, 100 - ((now - startRef.current) / duration) * 100);
      setProgress(pct);
      if (pct > 0) rafRef.current = requestAnimationFrame(tick);
      else { setVisible(false); setTimeout(onDone, 350); }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const ok = type === "success";
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 99999,
      minWidth: 320, maxWidth: 400, borderRadius: 18, overflow: "hidden",
      background: ok ? "linear-gradient(135deg,#0d1f17,#0f2318)" : "linear-gradient(135deg,#1f0d0d,#230f0f)",
      border: `1.5px solid ${ok ? "rgba(16,185,129,.35)" : "rgba(239,68,68,.35)"}`,
      boxShadow: `0 20px 60px rgba(0,0,0,.7),0 0 40px ${ok ? "rgba(16,185,129,.15)" : "rgba(239,68,68,.15)"}`,
      transform: visible ? "translateY(0) scale(1)" : "translateY(-20px) scale(.95)",
      opacity: visible ? 1 : 0,
      transition: "transform .35s cubic-bezier(.16,1,.3,1),opacity .35s ease",
      fontFamily: "'Inter',system-ui,sans-serif"
    }}>
      <div style={{ padding: "18px 20px 14px", display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
          background: ok ? "rgba(16,185,129,.15)" : "rgba(239,68,68,.15)",
          border: `1.5px solid ${ok ? "rgba(16,185,129,.4)" : "rgba(239,68,68,.4)"}`,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {ok
            ? <svg width="18" height="18" fill="none" stroke="#10B981" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            : <svg width="18" height="18" fill="none" stroke="#EF4444" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>}
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 3 }}>
            {ok ? "Conta criada!" : "Erro no cadastro"}
          </p>
          <p style={{ fontSize: 13, fontWeight: 500, color: ok ? "rgba(110,231,183,.85)" : "rgba(252,165,165,.85)", lineHeight: 1.5 }}>
            {message}
          </p>
        </div>
      </div>
      <div style={{ height: 3, background: "rgba(255,255,255,.06)" }}>
        <div style={{
          height: "100%", width: `${progress}%`,
          background: ok ? "linear-gradient(90deg,#10B981,#34D399)" : "linear-gradient(90deg,#EF4444,#F87171)",
          borderRadius: "0 2px 2px 0", transition: "width .05s linear"
        }}/>
      </div>
    </div>
  );
}


// ── Main ──────────────────────────────────────────────────────────────────────
export default function Cadastro() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setCardVisible(true), 80);
  }, []);

  const showToast = (type, message) => setToast({ type, message });

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim()) { showToast("error", "Informe seu nome completo."); return; }
    if (!email.trim() || !validateEmail(email.trim())) { showToast("error", "E-mail inválido."); return; }
    if (!senha) { showToast("error", "Digite uma senha."); return; }
    if (senha.length < 6) { showToast("error", "A senha precisa ter pelo menos 6 caracteres."); return; }
    if (senha !== confirmarSenha) { showToast("error", "As senhas não coincidem."); return; }

    setLoading(true);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${api}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome.trim(), email: email.trim(), senha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao cadastrar.");
      showToast("success", "Conta criada! Redirecionando para o login...");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      let msg = err.message || "Erro ao efetuar cadastro.";
      if (msg === "Failed to fetch") msg = "Não foi possível conectar ao servidor.";
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ open }) => open
    ? <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>
    : <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>;

  return (
    <>
      <Head>
        <title>Criar Conta — DevHub</title>
        <meta name="description" content="Crie sua conta DevHub e comece sua jornada como dev." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: #050508; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes logoPulse {
          0%,100% { filter: drop-shadow(0 0 18px rgba(139,92,246,.7)) drop-shadow(0 0 6px rgba(59,130,246,.5)); }
          50%      { filter: drop-shadow(0 0 30px rgba(139,92,246,1))  drop-shadow(0 0 12px rgba(59,130,246,.9)); }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 40px rgba(139,92,246,.15), 0 32px 80px rgba(0,0,0,.8); }
          50%      { box-shadow: 0 0 60px rgba(139,92,246,.28), 0 32px 80px rgba(0,0,0,.8); }
        }

        .reg-page {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          font-family: 'Inter', system-ui, sans-serif;
          padding: 32px 16px;
          position: relative; z-index: 1;
        }

        .card-wrap {
          width: 100%; max-width: 460px;
          opacity: 0; transform: translateY(32px) scale(.97);
          transition: opacity .55s cubic-bezier(.16,1,.3,1), transform .55s cubic-bezier(.16,1,.3,1);
        }
        .card-wrap.visible { opacity: 1; transform: translateY(0) scale(1); }

        .logo-block {
          display: flex; flex-direction: column; align-items: center;
          gap: 14px; margin-bottom: 28px;
        }
        .logo-img { animation: logoPulse 3s ease-in-out infinite; }
        .logo-name {
          font-size: 13px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: rgba(255,255,255,.35);
        }

        .card-title {
          font-size: 28px; font-weight: 900; color: #FFFFFF;
          text-align: center; line-height: 1.15; margin-bottom: 8px;
          letter-spacing: -.5px;
        }
        .card-sub {
          font-size: 14px; color: rgba(255,255,255,.4); font-weight: 500;
          text-align: center; margin-bottom: 32px;
        }

        .glass-card {
          background: rgba(10,10,20,.72);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(139,92,246,.22);
          border-radius: 24px;
          padding: 36px 36px;
          animation: glowPulse 4s ease-in-out infinite;
          position: relative; overflow: hidden;
        }
        .glass-card::before {
          content: ''; position: absolute; inset: 0; border-radius: 24px;
          background: linear-gradient(135deg,rgba(139,92,246,.06) 0%,transparent 60%);
          pointer-events: none;
        }

        .form-group { margin-bottom: 18px; }
        .form-label {
          display: block; font-size: 12.5px; font-weight: 700;
          color: rgba(255,255,255,.55); margin-bottom: 9px;
          letter-spacing: .5px; text-transform: uppercase;
        }
        .input-wrap { position: relative; }
        .form-input {
          width: 100% !important; padding: 13px 18px !important;
          background: rgba(13, 15, 29, 0.92) !important;
          border: 1.5px solid rgba(139, 92, 246, 0.35) !important;
          border-radius: 13px !important; color: #FFFFFF !important;
          font-size: 14.5px !important; font-family: inherit !important; outline: none !important;
          transition: all .2s ease !important;
        }
        .form-input::placeholder { color: rgba(255,255,255,.35) !important; }
        .form-input:focus {
          border-color: rgba(139,92,246,.85) !important;
          background: rgba(139,92,246,.15) !important;
          box-shadow: 0 0 0 4px rgba(139,92,246,.25) !important;
        }
        .form-input:-webkit-autofill,
        .form-input:-webkit-autofill:hover,
        .form-input:-webkit-autofill:focus,
        .form-input:-webkit-autofill:active {
          -webkit-text-fill-color: #ffffff !important;
          transition: background-color 50000s ease-in-out 0s !important;
          box-shadow: 0 0 0px 1000px #0d0f1d inset !important;
          border-color: rgba(139, 92, 246, 0.4) !important;
        }
        .form-input.pr { padding-right: 52px; }

        .eye-btn {
          position: absolute; right: 15px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,.3); display: flex; align-items: center;
          transition: color .2s; padding: 4px;
        }
        .eye-btn:hover { color: rgba(255,255,255,.7); }

        .btn-main {
          width: 100%; padding: 15px; border-radius: 13px; border: none;
          cursor: pointer; font-size: 15.5px; font-weight: 800;
          font-family: inherit; color: #FFFFFF;
          background: linear-gradient(135deg,#7C3AED,#4F46E5);
          box-shadow: 0 8px 28px rgba(109,40,217,.5);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all .25s ease; letter-spacing: .2px;
          position: relative; overflow: hidden;
        }
        .btn-main::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg,rgba(255,255,255,.12),transparent);
          opacity: 0; transition: opacity .25s;
        }
        .btn-main:hover:not(:disabled)::after { opacity: 1; }
        .btn-main:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(109,40,217,.65);
        }
        .btn-main:active:not(:disabled) { transform: translateY(0); }
        .btn-main:disabled { opacity: .65; cursor: not-allowed; }
        .spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        .divider {
          display: flex; align-items: center; gap: 14px;
          margin: 22px 0; color: rgba(255,255,255,.15);
          font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
        }
        .divider::before,.divider::after { content:''; flex:1; height:1px; background: rgba(255,255,255,.08); }

        .card-footer {
          text-align: center; font-size: 13.5px;
          color: rgba(255,255,255,.35); font-weight: 500;
        }
        .card-footer a { color: #A78BFA; font-weight: 700; text-decoration: none; transition: color .2s; }
        .card-footer a:hover { color: #C4B5FD; }

        .terms {
          text-align: center; margin-top: 24px;
          font-size: 12px; color: rgba(255,255,255,.2); font-weight: 500;
        }
        .terms a { color: rgba(167,139,250,.6); text-decoration: none; transition: color .2s; }
        .terms a:hover { color: #A78BFA; }

        .back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 32px; font-size: 13px; font-weight: 700;
          color: rgba(255,255,255,.4); text-decoration: none;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.1);
          padding: 9px 18px; border-radius: 50px;
          transition: all .25s ease; backdrop-filter: blur(8px);
        }
        .back-btn:hover {
          color: #fff; background: rgba(139,92,246,.15);
          border-color: rgba(139,92,246,.45);
          box-shadow: 0 4px 20px rgba(139,92,246,.2);
          transform: translateY(-1px);
        }

        @media (max-width: 500px) {
          .glass-card { padding: 28px 20px; }
          .card-title { font-size: 24px; }
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={toast.type === "success" ? 2500 : 3500}
          onDone={() => setToast(null)}
        />
      )}

      <div className="reg-page">
        <div className={`card-wrap ${cardVisible ? "visible" : ""}`}>

          {/* Logo */}
          <div className="logo-block">
            <img
              src="/img/devhub_logo_emblem.png?v=5"
              alt="DevHub"
              className="logo-img"
              style={{ height: 54, width: "auto" }}
            />
            <span className="logo-name">DevHub Platform</span>
          </div>

          <h1 className="card-title">Crie sua conta ✨</h1>
          <p className="card-sub">Preencha os dados abaixo para se cadastrar na plataforma.</p>

          {/* Card */}
          <div className="glass-card">
            <form onSubmit={handleSubmit} noValidate autoComplete="off">

              {/* Nome */}
              <div className="form-group">
                <label className="form-label" htmlFor="nome">Nome Completo</label>
                <div className="input-wrap">
                  <input
                    id="nome" type="text" className="form-input"
                    placeholder="Seu nome completo" value={nome}
                    onChange={e => setNome(e.target.value)} autoComplete="off"
                  />
                </div>
              </div>

              {/* E-mail */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">E-mail</label>
                <div className="input-wrap">
                  <input
                    id="email" type="email" className="form-input"
                    placeholder="seu@email.com" value={email}
                    onChange={e => setEmail(e.target.value)} autoComplete="off"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="form-group">
                <label className="form-label" htmlFor="senha">Senha</label>
                <div className="input-wrap">
                  <input
                    id="senha"
                    type={mostrarSenha ? "text" : "password"}
                    className="form-input pr"
                    placeholder="Mínimo de 6 caracteres"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button type="button" className="eye-btn" onClick={() => setMostrarSenha(!mostrarSenha)}>
                    <EyeIcon open={mostrarSenha} />
                  </button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div className="form-group" style={{ marginBottom: 26 }}>
                <label className="form-label" htmlFor="confirmar">Confirmar Senha</label>
                <div className="input-wrap">
                  <input
                    id="confirmar"
                    type={mostrarConfirmar ? "text" : "password"}
                    className="form-input pr"
                    placeholder="Repita sua senha"
                    value={confirmarSenha}
                    onChange={e => setConfirmarSenha(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button type="button" className="eye-btn" onClick={() => setMostrarConfirmar(!mostrarConfirmar)}>
                    <EyeIcon open={mostrarConfirmar} />
                  </button>
                </div>
              </div>

              {/* Botão */}
              <button type="submit" className="btn-main" disabled={loading} id="btn-cadastro">
                {loading
                  ? <><div className="spinner" />Criando sua conta...</>
                  : <>
                      Criar Conta
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                    </>
                }
              </button>
            </form>

            <div className="divider">ou</div>

            <div className="card-footer">
              Já tem uma conta?{" "}
              <Link href="/login">Faça login</Link>
            </div>
          </div>

          {/* Termos */}
          <p className="terms">
            Ao continuar, você concorda com nossos{" "}
            <a href="#">Termos de Uso</a> e <a href="#">Política de Privacidade</a>
          </p>

          {/* Voltar */}
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link href="/" className="back-btn">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
              Voltar para o início
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
