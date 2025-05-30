import React, {useCallback, useMemo} from 'react';
import clsx from 'clsx';
import CardImage from './CardImage';
import CardInfo from './CardInfo';
import Button from '@/components/common/Button';

const ActionButtons = () => (
  <>
    {/* 모바일 */}
    <div className="block tablet:hidden pc:hidden mb-[10px]">
      <div className="flex gap-[5px]">
        <Button role="proposal" variant="outline">
          거절
        </Button>
        <Button role="proposal" variant="primary">
          승인
        </Button>
      </div>
    </div>
    {/* 태블릿, PC */}
    <div className="hidden tablet:block pc:block tablet:mb-[25px] pc:mb-10">
      <div className="flex gap-5">
        <Button role="proposal" variant="outline">
          거절하기
        </Button>
        <Button role="proposal" variant="primary">
          승인하기
        </Button>
      </div>
    </div>
  </>
);

export default function CardOverview({card, onCardClick}) {
  const {
    userCardId: id,
    type,
    title,
    imageUrl,
    price,
    cardGenre,
    cardGrade,
    nickname,
    quantityLeft,
    quantityTotal,
    description,
    saleStatus,
  } = card;

  // 조건들은 useMemo로 메모이제이션
  const isSoldOut = useMemo(
    () => ['soldout', 'for_sale_soldout'].includes(type) || quantityLeft === 0,
    [type, quantityLeft],
  );

  const isExchange = useMemo(() => type === 'exchange', [type]);
  const isForSale = useMemo(() => type === 'for_sale', [type]);
  const isMyCard = useMemo(() => type === 'my_card', [type]);

  // containerClass도 useMemo로 계산
  const containerClass = useMemo(() => {
    const baseClass = 'text-white rounded-[2px] bg-gray500';
    const sizeClass = isMyCard
      ? 'w-[342px] pc:w-110 text-base px-5 pt-5 pb-[30px] pc:px-10 pc:pt-10 pc:pb-10'
      : 'w-[170px] tablet:w-[342px] pc:w-110 text-[10px] tablet:text-base px-[10px] pt-[10px] pb-[10px] tablet:px-5 tablet:pt-5 tablet:pb-[30px] pc:px-10 pc:pt-10 pc:pb-10';
    return clsx(baseClass, sizeClass);
  }, [isMyCard]);

  // 클릭 핸들러는 useCallback으로 메모이제이션
  const handleClick = useCallback(() => {
    if (onCardClick) onCardClick(card);
  }, [onCardClick, card]);

  return (
    <div onClick={handleClick} className={containerClass}>
      <CardImage
        imageUrl={imageUrl}
        title={title}
        isSoldOut={isSoldOut}
        isForSale={isForSale}
        saleStatus={saleStatus}
        isMyCard={isMyCard}
      />
      <CardInfo
        type={type}
        title={title}
        price={price}
        cardGrade={cardGrade}
        cardGenre={cardGenre}
        nickname={nickname}
        quantityLeft={quantityLeft}
        quantityTotal={quantityTotal}
        description={description}
      />
      {isExchange && <ActionButtons />}
    </div>
  );
}
