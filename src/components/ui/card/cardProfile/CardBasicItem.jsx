import Link from 'next/link';
import {formatCardGrade} from '@/utils/formatCardGrade';

const CardBasicItem = ({card, gradeStyles}) => {
  const {
    grade,
    genre,
    sellerNickname,
    description,
    price,
    remainingQuantity,
    initialQuantity,
  } = card;

  return (
    <div className="text-white bg-transparent">
      {/* 상단 정보: 등급, 장르, 판매자 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[10px] font-bold text-[18px] pc:text-2xl">
          <p className={gradeStyles[grade]}>{formatCardGrade(grade)}</p>
          <div className="text-gray400">|</div>
          <p className="text-gray300">{genre}</p>
        </div>
        {/* 이후 변경 예정 */}
        <p className="underline font-bold text-[18px] pc:text-2xl">
          {sellerNickname}
        </p>
      </div>

      <hr className="my-[30px] text-gray400" />

      {/* 설명 */}
      <p className="font-normal text-base pc:text-[18px] text-white">
        {description}
      </p>

      <hr className="my-[30px] text-gray400" />

      {/* 가격 */}
      <div className="mb-[10px] flex justify-between">
        <span className="font-normal text-[18px] pc:text-xl text-gray300">
          가격
        </span>
        <p className="font-bold text-xl pc:text-2xl">
          {price.toLocaleString()}P
        </p>
      </div>

      {/* 수량 */}
      <div className="flex justify-between text-gray300">
        <span className="font-normal text-[18px] pc:text-xl">잔여</span>
        <p className="font-bold text-xl pc:text-2xl">
          <span className="text-white">{remainingQuantity}</span>/
          {initialQuantity}
        </p>
      </div>
    </div>
  );
};

export default CardBasicItem;
