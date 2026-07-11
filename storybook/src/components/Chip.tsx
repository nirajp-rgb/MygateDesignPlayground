import type { HTMLAttributes } from "react";

import "./components.css";

import { IconPlaceholder } from "./IconPlaceholder";

export type ChipType = "Assist" | "Filter" | "Input";
export type ChipTone = "Neutral" | "Info" | "Positive" | "Warning" | "Negative";
export type ChipState = "Default" | "Selected" | "Pressed" | "Disabled";

const toneStyles: Record<ChipTone, { bg: string; border: string; text: string }> = {
  Neutral: {
    bg: "var(--color-surface-primary)",
    border: "var(--color-border-default)",
    text: "var(--color-content-primary)"
  },
  Info: {
    bg: "var(--color-surface-info-subtle)",
    border: "var(--color-border-info)",
    text: "var(--color-content-info)"
  },
  Positive: {
    bg: "var(--color-surface-positive-subtle)",
    border: "var(--color-border-positive)",
    text: "var(--color-content-positive)"
  },
  Warning: {
    bg: "var(--color-surface-warning-subtle)",
    border: "var(--color-border-warning)",
    text: "var(--color-content-warning)"
  },
  Negative: {
    bg: "var(--color-surface-negative-subtle)",
    border: "var(--color-border-negative)",
    text: "var(--color-content-negative)"
  }
};

export type ChipProps = {
  type?: ChipType;
  tone?: ChipTone;
  state?: ChipState;
  label?: string;
  showLeadingIcon?: boolean;
  showTrailingIcon?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export function Chip({
  type = "Assist",
  tone = "Neutral",
  state = "Default",
  label = "Chip",
  showLeadingIcon = true,
  showTrailingIcon = true,
  ...divProps
}: ChipProps) {
  const tones = toneStyles[tone];
  const isDisabled = state === "Disabled";
  const isSelected = state === "Selected";
  const isPressed = state === "Pressed";

  const background = isDisabled
    ? "var(--color-surface-disabled)"
    : isPressed
      ? "var(--color-surface-action-secondary-subtle)"
      : tones.bg;

  const borderColor =
    isDisabled ? "var(--color-border-subtle)" : isSelected || type !== "Assist" ? tones.border : tone === "Neutral" ? tones.border : "transparent";

  const textColor = isDisabled ? "var(--color-content-disabled)" : tones.text;

  return (
    <div
      className="ds-chip"
      data-disabled={isDisabled}
      style={{
        background,
        borderColor,
        color: textColor
      }}
      {...divProps}
    >
      {showLeadingIcon ? <IconPlaceholder className="ds-icon--small" /> : null}
      <span>{label}</span>
      {showTrailingIcon ? <IconPlaceholder className="ds-icon--small" /> : null}
    </div>
  );
}
