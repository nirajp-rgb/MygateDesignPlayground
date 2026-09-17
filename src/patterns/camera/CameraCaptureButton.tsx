import { Pressable } from 'react-native';
import { Camera } from 'phosphor-react-native';
import { colors, radius } from '../../tokens';

export function CameraCaptureButton({ onPress, disabled = false }: { onPress: () => void; disabled?: boolean }) {
  return <Pressable disabled={disabled} accessibilityRole="button" accessibilityLabel="Capture face photo" onPress={onPress} style={({ pressed }) => ({ alignSelf: 'center', width: 78, height: 78, borderRadius: radius.pill, borderWidth: 6, borderColor: colors.contentOnDark, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.overlayLight, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 })}><Camera size={28} color={colors.contentOnDark} weight="regular" /></Pressable>;
}
