import type { HTMLAttributes } from "react";

import "./components.css";

import { cx } from "./utils";

import type { SelectionState } from "./Checkbox";

export type SwitchProps = {
  value?: "off" | "on";
  state?: SelectionState;
  label?: string;
  description?: string;
} & HTMLAttributes<HTMLLabelElement>;

export function Switch({ value = "off", state = "Default", label = "Switch label", description, ...labelProps }: SwitchProps) {
  return (
    <label className={cx("ds-switch")} data-value={value} data-state={state} {...labelProps}>
      <span className="ds-switch__track" aria-hidden="true">
        <span className="ds-switch__thumb" />
      </span>
      <span className="ds-selection__copy">
        <span className="ds-selection__label">{label}</span>
        {description ? <span className="ds-selection__description">{description}</span> : null}
      </span>
    </label>
  );
}
