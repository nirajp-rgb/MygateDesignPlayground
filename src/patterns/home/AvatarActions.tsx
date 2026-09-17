import { Pressable, Text } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { Avatar } from '../../components';
import { colors, spacing, typography } from '../../tokens';

export function HomeProfileButton({ onPress }: { onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel="Open settings" onPress={onPress}><Avatar size="SM" type="Initials" name="Niraj P" /></Pressable>;
}

export function VisitorAvatarButton({ name, source, onPress }: { name: string; source: ImageSourcePropType; onPress?: () => void }) {
  return <Pressable accessibilityRole={onPress ? 'button' : undefined} accessibilityLabel={onPress ? `Open ${name}` : name} disabled={!onPress} onPress={onPress} style={({ pressed }) => ({ width: '22%', alignItems: 'center', gap: spacing.xs, opacity: pressed ? 0.85 : 1 })}><Avatar status="Online" size="XL" type="Image" source={source} /><Text numberOfLines={1} style={[typography.bodySmall, { color: colors.contentSecondary, textAlign: 'center' }]}>{name}</Text></Pressable>;
}
