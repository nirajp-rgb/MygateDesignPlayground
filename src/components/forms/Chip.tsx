import type { ComponentType } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { Pressable, Text } from 'react-native';
import type { IconProps } from 'phosphor-react-native';
import { colors, iconSize, radius, spacing, typography } from '../../tokens';

export type ChipType = 'Assist' | 'Filter' | 'Input';
export type ChipTone = 'Neutral' | 'Info' | 'Positive' | 'Warning' | 'Negative';
export type ChipState = 'Default' | 'Selected' | 'Pressed' | 'Disabled';

const toneMap = {
  Neutral: {
    bg: colors.surfacePrimary,
    border: colors.borderDefault,
    text: colors.contentPrimary
  },
  Info: {
    bg: colors.surfaceInfoSubtle,
    border: colors.borderInfo,
    text: colors.contentInfo
  },
  Positive: {
    bg: colors.surfacePositiveSubtle,
    border: colors.borderPositive,
    text: colors.contentPositive
  },
  Warning: {
    bg: colors.surfaceWarningSubtle,
    border: colors.borderWarning,
    text: colors.contentWarning
  },
  Negative: {
    bg: colors.surfaceNegativeSubtle,
    border: colors.borderNegative,
    text: colors.contentNegative
  }
} as const;

type ChipIcon = ComponentType<IconProps>;

export type ChipProps = {
  type?: ChipType;
  tone?: ChipTone;
  state?: ChipState;
  label?: string;
  showLeadingIcon?: boolean;
  showTrailingIcon?: boolean;
  leadingIcon?: ChipIcon;
  trailingIcon?: ChipIcon;
  onPress?: (event: GestureResponderEvent) => void;
  selected?: boolean;
  disabled?: boolean;
};

export function Chip({
  type = 'Assist',
  tone = 'Neutral',
  state = 'Default',
  label = 'Chip',
  showLeadingIcon = true,
  showTrailingIcon = true,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  onPress,
  selected,
  disabled,
}: ChipProps) {
  const isDisabled = disabled ?? state === 'Disabled';
  const isSelected = selected ?? state === 'Selected';
  const isPressed = state === 'Pressed';
  const toneStyles = toneMap[tone];

  const backgroundColor = isDisabled
    ? colors.surfaceDisabled
    : isPressed
      ? colors.surfaceActionSecondarySubtle
      : toneStyles.bg;
      const borderColor = isDisabled
      ? colors.borderSubtle
      : isSelected
        ? colors.borderAction
        : type !== 'Assist'
          ? toneStyles.border
          : tone === 'Neutral'
            ? toneStyles.border
            : 'transparent';

  const textColor = isDisabled ? colors.contentTertiary : toneStyles.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 32,
        minWidth: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor,
        backgroundColor: pressed && !isDisabled ? colors.surfaceActionSecondarySubtle : backgroundColor,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm
      })}
    >
      {showLeadingIcon && LeadingIcon
        ? <LeadingIcon size={iconSize.sm} color={textColor} weight="regular" />
        : null}
      <Text style={[typography.bodySmallBold, { color: textColor }]}>{label}</Text>
      {showTrailingIcon && TrailingIcon
        ? <TrailingIcon size={iconSize.sm} color={textColor} weight="regular" />
        : null}
    </Pressable>
  );
}
