import { Pressable, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../tokens';

type TemplateButtonProps = {
  label: string;
  emphasis?: 'primary' | 'secondary';
  onPress?: () => void;
};

export function TemplateButton({ label, emphasis = 'primary', onPress }: TemplateButtonProps) {
  const isPrimary = emphasis === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: spacing.xxl,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: isPrimary ? colors.surfaceActionSecondary : colors.borderDefault,
        backgroundColor: isPrimary ? colors.surfaceActionSecondary : colors.surfacePrimary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        opacity: pressed ? 0.9 : 1
      })}
    >
      <Text style={[typography.bodyDefaultBold, { color: isPrimary ? colors.contentOnDark : colors.contentAction }]}>
        {label}
      </Text>
    </Pressable>
  );
}
