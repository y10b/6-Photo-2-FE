'use client';

import React, {useMemo} from 'react';
import Image from 'next/image';
import clsx from 'clsx';

/**  이미지 컨테이너 클래스 반환 */
const getImageContainerClass = isExchangeBig =>
  clsx(
    'relative',
    isExchangeBig ? 'w-[305px] h-[228.75px]' : 'w-[150px] h-[112px]',
    'tablet:w-[302px] pc:w-90 tablet:h-[226.5px] pc:h-[270px]',
    'mb-[10px] tablet:mb-[25.5px] pc:mb-[25px]',
  );

/**  솔드아웃 오버레이 */
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

/**  상태 배지 */
const SaleStatusBadge = ({status}) => {
  const badgeClass = clsx(
    'absolute top-[5px] tablet:top-[10px] left-[5px] tablet:left-[10px]',
    'px-2 py-[5px] tablet:py-[5.5px]',
    'bg-[rgba(0,0,0,0.5)] text-[10px] tablet:text-sm pc:text-base',
    'rounded-[2px] font-normal z-10',
    {
      'text-main': status === '교환 제시 대기 중',
      'text-white': status !== '교환 제시 대기 중',
    },
  );

  return <div className={badgeClass}>{status}</div>;
};

/**  메인 컴포넌트 */
function CardImage({
  imageUrl,
  title,
  saleStatus, // 'sale' | 'exchange' | 'soldout'
  isExchangeBig = false,
  type, // 카드 타입
}) {
  // 단순한 계산은 useMemo 제거
  const isExchangeType = [
    'exchange_btn1',
    'exchange_btn2',
    'exchange_big',
  ].includes(type);
  const isSoldOut = !isExchangeType && saleStatus === 'soldout';
  const isForSale =
    !isExchangeType &&
    type !== 'market' &&
    (saleStatus === 'sale' || saleStatus === 'exchange');

  // 복잡한 계산만 useMemo 유지
  const saleStatusText = useMemo(() => {
    if (isExchangeType) return '';

    switch (saleStatus) {
      case 'exchange':
        return '교환 제시 대기 중';
      case 'sale':
        return '판매 중';
      default:
        return '';
    }
  }, [isExchangeType, saleStatus]);

  return (
    <div className={getImageContainerClass(isExchangeBig)}>
      <Image
        src={imageUrl}
        alt={title}
        fill
        unoptimized
        style={{objectFit: 'cover'}}
        className={clsx('rounded-[2px] select-none pointer-events-none', {
          'opacity-30': isSoldOut,
        })}
        onContextMenu={e => e.preventDefault()}
      />
      {isSoldOut && <SoldOutOverlay />}
      {isForSale && <SaleStatusBadge status={saleStatusText} />}
    </div>
  );
}

// React.memo로 컴포넌트 메모이제이션
export default React.memo(CardImage);
