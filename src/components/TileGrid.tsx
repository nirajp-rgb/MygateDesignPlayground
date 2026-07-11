import { View } from 'react-native';
import { spacing } from '../tokens';
import { Tile } from './Tile';
import type { TileProps } from './Tile';

export type TileGridItem = TileProps & { key?: string };

export type TileGridProps = {
  items: TileGridItem[];
  /** Number of tiles per row. Defaults to 4. */
  columns?: number;
  /** Gap between tiles. Defaults to spacing.sm. */
  gap?: number;
};

export function TileGrid({ items, columns = 4, gap = spacing.sm }: TileGridProps) {
  // Split flat items array into rows of `columns` length
  const rows: TileGridItem[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }

  // If the last row is incomplete, pad with nulls so flex layout stays uniform
  const lastRow = rows[rows.length - 1];
  if (lastRow && lastRow.length < columns) {
    const padding = columns - lastRow.length;
    for (let i = 0; i < padding; i++) {
      lastRow.push({ label: '', artworkType: 'none', _phantom: true } as TileGridItem & { _phantom?: boolean });
    }
  }

  return (
    <View style={{ gap }}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: 'row', gap }}>
          {row.map((item, colIndex) => {
            const { key, _phantom, ...tileProps } = item as TileGridItem & { _phantom?: boolean };
            if (_phantom) {
              // Empty spacer to preserve grid alignment
              return <View key={`phantom-${colIndex}`} style={{ flex: 1, padding: spacing.xs }} />;
            }
            return (
              <Tile
                key={key ?? `${rowIndex}-${colIndex}`}
                {...tileProps}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}
