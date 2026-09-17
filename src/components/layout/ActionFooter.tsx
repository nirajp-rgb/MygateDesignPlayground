import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../tokens';
import { Button } from '../actions/Button';
import type { ButtonKind } from '../actions/Button';

export type FooterAction = { label: string; onPress: () => void; disabled?: boolean; kind?: ButtonKind };
export type ActionFooterProps = { primary: FooterAction; secondary?: FooterAction; safeArea?: boolean };

export function ActionFooter({ primary, secondary, safeArea = true }: ActionFooterProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: secondary ? 'row' : 'column',
        gap: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.borderSubtle,
        backgroundColor: colors.surfacePrimary,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.md + (safeArea ? insets.bottom : 0),
      }}
    >
      {secondary ? (
        <View style={{ flex: 1 }}>
          <Button kind={secondary.kind ?? 'Tertiary'} size="LG" label={secondary.label} fullWidth state={secondary.disabled ? 'Disabled' : 'Default'} onPress={secondary.onPress} />
        </View>
      ) : null}
      <View style={{ flex: secondary ? 1.4 : undefined }}>
        <Button kind={primary.kind ?? 'Primary'} size="LG" label={primary.label} fullWidth state={primary.disabled ? 'Disabled' : 'Default'} onPress={primary.onPress} />
      </View>
    </View>
  );
}
