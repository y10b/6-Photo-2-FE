'use client';

import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';

export default function CardImage({
  imageUrl,
  title,
  isSoldOut,
  isForSale,
  saleStatus,
}) {
  const containerClass =
    'relative w-[150px] tablet:w-[302px] pc:w-90 h-[112px] tablet:h-[226.5px] pc:h-[270px] mb-[10px] tablet:mb-[25.5px] pc:mb-[25px]';

  const imageClass = clsx('rounded-[2px]', {
    'opacity-30': isSoldOut,
  });

  const statusBadgeClass = clsx(
    'absolute top-[5px] tablet:top-[10px] left-[5px] tablet:left-[10px] px-2 py-[5px] tablet:py-[5.5px] bg-[rgba(0,0,0,0.5)] text-[10px] tablet:text-sm pc:text-base rounded-[2px] font-normal',
    {
      'text-main': saleStatus === '교환 제시 대기 중',
      'text-white': saleStatus !== '교환 제시 대기 중',
    },
  );

  return (
    <div className={containerClass}>
      <Image
        src={imageUrl}
        alt={title}
        fill
        style={{objectFit: 'cover'}}
        className={imageClass}
        unoptimized
      />

      {isSoldOut && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Image
            src="/images/soldout.png"
            alt="Sold Out"
            width={112}
            height={112}
            className="object-contain tablet:w-50 pc:w-[230px] tablet:h-50 pc:h-[230px]"
          />
        </div>
      )}

      {isForSale && saleStatus && (
        <div className={statusBadgeClass}>{saleStatus}</div>
      )}
    </div>
  );
}
