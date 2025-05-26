'use client';

import React, {useState} from 'react';
import CardBasicItem from './CardBasicItem';
import BuyerCardItem from './BuyerCardItem';
import CardDetailItem from './CardDetailItem';
import SellerCardItem from './SellerCardItem';
import gradeStyles from '@/utils/gradeStyles';

const CardProfile = ({type, cards, exchangeCard}) => {
  const isBuyer = type === 'buyer';
  const isDetail = type === 'card_detail';
  const isSeller = type === 'seller';

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

  return (
    <div className="w-[345px] tablet:w-[342px] pc:w-[440px]">
      {cards.map(card => {
        const quantity = quantities[card.grade];

        if (isDetail) {
          return (
            <CardDetailItem
              key={`detail-${card.id}`}
              card={card}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
            />
          );
        }

        return (
          <div key={`item-${card.id}`}>
            <CardBasicItem card={card} gradeStyles={gradeStyles} />
            {isBuyer && (
              <BuyerCardItem
                card={card}
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
              />
            )}
            {isSeller &&
              exchangeCard.map((card, index) => (
                <SellerCardItem
                  key={`exchange-${index}`}
                  exchangeCard={card}
                  gradeStyles={gradeStyles}
                />
              ))}
          </div>
        );
      })}
    </div>
  );
};

export default CardProfile;
