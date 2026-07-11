import type { ComponentType } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { Pressable, Text } from 'react-native';
import type { IconProps } from 'phosphor-react-native';
import { colors, iconSize, radius, spacing, typography } from '../tokens';

export type ButtonKind = 'Primary' | 'Secondary' | 'Tertiary' | 'Inline' | 'Link' | 'Positive';
export type ButtonState = 'Default' | 'Pressed' | 'Disabled';
export type ButtonSize = 'SM' | 'MD' | 'LG';

type ButtonIcon = ComponentType<IconProps>;

export type ButtonProps = {
  kind?: ButtonKind;
  state?: ButtonState;
  size?: ButtonSize;
  label?: string;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  leftIcon?: ButtonIcon;
  rightIcon?: ButtonIcon;
  fullWidth?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
};

const sizeTokens = {
  SM: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    iconSize: iconSize.sm,
    textStyle: typography.bodySmallBold,
  },
  MD: {
    // Figma "Default": 16px H, 12px V
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    iconSize: iconSize.md,
    textStyle: typography.bodyDefaultBold,
  },
  LG: {
    // Figma "Large": 16px all sides
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    iconSize: iconSize.md,
    textStyle: typography.bodyLargeBold,
  },
} as const;

type Palette = {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  hasBorder: boolean;
  underline: boolean;
};

function getPalette(kind: ButtonKind, isDisabled: boolean): Palette {
  if (isDisabled) {
    return {
      backgroundColor: kind === 'Inline' || kind === 'Link' ? 'transparent' : colors.surfaceDisabled,
      borderColor: kind === 'Tertiary' ? colors.borderSubtle : 'transparent',
      textColor: colors.contentTertiary,
      hasBorder: kind === 'Tertiary',
      underline: kind === 'Inline',
    };
  }

  switch (kind) {
    case 'Primary':
      return {
        backgroundColor: colors.surfaceActionPrimary,
        borderColor: 'transparent',
        textColor: colors.contentPrimary,
        hasBorder: false,
        underline: false,
      };
    case 'Secondary':
      return {
        backgroundColor: colors.surfaceTertiary,
        borderColor: 'transparent',
        textColor: colors.contentPrimary,
        hasBorder: false,
        underline: false,
      };
    case 'Tertiary':
      return {
        backgroundColor: colors.surfacePrimary,
        borderColor: colors.borderDefault,
        textColor: colors.contentPrimary,
        hasBorder: true,
        underline: false,
      };
    case 'Inline':
      return {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: colors.contentPrimary,
        hasBorder: false,
        underline: true,
      };
    case 'Link':
      return {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: colors.contentAction,
        hasBorder: false,
        underline: false,
      };
    case 'Positive':
      return {
        backgroundColor: colors.contentPositive,
        borderColor: 'transparent',
        textColor: colors.contentOnDark,
        hasBorder: false,
        underline: false,
      };
  }
}

export function Button({
  kind = 'Primary',
  state = 'Default',
  size = 'MD',
  label = 'Button',
  showLeftIcon = false,
  showRightIcon = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  onPress,
}: ButtonProps) {
  const isDisabled = state === 'Disabled';
  const tokens = sizeTokens[size];
  const palette = getPalette(kind, isDisabled);
  const resolvedIconSize = size === 'LG' ? iconSize.md : iconSize.sm;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => ({
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        borderRadius: radius.lg,
        borderWidth: palette.hasBorder ? 1 : 0,
        borderColor: palette.borderColor,
        backgroundColor:
          pressed && !isDisabled && kind !== 'Primary'
            ? colors.surfaceActionSecondarySubtle
            : palette.backgroundColor,
        // paddingHorizontal: tokens.paddingHorizontal,
        paddingHorizontal: kind === 'Link' ? 0 : tokens.paddingHorizontal,
        paddingVertical: kind === 'Link' ? 0 : tokens.paddingVertical,
        // paddingVertical: tokens.paddingVertical,
        opacity: pressed && !isDisabled ? 0.92 : 1,
      })}
    >
      {showLeftIcon && LeftIcon
        ? <LeftIcon size={resolvedIconSize} color={palette.textColor} weight="regular" />
        : null}
      <Text
        style={[
          tokens.textStyle,
          {
            color: palette.textColor,
            textDecorationLine: palette.underline ? 'underline' : 'none',
          },
        ]}
      >
        {label}
      </Text>
      {showRightIcon && RightIcon
        ? <RightIcon size={resolvedIconSize} color={palette.textColor} weight="regular" />
        : null}
    </Pressable>
  );
}
