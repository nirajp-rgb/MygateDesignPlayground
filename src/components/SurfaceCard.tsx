import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, elevation, radius, spacing } from '../tokens';

type SurfaceCardProps = {
  children: ReactNode;
  accent?: boolean;
  elevated?: boolean;
  borderWidth?: number;
  style?: StyleProp<ViewStyle>;
};

export function SurfaceCard({ children, accent = false, elevated = false, borderWidth = 0.5, style }: SurfaceCardProps) {
  return (
    <View
      style={[
        {
          gap: spacing.md,
          borderRadius: radius.xl,
          borderWidth,
          borderColor: accent ? colors.surfaceActionSecondary : colors.borderDefault,
          backgroundColor: accent ? colors.surfaceActionSecondarySubtle : colors.surfacePrimary,
          padding: spacing.lg,
          ...(elevated ? elevation.sm : elevation.none),
        },
        style
      ]}
    >
      {children}
    </View>
  );
}
