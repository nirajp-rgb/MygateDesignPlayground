import type { GestureResponderEvent } from 'react-native';
import { Pressable, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../tokens';
import type { SelectionState } from './Checkbox';

export type RadioProps = {
  checked?: boolean;
  invalid?: boolean;
  state?: SelectionState;
  label?: string;
  description?: string;
  onPress?: (event: GestureResponderEvent) => void;
};

export function Radio({
  checked = false,
  invalid = false,
  state = 'Default',
  label = 'Label',
  description,
  onPress
}: RadioProps) {
  const isDisabled = state === 'Disabled';
  const fillColor = invalid && checked ? colors.contentNegative : colors.surfaceActionSecondary;
  const borderColor = invalid ? colors.borderNegative : checked ? fillColor : colors.borderDefault;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
        opacity: isDisabled ? 0.6 : pressed ? 0.9 : 1
      })}
    >
      <View
        style={{
          width: 20,
          height: 20,
          marginTop: 2,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radius.pill,
          borderWidth: 1.5,
          borderColor,
          backgroundColor: colors.surfacePrimary
        }}
      >
        {checked ? (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: radius.pill,
              backgroundColor: fillColor
            }}
          />
        ) : null}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[typography.bodyDefaultBold, { color: isDisabled ? colors.contentTertiary : colors.contentPrimary }]}>{label}</Text>
        {description ? <Text style={[typography.caption, { color: colors.contentSecondary }]}>{description}</Text> : null}
      </View>
    </Pressable>
  );
}
