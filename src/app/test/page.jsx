'use client';

import CardModal from '@/components/modal/layout/CardModal';
import Button from '@/components/common/Button'; // 이미 있는 컴포넌트 사용
import {useModal} from '@/components/modal/ModalContext';

export default function TestModalPage() {
  const {openModal} = useModal();

  const handleOpen = () => {
    openModal({
      title: '테스트 모달 제목',
      description: '이것은 모달 설명입니다. 이미지가 잘 나오는지 확인해보세요.',
      button: {
        label: '확인',
        onClick: () => {
          alert('모달 버튼 클릭됨');
        },
      },
    });
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">모달 테스트 페이지</h1>
      <Button onClick={handleOpen}>모달 열기</Button>

      {/* 실제 모달 컴포넌트 포함 (렌더링은 ModalProvider 내부에서 자동 처리) */}
      <CardModal />
    </div>
  );
}
