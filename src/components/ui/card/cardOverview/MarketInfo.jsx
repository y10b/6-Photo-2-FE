import React from 'react';
import clsx from 'clsx';
import Title from './Title';
import GradeGenreNicknameMarket from './GradeGenreNicknameMarket';
import PriceQuantity from './PriceQuantity';
import {formatDate} from '@/utils/formatRelativeTime';

export default function MarketInfo({
  title,
  createdAt,
  cardGrade,
  cardGenre,
  nickname,
  price,
  quantityLeft,
  quantityTotal,
  type,
  isExchangeBig,
  mobileOrTablet,
}) {
  const isMarket = type === 'market';

  return (
    <>
      <div className="flex flex-wrap justify-between items-start gap-y-2">
        <Title title={title} mobileOrTablet={mobileOrTablet} />
        <p className="text-[8px] tablet:text-sm text-gray300 flex-shrink-0 ml-auto">
          {formatDate(createdAt)}
        </p>
      </div>

      <GradeGenreNicknameMarket
        cardGrade={cardGrade}
        cardGenre={cardGenre}
        nickname={nickname}
        mobileOrTablet={mobileOrTablet}
      />

      <hr
        className={clsx(
          mobileOrTablet('my-5', 'my-[10px]'),
          'tablet:my-5 border border-gray400',
        )}
      />

      <PriceQuantity
        price={price}
        quantityLeft={quantityLeft}
        quantityTotal={quantityTotal}
        isMarket={isMarket}
        type={type}
        mobileOrTablet={mobileOrTablet}
      />

      <div
        className={clsx(
          isExchangeBig ? 'flex' : 'hidden tablet:flex',
          'justify-center mt-[30px] pc:mt-[47px]',
        )}
      >
        <img src="/images/logo.svg" alt="로고" className="w-[99.25px] h-auto" />
      </div>
    </>
  );
}
