import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { ChipGroup } from '../../components';
import { PressableSurface } from '../../components/internal/PressableSurface';
import { colors, radius, spacing, typography } from '../../tokens';

export type ListingChoiceOption<T extends string> = { value: T; label: string; description?: string; icon?: ReactNode };

export function ListingChoiceTiles<T extends string>({ value, options, onSelect, layout = 'center' }: { value: T | ''; options: ReadonlyArray<ListingChoiceOption<T>>; onSelect: (value: T) => void; layout?: 'center' | 'row' }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>{options.map((option) => {
    const selected = option.value === value;
    return <PressableSurface key={option.value} accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={() => onSelect(option.value)} style={{ width: '48%', minHeight: 76, paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderRadius: radius.xl, borderWidth: selected ? 2 : 1, borderColor: selected ? colors.contentAction : colors.borderDefault, backgroundColor: colors.surfacePrimary, gap: layout === 'row' ? spacing.sm : 2, flexDirection: layout === 'row' ? 'row' : 'column', alignItems: 'center', justifyContent: 'center' }}>
      {option.icon}
      <View style={{ alignItems: layout === 'row' ? 'flex-start' : 'center' }}><Text style={[typography.bodyDefaultBold, { color: selected ? colors.contentAction : colors.contentPrimary, textAlign: layout === 'row' ? 'left' : 'center' }]}>{option.label}</Text>{option.description && layout === 'center' ? <Text style={[typography.bodyDefault, { color: colors.contentSecondary, textAlign: 'center' }]}>{option.description}</Text> : null}</View>
    </PressableSurface>;
  })}</View>;
}

export function ListingPillGroup<T extends string>({ value, options, onSelect, layout = 'wrap' }: { value: T | ''; options: readonly T[]; onSelect: (value: T) => void; columns?: number; hugContent?: boolean; layout?: 'wrap' | 'horizontal' }) {
  return <ChipGroup layout={layout} value={value || null} options={options.map((option) => ({ key: option, label: option }))} onChange={(next) => { if (typeof next === 'string') onSelect(next as T); }} />;
}
