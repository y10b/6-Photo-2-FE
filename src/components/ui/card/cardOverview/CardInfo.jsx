import Link from "next/link";
import clsx from "clsx";

const getGradeColor = (grade) =>
  clsx("font-light", {
    "text-main": grade === "COMMON",
    "text-blue": grade === "RARE",
    "text-purple": grade === "SUPER_RARE",
    "text-pink": grade === "LEGENDARY",
  });

export default function CardInfo({
  type,
  title,
  price,
  cardGrade,
  CardGenre,
  nickname,
  quantityLeft,
  quantityTotal,
  description,
}) {
  const isExchange = type === "exchange";
  const myCard = type === "my_card";
  const forSaleSoldOut = type === "for_sale_soldout";

  return (
    <div className="mb-[10px] tablet:mb-[25.5px]">
      <h3 className="mb-[5px] tablet:mb-[10px] font-bold text-sm tablet:text-[22px] truncate">
        {title}
      </h3>

      {/* Info Part */}
      <div className="flex flex-wrap justify-between gap-2 mb-5">
        <div className="flex gap-[5px] tablet:gap-[10px] items-center flex-wrap">
          <span className={getGradeColor(cardGrade)}>{cardGrade}</span>
          <span className="font-normal text-gray400">|</span>
          <span className="font-normal text-gray300">{CardGenre}</span>
        </div>
        <Link href={`/users/${nickname}`} className="underline font-normal">
          {nickname}
        </Link>
      </div>

      <hr className="border-gray400 mb-1 tablet:mb-5" />

      <p className="text-gray300 font-light mb-[10px] tablet:mb-[20px] clamp-description">
        {description}
      </p>

      {!isExchange && (
        <>
          <div className="flex justify-between mb-[5px] tablet:mb-[10px]">
            <span className="font-light text-gray300">가격</span>
            <span className="font-normal">{price?.toLocaleString()}P</span>
          </div>

          <div className="flex justify-between">
            <span className="font-light text-gray300">
              {myCard ? "수량" : "잔여"}
            </span>
            <p className="font-light text-gray300">
              <span className="font-normal text-white">{quantityLeft}</span>
              {!myCard && type !== "for_sale" && !forSaleSoldOut && (
                <>/{quantityTotal}</>
              )}
            </p>
          </div>

          <h2 className="hidden tablet:block text-center font-baskin my-[30px] text-[18px]">
            최애<span className="text-main">의</span>포토
          </h2>
        </>
      )}
    </div>
  );
}
