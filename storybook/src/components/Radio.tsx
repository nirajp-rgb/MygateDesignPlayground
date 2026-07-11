import type { HTMLAttributes } from "react";

import "./components.css";

import { cx } from "./utils";

import type { SelectionState } from "./Checkbox";

export type RadioProps = {
  checked?: boolean;
  invalid?: boolean;
  state?: SelectionState;
  label?: string;
  description?: string;
} & HTMLAttributes<HTMLLabelElement>;

export function Radio({
  checked = false,
  invalid = false,
  state = "Default",
  label = "Label",
  description,
  ...labelProps
}: RadioProps) {
  return (
    <label className={cx("ds-selection", "ds-radio")} data-checked={checked} data-invalid={invalid} data-state={state} {...labelProps}>
      <span className="ds-control-box" aria-hidden="true" />
      <span className="ds-selection__copy">
        <span className="ds-selection__label">{label}</span>
        {description ? <span className="ds-selection__description">{description}</span> : null}
      </span>
    </label>
  );
}
