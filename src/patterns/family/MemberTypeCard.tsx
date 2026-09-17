import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Baby, Check, UserCircle } from 'phosphor-react-native';
import { SurfaceCard } from '../../components';
import { PressableSurface } from '../../components/internal/PressableSurface';
import { colors, iconSize, radius, spacing, typography } from '../../tokens';

export type FamilyMemberType = 'adult' | 'child';
export type MemberTypeCardProps = { type: FamilyMemberType; selected: boolean; onSelect: () => void; children?: ReactNode };

export function MemberTypeCard({ type, selected, onSelect, children }: MemberTypeCardProps) {
  const isAdult = type === 'adult';
  const Icon = isAdult ? UserCircle : Baby;
  return (
    <SurfaceCard borderWidth={1} style={{ borderColor: selected ? colors.borderAction : colors.borderDefault }}>
      <PressableSurface accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={onSelect} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: spacing.md, opacity: pressed ? 0.9 : 1 })}>
        <View style={{ padding: spacing.md, borderRadius: radius.pill, backgroundColor: colors.surfaceSecondary }}>
          <Icon size={iconSize.lg} color={colors.contentSecondary} weight="regular" />
        </View>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text style={[typography.bodyLargeBold, { color: colors.contentPrimary }]}>{isAdult ? 'Adult' : 'Child'}</Text>
          <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>{isAdult ? 'Invite them to use MyGate with their own number.' : 'Create a child profile and manage exit preferences.'}</Text>
        </View>
        <View style={{ padding: spacing.xs, borderRadius: radius.pill, borderWidth: 1, borderColor: selected ? colors.surfaceActionSecondary : colors.borderDefault, backgroundColor: selected ? colors.surfaceActionSecondary : colors.surfacePrimary }}>
          {selected ? <Check size={iconSize.sm} color={colors.contentOnDark} weight="regular" /> : <View style={{ width: iconSize.sm, height: iconSize.sm }} />}
        </View>
      </PressableSurface>
      {selected ? <><View style={{ height: 1, backgroundColor: colors.borderSubtle }} /><View style={{ gap: spacing.lg }}>{children}</View></> : null}
    </SurfaceCard>
  );
}
