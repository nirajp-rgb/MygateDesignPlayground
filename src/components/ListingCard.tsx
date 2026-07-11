import { Image, Text, View } from 'react-native';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../tokens';

type ListingCardProps = {
  imageSource: ImageSourcePropType;
  title: string;
  distance: string;
  location: string;
  price: string;
  originalPrice: string;
  discountLabel?: string;
  width?: number;
  style?: StyleProp<ViewStyle>;
};

export function ListingCard({
  imageSource,
  title,
  distance,
  location,
  price,
  originalPrice,
  discountLabel,
  width = 163.5,
  style
}: ListingCardProps) {
  return (
    <View style={[{ width }, style]}>
      <Image
        source={imageSource}
        resizeMode="cover"
        style={{
          width: '100%',
          height: 163,
          borderRadius: radius.xl,
          backgroundColor: colors.surfaceSecondary,
        }}
      />

      <View style={{ paddingTop: spacing.sm, gap: spacing.sm }}>
        <View >
          <Text numberOfLines={2} style={[typography.bodyLargeBold, { color: colors.contentPrimary }]}>
            {title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={[typography.bodyDefault, { color: colors.contentTertiary }]}>{distance}</Text>
            <View style={{ width: 4, height: 4, borderRadius: radius.pill, backgroundColor: colors.contentTertiary }} />
            <Text numberOfLines={1} style={[typography.bodyDefault, { flex: 1, color: colors.contentTertiary }]}>
              {location}
            </Text>
          </View>
        </View>

        <View style={{ gap: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={[typography.bodyLargeBold, { color: colors.contentPrimary }]}>{price}</Text>
            {discountLabel ? (
              <View
                style={{
                  borderRadius: radius.sm,
                  borderWidth: 1,
                  borderColor: colors.borderPositive,
                  backgroundColor: colors.surfacePositiveSubtle,
                  paddingHorizontal: spacing.xs,
                }}
              >
                <Text style={[typography.bodySmallBold, { color: colors.contentPositive }]}>{discountLabel}</Text>
              </View>
            ) : null}
          </View>
          <Text style={[typography.caption, { color: colors.contentTertiary, textDecorationLine: 'line-through' }]}>
            {originalPrice}
          </Text>
        </View>
      </View>
    </View>
  );
}
