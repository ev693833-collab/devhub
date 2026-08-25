import React from "react";

export default function DevHubLogo({ size = "normal" }) {
  const isLarge = size === "large";

  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: isLarge ? "12px" : "10px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      userSelect: "none"
    }}>
      {/* Imagem do Emblema DevHub */}
      <img
        src="/img/logo.png"
        alt="DevHub Symbol"
        style={{
          height: isLarge ? "46px" : "34px",
          width: "auto",
          objectFit: "contain",
          borderRadius: "8px",
          filter: "drop-shadow(0 4px 10px rgba(59, 130, 246, 0.3))"
        }}
      />

      {/* Texto DevHub do lado da imagem */}
      <div style={{
        fontSize: isLarge ? "28px" : "22px",
        fontWeight: "800",
        letterSpacing: "-0.5px",
        lineHeight: "1",
        display: "flex",
        alignItems: "center"
      }}>
        <span style={{ color: "var(--color-text-primary, #FFFFFF)" }}>Dev</span>
        <span style={{ color: "#3B82F6", marginLeft: "1px" }}>Hub</span>
      </div>
    </div>
  );
}
