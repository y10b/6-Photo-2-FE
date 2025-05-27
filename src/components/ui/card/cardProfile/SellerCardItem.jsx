import Button from '@/components/common/Button';
import {formatCardGrade} from '@/utils/formatCardGrade';
import Image from 'next/image';
import React from 'react';

function SellerCardItem({exchangeCard, gradeStyles}) {
  const {grade, genre, description} = exchangeCard;

  return (
    <div className="mt-[78px]">
      {/* 헤더 */}
      <div className="mb-[10px] flex items-center gap-[10px]">
        <div className="relative w-[22px] h-[22px] pc:w-[24.61px] pc:h-[24.5px]">
          <Image src="/icons/ic_exchange.png" fill alt="exchange" />
        </div>
        <span className="text-[22px] pc:text-[28px] font-bold">
          교환 희망 정보
        </span>
      </div>

      <hr className="mb-[30px] border-2 border-gray200" />

      {/* 카드 정보 */}
      <div className="flex items-center gap-[11px] pc:gap-[15px] text-[18px] pc:text-2xl font-bold">
        <p className={gradeStyles[grade]}>{formatCardGrade(grade)}</p>
        <span className="text-gray400">|</span>
        <p className="text-gray300">{genre}</p>
      </div>

      <hr className="my-[30px] border-t text-gray400" />

      {/* 설명 */}
      <p className="mb-[54px] text-base pc:text-[18px] font-normal">
        {description}
      </p>

      {/* 액션 버튼 */}
      <div className="space-y-5">
        <Button role="exchange-confirm" onClick={() => {}}>
          수정하기
        </Button>
        <Button role="exchange-confirm" variant="outline" onClick={() => {}}>
          판매 내리기
        </Button>
      </div>
    </div>
  );
}

export default SellerCardItem;
