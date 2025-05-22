import Link from "next/link";
import { formatCardGrade } from "@/utils/formatCardGrade";

const CardBasicItem = ({ card, gradeStyles }) => (
  <div className="text-white bg-transparent">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[10px] font-bold text-[18px] pc:text-2xl">
        <p className={gradeStyles[card.grade]}>{formatCardGrade(card.grade)}</p>
        <div className="text-gray400">|</div>
        <p className="text-gray300">{card.genre}</p>
      </div>
      <Link href="/" className="underline">
        <p className="font-bold text-[18px] pc:text-2xl">
          {card.sellerNickname}
        </p>
      </Link>
    </div>
    <hr className="my-[30px] text-gray400" />
    <p className="font-normal text-base pc:text-[18px] text-white ">
      {card.description || ""}
    </p>
    <hr className="my-[30px] text-gray400" />
    <div className="mb-[10px] flex justify-between">
      <span className="font-normal text-[18px] pc:text-xl text-gray300">
        가격
      </span>
      <p className="font-bold text-xl pc:text-2xl">
        {card.price.toLocaleString()}P
      </p>
    </div>
    <div className="flex justify-between text-gray300">
      <span className="font-normal text-[18px] pc:text-xl">잔여</span>
      <p className="font-bold text-xl pc:text-2xl">
        <span className="text-white">{card.remainingQuantity}</span>/
        {card.initialQuantity}
      </p>
    </div>
  </div>
);

export default CardBasicItem;
