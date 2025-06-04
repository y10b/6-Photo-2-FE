'use client';
import Link from 'next/link';
import {CounterInput} from '../../input';
import gradeStyles from '@/utils/gradeStyles';

const CardDetailItem = ({card, quantity, onQuantityChange}) => {
  const {grade, genre, sellerNickname, initialQuantity} = card;

  const handleQuantityChange = newVal => {
    onQuantityChange(grade, newVal);
  };

  return (
    <div className="text-white bg-transparent">
      {/* 상단 정보: 등급, 장르, 판매자 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[10px] font-bold text-[18px] pc:text-2xl">
          <p className={gradeStyles[grade]}>{grade}</p>
          <div className="text-gray400">|</div>
          <p>{genre}</p>
        </div>
        <Link href="/" className="underline font-bold text-[18px] pc:text-2xl">
          {sellerNickname}
        </Link>
      </div>

      <hr className="my-[30px] text-gray400" />

      {/* 총 판매 수량 입력 */}
      <div className="mb-[10px] flex justify-between items-center">
        <span className="font-normal text-[18px] pc:text-xl text-gray300">
          총 판매 수량
        </span>
        <CounterInput
          initialValue={quantity}
          min={1}
          max={initialQuantity}
          onChange={handleQuantityChange}
          maxText={`${initialQuantity}장`}
          width="w-[144px] pc:w-[176px]"
          height="h-[45px] pc:h-[50px]"
        />
      </div>

      {/* 장당 가격 입력 */}
      <div className="mt-5 flex justify-between text-gray300">
        <span className="py-[9.5px] font-normal text-[18px] pc:text-xl">
          장당 가격
        </span>
        <div className="relative w-[202px] pc:w-[245px]">
          <input
            type="number"
            className="w-full h-[45px] pc:h-[50px] border rounded-[2px] pr-6 bg-black text-white text-right px-3"
            placeholder="가격 입력"
          />
          <span className="absolute top-1/2 right-3 -translate-y-1/2 font-bold text-[18px] pc:text-xl text-white pointer-events-none">
            P
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardDetailItem;
