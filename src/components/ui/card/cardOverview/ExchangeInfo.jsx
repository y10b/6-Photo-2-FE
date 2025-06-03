import React from 'react';
import clsx from 'clsx';
import Title from './Title';
import GradeGenreNickname from './GradeGenreNickname';
import ExchangeButtons from './ExchangeButtons';
import gradeStyles from '@/utils/gradeStyles';
import {formatCardGrade} from '@/utils/formatCardGrade';

export default function ExchangeInfo({
  title,
  price,
  cardGrade,
  cardGenre,
  nickname,
  description,
  type,
  mobileOrTablet,
  onClick, // ✅ 추가
  isLoading, // ✅ 추가
}) {
  return (
    <>
      {/* 타이틀 */}
      <div className="flex justify-between">
        <Title title={title} mobileOrTablet={mobileOrTablet} />
      </div>

      {/* PC + 모바일 분기 레이아웃 */}
      <div
        className={clsx(
          'w-full',
          mobileOrTablet('mt-[7px]', 'mt-[5px]'),
          'tablet:mt-[7px]',
          mobileOrTablet('text-base', 'text-[10px]'),
          'tablet:text-base',
        )}
      >
        {/* PC (tablet 이상) */}
        <div className="hidden tablet:block font-normal w-full">
          <div className="flex flex-wrap justify-between items-center">
            {/* 왼쪽: 등급 | 장르 | 가격 */}
            <div className="flex items-center gap-2 flex-wrap">
              <p className={clsx(gradeStyles[cardGrade], 'font-light')}>
                {formatCardGrade(cardGrade)}
              </p>
              <span className="font-normal text-gray400">|</span>
              <p className="font-normal text-gray300">{cardGenre}</p>
              <span className="font-normal text-gray400">|</span>
              <p>
                {price.toLocaleString()} P
                <span className="text-gray300">에 구매</span>
              </p>
            </div>
            {/* 오른쪽: 닉네임 (너비 부족 시 다음 줄로 감) */}
            <div className="w-full flex justify-end mt-[10px]">
              <p className="underline">{nickname}</p>
            </div>
          </div>
        </div>

        {/* 모바일 */}
        <div className="tablet:hidden">
          <GradeGenreNickname
            cardGrade={cardGrade}
            cardGenre={cardGenre}
            nickname={nickname}
            mobileOrTablet={mobileOrTablet}
            showNickname={false}
          />

          <div className="flex justify-between items-center font-normal mt-[5px]">
            <p>
              {price.toLocaleString()} P
              <span className="text-gray300">에 구매</span>
            </p>
            <p className="underline">{nickname}</p>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <hr
        className={clsx(
          mobileOrTablet('my-5', 'my-[10px]'),
          'tablet:my-5 border border-gray400',
        )}
      />

      {/* 설명 */}
      <p
        className={clsx(
          'font-normal whitespace-pre-line line-clamp-2',
          mobileOrTablet('text-base', 'text-[10px]'),
          'tablet:text-base',
        )}
      >
        {description}
      </p>

      {/* 버튼 */}
      <ExchangeButtons
        type={type}
        mobileOrTablet={mobileOrTablet}
        onClick={onClick} // ✅ 전달
        isLoading={isLoading} // ✅ 전달
      />
    </>
  );
}
