import '../styles/globals.css'
import { useAuth } from '../utils/auth'
import setupAxiosInterceptors from '../utils/axiosInterceptor'
import Head from 'next/head';
import { useEffect, useState, useRef } from 'react'

// ── Constellation Background ───────────────────────────────────────────────────
function ConstellationBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 95;
    // Rich Purple & Violet Palette: Neon Violet, Purple, Indigo, Lavender, Glowing Magenta-Violet
    const PURPLE_PALETTE = [
      [168, 85, 247],  // Neon Violet (#A855F7)
      [139, 92, 246],  // Deep Purple (#8B5CF6)
      [124, 58, 237],  // Indigo Violet (#7C3AED)
      [192, 132, 252], // Bright Lavender (#C084FC)
      [217, 70, 239],  // Glowing Magenta-Violet (#D946EF)
    ];

    const pts = Array.from({ length: COUNT }, () => {
      const colorIndex = Math.floor(Math.random() * PURPLE_PALETTE.length);
      const isBigStar = Math.random() < 0.15;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - .5) * .35,
        vy: (Math.random() - .5) * .35,
        r: isBigStar ? Math.random() * 1.5 + 3.2 : Math.random() * 1.6 + 1.2,
        baseOpacity: isBigStar ? Math.random() * .2 + .80 : Math.random() * .4 + .55,
        color: PURPLE_PALETTE[colorIndex],
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * .03 + .01,
        isBigStar,
      };
    });

    const DIST = 145;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update positions & twinkling phase
      pts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.twinklePhase += p.twinkleSpeed;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      // Draw connecting lines in glowing purple
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < DIST) {
            const alpha = (1 - d / DIST) * 0.42;
            const c1 = pts[i].color;
            const c2 = pts[j].color;
            const r = Math.round((c1[0] + c2[0]) / 2);
            const g = Math.round((c1[1] + c2[1]) / 2);
            const b = Math.round((c1[2] + c2[2]) / 2);

            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      // Draw purple particle dots with glow
      pts.forEach(p => {
        const twinkle = Math.sin(p.twinklePhase) * 0.2;
        const currentOpacity = Math.min(1, Math.max(0.25, p.baseOpacity + twinkle));
        const [r, g, b] = p.color;

        ctx.save();
        ctx.shadowColor = `rgb(${r},${g},${b})`;
        ctx.shadowBlur = p.isBigStar ? 14 : 7;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${currentOpacity})`;
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 1, pointerEvents: 'none',
        opacity: 0.85,
      }}
    />
  );
}

export default function App({ Component, pageProps }) {
  const auth = useAuth()
  const [avisoReuniao, setAvisoReuniao] = useState(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  useEffect(() => {
    let timeoutFechar = null;

    const verificarReuniaoProxima = () => {
      // Nao mostra durante realizacao de prova
      if (typeof window !== 'undefined' && window.__provaEmAndamento) return;

      const agora = new Date();
      const hojeStr = agora.toLocaleDateString('pt-BR');
      const agenda = JSON.parse(localStorage.getItem('devhub_agenda_aulas') || '[]');
      const reunioesHoje = agenda.filter(a => a.data === hojeStr);

      for (const r of reunioesHoje) {
        const horarioInicio = (r.horario_inicio || (r.horario || '').split(' - ')[0] || '').trim();
        if (!horarioInicio) continue;
        const partes = horarioInicio.split(':').map(Number);
        const h = partes[0] || 0;
        const m = partes[1] || 0;
        const inicioReuniao = new Date();
        inicioReuniao.setHours(h, m, 0, 0);
        const diffMs = inicioReuniao - agora;
        const diffMin = Math.round(diffMs / 60000);
        if (diffMin > 0 && diffMin <= 30) {
          const novo = {
            titulo: r.titulo,
            horario: horarioInicio,
            minutos: diffMin,
            instrutor: r.instrutor ? r.instrutor.replace(/\s*\(.*?\)/g, '').trim() : null
          };
          setAvisoReuniao(novo);
          setVisivel(true);

          if (timeoutFechar) clearTimeout(timeoutFechar);
          timeoutFechar = setTimeout(() => {
            setVisivel(false);
            setTimeout(() => setAvisoReuniao(null), 400);
          }, 10000);
          return;
        }
      }
    };

    verificarReuniaoProxima();
    const intervalo = setInterval(verificarReuniaoProxima, 60000);

    return () => {
      clearInterval(intervalo);
      if (timeoutFechar) clearTimeout(timeoutFechar);
    };
  }, []);

  const fecharAviso = () => {
    setVisivel(false);
    setTimeout(() => setAvisoReuniao(null), 400);
  };

  if (!Component) return null;

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <ConstellationBg />
      <Head>
        <title>DevHub — Central de Estudos & Ecossistema</title>
        <link rel="icon" href="/favicon.png?v=5" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico?v=5" />
        <link rel="apple-touch-icon" href="/favicon.png?v=5" />
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(120%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
          @keyframes slideOutRight {
            from { transform: translateX(0);    opacity: 1; }
            to   { transform: translateX(120%); opacity: 0; }
          }
          @keyframes progressBar10s {
            from { width: 100%; }
            to   { width: 0%; }
          }
        `}</style>
      </Head>

      <Component {...pageProps} auth={auth} />

      {/* ===== TOAST GLOBAL DE REUNIÃO PRÓXIMA ===== */}
      {avisoReuniao && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            maxWidth: '300px',
            width: '100%',
            background: 'linear-gradient(135deg, #1E293B, #0F172A)',
            border: '1px solid rgba(239,68,68,0.5)',
            borderRadius: '16px',
            padding: '14px 14px 18px 14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(239,68,68,0.08)',
            overflow: 'hidden',
            animation: visivel
              ? 'slideInRight 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards'
              : 'slideOutRight 0.4s ease-in forwards'
          }}
        >
          {/* Barra de progresso de 10s */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #EF4444, #EAB308)',
            borderRadius: '0 0 16px 0',
            animation: 'progressBar10s 10s linear forwards'
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{
              width: '38px', height: '38px', flexShrink: 0,
              backgroundColor: 'rgba(239,68,68,0.18)',
              border: '1px solid rgba(239,68,68,0.35)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px'
            }}>
              🔔
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: '0 0 2px 0', fontWeight: '800', fontSize: '13px', color: '#EF4444' }}>
                ⏰ Reunião em {avisoReuniao.minutos} minuto{avisoReuniao.minutos > 1 ? 's' : ''}!
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#CBD5E1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <strong style={{ color: '#F1F5F9' }}>{avisoReuniao.titulo}</strong>
                {' '}às <strong style={{ color: '#EAB308' }}>{avisoReuniao.horario}</strong>
              </p>
              {avisoReuniao.instrutor && (
                <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>
                  👨‍🏫 <span style={{ color: '#60A5FA', fontWeight: '700' }}>{avisoReuniao.instrutor}</span>
                </p>
              )}
            </div>

            <button
              onClick={fecharAviso}
              style={{
                border: 'none',
                background: 'rgba(255,255,255,0.07)',
                color: '#94A3B8',
                borderRadius: '6px',
                width: '22px', height: '22px',
                cursor: 'pointer',
                fontSize: '11px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}
            >✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
