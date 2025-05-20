"use client";

import React, { useState } from "react";

import CardBasicItem from "./CardBasicItem";
import BuyerCardItem from "./BuyerCardItem";
import CardDetailItem from "./CardDetailItem";

const gradeStyles = {
  COMMON: "text-main",
  RARE: "text-blue",
  SUPER_RARE: "text-purple",
  LEGENDARY: "text-pink",
};

const CardProfile = ({ type, cards }) => {
  const isBuyer = type === "buyer";
  const isDetail = type === "card_detail";

  // 카드별 수량 상태 관리
  const [quantities, setQuantities] = useState(() =>
    cards.reduce((acc, card) => {
      acc[card.cardGrade] = 1;
      return acc;
    }, {})
  );

  const handleQuantityChange = (cardGrade, value) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setQuantities((prev) => ({
        ...prev,
        [cardGrade]: parsed,
      }));
    } else if (value === "") {
      setQuantities((prev) => ({
        ...prev,
        [cardGrade]: "",
      }));
    }
  };

  return (
    <div className="font-noto w-[345px] tablet:w-[342px] pc:w-[440px]">
      {isDetail ? (
        cards.map((card) => (
          <CardDetailItem
            key={card.cardGrade}
            card={card}
            quantity={quantities[card.cardGrade] || 1}
            onQuantityChange={handleQuantityChange}
          />
        ))
      ) : (
        <>
          {cards.map((card) => (
            <CardBasicItem
              key={card.cardGrade}
              card={card}
              gradeStyles={gradeStyles}
            />
          ))}
          {isBuyer &&
            cards.map((card) => (
              <BuyerCardItem
                key={`buyer-${card.cardGrade}`}
                card={card}
                quantity={quantities[card.cardGrade] || 1}
                onQuantityChange={handleQuantityChange}
              />
            ))}
        </>
      )}
    </div>
  );
};

export default CardProfile;
