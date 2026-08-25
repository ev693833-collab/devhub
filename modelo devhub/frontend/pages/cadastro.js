import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import DevHubLogo from "../components/Logo";

export default function Cadastro() {
  const router = useRouter();

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Estados de interface (carregamento, erro e sucesso)
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    // Validações no frontend
    if (!nome || !email || !senha || !confirmarSenha) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao cadastrar usuário.");
      }

      setSucesso("Conta criada com sucesso! Redirecionando para o login...");

      setTimeout(() => {
        router.push("/");
      }, 1500);

    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>DevHub — Cadastro</title>
      </Head>

      <div style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0B0F19",
        color: "#F1F5F9",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "20px"
      }}>
        {/* Luzes Neons de Fundo (Ambient Light Orbs) */}
        <div style={{
          position: "absolute",
          top: "-10%",
          left: "15%",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 80%)",
          filter: "blur(60px)",
          pointerEvents: "none"
        }} />

        <div style={{
          position: "absolute",
          bottom: "-10%",
          right: "15%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 80%)",
          filter: "blur(70px)",
          pointerEvents: "none"
        }} />

        {/* Card do Formulário com Efeito Glassmorphism */}
        <div style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "44px 36px",
          borderRadius: "24px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(59, 130, 246, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          textAlign: "center"
        }}>
          {/* Logo DevHub */}
          <div style={{ marginBottom: "24px" }}>
            <DevHubLogo size="large" />
          </div>

          {/* Cabeçalho */}
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "6px", color: "#FFFFFF" }}>
              Crie sua conta ✨
            </h1>
            <p style={{ color: "#94A3B8", fontSize: "14px" }}>
              Preencha os dados abaixo para se cadastrar na plataforma.
            </p>
          </div>

          {/* Mensagem de Erro */}
          {erro && (
            <div style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#FCA5A5",
              padding: "14px 16px",
              borderRadius: "12px",
              fontSize: "14px",
              marginBottom: "20px",
              textAlign: "left"
            }}>
              ⚠️ {erro}
            </div>
          )}

          {/* Mensagem de Sucesso */}
          {sucesso && (
            <div style={{
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid #10B981",
              color: "#10B981",
              padding: "14px 16px",
              borderRadius: "12px",
              fontSize: "14px",
              marginBottom: "20px",
              textAlign: "left"
            }}>
              ✅ {sucesso}
            </div>
          )}

          {/* Formulário de Cadastro */}
          <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#E2E8F0" }}>
                Nome Completo
              </label>
              <input
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  backgroundColor: "rgba(30, 41, 59, 0.6)",
                  color: "#FFFFFF",
                  fontSize: "15px",
                  outline: "none"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#E2E8F0" }}>
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  backgroundColor: "rgba(30, 41, 59, 0.6)",
                  color: "#FFFFFF",
                  fontSize: "15px",
                  outline: "none"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#E2E8F0" }}>
                Senha
              </label>
              <input
                type="password"
                placeholder="Mínimo de 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  backgroundColor: "rgba(30, 41, 59, 0.6)",
                  color: "#FFFFFF",
                  fontSize: "15px",
                  outline: "none"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#E2E8F0" }}>
                Confirmar Senha
              </label>
              <input
                type="password"
                placeholder="Repita sua senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  backgroundColor: "rgba(30, 41, 59, 0.6)",
                  color: "#FFFFFF",
                  fontSize: "15px",
                  outline: "none"
                }}
                required
              />
            </div>

            {/* Botão Cadastrar */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                color: "#FFFFFF",
                fontWeight: "700",
                fontSize: "16px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.45)",
                transition: "all 0.2s ease"
              }}
            >
              {loading ? "Cadastrando..." : "Criar Conta"}
            </button>
          </form>

          {/* Rodapé com Link para Login */}
          <div style={{ textAlign: "center", marginTop: "28px", fontSize: "14px", color: "#94A3B8" }}>
            Já tem uma conta?{" "}
            <Link href="/" style={{ color: "#60A5FA", fontWeight: "600", textDecoration: "none" }}>
              Faça login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
