import React, {useCallback, useMemo} from 'react';
import clsx from 'clsx';
import CardImage from './CardImage';
import CardInfo from './CardInfo';

export default function CardOverview({card, onCardClick, onAccept, onReject}) {
  const {
    userCardId: id,
    shopId,
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
  } = card;

  // 조건들은 useMemo로 메모이제이션
  const isExchangeBig = useMemo(() => type === 'exchange_big', [type]);

  // exchange 관련 타입인지 확인
  const isExchangeType = useMemo(
    () => ['exchange_btn1', 'exchange_btn2', 'exchange_big'].includes(type),
    [type],
  );

  // containerClass도 useMemo로 계산
  const containerClass = useMemo(() => {
    const baseClass =
      'cursor-pointer text-white rounded-[2px] border-1 border-white/10 bg-gray500';
    const sizeClass = isExchangeBig
      ? 'w-[342px] pc:w-110 text-base px-5 pt-5 pb-[30px] pc:px-10 pc:pt-10 pc:pb-10'
      : 'w-[170px] tablet:w-[342px] pc:w-110 text-[10px] tablet:text-base px-[10px] pt-[10px] pb-[10px] tablet:px-5 tablet:pt-5 tablet:pb-[30px] pc:px-10 pc:pt-10 pc:pb-10';

    return clsx(baseClass, sizeClass);
  }, [isExchangeBig]);

  // 클릭 핸들러는 useCallback으로 메모이제이션
  const handleClick = useCallback(() => {
    if (onCardClick) onCardClick(card);
  }, [onCardClick, card]);

  return (
    <div onClick={handleClick} className={containerClass}>
      <CardImage
        imageUrl={imageUrl}
        title={title}
        saleStatus={isExchangeType ? undefined : saleStatus} // exchange 타입일 때는 saleStatus를 전달하지 않음
        isExchangeBig={isExchangeBig}
        type={type}
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
        onAccept={onAccept}
        onReject={onReject}
      />
    </div>
  );
}