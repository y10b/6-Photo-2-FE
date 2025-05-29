import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import gradeStyles from '@/utils/gradeStyles';

const getGradeColor = grade => clsx('font-light', gradeStyles[grade]);

export default function CardInfo({
  type,
  title,
  price,
  cardGrade,
  cardGenre,
  nickname,
  quantityLeft,
  quantityTotal,
  description,
}) {
  const isExchange = type === 'exchange';
  const isMyCard = type === 'my_card';
  const showCount = ['for_sale', 'soldout', 'for_sale_soldout'].includes(type);

  return (
    <div className="mb-[10px] tablet:mb-[25.5px]">
      <h3 className="mb-[5px] tablet:mb-[10px] font-bold text-sm tablet:text-[22px] truncate">
        {title}
      </h3>

      <div className="flex flex-wrap justify-between gap-2 mb-5">
        <div className="flex gap-[5px] tablet:gap-[10px] items-center flex-wrap">
          <span className={getGradeColor(cardGrade)}>{cardGrade}</span>
          <span className="font-normal text-gray400">|</span>
          <span className="font-normal text-gray300">{cardGenre}</span>
        </div>
        <Link href={`/users/${nickname}`} className="underline font-normal">
          {nickname}
        </Link>
      </div>

      <hr className="border-gray400 mb-1 tablet:mb-5" />
      <p className="text-gray300 font-light mb-[10px] tablet:mb-[20px] clamp-description">
        {description}
      </p>

      {!isExchange && (
        <>
          <div className="flex justify-between mb-[5px] tablet:mb-[10px]">
            <span className="font-light text-gray300">가격</span>
            <span className="font-normal">{price?.toLocaleString()}P</span>
          </div>
          <div className="flex justify-between">
            <span className="font-light text-gray300">
              {isMyCard ? '수량' : '잔여'}
            </span>
            <p className="font-light text-gray300">
              {showCount ? (
                <>
                  <span className="font-normal text-white">{quantityLeft}</span>
                  /<span className="font-normal">{quantityTotal}</span>
                </>
              ) : (
                <span className="font-normal text-white">{quantityLeft}</span>
              )}
            </p>
          </div>
          <div className="relative mx-auto hidden tablet:block mt-[30px] w-25 h-[18px]">
            <img src="logo.svg" alt="logo" />
          </div>
        </>
      )}
    </div>
  );
}
