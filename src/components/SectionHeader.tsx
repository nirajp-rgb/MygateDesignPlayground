import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { CaretRight } from 'phosphor-react-native';
import { colors, iconSize, spacing, typography } from '../tokens';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  /** Simple text action label on the right */
  actionLabel?: string;
  /** Arbitrary right-side slot — overrides actionLabel when provided */
  rightSlot?: ReactNode;
  /** Makes the title pressable and appends a caret */
  onPress?: () => void;
};

export function SectionHeader({ title, subtitle, actionLabel, rightSlot, onPress }: SectionHeaderProps) {
  const titleRow = (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flex: 1 }}>
        <Text style={typography.bodyLargeBold}>{title}</Text>
        {onPress ? <CaretRight size={iconSize.sm} color={colors.contentPrimary} weight="bold" /> : null}
      </View>
      {rightSlot ?? (actionLabel ? (
        <Text style={[typography.bodyDefaultBold, { color: colors.contentAction }]}>{actionLabel}</Text>
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
