import React from 'react';
import clsx from 'clsx';
import Title from './Title';
import GradeGenreNickname from './GradeGenreNickname';
import ExchangeButtons from './ExchangeButtons';

export default function ExchangeInfo({
  title,
  price,
  cardGrade,
  cardGenre,
  nickname,
  description,
  type,
  mobileOrTablet,
}) {
  return (
    <>
      <div className="flex justify-between">
        <Title title={title} mobileOrTablet={mobileOrTablet} />
      </div>

      <GradeGenreNickname
        cardGrade={cardGrade}
        cardGenre={cardGenre}
        nickname={nickname}
        mobileOrTablet={mobileOrTablet}
      />

      <div
        className={clsx(
          mobileOrTablet('mt-[7px]', 'mt-[5px]'),
          'tablet:mt-[7px]',
          mobileOrTablet('text-base', 'text-[10px]'),
          'tablet:text-base',
        )}
      >
        <div className="flex justify-between items-center font-normal">
          <p>
            {price.toLocaleString()} P{' '}
            <span className="text-gray300">에 구매</span>
          </p>
        </div>
      </div>

      <hr
        className={clsx(
          mobileOrTablet('my-5', 'my-[10px]'),
          'tablet:my-5 border border-gray400',
        )}
      />

      <p
        className={clsx(
          'font-normal whitespace-pre-line line-clamp-2',
          mobileOrTablet('text-base', 'text-[10px]'),
          'tablet:text-base',
        )}
      >
        {description}
      </p>

      <ExchangeButtons type={type} mobileOrTablet={mobileOrTablet} />
    </>
  );
}
