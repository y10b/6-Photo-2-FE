import React from 'react';
import clsx from 'clsx';

export default function PriceQuantity({
  price,
  quantityLeft,
  quantityTotal,
  isMarket,
  type,
  mobileOrTablet,
}) {
  const quantityLabel =
    type === 'my_sale' ? '잔여' : isMarket ? '잔여' : '수량';

  return (
    <div
      className={clsx(
        'font-bold',
        mobileOrTablet('text-base', 'text-[10px]'),
        'tablet:text-base',
      )}
    >
      <div className="flex justify-between">
        <label className="text-gray300">가격</label>
        <p>{price.toLocaleString()} P</p>
      </div>
      <div
        className={clsx(
          mobileOrTablet('mt-[10px] pc:mt-[11.5px]', 'mt-[5px]'),
          'tablet:mt-[10px] pc:mt-[11.5px] flex justify-between',
        )}
      >
        <label className="text-gray300">{quantityLabel}</label>
        <div className="flex">
          <p>{quantityLeft}</p>
          {isMarket && (
            <p className="ml-[2px] tablet:ml-[5px] text-gray300">
              {' '}
              / {quantityTotal}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
