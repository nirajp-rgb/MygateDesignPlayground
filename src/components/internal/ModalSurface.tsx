import { Modal } from 'react-native';
import type { ModalProps } from 'react-native';

/** Internal primitive for animated/specialized overlays. Prefer ModalSheet. */
export function ModalSurface(props: ModalProps) {
  return <Modal {...props} />;
}
