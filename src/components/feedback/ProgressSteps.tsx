import { Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../tokens';

export type ProgressStepsProps = { currentIndex: number; total: number; labels?: readonly string[]; accessibilityLabel?: string };

export function ProgressSteps({ currentIndex, total, labels, accessibilityLabel = 'Progress' }: ProgressStepsProps) {
  return (
    <View accessibilityRole="progressbar" accessibilityLabel={accessibilityLabel} accessibilityValue={{ min: 1, max: total, now: currentIndex + 1 }} style={{ gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', gap: spacing.xs }}>
        {Array.from({ length: total }, (_, index) => (
          <View key={index} style={{ flex: 1, height: 6, borderRadius: radius.pill, backgroundColor: index <= currentIndex ? colors.contentPrimary : colors.borderDefault, opacity: index < currentIndex ? 0.72 : 1 }} />
        ))}
      </View>
      {labels?.[currentIndex] ? <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>{labels[currentIndex]}</Text> : null}
    </View>
  );
}
