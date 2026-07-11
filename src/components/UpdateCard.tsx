import { Pressable, Text, View } from 'react-native';
import type { ComponentType } from 'react';
import type { IconWeight } from 'phosphor-react-native';
import { colors, iconSize, radius, spacing, typography } from '../tokens';
import { SurfaceCard } from './SurfaceCard';

type IconComponent = ComponentType<{
  size?: number;
  color?: string;
  weight?: IconWeight;
}>;

export type UpdateCardProps = {
  icon?: IconComponent;
  iconColor?: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
  elevated?: boolean;
};

export function UpdateCard({ icon: Icon, iconColor = colors.contentSecondary, title, subtitle, onPress, elevated = false }: UpdateCardProps) {
  return (
    <SurfaceCard elevated={elevated}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}
      >
        {Icon && (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.pill,
              backgroundColor: colors.surfaceSecondary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={iconSize.lg} color={iconColor} weight="regular" />
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]}>{title}</Text>
          <Text style={[typography.bodyDefault, { color: colors.contentSecondary, marginTop: spacing.xs }]}>{subtitle}</Text>
        </View>
      </Pressable>
    </SurfaceCard>
  );
}
