import { Image, Pressable, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { colors, radius, spacing, typography } from '../../tokens';

export type MarketplacePromoCardProps = {
  title: string;
  imageSource: ImageSourcePropType;
  backgroundColor: string;
  textColor: string;
};

export function MarketplacePromoCard({ title, imageSource, backgroundColor, textColor }: MarketplacePromoCardProps) {
  return (
    <View style={{ width: '42%', height: 148, flexShrink: 0, borderRadius: radius.xl, backgroundColor, padding: spacing.md, overflow: 'hidden' }}>
      <Text style={[typography.bodyDefaultBold, { color: textColor, width: 64 }]}>{title}</Text>
      <Image source={imageSource} resizeMode="cover" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 88, opacity: 0.1 }} />
    </View>
  );
}

export type PropertyActionCardProps = {
  title: string;
  description: string;
  imageSource: ImageSourcePropType;
  onPress?: () => void;
};

export function PropertyActionCard({ title, description, imageSource, onPress }: PropertyActionCardProps) {
  const content = (
    <View style={{ minHeight: 112, gap: spacing.xs, paddingTop: spacing.md, paddingBottom: 48, paddingHorizontal: spacing.md, borderRadius: radius.xl, backgroundColor: colors.surfacePrimary, overflow: 'hidden' }}>
      <Image source={imageSource} resizeMode="contain" style={{ position: 'absolute', right: -spacing.sm, bottom: -spacing.sm, width: 80, height: 80 }} />
      <Text style={typography.bodyDefaultBold}>{title}</Text>
      <Text style={[typography.caption, { color: colors.contentSecondary }]}>{description}</Text>
    </View>
  );
  return onPress ? <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={({ pressed }) => ({ flex: 1, opacity: pressed ? 0.9 : 1 })}>{content}</Pressable> : <View style={{ flex: 1 }}>{content}</View>;
}
