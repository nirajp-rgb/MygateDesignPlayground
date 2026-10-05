import type { ComponentType, ReactNode } from 'react';
import { View } from 'react-native';
import type { IconWeight } from 'phosphor-react-native';
import { colors, dimensionTokens, iconSize, radius } from '../../tokens';

export type IconTileTone = 'Neutral' | 'Action' | 'Info' | 'Positive' | 'Warning' | 'Negative';
export type IconTileSize = 'SM' | 'MD' | 'LG';

export type IconTileIcon = ComponentType<{
  size?: number;
  color?: string;
  weight?: IconWeight;
}>;

export type IconTileProps = {
  icon?: IconTileIcon;
  children?: ReactNode;
  tone?: IconTileTone;
  size?: IconTileSize;
  iconColor?: string;
  backgroundColor?: string;
  backgroundAlpha?: number;
  iconSize?: number;
  tileSize?: number;
  cornerRadius?: number;
};

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((part) => `${part}${part}`)
          .join('')
      : normalized;

  if (value.length !== 6) return hex;

  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function IconTile({
  icon: Icon,
  children,
  tone = 'Neutral',
  size = 'MD',
  iconColor,
  backgroundColor,
  backgroundAlpha,
  iconSize: iconSizeOverride,
  tileSize: tileSizeOverride,
  cornerRadius,
}: IconTileProps) {
  const toneMap: Record<IconTileTone, { icon: string; background: string }> = {
    Neutral: { icon: colors.contentSecondary, background: colors.surfaceSecondary },
    Action: { icon: colors.contentAction, background: colors.surfaceActionSecondarySubtle },
    Info: { icon: colors.contentInfo, background: colors.surfaceInfoSubtle },
    Positive: { icon: colors.contentPositive, background: colors.surfacePositiveSubtle },
    Warning: { icon: colors.contentWarning, background: colors.surfaceWarningSubtle },
    Negative: { icon: colors.contentNegative, background: colors.surfaceNegativeSubtle },
  };
  const sizeMap: Record<IconTileSize, { tile: number; icon: number; radius: number }> = {
    SM: { tile: dimensionTokens['Dimension/space/32'], icon: iconSize.sm, radius: radius.md },
    MD: { tile: dimensionTokens['Dimension/space/40'], icon: iconSize.md, radius: radius.lg },
    LG: { tile: dimensionTokens['Dimension/space/48'], icon: iconSize.lg, radius: radius.xl },
  };
  const palette = toneMap[tone];
  const scale = sizeMap[size];
  const resolvedIconColor = iconColor ?? palette.icon;
  const resolvedBackgroundColor =
    backgroundColor ??
    (backgroundAlpha === undefined ? palette.background : hexToRgba(resolvedIconColor, backgroundAlpha));

  return (
    <View
      style={{
        width: tileSizeOverride ?? scale.tile,
        height: tileSizeOverride ?? scale.tile,
        borderRadius: cornerRadius ?? scale.radius,
        backgroundColor: resolvedBackgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {Icon ? <Icon size={iconSizeOverride ?? scale.icon} color={resolvedIconColor} weight="regular" /> : children}
    </View>
  );
}
