import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Limpa TODOS os dados de sessão/auth do localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("rememberUser");
      localStorage.removeItem("devhub_aba_ativa");
      localStorage.removeItem("devhub_manutencao");
      localStorage.removeItem("superAdminReturnUser");
      localStorage.removeItem("superAdminReturnToken");

      // Limpa sessionStorage também
      try { sessionStorage.clear(); } catch (e) {}

      // Redireciona para login após 1.2s (para mostrar a tela de logout)
      setTimeout(() => {
        router.push("/");
      }, 1200);
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Saindo... | DevHub</title>
      </Head>
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#06080F",
        color: "#F8FAFC",
        fontFamily: "'Inter', system-ui, sans-serif",
        gap: "20px"
      }}>
        {/* Logo animado */}
        <div style={{
          width: "64px",
          height: "64px",
          borderRadius: "18px",
          background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
          animation: "pulse 1.5s ease-in-out infinite"
        }}>
          🚀
        </div>

        <div style={{ textAlign: "center" }}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "800" }}>
            Encerrando sessão...
          </h2>
          <p style={{ margin: 0, color: "#94A3B8", fontSize: "14px" }}>
            Você será redirecionado para o login em instantes.
          </p>
        </div>

        {/* Barra de progresso */}
        <div style={{
          width: "220px",
          height: "4px",
          backgroundColor: "rgba(255,255,255,0.08)",
          borderRadius: "2px",
          overflow: "hidden"
        }}>
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
            borderRadius: "2px",
            animation: "progress 1.2s linear forwards"
          }} />
        </div>

        <style jsx global>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.08); opacity: 0.85; }
          }
          @keyframes progress {
            from { width: 0%; }
            to   { width: 100%; }
          }
        `}</style>
      </div>
    </>
  );
}
