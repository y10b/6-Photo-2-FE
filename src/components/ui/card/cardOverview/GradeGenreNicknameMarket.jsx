import React from 'react';
import clsx from 'clsx';
import gradeStyles from '@/utils/gradeStyles';
import {formatCardGrade} from '@/utils/formatCardGrade';

export default function GradeGenreNicknameMarket({
  cardGrade,
  cardGenre,
  nickname,
  mobileOrTablet,
}) {
  return (
    <div
      className={clsx(
        'font-bold flex justify-between items-start',
        mobileOrTablet('text-base mt-[7px]', 'text-[10px] mt-[5px]'),
        'tablet:text-base tablet:mt-[7px]',
      )}
    >
      <div className="flex tablet:gap-[7px]">
        <p className={gradeStyles[cardGrade]}>{formatCardGrade(cardGrade)}</p>
        <p className="text-gray400">|</p>
        <p className="text-gray300">{cardGenre}</p>
      </div>
      <p className="underline">{nickname}</p>
    </div>
  );
}
