import React from 'react';
import clsx from 'clsx';
import gradeStyles from '@/utils/gradeStyles';
import {formatCardGrade} from '@/utils/formatCardGrade';

export default function GradeGenreNickname({
  cardGrade,
  cardGenre,
  nickname,
  mobileOrTablet,
  showNickname = true, // ✅ 새 prop
}) {
  return (
    <div
      className={clsx(
        mobileOrTablet('mt-[7px]', 'mt-[5px]'),
        'tablet:mt-[7px]',
        mobileOrTablet('text-base', 'text-[10px]'),
        'tablet:text-base',
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-[3px]">
          <p className={clsx(gradeStyles[cardGrade], 'font-light')}>
            {formatCardGrade(cardGrade)}
          </p>
          <span className="font-normal text-gray400">|</span>
          <p className="font-normal text-gray300">{cardGenre}</p>
        </div>
        {showNickname && <p className="underline">{nickname}</p>}
      </div>
    </div>
  );
}
