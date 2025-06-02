import React from 'react';
import clsx from 'clsx';
import ExchangeInfo from './ExchangeInfo';
import MarketInfo from './MarketInfo';

export default function CardInfo(props) {
  const {
    type,
    title,
    price,
    cardGrade,
    cardGenre,
    nickname,
    quantityLeft,
    createdAt,
    quantityTotal,
    description,
  } = props;

  const isExchange = ['exchange_btn1', 'exchange_btn2'].includes(type);
  const isExchangeBig = type === 'exchange_big';

  const mobileOrTablet = (tabletClass, mobileClass) =>
    isExchangeBig ? tabletClass : mobileClass;

  return (
    <div
      className={clsx(
        mobileOrTablet('mt-[25.5px]', 'mt-[10px]'),
        'tablet:mt-[25.5px] pc:mt-8',
      )}
    >
      {isExchange ? (
        <ExchangeInfo
          title={title}
          price={price}
          cardGrade={cardGrade}
          cardGenre={cardGenre}
          nickname={nickname}
          description={description}
          type={type}
          mobileOrTablet={mobileOrTablet}
        />
      ) : (
        <MarketInfo
          title={title}
          createdAt={createdAt}
          cardGrade={cardGrade}
          cardGenre={cardGenre}
          nickname={nickname}
          price={price}
          quantityLeft={quantityLeft}
          quantityTotal={quantityTotal}
          type={type}
          isExchangeBig={isExchangeBig}
          mobileOrTablet={mobileOrTablet}
        />
      )}
    </div>
  );
}
