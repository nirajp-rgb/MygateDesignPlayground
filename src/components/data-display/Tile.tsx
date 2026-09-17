import type { ComponentType } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import type { ReactNode } from 'react';
import type { IconWeight } from 'phosphor-react-native';
import { colors, radius, spacing, typography } from '../../tokens';
import { NumberBadge } from './NumberBadge';
import { Tag } from './Tag';
import type { TagKind, TagVariant } from './Tag';

export type TileArtworkType = 'icon' | 'image' | 'none';
export type TileSize = 'SM' | 'MD';
export type TileVariant = 'standard' | 'card';

type IconComponent = ComponentType<{
  size?: number;
  color?: string;
  weight?: IconWeight;
}>;

export type TileProps = {
  label: string;
  /** Optional secondary line below the label (e.g. score in a rating tile) */
  sublabel?: string;
  badgeCount?: number;
  topTag?: {
    label: string;
    kind?: TagKind;
    variant?: TagVariant;
  };
  artworkType?: TileArtworkType;
  icon?: IconComponent;
  iconColor?: string;
  imageSource?: ImageSourcePropType;
  /** When true, image fills the artwork box as a background instead of being centred */
  imageBg?: boolean;
  size?: TileSize;
  /** Card is for compact dashboard grids with artwork and copy inside one surface. */
  variant?: TileVariant;
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
  trailingContent?: ReactNode;
  contentAlign?: 'center' | 'left';
};

const sizeScale: Record<TileSize, { box: number; icon: number }> = {
  SM: { box: 48, icon: 22 },
  MD: { box: 72, icon: 32 },
};

export function Tile({
  label,
  sublabel,
  badgeCount,
  topTag,
  artworkType = 'none',
  icon: Icon,
  iconColor = colors.contentSecondary,
  imageSource,
  imageBg = false,
  size = 'MD',
  variant = 'standard',
  onPress,
  selected = false,
  disabled = false,
  trailingContent,
  contentAlign = 'center',
}: TileProps) {
  const scale = sizeScale[size];
  const isCard = variant === 'card';

  function renderArtworkContent() {
    if (artworkType === 'icon' && Icon) {
      return <Icon size={scale.icon} color={iconColor} weight="light" />;
    }
    if (artworkType === 'image' && imageSource) {
      if (imageBg) {
        return (
          <Image
            source={imageSource}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              borderRadius: radius.lg,
            }}
            resizeMode="cover"
          />
        );
      }
      return (
        <Image
          source={imageSource}
          style={{ width: scale.icon, height: scale.icon }}
          resizeMode="contain"
        />
      );
    }
    return null;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      onPress={onPress}
      disabled={!onPress || disabled}
      style={({ pressed }) => ({
        flex: 1,
        ...(isCard
          ? {
              aspectRatio: 1,
              justifyContent: 'space-between' as const,
              backgroundColor: colors.surfacePrimary,
              padding: spacing.lg,
              borderRadius: radius.xl,
            }
          : null),
        alignItems: contentAlign === 'center' ? 'center' : 'flex-start',
        gap: spacing.xs,
        padding: isCard ? spacing.lg : spacing.xs,
        borderRadius: isCard ? radius.xl : radius.md,
        borderWidth: selected ? 1 : 0,
        borderColor: selected ? colors.borderAction : 'transparent',
        opacity: disabled ? 0.5 : pressed && onPress ? 0.75 : 1,
      })}
    >
      {/* Card tiles keep artwork within the shared surface; standard tiles use an artwork box. */}
      {isCard ? renderArtworkContent() : (
        <View
          style={{
            width: scale.box,
            height: scale.box,
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: colors.borderDefault,
            backgroundColor: colors.surfacePrimary,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible',
          }}
        >
        {badgeCount && badgeCount > 0 ? (
          <View style={{ position: 'absolute', top: -8, right: -8, zIndex: 1 }}>
            <NumberBadge count={badgeCount} />
          </View>
        ) : null}
        {topTag ? (
          <View style={{ position: 'absolute', top: -10, alignSelf: 'center', zIndex: 1 }}>
            <Tag
              kind={topTag.kind ?? 'Info'}
              variant={topTag.variant ?? 'Solid'}
              label={topTag.label}
            />
          </View>
        ) : null}
          {renderArtworkContent()}
        </View>
      )}

      {/* Label + optional sublabel — alignSelf stretch so text wraps within tile width */}
      <View style={{ alignSelf: 'stretch', alignItems: contentAlign === 'center' ? 'center' : 'flex-start', gap: 2 }}>
        <Text
          numberOfLines={2}
          style={[typography.bodySmallBold, { color: colors.contentPrimary, textAlign: contentAlign }]}
        >
          {label}
        </Text>
        {sublabel ? (
          <Text style={[typography.bodySmall, { color: colors.contentTertiary, textAlign: contentAlign }]}>
            {sublabel}
          </Text>
        ) : null}
      </View>
      {trailingContent}
    </Pressable>
  );
}
