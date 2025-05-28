'use client';

import { useModal } from './ModalContext';
import AlertModal from './layout/AlertModal';
import ResponsiveModalWrapper from './ResponsiveModalWrapper';
import CardModal from './layout/CardModal';

export default function ModalRenderer() {
  const { isOpen, modalContent, closeModal } = useModal();

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

  if (modalContent.type === 'custom') {
    return (
      <div className="fixed inset-0 z-[9999] bg-black">
        {modalContent.children}
      </div>
    );
  }

  return null;
}
