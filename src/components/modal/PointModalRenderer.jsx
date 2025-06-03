'use client';

import { useModal } from './ModalContext';
import PointModal from './layout/PointModal';

export default function PointModalRenderer() {
  const { isOpen, modalContent, closeModal } = useModal();

  if (!isOpen || modalContent?.type !== 'point') return null;

  return (
    <PointModal onClose={closeModal}>
      {modalContent.children}
    </PointModal>
  );
}
