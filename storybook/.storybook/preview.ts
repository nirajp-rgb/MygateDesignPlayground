import type { Preview } from "@storybook/react";

import "../src/styles/tokens.css";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true
    },
    backgrounds: {
      default: "canvas",
      values: [
        { name: "canvas", value: "#f8fafc" },
        { name: "white", value: "#ffffff" }
      ]
    },
    layout: "centered"
  }
};

export default preview;
