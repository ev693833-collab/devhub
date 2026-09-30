import React from "react";

export default function DevHubLogo({ size = "normal", showText = true }) {
  const isLarge = size === "large";
  const iconHeight = isLarge ? "44px" : "34px";

  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: isLarge ? "12px" : "10px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      userSelect: "none"
    }}>
      {/* Emblema Oficial DevHub Sem Fundo Escuro */}
      <img
        src="/img/devhub_logo_emblem.png?v=5"
        alt="DevHub Emblema"
        style={{
          height: iconHeight,
          width: "auto",
          objectFit: "contain",
          filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.45))",
          flexShrink: 0
        }}
      />

      {/* Texto DevHub */}
      {showText && (
        <div style={{
          fontSize: isLarge ? "28px" : "22px",
          fontWeight: "900",
          letterSpacing: "-0.5px",
          lineHeight: "1",
          display: "flex",
          alignItems: "center"
        }}>
          <span style={{ color: "#FFFFFF" }}>Dev</span>
          <span style={{ color: "#3B82F6", marginLeft: "1px" }}>Hub</span>
        </div>
      )}
    </div>
  );
}
