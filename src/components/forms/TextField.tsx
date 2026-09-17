import type { ReactNode, RefObject } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { KeyboardTypeOptions, TextInput as TextInputType } from 'react-native';
import { colors, radius, spacing, typography } from '../../tokens';

export type TextFieldState = 'default' | 'error' | 'disabled' | 'readOnly';

export type TextFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  state?: TextFieldState;
  multiline?: boolean;
  minHeight?: number;
  keyboardType?: KeyboardTypeOptions;
  leadingContent?: ReactNode;
  trailingContent?: ReactNode;
  prefix?: string;
  suffix?: string;
  autoFocus?: boolean;
  inputRef?: RefObject<TextInputType | null>;
  onFocus?: () => void;
  formatDisplayValue?: (value: string) => string;
  parseInputValue?: (value: string) => string;
  accessibilityLabel?: string;
};

export function TextField({
  value,
  onChangeText,
  label,
  placeholder,
  helperText,
  errorMessage,
  required = false,
  state = 'default',
  multiline = false,
  minHeight,
  keyboardType = 'default',
  leadingContent,
  trailingContent,
  prefix,
  suffix,
  autoFocus,
  inputRef,
  onFocus,
  formatDisplayValue = (nextValue) => nextValue,
  parseInputValue = (nextValue) => nextValue,
  accessibilityLabel,
}: TextFieldProps) {
  const disabled = state === 'disabled';
  const readOnly = state === 'readOnly';
  const invalid = state === 'error' || Boolean(errorMessage);
  const supportingText = errorMessage ?? helperText;

  return (
    <View style={{ gap: spacing.sm }}>
      {label ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]}>{label}</Text>
          {required ? <Text style={[typography.bodyDefaultBold, { color: colors.contentNegative }]}>*</Text> : null}
        </View>
      ) : null}
      <View
        style={{
          minHeight: multiline ? minHeight ?? 156 : 56,
          flexDirection: 'row',
          alignItems: multiline ? 'flex-start' : 'center',
          gap: spacing.sm,
          borderWidth: 1,
          borderColor: invalid ? colors.borderNegative : colors.borderDefault,
          borderRadius: radius.xl,
          backgroundColor: disabled ? colors.surfaceDisabled : colors.surfacePrimary,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {leadingContent}
        {prefix ? <Text style={[typography.bodyLarge, { color: colors.contentPrimary }]}>{prefix}</Text> : null}
        <TextInput
          ref={inputRef}
          value={formatDisplayValue(value)}
          onChangeText={(nextValue) => onChangeText(parseInputValue(nextValue))}
          placeholder={placeholder}
          placeholderTextColor={colors.contentPlaceholder}
          keyboardType={keyboardType}
          multiline={multiline}
          editable={!disabled && !readOnly}
          autoFocus={autoFocus}
          onFocus={onFocus}
          textAlignVertical={multiline ? 'top' : 'center'}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityState={{ disabled }}
          style={[typography.bodyLarge, { flex: 1, color: colors.contentPrimary, paddingVertical: 0 }]}
        />
        {suffix ? <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>{suffix}</Text> : null}
        {trailingContent}
      </View>
      {supportingText ? (
        <Text style={[typography.bodySmall, { color: invalid ? colors.contentNegative : colors.contentSecondary }]}>
          {supportingText}
        </Text>
      ) : null}
    </View>
  );
}
