import type { ReactElement, ReactNode } from 'react';
import { Children, cloneElement } from 'react';
import { View } from 'react-native';
import { radius } from '../../tokens';
import { SurfaceCard } from './SurfaceCard';
import type { ListItemProps } from '../data-display/ListItem';

export type ListGroupProps = { children: ReactNode };

export function ListGroup({ children }: ListGroupProps) {
  const items = Children.toArray(children) as ReactElement<ListItemProps>[];
  return (
    <SurfaceCard borderWidth={0} style={{ padding: 0, overflow: 'hidden' }}>
      <View style={{ overflow: 'hidden', borderRadius: radius.xl }}>
        {items.map((item, index) => cloneElement(item, { divider: index < items.length - 1 }))}
      </View>
    </SurfaceCard>
  );
}
