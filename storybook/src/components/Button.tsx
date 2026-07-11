import type { ButtonHTMLAttributes } from "react";

import "./components.css";

import { IconPlaceholder } from "./IconPlaceholder";

export type ButtonKind = "Primary" | "Secondary" | "Tertiary";
export type ButtonState = "Default" | "Pressed" | "Disabled";
export type ButtonSize = "SM" | "MD" | "LG";

export type ButtonProps = {
  kind?: ButtonKind;
  state?: ButtonState;
  size?: ButtonSize;
  label?: string;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  focusVisible?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export function Button({
  kind = "Primary",
  state = "Default",
  size = "MD",
  label = "Button",
  showLeftIcon = false,
  showRightIcon = false,
  focusVisible = false,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      className="ds-button"
      data-kind={kind}
      data-state={state}
      data-size={size}
      data-focus={focusVisible}
      disabled={state === "Disabled"}
      type="button"
      {...buttonProps}
    >
      {showLeftIcon ? <IconPlaceholder /> : null}
      <span>{label}</span>
      {showRightIcon ? <IconPlaceholder /> : null}
    </button>
  );
}
