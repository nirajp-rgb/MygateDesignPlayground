import type { ComponentType } from 'react';
import { Pressable, View } from 'react-native';
import type { IconProps } from 'phosphor-react-native';
import { colors, iconSize, radius, spacing } from '../../tokens';
import { IconPlaceholder } from '../internal/IconPlaceholder';
import { NumberBadge } from '../data-display/NumberBadge';

export type IconButtonType = 'Primary' | 'Secondary' | 'Tertiary' | 'Positive' | 'Ghost';
export type IconButtonSize = 'LG' | 'MD' | 'SM';
export type IconButtonState = 'Default' | 'Disabled';

type IconComponent = ComponentType<IconProps>;

export type IconButtonProps = {
  type?: IconButtonType;
  size?: IconButtonSize;
  state?: IconButtonState;
  icon?: IconComponent;
  onPress?: () => void;
  accessibilityLabel?: string;
  iconColor?: string;
  badgeCount?: number;
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
    case 'Ghost':
      return { backgroundColor: 'transparent', borderColor: 'transparent', iconColor: colors.contentSecondary, hasBorder: false };
  }
}

export function IconButton({
  type = 'Primary',
  size = 'LG',
  state = 'Default',
  icon: Icon,
  onPress,
  accessibilityLabel,
  iconColor,
  badgeCount,
}: IconButtonProps) {
  const isDisabled = state === 'Disabled';
  const palette = getPalette(type, isDisabled);
  const padding = size === 'LG' ? spacing.lg : size === 'MD' ? spacing.sm : spacing.xs;
  const resolvedIconSize = size === 'LG' ? iconSize.xl : size === 'MD' ? iconSize.md : iconSize.sm;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
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
        <Icon size={resolvedIconSize} color={iconColor ?? palette.iconColor} weight="regular" />
      ) : (
        <IconPlaceholder size={size === 'LG' ? 'md' : 'sm'} color={palette.iconColor} />
      )}
      {badgeCount && badgeCount > 0 ? <View style={{ position: 'absolute', top: -4, right: -4 }}><NumberBadge count={badgeCount} /></View> : null}
    </Pressable>
  );
}
