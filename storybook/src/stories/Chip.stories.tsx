import { Fragment, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react";

import { Chip, type ChipState, type ChipTone, type ChipType } from "../components";

const meta = {
  title: "Components/Chip",
  component: Chip,
  args: {
    type: "Assist",
    tone: "Neutral",
    state: "Default",
    label: "Chip"
  }
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

const types: ChipType[] = ["Assist", "Filter", "Input"];
const tones: ChipTone[] = ["Neutral", "Info", "Positive", "Warning", "Negative"];
const states: ChipState[] = ["Default", "Selected", "Pressed", "Disabled"];

export const Playground: Story = {};

export const Interactive: Story = {
  args: {
    type: "Filter",
    tone: "Neutral",
    state: "Default",
    label: "Chip"
  },
  render: (args) => {
    const [selected, setSelected] = useState(args.state === "Selected");
    const [pressed, setPressed] = useState(false);

    const state: ChipState = args.state === "Disabled" ? "Disabled" : pressed ? "Pressed" : selected ? "Selected" : "Default";

    return (
      <Chip
        {...args}
        role="button"
        state={state}
        style={{ cursor: args.state === "Disabled" ? "not-allowed" : "pointer" }}
        tabIndex={args.state === "Disabled" ? -1 : 0}
        onClick={() => {
          if (args.state !== "Disabled") {
            setSelected((value) => !value);
          }
        }}
        onMouseDown={() => args.state !== "Disabled" && setPressed(true)}
        onMouseLeave={() => setPressed(false)}
        onMouseUp={() => setPressed(false)}
      />
    );
  }
};

export const Matrix: Story = {
  render: () => (
    <div className="story-page stack">
      {types.map((type) => (
        <section className="section-card" key={type}>
          <h2>{type}</h2>
          <p>Tone x state matrix matching the chip component board.</p>
          <div className="matrix matrix--chip-tag">
            <div />
            {states.map((state) => (
              <div className="matrix-header" key={state}>
                {state}
              </div>
            ))}
            {tones.map((tone) => (
              <Fragment key={`${type}-${tone}`}>
                <div className="matrix-row-label" key={`${type}-${tone}-label`}>
                  {tone}
                </div>
                {states.map((state) => (
                  <div className="matrix-cell" key={`${type}-${tone}-${state}`}>
                    <Chip type={type} tone={tone} state={state} />
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
