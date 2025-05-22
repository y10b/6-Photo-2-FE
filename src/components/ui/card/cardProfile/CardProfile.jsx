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

  const [quantities, setQuantities] = useState(() =>
    cards.reduce((acc, card) => {
      acc[card.grade] = 1;
      return acc;
    }, {})
  );

  const handleQuantityChange = (grade, value) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setQuantities((prev) => ({ ...prev, [grade]: parsed }));
    } else if (value === "") {
      setQuantities((prev) => ({ ...prev, [grade]: "" }));
    }
  };

  return (
    <div className="font-noto w-[345px] tablet:w-[342px] pc:w-[440px]">
      {isDetail ? (
        cards.map((card) => (
          <CardDetailItem
            key={card.grade}
            card={card}
            quantity={quantities[card.grade] || 1}
            onQuantityChange={handleQuantityChange}
          />
        ))
      ) : (
        <>
          {cards.map((card) => (
            <CardBasicItem
              key={card.grade}
              card={card}
              gradeStyles={gradeStyles}
            />
          ))}
          {isBuyer &&
            cards.map((card) => (
              <BuyerCardItem
                key={`buyer-${card.grade}`}
                card={card}
                quantity={quantities[card.grade] || 1}
                onQuantityChange={handleQuantityChange}
              />
            ))}
        </>
      )}
    </div>
  );
};

export default CardProfile;
