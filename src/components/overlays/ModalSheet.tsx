import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { colors, elevation, radius } from '../../tokens';
import { AppHeader } from '../navigation/AppHeader';

export type ModalSheetPresentation = 'page' | 'full' | 'top' | 'bottom';
export type ModalSheetProps = { visible: boolean; onDismiss: () => void; children: ReactNode; title?: string; presentation?: ModalSheetPresentation };

export function ModalSheet({ visible, onDismiss, children, title, presentation = 'page' }: ModalSheetProps) {
  const anchored = presentation === 'top' || presentation === 'bottom';
  return (
    <Modal visible={visible} transparent={anchored} animationType={anchored ? 'fade' : 'slide'} presentationStyle={presentation === 'page' ? 'pageSheet' : 'fullScreen'} onRequestClose={onDismiss}>
      <View style={{ flex: 1, justifyContent: presentation === 'bottom' ? 'flex-end' : 'flex-start', backgroundColor: anchored ? colors.contentOnContrast : colors.surfacePage }}>
        {anchored ? <Pressable accessibilityRole="button" accessibilityLabel="Dismiss" onPress={onDismiss} style={{ position: 'absolute', inset: 0 }} /> : null}
        <View style={[{ flex: anchored ? undefined : 1, backgroundColor: colors.surfacePage, borderBottomLeftRadius: presentation === 'top' ? radius.xxl : 0, borderBottomRightRadius: presentation === 'top' ? radius.xxl : 0, borderTopLeftRadius: presentation === 'bottom' ? radius.xxl : 0, borderTopRightRadius: presentation === 'bottom' ? radius.xxl : 0 }, anchored ? elevation.lg : null]}>
          {title ? <AppHeader title={title} titleAlign="center" variant="solid" onBack={onDismiss} /> : null}
          {children}
        </View>
      </View>
    </Modal>
  );
}
