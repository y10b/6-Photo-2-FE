import React, {useCallback, useMemo} from 'react';
import clsx from 'clsx';
import CardImage from './CardImage';
import CardInfo from './CardInfo';

export default function CardOverview({card, onCardClick}) {
  const {
    userCardId,
    type,
    title,
    imageUrl,
    createdAt,
    price,
    cardGenre,
    cardGrade,
    nickname,
    quantityLeft,
    quantityTotal,
    description,
    saleStatus,
    onClick,
    isLoading,
  } = card;

  const isExchangeBig = useMemo(() => type === 'exchange_big', [type]);
  const isExchangeBtn = useMemo(
    () => ['exchange_btn1', 'exchange_btn2'].includes(type),
    [type],
  );

  const containerClass = useMemo(() => {
    const baseClass =
      'cursor-pointer text-white rounded-[2px] border-1 border-white/10 bg-gray500';

    let sizeClass;

    if (isExchangeBig) {
      sizeClass =
        'w-[342px] h-[517px] pc:w-110 pc:h-[600px] text-base px-5 pt-5 pb-[30px] pc:px-10 pc:pt-10 pc:pb-10';
    } else if (isExchangeBtn) {
      sizeClass =
        'w-[170px] h-[315px] tablet:w-[342px] tablet:h-[560px] pc:w-110 pc:h-[670px] text-[10px] tablet:text-base px-[10px] pt-[10px] pb-[10px] tablet:px-5 tablet:pt-5 tablet:pb-[30px] pc:px-10 pc:pt-10 pc:pb-10';
    } else {
      sizeClass =
        'w-[170px] h-[234px] tablet:w-[342px] tablet:h-[517px] pc:w-110 pc:h-[600px] text-[10px] tablet:text-base px-[10px] pt-[10px] pb-[10px] tablet:px-5 tablet:pt-5 tablet:pb-[30px] pc:px-10 pc:pt-10 pc:pb-10';
    }

    return clsx(baseClass, sizeClass);
  }, [isExchangeBig, isExchangeBtn]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else if (onCardClick && userCardId) {
      onCardClick(userCardId);
    }
  }, [onClick, onCardClick, userCardId]);

  return (
    <div onClick={handleClick} className={containerClass}>
      <CardImage
        imageUrl={imageUrl}
        title={title}
        saleStatus={saleStatus}
        isExchangeBig={isExchangeBig}
      />
      <CardInfo
        type={type}
        title={title}
        price={price}
        createdAt={createdAt}
        cardGrade={cardGrade}
        cardGenre={cardGenre}
        nickname={nickname}
        quantityLeft={quantityLeft}
        quantityTotal={quantityTotal}
        description={description}
        isExchangeBig={isExchangeBig}
        onClick={onClick}
        isLoading={isLoading}
      />
    </div>
  );
}
