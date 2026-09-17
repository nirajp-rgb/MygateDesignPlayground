import type { ComponentType } from 'react';
import { View } from 'react-native';
import type { IconWeight } from 'phosphor-react-native';
import { radius } from '../../tokens';

type TileIcon = ComponentType<{
  size?: number;
  color?: string;
  weight?: IconWeight;
}>;

type IconTileProps = {
  icon: TileIcon;
  iconColor: string;
  backgroundColor?: string;
  backgroundAlpha?: number;
  iconSize: number;
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
  iconColor,
  backgroundColor,
  backgroundAlpha = 0.12,
  iconSize,
  tileSize = 40,
  cornerRadius = radius.lg
}: IconTileProps) {
  return (
    <View
      style={{
        width: tileSize,
        height: tileSize,
        borderRadius: cornerRadius,
        backgroundColor: backgroundColor ?? hexToRgba(iconColor, backgroundAlpha),
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Icon size={iconSize} color={iconColor} weight="regular" />
    </View>
  );
}
