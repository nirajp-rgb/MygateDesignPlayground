import type { Preview } from '@storybook/react';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { colors, setUIMode } from '../src/tokens';
import './preview.css';

(globalThis as typeof globalThis & { React: typeof React }).React = React;

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const mode = context.globals.theme === 'dark' ? 'dark' : 'light';
      setUIMode(mode);
      const isCatalog = context.title === 'Components/Production catalog';
      const isFoundation = context.title.startsWith('Foundations/');
      const isDocs = context.viewMode === 'docs';

      if (isCatalog || isFoundation || isDocs) {
        return (
          <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 1280, height: 900 }, insets: { top: 0, right: 0, bottom: 0, left: 0 } }}>
            <Story />
          </SafeAreaProvider>
        );
      }

      return (
        <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 24, right: 0, bottom: 24, left: 0 } }}>
          <View style={{ width: 390, minHeight: 240, padding: 24, backgroundColor: colors.surfacePage }}>
            <Story />
          </View>
        </SafeAreaProvider>
      );
    },
  ],
  globalTypes: {
    theme: { description: 'Theme', defaultValue: 'light', toolbar: { icon: 'paintbrush', items: ['light', 'dark'] } },
  },
  parameters: {
    layout: 'centered',
    controls: { expanded: true, sort: 'requiredFirst' },
    options: {
      storySort: {
        order: ['Foundations', ['Tokens'], 'Components', ['Production catalog', 'Component stories']],
      },
    },
  },
};

export default preview;
