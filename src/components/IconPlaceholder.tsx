import type { ViewStyle } from 'react-native';
import { View } from 'react-native';
import { colors, iconSize, radius } from '../tokens';

type IconPlaceholderProps = {
  size?: 'sm' | 'md';
  color?: string;
  style?: ViewStyle;
};

export function IconPlaceholder({ size = 'md', color = colors.contentSecondary, style }: IconPlaceholderProps) {
  const dimension = size === 'sm' ? iconSize.sm : iconSize.md;
  const dotSize = size === 'sm' ? 6 : 8;

  return (
    <View
      aria-hidden
      style={[
        {
          width: dimension,
          height: dimension,
          alignItems: 'center',
          justifyContent: 'center'
        },
        style
      ]}
    >
      <View
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: radius.pill,
          backgroundColor: color
        }}
      />
    </View>
  );
}
