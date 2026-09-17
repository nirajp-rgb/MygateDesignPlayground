import { View } from 'react-native';
import { spacing } from '../../tokens';
import { Tile } from './Tile';
import type { TileProps } from './Tile';

export type TileGroupItem = TileProps & { key: string };
export type TileGroupProps = { items: readonly TileGroupItem[]; value: string | string[] | null; onChange: (value: string | string[] | null) => void; selectionMode?: 'single' | 'multiple'; columns?: number };

export function TileGroup({ items, value, onChange, selectionMode = 'single', columns = 2 }: TileGroupProps) {
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
      {items.map(({ key, ...item }) => {
        const selected = selectedValues.includes(key);
        return (
          <View key={key} style={{ width: `${100 / columns - 2}%` }}>
            <Tile {...item} selected={selected} onPress={() => selectionMode === 'multiple' ? onChange(selected ? selectedValues.filter((entry) => entry !== key) : [...selectedValues, key]) : onChange(selected ? null : key)} />
          </View>
        );
      })}
    </View>
  );
}
