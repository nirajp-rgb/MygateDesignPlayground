import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { IconProps } from 'phosphor-react-native';
import { CaretRight } from 'phosphor-react-native';
import { colors, iconSize, spacing, typography } from '../../tokens';

type SectionHeaderIcon = React.ComponentType<IconProps>;

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  leadingIcon?: SectionHeaderIcon;
  /** Simple text action label on the right */
  actionLabel?: string;
  actionIcon?: SectionHeaderIcon;
  onActionPress?: () => void;
  /** Arbitrary right-side slot — overrides actionLabel when provided */
  rightSlot?: ReactNode;
  /** Makes the title pressable and appends a caret */
  onPress?: () => void;
};

export function SectionHeader({
  title,
  subtitle,
  leadingIcon: LeadingIcon,
  actionLabel,
  actionIcon: ActionIcon = CaretRight,
  onActionPress,
  rightSlot,
  onPress
}: SectionHeaderProps) {
  const actionContent = actionLabel ? (
    <>
      <Text style={[typography.bodyDefaultBold, { color: colors.contentAction }]}>{actionLabel}</Text>
      <ActionIcon size={iconSize.sm} color={colors.contentAction} weight="bold" />
    </>
  ) : null;

  const titleRow = (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flex: 1 }}>
        {LeadingIcon ? <LeadingIcon size={iconSize.lg} color={colors.contentPrimary} weight="light" /> : null}
        <Text style={typography.bodyLargeBold}>{title}</Text>
        {onPress ? <CaretRight size={iconSize.sm} color={colors.contentPrimary} weight="bold" /> : null}
      </View>
      {rightSlot ??
        (actionLabel ? (
          onActionPress ? (
          <Pressable
            accessibilityRole="button"
            onPress={onActionPress}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.xs,
              opacity: pressed ? 0.72 : 1
            })}
          >
            {actionContent}
          </Pressable>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>{actionContent}</View>
          )
        ) : null)}
    </View>
  );

  return (
    <View style={{ gap: 2 }}>
      {onPress ? (
        <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          {titleRow}
        </Pressable>
      ) : titleRow}
      {subtitle
        ? <Text style={[typography.bodySecondary, { color: colors.contentSecondary }]}>{subtitle}</Text>
        : null}
    </View>
  );
}
