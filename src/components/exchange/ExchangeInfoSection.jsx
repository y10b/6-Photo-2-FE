'use client';

import React from 'react';
import Button from '@/components/common/Button';
import {useModal} from '@/components/modal/ModalContext';
import ExchangeModal from './ExchangeModal';

export default function ExchangeInfoSection({info}) {
  const {description, grade, genre, myCards = []} = info;
  const {openModal} = useModal();

  const handleOpenModal = () => {
    openModal({
      type: 'responsive',
      variant: 'bottom',
      children: (
        <ExchangeModal
          myCards={myCards}
          onSelect={cardId => {
            console.log('선택된 카드:', cardId);
          }}
        />
      ),
    });
  };

  const gradeStyles = {
    COMMON: 'text-main',
    RARE: 'text-blue',
    SUPER_RARE: 'text-purple',
    LEGENDARY: 'text-pink',
  };

  return (
    <section className="mt-10 pt-5">
      {/* 제목 */}
      <h3 className="text-white text-[24px] font-bold mb-2">교환 희망 정보</h3>
      <hr className="border-t border-gray200 mb-5" />

      {/* 설명 */}
      <p className="text-white font-bold text-[18px] mb-5 whitespace-pre-wrap">
        {description}
      </p>

      {/* 희망 등급 & 장르 */}
      <div className="flex items-center gap-2 mb-10">
        <span
          className={`font-bold text-sm pc:text-base ${gradeStyles[grade]}`}
        >
          {grade}
        </span>
        <span className="text-gray400">|</span>
        <span className="text-gray300 text-sm pc:text-base">{genre}</span>
      </div>

      <Button role="exchange-confirm" onClick={handleOpenModal}>
        포토카드 교환하기
      </Button>
    </section>
  );
}
