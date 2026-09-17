import { Pressable } from 'react-native';
import type { PressableProps } from 'react-native';

/**
 * Internal interaction primitive for product patterns that cannot be expressed
 * by Button, IconButton, ListItem, Chip, or Tile. Prefer those components first.
 */
export function PressableSurface(props: PressableProps) {
  return <Pressable {...props} />;
}
