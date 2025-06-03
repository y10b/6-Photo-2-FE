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
        'font-light flex flex-wrap justify-between items-start gap-y-2',
        mobileOrTablet('text-base mt-[7px]', 'text-[10px] mt-[5px]'),
        'tablet:text-base tablet:mt-[7px]',
      )}
    >
      <div className="flex gap-[5px] tablet:gap-[7px] flex-shrink-0 max-w-full overflow-hidden">
        <p className={`${gradeStyles[cardGrade]} truncate`}>
          {formatCardGrade(cardGrade)}
        </p>
        <p className="text-gray400 flex-shrink-0">|</p>
        <p className="text-gray300 truncate">{cardGenre}</p>
      </div>
      <p className="underline ml-auto">{nickname}</p>
    </div>
  );
}
