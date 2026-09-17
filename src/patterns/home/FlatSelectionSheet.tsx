import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native';
import { House, PlusCircle } from 'phosphor-react-native';
import { ListItem, NumberBadge, SurfaceCard } from '../../components';
import { colors, iconSize, radius, spacing, typography } from '../../tokens';

export type FlatSelectionOption = { id: string; flatLabel: string; societyLabel: string; badgeCount: number; isActive: boolean };

export function FlatSelectionSheet({ visible, flats, onDismiss }: { visible: boolean; flats: readonly FlatSelectionOption[]; onDismiss: () => void }) {
  const translateY = useRef(new Animated.Value(-320)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!visible) return;
    translateY.setValue(-320);
    opacity.setValue(0);
    Animated.parallel([Animated.timing(translateY, { toValue: 0, duration: 260, useNativeDriver: true }), Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true })]).start();
  }, [opacity, translateY, visible]);
  const close = () => Animated.parallel([Animated.timing(translateY, { toValue: -320, duration: 220, useNativeDriver: true }), Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true })]).start(({ finished }) => { if (finished) onDismiss(); });
  return <Modal visible={visible} animationType="none" transparent statusBarTranslucent onRequestClose={close}><View style={{ flex: 1 }}><Animated.View pointerEvents="none" style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.overlayBackdrop, opacity }]} /><Pressable accessibilityRole="button" accessibilityLabel="Close flat selector" style={{ flex: 1 }} onPress={close}><Animated.View style={{ transform: [{ translateY }], opacity }}><Pressable onPress={(event) => event.stopPropagation()}><SurfaceCard style={{ gap: 0, paddingTop: spacing.xxl, paddingRight: 0, paddingBottom: spacing.sm, paddingLeft: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: radius.xxl, borderBottomRightRadius: radius.xxl, overflow: 'hidden' }}><View style={{ overflow: 'hidden', borderBottomLeftRadius: radius.xxl, borderBottomRightRadius: radius.xxl }}>{flats.map((flat, index) => <ListItem key={flat.id} label={flat.flatLabel} paragraph={flat.societyLabel} size="Standard" artwork="Small" leadingArtwork={<House size={iconSize.lg} color={colors.contentPrimary} weight={flat.isActive ? 'fill' : 'regular'} />} labelStyle={flat.isActive ? typography.bodyLargeBold : typography.bodyLarge} controlElement={<NumberBadge count={flat.badgeCount} />} divider={index < flats.length - 1} />)}<ListItem label="Add Flat/Villa / office" size="Standard" artwork="Small" leadingArtwork={<PlusCircle size={iconSize.lg} color={colors.contentAction} weight="regular" />} labelStyle={{ ...typography.bodyLargeBold, color: colors.contentAction }} controlElement={null} /></View></SurfaceCard></Pressable></Animated.View></Pressable></View></Modal>;
}
