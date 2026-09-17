import type { ComponentType } from 'react';
import { ScrollView, View } from 'react-native';
import type { IconProps } from 'phosphor-react-native';
import { spacing } from '../../tokens';
import { Chip } from './Chip';
import type { ChipTone } from './Chip';

export type ChipGroupOption = { key: string; label: string; icon?: ComponentType<IconProps>; tone?: ChipTone; disabled?: boolean };
export type ChipGroupProps = {
  options: readonly ChipGroupOption[];
  selectionMode?: 'single' | 'multiple';
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  layout?: 'wrap' | 'horizontal';
};

export function ChipGroup({ options, selectionMode = 'single', value, onChange, layout = 'wrap' }: ChipGroupProps) {
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const chips = options.map((option) => {
    const selected = selectedValues.includes(option.key);
    return (
      <Chip
        key={option.key}
        label={option.label}
        tone={option.tone}
        selected={selected}
        disabled={option.disabled}
        leadingIcon={option.icon}
        showLeadingIcon={Boolean(option.icon)}
        showTrailingIcon={false}
        onPress={() => {
          if (selectionMode === 'multiple') {
            onChange(selected ? selectedValues.filter((item) => item !== option.key) : [...selectedValues, option.key]);
          } else {
            onChange(selected ? null : option.key);
          }
        }}
      />
    );
  });

  return layout === 'horizontal' ? (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
      {chips}
    </ScrollView>
  ) : (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>{chips}</View>
  );
}
