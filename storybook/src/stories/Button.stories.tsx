import { Fragment, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react";

import { Button, type ButtonKind, type ButtonSize, type ButtonState } from "../components";

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    kind: "Primary",
    size: "MD",
    state: "Default",
    label: "Button"
  }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

const kinds: ButtonKind[] = ["Primary", "Secondary", "Tertiary"];
const sizes: ButtonSize[] = ["SM", "MD", "LG"];
const states: ButtonState[] = ["Default", "Pressed", "Disabled"];

export const Playground: Story = {};

export const Interactive: Story = {
  render: (args) => {
    const [pressed, setPressed] = useState(false);
    const [focused, setFocused] = useState(false);

    const state: ButtonState = args.state === "Disabled" ? "Disabled" : pressed ? "Pressed" : "Default";

    return (
      <Button
        {...args}
        focusVisible={focused}
        state={state}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onMouseDown={() => setPressed(true)}
        onMouseLeave={() => setPressed(false)}
        onMouseUp={() => setPressed(false)}
      />
    );
  }
};

export const Matrix: Story = {
  render: () => (
    <div className="story-page stack">
      {kinds.map((kind) => (
        <section className="section-card" key={kind}>
          <h2>{kind}</h2>
          <p>Kind x size x state matrix from the Figma button board.</p>
          <div className="matrix matrix--buttons">
            <div />
            {sizes.map((size) => (
              <div className="matrix-header" key={size}>
                {size}
              </div>
            ))}
            {states.map((state) => (
              <Fragment key={`${kind}-${state}`}>
                <div className="matrix-row-label" key={`${kind}-${state}-label`}>
                  {state}
                </div>
                {sizes.map((size) => (
                  <div className="matrix-cell" key={`${kind}-${state}-${size}`}>
                    <Button kind={kind} size={size} state={state} />
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
};

export const WithIcons: Story = {
  args: {
    kind: "Primary",
    size: "MD",
    state: "Default",
    showLeftIcon: true,
    showRightIcon: true
  }
};
