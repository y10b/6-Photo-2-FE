import React, {useMemo} from 'react';
import clsx from 'clsx';
import CardImage from './CardImage';
import CardInfo from './CardInfo';

function CardOverview({card, onCardClick, onAccept, onReject}) {
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

  // 단순한 계산은 useMemo 제거
  const isExchangeBig = type === 'exchange_big';
  const isExchangeType = [
    'exchange_btn1',
    'exchange_btn2',
    'exchange_big',
  ].includes(type);

  // 복잡한 클래스 계산만 useMemo 유지
  const containerClass = useMemo(() => {
    const baseClass =
      'cursor-pointer text-white rounded-[2px] border-1 border-white/10 bg-gray500';
    const sizeClass = isExchangeBig
      ? 'w-[342px] pc:w-110 text-base px-5 pt-5 pb-[30px] pc:px-10 pc:pt-10 pc:pb-10'
      : 'w-[170px] tablet:w-[342px] pc:w-110 text-[10px] tablet:text-base px-[10px] pt-[10px] pb-[10px] tablet:px-5 tablet:pt-5 tablet:pb-[30px] pc:px-10 pc:pt-10 pc:pb-10';

    return clsx(baseClass, sizeClass);
  }, [isExchangeBig]);

  // 단순한 클릭 핸들러
  const handleClick = () => {
    if (onCardClick) onCardClick(card);
  };

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

// React.memo로 컴포넌트 메모이제이션
export default React.memo(CardOverview);
