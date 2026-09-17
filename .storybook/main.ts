import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: { name: '@storybook/react-vite', options: {} },
  docs: { autodocs: true },
  core: { disableTelemetry: true },
  async viteFinal(config) {
    config.resolve = config.resolve ?? {};
    config.resolve.extensions = ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js', '.json'];
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      'react-native': path.resolve(process.cwd(), 'node_modules/react-native-web'),
      'react-native-safe-area-context': path.resolve(process.cwd(), '.storybook/safe-area-context.tsx'),
      'react-native-svg': path.resolve(process.cwd(), 'node_modules/react-native-svg/lib/module/elements.web.js'),
    };
    config.define = { ...(config.define ?? {}), 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development') };
    return config;
  },
};

export default config;
