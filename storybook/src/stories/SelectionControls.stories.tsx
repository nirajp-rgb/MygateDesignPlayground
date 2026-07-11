import { Fragment, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox, Radio, Switch } from "../components";

const meta = {
  title: "Components/Selection Controls"
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const controlStates = ["Default", "Pressed", "Focused", "Disabled"] as const;

export const CheckboxInteractive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    const [state, setState] = useState<(typeof controlStates)[number]>("Default");

    return (
      <Checkbox
        checked={checked}
        label="Email me updates"
        description="Click to toggle and tab to inspect focus styling."
        state={state}
        style={{ cursor: "pointer" }}
        tabIndex={0}
        onBlur={() => setState("Default")}
        onClick={() => setChecked((value) => !value)}
        onFocus={() => setState("Focused")}
        onMouseDown={() => setState("Pressed")}
        onMouseUp={() => setState("Default")}
      />
    );
  }
};

export const RadioInteractive: Story = {
  render: () => {
    const [selected, setSelected] = useState(true);
    const [state, setState] = useState<(typeof controlStates)[number]>("Default");

    return (
      <Radio
        checked={selected}
        label="Primary option"
        description="Shows click and focus behavior."
        state={state}
        style={{ cursor: "pointer" }}
        tabIndex={0}
        onBlur={() => setState("Default")}
        onClick={() => setSelected(true)}
        onFocus={() => setState("Focused")}
        onMouseDown={() => setState("Pressed")}
        onMouseUp={() => setState("Default")}
      />
    );
  }
};

export const SwitchInteractive: Story = {
  render: () => {
    const [value, setValue] = useState<"off" | "on">("off");
    const [state, setState] = useState<(typeof controlStates)[number]>("Default");

    return (
      <Switch
        value={value}
        label="Allow notifications"
        description="Click to toggle and tab to inspect focus styling."
        state={state}
        style={{ cursor: "pointer" }}
        tabIndex={0}
        onBlur={() => setState("Default")}
        onClick={() => setValue((current) => (current === "off" ? "on" : "off"))}
        onFocus={() => setState("Focused")}
        onMouseDown={() => setState("Pressed")}
        onMouseUp={() => setState("Default")}
      />
    );
  }
};

export const CheckboxMatrix: Story = {
  render: () => {
    const rows = [
      { label: "Unchecked", props: { checked: false, indeterminate: false, invalid: false } },
      { label: "Checked", props: { checked: true, indeterminate: false, invalid: false } },
      { label: "Indeterminate", props: { checked: false, indeterminate: true, invalid: false } },
      { label: "Error", props: { checked: true, indeterminate: false, invalid: true } }
    ];

    return (
      <section className="section-card story-page">
        <h2>Checkbox</h2>
        <p>Selection state guidance adapted from the checkbox documentation board.</p>
        <div className="matrix matrix--controls">
          <div />
          {controlStates.map((state) => (
            <div className="matrix-header" key={state}>
              {state}
            </div>
          ))}
          {rows.map((row) => (
            <Fragment key={row.label}>
              <div className="matrix-row-label" key={`${row.label}-label`}>
                {row.label}
              </div>
              {controlStates.map((state) => (
                <div className="matrix-cell" key={`${row.label}-${state}`}>
                  <Checkbox {...row.props} state={state} label="Label" />
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </section>
    );
  }
};

export const RadioMatrix: Story = {
  render: () => {
    const rows = [
      { label: "Unselected", props: { checked: false, invalid: false } },
      { label: "Selected", props: { checked: true, invalid: false } },
      { label: "Error", props: { checked: true, invalid: true } }
    ];

    return (
      <section className="section-card story-page">
        <h2>Radio</h2>
        <p>Selection x state matrix reflecting the radio guidance on the Figma page.</p>
        <div className="matrix matrix--controls">
          <div />
          {controlStates.map((state) => (
            <div className="matrix-header" key={state}>
              {state}
            </div>
          ))}
          {rows.map((row) => (
            <Fragment key={row.label}>
              <div className="matrix-row-label" key={`${row.label}-label`}>
                {row.label}
              </div>
              {controlStates.map((state) => (
                <div className="matrix-cell" key={`${row.label}-${state}`}>
                  <Radio {...row.props} state={state} label="Label" />
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </section>
    );
  }
};

export const SwitchMatrix: Story = {
  render: () => {
    const rows = [
      { label: "Off", props: { value: "off" as const } },
      { label: "On", props: { value: "on" as const } }
    ];

    return (
      <section className="section-card story-page">
        <h2>Switch</h2>
        <p>Value x state matrix based on the switch component documentation.</p>
        <div className="matrix matrix--controls">
          <div />
          {controlStates.map((state) => (
            <div className="matrix-header" key={state}>
              {state}
            </div>
          ))}
          {rows.map((row) => (
            <Fragment key={row.label}>
              <div className="matrix-row-label" key={`${row.label}-label`}>
                {row.label}
              </div>
              {controlStates.map((state) => (
                <div className="matrix-cell" key={`${row.label}-${state}`}>
                  <Switch {...row.props} state={state} label="Switch label" />
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </section>
    );
  }
};
