// ModalRenderer.jsx
'use client';

import {useModal} from './ModalContext';
import AlertModal from './layout/AlertModal';
import ResponsiveModalWrapper from './ResponsiveModalWrapper';
import CardModal from './layout/CardModal';
import PointModal from './layout/PointModal';

export default function ModalRenderer() {
  const {isOpen, modalContent, closeModal} = useModal();

  if (!isOpen || !modalContent?.type) return null;

  if (modalContent.type === 'alert') {
    return (
      <AlertModal
        title={modalContent.title}
        description={modalContent.description}
        button={modalContent.button}
        onClose={closeModal}
      />
    );
  }

  if (modalContent.type === 'responsive') {
    return (
      <ResponsiveModalWrapper
        onClose={closeModal}
        variant={modalContent.variant}
      >
        {modalContent.children}
      </ResponsiveModalWrapper>
    );
  }

  if (modalContent.type === 'success' || modalContent.type === 'fail') {
    return <CardModal />;
  }

  // if (modalContent.type === 'point') {
  //   return (
  //     <PointModal onClose={closeModal}>{modalContent.children}</PointModal>
  //   );
  // }

  // ✅ custom 타입 처리 추가
  if (modalContent.type === 'custom') {
    return modalContent.children || modalContent.content || null;
  }

  return null;
}
