import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Easing, Modal, Pressable, View, useWindowDimensions } from 'react-native';
import { colors, elevation, radius } from '../../tokens';
import { SurfaceCard } from '../layout/SurfaceCard';
import { AppHeader } from '../navigation/AppHeader';

export type ModalSheetPresentation = 'page' | 'full' | 'top' | 'bottom';
export type ModalSheetProps = { visible: boolean; onDismiss: () => void; children: ReactNode | ((dismiss: () => void) => ReactNode); title?: string; presentation?: ModalSheetPresentation; dismissAccessibilityLabel?: string };

export function ModalSheet({ visible, onDismiss, children, title, presentation = 'page', dismissAccessibilityLabel = 'Dismiss' }: ModalSheetProps) {
  const anchored = presentation === 'top' || presentation === 'bottom';
  const { height } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const reduceMotion = useRef(false);
  const isClosing = useRef(false);
  const activeAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const offscreenY = presentation === 'top' ? -height : height;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      reduceMotion.current = enabled;
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      reduceMotion.current = enabled;
    });
    return () => {
      subscription.remove();
      activeAnimation.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (!visible || !anchored) return;
    isClosing.current = false;
    activeAnimation.current?.stop();
    if (reduceMotion.current) {
      translateY.setValue(0);
      backdropOpacity.setValue(1);
      return;
    }
    translateY.setValue(offscreenY);
    backdropOpacity.setValue(0);
    activeAnimation.current = Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]);
    activeAnimation.current.start();
  }, [anchored, backdropOpacity, offscreenY, translateY, visible]);

  const dismiss = useCallback(() => {
    if (!anchored || reduceMotion.current) {
      onDismiss();
      return;
    }
    if (isClosing.current) return;
    isClosing.current = true;
    activeAnimation.current?.stop();
    activeAnimation.current = Animated.parallel([
      Animated.timing(translateY, {
        toValue: offscreenY,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]);
    activeAnimation.current.start(({ finished }) => {
      if (finished) onDismiss();
    });
  }, [anchored, backdropOpacity, offscreenY, onDismiss, translateY]);

  return (
    <Modal visible={visible} transparent={anchored} statusBarTranslucent={anchored} animationType={anchored ? 'none' : 'slide'} presentationStyle={anchored ? 'overFullScreen' : presentation === 'page' ? 'pageSheet' : 'fullScreen'} onRequestClose={dismiss}>
      <View style={{ flex: 1, justifyContent: presentation === 'bottom' ? 'flex-end' : 'flex-start', backgroundColor: anchored ? 'transparent' : colors.surfacePage }}>
        {anchored ? <Animated.View pointerEvents="none" style={{ position: 'absolute', inset: 0, backgroundColor: colors.overlayBackdrop, opacity: backdropOpacity }} /> : null}
        {anchored ? <Pressable accessibilityRole="button" accessibilityLabel={dismissAccessibilityLabel} onPress={dismiss} style={{ position: 'absolute', inset: 0 }} /> : null}
        <Animated.View style={[{ flex: anchored ? undefined : 1 }, anchored ? elevation.lg : null, anchored ? { transform: [{ translateY }] } : null]}>
          {anchored ? (
            <SurfaceCard
              borderWidth={0}
              style={{
                gap: 0,
                padding: 0,
                overflow: 'hidden',
                borderRadius: 0,
                borderBottomLeftRadius: presentation === 'top' ? radius.xl : 0,
                borderBottomRightRadius: presentation === 'top' ? radius.xl : 0,
                borderTopLeftRadius: presentation === 'bottom' ? radius.xl : 0,
                borderTopRightRadius: presentation === 'bottom' ? radius.xl : 0,
              }}
            >
              {title ? <AppHeader title={title} titleAlign="center" variant="solid" onBack={dismiss} /> : null}
              {typeof children === 'function' ? children(dismiss) : children}
            </SurfaceCard>
          ) : (
            <View style={{ flex: 1, backgroundColor: colors.surfacePage }}>
              {title ? <AppHeader title={title} titleAlign="center" variant="solid" onBack={dismiss} /> : null}
              {typeof children === 'function' ? children(dismiss) : children}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}
