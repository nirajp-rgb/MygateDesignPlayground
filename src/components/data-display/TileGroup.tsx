import { View } from 'react-native';
import { spacing } from '../../tokens';
import { Tile } from './Tile';
import type { TileProps } from './Tile';

export type TileGroupItem = TileProps & { key: string };
export type TileGroupProps = { items: readonly TileGroupItem[]; value: string | string[] | null; onChange: (value: string | string[] | null) => void; selectionMode?: 'single' | 'multiple'; columns?: number };

export function TileGroup({ items, value, onChange, selectionMode = 'single', columns = 2 }: TileGroupProps) {
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const safeColumns = Math.max(1, Math.floor(columns));
  const rows: TileGroupItem[][] = [];

  for (let index = 0; index < items.length; index += safeColumns) {
    rows.push(items.slice(index, index + safeColumns));
  }

  return (
    <View style={{ gap: spacing.md }}>
      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={{ flexDirection: 'row', gap: spacing.md }}>
          {row.map(({ key, ...item }) => {
            const selected = selectedValues.includes(key);
            return (
              <View key={key} style={{ flex: 1, minWidth: 0 }}>
                <Tile
                  {...item}
                  selected={selected}
                  onPress={() => selectionMode === 'multiple'
                    ? onChange(selected ? selectedValues.filter((entry) => entry !== key) : [...selectedValues, key])
                    : onChange(selected ? null : key)}
                />
              </View>
            );
          })}
          {row.length < safeColumns
            ? Array.from({ length: safeColumns - row.length }, (_, index) => (
                <View key={`spacer-${index}`} style={{ flex: 1, minWidth: 0 }} />
              ))
            : null}
        </View>
      ))}
    </View>
  );
}
