import type { HTMLAttributes } from "react";

import "./components.css";

import { cx } from "./utils";

export type SelectionState = "Default" | "Pressed" | "Focused" | "Disabled";

export type CheckboxProps = {
  checked?: boolean;
  indeterminate?: boolean;
  invalid?: boolean;
  state?: SelectionState;
  label?: string;
  description?: string;
} & HTMLAttributes<HTMLLabelElement>;

export function Checkbox({
  checked = false,
  indeterminate = false,
  invalid = false,
  state = "Default",
  label = "Label",
  description,
  ...labelProps
}: CheckboxProps) {
  return (
    <label
      className={cx("ds-selection", "ds-checkbox")}
      data-checked={checked}
      data-indeterminate={indeterminate}
      data-invalid={invalid}
      data-state={state}
      {...labelProps}
    >
      <span className="ds-control-box" aria-hidden="true" />
      <span className="ds-selection__copy">
        <span className="ds-selection__label">{label}</span>
        {description ? <span className="ds-selection__description">{description}</span> : null}
      </span>
    </label>
  );
}
