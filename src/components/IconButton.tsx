import type { ComponentType } from 'react';
import { Pressable } from 'react-native';
import type { IconProps } from 'phosphor-react-native';
import { colors, iconSize, radius, spacing } from '../tokens';
import { IconPlaceholder } from './IconPlaceholder';

export type IconButtonType = 'Primary' | 'Secondary' | 'Tertiary' | 'Positive';
export type IconButtonSize = 'LG' | 'MD';
export type IconButtonState = 'Default' | 'Disabled';

type IconComponent = ComponentType<IconProps>;

export type IconButtonProps = {
  type?: IconButtonType;
  size?: IconButtonSize;
  state?: IconButtonState;
  icon?: IconComponent;
  onPress?: () => void;
};

type Palette = {
  backgroundColor: string;
  borderColor: string;
  iconColor: string;
  hasBorder: boolean;
};

function getPalette(type: IconButtonType, isDisabled: boolean): Palette {
  if (isDisabled) {
    return {
      backgroundColor: type === 'Tertiary' ? colors.surfacePrimary : colors.surfaceDisabled,
      borderColor: colors.borderSubtle,
      iconColor: colors.contentTertiary,
      hasBorder: type === 'Tertiary',
    };
  }

  switch (type) {
    case 'Primary':
      return {
        backgroundColor: colors.surfaceActionPrimary,
        borderColor: 'transparent',
        iconColor: colors.contentPrimary,
        hasBorder: false,
      };
    case 'Secondary':
      return {
        backgroundColor: colors.surfaceSecondary,
        borderColor: 'transparent',
        iconColor: colors.contentPrimary,
        hasBorder: false,
      };
    case 'Tertiary':
      return {
        backgroundColor: colors.surfacePrimary,
        borderColor: colors.borderDefault,
        iconColor: colors.contentPrimary,
        hasBorder: true,
      };
    case 'Positive':
      return {
        backgroundColor: colors.contentPositive,
        borderColor: 'transparent',
        iconColor: colors.contentOnDark,
        hasBorder: false,
      };
  }
}

export function IconButton({
  type = 'Primary',
  size = 'LG',
  state = 'Default',
  icon: Icon,
  onPress,
}: IconButtonProps) {
  const isDisabled = state === 'Disabled';
  const palette = getPalette(type, isDisabled);
  const padding = size === 'LG' ? spacing.lg : spacing.sm;
  const resolvedIconSize = size === 'LG' ? iconSize.xl : iconSize.md;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => ({
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.pill,
        borderWidth: palette.hasBorder ? 1 : 0,
        borderColor: palette.borderColor,
        backgroundColor:
          pressed && !isDisabled && type !== 'Primary' && type !== 'Positive'
            ? colors.surfaceActionSecondarySubtle
            : palette.backgroundColor,
        padding,
        opacity: isDisabled ? 0.4 : pressed ? 0.92 : 1,
      })}
    >
      {Icon ? (
        <Icon size={resolvedIconSize} color={palette.iconColor} weight="regular" />
      ) : (
        <IconPlaceholder size={size === 'LG' ? 'md' : 'sm'} color={palette.iconColor} />
      )}
    </Pressable>
  );
}
