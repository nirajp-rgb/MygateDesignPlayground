import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Star } from 'phosphor-react-native';
import { colors, radius, spacing, typography } from '../../tokens';

export type ReviewCardProps = {
  rating: number;
  reviewText: string;
  date: string;
  /** Optional badge slot — pass small icon/avatar nodes */
  badges?: ReactNode;
  width?: number;
};

export function ReviewCard({ rating, reviewText, date, badges, width = 240 }: ReviewCardProps) {
  return (
    <View
      style={{
        width,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        backgroundColor: colors.surfacePrimary,
        padding: spacing.md,
        gap: spacing.sm,
      }}
    >
      {/* Top row: star rating + badges */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Star size={14} color={colors.contentWarning} weight="fill" />
          <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]}>
            {rating.toFixed(1)}
          </Text>
        </View>
        {badges ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            {badges}
          </View>
        ) : null}
      </View>

      {/* Review text */}
      <Text
        numberOfLines={3}
        style={[typography.bodySmall, { color: colors.contentPrimary, flex: 1 }]}
      >
        {reviewText}
      </Text>

      {/* Date */}
      <Text style={[typography.caption, { color: colors.contentTertiary }]}>{date}</Text>
    </View>
  );
}
