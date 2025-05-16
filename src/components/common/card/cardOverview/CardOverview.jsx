import React from "react";
import CardImage from "./CardImage";
import CardInfo from "./CardInfo";
import Button from "../../Button";

export default function CardOverview({ card }) {
  const {
    type,
    title,
    imageUrl,
    price,
    CardGenre,
    cardGrade,
    nickname,
    quantityLeft,
    quantityTotal,
    description,
    saleStatus,
  } = card;

  const isSoldOut = type === "soldout" || type === "for_sale_soldout";
  const isExchange = type === "exchange";
  const isForSale = type === "for_sale";

  return (
    <div className="font-noto text-[10px] tablet:text-base text-white w-[170px] tablet:w-[342px] pc:w-110 rounded-[2px] bg-gray500 px-[10px] tablet:px-5 pc:px-10 pt-[10px] tablet:pt-5 pc:pt-10 border border-white">
      <CardImage
        imageUrl={imageUrl}
        title={title}
        isSoldOut={isSoldOut}
        isForSale={isForSale}
        saleStatus={saleStatus}
      />

      <CardInfo
        type={type}
        title={title}
        price={price}
        cardGrade={cardGrade}
        CardGenre={CardGenre}
        nickname={nickname}
        quantityLeft={quantityLeft}
        quantityTotal={quantityTotal}
        description={description}
      />

      {isExchange && (
        /* 버튼 이후 수정 예정 */
        <div>
          <div className="block tablet:hidden pc:hidden ">
            <div className="flex gap-[5px] mb-[10px]">
              <Button role="proposal" size="sm" font="tiny" variant="outline">
                거절
              </Button>
              <Button role="proposal" size="sm" font="tiny" variant="primary">
                승인
              </Button>
            </div>
          </div>

          <div className="hidden tablet:block pc:hidden">
            <div className="flex gap-5 ">
              <Button
                role="proposal"
                size="md"
                font="default"
                variant="outline"
              >
                거절하기
              </Button>
              <Button
                role="proposal"
                size="md"
                font="default"
                variant="primary"
              >
                승인하기
              </Button>
            </div>
          </div>

          <div className="hidden tablet:hidden pc:block">
            <div className="flex gap-5">
              <Button role="proposal" size="lg" font="bigger" variant="outline">
                거절하기
              </Button>
              <Button role="proposal" size="lg" font="bigger" variant="primary">
                승인하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
