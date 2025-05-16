import Link from "next/link";

const CardBasicItem = ({ card, gradeStyles }) => (
  <div className="text-white bg-transparent">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[10px] font-bold text-[18px] pc:text-2xl">
        <p className={gradeStyles[card.cardGrade]}>{card.cardGrade}</p>
        <div className="text-gray400">|</div>
        <p>{card.CardGenre}</p>
      </div>

      {/* 수정 예정 */}
      <Link href="/" className="underline">
        <p className="font-bold text-[18px] pc:text-2xl">{card.nickname}</p>
      </Link>
    </div>
    <hr className="my-[30px] text-gray400" />
    <p className="text-sm mb-2 clamp-description">
      {card.photoDescription || ""}
    </p>
    <hr className="my-[30px] text-gray400" />
    <div className="mb-[10px] flex justify-between">
      <span className="font-normal text-[18px] pc:text-xl text-gray300">
        가격
      </span>
      <p className="font-bold text-xl pc:text-2xl">{card.price}P</p>
    </div>
    <div className="flex justify-between text-gray300">
      <span className="font-normal text-[18px] pc:text-xl">잔여</span>
      <p className="font-bold text-xl pc:text-2xl">
        <span className="text-white">{card.quantityLeft}</span>/
        {card.quantityTotal}
      </p>
    </div>
  </div>
);

export default CardBasicItem;
