import type { ReactNode } from 'react';
import { View } from 'react-native';
import type { ViewProps } from 'react-native';

const zeroInsets = { top: 0, right: 0, bottom: 0, left: 0 };

export function SafeAreaProvider({ children }: { children: ReactNode }) {
  return children;
}

export function SafeAreaView(props: ViewProps) {
  return <View {...props} />;
}

export function useSafeAreaInsets() {
  return zeroInsets;
}

export function useSafeAreaFrame() {
  return { x: 0, y: 0, width: 390, height: 844 };
}
