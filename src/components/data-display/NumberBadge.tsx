import { Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../tokens';

type NumberBadgeProps = {
  count: number;
};

export function NumberBadge({ count }: NumberBadgeProps) {
  return (
    <View
      style={{
        minWidth: 20,
        height: 20,
        paddingHorizontal: spacing.xs,
        borderRadius: radius.pill,
        borderWidth:1,
        borderColor:colors.surfacePrimary,
        backgroundColor: colors.contentNegative,
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        
      }}
    >
      <Text style={[typography.badge, { color: colors.contentOnDark }]}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
}
