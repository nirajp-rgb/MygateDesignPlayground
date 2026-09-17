import type { GestureResponderEvent } from 'react-native';
import { Pressable, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../tokens';

export type SelectionState = 'Default' | 'Pressed' | 'Focused' | 'Disabled';

export type CheckboxProps = {
  checked?: boolean;
  indeterminate?: boolean;
  invalid?: boolean;
  state?: SelectionState;
  label?: string;
  description?: string;
  onPress?: (event: GestureResponderEvent) => void;
};

export function Checkbox({
  checked = false,
  indeterminate = false,
  invalid = false,
  state = 'Default',
  label = 'Label',
  description,
  onPress
}: CheckboxProps) {
  const isDisabled = state === 'Disabled';
  const isActive = checked || indeterminate;
  const fillColor = invalid && isActive ? colors.contentNegative : colors.surfaceActionSecondary;
  const borderColor = invalid ? colors.borderNegative : isActive ? fillColor : colors.borderDefault;

  return (
    <Pressable
      accessibilityRole="checkbox"
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
          borderRadius: radius.sm,
          borderWidth: 1.5,
          borderColor,
          backgroundColor: isActive ? fillColor : colors.surfacePrimary
        }}
      >
        {indeterminate ? (
          <View
            style={{
              width: 10,
              height: 2,
              borderRadius: radius.pill,
              backgroundColor: colors.contentOnDark
            }}
          />
        ) : checked ? (
          <Text style={[typography.captionBold, { color: colors.contentOnDark }]}>✓</Text>
        ) : null}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[typography.bodyDefaultBold, { color: isDisabled ? colors.contentTertiary : colors.contentPrimary }]}>{label}</Text>
        {description ? <Text style={[typography.caption, { color: colors.contentSecondary }]}>{description}</Text> : null}
      </View>
    </Pressable>
  );
}
