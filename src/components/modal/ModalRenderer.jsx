'use client';

import {useModal} from './ModalContext';
import AlertModal from './layout/AlertModal';
import ResponsiveModalWrapper from './ResponsiveModalWrapper';
import CardModal from './layout/CardModal';

export default function ModalRenderer() {
  const {isOpen, modalContent, closeModal} = useModal();
  if (!isOpen || !modalContent?.type) return null;

  // 알림형 모달일 때
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

  // 데스크탑 = 모달, 태블릿/모바일 = 바텀시트인 경우
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

  // 랜덤포인트 모달일 때
  if (modalContent.type === 'point') {
    return (
      <PointModal onClose={closeModal}>{modalContent.children}</PointModal>
    );
  }

  return null;
}
