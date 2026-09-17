import type { Preview } from '@storybook/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { colors, setUIMode } from '../src/tokens';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const mode = context.globals.theme === 'dark' ? 'dark' : 'light';
      setUIMode(mode);
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
  parameters: { layout: 'centered', controls: { expanded: true } },
};

export default preview;
