import React from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

export default function Card({
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
}) {
  const isSoldOut = type === "soldout" || type === "for_sale_soldout";
  const myCard = type === "my_card";
  const forSaleSoldOut = type === "for_sale_soldout";
  const isExchange = type === "exchange";
  const isForSale = type === "for_sale";

  return (
    <div className="font-noto text-[10px] tablet:text-base text-white w-[170px] tablet:w-[342px] pc:w-110 rounded-[2px] bg-gray500 px-[10px] tablet:px-5 pc:px-10 pt-[10px] tablet:pt-5 pc:pt-10 border border-white">
      <div className="w-[150px] tablet:w-[302px] pc:w-90 h-[112px] tablet:h-[226.5px] pc:h-[270px] mb-[10px] tablet:mb-[25.5px] pc:mb-[25px] relative">
        {/* 이미지 */}
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className={isSoldOut ? "opacity-30" : ""}
        />
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Image
              src="/soldout.png"
              alt="Sold Out"
              width={112}
              height={112}
              className="object-contain tablet:w-50 tablet:h-50"
            />
          </div>
        )}
        {isForSale && saleStatus && (
          <div
            className={`absolute top-[5px] tablet:top-[10px] left-[5px] tablet:left-[10px] px-2 py-[5px] tablet:py-[5.5px] bg-[rgba(0,0,0,0.5)] text-[10px] tablet:text-sm pc:text-base rounded-[2px] font-normal 
      ${saleStatus === "교환 제시 대기 중" ? "text-main" : "text-white"}`}
          >
            {saleStatus}
          </div>
        )}
      </div>

      {/* 텍스트 정보 */}
      <div className="mb-[10px] tablet:mb-[25.5px]">
        <h3 className="mb-[5px] tablet:mb-[10px] font-bold text-sm tablet:text-[22px] truncate overflow-hidden whitespace-nowrap">
          {title}
        </h3>

        {/* 카드 정보 상단 */}
        {isExchange ? (
          <>
            <div className="hidden pc:flex justify-between items-center mb-5 gap-x-3 flex-wrap">
              <div className="flex gap-[5px] tablet:gap-[10px] items-center flex-wrap">
                <span
                  className={clsx("font-light", {
                    "text-main": cardGrade === "COMMON",
                    "text-blue": cardGrade === "RARE",
                    "text-purple": cardGrade === "SUPER_RARE",
                    "text-pink": cardGrade === "LEGENDARY",
                  })}
                >
                  {cardGrade}
                </span>
                <span className="font-normal text-gray400">|</span>
                <span className="font-normal text-gray300">{CardGenre}</span>
              </div>
              <div className="flex gap-2 justify-between">
                <div className="font-normal text-gray400">|</div>
                <p className="font-normal text-[10px] tablet:text-base text-gray300 mr-4">
                  <span className="font-normal text-[10px] tablet:text-base text-white">
                    {price?.toLocaleString()}P{" "}
                  </span>
                  에 구매
                </p>
                <Link
                  href={`/users/${nickname}`}
                  className="underline font-normal"
                >
                  {nickname}
                </Link>
              </div>
            </div>

            <div className="pc:hidden">
              <div className="flex gap-[5px] tablet:gap-[10px] items-center flex-wrap mb-1">
                <span
                  className={clsx("font-light", {
                    "text-main": cardGrade === "COMMON",
                    "text-blue": cardGrade === "RARE",
                    "text-purple": cardGrade === "SUPER_RARE",
                    "text-pink": cardGrade === "LEGENDARY",
                  })}
                >
                  {cardGrade}
                </span>
                <span className="font-normal text-gray400">|</span>
                <span className="font-normal text-gray300">{CardGenre}</span>
              </div>
              <div className="flex justify-between mb-5">
                <p className="font-normal text-[10px] tablet:text-base text-gray300 mr-4">
                  <span className="font-normal text-[10px] tablet:text-base text-white">
                    {price?.toLocaleString()}P{" "}
                  </span>
                  에 구매
                </p>
                <Link
                  href={`/users/${nickname}`}
                  className="underline font-normal"
                >
                  {nickname}
                </Link>
              </div>
            </div>
          </>
        ) : (
          // 일반 카드 표시
          <div className="flex justify-between mb-1 tablet:mb-5">
            <div className="flex gap-[5px] tablet:gap-[10px] items-center flex-wrap">
              <span
                className={clsx("font-light", {
                  "text-main": cardGrade === "COMMON",
                  "text-blue": cardGrade === "RARE",
                  "text-purple": cardGrade === "SUPER_RARE",
                  "text-pink": cardGrade === "LEGENDARY",
                })}
              >
                {cardGrade}
              </span>
              <span className="font-normal text-gray400">|</span>
              <span className="font-normal text-gray300">{CardGenre}</span>
            </div>
            <Link href={`/users/${nickname}`} className="underline font-normal">
              {nickname}
            </Link>
          </div>
        )}

        <hr className="border-gray400 mb-1 tablet:mb-5" />

        <p className="text-gray300 font-light mb-[10px] tablet:mb-[20px] clamp-description">
          {description}
        </p>

        {/* 가격/잔여는 exchange 타입일 때 숨김 */}
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

        {isExchange && (
          <div className="flex justify-between">
            {/* 모바일: 거절 / 승인 */}
            <div className="flex justify-between w-full tablet:hidden">
              <button className="w-[72.5px] h-10 rounded-[2px] border border-gray100 py-[10px] font-bold text-[12px]">
                거절
              </button>
              <button className="w-[72.5px] h-10 rounded-[2px] py-[10px] bg-main font-bold text-[12px] text-black">
                승인
              </button>
            </div>

            {/* 태블릿 이상: 거절하기 / 수락하기 */}
            <div className="hidden tablet:flex justify-between w-full">
              <button className="w-[141px] pc:w-[170px] h-[55px] pc:h-[60px] rounded-[2px] py-[10px] border border-gray100 font-medium text-base pc:text-[18px] text-white">
                거절하기
              </button>
              <button className="w-[141px] pc:w-[170px] h-[55px] pc:h-[60px] rounded-[2px] py-[10px] bg-main font-bold text-base pc:text-[18px] text-black">
                승인하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
