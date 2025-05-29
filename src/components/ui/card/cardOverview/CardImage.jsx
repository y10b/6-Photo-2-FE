import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';

const getImageContainerClass = isMyCard =>
  clsx(
    'relative',
    isMyCard ? 'w-[305px] h-[228.75px]' : 'w-[150px] h-[112px]',
    'tablet:w-[302px] pc:w-90 tablet:h-[226.5px] pc:h-[270px]',
    'mb-[10px] tablet:mb-[25.5px] pc:mb-[25px]',
  );

const SoldOutOverlay = () => (
  <div className="absolute inset-0 flex items-center justify-center z-10">
    <Image
      src="/images/soldout.png"
      alt="Sold Out"
      width={112}
      height={112}
      className="object-contain tablet:w-50 pc:w-[230px] tablet:h-50 pc:h-[230px]"
    />
  </div>
);

const SaleStatusBadge = ({status}) => (
  <div
    className={clsx(
      'absolute top-[5px] tablet:top-[10px] left-[5px] tablet:left-[10px] px-2 py-[5px] tablet:py-[5.5px] bg-[rgba(0,0,0,0.5)] text-[10px] tablet:text-sm pc:text-base rounded-[2px] font-normal',
      {
        'text-main': status === '교환 제시 대기 중',
        'text-white': status !== '교환 제시 대기 중',
      },
    )}
  >
    {status}
  </div>
);

export default function CardImage({
  imageUrl,
  title,
  isSoldOut,
  isForSale,
  saleStatus,
  isMyCard = false,
}) {
  const safeImageUrl = imageUrl || '/images/fallback.png';
  const safeAlt = title || '포토카드 이미지';

  return (
    <div className={getImageContainerClass(isMyCard)}>
      {/* 이미지가 없으면 fallback, alt도 기본값 지정 */}
      <Image
        src={safeImageUrl}
        alt={safeAlt}
        fill
        style={{objectFit: 'cover'}}
        className={clsx('rounded-[2px]', {'opacity-30': isSoldOut})}
        unoptimized
      />
      {isSoldOut && <SoldOutOverlay />}
      {!isSoldOut && isForSale && saleStatus && (
        <SaleStatusBadge status={saleStatus} />
      )}
    </div>
  );
}
