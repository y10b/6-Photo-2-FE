'use client';

import React, {useState} from 'react';
import CardBasicItem from './CardBasicItem';
import BuyerCardItem from './BuyerCardItem';
import CardDetailItem from './CardDetailItem';
import gradeStyles from '@/utils/gradeStyles';

const CardProfile = ({type, cards}) => {
  const isBuyer = type === 'buyer';
  const isDetail = type === 'card_detail';

  const [quantities, setQuantities] = useState(() =>
    cards.reduce((acc, card) => {
      acc[card.grade] = 1;
      return acc;
    }, {}),
  );

  const handleQuantityChange = (grade, value) => {
    const parsed = Number(value);
    const newValue = !isNaN(parsed) && parsed > 0 ? parsed : '';

    setQuantities(prev => ({
      ...prev,
      [grade]: newValue,
    }));
  };

  if (isDetail) {
    return (
      <div className="font-noto w-[345px] tablet:w-[342px] pc:w-[440px]">
        {cards.map(card => (
          <CardDetailItem
            key={card.id || card.grade}
            card={card}
            quantity={quantities[card.grade] || 1}
            onQuantityChange={handleQuantityChange}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="font-noto w-[345px] tablet:w-[342px] pc:w-[440px]">
      {cards.map(card => (
        <CardBasicItem
          key={card.id || card.grade}
          card={card}
          gradeStyles={gradeStyles}
        />
      ))}
      {isBuyer &&
        cards.map(card => (
          <BuyerCardItem
            key={`buyer-${card.id || card.grade}`}
            card={card}
            quantity={quantities[card.grade] || 1}
            onQuantityChange={handleQuantityChange}
          />
        ))}
    </div>
  );
};

export default CardProfile;
