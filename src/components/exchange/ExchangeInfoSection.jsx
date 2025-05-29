'use client';

import Button from '@/components/common/Button';
import {useModal} from '@/components/modal/ModalContext';
import ExchangeModal from './ExchangeModal';

export default function ExchangeInfoSection({info}) {
  const {targetCardId, description, grade, genre, myCards} = info;
  const {openModal} = useModal();

  const handleOpenModal = () => {
    openModal({
      type: 'responsive',
      variant: 'bottom',
      children: <ExchangeModal myCards={myCards} targetCardId={targetCardId} />,
    });
  };

  return (
    <section className="mt-10 pt-5 mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
      <h3 className="text-white text-[24px] font-bold mb-2">교환 희망 정보</h3>
      <hr className="border-t border-gray200 mb-5" />
      <p className="text-white font-bold text-[18px] mb-5 whitespace-pre-wrap">
        {description}
      </p>
      <div className="flex items-center gap-2 mb-10">
        <span className="font-bold text-sm text-blue">{grade}</span>
        <span className="text-gray400">|</span>
        <span className="text-gray300 text-sm">{genre}</span>
      </div>
      <Button role="exchange-confirm" onClick={handleOpenModal}>
        포토카드 교환하기
      </Button>
    </section>
  );
}
