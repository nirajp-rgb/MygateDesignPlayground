import { Image, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { CalendarBlank, Image as ImageIcon, Plus, X } from 'phosphor-react-native';
import { PressableSurface } from '../../components/internal/PressableSurface';
import { colors, radius, spacing, typography } from '../../tokens';

export type ListingPhoto = { label: string; source: ImageSourcePropType };

export function ListingPhotoGrid({ photos, variant = 'summary', onAddPhoto, onRemovePhoto }: { photos: ListingPhoto[]; variant?: 'editable' | 'summary'; onAddPhoto?: () => void; onRemovePhoto?: (label: string) => void }) {
  const editable = variant === 'editable';
  const tileWidth = editable ? '48%' : '23%';
  if (editable && photos.length === 0 && onAddPhoto) {
    return <PressableSurface accessibilityRole="button" accessibilityLabel="Add photos" onPress={onAddPhoto} style={{ minHeight: 180, borderRadius: radius.xl, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.borderDefault, backgroundColor: colors.surfaceSecondary, alignItems: 'center', justifyContent: 'center', gap: spacing.sm }}><ImageIcon size={32} color={colors.contentAction} weight="regular" /><Text style={typography.bodyDefaultBold}>Tap to add photos</Text><Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>No watermarks. Bright daytime shots work best.</Text></PressableSurface>;
  }
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: editable ? spacing.md : spacing.sm }}>
    {photos.map((photo) => <View key={photo.label} style={{ width: tileWidth, minWidth: tileWidth, maxWidth: tileWidth, aspectRatio: 1, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surfaceSecondary }}>
      <Image source={photo.source} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      {editable && onRemovePhoto ? <PressableSurface accessibilityRole="button" accessibilityLabel={`Remove ${photo.label}`} onPress={() => onRemovePhoto(photo.label)} style={{ position: 'absolute', top: spacing.xs, right: spacing.xs, width: 24, height: 24, borderRadius: radius.pill, backgroundColor: colors.overlayStrong, alignItems: 'center', justifyContent: 'center' }}><X size={12} color={colors.contentOnDark} weight="bold" /></PressableSurface> : null}
    </View>)}
    {editable && onAddPhoto ? <PressableSurface accessibilityRole="button" accessibilityLabel="Add photos" onPress={onAddPhoto} style={{ width: tileWidth, minWidth: tileWidth, maxWidth: tileWidth, aspectRatio: 1, borderRadius: radius.lg, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.borderDefault, backgroundColor: colors.surfaceSecondary, alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingHorizontal: spacing.md }}><Plus size={24} color={colors.contentAction} weight="bold" /><Text style={[typography.bodyDefaultBold, { color: colors.contentAction, textAlign: 'center' }]}>Add photos</Text></PressableSurface> : null}
  </View>;
}

export function ListingDateField({ value, placeholder, onPress }: { value: string; placeholder: string; onPress: () => void }) {
  return <PressableSurface accessibilityRole="button" accessibilityLabel={value || placeholder} onPress={onPress} style={{ minHeight: 60, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.borderDefault, backgroundColor: colors.surfacePrimary, paddingHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text style={[typography.bodyLarge, { color: value ? colors.contentPrimary : colors.contentTertiary }]}>{value || placeholder}</Text><CalendarBlank size={24} color={colors.contentSecondary} weight="regular" /></PressableSurface>;
}

export function ListingSummaryRow({ label, value }: { label: string; value: string }) {
  return <View style={{ gap: 2 }}><Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>{label}</Text><Text style={typography.bodyDefaultBold}>{value}</Text></View>;
}

export function ListingSummarySegments({ items }: { items: string[] }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.xs, columnGap: spacing.xs }}>{items.map((item, index) => <View key={`${item}-${index}`} style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={[typography.bodyLarge, { color: colors.contentPrimary }]}>{item}</Text>{index === items.length - 1 ? null : <Text style={[typography.bodyLarge, { color: colors.borderDefault, marginHorizontal: spacing.sm }]}>•</Text>}</View>)}</View>;
}
