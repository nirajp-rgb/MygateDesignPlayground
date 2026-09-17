import type { RefObject } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { TextInput as TextInputType } from 'react-native';
import { MagnifyingGlass, X } from 'phosphor-react-native';
import { colors, iconSize, radius, spacing, typography } from '../../tokens';

export type SearchFieldProps = {
  mode?: 'input' | 'trigger';
  value?: string;
  onChangeText?: (value: string) => void;
  onClear?: () => void;
  onPress?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  inputRef?: RefObject<TextInputType | null>;
  accessibilityLabel?: string;
};

export function SearchField({
  mode = 'input',
  value = '',
  onChangeText,
  onClear,
  onPress,
  placeholder = 'Search',
  autoFocus,
  inputRef,
  accessibilityLabel = placeholder,
}: SearchFieldProps) {
  const content = (
    <>
      <MagnifyingGlass size={iconSize.md} color={colors.contentSecondary} weight="regular" />
      {mode === 'input' ? (
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          autoFocus={autoFocus}
          placeholder={placeholder}
          placeholderTextColor={colors.contentPlaceholder}
          accessibilityLabel={accessibilityLabel}
          style={[typography.bodyDefault, { flex: 1, color: colors.contentPrimary, paddingVertical: 0 }]}
        />
      ) : (
        <Text style={[typography.bodyDefault, { flex: 1, color: colors.contentPlaceholder }]}>{placeholder}</Text>
      )}
      {mode === 'input' && value && onClear ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={onClear} hitSlop={10}>
          <X size={iconSize.md} color={colors.contentSecondary} weight="regular" />
        </Pressable>
      ) : null}
    </>
  );

  const style = {
    minHeight: 56,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.md,
  };

  return mode === 'trigger' ? (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={style}>
      {content}
    </Pressable>
  ) : (
    <View style={style}>{content}</View>
  );
}
