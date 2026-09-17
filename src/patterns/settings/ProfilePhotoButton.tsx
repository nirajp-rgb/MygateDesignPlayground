import { Pressable } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { Avatar } from '../../components';
import { colors, radius } from '../../tokens';

export type ProfilePhotoButtonProps = { source?: ImageSourcePropType; onPress: () => void; name: string };

export function ProfilePhotoButton({ source, onPress, name }: ProfilePhotoButtonProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Capture profile photo" onPress={onPress} style={({ pressed }) => ({ padding: 4, borderRadius: radius.pill, borderWidth: 2, borderColor: colors.surfaceActionPrimary, opacity: pressed ? 0.9 : 1 })}>
      <Avatar size="XXL" type={source ? 'Image' : 'Initials'} name={name} source={source} />
    </Pressable>
  );
}
