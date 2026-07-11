import type { GestureResponderEvent } from 'react-native';
import { Pressable, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../tokens';
import type { SelectionState } from './Checkbox';

export type SwitchProps = {
  value?: 'off' | 'on';
  state?: SelectionState;
  label?: string;
  description?: string;
  onPress?: (event: GestureResponderEvent) => void;
};

// Figma: track 52×32px, knob 24×24px, 2px padding inside track
const TRACK_WIDTH = 40;
const TRACK_HEIGHT = 24;
const KNOB_SIZE = 20;
const KNOB_PADDING = 2; // track padding from edge to knob edge

export function Switch({
  value = 'off',
  state = 'Default',
  label,
  description,
  onPress,
}: SwitchProps) {
  const isDisabled = state === 'Disabled';
  const isOn = value === 'on';

  const trackColor = isOn ? colors.surfaceActionSecondary : colors.surfaceTertiary;

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: isOn, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
        opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
      })}
    >
      {/* Track */}
      <View
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: radius.pill,
          backgroundColor: trackColor,
          justifyContent: 'center',
          paddingHorizontal: KNOB_PADDING,
          overflow: 'hidden',
        }}
      >
        {/* Knob */}
        <View
          style={{
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            borderRadius: radius.pill,
            backgroundColor: isDisabled && !isOn ? colors.contentDisabled : colors.surfacePrimary,
            alignSelf: isOn ? 'flex-end' : 'flex-start',
            // iOS-style knob shadow
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        />
      </View>

      {/* Label + description — omitted when label is not provided */}
      {label ? (
        <View style={{ flex: 1, gap: 2 }}>
          <Text
            style={[
              typography.bodyDefaultBold,
              { color: isDisabled ? colors.contentTertiary : colors.contentPrimary },
            ]}
          >
            {label}
          </Text>
          {description ? (
            <Text style={[typography.caption, { color: colors.contentSecondary }]}>
              {description}
            </Text>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}
