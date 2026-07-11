import { Fragment, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react";

import { Tag, type TagKind, type TagState, type TagVariant } from "../components";

const meta = {
  title: "Components/Tag",
  component: Tag,
  args: {
    kind: "Neutral",
    variant: "Solid",
    state: "Default",
    label: "NEW"
  }
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

const kinds: TagKind[] = ["Neutral", "Primary", "Positive", "Warning", "Negative", "Info"];
const variants: TagVariant[] = ["Solid", "Light", "Outlined"];
const states: TagState[] = ["Default", "Disabled"];

export const Playground: Story = {};

export const Interactive: Story = {
  args: {
    kind: "Primary",
    variant: "Solid",
    state: "Default",
    label: "NEW",
    showAction: true
  },
  render: (args) => {
    const [active, setActive] = useState(true);

    return (
      <Tag
        {...args}
        label={active ? args.label : "DONE"}
        role="button"
        style={{ cursor: args.state === "Disabled" ? "not-allowed" : "pointer" }}
        tabIndex={args.state === "Disabled" ? -1 : 0}
        onClick={() => {
          if (args.state !== "Disabled") {
            setActive((value) => !value);
          }
        }}
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
          <p>Variant x state matrix matching the tag board.</p>
          <div className="matrix matrix--chip-tag">
            <div />
            {states.map((state) => (
              <div className="matrix-header" key={state}>
                {state}
              </div>
            ))}
            {variants.map((variant) => (
              <Fragment key={`${kind}-${variant}`}>
                <div className="matrix-row-label" key={`${kind}-${variant}-label`}>
                  {variant}
                </div>
                {states.map((state) => (
                  <div className="matrix-cell" key={`${kind}-${variant}-${state}`}>
                    <Tag kind={kind} variant={variant} state={state} />
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

export const WithAction: Story = {
  args: {
    kind: "Primary",
    variant: "Solid",
    state: "Default",
    showAction: true
  }
};
