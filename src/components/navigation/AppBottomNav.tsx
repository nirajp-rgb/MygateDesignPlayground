import type { ComponentType } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { IconWeight } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, elevation, iconSize, spacing, typography } from '../../tokens';

type NavIconComponent = ComponentType<{
  size?: number;
  color?: string;
  weight?: IconWeight;
}>;

export type AppBottomNavItem = {
  key: string;
  label: string;
  icon: NavIconComponent;
  badgeLabel?: string;
};

type AppBottomNavProps = {
  items: AppBottomNavItem[];
  activeKey: string;
  onPressItem: (key: string) => void;
};

export function AppBottomNav({ items, activeKey, onPressItem }: AppBottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: colors.borderSubtle,
        backgroundColor: colors.surfacePrimary,
        paddingTop: spacing.md,
        paddingBottom: spacing.md + insets.bottom,
        ...elevation.md,
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.key === activeKey;

        return (
          <Pressable
            key={item.key}
            onPress={() => onPressItem(item.key)}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center', minHeight: 40 }}>
              <Icon
                size={iconSize.md}
                color={isActive ? colors.contentPrimary : colors.contentTertiary}
                weight={isActive ? 'fill' : 'regular'}
              />
              {item.badgeLabel ? (
                <View
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -18,
                    borderRadius: 4,
                    backgroundColor: colors.surfaceActionSecondary,
                    paddingHorizontal: 4,
                    paddingVertical: 1,
                  }}
                >
                  <Text style={[typography.badgeSmall, { color: colors.contentOnDark }]}>
                    {item.badgeLabel}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text style={[typography.caption, { color: isActive ? colors.contentPrimary : colors.contentTertiary }]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
