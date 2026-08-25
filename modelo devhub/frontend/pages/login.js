import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  // Estados do formulário
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  
  // Estados de controle de interface (carregamento e erro)
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    // Validação básica no frontend
    if (!email || !senha) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      // URL base do Backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // Chamada HTTP para a rota de login do backend
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao realizar login.");
      }

      // Sucesso: armazena token e dados no localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));

      setSucesso("Login realizado com sucesso! Redirecionando...");

      // Redireciona para a página principal após 1 segundo
      setTimeout(() => {
        router.push("/");
      }, 1000);

    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "var(--color-bg-primary, #1A1A2E)",
      color: "var(--color-text-primary, #F0F2F5)",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "var(--color-form-bg, #2A2A4A)",
        padding: "40px 32px",
        borderRadius: "16px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
        border: "1px solid var(--color-form-border, #4A4A6A)"
      }}>
        {/* Cabeçalho */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>
            Bem-vindo(a) de volta! 👋
          </h1>
          <p style={{ color: "var(--color-text-secondary, #888)", fontSize: "14px" }}>
            Digite suas credenciais para acessar sua conta.
          </p>
        </div>

        {/* Mensagem de Erro */}
        {erro && (
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "1px solid #EF4444",
            color: "#EF4444",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "20px"
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
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "20px"
          }}>
            ✅ {sucesso}
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid var(--color-form-border, #4A4A6A)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "inherit",
                fontSize: "15px",
                outline: "none"
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid var(--color-form-border, #4A4A6A)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "inherit",
                fontSize: "15px",
                outline: "none"
              }}
              required
            />
          </div>

          {/* Botão Entrar */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              backgroundColor: "var(--color-primary, #8b5cf6)",
              color: "#FFFFFF",
              fontWeight: "600",
              fontSize: "16px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s ease"
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Rodapé com Link para Cadastro */}
        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--color-text-secondary, #888)" }}>
          Não tem uma conta ainda?{" "}
          <Link href="/cadastro" style={{ color: "var(--color-primary, #8b5cf6)", fontWeight: "600", textDecoration: "none" }}>
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
