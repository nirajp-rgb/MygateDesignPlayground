import type { GestureResponderEvent } from 'react-native';
import { Pressable, Text } from 'react-native';
import { TrendUp } from 'phosphor-react-native';
import { colors, radius, spacing, typography } from '../../tokens';
import { IconPlaceholder } from '../internal/IconPlaceholder';

export type TagKind = 'Neutral' | 'Primary' | 'Positive' | 'Warning' | 'Negative' | 'Info';
export type TagVariant = 'Solid' | 'Light' | 'Outlined' | 'Text';
export type TagState = 'Default' | 'Disabled';

function getTagToneMap() {
  return {
    Neutral: {
      solidBg: colors.contentPrimary,
      subtleBg: colors.surfaceSecondary,
      border: colors.contentPrimary,
      text: colors.contentPrimary,
      onSolid: colors.contentOnDark
    },
    Primary: {
      solidBg: colors.surfaceActionSecondary,
      subtleBg: colors.surfaceActionSecondarySubtle,
      border: colors.borderAction,
      text: colors.contentAction,
      onSolid: colors.contentOnDark
    },
    Positive: {
      solidBg: colors.contentPositive,
      subtleBg: colors.surfacePositiveSubtle,
      border: colors.borderPositive,
      text: colors.contentPositive,
      onSolid: colors.contentOnDark
    },
    Warning: {
      solidBg: colors.contentWarning,
      subtleBg: colors.surfaceWarningSubtle,
      border: colors.borderWarning,
      text: colors.contentWarning,
      onSolid: colors.contentOnDark
    },
    Negative: {
      solidBg: colors.contentNegative,
      subtleBg: colors.surfaceNegativeSubtle,
      border: colors.borderNegative,
      text: colors.contentNegative,
      onSolid: colors.contentOnDark
    },
    Info: {
      solidBg: colors.surfaceInfoBold,
      subtleBg: colors.surfaceInfoSubtle,
      border: colors.borderInfo,
      text: colors.contentInfo,
      onSolid: colors.contentOnDark
    }
  } as const;
}

export type TagProps = {
  kind?: TagKind;
  variant?: TagVariant;
  state?: TagState;
  label?: string;
  showAction?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
};

export function Tag({
  kind = 'Neutral',
  variant = 'Solid',
  state = 'Default',
  label = 'NEW',
  showAction = false,
  onPress
}: TagProps) {
  const isDisabled = state === 'Disabled';
  const tagToneMap = getTagToneMap();
  const tone = tagToneMap[kind];
  const backgroundColor = isDisabled
    ? colors.surfaceDisabled
    : variant === 'Solid'
      ? tone.solidBg
      : variant === 'Light'
        ? tone.subtleBg
        : 'transparent';
  const borderColor = isDisabled
    ? colors.borderSubtle
    : variant === 'Outlined' || variant === 'Solid'
      ? tone.border
      : 'transparent';
  const textColor = isDisabled ? colors.contentTertiary : variant === 'Solid' ? tone.onSolid : tone.text;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled || !onPress}
      onPress={onPress}
      style={({ pressed }) => ({
        
        // minWidth: 40,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        gap: spacing.xs,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor,
        backgroundColor,
        paddingHorizontal: variant === 'Text' ? 0 : spacing.xs,
        // paddingVertical: spacing.xs,
        opacity: pressed && !isDisabled ? 0.92 : 1
      })}
    >
      {variant === 'Text' ? <TrendUp size={12} color={textColor} weight="bold" /> : null}
      <Text style={[typography.bodySmallBold, { color: textColor }]}>{label}</Text>
      {showAction ? <IconPlaceholder size="sm" color={textColor} /> : null}
    </Pressable>
  );
}
