import React from 'react';
import Button from '../common/Button';
import gradeStyles from '@/utils/gradeStyles';
import {formatCardGrade} from '@/utils/formatCardGrade';

function ExchangeInfoSection({
  exchangeGrade,
  exchangeGenre,
  exchangeDescription,
}) {
  if (!exchangeGrade && !exchangeGenre && !exchangeDescription) {
    return <div>교환 희망 정보를 불러오지 못했습니다.</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="mb-[10px] tablet:mb-5 font-bold text-2xl tablet:text-[32px] pc:text-[40px] ">
          교환 희망 정보
        </h3>
        <div className="hidden tablet:block">
          <Button role="exchange-confirm">포토카드 교환하기</Button>
        </div>
      </div>
      <hr className="mb-[46px] tablet:mb-10 pc:mb-12" />
      <div>
        <p className="mb-5 font-bold text-[18px] pc:text-2xl ">
          {exchangeDescription}
        </p>
        <div className="mb-10 tablet:mb-12 pc:mb-45 flex gap-[10px] tablet:gap-[11px] pc:gap-[15px] text-[18px] pc:text-2xl">
          <p className={`${gradeStyles[exchangeGrade]} pb-1 pc:pb-[6px]`}>
            {formatCardGrade(exchangeGrade)}
          </p>
          <p className="text-gray400">|</p>
          <p className="text-gray300">{exchangeGenre}</p>
        </div>
      </div>
      <div className="mb-10 block tablet:hidden">
        <Button role="exchange-confirm">포토카드 교환하기</Button>
      </div>
    </div>
  );
}

export default ExchangeInfoSection;
