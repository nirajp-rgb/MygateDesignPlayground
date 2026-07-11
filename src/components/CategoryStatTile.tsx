import type { ComponentType } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { IconProps } from 'phosphor-react-native';
import { SurfaceCard } from './SurfaceCard';
import { colors, iconSize, spacing, typography } from '../tokens';

type TileIconComponent = ComponentType<IconProps>;

type CategoryStatTileProps = {
  icon: TileIconComponent;
  label: string;
  stat: string;
  onPress?: () => void;
};

const TILE_MIN_HEIGHT = 112;

export function CategoryStatTile({ icon: Icon, label, stat, onPress }: CategoryStatTileProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        flex: 1,
        opacity: pressed && onPress ? 0.88 : 1
      })}
    >
      <SurfaceCard borderWidth={0}   style={{ minHeight: TILE_MIN_HEIGHT, padding: spacing.sm }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm }}>
          <Icon size={iconSize.xl} color={colors.contentSecondary} weight="light" />
          <View style={{ alignSelf: 'stretch', alignItems: 'center' }}>
            <Text numberOfLines={1} style={[typography.bodySmallBold, { color: colors.contentPrimary, textAlign: 'center' }]}>
              {label}
            </Text>
            <Text numberOfLines={1} style={[typography.caption, { color: colors.contentTertiary, textAlign: 'center' }]}>
              {stat}
            </Text>
          </View>
        </View>
      </SurfaceCard>
    </Pressable>
  );
}
