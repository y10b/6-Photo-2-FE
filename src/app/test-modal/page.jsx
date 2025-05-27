'use client';

import { useModal } from '@/components/modal/ModalContext';
import Button from '@/components/common/Button';
import ExchangeModal from '@/components/exchange/ExchangeModal';

export default function TestModalPage() {
  const { openModal } = useModal();

  const dummyCards = [
    {
      id: 1,
      title: '테스트 카드 1',
      cardGrade: 'RARE',
      cardGenre: 'FANTASY',
      imageUrl: 'https://picsum.photos/360/270?random=1',
      description: '테스트 카드입니다.',
      quantityLeft: 3,
      quantityTotal: 5,
      nickname: '나',
    },
    {
      id: 2,
      title: '테스트 카드 2',
      cardGrade: 'COMMON',
      cardGenre: 'TRAVEL',
      imageUrl: 'https://picsum.photos/360/270?random=2',
      description: '또 다른 테스트 카드입니다.',
      quantityLeft: 2,
      quantityTotal: 2,
      nickname: '나',
    },
  ];

  const handleOpenModal = () => {
    openModal({
      type: 'responsive',
      variant: 'bottom', // 모바일 바텀시트 / 데스크탑 모달 자동 대응
      children: (
        <ExchangeModal
          myCards={dummyCards}
          onSelect={(cardId) => {
            console.log('선택된 카드 ID:', cardId);
          }}
        />
      ),
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white gap-5">
      <h1 className="text-2xl font-bold">교환 바텀시트 테스트</h1>
      <Button role="exchange-confirm" onClick={handleOpenModal}>
        교환 모달 열기
      </Button>
    </div>
  );
}
