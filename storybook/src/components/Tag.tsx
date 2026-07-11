import type { HTMLAttributes } from "react";

import "./components.css";

import { IconPlaceholder } from "./IconPlaceholder";

export type TagKind = "Neutral" | "Primary" | "Positive" | "Warning" | "Negative" | "Info";
export type TagVariant = "Solid" | "Light" | "Outlined";
export type TagState = "Default" | "Disabled";

const tagToneMap: Record<TagKind, { solidBg: string; subtleBg: string; border: string; text: string; onSolid: string }> = {
  Neutral: {
    solidBg: "var(--color-surface-tertiary)",
    subtleBg: "var(--color-surface-secondary)",
    border: "var(--color-border-default)",
    text: "var(--color-content-primary)",
    onSolid: "var(--color-content-primary)"
  },
  Primary: {
    solidBg: "var(--color-surface-action-secondary)",
    subtleBg: "var(--color-surface-action-secondary-subtle)",
    border: "var(--color-border-action)",
    text: "var(--color-content-action)",
    onSolid: "var(--color-content-on-dark)"
  },
  Positive: {
    solidBg: "var(--color-content-positive)",
    subtleBg: "var(--color-surface-positive-subtle)",
    border: "var(--color-border-positive)",
    text: "var(--color-content-positive)",
    onSolid: "var(--color-content-on-dark)"
  },
  Warning: {
    solidBg: "var(--color-content-warning)",
    subtleBg: "var(--color-surface-warning-subtle)",
    border: "var(--color-border-warning)",
    text: "var(--color-content-warning)",
    onSolid: "var(--color-content-on-dark)"
  },
  Negative: {
    solidBg: "var(--color-content-negative)",
    subtleBg: "var(--color-surface-negative-subtle)",
    border: "var(--color-border-negative)",
    text: "var(--color-content-negative)",
    onSolid: "var(--color-content-on-dark)"
  },
  Info: {
    solidBg: "var(--color-surface-info-bold)",
    subtleBg: "var(--color-surface-info-subtle)",
    border: "var(--color-border-info)",
    text: "var(--color-content-info)",
    onSolid: "var(--color-content-on-dark)"
  }
};

export type TagProps = {
  kind?: TagKind;
  variant?: TagVariant;
  state?: TagState;
  label?: string;
  showAction?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export function Tag({
  kind = "Neutral",
  variant = "Solid",
  state = "Default",
  label = "NEW",
  showAction = false,
  ...divProps
}: TagProps) {
  const tones = tagToneMap[kind];
  const isDisabled = state === "Disabled";
  const background =
    isDisabled ? "var(--color-surface-disabled)" : variant === "Solid" ? tones.solidBg : variant === "Light" ? tones.subtleBg : "transparent";
  const borderColor = isDisabled ? "var(--color-border-subtle)" : variant === "Outlined" || variant === "Solid" ? tones.border : "transparent";
  const color = isDisabled ? "var(--color-content-disabled)" : variant === "Solid" ? tones.onSolid : tones.text;

  return (
    <div className="ds-tag" data-disabled={isDisabled} style={{ background, borderColor, color }} {...divProps}>
      <span>{label}</span>
      {showAction ? <IconPlaceholder /> : null}
    </div>
  );
}
