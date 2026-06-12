/**
 * Callout.jsx
 *
 * Componente reutilizável de callout para documentação (Docusaurus / Nextra / MDX).
 *
 * Props:
 *   icon      {string}                   – Caractere ou emoji exibido no ícone (ex: "w", "⚠", "💡")
 *   color     {string}                   – Cor principal em hex (ex: "#cdb4db")
 *   iconType  {"regular" | "solid"}      – Controla o estilo visual do ícone (fundo cheio vs outline)
 *   children  {ReactNode}                – Conteúdo textual do callout
 *
 * Uso:
 *   <Callout icon="w" color="#cdb4db" iconType="regular">
 *     For greater accessibility, WisdomAI lets you customize dashboard colors simply by asking.
 *   </Callout>
 */

import React from "react";

// ─── Utilitários de cor ────────────────────────────────────────────────────────

/**
 * Converte um hex (#rrggbb ou #rgb) para { r, g, b }.
 */
function hexToRgb(hex) {
  const sanitized = hex.replace("#", "");
  const full =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((c) => c + c)
          .join("")
      : sanitized;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Gera uma versão com opacidade da cor (para o fundo do callout).
 */
function withAlpha(hex, alpha = 0.12) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Retorna preto ou branco dependendo do contraste com a cor dada.
 */
function contrastColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1a1a1a" : "#ffffff";
}

// ─── Estilos globais ────────────────────────────────────────────────────────────
//
// Para atualizar o estilo de TODOS os callouts de uma vez, edite as variáveis
// em CALLOUT_DEFAULTS abaixo. Elas controlam espaçamento, tipografia e bordas.
// Não é necessário alterar o JSX.

const CALLOUT_DEFAULTS = {
  /** Raio da borda do container */
  borderRadius: "10px",
  /** Espessura da borda lateral colorida */
  borderLeftWidth: "4px",
  /** Padding interno do container */
  padding: "14px 18px",
  /** Espaçamento entre ícone e texto */
  gap: "14px",
  /** Tamanho da fonte do conteúdo */
  fontSize: "0.95rem",
  /** Altura de linha do conteúdo */
  lineHeight: "1.65",
  /** Tamanho do ícone (quadrado) */
  iconSize: "36px",
  /** Tamanho da fonte dentro do ícone */
  iconFontSize: "1rem",
  /** Peso da fonte do ícone */
  iconFontWeight: "700",
};

// ─── Componente ────────────────────────────────────────────────────────────────

export function Callout({
  icon = "ℹ",
  color = "#4f8ef7",
  iconType = "regular",
  children,
}) {
  const bg = withAlpha(color, 0.1);
  const border = color;
  const iconTextColor = iconType === "solid" ? contrastColor(color) : color;
  const iconBg = iconType === "solid" ? color : withAlpha(color, 0.18);
  const iconBorder =
    iconType === "regular" ? `1.5px solid ${withAlpha(color, 0.5)}` : "none";

  const styles = {
    container: {
      display: "flex",
      alignItems: "flex-start",
      gap: CALLOUT_DEFAULTS.gap,
      background: bg,
      borderLeft: `${CALLOUT_DEFAULTS.borderLeftWidth} solid ${border}`,
      borderRadius: CALLOUT_DEFAULTS.borderRadius,
      padding: CALLOUT_DEFAULTS.padding,
      margin: "1.25rem 0",
      boxSizing: "border-box",
    },
    iconWrapper: {
      flexShrink: 0,
      width: CALLOUT_DEFAULTS.iconSize,
      height: CALLOUT_DEFAULTS.iconSize,
      borderRadius: "50%",
      background: iconBg,
      border: iconBorder,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: iconTextColor,
      fontSize: CALLOUT_DEFAULTS.iconFontSize,
      fontWeight: CALLOUT_DEFAULTS.iconFontWeight,
      userSelect: "none",
      lineHeight: 1,
    },
    content: {
      flex: 1,
      fontSize: CALLOUT_DEFAULTS.fontSize,
      lineHeight: CALLOUT_DEFAULTS.lineHeight,
      color: "var(--callout-text-color, inherit)",
      margin: 0,
      padding: 0,
      alignSelf: "center",
    },
  };

  return (
    <div style={styles.container}>
      <span style={styles.iconWrapper} aria-hidden="true">
        {icon}
      </span>
      <div style={styles.content}>{children}</div>
    </div>
  );
}

export default Callout;